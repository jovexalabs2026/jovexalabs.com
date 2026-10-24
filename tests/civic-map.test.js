import test from 'node:test';
import assert from 'node:assert/strict';
import { createCivicMap, normalizeGlobeCenter } from '../src/lib/civic-map.js';
import { projectCoordinate } from '../src/data/civic-explorer.js';

test('flat map retains existing capital coordinates and complete marker visibility', () => {
  const map = createCivicMap('map', [120, 15]);
  for (const coordinate of [[120, 15], [-75, 45], [0, 0]]) {
    const actual = map.project(coordinate);
    const expected = projectCoordinate(coordinate);
    actual.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < .00001));
    assert.equal(map.isVisible(coordinate), true);
  }
  assert.match(map.landPath, /^M/);
  assert.ok(!map.landPath.includes('NaN'));
});

test('globe centers chosen regions and excludes far-side and horizon markers', () => {
  const globe = createCivicMap('globe', [0, 0]);
  assert.deepEqual(globe.project([0, 0]), [450, 225]);
  assert.equal(globe.isVisible([0, 0]), true);
  assert.equal(globe.isVisible([180, 0]), false);
  assert.equal(globe.isVisible([90, 0]), false);
  const turned = createCivicMap('globe', [180, 0]);
  assert.equal(turned.isVisible([180, 0]), true);
  assert.equal(turned.isVisible([0, 0]), false);
  assert.notEqual(globe.landPath, turned.landPath);
  assert.match(globe.spherePath, /^M/);
  assert.ok(!globe.landPath.includes('NaN'));
});

test('globe rotation wraps longitude and clamps poles without invalid geometry', () => {
  assert.deepEqual(normalizeGlobeCenter([540, 100]), [-180, 80]);
  assert.deepEqual(normalizeGlobeCenter([-541, -100]), [179, -80]);
  for (const center of [[120, 80], [-120, -80], [0, 0]]) {
    const map = createCivicMap('globe', center);
    assert.ok(!map.landPath.includes('NaN'));
    assert.ok(!map.gridPath.includes('NaN'));
  }
});
