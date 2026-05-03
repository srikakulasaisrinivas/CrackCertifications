/**
 * Browser-side crypto utilities for verifying answers and decrypting explanations.
 * Uses the Web Crypto API (built into all modern browsers).
 */

// SHA-256 hash of "q{id}:{sorted,answers}"
export async function hashAnswer(questionId, sortedAnswers) {
  const raw = `q${questionId}:${sortedAnswers.join(',')}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify user's answer against stored hash
export async function verifyAnswer(questionId, userAnswers, storedHash) {
  const sorted = [...userAnswers].sort();
  const hash = await hashAnswer(questionId, sorted);
  return hash === storedHash;
}

// Decrypt AES-256-CBC encrypted explanation
export async function decryptExplanation(encryptedStr, questionId, correctAnswers) {
  try {
    const keyStr = `q${questionId}:${correctAnswers.join(',')}`;

    // Derive 256-bit key via SHA-256 of keyStr
    const keyData = new TextEncoder().encode(keyStr);
    const keyHash = await crypto.subtle.digest('SHA-256', keyData);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyHash, { name: 'AES-CBC' }, false, ['decrypt']
    );

    // Parse IV and ciphertext from "base64iv:base64ciphertext"
    const [ivB64, cipherB64] = encryptedStr.split(':');
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv }, cryptoKey, ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

// Brute-force the correct answers for a question (used after exam submission)
// Tries all possible option combinations against the stored hash
export async function findCorrectAnswers(questionId, optionLabels, storedHash, type) {
  if (type === 'single') {
    for (const label of optionLabels) {
      const hash = await hashAnswer(questionId, [label]);
      if (hash === storedHash) return [label];
    }
  } else {
    // Multi-select: try combinations of 2, 3, and 4
    for (let size = 2; size <= Math.min(4, optionLabels.length); size++) {
      const combos = getCombinations(optionLabels, size);
      for (const combo of combos) {
        const hash = await hashAnswer(questionId, combo.sort());
        if (hash === storedHash) return combo.sort();
      }
    }
  }
  return [];
}

function getCombinations(arr, size) {
  if (size === 1) return arr.map(x => [x]);
  const result = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const rest = getCombinations(arr.slice(i + 1), size - 1);
    rest.forEach(combo => result.push([arr[i], ...combo]));
  }
  return result;
}

