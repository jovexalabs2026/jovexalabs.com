import test from 'node:test';
import assert from 'node:assert/strict';
import { MAP_COUNTRIES, createCivicMap } from '../src/lib/civic-map.js';
import { indicatorUrl, parseIndicator, parseLeadership, leadershipUrl, fetchCountryJson } from '../src/lib/country-data.js';

test('reference boundaries have unique selectable IDs and correct ISO associations', () => {
  assert.equal(MAP_COUNTRIES.length, 241);
  assert.equal(new Set(MAP_COUNTRIES.map((country) => country.id)).size, 241);
  assert.equal(MAP_COUNTRIES.find((country) => country.name === 'Philippines').iso3, 'PHL');
  const map = createCivicMap('globe', [120, 15]);
  assert.ok(map.countries.some((country) => country.name === 'Philippines' && country.path));
  assert.ok(map.countries.every((country) => !country.path?.includes('NaN')));
});

test('indicator requests cannot inject countries or arbitrary indicator IDs', () => {
  assert.match(indicatorUrl('PHL', 'NY.GDP.MKTP.CD'), /^https:\/\/api\.worldbank\.org\/v2\/country\/PHL\//);
  assert.throws(() => indicatorUrl('PHL/../all', 'NY.GDP.MKTP.CD'));
  assert.throws(() => indicatorUrl('PHL', 'other'));
  assert.throws(() => leadershipUrl('PHL" . ?s ?p ?o'));
});

test('World Bank values retain reference years and missing data is not converted to zero', () => {
  const row = { countryiso3code: 'PHL', country: { value: 'Philippines' },
    indicator: { id: 'SP.POP.TOTL' }, value: 100_000_000, date: '2025' };
  assert.equal(parseIndicator([{ lastupdated: '2026-10-08' }, [row]], 'PHL', 'SP.POP.TOTL').year, '2025');
  assert.equal(parseIndicator([{}, [{ ...row, value: null }]], 'PHL', 'SP.POP.TOTL').unavailable, true);
  assert.equal(parseIndicator([{ total: 0 }, null], 'PHL', 'SP.POP.TOTL').unavailable, true);
  assert.throws(() => parseIndicator([{}, [{ ...row, countryiso3code: 'CAN' }]], 'PHL', 'SP.POP.TOTL'));
  assert.throws(() => parseIndicator([{}, [{ ...row, value: '100' }]], 'PHL', 'SP.POP.TOTL'));
  assert.throws(() => parseIndicator({ message: 'provider error' }, 'PHL', 'SP.POP.TOTL'));
});

test('leadership results have safe source links and preserve empty results explicitly', () => {
  const row = { person: { value: 'http://www.wikidata.org/entity/Q1' }, country: { value: 'http://www.wikidata.org/entity/Q2' },
    personLabel: { value: 'Example office holder' }, role: { value: 'Head of state' } };
  assert.equal(parseLeadership({ results: { bindings: [row] } })[0].personUrl, 'https://www.wikidata.org/entity/Q1');
  assert.deepEqual(parseLeadership({ results: { bindings: [] } }), []);
  assert.throws(() => parseLeadership({ results: { bindings: [{ ...row, person: { value: 'javascript:alert(1)' } }] } }));
});

test('public-data fetch enforces the exact 1 MiB limit and explicit HTTP/JSON errors', async (t) => {
  const body = JSON.stringify('x'.repeat(1_048_574));
  t.mock.method(globalThis, 'fetch', async () => new Response(body));
  assert.equal((await fetchCountryJson('https://example.invalid')).length, 1_048_574);
  globalThis.fetch.mock.mockImplementation(async () => new Response(`${body} `));
  await assert.rejects(fetchCountryJson('https://example.invalid'), /exceeds the 1 MiB limit/);
  globalThis.fetch.mock.mockImplementation(async () => new Response('Unavailable', { status: 503 }));
  await assert.rejects(fetchCountryJson('https://example.invalid'), /HTTP 503/);
  globalThis.fetch.mock.mockImplementation(async () => new Response('<html>Not JSON</html>'));
  await assert.rejects(fetchCountryJson('https://example.invalid'), SyntaxError);
});
