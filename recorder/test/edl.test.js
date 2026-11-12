'use strict';
// remapTimestamp() is pure (takes already-loaded edl_entries, touches no
// DB), so it's directly unit-testable. applyCuts()/undoLastCut() need a
// live SQLite connection and are covered by the manual DB-backed check
// described in this session's commits instead.
const test = require('node:test');
const assert = require('node:assert/strict');

const { remapTimestamp } = require('../src/main/edl');

// Simulates applyCuts()'s output for a ZERO-LENGTH cut at 5000ms in a
// 10000ms recording: kept segments [0,5000] -> [0,5000] and
// [5000,10000] -> [5000,10000]. This is the exact input that used to make
// edl.js's linear scan and production.js's binary search disagree.
const adjacentEntries = [
  { seq: 0, source_start_ms: 0, source_end_ms: 5000, output_start_ms: 0, output_end_ms: 5000 },
  { seq: 1, source_start_ms: 5000, source_end_ms: 10000, output_start_ms: 5000, output_end_ms: 10000 },
];

test('remapTimestamp: resolves an adjacent-cut boundary unambiguously', () => {
  assert.equal(remapTimestamp(adjacentEntries, 4999), 4999);
  assert.equal(remapTimestamp(adjacentEntries, 5000), 5000);
  assert.equal(remapTimestamp(adjacentEntries, 9999), 9999);
});

test('remapTimestamp: the very last millisecond of the recording is inclusive', () => {
  assert.equal(remapTimestamp(adjacentEntries, 10000), 10000);
});

test('remapTimestamp: past the end of the recording returns null', () => {
  assert.equal(remapTimestamp(adjacentEntries, 10001), null);
});

test('remapTimestamp: a timestamp inside an actual cut returns null', () => {
  // kept [0,2000]->[0,2000] and [4000,10000]->[2000,8000]; [2000,4000) was cut.
  const entries = [
    { seq: 0, source_start_ms: 0, source_end_ms: 2000, output_start_ms: 0, output_end_ms: 2000 },
    { seq: 1, source_start_ms: 4000, source_end_ms: 10000, output_start_ms: 2000, output_end_ms: 8000 },
  ];
  assert.equal(remapTimestamp(entries, 3000), null);
  assert.equal(remapTimestamp(entries, 5000), 3000); // 2000 + (5000-4000)
});

test('remapTimestamp: empty EDL (no cuts applied) returns null for any timestamp', () => {
  assert.equal(remapTimestamp([], 1000), null);
});
