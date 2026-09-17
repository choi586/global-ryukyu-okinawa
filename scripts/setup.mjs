import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
if (existsSync('.env.local')) {
  console.error('.env.local already exists. Existing credentials were preserved.');
  process.exit(1);
}
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = salt + ':' + scryptSync(password, salt, 64).toString('hex');
writeFileSync(
  '.env.local',
  `APP_URL=http://localhost:3000\nSTORAGE_DRIVER=local\nDATA_DIR=.data\nADMIN_USERNAME=admin\nADMIN_PASSWORD_HASH=${hash}\n`,
  { mode: 0o600 },
);
mkdirSync('.data', { recursive: true, mode: 0o700 });
writeFileSync(
  '.data/ADMIN-LOGIN.txt',
  `로컬 테스트 관리자\n주소: http://localhost:3000/admin/login\n아이디: admin\n비밀번호: ${password}\n\n이 파일은 GitHub에 올라가지 않습니다. 배포 시 비밀번호를 새로 설정하세요.\n`,
  { mode: 0o600 },
);
console.log('Local configuration created. Administrator credentials: .data/ADMIN-LOGIN.txt');
