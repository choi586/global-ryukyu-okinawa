import { cp, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
const root = path.dirname(require.resolve('pdfjs-dist/package.json'));
const target = 'public/vendor/pdfjs';
await mkdir(target, { recursive: true });
await cp(path.join(root, 'build/pdf.worker.min.mjs'), path.join(target, 'pdf.worker.min.mjs'));
for (const folder of ['cmaps', 'standard_fonts', 'wasm'])
  await cp(path.join(root, folder), path.join(target, folder), { recursive: true });
await cp(path.join(root, 'LICENSE'), path.join(target, 'LICENSE'));
