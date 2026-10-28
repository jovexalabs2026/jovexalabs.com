import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { packages, maintenance, templates } from '../src/data/services.js';

const scrypt = promisify(scryptCallback);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INQUIRY_STATUSES = [
  'New inquiry',
  'Under review',
  'Quotation sent',
  'Awaiting customer',
  'Accepted',
  'In development',
  'Awaiting approval',
  'Completed',
  'Cancelled',
];
const STATUS_TRANSITIONS = {
  'New inquiry': ['Under review', 'Cancelled'],
  'Under review': ['Quotation sent', 'Cancelled'],
  'Quotation sent': ['Awaiting customer', 'Accepted', 'Under review', 'Cancelled'],
  'Awaiting customer': ['Accepted', 'Under review', 'Cancelled'],
  Accepted: ['In development', 'Cancelled'],
  'In development': ['Awaiting approval', 'Cancelled'],
  'Awaiting approval': ['Completed', 'In development', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};
const PAYMENT_STATES = [
  'Unpaid',
  'Deposit requested',
  'Deposit paid',
  'Balance due',
  'Paid in full',
  'Refunded',
  'Disputed',
];

export class SimulationError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'SimulationError';
    this.status = status;
  }
}

export function newSimulationState() {
  return {
    schemaVersion: 1,
    admin: null,
    pricingVersion: 1,
    packages: structuredClone(packages),
    maintenance: structuredClone(maintenance),
    templates: structuredClone(templates),
    inquiries: [],
    quotations: [],
    projects: [],
    portfolio: [],
    invoices: [],
    paymentEvents: [],
    outbox: [],
    auditLog: [],
  };
}

export function cleanText(value, label, maxLength, { required = false } = {}) {
  if (typeof value !== 'string') throw new SimulationError(400, `${label} must be text.`);
  const cleaned = value.trim();
  if (required && !cleaned) throw new SimulationError(400, `${label} is required.`);
  if (cleaned.length > maxLength) throw new SimulationError(400, `${label} is too long.`);
  return cleaned;
}

export function validateInquiry(input, state, campaign = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new SimulationError(400, 'Inquiry data must be an object.');
  }
  const inquiry = {
    name: cleanText(input.name, 'Name', 100, { required: true }),
    business: cleanText(input.business ?? '', 'Business name', 120),
    email: cleanText(input.email, 'Email', 254, { required: true }).toLowerCase(),
    country: cleanText(input.country, 'Country', 80, { required: true }),
    category: cleanText(input.category, 'Project category', 80, { required: true }),
    packageId: cleanText(input.packageId ?? '', 'Package', 40),
    templateSlug: cleanText(input.templateSlug ?? '', 'Template', 80),
    features: cleanText(input.features ?? '', 'Features', 2000),
    budget: cleanText(input.budget ?? '', 'Budget', 60),
    timeframe: cleanText(input.timeframe ?? '', 'Timeframe', 60),
    description: cleanText(input.description, 'Project description', 5000, { required: true }),
    references: cleanText(input.references ?? '', 'Reference links', 1000),
    consent: input.consent === true,
    campaign: {},
  };
  if (!['Business website', 'E-commerce website', 'Web application or platform', 'Other software project'].includes(inquiry.category)) {
    throw new SimulationError(400, 'Choose a supported project category.');
  }
  if (!EMAIL_PATTERN.test(inquiry.email)) throw new SimulationError(400, 'Enter a valid email address.');
  if (!inquiry.consent) throw new SimulationError(400, 'Privacy notice consent is required.');
  if (inquiry.packageId && !state.packages.some((item) => item.id === inquiry.packageId)) {
    throw new SimulationError(400, 'Choose a listed service package.');
  }
  if (inquiry.templateSlug && !state.templates.some((item) => item.slug === inquiry.templateSlug)) {
    throw new SimulationError(400, 'Choose a listed website demo.');
  }
  if (inquiry.references) {
    const links = inquiry.references.split(/\s+/).filter(Boolean);
    if (links.length > 10 || links.some((link) => {
      try {
        const url = new URL(link);
        return !['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.');
      } catch {
        return true;
      }
    })) {
      throw new SimulationError(400, 'Reference links must be up to 10 valid HTTP or HTTPS URLs.');
    }
  }
  if (campaign && typeof campaign === 'object' && !Array.isArray(campaign)) {
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (typeof campaign[key] === 'string') {
        inquiry.campaign[key] = cleanText(campaign[key], 'Campaign parameter', 120);
      }
    }
  }
  return inquiry;
}

export async function makePasswordHash(password) {
  if (typeof password !== 'string' || password.length < 14 || password.length > 256) {
    throw new SimulationError(400, 'Choose a password between 14 and 256 characters.');
  }
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return { salt: salt.toString('hex'), passwordHash: hash.toString('hex') };
}

export async function verifyPassword(password, admin) {
  if (typeof password !== 'string' || !admin?.salt || !admin?.passwordHash) return false;
  const expected = Buffer.from(admin.passwordHash, 'hex');
  if (expected.length !== 64) return false;
  const actual = await scrypt(password, Buffer.from(admin.salt, 'hex'), expected.length);
  return timingSafeEqual(expected, actual);
}

export function recordAudit(state, actor, action, entity, entityId, details = {}) {
  state.auditLog.unshift({
    id: randomBytes(12).toString('hex'),
    at: new Date().toISOString(),
    actor,
    action,
    entity,
    entityId,
    details,
  });
  state.auditLog.length = Math.min(state.auditLog.length, 1000);
}

export function transitionInquiry(state, inquiry, nextStatus, actor) {
  if (!INQUIRY_STATUSES.includes(nextStatus)) throw new SimulationError(400, 'Unknown inquiry status.');
  if (!STATUS_TRANSITIONS[inquiry.status]?.includes(nextStatus)) {
    throw new SimulationError(409, `Cannot move an inquiry from "${inquiry.status}" to "${nextStatus}".`);
  }
  const previous = inquiry.status;
  inquiry.status = nextStatus;
  inquiry.updatedAt = new Date().toISOString();
  recordAudit(state, actor, 'inquiry.status_changed', 'inquiry', inquiry.id, { previous, next: nextStatus });
  const project = state.projects.find((item) => item.inquiryId === inquiry.id);
  if (nextStatus === 'Cancelled' && project && project.status !== 'Cancelled') {
    const previousProjectStatus = project.status;
    project.status = 'Cancelled';
    project.updatedAt = inquiry.updatedAt;
    recordAudit(state, actor, 'project.status_changed', 'project', project.id, {
      previous: previousProjectStatus,
      next: 'Cancelled',
    });
  }
  if (nextStatus === 'Accepted' && !state.projects.some((project) => project.inquiryId === inquiry.id)) {
    const project = {
      id: randomBytes(12).toString('hex'),
      inquiryId: inquiry.id,
      customerName: inquiry.name,
      business: inquiry.business,
      title: `${inquiry.name} — ${inquiry.category}`,
      status: 'Accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.projects.unshift(project);
  }
}

export function createQuotation(state, inquiry, input, actor) {
  const amountUsd = Number(input?.amountUsd);
  if (!Number.isSafeInteger(amountUsd) || amountUsd < 1 || amountUsd > 200000) {
    throw new SimulationError(400, 'Quotation amount must be a whole USD amount between 1 and 200,000.');
  }
  const summary = cleanText(input.summary, 'Quotation scope', 3000, { required: true });
  const expiryDays = Number(input.expiryDays ?? 30);
  if (!Number.isInteger(expiryDays) || expiryDays < 1 || expiryDays > 90) {
    throw new SimulationError(400, 'Quotation validity must be between 1 and 90 days.');
  }
  if (!['New inquiry', 'Under review'].includes(inquiry.status)) {
    throw new SimulationError(409, 'Review the inquiry before preparing a quotation.');
  }
  const now = new Date();
  const quote = {
    id: randomBytes(12).toString('hex'),
    inquiryId: inquiry.id,
    amountUsd,
    summary,
    status: 'Quotation sent',
    expiresAt: new Date(now.getTime() + expiryDays * 86400000).toISOString(),
    acceptToken: randomBytes(32).toString('base64url'),
    createdAt: now.toISOString(),
    createdBy: actor,
  };
  state.quotations.unshift(quote);
  const previousStatus = inquiry.status;
  inquiry.status = 'Quotation sent';
  inquiry.updatedAt = now.toISOString();
  recordAudit(state, actor, 'inquiry.status_changed', 'inquiry', inquiry.id, {
    previous: previousStatus,
    next: inquiry.status,
  });
  state.outbox.unshift({
    id: randomBytes(12).toString('hex'),
    type: 'quotation_notice',
    to: inquiry.email,
    status: 'simulation_only_not_sent',
    message: `Quotation ${quote.id} prepared. No email was sent.`,
    createdAt: now.toISOString(),
  });
  recordAudit(state, actor, 'quotation.prepared', 'quotation', quote.id, { inquiryId: inquiry.id, amountUsd });
  return quote;
}

export function createInvoice(state, project, amountUsd, actor) {
  if (!Number.isSafeInteger(amountUsd) || amountUsd < 1 || amountUsd > 200000) {
    throw new SimulationError(400, 'Invoice amount must be a whole USD amount between 1 and 200,000.');
  }
  if (state.invoices.some((invoice) => invoice.projectId === project.id && !['Paid in full', 'Refunded'].includes(invoice.status))) {
    throw new SimulationError(409, 'This project already has an open invoice.');
  }
  const amountCents = amountUsd * 100;
  const depositCents = Math.ceil(amountCents / 2);
  const invoice = {
    id: randomBytes(12).toString('hex'),
    projectId: project.id,
    amountCents,
    currency: 'USD',
    provider: 'local-sandbox',
    status: 'Deposit requested',
    depositCents,
    balanceCents: amountCents - depositCents,
    paidCents: 0,
    createdAt: new Date().toISOString(),
    createdBy: actor,
  };
  state.invoices.unshift(invoice);
  recordAudit(state, actor, 'invoice.created', 'invoice', invoice.id, { amountCents, provider: invoice.provider });
  return invoice;
}

export function simulatePaymentEvent(state, invoice, eventId, eventType, actor) {
  const id = cleanText(eventId, 'Sandbox event ID', 100, { required: true });
  const duplicate = state.paymentEvents.find((event) => event.eventId === id);
  if (duplicate) {
    if (duplicate.invoiceId !== invoice.id || duplicate.type !== eventType) {
      throw new SimulationError(409, 'This sandbox event ID was already used for a different payment event.');
    }
    return { event: duplicate, duplicate: true };
  }
  if (!['deposit_paid', 'balance_paid', 'refund', 'dispute'].includes(eventType)) {
    throw new SimulationError(400, 'Unknown sandbox payment event.');
  }
  if (invoice.provider !== 'local-sandbox') throw new SimulationError(409, 'Live providers are disabled.');
  if (eventType === 'deposit_paid') {
    if (invoice.paidCents !== 0 || ['Refunded', 'Disputed'].includes(invoice.status)) {
      throw new SimulationError(409, 'A deposit cannot be applied in the current invoice state.');
    }
    invoice.paidCents = invoice.depositCents;
    invoice.status = invoice.balanceCents ? 'Balance due' : 'Paid in full';
  } else if (eventType === 'balance_paid') {
    if (invoice.status !== 'Balance due') throw new SimulationError(409, 'The deposit must be simulated before the balance.');
    invoice.paidCents = invoice.amountCents;
    invoice.status = 'Paid in full';
  } else if (eventType === 'refund') {
    if (invoice.paidCents === 0 || ['Refunded', 'Disputed'].includes(invoice.status)) {
      throw new SimulationError(409, 'There is no refundable simulated payment in the current invoice state.');
    }
    invoice.status = 'Refunded';
    invoice.paidCents = 0;
  } else {
    if (invoice.paidCents === 0 || ['Refunded', 'Disputed'].includes(invoice.status)) {
      throw new SimulationError(409, 'A dispute requires an active simulated payment.');
    }
    invoice.status = 'Disputed';
  }
  const event = {
    eventId: id,
    invoiceId: invoice.id,
    type: eventType,
    provider: 'local-sandbox',
    processedAt: new Date().toISOString(),
    result: invoice.status,
  };
  state.paymentEvents.unshift(event);
  recordAudit(state, actor, 'payment.sandbox_event', 'invoice', invoice.id, { eventId: id, eventType, result: invoice.status });
  return { event, duplicate: false };
}

export const inquiryStatuses = [...INQUIRY_STATUSES];
export const paymentStates = [...PAYMENT_STATES];
