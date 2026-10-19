import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
const origin = 'http://localhost:3100';
function pdf(text: string) {
  const stream = `BT /F1 24 Tf 50 730 Td (${text}) Tj ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let body = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(body));
    body += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body +=
    `xref\n0 6\n0000000000 65535 f \n` +
    offsets
      .slice(1)
      .map((x) => String(x).padStart(10, '0') + ' 00000 n \n')
      .join('') +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(body);
}
test('PDF upload generates preview and replacement refreshes it, missing previews are repaired on save', async ({
  page,
}) => {
  expect(
    (
      await page.request.post('/api/auth/login', {
        headers: { Origin: origin },
        data: { username: 'test-admin', password: 'test-only-password' },
      })
    ).ok(),
  ).toBeTruthy();
  await page.goto('/admin/greetings');
  await page.getByRole('button', { name: '축사 추가', exact: true }).click();
  await page.getByRole('textbox', { name: '성함', exact: true }).fill('자동 생성 테스트');
  await page.getByRole('textbox', { name: '소속 · 직함', exact: true }).fill('테스트 연구소');
  await page
    .locator('input[accept="application/pdf"]')
    .setInputFiles({ name: 'first.pdf', mimeType: 'application/pdf', buffer: pdf('Preview test') });
  await page.getByRole('button', { name: '전체 저장', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다', { timeout: 30000 });
  let data = await (await page.request.get('/api/greetings?admin=1')).json();
  expect(data.items[0].preview.type).toMatch(/^image\//);
  const old = data.items[0].preview.id;
  const image = await page.request.get('/api/greetings/' + old);
  expect(image.ok()).toBeTruthy();
  expect((await image.body()).length).toBeGreaterThan(500);
  await page
    .locator('input[accept="application/pdf"]')
    .setInputFiles({
      name: 'replacement.pdf',
      mimeType: 'application/pdf',
      buffer: pdf('Replacement page'),
    });
  await page.getByRole('button', { name: '전체 저장', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다', { timeout: 30000 });
  data = await (await page.request.get('/api/greetings?admin=1')).json();
  expect(data.items[0].preview.id).not.toBe(old);
  expect((await page.request.get('/api/greetings/' + old)).status()).toBe(404);
  const id = randomUUID();
  data.items.push({
    id,
    name: '기존 PDF',
    affiliation: '테스트',
    kind: 'pdf',
    published: false,
    youtube: '',
  });
  const added = await page.request.put('/api/greetings', {
    headers: { Origin: origin },
    multipart: {
      config: JSON.stringify(data),
      ['document-' + id]: {
        name: 'existing.pdf',
        mimeType: 'application/pdf',
        buffer: pdf('Existing missing preview'),
      },
    },
  });
  expect(added.ok()).toBeTruthy();
  await page.reload();
  await page.getByRole('button', { name: '전체 저장', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다', { timeout: 30000 });
  data = await (await page.request.get('/api/greetings?admin=1')).json();
  expect(data.items.find((i: any) => i.id === id).preview.id).toBeTruthy();
  const done = await page.request.put('/api/greetings', {
    headers: { Origin: origin },
    multipart: { config: JSON.stringify({ ...data, items: [] }) },
  });
  expect(done.ok()).toBeTruthy();
});
