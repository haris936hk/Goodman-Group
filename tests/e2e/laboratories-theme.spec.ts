import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/companies/goodman-laboratories';


test('Laboratories applies complete bespoke surface palettes in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.laboratories-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveCSS('background-color', 'rgb(25, 20, 22)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#191416'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.lab-theme-toggle')).toHaveCount(0);

  // Dark mode surfaces
  await expect(page.locator('.lab-hero')).toHaveCSS('background-color', 'rgb(48, 34, 40)');
  await expect(page.locator('.lab-community-section')).toHaveCSS('background-color', 'rgb(48, 34, 40)');
  await expect(page.locator('.lab-disclosure').first()).toHaveCSS('background-color', 'rgb(43, 34, 38)');
  await expect(page.locator('.lab-certificates article').first()).toHaveCSS('background-color', 'rgb(43, 34, 38)');
  await expect(page.locator('.lab-tinted').first()).toHaveCSS('background-color', 'rgb(36, 28, 32)');
  await expect(page.locator('.lab-therapeutic')).toHaveCSS('background-color', 'rgb(36, 28, 32)');
  await expect(page.locator('.lab-national')).toHaveCSS('background-color', 'rgb(53, 39, 45)');
  await expect(page.locator('.lab-leader-panel')).toHaveCSS('background-color', 'rgb(53, 39, 45)');
  await expect(page.locator('.lab-certificates article').last()).toHaveCSS('background-color', 'rgb(16, 13, 15)');
  await expect(page.locator('.lab-contact')).toHaveCSS('background-color', 'rgb(16, 13, 15)');
  await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(25, 20, 22)');
  // Logo brand plate stays white in both modes
  await expect(page.locator('.lab-panel-brand')).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  // Primary CTA in dark mode
  const darkCta = page.locator('.lab-hero .lab-action');
  await expect(darkCta).toHaveCSS('background-color', 'rgb(239, 154, 166)');
  await expect(darkCta).toHaveCSS('color', 'rgb(38, 23, 28)');
});

test('Laboratories applies complete bespoke surface palettes in light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'light');
    localStorage.setItem('goodman-laboratories-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.laboratories-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(252, 250, 247)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fcfaf7'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.lab-theme-toggle')).toHaveCount(0);

  // Light mode surfaces
  await expect(page.locator('.lab-hero')).toHaveCSS('background-color', 'rgb(242, 233, 229)');
  await expect(page.locator('.lab-community-section')).toHaveCSS('background-color', 'rgb(242, 233, 229)');
  await expect(page.locator('.lab-disclosure').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.lab-certificates article').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.lab-tinted').first()).toHaveCSS('background-color', 'rgb(243, 238, 234)');
  await expect(page.locator('.lab-therapeutic')).toHaveCSS('background-color', 'rgb(243, 238, 234)');
  await expect(page.locator('.lab-national')).toHaveCSS('background-color', 'rgb(238, 224, 218)');
  await expect(page.locator('.lab-leader-panel')).toHaveCSS('background-color', 'rgb(238, 224, 218)');
  await expect(page.locator('.lab-certificates article').last()).toHaveCSS('background-color', 'rgb(57, 43, 46)');
  await expect(page.locator('.lab-contact')).toHaveCSS('background-color', 'rgb(57, 43, 46)');
  await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(252, 250, 247)');
  await expect(page.locator('.lab-panel-brand')).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  // Primary CTA in light mode
  const lightCta = page.locator('.lab-hero .lab-action');
  await expect(lightCta).toHaveCSS('background-color', 'rgb(163, 49, 64)');
  await expect(lightCta).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('Laboratories preserves disclosure state and supports keyboard expansion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(route);

  // Expand Neurology category
  const neuroSummary = page.getByText('Neurology, psychiatry, and central nervous system');
  const neuroDetails = page.locator('details.lab-disclosure').filter({ hasText: 'Neurology, psychiatry, and central nervous system' });
  await expect(neuroDetails).not.toHaveAttribute('open');
  await neuroSummary.click();
  await expect(neuroDetails).toHaveAttribute('open');
  await expect(page.getByText('Gavatin')).toBeVisible();
  await expect(page.getByText(/levetiracetam/i)).toBeVisible();

  const otherDetails = page.locator('details.lab-disclosure').filter({ hasText: 'Antiviral, antiparasitic, antiemetic, and other products' });
  await expect(otherDetails).not.toHaveAttribute('open');

  // Keyboard-expand certification details via focused summary
  const certDetails = page.locator('details.lab-certification-details');
  const certSummary = certDetails.locator('summary');
  await expect(certDetails).not.toHaveAttribute('open');
  await certSummary.focus();
  await page.keyboard.press('Enter');
  // If Enter didn't toggle in a specific browser engine, Space will
  if (!(await certDetails.evaluate((el: HTMLDetailsElement) => el.open))) {
    await page.keyboard.press('Space');
  }
  await expect(certDetails).toHaveAttribute('open');
  await expect(page.getByText('Manufacturing of Pharmaceutical Products')).toBeVisible();
});

test('Laboratories handles storage failures gracefully', async ({ browser }) => {
  // 1. Invalid stored value + light OS -> fallback to light device preference
  {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('goodman-group-theme', 'invalid-value');
      localStorage.setItem('goodman-laboratories-theme', 'light');
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(route);
    const shell = page.locator('.laboratories-page');
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('background-color', 'rgb(252, 250, 247)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fcfaf7'))).toBe(true);
    await page.close();
  }

  // 2. Read-throw context -> starts light under light OS, meta light, no uncaught error, no theme button
  {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('storage-read-blocked'); };
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(route);
    const shell = page.locator('.laboratories-page');
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('background-color', 'rgb(252, 250, 247)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fcfaf7'))).toBe(true);
    await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
    expect(errors).toEqual([]);
    await page.close();
  }

  // 3. Write-throw context -> operates in dark mode without uncaught error
  {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new Error('storage-write-blocked'); };
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(route);
    const shell = page.locator('.laboratories-page');
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
    await page.close();
  }
});

test('Laboratories defaults to dark without JavaScript under both OS preferences', async ({ browser }) => {
  const darkContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(route);
  const darkShell = darkPage.locator('.laboratories-page');
  await expect(darkShell).toHaveCSS('background-color', 'rgb(25, 20, 22)');
  await expect(darkPage.locator('.lab-theme-toggle')).toHaveCount(0);

  // Anchors and native disclosures work
  const details = darkPage.locator('details.lab-disclosure').first();
  await expect(details).not.toHaveAttribute('open');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open');
  await darkContext.close();

  const lightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
  const lightPage = await lightContext.newPage();
  await lightPage.goto(route);
  const lightShell = lightPage.locator('.laboratories-page');
  await expect(lightShell).toHaveCSS('background-color', 'rgb(25, 20, 22)');
  await expect(lightPage.locator('.lab-theme-toggle')).toHaveCount(0);
  await lightContext.close();
});

test('Laboratories satisfies accessibility, responsive wrapping, target sizes, and reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(route);

  // Axe in dark mode with disclosures closed
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  // Open product, certification, and governance disclosures
  await page.getByText('Neurology, psychiatry, and central nervous system').click();
  await page.getByText('Certification scope & registration details').click();
  await page.getByText('Governance structure').click();
  // Allow the 260ms disclosure reveal animation to settle so opacity is 1 before contrast analysis
  await page.waitForTimeout(300);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  // Check Axe in light mode in a seeded light page
  {
    const lightPage = await page.context().newPage();
    await lightPage.addInitScript(() => {
      localStorage.setItem('goodman-group-theme', 'light');
    });
    await lightPage.goto(route);
    expect((await new AxeBuilder({ page: lightPage }).analyze()).violations).toEqual([]);
    await lightPage.close();
  }

  // Test responsive widths: 320, 390, 800, 1440
  const widths = [320, 390, 800, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    // No horizontal scroll
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Header relationship text and back link visible
    await expect(page.locator('.group-frame-relation-text')).toBeVisible();
    const backLink = page.locator('.group-frame-back-link');
    await expect(backLink).toBeVisible();
    const box = await backLink.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBeGreaterThanOrEqual(44);
    expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
  }

  // Keyboard focus navigation
  await page.locator('.group-frame-back-link').focus();
  await expect(page.locator('.group-frame-back-link')).toBeFocused();
  await page.locator('.group-frame-brand').focus();
  await expect(page.locator('.group-frame-brand')).toBeFocused();
  await page.locator('.lab-profile-nav a').first().focus();
  await expect(page.locator('.lab-profile-nav a').first()).toBeFocused();
  await page.locator('.lab-contact .lab-action').focus();
  await expect(page.locator('.lab-contact .lab-action')).toBeFocused();
  await page.locator('.lab-contact-locations div > a').first().focus();
  await expect(page.locator('.lab-contact-locations div > a').first()).toBeFocused();

  // Reduced motion: no disclosure animation and no hover transforms
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.lab-disclosure[open] > :not(summary)').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.lab-action').first()).toHaveCSS('transform', 'none');
});
