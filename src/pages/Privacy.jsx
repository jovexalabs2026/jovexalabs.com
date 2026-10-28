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
          Digital 2030 business drafts and message-warning checks run in your browser without
          sending their inputs to a server. Do not include private data. Learning progress and
          Code Lab drafts use browser storage and are not synchronized to an account.
          This public release has no live AI provider or account-backed business verification.
          Hosting providers may process ordinary request metadata under their own policies.
        </p>
        <p>
          The website-development inquiry form runs in your browser and creates an email draft
          addressed to admin@jovexalabs.com. This website does not submit or store the form
          contents. If you open and send the draft, your email provider and our business mailbox
          process that message under their respective systems and policies. Do not include
          passwords, payment details, identity documents, or other sensitive information.
        </p>
        <p>
          When the optional localhost simulation is deliberately started by a developer, the
          simulation API stores submitted test inquiries and administrative records in a local
          JSON file. The simulator is not part of the static public website, must not be used for
          real customer data, and has no external email or payment connection. Campaign parameters
          may be included in an inquiry only when present in the submitted URL; no cookie-based
          campaign tracking or third-party analytics pixel is enabled.
        </p>
        <p>
          This website uses no analytics or advertising cookies. Learning progress and Code Lab
          drafts are stored locally in the browser as described below. If you send an email using
          your own mail client, your email provider and our mailbox process the message. For
          privacy questions or requests, contact admin@jovexalabs.com.
        </p>
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
          In the Atlas preview, choosing "Load live headlines" contacts NASA&apos;s official RSS
          endpoint directly. NASA receives your IP address and ordinary browser request metadata;
          this request omits credentials and referrer. Opening an article visits NASA under its
          own policies. The map does not request your location. Reading timers and self-reported
          completions are kept only in page memory, reset on reload, and are not verified reading
          or account rewards. Fonts and national flag assets are self-hosted.
        </p>
        <p>
          Choosing "Load country data" in Atlas contacts the World Bank API for the selected ISO
          country code and Wikidata for reported leadership statements. Both providers receive
          your IP address and ordinary request metadata; credentials and referrer are omitted.
          Results and refresh timers remain in page memory only. No geolocation, private
          organization records, user profile or verification documents are sent.
        </p>
        <p>
          Enabling an Atlas public observation layer contacts USGS (earthquakes), NASA EONET
          (natural events) or Wikidata (reference ports/plants) directly. Providers receive your IP
          address; requests omit credentials and referrer. Enabled network layers refresh every
          five minutes while the page is visible, including when its tools panel is closed.
          Disable the layer to stop requests. Leaving the page stops refreshes; no consent,
          observations or layer settings are persisted. Reference passage points are bundled
          locally; opening a source link visits that provider under its own policies.
        </p>
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
