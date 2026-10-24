import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const WAYS = [
  {
    title: 'Find our GitHub profile',
    text: 'Check the official profile for publicly available projects. Repository access and licensing vary; public lessons do not imply an open-source license.',
    href: 'https://github.com/jovexalabs2026',
    label: 'Visit GitHub',
  },
  {
    title: 'Report an issue',
    text: 'Found a typo, broken example, or Code Lab bug? Send the page URL and reproducible steps without personal data.',
    href: 'mailto:admin@jovexalabs.com?subject=Learning%20feedback',
    label: 'Report an Issue',
  },
  {
    title: 'Suggest a lesson',
    text: 'Tell us the topic and what you want to achieve. Use original examples or material you have permission to share.',
    href: 'mailto:admin@jovexalabs.com?subject=Lesson%20suggestion',
    label: 'Suggest a Lesson',
  },
  {
    title: 'Improve the content',
    text: 'Contact us about a correction or original exercise before preparing a large contribution. Source access and reuse permissions are separate.',
    href: 'mailto:admin@jovexalabs.com?subject=Content%20contribution',
    label: 'Discuss a Contribution',
  },
];

export default function LearnCommunity() {
  return (
    <>
      <Seo
        title="Community"
        description="Join the Jovexa Learn community: contribute lessons, report issues, suggest improvements, and help build free coding education on GitHub."
        path="/learn/community"
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>Community</span>
        </nav>
        <p className="eyebrow">Community</p>
        <h1>Help improve Jovexa Learn</h1>
        <p className="hero__lead">
          Share feedback about the lessons, tools, and platform. Free learning access does not
          grant a source-code license or access to private repositories.
        </p>
      </section>

      <section className="section section--narrow">
        <div className="grid grid--two">
          {WAYS.map((way) => (
            <article className="card" key={way.title}>
              <h2>{way.title}</h2>
              <p>{way.text}</p>
              <a className="btn btn--secondary" href={way.href} target="_blank" rel="noreferrer">
                {way.label} ↗
              </a>
            </article>
          ))}
        </div>
        <div className="callout">
          <p className="callout__title">Contribution guidelines</p>
          <p>
            Read our <Link to="/developers/docs#feedback">feedback and contribution guide</Link> for
            report details, originality requirements, and safe disclosure. Reuse rights remain
            subject to an explicit project license.
          </p>
        </div>
      </section>
    </>
  );
}
