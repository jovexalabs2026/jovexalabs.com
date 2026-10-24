import test from 'node:test';
import assert from 'node:assert/strict';
import { READING_MS, readingRemaining, validateNewsItem } from '../src/lib/civic-news.js';

test('article metadata is attributed, normalized and restricted to official HTTPS destinations', () => {
  const item = validateNewsItem({ title: ' Example headline ', url: 'https://www.nasa.gov/example/',
    publishedAt: 'Fri, 23 Oct 2026 12:00:00 GMT' });
  assert.equal(item.publisher, 'NASA');
  assert.equal(item.title, 'Example headline');
  assert.equal(item.publishedAt, '2026-10-23T12:00:00.000Z');
  assert.equal(validateNewsItem({ ...item, url: 'https://science.nasa.gov/earth/' }).publisher, 'NASA');
  for (const url of ['javascript:alert(1)', 'https://www.nasa.gov.evil.test/story',
    'https://user:secret@www.nasa.gov/story', 'http://www.nasa.gov/story', 'https://www.nasa.gov:8443/story']) {
    assert.throws(() => validateNewsItem({ title: 'Example', url, publishedAt: item.publishedAt }));
  }
  assert.throws(() => validateNewsItem({ title: '', url: item.url, publishedAt: item.publishedAt }));
  assert.throws(() => validateNewsItem({ title: 'Example', url: item.url, publishedAt: 'invalid' }));
});

test('reading timer enforces the exact 30-second threshold without monetary output', () => {
  assert.equal(READING_MS, 30_000);
  assert.equal(readingRemaining(1000, 30_999), 1);
  assert.equal(readingRemaining(1000, 31_000), 0);
  assert.equal(readingRemaining(1000, 100_000), 0);
  for (const [start, now] of [[-1, 3], [100, 99], [NaN, 10], [0, Infinity]]) {
    assert.throws(() => readingRemaining(start, now), /timer is invalid/);
  }
});
