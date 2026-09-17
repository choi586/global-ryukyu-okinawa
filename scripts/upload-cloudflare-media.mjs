import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
const root = path.resolve('.data/cloudflare-export');
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const progressFile = path.join(root, 'uploaded-r2.json');
const progress = JSON.parse(await readFile(progressFile, 'utf8').catch(() => '{}'));
const bucket = 'global-ryukyu-okinawa-media';
let index = 0,
  done = 0;
async function upload(file) {
  const source = path.join(root, 'r2', file.key);
  if (
    createHash('sha256')
      .update(await readFile(source))
      .digest('hex') !== file.sha256
  )
    throw Error('Local hash mismatch');
  if (progress[file.key] === file.sha256) return;
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        'node_modules/wrangler/bin/wrangler.js',
        'r2',
        'object',
        'put',
        `${bucket}/${file.key}`,
        '--file',
        source,
        '--content-type',
        file.contentType,
        '--remote',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let output = '';
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(Error(output.slice(-1800)))));
  });
  progress[file.key] = file.sha256;
}
let failure;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (index < manifest.files.length && !failure) {
      const file = manifest.files[index++];
      try {
        await upload(file);
        done++;
        if (done % 20 === 0) console.log(`R2 uploaded ${done}/${manifest.files.length}`);
      } catch (error) {
        failure = error;
      }
    }
  }),
);
await writeFile(progressFile, JSON.stringify(progress, null, 2));
if (failure) throw failure;
console.log(`R2 upload complete: ${done} files`);
