import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshEngine, staticEngine, resolveEngineJsPath } from '../src/engineHost.js';

test('the real engine.js file is found and loads', () => {
  const path = resolveEngineJsPath();
  assert.ok(path.endsWith('engine.js'));
  const e = freshEngine();
  assert.equal(typeof e.compute, 'function');
  assert.equal(typeof e.cqSum, 'function');
  assert.equal(typeof e.releaseWork, 'function');
  assert.equal(typeof e.srcHear, 'function');
  assert.equal(typeof e.srcPrior, 'function');
  assert.equal(typeof e.srcTurn, 'function');
  assert.ok(e.S, 'the real S state object must be present');
  assert.ok(Array.isArray(e.SIGHT) && e.SIGHT.length > 0, 'the real SIGHT table must be present');
});

test('two fresh engine instances never share state', () => {
  const a = freshEngine();
  const b = freshEngine();
  a.S.law.Truth = 9;
  assert.notEqual(b.S.law.Truth, 9, 'mutating one instance must never be visible in another');
});

test('cqSum reflects a seeded law value on one isolated instance, not the default', () => {
  const engine = freshEngine();
  const before = engine.cqSum();
  assert.equal(before, 60, 'a fresh instance starts from the real engine default, 6 on every law');
  // seed every law at 9 (the real 0-10 scale) and mark each answered, the
  // same two steps tests/engine.js's own reset() helper performs
  for (const name of Object.keys(engine.S.law)) engine.S.law[name] = 9;
  for (const name of Object.keys(engine.LAW_UNSET)) engine.LAW_UNSET[name] = false;
  const after = engine.cqSum();
  assert.equal(after, 90, 'seeding every real law to 9 and marking it answered must move the real CQ to 90');
});

test('staticEngine returns the same instance across calls, for read-only lookups only', () => {
  const a = staticEngine();
  const b = staticEngine();
  assert.equal(a, b, 'staticEngine is explicitly a cached singleton, unlike freshEngine');
});
