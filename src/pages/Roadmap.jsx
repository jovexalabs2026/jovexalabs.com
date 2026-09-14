import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const PHASES = [
  {
    label: 'Now',
    period: '2026',
    title: 'Foundation & first release',
    items: [
      'Launch of the official Jovexa Labs website and brand identity',
      'Dash Rush: Endless Run & Jump — closed testing on Google Play',
      'Production release of Dash Rush on Google Play',
      'Establishing quality, privacy, and release standards for all future products',
    ],
  },
  {
    label: 'Next',
    period: '2026 – 2027',
    title: 'Growth & expansion',
    items: [
      'Post-launch content updates for Dash Rush — new challenges, progression, and polish',
      'A second mobile title, building on everything we learn from Dash Rush',
      'First open-source releases: small tools and libraries from our internal work',
      'Improved developer documentation and public project pages',
    ],
  },
  {
    label: 'Later',
    period: '2027+',
    title: 'A broader product family',
    items: [
      'iOS versions of our most successful mobile titles',
      'Web platforms and educational technology projects',
      'Developer tools, and potentially public APIs / SDKs as products mature',
      'Community programs around our open-source projects',
    ],
  },
];

export default function Roadmap() {
  return (
    <>
      <Seo
        title="Roadmap & Future Plans"
        description="Where Jovexa Labs is headed: our current focus, upcoming products, and long-term vision for apps, games, open source, and developer tools."
        path="/roadmap"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Roadmap</p>
        <h1>Goals &amp; Future Plans</h1>
        <p className="hero__lead">
          We build in the open where we can. This roadmap shows what we are working on today and
          the direction we are heading — from our first game to a full family of software
          products.
        </p>
      </section>

      <section className="section section--narrow">
        <ol className="timeline">
          {PHASES.map((phase) => (
            <li className="timeline__item" key={phase.label}>
              <div className="timeline__marker" aria-hidden="true" />
              <div className="timeline__content">
                <p className="timeline__label">
                  {phase.label} <span className="timeline__period">{phase.period}</span>
                </p>
                <h2>{phase.title}</h2>
                <ul className="list">
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <p className="fine-print">
          This roadmap reflects our current plans and priorities. Timelines and scope may change
          as products evolve and as we learn from our users.
        </p>

        <div className="hero__actions">
          <Link className="btn btn--primary" to="/products">
            See Current Products
          </Link>
          <Link className="btn btn--secondary" to="/contact">
            Talk to Us
          </Link>
        </div>
      </section>
    </>
  );
}
