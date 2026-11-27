/* ============================================================
   THE CHARACTER CLOUD. The drawing half of the Character page: a person made
   of points, bent into the mask they wear, inside a torus of light that is the
   health of their body. ui/character.js is the page round it and
   engine/charfield.js holds every number the shape is bent by.

   Rounds ON to OW and PE in TASKS.md. Orbit was picked; the owner then asked
   for "a torus field that animates from the bottom to the top, around the
   body ... like Bezier curves, so you can see how the chakras are influencing
   and distorting it", the point cloud "tied to the CQ and the stories,
   because it's the masks", and "a trace on it so we can see where we're
   leaking energy". Three torus mockups were drawn (mockups/character-torus)
   and he took the second: ONE TUBE, AND THE SEVEN SEAT RINGS ARE SLICES OF IT.
   Round PE then said how it moves: only subtle suggestions of flow, and an
   oscillation, a breathing of the radius and a slow wave up its height, whose
   size and rate are the Vitality reading. That is built here and nothing
   else of the other two.

   WHAT EACH THING ON THE PAGE IS, since the first thing he asked of the
   mockup was what the points mean:

     the body        a cloud of points sampled once on the figure's twenty
                     segments. Load bends the figure and coherence lights it.
                     Where it is dense and bright is where the 112 addresses
                     carry charge: a charge map of the body is splatted from
                     them every frame and every point looks up how much charge
                     is near it. Write a story that lands on the Solar seat
                     and the Solar region fills in.
     the points      each of the 112 addresses is one point, 108 round the
     round it        body at the height of their seat going slowly round the
                     spine and 4 anchors as rings on the axis, two above the
                     head and two below the feet. Size and brightness are the
                     address's charge. Hover one and the right panel names it.
     the torus       one tube round the body's axis, drawn as cubic Bezier
                     curves in three dimensions. Coherence sets its size,
                     brightness and how complete it is. Each seat pinches,
                     pulls or swells it at its own height by how closed it is,
                     and a closed seat runs slow, stutters and breaks into
                     gaps. Vitality makes it breathe.
     the seat rings  seven bold rings, one per seat, half the seat's colour
                     and half the colour of the air at that place. A closed
                     ring is narrow, broken and dim.
     the air         a coarse grid of colour made from the cloud every few
                     frames. Every glow, torus point and address asks it for
                     the cell it sits in, so nothing about their colour is
                     fixed. At low coherence the air is ember grey and so is
                     everything that reads it, which is why a field that is
                     not lit goes quiet without being told to.
     the heat map    an overlay, off until asked for: the body coloured by the
                     charge it carries, from the Body's own heat ramp.

   WHAT IT COSTS. Every frame builds the charge map, places up to nine
   thousand points, builds the torus as strokes, draws, and lays a blurred copy
   back over itself for the glow. The mockup measured 74 to 94 ms a frame on a
   Chromium with no graphics card and two thirds of that was the glow. So the
   glow's blurred copies are rebuilt every third frame and composited every
   frame, the colour field every third, a phone is given 4,600 points and not
   9,000, and a governor reads the real frame interval and steps the work down
   when the page cannot hold it: fewer points, fewer meridians, then no glow.

   THIS FILE DRAWS AND READS THE DOCUMENT FOR A CANVAS AND NOTHING ELSE. It does
   not call compute() and does not read S. ui/character.js hands a scene the
   numbers (feed) and the scene eases toward them. It is one closure with a
   small public surface at the foot, so its two hundred helper names cannot
   collide with the rest of the build, which shares one scope.
   ============================================================ */
var CHC=(function(){
 var TAU=Math.PI*2;
 /* the pure helpers. clamp and lerp are the build's own; the rest are only
    wanted here, and several of the names (hash, mixc, css) mean something else
    elsewhere in the build, which is why this is a closure. */
 var sstep=charSmooth;
 function frac(x){return x-Math.floor(x);}
 function sgn(x){return x<0?-1:1;}
 function sat(a,b,v){return clamp((v-a)/(b-a),0,1);}
 function mixc(a,b,k){return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];}
 function css(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+(a===undefined?1:a)+')';}
 function hash(i,k){var h=(i*374761393+(k||0)*668265263)|0;h=(h^(h>>>13))*1274126177|0;h^=h>>>16;return (h>>>0)/4294967296;}
 function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 var INK=[239,237,232];
 /* an unlit point: a cool grey, the same the pattern colours fade to at no charge */
 var EMBER=[150,158,174];

 /* ---------- the seats, the nine patterns, the five masks ----------
    The seat colours are PAL, the dark palette, on every theme: this page
    draws light on a black ground, and Snow's deepened ink would be invisible
    on it. The nine patterns are CHILD and the five masks MASKS_READ, the
    canon's own, with Professional left out where the canon leaves it out. */
 var SEATN=BANDS;
 var SEATC=SEATN.map(function(n){return hx(PAL[n]);});
 var AX=CHILD;
 /* Seven seats, nine patterns: Sacral, Solar and Heart each carry two. The
    second in a seat takes a sibling of its seat colour, searched so that no two
    of the nine sit closer than 22 in CIELAB: Disgust is the darker earth of
    Sacral, Anticipation the paler sand of Solar, Surprise the cooler aqua of
    Heart. */
 var SIBLING={Disgust:'#AD613B',Anticipation:'#DAC99D',Surprise:'#74D5CB'};
 var PCOL=AX.map(function(a){return hx(SIBLING[a.nm]||PAL[a.seat]);});
 /* how each mask idles, in seconds a cycle: the Child's slow fold, the
    Ideological's long sweep of the moment going round */
 var PER={Child:2.6,Preteen:3.3,Teen:1.8,Adult:4.2,Ideological:7.2};
 function maskDef(nm){for(var i=0;i<MASKS_READ.length;i++)if(MASKS_READ[i].nm===nm)return MASKS_READ[i];return MASKS_READ[0];}
 /* the seats run down the body where the body map seats them, crown at the
    head, root at the pelvis. A pair of patterns in one seat takes the body's
    left and its right. The legs carry Root. */
 var SEATY={Crown:-1.0,'3rd Eye':-.9,Throat:-.72,Heart:-.5,Solar:-.3,Sacral:-.12,Root:.06};
 var PFIELD=AX.map(function(a){var pair=AX.filter(function(b){return b.seat===a.seat;}),idx=pair.indexOf(a);
  return {y:SEATY[a.seat],x:pair.length>1?(idx?.17:-.17):0,sx:pair.length>1?.26:.6,sy:.12};});
 function affs(x,y){var out=PFIELD.map(function(f){return Math.exp(-Math.pow((x-f.x)/f.sx,2)-Math.pow((y-f.y)/f.sy,2));});
  /* below the pelvis everything is Root: the legs hold the ground */
  if(y>.06){var r=Math.min(1,(y-.06)/.2);out[0]=Math.max(out[0],r*1.1);}
  return out;}
 function leadPat(w){var b=0;AX.forEach(function(a,i){if(w[a.nm]>w[AX[b].nm])b=i;});return b;}
 function maskLoad(m,w){return m.b.reduce(function(s,seat){return s+AX.filter(function(a){return a.seat===seat;}).reduce(function(x,a){return Math.max(x,w[a.nm]);},0);},0)/m.b.length;}

 /* ---------- the seat spectrum ----------
    The seven seats are red, orange, yellow, green, cyan, blue, violet, a
    spectrum already. Full spectrum light here is those seven colours and the
    blends between them and nothing else. s runs 0 (root) to 6 (crown). */
 function specAt(s){s=clamp(s,0,5.9999);var i=s|0;return mixc(SEATC[i],SEATC[i+1],s-i);}
 /* where on the rest figure a seat sits. the legs carry Root, so the spectrum
    starts at the feet and has climbed to the sacral seat by the pelvis */
 var SEATYS=[.96,-.12,-.3,-.5,-.72,-.9,-1.04];
 function seatF(y){if(y>=SEATYS[0])return 0;for(var i=0;i<6;i++){if(y>=SEATYS[i+1]){return i+(SEATYS[i]-y)/(SEATYS[i]-SEATYS[i+1]);}}return 6;}

 /* ---------- the person ----------
    One base figure and a pose vector. Nine pattern weights each push the
    vector along their own direction, the mask pulls it toward its own symbol
    by how loaded the mask is, and at zero load every term is zero and the
    vector is REST, a plain calm person. The cost is nine multiply-adds per
    pose key and one forward kinematics pass of about twenty segments. */
 var REST={scale:1,ox:0,oy:0,lean:.012,curl:0,shL:0,shR:0,roll:0,shW:1,headDrop:0,headTurn:0,headTilt:.02,
  a1L:.13,a2L:.09,a1R:.15,a2R:.1,b1L:.05,b2L:.03,b1R:.045,b2R:.02,legShort:0,hipSep:1,neckExt:0,rigid:0,shear:0};
 var KEYS=Object.keys(REST);
 /* each mask's own symbol, as a pose. Child folds and shrinks, Preteen turns
    and checks, Teen thrusts, Adult squares up with the halves a hair apart at
    the waist, Ideological goes rigid and tall. */
 var MASKPOSE={
  Child:{scale:.64,curl:.95,roll:.6,shW:.92,headDrop:.9,headTilt:.0,lean:0,a1L:.22,a2L:-2.05,a1R:.22,a2R:-2.05,b1L:.1,b2L:-.06,b1R:.1,b2R:-.06,legShort:.34,hipSep:.82},
  Preteen:{lean:.07,shL:.1,shR:-.35,headTurn:1,headTilt:.22,headDrop:.12,roll:.2,a1L:.3,a2L:.15,a1R:1,a2R:-2.5,b1L:-.03,hipSep:.95},
  Teen:{lean:-.17,shW:1.16,shL:.1,headDrop:-.55,headTilt:-.12,a1L:1.5,a2L:1.52,a1R:.75,a2R:.3,b1L:.2,b2L:.1,b1R:.14,b2R:-.08,hipSep:1.15,legShort:.08},
  Adult:{lean:.03,shW:1.1,shear:.3,headDrop:.22,headTilt:.03,roll:-.1,shL:.05,shR:-.05,a1L:.14,a2L:.08,a1R:.42,a2R:-1.5,b1L:.04,b1R:.04,hipSep:1.0},
  Ideological:{lean:0,curl:-.4,shW:1.2,roll:-.4,shL:.25,shR:.25,headDrop:-.4,headTilt:0,neckExt:.05,a1L:.0,a2L:.0,a1R:.0,a2R:.0,b1L:0,b2L:0,b1R:0,b2R:0,hipSep:.7,rigid:1}};
 /* what each pattern does to a body, as a push on the same vector. Indexed as
    CHILD is: Fear, Anger, Shame, Disgust, Apathy, Shock, Sad, Surprise,
    Anticipation. */
 var PATD=[
  {roll:.35,shL:.5,shR:.5,headDrop:.3,scale:-.05,a1L:-.08,a1R:-.08,legShort:.05},
  {shW:.16,shL:.7,shR:.7,headDrop:-.6,a1L:.25,a1R:.25,a2L:.2,a2R:.2,lean:-.03},
  {curl:.4,headDrop:.8,roll:.35,shL:.2,shR:.2,scale:-.04},
  {lean:.07,headTurn:-.8,a1R:.6,a2R:-.7,headTilt:-.12},
  {curl:.2,shL:-.7,shR:-.7,headDrop:.45,headTilt:.1,a1L:-.06,a2L:-.08,a1R:-.06,a2R:-.08,legShort:.02},
  {a1L:1,a1R:1,a2L:.9,a2R:.9,b1L:.1,b1R:.1,headDrop:-.5,hipSep:.15},
  {headDrop:.9,curl:.3,shL:-.4,shR:-.4},
  {a1L:.6,a1R:.6,headDrop:-.7,shL:.3,shR:.3},
  {lean:-.07,a1L:.2,a1R:.2,b1L:-.04,b1R:.07,headDrop:-.15}];
 /* weights to a target pose. w is the nine weights, 0 to 10, by pattern name. */
 function mixPose(maskNm,w){
  var M=maskDef(maskNm),ws=AX.map(function(a){return w[a.nm]||0;});
  var mxw=Math.max.apply(null,ws),L=clamp(mxw/9,0,1);
  var m=clamp(maskLoad(M,w)/6.5,0,1);
  var ss=0;ws.forEach(function(v){ss+=v*v;});
  var p={};KEYS.forEach(function(k){p[k]=REST[k];});
  var T=MASKPOSE[M.nm];
  for(var k in T)p[k]+=m*(T[k]-REST[k]);
  if(ss>0)ws.forEach(function(v,i){var sh=v*v/ss*L*1.7;if(sh<=0)return;var d=PATD[i];for(var k2 in d)p[k2]+=sh*d[k2];});
  return {p:p,m:m,L:L};}

 /* the forward kinematics. figure units: y down, head top about -0.99, feet about 0.97 */
 function buildFig(p){
  var sl=p.lean,u=[Math.sin(sl),-Math.cos(sl)],v=[Math.cos(sl),Math.sin(sl)];
  var P=[0,0],Ls=.64*(1-.32*p.curl);
  var SHV=[v[0]*p.shear,v[1]*p.shear];   /* the upper half slides off the lower one at the waist */
  var nb=[P[0]+u[0]*Ls+SHV[0],P[1]+u[1]*Ls+SHV[1]];
  var S0=[nb[0]-u[0]*.04,nb[1]-u[1]*.04+p.curl*.02];
  var nl=.07+p.neckExt-.04*p.curl;
  var nt=[nb[0]+u[0]*nl,nb[1]+u[1]*nl];
  var th=p.headTilt+sl;
  var Hc=[nt[0]+Math.sin(th)*.12+p.headTurn*.06,nt[1]-Math.cos(th)*.12+p.headDrop*.095];
  var hw=.205*p.shW*(1-.4*p.roll);
  var SL=[S0[0]-v[0]*hw,S0[1]-v[1]*hw-p.shL*.085],SR=[S0[0]+v[0]*hw,S0[1]+v[1]*hw-p.shR*.085];
  var arm=function(S,s,a1,a2){var E=[S[0]+s*Math.sin(a1)*.27,S[1]+Math.cos(a1)*.27];var W=[E[0]+s*Math.sin(a2)*.25,E[1]+Math.cos(a2)*.25];return [E,W];};
  var aL=arm(SL,-1,p.a1L,p.a2L),aR=arm(SR,1,p.a1R,p.a2R),EL=aL[0],WL=aL[1],ER=aR[0],WR=aR[1];
  var HL=[P[0]-v[0]*.085*p.hipSep,P[1]-v[1]*.085*p.hipSep],HR=[P[0]+v[0]*.085*p.hipSep,P[1]+v[1]*.085*p.hipSep];
  var lt=.47*(1-.35*p.legShort),ls=.45*(1-.3*p.legShort);
  var leg=function(H,s,b1,b2){var K=[H[0]+s*Math.sin(b1)*lt,H[1]+Math.cos(b1)*lt];var A=[K[0]+s*Math.sin(b2)*ls,K[1]+Math.cos(b2)*ls];return [K,A];};
  var lL=leg(HL,-1,p.b1L,p.b2L),lR=leg(HR,1,p.b1R,p.b2R),KL=lL[0],AL=lL[1],KR=lR[0],AR=lR[1];
  var mid1=[P[0]+u[0]*Ls*.5+SHV[0]*.8,P[1]+u[1]*Ls*.5+SHV[1]*.8],mid2=[P[0]+u[0]*Ls*.16+SHV[0]*.3,P[1]+u[1]*Ls*.16+SHV[1]*.3];
  var C=[];
  var cap=function(a,b,ra,rb,id){C.push({ax:a[0],ay:a[1],bx:b[0],by:b[1],ra:ra,rb:rb,id:id});};
  var disc=function(c,rx,ry,rot,id){C.push({ax:c[0],ay:c[1],bx:c[0],by:c[1],ra:rx,rb:ry,rot:rot||0,disc:1,id:id});};
  disc(Hc,.104,.126,th,'head');
  cap(nb,nt,.044,.039,'neck');
  cap(S0,mid1,.205*Math.min(1.1,p.shW)*(1-.1*p.roll),.165,'chest');
  cap(mid1,mid2,.165,.146,'belly');
  cap(mid2,P,.146,.158,'pelvis');
  cap(S0,SL,.075,.058,'shL');cap(S0,SR,.075,.058,'shR');
  cap(SL,EL,.056,.047,'uaL');cap(EL,WL,.047,.036,'faL');
  cap(SR,ER,.056,.047,'uaR');cap(ER,WR,.047,.036,'faR');
  var hl=[WL[0]+(WL[0]-EL[0])*.16,WL[1]+(WL[1]-EL[1])*.16],hr=[WR[0]+(WR[0]-ER[0])*.16,WR[1]+(WR[1]-ER[1])*.16];
  disc(hl,.038,.044,0,'hL');disc(hr,.038,.044,0,'hR');
  cap(HL,KL,.094,.066,'thL');cap(KL,AL,.064,.042,'shnL');
  cap(HR,KR,.094,.066,'thR');cap(KR,AR,.064,.042,'shnR');
  cap([AL[0]-.03,AL[1]+.018],[AL[0]-.07,AL[1]+.018],.03,.03,'ftL');cap([AR[0]+.03,AR[1]+.018],[AR[0]+.07,AR[1]+.018],.03,.03,'ftR');
  /* ground the figure, scale it about the feet, move it */
  var gy=.955-Math.max(AL[1],AR[1])-.02;
  var Qx=0,Qy=.955,s=p.scale;
  C.forEach(function(c){c.ax=Qx+(c.ax-Qx)*s+p.ox;c.ay=Qy+(c.ay+gy-Qy)*s+p.oy;c.bx=Qx+(c.bx-Qx)*s+p.ox;c.by=Qy+(c.by+gy-Qy)*s+p.oy;
   c.ra*=s;c.rb*=s;});
  var J=function(n){return [Qx+(n[0]-Qx)*s+p.ox,Qy+(n[1]+gy-Qy)*s+p.oy];};
  return {caps:C,J:{m1:J(mid1),m2:J(mid2),nt:J(nt),head:J(Hc),SL:J(SL),SR:J(SR),EL:J(EL),ER:J(ER),WL:J(WL),WR:J(WR),P:J(P),S0:J(S0),KL:J(KL),KR:J(KR),AL:J(AL),AR:J(AR)},scale:s};}
 /* signed distance to a capsule or disc, negative inside */
 function capD(c,x,y){
  if(c.disc){var ca=Math.cos(c.rot),sa=Math.sin(c.rot),dx=x-c.ax,dy=y-c.ay;
   var lx=(dx*ca+dy*sa)/c.ra,ly=(-dx*sa+dy*ca)/c.rb;return (Math.hypot(lx,ly)-1)*Math.min(c.ra,c.rb);}
  var bx=c.bx-c.ax,by=c.by-c.ay,l2=bx*bx+by*by,t=l2?((x-c.ax)*bx+(y-c.ay)*by)/l2:0;t=t<0?0:t>1?1:t;
  var px=c.ax+bx*t-x,py=c.ay+by*t-y;return Math.sqrt(px*px+py*py)-(c.ra+(c.rb-c.ra)*t);}
 /* the smooth union of the whole figure. A box round each part is made once
    per figure, so a point far from any part costs a handful of comparisons and
    not twenty distance tests. The heat map asks this for every cell. */
 function figBoxes(F){if(F.bb)return F.bb;var pad=.05,X0=9,X1=-9,Y0=9,Y1=-9;
  F.bb=F.caps.map(function(c){var r=Math.max(c.ra,c.rb)+pad,rr=c.disc?Math.max(c.ra,c.rb)+pad:r;
   var b=[Math.min(c.ax,c.bx)-rr,Math.max(c.ax,c.bx)+rr,Math.min(c.ay,c.by)-rr,Math.max(c.ay,c.by)+rr];
   X0=Math.min(X0,b[0]);X1=Math.max(X1,b[1]);Y0=Math.min(Y0,b[2]);Y1=Math.max(Y1,b[3]);return b;});
  F.box=[X0,X1,Y0,Y1];return F.bb;}
 function figD(F,x,y,k){k=k||.035;var bb=figBoxes(F),B=F.box;if(x<B[0]-.06||x>B[1]+.06||y<B[2]-.06||y>B[3]+.06)return .3;
  var d=9,C=F.caps;
  for(var i=0;i<C.length;i++){var b=bb[i];if(x<b[0]||x>b[1]||y<b[2]||y>b[3])continue;
   var e=capD(C[i],x,y),h=Math.max(k-Math.abs(d-e),0)/k;d=Math.min(d,e)-h*h*k*.25;}
  return d>8?.3:d;}

 /* ---------- the body, sampled ----------
    The person is a volume of points: each is a place on one of the figure's
    twenty segments, given once, so a pose moves all of them and a frame never
    searches. A point keeps the place it had on the rest figure (s0, its seat
    position, 0 at the feet and 6 at the crown) so its colour follows the body
    part and not the posture: a head folded down into a Child is still violet. */
 var MOTV=[ /* what a loose point of each pattern does, over one cycle of its own period */
  {per:2.4,v:function(x,y){return [-x*.4,-y*.2];}},{per:2.2,v:function(x,y,r){return [Math.sin(r*40)*.1,-.45-.5*r];}},{per:5.2,v:function(x,y){return [-x*.15,.4];}},
  {per:3.4,v:function(x,y){return [(x<0?-1:1)*.34,.03];}},{per:9,v:function(x,y){return [0,.08];}},{per:1.6,v:function(x,y){return [x*1.3+.05,(y+.3)*1.1];}},
  {per:4.2,v:function(x,y,r){return [0,.5+.4*r];}},{per:3,v:function(x,y){return [x*.8,(y+.4)*.5];}},{per:3.2,v:function(){return [.26,-.36];}}];
 function bodySample(N,seed){
  var F=buildFig(REST),rnd=rng(seed||21),C=F.caps;
  var ar=C.map(function(c){if(c.disc)return Math.PI*c.ra*c.rb;var l=Math.hypot(c.bx-c.ax,c.by-c.ay);return l*(c.ra+c.rb)+Math.PI*(c.ra*c.ra+c.rb*c.rb)*.5;});
  var tot=ar.reduce(function(a,b){return a+b;},0);
  var A={n:0,cap:new Int16Array(N),u:new Float32Array(N),o:new Float32Array(N),lum:new Float32Array(N),s0:new Float32Array(N),
   pat:new Int8Array(N),keep:new Float32Array(N),del:new Float32Array(N),mv:new Uint8Array(N),dvx:new Float32Array(N),dvy:new Float32Array(N),
   sx:new Float32Array(N),sy:new Float32Array(N),ph:new Float32Array(N)};
  var L3=[-.5,-.6,.62],ln=Math.hypot(L3[0],L3[1],L3[2]),Ld=L3.map(function(v){return v/ln;});
  var n=0;
  for(var ci=0;ci<C.length;ci++){var c=C[ci],cnt=ci===C.length-1?N-n:Math.round(N*ar[ci]/tot);
   for(var j=0;j<cnt&&n<N;j++,n++){
    var u,o,x,y,nx=0,ny=0,z,edge=rnd()<.2;
    if(c.disc){var th=rnd()*6.283,rho=edge?.9+.1*rnd():Math.sqrt(rnd())*.95;u=th;o=rho;
     var lx=Math.cos(th)*rho,ly=Math.sin(th)*rho;nx=lx;ny=ly;z=Math.sqrt(Math.max(0,1-rho*rho));
     var ca=Math.cos(c.rot),sa=Math.sin(c.rot);x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
    else{u=rnd();o=edge?(rnd()<.5?-1:1)*(.9+.1*rnd()):(rnd()*2-1)*.95;
     var dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1,rx=-dy/l,ry=dx/l,r=c.ra+(c.rb-c.ra)*u;
     x=c.ax+dx*u+rx*o*r;y=c.ay+dy*u+ry*o*r;nx=rx*o;ny=ry*o;z=Math.sqrt(Math.max(0,1-o*o));}
    var dot=nx*Ld[0]+ny*Ld[1]+z*Ld[2];
    A.cap[n]=ci;A.u[n]=u;A.o[n]=o;
    A.lum[n]=clamp(.28+.72*clamp(.3+.7*dot,0,1),0,1)*(edge?1.18:1);
    A.s0[n]=seatF(y);rnd();rnd();rnd();
    /* the pattern is the one whose place on the body this is, drawn by chance in proportion to its claim */
    var af=affs(x,y),s=0,wt=af.map(function(v){var q=v*v+.002;s+=q;return q;}),rr=rnd()*s,p=0;for(;p<8;p++){rr-=wt[p];if(rr<=0)break;}
    A.pat[n]=p;A.keep[n]=rnd();A.del[n]=rnd()*.55;A.ph[n]=rnd();
    var mvp=rnd()<.065;A.mv[n]=mvp?1:0;if(mvp){var mm=MOTV[p].v(x,y,rnd());A.dvx[n]=mm[0]*(.6+rnd()*.7);A.dvy[n]=mm[1]*(.6+rnd()*.7);}
    var a=rnd()*6.283,d=.5+rnd()*1.0;A.sx[n]=Math.cos(a)*d*.9;A.sy[n]=Math.sin(a)*d*1.1;}}
  A.n=n;return A;}
 /* the per segment frame, once per frame: the direction along it and the normal to it */
 function segFrames(C){return C.map(function(c){if(c.disc)return null;var dx=c.bx-c.ax,dy=c.by-c.ay,l=Math.hypot(dx,dy)||1;return {dx:dx,dy:dy,nx:-dy/l,ny:dx/l};});}
 /* where point i is now, in figure units. kc pulls it toward its segment's
    axis, and that is what compressed looks like. Everything a pattern adds (the
    loose points that drift off, the tremble of Fear) is added here, and the
    arrival scatter, so a page opens as a gathering. */
 var _xy=[0,0,1];
 function bodyXY(sc,A,C,cp,i,kc,intro){
  var c=C[A.cap[i]],x,y;
  if(c.disc){var th=A.u[i],rho=A.o[i]*kc,lx=Math.cos(th)*rho,ly=Math.sin(th)*rho,ca=Math.cos(c.rot),sa=Math.sin(c.rot);
   x=c.ax+(lx*ca*c.ra-ly*sa*c.rb);y=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
  else{var q=cp[A.cap[i]],u=A.u[i],r=(c.ra+(c.rb-c.ra)*u)*kc;x=c.ax+q.dx*u+q.nx*A.o[i]*r;y=c.ay+q.dy*u+q.ny*A.o[i]*r;}
  var t=sc.t,p=A.pat[i],pcq=sc.pc[p];_xy[2]=1;
  if(A.mv[i]){var per=MOTV[p].per,f=((t/per)+A.ph[i])%1,amp=Math.pow(pcq,1.2);x+=A.dvx[i]*f*amp;y+=A.dvy[i]*f*amp;
   _xy[2]=Math.pow(Math.sin(f*Math.PI),.8)*1.5*Math.min(1,.2+amp*1.2);}
  x+=Math.sin(t*.9+i*.37)*.0035;y+=Math.cos(t*.8+i*.53)*.0035;
  if(sc.lead===0&&pcq>.2)x+=Math.sin(t*37+i*1.7)*.004*pcq;      /* Fear trembles */
  if(intro){var e=sstep(0,1.15,t-A.del[i]);x=A.sx[i]+(x-A.sx[i])*e;y=A.sy[i]+(y-A.sy[i])*e;_xy[2]*=.8+.2*e;}
  _xy[0]=x;_xy[1]=y;return _xy;}

 /* ---------- batches: a point or a line drawn in as few state changes as possible ----------
    A point is a place, a colour bin (hue) and a level (how bright). Points
    are counted into bins and drawn bin by bin, so a frame costs one fill style
    per bin and not one per point. */
 function Batch(nmax,nh,nl){this.n=0;this.nh=nh;this.nl=nl;this.x=new Float32Array(nmax);this.y=new Float32Array(nmax);this.b=new Uint16Array(nmax);this.s=new Float32Array(nmax);
  this.cnt=new Int32Array(nh*nl+1);this.ord=new Int32Array(nmax);this.pos=new Int32Array(nh*nl+1);this.max=nmax;}
 Batch.prototype.reset=function(){this.n=0;};
 Batch.prototype.add=function(x,y,h,l,sz){if(this.n>=this.max)return;var i=this.n++;this.x[i]=x;this.y[i]=y;this.b[i]=h*this.nl+l;this.s[i]=sz;};
 Batch.prototype.flush=function(g,d,COLS,ALPHA,SIZE,base){var n=this.n,nb=this.nh*this.nl,cnt=this.cnt;cnt.fill(0);
  for(var i=0;i<n;i++)cnt[this.b[i]+1]++;
  for(i=0;i<nb;i++)cnt[i+1]+=cnt[i];
  var pos=this.pos;for(i=0;i<=nb;i++)pos[i]=cnt[i];
  var ord=this.ord;for(i=0;i<n;i++)ord[pos[this.b[i]]++]=i;
  for(var b=0;b<nb;b++){var a=cnt[b],e=cnt[b+1];if(a===e)continue;var h=(b/this.nl)|0,l=b%this.nl;
   var al=ALPHA[l];if(al<.01)continue;g.globalAlpha=al>1?1:al;g.fillStyle=COLS[h][l];
   var sz=base*SIZE[l];
   for(var j=a;j<e;j++){var k=ord[j],s=sz*this.s[k];g.fillRect((this.x[k]-s/2)*d,(this.y[k]-s/2)*d,s*d,s*d);}}
  g.globalAlpha=1;};
 /* a run of line segments, drawn bin by bin and level by level so a frame is a
    couple of hundred strokes and not three thousand */
 function LineBatch(nmax,nb,nl){this.n=0;this.nb=nb;this.nl=nl;this.x0=new Float32Array(nmax);this.y0=new Float32Array(nmax);this.x1=new Float32Array(nmax);this.y1=new Float32Array(nmax);
  this.b=new Uint16Array(nmax);this.cnt=new Int32Array(nb*nl+1);this.ord=new Int32Array(nmax);this.pos=new Int32Array(nb*nl+1);this.max=nmax;}
 LineBatch.prototype.reset=function(){this.n=0;};
 LineBatch.prototype.add=function(x0,y0,x1,y1,bin,l){if(this.n>=this.max)return;var i=this.n++;this.x0[i]=x0;this.y0[i]=y0;this.x1[i]=x1;this.y1[i]=y1;this.b[i]=bin*this.nl+l;};
 LineBatch.prototype.flush=function(g,d,COLS,ALPHA,WID,wscale){var n=this.n,nb=this.nb*this.nl,cnt=this.cnt;cnt.fill(0);
  for(var i=0;i<n;i++)cnt[this.b[i]+1]++;for(i=0;i<nb;i++)cnt[i+1]+=cnt[i];var pos=this.pos;for(i=0;i<=nb;i++)pos[i]=cnt[i];
  var ord=this.ord;for(i=0;i<n;i++)ord[pos[this.b[i]]++]=i;
  g.lineCap='round';
  for(var b=0;b<nb;b++){var a=cnt[b],e=cnt[b+1];if(a===e)continue;var h=(b/this.nl)|0,l=b%this.nl;
   g.globalAlpha=ALPHA[l];g.strokeStyle=COLS[h][l];g.lineWidth=WID[l]*wscale*d;g.beginPath();
   for(var j=a;j<e;j++){var k=ord[j];g.moveTo(this.x0[k]*d,this.y0[k]*d);g.lineTo(this.x1[k]*d,this.y1[k]*d);}g.stroke();}
  g.globalAlpha=1;};

 /* ---------- the air ----------
    A low resolution colour field, computed from the cloud, that every glow and
    every torus point reads its colour from: "make the glow pixels the color of
    the air, of their sampled area." Once every third frame:
      1. a grid of 48 by 51 cells covers the figure and the torus, 3.2 by 3.4
         figure units.
      2. a quarter of the body points are splatted into the cell they sit in,
         each carrying its own colour and weighted by how bright it is.
      3. the grid is blurred, a box of radius three, twice each way, so the
         colour of a region leaks into the air about a fifth of a unit round it.
      4. the ambient is laid under it: at each height the seat spectrum for
         that height, drawn toward ember where that height is not lit yet at
         this coherence. The cloud wins near the body and the spectrum far from it.
      5. each cell is normalised to a bright version of itself and snapped to
         one of 343 colours, so a frame can batch by colour. */
 var QB=7, NBIN=QB*QB*QB;
 function binOf(r,g,b){var a=(r*QB/256)|0,c=(g*QB/256)|0,d=(b*QB/256)|0;if(a>=QB)a=QB-1;if(c>=QB)c=QB-1;if(d>=QB)d=QB-1;return a*QB*QB+c*QB+d;}
 var BINRGB=(function(){var a=[];for(var i=0;i<NBIN;i++){var r=(i/(QB*QB))|0,g=((i/QB)|0)%QB,b=i%QB;a.push([(r+.5)*256/QB,(g+.5)*256/QB,(b+.5)*256/QB]);}return a;})();
 function boxH(s,d,W,H,r){var n=2*r+1;for(var y=0;y<H;y++){var b=y*W*4;for(var c=0;c<4;c++){var sum=0;for(var x=0;x<=r&&x<W;x++)sum+=s[b+x*4+c];
  for(x=0;x<W;x++){d[b+x*4+c]=sum/n;var xa=x+r+1,xr=x-r;if(xa<W)sum+=s[b+xa*4+c];if(xr>=0)sum-=s[b+xr*4+c];}}}}
 function boxV(s,d,W,H,r){var n=2*r+1,st=W*4;for(var x=0;x<W;x++){for(var c=0;c<4;c++){var b=x*4+c,sum=0;for(var y=0;y<=r&&y<H;y++)sum+=s[b+y*st];
  for(y=0;y<H;y++){d[b+y*st]=sum/n;var ya=y+r+1,yr=y-r;if(ya<H)sum+=s[b+ya*st];if(yr>=0)sum-=s[b+yr*st];}}}}
 function Air(){this.GW=48;this.GH=51;this.X0=-1.6;this.Y0=-1.7;this.inv=48/3.2;var n=this.GW*this.GH;
  this.acc=new Float32Array(n*4);this.tmp=new Float32Array(n*4);this.bin=new Uint16Array(n);this.rgb=new Float32Array(n*3);this.lum=new Float32Array(n);this.amb=new Float32Array(this.GH*3);}
 Air.prototype.clear=function(){this.acc.fill(0);};
 Air.prototype.splat=function(x,y,r,g,b,w){var ix=((x-this.X0)*this.inv)|0,iy=((y-this.Y0)*this.inv)|0;if(ix<0||iy<0||ix>=this.GW||iy>=this.GH)return;
  var o=(iy*this.GW+ix)*4,a=this.acc;a[o]+=r*w;a[o+1]+=g*w;a[o+2]+=b*w;a[o+3]+=w;};
 /* the ambient, one colour per row of the grid */
 Air.prototype.ambient=function(c){var A=this.amb;for(var y=0;y<this.GH;y++){var yf=this.Y0+(y+.5)/this.inv,sf=seatF(yf),lit=charLit(sf,c);
  var col=mixc(EMBER,specAt(sf),.2+.8*lit);A[y*3]=col[0];A[y*3+1]=col[1];A[y*3+2]=col[2];}};
 Air.prototype.finish=function(wa){var W=this.GW,H=this.GH,a=this.acc,t=this.tmp;
  boxH(a,t,W,H,3);boxV(t,a,W,H,3);boxH(a,t,W,H,3);boxV(t,a,W,H,3);
  for(var y=0;y<H;y++){var ar=this.amb[y*3],ag=this.amb[y*3+1],ab=this.amb[y*3+2];
   for(var x=0;x<W;x++){var i=y*W+x,o=i*4,w=a[o+3],r=a[o]+wa*ar,g=a[o+1]+wa*ag,b=a[o+2]+wa*ab,s=w+wa;r/=s;g/=s;b/=s;
    var m=Math.max(r,g,b)||1,k=236/m;r*=k;g*=k;b*=k;this.rgb[i*3]=r;this.rgb[i*3+1]=g;this.rgb[i*3+2]=b;this.lum[i]=w/s;this.bin[i]=binOf(r,g,b);}}};
 /* the cell a figure-unit point sits in, clamped to the grid */
 Air.prototype.cell=function(x,y){var ix=((x-this.X0)*this.inv)|0,iy=((y-this.Y0)*this.inv)|0;if(ix<0)ix=0;else if(ix>=this.GW)ix=this.GW-1;if(iy<0)iy=0;else if(iy>=this.GH)iy=this.GH-1;return iy*this.GW+ix;};
 Air.prototype.binAt=function(x,y){return this.bin[this.cell(x,y)];};
 Air.prototype.rgbAt=function(x,y){var i=this.cell(x,y)*3;return [this.rgb[i],this.rgb[i+1],this.rgb[i+2]];};
 /* colour tables for batched drawing. Five levels of brightness: the colour is
    the sampled one, the level sets alpha and a little white. */
 var AQ=[.16,.3,.46,.66,.86],WQ=[0,0,.05,.14,.26],SQ5=[.82,.95,1.08,1.25,1.45],LWQ=[.9,1,1.15,1.3,1.5];
 var COLQ=BINRGB.map(function(c){return AQ.map(function(a,l){return css(mixc(c,INK,WQ[l]),1);});});

 /* ---------- the 112 addresses, and where they sit ----------
    addrField() is the engine's table. Where a point sits is a drawing decision
    and no engine number depends on it, so the placing is here: a hash of the
    address number gives its angle round the spine, its distance and a small
    offset along the axis, and the same address is in the same place on every
    visit and on every person. Each point orbits the spine at the height of its
    seat. The four anchors have no orbit: two sit on the axis above the head
    and two below the feet, where the flow enters and leaves. */
 var SEATBAND=[[.06,.95],[-.2,-.04],[-.38,-.22],[-.6,-.4],[-.8,-.66],[-.97,-.84],[-1.17,-.98]];
 var ADDR=null, BYSEAT=null;
 function addrInit(){if(ADDR)return;
  var F=addrField(),idx={};BANDS.forEach(function(b,k){idx[b]=k;});
  ADDR=F.map(function(a){var i=a.i,seat=idx[a.seat],bd=SEATBAND[seat];
   return {i:i,k:a.name,b:a.field?(a.above?'Above the head':'Below the feet'):a.seat,plex:a.plexus,c:a.channel,seat:seat,fld:a.field,above:a.above,
    a0:hash(i,63)*6.2832,rr:hash(i,64),yr:a.field?0:bd[0]+(bd[1]-bd[0])*hash(i,62),ax:(hash(i,65)*2-1)*.17};});
  BYSEAT=[0,1,2,3,4,5,6].map(function(k){return ADDR.map(function(a,j){return a.seat===k&&!a.fld?j:-1;}).filter(function(j){return j>=0;});});}
 /* the body's own spine, as a polyline from the feet to the head, in the
    current pose and in the rest pose, so a seat height on the rest figure can
    be carried to wherever that seat is now. */
 var RJ=buildFig(REST).J,RESTRY=[(RJ.AL[1]+RJ.AR[1])/2,RJ.P[1],RJ.m2[1],RJ.m1[1],RJ.S0[1],RJ.nt[1],RJ.head[1]];
 function spineNow(sc){var J=sc.fig.J,sp=sc.sp||(sc.sp={x:new Float32Array(7),y:new Float32Array(7),ry:RESTRY});
  var n=[[(J.AL[0]+J.AR[0])/2,(J.AL[1]+J.AR[1])/2],J.P,J.m2,J.m1,J.S0,J.nt,J.head];for(var i=0;i<7;i++){sp.x[i]=n[i][0];sp.y[i]=n[i][1];}return sp;}
 var _sp=[0,0,0,0];
 function spineAt(sp,yr,o){var ry=sp.ry,i=0;while(i<5&&yr<ry[i+1])i++;var f=(yr-ry[i])/(ry[i+1]-ry[i]);
  var dx=sp.x[i+1]-sp.x[i],dy=sp.y[i+1]-sp.y[i],l=Math.hypot(dx,dy)||1;o[0]=sp.x[i]+dx*f;o[1]=sp.y[i]+dy*f;o[2]=dx/l;o[3]=dy/l;}
 var RBW=[[-1.2,.0],[-1.0,.1],[-.88,.11],[-.8,.06],[-.74,.17],[-.6,.28],[-.4,.25],[-.2,.21],[0,.23],[.2,.22],[.9,.2],[1.0,.12]];
 function halfW(y){if(y<=RBW[0][0])return RBW[0][1];for(var i=0;i<RBW.length-1;i++){var a=RBW[i],b=RBW[i+1];if(y<=b[0])return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]);}return .12;}
 /* where address a is now, in figure units: x, y and z (toward the viewer is positive) */
 function addrXY(sc,a,orb,o){var F=sc.fig;
  if(a.fld){var hd=F.J.head,idx=a.i-109;/* 109 Sol Star, 110 Stellar Gateway, 111 Earth Star, 112 Gaia Gateway */
   var ys=[-1.2,-1.35,1.08,1.25];o[0]=(idx<2?hd[0]:0)*.6+.01*Math.sin(sc.t*.5+idx);o[1]=ys[idx];o[2]=0;return o;}
  spineAt(sc.sp,a.yr,_sp);var tx=_sp[2],ty=_sp[3],nx=-ty,ny=tx;
  var r=halfW(a.yr)*F.scale+.1+.3*a.rr,ang=a.a0+orb;
  o[0]=_sp[0]+nx*r*Math.cos(ang);o[1]=_sp[1]+ny*r*Math.cos(ang)+r*.16*Math.sin(ang);o[2]=Math.sin(ang);return o;}

 /* ---------- the charge map: where the cloud is dense ----------
    Each frame every somatic address splats a soft bump at its place on the
    body, as tall as its charge, into a 26 by 46 map. A point of the cloud looks
    up the map at its own resting place and keeps itself in proportion: a
    region with heavy addresses is dense and bright and a region with none thins
    to a quarter. THIS IS HOW THE MASK ANSWERS THE STORIES. The sniffer writes
    the channel charges out of what a person writes, compute() turns them into
    NODES[i].sq, and this map is that and nothing else. */
 /* the seventeenth bin is DIMMED: a point a saboteur is dimming loses its
    colour to a cold grey a step darker than the unlit ember, so the place reads
    as light taken away and not as a different colour of light (round RB) */
 var NHB=17,HDIM=16,NLB=6,ALB=[.1,.2,.36,.56,.78,.95],WHB=[0,0,.04,.12,.24,.4],SZB=[.85,.95,1.05,1.15,1.28,1.45];
 var RBASE=(function(){var a=[];for(var h=0;h<NHB;h++)a.push(h===HDIM?[96,102,116]:h<9?mixc([178,186,202],PCOL[h],.4):mixc(EMBER,specAt(h-9),.85));return a;})();
 var COLSB=RBASE.map(function(base){return WHB.map(function(w){return css(mixc(base,INK,w),1);});});
 var CMW=26,CMH=46,CMX0=-.65,CMY0=-1.2,CMS=20;   /* 26 by 46 cells of 0.05 */
 function restXY(A,C,cp,i,o){var c=C[A.cap[i]];
  if(c.disc){var th=A.u[i],rho=A.o[i],lx=Math.cos(th)*rho,ly=Math.sin(th)*rho,ca=Math.cos(c.rot),sa=Math.sin(c.rot);o[0]=c.ax+(lx*ca*c.ra-ly*sa*c.rb);o[1]=c.ay+(lx*sa*c.ra+ly*ca*c.rb);}
  else{var q=cp[A.cap[i]],u=A.u[i],r=c.ra+(c.rb-c.ra)*u;o[0]=c.ax+q.dx*u+q.nx*A.o[i]*r;o[1]=c.ay+q.dy*u+q.ny*A.o[i]*r;}}
 function buildCM(sc){var M=sc.mem.CM;M.fill(0);
  for(var j=0;j<112;j++){var a=ADDR[j];if(a.fld)continue;var ch=sc.ach[j];if(ch<.01)continue;
   var sy=a.seat===0?.16:.075,sx=.1,cxn=(a.ax-CMX0)*CMS,cyn=(a.yr-CMY0)*CMS,rx=Math.ceil(2.6*sx*CMS),ry=Math.ceil(2.6*sy*CMS);
   var ix=cxn|0,iy=cyn|0;
   for(var y=iy-ry;y<=iy+ry;y++){if(y<0||y>=CMH)continue;var dy=((y+.5)-cyn)/(sy*CMS);
    for(var x=ix-rx;x<=ix+rx;x++){if(x<0||x>=CMW)continue;var dx=((x+.5)-cxn)/(sx*CMS);M[y*CMW+x]+=ch*Math.exp(-dx*dx-dy*dy);}}}
  for(var i=0;i<M.length;i++){var v=M[i]*.55;M[i]=v>1.25?1.25:v;}}
 /* THE DIM MAP, round RB: "I should see in the body where my light is dim ...
    and the saboteurs are dimming it." The same bump, on the same grid, at the
    same place as the charge map, but as tall as the saboteur running at that
    address and not as its charge. A point of the cloud reads it at its resting
    place and loses up to DIMK of its light there, and the heaviest dimming also
    takes its colour (HDIM). So the charge still makes a region dense, and a
    saboteur makes that dense region dark: matter held, light blocked. sc.sab is
    the eased weight, 0 for an address no saboteur runs through. */
 var DIMK=.7;
 function buildDM(sc){var M=sc.mem.DM;M.fill(0);if(!sc.sabAny)return;
  for(var j=0;j<112;j++){var a=ADDR[j];if(a.fld)continue;var s=sc.sab[j];if(s<.01)continue;
   var sy=a.seat===0?.16:.075,sx=.1,cxn=(a.ax-CMX0)*CMS,cyn=(a.yr-CMY0)*CMS,rx=Math.ceil(2.6*sx*CMS),ry=Math.ceil(2.6*sy*CMS);
   var ix=cxn|0,iy=cyn|0;
   for(var y=iy-ry;y<=iy+ry;y++){if(y<0||y>=CMH)continue;var dy=((y+.5)-cyn)/(sy*CMS);
    for(var x=ix-rx;x<=ix+rx;x++){if(x<0||x>=CMW)continue;var dx=((x+.5)-cxn)/(sx*CMS),v=s*Math.exp(-dx*dx-dy*dy),o=y*CMW+x;
     /* the strongest saboteur at a cell sets it, and a second one only adds a
        little: two saboteurs on one place do not make it twice as dark */
     M[o]=M[o]>v?M[o]+.25*v:v+.25*M[o];}}}
  for(var i=0;i<M.length;i++)if(M[i]>1)M[i]=1;}
 function cmAt(sc,x,y){var M=sc.mem.CM,fx=(x-CMX0)*CMS-.5,fy=(y-CMY0)*CMS-.5;if(fx<0)fx=0;if(fy<0)fy=0;if(fx>CMW-1.001)fx=CMW-1.001;if(fy>CMH-1.001)fy=CMH-1.001;
  var ix=fx|0,iy=fy|0,ux=fx-ix,uy=fy-iy,o=iy*CMW+ix;return (M[o]*(1-ux)+M[o+1]*ux)*(1-uy)+(M[o+CMW]*(1-ux)+M[o+CMW+1]*ux)*uy;}
 /* the dim map read the same way, nearest cell: it is smooth already */
 function dmAt(sc,x,y){var ix=((x-CMX0)*CMS)|0,iy=((y-CMY0)*CMS)|0;if(ix<0||iy<0||ix>=CMW||iy>=CMH)return 0;return sc.mem.DM[iy*CMW+ix];}

 /* ---------- the world a mask lives in ----------
    Each mask is a posture and a thing it is held against, and both are drawn in
    points. Child: a huge dim mass above and threads drawn up to it. Preteen:
    dim watchers and a beam sweeping them. Teen: a big mass that takes the blow
    and sparks. Adult: a seam where the halves join and a file of ledger lines
    rising beside it. Ideological: a fixed lattice, a plumb line, and the
    moment going round. Coloured from the air. */
 function worldInit(sc){var r2=rng(77),M=sc.mem;
  M.mass=[];for(var i=0;i<230;i++){var a=r2()*6.283,d=Math.sqrt(r2());M.mass.push({a:a,d:d,s:r2(),v:r2()});}
  M.watch=[[-1.05,-.72],[-.82,-.38],[-1.12,-.1],[-.7,-.95],[-.9,.28],[.82,-.4],[1.05,-.75],[.72,-.97],[1.12,-.05],[.92,.3],[.4,-1.1],[-.42,-1.12]];
  M.lat=[];for(var r=-7;r<=7;r++)for(var c=-4;c<=4;c++){var x=c*.145+(r&1?.0725:0),y=r*.148;if(Math.abs(x)<.62&&Math.abs(y)<1.05)M.lat.push([x,y]);}
  M.strm=[];for(i=0;i<60;i++)M.strm.push({x:(r2()*2-1)*1.35,off:r2(),sp:.09+r2()*.1,wob:r2()*6.28,p:i%5});
  /* the file: seven ledger lines, each a different length, so the stack reads as a record and not a ladder */
  M.file=[];for(i=0;i<8;i++)M.file.push({w:.1+.1*hash(i,11),n:7+((hash(i,12)*6)|0)});}
 function drawWorld(sc,o){var g=sc.g,t=sc.t,k=sc.k,cx=sc.cx,cy=sc.cy,d=sc.dpr,nm=sc.mask,M=sc.mem;
  var mm=Math.pow(sc.m,.8)*sc.fade*(o.k===undefined?1:o.k);if(mm<.02)return;
  var yF=function(py){return (py-cy)/k;};
  if(nm==='Child'){
   /* the one who decides: a huge dim mass above, slow, and a few lines of points drawn up toward it */
   var ox=cx+Math.sin(t*.07)*.08*k,oy=cy-.72*k+Math.sin(t*.11)*.03*k,nc=o.col('mass',-.72,0,(ox-cx)/k);
   sc.glow(ox,oy,1.3*k,nc,.26*mm);
   for(var i=0;i<5;i++){var a=t*.05+i*1.26;sc.glow(ox+Math.cos(a)*.55*k,oy+Math.sin(a)*.2*k-.05*k,.42*k,nc,.1*mm);}
   M.mass.forEach(function(q,i){var e=sstep(0,1.2,sc.t-.2-q.s*.5),rx=.95*q.d*Math.cos(q.a+t*.03*(.5+q.v)),ry=.42*q.d*Math.sin(q.a+t*.03*(.5+q.v));
    sc.dot(ox+rx*k,oy+ry*k,1.6,nc,.4*mm*e*(.5+.5*q.v));});
   var hd=sc.fig.J.head;
   for(var th=0;th<5;th++){var x0=cx+hd[0]*k+(th-2)*.045*k;for(var j=0;j<9;j++){var u=((t*.16+th*.21+j*.045)%1);
    var y=cy+hd[1]*k-u*(cy+hd[1]*k-(oy+.2*k)),x=x0+Math.sin(u*5+th)*.05*k*u,col=o.col('thread',yF(y),.2);
    sc.dot(x,y,1.5,col,mm*(1-u)*.5*sc.pa()*Math.sin(Math.min(1,u*8)*1.57));}}
  }else if(nm==='Preteen'){
   /* the room: dim watchers, and a beam from the head that sweeps across them at the mask's own tempo */
   var hd2=sc.fig.J.head,hx_=cx+hd2[0]*k,hy_=cy+hd2[1]*k,ph=(t/3.3)%1;
   var T=[1.1*Math.sin(Math.PI*2*ph),-.55+.3*Math.cos(Math.PI*4*ph+.8)];
   var tx=cx+T[0]*k,ty=cy+T[1]*k;
   var ang=Math.atan2(ty-hy_,tx-hx_),len=Math.hypot(tx-hx_,ty-hy_)*1.25,half=.2;
   var bc=o.col('beam',hd2[1],.2,hd2[0]+.3);
   g.save();g.globalAlpha=.24*mm;var gr=g.createLinearGradient(hx_*d,hy_*d,tx*d,ty*d);gr.addColorStop(0,css(bc,.55));gr.addColorStop(1,css(bc,0));
   g.fillStyle=gr;g.beginPath();g.moveTo(hx_*d,hy_*d);g.lineTo((hx_+Math.cos(ang-half)*len)*d,(hy_+Math.sin(ang-half)*len)*d);g.lineTo((hx_+Math.cos(ang+half)*len)*d,(hy_+Math.sin(ang+half)*len)*d);g.closePath();g.fill();g.restore();
   [-1,1].forEach(function(sg){for(var j=0;j<26;j++){var u=j/26,r=u*len;sc.dot(hx_+Math.cos(ang+sg*half)*r,hy_+Math.sin(ang+sg*half)*r,1.6,bc,mm*.6*(1-u));}});
   M.watch.forEach(function(w,i){var e=sstep(0,1.2,t-.3-hash(i,5)*.6),wx=cx+(w[0]+Math.sin(t*.21+i)*.015)*k,wy=cy+(w[1]+Math.cos(t*.17+i*2)*.015)*k;
    var dd=Math.hypot(w[0]-T[0],w[1]-T[1]),lit=Math.exp(-dd*dd/.09),pi=i%2?1:4;
    var c=o.col('watch',w[1],lit,w[0]);sc.glow(wx,wy,(.07+.08*lit)*k,c,(.3+.6*lit)*mm*e*sc.pa(pi));sc.dot(wx,wy,2.8+2.4*lit,c,(.7+.3*lit)*mm*e*sc.pa(pi));});
  }else if(nm==='Teen'){
   /* the person it pushes at: a big mass that takes the blow, and the problem, small and dim, left alone */
   var u2=(t/1.8)%1,kick=u2>.18?Math.exp(-(u2-.18)*5):0;
   var mxu=-Math.min(1.22,(cx-10)/k-.42),mx=cx+(mxu+.04*Math.sin(t*.3))*k,my=cy-.08*k,nc2=o.col('mass',-.08,0,mxu);
   sc.glow(mx,my,.85*k,nc2,.18*mm);
   M.mass.forEach(function(q,i){var e=sstep(0,1.2,sc.t-.2-q.s*.5),rx=.42*q.d*Math.cos(q.a),ry=.46*q.d*Math.sin(q.a);
    var near=Math.exp(-Math.pow((rx*k-(.34*k))/(.3*k),2)),dx=-kick*.07*near*k;
    sc.dot(mx+rx*k+dx+Math.sin(t*.8+i)*.8,my+ry*k,1.8,nc2,.5*mm*e*(.5+.5*q.v));});
   var hL=sc.fig.J.WL,fx=cx+(hL[0]-.05)*k,fy=cy+hL[1]*k,col2=o.col('spark',hL[1],.35);
   if(u2>.16&&u2<.8){var tau=(u2-.16)*1.8;for(var j2=0;j2<34;j2++){var a2=Math.PI*(.55+.9*hash(j2,9))+(hash(j2,4)-.5)*.3,sp=.25+.7*hash(j2,6);
    var sx=fx+Math.cos(a2)*sp*tau*k*1.4,sy=fy+Math.sin(a2)*sp*tau*k*1.4+tau*tau*.35*k,al=Math.exp(-tau*2.2);
    sc.dot(sx,sy,1.6+2*hash(j2,7),o.col('spark',yF(sy),.35),al*mm);}
    sc.glow(fx,fy,.14*k,col2,Math.exp(-(u2-.16)*6)*.5*mm);}
   var e2=sstep(0,1.2,t-.5);for(var q2=0;q2<3;q2++)for(var r3=0;r3<2;r3++)sc.dot(cx+(1.0+q2*.05)*k,cy+(-.55+r3*.05)*k,2,EMBER,.28*mm*e2);
  }else if(nm==='Adult'){
   /* the seam, and the file. The two halves of the body are joined and the join
      shows: a line of points across the waist at the height the body actually
      parts, a slow pulse of tension going along it on the mask's own 4.2 second
      beat. Beside it, the cost of having handled it is filed: ledger lines rise
      one at a time. */
   var J=sc.fig.J,sy2=cy+J.m2[1]*k,sx2=cx+J.m2[0]*k,e3=sstep(0,1.3,t-.2),ph3=(t/4.2)%1,sh=sc.P.shear||0;
   for(var j3=0;j3<=64;j3++){var u3=j3/64,x3=(u3*2-1)*.66,pulse=Math.exp(-Math.pow((u3-ph3)/.07,2));
    var yy=J.m2[1]+(x3>0?-.012:.012)*(.5+Math.min(1,Math.abs(sh)*4)),col3=o.col('seam',yy,.1+.5*pulse);
    sc.dot(cx+(J.m2[0]+x3)*k,cy+yy*k,1.5+2.2*pulse,col3,(.3+.7*pulse)*mm*e3*(1-.5*Math.abs(u3*2-1)));}
   sc.glow(sx2+(ph3*2-1)*.66*k,sy2,.1*k,o.col('seam',J.m2[1],.5),.5*mm*e3*sc.pa(2));
   var fx2=cx+(J.m2[0]+.8)*k,fy0=J.m2[1]+.2,nl=Math.max(2,Math.round(2+5*sc.m));
   for(var j4=0;j4<nl+1;j4++){var f=(j4+ph3)/(nl+.01),yy2=fy0-j4*.085-ph3*.085,fade=(j4===0?ph3:1)*(j4>=nl?1-ph3:1)*Math.min(1,e3);
    var L=M.file[j4%M.file.length],col4=o.col('file',yy2,.15+.4*(1-f));
    for(var q3=0;q3<L.n;q3++){var u4=q3/(L.n-1);sc.dot(fx2+(u4-.5)*L.w*k*1.8,cy+yy2*k,1.6,col4,.55*mm*fade*(.6+.4*(1-f)));}}
  }else if(nm==='Ideological'){
   /* a fixed lattice behind a rigid body, a plumb line and a level, and the moment going round it */
   var e4=sstep(0,1.3,t-.2);
   M.lat.forEach(function(q){var sy3=-1.05+((t/7.2)%1)*2.1,lit=1+2.2*Math.exp(-Math.pow((q[1]-sy3)/.06,2));
    sc.dot(cx+q[0]*k,cy+q[1]*k,2.2,o.col('lat',q[1],.1),.42*mm*e4*lit);});
   for(var j5=0;j5<80;j5++){var y5=-1.12+j5*.0275;sc.dot(cx,cy+y5*k,1.2,o.col('lat',y5,.1),.2*mm*e4);}
   for(var j6=0;j6<48;j6++){var x6=-.7+j6*.0292;sc.dot(cx+x6*k,cy-.55*k,1.2,o.col('lat',-.55,.1),.16*mm*e4);sc.dot(cx+x6*k,cy+.52*k,1.2,o.col('lat',.52,.1),.16*mm*e4);}
   M.strm.forEach(function(q,i){var u=(q.off+t*q.sp)%1,y=1.2-u*2.4,x=q.x+Math.sin(t*.6+q.wob)*.02,ax=Math.abs(x);
    if(ax<.58)x=sgn(x||1)*(ax+(.58-ax)*sstep(.0,.58,.58-ax));
    var c=o.col('stream',y,.15);sc.dot(cx+x*k,cy+y*k,1.5,c,.4*mm*e4*sc.pa());
    for(var j=1;j<4;j++)sc.dot(cx+x*k,cy+(y+j*.03)*k,1.2,c,.4*mm*e4*(1-j/4)*.6);});}}
 /* the world, coloured from the air */
 function airWorld(sc){return {k:.12+.88*Math.pow(sc.c,1.1),col:function(role,y,lit,x){var rgb=sc.air.rgbAt(x===undefined?.6:x,y),col=mixc(EMBER,rgb,.3+.7*sc.c);
   if(role==='mass'||role==='lat')col=mixc(EMBER,col,.4);return lit?mixc(col,INK,lit*.55):col;}};}

 /* ---------- the torus, as geometry ----------
    Cubic Bezier paths in three dimensions, projected with perspective and a slow
    turn about the body's axis.

    THE SHAPE. A torus here is a tube swept round the body's vertical axis. Cut
    by a plane through the axis it is two ellipses, one each side, which a flow
    runs round: one side climbs, over the top, and the other falls, under the
    feet. R is the radius of the tube's centre ring, a and b its horizontal and
    vertical half sizes, and the hole is held at .1 so the flow runs inside the
    body. MERIDIANS are loops of constant azimuth, each a closed run of cubic
    Beziers whose anchors sit at the heights of the seats (and a few fillers, so
    the poles round off) and whose handles are the Catmull-Rom ones. RINGS are
    the parallels: a circle at one height, four cubic Beziers, kappa .5523.

    THE SEATS BEND IT. Each seat owns a height and a reach (a gaussian). At that
    height the anchors of every loop are moved by what the seat is, so the
    handles, which are made from the moved anchors, follow. What the seat is
    comes from charSeatState (engine/charfield.js): pinch pulls the radius in to
    a waist, bulge swells an open and whole seat, pull drags a half loaded seat
    sideways. A closed seat also does not animate well: the flow there runs
    slow, flickers in held steps, falls out of step with its neighbours, breaks
    into gaps in runs and radiates short dim rays.

    ROUND PE: THE FLOW IS ONLY A SUGGESTION. The mockup's pulses were the
    brightest thing on the page and read as streaks. They are a broad faint
    swell now, a third of the contrast, and the lamps with tails that rode the
    meridians are gone. What moves the torus is the oscillation, from Vitality. */
 var TY0=-1.7,TY1=1.7,TN=136,TSC=(TN-1)/(TY1-TY0);
 var SEATGY=[.42,-.12,-.30,-.50,-.72,-.90,-1.10],SEATSG=[.30,.12,.12,.13,.13,.12,.14];
 var YSET=[-1.22,-1.10,-.90,-.72,-.50,-.30,-.12,.14,.42,.70,.98];
 var PW=.8,TILT=.30,PD=5.2,RHOMIN=.1,SUB=4,KAP=.5523;
 function hi(y){var q=((y-TY0)*TSC+.5)|0;return q<0?0:q>=TN?TN-1:q;}
 /* the profile of a loop, in (rho, y): a D. The outer side is a full arc from
    the top pole to the bottom pole, both poles on the axis, and the inner side
    is a narrow channel that hugs the axis the whole way down. Spun round the
    axis it is an apple torus, the shape the biofield is drawn as. */
 function profS(v0){return Math.pow(Math.sqrt(Math.max(0,1-v0*v0)),PW);}
 function vnoise(x,y){var xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  var a=hash(xi&255,(yi&255)+3),b=hash((xi+1)&255,(yi&255)+3),c=hash(xi&255,((yi+1)&255)+3),d=hash((xi+1)&255,((yi+1)&255)+3);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
 /* the state of each seat this frame, from the eased charges and the light.
    tgt reads the charges the engine holds now and not the eased ones, which is
    what the trace card wants: a card that names a leak must agree with the
    reading and not with a picture still on its way there. */
 function seatState(sc,tgt){
  var A=tgt?sc.achT:sc.ach,key=tgt?'ssT':'ss',ss=sc[key]||(sc[key]={mean:[0,0,0,0,0,0,0],psi:[],st:null});
  for(var k=0;k<7;k++){var L=BYSEAT[k],s=0;for(var i=0;i<L.length;i++)s+=A[L[i]];ss.mean[k]=s/L.length;ss.psi[k]=hash(k,90)*6.2832;}
  /* the state is rewritten in place, one per key, so the frame's and the card's never overwrite each other */
  ss.st=charSeatState(ss.mean,sc.ig,sc.c,ss.st);
  return ss;}
 /* the same state as a table over height, so a vertex does one lookup and not
    seven gaussians */
 function buildH(sc){var st=sc.ss.st,ss=sc.ss,H=sc.HT||(sc.HT={m:new Float32Array(TN),px:new Float32Array(TN),pz:new Float32Array(TN),lit:new Float32Array(TN),sh:new Float32Array(TN),op:new Float32Array(TN),
   v:new Float32Array(TN),cl:new Float32Array(TN),ray:new Float32Array(TN)}),c=sc.c,osc=sc.osc,ph=sc.oscPh;
  /* seats in order of height, crown at the top: linear between them, so a height between two seats is between their states */
  var ord=[6,5,4,3,2,1,0];
  for(var q=0;q<TN;q++){var y=TY0+q/TSC,rad=0,px=0,pz=0;
   for(var k=0;k<7;k++){var d=(y-SEATGY[k])/SEATSG[k],w=Math.exp(-d*d);if(w<.01)continue;rad+=w*(st.bulge[k]-st.pinch[k]);px+=w*st.pull[k]*Math.cos(ss.psi[k]);pz+=w*st.pull[k]*Math.sin(ss.psi[k]);}
   /* THE OSCILLATION IS ONE MORE FACTOR ON THE RADIUS, applied after the seats,
      so a pinched seat still breathes with the rest: the shape is the seats'
      influence and the breath rides it. */
   H.m[q]=clamp((1+rad)*charOscAt(osc,y,ph),.3,1.4);H.px[q]=px;H.pz[q]=pz;
   var sh;if(y<=SEATGY[6]){sh=st.sh[6];}else if(y>=SEATGY[0]){sh=st.sh[0];}else{var i=0;while(i<5&&y>SEATGY[ord[i+1]])i++;var a=ord[i],b=ord[i+1],f=(y-SEATGY[a])/(SEATGY[b]-SEATGY[a]);sh=st.sh[a]+(st.sh[b]-st.sh[a])*f;}
   var lit=.3+.7*charLit(seatF(y),c);H.lit[q]=lit;H.sh[q]=sh;H.op[q]=lit*(1-.85*sh);H.v[q]=1-.72*Math.pow(sh,1.1);H.cl[q]=sstep(.35,.85,sh);H.ray[q]=.03+.14*H.op[q];}}
 function viewState(sc){var Phi=sc.acc('rot',.07*(1-sc.ts)),V=sc.V||(sc.V={});V.Phi=Phi;V.cp=Math.cos(Phi);V.sp=Math.sin(Phi);V.ct=Math.cos(TILT);V.st=Math.sin(TILT);V.y0=-.02;return V;}
 function proj(V,X,Y,Z,S,v){var x1=X*V.cp+Z*V.sp,z1=-X*V.sp+Z*V.cp,yy=Y-V.y0,y2=yy*V.ct+z1*V.st,z2=z1*V.ct-yy*V.st,pf=PD/(PD-z2);S.X[v]=x1*pf;S.Y[v]=V.y0+y2*pf;S.Z[v]=z2;S.OY[v]=Y;}
 function newS(n){return {X:new Float32Array(n),Y:new Float32Array(n),Z:new Float32Array(n),OY:new Float32Array(n)};}
 /* a torus, at its present size. Coherence sets the size, the sag and the roughness. */
 function mkT(id,Rmax,b0,M,P){return {id:id,Rmax:Rmax,b0:b0,cy0:-.02,M:M,P:P};}
 function tEff(sc,T){var c=sc.c,cw=sstep(0,.95,c);T.Rm=T.Rmax*(.55+.45*cw);T.b=T.b0*(.6+.4*cw);T.cy=T.cy0+(1-cw)*.18;T.A=T.Rm-RHOMIN;T.wch=.1*T.Rm/1.12;
  /* fc is how complete the field is. Its floor of .12 is now itself faded in
     over the first five points of coherence, so at nothing the field is gone
     and the figure is the dim silhouette alone, which is what the page and
     the right panel both say happens. With the floor held at zero coherence
     two or three broken meridians survived, and collapsed onto a figure that
     narrow they draped over the shoulders like a cape: a shape that meant
     nothing, drawn on every profile nobody has read yet. */
  T.jit=.1*Math.pow(1-c,1.6);T.fc=.12*sstep(0,.05,c)+.88*sstep(.02,.9,c);T.omega=.035+.2*Math.pow(c,1.25);}
 /* the anchors of a loop and the clock it runs on. The clock is the time a
    pulse takes to reach each vertex, longer where the flow is slow, so a pulse
    bunches and hurries through a closed seat the way traffic does. */
 function loopFrame(sc,T){var th=[-Math.PI/2,Math.PI/2],H=sc.HT;
  for(var yi=0;yi<YSET.length;yi++){var v=(T.cy-YSET[yi])/T.b;if(Math.abs(v)<.95){var a=Math.asin(v);th.push(a,Math.PI-a);}}th.sort(function(x,y){return x-y;});
  var n=th.length,NV=n*SUB,fr=T.fr||(T.fr={});fr.th=th;fr.n=n;fr.NV=NV;
  var ra=fr.ra=new Float32Array(n),ya=fr.ya=new Float32Array(n),top=0;
  for(var j=0;j<n;j++){var cc=Math.cos(th[j]);ra[j]=RHOMIN+(cc>=0?T.A:T.wch)*Math.pow(Math.abs(cc),PW);ya[j]=T.cy-T.b*Math.sin(th[j]);if(Math.abs(th[j]-Math.PI/2)<1e-6)top=j*SUB;}
  fr.top=top;fr.ax=fr.ax||new Float32Array(40);fr.ay=fr.ay||new Float32Array(40);fr.az=fr.az||new Float32Array(40);
  /* the profile of the loop, (rho, y), through the same Bezier, to get a clock */
  var rv=new Float32Array(NV),yv=new Float32Array(NV),vv=0;
  for(j=0;j<n;j++){var j0=(j+n-1)%n,j2=(j+1)%n,j3=(j+2)%n,r1=ra[j],y1=ya[j],r2=ra[j2],y2=ya[j2];
   var d12=Math.hypot(r2-r1,y2-y1)/3,ta=Math.hypot(r2-ra[j0],y2-ya[j0])||1,tb=Math.hypot(ra[j3]-r1,ya[j3]-y1)||1;
   var c1r=r1+(r2-ra[j0])/ta*d12,c1y=y1+(y2-ya[j0])/ta*d12,c2r=r2-(ra[j3]-r1)/tb*d12,c2y=y2-(ya[j3]-y1)/tb*d12;
   for(var s=0;s<SUB;s++){var u=s/SUB,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;rv[vv]=b0*r1+b1*c1r+b2*c2r+b3*r2;yv[vv]=b0*y1+b1*c1y+b2*c2y+b3*y2;vv++;}}
  var Tv=fr.Tv=new Float32Array(NV+1),cum=0,arc=0;Tv[0]=0;
  for(var v2=0;v2<NV;v2++){var v3=(v2+1)%NV,ds=Math.hypot(rv[v3]-rv[v2],yv[v3]-yv[v2]),sp=H.v[hi((yv[v2]+yv[v3])/2)];cum+=ds/sp;arc+=ds;Tv[v2+1]=cum;}
  for(v2=0;v2<=NV;v2++)Tv[v2]/=cum;fr.slowf=cum/arc;fr.rv=rv;fr.yv=yv;
  /* the clock position of each ring: the anchor at that height on the outer side and on the inner side */
  fr.ring=YSET.map(function(Y){var v=(T.cy-Y)/T.b;if(Math.abs(v)>=.95)return null;var a=Math.asin(v),o=th.findIndex(function(x){return Math.abs(x-a)<1e-6;}),i=th.findIndex(function(x){return Math.abs(x-(Math.PI-a))<1e-6;});return {Y:Y,o:Tv[o*SUB],i:Tv[i*SUB],s:profS(v)};});
  fr.psi=sc.acc('flow'+T.id,T.omega/fr.slowf);return fr;}
 /* one meridian, evaluated: its vertices in figure units after the turn and the perspective */
 function evalM(sc,T,fr,phi,mi,S){var th=fr.th,n=fr.n,H=sc.HT,V=sc.V,jt=T.jit,AXx=fr.ax,AYy=fr.ay,AZz=fr.az,cph=Math.cos(phi),sph=Math.sin(phi),tt=sc.t;
  for(var j=0;j<n;j++){var y=fr.ya[j],q=hi(y),rho=fr.ra[j]*H.m[q];if(rho<.07)rho=.07;var X=rho*cph+H.px[q],Z=rho*sph+H.pz[q],Y=y;
   if(jt>.001){X+=jt*Math.sin(tt*1.1+mi*2.3+j*1.9);Z+=jt*Math.sin(tt*.9+mi*1.7+j*2.7);Y+=jt*.5*Math.sin(tt*1.3+mi*.9+j*3.1);}AXx[j]=X;AYy[j]=Y;AZz[j]=Z;}
  var v=0;
  for(j=0;j<n;j++){var j0=(j+n-1)%n,j2=(j+1)%n,j3=(j+2)%n,x1=AXx[j],y1=AYy[j],z1=AZz[j],x2=AXx[j2],y2=AYy[j2],z2=AZz[j2];
   var d12=Math.hypot(x2-x1,y2-y1,z2-z1)/3,ta=Math.hypot(x2-AXx[j0],y2-AYy[j0],z2-AZz[j0])||1,tb=Math.hypot(AXx[j3]-x1,AYy[j3]-y1,AZz[j3]-z1)||1;
   var c1x=x1+(x2-AXx[j0])/ta*d12,c1y=y1+(y2-AYy[j0])/ta*d12,c1z=z1+(z2-AZz[j0])/ta*d12,c2x=x2-(AXx[j3]-x1)/tb*d12,c2y=y2-(AYy[j3]-y1)/tb*d12,c2z=z2-(AZz[j3]-z1)/tb*d12;
   for(var s=0;s<SUB;s++){var u=s/SUB,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;
    proj(V,b0*x1+b1*c1x+b2*c2x+b3*x2,b0*y1+b1*c1y+b2*c2y+b3*y2,b0*z1+b1*c1z+b2*c2z+b3*z2,S,v);v++;}}
  return v;}
 /* a ring at height y on one side of the tube, four cubic Beziers, SUBR steps each, into S. returns the vertex count */
 function evalRing(sc,T,y,side,S,SUBR){var H=sc.HT,V=sc.V,q=hi(y),v0=(T.cy-y)/T.b;if(Math.abs(v0)>=.95)return 0;var s=profS(v0);
  var rho=(RHOMIN+(side>0?T.A:T.wch)*s)*H.m[q];if(rho<.06)rho=.06;var px=H.px[q],pz=H.pz[q],v=0;
  for(var qd=0;qd<4;qd++){var a0=qd*Math.PI/2,a3=a0+Math.PI/2,c0=Math.cos(a0),s0=Math.sin(a0),c3=Math.cos(a3),s3=Math.sin(a3);
   var p1x=c0,p1y=s0,c1x=c0-KAP*s0,c1y=s0+KAP*c0,c2x=c3+KAP*s3,c2y=s3-KAP*c3,p2x=c3,p2y=s3;
   for(var i=0;i<SUBR;i++){var u=i/SUBR,w=1-u,b0=w*w*w,b1=3*w*w*u,b2=3*w*u*u,b3=u*u*u;
    proj(V,px+rho*(b0*p1x+b1*c1x+b2*c2x+b3*p2x),y,pz+rho*(b0*p1y+b1*c1y+b2*c2y+b3*p2y),S,v);v++;}}
  return v;}
 /* how bright the faint swell is at clock position tv. heads are at hp, the
    tail runs behind them. Broad, exp(-2.2 d), where the mockup's was a narrow
    exp(-6 d) and read as a streak. */
 function pulse(tv,hp){var d=frac(hp-tv);return Math.exp(-d*2.2);}
 function depthF(z){return .40+.60*clamp((z+1.2)/2.4,0,1);}
 function lvl(b){var l=(b*6.5)|0;return l>4?4:l;}
 /* the seat the torus is leaking at, as a place on the outer wall of the
    outermost tube: object azimuth, then turned to the world */
 function leakPoint(sc,T,k,rank,out){var H=sc.HT,V=sc.V,y=SEATGY[k],q=hi(y),v0=(T.cy-y)/T.b,s=profS(v0);
  var rho=(RHOMIN+T.A*s)*H.m[q],objAz=hash(k,95)*6.2832,wa=Math.PI-(.28+.12*rank),dd=((wa+V.Phi-objAz)%6.2832+9.4248)%6.2832-3.1416,az=objAz+dd*sc.ts;
  var X=H.px[q]+rho*Math.cos(az),Z=H.pz[q]+rho*Math.sin(az),S=sc.mem.S1;proj(V,X,y,Z,S,0);out[0]=S.X[0];out[1]=S.Y[0];out[2]=S.Z[0];out[3]=az;out[4]=rho;out[5]=y;out[6]=H.px[q];out[7]=H.pz[q];return out;}
 /* the spray of points leaving at a leak: out through the wall, then dropping. A closed seat loses more. */
 var _lk=[0,0,0,0,0,0,0,0];
 function drawLeaks(sc,T,DB){var st=sc.ss.st,V=sc.V,H=sc.HT,air=sc.air,k0=sc.k,cx=sc.cx,cy=sc.cy,S=sc.mem.S1,c=sc.c,t=sc.t;sc.leakPos={};
  if(c<.03)return;
  var lk=st.leaks;
  for(var r=0;r<lk.length;r++){var k=lk[r],L=st.lk[k];leakPoint(sc,T,k,r,_lk);var px=cx+_lk[0]*k0,py=cy+_lk[1]*k0;sc.leakPos[k]=[px,py];
   var tr=sc.sel>=0,foc=tr?(sc.sel===k?1.6:.4):1,np=Math.round((5+18*L)*(tr&&sc.sel===k?1.5:1))*sc.qk|0,az=_lk[3],rho=_lk[4],y=_lk[5];
   for(var i=0;i<np;i++){var ph=hash(i,k+20),u=frac(t*(.28+.3*hash(i,k+21))+ph),e=u*u;
    var out=(.02+.6*u*(.45+L)),ya=y+e*.5+(hash(i,k+22)-.5)*.1,azz=az+(hash(i,k+23)-.5)*.32;
    proj(V,H.px[hi(y)]+(rho+out)*Math.cos(azz),ya,H.pz[hi(y)]+(rho+out)*Math.sin(azz),S,0);
    var x=S.X[0],yy=S.Y[0],b=L*Math.pow(1-u,1.1)*(.35+.65*depthF(S.Z[0]))*foc*(.3+.7*c);if(b<.04)continue;
    DB.add(cx+x*k0,cy+yy*k0,air.binAt(x,yy),lvl(b*1.25),.6+.9*(1-u));}}}
 /* the markers, drawn over everything, crisp. Rings, not fills. */
 function overlayTorus(sc){var g=sc.g,d=sc.dpr,t=sc.t;g.globalCompositeOperation='source-over';
  if(sc.sel>=0&&sc.leakPos){var st=sc.ss.st;for(var r=0;r<st.leaks.length;r++){var k=st.leaks[r],p=sc.leakPos[k];if(!p)continue;var on=k===sc.sel,col=SEATC[k],pl=.5+.5*Math.sin(t*3.2);
    g.lineWidth=(on?2:1.3)*d;g.strokeStyle=css(col,on?1:.6);g.beginPath();g.arc(p[0]*d,p[1]*d,(on?10:7.5)*d,0,6.2832);g.stroke();
    if(on){g.strokeStyle=css(col,.35+.3*pl);g.beginPath();g.arc(p[0]*d,p[1]*d,(17+4*pl)*d,0,6.2832);g.stroke();}
    if(on)sc.threadFrom=[p[0],p[1]];}}
  var mark=function(j,col){for(var i=0;i<sc.AP.length;i++){var q=sc.AP[i];if(q[2]===j){g.lineWidth=1.5*d;g.strokeStyle=css(col);g.beginPath();g.arc(q[0]*d,q[1]*d,(9+3*sc.ach[j])*d,0,6.2832);g.stroke();return;}}};
  if(sc.selAddr>=0)mark(sc.selAddr,mixc(INK,SEATC[ADDR[sc.selAddr].seat],.35));
  if(sc.hovAddr>=0&&sc.hovAddr!==sc.selAddr)mark(sc.hovAddr,INK);
  g.globalCompositeOperation='lighter';}
 /* the meridians of one torus, as strokes. o: {M,P,gain,inner,LB,DB} */
 function drawMeridians(sc,T,fr,o){var H=sc.HT,S=sc.mem.S,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,LB=o.LB,t=sc.t,NV=fr.NV,top=fr.top,P=o.P,Tv=fr.Tv;
  var psi=fr.psi,desync=Math.pow(1-c,.8),f=T.fc;
  for(var m=0;m<o.M;m++){var phi=6.2832*(m+(o.jit?.5*hash(m,T.id+40):0))/o.M+T.id*.37;evalM(sc,T,fr,phi,m,S);var off=hash(m,T.id*7+3)*desync;
   for(var v=0;v<NV;v++){var v2=v+1===NV?0:v+1,oy=(S.OY[v]+S.OY[v2])*.5,q=hi(oy);
    var n=vnoise(v/NV*2.6+m*.83+T.id*5.1,t*.06+m*1.31),pm=sstep(n-.1,n+.1,f-.5*H.sh[q]);if(pm<.03)continue;
    var tv=Tv[v]+H.cl[q]*(hash(m*13+v,5)-.5)*.14,I=0;for(var p=0;p<P;p++){var hp=frac(psi+p/P+off),e=pulse(tv,hp);if(e>I)I=e;}
    /* the swell is .7 to 1, a third of the mockup's contrast: a drift of light and not a streak */
    var b=(H.op[q]+.06*H.lit[q])*pm*depthF((S.Z[v]+S.Z[v2])*.5)*(.7+.3*I)*o.gain;if(v>top)b*=o.inner*.75;
    if(H.cl[q]>.3&&hash(m*31+(v>>1),(t*5+m)|0)<.5*H.cl[q])b*=.35;
    if(b<.04)continue;var mx=(S.X[v]+S.X[v2])*.5,my=(S.Y[v]+S.Y[v2])*.5;
    LB.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,air.binAt(mx,my),lvl(b));}}}
 /* short rays off the outer wall. A closed seat gives short, dim ones. */
 function drawRays(sc,T,fr,o){var H=sc.HT,S=sc.mem.S2,V=sc.V,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,LB=o.LB,DB=o.DB,t=sc.t,psi=fr.psi,f=T.fc;
  for(var r=0;r<o.NR;r++){var Y=YSET[(r*3)%YSET.length]+(hash(r,80)-.5)*.14,v0=(T.cy-Y)/T.b;if(Math.abs(v0)>=.93)continue;var q=hi(Y),s=profS(v0);
   var rho=(RHOMIN+T.A*s)*H.m[q],phi=hash(r,81)*6.2832,L=H.ray[q]*(.5+.9*hash(r,82))*(.4+.6*f);
   var n=vnoise(r*.7,t*.08+r),pm=sstep(n-.1,n+.1,f-.4*H.sh[q]);if(pm<.03)continue;
   proj(V,H.px[q]+rho*Math.cos(phi),Y,H.pz[q]+rho*Math.sin(phi),S,0);proj(V,H.px[q]+(rho+L)*Math.cos(phi),Y-L*.3,H.pz[q]+(rho+L)*Math.sin(phi),S,1);
   var Tr=0,bd=9;for(var i=0;i<fr.ring.length;i++){var R=fr.ring[i];if(R&&Math.abs(R.Y-Y)<bd){bd=Math.abs(R.Y-Y);Tr=R.o;}}
   var I=pulse(Tr,frac(psi));var b=(H.op[q]+.06*H.lit[q])*pm*depthF(S.Z[0])*(.7+.3*I)*o.gain;if(b<.05)continue;
   LB.add(cx+S.X[0]*k,cy+S.Y[0]*k,cx+S.X[1]*k,cy+S.Y[1]*k,air.binAt(S.X[1],S.Y[1]),lvl(b));DB.add(cx+S.X[1]*k,cy+S.Y[1]*k,air.binAt(S.X[1],S.Y[1]),lvl(b),.7);}}
 /* THE SEVEN SEAT RINGS, the slices of the one tube. A ring at the height of
    each seat, bold, in the seat's colour taken half from the air, so each ring
    is a seat and each seat bends its own ring. Where a seat is closed its ring
    is narrow, broken, dim and its beads stutter; where it is open and whole it
    swells. A bead goes round each ring, one lamp, faint. */
 function drawSeatRings(sc,T,fr,o){var st=sc.ss.st,S=sc.mem.S2,air=sc.air,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,DB=o.DB,t=sc.t,psi=fr.psi,desync=Math.pow(1-c,.8),f=T.fc;
  for(var kk=0;kk<7;kk++){var Y=SEATGY[kk],R=null;for(var i=0;i<fr.ring.length;i++)if(fr.ring[i]&&fr.ring[i].Y===Y)R=fr.ring[i];if(!R)continue;
   var sh=st.sh[kk],op=st.open[kk],rate=(.1+.28*c)*(1-.65*sh),ph=frac(sc.acc('rb'+kk,rate)),off=hash(kk,4)*desync;
   var I=0;for(var p=0;p<3;p++){var hp=frac(psi+p/3+off),e=pulse(R.o,hp);if(e>I)I=e;}
   var sides=[1,-1];
   for(var si=0;si<2;si++){var side=sides[si],nv=evalRing(sc,T,Y,side,S,12);if(!nv)continue;var big=side>0;
    for(var v=0;v<nv;v++){var v2=v+1===nv?0:v+1,n=vnoise(v/nv*3+kk*1.7+side*4,t*.05+kk*.9),pm=sstep(n-.1,n+.1,f-.6*sh);if(pm<.03)continue;
     var mx=(S.X[v]+S.X[v2])*.5,my=(S.Y[v]+S.Y[v2])*.5,rgb=air.rgbAt(mx,my),mc=mixc(rgb,SEATC[kk],.5),mk=Math.max(mc[0],mc[1],mc[2])||1,bin=binOf(mc[0]*236/mk,mc[1]*236/mk,mc[2]*236/mk);
     var ang=v/nv,dd=frac(ph-ang),bead=Math.exp(-dd*7);
     var b=(.12+.88*op)*pm*depthF((S.Z[v]+S.Z[v2])*.5)*(.66+.16*I+.18*bead)*(big?1:.4)*o.gain;
     if(sh>.35&&hash(kk*17+(v>>2),(t*5+kk)|0)<.5*st.stut[kk])b*=.35;if(b<.04)continue;
     o.LB2.add(cx+S.X[v]*k,cy+S.Y[v]*k,cx+S.X[v2]*k,cy+S.Y[v2]*k,bin,lvl(b));
     if(big&&!(v&1))DB.add(cx+S.X[v]*k,cy+S.Y[v]*k,bin,lvl(b*1.2),.6+.7*bead);}}}}

 /* ---------- the 112 points round the body, drawn ---------- */
 var SZ_A=[.82,.95,1.08,1.25,1.45];
 function drawAddrs(sc){var g=sc.g,d=sc.dpr,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c,air=sc.air,DB=sc.mem.DA,st=sc.ss.st;DB.reset();
  var light=.1+.9*Math.pow(c,1.1),size=sc.mobile?2:2.3;
  var orb=[];for(var s=0;s<7;s++)orb.push(sc.acc('orb'+s,(.05+.2*sc.c)*(1-.55*st.sh[s])));
  var rings=[],marks=[],a,ch,x,y,z,og=Math.min(1,.25+.75*sc.og);
  for(var j=0;j<112;j++){a=ADDR[j];ch=sc.ach[j];addrXY(sc,a,orb[a.seat],_ap);x=_ap[0];y=_ap[1];z=_ap[2];
   var f=.6+.4*(z+1)/2,b=(.14+.86*Math.pow(ch,.8))*light*f,sw=sc.sab[j];
   /* A SABOTEUR IS LIT BY ITS OWN WEIGHT, round RB: "I want to see my
      saboteurs more visible." Every other point is lit by coherence, so at
      low coherence the saboteurs were as dim as the light they are taking,
      which hid the cause in the dark it makes. A point a saboteur runs at is
      held at least as bright as that saboteur is heavy. */
   if(sw>.01)b=Math.max(b,(.3+.6*sw)*og*f);
   if(sc.sel>=0)b*=a.seat===sc.sel?1.3:.3;
   var px=cx+x*k,py=cy+y*k;sc.AP.push([px,py,j]);
   var lv=Math.min(4,(b*5.2)|0);if(b<.03)continue;
   DB.add(px,py,air.binAt(x,y),lv,(.8+.2*f)*(.75+1.6*Math.pow(ch,.8)));
   if(ch>.42&&b>.12){sc.glow(px,py,6+14*ch,air.rgbAt(x,y),.34*b*ch);}
   if(sw>.01&&!a.fld)marks.push([px,py,j,sw,sc.cxw[j],b,x,y]);
   else if(a.fld||ch>.68)rings.push([px,py,x,y,ch,b,a.fld]);}
  /* the lines go under the points, so a point sits on the end of its line */
  if(sc.leadSab.length)drawSabLines(sc,marks);
  DB.flush(g,d,COLQ,AQ,SQ5,size);
  g.lineWidth=1.1*d;
  for(var i=0;i<rings.length;i++){var q=rings[i],rgb=air.rgbAt(q[2],q[3]);g.globalAlpha=Math.min(1,.55*q[5]+.1);g.strokeStyle=css(mixc(rgb,INK,.25));g.beginPath();
   g.arc(q[0]*d,q[1]*d,(q[6]?6+7*q[4]:3.5+size*.5+3*q[4])*d,0,6.2832);g.stroke();}
  /* THE SABOTEUR'S MARK: a ring in the seat's own colour, not the air's, so
     it is the one ring on the page that does not take the colour of where it
     is. Size and strength are the weight. Rings, never a fill.
     TWO STRENGTHS, ONE ORDER. Gordon carries 39 saboteurs over 106 of the 108
     body addresses, and a bold ring on every one of them was a swarm that hid
     the body it was meant to explain, measured on the first shot. So the
     three heaviest saboteurs, the ones with a line, are bold, with a second
     ring outside when that saboteur is part of a complex, and every other
     point a saboteur runs at gets a thin, quiet ring: still found, read
     second. */
  for(i=0;i<marks.length;i++){var m=marks[i],col=mixc(SEATC[ADDR[m[2]].seat],INK,.12),sf=sc.sel>=0?(ADDR[m[2]].seat===sc.sel?1:.3):1,bold=sc.leadSab.indexOf(m[2])>=0;
   var r0=bold?4.2+2.6*m[3]:3.4+1.6*m[3];g.strokeStyle=css(col);
   g.lineWidth=(bold?1.2+.5*m[3]:.9)*d;g.globalAlpha=clamp((bold?.5+.45*m[3]:.14+.2*m[3])*og*sf,0,1);
   g.beginPath();g.arc(m[0]*d,m[1]*d,r0*d,0,6.2832);g.stroke();
   if(bold&&m[4]>.01){g.lineWidth=.9*d;g.globalAlpha=clamp((.22+.4*m[4])*og*sf,0,1);g.beginPath();g.arc(m[0]*d,m[1]*d,(r0+3.4)*d,0,6.2832);g.stroke();}}
  g.globalAlpha=1;}
 var _ap=[0,0,0],_sl=[0,0,0,0];
 /* THE LINE FROM A SABOTEUR TO THE PLACE IT DIMS, round RB: "the saboteurs
    are dimming it." A dimmed place alone does not say what dimmed it, so the
    three heaviest saboteurs each draw a dotted line from every point they run
    at to the place on the body that point dims, which is where the dim map
    put its bump: the address's own resting place, carried onto the spine as
    it is posed now. One faint bead goes down each line toward the body, once
    every LINE_S seconds, leaving the saboteur slowly and speeding into the
    body (an ease in, u squared), so the eye reads which end is the cause. Only three, because a person carrying thirty nine saboteurs
    would otherwise get thirty nine sets of lines and read none of them; the
    rest are dimmed and ringed and not joined. Under reduced motion the bead
    is not drawn and the line stands still. */
 var LINE_S=3.4;
 function drawSabLines(sc,marks){var g=sc.g,d=sc.dpr,k=sc.k,cx=sc.cx,cy=sc.cy,og=Math.min(1,.25+.75*sc.og),lead=sc.leadSab;
  for(var i=0;i<marks.length;i++){var m=marks[i],j=m[2],r=lead.indexOf(j);if(r<0)continue;var a=ADDR[j];
   if(sc.sel>=0&&a.seat!==sc.sel)continue;
   spineAt(sc.sp,a.yr,_sl);var bx=cx+(_sl[0]+(-_sl[3])*a.ax)*k,by=cy+(_sl[1]+_sl[2]*a.ax)*k;
   var x0=m[0],y0=m[1],dx=bx-x0,dy=by-y0,len=Math.hypot(dx,dy);if(len<10)continue;
   /* a shallow arc, bowed away from the spine, so a line never lies along
      the body's own edge */
   var bow=.16*len*(x0<cx?-1:1),qx=(x0+bx)/2+bow*(dy/len)*-1,qy=(y0+by)/2+bow*(dx/len);
   var col=mixc(SEATC[a.seat],INK,.2),n=Math.max(6,Math.round(len/5)),al=(.34+.4*m[3])*og;
   g.fillStyle=css(col);
   for(var s=1;s<n;s++){var u=s/n,v=1-u,px=v*v*x0+2*v*u*qx+u*u*bx,py=v*v*y0+2*v*u*qy+u*u*by;
    g.globalAlpha=al*(.55+.45*Math.sin(u*Math.PI));g.fillRect((px-1)*d,(py-1)*d,2*d,2*d);}
   /* the place it dims: a small open ring, dim, on the body */
   g.globalAlpha=al*.9;g.strokeStyle=css(col);g.lineWidth=d;g.beginPath();g.arc(bx*d,by*d,3*d,0,6.2832);g.stroke();
   if(!sc._still){var ph=frac(sc.t/LINE_S+hash(j,31)),bu=ph*ph,bv=1-bu;
    var ex=bv*bv*x0+2*bv*bu*qx+bu*bu*bx,ey=bv*bv*y0+2*bv*bu*qy+bu*bu*by,ba=al*1.6*Math.sin(ph*Math.PI);
    g.globalAlpha=clamp(ba,0,1);g.fillRect((ex-1.4)*d,(ey-1.4)*d,2.8*d,2.8*d);}}
  g.globalAlpha=1;}

 /* THE COLOUR THE AURA IS RADIATING, round RB: "I want the background of the
    character to reflect the combination color that the aura is radiating. And
    I want that dynamic." It is not chosen here, it is summed. Every point the
    cloud splats into the air carries its own colour at its own brightness, so
    the mean of those splats, weighted the same way, is the one colour the
    whole person gives off: the seats that are lit, the patterns that are
    loaded, and the grey of whatever a saboteur is dimming. It is made bright
    the way each cell of the air is, then drawn toward ember by how little
    coherence there is, the way airWorld draws the world, so a compressed
    field gives off a dim grey and a full spectrum one gives off colour.
    The mean of many colours is always paler than any of them, so the spread
    from its own grey is put back at SAT before that. Read on the frames the
    air is rebuilt, every third, and eased in update(). */
 var AURA_SAT=4;
 function auraOf(sc,r,g,b,w){var c;
  if(w<1e-3)c=EMBER.slice();
  else{c=[r/w,g/w,b/w];var L=(c[0]+c[1]+c[2])/3;c=c.map(function(v){return clamp(L+(v-L)*AURA_SAT,0,255);});
   var m=Math.max(c[0],c[1],c[2])||1,k=236/m;c=[c[0]*k,c[1]*k,c[2]*k];c=mixc(EMBER,c,.3+.7*sc.c);}
  sc.auraT=c;if(!sc.aura||sc._still)sc.aura=c.slice();}

 /* ---------- the body, drawn ---------- */
 function drawBody(sc){var g=sc.g,A=sc.mem.A,B=sc.mem.B,air=sc.air,d=sc.dpr,t=sc.t,F=sc.fig,C=F.caps,k=sc.k,cx=sc.cx,cy=sc.cy,c=sc.c;
  var cp=segFrames(C),lp=sc.lead,M=maskDef(sc.mask),beat=.5+.5*Math.sin(Math.PI*2*t/PER[M.nm]);
  var lit=[0,1,2,3,4,5,6].map(function(i){return sstep(.04+.035*i,.55+.04*i,c);}),vis=.7+.3*sstep(0,.5,c),kc=lerp(.72,1,sstep(0,.7,c)),intro=t<2.2;
  /* the light of the cloud. At coherence nothing it is a dim silhouette, about
     thirteen percent, and not black: "near black, not totally black". */
  var gain=(.13+.9*Math.pow(c,.9))*Math.min(1,Math.pow(F.scale,1.6)),szB=(sc.mobile?1.3:1.5)*(1+.14*sstep(0,.9,c));
  var doAir=sc.manual||sc.airNow,show=sc.ov.cloud;if(doAir)air.clear();
  var sel=sc.sel,hov=sc.hov,stride=sc.stride,dimOn=sc.sabAny,ar=0,ag=0,ab=0,aw=0,nsp=0;B.reset();
  for(var i=0;i<A.n;i+=1){var rk=A.sc7[i];
   /* the governor thins the cloud by skipping points that are not in this
      frame's share. A skipped point is still a point of the person, so the
      share rotates each frame rather than always dropping the same ones. */
   if(stride>1&&((i+sc.fn)%stride))continue;
   var q=cmAt(sc,A.rx[i],A.ry[i]),thr=(.55+.45*sstep(0,.8,q))*vis;if(A.keep[i]>thr)continue;
   var p=A.pat[i],xy=bodyXY(sc,A,C,cp,i,kc,intro),qx=xy[0],qy=xy[1],x=cx+qx*k,y=cy+qy*k,s0=A.s0[i];
   var sf=1;if(sel>=0)sf=rk===sel?1.12:.3;else if(hov>=0)sf=rk===hov?1.15:.85;
   var b=gain*A.lum[i]*(.6+.8*Math.pow(q,.8))*sf*(p===lp?.9+.2*beat:1)*xy[2]*(1+.12*Math.sin(t*(.9+A.ph[i]*1.4)+i)),h=p;
   var rj=Math.round(s0),dk=Math.abs(s0-rj);
   /* where a saboteur runs, the light is taken down and the colour with it:
      the seat's own band of light first, which is the brightest thing on the
      body and would otherwise shine straight through the dimming, then the
      point itself. A point's share of the grey is its own fixed draw (ph), so
      the edge of a dimmed place is a scatter of grey into colour and never a
      line */
   var dm=dimOn?dmAt(sc,A.rx[i],A.ry[i]):0;
   if(rj>=1&&dk<.2){var bl=(1-dk/.2)*lit[rj]*(1-.8*dm);if(bl>.08){b+=bl*.45*A.lum[i];if(bl>.3)h=9+rj;}}
   if(dm>.02){b*=1-DIMK*dm;if(A.ph[i]<dm*1.1)h=HDIM;}
   var l=(b*NLB*.95)|0;if(l>=NLB)l=NLB-1;if(l<0)l=0;
   if(show){B.add(x,y,h,l,1);sc.regB(x,y,rk);}
   /* a quarter of the points drawn this frame, counted, and not every fourth
      index: under the governor's stride of 2, a frame whose number is odd
      draws only odd indices, none of them a multiple of four, so the air was
      rebuilt from nothing on every other rebuild and went to bare ember, and
      the aura's colour went with it. Found by round RB, measured on Rosa at
      390 with the governor at its first step. */
   if(doAir&&!((nsp++)&3)){var rb=RBASE[h],w=b>1?1:b*1.1;air.splat(qx,qy,rb[0],rb[1],rb[2],w);ar+=rb[0]*w;ag+=rb[1]*w;ab+=rb[2]*w;aw+=w;}}
  if(show)B.flush(g,d,COLSB,ALB,SZB,szB);
  if(doAir){air.ambient(c);air.finish(1.6);auraOf(sc,ar,ag,ab,aw);}
  if(show)drawWorld(sc,airWorld(sc));}

 /* ---------- the heat map ----------
    The body coloured by the charge it carries, under the cloud: "cool to hot by
    the seat's mean charge, smooth across the body". The colour is the Body's own
    heat ramp, bmRamp in ui/map.js, so a charge reads as the same heat on both
    pages, and it never reaches the alarm red, which this product keeps for the
    instrument being wrong. Where a seat has no charge the ramp's own alpha is
    nothing, so a clear person is not painted at all.
    The value at a cell is mostly the seat's mean, interpolated between seats by
    charSeatMean so it is smooth and never steps at a seat boundary, and a little
    of the local charge map so a heavy address shows in its own place. The
    silhouette is the posed figure's own distance field, asked of a coarse grid
    every third frame and drawn up with smoothing, which is what makes the edge
    soft. */
 var HW=76,HH=100,HX0=-.95,HY0=-1.2,HS=.025;
 function heatRamp(t){return typeof bmRamp==='function'?bmRamp(t):[[178,122,84],t*.86];}
 function drawHeat(sc){
  if(!sc.heatC){sc.heatC=document.createElement('canvas');sc.heatC.width=HW;sc.heatC.height=HH;sc.heatG=sc.heatC.getContext('2d');sc.heatI=sc.heatG.createImageData(HW,HH);}
  if(sc.manual||sc.airNow||sc.heatDirty){sc.heatDirty=false;
   var im=sc.heatI,dd=im.data,F=sc.fig,means=sc.ss.mean,o=0;
   for(var y=0;y<HH;y++){var fy=HY0+(y+.5)*HS,sm=charSeatMean(means,seatF(fy));
    for(var x=0;x<HW;x++,o+=4){var fx=HX0+(x+.5)*HS,dist=figD(F,fx,fy);
     if(dist>.015){dd[o+3]=0;continue;}
     var edge=sstep(.015,-.025,dist),hv=.72*sm+.28*clamp(cmAt(sc,fx,fy),0,1)*.6,r=heatRamp(charHeatT(hv)),col=r[0],a=r[1]/.86*edge;
     dd[o]=col[0];dd[o+1]=col[1];dd[o+2]=col[2];dd[o+3]=a*255;}}
   sc.heatG.putImageData(im,0,0);}
  var g=sc.g,d=sc.dpr;g.save();g.globalCompositeOperation='source-over';g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  /* it comes up with the page, a little ahead of the light, and never sits at full strength: it is a wash under the cloud */
  g.globalAlpha=.8*(.3+.7*sc.og);
  g.drawImage(sc.heatC,(sc.cx+HX0*sc.k)*d,(sc.cy+HY0*sc.k)*d,HW*HS*sc.k*d,HH*HS*sc.k*d);
  g.restore();g.globalCompositeOperation='lighter';g.globalAlpha=1;}

 /* ---------- the scene: one canvas, one person ----------
    Everything drawn is a pure function of time, the eased pose and the eased
    charges, so a still frame can be asked for at any second and a test can step
    the clock itself. */
 var NSEED=21;
 function Scene(host,o){o=o||{};
  this.host=host;this.cv=document.createElement('canvas');this.cv.className='chp-cv';this.cv.setAttribute('role','img');
  host.insertBefore(this.cv,host.firstChild);this.g=this.cv.getContext('2d');
  this.dpr=Math.min(2,window.devicePixelRatio||1);this.t=0;this.fn=0;
  this.small=innerWidth<700;this.manual=!!o.manual;this.nogrow=!!o.nogrow;
  this.mask='Child';this.w={};AX.forEach(function(a){this.w[a.nm]=0;},this);this.ig=[1,1,1,1,1,1,1];
  this.cT=0;this.cc=0;this.og=0;this.vit=0;this.osc=charOscillation(0);this.oscPh=0;this.unread=true;
  this.ov={cloud:true,torus:true,heat:false};
  this.sel=-1;this.hov=-1;this.ts=0;this.tsT=0;this.anchor=null;this.fade=.6;this.threadFrom=null;this.selAddr=-1;this.hovAddr=-1;this.AP=[];
  this.pc=new Array(9).fill(0);this.pv=Object.assign({},REST);this.m=0;this.L=0;
  this.hx=[];this.hy=[];this.hp=[];this.regN=0;this.sprites={};this.mem={};this.ready=false;this.W=0;this.H=0;
  this.q=0;this.qk=1;this.stride=1;this.airNow=true;this.heatDirty=true;
  addrInit();
  this.ach=new Float32Array(112);this.achT=new Float32Array(112);
  /* round RB: the saboteur weight at each address, 0 to 1, eased and target,
     the complex weight beside it, and the addresses of the three heaviest
     saboteurs, which are the ones joined to the place they dim */
  this.sab=new Float32Array(112);this.sabT=new Float32Array(112);this.cxw=new Float32Array(112);this.leadSab=[];this.sabAny=false;
  this.aura=null;this.auraT=EMBER.slice();
  this.tp=Object.assign({},REST);this.tm=0;this.tL=0;this.tpc=this.pc.slice();this.lead=0;
  /* the allocation, once: the cloud's points, the batches, the torus' scratch */
  var N=this.small?4600:9000,A=this.mem.A=bodySample(N,NSEED);this.mem.B=new Batch(N,NHB,NLB);
  var F=buildFig(REST),C=F.caps,cp=segFrames(C),oo=[0,0];A.rx=new Float32Array(N);A.ry=new Float32Array(N);A.sc7=new Uint8Array(N);
  for(var i=0;i<N;i++){restXY(A,C,cp,i,oo);A.rx[i]=oo[0];A.ry[i]=oo[1];var r=Math.round(A.s0[i]);A.sc7[i]=r<0?0:r>6?6:r;}
  this.mem.CM=new Float32Array(CMW*CMH);this.mem.DM=new Float32Array(CMW*CMH);this.air=new Air();this.mem.DA=new Batch(120,NBIN,5);worldInit(this);
  this.mem.S=newS(120);this.mem.S1=newS(2);this.mem.S2=newS(80);
  this.mem.LB=new LineBatch(9000,NBIN,5);this.mem.LB2=new LineBatch(1600,NBIN,5);this.mem.DB=new Batch(9000,NBIN,5);
  this.mem.T=mkT(0,1.12,1.32,14,3);
  this.setTarget();}
 Object.defineProperty(Scene.prototype,'c',{get:function(){return this.cc*this.og;}});
 /* what the page hands the scene. w is the nine weights by pattern name, 0 to
    10, ach the 112 charges over ten in address order, ig the seven integrities,
    coh the coherence 0 to 1 and vit the Vitality reading 0 to 1. */
 Scene.prototype.feed=function(d){
  if(d.w)this.w=d.w;if(d.ig)this.ig=d.ig;if(d.coh!==undefined)this.cT=clamp(d.coh,0,1);if(d.vit!==undefined)this.vit=clamp(d.vit,0,1);
  if(d.mask)this.mask=d.mask;if(d.unread!==undefined)this.unread=!!d.unread;
  if(d.ach)for(var j=0;j<112;j++)this.achT[j]=clamp(d.ach[j],0,1);
  if(d.sab){var any=false;for(var j2=0;j2<112;j2++){this.sabT[j2]=clamp(d.sab[j2],0,1);this.cxw[j2]=clamp(d.cx?d.cx[j2]:0,0,1);if(this.sabT[j2]>0)any=true;}
   this.sabAny=any||this.sabAny;this.leadSab=d.lead||[];}
  /* THE FIRST FEED SETS THE LIGHT AND THE CHARGES WHERE THEY ARE GOING and
     leaves the pose to ease. The opening is charGrow's to make, from the dim
     floor to the real level, and a coherence that also eased up from nothing
     would grow twice and take twice as long: the opening measured about four
     seconds before this. The figure still gathers and bends into its mask,
     because that is the pose easing from a plain person. */
  if(!this.fed){this.fed=1;this.cc=this.cT;this.ach.set(this.achT);this.sab.set(this.sabT);}
  this.setTarget();};
 Scene.prototype.setTarget=function(){var M=maskDef(this.mask),w=this.w,r=mixPose(M.nm,w);
  this.tp=r.p;this.tm=r.m;this.tL=r.L;
  /* charges, seen through the mask: a seat the mask does not wear is held back to a third */
  this.tpc=AX.map(function(a){return Math.min(1,(w[a.nm]||0)/9)*(M.b.indexOf(a.seat)>=0?1:.34);});
  this.lead=leadPat(w);this.per=PER[M.nm];};
 Scene.prototype.snap=function(){this.pv=Object.assign({},this.tp);this.m=this.tm;this.L=this.tL;this.pc=this.tpc.slice();this.fade=1;this.ready=true;this.cc=this.cT;this.ach.set(this.achT);this.sab.set(this.sabT);this.sabAny=this.sabT.some(function(v){return v>0;});if(this.auraT)this.aura=this.auraT.slice();};
 Scene.prototype.resize=function(){var r=this.host.getBoundingClientRect(),d=this.dpr,w=Math.round(r.width*d),h=Math.round(r.height*d);
  if(!w||!h)return false;
  if(this.cv.width!==w||this.cv.height!==h){this.cv.width=w;this.cv.height=h;this.heatDirty=true;}this.W=w;this.H=h;this.w2=r.width;this.h2=r.height;this.mobile=r.width<700;return true;};
 /* where the figure stands on the stage. The torus is two and three quarter
    figure units tall and two and a quarter wide, so the figure stands smaller
    than it would alone. The icon row sits upper left and the overlay row upper
    right on a desktop, so the top margin is the room they need. */
 Scene.prototype.layout=function(){var w=this.w2,h=this.h2,cx,cy,k;
  if(!this.mobile){k=Math.min((h-110)/2.84,w/2.7);cx=w*.5;cy=h*.5+10;}
  else{var top=78,bot=64;k=Math.min((h-top-bot)/2.78,w/2.62);cx=w/2;cy=top+(h-top-bot)/2+6;}
  return {cx:cx,cy:cy,k:k};};
 Scene.prototype.ease=function(dt){var q=1-Math.exp(-dt*(this.ready?3.2:2.4));
  for(var k in this.tp)this.pv[k]+=(this.tp[k]-this.pv[k])*q;
  this.m+=(this.tm-this.m)*q;this.L+=(this.tL-this.L)*q;
  for(var i=0;i<9;i++)this.pc[i]+=(this.tpc[i]-this.pc[i])*q;
  this.fade=Math.min(1,this.fade+dt*1.5);
  /* the light comes up slower than the shape bends, and a beat later: the body
     gathers, then it is lit. Going down is quicker than going up, a held breath
     is shorter than an exhale. */
  var cq=1-Math.exp(-dt*(this.cT>this.cc?1.5:2.2));this.cc+=(this.cT-this.cc)*cq;
  var qa=1-Math.exp(-dt*(this.ready?1.6:9)),sa=false;for(var j=0;j<112;j++){this.ach[j]+=(this.achT[j]-this.ach[j])*qa;
   this.sab[j]+=(this.sabT[j]-this.sab[j])*qa;if(this.sab[j]>.005)sa=true;}
  this.sabAny=sa;
  /* the aura's colour moves on a slower clock than anything it is made of,
     a time constant of 1.4 seconds, so the room changes like light changing
     and never flickers with the points it is summed from */
  if(this.aura){var qc=1-Math.exp(-dt/1.4);for(var c3=0;c3<3;c3++)this.aura[c3]+=(this.auraT[c3]-this.aura[c3])*qc;}
  this.ts+=(this.tsT-this.ts)*(1-Math.exp(-dt*6));if(Math.abs(this.tsT-this.ts)<.002)this.ts=this.tsT;};
 Scene.prototype.update=function(dt,still){
  /* a person who asked for less motion gets the settled picture, held still:
     every ease is finished, the opening is over and the clock sits at a
     second where nothing is mid gesture */
  if(still){if(!this._still){this._still=1;this.snap();this.t=3.2;}return;}
  this._still=0;this.ease(dt);this.t+=dt;this.ready=true;};
 /* the idle motion each mask owns, at its own tempo. The person at rest only breathes. */
 function saw(u){return u<.2?sstep(0,.2,u):1-sstep(.2,1,u);}   /* a quick lunge and a slow return */
 Scene.prototype.posed=function(){var p=Object.assign({},this.pv),t=this.t,m=this.m,ph=this.ph=(t/this.per)%1,s=Math.sin(Math.PI*2*ph);
  var br=Math.sin(Math.PI*2*t/4.2);
  p.shL+=.025*br;p.shR+=.025*br;p.lean+=.006*Math.sin(Math.PI*2*t/9)*(1-m);p.headTilt+=.01*Math.sin(Math.PI*2*t/7.3)*(1-m);
  var a=Math.max(.2,m);
  if(this.mask==='Child'){p.curl+=.05*s*a;p.headDrop+=.14*s*a;p.scale-=.01*s*a;}
  else if(this.mask==='Preteen'){p.headTurn+=.5*s*a;p.headTilt+=.05*s*a;p.shR+=.1*Math.sin(Math.PI*2*ph+1)*a;}
  else if(this.mask==='Teen'){var th=saw(ph);p.a1L+=.16*th*a;p.a2L+=.16*th*a;p.lean-=.035*th*a;p.shW+=.03*th*a;}
  /* steady. only the seam works: a slow tension, the halves leaning on each other */
  else if(this.mask==='Adult'){p.shear+=.03*s*a;p.headDrop+=.025*Math.sin(Math.PI*2*ph+1.2)*a;p.a1R+=.04*s*a;}
  /* Ideological is rigid: it does not move. the light moves across it. */
  var l=this.lead,lw=this.pc[l];
  if(l===0){p.shL+=.012*Math.sin(t*31)*lw;p.shR+=.012*Math.sin(t*29)*lw;}     /* Fear trembles */
  if(l===4)p.headDrop+=.01*Math.sin(t*.7)*lw;                                /* Apathy barely moves */
  if(l===1){p.shL+=.03*(.5+.5*Math.sin(Math.PI*2*t/2.2))*lw;p.shR+=.03*(.5+.5*Math.sin(Math.PI*2*t/2.2))*lw;}
  return p;};
 /* the factor a pattern's marks take when one is selected or hovered */
 Scene.prototype.pa=function(){return this.sel>=0?.5:1;};
 /* a phase that keeps counting when its rate changes: the rate is applied to the
    time since the last frame, so a speed that eases never jumps the picture. A
    time that goes backwards (a page that has just been opened again, a test that
    sets the clock) restarts the count. */
 Scene.prototype.acc=function(key,rate){var m=this.accm||(this.accm={}),e=m[key]||(m[key]={v:0,t:0}),dt=this.t-e.t;if(dt<0||dt>.5)e.v=rate*this.t;else e.v+=rate*dt;e.t=this.t;return e.v;};
 /* mark registration, so a press finds the seat that owns what it touched */
 Scene.prototype.regB=function(x,y,p){if((this.regN++&3)||this.hx.length>1800)return;this.hx.push(x);this.hy.push(y);this.hp.push(p);};
 Scene.prototype.nearAddr=function(px,py,max){var b=-1,bd=max*max;for(var i=0;i<this.AP.length;i++){var a=this.AP[i],dx=a[0]-px,dy=a[1]-py,d=dx*dx+dy*dy;if(d<bd){bd=d;b=a[2];}}return b;};
 Scene.prototype.near=function(px,py,max){var b=-1,bd=max*max;for(var i=0;i<this.hx.length;i++){var dx=this.hx[i]-px,dy=this.hy[i]-py,d=dx*dx+dy*dy;if(d<bd){bd=d;b=this.hp[i];}}return b;};
 /* a soft light, from a cached sprite */
 Scene.prototype.glow=function(x,y,r,rgb,a){var key=((rgb[0]/16)|0)+','+((rgb[1]/16)|0)+','+((rgb[2]/16)|0),s=this.sprites[key];
  if(!s){s=document.createElement('canvas');s.width=s.height=64;var c=s.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32);
   var q=[(rgb[0]/16|0)*16+8,(rgb[1]/16|0)*16+8,(rgb[2]/16|0)*16+8];
   gr.addColorStop(0,css(q,1));gr.addColorStop(.35,css(q,.38));gr.addColorStop(1,css(q,0));c.fillStyle=gr;c.fillRect(0,0,64,64);this.sprites[key]=s;}
  var g=this.g,d=this.dpr;g.globalAlpha=clamp(a,0,1);g.drawImage(s,(x-r)*d,(y-r)*d,r*2*d,r*2*d);};
 Scene.prototype.dot=function(x,y,s,rgb,a){var g=this.g,d=this.dpr;g.globalAlpha=clamp(a,0,1);g.fillStyle='rgb('+(rgb[0]|0)+','+(rgb[1]|0)+','+(rgb[2]|0)+')';g.fillRect((x-s/2)*d,(y-s/2)*d,s*d,s*d);};
 Scene.prototype.render=function(){if(!this.W&&!this.resize())return;
  var g=this.g,d=this.dpr;this.fn++;
  /* the colour field and the glow's copies are rebuilt every third frame. A
     one frame lag cannot be seen and each is the dearest thing in the frame. */
  this.airNow=((this.fn-1)%3===0);
  if(!this.nogrow)this.og=charGrow(this.t);else this.og=1;
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.clearRect(0,0,this.W,this.H);
  var L=this.Lo=this.layout();this.hx.length=0;this.hy.length=0;this.hp.length=0;this.regN=0;this.AP.length=0;
  var P=this.posed();this.fig=buildFig(P);this.P=P;
  this.k=L.k;this.cx=L.cx;this.cy=L.cy;
  g.globalCompositeOperation='lighter';
  /* the Vitality oscillation: a phase in cycles that keeps counting as the rate eases */
  this.osc=charOscillation(this.unread?0:this.vit);this.oscPh=this.acc('osc',this.osc.rate);
  spineNow(this);seatState(this);buildH(this);viewState(this);buildCM(this);buildDM(this);
  if(this.ov.heat)drawHeat(this);
  drawBody(this);
  if(this.ov.torus){
   var T=this.mem.T,fr,LB=this.mem.LB,LB2=this.mem.LB2,DB=this.mem.DB;LB.reset();LB2.reset();DB.reset();
   tEff(this,T);fr=loopFrame(this,T);
   drawMeridians(this,T,fr,{M:Math.max(6,Math.round(T.M*this.qk)),P:2,gain:.62,inner:.4,LB:LB,DB:DB,jit:true});drawRays(this,T,fr,{gain:.8,LB:LB,DB:DB,NR:Math.round(40*this.qk)});
   drawSeatRings(this,T,fr,{LB2:LB2,DB:DB,gain:1.05});drawLeaks(this,T,DB);
   LB.flush(g,d,COLQ,AQ,LWQ,.9);LB2.flush(g,d,COLQ,AQ,LWQ,1.5);DB.flush(g,d,COLQ,AQ,SQ5,this.mobile?2:2.3);}
  else{this.leakPos={};this.mem.DB.reset();}
  if(this.ov.cloud)drawAddrs(this);
  g.globalAlpha=1;
  if(this.qk>.4)this.bloom();
  overlayTorus(this);
  if(this.sel>=0&&this.anchor&&this.threadFrom)this.thread();
  g.globalCompositeOperation='source-over';g.globalAlpha=1;};
 /* THE GLOW: the picture blurred twice and laid back over itself, so lit points
    bleed light into each other. The blur is made by halving the canvas four
    times, each a plain 2 by 2 average, which is a box filter and costs almost
    nothing, and keeping the quarter and the sixteenth size copies.

    THE MOCKUP LAID BOTH COPIES BACK OVER THE FULL CANVAS EVERY FRAME, at the
    browser's high smoothing quality, and that was two thirds of its frame:
    74 to 94 ms on a Chromium with no graphics card, of which the glow was about
    two thirds. Measured again here, no glow took a frame from about 90 ms to
    about 14. So the two copies are now added together into ONE small layer,
    the size of the quarter copy, every third frame, and that single layer is
    what is laid over the picture on each of the other frames, at the plain
    smoothing quality, which is as good as it looks because a blur has nothing
    in it for a sharper filter to keep. The glow moves with the picture, since it
    is laid over fresh each frame, and only its shape is up to two frames old,
    which a halo this soft hides. */
 Scene.prototype.bloom=function(){var c=this.c,a1=.2*c,a2=.15*c;if(a1<.004&&a2<.004)return;
  var W=this.W,H=this.H,g=this.g;
  if(!this.bc||this.bc.W!==W||this.bc.H!==H){var mk=function(w,h){var cv=document.createElement('canvas');cv.width=Math.max(2,w|0);cv.height=Math.max(2,h|0);
    var x=cv.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='low';return {c:cv,x:x,w:cv.width,h:cv.height};};
   this.bc={W:W,H:H,l:[mk(W/2,H/2),mk(W/4,H/4),mk(W/8,H/8),mk(W/16,H/16)],mix:mk(W/4,H/4)};this.bcOld=true;}
  var B=this.bc;
  if(this.manual||this.airNow||this.bcOld){this.bcOld=false;var src=this.cv,i,q;
   for(i=0;i<4;i++){q=B.l[i];q.x.globalCompositeOperation='copy';q.x.drawImage(src,0,0,q.w,q.h);src=q.c;}
   var m=B.mix.x;m.globalCompositeOperation='copy';m.globalAlpha=Math.min(1,a1);m.drawImage(B.l[1].c,0,0);
   m.globalCompositeOperation='lighter';m.globalAlpha=Math.min(1,a2);m.drawImage(B.l[3].c,0,0,B.mix.w,B.mix.h);m.globalAlpha=1;}
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='lighter';g.imageSmoothingEnabled=true;g.imageSmoothingQuality='low';
  g.globalAlpha=1;g.drawImage(B.mix.c,0,0,W,H);g.restore();};
 /* a dotted thread from the chosen leak toward the right panel, where the trace
    card is. It leaves the canvas at its right edge on a desktop and at its
    foot on a phone, because the card is under the stage there. */
 Scene.prototype.thread=function(){var g=this.g,d=this.dpr,o=this.threadFrom,A=this.anchor,t=this.t;if(!o)return;
  var col=SEATC[this.sel],x0=o[0]*d,y0=o[1]*d,x1=A[0]*d,y1=A[1]*d;
  var bend=this.mobile?[x0,y0+(y1-y0)*.55,x1,y1-(y1-y0)*.25]:[x0+(x1-x0)*.35,y0-(y0-y1)*.05-40*d,x0+(x1-x0)*.6,y1];
  var pt=function(u){var v=1-u;return [v*v*v*x0+3*v*v*u*bend[0]+3*v*u*u*bend[2]+u*u*u*x1,v*v*v*y0+3*v*v*u*bend[1]+3*v*u*u*bend[3]+u*u*u*y1];};
  var len=0,prev=pt(0);for(var i=1;i<=40;i++){var q=pt(i/40);len+=Math.hypot(q[0]-prev[0],q[1]-prev[1]);prev=q;}
  var step=5.2*d,m=Math.max(8,Math.floor(len/step)),pl=(t*.22)%1;
  g.globalCompositeOperation='lighter';var hot=mixc(col,INK,.55);
  for(i=0;i<=m;i++){var u=i/m,p=pt(u),near=Math.exp(-Math.pow((u-pl)/.05,2));
   var a=.7+.25*Math.sin(u*Math.PI)+near*.6,s=(2.3+near*2.6)*d;
   g.globalAlpha=Math.min(1,a);g.fillStyle=css(mixc(col,hot,near));g.fillRect(p[0]-s/2,p[1]-s/2,s,s);
   if(i%2===0){var nx=Math.sin(i*12.9)*3*d,ny=Math.cos(i*7.1)*3*d;g.globalAlpha=.28;g.fillStyle=css(col);g.fillRect(p[0]+nx,p[1]+ny,1.3*d,1.3*d);}}
  g.globalAlpha=.9;g.lineWidth=1.4*d;g.strokeStyle=css(hot);g.beginPath();g.arc(x0,y0,11*d,0,Math.PI*2);g.stroke();
  g.globalAlpha=.35;g.strokeStyle=css(col);g.beginPath();g.arc(x0,y0,19*d,0,Math.PI*2);g.stroke();
  g.globalAlpha=.9;g.strokeStyle=css(hot);g.beginPath();g.arc(x1,y1,5*d,0,Math.PI*2);g.stroke();g.globalAlpha=1;};
 /* THE GOVERNOR. Called with the real interval between frames. A page that
    cannot hold the rate sheds work in three steps and takes it back slowly:
    q0 everything, q1 every second point and three quarters of the meridians,
    q2 a third of the points, a third of the meridians and no glow. The thresholds
    are a frame time of 24 ms, under 42 frames a second, held for thirty
    frames to go down and under 17 ms held for a hundred and twenty to go up,
    so one slow frame, a tab switch or a resize never moves it. */
 Scene.prototype.govern=function(dtMs){
  this.gAvg=this.gAvg?this.gAvg*.9+dtMs*.1:dtMs;
  if(this.gAvg>24){this.gSlow=(this.gSlow|0)+1;this.gFast=0;}
  else if(this.gAvg<17){this.gFast=(this.gFast|0)+1;this.gSlow=0;}
  else{this.gSlow=0;this.gFast=0;}
  if(this.gSlow>=30&&this.q<2){this.setQ(this.q+1);this.gSlow=0;}
  if(this.gFast>=120&&this.q>0){this.setQ(this.q-1);this.gFast=0;}};
 Scene.prototype.setQ=function(q){this.q=q;this.stride=[1,2,3][q];this.qk=[1,.75,.3][q];this.heatDirty=true;};
 /* a stage with nothing hovered: the seat under the pointer, or no seat */
 Scene.prototype.setSel=function(k,addr){this.sel=k;this.selAddr=k>=0&&addr!==undefined?addr:-1;this.tsT=k>=0?1:0;if(k<0)this.threadFrom=null;};

 /* THE FIVE SIGNS. Round OR: "let's do the new symbol as the icon, so the
    colour, our design engine, is consistent". Each mask has one sign, drawn in
    the cloud's own language: a ring for a body, dots for the points that
    surround it. Dots are a stroke with a round cap and a dash of nothing, so
    they stay rings and strokes and nothing is filled, which is the ruling for
    every icon here. Orbit dresses each in one tilted orbit, the way the rings
    run round the body. 32 by 32. */
 var DOT=' stroke-dasharray="0.1 3.3" stroke-width="2.4"';
 var SIGN={
  /* small, under a huge dim mass, with threads drawn up to it */
  Child:'<path d="M3.5 12.5A12.5 12.5 0 0 1 28.5 12.5"'+DOT+'/><path d="M9 12.5A7 7 0 0 1 23 12.5"'+DOT+'/><path d="M16 17.4V13.4"'+DOT+'/>'
   +'<circle cx="16" cy="21.2" r="2.3"/><path d="M11.4 29.2c0-3.6 2-5.4 4.6-5.4s4.6 1.8 4.6 5.4"/>',
  /* a head, and the beam going out over the watchers */
  Preteen:'<circle cx="16" cy="25.4" r="2.4"/><path d="M8.6 21.2A8.4 8.4 0 0 1 23.4 21.2"'+DOT+'/><path d="M4 17.4A14 14 0 0 1 28 17.4"'+DOT+'/>'
   +'<circle cx="23.5" cy="8.4" r="1.9"/><circle cx="8" cy="9.6" r="1.2"/><circle cx="15.5" cy="5.4" r="1.2"/>',
  /* a small ring thrusting at a big dotted one, and the sparks where they meet */
  Teen:'<circle cx="6.4" cy="16.4" r="3"/><path d="M11.6 16.4H18M15.4 13.4 18.4 16.4 15.4 19.4"/><circle cx="22.8" cy="16" r="8.4"'+DOT+'/><path d="M17 9.4l-2.2-2.8M17.4 23.2l-2.2 2.8"/>',
  /* a ring cut across and joined, the halves a hair apart, and a file under it */
  Adult:'<path d="M8.4 12.4A8 8 0 0 1 24.4 12.4"/><path d="M7 14.4A8 8 0 0 0 23 14.4"/><path d="M2.6 13.4H29.4"'+DOT+'/><path d="M19.4 24.4h8M17 28.4h10.4"/><path d="M12.4 24.4h2.4"/>',
  /* a tall rigid body inside a fixed lattice */
  Ideological:'<rect x="12" y="4.6" width="8" height="22.8" rx="3.4"/><path d="M5.4 5V27M26.6 5V27M4.6 10.4H27.4M4.6 21.6H27.4"'+DOT+'/>'};
 var ORBIT='<ellipse cx="16" cy="16" rx="14.6" ry="4.8" transform="rotate(-26 16 16)"'+DOT+'/>';
 function glyph(nm){return (SIGN[nm]||'')+ORBIT;}
 function maskCols(m){var a=m.b.map(function(s){return PAL[s];});return [a[0],a[a.length-1]];}

 return {Scene:Scene,SIGN:SIGN,glyph:glyph,maskCols:maskCols,maskDef:maskDef,AX:AX,PCOL:PCOL,SEATC:SEATC,PER:PER,
  addr:function(){addrInit();return ADDR;},bySeat:function(){addrInit();return BYSEAT;},seatState:seatState,
  leadPat:leadPat,maskLoad:maskLoad,seatF:seatF,SEATGY:SEATGY,mixPose:mixPose,buildFig:buildFig,REST:REST,
  heatRamp:heatRamp,NBIN:NBIN};
})();
