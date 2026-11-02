'use strict';

const assert = require('assert');
const { adaptLegacyPlacement, adaptLegacyPlacements } = require('./spatial-adapter');

const measured = adaptLegacyPlacement({
  id: 'anat-hridaya-left', view: 'front', x: 44.2, y: 38.1,
  evidence: 'measured', source: 'atuned_src/engine/data/figure.js:ANAT'
});
assert.strictEqual(measured.z, null, '2D legacy point must not gain fabricated depth');
assert.strictEqual(measured.evidence, 'measured');
assert.strictEqual(measured.source, 'atuned_src/engine/data/figure.js:ANAT');

const proposed = adaptLegacyPlacement({
  id: 'fw-proposed-001', view: 'front', x: 51, y: 42,
  evidence: 'proposed', source: 'proto/fw/pages/fetters.html:PROP',
  side: 'midline', uncertaintyCm: 4
});
assert.strictEqual(proposed.evidence, 'proposed', 'proposal must remain a proposal');
assert.strictEqual(proposed.side, 'midline');
assert.strictEqual(proposed.uncertaintyCm, 4);

assert.throws(() => adaptLegacyPlacement({
  id: 'missing-source', view: 'front', x: 50, y: 50,
  evidence: 'measured', source: ' '
}), /invalid spatial placement/);
assert.throws(() => adaptLegacyPlacement({
  id: 'bad-depth', view: 'head-cut', x: 50, y: 50, z: 101,
  evidence: 'sourced', source: 'atlas'
}), /invalid spatial placement/);
assert.throws(() => adaptLegacyPlacement({
  id: 'no-evidence', view: 'front', x: 50, y: 50, source: 'legacy'
}), /invalid spatial placement/);

const batch = adaptLegacyPlacements([
  { id: 'a', view: 'front', x: 10, y: 20, evidence: 'sourced', source: 'atlas-A' },
  { id: 'b', view: 'back', x: 90, y: 80, evidence: 'unknown', source: 'legacy-unverified' }
]);
assert.strictEqual(batch.length, 2);
assert.strictEqual(batch[1].evidence, 'unknown');
assert.throws(() => adaptLegacyPlacements([
  { id: 'dup', view: 'front', x: 10, y: 20, evidence: 'sourced', source: 'A' },
  { id: 'dup', view: 'back', x: 90, y: 80, evidence: 'sourced', source: 'B' }
]), /duplicate id/);
console.log('spatial adapter: 10 assertions passed');
