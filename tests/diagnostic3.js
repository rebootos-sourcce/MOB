'use strict';
/* Headless Core10->full21 diagnostic contract. Does not score CQ. */
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const p=fs.readFileSync(path.resolve('atuned_src/engine/data/diagnostic3.js'),'utf8')+'\n'
 +fs.readFileSync(path.resolve('atuned_src/engine/diagnostic3.js'),'utf8');
const context={S:{rec:'person1'},showRefuse:()=>false};
vm.createContext(context);vm.runInContext(p,context);
const bank=context.D3_BANK;
assert.equal(bank.length,21);
assert.equal(bank.filter(x=>x.core).length,10);
assert.equal(new Set(bank.flatMap(l=>l.questions.map(q=>q.id))).size,63);
assert(bank.every(x=>x.questions.length===3&&x.questions[2].polarity==='REVERSE_PROTECTIVE_PATTERN'));
const person={id:'person1',diagnostic3:null};
const original={...person};
let first=bank.filter(l=>l.core);
first.forEach(l=>l.questions.forEach((q,i)=>{
 assert.equal(context.d3Answer(person,q.id,i===2?7:8),true);
}));
let summary=context.d3Counts(person);
assert.equal(summary.answered,30);assert.equal(summary.coreLaws,10);
assert.equal(summary.completeLaws,10);assert.equal(summary.remainingLaws,11);
let afterCore=JSON.stringify(person.diagnostic3.answers);
bank.filter(l=>!l.core).forEach(l=>l.questions.forEach((q,i)=>{
 assert.equal(context.d3Answer(person,q.id,i===2?3:10),true);
}));
summary=context.d3Counts(person);
assert.equal(summary.answered,63);assert.equal(summary.completeLaws,21);
assert(person.diagnostic3.completedAt);
assert.equal(Object.keys(person.diagnostic3.answers).length,63);
assert(Object.entries(JSON.parse(afterCore)).every(([k,v])=>person.diagnostic3.answers[k]===v));
let errs=[];
const candidate=context.d3Valid(errs,JSON.parse(JSON.stringify(person.diagnostic3)));
assert.equal(errs.length,0,errs.join('; '));assert(candidate);
const blank=context.d3Blank();
assert.equal(context.d3Answer(person,'unknown',10),false);
assert.equal(context.d3Answer(person,bank[0].questions[0].id,11),false);
assert.equal(context.d3Answer(person,bank[0].questions[0].id,null),true);
assert.equal(context.d3Counts(person).answered,62);
assert.equal(person.diagnostic3.completedAt,null);
errs=[];const rogue=JSON.parse(JSON.stringify(candidate));rogue.answers[bank[0].questions[0].id]=11;
context.d3Valid(errs,rogue);assert(errs.some(s=>s.includes('0 through 10')));
errs=[];const rogue2=JSON.parse(JSON.stringify(candidate));rogue2.answers['falsified:law:B']=3;
context.d3Valid(errs,rogue2);assert(errs.some(s=>s.includes('may not carry')));
context.S.rec='other';assert.equal(context.d3Answer(person,bank[1].questions[0].id,5),false);
console.log('PASS diagnostic3: 21 canonical laws, 63 contextual items, Core10→21 continuation, no duplicate answers, null vs zero, strict shape, ownership');
