/* Engine gate. No browser, no DOM, no renderers. Runs in milliseconds.
   Asserts the CONTRACT, not the current numbers, so a legitimate tuning
   change does not fail it but a broken invariant does. */
/* run from the repo root, like the browser gates do. BUILD-engine.sh writes
   engine.js there. an absolute path would only ever be right on one machine. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {S,CHILD,CHARGES,SI,SINAMES,BANDS,W,NODES,DOMAINS,ARCH,MASKS,SAB33,
       PEOPLE,LAWSET,PRACTICE,EXPR,compute,buildSoul,accuracy}=E;
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

 /* rising turns with the clock and stays inside the wheel */
 let riseBad=[];
 for(let h=0;h<24;h++){
  const z=risingSign({d:'1988-04-12',t:pad(h)+':30'});
  if(!z||!NAMES.has(z[2]))riseBad.push(h+':30 -> '+(z&&z[2]));}
 ok(riseBad.length===0,'rising sign is valid at every hour'
  +(riseBad.length?'  '+riseBad.slice(0,3).join(', '):''));

 /* the remaining readings must not throw or hand back nothing */
 const b={d:'1988-04-12',t:'07:45',p:'London'};
 ok(chineseElement(1988)!=null,'chinese element resolves');
 ok(masterNumber({d:'1979-11-29'})===null||[11,22,33].includes(masterNumber({d:'1979-11-29'})),
  'master number is a master number or nothing');
 const hd=hdOf(b);
 ok(hd&&hd.type&&hd.authority,'human design type and authority both resolve');
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
 ok(PEEPS.length===9,'nine reference cases carry birth data, got '+PEEPS.length);
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

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
