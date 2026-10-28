import { expect, test } from '@playwright/test';

test('local customer inquiry, admin review, quote, project, sandbox payments, and catalog edits', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const unauthorized = await page.request.get('/api/admin/state');
  expect(unauthorized.status()).toBe(401);

  await page.goto('/website-development?package=ecommerce&template=clothing-store&utm_source=simulation');
  await page.getByLabel('Your name').fill('Simulation Customer');
  await page.getByLabel('Business name').fill('Example Simulation Shop');
  await page.getByLabel('Email address').fill('simulation-customer@example.test');
  await page.getByLabel('Country').fill('Philippines');
  await page.getByLabel('Project description').fill('A fictional inquiry used only to test the local simulation.');
  await page.getByLabel(/I have read the/).check();

  const invalidInquiry = await page.evaluate(async () => {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid Test',
        email: 'invalid@example.test',
        country: 'Philippines',
        category: 'Unsupported category',
        packageId: 'ecommerce',
        templateSlug: 'clothing-store',
        description: 'This request must be rejected.',
        consent: true,
      }),
    });
    return response.status;
  });
  expect(invalidInquiry).toBe(400);

  await page.getByRole('button', { name: /Submit|Prepare email inquiry/ }).click();
  await expect(page.getByRole('status')).toContainText('recorded in this local simulation');

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Set up the local admin' })).toBeVisible();
  const badSetup = await page.evaluate(async () => {
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setupToken: 'incorrect-one-time-token',
        email: 'admin@example.test',
        password: 'a-long-local-simulation-password',
      }),
    });
    return response.status;
  });
  expect(badSetup).toBe(403);

  await page.getByLabel('One-time setup token').fill(process.env.JOVEXA_TEST_SETUP_TOKEN);
  await page.getByLabel('Administrator email').fill('admin@example.test');
  await page.getByLabel('Password', { exact: true }).fill('a-long-local-simulation-password');
  await page.getByRole('button', { name: 'Create local administrator' }).click();
  await expect(page.getByRole('status')).toContainText('Administrator created');
  await page.getByLabel('Email').fill('admin@example.test');
  await page.getByLabel('Password', { exact: true }).fill('a-long-local-simulation-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('navigation', { name: 'Administration sections' })).toBeVisible();

  const csrfFailure = await page.evaluate(async () => {
    const response = await fetch('/api/admin/packages/starter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expectedVersion: 1, priceUsd: 1, summary: 'Unauthorized edit.' }),
    });
    return response.status;
  });
  expect(csrfFailure).toBe(403);

  await page.getByRole('button', { name: 'Inquiries' }).click();
  const inquiry = page.locator('.admin-inquiry').filter({ hasText: 'Simulation Customer' });
  await expect(inquiry).toBeVisible();
  await expect(inquiry).toContainText('utm_source=simulation');
  await inquiry.getByLabel('Status for Simulation Customer').selectOption({ label: 'Under review' });
  await expect(inquiry.getByLabel('Status for Simulation Customer')).toHaveValue('Under review');
  await inquiry.getByLabel('Amount (USD)').fill('799');
  await inquiry.getByLabel('Scope summary').fill('Local test scope, milestones, and delivery plan.');
  await inquiry.getByRole('button', { name: 'Prepare quotation (simulation)' }).click();
  await expect(page.getByRole('status')).toContainText('Quotation prepared in local simulation');

  const quotePopup = page.waitForEvent('popup');
  await inquiry.getByRole('link', { name: 'Open customer response page' }).click();
  const quotePage = await quotePopup;
  await expect(quotePage.getByRole('heading', { name: 'Project quotation' })).toBeVisible();
  await expect(quotePage.locator('.quote-response__card')).toContainText('$799');
  await quotePage.getByRole('button', { name: 'Accept quotation (simulate)' }).click();
  await expect(quotePage.getByRole('status')).toContainText('Response recorded in the local simulation');

  await page.reload();
  await expect(page.getByRole('navigation', { name: 'Administration sections' })).toBeVisible();
  await page.getByRole('button', { name: 'Projects & invoices' }).click();
  const project = page.locator('.admin-record').filter({ hasText: 'Simulation Customer' }).first();
  const allInvoices = page.getByRole('heading', { name: 'All invoices' }).locator('..');
  await expect(project).toBeVisible();
  await project.getByLabel('Invoice amount (USD)').fill('401');
  await project.getByRole('button', { name: 'Create sandbox invoice' }).click();
  await expect(project).toContainText('Deposit requested');
  await project.getByRole('button', { name: 'Simulate deposit paid' }).click();
  await expect(project).toContainText('Balance due');
  await project.getByRole('button', { name: 'Simulate balance paid' }).click();
  await expect(project).toContainText('Paid in full');

  const idempotency = await page.evaluate(async () => {
    const [stateResponse, authResponse] = await Promise.all([
      fetch('/api/admin/state'),
      fetch('/api/auth/me'),
    ]);
    const state = await stateResponse.json();
    const auth = await authResponse.json();
    const invoice = state.invoices[0];
    const event = state.paymentEvents[0];
    const url = `/api/admin/invoices/${invoice.id}/sandbox-events`;
    const send = (body, csrfToken) => fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      body: JSON.stringify(body),
    });
    const replay = await send({ eventId: event.eventId, type: event.type }, auth.csrfToken);
    const replayBody = await replay.json();
    const mismatch = await send({ eventId: event.eventId, type: 'refund' }, auth.csrfToken);
    const noCsrf = await send({ eventId: 'missing-csrf-event', type: 'refund' });
    return { replayStatus: replay.status, duplicate: replayBody.duplicate, mismatchStatus: mismatch.status, noCsrfStatus: noCsrf.status };
  });
  expect(idempotency).toEqual({ replayStatus: 200, duplicate: true, mismatchStatus: 409, noCsrfStatus: 403 });

  await project.getByRole('button', { name: 'Simulate refund' }).click();
  await expect(allInvoices).toContainText('Refunded');
  await project.getByRole('button', { name: 'Create sandbox invoice' }).click();
  await expect(project).toContainText('Deposit requested');
  await project.getByRole('button', { name: 'Simulate deposit paid' }).click();
  await expect(project).toContainText('Balance due');
  await project.getByRole('button', { name: 'Simulate dispute' }).click();
  await expect(project).toContainText('Disputed');

  const projectStatus = project.getByLabel('Project status for Simulation Customer');
  await projectStatus.selectOption({ label: 'In development' });
  await expect(projectStatus).toHaveValue('In development');
  await projectStatus.selectOption({ label: 'Awaiting approval' });
  await expect(projectStatus).toHaveValue('Awaiting approval');
  await projectStatus.selectOption({ label: 'Completed' });
  await expect(projectStatus).toHaveValue('Completed');

  await page.getByRole('button', { name: 'Portfolio' }).click();
  const portfolioForm = page.locator('.admin-config-form').first();
  await portfolioForm.getByLabel('Public title').fill('Simulation project sample');
  await portfolioForm.getByLabel('Summary').fill('A fictional record used to verify the local portfolio workflow.');
  await portfolioForm.locator('input[name="permissionConfirmed"]').check();
  await portfolioForm.locator('input[name="published"]').check();
  await portfolioForm.getByRole('button', { name: 'Save portfolio entry' }).click();
  await expect(page.getByRole('status')).toContainText('Portfolio entry saved locally');
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: 'Simulation project sample' })).toBeVisible();

  await page.goto('/admin');
  await page.getByRole('button', { name: 'Packages' }).click();
  const packageForm = page.locator('.admin-config-form').first();
  await packageForm.locator('input[name="priceUsd"]').fill('455');
  await packageForm.getByRole('button', { name: 'Save local package' }).click();
  await expect(page.getByRole('status')).toContainText('updated in local configuration');
  await page.getByRole('button', { name: 'Templates' }).click();
  const templateForm = page.locator('.admin-config-form').first();
  await templateForm.locator('input[name="name"]').fill('Restaurant Simulation Rebrand');
  await templateForm.locator('textarea[name="description"]').fill('An updated original demo concept, stored locally.');
  await templateForm.getByRole('button', { name: 'Save local demo' }).click();
  await expect(page.getByRole('status')).toContainText('updated in local catalog');

  await page.goto('/pricing');
  await expect(page.locator('.pricing-card').first()).toContainText('$455');
  await page.goto('/templates/restaurant');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Restaurant Simulation Rebrand');
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Notifications' }).click();
  await expect(page.getByRole('heading', { name: 'Delivery disabled' })).toBeVisible();
  await expect(page.locator('.admin-shell')).toContainText('simulation_only_not_sent');

  expect(pageErrors).toEqual([]);
});
