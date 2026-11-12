'use strict';
// Task #77: clampRegionToDisplay() is pure (no Electron dependency), so
// it's directly unit-testable without mocking BrowserWindow/screen.
const test = require('node:test');
const assert = require('node:assert/strict');

const { clampRegionToDisplay } = require('../src/main/region');

const display = { bounds: { x: 0, y: 0, width: 1280, height: 1024 } };

test('clampRegionToDisplay: a rect fully inside the display is unchanged', () => {
  const r = clampRegionToDisplay({ x: 100, y: 100, width: 300, height: 200 }, display);
  assert.deepEqual(r, { x: 100, y: 100, width: 300, height: 200 });
});

test('clampRegionToDisplay: clamps width when x + width would overflow the right edge', () => {
  // Previously this clamped width against the display's FULL width,
  // independent of x — 1000 + min(500, 1280) = 1000 + 500 = 1500, past the
  // display's own 1280px right edge.
  const r = clampRegionToDisplay({ x: 1000, y: 100, width: 500, height: 200 }, display);
  assert.ok(r.x + r.width <= display.bounds.width, `region extends past right edge: ${JSON.stringify(r)}`);
  assert.deepEqual(r, { x: 1000, y: 100, width: 280, height: 200 });
});

test('clampRegionToDisplay: clamps height when y + height would overflow the bottom edge', () => {
  const r = clampRegionToDisplay({ x: 100, y: 900, width: 200, height: 300 }, display);
  assert.ok(r.y + r.height <= display.bounds.height, `region extends past bottom edge: ${JSON.stringify(r)}`);
  assert.deepEqual(r, { x: 100, y: 900, width: 200, height: 124 });
});

test('clampRegionToDisplay: converts to coordinates relative to a non-origin display', () => {
  // A second, right-adjacent display starting at x=1280 — an absolute rect
  // on it should come back relative to ITS origin, not (0,0).
  const display2 = { bounds: { x: 1280, y: 0, width: 1280, height: 1024 } };
  const r = clampRegionToDisplay({ x: 1350, y: 50, width: 400, height: 300 }, display2);
  assert.deepEqual(r, { x: 70, y: 50, width: 400, height: 300 });
});

test('clampRegionToDisplay: a rect starting before the display origin is clamped to the true intersection, not just shifted', () => {
  // The rect spans absolute [-50, 150] x [-30, 120]. Only [0, 150] x [0, 120]
  // of that actually falls on this display — clamping x/y to 0 while
  // leaving width/height at their original 200/150 (a bug caught while
  // building this) would wrongly include 50px/30px of area past the rect's
  // own original edges that was never part of the selection.
  const r = clampRegionToDisplay({ x: -50, y: -30, width: 200, height: 150 }, display);
  assert.deepEqual(r, { x: 0, y: 0, width: 150, height: 120 });
});

test('clampRegionToDisplay: a rect entirely outside the display collapses to zero size, never negative', () => {
  const r = clampRegionToDisplay({ x: -500, y: -500, width: 100, height: 100 }, display);
  assert.deepEqual(r, { x: 0, y: 0, width: 0, height: 0 });
});
