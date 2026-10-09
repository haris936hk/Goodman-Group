import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/companies/geron-pharma';

test('Geron renders dark palette when Group theme is dark, satisfies accessibility, responsiveness, and reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.geron-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveCSS('background-color', 'rgb(12, 8, 23)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#0c0817'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.geron-theme-toggle')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.geron-orbit-ring')).toHaveCSS('animation-name', 'none');
});

test('Geron renders light palette when Group theme is light and satisfies accessibility', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'light');
    localStorage.setItem('geron-pharma-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.geron-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(248, 245, 255)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#f8f5ff'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.geron-theme-toggle')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('Geron defaults to device preference when Group theme is missing or malformed', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'invalid');
    localStorage.setItem('geron-pharma-theme', 'light');
  });
  await page.goto(route);
  const shell = page.locator('.geron-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(248, 245, 255)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#f8f5ff'))).toBe(true);
});

test('Geron defaults to device preference and remains operable when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(route);
  const shell = page.locator('.geron-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(248, 245, 255)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#f8f5ff'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
});

test('Geron defaults to dark without JavaScript under both OS preferences', async ({ browser }) => {
  const darkContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(route);
  await expect(darkPage.locator('.geron-page')).toHaveCSS('background-color', 'rgb(12, 8, 23)');
  await expect(darkPage.locator('.geron-theme-toggle')).toHaveCount(0);
  await darkContext.close();

  const lightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
  const lightPage = await lightContext.newPage();
  await lightPage.goto(route);
  await expect(lightPage.locator('.geron-page')).toHaveCSS('background-color', 'rgb(12, 8, 23)');
  await expect(lightPage.locator('.geron-theme-toggle')).toHaveCount(0);
  await lightContext.close();
});
