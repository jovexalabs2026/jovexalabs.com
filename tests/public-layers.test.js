import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublicLayer, infrastructureUrl, loadPublicLayer, PUBLIC_LAYERS } from '../src/lib/public-layers.js';

const earthquake = { type: 'FeatureCollection', metadata: { generated: 1_792_800_000_000 },
  features: [{ id: 'test', geometry: { type: 'Point', coordinates: [120, 15, 10] },
    properties: { title: 'Test observation', mag: 3, time: 1_792_800_000_000, updated: 1_792_800_001_000,
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/test', status: 'automatic' } }] };

test('USGS observations keep source times and reject unsafe links and coordinates', () => {
  const result = parsePublicLayer('incidents', earthquake);
  assert.equal(result.markers[0].title, 'Test observation');
  assert.match(result.markers[0].note, /preliminary/);
  const invalid = structuredClone(earthquake);
  invalid.features[0].properties.url = 'https://evil.invalid/';
  assert.throws(() => parsePublicLayer('incidents', invalid), /unsupported source/);
  invalid.features[0].geometry.coordinates[0] = 181;
  assert.throws(() => parsePublicLayer('incidents', invalid), /invalid earthquake/);
  assert.throws(() => parsePublicLayer('incidents', {}), /invalid earthquake collection/);
});

test('EONET uses latest geometry, counts omitted polygons and never maps old points as current', () => {
  const base = { id: 'event', title: 'Test event', link: 'https://eonet.gsfc.nasa.gov/api/v3/events/event' };
  const result = parsePublicLayer('events', { events: [{ ...base, geometry: [
    { type: 'Point', coordinates: [20, 30], date: '2026-10-20' },
    { type: 'Point', coordinates: [25, 35], date: '2026-10-23' },
  ] }, { ...base, id: 'polygon', geometry: [{ type: 'Polygon', date: '2026-10-23', coordinates: [] }] }] });
  assert.deepEqual(result.markers[0].coordinates, [25, 35]);
  assert.equal(result.omitted, 1);
  assert.deepEqual(parsePublicLayer('events', { events: [] }).markers, []);
  assert.throws(() => parsePublicLayer('events', { events: [{ ...base, geometry: [
    { type: 'Point', coordinates: [0, 0], date: 'not a date' },
  ] }] }), /invalid observation time/);
});

test('facility requests are constrained, source safe, non-operational reference locations', () => {
  assert.match(decodeURIComponent(infrastructureUrl('ports')), /wd:Q44782/);
  assert.match(decodeURIComponent(infrastructureUrl('nuclear')), /LIMIT 100/);
  assert.throws(() => infrastructureUrl('unknown'));
  const row = { item: { value: 'http://www.wikidata.org/entity/Q1' }, itemLabel: { value: 'Test port' },
    location: { value: 'Point(120.5 -10.2)' } };
  const result = parsePublicLayer('ports', { results: { bindings: [row, row] } });
  assert.equal(result.markers.length, 1);
  assert.equal(result.markers[0].observed, null);
  assert.match(result.markers[0].note, /not live operational/i);
  assert.throws(() => parsePublicLayer('ports', { results: { bindings: [{ ...row,
    location: { value: 'Point(999 15)' } }] } }), /invalid facility coordinates/);
});

test('curated passages are explicit reference points, not live closures', async () => {
  const result = await loadPublicLayer('passages');
  assert.equal(result.markers.length, 4);
  assert.ok(result.markers.every((marker) => marker.observed === null && marker.note.includes('No current closure')));
  assert.equal(PUBLIC_LAYERS.length, 5);
});
