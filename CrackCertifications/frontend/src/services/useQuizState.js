import { useState, useCallback } from 'react';

export function useQuizState(questions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex] || null;

  const selectAnswer = useCallback((questionId, selected) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: selected }));
  }, [submitted]);

  const toggleFlag = useCallback((questionId) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const revealAnswer = useCallback((questionId) => {
    setRevealed(prev => new Set(prev).add(questionId));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const submitExam = useCallback(() => {
    setSubmitted(true);
  }, []);

  const getScore = useCallback((serverResults = {}) => {
    let correct = 0;
    let attempted = 0;
    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns && userAns.length > 0) {
        attempted++;
        const result = serverResults[q.id];
        if (result && result.correct) correct++;
      }
    });
    return { correct, attempted, total: questions.length, incorrect: attempted - correct };
  }, [questions, answers]);

  return {
    currentIndex,
    currentQuestion,
    answers,
    flagged,
    revealed,
    submitted,
    selectAnswer,
    toggleFlag,
    revealAnswer,
    goNext,
    goPrev,
    goTo,
    submitExam,
    getScore,
  };
}


