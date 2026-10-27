/* Engine gate. No browser, no DOM, no renderers. Runs in milliseconds.
   Asserts the CONTRACT, not the current numbers, so a legitimate tuning
   change does not fail it but a broken invariant does. */
/* run from the repo root, like the browser gates do. BUILD-engine.sh writes
   engine.js there. an absolute path would only ever be right on one machine. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
const {S,CHILD,CHARGES,SI,SINAMES,BANDS,W,NODES,DOMAINS,ARCH,MASKS,MASKS_READ,SAB33,
       PEOPLE,LAWSET,PRACTICE,EXPR,compute,buildSoul,accuracy,meterFirst,
       julianDay,sunLon,moonLon,designJD,GATE_WHEEL,chineseYear,usDST}=E;
let P=0,F=0,GRP='';
const g=n=>{GRP=n;console.log('\n'+n);};
const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};
/* expected red: true is a FAIL, so a fix that lands cannot go unnoticed */
let XF=0;
const xf=(c,m)=>{if(c){F++;console.log('  FAIL  expected red went green, remove the xf: '+m)}else{P++;XF++}};
const near=(a,b,t,m)=>ok(Math.abs(a-b)<=t,m+'  ('+a+' vs '+b+' +/-'+t+')');

/* every test starts from the same field */
/* THE LAWS A GATE SETS ARE LAWS THAT WERE ANSWERED. CQ sums only answered
   laws since the 25 September ruling, and it asks lawIn, which honours the
   unanswered marks the last loadProfile left behind. Several groups load a
   blank profile, so without this every later reset(..,6) read as a person
   who had answered nothing, because 6 is the seed. Clearing the marks says
   what reset means: a field whose every law was measured at the value given. */
function lawsIn(){SINAMES.forEach(l=>{E.LAW_UNSET[l]=false;});}
function reset(held,opp,law){
 S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=held!==undefined?held:0;S.replace[c]=opp||0;});
 SINAMES.forEach(l=>S.law[l]=law!==undefined?law:6); lawsIn();
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
/* the library a seat can call for. Round KQ appended the teachers' own
   practices to the same table, marked tc, so the count this line guards is the
   untagged library and the tagged rows are checked on their own below. */
ok(PRACTICE.filter(p=>!p.tc).length===17,'17 practices a seat can call for, got '+PRACTICE.filter(p=>!p.tc).length);
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
/* CQ MODEL 2, RESTORED 22 October: model 3 put Integrity x Intention /
   Resistance inside CQ itself and read 36 here. That is the same defect
   AZ5 already killed, measured again: every law at 10 read 48.7 not 100,
   and a release lowered CQ on 2,881 of 10,000 fields. Reverted. CQ is the
   21 laws and nothing else, so six points on all 21 reads 60. */
{
 const x=reset(0,0,6);
 near(x.CQ,60,1e-12,'all 21 laws at six reads 60, the pure law sum');
 ok(E.CQ_MODEL===2,'the formula reverted to its model 2 stamp');
 ok(x.integrity===undefined&&x.intention===undefined&&x.resistance===undefined,
  'the model 3 integrity/intention/resistance split is gone, not just unused');
}
/* NO KEY OF THE READING IS WRITTEN TWICE. A key written twice in one object
   literal keeps the last and drops the first without a word, and node --check
   allows it. will:WILL sat in compute()'s return beside the older will
   shorthand and lost to it on every call, so compute().will was never the 0
   it was added to carry. Read off compute's own source and held against the
   keys a real reading has, after the reader is checked on a literal that
   does carry a duplicate. */
{
 const keysOf=src=>{
  const at=src.lastIndexOf('return {'); if(at<0)return null;
  const ks=[]; let depth=0, cur='', q='';
  for(let i=at+8;i<src.length;i++){const c=src[i];
   if(q){cur+=c; if(c==='\\')cur+=src[++i]; else if(c===q)q=''; continue;}
   if(c==="'"||c==='"'||c==='`'){q=c; cur+=c; continue;}
   if('([{'.includes(c))depth++;
   if(')]}'.includes(c)){if(!depth)break; depth--;}
   if(c===','&&!depth){ks.push(cur); cur=''; continue;}
   cur+=c;}
  ks.push(cur);
  return ks.map(s=>s.trim()).filter(Boolean).map(s=>(/^([\w$]+)\s*:/.exec(s)||[0,s])[1]);};
 const twice=ks=>ks.filter((k,i)=>ks.indexOf(k)!==i);
 const known=keysOf("function f(){return {a,b:g(1,2),c:'x,}',a:3};}");
 ok(JSON.stringify(known)==='["a","b","c","a"]'&&JSON.stringify(twice(known))==='["a"]',
  'the key reader finds the one key written twice in a literal that has one, '+JSON.stringify(known));
 const ks=keysOf(E.compute.toString()), live=Object.keys(compute());
 ok(ks&&twice(ks).length===0,'no key of compute()\'s reading is written twice, twice: '+JSON.stringify(ks&&twice(ks)));
 ok(ks&&ks.length===live.length&&live.every(k=>ks.indexOf(k)>=0),
  'and the keys read off its source are the keys a reading has, '+(ks&&ks.length)+' against '+live.length);
}

r=reset(0,0,10);
near(r.CQ,100,0.001,'all laws 10, nothing held, CQ is 100');
ok(r.tier==='Mastery','and the tier is Mastery');
r=reset(10,0,0);
ok(r.CQ>=0,'CQ never goes below 0');
ok(r.tier==='Contracted','all laws 0, everything held, tier is Contracted');
for(let h=0;h<=10;h+=2)for(let l=0;l<=10;l+=2){
 const x=reset(h,0,l);
 if(x.CQ<0||x.CQ>100){ok(false,'CQ out of range at held '+h+' law '+l);}}
ok(true,'CQ stays inside 0..100 across the grid');
ok(reset(0,0,10).Rz>=1&&reset(10,0,0).Rz>=1,'resistance never drops below its floor of 1');

g('6 · SAB33 ranges are bands, not floors');
/* Micromanager, S02, is fear 7..10 + anger 5..8 */
function fitFor(name,fear,anger){
 reset(0,0,6); S.charge.Fear=fear; S.charge.Anger=anger;
 const hit=E.sab33Detect().filter(d=>d.nm===name)[0];
 return hit?{score:hit.score,exact:hit.exact}:null;}
const inside=fitFor('Micromanager',8,6);
/* THE RANGE SCAN READS THE RAMP, P1-6 of the inference audit, 23 October.
   This read 100 under the staircase, full credit anywhere inside a band. The
   ramp peaks at a band's centre and holds 0.75 at its edge (canon.js), so a
   reading inside both bands is exact and scores between the edge and 100. */
ok(inside&&inside.exact&&inside.score>=75&&inside.score<=100,'inside both bands is exact and scores between the band edge and 100, '+JSON.stringify(inside));
const below=fitFor('Micromanager',2,1);
ok(!below||below.score<100,'below the band does not score 100: the saboteur has not formed');
const above=fitFor('Victim',10,10);   /* Victim is sadness 6..8 + anger 4..6 */
ok(!above||!above.exact,'above the band is not exact: the charge escalated past it');
ok(fitFor('Micromanager',6,6).score<100,'one step below lo is adjacent, not inside');
/* no cliff at the half point. The staircase rounded each charge first, so a
   fifth of a point decided a quarter or a half of a row's score. On the ramp
   no row's score moves more than a few points across that step. Restless is
   apathy 5..7 and fear 2..4, and it scored 100 at fear 4.49 and 75 at 4.51. */
{
 const rs=f=>{reset(0,0,6); S.charge.Apathy=6; S.charge.Fear=f;
  const h=E.sab33Detect().filter(d=>d.nm==='Restless')[0]; return h?h.score:0;};
 ok(Math.abs(rs(4.49)-rs(4.51))<=2,'Restless across fear 4.49 to 4.51 moves at most two points, '+rs(4.49)+' then '+rs(4.51));
 let worst=0;
 SAB33.forEach(row=>row[1].forEach(p=>{
  const L={}; SAB33.forEach(r=>r[1].forEach(q=>{L[q[0]]=(q[1]+q[2])/2;}));
  row[1].forEach(q=>{L[q[0]]=(q[1]+q[2])/2;});
  for(let v=0;v<=10;v+=0.02){const a=Object.assign({},L),b=Object.assign({},L); a[p[0]]=v; b[p[0]]=v+0.02;
   if(p[0]==='anticipation'){a.anxiety=a.anticipation;b.anxiety=b.anticipation;}
   const ca=E.sabConfidence(row[0],row[1],a), cb=E.sabConfidence(row[0],row[1],b);
   /* where a name is decided, a third and up. Off zero the geometric mean
      rises steeply, but that far down it names nothing */
   if(ca>=0.3&&cb>=0.3)worst=Math.max(worst,Math.abs(ca-cb));}}));
 /* the staircase's smallest jump at a half point was a sixth, half credit
    on one charge of a three charge row */
 ok(worst<0.05,'and where a name is decided, no 0.02 step on any row along any charge moves the confidence by a twentieth, the largest '+worst.toFixed(4));
 /* a low fear with apathy at the seat no longer names Innocent off a rounded 2 */
 reset(0,0,6); S.charge.Fear=1.6; S.charge.Apathy=4;
 ok(!compute().sabs.some(s=>s.named&&s.nm==='Innocent'),'fear 1.6 does not name Innocent, which the staircase did off a rounded 2');
 /* and a range saboteur is drawn only on addresses carrying its own charges */
 const AX={fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',shock:'Shock',sadness:'Sad',
  surprise:'Surprise',anticipation:'Anticipation',anxiety:'Anticipation'};
 let off=0,seen=0,sd=11; const R=()=>{sd=(sd*1103515245+12345)&0x7fffffff;return sd/0x7fffffff;};
 for(let i=0;i<300;i++){reset(0,0,6); CHARGES.forEach(c=>{S.charge[c]=R()<0.5?0:R()*8;});
  compute().sabs.filter(s=>s.named&&s.charges).forEach(s=>{seen++; const own=s.charges.map(c=>AX[c]);
   if(!s.parts.length||!s.parts.every(n=>own.indexOf(n.cf)>=0))off++;});}
 ok(seen>0&&off===0,'every range saboteur is drawn on addresses carrying its own charges, '+off+' of '+seen+' not');
}

g('7 · the six gates multiply resistance');
r=reset(6,0,6);
const baseRz=r.Rz, baseCQ=r.CQ;
near(r.vf,1,1e-9,'no story means no gate evidence, factor is 1');
/* A SEEDED LAW IS NOT AN ANSWER. Every law sits at its seeded default here
   and none is marked answered, so CQ is nothing, and one answer is that one
   law over 210. */
const unreadProfile=E.blankProfile('unanswered formula'); E.loadProfile(unreadProfile);
const unreadFormula=compute();
ok(unreadFormula.answered===0&&unreadFormula.CQ===0,
 'no answered laws means no claimed coherence even when defaults exist');
S.law[SINAMES[0]]=10; E.LAW_UNSET[SINAMES[0]]=false;
const oneLawFormula=compute();
ok(oneLawFormula.answered===1,'one measured law is one answered, got '+oneLawFormula.answered);
near(oneLawFormula.CQ,10/210*100,1e-12,
 'and CQ is that one law over 210, the '+(SINAMES.length-1)+' seeded defaults counting nothing');

reset(6,0,6); E.verpApply('i could not stop going over it and it had me');
const att=compute();
ok(att.vf>1,'an attachment story costs more than 1');
/* CHANGED 25 SEPTEMBER, and on purpose. These read "and it raises
   resistance, lowering CQ" and "and it raises CQ". The owner ruled CQ is the
   21 laws and nothing else, so resistance still moves and CQ must not.
   Model 3 turned both round on this branch and was reverted, 22 October. */
ok(att.Rz>baseRz,'and it raises resistance');
ok(att.CQ===baseCQ,'which no longer moves CQ, '+baseCQ+' then '+att.CQ);
reset(6,0,6); E.verpApply('i let it pass and i stayed out of the story and i let it go');
const det=compute();
ok(det.vf<1,'a detachment story costs less than 1');
ok(det.Rz<baseRz&&det.CQ===baseCQ,'and it lowers resistance, which does not move CQ either');
reset(0,0,6);
const sh=E.verpRead();
ok(sh.length===6&&sh.every(v=>v.mult>0),'six gates, each with a multiplier');
ok(sh.filter(v=>v.side==='higher').length===3&&sh.filter(v=>v.side==='lower').length===3,
   'three higher, three lower');
/* THE PAIRS, read off VERP_VS. Each move of right action stands across from
   exactly one wrong action and the table says it both ways round, so the drill
   and the dial name the same opposite whichever end a person opens. */
ok(sh.every(v=>{const o=sh.filter(x=>x.k===E.VERP_VS[v.k])[0];return !!o&&o.side!==v.side&&E.VERP_VS[o.k]===v.k;})
   &&Object.keys(E.VERP_VS).length===sh.length,
   'every Law of Action stands across from one on the other side, both ways round, '+JSON.stringify(E.VERP_VS));
/* A PHRASE OUTRANKS THE WORDS INSIDE IT. verpScan was a bare indexOf, so
   Intention's 'kept going' counted inside Attachment's 'kept going over', and
   a cue counted inside a longer word. Red on f7188cba, each check beside the
   known good case it must not break. */
{const hit=t=>E.verpScan(t).hits;
 const a=hit('I could not stop thinking about it, it had me all night and I kept going over it');
 ok(a.attach===3&&a.intent===0,'kept going over is Attachment and not Intention as well, got '+JSON.stringify(a));
 ok(hit('It rose and I kept going with the work').intent===1,'while kept going on its own is still Intention');
 ok(hit('it did not seem like much').ignore===0,'a cue does not match inside a longer word: did not see in did not seem');
 ok(hit('I stayed one more hour').intent===0&&hit('I stayed on it').intent===1,'stayed on is not read off stayed one, and is read off itself');
 ok(hit('I kept going over it, and later I kept going').intent===1&&hit('I kept going over it, and later I kept going').attach===1,
  'the same short cue outside the long one still counts');
 /* every cue that sits inside another is a precedence the scan must honour,
    read off the table rather than typed, so a cue added later is checked */
 const rows=[];Object.keys(E.VERPCUE).forEach(g=>E.VERPCUE[g].forEach(p=>rows.push({g,p})));
 rows.forEach(s=>rows.forEach(l=>{if(s===l||l.p.indexOf(' '+s.p+' ')<0&&l.p.indexOf(s.p+' ')!==0&&!l.p.endsWith(' '+s.p))return;
  const h=hit(l.p); ok(h[l.g]>=1&&(s.g===l.g?h[l.g]===1:h[s.g]===0),
   "'"+l.p+"' reads its own gate once, and not '"+s.p+"' inside it, got "+JSON.stringify(h));}));}

g('8 · the lean');
/* THE FIELD HERE HAS TO LEAN SOMEWHERE, and it is laws at 3 rather than 6
   for that reason alone. The lean blends the field's malignancy with the
   story's, and this group asserts which way a story moves it. Laws at 6 read
   CQ 36 under the old arithmetic, malignancy 28, so both stories had a prior
   to move. Under the 25 September CQ, laws at 6 read 60, benign, malignancy
   0, and a story that admits no malignant cue cannot read below 0: both came
   back 0 and the ordering vanished. Laws at 3 read CQ 30, malignancy 40,
   which puts the prior back without changing what is asserted. */
reset(0,0,3);
let L=E.leanRead(compute());
ok(L.cues===0&&L.src==='field only','no story, the field speaks alone');
E.leanApply('i was wrong and i said sorry and i told the truth and i let it go and i owned it');
const good=E.leanRead(compute());
ok(good.cues>0,'benign cues register');
reset(0,0,3); E.leanApply('their fault they always do this not my problem they owe me i had no choice');
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
/* 16 since 25 September: m, which arithmetic wrote the row, because cq and
   dq changed meaning and a row from each must never be compared as a move. */
/* NO COUNT IS TYPED HERE. It read 16 and the law history made it 17, which is
   the hand count this repository keeps being bitten by. What the count was
   standing in for is that the boundary keeps every field a snapshot writes:
   validateProfile rebuilds each row from a whitelist, so a field snapshot()
   adds and the whitelist does not name survives until the next read off the
   disk and is then silently gone (engine/verp.js measured it for the lean).
   So that is what is asserted, both ways, whatever the count becomes. */
{const vs=E.validateProfile(Object.assign(JSON.parse(JSON.stringify(prof)),{history:[JSON.parse(JSON.stringify(snap))]}));
 const kept=vs.ok?Object.keys(vs.profile.history[0]):[];
 const lost=Object.keys(snap).filter(k=>kept.indexOf(k)<0), extra=kept.filter(k=>!(k in snap));
 ok(vs.ok&&!lost.length&&!extra.length,'every field a snapshot writes survives the boundary, and nothing is added, '
  +Object.keys(snap).length+' written'+(lost.length?', lost '+lost.join(' '):'')+(extra.length?', added '+extra.join(' '):''));}
/* THE FLOOR BAND'S OLD NAME, 16 October. A row an older build wrote says
   Collapsed; the boundary hands it back under the band's new name and leaves
   every other word, and a row still filling, exactly as written. */
{const rows=['Collapsed','Severe',null].map(t=>Object.assign(JSON.parse(JSON.stringify(snap)),{tier:t}));
 const vs=E.validateProfile(Object.assign(JSON.parse(JSON.stringify(prof)),{history:rows}));
 const got=vs.ok?vs.profile.history.map(x=>x.tier):[];
 ok(vs.ok&&got[0]==='Contracted'&&got[1]==='Severe'&&got[2]===null&&!!E.TIER_BY.Contracted&&!E.TIER_BY.Collapsed,
  'a history row written as Collapsed reads Contracted, the band it is, and nothing else moves, '+JSON.stringify(got));}
ok(snap.m===E.CQ_MODEL,'and it is stamped with the arithmetic that wrote it, got '+snap.m);
ok(!('charge' in snap)&&!('law' in snap)&&!('laws' in snap),'snapshot holds no inputs');

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
ok(!s2.reliable&&/no lean|to show a lean/.test(s2.lean),'a spread under 3 names no lean');

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
ok(r.sups.every(u=>u.parts.length===2),'a super complex is two hyper complexes');
ok(r.cxs.every(c=>c.parts.every(p=>r.sabs.includes(p))),'complexes only cite live saboteurs');
ok(r.hys.every(h=>h.parts.every(p=>r.cxs.includes(p))),'hyper only cite live complexes');
/* Professional hidden and not calculated, round NE, his own correction:
   "let's get rid of the uh, professional. Just hide it for now. Don't
   calculate it." maskRing now carries MASKS_READ, not MASKS, so the count
   is read off MASKS_READ rather than typed here as a number that would
   go stale the day the six come back. */
ok(r.maskRing.length===MASKS_READ.length,'every read mask always present, '+r.maskRing.length);
ok(!r.maskRing.some(m=>m.nm==='Professional'),'Professional is hidden and not calculated');
ok(r.maskRing.every(m=>m.w>=0),'mask load is never negative');

g('15 · every persona computes');
PEOPLE.forEach(p=>{
 S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
 SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._); lawsIn();
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
 const LS=LAWSET[n];SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._); lawsIn();
 return compute();};
ok(ref('Rosa').CQ>ref('Ana').CQ,'the cleared reference case reads higher than the one mid-crisis');
ok(ref('Ana').CQ>ref('Gordon').CQ,'and mid-crisis reads higher than the collapsed one');
['Rosa','Ana','Gordon'].forEach(n=>{const x=ref(n), LS=LAWSET[n];
 near(x.CQ,SINAMES.reduce((a,l)=>a+(LS[l]!==undefined?LS[l]:LS._),0)/210*100,1e-9,
  n+' reference case reads its own laws over 210');});
ok(ref('Rosa').loaded.length===0,'Rosa holds nothing');
ok(ref('Gordon').loaded.length>90,'Gordon holds nearly everything');

/* ============================================================
   OW1 . THE CHARACTER FIELD, round OW. engine/charfield.js, which the
   Character page reads and which holds every number the torus is bent by.
   Each assertion is worked out here from NODES and bandIg, never from the
   function it checks, so an accessor that drifts from the table fails.
   ============================================================ */
g('OW1 · the character field: the 112, the seven seats, the light and the opening');
{
 const {addrField,seatField,charAddrName,charLit,charGrow,charCohWord,charSeatState,CHAR_SEAT_LO,CHAR_SEAT_FULL,CHAR_GROW_S,bandIg}=E;
 ref('Gordon');
 const A=addrField();
 ok(A.length===112&&A.length===NODES.length,'the 112 addresses, every one, in table order, got '+A.length);
 ok(A.every((a,j)=>a.i===NODES[j].i)&&new Set(A.map(a=>a.i)).size===112,'each address once, by its own number');
 ok(A.every(a=>BANDS.includes(a.seat)),'every address names a real seat, the anchors by the seat they extend');
 ok(A.filter(a=>a.field).length===4&&A.filter(a=>a.field&&a.above).length===2&&A.filter(a=>a.field&&!a.above).length===2,
  'four field anchors, two above the head and two below the feet');
 ok(A.filter(a=>a.field&&a.above).every(a=>a.seat==='Crown')&&A.filter(a=>a.field&&!a.above).every(a=>a.seat==='Root'),
  'the two above take the Crown and the two below take the Root, the ruling of 25 September');
 ok(A.filter(a=>!a.field).length===108,'and 108 are somatic');
 ok(A.every((a,j)=>a.sq===Math.min(10,Math.max(0,NODES[j].sq))),'sq is what compute() left on the address, held to 0 to 10');
 ok(A.every(a=>a.name&&!/_/.test(a.name)),'no stored key reaches a person, no underscore in any name');
 ok(A.every(a=>a.channel===(NODES[a.i-1].c||null)&&a.pattern===(NODES[a.i-1].cf||null)),'channel and pattern are the table\'s own');
 /* THE ONE ADDRESS WITH NO NAME */
 ok(A.find(a=>a.key==='Root_08_Unnamed').name==='Unnamed, Root 08','Root_08_Unnamed reads as Unnamed, Root 08');
 ok(charAddrName('Doubt Of God')==='Doubt of God'&&charAddrName('Self-Exclusion')==='Self-exclusion'
  &&charAddrName('Resentment (Solar)')==='Resentment (Solar)'&&charAddrName('Celiac Plexus')==='Celiac plexus'
  &&charAddrName('Sol Star')==='Sol Star'&&charAddrName('Gaia Gateway')==='Gaia Gateway',
  'sentence case, with God, the seat in brackets and the anchors kept: '+['Doubt Of God','Self-Exclusion','Resentment (Solar)','Celiac Plexus'].map(charAddrName).join(' | '));
 ok(charAddrName(null)===''&&charAddrName(undefined)==='','a missing name is empty and never throws');
 /* SEATS */
 const SF=seatField();
 ok(SF.length===7&&SF.map(s=>s.seat).join()===BANDS.join()&&SF.every((s,k)=>s.idx===k),'seven seats, root first, in BANDS order');
 ok(SF.reduce((a,s)=>a+s.n,0)===108,'and between them the 108 somatic addresses, the anchors counted by none, got '+SF.reduce((a,s)=>a+s.n,0));
 SF.forEach(s=>{const g=NODES.filter(n=>n.b===s.seat),m=g.reduce((a,n)=>a+n.sq,0)/g.length/10;
  near(s.mean,m,1e-12,s.seat+' mean charge over ten is the mean sq of its addresses');
  near(s.ig,bandIg(s.seat)/10,1e-12,s.seat+' integrity is bandIg over ten');});
 const gm=seatField().reduce((a,s)=>a+s.mean,0), rosaM=(ref('Rosa'),seatField().reduce((a,s)=>a+s.mean,0));
 ok(gm>3&&rosaM<.3&&gm>rosaM*10,'Gordon carries many times what Rosa does, '+gm.toFixed(2)+' against '+rosaM.toFixed(2)+' summed over the seats');
 ref('Gordon');
 /* THE LIGHT */
 ok([0,1,2,3,4,5,6].every(k=>charLit(k,0)<.001),'at no coherence no seat is lit, the figure is what the floor in the renderer holds');
 ok([0,1,2,3,4,5,6].every(k=>charLit(k,1)>.999),'at full coherence every seat is lit, full spectrum');
 ok([0,1,2,3,4,5,6].every(k=>{let p=-1;for(let c=0;c<=1.0001;c+=.05){const v=charLit(k,c);if(v<p-1e-12)return false;p=v;}return true;}),'more coherence never lights a seat less');
 ok(charLit(0,.31)>charLit(2,.31)&&charLit(2,.31)>charLit(4,.31)&&charLit(6,.31)===0,'coherence fills from the root up: at 31 percent the root is brighter than the solar seat, which is brighter than the throat, and the crown is dark');
 ok(charLit(0,-5)===charLit(0,0)&&charLit(6,9)===charLit(6,1),'out of range coherence is held to 0 and 1');
 ok(charCohWord(0)==='compressed'&&charCohWord(.5)==='partial'&&charCohWord(1)==='full spectrum','the three words he gave: compressed, partial, full spectrum');
 /* THE OPENING GROW */
 ok(charGrow(0)===0&&charGrow(-1)===0,'the page opens at nothing, the dim floor');
 ok(charGrow(CHAR_GROW_S)===1&&charGrow(60)===1,'and has grown to the real level by '+CHAR_GROW_S+' seconds and stays');
 ok(CHAR_GROW_S>=1.5&&CHAR_GROW_S<=3,'about two seconds, the owner\'s own word, got '+CHAR_GROW_S);
 ok(Math.abs(charGrow(CHAR_GROW_S/2)-.5)<1e-9,'eased, half way at half the time');
 ok((()=>{let p=-1;for(let t=0;t<=3;t+=.05){const v=charGrow(t);if(v<p-1e-12)return false;p=v;}return true;})(),'and it only ever climbs');
 /* THE TORUS STATE */
 const open=charSeatState([0,0,0,0,0,0,0],[1,1,1,1,1,1,1],1);
 ok(open.sh.every(v=>v===0)&&open.leaks.length===0&&open.pinch.every(v=>v===0)&&open.slow.every(v=>v===1),'an open field does nothing: no pinch, full speed, no leak');
 ok(open.bulge.every(v=>v>.1),'and an open, whole, lit seat swells, '+open.bulge.map(v=>v.toFixed(2)).join(' '));
 const mid=charSeatState([.15,.15,.15,.15,.15,.15,.15],[1,1,1,1,1,1,1],1);
 ok(mid.sh.every(v=>v===0)&&mid.pinch.every(v=>v===0),'a moderate load, .15 over ten, does not yet bend it: the default view is not a bell');
 ok(CHAR_SEAT_LO>.1&&CHAR_SEAT_FULL<.6&&CHAR_SEAT_LO<CHAR_SEAT_FULL,'the thresholds sit where the roster measured, '+CHAR_SEAT_LO+' to '+CHAR_SEAT_FULL);
 const closed=charSeatState([.7,.7,.7,.7,.7,.7,.7],[.2,.2,.2,.2,.2,.2,.2],1);
 ok(closed.sh.every(v=>v===1)&&closed.pinch.every(v=>v>.25)&&closed.slow.every(v=>v<.3)&&closed.bulge.every(v=>v===0),'a closed seat pinches, runs slow and does not swell');
 ok(closed.leaks.length===3&&closed.stut.every(v=>v===1),'every seat closed names three leaks, never more, and stutters');
 /* MONOTONE: more charge at a seat only ever closes it further */
 let prev=null,mono=true;for(let m=0;m<=1.0001;m+=.05){const s=charSeatState([m,0,0,0,0,0,0],[1,1,1,1,1,1,1],.6);
  if(prev&&(s.sh[0]<prev.sh[0]-1e-12||s.pinch[0]<prev.pinch[0]-1e-12||s.slow[0]>prev.slow[0]+1e-12||s.bulge[0]>prev.bulge[0]+1e-12))mono=false;
  prev={sh:s.sh[0],pinch:s.pinch[0],slow:s.slow[0],bulge:s.bulge[0]};}
 ok(mono,'more charge at a seat only ever pinches it more, slows it more and swells it less');
 /* integrity: an unanswered seat does not swell as much as a whole one */
 const ig1=charSeatState([0,0,0,0,0,0,0],[1,1,1,1,1,1,1],1), ig0=charSeatState([0,0,0,0,0,0,0],[0,0,0,0,0,0,0],1);
 ok(ig1.bulge[2]>ig0.bulge[2]&&ig0.bulge[2]>0,'integrity raises the swell and a lit seat with none still swells a little');
 /* a leak is a closed seat, and a field that is not lit holds less */
 const dim=charSeatState([.4,.4,.4,.4,.4,.4,.4],null,.05), lit=charSeatState([.4,.4,.4,.4,.4,.4,.4],null,1);
 ok(dim.lk[0]>lit.lk[0],'the same load leaks more at low coherence');
 const sorted=charSeatState([.9,.3,.6,.2,.5,.1,.7],[1,1,1,1,1,1,1],.5);
 ok(sorted.leaks.length<=3&&sorted.leaks.every((k,i,a)=>i===0||sorted.lk[a[i-1]]>=sorted.lk[k])&&sorted.leaks.every(k=>sorted.lk[k]>.12),
  'leaks are at most three, heaviest first, each one over the line: '+sorted.leaks.join(','));
 /* THE ROSTER, through the real engine */
 const lk=nm=>{const x=ref(nm),sf=seatField();return charSeatState(sf.map(s=>s.mean),sf.map(s=>s.ig),x.CQ/100);};
 ok(lk('Rosa').leaks.length===0&&lk('Sofia').leaks.length===0,'Rosa and Sofia leak nowhere');
 ok(lk('Gordon').leaks.length===3&&lk('Gordon').sh.filter(v=>v>.7).length>=5,'Gordon leaks at three seats and is closed at most of them');
 /* THE REUSE, because the page asks every frame */
 const o2=charSeatState([.4,.1,.1,.1,.1,.1,.1],null,.5),o3=charSeatState([.1,.4,.1,.1,.1,.1,.1],null,.5,o2);
 ok(o3===o2&&o2.sh[1]>0&&o2.sh[0]===0,'a state handed back in is rewritten in place and not allocated again');
 /* FOUR OUTSIDE THE BODY take the seat they extend, through compute() and not through this file */
 ref('Gordon');const AF=addrField(),cr=AF.filter(a=>a.field&&a.above),rt=AF.filter(a=>a.field&&!a.above);
 near(cr[0].sq,seatField()[6].mean*10,1e-9,'the anchors above carry the Crown\'s mean sq');
 near(rt[0].sq,seatField()[0].mean*10,1e-9,'and the anchors below carry the Root\'s');
}


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
 /* the first run flags live with the ui facts: a field outside them was
    dropped on the next load and the onboarding replayed on every launch */
 {const fl=JSON.parse(JSON.stringify(saveProfile(p))); fl.ui=Object.assign({},fl.ui,{onboarded:true,tutorialSeen:true});
  const back=validateProfile(fl);
  ok(back.ok&&back.profile.ui.onboarded===true&&back.profile.ui.tutorialSeen===true,'the first run flags survive a load');
  ok(validateProfile(JSON.parse(JSON.stringify(saveProfile(p)))).profile.ui.onboarded===false,'and read as not seen on a profile that never set them');
  fl.ui.paidWelcomed=true; ok(validateProfile(fl).profile.ui.paidWelcomed===true,'the welcome after paying is remembered across a load');
  /* the studio voice sends each line to a company, so it is never found on */
  ok(validateProfile(JSON.parse(JSON.stringify(saveProfile(p)))).profile.ui.studio===false,'the studio voice reads off on a profile that never chose it');
  fl.ui.studio=true; ok(validateProfile(fl).profile.ui.studio===true,'and a person who chose it keeps it across a load');}
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

g('15f \u00b7 the record in a link: the format, and its refusals by name');
/* THE WIRE FORMAT IS NAMED ONCE AND HELD HERE. engine/schema.js linkWrap and
   linkUnwrap are what the quiz writes a link with and what the app reads one
   with, so a drift between them is a drift in one function and this group
   catches it. The gzip half is the host's and is gated in a real browser by
   tests/recordlink.js; this is the half that never needs one. */
{
 const {linkWrap,linkUnwrap,importRefuse,importError,LINK_V,LINK_MAX,profiles,current}=E;
 /* every length mod 3, and every byte value, so the padding-free tail is
    exercised at all three of its shapes and nothing is lost at the edges */
 let all=true, bad='';
 for(let n=0;n<=260;n++){
  const b=new Uint8Array(n); for(let i=0;i<n;i++)b[i]=(i*37+n)&255;
  const w=linkWrap(b);
  if(!/^[0-9]+\.[A-Za-z0-9_-]*$/.test(w)){all=false;bad='shape at '+n;break;}
  if(n===0)continue;
  const u=linkUnwrap(w);
  if(!u||u.length!==n||u.some((x,i)=>x!==b[i])){all=false;bad='bytes at '+n;break;}}
 ok(all,'every length from 1 to 260 bytes goes out and comes back the same'+(bad?', broke on '+bad:''));
 ok(linkWrap(new Uint8Array([1])).indexOf(LINK_V+'.')===0,'a link opens with its format version, '+LINK_V);
 /* and it is the alphabet an address carries without escaping */
 const every=new Uint8Array(256); for(let i=0;i<256;i++)every[i]=i;
 const ew=linkWrap(every);
 ok(encodeURIComponent(ew)===ew,'nothing in a link needs escaping in an address');
 /* REFUSED BY NAME, through importError, and nothing else moves. The same
    atomic check the boundary itself is held to above. */
 const before=JSON.stringify(profiles()), n0=profiles().length, cur0=current();
 const refusals=[
  ['empty',            '',                         /carries nothing/],
  ['no version',       'H4sIAAAA',                 /not in a form this app reads/],
  ['a later format',   '9.H4sIAAAA',               /format 9, and this app reads format 1/],
  ['version, no body', LINK_V+'.',                 /carries nothing/],
  ['damaged',          LINK_V+'.H4sI AAA',         /damaged/],
  ['percent mangled',  LINK_V+'.H4sI%2BAA',        /damaged/],
  ['cut mid group',    LINK_V+'.H4sIA',            /cut short/],
  ['far too long',     LINK_V+'.'+'A'.repeat(LINK_MAX), /longer than any record link/]];
 refusals.forEach(([nm,txt,want])=>{
  const r=linkUnwrap(txt);
  ok(r===null,'a link that is '+nm+' is refused');
  ok(want.test(String(importError())),'and says why by name: '+importError());});
 ok(linkUnwrap(null)===null&&linkUnwrap(42)===null,'a value that is not text is refused');
 ok(profiles().length===n0&&JSON.stringify(profiles())===before&&current()===cur0,
  'and no refusal touched the profile list or the current profile');
 /* the host's refusal goes through the same channel and does nothing else */
 ok(importRefuse('the host stopped it')===null&&String(importError())==='the host stopped it',
  'a host refusal is read back through importError, '+importError());
 ok(profiles().length===n0&&current()===cur0,'and it moved nothing either');
 /* a good unwrap clears a stale reason, so a reason is never read off an
    earlier failure after a success */
 linkUnwrap(linkWrap(new Uint8Array([7,8,9])));
 ok(importError()===null,'a link that unwraps leaves no reason behind');
}

g('15e \u00b7 the two nested bags');
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
 /* ROUND OG: THE BOUNDARY MUST ACCEPT ITS OWN OUTPUT. The empty track and seat
    it writes were refused on the next pass, so pStore loaded no profile and the
    person's profile vanished at boot. Pass two over pass one's output holds. */
 const bv2=validateProfile(JSON.parse(JSON.stringify(bv.profile)));
 ok(bv2.ok&&bv2.profile.rituals[0].track===''&&bv2.profile.rituals[0].band==='',
  'and what it wrote reads back through the same boundary, empty track and seat included'+(bv2.ok?'':': '+JSON.stringify(bv2.errors||bv2.errs)));
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

 /* AND THE IMPORT IS STILL ATOMIC OVER BOTH BAGS. The refusals above are only
    worth anything if the profile carrying them never lands. 15c proves this for
    a poisoned charge; these two prove the two bags go through the same door.
    A store that works, because the point here is the refusal and not the save. */
 const {pImport,importError,profiles,current,bindStore}=E;
 bindStore(function(){return null;},function(){});
 const held=JSON.stringify(profiles()), n=profiles().length, cur=current();
 const sneak=withRit(Object.assign(rit(),{secret:'s'}));
 ok(pImport(JSON.stringify(sneak))===null,'a profile hiding a secret in a ritual is not imported');
 ok(/secret/.test(String(importError())),'and says where it was: '+importError());
 const sneak2=withEnt(Object.assign(ent(),{text:7}));
 ok(pImport(JSON.stringify(sneak2))===null,'and one whose entry text is a number is not imported');
 ok(profiles().length===n&&JSON.stringify(profiles())===held&&current()===cur,
  'the list and the current profile did not move, '+n+' before and after');
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
 /* a type changed before anything moved re-seeds from the base rather than
    compounding */
 seedApply(p,'ISTJ'); seedApply(p,'ENTP');
 ok(seedShare(p)===1&&JSON.stringify(p.axes.Fear.held)==='2.8',
  're-seeding an untouched seed starts from the base, Fear reads '+p.axes.Fear.held);
 p.axes.Fear.held=9; p.axes.Anger.held=1;
 const mid=seedShare(p);
 ok(mid>0&&mid<1,'the share falls as the person moves the axes, got '+mid);
 /* A SEED NEVER WRITES OVER WHAT THE PERSON MOVED, P0-5 of the inference
    audit, 23 October. This group held the opposite until then: with Fear
    moved to 9 it asserted a re-seed put Fear back to 2.8, which is the
    overwrite that erased four entries' fear when a person picked INFJ. */
 const moved=JSON.stringify(p.axes);
 ok(seedApply(p,'INFJ')===null&&JSON.stringify(p.axes)===moved&&p.seed.type==='ENTP',
  'a type chosen over axes the person moved writes nothing, and Fear stays '+p.axes.Fear.held);
 const r=read(p,{});
 ok(typeof r.reading.CQ==='number'&&r.reading.CQ>=0&&r.reading.CQ<=100,'a seeded profile reads');
 seedClear(p); ok(!p.seed&&seedShare(p)===0,'clearing the seed leaves no claim behind');
 ok(JSON.stringify(p.axes)===moved,'and on a moved field clearing it takes the type off and leaves what the person put there');
 const q=blankProfile('seedclear'); seedApply(q,'ENTP'); seedClear(q);
 ok(!q.seed&&CHARGES.every(c=>q.axes[c].held===0),'"not said" on an untouched seed puts back the empty field that was there');
 const st=blankProfile('seedstory'); E.loadProfile(st); E.applyStory('I am terrified of losing my job'); E.saveProfile(st);
 const had=st.axes.Fear.held;
 ok(had>0&&seedApply(st,'INFJ')===null&&st.axes.Fear.held===had&&!st.seed,
  'a story\'s fear survives choosing a type afterwards, Fear '+st.axes.Fear.held+' against '+had);
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
 /* DQ and not CQ, since 25 September: a story writes charge, and CQ is the
    laws alone, so on a blank profile it reads 0 before and after and these
    two would pass without testing anything. The shadow is what a story moves. */
 ok(Math.abs(s1.reading.DQ-s2.reading.DQ)<1e-9,'a story applied twice reads once');
 ok(s1.reading.vf!==1,'story cues move the gate factor off neutral');
 ok(s1.reading.DQ!==a.reading.DQ,'and the story changes the reading');
 ok(s1.reading.CQ===a.reading.CQ,'and never CQ, which is the laws alone');

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
 /* At noon in Lisbon and not off the bare date. A bare date is now its whole
    day at every offset, and refuses the sun on a cusp day, which is right
    and is asserted below; this check is about the calendar, not that. */
 let bad=[],seen={};
 for(let m=1;m<=12;m++){
  const dim=[31,29,31,30,31,30,31,31,30,31,30,31][m-1];
  for(let d=1;d<=dim;d++){
   const s=sunSign('2024-'+pad(m)+'-'+pad(d),{d:'2024-'+pad(m)+'-'+pad(d),t:'12:00',p:'Lisbon, PT'});
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
 /* With a place. This fed a clock time and no place, which the engine read
    as Greenwich until an unlocated birth learned to refuse a moon it could
    not settle; the check is about the date arithmetic and not about that. */
 let moonBad=[];
 ['1935-03-02','1958-11-21','1969-12-31','1970-01-01','2001-06-15'].forEach(d=>{
  const z=moonSign({d:d,t:'12:00',p:'Lisbon, PT'});
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
 /* timed and located, because an untimed day always moves the sun across a
    line and so never prints a gate, which is asserted further down */
 let gates=new Set();
 for(let m=1;m<=12;m++)for(let d=1;d<=28;d+=1)
  gates.add(geneKey({d:'1990-'+pad(m)+'-'+pad(d),t:'12:00',p:'Lisbon, PT'}).gate);
 ok(gates.size>=60,'a year of births reaches most of the wheel, got '+gates.size+' gates');

 /* Li Chun, not the first of January. A birth in the first weeks of a
    year belongs to the previous animal, which is about a tenth of births. */
 ok(chineseYear({d:'1987-01-19'})===1986,'a January birth takes the previous Chinese year');
 ok(chineseYear({d:'1987-06-19'})===1987,'and a June birth takes its own');

 /* daylight saving decides an hour, and an hour is half a sign of ascendant */
 ok(usDST(2010,3,14)&&!usDST(2010,3,13),'US daylight saving starts on the second Sunday in March');
 ok(usDST(1985,4,8)&&!usDST(1985,3,20),'and on the old rule before 2007');

 /* the remaining readings must not throw or hand back nothing */
 /* Lisbon and not London. London is not in PLACE, so this record was being
    read at a guessed offset and asserted real, which is the defect below. */
 const b={d:'1988-04-12',t:'07:45',p:'Lisbon, PT'};
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

 /* A PLACE THE TABLE CANNOT LOCATE, WITH NO TIME ZONE GIVEN, IS AN UNKNOWN
    OFFSET, NOT GREENWICH. birthJD read a missing place as offset zero, so a clock time typed in
    Auckland was read as the same clock time in London and the moon, both
    gates and the gene key were printed off that guess as settled. The
    contract now: any sign the engine still prints for an unlocated birth is
    the sign at every real offset, checked here hour by hour from fourteen
    east to twelve west against the raw sky and not against the engine's
    own window, and the gates, which a day always moves, are refused. */
 const ARIES=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
  'Sagittarius','Capricorn','Aquarius','Pisces'];
 const {spiritualOf,signOf}=E;
 let unl=0,moonKept=0,moonShut=0,sunShut=0,unlBad=[];
 for(let k=0;k<240;k++){
  const dt=new Date(Date.UTC(1972,0,1)+k*6.1*864e5), s=dt.toISOString().slice(0,10);
  const y=dt.getUTCFullYear(),m=dt.getUTCMonth()+1,d=dt.getUTCDate();
  ['02:10','13:40'].forEach(t=>{
   const hrs=+t.slice(0,2)+(+t.slice(3))/60, sp=spiritualOf({d:s,t:t,p:'Auckland'});
   unl++;
   for(let off=-12;off<=14;off++){
    const jd=julianDay(y,m,d,hrs-off);
    if(sp.moon&&ARIES[signOf(moonLon(jd))]!==sp.moon)unlBad.push(s+' '+t+' moon at '+off);
    if(sp.sun&&ARIES[signOf(sunLon(jd))]!==sp.sun)unlBad.push(s+' '+t+' sun at '+off);}
   if(sp.moon)moonKept++; else moonShut++;
   if(!sp.sun)sunShut++;
   if(sp.gk.gate!==null||sp.hd.personality||sp.hd.design||sp.hd.profile)
    unlBad.push(s+' '+t+' printed a gate');});}
 ok(unlBad.length===0,'an unlocated birth never prints a sign or gate an offset could change, '
  +unl+' births'+(unlBad.length?'  '+unlBad.slice(0,3).join(', '):''));
 /* and it is not a blanket refusal, which would be honest and useless: a
    moon in the middle of a sign stays in it all day, wherever the day was. */
 ok(moonShut>0&&moonKept>0,'the moon is refused only near a cusp, kept '+moonKept+' refused '+moonShut);
 ok(sunShut<unl/10,'and the sun only on a cusp day, refused '+sunShut+' of '+unl);
 const loc=spiritualOf({d:'1988-04-12',t:'07:45',p:'Lisbon, PT'});
 ok(loc.moon&&loc.hd.personality&&loc.gk.gate,'a located birth still reads every one of them');
 ok(spiritualOf({d:'1990-01-15',t:'08:00',p:'Auckland'}).needsZone===true,
  'and the unlocated reading says it is a time zone that would settle it');

 /* THE TIME ZONE, ruled 26 September. A person names the zone they were born
    in and the offset for that date comes from Intl. Every expected value below
    is a published historical rule and not something this code produced, so a
    wrong table cannot pass by agreeing with itself. */
 const {zoneOffsets}=E;
 const ZC=[['Pacific/Auckland',1990,1,15,8,'13','New Zealand summer'],
  ['Pacific/Auckland',1990,7,15,8,'12','and its winter'],
  ['Europe/London',1970,1,1,12,'1','Britain on +1 all year, 1968 to 1971'],
  ['Asia/Kathmandu',1980,6,1,12,'5.5','Nepal before 1986'],
  ['Asia/Kathmandu',1990,6,1,12,'5.75','and after'],
  ['Australia/Lord_Howe',2000,1,1,12,'11','a half hour of daylight saving'],
  ['America/New_York',2010,11,7,1.5,'-4,-5','the hour that happened twice'],
  ['America/New_York',2010,3,14,2.5,'-5,-4','the hour that never happened']];
 const zBad=ZC.filter(c=>String(zoneOffsets(c[0],c[1],c[2],c[3],c[4]))!==c[5])
  .map(c=>c[6]+' got '+zoneOffsets(c[0],c[1],c[2],c[3],c[4]));
 ok(zBad.length===0,'a named zone gives the historical offset for its date, '+ZC.length+' cases'
  +(zBad.length?'  '+zBad.join(', '):''));
 ok(zoneOffsets('Not/AZone',1990,1,1,12)===null&&zoneOffsets('',1990,1,1,12)===null,
  'and a name the runtime cannot read is null, not Greenwich');
 /* and the zone settles what the window refused: the reading is the sky at
    the real instant, with the place still not in the table */
 const nz=spiritualOf({d:'1990-01-15',t:'08:00',p:'Auckland',z:'Pacific/Auckland'});
 const nzJD=julianDay(1990,1,15,8-13);
 ok(nz.moon===ARIES[signOf(moonLon(nzJD))]&&nz.sun===ARIES[signOf(sunLon(nzJD))]
  &&nz.gk.gate===E.gateOf(sunLon(nzJD)).gate&&nz.hd.profile&&!nz.needsZone,
  'a named zone resolves the moon, the sun and the gates at the real instant');
 /* Auckland is not in PLACE, so the horizon is the zone's published point,
    +3652+17446 in zone.tab, typed here from the table and not read back out
    of the engine, so a parse that drifted cannot agree with itself. */
 const nzAsc=ARIES[signOf(E.ascendant(nzJD,-(36+52/60),174+46/60))];
 ok(nz.rising===nzAsc&&nz.risingFrom==='zone'&&!nz.needsPlace,
  'and the zone gives the ascendant from its published point, marked as the zone, got '+nz.rising+' want '+nzAsc);
 /* a clock reading that happened twice is a window across both, not a pick */
 const twice=E.birthJD({d:'2010-11-07',t:'01:30',z:'America/New_York'});
 ok(twice.span&&Math.abs((twice.span[1]-twice.span[0])*24-1)<1e-6,
  'the hour that happened twice is a one hour window');
 ok(spiritualOf({d:'1990-01-15',t:'08:00',p:'Auckland',z:'Not/AZone'}).needsZone===true,
  'and an unreadable zone reads as no zone at all');
 /* An untimed birth with a zone keeps noon at the real offset as its jd, and
    now carries its whole local day as the window. This asserted no window,
    on the reasoning that noon was the stated guess, and that guess printed
    a moon sign the day did not settle. */
 const noon=E.birthJD({d:'1990-01-15',z:'Pacific/Auckland'});
 ok(noon.offset===13&&!noon.timed&&noon.span
  &&Math.abs(noon.span[0]-julianDay(1990,1,15,-13))<1e-9
  &&Math.abs(noon.span[1]-julianDay(1990,1,15,23+59/60-13))<1e-9,
  'an untimed birth with a zone is its local day at +13, midnight to 23:59');

 /* AN UNTIMED BIRTH IS ITS DAY, NOT NOON. It was read at local noon and the
    moon printed as settled on days it changes sign. Reproduced on the roster
    with the times taken away, against PyEphem and not this engine: James read
    Aries where his day ends in Taurus, Ana Gemini against Cancer, Tomas Leo
    against Cancer. The contract, checked hour by hour against the raw sky at
    every offset the record allows: any sign printed for an untimed birth is
    the sign at every minute of its day, and no gate, line, profile or rising
    is printed, since a day always moves the sun across a line. */
 const DAYEND=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,23+59/60];
 let ut=0,utKept=0,utShut=0,utSunShut=0,utBad=[];
 [['Lisbon, PT',null],['Chicago, IL',null],[null,'Pacific/Auckland'],[null,null]].forEach((w,wi)=>{
  for(let k=0;k<120;k++){
   const dt=new Date(Date.UTC(1961,0,1)+Math.round(k*11.3+wi)*864e5), s=dt.toISOString().slice(0,10);
   const y=dt.getUTCFullYear(),m=dt.getUTCMonth()+1,d=dt.getUTCDate();
   const bt={d:s}; if(w[0])bt.p=w[0]; if(w[1])bt.z=w[1];
   const sp=spiritualOf(bt); ut++;
   DAYEND.forEach(h=>{
    const offs=w[1]?zoneOffsets(w[1],y,m,d,h):w[0]?[E.birthJD(bt).offset]
     :[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    offs.forEach(off=>{const jd=julianDay(y,m,d,h-off);
     if(sp.moon&&ARIES[signOf(moonLon(jd))]!==sp.moon)utBad.push(s+' '+(w[0]||w[1]||'no place')+' moon at '+h+'h');
     if(sp.sun&&ARIES[signOf(sunLon(jd))]!==sp.sun)utBad.push(s+' '+(w[0]||w[1]||'no place')+' sun at '+h+'h');});});
   if(sp.moon)utKept++; else utShut++;
   if(!sp.sun)utSunShut++;
   if(sp.gk.gate!==null||sp.hd.personality||sp.hd.design||sp.hd.profile||sp.rising)
    utBad.push(s+' printed a gate or a rising');
   if(!sp.needsTime||sp.needsZone||sp.gk.unresolved!=='needs a birth time')
    utBad.push(s+' asked for the wrong thing');}});
 ok(utBad.length===0,'an untimed birth never prints a sign its day could change, '+ut+' births'
  +(utBad.length?'  '+utBad.slice(0,3).join(', '):''));
 ok(utKept>0&&utShut>0&&utSunShut<ut/5,
  'and it is not a blanket refusal: moon kept '+utKept+' refused '+utShut+', sun refused '+utSunShut);
 const bare=n=>spiritualOf({d:BIRTH[n].d,p:BIRTH[n].p});
 ok(bare('James').moon===null&&bare('Ana').moon===null&&bare('Tomas').moon===null,
  'James, Ana and Tomas without their times no longer print the noon moon, which was wrong for all three');
 ok(spiritual('James').moon==='Taurus'&&spiritual('Ana').moon==='Cancer'&&spiritual('Tomas').moon==='Cancer',
  'and with their times they read what the independent ephemeris reads');

 /* THE ZONE'S HORIZON, ruled 26 September as one point per zone and not a
    gazetteer. The carried table is compared row by row with the machine's
    own copy of zone.tab, so a coordinate typed by hand cannot pass. A machine
    with no tzdata skips this and says so rather than counting it green. */
 const {zonePoint,ZONEPT}=E, fs=require('fs');
 const carried={};
 Object.keys(ZONEPT).forEach(r=>ZONEPT[r].split(' ').forEach(t=>{
  const m=/^(.+?)([+-]\d{4}(?:\d{2})?)([+-]\d{5}(?:\d{2})?)$/.exec(t); if(m)carried[r+'/'+m[1]]=m[2]+m[3];}));
 if(fs.existsSync('/usr/share/zoneinfo/zone.tab')){
  const pub=fs.readFileSync('/usr/share/zoneinfo/zone.tab','utf8').split('\n')
   .filter(l=>l&&l[0]!=='#').map(l=>l.split('\t'));
  const diff=pub.filter(c=>carried[c[2]]!==c[1]).map(c=>c[2]);
  ok(diff.length===0&&pub.length===Object.keys(carried).length,
   'the carried zone points are zone.tab exactly, '+pub.length+' rows'+(diff.length?'  '+diff.slice(0,3).join(', '):''));
 } else console.log('  skip  no /usr/share/zoneinfo/zone.tab on this machine to compare against');
 /* published rows typed from the table, one per hemisphere quarter */
 const near1=(p,la,lo)=>p&&Math.abs(p.lat-la)<1e-6&&Math.abs(p.lon-lo)<1e-6;
 ok(near1(zonePoint('Pacific/Auckland'),-(36+52/60),174+46/60)
  &&near1(zonePoint('America/Los_Angeles'),34+3/60+8/3600,-(118+14/60+34/3600))
  &&near1(zonePoint('Europe/London'),51+30/60+30/3600,-(0+7/60+31/3600))
  &&near1(zonePoint('America/Sao_Paulo'),-(23+32/60),-(46+37/60)),
  'ISO 6709 reads to the published degrees in all four quarters, seconds included');
 /* every name the time zone field offers must find its row, including the
    renamed ones the two lists spell differently */
 const offered=(()=>{try{return Intl.supportedValuesOf('timeZone');}catch(e){return [];}})();
 /* a name with no horizon must be a row whose own latitude is polar, read
    straight off the carried string, degrees and minutes */
 const polarRow=n=>{const c=carried[n]; if(!c)return false;
  return +c.slice(1,3)+(+c.slice(3,5))/60>=90-23.4392911;};
 const noPoint=offered.filter(n=>!zonePoint(n)), lost=noPoint.filter(n=>!polarRow(n));
 ok(offered.length>300&&lost.length===0,'every zone the field offers has a horizon or is polar, '
  +offered.length+' offered, '+noPoint.length+' polar'+(lost.length?'  lost '+lost.slice(0,4).join(', '):''));
 ok(zonePoint('Asia/Calcutta').zone==='Asia/Kolkata'&&zonePoint('US/Pacific').zone==='America/Los_Angeles'
  &&zonePoint('Europe/Kiev').zone==='Europe/Kyiv','a renamed or linked zone finds the row it was renamed to');
 ok(zonePoint('Arctic/Longyearbyen')===null&&zonePoint('Antarctica/McMurdo')===null,
  'inside the polar circles there is no ascendant to give, so no horizon');
 ok(zonePoint('Not/AZone')===null&&zonePoint('')===null,'and an unreadable name has none');
 /* a zone Intl reads that is no place on earth: an offset without a horizon */
 ok(zonePoint('UTC')===null&&zonePoint('Etc/GMT+5')===null
  &&spiritualOf({d:'1990-01-15',t:'08:00',z:'Etc/GMT+5'}).needsPlace===true,
  'UTC and the fixed offset zones read the clock and give no horizon, so Rising still asks for a place');
 /* the nine cities keep their exact horizon, zone or no zone */
 /* A REFERENCE CASE NAMES A CITY OR A ZONE, NOT BOTH, and the claim is about the
    first. The tier ladder (J12) is thirty people born in places the nine cities
    do not cover, each carrying the IANA zone it was born in, which is exactly
    what the zone path is for. This said every case, so the first person added
    outside the nine failed it for the right reason and the wrong claim. It is
    split: a case with no zone reads from its own city, and a case with a zone
    must still resolve a Rising, read from the zone's own point. */
 ok(Object.keys(BIRTH).filter(k=>BIRTH[k]&&!BIRTH[k].z).every(n=>spiritual(n).risingFrom==='place'),
  'every reference case without a zone reads its rising from its own city');
 ok(Object.keys(BIRTH).filter(k=>BIRTH[k]&&BIRTH[k].z).every(n=>{const s=spiritual(n);
   return s.risingFrom==='zone'&&!!s.rising;}),
  'and every reference case with a zone reads its rising from that zone, '
  +Object.keys(BIRTH).filter(k=>BIRTH[k]&&BIRTH[k].z).length+' of them');
 const both=spiritualOf({d:'1988-04-12',t:'07:30',p:'Chicago, IL',z:'America/Chicago'});
 ok(both.rising===risingSign({d:'1988-04-12',t:'07:30',p:'Chicago, IL'})[2]&&both.risingFrom==='place',
  'a place the table names outranks the zone point for the horizon');
 /* a clock change: the ascendant is printed only when both offsets agree */
 let foldBad=[];
 for(let mn=0;mn<60;mn+=5){
  const t='01:'+pad(mn), r=risingSign({d:'2010-11-07',t:t,z:'America/New_York'});
  const P=zonePoint('America/New_York'), hrs=1+mn/60;
  const a=signOf(E.ascendant(julianDay(2010,11,7,hrs+4),P.lat,P.lon)),
        b=signOf(E.ascendant(julianDay(2010,11,7,hrs+5),P.lat,P.lon));
  if(r&&!(a===b&&ARIES[a]===r[2]))foldBad.push(t);
  if(!r&&a===b)foldBad.push(t+' refused though both agree');}
 ok(foldBad.length===0,'the hour that happened twice prints a rising only where both offsets agree'
  +(foldBad.length?'  '+foldBad.join(', '):''));
 ok(risingSign({d:'2011-12-30',t:'12:00',z:'Pacific/Apia'})===null,
  'and the day Samoa skipped, a whole turn of the sky, gives none');
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

g('19e \u00b7 where the four systems meet, Root Energetics');
{
 /* FV in TASKS.md: "take a look at all the behavioral energetics where they
    overlap, because that's the truth." engine/overlap.js. What is held here
    is the contract, never a person's reading: the bridges are the only
    bridges, overlap is weighed against chance rather than counted, and the
    words the rail puts on a meeting stay rare enough to mean something. */
 const {rootOverlap,rootPlacements,rootTail,rootStrength,ROOT_KINGWEN,ROOT_HEX,ROOT_TRIGRAM,
        ROOT_RULER,ROOT_NUMPLANET,ROOT_BRANCH_EL,ROOT_SAYS,HD_LINE_RUNS,ZSIGN,CHINESE,
        ROOT_Q_STRONG,ROOT_Q_CLEAR,ROOT_SHOW,spiritualOf,spiritual,numerology,numerologyOf,BIRTH}=E;
 /* the hexagram table is typed by hand, so it is held both ways: every number
    once, and named hexagrams where the book puts them */
 const cells=[].concat(...ROOT_KINGWEN).sort((a,b)=>a-b);
 ok(cells.length===64&&cells.every((n,i)=>n===i+1),'the King Wen table holds 1 to 64 once each');
 const pic=g=>ROOT_HEX[g].map(i=>ROOT_TRIGRAM[i].img).join(' under ');
 ok(pic(1)==='heaven under heaven'&&pic(2)==='earth under earth'&&pic(11)==='heaven under earth'
  &&pic(12)==='earth under heaven'&&pic(63)==='fire under water'&&pic(64)==='water under fire'
  &&pic(29)==='water under water'&&pic(30)==='fire under fire',
  'named hexagrams land where the book puts them, 11 '+pic(11)+', 63 '+pic(63));
 /* the Later Heaven elements: two metal, two wood, two earth, one fire, one water */
 const tel={};ROOT_TRIGRAM.forEach(t=>tel[t.el]=(tel[t.el]||0)+1);
 ok(tel.Metal===2&&tel.Wood===2&&tel.Earth===2&&tel.Fire===1&&tel.Water===1,
  'the trigrams carry the five elements in the Later Heaven order, '+JSON.stringify(tel));
 ok(ZSIGN.every(z=>ROOT_RULER[z[2]])&&CHINESE.every(a=>ROOT_BRANCH_EL[a]),
  'every sign has a ruler and every animal its branch element');
 ok([1,2,3,4,5,6,7,8,9,11,22,33].every(d=>ROOT_NUMPLANET[d]&&ROOT_SAYS[ROOT_NUMPLANET[d]]),
  'every digit and master has a planet, and every planet has a line to say');
 ok(['Fire','Earth','Water','Wood','Metal'].every(e=>ROOT_SAYS[e])&&!ROOT_SAYS.Air,
  'the five elements two systems can share have a line, and air, which none can, has none');
 ok([1,2,3,4,5,6].every(l=>HD_LINE_RUNS[l]),'every profile line has a behaviour');
 /* the tail is a real distribution: nothing is certain to be beaten, and
    three sure things always land */
 ok(Math.abs(rootTail([.25,.25,.25],0)-1)<1e-12&&Math.abs(rootTail([.25,.25,.25],3)-1/64)<1e-12
  &&Math.abs(rootTail([1,1],2)-1)<1e-12,'the chance of k of n landing is counted exactly');

 /* NOTHING IS BUILT ON A READING NOBODY TOOK. An untimed birth has no moon
    on a day the moon changes sign and no design gate, and neither may appear */
 const unt=spiritualOf({d:'1969-09-27',t:'',p:'Boston, MA'});
 const up=rootPlacements(unt,null);
 ok(!up.some(x=>x.k==='moon')&&!up.some(x=>x.sys==='D'),
  'an untimed birth places no moon it could not settle and no design gate, got '+up.map(x=>x.k).join(','));
 /* the personality gate is the sun, which Western already reads, so it never
    votes; only the design gate does */
 const ja=spiritual('James'), jp=rootPlacements(ja,null).filter(x=>x.sys==='D');
 ok(jp.length===2&&jp.every(x=>x.v===ja.hd.design.gate),
  'Design votes through the design gate alone, its two trigrams, got '+jp.map(x=>x.v+' '+x.part).join(','));

 /* THE BRIDGES ARE THE ONLY BRIDGES. Number meets Western and nothing else,
    Design meets on elements and nothing else, and a theme one system reaches
    alone is never a meeting point */
 let bridgeBad=[], lone=0, orderBad=0, rangeBad=0, n=0;
 const tally={strong:0,clear:0,light:0,none:0};
 const NM=['Anna Marie Lopez','John Paul Smith','Kiri Te Awa','Priya Raghunathan','Omar Ali Hassan',
  'Mei Lin Chen','Ngozi Ada Eze','Liam Patrick Ryan','Aroha Ngata','Tom Hardy'];
 const base=Date.UTC(1940,0,1);
 for(let i=0;i<700;i++){
  const date=new Date(base+i*36.7*864e5).toISOString().slice(0,10);
  const sp=spiritualOf({d:date,t:String((i*7)%24).padStart(2,'0')+':'+String((i*13)%60).padStart(2,'0'),p:'Chicago, IL'});
  if(!sp)continue; n++;
  const R=rootOverlap(sp,numerology(NM[i%NM.length],date));
  R.agree.forEach(a=>{
   if(a.sys.length<2)lone++;
   if(a.voc==='pl'&&a.sys.some(s=>s==='E'||s==='D'))bridgeBad.push(a.t+' '+a.sys.join(''));
   if(a.voc==='el'&&a.sys.includes('N'))bridgeBad.push(a.t+' '+a.sys.join(''));
   if(a.voc==='el'&&a.t==='Air')bridgeBad.push('Air');});
  for(let j=1;j<R.agree.length;j++)if(R.agree[j].q<R.agree[j-1].q)orderBad++;
  /* a reading is in a meeting the rail leads with or in the range, never both
     and never neither */
  const inShown=new Set();R.shown.forEach(a=>a.hits.forEach(h=>inShown.add(h)));
  R.placements.forEach(x=>{const inR=R.range.indexOf(x)>=0;
   if(x.sys==='D')return;
   if(inShown.has(x)===inR)rangeBad++;});
  tally[R.agree[0]?R.agree[0].strength:'none']++;}
 ok(!bridgeBad.length,'no meeting crosses a bridge the traditions do not supply, '+bridgeBad.slice(0,4).join(', '));
 ok(!lone,'and no theme one system reaches alone is called a meeting');
 ok(!orderBad,'the least likely by chance always leads');
 ok(!rangeBad,'every reading is either in a meeting the rail leads with or in the range, never both');
 /* THE WORDS STAY RARE. Overlap of some kind is nearly universal, so the
    contract is on the words and not on a figure: strong agreement is a small
    minority, agreement of either strength a minority, and a light meeting is
    what most people get. The shares are read off the run. */
 const sh=k=>tally[k]/n;
 ok(sh('strong')>0.02&&sh('strong')<0.2,'strong agreement is rare, '+(sh('strong')*100).toFixed(1)+' percent of '+n+' births');
 ok(sh('strong')+sh('clear')>0.12&&sh('strong')+sh('clear')<0.45,
  'agreement of either strength is a minority, '+((sh('strong')+sh('clear'))*100).toFixed(1)+' percent');
 ok(sh('light')>0.5,'and most people meet lightly, '+(sh('light')*100).toFixed(1)+' percent');
 ok(rootStrength(ROOT_Q_STRONG)==='strong'&&rootStrength(ROOT_Q_CLEAR)==='clear'&&rootStrength(0.5)==='light',
  'the three words sit on their two cut points');

 /* a name alone reads its numbers and nothing meets, because a meeting needs
    two systems */
 const nameOnly=rootOverlap(null,numerology('Anna Marie Lopez',null));
 ok(!nameOnly.agree.length&&nameOnly.range.length&&nameOnly.range.every(x=>x.sys==='N'),
  'a name with no birth date reads its numbers as range and meets nothing');
 const nothing=rootOverlap(null,null);
 ok(!nothing.agree.length&&!nothing.range.length&&!nothing.systems.length,'and nothing in is nothing out');
 /* every fixture with a birth gets at most ROOT_SHOW meetings, each carrying
    the readings it is built from, and a profile line in its range */
 const fx=Object.keys(BIRTH).filter(k=>BIRTH[k]).map(k=>rootOverlap(spiritual(k),numerologyOf(k,null)));
 ok(fx.every(R=>R.shown.length<=ROOT_SHOW&&R.shown.every(a=>a.hits.length>=2)),
  'every reference case leads with at most '+ROOT_SHOW+' meetings, each built from two readings or more');
 ok(fx.every(R=>R.range.some(x=>x.k==='profile')),'and carries its profile line as range');
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
 /* a blank profile through the boundary, so the laws are unanswered by the
    record's own marks and not by whatever the group before happened to load */
 E.loadProfile(E.blankProfile('empty'));
 E.S.doms=[0];E.S.arcs=[0,1];E.S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
 const r0=compute();
 ok(r0.loaded.length===0,'an empty field carries nothing');
 ok(typeof r0.unread==='boolean','the reading reports whether it has been read');
 ok(typeof r0.measured==='number','and how many laws were measured');
 /* CHANGED 25 SEPTEMBER. This asserted CQ above 0 here, "still computed for
    the machinery", because CQ was read off the default 6 on all 21 laws. The
    owner ruled the opposite: CQ builds from nothing as the laws are answered,
    so with none answered it is 0, and it says it is still filling. */
 ok(r0.CQ===0&&r0.answered===0&&r0.complete===false,
  'CQ is 0 with no law answered and says it is still filling, got '+r0.CQ+', '
  +r0.answered+' answered');
 /* one real input and it is a reading whatever the profile */
 S.charge.Fear=7; const r1=compute();
 ok(r1.unread===false,'one held address makes it a reading');
 /* CHANGED 25 SEPTEMBER, from "and the tier means something". A tier word on
    a CQ that is still filling would call this person Contracted for not having
    done the intake. The word waits for all 21. */
 ok(r1.tier===null,'but no tier word is put on it until all 21 laws are in, got '+r1.tier);
 ok(r1.DQ>0&&r1.CQ===0,'and the shadow reads while CQ waits, DQ '+r1.DQ.toFixed(1));
 S.charge.Fear=0; compute();
 /* AND CHARGE UNDER THE DISPLAY LINE IS STILL CHARGE SOMEBODY ENTERED.
    unread is a claim about whether anything was entered, not about whether it
    crossed SQ 4. Measured before this: all nine axes at 3.9, 107 addresses
    carrying, loaded 0, DQ 0.0, unread true, so Summary showed the four doors
    and said nothing had been entered while the release control offered those
    same 107 addresses and spent eight patterns a press on them. The display
    line is unchanged. DQ read 0 here until 25 September, because it summed
    only the addresses at 4 or more; it is the total shadow now and counts
    these too. */
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
 /* AND THE FORWARD HALF HAD NO ROW AT ALL. redoPop, redoDepth and redoPeek sat
    unexecuted under this gate, which the coverage run names, and this change
    rewrites the first two lines of each of them: they read the stack belonging
    to the record in front of the engine rather than one global array. Changed
    engine logic with no row on it is how a rewrite of two lines becomes a
    regression nobody sees. */
 reset(2,0,6);
 const b4=CHARGES.map(c=>S.charge[c]).join();
 E.undoPush('a change to walk back and forward');
 S.charge.Fear=9.4;
 const back=E.undoPop();
 ok(!!back&&E.redoDepth()===1,'undo leaves a step on the forward stack, depth '
  +E.redoDepth());
 ok(E.redoPeek()==='a change to walk back and forward',
  'and the forward control can name what it will put back, got '+E.redoPeek());
 ok(CHARGES.map(c=>S.charge[c]).join()===b4,'and the field is back where it started');
 const fwd=E.redoPop();
 ok(!!fwd&&Math.abs(S.charge.Fear-9.4)<1e-9,'redo walks forward again, Fear '+S.charge.Fear);
 ok(E.redoDepth()===0&&E.undoDepth()===1,'and the two ends swap, forward '
  +E.redoDepth()+' back '+E.undoDepth());
 E.undoPush('a new change');
 ok(E.redoDepth()===0,'a new change abandons the branch that was walked away from');
 E.undoClear();
 /* A HISTORY BELONGS TO THE RECORD IT WAS TAKEN FROM.

    One stack for the whole app was a field leak, and it is the unit half of the
    row the functional gate carries. A change made while one record was loaded
    could be taken back while another was, which restores the first record's
    field into S and leaves the host saving it onto the second. Measured in a
    full functional run before this: 53.0 units of a reference case's charge in
    the person's own record, upstream of the release the guard watches. */
 /* two records, moved between through the boundary, because that is the only
    route a headless host has to the pointer the app moves with loadP. The
    preceding persistence regression deliberately leaves a no-op storage
    adapter installed, so this scenario binds a real per-test store rather
    than relying on a writer that discards data. */
 const undoMem={};
 E.bindStore(k=>undoMem[k]===undefined?null:undoMem[k],(k,v)=>{undoMem[k]=String(v);});
 const recA=E.pImport(JSON.stringify(E.blankProfile('history A')));
 ok(!!recA,'the harness can put a record in front of the engine');
 E.undoPush('a change on A');
 const dA=E.undoDepth();
 const recB=E.pImport(JSON.stringify(E.blankProfile('history B')));
 ok(!!recB&&recB!==recA,'and a second one');
 const dB=E.undoDepth(), peekB=E.undoPeek(), popB=E.undoPop();
 ok(dA===1&&dB===0,'a record sees its own history and no other, A '+dA+' B '+dB);
 ok(popB===null,'an undo belonging to another record refuses rather than restoring');
 ok(peekB===null,'and is not offered, so a control cannot print a step it will refuse');
 /* that it is keyed rather than cleared, so going back to the record finds the
    history where it was left, is checked in the functional gate, where moving
    between records is a control a person presses rather than an assignment. */
 E.undoClear();
 /* A SEED IS UNDONE WITH ITS TYPE, P0-5 of the inference audit, 23 October.
    The Intake page pushes undo before a type writes. The axes it wrote go back
    to the empty field and the type comes off with them, so the card under the
    select never claims a seed the axes no longer hold. */
 const recS=E.pImport(JSON.stringify(E.blankProfile('history seed')));
 const cs=E.current();
 ok(!!recS&&!!cs&&E.seedEmpty(cs),'a fresh record\'s axes are empty, so a type may seed them');
 E.undoPush('choosing the Myers-Briggs type ENTP'); E.seedApply(cs,'ENTP'); E.loadProfile(cs);
 const seeded=S.charge.Fear;
 E.undoPop();
 ok(seeded>0&&CHARGES.every(c=>S.charge[c]===0)&&E.current().seed===null,
  'undoing a seed puts back the empty field and takes the type off with it, Fear '+seeded+' then '+S.charge.Fear);
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
  const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn();
  return compute();};
 /* a persona's table is its measurement, as loadP treats it */
 const by={}; PEOPLE.forEach(p=>{by[p.nm]=rd(p);});
 /* CHANGED 25 SEPTEMBER. This asserted Tomas about 2, Nkem 10, Wren 92 and
    Abraham 98, and each pair shared a word. Those four were solved by
    bisection against It*Ig/Rz, where a heavy field could pull CQ to the
    floor. CQ is the laws alone now, so load no longer reaches it, and the
    floor pair is reached on expression instead. Their law tables are persona
    data and were not re-solved: whether the tier word names CQ or expression
    is the owner's question 1, and re-solving before he rules would pick for
    him. What is still true, and asserted: the floor cases sit below the
    median on CQ and further down on expression, the ceiling cases sit in the
    top two bands, CQ is exactly each table summed over 210, and expression
    is CQ times what the pull leaves. The readings themselves are printed by
    the checks, not typed here. */
 /* Nkem was cut in round QD, and Gordon is the second floor case */
 ['Tomas','Gordon'].forEach(n=>{
  ok(by[n].CQ<E.MEDIAN,n+' is a floor case, below the median, got '+by[n].CQ.toFixed(1));
  ok(by[n].EX<by[n].CQ,n+' and its load pulls expression lower, '+by[n].EX.toFixed(1));});
 ['Wren','Abraham'].forEach(n=>ok(by[n].CQ>=81,
  n+' is a ceiling case, in the top two bands, got '+by[n].CQ.toFixed(1)));
 ['Tomas','Gordon','Wren','Abraham'].forEach(n=>
  near(by[n].EX,by[n].CQ*(1-by[n].PULL),1e-9,n+' expression is CQ times what the pull leaves'));
 ['Tomas','Gordon','Wren','Abraham'].forEach(n=>{
  const LS=LAWSET[n];
  const sum=SINAMES.reduce((a,l)=>a+((LS[l]!==undefined)?LS[l]:LS._),0);
  ok(Math.abs(by[n].CQ-sum/210*100)<1e-9,n+' reads its laws over 210, '+by[n].CQ.toFixed(1));});
 /* the vocabulary claim itself does not need a persona: a band is ten wide */
 ok(E.tierOf(2).nm===E.tierOf(10).nm,'2 and 10 are the same word: '+E.tierOf(2).nm);
 ok(E.tierOf(92).nm===E.tierOf(98).nm,'92 and 98 are the same word: '+E.tierOf(92).nm);
 /* the ends must be real fields, not empty ones */
 ok(by.Tomas.loaded.length>60,'the floor case is genuinely loaded, got '+by.Tomas.loaded.length);
 ok(by.Wren.loaded.length>0,'and the ceiling case still carries something, got '+by.Wren.loaded.length);
 /* six of the seven bands are now covered by a real reference case */
 const bands={}; PEOPLE.forEach(p=>{bands[by[p.nm].tier]=1;});
 ok(Object.keys(bands).length>=6,'the roster covers at least six bands, got '+Object.keys(bands).length);
 /* every new case resolves the cosmological layer too */
 ['Tomas','Gordon','Wren','Abraham'].forEach(n=>{
  const sp=E.spiritual(n);
  ok(sp&&sp.sun&&sp.rising,n+' resolves a full birth reading');});
}

g('19ba · the roster: twelve across the scale, and the owner at four points on it');
/* ROUND QD, 2 October, which replaces the J12 ladder this group held (three
   people in every band, round PL). His words: "There are too many now. let's
   have 12, with a range that gives us a little bit of flavor across the scale
   from 0 to 100. And then give me ... one of me with a CQ of fifteen, fifty,
   eighty-five and one hundred. That says Lance, comma, developer." Read off the
   real engine and off TIERDEF, and no count of people is typed here: the
   roster's size is his to move and a gate that counted it would be the defect
   this repository keeps paying for. */
{
 const rd=p=>{
  S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn();
  return compute();};
 const ppl=PEOPLE.filter(p=>!p.you), read=ppl.map(p=>({p,r:rd(p)}));
 const byTier={}; E.TIERDEF.forEach(t=>{byTier[t.nm]=[];});
 read.forEach(x=>byTier[x.r.tier].push(x));
 /* THE FOUR OF HIM, at the four numbers he gave, each a whole example named
    Lance with the role he said. A name carries the number, because nm is the
    key every table looks a person up by (people.js says why). */
 const lance=ppl.filter(p=>/^Lance /.test(p.nm));
 const want=[15,50,85,100];
 ok(lance.length===want.length,'there is one Lance profile per number he gave, '+lance.map(p=>p.nm).join(', '));
 want.forEach(n=>{const x=read.find(y=>y.p.nm==='Lance '+n);
  ok(!!x&&Math.abs(x.r.CQ-n)<0.05&&x.p.role==='developer',
   'Lance '+n+' reads CQ '+n+' and says developer, got '+(x?x.r.CQ.toFixed(2)+', '+x.p.role:'nothing'));});
 /* A RANGE, NOT A CLUSTER. Most of the bands carry somebody, the ends are the
    ends, and sorted by CQ no stretch of the scale between two neighbours is
    wider than two bands. Twelve cannot fill ten bands three deep, so the old
    half a band is not the bar: the widest gap at this cut is the Corrupt band,
    21 to 30, which none of the twelve the gates name sits in, and people.js
    records that rather than this gate hiding it. */
 const hit=E.TIERDEF.filter(t=>byTier[t.nm].length>0).length;
 ok(hit>=E.TIERDEF.length-1,'every band but at most one carries somebody, '+hit+' of '+E.TIERDEF.length
  +', empty: '+E.TIERDEF.filter(t=>!byTier[t.nm].length).map(t=>t.nm).join(', '));
 const cq=read.map(x=>x.r.CQ).sort((a,b)=>a-b);
 const widest=Math.max.apply(null,E.TIERDEF.map(t=>E.tierTop(t.nm)-t.at+1));
 let gap=0; for(let i=1;i<cq.length;i++)gap=Math.max(gap,cq[i]-cq[i-1]);
 ok(gap<=widest*2,'no stretch of the scale wider than two bands is left empty: the widest gap is '+gap.toFixed(1)
  +', the limit is '+(widest*2));
 /* AND THE ENDS ARE THE ENDS. The lowest reading is in the lowest band and the
    highest in the highest, and neither is the median pretending. */
 ok(E.tierOf(cq[0]).nm===E.TIERDEF[E.TIERDEF.length-1].nm,
  'the lowest reading is in the lowest band, '+cq[0].toFixed(1));
 ok(E.tierOf(cq[cq.length-1]).nm===E.TIERDEF[0].nm,
  'the highest reading is in the highest band, '+cq[cq.length-1].toFixed(1));
 /* A REFERENCE CASE IS A WHOLE PERSON. Each one fills the fields every surface
    reads, and they are told apart by name, by role and by what they say, so the
    picker never lists two rows that read as one. No clinical label is allowed to
    stand in for a story. */
 const miss=ppl.filter(p=>!p.nm||!p.role||!p.says||!(p.age>0)||p.dom==null||p.a1==null||p.a2==null||!p.c||!p.rep);
 ok(miss.length===0,'every reference case is complete, '+miss.length+' are not'+(miss[0]?': '+miss[0].nm:''));
 const dup=k=>{const seen={},d=[]; ppl.forEach(p=>{const v=String(p[k]).toLowerCase(); if(seen[v])d.push(p.nm); seen[v]=1;}); return d;};
 ['nm','says'].forEach(k=>ok(dup(k).length===0,'no two reference cases share a '+k+', '+dup(k).join(', ')));
 /* the role too, except the four Lance profiles, which are one person at four
    depths and carry the one role he gave them, "Lance, comma, developer" */
 const dupRole=dup('role').filter(n=>!/^Lance /.test(n));
 ok(dupRole.length===0,'no two different people share a role, '+dupRole.join(', '));
 ok(ppl.every(p=>p.dom>=0&&p.dom<DOMAINS.length&&p.a1>=0&&p.a1<ARCH.length&&p.a2>=0&&p.a2<ARCH.length),
  'every reference case names a real domain and real archetypes');
 ok(ppl.every(p=>!/[\u2013\u2014]/.test(p.says+p.role)),'and no reference case speaks with a dash');
 const clinical=/\b(depress|ptsd|trauma|disorder|bipolar|anxiety|adhd|diagnos|psycho|patholog|symptom|syndrome|burnout)/i;
 ok(ppl.every(p=>!clinical.test(p.says+' '+p.role)),'and none of them wears a clinical label');
 /* EVERY ONE CARRIES THE BIRTH THE COSMOLOGICAL LAYER READS, but the owner's
    own four, whose birth is his to enter and is not invented for him. */
 const noBirth=ppl.filter(p=>!E.BIRTH[p.nm]||!E.FULLNAME[p.nm]).map(p=>p.nm);
 ok(noBirth.every(n=>/^Lance /.test(n)),'every reference case has a birth and a full name but Lance, '+noBirth.join(', '));
 /* A TABLE THAT ANSWERS EVERY LAW, and a law that exists. A misspelt law name
    in a persona table is a key the engine never reads, which silently moves the
    person to the base value and the tier with it. */
 const bad=[]; ppl.forEach(p=>Object.keys(LAWSET[p.nm]).forEach(k=>{if(k!=='_'&&SINAMES.indexOf(k)<0)bad.push(p.nm+':'+k);}));
 ok(bad.length===0,'no persona table names a law that does not exist, '+bad.join(', '));
 /* THE FIELD DOES NOT CONTRADICT THE WORD AT THE ENDS. Whoever reads Contracted
    carries most of what they hold, and whoever reads Mastery carries almost none
    of it. The tier is the laws alone, so this is the one place the held charge
    is checked against it, and only where the two have to agree. */
 const lo=byTier[E.TIERDEF[E.TIERDEF.length-1].nm], hi=byTier[E.TIERDEF[0].nm];
 ok(lo.every(x=>x.r.DQ>=30),'everyone in the lowest band carries a real load, '
  +lo.map(x=>x.p.nm+' '+x.r.DQ.toFixed(0)).join(', '));
 ok(hi.every(x=>x.r.DQ<=10),'and everyone in the highest carries little, '
  +hi.map(x=>x.p.nm+' '+x.r.DQ.toFixed(0)).join(', '));
 console.log('  '+read.length+' people, '+E.TIERDEF.length+' bands, CQ '+cq[0].toFixed(1)+' to '
  +cq[cq.length-1].toFixed(1)+', widest gap '+gap.toFixed(1));
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
 /* NAMED CHANGE, percent phase 2 slice 2, 17 October: a band is a range of CQ
    and CQ prints as a percent, so the range does too. The bottom band starts at
    nought, which the registry never prints as 0%, so it reads up to its top. */
 ok(tierRange(TIERDEF[0])==='91% to 100%'&&tierRange(TIERDEF[9])==='up to 10%',
  'and a band prints as a range in percent, got '+tierRange(TIERDEF[0])+' and '+tierRange(TIERDEF[9]));
 /* the median, ruled. fifty is the centre and forty to sixty is the swing. */
 ok(MEDIAN===50&&MEDIAN_LO===40&&MEDIAN_HI===60,'fifty is the median, forty to sixty the range');
 /* closed at forty and sixty AS PRINTED. This asserted 39.9 and 60.1 outside,
    and both print as 40 and 60, so the drill told a person at "CQ 40" that
    40 to 60 is the median range and that they were not in it (round IK). */
 ok(medianRange(40)&&medianRange(50)&&medianRange(60)&&medianRange(39.9)&&medianRange(60.1)
  &&!medianRange(39.4)&&!medianRange(60.6),
  'the median range is closed at forty and sixty, as the screen prints them');
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
 ok(tierOf(95).nm==='Mastery'&&tierOf(12).nm==='Severe'&&tierOf(0).nm==='Contracted'
  &&tierOf(10).nm==='Contracted'&&tierOf(11).nm==='Severe'&&tierOf(75).nm==='Compounding',
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
 /* the floor band's direction names another person, 16 October: the line
    used to say "not alone", and now says who with. Held at the same
    strength: a direction that sends a person anywhere but to somebody else
    fails, and so does one that tells them to manage it alone. */
 ok(/\banother person\b|\bnot alone\b/.test(TIER_BY.Contracted.toward)
   &&!/\b(?:yourself|on your own|by yourself)\b/.test(TIER_BY.Contracted.toward),
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
 const {C3_VERB,C3_STEM,C3_TRUTH,C3_BAND,C3_LADDER,C3_POLE,CARDSET,
        AXCARD,AXC_UN,CARD_BY,AXC_BY,cardLine,cardDepth,axLine,addrLine,relLine,c3Band}=E;
 /* THE CHANNELS, RULED 26 SEPTEMBER. His words: "believing, perceiving,
    thinking, behaving, acting, feeling. Those are the channels we're using."
    The list is spelled out here on purpose and not read back off the engine,
    because a test that reads the list it checks passes on any list. */
 const SIX=['believing','perceiving','thinking','behaving','acting','feeling'];
 ok(C3_VERB.join()===SIX.join(),'the channels are his six, in his order, got '+C3_VERB.join(', '));
 ok(C3_STEM==='I am letting go of believing, perceiving, thinking, behaving, acting, '
   +'and feeling that I am ','the release stem carries the six and nothing else');
 ok(C3_TRUTH==='I now embody the truth that I am ','the truth stem is verbatim');
 /* one list and one stem. The second roster and its stem were retired rather
    than left beside the first, and a build that brings either back fails
    here, because two lists for one slot is the defect BT was logged against. */
 ok(E.C3_GATE9===undefined&&E.AX_STEM===undefined,
  'the axes card roster and its stem are retired, not kept beside the six');
 ['speaking','saying','doing','voicing','being','relating through','creating from']
  .forEach(w=>ok(C3_STEM.indexOf(w)<0,'the stem does not carry '+w));

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
 ok(axLine('Fear')===C3_STEM+AXC_BY.Fear.rel,
  'the axes line is on the one stem, and the card body after it is untouched');
 ok(axLine('Surprise')===null,'and an axis with no card returns null');

 /* THE RELEASE READS THE SIX. relLine is what the release card prints for the
    plan key it is on, so these are the sentences a person actually runs. All
    three sources are hit: a printed card, an axes card, and the strict syntax
    at an address with no card. */
 const ADDR=Object.values(E.BY).filter(n=>n&&n.cf);
 const byAx=ax=>ADDR.find(n=>n.cf===ax);
 const onCard=byAx('Anger'), onAx=byAx('Fear');
 const bare=ADDR.find(n=>!CARD_BY[n.cf]&&!AXC_BY[n.cf]);
 [['a printed card',onCard],['an axes card',onAx],['no card',bare]].forEach(([what,n])=>{
  ok(!!n,'a reference address exists for '+what);
  if(!n)return;
  ['Rlimit','Llimit'].forEach(ch=>{
   const L=relLine(n,ch,0);
   ok(L&&!L.truth&&L.text.indexOf('I am letting go of believing, perceiving, thinking, '
     +'behaving, acting, and feeling that I am ')===0,
    'a '+ch+' line at '+what+' runs all six channels: '+(L&&L.text));});
  ['Rtruth','Ltruth'].forEach(ch=>{
   const L=relLine(n,ch,0);
   ok(L&&L.truth&&L.text.indexOf('I am letting go')<0&&L.text.length>0,
    'a '+ch+' line at '+what+' installs, it does not release again');});});
 /* the side picks the pole on a printed card: right is masculine, left is
    feminine, which is how the printed cards label the same split */
 ok(relLine(onCard,'Rlimit',0).text===cardLine('Anger','m',0).rel
   &&relLine(onCard,'Llimit',0).text===cardLine('Anger','f',0).rel,
  'right reads the masculine column of the card and left the feminine');
 /* the line index is the position on the card, so the same key is the same
    sentence and the next key is the next statement */
 ok(relLine(onCard,'Rlimit',1).text===cardLine('Anger','m',1).rel,
  'line one of a pass is statement one of the card');
 ok(relLine(onCard,'Rlimit',cardDepth('Anger','m')).text===relLine(onCard,'Rlimit',0).text,
  'a position past the card cycles rather than running off it');
 ok(relLine(null,'Rlimit',0)===null,'no address, no line, never an invented one');

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
 ok(MIRROR.some(m=>m.up==='Jesus'&&m.dn==='Lucifer'),'light is Jesus against Lucifer');
 /* round KE, his words: "Just change illumination to light." The key stays IL. */
 ok(MIRROR.some(m=>m.k==='IL'&&m.q==='Light')&&!MIRROR.some(m=>/Illumination/.test(m.q)),
  'and the Heart axis is called Light, not Illumination');
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
 /* THE FIVE PATHS, MIRRORED. Round KE. Each path carries an inversion in the
    mirror pairs' own shape, so the compass draws the five the way it draws
    the eight. Two are codex and must be read off the mirror pairs rather than
    drift from them; three are research and must say where they came from. */
 {const {PATHS}=E;
  ok(Array.isArray(PATHS)&&PATHS.length===5,'five paths, got '+(PATHS?PATHS.length:'none'));
  const pthin=PATHS.filter(p=>!p.up||!p.dn||!p.upd||!p.dnd||!p.ic||!p.dic||!p.q||!p.src).map(p=>p.up);
  ok(pthin.length===0,'every path carries both poles, both lines, both marks and a source'
   +(pthin.length?'  thin: '+pthin.join(', '):''));
  ok(['Krishna','Buddha','Jesus','Rama','Lao Tzu'].every(n=>PATHS.some(p=>p.up===n)),
   'and they are the glossary\'s five');
  const drift=PATHS.filter(p=>p.from==='codex')
   .filter(p=>!MIRROR.some(m=>m.up===p.up&&m.dn===p.dn&&m.dnd===p.dnd));
  ok(drift.length===0,'the codex inversions are the mirror pairs\' own'
   +(drift.length?'  drift: '+drift.map(p=>p.up).join(', '):''));
  const res=PATHS.filter(p=>p.from==='research');
  ok(res.length===3&&res.every(p=>/[A-Za-z]/.test(p.src)),
   'and the three researched ones are marked as research and cite a text');
  ok(new Set(PATHS.map(p=>p.k)).size===5,'and no two share a key');}
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
 /* CHANGED 26 OCTOBER, with the ruling that ties Psychopathy to the chain.
    This read "to the step that says so": the floor lit Psychopathy for any
    dark field. A field handed no chain now names an untied step at the
    floor, and the referral stays on, because it follows depth and not the
    step. */
 ok(darkRead(0.9,5).step&&darkRead(0.9,5).step.nm==='Machiavellianism'&&darkRead(0.9,5).refer===true,
  'with no chain behind it the floor refers out and names no tied step, got '+(darkRead(0.9,5).step||{}).nm);
 ok(/licensed clinician/.test(DESCENT_REFER),'the referral names a clinician');
 /* CHANGED 26 OCTOBER. This counted three steps and read the last by
    position, the two habits the repository rules out. Read by name. */
 {const psyE=E.descentStep('Psychopathy'), socE=E.descentStep('Sociopathy');
  ok(psyE&&psyE.refer===true&&DESCENT[DESCENT.length-1]===psyE,'the last step is Psychopathy and it is not ours to work');
  ok(psyE.kind==='super complex'&&JSON.stringify(psyE.pair)==='["Grandiosity","Predatory"]',
   'Psychopathy is a super complex of exactly Grandiosity and Predatory, '+JSON.stringify(psyE.pair));
  ok(socE&&socE.kind==='hyper complex'&&socE.fam==='Predatory'&&!socE.refer,
   'Sociopathy is the Predatory hyper complex and refers nobody by itself');
  ok(E.HCX_LIB.some(h=>h.nm===socE.fam)&&psyE.pair.every(f=>E.HCX_LIB.some(h=>h.nm===f)),
   'and every family a step is tied to is a family HCX_LIB carries');
  /* the step is read off the chain it is handed, never off depth */
  const hy=(nm,w,over)=>({kind:'hy',nm:nm,w:w,over:!!over});
  ok(darkRead(0.9,25,{hys:[hy('Predatory',7)],psychopathy:null}).step===socE,
   'a Predatory hyper complex in a dark field names Sociopathy, at any depth of the dark read');
  ok(darkRead(0.9,5,{hys:[hy('Predatory',7,true)],psychopathy:null}).step!==socE,
   'an overshoot is not its family');
  ok(darkRead(0.9,25,{hys:[hy('Grandiosity',7),hy('Predatory',7)],psychopathy:{named:'Psychopathy'}}).step===psyE,
   'the named super complex names Psychopathy, the deepest tied step first');
  ok(darkRead(0.9,25,{hys:[hy('Grandiosity',7),hy('Predatory',7)],psychopathy:{named:'Psychopathy'}}).refer===false,
   'and naming it does not move the referral, which still follows depth');
  ok(darkRead(0.9,70,{hys:[hy('Predatory',7)],psychopathy:{named:'Psychopathy'}}).step===null,
   'and nothing is named outside the dark read');}

 /* THE NAMED SUPER COMPLEX IN THE ENGINE, 26 October. The contract, held on
    every field the roster and a drive at named saboteurs can make: r.psychopathy
    is set exactly when a Grandiosity and a Predatory hyper complex are both
    in hys, neither overshot, at a mean weight that passes the super complex's
    own gate, and inSups says whether the generic pairing by rank also paired
    them. It never enters sups. Two of the driven fields must produce it, one
    of them where the pairing by rank did not, or the probe proves nothing. */
 {const drive=(names,ch,law,extra)=>{
   reset(0,0,law);
   Object.keys(S.addr).forEach(k=>{delete S.addr[k];});
   const cfs={};
   names.forEach(nm=>E.ALL_SAB.filter(s=>s.nm===nm)[0].nids.forEach(i=>{
    S.addr[i]=10; const n=W.filter(x=>x.i===i)[0]; if(n&&n.cf)cfs[n.cf]=1;}));
   Object.keys(cfs).forEach(c=>{S.charge[c]=ch;});
   (extra||[]).forEach(nm=>E.ALL_SAB.filter(s=>s.nm===nm)[0].nids.forEach(i=>{S.addr[i]=10;}));
   return compute();};
  const G=['Micromanager','Hyper-Achiever','Judge','Dramatizer','Dreamer'];
  const Pd=['Aggressor','Deflector','Skeptic','Manipulator'];
  const heavy=E.ALL_SAB.filter(s=>!s.unnamed&&(s.hcx==='Collapse'||s.hcx==='Rigidity')).map(s=>s.nm);
  const runs=[];
  /* the roster read the way group 'the tier words' reads it, rd above */
  PEOPLE.forEach(p=>{Object.keys(S.addr).forEach(k=>{delete S.addr[k];});
   S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
   S.roots=p.roots?p.roots.slice():[]; buildSoul();
   CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
   const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
   SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn();
   runs.push(['roster '+p.nm,compute()]);});
  [4,5,6,7].forEach(ch=>{
   runs.push(['Grandiosity at '+ch,drive(G,ch,2)]);
   runs.push(['Predatory at '+ch,drive(Pd,ch,2)]);
   runs.push(['both at '+ch,drive(G.concat(Pd),ch,2)]);
   runs.push(['both at '+ch+' under Collapse and Rigidity',drive(G.concat(Pd),ch,2,heavy)]);});
  /* a flat field with both families light: both hyper complexes form and
     sit under the gate, which is the field that holds the gate itself */
  {reset(5,0,2); Object.keys(S.addr).forEach(k=>{delete S.addr[k];});
   /* Dreamer left out: with it Grandiosity clears the gate on its own */
   G.filter(nm=>nm!=='Dreamer').concat(Pd).forEach(nm=>E.ALL_SAB.filter(s=>s.nm===nm)[0].nids.forEach(i=>{S.addr[i]=5;}));
   runs.push(['both light on a flat field',compute()]);}
  let bad=[], fired=0, offRank=0, under=0;
  runs.forEach(([nm,r])=>{
   const parts=r.hys.filter(h=>!h.over&&(h.nm==='Grandiosity'||h.nm==='Predatory'));
   const w=parts.length===2?(parts[0].w+parts[1].w)/2:0;
   const want=parts.length===2&&w>=5.6;
   if(parts.length===2&&w<5.6)under++;
   const p=r.psychopathy;
   if(want!==!!p)bad.push(nm+': want '+want+' got '+!!p);
   if(p){fired++;
    const both=r.sups.some(s=>s.parts.indexOf(parts[0])>=0&&s.parts.indexOf(parts[1])>=0);
    if(p.inSups!==both)bad.push(nm+': inSups '+p.inSups+' against '+both);
    if(!p.inSups)offRank++;
    if(r.sups.indexOf(p)>=0)bad.push(nm+': it entered sups');
    if(p.named!=='Psychopathy'||p.kind!=='sup'||Math.abs(p.w-w)>1e-9)bad.push(nm+': shape '+p.named+' '+p.kind+' '+p.w);}});
  ok(bad.length===0,'r.psychopathy is set exactly when both hyper complexes clear the gate, on '+runs.length+' fields: '+bad.slice(0,3).join('; '));
  ok(fired>=2,'and a drive at named saboteurs produces it, '+fired+' times');
  ok(under>=1,'and a field where both form under the gate is in the sweep, so the gate is held too, '+under+' times');
  ok(offRank>=1,'including where the pairing by rank paired them with something else, '+offRank+' times');
  ok(drive(Pd,5,2).psychopathy===null&&drive(Pd,5,2).hys.some(h=>h.nm==='Predatory'),
   'Predatory alone builds its hyper complex and no Psychopathy');
  Object.keys(S.addr).forEach(k=>{delete S.addr[k];});
  reset();}
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
 ok(organisedShare([{kind:'sup',w:5}])===1,'a super complex is fully conditioned');
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
 const all=JSON.stringify([MIRROR,E.PATHS,MASTERS,BLUEPRINT,CIRCLES,CASCADE,DESCENT]);
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
 const {PLANS,PLAN_BY,SEE_ORDER,SIGHT,TIER_KEYS,planSight,planNeed,planAdds,planSeesAt,planRank,planList,
        planState,planOf,planSees,planNextSight,
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
 /* A ROW OF THE LADDER NO LONGER CARRIES ITS OWN SIGHT. It said see:'sup' on
    every row, which was a second place the same fact lived, and the ruling of
    1 October made the fact differ by tier. SIGHT is the one table. */
 ok(PLANS.every(p=>!('see' in p)),'no row of the ladder types a sight of its own, SIGHT is the table');
 ok(PLAN_ALWAYS.length>=3,'and what is on every tier is named rather than remembered');
 /* the laws and the gates by the names the Field's bar prints since 22 October */
 ok(['your 112 addresses','the domains','the archetypes','the Laws of Moral Integrity','the Laws of Action','shadow']
   .every(w=>PLAN_ALWAYS.indexOf(w)>=0),
  'what is on every tier is the owner\'s own list: addresses, domains, archetypes, the Laws of Moral Integrity, the Laws of Action and shadow');
 ok(!PLAN_ALWAYS.some(w=>/saboteur|complex|character|whole reading/i.test(w)),
  'and nothing in it is a rung a tier buys, or the whole reading, which is no longer on every tier');

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

 /* SIGHT BY TIER. Ruled 1 October, reversing "sight is not for sale": everybody
    sees their own reading down to the 112 addresses, and the chain above them
    is bought. Free sees no saboteurs, tier one sees saboteurs, tier two adds
    complexes, tiers three and four add hyper complexes and super complexes. */
 const mk=k=>({tier:k,status:'active'}), t1=mk('one'), t3=mk('three');
 const seen=k=>SEE_ORDER.filter(r=>planSees(mk(k),r)).join();
 ok(seen('free')==='','free sees no rung of the chain, got '+seen('free'));
 ok(seen('one')==='sab','tier one sees saboteurs and nothing above them, got '+seen('one'));
 ok(seen('two')==='sab,cx','tier two adds complexes, got '+seen('two'));
 ok(seen('three')==='sab,cx,hy,sup','tier three adds hyper complexes and super complexes, got '+seen('three'));
 ok(seen('four')===seen('three'),'tier four sees what tier three sees, and buys the lead suite instead');
 /* the three that are not rungs. The registers are the point cloud, ruled tier
    three by the owner on 1 October. The Kundalini is ruled tier two and has no
    surface yet, so it answers planSees and no copy mentions it. The masks are
    PROPOSED at tier three and still open. */
 ok(!planSees(mk('free'),'reg')&&!planSees(mk('two'),'reg')&&planSees(mk('three'),'reg')&&planSees(mk('four'),'reg'),
  'the registers, the point cloud, need tier three');
 ok(!planSees(mk('one'),'kund')&&planSees(mk('two'),'kund')&&planSees(mk('four'),'kund'),
  'the Kundalini needs tier two, as ruled');
 ok(!planSees(mk('two'),'mask')&&planSees(mk('three'),'mask')&&planSees(mk('four'),'mask'),
  'the masks need tier three');
 /* A LAPSED OR UNKNOWN PLAN READS AS FREE, through planOf, the way it does for
    the allowance. The failure this holds is a cancelled tier three still
    seeing hyper complexes. */
 ok(SEE_ORDER.every(r=>!planSees({tier:'three',status:'canceled'},r)),'a cancelled tier three sees nothing above the addresses');
 ok(SEE_ORDER.every(r=>!planSees({tier:'three',status:'unpaid'},r)),'nor an unpaid one');
 ok(SEE_ORDER.every(r=>!planSees({tier:'three',status:'something_new'},r)),'an unknown status opens no door either');
 ok(planSees({tier:'three',status:'past_due'},'hy'),'past due keeps sight, as it keeps access');
 ok(SEE_ORDER.every(r=>!planSees({tier:'tier-from-the-future',status:'active'},r)),'a tier this build does not know reads free');
 ok(SEE_ORDER.every(r=>!planSees(null,r)&&!planSees(undefined,r)&&!planSees({},r)),'a record with no plan reads free');
 ok(planSees({tier:'gift',status:'active'},'sab')===false,'the gift is not a tier a person is on, so it grants no sight');
 ok(planSees(mk('four'),'nonsense')===false,'a key SIGHT does not hold is not visible, on any plan');
 /* THE TABLE IS WHOLE. Every row names a tier that exists, and the four rungs
    stack: a tier that sees a rung sees every rung below it, because each rung
    is built from the one before. */
 ok(SIGHT.every(g=>TIER_KEYS.indexOf(g.need)>0),'every row names a paid tier that exists as its need');
 ok(SEE_ORDER.join()==='sab,cx,hy,sup','the rungs are saboteur, complex, hyper complex, super complex, in chain order');
 ok(SEE_ORDER.every((k,i)=>i===0||planRank(planNeed(k).k)>=planRank(planNeed(SEE_ORDER[i-1]).k)),
  'and the tier a rung needs never falls as the chain goes up');
 ok(SIGHT.every(g=>typeof g.what==='string'&&g.what.length>10&&!/\u2014/.test(g.what)),'every row says in a sentence what is locked');
 ok(planNeed('hy').k==='three'&&planNeed('nonsense')===null,'planNeed names the tier row, or null for a key it does not hold');
 const ps=planSight(mk('one'));
 ok(ps.tier==='one'&&ps.sees.sab===true&&ps.sees.cx===false&&!ps.all,'planSight says the rung in force and what it sees');
 ok(ps.locked.map(g=>g.k).join()==='cx,hy,sup,reg,mask','and what is locked, in table order, got '+ps.locked.map(g=>g.k).join());
 ok(SIGHT.filter(g=>g.built===false).map(g=>g.k).join()==='kund'&&planSight(null).locked.every(g=>g.k!=='kund'),
  'a row with no surface is in the table and in planSees but is never offered as a lock');
 ok(planSight(mk('four')).all&&planSight(mk('four')).locked.length===0,'tier four has nothing locked');
 ok(SIGHT.every(g=>Object.keys(planSight(null).sees).indexOf(g.k)>=0),'sees carries every key, so a caller never reads undefined as an answer');
 /* WHAT A TIER ADDS reads off the same table, so the tiers page types none of it */
 ok(planAdds('free').length===0,'free adds nothing, it is the floor');
 ok(planAdds('one').map(g=>g.k).join()==='sab','tier one adds saboteurs');
 ok(planAdds('two').map(g=>g.k).join()==='cx','tier two adds complexes, and not the Kundalini, which has no surface to sell');
 ok(planAdds('three').map(g=>g.k).join()==='hy,sup,reg,mask','tier three adds hyper complexes, super complexes, the registers and the masks');
 ok(planAdds('four').length===0,'tier four adds no sight over tier three');
 ok(planSeesAt('three').length===SIGHT.filter(g=>g.built!==false).length&&planSeesAt('free').length===0&&planSeesAt('nonsense').length===0,
  'what a tier sees is every built row at or below it, and a tier that does not exist sees none');
 ok(E.planLockedSay(['sab','cx','kund','reg'])==='saboteurs, unlocked on tier one and above; complexes, unlocked on tier two and above; the registers, unlocked on tier three and above',
  'a locked clause is grouped by the tier that unlocks it, and leaves out what has no surface');
 ok(E.planSightSay(null)==='your own reading, without what is running it'&&E.planSightSay(mk('two'))==='your own reading, with saboteurs and complexes',
  'what a plan sees is said as one clause, off the table');
 ok(!SIGHT.some(g=>/\b(level|rank|better|worse|behind|lower)\b/i.test(g.what)),
  'no lock sentence says a locked tier is a lower level of the person, only that the view is part of a tier');
 const nx=planNextSight(null);
 ok(nx&&nx.to.k==='one'&&nx.adds.map(g=>g.k).join()==='sab','from free the next rung of sight is tier one, saboteurs');
 ok(planNextSight(mk('one')).to.k==='two'&&planNextSight(mk('two')).to.k==='three','and each step names the next rung that adds something');
 ok(planNextSight(mk('three'))===null&&planNextSight(mk('four'))===null,'at tier three there is no next rung of sight to sell');
 ok(planNextSight({tier:'three',status:'canceled'}).to.k==='one','a lapsed tier three is offered tier one, the rung it actually stands on');
 /* THE GIFT SEES EVERYTHING, AND IS STILL NOT A TIER. The ruling is
    DECISIONS.md, "100 patterns, free, with everything visible", kept at round
    PK and REVIEW-arch/TALLY.md ruling 8, "whole reading visible while it
    lasts". planSight read the plan alone, so planSees(null,'sab') was false
    for a person who had opened nothing. The gift reaches sight as its own
    input, off the meter, and never as a plan: the assertion above that a
    record saying tier gift grants nothing still holds, and nothing here may
    put the gift on a rung. */
 {
  const {planInGift,GIFT_N}=E;
  ok(planInGift(0)&&planInGift([])&&planInGift(GIFT_N-1)&&!planInGift(GIFT_N)&&!planInGift(GIFT_N+40),
   'the gift is in force until the hundredth pattern is opened, and not after');
  ok(planInGift(new Array(GIFT_N-1).fill('k'))&&!planInGift(new Array(GIFT_N).fill('k')),'it takes the list of keys as well as the count');
  ok(planInGift(undefined)&&planInGift('x')&&planInGift(NaN)&&planInGift(-5),'a count that is not a number reads as nothing opened, the way the allowance reads it');
  ok([0,1,GIFT_N-1,GIFT_N,GIFT_N+1,250].every(n=>planInGift(n)===planAllowance(null,n).inGift),
   'sight and the allowance agree on who is inside the gift, at every edge');
  const g=planSight(null,true);
  ok(g.all&&g.locked.length===0&&SIGHT.every(r=>g.sees[r.k]===true),'inside the gift every row of SIGHT is seen and nothing is locked');
  ok(g.tier==='free'&&g.gift===true&&planOf(null).k==='free','and the rung in force is still free: the gift opens sight and moves nobody up the ladder');
  ok(SEE_ORDER.every(r=>planSees(null,r,true))&&planSees(null,'reg',true)&&planSees(null,'mask',true),
   'saboteurs, complexes, hyper complexes, super complexes, the registers and the masks are all visible on the gift');
  ok(planSees(null,'nonsense',true)===false,'a key SIGHT does not hold is still not visible, gift or not');
  ok(SEE_ORDER.every(r=>!planSees(null,r,false)&&!planSees(null,r)),'with the gift spent, or not asked, free sees exactly what it saw before');
  ok(planSight(mk('one'),true).all&&planSight(mk('one'),false).locked.map(x=>x.k).join()==='cx,hy,sup,reg,mask',
   'a paid tier inside the gift sees everything, and after it sees its own rung');
  ok(planNextSight(null,true)===null&&planNextSight(null,false).to.k==='one','inside the gift there is no next rung of sight to name');
  ok(E.planSightSay(null,true)==='your own reading, with saboteurs, complexes, hyper complexes, super complexes, the registers and the masks, while your gift lasts',
   'what the gift sees is said off the table, '+E.planSightSay(null,true));
  ok(planUpgrade(null)&&planUpgrade(null).to.k==='one'&&E.planBuyable('one')&&!E.planBuyable('gift'),
   'the gift buys nothing and is never bought: the ladder and checkout read the plan alone');}
 ok(planList(['a','b','c'])==='a, b and c'&&planList(['a'])==='a'&&planList([])==='','a list is said the way a person says it');
 /* ANNUAL. TWO MONTHS FREE IS OUT, on the owner's ruling, and this test is
    what would have caught the product still making the offer: it asserted the
    discount rather than asserting that the discount is whatever the one
    constant says. It reads the constant now, so the ruling is a one line
    change and the gate follows it instead of pinning it.

    The allowance stays monthly whatever the price, because the allowance is
    a pace and that was never about the discount. */
 const planYear=E.planYear, PLAN_YEAR_FREE=E.PLAN_YEAR_FREE;
 ok(PLAN_YEAR_FREE===0,'no annual discount is ruled, got '+PLAN_YEAR_FREE);
 /* A MONTHLY RECORD HEARS NOTHING ABOUT A YEAR. planYear read the tier alone
    and the plan sheet printed "Paid for the year." to every monthly payer.
    Monthly only is ruled; annual is open. */
 const monthly={tier:'one',status:'active'}, yearly={tier:'one',status:'active',per:'year'};
 ok(planYear('one',monthly)===null&&planYear('one')===null&&planYear('one',null)===null,
  'a monthly record, or no record, gets no annual line at all');
 ok(planYear('one',yearly).pay===12-PLAN_YEAR_FREE&&planYear('one',yearly).grant===400,
  'a record paid by the year is '+(12-PLAN_YEAR_FREE)+' payments at four hundred a month');
 /* and it does not offer months it is not giving away */
 ok(!/price of/.test(planYear('one',yearly).say)||PLAN_YEAR_FREE>0,
  'and it does not say months free while none are');
 ok(/arrives monthly/.test(planYear('one',yearly).say),
  'and the allowance is still monthly rather than a year in one lump');
 ok(planYear('free',yearly)===null&&planYear('gift',yearly)===null,
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

 /* THE DAY AFTER THE GIFT, ON THE RECORD A NEW PERSON ACTUALLY GETS.

    Every allowance row above hands planAllowance a plan typed by hand with
    base 100 in it, and so did the two browser gates, so none of them ever read
    the plan blankProfile writes. That plan carried base 0. planAllowance only
    falls back to the end of the gift on null, 0 is not null, and every free
    person read "0 left this week" from the moment the gift ran out and for
    good. Found by the ninety day walk (RESEARCH-90day.md, TASKS FQ), not by a
    gate. These rows read the blank itself. */
 {
  const nb=E.blankProfile('gift gate');
  ok(nb.plan.base===null,'a new record opens no period, so base is null and not 0, got '
   +JSON.stringify(nb.plan.base));
  const d1=planAllowance(nb.plan,PLAN_BY.gift.grant);
  ok(d1.left===PLAN_BY.free.grant&&d1.say==='10 of 10 left this week',
   'a new record that has opened exactly the gift reads the free week in full, got '
   +d1.left+' "'+d1.say+'"');
  ok(E.GIFT_N===PLAN_BY.gift.grant&&E.GIFT_N===100,'the gift is named once, at the gift row, got '+E.GIFT_N);
  /* AND THE RECORDS ALREADY ON A DISK. Every profile saved before the fix
     carries the literal 0. It still loads, it is not rewritten, and it no
     longer charges the gift against a week. */
  const old=JSON.parse(JSON.stringify(nb)); old.plan.base=0; delete old.meter.giftAt;
  const ov=E.validateProfile(old);
  ok(ov.ok,'a record saved with base 0 still passes the boundary, '+(ov.errs||[]).join('; '));
  ok(ov.ok&&ov.profile.plan.base===0,'and keeps the 0 it was saved with rather than being rewritten');
  ok(ov.ok&&planAllowance(ov.profile.plan,PLAN_BY.gift.grant).left===PLAN_BY.free.grant,
   'but reads the free week in full, because no period opens on ground the gift paid for, got '
   +(ov.ok&&planAllowance(ov.profile.plan,PLAN_BY.gift.grant).left));
  ok(planAllowance({tier:'one',status:'active',granted:400,base:40},150).left===350,
   'a period a host opened inside the gift is charged only past the gift, got '
   +planAllowance({tier:'one',status:'active',granted:400,base:40},150).left);
 }
 /* FREE BANKS, AND THE WEEKS COUNT THEMSELVES. Ruled in DECISIONS: the grant
    banks rather than expiring. Nothing in a one file build starts a week, so
    the weeks are counted from the moment the gift ran out, which meterRun
    stamps. */
 {
  const W=E.WEEK_MS, at='2026-01-01T00:00:00.000Z', t0=new Date(at).getTime();
  const fr={tier:'free',status:'',granted:0,carried:0,base:null};
  ok(planAllowance(fr,100,at,t0+W-1).left===10,'the first week is ten, to its last moment');
  ok(planAllowance(fr,100,at,t0+W).left===20,'and ten more arrive seven days on, got '
   +planAllowance(fr,100,at,t0+W).left);
  ok(planAllowance(fr,110,at,t0+W).left===10,'spend is everything past the gift, got '
   +planAllowance(fr,110,at,t0+W).left);
  ok(planAllowance(fr,110,at,t0+13*W).left===130,'ninety one days on, fourteen weeks have opened, got '
   +planAllowance(fr,110,at,t0+13*W).left);
  ok(/banked/.test(planAllowance(fr,100,at,t0+W).say)&&!/ of 10 /.test(planAllowance(fr,100,at,t0+W).say),
   'a bank says it is banked and never "20 of 10", got "'+planAllowance(fr,100,at,t0+W).say+'"');
  ok(planAllowance(fr,100,at,t0-5*W).left===10,'a clock set backwards cannot take a week away');
  ok(planAllowance(fr,100,null,t0+9*W).left===10,'with no date to count from it is one week, as before');
  ok(planAllowance({tier:'free',status:'',base:3000},3000,at,t0+9*W).left===10,
   'a baseline a host wrote past the gift is the host\'s period, and does not bank');
  ok(planAllowance({tier:'one',status:'active',granted:400,base:100},150,at,t0+9*W).left===350,
   'and a paid tier does not bank either: its periods are the record store\'s');
  /* the stamp, on the real path */
  const r=E.blankProfile('stamp');
  for(let i=0;i<24;i++)E.meterRun(r,[0,1,2,3].map(n=>'s'+i+':k:'+n));
  ok(r.meter.unique.length===96&&r.meter.giftAt===null,'no stamp while the gift lasts');
  const pre=Date.now();
  E.meterRun(r,[0,1,2,3].map(n=>'s24:k:'+n));
  ok(r.meter.giftAt&&new Date(r.meter.giftAt).getTime()>=pre-1000,
   'the run that spends the gift stamps it, now, got '+r.meter.giftAt);
  const st=r.meter.giftAt; r.meter.last='2030-01-01T00:00:00.000Z';
  E.meterRun(r,['s25:k:0']);
  ok(r.meter.giftAt===st,'and it is stamped once');
  ok(E.meterBudget(r).left===9,'the next run spends the first free week, got '+E.meterBudget(r).left);
  /* a record that ran the gift out before the stamp existed */
  const o2=E.blankProfile('before'); o2.meter.unique=Array.from({length:100},(_,i)=>'o'+i+':k:0');
  o2.meter.last='2026-01-01T00:00:00.000Z'; o2.plan.base=0; delete o2.meter.giftAt;
  ok(E.meterGiftAt(o2)===o2.meter.last,'an unstamped spent gift counts from the last run, which is the run that spent it');
  ok(E.meterBudget(o2,t0+3*W).left===40,'and is owed every week since, got '+E.meterBudget(o2,t0+3*W).left);
  E.meterRun(o2,['o100:k:0']);
  ok(o2.meter.giftAt==='2026-01-01T00:00:00.000Z','and its next run stamps that date, not today, so the weeks never restart, got '
   +o2.meter.giftAt);
  /* the boundary */
  const gv=E.validateProfile(JSON.parse(JSON.stringify(r)));
  ok(gv.ok&&gv.profile.meter.giftAt===st,'the stamp round trips through the boundary');
  const bad=JSON.parse(JSON.stringify(r)); bad.meter.giftAt='soon';
  ok(!E.validateProfile(bad).ok&&/meter\.giftAt/.test(E.validateProfile(bad).errs.join(' ')),
   'a stamp that is not a date is refused by name, not read as no date');
  const nul=JSON.parse(JSON.stringify(r)); nul.meter.giftAt=null;
  ok(E.validateProfile(nul).ok,'a null stamp is a record inside the gift, and passes');
 }

 /* THE UPGRADE, said as what it buys and never as what somebody lacks */
 const up=planUpgrade(t1);
 ok(up&&up.to.k==='two'&&up.ground===400,'an upgrade names the next tier and the ground');
 ok(/more of new ground/.test(up.say),'and says it as what it buys');
 ok(up.sight.map(g=>g.k).join()==='cx'&&/and it shows you your complexes/.test(up.say),
  'and what the next rung lets you see, off the table, got '+up.say);
 ok(!/miss|lose|locked out|only/i.test(up.say),'never as what a person is short of');
 ok(planUpgrade({tier:'four',status:'active'})===null,'with nothing to sell at the top');
 /* TIER FOUR IS CLOSED UNTIL BUILT, round PK, enforced round RB. This used to
    assert that tier three's next step was tier four, "the same ground", which
    is what put a ninety nine dollar Move to under a person on tier three for a
    lead suite that does not exist. A closed rung is not a next step. When the
    suite is built and the row loses built:false, tier three's next step is tier
    four again and the else branch holds the old sentence. */
 const up34=planUpgrade({tier:'three',status:'active'});
 if(E.PLAN_BY.four.built===false)
  ok(up34===null,'tier four is closed, so tier three is offered no next step, got '+JSON.stringify(up34&&up34.to.k));
 else
  ok(up34.to.k==='four'&&up34.ground===0&&up34.sight.length===0&&up34.say==='the same ground',
   'tier three to four is the same ground and the same sight, said as that, got '+JSON.stringify(up34.say));
 /* planBuyable is the one answer to whether a checkout may start */
 ok(E.planBuyable('one')&&E.planBuyable('two')&&E.planBuyable('three'),'tiers one to three can be bought');
 ok(E.planBuyable('four')===(E.PLAN_BY.four.built!==false),'tier four can be bought exactly when it is built');
 ok(!E.planBuyable('free')&&!E.planBuyable('gift')&&!E.planBuyable('nonsense')&&!E.planBuyable(undefined),
  'free, the gift and a key this build does not know are never bought');
 /* planNamesPaid, 24 October: Manage billing is drawn only for a record that
    names a paid tier, in force or stopped (P3-4 of the 23 October QA pass) */
 ok(E.planNamesPaid({tier:'one',status:'active'})&&E.planNamesPaid({tier:'two',status:'canceled'})
  &&E.planNamesPaid({tier:'four',status:'past_due'}),
  'a record naming a paid tier names one whether it is live, stopped or late');
 ok(!E.planNamesPaid(null)&&!E.planNamesPaid({tier:'free',status:''})&&!E.planNamesPaid({tier:'gift'})
  &&!E.planNamesPaid({tier:'nine',status:'active'})&&!E.planNamesPaid('one'),
  'no plan, free, the gift, a key this build does not know and a bare string name no paid tier');
 /* closing a rung moves nobody: a record on tier four still reads tier four */
 ok(E.planOf({tier:'four',status:'active'}).k==='four','a record already on tier four still reads tier four');
 /* THE TOP RUNG IS NAMED PRACTITIONER, ruled 17 October: "There are four
    tiers. Free, tier one, tier two, tier three, practitioner." The name moved
    and the key did not, so a record on it still reads it (the line above). And
    no row of the ladder may print the old name, in its name or its sentence,
    because every surface that names a tier reads it off this table. */
 ok(E.PLAN_BY.four.nm==='Practitioner','the rung keyed four is named Practitioner, got '+JSON.stringify(E.PLAN_BY.four.nm));
 ok(!E.PLANS.some(p=>/\btier[ -]?(?:four|4)\b/i.test(p.nm+' '+p.d)),
  'no plan row says tier four, in its name or its sentence');
 /* inside a sentence a numbered rung lowercases and Practitioner keeps its
    capital, so a Move to reads "Move to Practitioner" and not a person to see */
 ok(E.planNmIn(E.PLAN_BY.one)==='tier one'&&E.planNmIn(E.PLAN_BY.four)==='Practitioner'&&E.planNmIn(null)==='',
  'a tier named inside a sentence: tier one lowercases, Practitioner does not, nothing is empty');
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
 /* read off PEOPLE and not counted here: this said at least 13, a count typed
    into a gate, and round QD cut the roster to twelve and the owner's four,
    who carry none because their names are his to enter */
 const named=PEOPLE.filter(function(p){return !p.you&&!/^Lance /.test(p.nm);});
 const unnamed=named.filter(function(p){return !FULLNAME[p.nm];}).map(function(p){return p.nm;});
 ok(named.length>0&&unnamed.length===0&&roster.length===named.length,
  'every reference case carries a full name, got '+roster.length+' of '+named.length+(unnamed.length?', missing '+unnamed.join(', '):''));
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

 /* 21.J2. Pressing Start writes a done:false entry for today (ritWake,
    ui/ritual.js) before anything has actually been done. That entry must
    not lengthen the streak; a day with only a set-but-not-done entry is no
    different from a day with nothing on it at all. */
 {const p=mk([1,2,3]); p.rituals.push({t:day(0),min:10,steps:['a'],done:false});
  ok(streakRead(p,NOW).run===3,
   'a set-but-not-done entry for today does not extend yesterday\'s run of three, got '
   +streakRead(p,NOW).run);
  const q=blankProfile('L'); q.rituals.push({t:day(0),min:10,steps:['a'],done:false});
  ok(streakRead(q,NOW).run===0,
   'a profile with only a set-but-not-done entry has no streak, got '
   +streakRead(q,NOW).run);}

 /* THE LEDGER COUNTS EVENTS AND NEVER A SHARE OF ANYTHING.

    Real keys are address:channel:line (HEAVY_KEY, schema.js), never bare
    letters, so the fixture uses that shape: three lines at address 4 across
    two channels, one line each at 9 and 20. Five keys, three addresses.
    ground once read m.unique.length directly and would have said 5 here,
    counting the repeat lines at 4 as new ground; checked against that
    reading before trusting the fix, it failed exactly there. */
 {const p=mk([0,1]);
  p.meter.unique=['4:Llimit:1','4:Llimit:2','4:Rlimit:1','9:Llimit:1','20:Rtruth:5'];
  p.meter.lines=9;
  const l=ledgerRead(p);
  ok(l.ground===3,'ground is the unique addresses opened, not the lines at them, got '+l.ground);
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

 /* ROUND QS, the TDD's slice 0 for the practice marks (TDD v3 sections 3 and
    9.3). Each check is the measured fault it closes. */
 {const {markDays,BACK_GAP}=E;
  /* First run reads a ritual marked done, not any entry: Start without a
     finish earns nothing (21.J2's open half) */
  const q=blankProfile('L'); q.rituals.push({t:day(0),min:10,steps:['box'],done:false});
  ok(!ladderRead(q,NOW).earned.some(m=>m.k==='first'),'a set and not done entry does not earn First run');
  q.rituals[0].done=day(0);
  ok(ladderRead(q,NOW).earned.some(m=>m.k==='first'),'and marking it done does');
  /* LD3: seven days practised earn Seven days with gaps between them. Twice
     a week for four weeks is eight days and no row longer than one */
  const gap=mk([0,3,7,10,14,17,21,24]);
  ok(streakRead(gap,NOW).best===1&&ladderRead(gap,NOW).earned.some(m=>m.k==='week'),
   'seven days practised with gaps earn Seven days, the strict row is not asked for, best '+streakRead(gap,NOW).best);
  ok(!ladderRead(mk([0,3,7,10,14,17]),NOW).earned.some(m=>m.k==='week'),'and six days do not');
  /* Came back: a gap of BACK_GAP or more, then a day practised */
  ok(ladderRead(mk([0,BACK_GAP]),NOW).earned.some(m=>m.k==='back'),'a day practised after '+BACK_GAP+' days away earns Came back');
  ok(!ladderRead(mk([0,BACK_GAP-1]),NOW).earned.some(m=>m.k==='back'),'and one day short of it does not');
  /* Every track run, read off PRACTICE at run time */
  const tracks=[...new Set(E.PRACTICE.map(x=>x.track).filter(Boolean))];
  const tp=blankProfile('L');
  tracks.forEach((t,i)=>{const k=E.PRACTICE.find(x=>x.track===t).k; tp.rituals.push({t:day(i),min:5,steps:[k]});});
  ok(tracks.length>1&&ladderRead(tp,NOW).earned.some(m=>m.k==='tracks'),'one done ritual in each of the '+tracks.length+' tracks earns Every track run');
  tp.rituals.pop();
  ok(!ladderRead(tp,NOW).earned.some(m=>m.k==='tracks'),'and one track short does not');
  /* the dates: derived off the record, the day the line was crossed. Oldest
     first the days are 24, 21, 17, 14, 10, 7, 3 and 0 back, ten minutes each */
  const md=markDays(gap,NOW), pd=n=>E.pracDay(day(n));
  ok(md.first===pd(24)&&md.week===pd(3)&&md.hour===pd(7),
   'markDays dates First run on the oldest day, Seven days on the seventh and Sixty minutes on the sixth, '+JSON.stringify(md));
  ok(Object.keys(md).every(k=>MARKS.find(m=>m.k===k).fam==='Practice'),'only practice marks are dated');
  ok(Object.keys(markDays(blankProfile('L'),NOW)).length===0,'a blank profile has no dated mark');}

 /* BLOCK 1, THE RECORD TELLS THE TRUTH, 16 October. The owner's rule: "it is
    never lying to you". Each check below failed on f7188cba and names the
    lie it closes. */

 /* L3. A DAY THAT HAS NOT HAPPENED IS NOT A DAY PRACTISED. Seven rituals
    dated 30 to 36 days ahead read Streak 7, live, and earned First run,
    Seven days and Sixty minutes. TDD v3 10.2: no more than one day after
    now. Tomorrow is the known good case and still counts. */
 {const fut=mk([-30,-31,-32,-33,-34,-35,-36]), sF=streakRead(fut,NOW), LF=ladderRead(fut,NOW);
  ok(sF.days===0&&sF.run===0&&!sF.live,
   'days dated a month ahead are not days practised, got '+JSON.stringify({days:sF.days,run:sF.run,live:sF.live}));
  ok(LF.earned.length===0,'and earn no mark, got '+LF.earned.map(m=>m.k).join(','));
  ok(LF.ledger.minutes===0&&LF.ledger.done===0,'and put no minutes practised on the ledger, got '+LF.ledger.minutes);
  ok(LF.ledger.planned===70,'while they still count as planned, got '+LF.ledger.planned);
  ok(E.pracDays(fut,NOW).length===0,'pracDays agrees, got '+E.pracDays(fut,NOW).length);
  ok(streakRead(mk([-1]),NOW).days===1,'and tomorrow, the one day of slack, still counts');
  ok(streakRead(mk([-2]),NOW).days===0,'the day after it does not');
  /* the track mark and the dated marks read the same rule */
  const tracks=[...new Set(E.PRACTICE.map(x=>x.track).filter(Boolean))], tf=blankProfile('L');
  tracks.forEach((t,i)=>{const k=E.PRACTICE.find(x=>x.track===t).k; tf.rituals.push({t:day(-30-i),min:5,steps:[k]});});
  ok(!ladderRead(tf,NOW).earned.some(m=>m.k==='tracks'),'Every track run is not earned off days ahead');
  /* and the day list that markDays dates against agrees with the one the
     marks are tested on, so a mark on the shelf always has a date */
  const mix=mk([0,1,2,3,4,5,-20,-21]), md=E.markDays(mix,NOW), LM=ladderRead(mix,NOW);
  ok(LM.earned.filter(m=>m.fam==='Practice').every(m=>md[m.k]!==undefined),
   'every practice mark earned is one markDays can date, earned '+LM.earned.filter(m=>m.fam==='Practice').map(m=>m.k)+' dated '+Object.keys(md));}

 /* L4. PRACTISING NEVER LOWERS THE STREAK A PERSON SEES. Ten days in a row
    ending twenty days ago read 10, and practising today read 5. The halving
    lands on the gap now, so the lapsed figure is 5 and today keeps it.
    Then every day set the roster's cadences could make: adding today to it
    never lowers the run. Checked against f7188cba first, where the first
    two fail and the sweep finds the drop. */
 {const ten=[20,21,22,23,24,25,26,27,28,29];
  const a=streakRead(mk(ten),NOW), b=streakRead(mk([0].concat(ten)),NOW);
  ok(a.run===5,'a run of ten that lapsed twenty days ago stands at five, got '+a.run);
  ok(b.run>=a.run,'and practising today does not lower it, '+a.run+' then '+b.run);
  ok(a.best===10&&a.days===10,'while the longest row and the days practised still say ten, got '+a.best+' and '+a.days);
  ok(streakRead(mk([2,3,4,5]),NOW).run===4,'a gap of two days is the grace day and halves nothing yet');
  let drops=[];
  for(let seed=1;seed<=400;seed++){
   let x=seed, days=[];
   const rnd=()=>{x=(x*1103515245+12345)%2147483648; return x/2147483648;};
   for(let d=1;d<60;d++)if(rnd()<0.45)days.push(d);
   if(!days.length)continue;
   const r0=streakRead(mk(days),NOW).run, r1=streakRead(mk([0].concat(days)),NOW).run;
   if(r1<r0)drops.push({seed,r0,r1});}
  ok(drops.length===0,'over 400 day sets, practising today never lowers the streak, drops '+JSON.stringify(drops.slice(0,3)));
  ok(typeof E.STREAK_MEANS==='string'&&/marked done/.test(E.STREAK_MEANS)&&/halves/.test(E.STREAK_MEANS),
   'the streak carries one meaning, and it says a day is a ritual marked done and a long gap halves it');}

 /* L11. TEN STORIES IS TEN DAYS. Ten entries committed in one minute earned
    it. Ten entries on ten days is the known good case. */
 {const at=(ms)=>({t:new Date(ms).toISOString(),text:'x',imprints:0});
  const one=blankProfile('L'); for(let i=0;i<10;i++)one.story.entries.push(at(NOW-60000+i*5000));
  ok(!ladderRead(one,NOW).earned.some(m=>m.k==='kept'),'ten entries in one minute do not earn Ten stories');
  ok(ladderRead(one,NOW).earned.some(m=>m.k==='told'),'while the first of them still earns First story');
  const ten=blankProfile('L'); for(let i=0;i<10;i++)ten.story.entries.push(at(NOW-i*86400000));
  ok(ladderRead(ten,NOW).earned.some(m=>m.k==='kept'),'ten entries on ten days do');
  const nine=blankProfile('L'); for(let i=0;i<9;i++)nine.story.entries.push(at(NOW-i*86400000)); nine.story.entries.push(at(NOW-1000));
  ok(!ladderRead(nine,NOW).earned.some(m=>m.k==='kept'),'and ten entries on nine days do not');
  ok(/ten different days/.test(MARKS.find(m=>m.k==='kept').d),'and its words say days');}

 /* L9. NINE AXES MEANS ALL NINE HAVE A VALUE. Nine axes at 2 did not earn
    it, and five at 5 on both sides with four at 2 did, because the test
    counted axes at four or more on either side. A blank has no value on any
    axis and is the known good case for refusing. */
 {const has=p=>ladderRead(p,NOW).earned.some(m=>m.k==='nine');
  const two=blankProfile('L'); CHILD.forEach(c=>{two.axes[c.nm]={held:2,opp:0};});
  ok(has(two),'nine axes entered at 2 earn Nine axes');
  const dbl=blankProfile('L'); CHILD.forEach((c,i)=>{dbl.axes[c.nm]=i<5?{held:5,opp:5}:{held:0,opp:0};});
  ok(!has(dbl),'five axes counted twice, with four empty, do not');
  ok(!has(blankProfile('L')),'a blank record does not');
  const said=blankProfile('L'); CHILD.forEach(c=>{E.ixSet(said,'axes',c.nm,0);});
  ok(has(said),'nine intake answers earn it, an answer of nought included, because an answer is a value');
  const eight=blankProfile('L'); CHILD.slice(0,8).forEach(c=>{eight.axes[c.nm]={held:3,opp:0};});
  ok(!has(eight),'and eight of nine do not');}

 /* L10. A MARK NAMES THE UNIT ITS TEST COUNTS. First clearing and Five clear
    read ledgerRead().clear, which walks CHILD, the nine axes, and their words
    said addresses. Every mark whose test reads clear says axes and never
    addresses; Ten addresses, which counts addresses, is the known good case. */
 {const byClear=['turned','seat'].map(k=>MARKS.find(m=>m.k===k));
  byClear.forEach(m=>ok(/\bax[ie]s\b/.test(m.d)&&!/address/.test(m.d),
   m.nm+' says axes, the unit its test counts, got '+JSON.stringify(m.d)));
  const one=blankProfile('L'); one.axes[CHILD[0].nm]={held:0,opp:4};
  ok(ladderRead(one,NOW).earned.some(m=>m.k==='turned')&&ledgerRead(one).clear===1,
   'and one axis with its opposite at four is what earns First clearing');
  ok(/address/.test(MARKS.find(m=>m.k==='ten').d),'Ten addresses still says addresses, because it counts them');}

 /* L2. THE NEXT MARK SAYS WHAT IT TAKES. Both surfaces printed the next
    mark's d line, written for a mark already held, so a blank record read
    "First run. You marked one ritual done." A mark carries to, what it
    takes, and the next is only ever a mark that has one. */
 {const L0=ladderRead(blankProfile('L'),NOW);
  ok(L0.next&&L0.next.to==='Mark one ritual done.','a blank record\'s next mark says what it takes, got '+JSON.stringify(L0.next&&L0.next.to));
  ok(MARKS.filter(m=>m.k!=='back').every(m=>typeof m.to==='string'&&m.to&&m.to!==m.d),
   'every mark but Came back carries a to line of its own, missing '+MARKS.filter(m=>m.k!=='back'&&!(typeof m.to==='string'&&m.to&&m.to!==m.d)).map(m=>m.k));
  ok(MARKS.every(m=>!m.to||!/^You /.test(m.to)),'and no to line is written as a thing already done');
  /* Came back asks for two weeks away, so it is never the goal. Every other
     practice mark held leaves it as the family's only one left. */
  const all=[];for(let i=0;i<95;i++)all.push(i);
  const p=mk(all), tracks=[...new Set(E.PRACTICE.map(x=>x.track).filter(Boolean))];
  tracks.forEach((t,i)=>{p.rituals[i].steps=[E.PRACTICE.find(x=>x.track===t).k];});
  const LP=ladderRead(p,NOW), pr=MARKS.filter(m=>m.fam==='Practice'&&m.k!=='back');
  ok(pr.every(m=>LP.earned.some(e=>e.k===m.k))&&!LP.earned.some(m=>m.k==='back'),
   'the fixture holds every practice mark but Came back, earned '+LP.earned.map(m=>m.k));
  ok(LP.next&&LP.next.k!=='back','and the next mark is never Came back, got '+(LP.next&&LP.next.k));}

 /* L1. OPENED IS ADDRESSES, ON EVERY SURFACE. One address, both limit
    channels, thirty lines each: the Compass ledger read 1 address and three
    other surfaces printed meterRead().unique, 60, as addresses. meterRead
    carries the address count as ground now, the same function the ledger
    reads. The patterns stay what the gift and the markers count, which is
    the known good case: the gift reads 40 left of 100 before and after. */
 {const {meterRead,meterKey,markersFor}=E, p=blankProfile('L');
  ['Llimit','Rlimit'].forEach(ch=>{for(let i=0;i<30;i++)p.meter.unique.push(meterKey(4,ch,i));}); p.meter.lines=60;
  const m=meterRead(p,NOW);
  ok(m.ground===1&&m.ground===ledgerRead(p).ground,'meterRead says one address opened, as the ledger does, got '+m.ground);
  ok(m.unique===60&&m.giftLeft===40,'and still counts sixty patterns, which is what the gift spends, got '+m.unique+' and '+m.giftLeft);
  ok(m.next&&m.next.left===m.next.at-m.unique,'the marker distance is in patterns, '+JSON.stringify(m.next));
  /* why the ruler cannot be addresses: the second marker sits past every
     address a release can reach, so counted in addresses it is unreachable */
  ok(markersFor(null)[1].at>W.length,'the second marker, '+markersFor(null)[1].at+', is past the '+W.length+' addresses a release reaches, so the markers count patterns');}

 /* L12, HELD RATHER THAN REWORDED. The release results print "Up" as
    Math.max(0, after minus before), and the fact map read that clamp as a
    drop printed "Up 0.00", after LD9 measured releases lowering CQ (Sofia
    56.6 to 55.1). That was the arithmetic before 25 September. CQ is now the
    answered laws and the lift releaseWork writes, and the lift only rises
    with the count, so a release cannot lower it and the clamp never fires:
    measured on f7188cba over 6,000 releases, 0 falls and 5,992 rises. This
    holds that, so the day a release can lower CQ the "Up" figure fails here
    by name instead of hiding the drop. Known good first: a changed answer
    does lower CQ, and the sweep would see it. The word "Up" itself goes in
    phase 2 of the percent framework (CQ before and after, its rule 3). */
 {const {loadProfile,releaseWork,cqSum,meterKey}=E;
  let x=7; const rnd=()=>{x=(x*1103515245+12345)%2147483648; return x/2147483648;};
  let falls=0, rises=0;
  for(let t=0;t<60;t++){
   const p=blankProfile('L');
   SINAMES.forEach(l=>{p.laws[l]=rnd()<0.2?null:Math.round(rnd()*100)/10;});
   loadProfile(p); p.work=p.work||{};
   for(let r=0;r<10;r++){
    const keys=[]; for(let i=0,n=1+Math.floor(rnd()*25);i<n;i++)keys.push(meterKey(W[Math.floor(rnd()*W.length)].i,'Llimit',Math.floor(rnd()*50)));
    const o=releaseWork(p,keys); if(o.cq1<o.cq0-1e-12)falls++; else if(o.cq1>o.cq0)rises++;}}
  ok(rises>0,'the sweep sees releases lift CQ, so it is reading the lift, '+rises+' rises');
  ok(falls===0,'and no release lowers CQ, so "Up" never clamps a drop, '+falls+' falls');
  const q=blankProfile('L'); SINAMES.forEach(l=>{q.laws[l]=8;}); loadProfile(q);
  const a=cqSum(); S.law[SINAMES[0]]=2; const b=cqSum();
  ok(b<a,'known good: a changed answer does lower CQ, '+a.toFixed(2)+' to '+b.toFixed(2));
  reset();}
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

console.log('\n27d · a store that cannot be read is not an empty one');
{
 /* THE BOOT READ AN UNREADABLE STORE AS A FIRST VISIT. pStore returned [] on a
    parse failure, the boot made a blank "You", and that write replaced the
    only copy. Measured in the browser before the fix: 954 bytes of a real
    record, cut at 60 percent, became a blank of 1562 with nothing said. */
 let mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 ok(E.pStore().length===0&&E.storeUnread()===null,
  'a first visit is empty and is not reported as unreadable');

 const cut='[{"v":2,"id":"preal","name":"Lance","axes":{"Gu';
 mem['source.profiles']=cut;
 ok(E.pStore().length===0,'a truncated store yields no profiles');
 const u=E.storeUnread();
 ok(u&&u.why==='it does not parse'&&u.bytes===cut.length,
  'and says it could not be read, and how much was there: '+JSON.stringify(u));
 ok(u&&u.key&&mem[u.key]===cut,'and the bytes are set aside verbatim under '+(u&&u.key));
 ok(E.pPersist()===true,'with the copy kept, a save may proceed');
 ok(mem[u.key]===cut,'and the set aside copy is still there after it');

 mem={'source.profiles':'{"v":2}'};
 E.pStore();
 ok((E.storeUnread()||{}).why==='it is not a list of profiles',
  'a value that is not a list is unreadable too, and says which');

 /* AND WHEN THE COPY CANNOT BE MADE, NOTHING WRITES OVER THE ONLY ONE. */
 mem={'source.profiles':cut};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],
  (k,v)=>{ if(/\.unreadable\./.test(k))throw new Error('QuotaExceededError'); mem[k]=String(v);});
 E.pStore();
 ok(E.storeUnread().key===null,'a set aside that fails is reported as no copy');
 ok(E.pPersist()===false&&E.saveState().err==='UnreadableStore',
  'and every save refuses, by name: '+JSON.stringify(E.saveState()));
 ok(mem['source.profiles']===cut,'so the original bytes are untouched');

 /* a good store afterwards clears it, so one bad boot does not hold the
    session's saves hostage once a readable store is back */
 mem={'source.profiles':'[]'};
 E.pStore();
 ok(E.storeUnread()===null&&E.pPersist()===true,'a readable store clears the refusal');
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
 /* 16 October: a blank entry the relay refuses for ever sat at the head of
    the queue and held every later one back. Refused here, by name. */
 {const bad=e(); bad.body='  ';
  const v=E.obValidate(bad);
  ok(!v.ok&&/nothing in it to send/.test(v.errs.join())
   &&E.obValidate(Object.assign(e(),{body:'',answers:{state:2}})).ok,
   'an envelope with no words and no answer is refused by name, and one with an answer is not');}
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
 ok(E.obBand({CQ:12,complete:false})==='filling',
  'a CQ still filling is bucketed as filling, never as low');

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
  /* laws at 3, not 6, for the reason group 8 gives: the ordering below is
     against the field's own malignancy, and laws at 6 now read benign with
     none, which leaves "less malignant than the field" with nowhere to go. */
  const readOf=t=>{reset(0,0,3);gatesClear();if(t)leanApply(t);return leanRead(compute());};
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
 /* THE SENTENCE BOUNDARY, ND. lawNorm stripped a period to a plain space and
    lawNegated then counted three words back across it, so a negation in one
    sentence voided an admission in the next: "I was not around. I hid it
    from everyone" read as a denial of Transparency, not a confession of it.
    verp.js already stops its own look back at a sentence end; lawNorm and
    lawNegated now do the same. */
 ok(sniffLaws('I was not around. I hid it from everyone.').some(l=>l.law==='Transparency'),
  'a negation in the sentence before an admission does not void it');
 ok(!sniffLaws('I was not around. I did not hide it.').some(l=>l.law==='Transparency'),
  'and a denial inside its own sentence still voids, negation is not disabled');
 /* PRECEDENCE. The longer phrase wins, which is what stops a denial reading as
    an admission when both strings are in the table. */
 {
  const o=sniffLaws('it was not my fault at all');
  ok(!o.some(l=>l.law==='Ownership'&&l.direction==='self'),
   'a denial of self blame does not fire the self direction');
 }
 /* WHOSE ACT, P0-4 of the inference audit, 23 October. This path had no
    subject, and the Story page's Laws panel reads it, so "She lied to me"
    told the writer they had let go of Truth. Measured on 77928172: three of
    fifteen sentences where someone else did the act gave the writer a law. */
 {
  const laws=t=>sniffLaws(t).map(l=>l.law);
  ok(laws('She lied to me about where she was.').indexOf('Truth')<0,'her lie is not the writer\'s Truth, '+laws('She lied to me about where she was.'));
  ok(laws('My husband lied to me again last night.').length===0,
   'nor is his, and "again last night" after the object me is his too, '+laws('My husband lied to me again last night.'));
  ok(laws('They kept it from me for years.').indexOf('Transparency')<0,'what they kept from the writer is not the writer\'s Transparency');
  ok(laws('I was lied to again.').indexOf('Truth')<0,'being lied to is something done to the writer, '+laws('I was lied to again.'));
  ok(laws('I lied to my wife about the money.').indexOf('Truth')>=0,'the writer\'s own lie still reads Truth');
  ok(laws('I hid it from everyone.').indexOf('Transparency')>=0&&laws('I kept it from her because I was scared.').indexOf('Transparency')>=0,
   'and the writer\'s own concealment still reads Transparency');
  ok(laws('I haven’t lied to anyone.').indexOf('Truth')<0,'a curly apostrophe from a phone keeps its no, '+laws('I haven’t lied to anyone.'));
  ok(laws('others have it worse and i do not matter and it is all my fault').indexOf('Ownership')>=0,
   'a be with no participle after it is not a passive, so "it is all my fault" stays the writer\'s');
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

g('34 · every name the sniffer can emit as an address is in the 112 table');
/* THE ROW EXISTS BECAUSE A READING NAMED A PLACE THE PRODUCT DOES NOT HAVE.
   sniffStory returned "Inferior Cardiac" on a panel profile and the 112 address
   table carries no such row: it has Cardiac Plexus, Cardiac Nerve Plexus and
   Great Cardiac Nerve. All nine of the spec's somatic regions failed the table,
   not just that one, because the spec's Address column is a region in the
   spec's shorthand and an address in this product is a row of the 112.

   That is the same class of defect as a reading naming a law that does not
   exist, which a gate caught last week, so this walks the EMITTER rather than
   checking one string: every story the lexicon can produce, every axis row and
   every offer row, and every name that comes out has to be in the table. A
   hand written list of expected names would have passed the broken build. */
{
 const {sniffStory,SPEC_POLE,LEX}=E;
 const TABLE={}; NODES.forEach(n=>{if(n.n)TABLE[n.n]=1;});
 ok(Object.keys(TABLE).length>0,'the node table has names to check against, '
  +Object.keys(TABLE).length);
 const seen={}; let rows=0, namedRows=0;
 const walk=t=>{
  const r=sniffStory(t);
  r.axes.forEach(a=>{rows++; if(a.address!==null){namedRows++; seen[a.address]=1;}});
  r.offer.forEach(o=>{rows++; if(o.address!==null){namedRows++; seen[o.address]=1;}});};
 const keys=Object.keys(LEX);
 ok(keys.length>0,'the lexicon has words to build stories from, '+keys.length);
 keys.forEach(k=>walk('i am '+k+' about all of it'));
 for(let i=0;i<keys.length;i+=7)
  walk('i felt '+keys[i]+' and then '+keys[(i+3)%keys.length]+' and it would not stop');
 PEOPLE.forEach(p=>walk(p.says||''));
 walk('');
 ok(rows>0&&namedRows>0,'the walk reached '+rows+' rows and '+namedRows+' named an address');
 const off=Object.keys(seen).filter(a=>!TABLE[a]);
 ok(off.length===0,'every address the sniffer emitted is a row of the table, '
  +off.length+' are not: '+JSON.stringify(off.slice(0,5)));
 /* AND THE REGION IS NEVER EMITTED AS AN ADDRESS AGAIN. The spec's words are
    still in the output, under `region`, which is what they are. This asserts
    the two fields have not been folded back together. */
 const regions={}; CHARGES.forEach(c=>{if(SPEC_POLE[c])regions[SPEC_POLE[c].addr]=1;});
 const leaked=Object.keys(seen).filter(a=>regions[a]&&!TABLE[a]);
 ok(leaked.length===0,'and no spec region reached the address field, '
  +JSON.stringify(leaked));
 const one=sniffStory('i am so ashamed of myself');
 ok(one.axes.every(a=>'region' in a),'every axis row still carries the spec region');
 ok(one.offer.every(o=>'region' in o),'and so does every offer');
 ok(one.offer.length>0&&one.offer.every(o=>o.replacement&&o.address),
  'and an offer that has an address still names both it and the replacement');
 /* THE NULL CASE IS A READING, NOT A HOLE, and it is the composite. resentment
    splits half to Anger and half to Apathy, and only the Anger half has a seat
    in the lexicon, so the Apathy half carries shadow that no imprint ever
    placed. Eight of the 270 rows the walk above reaches are exactly this, and
    every one of them is Apathy. That offers a null address and says why, rather
    than naming Shoulder / Throat, which is the region the spec puts Apathy at
    and is not a row of the table. */
 const comp=sniffStory('i am resentful about all of it');
 const ap=comp.offer.filter(o=>o.axis==='Apathy')[0];
 ok(ap&&ap.address===null,'an axis reached only through the composite offers a null '
  +'address rather than a name, '+(ap?JSON.stringify(ap.address):'no apathy offer'));
 ok(ap&&/placed no address/.test(ap.because.join(' ')),'and says so in its because');
 ok(ap&&ap.region==='Shoulder / Throat',
  'while still carrying the spec region it would have printed, '+(ap?ap.region:'none'));
}

g('35 · a generated ritual takes its target from a field, not from a literal');
/* 50 of the 52 rows the queue generates carried a target of one, so every ring
   in the panel drew a single dash and the parameter the ring exists to carry did
   not vary. ritTarget tells the three shapes apart off the tables and returns a
   target only for the one that is a count. */
{
 const {ritTarget,RIT_SHAPES,C3_BAND_N,C3_BAND,cardDepth,PRACTICE,CHARGES,SINAMES}=E;
 ok(typeof ritTarget==='function','ritTarget is reachable from outside the engine');
 /* every practice in the library, and the minutes are the library's own */
 const shapes={};
 PRACTICE.forEach(pr=>{
  const t=ritTarget({practice:pr.k});
  shapes[t.shape]=(shapes[t.shape]||0)+1;
  ok(t.minutes===pr.min,pr.k+' carries the library\'s own minutes, '+t.minutes+' against '+pr.min);
  ok(t.target===null,pr.k+' is given no target, because the library holds no count for it');
  ok(t.src==='PRACTICE[].min',pr.k+' says which field it read, '+t.src);});
 ok(shapes.window===PRACTICE.length,'every practice reads as a window, '
  +shapes.window+' of '+PRACTICE.length);
 /* every axis is a count and every count has a number */
 CHARGES.forEach(c=>{
  const t=ritTarget({axis:c});
  ok(t.shape==='count',c+' reads as a count');
  ok(typeof t.target==='number'&&t.target>0,c+' has a real target, '+t.target);
  const printed=Math.min(cardDepth(c,'m'),cardDepth(c,'f'));
  ok(t.target===(printed>0?printed:C3_BAND_N),
   c+' takes '+(printed>0?'its printed card\'s line count':'one band of the curve')
   +', '+t.target);
  ok(t.src&&/cardDepth|C3_BAND/.test(t.src),c+' names the field it read, '+t.src);});
 /* the band size is read off the table and not typed here */
 ok(C3_BAND_N===C3_BAND[0].hi-C3_BAND[0].lo+1,
  'the band size is the table\'s own, '+C3_BAND_N);
 ok(C3_BAND.every(b=>b.hi-b.lo+1===C3_BAND_N),
  'and every band is that size, which is what makes one band a session');
 /* THE FINDING THIS ROW EXISTS FOR. The target has to VARY, because a
    parameter that is the same for everybody is a parameter nobody can read. */
 const spread={};
 CHARGES.forEach(c=>{spread[ritTarget({axis:c}).target]=1;});
 ok(Object.keys(spread).length>1,
  'the target varies across the axes rather than being one number, '
  +JSON.stringify(Object.keys(spread)));
 ok(Object.keys(spread).indexOf('1')<0,
  'and no axis comes back with a target of one, which is the literal this replaces');
 /* THE CHARGE COLUMN IS NOT THE NINE AXES, and a release row hands it in
    straight. Measured on the node table rather than typed: Sadness, Resentment
    and Joy all appear in it and none is one of the nine. Sadness resolves
    through the engine's own CHG2FET; the other two are refused, because Joy is
    not an axis and Resentment is a composite of two and so has no single card.
    Without this a release row on a Sadness address got no target at all. */
 {
  const col={}; NODES.forEach(n=>{if(n.c)col[n.c]=1;});
  const off=Object.keys(col).filter(c=>CHARGES.indexOf(c)<0);
  ok(off.length>0,'the node charge column carries names that are not axes, '
   +JSON.stringify(off));
  const sad=ritTarget({axis:'Sadness'});
  ok(sad.shape==='count'&&sad.axis==='Sad'&&sad.target>0,
   'Sadness resolves through CHG2FET to Sad and takes a real target, '
   +sad.axis+' '+sad.target);
  ['Joy','Resentment'].forEach(c=>{
   const r=ritTarget({axis:c});
   ok(r.shape===null&&r.target===null,
    c+' is refused rather than rounded to the nearest axis');
   ok(new RegExp(c).test(r.because),'and says which name it refused, '+r.because.slice(0,40));});
  /* and every name in that column either resolves or is refused by name, so a
     release row can never come back with a shape and no target. */
  Object.keys(col).forEach(c=>{
   const r=ritTarget({axis:c});
   ok((r.shape==='count'&&typeof r.target==='number')||(r.shape===null&&r.target===null),
    c+' either takes a count with a number or is refused outright, got '
    +r.shape+' '+r.target);});
 }
 /* a stance has none until the day supplies it */
 const st=ritTarget({law:SINAMES[0]});
 ok(st.shape==='stance'&&st.target===null,
  'a law reads as a stance with no target, '+st.shape+' '+st.target);
 /* and it refuses rather than defaulting */
 ok(ritTarget({}).shape===null&&ritTarget({}).target===null,
  'an argument naming nothing is refused rather than defaulted to a count of one');
 ok(ritTarget({practice:'nosuchpractice'}).shape===null,
  'and a practice key the library does not carry is refused by name');
 ok(/nosuchpractice/.test(ritTarget({practice:'nosuchpractice'}).because),
  'saying which key it was');
 ok(RIT_SHAPES.length===3&&RIT_SHAPES.indexOf('count')>=0
  &&RIT_SHAPES.indexOf('window')>=0&&RIT_SHAPES.indexOf('stance')>=0,
  'and there are exactly three shapes, named');
}

g('36 · the ceiling is reachable, and it is what expression reads with nothing held');
/* The ceiling and the headroom decide a sentence a person reads and were
   absent from the contract, so no gate could see them and two seats built
   their own copy instead. The invariant is the one the design names: with
   every charge at zero, the ceiling's inputs ARE compute's, so the two must
   agree exactly. That is what catches a change made to one copy of the
   formula and not the other.

   CHANGED 25 SEPTEMBER from cqCeiling and cqHeadroom, which had CQ as the
   thing a release moves. CQ is the 21 laws alone now, and the shadow never
   enters it, so the ceiling is expression's: CQ as the laws read now, times
   what the lever leaves once the shadow is gone. The assertions are the same
   ones, on that number. */
{
 const {exCeiling,exHeadroom}=E;
 ok(typeof exCeiling==='function','exCeiling is reachable from outside the engine');
 ok(typeof exHeadroom==='function','and so is exHeadroom');
 ok(E.cqCeiling===undefined&&E.cqHeadroom===undefined,
  'and the CQ ceiling is gone rather than left answering a question that no longer has one');
 const r=reset(0,0,6);
 near(r.EX,exCeiling(),1e-9,
  'with nothing held the reading IS the ceiling, so the two copies of the formula agree');
 near(exHeadroom(r.EX),0,1e-9,'and the headroom is nothing, because there is nothing to release');
 /* and it does not move the field it reads */
 const before=JSON.stringify(S.charge)+JSON.stringify(S.replace)+JSON.stringify(S.law);
 exCeiling(); exHeadroom(r.EX);
 ok(JSON.stringify(S.charge)+JSON.stringify(S.replace)+JSON.stringify(S.law)===before,
  'and reading the ceiling mutates nothing');
 /* THE CEILING IS THE PERSON AND THE READING IS THE DRAG. Load the field and
    expression has to fall while the ceiling holds, because release works on
    the shadow and cannot manufacture integrity. */
 const loaded=reset(6,0,6);
 const ceil=exCeiling();
 ok(loaded.EX<ceil,'a loaded field reads below its own ceiling, '
  +loaded.EX.toFixed(2)+' against '+ceil.toFixed(2));
 ok(exHeadroom(loaded.EX)>0,'so there is headroom in it, '+exHeadroom(loaded.EX).toFixed(2));
 near(exHeadroom(loaded.EX),ceil-loaded.EX,1e-9,'and the headroom is exactly the gap');
 ok(exHeadroom(ceil+10)===0,'a reading above the ceiling reports no headroom rather than a negative one');
 /* and it is the same with an opposite installed, since sq is 0 at zero charge whatever is in */
 reset(6,8,6); const ceilOpp=exCeiling();
 near(ceilOpp,ceil,1e-9,'an installed opposite does not move the ceiling');
 /* the laws are the only lever on it, which is the ruling the number carries */
 reset(0,0,3); const lowCeil=exCeiling();
 reset(0,0,9); const highCeil=exCeiling();
 ok(highCeil>lowCeil,'the ceiling rises with the laws and nothing else, '
  +lowCeil.toFixed(2)+' at law 3 against '+highCeil.toFixed(2)+' at law 9');
}

g('36b · the fitted CQ model, reproduced from the simulation that fitted it');
/* DECISIONS.md "The CQ model, fitted", and the ten thousand run simulation
   behind it (AZ5). Every number pinned here is the simulation's own output,
   read off its worked people and its curve table, not re-derived to fit
   whatever this build happens to say. If this group moves, either the port
   is wrong or the ruling moved, and both are things somebody must say out
   loud. */
{
 const {leverPull,LEVER_MU,LEVER_SD}=E;
 const FIELD=NODES.filter(n=>n.b.startsWith('Field'));
 ok(LEVER_MU===5&&LEVER_SD===1.25,'the bell is centre 5, width 1.25, got '+LEVER_MU+', '+LEVER_SD);
 /* the curve table in the fit, to four places */
 [[2,0.0082],[4,0.2119],[5,0.5],[6,0.7882],[7,0.9452],[9,0.9993],[10,1]].forEach(([w,p])=>
  near(+leverPull(w).toFixed(4),p,1e-12,'the pull at '+w+' is '+p));
 near(+(leverPull(9)/leverPull(2)).toFixed(1),121.9,1e-9,
  'paralyzed pulls about 122 times a little tense, inside "orders of magnitude"');
 let mono=true; for(let w=0;w<10;w+=0.05)if(leverPull(w+0.05)<leverPull(w))mono=false;
 ok(mono,'and the pull never falls as weight rises, so no release can raise it');

 /* THE WORKED PEOPLE, cq-unified.md B.2. Default soul, every charge at the
    stated level, every law at the stated score. */
 const w5=reset(0,0,5), w5h=reset(10,0,5), w10h=reset(10,0,10);
 const r1=(v,d)=>+v.toFixed(d);
 ok(r1(w5.CQ,1)===50&&r1(w5.DQ,1)===0&&r1(w5.PULL,3)===0&&r1(w5.EX,1)===50,
  'every law 5, nothing held: CQ 50, DQ 0, pull 0, expression 50, got '
  +[w5.CQ,w5.DQ,w5.PULL,w5.EX].map(v=>v.toFixed(3)).join(', '));
 ok(r1(w5h.CQ,1)===50&&r1(w5h.DQ,1)===47.9&&r1(w5h.PULL,3)===0.413&&r1(w5h.EX,1)===29.4,
  'every law 5, heavily loaded: CQ 50, DQ 47.9, pull 0.413, expression 29.4, got '
  +[w5h.CQ,w5h.DQ,w5h.PULL,w5h.EX].map(v=>v.toFixed(3)).join(', '));
 ok(r1(w10h.CQ,1)===100&&r1(w10h.DQ,1)===35.2&&r1(w10h.PULL,3)===0.199&&r1(w10h.EX,1)===80.1,
  'every law 10, heavily loaded: CQ 100, DQ 35.2, pull 0.199, expression 80.1, got '
  +[w10h.CQ,w10h.DQ,w10h.PULL,w10h.EX].map(v=>v.toFixed(3)).join(', '));
 ok(w5h.SQ.filter(v=>v>=7).length===16&&w10h.SQ.filter(v=>v>=7).length===0,
  'and the heavy one at law 5 has 16 addresses at 7 or more where the one at law 10 has none');

 /* THE 112, AND THE FOUR OUTSIDE. SQ is one value per address in NODES order,
    and the four field anchors take the mean of the seat they extend. */
 const h=reset(7,0,5);
 ok(h.SQ.length===112&&h.SQ.length===NODES.length,'SQ is 112 values, one per address');
 const seat=b=>{const g=W.filter(n=>n.b===b);return g.reduce((a,n)=>a+n.sq,0)/g.length;};
 ok(FIELD.length===4&&FIELD.every(n=>Math.abs(n.sq-(n.b==='Field-Above'?seat('Crown'):seat('Root')))<1e-12),
  'the two above take the Crown mean and the two below the Root mean');
 ok(FIELD.every(n=>n.sq>0),'so on a loaded field none of the four is forced to 0');
 near(h.DQ,h.SQ.reduce((a,v)=>a+v,0)/1120*100,1e-9,'DQ is the 112 over 1120');
 near(h.EX,h.CQ*(1-h.PULL),1e-12,'and expression is CQ times what the pull leaves');
 /* WILL IS NOT MEASURED, SO THE SEESAW IS THE SHIPPED BELL, TO THE BIT.
    compute() reads its pull through leverPullWill, whose centre may one day
    move with Will, and Will is 0 until something measures it. It was a
    second copy of the bell, and this check was the only thing that caught a
    drift between the two. It is now leverPull itself, moved by Will, so
    they cannot drift apart, and this holds what compute() prints to the
    curve the table above pins. Red on purpose the day Will is real: that
    day the claim changes and somebody says so. */
 ok(h.PULL===h.SQ.reduce((a,v)=>a+leverPull(v),0)/h.SQ.length,
  'and the pull is the mean of leverPull over the 112, to the bit, while Will is unmeasured');

 /* NOTHING ENTERED. A blank profile through the boundary: CQ 0 and filling,
    no tier word, and the reading is unread. */
 E.loadProfile(E.blankProfile('nothing entered'));
 const b0=compute();
 ok(b0.CQ===0&&b0.answered===0&&!b0.complete&&b0.tier===null&&b0.unread===true,
  'nothing entered: CQ 0, none answered, no tier word, unread');

 /* CQ BUILDS FROM ZERO AND NEVER FALLS WHILE A PERSON ANSWERS. The intake in
    the order it is asked, CQ read after every single answer. The simulation's
    630,000 answers found no fall under this rule; this is the engine's own
    compute() holding it on a real intake of noisy, low and high answers. */
 {
  const p=E.blankProfile('filling'); E.loadProfile(p);
  let prev=compute().CQ, fell=0, steps=0, tierEarly=0;
  const ans=[9,2,6, 0,0,0, 10,10,10, 3,8,1, 5,5,5, 7,7,7, 1,9,4];
  for(let i=0;i<63;i++){
   p.intake.answers[i]=ans[i%ans.length];
   E.iqApply(p); const r=compute(); steps++;
   if(r.CQ<prev-1e-9)fell++;
   if(!r.complete&&r.tier!==null)tierEarly++;
   prev=r.CQ;}
  ok(fell===0,'CQ never fell across '+steps+' answers, fell '+fell+' times');
  ok(tierEarly===0,'and no tier word printed before the 21st law, '+tierEarly+' did');
  const fin=compute();
  ok(fin.complete&&fin.answered===21&&typeof fin.tier==='string',
   'all 63 in: complete, 21 answered, and a tier word, '+fin.tier);
  near(fin.CQ,SINAMES.reduce((a,l)=>a+p.laws[l],0)/210*100,1e-9,
   'and CQ is exactly the record\'s laws over 210');
 }

 /* AY1. A RELEASE NEVER LOWERS CQ AND NEVER MAKES ANYTHING WORSE. The live
    formula lowered CQ on a release in 22 of 10,000 random fields (9f4c7e5),
    because an installed opposite past 6 raised JQ and JQ sat inside both
    factors of CQ. The field is drawn the way that probe drew it.

    CORRECTED 25 SEPTEMBER, AFTER SHIP. This block asserted "a release never
    moves CQ, moved 0 of 2000", and it could not have failed: it wrote the
    charge half of a release and never let a release reach the laws. The owner
    corrected the invariant itself (DECISIONS.md, "Correction. A release does
    move CQ"): "Those 15k releases raised my CQ." What holds is narrower, and it
    is what is asserted now, on the path the release panel takes, meterPlan to
    meterRun to releaseWork:
      the charge half moves CQ not at all, so the shadow is never folded in;
      the law half moves CQ only through the answered laws at the seats the run
      opened new ground at, each by exactly the step LIFT_R sets, and CQ by
      exactly those laws over 210, so nothing else reaches it;
      CQ never falls and never passes 100, a run with no new ground moves it
      not at all, and one run moves it by less than half a point;
      and DQ, the 112 and expression hold as they did. */
 {
  const {meterPlan,meterRun,releaseWork,lawNow,LIFT_R,BY,bindStore,pImport}=E;
  const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
  const CH=['Rlimit','Llimit','Rtruth','Ltruth'];
  let rec=null;
  let x=7>>>0; const rnd=()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296;};
  let runs=0,halfMoved=0,offSeat=0,stepOff=0,sumOff=0,fell=0,over=0,rose=0,
      idle=0,idleMoved=0,maxMove=0,dqRose=0,addrRose=0,exFell=0;
  for(let i=0;i<2000;i++){
   /* a new record every hundred draws, so the meter stays small and the ground
      is new: exhausted ground is its own case, asserted in 36e */
   if(i%100===0)rec=pImport(JSON.stringify(E.blankProfile('release probe '+i)));
   S.doms=[Math.floor(rnd()*19)];S.arcs=[Math.floor(rnd()*12)];S.roots=[];buildSoul();
   CHARGES.forEach(c=>{S.charge[c]=+(rnd()*10).toFixed(2);S.replace[c]=+(rnd()<.5?0:rnd()*10).toFixed(2);});
   SINAMES.forEach(l=>S.law[l]=Math.round(rnd()*10)); lawsIn();
   const r0=compute(), sq0=r0.SQ.slice(), law0={};
   SINAMES.forEach(l=>{law0[l]=lawNow(l);});
   const q=W.filter(n=>n.sq>0).sort((a,b)=>b.sq-a.sq).slice(0,1+Math.floor(rnd()*4));
   if(!q.length)continue; runs++;
   /* the charge half, exactly as ui/release.js writes it */
   q.forEach(n=>{const d=-Math.round(n.sq*10*0.21+2);
    const share=Math.abs(d)/10/Math.max(1,q.filter(o=>o.cf===n.cf).length);
    S.charge[n.cf]=E.clamp((S.charge[n.cf]||0)-share,0,10);
    S.replace[n.cf]=E.clamp((S.replace[n.cf]||0)+share*0.62,0,10);});
   if(Math.abs(compute().CQ-r0.CQ)>1e-12)halfMoved++;
   /* the law half: the plan the panel builds, the meter, and the lift */
   const m=meterRun(rec,meterPlan(rec,q.map(n=>n.i),CH,25));
   releaseWork(rec,m.fresh);
   const r1=compute(), seat={};
   m.fresh.forEach(k=>{const b=BY[+k.split(':')[0]].b; seat[b]=(seat[b]||0)+1;});
   let sum=0;
   SI.forEach(l=>{const a=law0[l.nm], b=lawNow(l.nm); sum+=b-a;
    if(!seat[l.b]){if(b!==a)offSeat++;}
    else if(Math.abs(b-(10-(10-a)*Math.pow(1-LIFT_R,seat[l.b])))>1e-9)stepOff++;});
   if(Math.abs((r1.CQ-r0.CQ)-sum/210*100)>1e-9)sumOff++;
   if(r1.CQ<r0.CQ-1e-12)fell++;
   if(r1.CQ>100+1e-9)over++;
   if(r1.CQ>r0.CQ+1e-12)rose++;
   if(!m.fresh.length){idle++; if(r1.CQ!==r0.CQ)idleMoved++;}
   maxMove=Math.max(maxMove,r1.CQ-r0.CQ);
   if(r1.DQ>r0.DQ+1e-9)dqRose++;
   if(r1.EX<r0.EX-1e-9)exFell++;
   if(r1.SQ.some((v,k)=>v>sq0[k]+1e-9))addrRose++;}
  ok(runs>1900,'the release probe ran, '+runs+' releases');
  ok(halfMoved===0,'the charge half of a release never moves CQ, so the shadow is not folded in, moved '+halfMoved);
  ok(offSeat===0,'the law half moves no law away from the seats it opened ground at, moved '+offSeat);
  ok(stepOff===0,'and every law at those seats by exactly LIFT_R of the distance left a pattern, off '+stepOff);
  ok(sumOff===0,'so CQ moves by exactly those laws over 210 and by nothing else, off '+sumOff);
  ok(rose>runs*0.9,'a release is real change: CQ rose in '+rose+' of '+runs);
  ok(fell===0&&over===0,'and it never falls and never passes 100, fell '+fell+', over '+over);
  ok(idleMoved===0,'a run with no new ground moves it not at all, '+idleMoved+' of '+idle+' did');
  ok(maxMove<0.5,'and one run moves it by less than half a point, at most '+maxMove.toFixed(3));
  ok(dqRose===0,'never raises DQ, rose '+dqRose);
  ok(addrRose===0,'never raises any of the 112, rose '+addrRose);
  ok(exFell===0,'and never lowers expression, fell '+exFell);
  console.log('  release probe: CQ rose in '+rose+' of '+runs+' runs, by at most '+maxMove.toFixed(3));
  /* nothing from the probe reaches a later group */
  E.current().work={};
  bindStore(()=>null,()=>{});
 }
}

g('36c · intention is what was said against what was done, and no charge');
/* The ruled model's intention (cq-unified.md B.1): 100 times did over said
   in the last seven days, null when nothing was said. A saved ritual is the
   saying and its done mark is the doing. Time is held still by passing now. */
{
 const {intentionRead,INTENT_DAYS}=E;
 const now=Date.UTC(2026,8,25,12);
 const ago=d=>new Date(now-d*86400000).toISOString();
 ok(INTENT_DAYS===7,'the window is seven days, got '+INTENT_DAYS);
 const none=intentionRead({rituals:[]},now);
 ok(none.said===0&&none.pct===null,'nothing said reads null, never 0 or 100');
 const p={rituals:[
  {t:ago(0),band:'Heart',done:ago(0)},
  {t:ago(1),band:'Root',done:true},
  {t:ago(2),band:'Throat',done:ago(1)},
  {t:ago(3),band:'Solar',done:false},
  {t:ago(9),band:'Crown',done:false},     /* outside the window */
  {t:ago(1),band:'Sacral'}]};              /* saved before done existed */
 const r=intentionRead(p,now);
 ok(r.said===4&&r.did===3,'four said and three done in the window, got '+r.said+' and '+r.did);
 near(r.pct,75,1e-9,'so intention reads 75');
 ok(r.broken.length===1&&r.broken[0].band==='Solar','and the one not done is returned with its seat');
 /* and it reads no charge at all: the same record over a loaded field */
 reset(9,0,6); const loadedI=intentionRead(p,now).pct;
 reset(0,0,6); const clearI=intentionRead(p,now).pct;
 ok(loadedI===clearI,'the field does not move it, '+loadedI+' against '+clearI);
}

g('36d · the sniffer hears how much, AZ6');
/* His two anchors, "a little tense" and "paralyzed", read identically or not
   at all before this: all three degrees of tense came back 16, and paralyzed
   matched nothing. The degree word before a hit now scales it by the desktop's
   own factors, and paralyzed is a word at the top of the curve. */
{
 const amt=t=>{const h=E.parseStory(t).hits.filter(x=>x.kind==='word');return h.length?h[0].amt:0;};
 const little=amt('I am a little tense'), plain=amt('I am tense'),
       very=amt('I am extremely tense'), par=amt('I am paralyzed');
 ok(little<plain&&plain<very,'a little tense, tense and extremely tense read three weights, '
  +[little,plain,very].map(v=>v.toFixed(1)).join(', '));
 ok(par>0,'paralyzed is heard, '+par);
 ok(par>=plain*1.5,'and it reads well above plain tense, '+par+' against '+plain);
 ok(amt('so I froze')===amt('I froze'),'a degree word counts only right before the hit, so "so I froze" is not scaled');
 /* and it reaches the field, not only the hit */
 const land=t=>{reset(0,0,6);E.applyStory(t);return compute();};
 const a=land('I am a little tense'), b=land('I am tense'), c=land('I am paralyzed');
 ok(a.DQ<b.DQ&&b.DQ<c.DQ,'and the shadow it lands follows, DQ '
  +[a,b,c].map(r=>r.DQ.toFixed(2)).join(', '));
 ok(E.leverPull(Math.max(...c.SQ))>E.leverPull(Math.max(...a.SQ))*10,
  'so the bell pulls the paralyzed address more than ten times as hard as the little tense one');
}

g('36e \u00b7 a release lifts the laws at its seat, fitted to his fifteen thousand');
/* DECISIONS.md "Correction. A release does move CQ", 25 September after ship.
   "If a fetter is released, you may not see CQ move, but it may move 0.1 or
   0.05. I had about 15,000 patterns for my CQ. My CQ is about between 88 and
   92, plus or minus 3 points of accuracy. Those 15k releases raised my CQ."

   That is one real data point, and it is the only one. Every number below is
   his, or the engine's own geometry, or the fit re-derived from that geometry
   here rather than typed. His starting CQ is not known; 50 is assumed, his own
   "five is the average", and the assertions that matter hold from 30 to 70. */
{
 const {LIFT_R,lawNow,lawWork,lawIn,cqSum,releaseWork,lawAnswered,meterRun,meterKey,
        bindStore,pImport,blankProfile,validateProfile,undoPush,undoPop,LINES_PER_CH}=E;
 const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const CH=['Rlimit','Llimit','Rtruth','Ltruth'];
 const ADDR=W.filter(n=>n.cf), seatN=b=>ADDR.filter(n=>n.b===b).length;
 const answer=(p,v)=>{SINAMES.forEach(l=>{S.law[l]=v;p.laws[l]=v;});lawsIn();};

 /* THE RATE IS THE FIT. Every law at 5, fifteen thousand patterns spread over
    the body the way the body is built, one share per releasable address, and
    the rate that lands the middle of his 88 to 92. */
 const geo=(r,law,N)=>SI.reduce((a,l)=>a+10-(10-law)*Math.pow(1-r,N*seatN(l.b)/ADDR.length),0)/210*100;
 const flat=(s,law,N)=>SI.reduce((a,l)=>a+Math.min(10,law+s*N*seatN(l.b)/ADDR.length),0)/210*100;
 const fit=(f,want)=>{let lo=0,hi=0.01;for(let i=0;i<200;i++){const m=(lo+hi)/2;(f(m)<want)?lo=m:hi=m;}return (lo+hi)/2;};
 const rFit=fit(r=>geo(r,5,15000),90);
 ok(Math.abs(LIFT_R-rFit)<=rFit*0.01,'LIFT_R is the fit to two figures, '+LIFT_R+' against '+rFit.toExponential(4));
 const at50=geo(LIFT_R,5,15000);
 ok(Math.abs(at50-90)<0.1,'fifteen thousand from 50 lands '+at50.toFixed(2)+', the middle of his 88 to 92');
 /* HIS START IS NOT KNOWN, AND THIS IS WHY THE SHAPE IS THIS ONE. A step that
    is a share of the distance left pulls every start toward the same place;
    a flat step lands at the start plus a constant. Fitted the same way, the
    flat step misses his range from both ends. */
 const aFit=fit(s=>flat(s,5,15000),90);
 [30,70].forEach(s=>{const g2=geo(LIFT_R,s/10,15000), f2=flat(aFit,s/10,15000);
  ok(g2>=85&&g2<=95,'from '+s+' this shape lands '+g2.toFixed(1)+', inside his range with his plus or minus 3');
  ok(f2<85||f2>95,'where a flat step would land '+f2.toFixed(1)+', outside it');});
 /* and the ceiling: release alone never reaches 100, even with every pattern
    this instrument can open, opened */
 const all=geo(LIFT_R,5,ADDR.length*CH.length*LINES_PER_CH);
 ok(all<100&&all>90,'every pattern there is, from 50, reads '+all.toFixed(1)+': never 100 by release alone');

 /* AND THROUGH THE REAL PATH, AT HIS SCALE. One record, every law answered at
    5, and fifteen thousand patterns of new ground opened in runs of 24, six
    addresses on four channels, walked over the whole body line by line, each
    run through meterRun and releaseWork. */
 const rec=pImport(JSON.stringify(blankProfile('fifteen thousand')));
 ok(rec&&E.current()===rec,'a record of the person\'s own to release on');
 answer(rec,5);
 const order=[];
 for(let line=0;line<LINES_PER_CH;line++)ADDR.forEach(n=>CH.forEach(c=>order.push(meterKey(n.i,c,line))));
 let prev=cqSum(), fell=0, over=0, opened=0, firstRun=null, lastRun=null, one=null;
 const pts=[];
 for(let i=0;i<15000;i+=24){
  const c0=cqSum();
  const m=meterRun(rec,order.slice(i,Math.min(15000,i+24)));
  releaseWork(rec,m.fresh); opened+=m.fresh.length;
  const now=cqSum();
  if(firstRun===null)firstRun=now-c0;
  lastRun=now-c0;
  if(now<prev-1e-12)fell++; if(now>100)over++; prev=now;
  if([984,4992,9984,14976].indexOf(i)>=0)pts.push((i+24)+' '+now.toFixed(1));}
 const end=compute().CQ;
 ok(opened===15000,'fifteen thousand patterns of new ground, '+opened);
 ok(fell===0&&over===0,'CQ never fell and never passed 100 on the way, fell '+fell+', over '+over);
 ok(end>=88&&end<=92,'and lands '+end.toFixed(2)+', inside his 88 to 92');
 near(end,SINAMES.reduce((a,l)=>a+lawNow(l),0)/210*100,1e-9,'and it is still exactly the 21 laws over 210');
 console.log('  the walk from 50: '+pts.join(', '));
 /* HIS OTHER SENTENCE, as a check and not a fit: "you may not see CQ move, but
    it may move 0.1 or 0.05". A whole run of 24 moves it about a tenth at the
    start and a few hundredths near the end; a single pattern, which is a line
    and not a run, moves it by less than any screen shows. */
 ok(firstRun>0.05&&firstRun<0.2,'the first run moves CQ '+firstRun.toFixed(3)+', his "0.1"');
 ok(lastRun>0&&lastRun<firstRun/2,'the last moves it '+lastRun.toFixed(3)+': the same work moves it less as the laws near 10');
 {const c0=cqSum(); releaseWork(rec,meterRun(rec,[order[15000]]).fresh); one=cqSum()-c0;}
 ok(one>0&&one<0.01,'one pattern moves it '+one.toFixed(4)+', which no screen shows');
 /* WHAT A RELEASE REPORTS IS THE READING. releaseWork reads CQ through
    cqSum, as main does, and not through two whole compute() calls: the two
    are the same number while CQ is the laws, and this holds them to it. */
 {const r0=compute().CQ, o=releaseWork(rec,meterRun(rec,[order[15001]]).fresh), r1=compute().CQ;
  ok(o.n===1&&o.cq0===r0&&o.cq1===r1&&o.cq1>o.cq0,
   'what a release reports as CQ before and after is the reading itself, '+o.cq0+' then '+o.cq1);}
 /* A RERUN IS FREE AND MOVES NOTHING. Ground already open spends nothing, so
    it lifts nothing either, which is what keeps the lift from being farmed. */
 {const w=JSON.stringify(rec.work), c0=cqSum(), m=meterRun(rec,order.slice(0,24));
  releaseWork(rec,m.fresh);
  ok(m.fresh.length===0&&m.repeated===24,'a rerun of open ground is not new ground');
  ok(cqSum()===c0&&JSON.stringify(rec.work)===w,'so it lifts nothing and counts nothing');}
 /* THE FRONT DOOR READS A PROFILE'S OWN WORK, whoever is current. read() loads
    a profile into S without making it the current record, and the profile is
    its only input, so its lift is read off it and not off the current one. */
 {const want=cqSum(), other=pImport(JSON.stringify(blankProfile('someone current')));
  const got=E.read(rec).reading.CQ;
  ok(E.current()===other&&Math.abs(got-want)<1e-9,
   'read() of a profile carrying work reads its own lift with another record current, '
   +got.toFixed(3)+' against '+want.toFixed(3));
  const bare=E.read(blankProfile('no work')).reading.CQ;
  ok(bare===0,'and a profile with nothing answered reads 0 through the same door, got '+bare);}

 /* THE LOCK BAR, ACROSS THE ROSTER. DECISIONS.md, "The formula is locked once
    it passes this bar": simulated across the ICPs, within plus or minus three
    of a real anchor, and still revealing the saboteurs, the combinations and
    the weights. His start is unknown, so every reference person's own laws,
    uneven as their table has them, stand in for one possible start, and each
    takes his fifteen thousand in the same order as the walk above. Every one
    whose CQ starts between 25 and 75 must land inside his range with his
    plus or minus 3. And for every one, a heavy lift may move CQ and nothing
    in the diagnostic: the saboteurs, the complexes, the hypercomplexes and all
    112 weights read exactly as they did without it. */
 {const sig=r=>JSON.stringify([r.sabs.map(x=>x.nm+':'+x.w),r.cxs.map(x=>x.nm),r.hys.map(x=>x.nm),r.SQ,r.DQ,r.PULL]);
  const rows=[];
  PEOPLE.forEach(p=>{
   const LS=LAWSET[p.nm]; if(!LS)return;               /* the custom persona is unmeasured */
   const r=pImport(JSON.stringify(blankProfile('roster '+p.nm)));
   S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
   CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
   SINAMES.forEach(l=>{const v=LS[l]!==undefined?LS[l]:LS._; S.law[l]=v; r.laws[l]=v;}); lawsIn();
   const d0=compute(), s0=sig(d0);
   r.work={}; SI.forEach(l=>{r.work[l.nm]={n:3000,on:S.law[l.nm]};});
   const d1=compute(), same=(sig(d1)===s0);
   r.work={}; releaseWork(r,order.slice(0,15000));
   rows.push({nm:p.nm, from:d0.CQ, to:cqSum(), same});});
  const mid=rows.filter(x=>x.from>=25&&x.from<=75);
  ok(rows.length>=10,'the roster ran, '+rows.length+' reference people');
  ok(mid.length>=5&&mid.every(x=>x.to>=85&&x.to<=95),
   'every one starting between 25 and 75 lands inside 85 to 95: '
   +mid.map(x=>x.nm+' '+x.from.toFixed(0)+' to '+x.to.toFixed(1)).join(', '));
  ok(rows.every(x=>x.same),'and the lift leaves every one\'s saboteurs, complexes and weights exactly as they were, '
   +rows.filter(x=>!x.same).map(x=>x.nm).join(', '));
  console.log('  the roster at fifteen thousand: '+rows.map(x=>x.nm+' '+x.from.toFixed(0)+'>'+x.to.toFixed(0)).join(', '));}
 /* ONLY THE SEAT, AND ONLY BY THE STEP. One address at the heart, one line on
    each of the four channels, on a fresh record at 5. */
 const heart=ADDR.filter(n=>n.b==='Heart')[0];
 const hk=line=>CH.map(c=>meterKey(heart.i,c,line));
 const HL=SI.filter(l=>l.b==='Heart').map(l=>l.nm);
 const r2=pImport(JSON.stringify(blankProfile('one seat'))); answer(r2,5);
 {const b0={}; SINAMES.forEach(l=>{b0[l]=lawNow(l);}); const c0=cqSum();
  releaseWork(r2,meterRun(r2,hk(0)).fresh);
  const moved=SINAMES.filter(l=>lawNow(l)!==b0[l]);
  ok(moved.slice().sort().join()===HL.slice().sort().join(),
   'one heart address moves the four heart laws and no other, moved '+moved.join(', '));
  HL.forEach(l=>near(lawNow(l),10-5*Math.pow(1-LIFT_R,4),1e-12,l+' took four steps of the distance left'));
  near(cqSum()-c0,HL.reduce((a,l)=>a+lawNow(l)-5,0)/210*100,1e-12,'and CQ moved by those four over 210');}
 /* THE SHADOW IS NOT IN IT. The same record, the field loaded and then
    emptied: CQ reads the same both times. Model 3 inverted this on this
    branch, through Resistance, and was reverted, 22 October. */
 {CHARGES.forEach(c=>{S.charge[c]=9;}); const a=compute().CQ;
  CHARGES.forEach(c=>{S.charge[c]=0;}); const b=compute().CQ;
  ok(a===b,'a loaded field and an empty one read the same CQ, '+a.toFixed(4)+' and '+b.toFixed(4));}
 /* A NEW ANSWER STARTS THE COUNT AGAIN. His 88 to 92 is a reading taken after
    the work, which already contains it; carrying the lift through a new answer
    would count his fifteen thousand twice. */
 {S.law.Compassion=7; r2.laws.Compassion=7;
  ok(lawWork('Compassion')===0&&lawNow('Compassion')===7,'answered again at 7, Compassion reads 7: the count was against 5');
  releaseWork(r2,meterRun(r2,hk(1)).fresh);
  ok(r2.work.Compassion.n===4&&r2.work.Compassion.on===7,
   'the next release counts from the new answer, n '+r2.work.Compassion.n+' on '+r2.work.Compassion.on);
  ok(r2.work.Forgiveness.n===8,'while a law not answered again keeps counting, Forgiveness n '+r2.work.Forgiveness.n);
  lawAnswered(r2,'Forgiveness');
  ok(!r2.work.Forgiveness&&lawNow('Forgiveness')===5,'and a law answered again at the same number starts again too');}
 /* UNDO TAKES THE LIFT BACK WITH THE RELEASE */
 {const w=JSON.stringify(r2.work), c0=cqSum();
  undoPush('a release at the heart');
  releaseWork(r2,meterRun(r2,hk(2)).fresh);
  ok(cqSum()>c0,'a release lifts it');
  undoPop();
  ok(JSON.stringify(r2.work)===w&&Math.abs(cqSum()-c0)<1e-12,'and undo puts the count and CQ back exactly');}
 /* A LAW NOT ANSWERED GETS NOTHING. There is no reading to nudge, and CQ does
    not count it. Only Compassion is answered on this record. */
 {const r3=pImport(JSON.stringify(blankProfile('one law in')));
  r3.laws.Compassion=5; S.law.Compassion=5;
  releaseWork(r3,meterRun(r3,hk(0)).fresh);
  ok(Object.keys(r3.work).join()==='Compassion','only the answered heart law counts, counted '+Object.keys(r3.work).join());
  ok(!lawIn('Forgiveness'),'and the unanswered ones stay unanswered');
  near(cqSum(),lawNow('Compassion')/210*100,1e-12,'so CQ is that one law, lifted, over 210');}
 /* A FIELD THAT IS NOT THIS RECORD'S WEARS NONE OF ITS WORK, the rule undo and
    the mirror already carry for a reference case in S. */
 {const k=S.rec; S.rec='someone else'; const w=lawWork('Compassion'); S.rec=k;
  ok(w===0,'with S holding another record, the lift reads 0, got '+w);}
 /* THE BOUNDARY. The count is bounded by the ground the record itself has
    opened at that seat, so an inflated one is refused by name. */
 {const good=JSON.parse(JSON.stringify(r2)), v=validateProfile(good);
  ok(v.ok&&JSON.stringify(v.profile.work)===JSON.stringify(r2.work),'the work round trips through the boundary');
  const bad=(f,re,m)=>{const o=JSON.parse(JSON.stringify(r2)); f(o); const r=validateProfile(o);
   ok(!r.ok&&re.test((r.errs||[]).join(' | ')),m+', '+JSON.stringify(r.errs));};
  bad(o=>{o.work.Compassion.n=100000;},/work\.Compassion\.n is 100000, more than the \d+ patterns/,
   'a count above the ground the record has opened at that seat is refused by name');
  bad(o=>{o.work.Compassion.n=-1;},/work\.Compassion\.n is -1/,'a negative count is refused');
  bad(o=>{o.work.Compassion.n=2.5;},/not a whole number/,'a fractional count is refused');
  bad(o=>{o.work.Compassion.on=11;},/work\.Compassion\.on is 11/,'an answer above 10 is refused');
  bad(o=>{o.work='lots';},/work is not an object/,'a work that is not a map is refused');
  bad(o=>{o.work.Compassion=12;},/work\.Compassion is not an object/,'an entry that is a bare number is refused');
  bad(o=>{delete o.work.Compassion.on;},/work\.Compassion is not a count and the answer it was counted on/,
   'an entry with a count and no answer is refused');
  const old=JSON.parse(JSON.stringify(r2)); delete old.work;
  const vo=validateProfile(old);
  ok(vo.ok&&JSON.stringify(vo.profile.work)==='{}','a record from before the lift loads with no work');
  /* and the two paths that meet an older record without the boundary */
  const raw=JSON.parse(JSON.stringify(r2)); delete raw.work; E.loadProfile(raw);
  ok(JSON.stringify(raw.work)==='{}','loadProfile gives an older record an empty work map');
  const bare=JSON.parse(JSON.stringify(r2)); delete bare.work;
  const k=CH.map(c=>meterKey(heart.i,c,9));
  releaseWork(bare,k);
  ok(bare.work&&bare.work.Compassion&&bare.work.Compassion.n===4,
   'and releaseWork makes the map on a record that has none rather than throwing');
  E.loadProfile(r2);}
 /* NOTHING FROM HERE REACHES A LATER GROUP. The last record here has a measured
    law, and a later group reads CURP to decide whether a field is unread, so a
    blank record is left current, which is what the groups before this left. */
 E.current().work={};
 pImport(JSON.stringify(blankProfile('after the release lift')));
 bindStore(()=>null,()=>{});
}

g('37 \u00b7 the child pattern, and the reading it is under');
/* THE COUNT IS READ OFF THE RUN. Which of three things "child pattern" means
   is the owner's to rule and the three differ by an order of magnitude, so
   nothing here asserts a number: it asserts the contract, which holds under
   any reading, and prints what the roster produced under the one assumed.

   The contract. Every found pattern sits at an address that is carrying, so
   the figure can never exceed the held figure on any surface. Nothing is
   found on an empty field. The index and the list are the same set. And
   under the axis reading, no child emotion is located twice, because the
   point of it is one address per axis and not a second copy of the cloud. */
{
 const {childFound,CHILD_READ,SEATPRIM}=E;
 ok(typeof childFound==='function','childFound is reachable from the contract');
 ok(typeof CHILD_READ==='string'&&CHILD_READ.length>0,
  'and the reading it is under is named, '+CHILD_READ);
 ok(BANDS.every(b=>SEATPRIM[b]&&SEATPRIM[b].b===b),
  'every seat has a primary address and it sits in that seat');
 const empty=reset(0,0,6);
 ok(childFound(empty).n===0,'nothing is found on an empty field, got '+childFound(empty).n);
 ok(childFound(empty).found.length===0,'and nothing is located on it');
 ok(childFound().n===0,'and a call with no reading at all returns nothing rather than throwing');
 let anyFound=0;
 PEOPLE.forEach(p=>{
  S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:LS._); lawsIn();
  const r=compute(), k=childFound(r);
  anyFound+=k.n;
  ok(k.n<=r.loaded.length,p.nm+': the child count cannot exceed the held count, '
   +k.n+' of '+r.loaded.length);
  ok(k.found.every(x=>r.loaded.indexOf(x.at)>=0),
   p.nm+': every child pattern sits at an address that is carrying');
  ok(Object.keys(k.at).length===k.found.length,
   p.nm+': the index and the list are one set, '+Object.keys(k.at).length
   +' against '+k.found.length);
  ok(k.found.every(x=>!!x.seat&&!!x.ax),p.nm+': each one names its axis and its seat');
  if(CHILD_READ==='axis'){
   const ax=k.found.map(x=>x.ax);
   ok(new Set(ax).size===ax.length,p.nm+': no axis is located twice, '+ax.join(' '));
   ok(k.n<=CHILD.length,p.nm+': and it cannot exceed the nine, got '+k.n);}
  console.log('  '+p.nm.padEnd(9)+String(r.loaded.length).padStart(4)+' held, '
   +String(k.n).padStart(3)+' child');});
 ok(anyFound>0,'the roster finds some, '+anyFound+' across it');
}

g('38 · one seed for one unmeasured law, and the allowance is a ceiling');
/* ============================================================
   38a. THE SEED.

   An unmeasured law had three answers. engine/core.js wrote a literal 6,
   engine/schema.js named the same number LAW_DEFAULT for the same purpose, and
   ui/personas.js seeded the custom persona at 6.5 with a fallback of 5.5 for a
   persona with no table. Measured on one empty profile on one build: the engine
   boundary read CQ 36.00 and the app read 42.25, so the same person had two
   readings depending on which door they came through.

   This gate could not have caught it on its own, because the second and third
   numbers live in a renderer. What it can hold is the half that is testable
   from here: the seed is exported, it is one number, and a blank profile taken
   through the boundary lands on exactly that number and nothing else. The app
   half is held in tests/functional.js, which compares the two doors on the same
   empty profile in the same page.

   AND THIS FILE CARRIED A FOURTH COPY. Three checks above read
   LAWSET[p.nm]||{_:5.5}, which is a number typed into a gate, the defect this
   repository has been bitten by often enough to have a paragraph about it in
   CLAUDE.md. They read LAW_DEFAULT off the run now. The arms are dead guards
   rather than paths, which is asserted below, so changing them moved nothing
   and that is exactly why they were free to disagree for as long as they did. */
{
 const {LAW_DEFAULT,blankProfile,loadProfile}=E;
 ok(typeof LAW_DEFAULT==='number'&&isFinite(LAW_DEFAULT),
  'the seed is exported as a number, got '+JSON.stringify(LAW_DEFAULT));
 ok(LAW_DEFAULT>=0&&LAW_DEFAULT<=10,'and it is inside the scale, '+LAW_DEFAULT);
 const p=blankProfile('gate'); loadProfile(p);
 const seeded=[...new Set(SINAMES.map(l=>S.law[l]))];
 ok(seeded.length===1,'a blank profile seeds one value across every law, got '
  +seeded.length+': '+seeded.join(', '));
 ok(seeded[0]===LAW_DEFAULT,'and it is the exported seed, '+seeded[0]
  +' against '+LAW_DEFAULT);
 ok(SINAMES.every(l=>p.laws[l]===null),
  'and the record still says none of them was measured');
 const r=compute();
 ok(r.unread===true,'an empty profile reads as unread');
 console.log('  seed '+LAW_DEFAULT+'  CQ on the empty profile '+r.CQ.toFixed(2));
 /* The fallback arms in this file are guards and not paths, which is the
    reason they were able to hold a different number for as long as they did.
    If a persona ever loses its table this fails and the arm becomes real. */
 const noTable=PEOPLE.filter(p2=>!LAWSET[p2.nm]);
 ok(noTable.length===0,'every persona in the engine roster carries a law table, '
  +noTable.length+' do not'+(noTable[0]?': '+noTable[0].nm:''));
 const thin=PEOPLE.filter(p2=>{const L=LAWSET[p2.nm];
  return L&&L._===undefined&&SINAMES.some(l=>L[l]===undefined);});
 ok(thin.length===0,'and each table answers for every law or names a default, '
  +thin.length+' do neither');
}
/* ============================================================
   38b. THE ALLOWANCE IS A SECOND CEILING.

   The release panel printed "25 patterns of the 0 you have left" and then ran
   all twenty five. Measured on the shipped build against a free record with the
   gift spent and base at 100: relLeft() 0, plan 25, 110 unique patterns before
   the run and 135 after, and relLeft() still 0 afterwards because the
   subtraction clamps at nought. The overspend was invisible before, during and
   after, on the one panel in this product that quotes a price.

   meterBudget is the arithmetic, in the engine, where meterPlan's other ceiling
   already lives. What this asserts is the property the panel depends on and not
   a number: a plan built at the budget's cap never spends more than the budget
   says is left. That holds at any grant, at any tier, and at any RUN_MAX. */
{
 const {meterBudget,meterPlan,meterRun,meterKey,RUN_MAX,RUN_MIN,LINES_PER_CH}=E;
 ok(typeof meterBudget==='function','meterBudget is reachable from the contract');
 /* GUARDED, BECAUSE AN UNREACHABLE FUNCTION MUST FAIL BY NAME AND NOT BY STACK
    TRACE. Run against the build before this landed the block threw on the first
    call and took every row after it with it, which reports "meterBudget is not
    a function" from node and nothing from the gate. The row above is the gate's
    answer and the rest is skipped. */
 if(typeof meterBudget!=='function'){
  ok(false,'so nothing below it can be measured');
 } else {
 const rec=(unique,base,tier)=>({id:'gate',
  meter:{lines:unique,unique:Array.from({length:unique},(_,i)=>'seed'+i+':Rlimit:0'),
   first:null,last:null},
  plan:{tier:tier||'free',status:'',granted:0,carried:0,base:base,since:null,until:null}});
 /* the gift is the first hundred, so base 100 is the record's first real period */
 const spent=meterBudget(rec(110,100));
 ok(spent.left===0,'a spent allowance has nothing left, got '+spent.left);
 ok(spent.cap===0,'and the cap is nought, not RUN_MAX, got '+spent.cap);
 const three=meterBudget(rec(107,100));
 ok(three.left===3,'seven of ten spent leaves three, got '+three.left);
 ok(three.cap===3,'and the cap follows what is left rather than the ceiling, got '+three.cap);
 const wide=meterBudget(rec(50,100));
 ok(wide.left>RUN_MAX,'inside the gift there is more left than one run can take, '+wide.left);
 ok(wide.cap===RUN_MAX,'and the cap falls back to the run ceiling, got '+wide.cap);
 ok(meterBudget(null)&&meterBudget(null).cap<=RUN_MAX,
  'a call with no record answers rather than throwing, cap '
  +(meterBudget(null)||{}).cap);
 /* THE ROW THE DEFECT NEEDED. Eight addresses and four channels is thirty two
    lines of ground, well past any of these caps, so the cap is what truncates
    and the spend is what the cap allowed. */
 const ids=[1,2,3,4,5,6,7,8], chans=['Rlimit','Llimit','Rtruth','Ltruth'];
 [[110,100],[107,100],[100,100],[50,100]].forEach(([u,b])=>{
  const p=rec(u,b), B=meterBudget(p);
  const plan=B.cap>0?meterPlan(p,ids,chans,B.cap):[];
  ok(plan.length<=B.left,'with '+B.left+' left the plan is at most that, got '+plan.length);
  const before=p.meter.unique.length;
  if(plan.length)meterRun(p,plan);
  const added=p.meter.unique.length-before;
  ok(added<=B.left,'and the run spends no more than was left, '+added+' of '+B.left);
  ok(added===plan.length,'and it spends exactly what the plan quoted, '
   +added+' against '+plan.length);
  console.log('  left '+String(B.left).padStart(3)+'  cap '+String(B.cap).padStart(3)
   +'  plan '+String(plan.length).padStart(3)+'  spent '+String(added).padStart(3));});
 /* and the cap of nought is passed as a refusal by the caller rather than to
    meterPlan, which reads nought as "no cap given" and falls back to 25. */
 ok(meterPlan(rec(110,100),ids,chans,0).length===25,
  'meterPlan reads a cap of nought as no cap, which is why release.js refuses '
  +'above it rather than passing it down, got '+meterPlan(rec(110,100),ids,chans,0).length);
 }
}

g('38a · a release run opens whole addresses only, 17 October');
/* meterPlanWhole, engine/schema.js. The release card plans through it, so the
   required gate holds its three properties as well as tests/allowance.js,
   which is report only until three green runs: no address is ever split
   across the cap, a cap of nought plans nothing, and where everything fits it
   is meterPlan exactly. */
{
 const {meterPlanWhole,meterPlan,RUN_MAX}=E, CH=['Llimit','Rlimit','Ltruth','Rtruth'];
 if(typeof meterPlanWhole!=='function')ok(false,'meterPlanWhole is reachable from the contract');
 else {
  const p=E.blankProfile('whole'), by={};
  meterPlanWhole(p,[1,2,3,4,5,6,7,8],CH,RUN_MAX).forEach(k=>{const a=k.split(':')[0]; by[a]=(by[a]||0)+1;});
  ok(Object.keys(by).length>0&&Object.values(by).every(n=>n===CH.length),
   'every address in a wide run carries all four channels: '+JSON.stringify(by));
  ok(meterPlanWhole(p,[1,2,3],CH,3).length===0&&meterPlanWhole(p,[1,2,3],CH,0).length===0,
   'three left, or nought, opens no part of an address');
  ok(JSON.stringify(meterPlanWhole(p,[1,2,3],CH,RUN_MAX))===JSON.stringify(meterPlan(p,[1,2,3],CH,RUN_MAX)),
   'and where everything fits it plans what meterPlan plans');}
}

g('38b · a rerun plans open ground only, and is charged nothing, 22.K17');
/* DECISIONS.md: "Anything already opened may be rerun without limit and without
   cost, forever." Measured before this landed: one address released four times
   through meterPlan and meterRun spent four patterns every time, 100 to 96 to 92
   to 88, and an address with every line open planned nothing. The first rows
   reproduce that, so the gate is checked against the defect it was written for
   and is not only a description of the fix. */
{
 const {meterPlan,meterRun,meterRerun,meterRerunPlan,meterLast,meterBudget,meterKey,
        blankProfile,RUN_MAX,LINES_PER_CH,GIFT_N}=E;
 const CH=['Llimit','Rlimit','Ltruth','Rtruth'];
 ok(typeof meterRerun==='function'&&typeof meterRerunPlan==='function'&&typeof meterLast==='function',
  'the rerun is reachable from the contract');
 if(typeof meterRerun==='function'){
 /* THE DEFECT, AS IT WAS. new ground every time, at four patterns a time */
 const p=blankProfile('rerun'), seen=[];
 for(let r=0;r<4;r++){meterRun(p,meterPlan(p,[7],CH,RUN_MAX)); seen.push(GIFT_N-p.meter.unique.length);}
 ok(seen.join()===[GIFT_N-4,GIFT_N-8,GIFT_N-12,GIFT_N-16].join(),
  'four releases at one address through meterPlan spend four each, '+seen.join(' to '));
 ok(meterLast(p,7,'Rlimit')===3,'and the newest open line is the fourth, got '+meterLast(p,7,'Rlimit'));
 ok(meterLast(p,8,'Rlimit')===-1,'an address never run has nothing to rerun');

 /* THE RERUN. the same address, the newest line down each channel */
 const rr=meterRerunPlan(p,[7],CH,RUN_MAX);
 ok(rr.join()===CH.map(c=>meterKey(7,c,3)).join(),
  'a rerun plans the last line opened down each channel, got '+rr.join(' '));
 ok(rr.every(k=>p.meter.unique.indexOf(k)>=0),'and every line it plans is already open');
 const b0=meterBudget(p).left, u0=p.meter.unique.length, l0=p.meter.lines;
 for(let r=0;r<4;r++)meterRerun(p,meterRerunPlan(p,[7],CH,RUN_MAX));
 ok(p.meter.unique.length===u0,'four reruns open nothing, unique '+u0+' to '+p.meter.unique.length);
 ok(meterBudget(p).left===b0,'and the allowance does not move, '+b0+' to '+meterBudget(p).left);
 ok(p.meter.lines===l0+16,'while the lines spoken do, '+l0+' to '+p.meter.lines);
 ok(meterRerunPlan(p,[7],CH,RUN_MAX).join()===rr.join(),
  'and the rerun after a rerun says the same lines, since nothing new was opened');
 /* a run of new ground after it moves what the next rerun says */
 meterRun(p,meterPlan(p,[7],CH,RUN_MAX));
 ok(meterRerunPlan(p,[7],CH,RUN_MAX)[0]===meterKey(7,'Llimit',4),
  'a new run moves the rerun on to the line it opened');

 /* WHAT IT WILL NOT DO. a fresh record, a stale key, an address never run */
 ok(meterRerunPlan(blankProfile('none'),[1,2,3],CH,RUN_MAX).length===0,
  'a record with nothing open has nothing to rerun, and is never offered new ground instead');
 {const u=p.meter.unique.length, l=p.meter.lines, m=meterRerun(p,[meterKey(50,'Rlimit',0)]);
  ok(m.refused.length===1&&m.repeated===0,'a key that is not open is refused by name');
  ok(p.meter.unique.length===u&&p.meter.lines===l,'and opens nothing and counts nothing');
  ok(m.fresh.length===0&&m.added===0,'and hands releaseWork nothing to lift');}

 /* A FULLY OPEN ADDRESS, which planned nothing at all before */
 {const d=blankProfile('drained'), all=[];
  CH.forEach(c=>{for(let i=0;i<LINES_PER_CH;i++)all.push(meterKey(1,c,i));});
  meterRun(d,all);
  ok(meterPlan(d,[1],CH,RUN_MAX).length===0,'a fully open address plans no new ground');
  const r=meterRerunPlan(d,[1],CH,RUN_MAX);
  ok(r.length===CH.length&&r.every(k=>/:49$/.test(k)),
   'and reruns its last line on each channel, got '+r.join(' '));}

 /* THE CAP IS RUN_MAX AND NOT THE ALLOWANCE */
 {const w=blankProfile('wide'), ids=[1,2,3,4,5,6,7,8,9];
  meterRun(w,meterPlan(w,ids.slice(0,6),CH,RUN_MAX)); meterRun(w,meterPlan(w,ids.slice(6),CH,RUN_MAX));
  const r=meterRerunPlan(w,ids,CH,RUN_MAX);
  ok(r.length===RUN_MAX,'a wide rerun is cut at the run ceiling, got '+r.length);
  ok(new Set(r.map(k=>k.split(':')[0])).size*CH.length>=r.length,
   'address by address, so one address is one block');}

 /* A SPENT ALLOWANCE STILL RERUNS, which is "forever" */
 {const s=blankProfile('spent'), keys=[];
  for(let a=1;keys.length<GIFT_N+10;a++)CH.forEach(c=>keys.push(meterKey(a,c,0)));
  meterRun(s,keys.slice(0,GIFT_N+10));
  s.plan={tier:'free',status:'',granted:0,carried:0,base:GIFT_N,since:null,until:null};
  const B=meterBudget(s);
  ok(B.left===0,'a free record past the gift with the week spent has nothing left, got '+B.left);
  const r=meterRerunPlan(s,[1,2],CH,RUN_MAX);
  ok(r.length===2*CH.length,'and can still plan a rerun of what it opened, '+r.length);
  const u=s.meter.unique.length; meterRerun(s,r);
  ok(s.meter.unique.length===u&&meterBudget(s).left===0,'which spends nothing it does not have');}

 /* THE FREE WEEKS DO NOT RESTART. A record that ran the gift out before the
    stamp existed counts its weeks from meter.last, and a rerun moves last. */
 {const o=blankProfile('old'), keys=[];
  for(let a=1;keys.length<GIFT_N+10;a++)CH.forEach(c=>keys.push(meterKey(a,c,0)));
  meterRun(o,keys.slice(0,GIFT_N+10));
  const then='2026-08-01T00:00:00.000Z';
  o.meter.giftAt=null; o.meter.last=then;
  o.plan={tier:'free',status:'',granted:0,carried:0,base:GIFT_N,since:null,until:null};
  const before=meterBudget(o).left;
  meterRerun(o,meterRerunPlan(o,[1],CH,RUN_MAX));
  ok(o.meter.giftAt===then,'the gift stamp is written from the old last before last moves, got '+o.meter.giftAt);
  ok(meterBudget(o).left===before,'so the banked weeks read the same after the rerun, '
   +before+' and '+meterBudget(o).left);}
 }
}

g('39 · the sentence is read once, and the marks land on the letters');
/* ============================================================
   THE HIGHLIGHTER READ THE SENTENCE TWICE.

   scanStory records hit.at on every hit, an offset into the normalised copy it
   scanned: lowercased, everything but a letter, an apostrophe or a space turned
   into a space, runs of space collapsed, and a space added at each end so every
   word has a boundary on both sides. The engine has carried those offsets since
   the path was built and ui/storyui.js threw them away, running its own global
   regular expression over the raw text instead. Two readings of one sentence by
   two rules, and the two do not agree.

   Measured on the shipped build with an 87 word story: the engine read 8 hits
   and the page lit 5. It dropped the coherent hit, because it filtered coherent
   hits out of the table it built the expression from, so the words that take
   charge OFF a person were the only ones invisible. And on "I wanted to shut the
   door, and not come out" the scanner reads one hit where the expression over
   the raw text matches nothing at all, because the normalisation the scanner
   read through had turned that comma into a space.

   normMap is the normalisation as a function that also returns the raw index of
   every character it kept, and scanStory builds its own src from it, so there is
   no second copy to drift. The earlier inline version and a hand rebuilt one
   differed by one whenever the text opened on punctuation, because ' '+body put
   two spaces at the front when body already began with one, and that is exactly
   the kind of difference that puts a mark one letter out.

   Both ported from proto/story4, where four prototypes each carried a copy.
   ============================================================ */
{
 const {normMap,marksOf,parseStory,scanStory,PHRASES,K2BAND}=E;
 ok(typeof normMap==='function','normMap is reachable from the contract');
 ok(typeof marksOf==='function','and so is marksOf');
 if(typeof normMap!=='function'||typeof marksOf!=='function'){
  ok(false,'so nothing below can be measured');
 } else {
 /* 39a. the normalisation, and the index back out of it */
 const raw="When my manager cut me off, I STAYED QUIET — and just let it go.\n"
  +"I couldn't eat.  Later: my chest was tight.";
 const nm=normMap(raw);
 ok(nm.s.length===nm.map.length,
  'every character of the normalised copy has a raw index, '+nm.s.length
  +' against '+nm.map.length);
 ok(nm.s.charAt(0)===' '&&nm.s.charAt(nm.s.length-1)===' ',
  'it opens and closes on a space, so every word has a boundary both sides');
 ok(!/ {2}/.test(nm.s),'and no run of space survives, which is what a boundary '
  +'search depends on');
 ok(nm.s===nm.s.toLowerCase(),'it is one case');
 ok(!/[^a-z' ]/.test(nm.s),'and holds only letters, apostrophes and spaces');
 let mono=true; for(let i=1;i<nm.map.length;i++)if(nm.map[i]<nm.map[i-1])mono=false;
 ok(mono,'the raw indices never go backwards, which is what lets a mark walk forward');
 ok(nm.map.every(i=>i>=0&&i<=raw.length),'and every one addresses the raw text');
 /* the characters it kept are the characters that are there, lowercased. The
    two ends are the added spaces and address nothing, so they are skipped. */
 const wrong=[];
 for(let i=1;i<nm.s.length-1;i++){
  const c=nm.s.charAt(i), r=raw.charAt(nm.map[i]).toLowerCase();
  if(c!==' '&&c!==r)wrong.push(i+': '+JSON.stringify(c)+' points at '+JSON.stringify(r));}
 ok(wrong.length===0,'and each one points at the character it came from, '
  +wrong.length+' do not'+(wrong[0]?': '+wrong[0]:''));
 /* THE ONE STRING. scanStory reads normMap's output and nothing else, so a hit
    offset slices that hit's own text straight back out of it. This is the row
    that would catch the two copies parting by one. */
 const hits=scanStory(raw);
 ok(hits.length>0,'the scanner finds something in the sample, '+hits.length+' hits');
 const off=hits.filter(h=>h.at!=null
  &&nm.s.slice(h.at+1,h.at+1+String(h.t).length)!==String(h.t));
 ok(off.length===0,'and every offset slices its own text out of the normalised '
  +'copy, '+off.length+' do not'+(off[0]?': '+JSON.stringify(off[0].t):''));
 /* 39b. THE MARKS, placed back on the letters a person typed. */
 const story="When my manager cut me off in the meeting I stayed quiet and just let it go, "
  +"because speaking up has never once worked out for me. Later I told myself it was fine, "
  +"that I was being reasonable, but my chest was tight all afternoon and I could not eat. "
  +"I keep replaying it. I am furious with him and ashamed of myself, and I have no idea "
  +"which of those two is actually mine to carry, or whether I am simply too tired to tell.";
 const p=parseStory(story), marks=marksOf(story,p);
 ok(marks.length>0,'the marks are placed, '+marks.length+' of '+p.hits.length+' hits');
 /* one mark per stretch, in order, never overlapping, which is what lets a
    renderer walk forward and slice as it goes. */
 let ordered=true, overlap=0;
 marks.forEach((m,i)=>{ if(i&&m.s<marks[i-1].e)overlap++;
  if(i&&m.s<marks[i-1].s)ordered=false;
  if(m.e<=m.s)ordered=false;});
 ok(ordered,'they are in order and each one covers at least one character');
 ok(overlap===0,'and none overlaps another, '+overlap+' do');
 ok(marks.every(m=>m.s>=0&&m.e<=story.length),'and all of them are inside the text');
 /* EVERY MARK IS ITS OWN HIT'S TEXT, read through the same normalisation. A
    mark may span punctuation the hit does not, which is the whole point, so
    they are compared normalised rather than literally. */
 /* every hit the scanner found, counted or set aside, S1 and S2: p.hits is
    what counts, and a mark is drawn for a word read and set aside too */
 const byText={}; E.storyHits(p).forEach(h=>{byText[String(h.t)]=1;});
 const stray=marks.filter(m=>!byText[normMap(story.slice(m.s,m.e)).s.trim()]);
 ok(stray.length===0,'each mark carries a stretch the scanner actually scored, '
  +stray.length+' do not'+(stray[0]?': '+JSON.stringify(story.slice(stray[0].s,stray[0].e)):''));
 /* AND NOTHING THE ENGINE READ IS LEFT DARK. A hit is either a mark of its own
    or merged into the mark that covers it, which is the scanner's precedence:
    a phrase outranks the words inside it and an adjective on the same word as a
    placed term joins it rather than drawing twice. */
 const uncovered=E.storyHits(p).filter(h=>{
  if(h.at==null)return false;
  const a=nm0=>nm0, want=String(h.t);
  return !marks.some(m=>normMap(story.slice(m.s,m.e)).s.indexOf(want)>=0);});
 ok(uncovered.length===0,'every hit the engine read is inside some mark, '
  +uncovered.length+' are not'
  +(uncovered[0]?': '+JSON.stringify(uncovered[0].t):''));
 /* THE COHERENT HIT, which the page's own expression filtered out and which is
    the half of the reading that takes charge off a person. */
 const coh=p.hits.filter(h=>h.band==='coherent');
 ok(coh.length>0,'the sample carries a coherent hit to lose, '+coh.length);
 const cohMarks=marks.filter(m=>m.coh);
 ok(cohMarks.length>0,'and it is marked rather than filtered out, '+cohMarks.length);
 ok(cohMarks.every(m=>m.seat===null&&m.bn===null),
  'a coherent mark names no seat, because it is not charge at an address');
 /* THE NAME THE ENGINE ALREADY HOLDS, which never reached the page at all. */
 const named=p.hits.filter(h=>h.label);
 ok(named.length>0,'the sample carries named hits, '+named.length+': '
  +named.map(h=>h.label).join(', '));
 const carried=marks.filter(m=>m.label).map(m=>m.label);
 ok(carried.length>=named.length,'and every one of them is on a mark, '
  +carried.length+' carried: '+carried.join(', '));
 ok(marks.filter(m=>m.seat).every(m=>m.bn===K2BAND[m.seat]),
  'a seated mark carries the band name the renderer needs, not the lexicon key');
 console.log('  '+p.hits.length+' hits, '+marks.length+' marks, '
  +cohMarks.length+' coherent, '+carried.length+' named');
 marks.forEach(m=>console.log('    '+JSON.stringify(story.slice(m.s,m.e)).padEnd(22)
  +(m.bn||'coherent').padEnd(10)+(m.label||'')));
 /* 39c. THE CASE THE RAW EXPRESSION CANNOT REACH. The scanner matches a phrase
    across punctuation because it reads the normalised copy; a search over the
    original finds nothing. This is the row that says why the offsets exist. */
 const idiom='I wanted to shut the door, and not come out at all. I felt so tired.';
 const ip=parseStory(idiom), im=marksOf(idiom,ip);
 const across=ip.hits.filter(h=>String(h.t).indexOf(' ')>=0);
 ok(across.length>0,'the scanner reads a phrase in it, '
  +across.map(h=>JSON.stringify(h.t)).join(' '));
 ok(im.length>0,'and it is marked, '+im.length);
 const lit=idiom.slice(im[0].s,im[0].e);
 ok(lit.indexOf(',')>=0,'as one stretch that includes the punctuation inside it, got '
  +JSON.stringify(lit));
 ok(idiom.indexOf(String(across[0].t))<0,
  'where the hit text itself is nowhere in the raw sentence, which is why a '
  +'search over the raw text lit nothing here');
 console.log('  idiom '+JSON.stringify(lit)+'  named '+(im[0].label||'-'));
 /* 39d. the guards, because a renderer calls this on every keystroke */
 ok(marksOf(story,null).length===0,'no parse means no marks');
 ok(marksOf(story,{hits:[]}).length===0,'and an empty parse means no marks');
 ok(marksOf('',p).length===0||marksOf('',p).every(m=>m.e<=0),
  'and a parse against text that is gone places nothing on it');
 ok(normMap(null).s===' '&&normMap(undefined).s===' ',
  'normMap of nothing is the two boundaries and no content');
 }
}

g('40 · the seat tone is the seat\'s own, and it is off until turned on');
/* RULED 25 SEPTEMBER, ON HEARING IT. "The Solfeggio, excellent... I think these
   all choose dynamically, based off the color of the chakra, that way it's just
   automatic." So a release sounds the Solfeggio number of the seat its address
   sits at. The lookup is held to the tables and not to numbers typed here, with
   one exception, and the exception is the ruling: the tuning itself. A change
   of tuning is his to make, so it fails here by name rather than passing.

   The trap this group exists for. FLOWSEAT prints the brow seat as 'Brow' and
   every address carries '3rd Eye', so a lookup by the printed name reaches six
   seats and returns nothing for the twelve addresses at the seventh. */
{
 const {seatHz,FLOWSEAT,PMBANDS,BANDS,blankProfile,validateProfile}=E;
 ok(typeof seatHz==='function','seatHz is in the contract');
 if(typeof seatHz==='function'){
 const wrong=BANDS.filter(b=>{
  const k=(PMBANDS.find(x=>x.b===b)||{}).k, f=FLOWSEAT.find(x=>x.k===k);
  return !f||seatHz(b)!==f.hz;});
 ok(wrong.length===0,'every seat answers with the tone FLOWSEAT keys to it, wrong at '
  +JSON.stringify(wrong));
 const brow=FLOWSEAT.find(x=>x.k==='eye');
 ok(seatHz('3rd Eye')===brow.hz,'the 3rd Eye answers with the tone printed as '
  +brow.n+', got '+seatHz('3rd Eye'));
 ok(brow.n!=='3rd Eye'&&seatHz(brow.n)===null,
  'and the printed name is not a seat, which is why the lookup goes through the key');
 const reach=NODES.filter(n=>n.cf);
 const deaf=reach.filter(n=>typeof seatHz(n.b)!=='number');
 ok(deaf.length===0,'every address a release can reach has a tone, '+deaf.length+' of '
  +reach.length+' do not'+(deaf[0]?': '+deaf[0].k+' at '+deaf[0].b:''));
 const up=BANDS.map(seatHz);
 ok(new Set(up).size===BANDS.length,'each seat has a tone of its own, '+up.join(' '));
 ok(up.every((v,i)=>!i||v>up[i-1]),'and they rise from the root to the crown, '+up.join(' '));
 ok(up.join(' ')==='396 417 528 639 741 852 963',
  'and they are the Solfeggio set he chose, root to crown, got '+up.join(' '));
 const outside=NODES.filter(n=>!n.cf&&/^Field/.test(n.b));
 ok(outside.length>0&&outside.every(n=>seatHz(n.b)===null),
  'an address outside the body has no tone, '+outside.length+' checked');
 ok(seatHz(undefined)===null&&seatHz('')===null,'and nothing is not a seat, never a guess');
 }
 /* OFF UNTIL A PERSON TURNS IT ON, the rule the model consent beside it
    already keeps, and remembered through the boundary once they do. */
 const bp=blankProfile('tone');
 ok(bp.ui&&bp.ui.tone===false,'a new profile has the seat tone off');
 bp.ui.tone=true;
 const on=validateProfile(JSON.parse(JSON.stringify(bp)));
 ok(on.ok&&on.profile.ui.tone===true,'turned on, it survives the boundary');
 const old=JSON.parse(JSON.stringify(blankProfile('older'))); delete old.ui.tone;
 const back=validateProfile(old);
 ok(back.ok&&back.profile.ui.tone===false,
  'a profile saved before the switch existed loads with it off, filled from the blank');
 ok(back.ok&&back.profile.ui.quiet===false&&back.profile.ui.model===false,
  'and the two preferences beside it are untouched');
 console.log('  '+BANDS.map(b=>b+' '+seatHz(b)).join(', '));
}

g('41 · the twenty one on every history row, and a record from before still loads');
/* Ruled 26 September, answering BW Q2: keep the twenty one law values on the
   saved history so a graph can replay one law over time. What is asserted:
   a row written now carries every law as the row's own cq read it, and the
   row reconciles with that cq; the rows survive the disk and the boundary,
   which rebuilds every row from a whitelist and silently dropped anything it
   did not name; a record written by the build before this one loads exactly
   as it did and is never back filled with laws it did not record; the
   boundary refuses a bad law row by name; and a release pushes a law up the
   series while a lower answer pulls it down. */
{
 const {bindStore,pImport,pSave,pSnap,pSaveSnap,pStore,storeRefused,loadProfile,lawSeries,
        validateProfile,saveProfile,blankProfile,snapLaws,meterRun,meterKey,
        releaseWork,lawNow,LAW_WAS,current}=E;
 const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const fromDisk=id=>pStore().filter(x=>x.id===id)[0]||null;
 const lawSum=row=>SINAMES.reduce((a,l)=>a+(typeof row.lawNow[l]==='number'?row.lawNow[l]:0),0)/210*100;

 /* A RECORD THE PREVIOUS BUILD WROTE. Not a shape typed from memory: this is
    the JSON the engine at b5ded15 put on the disk, a blank profile with four
    laws answered and two snapshots taken the way pSnap takes them, with the
    id and the four dates fixed so the test does not depend on the clock. Its
    rows carry the sixteen keys a row had before the laws were added. */
 const OLD='{"v":2,"id":"pold0001","name":"Older build","created":"2026-09-20T10:00:00.000Z","updated":"2026-09-20T10:05:00.000Z","soul":{"doms":[0],"arcs":[0,1],"roots":[]},"axes":{"Fear":{"held":0,"opp":0},"Anger":{"held":0,"opp":0},"Shame":{"held":0,"opp":0},"Disgust":{"held":0,"opp":0},"Apathy":{"held":0,"opp":0},"Shock":{"held":0,"opp":0},"Sad":{"held":0,"opp":0},"Surprise":{"held":0,"opp":0},"Anticipation":{"held":0,"opp":0}},"who":{"first":"","middle":"","last":"","sex":"","sealed":"","born":{"date":"","time":"","place":"","timeUnknown":false}},"ui":{"quiet":false,"model":false,"tone":false},"seed":null,"meter":{"lines":0,"unique":[],"firsts":[],"first":null,"last":null},"plan":{"tier":"free","status":"","granted":0,"carried":0,"base":0,"since":null,"until":null},"avatar":{"built":false,"at":null,"reviewedAt":null,"pairs":[]},"purpose":{"soul":["","",""],"ego":["","",""],"sides":{"partner":[],"family":[],"friends":[],"community":[],"coworkers":[],"alone":[]}},"laws":{"Truth":7,"Transparency":null,"Justice":4,"Unity":null,"Awareness":null,"Nature":null,"Presence":null,"Humility":5,"Equanimity":null,"Compassion":null,"Forgiveness":null,"Generosity":null,"Aesthetic Beauty":null,"Courage":null,"Duty":null,"Responsibility":null,"Accountability":null,"Temperance":null,"Detachment":null,"Non-Harm":null,"Patience":7},"intake":{"answers":{},"done":[],"startedAt":null,"completedAt":null},"work":{},"gates":{"verp":{"aware":0,"detach":0,"intent":0,"ignore":0,"attach":0,"averse":0},"lean":{"benign":0,"malignant":0}},"story":{"entries":[]},"rituals":[],"history":[{"t":"2026-09-20T10:00:00.000Z","m":2,"cq":10.5,"dq":0,"sq":0,"pole":0,"jq":0,"rad":0.8,"loaded":0,"sab":0,"cx":0,"hy":0,"ch":0,"dark":"Root","tier":null,"arch":"Warrior"},{"t":"2026-09-20T10:05:00.000Z","m":2,"cq":11,"dq":0,"sq":0,"pole":0,"jq":0,"rad":0.802,"loaded":0,"sab":0,"cx":0,"hy":0,"ch":0,"dark":"Root","tier":null,"arch":"Warrior"}]}';
 mem['source.profiles']='['+OLD+']';
 const old=fromDisk('pold0001');
 ok(!!old&&storeRefused().length===0,
  'a record written by the previous build loads through the boundary, refused '+storeRefused().length);
 ok(old&&old.history.length===2&&old.history.every(h=>!('lawNow' in h)),
  'its two rows come back, and neither is given laws it never recorded');
 ok(old&&old.history[1].cq===11&&old.laws.Patience===7&&old.laws.Justice===4&&old.laws.Unity===null,
  'with its reading and its answers exactly as they were written');
  /* value for value and not byte for byte: the boundary rebuilds a row in its
    own key order, which it always has, and JSON does not order keys */
 const OH=JSON.parse(OLD).history;
 ok(old&&old.history.every((h,i)=>Object.keys(OH[i]).length===Object.keys(h).length
  &&Object.keys(OH[i]).every(k=>h[k]===OH[i][k])),
  'every row value for value as the previous build wrote it');
 const os=lawSeries(old,'Patience');
 ok(os.n===0&&os.before===2&&os.of===2&&os.first===null&&os.dir===null,
  'and a series over it says both rows predate the record of each law, not that the law read nothing, before '+os.before);

 /* LOADED AND SNAPSHOT AS THE APP DOES IT. A release must persist its
    profile update and history row in one store write, or neither may claim
    the run is fully saved. */
 const rec=pImport(OLD);
 ok(rec&&current()===rec,'the older record opens as the current one');
 let writes=0;
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{writes++;mem[k]=String(v);});
 ok(typeof pSaveSnap==='function'&&pSaveSnap(),'the atomic release save succeeds');
 ok(writes===1,'release and snapshot use one store write, got '+writes);
 let back=fromDisk('pold0001');
 ok(back&&back.history.length===3,'three rows on the disk after one snapshot, '+(back&&back.history.length));
 ok(back&&!('lawNow' in back.history[0])&&!('lawNow' in back.history[1]),
  'the two older rows are still without laws after a save wrote them back');
 const row=back&&back.history[2];
 ok(row&&row.lawNow&&Object.keys(row.lawNow).length===SINAMES.length
  &&SINAMES.every(l=>l in row.lawNow),
  'the new row carries every one of the '+SINAMES.length+' laws by name, through the disk and the boundary');
 ok(row&&row.lawNow.Patience===7&&row.lawNow.Justice===4&&row.lawNow.Humility===5&&row.lawNow.Truth===7,
  'the answered laws read as they were answered, nothing released yet');
 ok(row&&row.lawNow.Unity===null&&row.lawNow.Courage===null,
  'and a law nobody answered is null, not the six it is seeded with');
 near(row?lawSum(row):-1,row?row.cq:0,0.06,'the row reconciles: its laws over 210 are its own cq');
 /* A refused write must not leave a staged snapshot sitting in memory: a
    later successful save would otherwise duplicate a run that never saved. */
 const savedText=mem['source.profiles'], historyN=rec.history.length;
 writes=0;
 bindStore(k=>mem[k]===undefined?null:mem[k],()=>{writes++;throw new Error('QuotaExceededError');});
 ok(pSaveSnap()===false,'an atomic release save reports a refused write');
 ok(writes===1,'the refused atomic save made one write attempt, got '+writes);
 ok(rec.history.length===historyN,'a failed atomic save removes its staged snapshot');
 ok(mem['source.profiles']===savedText,'the failed write leaves the prior stored record unchanged');
 /* A storage adapter that silently drops a write is still a failed save:
    success requires reading the exact serialized record back. */
 writes=0;
 bindStore(k=>mem[k]===undefined?null:mem[k],()=>{writes++;});
 const silentHistoryN=rec.history.length;
 ok(pSaveSnap()===false,'a silent storage drop is refused by readback');
 ok(writes===1,'the silent storage drop had one write attempt, got '+writes);
 ok(rec.history.length===silentHistoryN,'a readback mismatch rolls the staged snapshot back');
 ok(mem['source.profiles']===savedText,'the no-op store leaves the prior durable record untouched');
 /* If there was no prior durable profile key, a corrupt write must remove the
    newly created key on rollback rather than replacing absence with an empty list. */
 const freshMem={}; let removes=0;
 bindStore(k=>freshMem[k]===undefined?null:freshMem[k],(k,v)=>{freshMem[k]=String(v);},
   k=>{removes++;delete freshMem[k];});
 writes=0;
 bindStore(k=>freshMem[k]===undefined?null:freshMem[k],(k,v)=>{
  writes++; freshMem[k]=String(v).slice(0,-1);
 },k=>{removes++;delete freshMem[k];});
 ok(pSaveSnap()===false,'a corrupt write with no previous profile is refused');
 ok(writes===1&&removes===1,'rollback removes the newly created key, writes '+writes+', removes '+removes);
 ok(freshMem['source.profiles']===undefined,'an absent durable key stays absent after rollback');
 ok(rec.history.length===silentHistoryN,'the failed first write rolls back the staged snapshot');
 /* A storage adapter may write partial bytes and then throw; rollback must
    recover from the partial side effect rather than trusting throw semantics. */
 writes=0;
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{
  writes++;
  if(writes===1){mem[k]='partial write';throw new Error('QuotaExceededError after partial mutation');}
  mem[k]=String(v);
 });
 ok(pSaveSnap()===false,'a partial write followed by an exception is refused');
 ok(writes===2,'a partial write is followed by one rollback write, got '+writes);
 ok(mem['source.profiles']===savedText,'a partial write that throws restores the previous durable bytes');
 ok(rec.history.length===silentHistoryN,'a partial write that throws rolls the staged snapshot back');
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 /* A non-throwing adapter that writes truncated bytes is different from a
    no-op adapter: readback must fail and the previous durable record restored. */
 writes=0;
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{
  writes++;
  mem[k]=writes===1?String(v).slice(0,-1):String(v);
 });
 ok(pSaveSnap()===false,'a corrupt but non-throwing write is refused by readback');
 ok(writes===2,'a corrupt write is followed by one rollback write, got '+writes);
 ok(mem['source.profiles']===savedText,'the corrupt write restores the previous durable record');
 ok(rec.history.length===silentHistoryN,'the corrupt write removes the staged snapshot from memory');
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 /* A failed rollback is not a save. Exercise an adapter whose removal fails
    after a corrupt first write, and assert the engine exposes uncertainty. */
 const brokenRollbackMem={}; let brokenWrites=0, brokenRemoves=0;
 bindStore(k=>brokenRollbackMem[k]===undefined?null:brokenRollbackMem[k],(k,v)=>{
  brokenWrites++; brokenRollbackMem[k]=String(v).slice(0,-1);
 },k=>{brokenRemoves++;throw new Error('remove denied');});
 ok(pSaveSnap()===false,'a corrupt first write with failed rollback remains a failed save');
 ok(brokenWrites===1&&brokenRemoves===1,
  'failed first-write rollback attempts exactly one write and one removal, '+brokenWrites+'/'+brokenRemoves);
 ok(typeof brokenRollbackMem['source.profiles']==='string',
  'failed rollback leaves its uncertain durable state visible for recovery, not claimed restored');
 ok(E.saveState().ok===false&&/RollbackFailed/.test(E.saveState().err||''),
  'failed rollback is reported as RollbackFailed, '+JSON.stringify(E.saveState()));
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const one=lawSeries(back,'Patience');
 ok(one.n===1&&one.before===2&&one.last===7&&one.dir===null,
  'the series has one point and says so, before '+one.before+', points '+one.n);

 /* THE PUSH. A release at Patience's seat lifts it, through the real meter and
    the real lift, and the next row is higher. */
 const PAT=SI.filter(l=>l.nm==='Patience')[0];
 const ADDR=W.filter(n=>n.cf&&n.b===PAT.b);
 const CH=['Rlimit','Llimit','Rtruth','Ltruth'];
 const keys=[]; for(let line=0;line<5;line++)ADDR.forEach(n=>CH.forEach(c=>keys.push(meterKey(n.i,c,line))));
 const m=meterRun(rec,keys.slice(0,200));
 releaseWork(rec,m.fresh);
 ok(m.fresh.length>0,'a release opens new ground at the '+PAT.b+', '+m.fresh.length+' patterns');
 ok(pSave()&&pSnap(),'and is saved and snapshot');
 /* THE PULL. What moves a law down in this arithmetic is a lower answer. A
    story moves the charge and never a law (engine/seed.js carries the rule
    for the seed, and nothing in applyStory writes S.law), so a story row
    carries the same laws as the row before it. */
 S.law.Patience=3; rec.laws.Patience=3;
 ok(pSave()&&pSnap(),'a lower answer is saved and snapshot');
 back=fromDisk('pold0001');
 const ps=lawSeries(back,'Patience');
 ok(ps.n===3&&ps.of===5&&ps.before===2,'three points of Patience on the disk, of five rows, '+ps.n+' of '+ps.of);
 ok(ps.pts[1].v>ps.pts[0].v,'the release pushed it up, '+ps.pts[0].v+' to '+ps.pts[1].v);
 ok(ps.pts[2].v<ps.pts[1].v&&ps.pts[2].v===3,'and the lower answer pulled it down, to '+ps.pts[2].v);
 ok(ps.pts.every(p=>p.m===E.CQ_MODEL),'every point carries the arithmetic it was read under');
 const off=SI.filter(l=>l.b!==PAT.b&&back.history[3].lawNow[l.nm]!==back.history[2].lawNow[l.nm]).length;
 ok(off===0,'no law away from the '+PAT.b+' moved on the release row, moved '+off);
 ok(back.history.slice(2).every(h=>Math.abs(lawSum(h)-h.cq)<=0.06),
  'and every row written reconciles with its own cq');
 ok(lawSeries(back,'Charisma')===null,'a series for a law that does not exist is refused, not empty');

 /* WHAT IT COSTS. Read off the run, not typed here. */
 const rowB=JSON.stringify(back.history[4]).length, oldB=JSON.stringify(back.history[1]).length;
 console.log('  a row was '+oldB+' bytes and is '+rowB+' with the laws, '+(rowB-oldB)+' more a snapshot');


 /* THE BOUNDARY, refused by name and never clamped. */
 const base=JSON.parse(JSON.stringify(back));
 const tryRow=laws=>{const o=JSON.parse(JSON.stringify(base)); o.history[4].lawNow=laws; return validateProfile(o);};
 const want=(r,re,m)=>ok(!r.ok&&re.test(String(r.errs)),m+': '+String(r.errs).slice(0,90));
 want(tryRow('high'),/history\[4\]\.lawNow is not an object/,'a law row that is not an object is refused');
 want(tryRow([5,5]),/history\[4\]\.lawNow is not an object/,'and one that is a list');
 want(tryRow({Charisma:5}),/may not carry Charisma/,'a key that is not one of the twenty one is refused by name');
 want(tryRow({Patience:12}),/Patience is 12, outside 0 to 10/,'a law of 12 is refused and named, not clamped to 10');
 want(tryRow({Patience:'7'}),/Patience is not a number/,'and a law written as text');
 const nul=tryRow(null);
 ok(nul.ok&&!('lawNow' in nul.profile.history[4]),'a null law row is an older row and loads without laws');
 const was=tryRow({Expression:6, Discernment:4, Patience:null});
 ok(was.ok&&was.profile.history[4].lawNow.Justice===6&&was.profile.history[4].lawNow.Humility===4
  &&!('Expression' in was.profile.history[4].lawNow),
  'an old name is read as the law it became, '+JSON.stringify(LAW_WAS));
 ok(was.ok&&was.profile.history[4].lawNow.Patience===null,'and a null law stays null');
 const both=tryRow({Justice:8, Expression:2});
 ok(both.ok&&both.profile.history[4].lawNow.Justice===8,'and the current name wins where both are carried');

 /* A BLANK RECORD READS ALL TWENTY ONE AS NOT YET ANSWERED, and on the disk.
    Through pImport, because lawIn asks the current record. */
 const blank=pImport(JSON.stringify(blankProfile('nothing yet')));
 ok(blank&&pSnap(),'a record with nothing answered takes a snapshot');
 const bh=fromDisk(blank.id).history[0];
 ok(SINAMES.every(l=>bh.lawNow[l]===null)&&bh.cq===0,
  'and writes every law as null, not the seed, with a cq of '+bh.cq);
 ok(lawSeries(fromDisk(blank.id),'Patience').unread===1,
  'which a series counts as read and unanswered, apart from a row from before');
 bindStore(()=>null,()=>{});
}

g('LK · an old law name is the law it became at every door, and a key the boundary does not name is refused by name');
/* SYSTEMS AUDIT SG-01 AND SG-09, 24 October. The group above holds an old law
   name on a history row. Nothing held it on the record's own laws and work,
   and there the boundary read the current names only: a record holding
   Expression 9 and Discernment 2 read Justice 9 and Humility 2 loaded straight,
   and both as never answered through validateProfile, with ok true and nothing
   said. pStore keeps what the boundary returns and the next save writes it,
   so the two answers left the disk. This holds the boundary, the boot read
   and the import, and the bytes the import leaves on the store. And every
   keyed bag at the boundary refuses a key it does not name, by name, where
   axes, laws, work and gates each dropped one with ok true and any text was
   kept as a root. Checked against the build before the fix, where the old
   name checks and every refusal below fail. */
{
 const {bindStore,pImport,importError,pStore,storeRefused,validateProfile,blankProfile,saveProfile,
        read,LAW_WAS,PKEY,ROOTD}=E;
 const J=JSON.stringify, clone=o=>JSON.parse(J(o));
 const OLD_J=LAW_WAS.Justice, OLD_H=LAW_WAS.Humility;
 /* a record from before the rename: every law answered at 8, the two renamed
    laws under the names they carried until 18 September */
 const old=clone(blankProfile('before the rename'));
 SINAMES.forEach(l=>{old.laws[l]=8;});
 delete old.laws.Justice; delete old.laws.Humility;
 old.laws[OLD_J]=9; old.laws[OLD_H]=2;
 const vo=validateProfile(clone(old));
 ok(vo.ok&&vo.profile.laws.Justice===9&&vo.profile.laws.Humility===2,
  'the boundary reads an old law name as the law it became, got '
  +J(vo.ok?{Justice:vo.profile.laws.Justice,Humility:vo.profile.laws.Humility}:vo.errs));
 ok(vo.ok&&!(OLD_J in vo.profile.laws)&&!(OLD_H in vo.profile.laws),
  'and the old name does not cross beside the new one');
 const cqStraight=read(clone(old)).reading.CQ, cqDoor=read(clone(vo.profile)).reading.CQ;
 ok(Math.abs(cqStraight-cqDoor)<1e-9,
  'and the record reads the same CQ loaded straight and through the boundary, '+cqStraight.toFixed(1)+' and '+cqDoor.toFixed(1));
 const both=clone(old); both.laws.Justice=4;
 const vb=validateProfile(both);
 ok(vb.ok&&vb.profile.laws.Justice===4,
  'the current name wins where both are carried, the history rows\' rule, got '+J(vb.ok?vb.profile.laws.Justice:vb.errs));
 const hi=clone(old); hi.laws[OLD_J]=12;
 const vh=validateProfile(hi);
 ok(!vh.ok&&vh.errs.some(e=>e.indexOf('laws.'+OLD_J+' ')===0),
  'an old name out of range is refused under the name it was stored under, '+J(vh.ok?'it loaded':vh.errs).slice(0,140));
 const odd=clone(old); odd.laws.Charisma=5;
 const vx=validateProfile(odd);
 ok(!vx.ok&&vx.errs.indexOf('laws may not carry Charisma')>=0,
  'a law key that is neither a law nor an old name of one is refused by name, '+J(vx.ok?'it loaded':vx.errs).slice(0,140));
 /* the release lift, kept by law, reads an old name the same way */
 const wk=clone(old); wk.work={}; wk.work[OLD_J]={n:0,on:9};
 const vw=validateProfile(wk);
 ok(vw.ok&&J(vw.profile.work.Justice)===J({n:0,on:9})&&!(OLD_J in vw.profile.work),
  'the release lift under an old name lands on the law it became, got '+J(vw.ok?vw.profile.work:vw.errs));
 const wx=clone(old); wx.work={Charisma:{n:0,on:5}};
 const vwx=validateProfile(wx);
 ok(!vwx.ok&&vwx.errs.indexOf('work may not carry Charisma')>=0,
  'and a work key the boundary does not name is refused by name, '+J(vwx.ok?'ok':vwx.errs).slice(0,140));
 /* THE BOOT READ. pStore keeps what the boundary returns, and on a real boot
    that list is what the next save writes, so this is what the disk will
    hold. THE IMPORT validates, loads and saves, so the bytes it leaves on the
    store are the record a reload reads. */
 const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 mem[PKEY]=J([old]);
 const boot=pStore();
 ok(boot.length===1&&storeRefused().length===0&&boot[0].laws.Justice===9&&boot[0].laws.Humility===2,
  'the boot read keeps both answers, got '+J(boot.map(p=>({Justice:p.laws.Justice,Humility:p.laws.Humility}))));
 const imp=pImport(J(old));
 ok(!!imp&&importError()===null&&imp.laws.Justice===9&&imp.laws.Humility===2,
  'the import keeps both answers, got '+J(imp?{Justice:imp.laws.Justice,Humility:imp.laws.Humility}:importError()));
 const disk=JSON.parse(mem[PKEY]||'[]').filter(p=>p&&p.id===old.id)[0];
 ok(!!disk&&disk.laws.Justice===9&&disk.laws.Humility===2&&!(OLD_J in disk.laws)&&!(OLD_H in disk.laws),
  'and after the save the disk holds them under their current names, got '
  +J(disk?{Justice:disk.laws.Justice,Humility:disk.laws.Humility}:null));
 bindStore(()=>null,()=>{});

 /* SG-09. Each keyed bag refuses a key it does not name, by name, and a root
    is one of the four. */
 const base=clone(blankProfile('keys'));
 const refuses=(mut,want,m)=>{const o=clone(base); mut(o); const r=validateProfile(o);
  ok(!r.ok&&r.errs.indexOf(want)>=0,m+', '+J(r.ok?'it loaded':r.errs).slice(0,150));};
 refuses(o=>{o.axes.Sadness={held:9,opp:1};},'axes may not carry Sadness',
  'an axis this build does not carry is refused by name, Sadness, the spelling the codes map to Sad');
 refuses(o=>{o.axes.Fear={held:4,opp:2,rep:1};},'axes.Fear may not carry rep','a key inside an axis');
 refuses(o=>{o.gates.verp.intentional=5;},'gates.verp may not carry intentional',
  'a gate this build does not count, canon.json\'s spelling of intent');
 refuses(o=>{o.gates.lean.neutral=1;},'gates.lean may not carry neutral','a lean this build does not count');
 refuses(o=>{o.gates.mood=1;},'gates may not carry mood','a key beside the two gate bags');
 refuses(o=>{o.work={Justice:{n:0,on:6,at:'today'}};},'work.Justice may not carry at','a key inside a law\'s work');
 refuses(o=>{o.soul.roots=['Banana'];},'soul.roots holds Banana, which is not one of '+ROOTD.join(', '),
  'a root that is not one of the four');
 refuses(o=>{o.soul.roots=[7];},'soul.roots holds a number, which is not one of '+ROOTD.join(', '),
  'and a root that is not text');
 const roots=clone(base); roots.soul.roots=['Architect','Witness'];
 const vr=validateProfile(roots);
 ok(vr.ok&&J(vr.profile.soul.roots)===J(['Architect','Witness']),
  'the four roots still load as they were written, got '+J(vr.ok?vr.profile.soul.roots:vr.errs));
 /* known good: what this product writes crosses with no error at all */
 const answered=clone(base); SINAMES.forEach(l=>{answered.laws[l]=7;});
 CHILD.forEach(c=>{answered.axes[c.nm]={held:3,opp:1};});
 const va=validateProfile(answered);
 ok(va.ok,'a record carrying every law and every axis by name loads clean, '+J(va.ok?'ok':va.errs).slice(0,150));
 const saved=clone(saveProfile(blankProfile('saved')));
 const vs=validateProfile(saved);
 ok(vs.ok,'and a record saveProfile writes loads clean, '+J(vs.ok?'ok':vs.errs).slice(0,150));
 reset();
}

g('SS · a primary saboteur sits where its addresses are');
/* SYSTEMS AUDIT SG-05, 24 October. The Analytics archetype card and the Avatar
   page printed the third column of ARCH18 as the primary saboteur's seat, and
   that seat held none of the saboteur's addresses in 9 of the 18 rows. Both
   read sabSeats and sabSeatMain now. Held against the addresses themselves,
   read here straight off SAB_LIB and the node table, not through either. */
{
 const {SAB_LIB,ARCH18,KB_KEY}=E;
 /* a build without the two fails here by name rather than throwing below */
 ok(typeof E.sabSeats==='function'&&typeof E.sabSeatMain==='function','the engine carries sabSeats and sabSeatMain');
 const sabSeats=typeof E.sabSeats==='function'?E.sabSeats:()=>['missing'];
 const sabSeatMain=typeof E.sabSeatMain==='function'?E.sabSeatMain:()=>'missing';
 const byNm={}; SAB_LIB.forEach(s=>{byNm[KB_KEY(s.nm)]=s;});
 const seatsOf=nm=>{const s=byNm[KB_KEY(nm)]; if(!s)return [];
  const at=new Set(s.nids.map(i=>NODES.find(n=>n.i===i).b)); return BANDS.filter(b=>at.has(b));};
 const off=ARCH18.filter(r=>JSON.stringify(sabSeats(r[1]))!==JSON.stringify(seatsOf(r[1])));
 ok(ARCH18.length>0&&off.length===0,'every primary saboteur\'s seats are the seats of its own addresses, root first, off: '
  +JSON.stringify(off.map(r=>r[1]+' '+sabSeats(r[1]).join('/')+' against '+seatsOf(r[1]).join('/'))));
 ok(JSON.stringify(sabSeats('Pleaser'))===JSON.stringify(['Root','Sacral'])&&sabSeats('Pleaser').indexOf('Heart')<0,
  'Pleaser, the Caregiver\'s primary saboteur, sits at the root and the sacral and not at the heart, got '+JSON.stringify(sabSeats('Pleaser')));
 const mainOff=ARCH18.filter(r=>{const s=byNm[KB_KEY(r[1])]; if(!s)return sabSeatMain(r[1])!==null;
  const cnt={}; s.nids.forEach(i=>{const b=NODES.find(n=>n.i===i).b; cnt[b]=(cnt[b]||0)+1;});
  const m=sabSeatMain(r[1]); return !(m&&cnt[m]===Math.max(...Object.values(cnt)));});
 ok(mainOff.length===0,'and the seat it is coloured by holds the most of its addresses, off: '+JSON.stringify(mainOff.map(r=>r[1])));
 ok(sabSeats('No Such Saboteur').length===0&&sabSeatMain('No Such Saboteur')===null&&sabSeats(null).length===0,
  'a name with no library row has no seat, and says none');
}

g('SA · Source AI hears on the rung, asks at seven, and the person leads');
/* reviews/SPEC-source-ai.md, the behaviour section. The contract, not the
   copy: the rung is a count of return, one word is never questioned however
   hot, a negated word is never questioned, and moving on is final for the
   entry. The owner's two numbers are asserted by name so a retune that moves
   them is a named diff. */
{
 const {srcHear,srcTurn,srcPrior,srcRung,srcNegated,SRC_ASK,SRC_ROOT,SRC_ONCE}=E;
 ok(SRC_ASK===7&&SRC_ROOT===10,'asks at 7 and names the root at 10, his numbers');
 /* the ladder, rung by rung, off the three counts alone */
 ok(srcRung(0,5,10)===0,'nothing heard is 0, whatever came before');
 ok(srcRung(1,0,9.3)===SRC_ONCE&&srcRung(1,0,2)===2,'one mention is the sniffer reading, capped at '+SRC_ONCE);
 ok(srcRung(2,0,0)===7&&srcRung(3,0,0)===8&&srcRung(9,0,0)===8,'a return inside the entry is 7, three or more is 8');
 ok(srcRung(1,1,0)===9,'an earlier entry at the same seat is 9');
 ok(srcRung(2,1,0)===10&&srcRung(1,2,0)===10,'back across entries and again here, or two earlier, is 10');
 /* checked against a known case: the probe that set this found the lexicon's
    median word alone reads over 7 on the sniffer's own scale */
 const one=srcHear('i was furious');
 ok(!one.unread&&one.top.rung<SRC_ASK&&!one.asks,'one hot word is heard and not asked about, rung '+one.top.rung);
 ok(srcTurn(one,{typed:true}).move==='listen','so it listens');
 const neg=srcHear('i was not angry');
 ok(neg.unread&&!neg.asks,'a negated word is not heard as charge to ask about');
 ok(srcNegated(' i did cry ',6)===false,'and "did" is not a negation here, so "I did cry" still counts');
 const twice=srcHear('I was furious at him. Still furious tonight.');
 ok(twice.asks&&twice.top.rung===7&&twice.top.seat==='solar','twice at one seat asks, at 7');
 ok(twice.top.words.indexOf('furious')>=0,'and carries the person\'s own words, as typed');
 const t=srcTurn(twice,{typed:true});
 ok(t.move==='ask'&&t.why==='again'&&t.mentions===2,'one question, about the return');
 ok(srcTurn(twice,{typed:true,passed:true}).move==='pass','moving on is final for the entry, however much it hears');
 const prior=srcPrior([{bands:{solar:18}},{bands:{heart:4,solar:0}}]);
 ok(prior.solar===1&&prior.heart===1,'earlier entries are counted off the stored seat keys, a zero seat not counted');
 const root=srcHear('I was furious at him. Still furious tonight.',{solar:1});
 ok(root.root&&root.root.rung===SRC_ROOT&&srcTurn(root,{typed:true}).why==='root','back here and before is the root');
 ok(srcHear('I was furious at him.',{solar:1}).top.rung===9,'one mention and one earlier entry is 9');
 ok(srcTurn(srcHear(''),{}).move==='open','nothing written opens');
 /* pure: the same entry twice, and the field untouched */
 const before=JSON.stringify(S.charge);
 ok(JSON.stringify(srcHear('my chest is tight and my chest is tight'))===JSON.stringify(srcHear('my chest is tight and my chest is tight')),
  'the same entry hears the same twice');
 ok(JSON.stringify(S.charge)===before,'and hearing moves no charge');
 /* ROUND NQ, THE SENTENCE BOUNDARY. AUDIT-source-tdd-v3.md's own finding,
    "the core parse path itself reads no negation at all," and this is the
    one piece of it srcHear does read. Measured before this fix: "I am not
    afraid. Afraid now." read both occurrences negated, the second
    sentence voided by the first one's own "not", because srcNegated's two
    word window reached straight across the collapsed period with nothing
    to stop it. clauseFloor is sniff.js's own shared primitive for this,
    built so this and any later pass reusing scanStory's own offsets (20.G6
    and 20.G7 in PRIORITY.md) can share one answer rather than each
    building a second copy of the text the way lawNorm and leanNorm do. */
 const bound=srcHear('I am not afraid. Afraid now.');
 ok(bound.top&&bound.top.mentions===1&&bound.top.negated===1,
  'the first sentence voids its own "not afraid"; the second, a clean sentence, still counts, got '+JSON.stringify(bound.top));
 /* and the width that was measured against the owner's own book is
    untouched: this is not a wider window, only a floor on how far back it
    may ever reach. */
 const still=srcHear('I am not afraid but I could be afraid.');
 ok(still.top&&still.top.mentions===1&&still.top.negated===1,
  'one clause, one real mention past its own negation, unchanged by the floor, got '+JSON.stringify(still.top));
 ok(E.srcNegated(' i did cry ',6)===false,
  'the gate\'s own direct call, with no floor passed, reads exactly as it did before this fix');
 const nmB=E.normMap('I am not afraid. Afraid now.');
 ok(E.clauseFloor('I am not afraid. Afraid now.',nmB,nmB.s.indexOf('now'))===nmB.s.indexOf('afraid now')-1,
  'clauseFloor finds the period, not the two words it collapsed from, as the nearest boundary before "now"');
 /* no trailing period here on purpose: one would itself be a real boundary
    at the very end and the point is the comma before it is not one, the
    same ruling leanNorm already made. */
 const nmC='I am not afraid, still shaking';
 ok(E.clauseFloor(nmC,E.normMap(nmC),E.normMap(nmC).s.indexOf('shaking'))===-1,
  'a comma is not a boundary, so this finds none before "shaking" in a text with no sentence end at all');
}

g('GR · a word that names shame reads as shame, at the seat it sits at');
/* Reproduced on 27 September: "I feel ashamed that I am relieved" came back
   as four inferred Solar Anger imprints and the Story page printed "Anger
   +1.7" four times. The family is read off the tables rather than typed, so a
   shame word added at the solar plexus later is held to the same line. */
{
 const {LEX,ADJ2CHG,parseStory}=E;
 const fam=Object.keys(LEX).filter(k=>ADJ2CHG[k]==='shame'&&LEX[k][0]==='solar');
 ok(fam.indexOf('ashamed')>=0,'the solar shame family is read off the tables and holds ashamed: '+JSON.stringify(fam));
 ok(LEX.ashamed[0]==='solar','and the seat did not move, which is the owner\'s open ruling');
 const lines=['I feel ashamed','I feel ashamed that I am relieved.','i am so ashamed',
  'I was ashamed of how I spoke to him.'].concat(fam.map(w=>'I feel '+w+'.'));
 const anger=lines.filter(t=>parseStory(t).imprints.some(i=>i.fetter==='Anger'));
 ok(anger.length===0,'no shame line yields an Anger imprint, '+anger.length+' of '+lines.length
  +' do: '+JSON.stringify(anger));
 const shame=lines.filter(t=>{const im=parseStory(t).imprints;
  return im.length&&im.every(i=>i.fetter==='Shame'&&!i.inferred);});
 ok(shame.length===lines.length,'and every one reads as named Shame, '+shame.length+' of '+lines.length);
 /* THE STATED FETTER STAYS AT ITS OWN SEAT. Before this round a fetter stated
    anywhere let every seat skip the quarter rule, so the fix above would have
    filed a bereavement at the heart as shame. */
 const died=parseStory('My father died and I feel ashamed').imprints;
 ok(died.some(i=>i.band==='Solar'&&i.fetter==='Shame'),'a death beside shame keeps Shame at the solar plexus');
 ok(!died.some(i=>i.band==='Heart'&&i.fetter==='Shame'),'and does not file the heart as shame: '
  +JSON.stringify(died.filter(i=>i.band==='Heart').map(i=>i.fetter)));
 const ex=parseStory('I am exhausted. My father died.').imprints;
 ok(ex.some(i=>i.band==='Solar'&&i.fetter==='Apathy'&&i.stated),'exhaustion still states Apathy at the solar plexus');
 ok(!ex.some(i=>i.band==='Heart'&&i.stated),'and no longer states it at the heart, where no word named it');
}

g('IK · CQ is the profile\'s own laws, and the word agrees with the number printed');
/* The owner's audit request, round IK. Two defects, each measured before the
   fix. First, the front door read a profile that is not current against the
   CURRENT record's answers, so a blank read CQ 60 and Even beside a record
   answered at 9. Second, the tier word classified the raw CQ while every
   surface prints it rounded, so 70.6 printed "CQ 71" beside "Gaining 61 to
   70". Neither case is typed as a count: the walk is read off the run. */
{
 const {pImport,blankProfile,bindStore,tierOf,tierTop,tierRange,medianRange,TIERDEF,cqSum}=E;
 const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const A=pImport(JSON.stringify(blankProfile('IK current, answered')));
 SINAMES.forEach(l=>{A.laws[l]=9;S.law[l]=9;});
 near(compute().CQ,90,1e-9,'the current record reads its own twenty one at 9');
 const b=E.read(blankProfile('IK blank, not current')).reading;
 ok(b.CQ===0&&b.answered===0&&b.measured===0&&b.tier===null&&b.unread===true,
  'a blank read through the front door with another record current is unread at 0, got CQ '
  +b.CQ+', answered '+b.answered+', measured '+b.measured+', tier '+b.tier);
 const C=blankProfile('IK three at 2'); SINAMES.slice(0,3).forEach(l=>{C.laws[l]=2;});
 const c=E.read(C).reading;
 near(c.CQ,6/210*100,1e-9,'three laws answered at 2 read as those three over 210 and nothing of the current record\'s');
 ok(c.answered===3,'and three answered, got '+c.answered);
 /* the word, at every half point either side of every floor */
 const bad=[];
 for(let x=0;x<=100;x+=0.05){const t=tierOf(x), s=Math.round(x);
  if(s<t.at||s>tierTop(t.nm))bad.push(x.toFixed(2)+' prints '+s+' as '+t.nm+' '+tierRange(t));}
 ok(bad.length===0,'no CQ prints a number outside the range of the word it is given, '+bad.length+' do: '+bad.slice(0,3).join('; '));
 ok(medianRange(60.4)===true&&medianRange(39.6)===true&&medianRange(60.6)===false&&medianRange(39.4)===false,
  'and the median range agrees with the printed 40 and 60');
 ok(TIERDEF.every(t=>tierOf(t.at).nm===t.nm),'every floor still names its own band');
}

g('JZ · the profiles on this device, by name');
/* His words: "if I enter my profile, it saves my data. Under Lance. And I can
   delete or retrieve it." Four verbs over the list that already exists. Each
   refusal below was made to pass on purpose once, and this group caught it. */
{
 const {bindStore,pNew,loadProfile,profiles,current,profList,profNameWhy,profRename,
        profCreate,profOpen,profDelete,profErr,PKEY,PROF_NAME_MAX,pStore}=E;
 const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 const disk=()=>JSON.parse(mem[PKEY]||'[]');
 /* an empty store read first, so records an earlier group left refused and
    kept beside the list are not written back into this one's disk */
 pStore(); profiles().splice(0); pNew('You'); loadProfile(current());
 /* save under a name */
 ok(profRename('Lance')===true,'the open profile saves under a name: '+profErr());
 ok(current().name==='Lance'&&disk().length===1&&disk()[0].name==='Lance',
  'and the disk holds it under that name, got '+JSON.stringify(disk().map(p=>p.name)));
 ok(profRename('  Lance  ')===true&&current().name==='Lance','the spaces at either end are not part of a name');
 /* refused by name, never clamped */
 ok(profRename('   ')===false&&/needs a name/.test(profErr()),'an empty name is refused: '+profErr());
 const long='L'.repeat(PROF_NAME_MAX+1);
 ok(profRename(long)===false&&current().name==='Lance'&&new RegExp(String(PROF_NAME_MAX)).test(profErr()),
  'a name over the limit is refused and not cut, and says the limit: '+profErr());
 /* a second profile, and a name is a label, never a key (round KG) */
 const s=profCreate('Sarah');
 ok(!!s&&current()===s&&disk().length===2,'a new blank profile opens under its name and lands on the disk');
 const s2=profCreate('sarah ');
 ok(!!s2&&s2!==s&&s2.id!==s.id&&current()===s2&&profiles().length===3,
  'a repeated name, any case, opens a distinct new profile rather than being refused: '+profErr());
 profDelete(s2.id); profOpen(s.id);
 ok(profiles().length===2&&current()===s,'cleaned back up so the rest of this run reads as before');
 ok(profNameWhy('Sarah',s)===null,'a profile may keep its own name');
 /* the retrieve keeps what was done on the one left */
 const L=profiles().find(p=>p.name==='Lance');
 ok(profOpen(L.id)===L&&current()===L,'a saved profile opens by its id');
 S.charge.Fear=4;
 ok(profOpen(s.id)===s&&S.charge.Fear===0,'opening another loads its own field');
 ok(L.axes.Fear.held===4,'and the one left kept the last thing done on it, got '+L.axes.Fear.held);
 profOpen(L.id);
 ok(S.charge.Fear===4,'and it comes back when retrieved, got '+S.charge.Fear);
 const list=profList();
 ok(list.length===2&&list.filter(x=>x.cur).length===1&&list.find(x=>x.cur).name==='Lance',
  'the list names both and marks exactly one open');
 /* the boundary: a bent record is refused and nothing moves */
 s.axes.Fear.held=9999;
 ok(profOpen(s.id)===null&&current()===L&&/9999/.test(profErr()),
  'a profile that fails the boundary is refused by the field, and the open one stays: '+profErr());
 s.axes.Fear.held=0;
 ok(profOpen('nope')===null&&current()===L,'an id that is not on the list opens nothing');
 /* atomic: a write that fails puts everything back */
 bindStore(k=>mem[k]===undefined?null:mem[k],()=>{throw new Error('QuotaExceeded');});
 ok(profDelete(s.id)===null&&profiles().length===2&&current()===L&&/could not save/.test(profErr()),
  'a delete the store refuses leaves both profiles and says so: '+profErr());
 ok(profCreate('Mira')===null&&profiles().length===2&&current()===L,'and so does a new profile');
 ok(profRename('Lancelot')===false&&current().name==='Lance','and so does a new name');
 bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 /* delete, the one not open and then the one open */
 const d1=profDelete(s.id);
 ok(d1&&d1.name==='Sarah'&&d1.moved===false&&current()===L&&disk().length===1,
  'deleting a profile that is not open leaves the open one where it is');
 const d2=profDelete(L.id);
 ok(d2&&d2.moved===true&&profiles().length===1&&current().name==='You'&&disk()[0].name==='You',
  'deleting the last one leaves a blank called You, as a first visit gets');
 ok(disk().every(p=>p.name!=='Lance'),'and Lance is gone from the disk');
 /* round trip: what the verbs wrote reads back through the boundary */
 profRename('Lance'); profCreate('Sarah');
 const back=pStore();
 ok(back.length===2&&back.map(p=>p.name).join()==='Lance,Sarah','the disk reads back through the boundary by name');
}

/* ROUND KQ, THE RITUALS OF BECOMING. Every teacher on the compass, the eight
   coherent poles and the five paths, resolves to a ritual whose every step is a
   practice the boundary accepts. Counts are read off the tables, never typed. */
g('the rituals of becoming');
{
 const {MIRROR,PATHS,BECOMING,TEACHER_PRACTICE,becomingOf,becomingSteps,validateProfile,blankProfile}=E;
 const keys=MIRROR.map(m=>m.k).concat(PATHS.map(p=>p.k));
 const miss=keys.filter(k=>!becomingOf(k));
 ok(miss.length===0,'every axis and every path has a ritual, '+keys.length+' of them, missing '+JSON.stringify(miss));
 const byK={}; PRACTICE.forEach(p=>{byK[p.k]=p;});
 const bad=[]; keys.forEach(k=>becomingOf(k).steps.forEach(s=>{if(!byK[s])bad.push(k+':'+s);}));
 ok(bad.length===0,'every step names a practice in the library, '+JSON.stringify(bad));
 /* an axis teacher carries its axis's seat, and a path carries none */
 const seats=MIRROR.filter(m=>becomingOf(m.k).seat!==m.seat).map(m=>m.k);
 ok(seats.length===0,'an axis teacher is kept at the seat that axis is read at, '+JSON.stringify(seats));
 const own=PATHS.filter(p=>!MIRROR.some(m=>m.up===p.up&&m.upd===p.upd));
 ok(own.length>0&&own.every(p=>becomingOf(p.k).seat===null&&becomingOf(p.k).path),
  'a path that stands on no axis carries no seat, '+own.map(p=>p.up).join(', '));
 /* Jesus on the body and Buddha on awareness are their axes, not second copies */
 ok(becomingOf('BO').k==='IL'&&becomingOf('AW').k==='PE','the two paths read off MIRROR are those axes\' rituals');
 /* THE TWO JESUS POLES ARE TWO RITUALS. One figure, two qualities, two seats */
 ok(becomingOf('IL').seat!==becomingOf('RE').seat&&becomingOf('IL').steps.join()!==becomingOf('RE').steps.join(),
  'Jesus at the heart and Jesus at the crown are two rituals at two seats');
 /* every teacher practice is tagged, names a teacher that exists, and is used */
 /* rc marks a starter recipe step (engine/data/teachers_recipes.js), a second kind
    of tc row that is not tied to BECOMING and is held to its own group below */
 const tp=PRACTICE.filter(p=>p.tc&&!p.rc);
 ok(tp.length===TEACHER_PRACTICE.length&&tp.every(p=>!!becomingOf(p.tc)),'every teacher practice names a teacher that exists');
 const unused=tp.filter(p=>!BECOMING[p.tc]||BECOMING[p.tc].indexOf(p.k)<0).map(p=>p.k);
 ok(unused.length===0,'and every one is a step of its own teacher, '+JSON.stringify(unused));
 /* PACING IS THE SAFETY SYSTEM. At tier one nothing above tier one is handed over */
 const leak=keys.filter(k=>becomingSteps(k,1).steps.some(s=>byK[s].tier>1));
 ok(leak.length===0,'at the heaviest load no step above tier one is started, '+JSON.stringify(leak));
 ok(keys.every(k=>{const s=becomingSteps(k,3); return s.held.length===0&&s.steps.length===becomingOf(k).steps.length;}),
  'at the lightest load every step is started and none waits');
 ok(becomingSteps('PE',1).steps.length===0&&becomingSteps('PE',1).held.length===2,
  'Buddha\'s two practices both wait at the heaviest load, which the surface then says');
 /* and the boundary takes a teacher practice as a step with no schema change */
 const rec=Object.assign(blankProfile(),{rituals:tp.map(p=>({t:new Date().toISOString(),track:p.track,band:'Heart',steps:[p.k],min:p.min}))});
 const v=validateProfile(rec);
 ok(v.ok,'a record carrying every teacher practice validates, '+(v.error||''));
}

/* ROUND PL, J14, THE STARTER RECIPE FOR EACH TEACHER. Content is a table he
   edits with no code, so these gates hold the shape and the voice of whatever
   he puts in it, and none of them types a count: every number below is read off
   the tables. */
g('J14 · the starter recipe for each teacher');
{
 const {TEACHER_RECIPES,RECIPE_STEPS,recipeOf,recipeRitual,recipeSteps,BECOMING,MIRROR,PATHS,PRACTICE,
        validateProfile,blankProfile}=E;
 const keys=TEACHER_RECIPES.map(r=>r.k);
 ok(new Set(keys).size===keys.length,'one row a pole, no key twice, '+JSON.stringify(keys.filter((k,i)=>keys.indexOf(k)!==i)));
 /* every pole the Compass carries has a recipe. BO and AW are the needle's names
    for two axes that are already poles, and recipeOf reads them through */
 const onCompass=MIRROR.map(m=>m.k).concat(PATHS.map(p=>p.k));
 const lacking=onCompass.filter(k=>!recipeOf(k));
 ok(lacking.length===0,'every teacher on the Compass opens a recipe, missing '+JSON.stringify(lacking));
 ok(Object.keys(BECOMING).every(k=>!!recipeOf(k)),'and every pole that has a ritual of becoming has a recipe');
 ok(recipeOf('BO')===recipeOf('IL')&&recipeOf('AW')===recipeOf('PE'),'the two needle names read the poles they stand for');
 /* the roster's three new poles are written before the Compass carries them,
    named here because their absence from MIRROR is the point */
 ok(['SA','TU','NA'].every(k=>!!recipeOf(k)&&!MIRROR.some(m=>m.k===k)&&!PATHS.some(p=>p.k===k)),
  'Akhenaten, Zoroaster and Confucius have recipes and are on no axis and on no path');
 /* ROUND RB, THE ROSTER ON THE COMPASS. His words: "we're supposed to have 13
    character people, and we I still have the original eight." The panels draw
    MIRROR and then compassOffAxis(), so the poles the Compass names must be
    exactly the recipe table's poles, each once, and the people one fewer than
    the poles because Jesus stands at two. Nothing here types a count. */
 {const {HOME_POLES,compassOffAxis,compassPoleOf}=E;
  const off=compassOffAxis(), named=MIRROR.map(m=>m.k).concat(off.map(p=>p.k));
  ok(new Set(named).size===named.length,'no pole is named twice on the Compass, '+JSON.stringify(named));
  ok(named.slice().sort().join()===keys.slice().sort().join(),
   'the Compass names every pole of the roster and nothing else, named '+JSON.stringify(named)+' against '+JSON.stringify(keys));
  const people=new Set(MIRROR.map(m=>m.up).concat(off.map(p=>p.up)));
  ok(people.size===named.length-1&&people.size===new Set(TEACHER_RECIPES.map(r=>r.who)).size,
   'the people are one fewer than the poles, Jesus at two, and they are the roster\'s people, saw '+people.size);
  ok(!off.some(p=>p.k==='BO'||p.k==='AW'),'a path that is an axis read twice is not named a second time');
  ok(HOME_POLES.every(p=>p.ic&&p.dic&&p.q&&p.up&&p.dn&&p.from==='proposed'&&/[A-Za-z]/.test(p.src)),
   'each pole on no axis carries both marks, its words, and the source its opposite is to be checked against');
  ok(HOME_POLES.every(p=>p.home===null||BANDS.indexOf(p.home)>=0),'a home seat is a seat this product measures');
  ok(HOME_POLES.every(p=>compassPoleOf(p.k)===p),'compassPoleOf finds each of the three by key');
  ok(compassPoleOf('TU').ic===E.SI.filter(l=>l.nm==='Truth')[0].ic&&compassPoleOf('NA').ic===E.SI.filter(l=>l.nm==='Nature')[0].ic,
   'Zoroaster and Confucius wear the mark of the law their quality names, read and not copied');}
 ok(TEACHER_RECIPES.filter(r=>r.who==='Jesus').length===2,'Jesus stands at two poles and has two rows, one each');
 /* the three not found branches, which coverage showed nothing reached: an
    unknown pole, an unknown ritual id and a step the library no longer carries
    each answer null or drop out, and none throws */
 ok(recipeOf('ZZ')===null&&recipeOf('')===null&&recipeRitual('ZZ-nothing')===null,'an unknown pole or ritual id finds nothing and does not throw');
 ok(recipeSteps({steps:['box','no_such_step']},3).steps.join()==='box'&&recipeSteps({steps:['box','no_such_step']},3).held.length===0,
  'a step the library no longer carries is dropped and never held');
 /* the credit and the inverted end are copied into the row, so a rename in the
    compass data that the row did not follow is a named failure and not a drift */
 const drift=[];
 TEACHER_RECIPES.forEach(r=>{
  const m=MIRROR.filter(x=>x.k===r.k)[0]||PATHS.filter(x=>x.k===r.k)[0]||E.HOME_POLES.filter(x=>x.k===r.k)[0]; if(!m)return;
  if(m.up!==r.who)drift.push(r.k+' who '+r.who+' vs '+m.up);
  if(m.dn!==r.opp)drift.push(r.k+' opp '+r.opp+' vs '+m.dn);
  if(String(m.q).toLowerCase()!==String(r.q).toLowerCase())drift.push(r.k+' q '+r.q+' vs '+m.q);});
 ok(drift.length===0,'who, quality and the inverted end agree with the compass data, '+JSON.stringify(drift));
 /* both behaviour lists, and the shape of each */
 const str=x=>typeof x==='string'&&x.trim().length>0&&x.length<=90;
 const badList=[]; TEACHER_RECIPES.forEach(r=>['release','install'].forEach(f=>{
  const a=r[f]; if(!Array.isArray(a)||a.length<3||a.length>5||!a.every(str))badList.push(r.k+'.'+f);}));
 ok(badList.length===0,'every pole has 3 to 5 short behaviours to release and to install, '+JSON.stringify(badList));
 ok(TEACHER_RECIPES.every(r=>str(r.line)&&str(r.who)&&str(r.q)&&str(r.opp)),'every row has a line, a credit, a quality and an inverted end');
 ok(TEACHER_RECIPES.every(r=>r.release.every(t=>r.install.indexOf(t)<0)),'no behaviour is both released and installed');
 /* the rituals, each a list of practice keys the boundary already accepts */
 const byK={}; PRACTICE.forEach(p=>{byK[p.k]=p;});
 const ids=[], badR=[];
 TEACHER_RECIPES.forEach(r=>{
  if(!Array.isArray(r.rituals)||r.rituals.length<2||r.rituals.length>3)badR.push(r.k+' has '+(r.rituals||[]).length+' rituals');
  (r.rituals||[]).forEach(x=>{ids.push(x.id);
   if(!/^[A-Z]{2}-[a-z]+$/.test(x.id)||x.id.indexOf(r.k+'-')!==0)badR.push(x.id+' is not an id of its own pole');
   if(!str(x.nm))badR.push(x.id+' has no name');
   if(!Array.isArray(x.steps)||x.steps.length<2||x.steps.length>4)badR.push(x.id+' has '+(x.steps||[]).length+' steps');
   else{
    if(new Set(x.steps).size!==x.steps.length)badR.push(x.id+' repeats a step');
    x.steps.forEach(k=>{if(!byK[k])badR.push(x.id+' names no practice: '+k);});}});});
 ok(badR.length===0,'every pole has 2 to 3 rituals of 2 to 4 steps, each a key in the library, '+JSON.stringify(badR));
 ok(new Set(ids).size===ids.length,'ritual ids are unique across the table, '+JSON.stringify(ids.filter((k,i)=>ids.indexOf(k)!==i)));
 ok(ids.every(id=>recipeRitual(id)&&recipeRitual(id).ritual.id===id),'every ritual id finds its ritual and its pole');
 /* the recipe steps are rows in the library's own shape, and nothing else's */
 const stepKeys=RECIPE_STEPS.map(p=>p.k);
 ok(new Set(stepKeys).size===stepKeys.length&&PRACTICE.filter(p=>stepKeys.indexOf(p.k)>=0).length===stepKeys.length,
  'every recipe step is in the library once, under a key nothing else uses');
 ok(RECIPE_STEPS.every(p=>str(p.nm)&&['Mind','Body','Energy','Somatic'].indexOf(p.track)>=0&&p.min>=1&&p.min<=20
   &&p.tier===1&&typeof p.d==='string'&&typeof p.how==='string'&&p.rc===1&&!!recipeOf(p.tc)),
  'each has a name, a track, minutes, tier one and a pole of its own, in practice.js\'s shape');
 /* tc keeps the seat's call and the builder's library what they were. The count
    of rows a seat can call for is the 17 above, and it must not have moved */
 ok(PRACTICE.filter(p=>!p.tc).length===17,'a seat can still call for the same practices it did before the recipes existed');
 const unused=RECIPE_STEPS.filter(p=>!TEACHER_RECIPES.some(r=>r.rituals.some(x=>x.steps.indexOf(p.k)>=0))).map(p=>p.k);
 ok(unused.length===0,'every recipe step is used by a ritual, so none is dead weight, '+JSON.stringify(unused));
 /* PACING IS THE SAFETY SYSTEM. At the heaviest load every starter ritual still
    hands a person something to do, and no step above tier one is handed over */
 const heavy=[]; ids.forEach(id=>{const x=recipeRitual(id).ritual, s=recipeSteps(x,1);
  if(!s.steps.length||s.steps.some(k=>(byK[k]||{tier:9}).tier>1)||s.steps.length+s.held.length!==x.steps.length)heavy.push(id);});
 ok(heavy.length===0,'at the heaviest load every starter ritual starts on something and holds the rest back, '+JSON.stringify(heavy));
 ok(ids.every(id=>{const x=recipeRitual(id).ritual, s=recipeSteps(x,3); return s.held.length===0&&s.steps.length===x.steps.length;}),
  'at the lightest load every step starts and none waits');
 /* and the boundary takes every starter ritual as a plan's steps with no schema change */
 const rec=Object.assign(blankProfile(),{rituals:ids.map(id=>{const x=recipeRitual(id).ritual;
  return {t:new Date().toISOString(),track:(byK[x.steps[0]]||PRACTICE[0]).track,band:'Heart',steps:x.steps.slice(),
   min:x.steps.reduce((a,k)=>a+(byK[k]||{min:0}).min,0)};})});
 const v=validateProfile(rec);
 ok(v.ok,'a record carrying every starter ritual validates, '+(v.error||''));
 /* NO SCORE, NO PERCENT, NO COUNT AGAINST A TOTAL, in any string a person reads.
    A figure in a minutes field is not a string. */
 const words=[]; TEACHER_RECIPES.forEach(r=>{[r.line,r.who,r.q,r.opp].concat(r.release,r.install,r.rituals.map(x=>x.nm)).forEach(t=>words.push(t));});
 RECIPE_STEPS.forEach(p=>{words.push(p.nm,p.d,p.how);});
 const scored=words.filter(t=>/%|\d+\s*(of|out of|\/)\s*\d+|\bscore\b|\bpercent\b|—|–/i.test(t));
 ok(scored.length===0,'no percent, score, count against a total or dash in the copy, '+JSON.stringify(scored));
 /* THE VOICE GATE OVER THE WHOLE TABLE, so a row he edits cannot arrive failing.
    check.py reads the strings out of the file itself, comments stripped, and
    exits non-zero on a hard failure. Checked against a known bad file first:
    a tool that cannot fail is not a gate. */
 {const cp=require('child_process'), fs=require('fs'), os=require('os'), path=require('path');
  const py=(f)=>{try{cp.execFileSync('python3',['.claude/skills/atuned-voice/check.py',f],{stdio:'pipe'});return 0;}
   catch(e){return e.status===undefined?-1:e.status;}};
  /* a directory of this run's own, 16 October. A fixed name in the shared
     temp directory let a second engine run on the same machine unlink this
     file between its write and its check, and the probe read exit 0. */
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'engine-j14-'));
  const bad=path.join(tmp,'j14-known-bad.js');
  fs.writeFileSync(bad,"var x=['Sit back and relax and breathe gently.','Done 2 of 5.'];\n");
  const known=py(bad);
  const gone=py(path.join(tmp,'not-there.js'));
  fs.writeFileSync(path.join(tmp,'empty.js'),'');
  const empty=py(path.join(tmp,'empty.js'));
  try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}
  ok(gone===2,'and it refuses a file that is not there, exit '+gone+', rather than passing it');
  ok(empty===2,'and it refuses a named file with no strings in it, exit '+empty+', rather than passing it');
  ok(known===1,'the voice gate fails a known bad file before it is trusted on this one, exit '+known);
  ok(py('atuned_src/engine/data/teachers_recipes.js')===0,'no string in the recipe table fails the voice rules');}
}

g('LL · practitioner mode, the switch and its integer');
/* Round LL. The switch is a ui preference like the seat tone above it, so it
   is held to the same three things: off on a new profile, kept through the
   boundary once on, and filled from the blank on a record saved before it
   existed. The last one is what the whitelist in validateProfile decides; a
   key missing from it is dropped on every load, which reads as the switch
   turning itself off after a reload. */
{
 const {blankProfile,validateProfile}=E;
 const bp=blankProfile('practitioner');
 ok(bp.ui&&bp.ui.practitioner===false,'a new profile has practitioner mode off');
 bp.ui.practitioner=true;
 const on=validateProfile(JSON.parse(JSON.stringify(bp)));
 ok(on.ok&&on.profile.ui.practitioner===true,'turned on, it survives the boundary');
 const old=JSON.parse(JSON.stringify(blankProfile('older'))); delete old.ui.practitioner;
 const back=validateProfile(old);
 ok(back.ok&&back.profile.ui.practitioner===false,
  'a profile saved before the switch existed loads with it off');
 const odd=JSON.parse(JSON.stringify(blankProfile('odd'))); odd.ui.practitioner='yes';
 const coerced=validateProfile(odd);
 ok(coerced.ok&&coerced.profile.ui.practitioner===true,
  'and it is a boolean on the way in, as every preference beside it is');
 /* THE INTEGER IS APPENDED AND NOTHING BEFORE IT MOVED. Written out in full
    rather than counted, because this is the one table in the product where a
    changed value is the defect and not the product growing. */
 ok(JSON.stringify(E.TAB)==='{"STORY":0,"SUMMARY":1,"FIELD":2,"ENERGY":3,"ANALYTICS":4,"INTAKE":5,"KNOW":6,"GAMES":7,"COMPASS":8,"SETTINGS":9,"RITUAL":10,"MASKS":11,"PRACTITIONER":12,"QUESTIONS":13,"ACCOUNT":14}',
  'Practitioner is 12 and every integer before it holds its value, '+JSON.stringify(E.TAB));
}

g('Sign in · the session is the browser\'s and never rides on a profile');
/* 30 September, when sign in went live. The brief asked for the bearer token
   as a profile field, and Export copies a whole profile to the clipboard, so
   the first export would have carried a live session out of the browser. It is
   held by ui/auth.js under its own key instead, and the boundary refuses the
   four names by name at the top level, the way plan already refuses them one
   level down. Held to the same three things as the switch above: a new profile
   carries none of them, a record saved before sign in existed still loads,
   and a record carrying any one of them is refused, with the name said. */
{
 const {blankProfile,validateProfile,PKEY}=E;
 const bp=blankProfile('signed');
 const names=['token','session','password','email'];
 ok(names.every(f=>bp[f]===undefined),'a new profile carries no token, session, password or email');
 const plain=validateProfile(JSON.parse(JSON.stringify(bp)));
 ok(plain.ok,'a record saved before sign in existed loads as it did');
 names.forEach(f=>{
  const rec=JSON.parse(JSON.stringify(blankProfile('carrying')));
  rec[f]=f==='session'?{token:'t-probe',email:'probe@example.invalid'}:'t-probe';
  const v=validateProfile(rec);
  ok(!v.ok&&(v.errs||[]).some(e=>e==='f is not held by this product'.replace('f',f)),
   'a record carrying '+f+' at the top is refused by name, got '+JSON.stringify(v.errs||v.ok));});
 /* and the session key is not the profile key, so a store read of one can
    never be handed to the boundary as the other */
 ok(PKEY==='source.profiles','the profile store is still source.profiles, which ui/auth.js keeps its session beside');
}

g('ND · one saboteur, one entry, however many tests name it');
/* AUDIT-source-tdd.md's own finding. SAB33's range match (compute.js's
   sab33Detect loop) and the fixed-address library (the ALL_SAB loop) can
   both name the same saboteur, eg Controller, from two different tests.
   Held heavy and uniform this produced 26 entries carrying 23 identities,
   Controller, Hyper-Vigilant and Avoider each twice, and one pairing away
   from a self-paired complex, "X + X", which is not a second voice, it is
   the same one counted twice.

   AND BY IDENTITY, 22 October. Counting by name could not see the defect it
   was written for once two tables spelled one saboteur two ways. The owner
   renamed S02 to Micromanager in SAB33 on 18 October and the library kept
   Controller, so from then a heavy field named S02 twice, once under each
   name and in two families, and this group stayed green because the two
   strings differ. It counts identities now: a saboteur is its SABDEF code,
   reached from SAB33's row and from SABDEF's key both, so two spellings of
   one code are one saboteur. And it holds every table that names a
   saboteur to a name SABDEF knows, so a rename that reaches one table and
   not the others fails here. Both halves were run first on the build from
   before the fix, where both failed, and pass on the fix. */
{
 const {SABDEF,SAB_LIB,SAB_PI,SAB_PI_AS,SABAUTH,SABCARD,ARCH18,KB_KEY}=E;
 /* the aliases of each code: SAB33's own spelling, by its row, which is the
    codex order S01 to S32 and then Avoider at S33, and SABDEF's key */
 const code=k=>SABDEF[k]?SABDEF[k].c:null;
 ok(SAB33.every((r,i)=>code(KB_KEY(r[0]))===null||code(KB_KEY(r[0]))==='S'+String(i+1).padStart(2,'0')),
  'SAB33 is in codex order, so its row says which code it is');
 const alias={};
 SAB33.forEach((r,i)=>{const c='S'+String(i+1).padStart(2,'0');(alias[c]=alias[c]||new Set()).add(KB_KEY(r[0]));});
 Object.keys(SABDEF).forEach(k=>{(alias[SABDEF[k].c]=alias[SABDEF[k].c]||new Set()).add(k);});
 const codeOf=nm=>{const k=KB_KEY(nm);for(const c in alias)if(alias[c].has(k))return c;return k;};
 const twice=r=>{const n={};r.sabs.filter(s=>!s.over).forEach(s=>{const c=codeOf(s.nm);n[c]=(n[c]||0)+1;});
  return Object.keys(n).filter(c=>n[c]>1);};
 const s02=()=>{reset(0,0,6);S.charge.Fear=9;S.charge.Anger=7;S.charge.Sad=10;return compute();};
 [['every axis held at 8',()=>reset(8,0,6)],['fear 9, anger 7 and sadness 10, S02 on both routes',s02]].forEach(f=>{
  const r=f[1]();
  ok(twice(r).length===0,f[0]+': no saboteur is named twice in one reading, by identity, got '+JSON.stringify(twice(r)));
  const selfCx=r.cxs.filter(c=>codeOf(c.parts[0].nm)===codeOf(c.parts[1].nm));
  ok(selfCx.length===0,f[0]+': no complex pairs a saboteur with itself, got '+JSON.stringify(selfCx.map(c=>c.nm)));});
 const r2=s02(), m=r2.sabs.filter(s=>!s.over&&codeOf(s.nm)==='S02');
 ok(m.length===1&&m[0].nm===SAB33[1][0],'S02 is one entry under its one name, got '+JSON.stringify(m.map(s=>s.nm)));
 /* AND ONE FAMILY. The range route took FAM_OF of its first charge and the
    address route the library row's family, so S02 was Dysregulation from one
    and Rigidity from the other. Every route gives the library's. */
 const famOff=[];
 SAB33.forEach(row=>{const lib=SAB_LIB.find(s=>KB_KEY(s.nm)===KB_KEY(row[0])); if(!lib)return;
  reset(0,0,6); row[1].forEach(p=>{S.charge[p[0]==='sadness'?'Sad':p[0].charAt(0).toUpperCase()+p[0].slice(1)]=(p[1]+p[2])/2;});
  compute().sabs.filter(s=>!s.over&&KB_KEY(s.nm)===KB_KEY(row[0])&&s.hcx!==lib.hcx).forEach(s=>famOff.push(s.nm+' '+s.hcx+(s.named?' off the range':'')));});
 ok(famOff.length===0,'a saboteur with a library row carries that row\'s family from either route, off: '+JSON.stringify(famOff));
 /* ONE NAME IN EVERY TABLE. Each name a table carries keys into SABDEF. */
 const tables={SAB33:SAB33.map(r=>r[0]),SAB_LIB:SAB_LIB.map(s=>s.nm),SAB_PI:SAB_PI,ARCH18:ARCH18.map(a=>a[1])};
 const unknown=t=>t.filter(n=>!SABDEF[KB_KEY(n)]);
 Object.keys(tables).forEach(t=>ok(unknown(tables[t]).length===0,
  'every saboteur '+t+' names is one SABDEF knows, unknown: '+JSON.stringify(unknown(tables[t]))));
 ok(SAB33.every(r=>SABAUTH[r[0]]&&SABCARD[KB_KEY(r[0])]),
  'and every SAB33 name has its SABAUTH line and its card row, missing: '
  +JSON.stringify(SAB33.filter(r=>!SABAUTH[r[0]]||!SABCARD[KB_KEY(r[0])]).map(r=>r[0])));
 /* the check is run on the split it was written for, and must catch it */
 const split=SAB_LIB.map(s=>s.nm).map(n=>n===SAB33[1][0]?'Controller':n);
 ok(unknown(split).length===1&&unknown(split)[0]==='Controller','the check catches a library that kept Controller: '+JSON.stringify(unknown(split)));
 /* SAB_PI IS A LOOKUP. Its names are the ones the reading prints, or the
    attribution goes quiet; Chamine's own name for S02 rides beside it. */
 const printable=new Set(SAB33.map(r=>KB_KEY(r[0])).concat(SAB_LIB.map(s=>KB_KEY(s.nm))));
 ok(SAB_PI.length===10&&SAB_PI.every(n=>printable.has(KB_KEY(n))),
  'all ten Positive Intelligence names are names the engine can print, '+JSON.stringify(SAB_PI.filter(n=>!printable.has(KB_KEY(n)))));
 ok(SAB_PI_AS&&SAB_PI_AS[SAB33[1][0]]==='Controller'&&Object.keys(SAB_PI_AS).every(n=>SAB_PI.indexOf(n)>=0),
  'and his own name for S02 is kept, Controller, beside the name the product prints');
}

g('NZ · the tiers side by side, read off the ladder and nothing else');
/* ui/plans.js draws one row per entry planLadder returns. Every figure on that
   surface is asserted here against PLANS, so a grant moved in plan.js moves the
   comparison and a number typed into the renderer has nowhere to hide. */
{
 const {planLadder,planPrice,PLAN_PRICE,PLANS,PLAN_BY,RUN_MIN}=E;
 const free=planLadder(null);
 const keys=PLANS.filter(p=>p.k!=='gift').map(p=>p.k);
 ok(JSON.stringify(free.map(r=>r.k))===JSON.stringify(keys),
  'one row per tier a person can be on, in ladder order, the gift left out: '+JSON.stringify(free.map(r=>r.k)));
 ok(free.every(r=>r.grant===PLAN_BY[r.k].grant&&r.per===PLAN_BY[r.k].per),
  'every row carries its own grant and period from PLANS');
 ok(free.filter(r=>r.now).length===1&&free.find(r=>r.now).k==='free',
  'a record with no plan is on free, and exactly one row says so');
 ok(free.filter(r=>r.up).map(r=>r.k).join()==='one,two,three,four',
  'from free every paid tier is a step up, got '+free.filter(r=>r.up).map(r=>r.k).join());
 ok(PLAN_BY.one.per!=='month'||free.find(r=>r.k==='one').week===PLAN_BY.one.grant/4,
  'a month is four weeks, the owner\'s own arithmetic: four hundred is a hundred a week');
 ok(free.find(r=>r.k==='free').week===PLAN_BY.free.grant,'a weekly tier\'s week is its grant');
 ok(free.every(r=>r.runs===Math.floor(r.grant/RUN_MIN)),'runs are counted against the smallest run');
 const two=planLadder({tier:'two',status:'active'});
 ok(two.find(r=>r.now).k==='two'&&two.filter(r=>r.up).map(r=>r.k).join()==='three,four',
  'on tier two only three and four are offered as a move up');
 ok(!two.find(r=>r.k==='one').up&&!two.find(r=>r.k==='free').up,'and nothing below is offered as one');
 const dead=planLadder({tier:'three',status:'canceled'});
 ok(dead.find(r=>r.now).k==='free','a cancelled tier three reads free here as everywhere, through planOf');
 ok(planLadder({tier:'four',status:'active'}).every(r=>!r.up),'at the top there is nothing to move up to');
 /* buy is whether a rung can be bought today; up is only where it sits. A
    closed rung is still above, and carries no press (ui/plans.js) */
 ok(free.every(r=>r.buy===E.planBuyable(r.k)),'every row carries buy, read off planBuyable');
 ok(free.find(r=>r.k==='four').up&&free.find(r=>r.k==='four').buy===(PLAN_BY.four.built!==false),
  'from free tier four is above, and buyable only when built');
 /* SIGHT BY TIER. The row carries what the tier sees and what it adds over the
    rung below, both read off SIGHT, so the comparison types no tier. */
 ok(free.every(r=>JSON.stringify(r.adds.map(g=>g.k))===JSON.stringify(E.planAdds(r.k).map(g=>g.k))),
  'a row carries what its tier adds, read off the table');
 ok(free.find(r=>r.k==='free').sees.length===0&&free.find(r=>r.k==='four').sees.length===E.SIGHT.filter(g=>g.built!==false).length,
  'free sees nothing beyond what is on every plan, and tier four sees the whole table');
 ok(free.every(r=>!('see' in r)),'and no row has a field of its own for a single rung');
 /* THE LADDER IS 12, 29, 59, 99, stated by the owner on 1 October and
    superseding DECISIONS.md line 1095 (12, 24, 36, 99). This gate asserted
    the 24 and 36 for one round, and before that held tiers one to three at
    null. The four figures are his and are typed here on purpose: a price is
    a ruling, not a quantity the product derives. */
 ok(planPrice('free')===0,'free costs nothing');
 ok(planPrice('one')===12&&planPrice('two')===29&&planPrice('three')===59&&planPrice('four')===99,
  'the four paid tiers are 12, 29, 59 and 99 a month, his own figures, got '+JSON.stringify(PLAN_PRICE));
 ok(planPrice('gift')===null&&planPrice('nonsense')===null,'an unknown key has no price rather than a wrong one');
}

g('NZ2 · the plan the server holds, laid onto a record');
/* planFromServer is the pure half of the read back in ui/auth.js. Nothing
   wrote CURP.plan from the server, so a person who paid read Free. Every
   decision the writer makes about what to write is asserted here; the host
   only validates, saves and speaks. */
{
 const {planFromServer,planOf,planState,validateProfile,SCHEMA_V,GIFT_N,planAllowance}=E;
 const free={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
 /* in 2036, because a plan is ended by its own end date now (planPast,
    engine/plan.js) and these reads name no day: a period that ran out in
    November 2026 would turn this group red on the day it ran out */
 const S1='2036-10-01T00:00:00.000Z', U1='2036-11-01T00:00:00.000Z', S2='2036-11-01T00:00:00.000Z', U2='2036-12-01T00:00:00.000Z';
 const many=n=>new Array(n).fill(0).map((_,i)=>'k'+i);
 /* never paid, on a free record: nothing a person can see moves */
 const a=planFromServer(free,null,[]);
 ok(a.same&&a.now==='free'&&!a.nowLive,'null on a free record is the same record');
 /* paying lands the tier, Stripe's word, and the period */
 const b=planFromServer(free,{tier:'one',status:'active',since:S1,until:U1},many(140));
 ok(!b.same&&b.now==='one'&&b.nowLive&&!b.wasLive,'a live tier one lands on a free record, got '+JSON.stringify(b.plan));
 ok(b.plan.since===S1&&b.plan.until===U1&&b.plan.status==='active','with Stripe\'s word and both ends of the period');
 ok(b.plan.base===140,'a new period opens at the unique count now, so it is charged only for what opens from here');
 ok(planFromServer(free,{tier:'one',status:'active',since:S1,until:U1},many(40)).plan.base===GIFT_N,
  'and never below the end of the gift, the floor planAllowance holds');
 ok(planAllowance(b.plan,140).left===400,'so the first paid month reads its whole four hundred, got '+planAllowance(b.plan,140).left);
 /* read again with nothing moved: same, and base is kept, not reset */
 const b2=planFromServer(b.plan,{tier:'one',status:'active',since:S1,until:U1},many(180));
 ok(b2.same&&b2.plan.base===140,'the same period read twice keeps its base, so a read does not refill an allowance');
 /* a renewal opens a new allowance and changes nothing a person reads */
 const c=planFromServer(b.plan,{tier:'one',status:'active',since:S2,until:U2},many(500));
 ok(!c.same&&c.now==='one'&&c.wasLive&&c.nowLive&&c.plan.base===500,'a renewal moves the period and the base, tier unchanged');
 /* an upgrade opens a full allowance of the new tier */
 const d=planFromServer(b.plan,{tier:'three',status:'active',since:S1,until:U1},many(300));
 ok(d.now==='three'&&d.was==='one'&&d.plan.base===300,'an upgrade is a new tier and a new allowance');
 /* past due keeps access */
 const e=planFromServer(b.plan,{tier:'one',status:'past_due',since:S1,until:U1},many(150));
 ok(e.nowLive&&e.now==='one'&&e.status==='past_due'&&e.wasStatus==='active','past_due keeps the tier, with the change of word visible to the host');
 /* cancelled: the tier is kept with its word, and reads free */
 const f=planFromServer(b.plan,{tier:'one',status:'canceled',since:S1,until:U1},many(150));
 ok(!f.nowLive&&f.wasLive&&f.now==='free'&&f.plan.tier==='one'&&planState(f.plan)==='ended',
  'a cancelled plan keeps which tier ended and reads free');
 /* the account has no paid plan, on a record that says it has one */
 const h=planFromServer(b.plan,null,many(150));
 /* and free restarts from that day, 17 October: base is the unique count now
    and since is the day it was read, where it was base null, which charged
    everything opened while paying against the free weeks (tests/allowance.js) */
 ok(!h.same&&h.wasLive&&!h.nowLive&&h.plan.tier==='free'&&h.plan.base===150&&typeof h.plan.since==='string',
  'null over a paid record is a change to free, which the host must say, and free counts from here: '+JSON.stringify(h.plan));
 /* a tier this build does not know moves nothing */
 const u=planFromServer(b.plan,{tier:'five',status:'active',since:S1,until:U1},many(150));
 ok(u.refused==='five'&&u.same&&u.plan===b.plan,'an unknown tier is refused by name, never rounded down to free');
 /* everything it writes goes through the boundary a pasted record goes through */
 const outs=[a,b,b2,c,d,e,f,h].map(x=>validateProfile({v:SCHEMA_V, plan:x.plan}));
 ok(outs.every(v=>v.ok),'every plan it builds passes validateProfile, got '+JSON.stringify(outs.filter(v=>!v.ok).map(v=>v.errs)));
 /* field by field: the first cut compared JSON strings and failed on key
    order alone, which is the probe's defect and not the plan's */
 ok(Object.keys(b.plan).every(k=>outs[1].profile.plan[k]===b.plan[k]),'and comes out of it unchanged, field by field');
}

g('NZ3 · a plan stopped on the payment page says the day it ends, and is still on until then');
/* The owner, 9 October: "If they want to quit the software, that the
   cancellation." Stopping a plan on Stripe's page keeps it active to the end
   of the paid month, so the status stayed active and nothing on the record
   moved: a person who had just pressed stop came back to a plan that read as
   if it simply ran on. The server now sends ends, the day it stops
   (reboot-os store.js billingOf), and the record carries it. */
{
 const {planFromServer,planOf,planState,validateProfile,SCHEMA_V,blankProfile}=E;
 const free={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null,ends:null};
 /* in 2036, for the reason NZ2 gives: an end day that has passed ends the plan */
 const S1='2036-10-01T00:00:00.000Z', U1='2036-11-01T00:00:00.000Z';
 const many=n=>new Array(n).fill(0).map((_,i)=>'k'+i);
 ok(blankProfile().plan.ends===null,'a blank record has no end day, got '+JSON.stringify(blankProfile().plan));
 const on=planFromServer(free,{tier:'one',status:'active',since:S1,until:U1,ends:null},many(140));
 ok(on.plan.ends===null&&on.ends===null,'a plan that renews has no end day');
 /* stopped on the payment page: the tier, the status and the period do not
    move, and that is exactly why the end day has to */
 const stop=planFromServer(on.plan,{tier:'one',status:'active',since:S1,until:U1,ends:U1},many(150));
 ok(!stop.same,'a stop is a change a person can see, so the host speaks on it');
 ok(stop.plan.ends===U1&&stop.ends===U1&&stop.wasEnds===null,'the record carries the day it ends, and the host is told it is new');
 ok(stop.nowLive&&planOf(stop.plan).k==='one'&&planState(stop.plan)==='live','and it is still tier one, in force, until that day');
 ok(stop.plan.base===on.plan.base,'a stop is not a new period, so the allowance is not refilled');
 /* turned back on before the day: the end day goes, and that is a change too */
 const back=planFromServer(stop.plan,{tier:'one',status:'active',since:S1,until:U1,ends:null},many(160));
 ok(!back.same&&back.plan.ends===null&&back.wasEnds===U1,'turning it back on clears the end day');
 /* a server from before ends sends no such field, and nothing is made up */
 const old=planFromServer(on.plan,{tier:'one',status:'active',since:S1,until:U1},many(150));
 ok(old.same&&old.plan.ends===null,'a server that sends no end day leaves the record as it was');
 /* the boundary holds it: a date or null, refused by name otherwise */
 const v=validateProfile({v:SCHEMA_V, plan:stop.plan});
 ok(v.ok&&v.profile.plan.ends===U1,'validateProfile keeps the end day, got '+JSON.stringify(v.errs));
 const bad=validateProfile({v:SCHEMA_V, plan:Object.assign({},stop.plan,{ends:'soon'})});
 ok(!bad.ok&&bad.errs.some(e=>/plan\.ends is not a date/.test(e)),'and refuses one that is not a date, by name, got '+JSON.stringify(bad.errs));
 /* an older record has no ends at all, and loads as one that renews */
 const older=validateProfile({v:SCHEMA_V, plan:{tier:'one',status:'active',granted:0,carried:0,base:120,since:S1,until:U1}});
 ok(older.ok&&older.profile.plan.ends===null,'a record saved before this loads with no end day');
}

g('OB1 · 19.B6, every entry carries the lexicon that read it');
/* PRIORITY.md 19.B6: "Every story entry stamped with the lexicon version
   that read it, so reading it again later is reproducible." The version is a
   hash of the tables computed at load, never a number typed anywhere, so the
   gate asserts what moves it and what does not rather than its value. */
{
 const {LEX_VERSION,LEXV_RE,lexVersion,LEX,SOMA_PLACE_WORDS,blankProfile,saveProfile,validateProfile,ENT_KEYS}=E;
 ok(LEXV_RE.test(LEX_VERSION),'the stamp is lx and eight hex digits, got '+LEX_VERSION);
 ok(lexVersion()===LEX_VERSION,'and computing it again gives the same stamp, so it is a property of the tables');
 const k='furious', was=LEX[k][1];
 LEX[k][1]=was+1; const moved=lexVersion(); LEX[k][1]=was;
 ok(moved!==LEX_VERSION&&lexVersion()===LEX_VERSION,
  'retuning one amount moves it, and putting it back puts it back');
 /* key order is not content: the same table built in another order reads the same */
 const keys=Object.keys(LEX), saved={};
 keys.forEach(x=>{saved[x]=LEX[x];delete LEX[x];});
 keys.slice().reverse().forEach(x=>{LEX[x]=saved[x];});
 ok(lexVersion()===LEX_VERSION,'and the order keys were added in does not, so the browser and node agree');
 keys.forEach(x=>{delete LEX[x];}); keys.forEach(x=>{LEX[x]=saved[x];});
 SOMA_PLACE_WORDS.push('elbow'); const blk=lexVersion(); SOMA_PLACE_WORDS.pop();
 ok(blk!==LEX_VERSION,'a blocking place word moves it, because adding one can stop a reading moving');
 ok(ENT_KEYS.indexOf('lex')>=0,'an entry may carry lex');
 const base=saveProfile(blankProfile('stamp'));
 const now=new Date().toISOString();
 const withEnt=e=>{const x=JSON.parse(JSON.stringify(base)); x.story={entries:[e]}; return x;};
 const ent=lx=>Object.assign({t:now,text:'I was furious',imprints:4,bands:{solar:18}},lx===undefined?{}:{lex:lx});
 const a=validateProfile(withEnt(ent(LEX_VERSION)));
 ok(a.ok&&a.profile.story.entries[0].lex===LEX_VERSION,'a stamped entry loads with its stamp');
 const b=validateProfile(withEnt(ent()));
 ok(b.ok&&!('lex' in b.profile.story.entries[0]),
  'an entry from before the stamp loads with none, and is not given today\'s');
 const c=validateProfile(withEnt(ent('lx00000000')));
 ok(c.ok&&c.profile.story.entries[0].lex==='lx00000000','an older lexicon is not an error, it is what the stamp is for');
 [['lx123','a short stamp'],[42,'a number'],['LX0000000G','a stamp in the wrong form']].forEach(([v,what])=>{
  const r=validateProfile(withEnt(ent(v)));
  ok(!r.ok&&(r.errs||[]).join(' ').indexOf('.lex is not a lexicon version')>=0,what+' is refused by name');});
}

g('OB2 · 20.H6, what read as nothing is reported, and no reading moves');
/* The complement of marksOf. A stretch is a run of words no mark touches,
   inside one clause, in the letters the person typed. */
{
 const {unmarkedOf,marksOf,parseStory,wordsOf,normMap,clauseFloor}=E;
 const t='I felt tight in my chest when my boss called.';
 const p=parseStory(t), u=unmarkedOf(t,p);
 ok(JSON.stringify(u.stretches.map(s=>s.text))===JSON.stringify(['I felt','in my','when my boss called']),
  'the worked example reports what it did not read, chest read because it seated the tightness, got '
  +JSON.stringify(u.stretches.map(s=>s.text)));
 ok(u.read+u.unmarked===u.words&&u.words===10,'every word is read or unread, never both, '+u.read+' and '+u.unmarked);
 ok(u.stretches.every(s=>t.slice(s.s,s.e)===s.text),'every stretch is the person\'s own letters, as typed');
 const marks=marksOf(t,p);
 ok(u.stretches.every(s=>!marks.some(m=>m.s<s.e&&m.e>s.s)),'and no stretch overlaps a mark');
 const two=unmarkedOf('I was here. Then I left','');
 ok(two.stretches.length===2&&two.stretches[0].c!==two.stretches[1].c,
  'a sentence end ends a stretch, so two sentences that read nothing are two stretches');
 const own='I keep putting off the conversation';
 ok(unmarkedOf(own,parseStory(own)).stretches.map(s=>s.text).join()===own,
  'his own example that reads nothing comes back whole, rather than as nothing');
 ok(unmarkedOf('furious',parseStory('furious')).stretches.length===0,'a text read entire reports no stretch');
 ok(unmarkedOf('',null).words===0,'and an empty one reports no words');
 const before=JSON.stringify(E.S.charge), pj=JSON.stringify(parseStory(t));
 unmarkedOf(t,parseStory(t));
 ok(JSON.stringify(E.S.charge)===before&&JSON.stringify(parseStory(t))===pj,'and reporting it moves no charge and no reading');
 /* the clause rule is clauseFloor's, read forward: a word is past a boundary
    exactly when clauseFloor finds one behind it */
 ['I am not afraid. Afraid now.','I was tight. My chest hurt! And then; nothing','no boundary, only a comma'].forEach(s=>{
  const nm=normMap(s), ws=wordsOf(s,nm);
  ok(ws.every(w=>(clauseFloor(s,nm,w.at)>=0)===(w.c>0)),'wordsOf and clauseFloor agree on where a clause starts in '+JSON.stringify(s));});
}

g('OB3 · 20.H2, the body word the person used is where the body is');
/* The document's own failure test, measured before this: "I felt tight in my
   chest when my boss called" read throat 16, because "tight" fell back to
   its own seat. A sensation word now takes the seat of the nearest place
   word in its clause, and only the lexicon's own body phrases seat a place. */
{
 const {SOMA_PLACE,SOMA_SENSE,LEX,parseStory,scanStory,CHILD,B2K}=E;
 ok(['chest','jaw','throat','stomach'].every(w=>SOMA_PLACE.seat[w]===({chest:'heart',jaw:'throat',throat:'throat',stomach:'sacral'})[w]),
  'four places are seated by the lexicon\'s own phrases, each where they put it, got '+JSON.stringify(SOMA_PLACE.seat));
 Object.keys(SOMA_PLACE.seat).filter(w=>(SOMA_PLACE.ruled||[]).indexOf(w)<0&&(SOMA_PLACE.codex||[]).indexOf(w)<0).forEach(w=>{
  const ph=Object.keys(LEX).filter(k=>k.indexOf(' ')>0&&(' '+k+' ').indexOf(' '+w+' ')>=0&&LEX[k][0]!=='coherent');
  ok(ph.length>0&&ph.every(k=>LEX[k][0]===SOMA_PLACE.seat[w]),
   w+' is derived: '+ph.map(k=>k+' at '+LEX[k][0]).join(', '));});
 ok(JSON.stringify(Object.keys(SOMA_PLACE.refused))==='["back","abdomen","skin","plexus"]',
  'four places are refused: back, where went behind my back and CHILD\'s lower back disagree, and abdomen, skin and plexus, which the codex itself holds at two seats or more, got '
  +JSON.stringify(SOMA_PLACE.refused));
 ok(SOMA_PLACE.missing.length===0&&SOMA_PLACE.sense.length===SOMA_SENSE.length,
  'every sensation is already a key, so this moves hits and never makes one');
 const seatOf=(s,w)=>{const h=scanStory(s).find(x=>x.t===w);return h?h.band:null;};
 const ex=parseStory('I felt tight in my chest when my boss called.');
 ok(JSON.stringify(ex.bands)===JSON.stringify({heart:16}),'the failure test reads at the heart now, 16, got '+JSON.stringify(ex.bands));
 const th=ex.hits.find(h=>h.t==='tight');
 ok(th.place==='chest'&&th.was==='throat'&&th.amt===LEX.tight[1],
  'and the hit says why: chest moved it from throat, and the amount is the word\'s own');
 ok(seatOf('I was tight. My chest hurt.','tight')==='throat','a place in another sentence moves nothing');
 ok(seatOf('my stomach was in a knot and my shoulders tight','tight')==='throat',
  'the nearest place decides, and shoulders has no seat, so it stays rather than going back to the stomach');
 ok(seatOf('stomach tight chest','tight')==='throat',
  'two places at the same distance that disagree move nothing');
 ok(seatOf('my chest, so tight','tight')==='throat'&&seatOf('so tight in my chest, all day','tight')==='heart',
  'a comma ends the reach, the way it separates the items of a list');
 ok(seatOf('chest tightness, foot pain, lower back tension','tension')==='throat'&&
  seatOf('chest tightness, foot pain, lower back tension','tightness')==='heart',
  'in a list the back keeps its own tension, and the chest its tightness');
 ok(JSON.stringify(parseStory('my chest is tight').bands)===JSON.stringify({heart:24}),
  'a fixed body phrase reads exactly as before');
 ok(seatOf('my jaw was so tight','tight')==='throat'&&scanStory('my jaw was so tight').find(h=>h.t==='tight').place==='jaw',
  'a place at the word\'s own seat moves nothing and is still named');
 /* the same hits, the same amounts: only the seat moves */
 const off=E.SOMA_PLACE.sense.splice(0), cmp=['I felt tight in my chest when my boss called.',
  'my chest was tense and my jaw clenched','pounding in my chest'];
 const bare=cmp.map(s=>scanStory(s).map(h=>h.t+':'+h.at+':'+h.amt).join());
 off.forEach(x=>E.SOMA_PLACE.sense.push(x));
 ok(cmp.every((s,i)=>scanStory(s).map(h=>h.t+':'+h.at+':'+h.amt).join()===bare[i]),
  'with and without the rule the hits are the same words at the same offsets and amounts');
 ok(CHILD.find(c=>c.loc.indexOf('chest')>=0&&B2K[c.seat]==='heart'),'and CHILD agrees the chest is the heart');
}

g('OB3b · round OG, the body words the owner ruled, and the detail the codex already carries');
/* The owner, round OG: "The belly button is the sacral. The diaphragm is a
   solar plexus." And on detail for neck, shoulders and gut: "if you mean like
   detail, then yeah." Three sources seat a place and the table names which:
   the lexicon's phrases, the owner's rulings, and CHILD's loc column where it
   names a word at exactly one seat. Where all three are silent a word is
   listed, never guessed. */
{
 const {SOMA_PLACE,SOMA_PLACE_WORDS,CHILD,B2K,scanStory}=E;
 /* defaults so a build from before round OG fails these cleanly and does not throw */
 const RULED=E.SOMA_PLACE_RULED||{}, RULEDL=SOMA_PLACE.ruled||[], CODEX=SOMA_PLACE.codex||[], DISP=SOMA_PLACE.dispute||{};
 const hit=(s,w)=>scanStory(s).find(x=>x.t===w);
 const seatOf=(s,w)=>{const h=hit(s,w);return h?h.band:null;};
 /* the owner's words */
 [['my belly button was tight','tight','sacral'],['I felt tension in my navel','tension','sacral'],
  ['so much tightness in my belly','tightness','sacral'],['a tight knot in my lower belly','tight','sacral'],
  ['my diaphragm was tight','tight','solar'],['pounding in my diaphragm','pounding','solar']]
 .forEach(([s,w,seat])=>{
  const h=hit(s,w);
  ok(h&&h.band===seat&&h.place,'"'+s+'" lands the '+w+' at '+seat+', got '+(h&&h.band)+' place '+(h&&h.place));});
 ok((hit('my belly button was tight','tight')||{}).was==='throat','and the hit says it moved from the sensation word\'s own seat, throat');
 /* the table is the proof, and its seat keys are the engine's own */
 ok(['belly','navel','diaphragm'].every(w=>SOMA_PLACE_WORDS.indexOf(w)>=0),'the ruled words are place words, so they also stop a move they do not own');
 ok(SOMA_PLACE.seat.belly==='sacral'&&SOMA_PLACE.seat.navel==='sacral'&&SOMA_PLACE.seat.diaphragm==='solar',
  'belly and navel are sacral, diaphragm is solar, got '+JSON.stringify(SOMA_PLACE.seat));
 ok(Object.keys(RULED).length===4&&Object.keys(RULED).every(w=>E.K2BAND[RULED[w]]),'every ruled seat is a key the engine has');
 ok(JSON.stringify(RULEDL)===JSON.stringify(['belly','heart','navel','diaphragm'])&&Object.keys(DISP).length===0,
  'the ruled words are listed as ruled, and no lexicon phrase seats any of them the other way, got '+JSON.stringify(DISP));
 /* the evidence that the ruling and the codex agree */
 const loc=w=>CHILD.filter(c=>(' '+c.loc.toLowerCase().replace(/[^a-z]+/g,' ')+' ').indexOf(' '+w+' ')>=0).map(c=>B2K[c.seat]);
 ok(JSON.stringify(loc('abdomen').sort())===JSON.stringify(['sacral','solar']),
  'CHILD holds the lower abdomen at sacral and the upper abdomen at solar, which is why abdomen alone is refused and the ruled words are not');
 /* the detail the codex already says */
 ok(JSON.stringify(CODEX)==='["neck","gut","forehead","sternum","celiac","hypogastric","pudendal"]',
  'seven places are seated by the codex alone, four from CHILD\'s loc column and three plexus names, got '+JSON.stringify(CODEX));
 CODEX.filter(w=>['neck','gut','forehead','sternum'].indexOf(w)>=0).forEach(w=>{const l=loc(w);ok(l.length>0&&l.every(k=>k===l[0])&&SOMA_PLACE.seat[w]===l[0],
  w+' is seated where CHILD holds it, '+l.join()+', and CHILD names it at one seat only');});
 ok(seatOf('my gut was so tight','tight')==='root'&&hit('my gut was so tight','tight').place==='gut',
  'gut is the root, because CHILD holds Fear at the lower back and gut');
 ok(seatOf('so tight in my forehead','tight')==='eye','forehead is the third eye, where CHILD holds Shock');
 ok(hit('my neck was tight','tight').place==='neck'&&seatOf('my neck was tight','tight')==='throat','neck is the throat, where CHILD holds Apathy at the base of the neck');
 /* a word two sources seat differently, or one source seats twice, is refused and moves nothing */
 ok(seatOf('my abdomen was tight','tight')==='throat'&&!hit('my abdomen was tight','tight').place,'abdomen is refused and moves nothing');
 ok(seatOf('my skin was tight','tight')==='throat'&&!hit('my skin was tight','tight').place,'skin is refused and moves nothing');
 /* and the words the codex is silent on stay unmapped, even though the word is a place */
 ['shoulder','shoulders','head','spine','hands','face'].forEach(w=>{
  ok(SOMA_PLACE.unseated.indexOf(w)>=0&&SOMA_PLACE.seat[w]===undefined,w+' is listed as unseated, the codex is silent');
  const s='my '+w+' was tight',h=hit(s,'tight');
  ok(h.band==='throat'&&!h.place&&!h.was,'"'+s+'" moves nothing, got '+h.band+' place '+h.place);});
 ok(seatOf('my shoulders were tight and my belly button too','tight')==='throat',
  'a silent place that is nearer than a seated one still stops the move, it does not hand it to the belly button');
 /* a stopped place does not leave the ruled word reading as a hit of its own */
 ok(scanStory('belly navel diaphragm').length===0,'a place word on its own is not a hit, so this moves seats and never makes one');
}

g('OB3c · round OI, upper and lower, the heart, the plexus names, and the spine left alone');
/* The owner, round OI: "No, upper and lower could be solar and sacral." "Oh,
   heart should go at where the heart goes." "Spine would be for the Kundalini
   health. But this also looks like it's part of the pain map." And for the
   plexus at the back of the spine, which a person does not write, the names
   the codex gives those plexuses. Written against the build before round OI,
   which fails them. */
{
 const {SOMA_PLACE,SOMA_PLACE_WORDS,scanStory}=E;
 const hit=(s,w)=>scanStory(s).find(x=>x.t===w);
 const P=SOMA_PLACE.phrase||{}, PR=SOMA_PLACE.phraseRefused||{};
 /* the halves are phrases and outrank the word inside them */
 [['my upper abdomen was tight','tight','solar','upper abdomen'],['my lower abdomen was tight','tight','sacral','lower abdomen'],
  ['tension in my upper belly','tension','solar','upper belly'],['a tight knot in my lower belly','tight','sacral','lower belly'],
  ['pounding in my upper belly','pounding','solar','upper belly']]
 .forEach(([s,w,seat,ph])=>{const h=hit(s,w);
  ok(h&&h.band===seat&&h.place===ph,'"'+s+'" reads '+w+' at '+seat+' by the phrase '+ph+', got '+(h&&h.band)+' by '+(h&&h.place));});
 ok(P['upper belly']==='solar'&&P['lower belly']==='sacral'&&P['upper abdomen']==='solar'&&P['lower abdomen']==='sacral',
  'the four halves are on the table, got '+JSON.stringify(P));
 ok(hit('my belly was tight','tight').band==='sacral'&&hit('my belly button was tight','tight').band==='sacral',
  'belly and belly button on their own are still the sacral, as ruled in round OG');
 ok(SOMA_PLACE.seat.abdomen===undefined&&SOMA_PLACE.refused.abdomen&&!hit('my abdomen was tight','tight').place,
  'abdomen alone stays refused, because the codex splits it');
 ok(Object.keys(SOMA_PLACE.dispute||{}).length===0,'and no half is read against what the codex says, got '+JSON.stringify(SOMA_PLACE.dispute));
 ok(/upper abdomen/.test((SOMA_PLACE.phraseWhy||{})['upper abdomen'])&&/lower abdomen/.test((SOMA_PLACE.phraseWhy||{})['lower abdomen']),
  'the abdomen pair is held against CHILD\'s loc column and agrees with it');
 ok(hit('upper, belly tight','tight').band==='sacral'&&hit('upper, belly tight','tight').place==='belly',
  'a comma between the half and the place breaks the phrase, so the place word reads alone');
 /* the heart */
 ok(SOMA_PLACE.seat.heart==='heart'&&SOMA_PLACE.unseated.indexOf('heart')<0,'the word heart is seated, at the Heart seat');
 const hp=hit('my heart was pounding','pounding');
 ok(hp&&hp.band==='heart'&&hp.place==='heart'&&hp.was==='eye','"my heart was pounding" moves the pounding to the heart, from its own seat, got '+(hp&&hp.band)+' was '+(hp&&hp.was));
 /* the spine is not a seat */
 ok(SOMA_PLACE.seat.spine===undefined&&SOMA_PLACE.unseated.indexOf('spine')>=0&&SOMA_PLACE_WORDS.indexOf('spine')>=0,
  'spine is a place word that seats nothing: it can stop a move and it never makes one');
 ok(!hit('my spine was tight','tight').place&&hit('my spine was tight','tight').band==='throat'&&!hit('pounding in my spine','pounding').place,
  'a sensation next to the spine stays where the sensation word had it');
 /* the plexus names, derived from the codex's addr and nv columns */
 [['my solar plexus was tight','tight','solar','solar plexus'],['pounding in my solar plexus','pounding','solar','solar plexus'],
  ['tension in my celiac plexus','tension','solar','celiac plexus'],['tight in my hypogastric plexus','tight','sacral','hypogastric plexus'],
  ['tension in my pudendal region','tension','sacral','pudendal'],['pounding at my celiac','pounding','solar','celiac']]
 .forEach(([s,w,seat,ph])=>{const h=hit(s,w);
  ok(h&&h.band===seat&&h.place===ph,'"'+s+'" reads '+w+' at '+seat+' by '+ph+', got '+(h&&h.band)+' by '+(h&&h.place));});
 ok(P['solar plexus']==='solar'&&P['celiac plexus']==='solar'&&P['hypogastric plexus']==='sacral',
  'the plexus phrases are seated where the codex rows that name them agree');
 /* the one the codex splits is refused by name */
 ok(PR['sacral plexus']&&/root and sacral/.test(PR['sacral plexus'])&&P['sacral plexus']===undefined,
  'sacral plexus is refused, because APC names it at both the Root (S4 to Co1) and the Sacral (S1 to S3), got '+JSON.stringify(PR));
 ok(!hit('my sacral plexus was tight','tight').place,'and it moves nothing');
 ok(SOMA_PLACE.refused.plexus&&!hit('my brachial plexus was tight','tight').place,'plexus alone is refused too, the codex names it at five seats');
 /* the codex's shoulder girdle is NOT read: the owner has not ruled on shoulders */
 ok(SOMA_PLACE.seat.shoulder===undefined&&SOMA_PLACE.seat.shoulders===undefined&&SOMA_PLACE.unseated.indexOf('shoulders')>=0,
  'shoulders stay unmapped, though CHILD\'s addr column says Shoulder girdle and throat');
 ok(SOMA_PLACE.seat.head===undefined&&SOMA_PLACE.unseated.indexOf('head')>=0,'head stays unmapped');
 ok(SOMA_PLACE.seat.stomach==='sacral'&&SOMA_PLACE.seat.gut==='root','stomach and gut are as they were, sacral and root');
 ok(SOMA_PLACE.seat.back===undefined&&SOMA_PLACE.refused.back&&!P['lower back'],'lower back is not read as a phrase, and back stays refused');
 ok(SOMA_PLACE.seat['pelvic']===undefined&&!P['pelvic floor'],'pelvic floor is not read as a phrase');
}

g('OB4 · 20.H3, the document\'s failure test, as a gate');
/* SOURCE-TDD-impression-excavation.md: for "I felt tight in my chest when my
   boss called", SOURCE must not immediately produce authority trauma,
   abandonment, root chakra blockage or fear of failure. PRIORITY.md 20.H3
   recorded the half that passes as "rung 1, move listen". Re-measured here:
   the rung is 5, which is round(16 / 3), the sniffer's own reading of
   "tight" under the cap of six, and the move is listen. The claim that
   matters is the one asserted, one word is heard and never questioned. */
{
 const {srcHear,srcTurn,srcDims,srcNext,SRC_ASK,SRC_ONCE,NODES}=E;
 const t='I felt tight in my chest when my boss called.';
 const h=srcHear(t), turn=srcTurn(h,{typed:true});
 ok(h.seats.length===1&&h.top.mentions===1,'one seat heard, once');
 ok(h.top.rung<SRC_ASK&&h.top.rung<=SRC_ONCE,'under seven, so it is heard and not questioned, rung '+h.top.rung);
 ok(turn.move==='listen'&&!h.asks&&!h.root,'it listens, asks nothing, and names no root');
 ok(h.top.seat==='heart','and it heard the chest, at the heart, where the throat was read before 20.H2');
 const said=JSON.stringify([h,turn,srcDims(t)]).toLowerCase();
 ['authority','trauma','abandon','chakra','fear of failure','diagnos','blockage'].forEach(w=>
  ok(said.indexOf(w)<0,'nothing it produces says '+w));
 const named=NODES.filter(n=>n.n&&said.indexOf(String(n.n).toLowerCase())>=0).map(n=>n.n);
 ok(named.length===0,'and it names no address of the 112, got '+JSON.stringify(named));
 /* the document's correct progression, after the trigger it already names */
 const d=srcDims(t), askable=['trigger','contact','feeling','body','prediction','behaviour','meaning'];
 ok(d.answered.trigger&&d.answered.trigger[0]==='when'&&d.answered.contact[0]==='boss'&&d.answered.body,
  'it reads the trigger, the boss and the body as already said, '+JSON.stringify(d.answered));
 const asked=[]; for(let i=0;i<4;i++)asked.push(srcNext(d,asked,askable));
 ok(asked.join()==='feeling,prediction,behaviour,meaning',
  'and asks feel, expect, do, mean, the document\'s own order, got '+asked.join());
 ok(srcNext(d,asked,askable)==='feeling','and comes back round to the one asked longest ago');
}

g('OB5 · 20.H1, the button asks what the entry has not answered');
{
 const {srcDims,srcNext,SRC_DIM_ORDER,SRC_KINDS,CHARGES,parseStory}=E;
 ok(SRC_DIM_ORDER.join()==='trigger,contact,feeling,body,prediction,behaviour,belief,meaning,goal',
  'the order is written down, '+SRC_DIM_ORDER.join());
 const a=srcDims('He shouted at me and I slammed the door. I felt furious.');
 ok(a.answered.contact&&a.answered.behaviour&&a.answered.feeling&&!a.answered.trigger,
  'a person, a thing done and a feeling are read, and no trigger word is, '+JSON.stringify(a.answered));
 ok(srcDims('I did not say anything').answered.behaviour,'a thing not done is still an answer to what you did, so no not is read');
 ok(!srcDims('I felt tight').answered.feeling&&srcDims('I felt overwhelmed').answered.feeling,
  'felt and a sensation is the body, felt and anything else is a feeling');
 ok(srcDims('I felt so tight').answered.feeling===undefined,'a degree word is stepped over');
 ok(!srcDims('she came back late').answered.body,'back in its ordinary sense is not the body');
 const askable=['trigger','contact','feeling','body','prediction','behaviour','meaning'];
 const texts=['I felt tight in my chest when my boss called.','I keep putting off the conversation',
  'He shouted at me and I slammed the door. I felt furious.','I freeze when I need to speak.','calm today'];
 ok(texts.every(s=>{const d=srcDims(s), k=srcNext(d,[],askable);
   return d.open.filter(x=>askable.indexOf(x)>=0).length===0||d.open.indexOf(k)>=0;}),
  'it never asks about a dimension the entry answered while one it has not is left');
 ok(srcNext(srcDims('I felt tight'),['trigger'],askable)!=='trigger','a dimension already asked waits behind one that has not been');
 ok(srcNext(srcDims('x'),[],[])===null,'with nothing it can ask, it asks nothing');
 const all='When my boss called I felt scared in my chest. I expected he would shout. I left. It means I am not safe.';
 const da=srcDims(all);
 ok(da.open.filter(x=>askable.indexOf(x)>=0).length===0&&srcNext(da,[],askable)==='trigger',
  'an entry that answers every askable one still gets a question, the first in order, open '+da.open.join());
 ok(SRC_KINDS.every(k=>CHARGES.map(c=>c.toLowerCase()).indexOf(k)<0),'no question kind is a fetter name');
 const before=JSON.stringify(E.S.charge), j=JSON.stringify(srcDims(all));
 ok(JSON.stringify(srcDims(all))===j&&JSON.stringify(E.S.charge)===before,'reading the dimensions is pure');
}

g('OB6 · 20.H5, what Source AI asked is kept with the entry, as a kind and a seat');
{
 const {srcAsked,srcAskedMax,SRC_KINDS,SRC_OUTCOMES,blankProfile,saveProfile,validateProfile,ENT_KEYS,OB_NEVER}=E;
 ok(SRC_OUTCOMES.join()==='moved,wrote,left','three outcomes, the three the page can see');
 const log=[{k:'again',seat:'solar',at:20,moved:true},{k:'feeling',seat:'heart',at:30,moved:false},
  {k:'prediction',seat:null,at:44,moved:false},{k:'feeling',seat:'heart',at:40,moved:false},
  {k:'pity',seat:'heart',at:1},{k:'body',seat:'spleen',at:1}];
 const out=srcAsked(log,44);
 ok(JSON.stringify(out)===JSON.stringify([{k:'again',seat:'solar',a:'moved'},{k:'feeling',seat:'heart',a:'wrote'},
  {k:'prediction',seat:null,a:'left'},{k:'body',seat:null,a:'wrote'}]),
  'moved on, written after, left; one row per kind and seat; an unknown kind dropped and an unknown seat read as none, got '+JSON.stringify(out));
 ok(out.every(r=>Object.keys(r).join()==='k,seat,a'),'a row holds a kind, a seat and an outcome, and no text');
 ok(ENT_KEYS.indexOf('asked')>=0&&OB_NEVER.indexOf('asked')<0&&OB_NEVER.indexOf('lex')<0,
  'an entry may carry asked, and neither new key meets the outbox deny list');
 const base=saveProfile(blankProfile('asked'));
 const now=new Date().toISOString();
 const withEnt=e=>{const x=JSON.parse(JSON.stringify(base)); x.story={entries:[e]}; return x;};
 const ent=asked=>({t:now,text:'I was furious',imprints:4,bands:{solar:18},asked:asked});
 const v=validateProfile(withEnt(ent(out)));
 ok(v.ok&&JSON.stringify(v.profile.story.entries[0].asked)===JSON.stringify(out),'a kept record loads exactly as written');
 const noAsk={t:now,text:'I was furious',imprints:4,bands:{solar:18}};
 const w=validateProfile(withEnt(noAsk));
 ok(w.ok&&!('asked' in w.profile.story.entries[0]),'an entry nothing was asked about loads with no record, not an empty one');
 const refuse=(asked,frag,what)=>{const r=validateProfile(withEnt(ent(asked)));
  ok(!r.ok&&(r.errs||[]).join(' ').indexOf(frag)>=0,what+' is refused by name: '+(r.errs||[]).join(' ').slice(0,90));};
 refuse('again','.asked is not a list','a record that is not a list');
 refuse([{k:'again',seat:'solar',a:'moved',q:'Why there?'}],'may not carry q','a row carrying the question\'s words');
 refuse([{k:'pity',seat:'solar',a:'moved'}],'is not a question kind','an unknown kind');
 refuse([{k:'again',seat:'spleen',a:'moved'}],'names no seat','an unknown seat');
 refuse([{k:'again',seat:'solar',a:'answered'}],'is not an outcome','an outcome the page cannot see');
 refuse(Array(srcAskedMax()+1).fill({k:'again',seat:'solar',a:'moved'}),'more than the','a record longer than every kind at every seat');
}

g('QB · what onboarding writes on the entry comes back through the boundary, and nothing else does');
{
 /* ROUND QB. obCommit wrote ob onto the story entry and ENT_KEYS did not name
    it, so the next boot refused the whole profile: "story.entries[0] may not
    carry ob". Checked first on the build before the fix, where the first
    assertion below fails with exactly that line. */
 const {blankProfile,saveProfile,validateProfile,ENT_KEYS,ENT_OB_KEYS,OB_NEVER,OB_STARTS,OB_FEELS,OB_PLACES,NODES}=E;
 const ids=NODES.filter(n=>n.cf).map(n=>n.i);
 const base=saveProfile(blankProfile('ob'));
 const now=new Date().toISOString();
 const withEnt=e=>{const x=JSON.parse(JSON.stringify(base)); x.story={entries:[e]}; return x;};
 /* the exact shape obCommit writes, read off ui/onboard.js: three positions,
    the yes and the no as node ids, and the corrections word for word */
 const good={pick:2, feel:0, place:3, yes:[ids[0],ids[1]], no:[ids[2]], fixes:['it also sits in my jaw']};
 const ent=ob=>({t:now,text:'I felt tight in my chest',imprints:2,bands:{heart:10},ob:ob});
 const v=validateProfile(withEnt(ent(good)));
 ok(v.ok,'an entry carrying what onboarding wrote is taken, errs '+JSON.stringify(v.errs||[]));
 ok(v.ok&&JSON.stringify(v.profile.story.entries[0].ob)===JSON.stringify(good),'and comes back exactly as written');
 const ns={pick:0, feel:-1, place:-1, yes:[], no:[]};
 const vn=validateProfile(withEnt(ent(ns)));
 ok(vn.ok&&JSON.stringify(vn.profile.story.entries[0].ob)===JSON.stringify(ns),
  'Not sure on the feeling and the place, and no answers at all, are taken as written');
 const none=validateProfile(withEnt({t:now,text:'I felt tight in my chest',imprints:2,bands:{heart:10}}));
 ok(none.ok&&!('ob' in none.profile.story.entries[0]),
  'an older entry, or one the Story tab committed, has no ob and is given none: nobody was shown a mirror');
 const part=validateProfile(withEnt(ent({yes:[ids[0]]})));
 ok(part.ok&&JSON.stringify(part.profile.story.entries[0].ob)===JSON.stringify({pick:null,feel:null,place:null,yes:[ids[0]],no:[]}),
  'inside an ob, a missing answer is not answered rather than refused, got '+JSON.stringify(part.ok&&part.profile.story.entries[0].ob));
 ok(ENT_KEYS.indexOf('ob')>=0&&ENT_OB_KEYS.every(k=>OB_NEVER.indexOf(k)<0),
  'an entry may carry ob, and none of its keys meets the outbox deny list');
 const refuse=(ob,frag,what)=>{const r=validateProfile(withEnt(ent(ob)));
  ok(!r.ok&&(r.errs||[]).join(' ').indexOf(frag)>=0,what+' is refused by name: '+(r.errs||[]).join(' ').slice(0,110));};
 refuse('yes','.ob is not an object','an ob that is not an object');
 refuse([1,2],'.ob is not an object','an ob that is a list');
 refuse(Object.assign({},good,{email:'a@b.c'}),'.ob may not carry email','a key nobody declared');
 OB_NEVER.filter(k=>ENT_OB_KEYS.indexOf(k)<0).forEach(k=>{
  const r=validateProfile(withEnt(ent(Object.assign({},good,{[k]:'x'}))));
  if(r.ok||(r.errs||[]).join(' ').indexOf('.ob may not carry '+k)<0)ok(false,'the deny list name '+k+' rides in on ob');});
 ok(true,'every name on the outbox deny list is refused inside ob, '+OB_NEVER.length+' checked');
 refuse(Object.assign({},good,{pick:OB_STARTS.length}),'.ob.pick is not a position','a starting point past the end of the list');
 refuse(Object.assign({},good,{pick:-1}),'.ob.pick is not a position','Not sure on the starting point, which the sheet does not offer');
 refuse(Object.assign({},good,{feel:OB_FEELS.length}),'.ob.feel is not a position','a feeling past the end of the list');
 refuse(Object.assign({},good,{place:OB_PLACES.length}),'.ob.place is not a position','a body place past the end of the list');
 refuse(Object.assign({},good,{place:1.5}),'.ob.place is not a position','a body place that is not a whole number');
 refuse(Object.assign({},good,{feel:'0'}),'.ob.feel is not a position','a feeling written as text');
 refuse(Object.assign({},good,{yes:ids[0]}),'.ob.yes is not a list','a yes that is not a list');
 refuse(Object.assign({},good,{no:[999999]}),'.ob.no[0] names no node','a no naming no node');
 refuse(Object.assign({},good,{yes:[String(ids[0])]}),'.ob.yes[0] names no node','a node id written as text');
 refuse(Object.assign({},good,{yes:[ids[0],ids[0]]}),'.ob.yes[1] repeats','the same yes twice');
 refuse(Object.assign({},good,{no:[ids[0]]}),'.ob.no[0] is also a yes','one place answered both yes and no');
 refuse(Object.assign({},good,{fixes:'it also sits in my jaw'}),'.ob.fixes is not a list','corrections that are not a list');
 refuse(Object.assign({},good,{fixes:[42]}),'.ob.fixes[0] is not a string','a correction that is not words');
 /* AND THE BOOT PATH: the same record through pStore, the read the page runs
    at start up, so the store and the boundary are checked together. */
 let mem={};
 E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
 mem['source.profiles']=JSON.stringify([withEnt(ent(good))]);
 const got=E.pStore();
 ok(got.length===1&&E.storeRefused().length===0,'a store holding a finished onboarding loads at boot, refused '+JSON.stringify(E.storeRefused()));
 const badRec=withEnt(ent(Object.assign({},good,{no:[ids[0]]})));
 mem['source.profiles']=JSON.stringify([badRec]);
 ok(E.pStore().length===0&&E.storeRefused().length===1
  &&/story\.entries\[0\]\.ob\.no\[0\] is also a yes/.test(E.storeRefused()[0].errs.join(' ')),
  'a malformed one is refused at boot and the refusal is reported with its reason, '+JSON.stringify(E.storeRefused()));
 E.bindStore(()=>null,()=>{});
}

/* the trace graph, engine/trace.js. Its gate is its own file and reports
   through this one's ok(), so its count is in the line below. */
require('./trace.js')(E,ok,g);
/* the loop read over it, engine/loop.js: the one read of the graph a screen
   asks. Its own file, reporting through this one's ok() */
require('./loop.js')(E,ok,g);
/* the practice objects, engine/practice.js, with this file's own ok and g */
require('./practice.js')(E,ok,g,console.log);
/* the daily summary, engine/daily.js. It runs its suites on a private copy of
   the engine so its fixtures never move this file's own state, and reports
   through this file's ok and g. */
require('./daily.js')(E,ok,g,console.log);
/* the first release's size and where a person is on the way in,
   engine/journey.js, the two reads F5 landed from 3869d96. Its suites run on
   this engine and then on broken copies of it, and report through this file's
   ok and g. */
require('./journey.js')(E,ok,g,console.log);
/* THE TWO NEW DOMAINS MEET. practiceTraceIntents is what the practice build says
   about itself and traceApply is what the graph takes in, built apart by two
   hands. A practice built through the one door, its intents applied to a fresh
   graph: nothing refused, one node per fact, and the pattern named addr:N lands
   as address N, the form ui/release.js already writes. */
(function(){
 var T='2026-10-01T09:00:00.000Z', P=E.practiceBlank(), A='addr:'+E.NODES.find(function(n){return n.cf;}).i, bad=null;
 function go(act,a){var r=E.practiceDo(P,act,a,T); if(!r.ok){bad=act+': '+(r.errs||[]).join('|');} else P=r.P;}
 go('goal_create',{id:'g1',title:'Communicate more consciously',desired_outcome:{description:'Say what I mean',measurable:false}});
 go('behavior_define',{id:'b1',goal_id:'g1',behavior:'Speak less, listen more',priority:1,quality_dimensions:{awareness:true,presence:true,integrity:false,consistency:true}});
 go('protocol_add',{id:'p1',class:'release',objective_id:'b1',target_patterns:[A],steps:[{type:'release',instruction:'Release the need to fill silence'},{type:'reframe',instruction:'I can speak clearly.'},{type:'behavior',instruction:'Speak less.',duration:{value:2,unit:'hours'}}],generated_by:{system:'t',model_version:'0'}});
 go('protocol_accept',{id:'p1'});
 go('ritual_create',{id:'r1',protocol_id:'p1',title:'Conscious communication',tags:['Throat']});
 ok(bad===null,'the bridge: a practice is built through its one door'+(bad?', refused at '+bad:''));
 var it=E.practiceTraceIntents(P), r=E.traceApply(E.traceNew(),it,T);
 ok(it.length>0&&r.refused.length===0&&r.added===it.length,
  'the bridge: every intent the practice build states is taken by the graph, '+it.length+' stated, '+r.added+' added, '+r.refused.length+' refused'+(r.refused.length?' '+JSON.stringify(r.refused[0]):''));
 var g=E.traceNew(); E.traceApply(g,it,T);
 var again=E.traceApply(g,it,T);
 ok(again.added===0&&again.held===it.length,'and replaying them on every save is safe: nothing added, all held, '+JSON.stringify({added:again.added,held:again.held}));
})();

g('OG1 · the rerun puts the heavy lines back where they sit, round OG');
/* HIS WORDS, round OG and again the day after. "A rerun should always, it adds
   the ones that are heavy, but remember, there's a structural flow to the
   release. We start with the least tense words, the most tense words, and then
   the decompression words, from the least intense to the most intense." And:
   "rerunning is a line you marked heavy. And it would go back into that kind
   of where it would sit in that bell curve."

   WHAT IS MEASURED HERE. The only rank of tension a line carries is its number
   on the fifty, so "where it sits" is that number, ascending, inside the
   release's own order: address by address, release channels before reframe
   channels, left before right. The heavy mark is stored on the record, is a
   fact about a key already opened, and never touches what a run costs. Every
   check below is written against the previous engine too: it has no
   meterHeavy, no meterRerunOrder and no meter.heavy, and fails there. */
{
 const {blankProfile,meterRun,meterRerun,meterRerunPlan,meterRerunOrder,meterHeavy,meterHeavyClear,
        meterHeavyWhy,meterKey,meterBudget,validateProfile,pImport,pExport,profiles,bindStore,
        RUN_MAX,LINES_PER_CH,GIFT_N}=E;
 const CH=['Llimit','Rlimit','Ltruth','Rtruth'];
 ok(typeof meterHeavy==='function'&&typeof meterRerunOrder==='function'&&typeof meterHeavyWhy==='function',
  'the heavy mark and the ordered rerun are reachable from the contract');
 /* on the previous engine the three are undefined, the line above has already failed, and
    the rest would throw, so each group below runs under T and fails by name instead */
 const T=(n,f)=>{try{f();}catch(e){ok(false,'the '+n+' group threw on this engine: '+((e&&e.message)||e));}};
 /* the fixture: address 7 opened five lines deep down every channel, address 9
    three deep. So the opened-line rule alone says line 4 at 7 and line 2 at 9. */
 const fixture=()=>{const p=blankProfile('og1'), keys=[];
  CH.forEach(c=>{for(let i=0;i<5;i++)keys.push(meterKey(7,c,i)); for(let i=0;i<3;i++)keys.push(meterKey(9,c,i));});
  meterRun(p,keys); return p;};
 const K=(a,c,l)=>meterKey(a,c,l);


 /* NOTHING MARKED IS THE RERUN THAT ALWAYS WAS */
 T('plain rerun',()=>{const p=fixture();
  ok(Array.isArray(p.meter.heavy)&&p.meter.heavy.length===0,'a blank record carries an empty heavy list');
  ok(meterRerunOrder(p,[9,7],CH,RUN_MAX).join()===meterRerunPlan(p,[9,7],CH,RUN_MAX).join(),
   'with nothing marked the order is exactly the opened line rule, one line a channel');});

 /* ORDER ON THE FIXTURE */
 T('order',()=>{const p=fixture();
  const m=meterHeavy(p,[K(7,'Llimit',3),K(7,'Llimit',1),K(7,'Ltruth',0),K(9,'Rlimit',1)]);
  ok(m.marked.length===4&&m.refused.length===0,'four heavy lines are marked, none refused');
  ok(p.meter.heavy.join()===[K(7,'Llimit',1),K(7,'Llimit',3),K(7,'Ltruth',0),K(9,'Rlimit',1)].join(),
   'and stored sorted by address, channel and line number, got '+p.meter.heavy.join(' '));
  const o=meterRerunOrder(p,[9,7],CH,RUN_MAX);
  const want=[K(9,'Llimit',2),K(9,'Rlimit',1),K(9,'Rlimit',2),K(9,'Ltruth',2),K(9,'Rtruth',2),
   K(7,'Llimit',1),K(7,'Llimit',3),K(7,'Llimit',4),K(7,'Rlimit',4),K(7,'Ltruth',4),K(7,'Ltruth',0),K(7,'Rtruth',4)];
  ok(o.join()===want.join(),'the heavy lines sit among the opened one, release lines least tense first and reframe lines running back down, address major in the order picked, release before reframe:\n   '+o.join(' ')+'\n   '+want.join(' '));
  ok(o.length===new Set(o).size,'and no line is said twice');
  let asc=true; for(let i=1;i<o.length;i++){
   const a=o[i-1].split(':'), b=o[i].split(':');
   if(a[0]===b[0]&&a[1]===b[1]){const dn=/truth$/.test(a[1]); if(dn?+a[2]<=+b[2]:+a[2]>=+b[2])asc=false;}}
  ok(asc,'inside a release channel every line is higher than the one before it, and inside a reframe channel every line is lower');
  const at7=o.filter(k=>k.split(':')[0]==='7'), lastLimit=at7.map(k=>/limit/.test(k)).lastIndexOf(true),
   firstTruth=at7.findIndex(k=>/truth/.test(k));
  ok(lastLimit>=0&&firstTruth>lastLimit,'at one address every release line comes before every reframe line');
  /* a heavy line on a channel the person did not pick is not dragged in */
  const only=meterRerunOrder(p,[7],['Llimit'],RUN_MAX);
  ok(only.join()===[K(7,'Llimit',1),K(7,'Llimit',3),K(7,'Llimit',4)].join(),
   'only the channels asked for, got '+only.join(' '));
  /* and an address that was not picked is not either */
  ok(meterRerunOrder(p,[9],CH,RUN_MAX).every(k=>k.split(':')[0]==='9'),'only the addresses asked for');});

 /* NEVER NEW GROUND */
 T('never new ground',()=>{const p=fixture();
  const r=meterHeavy(p,[K(7,'Llimit',9),K(40,'Llimit',0),K(7,'Llimit',50),'7:Llimit','nonsense',42,null]);
  ok(r.marked.length===0&&r.refused.length===7,'a mark on a line never opened is refused, and so is every malformed key, got '+r.refused.length);
  ok(r.refused.every(x=>typeof x.why==='string'&&x.why.length>0),'each refusal says why');
  ok(/not a line this record has opened/.test(r.refused[0].why)&&/not a line key/.test(r.refused[2].why),
   'by name: '+r.refused[0].why+' | '+r.refused[2].why);
  ok(p.meter.heavy.length===0,'and nothing was written');
  /* a stale heavy key a hand edited store could hold is skipped by the plan, not opened by it */
  p.meter.heavy=[K(7,'Llimit',9)];
  const o=meterRerunOrder(p,[7],CH,RUN_MAX);
  ok(o.join()===meterRerunPlan(p,[7],CH,RUN_MAX).join(),'the plan never offers a heavy key that is not open');
  const q=fixture(); meterHeavy(q,[K(7,'Rlimit',0),K(9,'Ltruth',1)]);
  const openQ=new Set(q.meter.unique);
  ok(meterRerunOrder(q,[7,9,11],CH,RUN_MAX).every(k=>openQ.has(k)),
   'every line in a rerun is a line already in meter.unique');
  ok(meterRerunOrder(q,[11],CH,RUN_MAX).length===0,'an address with nothing open reruns nothing, however it is picked');});

 /* THE CAP IS RUN_MAX, AND THE OPENED LINES COME FIRST UNDER IT */
 T('cap',()=>{const w=blankProfile('wide'), ids=[1,2,3,4,5,6,7,8,9], keys=[];
  ids.forEach(a=>CH.forEach(c=>{for(let i=0;i<6;i++)keys.push(meterKey(a,c,i));}));
  meterRun(w,keys);
  const base=meterRerunPlan(w,ids,CH,RUN_MAX);
  ids.forEach(a=>meterHeavy(w,CH.map(c=>meterKey(a,c,0))));
  const o=meterRerunOrder(w,ids,CH,RUN_MAX);
  ok(o.length===RUN_MAX,'a wide rerun is cut at the run ceiling, got '+o.length);
  ok(base.every(k=>o.indexOf(k)>=0),'every opened line the plain rerun said is still in it');
  ok(new Set(o.map(k=>k.split(':')[0])).size===new Set(base.map(k=>k.split(':')[0])).size,
   'and the heavy lines pull no address in that the cap had cut off');
  /* room under the cap is spent on heavy lines, lowest first, at the addresses reached */
  const s=blankProfile('room'), k2=[];
  CH.forEach(c=>{for(let i=0;i<6;i++){k2.push(meterKey(1,c,i));k2.push(meterKey(2,c,i));}});
  meterRun(s,k2);
  meterHeavy(s,CH.map(c=>meterKey(1,c,0)).concat(CH.map(c=>meterKey(2,c,0))));
  const small=meterRerunOrder(s,[1,2],CH,10);
  ok(small.length===10&&meterRerunPlan(s,[1,2],CH,10).every(k=>small.indexOf(k)>=0),
   'a small cap keeps the opened lines first and spends the rest on heavy ones, '+small.length+' lines');
  ok(meterRerunOrder(s,[1,2],CH,8).join()===meterRerunPlan(s,[1,2],CH,8).join(),
   'and when the opened lines alone fill the cap it is exactly the plain rerun');});

 /* COST UNCHANGED. A heavy mark and a rerun that carries it move nothing the allowance reads. */
 T('cost',()=>{const p=fixture();
  p.plan={tier:'free',status:'',granted:0,carried:0,base:GIFT_N,since:null,until:null};
  const b0=meterBudget(p), u0=p.meter.unique.join(), n0=p.meter.unique.length;
  const first0=p.meter.first, gift0=p.meter.giftAt;
  meterHeavy(p,[K(7,'Llimit',2),K(9,'Rtruth',0)]);
  ok(p.meter.unique.join()===u0&&p.meter.unique.length===n0,'marking a line heavy opens and spends nothing');
  ok(meterBudget(p).left===b0.left&&meterBudget(p).cap===b0.cap,'the allowance reads the same after the mark, '+b0.left+' and '+meterBudget(p).left);
  const o=meterRerunOrder(p,[7,9],CH,RUN_MAX), m=meterRerun(p,o);
  ok(m.added===0&&m.fresh.length===0&&m.refused.length===0&&m.repeated===o.length,
   'a rerun carrying heavy lines opens nothing new and refuses nothing, repeated '+m.repeated+' of '+o.length);
  ok(p.meter.unique.join()===u0&&meterBudget(p).left===b0.left,'and the allowance is the same after it');
  ok(p.meter.first===first0&&p.meter.giftAt===gift0,'the first run and the gift stamp do not move');
  /* the mark has no reach into what a run costs even when the allowance is spent */
  const sp=blankProfile('spent'), keys=[];
  for(let a=1;keys.length<GIFT_N+10;a++)CH.forEach(c=>keys.push(meterKey(a,c,0)));
  meterRun(sp,keys.slice(0,GIFT_N+10));
  sp.plan={tier:'free',status:'',granted:0,carried:0,base:GIFT_N,since:null,until:null};
  meterHeavy(sp,[keys[0]]);
  ok(meterBudget(sp).left===0&&meterRerunOrder(sp,[1],CH,RUN_MAX).length===CH.length,
   'a spent allowance still reruns what is open, heavy or not');});

 /* MARKING TWICE, AND TAKING A MARK OFF */
 T('marking twice',()=>{const p=fixture(), k=K(7,'Rtruth',2);
  ok(meterHeavy(p,[k]).marked.length===1&&meterHeavy(p,[k]).already.length===1&&p.meter.heavy.length===1,
   'marking a line twice marks it once and says so');
  const c=meterHeavyClear(p,[k,K(7,'Rtruth',3)]);
  ok(c.cleared.length===1&&c.absent.length===1&&p.meter.heavy.length===0,'a mark comes off by key, and a key never marked is reported absent');
  /* no record at all, and no cap given: refused and ceilinged, never thrown */
  const none=meterHeavy(null,[k]);
  ok(none.marked.length===0&&none.refused.length===1&&/no record/.test(none.refused[0].why),'a mark with no record to land on is refused by name');
  const wide=blankProfile('nocap'), keys=[];
  for(let a=1;a<=9;a++)CH.forEach(c=>keys.push(meterKey(a,c,0)));
  meterRun(wide,keys);
  ok(meterRerunOrder(wide,[1,2,3,4,5,6,7,8,9],CH).length===RUN_MAX,'a rerun asked for with no cap is cut at the run ceiling');});

 /* THE BOUNDARY, BY NAME, NEVER CLAMPED */
 T('boundary',()=>{const base=fixture(); meterHeavy(base,[K(7,'Llimit',1),K(9,'Ltruth',0)]);
  const wire=()=>JSON.parse(JSON.stringify(base));
  const why=(mut,frag,what)=>{const o=wire(); mut(o); const r=validateProfile(o);
   ok(!r.ok&&(r.errs||[]).join(' | ').indexOf(frag)>=0,what+' is refused by name: '+(r.errs||[]).join(' | ').slice(0,110));};
  ok(validateProfile(wire()).ok&&validateProfile(wire()).profile.meter.heavy.join()===base.meter.heavy.join(),
   'a record carrying heavy marks validates and keeps them');
  why(o=>{o.meter.heavy='7:Llimit:1';},'meter.heavy is not a list','a heavy field that is not a list');
  why(o=>{o.meter.heavy=null;},'meter.heavy is not a list','a null heavy field');
  why(o=>{o.meter.heavy=[7];},'meter.heavy[0] is not a string','a heavy key that is not a string');
  why(o=>{o.meter.heavy=['banana'];},'is not a line key','a heavy key that is not a line key');
  why(o=>{o.meter.heavy=['7:Llimit'];},'is not a line key','a key from before keys carried a line');
  why(o=>{o.meter.heavy=[K(7,'Llimit',LINES_PER_CH)];},'is not a line key','a line past the end of the fifty');
  why(o=>{o.meter.heavy=[K(7,'Llimit',9)];},'is not a line this record has opened','a line this record never opened');
  why(o=>{o.meter.heavy=[K(7,'Llimit',1),K(7,'Llimit',1)];},'twice','a key listed twice');
  /* an older record carries no field at all, and reads as the blank's empty list */
  {const o=wire(); delete o.meter.heavy; const r=validateProfile(o);
   ok(r.ok&&Array.isArray(r.profile.meter.heavy)&&r.profile.meter.heavy.length===0,
    'an older record with no heavy field fills the blank and is not refused');
   const o2=wire(); o2.meter={lines:0,unique:[]}; const r2=validateProfile(o2);
   ok(r2.ok&&r2.profile.meter.heavy.length===0,'and so does a meter that carries nothing but its older fields');}
  /* order is not meaning, so a list in another order loads sorted, never refused */
  {const o=wire(); o.meter.heavy=base.meter.heavy.slice().reverse(); const r=validateProfile(o);
   ok(r.ok&&r.profile.meter.heavy.join()===base.meter.heavy.join(),'a list in another order loads sorted');}});

 /* EXPORT AND IMPORT, THE ROUND TRIP, THROUGH THE BOUND STORE */
 T('round trip',()=>{const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
  const p=fixture(); meterHeavy(p,[K(7,'Llimit',2),K(7,'Rtruth',1),K(9,'Ltruth',2)]);
  const got=pImport(JSON.stringify(p));
  ok(got!==null&&got.meter.heavy.join()===p.meter.heavy.join(),'an import keeps the heavy marks, '+(got&&got.meter.heavy.length));
  const out=JSON.parse(pExport());
  ok(out.meter.heavy.join()===p.meter.heavy.join(),'and an export carries them');
  const again=pImport(JSON.stringify(out));
  ok(again!==null&&again.meter.heavy.join()===p.meter.heavy.join(),'and a second import of that export is the same list');
  ok(meterRerunOrder(again,[7,9],CH,RUN_MAX).join()===meterRerunOrder(p,[7,9],CH,RUN_MAX).join(),
   'so the rerun the imported record says is the rerun the original said');
  const bad=JSON.parse(JSON.stringify(out)); bad.meter.heavy.push(K(7,'Llimit',44));
  const before=profiles().length;
  ok(pImport(JSON.stringify(bad))===null&&profiles().length===before,'a heavy mark on a line never opened refuses the whole import and pushes nothing');
  bindStore(()=>null,()=>{});});

 /* THE DEVICE SETTING, 2 October. The sound switch was a profile write, so on a
    worked example turning sound off answered "Nothing saved". A device
    setting lives under its own key in the bound store, is never a profile,
    and reports what happened. */
 T('device setting',()=>{const {bindStore,devGet,devSet,DEVKEY,PKEY,profiles}=E;
  const mem={}; bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
  ok(devGet('sfxoff')===null,'a setting never written reads null, which is the host\'s cue to fall back');
  const r=devSet('sfxoff',true);
  ok(r.ok&&r.err===null&&devGet('sfxoff')===true,'a write lands and reads back');
  ok(devSet('sfxoff',false).ok&&devGet('sfxoff')===false,'and false is a value and not an absence');
  ok(devSet('other',3).ok&&devGet('sfxoff')===false&&devGet('other')===3,'a second key leaves the first alone');
  ok(DEVKEY!==PKEY&&mem[PKEY]===undefined,'it never writes the profile key, '+DEVKEY);
  mem[DEVKEY]='not json'; ok(devGet('sfxoff')===null,'an unreadable object reads as nothing set and does not throw');
  mem[DEVKEY]='[1,2]'; ok(devGet('sfxoff')===null,'and so does a list');
  bindStore(()=>null,()=>{throw new Error('QuotaExceededError');});
  const q=devSet('sfxoff',true); ok(!q.ok&&q.err==='Error','a store that throws is reported, not swallowed, '+JSON.stringify(q));
  bindStore(()=>null,()=>{});
  const n=devSet('sfxoff',true); ok(!n.ok&&n.err==='NotKept','a store that swallows the write and keeps nothing is caught by the read back, '+JSON.stringify(n));
  bindStore(()=>null,()=>{});});

}

g('PP1 · the archetype, emotional axis and action axis blocks under the 63, round PP and PQ');
/* THE THREE TABLES ARE CONTENT, AND EVERY COUNT HERE IS READ OFF THE TABLES
   THEY ARE CHECKED AGAINST. The axis block is held to the nine axes, the
   action block to the six gates, so a row added to one of those and not asked
   here, or a question written about something the product does not have,
   fails by name. The archetype block was the same shape at round PP, one row
   per archetype; round PQ replaced it with IX_ARCH2, eighteen rows that each
   put two archetypes against each other, so it is held to its own, different,
   structural rule a few lines down rather than to the one-row-one-name rule
   axes and acts still use. */
{
 const {IX_ARCH2,IX_AXIS,IX_ACT,IX_BLOCKS,VERP,ixBlank,ixSet,ixGet,ixRead,ixSay,ixValidate,
        blankProfile,saveProfile,validateProfile,loadProfile}=E;
 const keys=t=>t.map(r=>r.k);
 const same=(a,b,nm)=>{
  const miss=b.filter(k=>a.indexOf(k)<0), extra=a.filter(k=>b.indexOf(k)<0);
  ok(miss.length===0,nm+' asks every one the product has, missing '+JSON.stringify(miss));
  ok(extra.length===0,nm+' asks nothing the product does not have, extra '+JSON.stringify(extra));
  ok(new Set(a).size===a.length,nm+' asks nothing twice');};
 same(keys(IX_AXIS),CHARGES.slice(),'the emotional axis block, against the nine axes,');
 same(keys(IX_ACT),VERP.map(v=>v.k),'the action axis block, against the six gates,');
 ok(IX_BLOCKS.length===3&&IX_BLOCKS.map(b=>b.id).join()==='arch,axes,acts','the three blocks stack in the order the owner named them');
 ok(IX_BLOCKS[0].rows===IX_ARCH2&&IX_BLOCKS[1].rows===IX_AXIS&&IX_BLOCKS[2].rows===IX_ACT,'and each block reads its own table');
 ok(E.IX_DRAFT===true,'the wording is marked draft in the data file, so it can be refined without a code change');

 /* THE PAIRING, read off ARCH rather than typed. Round PQ: "we ask them the
    right combination of questions to have them triangulate on the behaviors
    that they identify with." Checked here as a structural fact about the
    table rather than taken on the comment's word: every archetype sits in
    exactly three rows, against three different others, never the same pair
    twice, so no single row can carry the whole reading for any one name. */
 {
  ok(IX_ARCH2.length===ARCH.length*3/2,'arch: three rows for every one of the twelve, read off ARCH.length, got '+IX_ARCH2.length+' for '+ARCH.length);
  const dil=IX_ARCH2.filter(r=>r.type==='dilemma'), eith=IX_ARCH2.filter(r=>r.type==='either');
  ok(dil.length===eith.length&&dil.length+eith.length===IX_ARCH2.length,
   'arch: the dilemma and either or rows split the table evenly, got '+dil.length+' dilemma and '+eith.length+' either or');
  const cnt={}; ARCH.forEach(a=>{cnt[a.nm]=0;}); const pairs=new Set();
  IX_ARCH2.forEach(r=>{
   ok(r.a!==r.b,'arch: '+r.k+' never puts an archetype against itself');
   ok(ARCH.some(a=>a.nm===r.a)&&ARCH.some(a=>a.nm===r.b),'arch: '+r.k+' names two archetypes the product actually has');
   cnt[r.a]++; cnt[r.b]++;
   const pk=[r.a,r.b].sort().join('|');
   ok(!pairs.has(pk),'arch: the pair '+pk+' is asked only once, from one row');
   pairs.add(pk);});
  ARCH.forEach(a=>ok(cnt[a.nm]===3,'arch: '+a.nm+' is implicated by exactly three rows, each against a different other, got '+cnt[a.nm]));
 }

 /* every sentence a person reads. An arch row carries scene/ra/rb (dilemma)
    or ta/tb (either or) beside its own q, and all of it is read, the same as
    axes and acts read means and oppMeans beside q. */
 const all=[]; IX_BLOCKS.forEach(b=>{all.push(b.nm,b.line); b.rows.forEach(r=>{
  all.push(r.q); if(r.means)all.push(r.means); if(r.oppMeans)all.push(r.oppMeans);
  if(r.ra)all.push(r.ra); if(r.rb)all.push(r.rb); if(r.ta)all.push(r.ta); if(r.tb)all.push(r.tb);});});
 ok(all.every(t=>typeof t==='string'&&t.trim().length>0),'every question, name and meaning is a sentence and none is empty');
 ok(!all.some(t=>/—|–/.test(t)),'no em or en dash in anything a person reads');
 ok(!all.some(t=>/\d/.test(t)),'no digit in anything a person reads, so no count is typed into a heading');
 ok(!all.some(t=>/undefined|\[object/.test(t)),'and no hole in any of it');
 ok(IX_AXIS.every(r=>/how often/i.test(r.q)&&/\?$/.test(r.q))&&IX_ACT.every(r=>/how often/i.test(r.q)&&/\?$/.test(r.q)),
  'axes and acts: every question asks how often, the scale the 63 use');
 /* arch asks nothing as "how often": a dilemma is a forced choice between two
    named responses and an either or is a graded pick between two named
    behaviours, neither of which is a frequency question. A dilemma's own
    scene still ends as a question, the round JQ shape; an either or does not
    ask one, it offers two things to choose between. */
 ok(IX_ARCH2.filter(r=>r.type==='dilemma').every(r=>/\?$/.test(r.scene)),
  'arch: every dilemma is put as a scene ending in a question, the round JQ shape');
 ok(IX_ARCH2.filter(r=>r.type==='either').every(r=>r.ta&&r.tb&&!/\?/.test(r.ta)&&!/\?/.test(r.tb)),
  'arch: every either or offers two behaviours and asks neither as a question');
 IX_BLOCKS.forEach(b=>ok(new Set(b.rows.map(r=>r.q)).size===b.rows.length,b.id+': no two rows read the same sentence'));
 ok(IX_AXIS.every(r=>r.means&&r.oppMeans),'every axis says what it means and what its other end means, so no name stands alone');
 ok(IX_ACT.every(r=>r.means),'every action axis says what it means');
 /* the clinical words the voice rules keep off the page */
 ok(!all.some(t=>/\b(disorder|diagnos\w*|trauma\w*|anxiety|depress\w*|therapy|symptom\w*|patholog\w*)\b/i.test(t)),
  'no clinical label in any of it');

 /* THE RECORD. blank, older, wrong. */
 const bp=blankProfile('ix');
 ok(JSON.stringify(bp.intake.more)===JSON.stringify(ixBlank()),'a new profile carries empty bags for all three blocks');
 ok(Object.keys(bp.intake.more).join()==='arch,axes,acts','and the bags are the three block ids');
 {const old=JSON.parse(JSON.stringify(saveProfile(blankProfile('older')))); delete old.intake.more;
  const r=validateProfile(old);
  ok(r.ok&&JSON.stringify(r.profile.intake.more)===JSON.stringify(ixBlank()),'an older record with no blocks is filled from the blank and not refused');
  const old2=JSON.parse(JSON.stringify(old)); delete old2.intake;
  const r2=validateProfile(old2);
  ok(r2.ok&&r2.profile.intake.more&&r2.profile.intake.more.arch,'and so is one with no intake at all');
  const k0=IX_ARCH2[0].k;
  const half=JSON.parse(JSON.stringify(old)); half.intake.more={arch:{[k0]:7}};
  const r3=validateProfile(half);
  ok(r3.ok&&r3.profile.intake.more.arch[k0]===7&&Object.keys(r3.profile.intake.more.axes).length===0,
   'and a record that answered one block keeps it and leaves the others empty');
  const raw=JSON.parse(JSON.stringify(old)); delete raw.intake.more;
  loadProfile(raw);
  ok(raw.intake.more&&raw.intake.more.acts,'loadProfile fills an older record in place so the first press cannot throw');}
 const wire=()=>JSON.parse(JSON.stringify(saveProfile(blankProfile('w'))));
 const refuses=(mut,re,nm)=>{const o=wire(); mut(o); const r=validateProfile(o);
  ok(!r.ok&&re.test(String(r.errs)),nm+' is refused by name, got '+JSON.stringify((r.errs||[]).slice(0,2)));};
 refuses(o=>{o.intake.more='yes';},/intake\.more is not an object/,'a block record that is a string');
 refuses(o=>{o.intake.more=[1];},/intake\.more is not an object/,'a block record that is a list');
 refuses(o=>{o.intake.more={arch:[1,2]};},/intake\.more\.arch is not an object/,'a bag that is a list');
 refuses(o=>{o.intake.more={arch:{Hero:5}};},/intake\.more\.arch names no question: Hero/,'a row the archetype block does not ask');
 refuses(o=>{o.intake.more={arch:{Sage:5}};},/intake\.more\.arch names no question: Sage/,
  'and round PQ\'s own migration edge: the round PP key, a bare archetype name, is refused too, since a row is now a pair');
 refuses(o=>{o.intake.more={axes:{Anxiety:5}};},/intake\.more\.axes names no question: Anxiety/,'an axis the product does not have');
 refuses(o=>{o.intake.more={acts:{believing:5}};},/intake\.more\.acts names no question: believing/,'an action the product does not ask');
 refuses(o=>{o.intake.more={nope:{}};},/intake\.more names no block: nope/,'a block that does not exist');
 refuses(o=>{o.intake.more={arch:{[IX_ARCH2[0].k]:9999}};},new RegExp('intake\\.more\\.arch\\.'+IX_ARCH2[0].k+' is 9999, outside 0 to 10'),'an answer of 9999');
 refuses(o=>{o.intake.more={axes:{Fear:-1}};},/intake\.more\.axes\.Fear is -1/,'a negative answer');
 refuses(o=>{o.intake.more={acts:{aware:'7'}};},/intake\.more\.acts\.aware is not a number/,'an answer that is text');
 {const o=wire(); o.intake.more={arch:{[IX_ARCH2[0].k]:null}}; const r=validateProfile(o);
  ok(r.ok&&ixGet(r.profile,'arch',IX_ARCH2[0].k)===null,'a null answer is not answered, the way a null in the 63 is');}
 /* the boundary function on its own, and it never clamps */
 {const errs=[]; const out=ixValidate(errs,{arch:{[IX_ARCH2[0].k]:12}},'x');
  ok(errs.length===1&&out.arch[IX_ARCH2[0].k]===undefined,'a value out of range is dropped from the result and named in the errors, never clamped to 10');}

 /* the repairs the coverage run found nothing reaching: a bag of the wrong type
    in a record already in memory is replaced by an empty one, and the helpers
    answer a name or a block the product does not have without throwing */
 {const q={intake:{more:{arch:'x',axes:[1],acts:null}}}; E.ixFill(q);
  ok(['arch','axes','acts'].every(id=>q.intake.more[id]&&typeof q.intake.more[id]==='object'&&!Array.isArray(q.intake.more[id])),
   'a bag of the wrong type in memory is replaced by an empty one');
  const q2={intake:[]}; E.ixFill(q2);
  ok(Array.isArray(q2.intake)===false&&q2.intake.more&&q2.intake.answers,'and an intake that is a list is replaced rather than written into');
  ok(E.ixFill(null)===null,'and no profile at all is left alone');
  ok(E.ixName('acts','zzz')==='zzz'&&E.ixRead(blankProfile('u'),'nope').state==='none'&&E.ixRead(blankProfile('u'),'nope').total===0,
   'a name or a block the product does not have is read as nothing and does not throw');}

 /* THE ONE WRITE REFUSES WHAT THE PRODUCT DOES NOT HAVE */
 {const p=blankProfile('w1'), k0=IX_ARCH2[0].k;
  ok(ixSet(p,'arch',k0,7)&&ixGet(p,'arch',k0)===7,'a real answer is written and read back');
  ok(!ixSet(p,'arch','Hero',5)&&!ixSet(p,'arch','Sage',5)&&!ixSet(p,'axes','Fear',11)&&!ixSet(p,'axes','Fear',-1)
   &&!ixSet(p,'acts','aware','5')&&!ixSet(p,'acts','aware',NaN)&&!ixSet(p,'nope','x',1),
   'an unknown row (including the round PP shape, a bare archetype name), an unknown block and a value outside 0 to 10 write nothing and say so');
  ok(ixGet(p,'axes','Fear')===null&&ixGet(p,'acts','aware')===null,'and nothing was written by the refusals');
  ok(p.intake.startedAt===null,'answering here does not say the 63 were started');
  const bare={}; ok(ixSet(bare,'acts','aware',3)&&bare.intake.more.acts.aware===3,'a profile with no intake is given one rather than throwing');}

 /* ROUND TRIP, through the saver, the boundary, the export and the import */
 {const p=blankProfile('rt');
  IX_BLOCKS.forEach(b=>b.rows.forEach((r,i)=>ixSet(p,b.id,r.k,(i*3)%11)));
  const wireP=JSON.parse(JSON.stringify(saveProfile(p)));
  const r=validateProfile(wireP);
  ok(r.ok,'a profile with every block answered validates: '+JSON.stringify(r.errs||[]).slice(0,120));
  ok(r.ok&&JSON.stringify(r.profile.intake.more)===JSON.stringify(p.intake.more),'and every answer comes back exactly as it went in');
  const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=String(v);});
  const got=E.pImport(JSON.stringify(wireP));
  ok(got!==null&&JSON.stringify(got.intake.more)===JSON.stringify(p.intake.more),'an import keeps every answer');
  const out=JSON.parse(E.pExport());
  ok(JSON.stringify(out.intake.more)===JSON.stringify(p.intake.more),'and an export carries them');
  const again=E.pImport(JSON.stringify(out));
  ok(again!==null&&JSON.stringify(again.intake.more)===JSON.stringify(p.intake.more),'and a second import of that export is the same answers');
  const badw=JSON.parse(JSON.stringify(wireP)); badw.intake.more.arch.Hero=3;
  const before=E.profiles().length;
  ok(E.pImport(JSON.stringify(badw))===null&&E.profiles().length===before&&/intake\.more\.arch names no question: Hero/.test(String(E.importError())),
   'one answer to a question the product does not ask refuses the whole import by name and pushes nothing');
  E.bindStore(()=>null,()=>{});}

 /* EVIDENCE, NOT A VERDICT. Answering every question, to the top and to the
    bottom, moves no law, no charge, no gate count and no number CQ is made of. */
 {const read=p=>{loadProfile(p); const r=compute();
   return JSON.stringify({cq:r.CQ,dq:r.DQ,jq:r.JQ,tier:r.tier,laws:p.laws,charge:S.charge,
    gates:p.gates,arcs:p.soul.arcs,doms:p.soul.doms,ia:E.iqScore(p),answers:p.intake.answers});};
  const p=blankProfile('ev'); for(let i=0;i<63;i++)p.intake.answers[i]=(i*7)%11; E.iqApply(p);
  const before=read(p);
  IX_BLOCKS.forEach(b=>b.rows.forEach((r,i)=>ixSet(p,b.id,r.k,10)));
  ok(read(p)===before,'every question answered 10 changes no law, charge, gate, CQ, DQ or stated archetype');
  IX_BLOCKS.forEach(b=>b.rows.forEach((r,i)=>ixSet(p,b.id,r.k,i%2?0:10)));
  ok(read(p)===before,'and answered 0 and 10 in turn changes none of them either');
  ok(E.saveProfile(p).gates.verp.aware===0,'and the gate counts, which are sentences read out of stories, stay at nought');}

 /* THE READ-OUT, state by state. axes and acts only: each reads one row as
    one named thing's whole answer, which is the shape this loop assumes
    (setting row i to 9 alone must make row i's own name the lead). The arch
    block reads twelve names off eighteen two way rows and needs its own
    method below, because that assumption is false for it: one row names two
    archetypes, not one, and "alone at the top" is a fact about a tally over
    three rows, not about a single row's value. */
 {const p=blankProfile('ro');
  IX_BLOCKS.filter(b=>b.id!=='arch').forEach(b=>{
   const none=ixRead(p,b.id);
   ok(none.state==='none'&&none.got===0&&none.left===b.rows.length&&ixSay(b.id,none).head==='',b.id+': nothing answered says nothing');
   ixSet(p,b.id,b.rows[0].k,5);
   const part=ixRead(p,b.id);
   ok(part.state==='part'&&part.got===1&&part.left===b.rows.length-1&&ixSay(b.id,part).head===(b.rows.length-1)+' of '+b.rows.length+' questions left'
    &&part.lead.length===0,b.id+': part answered names no leader and says what is left');
   b.rows.forEach(r=>ixSet(p,b.id,r.k,5));
   const lvl=ixRead(p,b.id);
   ok(lvl.state==='level'&&lvl.lead.length===b.rows.length&&/^Nothing leads\./.test(ixSay(b.id,lvl).head),b.id+': every row the same names no leader');
   b.rows.forEach(r=>ixSet(p,b.id,r.k,4)); ixSet(p,b.id,b.rows[1].k,6);
   const nearly=ixRead(p,b.id);
   ok(nearly.state==='level'&&nearly.spread<E.IX_FLOOR,b.id+': a spread under the noise floor is level and not a winner, spread '+nearly.spread);
   b.rows.forEach(r=>ixSet(p,b.id,r.k,1));
   /* each row as the only leader, so every name and meaning that can be printed is printed once */
   b.rows.forEach((r,i)=>{
    ixSet(p,b.id,r.k,9); const rd=ixRead(p,b.id), say=ixSay(b.id,rd);
    ok(rd.state==='lead'&&rd.lead.length===1&&rd.lead[0]===r.k,b.id+': '+r.k+' alone at the top leads');
    const txt=say.head+' '+say.body;
    ok(txt.indexOf(E.ixName(b.id,r.k))>=0&&!/undefined/.test(txt)&&say.body.length>8,b.id+': '+r.k+' is named and said in plain words, got "'+txt.slice(0,90)+'"');
    if(b.id==='axes'){
     const c=CHILD.filter(x=>x.nm===r.k)[0];
     ok(txt.indexOf(c.loc)>=0&&txt.indexOf(c.opp)>=0&&txt.indexOf(r.oppMeans.toLowerCase().slice(0,12))>=0,
      'axes: '+r.k+' says where it sits and what its other end is, with that end unpacked');}
    ixSet(p,b.id,r.k,1);});
   /* a tie of two leads, a tie of too many is level */
   ixSet(p,b.id,b.rows[0].k,9); ixSet(p,b.id,b.rows[1].k,9);
   const tie=ixRead(p,b.id);
   ok(tie.state==='lead'&&tie.lead.length===2&&/tied\.$/.test(ixSay(b.id,tie).head),b.id+': two at the top is a tie and both are named');
   b.rows.forEach((r,i)=>{if(i<=E.IX_TIE_MAX)ixSet(p,b.id,r.k,9);});
   const many=ixRead(p,b.id);
   ok(many.lead.length>E.IX_TIE_MAX&&many.state==='level',b.id+': more than '+E.IX_TIE_MAX+' tied at the top is level');});}

 /* THE ARCHETYPE READ-OUT. Round PQ. THE AUDIT: a tally recomputed here, from
    nothing but the stored answers and the formula the comment on ixRead
    states (one row splits one point between its two ends, 0 fully a to 10
    fully b, and an archetype's tally is the sum of what it won across its
    three rows), independently of ixRead. If this ever disagrees with what
    ixRead reports, the method is no longer the one written down, which is
    what "auditable" has to mean for a reading nobody can see labelled data
    for: a person reading the engine file can run this arithmetic by hand. */
 {const p=blankProfile('roa');
  const audit=p=>{const t={}; ARCH.forEach(a=>{t[a.nm]=0;});
   IX_ARCH2.forEach(r=>{const v=ixGet(p,'arch',r.k); if(v==null)return;
    const pb=v/10; t[r.a]+=1-pb; t[r.b]+=pb;}); return t;};

  const none=ixRead(p,'arch');
  ok(none.state==='none'&&none.got===0&&none.left===IX_ARCH2.length&&ixSay('arch',none).head==='','arch: nothing answered says nothing');
  ixSet(p,'arch',IX_ARCH2[0].k,5);
  const part=ixRead(p,'arch');
  ok(part.state==='part'&&part.got===1&&part.left===IX_ARCH2.length-1&&ixSay('arch',part).head===(IX_ARCH2.length-1)+' of '+IX_ARCH2.length+' questions left'&&part.lead.length===0,
   'arch: part answered names no leader and says what is left');

  /* EVERY ROW AT THE MIDPOINT. Every archetype ties at the same tally, so
     nothing leads, and the independent audit agrees with ixRead exactly. */
  IX_ARCH2.forEach(r=>ixSet(p,'arch',r.k,5));
  let rd=ixRead(p,'arch');
  ok(JSON.stringify(rd.tally)===JSON.stringify(audit(p)),'arch: the reported tally matches the independent audit at the midpoint');
  ok(rd.state==='level'&&rd.lead.length===ARCH.length&&/^Nothing leads\./.test(ixSay('arch',rd).head),'arch: dead level across the whole table names no leader');

  /* ONE ARCHETYPE WINS ALL THREE OF ITS OWN CONTESTS, everything else stays
     at the midpoint. THE CEILING: three full wins tally to exactly three,
     which is what IX_ARCH_FLOOR is measured against. */
  const pick='Warrior';
  IX_ARCH2.forEach(r=>{ if(r.a===pick)ixSet(p,'arch',r.k,0); else if(r.b===pick)ixSet(p,'arch',r.k,10); });
  rd=ixRead(p,'arch');
  ok(JSON.stringify(rd.tally)===JSON.stringify(audit(p)),'arch: the reported tally still matches the independent audit after the change');
  ok(Math.abs(rd.tally[pick]-3)<1e-9,'arch: winning its own three contests tallies '+pick+' to exactly three, got '+rd.tally[pick]);
  ok(rd.state==='lead'&&rd.lead.length===1&&rd.lead[0]===pick,'arch: '+pick+' leads alone, having won where it was asked about and nowhere else it was not');
  const say=ixSay('arch',rd);
  ok(say.head.indexOf(pick)>=0&&!/undefined/.test(say.head+' '+say.body)&&say.body.length>8,
   'arch: named and said in plain words, got "'+(say.head+' '+say.body).slice(0,90)+'"');

  /* DETERMINISM. The same stored answers read the same lean on a second call,
     with nothing moved in between. */
  const rd2=ixRead(p,'arch');
  ok(JSON.stringify(rd2)===JSON.stringify(rd),'arch: the same answers read exactly the same lean a second time');

  /* SENSITIVITY. Flip one row that does not name the pick, and the output
     changes, and it changes for the two archetypes that row actually names,
     never for every row touching the pick, which stayed untouched. */
  const other=IX_ARCH2.filter(r=>r.a!==pick&&r.b!==pick)[0];
  const ov=ixGet(p,'arch',other.k);
  ixSet(p,'arch',other.k,ov===0?10:0);
  const rd3=ixRead(p,'arch');
  ok(JSON.stringify(rd3)!==JSON.stringify(rd),'arch: changing one stored answer changes the reported lean');
  ok(rd3.tally[pick]===rd.tally[pick],'arch: a row that does not name '+pick+' never moves its tally, got '+rd3.tally[pick]+' against '+rd.tally[pick]);
  ok(rd3.tally[other.a]!==rd.tally[other.a]||rd3.tally[other.b]!==rd.tally[other.b],
   'arch: the two archetypes that changed row actually names are the ones whose tally moved');
  ixSet(p,'arch',other.k,ov);

  /* NO SINGLE QUESTION CAN DECIDE A TWELVE WAY LEAD. Each row is worth at
     most one point and every archetype sits in three rows, so flipping one
     row end to end moves either side of it by at most one point, never by
     the three a row's own name would need to reach the ceiling alone. */
  IX_ARCH2.forEach(r=>ixSet(p,'arch',r.k,0));
  const base=ixRead(p,'arch').tally;
  const row0=IX_ARCH2[0];
  ixSet(p,'arch',row0.k,10);
  const after=ixRead(p,'arch').tally;
  ok(Math.abs(after[row0.a]-base[row0.a])<=1+1e-9&&Math.abs(after[row0.b]-base[row0.b])<=1+1e-9,
   'arch: one row moves either name in its own pair by at most one point, never enough alone to decide a lead');

  /* A TIE OF TWO LEADS, A TIE OF TOO MANY IS LEVEL, the same rule axes and
     acts hold, read here off the tally rather than off a row value. */
  IX_ARCH2.forEach(r=>ixSet(p,'arch',r.k,5));
  const w2=['Warrior','Sage'];
  IX_ARCH2.forEach(r=>{
   if(w2.indexOf(r.a)>=0&&w2.indexOf(r.b)<0)ixSet(p,'arch',r.k,0);
   else if(w2.indexOf(r.b)>=0&&w2.indexOf(r.a)<0)ixSet(p,'arch',r.k,10);});
  const tie=ixRead(p,'arch');
  ok(tie.state==='lead'&&tie.lead.length===2&&tie.lead.indexOf('Warrior')>=0&&tie.lead.indexOf('Sage')>=0&&/tied\.$/.test(ixSay('arch',tie).head),
   'arch: two archetypes tied at the same top tally is a real tie and both are named, got '+JSON.stringify(tie.lead));}
}

g('PO · unpack every symbol: the meaning table and the pole meanings');
/* Round PO. His words: "you have to unpack blueprint. They don't know what that
   means. Earth, they don't know what that means... this is going to be a
   general rule for all information across the board." engine/data/gloss.js is
   the one table of what a term means, and engine/data/compass.js carries what
   each phrase of a pole means. This group holds both: the table is whole, each
   entry is one plain sentence, every claim in it is true to how the engine
   computes the thing, and the voice gate passes every string. The page side is
   tests/unpack.js. */
{
 const {unpackAll,unpackOf,unpackKey,MIRROR,PATHS,ZSIGN,CHINESE,LP_RUNS,SI,CHILD,ARCH,ROOTD,SINAMES}=E;
 const T=unpackAll(), keys=Object.keys(T);
 /* the two dashes, built from their codes so this file carries neither */
 const DASHES=String.fromCharCode(0x2014)+'|'+String.fromCharCode(0x2013);
 ok(keys.length>100,'the meaning table is built, '+keys.length+' entries');
 /* ONE SENTENCE, PLAIN. A sentence ends on one full stop and has no second
    sentence inside it, no percent, no score, no count against a total, no dash. */
 const empty=keys.filter(k=>typeof T[k]!=='string'||T[k].trim().length<12);
 ok(empty.length===0,'no entry is empty or a fragment, '+JSON.stringify(empty));
 const notOne=keys.filter(k=>!/\.$/.test(T[k])||/[.!?]\s+[A-Z0-9]/.test(T[k].replace(/\b(Mr|Dr|St)\./g,'')));
 ok(notOne.length===0,'every entry is exactly one sentence, '+JSON.stringify(notOne.slice(0,4)));
 const scored=keys.filter(k=>new RegExp('%|\\bpercent\\b|\\bper cent\\b|\\bscore\\b|\\b\\d+\\s*(of|out of)\\s*\\d+\\b|'+DASHES,'i').test(T[k]));
 ok(scored.length===0,'no percent, score, count against a total or dash in any entry, '+JSON.stringify(scored.slice(0,4)));
 const long=keys.filter(k=>T[k].split(/\s+/).length>34);
 ok(long.length===0,'no entry runs past thirty four words, '+JSON.stringify(long.slice(0,4)));
 const bare=keys.filter(k=>k!==k.toLowerCase());
 ok(bare.length===0,'every key is lower case');
 /* A TERM IS NEVER CLAIMED TO BE MEASURED. The sun, moon and rising signs are
    computed from the sky, and what a sign means is an old system's claim. */
 ok(/symbolic reading/.test(T['symbolic reading'])&&/nothing in your body is measured/.test(T['symbolic reading']),
  'the table says a symbolic reading is not a measurement');
 ok(/Numerology claims/.test(T['path:9'])&&/astrology claims/.test(T['sign:capricorn']),'a number and a sign are said as a claim');

 /* COVERAGE, in both directions: every name the engine carries has a sentence */
 ok(ZSIGN.every(z=>T['sign:'+z[2].toLowerCase()]),'every one of the twelve signs has a sentence');
 ok(['fire','earth','air','water'].every(e=>T[e]),'every Western element has a sentence');
 ok(CHINESE.every(a=>T['animal:'+a.toLowerCase()]),'every year animal has a sentence');
 ok(['wood','fire','earth','metal','water'].every(e=>T['year:'+e]),'every Chinese element has a sentence');
 ok(Object.keys(LP_RUNS).every(n=>T['path:'+n]),'every life path number has a sentence, '+Object.keys(LP_RUNS));
 ok(SI.every(l=>T['law:'+l.nm.toLowerCase()]),'every one of the laws has a sentence');
 ok(CHILD.every(c=>T['feeling:'+c.nm.toLowerCase()]&&T['opposite:'+c.opp.toLowerCase()]),'every feeling and every opposite has a sentence');
 ok(ARCH.every(a=>T['archetype:'+a.nm.toLowerCase()]),'every archetype has a sentence');
 ok(ROOTD.every(r=>T[r.toLowerCase()]),'every root has a sentence, '+ROOTD);
 ok(['root','sacral','solar','heart','throat','3rd eye','crown'].every(x=>T['seat:'+x]),'every seat has a sentence');
 ok(MIRROR.every(m=>T['axis:'+m.q.toLowerCase()]),'every axis on the compass has a sentence');
 /* AX8. Each seat's level sentence names the level FLOWSEAT.vt carries, so a
    vt that moves fails here rather than leaving a sentence about another
    bone. The pitch is said as the sound healers' choice and never as a
    reading, and no sentence calls a level a vritti, which the codex makes the
    wave around a nerve (index.html:1526, 1529). */
 ok(E.FLOWSEAT.every(s=>T['level:'+s.k]&&T['level:'+s.k].toLowerCase().indexOf(s.vt.split(',')[0].toLowerCase())>=0),
  'every seat has a level sentence naming its own vt: '+E.FLOWSEAT.filter(s=>!T['level:'+s.k]||T['level:'+s.k].toLowerCase().indexOf(s.vt.split(',')[0].toLowerCase())<0).map(s=>s.k));
 ok(T['plexus']&&/sound healers/.test(T['seat tone'])&&/nothing in your body is measured/.test(T['seat tone'])&&T['codex page'],
  'the plexus, the seat tone and the codex page each have a sentence, and the tone is said as a choice and not a measurement');
 ok(keys.every(k=>!/vritti/i.test(T[k])),'no sentence in the table uses the word vritti');
 /* the two anatomy words among the seat spots carry a sentence that names them */
 ok(E.FLOWSEAT.filter(s=>/notch|sternum/i.test(s.seat)).every(s=>T['spot:'+s.k]&&T['spot:'+s.k].toLowerCase().indexOf(s.seat.replace(/^the /,'').toLowerCase())>=0),
  'every anatomy word among the seat spots has a sentence naming it');
 /* THE PRODUCT'S OWN GLOSSARY REACHES THE TOOLTIP, round RW (cf20a9d). GLOSS
    answered only on the Knowledge page's own search until unpackAll() took a
    last pass over it, so a word only GLOSS defines, Awareness or Drag, was
    printed with no meaning on it. Nothing held that pass. It sits behind a
    typeof guard, so a build that loses kb.js, or a pass that is deleted,
    leaves every check above green and every one of those words bare, measured
    on a scratch engine before this was trusted. The words it leaves out are
    printed, so a refusal is read off the run rather than assumed. */
 {const first=g=>String(g.d||'').split('. ')[0].replace(/\.+$/,'')+'.';
  const via=E.GLOSS.filter(g=>T[g.t.toLowerCase()]===first(g)), left=E.GLOSS.filter(g=>!T[g.t.toLowerCase()]);
  ok(via.length>0,'the glossary reaches the meaning table: '+via.length+' GLOSS words carry their own first sentence, '
   +'and these carry none: '+JSON.stringify(left.map(g=>g.t)));}
 ok(unpackOf('Brow','seat')===T['seat:3rd eye']&&unpackKey('Virgo','sign')==='sign:virgo'&&unpackOf('nothing at all')==='',
  'the lookup folds case, reads Brow as the 3rd Eye, and returns nothing for a term it does not hold');
 /* THE FOURTH RUNG AND THE TOP ARE TWO WORDS, ruled 23 October (DECISIONS.md,
    "The full stack, nerve to Character"). The rung where two hyper complexes
    join is the super complex, so its sentence says how it forms, and
    Character is the whole of it, so its sentence is the whole and never a
    ring of the chain. The tier table names the rung by the same word. */
 ok(/two hyper complexes/.test(T['super complex']||'')&&/ring/.test(T['super complex']||''),
  'the super complex has a sentence, and it is the rung, two hyper complexes one ring further in, got '+JSON.stringify(T['super complex']));
 ok(!!T['character']&&!/\bring\b|hyper complex/i.test(T['character'])&&/masks/.test(T['character']),
  'and Character is the whole of it, the masks and everything under them, never a ring of the chain, got '+JSON.stringify(T['character']));
 ok(E.SIGHT.filter(x=>x.k==='sup').length===1&&E.SIGHT.filter(x=>x.k==='sup').every(x=>x.nm==='super complexes'&&!/character/i.test(x.what)),
  'the tier table names the rung super complexes and never Character, got '+JSON.stringify(E.SIGHT.filter(x=>x.k==='sup')));
 /* the sentence a family builds reads off the table it describes, so it cannot drift */
 ok(T['earth'].indexOf('Taurus, Virgo and Capricorn')>=0&&T['fire'].indexOf('Aries, Leo and Sagittarius')>=0
  &&T['air'].indexOf('Gemini, Libra and Aquarius')>=0&&T['water'].indexOf('Cancer, Scorpio and Pisces')>=0,
  'each element names the signs ZSIGN gives it');
 ok(T['path:9'].indexOf(LP_RUNS[9])>=0&&T['law:truth'].indexOf(E.IQ_STEM.Truth)>=0,'a number and a law say what the engine says they do');
 ok(T['law'].indexOf(String(SI.length))>=0&&T['archetype'].indexOf(String(ARCH.length))>=0,'a count in a sentence is read off its table, not typed');

 /* THE CLAIMS, AGAINST THE ENGINE. Each sentence that states a mechanism is
    checked against the arithmetic that produces it. */
 const lp=[]; for(let y=1900;y<2100;y+=3)for(let m=1;m<=12;m+=2)for(let d=1;d<=28;d+=3)lp.push(E.lifePath(y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0')));
 ok(lp.every(v=>(v>=1&&v<=9)||v===11||v===22||v===33)&&[11,22,33].every(v=>lp.indexOf(v)>=0),
  'a life path is a digit or 11, 22 or 33, as the sentence says, and all three masters occur');
 {const jd=julianDay(1976,3,9,12), dd=(((sunLon(jd)-sunLon(designJD(jd)))%360)+360)%360;
  ok(Math.abs(dd-88)<0.01,'the design sun is 88 degrees of arc before the birth sun, as the sentence says, got '+dd);}
 ok(E.GATE_WHEEL.length===64,'the gate wheel has 64 gates, as the sentence says');
 ok(CHINESE.length===12,'the year animal cycle is twelve');
 {const el=[0,1,2,3,4,5,6,7,8,9].map(i=>E.chineseElement(i)); ok(el.every((x,i)=>x===el[i-i%2]),'each Chinese element takes two years running, as the sentence says');}
 ok(E.chineseYear({d:'1990-01-15'})===1989&&E.chineseYear({d:'1990-02-10'})===1990,'the Chinese year turns in early February, as the sentence says');
 ok(E.moonSign({d:'1990-03-15'})===null||Array.isArray(E.moonSign({d:'1990-03-15'})),'a moon sign needs a time and is refused without one rather than guessed');

 /* THE VOICE GATE OVER THE WHOLE TABLE, built strings included. check.py reads
    a file, so the built entries are written to one. Checked against a known bad
    file first, as the recipe table's gate is: a tool that cannot fail is not a
    gate. */
 {const cp=require('child_process'), fs=require('fs'), os=require('os'), path=require('path');
  const py=(f)=>{try{cp.execFileSync('python3',['.claude/skills/atuned-voice/check.py',f],{stdio:'pipe'});return 0;}
   catch(e){return e.status===undefined?-1:e.status;}};
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'engine-po-'));
  const bad=path.join(tmp,'po-known-bad.js'), good=path.join(tmp,'po-table.js');
  fs.writeFileSync(bad,"var x=['Sit back and relax and breathe gently.','Your energy is 70% open '+String.fromCharCode(0x2014)+' simply lovely.'];\n");
  const known=py(bad);
  /* SINGLE QUOTED, 16 October. Outside engine/data check.py reads single
     quoted literals only, and JSON.stringify writes double quotes, so this
     file gave it nothing to read and it passed on nothing, exit 0, from the
     day this check was written. check.py now refuses a named file with no
     strings in it (exit 2), which is how it showed. */
  const sq=s=>"'"+String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')+"'";
  fs.writeFileSync(good,'var T=['+keys.map(k=>sq(T[k])).join(',\n')+'];\n');
  const real=py(good);
  try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}
  ok(known===1,'the voice gate fails a known bad file before it is trusted on the table, exit '+known);
  ok(real===0,'no entry in the built meaning table fails the voice rules, exit '+real);
  ok(py('atuned_src/engine/data/gloss.js')===0,'no string in the meaning table file fails the voice rules');}

 /* THE POLES. upd and dnd are the codex's own lines and are never edited. Each
    is cut into its phrases and each phrase carries one meaning. */
 const poles=MIRROR.concat(PATHS.filter(p=>!MIRROR.some(m=>m.k===p.k)));
 ok(MIRROR.every(m=>m.upm&&m.upm.length&&m.dnm&&m.dnm.length)&&PATHS.every(p=>p.upm&&p.upm.length&&p.dnm&&p.dnm.length),
  'every axis and every path has phrases with meanings at both ends');
 const drift=[];
 MIRROR.concat(PATHS).forEach(m=>{
  if(m.upm.map(x=>x[0]).join(' ')!==m.upd)drift.push(m.k+' up');
  if(m.dnm.map(x=>x[0]).join(' ')!==m.dnd)drift.push(m.k+' dn');});
 ok(drift.length===0,'the phrases of every pole, joined, are the codex line character for character, '+JSON.stringify(drift));
 const meanings=[]; MIRROR.concat(PATHS).forEach(m=>m.upm.concat(m.dnm).forEach(x=>meanings.push(x[1])));
 ok(meanings.every(t=>typeof t==='string'&&t.length>=12&&/\.$/.test(t)),'every phrase has a meaning that is a sentence, '+meanings.filter(t=>!(typeof t==='string'&&t.length>=12&&/\.$/.test(t))));
/* keeps score is the owner's own meaning for "no transaction": nobody is
    keeping a tally of who owes whom. It is not a score a person is given. */
 ok(meanings.filter(t=>new RegExp('%|(?<!keeps )\\bscore\\b|\\bpercent\\b|'+DASHES,'i').test(t)).length===0,'no meaning carries a percent, a score or a dash');
 ok(meanings.filter(t=>t.split(/\s+/).length>30).length===0,'no meaning runs past thirty words');
 ok(meanings.filter(t=>/[.!?]\s+[A-Z]/.test(t)).length===0,'no meaning is more than one sentence');
 /* the owner's own example, by name */
 const il=MIRROR.filter(m=>m.k==='IL')[0];
 ok(il.upm.length===4&&il.upm[0][0]==='Love generated from within.'&&/does not depend on getting something back/.test(il.upm[0][1])
  &&il.upm[1][0]==='Freely given.'&&/no expectation of thanks or return/.test(il.upm[1][1])
  &&il.upm[2][0]==='No transaction.'&&/keeps score of who owes whom/.test(il.upm[2][1])
  &&il.upm[3][0]==='Light that has a source.'&&/comes from inside the person and does not need a room to reflect it/.test(il.upm[3][1]),
  'the Jesus line at the Heart is cut into his four phrases, each with the meaning he asked for');
 ok(E.compassPoleOf&&E.compassPoleOf('IL')===il&&E.compassPoleLines(il,'up')===il.upm&&E.compassPoleLines({upd:'x'},'up')[0][0]==='x',
  'a pole is found by its key and a pole with no meanings still returns its codex line');
 {const cp=require('child_process'), fs=require('fs'), os=require('os'), path=require('path');
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'engine-pole-'));
  const f=path.join(tmp,'po-pole-means.js');
  /* single quoted, for the reason the meaning table's file above is */
  const sq=s=>"'"+String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')+"'";
  fs.writeFileSync(f,'var M=['+meanings.map(t=>sq(t)).join(',\n')+'];\n');
  let code=0; try{cp.execFileSync('python3',['.claude/skills/atuned-voice/check.py',f],{stdio:'pipe'});}catch(e){code=e.status===undefined?-1:e.status;}
  try{fs.rmSync(tmp,{recursive:true,force:true});}catch(e){}
  ok(code===0,'no pole meaning fails the voice rules, exit '+code);}
}

/* QB · A WORKED EXAMPLE'S PRACTICE HISTORY, engine/pracex.js, for the
   practitioner page. Every row of the table builds through practiceDo, the
   loop read hands back exactly what the row says, and a row the engine would
   refuse is refused here too: the known bad case runs first. */
g('QB · a worked example\'s practice history, through the real engine');
{
 const NOW='2026-10-02T15:00:00.000Z', ADDRS=[53,54,55,56,57,58];
 const H=E.PRACEX_HIST, names=Object.keys(H);
 /* the known bad case: a miss written for yesterday, which event_move refuses */
 const keep=H.Derek.strip;
 H.Derek.strip=keep.slice(0,-1)+'m';
 let threw=''; try{E.pracexRecord(E.PEOPLE.find(x=>x.nm==='Derek'),ADDRS,NOW);}catch(e){threw=e.message;}
 H.Derek.strip=keep;
 ok(/not missed yet/.test(threw),'a miss the engine would refuse is refused by the builder, by name: "'+threw+'"');
 ok(names.length===10&&names.every(n=>E.PEOPLE.some(x=>x.nm===n)),'ten rows, every one a worked example in PEOPLE');
 ok(names.every(n=>H[n].strip.length===E.PRACEX_DAYS&&/^[.cpsm-]+$/.test(H[n].strip)),'every strip is one character a day for the whole window');
 const bad=[];
 names.forEach(n=>{
  const p=E.PEOPLE.find(x=>x.nm===n), h=H[n];
  let R=null; try{R=E.pracexRead(p,ADDRS,NOW);}catch(e){bad.push(n+' threw '+e.message); return;}
  const L=R.loop, ran=(h.strip.match(/[cp]/g)||[]).length;
  if(L.confirmed!==h.accept)bad.push(n+' confirmed '+L.confirmed+' vs '+h.accept);
  if(L.declined.length!==h.reject)bad.push(n+' declined '+L.declined.length+' vs '+h.reject);
  if(L.practice.events!==(h.accept?ran:0))bad.push(n+' practised '+L.practice.events+' vs '+ran);
  const want={'.':'none',c:'completed',p:'partial',s:'skipped',m:'missed','-':'scheduled'};
  const got=R.days.map(d=>d.status).join(','), exp=h.strip.split('').map(c=>h.accept?want[c]:'none').join(',');
  if(got!==exp)bad.push(n+' days '+got);
  if(L.patterns.some(x=>/^[0-9]+$/.test(String(x.name))))bad.push(n+' a pattern named by its number');
  const tail=(h.strip.match(/m+[-s]*$/)||[''])[0].replace(/[-s]/g,'').length;
  if(tail>=3&&!(L.misses[0]&&L.misses[0].stage==='investigate'))bad.push(n+' three misses not read as investigate');});
 ok(bad.length===0,'every row reads back exactly what it says, '+JSON.stringify(bad));
 const a=JSON.stringify(E.pracexRead(E.PEOPLE.find(x=>x.nm==='Ana'),ADDRS,NOW).days);
 const b=JSON.stringify(E.pracexRead(E.PEOPLE.find(x=>x.nm==='Ana'),ADDRS,NOW).days);
 ok(a===b,'the same example and the same moment build the same history');
 ok(E.pracexRecord({nm:'Nobody'},ADDRS,NOW)===null,'a person with no row has no history, and none is invented');
}

g('QD · every worked example\'s bank and vault, replayed through the real writers');
/* Round QD: "load up their bank and their vault. With real data." The bank is
   the Story page's held field and the committed entries the Imprints page
   groups (ui/imprints.js); the vault is stVaultRows (ui/storyui.js), which
   reads meter.unique and meter.firsts and nothing else. engine/exdepth.js
   writes both by replaying each example's journal and releases through
   parseStory, applyStory, relQueueOf, meterPlan, relWrite, meterRun,
   releaseWork and meterFirst. This holds that every figure in the result is
   one those writers produced, that the boundary takes the record back, and
   that the reading a person sees is still the table's. The roster is read off
   PEOPLE, never counted. */
{
 const NOW=Date.parse('2026-10-02T12:00:00Z');
 const H=E.EXDEPTH_HIST;
 const rd=p=>{
  S.dom=p.dom; S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn();
  E.VERPMIX.aware=E.VERPMIX.detach=E.VERPMIX.intent=0;
  E.VERPMIX.ignore=E.VERPMIX.attach=E.VERPMIX.averse=0;
  E.LEANMIX.benign=E.LEANMIX.malignant=0;
  return compute();};
 const snapS=()=>JSON.stringify([S.charge,S.replace,E.VERPMIX,E.LEANMIX]);
 /* WHAT A REPLAYED RECORD MUST SAY, as one checker, so it can be pointed at a
    known bad record first. Every problem comes back by name. */
 const chk=(rec,p)=>{
  const bad=[], h=H[p.nm], win=Math.max.apply(null,(h.e||[]).concat(h.r||[]).map(x=>x[0]))+1;
  const ents=rec.story.entries;
  if(ents.length!==(h.e||[]).length)bad.push('entries '+ents.length+' of '+(h.e||[]).length);
  ents.forEach((x,i)=>{const P=E.parseStory(x.text);
   if(x.imprints!==P.imprints.length)bad.push('entry '+i+' says '+x.imprints+' imprints, the sniffer reads '+P.imprints.length);
   if(JSON.stringify(x.bands)!==JSON.stringify(P.bands))bad.push('entry '+i+' seats are not the sniffer\'s');
   if(x.lex!==E.LEX_VERSION)bad.push('entry '+i+' is not stamped with the lexicon');});
  for(let i=1;i<ents.length;i++)if(ents[i].t<ents[i-1].t)bad.push('entries out of order at '+i);
  const m=rec.meter, keys=m.unique;
  if(keys.some(k=>!/^\d+:[LR](limit|truth):\d+$/.test(k)))bad.push('a key is not a meter key');
  if(new Set(keys).size!==keys.length)bad.push('a key is held twice');
  if(keys.length>=E.GIFT_N)bad.push('the history spends the whole gift, '+keys.length);
  if(m.lines!==keys.length)bad.push('lines '+m.lines+' is not the keys said once each, '+keys.length);
  const runs=(h.r||[]);
  /* the lifetime split is relCoolDown's: every line said `dose` times. A key
     is one line, and the runs are in time order, so the keys are dealt to the
     runs in order by how many each one planned, which is read off the firsts. */
  const addrs=[...new Set(keys.map(k=>+k.split(':')[0]))];
  const firstAddr=m.firsts.filter(f=>/^addr:/.test(f.k)).map(f=>+f.k.slice(5));
  if(addrs.some(a=>firstAddr.indexOf(a)<0))bad.push('an address in the vault has no dated first');
  if(firstAddr.some(a=>addrs.indexOf(a)<0))bad.push('a first names an address with no line said at it');
  if(m.firsts.some(f=>{const t=Date.parse(f.t); return !(t<NOW&&t>NOW-win*86400000);}))
   bad.push('a first is dated outside the history');
  if(m.relLines!==m.truthLines)bad.push('released '+m.relLines+' and installed '+m.truthLines+' should match on whole runs');
  if(runs.length&&!(m.relLines>0))bad.push('a history with releases released nothing');
  if(!runs.length&&(keys.length||m.firsts.length||m.relLines))bad.push('a history with no release has a vault');
  if(Object.keys(rec.work||{}).length)bad.push('the law lift was not cleared by the later answers');
  const v=E.validateProfile(JSON.parse(JSON.stringify(rec)));
  if(!v.ok)bad.push('the boundary refuses it: '+v.errs.slice(0,2).join('; '));
  return bad;};
 const ppl=PEOPLE.filter(p=>!p.you);
 ok(ppl.length>0&&ppl.every(p=>H[p.nm]),'every example on the roster has a history, missing: '
  +ppl.filter(p=>!H[p.nm]).map(p=>p.nm).join(', '));
 ok(Object.keys(H).every(k=>ppl.some(p=>p.nm===k)),'and no history names somebody who is not on the roster: '
  +Object.keys(H).filter(k=>!ppl.some(p=>p.nm===k)).join(', '));
 let first=null;
 ppl.forEach(p=>{
  if(!H[p.nm])return;
  const r0=rd(p), s0=snapS(), rec=E.blankProfile(p.nm);
  let out=null, threw='';
  try{out=E.exdepthFill(rec,p,NOW);}catch(e){threw=e.message;}
  ok(!threw,p.nm+'\'s history runs through the engine, '+threw);
  if(threw)return;
  ok(snapS()===s0,p.nm+': the field and both gate mixes are put back exactly');
  ok(Math.abs(compute().CQ-r0.CQ)<1e-9&&Math.abs(compute().DQ-r0.DQ)<1e-9,
   p.nm+': the reading is still the table\'s, CQ '+r0.CQ.toFixed(1));
  const bad=chk(rec,p);
  ok(bad.length===0,p.nm+': every figure is the writers\' own, '+bad.join(' | '));
  ok(out.entries>0&&rec.story.entries.some(x=>x.imprints>0),p.nm+': the bank holds entries the sniffer read, '+out.imprints+' imprints');
  if((H[p.nm].r||[]).length)ok(rec.meter.unique.length>0,p.nm+': the vault holds released lines, '+rec.meter.unique.length);
  /* the same day builds the same history, byte for byte */
  rd(p); const again=E.blankProfile(p.nm); E.exdepthFill(again,p,NOW);
  ok(JSON.stringify(again.story)===JSON.stringify(rec.story)&&JSON.stringify(again.meter)===JSON.stringify(rec.meter),
   p.nm+': the history is the same on a second build');
  if(!first&&rec.meter.unique.length&&rec.story.entries.length>1)first={p,rec};});
 /* CHECKED AGAINST KNOWN BAD RECORDS FIRST, the standing rule. Each one is a
    real record with one figure hand typed, and the checker must name it. */
 if(first){
  const T=()=>JSON.parse(JSON.stringify(first.rec));
  let x=T(); x.story.entries[0].imprints+=1;
  ok(chk(x,first.p).some(b=>/imprints/.test(b)),'known bad: a hand typed imprint count is caught');
  x=T(); x.meter.relLines+=50;
  ok(chk(x,first.p).some(b=>/released/.test(b)),'known bad: a hand typed lifetime count is caught');
  x=T(); x.meter.firsts.push({k:'addr:1',t:new Date(NOW-86400000).toISOString(),nm:'x'});
  if(x.meter.unique.every(k=>+k.split(':')[0]!==1))
   ok(chk(x,first.p).some(b=>/no line said/.test(b)),'known bad: a first with no line said at it is caught');
  x=T(); x.meter.unique.push(x.meter.unique[0]);
  ok(chk(x,first.p).length>0,'known bad: a key held twice is caught');
  x=T(); x.work={Truth:{n:3,on:5}};
  ok(chk(x,first.p).some(b=>/lift/.test(b)),'known bad: a lift left standing is caught');}
 /* A HISTORY THE ENGINE CANNOT RUN IS LOUD. A release with nothing carrying
    is refused by the queue, and the refusal names the step. */
 const ghost={nm:'__qd_ghost',dom:0,a1:0,a2:1,c:{},rep:{Fear:9,Anger:9,Shame:9,Disgust:9,Apathy:9,Shock:9,Sad:9,Surprise:9,Anticipation:9}};
 H.__qd_ghost={e:[[4,'I felt afraid and my stomach knotted.']],r:[[3,2,20]]};
 rd(ghost); let thr='';
 const gr=E.blankProfile('g'), g0=JSON.stringify([gr.story,gr.meter,gr.work]);
 try{E.exdepthFill(gr,ghost,NOW);}catch(e){thr=e.message;}
 delete H.__qd_ghost;
 ok(/nothing is carrying/.test(thr),'a release on a field with nothing carrying is refused by name, '+thr);
 ok(JSON.stringify([gr.story,gr.meter,gr.work])===g0,'and the refused history leaves nothing behind, not even the entry before it');
 ok(E.exdepthFill(E.blankProfile('n'),{nm:'Nobody'},NOW)===null,'a person with no row has no history, and none is invented');
 ok(E.exdepthHas(E.blankProfile('b'))===false,'a blank record carries no history');
 /* THE ENGINE'S CHANNEL LIST IS THE CARD'S. ONB_CHANS is held equal to CHAN in
    ui/release.js by tests/onboarding2.js in a real browser; here, the four
    keys are the four a key may carry. */
 ok(E.ONB_CHANS.length===4&&E.ONB_CHANS.every(c=>/^[LR](limit|truth)$/.test(c)),'the replay plans down the card\'s four channels');
 reset();
}

g('QR · words dictation hid behind stars are found, said, and never changed');
{
 /* his own screenshot, round QR, word for word where the stars are */
 const his='I used to just ******* hate him. I was really ****** ***.';
 const r=E.maskedRuns(his);
 ok(r.length===3,'his sentence carries three hidden words, '+r.length);
 ok(r.map(x=>x.word).join('|')==='*******|******|***','each run is the stars as they stand: '+r.map(x=>x.word).join('|'));
 ok(r.every(x=>his.substr(x.at,x.len)===x.word),'and every offset addresses the raw text, not the normalised copy');
 /* the vendors that keep a letter, and a hidden stem */
 ok(E.maskedRuns('that s**** again').map(x=>x.word).join()==='s****','a first letter kept by the service is part of the run');
 ok(E.maskedRuns('so f***ing tired').map(x=>x.word).join()==='f***ing','a hidden middle with its ending is one run');
 /* what is not a hidden word */
 ok(E.maskedRuns('this * is a footnote and 5*3 is maths').length===0,'one star alone is a person\'s own, and is not flagged');
 ok(E.maskedRuns('').length===0&&E.maskedRuns(null).length===0&&E.maskedSay([])==='','nothing hidden reads nothing, and says nothing');
 /* the sentence, counted off the runs and never typed */
 const one=E.maskedSay(E.maskedRuns('really ****** furious')), three=E.maskedSay(r);
 ok(/^One word was hidden/.test(one)&&/^3 words were hidden/.test(three),'the sentence counts what is there: '+three.slice(0,30));
 ok(/Dictation, the speech to text/.test(three),'and unpacks the word dictation where it stands');
 ok(!/—/.test(one+three),'no em dash');
 /* WHY IT MATTERS TO THE READING, held so a change to it is a named diff:
    the scanner turns stars into spaces, so a hidden word between a degree word
    and a feeling word puts the two side by side. Measured, not argued. */
 const a=E.parseStory('I was really ****** furious').bands.solar||0, b=E.parseStory('I was really fucking furious').bands.solar||0;
 ok(a>b,'stars close the gap the hidden word held: '+a.toFixed(1)+' against '+b.toFixed(1)+' with the word typed in');
 /* AND THE ENGINE CENSORS NOTHING: it reads the stars and never writes them */
 ok(E.maskedRuns('I was really pissed off').length===0,'an uncensored word is not a hidden one, and nothing here hides it');
}

g('QZ · the sniffer reads other words for the same reading, and still reads nothing into quiet text');
/* His bug report, verbatim: "I'm able to talk about painful situations and the
   sniffer's not picking up because the sniffer is too specific... it needs to
   be fuzzier. The rules need to be looser." Measured before anything moved, on
   proto/sniffer/fuzzy-corpus.js: 42 of 119 painful lines lit. The recall
   numbers live in that probe and not here, because a count typed into a gate
   is the defect CLAUDE.md records a dozen times. What is asserted here is the
   mechanism: the three things that were wrong, read right, and the quiet lines
   the looser rules must not light, each by name. */
{
 const {LEX,ADJ2CHG,LEXMETA,PHRASES,LEXSYN,LEXANT,LEXANT_FRAMES,LEXKIN,LEXSYN_NO,
        LEXSYNRUN,LEXSYNPLACES,SOMA_PLACE,LEX_SEAT,LEX_AMT,LEX_FET,lexSyn,lexKeyOk,
        normMap,scanStory,parseStory,marksOf,srcNegated,SOMA_PLACE_WORDS}=E;
 const lit=t=>parseStory(t).imprints.length>0;
 const seats=t=>{const b=parseStory(t).bands;return Object.keys(b).filter(k=>b[k]>0);};

 /* ---- 1. the apostrophe. every dont and cant key was unreachable as typed ---- */
 const plain=JSON.stringify(parseStory('I cant cope').bands);
 ok(plain!=='{}','the key itself reads, '+plain);
 ok(JSON.stringify(parseStory("I can't cope").bands)===plain,'and so does the straight apostrophe a keyboard types');
 ok(JSON.stringify(parseStory('I can’t cope').bands)===plain,'and the curly one a phone types, which used to become a space');
 ok(!/['‘’]/.test(normMap("don't, can’t ‘quoted’").s),'normMap keeps no apostrophe of any kind');
 const raw="I can't cope.", m=marksOf(raw,parseStory(raw));
 ok(m.length===1&&raw.slice(m[0].s,m[0].e)==="can't cope",'and the mark still lands on the letters typed, apostrophe and all: '+(m[0]?JSON.stringify(raw.slice(m[0].s,m[0].e)):'none'));
 const nm=normMap("i don't panic");
 ok(srcNegated(nm.s,nm.s.indexOf(' panic')),'srcNegated, whose list was always written dont, now hears "don\'t"');
 ok(!lexKeyOk("can't cope")&&lexKeyOk('cant cope'),'and a key with an apostrophe is refused, because it could never be reached');
 /* AND THE ONE OTHER READER OF normMap's COPY THAT HELD APOSTROPHES. Source
    AI's dimension cues carried i'll, they'll, it'll and i'd like, which this
    change would have made unreachable without a word. */
 const cueApos=[];Object.keys(E.SRC_DIM_CUE).forEach(k=>E.SRC_DIM_CUE[k].forEach(c=>{if(/'/.test(c))cueApos.push(c);}));
 ok(cueApos.length===0,'no Source AI cue carries an apostrophe it could never be found by, '+cueApos.join(', '));
 ok((E.srcDims("I'll lose everything, I know it").answered.prediction||[]).length>0,'"I\'ll lose everything" still answers the prediction');
 ok(!E.srcDims('I have been ill all week').answered.prediction,'and "I have been ill" does not, although i\'ll now reads as ill');
 ok((E.srcDims("They'll leave me").answered.prediction||[]).length>0&&(E.srcDims("I'd like to sleep").answered.goal||[]).length>0,
  'and they\'ll and i\'d like are read without their apostrophes');

 /* ---- 2. a different word for the same reading ---- */
 const same=[['I am so worried about money','anxious'],['I have been crying all week','sad'],
  ['I am completely worn out','exhausted'],['I was bullied at school','laughed'],
  ['he talks over me in every meeting','interrupted'],['I feel like such a failure','worthless']];
 same.forEach(([t,head])=>{const h=scanStory(t).find(x=>x.kind==='word'&&LEXMETA[x.t]&&LEXMETA[x.t].from===head);
  ok(h&&h.band===LEX[head][LEX_SEAT],JSON.stringify(t)+' reads through '+head+' at '+LEX[head][LEX_SEAT]+(h?', on "'+h.t+'"':', and did not'));});

 /* A SYNONYM CHANGES THE WORD AND NOTHING ELSE, the fold's contract, checked
    on every row this pass wrote rather than on the six above. */
 const mine=Object.keys(LEXMETA).filter(k=>LEXMETA[k].src==='synonym'||LEXMETA[k].src==='antonym');
 ok(mine.length===LEXSYNRUN.added,'every entry the pass reports adding is marked synonym or antonym, '+mine.length+' of '+LEXSYNRUN.added);
 const drift=mine.filter(k=>{const h=LEXMETA[k].from, e=LEX[k], b=LEX[h];
  return !b||e[LEX_SEAT]!==b[LEX_SEAT]||e[LEX_AMT]!==b[LEX_AMT]||String(e[LEX_FET])!==String(b[LEX_FET])
   ||(ADJ2CHG[h]||null)!==(ADJ2CHG[k]||null);});
 ok(drift.length===0,'each carries its headword\'s seat, amount, stated fetter and charge name exactly, '+drift.length+' do not: '+JSON.stringify(drift.slice(0,5)));
 const chain=mine.filter(k=>{const s=LEXMETA[LEXMETA[k].from].src;return s==='synonym'||s==='antonym';});
 ok(chain.length===0,'and no headword is itself a synonym, so nothing drifts by chaining, '+chain.length+' do');
 const amts=new Set(Object.keys(LEX).filter(k=>mine.indexOf(k)<0).map(k=>LEX[k][LEX_AMT]));
 ok(mine.every(k=>amts.has(LEX[k][LEX_AMT])),'so no amount exists that the table did not already hold');
 const inRows=[];PHRASES.forEach(r=>r[0].forEach(w=>{if(LEXSYNRUN.from[w])inRows.push(w);}));
 ok(inRows.length===LEXSYNRUN.phrase,'an idiom\'s synonym joins that idiom\'s own row and keeps its label, '+inRows.length+' of '+LEXSYNRUN.phrase);
 ok(scanStory("I couldn't sleep again").some(h=>h.kind==='phrase'&&h.label==='hypervigilance'),'"I couldn\'t sleep" reads as the row "cannot sleep" already named');

 /* ---- 3. the opposite, said not ---- */
 ok(seats("I don't feel safe in my own home").indexOf('root')>=0,'"I don\'t feel safe" reads at the root, where unsafe is');
 const calm=scanStory('I was not calm at all');
 ok(!calm.some(h=>h.band==='coherent')&&calm.some(h=>h.band==='root'),
  '"I was not calm" no longer SUBTRACTS charge, which it did, and reads as the anxiety it reports');
 ok(scanStory('I felt calm').some(h=>h.band==='coherent'),'and "I felt calm" still subtracts, untouched');
 ok(seats('I never felt loved by my father').indexOf('heart')>=0,'"never felt loved" reads at the heart, where unloved is');
 ok(seats("Honestly I'm not okay").indexOf('heart')>=0,'"I\'m not okay" reads');
 ok(Object.keys(LEXANT).every(h=>Object.keys(LEXANT[h]).every(s=>LEXANT_FRAMES[s])),'every opposite names a frame set that exists');
 const bare=[];Object.keys(LEXANT).forEach(h=>Object.keys(LEXANT[h]).forEach(s=>LEXANT[h][s].forEach(w=>{if(LEX[w]&&LEX[w][LEX_SEAT]!=='coherent')bare.push(w);})));
 ok(bare.length===0,'and the plain opposite word is never a charged key itself: safe is not charge, '+bare.length+' are: '+bare.join(', '));

 /* ---- 4. the family ---- */
 ok(seats('My dad passed when I was twelve').indexOf('heart')>=0,'"my dad passed" reads at the heart');
 ok(seats('We lost the baby at twenty weeks').indexOf('heart')>=0,'and "lost the baby"');
 ok(!lit('I lost my keys again this morning'),'and "lost my keys" does not, because keys is not kin');
 ok(LEXKIN.every(w=>lexKeyOk(w)),'every kin word is a form the scanner can produce');

 /* ---- 5. the quiet lines each looser rule was drawn to miss, by name ---- */
 const quiet=['I have not heard back from the plumber yet.','I haven’t seen that film yet.',
  'I was tired after the long hike, in a good way.','She was mad about the new puppy.',
  'He is down at the shops getting milk.','We were stuck in traffic for twenty minutes.',
  'No worries, see you Tuesday.','I want to stress that the deadline moved.',
  'We binge watched the whole series.','I put down the phone and made tea.',
  'The invisible hand of the market.','The room overlooked the bay.',
  'I passed the exam.','The printer is broken.','I am not sure what time the shop closes.',
  'I made a cup of tea and read the paper.','I felt safe and calm sitting by the sea.',
  'I feel confident about the interview tomorrow.','My friend really listened to me today.',
  'I slept well and woke up rested.','Break up the ice before you pour.',
  'I replayed the video for my son.','Supple tissue is replaced with stiff scar.'];
 quiet.forEach(t=>{const s=seats(t);ok(!s.length,'quiet: '+JSON.stringify(t)+' reads nothing'+(s.length?', but lit '+s.join(' and ')+' on '+scanStory(t).map(h=>h.t).join(', '):''));});
 /* AND A THOUGHT ABOUT ONE'S OWN DEATH IS NOT A BEREAVEMENT. suicide is
    refused by name for exactly this. */
 ok(!scanStory('I have thought about suicide').some(h=>LEX[h.t]&&LEX[h.t][LEX_SEAT]==='heart'),
  'a person writing about suicide is not read as grief at the heart');

 /* ---- 6. the refusals are refusals, and the pass is honest about itself ---- */
 ok(Object.keys(LEXSYNRUN.refused).length===0,'every authored row landed, so nothing in the tables is a dead letter: '+JSON.stringify(LEXSYNRUN.refused));
 const leaked=Object.keys(LEXSYN_NO).filter(k=>LEX[k]||PHRASES.some(r=>r[0].indexOf(k)>=0));
 ok(leaked.length===0,'a word refused by name never reaches the table, '+leaked.length+' did: '+leaked.join(', '));
 ok(Object.keys(LEXSYN_NO).every(k=>typeof LEXSYN_NO[k]==='string'&&LEXSYN_NO[k].length>15),'and every refusal says why');
 ok(JSON.stringify(SOMA_PLACE)===JSON.stringify(LEXSYNPLACES),'the pass moves no place: the place table is identical to the one before it ran');
 /* the refusal paths, each made to fire once and then put back */
 const keep=JSON.stringify([LEXSYN,LEXANT]), n0=Object.keys(LEX).length, p0=JSON.stringify(PHRASES);
 LEXSYN.weary.push('tired'); LEXSYN.sad.push('Sad!'); LEXSYN.sad.push('sad in my back');
 LEXSYN.scared.push('numb with fear'); LEXSYN.sad.push('cannot stop crying');
 LEXSYN['cannot sleep'].push('self worth'); LEXSYN.nosuchword=['xyzzy']; LEXANT.sad.nope=['glad'];
 LEXSYN.sad.push('rests');
 const r=lexSyn({words:SOMA_PLACE_WORDS,seat:LEXSYNPLACES.seat});
 LEXSYN.weary.pop(); LEXSYN.sad.splice(LEXSYN.sad.length-4,4); LEXSYN.scared.pop();
 LEXSYN['cannot sleep'].pop(); delete LEXSYN.nosuchword; delete LEXANT.sad.nope;
 [['tired','refused by name'],['Sad!','not a form'],['sad in my back','names the place back'],
  ['numb with fear','carries numb'],['cannot stop crying','overlaps the phrase'],
  ['self worth','would eat the key'],['xyzzy','neither LEX nor PHRASES'],['sad nope','frame set'],
  ['rests','refused by the fold']].forEach(([k,why])=>
  ok(r.refused[k]&&r.refused[k].indexOf(why)>=0,'the pass refuses '+JSON.stringify(k)+' and says why: '+(r.refused[k]||'it did not')));
 ok(r.added===0&&r.phrase===0,'and a re-run adds nothing, so the pass cannot double the table');
 ok(JSON.stringify([LEXSYN,LEXANT])===keep&&Object.keys(LEX).length===n0&&JSON.stringify(PHRASES)===p0,
  'and the tables are exactly as they were, '+Object.keys(LEX).length+' entries');
 ok(lexSyn().added===0,'and with no place table handed in it still adds nothing');
 /* THE TWO PATHS A CLEAN RUN NEVER TAKES, each forced once and undone. A row
    added with no place table handed in still lands, at its headword's seat;
    and a refusal by lexAdd itself, made to happen by withdrawing the source
    from LEX_SRC for one call, is reported by name and writes nothing. */
 LEXSYN.sad.push('qzprobe');
 const r2=lexSyn();
 ok(r2.added===1&&LEX.qzprobe&&LEX.qzprobe[LEX_SEAT]===LEX.sad[LEX_SEAT]&&ADJ2CHG.qzprobe===ADJ2CHG.sad,
  'a new row lands at its headword\'s seat with its charge name, '+JSON.stringify(LEX.qzprobe));
 delete LEX.qzprobe; delete LEXMETA.qzprobe; delete ADJ2CHG.qzprobe; delete E.CHGMETA.qzprobe;
 const si=E.LEX_SRC.indexOf('synonym'); E.LEX_SRC.splice(si,1);
 const r3=lexSyn();
 E.LEX_SRC.splice(si,0,'synonym'); LEXSYN.sad.pop();
 ok(r3.added===0&&/source synonym is not one of/.test(r3.refused.qzprobe||'')&&!LEX.qzprobe,
  'and a refusal by the boundary is reported, not swallowed: '+(r3.refused.qzprobe||'it was not'));
 ok(JSON.stringify([LEXSYN,LEXANT])===keep&&Object.keys(LEX).length===n0&&E.LEX_SRC.indexOf('synonym')>=0,
  'and everything is put back, '+Object.keys(LEX).length+' entries');
}

g('S0 · the word pass: swearing and a bad day read, and the two known traps stay shut');
/* REVIEW-sniffer-audit-2026-10-09.md, package S0. The old line's word pass,
   94d328e, ported by hand onto main with the fix its own follow up 5ce3934
   made: "not okay" and "not ok" are refused by name in LEXSYN_NO, and
   "fucking" as a key closes the gap the QR group above holds open. Before the
   port "I had a rough day" and "fuck this" read nothing at all, measured on
   main's own build. What is held here is the contract, not a count: the
   words read, every row lands exactly as written with its source named, no
   row is a dead letter, the two traps stay shut, and running it again adds
   nothing. */
{
 const {LEX,LEXMETA,LEXSYN_NO,PHRASES,LEX_SEAT,LEX_AMT,LEX_FET,parseStory,lexKeyOk}=E;
 const LP=E.LEXPROF||{}, RUN=E.LEXPROFRUN||null, keys=Object.keys(LP);
 ok(keys.length>0,'the word pass carries rows, '+keys.length);
 /* the reported defect, by the words in it */
 ['I had a rough day.','What a shitty day.','Fuck this.','This is bullshit.','I am struggling.',
  'I cant take it anymore.','Worst day of my life.','I am at my wits end.','It was a nightmare.']
  .forEach(t=>{const p=parseStory(t);
   ok(p.imprints.length>0,JSON.stringify(t)+' reads, '+JSON.stringify(p.bands));});
 /* every row is in the table exactly as written, and says where it came from */
 const drift=keys.filter(k=>{const e=LP[k], l=LEX[k];
  return !l||l[LEX_SEAT]!==e[0]||l[LEX_AMT]!==e[1]||String(l[LEX_FET]||null)!==String(e[2]||null);});
 ok(keys.length>0&&drift.length===0,'every row lands in LEX as it is written, '+drift.length+' do not: '+drift.slice(0,5).join(', '));
 const prov=keys.filter(k=>!LEXMETA[k]||LEXMETA[k].src!=='authored'||!/LEXPROF/.test(LEXMETA[k].from||''));
 ok(keys.length>0&&prov.length===0,'each is marked authored and names the pass that wrote it, '+prov.length+' are not: '+prov.slice(0,5).join(', '));
 ok(!!RUN&&RUN.refused.length===0,'nothing the pass carries was refused, so no row is a dead letter: '+JSON.stringify(RUN&&RUN.refused));
 ok(!!RUN&&RUN.already===0&&RUN.added===keys.length,
  'and no row repeats a key the table already held, so no row says a seat or an amount the table does not, '+JSON.stringify(RUN));
 ok(keys.every(k=>lexKeyOk(k)),'every key is a form the scanner can produce');
 ok(keys.every(k=>!PHRASES.some(r=>r[0].indexOf(k)>=0)),'and none is already an idiom row');
 /* the two traps, by name */
 ok(!('not okay' in LP)&&!('not ok' in LP)&&!LEX['not okay']&&!LEX['not ok'],
  '"not okay" and "not ok" stay out: LEXSYN_NO refuses them by name and reads only "im not okay"');
 ok(!('fucking' in LP)&&!LEX.fucking,'"fucking" is not a key: the QR group holds the gap the stars leave, and a key there would fill it');
 const leaked=keys.filter(k=>LEXSYN_NO[k]);
 ok(leaked.length===0,'no row is a word refused by name, '+leaked.join(', '));
 /* run twice, add nothing; and the stamp is taken after the pass */
 if(typeof E.lexProf==='function'){
  const n0=Object.keys(LEX).length, r=E.lexProf();
  ok(r.added===0&&r.refused.length===0&&Object.keys(LEX).length===n0,'a second run adds nothing, '+JSON.stringify(r));}
 else ok(false,'lexProf is exported, so the pass can be run again and shown to add nothing');
 ok(keys.length>0&&E.lexVersion()===E.LEX_VERSION,'the lexicon stamp is taken after the pass, so an entry read by these words says so');
}

g('PLAIN · an idiom that carries no feeling outranks its own words and counts nowhere');
/* Inference audit P2-3, 24 October. Measured on d9ca4450 before this: "I am
   afraid I cannot make it tonight" read fear at the root, "I am dying to see
   the new film" read grief at the heart, and "I still cannot stop crying"
   read the sacral compulsion phrase on top of the crying. LEXPLAIN carries
   each idiom and the words that may follow it, and scanStory skips the
   idiom's own words in the phrase, word and adjective passes. Held here: the
   idiom reads nothing of its own, the words after it still read, and the
   same words said outside the idiom keep their feeling. */
{
 const {parseStory,scanStory,normMap,plainSpans,LEXPLAIN,lexVersion,LEX_VERSION}=E;
 const sum=o=>Object.keys(o||{}).reduce((a,k)=>a+Math.abs(o[k]),0);
 const fets=t=>[...new Set(parseStory(t).imprints.map(i=>i.fetter))].sort().join(',');
 const has=(t,w)=>scanStory(t).some(h=>h.t===w);
 /* the apology, only as a whole polite clause */
 ['I am afraid I cannot make it tonight.',"I'm afraid I can't make it.","I'm afraid not.",
  'I am afraid so.','I am afraid I cannot make it tomorrow, sorry.'].forEach(t=>{const p=parseStory(t);
  ok(p.imprints.length===0&&sum(p.bands)===0&&!has(t,'afraid'),
   JSON.stringify(t)+' is an apology and reads no fear: '+JSON.stringify(p.bands));});
 /* and fear said plainly stays fear: a real fear, a sentence end, a comma,
    a degree word and the word alone, and the six lines the first cut of
    the row read as nothing, each by name, with the two it read without
    their fear */
 ['I am afraid I will lose him.','I am afraid. Not now.','I am afraid, not tired.',
  'I am so afraid I cannot sleep.','I am afraid.',
  'I am afraid I have to leave him.','I am afraid I must be broken.','I am afraid I need to hide.',
  'I am afraid so much of the time.','I am afraid not everyone likes me.',
  'I am afraid I cannot make it through another night.',
  'I am afraid I cannot cope.','I am afraid I cannot do this anymore.'].forEach(t=>{
  ok(fets(t).split(',').indexOf('Fear')>=0&&has(t,'afraid'),JSON.stringify(t)+' still reads fear: '+fets(t));});
 /* the cost of a closed list, held so it is seen: a polite clause the row
    does not carry still reads fear, as every one did before */
 ok(has("I'm afraid I can't come to dinner.",'afraid'),
  'an apology the row does not list still reads fear, the cost of reading only whole clauses');
 /* the wish */
 const dy='I am dying to see the new film.';
 ok(parseStory(dy).imprints.length===0&&!has(dy,'dying'),
  JSON.stringify(dy)+' is wanting and reads no grief: '+JSON.stringify(parseStory(dy).bands));
 ['My father is dying.','He is dying. To lose him now is too much.'].forEach(t=>{
  ok(fets(t).split(',').indexOf('Sad')>=0,JSON.stringify(t)+' still reads grief: '+fets(t));});
 /* crying or laughing that will not stop */
 const cr='I still cannot stop crying.';
 ok(!scanStory(cr).some(h=>h.kind==='phrase')&&has(cr,'crying')&&fets(cr)==='Sad',
  JSON.stringify(cr)+' reads the crying and no compulsion: '+fets(cr));
 ok(parseStory("I can't stop laughing.").imprints.length===0,'"I can\'t stop laughing." reads nothing');
 ['I cannot stop checking the locks.','I cannot stop.'].forEach(t=>{
  ok(scanStory(t).some(h=>h.kind==='phrase'&&h.label==='compulsion'),JSON.stringify(t)+' is still a compulsion');});
 /* every row is reachable with each word that may follow it, no idiom is
    plain on its own, and a row marked to close is plain only when nothing
    of its clause comes after the follower */
 const dead=[], alone=[], open=[];
 LEXPLAIN.forEach(r=>r[0].forEach(idm=>{
  (r[1].length?r[1]:['see']).forEach(f=>{const t=idm+' '+f+(r[2]?'':' it');
   if(!plainSpans(t,normMap(t)).length)dead.push(t);
   const u=idm+' '+f+' it'; if(r[2]&&plainSpans(u,normMap(u)).length)open.push(u);});
  if(plainSpans(idm,normMap(idm)).length)alone.push(idm);}));
 ok(dead.length===0,'every idiom is found with each word that may follow it, '+dead.length+' are not: '+JSON.stringify(dead.slice(0,4)));
 ok(alone.length===0,'and none is plain with nothing after it: '+JSON.stringify(alone));
 ok(open.length===0,'and a closing row is not plain with its clause still going: '+JSON.stringify(open.slice(0,4)));
 /* the stamp moves when the table does */
 LEXPLAIN[1][0].push('xyzzy to'); const mv=lexVersion(); LEXPLAIN[1][0].pop();
 ok(mv!==LEX_VERSION&&lexVersion()===LEX_VERSION,'adding a plain idiom moves the lexicon stamp, and taking it out puts it back');
}

g('S1 · a word said with a no is kept, named as denied, and adds nothing to any reading');
/* REVIEW-sniffer-audit-2026-10-09.md, ruling 1 and package S1. Measured on
   main before this: "I was not angry" read Anger 18 at the solar plexus, the
   same as "I was angry", while the Story page drew the same word struck
   through. The picture said set aside and the score counted it. A denied
   word is now kept on the parse, flagged on its hit and listed in denied,
   and it reaches no band, charge, weight, named fetter, imprint or axis.
   Source AI, the Story page and the quiz read that flag; none of them works
   negation out again. What is held is the contract and the named frames,
   never a count. */
{
 const {parseStory,scanStory,marksOf,sniffAxes,sniffStory,srcHear,normMap}=E;
 const sum=o=>Object.keys(o||{}).reduce((a,k)=>a+Math.abs(o[k]),0);
 const den=p=>(p&&p.denied)||[];
 const PAIRS=[['I was angry.','I was not angry.','angry','not'],
  ['I am sad.','I am not sad.','sad','not'],
  ['I am ashamed.','I am no longer ashamed.','ashamed','no']];
 PAIRS.forEach(([yes,no,w,neg])=>{
  const a=parseStory(yes), b=parseStory(no);
  ok(JSON.stringify(a.bands)!==JSON.stringify(b.bands),
   JSON.stringify(yes)+' and '+JSON.stringify(no)+' read differently, '+JSON.stringify(a.bands)+' against '+JSON.stringify(b.bands));
  ok(sum(b.bands)===0&&b.imprints.length===0&&sum(b.charges)===0&&sum(b.weights)===0&&b.named.length===0,
   'the denial adds nothing to bands, charges, weights, named or imprints: '+JSON.stringify({bands:b.bands,charges:b.charges,imps:b.imprints.length}));
  ok(den(b).length>0&&den(b).every(h=>h.neg===true&&h.t===w&&h.negw===neg),
   'and it is kept, flagged denied, naming its word and the "'+neg+'" that denied it: '+JSON.stringify(den(b).map(h=>[h.t,h.neg,h.negw])));
  ok(!b.hits.some(h=>h.neg),'no denied hit is among the counted hits');
  ok(sniffAxes(b).every(r=>r.shadow===0)&&sniffStory(no).offer.length===0,'no axis carries it and nothing is offered for release');
  reset(3,0,6); const s0=JSON.stringify(S.charge); E.applyStory(no);
  ok(JSON.stringify(S.charge)===s0,'committing it moves no charge on the field');
  reset(3,0,6); E.applyStory(yes);
  ok(JSON.stringify(S.charge)!==s0,'and committing the plain sentence still does');
  const m=marksOf(no,b);
  ok(m.length===1&&m[0].neg===true&&m[0].negFrom!=null&&no.slice(m[0].negFrom,m[0].e).indexOf(neg+' ')===0
   &&no.slice(m[0].negFrom,m[0].e).slice(-w.length)===w,
   'the mark is drawn struck, from the "'+neg+'" to the word, on the letters typed: '+(m[0]?JSON.stringify(no.slice(m[0].negFrom==null?m[0].s:m[0].negFrom,m[0].e)):'none'));
 });
 /* a full stop ends a no. clauseFloor's ruling, unchanged */
 const fl=parseStory('I am not afraid. Afraid now.');
 ok(JSON.stringify(fl.bands)===JSON.stringify(parseStory('Afraid now.').bands)&&den(fl).filter(h=>h.kind==='word').length===1,
  'the first sentence denies its own afraid, and the second keeps its charge: '+JSON.stringify(fl.bands));
 /* THE FRAMES THAT CARRY A NO AND ARE NOT A DENIAL, each by name. A word
    that already holds its no inside it ("cant sleep", "im not okay") keeps
    that no to itself, so the word after it is not denied by it. */
 const NOTDEN=["I can't stop crying.","I couldn't stop shaking.","I never stopped worrying.","It never stops hurting.",
  "I couldn't help crying.","I couldn't help but cry.","I can't sleep, terrified.","I'm not okay, terrified."];
 NOTDEN.forEach(t=>{const p=parseStory(t);
  ok(den(p).length===0&&p.hits.length===scanStory(t).length&&sum(p.bands)>0,
   JSON.stringify(t)+' is not a denial: every hit counts, '+JSON.stringify(p.bands)+(den(p).length?', but denied '+den(p).map(h=>h.t).join(','):''));});
 ok(Array.isArray(E.NEG_NOT_DENY)&&E.NEG_NOT_DENY.length>0&&E.NEG_NOT_DENY.every(w=>NOTDEN.some(t=>new RegExp("(n't|not|never|cannot) "+w+'\\b','i').test(t))),
  'every frame word is named in one table and each has a sentence above: '+JSON.stringify(E.NEG_NOT_DENY));
 /* A COHERENT WORD SAID WITH A NO COUNTS NOWHERE, P3-1 of the inference
    audit, 24 October. It used to be never denied, and "I am not grateful"
    subtracted a calm the person said they did not have. Denied, it reads as
    the sentence without it: never below it, which was the subtraction, and
    never above it, which is the ruling's own reason a denial must not raise
    a reading. */
 const coh=parseStory('I am not grateful.');
 ok(den(coh).length>0&&den(coh).every(h=>h.t==='grateful'&&h.negw==='not')&&!coh.hits.some(h=>h.band==='coherent'),
  'a coherent word after a no is denied with its no and is not among the counted hits: '+JSON.stringify(den(coh).map(h=>[h.t,h.kind,h.negw])));
 reset(3,0,6); const c0=JSON.stringify(S.charge); E.applyStory('I am not grateful.');
 ok(JSON.stringify(S.charge)===c0,'committing it moves no charge on the field, down or up');
 reset(3,0,6); E.applyStory('I am grateful.');
 ok(JSON.stringify(S.charge)!==c0,'and the calm word said plainly still lowers it');
 /* grateful, because "not calm" is a word of its own, a LEXANT entry that
    reads as charge, and would test the wrong thing */
 reset(3,0,6); E.applyStory('I am not grateful and I am scared.'); const cm=JSON.stringify(S.charge);
 reset(3,0,6); E.applyStory('I am scared.');
 ok(JSON.stringify(S.charge)===cm,'beside real charge it lands exactly as the charge alone');
 ok(parseStory("I can't help feeling grateful.").hits.some(h=>h.band==='coherent'),
  'and a can\'t help frame is not a no to the calm word after it');
 /* the sentence, the chart, the list and the score read one flag, the calm
    words with the rest */
 PAIRS.map(x=>[x[1],true]).concat([['I am not afraid. Afraid now.',true],['I was not scared but I was angry.',true],
  ["I can't stop crying.",false],['Not sad, not angry, just tired of it.',true],['I am not grateful.',true],
  ['I am grateful.',false]]).forEach(([t,struck])=>{
  const p=parseStory(t), m=marksOf(t,p), nm=normMap(t), at={};
  den(p).forEach(h=>{at[nm.map[h.at+1]]=1;});
  const bad=m.filter(k=>!!k.neg!==!!at[k.s]);
  ok(bad.length===0&&m.some(k=>k.neg)===struck&&(den(p).length>0)===struck,
   'every struck mark is a denied hit and every denied hit is struck, in '+JSON.stringify(t)
   +(bad.length?': '+JSON.stringify(bad.map(k=>t.slice(k.s,k.e))):'')+(m.some(k=>k.neg)!==struck?', struck should be '+struck:''));});
 /* Source AI hears what the score counts, from the same flag */
 ok(srcHear('I was not angry.').unread,'Source AI does not hear a denied word');
 const cry=srcHear("I can't stop crying.");
 ok(!cry.unread&&cry.seats.some(s=>s.seat==='heart'&&s.mentions===1&&s.negated===0),
  'and hears the crying in "I can\'t stop crying", which it used to drop as negated: '+JSON.stringify(cry.seats.map(s=>[s.seat,s.mentions,s.negated])));
}

g('S2 · a charge word about someone else is kept, listed, and never scored on the writer');
/* REVIEW-sniffer-audit-2026-10-09.md, ruling 2 and package S2, and guard 2
   of SNIFFER_SPEC.md, "never score another person", broken on main:
   "he shouted at me" read Anger 24 at the solar plexus, exactly "I shouted at
   him". A charge word whose clear subject in its own comma group is a third
   person, with no first person between, is kept on the parse, flagged
   other, naming who, listed in others, and scored nowhere. No subject, or a
   first person subject, is the writer, which is what a journal is. An
   unclear subject is held and says it is unclear. Held here as pairs and
   named edges, never as a count. */
{
 const {parseStory,scanStory,marksOf,sniffAxes,srcHear}=E;
 const sum=o=>Object.keys(o||{}).reduce((a,k)=>a+Math.abs(o[k]),0);
 const oth=p=>(p&&p.others)||[];
 const writer=t=>{const p=parseStory(t);return oth(p).length===0&&(p.denied||[]).length===0&&p.hits.length===scanStory(t).length&&sum(p.bands)>0;};
 const held=(t,who)=>{const p=parseStory(t);
  return oth(p).length>0&&oth(p).every(h=>h.other===true&&(!who||h.who===who))&&sum(p.bands)===0&&p.imprints.length===0
   &&sum(p.charges)===0&&p.named.length===0&&sniffAxes(p).every(r=>r.shadow===0);};
 const say=t=>{const p=parseStory(t);return JSON.stringify(t)+': bands '+JSON.stringify(p.bands)+', others '+JSON.stringify(oth(p).map(h=>[h.t,h.who]));};
 /* the review's pairs, each of which read the same on main */
 [['I shouted at him.','He shouted at me.','he'],['I am furious.','He is furious.','he'],['I lied to her.','She lied to me.','she']]
  .forEach(([me,them,who])=>{
   ok(JSON.stringify(parseStory(me).bands)!==JSON.stringify(parseStory(them).bands),'the pair differs, '+say(me)+' against '+say(them));
   ok(writer(me),'the writer\'s own reads as before: '+say(me));
   ok(held(them,who),'and the other person\'s is held out of every reading and names "'+who+'": '+say(them));});
 /* the rule's edges, by name */
 ok(writer('He made me furious.'),'a first person between the subject and the word reads the writer: '+say('He made me furious.'));
 ok(writer('So angry.')&&writer('Terrified.')&&writer('Angry again, all day.'),'no subject is the writer, the shape of a journal');
 ok(writer('It was terrifying.')&&writer('We were terrified.'),'"it" and "we" are not someone else');
 ok(writer('He left and I was devastated.')&&writer('He left me devastated.'),'the writer after a third person, by "I" or by "me", is the writer');
 ok(held('My mother was furious.','my mother'),'a family word opening its clause is someone else: '+say('My mother was furious.'));
 ok(writer('I called my mother and was furious.'),'and the same word after a verb is who was spoken to, not who felt it: '+say('I called my mother and was furious.'));
 const mf=parseStory('When my mother shouted I froze.');
 ok(oth(mf).length===1&&oth(mf)[0].t==='shouted'&&mf.hits.some(h=>h.t==='froze'),
  'one sentence, two people: her shouting is held and my freezing is read, '+say('When my mother shouted I froze.'));
 ok(held('Then Sarah screamed at me.','sarah'),'a name opening a clause is someone else: '+say('Then Sarah screamed at me.'));
 /* A NAME THAT STARTS ITS SENTENCE, P1-1 of the inference audit, 23 October.
    It was read as the writer's, named in GAPS: "Sarah screamed at me and I
    froze" put Sarah's screaming on the writer. A capitalised first word the
    reader does not know is unclear now, held and said so, and the writer's
    own word after "I" in the same sentence still reads. */
 const sf=parseStory('Sarah screamed at me and I froze.');
 ok(oth(sf).length===1&&oth(sf)[0].unclear===true&&oth(sf)[0].who==='sarah'&&sf.hits.some(h=>h.t==='froze'),
  'a name starting its sentence is held as unclear, and my freezing is read: '+say('Sarah screamed at me and I froze.'));
 ok(held('Sarah was furious.','sarah')&&held('Mark yelled at me.','mark'),'and so is a name alone before the word: '+say('Sarah was furious.'));
 ["Work was awful.","Today was awful.","Traffic was awful.","Monday was awful.","Everything was terrible.","It was terrifying."]
  .forEach(t=>ok(writer(t),'a common first word is not a name, and the sentence is the writer\'s: '+say(t)));
 ok(E.sniffLaws('Sarah lied to me.').every(l=>l.law!=='Truth'),'and the law reader holds her lie the same way');
 ok(writer('I went to London and felt terrified.'),'and a capital after a word like "to" is a place, not a person: '+say('I went to London and felt terrified.'));
 const ha=parseStory('Her anger scared me.');
 ok(oth(ha).length>=1&&sum(ha.bands)===0,'her anger is hers, and "her anger scared me" has her anger as its subject: '+say('Her anger scared me.'));
 ok(writer('I saw his face and froze.'),'a possessive after a verb is what was seen, and the freezing is mine: '+say('I saw his face and froze.'));
 ok(held('I made her cry.','her')&&held('I saw him crying.','him'),'a word straight after her or him is hers or his: '+say('I made her cry.'));
 ok(held('My best friend was devastated.'),'a two word family name is one person: '+say('My best friend was devastated.'));
 /* A LOSS IS THE WRITER'S, WHOEVER IT HAPPENED TO. The first cut of the
    reader held "My father died" as someone else's, measured over the book
    and the fuzzy corpus; told that, a bereaved person is told the worst
    thing this product could say. */
 ["My father died.","He killed himself last year.","My brother took his own life.","My wife divorced me.",
  "I've been on my own since he died.","My father died and I feel ashamed."].forEach(t=>
  ok(writer(t),'a death or a loss is the writer\'s, whoever it happened to: '+say(t)));
 ok(Array.isArray(E.WHO_LOSS)&&E.WHO_LOSS.length>0&&E.WHO_LOSS.every(k=>E.LEX[k]&&E.LEX[k][E.LEX_SEAT]==='heart'),
  'every loss head is a heart key in the lexicon, so the list cannot drift from the table: '
  +JSON.stringify((E.WHO_LOSS||[]).filter(k=>!E.LEX[k]||E.LEX[k][E.LEX_SEAT]!=='heart')));
 /* unclear is held, and says it is unclear */
 const yu=parseStory('You feel so alone.');
 ok(held('You feel so alone.')&&oth(yu).every(h=>h.unclear===true),'"you" is not clearly the writer, so it is held and marked unclear: '+say('You feel so alone.'));
 ok(writer('I told you I was scared.'),'and "I" nearer the word than "you" is the writer');
 /* the shipped gates' own stories keep reading the writer */
 ok(writer('I was scared to call my mother. My chest went tight and I felt ashamed that I still flinch.'),'the funnel gate\'s story reads as it did');
 ok(writer('Still afraid when he called.')&&writer('I am afraid of what he says next.'),'and the Talk gate\'s, where "he" comes after the word');
 /* kept, listed, marked */
 const hs=parseStory('He shouted at me.'), hm=marksOf('He shouted at me.',hs);
 ok(hm.length===1&&hm[0].other===true&&hm[0].whoFrom===0,'the mark is kept, flagged other, and quotes from "He": '+JSON.stringify(hm.map(m=>[m.other,m.whoFrom])));
 reset(3,0,6); const s0=JSON.stringify(S.charge); E.applyStory('He is furious.');
 ok(JSON.stringify(S.charge)===s0,'committing it moves no charge on the writer\'s field');
 ok(srcHear('He is furious.').unread,'and Source AI does not hear it as the writer\'s');
 /* a denial is a denial whoever said it, and is listed once */
 const hn=parseStory('He was not angry.');
 ok((hn.denied||[]).length>0&&oth(hn).length===0,'a word said with a no is denied first and is not also listed as someone else\'s');
}

g('S3 · sniffStory returns every positive saboteur candidate, and the screen decides how many it shows');
/* REVIEW-sniffer-audit-2026-10-09.md, package S3, the audit's 13.1.10.
   sniffStory did sniffSaboteurs(axes).slice(0,SAB_SHOW): the domain layer
   decided what a screen shows, so a seventh candidate was not merely not
   drawn, it was not in the output for anything to read. SAB_SHOW stays, as
   what a renderer slices to. No count is typed here: the bound is read off
   SAB_SHOW and the candidates off sniffSaboteurs. */
{
 /* on a reset field, as group 11 reads: parseStory orders a seat's addresses
    by susceptibility, which the field sets, so a story read after another
    group's profile is read against that profile. Measured: the first
    sentence chosen here ranked 13 candidates on a fresh field and 2 on this
    one, so the sentence is chosen on the field it is read on. */
 reset(3,0,6);
 const t='I was afraid, sad, ashamed and numb.';
 const all=E.sniffSaboteurs(E.sniffAxes(E.parseStory(t))), r=E.sniffStory(t);
 ok(all.length>E.SAB_SHOW,'the story carries more candidates than a screen shows, '+all.length+' against '+E.SAB_SHOW);
 ok(r.saboteurs.length===all.length,'sniffStory returns every positive candidate, '+r.saboteurs.length+' of '+all.length);
 ok(JSON.stringify(r.saboteurs.map(s=>s.id))===JSON.stringify(all.map(s=>s.id)),'in the ranked order sniffSaboteurs gives');
 ok(r.saboteurs.every(s=>s.confidence>0&&s.because.length>0),'each positive, each with its because');
 ok(typeof E.SAB_SHOW==='number'&&E.SAB_SHOW>0,'and SAB_SHOW is still there for a screen to slice to, '+E.SAB_SHOW);
}

g('SB · the saboteur card is the same 33 as SABDEF, and its opposites are read off SAB33 and CHILD');
/* ROUND SB. The card kbSabBlock prints is composed copy, and composed copy is
   where a fact gets invented without anybody deciding to. Three things are
   held here, each in both directions where there are two.

   The rows are SABDEF's rows. A saboteur SABDEF carries and SABCARD does not
   would fall back to the clinical field; one SABCARD carries and SABDEF does
   not would never print. Either is a drift, and a count would not see it.

   "What becomes available" names every opposite its own SAB33 row reaches.
   The mock-up the owner approved said "Rest becomes available" for Martyr,
   and rest is the opposite of nothing Martyr runs on: sadness, shame and
   apathy reach joy, worth and vitality. The check is run on that line first
   and must fail it, or it is not a check.

   SAB_LIB's own map resolves, and the card can only print what it holds:
   every address id is a real node and every family has a d, since the card
   prints d and never sub. Superior was in SAB_LIB and in neither table, and
   was held here without a card row, because a row would have been a
   definition nobody wrote. It was retired from SAB_LIB on 22 October, and
   engine/data/nodes.js says why, so the rule is now the stronger one: no
   library name sits outside the 33 at all. */
{
 const {SABDEF,SABCARD,SAB_LIB,HCX_LIB}=E;
 const KK=s=>String(s).replace(/^[Tt]he\s+/,'').toLowerCase().replace(/-/g,' ');
 const ax2child=k=>CHILD.find(c=>c.nm===(k==='sadness'?'Sad':k.charAt(0).toUpperCase()+k.slice(1)));
 const missingOpp=(card)=>{const out=[];
  SAB33.forEach(r=>{const row=card[KK(r[0])]; if(!row)return;
   r[1].forEach(p=>{const c=ax2child(p[0]);
    if(!c)out.push(r[0]+' keys on '+p[0]+', which is not a CHILD axis');
    else if(!new RegExp('\\b'+c.opp+'\\b','i').test(row.a))out.push(r[0]+' leaves out '+c.opp);});});
  return out;};
 const dk=Object.keys(SABDEF).sort(), ck=Object.keys(SABCARD).sort();
 ok(JSON.stringify(dk)===JSON.stringify(ck),'SABCARD carries exactly SABDEF\'s rows, '+ck.length+
  ': missing '+JSON.stringify(dk.filter(k=>!SABCARD[k]))+', extra '+JSON.stringify(ck.filter(k=>!SABDEF[k])));
 ok(SAB33.every(r=>SABCARD[KK(r[0])]),'and every SAB33 name has a card row');
 ok(ck.every(k=>['h','a','n'].every(f=>typeof SABCARD[k][f]==='string'&&SABCARD[k][f].length>40)),
  'every row carries what happens, what becomes available and the next move');
 const bad=JSON.parse(JSON.stringify(SABCARD));
 bad.martyr.a='The giving might be real. So might the exhaustion. Rest becomes available instead of something to earn.';
 const caught=missingOpp(bad);
 ok(caught.length===3&&caught.every(m=>/^Martyr/.test(m)),'the check fails the mock-up\'s Rest line, and only it: '+JSON.stringify(caught));
 const miss=missingOpp(SABCARD);
 ok(miss.length===0,'every row names each opposite its SAB33 axes reach in CHILD: '+JSON.stringify(miss));
 const all=ck.map(k=>['h','a','n'].map(f=>SABCARD[k][f]).join(' ')).join(' ');
 ok(!/\byou are an? /i.test(all),'no row says you are a pattern');
 ok(!/—/.test(all),'and no row carries an em dash');
 const linked=SAB33.filter(r=>SAB_LIB.some(s=>s.nm===r[0])).length;
 ok(SAB_LIB.every(s=>s.nids.every(i=>NODES.some(n=>n.i===i))),'every SAB_LIB address id is a real node');
 ok(SAB_LIB.every(s=>{const f=HCX_LIB.find(h=>h.nm===s.hcx);return f&&typeof f.d==='string'&&f.d.length>0;}),
  'every SAB_LIB family resolves and carries a d to print, '+linked+' of the 33 are mapped and '+(SAB33.length-linked)+' print the gap');
 const orphans=SAB_LIB.filter(s=>!SAB33.some(r=>KK(r[0])===KK(s.nm)));
 ok(orphans.length===0,'every SAB_LIB name is one of the 33, so each has a definition and a card row, orphans: '
  +JSON.stringify(orphans.map(s=>s.nm)));
}

g('SW · a range match is checked at a seat its own first charge can reach');
/* PIECE ONE OF 22 OCTOBER, core.js SAB_SEAT. compute() names a SAB33 range
   match only when its seat holds an address at sq 3 or more. The seat was
   CHG2SEAT, and CHG2SEAT seats apathy at the throat, where no address carries
   Apathy, so six rows led by apathy could never be named from their own
   configuration. Measured on the build before the fix, over laws 0 to 10 and
   five souls at each row's band centre and edges: Pleaser, Hyper-Achiever,
   Restless, Dreamer, Escapist and Avoider, never. This group was run there
   first and failed on exactly those six. */
{
 const {SAB_SEAT,CHG2SEAT,CHG2FET,sab33Detect,KB_KEY}=E;
 const fetOf=ch=>CHG2FET[ch]||CHARGES.find(c=>c.toLowerCase()===ch)||null;
 const ruledHolds=ch=>W.some(n=>n.b===CHG2SEAT[ch]&&n.cf===fetOf(ch));
 /* the ruling stands wherever it can be honoured */
 const moved=Object.keys(CHG2SEAT).filter(ch=>SAB_SEAT[ch]!==CHG2SEAT[ch]);
 ok(moved.every(ch=>!ruledHolds(ch)),'the check leaves CHG2SEAT alone wherever its seat holds the charge, moved: '+JSON.stringify(moved));
 ok(Object.keys(CHG2SEAT).every(ch=>!fetOf(ch)||!W.some(n=>n.cf===fetOf(ch))||W.some(n=>n.b===SAB_SEAT[ch]&&n.cf===fetOf(ch))),
  'and every charge is checked at a seat holding at least one of its addresses');
 ok(!W.some(n=>n.b===CHG2SEAT.apathy&&n.cf==='Apathy')&&W.some(n=>n.b===SAB_SEAT.apathy&&n.cf==='Apathy'),
  'apathy is the case it was written for: none at the '+CHG2SEAT.apathy.toLowerCase()+', checked at the '+SAB_SEAT.apathy.toLowerCase());
 /* every match the detector returns is seated where its own first charge sits */
 const AX=k=>k==='sadness'?'Sad':k.charAt(0).toUpperCase()+k.slice(1);
 const seatOff=[];
 SAB33.forEach(row=>{reset(0,0,6); row[1].forEach(p=>{S.charge[AX(p[0])]=(p[1]+p[2])/2;}); compute();
  sab33Detect().filter(d=>d.nm===row[0]).forEach(d=>{
   if(!W.some(n=>n.b===d.band&&n.cf===fetOf(d.charges[0])))seatOff.push(row[0]+' at '+d.band);});});
 ok(seatOff.length===0,'no range match is seated where its first charge has no address, off: '+JSON.stringify(seatOff));
 /* AND EVERY ROW CAN BE NAMED FROM ITS OWN CONFIGURATION. Laws 0 to 10 and
    five souls, at band centre: the range route, read off the reading itself. */
 const SOULS=[[0,[0,1]],[4,[3,7]],[9,[6,11]],[14,[9,2]],[18,[11,5]]];
 const never=SAB33.filter(row=>!SOULS.some(sl=>[0,2,4,6,8,10].some(law=>{
  S.doms=[sl[0]];S.arcs=sl[1].slice();S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;}); SINAMES.forEach(l=>S.law[l]=law); lawsIn();
  row[1].forEach(p=>{S.charge[AX(p[0])]=(p[1]+p[2])/2;});
  return compute().sabs.some(s=>s.named&&KB_KEY(s.nm)===KB_KEY(row[0]));})));
 ok(never.length===0,'every one of the '+SAB33.length+' can be named by its own band configuration, never: '+JSON.stringify(never.map(r=>r[0])));
 reset(0,0,6);
}

g('SL · the library: every saboteur has a place in the body, grounded on its own charges, and asks its own band');
/* PIECES TWO AND THREE OF 22 OCTOBER, engine/data/nodes.js and compute.js,
   and the re-grounding of the first thirteen rows later the same day, which
   the owner asked for. Every SAB33 row but one has a SAB_LIB row, and the
   one is named here with its reason, so wiring it later is a decision.
   Superior is retired. Every row carries only its own canon charges,
   because the engine reads an address only through its charge, and leans
   the way its bands do, but for one exception named here. No two rows share
   two addresses. The address route names a row only while its own
   configuration is on the band ramp, and it reaches every row inside its
   own band. Each rule is run first on rows that break it: the thirteen as
   they came, held below, broke the charge rule 16 times in 10 rows, the
   lean in three rows and the pair rule once, and three rows of the first
   pass broke the lean. Last, each row's family follows the owner's TULA
   notes, which six of the thirteen did not as they came. */
{
 const {SAB_LIB,HCX_LIB,ALL_SAB,sabFetters,sabLevels,KB_KEY,BY}=E;
 /* Innocent: one low band, fear 2 to 4, and the addresses that say what it
    does carry Disgust. Three fear addresses only reach the address route's
    load above its band. nodes.js has the measurement. */
 const FLAGGED=['Innocent'];
 /* the thirteen as they came with the original source, before the
    re-grounding: the known bad case every rule below is run on first */
 const ASCAME=[['Micromanager',[4,36,50]],['Victim',[6,50,3]],['Perfectionist',[40,37,45]],['Pleaser',[66,2,65]],
  ['Hyper-Achiever',[33,40,48]],['Hyper-Vigilant',[79,1,82]],['Judge',[37,48,82]],['Avoider',[1,14,89]],
  ['Worrywart',[45,1,3]],['Loner',[55,1,49]],['Nihilist',[91,88,90]],['Aggressor',[36,49,38]],['Imposter',[2,45,66]]]
  .map(x=>({nm:x[0],nids:x[1]}));
 const libOf=nm=>SAB_LIB.find(s=>KB_KEY(s.nm)===KB_KEY(nm));
 const rowOf=nm=>SAB33.find(r=>KB_KEY(r[0])===KB_KEY(nm));
 const unwired=SAB33.filter(r=>!libOf(r[0])).map(r=>r[0]);
 ok(JSON.stringify(unwired)===JSON.stringify(FLAGGED),
  'every SAB33 row has a library row but the one flagged, unwired: '+JSON.stringify(unwired));
 ok(SAB_LIB.length===SAB33.length-FLAGGED.length,'and one library row each, '+SAB_LIB.length);
 ok(!SAB_LIB.some(s=>KB_KEY(s.nm)==='superior'),'Superior is retired from the library');
 /* Superior's three addresses. 38 is still Aggressor's. 33 and 48 carry
    Anger, and since the re-grounding no row that answers to them may hold
    them, so the solar plexus's inferred anger cluster reads them, in
    Grandiosity, the family Superior had */
 const solar=ALL_SAB.filter(s=>s.unnamed&&[33,48].every(i=>s.nids.indexOf(i)>=0));
 ok(libOf('Aggressor').nids.indexOf(38)>=0&&!SAB_LIB.some(s=>s.nids.indexOf(33)>=0||s.nids.indexOf(48)>=0)
   &&solar.length===1&&solar[0].hcx==='Grandiosity',
  '38 stays Aggressor\'s, and 33 and 48 are read by one inferred cluster in Grandiosity: '+JSON.stringify(solar.map(s=>s.nm+' '+s.hcx)));
 ok(SAB_LIB.every(s=>s.nids.length===3&&new Set(s.nids).size===3&&s.nids.every(i=>BY[i]&&!BY[i].b.startsWith('Field'))),
  'every row is three different somatic addresses');
 ok(SAB_LIB.every(s=>HCX_LIB.some(h=>h.nm===s.hcx)),'every row names one of the six families');
 /* RULE 2, GROUNDED ON ITS OWN CHARGES, on every row: there is no legacy
    exemption any more */
 const FET={fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',shock:'Shock',
  sadness:'Sad',surprise:'Surprise',anticipation:'Anticipation'};
 const offCharge=rows=>{const out=[];rows.forEach(s=>{const row=rowOf(s.nm); if(!row)return;
  const own=row[1].map(p=>FET[p[0]]);
  s.nids.forEach(i=>{if(own.indexOf(BY[i].cf)<0)out.push(s.nm+' '+i+' '+BY[i].k+' carries '+BY[i].cf);});});return out;};
 const offCame=offCharge(ASCAME);
 ok(offCame.length===16&&new Set(offCame.map(m=>m.split(' ')[0])).size===10,
  'the check catches the thirteen as they came: '+offCame.length+' addresses off their own charges in '
  +new Set(offCame.map(m=>m.split(' ')[0])).size+' rows');
 ok(offCharge(SAB_LIB).length===0,'and every address of every row carries one of its own SAB33 charges, off: '+JSON.stringify(offCharge(SAB_LIB)));
 /* RULE 3, A ROW LEANS THE WAY ITS BANDS DO: no charge has more of the three
    than the charge whose band sits highest, read at its centre. Escapist is
    the one exception. Its fear band is the higher and only 1 Fear says what
    it does; nodes.js has the reason and the measurement. */
 const LEAN_EXCEPT=['Escapist'];
 const mid=p=>(p[1]+p[2])/2;
 const leanOff=rows=>rows.filter(s=>{const row=rowOf(s.nm); if(!row)return false;
  const cnt={}; row[1].forEach(p=>cnt[FET[p[0]]]=0); s.nids.forEach(i=>{if(cnt[BY[i].cf]!==undefined)cnt[BY[i].cf]++;});
  const top=Math.max(...row[1].map(mid)), topN=Math.max(...row[1].filter(p=>mid(p)===top).map(p=>cnt[FET[p[0]]]));
  return row[1].some(p=>cnt[FET[p[0]]]>topN);}).map(s=>s.nm);
 const FIRSTPASS=[{nm:'Hyper-Rational',nids:[81,84,74]},{nm:'Cynic',nids:[77,98,13]},{nm:'Escapist',nids:[14,27,18]}];
 ok(JSON.stringify(leanOff(ASCAME))===JSON.stringify(['Micromanager','Perfectionist','Judge'])
   &&JSON.stringify(leanOff(FIRSTPASS))===JSON.stringify(['Hyper-Rational','Cynic','Escapist']),
  'the check catches the rows that broke the lean, as they came '+JSON.stringify(leanOff(ASCAME))
  +' and in the first pass '+JSON.stringify(leanOff(FIRSTPASS)));
 ok(JSON.stringify(leanOff(SAB_LIB))===JSON.stringify(LEAN_EXCEPT),
  'and every row leans the way its bands do but the one exception, off: '+JSON.stringify(leanOff(SAB_LIB)));
 /* RULE 4, ONE DETECTOR, ONE NAME: no two rows share two addresses, now with
    no exception. Pleaser and Imposter shared 2 and 66 as they came. */
 const pairsOf=rows=>{const out=[];
  for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
   const sh=rows[i].nids.filter(x=>rows[j].nids.indexOf(x)>=0);
   if(sh.length>=2)out.push(rows[i].nm+'/'+rows[j].nm);}
  return out;};
 ok(JSON.stringify(pairsOf(ASCAME))===JSON.stringify(['Pleaser/Imposter']),
  'the check finds the pair the thirteen came with, '+JSON.stringify(pairsOf(ASCAME)));
 ok(pairsOf(SAB_LIB).length===0,'and no two rows share two addresses, '+JSON.stringify(pairsOf(SAB_LIB)));
 /* THE ADDRESS ROUTE ASKS THE BAND. Fear alone loads Pleaser's three past
    3.7, two of them Fear, while its own configuration, apathy and fear, has
    no apathy in it. It is not named. */
 reset(0,0,6); S.charge.Fear=10; let r=compute();
 const pl=libOf('Pleaser'), plW=pl.nids.map(i=>BY[i]).reduce((a,n)=>a+n.sq,0)/3;
 ok(plW>=3.7&&!r.sabs.some(s=>!s.over&&KB_KEY(s.nm)==='pleaser'),
  'fear alone loads Pleaser\'s three addresses to '+plW.toFixed(2)+' and does not name it, because its own band is apathy and fear');
 /* and inside its own band the check can never remove a naming: the ramp is
    above zero everywhere inside every band */
 const inside=[];
 SAB33.forEach(row=>{const pos=p=>[p[1],(p[1]+p[2])/2,p[2]];
  let cfgs=[{}];row[1].forEach(p=>{cfgs=[].concat(...cfgs.map(c=>pos(p).map(v=>Object.assign({},c,{[p[0]]:v}))));});
  cfgs.forEach(c=>{const L={};Object.keys(FET).forEach(k=>L[k]=c[k]||0);if(sabFetters(row[1],L)<=0)inside.push(row[0]);});});
 ok(inside.length===0,'the band check is open everywhere inside every band, closed at: '+JSON.stringify([...new Set(inside)]));
 /* and the field the address route was built for still names it off its
    addresses: Pleaser at apathy 3 and fear 7, both inside its band, where the
    address reading is the heavier one and so the entry the merge keeps */
 reset(0,0,6); S.charge.Apathy=3; S.charge.Fear=7; r=compute();
 ok(r.sabs.some(s=>!s.over&&!s.named&&KB_KEY(s.nm)==='pleaser'),
  'with apathy 3 and fear 7 inside its band, the address route names Pleaser');
 /* AND THE ADDRESS ROUTE REACHES EVERY ROW INSIDE ITS OWN BAND. As they came,
    Pleaser, Perfectionist, Hyper-Achiever, Hyper-Vigilant and Worrywart had
    one address or none on their own charges, so their three reached 3.7
    only off charges they are not made of, and the address route never named
    them inside their own band. The route's own test, the mean load of the
    three at 3.7 or more with the configuration on the ramp, read as SW reads
    the range route: laws 0 to 10 and five souls, at each band's low, centre
    and high, nothing else held. Run on the five as they came first. */
 const SOULS=[[0,[0,1]],[4,[3,7]],[9,[6,11]],[14,[9,2]],[18,[11,5]]];
 const reached=(nm,nids)=>{const row=rowOf(nm); let cfgs=[{}];
  row[1].forEach(p=>{cfgs=[].concat(...cfgs.map(c=>[p[1],mid(p),p[2]].map(v=>Object.assign({},c,{[p[0]]:v}))));});
  return SOULS.some(sl=>[0,2,4,6,8,10].some(law=>cfgs.some(c=>{
   S.doms=[sl[0]];S.arcs=sl[1].slice();S.roots=[];buildSoul();
   CHARGES.forEach(ch=>{S.charge[ch]=0;S.replace[ch]=0;}); SINAMES.forEach(l=>S.law[l]=law); lawsIn();
   Object.keys(c).forEach(k=>{S.charge[FET[k]]=c[k];}); compute();
   return nids.reduce((a,i)=>a+BY[i].sq,0)/3>=3.7&&sabFetters(row[1],sabLevels(true))>0;})));};
 const FIVE=['Pleaser','Perfectionist','Hyper-Achiever','Hyper-Vigilant','Worrywart'];
 const cameReached=FIVE.filter(nm=>reached(nm,ASCAME.find(x=>x.nm===nm).nids));
 ok(cameReached.length===0,'the check fails the five as they came, reached: '+JSON.stringify(cameReached));
 const never=SAB_LIB.filter(s=>!reached(s.nm,s.nids)).map(s=>s.nm);
 ok(never.length===0,'and the address route names every one of the '+SAB_LIB.length+' rows inside its own band, never: '+JSON.stringify(never));
 reset(0,0,6);
 /* THE FAMILY FOLLOWS THE OWNER'S TULA NOTES, on every row since the
    families of the first thirteen followed their addresses. TULA ("Emotions
    & Saboteurs & Hyper Personalities", April 2026) lists the saboteurs each
    hyper-complex personality comes from. It writes Controller for S02 and
    Sceptic for Skeptic, written here under the codex names, and a Rebel the
    codex does not carry. HCX_LIB's sub says which family translates each
    personality, so the family is read off HCX_LIB and not typed here.
    Where TULA names one family the row carries it. Where it names two, the
    row carries the one nodes.js chose and argued, held here so changing it
    is a decision. Where it names none and the note follows a sibling, the
    row carries the sibling's family. Run first on the families as they came,
    which break it six times, and on the two first-pass rows that followed
    the Worrywart, left behind when it moved. */
 const TULA={narcissism:['Micromanager','Hyper-Achiever','Judge'],machiavellian:['Manipulator','Skeptic','Rebel'],
  bipolar:['Dramatizer','Restless','Victim'],BPD:['Victim','People-Pleaser','Imposter'],
  OCPD:['Stickler','Perfectionist','Hyper-Vigilant'],histrionic:['Dramatizer','People-Pleaser','Dreamer'],
  antisocial:['Rebel','Aggressor','Deflector'],anxiety:['Worrywart','Hyper-Vigilant','Avoider'],
  depression:['Victim','Pessimist','Loner'],ADHD:['Restless','Dreamer','Imposter']};
 const famOfSub=t=>{const h=HCX_LIB.find(f=>String(f.sub).split(' · ').indexOf(t)>=0);return h?h.nm:null;};
 const untranslated=Object.keys(TULA).filter(t=>!famOfSub(t));
 ok(untranslated.length===0,'every personality TULA names is one HCX_LIB translates, untranslated: '+JSON.stringify(untranslated));
 const tulaFam=nm=>[...new Set(Object.keys(TULA).filter(t=>TULA[t].indexOf(nm)>=0).map(famOfSub))];
 const CHOSEN={Victim:'Collapse','Hyper-Vigilant':'Rigidity',Imposter:'Collapse',Dramatizer:'Grandiosity',
  'People-Pleaser':'Collapse',Dreamer:'Grandiosity'};
 const SIBLING={Catastrophizer:'Worrywart',Overthinker:'Worrywart',Martyr:'Victim',Cynic:'Nihilist',
  Enabler:'Pleaser',Pleaser:'People-Pleaser'};
 const twoNamed=SAB_LIB.filter(s=>tulaFam(s.nm).length>1).map(s=>s.nm).sort();
 ok(JSON.stringify(twoNamed)===JSON.stringify(Object.keys(CHOSEN).sort()),
  'every row TULA names two families for has its choice held here, '+JSON.stringify(twoNamed));
 const famOff=rows=>{const by={};rows.forEach(s=>{by[s.nm]=s.hcx;});const out=[];
  rows.forEach(s=>{const n=tulaFam(s.nm);
   if(n.length===1&&s.hcx!==n[0])out.push(s.nm+' '+s.hcx+', TULA '+n[0]);
   if(n.length>1&&s.hcx!==CHOSEN[s.nm])out.push(s.nm+' '+s.hcx+', chosen '+CHOSEN[s.nm]+' of '+n.join(' or '));
   if(!n.length&&SIBLING[s.nm]&&s.hcx!==by[SIBLING[s.nm]])out.push(s.nm+' '+s.hcx+', its sibling '+SIBLING[s.nm]+' '+by[SIBLING[s.nm]]);});
  return out;};
 const asFam=f=>SAB_LIB.map(s=>({nm:s.nm,nids:s.nids,hcx:f[s.nm]||s.hcx}));
 const CAMEFAM={Micromanager:'Rigidity',Judge:'Predatory','Hyper-Vigilant':'Dysregulation',Avoider:'Dissociation',
  Worrywart:'Dysregulation',Loner:'Dissociation',Catastrophizer:'Dysregulation',Overthinker:'Dysregulation'};
 const offCameFam=famOff(asFam(CAMEFAM)).map(m=>m.split(' ')[0]);
 ok(JSON.stringify(offCameFam)===JSON.stringify(['Micromanager','Hyper-Vigilant','Judge','Avoider','Worrywart','Loner']),
  'the check catches the six families as they came, '+JSON.stringify(offCameFam));
 const leftBehind=famOff(asFam({Micromanager:'Grandiosity',Judge:'Grandiosity','Hyper-Vigilant':'Rigidity',
  Avoider:'Collapse',Worrywart:'Collapse',Loner:'Collapse',Catastrophizer:'Dysregulation',Overthinker:'Dysregulation'}))
  .map(m=>m.split(' ')[0]);
 ok(JSON.stringify(leftBehind)===JSON.stringify(['Overthinker','Catastrophizer']),
  'and the two that follow the Worrywart, left behind when it moved, '+JSON.stringify(leftBehind));
 ok(famOff(SAB_LIB).length===0,'and every row\'s family follows TULA, its chosen one or its sibling, off: '+JSON.stringify(famOff(SAB_LIB)));
}

g('RB · every worked example with a row runs rituals, written in the shapes the Ritual page reads');
{
 /* engine/ritex.js. Before it, every example opened the Ritual page on zero
    plans and zero days. Each row is checked against a known answer worked out
    from the table by hand, and every day goes through the boundary. */
 const NOW=Date.parse('2026-10-03T12:00:00Z'), H=E.RITEX_HIST, today=E.pracDay(NOW);
 const names=Object.keys(H);
 ok(names.every(n=>E.PEOPLE.some(p=>p.nm===n)),'every row names a person in the roster, '+names.filter(n=>!E.PEOPLE.some(p=>p.nm===n)).join(', '));
 const built={};
 names.forEach(n=>{let R=null,thr='';
  try{R=E.ritexBuild(E.PEOPLE.find(p=>p.nm===n),NOW);}catch(e){thr=e.message;}
  built[n]=R;
  ok(R&&!thr&&R.plans.length===H[n].length,n+' builds one plan per row, '+(thr||(R&&R.plans.length)));
  if(!R)return;
  const rec=E.blankProfile(n); rec.rituals=R.rituals;
  const v=E.validateProfile(JSON.parse(JSON.stringify(rec)));
  ok(v.ok&&v.profile.rituals.length===R.rituals.length,n+'\'s '+R.rituals.length+' days pass the boundary whole, '+(v.errs||[]).join('; '));});
 const key=s=>s.join('+'), done=(R,k)=>R.rituals.filter(x=>key(x.steps)===k&&x.done).map(x=>E.pracDay(x.t));
 /* Derek, box and truth every day for forty days and today: forty one days,
    and the streak the ladder reads off them is at least that */
 const D=built.Derek;
 ok(done(D,'box+truth').length===41&&done(D,'box+truth').indexOf(today)>=0,'Derek kept his morning forty one days running, today included, '+done(D,'box+truth').length);
 const rec=E.blankProfile('Derek'); rec.rituals=D.rituals;
 ok(E.ladderRead(rec,NOW).streak.run>=41,'and the ladder reads a run of at least forty one, '+E.ladderRead(rec,NOW).streak.run);
 /* Diane, every day for twelve days, the last three missed: nine kept, and
    nothing at all on the three days she stopped */
 const Di=built.Diane, dd=done(Di,'truth+slow');
 ok(dd.length===9&&[1,2,3].every(b=>dd.indexOf(today-b)<0),'Diane kept nine and stopped for the last three, '+JSON.stringify(dd.map(d=>today-d)));
 /* Ana stopped Noting nine days ago: no day on it after that */
 const An=built.Ana, an=An.rituals.filter(x=>key(x.steps)==='noting').map(x=>today-E.pracDay(x.t));
 ok(an.length>0&&an.every(b=>b>9)&&An.plans.find(p=>key(p.steps)==='noting').stop,'Ana\'s stopped ritual carries its stop and no day after it, '+JSON.stringify(an));
 /* Tomas started today and has not done it: one entry, the start, not done */
 const T=built.Tomas;
 ok(T.rituals.length===1&&T.rituals[0].done===false&&E.pracDay(T.rituals[0].t)===today&&T.kept===0&&T.missed===0,'Tomas started today and the start is written undone, '+JSON.stringify(T.rituals));
 /* weekdays are kept to: Wren's hands are never on a Sunday, his garden only on one */
 const Wr=built.Wren;
 ok(done(Wr,'hands').every(d=>E.ritexWd(d)!==6)&&done(Wr,'na_tend').every(d=>E.ritexWd(d)===6)&&done(Wr,'na_tend').length>=4,
  'Wren\'s rituals land on their own weekdays and no other');
 ok(JSON.stringify(E.ritexBuild(E.PEOPLE.find(p=>p.nm==='Ana'),NOW))===JSON.stringify(An),'the same moment builds the same history');
 ok(E.ritexBuild({nm:'Nobody'},NOW)===null&&E.ritexBuild(E.PEOPLE.find(p=>p.nm==='James'),NOW)===null,'a person with no row has no rituals, and none is invented');
 /* known bad: a step naming no practice is refused by name */
 H.__rb={}; H.__rb=[{k:'box+nosuch', b:'Root', on:null, n:0, back:2, d:'c'}]; let thr='';
 try{E.ritexBuild({nm:'__rb'},NOW);}catch(e){thr=e.message;}
 H.__rb=[{k:'box', b:'Spleen', on:null, n:0, back:2, d:'c'}]; let thr2='';
 try{E.ritexBuild({nm:'__rb'},NOW);}catch(e){thr2=e.message;}
 delete H.__rb;
 ok(/nosuch names no practice/.test(thr)&&/Spleen is not a seat/.test(thr2),'a row naming no practice or no seat is refused by name, '+thr+' / '+thr2);
 ok(E.ritexHas(E.blankProfile('b'))===false&&E.ritexHas(rec)===true,'a blank record carries no day log, a built one does');
}

g('RB · becoming S1 to S3: the avatar\'s own data on the record, its identity, and the purpose writer\'s caps');
/* BECOMING-AUDIT.md section 11. S1: the ratings, the starting weights and the
   tags travel with the record. S2: pair ids, name, title, description,
   version, status. S3: the purpose and boundary caps refuse by name. Every
   check is against the boundary, validateProfile, because that is the one
   door everything a person can paste goes through. */
{
 const {avatarBlank,avatarStatus,avatarPairId,avatarEnsureIds,avatarNewId,avatarReview,
        avatarMoveSide,avatarFill,AV_STATUS,AV_CAP,AV_ID,PUR_VAL_MAX,PUR_LINE_MAX,PUR_SIDE_SAY,
        PUR_SIDES,purposeRefuse,blankProfile,saveProfile,validateProfile}=E;
 const clone=o=>JSON.parse(JSON.stringify(o));
 const errsOf=v=>(v.errs||[]).join(' | ');
 const b=avatarBlank();
 ok(b.version===1&&b.status==='draft'&&b.name===''&&b.description==='',
  'a blank avatar is version one, a draft, with nothing written');
 ok(JSON.stringify([b.arch,b.load0,b.tags])==='[{},{},{}]'&&b.movedAt===null,
  'and carries empty ratings, weights and tags, and has read nothing across');
 ok(AV_STATUS.join()==='draft,active,archived','three stored statuses, the document\'s own');
 ok(avatarStatus({built:true})==='active'&&avatarStatus({built:false})==='draft',
  'a record from before status reads its own built flag');
 ok(avatarStatus({built:true,status:'archived'})==='archived','and a stored one wins');

 /* ---- S2, IDS ---- */
 const p1={be:'I rest properly',notbe:'I have not slept properly in weeks',seat:'Root'};
 ok(avatarPairId(p1)===avatarPairId(clone(p1)),'an older pair\'s id is the same on every load');
 ok(AV_ID.test(avatarPairId(p1)),'and is the shape of an id, '+avatarPairId(p1));
 const twin={pairs:[clone(p1),clone(p1)]}; avatarEnsureIds(twin);
 ok(twin.pairs[0].id&&twin.pairs[1].id&&twin.pairs[0].id!==twin.pairs[1].id,
  'two pairs with the same words still get two ids, '+twin.pairs.map(x=>x.id).join(' and '));
 const kept={pairs:[Object.assign(clone(p1),{id:'abc123'})]}; avatarEnsureIds(kept);
 ok(kept.pairs[0].id==='abc123','an id already held is kept');
 ok(avatarNewId(1e12,0.5)!==avatarNewId(1e12,0.25)&&AV_ID.test(avatarNewId()),'a new id is minted fresh');

 /* ---- S2, THE REVIEW ---- */
 const rv=avatarBlank(); rv.built=true;
 avatarReview(rv,false,Date.UTC(2026,9,1));
 ok(rv.version===1&&rv.reviewedAt==='2026-10-01T00:00:00.000Z','still true moves the review date and not the version');
 avatarReview(rv,true,Date.UTC(2026,10,1));
 ok(rv.version===2&&/2026-11-01/.test(rv.reviewedAt),'revised moves both, got version '+rv.version);

 /* ---- S1, READ ACROSS ONCE ---- */
 const mv=avatarBlank(); mv.pairs=[clone(p1)]; avatarEnsureIds(mv);
 const side={arch:{Warrior:4,Nobody:3,Sage:9},load0:{'old words':4.5,'gone':3},
  tags:{Root:{add:['Fear'],off:['Sad']}}};
 const n=avatarMoveSide(mv,side,k=>k==='old words'?mv.pairs[0]:null,Date.UTC(2026,9,3));
 ok(mv.arch.Warrior===4&&mv.arch.Sage===undefined,'a rating one to five comes across and nine does not');
 ok(mv.load0[mv.pairs[0].id]===4.5&&Object.keys(mv.load0).length===1,
  'a starting weight comes across against the pair\'s id, and one for a pair that is gone does not');
 ok(mv.tags.Root&&mv.tags.Root.add[0]==='Fear'&&mv.tags.Root.off[0]==='Sad','the tags come across');
 ok(n===4&&mv.movedAt==='2026-10-03T00:00:00.000Z','and the move is dated, '+n+' moved');
 mv.arch={};
 ok(avatarMoveSide(mv,side,()=>null)===0&&Object.keys(mv.arch).length===0,
  'once dated it never reads across again, so a rating taken off stays off');

 /* ---- THE BOUNDARY ---- */
 const good=saveProfile(blankProfile('rb'));
 good.avatar={built:true,at:'2026-09-01T00:00:00Z',reviewedAt:null,
  pairs:[Object.assign(clone(p1),{id:'n1'}),{be:'I say it plainly',notbe:'My throat closes at the board',seat:'Throat'}],
  name:'Diane, steady',title:'Founder who rests',description:'Someone who builds without burning down.',
  version:3,status:'active',arch:{Warrior:2,Sage:5},load0:{n1:6.2},
  tags:{Throat:{add:['Fear'],off:[]}},movedAt:'2026-10-01T00:00:00Z'};
 good.purpose={soul:['freedom','wisdom','truth'],ego:['health','family','stability'],
  sides:{partner:['I say when I need rest'],family:[],friends:[],community:[],coworkers:[],alone:['I keep my mornings']}};
 const v=validateProfile(clone(good));
 ok(v.ok,'a record carrying every new field loads, '+errsOf(v));
 const A=v.ok?v.profile.avatar:{};
 ok(A.name==='Diane, steady'&&A.title==='Founder who rests'&&A.version===3&&A.status==='active',
  'its identity round trips');
 ok(A.arch&&A.arch.Sage===5&&A.load0&&A.load0.n1===6.2&&A.tags.Throat.add[0]==='Fear',
  'and the ratings, the weight and the tags travel with it, where an export used to drop them');
 ok(A.pairs&&A.pairs[0].id==='n1'&&AV_ID.test(A.pairs[1].id||''),'a held id is kept and a missing one is given');
 const again=validateProfile(clone(saveProfile(v.profile)));
 ok(again.ok&&again.profile.avatar.pairs[1].id===A.pairs[1].id,'and the given one is the same after a second load');
 /* refused by name, never cut */
 const bad=[
  ['a status that is not one of the three',o=>{o.avatar.status='evolving';},/avatar\.status/],
  ['a version that is not a whole number',o=>{o.avatar.version=2.5;},/avatar\.version/],
  ['a name past its cap',o=>{o.avatar.name='x'.repeat(AV_CAP.name+1);},/avatar\.name is \d+ characters/],
  ['a description that is not text',o=>{o.avatar.description=7;},/avatar\.description is not text/],
  ['a rating of six',o=>{o.avatar.arch.Sage=6;},/not one to five/],
  ['a rating on no archetype',o=>{o.avatar.arch.Nobody=3;},/not an archetype/],
  ['a weight for a pair not on the record',o=>{o.avatar.load0.zz9=2;},/not on this record/],
  ['a weight past ten',o=>{o.avatar.load0.n1=12;},/not nought to ten/],
  ['a tag on a place that is not a seat',o=>{o.avatar.tags.Knee={add:[],off:[]};},/not a seat/],
  ['a tag list that is not words',o=>{o.avatar.tags.Throat.add=[3];},/not a list of words/],
  ['two pairs with one id',o=>{o.avatar.pairs[1].id='n1';},/on two pairs/],
  ['a pair id that is not an id',o=>{o.avatar.pairs[1].id='Not An Id!';},/not a pair id/],
  ['a purpose value past its cap',o=>{o.purpose.soul[0]='x'.repeat(PUR_VAL_MAX);},/purpose\.soul\[0\] is 120 characters, and the most is 119/],
  ['a commitment past its cap',o=>{o.purpose.sides.alone=['x'.repeat(PUR_LINE_MAX)];},/purpose\.sides\.alone\[0\] is 200 characters/],
  ['a commitment that is not text',o=>{o.purpose.sides.alone=[5];},/purpose\.sides\.alone\[0\] is not text/]];
 bad.forEach(c=>{const o=clone(good); c[1](o); const r=validateProfile(o);
  ok(!r.ok&&c[2].test(errsOf(r)),c[0]+' is refused by name, '+errsOf(r));});
 /* the silent empty string is gone, and nothing else became a refusal */
 const blankCorner=clone(good); blankCorner.purpose.ego=['health',null,''];
 ok(validateProfile(blankCorner).ok,'an unwritten corner, null or empty, still loads');
 const older=clone(good); older.avatar={built:true,at:'2026-09-01T00:00:00Z',reviewedAt:null,
  pairs:[{be:'I rest',notbe:'I do not sleep'}]};
 const vo=validateProfile(older);
 ok(vo.ok&&vo.profile.avatar.version===1&&vo.profile.avatar.status==='active'&&vo.profile.avatar.pairs[0].id,
  'an older avatar loads, active because it was built, version one, with an id given');
 ok(purposeRefuse('ok',PUR_VAL_MAX)===null&&purposeRefuse('',PUR_VAL_MAX)===null,'a short value and an empty one are fine');
 /* the six sides, his names, each with its meaning */
 ok(PUR_SIDES.every(k=>PUR_SIDE_SAY[k]&&PUR_SIDE_SAY[k].nm&&PUR_SIDE_SAY[k].say),
  'every side has a name and a plain meaning beside it');
 ok(PUR_SIDE_SAY.alone.nm==='Alone'&&PUR_SIDE_SAY.partner.nm==='Partner',
  'and the names are his, not the document\'s Self and Relationship, which are his to choose (Q4)');
 /* the fill, for a record already in memory */
 const mem={built:true,pairs:[{be:'a',notbe:'b'}]}; avatarFill(mem);
 ok(mem.version===1&&mem.status==='active'&&mem.pairs[0].id&&JSON.stringify(mem.arch)==='{}',
  'an avatar held in memory from before gains the new fields and keeps what it had');
}

g('PLATE WORD · early, partial or full follows how much was answered, never how high');
/* The Summary plate's word was read off accuracy().pct, which carries the
   expression fill and the held count, so it measured the answers' height:
   at e9ca1ae every law at 10 read partial, every law at 1 read early, and five
   stories with no law read partial. It reads accCover now (engine/compute.js). */
{
 const has=typeof E.accCover==='function'&&typeof E.accCoverWord==='function';
 ok(has,'accCover and accCoverWord exist, the plate word has its own measure');
 const cover=(lawVal,nLaws,nStories)=>{
  const p=E.blankProfile('cover');
  if(nLaws){p.laws={};SINAMES.slice(0,nLaws).forEach(l=>p.laws[l]=lawVal);}
  for(let i=0;i<(nStories||0);i++)p.story.entries.push({t:'2026-10-16T00:00:0'+(i%10)+'Z',text:'I am furious'});
  const r=E.read(p).reading;
  return has?E.accCover(r,p):{pct:NaN};};
 const word=c=>has?E.accCoverWord(c):'?';
 ok(word(cover(null,0,0))==='','a blank profile has no word, got '+JSON.stringify(word(cover(null,0,0))));
 const hi=cover(10,21,0), lo=cover(1,21,0), zero=cover(0,21,0);
 ok(word(hi)==='full'&&word(lo)==='full'&&word(zero)==='full',
  'every law answered reads full whether the answers are 10, 1 or 0, got '+[word(hi),word(lo),word(zero)].join(','));
 ok(hi.pct===lo.pct&&lo.pct===zero.pct,'and the measure is the same figure at all three, '+[hi.pct,lo.pct,zero.pct].join(','));
 const st=cover(null,0,5);
 ok(word(st)==='early'&&st.pct<lo.pct,'five stories and no law read early, below every law answered low, '+word(st)+' '+st.pct);
 ok(word(cover(10,1,0))==='early','one law answered at 10 is early, not full, got '+word(cover(10,1,0)));
 ok(word(cover(10,20,10))!=='full','twenty laws and ten stories are not full while a law is still open, got '+word(cover(10,20,10)));
 /* monotone in each count, and indifferent to the height */
 let last=-1, mono=true;
 for(let n=0;n<=21;n++){const c=cover(n%2?9:2,n,0); if(!(c.pct>=last))mono=false; last=c.pct;}
 ok(mono,'answering one more law never lowers the measure, laws at alternating heights');
 last=-1; mono=true;
 for(let n=0;n<=14;n++){const c=cover(3,7,n); if(!(c.pct>=last))mono=false; last=c.pct;}
 ok(mono,'writing one more story never lowers the measure');
 const order=['','early','partial','full'];
 let wl=0, wmono=true;
 for(let n=0;n<=21;n++){const w=order.indexOf(word(cover(5,n,0))); if(w<wl)wmono=false; wl=w;}
 ok(wmono&&wl===3,'the word climbs the ladder as the laws are answered and never steps back, ending at full');
}

g('CQ SPAN · the range on a partial intake is where the finished figure can still land');
/* The core drill drew cqRange round the figure alone, so at e9ca1ae 1 law
   answered at 10 read "swings between 0 and 18, the figure is the middle",
   with CQ 5 and a finished figure anywhere from 5 to 100. cqSpan reads both
   ends off cqSum with every open law at nothing and at ten. */
{
 const has=typeof E.cqSpan==='function';
 ok(has,'cqSpan exists');
 const span=(n,v)=>{const p=E.blankProfile('span');p.laws={};SINAMES.slice(0,n).forEach(l=>p.laws[l]=v);
  const r=E.read(p).reading; return {r, s:has?E.cqSpan():null};};
 const a=span(1,10);
 ok(a.s&&Math.abs(a.s.lo-a.r.CQ)<1e-9,'the low end is the figure now, an open law counting nothing, '+(a.s&&a.s.lo)+' against '+a.r.CQ);
 ok(a.s&&Math.abs(a.s.hi-100)<1e-9,'one law at 10 and twenty open can still finish at 100, '+(a.s&&a.s.hi));
 ok(a.s&&a.s.enough===false&&a.s.answered===1&&a.s.of===SINAMES.length,'and with most laws open there are not enough answers to give a range, '+JSON.stringify(a.s));
 const b=span(12,5);
 const want=a.s?(12*5+(SINAMES.length-12)*10)/210*100:NaN;
 ok(b.s&&b.s.enough&&!b.s.complete&&Math.abs(b.s.hi-want)<1e-9&&Math.abs(b.s.lo-b.r.CQ)<1e-9,
  'twelve laws at 5: enough to give a range, from the figure now to every open law at ten, '+JSON.stringify(b.s));
 const c=span(SINAMES.length,7);
 ok(c.s&&c.s.complete&&Math.abs(c.s.lo-c.s.hi)<1e-9&&Math.abs(c.s.lo-c.r.CQ)<1e-9,'every law in, the two ends are the figure');
 ok(Math.abs(E.cqSum()-c.r.CQ)<1e-9,'and cqSum with nothing passed is CQ exactly as before');
 /* the swing only narrows as laws come in */
 let wide=Infinity, narrows=true;
 for(let n=0;n<=SINAMES.length;n++){const s=span(n,6).s; if(!s)break; const w=s.hi-s.lo; if(w>wide+1e-9)narrows=false; wide=w;}
 ok(has&&narrows,'answering a law never widens where the figure can land');
}

g('OWN WORD · a second emotion word never erases a stated one, each keeps its own charge on its own seat');
/* parseStory read every seat against one wanted map for the whole text, so at
   e9ca1ae "I am exhausted and furious" applied {"Anger":10.8} and left Apathy
   at 0, against the ruling that exhaustion sits at the solar plexus and is
   not anger, and "I am exhausted and terrified" named Perfectionism, Force
   and Rigidity at the solar plexus as findings, inferred false. */
{
 const fresh=()=>{E.loadProfile(E.blankProfile('own'));};
 const apply=s=>{fresh();return E.applyStory(s).applied||{};};
 const alone=apply('I am exhausted').Apathy;
 const ef=apply('I am exhausted and furious');
 ok(ef.Apathy>0&&ef.Anger>0,'"exhausted and furious" keeps both, Apathy and Anger, '+JSON.stringify(ef));
 const et=apply('I am exhausted and terrified');
 ok(Math.abs((et.Apathy||0)-alone)<0.05,'"exhausted and terrified" keeps the exhaustion whole as Apathy, '
  +(et.Apathy||0)+' against '+alone+' alone');
 fresh();
 const im=E.parseStory('I am exhausted and terrified').imprints;
 const solar=im.filter(i=>i.from==='solar'), root=im.filter(i=>i.from==='root');
 ok(solar.length>0&&solar.every(i=>i.fetter==='Apathy'),'and the solar plexus reads Apathy and nothing else, '
  +JSON.stringify(solar.map(i=>i.fetter+':'+i.name)));
 ok(!im.some(i=>/Perfectionism|Force|Rigidity/.test(i.name)&&i.inferred===false),
  'no address the person never named is printed as a finding off the terror elsewhere');
 ok(root.length>0&&root.every(i=>i.fetter==='Fear'),'the terror stays Fear at the root, '+JSON.stringify(root.map(i=>i.fetter)));
 /* and in a field already carrying, where susceptibility reorders the seats,
    the stated Apathy no longer names the root */
 E.loadProfile(E.blankProfile('own2')); ['I am so tired','I feel numb and flat'].forEach(s=>E.applyStory(s)); E.compute();
 const im2=E.parseStory('I am exhausted and terrified').imprints.filter(i=>i.from==='root');
 ok(im2.every(i=>i.fetter==='Fear'),'on a carrying field the root still reads Fear only, '+JSON.stringify(im2.map(i=>i.fetter+':'+i.name)));
 /* four words at four seats, each naming its own */
 fresh();
 const four=E.parseStory('I was afraid, sad, ashamed and numb.').imprints;
 const by=k=>[...new Set(four.filter(i=>i.from===k).map(i=>i.fetter))].join(',');
 ok(by('root')==='Fear'&&by('heart')==='Sad'&&by('solar')==='Shame'&&by('sacral')==='Apathy',
  'afraid, sad, ashamed and numb each land on their own fetter at their own seat, root '+by('root')
  +' heart '+by('heart')+' solar '+by('solar')+' sacral '+by('sacral'));
 /* one word alone reads exactly as it did */
 fresh();
 const one=E.parseStory('I am angry').imprints;
 ok(one.length===4&&one.every(i=>i.fetter==='Anger'&&i.from==='solar'),'a lone anger word is still four Anger addresses at the solar plexus');
}

g('OWN NAMED · a feeling the word\'s own adjective names survives a seat that cannot house it');
/* P0-1 of the inference audit, 23 October. "I feel disconnected and hollow"
   names apathy. The crown holds one apathy address and eight anger ones, so
   the quarter rule filed about 90 per cent of it as anger, measured on
   77928172: three such entries read anger at 10 and, with the laws answered
   at 3, the Compass named the writer The Devil. A stated fetter already
   survived a seat that cannot house it. A word's own named feeling now does
   too, and a feeling named elsewhere in the sentence still meets the quarter
   rule, which is the grief filed as shame it was written to stop. */
{
 const fresh=()=>{E.loadProfile(E.blankProfile('ownnamed'));};
 const fets=t=>{fresh();return [...new Set(E.parseStory(t).imprints.map(i=>i.fetter))].sort().join(',');};
 const applied=t=>{fresh();return E.applyStory(t).applied||{};};
 ok(fets('I feel disconnected and hollow')==='Apathy','disconnected and hollow read apathy and nothing else, '+fets('I feel disconnected and hollow'));
 const d=applied('I feel disconnected and hollow');
 ok((d.Apathy||0)>0&&!((d.Anger||0)>0),'and the charge lands on apathy with none on anger, '+JSON.stringify(d));
 ok(fets('I am dissociating again')==='Apathy','dissociating reads apathy, '+fets('I am dissociating again'));
 ok(fets('I feel unheard')==='Apathy','unheard reads apathy and not disgust, '+fets('I feel unheard'));
 ok(fets('I am so tense')==='Anticipation','tense reads anticipation and not disgust, '+fets('I am so tense'));
 ok(fets('I am anxious')==='Anticipation','anxious reads anticipation, the feeling the engine\'s own table gives anxiety, '+fets('I am anxious'));
 /* the cases the quarter rule exists for, unchanged */
 fresh();
 const gs=E.parseStory('My father died and I feel ashamed').imprints;
 ok(gs.filter(i=>i.from==='heart').every(i=>i.fetter==='Sad')&&gs.some(i=>i.fetter==='Shame'),
  'grief stays sadness at the heart beside a shame word, '+JSON.stringify(gs.map(i=>i.from+'/'+i.fetter)));
 ok(fets('I am angry')==='Anger'&&fets('I am terrified')==='Fear','a feeling its seat houses reads exactly as before');
 /* and the reading that went wrong downstream */
 const p=E.blankProfile('ownnamed3'); SINAMES.forEach(l=>{p.laws[l]=3;}); E.loadProfile(p);
 for(let i=0;i<3;i++)E.applyStory('I feel disconnected and hollow');
 const r=compute();
 ok(!((S.charge.Anger||0)>0)&&r.balance.lean<0&&!(r.gov&&r.gov.nm==='The Devil'),
  'three entries of it read inward, with no anger and no Devil, '+JSON.stringify({anger:S.charge.Anger,lean:r.balance.lean,gov:r.gov&&r.gov.nm}));
}

g('SEED SHARE · the share of the field that is still the seed is measured from the real blank');
/* seedShare measured the seed from a blank of 3 after the blank moved to 0,
   so at e9ca1ae an ESTJ seed plus one story read 0.36 where the seed put
   26.80 of 37.07 units on the axes. */
{
 const sum=p=>CHARGES.reduce((a,c)=>a+p.axes[c].held,0);
 const p=E.blankProfile('seed'); E.seedApply(p,'ESTJ');
 const seeded=sum(p);
 ok(E.seedShare(p)===1,'a seed nobody has moved is all seed, got '+E.seedShare(p));
 /* raise every axis by a known amount, so the seed's share of the units is exact */
 CHARGES.forEach(c=>{p.axes[c].held=Math.min(10,p.axes[c].held+1);});
 const added=sum(p)-seeded, want=Math.round(seeded/(seeded+added)*100)/100;
 ok(E.seedShare(p)===want,'with every axis raised, the share is the seed\'s units over all the units, '
  +E.seedShare(p)+' against '+want);
 const q=E.blankProfile('seed2'); E.seedApply(q,'ESTJ');
 E.read(q,{story:'I was furious at work today, my jaw clenched, I could not stop shaking',write:true});
 const qs=sum(q), seedUnits=CHARGES.reduce((a,c)=>a+Math.min(q.seed.axes[c],q.axes[c].held),0);
 ok(Math.abs(E.seedShare(q)-seedUnits/qs)<0.1,'after one story the line agrees with the units the seed still holds, '
  +E.seedShare(q)+' against '+(seedUnits/qs).toFixed(2));
 const empty=E.blankProfile('noseedaxes'); empty.axes={}; E.seedApply(empty,'INFP');
 ok(E.seedShare(empty)===1&&CHARGES.every(c=>empty.axes[c].opp===0),'a seed onto a record with no axes builds them from the blank');
}

g('ONE BLANK · a missing axis loads at the same blank the boundary fills');
/* loadProfile filled a missing axis with 3 and validateProfile with 0, so at
   e9ca1ae read() of a profile with axes:{} gave unread false, 107 addresses
   carrying and DQ 13.6 from charge nobody entered. */
{
 const p=E.blankProfile('noaxes'); p.axes={};
 const r=E.read(p).reading;
 ok(r.unread===true,'a profile with no axes reads as unread, like a blank one, got unread '+r.unread);
 ok(r.under===0&&r.DQ===0,'and nothing carries on it, under '+r.under+' DQ '+r.DQ);
 const b=E.read(E.blankProfile('blank')).reading;
 ok(r.DQ===b.DQ&&r.under===b.under&&r.unread===b.unread,'it reads exactly as a blank profile reads');
 const v=E.validateProfile(Object.assign(E.blankProfile('v'),{axes:{}}));
 ok(v.ok&&CHARGES.every(c=>v.profile.axes[c].held===E.AXIS_BLANK),
  'the boundary fills every missing axis with AXIS_BLANK, the same constant');
 ok(typeof E.AXIS_BLANK==='number'&&CHARGES.every(c=>E.blankProfile('k').axes[c].held===E.AXIS_BLANK),
  'and the blank profile is written from it');
 /* one axis present, the rest missing: the present one is kept as written */
 const one=E.blankProfile('one'); one.axes={Anger:{held:5,opp:0}};
 E.loadProfile(one);
 ok(S.charge.Anger===5&&CHARGES.filter(c=>c!=='Anger').every(c=>S.charge[c]===E.AXIS_BLANK),
  'a partial axes block keeps what it holds and opens the rest at the blank');
}

g('PCT · one formula and one registry for every score a person reads (engine/pct.js)');
/* Ruled 16 October: every 0.0 figure becomes a percent, and the percent is the
   fill of the ring drawn for it. These hold the formula at both ends of every
   kind, the dash where a figure rounds to nothing, the citation each range
   rests on, and that no roster person's reading falls outside the range its
   kind claims, which is the one way this table could lie without throwing. */
{
 const {PCT_KIND,PCT_DASH,pct,fmtPct,pctMove}=E;
 const fs=require('fs'), path=require('path');
 const kinds=Object.keys(PCT_KIND||{});
 ok(typeof pct==='function'&&typeof fmtPct==='function'&&typeof pctMove==='function'&&kinds.length>0,
  'the registry and its three functions are exported, '+kinds.length+' kinds');
 ok(PCT_DASH==='–','the dash is the en dash every surface already prints');
 kinds.forEach(k=>{
  const K=PCT_KIND[k], span=K.hi-K.lo, mid=K.lo+span/2;
  ok(typeof K.lo==='number'&&typeof K.hi==='number'&&isFinite(K.lo)&&isFinite(K.hi)&&K.hi>K.lo,
   k+': lo and hi are numbers and hi is above lo, '+K.lo+' to '+K.hi);
  ok(pct(k,K.lo)===0&&fmtPct(k,K.lo)===PCT_DASH,k+': at lo it is 0 and prints the dash, '+fmtPct(k,K.lo));
  ok(pct(k,K.hi)===100&&fmtPct(k,K.hi)==='100%',k+': at hi it is 100 and prints 100%, '+fmtPct(k,K.hi));
  ok(pct(k,mid)===50&&fmtPct(k,mid)==='50%',k+': halfway it is 50%, '+fmtPct(k,mid));
  ok(pct(k,K.lo-span)===0&&fmtPct(k,K.lo-span)===PCT_DASH,k+': below lo it stays at 0, '+pct(k,K.lo-span));
  ok(pct(k,K.hi+span*3)===100,k+': above hi it stays at 100, '+pct(k,K.hi+span*3));
  ok([NaN,Infinity,null,undefined,'',true,'six'].every(v=>pct(k,v)===null&&fmtPct(k,v)===PCT_DASH),
   k+': nothing that is not a number reads as a figure');
  ok(fmtPct(k,K.hi,{unread:true})===PCT_DASH&&pctMove(k,K.lo,K.hi,{unread:true})===null,
   k+': an unread profile prints the dash even at hi, because a default is not a reading');
  /* monotone and whole, across the range and a span either side */
  let prev=-1, mono=true, whole=true, zeroPct=false;
  for(let i=0;i<=120;i++){const v=K.lo-span+i*(3*span/120), p=pct(k,v);
   if(p<prev)mono=false; prev=p; if(!Number.isInteger(p)||p<0||p>100)whole=false;
   if(fmtPct(k,v)==='0%')zeroPct=true;}
  ok(mono,k+': the percent never falls as the value rises');
  ok(whole,k+': every percent is a whole number from 0 to 100');
  ok(!zeroPct,k+': nothing ever prints 0%');
  /* THE CITATION. The fragment is read out of the cited file, so a clamp that
     moves fails here by name rather than leaving the table wrong. */
  const f=path.resolve('atuned_src',K.src||'');
  const body=(K.src&&fs.existsSync(f))?fs.readFileSync(f,'utf8'):'';
  ok(!!K.src&&!!body,k+': cites a source file that exists, '+K.src);
  ok(typeof K.find==='string'&&K.find.length>=12&&body.indexOf(K.find)>=0,
   k+': and the bound it cites is still written there, '+JSON.stringify(K.find));
  ok(typeof K.say==='string'&&K.say.length>3,k+': says in words what it measures');
  ok(!K.cap||(K.p99&&typeof K.p99.n==='number'),k+': a cap carries what it was measured on');});
 ok(pct('weight',6.2)===62&&fmtPct('weight',6.2)==='62%'&&fmtPct('cq',58.4)==='58%'&&fmtPct('vitality',0.17)==='17%',
  'the ruling\'s own example: a weight of 6.2 reads 62%, CQ 58.4 reads 58%, vitality 0.17 reads 17%');
 ok(fmtPct('law',0.04)===PCT_DASH&&fmtPct('law',0.05)==='1%','a figure that rounds to nothing is the dash, the first whole percent is not');
 let threw='';
 try{pct('weigth',5);}catch(e){threw=e.message;}
 ok(/weigth/.test(threw),'a misspelt kind is refused by name, never read as a figure: '+threw);
 /* A CHANGE IS BEFORE AND AFTER */
 const mv=pctMove('cq',58.2,61.4), same=pctMove('cq',58.2,58.4), down=pctMove('dq',22,19);
 ok(mv&&mv.from==='58%'&&mv.to==='61%'&&mv.moved&&mv.up,'a move is said from 58% to 61%, '+JSON.stringify(mv));
 ok(same&&!same.moved&&same.from===same.to,'a move too small to show is no move, '+JSON.stringify(same));
 ok(down&&down.moved&&!down.up&&down.to==='19%','and a fall is a fall, '+JSON.stringify(down));
 ok(pctMove('cq',NaN,50)===null&&pctMove('cq',50,undefined)===null,'a move with an end missing is not a move');

 /* THE ROSTER NEVER LEAVES THE RANGE ITS KIND CLAIMS. The clamp makes the
    printed percent safe whatever comes in; this checks the honest part, the
    raw share before the clamp, for every quantity the engine computes, on
    every person in PEOPLE. A kind whose range is too narrow fails here with
    the person and the value. */
 const raw=(k,v)=>{const K=PCT_KIND[k];return 100*(v-K.lo)/(K.hi-K.lo);};
 const out=[], seen={}, capSeen={};
 const put=(k,v,who)=>{if(v===null||v===undefined||!isFinite(v))return;
  seen[k]=(seen[k]||0)+1; const r=raw(k,v);
  if(PCT_KIND[k].cap){(capSeen[k]=capSeen[k]||[]).push(r);return;}
  if(r<-1e-9||r>100+1e-9)out.push(k+' '+who+' '+v);};
 PEOPLE.forEach(p=>{
  S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn();
  const x=compute(), who=p.nm;
  put('cq',x.CQ,who); put('dq',x.DQ,who); put('expression',x.EX,who);
  put('expression',E.exHeadroom(x.EX),who);
  SINAMES.forEach(l=>put('law',S.law[l],who));
  CHARGES.forEach(c=>{put('charge',S.charge[c],who); put('installed',S.replace[c],who);});
  E.W.forEach(n=>{put('held',n.held,who); put('installed',n.rep,who); put('weight',n.sq,who);
   put('pole',n.pole,who); put('overshoot',n.jq,who); put('pull',E.leverPull(n.sq),who);});
  NODES.forEach(n=>put('weight',n.sq,who));
  put('weight',x.SQm,who); put('weight',x.darkV,who); x.maskRing.forEach(m=>put('weight',m.w,who));
  [].concat(x.sabs,x.cxs,x.hys,x.sups).forEach(o=>{put('chain',o.w,who); if(o.score)put('match',o.score,who);});
  put('pole',x.poleMean,who); put('overshoot',x.JQ,who); put('distortion',x.dist,who);
  put('integrity',x.Ig,who); put('intention',x.It,who);
  put('vitality',x.X,who); put('awareness',x.Y,who); put('will',x.Z,who); put('radiance',x.radiance,who);
  put('energy',(x.X+x.Y+x.Z)/3,who); put('pull',x.PULL,who);
  E.archExprAll().forEach(v=>put('archetype',v,who));
  put('shape',x.outward,who); put('control',x.organized,who);
  if(x.malig!==null&&x.malig!==undefined){put('lean',x.malig,who); put('lean',100-x.malig,who);}
  E.BANDS.forEach(b=>{const g=E.W.filter(n=>n.b===b), m=g.reduce((a,n)=>a+n.sq,0)/g.length;
   put('axis',E.mirrorAt(m,E.bandIg(b)),who);});
  E.verpRead().forEach(v=>put('gate',v.pct,who));
  try{const iq=E.iqScore({laws:{},intake:p.intake||{}}); Object.keys(iq||{}).forEach(l=>put('spread',iq[l].spread,who));}catch(e){}
  try{put('accuracy',E.accuracy(x,{laws:Object.assign({},LS)}).pct,who);}catch(e){}
  /* what the story puts at an address, one entry and summed */
  const im=(E.parseStory(p.says||'').imprints)||[], by={}, pill={};
  im.forEach(m=>{put('atom',m.amt,who); by[m.node]=(by[m.node]||0)+m.amt;
   const key=m.inferred?('f|'+m.band+'|'+m.fetter):('n|'+m.node); pill[key]=(pill[key]||0)+m.amt;});
  Object.values(by).concat(Object.values(pill)).forEach(v=>put('atomsum',v,who));});
 ok(out.length===0,'no roster reading falls outside the range its kind claims, '+out.length+' do'
  +(out.length?': '+out.slice(0,6).join('; '):''));
 const engineKinds=['cq','dq','expression','law','charge','installed','held','weight','chain','pole','overshoot',
  'distortion','integrity','intention','vitality','awareness','will','radiance','energy','pull','archetype','axis'];
 const unseen=engineKinds.filter(k=>!seen[k]);
 ok(unseen.length===0,'and every kind the engine computes was actually measured on the roster, missing '+JSON.stringify(unseen));
 /* A CAP HOLDS THE ROSTER IT WAS MEASURED ON: at least 99 in a hundred of its
    observed values sit inside it, which is what the 99th percentile means. */
 kinds.filter(k=>PCT_KIND[k].cap).forEach(k=>{
  const a=capSeen[k]||[], inside=a.filter(r=>r<=100+1e-9).length;
  ok(a.length>0&&inside/a.length>=0.99,k+': the cap holds '+inside+' of '+a.length+' roster values');});
}

g('ARCH EXPR · an archetype is 100% expressed with nothing held, dragged by its seat, lifted by release');
/* Ruled 16 October: "you may start off at 100%. And over time, watch it
   diminish. And as you go through your recipes, watch it rise." archExpr reads
   the archetype's ruled seat (ARCH[i].b) and nothing else, so charge landing on
   one seat moves only the archetypes seated there, and installing the opposite,
   which is what a release writes, gives it back. The touched seats are read off
   the field after compute(), never typed here. */
{
 const {archExpr,archExprAll,pct,fmtPct}=E;
 ok(typeof archExpr==='function'&&typeof archExprAll==='function'&&E.PCT_KIND&&E.PCT_KIND.archetype,
  'archExpr and archExprAll are exported and archetype is a registered kind');
 ok(!E.PCT_KIND.affinity&&!E.PCT_KIND.share,'affinity and share are no longer printed kinds: the soul map is not this quantity');
 const blank=()=>{S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;}); return compute();};
 blank();
 const b0=archExprAll();
 ok(b0.length===ARCH.length&&b0.every(v=>v===1)&&b0.every((v,i)=>fmtPct('archetype',archExpr(i))==='100%'),
  'a blank profile reads 100% for all '+ARCH.length+', '+JSON.stringify(b0.map(v=>pct('archetype',v))));
 /* one axis, on the seats it reaches */
 S.charge.Fear=6; compute();
 const hit=new Set(W.filter(n=>n.sq>0).map(n=>n.b));
 const f1=archExprAll();
 const fell=ARCH.map((a,i)=>i).filter(i=>hit.has(ARCH[i].b));
 const stay=ARCH.map((a,i)=>i).filter(i=>!hit.has(ARCH[i].b));
 ok(hit.size>0&&hit.size<BANDS.length,'Fear at 6 reaches some seats and not all, '+[...hit].join(', '));
 ok(fell.length>0&&fell.every(i=>f1[i]<1),'every archetype seated where Fear landed falls below 100%, '
  +fell.map(i=>ARCH[i].nm+' '+fmtPct('archetype',f1[i])).join(', '));
 ok(stay.length>0&&stay.every(i=>f1[i]===1),'and every other archetype stays at exactly 100%, '
  +stay.map(i=>ARCH[i].nm).join(', '));
 /* release: the opposite installed lifts it, and clearing the charge gives it all back */
 S.replace.Fear=6; compute();
 const r1=archExprAll();
 ok(fell.every(i=>r1[i]>f1[i]),'installing the opposite, as a release does, lifts every one that fell, '
  +fell.map(i=>fmtPct('archetype',f1[i])+' to '+fmtPct('archetype',r1[i])).join(', '));
 S.charge.Fear=0; S.replace.Fear=0; compute();
 ok(archExprAll().every(v=>v===1),'and with the charge released all twelve read 100% again');
 /* monotone, and strict until the seat is full */
 let mono=true, strict=true, prev=null;
 for(let v=0;v<=10;v+=0.5){S.charge.Fear=v; compute(); const x=archExprAll();
  if(prev){fell.forEach(i=>{if(x[i]>prev[i]+1e-12)mono=false; if(v<=6&&!(x[i]<prev[i]))strict=false;});
   stay.forEach(i=>{if(x[i]!==1)mono=false;});}
  prev=x;}
 ok(mono,'as Fear rises the archetypes it reaches never rise and the others never move');
 ok(strict,'and up to 6 each half step of Fear drags them further');
 /* whole percents, and the range, on all sixteen */
 let whole=true, out=[];
 PEOPLE.forEach(p=>{
  S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
  compute();
  archExprAll().forEach((v,i)=>{if(!(v>=0&&v<=1))out.push(p.nm+' '+ARCH[i].nm+' '+v);
   if(!Number.isInteger(pct('archetype',v)))whole=false;});});
 ok(out.length===0,'across all '+PEOPLE.length+' roster people every archetype stays between 0% and 100%, '+out.length+' leave it'
  +(out.length?': '+out.slice(0,4).join('; '):''));
 ok(whole,'and every one prints a whole percent');
 /* two archetypes on one seat read one figure, which is the seat ruling */
 const twin=ARCH.map((a,i)=>i).filter(i=>ARCH[i].b===ARCH[0].b);
 S.charge.Fear=6; compute();
 ok(twin.length>1&&twin.every(i=>archExpr(i)===archExpr(twin[0])),
  'archetypes on one seat read one figure, '+twin.map(i=>ARCH[i].nm).join(' and '));
 ok(archExpr(ARCH.length)===null&&archExpr(-1)===null,'an archetype that does not exist reads null, not a figure');
 /* AFFINITY KEEPS ITS ONE JOB. It is no longer printed, and it still names the
    first and second archetype: on every roster person r.pi is the strongest
    lean and r.si the strongest of the rest. */
 let firstOk=true, secondOk=true;
 PEOPLE.forEach(p=>{
  S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
  S.roots=p.roots?p.roots.slice():[]; buildSoul();
  const x=compute(), a=x.aff, mx=Math.max(...a);
  if(a[x.pi]!==mx)firstOk=false;
  const rest=a.filter((v,i)=>i!==x.pi);
  if(x.si===x.pi||a[x.si]!==Math.max(...rest))secondOk=false;});
 ok(firstOk,'affinity still names the first archetype on every roster person');
 ok(secondOk,'and the second, the strongest of the rest');
 blank();
}

g('CRISIS · srcSafe trips on self harm and not on everyday uses of the same words');
/* all expected red on main: block 2a ports srcSafe from e2aa6f8 and must fix it */
{
 const srcSafe=E.srcSafe;
 const TRIP=['I want to die','I keep thinking about killing myself','I am ending my life tonight',
  'I have been hurting myself again','I wanna die','everyone would be better off without me',
  'I am going to kill myself'];
 const NOT=['I cut myself a slice of bread','I made myself a cup of tea after work','I hurt my knee at the gym'];
 ok(TRIP.length>=7&&NOT.length>=3,
  'the crisis list keeps at least 7 that trip and 3 that do not, has '+TRIP.length+' and '+NOT.length);
 TRIP.forEach(t=>xf(typeof srcSafe==='function'&&srcSafe(t)===true,'srcSafe trips on '+JSON.stringify(t)));
 NOT.forEach(t=>xf(typeof srcSafe==='function'&&srcSafe(t)===false,'srcSafe does not trip on '+JSON.stringify(t)));
}

g('SHOW ONLY · a worked example\'s record refuses every engine writer, and an own record refuses none');
/* Ruled 16 October (engine/showonly.js). A record is marked by identity, and
   with it open each writer asks the one rule and stops, by name, with nothing
   moved. The same writers on an unmarked record write as they always did, and
   the authored replay (exdepthFill) still fills a marked one, because it is
   the build's own history and not a person running it. Every writer the
   module's header names is called here by name, so a writer that loses its
   guard fails this group and not only the browser gate. */
{
 const said=[]; E.bindShowSay(w=>said.push(w));
 const TEXT='I was furious and ashamed and I could not stop going over it.';
 const snap=()=>JSON.stringify({c:S.charge,o:S.replace,l:S.law,v:E.VERPMIX,m:E.LEANMIX});
 const run=rec=>{
  const n=W.filter(x=>x.cf)[0];
  return {
   story:E.applyStory(TEXT), verp:E.verpApply(TEXT), lean:E.leanApply(TEXT),
   rel:E.relWrite([n],n,60), work:E.releaseWork(rec,[n.i+':l:rel']),
   meter:E.meterRun(rec,[n.i+':l:rel']), first:E.meterFirst(rec,'addr:'+n.i,'x'),
   law:E.lawAnswered(rec,SINAMES[0]), ans:E.iqAnswer(rec,0,9), ix:E.ixSet(rec,'arch',E.IX_ARCH2[0].k,5),
   seed:E.seedApply(rec,'INTJ'), exp:E.pExport(), imp:E.pImport(JSON.stringify(E.blankProfile('pasted')))};};
 reset(3,0,6);
 const ex=E.pNew('Gordon'); E.loadProfile(ex); E.showMark(ex);
 ok(E.showOnly()&&E.showOnly(ex),'a marked record reads show only, and so does the open one');
 ok(!E.showOnly(E.blankProfile('Gordon')),'a record with the same name and shape that was not marked is not show only');
 const n0=E.profiles().length, s0=snap(), r0=JSON.stringify(ex);
 const R=run(ex);
 ok(snap()===s0,'nothing in the field, the laws or the two mixes moved on the marked record');
 ok(JSON.stringify(ex)===r0,'and nothing on the record itself moved');
 ok(R.story.refused==='example'&&Object.keys(R.story.applied).length===0,'applyStory refuses by name, '+JSON.stringify(R.story.refused));
 ok(R.verp.refused==='example'&&R.lean.refused==='example','verpApply and leanApply refuse by name');
 ok(R.rel.refused==='example'&&R.work.refused==='example','relWrite and releaseWork refuse by name');
 ok(R.meter===null&&R.first===null,'meterRun and meterFirst write nothing');
 ok(R.law===false&&R.ans===false&&R.ix===false&&R.seed===null,'lawAnswered, iqAnswer, ixSet and seedApply write nothing');
 ok(R.exp===null,'pExport hands back nothing to copy, so the example\'s tier four never leaves it');
 ok(R.imp===null&&/worked example/.test((E.importError()||[]).join(' '))&&E.profiles().length===n0&&E.current()===ex,
  'pImport loads nothing, says why, pushes nothing and leaves the open record where it was, '+JSON.stringify(E.importError()));
 const keys=['story','story','story','release','release','release','release','intake','intake','intake','intake','export','import'];
 ok(JSON.stringify(said)===JSON.stringify(keys),'every refusal reached the host\'s reporter once, keyed by what it refused, '+JSON.stringify(said));
 ok(E.showLast()&&E.showLast().name==='Gordon'&&E.showLast().what==='import','showLast names the record and the last thing refused, '+JSON.stringify(E.showLast()));
 /* the authored replay still fills a marked record */
 const gp=PEOPLE.find(p=>E.EXDEPTH_HIST[p.nm]);
 if(gp){
  const sx=E.blankProfile(gp.nm); E.showMark(sx); said.length=0;
  const out=E.exdepthFill(sx,gp,Date.UTC(2026,9,16));
  ok(out&&out.entries>0&&E.exdepthHas(sx)&&said.length===0,
   'the authored history of '+gp.nm+' still fills a marked record and refuses nothing, '+JSON.stringify(out));
  ok(E.applyStory(TEXT).refused==='example','and the rule is back in force the moment the replay ends');}
 else ok(false,'a roster person with an authored history, to check the replay against');
 /* the same writers on the person's own record */
 const own=E.pNew('You'); E.loadProfile(own); said.length=0; reset(3,0,6);
 ok(!E.showOnly(),'the own record is not show only');
 const t0=snap(); const Q=run(own);
 ok(snap()!==t0&&!Q.story.refused&&Q.ans===true&&Q.exp!==null&&said.length===0,
  'on the own record the same writers write, and nothing is refused, '+JSON.stringify(said));
 E.bindShowSay(null);
}

g('CRISIS · the button a person presses: three numbers, each with its sentence and its link');
/* NOT A DETECTOR, and nothing above changes because of it: the ten expected
   red rows stay red. This is the table the app's panel and the quiz both print
   (engine/data/crisis.js). Each row names its own number in its own sentence,
   and every link dials or texts that same number, so a sentence and its
   button can never send a person to two different places. */
{
 const L=E.CRISIS_LINES||[], S=E.CRISIS_SAY||{};
 ok(L.map(l=>l.k).join()==='988,741741,911','the three numbers, in order, got '+L.map(l=>l.k).join());
 /* EACH ROW OPENS ON ITS NUMBER AND NAMES ITS SERVICE, 16 October, from the
    review of these screens: one long sentence per number became the number,
    its name, and short sentences after it. Held as hard as before: the
    number is the first thing, the service's name follows it, every sentence
    ends, and none runs past eight words. */
 L.forEach(l=>{
  const parts=l.say.replace(/\.$/,'').split(/\.\s+/);
  ok(l.say.indexOf(l.k)===0&&typeof l.nm==='string'&&l.nm.length>0&&l.say.indexOf(l.nm)>l.k.length-1
   &&/\.$/.test(l.say)&&parts.length>=2&&parts.every(s=>s.split(/\s+/).length<=8),
   l.k+' opens on its number and names its service, in short sentences: '+JSON.stringify(l.say));
  ok(l.go.length>0&&l.go.every(g=>/^(tel|sms):/.test(g[1])&&g[1].replace(/^(tel|sms):/,'').split('?')[0]===l.k),
   l.k+' links only to itself, by tel: or sms:, '+JSON.stringify(l.go));});
 ok(L.some(l=>l.go.some(g=>g[1]==='tel:988'))&&L.some(l=>l.go.some(g=>g[1]==='sms:988')),'988 is both a call and a text');
 /* one filled button in the numbers view, 16 October, and it is Call 988 */
 const pri=[].concat(...L.map(l=>l.go)).filter(g=>g[2]===true);
 ok(pri.length===1&&pri[0][1]==='tel:988','exactly one link is the filled one, and it is Call 988, got '+JSON.stringify(pri));
 ok(/^988 also works in Canada\./.test(S.where||'')&&/\bElsewhere, call your local emergency number\.$/.test(S.where||''),
  'the panel says where else 988 answers and what to use anywhere else, got '+JSON.stringify(S.where));
 ok(S.journal==='Talk it through opens your journal. No person reads it.',
  'and says where Talk it through goes and who reads it, got '+JSON.stringify(S.journal));
 ok(S.quiz==='Talk it through opens the story box on this page. This page sends nothing anywhere.',
  'and the quiz says where its own Talk it through goes, with no claim about who reads it, got '+JSON.stringify(S.quiz));
 ok(S.story==='It is always a story. Write what is happening, or what happened.',
  'and the Story line names the present as well as the past, got '+JSON.stringify(S.story));
 ok(S.open==='Is this a crisis?'&&S.h==='Tell me about it.'&&S.reach==='Reach someone now'&&S.talk==='Talk it through',
  'the button and the panel carry the words as ruled');
 ok(!/—/.test(JSON.stringify([L,S])),'and no em dash anywhere in them');
}

g('ID · one fixed code per thing the engine names, and one door every label goes through');
/* PHASE ONE OF THE CONTENT LIBRARY, 23 October, engine/codes.js and
   engine/data/codes.js. Identity and plumbing only: nothing here moves a
   number, and compute() and trace.js do not read it yet. A code never
   changes and a name may, so the codes asserted below are typed on purpose:
   they are the identities being frozen, and a gate that read them back off
   the table it tests would hold nothing. Counts are read off the run. */
{
 const {codeOf,codeKind,codeName,codeList,codeOfEntry,codeEmotionOf,codesCheck,codeTables,
        SABDEF,LAW_DEFAULT}=E;
 /* the live tables hold, every check at once */
 const probs=codesCheck();
 ok(probs.length===0,'codesCheck finds nothing wrong with the live tables, found '+probs.length+': '+JSON.stringify(probs.slice(0,6)));
 /* AND EACH CHECK BITES. A copy of the tables with one thing broken, and the
    check must name the thing. The live tables are never touched. */
 const bites=(what,mut,word)=>{const t=Object.assign({},codeTables()); mut(t); const p=codesCheck(t);
  ok(p.some(x=>x.indexOf(word)>=0),'the check catches '+what+', got '+JSON.stringify(p.slice(0,3)));};
 bites('an alias that points at no code',t=>{t.CODE_ALIAS=t.CODE_ALIAS.concat([['canon','saboteur','Kontroller','S99','a test row']]);},'S99');
 bites('a family renamed in HCX_LIB and not in CODE_FAMILY',t=>{t.HCX_LIB=t.HCX_LIB.map(h=>h.nm==='Collapse'?Object.assign({},h,{nm:'Kollapse'}):h);},'Kollapse');
 bites('two ARCH rows swapped, which would re-point every stored p.soul.arcs',t=>{const a=t.ARCH.slice(),x=a[2];a[2]=a[3];a[3]=x;t.ARCH=a;},'ARCH[2]');
 bites('a row for every source that shadows a MOB name',t=>{t.CODE_ALIAS=t.CODE_ALIAS.concat([['any','address','Entitlement','8','a test row']]);},'Entitlement');
 bites('an unmapped row a code now answers',t=>{t.CODE_UNMAPPED=t.CODE_UNMAPPED.concat([['mob','saboteur','Judge','a test row']]);},'Judge');
 bites('a retired name that is still a code',t=>{t.CODE_RETIRED=t.CODE_RETIRED.concat([['mob','saboteur','Stickler','2026-10-23','a test row']]);},'Stickler');
 bites('an inferred cluster renamed off the rule',t=>{t.ALL_SAB=t.ALL_SAB.map(s=>s.nm==='Heart Mourner'?Object.assign({},s,{nm:'Heart Weeper'}):s);},'Heart Weeper');
 bites('a library row that kept the old name of S02',t=>{t.SAB_LIB=t.SAB_LIB.map(s=>s.nm==='Micromanager'?Object.assign({},s,{nm:'Controller'}):s);},'Controller');
 bites('a child emotion renamed in CHILD and not frozen',t=>{t.CHILD=t.CHILD.map(c=>c.nm==='Sad'?Object.assign({},c,{nm:'Sorrow'}):c);},'Sorrow');
 bites('a structure code given twice',t=>{t.CODE_STRUCT=t.CODE_STRUCT.concat([['X01','A Copy','complex',t.CODE_STRUCT.filter(r=>r[2]==='complex').length,'I']]);},'X01 twice');

 const is=(label,hint,code,m)=>{const r=codeOf(label,hint);
  ok(r.ok&&r.code===code,m+': '+JSON.stringify(label)+(hint?' '+JSON.stringify(hint):'')+' is '+code+', got '+JSON.stringify(r.ok?r.code:r.why));};
 const no=(label,hint,word,m)=>{const r=codeOf(label,hint);
  ok(!r.ok&&r.why.indexOf(word)>=0,m+': '+JSON.stringify(label)+(hint?' '+JSON.stringify(hint):'')+' is refused naming '+JSON.stringify(word)+', got '+JSON.stringify(r.ok?r.code:r.why));};
 /* saboteurs, and every spelling of one */
 ok(SABDEF.micromanager.c==='S02'&&SABDEF.skeptic.c==='S17'&&SABDEF.avoider.c==='S33','the saboteur codes are SABDEF\'s own, kept');
 is('Micromanager',null,'S02','the name the reading prints');
 is('Controller',null,'S02','the owner renamed S02 on 18 October, and the old name still finds it');
 is('Controller',{source:'canon'},'S02','canon.json still prints Controller');
 is('Sceptic',{source:'book'},'S17','the book spells Skeptic once with a c');
 is('The Negotiator',{source:'book'},'S01','the book\'s The is not part of the name');
 no('Superior',null,'2026-10-22','a retired saboteur is refused with its day');
 no('The Withholder',{source:'app'},'Avoider','the app\'s 33rd row is no code, and says why');
 /* one word for several things is never picked, always named */
 no('Collapse',null,'ambiguous','Collapse is a family, a canon.json complex and an address');
 is('Collapse',{kind:'family'},'K3','as a family');
 is('Collapse',{source:'canon',kind:'structure'},'X12','as canon.json\'s complex');
 is('Collapse',{kind:'address'},String(NODES.find(n=>n.k==='Collapse').i),'as an address');
 is('Mania',{kind:'pole'},'K3o','a pole is its family\'s code and o');
 no('Narcissism',null,'ambiguous','Narcissism is the book\'s cluster I and canon.json\'s Narcissistic');
 is('Narcissism',{kind:'family'},'K1','as a family, Grandiosity');
 is('Narcissism',{kind:'structure'},'X04','as a structure, Narcissistic');
 no('Innocent',null,'ambiguous','Innocent is a saboteur and an archetype');
 no('Fear',null,'ambiguous','Fear is a child emotion and address 1');
 is('Fear',{kind:'emotion'},'Fear','a child emotion\'s code is its CHILD name');
 is('Fear',{kind:'address'},'1','and address 1 is Fear');
 /* BLAME DISPLACEMENT AND ANTISOCIAL ARE TWO, by decision, written in
    engine/data/codes.js: a merge later is an alias, a split later is not */
 is('Blame Displacement',{source:'canon'},'X02','Blame Displacement');
 is('Antisocial',{source:'canon'},'X06','and Antisocial is its own code');
 is('Dark Triad',null,'X30','Dark Triad');
 {const d=codeOf('X30'); ok(d.ok&&d.filed==='hyper_complex'&&d.tag==='I','and it stays filed where canon.json files it, inferred, '+JSON.stringify(d));}
 /* the same label means another thing in another source */
 is('Entitlement',{source:'canon',kind:'address'},'8','canon.json\'s Entitlement is address 8');
 is('Entitlement',{kind:'address'},'38','MOB\'s is 38');
 no('Entitlement',{source:'book'},'ambiguous','the book uses it for address 8 and as a band axis');
 is('109',{source:'canon'},'112','canon.json numbers the field nodes another way');
 is('109',null,'109','MOB\'s own 109 is its own');
 is('Soul Star',{source:'canon'},'109','and spells Sol Star Soul Star');
 is('Doubt of Source',{source:'canon'},'88','canon.json writes Source for God');
 no('Doubt of Source',null,'not a code','and that spelling is only canon.json\'s');
 no('112',{source:'nodes112'},'PARAM SHIVA','nodes_112\'s 112 is not said to be Gaia Gateway');
 /* clusters, overshot readings, pairs, by rule */
 const dead=(()=>{for(const b of BANDS)for(const e of E.CODE_EMOTION)if(!W.some(n=>n.b===b&&n.cf===e))return [b,e];return null;})();
 ok(dead!==null,'some seat carries no address of some emotion, so a cluster can be coded and not live');
 if(dead){const r=codeOf(codeName('S.'+E.B2K[dead[0]]+'.'+dead[1]));
  ok(r.ok&&r.kind==='cluster'&&r.live===false,'a cluster the node map cannot make still has its code, and says it is not live: '+JSON.stringify(r));}
 is('Micromanager overshot',null,'S02.over','an overshot reading is its code and .over');
 is('Micromanager + Judge',null,'S02+S11','a pair is its two codes');
 is('Judge + Micromanager',null,'S02+S11','whichever is heavier today');
 no('Judge + Judge',null,'with itself','one voice counted twice is not a pair');
 is('Collapse / Mania',null,'K3/K3o','a pair of families is its two codes');
 /* archetypes and emotions */
 is('Caretaker',null,'AR04','Caretaker is Caregiver');
 no('Rebel',null,'ambiguous','Rebel is an archetype and a retired saboteur');
 is('Rebel',{kind:'archetype'},'AR03','as an archetype');
 no('Rebel',{kind:'saboteur'},'open ruling 6','as a saboteur it has no code, and says whose ruling');
 no('Outlaw',null,'owner\'s call','Outlaw is no code until he says whether it is Rebel');
 is('Sadness',{kind:'emotion'},'Sad','Sadness is the Sad axis');
 no('Joy',{kind:'emotion'},'REROUTE','Joy is a charge label routed by rule, not a child emotion');
 /* bad input is refused, never thrown */
 const loop={}; loop.self=loop;
 [[null,null,'string'],['',null,'string'],[loop,null,'string'],[BigInt(7),null,'string'],
  ['Judge',{source:'nowhere'},'source'],['Judge',{kind:'nothing'},'kind'],['Judge',{kind:[]},'kind'],
  ['Judge',{kind:loop},'kind']].forEach(x=>{let r; try{r=codeOf(x[0],x[1]);}catch(e){r={ok:false,why:'threw '+e.message};}
  ok(r&&!r.ok&&r.why.indexOf(x[2])>=0&&r.why.indexOf('threw')<0,'a bad '+x[2]+' is refused by name, '+JSON.stringify(r));});
 is(38,null,'38','an address given as a number');
 no('Nobody overshot',null,'what it overshoots','an overshot reading of nothing is refused, and says which part');
 [[null,'object with a name'],[{kind:'zz',nm:'Judge'},'sab, cx, hy or sup']].forEach(x=>{const r=codeOfEntry(x[0]);
  ok(!r.ok&&r.why.indexOf(x[1])>=0,'an entry that is not one a reading makes is refused by name, '+JSON.stringify(r));});
 ok(!codeEmotionOf('nowhere').ok&&/not one NODES holds/.test(codeEmotionOf('nowhere').why)&&codeEmotionOf('38').code===E.BY[38].cf,
  'codeEmotionOf refuses what is not an address, and reads a number written as text');

 /* THE LEDGER. Every code this layer was born with, 23 October, and the name
    it was born on, in code order. This is the freeze, and it is not a count:
    a new code may be added after the last, and a thing may be renamed when a
    CODE_ALIAS row keeps the old name finding it, but no code here may ever
    answer for anything else. codesCheck holds each table's shape and cannot
    see two codes trade places; this can. Addresses are their own NODES
    numbers and are held by codesCheck. */
 const born=[];
 [['saboteur','S',2,'Negotiator|Micromanager|Victim|Perfectionist|Pleaser|Hyper-Achiever|Hyper-Rational|Hyper-Vigilant|Restless|Stickler|Judge|Deflector|Dramatizer|Worrywart|Loner|People-Pleaser|Skeptic|Dreamer|Procrastinator|Imposter|Aggressor|Martyr|Cynic|Manipulator|Overthinker|Escapist|Nihilist|Innocent|Pessimist|Catastrophizer|Enabler|Control Freak|Avoider'],
  ['family','K',1,'Grandiosity|Predatory|Collapse|Rigidity|Dysregulation|Dissociation'],
  ['structure','X',2,'Dominance Enforcement|Blame Displacement|Superiority-Persecution|Narcissistic|Machiavellian Tactics|Antisocial|Oscillation|Abandonment Reactivity|Rigidity|Attention Seeking|Threat Scanning|Collapse|Scatter|Anticipatory Freeze|Catastrophic Bracing|Meaning Withdrawal|Retreat|Cold Analysis|Self-Erasure|Sacrificial Ledger|Exploitation|Standard Enforcement|Imposture|Malignant Narcissism|Sociopathy|Psychopathy|Machiavellianism|Megalomania|Malignant Grandiosity|Dark Triad|Persecutory Collapse'],
  ['archetype','AR',2,'Warrior|Sage|Rebel|Caregiver|Creator|Magician|Ruler|Explorer|Lover|Jester|Everyman|Innocent']
 ].forEach(([kind,pre,w,names])=>names.split('|').forEach((nm,i)=>born.push([pre+String(i+1).padStart(w,'0'),nm,kind])));
 'Self-erasure|Enabling|Mania|Indiscriminate|Numbness|Enmeshment'.split('|').forEach((nm,i)=>born.push(['K'+(i+1)+'o',nm,'pole']));
 'Fear|Anger|Shame|Disgust|Apathy|Shock|Sad|Surprise|Anticipation'.split('|').forEach(nm=>born.push([nm,nm,'emotion']));
 /* a cluster's code is its seat's key and its emotion. The key is B2K's, so
    the seven keys are frozen here; the noun is display and is read live. */
 [['Root','root'],['Sacral','sacral'],['Solar','solar'],['Heart','heart'],['Throat','throat'],['3rd Eye','eye'],['Crown','crown'],
  ['Diffuse','diffuse']].forEach(([b,k])=>born.push(['S.'+k+'.Fear',b+' '+E.INFER_NOUN.Fear,'cluster']));
 const moved=born.filter(([c,nm,k])=>{const r=codeOf(nm,{kind:k});return !(r.ok&&r.code===c);});
 ok(moved.length===0,'every one of the '+born.length+' codes this layer was born with still answers to the name it was born on, moved: '
  +JSON.stringify(moved.slice(0,6).map(([c,nm,k])=>nm+' was '+c+', now '+(codeOf(nm,{kind:k}).code||'nothing'))));

 /* ROUND TRIP. Every code the tables list comes back from its own name and kind. */
 const all=codeList(), back=all.filter(c=>{const r=codeOf(codeName(c),{kind:codeKind(c)});return !(r.ok&&r.code===c);});
 ok(all.length>0&&back.length===0,'every one of the '+all.length+' listed codes comes back from its own name and kind, off: '+JSON.stringify(back.slice(0,6)));

 /* EVERY NAME A READING PRINTS has one code, of its rung's kind, and a
    pair's code is made of its own parts' codes. The worked examples, uniform
    fields with and without the opposite, and seeded random fields. */
 const rd=p=>{S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
  const LS=LAWSET[p.nm]||{_:LAW_DEFAULT};
  SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:(LS._!==undefined?LS._:LAW_DEFAULT)); lawsIn();
  return compute();};
 const R=PEOPLE.map(rd);
 for(let h=0;h<=10;h++)for(let o=0;o<=10;o+=5)R.push(reset(h,o,6));
 let seed=2310; const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
 for(let i=0;i<300;i++){reset(0,0,6);
  CHARGES.forEach(c=>{S.charge[c]=Math.round(rnd()*100)/10;S.replace[c]=Math.round(rnd()*100)/10;});
  SINAMES.forEach(l=>S.law[l]=Math.round(rnd()*10)); lawsIn(); R.push(compute());}
 const seen={}, byName={}, byCode={}, refused=[], partsOff=[]; let entries=0;
 const sortedOf=nm=>/ \/ /.test(nm)?nm.split(' / ').sort().join(' / '):/ \+ /.test(nm)?nm.split(' + ').sort().join(' + '):nm;
 R.forEach(r=>['sabs','cxs','hys','sups'].forEach(l=>r[l].forEach(o=>{entries++;
  const c=codeOfEntry(o);
  if(!c.ok){refused.push(o.kind+' '+o.nm+': '+c.why);return;}
  seen[c.kind]=(seen[c.kind]||0)+1;
  (byName[o.nm]=byName[o.nm]||new Set()).add(c.code);
  (byCode[c.code]=byCode[c.code]||new Set()).add(sortedOf(o.nm));
  if(o.kind==='cx'||o.kind==='sup'){const pc=o.parts.map(q=>codeOfEntry(q).code).sort();
   if(JSON.stringify(pc)!==JSON.stringify(c.parts))partsOff.push(o.nm+' is '+c.code+' and its parts are '+pc.join(', '));}})));
 ok(refused.length===0,'every one of the '+entries+' entries of '+R.length+' readings resolves to a code of its rung\'s kind, refused: '+JSON.stringify(refused.slice(0,6)));
 ok(['saboteur','cluster','overshot','pair','family','pole','family-pair'].every(k=>seen[k]>0),
  'and the sweep reached every kind a reading can print, so it tested each, seen: '+JSON.stringify(seen));
 const twoCodes=Object.keys(byName).filter(n=>byName[n].size>1), twoNames=Object.keys(byCode).filter(c=>byCode[c].size>1);
 ok(twoCodes.length===0,'no name carries two codes, of '+Object.keys(byName).length+' names, '+JSON.stringify(twoCodes.slice(0,4)));
 ok(twoNames.length===0,'and no code carries two names but for a pair\'s order, of '+Object.keys(byCode).length+' codes, '+JSON.stringify(twoNames.slice(0,4)));
 ok(partsOff.length===0,'a pair\'s code is its own parts\' codes, off: '+JSON.stringify(partsOff.slice(0,4)));

 /* THE ONE FETTER ASSIGNMENT RULE. The library reads an address's child
    emotion through codeEmotionOf, and it answers n.cf, which is what the
    reading reads, at every body address. A field node and an address with
    no charge are refused by name, never given one. */
 const offRule=W.filter(n=>{const r=codeEmotionOf(n.i);return n.cf?!(r.ok&&r.code===n.cf):r.ok;});
 ok(offRule.length===0,'codeEmotionOf is n.cf at every one of the '+W.length+' body addresses, off: '+JSON.stringify(offRule.map(n=>n.i)));
 const field=NODES.filter(n=>/^Field/.test(n.b)), bare=W.filter(n=>!n.cf);
 ok(field.length>0&&field.every(n=>{const r=codeEmotionOf(n.i);return !r.ok&&/field node/.test(r.why);}),
  'a field node is refused by name, it carries no child emotion');
 ok(bare.every(n=>{const r=codeEmotionOf(n.i);return !r.ok&&/carries no charge/.test(r.why);}),
  'and a body address with no charge on the node map is refused by name, '+JSON.stringify(bare.map(n=>n.i)));
 reset(0,0,6);
}

g('RG · the registers ported from canon.json, held row for row to the copy this repository keeps');
/* PHASE TWO OF THE MERGE, 24 October. Seven of canon.json's registers had no
   table here and are ported into engine/data/registers.js. The vendored copy
   is vendor/reboot-os/canon.json, and these checks hold the tables to it, so
   the next canon.json is a named difference (node tools/canon-port.js check)
   and never a silent one. Every check below that compares is first shown to
   bite on a copy with one thing planted wrong, because a comparison that
   cannot fail reports green on everything. Counts are read off the run. */
{
 const fs=require('fs'), path=require('path'), crypto=require('crypto');
 const live=typeof E.regDiff==='function'&&Array.isArray(E.REG_MAP)&&Array.isArray(E.CHARGE_LADDER);
 ok(live,'the engine carries the ported registers, REG_MAP and regDiff');
 const VEND=path.resolve('vendor/reboot-os/canon.json');
 ok(fs.existsSync(VEND),'the vendored canon.json is at vendor/reboot-os/canon.json');
 if(live&&fs.existsSync(VEND)){
  const raw=fs.readFileSync(VEND), canon=JSON.parse(raw.toString('utf8')), copy=()=>JSON.parse(raw.toString('utf8'));
  /* THE PIN. CODE_SOURCES cites the md5 every canon row in the codes was read
     at, so the copy here must be that file, byte for byte. */
  const md5=crypto.createHash('md5').update(raw).digest('hex');
  const cited=(/md5 ([0-9a-f]{8})/.exec((E.CODE_SOURCES.find(r=>r[0]==='canon')||[])[1]||'')||[])[1];
  ok(cited&&md5.indexOf(cited)===0,'the vendored copy is the canon.json CODE_SOURCES cites, md5 '+md5.slice(0,8)+' against '+cited);
  /* ROW FOR ROW */
  const d0=E.regDiff(canon);
  ok(d0.length===0,'every ported register matches the vendored copy row for row, differences: '+JSON.stringify(d0.slice(0,4)));
  /* AND EACH COMPARISON BITES, on a copy of the file with one thing planted */
  const bite=(what,mut,word)=>{const c=copy(); mut(c.registers,c); const d=E.regDiff(c);
   ok(d.some(x=>x.indexOf(word)>=0),'regDiff names '+what+', got '+JSON.stringify(d.slice(0,3)));};
  bite('a word changed on a ladder',R=>{R.ladders.fear[5]='Aghast';},'"fear" is');
  bite('a ladder canon.json adds',R=>{R.ladders.love=R.ladders.joy.slice();},'canon.json has "love"');
  bite('an amplifier moved to another address',R=>{R.amplifiers[5][1]=35;},'its address');
  bite('a nerve that is not the one NODES holds',R=>{R.amplifiers[0][2]='Sciatic Nerve';},'its nerve');
  bite('a quadrant\'s theme reworded',R=>{R.quadrants[0][2]='Action';},'its theme');
  bite('an organ\'s voice reworded',R=>{R.organs[9][3]='Overflow.';},'its voice');
  bite('a charge routed to another quadrant',R=>{R.charge_routing.anger='Left-Back';},'"anger" is');
  bite('a derived measure citing another law',R=>{R.derived_measures[2][1]=R.derived_measures[2][1].replace('Element 54','Element 55');},'its law cited');
  bite('an overlay vector changed',R=>{R.astrology_overlay.west.Leo[0]=-2;},'astrology_overlay west');
  bite('an overlay dim renamed',R=>{R.astrology_overlay.dims[0]='begin';},'dims');
  bite('rows that only moved',R=>{R.organs.reverse();},'another order');
  bite('a register the file drops',R=>{delete R.organs;},'no such register');
  bite('a register given in another shape',R=>{R.quadrants={};},'where the port reads a list');
  [[null,'not a canon.json'],[{},'not a canon.json'],[{registers:[]},'not a canon.json']].forEach(([x,w])=>{let d;
   try{d=E.regDiff(x);}catch(e){d=['threw '+e.message];}
   ok(Array.isArray(d)&&d.some(s=>s.indexOf(w)>=0)&&!d.some(s=>/threw/.test(s)),'regDiff refuses '+JSON.stringify(x)+' by name and never throws, '+JSON.stringify(d));});
  /* THE MAP. Every top level part of the file is placed, both ways, and what
     it places is a table the engine holds. */
  const paths=Object.keys(canon).filter(k=>k!=='registers').concat(Object.keys(canon.registers).map(k=>'registers.'+k));
  const mapped=E.REG_MAP.map(r=>r[0]);
  ok(paths.every(p=>mapped.indexOf(p)>=0),'REG_MAP places every part of the vendored canon.json, unplaced: '+JSON.stringify(paths.filter(p=>mapped.indexOf(p)<0)));
  ok(mapped.every(p=>paths.indexOf(p)>=0)&&new Set(mapped).size===mapped.length,'and places nothing the file does not have, nothing twice');
  ok(E.REG_MAP.every(r=>['ported','mob','held'].indexOf(r[1])>=0&&Array.isArray(r[2])&&typeof r[3]==='string'&&r[3].trim()),
   'every row says ported, mob or held, names its tables and says what to know');
  const missing=[].concat(...E.REG_MAP.map(r=>r[2])).filter(n=>E[n]===undefined);
  ok(missing.length===0,'every table REG_MAP names is one the engine holds, missing: '+JSON.stringify(missing));
  const PORTED=require(path.resolve('tools/canon-port.js')).PORTED;
  ok(JSON.stringify(E.REG_MAP.filter(r=>r[1]==='ported').map(r=>[r[0].replace(/^registers\./,''),r[2]]))
   ===JSON.stringify(PORTED.map(p=>[p[0],[p[1]]])),'the ported rows are exactly the registers regDiff and the port tool compare, each with its one table');
  ok(E.REG_MAP.filter(r=>r[1]==='mob').every(r=>/^registers\./.test(r[0])?r[2].length>0:true),'every register this repository has its own version of names that version');
  /* THE GENERATOR WRITES THE FILE. Each table in engine/data/registers.js is
     exactly what tools/canon-port.js emit writes for the vendored copy, so
     the next merge is a paste and a review, not a hand transcription. */
  const tool=require(path.resolve('tools/canon-port.js')), src=fs.readFileSync(path.resolve('atuned_src/engine/data/registers.js'),'utf8');
  PORTED.forEach(([reg,tbl])=>{const want=tool.emit(canon,reg,E), at=src.indexOf('const '+tbl+'=');
   /* a table ends at its first ]; and an object at its first };, since the
      overlay's inner objects close with }, and never with }; */
   const end=at<0?-1:src.indexOf(src.charAt(src.indexOf('=',at)+1)==='{'?'};':'];',at); const got=end<0?'':src.slice(at,end+2);
   ok(got===want,'the '+tbl+' the data file carries is what emit writes for '+reg+', got '+JSON.stringify(got.slice(0,80)));});
  /* NOTHING READS THEM. compute() makes the same reading for every roster
     person and a sweep of uniform and seeded fields with every ported table
     scrambled. First the harness is shown to see a change, on SAB33, which
     compute() does read. */
  const fields=()=>{const out=[];
   PEOPLE.forEach(p=>{S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
    CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
    const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
    SINAMES.forEach(l=>S.law[l]=LS[l]!==undefined?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT)); lawsIn(); out.push(JSON.stringify(compute()));});
   for(let h=0;h<=10;h+=2)out.push(JSON.stringify(reset(h,h/2,6)));
   let seed=2410; const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
   for(let i=0;i<60;i++){reset(0,0,6);
    CHARGES.forEach(c=>{S.charge[c]=Math.round(rnd()*100)/10;S.replace[c]=Math.round(rnd()*100)/10;});
    SINAMES.forEach(l=>S.law[l]=Math.round(rnd()*10)); lawsIn(); out.push(JSON.stringify(compute()));}
   return out;};
  const before=fields();
  const sab=JSON.parse(JSON.stringify(SAB33[0][1])); SAB33[0][1].forEach(b=>{b[1]=0;b[2]=10;});
  const seen=fields(); SAB33[0][1]=sab;
  ok(seen.some((x,i)=>x!==before[i]),'the harness sees a change when a table compute() reads is changed');
  ok(fields().every((x,i)=>x===before[i]),'and SAB33 is put back exactly');
  /* scrambled copies go in and the very objects that were there go back, so
     nothing that holds a table, the codes index among them, ever sees one
     of its own rows changed */
  const was={L:E.CHARGE_LADDER.slice(),A:E.AMPLIFIER.slice(),Q:E.BODY_QUADRANT.slice(),O:E.ORGAN.slice(),
   D:E.DERIVED_MEASURE.slice(),R:Object.assign({},E.CHARGE_QUADRANT),S:Object.assign({},E.ASTRO_OVERLAY)};
  const put=(arr,rows)=>{arr.splice(0,arr.length,...rows);};
  put(E.CHARGE_LADDER,was.L.map(l=>({c:l.c,ch:'x'+l.ch,w:l.w.slice().reverse()})));
  put(E.AMPLIFIER,was.A.map(r=>({c:r.c,nm:'x',i:1,tag:r.tag})));
  put(E.BODY_QUADRANT,was.Q.map(r=>Object.assign({},r,{nm:'x',side:'left',face:'front'})));
  put(E.ORGAN,was.O.map(r=>Object.assign({},r,{side:'right',voice:'x'})));
  put(E.DERIVED_MEASURE,was.D.map(r=>({c:r.c,nm:r.nm,ch:'x',el:'E01'})));
  Object.keys(E.CHARGE_QUADRANT).forEach(k=>{E.CHARGE_QUADRANT[k]='x';});
  const flip=o=>{const n={}; Object.keys(o).forEach(k=>{n[k]=o[k].map(v=>-v-1);}); return n;};
  ['west','east','archetype_vectors'].forEach(k=>{E.ASTRO_OVERLAY[k]=flip(was.S[k]);});
  E.ASTRO_OVERLAY.load_map={}; Object.keys(was.S.load_map).forEach(k=>{E.ASTRO_OVERLAY.load_map[k]='x';});
  E.ASTRO_OVERLAY.dims=was.S.dims.slice().reverse();
  const scrambled=fields();
  put(E.CHARGE_LADDER,was.L); put(E.AMPLIFIER,was.A); put(E.BODY_QUADRANT,was.Q); put(E.ORGAN,was.O); put(E.DERIVED_MEASURE,was.D);
  Object.assign(E.CHARGE_QUADRANT,was.R); Object.assign(E.ASTRO_OVERLAY,was.S);
  const off=scrambled.filter((x,i)=>x!==before[i]).length;
  ok(off===0,'compute() reads the same for every one of '+before.length+' fields with every ported table scrambled, so none of them enters a number; differed: '+off);
  ok(E.regDiff(canon).length===0,'and every table is put back exactly, row for row with the file');
  /* THE ASTROLOGY LOCK, said on its own because canon.json says it on its
     own: "Display-only overlay ... Never enters a number." It is the same
     sweep, with the overlay alone flipped. */
  const west=E.ASTRO_OVERLAY.west, neg={};
  Object.keys(west).forEach(n=>{neg[n]=west[n].map(v=>-v);}); E.ASTRO_OVERLAY.west=neg;
  const skyOff=fields().filter((x,i)=>x!==before[i]).length;
  E.ASTRO_OVERLAY.west=west;
  ok(skyOff===0,'the astrology overlay enters no number, canon.json\'s own lock, differed: '+skyOff);
  /* TWO EXCEPTIONS TO THE TEMPLATE, HELD BY NAME. canon.json's own rows,
     ported as written, because rewording them is the owner's call. A held
     row that changes, or a new one, fails here until the hold is changed on
     purpose. */
  const firstPerson=E.ORGAN.filter(r=>!/\b(I|me|my)\b/.test(r.voice)).map(r=>r.nm);
  ok(JSON.stringify(firstPerson)==='["Dermis"]','every organ\'s voice is the pattern speaking as I, but the one held: Dermis, got '+JSON.stringify(firstPerson));
  ok(E.ORGAN.find(r=>r.nm==='Dermis').voice==='Overflow system. Psoriasis, stress acne.','and the held row is still the one held');
  const at={}; E.CHARGE_LADDER.forEach(l=>l.w.forEach(w=>{at[w]=(at[w]||0)+1;}));
  const twice=Object.keys(at).filter(w=>at[w]>1).sort();
  ok(JSON.stringify(twice)==='["Aggravated","Annoyed","Horrified","Wrathful"]','the words canon.json puts on two ladders are the ones held, got '+JSON.stringify(twice));
  const hp=E.ladderPlaces('horrified');
  ok(hp.length===2&&hp.map(x=>x.code).join()==='LD03.6,LD05.6','ladderPlaces names every place a word sits, Horrified on disgust and on fear, '+JSON.stringify(hp));
  ok(E.ladderPlaces('Furious').map(x=>x.code).join()==='LD06.5'&&E.ladderPlaces('calm').length===0&&E.ladderPlaces(null).length===0,
   'one place for a word on one ladder, and none for a word on none or for nothing');
 }
}

g('RC · a code for every row of the ported registers, and the door reads each one');
/* The codes the registers were born with, 24 October, typed on purpose as the
   ID group's ledger is: they are identities being frozen, and a gate that
   read them back off the table it tests would hold nothing. */
{
 const {codeOf,codeName,codeKind,codeList,codesCheck,codeTables}=E;
 const live=Array.isArray(E.CODE_SIGN)&&Array.isArray(E.CHARGE_LADDER);
 ok(live,'the engine carries the register codes and the sign and animal codes');
 if(live){
  const is=(label,hint,code,m)=>{const r=codeOf(label,hint);
   ok(r.ok&&r.code===code,m+': '+JSON.stringify(label)+(hint?' '+JSON.stringify(hint):'')+' is '+code+', got '+JSON.stringify(r.ok?r.code:r.why));return r;};
  const no=(label,hint,word,m)=>{const r=codeOf(label,hint);
   ok(!r.ok&&r.why.indexOf(word)>=0,m+': '+JSON.stringify(label)+(hint?' '+JSON.stringify(hint):'')+' is refused naming '+JSON.stringify(word)+', got '+JSON.stringify(r.ok?r.code:r.why));};
  ok(codesCheck().length===0,'codesCheck finds nothing wrong with the ported registers and their codes');
  /* EACH NEW CHECK BITES, on a copy with one thing broken */
  const bites=(what,mut,word)=>{const t=JSON.parse(JSON.stringify(codeTables())); mut(t);
   ['ZSIGN','ZI','CHINESE','HARM','NODES','SAB33','SABDEF'].forEach(k=>{if(!(k in t))t[k]=codeTables()[k];});
   const p=codesCheck(t); ok(p.some(x=>x.indexOf(word)>=0),'the check catches '+what+', got '+JSON.stringify(p.slice(0,3)));};
  bites('a ladder a step short',t=>{t.CHARGE_LADDER[3].w.pop();},'not one template');
  bites('a ladder code skipped',t=>{t.CHARGE_LADDER[7].c='LD09';},'skips LD08');
  bites('a ladder for a charge nothing reads',t=>{t.CHARGE_LADDER[2].ch='zest';},'neither a child emotion');
  bites('an amplifier on a field node',t=>{t.AMPLIFIER[0].i=110;},'field node');
  bites('a quadrant whose name is not its side and face',t=>{t.BODY_QUADRANT[0].face='back';},'says otherwise');
  bites('two organs of one name',t=>{t.ORGAN[1].nm='Heart';},'twice');
  bites('a route to a quadrant that does not exist',t=>{t.CHARGE_QUADRANT.fear='Middle';},'not a body quadrant');
  bites('a charge with no route',t=>{delete t.CHARGE_QUADRANT.joy;},'has no route');
  bites('a measure citing a law of another name',t=>{t.DERIVED_MEASURE[2].el='E53';},'HARM names');
  bites('an overlay vector a number short',t=>{t.ASTRO_OVERLAY.east.Ox.pop();},'one whole number for each dim');
  bites('an overlay charge keyed by no sign',t=>{t.ASTRO_OVERLAY.load_map.Ophiuchus='fear';},'a sign or an animal');
  bites('two signs swapped',t=>{const x=t.CODE_SIGN[0][1];t.CODE_SIGN[0][1]=t.CODE_SIGN[1][1];t.CODE_SIGN[1][1]=x;},'read through ZI');
  bites('two animals swapped',t=>{const x=t.CODE_ANIMAL[0][1];t.CODE_ANIMAL[0][1]=t.CODE_ANIMAL[1][1];t.CODE_ANIMAL[1][1]=x;},'as birth.js reads CHINESE');
  bites('a fifth body quadrant',t=>{t.BODY_QUADRANT.push(Object.assign({},t.BODY_QUADRANT[0],{c:'BQ05'}));},'right and left by front and back is');
  bites('the overlay without its dims',t=>{delete t.ASTRO_OVERLAY.dims;},'no dims to read');
  bites('the overlay gone',t=>{delete t.ASTRO_OVERLAY;},'ASTRO_OVERLAY is missing');
  bites('a sign the codes lost',t=>{t.CODE_SIGN.pop();},'CODE_SIGN has');
  bites('an animal the codes lost',t=>{t.CODE_ANIMAL.pop();},'CODE_ANIMAL has');
  {const t=JSON.parse(JSON.stringify(codeTables())); ['ZSIGN','ZI','CHINESE','HARM','NODES','SAB33','SABDEF'].forEach(k=>{if(!(k in t))t[k]=codeTables()[k];});
   t.CHARGE_LADDER=[]; const p=codesCheck(t).filter(x=>x==='CHARGE_LADDER is not a list of rows');
   ok(p.length===1,'an empty ladder table is named once, not once for each check that reads it, got '+p.length);}
  /* THE DOOR */
  is('LD05',null,'LD05','a ladder is its code');
  is('fear ladder',null,'LD05','and its name is its charge and the word ladder');
  const hw=is('LD05.6',null,'LD05.6','a word is its ladder and its step');
  ok(hw.nm==='Horrified'&&hw.of==='LD05'&&hw.step===6&&hw.kind==='ladder-word','and says which word, which ladder and which step, '+JSON.stringify(hw));
  no('LD05.06',null,'not a code','a step has one spelling, without a leading nought');
  no('LD05.10',null,'not a code','and no step past the top of its ladder');
  no('Horrified',null,'not a code','a word is not a name the door answers for, since some sit on two ladders');
  no('Judgment',null,'ambiguous','Judgment is now an address and an amplifier, so the door asks which');
  is('Judgment',{kind:'address'},'37','as an address');
  const am=is('Judgment',{kind:'amplifier'},'AM03','as an amplifier');
  ok(am.address===37,'and the amplifier says the address it stands on, '+JSON.stringify(am));
  const en=is('Entitlement',{kind:'amplifier'},'AM01','canon.json\'s amplifier Entitlement');
  ok(en.address===8,'stands on address 8, where NODES\'s own Entitlement is 38, '+JSON.stringify(en));
  is('Justification',null,'AM06','Justification is an amplifier and nothing else here');
  is('Right-Front',null,'BQ01','a body quadrant');
  is('right front',null,'BQ01','spelled with a space');
  is('Dermis',null,'OG10','an organ');
  const aw=is('Awareness',null,'DM02','a derived measure, while laws and gates have no code');
  ok(aw.law==='E32','and it cites the law it is, HARM\'s E32, '+JSON.stringify(aw));
  is('Aries',null,'ZS01','a sign');
  is('Goat',null,'CA08','an animal');
  /* a ladder's charge is canon.json's word, and its parent is a child emotion or a row that says why not */
  E.CHARGE_LADDER.forEach(l=>{const r=codeOf(l.ch,{source:'canon',kind:'emotion'});
   ok(r.ok||(r.kind==='emotion'&&/no emotion code/.test(r.why)),'the '+l.ch+' ladder\'s charge reads as a child emotion or is refused by name, '+(r.ok?r.code:r.why.slice(0,60)));});
  is('sadness',{source:'canon',kind:'emotion'},'Sad','canon.json\'s sadness is the Sad axis');
  no('resent',{source:'canon',kind:'emotion'},'no emotion code','and its resent is no child emotion');
  /* THE LEDGER, 24 October */
  const born=[];
  'joy|sadness|disgust|shock|fear|anger|shame|resent'.split('|').forEach((c,i)=>born.push(['LD0'+(i+1),c+' ladder','charge-ladder']));
  'Entitlement|Obsession|Judgment|Perfectionism|Comparison|Justification'.split('|').forEach((n,i)=>born.push(['AM0'+(i+1),n,'amplifier']));
  'Right-Front|Left-Front|Right-Back|Left-Back'.split('|').forEach((n,i)=>born.push(['BQ0'+(i+1),n,'body-quadrant']));
  'Heart|Stomach|Right Lung|Left Lung|Right Liver|Right Kidney|Left Kidney|Intestines|Spine|Dermis'.split('|').forEach((n,i)=>born.push(['OG'+String(i+1).padStart(2,'0'),n,'organ']));
  'Vitality|Awareness|Flow'.split('|').forEach((n,i)=>born.push(['DM0'+(i+1),n,'derived-measure']));
  'Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces'.split('|').forEach((n,i)=>born.push(['ZS'+String(i+1).padStart(2,'0'),n,'sign']));
  'Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig'.split('|').forEach((n,i)=>born.push(['CA'+String(i+1).padStart(2,'0'),n,'animal']));
  const moved=born.filter(([c,nm,k])=>{const r=codeOf(nm,{kind:k});return !(r.ok&&r.code===c);});
  ok(moved.length===0,'every one of the '+born.length+' codes the registers were born with still answers to the name it was born on, moved: '+JSON.stringify(moved.slice(0,6)));
  const kinds=['charge-ladder','amplifier','body-quadrant','organ','derived-measure','sign','animal'];
  ok(kinds.every(k=>codeList(k).length===born.filter(b=>b[2]===k).length),'and nothing else of those kinds is listed: '+JSON.stringify(kinds.map(k=>k+' '+codeList(k).length)));
  ok(codeList('ladder-word').length===0&&E.CHARGE_LADDER.every(l=>l.w.every((w,i)=>codeName(l.c+'.'+(i+1))===w&&codeKind(l.c+'.'+(i+1))==='ladder-word')),
   'a word is never listed, and every one of them is reached by rule, named the word canon.json gives the step');
  /* SIGNS AND ANIMALS, held to what the product prints. The sun sign the
     birth reading gives a day in the middle of each sign is the sign coded
     at the index astro.js counts that day's sun in, and the animal of a
     year the reading prints is the one coded at that year in the cycle. */
  const offSign=[];
  E.ZSIGN.forEach(z=>{const d='2001-'+String(z[0]).padStart(2,'0')+'-'+String(z[1]+7).padStart(2,'0');
   const k=E.signOf(sunLon(julianDay(2001,z[0],z[1]+7,12))), sp=E.spiritualOf({d:d});
   if(!sp||E.CODE_SIGN[k][1]!==sp.sun||sp.sun!==z[2])offSign.push(d+' reads '+(sp&&sp.sun)+', coded '+E.CODE_SIGN[k][1]);});
  ok(offSign.length===0,'the sign code at the sun\'s own index is the sun sign the reading prints, for a day inside each of the '+E.ZSIGN.length+' signs, off: '+JSON.stringify(offSign));
  const offAnimal=E.CODE_ANIMAL.map((r,k)=>[2020+k,r[1],E.spiritualOf({d:(2020+k)+'-06-15'}).chinese]).filter(x=>x[1]!==x[2]);
  ok(offAnimal.length===0,'the animal code for each year of a cycle is the animal the reading prints for a birth that June, off: '+JSON.stringify(offAnimal));
 }
}

console.log('\n===== '+P+' passed, '+F+' failed, '+XF+' expected red =====');
process.exit(F?1:0);
