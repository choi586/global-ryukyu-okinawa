import 'server-only';
import { cloudflareBindings } from './cloudflare-storage';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import { InputError, MAX_FILE_BYTES, MAX_STORAGE_BYTES } from './upload-policy';
import { mediaSchema, reserveMediaSql } from './media-quota';
import {
  countPublicSql,
  publicListSql,
  newsListSql,
  pageNumber,
  type NoticeSummary,
} from './public-list';
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
  connection.exec(mediaSchema);
  if (!connection.prepare('SELECT id FROM media_policy WHERE id=1').get()) {
    const folder = path.join(dataDirectory(), 'uploads');
    mkdirSync(folder, { recursive: true });
    connection.exec('BEGIN IMMEDIATE');
    try {
      for (const id of readdirSync(folder)) {
        const stat = statSync(path.join(folder, id));
        if (stat.isFile())
          connection.prepare('INSERT OR IGNORE INTO media_usage VALUES (?,?)').run(id, stat.size);
      }
      connection.prepare('INSERT OR IGNORE INTO media_policy VALUES (1,1)').run();
      connection.exec('COMMIT');
    } catch (error) {
      connection.exec('ROLLBACK');
      throw error;
    }
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
export async function saveFile(id: string, bytes: Buffer, type: string) {
  if (bytes.length > MAX_FILE_BYTES) throw new InputError('파일 하나는 3MB 이하여야 합니다.');
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(type))
    throw new InputError('JPG, PNG, WEBP 이미지와 PDF 파일만 업로드할 수 있습니다.');
  const cloud = await cloudflareBindings();
  const values = [id, bytes.length, bytes.length, MAX_STORAGE_BYTES];
  const reserved = cloud
    ? await cloud.DB.prepare(reserveMediaSql)
        .bind(...values)
        .first<{ id: string }>()
    : (await db()).prepare(reserveMediaSql).get(id, bytes.length, bytes.length, MAX_STORAGE_BYTES);
  if (!reserved)
    throw new InputError(
      '전체 저장 한도 5GB를 초과하거나 저장량 확인이 필요해 업로드할 수 없습니다. 불필요한 파일을 삭제한 뒤 다시 시도해주세요.',
    );
  // Keep the reservation on ambiguous storage failures: never undercount a possibly saved file.
  if (cloud) {
    await cloud.MEDIA.put(id, new Uint8Array(bytes), {
      httpMetadata: { contentType: type },
      storageClass: 'Standard',
    });
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
    await cloud.DB.prepare('DELETE FROM media_usage WHERE id=?').bind(id).run();
    return;
  }
  await unlink(path.join(dataDirectory(), 'uploads', id)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
  });
  (await db()).prepare('DELETE FROM media_usage WHERE id=?').run(id);
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

export async function publicPage(category: Category, requested: unknown = 1, size = 10) {
  const cloud = await cloudflareBindings();
  const sql = cloud ? cloud.DB : await db();
  const total = cloud
    ? (await cloud.DB.prepare(countPublicSql).bind(category).first<{ total: number }>())!.total
    : Number((sql as DatabaseSync).prepare(countPublicSql).get(category)?.total);
  const pages = Math.max(1, Math.ceil(total / size));
  const page = pageNumber(requested, pages);
  const query = category === 'news' ? newsListSql : publicListSql;
  const rows = cloud
    ? (
        await cloud.DB.prepare(query)
          .bind(category, size, (page - 1) * size)
          .all<Record<string, unknown>>()
      ).results
    : (sql as DatabaseSync).prepare(query).all(category, size, (page - 1) * size);
  const notices = rows.map((row) => ({
    ...row,
    pinned: Boolean(row.pinned),
    picture: row.picture ? JSON.parse(String(row.picture)) : null,
  })) as NoticeSummary[];
  return { notices, total, page, pages };
}
export async function publicNoticeBySlug(slug: string): Promise<Notice | null> {
  const query =
    "SELECT data FROM records WHERE namespace='notices' AND json_extract(data,'$.status')='published' AND json_extract(data,'$.slug')=? LIMIT 1";
  const cloud = await cloudflareBindings();
  const row = cloud
    ? await cloud.DB.prepare(query).bind(slug).first<{ data: string }>()
    : (await db()).prepare(query).get(slug);
  return row ? JSON.parse(String(row.data)) : null;
}
