import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function Developers() {
  return (
    <>
      <Seo
        title="Developers"
        description="Developer resources from Jovexa Labs — repositories, documentation, releases, contribution guidelines, and future APIs and SDKs."
        path="/developers"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Developers</p>
        <h1>For Developers</h1>
        <p className="hero__lead">
          We build software with maintainability, transparency, and developer experience in mind —
          and we share what we can.
        </p>
        <p>
          Where appropriate, source code, documentation, tools, and developer resources are
          published through our official GitHub account. This page is the hub for everything
          developer-facing at Jovexa Labs.
        </p>
      </section>

      <section className="section">
        <div className="grid grid--two">
          <div className="card">
            <h2>Repositories</h2>
            <p>Public source code, tools, and example projects.</p>
            <a
              className="btn btn--secondary"
              href="https://github.com/jovexalabs2026"
              target="_blank"
              rel="noreferrer"
            >
              github.com/jovexalabs2026 ↗
            </a>
          </div>
          <div className="card">
            <h2>Documentation</h2>
            <p>
              Documentation is published per-repository in each project&apos;s README and docs
              folder, so it always matches the code you are reading.
            </p>
          </div>
          <div className="card">
            <h2>Releases</h2>
            <p>
              Versioned releases with changelogs are published through GitHub Releases on each
              project as they mature.
            </p>
          </div>
          <div className="card">
            <h2>Contributing</h2>
            <p>
              Each repository defines its own contribution guidelines. Bug reports, discussions,
              and pull requests are welcome where enabled.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--narrow">
        <h2>How we build</h2>
        <ul className="list">
          <li>Clean, readable code that the next developer can maintain.</li>
          <li>Automated builds and deployments through CI/CD pipelines.</li>
          <li>Testing before release — unit tests, integration tests, and real devices.</li>
          <li>Semantic, documented releases with clear changelogs.</li>
          <li>Privacy and security reviewed as part of every release, not after it.</li>
        </ul>

        <h2>APIs &amp; SDKs</h2>
        <p>
          Public APIs and SDKs are on our long-term <Link to="/roadmap">roadmap</Link> and will be
          introduced as our products mature. If you have a use case in mind, we would genuinely
          like to hear it — <Link to="/contact">tell us about it</Link>.
        </p>
      </section>
    </>
  );
}
