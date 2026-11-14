'use strict';
const assert = require('node:assert/strict');
const { runSimulation, sharedIntervals, sameSignature } = require('./fetter-saboteur-simulation');
const bands = require('./bands');

const report = runSimulation();
assert.equal(report.canonicalProfileCount, 33);
assert.equal(report.possiblePairs, 528);
assert.equal(report.pairsWithAnySharedAxisInterval, 271);
assert.deepEqual(report.exactFullSignatureDuplicates, []);
assert.equal(report.topOne, 31);
assert.equal(report.topThree, 33);
assert.equal(report.classification, 'synthetic_logic_regression_not_empirical_accuracy');

const byName = new Map(bands);
const micromanager = byName.get('Micromanager');
const hyperVigilant = byName.get('Hyper-Vigilant');
assert.deepEqual(sharedIntervals(micromanager, hyperVigilant), [
  { axis: 'fear', low: 7, high: 9 },
  { axis: 'anger', low: 5, high: 7 }
]);
assert.equal(sameSignature(micromanager, hyperVigilant), false);
console.log('fetter-saboteur-simulation: all tests passed');
