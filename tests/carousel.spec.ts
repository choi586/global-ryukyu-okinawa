import { test, expect } from '@playwright/test';
const origin = 'http://localhost:3100';
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jY1sAAAAASUVORK5CYII=',
  'base64',
);
async function login(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.getByLabel('아이디', { exact: true }).fill('test-admin');
  await page.getByLabel('비밀번호', { exact: true }).fill('test-only-password');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
test('administrator can publish, reorder, hide, replace and delete carousel photos without code', async ({
  page,
  browser,
}) => {
  await login(page);
  await page.getByRole('link', { name: '메인 캐러셀 관리', exact: true }).click();
  for (let i = 1; i <= 3; i++) {
    await page.getByRole('button', { name: '＋ 사진 추가' }).click();
    const card = page.getByRole('region', { name: `${i}번 사진 설정`, exact: true });
    await card
      .getByLabel('사진 추가', { exact: true })
      .setInputFiles({ name: `poster${i}.png`, mimeType: 'image/png', buffer: png });
    await card.getByLabel('제목', { exact: true }).fill(`행사 ${i}`);
    await card.getByLabel('짧은 설명').fill(`행사 설명 ${i}`);
    await card.getByLabel('이미지 설명').fill(`포스터 ${i}`);
    await card.getByLabel('연결할 링크').fill('/activities');
  }
  await page.getByRole('button', { name: '캐러셀 저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  const before = await (await page.request.get('/api/carousel?admin=1')).json();
  const guest = await browser.newContext({ baseURL: origin });
  const reader = await guest.newPage();
  await reader.goto('/');
  await expect(reader.locator('.carousel-dots button')).toHaveCount(3);
  await expect(reader.locator('.carousel-slide.is-active h2')).toHaveText('행사 1');
  expect((await guest.request.get('/api/carousel?admin=1')).status()).toBe(403);
  expect(
    (
      await guest.request.put('/api/carousel', {
        headers: { Origin: origin },
        multipart: { config: JSON.stringify(before) },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.put('/api/carousel', {
        headers: { Origin: 'https://example.net' },
        multipart: { config: JSON.stringify(before) },
      })
    ).status(),
  ).toBe(403);
  const tooMany = {
    revision: before.revision,
    slides: Array.from({ length: 6 }, (_, i) => ({
      ...before.slides[0],
      id: crypto.randomUUID(),
      alt: '사진',
    })),
  };
  expect(
    (
      await page.request.put('/api/carousel', {
        headers: { Origin: origin },
        multipart: { config: JSON.stringify(tooMany) },
      })
    ).status(),
  ).toBe(400);
  const stale = {
    revision: before.revision,
    slides: before.slides.map((s: any) => ({ ...s, alt: s.image.alt })),
  };
  const unsafe = {
    ...stale,
    slides: stale.slides.map((s: any) => ({ ...s, href: 'javascript:alert(1)' })),
  };
  expect(
    (
      await page.request.put('/api/carousel', {
        headers: { Origin: origin },
        multipart: { config: JSON.stringify(unsafe) },
      })
    ).status(),
  ).toBe(400);
  await page.getByRole('button', { name: '3번 사진 위로' }).click();
  await page.getByRole('button', { name: '2번 사진 위로' }).click();
  await page
    .getByRole('region', { name: '3번 사진 설정', exact: true })
    .getByLabel('메인에 공개')
    .uncheck();
  await page.getByRole('button', { name: '캐러셀 저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  await expect(reader.locator('.carousel-dots button')).toHaveCount(2, { timeout: 10000 });
  await expect(reader.locator('.carousel-slide').first().locator('h2')).toHaveText('행사 3');
  expect((await guest.request.get(`/api/carousel/${before.slides[1].image.id}`)).status()).toBe(
    404,
  );
  expect(
    (
      await page.request.put('/api/carousel', {
        headers: { Origin: origin },
        multipart: { config: JSON.stringify(stale) },
      })
    ).status(),
  ).toBe(409);
  const first = page.getByRole('region', { name: '1번 사진 설정', exact: true });
  await first
    .getByLabel('사진 교체')
    .setInputFiles({ name: 'replacement.png', mimeType: 'image/png', buffer: png });
  await first.getByLabel('제목', { exact: true }).fill('새 포스터');
  await page.getByRole('button', { name: '캐러셀 저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  expect((await guest.request.get(`/api/carousel/${before.slides[2].image.id}`)).status()).toBe(
    404,
  );
  await first.getByRole('button', { name: '삭제', exact: true }).click();
  await page.getByRole('button', { name: '사진 삭제', exact: true }).click();
  await page.getByRole('button', { name: '캐러셀 저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  await guest.close();
});

test('carousel cycles every five seconds, pauses on interaction and respects reduced motion', async ({
  page,
}) => {
  await login(page);
  const old = await (await page.request.get('/api/carousel?admin=1')).json();
  const slides = Array.from({ length: 3 }, (_, i) => ({
    id: crypto.randomUUID(),
    title: `타이머 ${i + 1}`,
    description: '설명',
    alt: '사진',
    href: '',
    published: true,
    fit: 'contain',
  }));
  const multipart: any = { config: JSON.stringify({ revision: old.revision, slides }) };
  slides.forEach(
    (s) => (multipart[`image-${s.id}`] = { name: 'test.png', mimeType: 'image/png', buffer: png }),
  );
  expect(
    (await page.request.put('/api/carousel', { headers: { Origin: origin }, multipart })).status(),
  ).toBe(200);
  await page.clock.install();
  await page.goto('/');
  await page.locator('.site-header').hover();
  const active = page.locator('.carousel-slide.is-active h2');
  await expect(active).toHaveText('타이머 1');
  await page.clock.runFor(5001);
  await expect(active).toHaveText('타이머 2');
  await page.locator('.hero-carousel').hover();
  await page.clock.runFor(6000);
  await expect(active).toHaveText('타이머 2');
  await page.locator('.site-header').hover();
  await page.clock.runFor(5001);
  await expect(active).toHaveText('타이머 3');
  await page.getByRole('button', { name: '다음 사진', exact: true }).click();
  await page.locator('.site-header').hover();
  await expect(active).toHaveText('타이머 1');
  await page.clock.runFor(9000);
  await expect(active).toHaveText('타이머 1');
  await page.clock.runFor(1001);
  await expect(page.locator('.hero-carousel')).toHaveAttribute('data-autoplay', 'playing');
  await page.clock.runFor(5001);
  await expect(active).toHaveText('타이머 2');
  await page.getByRole('button', { name: '자동재생 정지' }).click();
  await page.locator('.site-header').hover();
  await page.clock.runFor(20000);
  await expect(active).toHaveText('타이머 2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(active).toHaveText('타이머 1');
  await page.clock.runFor(20000);
  await expect(active).toHaveText('타이머 1');
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  const config = await (await page.request.get('/api/carousel?admin=1')).json();
  await page.request.put('/api/carousel', {
    headers: { Origin: origin },
    multipart: { config: JSON.stringify({ revision: config.revision, slides: [] }) },
  });
});
