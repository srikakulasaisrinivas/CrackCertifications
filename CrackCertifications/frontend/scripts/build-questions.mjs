/**
 * Build script: Reads question_new.md and generates src/data/questions.js
 * with hashed answers and encrypted explanations.
 *
 * Run: node scripts/build-questions.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MD_PATH = join(ROOT, '..', 'question_new.md');
const OUT_PATH = join(ROOT, 'src', 'data', 'questions.js');

// --- Crypto helpers (same logic used in the browser at runtime) ---

function hashAnswer(questionId, sortedAnswers) {
  const raw = `q${questionId}:${sortedAnswers.join(',')}`;
  return createHash('sha256').update(raw).digest('hex');
}

function encrypt(plaintext, key) {
  // AES-256-CBC; key is SHA-256 of the key string, IV is random
  const keyHash = createHash('sha256').update(key).digest();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', keyHash, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

// --- Parse question_new.md ---

let content = readFileSync(MD_PATH, 'utf8').replace(/\r\n/g, '\n');
const blocks = content.split(/\n---\n/).filter(b => /## Q\d+/.test(b));

const questions = blocks.map(block => {
  const lines = block.split('\n');
  const id = parseInt(block.match(/## Q(\d+)/)[1]);
  const textLine = lines.find(l => l.startsWith('## Q')).replace(/^## Q\d+\.\s*/, '').trim();
  const typeMatch = textLine.match(/Choose (two|three)/i);
  const type = typeMatch ? 'multi' : 'single';

  const options = [];
  lines.forEach(l => {
    const m = l.match(/^- ([A-E])\. (.+?)(\s*✅)?$/);
    if (m) options.push({ label: m[1], text: m[2].replace(/\s*✅$/, '').trim() });
  });

  const ansMatch = block.match(/\*\*Answer:\s*([A-E](?:,\s*[A-E])*)\*\*/);
  const correctAnswers = ansMatch ? ansMatch[1].split(',').map(s => s.trim()).sort() : [];

  const expIdx = lines.findIndex(l => l.startsWith('**Explanation:**'));
  let explanation = '';
  if (expIdx >= 0) {
    explanation = lines.slice(expIdx + 1).join(' ').replace(/\s+/g, ' ').trim();
  }

  // Hash the correct answers
  const answerHash = hashAnswer(id, correctAnswers);

  // Encrypt explanation with the answer key (e.g., "B" or "A,B")
  const answerKey = `q${id}:${correctAnswers.join(',')}`;
  const encryptedExplanation = encrypt(explanation, answerKey);

  return {
    id,
    type,
    text: textLine,
    options,
    answerHash,                // SHA-256 of "q{id}:{sorted answers}"
    encryptedExplanation,      // AES-256-CBC encrypted with answer key
    // NOT included: correctAnswers, explanation (plain text)
  };
});

// --- Write output ---

mkdirSync(join(ROOT, 'src', 'data'), { recursive: true });

const output = `// AUTO-GENERATED — do not edit. Run: node scripts/build-questions.mjs
// Answers are SHA-256 hashed. Explanations are AES-256-CBC encrypted.
export const questions = ${JSON.stringify(questions, null, 2)};
`;

writeFileSync(OUT_PATH, output, 'utf8');
console.log(`✅ Generated ${questions.length} questions → ${OUT_PATH}`);
console.log(`   Sample Q1 hash: ${questions[0].answerHash.substring(0, 16)}...`);
console.log(`   Sample Q1 encrypted explanation: ${questions[0].encryptedExplanation.substring(0, 40)}...`);

