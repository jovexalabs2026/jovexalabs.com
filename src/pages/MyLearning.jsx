import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { courses, getLesson } from '../data/learn/index.js';
import {
  completedCount,
  getBookmarks,
  getQuizScore,
  getRecent,
} from '../data/learn/progress.js';

export default function MyLearning() {
  const recent = getRecent()
    .map(({ courseSlug, lessonSlug }) => getLesson(courseSlug, lessonSlug))
    .filter((r) => r.lesson);
  const bookmarks = getBookmarks()
    .map(({ courseSlug, lessonSlug }) => getLesson(courseSlug, lessonSlug))
    .filter((r) => r.lesson);
  const started = courses.filter((c) => completedCount(c) > 0);
  const continueNext = recent[0];

  return (
    <>
      <Seo
        title="My Learning"
        description="Your Jovexa Learn dashboard: continue learning, review recent lessons, track course progress, quiz scores, and bookmarks."
        path="/learn/my"
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>My Learning</span>
        </nav>
        <p className="eyebrow">My Learning</p>
        <h1>Your progress</h1>
        <p className="hero__lead">
          Progress is stored privately on this device. Nothing is uploaded and no account is
          needed.
        </p>

        {continueNext && (
          <div className="card">
            <p className="eyebrow">Continue learning</p>
            <h2>
              {continueNext.lesson.title}{' '}
              <span className="course-card__meta">in {continueNext.course.title}</span>
            </h2>
            <Link
              className="btn btn--primary"
              to={`/learn/${continueNext.course.slug}/${continueNext.lesson.slug}`}
            >
              Resume Lesson
            </Link>
          </div>
        )}

        {recent.length === 0 && (
          <div className="card">
            <h2>Nothing here yet</h2>
            <p>Start a course and your progress, scores, and bookmarks will appear here.</p>
            <Link className="btn btn--primary" to="/learn">
              Browse Courses
            </Link>
          </div>
        )}
      </section>

      {started.length > 0 && (
        <section className="section section--narrow">
          <h2>Course progress</h2>
          {started.map((course) => {
            const done = completedCount(course);
            const pct = Math.round((done / course.lessons.length) * 100);
            const quiz = getQuizScore(course.slug);
            return (
              <div className="card mylearning-course" key={course.slug}>
                <h3>
                  <span aria-hidden="true">{course.icon}</span>{' '}
                  <Link to={`/learn/${course.slug}`}>{course.title}</Link>
                </h3>
                <div className="progressbar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                  <div className="progressbar__fill" style={{ width: `${pct}%` }} />
                  <span className="progressbar__label">
                    {done}/{course.lessons.length} lessons
                    {quiz && ` · best quiz: ${quiz.score}/${quiz.total}`}
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {recent.length > 0 && (
        <section className="section section--narrow">
          <h2>Recent lessons</h2>
          <ol className="lesson-list">
            {recent.map(({ course, lesson }) => (
              <li key={`${course.slug}-${lesson.slug}`}>
                <Link className="lesson-list__item" to={`/learn/${course.slug}/${lesson.slug}`}>
                  <span aria-hidden="true">{course.icon}</span>
                  <span>
                    {lesson.title}
                    <span className="lesson-list__objective">{course.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {bookmarks.length > 0 && (
        <section className="section section--narrow">
          <h2>Bookmarks</h2>
          <ol className="lesson-list">
            {bookmarks.map(({ course, lesson }) => (
              <li key={`${course.slug}-${lesson.slug}`}>
                <Link className="lesson-list__item" to={`/learn/${course.slug}/${lesson.slug}`}>
                  <span aria-hidden="true">★</span>
                  <span>
                    {lesson.title}
                    <span className="lesson-list__objective">{course.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
