import { createServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomBytes, timingSafeEqual, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SimulationError,
  cleanText,
  createInvoice,
  createQuotation,
  makePasswordHash,
  newSimulationState,
  recordAudit,
  simulatePaymentEvent,
  transitionInquiry,
  validateInquiry,
  verifyPassword,
} from './simulation-core.mjs';

if (process.env.JOVEXA_SIMULATION !== 'true') {
  throw new Error('The local API is disabled. Start it only with npm run simulate.');
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = '127.0.0.1';
const PORT = Number(process.env.JOVEXA_SIMULATION_PORT || 4174);
const DATA_FILE = path.resolve(process.env.JOVEXA_SIMULATION_DATA || path.join(ROOT, '.simulation-data', 'state.json'));
const MAX_BODY_BYTES = 32768;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const INSTANCE_ID = process.env.JOVEXA_SIMULATION_INSTANCE || randomUUID();
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);
const sessions = new Map();
const limits = new Map();
let state;
let setupToken = process.env.JOVEXA_SETUP_TOKEN || randomBytes(32).toString('base64url');
let setupTokenConsumed = false;
let stateWrite = Promise.resolve();
let persistenceError;

function assertLoopback() {
  if (!['127.0.0.1', '::1'].includes(HOST)) throw new Error('Simulation API must bind to loopback.');
}

async function loadState() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true, mode: 0o700 });
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    if (Buffer.byteLength(raw, 'utf8') > 10 * 1024 * 1024) throw new Error('Simulation state file exceeds 10 MiB.');
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed.inquiries) ||
        !Array.isArray(parsed.packages) || !Array.isArray(parsed.templates)) {
      throw new Error('Simulation state file has an unsupported or invalid schema.');
    }
    parsed.portfolio ||= [];
    return parsed;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const initial = newSimulationState();
    await persist(initial);
    return initial;
  }
}

function persist(nextState) {
  const serialized = JSON.stringify(nextState, null, 2);
  stateWrite = stateWrite.then(async () => {
    const tempPath = `${DATA_FILE}.${randomUUID()}.tmp`;
    await writeFile(tempPath, serialized, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    await rename(tempPath, DATA_FILE);
  }).catch((error) => {
    persistenceError = error;
    throw error;
  });
  return stateWrite;
}

function send(response, status, value, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    ...headers,
  });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new SimulationError(413, 'Request body is too large.');
    chunks.push(chunk);
  }
  if (!size) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new SimulationError(400, 'Request body must be valid JSON.');
  }
}

function enforceLoopbackRequest(request) {
  const remoteAddress = request.socket.remoteAddress?.replace(/^::ffff:/, '');
  if (!['127.0.0.1', '::1'].includes(remoteAddress)) {
    throw new SimulationError(403, 'The simulation API accepts loopback connections only.');
  }
  const origin = request.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    throw new SimulationError(403, 'Cross-origin requests are not allowed.');
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      throw new SimulationError(403, 'A local website origin is required for this request.');
    }
    if (!String(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      throw new SimulationError(415, 'Use an application/json request body.');
    }
  }
}

function rateLimit(request, key, max, windowMs) {
  const address = request.socket.remoteAddress?.replace(/^::ffff:/, '') || 'unknown';
  const now = Date.now();
  const bucketKey = `${key}:${address}`;
  const bucket = limits.get(bucketKey);
  if (!bucket || now >= bucket.expiresAt) {
    limits.set(bucketKey, { count: 1, expiresAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > max) throw new SimulationError(429, 'Too many requests. Wait a minute and try again.');
}

function cookieValue(request, name) {
  const cookie = request.headers.cookie || '';
  for (const part of cookie.split(';')) {
    const separator = part.indexOf('=');
    if (separator > 0 && part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return '';
}

function sessionFor(request) {
  const token = cookieValue(request, 'jovexa_sim_session');
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function requireAdmin(request, csrf = false) {
  const session = sessionFor(request);
  if (!session || !state.admin || session.email !== state.admin.email) {
    throw new SimulationError(401, 'Administrator sign-in is required.');
  }
  if (csrf) {
    const supplied = request.headers['x-csrf-token'];
    const expected = session.csrf;
    if (typeof supplied !== 'string' || supplied.length !== expected.length ||
        !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      throw new SimulationError(403, 'The security token is missing or expired. Refresh and retry.');
    }
  }
  return session;
}

function publicQuotation(quote) {
  return {
    id: quote.id,
    amountUsd: quote.amountUsd,
    summary: quote.summary,
    status: quote.status,
    expiresAt: quote.expiresAt,
  };
}

function invoiceForId(id) {
  const invoice = state.invoices.find((item) => item.id === id);
  if (!invoice) throw new SimulationError(404, 'Invoice not found.');
  return invoice;
}

function inquiryForId(id) {
  const inquiry = state.inquiries.find((item) => item.id === id);
  if (!inquiry) throw new SimulationError(404, 'Inquiry not found.');
  return inquiry;
}

function projectForId(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project) throw new SimulationError(404, 'Project not found.');
  return project;
}

function cleanAdminState() {
  return {
    inquiries: state.inquiries,
    quotations: state.quotations,
    projects: state.projects,
    portfolio: state.portfolio || [],
    invoices: state.invoices,
    paymentEvents: state.paymentEvents,
    outbox: state.outbox,
    auditLog: state.auditLog,
    packages: state.packages,
    maintenance: state.maintenance,
    templates: state.templates,
    pricingVersion: state.pricingVersion,
  };
}

async function route(request, response) {
  enforceLoopbackRequest(request);
  if (persistenceError) throw new Error('Local simulation storage failed; resolve the file-system issue and restart the simulator.');
  const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
  const method = request.method || 'GET';
  const body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? await readJson(request) : {};
  if (method === 'GET' && url.pathname === '/api/health') {
    return send(response, 200, {
      ok: true,
      mode: 'local-simulation',
      adminConfigured: Boolean(state.admin),
      instanceId: INSTANCE_ID,
    });
  }
  if (method === 'GET' && url.pathname === '/api/catalog') {
    return send(response, 200, {
      packages: state.packages,
      maintenance: state.maintenance,
      templates: state.templates.filter((template) => template.published !== false),
      pricingVersion: state.pricingVersion,
      mode: 'local-simulation',
    });
  }
  if (method === 'GET' && url.pathname === '/api/portfolio') {
    return send(response, 200, { projects: (state.portfolio || []).filter((item) => item.published) });
  }
  if (method === 'GET' && url.pathname === '/api/auth/me') {
    const session = sessionFor(request);
    return send(response, 200, {
      authenticated: Boolean(session && state.admin && session.email === state.admin.email),
      setupRequired: !state.admin,
      ...(session && state.admin ? { email: session.email, csrfToken: session.csrf } : {}),
    });
  }
  if (method === 'POST' && url.pathname === '/api/setup') {
    rateLimit(request, 'setup', 5, 60000);
    if (state.admin || setupTokenConsumed) throw new SimulationError(409, 'Administrator setup is already complete.');
    if (typeof body.setupToken !== 'string' ||
        Buffer.byteLength(body.setupToken) !== Buffer.byteLength(setupToken) ||
        !timingSafeEqual(Buffer.from(body.setupToken), Buffer.from(setupToken))) {
      throw new SimulationError(403, 'The one-time setup token is not valid.');
    }
    const email = cleanText(body.email, 'Administrator email', 254, { required: true }).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SimulationError(400, 'Enter a valid administrator email.');
    const credentials = await makePasswordHash(body.password);
    state.admin = { email, ...credentials, createdAt: new Date().toISOString(), role: 'admin' };
    setupTokenConsumed = true;
    recordAudit(state, email, 'admin.setup_completed', 'administrator', email);
    await persist(state);
    return send(response, 201, { message: 'Administrator created. Sign in to continue.' });
  }
  if (method === 'POST' && url.pathname === '/api/auth/login') {
    rateLimit(request, 'login', 8, 60000);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const valid = state.admin && email === state.admin.email && await verifyPassword(body.password, state.admin);
    if (!valid) throw new SimulationError(401, 'Email or password is not correct.');
    const token = randomBytes(32).toString('base64url');
    const csrf = randomBytes(24).toString('base64url');
    sessions.set(token, { email, csrf, expiresAt: Date.now() + SESSION_TTL_MS });
    return send(response, 200, { email, csrfToken: csrf }, {
      'Set-Cookie': `jovexa_sim_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`,
    });
  }
  if (method === 'POST' && url.pathname === '/api/auth/logout') {
    const session = requireAdmin(request, true);
    sessions.delete(session.token);
    return send(response, 200, { message: 'Signed out.' }, {
      'Set-Cookie': 'jovexa_sim_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
    });
  }
  if (method === 'POST' && url.pathname === '/api/quotes') {
    rateLimit(request, 'quote', 8, 60000);
    if (body.website) return send(response, 202, { accepted: true });
    const inquiryInput = validateInquiry(body, state, body.campaign);
    const now = new Date().toISOString();
    const inquiry = {
      id: randomBytes(12).toString('hex'),
      ...inquiryInput,
      status: 'New inquiry',
      createdAt: now,
      updatedAt: now,
    };
    state.inquiries.unshift(inquiry);
    state.outbox.unshift({
      id: randomBytes(12).toString('hex'),
      type: 'new_inquiry_notification',
      to: 'admin@jovexalabs.com',
      inquiryId: inquiry.id,
      status: 'simulation_only_not_sent',
      message: 'Local simulation notification created. No email was sent.',
      createdAt: now,
    });
    recordAudit(state, 'public_customer', 'inquiry.created', 'inquiry', inquiry.id, { category: inquiry.category });
    await persist(state);
    return send(response, 201, {
      accepted: true,
      reference: inquiry.id,
      message: 'Your inquiry was recorded in this local simulation. No email was sent.',
      mode: 'local-simulation',
    });
  }
  const publicQuoteMatch = url.pathname.match(/^\/api\/public\/quotes\/([A-Za-z0-9_-]+)$/);
  if (publicQuoteMatch && method === 'GET') {
    const quote = state.quotations.find((item) => item.acceptToken === publicQuoteMatch[1]);
    if (!quote) throw new SimulationError(404, 'Quotation link not found.');
    const inquiry = inquiryForId(quote.inquiryId);
    return send(response, 200, {
      ...publicQuotation(quote),
      customerName: inquiry.name,
      business: inquiry.business,
      expired: Date.now() > Date.parse(quote.expiresAt),
    });
  }
  if (publicQuoteMatch && method === 'POST') {
    const quote = state.quotations.find((item) => item.acceptToken === publicQuoteMatch[1]);
    if (!quote) throw new SimulationError(404, 'Quotation link not found.');
    if (Date.now() > Date.parse(quote.expiresAt)) throw new SimulationError(410, 'This quotation has expired.');
    if (!['Quotation sent', 'Awaiting customer'].includes(quote.status)) {
      throw new SimulationError(409, 'This quotation is no longer awaiting a response.');
    }
    const answer = body.answer;
    const inquiry = inquiryForId(quote.inquiryId);
    if (answer === 'accept') {
      quote.status = 'Accepted';
      transitionInquiry(state, inquiry, 'Accepted', 'customer_via_quote_link');
    } else if (answer === 'changes') {
      quote.status = 'Changes requested';
      transitionInquiry(state, inquiry, 'Under review', 'customer_via_quote_link');
    } else {
      throw new SimulationError(400, 'Choose accept or request changes.');
    }
    quote.respondedAt = new Date().toISOString();
    state.outbox.unshift({
      id: randomBytes(12).toString('hex'),
      type: 'quotation_response_notice',
      to: 'admin@jovexalabs.com',
      status: 'simulation_only_not_sent',
      message: 'Customer quotation response recorded locally. No email was sent.',
      createdAt: quote.respondedAt,
    });
    await persist(state);
    return send(response, 200, { status: quote.status, message: 'Response recorded in the local simulation.' });
  }

  if (url.pathname.startsWith('/api/admin/')) {
    const readOnly = method === 'GET';
    const session = requireAdmin(request, !readOnly);
    const actor = session.email;
    if (method === 'GET' && url.pathname === '/api/admin/state') {
      return send(response, 200, cleanAdminState());
    }
    if (method === 'GET' && url.pathname === '/api/admin/analytics') {
      const byStatus = Object.fromEntries([...new Set(state.inquiries.map((item) => item.status))]
        .map((status) => [status, state.inquiries.filter((item) => item.status === status).length]));
      return send(response, 200, {
        totalInquiries: state.inquiries.length,
        newInquiries: state.inquiries.filter((item) => item.status === 'New inquiry').length,
        activeProjects: state.projects.filter((item) => !['Completed', 'Cancelled'].includes(item.status)).length,
        quotations: state.quotations.length,
        packages: state.packages.length,
        inquiriesByStatus: byStatus,
        tracking: 'No third-party analytics or pixels are enabled. Counts are calculated from local simulation inquiries only.',
      });
    }
    const inquiryStatusMatch = url.pathname.match(/^\/api\/admin\/inquiries\/([a-f0-9]+)\/status$/);
    if (inquiryStatusMatch && method === 'PATCH') {
      const inquiry = inquiryForId(inquiryStatusMatch[1]);
      transitionInquiry(state, inquiry, body.status, actor);
      await persist(state);
      return send(response, 200, { inquiry });
    }
    const quotationMatch = url.pathname.match(/^\/api\/admin\/inquiries\/([a-f0-9]+)\/quotations$/);
    if (quotationMatch && method === 'POST') {
      const inquiry = inquiryForId(quotationMatch[1]);
      const quote = createQuotation(state, inquiry, body, actor);
      await persist(state);
      return send(response, 201, {
        quotation: publicQuotation(quote),
        responsePath: `/quote/${quote.acceptToken}`,
        message: 'Quotation and local outbox notice prepared. No email was sent.',
      });
    }
    const packageMatch = url.pathname.match(/^\/api\/admin\/packages\/([A-Za-z0-9_-]+)$/);
    if (packageMatch && method === 'PUT') {
      if (body.expectedVersion !== state.pricingVersion) {
        throw new SimulationError(409, 'Package configuration changed. Reload before editing it.');
      }
      const item = state.packages.find((entry) => entry.id === packageMatch[1]);
      if (!item) throw new SimulationError(404, 'Package not found.');
      const old = { priceUsd: item.priceUsd, summary: item.summary };
      if (!Number.isSafeInteger(body.priceUsd) || body.priceUsd < 1 || body.priceUsd > 200000) {
        throw new SimulationError(400, 'Price must be a whole USD amount between 1 and 200,000.');
      }
      const summary = cleanText(body.summary, 'Package summary', 300, { required: true });
      item.priceUsd = body.priceUsd;
      item.summary = summary;
      state.pricingVersion += 1;
      recordAudit(state, actor, 'package.updated', 'package', item.id, { old, next: { priceUsd: item.priceUsd, summary: item.summary } });
      await persist(state);
      return send(response, 200, { package: item, pricingVersion: state.pricingVersion });
    }
    if (method === 'PUT' && url.pathname === '/api/admin/maintenance') {
      if (body.expectedVersion !== state.pricingVersion) {
        throw new SimulationError(409, 'Service configuration changed. Reload before editing it.');
      }
      if (!Number.isSafeInteger(body.priceUsd) || body.priceUsd < 1 || body.priceUsd > 10000) {
        throw new SimulationError(400, 'Maintenance price must be a whole USD amount between 1 and 10,000.');
      }
      const previous = state.maintenance.priceUsd;
      state.maintenance.priceUsd = body.priceUsd;
      state.pricingVersion += 1;
      recordAudit(state, actor, 'maintenance.updated', 'maintenance', 'monthly', {
        previous,
        next: state.maintenance.priceUsd,
      });
      await persist(state);
      return send(response, 200, { maintenance: state.maintenance, pricingVersion: state.pricingVersion });
    }
    const templateMatch = url.pathname.match(/^\/api\/admin\/templates\/([a-z0-9-]+)$/);
    if (templateMatch && method === 'PUT') {
      const item = state.templates.find((entry) => entry.slug === templateMatch[1]);
      if (!item) throw new SimulationError(404, 'Demo not found.');
      const previous = { name: item.name, description: item.description, published: item.published !== false };
      if (typeof body.published !== 'boolean') throw new SimulationError(400, 'Published must be true or false.');
      const name = cleanText(body.name, 'Demo name', 100, { required: true });
      const description = cleanText(body.description, 'Demo description', 400, { required: true });
      item.name = name;
      item.description = description;
      item.published = body.published;
      recordAudit(state, actor, 'template.updated', 'template', item.slug, {
        previous,
        next: { name: item.name, description: item.description, published: item.published },
      });
      await persist(state);
      return send(response, 200, { template: item });
    }
    const projectMatch = url.pathname.match(/^\/api\/admin\/projects\/([a-f0-9]+)$/);
    if (projectMatch && method === 'PATCH') {
      const project = projectForId(projectMatch[1]);
      const transitions = {
        Accepted: ['In development', 'Cancelled'],
        'In development': ['Awaiting approval', 'Cancelled'],
        'Awaiting approval': ['Completed', 'In development', 'Cancelled'],
        Completed: [],
        Cancelled: [],
      };
      if (!transitions[project.status]?.includes(body.status)) {
        throw new SimulationError(409, `Cannot move a project from "${project.status}" to "${body.status}".`);
      }
      const previous = project.status;
      project.status = body.status;
      project.updatedAt = new Date().toISOString();
      recordAudit(state, actor, 'project.status_changed', 'project', project.id, { previous, next: project.status });
      const inquiry = inquiryForId(project.inquiryId);
      if (inquiry.status !== project.status && ['In development', 'Awaiting approval', 'Completed', 'Cancelled'].includes(project.status)) {
        const from = inquiry.status;
        if (project.status === 'Cancelled' && ['New inquiry', 'Under review', 'Quotation sent', 'Awaiting customer', 'Accepted', 'In development'].includes(from)) {
          transitionInquiry(state, inquiry, 'Cancelled', actor);
        } else if (project.status !== 'Cancelled') {
          transitionInquiry(state, inquiry, project.status, actor);
        }
      }
      await persist(state);
      return send(response, 200, { project });
    }
    const portfolioMatch = url.pathname.match(/^\/api\/admin\/portfolio\/([a-f0-9]+)$/);
    if (portfolioMatch && method === 'PATCH') {
      state.portfolio ||= [];
      const entry = state.portfolio.find((item) => item.id === portfolioMatch[1]);
      if (!entry) throw new SimulationError(404, 'Portfolio entry not found.');
      if (body.permissionConfirmed !== true) throw new SimulationError(400, 'Customer permission must remain confirmed.');
      const title = cleanText(body.title, 'Portfolio title', 120, { required: true });
      const summary = cleanText(body.summary, 'Portfolio summary', 1000, { required: true });
      if (typeof body.published !== 'boolean') throw new SimulationError(400, 'Published must be true or false.');
      const previous = { title: entry.title, summary: entry.summary, published: entry.published };
      Object.assign(entry, { title, summary, published: body.published });
      recordAudit(state, actor, 'portfolio.updated', 'portfolio', entry.id, {
        previous,
        next: { title, summary, published: entry.published },
      });
      await persist(state);
      return send(response, 200, { entry });
    }
    if (method === 'POST' && url.pathname === '/api/admin/projects/from-accepted') {
      const inquiry = inquiryForId(cleanText(body.inquiryId, 'Inquiry ID', 40, { required: true }));
      if (inquiry.status !== 'Accepted') throw new SimulationError(409, 'Only accepted inquiries can become projects.');
      let project = state.projects.find((entry) => entry.inquiryId === inquiry.id);
      if (!project) {
        transitionInquiry(state, inquiry, 'In development', actor);
        project = state.projects.find((entry) => entry.inquiryId === inquiry.id);
      }
      await persist(state);
      return send(response, 200, { project });
    }
    const invoiceMatch = url.pathname.match(/^\/api\/admin\/projects\/([a-f0-9]+)\/invoices$/);
    if (invoiceMatch && method === 'POST') {
      const project = projectForId(invoiceMatch[1]);
      if (!['Accepted', 'In development'].includes(project.status)) {
        throw new SimulationError(409, 'Only accepted or active projects can be invoiced.');
      }
      const invoice = createInvoice(state, project, body.amountUsd, actor);
      await persist(state);
      return send(response, 201, { invoice });
    }
    const sandboxEventMatch = url.pathname.match(/^\/api\/admin\/invoices\/([a-f0-9]+)\/sandbox-events$/);
    if (sandboxEventMatch && method === 'POST') {
      const invoice = invoiceForId(sandboxEventMatch[1]);
      const eventId = cleanText(body.eventId || `sim_${randomUUID()}`, 'Sandbox event ID', 100, { required: true });
      const result = simulatePaymentEvent(state, invoice, eventId, body.type, actor);
      await persist(state);
      return send(response, 200, { ...result, invoice });
    }
    if (method === 'GET' && url.pathname === '/api/admin/notifications') {
      return send(response, 200, {
        deliveryEnabled: false,
        provider: null,
        outbox: state.outbox,
        message: 'Email delivery is disabled. Outbox entries are simulation records only.',
      });
    }
    if (method === 'GET' && url.pathname === '/api/admin/audit') {
      return send(response, 200, state.auditLog);
    }
    if (method === 'POST' && url.pathname === '/api/admin/portfolio') {
      const projectId = cleanText(body.projectId, 'Project', 40, { required: true });
      const project = projectForId(projectId);
      if (project.status !== 'Completed') throw new SimulationError(409, 'Only completed projects can be proposed as portfolio entries.');
      if (body.permissionConfirmed !== true) throw new SimulationError(400, 'Confirm that the customer granted permission before publishing a portfolio entry.');
      state.portfolio ||= [];
      if (state.portfolio.some((entry) => entry.projectId === project.id)) {
        throw new SimulationError(409, 'This project already has a portfolio entry.');
      }
      const entry = {
        id: randomBytes(12).toString('hex'),
        projectId: project.id,
        title: cleanText(body.title, 'Portfolio title', 120, { required: true }),
        summary: cleanText(body.summary, 'Portfolio summary', 1000, { required: true }),
        published: body.published === true,
        customerPermissionConfirmed: true,
        createdAt: new Date().toISOString(),
      };
      state.portfolio.unshift(entry);
      recordAudit(state, actor, 'portfolio.created', 'portfolio', entry.id, { projectId: project.id, published: entry.published });
      await persist(state);
      return send(response, 201, { entry });
    }
    throw new SimulationError(404, 'Admin API route not found.');
  }
  throw new SimulationError(404, 'API route not found.');
}

assertLoopback();
state = await loadState();
let requestQueue = Promise.resolve();
const server = createServer((request, response) => {
  requestQueue = requestQueue.then(async () => {
    try {
      await route(request, response);
    } catch (error) {
      if (error instanceof SimulationError) {
        send(response, error.status, { error: error.message });
        return;
      }
      console.error('Local simulation request failed:', error);
      send(response, 500, { error: 'Local simulation request failed. Check the server output.' });
    }
  });
});

server.on('error', (error) => {
  console.error('Local simulation API could not start:', error);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log(`Jovexa local simulation API: http://${HOST}:${PORT}`);
  if (!state.admin) {
    if (process.env.JOVEXA_SETUP_TOKEN) {
      console.log('One-time administrator setup token supplied by test environment.');
    } else {
      console.log(`One-time administrator setup token: ${setupToken}`);
    }
  } else {
    console.log(`Administrator setup already complete for ${state.admin.email}.`);
  }
  console.log(`Simulation data file: ${DATA_FILE}`);
});

function close() {
  server.close(() => process.exit(0));
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
