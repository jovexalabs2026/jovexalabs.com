import { useEffect, useRef, useState } from 'react';
import { COUNTRY_INDICATORS, fetchCountryJson, indicatorUrl, leadershipUrl,
  parseIndicator, parseLeadership } from '../lib/country-data.js';

export default function CountryDetails({ country }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!cooldown) return;
    const timeout = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  async function load() {
    if (loading || cooldown || !country.iso3) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setCooldown(60);
    const timeoutError = new Error('Data request timed out after 20 seconds.');
    const timeout = setTimeout(() => controller.abort(timeoutError), 20_000);
    const tasks = [
      ...COUNTRY_INDICATORS.map((indicator) => ({ key: indicator.id, url: indicatorUrl(country.iso3, indicator.id),
        parse: (payload) => parseIndicator(payload, country.iso3, indicator.id) })),
      { key: 'leaders', url: leadershipUrl(country.iso3), parse: parseLeadership },
    ];
    const settled = await Promise.allSettled(tasks.map(async (task) =>
      task.parse(await fetchCountryJson(task.url, controller.signal))));
    clearTimeout(timeout);
    if (controller.signal.aborted && controller.signal.reason !== timeoutError) return;
    setResults(Object.fromEntries(settled.map((result, index) => [tasks[index].key,
      result.status === 'fulfilled' ? { data: result.value } :
        { error: result.reason instanceof Error ? result.reason.message : 'Public data could not be loaded.' }])));
    setFetchedAt(new Date().toISOString());
    setLoading(false);
    request.current = null;
  }

  return <section className="atlas-country-details" aria-label="Country public data">
    <h3>Public country indicators</h3>
    <p>Natural Earth reference geometry; disputed areas, names and boundaries reflect that dataset,
      not a Jovexa territorial position. This is not an authoritative legal border map.</p>
    <p>Load contacts World Bank and Wikidata directly. Those services receive your IP address.
      No location, credentials or private business data is sent.</p>
    {!country.iso3 ? <p>No ISO association is available for this geographic feature. Public indicators are unavailable.</p> :
      <button type="button" disabled={loading || cooldown > 0} onClick={load}>
        {loading ? 'Loading public country data...' : cooldown > 0 ? `Country refresh available in ${cooldown}s` :
          fetchedAt ? 'Refresh country data' : 'Load country data'}</button>}
    {loading && <p role="status">Loading independent public sources...</p>}
    {fetchedAt && <p>Last retrieval attempt: <time dateTime={fetchedAt}>{new Date(fetchedAt).toUTCString()}</time>.
      Live requests, not real-time measurements. Figures can be revised.</p>}
    {COUNTRY_INDICATORS.map((indicator) => {
      const result = results[indicator.id];
      return <section className="atlas-country-stat" key={indicator.id}><h4>{indicator.label}</h4>
        {!result ? <p>Not loaded</p> : result.error ? <p role="alert">{result.error}</p> :
          result.data.unavailable ? <p>No published observation is available for this country.</p> :
            <><p className="atlas-stat-value">{new Intl.NumberFormat('en-US', indicator.currency ?
              { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } :
              { maximumFractionDigits: 0 }).format(result.data.value)}</p>
              <p>Reference year: <strong>{result.data.year}</strong>. Provider update: {result.data.updated}.
                Annual indicator, not a live counter. Display rounded; source data not otherwise altered.</p></>}
        <a href={`https://data.worldbank.org/indicator/${indicator.id}${country.iso3 ? `?locations=${country.iso3}` : ''}`}
          target="_blank" rel="noopener noreferrer">World Bank / indicator definition and source</a>
      </section>;
    })}
    <section className="atlas-country-stat"><h4>Reported current leadership</h4>
      <p>Wikidata statements without a past end date; community-maintained, potentially incomplete,
        disputed or outdated. Not independently verified. Confirm against official government sources.</p>
      {!results.leaders ? <p>Not loaded</p> : results.leaders.error ? <p role="alert">{results.leaders.error}</p> :
        !results.leaders.data.length ? <p>No matching leadership statements returned.</p> :
          results.leaders.data.map((leader, index) => <article key={`${leader.personUrl}:${leader.role}:${index}`}>
            <strong>{leader.role}</strong><p><a href={leader.personUrl} target="_blank" rel="noopener noreferrer">{leader.name}</a></p>
            <p>Statement start: {leader.start ? leader.start.slice(0, 10) : 'Not supplied'}</p>
            <a href={leader.countryUrl} target="_blank" rel="noopener noreferrer">Inspect country statements and references</a>
          </article>)}
    </section>
    <p>World Bank Open Data: <a href="https://datacatalog.worldbank.org/public-licenses" target="_blank" rel="noopener noreferrer">
      CC BY 4.0 / dataset terms</a>. Wikidata structured data:
      <a href="https://www.wikidata.org/wiki/Wikidata:Licensing" target="_blank" rel="noopener noreferrer"> CC0</a>.
      Not investment advice, business verification, or confirmation that services are open.</p>
  </section>;
}
