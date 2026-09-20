import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Fail closed before deployment if a stale build targets another Worker or storage.
for (const file of ['wrangler.jsonc', 'dist/server/wrangler.json']) {
  const { config, error } = ts.parseConfigFileTextToJson(file, readFileSync(file, 'utf8'));
  assert.ok(!error, `Invalid configuration: ${file}`);
  assert.equal(config.name, 'khu', `${file}: Worker must remain khu`);
  assert.equal(config.account_id, '406d28b27c2398f3ef1f36aed7ba0714');
  assert.equal(config.vars?.APP_URL, 'https://khu.ryukyu-okinawa.workers.dev');
  assert.equal(config.d1_databases?.length, 1);
  assert.equal(config.d1_databases[0].binding, 'DB');
  assert.equal(config.d1_databases[0].database_id, '93aa30c7-901b-4d11-b379-2e5cf38f2cfb');
  assert.equal(config.d1_databases[0].database_name, 'global-ryukyu-okinawa');
  assert.equal(config.r2_buckets?.length, 1);
  assert.equal(config.r2_buckets[0].binding, 'MEDIA');
  assert.equal(config.r2_buckets[0].bucket_name, 'global-ryukyu-okinawa-media');
}
for (const file of ['dist/server/framework.js', 'dist/server/public-list.js', 'dist/client/news.html', 'dist/client/news.rsc']) {
  assert.ok(existsSync(file), `Missing optimized build: ${file}. Run pnpm build:vinext first.`);
}
console.log('Deployment target verified: khu → existing D1 + existing R2.');
