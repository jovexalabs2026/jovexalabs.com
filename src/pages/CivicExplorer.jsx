import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { CIVIC_LAYERS, CIVIC_REGIONS, CIVIC_MISSIONS, projectCoordinate,
  filterRegions, mapViewport } from '../data/civic-explorer.js';
import { CIVIC_FLAGS } from '../data/civic-flags.js';
import { createCivicMap, normalizeGlobeCenter } from '../lib/civic-map.js';
import './civic-explorer.css';

export default function CivicExplorer() {
  const [panel, setPanel] = useState('regions');
  const [panelOpen, setPanelOpen] = useState(true);
  const [dossierOpen, setDossierOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [layers, setLayers] = useState(CIVIC_LAYERS.map((layer) => layer.id));
  const [selected, setSelected] = useState('ph');
  const [tab, setTab] = useState('overview');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([450, 225]);
  const [mode, setMode] = useState('map');
  const [globeCenter, setGlobeCenter] = useState([120, 15]);
  const drag = useRef(null);
  const [theme, setTheme] = useState('night');
  const [revealed, setRevealed] = useState([]);
  const region = CIVIC_REGIONS.find((item) => item.id === selected);
  const visible = useMemo(() => filterRegions(query, layers), [query, layers]);
  const map = useMemo(() => createCivicMap(mode, globeCenter), [mode, globeCenter]);
  const flatViewport = mapViewport(zoom, mode === 'globe' ? [450, 225] : center);
  const viewport = mode === 'globe'
    ? [flatViewport[0] + flatViewport[2] / 4, flatViewport[1], flatViewport[2] / 2, flatViewport[3]]
    : flatViewport;
  const selectedVisible = visible.some((item) => item.id === selected);

  function choose(id) {
    const next = CIVIC_REGIONS.find((item) => item.id === id);
    setSelected(id);
    setDossierOpen(true);
    setTab('overview');
    setCenter(projectCoordinate(next.coordinates));
    setGlobeCenter(normalizeGlobeCenter(next.coordinates));
    setZoom(mode === 'globe' ? 1 : 2);
  }

  function pan(dx, dy) {
    if (mode === 'globe') {
      setGlobeCenter(([longitude, latitude]) => normalizeGlobeCenter([
        longitude + dx * 20 / zoom, latitude - dy * 20 / zoom,
      ]));
      return;
    }
    setCenter([viewport[0] + viewport[2] / 2 + dx * viewport[2] / 5,
      viewport[1] + viewport[3] / 2 + dy * viewport[3] / 5]);
  }

  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('[role="button"]')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY,
      scale: Math.min(bounds.width / viewport[2], bounds.height / viewport[3]),
      viewport, globeCenter, mode };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = (event.clientX - start.x) / start.scale;
    const dy = (event.clientY - start.y) / start.scale;
    if (start.mode === 'globe') {
      setGlobeCenter(normalizeGlobeCenter([start.globeCenter[0] - dx * .3,
        start.globeCenter[1] + dy * .3]));
    } else {
      setCenter([start.viewport[0] + start.viewport[2] / 2 - dx,
        start.viewport[1] + start.viewport[3] / 2 - dy]);
    }
  }

  function resetView() {
    setZoom(1);
    setCenter([450, 225]);
    setGlobeCenter([120, 15]);
  }

  return <>
    <Seo title="Jovexa Atlas: civic explorer prototype" description="An original worldwide civic map prototype with sample region dossiers, civilian layers and learning activities. Not live intelligence." path="/prototype/explorer" />
    <main className={`atlas atlas--${theme} ${panelOpen ? '' : 'atlas--panel-closed'} ${dossierOpen ? '' : 'atlas--dossier-closed'}`}>
      <a className="atlas-skip" href="#atlas-map">Skip to map</a>
      <header className="atlas-heading">
        <div><p className="eyebrow">Jovexa / civic observation workspace</p><h1>Atlas Civic Explorer</h1></div>
        <div className="atlas-header-links"><Link to="/">Jovexa home</Link>
          <Link to="/prototype/community">Orbit demo</Link></div>
      </header>
      <p className="atlas-disclosure"><strong>ILLUSTRATIVE PROTOTYPE — NOT LIVE DATA.</strong> Pins represent
        selected capitals, not active projects, incidents, people, or verified services. No military
        tracking, location collection, news ingestion, navigation, or financial rewards.</p>
      <div className="atlas-workspace">
        <aside className="atlas-sidebar" aria-label="Explorer tools and results">
          <nav aria-label="Explorer tools">
            {[['regions', 'Regions', 'R'], ['layers', 'Layers', 'L'], ['feed', 'Sample feed', 'F'], ['about', 'Sources', 'i']].map(([id, title, icon]) =>
              <button type="button" key={id} aria-current={panel === id ? 'page' : undefined}
                aria-expanded={panel === id && panelOpen} aria-controls="atlas-tool-panel"
                onClick={() => { setPanel(id); setPanelOpen(panel !== id || !panelOpen); }}>
                <span className="atlas-tool-icon" aria-hidden="true">{icon}</span>{title}</button>)}
          </nav>
          <div id="atlas-tool-panel" hidden={!panelOpen} className="atlas-tool-panel">
          <button className="atlas-panel-close" type="button" aria-label="Close tools panel"
            onClick={() => setPanelOpen(false)}>Close</button>
          {panel === 'regions' && <section>
            <h2>Explore regions</h2><label htmlFor="atlas-search">Search country, capital, or continent</label>
            <input id="atlas-search" type="search" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} />
            <p role="status">{visible.length} of {CIVIC_REGIONS.length} sample regions shown</p>
            <div className="atlas-region-list">{visible.map((item) => <button type="button" key={item.id}
              aria-pressed={selected === item.id} onClick={() => choose(item.id)}>
              <strong><img className="atlas-flag" src={CIVIC_FLAGS[item.id]} alt="" />{item.name}</strong>
              <span>{item.city} / {item.continent}</span></button>)}</div>
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
              <a href="/atlas-licenses.txt"> Mapping and flag license notices</a>.</p>
            <p>National flag SVGs are from the MIT-licensed flag-icons project, served locally.
              Flags identify the example country, not a government endorsement.</p>
            <p>2D uses an equirectangular projection; high-latitude shapes are distorted.
              The 3D globe uses an interactive orthographic spherical projection rendered in SVG,
              not satellite imagery or a terrain model. No borders, territorial positions,
              exact service locations, or routes are supplied.</p>
            <p>Capital coordinates are approximate reference points. Only {CIVIC_REGIONS.length} curated
              sample regions are interactive; worldwide land coverage does not imply a complete directory.</p>
            <p>Official homepage links are starting points, not integrations, endorsements, or
              availability guarantees. Confirm information independently.</p>
            <p>No map tiles, trackers, location permission, private APIs, accounts, or server storage.
              Search, filters, and mission answers stay in page memory and reset on reload.</p>
          </section>}
          </div>
        </aside>
        <section className="atlas-map-pane" aria-label="Worldwide civic map">
          <div className="atlas-map-toolbar">
            <div role="group" aria-label="Map view mode" className="atlas-view-modes">
              <button type="button" aria-pressed={mode === 'map'} onClick={() => { setMode('map'); setZoom(1); }}>2D map</button>
              <button type="button" aria-pressed={mode === 'globe'} onClick={() => { setMode('globe'); setZoom(1); }}>3D globe</button>
            </div>
            <span>{mode === 'globe' ? 'GLOBE' : 'WORLD'} VIEW / {zoom.toFixed(1)}x</span>
            <button type="button" onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}>
              {theme === 'night' ? 'Switch to day map' : 'Switch to night map'}</button>
          </div>
          <p className="atlas-map-hint" id="atlas-map-help">
            {mode === 'globe' ? 'Drag to rotate the globe.' : 'Zoom in, then drag to pan the map.'}
            {' '}Use arrow keys on the map or the direction buttons. Choose any region from the list.
          </p>
          <svg id="atlas-map" className={`atlas-map atlas-map--${mode}`} viewBox={viewport.join(' ')} role="group" tabIndex={0}
            aria-describedby="atlas-map-help" aria-label="Illustrative world map with selectable capital markers"
            onPointerDown={startDrag} onPointerMove={moveDrag}
            onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
            onLostPointerCapture={() => { drag.current = null; }}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
              if (directions[event.key]) { event.preventDefault(); pan(...directions[event.key]); }
            }}>
            <defs><radialGradient id="atlas-globe-shade" cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".10" />
              <stop offset=".65" stopColor="#000000" stopOpacity="0" />
              <stop offset="1" stopColor="#000000" stopOpacity=".5" />
            </radialGradient></defs>
            <path d={map.spherePath} className="atlas-ocean" />
            <path d={map.gridPath} fill="none" className="atlas-grid-line" strokeWidth=".5" />
            <path d={map.landPath} className="atlas-land" fillRule="evenodd" />
            {mode === 'globe' && <path d={map.spherePath} fill="url(#atlas-globe-shade)" pointerEvents="none" />}
            {visible.filter((item) => map.isVisible(item.coordinates)).map((item) => {
              const [x, y] = map.project(item.coordinates);
              const color = CIVIC_LAYERS.find((layer) => layer.id === item.layer).color;
              return <g key={item.id} role="button" tabIndex={0} aria-label={`Explore ${item.name}`}
                aria-pressed={selected === item.id} className={`atlas-pin ${selected === item.id ? 'atlas-pin--selected' : ''}`}
                onClick={() => choose(item.id)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(item.id); }
                }}>
                <title>{item.name} / sample reference marker</title>
                <rect x={x - 12} y={y - 20} width="30" height="32" fill="transparent" />
                <circle cx={x} cy={y} r={selected === item.id ? 6 : 4} fill={color} stroke="#102333" strokeWidth="1.5" />
                <image href={CIVIC_FLAGS[item.id]} x={x - 10} y={y - 20} width="20" height="15" aria-hidden="true" />
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
            <button onClick={resetView}>Reset view</button>
          </div>
          <div className="atlas-legend" aria-label="Map legend">{CIVIC_LAYERS.map((layer) =>
            <span key={layer.id}>{layer.name}</span>)}</div>
          <p className="atlas-map-caption">Natural Earth / approximate reference geography / not for navigation</p>
        </section>
        {!dossierOpen && <button type="button" className="atlas-reopen-dossier" onClick={() => setDossierOpen(true)}>
          Open {region.name} dossier</button>}
        <aside className="atlas-dossier" aria-label="Region dossier" hidden={!dossierOpen}>
          <button className="atlas-panel-close" type="button" aria-label="Close region dossier"
            onClick={() => setDossierOpen(false)}>Close</button>
          <p className="eyebrow">Sample region dossier</p><h2 aria-label={region.name}>
            <img className="atlas-flag atlas-flag--large" src={CIVIC_FLAGS[region.id]} alt={`Flag of ${region.name}`} />
            {region.name}</h2>
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
    </main>
  </>;
}
