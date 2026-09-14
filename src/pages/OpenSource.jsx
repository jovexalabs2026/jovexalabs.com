import Seo from '../components/Seo.jsx';

export default function OpenSource() {
  return (
    <>
      <Seo
        title="Open Source"
        description="Jovexa Labs supports open development and may publish selected tools, educational projects, libraries, utilities, and source code publicly."
        path="/open-source"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Open Source</p>
        <h1>Open Source at Jovexa Labs</h1>
        <p>
          Jovexa Labs supports open development and may publish selected tools, educational
          projects, libraries, utilities, and source code publicly. Not every Jovexa product is
          open source — availability depends on the individual project.
        </p>

        <h2>Repositories</h2>
        <p>
          Browse our public repositories on{' '}
          <a href="https://github.com/jovexalabs2026" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>

        <h2>Contributing</h2>
        <p>
          Contribution guidelines are published per-repository. Check each project&apos;s README
          for details on how to get involved.
        </p>

        <h2>Licensing</h2>
        <p>
          Licenses vary by project and are specified in each repository. Always check the LICENSE
          file before reuse.
        </p>

        <h2>Community</h2>
        <p>
          Questions and discussion happen through GitHub Issues on the relevant repository, or via
          our contact page.
        </p>
      </section>
    </>
  );
}
