import 'server-only';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';
import type { Notice } from './types';

function remote() {
  if (process.env.VERCEL && process.env.STORAGE_DRIVER !== 'supabase')
    throw new Error('Vercel에서는 Supabase 저장소 설정이 필요합니다.');
  return process.env.STORAGE_DRIVER === 'supabase';
}
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
async function service(route: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('온라인 저장소 연결 설정이 필요합니다.');
  const response = await fetch(`${url.replace(/\/$/, '')}${route}`, {
    ...init,
    cache: 'no-store',
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...init.headers },
  });
  if (!response.ok) throw new Error(`저장소 요청에 실패했습니다 (${response.status}).`);
  return response;
}
export async function getRecord<T>(namespace: string, id: string): Promise<T | null> {
  if (remote()) {
    const rows = await (
      await service(
        `/rest/v1/records?namespace=eq.${encodeURIComponent(namespace)}&id=eq.${encodeURIComponent(id)}&select=data`,
      )
    ).json();
    return rows[0]?.data ?? null;
  }
  const row = (await db())
    .prepare('SELECT data FROM records WHERE namespace=? AND id=?')
    .get(namespace, id) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}
export async function putRecord(namespace: string, id: string, data: unknown) {
  if (remote()) {
    await service('/rest/v1/records?on_conflict=namespace,id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ namespace, id, data }),
    });
  } else
    (await db())
      .prepare(
        'INSERT INTO records VALUES (?,?,?) ON CONFLICT(namespace,id) DO UPDATE SET data=excluded.data',
      )
      .run(namespace, id, JSON.stringify(data));
}
export async function removeRecord(namespace: string, id: string) {
  if (remote())
    await service(
      `/rest/v1/records?namespace=eq.${encodeURIComponent(namespace)}&id=eq.${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    );
  else (await db()).prepare('DELETE FROM records WHERE namespace=? AND id=?').run(namespace, id);
}
export async function allNotices(): Promise<Notice[]> {
  let notices: Notice[];
  if (remote()) {
    notices = [];
    for (let offset = 0; ; offset += 500) {
      const rows = await (
        await service(
          `/rest/v1/records?namespace=eq.notices&select=data&order=id&limit=500&offset=${offset}`,
        )
      ).json();
      notices.push(...rows.map((r: { data: Notice }) => r.data));
      if (rows.length < 500) break;
    }
  } else
    notices = (await db())
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
export async function publicNotices() {
  return (await allNotices()).filter((n) => n.status === 'published');
}
export async function consumeLoginAttempt() {
  const bucket = String(Math.floor(Date.now() / 900000));
  if (remote())
    return Number(
      await (
        await service('/rest/v1/rpc/consume_login_attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bucket }),
        })
      ).json(),
    );
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
  if (remote())
    await service(
      `/storage/v1/object/${process.env.SUPABASE_STORAGE_BUCKET || 'notice-files'}/${id}`,
      { method: 'POST', headers: { 'Content-Type': type }, body: new Uint8Array(bytes) },
    );
  else {
    await mkdir(path.join(dataDirectory(), 'uploads'), { recursive: true });
    await writeFile(path.join(dataDirectory(), 'uploads', id), bytes, { mode: 0o600 });
  }
}
export async function loadFile(id: string) {
  if (remote())
    return Buffer.from(
      await (
        await service(
          `/storage/v1/object/${process.env.SUPABASE_STORAGE_BUCKET || 'notice-files'}/${id}`,
        )
      ).arrayBuffer(),
    );
  return readFile(path.join(dataDirectory(), 'uploads', id));
}
export async function deleteFile(id: string) {
  if (remote())
    await service(`/storage/v1/object/${process.env.SUPABASE_STORAGE_BUCKET || 'notice-files'}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: [id] }),
    });
  else
    await unlink(path.join(dataDirectory(), 'uploads', id)).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error;
      },
    );
}
