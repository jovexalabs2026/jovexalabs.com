import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function OpenSource() {
  return (
    <>
      <Seo
        title="Open Source"
        description="Jovexa Labs supports open development by publishing selected tools, libraries, utilities, and educational projects publicly on GitHub."
        path="/open-source"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Open Source</p>
        <h1>Open Source at Jovexa Labs</h1>
        <p className="hero__lead">
          We believe good software gets better in the open. Where it makes sense, we publish
          tools, libraries, utilities, and educational projects publicly.
        </p>
        <p>
          Not every Jovexa product is open source, and availability depends on the individual
          project. Our default, however, is to share what can help others learn or build.
        </p>
      </section>

      <section className="section">
        <div className="grid grid--two">
          <div className="card">
            <h2>Repositories</h2>
            <p>
              All public projects live on our official GitHub account. Watch the account to be
              notified as new repositories are published.
            </p>
            <a
              className="btn btn--secondary"
              href="https://github.com/jovexalabs2026"
              target="_blank"
              rel="noreferrer"
            >
              Browse GitHub ↗
            </a>
          </div>
          <div className="card">
            <h2>Contributing</h2>
            <p>
              Contribution guidelines are published per-repository. Check each project&apos;s
              README and CONTRIBUTING file for how to get involved. Issues, discussions, and
              pull requests are welcome where enabled.
            </p>
          </div>
          <div className="card">
            <h2>Licensing</h2>
            <p>
              Licenses vary by project and are always specified in each repository. Check the
              LICENSE file before reusing any code in your own work.
            </p>
          </div>
          <div className="card">
            <h2>Community</h2>
            <p>
              Questions and discussion happen through GitHub Issues on the relevant repository, or
              via our <Link to="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--narrow">
        <h2>What&apos;s coming</h2>
        <p>
          Our first open-source releases are planned as part of our{' '}
          <Link to="/roadmap">2026–2027 roadmap</Link>: small, focused tools and libraries
          extracted from our internal product work. They are the kind of utilities we wished
          existed when we needed them.
        </p>
      </section>
    </>
  );
}
