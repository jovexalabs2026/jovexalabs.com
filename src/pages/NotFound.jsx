import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" />
      <section className="section section--narrow" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <a className="btn btn--primary" href="/">
          Back to Home
        </a>
      </section>
    </>
  );
}
