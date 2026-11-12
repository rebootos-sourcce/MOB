'use strict';
// ADR-005: Filler word detection with corrected pre-pad placement.
// Returns array of {start_ms, end_ms} silence/filler segments to remove.

// Whisper emits individual words, so only single-token fillers match.
// Trimmed to actual filler sounds per spec (docs/mob-build-plan.html:437).
// The previous list included ordinary words — like, basically, literally,
// actually, so, well, right — that are real speech far more often than
// they're fillers ("turn right", "that's right", "went well", comparative
// "like"), and combined with the padding below were cutting real words.
// 'uhhuh' is 'uh-huh' after the hyphen-stripping normalization below.
const FILLERS = new Set([
  'um', 'uh', 'er', 'ah', 'hmm', 'uhh', 'umm', 'mhm', 'uhhuh'
]);

const PRE_PAD_MS  = 150; // pad BEFORE the filler (corrected from post-pad bug in prior design)
const POST_PAD_MS = 50;

/**
 * @param {Array<{word:string, start:number, end:number}>} words  transcript word objects
 * @returns {Array<{start_ms:number, end_ms:number}>}  segments to remove (pre-merged overlaps)
 */
function detectFillers(words) {
  const raw = [];

  for (const w of words) {
    const text = w.word.toLowerCase().replace(/[^a-z ]/g, '').trim();
    if (FILLERS.has(text)) {
      const startMs = Math.max(0, Math.round(w.start * 1000) - PRE_PAD_MS);
      const endMs   = Math.round(w.end   * 1000) + POST_PAD_MS;
      raw.push({ start_ms: startMs, end_ms: endMs });
    }
  }

  return mergeOverlaps(raw);
}

function mergeOverlaps(segs) {
  if (!segs.length) return [];
  segs.sort((a, b) => a.start_ms - b.start_ms);
  const out = [{ ...segs[0] }];
  for (let i = 1; i < segs.length; i++) {
    const last = out[out.length - 1];
    if (segs[i].start_ms <= last.end_ms) {
      last.end_ms = Math.max(last.end_ms, segs[i].end_ms);
    } else {
      out.push({ ...segs[i] });
    }
  }
  return out;
}

module.exports = { detectFillers };
