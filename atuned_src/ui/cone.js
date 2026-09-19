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
var CONE={open:false, tab:false, spin:0.6, tilt:0.60, drag:null, raf:null, t:0, cv:null, g:null, dpr:1, hits:[]};
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
  y:cy-y*Math.cos(CONE.tilt)+z3*Math.sin(CONE.tilt),
  d:z3*Math.cos(CONE.tilt)+y*Math.sin(CONE.tilt)};}
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
  g.beginPath(); g.moveTo(W/2,cy-hgt*Math.cos(CONE.tilt));
  g.lineTo(W/2,cy+hgt*Math.cos(CONE.tilt));
  g.strokeStyle=rgba(ink,.16); g.lineWidth=1; g.stroke();
  coneTxt(g,'Source',W/2,cy-hgt*Math.cos(CONE.tilt)-26,13,gc,.9,600);
  coneTxt(g,'The blueprint',W/2,cy+hgt*Math.cos(CONE.tilt)+30,13,rc,.85,600);
  /* the waist says what it is, because the median range is the part of this
     figure a person is most likely to be standing in */
  var wr=conePtA(50,Math.PI/2,W,H);
  coneTxt(g,'the median range',W/2,wr.y+16,10.5,ink,.4,400);})();

 /* the reading itself, on the axis at its own height */
 if(cq!==null){
  var cyy=H/2, U2=Math.min(W,H)/2;
  var y=((cq-50)/50)*U2*CONE_H;
  var my=cyy-y*Math.cos(CONE.tilt);
  g.beginPath(); g.arc(W/2,my,7,0,Math.PI*2);
  g.fillStyle=rgba(cq>=50?gc:rc,.95); g.fill();
  coneTxt(g,String(Math.round(cq)),W/2+18,my+4,15,cq>=50?gc:rc,1,500);}}
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
 coneDraw();
 CONE.raf=requestAnimationFrame(coneTick);}
/* TWO WAYS IN, ONE FIGURE. As a modal it is what a drill opens, over the top
   of whatever a person was reading, and it closes back to that. As a tab it is
   a surface inside the stage with no backdrop and no close button, because
   closing a tab leaves a person looking at nothing. inTab is the only
   difference and it changes where the host sits, not what is drawn. */
function coneOpen(inTab){
 var h=document.getElementById('cone'); if(!h)return;
 CONE.open=true; CONE.tab=!!inTab;
 h.classList.toggle('tabmode',!!inTab);
 h.style.display='flex';
 h.innerHTML='<div class="cone-card">'
  +'<div class="cone-hd"><span class="pm-eye">The compass</span>'
  +(inTab?'':'<button class="btn" id="conex">Close</button>')+'</div>'
  +'<canvas id="conecv" class="cone-cv" role="img" '
  +'aria-label="Two cones meeting at the median. Eight axes, each with a coherent pole above and its inversion below."></canvas>'
  +'<p class="cone-p">Eight qualities. Each one runs clean at the crown and inverted at '
  +'the floor, and the same behaviour sits at both ends. The figure is widest where a '
  +'behaviour has travelled furthest from the quality it started as, and it closes to a '
  +'point at each end, because Source and the blueprint are single places. The waist is '
  +'the median range. Drag to turn it. Click any name to read that axis.</p></div>';
 CONE.cv=document.getElementById('conecv');
 CONE.g=CONE.cv?CONE.cv.getContext('2d'):null;
 coneLayout(); coneTick();
 var x=document.getElementById('conex'); if(x)x.onclick=coneClose;
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
