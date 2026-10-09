import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/companies/goodman-medical-equipment';

test.describe('Goodman Medical Equipment shared site theme', () => {
  // A. Standalone bespoke surface palettes and accessibility
  test('applies complete bespoke surface palettes in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      localStorage.setItem('goodman-group-theme', 'dark');
    });
    await page.goto(route);
    const shell = page.locator('.medical-equipment-page');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(shell).toHaveAttribute('data-theme', 'dark');
    await expect(shell).toHaveCSS('background-color', 'rgb(16, 28, 38)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#101c26'))).toBe(true);
    await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
    await expect(page.locator('.med-theme-toggle')).toHaveCount(0);

    // Dark mode surfaces
    await expect(page.locator('.med-hero')).toHaveCSS('background-color', 'rgb(26, 47, 63)');
    await expect(page.locator('.med-hero-panel')).toHaveCSS('background-color', 'rgb(27, 51, 68)');
    await expect(page.locator('.med-products article').first()).toHaveCSS('background-color', 'rgb(28, 49, 65)');
    await expect(page.locator('.med-products article:last-child')).toHaveCSS('background-color', 'rgb(37, 62, 80)');
    await expect(page.locator('.med-tinted').first()).toHaveCSS('background-color', 'rgb(23, 42, 56)');
    await expect(page.locator('.med-presence-grid article:last-child')).toHaveCSS('background-color', 'rgb(33, 59, 77)');
    await expect(page.locator('.med-disclosure').first()).toHaveCSS('background-color', 'rgb(28, 49, 65)');
    await expect(page.locator('.med-contact')).toHaveCSS('background-color', 'rgb(27, 51, 68)');
    await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(16, 28, 38)');

    // Logo plate stays intentional white; logo is visible
    const logoPlate = page.locator('.med-panel-brand');
    await expect(logoPlate).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(logoPlate.locator('img')).toBeVisible();

    // CTAs in dark mode
    const darkPrimaryCta = page.locator('.med-hero .med-action');
    await expect(darkPrimaryCta).toHaveCSS('background-color', 'rgb(167, 204, 226)');
    await expect(darkPrimaryCta).toHaveCSS('color', 'rgb(19, 35, 46)');

    const darkContactCta = page.locator('.med-contact .med-action');
    await expect(darkContactCta).toHaveCSS('background-color', 'rgb(199, 222, 235)');
    await expect(darkContactCta).toHaveCSS('color', 'rgb(19, 35, 46)');
  });

  test('applies complete bespoke surface palettes in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      localStorage.setItem('goodman-group-theme', 'light');
      localStorage.setItem('goodman-medical-equipment-theme', 'dark');
    });
    await page.goto(route);
    const shell = page.locator('.medical-equipment-page');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveAttribute('data-theme', 'light');
    await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 252)');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbfc'))).toBe(true);
    await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
    await expect(page.locator('.med-theme-toggle')).toHaveCount(0);

    // Light mode surfaces
    await expect(page.locator('.med-hero')).toHaveCSS('background-color', 'rgb(233, 239, 243)');
    await expect(page.locator('.med-hero-panel')).toHaveCSS('background-color', 'rgb(35, 61, 80)');
    await expect(page.locator('.med-products article').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.med-products article:last-child')).toHaveCSS('background-color', 'rgb(232, 239, 244)');
    await expect(page.locator('.med-tinted').first()).toHaveCSS('background-color', 'rgb(237, 242, 245)');
    await expect(page.locator('.med-presence-grid article:last-child')).toHaveCSS('background-color', 'rgb(226, 236, 242)');
    await expect(page.locator('.med-disclosure').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.med-contact')).toHaveCSS('background-color', 'rgb(35, 61, 80)');
    await expect(page.locator('.company-group-frame')).toHaveCSS('background-color', 'rgb(250, 251, 252)');

    // Logo plate in light mode
    const logoPlate = page.locator('.med-panel-brand');
    await expect(logoPlate).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(logoPlate.locator('img')).toBeVisible();

    // CTAs in light mode
    const lightPrimaryCta = page.locator('.med-hero .med-action');
    await expect(lightPrimaryCta).toHaveCSS('background-color', 'rgb(36, 60, 77)');
    await expect(lightPrimaryCta).toHaveCSS('color', 'rgb(255, 255, 255)');

    const lightContactCta = page.locator('.med-contact .med-action');
    await expect(lightContactCta).toHaveCSS('background-color', 'rgb(220, 233, 240)');
    await expect(lightContactCta).toHaveCSS('color', 'rgb(35, 61, 80)');
  });

  test('preserves disclosure expansion and native details behavior', async ({ page }) => {
    await page.goto(route);
    const workflowSummary = page.locator('.med-instrument-disclosure summary');
    const governanceDetails = page.locator('details:has(summary:has-text("Governance and control functions"))');
    await workflowSummary.click();
    await expect(page.locator('.med-instrument-disclosure')).toHaveAttribute('open', '');
    await expect(page.locator('.med-instrument-steps')).toBeVisible();
    await expect(governanceDetails).not.toHaveAttribute('open');
  });

  // B. Storage failure cases
  test('handles storage failure cases gracefully', async ({ browser }) => {
    // 1. Seed invalid storage value with light OS -> falls back to light device preference
    {
      const context = await browser.newContext({ colorScheme: 'light' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.addInitScript(() => {
        localStorage.setItem('goodman-group-theme', 'invalid');
        localStorage.setItem('goodman-medical-equipment-theme', 'light');
      });
      await page.goto(route);
      const shell = page.locator('.medical-equipment-page');
      await expect(shell).toHaveAttribute('data-theme', 'light');
      await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 252)');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
      await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbfc'))).toBe(true);
      expect(errors).toEqual([]);
      await context.close();
    }

    // 2. Storage.prototype.getItem throws before entry -> starts light under light OS without pageerror and no theme button
    {
      const context = await browser.newContext({ colorScheme: 'light' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new Error('storage-read-blocked'); };
      });
      await page.goto(route);
      const shell = page.locator('.medical-equipment-page');
      await expect(shell).toHaveAttribute('data-theme', 'light');
      await expect(shell).toHaveCSS('background-color', 'rgb(250, 251, 252)');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
      await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fafbfc'))).toBe(true);
      await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/i })).toHaveCount(0);
      expect(errors).toEqual([]);
      await context.close();
    }

    // 3. Storage.prototype.setItem throws -> operates in dark mode without uncaught error
    {
      const context = await browser.newContext({ colorScheme: 'dark' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.addInitScript(() => {
        Storage.prototype.setItem = () => { throw new Error('storage-write-blocked'); };
      });
      await page.goto(route);
      const shell = page.locator('.medical-equipment-page');
      await expect(shell).toHaveAttribute('data-theme', 'dark');
      expect(errors).toEqual([]);
      await context.close();
    }
  });
  // C. No-JavaScript behavior
  test('defaults to dark without JavaScript under both OS preferences', async ({ browser }) => {
    const darkContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
    try {
      const page = await darkContext.newPage();
      await page.goto(route);
      const shell = page.locator('.medical-equipment-page');

      // Dark canvas and cards
      await expect(shell).toHaveCSS('background-color', 'rgb(16, 28, 38)');
      await expect(page.locator('.med-products article').first()).toHaveCSS('background-color', 'rgb(28, 49, 65)');
      await expect(page.locator('.med-theme-toggle')).toHaveCount(0);

      // Native disclosure works
      const workflowSummary = page.locator('.med-instrument-disclosure summary');
      await workflowSummary.click();
      await expect(page.locator('.med-instrument-steps')).toBeVisible();

      // Navigation anchors and actions remain functional
      await expect(page.locator('a[href="#solutions"]').first()).toBeVisible();
      await expect(page.locator('a[href="#contact"]').first()).toBeVisible();
      await expect(page.locator('a[href="tel:+923367770770"]')).toBeVisible();
      await expect(page.locator('a[href="mailto:afgoodmangoc@gmail.com"]').first()).toBeVisible();
      await expect(page.locator('.group-frame-back-link')).toBeVisible();
    } finally {
      await darkContext.close();
    }

    const lightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
    try {
      const page = await lightContext.newPage();
      await page.goto(route);
      const shell = page.locator('.medical-equipment-page');
      await expect(shell).toHaveCSS('background-color', 'rgb(16, 28, 38)');
      await expect(page.locator('.med-products article').first()).toHaveCSS('background-color', 'rgb(28, 49, 65)');
      await expect(page.locator('.med-theme-toggle')).toHaveCount(0);
    } finally {
      await lightContext.close();
    }
  });

  // D. Accessibility, responsive layout, motion, and geometry
  test('satisfies accessibility, responsive wrapping, target sizes, and reduced motion', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(route);

    // Axe in dark mode with collapsed disclosures
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

    // Expand disclosures and check Axe again
    await page.locator('.med-instrument-disclosure summary').click();
    await page.locator('details:has(summary:has-text("Governance and control functions")) summary').click();
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
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

    // Responsive widths: 1440, 800, 390, 320
    const widths = [1440, 800, 390, 320];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      // No horizontal overflow
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

    const heroCta = page.locator('.med-hero .med-action');
    await heroCta.focus();
    await expect(heroCta).toBeFocused();

    const contactCta = page.locator('.med-contact .med-action');
    await contactCta.focus();
    await expect(contactCta).toBeFocused();

    // 200% text sizing
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('.med-hero h1')).toBeVisible();
      await expect(page.locator('.group-frame-relation-text')).toBeVisible();
      await expect(page.locator('.med-section-nav')).toBeVisible();
      await expect(page.locator('.med-contact a[href="mailto:afgoodmangoc@gmail.com"]').first()).toBeVisible();
      await expect(contactCta).toBeVisible();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '';
      });
    }

    // Reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.med-action').first()).toHaveCSS('transform', 'none');
    // Workflow connector geometry at all four widths
    await page.evaluate(() => window.scrollTo(0, 0));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      const stages = page.locator('.med-workflow li');

      for (let index = 0; index < 4; index += 1) {
        const circle = await stages.nth(index).locator('.med-workflow-marker > span').boundingBox();
        const arrow = await stages.nth(index).locator('.med-workflow-marker svg').boundingBox();
        const nextCircle = await stages.nth(index + 1).locator('.med-workflow-marker > span').boundingBox();

        expect(circle).not.toBeNull();
        expect(arrow).not.toBeNull();
        expect(nextCircle).not.toBeNull();
        expect(arrow!.y).toBeGreaterThan(circle!.y + circle!.height);
        expect(arrow!.y + arrow!.height).toBeLessThan(nextCircle!.y);
      }
      await expect(stages.last().locator('svg')).toHaveCount(0);
    }
  });
});
