import Seo from '../components/Seo.jsx';

const CHANNELS = [
  {
    title: 'General Inquiries',
    text: 'Partnerships, press, business questions, or anything else about Jovexa Labs.',
    email: 'admin@jovexalabs.com',
  },
  {
    title: 'Product Support',
    text: 'Help with any Jovexa Labs app or game, including bug reports, account questions, and feedback.',
    email: 'support@jovexalabs.com',
  },
  {
    title: 'Developer Inquiries',
    text: 'Questions about our open-source projects, contributions, or technical collaboration.',
    email: 'admin@jovexalabs.com',
    extra: {
      label: 'GitHub',
      href: 'https://github.com/jovexalabs2026',
    },
  },
];

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Jovexa Labs for general inquiries, product support, developer questions, and partnership opportunities."
        path="/contact"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Contact</p>
        <h1>Contact Us</h1>
        <p className="hero__lead">
          We read every message and aim to reply within 2–3 business days. Choose the channel that
          fits your question best.
        </p>
      </section>

      <section className="section">
        <div className="grid grid--three">
          {CHANNELS.map((c) => (
            <div className="card contact-card" key={c.title}>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              <p>
                <a className="contact-card__email" href={`mailto:${c.email}`}>
                  {c.email}
                </a>
              </p>
              {c.extra && (
                <p>
                  <a href={c.extra.href} target="_blank" rel="noreferrer">
                    {c.extra.label} ↗
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section section--narrow">
        <h2>Quick answers</h2>
        <dl className="faq">
          <dt>When is Dash Rush releasing?</dt>
          <dd>
            Dash Rush is currently in testing on Google Play. Follow our{' '}
            <a href="/roadmap">roadmap</a> for updates.
          </dd>
          <dt>Do you take on client / contract work?</dt>
          <dd>
            Our focus is on our own products, but we are open to hearing about interesting
            opportunities via <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
          </dd>
          <dt>How do I report a bug?</dt>
          <dd>
            Email <a href="mailto:support@jovexalabs.com">support@jovexalabs.com</a> with the
            product name, your device model, and what happened. Screenshots help a lot.
          </dd>
          <dt>How do I ask about privacy or my data?</dt>
          <dd>
            See our <a href="/privacy">Privacy Policy</a>, or email{' '}
            <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a> with the subject
            &quot;Privacy&quot;.
          </dd>
        </dl>
      </section>

      <section className="section section--narrow">
        <h2>Business information</h2>
        <p>
          Jovexa Labs operates under <strong>Jovexa Software Development Services</strong>, a
          registered software development business based in the Philippines.
        </p>
      </section>
    </>
  );
}
