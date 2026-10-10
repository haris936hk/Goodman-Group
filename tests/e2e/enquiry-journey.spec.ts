import { expect, test } from '@playwright/test';

test.describe('Enquiry form user journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('submits valid enquiry with mock API and renders confirmation view with reset', async ({ page }) => {
    let requestPayload: unknown;
    await page.route('/api/enquiries', async (route) => {
      requestPayload = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByLabel(/Full name/).fill('Jane Partner');
    await page.getByLabel(/Email address/).fill('jane@example.com');
    await page.getByLabel(/Organisation/).fill('Healthcare Global');

    // Select company via React Aria Select
    await page.getByRole('button', { name: /Choose a company/ }).click();
    await page.getByRole('option', { name: 'Goodman Group / Not sure' }).click();

    // Select purpose via React Aria Select
    await page.getByRole('button', { name: /Select enquiry purpose/ }).click();
    await page.getByRole('option', { name: 'Partnership' }).click();

    await page.getByLabel(/^Message/).fill('Inquiry regarding medical device distribution opportunities.');

    await page.getByRole('button', { name: 'Send enquiry' }).click();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Thank you, Jane Partner. Your enquiry has been received.');
    await expect(status.getByText('We’ll respond within 24 hours')).toBeVisible();

    expect(requestPayload).toMatchObject({
      name: 'Jane Partner',
      email: 'jane@example.com',
      organisation: 'Healthcare Global',
      company: 'group',
      enquiryType: 'partnership',
    });

    // Reset via "Send another enquiry"
    await page.getByRole('button', { name: 'Send another enquiry' }).click();
    await expect(page.getByLabel(/Full name/)).toHaveValue('');
    await expect(page.getByRole('button', { name: /Choose a company/ })).toBeVisible();
  });

  test('focuses first invalid field and renders accessible error messages when submitted empty', async ({ page }) => {
    let apiCalled = false;
    await page.route('/api/enquiries', async (route) => {
      apiCalled = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.getByRole('button', { name: 'Send enquiry' }).click();

    await expect(page.getByLabel(/Full name/)).toBeFocused();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    expect(apiCalled).toBe(false);
  });

  test('displays rate-limiting alert banner on HTTP 429 response', async ({ page }) => {
    await page.route('/api/enquiries', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'Retry-After': '600' },
        body: JSON.stringify({
          ok: false,
          message: 'You’ve sent several enquiries. Please wait 10 minutes before trying again.',
        }),
      });
    });

    await page.getByLabel(/Full name/).fill('Jane Partner');
    await page.getByLabel(/Email address/).fill('jane@example.com');
    await page.getByRole('button', { name: /Choose a company/ }).click();
    await page.getByRole('option', { name: 'Goodman Group / Not sure' }).click();
    await page.getByRole('button', { name: /Select enquiry purpose/ }).click();
    await page.getByRole('option', { name: 'Partnership' }).click();
    await page.getByLabel(/^Message/).fill('Follow-up enquiry.');

    await page.getByRole('button', { name: 'Send enquiry' }).click();

    const alert = page.locator('.enquiry-alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('You’ve sent several enquiries. Please wait 10 minutes');
  });

  test('handles delivery failure HTTP 503 and preserves user input for retry', async ({ page }) => {
    let attempts = 0;
    await page.route('/api/enquiries', async (route) => {
      attempts += 1;
      if (attempts === 1) {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, message: 'Delivery temporarily unavailable' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }
    });

    await page.getByLabel(/Full name/).fill('Jane Partner');
    await page.getByLabel(/Email address/).fill('jane@example.com');
    await page.getByRole('button', { name: /Choose a company/ }).click();
    await page.getByRole('option', { name: 'Goodman Group / Not sure' }).click();
    await page.getByRole('button', { name: /Select enquiry purpose/ }).click();
    await page.getByRole('option', { name: 'General Enquiry' }).click();
    await page.getByLabel(/^Message/).fill('Testing delivery retry.');

    await page.getByRole('button', { name: 'Send enquiry' }).click();

    await expect(page.locator('.enquiry-alert')).toContainText('Delivery temporarily unavailable');
    await expect(page.getByLabel(/Full name/)).toHaveValue('Jane Partner');

    // Second attempt succeeds
    await page.getByRole('button', { name: 'Send enquiry' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    expect(attempts).toBe(2);
  });

  test('debounces submission and disables submit button while in flight', async ({ page }) => {
    let requestsCount = 0;
    let resolveResponse: (() => void) | undefined;

    await page.route('/api/enquiries', async (route) => {
      requestsCount += 1;
      await new Promise<void>((resolve) => {
        resolveResponse = resolve;
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.getByLabel(/Full name/).fill('Jane Partner');
    await page.getByLabel(/Email address/).fill('jane@example.com');
    await page.getByRole('button', { name: /Choose a company/ }).click();
    await page.getByRole('option', { name: 'Goodman Group / Not sure' }).click();
    await page.getByRole('button', { name: /Select enquiry purpose/ }).click();
    await page.getByRole('option', { name: 'Partnership' }).click();
    await page.getByLabel(/^Message/).fill('Debounce verification message.');

    const submitBtn = page.getByRole('button', { name: 'Send enquiry' });
    await submitBtn.dblclick();

    expect(requestsCount).toBe(1);
    await expect(page.getByRole('button', { name: 'Sending enquiry...' })).toBeDisabled();

    // Finish request
    resolveResponse?.();
    await expect(page.getByRole('status')).toBeVisible();
  });
});
