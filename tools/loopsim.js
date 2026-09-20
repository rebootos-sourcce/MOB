#!/usr/bin/env node
/* ============================================================
   loopsim.js

   THE WHOLE LOOP, SIMULATED 1000 TIMES OVER 90 DAYS.
   Discover, play, flow, body. Journal to imprint to story to practice to
   affirmation, and back to the journal.

   Brief: TASKS.md 0g block C, GM1 to GM5. "Iterate the game design, the
   gamification process and the core loop until the ICP bottom line goes up ten
   points."

   THE BOTTOM LINE, DEFINED ONCE AND NEVER MOVED.

     Percentage points of the weighted thousand person ICP panel still active
     on day 30, at seed 20260920, on the single absorbing exit machinery
     tools/ritualsim.js validated against the published curve.

   Nothing in this file redefines it, reweights the panel, changes the seed
   for the headline, or moves the day. The baseline is the build at the commit
   this was run on and it is measured, not remembered.

   WHAT THIS TOOL ADDS TO ritualsim.js, AND WHY IT IS A DIFFERENT TOOL.

   1. ritualsim's CURRENT is the build BEFORE four fixes landed. Those four are
      in the source now: the if then plan read back with a when and a where,
      the record moved out of the Compass onto Ritual, the streak halving
      instead of resetting, and one practice on the card instead of nineteen.
      So the baseline moved and it is re measured here. Validation 4 asserts
      all four are still in atuned_src, because a baseline config that drifts
      from the build is a lie with a number attached.

   2. The content chain is measured rather than modelled. proto/game/chain.js,
      proto/game/stem.js and proto/game/frames.js run against the real engine
      on the repository's own fourteen persona voices, and each ICP's
      throughput is that measurement rather than a coefficient. Every span
      shown to a person has to be a verbatim substring of what they wrote, and
      validation 5 checks it.

   3. Every coefficient that is mine is swept, and the report carries a figure
      with all of them at their pessimistic end, because a design whose value
      only exists at the optimistic end of my own guesses is not a design.

   Run:
     node tools/loopsim.js              validation, then the whole report
     node tools/loopsim.js --validate   the checks alone, exit 1 on any failure
     node tools/loopsim.js --sweep      the sensitivity tables alone
     node tools/loopsim.js --chain      the content chain measurement alone
   ============================================================ */

const path=require('path'), fs=require('fs');
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
const {S,CHARGES,SINAMES,PEOPLE,LAWSET,buildSoul,compute,W,PRACTICE,CHILD}=E;
const CHAIN=require(path.resolve(__dirname,'../proto/game/chain.js'));
const STEM=require(path.resolve(__dirname,'../proto/game/stem.js'));
const FRAMES=require(path.resolve(__dirname,'../proto/game/frames.js'));

/* ------------------------------------------------------------
   SOURCES. Every number the model uses, with where it came from. d values are
   converted to odds ratios by log OR = d * pi / sqrt(3), which is the standard
   logistic approximation and is itself an approximation.
   ------------------------------------------------------------ */
const d2or=d=>Math.exp(d*Math.PI/Math.sqrt(3));
const SRC={
 base_pdo:{v:0.30, s:'Patel 2016 Annals of Internal Medicine, control arm: 0.30 of participant days hit the goal. https://www.acpjournals.org/doi/10.7326/m15-1635'},
 loss_pdo:{v:0.45, s:'same trial, loss framed arm 0.45. The ceiling a manipulation pattern buys. Priced below and deliberately not built.'},
 ifthen:{v:d2or(0.65), s:'Gollwitzer and Sheeran 2006, 94 studies, 8,000+ participants, mean d 0.65. https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf'},
 monitor:{v:d2or(0.40), s:'Harkin 2016 Psychological Bulletin, 138 studies, 19,951 participants, d 0.40, larger when physically recorded. https://pubmed.ncbi.nlm.nih.gov/26479070/'},
 endowed:{v:(0.34/0.66)/(0.19/0.81), s:'Nunes and Dreze 2006 endowed progress, 34 percent against 19 percent completion. https://www.columbia.edu/~rk566/Session4/Goal-Gradient_Illusionary_Goal_Progress.pdf'},
 write:{v:d2or(0.15), s:'Frattaroli 2006 Psychological Bulletin, 146 studies, r .075, about d 0.15. Small and real.'},
 overjust:{v:d2or(-0.40), s:'Deci Koestner Ryan 1999, 128 studies, engagement contingent reward undermines free choice intrinsic motivation at d -0.40. https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf'},
 selfref:{v:0.45, s:'Symons and Johnson 1997 Psychological Bulletin 121(3):371-94, 129 studies, self reference effect mean d 0.45. https://pubmed.ncbi.nlm.nih.gov/9136641/ . USED AT HALF, see chainD.'},
 chainD:{v:0.225, s:'MINE, and it is a DISCOUNT not an addition: half of Symons and Johnson\'s 0.45, because their outcome is recall and this is applied to a daily probability of practising. Swept 0 to 0.45, which is nothing to the full published effect.'},
 assertHarm:{v:0.80, s:'MINE as a magnitude. Direction is Wood, Perunovic and Lee 2009 Psychological Science: repeating a positive self statement left LOW self esteem participants feeling worse, and the arm that did no harm held the statement as both true and not true. https://pubmed.ncbi.nlm.nih.gov/19493324/ . Applied as an odds ratio below 1 for the 800 of 1000 at grid level 4 or below, and it prices a REFUSED option.'},
 wm:{v:4, s:'CLAUDE.md, 57 to 71 simultaneous choices per screen against a working memory of about four.'},
 gradient:{v:1.35, s:'MINE. Direction from Kivetz Urminsky Zheng 2006 goal gradient. The 1.35 at the end of a seven day season is mine and is swept.'},
 shock:{v:0.25, s:'MINE. Extra one day churn probability when a run breaks. Direction from the abstinence violation effect, and from Duolingo shipping freezes and Finch shipping two repairs plus a pause. Swept 0.10 to 0.40.'},
 push:{v:1.30, s:'MINE. reviews/SPEC-ritual-accountability.md claims plus 6 from a 22:00 push and marks it unverified in repo. Swept, and EXCLUDED from the headline because push needs a server and the product is one file with no network.'},
 load:{v:0.02, s:'MINE. Extra first two day churn per choice above working memory. Swept.'},
 pfloor:{v:0.22, s:'MINE, and the largest of my guesses. The probability that somebody who did not do the full practice does the sixty second floor version instead. Precedent: Finch ships four selectable commitment levels, Baby steps to On fire, and is top decile at D1 and D7. https://finch.fandom.com/wiki/Streaks . Swept 0 to 0.35.'},
 stake:{v:1.15, s:'MINE. One line the person writes on what is at stake, read back beside what they did. Direction from self determination theory on autonomous motivation, and precedent from I Am Sober, whose first onboarding field is why you want to stop. Swept 1.00 to 1.30.'}};

/* ------------------------------------------------------------
   THE PANEL. Weights from RESEARCH-icp.md, summing to exactly 1,000.
   D is the published CURRENT curve at days 1, 7, 30 and 90 from
   reviews/simulation-quarter.md section 6.3 and is the calibration target.
   grid is the BUYERS.md level the engine's own reading puts them at, per
   PANEL-flow-1000.md, and it is what decides who the asserted affirmation
   would have harmed.
   ------------------------------------------------------------ */
const PANEL=[
 {nm:'Diane', w:180, grid:3,  D:[1.00,0.08,0.02,0.00]},
 {nm:'Derek', w:170, grid:2,  D:[0.62,0.06,0.01,0.00]},
 {nm:'Marcus',w:160, grid:4,  D:[0.45,0.18,0.09,0.05]},
 {nm:'Angela',w:150, grid:4,  D:[0.34,0.05,0.01,0.00]},
 {nm:'Sofia', w:140, grid:6,  D:[0.78,0.41,0.22,0.14]},
 {nm:'James', w:100, grid:2,  D:[0.22,0.04,0.01,0.00]},
 {nm:'Ana',   w:50,  grid:1,  D:[0.70,0.26,0.11,0.06]},
 {nm:'Gordon',w:35,  grid:1,  D:[0.06,0.00,0.00,0.00]},
 {nm:'Rosa',  w:15,  grid:10, D:[0.12,0.02,0.00,0.00]}];
const ANCHOR=[1,7,30,90];

/* ============================================================
   A. WHAT THE BUILD DEALS. Measured, not modelled.
   ============================================================ */
function loadPerson(p){
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2;
 S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(c=>{
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:5.5);});
 return compute();}

/* ported from ui/ritual.js ritFor as it stands NOW. The lightest practice in
   the track, which is one of the four fixes that landed. */
const TRACK4BAND={Root:'Body',Sacral:'Somatic',Solar:'Somatic',Heart:'Body',
                  Throat:'Mind','3rd Eye':'Mind',Crown:'Energy'};
function ritFor(r){
 const band=r.darkB||'Root', track=TRACK4BAND[band]||'Body';
 const tier=r.DQ>=8?1:(r.DQ>=4?2:3);
 const fit=PRACTICE.filter(p=>p.tier<=tier);
 const first=fit.filter(p=>p.track===track);
 const lightest=set=>set.slice().sort((a,b)=>(a.min-b.min)||(a.tier-b.tier))[0];
 const called=first.length?lightest(first):lightest(fit);
 return {band, track, tier, called, substituted:!first.length,
         actualTrack:called?called.track:track, all:fit};}

/* ------------------------------------------------------------
   THE CONTENT CHAIN, MEASURED. Three configurations of the sniffer against
   the repository's own persona voices, with the real engine.
   ------------------------------------------------------------ */
const LEXKEYS=(function(){
 const s=fs.readFileSync(path.resolve(process.env.ENGINE||'engine.js'),'utf8');
 const i=s.indexOf('var LEX={'), j=s.indexOf('\nvar ',i+10);
 const blk=s.slice(i,j), re=/(?:'([a-z][a-z' ]*)'|\b([a-z]{2,})\s*):\s*\[/g;
 let m, keys=[]; while((m=re.exec(blk))!==null)keys.push(m[1]||m[2]);
 return [...new Set(keys)];})();
const KNOWN={}; LEXKEYS.forEach(k=>KNOWN[k]=1);
const STEMIX=STEM.index(LEXKEYS);

/* one pass of the chain at a given sniffer configuration.
   fold: the stemmer at the boundary of the sniffer.
   frame: the frame layer, which matches a FORM and returns the span it matched. */
function chainRun(text,cfg){
 let parsed, back={};
 if(cfg.fold){
  const f=STEM.fold(text,STEMIX,KNOWN); back=f.back;
  parsed=E.parseStory(f.text);
  /* the span must be a cut of what the PERSON typed, so the word the engine
     now reports is translated back through the fold's own map first. */
  if(parsed.path&&parsed.path.kink&&back[parsed.path.kink.word])
   parsed.path.kink.word=back[parsed.path.kink.word];
  if(parsed.path&&parsed.path.floor&&back[parsed.path.floor.word])
   parsed.path.floor.word=back[parsed.path.floor.word];
 } else parsed=E.parseStory(text);
 const fr=cfg.frame?FRAMES.framesIn(text):null;
 const ch=CHAIN.chainOf(text,parsed,CHILD,fr);
 return {parsed, ch, frames:fr||[], bad:CHAIN.verbatim(text,ch)};}

const SNIFF={
 built:{fold:0,frame:0},
 fold:{fold:1,frame:0},
 frames:{fold:1,frame:1}};

function chainTable(){
 const rows=[];
 PEOPLE.forEach(p=>{
  const r={nm:p.nm, says:p.says};
  Object.keys(SNIFF).forEach(k=>{
   const o=chainRun(p.says,SNIFF[k]);
   r[k]={span:!!o.ch.span, affirm:!!o.ch.affirm, axis:!!o.ch.fetter,
         imprints:o.parsed.imprints.length, bad:o.bad.length,
         text:o.ch.span?o.ch.span.text:null, from:o.ch.from||null,
         form:o.ch.affirm?o.ch.affirm.form:null,
         aff:o.ch.affirm?o.ch.affirm.text:null};});
  rows.push(r);});
 return rows;}

/* each ICP's throughput is ITS OWN measurement, not a pooled rate. */
function throughput(){
 const t=chainTable(), by={};
 t.forEach(r=>{by[r.nm]=r;});
 const out={};
 PANEL.forEach(p=>{
  out[p.nm]={};
  Object.keys(SNIFF).forEach(k=>{
   const r=by[p.nm];
   out[p.nm][k]={span:r?r[k].span:false, affirm:r?r[k].affirm:false};});});
 return out;}

function measure(){
 const out=[], TP=throughput();
 for(const row of PANEL){
  const p=PEOPLE.find(x=>x.nm===row.nm);
  const r=loadPerson(p);
  const c=ritFor(r);
  /* choices on the card as the build now renders it: ONE practice plus the
     control that reveals the rest plus the two in .rel-act. */
  const choicesNow=1+1+2;
  const choicesWas=c.all.length+2;
  const hot=W.filter(n=>n.sq>=4).length;
  out.push({nm:row.nm, w:row.w, grid:row.grid, CQ:+r.CQ.toFixed(1), DQ:+r.DQ.toFixed(2),
   band:c.band, track:c.substituted?c.actualTrack:c.track, tier:c.tier,
   called:c.called?c.called.nm:'none', min:c.called?c.called.min:0,
   choices:choicesNow, wasChoices:choicesWas, releasable:hot,
   tp:TP[row.nm]});}
 return out;}

/* ============================================================
   THE MODEL.
   ============================================================ */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;
 let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;
 return ((t^t>>>14)>>>0)/4294967296;};}
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
function hazardCurve(D){
 const pts=[[0,1]]; for(let i=0;i<4;i++)pts.push([ANCHOR[i],D[i]]);
 const h=[];
 for(let day=1;day<=90;day++)h[day]=1-surv(pts,day)/Math.max(surv(pts,day-1),1e-9);
 return h;}
const ODDS=p=>p/(1-p), UNODDS=o=>o/(1+o);
const applyOR=(p,or)=>UNODDS(ODDS(p)*or);

/* ------------------------------------------------------------
   THE CONFIGURATIONS. The iteration ladder, in the order it was run.

   sniff   which sniffer configuration, and therefore each ICP's measured
           content throughput. Not a coefficient.
   ifthen  the plan reads back with a when and a where. BUILT.
   monitor the record renders on the Ritual surface. BUILT.
   halving the run halves and never resets. BUILT.
   oneChoice one practice on the card. BUILT.
   tieImprint the ritual is titled with the sentence it came from, which is a
           quotation from the journal and does NOT need a release, so it works
           for the 465 of 1000 who reach a complete reading with nothing above
           the release threshold.
   chain   the practice's contact line is the person's own span.
   floor   the affirmation is the sixty second floor version of the ritual.
   season  seven days with an end.
   stake   one line on what is at stake, read back.
   push    excluded from the headline: it needs a server.
   assert  a REFUSED arm. The affirmation asserted rather than tested.
   loss    a REFUSED arm. The Patel loss framed daily probability.
   ------------------------------------------------------------ */
const BASE={sniff:'built',ifthen:0,monitor:0,halving:0,oneChoice:0,tieImprint:0,
 chain:0,floor:0,season:0,stake:0,push:0,coin:'none',assert:0,loss:0,tieRelease:0};
const mk=(o)=>Object.assign({},BASE,o);
const BUILT=mk({ifthen:1,monitor:1,halving:1,oneChoice:1});
const D1=Object.assign({},BUILT,{tieImprint:1});
const D2=Object.assign({},D1,{sniff:'fold'});
const D3=Object.assign({},D2,{sniff:'frames'});
const D4=Object.assign({},D3,{chain:1});
const D5=Object.assign({},D4,{floor:1});
const D6=Object.assign({},D5,{season:1});
const D7=Object.assign({},D6,{stake:1});
const FINAL=D7;
const CFG={
 /* the build BEFORE the four fixes, kept so validation 3 can still check the
    machinery against the published curve. */
 current:mk({}),
 built:BUILT, d1:D1, d2:D2, d3:D3, d4:D4, d5:D5, d6:D6, d7:D7, final:FINAL,
 'final plus push':Object.assign({},FINAL,{push:1}),
 'final plus karma announced in advance':Object.assign({},FINAL,{coin:'contingent'}),
 'REFUSED affirmation asserted':Object.assign({},FINAL,{assert:1}),
 'REFUSED loss framing':Object.assign({},FINAL,{loss:1}),
 /* ablations of the final design, one thing removed at a time */
 'no tie to the sentence':Object.assign({},FINAL,{tieImprint:0}),
 'no frame layer':Object.assign({},FINAL,{sniff:'fold'}),
 'no sniffer work at all':Object.assign({},FINAL,{sniff:'built'}),
 'no words in the practice':Object.assign({},FINAL,{chain:0}),
 'no floor practice':Object.assign({},FINAL,{floor:0}),
 'no season':Object.assign({},FINAL,{season:0}),
 'no stake sentence':Object.assign({},FINAL,{stake:0}),
 'reset to zero':Object.assign({},FINAL,{halving:0}),
 'full practice list':Object.assign({},FINAL,{oneChoice:0}),
 'no record on the surface':Object.assign({},FINAL,{monitor:0}),
 'no if then plan':Object.assign({},FINAL,{ifthen:0})};

/* KARMA. Rates restated in PATTERNS, on the reading that karma is the name
   for patterns a person earned rather than a second unit that buys them. See
   the report, and the question is the owner's. */
const EARN={ritual:1, journal:1, mark:5, award:5, season:8};
const RUNCOST=4;      /* one address across the four channels, the floor run */
const FULLRUN=25;     /* a release run at the cap */

function runSim(cfgName,opt){
 opt=opt||{};
 const cfg=CFG[cfgName];
 if(!cfg)throw new Error('no config '+cfgName);
 const shock=opt.shock!==undefined?opt.shock:SRC.shock.v;
 const push=opt.push!==undefined?opt.push:SRC.push.v;
 const grad=opt.grad!==undefined?opt.grad:SRC.gradient.v;
 const loadK=opt.load!==undefined?opt.load:SRC.load.v;
 const chainD=opt.chainD!==undefined?opt.chainD:SRC.chainD.v;
 const pfl=opt.pfloor!==undefined?opt.pfloor:SRC.pfloor.v;
 const stakeOR=opt.stake!==undefined?opt.stake:SRC.stake.v;
 const harm=opt.harm!==undefined?opt.harm:SRC.assertHarm.v;
 const rnd=mulberry32(opt.seed||20260920);
 const meas={}; measure().forEach(m=>{meas[m.nm]=m;});
 const people=[];
 for(const row of PANEL) for(let i=0;i<row.w;i++) people.push({nm:row.nm});
 const H={}; PANEL.forEach(r=>{H[r.nm]=hazardCurve(r.D);});

 const alive={}, exits={}, karma=[], firstRun=[], fullRun=[], survKarma=[], exitDay=[];
 PANEL.forEach(r=>{alive[r.nm]=new Array(91).fill(0);});
 const total=new Array(91).fill(0);
 const SPEC=cfgName!=='current';

 for(const per of people){
  const m=meas[per.nm];
  const tp=m.tp[cfg.sniff]||{span:false,affirm:false};
  /* IS THE RITUAL TIED TO SOMETHING OF THE PERSON'S OWN.

     Two routes, and the second is new. The old one is a released address,
     which needs sq>=4 and which 465 of 1000 never reach. The new one is a
     verbatim quotation of the sentence the charge was read out of, which
     needs only that the sniffer could read the sentence at all. An untied
     plan gets half the log odds of the if then effect, which is MINE and is
     inherited from ritualsim unchanged. */
  const tiedRel=(m.releasable>0)||!!cfg.tieRelease;
  const tiedTxt=!!cfg.tieImprint&&tp.span;
  const tied=tiedRel||tiedTxt;
  const ifthenOR=tied?SRC.ifthen.v:Math.sqrt(SRC.ifthen.v);
  /* the practice's contact line is the person's own words. Gated on the
     measurement: no span, no credit. */
  const chainOR=(cfg.chain&&tp.span)?d2or(chainD):1;
  /* the floor version of the ritual is the affirmation, held for sixty
     seconds against the body. Gated on an affirmation existing. */
  const canFloor=!!cfg.floor&&tp.affirm;
  /* the refused arm. An asserted positive self statement, on the 800 of 1000
     at grid level four or below. */
  const assertOR=(cfg.assert&&tp.affirm&&m.grid<=4)?harm:1;

  let live=true, last=-99, streak=0, grace=1, k=0, marks=0, done=0, floors=0;
  let firstAt=null, fullAt=null, brokeToday=false;
  for(let day=1;day<=90;day++){
   if(!live)break;
   let pdo=cfg.loss?SRC.loss_pdo.v:SRC.base_pdo.v;
   if(cfg.ifthen) pdo=applyOR(pdo,ifthenOR);
   if(cfg.monitor)pdo=applyOR(pdo,SRC.monitor.v);
   if(cfg.chain)  pdo=applyOR(pdo,chainOR);
   if(cfg.stake)  pdo=applyOR(pdo,stakeOR);
   if(cfg.assert) pdo=applyOR(pdo,assertOR);
   if(cfg.push)   pdo=applyOR(pdo,push);
   if(day<=7)     pdo=applyOR(pdo,SRC.endowed.v);
   if(cfg.season){const sd=((day-1)%7)+1; pdo=applyOR(pdo,1+(grad-1)*(sd-1)/6);}
   if(cfg.coin==='contingent') pdo=applyOR(pdo,SRC.overjust.v);
   if(done>0) pdo=applyOR(pdo,SRC.write.v);
   /* the minutes tax. CURRENT deals what ritFor deals, which after the fix
      that landed is the LIGHTEST practice in the track rather than the first
      row of the table. So the tax is read off the measurement and is not
      assumed away. */
   const mins=m.min;
   pdo=pdo*(1-Math.min(0.35,Math.max(0,(mins-5))*0.012));
   let did=rnd()<pdo, onFloor=false;
   /* THE FLOOR. Sixty seconds on the person's own affirmation, held against
      the body rather than repeated at it. It counts, and that is the whole
      mechanic: a day a person could not give twenty minutes to is still a day
      they kept. Finch ships four commitment levels for the same reason. */
   if(!did&&canFloor&&rnd()<pfl){did=true; onFloor=true; floors++;}
   if(did){
    done++;
    if(day-last===1)streak++; else streak=1;
    last=day; grace=1;
    if(SPEC){
     k+=EARN.ritual+(onFloor?0:EARN.journal);
     if(cfg.season&&day%7===0)k+=EARN.season;
     if(done===1||done===7||done===30){marks++;k+=EARN.mark;}
     if(firstAt===null&&k>=RUNCOST)firstAt=day;
     if(fullAt===null&&k>=FULLRUN)fullAt=day;}
   } else if(SPEC){
    if(grace>0){grace--;}
    else if(streak>0){streak=cfg.halving?Math.max(1,Math.ceil(streak/2)):0;}
   }
   let h=H[per.nm][day];
   if(SPEC){
    if(day-last<=2) h=UNODDS(ODDS(Math.min(h,0.999))/SRC.monitor.v);
    if(day<=2&&cfg.oneChoice)
     h=h*(1-Math.min(0.30,Math.max(0,m.wasChoices-SRC.wm.v)*loadK));
    if(!did&&streak>0&&grace===0){
     const frag=Math.max(0,1-done/66);
     h+=shock*frag*(cfg.halving?0.5:1);
     brokeToday=true;}
   }
   if(rnd()<Math.min(h,0.999)){
    live=false;
    const band=day<=2?'in the first two days':(day<=7?'in week one':
      (day<=30?'between day 8 and day 30':'after day 30'));
    const tag=(brokeToday?'a broken run contributed, ':'')
      +(tied?'':'the ritual was tied to nothing of theirs, ')+band;
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

/* ============================================================
   VALIDATION. Six groups, run before anything is reported.
   ============================================================ */
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
 const rnd=mulberry32(7); let live=1e5, series=[];
 for(let d=1;d<=30;d++){let s=0; for(let i=0;i<live;i++) if(rnd()>=0.10)s++; live=s; series.push(live/1e5);}
 [1,7,30].forEach(d=>{
  const want=Math.pow(0.9,d), got=series[d-1];
  ok(Math.abs(got-want)<0.005,'day '+d+' survival '+got.toFixed(4)+' against 0.9^'+d+' = '+want.toFixed(4));});

 console.log('\nVALIDATION 3. The pre fix build against reviews/simulation-quarter.md 6.3.');
 const R=runSim('current');
 const W1=[0.579,0.136,0.059,0.031];
 ANCHOR.forEach((d,i)=>{
  const got=R.total[d]/1000;
  ok(Math.abs(got-W1[i])<=0.025,'day '+d+' whole sample '+(got*100).toFixed(1)
   +' percent of 1000 against the published '+(W1[i]*100).toFixed(1)+' percent');});
 PANEL.forEach(r=>{
  const got=R.alive[r.nm][1]/r.w, tol=Math.max(0.06,2/r.w);
  ok(Math.abs(got-r.D[0])<=tol,'  '+r.nm+' day 1 '+(got*100).toFixed(0)
   +' percent of '+r.w+' against the published '+(r.D[0]*100).toFixed(0)+' percent');});

 console.log('\nVALIDATION 4. The baseline config against the actual source.');
 /* A BASELINE THAT DRIFTS FROM THE BUILD IS A LIE WITH A NUMBER ATTACHED.
    ritualsim measured a build in which none of these four existed. All four
    are in the source now, so BUILT turns all four on, and this asserts they
    are still there rather than trusting a memory of a commit. */
 const RIT=fs.readFileSync(path.resolve(__dirname,'../atuned_src/ui/ritual.js'),'utf8');
 const LAD=fs.readFileSync(path.resolve(__dirname,'../atuned_src/engine/ladder.js'),'utf8');
 ok(/id="ritwhen"/.test(RIT)&&/id="ritwhere"/.test(RIT),
  'fix 1, the if then plan: a when and a where field are in ui/ritual.js');
 ok(/ritToday\(\)/.test(RIT)&&/Today's ritual|Today\\'s ritual/.test(RIT),
  'fix 1b, the plan is read back: ritToday renders on the card');
 ok(/ladderHtml\(\)/.test(RIT),
  'fix 2, the record is on the Ritual surface: ladderHtml is called from ui/ritual.js');
 ok(/Math\.max\(1,\s*Math\.ceil\(run\/2\)\)/.test(LAD),
  'fix 3, the halving: Math.max(1, Math.ceil(run/2)) is in engine/ladder.js streakRead');
 ok(/rit-list'\+\(showAll\?''/.test(RIT)||/rit-list.*one/.test(RIT),
  'fix 4, one practice on the card: the list is filtered to what is called for');
 ok(BUILT.ifthen&&BUILT.monitor&&BUILT.halving&&BUILT.oneChoice,
  'and the BUILT config turns all four on, so the baseline is the build');
 const b=runSim('built'), c=runSim('current');
 ok(b.total[30]>=c.total[30],'BUILT retains at least as many at day 30 as the pre fix build, '
  +b.total[30]+' against '+c.total[30]);

 console.log('\nVALIDATION 5. The content chain. Every word came from the person.');
 let vb=0, tested=0, empt=0;
 PEOPLE.forEach(p=>{
  Object.keys(SNIFF).forEach(k=>{
   const o=chainRun(p.says,SNIFF[k]); tested++;
   if(o.bad.length){vb++; console.log('       '+p.nm+' at '+k+': '+o.bad.join('; '));}});});
 ok(vb===0,'all '+tested+' chain runs over '+PEOPLE.length
  +' persona voices at three sniffer settings returned only verbatim spans');
 ['','   ','\n',' . , ; ','aaaa bbbb cccc'].forEach(t=>{
  const o=chainRun(t,SNIFF.frames);
  if(o.ch.span||o.ch.affirm)empt++;});
 ok(empt===0,'and text with nothing in it produces no span and no affirmation');
 /* the fold must not invent a reading where the words say nothing */
 const dull='the table is brown and the chair is wooden and the door is open';
 ok(chainRun(dull,SNIFF.frames).parsed.imprints.length===0,
  'a sentence with no charge in it still reads as no charge under the fold and the frames');
 /* the frame layer must be able to find the coherent side too, or it reads a
    settled person as empty and then invents something */
 ok(FRAMES.framesIn('Things do not sit on me the way they used to')
   .some(f=>f.seat==='coherent'),
  'and the frame layer can read the coherent side, not only load');

 console.log('\nVALIDATION 6. The ladder is monotone where it has to be.');
 /* every rung adds a credit and removes nothing, so no rung may retain fewer
    at day 30 than the rung below it by more than sampling noise. Two people
    of slack, which is the same tolerance validation 3 uses. */
 const rungs=['built','d1','d2','d3','d4','d5','d6','d7'];
 const got=rungs.map(r=>runSim(r).total[30]);
 for(let i=1;i<rungs.length;i++)
  ok(got[i]>=got[i-1]-2, '  '+rungs[i]+' '+got[i]+' is not below '+rungs[i-1]+' '+got[i-1]+' by more than 2');

 console.log('\n  '+pass+' checks passed, '+fail+' failed.');
 return fail===0;}

/* ============================================================
   REPORT
   ============================================================ */
const pct=(a,b)=>(100*a/b).toFixed(1)+' percent ('+a+' of '+b+')';
const LADDER=[['current','the build BEFORE the four fixes, for the audit trail'],
 ['built','THE BASELINE. The build as it stands at this commit'],
 ['d1','pass 1: the ritual is titled with the sentence it came from'],
 ['d2','pass 2: and the stemmer folds a word to its family'],
 ['d3','pass 3: and the frame layer reads the form of a sentence'],
 ['d4','pass 4: and the practice contact line is the person\'s own span'],
 ['d5','pass 5: and the affirmation is the sixty second floor version'],
 ['d6','pass 6: and the season, seven days with an end'],
 ['d7','pass 7: and the stake sentence. THE FINAL DESIGN']];
const ABL=['no tie to the sentence','no frame layer','no sniffer work at all',
 'no words in the practice','no floor practice','no season','no stake sentence',
 'reset to zero','full practice list','no record on the surface','no if then plan'];

function chainReport(){
 console.log('\n============================================================');
 console.log('A2. THE CONTENT CHAIN, MEASURED ON THE REAL ENGINE.');
 console.log('============================================================');
 console.log('The repository\'s own fourteen persona voices, PEOPLE[].says in');
 console.log('engine/data/people.js, through the real parseStory at three sniffer settings.');
 const t=chainTable();
 console.log('\n'+['who','built','+fold','+fold +frames','the span it cuts, with the frames on'].join('\t'));
 t.forEach(r=>{
  const f=k=>(r[k].span?'span':(r[k].affirm?'aff':'-'));
  console.log([r.nm,f('built'),f('fold'),f('frames'),
   r.frames.text?('"'+r.frames.text+'"'):(r.frames.aff?('['+r.frames.form+'] '+r.frames.aff):'nothing')].join('\t'));});
 Object.keys(SNIFF).forEach(k=>{
  const sp=t.filter(r=>r[k].span).length, af=t.filter(r=>r[k].affirm).length,
        ax=t.filter(r=>r[k].axis).length, bad=t.reduce((a,r)=>a+r[k].bad,0);
  console.log('\n'+k+': a span for '+sp+' of '+t.length+' voices, an axis for '+ax
   +', an affirmation for '+af+', verbatim failures '+bad);});
 /* and the same thing weighted, which is the number the model uses */
 const TP=throughput();
 console.log('\nWEIGHTED, over the nine ICPs. This is what the model uses and it is a');
 console.log('measurement per person, not a pooled rate.');
 console.log(['sniffer','weight with a span','weight with an affirmation'].join('\t'));
 Object.keys(SNIFF).forEach(k=>{
  const sp=PANEL.filter(p=>TP[p.nm][k].span).reduce((a,p)=>a+p.w,0);
  const af=PANEL.filter(p=>TP[p.nm][k].affirm).reduce((a,p)=>a+p.w,0);
  console.log([k,sp+' of 1000',af+' of 1000'].join('\t'));});
 console.log('\nper ICP, with the frames on:');
 PANEL.forEach(p=>{
  const r=t.find(x=>x.nm===p.nm);
  console.log('  '+p.nm.padEnd(7)+String(p.w).padStart(4)+'  '
   +(r.frames.span?'span':'no span').padEnd(8)
   +(r.frames.from||'-').padEnd(7)
   +(r.frames.text?('"'+r.frames.text+'"'):'').slice(0,52));});
 console.log('\nAND THE INFLECTION PROBE, which is how the fold earns its place.');
 const fam=['freeze','froze','frozen','freezing','freezes','exhausted','exhausting',
 'exhaustion','exhaust','exhausts','panic','panicked','panicking','panics','grief',
 'grieve','grieving','grieved','bereaved','shame','ashamed','shaming','shamed',
 'humiliated','fear','afraid','feared','fearing','frightened','scared','terrified',
 'anger','angry','angered','furious','rage','raging','alone','lonely','loneliness',
 'isolated','abandoned','shout','shouted','shouting','shouts','yelling','numb',
 'numbness','numbed','deadened','flat','tight','tightness','tightened','clenched',
 'clenching','held','holding','holds','carry','carrying','carried'];
 let h0=0,h1=0;
 fam.forEach(w=>{const s='I '+w+' today';
  if(E.scanStory(s).some(x=>x.t===w))h0++;
  if(E.scanStory(STEM.fold(s,STEMIX,KNOWN).text).length)h1++;});
 console.log('  '+fam.length+' ordinary inflections and near synonyms of words the table already holds:');
 console.log('  read by the sniffer today '+h0+', read with the fold '+h1+'.');
 console.log('  The three the product misses include fear, shame and anger, which are');
 console.log('  the names of three of the nine axes.');
 console.log('\n  A NOTE ON THIS MEASUREMENT AND WHAT IT CANNOT SAY. The eighteen frames');
 console.log('  were written having read all fourteen voices, so the frame figures are IN');
 console.log('  SAMPLE and are an upper bound. The held out test is the first hundred real');
 console.log('  entries and it has not been run. The fold is not in sample: its rule is');
 console.log('  nineteen suffixes and it never saw a persona line.');}

function report(){
 console.log('\n============================================================');
 console.log('A1. WHAT THE BUILD DEALS. Measured off engine.js and ui/ritual.js.');
 console.log('============================================================');
 console.log(['who','wt','grid','CQ','DQ','seat','track','tier','practice called for','min','choices now','choices before the fix','releasable'].join('\t'));
 measure().forEach(m=>console.log([m.nm,m.w,m.grid,m.CQ,m.DQ,m.band,m.track,m.tier,
  m.called,m.min,m.choices,m.wasChoices,m.releasable].join('\t')));
 const M=measure();
 const noRel=M.filter(m=>m.releasable===0).reduce((a,m)=>a+m.w,0);
 const long=M.filter(m=>m.min>=15).reduce((a,m)=>a+m.w,0);
 console.log('\nweight that cannot run a release at all: '+pct(noRel,1000));
 console.log('weight whose first practice still asks 15 minutes or more: '+pct(long,1000));
 console.log('weight met with more choices than working memory, after the fix: '
  +pct(M.filter(m=>m.choices>SRC.wm.v).reduce((a,m)=>a+m.w,0),1000));

 chainReport();

 const runs={};
 LADDER.forEach(([k])=>{runs[k]=runSim(k);});
 ['final','final plus push','final plus karma announced in advance',
  'REFUSED affirmation asserted','REFUSED loss framing'].concat(ABL)
  .forEach(k=>{runs[k]=runSim(k);});

 console.log('\n============================================================');
 console.log('B. THE ITERATION LADDER. Every cell is people of 1000. THE BOTTOM LINE');
 console.log('   IS THE DAY 30 COLUMN AS A PERCENTAGE OF 1000.');
 console.log('============================================================');
 console.log(['pass','d1','d7','d14','d30','d60','d90','bottom line','delta on baseline','what it added'].join('\t'));
 const base=runs.built.total[30]/10;
 LADDER.forEach(([k,what])=>{
  const r=runs[k], bl=r.total[30]/10;
  console.log([k,r.total[1],r.total[7],r.total[14],r.total[30],r.total[60],r.total[90],
   bl.toFixed(1)+' points',(k==='current'?'':(bl-base>=0?'+':'')+(bl-base).toFixed(1)+' points'),what].join('\t'));});
 const fin=runs.final.total[30]/10;
 console.log('\nBASELINE '+base.toFixed(1)+' points of 1000 at day 30. FINAL '+fin.toFixed(1)
  +' points. DELTA '+(fin-base>=0?'+':'')+(fin-base).toFixed(1)+' points.');
 console.log('Target was ten points. '+((fin-base)>=10?'Reached.':'NOT REACHED, short by '
  +(10-(fin-base)).toFixed(1)+' points.'));

 console.log('\nand the two things kept out of the headline, with their numbers:');
 ['final plus push','final plus karma announced in advance'].forEach(k=>{
  console.log('  '+k+': d30 '+runs[k].total[30]+' of 1000, '
   +((runs[k].total[30]/10-fin)>=0?'+':'')+(runs[k].total[30]/10-fin).toFixed(1)
   +' points on the final design');});
 console.log('\nand the two refusals, priced:');
 ['REFUSED loss framing','REFUSED affirmation asserted'].forEach(k=>{
  console.log('  '+k+': d30 '+runs[k].total[30]+' of 1000, '
   +((runs[k].total[30]/10-fin)>=0?'+':'')+(runs[k].total[30]/10-fin).toFixed(1)
   +' points on the final design');});

 console.log('\n============================================================');
 console.log('C. BY ICP. Baseline and final, each cell people out of that ICP row.');
 console.log('============================================================');
 ['built','final'].forEach(k=>{
  console.log('\n'+(k==='built'?'BASELINE, the build today':'FINAL DESIGN')+':');
  console.log(['who','of','d1','d7','d14','d30','d60','d90','d30 as a share of the row'].join('\t'));
  PANEL.forEach(r=>{
   const row=[1,7,14,30,60,90].map(d=>runs[k].alive[r.nm][d]);
   console.log([r.nm,r.w].concat(row).concat([(100*row[3]/r.w).toFixed(1)+' percent']).join('\t'));});});
 console.log('\nthe move, per ICP, in people of that row and in points of that row:');
 console.log(['who','of','d30 baseline','d30 final','people','points of the row','points of 1000'].join('\t'));
 PANEL.forEach(r=>{
  const a=runs.built.alive[r.nm][30], b=runs.final.alive[r.nm][30];
  console.log([r.nm,r.w,a,b,(b-a>=0?'+':'')+(b-a),
   ((b-a)/r.w*100>=0?'+':'')+((b-a)/r.w*100).toFixed(1),
   ((b-a)/10>=0?'+':'')+((b-a)/10).toFixed(1)].join('\t'));});

 console.log('\n============================================================');
 console.log('D. ABLATION. The final design with exactly one thing removed.');
 console.log('============================================================');
 console.log(['removed','d7','d30','d90','points of 1000 lost at d30'].join('\t'));
 const rows=ABL.map(k=>({k,d7:runs[k].total[7],d30:runs[k].total[30],d90:runs[k].total[90],
  l:(runs.final.total[30]-runs[k].total[30])/10}));
 rows.sort((a,b)=>b.l-a.l);
 console.log(['nothing removed, FINAL','\t'+runs.final.total[7],runs.final.total[30],runs.final.total[90],'0.0'].join('\t'));
 rows.forEach(r=>console.log([r.k,r.d7,r.d30,r.d90,r.l.toFixed(1)].join('\t')));

 console.log('\n============================================================');
 console.log('E. WHAT THE MODEL CAN SAY ABOUT AN EXIT. Of 1000.');
 console.log('============================================================');
 ['built','final'].forEach(k=>{
  console.log('\n'+k+':');
  Object.entries(runs[k].exits).sort((a,b)=>b[1]-a[1])
   .forEach(([t,v])=>console.log('  '+v+'\t'+t));});

 console.log('\n============================================================');
 console.log('F. THE COIN. Karma read as the name for patterns a person earned.');
 console.log('============================================================');
 console.log('earn rates, in patterns: a ritual done '+EARN.ritual+', a journal entry that');
 console.log('produced an imprint '+EARN.journal+', a mark '+EARN.mark+', an award '+EARN.award
  +', a season finished '+EARN.season+'.');
 const wk=7*(EARN.ritual+EARN.journal)+EARN.season;
 console.log('closed form, somebody who runs the whole loop every day: '+wk+' patterns a week');
 console.log('  against the free allowance of 10 a week, which banks. So '+(10+wk)
  +' a week, '+Math.round((10+wk)*52/12)+' a month, against tier one at 400 a month,');
 console.log('  which is '+(100*((10+wk)*52/12)/400).toFixed(0)+' percent of the bottom paid rung.');
 const tw=2*(EARN.ritual+EARN.journal);
 console.log('somebody who runs it twice a week: '+tw+' patterns a week earned, '+(10+tw)
  +' with the allowance, so a run at the cap of '+FULLRUN+' every '
  +(FULLRUN/(10+tw)).toFixed(1)+' weeks.');
 console.log('  all sixteen marks at '+EARN.mark+' is '+(16*EARN.mark)+' patterns, which is '
  +(100*16*EARN.mark/400).toFixed(0)+' percent of one tier one month handed to somebody');
 console.log('  who never pays. That is either the second half of the gift or the rate is wrong.');
 const K=runs.final.karma.slice().sort((a,b)=>a-b);
 const q=f=>K[Math.floor(f*(K.length-1))];
 console.log('\nmeasured over the simulated 90 days, all 1000 including everybody who left:');
 console.log('  patterns earned: median '+q(0.5)+', 75th '+q(0.75)+', 90th '+q(0.9)+', max '+K[K.length-1]);
 const SK=runs.final.survKarma.slice().sort((a,b)=>a-b);
 if(SK.length)console.log('  among the '+SK.length+' still active at day 90: median '
  +SK[Math.floor(SK.length/2)]+', max '+SK[SK.length-1]);
 const F=runs.final.firstRun.slice().sort((a,b)=>a-b), G=runs.final.fullRun.slice().sort((a,b)=>a-b);
 console.log('  afforded the floor run of '+RUNCOST+' patterns: '+pct(F.length,1000)
  +', median on day '+(F.length?F[Math.floor(F.length/2)]:'never'));
 console.log('  afforded a run at the cap, '+FULLRUN+': '+pct(G.length,1000)
  +', median on day '+(G.length?G[Math.floor(G.length/2)]:'never'));

 console.log('\n============================================================');
 console.log('G. SENSITIVITY on every coefficient that is mine, and the pessimistic floor.');
 console.log('============================================================');
 sweep();
}

function sweep(){
 const b=()=>runSim('built').total[30]/10;
 const base=b();
 console.log('\nbaseline for every line below: '+base.toFixed(1)+' points of 1000 at day 30.');

 console.log('\nchainD. MINE, and it is a discount on a published d of 0.45:');
 [0,0.1125,0.225,0.3375,0.45].forEach(v=>{
  const r=runSim('final',{chainD:v});
  console.log('  d '+v.toFixed(4)+'\tfinal d30 '+r.total[30]+'\t'+(r.total[30]/10).toFixed(1)
   +' points\tdelta '+((r.total[30]/10-base)>=0?'+':'')+(r.total[30]/10-base).toFixed(1));});

 console.log('\npfloor, the sixty second floor. MINE and the largest of my guesses:');
 [0,0.11,0.22,0.28,0.35].forEach(v=>{
  const r=runSim('final',{pfloor:v});
  console.log('  p '+v.toFixed(2)+'\tfinal d30 '+r.total[30]+'\t'+(r.total[30]/10).toFixed(1)
   +' points\tdelta '+((r.total[30]/10-base)>=0?'+':'')+(r.total[30]/10-base).toFixed(1));});

 console.log('\nstake. MINE:');
 [1.0,1.075,1.15,1.225,1.30].forEach(v=>{
  const r=runSim('final',{stake:v});
  console.log('  OR '+v.toFixed(3)+'\tfinal d30 '+r.total[30]+'\tdelta '
   +((r.total[30]/10-base)>=0?'+':'')+(r.total[30]/10-base).toFixed(1));});

 console.log('\nbreak shock. MINE. The halving against a reset, people of 1000:');
 [0.10,0.175,0.25,0.325,0.40].forEach(s=>{
  const a=runSim('final',{shock:s}), z=runSim('reset to zero',{shock:s});
  console.log('  shock '+s.toFixed(3)+'\thalving d30 '+a.total[30]+'\treset d30 '+z.total[30]
   +'\tthe halving is worth '+((a.total[30]-z.total[30])/10).toFixed(1)+' points');});

 console.log('\ngoal gradient across a seven day season. MINE:');
 [1.0,1.175,1.35,1.5].forEach(g=>{
  const r=runSim('final',{grad:g});
  console.log('  gradient '+g.toFixed(3)+'\td30 '+r.total[30]+'\tdelta '
   +((r.total[30]/10-base)>=0?'+':'')+(r.total[30]/10-base).toFixed(1));});

 console.log('\nchoice load credit. MINE:');
 [0,0.01,0.02,0.04].forEach(l=>{
  const r=runSim('final',{load:l});
  console.log('  load '+l.toFixed(2)+'\td30 '+r.total[30]+'\tdelta '
   +((r.total[30]/10-base)>=0?'+':'')+(r.total[30]/10-base).toFixed(1));});

 console.log('\nassertHarm. MINE, and it prices a REFUSED option rather than a built one:');
 [1.0,0.9,0.8,0.7].forEach(h=>{
  const r=runSim('REFUSED affirmation asserted',{harm:h});
  console.log('  OR '+h.toFixed(2)+'\td30 '+r.total[30]+'\tagainst the tested affirmation at '
   +runSim('final').total[30]);});

 console.log('\nTHE PESSIMISTIC FLOOR. Every coefficient of mine at its worst end at once.');
 const worst={chainD:0, pfloor:0, stake:1.0, grad:1.0, load:0, shock:0.40};
 const pf=runSim('final',worst), pb=runSim('built',worst);
 console.log('  baseline at the pessimistic end '+(pb.total[30]/10).toFixed(1)+' points, final '
  +(pf.total[30]/10).toFixed(1)+' points, delta '
  +((pf.total[30]-pb.total[30])/10>=0?'+':'')+((pf.total[30]-pb.total[30])/10).toFixed(1)+' points.');
 console.log('  At that end the design keeps only what is MEASURED: the content chain\'s');
 console.log('  throughput and the four fixes already built. Nothing of mine survives it.');

 console.log('\nseed. Five seeds, day 30 of 1000, baseline and final:');
 [20260920,11,222,3333,44444].forEach(sd=>{
  const a=runSim('built',{seed:sd}), z=runSim('final',{seed:sd});
  console.log('  seed '+String(sd).padEnd(9)+'baseline '+a.total[30]+'\tfinal '+z.total[30]
   +'\tdelta '+((z.total[30]-a.total[30])/10).toFixed(1)+' points');});}

console.log('\nSOURCES USED BY THE MODEL');
Object.entries(SRC).forEach(([k,v])=>console.log('  '+k+' = '+(typeof v.v==='number'?v.v.toFixed(3):v.v)+'\n    '+v.s));
const arg=process.argv[2]||'';
console.log('\nloopsim. 1000 people, 90 days, seed 20260920.');
console.log('THE BOTTOM LINE: percentage points of the weighted 1000 still active at day 30.');
if(arg==='--sweep'){sweep();}
else if(arg==='--chain'){if(!validate())process.exit(1); chainReport();}
else if(arg==='--validate'){process.exit(validate()?0:1);}
else{ if(!validate()){console.log('\nvalidation failed. report suppressed.');process.exit(1);} report(); }
