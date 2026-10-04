import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { getRecord, putRecord, removeRecord, replaceVersionedRecord } from './store';
const cookieName = 'institute_admin';
const digest = (s: string) => createHash('sha256').update(s).digest('hex');
export function configured() {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_USERNAME && process.env.APP_URL,
  );
}
type Credential = { hash: string; revision: number };
async function credential(): Promise<Credential> {
  return (await getRecord<Credential>('admin-auth', 'password')) || {
    hash: process.env.ADMIN_PASSWORD_HASH || '', revision: 0,
  };
}
function matches(password: string, encoded: string) {
  const [salt, hash] = encoded.split(':');
  if (!salt || !hash || password.length > 256) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export async function verifiedPasswordHash(username: string, password: string) {
  if (username !== process.env.ADMIN_USERNAME) return null;
  const current = await credential();
  return matches(password, current.hash) ? current.hash : null;
}
export async function changePassword(currentPassword: string, nextPassword: string) {
  const current = await credential();
  if (!matches(currentPassword, current.hash)) return 'incorrect';
  if (currentPassword === nextPassword) return 'unchanged';
  const salt = randomBytes(16).toString('hex');
  const hash = salt + ':' + scryptSync(nextPassword, salt, 64).toString('hex');
  const saved = await replaceVersionedRecord('admin-auth', 'password', current.revision, {
    hash, revision: current.revision + 1,
  });
  if (!saved) return 'conflict';
  // All session versions become invalid immediately, on both public hostnames.
  (await cookies()).delete(cookieName);
  return 'changed';
}
export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const session = await getRecord<{ expires: number; version: string }>('sessions', digest(token));
  return (
    !!session &&
    session.expires > Date.now() &&
    session.version === digest((await credential()).hash)
  );
}
export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}
export async function createSession(verifiedHash: string) {
  const token = randomBytes(32).toString('hex');
  await putRecord('sessions', digest(token), {
    expires: Date.now() + 8 * 60 * 60 * 1000,
    version: digest(verifiedHash),
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
