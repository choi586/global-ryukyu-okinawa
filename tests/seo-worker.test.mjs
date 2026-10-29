import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
const source = (await readFile('cloudflare/worker.ts', 'utf8')).replace(/^import .*;\n/gm, '');
const code = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { default: worker } = await import(
  'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
);
const queries = [];
const env = {
  DB: {
    prepare(sql) {
      queries.push(sql);
      return {
        bind(offset) {
          assert.equal(offset, 200);
          return this;
        },
        async first() {
          return { total: 201 };
        },
        async all() {
          return { results: [{ slug: '한글 & 책', category: 'publications' }] };
        },
      };
    },
  },
};
const get = (path, method = 'GET') =>
  worker.fetch(new Request('https://khu-okinawa.pages.dev' + path, { method }), env, {});
test('public crawling enabled; private paths excluded; official sitemap advertised', async () => {
  const text = await (await get('/robots.txt')).text();
  assert.match(text, /Allow: \/\n/);
  assert.match(text, /Disallow: \/admin/);
  assert.match(text, /Disallow: \/api\//);
  assert.match(text, /https:\/\/okinawa.khu.ac.kr\/sitemap.xml/);
});
test('sitemap index splits post batches and exposes both public languages', async () => {
  const index = await (await get('/sitemap.xml')).text();
  assert.match(index, /posts-2.xml/);
  assert.doesNotMatch(index, /posts-3.xml/);
  const pages = await (await get('/sitemaps/pages.xml')).text();
  assert.match(pages, /https:\/\/okinawa.khu.ac.kr\/ja\/about/);
  assert.doesNotMatch(pages, /admin|api\//);
  const posts = await (await get('/sitemaps/posts-2.xml')).text();
  assert.match(posts, /\/ja\/publications\//);
  assert.match(posts, /%26/);
  assert.ok(queries.every((q) => q.includes("'published'")));
  assert.ok(queries.some((q) => q.includes('LIMIT 200 OFFSET ?')));
});
test('HEAD discovery response has no body', async () => {
  assert.equal(await (await get('/sitemaps/pages.xml', 'HEAD')).text(), '');
});
