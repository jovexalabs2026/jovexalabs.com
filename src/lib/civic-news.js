export const NASA_FEED_URL = 'https://www.nasa.gov/feed/';
export const READING_MS = 30_000;
export const MAX_FEED_BYTES = 1_048_576;

export function validateNewsItem({ title, url, publishedAt }) {
  const destination = new URL(url);
  if (destination.protocol !== 'https:' || !['www.nasa.gov', 'science.nasa.gov'].includes(destination.hostname) ||
    destination.username || destination.password || destination.port ||
    !title.trim() || title.length > 400 || !Number.isFinite(Date.parse(publishedAt))) {
    throw new Error('The publisher feed contains an invalid article.');
  }
  return { id: destination.href, title: title.trim(), url: destination.href,
    publishedAt: new Date(publishedAt).toISOString(), publisher: 'NASA' };
}

export function parseNewsFeed(xml) {
  if (new TextEncoder().encode(xml).length > MAX_FEED_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new Error('The publisher feed exceeds the size limit or contains unsupported XML declarations.');
  }
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  if (document.querySelector('parsererror') || document.documentElement.nodeName !== 'rss') {
    throw new Error('The publisher returned an unreadable RSS feed.');
  }
  const items = [...document.querySelectorAll('channel > item')].slice(0, 50).map((item) =>
    validateNewsItem({
      title: item.querySelector('title')?.textContent ?? '',
      url: item.querySelector('link')?.textContent?.trim() ?? '',
      publishedAt: item.querySelector('pubDate')?.textContent ?? '',
    }));
  const unique = [...new Map(items.map((item) => [item.id, item])).values()];
  if (!unique.length) throw new Error('The publisher feed currently contains no articles.');
  return unique.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 12);
}

export async function fetchNewsFeed(signal) {
  const response = await fetch(NASA_FEED_URL, { signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!response.ok) throw new Error(`Publisher feed request failed (HTTP ${response.status}).`);
  if (!response.body) throw new Error('The publisher returned an empty response.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let xml = '';
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) {
        await reader.cancel();
        throw new Error('The publisher feed exceeds the 1 MiB limit.');
      }
      xml += decoder.decode(value, { stream: true });
    }
    xml += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return parseNewsFeed(xml);
}

export function readingRemaining(startedAt, now) {
  if (!Number.isFinite(startedAt) || !Number.isFinite(now) || startedAt < 0 || now < startedAt) {
    throw new Error('The reading timer is invalid. Start the activity again.');
  }
  return Math.max(0, READING_MS - (now - startedAt));
}
