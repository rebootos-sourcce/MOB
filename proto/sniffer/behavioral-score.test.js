'use strict';
const assert = require('node:assert/strict');
const { DEFAULT_WEIGHTS, scoreCandidates } = require('./behavioral-score');
const catalog = require('./behavioral-catalog.json');

assert.equal(catalog.records.length, 33, 'catalog must cover all canonical Saboteurs');
assert.equal(new Set(catalog.records.map(x => x.name)).size, 33, 'canonical names must be unique');
assert.equal(DEFAULT_WEIGHTS.behavior, 0.65);
assert.equal(DEFAULT_WEIGHTS.charge, 0.35);

const chargeOnly = scoreCandidates([
 {name:'Micromanager', chargeScore:0.9},
 {name:'Hyper-Vigilant', chargeScore:0.8, behaviorSupport:0.9, behaviorContradiction:0.1, behaviorSourceVerified:true}
]);
assert.equal(chargeOnly.find(x=>x.name==='Micromanager').combinedScore, null, 'missing behavior must not be fabricated');
assert.equal(chargeOnly.find(x=>x.name==='Hyper-Vigilant').combinedScore, 0.8, 'weighted score should combine 0.8 behavior and 0.8 charge');
assert.equal(chargeOnly.find(x=>x.name==='Micromanager').mode, 'charge_only_or_incomplete_behavior');

const behaviorContrast = scoreCandidates([
 {name:'Micromanager', chargeScore:0.95, behaviorSupport:0.2, behaviorContradiction:0.1, behaviorSourceVerified:true},
 {name:'Hyper-Vigilant', chargeScore:0.75, behaviorSupport:0.95, behaviorContradiction:0.05, behaviorSourceVerified:true}
]);
assert.equal(behaviorContrast[0].name, 'Hyper-Vigilant', 'stronger behavior evidence can outweigh a charge-only advantage');
assert.ok(behaviorContrast[0].combinedScore > behaviorContrast[1].combinedScore);
assert.throws(()=>scoreCandidates([{name:'Bad',chargeScore:1.1}]), RangeError);
assert.throws(()=>scoreCandidates([], {behavior:0.6,charge:0.6}), RangeError);
assert.ok(catalog.records.some(x=>x.name==='Control Freak' && !x.scoring_eligible), 'missing canonical behavior remains blocked');
assert.ok(catalog.records.some(x=>x.name==='Victim' && x.behavior_status==='shared_ambiguous'), 'shared Victim/Judge entry must not be split silently');
const blocked = scoreCandidates([
 {name:'Control Freak', chargeScore:0.9, behaviorSupport:1, behaviorContradiction:0, behaviorSourceVerified:true},
 {name:'Victim', chargeScore:0.8, behaviorSupport:1, behaviorContradiction:0, behaviorSourceVerified:true}
]);
assert.ok(blocked.every(x=>x.combinedScore === null), 'missing or ambiguous catalog entries must not receive a behavior score');
console.log('behavioral-score tests passed');
