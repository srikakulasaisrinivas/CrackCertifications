import { useState } from 'react';
import '../styles/Summary.css';

export default function Summary({ score, questions, answers, results, flagged, onRetake, onReviewFlagged }) {
  const percentage = Math.round((score.correct / score.total) * 100);
  const passed = percentage >= 70;
  const [expandedQ, setExpandedQ] = useState(null);

  const flaggedQuestions = questions
    .map((q, idx) => ({ ...q, index: idx }))
    .filter(q => flagged.has(q.id));

  return (
    <div className="summary">
      <div className={`summary-header ${passed ? 'passed' : 'failed'}`}>
        <h2>{passed ? '🎉 Congratulations!' : '📖 Keep Studying!'}</h2>
        <p className="summary-subtitle">
          {passed
            ? 'You passed the practice exam!'
            : 'You did not reach the passing score. Review and try again!'}
        </p>
      </div>

      <div className="score-cards">
        <div className="score-card">
          <span className="score-value">{percentage}%</span>
          <span className="score-label">Score</span>
        </div>
        <div className="score-card">
          <span className="score-value">{score.correct}</span>
          <span className="score-label">Correct</span>
        </div>
        <div className="score-card">
          <span className="score-value">{score.incorrect}</span>
          <span className="score-label">Incorrect</span>
        </div>
        <div className="score-card">
          <span className="score-value">{score.total - score.attempted}</span>
          <span className="score-label">Unanswered</span>
        </div>
      </div>

      {flaggedQuestions.length > 0 && (
        <div className="flagged-section">
          <h3>🚩 Flagged Questions ({flaggedQuestions.length})</h3>
          <div className="flagged-list">
            {flaggedQuestions.map(q => (
              <button
                key={q.id}
                className="flagged-item"
                onClick={() => onReviewFlagged(q.index)}
              >
                <span>Q{q.index + 1}</span>
                <span className="flagged-preview">{q.text.substring(0, 60)}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="summary-details">
        <h3>📋 All Questions — Click to expand explanation</h3>
        <div className="detail-list">
          {questions.map((q, idx) => {
            const userAns = answers[q.id] || [];
            const result = results[q.id];
            const isCorrect = result?.correct || false;
            const wasAnswered = userAns.length > 0;
            const correctAns = result?.correctAnswers || [];
            const explanation = result?.explanation || '';
            const isExpanded = expandedQ === q.id;

            return (
              <div key={q.id}>
                <div
                  className={`detail-item ${wasAnswered ? (isCorrect ? 'correct' : 'wrong') : 'skipped'}`}
                  onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="detail-num">Q{idx + 1}</span>
                  <span className="detail-status">
                    {wasAnswered ? (isCorrect ? '✅' : '❌') : '⬜'}
                  </span>
                  <span className="detail-text">{q.text.substring(0, 80)}...</span>
                  <span className="detail-answer">
                    Your: {userAns.join(', ') || '—'} | Correct: {correctAns.join(', ')}
                  </span>
                </div>
                {isExpanded && explanation && (
                  <div className="detail-explanation">
                    <strong>💡 Explanation</strong>
                    <p>{explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary-actions">
        <button className="btn btn-primary btn-lg" onClick={onRetake}>
          🔄 Retake Exam
        </button>
      </div>
    </div>
  );
}
