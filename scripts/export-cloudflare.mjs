import { DatabaseSync } from 'node:sqlite';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Produce a portable package, without sending data or creating cloud resources.
const data = path.resolve(process.env.DATA_DIR || '.data');
const output = path.join(data, 'cloudflare-export');
const db = new DatabaseSync(path.join(data, 'institute.sqlite'), { readOnly: true });
const rows = db
  .prepare(
    "SELECT namespace,id,data FROM records WHERE namespace IN ('notices','carousel') ORDER BY namespace,id",
  )
  .all();
await mkdir(path.join(output, 'r2'), { recursive: true });
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sql = [await readFile(new URL('../cloudflare/schema.sql', import.meta.url), 'utf8')];
const manifest = {
  posts: rows.filter((r) => r.namespace === 'notices').length,
  carouselSlides: 0,
  files: [],
};
const seen = new Set();
for (const row of rows) {
  const post = JSON.parse(row.data);
  // Plain INSERT fails on a duplicate: never overwrite online edits during an import.
  sql.push(
    `INSERT INTO records(namespace,id,data) VALUES (${quote(row.namespace)},${quote(row.id)},${quote(row.data)});`,
  );
  const attachments =
    row.namespace === 'carousel' ? post.slides.map((s) => s.image) : post.attachments;
  if (row.namespace === 'carousel') manifest.carouselSlides += post.slides.length;
  for (const attachment of attachments) {
    const files = [
      { ...attachment, parentId: row.namespace + ':' + row.id },
      ...(attachment.thumbnail
        ? [{ ...attachment.thumbnail, type: 'image/webp', parentId: row.namespace + ':' + row.id }]
        : []),
    ];
    for (const file of files) {
      if (!/^[0-9a-f-]{36}$/.test(file.id)) throw new Error('Invalid file ID');
      if (seen.has(file.id)) continue;
      seen.add(file.id);
      const source = path.join(data, 'uploads', file.id);
      const bytes = await readFile(source);
      if (bytes.length !== file.size) throw new Error(`Size mismatch: ${file.id}`);
      await copyFile(source, path.join(output, 'r2', file.id));
      manifest.files.push({
        key: file.id,
        contentType: file.type,
        size: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        parentId: file.parentId,
      });
    }
  }
}
db.close();
await writeFile(path.join(output, 'd1.sql'), sql.join('\n'), { mode: 0o600 });
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2), {
  mode: 0o600,
});
console.log(
  `Cloudflare 이전 자료: 게시글 ${manifest.posts}건, 캐러셀 ${manifest.carouselSlides}장, 파일 ${manifest.files.length}개. 로그인 세션과 비밀번호는 제외했습니다.`,
);
console.log(output);
