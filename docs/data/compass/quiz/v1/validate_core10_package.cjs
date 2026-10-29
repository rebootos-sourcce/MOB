'use strict';
/* Run: node docs/data/compass/quiz/v1/validate_core10_package.cjs */
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const p=JSON.parse(fs.readFileSync(path.join(__dirname,'CORE10_FUNNEL_PACKAGE_V1.json'),'utf8'));
const expected=['Truth','Transparency','Unity','Presence','Compassion','Courage','Duty','Accountability','Temperance','Non-Harm'];
assert.equal(p.schemaVersion,'1.1.0');
assert.deepEqual(p.records.map(r=>r.sourceLaw),expected);
assert.deepEqual(p.totals,{laws:10,questions:30,numeric:30,mechanism:10,mechanismNumeric:10,stories:10,bands:7});
assert.equal(new Set(p.records.map(r=>r.band)).size,7);
const ids=new Set();
for(const r of p.records){
 assert.equal(r.questions.length,3,r.sourceLaw);
 assert.deepEqual(r.questions.map(q=>q.register),['BEHAVIOR','PRESSURE','MECHANISM'],r.sourceLaw);
 for(let i=0;i<3;i++){
  const q=r.questions[i];
  assert(!ids.has(q.id),'duplicate '+q.id);ids.add(q.id);
  assert(q.prompt.endsWith('?')&&q.prompt.length>50,'incomplete question '+q.id);
  assert.equal(q.answer.type,'FREQUENCY',q.id);
  assert.equal(q.answer.min,0);assert.equal(q.answer.max,10);
  assert.equal(q.answer.allowNotApplicable,true);
  assert.equal(q.answer.allowSkip,true);
  assert.deepEqual(q.answer.anchors,{'0':'Never','5':'About half the eligible opportunities','10':'Always'});
  assert.equal(q.answer.polarity,i===2?'REVERSE_PROTECTIVE_PATTERN':'ALIGNED_CAPACITY');
  assert(q.measure.length>12);
 }
 assert.equal(r.questions[2].mechanismHypothesis.inferredCause,false);
 for(const key of ['title','story','alignedActionEffect','misalignedActionEffect','releaseReflection','becomingAction','contextBoundary']){
  assert(typeof r.vignette[key]==='string'&&r.vignette[key].length>15,'missing '+key+' '+r.id);
 }
 for(const key of ['releaseProtocolId','becomingRitualId','entryJourneySceneId'])assert.equal(r.previewContract[key],null);
}
assert.equal(ids.size,30);
assert.equal(p.assessment.registers[2].polarity,'REVERSE');
console.log(JSON.stringify({pass:true,laws:10,registers:3,questions:30,numeric:30,reverseMechanism:10,bands:7,stories:10},null,2));
