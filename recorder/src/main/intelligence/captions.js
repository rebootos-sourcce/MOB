'use strict';
// ADR-005: Caption formation — groups words into display captions.
// Rules: max MAX_WORDS per caption, max MAX_DURATION_MS, sentence boundary preference,
// overflow -> new caption (never truncate), no caption exceeds MAX_CHARS.

const MAX_WORDS       = 10;
const MAX_DURATION_MS = 5000;
const MAX_CHARS       = 80;

/**
 * @param {Array<{word:string, start:number, end:number}>} words
 * @returns {Array<{text:string, start_ms:number, end_ms:number}>}
 */
function formCaptions(words) {
  if (!words.length) return [];

  const captions = [];
  let group = [];

  function flush() {
    if (!group.length) return;
    captions.push({
      text:     group.map(w => w.word).join(' ').trim(),
      start_ms: Math.round(group[0].start * 1000),
      end_ms:   Math.round(group[group.length - 1].end * 1000)
    });
    group = [];
  }

  for (const w of words) {
    const candidateText = [...group, w].map(x => x.word).join(' ').trim();
    const durationMs = group.length
      ? Math.round(w.end * 1000) - Math.round(group[0].start * 1000)
      : 0;

    const overWords    = group.length >= MAX_WORDS;
    const overDuration = group.length && durationMs > MAX_DURATION_MS;
    const overChars    = candidateText.length > MAX_CHARS;

    if (overWords || overDuration || overChars) {
      flush();
    }

    // Fix #22: a single token that still exceeds MAX_CHARS gets truncated so the
    // caption never violates the display limit regardless of input.
    const wordToAdd = overChars && !group.length
      ? { ...w, word: w.word.slice(0, MAX_CHARS) }
      : w;
    group.push(wordToAdd);

    // Sentence boundary: flush after terminal punctuation
    const last = w.word.trim();
    if (/[.!?]$/.test(last)) flush();
  }

  flush();
  return captions;
}

module.exports = { formCaptions };
