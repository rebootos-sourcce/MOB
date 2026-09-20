/* ============================================================
   THE COMPASS WITH VOLUME.

   A line cannot show what a cone shows. The two cones widen as
   they go, and the widening is the point: distance from the axis
   is how far a behaviour has travelled from the quality it started
   as. Eight meridians, one per mirror axis, the person plotted on
   every one of them, and the whole thing spins.

   The geometry is the codex's own. The CQ cone opens upward toward
   Source, which is not a destination but the condition underneath.
   The DQ cone opens downward to the blueprint. They meet at the
   waist, which is the median range the ten band scale already
   names. The pit is a downward triangle and the frozen figure at
   its point is expressing every depth above it outward at once.

   No library and no new dependency. Its own canvas, its own
   context, and an axonometric projection in about forty lines.
   ============================================================ */
/* flat: the 2D version on a button, beside the spinning one. Ruled.
   layers: the compression reading, Dante, off by default.
   reg: the six axis arrows, three up regulating and three down.
   span: the oscillation window, 30, 90 or 365 days. */
/* IT OPENS FLAT. Ruled: "it should also start 2D flat, and then you can click
   and mouse and move around it." The turned figure is what a person got first
   and it is the state they then had to work out how to get out of. Flat is the
   plan view, it is legible without being turned, and dragging still turns it,
   so nothing is taken away by starting where a person can read. */
var CONE={open:false, tab:false, spin:0.6, tilt:0.60, drag:null, raf:null, t:0,
 cv:null, g:null, dpr:1, hits:[], flat:true, layers:false, reg:false,
 span:'quarter',
 /* WHERE THE FIGURE IS BEING ASKED TO TURN TO, and nothing when nobody is
    asking. Ruled: "hovering one spins the figure to that person, quickly, and
    never snaps." A target plus an ease is the only way to have both: a
    written assignment to spin would snap, and an animation without a target
    cannot be aimed. front is which axis is nearest the viewer right now, so
    the rail can light up without asking the renderer. */
 spinTo:null, front:0};
/* THE FLAT VERSION IS THE SAME FIGURE WITH THE TILT TAKEN OUT.

   A second renderer for a 2D compass would be a second thing to keep true and
   it would drift. The projection already takes a tilt: at zero the rings
   collapse to lines, the meridians become a flat fan, and what is left is an
   elevation of the same geometry, which is what a flat version is. One
   switch, one renderer, and the two can never disagree. */
function coneTilt(){return CONE.flat?0.0001:CONE.tilt;}
/* THE HEIGHT BUDGET. A tilted ring reaches lower than the axis point it sits
   on, by its own radius times the sine of the tilt, so a figure sized against
   the axis alone puts its floor names off the bottom of the canvas. The budget
   is height times cos plus radius times sin, and it has to leave room for the
   pole names, which sit outside the figure entirely. At the widest tilt the
   clamp allows this comes to about 0.86 of the half box. */
/* AND THE BUDGET IS LARGER NOW THAT THE NAMES ARE OFF IT. The comment above
   is why this was 0.55: the sixteen pole names sat outside the figure and had
   to be kept on the canvas. They are markup in the rail now, so the whole
   height belongs to the drawing again and the only things still outside it
   are the two pole words and their glyphs. Measured against those. */
/* AND IT IS NOT ONE NUMBER, because the budget genuinely is not. A tilted
   ring reaches below the axis point it sits on by its own radius times the
   sine of the tilt, so the same height that fits flat runs off the card as
   soon as the figure turns. Measured at the widest tilt the clamp allows:
   0.72 flat comes to 0.72 of the half box, and tilted it comes to
   0.72 x cos plus 0.52 x sin, which is 0.89, and the two pole words sit
   outside that again. So the height is solved from the reach instead of
   guessed, and the flat default gets the whole card it can use. */
/* declared above coneH because coneH solves against it. this file's order is
   the load order and a constant a function reads belongs before it. */
const CONE_FLARE=0.52;    /* how fast it widens away from the waist */
const CONE_REACH=0.74;   /* how far down the drawing may go, pole words aside */
const CONE_H_FLAT=0.72;
function coneH(){
 var tl=coneTilt();
 if(CONE.flat)return CONE_H_FLAT;
 return Math.min(CONE_H_FLAT,
  (CONE_REACH-CONE_FLARE*Math.sin(tl))/Math.max(0.2,Math.cos(tl)));}
/* THE WAIST IS A NECK, NOT A POINT. Two true cones meet at a point and the
   figure pinches to nothing exactly where the median range lives, which is
   the one part of the scale a person is most likely to be in. A minimum
   radius makes it a neck, the median reads as a band with width, and the
   rings read as ellipses instead of collapsing to a line. */
const CONE_NECK=0.14;
/* WHERE THE ARROW STOPS BEING A SHAFT AND STARTS BEING A HEAD, and where the
   head is widest. Both as a share of the distance from the median to a pole.
   The head takes the last third, which is the proportion a drawn arrow
   carries: much shorter and it reads as a spike, much longer and the shaft
   disappears and it is a cone again. */
const ARROW_SHOULDER=0.64;
const ARROW_HEAD=0.76;
/* THE THREE POLE GLYPHS, on the 24 unit grid every icon in this product uses.
   Ring, not fill, like the rest. A halo is a ring with nothing in it. Ego
   compression is a ring with two arrows pressing on it. The pitchfork is a
   pitchfork. */
const GL_HALO='M4 12 A8 3.4 0 1 0 20 12 A8 3.4 0 1 0 4 12';
/* GL_COMPRESS is gone with the third glyph it drew. A constant nothing draws
   is how the destructive release animation survived in this build for weeks,
   so an unused path does not stay in the file. */
const GL_FORK='M12 21V9M6 9V3.5M12 9V3M18 9V3.5M5 9h14';

/* one point on the surface, by angle in radians rather than by meridian, so a
   ring can be sampled as finely as it needs to be to read as an ellipse. */
function conePtA(q,a,W,H){
 var cx=W/2, cy=H/2, U=Math.min(W,H)/2;
 var t=(clamp(q,0,100)-50)/50;                    /* -1 at the floor, 1 at the crown */
 var y=t*U*coneH();
 /* THE FIGURE IS TERMINATED AT BOTH ENDS. Ruled.

    It was two true cones opening away from the waist, so the widest part of
    the drawing was the two extremes and the figure ran off its own ends with
    nothing closing them. Source and the blueprint are points, not openings:
    a person at a hundred is at one place, and a person at zero is at one
    place. Width is how far a behaviour has travelled from the quality it
    started as, and at either pole there is nowhere left to have travelled.

    So the radius opens out of the neck, reaches its widest around two thirds
    of the way to each pole, and closes to a point at both. A spindle rather
    than an hourglass. The neck survives because the median range is the one
    part of the scale most people are standing in and it needs width to be
    read as a band. */
 /* AN ARROW UP AND AN ARROW DOWN. Ruled: "the shape is wrong. It is meant to
    be an arrow up and an arrow down. It is a compass. What is drawn is
    something else."

    He is right and the spindle above is what he was looking at. A sine
    through the half gives a smooth bulge that peaks halfway and eases back,
    which is a lens, or a rugby ball, or a spindle. Nothing about it is an
    arrow, and an arrow is the one shape that says direction, which is the
    only thing a compass is for.

    Three sections each way, and the arithmetic is the drawing.

      shaft     out of the neck to ARROW_SHOULDER, holding a narrow constant
                width. A shaft is the part that is not saying anything yet.
      barb      a short flare from the shoulder to ARROW_HEAD, which is where
                the head is widest. Short, because a long flare is a bulge.
      point     a straight line from the widest part to nothing at the pole.
                Straight, not eased: an eased taper rounds the tip and a
                rounded tip is a balloon.

    The neck survives, for the reason it was put in. The median band is where
    most people stand and it needs width to be read as a band. So the shaft
    starts at the neck's width rather than at zero, and the two arrows meet
    on a band rather than on a point. */
 var at=Math.abs(t);
 var rad;
 if(at<=ARROW_SHOULDER){
  /* the shaft, tapering only slightly, so the neck still reads as the widest
     part of the middle rather than as a pinch in a parallel tube */
  rad=U*(CONE_NECK*(1-at/ARROW_SHOULDER*0.34));}
 else if(at<=ARROW_HEAD){
  var k=(at-ARROW_SHOULDER)/(ARROW_HEAD-ARROW_SHOULDER);
  rad=U*(CONE_NECK*0.66+(CONE_FLARE-CONE_NECK*0.66)*k);}
 else {
  var k2=(at-ARROW_HEAD)/(1-ARROW_HEAD);
  rad=U*CONE_FLARE*(1-k2);}
 var th=a+CONE.spin;
 var x3=Math.cos(th)*rad, z3=Math.sin(th)*rad;
 return {x:cx+x3,
  y:cy-y*Math.cos(coneTilt())+z3*Math.sin(coneTilt()),
  d:z3*Math.cos(coneTilt())+y*Math.sin(coneTilt())};}
/* coherence 0 to 100, meridian 0 to 7 */
function conePt(q,mer,W,H){return conePtA(q,mer*(Math.PI*2/8),W,H);}
/* the ring at one coherence, sampled finely enough to be a curve */
function coneRing(q,W,H){
 var out=[]; for(var i=0;i<=48;i++)out.push(conePtA(q,i*(Math.PI*2/48),W,H)); return out;}
function coneDraw(){
 var c=CONE.cv, g=CONE.g; if(!c||!g)return;
 var W=c.width/CONE.dpr, H=c.height/CONE.dpr;
 var ink=INK(), gc=GOLDC(), rc=hx(PAL.Root);
 g.setTransform(CONE.dpr,0,0,CONE.dpr,0,0);
 g.clearRect(0,0,W,H);
 CONE.hits=[];
 var r=compute(), cq=r.unread?null:clamp(r.CQ,0,100);

 /* the rings, painted from the back so the near edge lands on top */
 [0,10,20,30,40,50,60,70,80,90,100].forEach(function(q){
  var pts=coneRing(q,W,H), mid=q===50;
  g.beginPath();
  pts.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);});
  g.strokeStyle=rgba(mid?gc:(q>50?gc:rc), mid?.5:.13);
  g.lineWidth=mid?1.6:1;
  g.stroke();});
 /* the waist band, which is the median range and the only place the reading
    crosses the line in both directions */
 (function(){
  var a=coneRing(40,W,H), b=coneRing(60,W,H);
  g.beginPath();
  a.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);});
  for(var i=b.length-1;i>=0;i--)g.lineTo(b[i].x,b[i].y);
  g.closePath(); g.fillStyle=rgba(ink,.05); g.fill();})();

 /* the eight meridians, each one a mirror axis, drawn floor to crown */
 MIRROR.forEach(function(m,i){
  g.beginPath();
  for(var q=0;q<=100;q+=4){var p=conePt(q,i,W,H); q?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);}
  var c2=hx(seatCol(m.seat));
  /* the far half dims, which is the only thing that makes a wireframe read as
     a solid rather than as a flat web */
  var mid=conePt(50,i,W,H);
  g.strokeStyle=rgba(c2,mid.d>=0?.42:.16); g.lineWidth=mid.d>=0?1.3:1; g.stroke();});

 /* where this person sits on each axis, and the ribbon joining them, which is
    the shape of the field rather than eight unrelated dots */
 var here=MIRROR.map(function(m,i){
  var grp=W_ADDR().filter(function(n){return n.b===m.seat;});
  var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
  var pos=mirrorAt(load,bandIg(m.seat));
  return {m:m, i:i, pos:pos, p:conePt(pos,i,W,H),
   c:hx(seatCol(m.seat)), cd:coneDull(hx(seatCol(m.seat)))};});
 if(!r.unread){
  g.beginPath();
  here.forEach(function(h,i){i?g.lineTo(h.p.x,h.p.y):g.moveTo(h.p.x,h.p.y);});
  g.closePath();
  g.fillStyle=rgba(gc,.10); g.fill();
  g.strokeStyle=rgba(gc,.55); g.lineWidth=1.4; g.stroke();}

 /* THE SIXTEEN NAMES ARE OFF THE DRAWING. Ruled twice over and it took both
    rulings to see it.

    "No text over the hero graphic, ever" is the standing rule. And the names
    now sit left and right in their own rail, where they light up as the
    figure wheels round, which is the other ruling. Once they are in the rail
    they are on the drawing as well, which is sixteen words of duplication
    printed on top of the one thing the surface exists to show.

    Measured before this: 89 colliding pairs at 1600 wide, and no gate
    watching a single one of them, because a radial layout has no line
    breaking and a painted word cannot be measured by anything that measures
    markup. The rail has line breaking, the collide gate can see it, a screen
    reader can read it and a button can carry a control. All four were
    impossible while the names lived in a canvas.

    What stays on the figure is the figure: the eight seat coloured meridians,
    the ribbon joining where this person sits on each one, and a node at each
    position. A node is not text. */
 here.slice().sort(function(a,b){return a.p.d-b.p.d;}).forEach(function(h){
  if(r.unread)return;
  var near=(h.p.d>=0);
  /* the node nearest the viewer is larger, and the one facing the rail's lit
     row is larger again, so the rail and the drawing point at each other */
  var lit=(h.i===CONE.front);
  g.beginPath(); g.arc(h.p.x,h.p.y,lit?7:(near?5:3.6),0,Math.PI*2);
  g.fillStyle=rgba(h.c,near?1:.42); g.fill();
  if(lit){
   g.beginPath(); g.arc(h.p.x,h.p.y,12,0,Math.PI*2);
   g.strokeStyle=rgba(h.c,.45); g.lineWidth=1.2; g.stroke();}
  /* AND THE NODE IS THE TARGET NOW. The hit boxes used to sit on the painted
     names, thirty units wide, two per axis. One box per axis, on the node, is
     what is left once the names are gone. */
  CONE.hits.push({x:h.p.x,y:h.p.y,r:16,m:h.m,end:'up'});});

 /* the axis, and what sits at each end of it */
 (function(){
  var top=conePt(100,0,W,H), bot=conePt(0,0,W,H);
  var cy=H/2, U=Math.min(W,H)/2, hgt=U*coneH();
  g.beginPath(); g.moveTo(W/2,cy-hgt*Math.cos(coneTilt()));
  g.lineTo(W/2,cy+hgt*Math.cos(coneTilt()));
  g.strokeStyle=rgba(ink,.16); g.lineWidth=1; g.stroke();
  /* THE TWO ENDS CARRY THEIR SYMBOL.

     Ruled: a halo at Source, ego compression and a pitchfork at the
     blueprint. Both ends had a word and nothing else, on a figure whose whole
     job is to say that one end is the condition underneath and the other is
     the conditioning laid on top. A word is not that. Ring, not fill, like
     everything else with a name.

     The halo is a ring with nothing inside it, which is what Source is. Ego
     compression is a ring squeezed from both sides, which is what it does.
     The pitchfork stands beside it. */
  /* COHERENT AT THE TOP, DECOHERENT AT THE BOTTOM. Ruled, replacing Source
     and The blueprint. Those two named where the figure pointed; these two
     name what it measures, and they are the same two words every other
     surface in this product uses for the same axis. One word per concept.

     Halo above, pitchfork below, and nothing else on the axis. Ego
     compression was a third glyph on a two ended axis and it made the floor
     read as two ideas rather than one. */
  var ty=cy-hgt*Math.cos(coneTilt()), by=cy+hgt*Math.cos(coneTilt());
  coneGlyph(g,GL_HALO,W/2,ty-48,gc,.9);
  coneTxt(g,'Coherent',W/2,ty-26,13,gc,.9,600);
  coneTxt(g,'Decoherent',W/2,by+30,13,rc,.85,600);
  coneGlyph(g,GL_FORK,W/2,by+52,rc,.85);

  /* THE MEDIAN IS WHERE NEARLY EVERYONE IS STANDING, SO PUT THEM IN IT.

     Forty to sixty is oscillating and that is most people. The figure said
     "the median range" in three words at the waist and drew an empty neck, so
     a person reading their own number at forty four had no way to see they
     were standing in a crowd. Being told you are typical and being shown it
     are different readings, and only one of them lands.

     There are souls in the band now, each drifting on its own phase, so the
     band moves the way a band of oscillating people moves. They are not data
     about anybody: they are the shape of the range, and the caption says the
     range rather than letting a dot be mistaken for a person. */
  /* THE BAND BECOMES A ROOM. Ruled, from pass 7, and he said it directly.

     It was a wash: a radial gradient behind the waist, fading at the edges so
     it would not read as a panel. That solved the panel and left a smudge.
     A smudge is not somewhere a person is standing, and standing in it with
     everybody else is the whole reading the band exists to give.

     A room is the same two rings with the space between them built. The ring
     at forty is its floor and the ring at sixty is its ceiling, so those are
     drawn as the ellipses the projection already gives. Twenty four uprights
     join them, which is what turns two ellipses into a volume rather than two
     ellipses. The far half of the wall is dimmer than the near half, which is
     the only thing that makes a wireframe read as something you are inside
     rather than something you are looking at. The floor takes a faint fill so
     there is ground under the souls.

     Nothing here is new data. It is the same forty and sixty, built. */
  var ROOM=24;
  var rFl=[], rCe=[];
  for(var ri=0;ri<=ROOM;ri++){
   var ra=ri/ROOM*Math.PI*2;
   rFl.push(conePtA(40,ra,W,H)); rCe.push(conePtA(60,ra,W,H));}
  /* the floor, filled, so the souls have ground rather than air */
  g.beginPath();
  rFl.forEach(function(pt,i){i?g.lineTo(pt.x,pt.y):g.moveTo(pt.x,pt.y);});
  g.closePath(); g.fillStyle=rgba(ink,.055); g.fill();
  /* the uprights, each one dimmed by its own depth */
  for(var wi=0;wi<ROOM;wi++){
   var nearW=(rFl[wi].d>=0);
   g.beginPath(); g.moveTo(rFl[wi].x,rFl[wi].y); g.lineTo(rCe[wi].x,rCe[wi].y);
   g.strokeStyle=rgba(ink,nearW?.17:.07); g.lineWidth=1; g.stroke();}
  /* and the floor and ceiling edges, which are what close it */
  [[rFl,.30],[rCe,.20]].forEach(function(pair){
   g.beginPath();
   pair[0].forEach(function(pt,i){i?g.lineTo(pt.x,pt.y):g.moveTo(pt.x,pt.y);});
   g.strokeStyle=rgba(ink,pair[1]); g.lineWidth=1.2; g.stroke();});
  /* and the souls read. At .17 they were under the grain of the ground. */
  for(var si=0;si<18;si++){
   var ph=si*2.399963, spd=0.20+((si*37)%11)/38;
   var sw=Math.sin(CONE.t*spd+ph);
   var sp2=conePtA(50+sw*9.2,ph+CONE.spin*0.4,W,H);
   g.beginPath(); g.arc(sp2.x,sp2.y,2.1,0,Math.PI*2);
   g.fillStyle=rgba(ink,.34+sw*0.14); g.fill();}
  /* AND ITS CAPTION IS NOT PRINTED ON THE DRAWING. Same rule as the sixteen
     names and the coherence number. It is tool information, which may sit
     under the figure, so it does: coneHint carries it as markup below the
     canvas, where it wraps, where it can be read by something that is not an
     eye, and where it is not lying across the band it describes. */})();

 /* the reading itself, on the axis at its own height */
 /* ============================================================
    THE SIX AXIS ARROWS. Three up regulate and three down.

    The owner: "there are some characters going up and some going down, and
    this is the core of our integrity. Up means up regulation, down means
    down regulation, and there is something about the nervous system with
    this compass, and the spine."

    So they are drawn on the axis, which is the spine of the figure, and they
    are the reading rather than an ornament: the three that up regulate are
    the three highest laws and the three that down regulate are the three
    lowest, taken from S.law, which is already the twenty one measurements
    this instrument makes about moral integrity. Each one sits at its own
    height by its own value. Off by default, because the figure is already
    carrying sixteen names.
    ============================================================ */
 if(CONE.reg){
  var cyR=H/2, UR=Math.min(W,H)/2, hR=UR*coneH();
  var laws=SI.map(function(l){return {nm:l.nm,v:S.law[l.nm]||0,b:l.b};})
   .sort(function(a,b){return b.v-a.v;});
  var up=laws.slice(0,3), dn=laws.slice(-3).reverse();
  var arrow=function(x,y,dir,c,nm,v){
   var L=13;
   g.beginPath();
   g.moveTo(x,y+dir*L); g.lineTo(x,y-dir*L);
   g.moveTo(x-4,y-dir*(L-5)); g.lineTo(x,y-dir*L); g.lineTo(x+4,y-dir*(L-5));
   g.strokeStyle=rgba(c,.88); g.lineWidth=1.7;
   g.lineCap='round'; g.lineJoin='round'; g.stroke(); g.lineCap='butt';
   coneTxt(g,nm.toLowerCase(),x+(dir>0?16:16),y+4,10.5,c,.8,500,'left');
   coneTxt(g,v.toFixed(1),x-16,y+4,10.5,c,.55,400,'right');};
  up.forEach(function(l,i){
   var y=cyR-hR*0.52*Math.cos(coneTilt())+i*24-24;
   arrow(W/2-96,y,1,hx(PAL[l.b]||PAL.Heart),l.nm,l.v);});
  dn.forEach(function(l,i){
   var y=cyR+hR*0.32*Math.cos(coneTilt())+i*24;
   arrow(W/2-96,y,-1,hx(PAL.Root),l.nm,l.v);});
  coneTxt(g,'up regulating',W/2-96,cyR-hR*0.52*Math.cos(coneTilt())-42,10,ink,.42,500);
  coneTxt(g,'down regulating',W/2-96,cyR+hR*0.32*Math.cos(coneTilt())+86,10,ink,.42,500);}

 /* ============================================================
    THE LAYERS. What compression over time looks like.

    Dante's Inferno and the Paradiso as the suggestion, which is the owner's
    own reference: the lower compass is what happens as these behaviours are
    adopted, and the upper is what happens as they are released. Nine bands
    each way, drawn as the rings the figure already has, named, so the
    structure a person is standing inside has a name at every level.
    ============================================================ */
 if(CONE.layers){
  var LO=['Limbo','Lust','Gluttony','Greed','Wrath','Heresy','Violence','Fraud','Treachery'];
  var HI=['Moon','Mercury','Venus','Sun','Mars','Jupiter','Saturn','Stars','Primum'];
  var cyL=H/2, UL=Math.min(W,H)/2;
  HI.forEach(function(nm,i){
   var q=55+i*5, p2=conePtA(q,Math.PI/2,W,H);
   coneTxt(g,nm.toLowerCase(),W/2+UL*0.60,p2.y+3,9.5,gc,.30+i*0.035,400,'left');});
  LO.forEach(function(nm,i){
   var q=45-i*5, p2=conePtA(q,Math.PI/2,W,H);
   coneTxt(g,nm.toLowerCase(),W/2-UL*0.60,p2.y+3,9.5,rc,.30+i*0.035,400,'right');});
  coneTxt(g,'released',W/2+UL*0.60,conePtA(100,Math.PI/2,W,H).y-6,10,gc,.5,500,'left');
  coneTxt(g,'compressed',W/2-UL*0.60,conePtA(0,Math.PI/2,W,H).y+10,10,rc,.5,500,'right');}

 /* ============================================================
    THE OSCILLATION PLOT IS OUT OF THE LOWER LEFT. Ruled.

    "All that information on the lower left, I'm not certain what made you put
    that there, considering the right hand side is our information layer."

    He is right twice. It is an information layer facing the one this product
    already has, and it was a chart drawn into a canvas, where it could not be
    clicked, could not be read by anything but an eye, and could not carry a
    control of its own.

    It has not been deleted, it has been moved and given what it never had.
    coneGraph draws the same series in the information column as real markup,
    the spans run day to five years rather than three fixed windows, and it is
    a door: pressing it opens the summary, where the long version of the same
    reading lives. seriesRead in the engine is the one reader for both.
    ============================================================ */

 if(cq!==null){
  var cyy=H/2, U2=Math.min(W,H)/2;
  /* THE MARKER OSCILLATES IN YOUR OWN RANGE. Ruled: "a dot, a circle,
     oscillating across the range the data says is yours, and showing where
     most people oscillate."

     It used to swing plus or minus 2.4 for anybody between forty and sixty
     and hold still for everybody else. That is a decoration, not a reading:
     the same wobble for two people with nothing in common, and none at all
     for somebody who genuinely swings twenty points between forty and
     seventy. The range is the person's own history, which the engine already
     reads for the graph in the information column, so this asks the same
     reader rather than owning a second one.

     Three states, and they are honestly different. No history is no claim, so
     the marker holds still. One reading is a point and not a range, so it
     also holds still. Two or more is a range and it swings the width of it.

     WHERE MOST PEOPLE OSCILLATE is drawn as well, as the pair of ticks at
     forty and sixty on the axis, so a person can see their own swing against
     the common one instead of being told about it. */
  var mine=null;
  try{ var sr2=seriesRead(CURP,CONE.span,Date.now());
       if(sr2.state==='line'&&sr2.hi>sr2.lo)mine={lo:sr2.lo,hi:sr2.hi}; }catch(e){}
  var yOf=function(q){return cyy-(((q-50)/50)*U2*coneH())*Math.cos(coneTilt());};
  /* THE COMMON RANGE, as two ticks rather than a third band. The waist
     already fills forty to sixty and a second fill on top of it would read as
     one wider band. */
  [40,60].forEach(function(q){
   var ty2=yOf(q);
   g.beginPath(); g.moveTo(W/2-15,ty2); g.lineTo(W/2-9,ty2);
   g.moveTo(W/2+9,ty2); g.lineTo(W/2+15,ty2);
   g.strokeStyle=rgba(ink,.30); g.lineWidth=1; g.stroke();});
  var osc=0;
  if(mine){
   var half=(mine.hi-mine.lo)/2, mid=(mine.hi+mine.lo)/2;
   osc=(mid-cq)+Math.sin(CONE.t*0.55)*half;
   /* the person's own range, drawn on the axis as the span it is */
   var ya=yOf(mine.hi), yb=yOf(mine.lo);
   g.beginPath(); g.moveTo(W/2,ya); g.lineTo(W/2,yb);
   g.strokeStyle=rgba(cq>=50?gc:rc,.34); g.lineWidth=3; g.stroke();
   [ya,yb].forEach(function(yy){
    g.beginPath(); g.moveTo(W/2-7,yy); g.lineTo(W/2+7,yy);
    g.strokeStyle=rgba(cq>=50?gc:rc,.55); g.lineWidth=1.4; g.stroke();});}
  var my=yOf(cq+osc);
  if(osc){
   g.beginPath(); g.arc(W/2,my,13,0,Math.PI*2);
   g.strokeStyle=rgba(cq>=50?gc:rc,.22); g.lineWidth=1; g.stroke();}
  g.beginPath(); g.arc(W/2,my,7,0,Math.PI*2);
  g.fillStyle=rgba(cq>=50?gc:rc,.95); g.fill();}}
 /* NO TEXT OVER THE HERO GRAPHIC, EVER. Standing rule, and this is where it
    was broken worst: the coherence number was printed in 15 point beside the
    marker, in the middle of the figure, saying 39 and nothing else. Two
    faults in one. It sat on the drawing, and it was a number with no scale,
    which is the thing the copy editor rule exists to stop.

    Nothing is lost by taking it off. coneRead already prints the same reading
    in the information column, where it says what it is out of and which side
    of the band it falls on. The marker keeps its position and its oscillation,
    which is what the figure is for. */
/* THE DESATURATED TWIN OF A SEAT COLOUR, for the inverted pole.

   Ruled: "the opposites take the dark version of the light colours, and they
   stay legible and visible." Legible is the constraint, so this pulls
   saturation out and leaves lightness alone rather than multiplying the
   channels down, which is what turns a seat colour into mud at the floor of
   a dark figure. It takes an rgb triple and returns one. */
function coneDull(c){
 if(!c||c.length<3)return c;
 var r=c[0],g2=c[1],b=c[2];
 var l=0.2126*r+0.7152*g2+0.0722*b;          /* the colour's own lightness */
 var k=0.42;                                  /* how much hue survives */
 return [Math.round(l+(r-l)*k), Math.round(l+(g2-l)*k), Math.round(l+(b-l)*k)];}
/* one pole glyph, on the 24 unit grid every other icon in this product uses */
function coneGlyph(g,p,x,y,c,a){
 if(!p||a<0.06)return;
 var sc=17/24;
 g.save(); g.translate(x-17/2,y-17/2); g.scale(sc,sc);
 g.strokeStyle=rgba(c,a); g.lineWidth=1.8/sc;
 g.lineJoin='round'; g.lineCap='round'; g.fillStyle='transparent';
 try{g.stroke(new Path2D(p));}catch(e){}
 g.restore();}
function coneTxt(g,s,x,y,size,c,a,w,align){
 g.save(); g.font=(w||400)+' '+size+"px Inter, system-ui, sans-serif";
 g.textAlign=align||'center'; g.textBaseline='middle';
 g.fillStyle=rgba(c,a); g.fillText(s,x,y); g.restore();}
/* the wheel's own address list, named once so the cone does not reach for a
   global whose name might move */
function W_ADDR(){return W;}
/* nearest pole under the pointer, or nothing. Drawn front to back, so the
   nearest match wins rather than the first one found. */
function coneHit(x,y){
 var best=null,bd=1e9;
 (CONE.hits||[]).forEach(function(h){
  var d=Math.hypot(x-h.x,y-h.y);
  if(d<=h.r&&d<bd){bd=d;best=h;}});
 return best;}
function coneLayout(){
 var c=CONE.cv; if(!c)return;
 var b=c.getBoundingClientRect();
 CONE.dpr=Math.min(devicePixelRatio||1,2);
 c.width=Math.max(1,b.width*CONE.dpr); c.height=Math.max(1,b.height*CONE.dpr);}
/* WHICH AXIS IS NEAREST THE VIEWER. The meridians sit at even eighths of a
   turn from the spin, so the front one is whichever eighth the spin has
   reached. It is read rather than tracked, so it cannot fall out of step with
   what is drawn. */
function coneFront(){
 /* the projection puts a meridian nearest the viewer when sin of its angle is
    one, so axis i is at the front when i eighths plus the spin reach a
    quarter turn. Read off the same arithmetic conePtA uses, not a second
    convention that could drift from it. */
 var per=Math.PI*2/8;
 var i=Math.round((Math.PI/2-CONE.spin)/per)%8; if(i<0)i+=8;
 return i;}
/* THE SPIN A NAME IS ASKING FOR. Turning axis i to the front means the spin
   has to reach minus i eighths, and it has to get there the short way round
   or a hover on the neighbour sends the figure most of a turn backwards. */
function coneAimAt(i){
 var per=Math.PI*2/8, want=Math.PI/2-i*per, turn=Math.PI*2;
 var d=((want-CONE.spin)%turn+turn)%turn;
 if(d>Math.PI)d-=turn;
 CONE.spinTo=CONE.spin+d;}
function coneTick(){
 if(!CONE.open)return;
 /* EASED, NEVER SNAPPED. Ruled. Twelve per cent of the remaining distance a
    frame settles inside about a third of a second, which is quick, and it
    arrives rather than stopping. The target is released once it is close
    enough to see, and the idle drift takes over again. */
 if(CONE.spinTo!==null&&!CONE.drag){
  var gap=CONE.spinTo-CONE.spin;
  if(Math.abs(gap)<0.004){CONE.spin=CONE.spinTo; CONE.spinTo=null;}
  else CONE.spin+=gap*0.12;}
 else if(!REDUCED&&!CONE.drag)CONE.spin+=0.0022;
 {var f=coneFront();
  if(f!==CONE.front){CONE.front=f; coneNamesSync();}}
 /* the figure had a spin and no clock. Anything that has to breathe rather
    than turn needs its own time, and the band of souls at the median does. */
 if(!REDUCED)CONE.t+=1/60;
 coneDraw();
 CONE.raf=requestAnimationFrame(coneTick);}
/* TWO WAYS IN, ONE FIGURE. As a modal it is what a drill opens, over the top
   of whatever a person was reading, and it closes back to that. As a tab it is
   a surface inside the stage with no backdrop and no close button, because
   closing a tab leaves a person looking at nothing. inTab is the only
   difference and it changes where the host sits, not what is drawn. */
/* THE PARAGRAPH UNDER THE COMPASS WAS A DESCRIPTION OF THE DRAWING.

   "Eight qualities. Each one runs clean at the crown and inverted at the
   floor, and the figure is widest where a behaviour has travelled furthest
   from the quality it started as." Every clause of that is about the picture.
   A person who can see the picture does not need it, and a person who cannot
   is not helped by it. Nothing in it was about them.

   What goes there is the reading, and the loop it sits in.

   Integrity is the hull. A hole in the hull means the ship takes on water,
   which is the codex's own image and the reason integrity is measured at all.
   Integrity raises coherence. Coherence raises what a person can hold to,
   which raises integrity again. It is a loop that turns either way, and the
   whole instrument is pointed at which way it is turning for you. You float
   the ship out of the water so that it can float.

   So: where you are, which way the loop is running, and the one axis
   furthest from its own quality. Three facts about the person, then one line
   on how to turn the figure. */
function coneRead(){
 var r=compute();
 if(r.unread)return '<p class="cone-p">Nothing has been read yet. '
  +'Write what happened, or answer the questions, and your position on this '
  +'figure fills in. Drag to turn it. Click any name to read that axis.</p>';
 var cq=Math.round(r.CQ);
 var band=cq>=60?'above the oscillating band':cq<=40?'below the oscillating band'
  :'inside the oscillating band, where most people stand';
 var rising=r.Ig>=5;
 /* EVERY NUMBER SAYS WHAT IT IS OUT OF. His instruction, and this line broke
    it twice: "you read 88" and "integrity 9.3" with nothing to measure either
    against. Coherence runs nought to a hundred and integrity runs nought to
    ten, which are two different scales printed side by side in one sentence,
    so a reader with no scale is not being vague at, they are being misled. */
 return '<p class="cone-p">You read <b>'+cq+' out of 100</b>, '+band+'.</p>'
  +'<p class="cone-p">Integrity <b>'+r.Ig.toFixed(1)+' of 10</b>. '
  +'Coherence <b>'+cq+' of 100</b>.</p>'
  +'<p class="cone-p">Integrity is the hull. A hole in it means the ship takes '
  +'on water, and everything above the waterline stops mattering. Integrity '
  +'raises coherence, coherence raises what you can hold to, and that raises '
  +'integrity again. The loop turns both ways. Yours is currently turning '
  +'<b>'+(rising?'up':'down')+'</b>. You are floating the ship out of the '
  +'water so that it can float.</p>'
  ;}

/* ============================================================
   COHERENCE OVER TIME. The span buttons become a graph.

   Ruled: "the 30 day, quarter and year, we want a 2D graph representation on
   the lower right hand side, and when you cycle through you can see your
   progress in graph form. And if you click on that it'll take you to the
   summary page."

   The series comes from the engine, which reads it out of the snapshots that
   were already being written and that nothing was drawing.

   A GRAPH OF ONE POINT IS A FLAT LINE, AND A FLAT LINE IS A CLAIM. It says
   nothing changed. One reading is not that, so the empty and the single point
   states say what they are instead of drawing an axis.
   ============================================================ */
function coneGraph(){
 var sr=seriesRead(CURP,CONE.span,Date.now());
 var h='<div class="cn-gr" id="cngraph">'
  +'<div class="cn-gh"><span class="pm-eye">Coherence Over Time</span>'
  +'<div class="cn-spans">'
  +SPANS.map(function(sp){
    return '<button type="button" class="cn-sb'+(sp.k===CONE.span?' on':'')+'" '
     +'data-cnspan="'+sp.k+'" aria-pressed="'+(sp.k===CONE.span)+'">'
     +esc(sp.nm)+'</button>';}).join('')
  +'</div></div>';
 if(sr.state==='none'){
  h+='<p class="cn-gp">Nothing on the record for this span. Every save writes a '
   +'point, so this fills in as you go.</p>';}
 else if(sr.state==='one'){
  h+='<p class="cn-gp">One reading in this span, at <b>'+Math.round(sr.last)+'</b>. '
   +'Two makes a line.</p>';}
 else {
  /* the axis is the range that is actually there, with a floor of ten points
     so a quiet month does not draw as a cliff. */
  var lo=Math.min(sr.lo,sr.hi-10), hi=Math.max(sr.hi,sr.lo+10);
  var span=hi-lo||1, t0=sr.t0, tspan=(sr.t1-sr.t0)||1;
  var pts=sr.pts.map(function(p){
   return {x:((p.ms-t0)/tspan*100), y:(100-((p.cq-lo)/span*100))};});
  var d=pts.map(function(p,i){
   return (i?'L':'M')+p.x.toFixed(2)+','+p.y.toFixed(2);}).join(' ');
  var area=d+' L'+pts[pts.length-1].x.toFixed(2)+',100 L'+pts[0].x.toFixed(2)+',100 Z';
  var col=sr.dir==='down'?'var(--bad)':(sr.dir==='up'?'var(--good)':'var(--accent)');
  h+='<svg class="cn-gsvg" viewBox="0 0 100 100" preserveAspectRatio="none" '
   +'aria-label="Coherence over the last '+esc(sr.span.nm.toLowerCase())+'">'
   +'<path d="'+area+'" fill="'+col+'" opacity=".12"/>'
   +'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="1.6" '
   +'vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>'
   +'</svg>'
   /* THE NUMBERS ARE PRINTED, NOT HOVERED. A phone has no hover, and the
      reading a person came for is the two ends and the direction. */
   +'<div class="cn-gf"><span>'+Math.round(sr.first)+'</span>'
   +'<b>'+(sr.dir==='up'?'up':(sr.dir==='down'?'down':'level'))+'</b>'
   +'<span>'+Math.round(sr.last)+'</span></div>';}
 h+='<button type="button" class="cn-gmore" id="cngomore">Open the summary</button>';
 return h+'</div>';}
/* ============================================================
   THE NAMES SIT LEFT AND RIGHT, AND LIGHT UP AS YOU WHEEL ROUND.

   Ruled: "the names sit left and right and light up as you wheel round.
   Hovering one spins the figure to that person, quickly, and never snaps."

   Sixteen names were drawn into the canvas and nowhere else, which cost three
   things. They collide, because a radial layout has no line breaking and
   nothing watches them. They cannot be read by anything but an eye, so the
   whole axis list was invisible to a screen reader and to a search. And they
   could not carry a control, so the figure had to grow its own hit testing to
   make a painted word behave like a button.

   Four axes each side, in their seat colours, with the inversion under its
   own coherent pole so a mirror pair reads as one row rather than two lists.
   The row nearest the viewer lights. Hovering a row aims the figure at it and
   the ease does the rest.
   ============================================================ */
function coneNames(side){
 var half=MIRROR.map(function(m,i){return {m:m,i:i};})
  .filter(function(x){return side==='l'?(x.i<4):(x.i>=4);});
 return '<div class="cn-nms cn-nms-'+side+'">'
  +half.map(function(x){
   var c=seatCol(x.m.seat), cd=rgbcss(coneDull(hx(c)));
   return '<button type="button" class="cn-nr" data-cnax="'+x.i+'" '
    +'style="--ax:'+c+';--axd:'+cd+'" '
    +'title="Turn the figure to '+esc(x.m.up)+' and '+esc(x.m.dn)+'">'
    /* IF IT HAS A NAME IT HAS AN ICON. Standing rule, and the rail would have
       broken it the moment the names came off the canvas, where both poles
       were drawn with their glyph beside them. The same two paths come with
       them. One 24 unit grid, ring not fill, like every other icon here. */
    +'<span class="cn-nq">'+esc(x.m.q)+'</span>'
    +'<span class="cn-nu">'+cnGl(x.m.ic)+esc(x.m.up)+'</span>'
    +'<span class="cn-nd">'+cnGl(x.m.dic)+esc(x.m.dn)+'</span>'
    +'</button>';}).join('')
  +'</div>';}
/* one rgb triple as a css colour, so the desaturated twin can be handed to
   the sheet the same way the seat colour is */
function rgbcss(c){return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}
/* one mirror glyph as markup. currentColor, so the row's own colour carries
   it and the icon can never disagree with the name beside it. */
function cnGl(d){
 if(!d)return '';
 return '<svg class="cn-gl" viewBox="0 0 24 24" aria-hidden="true">'
  +'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.7" '
  +'stroke-linecap="round" stroke-linejoin="round"/></svg>';}
/* WHICH ROW IS LIT, updated from the tick rather than from a repaint. Redrawing
   the rail every frame would rebuild sixteen buttons sixty times a second and
   throw away the hover the person is currently on. */
function coneNamesSync(){
 var rows=document.querySelectorAll('[data-cnax]');
 for(var i=0;i<rows.length;i++)
  rows[i].classList.toggle('front',+rows[i].getAttribute('data-cnax')===CONE.front);}
function coneOpen(inTab){
 var h=document.getElementById('cone'); if(!h)return;
 CONE.open=true; CONE.tab=!!inTab;
 h.classList.toggle('tabmode',!!inTab);
 h.style.display='flex';
 h.innerHTML='<div class="cone-card">'
  +'<div class="cone-hd"><span class="pm-eye">The compass</span>'
  +(inTab?'':'<button class="btn" id="conex">Close</button>')+'</div>'
  /* THE FIGURE, AND THE CONTROLS ON IT. Ruled: the switches go to the upper
     left. They sat under the drawing in a row of their own, which cost a band
     of the stage and put the control further from the thing it changes.

     Each one says what it does now. "Flat" told a person nothing, which is
     exactly what he reported: he did not know what those buttons were for. */
  +'<div class="cone-body"><div class="cone-fig">'
   +coneNames('l')+coneNames('r')
   +'<canvas id="conecv" class="cone-cv" role="img" '
   +'aria-label="Two cones meeting at the median. Eight axes, each with a coherent pole above and its inversion below."></canvas>'
   +'<div class="cone-ctl">'
    +'<button type="button" class="cn-b" data-cn="flat" '
     +'title="Take the tilt out and look straight down on the figure">Flat</button>'
    +'<button type="button" class="cn-b" data-cn="reg" '
     +'title="Show which axes are regulating you up and which are regulating you down">Regulation</button>'
    +'<button type="button" class="cn-b" data-cn="layers" '
     +'title="Show the rings the axes are stacked on">Layers</button>'
   +'</div>'
   /* THE TOOL SAYS WHAT IT IS, UNDER THE FIGURE. Ruled: the bottom
      information goes right unless it is about the tool. These two lines are
      about the tool, so they may stay under it. The reading does not, and
      does not. */
   +'<p class="cone-hint">The waist is 40 to 60 out of 100, where most people '
   +'oscillate. Drag to turn the figure. Press any name to read that axis.</p>'
  +'</div>'
  /* THE INFORMATION LAYER LEFT THE CENTRE COLUMN, and the comment that used to
     sit here is why it had to.

     It said the information layer is on the right, which is his standing rule,
     and then put the column on the right OF THE CARD. The card is in the centre
     stage, so a thousand one hundred characters of prose were sitting in the
     column he had reserved for hero art, and the figure was down to 528 pixels
     of a 920 pixel card to make room for them.

     His words: "You have a ton of information on the right of the compass where
     it says you read 42 out of 100 inside an oscillating band, where I told you
     specifically that the centre column is for hero art. All that text,
     including integrity is the hull and a hole means the ship takes on water,
     that is all information that belongs in the information pane."

     Right of the card is not the information pane. The information pane is the
     rail, which is where every other reading in this product opens. So the
     reading, the record and the graph go there through the same shell the
     drills use, which also gives them the back control every other panel got
     this round. The centre column holds the figure and the controls that change
     it, and nothing else. */
  /* two closers, not three. The third belonged to cone-info, which is gone.
     The build's div counter caught it before anything ran. */
  +'</div></div>';
 /* THE READING, THE RECORD AND THE GRAPH, IN THE RAIL. Pushed after the card
    is in the document, because coneGraph measures. Not pushed when the compass
    is a sheet over another surface, since the rail belongs to what is behind
    it and overwriting that would take away the thing a person was reading. */
 if(inTab&&typeof rdShell==='function')
  rdShell('<div class="cone-read">'+coneRead()+'</div>'
   +'<div class="cone-rec">'+ladderHtml()+'</div>'+coneGraph());
 CONE.cv=document.getElementById('conecv');
 CONE.g=CONE.cv?CONE.cv.getContext('2d'):null;
 coneLayout(); coneTick();
 var x=document.getElementById('conex'); if(x)x.onclick=coneClose;
 /* the ladder's one control opens the builder that already exists. It does not
    write a ritual of its own: two places that can put a day on the record is
    two places the streak can be wrong from. */
 var lb=document.getElementById('ldrit');
 if(lb)lb.onclick=function(){if(typeof ritOpen==='function')ritOpen(null);};
 /* the four switches. Each toggles a reading on the figure and repaints the
    card, so the state of the button and the state of the drawing cannot
    disagree. */
 h.querySelectorAll('[data-cn]').forEach(function(b){
  var k=b.getAttribute('data-cn');
  b.setAttribute('aria-pressed',!!CONE[k]);
  b.classList.toggle('on',!!CONE[k]);
  b.onclick=function(){CONE[k]=!CONE[k]; coneOpen(CONE.tab);};});
 h.querySelectorAll('[data-cnspan]').forEach(function(b){
  var k=b.getAttribute('data-cnspan');
  b.onclick=function(){CONE.span=k; coneOpen(CONE.tab);};});
 /* HOVER AIMS, PRESS READS. Aiming on hover is what he asked for and it must
    not also open something: a pointer crossing the rail on its way somewhere
    else would fire four drills. Leaving the rail releases the target and the
    idle drift resumes from wherever it had got to, which is why it never
    snaps back either. */
 h.querySelectorAll('[data-cnax]').forEach(function(b){
  var i=+b.getAttribute('data-cnax');
  b.onmouseenter=function(){coneAimAt(i);};
  b.onfocus=function(){coneAimAt(i);};
  b.onmouseleave=function(){CONE.spinTo=null;};
  b.onclick=function(){
   var m=MIRROR[i]; if(!m)return;
   coneAimAt(i);
   if(typeof runTeacherDrill==='function')runTeacherDrill(m,'up');};});
 coneNamesSync();
 /* the graph is a door onto the long version of itself. Ruled. */
 var gm=document.getElementById('cngomore'), gr=document.getElementById('cngraph');
 function toSum(){setTab(TAB.SUMMARY);}
 if(gm)gm.onclick=function(e){e.stopPropagation();toSum();};
 if(gr)gr.onclick=toSum;
 if(CONE.cv){
  CONE.cv.onpointerdown=function(e){CONE.drag={x:e.clientX,y:e.clientY,
   s:CONE.spin,t:CONE.tilt,moved:false};
   /* a pointer that has already been released cannot be captured, and the
      throw would take the handler down with it. The wheel learned this. */
   try{CONE.cv.setPointerCapture(e.pointerId);}catch(err){}};
  /* what is under the pointer, so a pole lights before it is pressed */
  CONE.cv.onpointermove=function(e){
   var b=CONE.cv.getBoundingClientRect();
   var x=e.clientX-b.left, y=e.clientY-b.top;
   if(!CONE.drag){
    var h=coneHit(x,y);
    CONE.cv.style.cursor=h?'pointer':'grab';
    if(h!==CONE.hover){CONE.hover=h;coneDraw();}
    return;}
   CONE.drag.moved=CONE.drag.moved
    ||Math.hypot(e.clientX-CONE.drag.x,e.clientY-CONE.drag.y)>4;
   CONE.spin=CONE.drag.s+(e.clientX-CONE.drag.x)*0.008;
   /* the vertical never tilts past the point where up stops reading as up */
   CONE.tilt=clamp(CONE.drag.t+(e.clientY-CONE.drag.y)*0.004,0.08,0.92);
   coneDraw();};
  CONE.cv.onpointerup=function(e){
   var was=CONE.drag; CONE.drag=null;
   if(was&&!was.moved){
    var b=CONE.cv.getBoundingClientRect();
    var h=coneHit(e.clientX-b.left,e.clientY-b.top);
    if(h)runTeacherDrill(h.m,h.end);}};
  CONE.cv.onpointercancel=function(){CONE.drag=null;};
  }
 addEventListener('resize',coneLayout);}
function coneClose(){
 CONE.open=false; CONE.tab=false; CONE.drag=null;
 if(CONE.raf)cancelAnimationFrame(CONE.raf);
 var h=document.getElementById('cone');
 if(h){h.style.display='none';h.innerHTML='';h.classList.remove('tabmode');}
 removeEventListener('resize',coneLayout);}

/* ============================================================
   THE LADDER, ON THE COMPASS.

   It goes here because the compass is already the surface that answers over
   time: it carries the oscillation history across thirty, ninety and three
   hundred and sixty five days. What you have done belongs beside where you are
   pointed. It does not go on Summary, which is the reading, and a reading is
   not a record of effort.

   Three parts, and the order is deliberate. The streak first, because it is
   the one number a person checks. The ledger under it, four quantities that
   only count things that happened. Then the marks earned, and one line naming
   the next.

   NOTHING HERE PRINTS A COUNT AGAINST A TOTAL. Sixteen marks exist and the
   surface never says sixteen. Earned ones are shown, the next is named with
   what it takes, and the rest are not enumerated, because a list of a person's
   unfinished self is a completion bar and this is not a game about becoming
   whole.
   ============================================================ */
function ladderHtml(){
 var L=ladderRead(CURP,Date.now()), s=L.streak, l=L.ledger;
 var h='<div class="ld"><div class="pm-eye">The record</div>';
 /* the streak. A run that has lapsed still says what it was, because the
    thing a person built is not deleted by their having stopped. */
 h+='<div class="ld-streak'+(s.live?' live':'')+'">'
  +'<span class="ld-n">'+s.run+'</span>'
  +'<span class="ld-u">'+(s.run===1?'day':'days')+(s.live?' running':' , last run')+'</span>'
  +'</div>';
 if(!s.days)
  h+='<p class="ld-p">Nothing on the record yet. Build one ritual and save it, '
   +'and the first day is on.</p>';
 else if(!s.live)
  h+='<p class="ld-p">The run ended '+s.gap+' days ago. Longest held: '
   +s.best+'. Practise today and a new one starts.</p>';
 else if(s.best>s.run)
  h+='<p class="ld-p">Longest held: '+s.best+' days.</p>';
 /* THE ACCOUNTABILITY HALF. A record that only reports is a scoreboard. This
    says where today stands and hands over the one control that changes it, so
    a person is never told they are behind on a surface that cannot do
    anything about it. Today counts as done the moment a ritual is saved with
    today's date, which is the same fact the streak is counted from, so the two
    can never disagree. */
 h+='<div class="ld-acc">'
  +(s.gap===0
    ? '<span class="ld-on">Today is on the record.</span>'
    : '<span class="ld-off">Today is not on the record yet.</span>')
  +'<button type="button" class="btn'+(s.gap===0?'':' pri')+'" id="ldrit">'
  +(s.gap===0?'Run another':'Build today\'s ritual')+'</button></div>';
 /* the ledger. four counts of events, no denominators.

    "Minutes practised" was minutes planned, and it was the one label in the
    product claiming what the data did not carry: select the twenty minute scan,
    press save, close the tab, and it read twenty minutes practised. A saved
    ritual is now a plan and a ritual marked done is a thing that happened, and
    the two are separate counts. Planned only prints when there is a gap between
    them, because a person who does what they planned does not need to be told
    the two numbers agree. */
 var LG=[['Minutes practised',l.minutes]];
 if(l.planned>l.minutes)LG.push(['Minutes planned, not yet done',l.planned-l.minutes]);
 LG=LG.concat([['Rituals saved',l.rituals],
  ['Ground opened',l.ground+(l.ground===1?' address':' addresses')],
  ['Held at the far pole',l.clear+(l.clear===1?' address':' addresses')]]);
 h+='<div class="ld-led">'+LG.map(function(x){
  return '<div class="ld-r"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>';}).join('')+'</div>';
 /* the marks. icon, name, and what it meant. */
 if(L.earned.length){
  h+='<div class="pm-eye ld-mh">Marks</div><div class="ld-marks">';
  L.earned.forEach(function(m){
   h+='<div class="ld-m" style="--c:'+seatCol(m.b)+'" title="'+esc(m.d)+'">'
    +'<span class="ld-mi"><svg viewBox="0 0 24 24" aria-hidden="true">'
    +'<path d="'+m.ic+'"/></svg></span>'
    +'<span class="ld-mn">'+esc(m.nm)+'</span>'
    +'<span class="ld-md">'+esc(m.d)+'</span></div>';});
  h+='</div>';}
 if(L.next)
  h+='<p class="ld-next"><b>'+esc(L.next.nm)+'</b> '+esc(L.next.d)+'</p>';
 return h+'</div>';}
