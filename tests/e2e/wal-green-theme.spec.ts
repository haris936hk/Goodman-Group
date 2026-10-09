import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/companies/wal-green-chemicals';

test('Wal Green renders dark palette when Group theme is dark and satisfies accessibility', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.wal-green-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveCSS('background-color', 'rgb(17, 27, 22)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#111b16'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.wg-theme-toggle')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('Wal Green renders light palette when Group theme is light and satisfies accessibility', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'light');
    localStorage.setItem('wal-green-chemicals-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.wal-green-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(250, 248, 245)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#faf8f5'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.wg-theme-toggle')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('Wal Green defaults to device preference when Group theme is missing or malformed', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'invalid');
    localStorage.setItem('wal-green-chemicals-theme', 'light');
  });
  await page.goto(route);
  const shell = page.locator('.wal-green-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(250, 248, 245)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#faf8f5'))).toBe(true);
});

test('Wal Green defaults to device preference and remains operable when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(route);
  const shell = page.locator('.wal-green-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(250, 248, 245)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#faf8f5'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
});

test('Wal Green defaults to dark without JavaScript under both OS preferences', async ({ browser }) => {
  const darkContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(route);
  await expect(darkPage.locator('.wal-green-page')).toHaveCSS('background-color', 'rgb(17, 27, 22)');
  await expect(darkPage.locator('.wg-theme-toggle')).toHaveCount(0);
  await darkContext.close();

  const lightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
  const lightPage = await lightContext.newPage();
  await lightPage.goto(route);
  await expect(lightPage.locator('.wal-green-page')).toHaveCSS('background-color', 'rgb(17, 27, 22)');
  await expect(lightPage.locator('.wg-theme-toggle')).toHaveCount(0);
  await lightContext.close();
});
