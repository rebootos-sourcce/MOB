'use strict';
const assert = require('node:assert/strict');
const { evaluateFetterSaboteurs, member } = require('./fetter-saboteur-evaluator');
const bands = require('./bands');
const catalog = require('./behavioral-catalog.json');

assert.equal(bands.length, 33);
assert.equal(new Set(bands.map(row => row[0])).size, 33);
assert.equal(catalog.records.length, 33);
assert.equal(member(8.5, 7, 10), 1);
assert.equal(member(8, 7, 9), 1);

const micromanagerCenter = evaluateFetterSaboteurs({ fear: 8.5, anger: 6.5 });
assert.equal(micromanagerCenter.candidateCount, 33);
assert.equal(micromanagerCenter.behaviorScoredCount, 0);
assert.equal(micromanagerCenter.chargeRanking[0].name, 'Micromanager');
assert.ok(micromanagerCenter.candidates.every(x => x.combinedScore === null));
assert.equal(micromanagerCenter.accuracyClaim, 'none: independent expected labels are required for accuracy measurement');

const withEvidence = evaluateFetterSaboteurs(
  { fear: 8, anger: 6, anticipation: 6 },
  {
    Micromanager: { support: 0.2, contradiction: 0.1, sourceVerified: true, evidenceRefs: ['https://fixture.invalid/source'], observationIds: ['fixture-observation'] },
    'Hyper-Vigilant': { support: 0.9, contradiction: 0.1, sourceVerified: true, evidenceRefs: ['https://fixture.invalid/source'], observationIds: ['fixture-observation'] },
    'Control Freak': { support: 1, contradiction: 0, sourceVerified: true, evidenceRefs: ['https://fixture.invalid/source'], observationIds: ['fixture-observation'] },
    Victim: { support: 1, contradiction: 0, sourceVerified: true, evidenceRefs: ['https://fixture.invalid/source'], observationIds: ['fixture-observation'] }
  }
);
assert.equal(withEvidence.behaviorScoredCount, 2, 'blocked catalog entries must not score even if caller supplies ratings');
assert.equal(withEvidence.evidenceRanking[0].name, 'Hyper-Vigilant');
assert.equal(withEvidence.candidates.find(x => x.name === 'Control Freak').behaviorScore, null);
assert.equal(withEvidence.candidates.find(x => x.name === 'Victim').behaviorScore, null);
assert.ok(withEvidence.candidates.every(x => x.combinedScore === null), 'no global blend before evidence coverage and weighting are validated');


const unprovenanced = evaluateFetterSaboteurs(
  { fear: 8, anger: 6 },
  { Micromanager: { support: 1, contradiction: 0, sourceVerified: true } }
);
assert.equal(unprovenanced.candidates.find(x => x.name === 'Micromanager').behaviorScore, null,
  'sourceVerified flag alone is insufficient without evidence references and observation IDs');

assert.throws(() => evaluateFetterSaboteurs({ fear: 11 }), RangeError);
assert.throws(() => evaluateFetterSaboteurs({ fear: NaN }), RangeError);
assert.throws(() => evaluateFetterSaboteurs({ anxiety: 5 }), RangeError, 'non-canonical axis aliases must not be accepted');
assert.throws(() => evaluateFetterSaboteurs(null), TypeError);
console.log('fetter-saboteur-evaluator: all tests passed');
