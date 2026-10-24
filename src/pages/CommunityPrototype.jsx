import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { DEMO_STORAGE_KEY, DEMO_TASKS, SESSION_MS, SESSION_POINTS,
  emptyDemo, parseDemo, demoBalance, sessionRemaining, claimedToday, updateDemo } from '../lib/community-demo.js';
import './community-prototype.css';

function readSavedDemo() {
  try { return { data: parseDemo(localStorage.getItem(DEMO_STORAGE_KEY)), error: '' }; }
  catch (error) { return { data: null, error: `Could not read local demo data: ${error.message}` }; }
}

const views = [['dashboard', 'Overview'], ['tasks', 'Daily activities'], ['invite', 'Invite preview'], ['about', 'How it works']];

export default function CommunityPrototype() {
  const [saved, setSaved] = useState(readSavedDemo);
  const [view, setView] = useState('dashboard');
  const [now, setNow] = useState(Date.now);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState({});
  const [resetting, setResetting] = useState(false);
  const { data } = saved;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const sync = (event) => {
      if (event.key === DEMO_STORAGE_KEY || event.key === null) {
        setSaved(readSavedDemo());
        setMessage('Local demo state changed in another tab.');
      }
    };
    window.addEventListener('storage', sync);
    return () => { clearInterval(timer); window.removeEventListener('storage', sync); };
  }, []);

  function perform(action) {
    try {
      // Re-read before mutation so repeated clicks and other tabs cannot reuse stale claims.
      const latest = parseDemo(localStorage.getItem(DEMO_STORAGE_KEY));
      const next = updateDemo(latest, action, Date.now());
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
      setSaved({ data: next, error: '' });
      setNow(Date.now());
      setError('');
      setMessage(action.type === 'start' ? 'One-minute demo session started. No mining or computation is running.' :
        action.type === 'claim-session' ? `${SESSION_POINTS} demo points added. These have no monetary value.` :
          'Activity demo points added. Completion is self-reported, not verified.');
    } catch (failure) {
      setMessage('');
      setError(`Demo action failed: ${failure.message}`);
    }
  }

  function reset() {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      setSaved({ data: emptyDemo(), error: '' });
      setConfirmed({});
      setResetting(false);
      setMessage('Only this prototype’s local data was reset. Learning progress is unchanged.');
      setError('');
    } catch (failure) { setError(`Could not reset local demo data: ${failure.message}`); }
  }

  let remaining = 0;
  let clockError = '';
  try { if (data) remaining = sessionRemaining(data, now); }
  catch (failure) { clockError = failure.message; }
  const completedTasks = data ? claimedToday(data, now) : [];
  const active = data?.startedAt !== null && data !== null;
  const ready = active && remaining === 0 && !clockError;
  const seconds = Math.ceil(remaining / 1000);
  const timeLabel = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const inviteURL = `${window.location.origin}/prototype/community?ref=JVX-DEMO`;

  return <>
    <Seo title="Jovexa Orbit: interactive prototype" description="Explore a non-financial community prototype with local demo points, timed sessions and daily learning activities. No token, mining or earnings." path="/prototype/community" />
    <div className="orbit">
      <div className="orbit-notice"><strong>Interactive prototype / not a financial product</strong>
        <span>No real mining, token, wallet, earnings, withdrawals, or referral tracking. All points are fictional.</span></div>
      <div className="orbit-shell">
        <aside className="orbit-sidebar">
          <Link to="/prototype/community" className="orbit-brand"><span className="orbit-mark" aria-hidden="true">O</span>
            <span>Jovexa Orbit<small>Community concept lab</small></span></Link>
          <nav aria-label="Prototype navigation">
            {views.map(([id, label], index) => <button key={id} type="button" aria-current={view === id ? 'page' : undefined}
              onClick={() => { setView(id); setMessage(''); }}><span aria-hidden="true">0{index + 1}</span>{label}</button>)}
          </nav>
          <p className="orbit-sidebar-note">Original Jovexa concept.<br />Device-only demo.<br />No account required.</p>
          <Link to="/digital2030">Back to Digital 2030</Link>
        </aside>
        <section className="orbit-content" aria-label="Community prototype">
          <header className="orbit-heading"><div><p className="eyebrow">Explore. Practice. Connect.</p>
            <h1>{view === 'dashboard' ? 'Your next small step.' : views.find(([id]) => id === view)[1]}</h1></div>
            <span className="orbit-chip">LOCAL DEMO</span></header>
          <p className="orbit-intro">A community experience built around useful habits, not promises of profit.</p>
          {(saved.error || error || clockError) && <div className="orbit-error" role="alert">{saved.error || error || clockError}</div>}
          <p className="orbit-message" role="status">{message}</p>

          {view === 'dashboard' && <>
            <div className="orbit-stats">
              <article className="orbit-card"><p>Demo point balance</p><strong data-testid="demo-balance">{data ? demoBalance(data).toLocaleString('en-US') : 'Unavailable'}</strong><small>Not currency. No cash value.</small></article>
              <article className="orbit-card"><p>Sessions claimed</p><strong>{data?.sessionsCompleted ?? 'Unavailable'}</strong><small>Local prototype history only.</small></article>
              <article className="orbit-card"><p>Today’s activities</p><strong>{completedTasks.length} / {DEMO_TASKS.length}</strong><small>Resets at midnight UTC.</small></article>
            </div>
            <div className="orbit-dashboard">
              <article className="orbit-card orbit-session">
                <div className="orbit-card-title"><h2>Focus session</h2><span className="orbit-chip">+{SESSION_POINTS} DEMO PTS</span></div>
                <p>A one-minute accelerated timer for testing the experience. No CPU/GPU work is performed.</p>
                <div className={`orbit-ring ${active ? 'orbit-ring--active' : ''}`} aria-hidden="true"><div><span>{active ? timeLabel : '01:00'}</span><small>{ready ? 'READY TO CLAIM' : active ? 'DEMO SESSION' : 'ONE SMALL STEP'}</small></div></div>
                <p className="orbit-timer-label">{ready ? 'Session complete. Claim your fictional points.' : active ? `Time remaining: ${timeLabel}` : 'Start when you are ready.'}</p>
                <progress className="orbit-progress" aria-label="Demo session progress" max={SESSION_MS} value={active ? SESSION_MS - remaining : 0} />
                {active ? <button className="btn btn--primary" disabled={!ready || !data} onClick={() => perform({ type: 'claim-session' })}>Claim demo points</button> :
                  <button className="btn btn--primary" disabled={!data} onClick={() => perform({ type: 'start' })}>Start demo session</button>}
                <small>Progress uses your device clock. Refreshing does not restart a saved session.</small>
              </article>
              <div className="orbit-stack">
                <article className="orbit-card orbit-feature"><p className="eyebrow">Today’s direction</p><h2>Make curiosity a habit.</h2><p>Explore a lesson, review safer online habits, or outline your next project.</p><button className="btn btn--secondary" onClick={() => setView('tasks')}>Explore daily activities</button></article>
                <article className="orbit-card"><h2>Invite without the hype.</h2><p>Preview how a community invitation could look. No real referral counts or rewards are generated.</p><button className="orbit-text-button" onClick={() => setView('invite')}>See invitation preview</button></article>
              </div>
            </div>
          </>}

          {view === 'tasks' && <div className="orbit-stack">
            <p>Activities are self-reported. Opening a page is not proof of completion.
              Each activity can be claimed once per UTC day on this browser.</p>
            {DEMO_TASKS.map((task) => {
              const claimed = completedTasks.includes(task.id);
              return <article className="orbit-card orbit-task" key={task.id}>
                <div><span className="orbit-chip">+{task.points} DEMO PTS</span><h2>{task.title}</h2><p>{task.description}</p>
                  <Link to={task.path} target="_blank" rel="noopener noreferrer">Open resource (new tab)</Link></div>
                <div className="orbit-task-action"><label><input type="checkbox" disabled={claimed || !data} checked={Boolean(confirmed[task.id])}
                  onChange={(event) => setConfirmed({ ...confirmed, [task.id]: event.target.checked })} />I tried this activity</label>
                  <button className="btn btn--secondary" disabled={!data || claimed || !confirmed[task.id]}
                    onClick={() => perform({ type: 'claim-task', id: task.id, confirmed: confirmed[task.id] })}>{claimed ? 'Claimed today' : `Claim ${task.points} demo points`}</button></div>
              </article>;
            })}
          </div>}

          {view === 'invite' && <article className="orbit-card orbit-invite">
            <p className="eyebrow">An invitation, not a payout</p><h2>Build a useful community.</h2>
            <p>This shared sample code does not identify you, record visitors, create accounts,
              or award points. The URL parameter is a visual prototype only.</p>
            <label htmlFor="orbit-invite-link">Demo invitation link</label>
            <input id="orbit-invite-link" readOnly value={inviteURL} onFocus={(event) => event.target.select()} />
            <button className="btn btn--primary" onClick={async () => {
              try { await navigator.clipboard.writeText(inviteURL); setMessage('Demo link copied. No referral tracking is enabled.'); setError(''); }
              catch (failure) { setError(`Could not copy: ${failure.message}. Select the link and copy it manually.`); }
            }}>Copy demo invitation</button>
            <p>Real referrals: <strong>Not tracked</strong><br />Referral rewards: <strong>Not available</strong></p>
            <p className="fine-print">No deposits, purchases, wallet connections, or recruitment payments.</p>
          </article>}

          {view === 'about' && <article className="orbit-card orbit-explanation">
            <h2>What this prototype is</h2><p>An original Jovexa interface exploring sessions, useful activities,
              and community invitations. It does not run an AI model, blockchain, or mining process.</p>
            <h2>Your local data</h2><p>Session start time, completed-session count, fictional task points,
              and daily claims are stored in this browser’s localStorage. No account or server ledger exists.
              Another device will not share your balance. Clearing site data removes it.</p>
            <h2>Not a secure rewards ledger</h2><p>Anyone can edit local storage or the device clock.
              Points cannot be purchased, transferred, redeemed, or withdrawn. No value, listing,
              conversion, or future entitlement is promised. Multiple tabs are not an authoritative
              concurrency boundary.</p>
            <h2>Before a real service</h2><p>A real account-backed system would require authenticated users,
              server-side validation, an auditable ledger, anti-abuse controls, privacy and legal
              review, and explicit approval of any financial scope. None is implied by this demo.</p>
          </article>}

          <footer className="orbit-footer"><p>Prototype only. Progress stays on this device and can be reset.</p>
            {resetting ? <div role="group" aria-label="Confirm demo reset"><p>Delete only Orbit demo progress from this browser?</p>
              <button className="btn btn--secondary" onClick={reset}>Confirm reset</button>{' '}
              <button className="orbit-text-button" onClick={() => setResetting(false)}>Cancel</button></div> :
              <button className="orbit-text-button" onClick={() => setResetting(true)}>Reset demo data</button>}
          </footer>
        </section>
      </div>
    </div>
  </>;
}
