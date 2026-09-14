import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const WAYS = [
  {
    title: 'Star and follow on GitHub',
    text: 'The platform and all lesson content live in the open on GitHub. Watch the repository to follow development.',
    href: 'https://github.com/jovexalabs2026',
    label: 'Visit GitHub',
  },
  {
    title: 'Report an issue',
    text: 'Found a typo, a broken example, or a bug in the playground? Open an issue and we will look into it.',
    href: 'https://github.com/jovexalabs2026/jovexalabs.com/issues',
    label: 'Report an Issue',
  },
  {
    title: 'Suggest a lesson',
    text: 'Tell us what you want to learn next. Course and lesson suggestions are tracked as GitHub issues.',
    href: 'https://github.com/jovexalabs2026/jovexalabs.com/issues',
    label: 'Suggest a Lesson',
  },
  {
    title: 'Improve the content',
    text: 'Lessons are plain data files in the repository. Fix wording, improve an example, or add an exercise through a pull request.',
    href: 'https://github.com/jovexalabs2026/jovexalabs.com/pulls',
    label: 'Open a Pull Request',
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
        <h1>Built in the open</h1>
        <p className="hero__lead">
          Jovexa Learn is an open-source project by Jovexa Labs. Anyone can help improve the
          lessons, the tools, and the platform itself.
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
            Read the CONTRIBUTING guide in the repository before opening a pull request. It covers
            lesson-writing style, originality requirements, and the review process.
          </p>
        </div>
      </section>
    </>
  );
}
