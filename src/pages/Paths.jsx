import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { paths } from '../data/learn/paths.js';
import { getCourse } from '../data/learn/index.js';

export default function Paths() {
  return (
    <>
      <Seo
        title="Learning Paths"
        description="Guided learning paths on Jovexa Learn: Frontend Developer, Python Developer, Web Developer, Programming Fundamentals, and Mobile Development Basics."
        path="/learn/paths"
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span> <span>Paths</span>
        </nav>
        <p className="eyebrow">Learning Paths</p>
        <h1>Follow a guided route</h1>
        <p className="hero__lead">
          Each path chains courses and lessons in the right order so you always know what to learn
          next.
        </p>
      </section>

      <section className="section section--narrow">
        {paths.map((path) => (
          <article className="card path-card" key={path.slug}>
            <h2>
              <span aria-hidden="true">{path.icon}</span> {path.title}
            </h2>
            <p>{path.description}</p>
            <ol className="path-steps">
              {path.steps.map((step, i) => {
                const course = step.course ? getCourse(step.course) : null;
                const to = course
                  ? step.lesson
                    ? `/learn/${course.slug}/${step.lesson}`
                    : `/learn/${course.slug}`
                  : null;
                return (
                  <li key={`${path.slug}-${i}`} className="path-steps__item">
                    <span className="lesson-list__number">{i + 1}</span>
                    <span>
                      {to ? <Link to={to}>{step.title}</Link> : <strong>{step.title}</strong>}
                      {step.note && <span className="lesson-list__objective">{step.note}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </section>
    </>
  );
}
