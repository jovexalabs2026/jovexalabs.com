import { test, expect } from '@playwright/test';

async function selectPhilippines(page) {
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: 'Countries', exact: true }).click();
  await page.getByLabel('Search boundary dataset').fill('PHL');
  await page.locator('.atlas-region-list').getByRole('button', { name: 'Philippines PHL', exact: true }).click();
}

test('country polygons select dossiers directly without consuming clicks as drags', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/prototype/explorer');
  await page.getByRole('button', { name: 'Close tools panel', exact: true }).click();
  await page.getByRole('button', { name: 'Close region dossier', exact: true }).click();
  await page.getByRole('button', { name: 'Select country Brazil', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Brazil', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '3D globe', exact: true }).click();
  await expect(page.locator('.atlas-country-shape--selected')).toHaveAttribute('aria-label', 'Select country Brazil');
});

test('all reference boundaries are selectable and source-year country data is opt-in', async ({ page }) => {
  let requests = 0;
  await page.route('https://api.worldbank.org/**', (route) => {
    requests++;
    const indicator = new URL(route.request().url()).pathname.split('/').pop();
    return route.fulfill({ json: [{ lastupdated: '2026-10-08' }, [{ countryiso3code: 'PHL',
      country: { value: 'Philippines' }, indicator: { id: indicator }, date: '2025',
      value: indicator === 'SP.POP.TOTL' ? 100_000_000 : 400_000_000_000 }]],
    headers: { 'access-control-allow-origin': '*' } });
  });
  await page.route('https://query.wikidata.org/**', (route) => {
    requests++;
    return route.fulfill({ json: { results: { bindings: [{ person: { value: 'http://www.wikidata.org/entity/Q1' },
      country: { value: 'http://www.wikidata.org/entity/Q2' }, personLabel: { value: 'Controlled test office holder' },
      role: { value: 'Head of state' }, start: { value: '2025-01-01T00:00:00Z' } }] } },
    headers: { 'access-control-allow-origin': '*' } });
  });
  await selectPhilippines(page);
  expect(requests).toBe(0);
  await expect(page.locator('.atlas-country-shape')).toHaveCount(241);
  await page.getByRole('button', { name: 'Load country data', exact: true }).click();
  await expect(page.getByText('100,000,000', { exact: true })).toBeVisible();
  await expect(page.getByText('$400,000,000,000', { exact: true })).toBeVisible();
  await expect(page.getByText('Controlled test office holder', { exact: true })).toBeVisible();
  await expect(page.locator('.atlas-country-stat').first()).toContainText('2025');
  await expect(page.getByRole('button', { name: /Country refresh available/ })).toBeDisabled();
  expect(requests).toBe(3);
  for (const size of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Philippines', exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Reference country boundaries', exact: true }).uncheck();
  await expect(page.locator('.atlas-country-shape')).toHaveCount(0);
});

test('independent provider failures retain successful indicators without inventing other results', async ({ page }) => {
  await page.route('https://api.worldbank.org/**', (route) => route.request().url().includes('SP.POP.TOTL') ?
    route.fulfill({ json: [{ lastupdated: '2026-10-08' }, [{ countryiso3code: 'PHL',
      country: { value: 'Philippines' }, indicator: { id: 'SP.POP.TOTL' }, date: '2025', value: 100_000_000 }]],
    headers: { 'access-control-allow-origin': '*' } }) : route.fulfill({
      status: 503, body: 'Unavailable', headers: { 'access-control-allow-origin': '*' } }));
  await page.route('https://query.wikidata.org/**', (route) => route.fulfill({
    status: 429, body: 'Rate limited', headers: { 'access-control-allow-origin': '*' } }));
  await selectPhilippines(page);
  await page.getByRole('button', { name: 'Load country data', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(2);
  await expect(page.locator('.atlas-stat-value')).toHaveText('100,000,000');
});

test('actual World Bank and leadership requests expose real results or explicit availability failures', async ({ page }) => {
  test.setTimeout(60_000);
  await selectPhilippines(page);
  await page.getByRole('button', { name: 'Load country data', exact: true }).click();
  await expect(page.getByText('Last retrieval attempt:', { exact: false })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.atlas-country-stat').first()).toContainText('Reference year:');
  await expect(page.locator('.atlas-country-stat').nth(1)).toContainText('Reference year:');
  // Leadership availability is independent; never replace a rate-limit error with an invented office holder.
  const leaders = page.locator('.atlas-country-stat').nth(2);
  const available = await leaders.locator('article').count();
  if (!available) {
    const errors = await leaders.getByRole('alert').count();
    expect(errors > 0 || (await leaders.innerText()).includes('No matching leadership statements')).toBe(true);
  }
  console.log(`Real country API check: leadership rows=${available}; failures=${await leaders.getByRole('alert').count()}`);
});
