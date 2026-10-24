export const COUNTRY_INDICATORS = [
  { id: 'NY.GDP.MKTP.CD', label: 'GDP (current US$)', currency: true },
  { id: 'SP.POP.TOTL', label: 'Population', currency: false },
];

export function indicatorUrl(iso3, indicator) {
  if (!/^[A-Z]{3}$/.test(iso3) || !COUNTRY_INDICATORS.some((item) => item.id === indicator)) {
    throw new Error('Unsupported country or indicator.');
  }
  return `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&per_page=5&mrnev=1`;
}

export function parseIndicator(payload, iso3, indicator) {
  if (Array.isArray(payload) && payload.length === 2 && payload[1] === null &&
    Number(payload[0]?.total) === 0) return { unavailable: true };
  if (!Array.isArray(payload) || !Array.isArray(payload[1])) throw new Error('World Bank returned an unreadable indicator response.');
  const rows = payload[1];
  if (!rows.length) return { unavailable: true };
  if (rows.some((item) => item.countryiso3code !== iso3 || item.indicator?.id !== indicator)) {
    throw new Error('World Bank response does not match the selected country and indicator.');
  }
  const valid = rows.filter((item) => item.value !== null);
  if (!valid.length) return { unavailable: true };
  if (valid.some((item) => typeof item.value !== 'number' || !Number.isFinite(item.value) ||
    item.value < 0 || !/^\d{4}$/.test(item.date))) throw new Error('World Bank returned invalid indicator values.');
  const newest = valid.sort((a, b) => Number(b.date) - Number(a.date))[0];
  return { value: newest.value, year: newest.date, updated: payload[0]?.lastupdated ?? 'Not supplied',
    country: newest.country?.value ?? iso3 };
}

export function leadershipUrl(iso3) {
  if (!/^[A-Z]{3}$/.test(iso3)) throw new Error('Unsupported country identifier.');
  const query = `SELECT DISTINCT ?country ?person ?personLabel ?role ?start WHERE {
    ?country wdt:P298 "${iso3}" .
    VALUES (?property ?value ?role) { (p:P35 ps:P35 "Head of state") (p:P6 ps:P6 "Head of government") }
    ?country ?property ?statement . ?statement ?value ?person .
    FILTER NOT EXISTS { ?statement wikibase:rank wikibase:DeprecatedRank }
    FILTER NOT EXISTS { ?statement pq:P582 ?end . FILTER(?end <= NOW()) }
    OPTIONAL { ?statement pq:P580 ?start }
    FILTER(!BOUND(?start) || ?start <= NOW())
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  } LIMIT 20`;
  return `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
}

export function parseLeadership(payload) {
  const rows = payload?.results?.bindings;
  if (!Array.isArray(rows)) throw new Error('Wikidata returned an unreadable leadership response.');
  return rows.map((row) => {
    if (!/^http:\/\/www\.wikidata\.org\/entity\/Q\d+$/.test(row.person?.value ?? '') ||
      !/^http:\/\/www\.wikidata\.org\/entity\/Q\d+$/.test(row.country?.value ?? '') ||
      !['Head of state', 'Head of government'].includes(row.role?.value) ||
      !row.personLabel?.value || row.personLabel.value.length > 200) {
      throw new Error('Wikidata returned invalid leadership metadata.');
    }
    return { name: row.personLabel.value, role: row.role.value, start: row.start?.value ?? null,
      personUrl: row.person.value.replace('http:', 'https:'),
      countryUrl: row.country.value.replace('http:', 'https:') };
  });
}

export async function fetchCountryJson(url, signal) {
  const response = await fetch(url, { signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!response.ok) throw new Error(`Public-data request failed (HTTP ${response.status}).`);
  if (!response.body) throw new Error('The data provider returned an empty response.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1_048_576) {
        await reader.cancel();
        throw new Error('The public-data response exceeds the 1 MiB limit.');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  return JSON.parse(text);
}
