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
    text: 'Free original tutorials and a live code playground through Jovexa Learn, our learning platform.',
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
        title="Custom Websites, Software & Digital Solutions"
        description="Jovexa Labs builds its own software products and offers custom websites, web platforms, and digital solutions to businesses worldwide."
        path="/"
      />

      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">Jovexa Labs Digital Solutions</p>
          <h1>Custom websites, software &amp; digital solutions for businesses worldwide.</h1>
          <p className="hero__lead">
            From your business idea to a professional digital experience. We build our own
            products and work with businesses on responsive websites and custom software.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/website-development">
              Get a Free Quote
            </Link>
            <Link className="btn btn--secondary" to="/services">
              Explore Services
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
        <p className="eyebrow">Websites for growing businesses</p>
        <h2>Start with a clear scope and a practical plan.</h2>
        <p className="section__lead">
          Explore transparent USD package starting points, original website concepts, and a
          no-obligation project inquiry. Final deliverables and pricing are agreed in writing.
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/pricing">View website packages</Link>
          <Link className="btn btn--secondary" to="/templates">Browse original demos</Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">A clear process</p>
        <h2>From first conversation to handover</h2>
        <div className="grid grid--three">
          {[
            ['01 · Understand', 'Tell us about your goals, audience, required features, budget, and timeframe.'],
            ['02 · Agree scope', 'Review a written quotation that sets deliverables, exclusions, milestones, and third-party costs.'],
            ['03 · Build & review', 'Work through the agreed review rounds, test the result, and plan a documented handover.'],
          ].map(([title, text]) => (
            <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-banner">
          <div>
            <p className="eyebrow">Original demonstrations</p>
            <h2>See a starting direction for your industry.</h2>
            <p className="section__lead">
              Browse ten original sample concepts. These are demonstrations, not client commissions.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/templates">Browse website demos</Link>
              <Link className="btn btn--secondary" to="/portfolio">View portfolio</Link>
            </div>
          </div>
          <div className="feature-banner__visual" aria-hidden="true">
            <span className="feature-banner__glyph">✦</span>
          </div>
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
            <p className="eyebrow">Our First Milestone of 2026</p>
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
        <div className="feature-banner">
          <div>
            <p className="eyebrow">Jovexa Learn</p>
            <h2>Learn to code, free forever</h2>
            <p className="section__lead">
              Original beginner-friendly courses on HTML, CSS, JavaScript, Python, SQL, Git, and
              Flutter, with exercises, quizzes, learning paths, and a live Code Lab that runs in
              your browser. No account needed.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/learn">
                Browse Courses
              </Link>
              <Link className="btn btn--secondary" to="/learn/playground">
                Open Code Lab
              </Link>
            </div>
          </div>
          <div className="feature-banner__visual" aria-hidden="true">
            <span className="feature-banner__glyph">{'</>'}</span>
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

      <section className="section section--narrow">
        <p className="eyebrow">Quick answers</p>
        <h2>Before we begin</h2>
        <dl className="faq">
          <dt>Are your listed prices in US dollars?</dt>
          <dd>Yes. Prices shown are USD starting points. Applicable taxes and third-party charges may cost extra.</dd>
          <dt>Are the demos existing client websites?</dt>
          <dd>No. They are original fictional demonstrations and are labeled as such.</dd>
          <dt>Is there online payment or a project dashboard?</dt>
          <dd>No live payments or customer account portal are available in this website release.</dd>
        </dl>
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
