import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { products } from '../data/products.js';

const CAPABILITIES = [
  {
    title: 'Mobile Apps',
    text: 'Native-quality Android and cross-platform applications designed around real user needs, performance, and privacy.',
  },
  {
    title: 'Games',
    text: 'Fast, polished arcade experiences built for replayability, starting with our flagship title, Dash Rush.',
  },
  {
    title: 'Web Platforms',
    text: 'Modern, responsive, and accessible web applications built with maintainable, well-tested code.',
  },
  {
    title: 'Educational Technology',
    text: 'Software that helps people learn, with approachable tools that make knowledge easier to reach.',
  },
  {
    title: 'Open Source',
    text: 'Selected tools, libraries, and utilities published publicly so others can learn from and build on our work.',
  },
  {
    title: 'Developer Tools',
    text: 'Utilities and workflows that make building software faster, safer, and more enjoyable.',
  },
];

const VALUES = [
  {
    title: 'User-first',
    text: 'Every product starts with a real problem worth solving, not technology looking for an excuse.',
  },
  {
    title: 'Privacy by default',
    text: 'We collect the minimum data necessary and are transparent about everything we do collect.',
  },
  {
    title: 'Quality over quantity',
    text: 'We would rather ship one dependable product than five fragile ones.',
  },
  {
    title: 'Open where possible',
    text: 'We share tools, code, and lessons learned with the developer community whenever we can.',
  },
];

export default function Home() {
  const featured = products[0];

  return (
    <>
      <Seo
        title="Software, Apps, Games & Open Technology"
        description="Jovexa Labs is an independent software studio building modern mobile apps, games, web platforms, developer tools, and open-source software."
        path="/"
      />

      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">Independent Software Studio</p>
          <h1>Software built to turn ideas into impact.</h1>
          <p className="hero__lead">
            Jovexa Labs designs and develops modern applications, games, web platforms, developer
            tools, and open-source software, built to be useful, accessible, and dependable for
            everyone.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/products">
              Explore Products
            </Link>
            <Link className="btn btn--secondary" to="/roadmap">
              Our Roadmap
            </Link>
          </div>
          <ul className="hero__stats" aria-label="Quick facts">
            <li>
              <strong>2026</strong>
              <span>Founded</span>
            </li>
            <li>
              <strong>6</strong>
              <span>Focus areas</span>
            </li>
            <li>
              <strong>100%</strong>
              <span>Independent</span>
            </li>
          </ul>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <img
            className="hero__logo"
            src="/brand/logo-mark.png"
            alt=""
            width="303"
            height="396"
          />
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">What we build</p>
        <h2>Six focus areas, one standard of quality</h2>
        <p className="section__lead">
          From mobile games to developer tooling, everything we ship follows the same principles:
          simple, reliable, and built for real people.
        </p>
        <div className="grid">
          {CAPABILITIES.map((item) => (
            <div className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-banner">
          <div>
            <p className="eyebrow">Featured Product</p>
            <h2>{featured.name}</h2>
            <p className="section__lead">{featured.description}</p>
            <p className="badge">{featured.status}</p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to={`/products/${featured.slug}`}>
                Learn More
              </Link>
            </div>
          </div>
          <div className="feature-banner__visual" aria-hidden="true">
            <span className="feature-banner__glyph">▶</span>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">How we work</p>
        <h2>Our values</h2>
        <div className="grid grid--two">
          {VALUES.map((v) => (
            <div className="card" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-panel">
          <h2>Have an idea, a question, or feedback?</h2>
          <p className="section__lead">
            We read every message. Whether you are a player, a developer, or a future partner, we
            would love to hear from you.
          </p>
          <div className="hero__actions hero__actions--center">
            <Link className="btn btn--primary" to="/contact">
              Contact Us
            </Link>
            <a
              className="btn btn--secondary"
              href="https://github.com/jovexalabs2026"
              target="_blank"
              rel="noreferrer"
            >
              Follow on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
