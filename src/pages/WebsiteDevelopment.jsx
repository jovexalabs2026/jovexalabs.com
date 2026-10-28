import Seo from '../components/Seo.jsx';
import QuoteRequestForm from '../components/QuoteRequestForm.jsx';
import { useServiceCatalog } from '../lib/useServiceCatalog.js';

export default function WebsiteDevelopment() {
  const { packages, loading, error } = useServiceCatalog();
  return (
    <>
      <Seo
        title="Professional Website Development Starting at $149"
        description="Explore website development packages from Jovexa Labs Digital Solutions and prepare a project inquiry for a free written quote."
        path="/website-development"
      />
      <section className="section section--narrow">
        <p className="eyebrow">Jovexa Labs Digital Solutions</p>
        <h1>Professional business websites starting at $149 USD.</h1>
        <p className="hero__lead">
          A responsive, professional online presence starts with a clear scope. Tell us what
          you’re building and we’ll review it for a no-obligation quotation.
        </p>
      </section>
      <section className="section">
        {loading && <p role="status">Loading current simulation package configuration…</p>}
        {error && <p className="form-error" role="alert">Could not load current packages: {error}</p>}
        <div className="grid grid--three quote-packages">
          {packages.map((item) => (
            <article className="card" key={item.id}>
              <h2>{item.name}</h2>
              <p className="pricing-card__price">
                {item.startingAt ? 'Starting at ' : ''}${item.priceUsd.toLocaleString('en-US')} <span>USD</span>
              </p>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section section--narrow">
        <p className="eyebrow">Why Jovexa Labs</p>
        <h2>Clear scope before development begins.</h2>
        <ul className="list">
          <li>Written scope, price, deliverables, exclusions, and timing agreed before work starts</li>
          <li>Responsive, accessible design with practical handover guidance</li>
          <li>International inquiries welcome; service provider is based in the Philippines</li>
          <li>Third-party subscriptions and applicable taxes are identified separately</li>
        </ul>
        <h2>Frequently asked questions</h2>
        <dl className="faq">
          <dt>Is the displayed package price always the final price?</dt>
          <dd>No. Package prices are starting scopes. A written project quote confirms features, deliverables, timeline, taxes, and third-party fees.</dd>
          <dt>Do you collect payments through this website?</dt>
          <dd>No. There is no live checkout or payment collection. Any payment schedule is agreed in a project-specific written agreement.</dd>
          <dt>Do you provide hosting and a domain?</dt>
          <dd>Domain and hosting are usually separate costs. We can discuss setup assistance and list any third-party charges in the quote.</dd>
          <dt>How do I request a quote?</dt>
          <dd>Use the project form below. In static mode it prepares a draft email. In local simulation mode it stores test records only on the local machine.</dd>
        </dl>
      </section>
      <section className="section section--narrow">
        <h2>Tell us about your project</h2>
        <p>
          {import.meta.env.VITE_JOVEXA_SIMULATION === 'true'
            ? 'The local simulator records test inquiries locally for the administrator workflow; this is not a production inquiry service.'
            : 'The form prepares an email draft; it does not transmit or store the inquiry.'}
        </p>
        <QuoteRequestForm />
      </section>
    </>
  );
}
