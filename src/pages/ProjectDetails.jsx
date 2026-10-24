import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { products } from '../data/products.js';
import NotFound from './NotFound.jsx';

export default function ProjectDetails() {
  const { projectSlug } = useParams();
  const product = products.find((item) => item.slug === projectSlug && item.projectPath);
  if (!product) return <NotFound />;

  return <>
    <Seo title={`${product.name}: project guide`} description={product.description} path={product.projectPath} />
    <section className="section section--narrow">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/developers/projects">Public projects</Link><span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>
      <p className="eyebrow">{product.category}</p>
      <h1>{product.name}</h1>
      <p className="hero__lead">{product.description}</p>
      <p className="badge">{product.status}</p>
      <p>Platform: {product.platforms.join(', ')}. No installation or account is required for these web resources.</p>
      <div className="hero__actions">
        <Link className="btn btn--primary" to={product.link}>{product.cta}</Link>
        <Link className="btn btn--secondary" to="/developers/docs">Read the usage guide</Link>
      </div>
      <h2>What you can do</h2>
      <ul className="list">{product.capabilities.map((text) => <li key={text}>{text}</li>)}</ul>
      <h2>Current limitations</h2>
      <ul className="list">{product.limitations.map((text) => <li key={text}>{text}</li>)}</ul>
      <h2>Data and access</h2>
      <p>Use a current browser with JavaScript enabled. Public browser tools do not require
        private documents, passwords, or payment details. Do not enter sensitive information.
        See the <Link to="/privacy">privacy notice</Link> and <Link to="/terms">terms</Link>.</p>
      <h2>Source code and integrations</h2>
      <p>Public access to this website is not an open-source license. Repository access and
        reuse permissions are separate. No supported public API or SDK is available for this project.
        Do not treat page URLs or internal assets as a stable integration contract.</p>
      <h2>Feedback</h2>
      <p>Send a reproducible, non-sensitive report using the <Link to="/developers/docs#feedback">feedback guide</Link>.
        Roadmap items are plans, not release guarantees.</p>
    </section>
  </>;
}
