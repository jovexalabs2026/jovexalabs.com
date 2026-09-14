import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { products } from '../data/products.js';

export default function Products() {
  return (
    <>
      <Seo
        title="Products"
        description="Explore the mobile apps, games, and software products developed by Jovexa Labs."
        path="/products"
      />

      <section className="section">
        <p className="eyebrow">Products</p>
        <h1>Our Products</h1>
        <div className="grid">
          {products.map((p) => (
            <article className="card product-card" key={p.slug}>
              <p className="product-card__category">{p.category}</p>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <p className="badge">{p.status}</p>
              <Link className="btn btn--secondary" to={p.link || `/products/${p.slug}`}>
                {p.cta || 'Learn More'}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
