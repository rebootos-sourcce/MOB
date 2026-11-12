'use strict';
// ADR-005: TF-IDF hashtag extraction.
//
// #53: IDF used to come from IDF_OVERRIDES, a small hardcoded per-word
// table with no corpus pass at all — every recording scored "react" at
// exactly 3.5 regardless of how common or rare it actually is across this
// user's own library. idf_score was then written as the TF score passed
// twice (transcription.js), so the column was non-zero but substantively
// fake: two recordings on the same topic could never actually produce
// different hashtags for a real reason, because nothing was reading real
// document frequency.
//
// Real IDF needs a corpus — every OTHER transcript's text — which only the
// caller (transcription.js) has loaded. buildCorpusStats() turns that into
// a document-frequency map once per extraction; extractHashtags() takes it
// as an optional second argument and returns real per-tag idf alongside
// score, so callers can store both as what they actually are instead of
// the same number twice. With no corpus (the very first transcript ever,
// or a direct call like the unit tests), idf is a neutral 1.0 for every
// word — i.e. plain TF ranking, which is the honest behavior when there is
// nothing yet to compare against.

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

const TOP_N = 15; // pool size — enough for the largest per-platform set (YouTube: 15)
const BIGRAM_MIN_COUNT = 2; // a two-word phrase must repeat to count as a real compound term, not coincidence

function tokenize(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

function isContentWord(w) {
  return w.length >= 2 && !STOPWORDS.has(w);
}

/**
 * Builds a document-frequency map from a corpus of OTHER documents' full
 * text, for the `corpus` argument to extractHashtags().
 * @param {string[]} otherDocsFullText
 * @returns {{docFreq: Map<string,number>, totalDocs: number}}
 */
function buildCorpusStats(otherDocsFullText) {
  const docFreq = new Map();
  for (const text of otherDocsFullText) {
    const seen = new Set(tokenize(text).filter(isContentWord));
    for (const w of seen) docFreq.set(w, (docFreq.get(w) || 0) + 1);
  }
  return { docFreq, totalDocs: otherDocsFullText.length };
}

// Smoothed IDF (same shape as scikit-learn's TfidfVectorizer default):
// log((N+1)/(df+1)) + 1. Always >= 1, so a word in every other document in
// the corpus still contributes (minimum weight) rather than being zeroed
// out, and a word unique to this document gets the maximum weight.
function idfFor(word, corpus) {
  if (!corpus || corpus.totalDocs === 0) return 1;
  const df = corpus.docFreq.get(word) || 0;
  return Math.log((corpus.totalDocs + 1) / (df + 1)) + 1;
}

/**
 * @param {string} text  full transcript text
 * @param {{docFreq:Map<string,number>, totalDocs:number}} [corpus]  from buildCorpusStats() over OTHER documents
 * @returns {Array<{tag:string, score:number, idf:number}>}  up to TOP_N, sorted by score descending
 */
function extractHashtags(text, corpus) {
  const rawWords = tokenize(text);
  const docLen = rawWords.length || 1;

  const tf = new Map();
  for (const w of rawWords) {
    if (!isContentWord(w)) continue; // allows 2-letter terms: ai, ml, ux
    tf.set(w, (tf.get(w) || 0) + 1);
  }

  const scored = [];
  for (const [word, count] of tf) {
    const tfScore = count / docLen;
    const idf = idfFor(word, corpus);
    scored.push({ tag: '#' + word, score: tfScore * idf, idf });
  }

  // Bigram compound tags (build-plan:589-597): adjacent content-word pairs
  // that repeat within this document — "machine learning" said twice is a
  // real recurring term, not two independently-scored unigrams colliding.
  const bigramCounts = new Map();
  for (let i = 0; i < rawWords.length - 1; i++) {
    const a = rawWords[i], b = rawWords[i + 1];
    if (!isContentWord(a) || !isContentWord(b)) continue;
    const key = a + ' ' + b;
    bigramCounts.set(key, (bigramCounts.get(key) || 0) + 1);
  }
  for (const [phrase, count] of bigramCounts) {
    if (count < BIGRAM_MIN_COUNT) continue;
    const [a, b] = phrase.split(' ');
    const tfScore = count / docLen;
    const idf = (idfFor(a, corpus) + idfFor(b, corpus)) / 2;
    // A repeated two-word phrase is a stronger signal than either word
    // scored alone — small boost keeps a genuine compound term from
    // losing to a merely-frequent single word with similar raw tf*idf.
    scored.push({ tag: '#' + phrase.replace(/\s+/g, ''), score: tfScore * idf * 1.5, idf });
  }

  // Sorting on raw (unrounded) score — see the git history for why: a long
  // transcript's large docLen used to collapse most candidates to the same
  // rounded value, and ties fell back to Map insertion order ("said
  // earliest" rather than "most informative").
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, TOP_N).map(s => ({
    tag: s.tag,
    score: Math.round(s.score * 10000) / 10000,
    idf: Math.round(s.idf * 10000) / 10000,
  }));
}

module.exports = { extractHashtags, buildCorpusStats };
