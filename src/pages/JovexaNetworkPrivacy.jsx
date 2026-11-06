import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function JovexaNetworkPrivacy() {
  return (
    <>
      <Seo
        title="Jovexa Network Privacy Notice"
        description="How Jovexa Network handles account, participation, consent, and optional advertising information."
        path="/apps/jovexa-network/privacy"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Jovexa Network</p>
        <h1>Privacy Notice</h1>
        <p><strong>Effective date: November 6, 2026</strong></p>
        <p>
          This notice applies to the Jovexa Network Android app. It is published by Jovexa Labs,
          operating under Jovexa Software Development Services ("Jovexa", "we", or "us"). For
          questions or privacy requests, email{' '}
          <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
        </p>

        <h2>What the app does</h2>
        <p>
          Jovexa Network provides account-based, server-timed 24-hour participation sessions.
          A completed and server-settled session currently adds 24 in-app points. Points are
          non-transferable, have no cash or cryptocurrency value, cannot be withdrawn, and are
          not promised earnings. The app does not mine cryptocurrency on your device and does
          not provide a cryptocurrency wallet.
        </p>
        <p>
          When enabled, the app may offer optional ads. A completed and server-verified eligible
          rewarded ad may unlock a non-transferable visual cosmetic. Watching an ad is not
          required to participate and does not award points, money, or cryptocurrency. Ads are
          disabled by default in the source configuration; the publisher must verify the exact
          build and settings distributed to testers.
        </p>

        <h2>Information processed</h2>
        <ul>
          <li>
            <strong>Account information:</strong> your email address, account identifier, and
            authentication/session information, to sign you in and associate your app records
            with your account.
          </li>
          <li>
            <strong>Participation records:</strong> session start, end and settlement times,
            internal point entries, and account-level history, to operate the service and prevent
            duplicate settlement.
          </li>
          <li>
            <strong>Cosmetic reward records:</strong> a short-lived reward intent, cosmetic
            unlock state, and ad transaction, unit, reward, and timestamp values, to verify an
            optional reward and prevent replay or duplicate settlement.
          </li>
          <li>
            <strong>Advertising and consent information:</strong> Google Mobile Ads and Google's
            User Messaging Platform may process device, app, advertising, diagnostic, and consent
            signals when ads are configured and requested.
          </li>
          <li>
            <strong>AdMob reports:</strong> authorized administrators may view Google-provided
            aggregate report rows such as date, country, ad format, requests, impressions,
            estimated earnings, match rate, and eCPM.
          </li>
        </ul>

        <h2>How information is used and shared</h2>
        <p>
          Supabase provides authentication and hosts app records for Jovexa Network. Google
          provides advertising, consent, signed reward callbacks, and AdMob reporting when those
          features are enabled. These providers process information under their own terms and
          privacy disclosures. We do not intend to send KYC documents, biometric templates,
          private wallet keys, or cryptocurrency balances to advertising systems.
        </p>
        <p>
          The app does not include a separate Jovexa analytics SDK in its current implementation.
          The exact services and data processed may change if the app or its SDK configuration
          changes; the release must be reviewed before distribution.
        </p>

        <h2>Ads and consent choices</h2>
        <p>
          The app integrates Google's User Messaging Platform. When ads are enabled, the app
          requests consent information and presents a Google consent form when required by the
          SDK. Choices and available privacy options depend on region and the configured message.
          You can open privacy options from the app when the SDK indicates they are required.
          Google may process information under its own policies. The current source build marks
          ad requests as under the age of consent by default; this technical setting is not a
          determination of the app's target age group. The publisher must verify audience and
          age settings for the distributed build.
        </p>

        <h2>Retention and security</h2>
        <p>
          Account-linked Supabase records are removed through the app account-deletion process,
          subject to backup cycles and records that must be retained by law. Google and other
          providers may retain information under their own policies. The app does not set a
          fixed deletion period for provider backups or provider logs. The backend uses
          authenticated access controls, row-level security, and server-side session and reward
          accounting. No transmission or storage method is completely secure.
        </p>

        <h2>Your choices and account deletion</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict,
          or object to certain processing, and to withdraw consent where consent applies. Email
          <a href="mailto:admin@jovexalabs.com"> admin@jovexalabs.com</a> to ask a question or
          make a privacy request.
        </p>
        <p>
          You can delete your account in the app or use our{' '}
          <Link to="/apps/jovexa-network/account-deletion">web account-deletion request page</Link>.
          Deleting the app account removes the Supabase Auth account and cascading app records.
          It does not delete information Google or other independent providers retain under
          their own policies, or information that must lawfully be retained.
        </p>

        <h2>Children and international processing</h2>
        <p>
          The publisher has not represented this app as directed to children. The target
          audience and age-related ad treatment must be confirmed in the app and Google Play
          Console before distribution. Supabase and Google may process information in locations
          outside your country under their applicable terms.
        </p>

        <h2>Changes and contact</h2>
        <p>
          We may update this notice when the service or its data practices change. Material
          changes will be reflected on this page with an updated effective date. Contact Jovexa
          Labs at <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>.
        </p>
        <p>
          Read the <Link to="/apps/jovexa-network/terms">Jovexa Network Terms</Link> and{' '}
          <Link to="/apps/jovexa-network/participation-and-ads">Participation and Ads Policy</Link>.
        </p>
      </section>
    </>
  );
}
