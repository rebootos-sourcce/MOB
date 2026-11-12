'use strict';
// ADR-005: TF-IDF hashtag extraction.
// IDF baseline from a small corpus of common words (treated as background documents).
// Returns top-N tags sorted by TF-IDF score descending.

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','being','have','has','had','do','does',
  'did','will','would','could','should','may','might','shall','can',
  'i','you','he','she','it','we','they','this','that','these','those',
  'my','your','his','her','its','our','their',
  'so','if','as','by','from','up','about','into','through','during',
  'before','after','above','below','between','out','off','over','under',
  'again','then','once','here','there','when','where','why','how','all',
  'both','each','few','more','most','other','some','such','no','nor','not',
  'only','same','than','too','very','just','because','while','although',
  'go','going','get','got','put','say','said','make','made',
  'know','think','want','need','see','come','take','use','um','uh','er','ah',
  'like','right','okay','ok','yeah','yes','no','well','now','also','still'
]);

// Approximate IDF weights: low = common, high = rare/informative
const IDF_OVERRIDES = {
  react: 3.5, typescript: 3.5, javascript: 3.0, python: 3.0,
  api: 2.8, database: 2.8, component: 2.5, function: 2.0,
  performance: 2.5, deploy: 2.5, testing: 2.5, design: 2.0,
  build: 1.8, run: 1.5, work: 1.2, thing: 0.8, stuff: 0.6,
};
const DEFAULT_IDF = 2.0;
const TOP_N       = 7;

/**
 * @param {string} text  full transcript text
 * @returns {Array<{tag:string, score:number}>}
 */
function extractHashtags(text) {
  const rawWords = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const docLen   = rawWords.length || 1;

  const tf = new Map();
  for (const w of rawWords) {
    if (w.length < 2 || STOPWORDS.has(w)) continue; // allows 2-letter terms: ai, ml, ux (the old `< 3` rejected all of them despite the comment claiming otherwise)
    tf.set(w, (tf.get(w) || 0) + 1);
  }

  const scored = [];
  for (const [word, count] of tf) {
    const tfScore  = count / docLen;
    const idf      = IDF_OVERRIDES[word] ?? DEFAULT_IDF;
    const score    = tfScore * idf;
    scored.push({ tag: '#' + word, score }); // raw score — round only for display, after sorting
  }

  // Sorting used to run on an already-rounded score, so a long transcript
  // (large docLen) collapsed most candidates to the same rounded value and
  // ties fell back to Map insertion order — tags became "said earliest"
  // rather than most informative.
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, TOP_N).map(s => ({ tag: s.tag, score: Math.round(s.score * 10000) / 10000 }));
}

module.exports = { extractHashtags };
