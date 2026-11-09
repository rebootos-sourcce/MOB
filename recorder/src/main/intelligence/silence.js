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

  return gaps.filter(g => g.end_ms > g.start_ms);
}

module.exports = { detectSilences };
