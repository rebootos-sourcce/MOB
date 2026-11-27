/* ============================================================
   proto/quotients/quotients.js  ·  THE FIVE QUOTIENTS, OFF THE REAL ENGINE.

   Nothing in this file invents a number and nothing in it types a constant the
   engine already holds. Every quantity is read off a function whose name is
   printed beside it on the page.

   WHAT IS NEW HERE AND WHAT IS NOT.

     CQ   is compute().CQ. It existed before this file and is untouched.
     IQ   is new arithmetic. It is built from n.open, which compute() already
          writes at every address, and from the aware against ignorant pair of
          the six gates, which verpScan already reads out of a story.
     EQ   is new arithmetic over n.rep and n.held, which compute() already
          writes. It reports the turn, not the emptying.
     AQ   is new arithmetic over p.history, which snapshot() already writes.
     PQ   is boundaryCount(), which avatar.js already computes. It is STATED
          rather than measured and it is labelled so everywhere it appears.

   THE ONE CONSTANT THAT IS NOT TYPED. n.open is clamped to a ceiling in
   compute.js. That ceiling is not copied here. It is measured off the engine at
   load by running one maximal field through compute() and reading the highest
   open back, so a change to the clamp moves this file with it instead of
   leaving it stale. Read the count off the run.
   ============================================================ */
(function(root,factory){
 if(typeof module!=='undefined'&&module.exports)module.exports=factory();
 else root.QUOT=factory();
})(typeof self!=='undefined'?self:this,function(){

/* KEYS ARE IDENTITY AND THEY DO NOT MOVE. QUOTDEF is display order and moves
   freely. Anything needing a quotient looks it up by .k, never by position.
   This is the rule the tabs are held to and it is cheaper to carry it from the
   first commit than to retrofit it after something persists an index. */
var QUOTDEF=[
 {k:'pq', nm:'PQ', word:'boundary',  read:'stated'},
 {k:'iq', nm:'IQ', word:'aperture',  read:'measured'},
 {k:'eq', nm:'EQ', word:'turn',      read:'measured'},
 {k:'aq', nm:'AQ', word:'release',   read:'measured'},
 {k:'cq', nm:'CQ', word:'coherence', read:'measured'}];
var QUOT_BY={}; QUOTDEF.forEach(function(q){QUOT_BY[q.k]=q;});

/* ---------- the engine handle, and the ceiling read off it ---------- */
var E=null, REACH=null, OPEN_MAX=0;

/* the maximal field: nothing held, the opposite fully installed everywhere.
   run once, only to read the clamp ceiling back out of compute(). */
function measureCeiling(){
 var S=E.S, keep={dom:S.dom,a1:S.a1,a2:S.a2,doms:S.doms,arcs:S.arcs,roots:S.roots,
  charge:{},replace:{},law:{}};
 E.CHARGES.forEach(function(c){keep.charge[c]=S.charge[c];keep.replace[c]=S.replace[c];});
 E.SINAMES.forEach(function(l){keep.law[l]=S.law[l];});
 E.CHARGES.forEach(function(c){S.charge[c]=0;S.replace[c]=10;});
 E.compute();
 var m=0; REACH.forEach(function(n){if(n.open>m)m=n.open;});
 S.dom=keep.dom;S.a1=keep.a1;S.a2=keep.a2;S.doms=keep.doms;S.arcs=keep.arcs;S.roots=keep.roots;
 E.CHARGES.forEach(function(c){S.charge[c]=keep.charge[c];S.replace[c]=keep.replace[c];});
 E.SINAMES.forEach(function(l){S.law[l]=keep.law[l];});
 E.compute();
 return m;}

function bind(engine){
 E=engine;
 /* THE DENOMINATOR IS EVERY ADDRESS THAT CAN HOLD, WHICH IS NOT EVERY ADDRESS.
    One address in the ring carries no child fetter, so no charge can ever land
    on it and its open reads a flat 1 on every profile alive. Counting it lifts
    every person by a fraction of the scale and puts the ceiling out of reach,
    which is a silent bias in favour of whoever is worst off. The address is
    Root_08_Unnamed and it is on the owner's open list. When it is named it
    joins the denominator on its own, because this reads the field rather than
    a number typed here. */
 REACH=E.W.filter(function(n){return n.cf;});
 OPEN_MAX=measureCeiling();
 return {reach:REACH.length, of:E.W.length, openMax:OPEN_MAX};}

/* THE OVERSHOOT WEIGHT, USED BY BOTH IQ AND EQ, DECLARED ONCE.
   compute() takes JQ x 0.42 off integrity on a nought to ten scale. The same
   weight on a nought to a hundred scale is 4.2. The 0.42 is a literal inside
   compute() and is not exported, so it is typed once here with its provenance
   beside it. If it moves there it must move here, and that is said out loud
   because a copy nobody knows about is the defect this repository keeps paying
   for. */
var EQ_JQ_W=4.2;

function mean(a){var s=0,i=0;for(i=0;i<a.length;i++)s+=a[i];return a.length?s/a.length:0;}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}

/* ============================================================
   IQ · THE APERTURE OF AWARENESS.

   His argument, and it is the right one: fetters narrow awareness, and the
   engine already holds what is held and where, so the aperture is computable
   from the load rather than asked for.

   TWO TERMS, AND ONLY ONE OF THEM READS ON A PROFILE WITH NO STORY.

   1. THE OPENING, from load. compute() already writes n.open at every address:
      one minus the held residue, plus a credit for the coherent opposite
      standing there. That is an aperture per address and it was already in the
      arithmetic under another name. The field's opening is the mean of it
      across the addresses that can hold anything, divided by the ceiling the
      clamp allows, so an empty field and a field with the opposite installed
      are not the same reading. Rosa and Lance reach the ceiling. A blank
      profile does not, and that is correct: nothing installed is not the same
      as everything installed.

      AND IT IS AN AREA, NOT A DIAMETER. An opening admits in proportion to its
      area and area goes as the square of the radius. Measured on the roster
      the squared form spreads the fifteen profiles over a mean rank gap of
      0.061 against 0.044 for the linear form, and it does it without clipping
      anybody: the linear form flattened six of the fifteen against a ceiling.

   2. RECOGNITION, from the story. The aware against ignorant pair of the six
      gates, read out of a person's own words by verpScan. The weight is not
      chosen here: VERPMULT already prices awareness at 0.70 and ignorance at
      1.30 as a cost on everything held, and an aperture is the inverse of a
      cost, so the factor is one over the gate mix. Fully aware reads 1.43,
      fully ignorant 0.77, an even mix 1.00.

      WITH NO GATE CUES IT RETURNS 1 AND COSTS NOTHING, which is verpFactor's
      own convention for the same problem and not a new one. The number does
      not change meaning when a story arrives. It gains a term that was inert.

   THE FAILURE MODE THIS IS BUILT AGAINST, AND IT IS NOT AVOIDED, IT IS NAMED.
   Load alone puts Gordon at 15 and Tomas at 15. Gordon says there is nothing
   wrong with him and four people left in a year. Tomas says he used to drive
   nine hundred miles and feel nothing and now cannot get to the end of the
   street. Gordon cannot see it. Tomas sees it exactly and cannot move. A
   measure that cannot tell those two apart is not measuring awareness, it is
   measuring load and calling it awareness.

   Load is necessary and it is not sufficient. The thing that separates them is
   what they write, and the recognition term is the only part of this that can
   read it. Which is why the term is in the arithmetic from the first commit
   and why the page says unread rather than zero until a story exists.
   ============================================================ */
function recognition(){
 /* VERPMIX is where the gates live once a story has been applied, and gatesLoad
    fills it from the record. Reading the mix rather than rescanning text means
    the stored profile and the live typing go through one door. */
 var mix=E.VERPMIX||{}, u=mix.aware||0, d=mix.ignore||0, n=u+d;
 if(!n)return {read:false, f:1, n:0, clean:null,
  because:'the story matched no aware or ignorant cue, so the opening is read '+
   'from load alone and this term is inert'};
 var m=(u/n)*E.VERPMULT.aware+(d/n)*E.VERPMULT.ignore;
 return {read:true, f:1/m, n:n, clean:u/n,
  because:'aware against ignorant read '+n+' cues, '+Math.round(u/n*100)+
   ' of 100 clean, priced at the gate weights compute() already uses'};}

function apertureRead(r){
 var opens=REACH.map(function(n){return n.open;});
 var radius=mean(opens)/OPEN_MAX;
 var area=radius*radius;
 var rec=recognition();
 /* THE ONE TERM THIS ADDS THAT n.open DOES NOT CARRY, AND IT IS HERE BECAUSE
    OF A PILEUP AND NOT BECAUSE IT READS BETTER.

    n.open credits the installed opposite with no ceiling on overdoing it, and
    the credit clamps. Measured on the rep sweep at charge 4: the opposite at 9
    and the opposite at 10 both read an aperture of 100.0 while coherence falls
    from 33.8 to 27.6. Two different fields on one number is the defect this
    repository has been bitten by most often. On the roster it lands on real
    people: Rosa carries nothing with the opposite at 6 everywhere and Lance
    carries almost nothing with it at 9, and both read 100.0 flat.

    Overshoot is subtracted at the weight compute() already charges integrity
    for it, which separates them and tracks the fall in coherence rather than
    running against it. It is the same weight EQ uses, so IQ and EQ share this
    one term and the page says so.

    AND WHETHER n.open SHOULD CARRY IT IS THE OWNER'S CALL, NOT THIS FILE'S.
    compute() is the arithmetic core and it keeps its bodies. What is in scope
    here is the reading built on top of it. */
 var over=r.JQ*EQ_JQ_W;
 var pct=clamp(area*rec.f-over/100,0,1)*100;
 /* WHERE IT IS NARROW IS A DIFFERENT QUESTION FROM HOW OPEN IT IS, and the
    answer is a seat, not a number. Spread across seats was tested as the
    scalar and discarded: on the roster eleven of the fifteen carry something in
    all seven seats, so the spread reads 7 for nearly everybody and separates
    nobody. The narrowest seat varies across four of the seven and is worth
    drawing. */
 var seats=E.BANDS.map(function(b){
  var g=REACH.filter(function(n){return n.b===b;});
  return {b:b, open:mean(g.map(function(n){return n.open;}))/OPEN_MAX};});
 var sorted=seats.slice().sort(function(a,b){return a.open-b.open;});
 /* A FLAT FIELD HAS NO NARROWEST SEAT AND MUST NOT NAME ONE. With nothing held
    anywhere the seven seats read identically and a sort returns whichever sat
    first in BANDS, so the page printed Root for Rosa, for Lance and for a blank
    profile: a finding manufactured by an array order. Under a spread of one
    point in a hundred there is nothing to name. */
 var spread=sorted[sorted.length-1].open-sorted[0].open;
 var narrow=spread>=0.01?sorted[0]:null;
 return {k:'iq', pct:pct, radius:radius, area:area, rec:rec, over:over,
  seats:seats, narrow:narrow, spread:spread, unread:!!r.unread,
  because:['the opening is the mean of n.open across the '+REACH.length+
    ' addresses that can hold, over the '+OPEN_MAX.toFixed(2)+' ceiling compute() clamps to',
   'squared, because an opening admits in proportion to its area',
   rec.because,
   over>0?'overshoot takes '+over.toFixed(1)+' off, because the opposite done past '+
    'the point where it serves is not an open aperture'
   :'nothing is being done past the point where it serves']};}

/* ============================================================
   EQ · THE TURN.

   His words: EQ is transmuting, and that is Atuned. It is also WQ, wisdom,
   because we are providing the opposite.

   The engine has been computing exactly that since the rebuild and calling it
   two other things. n.rep is the coherent opposite installed at an address and
   n.held is what is held at the same address, and CHILD carries the opposite
   for all nine axes by name: fear to trust, anger to equanimity, shame to
   worth. Providing the opposite is not a thing to build. It is in the data.

   THE TURN IS A RATIO AND NOT A SUM, and that is the whole of the design
   decision here. The installed side alone is already drawn on the Summary as
   the pole ring, so reporting it again under a second name would be one
   quantity in two figures, which this product has a ruling against and has
   been bitten by once already when malignancy turned out to be coherence
   doubled. The turn is how much of what sits at an address has turned over:
   installed over installed plus held. An address with neither is not a zero,
   it is not part of the question, so it is left out of the mean.

   AND IT USES rep RATHER THAN pole. pole is the opposite MINUS the held state,
   floored at zero, so an opposite that is in but still under water reads as no
   transmutation at all. Ana has trust and joy installed at four and three and
   a field that swamps both. Reading her turn as zero says she has done nothing,
   which is false. The ratio says she has turned part of it and the residue is
   still on top, which is what her own sentence says.

   OVERSHOOT IS SUBTRACTED WITH THE ENGINE'S OWN WEIGHT. compute() takes
   JQ x 0.42 off integrity on a nought to ten scale. The same weight on a
   nought to a hundred scale is 4.2, and it is not a new constant. It is drawn
   as a mark as well as folded, because the turn done past the point where it
   serves is a threshold and not a tolerance.
   ============================================================ */
function turnRead(r){
 var live=[], turned=[];
 E.W.forEach(function(n){
  var tot=n.rep+n.held;
  if(tot<=0)return;
  live.push(n);
  turned.push(n.rep/tot);});
 if(!live.length)return {k:'eq', pct:null, unread:true, n:0,
  because:['no address holds anything and no opposite is installed anywhere, '+
   'so there is nothing to turn and nothing turned']};
 var raw=mean(turned)*100;
 var pct=clamp(raw-r.JQ*EQ_JQ_W,0,100);
 return {k:'eq', pct:pct, raw:raw, n:live.length,
  jq:r.JQ, excess:r.excess.length, unread:!!r.unread,
  because:['the turn is installed over installed plus held, meaned across the '+
    live.length+' addresses where either is present',
   'overshoot takes '+(r.JQ*EQ_JQ_W).toFixed(1)+' off, at the weight compute() '+
    'already charges integrity for it',
   r.excess.length+' addresses are past the point where the opposite serves']};}

/* ============================================================
   AQ · THE RELEASE.

   His words: AQ is adversity, and it is the release mechanism.

   AND THE RULING UNDER EVERYTHING DECIDES THE DENOMINATOR. Every condition is
   a pattern, and releasing the condition leaves the thing standing. So this
   cannot be a count of addresses cleared, because a release does not remove an
   address: the address is still in the ring, still named, still where it was.
   What comes off is the condition, and the engine's word for the condition's
   weight is shadow weight. So the question is how much of the weight a person
   has carried has come off, and the count of addresses never enters it.

   IT IS THE ONLY ONE OF THE FIVE THAT CANNOT EXIST ON A FIRST SESSION, and
   that is a definition rather than a gap. Adversity met is a thing you can
   only have after you have met it. snapshot() writes dq on every reading and
   p.history holds them, so the states are the ones seriesRead already names:
   none, one, and a line. Under two readings there is no work to report and the
   page says so instead of printing a nought.

   NOTHING CARRIED IS A THIRD STATE AND NOT A ZERO. Rosa has carried nothing
   inside the instrument. Her release reads not applicable, not nought, and the
   honest note beside it is that whatever she released she released before she
   arrived and this instrument cannot see it.
   ============================================================ */
function releaseRead(p,r){
 var hist=((p&&p.history)||[]).filter(function(s){return s&&typeof s.dq==='number';});
 var state=hist.length===0?'none':(hist.length===1?'one':'line');
 var runs=(p&&p.meter&&p.meter.lines)||0;
 var now=r.DQ, met=now;
 hist.forEach(function(s){if(s.dq>met)met=s.dq;});
 if(met<=0)return {k:'aq', pct:null, unread:true, state:state, runs:runs, met:0,
  because:['no shadow weight has ever been recorded on this profile, so there '+
   'is nothing that could have been released and the reading is not applicable '+
   'rather than nought']};
 if(state!=='line')return {k:'aq', pct:null, unread:true, state:state, runs:runs, met:met,
  because:['the record holds '+hist.length+' reading'+(hist.length===1?'':'s')+
   ', and work is a distance between two of them']};
 return {k:'aq', pct:clamp((met-now)/met,0,1)*100, unread:false, state:state,
  runs:runs, met:met, now:now,
  because:['shadow weight met was '+met.toFixed(1)+' and reads '+now.toFixed(1)+' now',
   runs+' release lines have been delivered, which is the mechanism and not the reading',
   'every address that was carrying is still in the ring. what came off is the condition']};}

/* ============================================================
   PQ · THE BOUNDARY, AND IT IS STATED RATHER THAN MEASURED.

   His words: our nutrition, mindset, the patterns that we hold on to, growth,
   everything in the physical that needs to be navigated by the ego. Think
   about a boundary.

   Four of those five have no field anywhere in the schema and this file does
   not invent one. What the engine already holds is the last one, and it holds
   it twice over: the purpose map's lower triangle is the earthly purpose and
   PUR_EGO defines it in the engine as health, fitness, financial stability,
   wealth and family, which is his physical list almost word for word. And the
   hexagon under it is the boundary: six sides, five commitments each, inside
   yours to protect and outside choice.

   So PQ has a home and it is not a measurement. boundaryCount returns how much
   of the boundary a person has drawn, and a count of what somebody typed is
   coverage. It is labelled stated everywhere it appears, for the same reason
   the cadence is labelled stated on the ladder prototype.

   boundaryCross is the measured half and it is thin: it reads which of the six
   sides an entry names, so a story can say which side the charge came through.
   It is reported as the sides that have been crossed, never folded into the
   figure, because two entries about a boss is not a reading of a boundary.
   ============================================================ */
function boundaryRead(p){
 var pur=(p&&p.purpose)||null;
 var b=E.boundaryCount(pur);
 var ready=E.purposeReady(pur);
 var crossed={};
 (((p&&p.story)||{}).entries||[]).forEach(function(en){
  var side=E.boundaryCross(en&&(en.text||en.t||''));
  if(side)crossed[side]=(crossed[side]||0)+1;});
 /* PER SIDE, because the rim is drawn as six arcs and a total cannot say which
    one is thin. boundaryCount is still the one door for the total: this reads
    the same stored field for the shape and the two are asserted equal below. */
 var sides=E.PUR_SIDES.map(function(sd){
  var a=((pur&&pur.sides&&pur.sides[sd])||[]).filter(function(x){return x&&String(x).trim();});
  return {s:sd, n:Math.min(a.length,E.PUR_PER_SIDE), of:E.PUR_PER_SIDE};});
 var sum=0; sides.forEach(function(sd){sum+=sd.n;});
 return {k:'pq', pct:b.of?b.filled/b.of*100:null, stated:true,
  filled:b.filled, of:b.of, thin:b.thin, ready:ready, crossed:crossed,
  sides:sides, agrees:sum===b.filled,
  unread:b.filled===0,
  because:['boundaryCount reads '+b.filled+' of '+b.of+' commitments drawn',
   ready?'the earthly purpose is stated, so the ego side of the map has three corners'
        :'the earthly purpose is not stated, so the ego side of the map is empty',
   'this is coverage of what a person typed. nothing here is measured, and '+
    'nutrition, sleep, movement and growth have no field in the schema at all',
   sum===b.filled?'the six sides sum to what boundaryCount reports'
    :'THE SIX SIDES SUM TO '+sum+' AND boundaryCount REPORTS '+b.filled+
     ', WHICH IS A DEFECT IN THIS FILE AND NOT IN THE ENGINE']};}

/* ============================================================
   THE FIVE, IN ONE CALL.
   ============================================================ */
function quotients(p,r){
 var R=r||E.compute();
 var out={};
 out.cq={k:'cq', pct:R.CQ, tier:R.tier, unread:!!R.unread,
  because:['compute().CQ, which is intention times integrity over resistance',
   'this quotient existed before the other four and nothing here changes it']};
 out.iq=apertureRead(R);
 out.eq=turnRead(R);
 out.aq=releaseRead(p,R);
 out.pq=boundaryRead(p);
 out.r=R;
 return out;}

return {QUOTDEF:QUOTDEF, QUOT_BY:QUOT_BY, bind:bind, quotients:quotients,
 apertureRead:apertureRead, turnRead:turnRead, releaseRead:releaseRead,
 boundaryRead:boundaryRead, recognition:recognition,
 openMax:function(){return OPEN_MAX;}, reach:function(){return REACH;},
 EQ_JQ_W:EQ_JQ_W};
});
