import Seo from '../components/Seo.jsx';

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description="Terms of Service for Jovexa Labs' website, applications, games, and software products."
        path="/terms"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p>
          These Terms of Service ("Terms") govern your use of the Jovexa Labs website and Jovexa
          applications, games, and software products (collectively, the "Services").
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you do not
          agree, please do not use our Services.
        </p>

        <h2>Use of Services</h2>
        <p>
          You agree to use our Services only for lawful purposes and in accordance with these
          Terms.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content, trademarks, and intellectual property associated with Jovexa Labs and its
          Services remain the property of Jovexa Software Development Services unless otherwise
          stated.
        </p>

        <h2>User Responsibilities</h2>
        <p>
          You are responsible for your own use of our Services and for complying with applicable
          laws and platform policies (such as those of Google Play).
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Our Services may rely on third-party services, including Google Play Services and Google
          AdMob. Your use of those services is subject to their own terms.
        </p>

        <h2>Advertisements</h2>
        <p>
          Some Jovexa applications display advertisements to support free access to our Services.
        </p>

        <h2>Availability</h2>
        <p>
          We do not guarantee that our Services will be available at all times or free of errors,
          and we may modify, suspend, or discontinue any part of our Services.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Jovexa Software Development Services is not
          liable for any indirect, incidental, or consequential damages arising from your use of
          our Services.
        </p>

        <h2>Changes to Services</h2>
        <p>
          We may update, change, or discontinue features of our Services at any time.
        </p>

        <h2>Termination</h2>
        <p>
          We may suspend or terminate access to our Services if these Terms are violated.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may revise these Terms from time to time. Continued use of our Services after changes
          constitutes acceptance of the updated Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
        </p>
      </section>
    </>
  );
}
