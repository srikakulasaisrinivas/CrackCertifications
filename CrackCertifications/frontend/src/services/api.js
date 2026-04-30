/**
 * Frontend-only question service.
 * Answers are SHA-256 hashed; explanations are AES-256-CBC encrypted.
 * No backend required — everything runs in the browser.
 */
import { questions as rawQuestions } from '../data/questions.js';
import { verifyAnswer, findCorrectAnswers, decryptExplanation } from './crypto.js';

export function fetchQuestions(randomize = false) {
  // Return questions without answer hashes (just id, type, text, options)
  const safe = rawQuestions.map(q => ({
    id: q.id,
    type: q.type,
    text: q.text,
    options: q.options,
  }));

  if (randomize) {
    for (let i = safe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [safe[i], safe[j]] = [safe[j], safe[i]];
    }
  }

  return Promise.resolve(safe);
}

export async function checkAnswer(questionId, userAnswers) {
  const q = rawQuestions.find(q => q.id === questionId);
  if (!q) return { correct: false, correctAnswers: [], explanation: '' };

  const sorted = [...userAnswers].sort();
  const correct = await verifyAnswer(questionId, sorted, q.answerHash);

  // Find the actual correct answers by checking all combos
  const optionLabels = q.options.map(o => o.label);
  const correctAnswers = await findCorrectAnswers(questionId, optionLabels, q.answerHash, q.type);

  // Decrypt explanation using the correct answer key
  const explanation = await decryptExplanation(q.encryptedExplanation, questionId, correctAnswers);

  return { correct, correctAnswers, explanation };
}

export async function checkAllAnswers(answersMap) {
  const results = [];
  for (const [qIdStr, userAnswers] of Object.entries(answersMap)) {
    const qId = parseInt(qIdStr);
    const result = await checkAnswer(qId, userAnswers);
    results.push({ questionId: qId, ...result });
  }
  return results;
}
