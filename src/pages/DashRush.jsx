import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const FEATURES = [
  {
    title: 'Endless Gameplay',
    text: 'No finish line — just you, the track, and your best distance. Every run is a new challenge.',
  },
  {
    title: 'Reflex-Based Controls',
    text: 'One-touch jumping that is easy to learn and satisfying to master. Timing is everything.',
  },
  {
    title: 'Progressive Difficulty',
    text: 'The further you run, the faster and trickier it gets — the challenge grows with your skill.',
  },
  {
    title: 'Built for Replay',
    text: 'Short sessions, instant restarts, and score chasing keep every attempt fresh.',
  },
  {
    title: 'Family Friendly',
    text: 'Designed to be suitable for all ages, with age-appropriate content and advertising.',
  },
  {
    title: 'Mobile-First Design',
    text: 'Smooth performance and responsive controls, optimized for a wide range of Android devices.',
  },
];

export default function DashRush() {
  return (
    <>
      <Seo
        title="Dash Rush: Endless Run & Jump"
        description="Dash Rush: Endless Run & Jump is a fast-paced arcade endless runner by Jovexa Labs — quick reactions, perfect timing, endless challenge. Coming soon on Google Play."
        path="/products/dash-rush"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Mobile Game / Arcade / Endless Runner</p>
        <h1>Dash Rush: Endless Run &amp; Jump</h1>
        <p className="hero__lead">Fast reflexes. Endless challenge.</p>

        <p>
          Dash Rush is our flagship mobile game — an arcade-style endless runner built around
          quick reactions, precise timing, and pure replayability. Keep moving forward, leap over
          obstacles, survive longer, and beat your best with every run.
        </p>

        <p className="badge">Current Status: Testing — Preparing for Release on Google Play</p>
      </section>

      <section className="section">
        <p className="eyebrow">Features</p>
        <h2>Why you&apos;ll keep coming back</h2>
        <div className="grid">
          {FEATURES.map((f) => (
            <div className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--narrow">
        <h2>Release plans</h2>
        <ul className="list">
          <li>
            <strong>Now:</strong> closed testing on Google Play with a growing tester community.
          </li>
          <li>
            <strong>Next:</strong> production release on Google Play.
          </li>
          <li>
            <strong>After launch:</strong> content updates — new challenges, progression, and
            polish based on player feedback.
          </li>
        </ul>

        <h2>Our commitment to players</h2>
        <ul className="list">
          <li>Fair, family-friendly gameplay — no dark patterns, no pay-to-win.</li>
          <li>Age-appropriate advertising configured for family audiences.</li>
          <li>Minimal data collection — see our <Link to="/privacy">Privacy Policy</Link>.</li>
          <li>Ongoing support and updates after launch.</li>
        </ul>

        <h2>Developed by Jovexa Labs</h2>
        <p>
          Dash Rush is designed, developed, and published by Jovexa Labs.{' '}
          <Link to="/about">Learn more about the studio</Link> or follow our{' '}
          <Link to="/roadmap">roadmap</Link> for release updates.
        </p>

        <div className="hero__actions">
          <span className="btn btn--primary btn--disabled" aria-disabled="true">
            Coming Soon on Google Play
          </span>
          <Link className="btn btn--secondary" to="/contact">
            Ask a Question
          </Link>
        </div>
      </section>
    </>
  );
}
