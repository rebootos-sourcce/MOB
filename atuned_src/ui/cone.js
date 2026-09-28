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
 spinTo:null, front:0,
 /* side: the arrow figure above, which is no longer what the tab opens on.
    Round IA wired in the view from above (conePlan, further down) and the
    turned figure moved behind a switch rather than out of the build, because
    it carries a dozen of his rulings and nobody has ruled it away.
    hov: the axis a pointer is on, in the view from above, where nothing
    turns and so nothing else can say which rail row to light.
    mir: the springs the view from above draws from, kept across coneOpen so
    a release made on another surface is seen arriving, not already there. */
 side:false, hov:-1, mir:null,
 /* top: the view from above, round IA's B and C, behind its own switch now.
    nt: the needle's own tilt, kept apart from the arrow figure's so a drag
    on one never re-poses the other. t0: when the tab opened, which is what
    the needle's entrance is timed from, in milliseconds. */
 top:false, nt:0.30, t0:0,
 /* well: which of round KI's two gravity mockups the needle draws. Off is
    the pulse scaled by weight, round KH; on is the gravity well, round KG.
    A mockup switch for him to choose by looking, not a ruling. */
 well:false,
 /* heat: round KR's radiance overlay on the needle, off by default. The
    engine's radiance drawn through the whole volume of the figure, dimmed
    where a seat holds charge and where the field bends off the level
    (ndlHeatField, further down). A layer like Layers, not a mockup switch. */
 heat:false,
 /* shells: round KS's Registers, the fourth view, off by default. Seven
    shells of light, one per seat, drawn from the person's own addresses
    (coneRegisters, further down). A view like Top, so the two are never on
    together: pressing either one turns the other off. */
 shells:false,
 /* ZOOM, round KQ: "I want to be able to zoom in." z, zx and zy are what is
    drawn, the scale and the pan in canvas pixels about the canvas's centre;
    the T three are where a press, a scroll or a pinch asked it to go, and the
    drawn three ease toward them in coneTick, so a zoom arrives and never
    snaps. Geometry is scaled rather than the canvas transform, so a hairline
    stays a hairline at any zoom, the way the Field's words stay eleven
    pixels. ptrs and pinch are the two finger zoom on a phone. */
 z:1, zx:0, zy:0, zT:1, zxT:0, zyT:0, ptrs:null, pinch:null};
/* how close zoom may bring the figure. Four is about where a badge fills a
   thumb on a phone and the needle's point fills a desk canvas; past it the
   figure is a few lines crossing an empty well. */
const CONE_ZMAX=4;
/* THE PAN IS HELD SO THE FIGURE CANNOT LEAVE ITS OWN BOX. At a zoom of z the
   drawing is z times the canvas about its centre, so its edge can travel at
   most (z-1) half widths before the far edge comes into the box. The same
   rule as the Field's Frames, fzClamp in ui/rings.js, in centre terms. */
function coneZClamp(W,H){
 var mx=(CONE.zT-1)*W/2, my=(CONE.zT-1)*H/2;
 CONE.zxT=clamp(CONE.zxT,-mx,mx); CONE.zyT=clamp(CONE.zyT,-my,my);}
function coneWH(){var c=CONE.cv; return c?[c.width/CONE.dpr,c.height/CONE.dpr]:[1,1];}
/* to a scale, keeping the point under px,py where it is. Worked from the
   targets, so three quick notches of a scroll wheel compound rather than
   each starting from wherever the ease had got to. */
function coneZoomAt(ns,px,py){
 var wh=coneWH(), W=wh[0], H=wh[1];
 ns=clamp(ns,1,CONE_ZMAX);
 var ax=px-W/2, ay=py-H/2, k=ns/CONE.zT;
 CONE.zxT=ax-(ax-CONE.zxT)*k; CONE.zyT=ay-(ay-CONE.zyT)*k; CONE.zT=ns;
 coneZClamp(W,H);
 if(REDUCED){CONE.z=CONE.zT; CONE.zx=CONE.zxT; CONE.zy=CONE.zyT;}
 coneZoomPaint();}
/* a pointer lifted. True when it ended a pinch, so the lift is not also read
   as a press on whatever node is under the last finger. */
function coneUnptr(e){
 var P2=CONE.ptrs; if(P2&&e)delete P2[e.pointerId];
 if(!CONE.pinch)return false;
 if(!P2||Object.keys(P2).length<2){CONE.pinch=null; CONE.drag=null;}
 return true;}
/* F, plus and minus, as on the Field, while the Compass is the tab that is
   up. The Field's own handler in ui/ui.js answers only on the Field, so the
   two never both take one key. */
addEventListener('keydown',function(e){
 if(!CONE.open||!CONE.tab||CONE.side||typeof TAB==='undefined'||S.tab!==TAB.COMPASS)return;
 var t=e.target&&e.target.tagName;
 if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 var k=(e.key||'').toLowerCase();
 if(k==='f')coneReframe();
 else if(k==='+'||k==='=')coneZoomBy(1.25);
 else if(k==='-'||k==='_')coneZoomBy(1/1.25);});
function coneZoomBy(k){var wh=coneWH(); coneZoomAt(CONE.zT*k,wh[0]/2,wh[1]/2);}
function coneReframe(){CONE.zT=1; CONE.zxT=0; CONE.zyT=0;
 if(REDUCED){CONE.z=1; CONE.zx=0; CONE.zy=0;}
 coneZoomPaint();}
/* the ease, a fifth of the remaining distance a frame: about the Field's
   quick settle, and it lands exactly once it is too close to see */
function coneZoomStep(){
 var dz=CONE.zT-CONE.z, dx=CONE.zxT-CONE.zx, dy=CONE.zyT-CONE.zy;
 if(!dz&&!dx&&!dy)return;
 if(Math.abs(dz)<1e-3&&Math.abs(dx)<.3&&Math.abs(dy)<.3){
  CONE.z=CONE.zT; CONE.zx=CONE.zxT; CONE.zy=CONE.zyT; return;}
 CONE.z+=dz*.2; CONE.zx+=dx*.2; CONE.zy+=dy*.2;}
/* THE THREE CIRCLES CARRY WHERE THE ZOOM IS, as the Field's do: the reframe
   circle's ring is how far in, of the whole reach, and its pill the scale.
   Written on a change of target and never per frame. The glass takes the
   tone of the well it lies on, which is light under Snow. */
function coneZoomPaint(){
 var hz=document.getElementById('cnzoom'); if(!hz)return;
 var zf=hz.querySelector('[data-fb=zfit]');
 if(zf){var zp=(CONE.zT-1)/(CONE_ZMAX-1)*100;
  zf.querySelector('.val').setAttribute('stroke-dasharray',clamp(zp,0,100).toFixed(1)+' 100');
  zf.querySelector('.fb-v').textContent=CONE.zT.toFixed(1)+'×';
  zf.classList.toggle('on',CONE.zT>1.001);}
 var wl=ndlWell();
 hz.classList.toggle('fb-lt',(wl[0]*.299+wl[1]*.587+wl[2]*.114)>140);
 if(CONE.cv){CONE.cv.classList.toggle('zoomed',CONE.zT>1.001);
  var fg=CONE.cv.closest?CONE.cv.closest('.cone-fig'):null;
  if(fg)fg.classList.toggle('zoomed',CONE.zT>1.001);}
 /* a new step of the pixel budget resizes the store, once per step crossed
    and never per frame of the ease (coneLayout) */
 if(CONE.cv&&coneZBud()!==CONE.zb)coneLayout();}
/* the share of the pixel budget at the zoom asked for, in three steps so a
   scroll through the range resizes the store twice and not every notch */
function coneZBud(){return CONE.zT<1.4?1:(CONE.zT<2.2?.7:.5);}
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
/* THE HALO WAS CUT IN HALF ON A PHONE, AND THE BUDGET ABOVE IS WHY. It is a
   share of the half box, and the halo and the pitchfork are not: they sit a
   fixed 48 and 52 pixels past the ends of the axis, with a 17 pixel glyph on
   each. A share leaves 0.28 of the half box for those fixed 57 and 61 pixels,
   which holds only while the canvas is at least 408 tall. Measured 27
   September on Marcus: at 390 by 844 the canvas is 343 tall, the axis top
   landed at 48 and the halo was centred on the canvas's top edge, half of it
   cut off. At 1366 by 768 it cleared by five pixels. So the unit is solved
   from the reserve as well as from the box, and the figure gives up a little
   size on a short canvas rather than its own top. CONE_POLE is the 48 and a
   half glyph, plus eight pixels of air. */
const CONE_POLE=68;
function coneU(W,H){
 return Math.max(20,Math.min(W,H,(H-2*CONE_POLE)/CONE_H_FLAT)/2);}
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
/* GL_HALO and GL_FORK, the two pole glyphs, moved to ui/component.js on GF:
   the Field's own pictures draw them into their cores on a phone now, and
   both of those load before this file. */
/* THE LAYERS, waist outward, one per band of five. Lifted out of coneDraw
   because the drawing strokes them and coneKey names them, and two copies of
   a list are two lists that can disagree about which ring is Wrath. */
const CONE_LO=['Limbo','Lust','Gluttony','Greed','Wrath','Heresy','Violence','Fraud','Treachery'];
const CONE_HI=['Moon','Mercury','Venus','Sun','Mars','Jupiter','Saturn','Stars','Primum'];

/* one point on the surface, by angle in radians rather than by meridian, so a
   ring can be sampled as finely as it needs to be to read as an ellipse. */
function conePtA(q,a,W,H){
 var cx=W/2, cy=H/2, U=coneU(W,H);
 var t=(clamp(q,0,100)-50)/50;                   /* -1 at the floor, 1 at the crown */
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
/* coherence 0 to 100, meridian 0 to 7. One question, "where is this point on
   the figure a person is looking at", so it answers for the needle when the
   needle is what is drawn and for the arrow figure when that is. */
function conePt(q,mer,W,H){
 if(!CONE.side&&!CONE.top){var o={x:0,y:0,d:0};
  return ndlP(q,mer*(Math.PI*2/8),ndlGeo(W,H),o);}
 return conePtA(q,mer*(Math.PI*2/8),W,H);}
/* the ring at one coherence, sampled finely enough to be a curve */
function coneRing(q,W,H){
 var out=[]; for(var i=0;i<=48;i++)out.push(conePtA(q,i*(Math.PI*2/48),W,H)); return out;}
function coneDraw(){
 var c=CONE.cv, g=CONE.g; if(!c||!g)return;
 if(!CONE.side){if(CONE.top)conePlan(); else if(CONE.shells)coneRegisters(); else coneNeedle(); return;}
 var W=c.width/CONE.dpr, H=c.height/CONE.dpr;
 /* THE FLOOR COLOUR IGNORED THE LIGHTING. It was hx(PAL.Root), the Dark
    palette, typed in, so under Lumen and Glass white the floor rings, the
    Decoherent word and the fork were drawn in a red the active lighting does
    not carry. Named by the round HS art direction pass as one of three places
    this figure painted off brand. bc() is the canvas twin of seatCol and
    walks the same ladder. */
 var ink=INK(), gc=GOLDC(), rc=bc('Root');
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
  var pos=coneMirPos(m);
  return {m:m, i:i, pos:pos, p:conePt(pos,i,W,H), c:hx(seatCol(m.seat))};});
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
  var cy=H/2, U=coneU(W,H), hgt=U*coneH();
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
  /* THE POLE WORDS CLEAR THE FIGURE, NOT THE AXIS. Turned, a ring's ellipse
     reaches past the axis end by its radius times the sine of the tilt, so
     "Coherent" at a fixed 26 above the axis was printed on the arrow head's
     own rings. Measured 27 September at 1280 on Marcus with the figure
     turned, the same shot that showed the Layers names. The highest and
     lowest point of every ring is at a quarter turn from the spin, so the
     reach is read off the projection itself rather than off a second copy
     of its arithmetic. Flat, the sine is nothing and nothing moves. */
  for(var qe=0;qe<=100;qe+=2){
   ty=Math.min(ty,conePtA(qe,-Math.PI/2-CONE.spin,W,H).y);
   by=Math.max(by,conePtA(qe,Math.PI/2-CONE.spin,W,H).y);}
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
 /* THE WORDS CAME OFF, THE ARROWS STAYED. "The Compass is completely broken.
    The hero graphic is being truncated by a bunch of small text, the small
    text doesn't look like it's in our design aesthetic." FW, 27 September.
    This block and the Layers block under it were that text: eight painted
    words and six bare numbers here, twenty more there, at 9.5 to 10.5 pixels
    against a type floor of 11, lowercased, at a third to a half opacity, laid
    across the arrow heads at a fixed 96 pixels left of the spine without
    knowing where the figure was. Measured on Marcus at 1600: "aesthetic
    beauty" across the node ring, "2.4" printed on "gluttony", "wrath" on
    "2.8", "compressed" on "treachery"; at 390 the Layers names ran off the
    canvas's left edge. The sixteen names, the coherence number and the band
    caption had each already come off this canvas under "no text over the
    hero graphic, ever", and these two were missed because nothing measures a
    painted word, which is also why no gate ever saw them.

    The arrows are marks and stay, in the same colours. Their names and values
    go to coneKey, under the figure in markup, where the type floor and the
    collide gate can see them and every number says what it is out of. */
 if(CONE.reg){
  var cyR=H/2, UR=coneU(W,H), hR=UR*coneH();
  var rg=coneRegLaws();
  var arrow=function(x,y,dir,c){
   var L=13;
   g.beginPath();
   g.moveTo(x,y+dir*L); g.lineTo(x,y-dir*L);
   g.moveTo(x-4,y-dir*(L-5)); g.lineTo(x,y-dir*L); g.lineTo(x+4,y-dir*(L-5));
   g.strokeStyle=rgba(c,.88); g.lineWidth=1.7;
   g.lineCap='round'; g.lineJoin='round'; g.stroke(); g.lineCap='butt';};
  /* the same off brand fault as rc above, twice: both arrow colours read
     the Dark palette by name while the key under the figure, seatCol, read
     the active one, so under Lumen an arrow and the row naming it were two
     different reds. PAL is still the question "is this a seat", never the
     answer to "which colour". */
  rg.up.forEach(function(l,i){
   var y=cyR-hR*0.52*Math.cos(coneTilt())+i*24-24;
   arrow(W/2-96,y,1,bc(PAL[l.b]?l.b:'Heart'));});
  rg.dn.forEach(function(l,i){
   var y=cyR+hR*0.32*Math.cos(coneTilt())+i*24;
   arrow(W/2-96,y,-1,bc('Root'));});}

 /* ============================================================
    THE LAYERS. What compression over time looks like.

    Dante's Inferno and the Paradiso as the suggestion, which is the owner's
    own reference: the lower compass is what happens as these behaviours are
    adopted, and the upper is what happens as they are released. Nine bands
    each way, drawn as the rings the figure already has, named, so the
    structure a person is standing inside has a name at every level.
    ============================================================ */
 /* AND THE NINE BANDS EACH WAY ARE DRAWN RATHER THAN WRITTEN. With the names
    gone the switch has to change the drawing or it is a dead control, so it
    strokes the eighteen named rings, deepening outward from the waist the way
    the names used to, and coneKey names them in the same order under the
    figure. */
 if(CONE.layers){
  CONE_HI.forEach(function(nm,i){
   coneStroke(g,coneRing(55+i*5,W,H),gc,.16+i*0.03);});
  CONE_LO.forEach(function(nm,i){
   coneStroke(g,coneRing(45-i*5,W,H),rc,.16+i*0.03);});}

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
  var cyy=H/2, U2=coneU(W,H);
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
  /* A LOW READING TURNED ROOT RED, AND THE TIER LAW SAYS IT LOSES COLOUR.
     This was cq>=50?accent:Root, so everybody under fifty was marked in the
     seat red at .95, which is the one thing TIERCOL in engine/data/canon.js
     was written to stop: "a palette that shouts loudest at the bottom tells
     somebody at the floor that they are an emergency." Every other surface
     that marks coherence takes the tier's own colour, so this does, and the
     marker, its range and its halo now agree with the Field and Summary about
     what forty two looks like. */
  var tc=hx(TIERCOL[tierOf(cq).nm]);
  if(mine){
   var half=(mine.hi-mine.lo)/2, mid=(mine.hi+mine.lo)/2;
   osc=(mid-cq)+Math.sin(CONE.t*0.55)*half;
   /* the person's own range, drawn on the axis as the span it is */
   var ya=yOf(mine.hi), yb=yOf(mine.lo);
   g.beginPath(); g.moveTo(W/2,ya); g.lineTo(W/2,yb);
   g.strokeStyle=rgba(tc,.34); g.lineWidth=3; g.stroke();
   [ya,yb].forEach(function(yy){
    g.beginPath(); g.moveTo(W/2-7,yy); g.lineTo(W/2+7,yy);
    g.strokeStyle=rgba(tc,.55); g.lineWidth=1.4; g.stroke();});}
  var my=yOf(cq+osc);
  if(osc){
   g.beginPath(); g.arc(W/2,my,13,0,Math.PI*2);
   g.strokeStyle=rgba(tc,.22); g.lineWidth=1; g.stroke();}
  g.beginPath(); g.arc(W/2,my,7,0,Math.PI*2);
  g.fillStyle=rgba(tc,.95); g.fill();}}
 /* NO TEXT OVER THE HERO GRAPHIC, EVER. Standing rule, and this is where it
    was broken worst: the coherence number was printed in 15 point beside the
    marker, in the middle of the figure, saying 39 and nothing else. Two
    faults in one. It sat on the drawing, and it was a number with no scale,
    which is the thing the copy editor rule exists to stop.

    Nothing is lost by taking it off. coneRead already prints the same reading
    in the information column, where it says what it is out of and which side
    of the band it falls on. The marker keeps its position and its oscillation,
    which is what the figure is for. */
/* coneDull WENT, round IA. It was the inverted pole's colour: each seat
   colour pulled toward its own grey by arithmetic, which is a new colour per
   seat that no palette carries, and the round HS art direction pass named it
   as off brand. The ruling it served still stands, "the opposites take the
   dark version of the light colours, and they stay legible and visible", and
   the brand's own way to a darker version of a token is the token at an
   opacity over the ground. coneNames does that now. */
/* one pole glyph, on the 24 unit grid every other icon in this product uses.
   sz and w are for the view from above, which sizes its glyphs to the
   figure; the arrow figure passes neither and draws what it always drew. */
/* ONE PATH2D PER GLYPH FOR THE LIFE OF THE PAGE. This built a new Path2D on
   every call, and both figures call it sixteen times or more a frame, which is
   a thousand parsed paths a second of garbage on a surface that is left open.
   The strings never change, so they are parsed once. */
var CONE_P2D={};
function coneP2D(p){
 if(!(p in CONE_P2D)){try{CONE_P2D[p]=new Path2D(p);}catch(e){CONE_P2D[p]=null;}}
 return CONE_P2D[p];}
function coneGlyph(g,p,x,y,c,a,sz,w){
 if(!p||a<0.06)return;
 var S2=sz||17, sc=S2/24, P2=coneP2D(p);
 g.save(); g.translate(x-S2/2,y-S2/2); g.scale(sc,sc);
 g.strokeStyle=rgba(c,a); g.lineWidth=(w||1.8)/sc;
 g.lineJoin='round'; g.lineCap='round'; g.fillStyle='transparent';
 if(P2)g.stroke(P2);
 g.restore();}
/* one sampled ring, stroked */
function coneStroke(g,pts,c,a){
 g.beginPath();
 pts.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);});
 g.strokeStyle=rgba(c,a); g.lineWidth=1; g.stroke();}
/* ============================================================
   THE COMPASS FROM ABOVE, B AND C TOGETHER. Round IA, 27 September.

   What the tab opens on now. The arrow figure above is the same figure seen
   from the side, and it sits behind the Side view switch.

   The owner, round HS: "You want your CQ to be 100. And this whole thing
   should be a circle. And radiating ... it should actually be showing you
   the balance. Update the compass using the same art direction of the
   field." Four drawings went to him from proto/compass-redesign. This round
   first picked B, the mirror axes, as a default under time pressure and not
   as a ruling. He then said: "Seven seats under load. C is good. Let's do a
   combination of C and B. There's a lot of meaning between the two." So it
   is both, and this is what each one reads.

   THE SHELL IS C. The Field's shell, one stretch per seat on the bearings the
   Field gives that seat, set at your coherence and bent out where the seat's
   laws run above it and in where they run below. Its mean is CQ exactly,
   because CQ is the 21 laws over 210, so it is the truest drawing of the
   number. It moves slowly: a release lifts a law by LIFT_R of what is left,
   which is thousandths.

   THE RIBBON IS B. The eight mirror axes as spokes, the coherent pole's glyph
   at the rim and the inversion's at the hub, and the accent ribbon through
   where you sit on each, which is mirrorAt: 62 per cent how clear the seat is
   of charge and 38 per cent its laws. It is not CQ. It is what moves when a
   release takes charge off a seat, by whole points.

   BETWEEN THE TWO is the meaning he named. Where the ribbon sits well inside
   the shell, the laws at that seat are sound and charge is what holds it
   down. Where the ribbon runs outside the shell, the seat is clear of charge
   and its laws have not caught up. Neither drawing alone says which of the
   two a seat is short of.

   OVER GLOWS, UNDER SINKS, against the coherence circle, and light is the
   reading, so no red and no green. Over is the seat's own colour. Under is
   the light taken back off the well, which is the only honest way to sink on
   a canvas whose ground is already --sunk: there is no darker token to paint
   with, so nothing is painted.

   Every colour is a token of the active lighting: bc() for a seat, INK(),
   GOLDC() for the accent, TIERCOL for the tier. The motion is the Field's own
   (ui/wheel.js fringeStep): the spring at 196 and 2 x 0.42 x 14, five fringe
   bands, the 4.2 second breath, and travel only after a real change, in the
   direction of it. Reduced motion gets the end state.
   ============================================================ */
const CONE_SPK=196, CONE_SPC=2*0.42*14;
/* the seats' stretches of the turn, and each axis's bearing inside its seat.
   Read off W once: engine/core.js sets address i at i over the length of a
   turn from twelve, clockwise, in seat order, so a seat is where the Field
   has it. A seat holding two axes spreads them evenly across its stretch,
   which is frSpread's rule in ui/rings.js. */
var CONE_SEC=null;
function coneSec(){
 if(CONE_SEC)return CONE_SEC;
 var A=W_ADDR(), sec={}, t=[];
 BANDS.forEach(function(b){var lo=1e9,hi=-1;
  A.forEach(function(n,j){if(n.b===b){if(j<lo)lo=j; if(j>hi)hi=j;}});
  sec[b]=hi<0?{t0:0,t1:0}:{t0:lo/A.length,t1:(hi+1)/A.length};});
 BANDS.forEach(function(b){
  var mine=[]; MIRROR.forEach(function(m,i){if(m.seat===b)mine.push(i);});
  mine.forEach(function(i,k){t[i]=sec[b].t0+(k+.5)/mine.length*(sec[b].t1-sec[b].t0);});});
 return (CONE_SEC={sec:sec,t:t});}
function coneSeatAt(t){
 var s=coneSec().sec; t=((t%1)+1)%1;
 for(var i=0;i<BANDS.length;i++)if(t>=s[BANDS[i]].t0&&t<s[BANDS[i]].t1)return BANDS[i];
 return BANDS[BANDS.length-1];}
/* where a person sits on one mirror axis. One reader for both views, and the
   same arithmetic the mirror drill prints, so a node and the drill it opens
   cannot disagree. */
function coneMirPos(m){
 var grp=W_ADDR().filter(function(n){return n.b===m.seat;});
 var load=grp.length?grp.reduce(function(a,n){return a+n.sq;},0)/grp.length:0;
 return mirrorAt(load,bandIg(m.seat));}
/* a seat's laws as CQ reads them, out of a hundred. lawNow and not bandIg,
   and an unanswered law as nought, because that is what cqSum does, and the
   shell's mean being CQ is the only reason it is drawn against the coherence
   circle. bandIg reads the answer without the lift, so a shell drawn from it
   would sink under CQ everywhere as releases lift the laws. */
function coneSeatLaw(b){
 var gl=SI.filter(function(l){return l.b===b;});
 return gl.length?gl.reduce(function(a,l){
  return a+(lawIn(l.nm)?lawNow(l.nm):0);},0)/gl.length*10:0;}
/* THE SPRINGS, set to what the engine reads now. A new record starts every
   element steady, as hotTrack does on a switch of record, so moving from one
   person to another is never drawn as a change in either. Otherwise the
   target moves and the drawn value follows, which is how a release made on
   another surface arrives here: the Compass remembers where it last drew
   each element and springs from there. */
function coneMirSync(r){
 var M=CONE.mir, fresh=!M||M.who!==CURP||M.ex!==S.who;
 var cq=r.unread?50:clamp(r.CQ,0,100);
 if(fresh)M=CONE.mir={who:CURP,ex:S.who,ax:[],seat:[],cq:{x:cq,v:0}};
 var set=function(arr,i,v){var o=arr[i];
  if(!o)o=arr[i]={x:v,v:0,last:v,dir:0,ph:0};
  /* direction is kept until the value changes again, as the Field keeps it */
  if(Math.abs(v-o.last)>1e-4){o.dir=v>o.last?1:-1; o.last=v;}
  o.tgt=v; if(REDUCED)o.x=v;};
 MIRROR.forEach(function(m,i){set(M.ax,i,coneMirPos(m));});
 BANDS.forEach(function(b,i){set(M.seat,i,coneSeatLaw(b));});
 M.cq.tgt=cq; if(REDUCED)M.cq.x=cq;
 return M;}
function coneMirStep(dt){
 var M=CONE.mir; if(!M||REDUCED)return;
 var sp=function(o){if(o.tgt===undefined)return;
  for(var s=0;s<2;s++){var a=CONE_SPK*(o.tgt-o.x)-CONE_SPC*o.v; o.v+=a*dt/2; o.x+=o.v*dt/2;}};
 M.ax.forEach(sp); M.seat.forEach(sp); sp(M.cq);
 /* a fringe travels the way its seat last moved, outward on the side it is
    on, and a seat that has never moved stands */
 M.seat.forEach(function(o){o.ph+=dt*0.9*o.dir*(o.x>=M.cq.x?1:-1);});}
/* the ribbon's radius at a bearing, through every axis exactly: a periodic
   cardinal spline, so the curve never smooths a reading away */
function coneSpline(E,t){
 var n=E.length, tt=t<E[0].t?t+1:t, i=0;
 for(;i<n;i++){var b=i+1<n?E[i+1].t:E[0].t+1; if(tt>=E[i].t&&tt<b)break;}
 if(i>=n)i=n-1;
 var a0=E[i].t, a1=i+1<n?E[i+1].t:E[0].t+1, u=clamp((tt-a0)/((a1-a0)||1),0,1);
 var p0=E[(i-1+n)%n].x, p1=E[i].x, p2=E[(i+1)%n].x, p3=E[(i+2)%n].x;
 var m1=(p2-p0)*.5, m2=(p3-p1)*.5, u2=u*u, u3=u2*u;
 return (2*u3-3*u2+1)*p1+(u3-2*u2+u)*m1+(-2*u3+3*u2)*p2+(u3-u2)*m2;}
function conePlan(){
 var c=CONE.cv, g=CONE.g, TAU=Math.PI*2;
 var W=c.width/CONE.dpr, H=c.height/CONE.dpr;
 g.setTransform(CONE.dpr,0,0,CONE.dpr,0,0);
 g.clearRect(0,0,W,H);
 CONE.hits=[];
 var r=compute(), M=coneMirSync(r), SC=coneSec(), read=!r.unread;
 /* zoomed, round KQ: the radius grows by the zoom and the centre moves by
    the pan, and everything below is drawn off those three */
 var R=Math.max(20,Math.min(W,H)/2-(W<520?24:34))*CONE.z, cx=W/2+CONE.zx, cy=H/2+CONE.zy, r0=R*.2;
 var sk=clamp(R/300,.55,1.3);
 var rad=function(v){return r0+(R-r0)*clamp(v,0,100)/100;};
 var ang=function(t){return t*TAU-Math.PI/2;};
 var ink=INK(), gc=GOLDC();
 var tc=read&&TIERCOL[r.tier]?hx(TIERCOL[r.tier]):gc;
 var ref=M.cq.x, rr=rad(ref);
 /* the shell, C's bend: each seat's gap spread on a gaussian across the
    turn, a little under half a seat's stretch wide */
 var N=540, B=[], SE=BANDS.map(function(b,i){var s=SC.sec[b];
  return {b:b,o:M.seat[i],t:(s.t0+s.t1)/2,sp:Math.max(.01,(s.t1-s.t0)*.42)};});
 for(var j=0;j<=N;j++){var t=j/N, num=0, den=0;
  SE.forEach(function(q){var d=t-q.t; d-=Math.round(d);
   var w=Math.exp(-(d*d)/(2*q.sp*q.sp)); num+=w*q.o.x; den+=w;});
  B.push(den?num/den:ref);}
 var bAt=function(t){return B[Math.round((((t%1)+1)%1)*N)];};
 /* the band between the shell and the circle, sample by sample. pick says
    which samples, paint says with what.
    ONE PATH PER COLOUR, NOT ONE FILL PER SAMPLE. The proto filled each of
    the 540 slivers on its own, twice a frame, which is over a thousand fills
    sixty times a second on a surface that is left open. The slivers share
    edges and wind the same way, so one path per colour fills the same
    pixels in eight fills, and without the hairline seams that separate
    antialiased fills leave between neighbours. */
 var band=function(pick,paint){var prev=null, P={};
  for(var k=0;k<=N;k++){var a=ang(k/N), rs=rad(B[k]);
   if(prev&&pick(prev.v)){var q=P[prev.seat]||(P[prev.seat]=new Path2D());
    q.moveTo(cx+Math.cos(prev.a)*prev.rs,cy+Math.sin(prev.a)*prev.rs);
    q.lineTo(cx+Math.cos(a)*rs,cy+Math.sin(a)*rs);
    q.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
    q.lineTo(cx+Math.cos(prev.a)*rr,cy+Math.sin(prev.a)*rr);
    q.closePath();}
   prev={a:a,rs:rs,v:B[k],seat:coneSeatAt((k+.5)/N)};}
  Object.keys(P).forEach(function(s){g.fillStyle=paint(s); g.fill(P[s]);});};
 /* THE LIGHT comes from the centre and reaches the coherence circle, in the
    tier's colour. Coherence is how far it reaches. */
 if(read){
  var lg=g.createRadialGradient(cx,cy,r0*.4,cx,cy,rr*1.08);
  lg.addColorStop(0,rgba(tc,.16)); lg.addColorStop(.75,rgba(tc,.07));
  lg.addColorStop(1,rgba(tc,0));
  g.fillStyle=lg; g.beginPath(); g.arc(cx,cy,rr*1.08,0,TAU); g.fill();
  /* under: the light taken back, not a colour laid down. destination-out
     reads only the alpha, so the black here is never seen. */
  g.save(); g.globalCompositeOperation='destination-out';
  band(function(v){return v<ref;},function(){return 'rgba(0,0,0,.85)';});
  g.restore();}
 /* the rim is the circle he asked for, everything at full. A hairline in the
    accent, never a reading, and the seven seats just outside it. */
 g.beginPath(); g.arc(cx,cy,R,0,TAU); g.strokeStyle=rgba(gc,.34); g.lineWidth=1; g.stroke();
 BANDS.forEach(function(b){var s=SC.sec[b];
  g.beginPath(); g.arc(cx,cy,R+5*sk,ang(s.t0+.004),ang(s.t1-.004));
  g.strokeStyle=rgba(bc(b),.55); g.lineWidth=2*sk; g.stroke();});
 /* the room, forty to sixty, where most people stand, with its souls: the
    arrow figure's own room and the same eighteen, seen from above */
 g.beginPath(); g.arc(cx,cy,rad(60),0,TAU); g.arc(cx,cy,rad(40),0,TAU,true);
 g.fillStyle=rgba(ink,.045); g.fill();
 [[40,.20],[60,.12]].forEach(function(q){g.beginPath(); g.arc(cx,cy,rad(q[0]),0,TAU);
  g.strokeStyle=rgba(ink,q[1]); g.lineWidth=1; g.stroke();});
 for(var si=0;si<18;si++){
  var ph=si*2.399963, spd=0.20+((si*37)%11)/38, sw=REDUCED?0:Math.sin(CONE.t*spd+ph);
  var sa=ang(ph/TAU+CONE.t*.004), sr=rad(50+sw*9.2);
  g.beginPath(); g.arc(cx+Math.cos(sa)*sr,cy+Math.sin(sa)*sr,1.9*sk,0,TAU);
  g.fillStyle=rgba(ink,.30+sw*.12); g.fill();}
 /* the eight meridians, one per mirror axis, in the seat's colour */
 MIRROR.forEach(function(m,i){var a=ang(SC.t[i]);
  g.beginPath(); g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);
  g.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
  g.strokeStyle=rgba(bc(m.seat),.30); g.lineWidth=1.2*sk; g.stroke();});
 /* Layers, from above, are the rings they always were: nine released rings
    outward of the waist and nine compressed ones inward of it */
 if(CONE.layers){
  CONE_HI.forEach(function(nm,i){g.beginPath(); g.arc(cx,cy,rad(55+i*5),0,TAU);
   g.strokeStyle=rgba(gc,.16+i*0.03); g.lineWidth=1; g.stroke();});
  CONE_LO.forEach(function(nm,i){g.beginPath(); g.arc(cx,cy,rad(45-i*5),0,TAU);
   g.strokeStyle=rgba(bc('Root'),.16+i*0.03); g.lineWidth=1; g.stroke();});}
 if(read){
  /* over: the seat's own colour, between the shell and the circle */
  band(function(v){return v>=ref;},function(b){return rgba(bc(b),.24);});
  /* the coherence circle, dashed, in the tier's colour */
  g.beginPath(); g.arc(cx,cy,rr,0,TAU); g.setLineDash([2*sk,5*sk]);
  g.strokeStyle=rgba(tc,.6); g.lineWidth=1.2*sk; g.stroke(); g.setLineDash([]);
  /* THE FRINGES, fringeDraw's own five bands, standing off the shell on the
     side the seat is on, strength off its gap from coherence, full at twenty
     points of a hundred, and closer together where the gap is larger */
  SE.forEach(function(q,i){var o=q.o, dev=o.x-ref, s=clamp(Math.abs(dev)/20,0,1);
   if(s<.03)return;
   var sg=dev>=0?1:-1, f=REDUCED?.5:(o.ph-Math.floor(o.ph)), gap=(10-6*s)*sk;
   var br=REDUCED?1:0.82+0.18*Math.sin(TAU*CONE.t/4.2-i*0.12);
   var s0=SC.sec[q.b], t0=s0.t0+.01, t1=s0.t1-.01;
   for(var k=0;k<5;k++){
    var pos=k+f, al=Math.pow(s,1.3)*Math.sin(Math.PI*pos/5)*.9*br; if(al<.02)continue;
    g.beginPath();
    for(var mm=0;mm<=40;mm++){var tt=t0+(t1-t0)*mm/40, aa=ang(tt);
     var rq=rad(bAt(tt))+sg*(4+pos*gap);
     mm?g.lineTo(cx+Math.cos(aa)*rq,cy+Math.sin(aa)*rq)
       :g.moveTo(cx+Math.cos(aa)*rq,cy+Math.sin(aa)*rq);}
    g.strokeStyle=k%2?rgba(bc(q.b),al):rgba(ink,al*.55);
    g.lineWidth=(k%2?1.1:1.6)*(.8+.4*s)*sk; g.stroke();}});
  /* the shell itself, each seat's stretch in its own colour */
  SE.forEach(function(q){var s0=SC.sec[q.b]; g.beginPath();
   for(var mm=0;mm<=60;mm++){var tt=s0.t0+(s0.t1-s0.t0)*mm/60, aa=ang(tt), rq=rad(bAt(tt));
    mm?g.lineTo(cx+Math.cos(aa)*rq,cy+Math.sin(aa)*rq)
      :g.moveTo(cx+Math.cos(aa)*rq,cy+Math.sin(aa)*rq);}
   g.strokeStyle=rgba(bc(q.b),.95); g.lineWidth=3.2*sk;
   g.lineCap='round'; g.stroke(); g.lineCap='butt';});
  /* the ribbon, B, in the accent, through where you sit on each axis */
  var E=MIRROR.map(function(m,i){return {t:SC.t[i],x:M.ax[i].x};})
   .sort(function(a,b){return a.t-b.t;});
  g.beginPath();
  for(var q2=0;q2<=360;q2++){var tq=q2/360, aq=ang(tq), rq2=rad(coneSpline(E,tq));
   q2?g.lineTo(cx+Math.cos(aq)*rq2,cy+Math.sin(aq)*rq2)
     :g.moveTo(cx+Math.cos(aq)*rq2,cy+Math.sin(aq)*rq2);}
  g.closePath(); g.fillStyle=rgba(gc,.06); g.fill();
  g.strokeStyle=rgba(gc,.8); g.lineWidth=1.6*sk; g.stroke();}
 /* the hub, which is nought: cleared back to the well, and ringed */
 g.save(); g.globalCompositeOperation='destination-out';
 g.beginPath(); g.arc(cx,cy,r0,0,TAU); g.fillStyle='rgba(0,0,0,1)'; g.fill(); g.restore();
 g.beginPath(); g.arc(cx,cy,r0,0,TAU); g.strokeStyle=rgba(ink,.10); g.lineWidth=1; g.stroke();
 /* each axis: a node where you sit, the coherent pole's glyph at the rim and
    the inversion's at the hub. The hub glyphs go only where the hub has room
    for eight: under 16 pixels apart they pile up, measured on the proto
    board. Ring, never fill, so a node clears the lines under it and is then
    stroked. The node is the target, as it is on the arrow figure. */
 MIRROR.forEach(function(m,i){var a=ang(SC.t[i]), col=bc(m.seat), lit=(CONE.front===i);
  if(read){var nr=rad(M.ax[i].x), x=cx+Math.cos(a)*nr, y=cy+Math.sin(a)*nr;
   var rn=(lit?5.6:4.4)*sk;
   g.save(); g.globalCompositeOperation='destination-out';
   g.beginPath(); g.arc(x,y,rn,0,TAU); g.fillStyle='rgba(0,0,0,1)'; g.fill(); g.restore();
   g.beginPath(); g.arc(x,y,rn,0,TAU); g.strokeStyle=rgba(col,lit?1:.95);
   g.lineWidth=(lit?2.2:1.6)*sk; g.stroke();
   if(lit){g.beginPath(); g.arc(x,y,rn+5*sk,0,TAU);
    g.strokeStyle=rgba(col,.45); g.lineWidth=1; g.stroke();}
   CONE.hits.push({x:x,y:y,r:Math.max(16,rn+10),m:m,i:i,end:'up'});}
  var ro=R+19*sk, ri=r0*.62;
  coneGlyph(g,m.ic,cx+Math.cos(a)*ro,cy+Math.sin(a)*ro,col,.95,Math.max(12,15*sk),1.7);
  if(TAU*ri/8>=16)
   coneGlyph(g,m.dic,cx+Math.cos(a)*ri,cy+Math.sin(a)*ri,col,.55,Math.max(10,11*sk),1.5);});}
/* ============================================================
   THE NEEDLE. Two pyramids and the gap between them. Round JQ, 27 September.

   What the tab opens on now, and the reason is his, verbatim: "The compass is
   currently taking up a quarter of the real estate, I don't know why, and it
   doesn't look like a compass. I didn't agree to this ... this needs to look
   more like two arrows, one pointing up, one pointing down, or two pyramids
   ... with a little gap of limbo in between, that's the oscillating." And,
   the same dictation: "Redesign the compass using design from the field."

   Two findings, kept apart because they are two different things.

   THE QUARTER WAS A BUG. The canvas was capped at min(52vh,430px) in the
   sheet from the days when the reading shared the card with the figure. The
   reading went to the rail and the cap stayed, so at 1600 by 1000 the canvas
   was 1128 by 430 inside an 1164 by 903 stage and the lower half of the stage
   was an empty well: the figure, rim and glyphs, measured 13 per cent of the
   stage. coneFit below sizes the canvas to the card instead.

   THE SHAPE WAS A DESIGN OBJECTION. The view from above is a radar, and a
   radar is not a compass. A compass is a needle: one half points to where you
   are going and the other half to where you came from, and they meet at a
   pivot. So this is an octagonal bipyramid, one pyramid pointing up to
   Coherent and one pointing down to Decoherent, each rib an axis, and between
   the two bases a ring of limbo, which is forty to sixty, the oscillating
   band, where most people stand.

   And his second pass, while this was building: "you want to also show the
   distortion, like where you're overexpressed or underexpressed ... just with
   the triangles and that kind of oscillating space. The oscillating space, I
   don't want it blank ... it's a range, right? There's still data in there."
   And: "showing the compass of the ascendant teachers closer towards the
   source ... maybe with Jesus and Krishna being closest to the point, and
   then their opposing behaviors on the opposite scale."

   So every layer of round IA is carried across, on the new shape:

     the shell, C      each axis at its seat's laws, the mean of which is CQ.
                       Where it rides above your coherence level it glows in
                       the seat's colour; where it sinks below, the light is
                       taken off the figure. That is the distortion.
     the ribbon, B     the accent loop through where you sit on each axis,
                       which is what a release moves by whole points.
     the level         your coherence as a plane cut through the figure, so a
                       balanced field is a level ring and a distorted one is
                       a warped one. The shape of your awareness is the warp.
     the limbo ring    never blank: a gradient from the coherent rim to the
                       decoherent one, lit where your reading sits, your own
                       range drawn across it, and the souls of the band.
     the teachers      the eight coherent poles ring the upper pyramid near
                       the point; their inversions ring the lower one, the
                       mirror of it. Rib to rib, a pair faces across limbo.
     the five paths    the glossary's own five, which "all end at the same
                       Source", crowned round the point, with Jesus and
                       Krishna nearest it, as he named them.

   AND THE FIVE ARE MIRRORED NOW, round KE. This said Krishna, Rama and Lao
   Tzu had no opposing behaviour in the codex, and that an inversion drawn
   here would be canon written by a renderer. Both still hold, which is why
   the answer went into the data and not into this file: PATHS in
   engine/data/compass.js carries each path's inversion in the mirror pairs'
   own shape, two read off the codex and three researched out of each
   teacher's own tradition, cited and marked as research. This file only
   draws what PATHS says, the five inversions crowning the lower point the
   way the five paths crown the upper one, broken rings as the eight are.

   THE GAP AS TWO CIRCULAR PLANES, round KE: "Can we do something with that
   gap and make it a two circular planes? when it's tilted?" Tilted is the
   needle's own tilt, CONE.nt, which a vertical drag sets between 0.04 and
   0.75 and which opens at 0.30. Near edge on the octagonal band stays,
   because two circles seen edge on are two lines and say nothing. As the
   figure tilts the band cross fades into two discs, a coherent plane at
   sixty under the upper pyramid and a decoherent one at forty over the
   lower, each a compass card with its eight spokes in the seats' colours,
   and the range between them keeps its gradient and its souls, so the gap
   is still never blank.

   NOT DRAWN EITHER: the Boundary overlay. His words: "let's not move that
   there yet, just put it on the backlog." The idea, for a later pass, is the
   Boundary as a surface on this figure, since keeping a boundary is part of
   holding the path.

   Motion is the Field's: the same springs (coneMirStep), the 4.2 second
   breath, and travel only in the direction of a real gap. Sparks ride each
   rib from your level toward the seat's laws, up where a seat runs over and
   down where it runs under. The figure assembles out of the limbo on open.
   Reduced motion gets the end state and nothing travels.

   COST, MEASURED AND DATED, 28 September, headless Chromium on a software
   raster at a load average near 30, which is the floor and not the typical
   machine. Draw plus a forced flush, the minimum of ninety frames:

                        old figure       the needle
     1600 at 1x         3.7 ms           5.5 ms    canvas twice the area
     1600 at 2x         7.5 ms           8.0 ms    after the pixel budget
     390 at 3x          5.9 ms           6.1 ms

   The first cut was 11 ms at 2x. Profiled by switching one layer off at a
   time: the two glow gradients filled every frame were the largest cost and
   the destination-out clears the second, so the glow is the element's
   background and the clears are fills in the well's colour. No shadowBlur,
   no filter, no readback in the loop. The per frame garbage is the colour
   strings a canvas has to be handed, the hit list, and whatever compute()
   makes, which is the engine's and shared with every surface.

   ROUND KQ, MEASURED AND DATED, 28 September, the same probe on the same
   software raster at a load average near 3, Marcus, the minimum of ninety
   frames. Before is HEAD d880c09, after is the tension line, the pushed
   gravity and zoom:

                        pulse           well            top
     1600 at 1x         5.7 -> 6.2      6.1 -> 7.0      7.7 -> 8.2
     1600 at 2x         8.1 -> 8.5      10.3 -> 11.1    12.4 -> 12.6
     390 at 3x          6.0 -> 6.5      8.1 -> 8.6      6.7 -> 6.9
     zoomed 2.5x, 1600 at 2x: pulse 11.0, well 13.5, top 9.8, with the
     stepped pixel budget in coneLayout; 16.4, 19.6 and 15.7 without it.

   The additions are strokes and small fills: eight glow strokes and two
   travelling lights on the tension line, a swell at a node on its beat,
   three closing rings and up to seven motes per well. Zoomed, the cost is
   the big translucent fills covering more of the canvas, the limbo drum's
   gradient first at 4.3 ms; a solid drum would save 1.8 of it and would
   take the lit band of your reading out of limbo, so it stays.
   ============================================================ */
const NDL_GAP=0.13;      /* half the limbo, as a share of the half height */
const NDL_SLAB=0.88;     /* the limbo ring's radius, as a share of a base's */
const NDL_REF_UP=80, NDL_REF_DN=20;  /* the teachers' ring and its mirror */
const NDL_SEC=24, NDL_N=8*NDL_SEC;
/* THE RADIANCE MESH, round KR: six columns a face, so forty eight round the
   turn, and a row every five points of coherence, eight up each pyramid and
   four across limbo. HQ is the corners' heights top to bottom; the limbo
   rows repeat 60 and 40 because the figure's radius steps there, from a
   base's to the limbo ring's, and a cell spanning the step would lie across
   nothing. Declared above NDL, whose arrays are sized from them. */
/* AND TWELVE COLUMNS A FACE, NOT SIX. At six the stepped field drew as
   wedges a face wide, which read as a rendering fault and not as heat:
   measured on Sofia at 1600, her bent desire came out as three dark slabs
   with the far half's slabs showing through between them. At twelve it is
   one body with stepped edges. */
const NDL_HC=96, NDL_HL=10;
/* the glow at full radiance, the veil at its deepest, and the width of one
   step as a share of the mean (ndlHeatDraw). The far half is drawn at 0.45
   of the near, the near faces' own share of the far ones in ndlFaces. */
/* ONE IS A STEP'S CENTRE, NOT ITS EDGE. The first cut put a boundary at
   exactly the mean, so a field with nothing wrong in it, Rosa, whose cells
   sit between 0.97 and 1.02 of her mean, flickered between two steps and
   drew faint rectangles round her apex that were noise and not reading. */
const NDL_HEAT_G=0.32, NDL_HEAT_S=0.62, NDL_HS=0.125, NDL_HR=(NDL_HL-1)*NDL_HS;
const NDL_HQ=[100,95,90,85,80,75,70,65,60, 60,55,50,45,40, 40,35,30,25,20,15,10,5,0];
/* THE FIVE PATHS, from the glossary's own entry: "Krishna, flow. Buddha,
   awareness. Christ, the body. Rama, alignment. Lao Tzu, the horizontal."
   Christ is written Jesus, because the canon ruled one figure one name. The
   first field is the ring: one is nearest the point, which is his ruling for
   Jesus and Krishna, and two is everyone else, unranked, because nobody has
   ranked them. The second is the angle round the upper point; the lower
   point takes the same angle reflected, so each inversion sits exactly under
   its path. Who the five are and what they invert to is PATHS, in the
   engine's data: this is only where each one is drawn. */
const NDL_PLACE={'Jesus':[1,-130],'Krishna':[1,-50],
 'Buddha':[2,-152],'Rama':[2,-90],'Lao Tzu':[2,-28]};
const NDL_PATHS=PATHS.map(function(p){var at=NDL_PLACE[p.up]||[2,-90];
 return {p:p,ring:at[0],ang:at[1]*Math.PI/180};});
/* the tilt at which the gap has become two circular planes, and below which
   it is still the octagonal band */
const NDL_DISC_LO=0.08, NDL_DISC_HI=0.22;
var NDL={G:null, vs:1, P:{x:0,y:0,d:0}, tips:[],
 cA:new Float64Array(8), sA:new Float64Array(8),
 sx:new Float32Array(NDL_N+1), sy:new Float32Array(NDL_N+1), sq:new Float32Array(NDL_N+1),
 bx:new Float32Array(NDL_N+1), by:new Float32Array(NDL_N+1),
 qx:new Float32Array(NDL_N+1), qy:new Float32Array(NDL_N+1),
 U:new Float32Array(16), L:new Float32Array(16), ST:new Float32Array(16), SB:new Float32Array(16),
 hp:[], nh:0, nt:0, cols:null, colSig:'', ay:0, zy:0, ee:1, lit:-1, gc:null, rc:null,
 grav:new Float32Array(8), gAt:-1e9, gWho:null,
 Es:null, Eb:null, sIdx:null, glowSig:'', slab:null, slabSig:'', well:null, wellSig:'', wl:null,
 sr:null, srK:'', srAt:-1e9,
 /* the wells: x, y and strength per axis, and how many are live this frame.
    Zero live wells is the switch off, and ndlWarp returns at once. */
 wc:new Float32Array(24), wn:0, ws2:1,
 /* THE TENSION LINE'S STATE, round KQ. tp is how hard each axis has just
    been plucked, in coherence points, and it dies away; ta and tw are each
    span's amplitude and speed this frame; gph is each axis's pulse phase
    last frame, so a beat can be told from the frame it lands on. */
 tp:new Float32Array(8), ta:new Float32Array(8), tw:new Float32Array(8), tph:new Float32Array(8),
 tt:new Float32Array(8), gph:new Float32Array(8), cur:0,
 gx:new Float32Array(NDL_N+1), gy:new Float32Array(NDL_N+1),
 /* THE RADIANCE FIELD'S STATE, round KR. gsq is each axis's mean charge
    out of ten, kept by ndlGrav before it normalises, so the heat reads the
    same walk of the record the gravity does and not a second one. hx and hy
    are the mesh's corners, hl each cell's level, hf its raw strength, hn
    whether its column faces the viewer; hs and hc are the shell and the
    clearance splined round the turn once per column. */
 gsq:new Float32Array(8),
 hx:new Float32Array(23*(NDL_HC+1)), hy:new Float32Array(23*(NDL_HC+1)),
 hl:new Int8Array(20*NDL_HC), hf:new Float32Array(20*NDL_HC), hn:new Int8Array(NDL_HC),
 hs:new Float32Array(NDL_HC), hc:new Float32Array(NDL_HC),
 hEs:null, hEc:null, hCol:null, hSig:'', hR:0};
/* the figure's box. Read once per canvas size: the top keeps room for the
   crown of five and the halo, the bottom for the fork, and on a desk the
   sides keep clear of the two name rails, which are absolute over the canvas
   from 900 pixels up and in flow under it below that (the sheet's break). */
function ndlGeo(W,H){
 var G=NDL.G, side=(typeof innerWidth==='number'&&innerWidth>=900)?176:20;
 var z=CONE.z, zx=CONE.zx, zy=CONE.zy;
 if(G&&G.W===W&&G.H===H&&G.side===side&&G.z===z&&G.zx===zx&&G.zy===zy)return G;
 /* the bottom keeps the same room as the top now: the five inversions crown
    the lower point as the five paths crown the upper one, and 46 was the
    fork's room alone */
 var top=88, bot=88, Hs=Math.max(50,(H-top-bot)/2);
 /* a pyramid a little taller than it is wide, so each half reads as an
    arrow head and not as a plate */
 var Rb=Math.max(36,Math.min(Hs*(1-NDL_GAP)*0.80,W/2-side));
 /* ZOOMED, the box is scaled about the canvas's centre and moved by the pan.
    The marks grow by a fifth of the zoom rather than all of it, so a badge
    comes closer without swelling into its neighbour. Written into the one
    object rather than a new one, because a zoom eases through a frame at a
    time and a fresh box per frame is garbage in the hot loop. */
 if(!G)G=NDL.G={};
 G.W=W; G.H=H; G.side=side; G.z=z; G.zx=zx; G.zy=zy;
 G.cx=W/2+zx; G.cy=H/2+(top+Hs-H/2)*z+zy; G.Hs=Hs*z; G.Rb=Rb*z;
 G.sk=clamp(Rb/250,.62,1.15)*(1+(z-1)*.2);
 return G;}
/* height, as a share of the half height, upward positive: the upper pyramid
   carries sixty to a hundred, the limbo ring forty to sixty, the lower
   pyramid nought to forty */
function ndlH(q){
 q=clamp(q,0,100);
 if(q>=60)return NDL_GAP+(1-NDL_GAP)*(q-60)/40;
 if(q<=40)return -NDL_GAP-(1-NDL_GAP)*(40-q)/40;
 return NDL_GAP*(q-50)/10;}
/* and the radius there: each pyramid closes to a point at its pole, and the
   limbo ring stands a little inside both bases so the gap reads as a gap */
function ndlR(q,Rb){
 q=clamp(q,0,100);
 if(q>=60)return Rb*(100-q)/40;
 if(q<=40)return Rb*q/40;
 return Rb*NDL_SLAB;}
function ndlY(q,G){return G.cy-ndlH(q)*G.Hs*NDL.vs*Math.cos(CONE.nt);}
/* a point on the figure at an angle, written into o rather than returned new */
function ndlP(q,a,G,o){
 var h=ndlH(q)*G.Hs*NDL.vs, r=ndlR(q,G.Rb), th=a+CONE.spin, tl=CONE.nt;
 var z3=Math.sin(th)*r;
 o.x=G.cx+Math.cos(th)*r; o.y=G.cy-h*Math.cos(tl)+z3*Math.sin(tl); o.d=Math.sin(th);
 if(NDL.wn)ndlWarp(o);
 return o;}
/* a point on face i, u of the way from rib i to rib i+1. On the flat face
   and not on a circle through the two ribs: sampling a circle would float
   every loop up to eight per cent off the faces it is meant to lie on. */
function ndlPf(q,i,u,G,o,rr){
 var j=(i+1)%8, r=rr===undefined?ndlR(q,G.Rb):rr, h=ndlH(q)*G.Hs*NDL.vs;
 var cx3=(NDL.cA[i]*(1-u)+NDL.cA[j]*u), z3=(NDL.sA[i]*(1-u)+NDL.sA[j]*u);
 o.x=G.cx+cx3*r; o.y=G.cy-h*Math.cos(CONE.nt)+z3*r*Math.sin(CONE.nt); o.d=z3;
 if(NDL.wn)ndlWarp(o);
 return o;}
/* ============================================================
   GRAVITY, TWO WAYS, AS MOCKUPS. Rounds KG, KH and KI.

   KG, his words: "gravity is like a gravity well. So wherever the node is,
   it's like the geometry, geometry is distorted around it." KH, a round
   later: "I think the pulsing rings and the gravity. The heavier the
   gravity, the more the pulsation." KI: "create the mockups again for the
   gravity. Let's see." So both are drawn, one switch apart, and he picks by
   looking. Neither is ruled.

   The weight is the same in both: ndlGrav, each axis's mean charge against
   the heaviest, cubed, so an axis at seven tenths of the heaviest pulls a
   third as hard and the heaviest pulls hardest. Uncubed, Marcus's eight all
   sit between 0.69 and 1 and every axis reads the same.

   THE PULSE, KH, switch off. Every axis carrying weight rings, and the ring
   count, reach, speed and strength all rise with the weight.

   THE WELL, KG, switch on. Every point the needle draws is pulled toward
   each node by the node's weight, falling off with distance, so the faces,
   the shell, the ribbon and a set of level contours bend into the heavy
   nodes the way a sheet bends under a mass. Screen space, after the
   projection: cheap, and it is the look being chosen, not the physics.
   COST, measured: see the probe figures in the round KE report. The warp is
   eight exponentials a point and returns at once when the switch is off.
   ============================================================ */
/* how hard a full weight pulls, and how far the pull reaches as a share of
   the base radius. The first cut was 0.34 and 0.24, which moved a point at
   most about thirteen pixels at 1600 and read as nothing at all; these move
   it up to about a tenth of the base radius. The pull stays under one, so no
   point is ever thrown past the node it falls toward. */
const NDL_WELL_A=0.62;
const NDL_WELL_S=0.30;
function ndlWarp(o){
 var W2=NDL.wc, n=NDL.wn, s2=NDL.ws2, dx=0, dy=0;
 for(var k=0;k<n;k++){var cx=W2[k*3], cy=W2[k*3+1], w=W2[k*3+2];
  var ex=cx-o.x, ey=cy-o.y, d2=ex*ex+ey*ey;
  /* past three widths the pull is under one per cent: skip the exponential */
  if(d2>s2*4.5)continue;
  var f=w*NDL_WELL_A*Math.exp(-d2/s2);
  dx+=ex*f; dy+=ey*f;}
 o.x+=dx; o.y+=dy;}
/* one polygon, filled */
function ndlTri(g,x0,y0,x1,y1,x2,y2,fs){
 g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.lineTo(x2,y2); g.closePath();
 g.fillStyle=fs; g.fill();}
/* a sampled loop round the figure, into the scratch arrays: q at each sample
   read off a periodic spline through the eight axis values */
function ndlLoop(E,G,X,Y,Q,flat){
 var P=NDL.P;
 for(var k=0;k<=NDL_N;k++){
  var i=Math.floor(k/NDL_SEC)%8, u=(k%NDL_SEC)/NDL_SEC;
  var q=flat===undefined?clamp(coneSpline(E,k/NDL_N),0,100):flat;
  ndlPf(q,i,u,G,P); X[k]=P.x; Y[k]=P.y; if(Q)Q[k]=q;}}
/* THE TENSION LINE, round KQ: "the tension line, something is a bit more
   express." The ribbon is sampled as ndlLoop samples it, and then each span
   between two axes is a string between two pegs: it vibrates in the
   coherence direction, fundamental plus a little of the second harmonic,
   and both vanish at u of nought, which is the axis. So the line still
   passes exactly through every node, which is the reading, and only the
   stretch between two readings moves. How far it swings and how fast is
   set per span in coneNeedle, off how far the span stands from your level
   and whether a release has just plucked it. */
function ndlLoopT(E,G,X,Y){
 var P=NDL.P, A=NDL.ta, PH=NDL.tph, PI=Math.PI;
 for(var k=0;k<=NDL_N;k++){
  var i=Math.floor(k/NDL_SEC)%8, u=(k%NDL_SEC)/NDL_SEC;
  var q=clamp(coneSpline(E,k/NDL_N),0,100);
  if(A[i]>.004)q+=A[i]*(Math.sin(PI*u)*Math.sin(PH[i])+.3*Math.sin(2*PI*u)*Math.sin(1.63*PH[i]+1.1));
  ndlPf(clamp(q,0,100),i,u,G,P); X[k]=P.x; Y[k]=P.y;}}
function ndlPoly(g,X,Y){
 g.beginPath(); g.moveTo(X[0],Y[0]);
 for(var k=1;k<=NDL_N;k++)g.lineTo(X[k],Y[k]);}
/* the person's own range, read at most once a second: seriesRead walks the
   record, and a frame loop is no place to walk a record sixty times a second */
function ndlRange(){
 var now=(typeof performance!=='undefined'?performance.now():Date.now()), key=CONE.span+'|'+S.who;
 if(key!==NDL.srK||now-NDL.srAt>1000){NDL.srK=key; NDL.srAt=now; NDL.sr=null;
  try{var s=seriesRead(CURP,CONE.span,Date.now());
   if(s.state==='line'&&s.hi>s.lo)NDL.sr={lo:s.lo,hi:s.hi};}catch(e){}}
 return NDL.sr;}
/* the frame's shared state for the helpers below, so none of them is a
   closure made fresh every frame */
function ndlCols(){
 var sig=S.theme+'|'+(LIGHT()?1:0);
 if(NDL.colSig!==sig){NDL.colSig=sig; NDL.cols=MIRROR.map(function(m){return bc(m.seat);});}
 return NDL.cols;}
/* THE WELL'S OWN COLOUR, read off the canvas's computed ground once per
   lighting. Clearing a disc back to the well with destination-out was a
   composite switch per badge, twenty nine a frame, and on a software raster
   that measured as the second largest cost in the frame. Painting the well's
   colour is the same pixels by the ordinary route. */
function ndlWell(){
 var sig=S.theme+'|'+(LIGHT()?1:0);
 if(NDL.wellSig!==sig&&CONE.cv){NDL.wellSig=sig;
  var m=/rgba?\(([^)]+)\)/.exec(getComputedStyle(CONE.cv).backgroundColor||'');
  var v=m?m[1].split(',').map(function(x){return parseFloat(x);}):[16,16,16,1];
  if(v.length>3&&v[3]<0.5)v=LIGHT()?[242,241,236]:[16,16,16];
  NDL.well=[v[0],v[1],v[2]];}
 return NDL.well||[16,16,16];}
/* WHERE THE GRAVITY IS. Round KA, his words: "animations where you tend to
   lean most into, the most active ... indicators of where there's the most
   gravity at which you tend to focus." Gravity here is charge, the same
   weight the Field ranks its reading by: each axis is weighted by the mean
   charge held at its seat's addresses, which is the load coneMirPos already
   reads, and an axis pulls in proportion to its share of the heaviest. Read
   twice a second, not every frame: the addresses do not move between two
   frames, and walking all of them sixty times a second is garbage. A Heart
   axis and its twin share a seat and so share a pull, which is the truth. */
function ndlGrav(){
 var now=(typeof performance!=='undefined'?performance.now():Date.now());
 if(now-NDL.gAt<500&&NDL.gWho===S.who)return NDL.grav;
 NDL.gAt=now; NDL.gWho=S.who;
 var sum={}, cnt={}, A=W_ADDR(), mx=0, i;
 for(i=0;i<A.length;i++){var b=A[i].b; sum[b]=(sum[b]||0)+(A[i].sq||0); cnt[b]=(cnt[b]||0)+1;}
 for(i=0;i<8;i++){var sb=MIRROR[i].seat; NDL.grav[i]=cnt[sb]?sum[sb]/cnt[sb]:0;
  NDL.gsq[i]=NDL.grav[i];
  if(NDL.grav[i]>mx)mx=NDL.grav[i];}
 /* nothing held anywhere is no gravity, not an even pull everywhere */
 for(i=0;i<8;i++)NDL.grav[i]=mx>0.05?NDL.grav[i]/mx:0;
 return NDL.grav;}
/* ============================================================
   THE RADIANCE, AS HEAT THROUGH THE WHOLE FIGURE. Round KR, 28 September.

   His words: "Add for the compass an overlay heat map for the radians. So as
   a field of the full volume radiant, so as this field is distorted, you can
   see the radiance as it's either diminished because of the SQ and how the
   field is distorted." Radians is radiance: compute() already returns one,
   the length of the X, Y and Z reading over root three, which Summary prints
   as a percent and the Field's wash fades by. It was a single number. This
   is where in the volume it is short.

   ONE NUMBER, SPREAD, NOT A SECOND NUMBER. Every cell of the mesh gets a
   raw strength f, and what a cell carries is f over the mean f of the whole
   mesh: one is your radiance, under one is short of it. So the average of
   the field is the radiance the engine reports, the same way the shell's
   mean is CQ, and the two cannot disagree. Multiplying radiance by the
   charge again would count the charge twice, because Z is already Ig times
   one minus SQm.

   f IS HIS TWO CAUSES, AND NOTHING ELSE.
     the SQ     how clear the axis's seat is of charge, one minus its mean SQ
                out of ten, splined round the turn between the eight axes.
                The same mean the gravity weighs, read off gsq.
     the bend   where the seat's laws, the shell, stand off your level. The
                band between the two is the part of the field that has been
                pulled out of true, and inside it the light drops by up to
                eight tenths, full at twenty five points of bend (the tension
                line's own full), easing off above and below the band on a
                width of eight points. A level field has no band.
   So a figure with nothing held and nothing bent is lit evenly through its
   whole volume, which is his "ball of light", and a seat pulled forty points
   under the level, Sofia's desire, is a dark tongue from her level down to
   where that seat's laws sit. No height gradient is added: he named two
   causes and a third would be a reading this file made up.

   OVER GLOWS, UNDER SINKS, the figure's one rule for light, and no red and
   no green. The whole volume glows in the accent, Source's colour, as
   bright as the engine's radiance; a cell short of your radiance has the
   well's own colour laid over it, which is the light taken back. Ten steps,
   each an eighth of your radiance wide. Stepped rather than smooth, because
   a smooth field on a canvas is a fill per cell, near two thousand a frame;
   ten steps is ten paths a side, the same one path per colour the over and
   under bands already use, and the step edges read as contours.

   THE FIRST CUT WAS ONE ABSOLUTE RAMP, well to accent by the drawn heat,
   and it could not be read. Marcus's four ten point bends dim his radiance
   by about three tenths, and at the overlay's strength that came out as a
   seven per cent change on screen: an even blue grey tint over his whole
   figure. At Gordon's radiance of 0.10 every cell fell in the bottom two of
   ten steps, so his charge pattern, which is the reading, was one flat
   dark. Stepping by the share of your own radiance and letting the
   radiance set the brightness keeps both: how bright the field is, and
   where in it the light is short.

   The mesh bends with the sheet when the well is on, because it is the
   figure, and is off for the unread profile, where there is no radiance to
   spread. Held still under reduced motion, as it is anyway: the heat moves
   only when the springs under it move.

   COST, MEASURED AND DATED, 28 September, headless Chromium on a software
   raster, --disable-gpu, load average between 3 and 4, Marcus, coneDraw
   plus a forced flush, the minimum of ninety frames, the tab's own loop
   stopped. Before is HEAD 175b6f8, after is the switch on:

                        pulse           well            top
     1600 at 1x         6.2 -> 7.7      6.8 -> 9.0      not drawn
     1600 at 2x         9.1 -> 11.4     11.2 -> 14.0    not drawn
     390 at 3x          6.6 -> 8.3      8.5 -> 10.8     not drawn
     zoomed 2.5x, 1600 at 2x, pulse: 10.3 -> 13.4

   Two fills a step, near and far, twenty in all, and no gradient, blur or
   readback. The first cut cost 21.7 ms over at 1600 at 2x, and A RUN, NOT
   A CELL in ndlHeatDraw is why it does not now. The well pays most because
   its warp runs on every corner of the mesh. Switch off, it is one flag
   read and nothing below runs: 8.8 against HEAD's 9.1 on the same run.
   ============================================================ */
function ndlHeatField(G,M,cq,R,ee){
 var P=NDL.P, i, k, c, r;
 if(!NDL.hEs){NDL.hEs=MIRROR.map(function(m,j){return {t:j/8,x:50};});
  NDL.hEc=MIRROR.map(function(m,j){return {t:j/8,x:1};});}
 /* the bend eases out of the level on the entrance, as the shell does */
 for(i=0;i<8;i++){NDL.hEs[i].x=cq+(M.seat[NDL.sIdx[i]].x-cq)*ee;
  NDL.hEc[i].x=1-clamp(NDL.gsq[i],0,10)/10;}
 var cpf=NDL_HC/8, rs=G.Rb*NDL_SLAB;
 for(c=0;c<NDL_HC;c++){var tm=(c+.5)/NDL_HC, fi=Math.floor(c/cpf), um=(c%cpf+.5)/cpf;
  NDL.hs[c]=coneSpline(NDL.hEs,tm); NDL.hc[c]=clamp(coneSpline(NDL.hEc,tm),0,1);
  NDL.hn[c]=(NDL.sA[fi]*(1-um)+NDL.sA[(fi+1)%8]*um)>=0?1:0;}
 /* the corners, through ndlPf, so the mesh lies on the faces and bends with
    them; limbo's rows, 9 to 13, sit on the limbo ring */
 for(r=0;r<23;r++){var q=NDL_HQ[r], lim=(r>=9&&r<=13);
  for(c=0;c<=NDL_HC;c++){
   ndlPf(q,Math.floor(c/cpf)%8,(c%cpf)/cpf,G,P,lim?rs:undefined);
   NDL.hx[r*(NDL_HC+1)+c]=P.x; NDL.hy[r*(NDL_HC+1)+c]=P.y;}}
 /* each cell's raw strength, and their mean */
 var sum=0, n=0, row=0;
 for(r=0;r<22;r++){if(r===8||r===13)continue;
  var qm=(NDL_HQ[r]+NDL_HQ[r+1])/2;
  for(c=0;c<NDL_HC;c++){var s=NDL.hs[c], lo=Math.min(s,cq), hi=Math.max(s,cq);
   var D=clamp((hi-lo)/25,0,1), dq=qm<lo?lo-qm:(qm>hi?qm-hi:0);
   var f=NDL.hc[c]*(1-.8*D*Math.exp(-dq*dq/128));
   NDL.hf[row*NDL_HC+c]=f; sum+=f; n++;}
  row++;}
 /* stepped by the cell against the mesh's own mean: one is at your
    radiance, under one is short of it, and each step is an eighth of it
    wide, rounded to the nearest, so the brightest step is an eighth over. */
 var mean=sum/n, kk=mean>1e-4?1/mean:0;
 NDL.hR=R;
 for(k=0;k<n;k++)NDL.hl[k]=Math.min(NDL_HL-1,Math.floor(NDL.hf[k]*kk/NDL_HS+.5));}
/* one side of the field: the far half first, veiled by the near glass drawn
   after it, then the near half over the near glass. One path per step. */
function ndlHeatDraw(g,front,a){
 var W1=NDL_HC+1, R=NDL.hR, lv, r, c, row;
 var sig=NDL.colSig+'|'+NDL.wl.join()+'|'+NDL.gc.join()+'|'+R.toFixed(2);
 /* EACH STEP IS A GLOW AND A VEIL, folded into one colour so it is one
    fill. The glow is the accent, as bright as the engine's radiance with a
    floor of a quarter so a dim field is still seen to be lit, and it is the
    cell's share of that. The veil is the well's own colour, laid over as
    far as the cell falls short of your radiance, full at three tenths of
    it. The two composited by hand: alpha one minus both misses, colour the
    two weighted by what each contributes. Read once per lighting and per
    hundredth of radiance, never per frame. */
 if(NDL.hSig!==sig){NDL.hSig=sig; NDL.hCol=[];
  for(lv=0;lv<NDL_HL;lv++){var p=lv*NDL_HS, w=NDL.wl, gc=NDL.gc;
   var gl=NDL_HEAT_G*(.25+.75*R)*p/NDL_HR, vl=NDL_HEAT_S*clamp((1-p)/.7,0,1);
   var al=1-(1-gl)*(1-vl), cw=vl/al, cg=gl*(1-vl)/al;
   NDL.hCol.push('rgba('+Math.round(gc[0]*cg+w[0]*cw)+','+Math.round(gc[1]*cg+w[1]*cw)
    +','+Math.round(gc[2]*cg+w[2]*cw)+','+al.toFixed(3)+')');}}
 /* A RUN, NOT A CELL. The first cut added every cell to the path as its
    own quad, near two thousand of them, and the frame went from 9.1 ms to
    30.8 at 1600 at twice the density. Split by part, the field's arithmetic
    was under a tenth of a millisecond and building the path alone was 17.5:
    on a software raster each canvas call is about two microseconds, so the
    cost was the count of calls and not the pixels, which is why the phone
    paid nearly as much as the desk. A face is flat and its projection is
    affine, so along one row of one face every corner lies on one straight
    line: a run of cells at the same step needs a corner at its two ends and
    at each rib it crosses, and nothing between. Under the well the sheet
    bends between ribs, so there every third corner is kept, four a face,
    which still lands on every rib: every corner cost 3.5 ms over the switch
    off, and the pull falls off over a third of the base radius, wider than
    a quarter face, so the extra corners were drawing a curve that was not
    there to draw. */
 var cpf=NDL_HC/8, ev=NDL.wn>0?3:cpf, X=NDL.hx, Y=NDL.hy, HL=NDL.hl, HN=NDL.hn, fr=front?1:0;
 g.globalAlpha=a;
 for(lv=0;lv<NDL_HL;lv++){var any=false; g.beginPath(); row=0;
  for(r=0;r<22;r++){if(r===8||r===13)continue;
   var o=row*NDL_HC, t0=r*W1, b0=t0+W1;
   for(c=0;c<NDL_HC;c++){
    if(HL[o+c]!==lv||HN[c]!==fr)continue;
    var c1=c; while(c1+1<NDL_HC&&HL[o+c1+1]===lv&&HN[c1+1]===fr)c1++;
    any=true; g.moveTo(X[t0+c],Y[t0+c]);
    for(var e=c+1;e<=c1;e++)if(e%ev===0)g.lineTo(X[t0+e],Y[t0+e]);
    g.lineTo(X[t0+c1+1],Y[t0+c1+1]); g.lineTo(X[b0+c1+1],Y[b0+c1+1]);
    for(e=c1;e>c;e--)if(e%ev===0)g.lineTo(X[b0+e],Y[b0+e]);
    g.lineTo(X[b0+c],Y[b0+c]); g.closePath();
    c=c1;}
   row++;}
  if(any){g.fillStyle=NDL.hCol[lv]; g.fill();}}
 g.globalAlpha=1;}
function ndlTip(x0,y0,r0,kind,i){
 var t=NDL.tips[NDL.nt]||(NDL.tips[NDL.nt]={});
 t.x=x0; t.y=y0; t.r=r0; t.k=kind; t.i=i; NDL.nt++;}
function ndlHit(x0,y0,r0,i,end){
 var h=NDL.hp[NDL.nh]||(NDL.hp[NDL.nh]={});
 h.x=x0; h.y=y0; h.r=r0; h.m=MIRROR[i]; h.i=i; h.end=end; h.path=null; NDL.nh++;
 CONE.hits.push(h);}
/* the faces, as glass: the Field's panels are dark with lit edges, and a face
   is lit by how squarely it faces a key light from the upper left */
function ndlFaces(g,G,front){
 var TAU=Math.PI*2, U=NDL.U, L=NDL.L, ay=NDL.ay, zy=NDL.zy, ee=NDL.ee;
 for(var f=0;f<8;f++){
  var mid=(f+.5)*TAU/8+CONE.spin, fd=Math.sin(mid);
  if((fd>=0)!==front)continue;
  var lt=.5+.5*Math.cos(mid-2.36), j=(f+1)%8, k2=front?1:.45;
  ndlTri(g,G.cx,ay,U[f*2],U[f*2+1],U[j*2],U[j*2+1],rgba(NDL.gc,(.035+.10*lt)*k2*ee));
  /* the lower faces carry less than the upper ones. TIERCOL's law holds on
     a shape as much as on a marker: a figure that shouts loudest at the
     bottom tells somebody standing there that they are an emergency. */
  ndlTri(g,G.cx,zy,L[f*2],L[f*2+1],L[j*2],L[j*2+1],rgba(NDL.rc,(.02+.04*lt)*k2*ee));}}
/* a rib: apex, base corner, the limbo ring's corner above and below, the
   other base corner, the other apex */
function ndlRib(g,G,i,front){
 if((NDL.sA[i]>=0)!==front)return;
 var U=NDL.U, L=NDL.L, T=NDL.ST, B=NDL.SB, on=(i===NDL.lit), c2=NDL.cols[i];
 g.beginPath(); g.moveTo(G.cx,NDL.ay); g.lineTo(U[i*2],U[i*2+1]); g.lineTo(T[i*2],T[i*2+1]);
 g.lineTo(B[i*2],B[i*2+1]); g.lineTo(L[i*2],L[i*2+1]); g.lineTo(G.cx,NDL.zy);
 g.strokeStyle=rgba(c2,(on?.85:(front?.40:.14))*NDL.ee); g.lineWidth=(on?2:1.1)*G.sk; g.stroke();}
/* a teacher or an inversion, as the Field draws a seat's badge: cleared to
   the well, ringed in the seat's colour, the glyph inside. The inversion is
   the same token at an opacity with a broken ring, which is the brand's own
   darker version of a colour and the only one it has. */
function ndlBadge(g,G,i,up,front){
 if((NDL.sA[i]>=0)!==front)return;
 var TAU=Math.PI*2, P=NDL.P, m=MIRROR[i], on=(i===NDL.lit), c2=NDL.cols[i], sk=G.sk;
 ndlPf(up?NDL_REF_UP:NDL_REF_DN,i,0,G,P);
 var x=P.x, y=P.y, rb=(on?13:11)*sk*(.78+.22*P.d), al=(front?1:.42)*NDL.ee;
 g.beginPath(); g.arc(x,y,rb,0,TAU); g.fillStyle=rgba(NDL.wl,front?1:.6); g.fill();
 g.fillStyle=rgba(c2,(up?.10:.06)*al); g.fill();
 if(!up)g.setLineDash([2.2*sk,2.4*sk]);
 g.strokeStyle=rgba(c2,(up?.95:.62)*al); g.lineWidth=(on?2:1.4)*sk; g.stroke();
 g.setLineDash([]);
 if(on){g.beginPath(); g.arc(x,y,rb+5*sk,0,TAU); g.strokeStyle=rgba(c2,.4*al); g.lineWidth=1; g.stroke();}
 coneGlyph(g,up?m.ic:m.dic,x,y,c2,(up?.95:.66)*al,rb*1.2,1.6);
 if(front){ndlHit(x,y,Math.max(16,rb+4),i,up?'up':'dn'); ndlTip(x,y,rb+4,up?'up':'dn',i);}}
/* one closed octagon or sampled loop, stroked or filled by the caller */
function ndlOct(g,A){
 g.beginPath(); g.moveTo(A[0],A[1]);
 for(var n=1;n<=8;n++)g.lineTo(A[(n%8)*2],A[(n%8)*2+1]);}
function ndlRing(g,G,q){
 var P=NDL.P; g.beginPath();
 for(var n=0;n<=8;n++){ndlPf(q,n%8,0,G,P); n?g.lineTo(P.x,P.y):g.moveTo(P.x,P.y);}}
/* part of one limbo plane's rim, from angle a0 to a1, onto the current path.
   The canvas draws the ellipse itself when nothing is bending the figure; a
   gravity well bends it, so then it is sampled through ndlP like every
   other line. An empty path takes the first lineTo as a moveTo. */
function ndlDisc(g,G,yc,q,rs,ry,a0,a1){
 if(!NDL.wn){g.ellipse(G.cx,yc,rs,ry,0,a0,a1); return;}
 var P=NDL.P, N=48, k;
 for(k=0;k<=N;k++){ndlP(q,a0+(a1-a0)*k/N-CONE.spin,G,P); g.lineTo(P.x,P.y);}}
/* ONE OF THE FIVE, at the upper point as a path or at the lower as its
   inversion. The lower is the upper reflected through the waist, and it is
   drawn as the eight inversions are: the same badge with a broken ring, at
   the darker strength, in the blueprint's colour. */
function ndlCrown(g,x0,y0,n,up,cs,col){
 var TAU=Math.PI*2, pl=NDL_PATHS[n], inner=pl.ring===1, rad=(inner?34:60)*cs;
 var px=x0+Math.cos(pl.ang)*rad, py=up?(y0-10*cs+Math.sin(pl.ang)*rad):(y0+10*cs-Math.sin(pl.ang)*rad);
 var rb2=(inner?10.5:9)*cs, ee=NDL.ee;
 g.beginPath(); g.moveTo(x0,y0); g.lineTo(px,py);
 g.strokeStyle=rgba(col,(up?.22:.16)*ee); g.lineWidth=1; g.stroke();
 g.beginPath(); g.arc(px,py,rb2,0,TAU); g.fillStyle=rgba(NDL.wl,1); g.fill();
 if(!up)g.setLineDash([2.2*cs,2.4*cs]);
 g.strokeStyle=rgba(col,(inner?.9:.6)*(up?1:.72)*ee); g.lineWidth=(inner?1.5:1.1)*cs; g.stroke();
 g.setLineDash([]);
 coneGlyph(g,up?pl.p.ic:pl.p.dic,px,py,col,(inner?.95:.72)*(up?1:.8)*ee,rb2*1.25,1.6);
 ndlTip(px,py,rb2+3,up?'path':'pathdn',n);
 /* A PATH IS PRESSED, round KQ: it opens the path's drill, which carries the
    ritual toward it. Pooled with the axis hits, so a frame makes no garbage;
    m is null and path names the entry, which is what the press reads. The
    inversions below are named on hover and carry no ritual. */
 if(up){var h=NDL.hp[NDL.nh]||(NDL.hp[NDL.nh]={});
  h.x=px; h.y=py; h.r=Math.max(16,rb2+4); h.m=null; h.i=-1; h.end='path'; h.path=n; NDL.nh++;
  CONE.hits.push(h);}}
function coneNeedle(){
 var c=CONE.cv, g=CONE.g, TAU=Math.PI*2;
 var W=c.width/CONE.dpr, H=c.height/CONE.dpr;
 g.setTransform(CONE.dpr,0,0,CONE.dpr,0,0);
 g.clearRect(0,0,W,H);
 CONE.hits=[]; NDL.nt=0; NDL.nh=0;
 var r=compute(), M=coneMirSync(r), read=!r.unread;
 var G=ndlGeo(W,H), sk=G.sk, P=NDL.P, i, k, n;
 var ink=INK(), gc=GOLDC(), rc=bc('Root');
 var tc=read&&TIERCOL[r.tier]?hx(TIERCOL[r.tier]):gc;
 /* the entrance: the two pyramids open out of the limbo ring, and the shape
    rises out of the level, so the first thing a person sees move is their
    own distortion arriving */
 /* timed on the wall clock, not in frames: a loaded machine drops frames,
    and an entrance counted in them stretches to however slow the machine is */
 var now=(typeof performance!=='undefined'?performance.now():Date.now());
 var e=REDUCED?1:clamp((now-CONE.t0)/900,0,1), ee=1-Math.pow(1-e,3);
 NDL.vs=.55+.45*ee; NDL.ee=ee; NDL.gc=gc; NDL.rc=rc; NDL.lit=CONE.front;
 var br=REDUCED?1:0.86+0.14*Math.sin(TAU*CONE.t/4.2);
 var cq=read?M.cq.x:50, cols=ndlCols();
 if(!NDL.sIdx){NDL.sIdx=MIRROR.map(function(m){return BANDS.indexOf(m.seat);});
  NDL.Es=MIRROR.map(function(m,j){return {t:j/8,x:50};});
  NDL.Eb=MIRROR.map(function(m,j){return {t:j/8,x:50};});}
 for(i=0;i<8;i++){NDL.cA[i]=Math.cos(i*TAU/8+CONE.spin); NDL.sA[i]=Math.sin(i*TAU/8+CONE.spin);}
 /* THE WELLS, round KG, when the switch is on: each node, placed with the
    warp off, and its weight cubed. Everything drawn after this line bends. */
 NDL.wn=0;
 if(CONE.well&&read){var gw=ndlGrav(), nw=0;
  NDL.ws2=2*Math.pow(NDL_WELL_S*G.Rb,2);
  /* AND THE WELLS BREATHE, round KQ: "the gravity stuff looks great ... see
     if you can push it even further." A still well is a dent. Each mass now
     sags and eases on its own slow breath, deeper and slower the heavier it
     is, so the contours round it visibly draw in and let go: a sheet with
     weight on it, not a sheet with a crease in it. */
  for(i=0;i<8;i++){var g3w=gw[i]*gw[i]*gw[i], wv=g3w*ee; if(wv<.02)continue;
   if(!REDUCED)wv*=1+(.10+.16*g3w)*Math.sin(CONE.t*(1.9-.8*g3w)+i*1.3);
   ndlPf(cq+(M.ax[i].x-cq)*ee,i,0,G,P);
   NDL.wc[nw*3]=P.x; NDL.wc[nw*3+1]=P.y; NDL.wc[nw*3+2]=wv; nw++;}
  NDL.wn=nw;}
 /* THE SHEET BENDS, THE READING DOES NOT. The first cut bent everything,
    and the nodes, which are the wells, were pulled into each other by their
    neighbours' wells: at 1600 Marcus's upper five drew in a clump a third of
    their true spread, which moved the reading to show the effect. So the
    warp runs on the figure (faces, ribs, rims, planes, contours) and is
    off for the teachers' badges, the shell, the ribbon, the level, the range, the sparks
    and the nodes, which stay exactly where the reading puts them. */
 var wsave=NDL.wn;
 var ax=G.cx, ay=ndlY(100,G), zy=ndlY(0,G), st=Math.sin(CONE.nt), rs=G.Rb*NDL_SLAB;
 NDL.ay=ay; NDL.zy=zy;
 /* the eight corners of each base and of the limbo ring, top and bottom */
 var U=NDL.U, L=NDL.L, ST=NDL.ST, SB=NDL.SB;
 for(i=0;i<8;i++){
  ndlPf(60,i,0,G,P); U[i*2]=P.x; U[i*2+1]=P.y;
  ndlPf(40,i,0,G,P); L[i*2]=P.x; L[i*2+1]=P.y;
  ndlPf(60,i,0,G,P,rs); ST[i*2]=P.x; ST[i*2+1]=P.y;
  ndlPf(40,i,0,G,P,rs); SB[i*2]=P.x; SB[i*2+1]=P.y;}

 /* THE LIGHT AT EACH POINT. Source glows and the blueprint smoulders, and
    both are the canvas element's own background image rather than pixels
    painted into it. Measured on a software raster at twice the density:
    filling the two gradients every frame was the largest single cost the
    needle had, and taking it out doubled the frame rate. As a background it
    is painted when it changes, which is when the figure is resized, tilted
    or relit, and never on a frame where only the spin moved. The colour
    under it stays the sheet's, so every lighting keeps its own well. */
 NDL.wl=ndlWell();
 var fay=G.cy-(1)*G.Hs*Math.cos(CONE.nt), fzy=G.cy+G.Hs*Math.cos(CONE.nt);
 var gsig=Math.round(fay)+'|'+Math.round(fzy)+'|'+Math.round(G.Rb)+'|'+Math.round(ax)+'|'+gc[0]+','+gc[1]+','+gc[2]
  +'|'+rc[0]+','+rc[1]+','+rc[2]+'|'+(read?1:0);
 if(NDL.glowSig!==gsig){NDL.glowSig=gsig;
  var k0=read?1:.7, R1=Math.round(G.Rb*1.15), R2=Math.round(G.Rb*.8);
  c.style.backgroundImage='radial-gradient(circle '+R1+'px at '+Math.round(ax)+'px '+Math.round(fay)+'px,'
   +rgba(gc,.30*k0)+','+rgba(gc,.09*k0)+' 35%,'+rgba(gc,0)+' 100%),'
   +'radial-gradient(circle '+R2+'px at '+Math.round(ax)+'px '+Math.round(fzy)+'px,'
   +rgba(rc,.09*k0)+','+rgba(rc,0)+' 100%)';}
 /* THE RADIANCE FIELD, round KR, worked out once here and drawn in two
    halves below. ndlGrav first, because its walk of the record is what
    fills gsq and the pulse only calls it further down the frame. */
 var heat=CONE.heat&&read;
 if(heat){ndlGrav(); ndlHeatField(G,M,cq,clamp(r.radiance,0,1),ee);}

 /* BEHIND: the far faces, the far ribs, and the far badges, veiled by the
    near faces that come after them */
 ndlFaces(g,G,false);
 if(heat)ndlHeatDraw(g,false,.45*ee);
 for(i=0;i<8;i++)ndlRib(g,G,i,false);
 /* the teachers keep their places too: bent, they slid onto the nodes */
 NDL.wn=0;
 for(i=0;i<8;i++){ndlBadge(g,G,i,true,false); ndlBadge(g,G,i,false,false);}
 NDL.wn=wsave;

 /* ============================================================
    THE LIMBO RING. Never blank. Ruled: "The oscillating space, I don't want
    it blank ... it's a range, right? There's still data in there."

    A gradient from the coherent rim's colour at sixty to the decoherent
    rim's at forty, because it is a range between the two and not a hole, lit
    in the tier's colour at the height your coherence sits if it sits inside
    the range, or pressed against the edge it is past if not. Your own range
    crosses it as a band, the level of your coherence cuts it as a plane, and
    the souls of everyone else who stands there drift in it.
    ============================================================ */
 var y60=ndlY(60,G)-rs*st, y40=ndlY(40,G)+rs*st;
 var cpos=clamp((60-clamp(cq,40,60))/20,0,1);
 var ssig=Math.round(y60)+'|'+Math.round(y40)+'|'+cpos.toFixed(2)+'|'+gc.join()+'|'+rc.join()+'|'+tc.join()+'|'+(read?1:0);
 if(NDL.slabSig!==ssig){NDL.slabSig=ssig;
  var sg=g.createLinearGradient(0,y60,0,Math.max(y60+1,y40));
  sg.addColorStop(0,rgba(gc,.20));
  if(read){sg.addColorStop(clamp(cpos-.18,0,1),rgba(tc,.08));
   sg.addColorStop(cpos,rgba(tc,.34));
   sg.addColorStop(clamp(cpos+.18,0,1),rgba(tc,.08));}
  else sg.addColorStop(.5,rgba(ink,.05));
  sg.addColorStop(1,rgba(rc,.16));
  NDL.slab=sg;}
 /* how far the gap has turned into two circular planes: none near edge on,
    all of it from NDL_DISC_HI up. Smoothstepped so a drag through the
    change reads as one motion and not a switch. */
 var dw=clamp((CONE.nt-NDL_DISC_LO)/(NDL_DISC_HI-NDL_DISC_LO),0,1); dw=dw*dw*(3-2*dw);
 var yc60=ndlY(60,G), yc40=ndlY(40,G), ry=rs*st;
 g.fillStyle=NDL.slab;
 if(dw<1){g.globalAlpha=ee*(1-dw);
  for(i=0;i<8;i++){var j=(i+1)%8;
   g.beginPath(); g.moveTo(ST[i*2],ST[i*2+1]); g.lineTo(ST[j*2],ST[j*2+1]);
   g.lineTo(SB[j*2],SB[j*2+1]); g.lineTo(SB[i*2],SB[i*2+1]); g.closePath(); g.fill();}}
 if(dw>0){
  /* THE TWO CIRCULAR PLANES. A circle at a height projects to an ellipse
     whose half height is its radius times the sine of the tilt, which is the
     same arithmetic ndlP does point by point, done once by the canvas.
     Back to front: the decoherent plane, the range between the two as the
     silhouette of the drum they bound, then the coherent plane over it. */
  /* the decoherent plane is the quieter of the two, by TIERCOL's law: a
     figure that shouts loudest at the bottom tells a person standing there
     they are an emergency. Measured on the first cut at the steepest tilt,
     a tenth of the root colour made the lower disc the loudest thing drawn. */
  g.globalAlpha=ee*dw;
  g.beginPath(); ndlDisc(g,G,yc40,40,rs,ry,0,TAU);
  g.fillStyle=rgba(rc,.05); g.fill();
  g.beginPath(); ndlDisc(g,G,yc60,60,rs,ry,Math.PI,TAU);
  ndlDisc(g,G,yc40,40,rs,ry,0,Math.PI); g.closePath();
  g.fillStyle=NDL.slab; g.globalAlpha=ee*dw*.8; g.fill();
  g.globalAlpha=ee*dw;
  g.beginPath(); ndlDisc(g,G,yc60,60,rs,ry,0,TAU);
  g.fillStyle=rgba(gc,.12); g.fill();
  /* each plane is a compass card: eight spokes, one per axis, in the seat's
     colour, from the centre to where that axis's rib crosses the rim */
  for(i=0;i<8;i++){
   var fr=NDL.sA[i]>=0?1:.5;
   P.x=G.cx; P.y=yc60; if(NDL.wn)ndlWarp(P); g.beginPath(); g.moveTo(P.x,P.y);
   ndlPf(60,i,0,G,P,rs); g.lineTo(P.x,P.y);
   g.strokeStyle=rgba(cols[i],.46*fr); g.lineWidth=1; g.stroke();
   P.x=G.cx; P.y=yc40; if(NDL.wn)ndlWarp(P); g.beginPath(); g.moveTo(P.x,P.y);
   ndlPf(40,i,0,G,P,rs); g.lineTo(P.x,P.y);
   g.strokeStyle=rgba(cols[i],.26*fr); g.stroke();}
  g.globalAlpha=1;}
 g.globalAlpha=1;
 /* the souls, the band's own eighteen, each drifting on its own phase round
    the ring and up and down inside it */
 for(var si=0;si<18;si++){
  var ph=si*2.399963, spd=0.20+((si*37)%11)/38, sw=REDUCED?0:Math.sin(CONE.t*spd+ph);
  ndlP(50+sw*8.6,ph+CONE.t*.05,G,P);
  var near=P.d>=0;
  g.beginPath(); g.arc(G.cx+(P.x-G.cx)*.96,P.y,(near?2.1:1.5)*sk,0,TAU);
  g.fillStyle=rgba(ink,(near?.42:.2)+sw*.1); g.fill();}
 /* the ring's own edges, faint, so it reads as a volume and not a wash */
 g.lineWidth=1;
 if(dw<1){g.strokeStyle=rgba(ink,.16*ee*(1-dw));
  ndlOct(g,ST); g.stroke(); ndlOct(g,SB); g.stroke();}
 /* the planes' rims, each in its own pole's colour, so which plane is which
    is read off the colour the two points already carry */
 if(dw>0){g.lineWidth=1.2*sk;
  g.beginPath(); ndlDisc(g,G,yc60,60,rs,ry,0,TAU); g.strokeStyle=rgba(gc,.72*ee*dw); g.stroke();
  g.beginPath(); ndlDisc(g,G,yc40,40,rs,ry,0,TAU); g.strokeStyle=rgba(rc,.34*ee*dw); g.stroke();
  g.lineWidth=1;}

 ndlFaces(g,G,true);

 /* Layers: the nine released bands and the nine compressed ones, now level
    rings on the faces of the two pyramids */
 if(CONE.layers){g.lineWidth=1;
  for(n=0;n<CONE_HI.length;n++){ndlRing(g,G,55+n*5); g.strokeStyle=rgba(gc,.16+n*0.03); g.stroke();}
  for(n=0;n<CONE_LO.length;n++){ndlRing(g,G,45-n*5); g.strokeStyle=rgba(rc,.16+n*0.03); g.stroke();}}
 /* the near half of the radiance, over the near glass and under the
    reading, so the shell, the level and the ribbon still read on top */
 if(heat)ndlHeatDraw(g,true,ee);

 if(read){
  /* the axis values, eased out of the level on the entrance */
  for(i=0;i<8;i++){
   NDL.Es[i].x=cq+(M.seat[NDL.sIdx[i]].x-cq)*ee;
   NDL.Eb[i].x=cq+(M.ax[i].x-cq)*ee;}
  /* THE WELL'S CONTOURS, round KG. Level lines on both pyramids, the same
     rings Layers draws, sampled finely so the bend shows: a sheet with
     masses on it. Only when the well is on. */
  if(NDL.wn){g.lineWidth=1;
   for(n=0;n<10;n++){var qg=n<5?64+n*7:36-(n-5)*7;
    ndlLoop(null,G,NDL.gx,NDL.gy,null,qg); ndlPoly(g,NDL.gx,NDL.gy);
    g.strokeStyle=rgba(n<5?gc:rc,(n<5?.34:.2)*ee); g.stroke();}}
  NDL.wn=0;
  ndlLoop(NDL.Es,G,NDL.sx,NDL.sy,NDL.sq);
  /* THE TENSION, per span, round KQ. A span is taut by how far its two ends
     stand off your level, full at twenty five points; taut spans swing a
     little and fast, slack ones barely and slow, the way a string does. A
     release is a pluck: the springs that carry it (coneMirStep) are moving,
     and how fast they move sets how hard the two spans either side ring,
     dying away over a second or two. The pulse plucks as well, below, so
     the gravity and the tension line are one system and not two effects. */
  var tsum=0, TP=NDL.tp;
  for(i=0;i<8;i++){
   TP[i]=REDUCED?0:Math.max(TP[i]*.965,Math.min(7,Math.abs(M.ax[i].v)*.14));}
  for(i=0;i<8;i++){var j2=(i+1)%8;
   var tau=clamp((Math.abs(NDL.Eb[i].x-cq)+Math.abs(NDL.Eb[j2].x-cq))/50,0,1);
   NDL.tt[i]=tau; tsum+=tau;
   NDL.ta[i]=REDUCED?0:(.14+.34*tau+(TP[i]+TP[j2])/2)*ee;
   NDL.tw[i]=2.6+5.4*tau+(TP[i]+TP[j2])*.6;
   NDL.tph[i]+=NDL.tw[i]/60;
   if(NDL.tph[i]>1e4)NDL.tph[i]-=Math.PI*2*1500;}
  ndlLoopT(NDL.Eb,G,NDL.bx,NDL.by);
  ndlLoop(null,G,NDL.qx,NDL.qy,null,cq);
  /* YOUR OWN RANGE, as a band on the figure, from the record */
  var mine=ndlRange();
  if(mine){
   g.beginPath();
   for(k=0;k<=8;k++){ndlPf(mine.hi,k%8,0,G,P); k?g.lineTo(P.x,P.y):g.moveTo(P.x,P.y);}
   for(k=8;k>=0;k--){ndlPf(mine.lo,k%8,0,G,P); g.lineTo(P.x,P.y);}
   g.closePath(); g.fillStyle=rgba(tc,.10*ee); g.fill();}
  /* THE LEVEL. Your coherence as a plane through the figure. */
  ndlPoly(g,NDL.qx,NDL.qy); g.closePath();
  g.fillStyle=rgba(tc,.07*ee); g.fill();
  /* OVER GLOWS, UNDER SINKS, between the shell and the level, one path per
     seat and side rather than one fill per sliver */
  for(i=0;i<8;i++)for(var s2=0;s2<2;s2++){
   var any=false; g.beginPath();
   for(k=i*NDL_SEC;k<(i+1)*NDL_SEC;k++){
    var over=(NDL.sq[k]+NDL.sq[k+1])/2>=cq;
    if(over!==(s2===0))continue; any=true;
    g.moveTo(NDL.sx[k],NDL.sy[k]); g.lineTo(NDL.sx[k+1],NDL.sy[k+1]);
    g.lineTo(NDL.qx[k+1],NDL.qy[k+1]); g.lineTo(NDL.qx[k],NDL.qy[k]); g.closePath();}
   if(!any)continue;
   if(s2===0){g.fillStyle=rgba(cols[i],.26*br); g.fill();}
   /* under: the light taken back toward the well, which is the ground's
      own colour laid over at a strength, not a new colour */
   else {g.fillStyle=rgba(NDL.wl,.55); g.fill();}}
  /* the level's edge, dashed, in the tier's colour */
  ndlPoly(g,NDL.qx,NDL.qy); g.setLineDash([2*sk,5*sk]);
  g.strokeStyle=rgba(tc,.7*ee); g.lineWidth=1.3*sk; g.stroke(); g.setLineDash([]);
  /* THE SHELL, each seat's stretch in its own colour, the near side bright
     and the far side dim, with a soft under stroke for the Field's glow */
  g.lineCap='round';
  for(i=0;i<8;i++){
   var near2=(NDL.sA[i]+NDL.sA[(i+1)%8])>=-.3;
   g.beginPath(); g.moveTo(NDL.sx[i*NDL_SEC],NDL.sy[i*NDL_SEC]);
   for(k=i*NDL_SEC+1;k<=(i+1)*NDL_SEC;k++)g.lineTo(NDL.sx[k],NDL.sy[k]);
   if(near2){g.strokeStyle=rgba(cols[i],.16*br); g.lineWidth=7*sk; g.stroke();}
   g.strokeStyle=rgba(cols[i],near2?.95:.4); g.lineWidth=(near2?2.8:1.6)*sk; g.stroke();}
  g.lineCap='butt';
  /* THE RIBBON, B, in the accent: the shape of where you sit */
  ndlPoly(g,NDL.bx,NDL.by); g.closePath();
  g.fillStyle=rgba(gc,.06*ee); g.fill();
  /* ITS GLOW IS ITS TENSION, round KQ. Each span carries a soft under
     stroke as wide and as bright as it is taut, and brighter again for a
     second after a pluck, so where you run furthest from your own level is
     the part of the line that lights. Over glows and under sinks, the
     figure's one rule for light: a span standing above your level takes
     the full glow and one below it takes half. One stroke per span, eight
     in all, no blur and no gradient. */
  g.lineCap='round'; g.lineJoin='round';
  for(i=0;i<8;i++){var t8=NDL.tt[i], j3=(i+1)%8;
   var up2=(NDL.Eb[i].x+NDL.Eb[j3].x)/2>=cq?1:.5;
   var far=(NDL.sA[i]+NDL.sA[j3])<-.3?.45:1;
   var ga2=(.05+.17*t8+Math.min(.22,(TP[i]+TP[j3])*.05))*up2*far*ee;
   if(ga2<.015)continue;
   g.beginPath(); g.moveTo(NDL.bx[i*NDL_SEC],NDL.by[i*NDL_SEC]);
   for(k=i*NDL_SEC+1;k<=(i+1)*NDL_SEC;k++)g.lineTo(NDL.bx[k],NDL.by[k]);
   g.strokeStyle=rgba(gc,ga2); g.lineWidth=(2.5+7*t8)*sk; g.stroke();}
  ndlPoly(g,NDL.bx,NDL.by); g.closePath();
  g.strokeStyle=rgba(gc,.85*ee); g.lineWidth=1.5*sk; g.stroke();
  /* AND A CURRENT RUNS ROUND IT. Two lights, half a turn apart, travel the
     loop, faster the more taut the whole line is, and each brightens over a
     taut span and dims over a slack one, so the eye is carried round the
     shape of where you sit and slows where nothing is pulling. A tail of
     three fading strokes and a head; no gradient is made per frame. */
  if(!REDUCED){
   NDL.cur+=(.035+.09*tsum/8)/60; NDL.cur-=Math.floor(NDL.cur);
   for(var cb=0;cb<2;cb++){
    var hk=Math.floor(((NDL.cur+cb*.5)%1)*NDL_N), sp3=Math.floor(hk/NDL_SEC)%8;
    var lum=(.35+.65*NDL.tt[sp3])*ee;
    for(var tl=0;tl<3;tl++){var a0=hk-(tl+1)*7, a1=hk-tl*7;
     g.beginPath();
     for(k=a0;k<=a1;k++){var kk=((k%NDL_N)+NDL_N)%NDL_N;
      k===a0?g.moveTo(NDL.bx[kk],NDL.by[kk]):g.lineTo(NDL.bx[kk],NDL.by[kk]);}
     g.strokeStyle=rgba(gc,(.8-tl*.26)*lum); g.lineWidth=(2.6-tl*.5)*sk; g.stroke();}
    g.beginPath(); g.arc(NDL.bx[hk],NDL.by[hk],5.2*sk,0,TAU); g.fillStyle=rgba(gc,.20*lum); g.fill();
    g.beginPath(); g.arc(NDL.bx[hk],NDL.by[hk],2.1*sk,0,TAU); g.fillStyle=rgba(gc,.95*lum); g.fill();}}
  g.lineCap='butt'; g.lineJoin='miter';
  /* THE SPARKS. Each rib carries light from your level toward its seat's
     laws: upward where the seat runs over, downward where it runs under, and
     brighter the further apart the two are. A seat at your level carries
     nothing, because nothing is pulling it. */
  if(!REDUCED)for(i=0;i<8;i++){
   var v=NDL.Es[i].x, gap=v-cq, sg2=Math.min(1,Math.abs(gap)/18);
   if(Math.abs(gap)<1.5)continue;
   for(k=0;k<3;k++){
    var ph2=CONE.t*.32+k/3+i*.137; ph2-=Math.floor(ph2);
    ndlPf(cq+gap*ph2,i,0,G,P);
    var al2=Math.sin(Math.PI*ph2)*sg2*(NDL.sA[i]>=0?1:.45);
    g.beginPath(); g.arc(P.x,P.y,4.6*sk,0,TAU); g.fillStyle=rgba(cols[i],.2*al2); g.fill();
    g.beginPath(); g.arc(P.x,P.y,1.9*sk,0,TAU); g.fillStyle=rgba(cols[i],.95*al2); g.fill();}}}

 /* IN FRONT: the near ribs, and the two rims that close each pyramid, which
    are the lips of the limbo ring, lit in their own colours */
 NDL.wn=wsave;
 for(i=0;i<8;i++)ndlRib(g,G,i,true);
 ndlOct(g,U); g.strokeStyle=rgba(gc,.10*br*ee); g.lineWidth=6*sk; g.stroke();
 g.strokeStyle=rgba(gc,.62*ee); g.lineWidth=1.3*sk; g.stroke();
 ndlOct(g,L); g.strokeStyle=rgba(rc,.10*br*ee); g.lineWidth=6*sk; g.stroke();
 g.strokeStyle=rgba(rc,.52*ee); g.lineWidth=1.3*sk; g.stroke();
 NDL.wn=0;
 for(i=0;i<8;i++){ndlBadge(g,G,i,true,true); ndlBadge(g,G,i,false,true);}
 /* the node where you sit on each axis, which is the press target, as the
    view from above had it */
 NDL.wn=0;
 if(read)for(i=0;i<8;i++){
  ndlPf(NDL.Eb[i].x,i,0,G,P);
  var on2=(i===NDL.lit), rn=(on2?5.4:4.2)*sk*(.8+.2*P.d), nx=P.x, ny=P.y, nd=P.d;
  /* THE BEAT, round KQ, read before the node is drawn because the node
     answers it. The pulse's first ring is the beat; the frame its phase
     wraps is the frame it lands, and that frame plucks the tension line at
     this axis and swells the node, harder the heavier the axis. So a heavy
     seat is seen to pull on the line it sits on, which is what gravity is. */
  var gv=ndlGrav()[i], gc3=gv*gv*gv, beat=0;
  if(!CONE.well&&!REDUCED&&gc3>=.04){
   var gp0=now/(3000-1900*gc3); gp0-=Math.floor(gp0);
   if(gp0<NDL.gph[i])TP[i]=Math.max(TP[i],(.9+2.2*gc3)*ee);
   NDL.gph[i]=gp0;
   if(gp0<.3){beat=1-gp0/.3; rn*=1+.16*gc3*beat;}}
  g.beginPath(); g.arc(nx,ny,rn,0,TAU); g.fillStyle=rgba(NDL.wl,1); g.fill();
  g.strokeStyle=rgba(cols[i],nd>=0?1:.5); g.lineWidth=(on2?2.2:1.6)*sk; g.stroke();
  ndlHit(nx,ny,Math.max(16,rn+10),i,'up');
  /* THE PULL, round KH, when the well is off: "the heavier the gravity,
     the more the pulsation." Every axis carrying weight rings, and weight
     cubed sets how many rings, how far they reach, how fast and how bright.
     It was the heaviest axis alone, and any within a fifth of it, at one
     speed; the fifth came from Marcus's eight all sitting between 69 and 100
     per cent of his heaviest, which the cube now separates instead (a third
     of the pull at 0.69). Reduced motion keeps one still ring per axis at
     its strength. When the well is on, the node gets its contours instead
     and nothing pulses, so the two mockups are each seen alone. */
  /* THE WELL PULLS IN, round KQ. The pulse's rings travel out; a well's
     should travel in, so the two mockups are each other's mirror and the
     eye reads which way the weight works. Three rings close on the node,
     brightening as they arrive, faster for a heavier mass. Round them, dust
     falls in: a few motes on a closing orbit, sped up as they near the
     centre the way anything falling into a mass speeds up, more of them and
     from further out the heavier the axis. The orbit is flattened by the
     figure's own tilt, so it lies on the figure rather than facing the
     glass. Reduced motion keeps the three rings where they were, still. */
  if(CONE.well){if(gc3>=.02){var wa=(.2+.5*gc3)*ee*(nd>=0?1:.5);
    if(REDUCED){for(var wk=1;wk<=3;wk++){g.beginPath(); g.arc(nx,ny,rn+(2+wk*wk*2.6*(.5+gc3))*sk,0,TAU);
     g.strokeStyle=rgba(cols[i],wa*(1.1-wk*.28)); g.lineWidth=1; g.stroke();}}
    else {
     for(var wk2=0;wk2<3;wk2++){var wp=now/(2600-1300*gc3)+wk2/3; wp-=Math.floor(wp);
      g.beginPath(); g.arc(nx,ny,rn+(2+(10+26*gc3)*(1-wp))*sk,0,TAU);
      g.strokeStyle=rgba(cols[i],wa*Math.pow(wp,1.3)*Math.min(1,(1-wp)*6));
      g.lineWidth=(.8+.9*gc3*wp)*sk; g.stroke();}
     var nm2=2+Math.round(5*gc3), fl=.45+.55*Math.sin(CONE.nt)/Math.sin(.75);
     g.fillStyle=rgba(cols[i],1);
     for(var mo=0;mo<nm2;mo++){var mp=now/1000*(.16+.22*gc3)+mo/nm2+i*.13; mp-=Math.floor(mp);
      var mr=rn+(3+(18+34*gc3)*Math.pow(1-mp,1.5))*sk, ma=i*1.7+mo*2.39996+6*mp*mp;
      g.globalAlpha=Math.sin(Math.PI*mp)*(.35+.6*gc3)*ee*(nd>=0?1:.5);
      g.beginPath(); g.arc(nx+Math.cos(ma)*mr,ny+Math.sin(ma)*mr*fl,(1+1.2*mp)*sk,0,TAU); g.fill();}
     g.globalAlpha=1;}}}
  else if(gc3>=.04){var ga=(.12+.62*gc3)*ee*(nd>=0?1:.5), nr=1+Math.round(2*gc3);
   /* and the beat swells out of the node's own edge as a soft band that
      thins as it goes, the moment the first ring leaves */
   if(beat>0){g.beginPath(); g.arc(nx,ny,rn+(1.5+3*gc3*(1-beat))*sk,0,TAU);
    g.strokeStyle=rgba(cols[i],.34*gc3*beat*ee*(nd>=0?1:.5)); g.lineWidth=(2+5*gc3)*beat*sk; g.stroke();}
   if(REDUCED){g.beginPath(); g.arc(nx,ny,rn+(5+10*gc3)*sk,0,TAU);
    g.strokeStyle=rgba(cols[i],ga); g.lineWidth=1.4*sk; g.stroke();}
   else for(var gk=0;gk<nr;gk++){
    var gp=now/(3000-1900*gc3)+gk/nr; gp-=Math.floor(gp);
    g.beginPath(); g.arc(nx,ny,rn+(3+(10+24*gc3)*gp)*sk,0,TAU);
    g.strokeStyle=rgba(cols[i],ga*(1-gp)); g.lineWidth=(1+gc3-gp*.9)*sk; g.stroke();}}}

 /* THE SPINE, and the reading on it: the two ends of the common range as
    ticks, your own range as a span, and the marker swinging through it */
 g.beginPath(); g.moveTo(ax,ay); g.lineTo(ax,zy);
 g.strokeStyle=rgba(ink,.16*ee); g.lineWidth=1; g.stroke();
 g.beginPath();
 for(n=40;n<=60;n+=20){var ty=ndlY(n,G);
  g.moveTo(ax-15,ty); g.lineTo(ax-9,ty); g.moveTo(ax+9,ty); g.lineTo(ax+15,ty);}
 g.strokeStyle=rgba(ink,.34); g.lineWidth=1; g.stroke();
 if(read){
  var rng=ndlRange(), osc=0, mcq=clamp(r.CQ,0,100);
  if(rng){var half=(rng.hi-rng.lo)/2, mid2=(rng.hi+rng.lo)/2;
   osc=(mid2-mcq)+(REDUCED?0:Math.sin(CONE.t*0.55))*half;
   var ya=ndlY(rng.hi,G), yb=ndlY(rng.lo,G);
   g.beginPath(); g.moveTo(ax,ya); g.lineTo(ax,yb);
   g.strokeStyle=rgba(tc,.34); g.lineWidth=3; g.stroke();
   g.beginPath(); g.moveTo(ax-7,ya); g.lineTo(ax+7,ya); g.moveTo(ax-7,yb); g.lineTo(ax+7,yb);
   g.strokeStyle=rgba(tc,.55); g.lineWidth=1.4; g.stroke();}
  var my=ndlY(mcq+osc,G);
  g.beginPath(); g.arc(ax,my,13*sk*br,0,TAU); g.strokeStyle=rgba(tc,.24); g.lineWidth=1; g.stroke();
  g.beginPath(); g.arc(ax,my,6.5*Math.max(.8,sk),0,TAU); g.fillStyle=rgba(tc,.95); g.fill();}

 /* THE POINT, AND THE FIVE AT IT. Source is the halo at the apex; the five
    paths crown it, each joined to the point it ends at. The blueprint is the
    fork at the other point, and the five inversions crown that, each one
    straight under the path it inverts. Ring, not fill, and no word painted. */
 var cs=Math.max(.8,sk);
 for(n=0;n<NDL_PATHS.length;n++){ndlCrown(g,ax,ay,n,true,cs,gc); ndlCrown(g,ax,zy,n,false,cs,rc);}
 coneGlyph(g,GL_HALO,ax,ay-4*cs,gc,.95*br,18*cs,1.8);
 coneGlyph(g,GL_FORK,ax,zy+18*cs,rc,.85,17*cs,1.8);
 ndlTip(ax,ay,12,'top',-1); ndlTip(ax,zy+14,14,'bot',-1);
 /* nothing outside this frame bends */
 NDL.wn=0;}
/* ============================================================
   THE REGISTERS. Round KS, 28 September.

   His words, round KR: "the full expression of CQ would just be a ball of
   light. but as the frequency gets pulled down the, towards darkness, the
   colored registers would show collapse geometrically." Three still mockups
   went back to him, none of them in the build, and round KS: "wire in these
   point cloud add it as a third option for the compass. The Rosa is
   fantastic, especially with the nodal shells collapsing from the entire
   center in and out. And I want to be able to model or select each chakra
   resonance. So add, create a button for each root sacral so I can turn
   them on and off ... increase the saturation by 30%."

   The Rosa he means is mockup A, and this is A ported, not copied. The
   mockup drew from an offline dump of engine.js taken in node. This reads
   compute() and the wheel's own addresses every frame, as the rest of this
   file does, so a release made anywhere arrives here.

   SEVEN SHELLS, ONE PER SEAT, and a shell's radius is its seat's
   wavelength: the lowest tone in FLOWSEAT over this seat's own. Root at 396
   Hz is the outer shell at one and Crown at 963 Hz sits at 0.41 of it, so
   the highest tone is innermost, his "fractal from the highest frequency
   inside out to the lowest". The tones are read through seatHz, so
   FLOWSEAT stays the one place a tone is written.

   EVERY ADDRESS ON THE WHEEL IS A PATCH ON ITS SEAT'S SHELL, laid on a
   fibonacci lattice in the order the Field's wheel carries them. Its pull
   is leverPull on its own held charge, the engine's own curve, so an
   address at 2 barely moves and one at 7 has nearly all fallen. That share
   of the patch's points leaves the shell: in by up to 0.22 of the radius,
   down by up to half of it, gathered tighter as it goes, and dark. The rest
   stays on the shell and loses up to 0.55 of its light. A share of the
   fallen matter, 0.28 as in the mockup, is caught on the way down, which is
   what makes a knot read as having come off the shell rather than sitting
   beside it.

   LIGHT ADDS, DARK OCCLUDES. Lit points sum, as the canvas's lighter does;
   a fallen point is matter standing in front of the light and is painted
   over it, so the cloud is drawn back to front.

   THE BALL OF LIGHT IS CQ AND NOTHING ELSE. A core of points, CQ squared of
   the most it holds, and the needle's own glow: the accent as the canvas
   element's background image, repainted only when it changes, reaching and
   burning by CQ. Rosa at 97 is the ball. Gordon, under twenty, is a few
   embers.

   A FRONT WEDGE IS CUT AWAY, 1.75 radians, so the inner shells show in
   section, and no address is laid inside it, so the cut hides nothing. The
   cut stands where the view opens and the figure sways about it instead of
   turning all the way round, because turned away the cut shows the outer
   shell's back and nothing else. A drag still turns it anywhere.

   THE MOTION, "collapsing from the entire center in and out". Each shell
   breathes at its own tone brought down onto the Field's 4.2 second
   breath: Root on the breath and Crown 963 over 396 times faster, so the
   inner shells ring fastest and the seven drift in and out of phase with
   each other, which is the nodal pattern. A shell rings by how clear it
   is, three per cent of its radius at no pull and nothing at full pull,
   because a shell carrying charge is dead weight. And the caught share of
   the fallen matter falls, shell to knot, over and over. Reduced motion
   gets the still figure.

   LAID OUT, NOT MEASURED, and the mockup said so on its face: where an
   address sits round its shell and how far its matter falls. Nothing here
   says an address is physically at that place.

   ONE CANVAS CALL A FRAME. About twelve thousand points at a desk, and at
   the two microseconds a call this file measured for the radiance, a
   fillRect each would be twenty four milliseconds before a pixel was
   drawn. So the points are projected into typed arrays, bucketed back to
   front by a counting sort, written into one ImageData by hand, light
   added and dark laid over, and put once, over the box they touched. No
   path, no gradient, no composite switch, no readback. The ball's glow is
   the element's background, as the needle's is.

   COST, MEASURED AND DATED, 28 September, headless Chromium on a software
   raster, --disable-gpu, load average between 1.2 and 3.6, coneDraw plus
   a forced flush, the minimum of ninety frames, the tab's own loop
   stopped. Before is the tree at HEAD 4b4c860 with the Masks work in it,
   after is this view in; the needle's pulse and Top are carried as the
   reference, and the Registers are new:

                        Marcus          Rosa            Gordon
     1600 at 1x
       pulse            4.1 -> 5.3      3.7 -> 3.7      4.9 -> 3.8
       top              4.8 -> 5.1      5.9 -> 4.6      3.3 -> 4.1
       Registers        1.3             1.7             1.8
     1600 at 2x
       pulse            6.8 -> 8.4      6.4 -> 6.3      7.8 -> 7.6
       top              8.2 -> 8.3      8.8 -> 8.8      6.3 -> 6.4
       Registers        2.1             2.5             2.1
     390 at 3x
       pulse            6.4 -> 5.1      3.5 -> 4.6      5.1 -> 4.4
       top              5.4 -> 4.4      3.8 -> 3.8      3.8 -> 3.8
       Registers        0.9             1.3             0.8
     zoomed 2.5x, 1600 at 2x: Registers 3.3, 2.7 and 2.6, where the pulse
     is 7.8, 5.9 and 8.4 with the stepped budget.

   The needle's path gained one flag read, and the moves on it are the
   spread between runs, not a cost: Marcus's pulse at 2x read 7.4, 6.6,
   6.8 and 8.4 across four runs of the same code. The Registers are the
   cheapest figure the Compass draws.
   ============================================================ */
const RGS_CUT=1.75;     /* the wedge, radians, centred on the viewer at open */
const RGS_PTS=3400;     /* points on the outer shell at the mockup's scale */
const RGS_AT=270;       /* that scale: CSS pixels to the outer shell */
const RGS_CORE=2200;    /* the ball of light at CQ 100, at the same scale */
const RGS_DIST=4.2;     /* the camera, in outer shell radii */
const RGS_BIN=32;       /* depth buckets for the back to front pass */
/* HIS THIRTY PER CENT, as HSL saturation times 1.3, clamped at full, on
   every colour the points are painted in. Measured 28 September off the
   Dark lighting's seat tokens through this function, before and after,
   the before being the mockup's own colour for that point:
     Root, lit at Rosa's CQ 97        0.60 -> 0.78
     Heart, lit at Rosa's CQ 97       0.53 -> 0.69
     Crown, lit at Rosa's CQ 97       0.49 -> 0.63
     Root, lit at Gordon's CQ 19.3    0.62 -> 0.81
     Heart, lit at Gordon's CQ 19.3   0.57 -> 0.75
     Crown, lit at Gordon's CQ 19.3   0.54 -> 0.70
     Root, fallen                     0.53 -> 0.70
     Heart, fallen                    0.31 -> 0.39
     Crown, fallen                    0.26 -> 0.34
   The fallen colours land a little short of 1.3 times because a channel
   that dark rounds to a whole number on the way back.
   The ball of light's points take it too. Its glow is the needle's accent,
   the product's token, and does not: a boost on the token would be a second
   accent that only this view paints. */
const RGS_SAT=1.3;
/* the backing store's budget, in pixels: the needle's own 2.4 million, and
   held there at any zoom (coneLayout). The cloud is written a pixel at a
   time and put in one call (coneRegisters), so its cost is the canvas's
   area and never the zoom. The first cut held it to a million, about 1x at
   a desk, on the guess that the pixel loop would be the cost; measured, the
   whole frame was 1.3 to 2.0 ms at a million and 1.9 to 2.4 at the full
   budget, 1600 at 2x, so the million bought nothing and cost the crisp
   point the mockup was drawn with at 1.6x. */
const RGS_PIX=2.4e6;
var RGS={dens:0, n:0, who:'', s0:null, glowSig:'', hs:-1, img:null, bb:null,
 /* one per seat, Root first: whether its shell is drawn. His buttons. */
 on:[1,1,1,1,1,1,1], R:null, T:null, ad:null, cam:null};
function rgsRng(seed){var s=seed>>>0||1;
 return function(){s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%1e9)/1e9;};}
function rgsGauss(r){var u=r()||1e-9, v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.2831853*v);}
/* saturation times k in HSL, hue and lightness kept */
function rgsSat(c,k){
 var r=c[0]/255, g=c[1]/255, b=c[2]/255, mx=Math.max(r,g,b), mn=Math.min(r,g,b);
 var l=(mx+mn)/2, d=mx-mn; if(d<1e-6)return [c[0],c[1],c[2]];
 var s=l>.5?d/(2-mx-mn):d/(mx+mn), h;
 if(mx===r)h=(g-b)/d+(g<b?6:0); else if(mx===g)h=(b-r)/d+2; else h=(r-g)/d+4;
 h/=6; s=Math.min(1,s*k);
 var q=l<.5?l*(1+s):l+s-l*s, p=2*l-q;
 var f=function(t){t-=Math.floor(t);
  return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};
 return [Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)];}
/* THE CLOUD, laid out once per density. Per point it keeps two directions:
   where it sits on the shell, and the random draw its fallen place is made
   from, because the fallen place depends on the pull and the pull moves.
   Seeded, so a person is the same picture every time they come back. */
function rgsBuild(dens){
 var A=W_ADDR(), TAU=Math.PI*2, rnd=rgsRng(1234), hz0=1e9, i, k;
 BANDS.forEach(function(b){var h=seatHz(b); if(h&&h<hz0)hz0=h;});
 RGS.R=BANDS.map(function(b){var h=seatHz(b); return h?hz0/h:1;});
 /* the Field's 4.2 second breath at the lowest tone, shorter by the ratio */
 RGS.T=RGS.R.map(function(R){return 4.2*R;});
 var c0=Math.PI/2-RGS_CUT/2, ad=[], tot=0;
 BANDS.forEach(function(b,si){
  var mine=A.filter(function(n){return n.b===b;}), N=mine.length; if(!N)return;
  var R=RGS.R[si], per=Math.max(6,Math.round(RGS_PTS*dens*R*R/N));
  var capR=Math.sqrt(4*(1-RGS_CUT/TAU)/N)*.9;
  mine.forEach(function(n,j){
   /* address j of N on a fibonacci lattice laid over the sphere less the
      wedge, so the cut shows every shell in section and hides no address */
   var yy=1-2*(j+.5)/N, rr=Math.sqrt(1-yy*yy);
   var fr=(j*0.618034+si*0.37)%1, th=c0+RGS_CUT+.12+fr*(TAU-RGS_CUT-.24);
   var c=[Math.cos(th)*rr,yy,Math.sin(th)*rr];
   var up=Math.abs(c[1])>.9?[1,0,0]:[0,1,0];
   var t1=[c[1]*up[2]-c[2]*up[1],c[2]*up[0]-c[0]*up[2],c[0]*up[1]-c[1]*up[0]];
   var l1=Math.hypot(t1[0],t1[1],t1[2]); t1=[t1[0]/l1,t1[1]/l1,t1[2]/l1];
   var t2=[c[1]*t1[2]-c[2]*t1[1],c[2]*t1[0]-c[0]*t1[2],c[0]*t1[1]-c[1]*t1[0]];
   ad.push({n:n,si:si,c:c,t1:t1,t2:t2,capR:capR,o:tot,per:per,p:0,pb:-1});
   tot+=per;});});
 var nc=Math.round(RGS_CORE*dens), N2=tot+nc;
 var F=function(){return new Float32Array(N2);};
 RGS.lx=F(); RGS.ly=F(); RGS.lz=F(); RGS.da=F(); RGS.dc=F(); RGS.ds=F();
 RGS.jr=F(); RGS.fm=F(); RGS.rk=F(); RGS.ux=F(); RGS.uy=F(); RGS.uz=F();
 RGS.X=F(); RGS.Y=F(); RGS.Z=F(); RGS.K=F();
 RGS.si=new Uint8Array(N2); RGS.ai=new Uint16Array(N2); RGS.dk=new Uint8Array(N2);
 RGS.bin=new Uint8Array(N2); RGS.ord=new Uint32Array(N2); RGS.cnt=new Uint32Array(RGS_BIN+1);
 ad.forEach(function(a,ai){var c=a.c, t1=a.t1, t2=a.t2;
  for(k=0;k<a.per;k++){i=a.o+k;
   RGS.si[i]=a.si; RGS.ai[i]=ai; RGS.rk[i]=(k+.5)/a.per;
   var aa=a.capR*Math.sqrt(rnd()), bb=rnd()*TAU, ca=Math.cos(aa), sa=Math.sin(aa);
   var cb=Math.cos(bb), sb=Math.sin(bb), jt=1+rgsGauss(rnd)*.008;
   RGS.lx[i]=(c[0]*ca+(t1[0]*cb+t2[0]*sb)*sa)*jt;
   RGS.ly[i]=(c[1]*ca+(t1[1]*cb+t2[1]*sb)*sa)*jt;
   RGS.lz[i]=(c[2]*ca+(t1[2]*cb+t2[2]*sb)*sa)*jt;
   var b2=rnd()*TAU; RGS.da[i]=Math.sqrt(rnd()); RGS.dc[i]=Math.cos(b2); RGS.ds[i]=Math.sin(b2);
   RGS.fm[i]=rnd()<.28?rnd():-1; RGS.jr[i]=.8+.4*rnd();}});
 /* the core, seat index 7, never toggled: it is CQ and not a seat */
 for(i=tot;i<N2;i++){var u,v,w;
  do{u=rgsGauss(rnd)*.12; v=rgsGauss(rnd)*.12; w=rgsGauss(rnd)*.12;}while(Math.hypot(u,v,w)>.36);
  RGS.lx[i]=RGS.ux[i]=u; RGS.ly[i]=RGS.uy[i]=v; RGS.lz[i]=RGS.uz[i]=w;
  RGS.si[i]=7; RGS.ai[i]=65535; RGS.rk[i]=(i-tot+.5)/nc; RGS.fm[i]=-1;}
 RGS.ad=ad; RGS.tot=tot; RGS.n=N2; RGS.dens=dens; RGS.who='';}
/* one address's points set for its pull: the share under the pull falls,
   gathered to a spread that tightens as the pull grows, and the rest stay */
function rgsDirs(a){
 var p=a.p, ks=a.capR*(1-.8*p)*.55, c=a.c, t1=a.t1, t2=a.t2;
 for(var i=a.o;i<a.o+a.per;i++){
  if(RGS.rk[i]<p){var an=ks*RGS.da[i], ca=Math.cos(an), sa=Math.sin(an), cb=RGS.dc[i], sb=RGS.ds[i];
   RGS.ux[i]=c[0]*ca+(t1[0]*cb+t2[0]*sb)*sa; RGS.uy[i]=c[1]*ca+(t1[1]*cb+t2[1]*sb)*sa;
   RGS.uz[i]=c[2]*ca+(t1[2]*cb+t2[2]*sb)*sa; RGS.dk[i]=1;}
  else {RGS.ux[i]=RGS.lx[i]; RGS.uy[i]=RGS.ly[i]; RGS.uz[i]=RGS.lz[i]; RGS.dk[i]=0;}}
 a.pb=p;}
/* the figure's box: clear of the two name rails at a desk, as the needle's
   is (ndlGeo), with the fallen matter's reach below the outer shell */
/* 1.15 ACROSS, 1.38 DOWN. A shell's outline sits near the pivot's depth,
   where perspective is close to one, so across it needs little over its
   radius; 1.30, the nearest point's perspective, was the first cut, and at
   390 it drew the figure two thirds of the canvas wide with a third of the
   card empty under it. Down, the fallen matter reaches half a radius under
   the outer shell before perspective. */
function rgsGeo(W,H){
 var side=(typeof innerWidth==='number'&&innerWidth>=900)?176:20;
 var s0=Math.max(40,Math.min((W-2*side)/2/1.15,(H-24)/2/1.38));
 return {s0:s0, sc:s0*CONE.z, cx:W/2+CONE.zx, cy:H/2-.06*s0*CONE.z+CONE.zy};}
function coneRegisters(){
 var c=CONE.cv, g=CONE.g, TAU=Math.PI*2, dpr=CONE.dpr, i, k, q;
 var BW=c.width, BH=c.height, W=BW/dpr, H=BH/dpr;
 CONE.hits=[];
 var r=compute(), M=coneMirSync(r), read=!r.unread;
 /* the spring the needle's level rides on, so CQ arrives and never snaps */
 var CQ=read?clamp(M.cq.x,0,100)/100:0;
 var G=rgsGeo(W,H);
 /* the density follows the figure's size, in twentieths, so a person's
    cloud is laid out again on a resize and never on a frame */
 var dens=Math.round(clamp(Math.pow(G.s0/RGS_AT,2),.35,1.6)*20)/20;
 if(dens!==RGS.dens||!RGS.n)rgsBuild(dens);
 /* a new record starts steady, as coneMirSync does: moving from one person
    to another is never drawn as a change in either */
 var key=CURP+'|'+S.who, fresh=key!==RGS.who; RGS.who=key;
 var sp=[0,0,0,0,0,0,0], sn=[0,0,0,0,0,0,0], ad=RGS.ad;
 for(i=0;i<ad.length;i++){var a=ad[i], pt=leverPull(a.n.sq||0);
  if(fresh||REDUCED)a.p=pt; else a.p+=(pt-a.p)*.08;
  if(a.pb<0||Math.abs(a.p-a.pb)>.004)rgsDirs(a);
  sp[a.si]+=a.p; sn[a.si]++;}
 /* each shell's radius this frame: its tone's breath, as deep as it is clear */
 var Rt=RGS.R.map(function(R,s){
  if(REDUCED||!sn[s])return R;
  return R*(1+.03*(1-sp[s]/sn[s])*Math.sin(TAU*CONE.t/RGS.T[s]));});
 Rt.push(1);
 /* the cut faces the viewer where the view opened, and sways about it */
 if(RGS.s0===null)RGS.s0=CONE.spin;
 var yaw=CONE.spin-RGS.s0+(REDUCED?0:.45*Math.sin(CONE.t*.21)), pit=CONE.nt;
 var cy_=Math.cos(yaw), sy_=Math.sin(yaw), cp=Math.cos(pit), spn=Math.sin(pit);
 var scB=G.sc*dpr, cxB=G.cx*dpr, cyB=G.cy*dpr;
 RGS.cam={cy:cy_,sy:sy_,cp:cp,sp:spn,sc:G.sc,cx:G.cx,cyy:G.cy,Rt:Rt};
 /* THE BALL OF LIGHT'S GLOW, the needle's own: the accent as the element's
    background, painted when it changes and never on a frame where only the
    breath moved. At the mockup's reach and strength, both CQ's. */
 var ink=INK(), gc=GOLDC(), hot=LIGHT()?gc:mixc(ink,gc,.18);
 var gR1=Math.round(G.sc*(.35+.9*CQ)), gR2=Math.round(G.sc*.28), ga1=.30*CQ*CQ, ga2=.55*CQ*CQ;
 var gsig=Math.round(G.cx)+'|'+Math.round(G.cy)+'|'+gR1+'|'+gR2+'|'+ga1.toFixed(3)+'|'+gc.join()+'|'+hot.join();
 if(RGS.glowSig!==gsig){RGS.glowSig=gsig;
  var at=' at '+Math.round(G.cx)+'px '+Math.round(G.cy)+'px,';
  c.style.backgroundImage=ga1<.004?'none'
   :'radial-gradient(circle '+gR2+'px'+at+rgba(hot,ga2)+','+rgba(hot,ga2*.35)+' 35%,'+rgba(hot,0)+' 100%),'
   +'radial-gradient(circle '+gR1+'px'+at+rgba(gc,ga1)+','+rgba(gc,ga1*.35)+' 35%,'+rgba(gc,0)+' 100%)';}
 /* the palette this frame: each seat lit toward the ink by CQ and its
    fallen matter a quarter of its token, then his thirty per cent. A seat
    under the pointer, in the rail or on its button, stands forward. */
 var hs=RGS.hs>=0?RGS.hs:(CONE.hov>=0&&MIRROR[CONE.hov]?BANDS.indexOf(MIRROR[CONE.hov].seat):-1);
 var LC=[], DC=[], VA=[];
 for(q=0;q<7;q++){var col=bc(BANDS[q]);
  LC.push(rgsSat(mixc(col,ink,.06+.26*CQ),RGS_SAT));
  DC.push(rgsSat([Math.round(col[0]*.26),Math.round(col[1]*.22),Math.round(col[2]*.22)],RGS_SAT));
  VA.push(RGS.on[q]?(hs<0?1:(hs===q?1.35:.35)):0);}
 LC.push(rgsSat(hot,RGS_SAT)); DC.push(LC[7]); VA.push(1);
 var br=REDUCED?1:.86+.14*Math.sin(TAU*CONE.t/4.2);
 var nCore=Math.round((RGS.n-RGS.tot)*CQ*CQ), tf=REDUCED?0:CONE.t/3.6;
 /* PROJECT, and bucket by depth for the back to front pass: a counting
    sort into RGS_BIN buckets, linear in the points and no garbage */
 var n=RGS.n, X=RGS.X, Y=RGS.Y, Z=RGS.Z, K=RGS.K, BN=RGS.bin, CN=RGS.cnt;
 var UX=RGS.ux, UY=RGS.uy, UZ=RGS.uz, SI=RGS.si, AI=RGS.ai, DK=RGS.dk, FM=RGS.fm, JR=RGS.jr;
 CN.fill(0); var live=0;
 for(i=0;i<n;i++){var s=SI[i];
  if(!VA[s]||(s===7&&i-RGS.tot>=nCore)){BN[i]=255; continue;}
  var R=Rt[s], x=UX[i]*R, y=UY[i]*R, z=UZ[i]*R;
  if(DK[i]){var p=ad[AI[i]].p, f=FM[i]<0?1:(FM[i]+tf)%1;
   var rf=1-.22*p*f; x*=rf; z*=rf; y=y*rf-.5*p*f*JR[i]*R;}
  var x1=x*cy_+z*sy_, z1=-x*sy_+z*cy_, y2=y*cp-z1*spn, z2=y*spn+z1*cp;
  var kk=RGS_DIST/(RGS_DIST-z2);
  X[i]=cxB+x1*kk*scB; Y[i]=cyB-y2*kk*scB; Z[i]=z2; K[i]=kk;
  var bq=Math.floor((z2+1.4)/2.8*RGS_BIN); bq=bq<0?0:(bq>=RGS_BIN?RGS_BIN-1:bq);
  BN[i]=bq; CN[bq+1]++; live++;}
 for(q=1;q<=RGS_BIN;q++)CN[q]+=CN[q-1];
 var OR=RGS.ord;
 for(i=0;i<n;i++){if(BN[i]!==255)OR[CN[BN[i]]++]=i;}
 /* THE BUFFER. One ImageData the size of the backing store, written a
    pixel at a time and put once. Only the rows last frame touched are
    cleared and only the box this frame and last frame touched is put, so
    a figure a third of the canvas pays for a third of it. */
 if(!RGS.img||RGS.img.width!==BW||RGS.img.height!==BH){
  RGS.img=g.createImageData(BW,BH); RGS.bb=null;}
 var D=RGS.img.data, pb=RGS.bb;
 if(pb)for(q=pb[1];q<pb[3];q++)D.fill(0,(q*BW+pb[0])*4,(q*BW+pb[2])*4);
 var bx0=BW, by0=BH, bx1=0, by1=0, zg=(1+(CONE.z-1)*.2)*dpr;
 var cqA=.26+.60*CQ;
 for(q=0;q<live;q++){i=OR[q]; var s2=SI[i], dark=DK[i]===1, al, sz, cc;
  if(s2===7){cc=LC[7]; al=(.30*CQ+.05)*br; sz=1.2;}
  else if(dark){cc=DC[s2]; al=.72*Math.min(1,VA[s2]); sz=2.1;}
  else {var dA=.55+.45*clamp((Z[i]+1.2)/2.4,0,1);
   cc=LC[s2]; al=cqA*(1-.55*ad[AI[i]].p)*dA*VA[s2]; sz=1.35;}
  sz*=(.75+.35*K[i])*zg;
  /* a whole number of pixels, with the light kept: a point drawn wider
     than it is carries less per pixel, and a narrower one more. ROUNDED
     DOWN, NOT TO THE NEAREST. The first cut drew a 1.5 pixel point as two
     by two at 0.56 of its alpha, which kept the light and lost the peak:
     beside mockup A at one scale, Rosa's shells read as a grey speckle
     where the mockup's read as rings in their seats' colours, because a dot
     is seen by its brightest pixel. The second cut drew every small point
     as one pixel, and a lit point at Rosa's CQ needs over twice one
     pixel's alpha, so the clamp threw away more than half her light. So
     the square is the smallest that carries the point's light unclamped:
     as bright at its peak as it can be, and nothing lost. */
  var w=Math.ceil(sz*Math.sqrt(al)-.001); w=w<1?1:(w>3?3:w);
  var aa=al*sz*sz/(w*w); if(aa>1)aa=1; if(aa<.004)continue;
  var x0=Math.round(X[i]-w/2), y0=Math.round(Y[i]-w/2), x2=x0+w, y3=y0+w;
  if(x0<0)x0=0; if(y0<0)y0=0; if(x2>BW)x2=BW; if(y3>BH)y3=BH;
  if(x0>=x2||y0>=y3)continue;
  if(x0<bx0)bx0=x0; if(y0<by0)by0=y0; if(x2>bx1)bx1=x2; if(y3>by1)by1=y3;
  var cr=cc[0], cg=cc[1], cb=cc[2], a255=aa*255;
  for(var yy=y0;yy<y3;yy++)for(var xx=x0;xx<x2;xx++){var o=(yy*BW+xx)*4, A0=D[o+3];
   if(A0===0){D[o]=cr; D[o+1]=cg; D[o+2]=cb; D[o+3]=a255; continue;}
   var Af=A0/255, na, k1;
   /* dark is laid over, light is added, both in premultiplied terms and
      handed back straight, which is what ImageData holds */
   if(dark){na=Af+aa-Af*aa; k1=Af*(1-aa);}
   else {na=Af+aa; if(na>1)na=1; k1=Af;}
   var iv=1/na;
   D[o]=(D[o]*k1+cr*aa)*iv; D[o+1]=(D[o+1]*k1+cg*aa)*iv; D[o+2]=(D[o+2]*k1+cb*aa)*iv; D[o+3]=na*255;}}
 var nb=bx1>bx0?[bx0,by0,bx1,by1]:null, ux0, uy0, ux1, uy1;
 if(nb||pb){var U=nb&&pb?[Math.min(nb[0],pb[0]),Math.min(nb[1],pb[1]),Math.max(nb[2],pb[2]),Math.max(nb[3],pb[3])]:(nb||pb);
  ux0=U[0]; uy0=U[1]; ux1=U[2]; uy1=U[3];
  g.putImageData(RGS.img,0,0,ux0,uy0,ux1-ux0,uy1-uy0);}
 RGS.bb=nb;}
/* what is under the pointer, as words, for the canvas's own tooltip: the
   address whose patch is nearest, on a shell that is drawn. The nearer of
   two patches under one point wins. No figure is printed: whether a weight
   is impaired or blocked is not ruled yet, and held is. */
function rgsTipAt(x,y){
 var C=RGS.cam, ad=RGS.ad; if(!C||!ad)return '';
 var best=null, bs=1e9, bz=0;
 for(var i=0;i<ad.length;i++){var a=ad[i]; if(!RGS.on[a.si])continue;
  var R=C.Rt[a.si], wx=a.c[0]*R, wy=a.c[1]*R, wz=a.c[2]*R;
  var x1=wx*C.cy+wz*C.sy, z1=-wx*C.sy+wz*C.cy, y2=wy*C.cp-z1*C.sp, z2=wy*C.sp+z1*C.cp;
  var k=RGS_DIST/(RGS_DIST-z2), px=C.cx+x1*k*C.sc, py=C.cyy-y2*k*C.sc;
  var rr=Math.max(8,a.capR*R*k*C.sc), d=Math.hypot(x-px,y-py)/rr;
  if(d<=1&&d-z2*.5<bs){bs=d-z2*.5; best=a; bz=z2;}}
 /* the core stands at the pivot, so it is in front of every patch on the
    far side: at the centre of Rosa the first cut named a Sacral patch
    behind the light instead of the light */
 if((!best||bz<0)&&Math.hypot(x-C.cx,y-C.cyy)<C.sc*.2)
  return 'Your coherence, as the light at the centre.';
 if(!best)return '';
 var n=best.n, nm=/_Unnamed$/.test(n.k)?'An address with no name yet':n.k;
 return nm+((n.sq||0)>=4?', held at ':', at ')+n.b+'.';}
/* one seat's button, set to what it does now */
function rgsSeatSync(b){
 var si=+b.getAttribute('data-cnseat'), on=!!RGS.on[si], nm=BANDS[si], col=seatCol(nm);
 b.setAttribute('aria-pressed',on); b.classList.toggle('on',on);
 b.title=(on?'Hide':'Show')+' the '+nm+' shell, '+seatHz(nm)+' Hz';
 b.style.borderColor=on?col:'';
 var ci=b.querySelector('circle'); if(ci)ci.setAttribute('stroke-dasharray',on?'none':'1.6 1.8');}
/* THE SEVEN BUTTONS, his ask, under the figure where the key sits: "create
   a button for each root sacral so I can turn them on and off." Root first,
   the order he named them in. Ring, never fill, in the seat's own token,
   and the ring breaks when the shell is off. The name alone is the label;
   the tone is on the hover, because a row of seven figures under the drawing
   is a legend nobody asked for. */
function rgsSeatsHtml(){
 return '<div class="ck-g"><span class="ck-h">Seats</span>'
  +'<span class="ck-rows" role="group" aria-label="Seats" style="gap:6px">'
  +BANDS.map(function(b,si){
   return '<button type="button" class="cn-b" data-cnseat="'+si+'" style="gap:7px;--ax:'+seatCol(b)+'">'
    +'<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="flex:0 0 12px">'
    +'<circle cx="6" cy="6" r="4.6" fill="none" style="stroke:var(--ax)" stroke-width="1.6"/></svg>'
    +esc(b)+'</button>';}).join('')
  +'</span></div>';}
/* THE CANVAS FILLS THE CARD. The sheet's height is a cap from when the reading
   shared this card, and it is what made the Compass a quarter of the stage
   (see THE NEEDLE above). In tab mode the canvas takes whatever the card has
   left under its header and above the key; on a phone, where the page
   scrolls and the names follow the figure, it takes a tall box for a tall
   figure. As a sheet over another surface it keeps the sheet's own size. */
function coneFit(){
 var c=CONE.cv; if(!c)return;
 if(!CONE.tab){c.style.height=''; return;}
 var card=c.closest?c.closest('.cone-card'):null; if(!card)return;
 var h;
 if(innerWidth<900){
  h=Math.max(380,Math.min(innerHeight-140,c.clientWidth*1.5));}
 else {
  var cb=card.getBoundingClientRect(), cs=getComputedStyle(card);
  var key=card.querySelector('.cone-key');
  h=cb.bottom-parseFloat(cs.paddingBottom||0)-c.getBoundingClientRect().top
   -(key?key.getBoundingClientRect().height:0)-2;
  h=Math.max(340,h);}
 c.style.height=Math.floor(h)+'px';}
/* what is under the pointer on the needle, as words, for the canvas's own
   tooltip. A painted mark with no name anywhere breaks the rule that a thing
   with a mark has a name; the name comes up on hover instead of being
   printed across the figure. */
function ndlTipAt(x,y){
 var best=null, bd=1e9;
 for(var n=0;n<NDL.nt;n++){var t=NDL.tips[n], d=Math.hypot(x-t.x,y-t.y);
  if(d<=t.r&&d<bd){bd=d;best=t;}}
 if(!best)return '';
 var m=MIRROR[best.i];
 if(best.k==='up')return m.up+', the coherent pole of '+m.q.toLowerCase()+'. Opposite: '+m.dn+'.';
 if(best.k==='dn')return m.dn+', the inversion of '+m.q.toLowerCase()+'. Opposite: '+m.up+'.';
 if(best.k==='path'){var pp=NDL_PATHS[best.i].p;
  return pp.up+', one of the five paths: '+pp.q+'. Opposite: '+pp.dn+'.';}
 if(best.k==='pathdn'){var pd=NDL_PATHS[best.i].p;
  return pd.dn+', the inversion of '+pd.q+'. Opposite: '+pd.up+'.';}
 if(best.k==='top')return 'Coherent. The point the upper pyramid rises to.';
 return 'Decoherent. The point the lower pyramid falls to.';}
/* THE THREE HIGHEST LAWS AND THE THREE LOWEST, read once for the arrows on
   the figure and the key under it, so the arrow and the row naming it are
   the same law by construction rather than by two sorts agreeing. */
function coneRegLaws(){
 var laws=SI.map(function(l){return {nm:l.nm,v:S.law[l.nm]||0,b:l.b,ic:l.ic};})
  .sort(function(a,b){return b.v-a.v;});
 return {up:laws.slice(0,3), dn:laws.slice(-3).reverse()};}
/* ============================================================
   THE KEY, UNDER THE FIGURE. What Regulation and Layers used to paint
   on it. Tool information, the same kind the hint carries, so it sits
   on the well between the canvas and the hint, in markup and in the
   rail's own type: the quiet 11 pixel label over a 12.5 pixel name in
   its colour. Nothing is rendered when both switches are off, so the
   default figure keeps every pixel it had.
   ============================================================ */
function coneKey(){
 /* Regulation draws on the spine, and the view from above has no spine, so
    its switch is only offered on the side view and its rows only print
    there. A key row for arrows nobody can see is a dead control's caption. */
 var reg=CONE.reg&&CONE.side;
 /* the Registers draw no rings, so Layers is not offered there and its rows
    do not print; the seat buttons take the key instead */
 var shl=CONE.shells&&!CONE.side&&!CONE.top, lay=CONE.layers&&!shl;
 if(shl)return '<div class="cone-key">'+rgsSeatsHtml()+'</div>';
 if(!reg&&!lay)return '';
 var grp=function(h,rows){
  return '<div class="ck-g"><span class="ck-h">'+h+'</span>'
   +'<span class="ck-rows">'+rows+'</span></div>';};
 var h='';
 if(reg){
  var rg=coneRegLaws();
  var row=function(l,col,dir){
   return '<span class="ck-r" style="--ax:'+col+'">'
    +'<svg class="cn-gl" viewBox="0 0 24 24" aria-hidden="true"><path d="'
    +(dir>0?'M12 20V4M7 9l5-5 5 5':'M12 4v16M7 15l5 5 5-5')
    +'" fill="none" stroke="currentColor" stroke-width="1.7" '
    +'stroke-linecap="round" stroke-linejoin="round"/></svg>'
    +esc(l.nm)+' <span class="ck-v">'+l.v.toFixed(1)+' of 10</span></span>';};
  h+=grp('Lifting you',rg.up.map(function(l){
    return row(l,seatCol(PAL[l.b]?l.b:'Heart'),1);}).join(''));
  h+=grp('Pulling you down',rg.dn.map(function(l){
    return row(l,seatCol('Root'),-1);}).join(''));}
 if(lay){
  var lrow=function(list,col){
   return list.map(function(nm){
    return '<span class="ck-r" style="--ax:'+col+'">'+esc(nm)+'</span>';}).join('');};
  h+=grp('Released, from the waist up',lrow(CONE_HI,rgbcss(GOLDC())));
  h+=grp('Compressed, from the waist down',lrow(CONE_LO,seatCol('Root')));}
 return '<div class="cone-key">'+h+'</div>';}
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
 coneFit();
 var b=c.getBoundingClientRect();
 /* A PIXEL BUDGET, NOT ONLY A DENSITY CAP. The canvas now fills the stage,
    which at 1600 by 1000 is twice the area it had, and at twice the density
    that is 3.8 million pixels a frame. Measured on a software raster, the
    floor this product has to hold on a machine with no GPU: 11 ms a frame
    against the old figure's 8.5, over the 8 ms this surface may spend. The
    backing store is held to 2.4 million pixels, a quarter over what the old
    430 pixel canvas used at twice the density, so a large canvas steps down
    to about 1.6x and a phone keeps its full 2x. Lines stay sharp at 1.6. */
 /* AND THE BUDGET STEPS DOWN AS THE FIGURE COMES CLOSER, round KQ. Zoomed,
    the glass faces, the limbo drum's gradient and the over and under bands
    each cover most of the canvas instead of a third of it, and on a software
    raster fill cost is pixels covered: measured at 1600 by 1000 at twice the
    density, the needle went from 9.0 ms whole to 16.4 at two and a half
    times, and the drum's gradient alone was 4.3 of that. So past 1.4 times
    the store holds seven tenths of the pixels and past 2.2 half of them. The
    lines are drawn from geometry, so they keep their width at any zoom; what
    softens is the edge, and only on a canvas that was already stepped down.
    A phone's canvas is small enough that it never reaches the cap. */
 CONE.zb=coneZBud();
 /* THE REGISTERS DO NOT STEP DOWN WITH THE ZOOM. The step exists because
    the needle's big translucent fills cover more pixels as the figure comes
    closer. The Registers make one canvas call a frame, a put of the box the
    points touched, and that box can grow only to the canvas itself, which
    the budget already allows for. So a closer look is not softened. */
 var bud=(CONE.shells&&!CONE.side&&!CONE.top)?RGS_PIX:2.4e6*CONE.zb;
 CONE.dpr=Math.min(devicePixelRatio||1,2,
  Math.max(1,Math.sqrt(bud/Math.max(1,b.width*b.height))));
 c.width=Math.max(1,b.width*CONE.dpr); c.height=Math.max(1,b.height*CONE.dpr);}
/* WHICH AXIS IS NEAREST THE VIEWER. The meridians sit at even eighths of a
   turn from the spin, so the front one is whichever eighth the spin has
   reached. It is read rather than tracked, so it cannot fall out of step with
   what is drawn. */
/* WHERE THE NEEDLE TURNS AN AXIS TO. Straight at the viewer an axis projects
   onto the spine, so the lit rib, its two badges and the reading marker all
   stood on one vertical line in the middle of the figure. The needle brings
   an axis round to the front and a little left of the spine instead, where
   it is nearest and still its own line. The arrow figure keeps dead front. */
const NDL_AIM=0.5;
function coneAimOff(){return (!CONE.side&&!CONE.top)?NDL_AIM:0;}
function coneFront(){
 /* the projection puts a meridian nearest the viewer when sin of its angle is
    one, so axis i is at the front when i eighths plus the spin reach a
    quarter turn. Read off the same arithmetic conePtA uses, not a second
    convention that could drift from it. */
 var per=Math.PI*2/8;
 var i=Math.round((Math.PI/2+coneAimOff()-CONE.spin)/per)%8; if(i<0)i+=8;
 return i;}
/* THE SPIN A NAME IS ASKING FOR. Turning axis i to the front means the spin
   has to reach minus i eighths, and it has to get there the short way round
   or a hover on the neighbour sends the figure most of a turn backwards. */
function coneAimAt(i){
 var per=Math.PI*2/8, want=Math.PI/2+coneAimOff()-i*per, turn=Math.PI*2;
 var d=((want-CONE.spin)%turn+turn)%turn;
 if(d>Math.PI)d-=turn;
 CONE.spinTo=CONE.spin+d;}
function coneTick(){
 if(!CONE.open)return;
 /* EASED, NEVER SNAPPED. Ruled. Twelve per cent of the remaining distance a
    frame settles inside about a third of a second, which is quick, and it
    arrives rather than stopping. The target is released once it is close
    enough to see, and the idle drift takes over again. */
 /* THE REGISTERS DO NOT TURN TO AN AXIS. A shell is a whole seat, so there
    is no meridian to bring round, and a name in the rail lights its seat's
    shell instead (coneRegisters). No idle drift either: the figure sways
    about its cut in its own draw, and a drift would carry the cut away. */
 var shl=CONE.shells&&!CONE.side&&!CONE.top;
 if(shl)CONE.spinTo=null;
 if(CONE.spinTo!==null&&!CONE.drag){
  var gap=CONE.spinTo-CONE.spin;
  if(Math.abs(gap)<0.004){CONE.spin=CONE.spinTo; CONE.spinTo=null;}
  else CONE.spin+=gap*0.12;}
 else if(!REDUCED&&!CONE.drag&&!shl)CONE.spin+=0.0022;
 /* from above nothing turns to the front, so the lit row is the axis a
    pointer is on, or none. Lighting the row the idle spin reached would
    walk the rail round on its own with nothing on the figure moving. The
    Registers turn nothing to the front either. */
 {var f=(CONE.top||shl)&&!CONE.side?CONE.hov:coneFront();
  if(f!==CONE.front){CONE.front=f; coneNamesSync();}}
 /* the figure had a spin and no clock. Anything that has to breathe rather
    than turn needs its own time, and the band of souls at the median does. */
 if(!REDUCED)CONE.t+=1/60;
 if(!CONE.side)coneMirStep(1/60);
 if(!CONE.drag&&!CONE.pinch)coneZoomStep();
 coneDraw();
 /* the needle's hover name, kept current as the figure turns under a still
    pointer, which is the only way a spinning figure's tooltip stays true.
    Written only when it changes: a title set sixty times a second is a
    style recalculation sixty times a second. */
 if(!CONE.side&&!CONE.top&&CONE.ptr&&CONE.cv){
  var tip=shl?rgsTipAt(CONE.ptr.x,CONE.ptr.y):ndlTipAt(CONE.ptr.x,CONE.ptr.y);
  if(tip!==CONE.tip){CONE.tip=tip; CONE.cv.title=tip;}}
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
 /* HS SWEEP. The empty state takes the one canonical wording, and the two
    sentences on how to handle the figure are gone from both empty states:
    "Drag to turn it. Press any name to read that axis." The figure turns under
    a drag and the names are buttons, and he has asked, more than once, that a
    section never explain how to use itself. */
 if(r.unread)return '<p class="cone-p">Nothing has been read yet. '
  +'Write a story or set a charge.</p>';
 /* and while CQ is still filling there is no position to name. CQ 0 with
    no law answered read "below the oscillating band" to somebody who had
    only not done the intake. */
 if(!r.complete)return '<p class="cone-p">Coherence is still filling, with <b>'
  +esc(tierSay(r))+'</b>. Your position on this figure settles once all '
  +SI.length+' are in.</p>';
 var cq=Math.round(r.CQ);
 var band=cq>=60?'above the oscillating band':cq<=40?'below the oscillating band'
  :'inside the oscillating band, where most people stand';
 var rising=r.Ig>=5;
 /* EVERY NUMBER SAYS WHAT IT IS OUT OF. His instruction, and this line broke
    it twice: "you read 88" and "integrity 9.3" with nothing to measure either
    against. Coherence runs nought to a hundred and integrity runs nought to
    ten, which are two different scales printed side by side in one sentence,
    so a reader with no scale is not being vague at, they are being misled. */
 /* AND THE SAME SCRUB HERE. This printed coherence twice in two sentences,
    once as "you read 29 out of 100" and again as "coherence 29 of 100", which
    is the shape he objected to and a repetition on top of it. The band already
    says where the number sits, so the number is said once and the sentence
    carries the meaning rather than the arithmetic. */
 return '<p class="cone-p">You read <b>'+cq+'</b>, '+band+'.</p>'
  +'<p class="cone-p">Your integrity is <b>'+r.Ig.toFixed(1)+'</b> against a '
  +'clean ten.</p>'
  +'<p class="cone-p">Integrity is the hull. A hole in it means the ship takes '
  +'on water, and everything above the waterline stops mattering. Integrity '
  +'raises coherence, coherence raises what you can hold to, and that raises '
  +'integrity again. The loop turns both ways. Yours is currently turning '
  +'<b>'+(rising?'up':'down')+'</b>.</p>'
  /* "You are floating the ship out of the water so that it can float" came
     off the end: a ship floats in water, so the sentence cannot be pictured,
     and the hull line above already carries the metaphor whole. */
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
  /* SENTENCE CASE IN THE SOURCE. The sheet capitalises this class, so title
     case typed in as well is a second copy of a rule in the one place it can
     disagree with the first. Every other label in the product is written in
     sentence case for that reason. */
  +'<div class="cn-gh"><span class="pm-eye">Coherence over time</span>'
  +'<div class="cn-spans">'
  +SPANS.map(function(sp){
    return '<button type="button" class="cn-sb'+(sp.k===CONE.span?' on':'')+'" '
     +'data-cnspan="'+sp.k+'" aria-pressed="'+(sp.k===CONE.span)+'">'
     +esc(sp.nm)+'</button>';}).join('')
  +'</div></div>';
 if(sr.state==='none'){
  /* HS sweep: "Every save writes a point, so this fills in as you go"
     explained how the chart fills, which the chart does. */
  h+='<p class="cn-gp">Nothing on the record for this span.</p>';}
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
   /* the inverted pole is the seat token at an opacity, which is the brand's
      darker version of a token over the ground. coneDull's grey mix was a new
      colour per seat, named off brand in round HS. seatCol can hand back a
      custom property for a seat it does not know, which has no channels to
      take an opacity from, so that one case keeps the token whole. */
   var c=seatCol(x.m.seat), cd=/^#[0-9a-f]{6}$/i.test(c)?rgba(hx(c),.72):c;
   return '<button type="button" class="cn-nr" data-cnax="'+x.i+'" '
    +'style="--ax:'+c+';--axd:'+cd+'" '
    +'title="'+((CONE.top||CONE.shells)&&!CONE.side?'Read ':'Turn the figure to ')
    +esc(x.m.up)+', opposite '+esc(x.m.dn)+'">'
    /* EVERY NAME CARRIES ITS SYMBOL AND ITS OPPOSITE'S. Round JQ: "all the
       character names that pop up, I need their iconic symbol and their
       opposing nature's opposing character symbol." These are the names that
       light up as the figure turns, and each carried a 13 pixel glyph beside
       it at a resting opacity of .55, which is why he never saw them. Now
       each row leads with its pair as the figure draws it, a small needle:
       the coherent pole's badge above, the inversion's broken ring below, a
       gap of limbo between. Sized and inline so the row and the figure are
       visibly the same object. */
    +'<span style="display:flex;align-items:center;gap:9px;'
     +(side==='r'?'flex-direction:row-reverse;':'')+'">'
    +cnPair(x.m)
    +'<span style="display:flex;flex-direction:column;gap:1px;min-width:0;align-items:'
     +(side==='r'?'flex-end':'flex-start')+'">'
    +'<span class="cn-nq">'+esc(x.m.q)+'</span>'
    +'<span class="cn-nu">'+esc(x.m.up)+'</span>'
    +'<span class="cn-nd">'+esc(x.m.dn)+'</span>'
    +'</span></span>'
    +'</button>';}).join('')
  +'</div>';}
/* one rgb triple as a css colour, so a canvas colour can be handed to the
   sheet the same way a seat colour is */
function rgbcss(c){return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}
/* ONE AXIS AS A PAIR: its coherent pole's badge over its inversion's, with a
   gap between, which is the figure in miniature. Ring, never fill; the
   inversion's ring is broken and at the row's darker token, as on the
   figure. Styled on the element, so the pair needs nothing new in the sheet. */
function cnPair(m){
 var g=function(d,y,col){
  return '<path d="'+d+'" transform="translate(4.4 '+(y-7.6)+') scale(.633)" fill="none" '
   +'style="stroke:'+col+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';};
 return '<svg viewBox="0 0 24 56" width="24" height="56" aria-hidden="true" '
  +'style="flex:0 0 24px;display:block;overflow:visible">'
  +'<circle cx="12" cy="12" r="11" style="fill:none;stroke:var(--ax)" stroke-width="1.5"/>'
  +g(m.ic,12,'var(--ax)')
  +'<path d="M12 25.5v5" style="stroke:var(--axd)" stroke-width="1.2" stroke-dasharray="1.4 1.8"/>'
  +'<circle cx="12" cy="44" r="11" style="fill:none;stroke:var(--axd)" stroke-width="1.4" '
  +'stroke-dasharray="2.4 2.2"/>'
  +g(m.dic,44,'var(--axd)')
  +'</svg>';}
/* WHICH ROW IS LIT, updated from the tick rather than from a repaint. Redrawing
   the rail every frame would rebuild sixteen buttons sixty times a second and
   throw away the hover the person is currently on. */
function coneNamesSync(){
 var rows=document.querySelectorAll('[data-cnax]');
 for(var i=0;i<rows.length;i++)
  rows[i].classList.toggle('front',+rows[i].getAttribute('data-cnax')===CONE.front);}
function coneOpen(inTab){
 var h=document.getElementById('cone'); if(!h)return;
 /* the needle assembles once, when the surface is opened, and not on every
    press of a switch, which also comes through here */
 if(!CONE.open){CONE.t0=(typeof performance!=='undefined'?performance.now():Date.now());
  /* and it opens whole: a zoom is kept across a switch press, which comes
     through here too, and not across leaving the surface and coming back */
  CONE.z=CONE.zT=1; CONE.zx=CONE.zxT=0; CONE.zy=CONE.zyT=0; CONE.ptrs=null; CONE.pinch=null;}
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
   /* THE CANVAS AND ITS ZOOM, held together so the zoom sits on the figure's
      own lower right at a desk and follows it on a phone, whatever the rails
      and the key do around them. */
   +'<div class="cn-cvw">'
   +'<canvas id="conecv" class="cone-cv" role="img" '
   +'aria-label="'+(CONE.side
     ?'Two cones meeting at the median. Eight axes, each with a coherent pole above and its inversion below.'
     :CONE.top
     ?'The compass from the top. Seven seats bent around your coherence, and eight axes, each with its coherent pole at the rim and its inversion at the centre.'
     :CONE.shells
     ?'The registers. Seven shells of light, one per seat, Root on the outside and Crown at the centre. Each address is a patch on its seat\'s shell, and where it holds charge the patch falls in and goes dark. The light at the centre is your coherence.'
     :'The compass. Two pyramids: one points up to coherent, one points down to decoherent, and the oscillating range sits in the gap between them. Each of the eight axes has its teacher near the top point and the opposite figure near the bottom one. The five paths sit at the top point and their opposites at the bottom one. Your coherence cuts through the figure as a level.'
      +(CONE.heat?' Radiance lights the whole figure, and it goes dark where a seat holds charge and where the field bends off your level.':''))
   +'"></canvas>'
   /* ZOOM, round KQ: "the icon's already there. I want to be able to zoom
      in." It is: the Field's three circles in its lower right, zoom out,
      zoom in and reframe, built by fbOrb in ui/fieldbar.js out of the same
      three marks. They are reused here rather than drawn again, so zoom is
      one control with one look everywhere it appears, and the reframe
      circle's ring and pill carry how far in, as they do on the Field. The
      arrow figure behind CONE.side has no zoom and gets no circles, because
      a control that changes nothing is a dead control. */
   +(CONE.side?'':'<div class="cn-zoom" id="cnzoom" role="group" aria-label="Zoom"></div>')
   +'</div>'
   /* Flat and Regulation belong to the side view: from above there is no
      tilt to take out and no spine to draw arrows on, and a switch that
      changes nothing on the figure is a dead control. */
   /* THE NEEDLE IS THE DEFAULT, AND FROM ABOVE IS ONE SWITCH. Round JQ. The
      old Side view switch went with it: the needle is the side view, rebuilt
      as the two pyramids he asked for, so a second side view would be the
      same figure drawn twice. The turned arrow figure is still in this file
      behind CONE.side, which the collide gate drives directly. */
   +'<div class="cone-ctl">'
    /* TOP, round KQ, his words: "with the compass layers, change from above
       to top." One word, as every other switch in this row is. */
    +(CONE.side?'':'<button type="button" class="cn-b" data-cn="top" '
     +'title="Look straight down on the same eight axes">Top</button>')
    /* REGISTERS, round KS. One word, his own from round KR, "the colored
       registers would show collapse geometrically", and already the
       product's word for it: the coherence reading says "It is harmonic, so
       patterns sit at registers rather than anywhere." */
    +(CONE.side?'':'<button type="button" class="cn-b" data-cn="shells" '
     +'title="Draw the seven seats as shells of light, one inside the other, each sized by its own tone. An address holding charge falls in and goes dark.">Registers</button>')
    +(CONE.side
     ?'<button type="button" class="cn-b" data-cn="flat" '
      +'title="Take the tilt out and look straight down on the figure">Flat</button>'
      +'<button type="button" class="cn-b" data-cn="reg" '
      +'title="Show the three laws lifting you most and the three pulling you down most">Regulation</button>'
     :'')
    /* ROUND KI'S MOCKUP SWITCH. Two ways to draw gravity, one press apart,
       so he chooses by looking: off is the pulse, on is the well. */
    +(CONE.side||CONE.top||CONE.shells?'':'<button type="button" class="cn-b" data-cn="well" '
     +'title="Draw the heaviest charge as a gravity well that bends the figure, in place of the pulse">Gravity well</button>')
    /* RADIANCE, round KR. Only on the needle, which is the only figure that
       draws it: from the top there is no volume to fill, and the switch
       would be a dead control there. What the heat means rides on the
       hover and not in a key under the figure, because a legend nobody
       asked for is one of his logged objections. Whether it earns a key is
       his call. */
    +(CONE.side||CONE.top||CONE.shells?'':'<button type="button" class="cn-b" data-cn="heat" '
     +'title="Light the whole figure by its radiance. It goes dark where a seat holds charge and where the field bends off your level.">Radiance</button>')
    /* the Registers draw no rings, so Layers would be a dead control there */
    +(CONE.shells&&!CONE.side&&!CONE.top?'':'<button type="button" class="cn-b" data-cn="layers" '
     +'title="Show the rings the axes are stacked on">Layers</button>')
   +'</div>'
   /* THE TOOL SAYS WHAT IT IS, UNDER THE FIGURE. Ruled: the bottom
      information goes right unless it is about the tool. These two lines are
      about the tool, so they may stay under it. The reading does not, and
      does not. */
   /* PLAIN WORDS, OR NOTHING. Ruled: "there is some weird text that says the
      waist is 40 to 60 out of 100. I told you never to write text like that
      any more. If you cannot use regular words to describe it, do not describe
      it. And 40 to 60 out of 100 does not give a lot of specific detail."

      He is right and the sentence was defending itself with a scale instead of
      saying a thing. What it was trying to convey is that the narrow middle of
      the figure is where most people sit, and that is one clause in English.
      The numbers went and nothing was lost, because a person looking at a
      waisted figure can see where the waist is. */
   +coneKey()
   /* AND THEN THE CLAUSE ITSELF WENT, round HS. "The narrow middle is where
      most people sit. Drag to turn the figure. Press any name to read that
      axis." was the figure explaining itself under the figure, the class of
      text he has now asked three times never to see. The waist is visible,
      the drag works without being announced, and every name is a button.
      Round IA: the tab opens on the view from above now, where a drag turns
      nothing, so that clause would have become false as well as surplus. */
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
 /* a fresh canvas has none of the needle's background light and may sit on
    a new lighting's well, so both are read again on its first frame */
 NDL.glowSig=''; NDL.wellSig=''; CONE.tip=''; RGS.glowSig=''; RGS.hs=-1;
 /* the zoom circles, the Field's own: same marks, same glass, same words */
 var hz=document.getElementById('cnzoom');
 if(hz&&typeof fbOrb==='function'){
  var zg=document.createElement('div'); zg.className='fb-grp';
  [['zout','Zoom out',FB_IC.zout,'Move out. Or press minus.',function(){coneZoomBy(1/1.25);}],
   ['zin','Zoom in',FB_IC.zin,'Move in. Or press plus. Scrolling on the figure does the same, and zoomed in, a drag moves it.',function(){coneZoomBy(1.25);}],
   ['zfit','Reframe',FB_IC.zfit,'Back to the whole figure. Or press F.',function(){coneReframe();}]].forEach(function(z){
   var b=fbOrb({k:z[0],nm:z[1],ic:z[2],tip:z[3],val:z[0]==='zfit'});
   b.addEventListener('click',function(e){e.stopPropagation();z[4]();});
   zg.appendChild(b);});
  hz.appendChild(zg);}
 coneZoomPaint();
 /* ONE FRAME LOOP, NOT ONE PER PRESS. Every switch repaints through here, and
    this called coneTick with the last frame it scheduled still pending, so
    each press started a second loop beside the first: the idle spin ran
    twice as fast after one press and three times after two. The springs of
    the view from above step per frame, so they would have arrived early too. */
 if(CONE.raf)cancelAnimationFrame(CONE.raf);
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
  b.onclick=function(){CONE[k]=!CONE[k];
   /* Top and Registers are two views of one canvas, never both. The cut
      is set to face the viewer on the way in. */
   if(k==='top'&&CONE.top)CONE.shells=false;
   if(k==='shells'&&CONE.shells){CONE.top=false; RGS.s0=CONE.spin;}
   coneOpen(CONE.tab);};});
 /* A SEAT'S BUTTON TURNS ITS SHELL ON AND OFF, and does not rebuild the
    card: the draw reads RGS.on every frame, so only the button changes.
    Hovering one brings its shell forward, as a name in the rail does. */
 h.querySelectorAll('[data-cnseat]').forEach(function(b){
  var si=+b.getAttribute('data-cnseat');
  rgsSeatSync(b);
  b.onclick=function(){RGS.on[si]=RGS.on[si]?0:1; rgsSeatSync(b); coneDraw();};
  b.onmouseenter=b.onfocus=function(){RGS.hs=si;};
  b.onmouseleave=b.onblur=function(){RGS.hs=-1;};});
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
  /* hov is what lights the row and the node from above, where aiming turns
     nothing */
  b.onmouseenter=function(){coneAimAt(i); CONE.hov=i;};
  b.onfocus=function(){coneAimAt(i); CONE.hov=i;};
  b.onmouseleave=function(){CONE.spinTo=null; CONE.hov=-1;};
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
  CONE.cv.onpointerdown=function(e){
   /* TWO FINGERS PINCH. Every pointer down is kept by id; the second one
      turns the gesture into a zoom about the point between them, and the
      drag it interrupted is dropped so the figure does not also turn. */
   var P2=CONE.ptrs||(CONE.ptrs={}); P2[e.pointerId]={x:e.clientX,y:e.clientY};
   var ids=Object.keys(P2);
   if(ids.length>=2){var a=P2[ids[0]], c2=P2[ids[1]];
    CONE.pinch={d:Math.max(8,Math.hypot(a.x-c2.x,a.y-c2.y)),z:CONE.zT};
    if(CONE.drag)CONE.drag.moved=true;
    try{CONE.cv.setPointerCapture(e.pointerId);}catch(err){}
    return;}
   CONE.drag={x:e.clientX,y:e.clientY,
   s:CONE.spin,t:CONE.tilt,n:CONE.nt,moved:false,zx:CONE.zxT,zy:CONE.zyT};
   /* a pointer that has already been released cannot be captured, and the
      throw would take the handler down with it. The wheel learned this. */
   try{CONE.cv.setPointerCapture(e.pointerId);}catch(err){}};
  /* what is under the pointer, so a pole lights before it is pressed */
  CONE.cv.onpointermove=function(e){
   var b=CONE.cv.getBoundingClientRect();
   var x=e.clientX-b.left, y=e.clientY-b.top;
   CONE.ptr={x:x,y:y};
   if(CONE.ptrs&&CONE.ptrs[e.pointerId]){CONE.ptrs[e.pointerId].x=e.clientX; CONE.ptrs[e.pointerId].y=e.clientY;}
   if(CONE.pinch&&CONE.ptrs){var ids=Object.keys(CONE.ptrs);
    if(ids.length>=2){var a=CONE.ptrs[ids[0]], c2=CONE.ptrs[ids[1]];
     var d=Math.hypot(a.x-c2.x,a.y-c2.y);
     /* snapped, not eased: a pinch is a hand on the figure, and a figure
        that lags the fingers reads as slipping */
     coneZoomAt(CONE.pinch.z*d/CONE.pinch.d,(a.x+c2.x)/2-b.left,(a.y+c2.y)/2-b.top);
     CONE.z=CONE.zT; CONE.zx=CONE.zxT; CONE.zy=CONE.zyT;}
    return;}
   if(!CONE.drag){
    var h=coneHit(x,y);
    /* from above a drag turns nothing, so the hand only says press, unless
       it is zoomed in, where a drag moves the figure */
    var still=CONE.top&&!CONE.side&&CONE.zT<=1.001;
    CONE.cv.style.cursor=h?'pointer':(still?'default':'grab');
    if(still)CONE.hov=h?h.i:-1;
    if(h!==CONE.hover){CONE.hover=h;coneDraw();}
    return;}
   CONE.drag.moved=CONE.drag.moved
    ||Math.hypot(e.clientX-CONE.drag.x,e.clientY-CONE.drag.y)>4;
   /* ZOOMED IN, A DRAG MOVES THE FIGURE, as it does on the Field's pictures,
      which is what a person reaching for the far side of what they zoomed
      into expects. Whole, it turns the figure, as it always has, and the
      names in the rail still turn it at any zoom. */
   if(CONE.zT>1.001&&!CONE.side){var wh=coneWH();
    CONE.zxT=CONE.drag.zx+(e.clientX-CONE.drag.x); CONE.zyT=CONE.drag.zy+(e.clientY-CONE.drag.y);
    coneZClamp(wh[0],wh[1]); CONE.zx=CONE.zxT; CONE.zy=CONE.zyT;
    coneDraw(); return;}
   CONE.spin=CONE.drag.s+(e.clientX-CONE.drag.x)*0.008;
   /* the vertical never tilts past the point where up stops reading as up.
      The needle keeps its own, and a shallower limit: past about 0.75 its
      two pyramids read as two plates rather than two points. */
   if(!CONE.side&&!CONE.top)
    CONE.nt=clamp(CONE.drag.n+(e.clientY-CONE.drag.y)*0.003,0.04,0.75);
   else CONE.tilt=clamp(CONE.drag.t+(e.clientY-CONE.drag.y)*0.004,0.08,0.92);
   coneDraw();};
  CONE.cv.onpointerup=function(e){
   if(coneUnptr(e))return;
   var was=CONE.drag; CONE.drag=null;
   if(was&&!was.moved){
    var b=CONE.cv.getBoundingClientRect();
    var h=coneHit(e.clientX-b.left,e.clientY-b.top);
    if(h&&h.path!=null){if(typeof runPathDrill==='function')runPathDrill(NDL_PATHS[h.path].p);}
    else if(h)runTeacherDrill(h.m,h.end);}};
  CONE.cv.onpointercancel=function(e){coneUnptr(e); CONE.drag=null;};
  CONE.cv.onpointerleave=function(){if(!CONE.side)CONE.hov=-1; CONE.ptr=null;};
  /* THE SCROLL WHEEL ZOOMS ABOUT THE POINTER, the Field's gesture. Only on
     the needle and the top view, which are the two that zoom. */
  CONE.cv.onwheel=function(e){if(CONE.side)return; e.preventDefault();
   var b=CONE.cv.getBoundingClientRect();
   coneZoomAt(CONE.zT*(e.deltaY<0?1.12:1/1.12),e.clientX-b.left,e.clientY-b.top);};
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
  /* the space before the comma was on the screen: "14 days , last run". */
  +'<span class="ld-u">'+(s.run===1?'day':'days')+(s.live?' running':', last run')+'</span>'
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
 /* A FIGURE'S LABEL IS ONE WORD, and the unit rides on the figure. Ruled, by
    name: "instead of 85 days kept, just one word. Recurring, missed, active,
    streak." Five rows here carried a phrase each and one of them carried a
    clause, "Minutes planned, not yet done", which is a sentence wearing a
    label's clothes. The denominator rule that produced them still holds: it
    is satisfied on the figure, where the unit belongs, rather than in a
    second line of prose under it.

    AND THE LAST ROW WAS WRONG ABOUT WHAT IT COUNTS. ledgerRead walks CHILD,
    which is the nine axes, so clear is a count of axes and the row printed it
    as addresses. A label that names the wrong unit is not a style defect. */
 var LG=[['Practised',l.minutes+(l.minutes===1?' minute':' minutes')]];
 if(l.planned>l.minutes)LG.push(['Planned',
  (l.planned-l.minutes)+((l.planned-l.minutes)===1?' minute':' minutes')]);
 LG=LG.concat([['Saved',l.rituals+(l.rituals===1?' ritual':' rituals')],
  ['Opened',l.ground+(l.ground===1?' address':' addresses')],
  ['Installed',l.clear+(l.clear===1?' axis':' axes')]]);
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
