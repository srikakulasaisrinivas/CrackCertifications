import MarkdownText from './MarkdownText';
import '../styles/QuestionCard.css';

export default function QuestionCard({
  question,
  selectedAnswers,
  onSelect,
  isFlagged,
  onToggleFlag,
  showAnswer,
  result, // { correct, correctAnswers, explanation } from server
  onReveal,
  isPractice,
}) {
  if (!question) return null;

  const isMulti = question.type === 'multi';
  const correctAnswers = result?.correctAnswers || [];
  const explanation = result?.explanation || '';

  const handleOptionClick = (label) => {
    if (showAnswer) return;
    if (isMulti) {
      const updated = selectedAnswers.includes(label)
        ? selectedAnswers.filter(a => a !== label)
        : [...selectedAnswers, label];
      onSelect(updated);
    } else {
      onSelect([label]);
    }
  };

  const getOptionClass = (label) => {
    let cls = 'option';
    if (selectedAnswers.includes(label)) cls += ' selected';
    if (showAnswer && correctAnswers.length > 0) {
      if (correctAnswers.includes(label)) cls += ' correct';
      else if (selectedAnswers.includes(label)) cls += ' incorrect';
    }
    return cls;
  };

  const hasAnswered = selectedAnswers.length > 0;

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-type-badge">
          {isMulti ? 'Multi Select' : 'Single Select'}
        </span>
        <button
          className={`flag-btn ${isFlagged ? 'flagged' : ''}`}
          onClick={onToggleFlag}
          title={isFlagged ? 'Unflag question' : 'Flag for review'}
        >
          {isFlagged ? '🚩' : '⚑'}
        </button>
      </div>

      <h3 className="question-text">{question.text}</h3>

      <div className="options-list">
        {question.options.map(opt => (
          <div
            key={opt.label}
            className={getOptionClass(opt.label)}
            onClick={() => handleOptionClick(opt.label)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleOptionClick(opt.label)}
          >
            <span className="option-label">{opt.label}</span>
            <span className="option-text">{opt.text}</span>
          </div>
        ))}
      </div>

      {isPractice && !showAnswer && hasAnswered && onReveal && (
        <button className="btn btn-reveal" onClick={onReveal}>
          Show Answer
        </button>
      )}

      {showAnswer && correctAnswers.length > 0 && (
        <div className="answer-section">
          <div className={`answer-feedback ${result?.correct ? 'answer-correct' : 'answer-incorrect'}`}>
            <strong>{result?.correct ? '✅ Correct!' : '❌ Incorrect'}</strong>
            <span className="correct-labels">
              Correct Answer{correctAnswers.length > 1 ? 's' : ''}: {correctAnswers.join(', ')}
            </span>
          </div>
          {explanation && (
            <div className="explanation">
              <strong>💡 Explanation</strong>
              <MarkdownText text={explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
