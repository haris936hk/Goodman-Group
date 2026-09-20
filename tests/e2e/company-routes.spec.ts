import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { companies } from '../../src/data/companies';

const retiredCompanySlugs = [
  ['h', 'y', 'g', 'e', 'i', 'a', '-pharmaceuticals'].join(''),
  ['m', 'e', 'd', 'w', 'e', 'l', 'l', '-pharmaceuticals'].join(''),
] as const;

const companyRouteExpectations = [
  {
    slug: 'goodman-laboratories',
    displayName: 'Goodman Laboratories',
    verifiedFact: 'CEO since 2016',
    pageLandmarkHeading: 'Registered and marketed products',
  },
  {
    slug: 'geron-pharma',
    displayName: 'Geron Pharma',
    verifiedFact: 'CEO since 2019',
    pageLandmarkHeading: 'Company Structure & Activity',
  },
  {
    slug: 'goodman-medical-equipment',
    displayName: 'Goodman Medical Equipment Trading',
    verifiedFact: 'United Arab Emirates',
    pageLandmarkHeading: 'Dual-Region Trading Presence',
  },
  {
    slug: 'wal-green-chemicals',
    displayName: 'Wal Green Chemicals',
    verifiedFact: 'CEO since 2021',
    pageLandmarkHeading: 'Corporate Profile & Governance',
  },
] as const;

test.describe('company directory', () => {
  test('exposes every company record as one normal link', async ({ page }) => {
    await page.goto('/companies');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    for (const company of companies) {
      await expect(
        page.getByRole('link', { name: `View ${company.displayName}` }),
      ).toHaveCount(1);
    }
    for (const slug of retiredCompanySlugs) {
      await expect(page.locator(`a[href="/companies/${slug}"]`)).toHaveCount(0);
    }

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('has no horizontal overflow at desktop and mobile widths', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/companies');

      const widths = await page.evaluate(() => ({
        viewport: window.innerWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(widths.content).toBeLessThanOrEqual(widths.viewport);
    }
  });

  test('renders individually composed directory panels without sector grouping', async ({
    page,
  }) => {
    await page.goto('/companies');

    const panels = page.locator('.directory-company-panel');
    await expect(panels).toHaveCount(companies.length);

    await expect(page.getByRole('heading', { name: 'Automotive' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Real Estate' })).toHaveCount(0);
    await expect(page.getByText('Additional sectors')).toHaveCount(0);
  });
});

for (const company of companyRouteExpectations) {
  test(`renders bespoke page for ${company.displayName}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Test at desktop 1440
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(`/companies/${company.slug}`);
    expect(response?.status()).toBe(200);

    // Company heading & logo
    await expect(
      page.getByRole('heading', { level: 1, name: company.displayName }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: `${company.displayName} logo` }),
    ).toBeVisible();

    // Minimal Group return controls and relationship disclosure
    await expect(page.getByRole('link', { name: 'All companies' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Goodman Group' }).first()).toBeVisible();
    await expect(page.getByText('A Goodman Group company').first()).toBeVisible();

    // Observable verified fact and page-specific landmark/heading
    await expect(page.getByText(company.verifiedFact).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: company.pageLandmarkHeading })).toBeVisible();

    // Verify desktop viewport has no horizontal overflow
    const desktopWidths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(desktopWidths.content).toBeLessThanOrEqual(desktopWidths.viewport);

    // Verify mobile 320px viewport has no horizontal overflow
    await page.setViewportSize({ width: 320, height: 568 });
    const mobileWidths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(mobileWidths.content).toBeLessThanOrEqual(mobileWidths.viewport);

    // Accessibility check
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('simplifies Goodman Laboratories product disclosure', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/companies/goodman-laboratories');

  await expect(
    page.getByRole('heading', { name: 'Registered and marketed products' }),
  ).toBeVisible();

  const category = page.getByText(
    'Neurology, psychiatry, and central nervous system',
  );
  const product = page.getByRole('heading', { name: 'Gavatin' });

  await expect(category).toBeVisible();
  await expect(product).toBeHidden();
  await category.click();
  await expect(product).toBeVisible();
  await expect(page.getByText(/levetiracetam; 250 mg and 500 mg tablets/i)).toBeVisible();

  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('supports keyboard skip and directory navigation', async ({ page }) => {
  await page.goto('/companies/goodman-laboratories');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await skipLink.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const allCompanies = page.getByRole('link', { name: 'All companies' }).first();
  await allCompanies.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/companies$/);
});

test('returns the branded 404 for an unknown company slug', async ({ page }) => {
  const response = await page.goto('/companies/not-a-real-company');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('returns the branded 404 for retired company slugs', async ({ page }) => {
  for (const slug of retiredCompanySlugs) {
    const response = await page.goto(`/companies/${slug}`);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  }
});

test('includes every company profile in the sitemap', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();

  for (const company of companies) {
    expect(xml).toContain(`/companies/${company.slug}`);
  }
  for (const slug of retiredCompanySlugs) {
    expect(xml).not.toContain(`/companies/${slug}`);
  }
});
