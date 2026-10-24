import test from 'node:test';
import assert from 'node:assert/strict';
import { CIVIC_REGIONS, CIVIC_LAYERS, filterRegions, projectCoordinate, mapViewport } from '../src/data/civic-explorer.js';

test('world projection uses bounded equirectangular coordinates and rejects invalid input', () => {
  assert.deepEqual(projectCoordinate([-180, 90]), [0, 0]);
  assert.deepEqual(projectCoordinate([180, -90]), [900, 450]);
  assert.deepEqual(projectCoordinate([0, 0]), [450, 225]);
  for (const coordinate of [[NaN, 0], [0, Infinity], [181, 0], [0, -91]]) {
    assert.throws(() => projectCoordinate(coordinate), /Invalid map coordinate/);
  }
});

test('region filters combine case-insensitive search with enabled layers', () => {
  const all = CIVIC_LAYERS.map((layer) => layer.id);
  assert.equal(filterRegions('  PHILIPPINES ', all)[0].id, 'ph');
  assert.equal(filterRegions('Ottawa', all)[0].id, 'ca');
  assert.equal(filterRegions('Oceania', all).length, 2);
  assert.equal(filterRegions('', []).length, 0);
  assert.equal(filterRegions('Philippines', ['services']).length, 0);
  assert.equal(filterRegions('<script>', all).length, 0);
});

test('sample regions have unique identities, safe external links, and valid map positions', () => {
  assert.equal(new Set(CIVIC_REGIONS.map((region) => region.id)).size, CIVIC_REGIONS.length);
  for (const region of CIVIC_REGIONS) {
    assert.equal(new URL(region.url).protocol, 'https:');
    assert.ok(CIVIC_LAYERS.some((layer) => layer.id === region.layer));
    const [x, y] = projectCoordinate(region.coordinates);
    assert.ok(x >= 0 && x <= 900 && y >= 0 && y <= 450);
  }
});

test('map viewport stays in world bounds at every zoom and edge', () => {
  for (const zoom of [.5, 1, 2, 4, 10]) {
    for (const center of [[0, 0], [900, 450], [-500, 900]]) {
      const [x, y, width, height] = mapViewport(zoom, center);
      assert.ok(x >= 0 && y >= 0 && x + width <= 900 && y + height <= 450);
      assert.ok(width >= 225 && width <= 900);
    }
  }
});
