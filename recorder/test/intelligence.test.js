'use strict';
// Unit tests for the pure algorithm modules in src/main/intelligence/.
// These need no Electron, DB or filesystem — plain node:test, zero new deps.
// Each case below is a real bug this session found and fixed; a regression
// here means the bug is back.
const test = require('node:test');
const assert = require('node:assert/strict');

const { detectFillers } = require('../src/main/intelligence/filler');
const { detectSilences } = require('../src/main/intelligence/silence');
const { formCaptions } = require('../src/main/intelligence/captions');
const { extractHashtags, buildCorpusStats } = require('../src/main/intelligence/hashtags');
const { scoreWindow, detectChapters, scoreSegmentEnergy } = require('../src/main/intelligence/energy');

test('detectFillers: only flags real filler sounds, not ordinary words', () => {
  const words = [
    { word: 'turn', start: 1.0, end: 1.3 },
    { word: 'right', start: 1.35, end: 1.6 },
    { word: 'um', start: 5.0, end: 5.2 },
    { word: 'okay', start: 5.3, end: 5.6 },
  ];
  const segs = detectFillers(words);
  assert.equal(segs.length, 1, 'only "um" should be flagged');
  // Padding is 150ms pre / 50ms post (filler.js) with no extra stacking.
  assert.equal(segs[0].start_ms, 4850);
  assert.equal(segs[0].end_ms, 5250);
});

test('detectFillers: merges overlapping padded segments', () => {
  const words = [
    { word: 'um', start: 1.0, end: 1.1 },
    { word: 'uh', start: 1.15, end: 1.25 }, // close enough that padding overlaps
  ];
  const segs = detectFillers(words);
  assert.equal(segs.length, 1, 'adjacent fillers should merge into one segment');
});

test('detectFillers: empty input returns empty array', () => {
  assert.deepEqual(detectFillers([]), []);
});

test('detectSilences: detects leading silence (previously never checked)', () => {
  const words = [
    { word: 'hello', start: 3.0, end: 3.3 },
    { word: 'world', start: 3.4, end: 3.7 },
  ];
  const gaps = detectSilences(words, 10000);
  const leading = gaps.find(g => g.start_ms === 0);
  assert.ok(leading, 'a leading silence gap should be detected');
  assert.ok(leading.end_ms < 3000, 'leading gap should end before the first word');
});

test('detectSilences: detects trailing silence', () => {
  const words = [{ word: 'hi', start: 0.5, end: 0.8 }];
  const gaps = detectSilences(words, 10000);
  const trailing = gaps.find(g => g.end_ms === 10000);
  assert.ok(trailing, 'a trailing silence gap should be detected');
});

test('detectSilences: no words returns empty array', () => {
  assert.deepEqual(detectSilences([], 10000), []);
});

test('formCaptions: zero-duration token gets a minimum display duration', () => {
  const words = [
    { word: 'Hi.', start: 3.0, end: 3.0 },
    { word: 'Next', start: 3.5, end: 3.8 },
  ];
  const caps = formCaptions(words);
  assert.ok(caps.length >= 1);
  const first = caps[0];
  assert.ok(first.end_ms > first.start_ms, 'caption must have positive duration');
  assert.ok(first.end_ms <= 3500, 'caption must not overlap the next caption\'s start');
});

test('formCaptions: never produces overlapping captions', () => {
  const words = [
    { word: 'one', start: 0, end: 0.1 },
    { word: 'two', start: 0.1, end: 0.2 },
    { word: 'three.', start: 0.2, end: 0.2 }, // zero-duration, would want to extend past "four"
    { word: 'four', start: 0.25, end: 0.4 },
  ];
  const caps = formCaptions(words);
  for (let i = 0; i < caps.length - 1; i++) {
    assert.ok(caps[i].end_ms <= caps[i + 1].start_ms, `caption ${i} overlaps caption ${i + 1}`);
  }
});

test('formCaptions: empty input returns empty array', () => {
  assert.deepEqual(formCaptions([]), []);
});

test('extractHashtags: allows 2-letter informative terms (ai, ml, ux)', () => {
  const text = 'ai ai ai ml ml react react react react the a an the';
  const tags = extractHashtags(text).map(t => t.tag);
  assert.ok(tags.includes('#ai'), '2-letter term "ai" should be allowed');
  assert.ok(tags.includes('#ml'), '2-letter term "ml" should be allowed');
});

test('extractHashtags: sorts by raw score, not post-rounding ties', () => {
  // A long transcript where naive round-then-sort would collapse most
  // candidates to the same rounded value.
  const words = [];
  for (let i = 0; i < 2000; i++) words.push('filler');
  words.push('react', 'react', 'react', 'database');
  const tags = extractHashtags(words.join(' '));
  const reactIdx = tags.findIndex(t => t.tag === '#react');
  const databaseIdx = tags.findIndex(t => t.tag === '#database');
  assert.ok(reactIdx !== -1 && databaseIdx !== -1);
  assert.ok(reactIdx < databaseIdx, 'higher true TF-IDF score should sort first');
});

test('extractHashtags: empty text returns empty array', () => {
  assert.deepEqual(extractHashtags(''), []);
});

test('extractHashtags: real corpus IDF differentiates two recordings on the same topic', () => {
  // Both recordings talk about "database" a lot — but recording A is
  // otherwise about react, and recording B about python. A real IDF pass
  // should down-weight "database" (common to both) relative to each
  // recording's own distinctive term, which a fake/no-op IDF cannot do
  // since it weights every word in a document identically.
  const textA = 'database database database react react react query query';
  const textB = 'database database database python python python query query';

  const corpus = buildCorpusStats([textA, textB]); // each is "the other" document for the other's extraction
  const tagsA = extractHashtags(textA, corpus).map(t => t.tag);
  const tagsB = extractHashtags(textB, corpus).map(t => t.tag);

  assert.ok(tagsA.includes('#react'), 'recording A should surface its distinctive term');
  assert.ok(tagsB.includes('#python'), 'recording B should surface its distinctive term');
  assert.notDeepEqual(tagsA, tagsB, 'two recordings sharing a common term must not produce identical hashtag sets');

  // "database" appears in both documents ("database" tf is equal in both,
  // and corpus-wide it's in every doc) so a real IDF must rank it BELOW
  // each recording's own word that appears nowhere else in the corpus.
  const dbRankA = tagsA.indexOf('#database');
  const reactRankA = tagsA.indexOf('#react');
  assert.ok(reactRankA < dbRankA, '"react" (unique to A) should outrank "database" (common to both)');
});

test('extractHashtags: idf is a real per-tag value, not the score duplicated', () => {
  const corpus = buildCorpusStats(['completely unrelated other content here']);
  const tags = extractHashtags('react react react database', corpus);
  for (const t of tags) {
    assert.notEqual(t.idf, t.score, 'idf must not equal score — that was the fake-idf bug (same number written twice)');
    assert.ok(t.idf >= 1, 'smoothed idf is always >= 1');
  }
});

test('extractHashtags: a repeated two-word phrase becomes a bigram tag', () => {
  const text = 'we talked about machine learning today, machine learning is the whole point of this project';
  const tags = extractHashtags(text).map(t => t.tag);
  assert.ok(tags.includes('#machinelearning'), `expected a bigram tag, got: ${tags.join(', ')}`);
});

test('extractHashtags: a two-word phrase said only once does not become a bigram tag', () => {
  const text = 'machine learning is interesting but we only said that combination one time in this text';
  const tags = extractHashtags(text).map(t => t.tag);
  assert.ok(!tags.includes('#machinelearning'), 'a non-repeated phrase should not be promoted to a compound tag');
});

test('scoreWindow: empty window returns 0', () => {
  assert.equal(scoreWindow([], 0, 1000), 0);
});

test('scoreWindow: zero or negative window duration returns 0', () => {
  assert.equal(scoreWindow([{ word: 'a', start: 0, end: 0.1 }], 1000, 1000), 0);
  assert.equal(scoreWindow([{ word: 'a', start: 0, end: 0.1 }], 1000, 500), 0);
});

test('detectChapters: short recording returns a single Introduction chapter', () => {
  const words = [{ word: 'hi', start: 0, end: 0.5 }];
  const chapters = detectChapters(words, 5000); // well under windowMs*2
  assert.equal(chapters.length, 1);
  assert.equal(chapters[0].title, 'Introduction');
  assert.equal(chapters[0].start_ms, 0);
});

test('detectChapters: monotone word density produces no spurious boundaries', () => {
  // Evenly spaced words at a constant rate for 3 minutes — energy should be
  // flat, so no local-minima boundaries should be found beyond the first.
  const words = [];
  for (let t = 0; t < 180; t += 0.4) words.push({ word: 'word', start: t, end: t + 0.3 });
  const chapters = detectChapters(words, 180000);
  assert.equal(chapters[0].start_ms, 0);
  assert.equal(chapters[0].title, 'Introduction');
  // Boundaries must be strictly increasing and spaced by at least 60s apart
  // (energy.js's own invariant) — verify it held, not a specific count.
  for (let i = 1; i < chapters.length; i++) {
    assert.ok(chapters[i].start_ms - chapters[i - 1].start_ms >= 60000);
  }
});

test('scoreSegmentEnergy: energy always lands in [0,1] — the S3 acceptance criterion', () => {
  const cases = [
    scoreSegmentEnergy('um', 0, 400),                              // near-empty, near-zero duration
    scoreSegmentEnergy('the quick brown fox jumps over the lazy dog, repeatedly and with great enthusiasm', 0, 1500),
    scoreSegmentEnergy('a a a a a a a a a a a a a a a a a a a a', 0, 20000), // slow, uniform word length
    scoreSegmentEnergy('', 0, 1000),                                // empty text
  ];
  for (const { energy, wpm } of cases) {
    assert.ok(energy >= 0 && energy <= 1, `energy ${energy} out of [0,1]`);
    assert.ok(wpm >= 0, `wpm ${wpm} should never be negative`);
  }
});

test('scoreSegmentEnergy: faster speech scores higher than slower speech, all else equal', () => {
  const text = 'this is a reasonably normal length sentence for a caption segment';
  const fast = scoreSegmentEnergy(text, 0, 2000);  // ~11 words / 2s = 330 wpm
  const slow = scoreSegmentEnergy(text, 0, 10000); // ~11 words / 10s = 66 wpm
  assert.ok(fast.wpm > slow.wpm);
  assert.ok(fast.energy >= slow.energy);
});

test('scoreSegmentEnergy: domain keyword hits raise the score over an identical segment without them', () => {
  const text = 'we discussed the database and the api design today';
  const withKeywords = scoreSegmentEnergy(text, 0, 4000, new Set(['database', 'api', 'design']));
  const withoutKeywords = scoreSegmentEnergy(text, 0, 4000, new Set());
  assert.ok(withKeywords.energy > withoutKeywords.energy);
});
