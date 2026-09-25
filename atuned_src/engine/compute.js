
/* ============================================================
   COMPUTE. Everything downstream is a pure function of this.
   ============================================================ */
/* the Domain Matrix. the root domain a person runs makes them 1.3x more
   susceptible to its affine child fetters. that is the Distortion wiring.
   This was the first thing compute() did, and it was the only place n.susc
   was written. applyStory() reads n.susc to decide which addresses a story
   lands on, and the front door applies the story before compute() runs, so
   a story was attributed by whichever profile had been computed last. 944
   of 1560 profile pairs read differently by order. loadProfile() now runs
   this pass, so susceptibility always belongs to the profile being read. */
function suscAll(){
 const rootsIn=[...new Set(S.doms.map(d=>DOMAINS[d].r).concat(S.roots))];
 const aff=[...new Set(rootsIn.flatMap(rn=>AFFIN[rn]||[]))];
 W.forEach(n=>{
  const arc=Math.min(18,Math.floor(n.slot/(108/19)));
  const prox=aff.includes(n.cf)?1.3:1;
  n.susc=(0.40+0.60*DOMAIN[arc])*prox;});
 return aff;}
/* BALANCE. The nine child fetters split by the direction the body takes
   under them. Four discharge outward, five withdraw inward. That is the
   approach and withdrawal split, not a claim about anyone's character.
   The reading is the difference over the total, minus one to one, so an
   empty field reads zero rather than either pole. Sex at birth is stored
   and shown beside it; it does not enter the arithmetic. */
const OUTWARD=['Anger','Disgust','Anticipation','Surprise'];
const INWARD=['Fear','Shame','Sad','Apathy','Shock'];
function balance(){
 var o=0,i=0;
 OUTWARD.forEach(function(c){o+=S.charge[c]||0;});
 INWARD.forEach(function(c){i+=S.charge[c]||0;});
 /* Raw sums are not comparable: four axes discharge outward and five
    withdraw, so summing them biased every reading inward by a fifth. A
    simulation over 50,000 profiles put the split at 28 against 72 with no
    person in it. The means are what compare. */
 var om=o/OUTWARD.length, im=i/INWARD.length, t=om+im;
 /* And a field with nothing in it is not balanced, it is unread. Below a
    mean of 1 on both sides the strip says so rather than naming a pole. */
 return {out:o, in:i, outMean:om, inMean:im,
  read: (om>=1||im>=1),
  lean: t?(om-im)/t : 0};}
/* ============================================================
   WHETHER A LAW HAS BEEN ANSWERED. CQ sums the answered laws and counts the
   rest as 0, so it needs to know which is which, and S.law cannot say: an
   unanswered law holds the default 6 there, which is a plausible score.

   This is saveProfile's own test, so CQ counts exactly the laws a save would
   write as measured, and never one it would not. A law is in when the record
   holds it, or when it arrived measured, or when somebody has moved it off
   the seed it was given. A headless run that sets S.law with no profile
   loaded has nothing marked unset, so every law it set is in, which is what
   the simulation and the gates mean by setting it.
   ============================================================ */
function lawIn(nm){
 if(CURP&&CURP.laws&&CURP.laws[nm]!=null)return true;
 return !(LAW_UNSET[nm]&&S.law[nm]===LAW_SEED[nm]);}
/* Which arithmetic a stored reading came from. This is the second; the first
   never stamped its rows, so they read back as 0. snapshot() stamps it so two
   rows from two formulas are never compared as a move.

   The release lift below did not bump it, and that is deliberate. A row is
   stamped so a change of formula is never read as a move in the person. The
   lift starts at nothing on every record the day it ships and only grows from
   releases run after that, so a row before it and a row after it differ by
   work the person actually did, which is a move and is meant to read as one. */
const CQ_MODEL=2;

/* ============================================================
   A RELEASE MOVES THE LAWS AT ITS SEAT, A LITTLE. Ruled 25 September, after
   ship, correcting the team, who had read "CQ is the 21 laws" as "so a release
   can never touch it" and proved that as a hard rule:

     "I didn't say CQ doesn't move on a release. That wouldn't make sense. If
     a fetter is released, you may not see CQ move, but it may move 0.1 or
     0.05. I had about 15,000 patterns for my CQ. My CQ is about between 88
     and 92, plus or minus 3 points of accuracy. Those 15k releases raised my
     CQ."

   CQ is still the 21 laws over 210, and nothing else enters it. SQ and DQ are
   not folded in. What changed is what a law reads: a release closes a small
   share of the distance between each law at its seat and 10.

     law as CQ reads it = 10 - (10 - answer) x (1 - LIFT_R)^n

   n is the releases at that law's seat since the law was answered, and one
   release is one pattern of new ground: the meter's own unit, and the unit
   MARKERS already reads his fifteen thousand in. A rerun of ground already
   open is free and moves nothing, so the lift cannot be farmed, and it cannot
   outrun the ground there is: 200 patterns an address, 21,400 in the body.

   THE SEAT IS SI's OWN. Every law in SI is seated at a band, and compute()
   already reads that seating one way: a closed law relieves the charge at its
   own band. This is the same coupling read the other way, and every law at the
   seat takes the same step. No table maps a fetter to a law, so none is
   invented here.

   WHY THIS SHAPE, AND WHERE THE NUMBER COMES FROM. Fitted against his one
   data point, which is one anchor and not a curve (scratchpad lift/fit.js,
   reproduced by tests/engine.js 36e). His starting CQ is not known. The
   assumption is 50, his own "five is the average", with the 15,000 spread
   over the body the way the body is built. Two shapes were run at his scale:

     flat, a fixed step a release, capped at 10:
       from 30 lands 70.9, from 50 lands 90.0, from 70 lands 100.0
     this one, the step a share of the distance still left:
       from 30 lands 86.0, from 50 lands 90.0, from 70 lands 94.0

   A flat step lands where the person started plus a constant, so it fits him
   only if he happened to start at exactly 50, and anyone starting at 70 reads
   100 at about 14,000 releases, perfect integrity from releasing alone. This
   shape pulls every start toward the same place, so the unknown start barely
   matters: a start anywhere from 30 to 70 lands inside his 88 to 92, plus or
   minus 3. That is why it is this one.

   His other sentence is a check on it and was not fitted: a full run of 25
   patterns moves CQ 0.14 at 50, 0.11 at 60 and 0.055 at 80. A single pattern
   moves it 0.001 to 0.007, which no screen shows, which is his "you may not
   see CQ move". At 50 it takes about 180 releases to move a whole point.

   HOW WRONG THE NUMBER CAN BE. The rate each start would need to land 90:
   9.4e-4 from 30, 7.7e-4 from 50, 5.2e-4 from 70. Two significant figures is
   what one data point and an assumed start support, so two are written.
   Release alone can never reach 100: opening every pattern there is, from 50,
   reads 94.8. The last of it is the laws themselves moving, which is the
   person answering differently.

   A NEW ANSWER STARTS THE COUNT AGAIN. The count is kept with the answer it
   was earned against, and it counts only while the law still holds that
   answer. His own 88 to 92 is exactly this case: a reading taken after the
   work, which already contains it. Carrying the lift through a new answer
   would count his fifteen thousand twice. */
const LIFT_R=0.00077;
function lawLift(v,n){return n>0?10-(10-v)*Math.pow(1-LIFT_R,n):v;}
/* The releases a law has at its seat since it was answered, read off the
   record the laws in S were loaded from and nowhere else (LAW_REC, set with
   S.rec by loadProfile and loadP). Not CURP: the front door loads a profile
   into S without making it CURP, and a profile read there is its own only
   input. And checked against S.rec, the rule undo and the mirror already
   carry, so a field repointed without a load never wears another record's
   work. */
function lawWork(nm){
 var p=(typeof LAW_REC==='undefined')?null:LAW_REC;
 if(!p||!p.work)return 0;
 if(p.id&&S.rec!=null&&S.rec!==p.id)return 0;
 var w=p.work[nm];
 return (w&&w.on===S.law[nm]&&w.n>0)?w.n:0;}
/* a law as CQ reads it: the answer, and what the releases since have added */
function lawNow(nm){return lawLift(S.law[nm],lawWork(nm));}
/* CQ on its own, for the callers that need it without the whole reading */
function cqSum(){return SINAMES.reduce((a,l)=>a+(lawIn(l)?lawNow(l):0),0)/210*100;}
/* WHAT A RELEASE WRITES INTO THE LAWS. keys are the patterns of new ground the
   meter has just recorded, so a rerun passes none and moves nothing. Each key's
   address names a seat, and every answered law at that seat counts them. A law
   whose answer has changed since its count began starts again from the answer
   it holds now. A law not yet answered gets nothing: there is no reading to
   nudge, and CQ does not count it. p is the record the release was charged to,
   which relCoolDown guarantees is the one the laws in S came from. Returns
   what moved, by law, and CQ before and after as that record reads. */
function releaseWork(p,keys){
 var out={laws:{}, cq0:cqSum(), cq1:null, n:0};
 if(!p||!keys||!keys.length){out.cq1=out.cq0;return out;}
 if(!p.work||typeof p.work!=='object'||Array.isArray(p.work))p.work={};
 var bySeat={};
 keys.forEach(function(k){
  var n=BY[+String(k).split(':')[0]];
  if(n&&n.b){bySeat[n.b]=(bySeat[n.b]||0)+1; out.n++;}});
 SI.forEach(function(l){
  var u=bySeat[l.b]; if(!u||!lawIn(l.nm))return;
  var v=S.law[l.nm], w=p.work[l.nm];
  if(!w||w.on!==v)w=p.work[l.nm]={n:0,on:v};
  var before=lawLift(v,w.n); w.n+=u;
  out.laws[l.nm]={seat:l.b, u:u, n:w.n, from:before, to:lawLift(v,w.n)};});
 out.cq1=cqSum();
 return out;}
/* A LAW ANSWERED AGAIN IS A NEW READING, even when it lands on the same
   number. The count above would survive a same number answer, because it is
   keyed to the value; this is what the intake calls when a person changes an
   answer, so a new measurement always wins over the model's estimate. */
function lawAnswered(p,nm){if(p&&p.work&&p.work[nm])delete p.work[nm];}

/* ============================================================
   THE LEVER'S BELL, FITTED. The owner: "I'm a little tense is different than
   I'm paralyzed, it's orders of magnitude different ... so our bell curve
   becomes our multiplier." The pull at one address is the normal cumulative
   at its weight, centre LEVER_MU and width LEVER_SD, scaled so an address at
   10 pulls exactly 1.

   Fitted by the ten thousand run simulation (AZ5, scratchpad cq/cqsim.js),
   identical on two seeds. His words set the region: paralyzed (9) pulls at
   least 100 times a little tense (2), and the graded middle is at least as
   wide as the 4 to 6 he calls the range we travel. Inside it the data put
   the centre at 5 to 5.5; his "five is the average" decides 5, and 1.25 is
   the widest width at 5 that still clears 100 times (1.29 exact). Pull is
   0.008 at 2, 0.21 at 4, 0.50 at 5, 0.79 at 6, 0.95 at 7, 0.999 at 9: 122
   times from a little tense to paralyzed.

   The erf is Abramowitz and Stegun 7.1.26, error under 1.5e-7, and it is the
   same polynomial the simulation ran, so the worked people reproduce to the
   digit rather than to a tolerance. An address at 0 pulls 3.2e-5, not 0,
   because that is what the fitted curve says; it rounds away on every
   surface and it is not subtracted, because the simulation did not. ============ */
const LEVER_MU=5, LEVER_SD=1.25;
function leverPhi(z){
 const t=1/(1+0.3275911*Math.abs(z/Math.SQRT2)), x=z/Math.SQRT2;
 const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
 return 0.5*(1+(x>=0?y:-y));}
const LEVER_TOP=leverPhi((10-LEVER_MU)/LEVER_SD);
function leverPull(w){return leverPhi((w-LEVER_MU)/LEVER_SD)/LEVER_TOP;}

function compute(){
 const root=DOMAINS[S.dom].r;
 const rootsIn=[...new Set(S.doms.map(d=>DOMAINS[d].r).concat(S.roots))];
 const aff=suscAll();
 let loaded=[],sum=0;
 W.forEach(n=>{
  /* a closed law at this band lets charge sit deeper. integrity is local. */
  const relief=bandIg(n.b)/10;
  n.held = n.cf?clamp(S.charge[n.cf]*n.susc*(1-relief*0.42),0,10):0;
  /* the coherent opposite installed at the same address. an address with the
     opposite in does not merely read zero, it conducts. */
  n.rep  = n.cf?clamp((S.replace[n.cf]||0)*(0.72+0.28*relief),0,10):0;
  /* the binary. SQ is what is left of the held state after the pole is in. */
  n.sq   = clamp(n.held - n.rep*0.86,0,10);
  n.pole = clamp(n.rep - n.held,0,10);
  /* JOUISSANCE. the opposite overshot past the point where it serves.
     overshoot begins at 6. being loaded as well does not protect you from it;
     carrying the fetter and overdoing the cure is the commonest split there is. */
  n.jq   = clamp(n.rep - 6,0,4)/4*10;
  n.open = clamp(1-n.sq/10 + n.pole/26,0,1.18);
  if(n.sq>=4){loaded.push(n);sum+=n.sq;}});
 /* THE FOUR OUTSIDE THE BODY ARE SQ TOO. Ruled 25 September: "the four
    addresses outside the body do count as SQ because they're related to
    nerves within the body". They were forced to 0 here, so 4 of the 112 the
    product states could never carry anything and DQ summed over 108 while
    dividing by the 112. Each takes the mean of the seat it extends, the two
    above from the Crown and the two below from the Root, which is his torus.
    The simulation measured the heaviest of the seat as the alternative and
    could not tell the two apart (retest 0.06 of a point), so the simpler rule
    stands. They hold no charge of their own, so held, rep, pole and jq stay 0
    and nothing in the saboteur chain reads them. */
 const seatMean={Crown:0,Root:0};
 ['Crown','Root'].forEach(b=>{const g=W.filter(n=>n.b===b);
  seatMean[b]=g.reduce((a,n)=>a+n.sq,0)/g.length;});
 FIELD.forEach(n=>{n.sq=n.b==='Field-Above'?seatMean.Crown:seatMean.Root;
  n.open=clamp(1-n.sq/10,0,1);n.held=0;n.rep=0;n.pole=0;n.jq=0;});
 const SQm=loaded.length?sum/loaded.length:0;

 const sabs=[];
 /* SAB33: 33 named saboteurs matched on charge RANGES. */
 sab33Detect().forEach(function(d){
  const parts=W.filter(n=>n.b===d.band&&n.sq>=3).sort((a,b)=>b.sq-a.sq).slice(0,4);
  if(!parts.length)return;
  const key=d.charges[0]==='anxiety'?'Anticipation':
   ({fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',
     shock:'Shock',sadness:'Sad',surprise:'Surprise'})[d.charges[0]];
  sabs.push({kind:'sab',nm:d.nm,hcx:FAM_OF[key]||'Collapse',named:true,
   score:d.score,exact:d.exact,charges:d.charges,auth:SABAUTH[d.nm]||null,
   parts,w:d.w,ang:meanAng(parts.map(n=>n.ang))});});
 ALL_SAB.forEach(s=>{const parts=s.nids.map(i=>BY[i]).filter(Boolean);
  const w=parts.reduce((a,n)=>a+n.sq,0)/parts.length;
  if(w>=3.7)sabs.push({kind:'sab',nm:s.nm,hcx:s.hcx,unnamed:!!s.unnamed,parts,w,
   auth:SABAUTH[s.nm]||null,ang:meanAng(parts.map(n=>n.ang))});
  /* the same cluster, overshot. a voice that will not stop rather than one that shuts. */
  const j=parts.reduce((a,n)=>a+n.jq,0)/parts.length;
  if(j>=3.7)sabs.push({kind:'sab',nm:s.nm+' overshot',hcx:FAM_POLE[s.hcx]||s.hcx,
   over:true,unnamed:!!s.unnamed,parts,w:j,ang:meanAng(parts.map(n=>n.ang))});});
 sabs.sort((a,b)=>b.w-a.w);

 const cxs=[];
 /* d is the line a person is shown and sub is the clinical correspondence,
    which is internal. Both are carried so the codex keeps its mapping and the
    card has something true to print that is not a diagnosis. */
 const FAMS=HCX_LIB.map(h=>({nm:h.nm,d:h.d,sub:h.sub})).concat(
  HCX_LIB.map(h=>({nm:FAM_POLE[h.nm],d:'the cure for '+h.nm.toLowerCase()
    +', done past the point where it helps',sub:'overshoot of '+h.nm,over:true})));
 FAMS.forEach(h=>{const fam=sabs.filter(s=>s.hcx===h.nm);
  for(let i=0;i+1<fam.length;i+=2){const parts=fam.slice(i,i+2);
   cxs.push({kind:'cx',nm:parts[0].nm+' + '+parts[1].nm,hcx:h.nm,over:!!h.over,parts,
    w:(parts[0].w+parts[1].w)/2,ang:meanAng(parts.map(p=>p.ang))});}});
 /* a family compounds into a hyper on two complexes, or on one complex that is
    already running hard. a two-complex-only gate makes the top unreachable. */
 const hys=[];
 FAMS.forEach(h=>{const fam=cxs.filter(c=>c.hcx===h.nm);
  if(fam.length>=2 || (fam.length===1 && fam[0].w>=6.5))
   hys.push({kind:'hy',nm:h.nm,d:h.d,sub:h.sub,over:!!h.over,parts:fam,
    w:fam.reduce((a,p)=>a+p.w,0)/fam.length,ang:meanAng(fam.map(p=>p.ang))});});
 hys.sort((a,b)=>b.w-a.w);
 const sups=[];
 for(let i=0;i+1<hys.length;i+=2){const parts=hys.slice(i,i+2),w=(parts[0].w+parts[1].w)/2;
  if(w>=5.6)sups.push({kind:'sup',nm:parts[0].nm+' / '+parts[1].nm,parts,w,
   ang:meanAng(parts.map(p=>p.ang))});}
 /* the six masks, one per developmental era, lit by what sits under it. */
 const maskRing=MASKS.map(m=>{
  const seg=W.filter(n=>m.b.indexOf(n.b)>=0);
  return {nm:m.nm,bands:m.b,w:seg.reduce((a,n)=>a+n.sq,0)/seg.length,
   ang:meanAng(seg.map(n=>n.ang))};});

 const dist=clamp(sabs.length*.19+cxs.length*.55+hys.length*1.35+sups.length*2.4,0,10);
 /* installed poles feed integrity. CQ and SQ are the same coordinate system read
    from opposite ends, so clearing one end must raise the other. But only up to
    the point of excess: past that the pole costs, it does not pay. */
 const poleMean=W.reduce((a,n)=>a+n.pole,0)/108;
 const JQ=W.reduce((a,n)=>a+n.jq,0)/108;
 const excess=W.filter(n=>n.jq>=4);
 /* Ig and It no longer enter CQ. They are kept because the Awareness and
    Will readouts and the will against drag steer below still read them. */
 const Ig=clamp(SINAMES.reduce((a,l)=>a+S.law[l],0)/21 + poleMean*0.30 - JQ*0.42,0,10);
 const It=clamp(BANDS.reduce((a,b)=>a+bandIg(b),0)/7 + poleMean*0.22 - JQ*0.30,0,10);
 /* DQ, THE TOTAL SHADOW. "DQ is a total shadow. I don't know why you keep
    asking me that." The 112 addresses summed over 1120, so it sits on the
    same 0 to 100 as CQ. It was sq over ten summed over the addresses at 4 or
    more, which dropped everything under the line and the four outside the
    body and had no ceiling at all. Not 100 minus CQ: that was one of his two
    statements and he has settled it as this one.

    ONE SHADOW TOTAL, NOT TWO. Resistance, vitality and drag read the old sum
    and it would have been easy to keep it for them under another name. Then
    the vitality drill would print one shadow weight while computing off a
    different one. They read DQ, with their constants unchanged. Where the
    weight sits above the line the two totals are close, Gordon 55.2 then
    54.3. Where it is spread under the line DQ reads higher, Diane 3.5 then
    19.7, because it now counts what the old sum dropped, and vitality and
    drag feel that weight too, which is the reason for counting it. */
 const SQ=NODES.map(n=>n.sq);
 const DQ=SQ.reduce((a,v)=>a+v,0)/1120*100;
 /* THE SIX AXES multiply what every held pattern costs. Detachment is the
    cheapest gate at 0.60, attachment the most expensive at 1.35. No story
    means no gate evidence, so the factor is 1 and nothing changes.
    Resistance is still computed and reported, because the gates drill names
    it, but it divides nothing any more: the owner ruled CQ is the 21 laws and
    nothing else, and verpFactor stops multiplying anything in CQ with it. */
 const _vf=verpFactor();
 const Rz=Math.max(1,(1+DQ*0.05)*_vf);
 /* ============================================================
    CQ, THE 21 LAWS SUMMED OVER 210. Ruled 25 September, fitted by the ten
    thousand run simulation (AZ5, DECISIONS.md "The CQ model, fitted").

    This was clamp(It*Ig/Rz). Ig was the law mean and It was the band mean of
    the same 21 laws, so the laws were counted twice and CQ went as their
    square: every law at 5 read 25 where his ruling reads 50 (AY2). And both
    factors carried poleMean and JQ, so installing an opposite past 6 pushed
    JQ up and CQ down: a release lowered CQ in 22 of 10,000 random fields
    (AY1, measured at 9f4c7e5). Neither can happen now, because nothing but
    a law score is read.

    AN UNANSWERED LAW COUNTS 0 AGAINST A FIXED 210, so CQ fills from zero as
    the laws land and can only rise while a person is answering. "I don't
    want it to go from 100 down, because that's demoralizing." The mean of
    the laws answered so far, which the desktop runs, fell in every one of
    10,000 simulated intakes; this rule fell in none of 630,000 answers.

    The default 6 still sits in S.law for an unanswered law, because the
    band relief inside sq and the Ig readout need a number. It never enters
    CQ: lawIn() is what says whether a law was answered. */
 const answered=SINAMES.filter(lawIn).length;
 const complete=(answered===SINAMES.length);
 /* each law as answered, plus what releases at its seat have added since. See
    LIFT_R above. It is still a law score and nothing else. */
 const CQ=cqSum();
 /* THE LEVER. Expression is CQ times what the shadow leaves: "CQ 100 SQ 0
    ... one pulls down the other, it's a lever", and the pull is his bell,
    applied per address because "a little tense" and "paralyzed" are
    intensity at a place. PULL is the mean of leverPull over the 112. */
 const PULL=SQ.reduce((a,v)=>a+leverPull(v),0)/SQ.length;
 const EX=CQ*(1-PULL);
 /* One table. This was a literal copy of the thresholds and the names, and a
    previous commit claimed to have removed the duplicate after removing only
    the one in the renderer. A rename would have drifted silently between the
    engine and the definitions. canon.js loads before this file, which is what
    makes tierOf reachable here.

    AND THE WORD WAITS FOR ALL 21. A partial CQ is a person coming into view,
    not a reading: after seven laws it can be at most 33, so a tier word on it
    would call everybody on day one Incoherent or worse. Null until complete,
    and every surface that names a tier says what is still to answer
    instead. Whether the word should name CQ or expression is the owner's
    question 1 and is not decided here; it stays on CQ until he rules. */
 const tier=complete?tierOf(CQ).nm:null;
 /* UNREAD. With nothing held and no law measured the product used to print
    CQ 36 and the word Incoherent off the default 6 on all 21 laws, in the
    largest type on screen, to someone who had not typed a word. CQ reads 0
    there now, because no law is in, but a stranger is still unread rather
    than a person at zero, and every surface that names a reading checks
    this first. */
 const measured=SI.filter(function(l){return CURP&&CURP.laws&&CURP.laws[l.nm]!=null;}).length;
 /* BELOW THE LINE. An address counts as carrying at SQ 4. Under that the
    charge is real, a person entered it, and every surface reported nothing
    held. Setting all nine axes to 4 gave an identical reading to setting them
    to 0: CQ 92.2, DQ 0.0, nothing carrying. That is the instrument saying
    nothing about something. The threshold stays, because it is what the
    arithmetic is built on, but the fact that there is charge underneath it is
    now reportable instead of invisible. */
 const under=W.filter(function(n){return n.sq>0&&n.sq<4;}).length;
 /* AND UNREAD COUNTS IT, because unread is a claim that nothing was entered
    and not a claim that nothing crossed the display line. Measured with all
    nine axes at 3.9: 107 addresses carrying, DQ 0.0, unread true, so Summary
    showed the four doors and said nothing had been entered while the release
    control offered the same 107 addresses and spent eight patterns a press on
    them. One surface billing for a field another surface denies exists is the
    worst version of this, so under is counted here. The display line is
    unchanged: DQ still reads 0 and nothing is called held, which is true. */
 const unread=(loaded.length===0&&measured===0&&under===0);
 /* benign and malig were CQ restated: malig was (50 minus CQ) doubled, so a
    surface asking whether a field was malignant AND decoherent was asking one
    question twice and could never get a no from one and a yes from the other.
    The owner's model needs two independent axes, so there are two now.

    SHAPE. Where the firing stack points. Predatory and Grandiosity run at
    other people, and Mania is Collapse turned outward. The rest lands on the
    person carrying it. This is the axis the book calls malignancy, and its
    threshold is the book's: harm to others becoming instrumental.

    CONTROL. Whether the will is directing or the drag is. Organised against
    chaotic, which is the difference between the devil and the demon.

    benign and malig keep their old meaning and their old callers, because
    they are the coherence read and several surfaces already print them. They
    are just no longer pretending to be a second axis.

    NULL WHILE CQ IS STILL FILLING. A person with a story in and no law
    answered reads CQ 0, and malig off that is 100: the most malignant field
    the scale can name, for somebody who has only not done the intake yet. */
 const benign=complete?CQ>=50:null;
 const malig=complete?(benign?0:Math.round((50-CQ)/50*100)):null;
 const X=clamp((1-S.charge.Apathy/10)*.3+(1-clamp(DQ/14,0,1))*.7,0,1);
 const Y=clamp((It/10)*.6+(1-dist/10)*.4,0,1);
 const Z=clamp((Ig/10)*(1-SQm/10),0,1);
 const radiance=Math.sqrt(X*X+Y*Y+Z*Z)/Math.sqrt(3);
 const af=affinity();
 let pi=0;af.forEach((v,i)=>{if(v>af[pi])pi=i;});
 let si=(pi+1)%12;af.forEach((v,i)=>{if(i!==pi&&v>af[si])si=i;});
 let dch=CHARGES[0];CHARGES.forEach(c=>{if(S.charge[c]>S.charge[dch])dch=c;});
 const will=(Ig/10)*(It/10),drag=clamp(DQ/14,0,1)*1.6+dist/10;
 const steer=will>=drag?'forced':'withheld';
 const mask=sups[0]||hys[0]||cxs[0]||sabs[0]||null;
 let darkB=BANDS[0],darkV=-1;
 BANDS.forEach(b=>{const gp=W.filter(n=>n.b===b),v=gp.reduce((a,n)=>a+n.sq,0)/gp.length;
  if(v>darkV){darkV=v;darkB=b;}});
 let weakL=SI[0];SI.forEach(l=>{if(S.law[l.nm]<S.law[weakL.nm])weakL=l;});
 /* THE TWO REAL AXES. Shape is where what is running points. Control is how
    far it has compounded, which is what conditioning is, and not whether the
    will is winning: at low coherence the will always loses, so measuring it
    that way made the devil unreachable and put every adversarial field in the
    chaotic corner. */
 const chain=sabs.concat(cxs).concat(hys).concat(sups);
 const outward=outwardShare(chain);
 const organized=organisedShare(chain);
 /* Angel needs CQ at 71 or more, which a partial CQ must not be read for */
 const gov=quadrant(outward,organized,complete?CQ:null);
 /* CARRYING IS NOT THE SAME AS HELD, and the product had only the second word.
    `loaded` is every address at or above the line at sq 4, and it drives the
    arithmetic: DQ, resistance, the saboteur scan. That stays exactly as it is.

    But every action surface also read `loaded`, and an absolute cut at 4 on a
    quantity that is often spread thin means a person can carry real load at
    every address and be told nothing is carrying. Measured across the roster:
    Marcus carries 99 addresses with his heaviest at 2.51 and is told nothing
    is carrying while the same screen calls him Incoherent. Sofia carries 52,
    Angela 74. Three of the six ICPs. And it is also where the release curve
    ran out: after two runs James is still Severe at CQ 18.6 with 72 addresses
    carrying, and every release control refused him.

    So `carrying` is its own word for its own thing: every address holding
    anything at all, heaviest first. `heaviest` is the top of it. Nothing here
    divides, multiplies or feeds CQ. It is a sort of what the field already
    says, so the arithmetic core keeps its bodies, and the action surfaces get
    something true to point at. */
 const carrying=W.filter(n=>n.sq>0).sort((a,b)=>b.sq-a.sq);
 return {loaded,carrying,heaviest:carrying[0]||null,
  sabs,cxs,hys,sups,maskRing,DQ,SQ,PULL,EX,Rz,vf:_vf,SQm,poleMean,JQ,excess,
  FAM_POLE,dist,Ig,It,CQ,answered,complete,tier,unread,measured,under,benign,malig,X,Y,Z,radiance,aff:af,pi,si,dch,steer,
  outward,organized,gov,
  will,drag,mask,darkB,darkV,root,rootsIn,weakL,balance:balance()};
}

/* ============================================================
   THE CEILING ON RELEASE. What expression reads once every charge is gone,
   which is the most a release can ever achieve, and the gap to it.

   Why this exists. A release empties addresses. What it does to integrity is
   small: it lifts the laws at its seat by a share of what is left (LIFT_R,
   about 0.005 of CQ a pattern at 50), and the laws otherwise move only when a
   person answers them. The product never said so, and offered release as its
   core loop, so a person pulled a lever that was nearly spent.

   THIS WAS cqCeiling. CQ is the laws and nothing else, and the part of it a
   release moves is too slow for one run to show, so the ceiling is read on
   expression, which is what a release moves visibly: the shadow, and through
   the lever, expression. So the ceiling is expression with the shadow gone, at
   the laws as they stand now. The lift the next releases add to the laws is
   not in it, which makes the headroom a slight understatement and never an
   overstatement.

   It is computed rather than simulated. With charge at zero, held is zero at
   every address, sq is zero whatever is installed, the four outside take a
   seat mean of zero, and the pull is leverPull(0) at all 112. Nothing is
   mutated and nothing is guessed. */
function exCeiling(){return cqSum()*(1-leverPull(0));}
/* the gap a release still has in it, for the person about to run one */
function exHeadroom(exNow){return Math.max(0,exCeiling()-exNow);}

/* ============================================================
   ACCURACY. Rebuilt from a layer ablation across visible axes x law
   coverage x expression. Both an additive and a multiplicative
   evidence form were fitted; additive won, 5.68 mean absolute error
   against 7.28.

     accuracy = 10 + 43*(1 - e^(-held/13)) + 28*lawCoverage + 18*expression

   Signal SATURATES rather than rising linearly: the curve is steep to
   about eight held addresses and flat after. A profile with 21/21 laws
   measured and an empty field is not at chance, it runs near 60.
   ============================================================ */
var ACC_BASE=10, ACC_AXG=43, ACC_K=13, ACC_LAWG=28, ACC_EXPG=18;
/* the profile is an argument, not ambient state. it defaults to the live one so
   every call site reads the same, but the fit stays measurable on any profile
   without first making it current. */
function accuracy(r,prof){
 var P=prof||CURP;
 var meas=SI.filter(function(l){return P&&P.laws&&P.laws[l.nm]!=null;}).length;
 var cov=meas/21;
 var sc=P?iqScore(P):{};
 var ks=Object.keys(sc);
 var rel=ks.length?ks.filter(function(k){return sc[k].reliable;}).length/ks.length:0;
 var held=W.filter(function(n){return n.sq>=4;}).length;
 var inst=W.filter(function(n){return n.pole>=4;}).length;
 /* an installed pole is readable signal too: a cleared address still says something */
 var eff=held+inst*0.35;
 var sig=eff>0?(1-Math.exp(-eff/ACC_K)):0;
 var E=exprRead();
 var exq=clamp(E.reduce(function(a,x){return a+x.fill;},0)/E.length/10,0,1);
 var fams={};[].concat(r.hys,r.sups).forEach(function(o){fams[o.nm]=1;});
 var deg=0;
 [['Collapse','Self-erasure'],['Numbness','Dissociation']].forEach(function(p){
  if(fams[p[0]]&&fams[p[1]])deg++;});
 var pct=ACC_BASE + ACC_AXG*sig + ACC_LAWG*cov + ACC_EXPG*exq;
 pct=clamp(pct*(1-deg*0.10),8.3,99);
 /* the interval is the fit's own error plus what is missing */
 var band=5.7*0.5 + (1-cov)*6 + (1-sig)*8 + deg*4 + (1-rel)*1.2 + (1-exq)*3;
 return {pct:pct, band:band, exq:exq, sig:sig, cov:meas, rel:Math.round(rel*100), relN:rel,
  held:held, inst:inst, deg:deg, signal:Math.round(sig*100)};}

/* ============================================================
   THE CHILD PATTERN. WHICH READING THIS IS, AND WHY IT IS AN ASSUMPTION.

   Ruled by the owner that a child pattern is special and has to be
   highlighted and located. What was never ruled is which of three things the
   phrase means, and the engine carries all three, so the count is not a
   detail of the wording. Measured on the roster the gates already load, at
   the same line compute() loads an address at:

     a) one of the nine in CHILD.      blank 0, James 4, Ana 8, Gordon 9
     b) a pattern imprinted in childhood, which is what AGES is for.
                                       blank 0, and 0 on every profile in
                                       the roster, because the age ladder
                                       stores nothing: AGE_ANS is a module
                                       variable in the drill and no profile
                                       field exists to hold a finding. The
                                       ceiling is the sixteen year rows.
     c) a child in the address ladder, meaning an address carrying while its
        seat's primary is carrying too.
                                       blank 0, James 9, Ana 20, Gordon 90

   Nine against ninety is the whole feature, which is why it is his call and
   not mine. CHILD_READ is the assumption, it is 'axis', and it is the
   narrowest of the three that is defensible: the nine are named, computed
   and drawn already, and (b) cannot be built at all until a profile has
   somewhere to keep a finding, which is a schema change and his.

   AND THERE IS NO SECOND LINE ANYWHERE IN HERE. The line an address carries
   at is compute()'s own, so childFound takes the reading rather than
   re-testing sq against a 4 typed a second time. The first cut tested
   S.charge on the axis instead, which counted nine axes for James where four
   of them have an address at or above the line: an axis can carry 5 and land
   nothing, because susceptibility and band relief scale it down per address.
   A figure of nine beside a panel showing four is the defect this repository
   has been bitten by nine times, in a new place.
   ============================================================ */
const CHILD_READ='axis';
/* the parent of an address in the ladder: the first address in its band,
   which is the plexus the seat is named for. Root is the lumbar plexus,
   Heart is the cardiac plexus. Derived, so a reordering of NODES moves it. */
const SEATPRIM={};
BANDS.forEach(function(b){SEATPRIM[b]=W.filter(function(n){return n.b===b;})[0];});
function childFound(r){
 var held=(r&&r.loaded)||[], out=[], at={};
 if(CHILD_READ==='ladder'){
  var on={}; held.forEach(function(n){on[n.i]=1;});
  held.forEach(function(n){
   var par=SEATPRIM[n.b];
   if(!par||par.i===n.i||!on[par.i])return;
   out.push({ax:n.cf||n.b, seat:n.b, at:n, under:par});});
 } else {
  /* one address per axis: where that child emotion sits heaviest. An axis
     with nothing at or above the line has no location, so it is not found.
     Sorted so the panel reads heaviest first, the way the pills do. */
  var by={};
  held.forEach(function(n){
   if(!n.cf)return;
   if(!by[n.cf]||n.sq>by[n.cf].sq)by[n.cf]=n;});
  CHILD.forEach(function(c){
   var n=by[c.nm]; if(!n)return;
   out.push({ax:c.nm, opp:c.opp, seat:n.b, at:n,
    n:held.filter(function(x){return x.cf===c.nm;}).length});});
  out.sort(function(a,b){return b.at.sq-a.at.sq;});}
 out.forEach(function(k){at[k.at.i]=k;});
 return {read:CHILD_READ, found:out, at:at, n:out.length};}
