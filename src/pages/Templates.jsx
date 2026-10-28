import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { useServiceCatalog } from '../lib/useServiceCatalog.js';

export default function Templates() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All industries');
  const { templates, loading, error } = useServiceCatalog();
  const categories = [...new Set(templates.map((template) => template.category))];
  const shown = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesCategory = category === 'All industries' || template.category === category;
      const matchesSearch = !normalized ||
        `${template.name} ${template.category} ${template.description}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [search, category, templates]);

  return (
    <>
      <Seo
        title="Website Templates & Live Demos"
        description="Browse ten original website design demonstrations for restaurants, hotels, retailers, clinics, schools, and more."
        path="/templates"
      />
      <section className="section section--narrow">
        <p className="eyebrow">Website templates &amp; live demos</p>
        <h1>Find a direction for your next website.</h1>
        <p className="hero__lead">
          Explore original, interactive design concepts. These are demonstration projects, not
          completed client commissions; we can discuss a custom implementation based on your needs.
        </p>
      </section>
      <section className="section template-marketplace">
        {loading && <p role="status">Loading current demo catalog…</p>}
        {error && <p className="form-error" role="alert">Could not load the current demo catalog: {error}</p>}
        <div className="template-filters">
          <label>
            Search demos
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try restaurant, clinic, portfolio..."
            />
          </label>
          <label>
            Industry
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All industries</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <p className="template-filters__count" aria-live="polite">
            Showing {shown.length} of {templates.length} original demos
          </p>
        </div>
        {shown.length ? (
          <div className="grid grid--three template-grid">
            {shown.map((template) => (
              <article
                className="template-card"
                key={template.slug}
                style={{ '--demo-accent': template.color, '--demo-soft': template.soft }}
              >
                <div className="template-card__art" aria-hidden="true">
                  <span>{template.brand}</span>
                  <strong>{template.headline}</strong>
                  <i>{template.category}</i>
                </div>
                <div className="template-card__body">
                  <p className="eyebrow">{template.category}</p>
                  <h2>{template.name}</h2>
                  <p>{template.description}</p>
                  <div className="template-card__actions">
                    <Link className="btn btn--secondary" to={`/templates/${template.slug}`}>View live demo</Link>
                    <Link
                      className="template-card__request"
                      to={`/website-development?package=${template.packageId}&template=${template.slug}`}
                    >
                      Request this design
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card template-empty">
            <h2>No demos match those filters</h2>
            <p>Try a different search or select all industries.</p>
          </div>
        )}
      </section>
    </>
  );
}
