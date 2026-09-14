import { useState } from 'react';

// Multiple-choice exercise with check, feedback, explanation, and retry.
export default function Exercise({ exercise, heading = 'Exercise' }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const correct = checked && selected === exercise.answer;

  return (
    <div className="exercise card">
      <p className="exercise__heading">{heading}</p>
      <p className="exercise__question">{exercise.question}</p>
      <div className="exercise__options" role="radiogroup" aria-label="Answer options">
        {exercise.options.map((option, i) => {
          let cls = 'exercise__option';
          if (checked && i === exercise.answer) cls += ' exercise__option--correct';
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
          onClick={() => setChecked(true)}
        >
          Check Answer
        </button>
      ) : (
        <div className="exercise__feedback" role="status">
          <p className={correct ? 'exercise__result--correct' : 'exercise__result--wrong'}>
            {correct ? 'Correct! Nice work.' : 'Not quite.'}
          </p>
          <p className="exercise__explanation">{exercise.explanation}</p>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() => {
              setSelected(null);
              setChecked(false);
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
