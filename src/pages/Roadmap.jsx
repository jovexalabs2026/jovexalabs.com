import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const PHASES = [
  {
    label: 'Now',
    period: '2026',
    title: 'Foundation & first release',
    items: [
      'Launch of the official Jovexa Labs website and brand identity',
      'Closed testing of Dash Rush: Endless Run & Jump on Google Play',
      'Production release of Dash Rush on Google Play',
      'Establishing quality, privacy, and release standards for all future products',
    ],
  },
  {
    label: 'Next',
    period: '2026 – 2027',
    title: 'Growth & expansion',
    items: [
      'Post-launch content updates for Dash Rush with new challenges, progression, and polish',
      'A second mobile title, building on everything we learn from Dash Rush',
      'First open-source releases: small tools and libraries from our internal work',
      'Completed: developer documentation and public project pages (October 2026)',
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
          Jovexa Labs is both an independent product studio and a provider of client software
          services. This roadmap describes goals, not delivery promises; historical product
          milestones remain separate from proposed service targets.
        </p>
      </section>
      <section className="section section--narrow">
        <p className="eyebrow">Proposed client services roadmap</p>
        <h2>Commercial Services Foundation — Q4 2026</h2>
        <p>These are targets for planning, not completed milestones or guaranteed launch dates.</p>
        <ul className="list">
          <li>International website development service launch</li>
          <li>Professional pricing and quotation experience</li>
          <li>Original website template demonstrations</li>
          <li>Portfolio showcase and improved company website</li>
          <li>Customer inquiry management and initial international marketing</li>
        </ul>
        <h2>Customer Growth — Q1 2027</h2>
        <ul className="list">
          <li>Expand the template library and improve client onboarding</li>
          <li>Introduce maintenance subscriptions and reusable website components</li>
          <li>Improve quotation processes and expand business development channels</li>
        </ul>
        <h2>Advanced Development Services — Q2 2027</h2>
        <ul className="list">
          <li>Custom web applications, e-commerce integrations, and business dashboards</li>
          <li>Booking platforms, internal production tools, and improved project tracking</li>
        </ul>
        <h2>Platform Expansion — Q3–Q4 2027</h2>
        <ul className="list">
          <li>Explore an advanced visual website production tool and automated deployment workflows</li>
          <li>Consider an optional customer portal and expanded international market support</li>
        </ul>
        <p className="fine-print">
          Any future visual editing or customer portal depends on available resources, security
          design, customer validation, and separate approval. No such administrative system is
          available in this static website release.
        </p>
      </section>
      <section className="section section--narrow">
        <p className="eyebrow">Existing product roadmap</p>
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
        <aside className="card">
          <h2>Growth milestone: developer resources</h2>
          <p>Completed October 2026: this website now includes practical usage documentation and
            project guides. This does not mark Dash Rush production release, a second game,
            public APIs, or an open-source release as completed.</p>
          <p><Link to="/developers/docs">Read the documentation</Link> or{' '}
            <Link to="/developers/projects">explore project guides</Link>.</p>
        </aside>

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
