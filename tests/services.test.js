import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { maintenance, packages, templates, validateServiceCatalog } from '../src/data/services.js';

test('service pricing is unique, positive, and matches the approved published starting points', () => {
  assert.doesNotThrow(validateServiceCatalog);
  assert.deepEqual(
    packages.map(({ id, priceUsd }) => [id, priceUsd]),
    [
      ['starter', 149],
      ['professional', 399],
      ['ecommerce', 799],
      ['custom', 1499],
    ],
  );
  assert.equal(maintenance.priceUsd, 29);
  assert.match(packages.find((item) => item.id === 'ecommerce').includes.join(' '), /up to 20 initial product listings/);
});

test('ten original template demos have unique routes and valid package compatibility', () => {
  assert.equal(templates.length, 10);
  assert.equal(new Set(templates.map((template) => template.slug)).size, 10);
  const packageIds = new Set(packages.map((item) => item.id));
  for (const template of templates) {
    assert.ok(packageIds.has(template.packageId));
    assert.ok(template.items.length >= 3);
    assert.ok(template.color.startsWith('#'));
  }
});

test('quote experience discloses its local email-draft behavior without claiming delivery', () => {
  const form = fs.readFileSync(new URL('../src/components/QuoteRequestForm.jsx', import.meta.url), 'utf8');
  const policy = fs.readFileSync(new URL('../src/pages/Privacy.jsx', import.meta.url), 'utf8');
  assert.match(form, /does not send, store, or\s+track your answers/);
  assert.match(form, /inquiry is received only if you open and send the draft/);
  assert.match(policy, /does not submit or store the\s+form\s+contents/);
  assert.doesNotMatch(form, /fetch\(|localStorage|sessionStorage/);
});

test('service and template routes are listed in the sitemap', () => {
  const sitemap = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const routes = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  for (const route of ['/services', '/pricing', '/templates', '/website-development']) {
    assert.ok(sitemap.includes(`https://jovexalabs.com${route}`));
  }
  assert.match(routes, /path="templates\/:templateSlug"/);
  for (const template of templates) {
    assert.ok(sitemap.includes(`https://jovexalabs.com/templates/${template.slug}`));
  }
});
