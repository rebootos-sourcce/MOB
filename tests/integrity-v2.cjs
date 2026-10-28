#!/usr/bin/env node
'use strict';
/* Integration-style unit gate for the two static quiz pages.
 * Run from repository root: node tests/integrity-v2.cjs
 * A real-browser and account-continuity gate is still required. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'funnel/integrity-v2.js'),'utf8');
const dataJs=fs.readFileSync(path.join(root,'funnel/integrity-v2-data.js'),'utf8');
const canonical=JSON.parse(fs.readFileSync(path.join(root,'docs/data/compass/quiz/v2/INTEGRITY_21_LAW_THREE_REGISTER_V2.json'),'utf8'));
const session=new Map();
let checks=0;
function ok(v,what){assert.ok(v,what);checks++;}
function instance(mode,shared=session,brokenStorage=false){
 const events={};
 const app={innerHTML:'',tabIndex:0,addEventListener(type,fn){events[type]=fn;},
  focus(){},querySelector(){return {focus(){}};}};
 const doc={body:{getAttribute(n){if(n==='data-mode')return mode;return null;}},
  getElementById(n){return n==='app'?app:null;}};
 const store={getItem(k){if(brokenStorage)throw Error('blocked');return shared.get(k)||null;},
  setItem(k,v){if(brokenStorage)throw Error('blocked');shared.set(k,v);}};
 const win={scrollTo(){},confirm(){return true;}};
 const ctx={document:doc,window:win,localStorage:store,console,Date,Number,Object,
  Array,JSON,Error,Math,setTimeout,clearTimeout,Uint8Array,Blob};
 vm.createContext(ctx);
 vm.runInContext(dataJs,ctx,{filename:'integrity-v2-data.js'});
 vm.runInContext(src,ctx,{filename:'integrity-v2.js'});
 function click(act,id,value){
  const b={getAttribute(n){return {'data-act':act,'data-id':id,'data-value':value}[n]||null;}};
  events.click({target:{closest(){return b;}}});
 }
 return {app,win,click,counts:win.ATUNED_QV2_DEBUG.counts,
  validate:win.ATUNED_QV2_DEBUG.validate,
  state(){return JSON.parse(shared.get('atuned.integrity21.v2.answers')||'null');}};
}
const core=canonical.laws.filter(x=>x.inCore10);
const remaining=canonical.laws.filter(x=>!x.inCore10);
ok(core.length===10,'Core 10');
ok(remaining.length===11,'remaining 11');
ok(canonical.laws.reduce((n,l)=>n+l.questions.length,0)===63,'63 prompts');
ok(canonical.laws.every(l=>l.questions[2].polarity==='REVERSE_PROTECTIVE_PATTERN'),'reverse-facing polarity');
const data=vm.runInNewContext(dataJs+'\nwindow.ATUNED_INTEGRITY21_V2', {window:{}}); // same bank, checked by IDs and prompt parity
ok(JSON.stringify(data)===JSON.stringify(canonical),'generated browser data matches canonical bank');
const coreRun=instance('core');
ok(coreRun.app.innerHTML.includes('How coherent are you?'),'Core intro rendered');
ok(!/\bCQ\s*[:=]\s*\d+/i.test(coreRun.app.innerHTML),'no fabricated CQ score');
coreRun.click('begin');
ok(coreRun.app.innerHTML.includes('Truth'),'first Core law displayed');
core.forEach((law,i)=>{
 const [b,p,m]=law.questions;
 coreRun.click('rate',b.id,'0');
 coreRun.click('rate',p.id,'10');
 coreRun.click('rate',m.id,'5');
 ok(coreRun.app.innerHTML.includes('Your rating: 5/10'),'mechanism shown as response');
 coreRun.click('next');
});
ok(coreRun.app.innerHTML.includes('Here is what your answers say.'),'Core summary reachable');
let s=coreRun.state();
ok(Object.keys(s.answers).length===30,'30 raw answers preserved');
ok(s.answers[core[0].questions[0].id].value===0,'literal zero persists');
ok(s.answers[core[0].questions[1].id].value===10,'literal ten persists');
ok(s.answers[core[0].questions[2].id].value===5,'mechanism raw response persists');
ok(s.kind==='atuned.integrity21.v2'&&s.schemaVersion==='2.0.0','versioned answer envelope');
ok(coreRun.app.innerHTML.includes('cannot establish the final 21-law Coherence Quotient'),'partial score qualified');
const diagnostic=instance('diagnostic');
ok(diagnostic.app.innerHTML.includes('Your first 30 responses stay'),'diagnostic intro no-repeat promise');
ok(diagnostic.counts().core.answered===30,'30 Core answers reused across pages');
diagnostic.click('begin');
ok(diagnostic.app.innerHTML.includes('Justice'),'diagnostic starts on first non-Core law, Justice');
remaining.forEach((law,i)=>{
 const [b,p,m]=law.questions;
 diagnostic.click('rate',b.id,'9');
 diagnostic.click('na',p.id);
 diagnostic.click('skip',m.id);
 diagnostic.click('next');
});
s=diagnostic.state();
ok(Object.keys(s.answers).length===63,'all 63 prompt statuses persisted');
ok(diagnostic.counts().core.answered===30,'Core 30 unchanged');
ok(diagnostic.counts().remaining.answered===11,'11 numeric additional ratings');
ok(diagnostic.counts().remaining.not_applicable===11,'11 null N/A retained');
ok(diagnostic.counts().remaining.skipped===11,'11 separate skipped retained');
ok(s.answers[remaining[0].questions[1].id].value===null,'N/A not zero');
ok(s.answers[remaining[0].questions[2].id].value===null,'skip not zero');
ok(s.answers[remaining[0].questions[1].id].status==='not_applicable','N/A distinguished');
ok(s.answers[remaining[0].questions[2].id].status==='skipped','skip distinguished');
ok(diagnostic.app.innerHTML.includes('Here is what your answers say.'),'63-result summary reachable');
const reloaded=instance('core');
ok(reloaded.counts().core.answered===30,'page reload persists 30 without rerun');
ok(reloaded.counts().remaining.not_applicable===11,'page reload persists 11 N/As');
const invalid=JSON.parse(JSON.stringify(s));invalid.answers['unauthorized-id']={status:'answered',value:6};
assert.throws(()=>diagnostic.validate(invalid),/unknown question/);checks++;
const invalid2=JSON.parse(JSON.stringify(s));invalid2.answers[core[0].questions[0].id].value=11;
assert.throws(()=>diagnostic.validate(invalid2),/Invalid 0–10/);checks++;
const invalid3=JSON.parse(JSON.stringify(s));invalid3.answers[remaining[0].questions[1].id].value=0;
assert.throws(()=>diagnostic.validate(invalid3),/null/);checks++;
const blocked=instance('core',new Map(),true);
ok(blocked.app.innerHTML.includes('browser cannot retrieve saved answers'),'blocked storage disclosed');
blocked.click('begin');
ok(blocked.app.innerHTML.includes('Truth'),'blocked storage does not prevent in-session reading');
for(const p of ['quiz-v2.html','diagnostic-v2.html']){
 const c=fs.readFileSync(path.join(root,'funnel',p),'utf8');
 ok(c.includes('integrity-v2-data.js')&&c.includes('integrity-v2.js'),'shared scripts wired: '+p);
 ok(c.includes('integrity-v2.css'),'CSS wired: '+p);
}
console.log(JSON.stringify({passed:true,assertions:checks,coreLaws:10,coreResponses:30,remainingLaws:11,remainingResponses:33,total:63,scoring:'provisional descriptive only',accountHandoff:'NOT VERIFIED'},null,2));