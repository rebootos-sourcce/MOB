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
 span:'quarter'};
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
const CONE_H=0.55;
const CONE_FLARE=0.52;    /* how fast it widens away from the waist */
/* THE WAIST IS A NECK, NOT A POINT. Two true cones meet at a point and the
   figure pinches to nothing exactly where the median range lives, which is
   the one part of the scale a person is most likely to be in. A minimum
   radius makes it a neck, the median reads as a band with width, and the
   rings read as ellipses instead of collapsing to a line. */
const CONE_NECK=0.14;
/* THE THREE POLE GLYPHS, on the 24 unit grid every icon in this product uses.
   Ring, not fill, like the rest. A halo is a ring with nothing in it. Ego
   compression is a ring with two arrows pressing on it. The pitchfork is a
   pitchfork. */
const GL_HALO='M4 12 A8 3.4 0 1 0 20 12 A8 3.4 0 1 0 4 12';
const GL_COMPRESS='M12 5.5 A5 5 0 1 0 12 18.5 A5 5 0 1 0 12 5.5'
 +'M1.5 12H5M3.5 9.5L1.5 12l2 2.5M22.5 12H19M20.5 9.5l2 2.5l-2 2.5';
const GL_FORK='M12 21V9M6 9V3.5M12 9V3M18 9V3.5M5 9h14';

/* one point on the surface, by angle in radians rather than by meridian, so a
   ring can be sampled as finely as it needs to be to read as an ellipse. */
function conePtA(q,a,W,H){
 var cx=W/2, cy=H/2, U=Math.min(W,H)/2;
 var t=(clamp(q,0,100)-50)/50;                    /* -1 at the floor, 1 at the crown */
 var y=t*U*CONE_H;
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
 var at=Math.abs(t);
 var rad=U*(CONE_NECK*(1-at) + CONE_FLARE*Math.sin(at*Math.PI));
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
  return {m:m, i:i, pos:pos, p:conePt(pos,i,W,H), c:hx(seatCol(m.seat))};});
 if(!r.unread){
  g.beginPath();
  here.forEach(function(h,i){i?g.lineTo(h.p.x,h.p.y):g.moveTo(h.p.x,h.p.y);});
  g.closePath();
  g.fillStyle=rgba(gc,.10); g.fill();
  g.strokeStyle=rgba(gc,.55); g.lineWidth=1.4; g.stroke();}

 /* names and marks, back to front, so nothing near is hidden by something far */
 var byNear=here.slice().sort(function(a,b){return b.p.d-a.p.d;});
 byNear.forEach(function(h,i){h.rank=i;});
 here.slice().sort(function(a,b){return a.p.d-b.p.d;}).forEach(function(h){
  var near=(h.p.d>=0), a=near?1:.42;
  if(!r.unread){
   g.beginPath(); g.arc(h.p.x,h.p.y,near?5:3.6,0,Math.PI*2);
   g.fillStyle=rgba(h.c,a); g.fill();}
  /* the coherent pole above, the inverted pole below, on the same meridian */
  /* THE NAMES COME OFF THE POLES.

     Closing the figure at both ends made every meridian converge on one point,
     so eight teachers stacked on top of each other at the crown and eight
     inversions at the floor. Terminating the ends is right and putting names
     on a point is not.

     Each name now sits at the widest part of its own meridian, around four
     fifths of the way out, which is the one place on that meridian where it
     has room and where the figure is actually saying something: the widest
     point is the furthest a behaviour on that axis has travelled from the
     quality it started as. The poles keep Source and the blueprint, which are
     the two things that genuinely are single points. */
  var up=conePt(91,h.i,W,H), dn=conePt(9,h.i,W,H);
  /* FLAT MODE COLLAPSES THE MERIDIANS ONTO ONE LINE, so eight names land on
     top of each other at each end. With the tilt gone there is no depth to
     separate them, so they are separated by hand: each meridian steps its
     label away from the axis by its own index. The spinning version needs
     none of this because the projection does it. */
  if(CONE.flat){
   var step=(h.i-3.5)*15;
   up=({x:up.x,y:up.y-Math.abs(step)*0.9,d:up.d});
   dn=({x:dn.x,y:dn.y+Math.abs(step)*0.9,d:dn.d});}
  var hv=CONE.hover&&CONE.hover.m===h.m?CONE.hover.end:null;
  var uo=(up.x<W/2?-1:1), dof=(dn.x<W/2?-1:1);
  /* the name runs away from the figure, so it never starts on top of its own
     glyph. Centred text on a radial layout is what put them in the same
     place. */
  coneTxt(g,h.m.up,up.x+uo*22,up.y-4,near?12:10.5,gc,hv==='up'?1:(near?.95:.30),600,
   uo<0?'right':'left');
  coneTxt(g,h.m.dn,dn.x+dof*22,dn.y+6,near?12:10.5,rc,hv==='dn'?1:(near?.9:.28),600,
   dof<0?'right':'left');
  /* the glyph, on the figure side of the name, so the two read as one object.
     every named thing in this product carries a symbol and these were the
     last sixteen without one. */
  coneGlyph(g,h.m.ic, up.x+uo*10,up.y-5,gc,hv==='up'?1:(near?.88:.26));
  coneGlyph(g,h.m.dic,dn.x+dof*10,dn.y+6,rc,hv==='dn'?1:(near?.85:.24));
  /* AND THEY ARE TARGETS. Clicking a name did nothing at all: the whole
     figure had no hit testing, so eight teachers and eight inversions were
     drawn as though they were buttons and were not. */
  CONE.hits.push({x:up.x+uo*22,y:up.y-4,r:30,m:h.m,end:'up'});
  CONE.hits.push({x:dn.x+dof*22,y:dn.y+6,r:30,m:h.m,end:'dn'});
  /* the quality is named on the three nearest only. eight at once on a figure
     this size is a pile, and a pile is not a reading. */
  if(h.rank<3)coneTxt(g,h.m.q.toLowerCase(),h.p.x,h.p.y-12,10.5,h.c,.85,400);});

 /* the axis, and what sits at each end of it */
 (function(){
  var top=conePt(100,0,W,H), bot=conePt(0,0,W,H);
  var cy=H/2, U=Math.min(W,H)/2, hgt=U*CONE_H;
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
  var ty=cy-hgt*Math.cos(coneTilt()), by=cy+hgt*Math.cos(coneTilt());
  coneGlyph(g,GL_HALO,W/2,ty-48,gc,.9);
  coneTxt(g,'Source',W/2,ty-26,13,gc,.9,600);
  coneTxt(g,'The blueprint',W/2,by+30,13,rc,.85,600);
  /* the pair sits beside the word, not under it: under it is where the floor
     teachers already are and two glyphs landed on Asmodeus. */
  coneGlyph(g,GL_COMPRESS,W/2-104,by+30,rc,.85);
  coneGlyph(g,GL_FORK,W/2+104,by+30,rc,.85);

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
  var U3=Math.min(W,H)/2;
  var b40=conePtA(40,Math.PI/2,W,H), b60=conePtA(60,Math.PI/2,W,H);
  var byT=Math.min(b40.y,b60.y), byB=Math.max(b40.y,b60.y);
  /* A HARD RECTANGLE ACROSS THE CANVAS IS NOT A BAND ON A FIGURE.

     The first cut filled the full width at a flat alpha and the band read as
     a panel behind the drawing rather than a stretch of it. It fades at both
     edges and at both ends, so it belongs to the figure. */
  /* and it fades in every direction, not just up and down: a linear gradient
     down a rectangle still cuts hard at its left and right edges, and two
     vertical cuts across a round figure read as a panel behind it again. */
  g.save();
  var bcy=(byT+byB)/2, brx=U3*0.92, bry=Math.max(6,(byB-byT)/2);
  g.translate(W/2,bcy); g.scale(1,bry/brx);
  var bg=g.createRadialGradient(0,0,0,0,0,brx);
  bg.addColorStop(0,rgba(ink,.075)); bg.addColorStop(0.62,rgba(ink,.045));
  bg.addColorStop(1,rgba(ink,0));
  g.beginPath(); g.arc(0,0,brx,0,Math.PI*2);
  g.fillStyle=bg; g.fill();
  g.restore();
  /* and the souls read. At .17 they were under the grain of the ground. */
  for(var si=0;si<18;si++){
   var ph=si*2.399963, spd=0.20+((si*37)%11)/38;
   var sw=Math.sin(CONE.t*spd+ph);
   var sp2=conePtA(50+sw*9.2,ph+CONE.spin*0.4,W,H);
   g.beginPath(); g.arc(sp2.x,sp2.y,2.1,0,Math.PI*2);
   g.fillStyle=rgba(ink,.34+sw*0.14); g.fill();}
  coneTxt(g,'40 to 60 oscillating. most people stand here',
   W/2,byB+16,10.5,ink,.5,400);})();

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
  var cyR=H/2, UR=Math.min(W,H)/2, hR=UR*CONE_H;
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
  /* AND YOUR OWN MARKER OSCILLATES, IF THAT IS WHAT YOU ARE DOING.

     A person between forty and sixty is not sitting at a number, they are
     swinging through one, which is the whole meaning of the band they are
     standing in. Drawn as a fixed dot it read as a settled position and said
     the opposite of the truth.

     The swing is drawn, the number printed is the reading and not the
     wobble, and a marker outside the band holds still, because outside the
     band a person is not oscillating. */
  var osc=(cq>40&&cq<60)?Math.sin(CONE.t*0.55)*2.4:0;
  var y=((cq+osc-50)/50)*U2*CONE_H;
  var my=cyy-y*Math.cos(coneTilt());
  if(osc){
   g.beginPath(); g.arc(W/2,my,13,0,Math.PI*2);
   g.strokeStyle=rgba(cq>=50?gc:rc,.22); g.lineWidth=1; g.stroke();}
  g.beginPath(); g.arc(W/2,my,7,0,Math.PI*2);
  g.fillStyle=rgba(cq>=50?gc:rc,.95); g.fill();
  coneTxt(g,String(Math.round(cq)),W/2+20,my+4,15,cq>=50?gc:rc,1,500);}}
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
function coneTick(){
 if(!CONE.open)return;
 if(!REDUCED&&!CONE.drag)CONE.spin+=0.0022;
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
 return '<p class="cone-p">You read <b>'+cq+'</b>, '+band+'. '
  +'Integrity <b>'+r.Ig.toFixed(1)+'</b>, coherence <b>'+cq+'</b>.</p>'
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
   +'<p class="cone-hint">Drag to turn it. Click any name to read that axis.</p>'
  +'</div>'
  /* THE INFORMATION LAYER IS ON THE RIGHT. Ruled, and it is his standing rule
     for this product: the reading and the record went in a column under the
     figure on the left, which is a second information layer facing the one
     that already exists. */
  +'<div class="cone-info">'
   /* THE READING AT THE TOP, THE RECORD IN THE MIDDLE, THE GRAPH PINNED AT
      THE BOTTOM. He asked for the graph in the lower right and a column that
      simply stacks puts it below the fold, which is the same as not having it.
      The middle is the only part that scrolls. */
   +'<div class="cone-txt">'+coneRead()+'</div>'
   +'<div class="cone-mid">'+ladderHtml()+'</div>'
   +coneGraph()
  /* cone-info, cone-body, cone-card */
  +'</div></div></div>';
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
 /* the ledger. four counts of events, no denominators. */
 var LG=[['Minutes practised',l.minutes],['Rituals saved',l.rituals],
  ['Ground opened',l.ground+(l.ground===1?' address':' addresses')],
  ['Held at the far pole',l.clear+(l.clear===1?' address':' addresses')]];
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
