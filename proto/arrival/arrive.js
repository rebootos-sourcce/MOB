/* ============================================================
   FRAMES AND DIAL ARRIVE. Prototype over the shipped build, round EQ.

   "When I land on this page the first thing I want to see is movement, Dial
   looks dead." EE found, correctly, that neither rendition has ever moved:
   ringsDraw builds an SVG when the reading changes and never otherwise. This
   reopens that on his ruling. It does not change what either picture draws.

   THE FAMILY. Three things are shared with what already moves, so the
   product reads as one system:
     the ring fill    the glass bar's: from twelve, clockwise, round cap,
                      ease out. The core's CQ fills that way and DQ runs the
                      other way from the same twelve, as frCore draws them.
     from the middle  the Seven Seats arcs and the gates' own collar grow
                      from the middle of their sector, as frCollar says.
     the stagger      the Wheel's 62ms between seats, used for the gates.

   AND ONE MOVE EACH, SO THEY ARE NOT THE WHEEL AND NOT EACH OTHER.
     Dial     a sweep hand. One accent hand with a trail of light goes once
              round from twelve across every register at once, the way a
              watch's second hand sweeps its dial, and the dial is there
              behind it. The last few degrees behind the hand are still
              settling outward, so marks come up rather than switch on.
     Frames   nesting. The frames land from the outside in, each dropping
              into place from three and a half percent larger, 60ms apart,
              and a point of light runs once round each frame as it lands.
              Nested frames, moving, is frames settling into one another.

   NOTHING THAT CARRIES A VALUE OVERSHOOTS. A length that grows past itself
   and settles has printed a number the person does not hold. Only marks
   that carry no quantity land with the overshoot: seat glyphs, gate discs.

   HOW IT IS DRAWN, AND WHY, MEASURED. The first cut animated the SVG's own
   marks, 667 animations, and ran at 9.7 frames a second with a 267ms worst
   frame, because every frame repainted a thousand element SVG and one such
   repaint alone costs about 40ms here. A mask over the picture was worse, 56ms
   a frame, because a changing mask re-rasterises what it masks. So this does
   what the Wheel does: the finished picture is rasterised once, 40 to 75ms,
   and revealed on a canvas, where a frame is a clipped copy of a bitmap,
   about 3.5ms. The real SVG sits underneath at opacity zero the whole time,
   so every mark answers a hover from the first frame. The few parts that
   move on their own, the core, the gates, the callouts and the seat glyphs,
   are copied into a small SVG of their own, which is cheap to repaint.

   WHAT TRIGGERS IT. A switch to Frames or Dial, arriving on the Field while
   one is up, and the first sight of the Field after the boot, started when
   the sheet's fade starts. Not at page load: the Wheel's once a session
   entrance is started at page load and plays out in full under an opaque
   sheet, measured, ENTER_T0 at 263ms and the sheet up until 5673ms.

   THE WAY OUT. It is never modal, and a press anywhere on the picture or
   Escape finishes it at once. Reduced motion gets the finished picture.
   ============================================================ */
(function(){
'use strict';
var E_OUT='cubic-bezier(.22,1,.36,1)', E_LAND='cubic-bezier(.34,1.56,.64,1)',
    E_IO='cubic-bezier(.4,0,.2,1)', E_SINE='cubic-bezier(.37,0,.63,1)';
var TAU=Math.PI*2, NS='http://www.w3.org/2000/svg';
var RM=(typeof REDUCED!=='undefined'&&REDUCED)||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);

/* ---- the prototype's own options ---- */
var P={mode:'switch',rest:'still',rate:1,hold:0};

/* ---- timing, in milliseconds at 1x ---- */
var TM={
 dial:{travel:700,feather:.42},
 frames:{step:60,land:240,trace:460,scale:.035},
 core:{scale:420,fill:820,text:260},
 gate:{step:62,pop:360,fill:420},
 call:{step:50},
 seat:{pop:360}};

/* a cubic bezier both ways: progress at a time, and the time a progress is
   reached, so a mark at a bearing lands the moment the eased hand reaches it */
function bez(x1,y1,x2,y2){
 function B(a,b,t){var u=1-t;return 3*u*u*t*a+3*u*t*t*b+t*t*t;}
 function solve(fa,fb,v){if(v<=0)return 0;if(v>=1)return 1;var lo=0,hi=1;
  for(var i=0;i<32;i++){var m=(lo+hi)/2;if(B(fa,fb,m)<v)lo=m;else hi=m;}return (lo+hi)/2;}
 return {at:function(x){return B(y1,y2,solve(x1,x2,x));},inv:function(y){return B(x1,x2,solve(y1,y2,y));}};}
var IO=bez(.4,0,.2,1), OUT=bez(.22,1,.36,1);
var clamp01=function(v){return v<0?0:v>1?1:v;};

var A=null, PENDING=null, SEEN={}, REST=null, LAST=null, BT=null, SCRUB=false;
function host(){return document.getElementById('frend');}
function accent(){var st=document.getElementById('stage'),c=st?getComputedStyle(st).backgroundColor:'';
 var m=/rgba?\(([^)]+)\)/.exec(c||''),v=m?m[1].split(',').map(parseFloat):[16,16,16];
 var L=(0.2126*v[0]+0.7152*v[1]+0.0722*v[2])/255;return L>.5?[47,110,146]:[126,184,212];}
function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
function rings(){var out=[];Object.keys(FR_RINGS||{}).forEach(function(k){var p=k.split('|').map(parseFloat);
 out.push({R:FR_RINGS[k],cx:p[0],cy:p[1],a:p[2],b:p[3],n:p[4]});});return out;}
function nums(s){return ((s||'').match(/-?\d*\.?\d+(?:e-?\d+)?/g)||[]).map(Number);}

/* ============================================================
   ARMING AND STARTING
   ============================================================ */
function arm(reason){
 if(RM)return false;
 if(typeof fviewOn!=='function'||!fviewOn()||S.tab!==TAB.FIELD)return false;
 if(P.mode==='session'&&SEEN[FVIEW]&&reason!=='replay')return false;
 SEEN[FVIEW]=true;
 finish();
 PENDING={reason:reason};
 FR_SIG=null;                   /* ringsDraw builds on the next frame */
 var h=host();if(h)h.classList.remove('tabin');
 return true;}

/* the picture as a bitmap, with the words in the product's own face, the
   layers the person has switched off still off, and the parts that move on
   their own left out, because they arrive on their own layer */
function raster(svg,skip,W,H,done){
 var c=svg.cloneNode(true);c.setAttribute('xmlns',NS);c.removeAttribute('style');
 skip.forEach(function(i){var g=c.children[i];if(g)g.setAttribute('display','none');});
 var ff='';for(var s=0;s<document.styleSheets.length;s++){try{var rs=document.styleSheets[s].cssRules;
  for(var r=0;r<rs.length;r++)if(rs[r] instanceof CSSFontFaceRule)ff+=rs[r].cssText;}catch(e){}}
 var sans=getComputedStyle(document.documentElement).getPropertyValue('--sans')||'Inter,system-ui,sans-serif';
 var off=Object.keys(FLAY_OFF||{}).map(function(k){return '.L-'+k+'{display:none}';}).join('');
 var st=document.createElementNS(NS,'style');
 st.textContent=ff+'text{font-family:'+sans+';font-variant-numeric:tabular-nums}'+off;
 c.insertBefore(st,c.firstChild);
 var u=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(c)],{type:'image/svg+xml'}));
 var im=new Image();
 im.onload=function(){var d=devicePixelRatio||1,cv=document.createElement('canvas');
  cv.width=Math.round(W*d);cv.height=Math.round(H*d);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
  URL.revokeObjectURL(u);done(cv);};
 im.onerror=function(){URL.revokeObjectURL(u);done(null);};
 im.src=u;}

function begin(svg){
 var h=host(),W=h.clientWidth,H=h.clientHeight,kids=svg.children,nL=FR_L.length,nT=FR_T.length;
 var iCore=1+FR_L.indexOf('core'),iGates=1+FR_L.indexOf('gates'),iSeats=1+nL+FR_T.indexOf('seats');
 var skip=[iCore,iGates,iSeats];for(var i=1+nL+nT;i<kids.length;i++)skip.push(i);
 if(!kids[1+FR_L.indexOf('domains')]||kids[1+FR_L.indexOf('domains')].getAttribute('class')!=='L-domains')
  {try{console.error('[arrival] the rendition is not in the order FR_L says');}catch(e){}return;}
 /* hidden at once, so the finished picture never flashes before its arrival */
 svg.style.opacity='0';
 var view=FVIEW,t0=performance.now();
 A={view:view,svg:svg,anims:[],over:[],W:W,H:H,ready:false,total:0};
 raster(svg,skip,W,H,function(bmp){
  if(!A||A.svg!==svg)return;
  if(!bmp){finish();return;}
  A.bmp=bmp;A.rasterMs=Math.round(performance.now()-t0);
  try{build(svg,skip);}catch(e){try{console.error('[arrival]',e);}catch(e2){}finish();return;}
  if(!BT)LAST={kind:'field',get:function(){return A?A.anims:[];},len:function(){return A?A.total:0;}};
  /* held for two frames, so the one off work of the build does not eat the
     first frames of the arrival itself */
  A.anims.forEach(function(a){a.pause();});A.ready=true;
  requestAnimationFrame(function(){requestAnimationFrame(function(){if(!A||A.svg!==svg)return;
   if(!SCRUB)A.anims.forEach(function(a){a.play();});tick();});});
  panelPaint();});}

/* one animation on one element, counted toward the end of the whole */
function an(el,kf,dur,delay,ease){
 var a=el.animate(kf,{duration:dur,delay:delay,easing:ease||E_OUT,fill:'both'});
 a.playbackRate=P.rate;A.anims.push(a);A.total=Math.max(A.total,delay+dur);return a;}
function origin(el,x,y){el.style.transformOrigin=x.toFixed(1)+'px '+y.toFixed(1)+'px';}
function pop(el,x,y,d,dur,ease){origin(el,x,y);
 return an(el,[{scale:'.35',opacity:0},{opacity:1,offset:.35},{scale:'1',opacity:1}],dur,d,ease||E_LAND);}
function fade(el,d,dur){return an(el,[{opacity:0},{opacity:1}],dur||220,d);}
function draw(el,d,dur){el.setAttribute('pathLength','1');
 return an(el,[{strokeDasharray:'0 1',opacity:0},{opacity:1,offset:.04},{strokeDasharray:'1 1',opacity:1}],dur,d,E_OUT);}
function mid(el,d,dur){el.setAttribute('pathLength','100');
 return an(el,[{strokeDasharray:'0 100',strokeDashoffset:'-50',opacity:0},{opacity:1,offset:.05},
  {strokeDasharray:'100 100',strokeDashoffset:'0',opacity:1}],dur,d,E_OUT);}

function place(el){var h=host(),b=h.getBoundingClientRect();
 el.style.left=(b.left+scrollX)+'px';el.style.top=(b.top+scrollY)+'px';
 el.style.width=b.width+'px';el.style.height=b.height+'px';}

/* ============================================================
   THE LAYERS. Measured, and each chosen for what it costs a frame.

   Two canvases: one that only ever grows, holding what has fully arrived,
   and one cleared every frame holding what is arriving now, the hand and
   the tracers. So a frame never copies the whole picture: it adds a sliver
   to the first and draws a few thin pieces on the second.

   The parts that move on their own are lifted out one by one, each gate,
   each seat glyph, each callout, into a small layer of its own, so its
   landing is a transform the compositor does and costs no paint at all.
   Only the core and the collar's arcs keep an SVG, because a ring filling
   is a change of shape, and that SVG is the size of the core.
   ============================================================ */
function lift(box,els,pad,cls){
 var h=host(),hb=h.getBoundingClientRect(),x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
 els.forEach(function(el){var b=el.getBoundingClientRect();x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);
  x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom);});
 x0=Math.floor(x0-hb.left-pad);y0=Math.floor(y0-hb.top-pad);x1=Math.ceil(x1-hb.left+pad);y1=Math.ceil(y1-hb.top+pad);
 var w=x1-x0,hh=y1-y0,d=document.createElement('div');d.className='ar-bit'+(cls?' '+cls:'');
 d.style.left=x0+'px';d.style.top=y0+'px';d.style.width=w+'px';d.style.height=hh+'px';
 var s=document.createElementNS(NS,'svg');s.setAttribute('class','frsvg ar-front');
 s.setAttribute('width',w);s.setAttribute('height',hh);s.setAttribute('viewBox',x0+' '+y0+' '+w+' '+hh);
 var clones=els.map(function(el){var c=el.cloneNode(true);s.appendChild(c);return c;});
 d.appendChild(s);box.appendChild(d);return {d:d,c:clones,x:x0+w/2,y:y0+hh/2};}
function build(svg,skip){
 var W=A.W,H=A.H,dial=A.view==='dial',RG=rings(),ac=accent();
 var cx=RG[0].cx,cy=RG[0].cy;A.cx=cx;A.cy=cy;A.ac=ac;
 var box=document.createElement('div');box.className='ar-over';place(box);document.body.appendChild(box);A.over.push(box);
 var d=devicePixelRatio||1;A.dpr=d;
 var mk=function(){var c=document.createElement('canvas');c.className='ar-cv';c.width=Math.round(W*d);c.height=Math.round(H*d);
  c.style.width=W+'px';c.style.height=H+'px';box.appendChild(c);return c;};
 A.ag=mk().getContext('2d');A.g=mk().getContext('2d');A.accθ=0;A.done={};
 var tm=dial?TM.dial:TM.frames;
 var kids=svg.children,nL=FR_L.length,iCore=1+FR_L.indexOf('core'),iGates=1+FR_L.indexOf('gates'),iSeats=1+nL+FR_T.indexOf('seats');
 var core=kids[iCore]&&kids[iCore].firstElementChild;
 var cd=core&&core.querySelector('circle');A.cr=cd?+cd.getAttribute('r'):40;
 if(dial){A.R=RG.reduce(function(m,r){return r.a>m.a?r:m;},RG[0]).a;A.len=tm.travel;}
 else{
  /* the bands, cut between the registers, outside in. Depths are frFrames'
     own table, measured in from the outer frame */
  var fr=RG.filter(function(r){return r.n===12;});
  var o=fr.reduce(function(m,r){return r.a>m.a?r:m;},fr[0]),sc=Math.min(o.a,o.b)/381;
  var cuts=[22,100,116,140,156,173,189,202,240];
  var edge=cuts.map(function(D){return frRingC(cx,cy,o.a-D*sc,o.b-D*sc,12);});
  A.bands=[];
  for(var k=0;k<=cuts.length;k++){
   var p=new Path2D();
   if(k===0)p.addPath(new Path2D('M-50 -50H'+(W+50)+'V'+(H+50)+'H-50Z'));else p.addPath(new Path2D(edge[k-1].d(2)));
   if(k<cuts.length)p.addPath(new Path2D(edge[k].d(2)));
   A.bands.push({p:p,s:k*tm.step});}
  /* one tracer per band, on the frame a person can see in it */
  A.trace=[0,31,106,119,147,165,181,197,207,248].map(function(D,k){var R=frRingC(cx,cy,o.a-D*sc,o.b-D*sc,12);
   return {p:new Path2D(R.d(3)),L:R.len,s:k*tm.step};});
  A.len=Math.max(cuts.length*tm.step+tm.land,(A.trace.length-1)*tm.step+tm.trace+100);}
 /* the clock. An animation with no visible effect, so the speed and the
    scrubber that drive every other animation drive the canvas too */
 A.clock=box.animate([{opacity:1},{opacity:1}],{duration:A.len,fill:'both'});
 A.clock.playbackRate=P.rate;A.anims.push(A.clock);A.total=A.len;

 var bearing=function(x,y){return ((Math.atan2(y-cy,x-cx)+Math.PI/2)/TAU+1)%1;};
 /* when the reveal reaches a bearing: the hand on the Dial; on Frames the
    band the seat glyphs sit in */
 var reach=function(u){return dial?tm.travel*IO.inv(u*TAU/(TAU+tm.feather)):A.bands[1].s+tm.land*.5;};
 var c0=dial?160:A.bands.length*tm.step-120;
 var popD=function(bit,d0,dur,ease,from){
  an(bit.d,[{scale:String(from||.35),opacity:0},{opacity:1,offset:.35},{scale:'1',opacity:1}],dur,d0,ease);};
 /* THE CORE AND THE COLLAR'S ARCS, in the one small SVG. The glass bar's
    ring at hero size: ground and track, then CQ clockwise from twelve and
    DQ the other way from the same twelve, then the figures. */
 var gates=kids[iGates]?[].slice.call(kids[iGates].children):[];
 var arcs=[];gates.forEach(function(g){[].slice.call(g.children).forEach(function(el){if(el.tagName==='path')arcs.push(el);});});
 if(core){
  var cb=lift(box,[core].concat(arcs),6,'ar-core'),cc=cb.c[0];
  an(cb.d,[{scale:'.9',opacity:0},{opacity:1,offset:.3},{scale:'1',opacity:1}],TM.core.scale,c0,E_OUT);
  [].slice.call(cc.children).forEach(function(el){
   if(el.tagName==='path'){var n=nums(el.getAttribute('d')),twelve=Math.abs(n[0]-cx)<.8&&n[1]<cy;
    el.setAttribute('pathLength','100');
    if(twelve)an(el,[{strokeDasharray:'0 100',opacity:0},{opacity:1,offset:.03},{strokeDasharray:'100 100',opacity:1}],TM.core.fill,c0+140,E_OUT);
    else an(el,[{strokeDasharray:'100 100',strokeDashoffset:'-100',opacity:0},{opacity:1,offset:.03},
     {strokeDasharray:'100 100',strokeDashoffset:'0',opacity:1}],TM.core.fill,c0+140,E_OUT);}
   else if(el.tagName==='text'||el.tagName==='line')
    an(el,[{opacity:0,translate:'0 4px'},{opacity:1,translate:'0 0'}],TM.core.text,c0+140+TM.core.fill*.55,E_OUT);});
  A.coreArcs=cb.c.slice(1);}
 /* THE GATES, clockwise from awareness at twelve, the Wheel's 62ms apart.
    The collar grows from the middle of its sector, in the core's SVG; the
    disc, glyph and pill land together, on their own layer */
 var gl=gates.map(function(g,i){var c=g.querySelector('circle');
  var x=c?+c.getAttribute('cx'):cx,y=c?+c.getAttribute('cy'):cy;return {g:g,i:i,x:x,y:y,t:(bearing(x,y)+.02)%1};});
 gl.sort(function(a,b){return a.t-b.t;});
 var g0=c0+380,ai=0,arcOf=[];gates.forEach(function(g,i){arcOf[i]=[];[].slice.call(g.children).forEach(function(el){
  if(el.tagName==='path')arcOf[i].push((A.coreArcs||[])[ai++]);});});
 gl.forEach(function(o,k){var dl=g0+k*TM.gate.step;
  (arcOf[o.i]||[]).forEach(function(el,j){if(!el)return;if(j)mid(el,dl+80,TM.gate.fill);else fade(el,dl,200);});
  var parts=[].slice.call(o.g.children).filter(function(el){return el.tagName!=='path';});
  if(parts.length){var bit=lift(box,parts,3);bit.d.style.transformOrigin=(o.x-parseFloat(bit.d.style.left))+'px '+(o.y-parseFloat(bit.d.style.top))+'px';
   popD(bit,dl,TM.gate.pop,E_LAND);}});
 /* THE SEVEN SEAT GLYPHS carry no quantity, so they land with the overshoot */
 if(kids[iSeats])[].slice.call(kids[iSeats].children).forEach(function(el){
  var bit=lift(box,[el],2);popD(bit,reach(bearing(bit.x,bit.y))+60,TM.seat.pop,E_LAND);});
 /* THE CALLOUTS, last, one at a time, each rising three pixels into place */
 var calls=[];for(var i=1+nL+FR_T.length;i<kids.length;i++)[].slice.call(kids[i].children).forEach(function(el){
  var c=el.querySelector('circle');if(c)calls.push({el:el,t:bearing(+c.getAttribute('cx'),+c.getAttribute('cy'))});});
 calls.sort(function(a,b){return a.t-b.t;});
 var k0=dial?tm.travel+60:g0+200;
 calls.forEach(function(o,k){var bit=lift(box,[o.el],2);
  an(bit.d,[{opacity:0,translate:'0 3px'},{opacity:1,translate:'0 0'}],240,k0+k*TM.call.step,E_OUT);});
 A.timer=setTimeout(finish,A.total/P.rate+80);}

/* ============================================================
   THE REVEAL, one frame of it, at the clock's own time
   ============================================================ */
function wedge(g,cx,cy,a0,a1){var R=4000;g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,R,-Math.PI/2+a0,-Math.PI/2+a1);g.closePath();}
function paint(tau){
 var g=A.g,ag=A.ag,d=A.dpr,W=A.W,H=A.H,cx=A.cx,cy=A.cy,bmp=A.bmp,ac=A.ac;
 var put=function(ctx){ctx.drawImage(bmp,0,0,W,H);};
 g.setTransform(d,0,0,d,0,0);ag.setTransform(d,0,0,d,0,0);
 g.clearRect(0,0,W,H);
 if(A.view==='dial'){
  var tm=TM.dial,F=tm.feather,p=clamp01(tau/tm.travel),th=IO.at(p)*(TAU+F),full=Math.max(0,th-F);
  /* what has fully arrived is added to once and never redrawn */
  if(full<A.accθ-1e-6){ag.clearRect(0,0,W,H);A.accθ=0;}
  if(full>A.accθ){ag.save();wedge(ag,cx,cy,Math.max(0,A.accθ-.004),full);ag.clip();put(ag);ag.restore();A.accθ=full;}
  /* the feather behind the hand: fainter and a shade nearer the centre the
     closer it is to the hand, so a mark comes up and settles outward */
  [[.7,1],[.3,.984]].forEach(function(s,j){
   var a0=Math.max(0,th-F+j*F/2),a1=Math.min(TAU,Math.max(0,th-F+(j+1)*F/2));if(a1<=a0)return;
   g.save();wedge(g,cx,cy,a0,a1);g.clip();g.globalAlpha=s[0];
   if(s[1]!==1){g.translate(cx,cy);g.scale(s[1],s[1]);g.translate(-cx,-cy);}put(g);g.restore();});
  /* THE HAND. A trail of the accent twenty six degrees long, brightest at the
     hand, held between the core and the rim, and the hand itself */
  var env=p<.1?p/.1:p>.84?Math.max(0,1-(p-.84)/.16):1;
  if(env>0){var R=A.R,cr=A.cr+4,ha=-Math.PI/2+th,trail=.45;
   g.save();g.globalAlpha=env;
   g.beginPath();g.arc(cx,cy,R,0,TAU);g.arc(cx,cy,cr,0,TAU,true);g.clip();
   var cg=g.createConicGradient(ha-trail,cx,cy);
   /* measured on the first cut: .26 over forty degrees read as a pale pie
      slice, a radar and not a watch. Fainter, shorter, and gathered at the
      hand, so what reads is a hand with light on it */
   cg.addColorStop(0,rgba(ac,0));cg.addColorStop(trail/TAU*.7,rgba(ac,.025));
   cg.addColorStop(trail/TAU,rgba(ac,.13));cg.addColorStop(Math.min(1,trail/TAU+.001),rgba(ac,0));cg.addColorStop(1,rgba(ac,0));
   g.fillStyle=cg;g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,R,ha-trail,ha);g.closePath();g.fill();
   var lg=g.createLinearGradient(cx+Math.cos(ha)*cr,cy+Math.sin(ha)*cr,cx+Math.cos(ha)*R,cy+Math.sin(ha)*R);
   lg.addColorStop(0,rgba(ac,0));lg.addColorStop(.4,rgba(ac,.55));lg.addColorStop(1,rgba(ac,.95));
   g.strokeStyle=lg;g.lineWidth=2;g.lineCap='round';
   g.beginPath();g.moveTo(cx+Math.cos(ha)*cr,cy+Math.sin(ha)*cr);g.lineTo(cx+Math.cos(ha)*R,cy+Math.sin(ha)*R);g.stroke();
   g.restore();}}
 else{
  var ft=TM.frames,redo=false;
  A.bands.forEach(function(b,k){if(A.done[k]&&tau<b.s+ft.land)redo=true;});
  if(redo){ag.clearRect(0,0,W,H);A.done={};}
  A.bands.forEach(function(b,k){if(!A.done[k]&&tau>=b.s+ft.land){ag.save();ag.clip(b.p,'evenodd');put(ag);ag.restore();A.done[k]=1;}});
  /* a frame landing: it fades up and drops from a shade larger into place */
  A.bands.forEach(function(b){var q=(tau-b.s)/ft.land;if(q<=0||q>=1)return;var e=OUT.at(q),s=1+ft.scale*(1-e);
   g.save();g.clip(b.p,'evenodd');g.globalAlpha=e;g.translate(cx,cy);g.scale(s,s);g.translate(-cx,-cy);put(g);g.restore();});
  /* and a point of light runs once round it, head and tail */
  g.lineCap='round';
  A.trace.forEach(function(t,k){var q=(tau-t.s)/ft.trace;if(q<=0||q>=1)return;
   var f=IO.at(q)*t.L,env=q<.08?q/.08:q>.82?Math.max(0,1-(q-.82)/.18):1,fade=1-k*.05;
   [[.16,.34,1.3],[.03,.95,2.2]].forEach(function(s){var seg=s[0]*t.L;
    g.setLineDash([seg,t.L]);g.lineDashOffset=seg-f;g.strokeStyle=rgba(ac,s[1]*fade*env);g.lineWidth=s[2];g.stroke(t.p);});});
  g.setLineDash([]);}}
function tick(){
 if(!A||!A.ready)return;
 var t=A.clock.currentTime;if(t==null)t=A.len;
 paint(Math.max(0,t));
 A.raf=requestAnimationFrame(tick);}

function finish(){
 if(!A)return;
 clearTimeout(A.timer);cancelAnimationFrame(A.raf);
 A.anims.forEach(function(a){try{a.cancel();}catch(e){}});
 A.over.forEach(function(o){if(o.parentNode)o.parentNode.removeChild(o);});
 if(A.svg)A.svg.style.opacity='';
 A=null;
 if(P.rest==='breath')restPaint();
 panelPaint();}

/* ============================================================
   AT REST, AN OPTION AND NOT THE DEFAULT. Held charge breathes.

   The Wheel breathes on a 4.49 second clock, sin(S.t x 1.4). This borrows
   that clock and gives it only to what carries weight: every address the
   Wheel itself gives a glow to, SQ 6.5 and over, takes a soft outline of its
   own seat colour that swells and fades, phased by bearing so it travels
   round the ring. An empty field is still, because nothing is held. It is a
   small layer of its own, so the picture under it is never repainted.
   ============================================================ */
function restClear(){if(REST&&REST.parentNode)REST.parentNode.removeChild(REST);REST=null;}
function restPaint(){
 restClear();
 if(RM||P.rest!=='breath'||A||!fviewOn()||S.tab!==TAB.FIELD)return;
 var h=host(),svg=h&&h.querySelector('svg.frsvg');if(!svg)return;
 var RG=rings();if(!RG.length)return;var cx=RG[0].cx,cy=RG[0].cy,n=0;
 var box=document.createElement('div');box.className='ar-over';place(box);
 var sv=document.createElementNS(NS,'svg');sv.setAttribute('width',h.clientWidth);sv.setAttribute('height',h.clientHeight);
 sv.setAttribute('class','ar-trace');box.appendChild(sv);
 svg.querySelectorAll('.L-addresses > g[data-h]').forEach(function(g){
  var rec=FR_HIT[+g.getAttribute('data-h')];if(!rec||rec.k!=='node'||!rec.n||(rec.n.sq||0)<6.5)return;
  var v=g.children[1];if(!v)return;var q=nums(v.getAttribute('d'));
  var p=document.createElementNS(NS,'path');p.setAttribute('d',v.getAttribute('d'));p.setAttribute('fill','none');
  p.setAttribute('stroke',v.getAttribute('fill'));p.setAttribute('stroke-width','3');p.setAttribute('stroke-linejoin','round');
  sv.appendChild(p);n++;
  var t=((Math.atan2(q[1]-cy,q[0]-cx)+Math.PI/2)/TAU+1)%1;
  p.animate([{opacity:0},{opacity:.55}],{duration:2245,delay:-t*4490,iterations:Infinity,direction:'alternate',easing:E_SINE});});
 if(!n)return;
 document.body.appendChild(box);REST=box;}

/* ============================================================
   THE HOOKS, laid over the shipped functions without editing them
   ============================================================ */
var _rd=window.ringsDraw;
window.ringsDraw=function(r){
 var h=host(),before=h&&h.firstElementChild;
 _rd(r);
 var after=h&&h.firstElementChild;
 if(!after||after===before)return;
 if(PENDING){PENDING=null;begin(after);return;}
 /* rebuilt mid arrival, by a resize or a reading: finish, rather than
    reveal a picture that is no longer the one on screen */
 if(A){finish();return;}
 if(P.rest==='breath')restPaint();};
var _fs=window.fviewSet;
window.fviewSet=function(k){var was=FVIEW;_fs(k);
 if(FVIEW!==was){restClear();if(!arm('switch')){finish();if(P.rest==='breath')setTimeout(restPaint,50);}}
 panelPaint();};
var _st=window.setTab;
window.setTab=function(i){var was=S.tab;_st.apply(this,arguments);
 if(S.tab===TAB.FIELD&&was!==TAB.FIELD&&BOOTED)arm('land');
 if(S.tab!==TAB.FIELD){finish();restClear();}};
(function(){var h=host();if(h)h.addEventListener('pointerdown',function(){if(A)finish();});})();
addEventListener('keydown',function(e){if(e.key==='Escape'&&A)finish();});
addEventListener('resize',function(){if(REST)setTimeout(restPaint,80);});

/* ============================================================
   THE BOOT HANDS OFF TO THE FIELD
   ============================================================ */
var BOOTED=false, HANDOFF_WAIT=false;
function handoff(){
 /* a boot held on a frame by the scrubber hands off when it is played on */
 if(SCRUB){HANDOFF_WAIT=true;return;}
 HANDOFF_WAIT=false;BOOTED=true;
 if(S.tab!==TAB.FIELD)return;
 if(fviewOn())arm('first');
 /* THE WHEEL'S ENTRANCE, MOVED TO WHERE IT CAN BE SEEN. Shipped, it starts at
    page load under the sheet. Here it starts as the sheet fades. */
 else if(typeof enterStart==='function'){ENTER_SEEN=false;enterStart();}}
function watchBoot(el,which){
 var done=false;
 el.addEventListener('animationstart',function(e){
  if(e.target===el&&e.animationName==='bootOut'&&which!=='shipped')handoff();});
 el.addEventListener('animationend',function(e){
  if(e.target===el&&e.animationName==='bootOut')gone();});
 function gone(){if(done)return;done=true;
  if(el.parentNode)el.parentNode.removeChild(el);
  if(BT&&BT.el===el){clearTimeout(BT.floor);BT=null;}
  if(which==='shipped')BOOTED=true;
  document.body.classList.add('booted');panelPaint();}
 return gone;}
/* the boot on first load. panels.js still owns its removal and its floor;
   this only listens for the fade starting so the Field begins under it */
var first=document.getElementById('boot');
if(first)watchBoot(first,'next');else BOOTED=true;

/* replaying either boot, with the product's own floor, so the shipped one is
   cut exactly as it is cut today */
function bootPlay(which){
 finish();bootKill();
 var w=document.createElement('div');w.innerHTML=AR_BOOT[which];var el=w.firstElementChild;
 if(which==='next')el.style.setProperty('--hold',P.hold+'s');
 document.body.insertBefore(el,document.body.firstChild);
 getComputedStyle(el).opacity;
 var gone=watchBoot(el,which);
 BOOTED=false;
 var floor=5450+(which==='next'?P.hold*1000:0);
 el.getAnimations({subtree:true}).forEach(function(a){a.playbackRate=P.rate;});
 BT={el:el,which:which,floor:setTimeout(function(){gone();if(which==='shipped')handoff();},floor/P.rate)};
 LAST={kind:'boot',get:function(){return BT&&BT.el.isConnected?BT.el.getAnimations({subtree:true}):[];},
  len:function(){return which==='next'?5240+P.hold*1000:7260;}};
 panelPaint();}
function bootKill(){if(BT){clearTimeout(BT.floor);if(BT.el.parentNode)BT.el.parentNode.removeChild(BT.el);BT=null;}
 var e=document.getElementById('boot');if(e&&e.parentNode)e.parentNode.removeChild(e);}

/* ============================================================
   SET UP: James with his five story bank lines, on the Dial, the way every
   Field round has been shot, done under the sheet so the first thing seen
   after it is the arrival
   ============================================================ */
function setup(){
 if(typeof PEOPLE==='undefined'||typeof loadP!=='function'||!document.getElementById('tabbar')
  ||!document.getElementById('tabbar').children.length)return setTimeout(setup,60);
 var hh=(location.hash||'').toLowerCase();
 try{
  if(hh.indexOf('blank')<0){var i=PEOPLE.findIndex(function(q){return q.nm==='James';});
   if(i>=0){loadP(i);AR_JAMES.forEach(function(t,k){applyStory(t);verpApply(t);
    if(typeof leanApply==='function')leanApply(t);
    CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
    CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});}}
  _fs(hh.indexOf('frames')>=0?'frames':hh.indexOf('wheel')>=0?'wheel':'dial');
  if(S.tab!==TAB.FIELD)_st(TAB.FIELD);
  render();}
 catch(e){try{console.error('[arrival] setup',e);}catch(e2){}}
 panel();
 document.documentElement.setAttribute('data-ar-ready','1');}
setup();

/* ============================================================
   THE PROTOTYPE'S OWN CONTROLS. Dashed, because nothing in them is product.
   ============================================================ */
var PANEL=null;
window.__AR=function(){return {A:A,P:P,LAST:LAST,BT:BT};};
function btn(k,v,label,sub){return '<button type="button" data-ar-'+k+'="'+v+'">'+(sub?'<small>'+sub+'</small>':'')+label+'</button>';}
function panel(){
 if(PANEL)return;
 var d=document.createElement('div');d.id='ar-opts';
 d.innerHTML='<button type="button" class="ar-ob" aria-expanded="false">Motion prototype</button>'
  +'<div class="ar-oc" hidden>'
  +'<p class="ar-h">The boot</p>'
  +'<div class="ar-seg">'+btn('boot','next','Play the new boot')+btn('boot','shipped','Play the shipped boot')+'</div>'
  +'<div class="ar-seg" role="radiogroup" aria-label="Boot length">'+btn('hold','0','5.2 seconds','Fits today’s floor')+btn('hold','2','7.2 seconds','The two second ruling')+'</div>'
  +'<p class="ar-h">The Field</p>'
  +'<div class="ar-seg" role="radiogroup" aria-label="Rendition">'+btn('view','wheel','Wheel')+btn('view','frames','Frames')+btn('view','dial','Dial')+'</div>'
  +'<div class="ar-seg">'+btn('replay','1','Play the arrival again')+'</div>'
  +'<div class="ar-seg" role="radiogroup" aria-label="When it plays">'+btn('mode','switch','Every switch','Plays')+btn('mode','session','Once a session','Plays')+'</div>'
  +'<div class="ar-seg" role="radiogroup" aria-label="At rest">'+btn('rest','still','Still','At rest')+btn('rest','breath','Held charge breathes','At rest')+'</div>'
  +'<p class="ar-h">Watch it closely</p>'
  +'<div class="ar-seg" role="radiogroup" aria-label="Speed">'+btn('rate','1','Real time')+btn('rate','0.5','Half')+btn('rate','0.25','Quarter')+'</div>'
  +'<label class="ar-scrub"><span>Scrub the last thing played</span><input type="range" min="0" max="1000" value="0" aria-label="Scrub"><output>0.00 s</output></label>'
  +'<div class="ar-seg">'+btn('play','1','Play from here')+'</div>'
  +'<p class="ar-note"></p></div>';
 document.body.appendChild(d);PANEL=d;
 var ob=d.querySelector('.ar-ob'),oc=d.querySelector('.ar-oc');
 ob.addEventListener('click',function(){var o=oc.hidden;oc.hidden=!o;ob.setAttribute('aria-expanded',String(o));});
 d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b===ob)return;
  if(b.hasAttribute('data-ar-boot')){SCRUB=false;bootPlay(b.getAttribute('data-ar-boot'));}
  else if(b.hasAttribute('data-ar-hold')){P.hold=+b.getAttribute('data-ar-hold');}
  else if(b.hasAttribute('data-ar-view')){window.fviewSet(b.getAttribute('data-ar-view'));}
  else if(b.hasAttribute('data-ar-replay')){SCRUB=false;if(!fviewOn()){ENTER_SEEN=false;enterStart();}else arm('replay');}
  else if(b.hasAttribute('data-ar-mode')){P.mode=b.getAttribute('data-ar-mode');SEEN={};}
  else if(b.hasAttribute('data-ar-rest')){P.rest=b.getAttribute('data-ar-rest');if(P.rest==='breath')restPaint();else restClear();}
  else if(b.hasAttribute('data-ar-rate')){P.rate=+b.getAttribute('data-ar-rate');
   if(LAST)LAST.get().forEach(function(a){a.playbackRate=P.rate;});}
  else if(b.hasAttribute('data-ar-play')){SCRUB=false;
   if(LAST)LAST.get().forEach(function(a){a.playbackRate=P.rate;a.play();});
   if(HANDOFF_WAIT)handoff();
   if(LAST&&LAST.kind==='field'&&A){clearTimeout(A.timer);A.timer=setTimeout(finish,Math.max(0,A.total-(A.scrubAt||0))/P.rate+80);}}
  panelPaint();});
 var rg=d.querySelector('.ar-scrub input'),out=d.querySelector('.ar-scrub output');
 rg.addEventListener('input',function(){if(!LAST)return;var L=LAST.len(),t=+rg.value/1000*L;
  SCRUB=true;if(BT)clearTimeout(BT.floor);if(A){clearTimeout(A.timer);A.scrubAt=t;}
  LAST.get().forEach(function(a){a.pause();a.currentTime=t;});out.textContent=(t/1000).toFixed(2)+' s';});
 panelPaint();}
function panelPaint(){
 if(!PANEL)return;
 var set=function(k,v){PANEL.querySelectorAll('[data-ar-'+k+']').forEach(function(b){
  b.setAttribute('aria-pressed',String(b.getAttribute('data-ar-'+k)===String(v)));});};
 set('hold',P.hold);set('view',typeof FVIEW!=='undefined'?FVIEW:'');set('mode',P.mode);set('rest',P.rest);set('rate',P.rate);
 var n=PANEL.querySelector('.ar-note');
 if(n)n.textContent=RM?'Reduced motion is on in this browser, so nothing here moves, which is the ruled behaviour.'
  :(A?'Arriving. A press on the picture finishes it.':'Build '+AR_BUILD.commit+'. Nothing in this panel is product.');}
})();
