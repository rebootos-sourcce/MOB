/* Seam-only progress gate. Does not change MANIFEST or product.
   Run: node tests/progress-seam.js from repository root. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),base=path.join(root,'atuned_src');
const files=fs.readFileSync(path.join(base,'MANIFEST'),'utf8').split(/\r?\n/)
 .filter(x=>x.startsWith('engine/')&&x.endsWith('.js'));
assert(files.includes('engine/ladder.js'),'current ladder absent from manifest');
/* Runs both before wiring (append candidate) and after wiring (MANIFEST loads it). */
const progressWired=files.includes('engine/progress.js');
const code=files.map(f=>fs.readFileSync(path.join(base,f),'utf8')).join('\n')+
 (progressWired?'':'\n'+fs.readFileSync(path.join(base,'engine/progress.js'),'utf8'));
const context={module:{exports:{}},console:console};
vm.createContext(context);vm.runInContext(code,context,{filename:'atuned-engine-plus-progress.js'});
const e=context.module.exports;
let passed=0;const eq=(a,b,m)=>{assert.strictEqual(a,b,m);passed++;};
const yes=(a,m)=>{assert(a,m);passed++;};
const same=(a,b,m)=>{assert.strictEqual(JSON.stringify(a),JSON.stringify(b),m);passed++;};
const NOW='2026-11-02T12:00:00.000Z',MS=86400000;
function day(n){return new Date(Date.parse(NOW)+n*MS).toISOString();}
function blank(){const p=e.blankProfile('Progress seam fixture');p.progress=e.progressBlank();return p;}
function commit(p){const add=e.progressSettle(p,NOW),res=e.progressApply(p,add);
 yes(res.ok,JSON.stringify(res.errs||[]));p.progress=res.progress;return add;}
const keys=e.PG_MARKS.map(m=>m.k);
for(const k of ['first','week','month','season','told','kept','ten','fifty','poled','named','ring','rings'])
 yes(keys.includes(k),'required mark '+k);
eq(new Set(keys).size,keys.length,'unique mark keys');
yes(e.PG_MARKS.every(m=>!!m.ic&&!!m.q&&!!m.b&&!!m.nm),'complete mark metadata');
eq(e.PG_MARKS.filter(m=>m.k==='poled').length,1,'renamed key is registered');
eq(e.PG_MARKS.filter(m=>m.k==='turned').length,0,'old turned key not stored');
{
 const p=blank(),before=JSON.stringify(p);const firstAdd=e.progressSettle(p,NOW);
 same(p,JSON.parse(before),'pure settle');eq(firstAdd.credits.length,0,'blank no credits');
 eq(e.pointsRead(p).n,0,'blank zero points');
 p.rituals.push({t:NOW,done:false,min:5});eq(e.progressSettle(p,NOW).credits.length,0,'start is not done');
 yes(!e.markTest(p,NOW).some(m=>m.k==='first'),'start cannot earn first run');
 p.rituals[0].done=NOW;p.rituals.push({t:NOW,done:NOW,min:5});
 p.rituals.push({t:day(90),done:day(90),min:90});
 p.story.entries.push({t:NOW,text:'Nothing',imprints:0,bands:{}});
 eq(e.progressEvents(p,NOW).filter(x=>x.type==='ritual.day').length,1,'one ritual day, not entries');
 eq(e.progressEvents(p,NOW).filter(x=>x.type==='story.day').length,0,'unimprinted story pays nothing');
 p.story.entries.push({t:NOW,text:'A place',imprints:1,bands:{}});
 p.story.entries.push({t:NOW,text:'Another place',imprints:4,bands:{}});
 eq(e.progressEvents(p,NOW).filter(x=>x.type==='story.day').length,1,'one story day');
 p.meter.firsts.push({k:'addr:17',t:NOW,nm:'A place'});
 p.meter.firsts.push({k:'seat:Root',t:NOW,nm:'Root'});
 const add=commit(p);
 eq(add.credits.length,3,'three chargeable acts');eq(e.pointsRead(p).n,12,'5+2+5');
 eq(e.progressSettle(p,NOW).credits.length,0,'idempotent credit pass');
 eq(e.progressSettle(p,NOW).marks.length,0,'idempotent mark pass');
 yes(p.progress.marks.some(x=>x.k==='first'),'permanent first run receipt');
 const old=JSON.stringify(p.progress);p.rituals=[];p.story.entries=[];p.meter.firsts=[];
 eq(e.pointsRead(p).n,12,'removals do not erase credits');
 yes(e.progressRead(p,NOW).marks.some(x=>x.receipt.k==='first'),'mark persists');
 eq(e.progressWhy(p,p.progress.credits[0].id,NOW).rows[0].status,'removed','lost evidence explained');
 const bad=e.progressApply(p,{credits:[p.progress.credits[0]],marks:[],seen:[]});
 eq(bad.ok,false,'duplicate credit refused');same(p.progress,JSON.parse(old),'apply refusal never mutates');
}
{
 const p=blank();for(let i=0;i<7;i++)p.rituals.push({t:day(-i*2),done:NOW,min:1});
 yes(e.markTest(p,NOW).some(m=>m.k==='week'),'seven days need not be consecutive');
 const first=commit(p);yes(first.marks.some(m=>m.k==='week'),'backfill days date correctly');
 const month=blank();for(let i=0;i<30;i++)month.rituals.push({t:day(-i*2),done:NOW,min:1});
 yes(e.markTest(month,NOW).some(m=>m.k==='month'),'30 days across gaps');
}
{
 const p=blank(),errs=[];
 eq(e.progressValidate(errs,null,'progress').credits.length,0,'legacy record receives blank');
 e.progressValidate(errs,{...p.progress,points:9999},'progress');
 yes(errs.some(x=>x.includes('not held')),'forbid stored totals');
 const err2=[];
 e.progressValidate(err2,{...p.progress,credits:[{id:'ad:999',n:5,r:1,at:NOW}]},'progress');
 yes(err2.some(x=>x.includes('credited event')),'reject forged address');
 const err3=[];
 e.progressValidate(err3,{...p.progress,credits:[{id:'rd:20759',n:40,r:1,at:NOW}]},'progress');
 yes(err3.some(x=>x.includes('published rate')),'reject forged rate');
 const err4=[];
 e.progressValidate(err4,{...p.progress,credits:[{id:'rd:20759',n:7,r:99,at:day(90)}]},'progress');
 eq(err4.length,0,'newer rules and future stamps preserved');
}
{
 const p=blank(),f={allowed:{saboteur:true},present:{saboteur:true},graphReady:true};
 yes(e.progressIntroReady(p,f).includes('i.saboteur'),'eligible tier introduction');
 yes(!e.progressIntroReady(p,f).includes('i.complex'),'tier gate respected');
 eq(e.progressIntroReady(p,{...f,care:true}).length,0,'no introduction during care');
 const saved=e.progressShowIntro(p,'i.saboteur',NOW,f);yes(saved.ok,'eligible introduction receipt');
 p.progress=saved.progress;eq(e.progressIntroReady(p,f).includes('i.saboteur'),false,'shown once');
 const q=blank();const before=JSON.stringify(q);
 const sample=e.progressExample(0,NOW);yes(sample&&sample.points.n>=0,'sample uses engine');
 same(q,JSON.parse(before),'sample does not mutate personal record');
}
console.log('progress seam: '+passed+' assertions passed, 0 failed; no mainline wiring tested');