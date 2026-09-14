import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function Home() {
  return (
    <>
      <Seo
        title="Software, Apps, Games & Open Technology"
        description="Jovexa Labs develops modern mobile applications, games, web platforms, developer tools, and open-source software."
        path="/"
      />

      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">Jovexa Labs</p>
          <h1>Software built to turn ideas into impact.</h1>
          <p className="hero__lead">
            Jovexa Labs develops modern applications, games, web platforms, developer tools, and
            open-source software designed to be useful, accessible, and dependable.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/products">
              Explore Products
            </Link>
            <a
              className="btn btn--secondary"
              href="https://github.com/jovexalabs2026"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="code-card">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What we build</h2>
        <div className="grid">
          {[
            'Mobile Apps',
            'Games',
            'Web Platforms',
            'Educational Technology',
            'Open Source',
            'Developer Tools',
          ].map((item) => (
            <div className="card" key={item}>
              <h3>{item}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
