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
    await page.getByRole('button', { name: '3D globe', exact: true }).click();
    await expect(page.getByRole('button', { name: '3D globe', exact: true })).toHaveAttribute('aria-pressed', 'true');
    for (const name of ['Regions', 'Layers', 'Sample feed', 'Sources']) {
      await page.getByRole('navigation', { name: 'Explorer tools' }).getByRole('button', { name, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(remoteRequests).toEqual([]);
  expect(permissions).toEqual([]);
  expect(errors).toEqual([]);
});

test('national flags load in country list and dossiers without a third-party flag service', async ({ page }) => {
  await page.goto('/prototype/explorer');
  const listFlags = page.locator('.atlas-region-list img');
  await expect(listFlags).toHaveCount(10);
  await expect.poll(() => listFlags.evaluateAll(images => images.every(image =>
    image.complete && image.naturalWidth > 0))).toBe(true);
  for (const country of ['Japan', 'Canada', 'Philippines']) {
    await page.locator('.atlas-region-list').getByRole('button', { name: new RegExp(`^${country}`) }).click();
    const flag = page.getByRole('img', { name: `Flag of ${country}`, exact: true });
    await expect(flag).toBeVisible();
    expect(await flag.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('.atlas-pin image')).toHaveCount(10);
});

test('globe switches projection, hides far-side pins and centers a selected region', async ({ page }) => {
  await page.goto('/prototype/explorer');
  const land = page.locator('.atlas-land');
  const flatPath = await land.getAttribute('d');
  await page.getByRole('button', { name: '3D globe', exact: true }).click();
  await expect(page.getByRole('button', { name: '3D globe', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await land.getAttribute('d')).not.toBe(flatPath);
  await expect(page.getByRole('button', { name: 'Explore Philippines', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Brazil', exact: true })).toHaveCount(0);
  await page.locator('.atlas-region-list').getByRole('button', { name: /Brazil Brasilia/ }).click();
  await expect(page.getByRole('button', { name: 'Explore Brazil', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Explore Philippines', exact: true })).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'Flag of Brazil', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '2D map', exact: true }).click();
  await expect(land).toHaveAttribute('d', flatPath);
  await expect(page.locator('.atlas-pin')).toHaveCount(10);
});

test('globe rotates with keyboard and drag, supports zoom and resets reliably', async ({ page }) => {
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: '3D globe', exact: true }).click();
  const map = page.locator('.atlas-map');
  const land = page.locator('.atlas-land');
  const original = await land.getAttribute('d');
  await map.focus();
  await page.keyboard.press('ArrowRight');
  expect(await land.getAttribute('d')).not.toBe(original);
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(land).toHaveAttribute('d', original);
  await map.scrollIntoViewIfNeeded();
  const bounds = await map.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .4, bounds.y + bounds.height * .5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * .65, bounds.y + bounds.height * .55, { steps: 8 });
  await page.mouse.up();
  expect(await land.getAttribute('d')).not.toBe(original);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(map).not.toHaveAttribute('viewBox', '225 0 450 450');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '225 0 450 450');
  await expect(land).toHaveAttribute('d', original);
});

test('touch rotation and 2D drag work without triggering region selection', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(test.info().project.use.baseURL + '/prototype/explorer');
    await page.getByRole('button', { name: '3D globe', exact: true }).click();
    const map = page.locator('.atlas-map');
    const land = page.locator('.atlas-land');
    const original = await land.getAttribute('d');
    await map.scrollIntoViewIfNeeded();
    const bounds = await map.boundingBox();
    const session = await context.newCDPSession(page);
    const touch = { x: bounds.x + bounds.width * .4, y: bounds.y + bounds.height * .5 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touch] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touch.x + 60, y: touch.y + 10 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    expect(await land.getAttribute('d')).not.toBe(original);
    await expect(page.getByRole('heading', { name: 'Philippines', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '2D map', exact: true }).click();
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    const initialView = await map.getAttribute('viewBox');
    await map.scrollIntoViewIfNeeded();
    const flat = await map.boundingBox();
    await page.mouse.move(flat.x + flat.width * .4, flat.y + flat.height * .5);
    await page.mouse.down();
    await page.mouse.move(flat.x + flat.width * .6, flat.y + flat.height * .5, { steps: 5 });
    await page.mouse.up();
    expect(await map.getAttribute('viewBox')).not.toBe(initialView);
  } finally {
    await context.close();
  }
});
