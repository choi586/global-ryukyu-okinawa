import { test } from 'node:test';
import assert from 'node:assert/strict';
import proxy from './public/_worker.js';
const host = 'https://khu-okinawa.pages.dev';
test('forwards path, query and body; validates origin and rewrites backend redirect', async () => {
  const env = { INSTITUTE: { async fetch(r) {
    assert.equal(r.url, 'https://khu.ryukyu-okinawa.workers.dev/api/notices?q=1');
    assert.equal(r.headers.get('Origin'), 'https://khu.ryukyu-okinawa.workers.dev');
    assert.equal(r.headers.get('X-Forwarded-Host'), null);
    assert.equal(await r.text(), 'example');
    return new Response(null, { status: 302, headers: { Location: 'https://khu.ryukyu-okinawa.workers.dev/admin', 'Set-Cookie': 'institute_admin=test; Secure; HttpOnly; Path=/; SameSite=Strict' } });
  } } };
  const result = await proxy.fetch(new Request(host+'/api/notices?q=1', { method: 'POST', headers: { Origin: host, 'X-Forwarded-Host': 'evil.invalid' }, body:'example' }), env);
  assert.equal(result.headers.get('Location'), host+'/admin');
  assert.match(result.headers.get('Set-Cookie'), /Secure; HttpOnly/);
});
test('cross-site and missing-origin writes never reach the backend', async () => {
  const env = { INSTITUTE: { fetch() { throw Error('must not forward'); } } };
  for (const headers of [{Origin:'https://evil.invalid'},{}]) assert.equal((await proxy.fetch(new Request(host+'/api/notices', {method:'POST',headers}),env)).status,403);
});
test('streams public responses without rewriting content or external redirects', async () => {
  const result = await proxy.fetch(new Request(host+'/ja/news'), { INSTITUTE: { fetch: async () => new Response('日本語',{headers:{'Content-Type':'text/html','Location':'https://www.khu.ac.kr/'}}) } });
  assert.equal(await result.text(),'日本語');assert.equal(result.headers.get('Location'),'https://www.khu.ac.kr/');
});
test('consortium paths go to the consortium site, never to the institute backend', async () => {
  const env = { INSTITUTE: { fetch() { throw Error('must not reach the institute'); } } };
  const original = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push([String(url), init.method, init.headers.get('Cookie'), init.headers.get('Range')]);
    if (String(url).endsWith('/consortium/old')) return new Response(null, { status: 301, headers: { Location: '/consortium/' } });
    return new Response('consortium', { headers: { 'Content-Type': 'text/html' } });
  };
  try {
    const page = await proxy.fetch(new Request(host + '/consortium/?a=1', { headers: { Cookie: 'institute_admin=secret', Range: 'bytes=0-1' } }), env);
    assert.equal(await page.text(), 'consortium');
    assert.deepEqual(seen[0], ['https://social-connectedness-consortium.pages.dev/consortium/?a=1', 'GET', null, 'bytes=0-1']);
    const bare = await proxy.fetch(new Request(host + '/consortium'), env);
    assert.equal(bare.status, 308);
    assert.equal(bare.headers.get('Location'), host + '/consortium/');
    const moved = await proxy.fetch(new Request(host + '/consortium/old'), env);
    assert.equal(moved.headers.get('Location'), host + '/consortium/');
    assert.equal((await proxy.fetch(new Request(host + '/consortium/', { method: 'POST', headers: { Origin: host } }), env)).status, 405);
    assert.equal(seen.length, 2);
  } finally { globalThis.fetch = original; }
});
test('paths that only start with the word consortium still go to the institute', async () => {
  const result = await proxy.fetch(new Request(host + '/consortium-news'), { INSTITUTE: { fetch: async (r) => new Response(new URL(r.url).pathname) } });
  assert.equal(await result.text(), '/consortium-news');
});
