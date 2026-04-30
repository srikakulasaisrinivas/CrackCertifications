import '../styles/QuestionNav.css';

export default function QuestionNav({ questions, currentIndex, answers, flagged, onGoTo }) {
  return (
    <div className="question-nav">
      <h4>Questions</h4>
      <div className="nav-grid">
        {questions.map((q, idx) => {
          let cls = 'nav-item';
          if (idx === currentIndex) cls += ' active';
          if (answers[q.id] && answers[q.id].length > 0) cls += ' answered';
          if (flagged.has(q.id)) cls += ' flagged';
          return (
            <button
              key={q.id}
              className={cls}
              onClick={() => onGoTo(idx)}
              title={`Question ${idx + 1}${flagged.has(q.id) ? ' (flagged)' : ''}`}
            >
              {idx + 1}
              {flagged.has(q.id) && <span className="flag-dot">🚩</span>}
            </button>
          );
        })}
      </div>
      <div className="nav-legend">
        <span><span className="dot answered"></span> Answered</span>
        <span><span className="dot active"></span> Current</span>
        <span><span className="dot flagged"></span> Flagged</span>
      </div>
    </div>
  );
}

