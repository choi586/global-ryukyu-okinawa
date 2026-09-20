// Render only public, data-independent pages using the real local Workers runtime.
// This never uploads files or writes to remote D1/R2.
import { spawn } from 'node:child_process';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import ts from 'typescript';
const base = 'http://127.0.0.1:8799';
try {
  await fetch(base);
  throw Error('Static render port 8799 is already in use');
} catch (e) {
  if (e.message.includes('already in use')) throw e;
}
const server = spawn(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'dev',
    '--config',
    'dist/server/wrangler.json',
    '--port',
    '8799',
    '--ip',
    '127.0.0.1',
    '--log-level',
    'error',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);
let output = '';
server.stdout.on('data', (v) => (output += v));
server.stderr.on('data', (v) => (output += v));
try {
  let ready = false;
  for (let n = 0; n < 100; n++) {
    if (server.exitCode !== null) throw Error(output);
    try {
      const r = await fetch(base + '/news');
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!ready) throw Error('Local static renderer did not start: ' + output);
  await mkdir('dist/client/ja', { recursive: true });
  for (const route of ['news', 'about', 'people', 'ja/news', 'ja/about', 'ja/people']) {
    for (const rsc of [false, true]) {
      const r = await fetch(base + '/' + route, { headers: rsc ? { RSC: '1' } : {} });
      if (!r.ok) throw Error(`Prerender ${route}: ${r.status}`);
      const body = await r.text();
      if (!rsc && !body.includes('<html')) throw Error('Missing static HTML');
      if (rsc && !r.headers.get('content-type')?.includes('text/x-component'))
        throw Error('Missing RSC response');
      await writeFile(`dist/client/${route}.${rsc ? 'rsc' : 'html'}`, body);
    }
  }
} finally {
  server.kill('SIGTERM');
  await new Promise((r) => server.once('exit', r));
}
await rename('dist/server/index.js', 'dist/server/framework.js');
for (const [input, output] of [
  ['src/lib/public-list.ts', 'dist/server/public-list.js'],
  ['cloudflare/worker.ts', 'dist/server/index.js'],
]) {
  const source = (await readFile(input, 'utf8')).replace(
    '../src/lib/public-list',
    './public-list.js',
  );
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  await writeFile(output, result.outputText);
}
console.log('Static news/about/people HTML and RSC prepared; lightweight public API installed.');
