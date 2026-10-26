'use strict';
/* node docs/data/compass/quiz/v1/validate_core10_package.cjs */
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const p=JSON.parse(fs.readFileSync(path.join(__dirname,'CORE10_FUNNEL_PACKAGE_V1.json'),'utf8'));
const expected=['Truth','Transparency','Unity','Presence','Compassion','Courage','Duty','Accountability','Temperance','Non-Harm'];
assert.equal(p.records.length,10);assert.equal(p.totals.questions,30);assert.equal(p.totals.numeric,20);assert.equal(p.totals.mechanism,10);
assert.deepEqual(p.records.map(r=>r.sourceLaw),expected);
assert.equal(new Set(p.records.map(r=>r.band)).size,7);
const ids=new Set();
for(const r of p.records){
 assert.equal(r.questions.length,3);
 assert.deepEqual(r.questions.map(q=>q.register),['BEHAVIOR','PRESSURE','MECHANISM']);
 for(const q of r.questions){assert(!ids.has(q.id),'duplicate '+q.id);ids.add(q.id);assert(q.prompt.endsWith('?'),q.id);}
 assert.equal(r.questions[0].answer.min,0);assert.equal(r.questions[0].answer.max,10);
 assert.equal(r.questions[1].answer.min,0);assert.equal(r.questions[1].answer.max,10);
 assert.equal(r.questions[2].answer.scored,false);
 assert(r.questions[2].answer.options.length>=8);
 for(const key of ['title','story','alignedActionEffect','misalignedActionEffect','releaseReflection','becomingAction','contextBoundary'])assert(typeof r.vignette[key]==='string'&&r.vignette[key].length>15,key+' '+r.id);
 for(const key of ['releaseProtocolId','becomingRitualId','entryJourneySceneId'])assert.equal(r.previewContract[key],null);
}
console.log(JSON.stringify({pass:true,coreLaws:10,questionPrompts:30,numeric:20,mechanism:10,bands:7,miniStories:10},null,2));
