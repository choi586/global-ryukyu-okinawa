import { DatabaseSync } from 'node:sqlite';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const directory = path.resolve(process.env.DATA_DIR || '.data');
const db = new DatabaseSync(path.join(directory, 'institute.sqlite'), { readOnly: true });
const notices = db
  .prepare("SELECT data FROM records WHERE namespace='notices' ORDER BY id")
  .all()
  .map((row) => JSON.parse(row.data));
db.close();
const files = new Map();
for (const notice of notices) {
  for (const file of notice.attachments) {
    if (!/^[a-f0-9-]{36}$/.test(file.id)) throw Error('Invalid attachment identifier.');
    files.set(file.id, {
      ...file,
      bytes: await readFile(path.join(directory, 'uploads', file.id)),
    });
  }
}
await mkdir(path.join(directory, 'migration'), { recursive: true, mode: 0o700 });
await writeFile(
  path.join(directory, 'migration', 'notices.json'),
  JSON.stringify(notices, null, 2),
  { mode: 0o600 },
);
if (dryRun) {
  console.log(
    `Ready to migrate: ${notices.length} notices, ${files.size} attachments. No remote writes performed.`,
  );
  process.exit(0);
}
const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'notice-files';
if (!url || !key) throw Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
async function request(route, options = {}) {
  return fetch(`${url}${route}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...options.headers },
  });
}
async function checked(route, options) {
  const response = await request(route, options);
  if (!response.ok) throw Error(`Migration request failed (${response.status}).`);
  return response;
}
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
for (const notice of notices) {
  const route = `/rest/v1/records?namespace=eq.notices&id=eq.${encodeURIComponent(notice.id)}&select=data`;
  const existing = await (await checked(route)).json();
  if (existing.length) {
    if (!isDeepStrictEqual(existing[0].data, notice))
      throw Error(`Remote notice ${notice.id} differs; refusing to overwrite it.`);
    console.log(`Already migrated: ${notice.id}`);
    continue;
  }
  for (const attachment of notice.attachments) {
    const file = files.get(attachment.id);
    const storageRoute = `/storage/v1/object/${encodeURIComponent(bucket)}/${file.id}`;
    const upload = await request(storageRoute, {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
      body: file.bytes,
    });
    if (!upload.ok) {
      // Retry safely after a partial run, but never overwrite another file.
      const remote = await checked(storageRoute);
      if (hash(Buffer.from(await remote.arrayBuffer())) !== hash(file.bytes))
        throw Error(`Remote file ${file.id} differs; refusing to overwrite it.`);
    }
  }
  await checked('/rest/v1/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ namespace: 'notices', id: notice.id, data: notice }),
  });
  const saved = await (await checked(route)).json();
  if (
    saved[0]?.data.title !== notice.title ||
    saved[0]?.data.body !== notice.body ||
    saved[0]?.data.status !== notice.status
  )
    throw Error('Remote verification failed.');
  console.log(`Migrated: ${notice.id}`);
}
console.log('Migration complete. Local records and files were preserved.');
