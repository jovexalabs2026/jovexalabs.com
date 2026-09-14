import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { courses, coursesByCategory, totalLessons } from '../data/learn/index.js';
import { paths } from '../data/learn/paths.js';
import { completedCount } from '../data/learn/progress.js';

const WHY = [
  { title: 'Free learning', text: 'Every course, lesson, and tool is free. No paywalls, no locked chapters.' },
  { title: 'Open source', text: 'The platform and its lessons are developed in the open on GitHub.' },
  { title: 'Mobile-first', text: 'Learn comfortably on your phone, tablet, or desktop.' },
  { title: 'Interactive', text: 'Editable examples, a live Code Lab, exercises, and quizzes in every course.' },
  { title: 'Beginner-friendly', text: 'Plain-English explanations with no assumed knowledge.' },
  { title: 'Practical examples', text: 'Short, real code you can run, break, and rebuild.' },
];

export default function Learn() {
  return (
    <>
      <Seo
        title="Jovexa Learn: Free Coding Courses, Examples & Interactive Practice"
        description="Learn programming by doing. Free original courses on HTML, CSS, JavaScript, Python, SQL, Git, and Flutter with interactive exercises, quizzes, and a live code playground."
        path="/learn"
      />

      <section className="section section--narrow">
        <p className="eyebrow">Jovexa Learn</p>
        <h1>Learn programming by doing.</h1>
        <p className="hero__lead">
          Master coding through clear lessons, practical examples, interactive exercises, and
          hands-on projects. {courses.length} courses, {totalLessons()} lessons, all free.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#courses">
            Start Learning
          </a>
          <Link className="btn btn--secondary" to="/learn/playground">
            Open Playground
          </Link>
        </div>
      </section>

      <section className="section" id="courses">
        <p className="eyebrow">Courses</p>
        <h2>Popular technologies</h2>
        {coursesByCategory().map((group) => (
          <div key={group.category} className="learn-category">
            <h3 className="learn-category__title">{group.category}</h3>
            <div className="grid grid--three">
              {group.courses.map((course) => {
                const done = completedCount(course);
                return (
                  <article className="card course-card" key={course.slug}>
                    <p className="course-card__icon" aria-hidden="true">
                      {course.icon}
                    </p>
                    <p className="badge">{course.level}</p>
                    <h4>{course.title}</h4>
                    <p className="course-card__tagline">{course.tagline}</p>
                    <p>{course.description}</p>
                    <p className="course-card__meta">
                      {course.lessons.length} lessons · about {course.estimatedHours}h
                      {done > 0 && ` · ${done}/${course.lessons.length} done`}
                    </p>
                    <Link className="btn btn--primary" to={`/learn/${course.slug}`}>
                      {done > 0 ? 'Continue' : 'Start Learning'}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <p className="eyebrow">Learning Paths</p>
        <h2>Follow a guided path</h2>
        <p className="section__lead">
          Not sure what order to learn in? Paths chain courses together toward a goal.
        </p>
        <div className="grid grid--three">
          {paths.slice(0, 3).map((path) => (
            <article className="card course-card" key={path.slug}>
              <p className="course-card__icon" aria-hidden="true">
                {path.icon}
              </p>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <p className="course-card__meta">{path.steps.length} steps</p>
              <Link className="btn btn--secondary" to="/learn/paths">
                View Path
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Why Jovexa Learn</p>
        <h2>Built for how people actually learn</h2>
        <div className="grid grid--three">
          {WHY.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
