import 'server-only';
import { cloudflareBindings } from './cloudflare-storage';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import type { Category, Notice } from './types';

export function dataDirectory() {
  return path.resolve(process.env.DATA_DIR || '.data');
}
let connection: DatabaseSync | undefined;
async function db() {
  if (!connection) {
    const { DatabaseSync } = await import('node:sqlite');
    mkdirSync(dataDirectory(), { recursive: true, mode: 0o700 });
    connection = new DatabaseSync(path.join(dataDirectory(), 'institute.sqlite'));
    connection.exec(
      `PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS records (namespace TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(namespace,id)); CREATE TABLE IF NOT EXISTS login_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL);`,
    );
  }
  return connection;
}
export async function getRecord<T>(namespace: string, id: string): Promise<T | null> {
  const cloud = await cloudflareBindings();
  if (cloud) {
    const row = await cloud.DB.prepare('SELECT data FROM records WHERE namespace=? AND id=?')
      .bind(namespace, id)
      .first<{ data: string }>();
    return row ? JSON.parse(row.data) : null;
  }
  const row = (await db())
    .prepare('SELECT data FROM records WHERE namespace=? AND id=?')
    .get(namespace, id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}
export async function putRecord(namespace: string, id: string, data: unknown) {
  const cloud = await cloudflareBindings();
  if (cloud) {
    await cloud.DB.prepare(
      'INSERT INTO records VALUES (?,?,?) ON CONFLICT(namespace,id) DO UPDATE SET data=excluded.data',
    )
      .bind(namespace, id, JSON.stringify(data))
      .run();
    return;
  }
  (await db())
    .prepare(
      'INSERT INTO records VALUES (?,?,?) ON CONFLICT(namespace,id) DO UPDATE SET data=excluded.data',
    )
    .run(namespace, id, JSON.stringify(data));
}
export async function removeRecord(namespace: string, id: string) {
  const cloud = await cloudflareBindings();
  if (cloud) {
    await cloud.DB.prepare('DELETE FROM records WHERE namespace=? AND id=?')
      .bind(namespace, id)
      .run();
    return;
  }
  (await db()).prepare('DELETE FROM records WHERE namespace=? AND id=?').run(namespace, id);
}
export async function allNotices(): Promise<Notice[]> {
  const cloud = await cloudflareBindings();
  const notices: Notice[] = cloud
    ? (
        await cloud.DB.prepare("SELECT data FROM records WHERE namespace='notices'").all<{
          data: string;
        }>()
      ).results.map((r) => JSON.parse(r.data))
    : (await db())
        .prepare("SELECT data FROM records WHERE namespace='notices'")
        .all()
        .map((r) => JSON.parse(r.data as string));
  return notices.sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.publishedAt.localeCompare(a.publishedAt) ||
      b.id.localeCompare(a.id),
  );
}
export async function publicNotices(category?: Category) {
  return (await allNotices()).filter(
    (n) => n.status === 'published' && (!category || (n.category || 'news') === category),
  );
}
export async function consumeLoginAttempt() {
  const bucket = String(Math.floor(Date.now() / 900000));
  const cloud = await cloudflareBindings();
  if (cloud) {
    await cloud.DB.prepare('DELETE FROM login_limits WHERE id<>?').bind(bucket).run();
    const row = await cloud.DB.prepare(
      'INSERT INTO login_limits VALUES (?,1) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count',
    )
      .bind(bucket)
      .first<{ count: number }>();
    return Number(row?.count || 0);
  }
  const sql = await db();
  sql.prepare('DELETE FROM login_limits WHERE id<>?').run(bucket);
  return Number(
    (
      sql
        .prepare(
          'INSERT INTO login_limits VALUES (?,1) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count',
        )
        .get(bucket) as { count: number }
    ).count,
  );
}
export async function saveFile(id: string, bytes: Buffer, _type: string) {
  const cloud = await cloudflareBindings();
  if (cloud) {
    await cloud.MEDIA.put(id, new Uint8Array(bytes), { httpMetadata: { contentType: _type } });
    return;
  }
  await mkdir(path.join(dataDirectory(), 'uploads'), { recursive: true });
  await writeFile(path.join(dataDirectory(), 'uploads', id), bytes, { mode: 0o600 });
}
export async function loadFile(id: string) {
  const cloud = await cloudflareBindings();
  if (cloud) {
    const file = await cloud.MEDIA.get(id);
    if (!file) throw new Error('File not found');
    return Buffer.from(await file.arrayBuffer());
  }
  return readFile(path.join(dataDirectory(), 'uploads', id));
}
export async function deleteFile(id: string) {
  const cloud = await cloudflareBindings();
  if (cloud) {
    await cloud.MEDIA.delete(id);
    return;
  }
  await unlink(path.join(dataDirectory(), 'uploads', id)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
  });
}

// A revision check makes a whole carousel update atomic, including its order.
export async function replaceVersionedRecord(
  namespace: string,
  id: string,
  expectedRevision: number,
  data: unknown,
) {
  const cloud = await cloudflareBindings();
  const sql =
    expectedRevision === 0
      ? 'INSERT INTO records(namespace,id,data) VALUES (?,?,?) ON CONFLICT(namespace,id) DO NOTHING'
      : "UPDATE records SET data=? WHERE namespace=? AND id=? AND json_extract(data,'$.revision')=?";
  const values =
    expectedRevision === 0
      ? [namespace, id, JSON.stringify(data)]
      : [JSON.stringify(data), namespace, id, expectedRevision];
  if (cloud)
    return (
      (
        await cloud.DB.prepare(sql)
          .bind(...values)
          .run()
      ).meta.changes === 1
    );
  return (await db()).prepare(sql).run(...values).changes === 1;
}
