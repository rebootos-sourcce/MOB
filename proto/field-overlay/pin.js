/* ============================================================
   PIN AND UNPIN. DB in TASKS.md, 26 September. Built on Trace and hum,
   his pick, with the whole chain traced, his other pick.

   His words, found while trying the page: "how do I lock one, now that I've
   drawn a chain, can I click on it to pin it, and then hover over it and
   trace it and unpin it if I want to."

   THE RULE, ONE SENTENCE ON BOTH SCREENS. Pressing the line you are holding
   pins its chain, and pressing it again lets it go. On a desktop holding is
   resting the pointer on it, so it is one click. On a phone holding is the
   first tap, so it is a second tap, or the Pin button that appears while a
   chain is held.

   THE PHYSICS IT IS BUILT ON. The hum is a plucked string, so a pin is a
   finger put on the string and an unpin is the finger taken off.

     grip       the press silences the string, a 60ms time constant, gone
                inside 200ms. What is held is still, which is what "locked"
                should look like.
     latch      90ms of anticipation, a faint ring drawn in wide at the
                chain's address, then it closes onto the bead in 220ms on the
                overshoot curve and a short stem grows outward from it: the
                pin head, ring not fill, with its number beside it.
     follow     from 120ms, a brightening runs down the chain inward, 90ms
     through    between hops and 260ms on each, and every bead it reaches
                takes a small ring. The chain confirms it has been caught,
                all of it, in the order charge compounds.
     rest       a pinned chain stays drawn at its own chain's density, and
                breathes: its opacity eases 12 percent down and back on a 5
                second cycle, a resting breath, starting 700ms after the pin
                and ramped in over 1.5 seconds so the first breath is not a
                blink. Alive at rest, and at the fortieth look it is still
                only a line breathing.
     hover it   a pinned chain traces again, the head running over a line
     again      that is already lit rather than laying it down, then hums.
                Leaving it, the string rings down onto the pin on a 260ms
                time constant instead of fading, follow through again.
     unpin      the pin head lifts, its ring opening to 1.8 times and fading
                in 180ms on the leaving curve. If the pointer is still on it
                the string is let go and rings, a pluck with a 30ms attack.
                If not, the chain lets go 60ms after its pin, over 220ms.

   The rest of the web steps back to six tenths of the wheel's own dim and
   not all of it, because he said "I don't like that they all disappear when
   I hover". It is the same plate crossfaded, only held short.

   HOW MANY. Up to three at once, and a fourth is refused with the reason,
   never by silently dropping the oldest, since a pin can carry a label he
   wrote. Three because his own sentence named two different pins in one
   breath, "this is where my pain hurts, this is my saboteur", and because a
   working memory holds about four things and the Field already asks it to
   hold the wheel itself.

   Reduced motion: no grip, latch, wave, breath or ring down. A pin is drawn
   at once, a still chain at its density, and the hum is the still lens the
   hover round already gives it.
   ============================================================ */
(function(){
'use strict';
var X=window.OVL_LIB,E=X.E,clamp=X.clamp,mix=X.mix,rgba=X.rgba,WHITE=X.WHITE;
var N=window.OVL_HOVER_N,H=window.OVL_Hover,bendLimit=N.bendLimit,fine=N.fine,alphaOf=N.alphaOf;
var TAU=Math.PI*2;
var GRIP=60,LATCH_IN=90,LATCH=220,WAVE0=120,HOP=90,WAVE=260,
    LIFT_OFF=180,LET_DELAY=60,LET_GO=220,RING_DOWN=260,RING_END=900,ATTACK=30,
    BREATH=5000,BREATH_D=.12,BREATH_AT=700,BREATH_RAMP=1500,MAXPINS=3,DIM_MAX=.6;

function polyF(g,F,disp,upTo){
 var n=Math.max(2,Math.round((upTo==null?1:clamp(upTo,0,1))*(F.n-1))+1);
 g.beginPath();
 for(var i=0;i<n;i++){var p=F.pts[i],nn=F.nrm[i],d=disp?bendLimit(F,i,disp(i/(F.n-1),i)):0;
  if(i)g.lineTo(p[0]+nn[0]*d,p[1]+nn[1]*d);else g.moveTo(p[0]+nn[0]*d,p[1]+nn[1]*d);}
 g.stroke();}
/* a line whose pattern a release dissolved, letting go */
function goneVis(l,now){return !l.gone||now<l.goneAt?1:Math.max(0,1-E.in(clamp((now-l.goneAt)/420,0,1)));}
function keyOf(path){return path.map(function(l){return l.i;}).join('-');}

function Pin(o){
 H.call(this,Object.assign({},o,{look:'trace',scope:'chain'}));
 this.pins=[];this.pid=0;this.max=o.max||MAXPINS;this.dimMax=o.dimMax==null?DIM_MAX:o.dimMax;
 this.V={k:1,ox:0,oy:0};this.curOff=null;this.dd={want:false,from:0,at:-1e9};}
Pin.prototype=Object.create(H.prototype);
Pin.prototype.constructor=Pin;
Pin.prototype.hit=function(x,y,r){var saved=this.links;
 this.links=saved.filter(function(l){return !l.gone;});
 if(this.cur&&this.cur.gone)this.cur=null;
 try{return H.prototype.hit.call(this,x,y,r);}finally{this.links=saved;}};
Pin.prototype.live=function(){return this.pins.filter(function(p){return p.tOff==null;});};
Pin.prototype.pinOf=function(l){var ps=this.pins;
 for(var i=0;i<ps.length;i++)if(ps[i].tOff==null&&ps[i].path.indexOf(l)>=0)return ps[i];return null;};
Pin.prototype.pinFor=function(l){var k=keyOf(l.chain.path);return this.live().filter(function(p){return p.key===k;})[0]||null;};
Pin.prototype.hover=function(l,now){var was=this.cur;
 H.prototype.hover.call(this,l,now);
 if(!l&&was)this.curOff=now;if(l)this.curOff=null;};
/* ---- the two verbs ---- */
Pin.prototype.toggle=function(l,now){
 if(!l)return {op:'none'};
 var hit=this.pinFor(l);
 if(hit){this.unpin(hit,now);return {op:'unpin',pin:hit};}
 var live=this.live();
 if(live.length>=this.max)return {op:'full',n:live.length};
 var used=live.map(function(p){return p.num;}),num=1;while(used.indexOf(num)>=0)num++;
 var p={id:++this.pid,key:keyOf(l.chain.path),path:l.chain.path.slice(),W:l.chain.W,line:l,at:now,tOff:null,num:num,label:''};
 this.pins.push(p);
 this.entries.forEach(function(e){if(e.tOff==null&&e.l===l){e.grip=now;e.pluck=null;}});
 return {op:'pin',pin:p};};
Pin.prototype.unpin=function(p,now){
 if(!p||p.tOff!=null)return;p.tOff=now;
 this.entries.forEach(function(e){if(e.tOff!=null)return;
  if(e.seq.some(function(s){return p.path.indexOf(s.l)>=0;})){e.grip=null;e.pluck=now;}});};
/* a trace that plays without a pointer, for as long as hold, used when a
   chain has to be shown again: after a release, or from a list */
Pin.prototype.replay=function(l,now,hold){
 this.entries.forEach(function(e){if(e.tOff==null)e.tOff=now;});
 this.entries.push({l:l,tOn:now,tOff:now+hold,seq:this.plan(l),replay:true});};
/* the chain's own weight, read again after its loads have moved */
Pin.prototype.reweigh=function(){
 this.G.links.forEach(function(l){var P=l.chain.path;l.chain.W=P.reduce(function(s,x){return s+x.load;},0)/P.length;});
 this.pins.forEach(function(p){p.W=p.line.chain.W;});};
/* ---- the dim, held short of the whole way, and on while anything is pinned ---- */
Pin.prototype.dimAt=function(now){
 var d=this.dd,red=this.reduced;
 function val(){if(red)return d.want?1:0;var k=clamp((now-d.at)/N.DIM,0,1);
  return d.want?d.from+(1-d.from)*E.out(k):d.from*(1-E.in(k));}
 var want=!!this.cur||this.live().length>0||this.entries.some(function(e){return e.replay&&now<e.tOff;})
  ||(this.curOff!=null&&now-this.curOff<N.REL+N.GRACE);
 if(want!==d.want){d.from=val();d.at=now;d.want=want;}
 return val();};
Pin.prototype.breath=function(p,now){
 if(!p||this.reduced||p.tOff!=null)return 1;
 var t=now-p.at-BREATH_AT;if(t<=0)return 1;
 return 1-BREATH_D*(1-Math.exp(-t/BREATH_RAMP))*(.5-.5*Math.cos(TAU*t/BREATH));};
/* one line's state, as the hover round reads it, plus the grip, the pluck
   and the ring down */
Pin.prototype.state=function(e,s,now){
 var red=this.reduced,t=now-e.tOn-s.st,k=red?2:t/s.d,since=red?9:(t-s.d)/1000;
 var pin=this.pinOf(s.l),v,damp=1;
 if(e.tOff==null||now<e.tOff)v=1;
 else if(pin&&!red){v=1;damp*=Math.exp(-(now-e.tOff)/RING_DOWN);}
 else v=red?0:1-E.in(clamp((now-e.tOff)/N.REL,0,1));
 if(e.grip!=null)damp*=red?0:Math.exp(-Math.max(0,now-e.grip)/GRIP);
 var ps=since;
 if(e.pluck!=null&&since>0){var dp=Math.max(0,now-e.pluck);ps=Math.min(since,dp/1000);
  if(!red)damp*=1-Math.exp(-dp/ATTACK);}
 var Ah=since>0?s.P.A*(1+N.PLUCK*Math.exp(-ps/N.PLUCK_TAU))*damp:0;
 return {l:s.l,F:fine(s.l),P:s.P,k:k,since:since,v:v,Ah:Ah,A:s.P.A,f:s.P.f,alpha:s.P.alpha,
  own:s.own,e:e,s:s,t0:e.tOn+s.st,now:now,tt:Math.max(0,since),pinned:!!pin,br:this.breath(pin,now)};};
/* the hovered chain, as Trace and hum draws it, except that over a pinned
   line only the head runs, since the line is already there */
Pin.prototype.draw_live=function(g,S){
 if(this.reduced)return this.draw_still(g,S);
 var gv=goneVis(S.l,S.now);if(gv<=0)return 0;
 var c=mix(S.l.col,WHITE,.18),w=S.l.w*1.35,a=S.alpha*S.v*S.br*gv;
 if(S.k<1){var p=E.io(clamp(S.k,0,1));
  if(!S.pinned){g.strokeStyle=rgba(c,a);g.lineWidth=w;polyF(g,S.F,null,p);}
  if(!S.l.gone)this.traceHead(g,S,1.8+1.6*S.P.amp01,S.v);return 1;}
 var Ah=S.Ah,f=S.f,tt=S.tt,m2=1-Math.exp(-tt/.08);
 var disp=function(t){return function(s){
  return Ah*(Math.sin(Math.PI*s)*Math.sin(TAU*f*t)+.22*m2*Math.sin(TAU*s)*Math.sin(TAU*2*f*t+1.3));};};
 g.lineWidth=w;
 if(Ah>.15){g.strokeStyle=rgba(c,.22*a);polyF(g,S.F,disp(tt-1/(2*f)));}
 g.strokeStyle=rgba(c,a);polyF(g,S.F,disp(tt));
 return Ah>.15?1:0;};
/* a pinned chain at rest: every link not already being drawn by a hover */
Pin.prototype.drawPin=function(g,p,now,covered,drawn){
 var vis=p.tOff==null?1:(this.reduced?0:1-E.in(clamp((now-p.tOff-LET_DELAY)/LET_GO,0,1)));
 if(vis<=0)return;
 var a=alphaOf(p.W)*this.breath(p,now)*vis;
 p.path.forEach(function(l){if(covered[l.i]||drawn[l.i])return;drawn[l.i]=1;
  var gv=goneVis(l,now);if(gv<=0)return;
  g.strokeStyle=rgba(mix(l.col,WHITE,.18),a*gv);g.lineWidth=l.w*1.35;polyF(g,fine(l),null);});};
/* the pin head at the chain's address, and the wave that confirms it */
Pin.prototype.headAt=function(p){
 var n0=this.nodes[p.path[0].from];if(!n0)return null;
 var G=this.G,ang=Math.atan2(n0.p[1]-G.CY,n0.p[0]-G.CX),R=n0.s+6.5;
 return {n:n0,ang:ang,R:R,ux:Math.cos(ang),uy:Math.sin(ang)};};
/* where a label can sit, just past the pin's number, in canvas px */
Pin.prototype.tagAt=function(p){var h=this.headAt(p);if(!h)return null;
 return {x:h.n.p[0]+h.ux*(h.R+20),y:h.n.p[1]+h.uy*(h.R+20),ux:h.ux,uy:h.uy};};
Pin.prototype.drawMarker=function(g,p,now){
 var h=this.headAt(p);if(!h)return 0;
 var t=now-p.at,R=h.R,r,a,stem,moving=0,col=mix(p.path[0].col,WHITE,.6),red=this.reduced;
 if(p.tOff!=null){var ki=E.in(clamp((now-p.tOff)/LIFT_OFF,0,1));r=R*(1+.8*ki);a=1-ki;stem=1-ki;moving=ki<1?1:0;}
 else if(red||t>=LATCH_IN+LATCH){r=R;a=1;stem=1;}
 else if(t<LATCH_IN){r=R*1.9;a=.45*E.out(t/LATCH_IN);stem=0;moving=1;}
 else{var k=(t-LATCH_IN)/LATCH;r=R*(1.9-.9*E.land(k));a=.45+.55*E.out(k);stem=E.out(k);moving=1;}
 if(a<=.004)return moving;
 r*=p.squeeze||1;
 var cx=h.n.p[0],cy=h.n.p[1];
 /* a dark halo under the ring so it reads on a bright bead and a dark field */
 X.ring(g,cx,cy,r,[11,11,13],a*.55,3.4);
 X.ring(g,cx,cy,r,col,a*.95,1.6);
 if(stem>0){var s0=r,s1=r+7*stem;
  g.strokeStyle=rgba(col,a*.95);g.lineWidth=1.6;g.beginPath();
  g.moveTo(cx+h.ux*s0,cy+h.uy*s0);g.lineTo(cx+h.ux*s1,cy+h.uy*s1);g.stroke();
  g.font='600 9.5px Inter,system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';
  var tx=cx+h.ux*(s1+7),ty=cy+h.uy*(s1+7);
  g.fillStyle=rgba([11,11,13],a*.7*stem);g.beginPath();g.arc(tx,ty,6.2,0,TAU);g.fill();
  g.fillStyle=rgba(col,a*stem);g.fillText(String(p.num),tx,ty+.5);}
 /* the follow through, inward, only on the way in */
 if(!red&&p.tOff==null&&t<WAVE0+HOP*p.path.length+WAVE){var self=this;
  p.path.forEach(function(l,j){var tb=t-WAVE0-j*HOP;if(tb<=0||tb>=WAVE)return;
   var b=Math.sin(Math.PI*tb/WAVE),c2=mix(l.col,WHITE,.6);
   g.strokeStyle=rgba(c2,.55*b*alphaOf(p.W));g.lineWidth=l.w*1.35+2*b;polyF(g,fine(l),null);
   var n=self.nodes[l.to];if(n){var kk=tb/WAVE;
    X.ring(g,n.p[0],n.p[1],n.s+3+n.s*E.out(kk),mix(n.col,WHITE,.6),.6*(1-kk),1.3);}});
  moving=1;}
 return moving;};
Pin.prototype.frame=function(now){
 var t0=performance.now(),g=this.g,self=this,V=this.V,d=this.dpr;
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,this.cv.width,this.cv.height);
 g.setTransform(d*V.k,0,0,d*V.k,-d*V.k*V.ox,-d*V.k*V.oy);
 g.lineCap='round';g.lineJoin='round';
 this.entries=this.entries.filter(function(e){if(e.tOff==null||now<e.tOff)return true;
  var onPin=e.seq.some(function(s){return self.pinOf(s.l);});
  return now-e.tOff<(onPin&&!self.reduced?RING_END:N.REL+40);});
 this.pins=this.pins.filter(function(p){return p.tOff==null||now-p.tOff<Math.max(LIFT_OFF,LET_DELAY+LET_GO)+40;});
 var covered={},moving=0,lines=0,probe=null;
 this.entries.forEach(function(e){e.states=e.seq.map(function(s){return self.state(e,s,now);});
  e.states.forEach(function(S){if(S.k>=1&&S.v>=.999)covered[S.l.i]=1;});});
 var drawn={};
 this.pins.forEach(function(p){self.drawPin(g,p,now,covered,drawn);});
 this.entries.forEach(function(e){
  e.states.forEach(function(S){if(S.k<0||S.v<=0)return;
   moving+=self.draw_live(g,S)||0;lines++;if(S.own&&e.tOff==null)probe=S;});
  self.beads(g,e.states,e,now);});
 this.pins.forEach(function(p){moving+=self.drawMarker(g,p,now);
  p.path.forEach(function(l){if(!covered[l.i])lines++;});});
 var dt=performance.now()-t0,st=this.stat;
 st.frames++;st.acc+=dt;if(st.frames>=60){st.ms=st.acc/st.frames;st.frames=0;st.acc=0;}
 st.last=dt;st.moving=moving;st.lines=lines;st.pins=this.live().length;
 st.dim=this.dimAt(now)*this.dimMax;
 st.probe=probe?{nm:probe.l.nm,load:probe.l.load,A:probe.A,Ah:probe.Ah,f:probe.f,alpha:probe.alpha,W:probe.P.W,
  chain:probe.l.chain.path.length,pinned:probe.pinned}:null;
 return st;};
window.OVL_Pin=Pin;
window.OVL_PIN_N={GRIP:GRIP,LATCH_IN:LATCH_IN,LATCH:LATCH,WAVE0:WAVE0,HOP:HOP,WAVE:WAVE,LIFT_OFF:LIFT_OFF,
 LET_DELAY:LET_DELAY,LET_GO:LET_GO,RING_DOWN:RING_DOWN,BREATH:BREATH,BREATH_D:BREATH_D,MAXPINS:MAXPINS,DIM_MAX:DIM_MAX,keyOf:keyOf};
})();
