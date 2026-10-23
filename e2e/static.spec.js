import { test, expect } from '@playwright/test';

test('corporate and Digital 2030 deep links survive reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/', '/products', '/products/dash-rush', '/learn', '/digital2030',
    '/digital2030/ai', '/digital2030/education', '/digital2030/services',
    '/digital2030/cybersecurity', '/digital2030/business', '/digital2030/impact']) {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('business and safety inputs stay local and produce bounded truthful output', async ({ page }) => {
  await page.goto('/digital2030/business');
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete))).toBe(true);
  const outbound = [];
  page.on('request', (request) => outbound.push(request.url()));
  await page.getByLabel('Tool', { exact: true }).selectOption('quotation');
  await page.getByLabel('Business name').fill('Clearly marked local test');
  await page.getByLabel('Customer / target audience').fill('Fictional customer');
  await page.getByLabel('Product or service').fill('Demo only');
  await page.getByLabel('Quantity', { exact: true }).fill('3');
  await page.getByLabel('Unit price (PHP)').fill('0.10');
  await page.getByRole('button', { name: 'Generate locally' }).click();
  await expect(page.locator('.digital-draft')).toContainText('0.30');
  expect(outbound).toEqual([]);
  await page.goto('/digital2030/cybersecurity');
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete))).toBe(true);
  outbound.length = 0;
  await page.getByLabel('Message or URL').fill('URGENT share OTP at http://127.0.0.1');
  await page.getByRole('button', { name: 'Check warning signs locally' }).click();
  await expect(page.getByRole('heading', { name: 'Warning signs found' })).toBeVisible();
  expect(outbound).toEqual([]);
});

test('mobile and tablet navigation fits without horizontal overflow', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/digital2030/business');
    if (width <= 1024) await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Digital 2030' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Code Lab executes in an isolated frame with network and parent access blocked', async ({ page }) => {
  await page.goto('/learn/playground');
  await page.getByRole('textbox', { name: 'Code editor' }).fill(`<p id="result">Starting</p><script>
    let isolated = false;
    try { parent.document.body.dataset.test = 'unsafe'; } catch { isolated = true; }
    fetch('/unexpected-preview-network-request').then(
      () => document.getElementById('result').textContent = 'NETWORK ALLOWED',
      () => document.getElementById('result').textContent = isolated ? 'ISOLATED AND NETWORK BLOCKED' : 'PARENT ACCESS ALLOWED'
    );
  </script>`);
  await page.getByRole('button', { name: /Run/ }).click();
  await expect(page.frameLocator('iframe[title="Code result"]').locator('#result')).toHaveText('ISOLATED AND NETWORK BLOCKED');
  expect(await page.locator('body').getAttribute('data-test')).toBeNull();
});

test('security headers protect main app and separately sandbox the preview', async ({ request }) => {
  const response = await request.get('/digital2030');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['x-robots-tag']).toContain('noindex');
  const preview = await request.get('/code-preview');
  expect(preview.headers()['content-security-policy']).toContain('sandbox allow-scripts');
  expect(preview.headers()['content-security-policy']).toContain("connect-src 'none'");
  expect(await preview.text()).toContain('/code-preview.js');
  const html = await response.text();
  const assetPath = html.match(/src="([^"]+\/assets\/[^"]+\.js)"/)?.[1] ??
    html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
  expect(assetPath).toBeTruthy();
  const asset = await request.get(assetPath);
  expect(asset.headers()['content-type']).toMatch(/javascript/);
});
