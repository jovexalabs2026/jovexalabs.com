import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { projects } from '../data/learn/projects.js';
import { getCourse } from '../data/learn/index.js';

export default function Projects() {
  return (
    <>
      <Seo
        title="Mini Projects"
        description="Practice with hands-on mini projects: a profile page, responsive landing page, todo app, calculator, database queries, and a version-controlled project."
        path="/learn/projects"
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>Projects</span>
        </nav>
        <p className="eyebrow">Mini Projects</p>
        <h1>Build something real</h1>
        <p className="hero__lead">
          Lessons teach ideas, projects make them stick. Each project has requirements, starter
          code, hints, and an optional challenge.
        </p>
      </section>

      <section className="section section--narrow">
        {projects.map((project) => {
          const course = getCourse(project.course);
          return (
            <article className="card path-card" key={project.slug}>
              <h2>
                <span aria-hidden="true">{project.icon}</span> {project.title}
              </h2>
              <p className="course-card__meta">
                Recommended course:{' '}
                {course ? <Link to={`/learn/${course.slug}`}>{course.title}</Link> : project.course}
              </p>
              <p>
                <strong>Objective:</strong> {project.objective}
              </p>
              <p>
                <strong>Requirements:</strong>
              </p>
              <ul className="list">
                {project.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
              <p>
                <strong>Starter code:</strong>
              </p>
              <pre className="code-block">
                <span className="code-block__lang">{project.language}</span>
                <code>{project.starter}</code>
              </pre>
              <div className="callout">
                <p className="callout__title">Hints</p>
                <ul>
                  {project.hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Optional challenge:</strong> {project.challenge}
              </p>
            </article>
          );
        })}
      </section>
    </>
  );
}
