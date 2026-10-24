import { test, expect } from '@playwright/test';

test('corporate and Digital 2030 deep links survive reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of ['/', '/products', '/products/dash-rush', '/learn', '/digital2030',
    '/digital2030/ai', '/digital2030/education', '/digital2030/services',
    '/digital2030/cybersecurity', '/digital2030/business', '/digital2030/impact']) {
    const response = await page.goto(route);
    expect(response.status()).toBe(process.env.STATIC_HOST === 'github' && route !== '/' ? 404 : 200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).not.toHaveText('404');
    await expect(page).toHaveURL(new RegExp(`${route === '/' ? '/' : route}$`));
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('deep-link query strings and fragments survive static host redirects', async ({ page }) => {
  await page.goto('/developers/docs?source=roadmap&campaign=public#feedback');
  await expect(page.getByRole('heading', { name: 'Start using our public tools' })).toBeVisible();
  await expect(page).toHaveURL(/\/developers\/docs\?source=roadmap&campaign=public#feedback$/);
});

test('business and safety inputs stay local and produce bounded truthful output', async ({ page }) => {
  await page.goto('/digital2030/business');
  await expect(page.getByLabel('Tool', { exact: true })).toBeVisible();
  const outbound = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    // A delayed branding image is unrelated to submitted tool inputs.
    if (request.resourceType() === 'image' && url.origin === new URL(page.url()).origin &&
      url.pathname === '/brand/logo-mark.png' && !url.search) return;
    outbound.push(request.url());
  });
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
  await expect(page.getByLabel('Message or URL')).toBeVisible();
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
  const github = process.env.STATIC_HOST === 'github';
  const appResponse = github ? await request.get('/') : response;
  if (!github) {
    expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
    expect(response.headers()['x-robots-tag']).toContain('noindex');
  }
  expect(await appResponse.text()).toContain('http-equiv="Content-Security-Policy"');
  const preview = await request.get('/code-preview.html');
  if (!github) expect(preview.headers()['content-security-policy']).toContain('sandbox allow-scripts');
  expect(await preview.text()).toContain("connect-src 'none'");
  expect(await preview.text()).toContain('/code-preview.js');
  const html = await appResponse.text();
  const assetPath = html.match(/src="([^"]+\/assets\/[^"]+\.js)"/)?.[1] ??
    html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
  expect(assetPath).toBeTruthy();
  const asset = await request.get(assetPath);
  expect(asset.headers()['content-type']).toMatch(/javascript/);
});

test('developer guides, project details and roadmap are connected and reloadable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/developers');
  await page.getByRole('link', { name: 'Read the documentation', exact: true }).click();
  await expect(page).toHaveURL(/\/developers\/docs$/);
  await expect(page.getByRole('heading', { name: 'Start using our public tools' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: 'Feedback and contributions' }).click();
  await expect(page).toHaveURL(/#feedback$/);
  await expect(page.locator('#feedback')).toBeInViewport();
  for (const [route, title] of [
    ['/developers/projects', 'Public project guides'],
    ['/products/jovexa-learn', 'Jovexa Learn'],
    ['/products/digital2030', 'Jovexa Digital 2030'],
  ]) {
    await page.goto(route);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://jovexalabs.com${route}`);
    await page.setViewportSize({ width: 390, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(page.locator('main')).toContainText('No PHBIN issuance');
  await page.goto('/roadmap');
  await expect(page.getByRole('heading', { name: 'Growth milestone: developer resources' })).toBeVisible();
  await page.goto('/products/constructor');
  await expect(page.getByRole('heading', { name: '404', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('public contributions do not require private repository access or grant a source license', async ({ page }) => {
  await page.goto('/learn/community');
  await expect(page.locator('main a[href*="jovexalabs.com/issues"], main a[href*="jovexalabs.com/pulls"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Report an Issue/ })).toHaveAttribute('href', /^mailto:admin@jovexalabs\.com/);
  await page.getByRole('link', { name: 'feedback and contribution guide' }).click();
  await expect(page.locator('main')).toContainText('all-rights-reserved license');
  await expect(page.locator('main')).toContainText('not an authenticated API');
});
