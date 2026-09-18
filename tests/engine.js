/* Engine gate. No browser, no DOM, no renderers. Runs in milliseconds.
   Asserts the CONTRACT, not the current numbers, so a legitimate tuning
   change does not fail it but a broken invariant does. */
/* run from the repo root, like the browser gates do. BUILD-engine.sh writes
   engine.js there. an absolute path would only ever be right on one machine. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {S,CHILD,CHARGES,SI,SINAMES,BANDS,W,NODES,DOMAINS,ARCH,MASKS,SAB33,
       PEOPLE,LAWSET,PRACTICE,EXPR,compute,buildSoul,accuracy,meterFirst,
       julianDay,sunLon,moonLon,designJD,GATE_WHEEL,chineseYear,usDST}=E;
let P=0,F=0,GRP='';
const g=n=>{GRP=n;console.log('\n'+n);};
const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
const near=(a,b,t,m)=>ok(Math.abs(a-b)<=t,m+'  ('+a+' vs '+b+' +/-'+t+')');

/* every test starts from the same field */
function reset(held,opp,law){
 S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=held!==undefined?held:0;S.replace[c]=opp||0;});
 SINAMES.forEach(l=>S.law[l]=law!==undefined?law:6);
 E.VERPMIX.aware=E.VERPMIX.detach=E.VERPMIX.intent=0;
 E.VERPMIX.ignore=E.VERPMIX.attach=E.VERPMIX.averse=0;
 E.LEANMIX.benign=E.LEANMIX.malignant=0;
 return compute();}

g('1 · data integrity');
/* 112 nodes total. the working array is the somatic set, the remainder are the
   four field anchors, and the total is the number that gets said out loud. */
ok(NODES.length===112,'112 nodes, got '+NODES.length);
ok(W.length+4===NODES.length,'the somatic set plus 4 field anchors is the total, got '+W.length);
ok(CHILD.length===9,'9 poled axes');
ok(SI.length===21,'21 laws');
ok(DOMAINS.length===19,'19 domains');
ok(ARCH.length===12,'12 archetypes');
ok(MASKS.length===6,'6 masks');
ok(SAB33.length===33,'33 saboteurs');
ok(PRACTICE.length===17,'17 practices');
ok(EXPR.length===10,'10 expressions');
ok(new Set(NODES.map(n=>n.i)).size===112,'node ids unique');
ok(W.every(n=>BANDS.includes(n.b)),'every address seats at a known band');
ok(SI.every(l=>BANDS.includes(l.b)),'every law seats at a known band');
ok(W.filter(n=>!n.cf).length===1,'exactly one address has no fetter (Root_08, his open ruling)');
ok(SAB33.every(r=>r[1].every(p=>p[1]<=p[2])),'every saboteur range is lo<=hi');

g('2 · determinism');
const a1=reset(4,0,6), a2=reset(4,0,6);
ok(a1.CQ===a2.CQ&&a1.DQ===a2.DQ&&a1.sabs.length===a2.sabs.length,'same input, same output');
ok(JSON.stringify(W.map(n=>n.sq))===JSON.stringify(W.map(n=>n.sq)),'address state stable');

g('3 · the poled binary');
let r=reset(0,0,6);
ok(W.every(n=>n.sq===0),'nothing held, every SQ is 0');
ok(W.every(n=>n.pole===0),'nothing installed, every pole is 0');
ok(W.every(n=>n.jq===0),'no overshoot at rest');
ok(r.DQ===0,'DQ is 0 on an empty field');
r=reset(8,0,6);
ok(r.DQ>0,'held charge produces DQ');
ok(W.some(n=>n.sq>=4),'held charge loads addresses');
r=reset(8,8,6);
const withOpp=r.DQ;
ok(withOpp<reset(8,0,6).DQ,'installing the opposite lowers DQ');
g('   jouissance begins at 6');
[0,3,5,6].forEach(v=>{reset(0,v,6);
 ok(W.every(n=>n.jq===0),'opposite '+v+' is not yet overshoot');});
[7,9,10].forEach(v=>{reset(0,v,6);
 ok(W.some(n=>n.jq>0),'opposite '+v+' registers as overshoot');});
r=reset(0,10,6);
ok(r.JQ>0&&r.excess.length>0,'full overshoot names the excess addresses');

g('4 · monotonicity');
let prev=-1,mono=true;
for(let v=0;v<=10;v+=1){const x=reset(v,0,6); if(x.DQ<prev-1e-9)mono=false; prev=x.DQ;}
ok(mono,'DQ never falls as held charge rises');
prev=1e9;mono=true;
for(let v=0;v<=10;v+=1){const x=reset(v,0,6); if(x.CQ>prev+1e-9)mono=false; prev=x.CQ;}
ok(mono,'CQ never rises as held charge rises');
prev=-1;mono=true;
for(let v=0;v<=10;v+=1){const x=reset(0,0,v); if(x.CQ<prev-1e-9)mono=false; prev=x.CQ;}
ok(mono,'CQ never falls as integrity rises');

g('5 · CQ bounds and the ceiling');
r=reset(0,0,10);
near(r.CQ,100,0.001,'all laws 10, nothing held, CQ is 100');
ok(r.tier==='Mastery','and the tier is Mastery');
r=reset(10,0,0);
ok(r.CQ>=0,'CQ never goes below 0');
ok(r.tier==='Collapsed','all laws 0, everything held, tier is Collapsed');
for(let h=0;h<=10;h+=2)for(let l=0;l<=10;l+=2){
 const x=reset(h,0,l);
 if(x.CQ<0||x.CQ>100){ok(false,'CQ out of range at held '+h+' law '+l);}}
ok(true,'CQ stays inside 0..100 across the grid');
ok(reset(0,0,10).Rz>=1&&reset(10,0,0).Rz>=1,'resistance never drops below its floor of 1');

g('6 · SAB33 ranges are bands, not floors');
/* Controller is fear 7..10 + anger 5..8 */
function fitFor(name,fear,anger){
 reset(0,0,6); S.charge.Fear=fear; S.charge.Anger=anger;
 const hit=E.sab33Detect().filter(d=>d.nm===name)[0];
 return hit?{score:hit.score,exact:hit.exact}:null;}
const inside=fitFor('Controller',8,6);
ok(inside&&inside.score===100&&inside.exact,'inside both bands scores 100 and exact');
const below=fitFor('Controller',2,1);
ok(!below||below.score<100,'below the band does not score 100: the saboteur has not formed');
const above=fitFor('Victim',10,10);   /* Victim is sadness 6..8 + anger 4..6 */
ok(!above||!above.exact,'above the band is not exact: the charge escalated past it');
ok(fitFor('Controller',6,6).score<100,'one step below lo is adjacent, not inside');

g('7 · the six gates multiply resistance');
r=reset(6,0,6);
const baseRz=r.Rz, baseCQ=r.CQ;
near(r.vf,1,1e-9,'no story means no gate evidence, factor is 1');
reset(6,0,6); E.verpApply('i could not stop going over it and it had me');
const att=compute();
ok(att.vf>1,'an attachment story costs more than 1');
ok(att.Rz>baseRz&&att.CQ<baseCQ,'and it raises resistance, lowering CQ');
reset(6,0,6); E.verpApply('i let it pass and i stayed out of the story and i let it go');
const det=compute();
ok(det.vf<1,'a detachment story costs less than 1');
ok(det.CQ>baseCQ,'and it raises CQ');
reset(0,0,6);
const sh=E.verpRead();
ok(sh.length===6&&sh.every(v=>v.mult>0),'six gates, each with a multiplier');
ok(sh.filter(v=>v.side==='higher').length===3&&sh.filter(v=>v.side==='lower').length===3,
   'three higher, three lower');

g('8 · the lean');
reset(0,0,6);
let L=E.leanRead(compute());
ok(L.cues===0&&L.src==='field only','no story, the field speaks alone');
E.leanApply('i was wrong and i said sorry and i told the truth and i let it go and i owned it');
const good=E.leanRead(compute());
ok(good.cues>0,'benign cues register');
reset(0,0,6); E.leanApply('their fault they always do this not my problem they owe me i had no choice');
const bad=E.leanRead(compute());
ok(bad.mal>good.mal,'malignant language leans further malignant than benign language');
near(good.ben+good.mal,100,0.001,'benign and malignant are one field, summing to 100');

g('9 · schema round trip');
reset(5,2,7); S.doms=[3,7]; S.arcs=[2,5]; S.roots=['Engine']; buildSoul();
const before=compute();
const prof=E.blankProfile('round trip');
E.saveProfile(prof);
const json=JSON.stringify(prof);
reset(0,0,0);                                  /* wipe the field */
E.loadProfile(JSON.parse(json));
const after=compute();
near(after.CQ,before.CQ,1e-9,'CQ survives export and import');
near(after.DQ,before.DQ,1e-9,'DQ survives');
ok(JSON.stringify(S.doms)===JSON.stringify([3,7]),'soul survives');
ok(prof.v===E.SCHEMA_V,'schema version stamped');
ok(Object.keys(prof.axes).length===9&&Object.keys(prof.laws).length===21,
   '9 axes and 21 laws in the object');
const snap=E.snapshot(prof);
ok(Object.keys(snap).length===15,'snapshot is 15 derived fields, got '+Object.keys(snap).length);
ok(!('charge' in snap)&&!('law' in snap),'snapshot holds no inputs');

g('10 · intake, partial scoring');
const p2=E.blankProfile('intake');
ok(Object.values(p2.laws).every(v=>v===null),'laws start null, never defaulted in storage');
ok(E.iqList().length===63,'63 questions');
ok(Object.keys(E.iqScore(p2)).length===0,'nothing answered, nothing scored');
for(let i=0;i<15;i++)p2.intake.answers[i]=6;        /* 15 answers = 5 laws */
const sc5=E.iqScore(p2);
ok(Object.keys(sc5).length===5,'15 answers score exactly 5 laws, got '+Object.keys(sc5).length);
E.iqApply(p2); const partial=compute();
ok(partial.CQ>0&&partial.CQ<=100,'and produce a usable CQ');
const p3=E.blankProfile('spread');
p3.intake.answers[0]=9;p3.intake.answers[1]=2;p3.intake.answers[2]=6;
const s1=E.iqScore(p3)[SI[0].nm];
near(s1.spread,7,0.001,'spread is max minus min');
ok(s1.reliable,'a spread of 7 is callable');
ok(/costs/.test(s1.lean),'and names which context holds');
const p4=E.blankProfile('noise');
p4.intake.answers[0]=6;p4.intake.answers[1]=5;p4.intake.answers[2]=6;
const s2=E.iqScore(p4)[SI[0].nm];
ok(!s2.reliable&&/noise/.test(s2.lean),'a spread under 3 is inside measurement noise');

g('11 · the sniffer');
reset(3,0,6);
const parsed=E.parseStory('i felt humiliated and i could not stop going over it, '+
 'and i just wanted to wrap myself in a blanket');
ok(parsed.hits.length>0,'finds tags');
ok(parsed.imprints.length>0,'routes them to addresses');
ok(parsed.imprints.every(i=>E.BY[i.node]),'every imprint names a real address');
ok(parsed.imprints.every(i=>i.amt>0),'every imprint carries weight');
const seats=new Set(parsed.imprints.map(i=>i.band));
ok(seats.size>1,'weight distributes across seats rather than collapsing onto one');
const heart=parsed.imprints.filter(i=>i.band==='Heart');
ok(heart.length===0||heart.every(i=>i.fetter==='Sad'),
   'despair at the heart files as Sad, not as Shame');
const b4=Object.assign({},S.charge);
E.applyStory('i felt humiliated and i could not stop');
ok(CHARGES.some(c=>S.charge[c]>b4[c]),'applying a story raises charge');
ok(CHARGES.every(c=>S.charge[c]<=10),'and never past 10');
reset(6,0,6); const calmBefore=Object.assign({},S.charge);
E.applyStory('i felt calm and grateful and settled and peaceful');
ok(CHARGES.some(c=>S.charge[c]<calmBefore[c]),'coherent words pull the other way');

g('12 · expression is a deficit model');
reset(0,0,10);
ok(E.exprRead().every(e=>e.fill>9.9),'clear field and open laws, expression is full');
reset(9,0,3);
const leaks=E.exprRead();
ok(leaks.every(e=>e.leak>0),'loaded field leaks on every expression');
ok(leaks.every(e=>e.fill>=0&&e.fill<=10),'fill stays in range');
ok(leaks.every(e=>Math.abs(e.fill+e.leak-10)<1e-9),'fill and leak always sum to 10');

g('13 · accuracy');
/* the profile goes in as an argument. nothing here has to be the current one. */
const blank={laws:{},intake:{answers:{}}};
const meas={laws:{},intake:{answers:{}}};
SI.forEach((l,i)=>{meas.laws[l.nm]=7;
 for(let t=0;t<3;t++)meas.intake.answers[i*3+t]=7-t*2;});
reset(0,0,6);
const none=accuracy(compute(),blank);
const full=accuracy(compute(),meas);
ok(full.pct>none.pct,'measuring the laws raises identification');
ok(full.band<none.band,'and narrows the interval');
ok(none.pct>=8.3&&full.pct<=99,'accuracy stays inside its clamp');
ok(none.cov===0&&full.cov===21,'coverage counts the laws actually measured');
reset(8,0,6);
ok(accuracy(compute(),meas).pct>full.pct,'a loaded field carries more signal than an empty one');

g('14 · the chain compounds in order');
reset(9,0,3);
r=compute();
ok(r.sabs.length>0,'saboteurs fire');
ok(r.cxs.every(c=>c.parts.length===2),'a complex is exactly two saboteurs');
ok(r.hys.every(h=>h.parts.length>=1),'a hyper-complex draws on complexes');
ok(r.sups.every(u=>u.parts.length===2),'a character layer is two hyper');
ok(r.cxs.every(c=>c.parts.every(p=>r.sabs.includes(p))),'complexes only cite live saboteurs');
ok(r.hys.every(h=>h.parts.every(p=>r.cxs.includes(p))),'hyper only cite live complexes');
ok(r.maskRing.length===6,'six masks always present');
ok(r.maskRing.every(m=>m.w>=0),'mask load is never negative');

g('15 · every persona computes');
PEOPLE.forEach(p=>{
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._);
 const x=compute();
 ok(x.CQ>=0&&x.CQ<=100,p.nm+': CQ in range');
 ok(!isNaN(x.DQ)&&!isNaN(x.SQm)&&!isNaN(x.radiance),p.nm+': no NaN in the instruments');
 ok(BANDS.includes(x.darkB),p.nm+': darkest seat is a real seat');
 ok(typeof x.tier==='string'&&x.tier.length>0,p.nm+': named a tier');
 ok(x.loaded.length<=W.length,p.nm+': cannot load more than it has');
});
const ref=n=>{const p=PEOPLE.find(x=>x.nm===n);
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[n];SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._);
 return compute();};
ok(ref('Rosa').CQ>ref('Ana').CQ,'the cleared reference case reads higher than the one mid-crisis');
ok(ref('Ana').CQ>ref('Gordon').CQ,'and mid-crisis reads higher than the collapsed one');
ok(ref('Rosa').loaded.length===0,'Rosa holds nothing');
ok(ref('Gordon').loaded.length>90,'Gordon holds nearly everything');


g('15d \u00b7 the meter');
{
 const {blankProfile,saveProfile,validateProfile,meterRun,meterRead,meterKey,MARKERS}=E;
 const p=blankProfile('meter');
 ok(meterRead(p).unique===0&&meterRead(p).lines===0,'a new record has run nothing');
 ok(meterRead(p).giftLeft===100&&meterRead(p).inGift,'and holds the whole gift of 100');
 const sweep=['believe','perceive','think','behave','act','feel'].map(c=>meterKey(7,c));
 const a=meterRun(p,sweep);
 ok(a.added===6&&a.repeated===0,'a six channel sweep over one address opens six');
 ok(meterRead(p).unique===6&&meterRead(p).lines===6,'six new, six spoken');
 /* rerunning the same ground is free. that is the whole distinction the
    tier ladder buys: not how much you may speak, how much new you may open. */
 const b=meterRun(p,sweep);
 ok(b.added===0&&b.repeated===6,'a rerun opens nothing');
 ok(meterRead(p).unique===6,'and the unique count does not move');
 ok(meterRead(p).lines===12,'while the lines spoken do');
 ok(meterRead(p).giftLeft===94,'the gift is spent by new ground only');
 ok(typeof p.meter.first==='string','the first run is stamped');
 ok(meterRun(p,[]).added===0,'an empty run adds nothing');
 /* the horizon. two thousand a decade, so age times two hundred. */
 ok(meterRead(p).estimate===null,'with no birth date there is no estimate');
 p.who.born.date='1986-04-02';
 const h=meterRead(p,'2026-09-18T00:00:00Z');
 ok(h.age>40&&h.age<41,'age comes off the birth date, got '+h.age);
 /* age is rounded for display, the estimate is not, so they agree to within
    one year's worth rather than exactly. */
 ok(Math.abs(h.estimate-h.age*200)<200,'the estimate is two hundred a year, got '+h.estimate);
 ok(h.estimateLow<h.estimate&&h.estimateHigh>h.estimate,'and carries its ten percent swing');
 /* Six fixed distances on one ruler, from the owner's own ladder. Entry at
    the first address, then Buddha nature, Integration, Field awareness,
    Liberation, Ascension. */
 ok(h.markers.length===6,'six markers, got '+h.markers.length);
 const MAT=h.markers.map(m=>m.at).join();
 /* The codex names five developmental thresholds and prints a distance beside
    each one. The last of them reads "Ascension (11,664)", which is the square of
    the node count and is not a round number waiting to be rounded. The engine
    shipped 12,000 against it. The distances are quotations, so they are pinned
    here by value and any change to one is a change to the book. */
 ok(MAT==='1,2500,3500,4500,10000,11664','the ladder is the owner\'s thresholds, got '+MAT);
 ok(h.markers[5].at===108*108,'and ascension is the node count squared, got '+h.markers[5].at);
 ok(h.markers.every((m,i)=>i===0||m.at>h.markers[i-1].at),'and they only ever go up');
 const bn=h.markers.filter(m=>m.nm==='Buddha nature')[0];
 ok(bn&&bn.left===2500-h.unique,'a marker reports the ground left to it');
 /* one direction, not six. the next unreached marker only. */
 ok(h.next&&h.next.left>0,'the meter names the next marker and how far, got '
  +(h.next?h.next.nm+' '+h.next.left:'none'));
 /* a marker is a distance, never a gate. nothing in the engine may unlock
    at one, because unique ground is exactly what a tier sells. */
 ok(h.markers.every(m=>!('unlocks' in m)&&!('grants' in m)),
  'no marker carries an unlock, because a marker that unlocks is for sale');

 /* a dated first: a fact about the work that cannot be taken away */
 const f1=meterFirst(p,'addr:7','Fear, Root');
 ok(f1&&f1.t&&f1.nm==='Fear, Root','a first records what and when');
 ok(meterFirst(p,'addr:7')===null,'and a first only happens once');
 ok(meterRead(p).firsts.length===1,'the meter reports it, got '+meterRead(p).firsts.length);
 /* and it has to survive the boundary. meterFirst wrote them, meterRead
    returned them, and validateProfile copied four meter fields and not this
    one, so every dated first was lost through an import. It is the only
    achievement shape this product allows, which made the boundary the one
    place that could silently delete the whole record of it. */
 {
  const bp=E.blankProfile('firsts');
  meterFirst(bp,'addr:7','Fear, Root'); meterFirst(bp,'seat:Root','first at the root');
  const rt=E.validateProfile(JSON.parse(JSON.stringify(bp)));
  ok(rt.ok,'a profile carrying dated firsts validates');
  ok(rt.profile.meter.firsts.length===2,
   'and they survive the boundary, got '+rt.profile.meter.firsts.length);
  ok(rt.profile.meter.firsts[0].k==='addr:7'&&rt.profile.meter.firsts[0].nm==='Fear, Root',
   'with their key and label intact');
  /* a poisoned entry is refused by name, never clamped or quietly dropped */
  const bad=JSON.parse(JSON.stringify(bp));
  bad.meter.firsts.push({k:'x'.repeat(200),t:'not a date'});
  ok(E.validateProfile(bad).ok===false,'a first that is not a dated first is refused');
 }
 p.who.born.date='not a date';
 ok(meterRead(p).estimate===null,'an unparseable birth date gives no estimate rather than a wrong one');
 p.who.born.date='1986-04-02';
 const round=validateProfile(JSON.parse(JSON.stringify(saveProfile(p))));
 ok(round.ok&&round.profile.meter.unique.length===6,'the keys survive a round trip');
 const neg=JSON.parse(JSON.stringify(saveProfile(p))); neg.meter.lines=-5;
 ok(!validateProfile(neg).ok,'a negative line count is refused at the boundary');
 const notlist=JSON.parse(JSON.stringify(saveProfile(p))); notlist.meter.unique='lots';
 ok(!validateProfile(notlist).ok,'and a unique list that is not a list');
 /* a snapshot is typed numbers, and the record calls toFixed on them, so an
    unchecked history crashes the first render after an import. */
 const bh=JSON.parse(JSON.stringify(saveProfile(p))); bh.history=[{},{cq:'nope',tier:null}];
 ok(!validateProfile(bh).ok,'a poisoned history is refused');
 const gh=JSON.parse(JSON.stringify(saveProfile(p)));
 gh.history=[{t:'2026-01-01T00:00:00Z',cq:40,dq:3,sq:2,pole:0.1,jq:0,rad:0.5,
  loaded:4,sab:1,cx:0,hy:0,ch:0,dark:'Root',tier:'Incoherent',arch:'Sage'}];
 const ghv=validateProfile(gh);
 ok(ghv.ok&&ghv.profile.history.length===1&&typeof ghv.profile.history[0].cq==='number',
  'and a real one round trips as numbers');
}

g('15c \u00b7 the boundary');
{
 const {blankProfile,saveProfile,validateProfile,pImport,importError,profiles,current,bindStore}=E;
 /* a profile the app wrote goes through unchanged */
 const good=saveProfile(blankProfile('round'));
 const v=validateProfile(JSON.parse(JSON.stringify(good)));
 ok(v.ok,'a profile the app wrote validates: '+JSON.stringify(v.errs||[]).slice(0,120));
 /* the charge of 9999 the project has carried as a known hole */
 const bad=JSON.parse(JSON.stringify(good)); bad.axes.Fear.held=9999;
 const b=validateProfile(bad);
 ok(!b.ok,'a charge of 9999 is refused');
 ok(/9999/.test(String(b.errs)),'and the refusal names the value: '+b.errs);
 /* every other way in */
 const cases=[
  ['law out of range', p=>{p.laws.Truth=50;}],
  ['law not a number', p=>{p.laws.Truth='high';}],
  ['charge not a number', p=>{p.axes.Anger.held='lots';}],
  ['domain index off the table', p=>{p.soul.doms=[999];}],
  ['archetype index off the table', p=>{p.soul.arcs=[99];}],
  ['answer key off the 63', p=>{p.intake.answers[99]=5;}],
  ['answer out of range', p=>{p.intake.answers[0]=11;}],
  ['gate count negative', p=>{p.gates.verp.aware=-3;}],
  ['seed type invented', p=>{p.seed={type:'XXXX',axes:{}};}],
  ['schema version from the future', p=>{p.v=99;}]];
 cases.forEach(c=>{
  const x=JSON.parse(JSON.stringify(good)); c[1](x);
  ok(!validateProfile(x).ok,c[0]+' is refused');});
 /* a missing field is an older profile, not corruption */
 const old=JSON.parse(JSON.stringify(good));
 delete old.who; delete old.seed; delete old.gates; old.v=1;
 ok(validateProfile(old).ok,'a v1 profile with no who, seed or gates still loads');
 /* not an object at all */
 ok(!validateProfile(null).ok&&!validateProfile([1,2]).ok&&!validateProfile('x').ok,
  'null, an array and a string are all refused');
 /* ATOMIC. a refused import must leave the app exactly as it was. */
 bindStore(function(){return null;},function(){});
 const before=JSON.stringify(profiles()), n=profiles().length, curBefore=current();
 ok(pImport('{ not json')===null,'malformed JSON returns null');
 ok(String(importError()).length>0,'and says why: '+importError());
 const poison=JSON.parse(JSON.stringify(good)); poison.axes.Fear.held=9999;
 ok(pImport(JSON.stringify(poison))===null,'a poisoned profile is not imported');
 ok(profiles().length===n,'the profile list is untouched, '+n+' before, '+profiles().length+' after');
 ok(JSON.stringify(profiles())===before,'and nothing inside it moved');
 ok(current()===curBefore,'the current profile did not move');
 /* a valid profile that cannot be saved must also roll back, not half land */
 bindStore(function(){return null;},function(){throw new Error('QuotaExceeded');});
 ok(pImport(JSON.stringify(good))===null,'an unsaveable import is refused');
 ok(profiles().length===n&&current()===curBefore,'and rolls the list and the current profile back');
 ok(/could not save/.test(String(importError())),'and says the save failed: '+importError());
}

g('15b \u00b7 the seed');
{
 const {blankProfile,seedAxes,seedApply,seedClear,seedShare,seedValid,TYPE16,CHARGES,read}=E;
 ok(TYPE16.length===16,'sixteen types, got '+TYPE16.length);
 ok(seedValid('ENTP')&&!seedValid('XXXX'),'a type is validated before it is written');
 const seen={}; let dup=0;
 TYPE16.forEach(t=>{const k=JSON.stringify(seedAxes(t)); if(seen[k])dup++; seen[k]=1;});
 ok(dup===0,'every type seeds a distinct pattern, '+dup+' collide');
 TYPE16.forEach(t=>{const a=seedAxes(t);
  CHARGES.forEach(c=>{ if(a[c]<0||a[c]>10) ok(false,t+' put '+c+' out of range at '+a[c]); });});
 ok(true,'every seeded charge stays inside 0 to 10');
 const p=blankProfile('seed');
 const before=JSON.stringify(p.laws)+JSON.stringify(p.gates)+JSON.stringify(p.soul);
 seedApply(p,'ENTP');
 ok(p.seed&&p.seed.type==='ENTP','the seed records what it wrote');
 ok(JSON.stringify(p.laws)+JSON.stringify(p.gates)+JSON.stringify(p.soul)===before,
  'the seed writes charge only, never a law, a gate or a domain');
 ok(seedShare(p)===1,'a fresh seed is all seed, got '+seedShare(p));
 p.axes.Fear.held=9; p.axes.Anger.held=1;
 const mid=seedShare(p);
 ok(mid>0&&mid<1,'the share falls as the person moves the axes, got '+mid);
 /* seeding twice re-seeds from the base rather than compounding */
 seedApply(p,'ENTP');
 ok(seedShare(p)===1&&JSON.stringify(p.axes.Fear.held)==='2.8',
  're-seeding starts from the base, Fear reads '+p.axes.Fear.held);
 const r=read(p,{});
 ok(typeof r.reading.CQ==='number'&&r.reading.CQ>=0&&r.reading.CQ<=100,'a seeded profile reads');
 seedClear(p); ok(!p.seed&&seedShare(p)===0,'clearing the seed leaves no claim behind');
}

g('16 \u00b7 the front door');
{
 /* a story must be attributed by the profile being read, whoever was read
    before. loadProfile runs the susceptibility pass, so this holds. */
 (function(){
  const {read,blankProfile,CHARGES}=E;
  function mk(seed){const p=blankProfile('p'+seed);
   CHARGES.forEach((c,i)=>{p.axes[c]={held:(seed*3+i*2)%10,opp:0};});p.soul.doms=[seed%19];return p;}
  const story='I was furious and ashamed, then panic and dread, I avoided everyone.';
  const run=p=>JSON.stringify(read(p,{story}).reading.loaded.map(n=>[n.i,+n.sq.toFixed(3)]));
  let bad=0,N=0;
  for(let s=1;s<=12;s++)for(let t=1;t<=12;t++){if(s===t)continue;
   const A=mk(s),B=mk(t); run(A); const a1=run(A); run(B); const a2=run(A); N++; if(a1!==a2)bad++;}
  ok(bad===0,'story attribution is order independent: '+bad+' of '+N+' pairs differ');})();
 const {read,input,throughput,output,blankProfile,gatesClear}=E;
 /* a profile in, a reading out. no ambient setup, no globals touched. */
 const p=blankProfile('door');
 const a=read(p);
 ok(a.profile&&a.reading&&a.snapshot,'read returns profile, reading and snapshot');
 ok(typeof a.reading.CQ==='number','the reading carries a CQ');
 ok(a.reading.accuracy&&typeof a.reading.accuracy.pct==='number','and its own accuracy');
 ok(a.reading.gates.length===6,'and the six gates');
 ok(a.reading.expression.length===10,'and the ten expressions');

 /* the whole point: twice on one profile is the same answer. the chain
    alone was not repeatable, because the gate mixes accumulate. */
 const b=read(blankProfile('door'));
 ok(Math.abs(a.reading.CQ-b.reading.CQ)<1e-9,'two reads of one field agree');

 /* a story is applied once and only once */
 const st='i could not stop going over it and it was their fault';
 const s1=read(blankProfile('s'),{story:st});
 const s2=read(blankProfile('s'),{story:st});
 ok(Math.abs(s1.reading.CQ-s2.reading.CQ)<1e-9,'a story applied twice reads once');
 ok(s1.reading.vf!==1,'story cues move the gate factor off neutral');
 ok(s1.reading.CQ!==a.reading.CQ,'and the story changes the reading');

 /* gate evidence survives the round trip. this was the v1 defect: the
    multiplier moved every CQ and was never written to the schema. */
 const w=read(blankProfile('w'),{story:st,write:true});
 ok(w.profile.gates&&w.profile.gates.verp.attach>0,'the gates are written to the profile');
 const json=JSON.stringify(w.profile);
 gatesClear();
 const back=read(JSON.parse(json));
 ok(Math.abs(back.reading.vf-w.reading.vf)<1e-9,'and reload restores the same multiplier');
 ok(back.profile.v===2,'schema v2');

 /* input and throughput are separable, which is what makes them testable */
 const q=input(blankProfile('q'),{});
 ok(q&&q.axes,'input returns the loaded profile');
 const r=throughput(q);
 ok(typeof r.CQ==='number','throughput computes off what input placed');
 ok(output(q).v===2,'output writes the field back as schema');
}

g('17 · the host seam');
{
 const {bindStore,PKEY,blankProfile,pImport,pExport}=E;
 /* the engine ships with a no-op store, so a headless run persists nothing
    and never throws. binding one is the host's job. */
 const mem={};
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=v;});
 const p=blankProfile('host'); E.read(p,{write:true});
 const txt=JSON.stringify(p);
 ok(pImport(txt)!==null,'a profile imports through the bound store');
 ok(mem[PKEY]!==undefined,'and the store was written to');
 ok(JSON.parse(pExport()).v===2,'export round trips at v2');
 bindStore(()=>null,()=>{});          /* leave it as we found it */
}

g('18 · the path');
{
 const {parseStory,scanStory,SEATXY,NERVEBR,LEX,PHRASES}=E;
 /* the seats are measured off the artwork, not declared. anatomical order is
    the check that the tracing is coherent. */
 const order=['crown','eye','throat','heart','solar','sacral','root'];
 ok(order.every(s=>SEATXY[s]),'every seat has a measured centroid');
 ok(order.every((s,i)=>i===0||SEATXY[s].y>SEATXY[order[i-1]].y),
  'the centroids fall in anatomical order, crown to root');
 ok(order.reduce((a,s)=>a+SEATXY[s].n,0)===NERVEBR.reduce((a,b)=>a+b.p.length,0),
  'every traced point belongs to exactly one seat');

 const P=t=>parseStory(t).path;
 const route=p=>p.steps.filter(s=>s.seat).map(s=>s.word+'>'+s.seats.join('+')).join(' ');

 /* a step is a word occurrence, not a lexicon match. one word reaching two
    seats is one event in the body, not two. */
 const one=P('i felt anxious');
 ok(one.steps.filter(s=>s.seat).length===1,'one word is one step');
 ok(one.seats===undefined&&one.steps[0].seats.length===2,'and it can name two seats');
 ok(one.span===0,'a single word travels nowhere');

 /* order is the whole point of keeping the path */
 const a=P('i was furious then i felt hollow');
 const b=P('i was hollow then i felt furious');
 ok(a.start!==a.end,'a two seat sentence has a route');
 ok(a.start===b.end&&a.end===b.start,'reversing the order reverses the route');
 ok(Math.abs(a.net+b.net)<1e-9,'and flips the direction');
 ok(Math.abs(a.span-b.span)<1e-9,'the distance travelled is the same either way');

 /* the geometry cannot lie about itself */
 ['i was ashamed and numb and furious','i felt nothing at all','',
  'panicked frightened defeated worthless'].forEach(t=>{
  const p=P(t), d=new Set(p.steps.filter(s=>s.seat).map(s=>s.seat)).size;
  ok(p.span>=Math.abs(p.net)-1e-9,'span is at least the net displacement: '+t);
  ok((d<2)===(p.span===0),'span is zero exactly when the route stays at one seat: '+t);
  ok(p.drop>=0&&p.rise<=0,'drop is downward and rise is upward: '+t);
  ok((p.kink===null)===(p.scored===0),'a kink exists exactly when something is scored: '+t);});

 /* both ends are reported. the app had silently assumed the highest. */
 const k=P('i was furious and a little tired');
 ok(k.kink&&k.floor,'the path reports a kink and a floor');
 ok(k.kink.amt>=k.floor.amt,'and the kink is never below the floor');

 /* determinism, and no ambient state */
 const t='i was humiliated then i went numb';
 ok(JSON.stringify(P(t))===JSON.stringify(P(t)),'the path is deterministic');

 /* the suppression window. it claimed t.length+2, but a match of " w "
    shares its trailing space with the next word's leading space, so every
    word following a longer one was dropped. a third of them never landed. */
 const solo=Object.keys(LEX).filter(w=>!w.includes(' ')).slice(0,40);
 ok(scanStory(solo.join(' ')).filter(h=>h.kind==='word').length===solo.length,
  'no single word entry is swallowed by its neighbour');
 /* and the idiom still outranks the words inside it */
 ok(scanStory('i felt flattened me afterwards').some(h=>h.kind==='phrase'),
  'a phrase still matches');
 ok(!scanStory('i felt flattened me afterwards').some(h=>h.kind==='word'&&h.t==='flattened'),
  'and still outranks its own words');

 /* the path is a record, not an input. no number may move because of it. */
 reset(5,0,6);
 const before=JSON.stringify(compute());
 P('i was furious then hollow then ashamed');
 ok(JSON.stringify(compute())===before,'parsing a path moves no number in the app');
}

g('19 \u00b7 energetics, the birth module');
{
 const {sunSign,moonSign,risingSign,lifePath,masterNumber,chineseElement,
        hdOf,geneKey,spiritual,converge,BIRTH}=E;
 /* This module had zero coverage. Every function below was reachable from the
    Summary tab and never once executed by a gate. */
 const pad=n=>String(n).padStart(2,'0');
 const NAMES=new Set(['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra',
  'Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']);

 /* every day of a leap year must name exactly one real sign */
 let bad=[],seen={};
 for(let m=1;m<=12;m++){
  const dim=[31,29,31,30,31,30,31,31,30,31,30,31][m-1];
  for(let d=1;d<=dim;d++){
   const s=sunSign('2024-'+pad(m)+'-'+pad(d));
   if(!s||!NAMES.has(s.nm))bad.push(m+'/'+d+' -> '+(s&&s.nm));
   else seen[s.nm]=(seen[s.nm]||0)+1;}}
 ok(bad.length===0,'every day of the year names a real sun sign'+(bad.length?'  '+bad.slice(0,4).join(', '):''));
 ok(Object.keys(seen).length===12,'and all twelve signs are reachable, got '+Object.keys(seen).length);
 const spread=Object.values(seen);
 ok(Math.min(...spread)>=28&&Math.max(...spread)<=32,
  'each sign spans a plausible run of days, '+Math.min(...spread)+' to '+Math.max(...spread));

 /* life path reduces to a digit or a master number, for any date */
 let lpBad=[];
 for(let y=1900;y<=2030;y+=7)for(let m=1;m<=12;m+=3)for(let d=1;d<=28;d+=9){
  const v=lifePath(y+'-'+pad(m)+'-'+pad(d));
  if(!((v>=1&&v<=9)||v===11||v===22||v===33))lpBad.push(y+'-'+m+'-'+d+' -> '+v);}
 ok(lpBad.length===0,'life path always reduces to 1..9 or a master number'
  +(lpBad.length?'  '+lpBad.slice(0,3).join(', '):''));

 /* the comment in this module claims pre 1970 births are handled. check it. */
 let moonBad=[];
 ['1935-03-02','1958-11-21','1969-12-31','1970-01-01','2001-06-15'].forEach(d=>{
  const z=moonSign({d:d,t:'12:00'});
  if(!z||!NAMES.has(z[2]))moonBad.push(d+' -> '+(z&&z[2]));});
 ok(moonBad.length===0,'moon sign survives dates before 1970'
  +(moonBad.length?'  '+moonBad.join(', '):''));

 /* The ascendant needs a place, and a record without one now gets null
    rather than a sign derived from a sunrise nobody checked. */
 ok(risingSign({d:'1988-04-12',t:'07:30'})===null,
  'no birthplace means no ascendant, not a guessed one');
 ok(risingSign({d:'1988-04-12',p:'Chicago, IL'})===null,
  'and no birth time means no ascendant either');
 /* with a place it turns through the whole wheel across a day, which is
    the thing the old fixed sunrise could not do. */
 let riseSeen=new Set(), riseBad=[];
 for(let h=0;h<24;h++){
  const z=risingSign({d:'1988-04-12',t:pad(h)+':30',p:'Chicago, IL'});
  if(!z||!NAMES.has(z[2]))riseBad.push(h+':30 -> '+(z&&z[2])); else riseSeen.add(z[2]);}
 ok(riseBad.length===0,'rising sign is valid at every hour with a place'
  +(riseBad.length?'  '+riseBad.slice(0,3).join(', '):''));
 ok(riseSeen.size>=11,"and sweeps the wheel across a day, got "+riseSeen.size+" signs");
 /* latitude changes the answer. the old code could not tell these apart. */
 const chi=risingSign({d:'1988-04-12',t:'07:30',p:'Chicago, IL'});
 const lis=risingSign({d:'1988-04-12',t:'07:30',p:'Lisbon, PT'});
 ok(chi&&lis,'both places resolve an ascendant');

 /* THE SKY ITSELF, checked against cases that validate themselves.
    At a new moon the two longitudes coincide, so the error is readable
    without trusting anything remembered about a specific date. */
 const NM=[[2000,1,6,18.233],[2024,1,11,11.57],[1969,7,14,12.27]];
 let worst=0;
 NM.forEach(x=>{const jd=julianDay(x[0],x[1],x[2],x[3]);
  const d=Math.abs(((moonLon(jd)-sunLon(jd)+540)%360)-180);
  if(d>worst)worst=d;});
 ok(worst<1.5,'the moon tracks the sun through a new moon, worst error '+worst.toFixed(2)+' deg');
 /* the sun at an equinox is zero by definition */
 const eqx=Math.abs(((sunLon(julianDay(2000,3,20,7.583))+180)%360)-180);
 ok(eqx<0.1,'the sun reads zero at the vernal equinox, got '+eqx.toFixed(3)+' deg');
 /* the design sun is 88 degrees of arc back, not 88 days */
 const bj=julianDay(1990,5,15,10);
 const arc=((sunLon(bj)-sunLon(designJD(bj)))%360+360)%360;
 ok(Math.abs(arc-88)<0.01,'the design sun sits 88 degrees back, got '+arc.toFixed(3));
 ok(Math.abs((bj-designJD(bj))-88)>0.5,'and that is not the same as 88 days');

 /* the whole wheel is reachable. the old gene key could only ever
    produce 31 of the 64 gates, so 33 existed for nobody. */
 ok(new Set(GATE_WHEEL).size===64,'all 64 gates are on the wheel, got '+new Set(GATE_WHEEL).size);
 let gates=new Set();
 for(let m=1;m<=12;m++)for(let d=1;d<=28;d+=1)
  gates.add(geneKey({d:'1990-'+pad(m)+'-'+pad(d)}).gate);
 ok(gates.size>=60,'a year of births reaches most of the wheel, got '+gates.size+' gates');

 /* Li Chun, not the first of January. A birth in the first weeks of a
    year belongs to the previous animal, which is about a tenth of births. */
 ok(chineseYear({d:'1987-01-19'})===1986,'a January birth takes the previous Chinese year');
 ok(chineseYear({d:'1987-06-19'})===1987,'and a June birth takes its own');

 /* daylight saving decides an hour, and an hour is half a sign of ascendant */
 ok(usDST(2010,3,14)&&!usDST(2010,3,13),'US daylight saving starts on the second Sunday in March');
 ok(usDST(1985,4,8)&&!usDST(1985,3,20),'and on the old rule before 2007');

 /* the remaining readings must not throw or hand back nothing */
 const b={d:'1988-04-12',t:'07:45',p:'London'};
 ok(chineseElement(1988)!=null,'chinese element resolves');
 ok(masterNumber({d:'1979-11-29'})===null||[11,22,33].includes(masterNumber({d:'1979-11-29'})),
  'master number is a master number or nothing');
 const hd=hdOf(b);
 /* The type is deliberately not computed. It falls out of the defined
    centres, which needs every body at both moments, and the old code
    returned the birth hour modulo five for everybody. An unresolved
    field is the honest output and a gate fails if a guess comes back. */
 ok(hd.type===null&&hd.unresolved,'human design type reads unresolved rather than guessed');
 ok(hd.personality&&hd.design,'but the personality and design gates are real');
 ok(hd.personality.gate>=1&&hd.personality.gate<=64,'personality gate is on the wheel');
 ok(/^[1-6]\/[1-6]$/.test(hd.profile),'and the profile is two lines, got '+hd.profile);
 const gk=geneKey(b);
 ok(gk.gate>=1&&gk.gate<=64,'gene key gate sits in 1..64, got '+gk.gate);
 ok(gk.line>=1&&gk.line<=6,'and the line in 1..6, got '+gk.line);
 /* spiritual() is keyed on the BIRTH table. "You" is deliberately null,
    because the live profile has no birth data until someone enters it, and
    an unknown name is null for the same reason. Both are the contract, not
    a failure, and asserting that is the point. */
 ok(spiritual('Nobody At All')===null,'an unknown name reads null rather than throwing');
 ok(spiritual('You')===null,'and the live profile reads null until birth data exists');
 const PEEPS=Object.keys(BIRTH).filter(k=>BIRTH[k]);
 /* nine at the rebuild, thirteen since the roster gained four cases at the
    ends of the scale. The assertion is that every case with a birth record
    resolves a full reading, not that the roster never grows. */
 ok(PEEPS.length>=9,'every reference case carries birth data, got '+PEEPS.length);
 let spBad=[];
 PEEPS.forEach(k=>{const sp=spiritual(k);
  if(!sp||!sp.sun||!sp.moon||!sp.rising||!sp.hd||!sp.gk)spBad.push(k);});
 ok(spBad.length===0,'every reference case resolves a full reading'
  +(spBad.length?'  '+spBad.join(', '):''));
 /* three of the nine were born before 1970, so the negative-days path in
    moonSign is exercised by real data rather than only by a synthetic date. */
 ok(PEEPS.filter(k=>+BIRTH[k].d.slice(0,4)<1970).length>=3,
  'the pre 1970 path is covered by real reference cases');

 /* converge is the only one the UI actually calls */
 reset(5,0,6);
 ok(converge('Nobody At All',compute())===null,'converge is null without birth data');
 const c=converge(PEEPS[0],compute());
 ok(c!=null,'converge returns a reading');
 ok(c.agree.length+c.differ.length===4,'it weighs four independent systems, got '
  +(c.agree.length+c.differ.length));
 ok(c.score>=0&&c.score<=100,'and scores agreement in 0..100, got '+c.score);
 ok(JSON.stringify(converge(PEEPS[0],compute()))===JSON.stringify(c),'and is deterministic');

 /* pure functions of date and time, so the same input is the same answer */
 ok(sunSign('1988-04-12').nm===sunSign('1988-04-12').nm,'sun sign is pure');
 ok(lifePath('1988-04-12')===lifePath('1988-04-12'),'life path is pure');
}

g('19b \u00b7 the empty field says it is empty');
/* The nine axes were seeded at charge 3, so a stranger's first load produced
   CQ 36 and the word Incoherent in the largest type on screen, beside a panel
   correctly saying nothing was held. Zeroing the charge was not enough: CQ 36
   comes from the 21 laws sitting at the default 6, so the tier was a reading
   of the defaults rather than of a person. */
{
 /* The seeded 3 is gone from the state itself, which is the half that does not
    depend on who is loaded. The unread flag reads CURP, so it is asserted in
    the browser gate where a genuinely fresh profile exists. */
 E.S.doms=[0];E.S.arcs=[0,1];E.S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
 SINAMES.forEach(l=>S.law[l]=6);
 const r0=compute();
 ok(r0.loaded.length===0,'an empty field carries nothing');
 ok(typeof r0.unread==='boolean','the reading reports whether it has been read');
 ok(typeof r0.measured==='number','and how many laws were measured');
 /* the number is still computed, because everything downstream needs it */
 ok(typeof r0.CQ==='number'&&r0.CQ>0,'CQ is still computed for the machinery, got '+r0.CQ.toFixed(1));
 /* one real input and it is a reading whatever the profile */
 S.charge.Fear=7; const r1=compute();
 ok(r1.unread===false,'one held address makes it a reading');
 ok(r1.tier&&r1.tier.length>0,'and the tier means something');
 S.charge.Fear=0; compute();
}

g('18b \u00b7 undo');
/* The largest gap in the product since the rebuild. snapshot() was never the
   answer: it records a derived reading, cq and dq and sq, so a field cannot be
   restored from it. Undo captures the INPUTS, which is the only thing
   everything else recomputes from. */
{
 reset(2,0,6);
 const before=CHARGES.map(c=>S.charge[c]).join();
 ok(E.undoDepth()>=0,'the stack reports its depth');
 E.undoClear();
 ok(E.undoPop()===null,'an empty stack returns nothing rather than throwing');
 E.undoPush('a test change');
 ok(E.undoPeek()==='a test change','the stack names what it will take back');
 S.charge.Fear=9.4; S.charge.Anger=8.1; S.replace.Sad=5; S.law.Truth=2.2;
 S.doms=[3,7]; buildSoul();
 const u=E.undoPop();
 ok(u&&u.nm==='a test change','undo reports what it undid');
 ok(CHARGES.map(c=>S.charge[c]).join()===before,'every charge comes back');
 ok(S.replace.Sad===0,'and every installed opposite');
 ok(Math.abs(S.law.Truth-6)<1e-9,'and every law, got '+S.law.Truth);
 ok(JSON.stringify(S.doms)==='[0]','and the soul');
 /* susceptibility is written by a pass, not by compute, so a restore that
    skips it leaves stories attributing against the wrong profile */
 ok(W.every(n=>typeof n.susc==='number'&&n.susc>0),'susceptibility is rebuilt, not stale');
 /* UNLIMITED on the owner's ruling. A person who cannot get back to where
    they started does not have undo, they have a grace period. */
 E.undoClear();
 for(let i=0;i<500;i++)E.undoPush('step '+i);
 ok(E.undoDepth()===500,'the stack does not discard, got '+E.undoDepth());
 ok(E.undoPeek()==='step 499','and keeps the most recent');
 /* and it unwinds the whole way back, not just the recent part */
 let n=0; while(E.undoPop())n++;
 ok(n===500,'it unwinds every step, got '+n);
 ok(E.undoDepth()===0,'and empties');
 E.undoClear();
}

g('19a \u00b7 the roster covers the scale');
/* The roster sat in the middle, so the vocabulary at the ends had never been
   looked at with a real field behind it. Four cases added at the ends on the
   owner's ruling, solved against compute() by bisection rather than invented:
   2 and 10 at the floor, 92 and 98 near the ceiling. The pairs are the point.
   If one word has to carry both 2 and 10, the word is doing no work. */
{
 const rd=p=>{
  S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:5.5};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5));
  return compute();};
 const by={}; PEOPLE.forEach(p=>{by[p.nm]=rd(p);});
 const near=(n,t)=>ok(Math.abs(by[n].CQ-t)<0.6,n+' reads about '+t+', got '+by[n].CQ.toFixed(1));
 near('Tomas',2); near('Nkem',10); near('Wren',92); near('Abraham',98);
 /* the pairs sit inside one band each, which is the test of the vocabulary */
 ok(by.Tomas.tier===by.Nkem.tier,'2 and 10 are the same word: '+by.Tomas.tier);
 ok(by.Wren.tier===by.Abraham.tier,'92 and 98 are the same word: '+by.Wren.tier);
 /* the ends must be real fields, not empty ones */
 ok(by.Tomas.loaded.length>60,'the floor case is genuinely loaded, got '+by.Tomas.loaded.length);
 ok(by.Wren.loaded.length>0,'and the ceiling case still carries something, got '+by.Wren.loaded.length);
 /* six of the seven bands are now covered by a real reference case */
 const bands={}; PEOPLE.forEach(p=>{bands[by[p.nm].tier]=1;});
 ok(Object.keys(bands).length>=6,'the roster covers at least six bands, got '+Object.keys(bands).length);
 /* every new case resolves the cosmological layer too */
 ['Tomas','Nkem','Wren','Abraham'].forEach(n=>{
  const sp=E.spiritual(n);
  ok(sp&&sp.sun&&sp.rising,n+' resolves a full birth reading');});
}

g('19bb \u00b7 charge under the line is not nothing');
/* An address counts as carrying at SQ 4. Under that the charge is real, the
   person entered it, and every surface said nothing held. All nine axes at 4
   read identically to all nine at 0: CQ 92.2, DQ 0.0, nothing carrying. The
   instrument was saying nothing about something. */
{
 const read=v=>{S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=v;S.replace[c]=0;});
  SINAMES.forEach(l=>S.law[l]=9.6); return compute();};
 const z=read(0), four=read(4), seven=read(7);
 ok(z.under===0,'a truly empty field has nothing under the line either');
 ok(four.loaded.length===0,'charge of 4 still carries nothing above the line');
 ok(four.under>0,'but the reading now knows there is charge under it, got '+four.under);
 ok(four.under!==z.under,'so 4 no longer reads identically to 0');
 ok(seven.loaded.length>0&&seven.under>0,'and a loaded field reports both halves');
 read(0);
}

g('19c \u00b7 a label carries what it owes');
/* The owner's ruling: when this product puts a label on a person it carries a
   definition, the behaviour it produces, and the direction out of it. A word
   like Severe with nothing attached is a judgement. */
{
 const {TIERDEF,TIER_BY,tierOf,tierRange,tierTop,medianRange,MEDIAN,MEDIAN_LO,MEDIAN_HI}=E;
 ok(TIERDEF.length===10,'ten bands, got '+TIERDEF.length);
 const missing=TIERDEF.filter(t=>!t.def||!t.energy||!t.toward).map(t=>t.nm);
 ok(missing.length===0,'every tier carries a definition, a behaviour and a direction'
  +(missing.length?'  missing on '+missing.join(', '):''));
 /* the thresholds must still be the ones the engine computes against */
 ok(TIERDEF.map(t=>t.at).join()==='91,81,71,61,51,41,31,21,11,0','the thresholds are unchanged');
 /* the owner's ruling: a new word every ten points. every band is ten wide,
    so the word moves at every tenth point and no band swallows nineteen. */
 const wide=TIERDEF.filter(t=>tierTop(t.nm)-t.at!==(t.at===0?10:9)).map(t=>t.nm+' '+tierRange(t));
 ok(wide.length===0,'every band is ten points wide'+(wide.length?'  '+wide.join(', '):''));
 ok(tierRange(TIERDEF[0])==='91 to 100'&&tierRange(TIERDEF[9])==='0 to 10',
  'and a band prints as a range, got '+tierRange(TIERDEF[0])+' and '+tierRange(TIERDEF[9]));
 /* the median, ruled. fifty is the centre and forty to sixty is the swing. */
 ok(MEDIAN===50&&MEDIAN_LO===40&&MEDIAN_HI===60,'fifty is the median, forty to sixty the range');
 ok(medianRange(40)&&medianRange(50)&&medianRange(60)&&!medianRange(39.9)&&!medianRange(60.1),
  'the median range is closed at forty and sixty');
 ok(tierOf(50).nm==='Oscillating'&&tierOf(MEDIAN).at===41,
  'and fifty sits at the top of the band named for crossing the line, got '+tierOf(50).nm);
 ok(/median/i.test(TIER_BY.Oscillating.def),'which says median in its own definition');
 ok(TIERDEF.every((t,i)=>i===0||t.at<TIERDEF[i-1].at),'and they only descend');
 /* ONE TABLE. There were three: canon, the renderer, and compute itself. A
    previous commit removed the renderer's and claimed the duplicate was gone,
    which was wrong: compute carried its own literal thresholds and names, so a
    rename would have drifted silently between the engine and the definitions.
    This asserts there is no second table anywhere by checking that every band
    compute can name has a definition behind it, across the whole scale. */
 ok(tierOf(95).nm==='Mastery'&&tierOf(12).nm==='Severe'&&tierOf(0).nm==='Collapsed'
  &&tierOf(10).nm==='Collapsed'&&tierOf(11).nm==='Severe'&&tierOf(75).nm==='Compounding',
  'tierOf resolves the band');
 {
  const named=new Set(), defined=new Set(TIERDEF.map(t=>t.nm));
  for(let cq=0;cq<=100;cq+=0.25)named.add(tierOf(cq).nm);
  ok(named.size===10,'the scale reaches all ten bands, got '+named.size);
  const orphan=[...named].filter(n=>!defined.has(n));
  ok(orphan.length===0,'and no band exists without a definition'
   +(orphan.length?'  orphans: '+orphan.join(', '):''));
  /* and compute must agree with tierOf at every band, not only at the ends */
  let drift=[];
  [[0,0,10],[6,0,9.2],[6,0,7.4],[7,0,6],[8,0,4],[9,0,2],[10,0,0]].forEach(function(v){
   reset(v[0],v[1],v[2]); const r=compute();
   if(tierOf(r.CQ).nm!==r.tier)drift.push(r.CQ.toFixed(1)+': '+r.tier+' vs '+tierOf(r.CQ).nm);});
  ok(drift.length===0,'compute and the definitions never disagree'
   +(drift.length?'  '+drift.join(', '):''));
 }
 /* it has to agree with what compute names, or two surfaces disagree */
 reset(0,0,10); ok(tierOf(compute().CQ).nm===compute().tier,'and agrees with compute at the top');
 reset(10,0,0); ok(tierOf(compute().CQ).nm===compute().tier,'and at the bottom');
 /* the lowest band is the one that must not read as a product upsell */
 ok(/not alone|alone/.test(TIER_BY.Collapsed.toward),
  'the lowest band does not tell a person to manage it by themselves');
 /* house voice applies to the copy too */
 const all=JSON.stringify(TIERDEF);
 ok(!/[\u2014\u2013]/.test(all),'no em or en dashes in the label copy');
 ok(all.indexOf('108')<0,'and it never says 108');
}

g('20 \u00b7 the pattern catalog');
/* Ported from the owner's own cards and generator spec. These assert the
   PORT, which is the only thing that can silently rot: a sentence edited
   here is a sentence the owner never wrote. */
{
 const {C3_VERB,C3_STEM,C3_TRUTH,C3_GATE9,C3_BAND,C3_LADDER,C3_POLE,CARDSET,
        AXCARD,AXC_UN,CARD_BY,AXC_BY,cardLine,cardDepth,axLine,c3Band}=E;
 /* the syntax the spec calls non negotiable */
 ok(C3_VERB.length===9,'nine gates in the 3C statement, got '+C3_VERB.length);
 ok(C3_STEM==='I am letting go of believing, perceiving, thinking, behaving, acting, '
   +'feeling, speaking, saying, and doing that I am ','the 3C stem is verbatim');
 ok(C3_TRUTH==='I now embody the truth that I am ','the truth stem is verbatim');
 /* the second roster exists and is NOT the first. recording the disagreement
    is the point: a future edit that quietly merges them fails here. */
 ok(C3_GATE9.length===9,'the axes card roster is also nine, got '+C3_GATE9.length);
 ok(C3_GATE9.join()!==C3_VERB.join(),'and the two rosters are not the same roster');
 ok(C3_GATE9[8]==='being','the axes roster ends in being, which is why its line differs');

 /* the escalation curve covers one to fifty with no gap and no overlap */
 ok(C3_BAND.length===5,'five intensity bands, got '+C3_BAND.length);
 ok(C3_BAND[0].lo===1&&C3_BAND[4].hi===50,'the curve runs 1 to 50');
 let gap=[];
 for(let i=1;i<C3_BAND.length;i++)
  if(C3_BAND[i].lo!==C3_BAND[i-1].hi+1)gap.push(C3_BAND[i].lo);
 ok(gap.length===0,'the bands are contiguous'+(gap.length?'  break at '+gap.join():''));
 ok(c3Band(1).nm==='Subtle activation'&&c3Band(50).nm==='Existential exposure',
  'a position resolves to its band');
 /* a card is 200 statements: 50 per pole per phase, two poles, two phases */
 ok(C3_BAND[4].hi*C3_POLE.length*2===200,
  'the curve times two poles times two phases is the two hundred the book prints');

 /* the ladder is a progression, so a repeat is a stated failure mode */
 ok(C3_LADDER.length===22,'twenty two rungs on the adjective ladder, got '+C3_LADDER.length);
 ok(new Set(C3_LADDER).size===C3_LADDER.length,'and no rung repeats');
 /* the book gives sadness an action threshold word of suicidal with no stop
    line anywhere near it. This ladder is the newer artefact and does not, and
    nothing may reintroduce it here without a ruling and a screen. */
 ok(C3_LADDER.indexOf('suicidal')<0,'and the ladder carries no threshold word needing a screen');

 /* the poles are the balance axis: masculine is right and sympathetic */
 ok(C3_POLE.length===2,'two poles');
 ok(C3_POLE[0].ch==='Right channel'&&C3_POLE[0].ans==='sympathetic',
  'masculine is the right channel and sympathetic');
 ok(C3_POLE[1].ch==='Left channel'&&C3_POLE[1].ans==='parasympathetic',
  'feminine is the left channel and parasympathetic');

 /* the printed cards. every release line is paired to a truth by position, and
    an unpaired line is a card that installs nothing. */
 ok(CARDSET.length===3,'three printed release protocol cards, got '+CARDSET.length);
 let unpaired=[];
 CARDSET.forEach(c=>['m','f'].forEach(k=>{
  if(c[k].rel.length!==c[k].tru.length)unpaired.push(c.nm+' '+k);}));
 ok(unpaired.length===0,'every release line is paired to a truth'
  +(unpaired.length?'  '+unpaired.join(', '):''));
 /* every card names an axis the engine actually carries */
 const axn=CHILD.map(c=>c.nm);
 ok(CARDSET.every(c=>axn.indexOf(c.ax)>=0),'every printed card lands on a real axis');
 const l=cardLine('Anger','m',0);
 ok(l&&l.rel.indexOf(C3_STEM)===0,'a card line is built on the strict stem');
 ok(l&&l.tru.indexOf(C3_TRUTH)===0,'and its truth on the truth stem');
 /* the port never invents. an axis with no card returns nothing. */
 ok(cardLine('Surprise','m',0)===null,'an axis with no printed card returns null');
 ok(cardDepth('Surprise','m')===0,'and reads zero deep');
 ok(cardLine('Anger','m',99)===null,'and a position past the card returns null');

 /* the nine axes cards. seven match an engine axis, two do not, and the two
    are kept rather than merged into a neighbour. */
 ok(AXCARD.length===9,'nine axes cards, got '+AXCARD.length);
 ok(AXC_UN.length===2,'two of them name no engine axis, got '+AXC_UN.length);
 ok(AXCARD.filter(c=>c.ax).length===7,'seven land on an engine axis');
 ok(AXCARD.filter(c=>c.ax).every(c=>axn.indexOf(c.ax)>=0),'and each of those axes is real');
 ok(AXC_UN.map(c=>c.un).sort().join()==='Grief,Receiving blocked',
  'the two unmatched keep their own names');
 ok(AXCARD.every(c=>c.track&&c.rel&&c.inst),'every axes card carries a track, a release and an install');
 ok(axLine('Fear').indexOf('and being afraid')>0,
  'the axes line is built on the axes roster, not spliced from the 3C stem');
 ok(axLine('Surprise')===null,'and an axis with no card returns null');

 /* the house voice applies to ported text too */
 const all=JSON.stringify([CARDSET,AXCARD,C3_LADDER,C3_BAND]);
 ok(!/[\u2014\u2013]/.test(all),'no em or en dashes anywhere in the catalog');
 ok(all.indexOf('108')<0,'and the catalog never says 108');
}

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
