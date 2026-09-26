/* ============================================================
   THE ACTIVE OVERLAY. Three looks and a still, one engine.

   Asked for 26 September, CJ in TASKS.md, as looks and not a build: "when I
   turn on the overlay it shows me which connections are the most active, and
   maybe it's showing those lines vibrating, humming, maybe it's showing
   active thoughts running back and forth along the line."

   Every line drawn here is a chord the shipped wheel strokes, taken off the
   live build by capture.js as the three points its own quad() runs through.
   Nothing is placed by hand.

   WHAT "MOST ACTIVE" MEANS HERE, and it is a choice he has not made yet.
   A line carries the charge of its outer end into the next ring in: an
   address's charge into a saboteur, a saboteur's weight into a complex, and
   so on inward. Every level of that chain already shares one 0 to 10 scale,
   because a pattern's weight is the mean charge under it. So a line's load
   is the charge it carries, and the most active lines are the heaviest
   loads. Tension, which the wheel already draws as how taut a chord hangs,
   is carried alongside and sets pitch.

   THE SCALE IS ABSOLUTE, NOT RANKED. How hard a line moves is read off its
   load against the whole 0 to 10 scale, not against the other lines on the
   same wheel. So a quiet field's most active lines move quietly. Sofia's
   heaviest line carries 5.3 and Gordon's 9.5, and the overlay says so with
   the labels off.

   Timing is the product's own: 120, 220, 320 and 420ms, and the three curves
   in head.html. Reduced motion gets the still, which is the end state, never
   a slower animation.
   ============================================================ */
(function(){
'use strict';
var TAU=Math.PI*2;
/* ---- curves. the product's three, and one symmetric for travel ---- */
function bez(x1,y1,x2,y2){
 return function(x){if(x<=0)return 0;if(x>=1)return 1;
  var t=x;for(var i=0;i<8;i++){
   var cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx;
   var xt=((ax*t+bx)*t+cx)*t-x, d=(3*ax*t+2*bx)*t+cx;
   if(Math.abs(xt)<1e-5)break; if(Math.abs(d)<1e-6)break; t-=xt/d;}
  var cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;return ((ay*t+by)*t+cy)*t;};}
var E={out:bez(.22,1,.36,1), in:bez(.4,0,1,1), land:bez(.34,1.56,.64,1), io:bez(.65,0,.35,1)};
var T={micro:120,element:220,surface:320,context:420};
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function mix(a,b,f){return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+clamp(a,0,1).toFixed(3)+')';}
var WHITE=[255,255,255];
/* a stable number per line, so a phase is the same on every load */
function seed(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
 return ((h>>>0)%10000)/10000;}

/* ---- one chord, sampled once ----
   28 points along the wheel's quadratic, with the normal at each and the
   length so far, so a pulse travels at a true speed and a string bends
   perpendicular to itself. Built once per line; per frame is arithmetic. */
var M=28;
function sample(q){
 var p0=q[0],p1=q[1],p2=q[2],pts=[],nrm=[],cum=[0];
 for(var i=0;i<M;i++){var t=i/(M-1),u=1-t;
  var x=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], y=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1];
  var dx=2*u*(p1[0]-p0[0])+2*t*(p2[0]-p1[0]), dy=2*u*(p1[1]-p0[1])+2*t*(p2[1]-p1[1]);
  var m=Math.hypot(dx,dy)||1; pts.push([x,y]); nrm.push([-dy/m,dx/m]);
  if(i)cum.push(cum[i-1]+Math.hypot(x-pts[i-1][0],y-pts[i-1][1]));}
 return {pts:pts,nrm:nrm,cum:cum,len:cum[M-1]};}
/* the point a share of the way along by length */
function at(L,f){f=clamp(f,0,1);var want=f*L.len,i=1;
 while(i<M-1&&L.cum[i]<want)i++;
 var a=L.cum[i-1],b=L.cum[i],k=(want-a)/((b-a)||1),p=L.pts[i-1],q=L.pts[i];
 return [p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k];}

/* the wheel's own stroke for a chord at Chains, so a lifted line is the same
   line made louder and not a different line laid over it */
var BASEW=[1.6,2.4,3.2,4], WK=[[.45,1.45],[.45,1.45],[.5,1.3],[.5,1.3]];
function wheelW(l){var k=WK[l.lv];return BASEW[l.lv]*(k[0]+l.pw*k[1]);}

/* ---- the selection ----
   TWO READINGS OF "MOST ACTIVE", and which one is his call.

   overall   the N heaviest lines anywhere. True, and on most profiles it
             collapses onto the one or two heaviest addresses: on James the
             top twelve are all lines leaving Addiction and Lust, one clump
             in the Sacral quadrant.
   ring      the heaviest few at each ring of the chain, four tenths of N
             from the addresses, three from the saboteurs, two from the
             complexes, one from the hyper complexes, and no address lending
             more than two. It spreads the overlay across the depth of the
             chain, which is what a chain is, and a ring with fewer lines than
             its share hands the rest down the list. */
var SHARE=[.4,.3,.2,.1];
function build(G,n,mode){
 var all=G.links.filter(function(l){return l.load>0;}).slice()
  .sort(function(a,b){return b.load-a.load||b.pw-a.pw||b.lv-a.lv;});
 var sel;
 if(mode==='overall')sel=all.slice(0,n);
 else{
  var byLv=[[],[],[],[]],per={};
  all.forEach(function(l){
   if(l.lv===0){per[l.from]=(per[l.from]||0)+1;if(per[l.from]>2)return;}
   byLv[l.lv].push(l);});
  var want=SHARE.map(function(f){return Math.round(f*n);}),left=0;sel=[];
  for(var v=3;v>=0;v--){var k=want[v]+left;var take=byLv[v].slice(0,k);left=k-take.length;sel=sel.concat(take);}
  if(left>0)sel=sel.concat(byLv[0].slice(want[0],want[0]+left));
  sel.sort(function(a,b){return b.load-a.load||b.lv-a.lv;});}
 sel.forEach(function(l,i){
  l.rank=i; l.a=clamp((l.load-3)/7,0,1); l.S=l.S||sample(l.q);
  l.w=wheelW(l); l.sd=seed(l.from+'>'+l.to);
  l.tier=Math.floor(i/Math.max(1,Math.ceil(sel.length/5)));});
 return {all:all,sel:sel};}
/* whole chains for the relay, outermost address inward, each hop the
   heaviest line leaving the node it arrived at */
function chains(G,sel,k){
 var from={};G.links.forEach(function(l){(from[l.from]=from[l.from]||[]).push(l);});
 Object.keys(from).forEach(function(f){from[f].sort(function(a,b){return b.load-a.load;});});
 var out=[],usedA={},usedS={};
 sel.filter(function(l){return l.lv===0;}).forEach(function(l){
  if(out.length>=k||usedA[l.from]||usedS[l.to])return;
  var path=[l],cur=l.to;
  while(from[cur]&&from[cur].length){var nx=from[cur][0];path.push(nx);cur=nx.to;}
  path.forEach(function(p){p.S=p.S||sample(p.q);p.a=clamp((p.load-3)/7,0,1);p.w=wheelW(p);});
  usedA[l.from]=1;usedS[l.to]=1;
  out.push({path:path,load:path.reduce(function(s,p){return s+p.load;},0)/path.length});});
 /* a profile whose heaviest lines are all inner ones still fires */
 if(!out.length&&sel.length){var l=sel[0];l.S=l.S||sample(l.q);out.push({path:[l],load:l.load});}
 return out;}

/* ---- drawing primitives ---- */
function poly(g,L,disp,upTo){
 var n=Math.max(2,Math.round((upTo==null?1:upTo)*(M-1))+1);
 g.beginPath();
 for(var i=0;i<n;i++){var p=L.pts[i],d=disp?disp(i/(M-1)):0,nn=L.nrm[i];
  var x=p[0]+nn[0]*d,y=p[1]+nn[1]*d; if(i)g.lineTo(x,y);else g.moveTo(x,y);}
 g.stroke();}
function ring(g,x,y,r,c,a,w){if(a<=.004)return;g.beginPath();g.arc(x,y,r,0,TAU);
 g.strokeStyle=rgba(c,a);g.lineWidth=w||1.4;g.stroke();}
function disc(g,x,y,r,c,a){if(a<=.004)return;g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=rgba(c,a);g.fill();}
/* a travelling point: a head, a halo, and a tail that is the head's own
   position over the last seven frames, so the streak is exactly as long as
   the speed makes it and never a painted smear */
function head(g,pos,t,c,r,a){
 for(var j=7;j>=1;j--){var p=pos(t-j*0.016);if(!p)continue;
  disc(g,p[0],p[1],r*(1-j/9),mix(c,WHITE,.35),a*.42*(1-j/8));}
 var p0=pos(t);if(!p0)return null;
 disc(g,p0[0],p0[1],r*3.1,c,a*.16);
 disc(g,p0[0],p0[1],r,mix(c,WHITE,.7),a);
 return p0;}

/* ============================================================
   THE ENGINE
   ============================================================ */
function Overlay(o){
 this.cv=o.canvas; this.g=this.cv.getContext('2d');
 this.ox=o.ox||0; this.oy=o.oy||0;     /* the canvas origin in capture space */
 this.dpr=o.dpr||Math.min(2,window.devicePixelRatio||1);
 this.look=o.look||'hum'; this.n=o.n||12; this.mode=o.mode||'ring'; this.reduced=!!o.reduced;
 this.on=false; this.onAt=-1e9; this.offAt=-1e9; this.vis=0;
 this.stat={ms:0,moving:0,lines:0,frames:0,acc:0};
 this.setData(o.G);}
Overlay.prototype.setData=function(G){
 this.G=G; var b=build(G,this.n,this.mode); this.all=b.all; this.sel=b.sel;
 this.nodes=G.nodes;
 this.paths=chains(G,this.sel,clamp(Math.round(this.n/4),2,6));
 this.t0=null;};
Overlay.prototype.setN=function(n){this.n=n;this.setData(this.G);};
Overlay.prototype.set=function(on,now){
 if(on===this.on)return; this.on=on;
 if(on){this.onAt=now;}else{this.offAt=now;this.visAtOff=this.vis;}};
Overlay.prototype.size=function(w,h){
 this.W=w;this.H=h;this.cv.width=Math.round(w*this.dpr);this.cv.height=Math.round(h*this.dpr);
 this.cv.style.width=w+'px';this.cv.style.height=h+'px';};
/* how far in one line is, for the on choreography: dim first, then the lines
   draw themselves on from the address inward, heaviest tier first, 60ms
   apart. Off is one fade for all of them, faster than on, on the leaving
   curve. */
Overlay.prototype.lineIn=function(l,now){
 if(this.reduced) return this.on?1:0;
 if(this.on){var e=now-this.onAt-T.micro-l.tier*60; return E.out(clamp(e/260,0,1));}
 var k=E.in(clamp((now-this.offAt)/T.element,0,1)); return (this.visAtOff||1)*(1-k);};
Overlay.prototype.frame=function(now){
 var t0=performance.now();
 var g=this.g,self=this; g.setTransform(this.dpr,0,0,this.dpr,0,0);
 g.clearRect(0,0,this.W,this.H); g.translate(-this.ox,-this.oy);
 g.lineCap='round'; g.lineJoin='round';
 this.vis=this.on?1:(this.reduced?0:(this.visAtOff||0)*(1-E.in(clamp((now-this.offAt)/T.element,0,1))));
 var moving=0, drawn=0;
 if(this.on||this.vis>0.001){
  var look=this.reduced?'still':this.look, ts=now/1000;
  var r=this['draw_'+look](g,now,ts); moving=r.moving; drawn=r.lines;}
 var dt=performance.now()-t0;
 this.stat.frames++; this.stat.acc+=dt;
 if(this.stat.frames>=60){this.stat.ms=this.stat.acc/this.stat.frames;this.stat.frames=0;this.stat.acc=0;}
 this.stat.moving=moving; this.stat.lines=drawn; this.stat.last=dt;
 return this.stat;};

/* ---- THE STILL. The end state every look lands on, and the whole of what
   reduced motion gets. The heaviest lines at the wheel's own stroke made
   louder, the rest of the web already at the wheel's selection dim beneath.
   Width carries the load: a line at 10 is drawn half again as heavy as one
   at 3. ---- */
Overlay.prototype.draw_still=function(g,now){
 var self=this;
 this.sel.slice().reverse().forEach(function(l){var v=self.lineIn(l,now);if(v<=0)return;
  g.strokeStyle=rgba(mix(l.col,WHITE,.18),.92);
  g.lineWidth=l.w*(1+.3*l.a); poly(g,l.S,null,v);});
 this.endBeads(g,now);
 return {moving:0,lines:this.sel.length};};
/* the beads a lit line lands on get a ring, so the end of a line is found as
   well as the line. Ring, not fill: the product's icon rule. */
Overlay.prototype.endBeads=function(g,now,flash){
 var self=this,seen={};
 this.sel.forEach(function(l){if(seen[l.to])return;seen[l.to]=1;
  var n=self.nodes[l.to]; if(!n)return; var v=self.lineIn(l,now);
  var f=flash?flash(l.to):0;
  ring(g,n.p[0],n.p[1],n.s+3+Math.min(10,f*n.s*1.1),mix(n.col,WHITE,.45),v*(.34+.5*f),1.2);
  if(f>0)disc(g,n.p[0],n.p[1],n.s*(1+.25*f),mix(n.col,WHITE,.55),.3*f*v);});};

/* ============================================================
   1. HUM. A plucked string.

   Each lit line rings at a pitch set by its tension and an amplitude set by
   its load, which is what a real string does: tighten it and it sounds
   higher, strike it harder and it swings wider. The wheel already hangs a
   taut chord straight and a slack one bellied, so the pitch is a reading the
   picture was already making, now audible to the eye.

     pitch      4 Hz slack to 10 Hz taut, the wheel's own tension
     hum        0.5 to 1.5 px at rest, the life between plucks
     pluck      2 to 6.5 px, decaying on a 550ms time constant
     plucked    every 3.4s at a load of 3 down to every 1.6s at 10

   Two strokes per line. The second is the string at the other extreme of
   its swing, faint, because a string vibrating faster than the eye resolves
   is seen as its envelope and not as a line: that lens is what a humming
   string looks like. The bead it feeds takes a ring on each pluck, late,
   which is the secondary action that makes the pluck read as arriving
   somewhere.
   ============================================================ */
Overlay.prototype.draw_hum=function(g,now,ts){
 var self=this,moving=0,pl={};
 this.sel.slice().reverse().forEach(function(l){var v=self.lineIn(l,now);if(v<=0)return;
  var f=4+6*l.ten, P=3.4-1.8*l.a, ph=l.sd*P;
  var since=((ts+ph)%P), A0=.5+1.0*l.a, A1=2+4.5*l.a;
  /* a short string swings less than a long one struck as hard, so the swing
     is held to six hundredths of the line's own length: 6.5 pixels on a 40
     pixel line read as the line breaking, not ringing */
  var A=Math.min((A0+(A1-A0)*Math.exp(-since/.55)),l.S.len*.06+.4)*v;
  var disp=function(tt){return function(s){
   return A*(Math.sin(Math.PI*s)*Math.sin(TAU*f*tt)+.22*Math.sin(TAU*s)*Math.sin(TAU*2*f*tt+1.3));};};
  var c=mix(l.col,WHITE,.18), sw=l.w*(1+.2*l.a)*(1+.25*(A/A1));
  g.strokeStyle=rgba(c,.22*v); g.lineWidth=sw; poly(g,l.S,disp(ts-1/(2*f)),v);
  g.strokeStyle=rgba(c,.94*v); g.lineWidth=sw; poly(g,l.S,disp(ts),v);
  /* the ring on the bead it feeds, 40ms after the pluck, over 420ms */
  var k=(since-.04)/.42; if(k>0&&k<1)pl[l.to]=Math.max(pl[l.to]||0,(1-E.out(k))*(.4+.6*l.a));
  moving++;});
 this.endBeads(g,now,function(id){return pl[id]||0;});
 return {moving:moving,lines:this.sel.length};};

/* ============================================================
   2. PULSE. Thoughts running along the line.

   Points travel each lit line and back. Inward, from the address toward the
   pattern it builds, is bright: that is the direction charge compounds.
   Outward is the same point returning at half strength, the pattern feeding
   the address that feeds it, which is the loop.

     points     1 on a line at load 3, 3 at load 10
     one way    1.9s at load 3 down to 0.9s at 10
     motion     simple harmonic: slow at each end, fastest mid line, so a
                point arrives and leaves rather than bouncing off a wall

   The line under the points is lifted and still, so the lit set reads before
   anything has moved. The bead flashes as a point lands on it.
   ============================================================ */
Overlay.prototype.draw_pulse=function(g,now,ts){
 var self=this,moving=0,fl={};
 this.sel.slice().reverse().forEach(function(l){var v=self.lineIn(l,now);if(v<=0)return;
  g.strokeStyle=rgba(mix(l.col,WHITE,.12),.62*v); g.lineWidth=l.w*(1+.2*l.a); poly(g,l.S,null,v);});
 this.sel.forEach(function(l){var v=self.lineIn(l,now);if(v<.6)return;
  var cnt=1+Math.round(2*l.a), Tw=1.9-1.0*l.a;
  for(var k=0;k<cnt;k++){var ph=k/cnt+l.sd;
   var pos=function(tt){var u=((tt/Tw)/2+ph)%1; if(u<0)u+=1;
    var w=u<.5?u*2:2-u*2; return at(l.S,(1-Math.cos(Math.PI*w))/2);};
   var u=((ts/Tw)/2+ph)%1, inward=u<.5, w=inward?u*2:2-u*2;
   head(g,pos,ts,l.col,1.6+1.4*l.a,(inward?1:.5)*clamp((v-.6)/.4,0,1));
   if(inward&&w>.9)fl[l.to]=Math.max(fl[l.to]||0,(w-.9)/.1*(.5+.5*l.a));
   moving++;}});
 this.endBeads(g,now,function(id){return fl[id]||0;});
 return {moving:moving,lines:this.sel.length};};

/* ============================================================
   3. RELAY. The chain fires, one at a time.

   A chain is how a charge compounds: address into saboteur into complex
   into hyper complex into character, each built from the one outside it.
   The relay fires one whole chain at a time, outermost address first, and
   hands the charge inward hop by hop:

     anticipation  the address brightens for 120ms before anything leaves
     hop           one point crosses the line in 280ms, symmetric ease
     landing       the bead swells and rings on the overshoot curve, 420ms
     the line      rings behind the point like a plucked string, 450ms
     next hop      90ms after landing
     next chain    420ms after the last one lands; 900ms rest per cycle

   Between firings every lit chain stays drawn, still, at the Still's
   strength less a third, so the answer to "which are most active" never
   waits on an animation. One thing moves at a time, in the order the eye
   should take it. It is the look least likely to wear at the fortieth
   viewing, because most of the time it is at rest.
   ============================================================ */
var HOP=280, GAP=90, NEXT=420, REST=900, ANT=120;
Overlay.prototype.relayPlan=function(){
 var plan=[],t=0;
 this.paths.forEach(function(P){
  plan.push({P:P,t:t});
  t+=ANT+P.path.length*(HOP+GAP)+NEXT;});
 return {plan:plan,len:t+REST};};
Overlay.prototype.draw_relay=function(g,now,ts){
 var self=this,moving=0,fl={},seen={};
 if(!this._plan||this._planFor!==this.paths){this._plan=this.relayPlan();this._planFor=this.paths;}
 var PL=this._plan, base=this.onAt+T.surface+200;
 var cyc=function(ms){return ((ms-base)%PL.len+PL.len)%PL.len;};
 var v=this.lineIn({tier:0},now), tc=cyc(now);
 /* the map, at rest */
 this.paths.forEach(function(P){P.path.forEach(function(l){var id=l.from+'>'+l.to;if(seen[id])return;seen[id]=1;
  g.strokeStyle=rgba(mix(l.col,WHITE,.12),.55*v); g.lineWidth=l.w*(1+.35*l.a); poly(g,l.S,null,v);});
  var n=self.nodes[P.path[0].from];
  if(n)ring(g,n.p[0],n.p[1],n.s+3,mix(n.col,WHITE,.45),.5*v,1.2);});
 var live=this.on&&now>=base;
 if(live)PL.plan.forEach(function(E0){
  var e=tc-E0.t, P=E0.P; if(e<0)return;
  if(e>ANT+P.path.length*(HOP+GAP)+700)return;
  /* anticipation at the address */
  var a0=self.nodes[P.path[0].from];
  if(a0){var ka=e<ANT?E.in(e/ANT):Math.max(0,1-(e-ANT)/T.surface);
   if(ka>0){disc(g,a0.p[0],a0.p[1],a0.s*2.4,a0.col,.35*ka);
    ring(g,a0.p[0],a0.p[1],a0.s+3+4*ka,mix(a0.col,WHITE,.6),.8*ka,1.4);moving++;}}
  P.path.forEach(function(l,h){
   var hs=ANT+h*(HOP+GAP), k=(e-hs)/HOP;
   if(k<0)return;
   /* the line lifts as the point crosses it and falls back after */
   var lift=k<1?E.out(k):Math.max(0,1-(e-hs-HOP)/700);
   if(lift<=0)return;
   var since=(e-hs-HOP)/1000, A=since>0?Math.min(1.5+3.5*l.a,l.S.len*.06+.4)*Math.exp(-since/.45):0, f=4+6*l.ten;
   var disp=A>0.05?function(s){return A*Math.sin(Math.PI*s)*Math.sin(TAU*f*since);}:null;
   g.strokeStyle=rgba(mix(l.col,WHITE,.3),.4+.55*lift); g.lineWidth=l.w*(1+.35*l.a)*(1+.25*lift);
   poly(g,l.S,disp,k<1?E.io(k):1); moving++;
   if(k<1)head(g,function(tt){var kk=(cyc(tt*1000)-E0.t-hs)/HOP;
      return kk<0||kk>1?null:at(l.S,E.io(kk));},now/1000,l.col,2.2+1.2*l.a,1);
   else if(since<.42)fl[l.to]=Math.max(fl[l.to]||0,1-since/.42);});});
 this.relayBeads(g,v,fl);
 return {moving:moving,lines:Object.keys(seen).length};};
Overlay.prototype.relayBeads=function(g,v,fl){
 var self=this,seen={};
 this.paths.forEach(function(P){P.path.forEach(function(l){if(seen[l.to])return;seen[l.to]=1;
  var n=self.nodes[l.to];if(!n)return;var f=fl[l.to]||0;
  ring(g,n.p[0],n.p[1],n.s+3,mix(n.col,WHITE,.4),.34*v,1.2);
  if(f>0){
   /* the landing. the bead swells and settles, and a ring runs out past it
      on the overshoot curve, so the arrival has weight */
   var k=1-f;
   disc(g,n.p[0],n.p[1],n.s*(1+.3*Math.sin(Math.PI*k)),mix(n.col,WHITE,.55),.32*f);
   ring(g,n.p[0],n.p[1],n.s+3+Math.min(12,n.s*1.2)*E.land(k),mix(n.col,WHITE,.6),.8*f,1.4);}});});};

window.Overlay=Overlay; window.OVL_E=E; window.OVL_T=T;
})();
