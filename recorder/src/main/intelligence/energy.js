'use strict';
// Energy scoring: estimate segment "importance" from word density and unique vocabulary.
// Used for chapter boundary detection and production package highlights.

/**
 * Score a time window by word density and vocabulary richness.
 * @param {Array<{word:string,start:number,end:number}>} words  all transcript words
 * @param {number} windowStartMs
 * @param {number} windowEndMs
 * @returns {number} 0-1 energy score
 */
function scoreWindow(words, windowStartMs, windowEndMs) {
  const windowMs = windowEndMs - windowStartMs;
  if (windowMs <= 0) return 0;

  const inWindow = words.filter(w => {
    const ms = w.start * 1000;
    return ms >= windowStartMs && ms < windowEndMs;
  });

  if (!inWindow.length) return 0;

  // Word density: words per second (normalized, capped at 4 wps = 1.0)
  const wps = (inWindow.length / (windowMs / 1000));
  const densityScore = Math.min(1, wps / 4);

  // Vocabulary richness: unique words / total words (type-token ratio)
  const unique = new Set(inWindow.map(w => w.word.toLowerCase().replace(/[^a-z]/g, ''))).size;
  const ttr = unique / inWindow.length;

  return Math.round((densityScore * 0.6 + ttr * 0.4) * 1000) / 1000;
}

/**
 * Detect chapter boundaries by finding low-energy valleys between high-energy peaks.
 * @param {Array<{word:string,start:number,end:number}>} words
 * @param {number} totalDurationMs
 * @param {number} windowMs   sliding window size (default 30s)
 * @returns {Array<{start_ms:number,title:string,score:number}>}
 */
function detectChapters(words, totalDurationMs, windowMs = 30000) {
  if (totalDurationMs < windowMs * 2) {
    return [{ start_ms: 0, title: 'Introduction', score: 1.0 }];
  }

  const step = windowMs / 2;
  const scores = [];

  for (let t = 0; t < totalDurationMs - windowMs; t += step) {
    scores.push({ t, score: scoreWindow(words, t, t + windowMs) });
  }

  // Find valleys (local minima below avg) as chapter boundaries
  const avg = scores.reduce((s, x) => s + x.score, 0) / (scores.length || 1);
  const boundaries = [0];

  for (let i = 1; i < scores.length - 1; i++) {
    const prev = scores[i - 1].score;
    const curr = scores[i].score;
    const next = scores[i + 1].score;
    if (curr < prev && curr < next && curr < avg * 0.8) {
      const ms = Math.round(scores[i].t);
      if (ms - boundaries[boundaries.length - 1] >= 60000) { // min 1 min between chapters
        boundaries.push(ms);
      }
    }
  }

  return boundaries.map((ms, idx) => ({
    start_ms: ms,
    title: idx === 0 ? 'Introduction' : `Part ${idx + 1}`,
    score: scoreWindow(words, ms, ms + windowMs)
  }));
}

module.exports = { scoreWindow, detectChapters };
