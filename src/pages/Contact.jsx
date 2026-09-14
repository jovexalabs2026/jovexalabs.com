import Seo from '../components/Seo.jsx';

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Jovexa Labs for general inquiries, product support, or developer questions."
        path="/contact"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Contact</p>
        <h1>Contact Us</h1>

        <h2>General inquiries</h2>
        <p>
          Email: <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>
        </p>

        <h2>Product support</h2>
        <p>
          Email: <a href="mailto:support@jovexalabs.com">support@jovexalabs.com</a>
        </p>

        <h2>Developer inquiries</h2>
        <p>
          Reach out via{' '}
          <a href="https://github.com/jovexalabs2026" target="_blank" rel="noreferrer">
            GitHub
          </a>{' '}
          or email <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
        </p>
      </section>
    </>
  );
}
