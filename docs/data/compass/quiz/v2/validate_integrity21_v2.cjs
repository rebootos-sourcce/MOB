#!/usr/bin/env node
'use strict';

/*
 * Structural verification of the newer 21-law three-register quiz bank.
 * This is NOT a user-comprehension test, a CQ calibration or a live funnel test.
 * Run: node docs/data/compass/quiz/v2/validate_integrity21_v2.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = __dirname;
const bank = JSON.parse(fs.readFileSync(path.join(root,'INTEGRITY_21_LAW_THREE_REGISTER_V2.json'),'utf8'));

const regs = ['BEHAVIOR','PRESSURE','MECHANISM'];
const bands = ['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
const suffix = {BEHAVIOR:'B',PRESSURE:'P',MECHANISM:'M'};
const polarity = {BEHAVIOR:'ALIGNED',PRESSURE:'ALIGNED',MECHANISM:'REVERSE_PROTECTIVE_PATTERN'};
const unique = (arr) => new Set(arr).size === arr.length;
const eq = (a,b) => JSON.stringify(a) === JSON.stringify(b);

assert.equal(bank.schemaVersion,'2.0.0');
assert.equal(bank.status,'CONTENT_READY_FOR_COMPREHENSION_REVIEW_NOT_LIVE');
assert.equal(bank.laws.length,21);
assert.equal(bank.contract.missing,'NULL_NOT_ZERO');
assert.equal(bank.contract.answerScale['0'],'Never');
assert.equal(bank.contract.answerScale['10'],'Always');
assert.ok(bank.contract.triangulation.includes('Do not average'));
assert.ok(unique(bank.laws.map(l=>l.id)));
assert.ok(unique(bank.laws.map(l=>l.law)));

const ids = [];
for (let i=0;i<bank.laws.length;i++){
  const law = bank.laws[i];
  assert.equal(law.id,'integrity21:v2:'+String(i+1).padStart(2,'0'),law.law);
  assert.ok(bands.includes(law.band),'unknown band '+law.band);
  assert.equal(law.questions.length,3,law.law);
  assert.ok(['CORE10_OWNER_APPROVED_THREE_CHANNEL_STRUCTURE_WORDING_DRAFT','ADDITIONAL_DIAGNOSTIC_DRAFT'].includes(law.recordStatus));
  assert.equal(law.inCore10,law.recordStatus.startsWith('CORE10_'));
  for(let k=0;k<3;k++){
    const q=law.questions[k], reg=regs[k];
    assert.equal(q.register,reg,law.law);
    assert.equal(q.id,law.id+':'+suffix[reg],law.law);
    assert.equal(q.polarity,polarity[reg],law.law);
    assert.equal(q.scoreType,'FREQUENCY_0_TO_10',law.law);
    assert.equal(q.allowNotApplicable,true,law.law);
    assert.equal(q.allowSkip,true,law.law);
    assert.equal(q.opportunityContextRequired,true,law.law);
    assert.ok(typeof q.prompt==='string' && q.prompt.trim().length>20,law.law);
    ids.push(q.id);
  }
}
assert.ok(unique(ids),'question ID collision');
assert.ok(eq(new Set(bank.laws.map(l=>l.band)),new Set(bands)) || bands.every(x=>bank.laws.some(l=>l.band===x)),'missing Compass band');
const funnel = bank.laws.filter(l=>l.inCore10).map(l=>l.id);
const diagnostic = bank.laws.map(l=>l.id);
assert.equal(funnel.length,10);
assert.equal(bank.funnel.questions,30);
assert.equal(bank.diagnostic.questions,63);
assert.equal(bank.diagnostic.remainingAfterFunnel,33);
assert.ok(eq(bank.funnel.lawIds,funnel),'funnel law IDs/order not canonical');
assert.ok(eq(bank.diagnostic.lawIds,diagnostic),'diagnostic law IDs/order not canonical');
assert.equal(ids.length,63);
console.log(JSON.stringify({gate:'INTEGRITY21_V2_STATIC_STRUCTURE',passed:true,laws:21,questions:63,coreLaws:10,coreQuestions:30,additionalLaws:11,additionalQuestions:33,compassBands:7,uniqueQuestionIds:63,scoringAuthority:'NOT_VERIFIED',liveIntegration:'NOT_VERIFIED'},null,2));
