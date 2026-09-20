#!/usr/bin/env node
/* ============================================================
   ritualsim.js

   THE RITUAL LOOP, SIMULATED 1000 TIMES OVER 90 DAYS.

   Brief: TASKS.md AP2. Sample 1,000 people from the ICP distribution at the
   weights in RESEARCH-icp.md, run each through the ritual loop for 90 days,
   and report retention, exit reasons and the coin arithmetic.

   THREE RULES THIS TOOL IS BUILT UNDER.

   1. It measures the product before it models anything. Section A loads every
      panel persona into the real engine, runs compute(), and ports ritFor()
      from ui/ritual.js line for line. The track, the tier, the practice
      called for, the minutes demanded and the number of choices on the card
      are read off the build, not invented.

   2. Every probability carries a source in the SRC table below. Where a
      magnitude is mine rather than sourced it says MINE and it is swept.

   3. It validates before it reports. Three checks: the weights reproduce the
      stated panel counts exactly, a constant hazard reproduces its own
      closed form, and the CURRENT configuration reproduces the per persona
      curve already published in reviews/simulation-quarter.md section 6.3.
      A tool that lies is worse than no tool.

   Run:
     node tools/ritualsim.js              the whole report
     node tools/ritualsim.js --validate   the three checks only
     node tools/ritualsim.js --sweep      the sensitivity table only
   ============================================================ */

const path=require('path');
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
const {S,CHARGES,SINAMES,PEOPLE,LAWSET,buildSoul,compute,W,PRACTICE}=E;

/* ------------------------------------------------------------
   SOURCES. Every number the model uses, with where it came from.
   d values are converted to odds ratios by the Hasselblad and Hedges
   logistic approximation, log OR = d * pi / sqrt(3), which is the standard
   conversion and is itself an approximation.
   ------------------------------------------------------------ */
const d2or=d=>Math.exp(d*Math.PI/Math.sqrt(3));
const SRC={
 base_pdo:{v:0.30, s:'Patel 2016 Annals of Internal Medicine, control arm: 0.30 of participant days hit the goal. https://www.acpjournals.org/doi/10.7326/m15-1635'},
 loss_pdo:{v:0.45, s:'same trial, loss framed arm 0.45. Quoted as the ceiling a manipulation pattern would buy and deliberately not used.'},
 ifthen:{v:d2or(0.65), s:'Gollwitzer and Sheeran 2006, 94 studies, 8,000+ participants, mean d 0.65. https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf'},
 monitor:{v:d2or(0.40), s:'Harkin 2016 Psychological Bulletin, 138 studies, 19,951 participants, d 0.40, larger when physically recorded. https://pubmed.ncbi.nlm.nih.gov/26479070/'},
 endowed:{v:(0.34/0.66)/(0.19/0.81), s:'Nunes and Dreze 2006 endowed progress, 34 percent against 19 percent completion. https://www.columbia.edu/~rk566/Session4/Goal-Gradient_Illusionary_Goal_Progress.pdf'},
 write:{v:d2or(0.15), s:'Frattaroli 2006 Psychological Bulletin, 146 studies, r .075 which is about d 0.15. Small and real.'},
 overjust:{v:d2or(-0.40), s:'Deci Koestner Ryan 1999, 128 studies, engagement contingent reward undermines free choice intrinsic motivation at d -0.40.'},
 wm:{v:4, s:'CLAUDE.md, 57 to 71 simultaneous choices per screen against a working memory of about four.'},
 gradient:{v:1.35, s:'MINE. Direction from Kivetz Urminsky Zheng 2006 goal gradient. The 1.35 at the end of a seven day season is mine and is swept.'},
 shock:{v:0.25, s:'MINE. The extra one day churn probability when a run breaks. Direction from RESEARCH-ladder.md section 2 streak anxiety and the abstinence violation effect, and from Duolingo shipping freezes and Finch shipping two repairs plus a pause. Magnitude is mine and is swept 0.10 to 0.40.'},
 push:{v:1.30, s:'MINE. reviews/SPEC-ritual-accountability.md claims plus 6 from a 22:00 mark the day push and marks it unverified in repo. Swept 1.00 to 1.60.'},
 load:{v:0.02, s:'MINE. Extra first two day churn per choice above working memory. Swept.'}};

/* ------------------------------------------------------------
   THE PANEL. Weights from RESEARCH-icp.md, which sums to exactly 1,000.
   ------------------------------------------------------------ */
const PANEL=[
 {nm:'Diane', w:180, D:[1.00,0.08,0.02,0.00]},
 {nm:'Derek', w:170, D:[0.62,0.06,0.01,0.00]},
 {nm:'Marcus',w:160, D:[0.45,0.18,0.09,0.05]},
 {nm:'Angela',w:150, D:[0.34,0.05,0.01,0.00]},
 {nm:'Sofia', w:140, D:[0.78,0.41,0.22,0.14]},
 {nm:'James', w:100, D:[0.22,0.04,0.01,0.00]},
 {nm:'Ana',   w:50,  D:[0.70,0.26,0.11,0.06]},
 {nm:'Gordon',w:35,  D:[0.06,0.00,0.00,0.00]},
 {nm:'Rosa',  w:15,  D:[0.12,0.02,0.00,0.00]}];
/* D is the published CURRENT curve at days 1, 7, 30 and 90 from
   reviews/simulation-quarter.md section 6.3. It is the calibration target,
   so the CURRENT run is a restatement and not an independent prediction.
   Every finding in this tool is the DELTA from it. */
const ANCHOR=[1,7,30,90];

/* ------------------------------------------------------------
   A. WHAT THE BUILD ACTUALLY DEALS. Measured, not modelled.
   ------------------------------------------------------------ */
/* ported from ui/personas.js loadP, minus everything that touches a document */
function loadPerson(p){
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2;
 S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(c=>{
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{
  S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return compute();}

/* ported from ui/ritual.js ritFor, unchanged in behaviour */
const TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
                  Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
function ritFor(r){
 const band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 const tier=r.DQ>=8?1:(r.DQ>=4?2:3);
 const fit=PRACTICE.filter(p=>p.tier<=tier);
 const first=fit.filter(p=>p.track===track);
 const called=first.length?first[0]:fit[0];
 return {band, track, tier, called, substituted:!first.length,
         actualTrack:called?called.track:track, all:fit};}

function measure(){
 const out=[];
 for(const row of PANEL){
  const p=PEOPLE.find(x=>x.nm===row.nm);
  const r=loadPerson(p);
  const c=ritFor(r);
  /* choices on the ritual card: one button per candidate practice, plus the
     two controls in .rel-act. That is what a person is asked to choose among. */
  const choices=c.all.length+2;
  /* can the loop even start. ui/personas.js bRel builds the queue at sq>=4 */
  const hot=W.filter(n=>n.sq>=4).length;
  out.push({nm:row.nm, w:row.w, CQ:+r.CQ.toFixed(1), DQ:+r.DQ.toFixed(2),
   band:c.band, track:c.substituted?c.actualTrack:c.track, tier:c.tier,
   called:c.called?c.called.nm:'none', min:c.called?c.called.min:0,
   choices, releasable:hot, subs:c.substituted});}
 return out;}

/* ------------------------------------------------------------
   THE MODEL.
   ------------------------------------------------------------ */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;
 let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;
 return ((t^t>>>14)>>>0)/4294967296;};}

/* the CURRENT churn hazard, inverted out of the published curve. A piecewise
   power law between the four anchors, which is the shape retention curves take
   and is the only assumption in the inversion. */
function hazardCurve(D){
 const pts=[[0,1]]; for(let i=0;i<4;i++)pts.push([ANCHOR[i],D[i]]);
 const h=[];
 for(let day=1;day<=90;day++){
  h[day]=1-surv(pts,day)/Math.max(surv(pts,day-1),1e-9);}
 return h;}
function surv(pts,day){
 if(day<=0)return 1;
 for(let i=1;i<pts.length;i++){
  if(day<=pts[i][0]){
   const [d0,s0]=pts[i-1], [d1,s1]=pts[i];
   if(s1<=0)return Math.max(0,s0*(1-(day-d0)/Math.max(d1-d0,1)));
   if(d0===0)return s0+(s1-s0)*(day-d0)/(d1-d0);
   const b=Math.log(s1/s0)/Math.log(d1/d0);
   return s0*Math.pow(day/d0,b);}}
 const [d0,s0]=pts[pts.length-2],[d1,s1]=pts[pts.length-1];
 if(s1<=0)return 0;
 const b=Math.log(s1/s0)/Math.log(d1/d0);
 return s1*Math.pow(day/d1,b);}

const ODDS=p=>p/(1-p), UNODDS=o=>o/(1+o);
function applyOR(p,or){return UNODDS(ODDS(p)*or);}

const SPECCFG={ifthen:1,monitor:1,season:1,coin:'posthoc',halving:1,push:1,
               oneChoice:1,tieRelease:1};
const off=(k,v)=>Object.assign({},SPECCFG,{[k]:(v===undefined?0:v)});
const CFG={
 /* CURRENT. The build as it stands. The ritual saves and nothing reads it
    back on a surface anybody opens, so no term feeds anything. */
 current:{ifthen:0,monitor:0,season:0,coin:'none',halving:0,push:0,oneChoice:0,
          tieRelease:0},
 /* SPEC. Everything in section 5 of the report, coin paid after the fact. */
 spec:SPECCFG,
 /* the same, coin announced in advance and contingent on the act */
 contingent:off('coin','contingent'),
 /* one at a time ablations. Each is SPEC with exactly one thing removed, so
    the delta is what that one thing is worth in people. */
 'no ifthen':off('ifthen'), 'no record':off('monitor'),
 'no season':off('season'), 'reset to zero':off('halving'),
 'full practice list':off('oneChoice'), 'no push':off('push'),
 'release wall left in':off('tieRelease')};

/* KARMA. The earn rates and the price, derived in section 5 of the report.
   Five karma a pattern, sold in units of four, which is the floor sized run:
   one address across the four channels. */
const EARN={ritual:3, journal:2, address:1, mark:25, season:40};
const K_PER_PATTERN=5;
const PAT_PER_UNIT=4;
const RUNCOST=K_PER_PATTERN*PAT_PER_UNIT;   /* 20 */
const FULLRUN=K_PER_PATTERN*25;             /* 125, a run at the cap */

/* THE ONE STRUCTURAL RULE OF THIS MODEL, AND THE REASON IT VALIDATES.

   The published CURRENT curve already contains every cost the build imposes,
   including the ritual card's choice count and the twenty minute first
   practice. So CURRENT here is the bare calibrated hazard and nothing else is
   added to it: adding a penalty on top would count the same friction twice,
   which is exactly what the first cut of this tool did and what validation 3
   caught.

   Practising does not feed back into churn under CURRENT, and that is not a
   modelling convenience. It is measured: ladderHtml() in ui/cone.js:866 is
   called from exactly one place, coneOpen at :765, so the streak, the ledger
   and the marks render only inside the Compass card. Saving a ritual in the
   current build has no consequence on any surface the person is likely to
   open again.

   Every mechanic in SPEC is therefore a CREDIT against that hazard or a lift
   on the probability of practising, never a penalty removed from thin air. */
function runSim(cfgName,opt){
 opt=opt||{};
 const cfg=CFG[cfgName];
 const shock=opt.shock!==undefined?opt.shock:SRC.shock.v;
 const push=opt.push!==undefined?opt.push:SRC.push.v;
 const grad=opt.grad!==undefined?opt.grad:SRC.gradient.v;
 const loadK=opt.load!==undefined?opt.load:SRC.load.v;
 const rnd=mulberry32(opt.seed||20260920);
 const meas={}; measure().forEach(m=>meas[m.nm]=m);
 const people=[];
 for(const row of PANEL) for(let i=0;i<row.w;i++) people.push({nm:row.nm});
 const H={}; PANEL.forEach(r=>{H[r.nm]=hazardCurve(r.D);});

 const alive={}, exits={}, karma=[], firstRun=[], fullRun=[];
 const survKarma=[], exitDay=[];
 PANEL.forEach(r=>{alive[r.nm]=new Array(91).fill(0);});
 const total=new Array(91).fill(0);

 for(const per of people){
  const m=meas[per.nm];
  let live=true, last=-99, streak=0, grace=1, k=0, marks=0, done=0;
  let firstAt=null, fullAt=null, brokeToday=false;
  const SPEC=cfgName!=='current';
  /* IS THE RITUAL TIED TO SOMETHING THE PERSON CLEARED. ui/personas.js:418
     builds the release queue at sq>=4 and refuses below it, so four of the
     nine ICPs reach a complete reading with nothing to release. For them the
     ritual card cannot say where it came from, which is the one thing the
     panel said moves Diane. An untied plan gets half the log odds of the if
     then effect. The halving of the log odds is MINE. */
  const tied=(m.releasable>0)||!!cfg.tieRelease;
  const ifthenOR=tied?SRC.ifthen.v:Math.sqrt(SRC.ifthen.v);
  for(let day=1;day<=90;day++){
   if(!live)break;
   /* --- does the person practise today --- */
   let pdo=SRC.base_pdo.v;
   if(cfg.ifthen) pdo=applyOR(pdo,ifthenOR);
   if(cfg.monitor)pdo=applyOR(pdo,SRC.monitor.v);
   if(cfg.push)   pdo=applyOR(pdo,push);
   if(day<=7)     pdo=applyOR(pdo,SRC.endowed.v);
   if(cfg.season){const sd=((day-1)%7)+1; pdo=applyOR(pdo,1+(grad-1)*(sd-1)/6);}
   if(cfg.coin==='contingent') pdo=applyOR(pdo,SRC.overjust.v);
   /* the journal has its own small real effect on the next day */
   if(done>0) pdo=applyOR(pdo,SRC.write.v);
   /* the minutes demanded are a tax on the probability of doing it. A twenty
      minute first practice is not a five minute one. Linear in minutes above
      five, MINE, swept with --sweep. CURRENT deals what ritFor() deals.
      SPEC deals the shortest tier one practice as the entry, which is Box
      Breathing at 5 minutes in engine/data/practice.js, so the tax is zero. */
   const mins=SPEC?5:m.min;
   pdo=pdo*(1-Math.min(0.35,Math.max(0,(mins-5))*0.012));
   const did=rnd()<pdo;
   if(did){
    done++;
    if(day-last===1)streak++; else streak=1;
    last=day; grace=1;
    if(SPEC){
     k+=EARN.ritual+EARN.journal+(tied?EARN.address:0);
     if(cfg.season&&day%7===0)k+=EARN.season;
     if(done===1||done===7||done===30){marks++;k+=EARN.mark;}
     if(firstAt===null&&k>=RUNCOST)firstAt=day;
     if(fullAt===null&&k>=FULLRUN)fullAt=day;}
   } else if(SPEC){
    if(grace>0){grace--;}
    else if(streak>0){streak=cfg.halving?Math.max(1,Math.ceil(streak/2)):0;}
   }
   /* --- churn. CURRENT is the calibrated hazard and nothing else. --- */
   let h=H[per.nm][day];
   if(SPEC){
    /* a person who acted in the last two days has a reason to come back, and
       under SPEC the record is on a surface they open. Reciprocal of the
       Harkin monitoring odds ratio applied to the churn odds. */
    if(day-last<=2) h=UNODDS(ODDS(Math.min(h,0.999))/SRC.monitor.v);
    /* the choice load credit. One called practice instead of the whole
       candidate set. Bounded, because the ritual card is one surface of nine
       and does not appear in the top fourteen of the friction ledger in
       reviews/simulation-quarter.md section 7. */
    if(day<=2&&cfg.oneChoice)
     h=h*(1-Math.min(0.30,Math.max(0,m.choices-SRC.wm.v)*loadK));
    /* the break shock. A visible run that breaks costs something, and the
       halving is the thing that halves it. There is no run on any surface in
       CURRENT, so there is nothing to break.

       IT DECAYS WITH PRACTICE, and that is the one place Lally 2010 is load
       bearing rather than decorative: missing one opportunity did not
       materially affect habit formation, and automaticity accrues with
       repetition over a median around 66 days in that study's popular
       retelling, range 18 to 254. A practice eighty days in is not as fragile
       as one on day three. Without this term the model says a person who has
       practised for eleven weeks quits over one missed Tuesday, which is not
       credible and is what the first cut of this tool asserted. */
    if(!did&&streak>0&&grace===0){
     const frag=Math.max(0,1-done/66);
     h+=shock*frag*(cfg.halving?0.5:1);
     brokeToday=true;}
   }
   if(rnd()<Math.min(h,0.999)){
    live=false;
    /* WHAT THE MODEL ITSELF CAN SAY ABOUT AN EXIT, AND NOTHING MORE.

       The CURRENT hazard is calibrated off a published curve that already
       contains every friction measured in reviews/simulation-quarter.md, and
       a calibrated black box cannot be decomposed after the fact. So an exit
       is tagged with the only three things this model actually knows: the
       week it happened in, whether a broken run contributed on the day, and
       whether the person could run a release at all. Anything beyond that is
       a cross tab and is reported as association, never as cause. */
    const band=day<=2?'in the first two days':(day<=7?'in week one':
      (day<=30?'between day 8 and day 30':'after day 30'));
    const tag=(brokeToday?'a broken run contributed, ':'')
      +(tied?'':'could not run a release, ')+band;
    exits[tag]=(exits[tag]||0)+1;
    exitDay.push({nm:per.nm,day,tied,broke:brokeToday});
    break;}
   alive[per.nm][day]++; total[day]++;
   brokeToday=false;
  }
  karma.push(k);
  if(firstAt!==null)firstRun.push(firstAt);
  if(fullAt!==null)fullRun.push(fullAt);
  if(live)survKarma.push(k);
 }
 return {alive,total,exits,karma,firstRun,fullRun,survKarma,exitDay,meas};}

/* ------------------------------------------------------------
   VALIDATION. Three checks, run before anything is reported.
   ------------------------------------------------------------ */
function validate(){
 let pass=0,fail=0;
 const ok=(c,m)=>{if(c){pass++;console.log('  ok    '+m);}
                  else{fail++;console.log('  FAIL  '+m);}};
 console.log('\nVALIDATION 1. The weights.');
 const n=PANEL.reduce((a,r)=>a+r.w,0);
 ok(n===1000,'the nine weights sum to 1000, got '+n);
 const cnt={}; for(const row of PANEL) for(let i=0;i<row.w;i++)cnt[row.nm]=(cnt[row.nm]||0)+1;
 ok(PANEL.every(r=>cnt[r.nm]===r.w),'every ICP is sampled at its stated weight');

 console.log('\nVALIDATION 2. A constant hazard against its closed form.');
 /* h = 0.10 every day. R(d) must be 0.9^d. The machinery is checked against
    arithmetic, not against itself. */
 const rnd=mulberry32(7); let live=1e5, series=[];
 for(let d=1;d<=30;d++){let s=0; for(let i=0;i<live;i++) if(rnd()>=0.10)s++; live=s; series.push(live/1e5);}
 [1,7,30].forEach(d=>{
  const want=Math.pow(0.9,d), got=series[d-1];
  ok(Math.abs(got-want)<0.005,'day '+d+' survival '+got.toFixed(4)+' against 0.9^'+d+' = '+want.toFixed(4));});

 console.log('\nVALIDATION 3. CURRENT against reviews/simulation-quarter.md 6.3.');
 const R=runSim('current');
 const W1=[0.579,0.136,0.059,0.031];
 ANCHOR.forEach((d,i)=>{
  const got=R.total[d]/1000;
  ok(Math.abs(got-W1[i])<=0.025,'day '+d+' whole sample '+(got*100).toFixed(1)
   +' percent of 1000 against the published '+(W1[i]*100).toFixed(1)+' percent');});
 /* tolerance in PEOPLE and not in percent, because a 6 point tolerance on a
    cell of 15 is nine tenths of one person and would fail on sampling noise
    alone. Two people of slack, or 6 points, whichever is wider. */
 PANEL.forEach(r=>{
  const got=R.alive[r.nm][1]/r.w, tol=Math.max(0.06,2/r.w);
  ok(Math.abs(got-r.D[0])<=tol,'  '+r.nm+' day 1 '+(got*100).toFixed(0)
   +' percent of '+r.w+' against the published '+(r.D[0]*100).toFixed(0)
   +' percent, tolerance '+(tol*100).toFixed(0)+' points');});
 console.log('\n  '+pass+' checks passed, '+fail+' failed.');
 return fail===0;}

/* ------------------------------------------------------------
   REPORT
   ------------------------------------------------------------ */
function pct(a,b){return (100*a/b).toFixed(1)+' percent ('+a+' of '+b+')';}
const ABL=['no ifthen','no record','release wall left in','full practice list',
           'reset to zero','no season','no push'];
function report(){
 console.log('\n============================================================');
 console.log('A. WHAT THE BUILD DEALS. Measured off engine.js and ui/ritual.js.');
 console.log('============================================================');
 console.log(['who','wt','CQ','DQ','seat','track','tier','practice called for','min','choices','releasable'].join('\t'));
 measure().forEach(m=>{
  console.log([m.nm,m.w,m.CQ,m.DQ,m.band,m.track,m.tier,m.called,m.min,m.choices,m.releasable].join('\t'));});
 const noRel=measure().filter(m=>m.releasable===0).reduce((a,m)=>a+m.w,0);
 const big=measure().filter(m=>m.choices>SRC.wm.v).reduce((a,m)=>a+m.w,0);
 const long=measure().filter(m=>m.min>=15).reduce((a,m)=>a+m.w,0);
 console.log('\nweight that cannot run a release at all: '+pct(noRel,1000));
 console.log('weight met with more choices than working memory: '+pct(big,1000));
 console.log('weight whose first practice asks 15 minutes or more: '+pct(long,1000));

 const runs={};
 ['current','spec','contingent'].concat(ABL).forEach(k=>{runs[k]=runSim(k);});

 console.log('\n============================================================');
 console.log('B. RETENTION, WHOLE SAMPLE. Every cell is people out of 1000.');
 console.log('============================================================');
 console.log(['day','current','spec','coin announced in advance'].join('\t'));
 [1,7,14,30,60,90].forEach(d=>{
  console.log([d,runs.current.total[d],runs.spec.total[d],runs.contingent.total[d]].join('\t'));});

 /* THE CALIBRATION FORCES SIX ROWS TO ZERO AT DAY 90 AND NOTHING CAN SAVE
    THEM. The published curve has Diane, Derek, Angela, James, Gordon and Rosa
    at exactly 0.00 percent on day 90, and inverting a zero gives a hazard that
    reaches certainty, so those rows empty whatever the mechanics do. Every day
    90 figure in this run is therefore a floor, and the honest denominator for
    day 90 is the weight the calibration permits to survive at all. */
 const canLive=PANEL.filter(r=>r.D[3]>0).reduce((a,r)=>a+r.w,0);
 console.log('\nweight the calibration allows to be alive on day 90 at all: '
  +pct(canLive,1000)+'. Against that denominator, day 90 reads current '
  +(100*runs.current.total[90]/canLive).toFixed(1)+' percent and spec '
  +(100*runs.spec.total[90]/canLive).toFixed(1)+' percent.');

 ['current','spec'].forEach(k=>{
  console.log('\n'+k.toUpperCase()+', BY ICP. Each cell is people out of that ICP row.');
  console.log(['who','of','d1','d7','d14','d30','d60','d90'].join('\t'));
  PANEL.forEach(r=>{
   console.log([r.nm,r.w].concat([1,7,14,30,60,90].map(d=>runs[k].alive[r.nm][d])).join('\t'));});});

 console.log('\n============================================================');
 console.log('C. ABLATION. SPEC with exactly one thing removed. People of 1000.');
 console.log('============================================================');
 console.log(['removed','d7','d30','d90','d30 lost','d90 lost'].join('\t'));
 const rows=ABL.map(k=>({k,d7:runs[k].total[7],d30:runs[k].total[30],d90:runs[k].total[90],
   l30:runs.spec.total[30]-runs[k].total[30], l90:runs.spec.total[90]-runs[k].total[90]}));
 rows.sort((a,b)=>b.l30-a.l30);
 console.log(['nothing removed, SPEC','\t'+runs.spec.total[7],runs.spec.total[30],runs.spec.total[90],0,0].join('\t'));
 rows.forEach(r=>console.log([r.k,r.d7,r.d30,r.d90,r.l30,r.l90].join('\t')));

 console.log('\n============================================================');
 console.log('D. WHAT THE MODEL CAN SAY ABOUT AN EXIT. Of 1000.');
 console.log('============================================================');
 ['current','spec'].forEach(k=>{
  console.log('\n'+k+':');
  Object.entries(runs[k].exits).sort((a,b)=>b[1]-a[1])
   .forEach(([t,v])=>console.log('  '+v+'\t'+t));});
 /* the cross tab. association, not cause. */
 console.log('\ncross tab, CURRENT. Exit by day 7 among people who could and could not release.');
 [true,false].forEach(t=>{
  const set=runs.current.exitDay.filter(x=>x.tied===t);
  const pop=measure().filter(m=>(m.releasable>0)===t).reduce((a,m)=>a+m.w,0);
  const by7=set.filter(x=>x.day<=7).length;
  console.log('  could'+(t?'':' not')+' release: '+pct(by7,pop)+' gone by day 7');});

 console.log('\n============================================================');
 console.log('E. THE COIN. '+K_PER_PATTERN+' karma a pattern, sold in units of '+PAT_PER_UNIT+'.');
 console.log('============================================================');
 console.log('earn rates: ritual saved '+EARN.ritual+', journal committed '+EARN.journal
  +', new address opened '+EARN.address+', mark earned '+EARN.mark+', season completed '+EARN.season);
 const daily=7*(EARN.ritual+EARN.journal+EARN.address)+EARN.season;
 console.log('closed form, somebody who runs the whole loop every day: '+daily
  +' karma a week, which is '+(daily/K_PER_PATTERN).toFixed(1)+' patterns a week,'
  +' against the free allowance of 10 a week.');
 console.log('  a run at the cap is 25 patterns, '+FULLRUN+' karma, so '
  +(FULLRUN/daily).toFixed(1)+' weeks of daily practice.');
 const twice=2*(EARN.ritual+EARN.journal+EARN.address);
 console.log('closed form, somebody who runs it twice a week: '+twice
  +' karma a week, '+(twice/K_PER_PATTERN).toFixed(1)+' patterns a week, and '
  +(FULLRUN/twice).toFixed(1)+' weeks for a run at the cap.');
 console.log('  free plus karma, at the daily rate: '+(10+daily/K_PER_PATTERN).toFixed(1)
  +' patterns a week, '+((10+daily/K_PER_PATTERN)*52/12).toFixed(0)
  +' a month, against tier one at 400 a month. That is '
  +(((10+daily/K_PER_PATTERN)*52/12)/400*100).toFixed(0)+' percent of the bottom paid rung.');
 const K=runs.spec.karma.slice().sort((a,b)=>a-b);
 const q=f=>K[Math.floor(f*(K.length-1))];
 console.log('\nmeasured over the simulated 90 days, all 1000 including everybody who left:');
 console.log('  karma earned: median '+q(0.5)+', 75th '+q(0.75)+', 90th '+q(0.9)+', max '+K[K.length-1]);
 const SK=runs.spec.survKarma.slice().sort((a,b)=>a-b);
 if(SK.length)console.log('  among the '+SK.length+' still active at day 90: median '
  +SK[Math.floor(SK.length/2)]+', max '+SK[SK.length-1]);
 const F=runs.spec.firstRun.slice().sort((a,b)=>a-b);
 const G=runs.spec.fullRun.slice().sort((a,b)=>a-b);
 console.log('  afforded one unit of '+PAT_PER_UNIT+' patterns ('+RUNCOST+' karma): '+pct(F.length,1000)
  +', median on day '+(F.length?F[Math.floor(F.length/2)]:'never'));
 console.log('  afforded a run at the cap, 25 patterns ('+FULLRUN+' karma): '+pct(G.length,1000)
  +', median on day '+(G.length?G[Math.floor(G.length/2)]:'never'));
 console.log('\nthe measured karma is a FLOOR. The model pays three of the sixteen marks in');
 console.log('engine/ladder.js, because only three are functions of days practised. The other');
 console.log('thirteen read ground, stories, axes, intake and snapshots, which this model does');
 console.log('not simulate. All sixteen at '+EARN.mark+' karma is '+(16*EARN.mark)
  +' karma of one off income, which is '+(16*EARN.mark/K_PER_PATTERN)
  +' patterns, or '+(100*(16*EARN.mark/K_PER_PATTERN)/400).toFixed(0)
  +' percent of one tier one month, handed to somebody who never pays.');

 console.log('\n============================================================');
 console.log('F. SENSITIVITY on every coefficient that is mine.');
 console.log('============================================================');
 sweep();
}
function sweep(){
 console.log('\nbreak shock. MINE. Halving against reset to zero, people of 1000:');
 [0.10,0.175,0.25,0.325,0.40].forEach(s=>{
  const a=runSim('spec',{shock:s}), b=runSim('reset to zero',{shock:s});
  console.log('  shock '+s.toFixed(3)+'\thalving d30 '+a.total[30]+' d90 '+a.total[90]
   +'\treset d30 '+b.total[30]+' d90 '+b.total[90]
   +'\thalving is worth '+(a.total[30]-b.total[30])+' at d30');});
 console.log('\npush odds ratio. MINE, and the SPEC figure it comes from is marked unverified:');
 [1.0,1.15,1.30,1.45,1.60].forEach(p=>{
  const a=runSim('spec',{push:p});
  console.log('  push OR '+p.toFixed(2)+'\td7 '+a.total[7]+'\td30 '+a.total[30]+'\td90 '+a.total[90]);});
 console.log('\ngoal gradient at the end of a seven day season. MINE:');
 [1.0,1.175,1.35,1.5].forEach(g=>{
  const a=runSim('spec',{grad:g});
  console.log('  gradient '+g.toFixed(3)+'\td30 '+a.total[30]+'\td90 '+a.total[90]);});
 console.log('\nchoice load credit coefficient. MINE. SPEC against the full practice list:');
 [0,0.01,0.02,0.04].forEach(l=>{
  const a=runSim('spec',{load:l}), b=runSim('full practice list',{load:l});
  console.log('  load '+l.toFixed(2)+'\tone choice d7 '+a.total[7]
   +'\tfull list d7 '+b.total[7]+'\tworth '+(a.total[7]-b.total[7])+' at d7');});
 console.log('\nseed. The whole run, five seeds, day 30 and day 90 of 1000:');
 [20260920,11,222,3333,44444].forEach(sd=>{
  const a=runSim('current',{seed:sd}), b=runSim('spec',{seed:sd});
  console.log('  seed '+sd+'\tcurrent d30 '+a.total[30]+' d90 '+a.total[90]
   +'\tspec d30 '+b.total[30]+' d90 '+b.total[90]);});
}

console.log('\nSOURCES USED BY THE MODEL');
Object.entries(SRC).forEach(([k,v])=>console.log('  '+k+' = '+(typeof v.v==='number'?v.v.toFixed(3):v.v)+'\n    '+v.s));

const arg=process.argv[2]||'';
console.log('\nritualsim. 1000 people, 90 days, seed 20260920.');
if(arg==='--sweep'){sweep();}
else if(arg==='--validate'){process.exit(validate()?0:1);}
else{ if(!validate()){console.log('\nvalidation failed. report suppressed.');process.exit(1);} report(); }
