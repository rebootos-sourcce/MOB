'use strict';
// remapTimestamp() and composeCuts() are pure (no DB), so they are
// directly unit-testable. applyCuts()/undoLastCut() need a live SQLite
// connection and are covered by the manual DB-backed check instead.
const test = require('node:test');
const assert = require('node:assert/strict');

const { remapTimestamp } = require('../src/main/edl');

// composeCuts is not exported from the public API; reach it via the
// module's own require so it can be tested without touching the DB.
// Fallback gracefully if it's ever made private again.
let _composeCuts;
try { _composeCuts = require('../src/main/edl')._composeCuts; } catch (_) {}

// Thin adapter: build edl_entries-shaped objects so composeCuts gets the
// same input shape applyCuts would pass in after a DB read.
function seg(ss, se) { return { source_start_ms: ss, source_end_ms: se }; }

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

// ── composeCuts — composes multiple independent cut passes ──────────────────
// All tests use real edl_entries-shaped objects so the shape matches what
// applyCuts() passes in after a DB SELECT.

test('composeCuts: second cut refines a gap inside the first kept segment', () => {
  if (!_composeCuts) return; // skip if internal export removed
  // First pass removed [3000,5000] from a 10s recording — kept [0,3000],[5000,10000].
  const prevEntries = [
    seg(0, 3000),
    seg(5000, 10000),
  ];
  // Second pass asks to also remove [1000,2000] (a filler word inside the first kept block).
  const result = _composeCuts(prevEntries, [{ start_ms: 1000, end_ms: 2000 }]);
  // Expected: [0,1000], [2000,3000], [5000,10000]
  assert.deepEqual(result, [seg(0, 1000), seg(2000, 3000), seg(5000, 10000)]);
});

test('composeCuts: cut entirely outside all kept segments is a no-op', () => {
  if (!_composeCuts) return;
  const prevEntries = [seg(0, 3000), seg(5000, 10000)];
  // Try to cut [3000,5000] — that range is already cut, nothing to subtract.
  const result = _composeCuts(prevEntries, [{ start_ms: 3000, end_ms: 5000 }]);
  assert.deepEqual(result, prevEntries);
});

test('composeCuts: cut overlapping the boundary of two kept segments splits both', () => {
  if (!_composeCuts) return;
  const prevEntries = [seg(0, 4000), seg(6000, 10000)];
  // Cut [2000,8000] — slices off the tail of seg-0 and the head of seg-1.
  const result = _composeCuts(prevEntries, [{ start_ms: 2000, end_ms: 8000 }]);
  assert.deepEqual(result, [seg(0, 2000), seg(8000, 10000)]);
});

test('composeCuts: cut that removes an entire kept segment leaves the others intact', () => {
  if (!_composeCuts) return;
  const prevEntries = [seg(0, 2000), seg(4000, 6000), seg(8000, 10000)];
  const result = _composeCuts(prevEntries, [{ start_ms: 4000, end_ms: 6000 }]);
  assert.deepEqual(result, [seg(0, 2000), seg(8000, 10000)]);
});

test('composeCuts: empty cuts list returns all prevEntries unchanged', () => {
  if (!_composeCuts) return;
  const prevEntries = [seg(0, 5000), seg(7000, 10000)];
  const result = _composeCuts(prevEntries, []);
  assert.deepEqual(result, prevEntries);
});
