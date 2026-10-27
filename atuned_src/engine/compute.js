
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

   THE RECORD ASKED IS THE ONE THE LAWS IN S CAME FROM, NOT CURP. The unset
   marks and the seeds are written by loadProfile and loadP together with
   LAW_REC, so they belong to that record, and lawWork below already reads
   LAW_REC for exactly this reason. This asked CURP, and the front door loads
   a profile into S without making it CURP. Measured on the IK audit, 27
   September: with a record current whose laws were all answered at 9,
   read() of a blank profile returned CQ 60.0, 21 answered, 21 measured, the
   word Even and unread false, which is the seed 6 counted as twenty one
   answers the blank never gave. A profile with three laws answered at 2 read
   54.3 where its own laws sum to 2.9. Every route in the app that moves CURP
   was read for this (boot, delete, import, the intake switcher, loadP and
   toYou) and each loads the same record into S, so LAW_REC is CURP there and
   nothing in the app changes. Only a read of a profile that is not current
   does.
   ============================================================ */
function lawRec(){return ((typeof LAW_REC!=='undefined')&&LAW_REC)||CURP;}
function lawIn(nm){
 var p=lawRec();
 if(p&&p.laws&&p.laws[nm]!=null)return true;
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
/* CQ on its own, for the callers that need it without the whole reading.
   open is what an unanswered law counts, and every caller but cqSpan passes
   none, so it is the 0 the ruling gives it. cqSpan asks what the figure
   would be if every open law landed at ten, through this same sum, so the
   two ends of the range are the engine's arithmetic and never a copy of it. */
function cqSum(open){return SINAMES.reduce((a,l)=>a+(lawIn(l)?lawNow(l):(open||0)),0)/210*100;}
/* THE SEESAW, AT MODULE LEVEL so exCeiling can read it too. Will can only
   push the tipping point up from 5 toward 6, never down: moving it the
   other way breaks the rule that "paralysed" pulls at least a hundred times
   harder than "a little tense" at every level of will.
   ONE CURVE, NOT TWO. This is leverPull moved right by w and divided by its
   own value at 10, so 10 still pulls 1. It was a second copy of the bell,
   free to drift from the fitted one with nothing tying them. leverPull keeps
   its body, because engine/pct.js cites it word for word. Will has no
   measurement anywhere in this engine yet, so every caller passes 0, and at
   0 this is leverPull to the bit: v minus 0 is v, and leverPull(10) is
   exactly 1. tests/engine.js 36b holds the bit. */
function leverPullWill(v,w){return leverPull(v-w)/leverPull(10-w);}
/* ============================================================
   THE SEVEN CHAKRA WEIGHTS. weight is DQ's own rule, held per seat instead
   of over the whole body: the seat's addresses' SQ summed, over ten times
   how many addresses it has, so it reads 0 to 1 the same way DQ reads 0 to
   100. over is the same sum read through jq, the overshoot. open is 1 minus
   weight. pull is the seat's own share of PULL, what the torus reads.

   ig IS HONEST, UNLIKE bandIg. bandIg seeds an unanswered law to 6 so the sq
   relief and the Ig/It readouts always have a number, and that seeding is
   correct for them. It is wrong for anything shown as a position, because a
   seat nobody has answered for would still print a confident place on the
   Compass and swell the torus on the strength of a guess nobody gave. So
   seatRows takes the mean of lawNow over only the laws this seat has
   answered, and null when it has none. Null is an answer, not a zero. */
function seatRows(){
 return BANDS.map(function(b){
  var g=W.filter(function(n){return n.b===b;});
  var weight=g.length?g.reduce(function(a,n){return a+n.sq;},0)/(10*g.length):0;
  var over=g.length?g.reduce(function(a,n){return a+n.jq;},0)/(10*g.length):0;
  var pull=g.length?g.reduce(function(a,n){return a+leverPullWill(n.sq,0);},0)/g.length:0;
  var laws=SI.filter(function(l){return l.b===b&&lawIn(l.nm);});
  var ig=laws.length?laws.reduce(function(a,l){return a+lawNow(l.nm);},0)/laws.length/10:null;
  return {seat:b, n:g.length, weight:weight, over:over,
   open:clamp(1-weight,0,1), pull:pull, ig:ig};});}
/* ============================================================
   WHERE THE FINISHED CQ CAN STILL LAND, read off what is unanswered.

   The core drill said "The reading swings between lo and hi. The figure is
   the middle of that range" off cqRange (ui/personas.js), which is a band
   drawn round the figure alone and knows nothing about how many laws are in.
   Measured at e9ca1ae: with 1 law answered at 10 the drill said CQ swings
   between 0 and 18 and that the figure was the middle, where the middle of
   that was 8.9 against a CQ of 5 and the finished figure can land anywhere
   from 5 to 100.

   lo is the figure with every open law at its lowest, which is the figure
   now, because an open law counts nothing. hi is every open law at ten. When
   every law is in the two are one number. enough is false while most laws
   are still open (fewer than half answered), and then the drill says there
   are not enough answers to give a range at all, because a range that covers
   most of the scale says nothing a person can use.
   ============================================================ */
function cqSpan(){
 var of=SINAMES.length, answered=SINAMES.filter(lawIn).length;
 return {lo:cqSum(), hi:cqSum(10), answered:answered, of:of,
  complete:answered===of, enough:answered*2>=of};}
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
 /* show only on a worked example, engine/showonly.js */
 if(showRefuse('release',p)){out.cq1=out.cq0;out.refused='example';return out;}
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
function lawAnswered(p,nm){if(showRefuse('intake',p))return false;
 if(p&&p.work&&p.work[nm])delete p.work[nm]; return true;}
/* ONE ADDRESS'S SHARE OF THE WRITE, and the only copy of it. It sat inline in
   relCoolDown, and the live shadow row below has to run the same arithmetic
   ahead of the commit. Moved here from ui/release.js in round QD, body
   unchanged, because a worked example's history (engine/exdepth.js) replays
   releases with no card and must run this and not a second copy of it. Two copies of it would be two answers to "what does
   this run do", and the row would count down to a number the run then did not
   land on. w0 is passed in because relCoolDown reads every weight before the
   first write moves anything, and the projection has to read them the same
   way. */
function relWrite(q,n,w0){
 /* show only on a worked example, engine/showonly.js */
 if(showRefuse('release'))return {d:0,w1:w0,refused:'example'};
 var d=-Math.round(w0*0.21+2);
 var w1=Math.max(0,w0+d);
 var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
 S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
 /* release empties the address, replace fills it. the second half is not optional. */
 S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
 return {d:d,w1:w1};}
/* THE QUEUE THE RELEASE BUTTON TAKES, the heaviest addresses holding
   something: at or over the line at 4 first, and when nothing is that heavy,
   whatever is carrying at all. Moved out of the button's handler in
   ui/personas.js in round QD, the rule unchanged, so the worked examples'
   history picks its addresses the way a person pressing Release does. Only
   addresses with a fetter, which is the only kind relPick keeps. */
function relQueueOf(max){
 var by=function(a,b){return b.sq-a.sq;};
 var hot=W.filter(function(n){return n.cf&&n.sq>=4;}).sort(by);
 var q=hot.length?hot:W.filter(function(n){return n.cf&&n.sq>0;}).sort(by);
 return q.slice(0,max>0?max:8);}

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
  /* THE NAMED ADDRESS CARRIES MORE THAN ITS SHARE, 26 October. S.addr is
     engine/sniff.js's applyStoryAddr, additive on top of the fetter spread
     below it, never in place of it: an address nobody's words ever named
     reads exactly as it did before this line existed. One the words did
     name reads at least that much heavier, whatever its own susceptibility
     would otherwise have given it. */
  const base = S.charge[n.cf]+(S.addr[n.i]||0);
  n.held = n.cf?clamp(base*n.susc*(1-relief*0.42),0,10):0;
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
 /* ONE SABOTEUR, ONE ENTRY. SAB33's range match and the library's own fixed
    address groups can name the same saboteur from two different tests, eg
    Micromanager matches both a fear/anger RANGE and its own three addresses.
    Named twice, it pairs with itself into "Micromanager + Micromanager"
    below. The stronger of the two readings wins; the weaker is dropped, not
    kept as a second voice.

    BY IDENTITY, NOT BY SPELLING, 22 October. The merge keyed on s.nm, so it
    only caught a saboteur both tables spelled the same way. The owner's
    rename of S02 on 18 October reached SAB33 and not the library, and from
    then one saboteur printed as two, Micromanager off the range and
    Controller off its addresses, each in its own family, and the merge could
    not see it because the spellings differed. The rename is finished in every
    table now, and the merge keys on KB_KEY, the identity SABDEF and SABCARD
    already use, so a future spelling drift still makes one entry.
    tests/engine.js, ND, holds both halves.

    AND ONE FAMILY. The range route took its family from FAM_OF, the family of
    its first charge, and the address route from the library row. Where the
    two differ, the family, and so the complex the saboteur could join,
    flipped with whichever reading was heavier. A saboteur with a library row
    now takes that row's family from either route, through SAB_LIB_BY in
    core.js. FAM_OF still answers for a range match with no library row. */
 const sabByNm={};
 const pushSab=function(s){
  const id=KB_KEY(s.nm), ex=sabByNm[id];
  if(ex){if(s.w<=ex.w)return; sabs[sabs.indexOf(ex)]=s;sabByNm[id]=s;return;}
  sabByNm[id]=s;sabs.push(s);};
 /* SAB33: 33 named saboteurs matched on charge RANGES. */
 /* anticipation is spelled out because SAB33 spells it out: a row led by it
    fell through this map to Collapse. No row leads with it today. */
 const SAB_FET={fear:'Fear',anger:'Anger',shame:'Shame',disgust:'Disgust',apathy:'Apathy',
  shock:'Shock',sadness:'Sad',surprise:'Surprise',anticipation:'Anticipation',anxiety:'Anticipation'};
 sab33Detect().forEach(function(d){
  /* THE SEAT'S ADDRESSES THAT CARRY THE SABOTEUR'S OWN CHARGES, P1-6 of the
     inference audit, 23 October. This took any address at the seat at 3 or
     more, whatever it carried, so a fear row was confirmed by apathy load
     and drawn there: measured on 77928172, 44 per cent of this route's names
     were placed only on addresses carrying none of their own charges. The
     address route's rule 2 already says an address must carry one of the
     row's own charges, and this route now keeps it too. */
  const ownFet=d.charges.map(c=>SAB_FET[c]);
  const parts=W.filter(n=>n.b===d.band&&n.sq>=3&&ownFet.indexOf(n.cf)>=0).sort((a,b)=>b.sq-a.sq).slice(0,4);
  if(!parts.length)return;
  const key=SAB_FET[d.charges[0]];
  const own=SAB_LIB_BY[KB_KEY(d.nm)];
  pushSab({kind:'sab',nm:d.nm,hcx:own?own.hcx:(FAM_OF[key]||'Collapse'),named:true,
   score:d.score,exact:d.exact,charges:d.charges,auth:SABAUTH[d.nm]||null,
   parts,w:d.w,ang:meanAng(parts.map(n=>n.ang))});});
 /* THE ADDRESS ROUTE ASKS THE BAND, 22 October. A library row was named when
    its three addresses averaged 3.7, whatever the saboteur's own bands said.
    SNIFFER_SPEC section 3, which the owner rules is canon: "A saboteur is a
    configuration of fetters at specific intensities, not a thing. Break the
    co-mingling and the saboteur is gone." Measured on the worked examples,
    19 of the route's 34 names were saboteurs whose own configuration was off
    the band ramp entirely, and the rows nodes.js added on 22 October add 38
    more without this check. So a row with a SAB33 row is named here only
    while sabFetters, the ramp canon.js already carries for the sniffer, is
    above zero on the exact charge. The ramp is lenient on purpose: it only
    reaches zero two points under a band and three points over it, the
    stretch where the canon says a saboteur is forming or fading. Inside its
    own band nothing changes: the sweep named every row inside its band
    exactly as often with this as without it. An inferred cluster has no band
    and is not asked. The
    overshot reading below is the opposite installed past 6, not the held
    configuration, so it is not asked either. */
 const sabL=sabLevels(true);
 const formed=function(s){const row=s.unnamed?null:SAB33_BY[KB_KEY(s.nm)];
  return !row||sabFetters(row[1],sabL)>0;};
 ALL_SAB.forEach(s=>{const parts=s.nids.map(i=>BY[i]).filter(Boolean);
  const w=parts.reduce((a,n)=>a+n.sq,0)/parts.length;
  if(w>=3.7&&formed(s))pushSab({kind:'sab',nm:s.nm,hcx:s.hcx,unnamed:!!s.unnamed,parts,w,
   auth:SABAUTH[s.nm]||null,ang:meanAng(parts.map(n=>n.ang))});
  /* the same cluster, overshot. a voice that will not stop rather than one that shuts. */
  const j=parts.reduce((a,n)=>a+n.jq,0)/parts.length;
  if(j>=3.7)pushSab({kind:'sab',nm:s.nm+' overshot',hcx:FAM_POLE[s.hcx]||s.hcx,
   over:true,unnamed:!!s.unnamed,parts,w:j,ang:meanAng(parts.map(n=>n.ang))});});
 sabs.sort((a,b)=>b.w-a.w);

 const cxs=[];
 /* d is the line a person is shown and sub is the clinical correspondence,
    which is internal. Both are carried so the codex keeps its mapping and the
    card has something true to print that is not a diagnosis. */
 const FAMS=HCX_LIB.map(h=>({nm:h.nm,d:h.d,sub:h.sub})).concat(
  HCX_LIB.map(h=>({nm:FAM_POLE[h.nm],d:'the fix for '+h.nm.toLowerCase()
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
 /* the super complex's own gate, named once so the named one below keeps it */
 const SUP_W=5.6;
 for(let i=0;i+1<hys.length;i+=2){const parts=hys.slice(i,i+2),w=(parts[0].w+parts[1].w)/2;
  if(w>=SUP_W)sups.push({kind:'sup',nm:parts[0].nm+' / '+parts[1].nm,parts,w,
   ang:meanAng(parts.map(p=>p.ang))});}
 /* THE ONE NAMED SUPER COMPLEX, ruled 26 October: Psychopathy is the
    Grandiosity hyper complex and the Predatory one together, "a very
    particular archetype", and not any two hyper complexes that happen to sit
    next to each other. The pairing above takes whatever is adjacent in
    weight, so whether it pairs these two is a coincidence of rank, and this
    asks for the two families by name, wherever they rank. It is never pushed
    into sups: that would move dist, the mask and every count of the rung for
    a field the generic rule did not pair, and conflate two mechanics.

    The same weight gate as the rung it is said to sit on. Two hyper
    complexes under SUP_W are not a super complex anywhere in this engine,
    and a false Psychopathy costs more than a missed one, so the named one is
    held to the generic bar and never to a lower one. An overshoot family is
    not its family: Grandiosity overshot is a different hyper complex.

    Same shape as a sup, heaviest first as the pairing above orders its
    parts, so where both rules pair the two, the names agree; inSups says
    whether they did. The pair is read off the DESCENT entry, never typed. */
 const psyD=DESCENT.filter(d=>d.nm==='Psychopathy')[0]||null;
 const psyParts=psyD&&psyD.pair?hys.filter(h=>!h.over&&psyD.pair.indexOf(h.nm)>=0):[];
 const psyW=psyParts.length===2?(psyParts[0].w+psyParts[1].w)/2:0;
 const psychopathy=(psyParts.length===2&&psyW>=SUP_W)
  ?{kind:'sup',nm:psyParts[0].nm+' / '+psyParts[1].nm,named:psyD.nm,parts:psyParts,w:psyW,
    ang:meanAng(psyParts.map(p=>p.ang)),
    inSups:sups.some(s=>s.parts.indexOf(psyParts[0])>=0&&s.parts.indexOf(psyParts[1])>=0)}
  :null;
 /* the five masks a reading is taken on. Professional is hidden, round NE. */
 const maskRing=MASKS_READ.map(m=>{
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
    Resistance, Rz, is still computed and returned, and it divides nothing:
    the owner ruled CQ is the 21 laws and nothing else. Rz is the only place
    the six gates' multiplier lands, and no surface reads it, which
    engine/verp.js says the same way from its side. */
 const _vf=verpFactor();
 const Rz=Math.max(1,(1+DQ*0.05)*_vf);
 /* ============================================================
    CQ, THE 21 LAWS SUMMED OVER 210. Ruled 25 September, fitted by the ten
    thousand run simulation (AZ5, DECISIONS.md "The CQ model, fitted"),
    and ruled again, as a direct answer to the owner's own restated
    formula, 22 October: Coherence equals Integrity times Intention
    divided by Resistance runs for real as the shape of Expression below,
    not as a second division inside CQ itself. CQ stays pure.

    MODEL 3, BRIEFLY LIVE ON THIS BRANCH, IS THE SAME DEFECT AS THE
    FORMULA THE AZ5 SIMULATION ALREADY KILLED, MEASURED AGAIN TODAY.
    It set CQ to clamp(integrity*It/Rz), It being the band mean of the
    same 21 laws read a second way. Measured on this exact branch: every
    law at 10 with axes at their 6 default read 48.7, not the 100 the
    all-tens invariant requires, and a release lowered CQ on 2,881 of
    10,000 random fields, where the pure sum lowers it on none. That is
    worse than the formula AY1 already measured and killed at 22 of
    10,000. Reverted; new data for Intention and Resistance does not
    make the same shape of division safe inside CQ.

    AN UNANSWERED LAW COUNTS 0 AGAINST A FIXED 210, so CQ fills from zero
    as the laws land and can only rise while a person is answering. "I
    don't want it to go from 100 down, because that's demoralizing." The
    mean of the laws answered so far, which the desktop runs, fell in
    every one of 10,000 simulated intakes; this rule fell in none of
    630,000 answers.

    The default 6 still sits in S.law for an unanswered law, because the
    band relief inside sq and the Ig/It readouts still need a number.
    It never enters CQ: lawIn() is what says whether a law was answered. */
 const answered=SINAMES.filter(lawIn).length;
 const complete=(answered===SINAMES.length);
 /* each law as answered, plus what releases at its seat have added since. See
    LIFT_R above. It is still a law score and nothing else. */
 const CQ=cqSum();
 /* LAWSQ, 27 October. His own reading: the 21 laws, on their shadow side,
    are one term that produces a shadow by construction, CQ's own complement.
    Not named SQ: SQ is already the 112 addresses' own array, below, load-
    bearing in PULL and Vitality, and a second thing by that name would be
    the exact defect CODE_ALIAS exists to prevent, two things sharing one
    word. lawSQ is read-only arithmetic, not a fit: `100-CQ`, always, by the
    same identity that makes 21 answers over 210 and their complement over
    210 sum to 100 every time. It stands beside DQ, never in place of it.
    DQ is what the 112 addresses measure a person is actually carrying;
    lawSQ is what their own law answers imply alone, nothing else counted.
    A real release that clears carried charge moves DQ and never lawSQ,
    proven by simulation before this landed: forcing DQ itself to equal
    this number made 2,000 of 2,000 real releases invisible, since CQ never
    reads an address. Gated the same way tier is: an incomplete intake
    would read a lawSQ building toward false certainty off answers that
    have not landed, the same shape of bug `unread` already exists to stop. */
 const lawSQ=complete?clamp(100-CQ,0,100):null;
 /* THE SEESAW. Expression is CQ times what the shadow leaves, and this is
    where Integrity times Intention divided by Resistance actually runs:
    Integrity is the plank (CQ itself), Intention and Resistance are the two
    ends. "Frames, gates, bends, shows." The bend is the same bell curve as
    before, Phi over the 112 SQ values, centred at 5, width 1.25, except the
    centre now moves with WILL: willpower can only push the tipping point
    up, from 5 toward 6, never down, because moving it down would break the
    rule that "paralysed" must pull at least a hundred times harder than "a
    little tense" at every level of will. WILL has no measurement anywhere
    in this engine yet, so it is 0 here, which makes this exactly the curve
    already shipped, to the digit. Nothing moves until Will is real; that is
    the correct behaviour, not a gap. */
 const WILL=0;
 const PULL=SQ.reduce((a,v)=>a+leverPullWill(v,WILL),0)/SQ.length;
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
 /* off the same record lawIn asks, for the same reason */
 const _lr=lawRec();
 const measured=SI.filter(function(l){return _lr&&_lr.laws&&_lr.laws[l.nm]!=null;}).length;
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
  sabs,cxs,hys,sups,psychopathy,maskRing,DQ,lawSQ,SQ,PULL,EX,Rz,vf:_vf,SQm,poleMean,JQ,excess,
  FAM_POLE,dist,Ig,It,seats:seatRows(),CQ,answered,complete,tier,unread,measured,under,benign,malig,X,Y,Z,radiance,aff:af,pi,si,dch,steer,
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
function exCeiling(){return cqSum()*(1-leverPullWill(0,0));}
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
   HOW MUCH OF THE INSTRUMENT HAS BEEN ANSWERED OR WRITTEN, and nothing about
   how high any of it reads.

   The Summary plate's early, partial or full word was read off accuracy().pct
   above, and that figure is a fit of how trustworthy the reading is, not a
   count of what was measured. Two of its terms read the answers themselves:
   exq is the expression fill, which is the laws' own mean at each band, and
   held counts addresses at 4 or more, which is how heavy the stories were. So
   it rose with how high the answers were. Measured at e9ca1ae (probe p4): all
   21 laws answered at 10 read 56.0, partial; all 21 answered at 1 read 39.8,
   early; no law and five heavy stories read 46.1, partial, above the person
   who had answered everything honestly low. And a blank read 20.8, of which
   10.8 was the default 6 sitting in every unanswered law.

   accuracy() stays as it is, because the stage's Accuracy ring and its drill
   print that fit and name its causes, and that is a different question. This
   answers the plate's question only, from counts:

     laws     the laws answered, lawIn's count, which is the reading's own
     entries  the stories written, every entry, whatever it read

   pct is 80 for the intake and 20 for the story, so the laws carry four
   fifths: they are the measurement, and a story is evidence for it. The story
   side is whole at ten entries, the ladder's own Ten stories rung
   (engine/ladder.js, "the field is being read from your own words"), so
   CS_STORY_N names the same ten and a story past it adds nothing here. The
   rung counts ten days with an entry since 16 October (L11) and this still
   counts entries: coverage asks how much evidence there is, and ten entries
   in one sitting are ten pieces of it, where the mark asks what was kept up.
   Neither side reads a value, so the same counts give the same figure whether
   every answer is 1 or 10, and one more answer or one more story can never
   lower it.
   ============================================================ */
const CS_LAWW=80, CS_STORYW=20, CS_STORY_N=10;
function accCover(r,prof){
 var P=prof||CURP, of=SINAMES.length;
 var laws=(r&&typeof r.answered==='number')?r.answered:SINAMES.filter(lawIn).length;
 var ents=(P&&P.story&&Array.isArray(P.story.entries))?P.story.entries.length:0;
 var pct=CS_LAWW*laws/of + CS_STORYW*Math.min(ents,CS_STORY_N)/CS_STORY_N;
 return {pct:pct, laws:laws, of:of, entries:ents, complete:laws>=of};}
/* THE WORD, ON THAT SCALE. The old lines, 45 and 70, were drawn on
   accuracy()'s mix, which starts at a floor of 10 and needs the field to be
   carrying to reach 70, so neither means anything here and both are redrawn
   from the two counts:

     full     every law answered, and only then. That is the one point the
              CQ figure stops moving (compute's complete), so the plate can
              never say full while the core drill still says the figure has
              room to move. The intake alone is 80 on this scale, so no
              number of stories reaches it without the laws.
     partial  40 or more, half the intake's 80: about half the laws with no
              story yet, or six of the 21 with the story side whole.
     early    anything entered short of that.
     ''       nothing answered and nothing written, which accWord has always
              printed as the dash. */
const CS_PARTIAL=CS_LAWW/2;
function accCoverWord(c){
 if(!c||!(c.pct>0))return '';
 return c.complete?'full':c.pct<CS_PARTIAL?'early':'partial';}

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
