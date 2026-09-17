import assert from 'node:assert/strict';
import { randomBytes, scryptSync } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const directory = mkdtempSync(path.join(tmpdir(), 'ryukyu-persistence-'));
const salt = randomBytes(16).toString('hex');
const password = randomBytes(20).toString('hex');
const origin = 'http://localhost:3200';
const env = {
  ...process.env,
  APP_URL: origin,
  STORAGE_DRIVER: 'local',
  DATA_DIR: directory,
  ADMIN_USERNAME: 'test-admin',
  ADMIN_PASSWORD_HASH: salt + ':' + scryptSync(password, salt, 64).toString('hex'),
};
let child;
async function start() {
  child = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3200'],
    { env, stdio: 'ignore' },
  );
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error('Server failed');
    try {
      if ((await fetch(origin)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error('Server timed out');
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const p = new Promise((r) => child.once('exit', r));
  child.kill('SIGTERM');
  await p;
}
try {
  await start();
  const login = await fetch(origin + '/api/auth/login', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test-admin', password }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const form = new FormData();
  form.set('title', 'Persistence check');
  form.set('body', 'Still here after restarting');
  form.set('status', 'published');
  form.set(
    'files',
    new Blob(['%PDF-1.4\nDurable attachment\n%%EOF'], { type: 'application/pdf' }),
    'durable.pdf',
  );
  const create = await fetch(origin + '/api/notices', {
    method: 'POST',
    headers: { Origin: origin, Cookie: cookie },
    body: form,
  });
  assert.equal(create.status, 201);
  const { id } = await create.json();
  const html = await (await fetch(origin + '/news/' + id)).text();
  const match = html.match(/\/api\/files\/[a-f0-9-]+\/[a-f0-9-]+/);
  assert.ok(match);
  const before = await (await fetch(origin + match[0])).text();
  await stop();
  await start();
  const page = await fetch(origin + '/news/' + id);
  assert.equal(page.status, 200);
  assert.ok((await page.text()).includes('Still here after restarting'));
  assert.equal(await (await fetch(origin + match[0])).text(), before);
  const dashboard = await fetch(origin + '/admin', {
    headers: { Cookie: cookie },
    redirect: 'manual',
  });
  assert.equal(dashboard.status, 200);
  console.log('PASS: notice, attachment, and administrator session survive server restart.');
} finally {
  await stop();
  rmSync(directory, { recursive: true, force: true });
}
