import { fetchCountryJson } from './country-data.js';

export const PUBLIC_LAYERS = [
  { id: 'incidents', name: 'Incident / earthquakes', symbol: '!', color: '#f49a77',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
    description: 'USGS magnitude 2.5+ past-day earthquakes. Preliminary reports can change; not all incidents or an emergency alert service.' },
  { id: 'events', name: 'Event / natural hazards', symbol: 'E', color: '#b6e784',
    url: 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=100',
    description: 'NASA EONET open natural events from the past 30 days, up to 100 records. Only the latest point observation per event is mapped; polygons are not mapped. Open does not guarantee an ongoing hazard.' },
  { id: 'nuclear', name: 'Nuclear plant / reference', symbol: 'N', color: '#86cfce',
    entity: 'Q134447', description: 'Wikidata public facility coordinates, up to 100 direct-class records. May include planned or closed sites. No operating, safety, security or reactor status.' },
  { id: 'ports', name: 'Port / reference', symbol: 'P', color: '#80c2ee',
    entity: 'Q44782', description: 'Wikidata public port coordinates, up to 100 direct-class records. Incomplete directory; no ship traffic, congestion, access or opening-status claims.' },
  { id: 'passages', name: 'Chokepoint / reference passages', symbol: 'C', color: '#edc781',
    description: 'Four curated maritime passages with schematic representative points. Bundled reference geography reviewed 2026-10-24; not navigation, closures or security-checkpoint data.' },
];

export const UNAVAILABLE_LAYERS = [
  ['Camera', 'No licensed public webcam source connected. Private or unsecured CCTV is not accessed.'],
  ['Ship', 'No licensed AIS provider connected; no live vessel positions.'],
  ['Military aircraft', 'Real-time operational military tracking is not offered.'],
  ['Conflict', 'No licensed, dated civilian reporting feed connected; no tactical positions.'],
];

const PASSAGES = [
  ['suez', 'Suez Canal', [32.55, 30.45], 'https://en.wikipedia.org/wiki/Suez_Canal'],
  ['panama', 'Panama Canal', [-79.7, 9.1], 'https://en.wikipedia.org/wiki/Panama_Canal'],
  ['malacca', 'Strait of Malacca', [100, 4], 'https://en.wikipedia.org/wiki/Strait_of_Malacca'],
  ['hormuz', 'Strait of Hormuz', [56.5, 26.6], 'https://en.wikipedia.org/wiki/Strait_of_Hormuz'],
];

function point(value) {
  return Array.isArray(value) && value.length >= 2 && value.slice(0, 2).every(Number.isFinite) &&
    Math.abs(value[0]) <= 180 && Math.abs(value[1]) <= 90;
}
function text(value) { return typeof value === 'string' && value.trim().length > 0 && value.length <= 500; }
function timestamp(value) {
  const time = typeof value === 'number' ? value : Date.parse(value);
  if (!Number.isFinite(time)) throw new Error('Provider supplied an invalid observation time.');
  return new Date(time).toISOString();
}
function source(value, host) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== host || url.username || url.password) {
    throw new Error('Provider supplied an unsupported source link.');
  }
  return url.href;
}

export function infrastructureUrl(id) {
  const layer = PUBLIC_LAYERS.find((item) => item.id === id && item.entity);
  if (!layer) throw new Error('Unsupported public infrastructure layer.');
  const query = `SELECT DISTINCT ?item ?itemLabel ?location WHERE {
    { SELECT DISTINCT ?item ?location WHERE { ?item wdt:P31 wd:${layer.entity}; wdt:P625 ?location } LIMIT 100 }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }`;
  return `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
}

export function parsePublicLayer(id, payload) {
  if (id === 'incidents') {
    if (payload?.type !== 'FeatureCollection' || !Array.isArray(payload.features) || payload.features.length > 2000) {
      throw new Error('USGS returned an invalid earthquake collection.');
    }
    return { published: timestamp(payload.metadata?.generated), omitted: 0, markers: payload.features.map((feature) => {
      const p = feature.properties;
      if (feature.geometry?.type !== 'Point' || !point(feature.geometry.coordinates) || !text(feature.id) ||
        !text(p?.title) || !Number.isFinite(p.mag)) throw new Error('USGS returned invalid earthquake metadata.');
      return { id: `usgs:${feature.id}`, title: p.title, coordinates: feature.geometry.coordinates.slice(0, 2),
        observed: timestamp(p.time), updated: timestamp(p.updated), url: source(p.url, 'earthquake.usgs.gov'),
        note: `Magnitude ${p.mag}; ${p.status === 'reviewed' ? 'provider-reviewed' : 'preliminary/unreviewed'}. Not an emergency warning.` };
    }) };
  }
  if (id === 'events') {
    if (!Array.isArray(payload?.events) || payload.events.length > 100) throw new Error('NASA returned an invalid event collection.');
    let omitted = 0;
    const markers = [];
    for (const event of payload.events) {
      if (!text(event.id) || !text(event.title) || !Array.isArray(event.geometry)) throw new Error('NASA returned invalid event metadata.');
      const geometry = [...event.geometry].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
      if (!geometry) { omitted++; continue; }
      const observed = timestamp(geometry.date);
      if (geometry.type !== 'Point') { omitted++; continue; }
      if (!point(geometry.coordinates)) throw new Error('NASA returned invalid event coordinates.');
      markers.push({ id: `eonet:${event.id}`, title: event.title, observed,
        coordinates: geometry.coordinates.slice(0, 2), url: source(event.link, 'eonet.gsfc.nasa.gov'),
        note: 'Latest reported point for this event, not its full extent or confirmed present location.' });
    }
    return { markers, omitted };
  }
  if (!['nuclear', 'ports'].includes(id)) throw new Error('Unsupported public layer.');
  const rows = payload?.results?.bindings;
  if (!Array.isArray(rows) || rows.length > 100) throw new Error('Wikidata returned an invalid facility collection.');
  const seen = new Set();
  return { omitted: 0, markers: rows.map((row) => {
    if (!/^http:\/\/www\.wikidata\.org\/entity\/Q\d+$/.test(row.item?.value ?? '') || !text(row.itemLabel?.value)) {
      throw new Error('Wikidata returned invalid facility metadata.');
    }
    const match = /^Point\((-?[\d.]+) (-?[\d.]+)\)$/.exec(row.location?.value ?? '');
    const coordinates = match?.slice(1).map(Number);
    if (!point(coordinates)) throw new Error('Wikidata returned invalid facility coordinates.');
    return { id: `${id}:${row.item.value}`, title: row.itemLabel.value, coordinates,
      url: row.item.value.replace('http:', 'https:'), observed: null,
      note: 'Community-maintained reference coordinate; source observation date not supplied. Not independently verified. Not live operational status.' };
  }).filter((marker) => {
    if (seen.has(marker.id)) return false;
    seen.add(marker.id);
    return true;
  }) };
}

export async function loadPublicLayer(id, signal) {
  if (id === 'passages') return { omitted: 0, markers: PASSAGES.map(([key, title, coordinates, url]) =>
    ({ id: key, title, coordinates, url, observed: null, note: 'Approximate representative point, not a passage boundary. No current closure or safety information.' })) };
  const layer = PUBLIC_LAYERS.find((item) => item.id === id);
  if (!layer) throw new Error('Unsupported public layer.');
  return parsePublicLayer(id, await fetchCountryJson(layer.url ?? infrastructureUrl(id), signal));
}
