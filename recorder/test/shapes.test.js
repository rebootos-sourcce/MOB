'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const Shapes = require('../src/shared/shapes');
const Material = require('../src/shared/material');

test('shapes: ORDER lists every key in SHAPES, no duplicates', () => {
  assert.equal(Shapes.ORDER.length, Object.keys(Shapes.SHAPES).length);
  assert.equal(new Set(Shapes.ORDER).size, Shapes.ORDER.length);
});

test('shapes: every shape has a positive aspect ratio and a css()/path() function', () => {
  for (const id of Shapes.ORDER) {
    const s = Shapes.SHAPES[id];
    assert.ok(s.aspect > 0, `${id} should have a positive aspect`);
    assert.equal(typeof s.css, 'function', `${id}.css should be a function`);
    assert.equal(typeof s.path, 'function', `${id}.path should be a function`);
    assert.equal(typeof s.label, 'string');
  }
});

test('shapes: dimensions() respects aspect ratio for both wide and tall shapes', () => {
  // circle: aspect 1 -> square
  const circle = Shapes.dimensions('circle', 240);
  assert.equal(circle.width, circle.height);
  // portrait: aspect < 1 (taller than wide) if present
  if (Shapes.SHAPES.portrait) {
    const portrait = Shapes.dimensions('portrait', 240);
    if (Shapes.SHAPES.portrait.aspect < 1) {
      assert.ok(portrait.height > portrait.width, 'a portrait shape should be taller than wide');
    }
  }
});

test('shapes: dimensions() falls back to circle for an unknown shape id', () => {
  const unknown = Shapes.dimensions('not-a-real-shape', 240);
  const circle = Shapes.dimensions('circle', 240);
  assert.deepEqual(unknown, circle);
});

test('shapes: anchor() scales normalized coordinates to the given box', () => {
  const a = Shapes.anchor('circle', 'badge', 200, 100);
  assert.equal(a.x, 0.5 * 200);
  assert.ok(a.y >= 0 && a.y <= 100);
});

test('shapes: anchor() falls back to center for an unknown anchor name', () => {
  const a = Shapes.anchor('circle', 'not-a-real-anchor', 200, 100);
  assert.equal(a.x, 100);
  assert.equal(a.y, 50);
});

test('material: ringWidth is 0 when disabled, and scales with the shorter side otherwise', () => {
  assert.equal(Material.ringWidth(200, 100, false), 0);
  const w = Material.ringWidth(200, 100, true);
  assert.ok(w >= Material.RING_MIN);
});

test('material: ringWidth never goes below RING_MIN even for a tiny bubble', () => {
  const w = Material.ringWidth(10, 10, true);
  assert.equal(w, Material.RING_MIN);
});

test('material: captureWidth is clamped to [320, 1280] and rounds to a multiple of 16', () => {
  assert.equal(Material.captureWidth(10), 320);
  assert.equal(Material.captureWidth(10000), 1280);
  const w = Material.captureWidth(400);
  assert.equal(w % 16, 0);
});
