import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assessSafety } from '../src/lib/digital2030/safety.js';
import { businessPlan, documentTotal } from '../src/lib/digital2030/business.js';
import { publicServices } from '../src/lib/digital2030/services.js';
import { products } from '../src/data/products.js';

test('business arithmetic uses integer centavos and rejects invalid inputs', () => {
  assert.equal(documentTotal('3', '0.10').cents, 30);
  assert.equal(documentTotal('2', '1234.56').cents, 246912);
  for (const [quantity, price] of [['0', '1'], ['1.5', '2'], ['1', '-1'], ['1', '1.001']]) {
    assert.throws(() => documentTotal(quantity, price));
  }
  assert.match(businessPlan('Demo', 'Fictional audience', 'Websites'), /not guaranteed returns/);
  assert.throws(() => businessPlan('', 'customer', 'offer'));
});

test('safety checks never fetch submitted URLs and avoid safety guarantees', () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('No network request allowed'); };
  try {
    const result = assessSafety('URGENT: share OTP at http://127.0.0.1');
    assert.ok(result.indicators.length >= 4);
    assert.match(result.note, /No URL was opened/);
    assert.match(assessSafety('Normal message').label, /not a safety guarantee/);
    assert.throws(() => assessSafety(''));
  } finally { globalThis.fetch = original; }
});

test('directory is limited to official HTTPS homepage destinations', () => {
  assert.equal(publicServices.length, 8);
  for (const service of publicServices) {
    const url = new URL(service.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.hostname.endsWith('.gov.ph'));
    assert.equal(url.pathname, '/');
  }
});

test('limited-release source clearly excludes private production features and fake metrics', () => {
  const source = fs.readFileSync(new URL('../src/pages/Digital2030.jsx', import.meta.url), 'utf8');
  assert.match(source, /Live AI is unavailable/);
  assert.match(source, /not a UN, World Bank/);
  assert.match(source, /no account system or centralized usage tracking/);
  assert.match(source, /No PHBIN is issued/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});

test('all seven initiative routes are wired', () => {
  const routes = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  for (const route of ['digital2030', 'ai', 'education', 'services', 'cybersecurity', 'business', 'impact']) {
    assert.ok(routes.includes(`path="${route}"`));
  }
});

test('public web project guides use unique canonical paths and disclose limitations', () => {
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  const webProjects = products.filter((product) => product.projectPath);
  assert.equal(webProjects.length, 2);
  for (const product of webProjects) {
    assert.equal(product.projectPath, `/products/${product.slug}`);
    assert.ok(product.capabilities.length > 0);
    assert.ok(product.limitations.length > 0);
    assert.ok(product.link.startsWith('/'));
  }
  assert.match(webProjects.find((product) => product.slug === 'digital2030').limitations.join(' '), /No PHBIN issuance/);
});
