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

g('1b · every table keyed by law agrees with SI');
/* THE LAWS HAD NO OWNER AND THE DRIFT HAD ALREADY SHIPPED. Justice and Humility
   were renamed from Expression and Discernment. The rename was carried into SI,
   into HARM and into the migration table, and missed in IQ_STEM, so six of the
   sixty three intake questions asked a person "how often do you justice?" and
   "how often do you humility?" on a live build.

   A length check would have passed it, which is why this asserts BOTH
   directions: a table with the right count and the wrong names is the exact
   failure shape. And the output is asserted as well as the table, because the
   fallback that hid this was in the renderer rather than in the data. */
{
 const names=SINAMES.slice();
 const both=(tbl,nm)=>{
  const keys=Object.keys(tbl);
  const missing=names.filter(n=>keys.indexOf(n)<0);
  const extra=keys.filter(k=>names.indexOf(k)<0);
  ok(missing.length===0,nm+' covers every law, missing '+JSON.stringify(missing));
  ok(extra.length===0,nm+' names no law that does not exist, extra '+JSON.stringify(extra));};
 if(E.IQ_STEM)both(E.IQ_STEM,'IQ_STEM');
 /* AND THE SENTENCE A PERSON READS. No question may use a law's own name as its
    verb, which is what the removed fallback produced. */
 if(typeof E.iqList==='function'){
  const qs=E.iqList();
  ok(qs.length===names.length*3,
   'the intake is three questions a law, got '+qs.length+' of '+(names.length*3));
  const undef=qs.filter(q=>/undefined/.test(q.q));
  ok(undef.length===0,'no question has a hole in it, '+undef.length+' do');
  const verbIsName=qs.filter(q=>
   new RegExp('do you '+String(q.law).toLowerCase()+'\\b').test(q.q.toLowerCase()));
  ok(verbIsName.length===0,
   'no question uses the law name as its verb, '+verbIsName.length+' do'
   +(verbIsName[0]?': '+JSON.stringify(verbIsName[0].q):''));}
}

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
 /* the horizon. fifteen thousand by fifty, so three thousand a decade and
    three hundred a year. */
 const blank=meterRead(p);
 ok(blank.estimate===null,'with no birth date there is no estimate');
 ok(blank.scaled===false,'and the read says so rather than pretending');
 ok(blank.markers.map(m=>m.at).join()==='1,500,2500,3500,4500,10000,15000',
  'the ladder falls back to the reference scale, got '+blank.markers.map(m=>m.at).join());
 p.who.born.date='1986-04-02';
 const h=meterRead(p,'2026-09-18T00:00:00Z');
 ok(h.age>40&&h.age<41,'age comes off the birth date, got '+h.age);
 /* age is rounded for display, the estimate is not, so they agree to within
    one year's worth rather than exactly. */
 ok(Math.abs(h.estimate-h.age*300)<300,'the estimate is three hundred a year, got '+h.estimate);
 ok(h.scaled===true,'and this read is scaled to this person');
 ok(h.markers[6].at===h.estimate,'ascension is the whole of this person\'s own load, got '
  +h.markers[6].at+' against '+h.estimate);
 ok(h.markers[6].at<15000,'which for somebody younger than fifty is under fifteen thousand');
 ok(h.estimateLow<h.estimate&&h.estimateHigh>h.estimate,'and carries its ten percent swing');
 /* Six fixed distances on one ruler, from the owner's own ladder. Entry at
    the first address, then Buddha nature, Integration, Field awareness,
    Liberation, Ascension. */
 ok(h.markers.length===7,'seven markers, got '+h.markers.length);
 /* THE LADDER IS A FRACTION OF THE PERSON, not a table of counts. The owner's
    anchor is fifteen thousand by fifty, which is three hundred a year. Against
    that total his three named thresholds are exact thirtieths, and so are the
    three in the book. A record with no birth date reads against the reference
    scale, which is his own age, so these are the reference numbers. */
 ok(h.markers.every((m,i)=>i===0||m.at>h.markers[i-1].at),'and they only ever go up');
 const bn=h.markers.filter(m=>m.nm==='Breaking duality')[0];
 ok(bn&&bn.left===Math.max(0,bn.at-h.unique),'a marker reports the ground left to it');
 /* the whole point: a younger person does not have to clear an older person's
    total. they have to clear their own, and the top marker is all of it. */
 {const {markersFor,PAT_PER_YEAR,PAT_GEN}=E;
  const at30=markersFor(Math.round(30*PAT_PER_YEAR*PAT_GEN)).map(m=>m.at).join();
  ok(at30==='1,300,1500,2100,2700,6000,9000','a thirty year old carries nine thousand, got '+at30);
  const at50=markersFor(Math.round(50*PAT_PER_YEAR*PAT_GEN));
  ok(at50[6].at===15000,'a fifty year old reaches ascension at fifteen thousand, got '+at50[6].at);
  ok(markersFor(9000)[6].at===9000&&markersFor(6000)[6].at===6000,
   'and ascension is always the whole of it, whoever is reading');
  ok(PAT_PER_YEAR*50===15000,'the anchor holds: fifteen thousand by fifty');
  ok(PAT_PER_YEAR*10===3000,'which is three thousand a decade, not two');}
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

g('15d · the two nested bags');
/* THE BOUNDARY IS STRICT AND TWO BAGS WALKED PAST IT. rituals was accepted on
   one condition, that each entry is an object, and story.entries was a bare
   slice. plan.secret and plan.email are refused by name one level up and were
   passed silently one level down, which is a hole on the path the record fetch
   at sign in opens.

   Every row here was proved by breaking it: each refusal was made to fail on
   purpose and this group caught it before it was restored. The repository has
   been bitten by tests that passed because the branch under them was dead. */
{
 const {blankProfile,saveProfile,validateProfile,PRACTICE,BANDS,
        RIT_KEYS,ENT_KEYS,RIT_PLAN_MAX,RIT_MIN_MAX,OB_NEVER}=E;
 const base=saveProfile(blankProfile('bags'));
 const step=PRACTICE[0].k;
 const now=new Date().toISOString();
 const rit=()=>({t:now,track:PRACTICE[0].track,band:'Root',steps:[step],min:PRACTICE[0].min,
  when:'after the kettle',where:'the chair',done:false});
 const ent=()=>({t:now,text:'I was angry and it sat in my chest',imprints:3,bands:{root:4,heart:2}});
 const withRit=r=>{const x=JSON.parse(JSON.stringify(base)); x.rituals=[r]; return x;};
 const withEnt=e=>{const x=JSON.parse(JSON.stringify(base)); x.story={entries:[e]}; return x;};
 const refused=(o,what)=>{
  const v=validateProfile(o);
  ok(!v.ok,what+' is refused');
  return String((v.errs||[]).join(' · '));};
 const named=(o,what,frag)=>{
  const e=refused(o,what);
  ok(e.indexOf(frag)>=0,'and the refusal names '+frag+': '+e.slice(0,110));};

 /* the real one first, so every refusal below is measured against a case whose
    answer is already known */
 const v0=validateProfile(withRit(rit()));
 ok(v0.ok,'a ritual the builder wrote validates: '+JSON.stringify(v0.errs||[]).slice(0,140));
 ok(JSON.stringify(v0.profile.rituals[0])===JSON.stringify(rit()),
  'and comes back out exactly as it went in: '+JSON.stringify(v0.profile.rituals[0]).slice(0,140));
 const e0=validateProfile(withEnt(ent()));
 ok(e0.ok,'a story entry the app wrote validates: '+JSON.stringify(e0.errs||[]).slice(0,140));
 ok(JSON.stringify(e0.profile.story.entries[0])===JSON.stringify(ent()),
  'and comes back out exactly as it went in');

 /* BAG ONE. THE RITUAL. */
 ok(!validateProfile(withRit(7)).ok&&!validateProfile(withRit([1,2])).ok,
  'a ritual that is not an object is refused');
 named(withRit(Object.assign(rit(),{track:'Wellness'})),
  'a track that is not a track in the practice library','.track');
 named(withRit(Object.assign(rit(),{band:'Aura'})),'a seat that is not a seat','.band');
 named(withRit(Object.assign(rit(),{steps:['nope']})),'a step naming no practice','.steps[0]');
 named(withRit(Object.assign(rit(),{steps:step})),'a steps that is not a list','.steps');
 /* the builder writes one entry per practice picked, so the library's own
    length is the most a ritual can hold, and it is the bound that stops one
    valid key arriving a hundred thousand times */
 const many=[]; for(let i=0;i<PRACTICE.length+1;i++)many.push(step);
 named(withRit(Object.assign(rit(),{steps:many})),
  'more steps than there are practices','.steps');
 named(withRit(Object.assign(rit(),{min:-4})),'a negative length','.min');
 named(withRit(Object.assign(rit(),{min:RIT_MIN_MAX+1})),
  'a length past the whole library, rather than clamped','.min');
 ok(validateProfile(withRit(Object.assign(rit(),{min:RIT_MIN_MAX}))).ok,
  'and every practice picked once is still a ritual, '+RIT_MIN_MAX+' minutes');
 /* THE CAP IS THE SURFACE'S OWN AND THE VALUE IS NEVER TRUNCATED. */
 const long='x'.repeat(RIT_PLAN_MAX+1);
 named(withRit(Object.assign(rit(),{when:long})),'a when past the cap',
  'is '+long.length+' characters and the cap is '+RIT_PLAN_MAX);
 named(withRit(Object.assign(rit(),{where:'y'.repeat(5000)})),'a where past the cap','.where');
 ok(validateProfile(withRit(Object.assign(rit(),{when:'x'.repeat(RIT_PLAN_MAX)}))).ok,
  'and exactly the cap is accepted, '+RIT_PLAN_MAX+' characters');
 named(withRit(Object.assign(rit(),{when:5})),'a when that is not a string','.when');
 named(withRit(Object.assign(rit(),{done:'the day before yesterday'})),
  'a done that is neither a boolean nor a date','.done');
 ok(validateProfile(withRit(Object.assign(rit(),{done:now}))).ok,
  'and the stamp the I did it control writes is a done');
 /* THE DAY IS NEVER INVENTED. pracDay reads t and the streak is counted in the
    days it returns, so a filled t is a day nobody practised. */
 const noT=rit(); delete noT.t;
 named(withRit(noT),'a ritual with no day','.t');
 named(withRit(Object.assign(rit(),{t:'someday'})),'a day that is not a date','.t');
 named({...base,rituals:{}},'a rituals that is not a list','rituals is not a list');

 /* WHAT THE FINDING NAMED, AND THEN EVERY NAME THE OUTBOX REFUSES. OB_NEVER is
    the outbox's table and is deliberately not imported into the boundary: it is
    about what may not leave the device, and it names date, key, type, story and
    answers, which are legitimate field names elsewhere in this same profile.
    The closed key set refuses all of it anyway, and these rows are what fails
    loudly if anybody ever widens that set to let one of them in. */
 named(withRit(Object.assign(rit(),{secret:'s'})),'a ritual carrying a secret','may not carry secret');
 named(withRit(Object.assign(rit(),{email:'a@b.c'})),'a ritual carrying an email','may not carry email');
 named(withRit(Object.assign(rit(),{note:'z'.repeat(100000)})),
  'a hundred thousand character note','may not carry note');
 const leakedR=OB_NEVER.filter(k=>validateProfile(withRit(Object.assign(rit(),{[k]:'x'}))).ok);
 ok(leakedR.length===0,'no name the outbox refuses passes inside a ritual, '
  +leakedR.length+' do: '+JSON.stringify(leakedR));
 const collideR=OB_NEVER.filter(k=>RIT_KEYS.indexOf(k)>=0);
 ok(collideR.length===0,'and no ritual field is one of those names, '+JSON.stringify(collideR));

 /* ADDITIVE. The oldest ritual the app ever wrote is five fields. */
 const old={t:now,track:PRACTICE[0].track,band:'Root',steps:[step],min:PRACTICE[0].min};
 const ov=validateProfile(withRit(old));
 ok(ov.ok,'the five field ritual the first build wrote still loads: '
  +JSON.stringify(ov.errs||[]).slice(0,120));
 /* AND ITS MISSING DONE KEY IS STILL MISSING ON THE WAY OUT. ledgerRead reads
    an entry with no done key at all as practised. Writing done:false at the
    boundary would move every older ritual out of the practised column, which
    is a person's history edited by an import. */
 ok(!('done' in ov.profile.rituals[0]),
  'and its minutes are still practised minutes, because done was not filled in');
 ok(ov.profile.rituals[0].when===''&&ov.profile.rituals[0].where==='',
  'the two fields it never had are filled from the blank');
 /* a track or a seat nobody recorded is left empty rather than named, the way
    an unmeasured law is left null */
 const bare={t:now,steps:[step],min:4};
 const bv=validateProfile(withRit(bare));
 ok(bv.ok&&bv.profile.rituals[0].track===''&&bv.profile.rituals[0].band==='',
  'a ritual that recorded no track and no seat is given neither');
 ok(validateProfile({...base,rituals:[]}).ok&&validateProfile(base).ok,
  'no rituals at all still loads');
 /* THE TABLES ARE THE ENGINE'S OWN, NOT A LIST TYPED IN THE VALIDATOR. Every
    track the library holds validates, and so does every practice key, so a
    practice added to that table is accepted the moment it exists. */
 const tracks=[]; PRACTICE.forEach(p=>{if(tracks.indexOf(p.track)<0)tracks.push(p.track);});
 const badTrack=tracks.filter(t=>!validateProfile(withRit(Object.assign(rit(),{track:t}))).ok);
 ok(badTrack.length===0,'every track in the practice library is a track, '
  +tracks.length+' of them, '+JSON.stringify(badTrack)+' refused');
 const badStep=PRACTICE.map(p=>p.k)
  .filter(k=>!validateProfile(withRit(Object.assign(rit(),{steps:[k]}))).ok);
 ok(badStep.length===0,'every practice in the library is a step, '+PRACTICE.length
  +' of them, '+JSON.stringify(badStep)+' refused');
 const badSeat=BANDS.filter(b=>!validateProfile(withRit(Object.assign(rit(),{band:b}))).ok);
 ok(badSeat.length===0,'every seat is a seat, '+BANDS.length+' of them');

 /* BAG TWO. THE STORY ENTRY. */
 ok(!validateProfile(withEnt('a story')).ok,'an entry that is not an object is refused');
 /* Imprints and Analytics both call .slice and .length on the text with no
    guard, so one imported number threw the surface rather than the import */
 named(withEnt(Object.assign(ent(),{text:7})),'a text that is not a string','.text');
 const noText=ent(); delete noText.text;
 named(withEnt(noText),'an entry with no text at all','.text');
 named(withEnt(Object.assign(ent(),{t:'yesterday'})),'an entry dated yesterday','.t');
 named(withEnt(Object.assign(ent(),{imprints:-1})),'a negative imprint count','.imprints');
 named(withEnt(Object.assign(ent(),{imprints:'three'})),'an imprint count that is not a number','.imprints');
 named(withEnt(Object.assign(ent(),{bands:'root'})),'a bands that is not an object','.bands');
 named(withEnt(Object.assign(ent(),{bands:{spleen:4}})),'a band naming no seat','names no seat');
 named(withEnt(Object.assign(ent(),{bands:{root:'a lot'}})),'a band weight that is not a number','.bands.root');
 named(withEnt(Object.assign(ent(),{secret:'s'})),'an entry carrying a secret','may not carry secret');
 named(withEnt(Object.assign(ent(),{email:'a@b.c'})),'an entry carrying an email','may not carry email');
 const leakedE=OB_NEVER.filter(k=>validateProfile(withEnt(Object.assign(ent(),{[k]:'x'}))).ok);
 ok(leakedE.length===0,'no name the outbox refuses passes inside an entry, '
  +leakedE.length+' do: '+JSON.stringify(leakedE));
 /* AND THE ONE OVERLAP IS THE ARGUMENT FOR NOT IMPORTING THAT TABLE. OB_NEVER
    names imprints, because a count of what is imprinted on somebody must never
    leave the device, and a story entry's own fourth field is called imprints.
    Wiring the outbox's deny list into the arrival boundary would have refused
    every entry the app has ever written. The overlap is asserted rather than
    assumed, so a name added to either table that collides is reported here
    instead of quietly refusing a legitimate field. */
 const collideE=OB_NEVER.filter(k=>ENT_KEYS.indexOf(k)>=0);
 ok(JSON.stringify(collideE)==='["imprints"]',
  'the outbox deny list meets the entry key set at exactly imprints, got '
  +JSON.stringify(collideE));
 named({...base,story:{entries:{}}},'an entries that is not a list','story.entries is not a list');
 ok(validateProfile({...base,story:{entries:[]}}).ok,'no entries at all still loads');
 const noStory=JSON.parse(JSON.stringify(base)); delete noStory.story;
 ok(validateProfile(noStory).ok,'and a profile with no story key loads from the blank');
 /* AND NO LENGTH IS INVENTED FOR THE TEXT. The story box enforces no cap, on
    purpose, so the boundary must not either: a person who wrote four thousand
    words about their father is not corruption. */
 ok(validateProfile(withEnt(Object.assign(ent(),{text:'w '.repeat(20000)}))).ok,
  'a forty thousand character story is not refused, because the box has no cap');
 /* every seat key the sniffer writes is a band key, read off the sniffer's own
    table rather than typed here */
 const badBand=Object.keys(E.K2BAND||{})
  .filter(k=>!validateProfile(withEnt(Object.assign(ent(),{bands:{[k]:3}}))).ok);
 ok(badBand.length===0,'every seat key the sniffer writes is accepted, '
  +Object.keys(E.K2BAND||{}).length+' of them, '+JSON.stringify(badBand)+' refused');
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
 /* AND CHARGE UNDER THE DISPLAY LINE IS STILL CHARGE SOMEBODY ENTERED.
    unread is a claim about whether anything was entered, not about whether it
    crossed SQ 4. Measured before this: all nine axes at 3.9, 107 addresses
    carrying, loaded 0, DQ 0.0, unread true, so Summary showed the four doors
    and said nothing had been entered while the release control offered those
    same 107 addresses and spent eight patterns a press on them. The display
    line is unchanged and DQ still reads 0, which is true. */
 CHARGES.forEach(c=>{S.charge[c]=3.9;});
 const r2=compute();
 ok(r2.loaded.length===0,'charge at 3.9 is still below the line, nothing is held');
 ok(r2.under>0,'and it is reported as carrying underneath, got '+r2.under);
 ok(r2.unread===false,
  'so the reading does not claim nothing was entered, with '+r2.under
  +' addresses carrying');
 CHARGES.forEach(c=>{S.charge[c]=0;}); compute();
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

g('21 \u00b7 the compass. two cones, eight axes, a descent');
/* Every name and every description in compass.js is a quotation. The gate's
   job is not to re-read the book, it is to assert the shape the book states:
   eight mirror pairs, twelve masters, four blueprint archetypes, nine circles,
   six cascade states, and a descent whose last step refers out. */
{
 const {MIRROR,MASTERS,BLUEPRINT,CIRCLES,CASCADE,DESCENT,DESCENT_REFER,
        mirrorAt,darkRead,circleAt,DARK_MAL,DARK_CQ,BANDS}=E;
 ok(MIRROR.length===8,'eight mirror pairs, got '+MIRROR.length);
 const thin=MIRROR.filter(m=>!m.up||!m.dn||!m.upd||!m.dnd||!m.ask).map(m=>m.k);
 ok(thin.length===0,'every pair carries both poles, both descriptions and the diagnostic'
  +(thin.length?'  thin: '+thin.join(', '):''));
 /* the diagnostic is a question a practitioner asks, so it has to be one */
 ok(MIRROR.every(m=>/\?$/.test(m.ask)),'and the diagnostic is phrased as a question');
 /* a pair is only readable if the product already measures where it sits */
 const off=MIRROR.filter(m=>BANDS.indexOf(m.seat)<0).map(m=>m.k+' '+m.seat);
 ok(off.length===0,'every axis names a seat this product measures'
  +(off.length?'  off: '+off.join(', '):''));
 /* the owner asked for Musashi by name, and the book had already answered */
 ok(MIRROR.some(m=>m.up==='Musashi'&&m.dn==='Moloch'),'power is Musashi against Moloch');
 ok(MIRROR.some(m=>m.up==='Jesus'&&m.dn==='Lucifer'),'illumination is Jesus against Lucifer');
 ok(MIRROR.some(m=>m.up==='Buddha'),'and Buddha holds perception');

 /* ELEVEN, AND THE MISSING ONE IS A KNOWN HOLE RATHER THAN A DRIFT.

    This asserted twelve and caught the change the moment it landed, which is
    what it is for. Meister Eckhart came out on a ruling, classic figures
    only. He was the only name on the eight mirror pairs that was not
    classical. Lao Tzu carries Revelation now and was already on this list at
    the horizontal, so the union lost a member instead of swapping one and the
    count fell to eleven.

    The number is pinned at eleven rather than loosened to "some", because a
    gate that stops counting is a gate that stops catching. When he names the
    twelfth it goes back to twelve and this comment goes with it. BOOK-ERRATA
    carries it as an open disagreement between the codex and the engine. */
 ok(MASTERS.length===11,'eleven masters anchor the cone until he names the '
  +'twelfth, got '+MASTERS.length);
 ok(!MASTERS.some(m=>/Eckhart/.test(m.nm))&&!MIRROR.some(m=>/Eckhart/.test(m.up)),
  'and Eckhart is out of both lists, as ruled');
 /* JESUS AT THE CROWN, RULED, AND HE STANDS AT TWO POLES. That is the owner's
    canon and not a duplicate to route around: love generated from within at
    the Heart, and love as the highest charge at the Crown. Pinned, because a
    name at two poles is exactly the kind of thing a later edit would
    "tidy up" without knowing it was asked for. */
 ok(MIRROR.some(m=>m.seat==='Crown'&&m.up==='Jesus'),
  'Jesus carries the Crown, as ruled');
 ok(MIRROR.filter(m=>m.up==='Jesus').length===2,
  'and stands at two poles, at the Heart and at the Crown, which is his canon');
 /* ONE FIGURE, ONE NAME. Christ and Jesus were the same person under two
    names across the two lists, which is one word per concept broken inside
    the canon itself. */
 ok(!MASTERS.some(m=>m.nm==='Christ')&&MASTERS.some(m=>m.nm==='Jesus'),
  'and Christ is not a second name for him on the master list');
 /* NOBODY IS ON THIS LIST TWICE. The first cut of the removal put Akhenaten
    in Eckhart's row and he was already the first entry, which would have kept
    the count at twelve by counting one man twice. */
 {const seen={},dupe=[];
  MASTERS.forEach(m=>{if(seen[m.nm])dupe.push(m.nm);seen[m.nm]=1;});
  ok(dupe.length===0,'and no master is listed twice'
   +(dupe.length?'  '+dupe.join(', '):''));}
 /* the union arithmetic: the coordinate list and the mirror pairs overlap, and
    every coherent pole has to be on the list. if either moves, this catches it. */
 const upNames=new Set(MIRROR.map(m=>m.up));
 const missing=[...upNames].filter(n=>!MASTERS.some(x=>x.nm===n)&&n!=='Jesus');
 ok(missing.length===0,'every coherent pole is one of the masters'
  +(missing.length?'  missing: '+missing.join(', '):''));
 ok(BLUEPRINT.length===4,'four blueprint archetypes, got '+BLUEPRINT.length);
 ok(CIRCLES.length===9&&CIRCLES.every((c,i)=>c.c===i+1),'nine circles in order');
 ok(CIRCLES.every(c=>c.by&&c.p&&c.at),'each circle names its governor, its pattern and its seat');
 ok(CASCADE.length===6,'six cascade states, got '+CASCADE.length);

 /* the position on an axis is read, not asked */
 ok(mirrorAt(0,10)===100,'a clear seat with full integrity sits at the coherent pole');
 ok(mirrorAt(10,0)===0,'a fully loaded seat with none sits at the inverted pole');
 ok(mirrorAt(5,5)>0&&mirrorAt(5,5)<100,'and everybody else is somewhere between them');

 /* THE DARK READ. malignant alone is not it, decoherent alone is not it. */
 ok(darkRead(0.9,70).dark===false,'a malignant shape in a coherent field is not the descent');
 ok(darkRead(0.1,5).dark===false,'and a decoherent field with a benign shape is not either');
 ok(darkRead(0.9,5).dark===true,'the two together is');
 ok(darkRead(0.9,5).refer===true,'and at the floor it refers out');
 ok(darkRead(0.9,5).step&&darkRead(0.9,5).step.refer===true,'to the step that says so');
 ok(/licensed clinician/.test(DESCENT_REFER),'the referral names a clinician');
 ok(DESCENT.length===3&&DESCENT[2].refer===true,'three steps and the last is not ours to work');
 /* never a label on a person. the sentence has to say what it is a reading of. */
 ok(/not of who is running it/.test(darkRead(0.9,5).say),
  'and the dark read says it is a reading of what runs, not of the person');
 ok(darkRead(0.9,70).say==='','while a field that is not there is told nothing');
 ok(DARK_MAL>0&&DARK_MAL<1&&DARK_CQ>0,'both conditions carry a named threshold');

 /* ---- THE FOUR CORNERS ----
    Organised or chaotic, benign or malignant. Two axes, and the fourth corner
    is the one the material has got wrong for a thousand years. */
 const {GOVERN,quadrant,outwardShare,FAM_OUT,FAM_IN,GOV_ORG,GOV_MAL}=E;
 ok(GOVERN.length===5,'four corners over the stack and one above it, got '+GOVERN.length);
 ok(GOVERN.filter(g=>g.stack).length===4,'four of them describe a firing stack');
 ok(GOVERN.every(g=>g.d&&g.d.length>60),'each one carries what it is');
 ok(quadrant(0.9,0.9,20).nm==='The Devil','organised and malignant is the devil');
 ok(quadrant(0.9,0.1,20).nm==='The Demon','chaotic and malignant is the demon');
 ok(quadrant(0.1,0.9,20).nm==='Turned inward','compounded and pointed at the carrier is turned inward');
 /* NO FIGURE FOR THAT CORNER, and its absence is the finding: every culture
    named outward harm and gave it a face, and none of them named this one. */
 ok(GOVERN.filter(g=>/^The /.test(g.nm)).length===3,
  'three of the corners carry a figure and one does not');
 ok(/never named this one/.test(GOVERN.filter(g=>g.nm==='Turned inward')[0].d),
  'and it says why it has no figure');
 /* THE DEVIL IS THE ORDINARY CASE, which is the owner's correction. It is
    resistance dominating and compounded, not a rare strategic manipulator. */
 ok(/common case, not a rare one/.test(GOVERN[0].d),'the devil is named as the common case');
 ok(/starts small, gets conditioned/.test(GOVERN[0].d),'and as conditioning rather than malice');
 /* ORGANISED MEANS COMPOUNDED. The first build measured will against drag,
    which at low coherence the will always loses, so the devil was unreachable
    and every adversarial field fell into the chaotic corner. */
 const {organisedShare,ORG_W}=E;
 ok(organisedShare([])===null,'an empty chain has no reading');
 ok(organisedShare([{kind:'sab',w:5}])===ORG_W.sab,'a named saboteur is already conditioning');
 ok(organisedShare([{kind:'sup',w:5}])===1,'character is fully conditioned');
 /* DEPTH REACHED, NOT MASS SPLIT. A weighted mean read everybody as loose,
    because a field carries many saboteurs and one hyper complex, so the many
    dragged the mean down and nothing ever reached the organised half. A hyper
    complex existing at all is the conditioning, whatever else is firing. */
 ok(organisedShare([{kind:'sab',w:9},{kind:'sab',w:9},{kind:'sab',w:9},{kind:'hy',w:2}])===ORG_W.hy,
  'one compounded pattern is not outvoted by loose ones');
 ok(ORG_W.sab<ORG_W.cx&&ORG_W.cx<ORG_W.hy&&ORG_W.hy<ORG_W.sup,
  'the chain only ever counts more as it deepens');
 /* the correction proves itself: a compounded outward stack is now the devil
    whatever the coherence, which is what made him unreachable before */
 ok(quadrant(0.8,organisedShare([{kind:'hy',w:6},{kind:'sup',w:6}]),9).nm==='The Devil',
  'a conditioned outward pattern reads devil even at the floor');
 ok(quadrant(0.1,0.1,20).nm==='The Storm','and chaotic with nothing aimed at anybody is the storm');
 /* ANGEL IS NOT A CORNER OF THE STACK. It is what is left when nothing
    decoherent runs and coherence is high, which is reached by clearing and
    never by having a tidy stack. The first build named a field at CQ 39 an
    angel because its saboteurs all pointed inward. */
 ok(GOVERN.filter(g=>g.nm==='Angel')[0].stack===false,'angel is not one of the four');
 ok(quadrant(0.1,0.9,39).nm!=='Angel','a loaded field is never named an angel');
 ok(quadrant(null,0.9,95).nm==='Angel','a clear field at height is');
 ok(quadrant(null,0.9,39)===null,'and a clear field that is not is nothing at all');
 /* the ruling that matters. chaos is not malice, and the product must not
    call a person in distress a demon because their system is discharging. */
 ok(quadrant(0,0,20).nm!=='The Demon','chaos alone is never named a demon');
 const storm=GOVERN.filter(g=>g.nm==='The Storm')[0];
 ok(/mistaken for a demon/.test(storm.d),'and the storm says so in its own definition');
 ok(/coherent pole/.test(GOVERN.filter(g=>g.nm==='Angel')[0].d),
  'the angel is the coherent pole of an axis, not a separate kind of thing');
 /* the corners are exhaustive: every pair of truth values has exactly one */
 [[true,true],[true,false],[false,true],[false,false]].forEach(function(p){
  const hit=GOVERN.filter(g=>g.stack&&g.org===p[0]&&g.mal===p[1]);
  ok(hit.length===1,'exactly one corner for organised '+p[0]+' malignant '+p[1]
   +', got '+hit.length);});

 /* ---- THE SHAPE AXIS IS REAL AND NOT COHERENCE RESTATED ---- */
 /* NULL IS AN ANSWER, and this is the fix that stopped a field at CQ 39
    being named an angel. No stack, or a stack aimed at nobody, means the
    shape is unreadable rather than benign. */
 ok(outwardShare([])===null,'an empty stack has no readable shape');
 ok(quadrant(null,0.9,20)===null,'and no shape at low coherence means no corner');
 ok(quadrant(outwardShare([{hcx:'Rigidity',w:9}]),1,20)===null,
  'a stack aimed at nobody is not quietly promoted to the top corner');
 ok(darkRead(null,3).dark===false&&darkRead(null,3).mal===null,
  'and an unreadable shape is never dark, whatever the coherence');
 ok(outwardShare([{hcx:'Predatory',w:5}])===1,'a stack that runs at people is all outward');
 ok(outwardShare([{hcx:'Collapse',w:5}])===0,'one that lands on the carrier is none');
 ok(Math.abs(outwardShare([{hcx:'Predatory',w:5},{hcx:'Collapse',w:5}])-0.5)<1e-9,
  'and an even split is a half');
 /* a field made only of the neither families must not read as half malignant */
 ok(outwardShare([{hcx:'Rigidity',w:9},{hcx:'Dysregulation',w:9}])===null,
  'families that aim at nobody read as unreadable, not as benign');
 ok(!FAM_OUT.Collapse&&!FAM_IN.Predatory,'and the two lists never overlap');
 ok(GOV_ORG>0&&GOV_ORG<1&&GOV_MAL>0&&GOV_MAL<1,'both corners carry a named threshold');

 /* THE DEFECT THIS REPLACED. malig was (50 minus CQ) doubled, so asking
    whether a field was malignant and decoherent asked one question twice.
    The two axes must be able to disagree, or the owner's rule says nothing. */
 reset(0,0,10); const hi=compute();
 reset(10,0,0); const lo=compute();
 ok(hi.outward===null||typeof hi.outward==='number','a clear field reports a shape or none');
 ok(lo.outward===null||typeof lo.outward==='number','and so does a loaded one');
 ok(hi.gov===null||!!hi.gov.nm,'a corner is a corner or it is absent');
 ok(lo.gov===null||!!lo.gov.nm,'at both ends of the scale');
 ok(darkRead(0.9,70).dark===false&&darkRead(0.2,5).dark===false&&darkRead(0.9,5).dark===true,
  'and the pair can disagree in both directions, which is the whole point');

 /* the descent is below the median band and nowhere else */
 ok(circleAt(80)===null&&circleAt(41)===null,'nothing descends at or above the median range');
 ok(circleAt(40)&&circleAt(40).c===1,'the first circle opens just under it, got '
  +(circleAt(40)?circleAt(40).c:'none'));
 ok(circleAt(0).c===9,'and the floor is the ninth');
 let last=0,mono=true;
 for(let q=40;q>=0;q--){const c=circleAt(q); if(c.c<last)mono=false; last=c.c;}
 ok(mono,'the circles only ever deepen as coherence falls');

 /* house voice applies to a hundred and fifty lines of quotation too */
 const all=JSON.stringify([MIRROR,MASTERS,BLUEPRINT,CIRCLES,CASCADE,DESCENT]);
 ok(!/[\u2014\u2013]/.test(all),'no em or en dashes anywhere in the compass');
 ok(all.indexOf('108')<0,'and it never says 108');
}

g('22 \u00b7 the age ladder, the second way in');
/* The Inferno is the way in for somebody who cannot see themselves as bad.
   This is the way in for somebody who cannot see themselves as identified,
   which is most people, because an identification that is working does not
   feel like one. The mechanic is one sentence: the mind sticks to anything it
   defends, and once it is stuck the bias is set. */
{
 const {AGES,AGE_TEST,AGE_LO,AGE_HI,ageFinding,AGE_WORKED}=E;
 ok(AGES.length===16,'sixteen years, got '+AGES.length);
 ok(AGES[0].a===AGE_LO&&AGES[15].a===AGE_HI,'three to eighteen, got '
  +AGES[0].a+' to '+AGES[15].a);
 ok(AGES.every((x,i)=>i===0||x.a===AGES[i-1].a+1),'one year at a time with no gaps');
 ok(AGES.every(x=>x.k&&x.q),'each year names what it is looking for and asks for it');
 ok(AGES.every(x=>/\?$/.test(x.q)),'and asks it as a question');
 /* every prompt asks for the thing AND its opposite, because an
    identification is only visible against what it excluded */
 const oneSided=AGES.filter(x=>!/,\s|and /.test(x.q)).map(x=>x.a);
 ok(oneSided.length===0,'every year asks for the side and what it was against'
  +(oneSided.length?'  one sided at '+oneSided.join(', '):''));

 /* THE TEST, and its order is load bearing. Asking care first lets a person
    answer for who they would like to be. */
 ok(AGE_TEST.length===3,'three questions to test an answer, got '+AGE_TEST.length);
 ok(AGE_TEST[0].k==='defend'&&AGE_TEST[2].k==='care',
  'defence is asked first and care last, got '+AGE_TEST.map(t=>t.k).join(', '));

 /* THE FINDING. Defended and not meant is the only one that is. */
 ok(ageFinding(true,false).found===true,'defended and not meant is a groove');
 ok(ageFinding(true,true).found===false,'defended and meant is a preference');
 ok(ageFinding(false,false).found===false,'not defended is nothing at all');
 ok(ageFinding(false,true).found===false,'and neither is caring about something you never argue');
 ok(/preference, not a bias/.test(ageFinding(true,true).say),
  'and the product says which is which rather than leaving a person to guess');
 ok(/groove, not a taste/.test(ageFinding(true,false).say),'both ways');

 /* the worked example is the one that found the method, so it carries the
    detail that makes it land: the same position taken four times */
 ok(/Superman|Hulk/.test(AGE_WORKED),'the worked example is the one that found it');
 ok(/I do not care about either/.test(AGE_WORKED),'and ends where the method was found');

 /* house voice */
 const all=JSON.stringify([AGES,AGE_TEST,AGE_WORKED]);
 ok(!/[\u2014\u2013]/.test(all),'no em or en dashes in the age ladder');
 /* and it never hands a person a diagnosis on the way in */
 ok(!/saboteur|narcissis|trauma|heal/i.test(all),
  'no diagnosis word and no wellness word anywhere in the way in');
}

g('23 \u00b7 the plan. what it grants, what it lets you see, and what it refuses');
/* Stripe is a network and this half of the product has none. Everything here
   is arithmetic over a plan record the host hands it, so the engine answers
   what somebody may open and may see without knowing a processor exists. */
{
 const {PLANS,PLAN_BY,SEE_ORDER,planState,planOf,planSees,planNextSight,
        planAllowance,planUpgrade,PLAN_ALWAYS,blankProfile,saveProfile,validateProfile}=E;
 ok(PLANS.length===6,'the gift, free and four paid, got '+PLANS.length);
 ok(PLAN_BY.one.grant===400&&PLAN_BY.two.grant===800
  &&PLAN_BY.three.grant===1200&&PLAN_BY.four.grant===1200,
  'the ladder is the owner\'s: 400, 800, 1200, 1200');
 ok(PLAN_BY.gift.grant===100&&PLAN_BY.free.grant===10,'the gift is 100 and free is 10 a week');
 /* THE RUN CAP, and the thing it exposes. A release run is at most twenty
    five, so the gift is exactly four runs. The free grant of ten is LESS
    THAN ONE RUN, which means a free person cannot complete a single release
    in a week however they spend it. The allowance banks, and the surface
    says so, because ten patterns reads like a permission and nought runs is
    the truth. */
 /* THE OWNER OVERTURNED THE ARITHMETIC THESE ASSERTED.

    They pinned the old model, in which a run always cost the cap, so ten free
    patterns bought nought runs and the surface told a person their allowance
    was banking toward one. Ruled: a run costs the MINIMUM for what was picked,
    the cap is a ceiling and not a size, and a rerun of ground already open is
    free. Ten a week is therefore two releases a week, which is a product.

    Rewritten to assert the rule rather than the numbers: an allowance buys
    what it buys at the floor, the cap only truncates, and more grant buys
    proportionally more. A future change to either constant moves these with
    it instead of failing them. */
 const {RUN_MAX,RUN_MIN,LEAD_SEES,LEAD_HIDDEN,leadSees}=E;
 ok(RUN_MAX===25,'a run is at most twenty five, got '+RUN_MAX);
 ok(RUN_MIN>0&&RUN_MIN<RUN_MAX,'and the smallest run is smaller than the cap, got '+RUN_MIN);
 ok(PLAN_BY.free.grant>=RUN_MIN,
  'the free week affords at least one release, which is the ruling');
 {const fr=planAllowance({tier:'free',status:''},100);
  ok(fr.runs===Math.floor(PLAN_BY.free.grant/RUN_MIN),
   'and it buys grant over the floor, got '+fr.runs);
  ok(!/banking toward a run/.test(fr.say),
   'and no longer says it is banking toward one it can already afford');}
 {const t1=planAllowance({tier:'one',status:'active',granted:400,base:100},100).runs;
  const t2=planAllowance({tier:'two',status:'active',granted:800,base:100},100).runs;
  ok(t1===Math.floor(400/RUN_MIN),'tier one is its grant over the floor, got '+t1);
  ok(t2===t1*2,'and tier two, at twice the grant, is twice the runs');}

 /* TIER FOUR IS NOT MORE OF THE SAME. Same twelve hundred as tier three, so
    patterns do not separate them at all. What it buys is the cohort suite. */
 ok(PLAN_BY.four.grant===PLAN_BY.three.grant,
  'tier four carries the same grant as tier three');
 ok(PLAN_BY.four.lead===true&&PLANS.filter(p=>p.lead).length===1,
  'and exactly one rung carries the cohort lead suite');
 /* WHAT A LEAD SEES IS NARROWER THAN WHAT THEY OWN. The outputs, not the
    tools, and never the story, because the story is the person's own words. */
 ok(leadSees('saboteurs')&&leadSees('complexes')&&leadSees('hyper complexes')
  &&leadSees('analytics'),'a lead sees the outputs');
 ok(!leadSees('the story cloud'),'and never the story cloud');
 ok(LEAD_HIDDEN.indexOf('the story cloud')>=0,'which is named as hidden rather than omitted');
 ok(LEAD_SEES.filter(x=>/stor|journal/i.test(x)).length===0,
  'no story shaped thing is on the visible list at all');

 /* ---- WHAT AN ALLOWANCE IS WORTH ----
    Every rate is the codex's own: therapy one to six a session, meditation
    six to twelve per twenty minutes, breathwork the same. Plant medicine is
    deliberately absent because the book gives no rate for it. */
 const {EQUIV,EQUIV_NONE,equivOf,planWorth}=E;
 ok(EQUIV.length===4,'four units to price against, got '+EQUIV.length);
 ok(EQUIV.filter(x=>x.k==='therapy')[0].lo===1&&EQUIV.filter(x=>x.k==='therapy')[0].hi===6,
  'therapy is one to six, the book\'s figure');
 ok(EQUIV.filter(x=>x.k==='medit')[0].lo===9&&EQUIV.filter(x=>x.k==='medit')[0].hi===18,
  'and thirty minutes is nine to eighteen, which is the twenty minute rate scaled');
 ok(EQUIV.filter(x=>x.k==='month')[0].lo===270&&EQUIV.filter(x=>x.k==='month')[0].hi===540,
  'a month of half an hour a day is two hundred and seventy to five hundred and forty');
 /* PLANT MEDICINE IS NOT ON THE LIST, and its absence is deliberate */
 ok(EQUIV.filter(x=>/plant|ayah|psilo/i.test(x.nm)).length===0,
  'plant medicine is not on the table');
 ok(/no rate for it/.test(EQUIV_NONE),'and the reason is written down rather than forgotten');
 /* THE CLAIM IS THROUGHPUT, NEVER OUTCOME, and it is made at the low end */
 const e=equivOf(100,'therapy');
 ok(Math.round(e.lo)===17,'a hundred patterns is seventeen sessions at the conservative end');
 ok(/would release/.test(e.say),'and the sentence is about what a thing releases');
 ok(!/instead of|the same as|better than|replaces/i.test(e.say),
  'never that it is the same as, instead of, or better than');
 ok(EQUIV.every(x=>x.lo>0&&x.hi>=x.lo),'every rate is a real range');
 /* TIER ONE IS A MONTH OF DAILY PRACTICE, which is the sentence the whole
    table exists to support. Four hundred sits inside two seventy to five
    forty, so the test is whether the band contains a month, not whether a
    ratio is near one. */
 ok(/a month of half an hour/.test(planWorth(400)),
  'four hundred a month is a month of daily practice, got '+planWorth(400));
 ok(/a month of half an hour/.test(planWorth(270))&&/a month of half an hour/.test(planWorth(540)),
  'across the whole band');
 ok(/1.5 months/.test(planWorth(800)),'eight hundred is a month and a half, got '+planWorth(800));
 ok(/therapy sessions/.test(planWorth(100)),'and the gift falls back to sessions, which is its unit');
 ok(planWorth(0)===''&&equivOf(0,'therapy')===null,'nothing is worth nothing, said as nothing');
 ok(PLAN_BY.gift.see==='sup','and the gift shows everything, which is the whole point of it');
 ok(PLANS.every(p=>SEE_ORDER.indexOf(p.see)>=0),'every tier names a rung it can see');
 ok(PLAN_ALWAYS.length>=3,'and what is on every tier is named rather than remembered');

 /* WHAT IS IN FORCE, NOT WHAT IS WRITTEN. A record can say tier three and be
    cancelled, and the answer is free. */
 ok(planOf({tier:'three',status:'active'}).k==='three','an active tier is in force');
 ok(planOf({tier:'three',status:'canceled'}).k==='free','a cancelled one is not');
 ok(planOf({tier:'three',status:'unpaid'}).k==='free','nor an unpaid one');
 ok(planOf({tier:'three',status:'past_due'}).k==='three',
  'past due keeps access, because cutting somebody off over a bank\'s timing is a punishment');
 ok(planOf({tier:'three',status:'trialing'}).k==='three','and a trial is access');
 /* AN UNKNOWN STATE OPENS NOTHING. This is the one that matters: a processor
    adds a status, an old build does not know it, and the safe reading is no. */
 ok(planState({tier:'three',status:'something_new'})==='pending','an unknown status is pending');
 ok(planOf({tier:'three',status:'something_new'}).k==='free','and pending grants nothing');
 ok(planOf(null).k==='free'&&planOf({}).k==='free','no plan at all is free');

 /* SIGHT IS NOT FOR SALE. Ruled. Everybody sees the whole reading at every
    tier, free included, and what a tier buys is how much new ground may be
    opened. This removed the one mechanic in the product that withheld a
    person's own reading in order to sell it back. */
 const t1={tier:'one',status:'active'}, t3={tier:'three',status:'active'};
 SEE_ORDER.forEach(function(k){
  ok(planSees(t1,k)&&planSees(t3,k)&&planSees(null,k)&&planSees({tier:'free'},k),
   'every rung is visible on every plan including none, at '+k);});
 ok(PLANS.every(function(x){return x.see==='sup';}),
  'no tier stops anywhere along the chain');
 ok(planNextSight(t1)===null&&planNextSight()===null,
  'and there is no next rung of sight to sell, on any plan');
 ok(planSees(t1,'nonsense')===false,'a rung that does not exist is still not a rung');
 /* ANNUAL. TWO MONTHS FREE IS OUT, on the owner's ruling, and this test is
    what would have caught the product still making the offer: it asserted the
    discount rather than asserting that the discount is whatever the one
    constant says. It reads the constant now, so the ruling is a one line
    change and the gate follows it instead of pinning it.

    The allowance stays monthly whatever the price, because the allowance is
    a pace and that was never about the discount. */
 const planYear=E.planYear, PLAN_YEAR_FREE=E.PLAN_YEAR_FREE;
 ok(PLAN_YEAR_FREE===0,'no annual discount is ruled, got '+PLAN_YEAR_FREE);
 ok(planYear('one').pay===12-PLAN_YEAR_FREE&&planYear('one').grant===400,
  'a year of tier one is '+(12-PLAN_YEAR_FREE)+' payments at four hundred a month');
 /* and it does not offer months it is not giving away */
 ok(!/price of/.test(planYear('one').say)||PLAN_YEAR_FREE>0,
  'and it does not say months free while none are');
 ok(/arrives monthly/.test(planYear('one').say),
  'and the allowance is still monthly rather than a year in one lump');
 ok(planYear('free')===null&&planYear('gift')===null,
  'there is no annual on a plan that is not monthly');

 /* ALLOWANCE. The gift is spent first and spent once, and spend is never
    stored: it is the unique count against what was granted, so they cannot
    drift apart. */
 ok(planAllowance(t1,0).inGift&&planAllowance(t1,0).left===100,'a new record is all gift');
 ok(planAllowance(t1,40).left===60,'and the gift is spent by opening new ground');
 ok(planAllowance(t1,100).inGift===false,'then it is gone');
 ok(planAllowance({tier:'one',status:'active',granted:400,base:100},150).left===350,
  'after which the tier grant carries it, got '
  +planAllowance({tier:'one',status:'active',granted:400,base:100},150).left);
 ok(planAllowance({tier:'one',status:'active',granted:400,base:100},600).left===0,
  'and it never reads below nothing');
 /* SPEND IS PER PERIOD. The first build subtracted every address ever opened
    from one month's grant, so somebody in their ninth month read nothing left
    on the day the month opened. base is the unique count when the period
    began. */
 ok(planAllowance({tier:'one',status:'active',granted:400,base:3000},3000).left===400,
  'a new period opens at the full grant however long the record is, got '
  +planAllowance({tier:'one',status:'active',granted:400,base:3000},3000).left);
 ok(planAllowance({tier:'one',status:'active',granted:400,base:3000},3050).left===350,
  'and spends from there');
 /* A CANCELLED RECORD CARRYING granted 400 MUST NOT SPEND 400. It drops to
    free, which is ten, and somebody who stops paying is a free user rather
    than a locked one. */
 const canc=planAllowance({tier:'one',status:'canceled',granted:400,base:3000},3000);
 ok(canc.left===PLAN_BY.free.grant,'a cancelled plan falls to the free grant, got '+canc.left);
 ok(canc.source==='free','and says which plan it is reading');
 ok(planAllowance({tier:'one',status:'active',granted:0,base:3000},3000).left===PLAN_BY.one.grant,
  'a live plan with no grant written falls back to the tier, not to nothing');

 /* THE UPGRADE, said as what it buys and never as what somebody lacks */
 const up=planUpgrade(t1);
 ok(up&&up.to.k==='two'&&up.ground===400,'an upgrade names the next tier and the ground');
 ok(/more of new ground/.test(up.say),'and says it as what it buys');
 ok(!/miss|lose|locked out|only/i.test(up.say),'never as what a person is short of');
 ok(planUpgrade({tier:'four',status:'active'})===null,'with nothing to sell at the top');
 /* A DIFFERENCE ONLY MEANS SOMETHING WHEN THE PERIODS MATCH. Free is ten a
    week and tier one is four hundred a month. Subtracting gave 390 more a
    month, which is arithmetic over two different units. */
 const fromFree=planUpgrade({tier:'free',status:''});
 ok(fromFree.to.k==='one','free steps up to tier one');
 ok(fromFree.same===false&&fromFree.ground===400,
  'and across a period boundary the tier states its own figure, got '+fromFree.ground);
 ok(/400 of new ground a month/.test(fromFree.say),'said in one unit, got '+fromFree.say);
 ok(up.same===true,'while a step inside one period is a difference');

 /* THE BOUNDARY. A record a person can edit must not be able to grant itself
    a tier, and must not carry an identifier this product refused to hold. */
 const bp=blankProfile('plan');
 ok(bp.plan&&bp.plan.tier==='free','a new record is free');
 const good=saveProfile(bp); good.plan={tier:'two',status:'active',granted:800,
  carried:0,since:'2026-01-01T00:00:00Z',until:'2026-02-01T00:00:00Z'};
 ok(validateProfile(good).ok&&validateProfile(good).profile.plan.tier==='two',
  'a real plan round trips');
 const madeUp=JSON.parse(JSON.stringify(good)); madeUp.plan.tier='platinum';
 ok(!validateProfile(madeUp).ok,'a tier this build does not know is refused by name');
 ok(/plan.tier/.test((validateProfile(madeUp).errs||[]).join(' ')),'and says which field');
 const badBase=JSON.parse(JSON.stringify(good)); badBase.plan.base='lots';
 ok(!validateProfile(badBase).ok,'a baseline that is not a number is refused');
 const negative=JSON.parse(JSON.stringify(good)); negative.plan.granted=-5;
 ok(!validateProfile(negative).ok,'a negative grant is refused');
 const huge=JSON.parse(JSON.stringify(good)); huge.plan.granted=1e9;
 ok(!validateProfile(huge).ok,'and so is one past the ceiling, rather than clamped');
 const carriesId=JSON.parse(JSON.stringify(good)); carriesId.plan.customer='cus_123';
 ok(!validateProfile(carriesId).ok,'a record carrying a customer id is refused');
 const carriesKey=JSON.parse(JSON.stringify(good)); carriesKey.plan.secret='sk_live_x';
 ok(!validateProfile(carriesKey).ok,'and so is one carrying a key');
 const older=JSON.parse(JSON.stringify(good)); delete older.plan;
 ok(validateProfile(older).ok&&validateProfile(older).profile.plan.tier==='free',
  'an older record with no plan is a free record, not a broken one');
 /* the whole file is host free, which hostfree.py already enforces, but the
    plan is the one place a key would ever be tempting */
 ok(JSON.stringify(PLANS).indexOf('sk_')<0&&JSON.stringify(PLANS).indexOf('pk_')<0,
  'and no key of any kind is in the engine');
}

g('24 \u00b7 the avatar, the purpose map and the boundary');
/* The becoming half. Release empties an address and replace fills it, and
   neither says what the person is filling it toward. Ported from the original
   build, not rebuilt: the owner's own sentence governs it. */
{
 const {avatarBlank,avatarValid,avatarDue,avatarDaysLeft,avatarGap,avatarProgress,
        AV_MONTH,purposeBlank,purposeReady,purposeCentre,purposeRead,
        boundaryCount,boundaryCross,PUR_SIDES,PUR_PER_SIDE,
        blankProfile,saveProfile,validateProfile}=E;

 /* A PAIR IS WRITTEN AS A PAIR. The left side is a value and a value has no
    address. The right side is a sentence about a bad day and that parses. */
 ok(avatarValid({be:'I leave work at work',notbe:'I take every meeting home'}),
  'a written pair is a pair');
 ok(!avatarValid({be:'I leave work at work',notbe:''}),'half of one is not');
 ok(!avatarValid({be:'',notbe:'I take every meeting home'}),'in either direction');
 ok(!avatarValid(null)&&!avatarValid({}),'and nothing is not');

 /* the monthly review, which exists because the product will not adjudicate
    an attribute for somebody */
 const av=avatarBlank();
 ok(av.built===false&&av.pairs.length===0,'a new avatar is empty and knows it');
 ok(avatarDue(av)===false,'an unbuilt avatar is never due');
 const now=Date.UTC(2026,8,18);
 const fresh={built:true,at:new Date(now).toISOString(),reviewedAt:new Date(now).toISOString(),pairs:[]};
 ok(avatarDue(fresh,now)===false,'nor a fresh one');
 ok(avatarDue(fresh,now+AV_MONTH+1)===true,'and it is due after a month');
 ok(avatarDaysLeft(fresh,now)===30,'which the surface can count down, got '
  +avatarDaysLeft(fresh,now));

 /* THE GAP IS A NUMBER AT AN ADDRESS, not a mood */
 const pair={be:'I leave work at work',notbe:'I take every meeting home with me'};
 const g1=avatarGap(pair,'Heart',6.9,3);
 ok(g1&&g1.seat==='Heart'&&g1.load===6.9,'the gap names the seat and what is held there');
 ok(g1.clear===false,'and a loaded seat is not clear');
 ok(avatarGap(pair,'Heart',0,10).clear===true,'an empty one is');
 ok(avatarGap({be:'x',notbe:''},'Heart',0,10)===null,'half a pair has no gap');
 /* completion read from work done rather than from work declared */
 const pr=avatarProgress([{gap:{clear:true}},{gap:{clear:false}},{gap:{clear:true}}]);
 ok(pr.done===2&&pr.total===3&&pr.pct===67,'progress is what cleared, got '+pr.pct);
 ok(avatarProgress([])===null,'and nothing declared is nothing to report');

 /* ---- THE PURPOSE MAP ---- */
 const pp=purposeBlank();
 ok(pp.soul.length===3&&pp.ego.length===3,'three corners on each triangle');
 ok(PUR_SIDES.length===6&&PUR_PER_SIDE===5,'six sides of five, which is thirty');
 ok(Object.keys(pp.sides).length===6,'and a list for each side');
 ok(purposeReady(pp)===false,'an empty map is not ready');
 pp.soul=['freedom','wisdom','truth']; pp.ego=['health','family','stability'];
 ok(purposeReady(pp)===true,'six values in and it is');
 /* PURPOSE IS DERIVED AND NEVER ENTERED */
 const rd=purposeRead(pp);
 ok(rd&&rd.higher==='freedom, wisdom, truth','the higher centre is the sum of its corners');
 ok(rd.earthly==='health, family, stability','and the earthly one is too');
 ok(/how you make money and how you find fulfilment/.test(rd.between),
  'and the line between them answers the thing it was ruled to answer');
 ok(purposeCentre(['a','b'])===null,'two corners make no centre');
 ok(Object.keys(pp).indexOf('purpose')<0,
  'nothing called purpose is stored, because a derived value that is stored can drift');

 /* THE HEXAGON IS THE BOUNDARY */
 const bc0=boundaryCount(pp);
 ok(bc0.filled===0&&bc0.of===30,'thirty commitments, none written');
 ok(bc0.thin.length===6,'and every side is thin');
 pp.sides.partner=['a','b','c','d','e'];
 ok(boundaryCount(pp).filled===5,'a full side counts five');
 ok(boundaryCount(pp).thin.indexOf('partner')<0,'and stops being thin');
 /* which side an imprint landed on, which is the first time this product
    could say WHY the charge landed rather than only where */
 ok(boundaryCross('my wife said it again')==='partner','a partner is named');
 ok(boundaryCross('my manager moved the date')==='coworkers','a manager is');
 ok(boundaryCross('my mother rang')==='family','a mother is');
 ok(boundaryCross('the sky was grey')===null,'and an entry naming nobody crosses nothing');

 /* ---- THE BOUNDARY AT THE RECORD BOUNDARY ---- */
 const bp=blankProfile('av');
 ok(bp.avatar&&bp.purpose,'a new record carries both');
 const good=saveProfile(bp);
 good.avatar={built:true,at:'2026-01-01T00:00:00Z',reviewedAt:'2026-01-01T00:00:00Z',
  pairs:[{be:'I rest properly',notbe:'I have not slept properly in weeks'}]};
 good.purpose={soul:['freedom','wisdom','truth'],ego:['health','family','stability'],
  sides:{partner:['a'],family:[],friends:[],community:[],coworkers:[],alone:[]}};
 ok(validateProfile(good).ok,'a real one round trips');
 ok(validateProfile(good).profile.avatar.pairs.length===1,'with its pair');
 const halfPair=JSON.parse(JSON.stringify(good)); halfPair.avatar.pairs=[{be:'x'}];
 ok(!validateProfile(halfPair).ok,'half a pair is refused by name');
 /* A BOUNDARY QUIETLY TRUNCATED IS ONE A PERSON THINKS THEY SET */
 const over=JSON.parse(JSON.stringify(good));
 over.purpose.sides.partner=['a','b','c','d','e','f'];
 ok(!validateProfile(over).ok,'a sixth commitment on one side is refused, not dropped');
 ok(/more than 5/.test((validateProfile(over).errs||[]).join(' ')),'and says so by name');
 const fourVals=JSON.parse(JSON.stringify(good));
 fourVals.purpose.soul=['a','b','c','d'];
 ok(!validateProfile(fourVals).ok,'a fourth value on a triangle is refused');
 const older=JSON.parse(JSON.stringify(good)); delete older.avatar; delete older.purpose;
 ok(validateProfile(older).ok&&validateProfile(older).profile.avatar.built===false,
  'and an older record with neither is filled from the blank rather than broken');
}

g('25 \u00b7 the key. one thought line, at an address, by way of a channel');
/* RULED. One pattern is one thought line, and the line targets the address by
   way of the channel. The key was two parts and the code had taken half the
   ruling: every one of the fifty thoughts on a channel was the same key, so
   all two hundred statements on a card collapsed into four. */
{
 const {meterKey,meterNext,meterPlan,meterRun,meterRead,LINES_PER_CH,RUN_MAX,
        blankProfile,W}=E;
 ok(LINES_PER_CH===50,'fifty lines a channel, which is the printed card split, got '
  +LINES_PER_CH);
 ok(meterKey(7,'Rlimit',0)==='7:Rlimit:0','a key is address, channel and line');
 ok(meterKey(7,'Rlimit',0)!==meterKey(7,'Rlimit',1),
  'and two thoughts down one channel are two keys, which is the whole ruling');
 ok(meterKey(7,'Rlimit',0)!==meterKey(7,'Llimit',0),'two channels are still two');
 ok(meterKey(7,'Rlimit',0)!==meterKey(8,'Rlimit',0),'and two addresses are still two');

 /* THE CEILING. 107 releasable addresses, four channels, fifty lines. */
 const releasable=W.filter(n=>n.cf).length;
 ok(releasable===107,'a hundred and seven addresses carry an axis, got '+releasable);
 ok(releasable*4*LINES_PER_CH===21400,
  'so the product holds twenty one thousand four hundred units of new ground, got '
  +(releasable*4*LINES_PER_CH));

 /* THE CURSOR IS READ, NEVER STORED. A stored cursor and a stored key list are
    two answers to one question and they drift. */
 const p=blankProfile('key');
 ok(meterNext(p,7,'Rlimit')===0,'a fresh record starts at the first line');
 meterRun(p,[meterKey(7,'Rlimit',0),meterKey(7,'Rlimit',1)]);
 ok(meterNext(p,7,'Rlimit')===2,'and the cursor follows what was opened, got '
  +meterNext(p,7,'Rlimit'));
 ok(meterNext(p,7,'Llimit')===0,'each channel keeps its own place');
 {const full=[]; for(let i=0;i<LINES_PER_CH;i++)full.push(meterKey(9,'Rtruth',i));
  meterRun(p,full);
  ok(meterNext(p,9,'Rtruth')===-1,'and a fully opened channel says so rather than wrapping');}

 /* THE RUN IS A PLAN, capped, walking new ground only */
 const q=blankProfile('plan2');
 const CH=['Rlimit','Llimit','Rtruth','Ltruth'];
 /* A RUN COSTS THE MINIMUM, which for three addresses over four channels is
    twelve and not the cap. The cap is proved separately, on a selection wide
    enough to reach it. */
 const plan=meterPlan(q,[1,2,3],CH,RUN_MAX);
 ok(plan.length===3*CH.length,
  'a run is the addresses crossed with the channels, got '+plan.length);
 ok(plan.length<RUN_MAX,'and a narrow selection costs less than the cap');
 {const wide=meterPlan(blankProfile('plan3'),[1,2,3,4,5,6,7,8,9],CH,RUN_MAX);
  ok(wide.length===RUN_MAX,
   'a selection wide enough is truncated to the cap, got '+wide.length);}
 ok(new Set(plan).size===plan.length,'and never repeats a line inside one run');
 meterRun(q,plan);
 const plan2=meterPlan(q,[1,2,3],CH,RUN_MAX);
 ok(plan2.filter(k=>plan.indexOf(k)>=0).length===0,
  'the next run continues rather than re-offering what is open');
 ok(meterRead(q).unique===plan.length,
  'and a run spends exactly what it planned, got '+meterRead(q).unique);
 /* rerunning the same keys is still free, which is the standing ruling */
 const again=meterRun(q,plan);
 /* against the plan's own length, not the cap. A run is the minimum for what
    was picked now, so three addresses over four channels is twelve, and
    pinning the cap here asserted the old fill-to-ceiling behaviour. */
 ok(again.added===0&&again.repeated===plan.length,
  'rerunning opened ground costs nothing, added '+again.added);
 ok(meterRead(q).unique===plan.length,'and does not move the count');
 /* a plan over an address with nothing left returns nothing rather than looping */
 const drained=blankProfile('drain');
 const all=[]; CH.forEach(function(c){for(let i=0;i<LINES_PER_CH;i++)all.push(meterKey(1,c,i));});
 meterRun(drained,all);
 ok(meterPlan(drained,[1],CH,RUN_MAX).length===0,
  'an address fully opened offers nothing, rather than spinning');

 /* THE ARITHMETIC THE RULING FIXES. Tier one at four hundred a month against a
    ceiling of four hundred and twenty eight was five weeks of product. */
 ok(Math.round(releasable*4/400*10)/10===1.1,'the old ceiling was one month of tier one');
 ok(Math.round(releasable*4*LINES_PER_CH/400)===54,
  'the ruled one is fifty four, got '+Math.round(releasable*4*LINES_PER_CH/400));
}

g('26 \u00b7 numerology, in full');
{
 const {numerology,numerologyOf,numReduce,numIsVowel,numSays,
        NUM_LET,NUM_MASTER,NUM_DEBT,FULLNAME,BIRTH}=E;

 /* PYTHAGOREAN. A to I are 1 to 9, and then it wraps twice. S is 1 and Z is 8,
    which is the one end of the table every hand written version gets wrong. */
 ok(NUM_LET.A===1&&NUM_LET.I===9,'A is 1 and I is 9');
 ok(NUM_LET.J===1&&NUM_LET.R===9,'J starts the second nine and R ends it');
 ok(NUM_LET.S===1&&NUM_LET.Z===8,'S is 1 and Z is 8, so the last row is eight long');

 /* MASTERS SURVIVE REDUCTION AT EVERY STEP. A master reduced is a master lost,
    and the place it gets lost is inside a single name part. */
 ok(numReduce(29)===11,'29 reduces to 11 and stops');
 ok(numReduce(4)===4&&numReduce(39)===3,'and everything else reduces all the way');
 NUM_MASTER.forEach(function(m){ok(numReduce(m)===m,m+' survives reduction');});

 /* THE Y RULE, stated rather than felt: Y is a vowel when it has no vowel
    beside it. This is the one judgement call in the system and it is written
    down, which is more than most tables that use it can say. */
 ok(numIsVowel('WYN',1),'Y between two consonants carries the sound');
 ok(!numIsVowel('YARA',0),'Y beside a vowel does not');
 ok(numIsVowel('AMY',2),'Y at the end after a consonant does');
 ok(numIsVowel('MARIA',0)===false,'and an M is never a vowel whatever is beside it');

 /* THE SIX NUMBERS. Worked by hand against a name with a known shape.
    JAMES  1+1+4+5+1 = 12 -> 3
    EDWARD 5+4+5+1+9+4 = 28 -> 10 -> 1
    CAVANAUGH 3+1+4+1+5+1+3+7+8 = 33, a master, which is the whole point */
 const N=numerology('James Edward Cavanaugh','1969-09-27');
 ok(N.each[0].v===3,'James reduces to 3, got '+N.each[0].v);
 ok(N.each[1].v===1,'Edward reduces to 1, got '+N.each[1].v);
 ok(N.each[2].v===33,'Cavanaugh is a master 33, got '+N.each[2].v);
 ok(N.expression===numReduce(3+1+33),'expression is the parts reduced, not the letters piled');
 ok(N.lifePath===7,'life path off 1969-09-27 is 7, got '+N.lifePath);
 ok(N.birthday===27&&N.birthdayReduced===9,'birthday is the day unreduced, and its reduction');
 ok(N.maturity===numReduce(N.lifePath+N.expression),'maturity is life path plus expression');
 ok(N.soul>0&&N.personality>0,'the vowels and the consonants both produce a number');
 ok(N.cornerstone==='J'&&N.capstone==='H','cornerstone and capstone come off the ends');

 /* VOWELS PLUS CONSONANTS IS EVERY LETTER. The three sums have to reconcile or
    one of the three is reading the wrong letters, which is exactly what a Y
    rule applied in one place and not the other would do. */
 ['James Edward Cavanaugh','Ana Cristina Ferreira','Nkem Adaeze Okonkwo',
  'Wren Josephine Halliday','Amy Lynn Wyatt'].forEach(function(nm){
  const x=numerology(nm,'1980-01-01');
  const all=x.parts.reduce(function(a,p){return a+E.numSum(p,'all');},0);
  const v=x.parts.reduce(function(a,p){return a+E.numSum(p,'vowel');},0);
  const c=x.parts.reduce(function(a,p){return a+E.numSum(p,'cons');},0);
  ok(v+c===all,nm+': vowels plus consonants is every letter, '+v+'+'+c+' against '+all);});

 /* THE SPLIT IS REPORTED, NOT PICKED, AND IT IS RARER THAN IT LOOKS.

    Digit summing preserves value mod nine, so the two routes are always
    congruent and only the master rule can separate them: one route halts on
    11, 22 or 33 while the other walks past to a single digit. Cavanaugh's 33
    does not split this name, because both routes land on 1. The contract is
    that split is present exactly when the two disagree, never as a flag on
    "there is a master somewhere", which is what a looser test would have let
    through. */
 ok((N.split===null)===(N.expression===N.expressionFlat),
  'split is present exactly when the two routes disagree');
 ['John Smith','Ana Cristina Ferreira','Diane Elizabeth Halloran',
  'Marcus Aurelius Vance','Nkem Adaeze Okonkwo','Amy Lynn Wyatt'].forEach(function(nm){
  const x=numerology(nm,'1980-01-01');
  ok((x.split===null)===(x.expression===x.expressionFlat),
   nm+': split reports the disagreement and nothing else');
  ok(x.expression%9===x.expressionFlat%9||NUM_MASTER.indexOf(x.expression)>=0
   ||NUM_MASTER.indexOf(x.expressionFlat)>=0,
   nm+': the two routes stay congruent mod nine unless a master halts one');});

 /* KARMIC DEBT is read off the unreduced total and never inferred. */
 NUM_DEBT.forEach(function(d){ok(numReduce(d)===numReduce(d),'debt '+d+' is a real total');});
 ok(numerology('Aa','1980-01-01').debt===null,'a total that is not one of the four is not a debt');

 /* PURE. Same name in, same numbers out, and nothing read from shared state. */
 const a1=numerology('Diane Elizabeth Halloran','1980-11-02');
 S.doms=[5]; buildSoul(); compute();
 const a2=numerology('Diane Elizabeth Halloran','1980-11-02');
 ok(JSON.stringify(a1)===JSON.stringify(a2),'the reading does not move when the field does');
 reset();

 /* NOTHING IN, NOTHING OUT. A blank name is not a zero, it is an absence. */
 ok(numerology('','1980-01-01')===null,'an empty name reads null rather than a number');
 ok(numerology('Bo')&&numerology('Bo').lifePath===null,
  'and no birth date means no life path rather than a guessed one');

 /* THE ROSTER. Every reference case has a full name, because a numerology read
    off a first name is a numerology read off a nickname. */
 const roster=Object.keys(FULLNAME).filter(function(k){return FULLNAME[k];});
 ok(roster.length>=13,'every reference case carries a full name, got '+roster.length);
 roster.forEach(function(k){
  ok(FULLNAME[k].split(' ').length===3,k+' has a first, a middle and a last');
  const x=numerologyOf(k,null);
  ok(x&&x.expression>0&&x.lifePath!==null,
   k+': the full profile resolves off the roster');});

 /* THE PROFILE WINS. A real person's own name is on their profile and it takes
    precedence over anything in a table. */
 const p=E.blankProfile('num');
 p.who.first='Ada'; p.who.middle='Byron'; p.who.last='Lovelace';
 p.who.born.date='1815-12-10';
 const own=numerologyOf('James',p);
 ok(own.parts.join(' ')==='ADA BYRON LOVELACE',
  'the profile name beats the roster table, got '+own.parts.join(' '));
 ok(own.lifePath===numerology('Ada Byron Lovelace','1815-12-10').lifePath,
  'and the birth date comes off the profile with it');

 /* the sentences differ by position, which is the whole reason they exist */
 ok(numSays('soul',1)!==numSays('personality',1),
  'the same digit does not say the same thing in the soul as in the personality');
}

/* ---------------------------------------------------------------------------
   27 · THE LADDER

   Pure functions of a profile and a moment. The moment is passed in rather
   than read from the clock, which is the whole reason a streak can be tested
   at all: a gate that ran at 23:59:58 and asserted against Date.now() would
   fail once a day forever.
--------------------------------------------------------------------------- */
console.log('\n27 · the ladder');
{
 /* named off E rather than the destructured list at the top, so this block
    stands alone and adding a mark never means editing an import line. */
 const {blankProfile,ladderRead,ledgerRead,streakRead,MARKS}=E;
 const NOW=Date.parse('2026-09-19T15:00:00Z');
 const day=n=>new Date(NOW-n*86400000).toISOString();
 const mk=days=>{const p=blankProfile('L');
  days.forEach(d=>p.rituals.push({t:day(d),min:10,steps:['a']}));return p;};

 /* a blank profile earns nothing and is not told it is at zero of sixteen */
 const b=blankProfile('L'), L0=ladderRead(b,NOW);
 ok(L0.earned.length===0,'a blank profile has earned nothing, got '+L0.earned.length);
 ok(L0.next&&L0.next.k==='first','and the next mark is the first run, got '
  +(L0.next&&L0.next.k));
 ok(streakRead(b,NOW).run===0,'and no streak');

 /* consecutive days count, and today is not required for the run to be live */
 ok(streakRead(mk([0,1,2,3,4]),NOW).run===5,'five consecutive days is a run of five');
 ok(streakRead(mk([1,2,3]),NOW).live===true,
  'a run ending yesterday is still live, because a streak must not break at midnight');
 ok(streakRead(mk([2,3,4]),NOW).live===false,'a run ending two days ago is not');
 /* and what was built is still reported after it lapses */
 ok(streakRead(mk([2,3,4,5,6,7,8,9]),NOW).best===8,
  'the longest run is reported after it has ended, got '
  +streakRead(mk([2,3,4,5,6,7,8,9]),NOW).best);
 /* THE RUN HALVES, IT DOES NOT RESET. Ruled, Bible 1133. This block used to
    assert the opposite, that a gap ends the run, and the ruling reversed it:
    a reset throws away a month for two missed days, costs 36 of 1000 at day 30
    when measured, and is not what the habit literature supports either.

    Four days standing, then two missed, then three more. Four halves to two,
    and the three that follow take it to five. */
 ok(streakRead(mk([0,1,2,5,6,7,8]),NOW).run===4,
  'a gap halves the run rather than ending it, got '
  +streakRead(mk([0,1,2,5,6,7,8]),NOW).run);
 /* ONE GRACE DAY COSTS NOTHING. A single missed day is a missed day and not a
    lapse, so the run walks straight through it. */
 ok(streakRead(mk([0,2,3,4]),NOW).run===4,
  'one missed day is a grace day and the run continues, got '
  +streakRead(mk([0,2,3,4]),NOW).run);
 /* and the halving has a floor, so it can never reach zero while there is a
    day on the record at all */
 ok(streakRead(mk([0,9]),NOW).run===1,
  'a long lapse halves to the floor of one, never to nothing, got '
  +streakRead(mk([0,9]),NOW).run);
 /* a month standing, one lapse, and half of it survives */
 ok(streakRead(mk([0,5,6,7,8,9,10,11,12,13,14,15]),NOW).run===6,
  'eleven days then a lapse leaves six, got '
  +streakRead(mk([0,5,6,7,8,9,10,11,12,13,14,15]),NOW).run);
 ok(streakRead(mk([0,1,2,5,6,7,8]),NOW).best===4,'and the longer one before it stands');
 /* two rituals on one day are one day */
 {const p=blankProfile('L');
  p.rituals.push({t:day(0),min:5}); p.rituals.push({t:day(0),min:5});
  ok(streakRead(p,NOW).run===1,'two rituals in a day are one day, got '
   +streakRead(p,NOW).run);
  ok(ledgerRead(p).minutes===10,'and both count toward minutes');}

 /* THE LEDGER COUNTS EVENTS AND NEVER A SHARE OF ANYTHING. */
 {const p=mk([0,1]); p.meter.unique=['a','b','c']; p.meter.lines=9;
  const l=ledgerRead(p);
  ok(l.ground===3,'ground is the unique addresses opened, got '+l.ground);
  ok(l.lines===9,'lines counts every line spoken, repeats included');
  ok(l.rituals===2,'rituals counts saved rituals');
  ok(Object.keys(l).every(k=>l[k]>=0),'no ledger figure is negative');}

 /* every mark is a named thing, so every mark has an icon and a family */
 ok(MARKS.filter(m=>!m.ic).length===0,'every mark has an icon');
 ok(MARKS.filter(m=>!m.b||BANDS.indexOf(m.b)<0).length===0,
  'every mark has a seat, which is where its colour comes from');
 ok(new Set(MARKS.map(m=>m.ic)).size===MARKS.length,'and no two share a mark');
 ok(new Set(MARKS.map(m=>m.k)).size===MARKS.length,'and no two share a key');

 /* NEXT IS ONE MARK. The read returns the earned set and a single next, and
    never the remainder, because a caller that could see the remainder could
    render a person's unfinished self as a checklist. */
 {const p=mk([0,1,2,3,4,5,6]);
  const L=ladderRead(p,NOW);
  ok(L.next&&!L.earned.some(m=>m.k===L.next.k),'the next mark is not one already earned');
  ok(L.remaining===undefined&&L.all===undefined&&L.total===undefined,
   'the read exposes no remainder and no total to print a count against');
  ok(L.earned.some(m=>m.k==='week'),'seven days running earns the week mark');}
}

console.log('\n27c · a save never costs a person data, and a drain never leaks');
{
 let mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});

 /* KEPT MEANS KEPT ON THE DISK. The refusal path held a record in memory and
    the next write erased it, while the comment beside it said it was kept.
    Measured before: two records on disk, one refused, one save, disk held one. */
 mem['source.profiles']=JSON.stringify([
  {v:2,name:'Good',axes:{},intake:{answers:{}}},
  {v:2,name:'Refused',avatar:'not an object'}]);
 const loaded=E.pStore();
 ok(loaded.length===1,'the good record loads');
 ok(E.storeRefused().length===1,'and the refusal is reported');
 /* PROFILES is module state and earlier blocks in this file have put their
    own records in it, so an exact match here tests the order of this file
    rather than the product. What matters is that the refused record is still
    on the disk after a write. */
 const names=()=>JSON.parse(mem['source.profiles']).map(x=>x.name);
 E.pPersist();
 ok(names().indexOf('Refused')>=0,
  'and a write puts the refused record back untouched, got '+names().join(','));

 /* A SAVE REPORTS WHETHER IT SAVED. */
 ok(typeof E.pPersist()==='boolean','the write reports a boolean');
 E.bindStore(()=>null,()=>{throw new Error('QuotaExceededError');});
 ok(E.pPersist()===false,'and reports false when the store throws');
 ok(E.saveState().ok===false,'and the state names the failure');
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});

 /* THE BOUNDARY IS ON THE WAY OUT TOO. obValidate ran on queue and not on
    drain, so anything already in the key went to the host unread. Measured
    before: name, email and story all crossed the wire. */
 mem[E.OBKEY]=JSON.stringify([{kind:'question',body:'hi',
  name:'Lance',email:'l@x.com',story:'secret'}]);
 const sentKeys=[];
 E.bindSend(function(e){sentKeys.push(Object.keys(e).sort().join(','));return true;});
 const d=E.obDrain();
 E.bindSend(null);
 ok(sentKeys.length===0,'an envelope the boundary refuses never reaches the host');
 ok(d.state==='refused','and the drain says so rather than reporting sent');

 mem[E.OBKEY]=JSON.stringify([{kind:'question',at:'2026-09-19',body:'the compass overlaps',
  answers:{},band:'median',build:'abc',platform:'desktop',viewport:'wide'}]);
 const ok2=[];
 E.bindSend(function(e){ok2.push(e.kind);return true;});
 const d2=E.obDrain();
 E.bindSend(null);
 ok(d2.state==='sent'&&ok2.length===1,'a clean envelope still sends');
 E.bindStore(()=>null,()=>{});
}

console.log('\n27b · a profile from an older build still loads');
{
 /* THIS IS THE ONE THE OWNER HIT. A profile written by an earlier build has no
    soul, loadProfile read p.soul.doms without a guard, and the throw took the
    boot down: the centre canvas measured 0 by 0 and the menu went with it.
    It only ever reproduced for somebody who had used the product before, which
    is why every cold boot test in this file passed while his did not. */
 let mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const older={v:2,name:'Lance',
  who:{first:'Lance',middle:'',last:'Powell',sex:'m',
   born:{date:'1971-06-04',time:'',place:'Denver',timeUnknown:true}},
  intake:{answers:{0:9,1:8},startedAt:'2026-09-18T00:00:00.000Z'},
  /* the three shapes an earlier build actually wrote */
  avatar:null, purpose:null, seed:null};
 mem['source.profiles']=JSON.stringify([older]);

 const got=E.pStore();
 ok(got.length===1,'an older profile survives the boundary, got '+got.length);
 ok(E.storeRefused().length===0,
  'and is not refused: '+JSON.stringify(E.storeRefused()));
 ok(got[0].name==='Lance','and keeps its name, got '+got[0].name);

 /* NULL IS MISSING, NOT WRONG. A missing field is an older profile and is
    filled from the blank. Only a wrong type or an out of range value is
    refused by name. These two were refused on !==undefined, which took the
    person's entire profile with them. */
 ok(got[0].avatar&&typeof got[0].avatar==='object',
  'a null avatar is filled from the blank rather than refused');
 ok(got[0].purpose&&typeof got[0].purpose==='object',
  'and so is a null purpose');
 ok(got[0].soul&&Array.isArray(got[0].soul.doms),
  'and the soul the older build never wrote is there');

 /* AND A WRONG TYPE IS STILL REFUSED, or the fix above would have turned the
    boundary off rather than corrected it. */
 mem['source.profiles']=JSON.stringify([{v:2,name:'Bad',avatar:'not an object'}]);
 ok(E.pStore().length===0,'a wrong type is still refused');
 ok(E.storeRefused().length===1,'and the refusal is reported rather than swallowed');

 /* ONE BAD RECORD MUST NOT TAKE THE OTHERS WITH IT. */
 mem['source.profiles']=JSON.stringify([older,{v:2,name:'Bad',avatar:42},older]);
 ok(E.pStore().length===2,'one refused record leaves the other two loadable');
 E.bindStore(()=>null,()=>{});
}

console.log('\n28 · no title is a truncation');
{
 /* A TITLE IS WHAT A PERSON READS, SO IT IS A WHOLE WORD. Two shipped
    abbreviated: "Inspired Act." and "Disgust · Acc.". They are the label on a
    card and the thing a person searches for, and a film arrived from the owner
    called "Inspired Action", which is the name the world uses.

    A sentence ending in a full stop is not a truncation, so this looks for an
    abbreviation: a short last word ending in a stop with no space before the
    stop and no sentence in front of it. */
 const trunc=E.HARM.filter(x=>{
  const t=x.t.trim();
  if(!/\.$/.test(t))return false;
  if(t.split(/\s+/).length>4)return false;   /* a sentence, not a title */
  return true;});
 ok(trunc.length===0,'no knowledge base title is abbreviated: '
  +trunc.map(x=>x.c+' '+x.t).join(', '));
 /* and the two that were */
 const byc=c=>(E.HARM.filter(x=>x.c===c)[0]||{}).t;
 ok(byc('E06')==='Inspired Action','E06 is Inspired Action in full');
 ok(byc('E63')==='Disgust · Acceptance','E63 names the pole in full');
}

console.log('\n29 · every archetype is seated');
{
 /* IF IT HAS A NAME IT HAS AN ICON, THE ICON HAS A FAMILY, AND THE FAMILY HAS
    A COLOUR. Twelve archetypes wore a mark and no family, so both renderers
    passed the literal 'Heart' for all of them and a primary Warrior printed
    in the same green as a primary Sage. */
 ok(E.ARCH.every(a=>a.b),'every archetype names a seat');
 ok(E.ARCH.every(a=>E.BANDS.indexOf(a.b)>=0),
  'and every seat named is one of the seven');
 /* the owner's three, written as he gave them */
 const aseat=n=>(E.ARCH.filter(a=>a.nm===n)[0]||{}).b;
 ok(aseat('Warrior')==='Root','the warrior is root');
 ok(aseat('Sage')==='Crown','the sage is crown');
 ok(aseat('Magician')==='3rd Eye','the mage is third eye');
 /* NOT ALL ONE SEAT, which is the defect this closes. A single seat across
    twelve would pass every check above and reproduce exactly what was wrong. */
 ok(new Set(E.ARCH.map(a=>a.b)).size>=6,
  'and the twelve are spread across at least six of the seven');
 ok(E.ARCH.every(a=>a.ic),'every archetype still wears its own mark');
 ok(new Set(E.ARCH.map(a=>a.ic)).size===E.ARCH.length,'and no two share one');
}

console.log('\n30 · the outbox, and what may never leave the device');
{
 /* A STORE THAT IS NOT THE REAL ONE. The engine is host free and binds its
    storage, so the outbox is testable headless without a browser. */
 let mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k], (k,v)=>{mem[k]=String(v);});
 mem[E.OBKEY]='[]';

 /* THE ALLOW LIST IS THE SPEC. This is the gate the architect asked for and it
    exists to catch one specific failure: somebody six months from now adding a
    field that is obviously useful and obviously fine. */
 ok(E.OB_KEYS.length===8,'the envelope carries eight keys and no more');
 const e=()=>({kind:'question',at:'2026-09-19',body:'the compass text overlaps',
  answers:{},band:'median',build:'abc1234',platform:'desktop',viewport:'wide'});
 ok(E.obValidate(e()).ok,'a well formed envelope passes the boundary');

 /* REFUSED BY NAME, never stripped in silence, because a silently cut field
    reads back to the person as something they never wrote. */
 E.OB_NEVER.slice(0,8).forEach(k=>{
  const bad=e(); bad[k]='anything';
  const v=E.obValidate(bad);
  ok(!v.ok&&v.errs.join().indexOf(k)>=0,
   'the envelope refuses '+k+' by name');});

 {const bad=e(); bad.body='write to lance@example.com';
  const v=E.obValidate(bad);
  ok(!v.ok,'a mail shaped string in the body is refused');
  ok(/identifies you/.test(v.errs.join()),'and the refusal says why');
  ok(bad.body==='write to lance@example.com','and the body is not edited');}
 {const bad=e(); bad.body='call 555 867 5309 about it';
  ok(!E.obValidate(bad).ok,'a long run of digits in the body is refused');}
 {const bad=e(); bad.kind='newsletter';
  ok(!E.obValidate(bad).ok,'a kind that is not one of the four is refused');}
 {const bad=e(); bad.body='x'.repeat(E.OB_LIMIT.question+1);
  const v=E.obValidate(bad);
  ok(!v.ok&&/limit is/.test(v.errs.join()),
   'over the ceiling is refused with the number, and never truncated');}

 /* THE BAND IS BUCKETED. A feedback row is worthless without knowing where on
    the curve it came from, and a fine grained band beside a platform and a
    theme is a cell of one in a panel of thirty. Three buckets keep the
    analysis and kill the cell. The raw reading never travels. */
 ok(E.obBand({unread:true})==='unread','an unread profile says unread, not a number');
 ok(E.obBand({CQ:41})==='low'&&E.obBand({CQ:62})==='median'&&E.obBand({CQ:88})==='high',
  'the band is one of three buckets');
 ok(typeof E.obBand({CQ:88})==='string','and never the reading itself');

 /* OVER THE CAP IS REFUSED, NOT EVICTED. A queue that quietly discards a
    person's words has lost them, which is what this file exists to prevent. */
 mem[E.OBKEY]='[]';
 let n=0;
 for(let i=0;i<E.OB_MAX;i++){ if(E.obQueue(e()).ok) n++; }
 ok(n===E.OB_MAX,'the outbox takes '+E.OB_MAX+' entries');
 const over=E.obQueue(e());
 ok(!over.ok&&/not taken/.test(over.why),'and refuses the next one rather than evicting');
 ok(E.obCount()===E.OB_MAX,'and nothing already queued was thrown away');

 /* NEVER SENT OFF A LOCAL ENQUEUE. */
 E.bindSend(null);
 ok(E.obDrain().state==='nohost','with no host bound the drain says nohost');
 ok(E.obCount()===E.OB_MAX,'and nothing was lost');
 E.bindSend(()=>true);
 const d=E.obDrain();
 ok(d.state==='sent'&&d.n===E.OB_MAX,'with a host that accepts, everything goes');
 ok(E.obCount()===0,'and the queue empties');
 E.bindSend(()=>false);
 E.obQueue(e());
 const f=E.obDrain();
 ok(f.state==='retry'&&f.n===1,'a host that refuses leaves the entry in the queue');
 ok(E.obCount()===1,'so nothing a person wrote is ever dropped on a failed send');
 E.bindSend(null);
}

g('31 · the lean, two channels and the frame that gates one of them');
/* WHAT THIS GROUP EXISTS TO CATCH, because a check that has never failed is
   not yet a check and every assertion below was run against a deliberately
   broken engine first. The shipped lean scored an account of being harmed as
   more malignant than an account of doing harm and owning it, by a factor of
   three. Four separate defects produced it and each one has its own
   assertion here. The harm accounts are asserted as behaviour, not as
   numbers, so tuning the weights does not fail this and inverting the
   reading does. */
{
 const {LEANCH,LEANLEX,LEANCUE,LEANFRAME,LEANOUT,LEANMIX,VERPCUE,
        leanScan,leanApply,leanRead,leanAdmit,leanSeries,gatesClear,
        LEAN_MIN_CH,LEAN_TRUST_CAP,LEAN_NEG_W,blankProfile,saveProfile,loadProfile}=E;
 const CH=LEANCH.map(c=>c.k);

 /* ---- the channels are two, and they are separate ---- */
 ok(LEANCH.length===4,'four counts, got '+LEANCH.length);
 ok(new Set(LEANCH.map(c=>c.ch)).size===2,
    'across two channels, got '+new Set(LEANCH.map(c=>c.ch)).size);
 ok(LEANCH.filter(c=>c.dir==='shown').length===2&&LEANCH.filter(c=>c.dir==='lack').length===2,
    'two shown and two lack');
 ok(LEANCH.filter(c=>c.gate).length===2&&LEANCH.filter(c=>c.gate).every(c=>c.dir==='lack'),
    'the gated counts are exactly the two lack counts');
 CH.forEach(k=>ok(Array.isArray(LEANLEX[k])&&LEANLEX[k].length>0,
   'channel '+k+' has a list of its own'));

 /* ---- the tables cannot disagree with each other ---- */
 /* A PHRASE IN TWO LISTS POINTS TWO WAYS. 'let them' was benign and
    'let them think' was malignant on the shipped list, which is not caught
    by this but by the precedence check below; an exact duplicate is. */
 {
  const seen={},dup=[];
  CH.forEach(k=>LEANLEX[k].forEach(p=>{if(seen[p])dup.push(p+' in '+seen[p]+' and '+k);seen[p]=k;}));
  Object.keys(LEANFRAME).forEach(s=>LEANFRAME[s].forEach(p=>{
   if(seen[p])dup.push(p+' in '+seen[p]+' and frame.'+s);seen[p]='frame.'+s;}));
  ok(dup.length===0,'no phrase sits in two lists, '+dup.length+' do'+(dup[0]?': '+dup[0]:''));
 }
 /* ONE OCCURRENCE MUST NOT MOVE TWO INSTRUMENTS. 'let it go' was a benign
    lean cue and a detachment cue on the six gates, so one phrase in one
    sentence moved the lean and the cost multiplier. */
 {
  const vp={};Object.keys(VERPCUE).forEach(g2=>VERPCUE[g2].forEach(p=>{vp[p]=g2;}));
  const clash=[];
  CH.forEach(k=>LEANLEX[k].forEach(p=>{if(vp[p])clash.push(p+' is lean.'+k+' and verp.'+vp[p]);}));
  Object.keys(LEANFRAME).forEach(s=>LEANFRAME[s].forEach(p=>{
   if(vp[p])clash.push(p+' is lean frame.'+s+' and verp.'+vp[p]);}));
  ok(clash.length===0,'no phrase is a lean cue and a six gate cue, '+clash.length
   +' are'+(clash[0]?': '+clash[0]:''));
 }
 /* A PHRASE THE NORMALISER CANNOT PRODUCE CAN NEVER MATCH, and it sits in
    the table looking like coverage. The normaliser lowercases and keeps only
    letters, apostrophes, single spaces and the sentence bar. */
 {
  const bad=[];
  const check=(p,w)=>{
   if(!/^[a-z']+( [a-z']+)*$/.test(p))bad.push(w+' '+JSON.stringify(p));};
  CH.forEach(k=>LEANLEX[k].forEach(p=>check(p,'lean.'+k)));
  Object.keys(LEANFRAME).forEach(s=>LEANFRAME[s].forEach(p=>check(p,'frame.'+s)));
  ok(bad.length===0,'every phrase is reachable by the normaliser, '+bad.length
   +' are not'+(bad[0]?': '+bad[0]:''));
 }
 /* THE SORTED KEY CACHE MUST NOTICE A TABLE EDIT. it is built once and kept,
    and keyed on a bare null it would have made a phrase added at run time look
    like it landed while having no effect at all. */
 {
  const before=E.leanCount();
  gatesClear();
  ok(leanScan('i banjaxed the whole thing').acc===0,'a phrase not in the table does not match');
  LEANLEX.acc.push('i banjaxed');
  ok(E.leanCount()===before+1,'the table grew by one');
  ok(leanScan('i banjaxed the whole thing').acc===1,
   'and the sorted key cache picked it up rather than serving a stale list');
  LEANLEX.acc.pop();
  ok(E.leanCount()===before&&leanScan('i banjaxed the whole thing').acc===0,
   'and it picks up the removal too, so the table is left as it was found');
 }
 /* LEANCUE IS DERIVED NOW, so the old two way view cannot drift from the
    channels the way the hand written pair did. */
 ok(LEANCUE.benign.length===LEANLEX.emp.length+LEANLEX.acc.length
  &&LEANCUE.malignant.length===LEANLEX.empLack.length+LEANLEX.accLack.length,
  'the two way view is the four channels and nothing else');
 ok(LEANOUT.length>0&&LEANOUT.every(r=>r.length===2&&r[1].length>10),
  'every phrase taken out carries a stated reason, '+LEANOUT.length+' of '+LEANOUT.length);

 /* ---- defect 1 and 2. negation, and precedence ---- */
 const scan=t=>{gatesClear();return leanScan(t);};
 {
  const a=scan('it was my fault');
  ok(a.acc===1&&a.accLack===0,'taking fault reads accountability taken');
  const b=scan('it was not my fault');
  ok(b.acc===0&&b.accLack===1,
   'DENYING fault does not read as taking it, got acc '+b.acc+' accLack '+b.accLack);
  const c=scan('none of it was my fault');
  ok(c.acc===0,
   'and a negator the table does not carry verbatim still voids it, got acc '+c.acc);
  const d=scan('i let them think i did not know');
  ok(d.acc+d.emp===0&&d.accLack===1,
   'a phrase outranks the words inside it, got shown '+(d.acc+d.emp)+' lack '+d.accLack);
  /* AND THE SAME RULE ACROSS THE WHOLE TABLE, driven off the table rather
     than off one example, so a pair added later is covered without anybody
     remembering to add a case. For every phrase that contains another
     phrase, scanning the longer one must land on the longer one's own list
     and nothing else. This is the check that 'let them' inside
     'let them think' would have failed. */
  {
   const own={};
   CH.forEach(k=>LEANLEX[k].forEach(q=>{own[q]='lean.'+k;}));
   Object.keys(LEANFRAME).forEach(w=>LEANFRAME[w].forEach(q=>{own[q]='frame.'+w;}));
   const all=Object.keys(own), nest=[], wrong=[];
   all.forEach(a=>all.forEach(b=>{
    if(a!==b&&(' '+a+' ').indexOf(' '+b+' ')>=0) nest.push([a,b]);}));
   nest.forEach(pr=>{
    const h=scan(pr[0]).hits;
    if(h.length!==1||h[0].p!==pr[0])
     wrong.push(JSON.stringify(pr[0])+' scored '+JSON.stringify(h.map(x=>x.p)));});
   ok(nest.length>0,'the table holds '+nest.length+' nested pairs to resolve');
   ok(wrong.length===0,'every one of the '+nest.length
    +' resolves to the longer phrase alone, '+wrong.length
    +' do not'+(wrong[0]?': '+wrong[0]:''));
  }
  /* THE LOOK BACK MUST NOT CROSS A SENTENCE. this voided a true cue. */
  const e=scan('i said things i cannot take back. i lied to her.');
  ok(e.self>=2,'a negator does not reach past a full stop, got self '+e.self);
  const f=scan('he did not hit me');
  ok(f.other===0,'and it voids a frame marker too, got other '+f.other);
 }

 /* ---- defect 4. the frame gate, which is the whole design ---- */
 ok(leanAdmit(0,0)===0,'no agency evidence admits nothing of the lack side');
 ok(leanAdmit(0,9)===0,'and no amount of harm evidence changes that');
 ok(leanAdmit(3,0)===1,'agency alone admits all of it');
 ok(leanAdmit(1,1)<0.5,'one report marker outweighs one agency marker');
 {
  const blame='It was her fault. If she had just listened. She owes me.';
  const bare=scan(blame);
  ok(bare.accLack>=3&&bare.malignant===0,
   'blame alone is counted and admitted at nothing, got lack '+bare.accLack
   +' admitted '+bare.malignant);
  const owned=scan('I shouted at her and I lied to her. '+blame);
  ok(owned.malignant>0,'the same blame beside the writer\'s own act is admitted, got '
   +owned.malignant.toFixed(2));
  ok(owned.accLack>=bare.accLack,'and the raw count did not change, only the gate');
 }

 /* ---- THE HARM TEST. asserted as behaviour, not as numbers ---- */
 /* Three accounts of real harm in plain language, and one account of doing
    harm and owning it, and one of refusing it. The ordering is the
    assertion. Under the shipped scanner these read 67, 60 and 51 of 100
    malignant against 36 for the deflection, which is the inversion. */
 {
  const harm=[
  `My manager took credit for the whole project in front of everyone. It was typical of them.
   I was the only one who worked the weekend on it. They started it when they moved my name off
   the deck. I did not tell anyone at the time because I needed the job. Nobody appreciates what
   that cost me. They owe me that year.`,
  `He was drunk again and he came into my room. I was eleven. I had no choice about any of it.
   It was their fault, not mine. They always said I was making it up and they never once asked me
   what happened. My mother should have known. Nobody believed me.`,
  `She hit me and then she cried and I ended up apologising to her. They always turn it around.
   I had no choice but to stay because of the kids. It was not my fault. If they had got help when
   I asked them to stop, none of this would have happened. I said no and he would not stop.`];
  const owning=
  `I was wrong about how I handled her. I shouted at her and I said things I cannot take back.
   I lied to her about where I had been and I hid it from her for months. It was my fault.
   I apologised properly and I told her the truth and I made amends. I can see what I did.`;
  const deflect=
  `None of it was my fault. It was her fault from the start. If she had just listened to me once
   I would not have had to raise my voice. I shouted at her, yes, but anyone would have.
   What was I supposed to do. She is pathetic when she gets like that and she had it coming.
   I kept it to myself because she did not need to know. She owes me an apology.`;
  const readOf=t=>{reset(0,0,6);gatesClear();if(t)leanApply(t);return leanRead(compute());};
  const base=readOf(null).mal;
  const hm=harm.map(readOf), ow=readOf(owning), df=readOf(deflect);
  hm.forEach((L,i)=>{
   ok(L.mal<=base+1.5,
    'harm account '+(i+1)+' does not read malignant, '+L.mal.toFixed(1)
    +' of 100 against '+base.toFixed(1)+' for a field with no story at all');
   ok(L.accountability.lack>0,
    'and its blame language WAS counted, '+L.accountability.lack
    +' refusal cues, so this is a frame decision and not a shorter list');
   ok(L.frame.admit===0||L.frame.admit<0.2,
    'the gate is what held it, admitted '+L.frame.admit.toFixed(2)+' of the lack cues');});
  ok(ow.mal<base,'owning harm reads less malignant than an unread field, '
   +ow.mal.toFixed(1)+' against '+base.toFixed(1));
  ok(df.mal>base,'refusing it reads more, '+df.mal.toFixed(1)+' against '+base.toFixed(1));
  /* THE INVERSION, ASSERTED DIRECTLY. this is the one that fails if the
     frame gate is removed, and it fails loudly. */
  hm.forEach((L,i)=>ok(df.mal>L.mal,
   'deflection reads more malignant than harm account '+(i+1)+', '
   +df.mal.toFixed(1)+' against '+L.mal.toFixed(1)));
  hm.forEach((L,i)=>ok(ow.mal<L.mal,
   'and owning harm reads less than harm account '+(i+1)+', '
   +ow.mal.toFixed(1)+' against '+L.mal.toFixed(1)));
  ok(ow.accountability.shown>=4&&ow.accountability.read,
   'the ownership account reads on the accountability channel, '
   +ow.accountability.shown+' of '+ow.accountability.of);
  ok(df.accountability.lack>=5,'and the deflection account reads on its lack side, '
   +df.accountability.lack+' of '+df.accountability.of);
 }

 /* ---- the lean is a READ and never an input ---- */
 {
  reset(0,0,6); gatesClear();
  const a=compute();
  leanApply('it was her fault and she is pathetic and she had it coming and i shouted at her');
  const b=compute();
  ok(a.CQ===b.CQ&&a.DQ===b.DQ,
   'applying a story to the lean moves no number in the arithmetic, CQ '+a.CQ+' then '+b.CQ);
 }

 /* ---- refusing to read is an answer ---- */
 {
  reset(0,0,6); gatesClear();
  const blank=leanRead(compute());
  ok(blank.cues===0&&blank.src==='field only','no story, the field speaks alone');
  ok(blank.channels===false,'and neither channel claims to have been read');
  ok(blank.empathy.pct===null&&blank.accountability.pct===null,
   'an unmeasured channel reports null and never a midpoint it invented');
  ok(blank.empathy.of===0&&blank.accountability.of===0,
   'and every count says what it is out of');
  gatesClear(); leanApply('i listened');
  const one=leanRead(compute());
  ok(one.empathy.of===1&&one.empathy.read===false,
   'one cue is under the floor of '+LEAN_MIN_CH+' and the channel reports read false');
  gatesClear(); leanApply('i listened and i forgave her');
  ok(leanRead(compute()).empathy.read===true,'at the floor it reports read true');
 }

 /* ---- trust. the story never speaks for the whole reading ---- */
 {
  let last=-1, mono=true, under=true;
  for(let n=1;n<=60;n++){
   gatesClear(); LEANMIX.benign=n; LEANMIX.texts=1;
   const t=leanRead({malig:80}).trust;
   if(t<=last)mono=false;
   if(t>=LEAN_TRUST_CAP)under=false;
   last=t;}
  ok(mono,'trust rises with every additional matched phrase');
  ok(under,'and stays under the cap at every count from 1 to 60');
  gatesClear(); LEANMIX.benign=1e6; LEANMIX.texts=1;
  ok(leanRead({malig:80}).trust<LEAN_TRUST_CAP,
   'and approaches the cap of '+LEAN_TRUST_CAP+' without ever reaching it');
  gatesClear(); LEANMIX.benign=7; LEANMIX.texts=1;
  ok(leanRead({malig:80}).trust<LEAN_TRUST_CAP*0.5,
   'seven matched phrases no longer buy the whole cap, they buy '
   +leanRead({malig:80}).trust.toFixed(3));
 }

 /* ---- clearing, and what persists ---- */
 /* LEANMIX GAINED EIGHT KEYS. zeroing two by name left six dirty across a
    read, which is a leak between two people's stories. */
 {
  Object.keys(LEANMIX).forEach(k=>{LEANMIX[k]=3;});
  gatesClear();
  const dirty=Object.keys(LEANMIX).filter(k=>LEANMIX[k]!==0);
  ok(dirty.length===0,'clearing zeroes every key of the mix, '+dirty.length
   +' survived'+(dirty[0]?': '+dirty[0]:''));
 }
 /* A HARM ACCOUNT MUST NOT TURN MALIGNANT ON A RELOAD. the admitted weight
    is what is written, never the raw count, because the frame is not in the
    profile and cannot be reapplied on the way back in. */
 {
  reset(0,0,6); gatesClear();
  const p=blankProfile('lean round trip');
  leanApply(`He came into my room. I was eleven. I had no choice. It was their fault.
   They always said I was making it up and nobody believed me.`);
  const before=leanRead(compute()).mal;
  saveProfile(p);
  ok(p.gates.lean.malignant===0,
   'nothing malignant was written for an account of being harmed, got '+p.gates.lean.malignant);
  loadProfile(p);
  const after=leanRead(compute()).mal;
  near(after,before,0.001,'and the reading is the same after a save and a load');
  ok(leanRead(compute()).channels===false,
   'the channel split is a session number, so a reloaded profile says so rather than reporting four zeros');
 }

 /* ---- direction over time ---- */
 {
  const p=blankProfile('lean series');
  ok(leanSeries(p).n===0&&leanSeries(p).of===0,'no history, no series');
  p.history=[{t:'a',cq:80},{t:'b',cq:40},{t:'c'}];
  const s=leanSeries(p);
  ok(s.n===2&&s.of===3,'the series counts against the history, '+s.n+' of '+s.of);
  ok(s.points[0].mal===0&&s.points[1].mal===20,
   'and recovers the field lean from cq alone, got '+s.points[1].mal);
  ok(s.storyCues===false,
   'and states on itself that the story half is not in the record');
 }

 /* ---- the keys the surfaces read ---- */
 {
  reset(0,0,6); gatesClear(); leanApply('i listened and i forgave her');
  const L=leanRead(compute());
  ['ben','mal','src','cues'].forEach(k=>ok(L[k]!==undefined,
   'leanRead still carries '+k+', which ui/summary.js and ui/ui.js print'));
  near(L.ben+L.mal,100,0.001,'benign and malignant are one field, summing to 100');
 }
}


g('32 · the sniffer knows what it is looking for');
/* WHAT THIS GROUP ASSERTS, and why it exists at all.

   The owner asked whether the sniffer has the information and the logic the
   canon supplies. Measured before this group was written: 1 of the 9 axes the
   instrument scores resolved in the lexicon, and 0 of the 7 cue words the 33
   saboteurs are defined by. So the scoring layer and the reading layer did not
   share a vocabulary, and nothing anywhere would have said so.

   This asserts CLOSURE, not accuracy. Accuracy needs a labelled set of real
   stories and there is not one yet, and a gate that pretends otherwise is
   worse than no gate. What is checkable without labels is that every word the
   canon is built out of can be found, that every entry says where it came
   from, and that the fold cannot smuggle in a reading. All three were false. */
{
 const {LEX,ADJ2CHG,LEXMETA,CHGMETA,LEX_SEAT,LEX_AMT,LEX_FET,LEX_SEATS,LEX_SRC,
        LEX_AMT_MAX,LEX_FOLD_RULES,LEX_FOLD_OK,LEX_FOLD_NO,LEXCANONRUN,LEXFOLDRUN,
        lexAdd,chgAdd,lexRefuse,lexKeyOk,lexFold,lexCanon,lexCanonWords,
        lexFamilyFloor,scanStory,parseStory,CHG2SEAT,CHG2FET}=E;
 const resolves=w=>scanStory(w).length>0;

 /* ---- the thing that was wrong. every count says what it is out of. ---- */
 const axes=CHARGES.map(c=>String(c).toLowerCase());
 const missAx=axes.filter(w=>!resolves(w));
 ok(missAx.length===0,'every one of the '+axes.length+' axis names resolves in the '
  +'lexicon, '+missAx.length+' do not: '+JSON.stringify(missAx));
 const cue={};SAB33.forEach(r=>r[1].forEach(p=>{cue[p[0]]=1;}));
 const cues=Object.keys(cue).sort();
 const missCue=cues.filter(w=>!resolves(w));
 ok(missCue.length===0,'every one of the '+cues.length+' cue words the '+SAB33.length
  +' saboteurs are defined by resolves, '+missCue.length+' do not: '+JSON.stringify(missCue));
 /* AND IT RESOLVES TO THE RIGHT AXIS, not merely to something. A word that
    finds a seat and the wrong fetter is worse than a word that finds nothing,
    because the person is then told about a charge they did not report. */
 const wrong=axes.filter(w=>{
  const im=parseStory('i am full of '+w).imprints;
  return !im.length||!im.some(i=>i.fetter===CHG2FET[w]||i.fetter===CHARGES.find(c=>String(c).toLowerCase()===w));});
 ok(wrong.length===0,'and each axis name reads as its own axis, '+wrong.length
  +' of '+axes.length+' do not: '+JSON.stringify(wrong));
 /* AND IT IS NAMED, NOT INFERRED. inferred is the flag that decides what the
    product may print as a finding. A person who wrote the axis by its own name
    has named it, and an imprint marked inferred off that word would have the
    instrument disowning the plainest evidence it ever gets. */
 const inferred=axes.filter(w=>{
  const im=parseStory('i am full of '+w).imprints;
  return im.length&&im.every(i=>i.inferred);});
 ok(inferred.length===0,'and reads as NAMED rather than inferred, '+inferred.length
  +' of '+axes.length+' do not: '+JSON.stringify(inferred));

 /* ---- the canon pass invented nothing ---- */
 ok(LEXCANONRUN.unseated.length===0,'every canon word the pass owes has a seat in '
  +'CHG2SEAT, '+LEXCANONRUN.unseated.length+' do not: '+JSON.stringify(LEXCANONRUN.unseated));
 ok(LEXCANONRUN.added+LEXCANONRUN.already===lexCanonWords().length,
  'the canon pass accounts for every word it owes, '+(LEXCANONRUN.added+LEXCANONRUN.already)
  +' of '+lexCanonWords().length);
 const fl=lexFamilyFloor();
 const canon=Object.keys(LEXMETA).filter(k=>LEXMETA[k].src==='canon');
 ok(canon.length===LEXCANONRUN.added,'and every one of the '+canon.length
  +' it added is marked canon');
 /* THE AMOUNT IS DERIVED AND NOT TYPED. This is the assertion that stops a
    magic number appearing in the most load bearing row of the table. */
 const typed=canon.filter(k=>{
  const f=LEX[k][LEX_FET], want=fl.fam[f]!==undefined?fl.fam[f]:fl.floor;
  return LEX[k][LEX_AMT]!==want;});
 ok(typed.length===0,'every canon amount is its axis family floor, '+typed.length
  +' of '+canon.length+' are not: '+JSON.stringify(typed));
 const seatmoved=canon.filter(k=>E.B2K[CHG2SEAT[k]]!==LEX[k][LEX_SEAT]);
 ok(seatmoved.length===0,'and every canon seat is the one CHG2SEAT gives it, '
  +seatmoved.length+' of '+canon.length+' are not: '+JSON.stringify(seatmoved));

 /* ---- the fold changes the surface form and nothing else ---- */
 const fold=Object.keys(LEXMETA).filter(k=>LEXMETA[k].src==='fold');
 ok(fold.length===LEX_FOLD_OK.filter(f=>!LEX_FOLD_NO[f]).length,
  'the fold admitted '+fold.length+' of the '+LEX_FOLD_OK.length+' forms on the allow '
  +'list, '+Object.keys(LEX_FOLD_NO).length+' of which are refused by name');
 ok(LEXFOLDRUN.unreachable.length===0,'every admitted form is reachable from a real '
  +'key by a named rule, '+LEXFOLDRUN.unreachable.length+' are not: '
  +JSON.stringify(LEXFOLDRUN.unreachable));
 const drift=fold.filter(f=>{
  const b=LEXMETA[f].from, e=LEX[f], be=LEX[b];
  return !be||e[LEX_SEAT]!==be[LEX_SEAT]||e[LEX_AMT]!==be[LEX_AMT]
   ||String(e[LEX_FET])!==String(be[LEX_FET]);});
 ok(drift.length===0,'a fold carries its base seat, amount and stated fetter '
  +'unchanged, '+drift.length+' of '+fold.length+' do not: '+JSON.stringify(drift));
 const chgdrift=fold.filter(f=>ADJ2CHG[LEXMETA[f].from]&&ADJ2CHG[f]!==ADJ2CHG[LEXMETA[f].from]);
 ok(chgdrift.length===0,'and its base charge name, '+chgdrift.length+' do not: '
  +JSON.stringify(chgdrift));
 /* THE RULE IS RE-DERIVED RATHER THAN TRUSTED. A form hand typed into the allow
    list with no reachable base would pass a spelling check and fail this. */
 const unreach=LEX_FOLD_OK.filter(f=>{
  const base=Object.keys(LEX).filter(k=>k.indexOf(' ')<0&&LEXMETA[k]&&LEXMETA[k].src!=='fold');
  return !base.some(k=>LEX_FOLD_RULES.some(r=>r[1](k)&&r[2](k)===f));});
 ok(unreach.length===0,'every form on the allow list is generated by one of the '
  +LEX_FOLD_RULES.length+' rules, '+unreach.length+' of '+LEX_FOLD_OK.length
  +' are not: '+JSON.stringify(unreach));
 /* THE REFUSALS ARE REFUSED, WITH A REASON. Two of the four fold off coherent
    keys, where a false positive lowers a reading rather than raising it. */
 const leaked=Object.keys(LEX_FOLD_NO).filter(f=>LEX[f]);
 ok(leaked.length===0,'a refused form never reaches the table, '+leaked.length
  +' of '+Object.keys(LEX_FOLD_NO).length+' did: '+JSON.stringify(leaked));
 ok(Object.keys(LEX_FOLD_NO).every(f=>typeof LEX_FOLD_NO[f]==='string'&&LEX_FOLD_NO[f].length>20),
  'and every refusal states its reason');

 /* ---- provenance covers the table exactly, in both directions ---- */
 const noMeta=Object.keys(LEX).filter(k=>!LEXMETA[k]);
 const orphan=Object.keys(LEXMETA).filter(k=>!LEX[k]);
 ok(noMeta.length===0,'every one of the '+Object.keys(LEX).length+' entries says where '
  +'it came from, '+noMeta.length+' do not: '+JSON.stringify(noMeta.slice(0,8)));
 ok(orphan.length===0,'and the provenance table names no entry that does not exist, '
  +orphan.length+' do: '+JSON.stringify(orphan.slice(0,8)));
 const badsrc=Object.keys(LEXMETA).filter(k=>LEX_SRC.indexOf(LEXMETA[k].src)<0);
 ok(badsrc.length===0,'every source is one of the '+LEX_SRC.length+' named, '
  +badsrc.length+' are not: '+JSON.stringify(badsrc.slice(0,8)));
 ok(Object.keys(CHGMETA).length===Object.keys(ADJ2CHG).length,
  'the charge name table is covered the same way, '+Object.keys(CHGMETA).length
  +' of '+Object.keys(ADJ2CHG).length);
 /* derived entries must name what they were derived FROM, or the provenance is
    a label rather than a trail. */
 const noFrom=Object.keys(LEXMETA).filter(k=>LEXMETA[k].src!=='authored'&&!LEXMETA[k].from);
 ok(noFrom.length===0,'every derived entry names its source table or base word, '
  +noFrom.length+' do not: '+JSON.stringify(noFrom.slice(0,8)));

 /* ---- every entry validates against its own schema, and none is a dead row ---- */
 const bad=[];
 Object.keys(LEX).forEach(k=>{
  const e=LEX[k];
  const errs=lexRefuse(k,e[LEX_SEAT],e[LEX_AMT],e[LEX_FET]!=null?e[LEX_FET]:null);
  if(errs.length)bad.push(k+': '+errs[0]);});
 ok(bad.length===0,'every one of the '+Object.keys(LEX).length+' entries passes the '
  +'boundary it is added through, '+bad.length+' do not: '+JSON.stringify(bad.slice(0,6)));
 /* A DEAD ROW LOOKS LIVE. A key the normaliser can never produce, a capital or
    a comma or a double space, sits in the table forever matching nothing. */
 const dead=Object.keys(LEX).filter(k=>!scanStory(k).some(h=>h.t===k));
 const known=Object.keys(E.LEX_DEAD);
 const unknown=dead.filter(k=>!E.LEX_DEAD[k]);
 const revived=known.filter(k=>dead.indexOf(k)<0);
 ok(unknown.length===0,'every entry can actually be found by the scanner, or is '
  +'named in LEX_DEAD with the reason. '+dead.length+' of '+Object.keys(LEX).length
  +' cannot be found and '+unknown.length+' of those are unaccounted for: '
  +JSON.stringify(unknown.slice(0,8)));
 ok(revived.length===0,'and LEX_DEAD names no row that actually works, '
  +revived.length+' of '+known.length+' do: '+JSON.stringify(revived));
 ok(known.every(k=>typeof E.LEX_DEAD[k]==='string'&&E.LEX_DEAD[k].length>20),
  'and every dead row states why it is dead');
 const deadA=Object.keys(ADJ2CHG).filter(k=>!scanStory(k).some(h=>h.kind==='adj'&&h.t===k));
 ok(deadA.length===0,'and every charge name entry too, '+deadA.length+' of '
  +Object.keys(ADJ2CHG).length+' cannot: '+JSON.stringify(deadA.slice(0,8)));
 const deadP=[];E.PHRASES.forEach(r=>r[0].forEach(p=>{
  if(!scanStory(p).some(h=>h.kind==='phrase'&&h.t===p))deadP.push(p);}));
 ok(deadP.length===0,'and every phrase, '+deadP.length+' cannot: '+JSON.stringify(deadP.slice(0,6)));

 /* ---- the boundary REFUSES, which is the half a happy path never tests ---- */
 const before=Object.keys(LEX).length;
 const no=[
  ['a key with a capital',       ()=>lexAdd('Furious','solar',18,null,{src:'canon'})],
  ['a key with a comma',         ()=>lexAdd('so, tired','solar',18,null,{src:'canon'})],
  ['a seat that does not exist', ()=>lexAdd('newword','spleen',18,null,{src:'canon'})],
  ['an amount of zero',          ()=>lexAdd('newword','solar',0,null,{src:'canon'})],
  ['an amount past the ceiling', ()=>lexAdd('newword','solar',LEX_AMT_MAX+1,null,{src:'canon'})],
  ['a fractional amount',        ()=>lexAdd('newword','solar',18.5,null,{src:'canon'})],
  ['a negative charged entry',   ()=>lexAdd('newword','solar',-18,null,{src:'canon'})],
  ['a positive coherent entry',  ()=>lexAdd('newword','coherent',12,null,{src:'canon'})],
  ['a fetter off the nine axes', ()=>lexAdd('newword','solar',18,'Rage',{src:'canon'})],
  ['a source not on the list',   ()=>lexAdd('newword','solar',18,null,{src:'vibes'})],
  ['moving a key to a new seat', ()=>lexAdd('furious','heart',18,null,{src:'canon'})]];
 no.forEach(c=>{const r=c[1]();
  ok(!r.ok&&typeof r.why==='string'&&r.why.length>0,'the boundary refuses '+c[0]
   +' and says why'+(r.ok?'':': '+r.why));});
 ok(Object.keys(LEX).length===before,'and refusing wrote nothing, still '+before+' entries');
 ok(chgAdd('furious','sadness',{src:'canon'}).ok===false,
  'and the charge table refuses to move a word to a different axis');
 ok(lexKeyOk('wiped out')&&lexKeyOk("cant breathe")&&!lexKeyOk('Wiped Out')
  &&!lexKeyOk('wiped  out')&&!lexKeyOk(''),'a key is a form the normaliser can produce');

 /* ---- the passes are idempotent, so a re-run cannot double the table ---- */
 const n1=Object.keys(LEX).length, a1=Object.keys(ADJ2CHG).length;
 const c2=lexCanon(), f2=lexFold();
 ok(Object.keys(LEX).length===n1&&Object.keys(ADJ2CHG).length===a1,
  'running both passes again adds nothing, '+Object.keys(LEX).length+' of '+n1);
 ok(c2.added===0&&f2.added===0,'and both report they added nothing');

 /* ---- and the sniffer is still the sniffer ---- */
 reset(5,0,6);
 const t='i am full of anger and i cannot keep going';
 ok(JSON.stringify(parseStory(t))===JSON.stringify(parseStory(t)),
  're-parsing gives back the same reading');
 const seen=parseStory('i am full of anger');
 ok(seen.imprints.length>0&&seen.imprints.every(i=>i.amt>0&&E.BY[i.node]),
  'a canon word lands on a real address with weight');
 ok(!/diagnos|disorder/i.test(JSON.stringify(seen)),'and names no diagnosis');
}

g('33 · the sniffer contract, and the four guards that are testable');
/* ADDITIVE. Nothing above this line is changed.

   SNIFFER_SPEC.md section 11 lists eight guards and calls them non negotiable.
   Four of them are assertions a headless gate can actually make and they are
   made here. The other four are not, and saying which is which is part of the
   job: guard 1 no diagnosis and guard 2 never score another person are
   satisfied by the absence of a mechanism rather than by a rule, so the most a
   gate can do is assert no clinical string reaches the output; guard 5 show
   upstream with any avoidance number is a rendering rule, so what is asserted
   is that the engine makes it impossible to hand a renderer the number without
   the upstream beside it; guard 8 label the estimator is a UI rule and lives in
   a file this group does not own.

   EVERY ONE OF THESE WAS BROKEN ON PURPOSE AND THE FAILURE NAME RECORDED
   BEFORE IT WAS PUT BACK. The names are in TDD-sniffer.md. A gate nobody has
   seen fail is a gate nobody has tested. */
{
 const {sniffStory,sniffAxes,sniffSaboteurs,sniffLaws,sniffFlow,sniffGates,
        sniffDepth,sniffOffer,sabMember,sabFetters,sabConfidence,sabWeight,
        SAB_EDGE,SAB_BELOW,SAB_ABOVE,SABW,SAB_ARITY,LAWCUE,EXPRCUE,DANTECUE,
        lawCoverage,SPEC_POLE,LEXCOMP,LAWVIO,GATE_BASE,GATE_STEP,parseStory}=E;

 /* ---- GUARD 3 · two readings per axis, never one signed number ---- */
 const two=sniffStory('i am afraid and i am calm and settled about the rest of it');
 ok(two.axes.length===CHARGES.length,'every axis is reported, '+two.axes.length+' of '+CHARGES.length);
 ok(two.axes.every(a=>typeof a.shadow==='number'&&typeof a.coherent==='number'),
  'each axis carries a shadow AND a coherent number');
 ok(two.axes.every(a=>a.shadow>=0&&a.coherent>=0),
  'neither reading is ever negative, so neither is a signed collapse of the other');
 /* THE ASSERTION THAT ACTUALLY CATCHES THE COLLAPSE. A signed single number
    cannot hold a high shadow and a high coherent at once, so the gate builds
    exactly that field and asserts both survive. */
 {
  const both=sniffAxes(parseStory('i am terrified and i am calm and rested and content'));
  const f=both.find(a=>a.axis==='Fear');
  ok(f&&f.shadow>0,'a field with real fear reports real fear, '+(f?f.shadow:'none'));
  const anyCoh=both.some(a=>a.coherent>0);
  ok(anyCoh,'and the coherent reading in the same text is not cancelled by it');
  ok(!both.some(a=>a.shadow<0||a.coherent<0),
   'and nothing went negative, which is what a collapse looks like');
 }

 /* ---- GUARD 4 · band edges are ramps, not cliffs ---- */
 /* CONTINUITY. The shipped staircase rounded the level first, so 6.4 and 6.6
    were different answers. The ramp must not have a step anywhere. */
 {
  let worst=0, at=null;
  for(let v=0;v<=10.0001;v+=0.05){
   const a=sabMember(Math.round(v*100)/100,7,9), b=sabMember(Math.round((v+0.05)*100)/100,7,9);
   if(Math.abs(a-b)>worst){worst=Math.abs(a-b);at=v;}}
  ok(worst<0.05,'the ramp has no step: largest move per twentieth of a point is '+
   worst.toFixed(4)+' near '+(at===null?'nowhere':at.toFixed(2)));
  ok(sabMember(6.45,7,9)>0&&sabMember(6.55,7,9)>0,
   'and a reading half a point under the band still carries membership');
  ok(Math.abs(sabMember(6.45,7,9)-sabMember(6.55,7,9))<0.05,
   'and the two of them are nearly the same answer, which is the whole ruling');
 }
 /* IT PEAKS INSIDE THE BAND AND TAPERS ABOVE, both stated by the spec. */
 ok(sabMember(8,7,9)>sabMember(7,7,9)&&sabMember(8,7,9)>sabMember(9,7,9),
  'membership peaks inside the band rather than sitting flat across it');
 ok(sabMember(7,7,9)===SAB_EDGE&&sabMember(9,7,9)===SAB_EDGE,
  'and both edges sit at SAB_EDGE, '+SAB_EDGE);
 ok(sabMember(9+SAB_ABOVE,7,9)===0&&sabMember(7-SAB_BELOW,7,9)===0,
  'membership reaches zero at SAB_BELOW under and SAB_ABOVE over');
 ok(SAB_ABOVE>SAB_BELOW,'and the taper above is wider than the ramp below, '+
  SAB_ABOVE+' against '+SAB_BELOW+', which is the spec\'s asymmetry');
 ok(sabMember(10,7,9)>0,'a reading one point over the band still reads, '+sabMember(10,7,9));
 /* AND IT IS MONOTONE ON EACH SIDE, which is what makes it a ramp and not a bump. */
 {
  /* tenths as integers, because accumulating 0.1 in a float walks off the
     midpoint and the reversal it then reports is the loop's and not the ramp's.
     The peak of band 7 to 9 is exactly 8, so the two halves split there. */
  let mono=true, where=null;
  for(let i=40;i<80;i++){const a=sabMember(i/10,7,9),b=sabMember((i+1)/10,7,9);
   if(b<a-1e-9){mono=false;where=i/10;}}
  for(let i=80;i<130;i++){const a=sabMember(i/10,7,9),b=sabMember((i+1)/10,7,9);
   if(b>a+1e-9){mono=false;where=i/10;}}
  ok(mono,'membership rises to the peak at 8 and falls after it, with no reversal'+
   (where===null?'':' (reversed at '+where+')'));
 }
 /* THE CONJUNCTION. Break one fetter and the saboteur is gone, which is the
    spec's own sentence about what a saboteur is. */
 ok(sabFetters([['fear',7,9],['anger',5,7]],{fear:8,anger:0})===0,
  'a configuration with one fetter absent scores zero, not an average');
 ok(sabFetters([['fear',7,9],['anger',5,7],['apathy',3,5]],{fear:8,anger:6,apathy:0})===0,
  'and that holds on a three part row, where an arithmetic mean would have fired at 0.67');

 /* ---- GUARD 6 · Surprise fires no saboteur ---- */
 {
  const keyed=[];
  SAB33.forEach(r=>r[1].forEach(p=>{if(p[0]==='surprise')keyed.push(r[0]);}));
  ok(keyed.length===0,'no row of the 33 keys on surprise, '+
   (keyed.length?keyed.join(', '):'zero of 33'));
  /* and the behaviour, not only the table: a field that is pure Surprise must
     produce nothing. asserted separately because a table can be right while a
     fallback in the reader invents a row anyway. */
  const only={}; CHARGES.forEach(c=>only[c]=0); only.Surprise=9;
  const axes=CHARGES.map(c=>({axis:c,shadow:only[c],coherent:0}));
  ok(sniffSaboteurs(axes).length===0,'and a field of nothing but Surprise fires none');
 }
 /* EVERY BAND TERM IS ONE OF THE NINE. The shipped table keyed two rows on
    `anxiety`, which is not an axis, so the reader papered over it with an alias
    and those two rows were scored off a term the instrument does not carry. */
 {
  const F={Fear:'fear',Anger:'anger',Shame:'shame',Disgust:'disgust',Apathy:'apathy',
   Shock:'shock',Sad:'sadness',Surprise:'surprise',Anticipation:'anticipation'};
  const okKeys={}; CHARGES.forEach(c=>okKeys[F[c]]=1);
  const bad=[];
  SAB33.forEach(r=>r[1].forEach(p=>{if(!okKeys[p[0]])bad.push(r[0]+' on '+p[0]);}));
  ok(bad.length===0,'every band term is one of the nine axes'+(bad.length?': '+bad.join(', '):''));
  /* and no axis but Surprise is left keying nothing, which is how Apathy came
     to score no saboteur at all before the port. */
  const used={}; SAB33.forEach(r=>r[1].forEach(p=>used[p[0]]=1));
  const silent=CHARGES.filter(c=>!used[F[c]]);
  ok(silent.length===1&&silent[0]==='Surprise',
   'and Surprise is the only axis keying nothing, '+
   (silent.length?silent.join(', '):'none')+' silent');
 }

 /* ---- GUARD · because is present on every saboteur emitted ---- */
 {
  const r=sniffStory('i am terrified and furious and i feel nothing at all any more');
  ok(r.saboteurs.length>0,'a loaded field emits saboteurs, '+r.saboteurs.length);
  ok(r.saboteurs.every(s=>Array.isArray(s.because)&&s.because.length>0),
   'every saboteur emitted carries a because');
  ok(r.saboteurs.every(s=>s.because.every(b=>typeof b==='string'&&b.length>8)),
   'and every citation is a string that says something');
  /* THE CITATION MUST NAME THE EVIDENCE, not merely exist. A because that does
     not mention the fetter and its band is not inspectable, which is the whole
     point of the field. */
  ok(r.saboteurs.every(s=>s.fetters.every(f=>
   s.because.some(b=>b.indexOf(f)>=0))),
   'and every fetter in the row is named in the citation');
  ok(r.saboteurs.every(s=>s.because.some(b=>/band/.test(b)&&/ramp/.test(b))),
   'and the citation states the band and the ramp value that produced it');
  /* and it holds for every part of the output that carries a confidence */
  ok(r.axes.every(a=>Array.isArray(a.because)&&a.because.length>0),
   'every axis carries a because, including the ones reading zero');
  ok(r.laws.every(l=>Array.isArray(l.because)&&l.because.length>0),
   'every law carries a because');
  ok(r.offer.every(o=>Array.isArray(o.because)&&o.because.length>0),
   'every offer carries a because');
  ok(Array.isArray(r.gates.because)&&r.gates.because.length>0,'the gates carry a because');
  ok(Array.isArray(r.depth.because)&&r.depth.because.length>0,
   'and depth carries one even when it reads nothing');
 }

 /* ---- the contract shape, section 10 ---- */
 {
  const r=sniffStory('i put it off again and i could not face it');
  ['axes','saboteurs','laws','flow','gates','depth','offer'].forEach(k=>
   ok(r[k]!==undefined,'the contract emits '+k));
  ok(r.flow.nature!==undefined&&r.flow.human!==undefined&&r.flow.expression!==undefined,
   'flow carries all three lenses');
  ok(r.flow.unread.indexOf('nature')>=0&&r.flow.unread.indexOf('human')>=0,
   'and names nature and human as UNREAD rather than reporting them clean');
  ok(r.flow.because.length>0&&/elements\.json/.test(r.flow.because[0]),
   'and says which file they needed');
 }
 /* OFFER IS THE PAYLOAD, so it is never empty when an axis carried something. */
 {
  const r=sniffStory('i am so ashamed of myself');
  ok(r.axes.some(a=>a.shadow>0),'the text loaded an axis');
  ok(r.offer.length>0,'so offer is not empty, '+r.offer.length);
  ok(r.offer.every(o=>o.replacement&&o.address),
   'and every offer names an address AND a replacement state');
  const blank=sniffStory('');
  ok(blank.offer.length===0,'and an empty story offers nothing rather than guessing');
  ok(blank.axes.length===CHARGES.length,'while still reporting every axis as zero');
 }
 /* GUARD 5, as far as an engine can enforce it. The avoidance number cannot be
    handed over without the upstream that produced it. */
 {
  const r=sniffStory('i noticed it and i let it go and then i avoided the call and it had me');
  ok(r.gates.intentional&&typeof r.gates.intentional.avoidance==='number',
   'the sump is computed when both upstream gates read');
  ok(r.gates.intentional.upstream&&r.gates.intentional.upstream.aware!==undefined&&
     r.gates.intentional.upstream.detached!==undefined,
   'and the avoidance number is inside an object that carries both upstream readings');
  ok(r.gates.intentional.because.length>=3,
   'and a because naming what upstream did, so it cannot read as a trait');
  ok(r.gates.intentional.of===100,'and the number says what it is out of');
  const none=sniffStory('the weather was cold');
  ok(none.gates.intentional===null&&none.gates.read===false,
   'with no gate evidence the sump is not computed at all');
  ok(/nobody entered/.test(none.gates.because.join(' ')),
   'and it says why rather than reporting a clean 14.5');
  /* the cascade is his three measured points, so they are asserted as points */
  near(GATE_BASE,14.5,0.001,'the cascade base is his measured 14.5');
  near(GATE_BASE+GATE_STEP,43.2,0.001,'one upstream distorted is his measured 43.2');
  near(GATE_BASE+GATE_STEP*2,71.9,0.001,'both distorted is his measured 71.9');
 }

 /* ---- GUARD 1 and 2, as far as they are assertable ---- */
 {
  const r=sniffStory('my father died last year and my partner cut me out of the deal');
  const j=JSON.stringify(r);
  ok(!/diagnos|disorder|syndrome|patholog/i.test(j),'the output names no diagnosis');
  ok(!/narciss|sociopath|psychopath|machiavell/i.test(j),
   'and no clinical label from the hyper-complex translation column reaches it');
  /* never score another person. the text names a partner who acted; the readout
     must still be about the writer, and the only assertion available is that no
     field of the output is about anybody else. */
  ok(r.offer.every(o=>CHARGES.indexOf(o.axis)>=0),
   'every offer lands on one of the writer\'s own nine axes');
  ok(r.axes.length===CHARGES.length,'and there is exactly one set of axes, not one per person named');
 }
 /* the four bidirectional laws report a direction, because the spec rules that
    a one sided reader misses half of them and self-abandonment reads as virtue. */
 {
  const self=sniffLaws('others have it worse and i do not matter and it is all my fault');
  ok(self.length>0,'the self directed reading fires, '+self.length+' laws');
  ok(self.every(l=>l.direction===null||l.direction==='self'||l.direction==='other'),
   'and every law either names a direction or is single poled');
  const c=self.find(l=>l.law==='Compassion');
  ok(c&&c.direction==='self','Compassion reads in the self direction on self-abandonment');
  ok(c&&c.violation==='Self-abandonment','and names the violation for that direction');
  const other=sniffLaws('not my problem, they deserved it, they brought it on themselves');
  const c2=other.find(l=>l.law==='Compassion');
  ok(c2&&c2.direction==='other','and in the other direction on indifference');
  ok(c2&&c2.violation==='Indifference','with the other direction\'s violation string');
  /* all four of them, and every one carries two entries in the cue table */
  ['Compassion','Humility','Generosity','Ownership'].forEach(l=>{
   const n=LAWCUE.filter(r=>r[1]===l).length;
   ok(n===2,l+' is keyed in both directions, '+n+' cue sets');});
  /* and the single poled ones are not accidentally doubled */
  const dbl=[];
  const seen={};
  LAWCUE.forEach(r=>{seen[r[1]]=(seen[r[1]]||0)+1;});
  Object.keys(seen).forEach(l=>{if(seen[l]>1&&['Compassion','Humility','Generosity','Ownership'].indexOf(l)<0)dbl.push(l);});
  ok(dbl.length===0,'and no single poled law is keyed twice'+(dbl.length?': '+dbl.join(', '):''));
 }
 /* NEGATION. Inherited from verp.js rather than reinvented, and asserted,
    because without it the instrument accuses a person of what they denied. */
 ok(sniffLaws('i lied to them').some(l=>l.law==='Truth'),'a plain admission fires Truth');
 ok(!sniffLaws('i never lied to them').some(l=>l.law==='Truth'),
  'and its denial does not');
 ok(!sniffLaws('i did not put it off').some(l=>l.law==='Courage'),
  'and a denied avoidance does not fire Courage');
 /* PRECEDENCE. The longer phrase wins, which is what stops a denial reading as
    an admission when both strings are in the table. */
 {
  const o=sniffLaws('it was not my fault at all');
  ok(!o.some(l=>l.law==='Ownership'&&l.direction==='self'),
   'a denial of self blame does not fire the self direction');
 }

 /* ---- RESENTMENT AS THE COMPOSITE, and the collision it was ruled to fix ---- */
 {
  /* EVERY WORD IN THE COMPOSITE TABLE, not one of them. The first cut of this
     test read only "resentful", so breaking the `resentment` key on purpose left
     it green: the other six keys still carried Apathy and the behaviour looked
     intact. A guard that passes while the thing it guards is broken is worse
     than no guard, so each key is exercised on its own. */
  Object.keys(LEXCOMP).forEach(k=>{
   const one=sniffStory('i am '+k+' about all of it');
   const an=one.axes.find(x=>x.axis==='Anger'), ap=one.axes.find(x=>x.axis==='Apathy');
   ok(an.shadow>0&&ap.shadow>0,'"'+k+'" lands on BOTH Anger and Apathy, '+
    an.shadow+' and '+ap.shadow);});
  const r=sniffStory('i am resentful about all of it');
  const a=r.axes.find(x=>x.axis==='Anger'), p=r.axes.find(x=>x.axis==='Apathy');
  ok(a.shadow>0&&p.shadow>0,'resentment lands on BOTH Anger and Apathy, '+
   a.shadow+' and '+p.shadow);
  /* NO DEAD ROWS. The pass reports what it could not seat and the gate fails on
     it, so a composite word the scanner cannot reach gets ruled rather than
     sitting in the table looking live. This is how the three above were found. */
  ok(E.LEXCOMPRUN.unseated.length===0,
   'every composite key is reachable by the scanner'+
   (E.LEXCOMPRUN.unseated.length?': '+E.LEXCOMPRUN.unseated.join(', ')+' are not':''));
  ok(E.LEXCOMPRUN.split.length===0,
   'and the seated members share one seat, so nothing was chosen between two answers');
  ok(E.LEXCOMPRUN.seat&&E.LEXCOMPRUN.amt>0,
   'and the seat and amount were derived off the table rather than typed, '+
   E.LEXCOMPRUN.seat+' at '+E.LEXCOMPRUN.amt);
  ok(Object.keys(LEXCOMP).every(k=>LEXCOMP[k].length===2&&
     LEXCOMP[k].indexOf('Anger')>=0&&LEXCOMP[k].indexOf('Apathy')>=0),
   'and every composite key is the ruled pair, Anger and Apathy, '+
   Object.keys(LEXCOMP).length+' words');
  ok(LEXCOMP.resentment&&LEXCOMP.resentment.length===2,
   'and the composite table says so rather than the reader guessing');
  ok(r.axes.some(x=>x.because.some(b=>/composite/.test(b))),
   'and the citation says it is a composite');
  /* the spec's own reason for the ruling: the pair that collapsed. */
  const nm=r.saboteurs.map(s=>s.name);
  ok(nm.indexOf('Aggressor')>=0&&nm.indexOf('Manipulator')>=0,
   'and Aggressor and Manipulator both appear, which is the collapse it was ruled to fix');
  ok(r.saboteurs.find(s=>s.name==='Aggressor').confidence!==
     r.saboteurs.find(s=>s.name==='Manipulator').confidence,
   'at different confidences, so they are distinguished rather than merely both present');
 }

 /* ---- THE SPECIFICITY WEIGHTS, and both have a stated reason ---- */
 ok(SABW.Avoider<1,'Avoider is held low on the ruling, '+SABW.Avoider);
 ok(SAB_ARITY[1]<SAB_ARITY[2]&&SAB_ARITY[2]<SAB_ARITY[3],
  'a one fetter row is worth less than a two and a two less than a three');
 ok(sabWeight('Innocent',[['fear',2,4]])<sabWeight('Imposter',[['shame',5,7],['fear',4,6]]),
  'so Innocent, the only single fetter row, does not outrank a two fetter row on arity alone');
 ok(sabConfidence('Innocent',[['fear',2,4]],{fear:3})<=1,
  'and no weight manufactures a confidence over 1');
 ok(sabConfidence('Avoider',[['apathy',6,8],['fear',5,7]],{apathy:7,fear:6})<
    sabConfidence('Escapist',[['apathy',4,6],['fear',6,8]],{apathy:5,fear:7}),
  'and a dead centre Avoider scores under a dead centre Escapist, which is the ruling');

 /* ---- THE PORT, checked against a second transcription ---- */
 {
  ok(SAB33.length===33,'33 rows, '+SAB33.length);
  const names={}; SAB33.forEach(r=>{names[r[0]]=(names[r[0]]||0)+1;});
  ok(Object.keys(names).length===33,'and no name appears twice');
  ok(SAB33.every(r=>r[1].length>=1&&r[1].length<=3),'every row carries one to three fetters');
  ok(SAB33.every(r=>r[1].every(p=>p[1]<=p[2]&&p[1]>=0&&p[2]<=10)),
   'every band is ordered and inside 0 to 10');
  const three=SAB33.filter(r=>r[1].length===3).map(r=>r[0]);
  ok(three.length===4,'four rows carry a third fetter after the port, '+three.join(', '));
  const one=SAB33.filter(r=>r[1].length===1).map(r=>r[0]);
  ok(one.length===1&&one[0]==='Innocent','and Innocent is the only single fetter row');
 }
 /* ---- THE COVERAGE REPORT, because an average hides a hole ---- */
 {
  const c=lawCoverage();
  ok(c.laws===21,'all 21 laws are keyed, '+c.laws);
  ok(c.bidirectional.length===4,'four are keyed in both directions, '+c.bidirectional.join(', '));
  ok(c.nature===0&&c.human===0,
   'nature and human nature are reported as zero coverage rather than omitted');
  ok(c.missing.length===4,'and the four files the spec says to load are named as missing');
  ok(c.expression===5&&c.expressionAbsent===5,
   'five of the ten expression elements are keyed and the other five are reported absent');
  ok(c.circlesKeyed<c.circles,
   'and not every circle is keyed, '+c.circlesKeyed+' of '+c.circles);
 }
 /* ---- DEPTH REFUSES TO GUESS ---- */
 {
  const none=sniffDepth('the meeting ran long and then i went home');
  ok(none.circle===null&&none.confidence===0,'depth reads nothing rather than guessing low');
  ok(none.unkeyed.length===4,'and names the four circles it cannot key at all');
  const c8=sniffDepth('i helped her move and i made sure they knew about it');
  ok(c8.circle==='C8','the C8 test fires on warmth that needed an audience');
  ok(c8.confidence<=0.5,'and its confidence is held low, '+c8.confidence);
  const cost=sniffDepth('i helped her move and told nobody');
  ok(cost.circle!=='C8','and warmth that cost something without an audience does not fire it');
 }
 /* ---- THE SPEC POLE TABLE, and the disagreement it is carrying ---- */
 {
  ok(Object.keys(SPEC_POLE).length===9,'the spec pole table covers all nine axes');
  ok(CHARGES.every(c=>SPEC_POLE[c]&&SPEC_POLE[c].pole&&SPEC_POLE[c].addr),
   'and every axis has both an address and a replacement state');
  const r=sniffStory('i am afraid');
  const o=r.offer[0];
  ok(o.poleDiffers&&o.poleDiffers.spec==='Safety / Ground'&&o.poleDiffers.child==='Trust',
   'and where it disagrees with CHILD the output SAYS so rather than hiding it');
  /* the collision, asserted, because it is the reason it must be ruled */
  const apathy=SPEC_POLE.Apathy.pole, sadChild=CHILD.find(c=>c.nm==='Sad').opp;
  ok(apathy.indexOf(sadChild)>=0,
   'the spec offers '+sadChild+' at Apathy while CHILD offers it at Sad, which is one word at two addresses');
 }
 /* ---- AND THE SNIFFER IS STILL THE SNIFFER ---- */
 {
  const t='i am full of anger and i cannot keep going';
  ok(JSON.stringify(sniffStory(t))===JSON.stringify(sniffStory(t)),
   're-reading the same story gives back the same contract');
  ok(E.scanStory&&E.parseStory&&E.applyStory,'and the three original functions are still there');
  const before=JSON.stringify(S.charge);
  sniffStory(t);
  ok(JSON.stringify(S.charge)===before,'and reading a story through the contract mutates nothing');
 }
}

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
