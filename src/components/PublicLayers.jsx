import { useEffect, useState } from 'react';
import { PUBLIC_LAYERS, UNAVAILABLE_LAYERS, loadPublicLayer } from '../lib/public-layers.js';

function LayerControl({ layer, onChange }) {
  const [enabled, setEnabled] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const selected = result?.markers.find((marker) => marker.id === selectedId);
  useEffect(() => {
    onChange((current) => ({ ...current, [layer.id]: enabled && result ? result.markers.map((marker) =>
      ({ ...marker, stale: Boolean(error), retrieved: result.retrieved })) : [] }));
  }, [enabled, result, error, layer.id, onChange]);
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let controller;
    let nextRefresh = 0;
    let refreshTimer;
    function schedule() {
      clearTimeout(refreshTimer);
      if (!disposed && layer.id !== 'passages' && document.visibilityState === 'visible') {
        refreshTimer = setTimeout(() => { void refresh(); }, Math.max(0, nextRefresh - performance.now()));
      }
    }
    async function refresh() {
      if (disposed || document.visibilityState !== 'visible' || controller) return;
      if (performance.now() < nextRefresh) { schedule(); return; }
      nextRefresh = performance.now() + 300_000;
      const active = new AbortController();
      controller = active;
      setLoading(true);
      const timeout = setTimeout(() => active.abort(new Error('Layer request timed out after 20 seconds.')), 20_000);
      try {
        const data = await loadPublicLayer(layer.id, active.signal);
        if (!disposed) { setResult({ ...data, retrieved: new Date().toISOString() }); setError(''); }
      } catch (reason) {
        if (!disposed) setError(reason instanceof Error ? reason.message : 'Public layer could not be loaded.');
      } finally {
        clearTimeout(timeout);
        controller = null;
        if (!disposed) setLoading(false);
        schedule();
      }
    }
    void refresh();
    const visible = () => {
      if (document.visibilityState !== 'visible') {
        clearTimeout(refreshTimer);
        controller?.abort(new Error('Refresh interrupted because the page is hidden.'));
      } else { void refresh(); }
    };
    document.addEventListener('visibilitychange', visible);
    return () => {
      disposed = true;
      controller?.abort();
      clearTimeout(refreshTimer);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [enabled, layer.id]);
  return <article className="atlas-public-layer">
    <h3><span style={{ color: layer.color }}>{layer.symbol}</span> {layer.name}</h3>
    <p>{layer.description}</p>
    <label><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      {` Load / show ${layer.name}`}</label>
    {enabled && <>
      {loading && <p role="status">Loading {layer.name}...</p>}
      {error && <p role="alert">{error} {result ? 'Retained observations are stale; not current.' : 'No observations loaded.'}</p>}
      {result && <><p>{result.markers.length} markers; {result.omitted} unsupported/empty geometries omitted.
        Last successful retrieval: <time dateTime={result.retrieved}>{new Date(result.retrieved).toUTCString()}</time>.
        {result.published && <> Provider generated: {new Date(result.published).toUTCString()}.</>}</p>
        {result.markers.length === 0 && <p>No matching point records returned. This is not proof that no hazards or facilities exist.</p>}
        <div className="atlas-layer-results">{result.markers.map((marker) =>
          <button type="button" key={marker.id} aria-pressed={selected?.id === marker.id}
            onClick={() => setSelectedId(marker.id)}>{marker.title}</button>)}</div>
        {selected && <section aria-label={`${layer.name} observation`}><h4>{selected.title}</h4>
          <p>{selected.note}</p><p>Observation: {selected.observed ? new Date(selected.observed).toUTCString() : 'Reference data / date not supplied'}.</p>
          {selected.updated && <p>Provider revised: {new Date(selected.updated).toUTCString()}.</p>}
          <a href={selected.url} target="_blank" rel="noopener noreferrer">Inspect original source</a></section>}
      </>}
    </>}
  </article>;
}

export default function PublicLayers({ onChange }) {
  return <section aria-label="Public observation layers">
    <h2>Public observation layers</h2>
    <p>Opt-in requests go directly to USGS, NASA or Wikidata, exposing your IP address but omitting
      credentials and referrer. Requested network layers refresh every 5 minutes only while enabled
      and this page is visible. Closing the tools panel does not hide enabled map layers.
      Disable a layer to stop its requests. No requests occur on initial page load.</p>
    <p>Source reports may be delayed, preliminary or incomplete. Not emergency alerts, navigation,
      surveillance, safety advice or a complete global directory. Reference facilities are not live status.</p>
    {PUBLIC_LAYERS.map((layer) => <LayerControl key={layer.id} layer={layer} onChange={onChange} />)}
    <h3>Not connected</h3>
    {UNAVAILABLE_LAYERS.map(([name, reason]) => <p key={name}><strong>{name}:</strong> {reason}</p>)}
    <p><strong>Territory:</strong> use Reference country boundaries below; Natural Earth reference geography,
      not a legal determination. Map markers and full text details are also available through each layer list.</p>
    <p>Credits: <a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php" target="_blank" rel="noopener noreferrer">
      U.S. Geological Survey earthquake data</a>; <a href="https://eonet.gsfc.nasa.gov/what-is-eonet#disclaimer" target="_blank"
      rel="noopener noreferrer">NASA EONET metadata and limitations</a> (general visualization, approximate extents);
      Wikidata structured data (CC0). <a href="/atlas-licenses.txt">Source and license notices</a>.
      No provider endorsement. No article bodies, third-party imagery or video streams are copied.</p>
  </section>;
}
