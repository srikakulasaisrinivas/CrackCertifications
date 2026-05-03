import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions, checkAnswer, checkAllAnswers } from '../services/api';
import { useQuizState } from '../services/useQuizState';
import QuestionCard from './QuestionCard';
import QuestionNav from './QuestionNav';
import Timer from './Timer';
import Summary from './Summary';
import '../styles/Quiz.css';

export default function Quiz() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const isPractice = mode === 'practice';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [results, setResults] = useState({});
  const [paused, setPaused] = useState(false);

  const quiz = useQuizState(questions);

  useEffect(() => {
    fetchQuestions(true)
      .then(data => {
        const limited = isPractice ? data : data.slice(0, 60);
        setQuestions(limited);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleReveal = async (questionId) => {
    const userAnswers = quiz.answers[questionId] || [];
    try {
      const result = await checkAnswer(questionId, userAnswers);
      setResults(prev => ({ ...prev, [questionId]: result }));
      quiz.revealAnswer(questionId);
    } catch {
      quiz.revealAnswer(questionId);
    }
  };

  const handleSubmit = async () => {
    quiz.submitExam();
    try {
      const answersMap = {};
      questions.forEach(q => {
        answersMap[q.id] = quiz.answers[q.id] || [];
      });
      const allResults = await checkAllAnswers(answersMap);
      const resultsById = {};
      allResults.forEach(r => {
        resultsById[r.questionId] = r;
      });
      setResults(resultsById);
    } catch {
      // If backend fails, summary still shows without explanations
    }
    setShowSummary(true);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleRetake = () => {
    navigate(0);
  };

  if (loading) return <div className="quiz-loading">Loading questions...</div>;
  if (error) return <div className="quiz-error">Error: {error}</div>;
  if (questions.length === 0) return <div className="quiz-error">No questions available</div>;

  if (showSummary) {
    return (
      <Summary
        score={quiz.getScore(results)}
        questions={questions}
        answers={quiz.answers}
        results={results}
        flagged={quiz.flagged}
        onRetake={handleRetake}
        onReviewFlagged={(idx) => {
          setShowSummary(false);
          quiz.goTo(idx);
        }}
      />
    );
  }

  // Pause overlay
  if (paused) {
    return (
      <div className="quiz-paused-overlay">
        <div className="quiz-paused-card">
          <h2>⏸️ Exam Paused</h2>
          <p>Take a breather. Your progress is saved.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setPaused(false)}>
            ▶️ Resume Exam
          </button>
        </div>
      </div>
    );
  }

  const currentResult = results[quiz.currentQuestion?.id];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{isPractice ? '📝 Practice Mode' : '⏱️ Exam Mode'} — GH300</h2>
        <div className="quiz-header-right">
          {!isPractice && !quiz.submitted && (
            <>
              <button className="btn btn-outline btn-pause" onClick={() => setPaused(true)}>
                ⏸️ Pause
              </button>
              <Timer duration={100 * 60} onTimeUp={handleTimeUp} paused={paused} />
            </>
          )}
          <span className="question-counter">
            {quiz.currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="quiz-body">
        <QuestionNav
          questions={questions}
          currentIndex={quiz.currentIndex}
          answers={quiz.answers}
          flagged={quiz.flagged}
          onGoTo={quiz.goTo}
        />

        <div className="quiz-main">
          <QuestionCard
            question={quiz.currentQuestion}
            selectedAnswers={quiz.answers[quiz.currentQuestion?.id] || []}
            onSelect={(selected) => quiz.selectAnswer(quiz.currentQuestion.id, selected)}
            isFlagged={quiz.flagged.has(quiz.currentQuestion?.id)}
            onToggleFlag={() => quiz.toggleFlag(quiz.currentQuestion.id)}
            showAnswer={
              isPractice
                ? quiz.revealed.has(quiz.currentQuestion?.id)
                : quiz.submitted
            }
            result={currentResult}
            onReveal={isPractice ? () => handleReveal(quiz.currentQuestion.id) : undefined}
            isPractice={isPractice}
          />

          <div className="quiz-nav-buttons">
            <button
              className="btn btn-outline"
              onClick={quiz.goPrev}
              disabled={quiz.currentIndex === 0}
            >
              ← Previous
            </button>

            {quiz.currentIndex < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={quiz.goNext}>
                Next →
              </button>
            ) : (
              <button className="btn btn-submit" onClick={handleSubmit}>
                {isPractice ? 'Finish & View Results' : 'Submit Exam'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
