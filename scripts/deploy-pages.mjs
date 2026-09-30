import { mkdtemp, cp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = process.cwd();
const config = JSON.parse(await readFile('pages/wrangler.jsonc', 'utf8'));
assert.equal(config.name, 'khu-okinawa');
assert.equal(config.services?.[0]?.service, 'khu');
assert.equal(config.d1_databases, undefined);
assert.equal(config.r2_buckets, undefined);
// Isolate Pages CLI from vinext's generated Worker deployment redirect config.
const stage = await mkdtemp(path.join(tmpdir(), 'institute-pages-'));
try {
  await cp('pages', stage, { recursive: true });
  const result = spawnSync(process.execPath, [
    path.join(root, 'node_modules/wrangler/bin/wrangler.js'), 'pages', 'deploy', 'public',
    '--project-name', 'khu-okinawa', '--branch', 'main',
  ], { cwd: stage, stdio: 'inherit', env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: '406d28b27c2398f3ef1f36aed7ba0714' } });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally { await rm(stage, { recursive: true, force: true }); }
