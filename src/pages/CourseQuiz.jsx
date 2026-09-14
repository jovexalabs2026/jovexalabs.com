import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';
import { getCourse } from '../data/learn/index.js';
import { setQuizScore } from '../data/learn/progress.js';

export default function CourseQuiz() {
  const { courseSlug } = useParams();
  const course = getCourse(courseSlug);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!course || !course.quiz) return <NotFound />;

  const quiz = course.quiz;
  const question = quiz[current];
  const pct = Math.round((current / quiz.length) * 100);
  const passed = score >= Math.ceil(quiz.length * 0.7);

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };

  const nextQuestion = () => {
    if (current + 1 < quiz.length) {
      setCurrent(current + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setQuizScore(course.slug, score, quiz.length);
      setFinished(true);
    }
  };

  return (
    <>
      <Seo
        title={`${course.title} Quiz`}
        description={`Test your ${course.title} knowledge with the free Jovexa Learn course quiz.`}
        path={`/learn/${course.slug}/quiz`}
      />

      <section className="section section--narrow">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Jovexa Learn</Link> <span aria-hidden="true">/</span>{' '}
          <Link to={`/learn/${course.slug}`}>{course.title}</Link>{' '}
          <span aria-hidden="true">/</span> <span>Quiz</span>
        </nav>
        <p className="eyebrow">
          {course.title} Course Quiz <span aria-hidden="true">{course.icon}</span>
        </p>

        {finished ? (
          <div className="card quiz-result">
            <h1>
              {score} / {quiz.length}
            </h1>
            <p className={passed ? 'exercise__result--correct' : 'exercise__result--wrong'}>
              {passed
                ? 'You passed! Great work.'
                : 'Keep going. Review the lessons and try again.'}
            </p>
            <div className="hero__actions">
              <button type="button" className="btn btn--primary" onClick={restart}>
                Retry Quiz
              </button>
              <Link className="btn btn--secondary" to={`/learn/${course.slug}`}>
                Back to Course
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1>
              Question {current + 1} of {quiz.length}
            </h1>
            <div className="progressbar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
              <div className="progressbar__fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="exercise card">
              <p className="exercise__question">{question.question}</p>
              <div className="exercise__options" role="radiogroup" aria-label="Answer options">
                {question.options.map((option, i) => {
                  let cls = 'exercise__option';
                  if (checked && i === question.answer) cls += ' exercise__option--correct';
                  else if (checked && i === selected) cls += ' exercise__option--wrong';
                  else if (i === selected) cls += ' exercise__option--selected';
                  return (
                    <button
                      key={option}
                      type="button"
                      className={cls}
                      role="radio"
                      aria-checked={selected === i}
                      disabled={checked}
                      onClick={() => setSelected(i)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {!checked ? (
                <button
                  type="button"
                  className="btn btn--primary btn--small"
                  disabled={selected === null}
                  onClick={() => {
                    setChecked(true);
                    if (selected === question.answer) setScore((s) => s + 1);
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <div className="exercise__feedback" role="status">
                  <p
                    className={
                      selected === question.answer
                        ? 'exercise__result--correct'
                        : 'exercise__result--wrong'
                    }
                  >
                    {selected === question.answer ? 'Correct!' : 'Not quite.'}
                  </p>
                  <p className="exercise__explanation">{question.explanation}</p>
                  <button type="button" className="btn btn--primary btn--small" onClick={nextQuestion}>
                    {current + 1 < quiz.length ? 'Next Question →' : 'See Results →'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
