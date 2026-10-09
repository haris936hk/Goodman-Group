import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/companies/goodman-billing';

test('Billing applies complete bespoke surface palettes in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.billing-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(shell).toHaveCSS('background-color', 'rgb(16, 28, 25)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#101c19'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.billing-theme-toggle')).toHaveCount(0);

  // Dark mode surfaces
  await expect(page.locator('.billing-hero')).toHaveCSS('background-color', 'rgb(25, 44, 36)');
  await expect(page.locator('.billing-hero-panel')).toHaveCSS('background-color', 'rgb(12, 23, 19)');
  await expect(page.locator('.billing-tinted').first()).toHaveCSS('background-color', 'rgb(21, 37, 31)');
  await expect(page.locator('.billing-specialties-section')).toHaveCSS('background-color', 'rgb(27, 48, 39)');
  await expect(page.locator('#services .billing-directory-card').first()).toHaveCSS('background-color', 'rgb(32, 55, 45)');
  await expect(page.locator('#specialties .billing-directory-card').first()).toHaveCSS('background-color', 'rgb(36, 61, 49)');
  await expect(page.locator('.billing-platform-grid article').first()).toHaveCSS('background-color', 'rgb(32, 55, 45)');
  await expect(page.locator('.billing-commitment')).toHaveCSS('background-color', 'rgb(41, 66, 49)');
  await expect(page.locator('.billing-task-group').first()).toHaveCSS('background-color', 'rgb(16, 28, 25)');
  await expect(page.locator('.billing-testimonials figure').first()).toHaveCSS('background-color', 'rgb(32, 55, 45)');
  await expect(page.locator('.billing-testimonials figure').nth(1)).toHaveCSS('background-color', 'rgb(12, 23, 19)');
  await expect(page.locator('.billing-contact')).toHaveCSS('background-color', 'rgb(12, 23, 19)');
  await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(16, 28, 25)');

  // Artwork plates remain intentional
  await expect(page.locator('.billing-platform-logo').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#specialties .billing-card-icon').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#services .billing-card-icon').first()).toHaveCSS('background-color', 'rgb(23, 61, 57)');

  // Main CTA in dark mode
  const darkCta = page.locator('.billing-hero .billing-action');
  await expect(darkCta).toHaveCSS('background-color', 'rgb(145, 213, 186)');
  await expect(darkCta).toHaveCSS('color', 'rgb(16, 37, 27)');
});

test('Billing applies complete bespoke surface palettes in light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    localStorage.setItem('goodman-group-theme', 'light');
    localStorage.setItem('goodman-billing-theme', 'dark');
  });
  await page.goto(route);
  const shell = page.locator('.billing-page');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 248)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbf8'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
  await expect(page.locator('.billing-theme-toggle')).toHaveCount(0);

  // Light mode surfaces
  await expect(page.locator('.billing-hero')).toHaveCSS('background-color', 'rgb(237, 242, 235)');
  await expect(page.locator('.billing-hero-panel')).toHaveCSS('background-color', 'rgb(24, 62, 57)');
  await expect(page.locator('.billing-tinted').first()).toHaveCSS('background-color', 'rgb(238, 243, 239)');
  await expect(page.locator('.billing-specialties-section')).toHaveCSS('background-color', 'rgb(226, 236, 229)');
  await expect(page.locator('#services .billing-directory-card').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#specialties .billing-directory-card').first()).toHaveCSS('background-color', 'rgb(245, 248, 242)');
  await expect(page.locator('.billing-platform-grid article').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.billing-commitment')).toHaveCSS('background-color', 'rgb(228, 236, 224)');
  await expect(page.locator('.billing-task-group').first()).toHaveCSS('background-color', 'rgb(250, 251, 248)');
  await expect(page.locator('.billing-testimonials figure').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.billing-testimonials figure').nth(1)).toHaveCSS('background-color', 'rgb(23, 61, 57)');
  await expect(page.locator('.billing-contact')).toHaveCSS('background-color', 'rgb(25, 63, 57)');
  await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(250, 251, 248)');

  // Artwork plates in light mode
  await expect(page.locator('.billing-platform-logo').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#specialties .billing-card-icon').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#services .billing-card-icon').first()).toHaveCSS('background-color', 'rgb(23, 61, 57)');

  // Main CTA in light mode
  const lightCta = page.locator('.billing-hero .billing-action');
  await expect(lightCta).toHaveCSS('background-color', 'rgb(23, 61, 57)');
  await expect(lightCta).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('Billing directory search filters services and specialties independently', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(route);

  const servicesSection = page.locator('#services');
  const specialtiesSection = page.locator('#specialties');
  const serviceInput = servicesSection.getByRole('searchbox', { name: 'Search services' });
  const specialtyInput = specialtiesSection.getByRole('searchbox', { name: 'Search specialties' });

  // Fill searches
  await serviceInput.fill('zzzz-theme-no-match');
  await expect(servicesSection.getByRole('heading', { name: 'No matching services' })).toBeVisible();

  await specialtyInput.fill('Cardiology');
  await expect(specialtiesSection.getByRole('heading', { name: 'Cardiology' })).toBeVisible();
  await expect(specialtiesSection.getByRole('heading', { name: 'Nephrology' })).not.toBeVisible();

  // Reset services through "Show all services"
  await servicesSection.getByRole('button', { name: 'Show all services' }).click();
  await expect(serviceInput).toHaveValue('');
  await expect(servicesSection.getByRole('heading', { name: 'Medical Billing', exact: true })).toBeVisible();
  expect(await servicesSection.locator('.billing-directory-card').count()).toBe(18);

  // Specialty search remains unaffected
  await expect(specialtyInput).toHaveValue('Cardiology');
  await expect(specialtiesSection.getByRole('heading', { name: 'Cardiology' })).toBeVisible();

  // Clear specialty search
  await specialtiesSection.getByRole('button', { name: 'Clear search' }).click();
  await expect(specialtyInput).toHaveValue('');
  await expect(specialtiesSection.getByRole('heading', { name: 'Nephrology' })).toBeVisible();
  expect(await specialtiesSection.locator('.billing-directory-card').count()).toBe(40);
});

test('Billing handles storage failures gracefully', async ({ browser }) => {
  // 1. Invalid stored value + light OS -> fallback to light device preference
  {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('goodman-group-theme', 'invalid-billing-theme');
      localStorage.setItem('goodman-billing-theme', 'light');
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(route);
    const shell = page.locator('.billing-page');
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 248)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbf8'))).toBe(true);
    await page.close();
  }

  // 2. Read-throw context -> starts light under light OS, meta light, no uncaught error, no theme button
  {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('billing-storage-read-blocked'); };
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(route);
    const shell = page.locator('.billing-page');
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 248)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbf8'))).toBe(true);
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
      Storage.prototype.setItem = () => { throw new Error('billing-storage-write-blocked'); };
    });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(route);
    const shell = page.locator('.billing-page');
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
    await page.close();
  }
});

test('Billing defaults to dark without JavaScript under both OS preferences', async ({ browser }) => {
  const darkContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(route);
  const darkShell = darkPage.locator('.billing-page');
  await expect(darkShell).toHaveCSS('background-color', 'rgb(16, 28, 25)');
  await expect(darkPage.locator('.billing-theme-toggle')).toHaveCount(0);

  // All 18 services and 40 specialties rendered
  expect(await darkPage.locator('#services .billing-directory-card').count()).toBe(18);
  expect(await darkPage.locator('#specialties .billing-directory-card').count()).toBe(40);

  // Platform logo white plate
  await expect(darkPage.locator('.billing-platform-logo').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');

  // Contact and navigation links present
  await expect(darkPage.locator('.billing-nav a').first()).toBeVisible();
  await expect(darkPage.locator('.billing-contact-email')).toBeVisible();
  await darkContext.close();

  const lightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
  const lightPage = await lightContext.newPage();
  await lightPage.goto(route);
  const lightShell = lightPage.locator('.billing-page');
  await expect(lightShell).toHaveCSS('background-color', 'rgb(16, 28, 25)');
  await expect(lightPage.locator('.billing-theme-toggle')).toHaveCount(0);
  await lightContext.close();
});

test('Billing satisfies accessibility, responsive wrapping, target sizes, and reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(route);

  // Axe in dark mode
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  // Empty search state Axe check
  const search = page.locator('#services').getByRole('searchbox', { name: 'Search services' });
  await search.fill('no-such-item-contrast-check');
  await expect(page.locator('#services').getByRole('heading', { name: 'No matching services' })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.locator('#services').getByRole('button', { name: 'Show all services' }).click();

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

  // Test responsive widths: 320, 390, 768, 1440
  const widths = [320, 390, 768, 1440];
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
  const backLink = page.locator('.group-frame-back-link');
  await backLink.focus();
  await expect(backLink).toBeFocused();

  const brand = page.locator('.group-frame-brand');
  await brand.focus();
  await expect(brand).toBeFocused();

  const heroCta = page.locator('.billing-hero .billing-action');
  await heroCta.focus();
  await expect(heroCta).toBeFocused();

  const serviceSearch = page.locator('#services').getByRole('searchbox', { name: 'Search services' });
  await serviceSearch.focus();
  await expect(serviceSearch).toBeFocused();

  const contactCta = page.locator('.billing-contact .billing-action');
  await contactCta.focus();
  await expect(contactCta).toBeFocused();

  // 200% text sizing (zoom or font scale)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.billing-hero h1')).toBeVisible();
  await expect(page.locator('.group-frame-relation-text')).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '';
  });

  // Reduced motion: animations/transitions disabled and no transforms
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.billing-directory-card').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.billing-action').first()).toHaveCSS('transform', 'none');
});
