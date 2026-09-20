import { test, expect } from '@playwright/test';

test('Japanese shares pages, keeps language when navigating, and preserves the Korean URL', async ({
  page,
}) => {
  await page.goto('/ja/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.getByRole('heading', { name: '研究所紹介', exact: true })).toBeVisible();
  await expect(page.locator('.about-prose p')).toHaveCount(4);
  await expect(page.locator('.about-visions li')).toHaveCount(5);
  await page.locator('.primary-nav').getByRole('link', { name: '研究者紹介' }).click();
  await expect(page).toHaveURL(/\/ja\/people$/);
  await expect(page.getByRole('heading', { name: '孫知延', exact: true })).toBeVisible();
  await expect(page.locator('details[open]')).toHaveCount(2);
  await page.locator('.language-control select').selectOption('ko');
  await expect(page).toHaveURL(/\/people$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByRole('heading', { name: '손지연', exact: true })).toBeVisible();
  await page.goto('/ja/news?page=2#main');
  await page.locator('.language-control select').selectOption('ko');
  await expect(page).toHaveURL(/\/news\?page=2#main$/);
});

test('English remains unavailable and Japanese layout fits tablet and mobile', async ({ page }) => {
  for (const width of [1024, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/ja/about');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
  await page.locator('.language-control select').selectOption('en');
  await expect(page.getByRole('status')).toHaveText('英語ページは準備中です。');
  await expect(page.locator('.language-control select')).toHaveValue('ja');
  await page.goto('/ja/admin');
  await expect(page.getByRole('heading', { name: 'ページが見つかりません。' })).toBeVisible();
});
