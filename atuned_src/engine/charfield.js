/* ============================================================
   THE CHARACTER FIELD. What the Character page reads off the engine, and
   the arithmetic that turns it into a shape, kept here so it can be tested
   without a browser and so the renderer holds drawing and nothing else.

   Rounds ON to OW in TASKS.md. The owner picked Orbit and asked for a torus
   round it "based off the health of your body", the point cloud tied to "the
   CQ and the stories, because it's the masks", and a trace "so we can see
   where we're leaking energy". Three questions came out of that and each has
   a function here.

   WHAT ARE THE POINTS ROUND THE BODY. "What do the points around the body
   represent?" In the Orbit mockup they represented nothing, which he caught.
   Each one is an address: addrField() is the 112, 108 somatic at a plexus or a
   nerve and 4 field anchors, each with the charge compute() left on it. The
   renderer places them, because where a point sits is a drawing decision and
   no engine number depends on it.

   WHAT BENDS THE TORUS. seatField() is the mean charge of each seat's
   addresses over ten and the seat's own integrity, bandIg, which already
   exists and is not re-derived. charSeatState() turns those seven pairs and
   the coherence into what the torus does at that seat: pinch, pull, bulge,
   slow, stutter, rays, and which seats are leaking.

   WHAT LIGHTS IT. Coherence, CQ over a hundred, fills the seats from the root
   up (charLit), and the page opens dim and grows to the real level over about
   two seconds (charGrow). At no coherence the figure is a dim silhouette and
   not black: "near black, not totally black. They're giving off very little
   light."

   THESE READ n.sq AS THE LAST compute() LEFT IT. Nothing here calls compute()
   and nothing here writes a charge. A caller that has not computed reads zero
   at every address, which is the honest answer for a profile nobody has read.

   THE ENGINE MAY NOT TOUCH THE HOST and this file does not. It sits after
   engine/export.js on purpose: export.js assigns module.exports whole, and
   this file adds its own names to what it left rather than editing a list
   other seats are appending to.
   ============================================================ */

/* WHERE DISTORTION BEGINS. A seat reads open at or below CHAR_SEAT_LO and
   closed at or above CHAR_SEAT_FULL, mean charge over ten, smoothly between.

   The mockup had them at .08 and .42 and that was wrong for the real field:
   measured over the fifteen reference people, a seat mean of .08 to .15 is
   what an ordinary, mildly loaded person carries (Marcus sits at .09 to .13 in
   all seven), and at .08 every one of them got a waist at every seat, so the
   default view was a bell. Moved to .18 and .52 so a person has to carry a
   moderate load before the field narrows. Measured at the move, closedness sh
   per seat, root first: Sofia, Marcus, Angela, Rosa, Wren and Abraham read 0
   at all seven; Derek is .62 at the Solar and .24 to .26 at two more and
   nothing else; James .58 at the Sacral and .46 at the Heart; Ana .98 to 1 at
   three seats; Tomas and Gordon, whose seats sit at .38 to .69, are closed at
   nearly every one. */
var CHAR_SEAT_LO=.18, CHAR_SEAT_FULL=.52;
/* the seconds the page takes to come up from the dim floor to the person's
   real level, the owner's "start dim and then grow lit" */
var CHAR_GROW_S=2.1;

function charSmooth(a,b,v){var t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);}

/* A name as a person reads it. The table has "Doubt Of God" and "Self-Exclusion"
   and the nerves are "Celiac Plexus", title case all the way down, which in a
   hover reads as shouting. Sentence case, with the proper nouns kept: God, the
   field anchors and a seat named in brackets. Root_08_Unnamed is the one
   address with no name, and a person is shown "Unnamed, Root 08" and never the
   key it is stored under. */
var CHAR_PROPER={God:1,Sol:1,Star:1,Gaia:1,Earth:1,Stellar:1,Gateway:1,Solar:1,Heart:1};
function charAddrName(k){
 k=String(k==null?'':k);
 var u=/^(\w+)_(\d+)_Unnamed$/.exec(k);
 if(u)return 'Unnamed, '+u[1]+' '+u[2];
 return k.replace(/_/g,' ').split(' ').map(function(w,i){
  var bare=w.replace(/[()]/g,'');
  if(CHAR_PROPER[bare])return w;
  return i===0?w.charAt(0).toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase();}).join(' ');}

/* THE 112, in address order, each with the charge the last compute() wrote.
   seat is the band the address sits in, and for the four field anchors the
   seat they extend: the two above the head take the Crown and the two below
   the feet take the Root, which is the ruling of 25 September that compute()
   already applies to their sq. field and above say which they are, because an
   anchor is drawn as a ring on the axis and not as a point round the body.
   channel is the charge channel the address takes (n.c) and pattern the child
   pattern it belongs to (n.cf), either of which is null for the address that
   carries none. sq is 0 to 10. */
function addrField(){
 return NODES.map(function(n){
  var fld=String(n.b).indexOf('Field')===0, above=n.b==='Field-Above';
  return {i:n.i, name:charAddrName(n.k), key:n.k, seat:fld?(above?'Crown':'Root'):n.b,
   plexus:n.n?charAddrName(n.n):'', channel:n.c||null, pattern:n.cf||null,
   sq:clamp(+n.sq||0,0,10), field:fld, above:above};});}

/* THE SEVEN SEATS, root first. mean is the mean sq of the seat's somatic
   addresses over ten, so 0 to 1, and the four anchors are not in it: they are
   the seat's own mean restated and counting them would weigh the Crown and the
   Root twice. ig is the seat's own integrity over ten, bandIg(seat)/10, the
   mean of the laws that sit at it. n is how many somatic addresses it holds. */
function seatField(){
 return BANDS.map(function(b,k){
  var g=NODES.filter(function(n){return n.b===b;});
  var s=g.reduce(function(a,n){return a+(+n.sq||0);},0);
  return {seat:b, idx:k, n:g.length, mean:g.length?s/g.length/10:0, ig:clamp(bandIg(b)/10,0,1)};});}

/* HOW LIT A THING AT SEAT POSITION k IS AT COHERENCE c, c being CQ over a
   hundred. Coherence fills the seats from the root up, so a person at 31
   percent has the lower seats lit and the upper ones still dark, and the front
   of the light is a gradient and not an edge. k runs 0, the root, to 6, the
   crown, and may be fractional: a point between two seats is lit between
   their two answers. */
function charLit(k,c){var X=clamp(c,0,1)*8.6-1.0;return Math.pow(charSmooth(-.7,.9,X-k),1.4);}

/* THE OPENING. 0 at the first frame and 1 from CHAR_GROW_S seconds on, with
   an ease at both ends so the light climbs and settles and is not a ramp. The
   drawn coherence is the real one times this, so a person at 31 percent opens
   at the dim floor and arrives at 31, and a person at nothing opens dim and
   stays dim. */
function charGrow(t){return charSmooth(0,CHAR_GROW_S,t);}

/* THE WORDS FOR A COHERENCE, in the order he gave them: "compressed is no
   light, 100 percent coherence is full spectrum". */
function charCohWord(c){return c<.2?'compressed':c<.8?'partial':'full spectrum';}

/* WHAT EACH SEAT DOES TO THE TORUS, from its mean charge and its integrity at
   coherence c. means and igs are the seven numbers seatField() gives, root
   first, passed in rather than read so the renderer can hand it the eased
   charges it is drawing this frame and not the ones the engine holds.

     sh      how closed the seat is, 0 open to 1 closed, smooth between the two
             thresholds above
     lit     charLit at the seat
     open    lit, less what the shadow takes: how bright and wide the field is
     pinch   the radius pulled in toward the body, a waist
     bulge   an open, whole seat swells outward: low shadow, lit, and the seat's
             own integrity, so a seat that has not been answered for does not
             swell on the strength of a good guess
     pull    a half loaded seat drags the loop sideways, most where sh is .5
     slow    the flow's speed there, a real bottleneck
     stut    how much the flow stutters in held steps
     ray     the length of the short rays off the wall
     lk      how much the seat is losing, and more at low coherence because a
             field that is not lit cannot hold what it has

   leaks is the seats with lk over .12, the heaviest first, at most three: a
   leak is a closed seat, and the page names at most three so the trace has a
   short list to walk. out may be a state this returned before and is reused
   in place, because the page asks every frame. */
function charSeatState(means,igs,c,out){
 var o=out||{sh:[],lit:[],open:[],pinch:[],bulge:[],pull:[],slow:[],stut:[],ray:[],lk:[],leaks:[]};
 c=clamp(c,0,1);
 for(var k=0;k<7;k++){
  var sh=charSmooth(CHAR_SEAT_LO,CHAR_SEAT_FULL,means[k]||0), lit=charLit(k,c), ig=clamp(igs&&igs[k]!=null?igs[k]:1,0,1);
  o.sh[k]=sh; o.lit[k]=lit; o.open[k]=lit*(1-.85*sh);
  o.pinch[k]=.3*Math.pow(sh,1.1);
  o.bulge[k]=.13*Math.pow(1-sh,1.4)*lit*(.35+.65*ig);
  o.pull[k]=4*sh*(1-sh)*.12;
  o.slow[k]=1-.72*Math.pow(sh,1.1);
  o.stut[k]=charSmooth(.35,.85,sh);
  o.ray[k]=.03+.14*o.open[k];
  o.lk[k]=sh*(.55+.45*(1-c));}
 o.leaks=[0,1,2,3,4,5,6].filter(function(k){return o.lk[k]>.12;})
  .sort(function(a,b){return o.lk[b]-o.lk[a]||a-b;}).slice(0,3);
 return o;}

/* THE TORUS OSCILLATES, AND VITALITY SETS HOW. Round PE: "its oscillation, a
   breathing of radius and a slow wave along its height, has an amplitude and a
   rate driven directly by the Vitality reading", the one the left menu prints,
   r.X in compute(): what is left after apathy and the shadow weight, 0 to 1,
   and the shadow weight is the seven seats' own charge, so it rises as the
   seats clear. Higher vitality is a stronger, quicker oscillation and low
   vitality is a weak, flat one.

   THE MAPPING, ALL OF IT, so nothing in the renderer chooses a number:

     amp    the fraction of its radius the torus swings by, .004 at no vitality
            and .086 at full: a flat tube against a visible breath. Linear in
            vitality, so a reading half way up swings half way up.
     rate   cycles a second, .06 at none (one breath in seventeen seconds, a
            held still) to .32 at full (one in a little over three).
     wave   the share of the swing that is the wave along the height, and the
            rest is the breath of the whole radius at once: .45. Both ride the
            one phase, which the caller accumulates from rate so that a rate
            that eases never makes the picture jump.
     length the wavelength of the wave along the height, in figure units, 1.7:
            a bit more than one wave between the feet and the head, so the
            tube reads as a slow swell travelling up it and never as a ripple.

   charOscAt returns the multiplier on the radius at height y, y being figure
   units with the head near -1 and the feet near 1, at the given phase in
   cycles. It is 1 plus the swing, so it never goes negative: the largest swing
   there is is .086. */
var CHAR_OSC_AMP0=.004, CHAR_OSC_AMP1=.086, CHAR_OSC_RATE0=.06, CHAR_OSC_RATE1=.32;
var CHAR_OSC_WAVE=.45, CHAR_OSC_LEN=1.7;
function charOscillation(vit){
 var v=clamp(+vit||0,0,1);
 return {amp:CHAR_OSC_AMP0+(CHAR_OSC_AMP1-CHAR_OSC_AMP0)*v,
  rate:CHAR_OSC_RATE0+(CHAR_OSC_RATE1-CHAR_OSC_RATE0)*v,
  wave:CHAR_OSC_WAVE, len:CHAR_OSC_LEN};}
function charOscAt(o,y,phase){
 var br=Math.sin(phase*Math.PI*2), wv=Math.sin((phase-y/o.len)*Math.PI*2);
 return 1+o.amp*((1-o.wave)*br+o.wave*wv);}

/* THE HEAT MAP, the body coloured by how much charge it carries. seatMean is
   the seven seat means over ten root first (seatField), and k is a seat
   position, 0 the root to 6 the crown, which may be fractional: the answer
   between two seats is a straight line between theirs, so the heat is smooth
   across the body and never steps at a seat boundary. charHeatT turns a mean
   charge into the 0 to 1 the ramp is read at, full heat at a seat mean of .6
   because the heaviest seat in the roster, Tomas's root, sits at .69, and a
   ramp that tops out at 1 would read the whole roster as lukewarm. */
var CHAR_HEAT_FULL=.6;
function charSeatMean(means,k){
 k=clamp(k,0,6);var i=Math.min(5,k|0),f=k-i;
 return (means[i]||0)*(1-f)+(means[i+1]||0)*f;}
function charHeatT(v){return clamp((+v||0)/CHAR_HEAT_FULL,0,1);}

/* The names above are added to what export.js left, and only in node. In a
   browser there is no module and every one of these is already a global. */
if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{addrField:addrField, seatField:seatField, charAddrName:charAddrName,
  charLit:charLit, charGrow:charGrow, charCohWord:charCohWord, charSeatState:charSeatState,
  charOscillation:charOscillation, charOscAt:charOscAt, charSeatMean:charSeatMean, charHeatT:charHeatT,
  CHAR_OSC_AMP0:CHAR_OSC_AMP0, CHAR_OSC_AMP1:CHAR_OSC_AMP1, CHAR_OSC_RATE0:CHAR_OSC_RATE0, CHAR_OSC_RATE1:CHAR_OSC_RATE1,
  CHAR_HEAT_FULL:CHAR_HEAT_FULL,
  CHAR_SEAT_LO:CHAR_SEAT_LO, CHAR_SEAT_FULL:CHAR_SEAT_FULL, CHAR_GROW_S:CHAR_GROW_S});}
