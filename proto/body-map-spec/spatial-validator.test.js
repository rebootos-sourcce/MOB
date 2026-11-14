'use strict';
const assert = require('node:assert/strict');
const { validatePosition, validatePositions } = require('./spatial-validator');

const valid = {
  id: 'place-001', view: 'front', x: 50, y: 42,
  z: null, evidence: 'sourced', source: 'anatomy-reference-v1',
  side: 'midline', uncertaintyCm: 2
};
assert.deepEqual(validatePosition(valid), []);
assert.deepEqual(validatePosition({ ...valid, z: undefined }), []);
assert.ok(validatePosition({ ...valid, x: 101 }).some(e => e.startsWith('x ')));
assert.ok(validatePosition({ ...valid, y: NaN }).some(e => e.startsWith('y ')));
assert.ok(validatePosition({ ...valid, view: 'side' }).includes('view is not supported'));
assert.ok(validatePosition({ ...valid, evidence: 'certain' }).includes('evidence class is not supported'));
assert.ok(validatePosition({ ...valid, source: ' ' }).includes('source must be a non-empty string'));
assert.ok(validatePosition({ ...valid, z: -1 }).includes('z must be null or a finite number in [0, 100]'));
assert.ok(validatePosition({ ...valid, uncertaintyCm: -0.1 }).includes('uncertaintyCm must be a finite non-negative number'));
assert.ok(validatePosition({ ...valid, side: 'center' }).includes('side is not supported'));
assert.deepEqual(validatePosition(null), ['position must be an object']);

const goodBatch = validatePositions([valid, { ...valid, id: 'place-002', view: 'back', x: 12, y: 88 }]);
assert.equal(goodBatch.valid, true);
assert.deepEqual(goodBatch.errors, []);
const duplicateBatch = validatePositions([valid, { ...valid }]);
assert.equal(duplicateBatch.valid, false);
assert.ok(duplicateBatch.errors.some(e => e.includes('duplicate id')));
assert.deepEqual(validatePositions('not an array'), { valid: false, errors: ['positions must be an array'] });

console.log('spatial validator: 14 assertions passed');
