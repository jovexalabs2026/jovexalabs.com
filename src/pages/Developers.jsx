import Seo from '../components/Seo.jsx';

export default function Developers() {
  return (
    <>
      <Seo
        title="Developers"
        description="Jovexa Labs builds software with maintainability, transparency, and developer experience in mind."
        path="/developers"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Developers</p>
        <h1>For Developers</h1>
        <p>
          Jovexa Labs builds software with maintainability, transparency, and developer experience
          in mind.
        </p>
        <p>
          Where appropriate, source code, documentation, tools, and developer resources will be
          published through our official GitHub account.
        </p>

        <h2>Resources</h2>
        <ul className="list">
          <li>
            <a href="https://github.com/jovexalabs2026" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>Documentation — published per-repository</li>
          <li>Repositories — see GitHub</li>
          <li>Releases — see GitHub Releases per project</li>
          <li>Contributing — see each repository&apos;s guidelines</li>
          <li>Future APIs / SDKs — planned as products mature</li>
        </ul>
      </section>
    </>
  );
}
