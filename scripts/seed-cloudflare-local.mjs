import wrangler from 'wrangler';
const { getPlatformProxy } = wrangler;
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
const proxy = await getPlatformProxy({
  configPath: 'wrangler.jsonc',
  envFiles: [],
  remoteBindings: false,
});
try {
  const schema = await readFile('cloudflare/schema.sql', 'utf8');
  for (const sql of schema.split(';').filter((q) => q.trim()))
    await proxy.env.DB.prepare(sql).run();
  const local = new DatabaseSync('.data/institute.sqlite', { readOnly: true });
  const rows = local
    .prepare("SELECT namespace,id,data FROM records WHERE namespace IN ('notices','carousel')")
    .all();
  for (const row of rows)
    await proxy.env.DB.prepare('INSERT OR IGNORE INTO records VALUES (?,?,?)')
      .bind(row.namespace, row.id, row.data)
      .run();
  local.close();
  const manifest = JSON.parse(await readFile('.data/cloudflare-export/manifest.json', 'utf8'));
  for (const file of manifest.files)
    await proxy.env.MEDIA.put(file.key, await readFile('.data/cloudflare-export/r2/' + file.key), {
      httpMetadata: { contentType: file.contentType },
      storageClass: 'Standard',
    });
  let cursor;
  do {
    const listing = await proxy.env.MEDIA.list({ cursor });
    for (const file of listing.objects)
      await proxy.env.DB.prepare('INSERT OR IGNORE INTO media_usage VALUES (?,?)')
        .bind(file.key, file.size)
        .run();
    cursor = listing.truncated ? listing.cursor : undefined;
  } while (cursor);
  await proxy.env.DB.prepare('INSERT OR REPLACE INTO media_policy VALUES (1,1)').run();
  console.log('Local D1/R2 prepared:', rows.length, 'records;', manifest.files.length, 'files');
} finally {
  await proxy.dispose();
}
