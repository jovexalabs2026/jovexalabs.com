import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SimulationError,
  createInvoice,
  createQuotation,
  makePasswordHash,
  newSimulationState,
  simulatePaymentEvent,
  transitionInquiry,
  validateInquiry,
  verifyPassword,
} from '../tool/simulation-core.mjs';

function createInquiry(state, overrides = {}) {
  const input = {
    name: 'Test Customer',
    business: 'Example Studio',
    email: 'CUSTOMER@example.test',
    country: 'Philippines',
    category: 'Business website',
    packageId: state.packages[0].id,
    templateSlug: state.templates[0].slug,
    description: 'A simulation-only request.',
    consent: true,
    ...overrides,
  };
  const inquiry = {
    id: 'inquiry-test',
    ...validateInquiry(input, state),
    status: 'New inquiry',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.inquiries.push(inquiry);
  return inquiry;
}

test('inquiry validation normalizes input and rejects invalid categories, consent, and links', () => {
  const state = newSimulationState();
  const inquiry = validateInquiry({
    name: '  Test Customer ',
    email: 'CUSTOMER@example.test',
    country: 'Philippines',
    category: 'Business website',
    packageId: state.packages[0].id,
    templateSlug: state.templates[0].slug,
    description: 'A scoped test request.',
    references: 'https://example.test/work',
    consent: true,
  }, state, { utm_source: ' local-test ' });

  assert.equal(inquiry.name, 'Test Customer');
  assert.equal(inquiry.email, 'customer@example.test');
  assert.equal(inquiry.campaign.utm_source, 'local-test');
  assert.throws(() => validateInquiry({
    name: 'Test', email: 'test@example.test', country: 'PH',
    category: 'Unsupported', description: 'Test', consent: true,
  }, state), (error) => error instanceof SimulationError && error.status === 400);
  assert.throws(() => validateInquiry({
    name: 'Test', email: 'test@example.test', country: 'PH',
    category: 'Business website', description: 'Test', consent: false,
  }, state), /consent is required/);
  assert.throws(() => validateInquiry({
    name: 'Test', email: 'test@example.test', country: 'PH',
    category: 'Business website', description: 'Test', references: 'javascript:alert(1)', consent: true,
  }, state), /valid HTTP or HTTPS URLs/);
});

test('admin passwords are scrypt-hashed and checked without storing the password', async () => {
  const password = 'local-simulation-test-password';
  const credentials = await makePasswordHash(password);
  assert.notEqual(credentials.passwordHash, password);
  assert.equal(await verifyPassword(password, credentials), true);
  assert.equal(await verifyPassword('incorrect-password', credentials), false);
  await assert.rejects(makePasswordHash('short'), /between 14 and 256 characters/);
});

test('quotation acceptance creates one project and cancellation stays consistent', () => {
  const state = newSimulationState();
  const inquiry = createInquiry(state);
  const quote = createQuotation(state, inquiry, {
    amountUsd: 799,
    summary: 'A local test scope.',
    expiryDays: 30,
  }, 'admin@example.test');

  assert.equal(quote.status, 'Quotation sent');
  assert.equal(inquiry.status, 'Quotation sent');
  assert.throws(() => createQuotation(state, inquiry, {
    amountUsd: 1.5, summary: 'Invalid fractional price.',
  }, 'admin@example.test'), /whole USD amount/);

  transitionInquiry(state, inquiry, 'Accepted', 'customer_via_quote_link');
  assert.equal(state.projects.length, 1);
  transitionInquiry(state, inquiry, 'In development', 'admin@example.test');
  transitionInquiry(state, inquiry, 'Cancelled', 'admin@example.test');
  assert.equal(state.projects[0].status, 'Cancelled');
  assert.throws(() => transitionInquiry(state, inquiry, 'Completed', 'admin@example.test'), /Cannot move/);
});

test('sandbox invoice events enforce milestones, are idempotent, and reject invalid refunds or disputes', () => {
  const state = newSimulationState();
  const inquiry = createInquiry(state);
  createQuotation(state, inquiry, {
    amountUsd: 799,
    summary: 'A local payment-workflow test scope.',
    expiryDays: 30,
  }, 'admin@example.test');
  transitionInquiry(state, inquiry, 'Accepted', 'customer_via_quote_link');
  const invoice = createInvoice(state, state.projects[0], 401, 'admin@example.test');

  assert.equal(invoice.depositCents, 20050);
  assert.equal(invoice.balanceCents, 20050);
  assert.throws(() => simulatePaymentEvent(state, invoice, 'early-balance', 'balance_paid', 'admin@example.test'), /deposit must be simulated/);
  assert.throws(() => simulatePaymentEvent(state, invoice, 'early-refund', 'refund', 'admin@example.test'), /no refundable simulated payment/);
  assert.throws(() => simulatePaymentEvent(state, invoice, 'early-dispute', 'dispute', 'admin@example.test'), /dispute requires an active simulated payment/);

  const deposit = simulatePaymentEvent(state, invoice, 'deposit-event', 'deposit_paid', 'admin@example.test');
  assert.equal(deposit.duplicate, false);
  assert.equal(invoice.status, 'Balance due');
  assert.equal(simulatePaymentEvent(state, invoice, 'deposit-event', 'deposit_paid', 'admin@example.test').duplicate, true);
  assert.throws(() => simulatePaymentEvent(state, invoice, 'deposit-event', 'refund', 'admin@example.test'), /already used/);

  simulatePaymentEvent(state, invoice, 'balance-event', 'balance_paid', 'admin@example.test');
  assert.equal(invoice.status, 'Paid in full');
  simulatePaymentEvent(state, invoice, 'refund-event', 'refund', 'admin@example.test');
  assert.equal(invoice.status, 'Refunded');
  assert.throws(() => simulatePaymentEvent(state, invoice, 'after-refund-dispute', 'dispute', 'admin@example.test'), /dispute requires an active simulated payment/);

  const secondInvoice = createInvoice(state, state.projects[0], 200, 'admin@example.test');
  simulatePaymentEvent(state, secondInvoice, 'second-deposit', 'deposit_paid', 'admin@example.test');
  simulatePaymentEvent(state, secondInvoice, 'dispute-event', 'dispute', 'admin@example.test');
  assert.equal(secondInvoice.status, 'Disputed');
  assert.throws(() => simulatePaymentEvent(state, secondInvoice, 'late-refund', 'refund', 'admin@example.test'), /no refundable simulated payment/);
});
