import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const PRINCIPLES = [
  {
    title: 'Build useful software',
    text: 'Every product must solve a genuine problem or bring genuine enjoyment. If it does neither, we do not ship it.',
  },
  {
    title: 'Keep technology accessible',
    text: 'Good software should work for everyone — across devices, abilities, connection speeds, and budgets.',
  },
  {
    title: 'Respect user privacy',
    text: 'We collect only what a product truly needs, explain it clearly, and never sell personal data.',
  },
  {
    title: 'Ship responsibly',
    text: 'Products are tested before release, monitored after release, and maintained for as long as people rely on them.',
  },
  {
    title: 'Improve continuously',
    text: 'Feedback, metrics, and honest self-review drive every update. Version 1.0 is a beginning, not an end.',
  },
  {
    title: 'Support open development',
    text: 'Where appropriate we publish source code, tools, and lessons learned so the wider community benefits.',
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="Jovexa Labs is an independent software development studio building useful, accessible, and reliable digital products — apps, games, web platforms, and open-source software."
        path="/about"
      />

      <section className="section section--narrow">
        <p className="eyebrow">About</p>
        <h1>About Jovexa Labs</h1>
        <p className="hero__lead">
          Jovexa Labs is an independent software development studio. We take ideas, build them
          carefully, and turn them into software that people can actually use — and enjoy using.
        </p>
        <p>
          Operating under <strong>Jovexa Software Development Services</strong>, a registered
          software development business, we work across mobile applications, games, web platforms,
          educational technology, open-source projects, and developer tools. Our flagship product,{' '}
          <Link to="/products/dash-rush">Dash Rush: Endless Run &amp; Jump</Link>, is currently
          preparing for release on Google Play.
        </p>
      </section>

      <section className="section section--narrow">
        <h2>Our mission</h2>
        <p>
          To design and build software that is <strong>useful</strong> — it solves real problems,{' '}
          <strong>accessible</strong> — anyone can pick it up and use it, and{' '}
          <strong>dependable</strong> — it works today, tomorrow, and long after launch.
        </p>

        <h2>Our vision</h2>
        <p>
          A growing family of high-quality products — games people love to play, apps people rely
          on, and open tools developers build with — all created by a small, focused, independent
          studio that puts users first.
        </p>

        <h2>Our goals</h2>
        <ul className="list">
          <li>
            <strong>Short term:</strong> launch Dash Rush on Google Play and support it with
            regular content and quality updates.
          </li>
          <li>
            <strong>Medium term:</strong> expand into additional mobile titles and publish our
            first open-source tools and libraries.
          </li>
          <li>
            <strong>Long term:</strong> grow into a trusted multi-product studio spanning games,
            apps, web platforms, educational technology, and developer tools.
          </li>
        </ul>
        <p>
          See the full breakdown on our <Link to="/roadmap">Roadmap</Link>.
        </p>
      </section>

      <section className="section">
        <p className="eyebrow">Principles</p>
        <h2>What we stand for</h2>
        <div className="grid grid--two">
          {PRINCIPLES.map((p) => (
            <div className="card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--narrow">
        <h2>Who we serve</h2>
        <ul className="list">
          <li>
            <strong>Players</strong> — polished, fair, family-friendly games with no dark
            patterns.
          </li>
          <li>
            <strong>Everyday users</strong> — apps that respect your time, your device, and your
            privacy.
          </li>
          <li>
            <strong>Learners</strong> — educational technology that makes knowledge easier to
            reach.
          </li>
          <li>
            <strong>Developers</strong> — open tools, honest documentation, and code worth reading.
          </li>
        </ul>

        <div className="hero__actions">
          <Link className="btn btn--primary" to="/products">
            View Our Products
          </Link>
          <Link className="btn btn--secondary" to="/contact">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
