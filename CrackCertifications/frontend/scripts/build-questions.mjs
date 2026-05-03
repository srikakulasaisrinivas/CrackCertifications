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
const MD_PATH = join(ROOT, '..', 'questions.md');
const MD_EXPLANATIONS_PATH = join(ROOT, '..', 'question_new.md');
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

// --- Parse questions.md (main source) ---

let content = readFileSync(MD_PATH, 'utf8').replace(/\r\n/g, '\n');
const blocks = content.split(/\n---\n/).filter(b => /## Q\d+/.test(b));

// --- Parse question_new.md for explanations ---
let explanationMap = {};
try {
  const expContent = readFileSync(MD_EXPLANATIONS_PATH, 'utf8').replace(/\r\n/g, '\n');
  const expBlocks = expContent.split(/\n---\n/).filter(b => /## Q\d+/.test(b));
  expBlocks.forEach(block => {
    const idMatch = block.match(/## Q(\d+)/);
    if (!idMatch) return;
    const id = parseInt(idMatch[1]);
    const lines = block.split('\n');
    const expIdx = lines.findIndex(l => l.startsWith('**Explanation'));
    if (expIdx >= 0) {
      // Collect all lines after **Explanation:** until end of block
      const expLines = [];
      for (let i = expIdx + 1; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l === '' && expLines.length === 0) continue; // skip leading blanks
        expLines.push(lines[i]);
      }
      explanationMap[id] = expLines.join('\n').trim();
    }
  });
  console.log(`📖 Loaded explanations for ${Object.keys(explanationMap).length} questions from question_new.md`);
} catch (e) {
  console.warn('⚠️ Could not read question_new.md for explanations:', e.message);
}

const questions = blocks.map(block => {
  const lines = block.split('\n');
  const id = parseInt(block.match(/## Q(\d+)/)[1]);

  // In questions.md, the question text is on a separate line after **Type:** line
  // Find the question text: first non-empty line after **Type:** that isn't an option or answer
  const typeLineIdx = lines.findIndex(l => l.startsWith('**Type:**'));
  let textLine = '';
  if (typeLineIdx >= 0) {
    // The question text is the next non-empty line(s) before options start
    const textLines = [];
    for (let i = typeLineIdx + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l === '') continue;
      if (l.startsWith('- ') || l.startsWith('**Answer')) break;
      textLines.push(l);
    }
    textLine = textLines.join(' ').trim();
  } else {
    // Fallback: old format with text in heading
    textLine = lines.find(l => l.startsWith('## Q')).replace(/^## Q\d+\.\s*/, '').trim();
  }

  const typeMatch = block.match(/\*\*Type:\*\*\s*(.*)/);
  const type = typeMatch && /multi/i.test(typeMatch[1]) ? 'multi' : 'single';

  const options = [];
  lines.forEach(l => {
    const m = l.match(/^- ([A-E])\.\s+(.+?)(\s*✅)?$/);
    if (m) options.push({ label: m[1], text: m[2].replace(/\s*✅$/, '').trim() });
  });

  const ansMatch = block.match(/\*\*Answer:?\*?\*?\s*:?\s*([A-E](?:,\s*[A-E])*)/);
  const correctAnswers = ansMatch ? ansMatch[1].split(',').map(s => s.trim()).sort() : [];

  const expIdx = lines.findIndex(l => l.startsWith('**Explanation:**'));
  let explanation = '';
  if (expIdx >= 0) {
    explanation = lines.slice(expIdx + 1).join(' ').replace(/\s+/g, ' ').trim();
  }
  // Fallback: use explanation from question_new.md
  if (!explanation && explanationMap[id]) {
    explanation = explanationMap[id].replace(/\s+/g, ' ').trim();
  }
  // Auto-generate fallback if still empty
  if (!explanation && correctAnswers.length > 0) {
    const correctOptionTexts = correctAnswers.map(label => {
      const opt = options.find(o => o.label === label);
      return opt ? `${label}. ${opt.text}` : label;
    });
    explanation = `The correct answer${correctAnswers.length > 1 ? 's are' : ' is'} ${correctOptionTexts.join(' and ')}. ` +
      `This is the most accurate choice based on the GitHub Copilot certification (GH-300) exam objectives.`;
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

// Also generate backend questions.json (with plain answers for server-side use)
const BACKEND_JSON_PATH = join(ROOT, '..', 'backend', 'src', 'main', 'resources', 'questions.json');
const BACKEND_TARGET_JSON = join(ROOT, '..', 'backend', 'target', 'classes', 'questions.json');
const backendQuestions = blocks.map(block => {
  const lines = block.split('\n');
  const id = parseInt(block.match(/## Q(\d+)/)[1]);

  const typeLineIdx = lines.findIndex(l => l.startsWith('**Type:**'));
  let text = '';
  if (typeLineIdx >= 0) {
    const textLines = [];
    for (let i = typeLineIdx + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l === '') continue;
      if (l.startsWith('- ') || l.startsWith('**Answer')) break;
      textLines.push(l);
    }
    text = textLines.join(' ').trim();
  }

  const typeMatch = block.match(/\*\*Type:\*\*\s*(.*)/);
  const type = typeMatch && /multi/i.test(typeMatch[1]) ? 'multi' : 'single';

  const options = [];
  lines.forEach(l => {
    const m = l.match(/^- ([A-E])\.\s+(.+?)(\s*✅)?$/);
    if (m) options.push({ label: m[1], text: m[2].replace(/\s*✅$/, '').trim() });
  });

  const ansMatch = block.match(/\*\*Answer:?\*?\*?\s*:?\s*([A-E](?:,\s*[A-E])*)/);
  const correctAnswers = ansMatch ? ansMatch[1].split(',').map(s => s.trim()).sort() : [];

  const expIdx = lines.findIndex(l => l.startsWith('**Explanation:**'));
  let explanation = '';
  if (expIdx >= 0) {
    explanation = lines.slice(expIdx + 1).join(' ').replace(/\s+/g, ' ').trim();
  }
  if (!explanation && explanationMap[id]) {
    explanation = explanationMap[id].replace(/\s+/g, ' ').trim();
  }
  if (!explanation && correctAnswers.length > 0) {
    const correctOptionTexts = correctAnswers.map(label => {
      const opt = options.find(o => o.label === label);
      return opt ? `${label}. ${opt.text}` : label;
    });
    explanation = `The correct answer${correctAnswers.length > 1 ? 's are' : ' is'} ${correctOptionTexts.join(' and ')}. ` +
      `This is the most accurate choice based on the GitHub Copilot certification (GH-300) exam objectives.`;
  }

  return { id, type, text, options, correctAnswers, explanation };
});

writeFileSync(BACKEND_JSON_PATH, JSON.stringify(backendQuestions, null, 2), 'utf8');
try { writeFileSync(BACKEND_TARGET_JSON, JSON.stringify(backendQuestions, null, 2), 'utf8'); } catch(e) {}

console.log(`✅ Generated ${questions.length} questions → ${OUT_PATH}`);
console.log(`✅ Generated ${backendQuestions.length} questions → ${BACKEND_JSON_PATH}`);

