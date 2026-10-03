/* ============================================================
   THE HOVER OVERLAY. CU in TASKS.md, 26 September. One line at a time.

   His words, which replace the Active toggle CL built: "if I hover over one
   of the lines, that's the animation it does, it traces the entire thing,
   then holds and hums, and the amount it hums is based on the tension of
   those lines, so if it's a saboteur that's really hot, like Victim 92%,
   you'll see it really vibrating, but Victim 5%, almost nothing." And then:
   "the color density shows the weight of the entire chain. The lighter, the
   more transparent... the darker, the heavier, the entire chain. Subtle, not
   overly."

   So there is no button. A pointer resting on a chord is the whole control.

   THE STORY OF ONE HOVER, pose to pose:

     lift       90ms    the line's outer bead draws its ring in, the
                        backswing, and the rest of the web starts stepping
                        back to the wheel's own .08 over 320ms
     trace      260 to 520ms, at one speed, so a long line takes longer
                        than a short one. A bright head crosses the line from
                        its outer end inward, the direction charge compounds,
                        on the symmetric curve, and lays the line down behind
                        it. This is CL's Pulse, run once on one line
     land       420ms   the bead it feeds takes a ring on the overshoot curve
     hold, hum  for as long as the pointer stays. The string is plucked on
                        landing, swings 1.8 times its hum and settles to it on
                        a 450ms time constant. This is CL's Hum, run on one
                        line at an amplitude set by that line alone
     release    220ms   on the leaving curve. The web comes back 240ms later
                        than that, so sweeping from one line to the next does
                        not flash the whole web between them

   WHAT SETS THE HUM, and one word that means two things here.
   His example is a percentage, "Victim 92%", and a saboteur's percentage in
   this product is its weight times ten (ui.js, component.js, summary.js). So
   the hum is read off the CHARGE the line carries, on the 0 to 10 scale every
   ring shares, as a share of 10. But the wheel already has a thing it calls
   tension, which is susceptibility and sets how taut the chord hangs
   (wheel.js, "TENSION IS SUSCEPTIBILITY"), and it is a different number.
   Built the way his example reads, charge sets how wide it swings and the
   wheel's tension sets how fast, which is what a real string does. The page
   carries a switch that swaps the two, so the question is asked with the
   picture.

     amplitude  0.0175 of the wheel's unit times charge to the power 1.5.
                5.8px at 100 percent on the desktop wheel. 93 percent swings
                5.2px, 55 percent 2.4, 27 percent 0.8, 5 percent 0.07, which
                is nothing. The power is exaggeration on purpose: at true
                scale a 27 percent line and a 93 percent line differ by 3.4
                times, which reads as "both moving". At 1.5 they differ by
                6.3, which reads as the one he described.
                Held to seven hundredths of the line's own length, so a short
                inner chord rings and does not break.
     pitch      4 to 10 per second, from the wheel's own tension

   WHAT SETS THE DENSITY. The chain a line sits on is the route through it
   from an address to the character it builds: inward the route is fixed,
   since every saboteur, complex and hyper complex feeds exactly one thing;
   outward from a pattern it follows the heaviest line feeding in, which is
   the route that dominates. Its weight is the mean charge along it, the same
   convention the engine already uses for a pattern's own weight.

     opacity    0.40 plus 0.55 times the chain's weight as a share of 10.
                A chain at 40 percent draws at 0.62, one at 85 percent at
                0.87. Subtle, as asked.

   Absolute, never ranked: a quiet profile hums quietly.

   Reduced motion gets the end state and nothing moving: the line at its
   chain's density, and the two extremes of its swing drawn faint and still
   beside it, so the charge is still read as the width of that lens.
   ============================================================ */
(function(){
'use strict';
var X=window.OVL_LIB,E=X.E,T=X.T,clamp=X.clamp,mix=X.mix,rgba=X.rgba,WHITE=X.WHITE;
var TAU=Math.PI*2;
var LIFT=90, GAP=90, LAND=420, REL=220, GRACE=240, DIM=320;
var AMP_K=.0175, AMP_EXP=1.5, PLUCK=.8, PLUCK_TAU=.45;
function alphaOf(W){return .40+.55*clamp(W/10,0,1);}
function sq(x){return x*x;}

/* ---- a chord resampled by arc length, one point every 2.5px, because a
   helix wound around a 400px line needs more than the 28 points a string
   does. Built once per line on first hover. ---- */
function fine(l){
 if(l.F)return l.F;
 var q=l.q,D=240,dp=[],cum=[0];
 for(var i=0;i<=D;i++){var t=i/D,u=1-t;
  dp.push([u*u*q[0][0]+2*u*t*q[1][0]+t*t*q[2][0],u*u*q[0][1]+2*u*t*q[1][1]+t*t*q[2][1],t]);
  if(i)cum.push(cum[i-1]+Math.hypot(dp[i][0]-dp[i-1][0],dp[i][1]-dp[i-1][1]));}
 var len=cum[D],n=Math.max(24,Math.ceil(len/2.5)),pts=[],nrm=[],rho=[],j=1;
 for(var k=0;k<n;k++){var want=k/(n-1)*len;
  while(j<D&&cum[j]<want)j++;
  var a=cum[j-1],b=cum[j],f=(want-a)/((b-a)||1),p=dp[j-1],r=dp[j];
  var t=p[2]+(r[2]-p[2])*f,u=1-t;
  var dx=2*u*(q[1][0]-q[0][0])+2*t*(q[2][0]-q[1][0]),dy=2*u*(q[1][1]-q[0][1])+2*t*(q[2][1]-q[1][1]),m=Math.hypot(dx,dy)||1;
  pts.push([p[0]+(r[0]-p[0])*f,p[1]+(r[1]-p[1])*f]);nrm.push([-dy/m,dx/m]);
  /* how tightly the chord bends here, as a radius. A quadratic's second
     derivative is constant, so this is one cross product per point */
  var ax=2*(q[0][0]-2*q[1][0]+q[2][0]),ay=2*(q[0][1]-2*q[1][1]+q[2][1]),cr=Math.abs(dx*ay-dy*ax);
  rho.push(cr>1e-9?m*m*m/cr:1e9);}
 return (l.F={pts:pts,nrm:nrm,rho:rho,n:n,len:len});}
/* A SWING NEVER FOLDS THE LINE. Pushing a point sideways by more than the
   radius the chord bends at there turns a tight loop inside out: measured on
   Gordon's heaviest line, whose loop bends at under 5px, the string crossed
   itself. So each point's push is soft limited to seven tenths of that
   radius, smoothly, d over the root of one plus d over the limit squared.
   A gentle chord is untouched; a tight one rings less at its tightest point,
   the way a stiff wire does. */
function bendLimit(F,i,d){var L=.7*F.rho[i];return d/Math.sqrt(1+sq(d/L));}
/* a path along the first upTo of a fine chord, pushed sideways by disp(s,i) */
function polyF(g,F,disp,upTo){
 var n=Math.max(2,Math.round((upTo==null?1:clamp(upTo,0,1))*(F.n-1))+1),i0=0;
 /* measure-hover.js alone sets a window, to read one stretch of a line with
    nothing else in the scan; the product never does */
 if(F.win){i0=F.win[0];n=Math.min(n,F.win[1]+1);}
 g.beginPath();
 for(var i=i0;i<n;i++){var p=F.pts[i],nn=F.nrm[i],d=disp?bendLimit(F,i,disp(i/(F.n-1),i)):0;
  if(i>i0)g.lineTo(p[0]+nn[0]*d,p[1]+nn[1]*d);else g.moveTo(p[0]+nn[0]*d,p[1]+nn[1]*d);}
 g.stroke();}
function atF(F,s){var i=clamp(Math.round(s*(F.n-1)),0,F.n-1);return F.pts[i];}

/* ---- the chain every line sits on, worked out once per profile ---- */
function prep(G){
 var into={},out={};
 G.links.forEach(function(l,i){l.i=i;l.S=l.S||X.sample(l.q);l.w=X.wheelW(l);l.sd=X.seed(l.from+'>'+l.to);
  (out[l.from]=out[l.from]||[]).push(l);(into[l.to]=into[l.to]||[]).push(l);});
 var heavy=function(a,b){return b.load-a.load||b.ten-a.ten||(a.nm<b.nm?-1:1);};
 Object.keys(into).forEach(function(k){into[k].sort(heavy);});
 Object.keys(out).forEach(function(k){out[k].sort(heavy);});
 G.links.forEach(function(l){
  var up=[],cur=l.from,g=0; while(into[cur]&&g++<8){var f=into[cur][0];up.unshift(f);cur=f.from;}
  var dn=[];cur=l.to;g=0; while(out[cur]&&g++<8){var nx=out[cur][0];dn.push(nx);cur=nx.to;}
  var path=up.concat([l],dn);
  l.chain={path:path,at:up.length,W:path.reduce(function(s,p){return s+p.load;},0)/path.length};
  /* a box per line, so a pointer far from it costs one comparison */
  var xs=l.S.pts.map(function(p){return p[0];}),ys=l.S.pts.map(function(p){return p[1];});
  l.bb=[Math.min.apply(0,xs),Math.min.apply(0,ys),Math.max.apply(0,xs),Math.max.apply(0,ys)];});
 G._prep=true;}
function segDist(px,py,a,b){var dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy||1;
 var t=clamp(((px-a[0])*dx+(py-a[1])*dy)/L,0,1);return Math.hypot(px-a[0]-dx*t,py-a[1]-dy*t);}
function distTo(l,x,y){var P=l.S.pts,m=1e9;for(var i=1;i<P.length;i++){var d=segDist(x,y,P[i-1],P[i]);if(d<m)m=d;}return m;}

/* ============================================================
   THE ENGINE
   ============================================================ */
function Hover(o){
 this.cv=o.canvas;this.g=this.cv.getContext('2d');
 this.dpr=o.dpr||1;this.look=o.look||'trace';this.scope=o.scope||'line';
 this.reads=o.reads||'charge';this.reduced=!!o.reduced;
 this.entries=[];this.cur=null;
 this.dm={on:false,from:0,at:-1e9,offAt:null};
 this.stat={ms:0,frames:0,acc:0,moving:0,last:0};
 this.setData(o.G);}
Hover.prototype.setData=function(G){this.G=G;if(!G._prep)prep(G);this.U=G.U;this.nodes=G.nodes;this.links=G.links;};
Hover.prototype.size=function(w,h){this.W=w;this.H=h;
 this.cv.width=Math.round(w*this.dpr);this.cv.height=Math.round(h*this.dpr);
 this.cv.style.width=w+'px';this.cv.style.height=h+'px';};
/* THE HIT. The nearest chord within r of the pointer, in canvas pixels. A
   line already held keeps the pointer until another is nearer by 2px or the
   pointer leaves 1.4 times the radius, so two parallel chords do not
   flicker between each other under a still hand. */
Hover.prototype.hit=function(x,y,r){
 var best=null,bd=r;
 for(var i=0;i<this.links.length;i++){var l=this.links[i],b=l.bb;
  if(x<b[0]-r||x>b[2]+r||y<b[1]-r||y>b[3]+r)continue;
  var d=distTo(l,x,y);if(d<bd){bd=d;best=l;}}
 var c=this.cur;
 if(c){var dc=distTo(c,x,y);if(dc<r*1.4&&(!best||dc<=bd+2))return c;}
 return best;};
Hover.prototype.params=function(l,W){
 var c=clamp(l.load/10,0,1),amp01=this.reads==='charge'?c:l.ten,pit01=this.reads==='charge'?l.ten:c;
 var raw=this.U*AMP_K*Math.pow(amp01,AMP_EXP),cap=l.S.len*.07+.3;
 return {A:Math.min(raw,cap),capped:raw>cap,f:4+6*pit01,amp01:amp01,alpha:alphaOf(W),W:W};};
Hover.prototype.dur=function(l){return clamp(l.S.len/(this.U*.0022),260,520);};
/* what one hover plays: the line alone, or the whole route it sits on, hop
   by hop from the address inward with 90ms between landings, which is CL's
   Relay timing */
Hover.prototype.plan=function(l){
 var self=this,ch=l.chain,list=this.scope==='chain'?ch.path:[l],t=LIFT;
 return list.map(function(x){var d=self.dur(x),o={l:x,st:t,d:d,P:self.params(x,ch.W),own:x===l};t+=d+GAP;return o;});};
Hover.prototype.hover=function(l,now){
 if(l===this.cur)return;
 var self=this;
 this.entries.forEach(function(e){if(e.tOff==null)e.tOff=now;});
 this.cur=l||null;
 if(l){this.entries.push({l:l,tOn:now,tOff:null,seq:this.plan(l)});
  if(this.dm.on&&this.dm.offAt!=null&&now<this.dm.offAt)this.dm.offAt=null;
  else if(!this.dm.on){this.dm.from=this.dimAt(now);this.dm.at=now;this.dm.on=true;this.dm.offAt=null;}
  else this.dm.offAt=null;}
 else if(this.dm.on)this.dm.offAt=now+REL+GRACE;
 void self;};
/* the web's own step back, 0 to 1, for the page to cross fade the dim plate */
Hover.prototype.dimAt=function(now){
 var d=this.dm;
 if(this.reduced)return (d.on&&(d.offAt==null||now<d.offAt))?1:0;
 if(d.on&&d.offAt!=null&&now>=d.offAt){d.from=d.from+(1-d.from)*E.out(clamp((d.offAt-d.at)/DIM,0,1));d.at=d.offAt;d.on=false;d.offAt=null;}
 if(d.on)return d.from+(1-d.from)*E.out(clamp((now-d.at)/DIM,0,1));
 return d.from*(1-E.in(clamp((now-d.at)/DIM,0,1)));};
/* one line's state at a moment, which every look reads the same way */
Hover.prototype.state=function(e,s,now){
 var t=now-e.tOn-s.st,k=this.reduced?2:t/s.d,since=this.reduced?9:(t-s.d)/1000;
 var v=e.tOff==null?1:(this.reduced?0:1-E.in(clamp((now-e.tOff)/REL,0,1)));
 var Ah=since>0?s.P.A*(1+PLUCK*Math.exp(-since/PLUCK_TAU)):0;
 return {l:s.l,F:fine(s.l),P:s.P,k:k,since:since,v:v,Ah:Ah,A:s.P.A,f:s.P.f,alpha:s.P.alpha,
  own:s.own,e:e,s:s,t0:e.tOn+s.st,now:now,tt:Math.max(0,since)};};
Hover.prototype.frame=function(now){
 var t0=performance.now(),g=this.g,self=this;
 g.setTransform(this.dpr,0,0,this.dpr,0,0);g.clearRect(0,0,this.W,this.H);
 g.lineCap='round';g.lineJoin='round';
 this.entries=this.entries.filter(function(e){return e.tOff==null||now-e.tOff<REL+40;});
 var moving=0,lines=0,look=this.reduced?'still':this.look,probe=null;
 this.entries.forEach(function(e){
  var states=e.seq.map(function(s){return self.state(e,s,now);});
  if(self['under_'+look])self['under_'+look](g,states,e,now);
  states.forEach(function(S){if(S.k<0||S.v<=0)return;
   moving+=self['draw_'+look](g,S)||0;lines++;
   if(S.own&&e.tOff==null)probe=S;});
  self.beads(g,states,e,now);});
 var dt=performance.now()-t0,st=this.stat;
 st.frames++;st.acc+=dt;if(st.frames>=60){st.ms=st.acc/st.frames;st.frames=0;st.acc=0;}
 st.last=dt;st.moving=moving;st.lines=lines;
 st.dim=this.dimAt(now);
 st.probe=probe?{nm:probe.l.nm,load:probe.l.load,ten:probe.l.ten,A:probe.A,Ah:probe.Ah,f:probe.f,
  alpha:probe.alpha,W:probe.P.W,capped:probe.P.capped,k:probe.k,chain:probe.l.chain.path.length}:null;
 return st;};

/* ---- the beads. Anticipation at the outer end, the landing at the inner,
   and a ring held on both while the line holds. Ring, not fill. ---- */
Hover.prototype.beads=function(g,states,e,now){
 if(this.noBeads)return;
 var self=this,first=states[0],n0=this.nodes[first.l.from],el=now-e.tOn;
 var v=first.v;
 if(n0&&v>0){var a=first.alpha;
  if(!this.reduced&&el<LIFT){var kk=E.out(el/LIFT);
   X.ring(g,n0.p[0],n0.p[1],(n0.s+3)*(1-.28*kk),mix(n0.col,WHITE,.5),a*kk,1.4);}
  else X.ring(g,n0.p[0],n0.p[1],n0.s+3,mix(n0.col,WHITE,.45),a*.55*v,1.2);}
 states.forEach(function(S){var n=self.nodes[S.l.to];if(!n||S.k<1||S.v<=0)return;
  var ls=S.since*1000/LAND;
  if(!self.reduced&&ls<1){var k=clamp(ls,0,1);
   X.disc(g,n.p[0],n.p[1],n.s*(1+.3*Math.sin(Math.PI*k)),mix(n.col,WHITE,.55),.32*(1-k)*S.v);
   X.ring(g,n.p[0],n.p[1],n.s+3+Math.min(12,n.s*1.2)*E.land(k),mix(n.col,WHITE,.6),.85*(1-k)*S.v,1.4);}
  X.ring(g,n.p[0],n.p[1],n.s+3,mix(n.col,WHITE,.45),S.alpha*.55*S.v*clamp(ls*3,0,1),1.2);});};
/* the travelling head, from CL's Pulse, on this line's own trace clock */
Hover.prototype.traceHead=function(g,S,r,a){
 var s=S.s,t0=S.t0,L=S.l.S;
 X.head(g,function(tt){var kk=(tt*1000-t0)/s.d;return kk<0||kk>1?null:X.at(L,E.io(kk));},S.now/1000,S.l.col,r,a);};

/* ============================================================
   THE STILL. What reduced motion gets, for every look. The line at its
   chain's density, and the two extremes of its swing drawn faint and still
   beside it, so the charge reads as the width of that lens.
   ============================================================ */
Hover.prototype.draw_still=function(g,S){
 var c=mix(S.l.col,WHITE,.18),F=S.F,A=S.A;
 g.lineWidth=S.l.w*1.35;
 if(A>.3){g.strokeStyle=rgba(c,.22*S.alpha*S.v);
  polyF(g,F,function(s){return A*Math.sin(Math.PI*s);});
  polyF(g,F,function(s){return -A*Math.sin(Math.PI*s);});}
 g.strokeStyle=rgba(c,S.alpha*S.v);polyF(g,F,null);
 return 0;};

/* ============================================================
   0. TRACE AND HUM. The mechanic as he described it, and the primary build.

   Trace: the line is laid down behind a bright head, outer end inward.
   Hum: a plucked string at the line's own amplitude, drawn as two strokes,
   the string and, faint, the string at the other extreme of its swing,
   because a string moving faster than the eye resolves is seen as its lens.
   Density: the line's own opacity is its chain's weight.
   ============================================================ */
Hover.prototype.draw_trace=function(g,S){
 var c=mix(S.l.col,WHITE,.18),w=S.l.w*1.35,a=S.alpha*S.v;
 if(S.k<1){var p=E.io(clamp(S.k,0,1));
  g.strokeStyle=rgba(c,a);g.lineWidth=w;polyF(g,S.F,null,p);
  this.traceHead(g,S,1.8+1.6*S.P.amp01,S.v);return 1;}
 var Ah=S.Ah,f=S.f,tt=S.tt,m2=1-Math.exp(-tt/.08);
 var disp=function(t){return function(s){
  return Ah*(Math.sin(Math.PI*s)*Math.sin(TAU*f*t)+.22*m2*Math.sin(TAU*s)*Math.sin(TAU*2*f*t+1.3));};};
 g.lineWidth=w;
 if(Ah>.15){g.strokeStyle=rgba(c,.22*a);polyF(g,S.F,disp(tt-1/(2*f)));}
 g.strokeStyle=rgba(c,a);polyF(g,S.F,disp(tt));
 return Ah>.15?1:0;};

/* ============================================================
   1. COIL. Charge wound around the line.

   Trace: a spark runs the line and two strands wind on behind it.
   Hum: the strands are a double helix around the line, radius set by the
   line's charge, turning at the wheel's tension, 0.9 to 3.1 turns a second,
   so the winding appears to travel inward. The strand in front is bright
   and the one behind is faint, which is all it takes for a flat line to
   read as a wire with something wrapped round it. On top, a crackle stepped
   at 30 a second rather than 60, straight ahead texture over the pose, the
   way an electrical arc is animated on twos. At low charge the helix
   collapses onto the line and the crackle with it: nothing.
   Density: the strands carry the chain's opacity, the core under them less.
   ============================================================ */
function hash(i,j){var h=Math.imul(i*374761393+j*668265263,1274126177);h^=h>>>13;h=Math.imul(h,1103515245);
 return (((h^h>>>16)>>>0)%2001)/1000-1;}
Hover.prototype.draw_coil=function(g,S){
 var c=mix(S.l.col,WHITE,.18),cs=mix(S.l.col,WHITE,.55),F=S.F,a=S.alpha*S.v;
 var tracing=S.k<1,p=tracing?E.io(clamp(S.k,0,1)):1;
 g.strokeStyle=rgba(c,a*.7);g.lineWidth=S.l.w*1.05;polyF(g,F,null,p);
 var R=tracing?S.A*1.2:S.Ah;
 var lam=Math.max(14,this.U*.075),om=.9+2.2*S.l.ten,tt=(S.now-S.t0)/1000,step=Math.floor(S.now/33.3);
 var turns=F.len/lam,n=Math.max(2,Math.round(p*(F.n-1))+1),sd=(S.l.i+1)*7919;
 if(R>.12)for(var st=0;st<2;st++){
  var ph0=st*Math.PI;
  /* two passes, the strand behind first, then in front */
  for(var pass=0;pass<2;pass++){
   g.strokeStyle=rgba(cs,a*(pass?.95:.3));g.lineWidth=pass?1.4:.8;g.beginPath();var open=false;
   for(var i=0;i<n;i++){var s=i/(F.n-1),ph=TAU*(s*turns-om*tt)+ph0,front=Math.cos(ph)>0;
    var env=Math.pow(Math.sin(Math.PI*s),.6)*(tracing?clamp((p-s)*F.len/14,0,1):1);
    var d=bendLimit(F,i,R*env*Math.sin(ph)+R*.15*env*hash(sd+i*2+st,step));
    var P=F.pts[i],N=F.nrm[i],x=P[0]+N[0]*d,y=P[1]+N[1]*d;
    if(front===!!pass){if(open)g.lineTo(x,y);else{g.moveTo(x,y);open=true;}}else open=false;}
   g.stroke();}}
 if(tracing){var hp=X.at(S.l.S,p);X.disc(g,hp[0],hp[1],2.2+2*S.P.amp01,mix(S.l.col,WHITE,.8),S.v);
  X.disc(g,hp[0],hp[1],7+5*S.P.amp01,S.l.col,.18*S.v);}
 return R>.12||tracing?1:0;};

/* ============================================================
   2. CURRENT. The charge runs inward, continuously.

   Trace: the line is laid down with one crest riding its front edge.
   Hum: a travelling wave rather than a standing one. Crests keep running
   from the address end to the pattern end, 53px apart, at four fifths of
   the string's amplitude because a wave that long bends the chord's own
   shape and at full height it read as a different line, 1.2 to 3.4 crests a second from the wheel's tension, pinned at
   both ends so the beads stay put. It says direction, which a plucked
   string cannot.
   Density: the rest of the chain is drawn still beneath it at the chain's
   opacity less three fifths, so the weight is shown as the chain itself,
   faint or firm, and the hovered line is seen as one link of it.
   ============================================================ */
Hover.prototype.under_current=function(g,states,e,now){
 if(this.scope==='chain')return;
 var S=states[0],self=this,ch=S.l.chain,k=this.reduced?1:E.out(clamp((now-e.tOn)/DIM,0,1));
 ch.path.forEach(function(l){if(l===S.l)return;
  g.strokeStyle=rgba(mix(l.col,WHITE,.1),S.alpha*.42*k*S.v);g.lineWidth=l.w;polyF(g,fine(l),null);});
 void self;};
Hover.prototype.draw_current=function(g,S){
 var c=mix(S.l.col,WHITE,.18),F=S.F,a=S.alpha*S.v,L=F.len,lam=Math.max(30,this.U*.16);
 g.strokeStyle=rgba(c,a);g.lineWidth=S.l.w*1.3;
 if(S.k<1){var p=E.io(clamp(S.k,0,1)),A=Math.max(S.A,.8)*1.5;
  polyF(g,F,function(s){return A*Math.exp(-sq((s-p)*L/(lam*.35)))*Math.sin(Math.PI*clamp(s,0,1));},p);return 1;}
 var Ah=S.Ah*.8,tt=S.tt,cf=1.2+2.2*S.l.ten,ramp=1-Math.exp(-tt/.15);
 polyF(g,F,function(s){return Ah*ramp*Math.pow(Math.sin(Math.PI*s),.5)*Math.sin(TAU*(s*L/lam-cf*tt));});
 return Ah>.15?1:0;};

/* ============================================================
   3. STITCH. The line as a row of beads, stitched in and shivering.

   "Colour density" read literally as a second option: how densely the line
   is stitched is the chain's weight, one dot every 15px on an empty chain
   down to one every 5px on a full one, so a heavy chain reads as a solid
   seam and a light one as a dotted guide, with no change of colour at all.
   Trace: the dots arrive one after another from the outer end at an even
   rate, each popping in over 180ms on the overshoot curve.
   Hum: each dot shivers on its own phase, mostly across the line, at the
   line's charge. At low charge the seam lies still.
   ============================================================ */
Hover.prototype.draw_stitch=function(g,S){
 var F=S.F,L=F.len,W=S.P.W,sp=(15-10*clamp(W/10,0,1))*this.U/332,n=Math.max(3,Math.floor(L/sp));
 var c=mix(S.l.col,WHITE,.35),a=S.alpha*S.v,r0=Math.max(1.7,S.l.w*.62),el=S.now-S.t0,Ah=S.Ah,f=S.f,tt=S.tt;
 g.strokeStyle=rgba(mix(S.l.col,WHITE,.1),a*.22);g.lineWidth=1;polyF(g,F,null,clamp(el/S.s.d,0,1));
 g.fillStyle=rgba(c,a);
 for(var i=0;i<n;i++){var s=(i+.5)/n,kk=(el-s*S.s.d)/180;if(kk<=0)break;
  var r=r0*(kk<1?Math.max(0,E.land(kk)):1),P=atF(F,s),j=Math.round(s*(F.n-1)),N=F.nrm[j];
  var q1=X.seed(S.l.nm+i)*TAU,q2=X.seed(i+S.l.nm)*TAU,dn=0,dt=0;
  if(Ah>0){dn=bendLimit(F,j,Ah*.9*Math.sin(TAU*f*tt+q1));dt=bendLimit(F,j,Ah*.35*Math.sin(TAU*f*1.37*tt+q2));}
  var x=P[0]+N[0]*dn+N[1]*dt,y=P[1]+N[1]*dn-N[0]*dt;
  g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
 return S.k<1||Ah>.15?1:0;};

/* ============================================================
   4. PRESSURE. The line as a vessel, and the charge as a pulse in it.

   No sideways motion at all. Trace: a swelling travels the line and leaves
   the line behind it, squash and stretch on a single stroke. Hum: pressure
   pulses keep travelling inward, the line's width throbbing up to 3.2 times
   at full charge and not at all at none, at 48 to 120 a minute from the
   wheel's tension, which is the range of a resting heart. Reads as
   something alive at rest more than as something vibrating.
   Density: a soft sheath around the line at a tenth of the chain's opacity,
   so a heavy chain carries a faint glow and a light one none.
   ============================================================ */
function ribbon(g,F,hw,upTo){
 var n=Math.max(2,Math.round(clamp(upTo,0,1)*(F.n-1))+1),i,P,N,h;
 g.beginPath();
 for(i=0;i<n;i++){P=F.pts[i];N=F.nrm[i];h=hw(i/(F.n-1));if(i)g.lineTo(P[0]+N[0]*h,P[1]+N[1]*h);else g.moveTo(P[0]+N[0]*h,P[1]+N[1]*h);}
 for(i=n-1;i>=0;i--){P=F.pts[i];N=F.nrm[i];h=hw(i/(F.n-1));g.lineTo(P[0]-N[0]*h,P[1]-N[1]*h);}
 g.closePath();g.fill();}
Hover.prototype.draw_pressure=function(g,S){
 var c=mix(S.l.col,WHITE,.18),F=S.F,L=F.len,a=S.alpha*S.v,base=S.l.w*.62,U=this.U;
 var tracing=S.k<1,p=tracing?E.io(clamp(S.k,0,1)):1;
 g.strokeStyle=rgba(c,S.alpha*.10*S.v);g.lineWidth=S.l.w*4.5;polyF(g,F,null,p);
 var hw;
 if(tracing)hw=function(s){return base*(1+1.8*Math.exp(-sq((s-p)*L/(U*.05))));};
 else{var B=2.2*S.Ah/(U*AMP_K),fp=.8+1.2*S.l.ten,lam=U*.35,tt=S.tt;
  hw=function(s){return base*(1+B*Math.pow(Math.max(0,Math.sin(TAU*(fp*tt-s*L/lam))),4));};}
 g.fillStyle=rgba(c,a);ribbon(g,F,hw,p);
 return tracing||S.Ah>.15?1:0;};

window.OVL_Hover=Hover;
window.OVL_HOVER_N={bendLimit:bendLimit,LIFT:LIFT,GAP:GAP,LAND:LAND,REL:REL,GRACE:GRACE,DIM:DIM,AMP_K:AMP_K,AMP_EXP:AMP_EXP,
 PLUCK:PLUCK,PLUCK_TAU:PLUCK_TAU,alphaOf:alphaOf,prep:prep,fine:fine};
})();
