'use strict';
// ADR-005: Silence gap detection between transcript words.
// Gaps longer than MIN_SILENCE_MS are returned as removal candidates.

const MIN_SILENCE_MS = 800;
const KEEP_LEAD_MS   = 100; // keep a little natural pause at the start of a gap
const KEEP_TRAIL_MS  = 50;

/**
 * @param {Array<{word:string, start:number, end:number}>} words
 * @param {number} totalDurationMs  total recording length
 * @returns {Array<{start_ms:number, end_ms:number}>}
 */
function detectSilences(words, totalDurationMs) {
  if (!words.length) return [];

  const gaps = [];

  // Leading silence: the gap from the very start of the recording to the
  // first word. The loop below starts at i=1 and only ever looks at gaps
  // BETWEEN words, so this — the single commonest case (hit record, settle
  // in, start talking a few seconds later) — was never detected at all,
  // even though trailing silence (below) was.
  const firstStartMs = Math.round(words[0].start * 1000);
  if (firstStartMs >= MIN_SILENCE_MS) {
    gaps.push({
      start_ms: 0,
      end_ms: Math.max(0, firstStartMs - KEEP_TRAIL_MS)
    });
  }

  for (let i = 1; i < words.length; i++) {
    const gapStartMs = Math.round(words[i - 1].end   * 1000);
    const gapEndMs   = Math.round(words[i].start * 1000);
    const gapMs      = gapEndMs - gapStartMs;

    if (gapMs >= MIN_SILENCE_MS) {
      gaps.push({
        start_ms: Math.max(0, gapStartMs + KEEP_LEAD_MS),
        end_ms:   Math.max(0, gapEndMs   - KEEP_TRAIL_MS)
      });
    }
  }

  // Detect trailing silence after the last word
  if (totalDurationMs > 0) {
    const lastEndMs = Math.round(words[words.length - 1].end * 1000);
    const trailingMs = totalDurationMs - lastEndMs;
    if (trailingMs >= MIN_SILENCE_MS) {
      gaps.push({
        start_ms: lastEndMs + KEEP_LEAD_MS,
        end_ms:   totalDurationMs
      });
    }
  }

  return gaps.filter(g => g.end_ms > g.start_ms);
}

module.exports = { detectSilences };
