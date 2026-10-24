import { test, expect } from '@playwright/test';

const usgs = '**/earthquake.usgs.gov/earthquakes/feed/**';
const eonet = '**/eonet.gsfc.nasa.gov/api/v3/events?**';
const fixture = { type: 'FeatureCollection', metadata: { generated: 1_792_800_000_000 },
  features: [{ id: 'test', geometry: { type: 'Point', coordinates: [120, 15] },
    properties: { title: 'Controlled earthquake observation', mag: 3, time: 1_792_800_000_000,
      updated: 1_792_800_000_000, status: 'automatic', url: 'https://earthquake.usgs.gov/earthquakes/eventpage/test' } }] };
const headers = { 'access-control-allow-origin': '*' };
async function openLayers(page) {
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
}

test('public observations are opt-in, selectable, refreshed at five minutes and stoppable', async ({ page }) => {
  let requests = 0;
  await page.route(usgs, (route) => { requests++; return route.fulfill({ json: fixture, headers }); });
  await page.clock.install();
  await openLayers(page);
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  expect(requests).toBe(0);
  const control = page.getByRole('checkbox', { name: 'Load / show Incident / earthquakes', exact: true });
  await control.check();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
  await page.getByRole('button', { name: 'Controlled earthquake observation', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Incident / earthquakes observation', exact: true })).toContainText('preliminary');
  const marker = page.getByRole('button', { name: 'Inspect Incident / earthquakes: Controlled earthquake observation', exact: true });
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: 'Public observation dossier' })).toContainText('Controlled earthquake observation');
  await page.getByRole('button', { name: '3D globe', exact: true }).click();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
  for (let step = 0; step < 9; step++) await page.getByRole('button', { name: 'Pan east', exact: true }).click();
  await expect(page.locator('.atlas-observation')).toHaveCount(0);
  await page.getByRole('button', { name: '2D map', exact: true }).click();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
  await page.clock.fastForward(299_999);
  expect(requests).toBe(1);
  await page.clock.fastForward(1);
  await expect.poll(() => requests).toBe(2);
  await control.uncheck();
  await expect(page.locator('.atlas-observation')).toHaveCount(0);
  await page.clock.fastForward(600_000);
  expect(requests).toBe(2);
});

test('initial malformed source responses are explicit errors, never fabricated observations', async ({ page }) => {
  await page.route(usgs, (route) => route.fulfill({ json: { wrong: 'provider format' }, headers }));
  await openLayers(page);
  await page.getByRole('checkbox', { name: 'Load / show Incident / earthquakes', exact: true }).check();
  await expect(page.getByRole('alert')).toContainText('USGS returned an invalid earthquake collection.');
  await expect(page.getByRole('alert')).toContainText('No observations loaded.');
  await expect(page.locator('.atlas-observation')).toHaveCount(0);
});

test('hidden pages stop refreshing and resume only after the interval is due', async ({ page }) => {
  let requests = 0;
  await page.route(usgs, (route) => { requests++; return route.fulfill({ json: fixture, headers }); });
  await page.clock.install();
  await openLayers(page);
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.getByRole('checkbox', { name: 'Load / show Incident / earthquakes', exact: true }).check();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
  // Simulate document lifecycle without changing or relying on the test runner's foreground tab.
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(600_000);
  expect(requests).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => requests).toBe(2);
  await page.clock.fastForward(1);
  expect(requests).toBe(2);
  await page.goto('/');
  await page.clock.fastForward(600_000);
  expect(requests).toBe(2);
});

test('refresh failures retain clearly stale markers; empty results are not invented', async ({ page }) => {
  let requests = 0;
  await page.route(usgs, (route) => {
    requests++;
    return requests === 1 ? route.fulfill({ json: fixture, headers }) :
      route.fulfill({ status: 503, body: 'Unavailable', headers });
  });
  await page.route(eonet, (route) => route.fulfill({ json: { events: [] }, headers }));
  await page.clock.install();
  await openLayers(page);
  await page.getByRole('checkbox', { name: 'Load / show Incident / earthquakes', exact: true }).check();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
  await page.clock.fastForward(300_000);
  await expect(page.getByRole('alert')).toContainText('Retained observations are stale');
  await expect(page.locator('.atlas-map-caption')).toContainText('STALE');
  await page.getByRole('checkbox', { name: 'Load / show Event / natural hazards', exact: true }).check();
  await expect(page.getByText('No matching point records returned.', { exact: false })).toBeVisible();
  await expect(page.locator('.atlas-observation')).toHaveCount(1);
});

test('reference facilities and passages have source links, unavailable categories and responsive controls', async ({ page }) => {
  await page.route('https://query.wikidata.org/**', (route) => route.fulfill({ json: { results: { bindings: [
    { item: { value: 'http://www.wikidata.org/entity/Q1' }, itemLabel: { value: 'Controlled facility' },
      location: { value: 'Point(120 15)' } },
  ] } }, headers }));
  await openLayers(page);
  for (const name of ['Nuclear plant / reference', 'Port / reference', 'Chokepoint / reference passages']) {
    await page.getByRole('checkbox', { name: `Load / show ${name}`, exact: true }).check();
  }
  await expect(page.locator('.atlas-observation')).toHaveCount(6);
  await page.getByRole('button', { name: 'Suez Canal', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Chokepoint / reference passages observation' })).toContainText('No current closure');
  await expect(page.getByText('No licensed AIS provider connected;', { exact: false })).toBeVisible();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('real hazard and infrastructure sources work through browser CORS and deployed CSP', async ({ page }) => {
  test.setTimeout(90_000);
  await openLayers(page);
  for (const name of ['Incident / earthquakes', 'Event / natural hazards', 'Nuclear plant / reference', 'Port / reference']) {
    await page.getByRole('checkbox', { name: `Load / show ${name}`, exact: true }).check();
  }
  await expect(page.getByText('Last successful retrieval:', { exact: false })).toHaveCount(4, { timeout: 30_000 });
  await expect(page.getByRole('alert')).toHaveCount(0);
  const count = await page.locator('.atlas-observation').count();
  expect(count).toBeGreaterThan(0);
  console.log(`Unmocked public layers: four successful sources, ${count} visible map markers`);
});
