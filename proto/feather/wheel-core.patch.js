/* ============================================================
   THE CORE, REWRITTEN. Drop-in replacement for atuned_src/ui/wheel.js
   lines 99 and 253 to 322, that is CORE_STEP, coreLayerA, coreOpen,
   CORE_LAYER_NM, coreResolved, coreFeather and coreInside.

   This file is the exact replacement text, in order, so it can be
   diffed against the original and pasted. It is not loaded by the
   build and nothing in the repository requires it. It parses inside
   wheel.js, which was checked by substitution before it was written
   down.

   What changes, in one paragraph. The core stops drawing three
   populations in three units at three calibrations and draws one: the
   twenty one laws of moral integrity, grouped into the seven seats
   they are seated at, on the seven arcs the shell outside already uses
   for those seats. Length is the law, the hub ring is zero and the rim
   is ten, for every mark, so the quarter step rings are true. Vibrancy
   moves the vane and never the width. A law nobody has answered is a
   bare quill with an open tip rather than a full feather at the blank
   value. And every one of the twenty one is a target in HIT, of kind
   law, which the existing describe() and pointerdown already serve.
   ============================================================ */

/* ---- 1. the thresholds. was [1.45,2.30,3.40]. ---------------------
   The triad comes out. It was three states scored 0 to 1 drawn on a
   ring scale calibrated 0 to 10, it reached 8.6 at a true value of
   1.00, and it already has a door on the key strip above the wheel
   through runXYZDrill. Two steps left, and they are a sum and its
   parts rather than three unrelated populations:

     1.45  the seven seats. one wedge each, filled to that seat's
           integrity, which is bandIg over ten.
     2.30  the twenty one laws. each seat wedge resolves into the two
           to four feathers it is the mean of.

   3.40 goes because the shell is fully on screen only to zoom 2.08,
   which is the measurement that already brought FET_STEP down, and
   the deepest core layer was landing after the ring had left the
   frame. */
const CORE_STEP=[1.45,2.30];

/* how far in each layer is, 0 to 1, over a ramp of its own threshold. */
function coreLayerA(i){
 var z=S.zoom||1, t=CORE_STEP[i];
 return Math.max(0,Math.min(1,(z-t)/(t*0.42)));}
/* what the core has resolved, for the readout under the tab bar.
   THIS ITERATED BY HAND AND MUST NOT. It read coreLayerA(2) from a
   literal, so shortening CORE_STEP by one would have silently read
   undefined and returned NaN. */
function coreOpen(){
 var m=0;
 for(var i=0;i<CORE_STEP.length;i++)m=Math.max(m,coreLayerA(i));
 return m;}
const CORE_LAYER_NM=['the seven seats','the twenty one laws'];
function coreResolved(){
 var n='';
 for(var i=0;i<CORE_STEP.length;i++) if(coreLayerA(i)>0.5)n=CORE_LAYER_NM[i];
 return n;}

/* ---- 2. the geometry, as arithmetic ------------------------------
   THE RIM IS TEN AND THE HUB IS ZERO, FOR EVERY MARK.

   The old core had three scales on one set of rings. Rings at
   cr0*0.93*f, the laws drawn to cr0*0.93*v, the seats to cr0*0.86*v
   and the triad to cr0*0.80*v. Measured against the rings a seat at a
   true 10 read 9.25 and a triad at a true 1.00 read 8.60. A chart
   whose gridlines are wrong for two of its three series is not a
   chart. One constant now, and it is the rim.

   And a hub, because twenty one spokes meeting at a point is a knot,
   and every short reading lives in the knot, so the readings that
   matter most were the ones buried. The hub ring is zero. A law at
   zero is a tick on the hub with no feather on it, which is the
   honest drawing of nothing. */
const CORE_HUB=0.15, CORE_RIM=0.93;
function coreRad(v){return CORE_HUB+(CORE_RIM-CORE_HUB)*Math.max(0,Math.min(10,v))/10;}

/* THE SEAT ARCS ARE THE SHELL'S OWN.

   n.ang is set once in engine/core.js at load and never moves, so the
   span each seat occupies on the ring is a constant and is computed
   once here. Taking it rather than inventing a fresh division is the
   whole point: the core becomes an exploded view of the ring around
   it, a person can run a line from a feather straight out to the band
   it belongs to, and the seat names the shell already draws outside
   the rim label the core's sectors at no cost. No text goes over the
   hero graphic to achieve it.

   The trade, stated. The shell's seats are unequal, because the seats
   hold unequal numbers of the hundred and twelve, so a law's wedge is
   13.3 degrees at the Throat and 26.7 at the Sacral. Angular width
   carries no quantity here, length does, so this is a layout artifact
   and not a lie. The alternative is twenty one equal slots at 17.14
   degrees, which reads slightly more even and no longer points at
   anything. */
const CORE_SEAT=(function(){
 var o={};
 BANDS.forEach(function(b){
  var seg=W.filter(function(n){return n.b===b;});
  if(!seg.length){o[b]={a0:0,a1:0};return;}
  var angs=seg.map(function(n){return n.ang;}).sort(function(x,y){return x-y;});
  /* out to the far edge of the last node rather than to its centre, so the
     seven arcs tile the circle exactly and share their boundaries with the
     shell's. The slot width is read off the ring rather than typed in. */
  var a0=angs[0], a1=angs[angs.length-1]+TAU/W.length;
  o[b]={a0:a0,a1:a1<a0?a1+TAU:a1};});
 return o;})();
/* one slot per law, inside its own seat's arc, in SI order. SI is already
   contiguous by seat, so the seven groups come out contiguous without a sort. */
const CORE_SLOT=(function(){
 var by={};SI.forEach(function(l){(by[l.b]=by[l.b]||[]).push(l);});
 return SI.map(function(l,i){
  var grp=by[l.b], k=grp.indexOf(l), n=grp.length, s=CORE_SEAT[l.b];
  var w=(s.a1-s.a0)/n;
  return {j:i, nm:l.nm, b:l.b, k:k, n:n,
   a:s.a0+w*(k+0.5), a0:s.a0+w*k, a1:s.a0+w*(k+1), w:w};});})();

/* VIBRANCY, DEFINED, because the word has to name a number.
   The charge sitting on the seat a law is seated at, inverted: 0 means the
   seat is carrying its whole load, 1 means it is clear. Over 0 to 7, which
   is the measured range across the reference roster, 0.0 at Rosa and 6.7 at
   Tomas, so the channel uses its width instead of a fifth of it. */
function coreSeatLoad(b){
 var seg=W.filter(function(n){return n.b===b;});
 return seg.length?seg.reduce(function(a,n){return a+n.sq;},0)/seg.length:0;}
function coreVib(b){return Math.max(0,Math.min(1,1-coreSeatLoad(b)/7));}

/* BREATH. The rate is the reading and not a constant.

   A single sine at 1.4 rad/s drove the core and nothing else, so a person at
   CQ 18 and a person at CQ 88 were given identically paced breath on an
   instrument whose subject is a nervous system. Period runs 5.0 seconds at
   CQ 100 down to 2.0 at CQ 0, which is slow and deep against fast and
   shallow, and each seat is offset so the figure overlaps rather than
   pumping: the Root leads and the Crown arrives about a sixth of a cycle
   later. Amplitude is 1 to 3 percent of the radius, which at a 166 pixel core
   is 1.7 to 5 pixels, above the resolution of the display, which the old
   0.07 pixels per frame was not. */
function coreBreath(cq,phase){
 if(REDUCED)return 0;
 var per=lerp(2.0,5.0,cq/100), amp=lerp(0.010,0.030,cq/100);
 return Math.sin((S.t/per)*TAU+phase)*amp;}

/* ---- 3. the marks ------------------------------------------------ */
/* ONE FEATHER. A rachis from the hub out to the tip, barbs either side
   thinning to both ends, and a vane behind them at low alpha so a dense
   sector still reads as a shape rather than as a scribble.

   r1 minus r0 is the reading. wid is the half width and is a constant: see
   the verdict in DESIGN-feathers.md. dens is 0 to 1 and moves how many barbs
   there are and how hard they are drawn, which is the channel the owner's
   width was asking for and the one that does not multiply into the length. */
function coreFeather(a,r0,r1,wid,col,al,dens){
 if(al<=0.01)return;
 var L=r1-r0;
 var ca=Math.cos(a), sa=Math.sin(a), nx=-sa, ny=ca;
 var bx=CX+ca*r0, by=CY+sa*r0, tx=CX+ca*r1, ty=CY+sa*r1;
 /* the tick on the hub. a law at zero is still a law and still a target. */
 g.beginPath(); g.arc(bx,by,Math.max(1.4,wid*0.11),0,TAU);
 g.fillStyle=rgba(col,al*0.55); g.fill();
 if(L<=2)return;
 var mid=r0+L*0.42;
 g.beginPath();
 g.moveTo(bx,by);
 g.quadraticCurveTo(CX+ca*mid+nx*wid, CY+sa*mid+ny*wid, tx,ty);
 g.quadraticCurveTo(CX+ca*mid-nx*wid, CY+sa*mid-ny*wid, bx,by);
 g.closePath();
 g.fillStyle=rgba(col,al*0.085*(0.35+0.65*dens)); g.fill();
 var n=Math.max(2,Math.round(L/10*lerp(0.5,1.15,dens)));
 g.lineWidth=Math.max(0.7,wid*0.17);
 g.strokeStyle=rgba(col,al*lerp(0.16,0.70,dens));
 for(var i=1;i<=n;i++){
  var f=i/(n+1), rr=r0+L*f, px=CX+ca*rr, py=CY+sa*rr;
  var bw=wid*Math.sin(f*Math.PI);
  g.beginPath();
  g.moveTo(px-nx*bw,py-ny*bw);
  g.quadraticCurveTo(px+ca*L*0.05,py+sa*L*0.05,px+nx*bw,py+ny*bw);
  g.stroke();}
 g.beginPath(); g.moveTo(bx,by); g.lineTo(tx,ty);
 g.strokeStyle=rgba(col,al*0.98);
 g.lineWidth=Math.max(1,wid*0.28); g.lineCap='round'; g.stroke(); g.lineCap='butt';
 /* the tip. the end of a reading has to be findable, so it is a mark and not
    the place the ink happens to stop. */
 g.beginPath(); g.arc(tx,ty,Math.max(1.6,wid*0.15),0,TAU);
 g.fillStyle=rgba(mixc(col,[255,255,255],0.4),al*0.9); g.fill();}

/* A LAW NOBODY HAS ANSWERED IS NOT A READING AND IS NOT DRAWN AS ONE.

   The blank profile sits at the default on all twenty one, so the old core
   drew twenty eight identical marks for somebody who had typed nothing, and
   measured against the roster it was the second heaviest figure in it: 22,275
   pixels of feather against Marcus at 20,358 with a full story and twenty one
   answers. The screen said more about a person the less it knew. A law nobody
   has answered gets a bare quill: rachis, no vane, no barbs, open tip, at the
   blank value. A shaft with no vane carries no air. */
function coreQuill(a,r0,r1,wid,col,al){
 var ca=Math.cos(a), sa=Math.sin(a);
 g.beginPath(); g.moveTo(CX+ca*r0,CY+sa*r0); g.lineTo(CX+ca*r1,CY+sa*r1);
 g.strokeStyle=rgba(col,al*0.80); g.lineWidth=Math.max(1,wid*0.20);
 g.lineCap='round'; g.stroke(); g.lineCap='butt';
 g.beginPath(); g.arc(CX+ca*r1,CY+sa*r1,Math.max(2.2,wid*0.17),0,TAU);
 g.strokeStyle=rgba(col,al*0.95); g.lineWidth=1.2; g.stroke();}

/* WHAT IS LEFT. The span from the tip to the rim is the part of that law the
   person does not keep, as a dotted spine and up to four faint combs. It is
   how the mark says what it is out of without a word being set over the hero
   graphic, and it is static: a mark that says this is missing does not need
   to move, and there are twenty one of them on screen at once. */
function coreDeficit(a,r1,rim,col,dim){
 var gap=rim-r1; if(gap<6)return;
 var ca=Math.cos(a), sa=Math.sin(a), nx=-sa, ny=ca;
 g.save();
 g.setLineDash([2,5]); g.lineWidth=1;
 g.strokeStyle=rgba(col,0.17*dim);
 g.beginPath(); g.moveTo(CX+ca*r1,CY+sa*r1); g.lineTo(CX+ca*rim,CY+sa*rim); g.stroke();
 g.setLineDash([]);
 var n=Math.min(4,Math.max(1,Math.round(gap/34)));
 g.strokeStyle=rgba(col,0.13*dim); g.lineWidth=1;
 for(var i=1;i<=n;i++){
  var rr=r1+gap*(i/(n+1)), px=CX+ca*rr, py=CY+sa*rr, bw=gap*0.045+3;
  g.beginPath(); g.moveTo(px-nx*bw,py-ny*bw); g.lineTo(px+nx*bw,py+ny*bw); g.stroke();}
 g.restore();}

/* ---- 4. the interior --------------------------------------------- */
function coreInside(r,cr0){
 var a0=coreLayerA(0), a1=coreLayerA(1);
 if(a0+a1<=0)return;
 var rim=cr0*CORE_RIM, hub=cr0*CORE_HUB;
 var ink=INK();
 g.save();
 g.beginPath(); g.arc(CX,CY,cr0*0.985,0,TAU); g.clip();
 /* THE SCALE, SO A LENGTH CAN BE READ. Five rings now, because the hub ring
    is zero and has to be drawn or the baseline is invented. Quarter steps,
    the rim heavier because ten is the thing every mark is out of. */
 [0,0.25,0.5,0.75,1].forEach(function(f){
  g.beginPath(); g.arc(CX,CY,cr0*(CORE_HUB+(CORE_RIM-CORE_HUB)*f),0,TAU);
  g.strokeStyle=rgba(ink,0.055+(f===1?0.07:f===0.5?0.04:f===0?0.05:0));
  g.lineWidth=1; g.stroke();});
 /* the seat boundaries, on the shell's own divisions, in the seat's colour at
    a tenth, so the seven groups read without a word. */
 BANDS.forEach(function(b){
  var s=CORE_SEAT[b];
  g.beginPath(); g.moveTo(CX+Math.cos(s.a0)*hub,CY+Math.sin(s.a0)*hub);
  g.lineTo(CX+Math.cos(s.a0)*rim,CY+Math.sin(s.a0)*rim);
  g.strokeStyle=rgba(bc(b),0.10); g.lineWidth=1; g.stroke();});

 /* 1. THE SEVEN SEATS. One wedge each, filled to that seat's integrity, which
    is the mean of the two to four laws it holds. It arrives first because it
    is the sum, and the laws that resolve out of it are its parts. It fades as
    the laws come in: the same quantity drawn twice on one screen is the
    defect this whole pass is fixing. */
 var seatA=a0*(1-a1*0.86);
 if(seatA>0.01)BANDS.forEach(function(b,bi){
  var s=CORE_SEAT[b], v=bandIg(b)/10;
  var rr=cr0*coreRad(bandIg(b))*(1+coreBreath(r.CQ,bi/7*1.05));
  g.beginPath();
  g.moveTo(CX+Math.cos(s.a0)*hub,CY+Math.sin(s.a0)*hub);
  g.arc(CX,CY,rr,s.a0,s.a1);
  g.lineTo(CX+Math.cos(s.a1)*hub,CY+Math.sin(s.a1)*hub);
  g.arc(CX,CY,hub,s.a1,s.a0,true);
  g.closePath();
  g.fillStyle=rgba(bc(b),seatA*(0.10+v*0.16)); g.fill();
  g.strokeStyle=rgba(bc(b),seatA*0.55); g.lineWidth=1.2; g.stroke();});

 /* 2. THE TWENTY ONE LAWS. One feather each, at its own value, inside its own
    seat's arc. These are the numerator of CQ: Ig is their mean. */
 if(a1>0)CORE_SLOT.forEach(function(s){
  var v=(S.law[s.nm]||0), col=bc(s.b), vv=coreVib(s.b);
  var known=!!(CURP&&CURP.laws&&CURP.laws[s.nm]!=null);
  /* THE HOVERED MARK IS LIT AND THE REST GIVE GROUND. Twenty one marks in one
     circle means the answer to "which one is that" has to be drawn, not
     hunted. 160ms of ease out on the alpha, which is one element state
     change, not a transition. */
  /* the lit value is eased, not switched. 0.21 per frame reaches 90 percent
     in about 160ms at 60fps, which is the micro state band, and it uses the
     same per frame easing the wheel already runs on n.disp so the two cannot
     drift to different feels. */
  var want=(S.hlaw==null)?0.86:(S.hlaw===s.j?1:0.42);
  s.la=(s.la===undefined)?0.86:s.la+(want-s.la)*(REDUCED?1:0.21);
  var al=a1*s.la, dim=s.la/0.86;
  var tip=cr0*coreRad(v)*(1+coreBreath(r.CQ,BANDS.indexOf(s.b)/7*1.05));
  var wid=0.046*cr0;
  coreDeficit(s.a,tip,rim,col,Math.min(1,dim)*a1);
  if(known)coreFeather(s.a,hub,tip,wid,col,al,vv);
  else coreQuill(s.a,hub,tip,wid,col,al*0.55);});
 /* the scale again, faintly, over the ink. twenty one vanes at low alpha add
    up to an opaque field in the inner half and the rings were lost under it. */
 [0.25,0.5,0.75,1].forEach(function(f){
  g.beginPath(); g.arc(CX,CY,cr0*(CORE_HUB+(CORE_RIM-CORE_HUB)*f),0,TAU);
  g.strokeStyle=rgba(ink,f===1?0.10:0.045); g.lineWidth=1; g.stroke();});
 g.restore();

 /* ---- the targets. ------------------------------------------------
    THE SAME ARRAY EVERYTHING ELSE ON THE WHEEL USES, and the same wedge shape
    the wheel already pushes for laws, seats, archetypes and domains, so the
    pointer scan in ui.js needs no new branch and describe() and pointerdown
    already serve kind law: hover names it and a press runs runLawDrill.

    THE TARGET IS THE SECTOR, NOT THE FEATHER. A law at 1 of 10 is a short
    mark and it is the one a person most wants to press, so the target does
    not shrink with the reading. It runs the full depth of the sector.

    ON A COARSE POINTER THE TARGET IS THE SEAT. Measured at 390 wide: the core
    radius is 178, a law wedge is 13.3 to 26.7 degrees and is 36 to 77 pixels
    across at the rim, and six of the twenty one are under the 44 pixel floor
    at their widest point. A seat wedge is 149. So a finger gets seven targets
    and the seat drill lists its laws as rows, which is the pattern the drills
    already use, and a mouse gets twenty one. */
 if(a1>0.25){
  if(typeof COARSE!=='undefined'&&COARSE){
   BANDS.forEach(function(b){var s=CORE_SEAT[b];
    HIT.push({k:'seat',b:b,cx:CX,cy:CY,a0:s.a0,a1:s.a1,r0:hub,r1:rim});});}
  else CORE_SLOT.forEach(function(s){
   HIT.push({k:'law',j:s.j,core:1,cx:CX,cy:CY,
    a0:s.a0,a1:s.a1,r0:hub,r1:rim});});}
 else if(a0>0.25){
  BANDS.forEach(function(b){var s=CORE_SEAT[b];
   HIT.push({k:'seat',b:b,cx:CX,cy:CY,a0:s.a0,a1:s.a1,r0:hub,r1:rim});});}}

/* ---- 5. the law spokes hand off --------------------------------------
   Replaces the SI.forEach block at ui/wheel.js:735-741 and the ring and pill
   under it at :742-744.

   The twenty one laws were already on this wheel, as short spokes on a ring
   just outside the core, with twenty one working targets and a working drill.
   Measured at 1600 wide, that ring sits at 1.22 times the core rim at every
   zoom, so the two never overlap and both are on screen together above zoom
   2.30. One quantity, drawn twice, four pixels wide in one place and a
   hundred and fifty in the other. The spokes give way as the feathers arrive,
   over the feathers' own ramp, so the handoff is the thing a person sees: the
   laws did not vanish, they went inside.

   Nothing is lost below the threshold. At zoom 1 the spokes are the only copy
   and they are untouched. */
function lawSpokes(r,L,ink){
 var give=1-coreLayerA(1);                 /* 1 outside the core, 0 once inside */
 if(give<=0.02)return;
 SI.forEach(function(l,i){
  var a=i/21*TAU-Math.PI/2, v=S.law[l.nm]/10, c=bc(l.b);
  var r0=[U*.44,U*.40,U*.33,U*.255][L], r1=r0+[U*.13,U*.12,U*.10,U*.085][L]*v;
  g.beginPath(); g.moveTo(CX+Math.cos(a)*r0,CY+Math.sin(a)*r0);
  g.lineTo(CX+Math.cos(a)*r1,CY+Math.sin(a)*r1);
  g.strokeStyle=rgba(c,(.16+v*.82)*give); g.lineWidth=[4.6,4.2,3.6,3.2][L];
  g.lineCap='round'; g.stroke(); g.lineCap='butt';
  /* the target goes with the ink. a spoke at a tenth of an alpha is not a
     control, and leaving it pressable puts two doors on one number. */
  if(give>0.5)HIT.push({k:'law',j:i,cx:CX,cy:CY,a0:a-.075,a1:a+.075,r0:r0*.88,r1:r1+U*.03});});
 var lr=[U*.44,U*.40,U*.33,U*.255][L];
 g.beginPath(); g.arc(CX,CY,lr,0,TAU);
 g.strokeStyle=rgba(ink,.12*give); g.lineWidth=1; g.stroke();
 if(give>0.5)pill('21 laws \u00b7 integrity '+r.Ig.toFixed(1),lr-U*.035);}
