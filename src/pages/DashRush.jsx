import Seo from '../components/Seo.jsx';

export default function DashRush() {
  return (
    <>
      <Seo
        title="Dash Rush: Endless Run & Jump"
        description="Dash Rush: Endless Run & Jump is an arcade-style endless runner built around quick reactions, timing, movement, and replayability."
        path="/products/dash-rush"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Mobile Game / Arcade / Endless Runner</p>
        <h1>Dash Rush: Endless Run &amp; Jump</h1>
        <p className="hero__lead">Fast reflexes. Endless challenge.</p>

        <p>
          Dash Rush: Endless Run &amp; Jump is an arcade-style endless runner built around quick
          reactions, timing, movement, and replayability.
        </p>
        <p>
          Players keep moving forward, avoid obstacles, survive longer, and improve with every
          run.
        </p>

        <ul className="list">
          <li>Endless gameplay</li>
          <li>Reflex-based controls</li>
          <li>Progressive challenge</li>
          <li>Replayability</li>
          <li>Mobile-first design</li>
        </ul>

        <h2>Developed by Jovexa Labs</h2>
        <p className="badge">Current Status: Testing / Preparing for Release</p>
        <p>Coming Soon on Google Play</p>
      </section>
    </>
  );
}
