import { test, expect } from '@playwright/test';

const endpoint = 'https://www.nasa.gov/feed/';
const fixture = `<?xml version="1.0"?><rss version="2.0"><channel>
<item><title>Example science headline A</title><link>https://www.nasa.gov/example-a/</link><pubDate>Fri, 23 Oct 2026 12:00:00 GMT</pubDate></item>
<item><title>Example science headline B</title><link>https://www.nasa.gov/example-b/</link><pubDate>Fri, 23 Oct 2026 11:00:00 GMT</pubDate></item>
</channel></rss>`;

async function openNews(page) {
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: 'Live news', exact: true }).click();
}

test('news is opt-in, attributed and searchable with local licensed typography', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, async (route) => {
    requests++;
    expect(route.request().headers()['cookie']).toBeUndefined();
    expect(route.request().headers()['referer']).toBeUndefined();
    await route.fulfill({ contentType: 'application/rss+xml', body: fixture, headers: { 'access-control-allow-origin': '*' } });
  });
  await openNews(page);
  expect(requests).toBe(0);
  await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
  await expect(page.locator('.atlas-news-card')).toHaveCount(2);
  expect(requests).toBe(1);
  await expect(page.locator('.atlas-feed-time')).toContainText('Fetched');
  await expect(page.getByRole('button', { name: /Refresh available in/ })).toBeDisabled();
  await page.getByLabel('Search headlines').fill('headline B');
  await expect(page.locator('.atlas-news-card')).toHaveCount(1);
  await expect(page.locator('.atlas-news-card')).toContainText('NASA');
  await expect(page.locator('.atlas-news-card a')).toHaveAttribute('href', 'https://www.nasa.gov/example-b/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator('.atlas').evaluate(node => getComputedStyle(node).fontFamily)).toContain('Mona Sans');
  expect(await page.evaluate(() => document.fonts.check('13px "Mona Sans Variable"'))).toBe(true);
});

test('reading requires opening source, full timer and self-report; no duplicates or persistence', async ({ page, context }) => {
  await page.clock.install();
  await context.route('https://www.nasa.gov/**', async (route) => {
    await route.fulfill({ contentType: route.request().url() === endpoint ? 'application/rss+xml' : 'text/html',
      body: route.request().url() === endpoint ? fixture : '<h1>Controlled test publisher destination</h1>',
      headers: { 'access-control-allow-origin': '*' } });
  });
  await openNews(page);
  await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
  await expect(page.locator('.atlas-news-card')).toHaveCount(2);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open source & start 30s activity', exact: true }).first().click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe('https://www.nasa.gov/example-a/');
  await popup.close();
  const complete = page.getByRole('button', { name: 'Mark complete', exact: true });
  await expect(complete).toBeDisabled();
  await page.getByRole('checkbox', { name: /I opened the source/ }).check();
  await page.clock.fastForward(29_000);
  await expect(complete).toBeDisabled();
  await page.clock.fastForward(1_000);
  await expect(complete).toBeEnabled();
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await page.getByRole('button', { name: 'Live news', exact: true }).click();
  await expect(complete).toBeEnabled();
  await complete.click();
  await expect(page.getByText('Completed (self-reported)', { exact: true })).toHaveCount(1);
  await page.getByRole('button', { name: 'Completed (1)', exact: true }).click();
  await expect(page.locator('.atlas-news-card')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Open source & start 30s activity', exact: true })).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Live news', exact: true }).click();
  await expect(page.getByText('Completed (self-reported)', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Load live headlines', exact: true })).toBeVisible();
});

test('publisher HTTP, XML, unsafe destination and oversized failures never become sample news', async ({ page }) => {
  for (const [status, body] of [[503, 'unavailable'], [200, '<rss>broken'],
    [200, fixture.replace('https://www.nasa.gov/example-a/', 'https://evil.example/story')],
    [200, '<!DOCTYPE rss [<!ENTITY x "blocked">]><rss/>'], [200, 'x'.repeat(1_048_577)]]) {
    await page.route(endpoint, (route) => route.fulfill({ status, contentType: 'application/rss+xml', body,
      headers: { 'access-control-allow-origin': '*' } }));
    await openNews(page);
    await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Live feed unavailable');
    await expect(page.getByRole('alert')).toContainText('No sample stories have been substituted');
    await expect(page.locator('.atlas-news-card')).toHaveCount(0);
    await page.unroute(endpoint);
  }
});

test('populated news grid fits all viewports and keyboard-accessible reading controls', async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ contentType: 'application/rss+xml', body: fixture,
    headers: { 'access-control-allow-origin': '*' } }));
  await openNews(page);
  await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
  await expect(page.locator('.atlas-news-card')).toHaveCount(2);
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByLabel('Search headlines').focus();
    await expect(page.getByLabel('Search headlines')).toBeFocused();
    const panel = await page.locator('.atlas-tool-panel').boundingBox();
    expect(panel.width).toBeLessThanOrEqual(width);
  }
});

test('refresh failures warn about retained headlines and cancel abandons reading', async ({ page, context }) => {
  await page.clock.install();
  let requests = 0;
  await context.route('https://www.nasa.gov/**', async (route) => {
    if (route.request().url() !== endpoint) {
      await route.fulfill({ contentType: 'text/html', body: '<h1>Controlled publisher article</h1>' });
      return;
    }
    requests++;
    await route.fulfill({ status: requests === 1 ? 200 : 503, contentType: 'application/rss+xml',
      body: requests === 1 ? fixture : 'Unavailable', headers: { 'access-control-allow-origin': '*' } });
  });
  await openNews(page);
  await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
  await expect(page.locator('.atlas-news-card')).toHaveCount(2);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open source & start 30s activity', exact: true }).first().click();
  await (await popupPromise).close();
  await page.getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Active reading activity' })).toHaveCount(0);
  await expect(page.getByText('Completed (self-reported)', { exact: true })).toHaveCount(0);
  await page.clock.fastForward(61_000);
  await page.getByRole('button', { name: 'Refresh headlines', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Previously fetched headlines below may be outdated');
  await expect(page.locator('.atlas-news-card')).toHaveCount(2);
});

test('actual official NASA feed loads without mocks through deployed browser CSP and CORS', async ({ page }) => {
  test.setTimeout(40_000);
  await openNews(page);
  const responsePromise = page.waitForResponse(endpoint);
  await page.getByRole('button', { name: 'Load live headlines', exact: true }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  await expect(page.locator('.atlas-news-card').first()).toBeVisible({ timeout: 15_000 });
  const count = await page.locator('.atlas-news-card').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(12);
  await expect(page.locator('.atlas-news-card a').first()).toHaveAttribute('href', /^https:\/\/(?:www|science)\.nasa\.gov\//);
  await expect(page.locator('.atlas-news-card time').first()).toHaveAttribute('dateTime', /^\d{4}-\d{2}-\d{2}T/);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
