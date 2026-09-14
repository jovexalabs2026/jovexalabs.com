import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { courses } from '../data/courses.js';

export default function Learn() {
  return (
    <>
      <Seo
        title="Jovexa Learn: Free Coding Tutorials"
        description="Learn to code for free with Jovexa Learn. Original beginner-friendly tutorials on HTML, CSS, JavaScript, Python, Git, and Flutter, with a live code playground."
        path="/learn"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Jovexa Learn</p>
        <h1>Learn to build. Free, forever.</h1>
        <p className="hero__lead">
          Original, beginner-friendly tutorials written by the Jovexa Labs team. Short lessons,
          real code examples, and a live playground to practice in. No account needed.
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/learn/playground">
            Open Code Lab
          </Link>
          <a className="btn btn--secondary" href="#courses">
            Browse Courses
          </a>
        </div>
      </section>

      <section className="section" id="courses">
        <p className="eyebrow">Courses</p>
        <h2>Pick a track and start today</h2>
        <div className="grid grid--three">
          {courses.map((course) => (
            <article className="card course-card" key={course.slug}>
              <p className="course-card__icon" aria-hidden="true">
                {course.icon}
              </p>
              <p className="badge">{course.level}</p>
              <h3>{course.title}</h3>
              <p className="course-card__tagline">{course.tagline}</p>
              <p>{course.description}</p>
              <p className="course-card__meta">{course.lessons.length} lessons</p>
              <Link className="btn btn--primary" to={`/learn/${course.slug}`}>
                Start Learning
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--narrow">
        <h2>How Jovexa Learn works</h2>
        <ul className="list">
          <li>
            <strong>Short lessons:</strong> each one teaches a single idea you can finish in
            minutes.
          </li>
          <li>
            <strong>Real code:</strong> every concept comes with an example you can copy and run.
          </li>
          <li>
            <strong>Practice instantly:</strong> the <Link to="/learn/playground">Code Lab</Link>{' '}
            runs HTML, CSS, and JavaScript right in your browser.
          </li>
          <li>
            <strong>Always free:</strong> learning resources on Jovexa Learn are free for
            everyone.
          </li>
        </ul>
      </section>
    </>
  );
}
