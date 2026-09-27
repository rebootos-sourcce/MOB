#!/usr/bin/env node
/* ============================================================
   bankvault.js

   WHAT BANK AND VAULT WOULD ACTUALLY COUNT, READ OFF THE SHIPPED ENGINE.
   Round FY in TASKS.md. Evidence for RESEARCH-field-summary-restructure.md.
   Not a gate. Run from the repo root:

     node proto/restructure/bankvault.js

   His words: "When you commit your story, they go to your bank. When you
   release, they go to your vault. And there's a subtle animation on the
   field of what's been added, and you can see the number tick up or tick
   down."

   A counter that ticks is a claim about a quantity, so before anything is
   drawn this asks which quantity. Three the engine already holds could be
   called the bank, and three could be called the vault:

     BANK, loaded     compute().loaded, an address at SQ 4 or over. What the
                      product calls Held today (ui/imprints.js).
     BANK, carrying   compute().carrying, an address holding anything at all.
                      Its own word since 25 September (engine/compute.js).
     BANK, entries    CURP.story.entries.length, the stories committed.

     VAULT, opened    an address released at least once. The engine's own
                      record of that is meterFirst(p,'addr:'+i), a dated first
                      written by relCoolDown (ui/release.js).
     VAULT, cleared   an address a run left at weight 6 of 100 or under, the
                      "cleared entirely" line on the shipped release card.
     VAULT, installed an address whose coherent opposite reads 4 or over with
                      less than 4 held, the "Filled in" count on Imprints.

   Each ICP starts from a blank record, the way a new person would, and
   writes their own story bank (sim/stories.js, written before the lexicon
   was consulted) one entry a day. After each commit a release runs over the
   three heaviest addresses at or above the line, if any, which is the join
   arc90.js already uses. The charge half of relCoolDown is lifted verbatim
   and guarded against its source, exactly as proto/ninety/arc90.js does.

   EVERY NUMBER HERE IS MEASURED off the engine. Which count a person would
   read as "my bank" is JUDGEMENT and is the report's, not this file's.
   ============================================================ */
'use strict';
const path=require('path'), fs=require('fs'), cp=require('child_process');
const ROOT=path.resolve(__dirname,'../..');
const rel=f=>path.join(ROOT,f);
const sh=c=>{try{return cp.execSync(c,{cwd:ROOT,stdio:['ignore','pipe','ignore']}).toString().trim();}catch(e){return '';}};
const md5=f=>require('crypto').createHash('md5').update(fs.readFileSync(rel(f))).digest('hex');
const E=require(rel('engine.js'));
let MEM={}; E.bindStore(k=>MEM[k],(k,v)=>{MEM[k]=v;});
const {STORYBANK}=require(rel('sim/stories.js'));

/* THE LIFT, AND THE GUARD ON IT. The same guard arc90.js carries. */
const RSRC=fs.readFileSync(rel('atuned_src/ui/release.js'),'utf8');
const LIFTOK={take:/w0\*0\.21\+2/.test(RSRC), install:/share\*0\.62/.test(RSRC),
 cleared:/cleared:\(w1<=6\)/.test(RSRC), first:/meterFirst\(CURP,'addr:'\+n\.i/.test(RSRC)};
const CHANM=/var CHAN=(\[[^;]*\]);/.exec(RSRC);
if(!CHANM||!Object.values(LIFTOK).every(Boolean)){
 console.log('ui/release.js no longer carries the arithmetic this file lifts: '+JSON.stringify(LIFTOK));
 process.exit(3);}
const CHAN=Function('return '+CHANM[1])();
const CHANS=CHAN.map(c=>c[0]+c[2]);

function release(p,ids){
 const q=ids.map(i=>E.BY[i]).filter(n=>n&&n.cf);
 const cap=E.meterBudget(p).cap;
 const plan=(q.length&&cap>0)?E.meterPlan(p,q.map(n=>n.i),CHANS,cap):[];
 if(!plan.length)return {ran:false};
 const log=[];
 q.forEach(n=>{const w0=n.sq*10, d=-Math.round(w0*0.21+2), w1=Math.max(0,w0+d);
  const share=Math.abs(d)/10/Math.max(1,q.filter(x=>x.cf===n.cf).length);
  E.S.charge[n.cf]=E.clamp((E.S.charge[n.cf]||0)-share,0,10);
  E.S.replace[n.cf]=E.clamp((E.S.replace[n.cf]||0)+share*0.62,0,10);
  log.push({i:n.i,k:n.k,cf:n.cf,w0:Math.round(w0),w1,cleared:w1<=6});});
 const m=E.meterRun(p,plan);
 E.releaseWork(p,(m&&m.fresh)||[]);
 q.forEach(n=>E.meterFirst(p,'addr:'+n.i,n.k+', '+n.b));
 E.saveProfile(p);
 return {ran:true,log,lines:plan.length};}

function counts(p,cleared){
 const r=E.compute();
 const opened=((p.meter&&p.meter.firsts)||[]).filter(f=>/^addr:/.test(f.k)).length;
 const installed=E.W.filter(n=>n.sq<4&&n.pole>=4).length;
 /* the balance: every address's held weight, summed. Not a count, so it
    moves on every commit and every release, which a count of addresses does
    not. One decimal, the precision the product prints SQ at. */
 const bal=Math.round(E.W.reduce((a,n)=>a+n.sq,0)*10)/10;
 return {loaded:r.loaded.length, carrying:r.carrying.length, bal,
  entries:((p.story&&p.story.entries)||[]).length,
  opened, cleared:Object.keys(cleared).length, installed,
  heavy:r.loaded.slice().sort((a,b)=>b.sq-a.sq)};}

const ORDER=['Sofia','Diane','Marcus','Angela','Derek','James','Ana'];
console.log('bankvault.js  commit '+sh('git rev-parse --short HEAD')
 +'  engine.js md5 '+md5('engine.js')+(sh('git status --porcelain engine.js')?' (dirty)':' (clean)')
 +'  ui/release.js md5 '+md5('atuned_src/ui/release.js'));
console.log('\nOne ICP per block, from a blank record. Each day: commit the next line of their story bank,');
console.log('then release the three heaviest addresses at or above the line if there are any.');
console.log('pend = distinct addresses the sniffer found before commit (what the imprints panel would show).');
console.log('Each count is shown as before > after for the commit and then for the release.\n');

const SUM={};
ORDER.forEach(nm=>{
 const p=E.blankProfile('You'); E.loadProfile(p);
 const bank=(STORYBANK[nm]||[]).map(x=>x[1]);
 const cleared={};
 const row={firstLoadedDay:null, firstCarryDay:null, firstOpenDay:null, firstClearDay:null, firstInstallDay:null,
  commitZeroLoaded:0, commitZeroCarry:0, commits:0, releases:0, conserve:[], dayRows:[]};
 console.log('== '+nm+', '+bank.length+' entries ==');
 console.log(['day','pend','loaded','carrying','balance','entries','| release','opened','cleared','installed','loaded moved by release','balance after release','addresses released'].join('\t'));
 bank.forEach((t,di)=>{
  const d=di+1;
  const ps=E.parseStory(t);
  const pend=new Set(ps.imprints.map(x=>x.node)).size;
  const c0=counts(p,cleared);
  E.applyStory(t); E.verpApply(t); E.leanApply(t);
  p.story.entries.push({t:new Date().toISOString(),text:t,imprints:ps.imprints.length,bands:ps.bands});
  E.saveProfile(p);
  const c1=counts(p,cleared);
  row.commits++;
  if(c1.loaded===c0.loaded)row.commitZeroLoaded++;
  if(c1.carrying===c0.carrying)row.commitZeroCarry++;
  if(c1.loaded&&row.firstLoadedDay===null)row.firstLoadedDay=d;
  if(c1.carrying&&row.firstCarryDay===null)row.firstCarryDay=d;
  let rr={ran:false}, c2=c1;
  /* the pool the shipped Field's own Run a release builds (ui/personas.js,
     the #bRel handler): the heaviest at or over the line, and when there are
     none, the heaviest still carrying anything. Three, the Story panel's own
     default count (ST_RELN in ui/storyui.js). */
  const pool=c1.heavy.length?c1.heavy:E.compute().carrying;
  if(pool.length){
   rr=release(p,pool.slice(0,3).map(n=>n.i));
   if(rr.ran){row.releases++; rr.log.forEach(x=>{if(x.cleared)cleared[x.i]=1;});}
   c2=counts(p,cleared);
   if(rr.ran)row.conserve.push({released:rr.log.length, loadedDrop:c1.loaded-c2.loaded, carryDrop:c1.carrying-c2.carrying});}
  if(c2.opened&&row.firstOpenDay===null)row.firstOpenDay=d;
  if(c2.cleared&&row.firstClearDay===null)row.firstClearDay=d;
  if(c2.installed&&row.firstInstallDay===null)row.firstInstallDay=d;
  row.dayRows.push({d,pend,c0,c1,c2,ran:rr.ran});
  if(c1.bal===c0.bal)row.commitZeroBal=(row.commitZeroBal||0)+1;
  console.log([d,pend,c0.loaded+'>'+c1.loaded,c0.carrying+'>'+c1.carrying,c0.bal+'>'+c1.bal,c0.entries+'>'+c1.entries,
   '| '+(rr.ran?'ran':'none'),c1.opened+'>'+c2.opened,c1.cleared+'>'+c2.cleared,c1.installed+'>'+c2.installed,
   rr.ran?(c1.loaded+'>'+c2.loaded):'-', rr.ran?(c1.bal+'>'+c2.bal):'-',
   rr.ran?rr.log.map(x=>x.k+' '+x.w0+'>'+x.w1).join('; '):'-'].join('\t'));});
 SUM[nm]=row;
 console.log('');});

console.log('============================================================');
console.log('SUMMARY. Measured.');
console.log('============================================================');
console.log(['who','commits','commit left loaded unmoved','commit left carrying unmoved','first day loaded>0','first day carrying>0','first vault (opened)','first vault (cleared)','first vault (installed)','releases','release: addresses in, loaded out'].join('\t'));
ORDER.forEach(nm=>{const r=SUM[nm];
 console.log([nm,r.commits,r.commitZeroLoaded,r.commitZeroCarry,r.firstLoadedDay||'never',r.firstCarryDay||'never',
  r.firstOpenDay||'never',r.firstClearDay||'never',r.firstInstallDay||'never',r.releases,
  r.conserve.map(c=>c.released+'>'+c.loadedDrop).join(' ')].join('\t'));});
const all=ORDER.map(n=>SUM[n]);
const tot=k=>all.reduce((a,r)=>a+r[k],0);
const cons=[].concat(...all.map(r=>r.conserve));
const oneToOne=cons.filter(c=>c.loadedDrop===c.released).length;
console.log('\nAcross '+ORDER.length+' ICPs and '+tot('commits')+' commits:');
console.log('  a commit that left the loaded count (Held today) where it was: '+tot('commitZeroLoaded')+' of '+tot('commits'));
console.log('  a commit that left the carrying count where it was:            '+tot('commitZeroCarry')+' of '+tot('commits'));
console.log('  a commit that left the balance (summed weight) where it was:   '+all.reduce((a,r)=>a+(r.commitZeroBal||0),0)+' of '+tot('commits'));
console.log('  first commit of each ICP that moved loaded: '+all.filter(r=>r.dayRows[0]&&r.dayRows[0].c1.loaded>r.dayRows[0].c0.loaded).length+' of '+ORDER.length
 +'; moved carrying: '+all.filter(r=>r.dayRows[0]&&r.dayRows[0].c1.carrying>r.dayRows[0].c0.carrying).length+' of '+ORDER.length);
console.log('  releases run: '+cons.length+'. Releases where loaded dropped by exactly the number of addresses released: '+oneToOne+' of '+cons.length);
console.log('  loaded drop per release, all runs: '+cons.map(c=>c.loadedDrop).join(' '));
console.log('\nTHE WORD ALREADY IN USE. engine/plan.js planAllowance says "banked" for patterns carried past a');
const bp=E.blankProfile('You');
const said=E.planAllowance(Object.assign({},bp.plan,{k:'free'}),130);
console.log('week\'s grant. Measured on a free plan past the gift: "'+said.say+'". It prints in the profile sheet');
console.log('as New ground (ui/panels.js). DECISIONS.md line 58 already rules "The bank is the imprints".');

/* ============================================================
   PART TWO. A PERSON ALREADY CARRYING SOMETHING.

   Part one is a stranger, and on the shipped sniffer a stranger's first
   week mostly lands under the line. So the vault needs reading on somebody
   who has load to release. Each ICP's reference charge, opposite and laws
   (engine/data/people.js and LAWSET, the same tables loadP reads) are put on
   a blank record, and ten releases run, one a day, over the three heaviest
   addresses at or above the line. MEASURED.
   ============================================================ */
console.log('\n============================================================');
console.log('PART TWO. Ten releases from each ICP\'s reference field. Measured.');
console.log('============================================================');
console.log('The pool is the shipped Field button\'s: the three heaviest at or over the line, else the three');
console.log('heaviest still carrying (ui/personas.js #bRel).');
console.log('Per run: loaded before > after, opened (vault as "released once"), cleared (vault as "run');
console.log('left it at 6 of 100 or under"), installed (vault as "opposite in"), and the three addresses.');
const SUM2={};
ORDER.forEach(nm=>{
 const P=E.PEOPLE.find(x=>x.nm===nm);
 const p=E.blankProfile('You');
 const LS=E.LAWSET[nm]||{};
 E.SINAMES.forEach(l=>{p.laws[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:null);});
 E.loadProfile(p);
 /* the blueprint too, the way loadP sets it, because susceptibility reads the
    domain and the archetypes and without them the field is somebody else's */
 E.S.dom=P.dom; E.S.a1=P.a1; E.S.a2=P.a2;
 E.S.doms=P.doms?P.doms.slice():[P.dom]; E.S.arcs=P.arcs?P.arcs.slice():[P.a1,P.a2];
 E.S.roots=P.roots?P.roots.slice():[]; E.buildSoul();
 E.CHARGES.forEach(c=>{E.S.charge[c]=(P.c&&P.c[c]!==undefined)?P.c[c]:0; E.S.replace[c]=(P.rep&&P.rep[c])||0;});
 E.SINAMES.forEach(l=>{E.S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.S.law[l]);});
 const cleared={};
 const c0=counts(p,cleared);
 const row={start:c0, runs:[], firstClear:null, firstInstall:null, emptied:null};
 /* emptied: the first run that found nothing at or over the line and fell
    back to the heaviest under it, the way the shipped button does */
 console.log('\n== '+nm+' starts: loaded '+c0.loaded+', carrying '+c0.carrying+', installed '+c0.installed+' ==');
 for(let d=1;d<=10;d++){
  const a=counts(p,cleared);
  const pool=a.heavy.length?a.heavy:E.compute().carrying;
  if(!a.heavy.length&&row.emptied===null)row.emptied=d;
  if(!pool.length){console.log('  run '+d+': nothing carrying, release refused'); continue;}
  const rr=release(p,pool.slice(0,3).map(n=>n.i));
  if(!rr.ran){console.log('  run '+d+': refused by the allowance'); continue;}
  rr.log.forEach(x=>{if(x.cleared)cleared[x.i]=1;});
  const b=counts(p,cleared);
  row.runs.push({d, balIn:a.bal, balOut:b.bal, loadedIn:a.loaded, loadedOut:b.loaded, released:rr.log.length, opened:b.opened, cleared:b.cleared, installed:b.installed,
   carryIn:a.carrying, carryOut:b.carrying});
  if(b.cleared&&row.firstClear===null)row.firstClear=d;
  if(b.installed>c0.installed&&row.firstInstall===null)row.firstInstall=d;
  console.log('  run '+d+': loaded '+a.loaded+'>'+b.loaded+'  carrying '+a.carrying+'>'+b.carrying+'  balance '+a.bal+'>'+b.bal
   +'  opened '+a.opened+'>'+b.opened+'  cleared '+a.cleared+'>'+b.cleared+'  installed '+a.installed+'>'+b.installed
   +'  ['+rr.log.map(x=>x.k+' '+x.w0+'>'+Math.round(x.w1)).join('; ')+']');}
 SUM2[nm]=row;});
console.log('\nSUMMARY, part two.');
console.log(['who','loaded at start','runs','first run under the line','loaded after last run','carrying after last','opened after last','first cleared run','cleared after last','first new installed run','release where loaded fell by exactly 3'].join('\t'));
ORDER.forEach(nm=>{const r=SUM2[nm], L=r.runs[r.runs.length-1]||{};
 const exact=r.runs.filter(x=>x.loadedIn-x.loadedOut===x.released).length;
 console.log([nm,r.start.loaded,r.runs.length,r.emptied||'never',L.loadedOut!==undefined?L.loadedOut:'-',L.carryOut!==undefined?L.carryOut:'-',L.opened||0,r.firstClear||'never',L.cleared||0,r.firstInstall||'never',exact+' of '+r.runs.length].join('\t'));});
const R2=[].concat(...ORDER.map(n=>SUM2[n].runs));
const drops=R2.map(x=>x.loadedIn-x.loadedOut);
console.log('\nAll '+R2.length+' runs: loaded fell by '+JSON.stringify(drops.reduce((m,v)=>{m[v]=(m[v]||0)+1;return m;},{}))
 +' (drop: how many runs). Three addresses went in every time.');
console.log('Balance fell on '+R2.filter(x=>x.balOut<x.balIn).length+' of '+R2.length+' runs; carrying fell on '+R2.filter(x=>x.carryOut<x.carryIn).length+' of '+R2.length+'.');
console.log('After the last run each ICP could make, carrying still reads: '+ORDER.filter(n=>SUM2[n].runs.length).map(n=>{const r=SUM2[n].runs;return n+' '+r[r.length-1].carryOut+' (balance '+r[r.length-1].balOut+')';}).join(', ')+'.');
