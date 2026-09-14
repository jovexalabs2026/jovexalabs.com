import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { referenceCategories, referenceEntries } from '../data/learn/reference.js';

export default function Reference() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return referenceEntries.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <>
      <Seo
        title="Developer Reference"
        description="A fast, searchable reference of HTML elements, CSS properties, JavaScript methods, Python built-ins, SQL commands, and Git commands."
        path="/learn/reference"
      />

      <section className="section">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>Reference</span>
        </nav>
        <p className="eyebrow">Reference</p>
        <h1>Quick developer reference</h1>
        <p className="hero__lead">
          A curated set of the elements, properties, methods, and commands you reach for most.
        </p>

        <div className="practice-filter">
          <input
            type="search"
            className="learn-search__input"
            placeholder="Search the reference..."
            aria-label="Search reference entries"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {referenceCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <p className="course-card__meta">{results.length} entries</p>

        <div className="grid grid--two">
          {results.map((entry) => (
            <article className="card reference-card" key={entry.id}>
              <p className="course-card__meta">{entry.category}</p>
              <h3 className="reference-card__name">{entry.name}</h3>
              <p>{entry.description}</p>
              <pre className="code-block code-block--compact">
                <code>{entry.example}</code>
              </pre>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <p>No matches. Try a shorter search term or switch categories.</p>
        )}
      </section>
    </>
  );
}
