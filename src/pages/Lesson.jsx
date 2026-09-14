import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';
import Exercise from '../components/learn/Exercise.jsx';
import { getLesson } from '../data/learn/index.js';
import {
  isBookmarked,
  isLessonComplete,
  recordVisit,
  toggleBookmark,
  toggleLessonComplete,
} from '../data/learn/progress.js';

export default function Lesson() {
  const { courseSlug, lessonSlug } = useParams();
  const { course, lesson, index } = getLesson(courseSlug, lessonSlug);
  const [complete, setComplete] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (course && lesson) {
      recordVisit(course.slug, lesson.slug);
      setComplete(isLessonComplete(course.slug, lesson.slug));
      setBookmarked(isBookmarked(course.slug, lesson.slug));
      setSidebarOpen(false);
      window.scrollTo(0, 0);
    }
  }, [course, lesson]);

  if (!course || !lesson) return <NotFound />;

  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];

  return (
    <>
      <Seo
        title={`${lesson.title} | ${course.title}`}
        description={`${lesson.objective} A free ${course.title} lesson from Jovexa Learn.`}
        path={`/learn/${course.slug}/${lesson.slug}`}
      />

      <div className="lesson-shell">
        <button
          type="button"
          className="btn btn--secondary btn--small lesson-shell__toggle"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          {sidebarOpen ? 'Hide course menu' : `☰ ${course.title} lessons`}
        </button>

        <aside className={`lesson-sidebar${sidebarOpen ? ' lesson-sidebar--open' : ''}`}>
          <p className="lesson-sidebar__course">
            <span aria-hidden="true">{course.icon}</span>{' '}
            <Link to={`/learn/${course.slug}`}>{course.title}</Link>
          </p>
          <ol className="lesson-sidebar__list">
            {course.lessons.map((l, i) => (
              <li key={l.slug}>
                <Link
                  className={l.slug === lesson.slug ? 'is-active' : ''}
                  to={`/learn/${course.slug}/${l.slug}`}
                >
                  <span aria-hidden="true">
                    {isLessonComplete(course.slug, l.slug) ? '✓' : '○'}
                  </span>{' '}
                  {i + 1}. {l.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to={`/learn/${course.slug}/quiz`}>★ Course Quiz</Link>
            </li>
          </ol>
        </aside>

        <article className="lesson">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
            <Link to={`/learn/${course.slug}`}>{course.title}</Link>{' '}
            <span aria-hidden="true">/</span> <span>{lesson.title}</span>
          </nav>

          <p className="eyebrow">
            Lesson {index + 1} of {course.lessons.length}
          </p>
          <h1>{lesson.title}</h1>
          <p className="lesson__objective">
            <strong>You will learn:</strong> {lesson.objective}
          </p>

          <div className="lesson__toolbar">
            <button
              type="button"
              className={`btn btn--small ${complete ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => setComplete(toggleLessonComplete(course.slug, lesson.slug))}
            >
              {complete ? '✓ Completed' : 'Mark as complete'}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => setBookmarked(toggleBookmark(course.slug, lesson.slug))}
            >
              {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>

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

          {lesson.mistakes && (
            <div className="callout callout--warning">
              <p className="callout__title">Common mistakes</p>
              <ul>
                {lesson.mistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {lesson.exercise && <Exercise exercise={lesson.exercise} />}

          {['html', 'css', 'javascript'].includes(course.slug) && (
            <div className="callout">
              <p className="callout__title">Try it yourself</p>
              <p>
                Open the <Link to="/learn/playground">Code Lab</Link> and experiment with the
                examples from this lesson. Breaking things is part of learning.
              </p>
            </div>
          )}

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
              <Link className="btn btn--primary" to={`/learn/${course.slug}/quiz`}>
                Take the Course Quiz →
              </Link>
            )}
          </nav>
        </article>
      </div>
    </>
  );
}
