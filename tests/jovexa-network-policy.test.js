import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');

test('Jovexa Network policy routes are linked and included in the sitemap', () => {
  const routes = read('../src/App.jsx');
  const footer = read('../src/components/Footer.jsx');
  const sitemap = read('../public/sitemap.xml');
  const paths = [
    'privacy',
    'terms',
    'participation-and-ads',
    'account-deletion',
  ];

  for (const path of paths) {
    const route = `/apps/jovexa-network/${path}`;
    assert.ok(routes.includes(`apps/jovexa-network/${path}`));
    assert.ok(footer.includes(route));
    assert.ok(sitemap.includes(`https://jovexalabs.com${route}`));
  }
});

test('Jovexa Network disclosures match the current app behavior', () => {
  const privacy = read('../src/pages/JovexaNetworkPrivacy.jsx');
  const terms = read('../src/pages/JovexaNetworkTerms.jsx');
  const participation = read('../src/pages/JovexaNetworkParticipation.jsx');

  for (const document of [privacy, terms, participation]) {
    assert.match(document, /24-hour/);
    assert.match(document, /no monetary or cryptocurrency value|no cash or cryptocurrency/);
    assert.match(document, /does not mine cryptocurrency|not a cryptocurrency miner/);
  }
  assert.match(privacy, /Supabase/);
  assert.match(privacy, /User Messaging Platform/);
  assert.match(participation, /server-side verification/);
});

test('external account deletion request identifies its email-only behavior', () => {
  const deletion = read('../src/pages/JovexaNetworkAccountDeletion.jsx');

  assert.match(deletion, /type="email"/);
  assert.match(deletion, /mailto:\$\{CONTACT_EMAIL\}/);
  assert.match(deletion, /does not send or store your request/);
  assert.match(deletion, /verify that you control the\s+account/);
  assert.match(deletion, /Google or other\s+independent\s+providers/);
});

test('GitHub Pages deep-link restoration avoids cached root fallbacks', () => {
  const redirect = read('../public/redirect-path.js');
  const restore = read('../public/restore-path.js');

  assert.match(redirect, /searchParams\.set\('_redirect', Date\.now\(\)\.toString\(\)\)/);
  assert.match(restore, /params\.delete\('_redirect'\)/);
});
