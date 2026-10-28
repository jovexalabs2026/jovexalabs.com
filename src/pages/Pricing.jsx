import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { useServiceCatalog } from '../lib/useServiceCatalog.js';

function priceLabel(item) {
  return `${item.startingAt ? 'Starting at ' : ''}$${item.priceUsd.toLocaleString('en-US')}`;
}

export default function Pricing() {
  const { packages, maintenance, loading, error } = useServiceCatalog();
  return (
    <>
      <Seo
        title="Website Development Pricing"
        description="Review Jovexa Labs website development packages in USD, included scope, maintenance, and common third-party costs."
        path="/pricing"
      />
      <section className="section section--narrow">
        <p className="eyebrow">Clear starting points</p>
        <h1>Website development pricing</h1>
        <p className="hero__lead">
          Packages are starting scopes, not a substitute for a written project quote. Every
          project scope, timeline, and final price is confirmed with you before work begins.
        </p>
      </section>
      {loading && <p className="section" role="status">Loading current simulation package configuration…</p>}
      {error && <p className="section form-error" role="alert">Could not load current package configuration: {error}</p>}
      <section className="section">
        <div className="pricing-grid">
          {packages.map((item) => (
            <article className="card pricing-card" key={item.id}>
              <p className="eyebrow">{item.id === 'custom' ? 'Project-specific' : 'Website package'}</p>
              <h2>{item.name}</h2>
              <p className="pricing-card__price">{priceLabel(item)} <span>USD</span></p>
              <p>{item.summary}</p>
              <ul className="list">
                {item.includes.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Link className="btn btn--primary" to={`/website-development?package=${item.id}`}>
                Request a quote
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <article className="card maintenance-card">
          <div>
            <p className="eyebrow">Optional website care</p>
            <h2>Maintenance from ${maintenance.priceUsd}/month USD</h2>
            <p>Available only after the covered website and support scope have been agreed in writing.</p>
          </div>
          <div>
            <h3>Included in the proposed monthly scope</h3>
            <ul className="list">{maintenance.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Not included</h3>
            <ul className="list">{maintenance.excludes.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </article>
      </section>
      <section className="section section--narrow pricing-notes">
        <h2>What may cost extra</h2>
        <p>
          Domain registration, hosting, premium plugins, external subscriptions, payment
          processing, advertising budgets, and applicable taxes are not included unless a written
          quote says otherwise. E-commerce includes up to 20 initial product listings; additional
          products, platform fees, and provider eligibility are confirmed in the project scope.
        </p>
        <p>
          Prices are shown in USD. No PHP conversion or live exchange rate is currently displayed.
          Quotes and invoices will state the agreed currency, payment milestones, taxes, and any
          provider charges. The proposed 50% start / 50% before final handover arrangement is
          confirmed per project; larger work may use written milestones.
        </p>
        <p>
          There is no live checkout or payment collection on this website. Payment options depend
          on verified merchant eligibility and an approved provider setup.
        </p>
        <p className="fine-print">
          Service descriptions and policies are launch drafts and require review by qualified
          Philippine legal and tax professionals before they are relied upon.
        </p>
        {import.meta.env.VITE_JOVEXA_SIMULATION === 'true' && (
          <p className="form-notice">Local simulation values can be changed in the administrator workspace. These do not change production prices.</p>
        )}
      </section>
    </>
  );
}
