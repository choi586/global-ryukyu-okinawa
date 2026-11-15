// Next.js writes the export to out/ with URLs that already start with
// /consortium. Hosting must therefore serve it from a /consortium folder, so
// this moves the export to dist/consortium and sends the bare host there.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('out', 'dist/consortium', { recursive: true });
await writeFile('dist/_redirects', '/ /consortium/ 302\n');
console.log('Staged static site at dist/consortium (deploy the dist folder).');
