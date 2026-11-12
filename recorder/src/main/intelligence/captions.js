'use strict';
// ADR-005: Caption formation — groups words into display captions.
// Rules: max MAX_WORDS per caption, max MAX_DURATION_MS, sentence boundary preference,
// overflow -> new caption (never truncate), no caption exceeds MAX_CHARS.

const MAX_WORDS       = 10;
const MAX_DURATION_MS = 5000;
const MAX_CHARS       = 80;
const MIN_DURATION_MS = 1000; // spec'd minimum cue duration (mob-build-plan.html:521)

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

  // Whisper can emit a zero- or near-zero-duration token (common on short
  // interjections), which produced an unplayable "00:00:03,000 --> 00:00:03,000"
  // cue. Stretch any caption under the spec'd minimum, but never past the next
  // caption's start — that would instead create the overlap this also guards
  // against, which strict SRT/VTT players render as stacked text.
  for (let i = 0; i < captions.length; i++) {
    const cap = captions[i];
    const nextStart = i + 1 < captions.length ? captions[i + 1].start_ms : Infinity;
    if (cap.end_ms - cap.start_ms < MIN_DURATION_MS) {
      cap.end_ms = Math.min(cap.start_ms + MIN_DURATION_MS, nextStart);
    }
    if (cap.end_ms > nextStart) cap.end_ms = nextStart;
    if (cap.end_ms <= cap.start_ms) cap.end_ms = cap.start_ms + 1;
  }

  return captions;
}

module.exports = { formCaptions };
