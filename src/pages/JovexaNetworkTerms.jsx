import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function JovexaNetworkTerms() {
  return (
    <>
      <Seo
        title="Jovexa Network Terms"
        description="Terms for Jovexa Network participation sessions, internal points, accounts, and optional ads."
        path="/apps/jovexa-network/terms"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Jovexa Network</p>
        <h1>Terms of Service</h1>
        <p><strong>Effective date: November 6, 2026</strong></p>
        <p>
          These terms apply to the Jovexa Network Android app, published by Jovexa Labs,
          operating under Jovexa Software Development Services. Review them before using the
          app. If you do not agree, do not use the app. Contact{' '}
          <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a> with questions.
        </p>

        <h2>The service</h2>
        <p>
          Jovexa Network provides account-based, server-timed 24-hour participation sessions,
          an in-app points ledger, and, when enabled, optional advertisements and a cosmetic
          reward. It is not a cryptocurrency miner, investment, wallet, exchange, payment
          service, or offer of guaranteed earnings.
        </p>

        <h2>Accounts and acceptable use</h2>
        <p>
          Use an email address you control and protect your sign-in links. You are responsible
          for activity through your account. Do not misuse the service, interfere with its
          operation, or attempt to manipulate session, points, advertising, or reward records.
        </p>

        <h2>Participation and points</h2>
        <p>
          Session duration and eligibility are determined by the server. A completed session
          currently awards 24 in-app points after server settlement. Points are internal,
          non-transferable, have no monetary or cryptocurrency value, cannot be sold, redeemed,
          or withdrawn, and do not guarantee any present or future benefit.
        </p>

        <h2>Advertisements and cosmetics</h2>
        <p>
          Ads are optional, are not required for participation, and may be unavailable. An
          eligible completed rewarded ad may unlock only a non-transferable visual cosmetic
          after server-side verification. Ads do not grant points, money, cryptocurrency, or
          transferable assets. Do not click ads to earn rewards or encourage invalid ad
          interactions. Google ad services are also subject to Google's terms and policies.
          Test ads do not grant cosmetics.
        </p>
        <p>
          See the <Link to="/apps/jovexa-network/participation-and-ads">Participation and Ads Policy</Link>
          for the product rules.
        </p>

        <h2>Availability and account deletion</h2>
        <p>
          Features may change or be temporarily unavailable for maintenance, security, legal, or
          operational reasons. You may delete your account in the app or submit a request at
          <Link to="/apps/jovexa-network/account-deletion"> the account-deletion page</Link>.
          Deletion is subject to applicable retention requirements and the providers' separate
          data practices.
        </p>

        <h2>Disclaimers and legal rights</h2>
        <p>
          To the extent permitted by law, the service is provided as available without a promise
          that sessions, ads, or cosmetic rewards will always be available. Nothing in these
          terms limits consumer rights or liability that cannot legally be excluded.
        </p>

        <h2>Contact</h2>
        <p>
          Jovexa Labs: <a href="mailto:admin@jovexalabs.com">admin@jovexalabs.com</a>. See the{' '}
          <Link to="/apps/jovexa-network/privacy">Privacy Notice</Link> for information about
          data handling.
        </p>
      </section>
    </>
  );
}
