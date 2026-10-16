/* ============================================================
   THE PERCENT. One formula and one table for every score, weight and measure
   a person reads, so that "6.2" becomes "62%" by one rule everywhere and not
   by forty renderers each deciding their own scale.

   Ruled 16 October, his words: "Instead of 0.0, site wide, we need to convert
   those numbers into percent. I think it's a more natural language for people
   to understand. So we need to create a framework and a formula and to make
   sure that all of our elements are percent-based. If it says 6.2, then we
   should change that to percent. If it's 112 patterns, just leave it alone.
   Or, sorry, chakras, leave it alone." The supersessions are recorded in
   DECISIONS.md under that date.

   THE RULE IS THE RING. The percent printed for a quantity is the fill of the
   ring or bar drawn for that same quantity, so what is read and what is drawn
   cannot disagree. The fieldbar pills already draw p:r.SQm*10, a weight on
   nought to ten filling a ring of a hundred, and that is this formula with
   lo 0 and hi 10. Where a surface draws one fill and prints another figure
   today, the inventory names it (HANDOFF-2026-10-15/PERCENT-INVENTORY-
   2026-10-16.md) and phase 2 moves the print onto the fill.

     pct(kind, value) = clamp(round(100 * (value - lo) / (hi - lo)), 0, 100)

   WHY lo AND hi LIVE HERE AND NOT AT THE CALLER. A caller that writes its own
   *10 or *100 is a caller that can pick the wrong one, and the build already
   carries that defect: release.js stores a logged weight on nought to a
   hundred ("weights are 0 to 100 here") and its ring then multiplies it by
   ten again, so every logged address above ten draws a full ring. A kind
   names its range once, cites where the engine bounds it, and every surface
   asks the kind.

   EVERY ENTRY CITES ITS RANGE. src is the file the bound is written in and
   find is a fragment of that bound, copied exactly. tests/engine.js reads the
   cited file and fails when the fragment is gone, so a change to a clamp
   anywhere in the engine fails this table by name instead of leaving it
   quietly wrong. The line in each comment is the line on 16 October at main
   f403588, given so a reader can go straight there; the gate holds the
   fragment and not the line, because other seats edit those files and a line
   number in a gate is a number typed into a gate.

   A QUANTITY WITH NO TRUE MAXIMUM carries cap:true. Its hi is the 99th
   percentile observed over the whole worked example roster (PEOPLE, every one
   of them), never below the largest value the engine can prove for one entry,
   and the entry says so. Every cap is the owner's to rule on and is listed in
   HANDOFF-2026-10-15/PERCENT-FRAMEWORK-2026-10-16.md.

   WHAT NEVER COMES HERE. A count of things: the 112 addresses, patterns,
   stories, days, minutes, answers, laws, the nine axes, the seats and their
   names, tier numbers, prices, version numbers, dates, ids, coordinates and
   geometry. A count is not a share of anything and never gets a percent.
   Neither does a factor (the gate multiplier, susceptibility, the zoom), which
   can stand above one and is not the fill of anything.

   THE ENGINE MAY NOT TOUCH THE HOST, and this file does not. It sits at the
   end of the data, ahead of the first module of arithmetic, so anything in
   the engine or the renderers may ask it at load. It reads nothing else in
   the engine, so its place depends on nothing above it.
   ============================================================ */

/* the dash every surface already prints for "nothing here", ui/component.js
   cr(): a figure that rounds to nought is the dash, round J13, his words: "the
   hardest carrying zero percent. I don't want that." */
var PCT_DASH='–';

var PCT_KIND={
 /* ---------- already on nought to a hundred ---------- */
 /* compute.js:172, the 21 laws summed over 210. Each law is at most 10
    (schema.js:1047 and lawLift, compute.js:151), so 100 is every law at 10. */
 cq:        {lo:0, hi:100, src:'engine/compute.js', find:'),0)/210*100;}',
             say:'coherence, the 21 laws summed over 210'},
 /* compute.js:408, all 112 addresses summed over 1120, each sq at most 10 */
 dq:        {lo:0, hi:100, src:'engine/compute.js', find:'const DQ=SQ.reduce((a,v)=>a+v,0)/1120*100;',
             say:'decoherence, the shadow on all 112 against the most they could hold'},
 /* compute.js:448, CQ times what the pull leaves, PULL nought to one. The
    headroom exHeadroom returns, compute.js:585, is a gap on this same scale,
    so it asks this kind too: three points of expression is 3%. */
 expression:{lo:0, hi:100, src:'engine/compute.js', find:'const EX=CQ*(1-PULL);',
             say:'expression, and the headroom a release still has in it'},
 /* compute.js:622, clamped to 8.3 and 99. It is already a percent of a
    hundred, so lo stays 0: the floor is the fit's own, not the scale's. */
 accuracy:  {lo:0, hi:100, src:'engine/compute.js', find:'pct=clamp(pct*(1-deg*0.10),8.3,99);',
             say:'identification, how much of the person the instrument has measured'},
 /* data/compass.js:484, where a person sits on a compass axis */
 axis:      {lo:0, hi:100, src:'engine/data/compass.js', find:'return Math.round(clamp(clear*0.62+honest*0.38,0,1)*100);}',
             say:'the position on a compass axis'},
 /* core.js:426, how closely the feelings fit a saboteur's defined ranges */
 match:     {lo:0, hi:100, src:'engine/core.js', find:'var score=Math.round(fit/parts.length*100);',
             say:'a saboteur match'},
 /* verp.js:357, the share of the story that ran through one gate */
 gate:      {lo:0, hi:100, src:'engine/verp.js', find:'pct: sh?Math.round(sh[v.k]*100):0',
             say:'the share of the story through one gate'},
 /* verp.js:496, the benign and malignant shares of the orientation bar */
 lean:      {lo:0, hi:100, src:'engine/verp.js', find:'var fieldMal=Math.max(0,Math.min(100,(r&&r.malig)||0));',
             say:'the benign or malignant share'},
 /* ui/ritual.js:1087, the days kept against the days due */
 kept:      {lo:0, hi:100, src:'ui/ritual.js', find:'pct:100*kept/due',
             say:'the days a ritual was kept against the days it was due'},

 /* ---------- nought to ten ---------- */
 /* schema.js:1047, the boundary refuses a law outside 0 to 10 by name */
 law:       {lo:0, hi:10, src:'engine/schema.js', find:"vRange(errs,'laws.'+l.nm,o.laws[l.nm],0,10)",
             say:'one law'},
 /* schema.js:1040, the charge held on one of the nine axes */
 charge:    {lo:0, hi:10, src:'engine/schema.js', find:"vRange(errs,'axes.'+c.nm+'.held',a.held,0,10)",
             say:'the charge on one axis'},
 /* schema.js:1041 on the axis, and compute.js:293 at one address */
 installed: {lo:0, hi:10, src:'engine/schema.js', find:"vRange(errs,'axes.'+c.nm+'.opp',a.opp,0,10)",
             say:'an opposite installed'},
 /* compute.js:290, the charge held at one address before the opposite */
 held:      {lo:0, hi:10, src:'engine/compute.js', find:'n.held = n.cf?clamp(S.charge[n.cf]*n.susc*(1-relief*0.42),0,10):0;',
             say:'the charge held at one address'},
 /* compute.js:295, sq, what is left at one address after the opposite. A mean
    of sq stays on the same scale, so SQm (compute.js:318), the heaviest seat
    darkV, a mask's load (compute.js:378) and a seat's mean all ask this kind.
    It is the fieldbar's p:r.SQm*10, which is where the ruling started. */
 weight:    {lo:0, hi:10, src:'engine/compute.js', find:'n.sq   = clamp(n.held - n.rep*0.86,0,10);',
             say:'the weight at an address, or a mean of it'},
 /* a saboteur is a mean of sq or of its rated levels capped at 10 (core.js:430),
    a complex and a hyper the mean of their parts (compute.js:362 and 369), and
    the body map clamps the same w at 10 (ui/map.js:2036) */
 chain:     {lo:0, hi:10, src:'engine/core.js', find:'w:Math.min(10, parts.reduce(',
             say:'the weight of a saboteur, complex, hyper complex or character layer'},
 /* compute.js:296, and poleMean is the mean of it over the somatic set */
 pole:      {lo:0, hi:10, src:'engine/compute.js', find:'n.pole = clamp(n.rep - n.held,0,10);',
             say:'how far the opposite outweighs the charge'},
 /* compute.js:300, and JQ is the mean of it over the somatic set */
 overshoot: {lo:0, hi:10, src:'engine/compute.js', find:'n.jq   = clamp(n.rep - 6,0,4)/4*10;',
             say:'an opposite pushed past the point where it helps'},
 /* compute.js:381 */
 distortion:{lo:0, hi:10, src:'engine/compute.js', find:'sups.length*2.4,0,10);',
             say:'how much what is running bends what is meant'},
 /* compute.js:390 */
 integrity: {lo:0, hi:10, src:'engine/compute.js', find:'- JQ*0.42,0,10);',
             say:'integrity, the laws lifted by the poles and pulled down by overshoot'},
 /* compute.js:391 */
 intention: {lo:0, hi:10, src:'engine/compute.js', find:'- JQ*0.30,0,10);',
             say:'intention, the same laws read seat by seat'},
 /* intake.js:55, the widest gap between a law's three answers, each 0 to 10
    at the boundary (schema.js:1069) */
 spread:    {lo:0, hi:10, src:'engine/intake.js', find:'var spread=Math.max.apply(null,v)-Math.min.apply(null,v);',
             say:'how far apart a law\'s three answers sit'},
 /* sniff.js:906, what one entry puts at one address: the seat's total is
    capped at 10 and split across up to four addresses */
 atom:      {lo:0, hi:10, src:'engine/sniff.js', find:'var total=Math.min(10,byBand[k]/3)',
             say:'what one entry put at one address'},
 /* THE ONE CAP. The weight several entries put at one address added up
    (ui/drills.js "entries that landed here put N in all") and a merged pill
    (ui/imprints.js:34) are sums, and a sum over entries has no ceiling.
    Measured on 16 October over all sixteen of PEOPLE: two carry a story that
    lands, eight imprints, the 99th percentile of the sum at an address 2.2 and
    of a merged pill 8.8. Both sit under what one entry can already put at one
    seat, 10 (sniff.js:906), and a cap below a value the engine can produce from
    a single entry would print 100% on an ordinary entry. So hi is 10, the
    larger of the two, and the roster cannot see more because each person in it
    carries one story. His to rule. */
 atomsum:   {lo:0, hi:10, cap:true, p99:{address:2.2, pill:8.8, n:16},
             src:'engine/sniff.js', find:'var total=Math.min(10,byBand[k]/3)',
             say:'what several entries put at one address, added up'},

 /* ---------- nought to one ---------- */
 /* compute.js:510 to 513, each clamped to 0 and 1, radiance their length
    over the root of three */
 vitality:  {lo:0, hi:1, src:'engine/compute.js', find:'const X=clamp((1-S.charge.Apathy/10)*.3+(1-clamp(DQ/14,0,1))*.7,0,1);',
             say:'vitality'},
 awareness: {lo:0, hi:1, src:'engine/compute.js', find:'const Y=clamp((It/10)*.6+(1-dist/10)*.4,0,1);',
             say:'awareness'},
 will:      {lo:0, hi:1, src:'engine/compute.js', find:'const Z=clamp((Ig/10)*(1-SQm/10),0,1);',
             say:'will'},
 radiance:  {lo:0, hi:1, src:'engine/compute.js', find:'const radiance=Math.sqrt(X*X+Y*Y+Z*Z)/Math.sqrt(3);',
             say:'radiance, vitality, awareness and will together'},
 /* ui/summary.js:76, the mean of the three above */
 energy:    {lo:0, hi:1, src:'ui/summary.js', find:'var e=(r.X+r.Y+r.Z)/3;',
             say:'energy, the mean of vitality, awareness and will'},
 /* compute.js:280, the bell normalised by its own top, so 10 pulls 1, and
    PULL is the mean of it over the 112 (compute.js:447) */
 pull:      {lo:0, hi:1, src:'engine/compute.js', find:'function leverPull(w){return leverPhi((w-LEVER_MU)/LEVER_SD)/LEVER_TOP;}',
             say:'how hard the shadow drags'},
 /* ui/map.js:202, a seat's held charge over its addresses, out of ten */
 seatload:  {lo:0, hi:1, src:'ui/map.js', find:'var load=hot.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,seg.length)/10;',
             say:'the load a seat carries'},
 /* ui/map.js:203, what a seat passes on */
 pass:      {lo:0, hi:1, src:'ui/map.js', find:'pass:Math.max(0,1-load*1.35)',
             say:'what one seat passes on'},
 /* ui/map.js:206, the product of the seven passes, root to crown */
 flow:      {lo:0, hi:1, src:'ui/map.js', find:'function flSpeed(){var s=1;flSeats().slice().reverse().forEach(function(x){s*=x.pass;});return s;}',
             say:'flow, what gets from the root to the crown'},
 /* core.js:403, each archetype against the strongest, so the first reads 1 */
 affinity:  {lo:0, hi:1, src:'engine/core.js', find:'const mx=Math.max(...a)||1;return a.map(v=>v/mx);}',
             say:'an archetype against the strongest'},
 /* ui/summary.js:438, an archetype's share of all twelve added up. This is a
    second reading of the same affinity and prints a different figure for the
    same archetype; which one the person reads is in the framework's open list. */
 share:     {lo:0, hi:1, src:'ui/summary.js', find:'var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;',
             say:'an archetype\'s share of all twelve'},
 /* core.js:394, each domain against the strongest. The floor of .08 is drawn
    (the petal never vanishes), so lo stays 0 and the floor reads 8%. */
 domain:    {lo:0, hi:1, src:'engine/core.js', find:'DOMAIN=DOMAIN.map(v=>.08+.92*v/mx);',
             say:'a blueprint domain against the strongest'},
 /* data/compass.js:655 and 634, two shares of the chain's weight */
 shape:     {lo:0, hi:1, src:'engine/data/compass.js', find:'function outwardShare(stack){',
             say:'shape, the share of what is running that points at other people'},
 control:   {lo:0, hi:1, src:'engine/data/compass.js', find:'function organisedShare(stack){',
             say:'control, the share of what is running that is organised'},
 /* a count over its own total, which several surfaces already print as a
    share: the seat's addresses carrying in Knowledge (ui/knowledge.js:212),
    the carrying addresses a story reached on the glass bar (ui/fieldbar.js).
    The range is the definition, nought of them to all of them. */
 portion:   {lo:0, hi:1, src:'ui/knowledge.js', find:'Math.round(lit/all.length*100)',
             say:'how many of a set, against the whole set'},
 /* charfield.js:60, how closed a seat reads on the Character page, a smooth
    step clamped to nought and one */
 closed:    {lo:0, hi:1, src:'engine/charfield.js', find:'function charSmooth(a,b,v){var t=clamp((v-a)/(b-a),0,1);',
             say:'how closed a seat is, the shadow at that seat'},
 /* charfield.js:160, closedness times a share, so never above it */
 leak:      {lo:0, hi:1, src:'engine/charfield.js', find:'o.lk[k]=sh*(.55+.45*(1-c));',
             say:'how much a seat leaks'},
 /* ui/avatarui.js:624, the mean of the avatar's closures */
 complete:  {lo:0, hi:1, src:'ui/avatarui.js', find:'var overall=cs.length?cs.reduce(function(s,v){return s+v;},0)/cs.length:null;',
             say:'the avatar\'s percent complete'}};

/* THE FORMULA. Null for anything that is not a number, so a caller can tell
   "nothing to read" from "read, and it is nought" and never prints a zero over
   a value that was never there. An unknown kind throws by name, because a
   misspelt kind returning a plausible figure is the silent failure this table
   exists to end. */
function pct(kind,value){
 var K=PCT_KIND[kind];
 if(!K)throw new Error('pct: there is no kind '+JSON.stringify(kind)+' in PCT_KIND');
 if(value===null||value===undefined||value===''||typeof value==='boolean')return null;
 var v=+value;
 if(!isFinite(v))return null;
 var p=Math.round(100*(v-K.lo)/(K.hi-K.lo));
 return p<0?0:(p>100?100:p);}

/* WHAT A PERSON READS. '62%', a plain sign, a whole number, no space. A figure
   that rounds to nothing is the dash and never '0%': "the hardest carrying zero
   percent" is the sentence he struck, and a 0% beside the words "not read yet"
   is the same defect. opts.unread is the reading's own r.unread, which wins
   over any value, because a default is not a reading. */
function fmtPct(kind,value,opts){
 var o=opts||{};
 var p=pct(kind,value);
 if(o.unread||p===null||p===0)return PCT_DASH;
 return p+'%';}

/* A CHANGE IS SAID AS BEFORE AND AFTER. "CQ moved from 58% to 61% since last
   session", never "up 3", which is a delta in a unit the person cannot see.
   moved is false when the two print the same, so a move too small to show is
   said as no move rather than as "from 58% to 58%". Null when either end has
   nothing to read. */
function pctMove(kind,before,after,opts){
 var o=opts||{};
 var a=pct(kind,before), b=pct(kind,after);
 if(o.unread||a===null||b===null)return null;
 return {from:a?a+'%':PCT_DASH, to:b?b+'%':PCT_DASH, a:a, b:b, moved:a!==b, up:b>a};}
