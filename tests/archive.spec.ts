import { test, expect } from '@playwright/test';

test('archive category, photo optimization, dates and unpublished file privacy', async ({
  page,
  browser,
}) => {
  await page.goto('/admin/login');
  await page.getByLabel('아이디', { exact: true }).fill('test-admin');
  await page.getByLabel('비밀번호', { exact: true }).fill('test-only-password');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/admin/notices/new');
  await page.getByLabel('제목').fill('사진 최적화 학술활동 검증');
  await page.getByLabel('본문').fill('원문에 기재된 행사 설명입니다.');
  await page.getByLabel('게시 영역').selectOption('activities');
  await page.getByLabel('행사일·발행일').fill('2020-08-21');
  await page.getByLabel('공개 상태').selectOption('published');
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1400;
    const context = canvas.getContext('2d')!;
    const pixels = context.createImageData(canvas.width, canvas.height);
    let seed = 7;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      pixels.data[i] = seed & 255;
      pixels.data[i + 1] = (seed >>> 8) & 255;
      pixels.data[i + 2] = (seed >>> 16) & 255;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const original = Buffer.from(base64, 'base64');
  expect(original.length).toBeGreaterThan(3 * 1024 * 1024);
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: original });
  await page.getByLabel('이미지 설명').fill('테스트용 이미지');
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  await page.getByRole('link', { name: '사진 최적화 학술활동 검증' }).click();
  await expect(page).toHaveURL(/\/admin\/notices\/[^/]+\/edit$/);
  const id = page.url().split('/').at(-2)!;
  const guest = await browser.newContext({ baseURL: 'http://localhost:3100' });
  const reader = await guest.newPage();
  await reader.goto('/activities');
  await expect(reader.getByRole('heading', { name: '사진 최적화 학술활동 검증' })).toBeVisible();
  await reader.goto('/news');
  await expect(reader.getByText('사진 최적화 학술활동 검증')).toHaveCount(0);
  await reader.goto(`/activities/${id}`);
  await expect(reader.locator('.article-event-date')).toContainText('2020. 08. 21.');
  const img = reader.locator('.notice-image img');
  await expect(img).toBeVisible();
  expect(await img.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(1920);
  const fileUrl = (await img.getAttribute('src'))!;
  const response = await guest.request.get(fileUrl);
  expect(response.headers()['content-type']).toBe('image/webp');
  expect((await response.body()).length).toBeLessThan(original.length);
  await page.getByLabel('게시 영역').selectOption('publications');
  await page.getByLabel('공개 상태').selectOption('draft');
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  expect((await guest.request.get(fileUrl)).status()).toBe(404);
  expect((await guest.request.get(fileUrl + '?thumbnail=1')).status()).toBe(404);
  expect((await guest.request.get(`/publications/${id}`)).status()).toBe(404);
  await page.request.delete(`/api/notices/${id}`, { headers: { Origin: 'http://localhost:3100' } });
  await guest.close();
});
