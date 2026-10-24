import { test, expect } from '@playwright/test';

test('prototype session persists after reload and claims exactly once without network work', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-24T12:00:00Z') });
  await page.goto('/prototype/community');
  await expect(page.getByRole('heading', { name: 'Your next small step.' })).toBeVisible();
  await expect(page.getByTestId('demo-balance')).toHaveText('0');
  await page.getByRole('button', { name: 'Start demo session', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Claim demo points', exact: true })).toBeDisabled();
  await page.clock.fastForward(30_000);
  await expect(page.locator('.orbit-timer-label')).toContainText('00:30');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Claim demo points', exact: true })).toBeDisabled();
  await page.clock.fastForward(31_000);
  await page.getByRole('button', { name: 'Claim demo points', exact: true }).click();
  await expect(page.getByTestId('demo-balance')).toHaveText('25');
  await expect(page.getByRole('button', { name: 'Start demo session', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('demo-balance')).toHaveText('25');
  await expect(page.locator('.orbit-notice')).toContainText('No real mining');
});

test('daily activities require confirmation and cannot be claimed twice after reload', async ({ page }) => {
  await page.goto('/prototype/community');
  await page.getByRole('navigation', { name: 'Prototype navigation' }).getByRole('button', { name: /Daily activities/ }).click();
  const task = page.locator('.orbit-task').filter({ has: page.getByRole('heading', { name: 'Explore a lesson', exact: true }) });
  await expect(task.getByRole('button', { name: 'Claim 10 demo points' })).toBeDisabled();
  await task.getByRole('checkbox').check();
  await task.getByRole('button', { name: 'Claim 10 demo points' }).click();
  await expect(task.getByRole('button', { name: 'Claimed today' })).toBeDisabled();
  await page.reload();
  await expect(page.getByTestId('demo-balance')).toHaveText('10');
  await page.getByRole('navigation', { name: 'Prototype navigation' }).getByRole('button', { name: /Daily activities/ }).click();
  await expect(page.getByRole('button', { name: 'Claimed today' })).toBeDisabled();
});

test('invitation is explicitly untracked and reset preserves other site data', async ({ page }) => {
  await page.goto('/prototype/community?ref=UNTRUSTED');
  await page.evaluate(() => localStorage.setItem('jovexa-learn-progress-v1', '{"test":"preserve"}'));
  await page.getByRole('navigation', { name: 'Prototype navigation' }).getByRole('button', { name: /Invite preview/ }).click();
  await expect(page.getByLabel('Demo invitation link')).toHaveValue(/\/prototype\/community\?ref=JVX-DEMO$/);
  await expect(page.locator('.orbit-invite')).toContainText('Not tracked');
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirm reset' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm reset', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('jovexa-learn-progress-v1'))).toBe('{"test":"preserve"}');
});

test('bad storage fails explicitly and can be reset without a fake balance', async ({ page }) => {
  await page.goto('/prototype/community');
  await page.evaluate(() => localStorage.setItem('jovexa-community-demo-v1', '{broken'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Could not read local demo data');
  await expect(page.getByTestId('demo-balance')).toHaveText('Unavailable');
  await expect(page.getByRole('button', { name: 'Start demo session' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm reset', exact: true }).click();
  await expect(page.getByTestId('demo-balance')).toHaveText('0');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('all prototype panels fit mobile, tablet and desktop without account or payment calls', async ({ page }) => {
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (['fetch', 'xhr', 'websocket'].includes(request.resourceType())) requests.push(request.url());
  });
  await page.goto('/prototype/community');
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of [/Overview/, /Daily activities/, /Invite preview/, /How it works/]) {
      await page.getByRole('navigation', { name: 'Prototype navigation' }).getByRole('button', { name }).click();
      await expect(page.locator('.orbit h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test('blocked storage is visible and never awards points or starts a session', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Storage disabled for test', 'QuotaExceededError'); };
  });
  await page.goto('/prototype/community');
  await page.getByRole('button', { name: 'Start demo session', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Storage disabled for test');
  await expect(page.getByTestId('demo-balance')).toHaveText('0');
  await expect(page.getByRole('button', { name: 'Start demo session', exact: true })).toBeVisible();
});

test('clock rollback is disclosed instead of claiming a session', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-24T12:00:00Z') });
  await page.goto('/prototype/community');
  await page.getByRole('button', { name: 'Start demo session', exact: true }).click();
  await page.clock.setSystemTime(new Date('2026-10-24T11:59:00Z'));
  await page.clock.fastForward(1000);
  await expect(page.getByRole('alert')).toContainText('clock moved backwards');
  await expect(page.getByRole('button', { name: 'Claim demo points', exact: true })).toBeDisabled();
});
