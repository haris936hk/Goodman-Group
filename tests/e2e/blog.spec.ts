import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import sharp from 'sharp';

const adminEmail = process.env.CMS_TEST_ADMIN_EMAIL;
const adminPassword = process.env.CMS_TEST_ADMIN_PASSWORD;

for (const theme of ['light', 'dark'] as const) {
  test(`empty Blog is accessible in ${theme} theme`, async ({ page, isMobile }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript((storedTheme) => {
      window.localStorage.setItem('goodman-group-theme', storedTheme);
    }, theme);
    await page.goto('/blog');

    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No announcements yet', level: 2 })).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Blog pagination' })).toHaveCount(0);

    const isMobileNav = isMobile || (await page.getByRole('button', { name: 'Open navigation' }).isVisible());
    if (isMobileNav) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const mobileNavigation = page.getByRole('navigation', { name: 'Mobile navigation' });
      await expect(mobileNavigation).toBeVisible();
      await expect(mobileNavigation.getByRole('link', { name: /Blog/ })).toHaveAttribute('aria-current', 'page');
      await page.getByRole('button', { name: 'Close navigation' }).click();
      await expect(mobileNavigation).not.toBeVisible();
    } else {
      const primaryNavigation = page.getByRole('navigation', { name: 'Primary navigation' });
      await expect(primaryNavigation.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    }
    await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test('Blog navigation works at a mobile viewport and marks the current section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open navigation' }).click();
  const mobileNavigation = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole('link', { name: /Blog/ }).click();
  await expect(page).toHaveURL(/\/blog$/);

  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Blog/ })).toHaveAttribute('aria-current', 'page');
});

test('anonymous visitors cannot read administrator or version metadata or use bootstrap and recovery endpoints', async ({ page, request }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login(?:\?|$)/);
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  for (const path of ['/admin/create-first-user', '/admin/forgot-password', '/admin/reset-password']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Terminal access required' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Administrator login' })).toHaveAttribute('href', '/admin/login');
  }

  const privateReads = [
    '/api/cms/administrators',
    '/api/cms/announcements/versions',
  ];
  for (const path of privateReads) {
    const response = await request.get(path);
    expect([401, 403]).toContain(response.status());
    const body = await response.text();
    if (adminEmail) expect(body).not.toContain(adminEmail);
  }

  const forbiddenMutations = [
    { path: '/api/cms/administrators/first-register', data: { email: 'anonymous@example.test', password: 'not-a-real-password' } },
    { path: '/api/cms/administrators/forgot-password', data: { email: 'anonymous@example.test' } },
    { path: '/api/cms/administrators/reset-password', data: { token: 'invalid', password: 'not-a-real-password' } },
  ];
  for (const { path, data } of forbiddenMutations) {
    const response = await request.post(path, { data });
    expect(response.status()).toBe(403);
    if (adminEmail) expect(await response.text()).not.toContain(adminEmail);
  }
});

test('an authenticated editor can save a draft while anonymous article and preview requests reveal no draft text', async ({ page, browser, request }, testInfo) => {
  test.skip(!adminEmail || !adminPassword, 'Requires the disposable CMS Playwright administrator fixture.');
  test.setTimeout(90_000);

  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(adminEmail!);
  await page.getByLabel('Password').fill(adminPassword!);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === '/admin');
  await expect(page).not.toHaveURL(/\/admin\/login/);

  await page.getByRole('link', { name: 'Create new Announcements' }).click();
  await page.waitForURL(/\/admin\/collections\/announcements\/\d+$/);

  const idMatch = page.url().match(/\/admin\/collections\/announcements\/([^/?#]+)/);
  const id = idMatch?.[1] ? String(idMatch[1]) : '';
  expect(id).not.toBe('');

  await expect(page.getByLabel('Title')).toBeVisible();

  const title = `E2E private draft ${testInfo.parallelIndex}-${Date.now()}`;
  const summary = `E2E-only private summary ${testInfo.parallelIndex}-${Date.now()}`;

  const imageAlt = 'Equipment demonstration at a Group event';
  const imageCaption = 'Group equipment demonstration';
  await page.getByRole('button', { name: 'Create New', exact: true }).click();
  await expect(page.getByLabel(/^Alt\b/)).toBeVisible();
  const imageBytes = await sharp({ create: { width: 2400, height: 1350, channels: 3, background: '#185678' } }).png().toBuffer();
  await page.locator('input[type="file"]').setInputFiles({ name: `blog-e2e-${Date.now()}.png`, mimeType: 'image/png', buffer: imageBytes });
  await page.getByLabel(/^Alt\b/).fill(imageAlt);
  await page.getByLabel('Caption').fill(imageCaption);
  const uploadPromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/api/cms/media' && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const upload = await uploadPromise;
  expect(upload.status()).toBe(201);
  const { doc: media } = await upload.json();
  expect(media).toMatchObject({ id: expect.any(Number), url: expect.any(String), alt: imageAlt });
  await expect(page.getByLabel(/^Alt\b/)).not.toBeVisible();

  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Summary').fill(summary);
  await expect.poll(() => page.evaluate(async (draftId) => {
    const response = await fetch(`/api/cms/announcements/${draftId}?draft=true&depth=0`);
    if (!response.ok) throw new Error(`Draft read failed: ${response.status}`);
    const doc = await response.json();
    return { title: doc.title, summary: doc.summary, coverImage: doc.coverImage };
  }, id), { timeout: 60_000 }).toEqual({ title, summary, coverImage: media.id });
  const slug = title.toLowerCase().replaceAll(' ', '-');
  const anonymousContext = await browser.newContext({
    baseURL: new URL(page.url()).origin,
    ...testInfo.project.use,
  });
  const anonymousPage = await anonymousContext.newPage();

  try {
    await page.goto(`/blog/preview/${id}`);
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    await expect(page.getByText('PRIVATE PREVIEW · SAVED DRAFT')).toBeVisible();
    await expect(page.getByText(summary)).toBeVisible();
    await expect(page.getByRole('img', { name: imageAlt })).toBeVisible();
    await expect(page.getByText(imageCaption)).toBeVisible();
    const publicImage = await request.get(media.url);
    expect(publicImage.status()).toBe(200);
    expect(publicImage.headers()['content-type']).toContain('image/png');

    const highDensityContext = await browser.newContext({
      baseURL: new URL(page.url()).origin,
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 3,
      storageState: await page.context().storageState(),
    });
    try {
      const highDensityPreview = await highDensityContext.newPage();
      await highDensityPreview.goto(`/blog/preview/${id}`);
      const coverImage = highDensityPreview.getByRole('img', { name: imageAlt });
      await expect(coverImage).toBeVisible();
      await expect.poll(() => coverImage.evaluate(async (image: HTMLImageElement) => {
        await image.decode();
        return new URL(image.currentSrc).pathname;
      })).toBe(new URL(media.url, page.url()).pathname);
    } finally {
      await highDensityContext.close();
    }

    const draftResponse = await anonymousPage.goto(`/blog/${slug}`);
    expect(draftResponse?.status()).toBe(404);
    await expect(anonymousPage.getByRole('heading', { name: 'This announcement is not available.' })).toBeVisible();

    const isAnonymousMobile = Boolean(testInfo.project.use?.isMobile) || (await anonymousPage.getByRole('button', { name: 'Open navigation' }).isVisible());
    if (isAnonymousMobile) {
      await anonymousPage.getByRole('button', { name: 'Open navigation' }).click();
      const mobileNav = anonymousPage.getByRole('navigation', { name: 'Mobile navigation' });
      await expect(mobileNav).toBeVisible();
      await expect(mobileNav.getByRole('link', { name: /Blog/ })).toHaveAttribute('aria-current', 'page');
      await anonymousPage.getByRole('button', { name: 'Close navigation' }).click();
      await expect(mobileNav).not.toBeVisible();
    } else {
      await expect(anonymousPage.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    }

    const publicList = await request.get('/api/cms/announcements');
    expect(publicList.status()).toBe(200);
    const publicListBody = await publicList.text();
    expect(publicListBody).not.toContain(title);
    expect(publicListBody).not.toContain(summary);

    const anonymousVersions = await request.get('/api/cms/announcements/versions');
    expect([401, 403]).toContain(anonymousVersions.status());
    expect(await anonymousVersions.text()).not.toContain(title);

    const previewResponse = await anonymousPage.goto(`/blog/preview/${id}`);
    expect(previewResponse?.status()).toBe(200);
    await expect(anonymousPage.getByRole('heading', { name: 'Administrator sign-in required' })).toBeVisible();
    await expect(anonymousPage.getByRole('link', { name: 'Continue to administrator sign in' })).toHaveAttribute('href', '/admin/login');
    const anonymousPreviewText = await anonymousPage.locator('body').innerText();
    expect(anonymousPreviewText).not.toContain(title);
    expect(anonymousPreviewText).not.toContain(summary);
    const previewHTML = await previewResponse!.text();
    expect(previewHTML).not.toContain(title);
    expect(previewHTML).not.toContain(summary);
    expect(previewResponse!.headers()['cache-control']).toContain('no-store');
    expect(previewResponse!.headers()['x-robots-tag']).toContain('noindex');
  } finally {
    if (id) {
      const deleteStatus = await page.evaluate(async (documentID) => {
        const response = await fetch(`/api/cms/announcements/${encodeURIComponent(documentID)}`, { method: 'DELETE' });
        return response.status;
      }, id);
      expect([200, 204]).toContain(deleteStatus);
    }
    const deleteMediaStatus = await page.evaluate(async (mediaID) => (await fetch(`/api/cms/media/${mediaID}`, { method: 'DELETE' })).status, media.id);
    expect([200, 204]).toContain(deleteMediaStatus);
    await anonymousContext.close();
  }
});
