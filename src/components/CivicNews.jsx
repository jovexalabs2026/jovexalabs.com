import { useEffect, useRef, useState } from 'react';
import { fetchNewsFeed, readingRemaining } from '../lib/civic-news.js';

export default function CivicNews({ active }) {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fetchedAt, setFetchedAt] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [activity, setActivity] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const controller = useRef(null);
  const nextRefresh = useRef(0);

  useEffect(() => () => controller.current?.abort(), []);

  useEffect(() => {
    if (!active && !activity) return;
    const update = () => {
      const now = performance.now();
      setCooldown(Math.max(0, Math.ceil((nextRefresh.current - now) / 1000)));
      if (activity) setRemaining(readingRemaining(activity.startedAt, now));
    };
    update();
    const timer = setInterval(update, 250);
    return () => clearInterval(timer);
  }, [active, activity]);

  async function load() {
    if (controller.current || performance.now() < nextRefresh.current) return;
    const request = new AbortController();
    controller.current = request;
    setStatus('loading');
    setError('');
    nextRefresh.current = performance.now() + 60_000;
    setCooldown(60);
    const timeout = setTimeout(() => request.abort(new Error('Feed request timed out after 12 seconds.')), 12_000);
    try {
      const items = await fetchNewsFeed(request.signal);
      setArticles(items);
      setFetchedAt(new Date().toISOString());
      setStatus('ready');
    } catch (failure) {
      if (!request.signal.aborted || request.signal.reason?.message?.includes('timed out')) {
        setError(failure instanceof Error ? failure.message : 'Unable to load the publisher feed.');
        setStatus('error');
      }
    } finally {
      clearTimeout(timeout);
      controller.current = null;
    }
  }

  function start(item) {
    if (activity || completed.includes(item.id)) return;
    setActivity({ ...item, startedAt: performance.now() });
    setRemaining(30_000);
    setConfirmed(false);
  }

  function finish() {
    if (!activity || !confirmed || readingRemaining(activity.startedAt, performance.now()) > 0 ||
      completed.includes(activity.id)) return;
    setCompleted([...completed, activity.id]);
    setActivity(null);
    setConfirmed(false);
  }

  const shown = articles.filter((item) =>
    item.title.toLocaleLowerCase('en-US').includes(search.trim().toLocaleLowerCase('en-US')) &&
    (filter === 'all' || completed.includes(item.id)));
  const stale = fetchedAt && (Date.now() - Date.parse(fetchedAt) > 15 * 60_000 ||
    articles.length > 0 && Date.now() - Date.parse(articles[0].publishedAt) > 7 * 86_400_000);

  return <section className="atlas-news" aria-label="Live science news">
    <div className="atlas-news-heading"><div><p className="eyebrow">Publisher feed / science</p>
      <h2>News & reading activities</h2></div><span className="atlas-feed-badge">NASA RSS</span></div>
    <p>Headlines from NASA's official RSS feed, not country-specific intelligence.
      Full articles stay on the publisher's website. No endorsement or partnership.</p>
    <p className="atlas-news-privacy">Loading contacts www.nasa.gov directly; NASA receives your IP address.
      No account, location, or private data is sent. Requests omit credentials and referrer.</p>
    <button type="button" onClick={load} disabled={status === 'loading' || cooldown > 0}>
      {status === 'idle' ? 'Load live headlines' : status === 'loading' ? 'Loading publisher feed...' :
        cooldown > 0 ? `Refresh available in ${cooldown}s` : 'Refresh headlines'}</button>
    {status === 'loading' && <p role="status">Fetching the official publisher feed...</p>}
    {error && <p role="alert" className="atlas-news-error">Live feed unavailable: {error}
      {' '}No sample stories have been substituted.{articles.length > 0 && ' Previously fetched headlines below may be outdated.'}</p>}
    {fetchedAt && <p className="atlas-feed-time">Fetched <time dateTime={fetchedAt}>{new Date(fetchedAt).toUTCString()}</time>.
      {' '}Publisher/CDN caching may delay updates. Refresh is manual (one request per minute per page).</p>}
    {stale && <p className="atlas-news-error">Feed may be stale: refresh and check publication dates at the source.</p>}
    {articles.length > 0 && <>
      <div className="atlas-news-filters">
        <label>Search headlines<input type="search" maxLength={120} value={search}
          onChange={(event) => setSearch(event.target.value)} /></label>
        <div role="group" aria-label="Reading activity filter">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
          <button type="button" aria-pressed={filter === 'completed'} onClick={() => setFilter('completed')}>
            Completed ({completed.length})</button></div>
      </div>
      <p role="status">{shown.length} headlines shown</p>
    </>}
    <p className="atlas-reading-rules">Reading rules: one activity at a time; open the original source, wait 30 seconds,
      then confirm yourself. We cannot verify that a tab opened or that you read the article.
      No tokens, points, money, or proof of learning. Completion is kept only in this page's memory and resets on reload.</p>
    {activity && <section className="atlas-reading" aria-label="Active reading activity">
      <h3>{activity.title}</h3>
      <p>Time remaining: <strong data-testid="reading-countdown">{Math.ceil(remaining / 1000)}s</strong></p>
      <label><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
        I opened the source and completed this activity (self-reported).</label>
      <div><button type="button" disabled={remaining > 0 || !confirmed} onClick={finish}>Mark complete</button>
        <button type="button" onClick={() => { setActivity(null); setConfirmed(false); }}>Cancel activity</button></div>
    </section>}
    {completed.length > 0 && <p role="status">{completed.length} self-reported activities completed this page session.</p>}
    <div className="atlas-news-grid">{shown.map((item, index) => <article className="atlas-news-card" key={item.id}>
      <div className={`atlas-news-art atlas-news-art--${index % 3}`} aria-hidden="true">
        <span>JOVEXA / SOURCE READER</span><span className="atlas-news-orbit" /></div>
      <div className="atlas-news-card-body"><small>{item.publisher} / <time dateTime={item.publishedAt}>
        {new Date(item.publishedAt).toUTCString()}</time></small><h3>{item.title}</h3>
        {completed.includes(item.id) ? <p className="atlas-reading-done">Completed (self-reported)</p> :
          activity ? <a href={item.url} target="_blank" rel="noopener noreferrer">Read original at NASA (new tab)</a> :
            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => start(item)}>
              Open source & start 30s activity</a>}
      </div>
    </article>)}</div>
    {articles.length > 0 && !shown.length && <p>No headlines match this filter.</p>}
    <p><a href="https://www.nasa.gov/feed/" target="_blank" rel="noopener noreferrer">Official RSS source</a>
      {' / '}<a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener noreferrer">
        Publisher usage guidance</a>. Only headline metadata is displayed; no article bodies or third-party images are republished.</p>
  </section>;
}
