import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const SERVICES = [
  ['Business websites', 'Responsive, accessible websites for small businesses, professional services, and new ventures.'],
  ['E-commerce', 'Product catalogues and store experiences scoped around an agreed platform and supported payment provider.'],
  ['Custom web applications', 'Dashboards, booking flows, customer portals, and integrations quoted to your requirements.'],
  ['Website care', 'A limited monthly option for agreed updates and basic technical support.'],
];

export default function Services() {
  return (
    <>
      <Seo
        title="Website & Software Development Services"
        description="Explore website development, e-commerce, custom web applications, and maintenance from Jovexa Labs Digital Solutions."
        path="/services"
      />
      <section className="section section--narrow">
        <p className="eyebrow">Jovexa Labs Digital Solutions</p>
        <h1>Custom websites, software &amp; digital solutions for businesses worldwide.</h1>
        <p className="hero__lead">
          From your business idea to a professional digital experience. We work with you to agree
          on a practical scope, clear deliverables, and a written quotation before development starts.
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/website-development">Get a Free Quote</Link>
          <Link className="btn btn--secondary" to="/pricing">See packages</Link>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">What we can build</p>
        <h2>Services shaped around your business</h2>
        <div className="grid grid--two">
          {SERVICES.map(([title, description]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="feature-banner service-banner">
          <div>
            <p className="eyebrow">A useful starting point</p>
            <h2>See an original website concept for your industry.</h2>
            <p className="section__lead">
              Explore ten clearly labeled demonstration projects. Each is a visual direction, not
              a claim of completed client work.
            </p>
            <Link className="btn btn--primary" to="/templates">Browse website demos</Link>
          </div>
          <div className="feature-banner__visual" aria-hidden="true">
            <span className="feature-banner__glyph">&lt;/&gt;</span>
          </div>
        </div>
      </section>
    </>
  );
}
