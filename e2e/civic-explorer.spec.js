import { test, expect } from '@playwright/test';

test('world map renders local geography and search selects a regional dossier', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/prototype/explorer');
  await expect(page.getByRole('heading', { name: 'Atlas Civic Explorer' })).toBeVisible();
  await expect(page.locator('.atlas-disclosure')).toContainText('NOT LIVE DATA');
  await expect(page.locator('.atlas-land')).toHaveAttribute('d', /^M/);
  await expect(page.getByRole('button', { name: /^Explore / })).toHaveCount(10);
  await page.getByLabel('Search country, capital, or continent').fill('Canada');
  await expect(page.getByRole('status')).toContainText('1 of 10');
  await page.getByRole('button', { name: /Canada Ottawa/ }).click();
  await expect(page.getByRole('heading', { name: 'Canada', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resources', exact: true }).click();
  await expect(page.getByRole('link', { name: /Visit official Canada/ })).toHaveAttribute('href', 'https://www.canada.ca/');
  await page.getByLabel('Search country, capital, or continent').fill('<script>');
  await expect(page.getByText('No matching regions.', { exact: false })).toBeVisible();
  await expect(page.getByText('Selected dossier is outside', { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
});

test('layers filter map markers and keyboard activation opens a dossier', async ({ page }) => {
  await page.goto('/prototype/explorer');
  const pin = page.getByRole('button', { name: 'Explore Japan', exact: true });
  await pin.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Japan', exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Explorer tools' }).getByRole('button', { name: 'Layers', exact: true }).click();
  for (const name of ['Learning', 'Public services', 'Community']) await page.getByRole('checkbox', { name, exact: true }).uncheck();
  await expect(page.getByRole('button', { name: /^Explore / })).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Learning', exact: true }).check();
  await expect(page.getByRole('button', { name: /^Explore / })).toHaveCount(3);
});

test('map controls change bounded viewport and reset, with day and night themes', async ({ page }) => {
  await page.goto('/prototype/explorer');
  const map = page.locator('.atlas-map');
  await expect(map).toHaveAttribute('viewBox', '0 0 900 450');
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  const zoomed = await map.getAttribute('viewBox');
  await page.getByRole('button', { name: 'Pan east', exact: true }).click();
  expect(await map.getAttribute('viewBox')).not.toBe(zoomed);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '0 0 900 450');
  await page.getByRole('button', { name: 'Switch to day map' }).click();
  await expect(page.locator('.atlas')).toHaveClass(/atlas--day/);
  await page.getByRole('button', { name: 'Switch to night map' }).click();
  await expect(page.locator('.atlas')).toHaveClass(/atlas--night/);
});

test('feed and missions are illustrative, with no reward and no retained answers', async ({ page }) => {
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: 'Sample feed', exact: true }).click();
  await expect(page.getByText('These are original example prompts', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Open Germany dossier' }).click();
  await expect(page.getByRole('heading', { name: 'Germany', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Missions', exact: true }).click();
  await expect(page.getByText('No timer payout, token, or account credit.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal example answer' }).first().click();
  await expect(page.locator('.atlas-answer')).toHaveCount(1);
  await page.reload();
  await page.getByRole('button', { name: 'Missions', exact: true }).click();
  await expect(page.locator('.atlas-answer')).toHaveCount(0);
});

test('all explorer panels fit mobile, tablet and desktop without external data or location requests', async ({ page }) => {
  const remoteRequests = [];
  const errors = [];
  const permissions = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(test.info().project.use.baseURL).origin) remoteRequests.push(request.url());
  });
  await page.exposeFunction('recordLocationAttempt', () => permissions.push('geolocation'));
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = () => globalThis.recordLocationAttempt();
    navigator.geolocation.watchPosition = () => globalThis.recordLocationAttempt();
  });
  await page.goto('/prototype/explorer');
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ['Regions', 'Layers', 'Sample feed', 'Sources']) {
      await page.getByRole('navigation', { name: 'Explorer tools' }).getByRole('button', { name, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(remoteRequests).toEqual([]);
  expect(permissions).toEqual([]);
  expect(errors).toEqual([]);
});
