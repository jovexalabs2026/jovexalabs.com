import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import TemplatePreview from '../components/TemplatePreview.jsx';
import NotFound from './NotFound.jsx';
import { useServiceCatalog } from '../lib/useServiceCatalog.js';

export default function TemplateDetail() {
  const { templateSlug } = useParams();
  const { packages, templates, loading, error } = useServiceCatalog();
  const template = templates.find((item) => item.slug === templateSlug);
  const [mode, setMode] = useState('desktop');
  if (loading) return <section className="section" role="status">Loading demo configuration…</section>;
  if (error) return <section className="section form-error" role="alert">Could not load demo configuration: {error}</section>;
  if (!template) return <NotFound />;
  const compatiblePackage = packages.find((item) => item.id === template.packageId) || {
    name: 'Project-specific scope',
  };

  return (
    <>
      <Seo
        title={`${template.name} Website Demo`}
        description={`${template.description} View this original ${template.category.toLowerCase()} website demonstration by Jovexa Labs.`}
        path={`/templates/${template.slug}`}
      />
      <section className="section section--narrow">
        <p className="breadcrumbs"><Link to="/templates">Website demos</Link> / {template.name}</p>
        <p className="eyebrow">{template.category} · Original design concept</p>
        <h1>{template.name} website demo</h1>
        <p className="hero__lead">
          This interactive sample is fictional demonstration content, not a commissioned client
          project. Explore the layout on desktop and mobile, then ask us about a tailored version.
        </p>
        <div className="template-detail__actions">
          <Link className="btn btn--primary" to={`/website-development?package=${template.packageId}&template=${template.slug}`}>
            Request customization
          </Link>
          <Link className="btn btn--secondary" to={`/website-development?template=${template.slug}`}>
            Request a quote
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="preview-toolbar">
          <div>
            <p className="eyebrow">Live preview</p>
            <p className="preview-toolbar__note">Buttons inside the sample only change this preview; they do not submit information.</p>
          </div>
          <div className="preview-switch" role="group" aria-label="Preview device">
            <button type="button" aria-pressed={mode === 'desktop'} onClick={() => setMode('desktop')}>Desktop</button>
            <button type="button" aria-pressed={mode === 'mobile'} onClick={() => setMode('mobile')}>Mobile</button>
          </div>
        </div>
        <TemplatePreview template={template} mode={mode} />
      </section>
      <section className="section section--narrow">
        <div className="card">
          <p className="eyebrow">Package compatibility</p>
          <h2>{compatiblePackage.name}</h2>
          <p>This concept is a starting point for a scoped project. Content, features, platform, and price are confirmed in a written quote.</p>
          <Link to="/pricing">Review package inclusions and exclusions</Link>
        </div>
      </section>
    </>
  );
}
