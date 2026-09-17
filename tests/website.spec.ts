import { test, expect } from '@playwright/test';
const origin = 'http://localhost:3100';

test('responsive navigation, disabled menus and empty notices', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const width of [1440, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('오키나와연구소');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width <= 1050) {
      await page.getByRole('button', { name: '메뉴' }).click();
      await expect(page.getByRole('navigation', { name: '주 메뉴' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: '메뉴' })).toBeFocused();
    }
    expect(await page.locator('nav a[href="/about"]').count()).toBe(0);
  }
  await page.goto('/news');
  await expect(page.getByText('등록된 공지사항이 없습니다.')).toBeVisible();
  await page.goto('/admin');
  await expect(page).toHaveURL(/admin\/login/);
  expect((await page.request.get('/news/does-not-exist')).status()).toBe(404);
  await page.goto('/');
  await expect(page.getByRole('img', { name: /Global Institute for Ryukyu/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: '연구소 비전' })).toBeVisible();
  await expect(page.locator('.vision-card')).toHaveCount(5);
  await expect(page.getByText('섬을 넘어,')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('administrator workflow, draft privacy, upload access, update, delete and logout', async ({
  page,
  browser,
}) => {
  const guest = await browser.newContext({ baseURL: origin });
  const reader = await guest.newPage();
  const denied = await guest.request.post('/api/notices', {
    headers: { Origin: origin },
    multipart: { title: 'unauthorized', body: 'blocked', status: 'published' },
  });
  expect(denied.status()).toBe(403);
  await page.goto('/admin/login');
  await page.getByLabel('아이디', { exact: true }).fill('test-admin');
  await page.getByLabel('비밀번호', { exact: true }).fill('wrong');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page.locator('.form-error')).toContainText('확인');
  await page.getByLabel('비밀번호', { exact: true }).fill('test-only-password');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  expect(
    (
      await page.request.post('/api/notices', {
        headers: { Origin: 'https://attacker.example' },
        multipart: { title: 'CSRF', body: 'blocked', status: 'published' },
      })
    ).status(),
  ).toBe(403);
  await page.getByRole('link', { name: '＋ 새 공지 작성' }).click();
  await page.getByLabel('제목').fill('검증용 공지 — 초안');
  await page
    .getByLabel('본문', { exact: false })
    .fill('첫 번째 문단입니다.\n\n두 번째 문단입니다. <script>alert(1)</script>');
  await page
    .locator('input[type=file]')
    .setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nTest document\n%%EOF'),
    });
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toContainText('저장했습니다');
  await page.getByRole('link', { name: '검증용 공지 — 초안' }).click();
  const id = page.url().split('/').at(-2)!;
  const filePath = await page.getByRole('link', { name: 'test.pdf' }).getAttribute('href');
  expect((await guest.request.get(`/news/${id}`)).status()).toBe(404);
  expect((await guest.request.get(filePath!)).status()).toBe(404);
  expect((await guest.request.get(`/admin/notices/${id}/edit`)).url()).toContain('/admin/login');
  await reader.goto('/');
  await expect(reader.getByText('검증용 공지 — 초안')).toHaveCount(0);
  await page.getByLabel('공개 상태').selectOption('published');
  await page.getByLabel('중요 공지로 상단 고정').check();
  await page.getByLabel('제목').fill('검증용 공지 — 공개');
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await reader.goto('/');
  await expect(reader.getByRole('link', { name: /검증용 공지 — 공개/ })).toBeVisible();
  await reader.getByRole('link', { name: /검증용 공지 — 공개/ }).click();
  await expect(reader.getByRole('heading', { level: 1 })).toHaveText('검증용 공지 — 공개');
  await expect(reader.locator('.article-body')).toContainText('<script>alert(1)</script>');
  const download = await guest.request.get(filePath!);
  expect(download.status()).toBe(200);
  expect(download.headers()['content-disposition']).toContain('attachment');
  expect(download.headers()['cache-control']).toContain('no-store');
  // Missing images/long text and mobile detail retain their layout.
  await reader.setViewportSize({ width: 375, height: 850 });
  expect(await reader.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
    true,
  );
  await page.getByRole('link', { name: '검증용 공지 — 공개' }).click();
  await page.getByLabel('본문').fill('수정된 본문');
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await reader.reload();
  await expect(reader.locator('.article-body')).toHaveText('수정된 본문');
  await page.getByRole('link', { name: '검증용 공지 — 공개' }).click();
  await page.getByRole('button', { name: '공지사항 삭제' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '취소', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: '공지사항 삭제' }).click();
  await page.getByRole('button', { name: '삭제하기', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('삭제했습니다');
  expect((await guest.request.get(`/news/${id}`)).status()).toBe(404);
  expect((await guest.request.get(filePath!)).status()).toBe(404);
  const before = await page.context().cookies();
  await page.getByRole('button', { name: '로그아웃', exact: true }).click();
  await expect(page).toHaveURL(/admin\/login/);
  await page.context().addCookies(before);
  await page.goto('/admin');
  await expect(page).toHaveURL(/admin\/login/);
  await guest.close();
});

test('pagination, image validation, upload limits, draft transitions and mobile editor', async ({
  page,
  browser,
}) => {
  await page.request.post('/api/auth/login', {
    headers: { Origin: origin },
    data: { username: 'test-admin', password: 'test-only-password' },
  });
  const guest = await browser.newContext({ baseURL: origin });
  const reader = await guest.newPage();
  const ids: string[] = [];
  for (let i = 0; i < 11; i++) {
    const response = await page.request.post('/api/notices', {
      headers: { Origin: origin },
      multipart: {
        title: `페이지 검증 ${i}`,
        body: '내용',
        status: 'published',
        pinned: i === 0 ? 'true' : 'false',
      },
    });
    expect(response.status()).toBe(201);
    ids.push((await response.json()).id);
  }
  await reader.goto('/news');
  await expect(reader.locator('.notice-row')).toHaveCount(10);
  await expect(reader.locator('.notice-row').first()).toContainText('페이지 검증 0');
  await reader.getByRole('link', { name: '다음', exact: true }).click();
  await expect(reader.locator('.notice-row')).toHaveCount(1);
  await reader.goto('/news?page=-99');
  await expect(reader.locator('.notice-row')).toHaveCount(10);
  const invalid = await page.request.post('/api/notices', {
    headers: { Origin: origin },
    multipart: {
      title: 'invalid',
      body: 'body',
      status: 'published',
      files: {
        name: 'evil.html',
        mimeType: 'image/png',
        buffer: Buffer.from('<script>alert(1)</script>'),
      },
    },
  });
  expect(invalid.status()).toBe(400);
  const oversized = await page.request.post('/api/notices', {
    headers: { Origin: origin },
    multipart: {
      title: 'oversized',
      body: 'body',
      status: 'published',
      files: {
        name: 'huge.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.alloc(3 * 1024 * 1024 + 1),
      },
    },
  });
  expect(oversized.status()).toBe(400);
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==',
    'base64',
  );
  const imageResponse = await page.request.post('/api/notices', {
    headers: { Origin: origin },
    multipart: {
      title: '이미지 검증',
      body: '이미지 공지',
      status: 'published',
      'alt-0': '첨부 이미지 설명',
      files: { name: 'test.png', mimeType: 'image/png', buffer: png },
    },
  });
  expect(imageResponse.status()).toBe(201);
  const imageId = (await imageResponse.json()).id;
  ids.push(imageId);
  await reader.goto(`/news/${imageId}`);
  await expect(reader.getByAltText('첨부 이미지 설명')).toBeVisible();
  const filePath = await reader.getByAltText('첨부 이미지 설명').getAttribute('src');
  await page.goto(`/admin/notices/${imageId}/edit`);
  await page.setViewportSize({ width: 375, height: 850 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('공개 상태').selectOption('draft');
  await page.getByRole('button', { name: '저장하기' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  expect((await guest.request.get(`/news/${imageId}`)).status()).toBe(404);
  expect((await guest.request.get(filePath!)).status()).toBe(404);
  for (const id of ids)
    expect(
      (await page.request.delete(`/api/notices/${id}`, { headers: { Origin: origin } })).ok(),
    ).toBe(true);
  await guest.close();
});
