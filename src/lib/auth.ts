import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { getRecord, putRecord, removeRecord } from './store';
const cookieName = 'institute_admin';
const digest = (s: string) => createHash('sha256').update(s).digest('hex');
export function configured() {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_USERNAME && process.env.APP_URL,
  );
}
export function validPassword(username: string, password: string) {
  const [salt, hash] = (process.env.ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !hash || password.length > 256) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected) &&
    username === process.env.ADMIN_USERNAME
  );
}
export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const session = await getRecord<{ expires: number; version: string }>('sessions', digest(token));
  return (
    !!session &&
    session.expires > Date.now() &&
    session.version === digest(process.env.ADMIN_PASSWORD_HASH || '')
  );
}
export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}
export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await putRecord('sessions', digest(token), {
    expires: Date.now() + 8 * 60 * 60 * 1000,
    version: digest(process.env.ADMIN_PASSWORD_HASH || ''),
  });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.APP_URL?.startsWith('https://') ?? false,
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
}
export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await removeRecord('sessions', digest(token));
  jar.delete(cookieName);
}
export function sameOrigin(request: Request) {
  const configuredOrigin = process.env.APP_URL;
  return !!configuredOrigin && request.headers.get('origin') === new URL(configuredOrigin).origin;
}
