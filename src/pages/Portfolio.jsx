import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { simulationEnabled, simulationRequest } from '../lib/simulation-api.js';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!simulationEnabled) return undefined;
    const controller = new AbortController();
    simulationRequest('/api/portfolio', { signal: controller.signal })
      .then((result) => setProjects(result.projects))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Seo
        title="Portfolio"
        description="Explore Jovexa Labs' published work and original design demonstrations. We do not present fictional samples as client commissions."
        path="/portfolio"
      />
      <section className="section section--narrow">
        <p className="eyebrow">Selected work</p>
        <h1>Thoughtful digital work, shared with permission.</h1>
        <p className="hero__lead">
          Client work is added here only after completion and documented customer permission.
          Website concepts are separately labeled as demonstrations.
        </p>
      </section>
      {simulationEnabled && error && <p className="section form-error" role="alert">Could not load local portfolio: {error}</p>}
      <section className="section">
        {projects.length ? (
          <div className="grid grid--two">
            {projects.map((project) => (
              <article className="card" key={project.id}>
                <p className="eyebrow">Completed client project · shared with permission</p>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="card">
            <h2>No client projects published yet</h2>
            <p>We will not invent client commissions, testimonials, results, or performance statistics.</p>
            <Link className="btn btn--secondary" to="/templates">Explore original demo concepts</Link>
          </div>
        )}
      </section>
    </>
  );
}
