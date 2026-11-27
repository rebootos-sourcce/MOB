/* ============================================================
   FOUR MORE ARRIVALS. Prototype, round EV. Not part of the product build.

   His words: "I want to see four more versions of it. For each one, I want
   the style to be slightly different. I want the laws of animation obeyed.
   Twelfth principles. I want the center point. That's the soul itself to go
   from like collapse to expressed."

   ONE THROUGHLINE, FOUR MATERIALS. Every version starts with the centre in a
   collapsed state, closed, small, low and dim, and ends with it expressed:
   open, full size, lit, ringed, on the same geometry the Field draws. What
   changes is what the thing is made of:

     breath   soft light. One breath in, one breath out.
     orrery   engraved hairlines in real perspective. A globe that turns.
     bloom    flat solid planes, nothing outlined. A bud that opens.
     ember    particles of light. Thrown out and caught.

   HOW IT IS DRAWN, AND WHY. The first cut of ET's Frames and Dial arrival
   repainted about a thousand SVG marks a frame and ran at 9.7 frames a
   second. This never animates a DOM mark. Each version is one canvas, drawn
   as a pure function of time, so a frame is a clear and a few dozen paths
   and sprites. Whatever does not change shape during a reveal, the finished
   ring and its address marks, is drawn once to a bitmap and revealed with a
   clip, which is ET's own raster technique. Glows are sprites drawn once,
   never shadowBlur or a canvas filter, which Safari does not support.

   ONE CLOCK. The canvas reads the time off the sheet's own bootOut CSS
   animation, so the wordmark, the light behind, the exit and the picture
   are all on one timeline, and the prototype's speed and scrub controls,
   which set every animation on the sheet, drive the canvas too.

   THE SHEET STILL ENDS ITSELF. The last beat is the product's own bootOut
   fade at 5.00s, so panels.js's animationend removal and its 5450ms floor
   work on the first load exactly as they do in the build.

   CURVES are the product's own:
     OUT   .22,1,.36,1     arriving
     IN    .4,0,1,1        leaving
     LAND  .34,1.56,.64,1  landing, overshoot
     IO    .4,0,.2,1       in out
   and damped springs where two things must share a world.
   ============================================================ */
(function(){
'use strict';
var G=window.VX_G, TAU=Math.PI*2, HP=Math.PI/2, D2R=Math.PI/180;
var AC=[126,184,212], AU=[194,160,99], INK=[239,237,232], WHITE=[255,246,232];
/* the radii, in the 200 unit box ET draws in */
var R_SEAT=62, R_DOT=51, R_T0=68.5, T_LEN=13, R_CORE=24, R_HALO=88, R_LENS=19, GAP=.05;

/* ---------------- curves ---------------- */
function bez(x1,y1,x2,y2){
 function B(a,b,t){var u=1-t;return 3*u*u*t*a+3*u*t*t*b+t*t*t;}
 return function(x){if(x<=0)return 0;if(x>=1)return 1;var lo=0,hi=1;
  for(var i=0;i<22;i++){var m=(lo+hi)/2;if(B(x1,x2,m)<x)lo=m;else hi=m;}return B(y1,y2,(lo+hi)/2);};}
var OUT=bez(.22,1,.36,1), IN=bez(.4,0,1,1), LAND=bez(.34,1.56,.64,1), IO=bez(.4,0,.2,1);
function seg(t,a,d){return t<=a?0:t>=a+d?1:(t-a)/d;}
function lerp(a,b,u){return a+(b-a)*u;}
function c01(v){return v<0?0:v>1?1:v;}
/* a damped spring's step response, from 0 toward 1, u seconds after release */
function spring(u,w,z){if(u<=0)return 0;var wd=w*Math.sqrt(1-z*z);
 return 1-Math.exp(-z*w*u)*(Math.cos(wd*u)+z*w/wd*Math.sin(wd*u));}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);
 t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hex(h){return [1,3,5].map(function(k){return parseInt(h.slice(k,k+2),16);});}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';}
function mix(a,b,u){return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];}

/* ---------------- the loop, as frMount lays it ---------------- */
var N=G.N;
var SEATS=G.seats.map(function(q,i){var th0=q.s0/N*TAU,th1=(q.s0+q.n)/N*TAU;
 return {i:i,c:q.c,rgb:hex(q.c),th0:th0,th1:th1,tm:(th0+th1)/2,s0:q.s0,n:q.n,r:i===3?3.9:3.4};});
var ADDR=[];SEATS.forEach(function(q){for(var j=0;j<q.n;j++){var lobe=Math.sin(Math.PI*(j+.5)/q.n);
 ADDR.push({s:q.s0+j,q:q,th:(q.s0+j+.5)/N*TAU,rest:T_LEN*(.20+.22*lobe)});}});
function P(r,th){return [r*Math.sin(th),-r*Math.cos(th)];}
function arcP(g,r,a0,a1,ccw){g.arc(0,0,r,a0-HP,a1-HP,!!ccw);}
function circle(g,r){g.beginPath();g.arc(0,0,Math.max(0,r),0,TAU);}
function clipDisc(g,r){circle(g,r);g.clip();}
function clipRing(g,r0,r1){g.beginPath();g.arc(0,0,Math.max(0,r1),0,TAU);g.arc(0,0,Math.max(0,r0),0,TAU,true);g.clip();}
function clipWedge(g,a0,a1){g.beginPath();g.moveTo(0,0);g.arc(0,0,400,a0-HP,a1-HP);g.closePath();g.clip();}
function petal(g,r0,r1,a0,a1,tip){if(tip<=.001)return band(g,r0,r1,a0,a1);
 var L=.42*(r1-r0)*tip,n=18;g.beginPath();
 for(var i=0;i<=n;i++){var u=i/n,a=a0+(a1-a0)*u,r=r1-L*(1-Math.pow(Math.sin(Math.PI*u),.7)),p=P(r,a);
  if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);}
 arcP(g,Math.max(0,r0),a1,a0,true);g.closePath();}
function band(g,r0,r1,a0,a1){g.beginPath();arcP(g,r1,a0,a1);arcP(g,Math.max(0,r0),a1,a0,true);g.closePath();}

/* ============================================================
   RESOURCES. Drawn once per size, never per frame.
   ============================================================ */
function sprite(px,fn){var c=document.createElement('canvas');c.width=c.height=px;fn(c.getContext('2d'),px);return c;}
function glow(c){return sprite(96,function(g,px){var h=px/2,gr=g.createRadialGradient(h,h,0,h,h,h);
 gr.addColorStop(0,rgba(c,1));gr.addColorStop(.16,rgba(c,.6));gr.addColorStop(.42,rgba(c,.17));gr.addColorStop(1,rgba(c,0));
 g.fillStyle=gr;g.fillRect(0,0,px,px);});}
/* a plate: a picture in figure units, B units across, rasterised at the
   screen's own density so it is as sharp as a vector */
function plate(st,B,fn){var px=Math.max(8,Math.ceil(B*st.u));
 return sprite(px,function(g){g.setTransform(px/B,0,0,px/B,px/2,px/2);g.lineCap='round';fn(g);});}
function drawPlate(g,pl,B){g.drawImage(pl,-B/2,-B/2,B,B);}

function resources(st){
 var R={};
 R.glow=SEATS.map(function(q){return glow(q.rgb);});
 R.gAC=glow(AC);R.gW=glow(WHITE);R.gAU=glow(AU);
 /* THE PRISM, under the lens: the seven seats' colours on their own sectors,
    softened at the source by passes of falling width, the way ET's is
    blurred, but without a filter, so it looks the same in every engine */
 R.prism=plate(st,44,function(g){g.lineCap='butt';SEATS.forEach(function(q){
  [[17,.045],[13,.06],[10,.085],[7.5,.12],[5,.16]].forEach(function(p){
   g.strokeStyle=rgba(q.rgb,p[1]);g.lineWidth=p[0];g.beginPath();arcP(g,8.5,q.th0+.03,q.th1-.03);g.stroke();});});});
 /* the specular, one soft highlight high on the rim */
 R.spec=sprite(128,function(g,px){g.beginPath();g.arc(px/2,px/2,px/2,0,TAU);g.clip();
  var gr=g.createRadialGradient(px*.32,px*.14,0,px*.32,px*.14,px*.62);
  gr.addColorStop(0,'rgba(255,255,255,.2)');gr.addColorStop(.75,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,px,px);});
 /* ET's finished ring, crisp: seat arcs, and the addresses at their resting
    lengths. And a soft one for Breath, the same marks with light on them */
 R.arcs=plate(st,200,function(g){ringArcs(g,false);});
 R.ticks=plate(st,200,function(g){ringTicks(g,false,st);});
 R.softRing=plate(st,200,function(g){ringArcs(g,true);ringTicks(g,true,st);});
 /* Bloom's ticks, as solid blocks rather than lines */
 R.blocks=plate(st,200,function(g){ADDR.forEach(function(a){g.save();g.rotate(a.th);g.fillStyle=rgba(mix([0,0,0],a.q.rgb,.82),1);
   g.fillRect(-.9,-(R_T0+a.rest*1.2),1.8,a.rest*1.2);g.restore();});});
 return R;}
function ringArcs(g,soft){SEATS.forEach(function(q){var a0=q.th0+GAP,a1=q.th1-GAP;
 if(soft){[[12,.05],[7,.09]].forEach(function(p){g.strokeStyle=rgba(q.rgb,p[1]);g.lineWidth=p[0];g.beginPath();arcP(g,R_SEAT,a0,a1);g.stroke();});}
 g.strokeStyle=rgba(q.rgb,.9);g.lineWidth=3.2;g.beginPath();arcP(g,R_SEAT,a0,a1);g.stroke();});}
function ringTicks(g,soft,st){SEATS.forEach(function(q){
 var path=function(){g.beginPath();ADDR.forEach(function(a){if(a.q!==q)return;var p0=P(R_T0,a.th),p1=P(R_T0+a.rest,a.th);
  g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);});};
 if(soft){g.strokeStyle=rgba(q.rgb,.13);g.lineWidth=3.4;path();g.stroke();}
 g.strokeStyle=rgba(q.rgb,.6);g.lineWidth=Math.max(1.1,.9/st.k);path();g.stroke();});}

/* ============================================================
   SHARED PIECES. The family every version keeps, so all four are the Field.
   ============================================================ */
/* the glass lens, ET's: the prism under it, the glass over it, one highlight */
function drawLens(g,R,r,a,rot,brt){if(a<=0||r<=0)return;
 g.save();g.globalAlpha=a*.9*(brt||1);g.rotate(rot);var B=44*r/R_LENS;g.drawImage(R.prism,-B/2,-B/2,B,B);g.restore();
 g.globalAlpha=a;circle(g,r);g.fillStyle='rgba(22,24,32,.40)';g.fill();
 g.lineWidth=.45;g.strokeStyle='rgba(255,255,255,.16)';g.stroke();
 g.drawImage(R.spec,-r,-r,2*r,2*r);
 var d=3.4*Math.min(1,r/R_LENS);g.globalAlpha=a*.5;g.drawImage(R.gAC,-d*3,-d*3,d*6,d*6);
 g.globalAlpha=a;circle(g,d*.62);g.fillStyle=rgba(AC,1);g.fill();g.globalAlpha=1;}
/* the glass bar's ring: track at ink 16 percent, then the value from twelve,
   clockwise, round cap, ease out */
function coreRing(g,t,t0,dur,w){var u=seg(t,t0-.08,.3);if(u<=0)return;
 g.lineWidth=w||2.2;g.strokeStyle=rgba(INK,.16*OUT(u));circle(g,R_CORE);g.stroke();
 var v=seg(t,t0,dur);if(v<=0)return;g.lineCap='round';g.strokeStyle=rgba(AC,Math.min(1,v/.04));
 g.beginPath();g.arc(0,0,R_CORE,-HP,-HP+OUT(v)*TAU);g.stroke();}
/* the gold halo, closing the figure clockwise from twelve */
function halo(g,t,t0,w,a){var v=seg(t,t0,.8);if(v<=0)return;g.lineCap='round';g.lineWidth=w||.8;
 g.strokeStyle=rgba(AU,(a||.7)*Math.min(1,v/.04));g.beginPath();g.arc(0,0,R_HALO,-HP,-HP+OUT(v)*TAU);g.stroke();}
function dot(g,x,y,r,c,a){g.globalAlpha=a;g.beginPath();g.arc(x,y,Math.max(0,r),0,TAU);g.fillStyle=typeof c==='string'?c:rgba(c,1);g.fill();g.globalAlpha=1;}
function spr(g,s,x,y,r,a){if(a<=.004||r<=0)return;g.globalAlpha=a;g.drawImage(s,x-r,y-r,2*r,2*r);g.globalAlpha=1;}
/* the Wheel's own breathing clock, 4.49 seconds, for the rest */
function rest(t,t0){return t<t0?0:Math.sin(TAU*(t-t0)/4.49);}

var V={};

/* ============================================================
   1. BREATH. Soft light. One breath in, one breath out.

     0.00  the ember lies flat, low and dim, a little below the centre.
           The seven colours sit far out at the edges, faint.
     0.92  the breath in. Seven motes of the seats' colours spiral in from
           the edges and are swallowed, 80ms apart, accelerating the way a
           thing falls into a well. The ember rises onto the centre on a
           curve, stretching as it moves and rounding as it arrives.
     1.75  the top of the breath. Held for 150ms, trembling.
     1.90  the breath out. The ember opens into the glass lens and a wave
           of the seven colours leaves it. Where the wave passes, the ring
           is left behind it. The seats ride out on the wave, 60ms apart.
     2.62  the lens's ring fills. 2.80 the wave dies at the halo.
     3.00  at rest the light breathes on the Wheel's own clock.
     4.38  a last small breath in, then out through the ring.
   ============================================================ */
V.breath={draw:function(g,t,st){
 var R=st.R, k=1+.06*rest(t,3.0);
 /* the ring, left behind by the wave */
 var wp=seg(t,1.90,1.15), rf=OUT(wp)*116;
 if(t>=1.90){
  if(wp>=1)drawPlate(g,R.softRing,200);
  else{var rr=rf-3;
   g.save();clipDisc(g,rr-18);drawPlate(g,R.softRing,200);g.restore();
   g.save();clipRing(g,rr-18,rr);g.globalAlpha=.42;drawPlate(g,R.softRing,200);g.restore();g.globalAlpha=1;}}
 /* the wave itself: the seven colours, each on its own bearing */
 if(wp>0&&wp<1){var env=Math.pow(1-wp,1.15),cs;
  if(g.createConicGradient){cs=g.createConicGradient(-HP,0,0);
   var seam=mix(SEATS[6].rgb,SEATS[0].rgb,.5);cs.addColorStop(0,rgba(seam,1));
   SEATS.forEach(function(q){cs.addColorStop(q.tm/TAU,rgba(q.rgb,1));});cs.addColorStop(1,rgba(seam,1));}
  else cs=rgba(AC,1);
  g.strokeStyle=cs;g.globalAlpha=env*.14;g.lineWidth=18;circle(g,rf);g.stroke();
  g.globalAlpha=env*.5;g.lineWidth=2.4;circle(g,rf);g.stroke();g.globalAlpha=1;}
 /* the motes, the breath in, with two smear frames behind each */
 if(t>.9&&t<1.9)SEATS.forEach(function(q,i){var t0=.92+i*.08;
  for(var gh=2;gh>=0;gh--){var u=seg(t-gh*.03,t0,.8);if(u<=0||u>=1)continue;var e=IN(u);
   var p=P(lerp(150,2,e),q.tm+lerp(.95,0,e)),a=Math.min(1,u/.2)*(u>.88?(1-u)/.12:1)*[1,.42,.18][gh];
   spr(g,R.glow[i],p[0],p[1],6,a*.6);dot(g,p[0],p[1],gh?1.1:1.4,q.rgb,a);}});
 /* the seats, riding out on the wave, each on a short spiral */
 SEATS.forEach(function(q,i){var u=seg(t,1.96+i*.06,.56);if(u<=0)return;
  var p=P(lerp(3,R_DOT,LAND(u)),q.tm-.38*(1-OUT(u))),a=Math.min(1,u/.15);
  spr(g,R.glow[i],p[0],p[1],q.r*4.2,a*.34*k);dot(g,p[0],p[1],q.r*lerp(.6,1,OUT(u)),q.rgb,a);});
 /* the lens, which is the ember, opened */
 var lu=seg(t,1.90,.62);
 if(lu>0)drawLens(g,R,lerp(3.4,R_LENS,LAND(lu)),Math.min(1,lu/.3),-.7*(1-OUT(lu)),k);
 coreRing(g,t,2.62,.9);
 halo(g,t,2.80);
 /* THE EMBER. Collapsed: flat, low, dim and grey. It rises on an arc and
    stretches while it moves, and only while it moves; standing, it is
    round. It tints as the colours reach it. */
 if(t<2.36){var u=seg(t,.95,.8),e=IO(u);
  var x=-3.2*Math.sin(Math.PI*e),y=lerp(14,0,e);
  var vel=(u>0&&u<1)?(IO(Math.min(1,u+.02))-IO(Math.max(0,u-.02)))/.04/2:0;
  var rx=lerp(6.2,3.4,e)*(1-.15*vel),ry=lerp(2.3,3.4,e)*(1+.30*vel);
  var a2=t-1.75;if(a2>0&&a2<.16){var sq=.12*Math.sin(Math.PI*a2/.16);rx*=1+sq;ry*=1-sq;}
  var hold=seg(t,1.75,.04)*(1-seg(t,1.86,.04));x+=.3*Math.sin(t*88)*hold;
  var took=0;SEATS.forEach(function(q,i){took+=c01((t-(.92+i*.08+.72))/.1);});
  var col=mix(mix([118,128,138],AC,OUT(seg(t,.9,.9))),[232,240,244],took/7*.55);
  var lum=lerp(.34,1,OUT(seg(t,.9,1.0))),ex=seg(t,1.90,.46),fade=1-OUT(ex),grow=1+2.4*OUT(ex);
  spr(g,R.gAC,x,y,Math.max(rx,ry)*5.5*grow,lum*fade*.55);
  g.globalAlpha=lum*fade;g.fillStyle=rgba(col,1);g.beginPath();g.ellipse(x,y,rx*grow,ry*grow,0,0,TAU);g.fill();g.globalAlpha=1;}
}};

/* ============================================================
   2. ORRERY. Engraved hairlines, in real perspective. A globe that turns.

     0.00  one point of light. The whole Field is there, seen exactly edge
           on, so it is a line with no width, and the soul is a point on it.
     0.70  the horizon draws out from the point to both sides. The seven
           seats appear on it, 60ms apart.
     1.50  the horizon tips away from you, seven degrees. The backswing.
     1.72  it swings toward you on a spring, passes facing you by about
           fourteen degrees and settles back. The seats travel forward along
           their orbit into place, 50ms apart. The point grows into a globe
           as the plane opens, turning the whole time.
     1.90  each seat's arc is engraved from its middle.
     2.05  the addresses click in round the dial twelve times a second,
           like a watch, not smoothly.
     2.62  the core's ring fills. The globe slows until you are looking
           down its pole, where its seven meridians point at the seven
           seats. 2.90 the halo.
     4.50  the plane lies down away from you and you go through it.
   ============================================================ */
var DPERS=380;
function PJ(phi){var c=Math.cos(phi),s=Math.sin(phi);
 return function(r,th){var x=r*Math.sin(th),yp=-r*Math.cos(th),z=yp*s,f=DPERS/(DPERS-z);return [x*f,yp*c*f,z,f];};}
function phiAt(t){
 if(t<1.50)return 90*D2R;
 if(t<1.72)return (90+7*IO(seg(t,1.50,.22)))*D2R;
 var p=97*(1-spring(t-1.72,6.2,.52));
 if(t>4.5)p+=58*IN(seg(t,4.5,.4));
 return p*D2R;}
function spinAt(t){var t1=1.0,T=2.5,A=1.6*Math.PI;if(t<t1)return -A-(2*A/T)*(t1-t);var u=seg(t,t1,T);return -A*(1-u)*(1-u);}
function polyRing(g,pj,r,a0,a1,n,split){
 /* returns nothing; draws the near half on the current path, and the far
    half on split's path when split is given */
 var prev=null;for(var i=0;i<=n;i++){var th=a0+(a1-a0)*i/n,p=pj(r,th);
  if(prev){var far=split&&(p[2]<0&&prev[2]<0);var tg=far?split:g;tg.moveTo(prev[0],prev[1]);tg.lineTo(p[0],p[1]);}prev=p;}}
function globe(g,st,Rg,phi,spin,a,t){
 var R=st.R,c=Math.cos(phi),s=Math.sin(phi),n=[0,-s,c],ey=[0,c,s],hw=Math.max(.5,.7/st.k);
 if(Rg<3){spr(g,R.gAC,0,0,9,a*.75);dot(g,0,0,Math.max(.9,Rg),INK,a);return;}
 g.globalAlpha=a;circle(g,Rg);g.fillStyle='rgba(9,11,16,.78)';g.fill();
 spr(g,R.gAC,0,0,Rg*.9,a*.35);
 var curve=function(fn,col,al){var nearP=new Path2D(),farP=new Path2D(),prev=null;
  for(var i=0;i<=48;i++){var v=fn(i/48);if(prev){var P2=(v[2]<0&&prev[2]<0)?farP:nearP;P2.moveTo(prev[0],prev[1]);P2.lineTo(v[0],v[1]);}prev=v;}
  g.lineWidth=hw;g.strokeStyle=rgba(col,al*a*.28);g.stroke(farP);g.strokeStyle=rgba(col,al*a);g.stroke(nearP);};
 /* the latitudes are the ring's own parallels: circles in the Field's plane */
 [[0,.85,AC],[.78,.4,AC]].forEach(function(L){var h=Rg*Math.sin(L[0]),rho=Rg*Math.cos(L[0]);
  curve(function(u){var al=u*TAU,ca=Math.cos(al),sa=Math.sin(al);
   return [h*n[0]+rho*ca,h*n[1]+rho*sa*ey[1],h*n[2]+rho*sa*ey[2]];},L[2],L[1]);});
 /* seven meridians, one per seat, pole to pole, turning. At rest they point
    at their seats, so the globe seen from its pole is the Field's own dial */
 SEATS.forEach(function(q){var lam=q.tm-HP+spin,cl=Math.cos(lam),sl=Math.sin(lam),d=[cl,sl*ey[1],sl*ey[2]];
  curve(function(u){var b=u*Math.PI,cb=Math.cos(b),sb=Math.sin(b);
   return [Rg*(cb*n[0]+sb*d[0]),Rg*(cb*n[1]+sb*d[1]),Rg*(cb*n[2]+sb*d[2])];},q.rgb,.8);});
 g.globalAlpha=a;g.lineWidth=hw*1.3;g.strokeStyle=rgba(AC,.55*a);circle(g,Rg);g.stroke();
 spr(g,R.gAC,0,0,7,a*.6);dot(g,0,0,1.5,INK,a);g.globalAlpha=1;}
V.orrery={draw:function(g,t,st){
 var R=st.R,phi=phiAt(t),pj=PJ(phi),hw=Math.max(.35,.6/st.k);
 /* the horizon drawing out from the point */
 var xw=OUT(seg(t,.70,.65))*110;
 g.save();if(t<1.40){g.beginPath();g.rect(-xw,-200,2*xw,400);g.clip();}
 if(t>=.70){
  /* the engraved guide circles, gold, at the plate's two edges */
  var gu=OUT(seg(t,.75,.8));
  [R_T0-2.2,R_T0+T_LEN+1.8].forEach(function(r){var near=new Path2D(),far=new Path2D();polyRing(near,pj,r,0,TAU,120,far);
   g.lineWidth=hw;g.strokeStyle=rgba(AU,.14*gu);g.stroke(far);g.strokeStyle=rgba(AU,.34*gu);g.stroke(near);});
  var near=new Path2D(),far=new Path2D();polyRing(near,pj,R_SEAT,0,TAU,120,far);
  g.lineWidth=hw;g.strokeStyle=rgba(INK,.07*gu);g.stroke(far);g.strokeStyle=rgba(INK,.16*gu);g.stroke(near);}
 /* each seat's arc, engraved from its middle */
 SEATS.forEach(function(q,i){var u=seg(t,1.90+i*.06,.55);if(u<=0)return;var h=OUT(u)*((q.th1-q.th0)/2-GAP);
  var near=new Path2D(),far=new Path2D();polyRing(near,pj,R_SEAT,q.tm-h,q.tm+h,24,far);
  g.lineWidth=1.5;g.strokeStyle=rgba(q.rgb,.4);g.stroke(far);g.strokeStyle=rgba(q.rgb,.92);g.stroke(near);});
 /* the addresses, clicking in on a watch's step, twelve a second */
 var tq=Math.floor(t*12)/12,nOn=Math.floor(N*OUT(seg(tq,2.05,.95))),nPrev=Math.floor(N*OUT(seg(tq-1/12,2.05,.95)));
 if(nOn>0){SEATS.forEach(function(q){var near=new Path2D(),far=new Path2D(),fresh=new Path2D();
  ADDR.forEach(function(a){if(a.q!==q||a.s>=nOn)return;var p0=pj(R_T0,a.th),p1=pj(R_T0+a.rest,a.th);
   var tg=a.s>=nPrev?fresh:(p0[2]<0?far:near);tg.moveTo(p0[0],p0[1]);tg.lineTo(p1[0],p1[1]);});
  g.lineWidth=Math.max(.9,.8/st.k);g.strokeStyle=rgba(q.rgb,.32);g.stroke(far);g.strokeStyle=rgba(q.rgb,.72);g.stroke(near);
  g.lineWidth=1.4;g.strokeStyle=rgba(mix(q.rgb,INK,.5),1);g.stroke(fresh);});}
 /* the halo, in the plane */
 var hv=seg(t,2.90,.8);if(hv>0){var near2=new Path2D(),far2=new Path2D();polyRing(near2,pj,R_HALO,0,OUT(hv)*TAU,120,far2);
  g.lineWidth=.8;g.strokeStyle=rgba(AU,.3);g.stroke(far2);g.strokeStyle=rgba(AU,.7);g.stroke(near2);}
 /* the core's ring, in the plane, filling from twelve */
 var cu=seg(t,2.54,.3);if(cu>0){var nt=new Path2D();polyRing(nt,pj,R_CORE,0,TAU,72);g.lineWidth=2.2;g.strokeStyle=rgba(INK,.16*OUT(cu));g.stroke(nt);
  var cv=seg(t,2.62,.9);if(cv>0){var nv=new Path2D();polyRing(nv,pj,R_CORE,0,OUT(cv)*TAU,72);g.lineCap='round';g.strokeStyle=rgba(AC,Math.min(1,cv/.04));g.stroke(nv);}}
 /* THE SEATS, small spheres lit from the upper left, the same light ET's
    lens takes, travelling forward along their orbit into place */
 var order=SEATS.map(function(q,i){var u=t<1.72?0:spring(t-(1.72+i*.05),6.5,.6),th=q.tm-.75*(1-u),p=pj(R_DOT,th);return {q:q,i:i,p:p};})
  .sort(function(a,b){return a.p[2]-b.p[2];});
 order.forEach(function(o){var pu=seg(t,1.05+o.i*.06,.34);if(pu<=0)return;var r=o.q.r*o.p[3]*LAND(pu),x=o.p[0],y=o.p[1];
  spr(g,R.glow[o.i],x,y,r*3.2,.22);dot(g,x,y,r,o.q.rgb,1);
  dot(g,x-r*.34,y-r*.38,r*.36,[255,255,255],.42);});
 g.restore();
 /* THE SOUL. A point, then a globe as the plane opens, turning the whole
    time and slowing into place */
 var Rg=t<1.78?.9*OUT(seg(t,.25,.5)):lerp(.9,R_LENS,OUT(seg(t,1.78,.95)));
 globe(g,st,Rg,phi,spinAt(t),1,t);
}};

/* ============================================================
   3. BLOOM. Flat solid planes, nothing outlined. A bud that opens.

     0.00  a closed bud: the seven seats' petals folded up over the centre,
           showing their darker backs. The soul is inside it, hidden.
     1.28  the bud tightens by fourteen percent and twists back eight
           degrees. The backswing.
     1.62  the petals open one after another, root first, 70ms apart. Each
           swings through upright, past flat, and settles back, and stretches
           a little while it swings fastest. The twist springs forward.
           As each lifts, the soul shows through the gap it leaves.
     1.80  the soul swells from a seed to a solid disc.
     2.46  the open petals draw in to become the ring's seven bands.
     2.55  the core's ring fills, solid. 2.62 the seats land. 2.70 the
           addresses sweep round. 3.00 the halo.
     4.50  the bands fly outward past you, 20ms apart.
   ============================================================ */
V.bloom={draw:function(g,t,st){
 var R=st.R,ant=IO(seg(t,1.28,.34)),rel=t>1.62;
 var sc=rel?lerp(.86,1,spring(t-1.62,7,.5)):lerp(1,.86,ant);
 var rot=(rel?-8*(1-spring(t-1.62,6,.42)):-8*ant)*D2R;
 var ex=t>4.5;
 /* THE SOUL, under the bud, so it is uncovered as the petals lift */
 var su=seg(t,1.80,.55),sr=lerp(2.6,11,LAND(su));
 g.save();g.scale(sc,sc);g.rotate(rot);
 circle(g,sr*(ex?1+.5*IN(seg(t,4.5,.36)):1));g.fillStyle=rgba(mix([40,60,72],AC,OUT(su)),1);g.fill();
 SEATS.forEach(function(q,i){
  var ti=1.62+i*.07,al,L=74,rh=16;
  if(t<ti)al=(165+11*ant)*D2R;
  else{var sp=spring(t-ti,9,.5);al=176*(1-sp)*D2R;
   var da=Math.abs(176*(spring(t-ti+.01,9,.5)-spring(t-ti-.01,9,.5))/.02);L*=1+.08*Math.min(1,da/900);}
  var c=Math.cos(al),rIn,rOut;
  if(c>=0){rIn=rh;rOut=rh+L*c;}else{rIn=Math.max(0,rh+L*c);rOut=rh;}
  var s2=OUT(seg(t,2.46+i*.05,.5));rIn=lerp(rIn,58.8,s2);rOut=lerp(rOut,65.2,s2);
  if(ex){var f=1+1.2*IN(seg(t,4.5+i*.02,.34));rIn*=f;rOut*=f;}
  /* the fold's light: a face turned to the viewer is its full colour, and
     it darkens as it turns away; the back of a petal is darker still */
  var sh=c>=0?.52+.48*c:.30+.16*(-c);
  if(rOut-rIn<.05)return;
  /* a petal has a tip. Open, its outer edge rises to a point on the seat's
     own bearing; as it draws in to become the band, the tip flattens */
  var tip=c>0?(1-s2)*c:0;
  petal(g,rIn,rOut,q.th0+GAP*.6,q.th1-GAP*.6,tip);g.fillStyle=rgba(mix([0,0,0],q.rgb,sh),1);g.fill();});
 g.restore();
 /* the ring's solid pieces, once the flower has become the instrument */
 var xs=ex?1+.3*IN(seg(t,4.5,.36)):1;g.save();g.scale(xs,xs);
 var tu=seg(t,2.70,.7);if(tu>0){g.save();clipWedge(g,0,IO(tu)*TAU+.01);drawPlate(g,R.blocks,200);g.restore();}
 /* the core's ring, as a solid band filling clockwise */
 var cu=seg(t,2.47,.3);if(cu>0){band(g,22,26,0,TAU);g.fillStyle=rgba(INK,.12*OUT(cu));g.fill();
  var cv=seg(t,2.55,.85);if(cv>0){band(g,22,26,0,OUT(cv)*TAU);g.fillStyle=rgba(AC,1);g.fill();}}
 SEATS.forEach(function(q,i){var u=seg(t,2.62+i*.05,.36);if(u<=0)return;var p=P(R_DOT,q.tm);dot(g,p[0],p[1],q.r*1.15*LAND(u),q.rgb,1);});
 var hv=seg(t,3.0,.8);if(hv>0){band(g,R_HALO-.7,R_HALO+.7,0,OUT(hv)*TAU);g.fillStyle=rgba(AU,.85);g.fill();}
 g.restore();
}};

/* ============================================================
   4. EMBER. Particles of light, thrown and caught.

     0.00  every address in the field packed into one hot point, white,
           trembling. The soul, collapsed, holds all of it.
     0.80  it gathers tighter. 1.40 it compresses hard and brightens, and
           the trembling grows. The backswing.
     1.62  it bursts. Each address is thrown out along its own bearing with
           a turn on it, so it spirals, and a spring pulls it back to its
           own place on the ring. It overshoots and settles. It cools from
           white to its seat's colour as it flies, stretches along its path
           while it moves, and shortens into its mark when it stops. The
           seven seats are heavier: they leave slower and land later.
           Sparks shed from the burst and burn out.
     1.98  the centre, emptied, opens into the glass lens.
     2.30  each seat's arc grows from its middle as it lands.
     2.62  the core's ring fills. 2.90 the halo.
     4.50  every mark streaks outward as you fly through the field.

   STRAIGHT AHEAD, THEN RECORDED. The flight is simulated a step at a time,
   240 steps a second, not posed, and recorded once at 120 frames a second.
   Playback reads the recording, so it is the same every time, scrubs
   exactly, and costs nothing to simulate while it plays.
   ============================================================ */
var TR=1.62, EMB=null;
function bake(){
 var r=rng(20260926),B=[],DT=1/240,REC=1/120,T_END=4.6;
 ADDR.forEach(function(a){B.push({k:0,q:a.q,th:a.th,rest:a.rest,home:R_T0+a.rest/2,w:8.2,z:.40,v0:330+95*r(),tw:.34});});
 SEATS.forEach(function(q){B.push({k:1,q:q,th:q.tm,home:R_DOT,w:6.0,z:.56,v0:235+20*r(),tw:.26});});
 for(var i=0;i<64;i++){var q=SEATS[(r()*7)|0];B.push({k:2,q:q,th:q.th0+r()*(q.th1-q.th0),life:.42+.5*r(),v0:430+400*r(),tw:.3});}
 B.forEach(function(b){var a=r()*TAU,d=Math.sqrt(r());b.ux=Math.cos(a)*d;b.uy=Math.sin(a)*d;
  b.f1=9+8*r();b.f2=13+9*r();b.p1=r()*TAU;b.p2=r()*TAU;b.p3=r()*TAU;b.p4=r()*TAU;});
 var F=Math.ceil((T_END-TR)/REC)+2;
 B.forEach(function(b){
  var p=ballPos(b,TR),x=p[0],y=p[1],dx=Math.sin(b.th),dy=-Math.cos(b.th),tx=Math.cos(b.th),ty=Math.sin(b.th);
  var j=(r()-.5)*.12,vx=b.v0*(dx+tx*(b.tw+j)),vy=b.v0*(dy+ty*(b.tw+j));
  var hx=(b.home||0)*dx,hy=(b.home||0)*dy,rec=new Float32Array(F*4),step=0,fi=0;
  for(var tt=0;fi<F;tt+=DT,step++){
   if(step%2===0){rec[fi*4]=x;rec[fi*4+1]=y;rec[fi*4+2]=vx;rec[fi*4+3]=vy;fi++;}
   var ax,ay,rr=Math.hypot(x,y)||1,vort=260*Math.exp(-3.5*tt);
   if(b.k===2){ax=-3.4*vx;ay=-3.4*vy;}
   else{ax=-b.w*b.w*(x-hx)-2*b.z*b.w*vx;ay=-b.w*b.w*(y-hy)-2*b.z*b.w*vy;}
   ax+=vort*(-y/rr);ay+=vort*(x/rr);
   vx+=ax*DT;vy+=ay*DT;x+=vx*DT;y+=vy*DT;}
  b.rec=rec;});
 return {B:B,REC:REC,F:F};}
function ballR(t){return t<.8?5:t<1.4?lerp(5,3.6,IO(seg(t,.8,.6))):lerp(3.6,2,IN(seg(t,1.4,.22)));}
function ballPos(b,t){var R=ballR(t),A=.3+1.0*seg(t,1.15,.47);
 return [b.ux*R+A*(.6*Math.sin(t*b.f1+b.p1)+.4*Math.sin(t*b.f2+b.p2)),b.uy*R+A*(.6*Math.sin(t*b.f1*1.1+b.p3)+.4*Math.sin(t*b.f2*.9+b.p4))];}
function sample(b,t){var f=(Math.min(t,4.5)-TR)/EMB.REC,i=Math.floor(f),u=f-i;if(i>=EMB.F-1){i=EMB.F-2;u=1;}
 var R=b.rec,o=i*4,o2=o+4;return [R[o]+(R[o2]-R[o])*u,R[o+1]+(R[o2+1]-R[o+1])*u,R[o+2]+(R[o2+2]-R[o+2])*u,R[o+3]+(R[o2+3]-R[o+3])*u];}
V.ember={draw:function(g,t,st){
 if(!EMB)EMB=bake();
 var R=st.R,B=EMB.B;
 /* the ring's arcs, grown from the middle as each seat lands */
 SEATS.forEach(function(q,i){var u=seg(t,2.30+i*.05,.52);if(u<=0)return;var h=OUT(u)*((q.th1-q.th0)/2-GAP);
  g.lineCap='round';g.lineWidth=3.2;g.strokeStyle=rgba(q.rgb,.9*Math.min(1,u/.06));g.beginPath();arcP(g,R_SEAT,q.tm-h,q.tm+h);g.stroke();});
 g.globalCompositeOperation='lighter';
 if(t<TR){
  /* THE COLLAPSE. All of it in one point, and the pressure building */
  var press=seg(t,1.2,.42),Rb=ballR(t);
  spr(g,R.gW,0,0,Rb*4.2+6,.28+.4*press);
  for(var i=0;i<B.length;i++){var b=B[i];if(b.k===2)continue;var p=ballPos(b,t);spr(g,R.gW,p[0],p[1],2.4,.10+.12*press);}
 }else{
  var ex=t>4.5?IN(seg(t,4.5,.38)):0,dex=t>4.5?1.4*(IN(seg(t+.01,4.5,.38))-IN(seg(t-.01,4.5,.38)))/.02:0;
  var cool=OUT(seg(t,TR,.6)),fl=seg(t,TR,.42);
  if(fl<1)spr(g,R.gW,0,0,lerp(10,74,OUT(fl)),.5*(1-fl));
  /* the addresses, batched one path per seat */
  SEATS.forEach(function(q,qi){var path=new Path2D(),heads=[];
   var col=mix(WHITE,q.rgb,cool),settled=0,count=0;
   for(var i=0;i<B.length;i++){var b=B[i];if(b.q!==q||b.k!==0)continue;
    var s=sample(b,t),x=s[0],y=s[1],vx=s[2],vy=s[3];
    if(ex>0){x*=1+1.4*ex;y*=1+1.4*ex;vx=s[0]*dex;vy=s[1]*dex;}
    var sp=Math.hypot(vx,vy),qq=ex>0?0:c01(1-sp/55),dx=Math.sin(b.th),dy=-Math.cos(b.th),hr=b.rest/2;
    var ax=x+qq*dx*hr,ay=y+qq*dy*hr,tx=lerp(x-vx*.024,x-dx*hr,qq),ty=lerp(y-vy*.024,y-dy*hr,qq);
    path.moveTo(tx,ty);path.lineTo(ax,ay);settled+=qq;count++;
    if(qq<.98)heads.push([x,y,1-qq]);}
   var sa=settled/count;
   g.lineCap='round';g.lineWidth=lerp(1.3,Math.max(1.1,.9/st.k),sa);g.strokeStyle=rgba(col,lerp(.95,.6,sa)*(1-ex));g.stroke(path);
   heads.forEach(function(h){spr(g,R.gW,h[0],h[1],2.6,h[2]*.3*(1-cool)*(1-ex));spr(g,R.glow[qi],h[0],h[1],2.8,h[2]*.4*cool*(1-ex));});});
  /* the sparks, straight out and burning out */
  for(var i2=0;i2<B.length;i2++){var b2=B[i2];if(b2.k!==2)continue;var age=t-TR;if(age>=b2.life)continue;
   var s2=sample(b2,t),life=Math.pow(1-age/b2.life,1.5),c2=mix(WHITE,b2.q.rgb,c01(age/b2.life*1.6));
   g.lineWidth=.7;g.strokeStyle=rgba(c2,.8*life);g.beginPath();g.moveTo(s2[0]-s2[2]*.03,s2[1]-s2[3]*.03);g.lineTo(s2[0],s2[1]);g.stroke();}
  g.globalCompositeOperation='source-over';
  /* the seats, heavier bodies: stretched along their path in flight, the
     area kept, round again the moment they stop */
  B.forEach(function(b){if(b.k!==1)return;var s=sample(b,t),x=s[0],y=s[1],vx=s[2],vy=s[3];
   if(ex>0){x*=1+1.1*ex;y*=1+1.1*ex;vx=s[0]*dex;vy=s[1]*dex;}
   var sp=Math.hypot(vx,vy),st2=1+Math.min(.55,sp/520),col=mix(WHITE,b.q.rgb,cool),a=1-ex;
   spr(g,R.glow[b.q.i],x,y,b.q.r*4,.3*a);
   g.save();g.translate(x,y);g.rotate(Math.atan2(vy,vx));g.scale(st2,1/st2);
   g.globalAlpha=a;g.beginPath();g.arc(0,0,b.q.r,0,TAU);g.fillStyle=rgba(col,1);g.fill();g.restore();g.globalAlpha=1;});
 }
 g.globalCompositeOperation='source-over';
 /* the centre, emptied by the burst, opens into the lens */
 var lu=seg(t,1.98,.62);
 if(lu>0){var la=lu<.22?lerp(.3,.2,IO(lu/.22)):lerp(.2,1,LAND((lu-.22)/.78));
  drawLens(g,R,la*R_LENS,Math.min(1,lu/.22),-.7*(1-OUT(lu)),1+.06*rest(t,3));}
 coreRing(g,t,2.62,.9);
 halo(g,t,2.90);
}};

/* ============================================================
   THE STAGE. One canvas per sheet, sized to the figure and a margin.
   ============================================================ */
var CUR=null, LAST=null, RAF=0;
function size(st){
 var stage=st.el.querySelector('.vx-stage'),S=stage.clientWidth||300,d=Math.min(2,window.devicePixelRatio||1);
 var C=S*1.7;st.S=S;st.k=S/200;st.dpr=d;st.u=st.k*d;st.C=C;
 st.cv.width=Math.round(C*d);st.cv.height=Math.round(C*d);st.g=st.cv.getContext('2d');
 st.R=resources(st);st.lastT=-1;}
function clockOf(el){var a=el.getAnimations?el.getAnimations().filter(function(x){return x.animationName==='bootOut';})[0]:null;return a||null;}
function timeOf(st){if(st.still!=null)return st.still;var a=st.clk;if(!a)return 3.6;var c=a.currentTime;return c==null?5.24:c/1000;}
function paint(st,t){var g=st.g,W=st.cv.width;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.clearRect(0,0,W,W);
 g.setTransform(st.u,0,0,st.u,W/2,W/2);g.lineCap='round';g.lineJoin='round';V[st.v].draw(g,t,st);}
function frame(ts){
 var st=CUR;if(!st||!st.el.isConnected){RAF=0;CUR=null;return;}
 var t=timeOf(st);
 if(t!==st.lastT){var t0=performance.now();paint(st,t);var dt=performance.now()-t0;st.lastT=t;
  var a=st.clk;if(a&&a.playState==='running'&&a.playbackRate===1&&t>.8&&t<4.5){
   st.stats.draw.push(dt);if(st.lastTs)st.stats.gap.push(ts-st.lastTs);}}
 st.lastTs=ts;
 RAF=requestAnimationFrame(frame);}
var VX=window.VX={
 V:V,
 has:function(v){return !!V[v];},
 mount:function(el,opt){
  var st={el:el,v:el.getAttribute('data-v'),cv:el.querySelector('.vx-cv'),stats:{draw:[],gap:[]},still:opt&&opt.still!=null?opt.still:null};
  if(!V[st.v]||!st.cv)return null;
  size(st);st.clk=clockOf(el);CUR=st;LAST=st;
  if(st.still!=null){paint(st,st.still);return st;}
  if(!RAF)RAF=requestAnimationFrame(frame);
  return st;},
 cur:function(){return CUR;},
 last:function(){return LAST;},
 resize:function(){if(CUR&&CUR.el.isConnected){size(CUR);if(CUR.still!=null)paint(CUR,CUR.still);}},
 /* the first load: the sheet already in the document, before the app */
 first:function(){
  var el=document.getElementById('boot');if(!el)return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var h=(location.hash||'').replace('#','').toLowerCase();if(V[h])el.setAttribute('data-v',h);
  VX.mount(el);}};
addEventListener('resize',function(){VX.resize();});
VX.first();
})();
