import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import world from 'world-atlas/land-110m.json';
import Seo from '../components/Seo.jsx';
import { CIVIC_LAYERS, CIVIC_REGIONS, CIVIC_MISSIONS, projectCoordinate,
  filterRegions, mapViewport } from '../data/civic-explorer.js';
import './civic-explorer.css';

const land = feature(world, world.objects.land);
const projection = geoEquirectangular().scale(900 / (2 * Math.PI)).translate([450, 225]);
const landPath = geoPath(projection)(land);

export default function CivicExplorer() {
  const [panel, setPanel] = useState('regions');
  const [query, setQuery] = useState('');
  const [layers, setLayers] = useState(CIVIC_LAYERS.map((layer) => layer.id));
  const [selected, setSelected] = useState('ph');
  const [tab, setTab] = useState('overview');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([450, 225]);
  const [theme, setTheme] = useState('night');
  const [revealed, setRevealed] = useState([]);
  const region = CIVIC_REGIONS.find((item) => item.id === selected);
  const visible = useMemo(() => filterRegions(query, layers), [query, layers]);
  const viewport = mapViewport(zoom, center);
  const selectedVisible = visible.some((item) => item.id === selected);

  function choose(id) {
    const next = CIVIC_REGIONS.find((item) => item.id === id);
    setSelected(id);
    setTab('overview');
    setCenter(projectCoordinate(next.coordinates));
    setZoom(2);
  }

  function pan(dx, dy) {
    setCenter([viewport[0] + viewport[2] / 2 + dx * viewport[2] / 5,
      viewport[1] + viewport[3] / 2 + dy * viewport[3] / 5]);
  }

  return <>
    <Seo title="Jovexa Atlas: civic explorer prototype" description="An original worldwide civic map prototype with sample region dossiers, civilian layers and learning activities. Not live intelligence." path="/prototype/explorer" />
    <div className={`atlas atlas--${theme}`}>
      <header className="atlas-heading">
        <div><p className="eyebrow">Jovexa concept lab / worldwide</p><h1>Atlas Civic Explorer</h1></div>
        <Link to="/prototype/community">Open Orbit demo</Link>
      </header>
      <p className="atlas-disclosure"><strong>ILLUSTRATIVE PROTOTYPE — NOT LIVE DATA.</strong> Pins represent
        selected capitals, not active projects, incidents, people, or verified services. No military
        tracking, location collection, news ingestion, navigation, or financial rewards.</p>
      <div className="atlas-workspace">
        <aside className="atlas-sidebar">
          <nav aria-label="Explorer tools">
            {[['regions', 'Regions'], ['layers', 'Layers'], ['feed', 'Sample feed'], ['about', 'Sources']].map(([id, title]) =>
              <button type="button" key={id} aria-current={panel === id ? 'page' : undefined}
                onClick={() => setPanel(id)}>{title}</button>)}
          </nav>
          {panel === 'regions' && <section>
            <h2>Explore regions</h2><label htmlFor="atlas-search">Search country, capital, or continent</label>
            <input id="atlas-search" type="search" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} />
            <p role="status">{visible.length} of {CIVIC_REGIONS.length} sample regions shown</p>
            <div className="atlas-region-list">{visible.map((item) => <button type="button" key={item.id}
              aria-pressed={selected === item.id} onClick={() => choose(item.id)}>
              <strong>{item.name}</strong><span>{item.city} / {item.continent}</span></button>)}</div>
            {!visible.length && <p>No matching regions. Clear the search or enable more layers.</p>}
          </section>}
          {panel === 'layers' && <section>
            <h2>Civilian layers</h2><p>Categories demonstrate filtering; they do not represent actual local activity.</p>
            {CIVIC_LAYERS.map((layer) => <label className="atlas-layer" key={layer.id}>
              <input type="checkbox" checked={layers.includes(layer.id)} onChange={(event) =>
                setLayers(event.target.checked ? [...layers, layer.id] : layers.filter((id) => id !== layer.id))} />
              <span>{layer.name}</span></label>)}
            <p>{visible.length} sample pins visible</p>
          </section>}
          {panel === 'feed' && <section>
            <h2>Sample editorial feed</h2><p>These are original example prompts, not reported news, live events, or third-party articles.</p>
            {CIVIC_REGIONS.slice(0, 4).map((item) => <article className="atlas-feed" key={item.id}>
              <small>SAMPLE / NO EVENT DATE</small><h3>{item.name}: {item.focus}</h3>
              <p>Explore how a civic-learning resource could help residents find trustworthy information.</p>
              <button type="button" onClick={() => choose(item.id)}>Open {item.name} dossier</button>
            </article>)}
          </section>}
          {panel === 'about' && <section>
            <h2>Sources and limits</h2>
            <p>Land geometry: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener noreferrer">Natural Earth public-domain data</a>,
              distributed by <a href="https://github.com/topojson/world-atlas" target="_blank" rel="noopener noreferrer">World Atlas (ISC)</a>.
              Decoded with topojson-client and projected with d3-geo (ISC).
              <a href="/atlas-licenses.txt"> Mapping license notices</a>.</p>
            <p>Flat equirectangular projection. High-latitude shapes are distorted. No borders,
              territorial positions, exact service locations, routes, satellite imagery, or 3D rendering are supplied.</p>
            <p>Capital coordinates are approximate reference points. Only {CIVIC_REGIONS.length} curated
              sample regions are interactive; worldwide land coverage does not imply a complete directory.</p>
            <p>Official homepage links are starting points, not integrations, endorsements, or
              availability guarantees. Confirm information independently.</p>
            <p>No map tiles, trackers, location permission, private APIs, accounts, or server storage.
              Search, filters, and mission answers stay in page memory and reset on reload.</p>
          </section>}
        </aside>
        <section className="atlas-map-pane" aria-label="Worldwide civic map">
          <div className="atlas-map-toolbar">
            <span>WORLD VIEW / {zoom.toFixed(1)}x</span>
            <button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}>
              {theme === 'night' ? 'Switch to day map' : 'Switch to night map'}</button>
          </div>
          <svg className="atlas-map" viewBox={viewport.join(' ')} role="group" aria-label="Illustrative world map with selectable capital markers">
            <defs><pattern id="atlas-grid" width="75" height="75" patternUnits="userSpaceOnUse">
              <path d="M75 0H0V75" fill="none" className="atlas-grid-line" strokeWidth=".5" /></pattern></defs>
            <rect x="0" y="0" width="900" height="450" className="atlas-ocean" />
            <rect x="0" y="0" width="900" height="450" fill="url(#atlas-grid)" />
            <path d={landPath} className="atlas-land" fillRule="evenodd" />
            {visible.map((item) => {
              const [x, y] = projectCoordinate(item.coordinates);
              const color = CIVIC_LAYERS.find((layer) => layer.id === item.layer).color;
              return <g key={item.id} role="button" tabIndex={0} aria-label={`Explore ${item.name}`}
                aria-pressed={selected === item.id} className={`atlas-pin ${selected === item.id ? 'atlas-pin--selected' : ''}`}
                onClick={() => choose(item.id)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(item.id); }
                }}>
                <title>{item.name} / sample reference marker</title>
                <circle cx={x} cy={y} r="10" fill="transparent" />
                <circle cx={x} cy={y} r={selected === item.id ? 6 : 4} fill={color} stroke="#102333" strokeWidth="1.5" />
              </g>;
            })}
          </svg>
          <div className="atlas-map-controls" aria-label="Map controls">
            <button aria-label="Zoom in" disabled={zoom >= 4} onClick={() => setZoom(Math.min(4, zoom + .5))}>+</button>
            <button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - .5))}>−</button>
            <button aria-label="Pan west" onClick={() => pan(-1, 0)}>W</button>
            <button aria-label="Pan north" onClick={() => pan(0, -1)}>N</button>
            <button aria-label="Pan south" onClick={() => pan(0, 1)}>S</button>
            <button aria-label="Pan east" onClick={() => pan(1, 0)}>E</button>
            <button onClick={() => { setZoom(1); setCenter([450, 225]); }}>Reset view</button>
          </div>
          <div className="atlas-legend" aria-label="Map legend">{CIVIC_LAYERS.map((layer) =>
            <span key={layer.id}>{layer.name}</span>)}</div>
          <p className="atlas-map-caption">Natural Earth / approximate reference geography / not for navigation</p>
        </section>
        <aside className="atlas-dossier" aria-label="Region dossier">
          <p className="eyebrow">Sample region dossier</p><h2>{region.name}</h2>
          <p>{region.city} / {region.continent}</p>
          {!selectedVisible && <p className="atlas-filter-note">Selected dossier is outside the current map/search filter.</p>}
          <div className="atlas-dossier-nav" role="group" aria-label="Dossier sections">
            {['overview', 'resources', 'missions'].map((id) => <button key={id} type="button"
              aria-pressed={tab === id} onClick={() => setTab(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}
          </div>
          {tab === 'overview' && <section><h3>Civic learning focus</h3><p>{region.focus}</p>
            <p>This example is a design prompt, not a report of an operating Jovexa project in {region.name}.</p>
            <dl><dt>Reference capital</dt><dd>{region.city}</dd><dt>Dataset coverage</dt><dd>Curated example</dd>
              <dt>Live status</dt><dd>Not connected</dd><dt>Verified local services</dt><dd>Not assessed</dd></dl>
          </section>}
          {tab === 'resources' && <section><h3>Start at an official source</h3>
            <a href={region.url} target="_blank" rel="noopener noreferrer">Visit official {region.name} homepage (new tab)</a>
            <p>No login details are collected here. Check current requirements and destination authenticity independently.</p>
            <h3>Practice digital skills</h3><Link to="/learn">Browse Jovexa Learn</Link>
            <p><Link to="/digital2030/cybersecurity">Review online-safety guidance</Link></p>
          </section>}
          {tab === 'missions' && <section><h3>Learning missions</h3>
            <p>No timer payout, token, or account credit. Reveal an example answer after thinking about each prompt.</p>
            {CIVIC_MISSIONS.map((mission) => {
              const id = `${region.id}:${mission.id}`;
              const open = revealed.includes(id);
              return <article className="atlas-mission" key={id}><h4>{mission.title}</h4><p>{mission.text}</p>
                <button type="button" aria-expanded={open} onClick={() => setRevealed(open ?
                  revealed.filter((item) => item !== id) : [...revealed, id])}>{open ? 'Hide example answer' : 'Reveal example answer'}</button>
                {open && <p className="atlas-answer">{mission.answer}</p>}
              </article>;
            })}
          </section>}
        </aside>
      </div>
    </div>
  </>;
}
