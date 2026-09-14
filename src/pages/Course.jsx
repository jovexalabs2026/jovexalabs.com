import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';
import { getCourse } from '../data/learn/index.js';
import { completedCount, getQuizScore, isLessonComplete } from '../data/learn/progress.js';

export default function Course() {
  const { courseSlug } = useParams();
  const course = getCourse(courseSlug);

  if (!course) return <NotFound />;

  const done = completedCount(course);
  const quizScore = getQuizScore(course.slug);
  const pct = Math.round((done / course.lessons.length) * 100);

  return (
    <>
      <Seo
        title={`${course.title} Course`}
        description={`${course.description} ${course.lessons.length} free original lessons with exercises and a quiz.`}
        path={`/learn/${course.slug}`}
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>{course.title}</span>
        </nav>
        <p className="eyebrow">
          {course.level} · {course.category} <span aria-hidden="true">{course.icon}</span>
        </p>
        <h1>{course.title}</h1>
        <p className="hero__lead">{course.tagline}</p>
        <p>{course.description}</p>
        {done > 0 && (
          <div className="progressbar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
            <div className="progressbar__fill" style={{ width: `${pct}%` }} />
            <span className="progressbar__label">
              {done} of {course.lessons.length} lessons complete
            </span>
          </div>
        )}
        <div className="hero__actions">
          <Link
            className="btn btn--primary"
            to={`/learn/${course.slug}/${course.lessons[0].slug}`}
          >
            {done > 0 ? 'Continue Course' : 'Start Lesson 1'}
          </Link>
          <Link className="btn btn--secondary" to={`/learn/${course.slug}/quiz`}>
            {quizScore ? `Course Quiz (best: ${quizScore.score}/${quizScore.total})` : 'Course Quiz'}
          </Link>
        </div>
      </section>

      <section className="section section--narrow">
        <h2>Lessons</h2>
        <ol className="lesson-list">
          {course.lessons.map((lesson, i) => {
            const complete = isLessonComplete(course.slug, lesson.slug);
            return (
              <li key={lesson.slug}>
                <Link className="lesson-list__item" to={`/learn/${course.slug}/${lesson.slug}`}>
                  <span
                    className={`lesson-list__number${complete ? ' lesson-list__number--done' : ''}`}
                  >
                    {complete ? '✓' : i + 1}
                  </span>
                  <span>
                    {lesson.title}
                    <span className="lesson-list__objective">{lesson.objective}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
