import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';
import { getCourse } from '../data/courses.js';

export default function Course() {
  const { courseSlug } = useParams();
  const course = getCourse(courseSlug);

  if (!course) return <NotFound />;

  return (
    <>
      <Seo
        title={`${course.title} Tutorial`}
        description={`${course.description} Free original lessons from Jovexa Learn.`}
        path={`/learn/${course.slug}`}
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>{course.title}</span>
        </nav>
        <p className="eyebrow">
          {course.level} Course <span aria-hidden="true">{course.icon}</span>
        </p>
        <h1>{course.title}</h1>
        <p className="hero__lead">{course.tagline}</p>
        <p>{course.description}</p>
        <div className="hero__actions">
          <Link
            className="btn btn--primary"
            to={`/learn/${course.slug}/${course.lessons[0].slug}`}
          >
            Start Lesson 1
          </Link>
          <Link className="btn btn--secondary" to="/learn/playground">
            Open Code Lab
          </Link>
        </div>
      </section>

      <section className="section section--narrow">
        <h2>Lessons</h2>
        <ol className="lesson-list">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link className="lesson-list__item" to={`/learn/${course.slug}/${lesson.slug}`}>
                <span className="lesson-list__number">{i + 1}</span>
                <span>{lesson.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
