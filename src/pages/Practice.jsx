import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Exercise from '../components/learn/Exercise.jsx';
import { courses } from '../data/learn/index.js';

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Practice() {
  const [courseFilter, setCourseFilter] = useState('all');
  const [round, setRound] = useState(0);

  const pool = useMemo(() => {
    const items = [];
    for (const course of courses) {
      if (courseFilter !== 'all' && course.slug !== courseFilter) continue;
      for (const lesson of course.lessons) {
        if (lesson.exercise) {
          items.push({ course, lesson, exercise: lesson.exercise });
        }
      }
    }
    return items;
  }, [courseFilter]);

  const selection = useMemo(() => shuffle(pool).slice(0, 5), [pool, round]);

  return (
    <>
      <Seo
        title="Practice: Coding Exercises"
        description="Sharpen your skills with free interactive coding exercises across HTML, CSS, JavaScript, Python, SQL, and Git on Jovexa Learn."
        path="/learn/practice"
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <span>Practice</span>
        </nav>
        <p className="eyebrow">Practice</p>
        <h1>Exercise your knowledge</h1>
        <p className="hero__lead">
          Random exercises pulled from every course. Pick a topic or practice everything at once.
        </p>

        <div className="practice-filter">
          <label htmlFor="practice-course">Topic</label>
          <select
            id="practice-course"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">All topics</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() => setRound((r) => r + 1)}
          >
            ↻ New Set
          </button>
        </div>

        {selection.map((item) => (
          <div key={`${round}-${item.course.slug}-${item.lesson.slug}`} className="practice-item">
            <Exercise
              exercise={item.exercise}
              heading={`${item.course.icon} ${item.course.title} · ${item.lesson.title}`}
            />
            <p className="fine-print">
              Review the lesson:{' '}
              <Link to={`/learn/${item.course.slug}/${item.lesson.slug}`}>{item.lesson.title}</Link>
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
