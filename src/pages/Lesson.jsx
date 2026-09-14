import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';
import { getLesson } from '../data/courses.js';

export default function Lesson() {
  const { courseSlug, lessonSlug } = useParams();
  const { course, lesson, index } = getLesson(courseSlug, lessonSlug);

  if (!course || !lesson) return <NotFound />;

  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];

  return (
    <>
      <Seo
        title={`${lesson.title} | ${course.title}`}
        description={`${lesson.title}: a free ${course.title} lesson from Jovexa Learn. ${lesson.sections[0].text.slice(0, 120)}`}
        path={`/learn/${course.slug}/${lesson.slug}`}
      />

      <section className="section section--narrow lesson">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <Link to={`/learn/${course.slug}`}>{course.title}</Link>{' '}
          <span aria-hidden="true">/</span> <span>{lesson.title}</span>
        </nav>

        <p className="eyebrow">
          Lesson {index + 1} of {course.lessons.length}
        </p>
        <h1>{lesson.title}</h1>

        {lesson.sections.map((section) => (
          <div className="lesson__section" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
            {section.code && (
              <pre className="code-block">
                <span className="code-block__lang">{section.language}</span>
                <code>{section.code}</code>
              </pre>
            )}
          </div>
        ))}

        <div className="lesson__tryit card">
          <h2>Practice what you learned</h2>
          <p>
            Open the Jovexa Code Lab and try these examples yourself. Experimenting is the fastest
            way to make a lesson stick.
          </p>
          <Link className="btn btn--primary" to="/learn/playground">
            Open Code Lab
          </Link>
        </div>

        <nav className="lesson__nav" aria-label="Lesson navigation">
          {prev ? (
            <Link className="btn btn--secondary" to={`/learn/${course.slug}/${prev.slug}`}>
              ← {prev.title}
            </Link>
          ) : (
            <Link className="btn btn--secondary" to={`/learn/${course.slug}`}>
              ← Course Overview
            </Link>
          )}
          {next ? (
            <Link className="btn btn--primary" to={`/learn/${course.slug}/${next.slug}`}>
              {next.title} →
            </Link>
          ) : (
            <Link className="btn btn--primary" to="/learn">
              Finish: Back to Courses →
            </Link>
          )}
        </nav>
      </section>
    </>
  );
}
