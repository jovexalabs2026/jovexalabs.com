import Seo from '../components/Seo.jsx';

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Privacy Policy for Jovexa Labs, our website, and our applications including Dash Rush."
        path="/privacy"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy explains how Jovexa Labs ("we", "us", "our") handles information in
          connection with this website and Jovexa applications, including Dash Rush: Endless Run
          &amp; Jump.
        </p>

        <h2>Information We Collect</h2>
        <p>
          Some Jovexa applications and this website may collect limited information necessary to
          provide and improve our services. We do not collect more information than is reasonably
          needed for the stated purpose.
        </p>

        <h2>Information Collected Automatically</h2>
        <p>
          Some Jovexa applications may automatically collect technical information such as device
          type, operating system, app version, and general usage data through third-party
          services described below.
        </p>

        <h2>Advertising</h2>
        <p>
          Some Jovexa applications may use Google AdMob to display advertisements. AdMob may
          collect and use data as described in Google&apos;s own privacy policy.
        </p>

        <h2>Analytics</h2>
        <p>
          Some Jovexa applications may use analytics providers to understand aggregate usage
          patterns and improve our products.
        </p>

        <h2>Crash Reporting</h2>
        <p>
          Some Jovexa applications may use crash reporting tools to help us identify and fix
          technical issues.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Jovexa applications may rely on third-party services such as Google Play Services,
          Google AdMob, analytics providers, and crash reporting tools. Each third-party service
          operates under its own privacy policy.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          We do not knowingly collect personal information from children beyond what is required
          for a compliant, family-safe advertising experience where applicable. Where an
          application is directed at a general or mixed audience, ads may be configured
          accordingly.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect information handled by our website and
          applications. However, no method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain information only for as long as reasonably necessary for the purposes
          described in this policy, or as required by law.
        </p>

        <h2>External Links</h2>
        <p>
          Our website and applications may contain links to third-party sites or services. We are
          not responsible for the privacy practices of those external sites.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{' '}
          <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
        </p>
      </section>
    </>
  );
}
