import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function JovexaNetworkParticipation() {
  return (
    <>
      <Seo
        title="Jovexa Network Participation and Ads Policy"
        description="How 24-hour participation, in-app points, and optional ads work in Jovexa Network."
        path="/apps/jovexa-network/participation-and-ads"
      />

      <section className="section section--narrow legal">
        <p className="eyebrow">Jovexa Network</p>
        <h1>Participation and Ads Policy</h1>
        <p><strong>Effective date: November 6, 2026</strong></p>

        <h2>Participation</h2>
        <ul>
          <li>A participation session lasts 24 hours according to server time.</li>
          <li>A completed and settled session currently awards 24 in-app points.</li>
          <li>Ads are never required to start or complete a participation session.</li>
          <li>The app does not mine cryptocurrency on your device.</li>
          <li>
            Points are non-transferable, have no monetary or cryptocurrency value, and cannot
            be sold, redeemed, or withdrawn. They are not promised earnings.
          </li>
        </ul>

        <h2>Advertising</h2>
        <ul>
          <li>Ads are optional and may fail to load or be unavailable.</li>
          <li>
            Interstitials may be shown only at an eligible session-completion transition,
            subject to a cooldown. They are not shown during an active session.
          </li>
          <li>
            An eligible rewarded ad may unlock only an <code>aurora_frame</code> visual
            cosmetic after Google's signed server-side verification.
          </li>
          <li>
            Watching or clicking an ad does not award points, money, cryptocurrency, or a
            transferable item. Test ads never grant cosmetics.
          </li>
          <li>Do not click ads to obtain rewards or encourage invalid ad traffic.</li>
        </ul>

        <p>
          Read the <Link to="/apps/jovexa-network/terms">Terms of Service</Link> and{' '}
          <Link to="/apps/jovexa-network/privacy">Privacy Notice</Link>.
        </p>
      </section>
    </>
  );
}
