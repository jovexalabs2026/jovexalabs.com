import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const pages = ['privacy', 'terms', 'community-guidelines', 'delete-account'];

test('Jovexa Move policy pages are static, linked to each other and in the sitemap', () => {
  const sitemap = read('../public/sitemap.xml');
  for (const page of pages) {
    const html = read(`../public/move/${page}.html`);
    assert.ok(sitemap.includes(`https://jovexalabs.com/move/${page}`));
    assert.match(html, /support@jovexalabs\.com/);
    assert.match(html, /com\.jovexalabs\.move/);
    for (const other of pages.filter((p) => p !== page)) {
      assert.ok(html.includes(`href="/move/${other}"`), `${page} links to ${other}`);
    }
  }
});

test('Jovexa Move disclosures that Google Play reviews are present', () => {
  const privacy = read('../public/move/privacy.html');
  const guidelines = read('../public/move/community-guidelines.html');
  const deletion = read('../public/move/delete-account.html');

  assert.match(privacy, /18 or over/);
  assert.match(privacy, /never asks for background location/);
  assert.match(privacy, /not end-to-end encrypted/);
  assert.match(guidelines, /zero tolerance for child sexual abuse and exploitation/);
  assert.match(guidelines, /National Center for Missing &amp; Exploited Children/);
  assert.match(deletion, /type <strong>DELETE<\/strong>/);
  assert.match(deletion, /does not cancel/);
});
