import { randomBytes, scryptSync } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const salt = randomBytes(16).toString('hex');
const directory = mkdtempSync(path.join(tmpdir(), 'ryukyu-e2e-'));
const child = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3100'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      APP_URL: 'http://localhost:3100',
      STORAGE_DRIVER: 'local',
      DATA_DIR: directory,
      ADMIN_USERNAME: 'test-admin',
      ADMIN_PASSWORD_HASH: salt + ':' + scryptSync('test-only-password', salt, 64).toString('hex'),
    },
  },
);
function stop() {
  child.kill('SIGTERM');
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
child.on('exit', (code) => {
  rmSync(directory, { recursive: true, force: true });
  process.exit(code || 0);
});
