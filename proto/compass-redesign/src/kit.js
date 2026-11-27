/* ============================================================
   THE COMPASS AS A CIRCLE. Four proposals, one kit.

   Round HS in TASKS.md, his words: "the CQ is showing where things are
   weighted and it's showing where you're either overexpressed or
   underexpressed. You want that to be a circle. You want your CQ to be
   100. And this whole thing should be a circle. And radiating ... it
   should fade up and fade down ... it should actually be showing you the
   balance. Update the compass using the same art direction of the field."

   What is shared by all four, so the four differ only in what they read:

   THE SCALE. A radius runs from the hub (nothing) to the rim (all of it).
   The rim is the circle he asked for: every element at full, CQ 100. The
   reference circle is the person's own centre. For the laws it is CQ
   exactly, because CQ is the 21 laws over 210 (engine/compute.js cqSum), so
   the mean radius of the shape and the CQ circle are the same circle by
   construction, not by a fit.

   OVER AND UNDER are measured against that centre, never against 10.
   Outside the circle is over: it glows in its seat colour. Inside is under:
   it sinks to --sunk, darker than the stage. Light is the reading, so no
   red and no green: position and light carry it. The alarm is not used,
   because nothing here is wrong.

   THE BEARINGS ARE THE FIELD'S. Each seat sits on the stretch of the
   wheel its addresses hold (engine/core.js, i/108 of a turn from twelve,
   clockwise), captured by capture.js, so a seat is where the Field has it.

   THE MOTION IS THE FIELD'S OWN, ON ITS OWN NUMBERS (ui/wheel.js,
   fringeStep and fringeDraw, round HH):
     the bend      an underdamped spring, 196 and 2 x 0.42 x 14, so a
                   change arrives about a fifth past its mark and settles
                   inside half a second. It has mass.
     the fringes   five bands, crowding where the gap from centre is
                   largest, strength off that gap and nothing else.
     the breath    0.82 to 1.0 on the Field's 4.2 second wave, staggered
                   per element. A balanced element has no fringe, so
                   nothing breathes where there is nothing to say.
     the travel    only after a real change. A value that rose sends its
                   bands the way it moved, a value that fell sends them
                   back, and a steady one stands. Direction is kept, as
                   the Field keeps it, until the value changes again.
   Reduced motion gets the end state: the shape at its mark, the bands at a
   fixed phase, no travel and no breath.
   ============================================================ */

/* ---- THE TOKENS. Nothing is drawn in a colour that is not one of these. ----
   The structural values are the Dark lighting's, atuned_src/shell/head.html
   lines 68 to 121, and the Compass stage is the ruled #101010 at line 1318.
   The seven seats and the ten tier colours are not typed here at all: they
   are CX.pal and CX.tiercol, read off the live build by capture.js. The shot
   script checks the typed ones against the build's own computed :root. */
var TOK={bg:'#0C0D12',panel:'#1A1D26',panel2:'#252833',sunk:'#090A0E',stage:'#101010',
 ink:'#EFEDE8',mid:'#B4B0A8',dim:'#94908A',accent:'#7EB8D4'};
Object.keys(CX.pal).forEach(function(k){TOK[k]=CX.pal[k];});
Object.keys(CX.tiercol).forEach(function(k){TOK['tier:'+k]=CX.tiercol[k];});
var USED={};
function hx(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
/* THE ONLY WAY TO A COLOUR. A name that is not a token throws, so a colour
   that is not the brand cannot be drawn by accident, and every name used is
   recorded for the shot script to report. Alpha is the only change allowed:
   a token at an opacity is that token over the ground. No mixing. */
function C(k,a){var h=TOK[k];if(!h)throw new Error('not a brand token: '+k);USED[k]=1;
 if(a==null||a>=1)return h;var c=hx(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+Math.max(0,a).toFixed(3)+')';}

var TAU=Math.PI*2;
var REDUCED=false;try{REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function fmt(n,d){return (+n).toLocaleString('en-GB',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}

/* the seat an angle falls in, off the Field's sectors */
function seatAt(t){t=((t%1)+1)%1;for(var i=0;i<CX.seats.length;i++){var s=CX.sector[CX.seats[i]];if(t>=s.t0&&t<s.t1)return CX.seats[i];}return CX.seats[CX.seats.length-1];}
function angOf(t){return t*TAU-Math.PI/2;}
/* frSpread's rule, ui/rings.js: each item of a seat sits inside that seat's
   stretch, spread evenly across it */
function spread(items,seatKey){var out=[];CX.seats.forEach(function(b){var S0=CX.sector[b],mine=[];
 items.forEach(function(x,i){if(x[seatKey]===b)mine.push(i);});
 mine.forEach(function(i,k){out[i]=S0.t0+(k+.5)/mine.length*(S0.t1-S0.t0);});});return out;}

/* ---- WHAT EACH OPTION READS ----
   els(person, stage) returns the elements, each with a bearing (t, a share of
   a turn), a value on a nought to a hundred scale, its seat and its mark, and
   ref, the centre the elements are over or under. */
var LAW_T=spread(CX.laws,'b'), MIR_T=spread(CX.mirror,'seat');
var OPTS={
 a:{id:'a',nm:'Twenty one laws',short:'Laws',
  what:'The 21 laws, each at its own score. The circle is your coherence exactly.',
  els:function(P,st){return CX.laws.map(function(l,j){return {k:l.nm,nm:l.nm,seat:l.b,t:LAW_T[j],v:st.laws[j]*10,
   ic:l.ic,of:10,shown:st.laws[j]};});},
  ref:function(P,st){return st.cq;}, refNm:'Your coherence'},
 b:{id:'b',nm:'Eight mirror axes',short:'Mirror axes',
  what:'The compass\'s own eight axes, coherent pole at the rim. The circle is the centre of your eight.',
  els:function(P,st){return CX.mirror.map(function(m,j){return {k:m.k,nm:m.q,seat:m.seat,t:MIR_T[j],v:st.mirror[j].pos,
   ic:m.ic,dic:m.dic,up:m.up,dn:m.dn,of:100,shown:st.mirror[j].pos};});},
  ref:function(P,st){var s=0;st.mirror.forEach(function(m){s+=m.pos;});return s/st.mirror.length;},refNm:'The centre of your eight'},
 c:{id:'c',nm:'Seven seats, under load',short:'Seats',
  what:'The Field\'s own shell, set at your coherence and bent by each seat\'s laws.',
  els:function(P,st){return CX.seats.map(function(b){var S0=CX.sector[b];return {k:b,nm:b,seat:b,t:(S0.t0+S0.t1)/2,
   v:st.seatIg[b]*10,ic:CX.seatGlyph[b],of:10,shown:st.seatIg[b],span:(S0.t1-S0.t0)};});},
  ref:function(P,st){return st.cq;}, refNm:'Your coherence'},
 d:{id:'d',nm:'Growth rings',short:'Rings',
  what:'The laws again, with every earlier reading left behind as a ring, so the growth radiates.',
  els:function(P,st){return OPTS.a.els(P,st);},
  ref:function(P,st){return st.cq;}, refNm:'Your coherence'}};

/* ---- THE SHARED STATE. The board and the pages move together. ---- */
var ST={p:2,s:0,listeners:[]};
function stSet(p,s){var fresh=(p!==ST.p);ST.p=p;ST.s=s;ST.listeners.forEach(function(f){f(fresh);});}

/* ============================================================
   ONE INSTANCE: a canvas, its springs, its loop.
   ============================================================ */
function Compass(canvas,optId,onHover){
 var I={cv:canvas,g:canvas.getContext('2d'),o:OPTS[optId],els:[],ref:null,t:0,dpr:1,W:0,H:0,hover:null,hits:[]};
 function size(){var b=I.cv.getBoundingClientRect();I.dpr=Math.min(devicePixelRatio||1,2);
  I.W=Math.max(1,b.width);I.H=Math.max(1,b.height);I.cv.width=I.W*I.dpr;I.cv.height=I.H*I.dpr;}
 /* set the targets for the current person and stage. A new person starts
    every element steady, as hotTrack does on a switch of record, so a move
    from one person to another is never read as a change in either. */
 function target(fresh){
  var P=CX.people[ST.p],st=P.stages[ST.s],E=I.o.els(P,st),r=I.o.ref(P,st);
  E.forEach(function(e,i){var o=I.els[i];
   if(!o||fresh){o=I.els[i]={x:o&&!fresh?o.x:e.v,v:0,dir:0,ph:0,last:e.v};}
   /* a law moves by a few thousandths a run, so the threshold is small: any
      rise the engine made is a direction, however little distance it covers */
   var d=e.v-o.last; if(Math.abs(d)>1e-4){o.dir=d>0?1:-1;o.last=e.v;}
   if(fresh){o.dir=0;o.last=e.v;}
   o.e=e;o.tgt=e.v;if(REDUCED)o.x=e.v;});
  I.els.length=E.length;
  if(!I.ref||fresh)I.ref={x:r,v:0};I.ref.tgt=r;if(REDUCED)I.ref.x=r;
  I.P=P;I.st=st;}
 function spring(o,dt){var sub=Math.max(1,Math.ceil(dt/(1/120))),sd=dt/sub;
  for(var s=0;s<sub;s++){var a=196*(o.tgt-o.x)-2*0.42*14*o.v;o.v+=a*sd;o.x+=o.v*sd;}}
 function step(dt){
  if(!REDUCED){I.t+=dt;I.els.forEach(function(o){spring(o,dt);
   var sg=(o.x>=I.ref.x)?1:-1; o.ph+=dt*0.9*o.dir*sg;});spring(I.ref,dt);}}
 function geo(){var m=I.W<520?24:34,R=Math.min(I.W,I.H)/2-m;
  return {cx:I.W/2,cy:I.H/2,R:R,r0:R*.2,sk:clamp(R/300,.55,1.3),rad:function(v){return R*.2+R*.8*clamp(v,0,100)/100;}};}
 var last=0;
 function frame(ts){var dt=last?Math.min(1/30,(ts-last)/1000):1/60;last=ts;step(dt);draw();I.raf=requestAnimationFrame(frame);}
 function draw(){var g=I.g,G=geo();g.setTransform(I.dpr,0,0,I.dpr,0,0);g.clearRect(0,0,I.W,I.H);
  g.fillStyle=C('stage');g.fillRect(0,0,I.W,I.H);I.hits=[];
  DRAW[I.o.id](g,G,I);}
 I.hit=function(x,y){var best=null,bd=1e9;I.hits.forEach(function(h){var d=Math.hypot(x-h.x,y-h.y);if(d<h.r&&d<bd){bd=d;best=h;}});return best;};
 canvas.addEventListener('pointermove',function(ev){var b=canvas.getBoundingClientRect(),h=I.hit(ev.clientX-b.left,ev.clientY-b.top);
  canvas.style.cursor=h?'pointer':'default';if((h&&h.e)!==I.hover){I.hover=h&&h.e;if(onHover)onHover(I.hover);}});
 canvas.addEventListener('pointerleave',function(){if(I.hover){I.hover=null;if(onHover)onHover(null);}});
 size();target(true);
 ST.listeners.push(function(fresh){target(fresh);});
 addEventListener('resize',function(){size();});
 I.raf=requestAnimationFrame(frame);
 I.geo=geo;I.target=target;
 return I;}

/* ============================================================
   THE PIECES EVERY OPTION DRAWS WITH
   ============================================================ */
/* the radius of the shape at bearing t, through every element exactly: a
   periodic cardinal spline on (bearing, radius), so the curve never smooths
   a reading away and never overshoots between two neighbours by much */
function shapeAt(els,t,key){var n=els.length;if(n===1)return els[0][key];
 var i=0;for(;i<n;i++){var a=els[i].t,b=(i+1<n?els[i+1].t:els[0].t+1);var tt=t<els[0].t?t+1:t;if(tt>=a&&tt<b)break;}
 if(i>=n)i=n-1;
 var i0=(i-1+n)%n,i2=(i+1)%n,i3=(i+2)%n,a0=els[i].t,a1=(i+1<n?els[i+1].t:els[0].t+1);
 var tt2=t<els[0].t?t+1:t,u=clamp((tt2-a0)/((a1-a0)||1),0,1);
 var p0=els[i0][key],p1=els[i][key],p2=els[i2][key],p3=els[i3][key],k=.5;
 var m1=(p2-p0)*k,m2=(p3-p1)*k,u2=u*u,u3=u2*u;
 return (2*u3-3*u2+1)*p1+(u3-2*u2+u)*m1+(-2*u3+3*u2)*p2+(u3-u2)*m2;}
function sortedEls(I){return I.els.map(function(o){return {t:o.e.t,x:o.x,o:o};}).sort(function(a,b){return a.t-b.t;});}
function pt(G,t,v){var a=angOf(t),r=G.rad(v);return [G.cx+Math.cos(a)*r,G.cy+Math.sin(a)*r];}
/* a 24 unit glyph, stroked, ring and never fill */
function glyph(g,d,x,y,size,col,w){if(!d)return;var s=size/24;g.save();g.translate(x-size/2,y-size/2);g.scale(s,s);
 g.strokeStyle=col;g.lineWidth=(w||1.7)/s;g.lineJoin='round';g.lineCap='round';
 try{var ds=d.indexOf('<')>=0?svgPaths(d):[d];ds.forEach(function(q){g.stroke(new Path2D(q));});}catch(e){}g.restore();}
/* the seat glyphs are markup, a path or a circle; read them into path data */
function svgPaths(m){var out=[],re=/<(path|circle)([^>]*)>/g,x;while((x=re.exec(m))){var at=x[2];
 if(x[1]==='path'){var d=/d="([^"]+)"/.exec(at);if(d)out.push(d[1]);}
 else{var cx=+/cx="([^"]+)"/.exec(at)[1],cy=+/cy="([^"]+)"/.exec(at)[1],r=+/r="([^"]+)"/.exec(at)[1];
  out.push('M'+(cx-r)+' '+cy+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0');}}return out;}
/* the rim, which is the circle he asked for: everything at full, CQ 100.
   A hairline in the accent, which marks where you are going and is never a
   reading. The seven seats run just outside it on their own stretches. */
function rim(g,G){
 g.beginPath();g.arc(G.cx,G.cy,G.R,0,TAU);g.strokeStyle=C('accent',.34);g.lineWidth=1;g.stroke();
 CX.seats.forEach(function(b){var S0=CX.sector[b],gap=.004;
  g.beginPath();g.arc(G.cx,G.cy,G.R+5*G.sk,angOf(S0.t0+gap),angOf(S0.t1-gap));
  g.strokeStyle=C(b,.55);g.lineWidth=2*G.sk;g.stroke();});}
/* the light. It comes from the centre and reaches as far as the reference
   circle, in the colour of the tier that circle reads as. Coherence is how
   far the light reaches. Sol: a single source, and it is the person. */
function light(g,G,I,tier,refR){
 var gr=g.createRadialGradient(G.cx,G.cy,G.r0*.4,G.cx,G.cy,refR*1.08);
 gr.addColorStop(0,C('tier:'+tier,.16));gr.addColorStop(.75,C('tier:'+tier,.07));gr.addColorStop(1,C('tier:'+tier,0));
 g.fillStyle=gr;g.beginPath();g.arc(G.cx,G.cy,refR*1.08,0,TAU);g.fill();}
/* the hub. nothing, and the halo, which is Source: a ring with nothing in it */
function hub(g,G){g.beginPath();g.arc(G.cx,G.cy,G.r0,0,TAU);g.fillStyle=C('stage');g.fill();
 g.strokeStyle=C('ink',.10);g.lineWidth=1;g.stroke();}
/* OVER GLOWS, UNDER SINKS. The band between the shape and the reference
   circle, sampled round the whole turn: where the shape is outside, the
   seat's own colour; where it is inside, --sunk, darker than the stage. */
function overUnder(g,G,E,refV,N,alphaOver){
 N=N||360;var prev=null;
 for(var j=0;j<=N;j++){var t=j/N,v=shapeAt(E,t,'x'),a=angOf(t),rs=G.rad(v),rr=G.rad(refV);
  var cur={a:a,rs:rs,rr:rr,seat:seatAt(t+.5/N),over:v>=refV};
  if(prev){g.beginPath();
   g.moveTo(G.cx+Math.cos(prev.a)*prev.rs,G.cy+Math.sin(prev.a)*prev.rs);
   g.lineTo(G.cx+Math.cos(cur.a)*cur.rs,G.cy+Math.sin(cur.a)*cur.rs);
   g.lineTo(G.cx+Math.cos(cur.a)*cur.rr,G.cy+Math.sin(cur.a)*cur.rr);
   g.lineTo(G.cx+Math.cos(prev.a)*prev.rr,G.cy+Math.sin(prev.a)*prev.rr);g.closePath();
   g.fillStyle=prev.over?C(prev.seat,alphaOver||.26):C('sunk',.85);g.fill();}
  prev=cur;}}
function shapePath(g,G,E,key,N){N=N||360;g.beginPath();
 for(var j=0;j<=N;j++){var t=j/N,v=shapeAt(E,t,key||'x'),a=angOf(t),r=G.rad(v);
  j?g.lineTo(G.cx+Math.cos(a)*r,G.cy+Math.sin(a)*r):g.moveTo(G.cx+Math.cos(a)*r,G.cy+Math.sin(a)*r);}g.closePath();}
/* THE FRINGES, fringeDraw's own bands, off the gap from centre rather than
   off charge. Full strength at twenty points of a hundred from centre, which
   is two points of ten on a law. Five bands, closer together where the
   stress is higher, on the side the element is on, breathing on the Field's
   4.2 second wave and travelling only in the direction the value last moved. */
function fringes(g,G,I,E,refV,span){
 E.forEach(function(q,i){var o=q.o,dev=o.x-refV,s=clamp(Math.abs(dev)/20,0,1);if(s<.03)return;
  var sg=dev>=0?1:-1,v=shapeAt(E,q.t,'x'),rb=G.rad(v),gap=(10-6*s)*G.sk,f=REDUCED?.5:(o.ph-Math.floor(o.ph));
  var br=REDUCED?1:0.82+0.18*Math.sin(TAU*I.t/4.2-i*0.12),half=(span?span(q):1/E.length)*TAU/2*.86;
  var a=angOf(q.t);
  for(var k=0;k<5;k++){var pos=k+f,al=Math.pow(s,1.3)*Math.sin(Math.PI*pos/5)*.9*br;if(al<.02)continue;
   var r=rb+sg*(4+pos*gap);if(r<G.r0+2)continue;
   g.beginPath();g.arc(G.cx,G.cy,r,a-half,a+half);
   g.strokeStyle=k%2?C(o.e.seat,al):C('ink',al*.55);g.lineWidth=(k%2?1.1:1.6)*(.8+.4*s)*G.sk;g.stroke();}});}
/* a node: a ring in its seat colour, filled with the stage so the line under
   it breaks cleanly. Ring, never fill. */
function node(g,G,I,e,x,y,r){g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle=C('stage');g.fill();
 g.strokeStyle=C(e.seat,I.hover===e?1:.95);g.lineWidth=(I.hover===e?2.2:1.6)*G.sk;g.stroke();
 if(I.hover===e){g.beginPath();g.arc(x,y,r+5*G.sk,0,TAU);g.strokeStyle=C(e.seat,.45);g.lineWidth=1;g.stroke();}
 I.hits.push({x:x,y:y,r:Math.max(16,r+10),e:e});}

/* ============================================================
   THE FOUR DRAWINGS
   ============================================================ */
var DRAW={
 /* A. THE LAWS. A membrane through all 21, the coherence circle inside it,
    and the rim outside. The truest to CQ, and the slowest to move. */
 a:function(g,G,I){var E=sortedEls(I),refV=I.ref.x,tier=I.st.tier;
  light(g,G,I,tier,G.rad(refV));rim(g,G);
  overUnder(g,G,E,refV);
  g.beginPath();g.arc(G.cx,G.cy,G.rad(refV),0,TAU);g.strokeStyle=C('tier:'+tier,.85);g.lineWidth=1.4*G.sk;g.stroke();
  fringes(g,G,I,E,refV);
  shapePath(g,G,E);g.strokeStyle=C('ink',.82);g.lineWidth=1.5*G.sk;g.stroke();
  hub(g,G);glyph(g,CX.halo,G.cx,G.cy,20*G.sk,C('accent',.9),1.8);
  E.forEach(function(q){var p=pt(G,q.t,q.x);node(g,G,I,q.o.e,p[0],p[1],3.4*G.sk);
   var a=angOf(q.t),rr=G.R+19*G.sk;glyph(g,q.o.e.ic,G.cx+Math.cos(a)*rr,G.cy+Math.sin(a)*rr,Math.max(11,13*G.sk),C(q.o.e.seat,.9),1.6);});},

 /* B. THE MIRROR AXES. The shipped compass seen from above: its eight
    meridians become spokes, the coherent pole's glyph at the rim and the
    inversion's at the hub, and the room at the waist, forty to sixty, becomes
    the ring most people stand in, with its souls. The ribbon that joined the
    eight nodes on the shipped figure is the closed shape here. */
 b:function(g,G,I){var E=sortedEls(I),refV=I.ref.x,tier=I.st.tier;
  light(g,G,I,tier,G.rad(refV));rim(g,G);
  /* the room, forty to sixty, as an annulus */
  g.beginPath();g.arc(G.cx,G.cy,G.rad(60),0,TAU);g.arc(G.cx,G.cy,G.rad(40),0,TAU,true);g.fillStyle=C('ink',.045);g.fill();
  [[40,.20],[60,.12]].forEach(function(q){g.beginPath();g.arc(G.cx,G.cy,G.rad(q[0]),0,TAU);g.strokeStyle=C('ink',q[1]);g.lineWidth=1;g.stroke();});
  /* the souls, the shipped figure's own eighteen, on their own phases */
  for(var si=0;si<18;si++){var ph=si*2.399963,spd=0.20+((si*37)%11)/38,sw=REDUCED?0:Math.sin(I.t*spd+ph);
   var p=pt(G,ph/TAU+I.t*.004,50+sw*9.2);g.beginPath();g.arc(p[0],p[1],1.9*G.sk,0,TAU);g.fillStyle=C('ink',.30+sw*.12);g.fill();}
  /* the eight meridians */
  E.forEach(function(q){var a=angOf(q.t);g.beginPath();g.moveTo(G.cx+Math.cos(a)*G.r0,G.cy+Math.sin(a)*G.r0);
   g.lineTo(G.cx+Math.cos(a)*G.R,G.cy+Math.sin(a)*G.R);g.strokeStyle=C(q.o.e.seat,.30);g.lineWidth=1.2*G.sk;g.stroke();});
  overUnder(g,G,E,refV,360,.22);
  g.beginPath();g.arc(G.cx,G.cy,G.rad(refV),0,TAU);g.setLineDash([4*G.sk,5*G.sk]);g.strokeStyle=C('ink',.45);g.lineWidth=1.2*G.sk;g.stroke();g.setLineDash([]);
  fringes(g,G,I,E,refV,function(){return 1/12;});
  /* the ribbon, in the accent, as the shipped figure drew it */
  shapePath(g,G,E);g.fillStyle=C('accent',.06);g.fill();g.strokeStyle=C('accent',.8);g.lineWidth=1.6*G.sk;g.stroke();
  hub(g,G);
  E.forEach(function(q){var e=q.o.e,a=angOf(q.t),p=pt(G,q.t,q.x);node(g,G,I,e,p[0],p[1],4.4*G.sk);
   var ro=G.R+19*G.sk,ri=G.r0*.62;
   glyph(g,e.ic,G.cx+Math.cos(a)*ro,G.cy+Math.sin(a)*ro,Math.max(12,15*G.sk),C(e.seat,.95),1.7);
   /* the inversion's glyph sits at the hub, which is nought, only where the
      hub has room for eight: under 16 pixels apart they pile up, measured on
      the board at 1600, so there the rim glyph carries the axis alone */
   if(TAU*ri/8>=16)glyph(g,e.dic,G.cx+Math.cos(a)*ri,G.cy+Math.sin(a)*ri,Math.max(10,11*G.sk),C(e.seat,.55),1.5);});},

 /* C. THE SEATS. The Field's shell, set at the coherence radius, bending out
    where a seat's laws run over the person's centre and in where they run
    under, with the fringes standing off the bend. The coarsest reading and
    the most like the Field. */
 c:function(g,G,I){var E=sortedEls(I),refV=I.ref.x,tier=I.st.tier;
  light(g,G,I,tier,G.rad(refV));rim(g,G);
  g.beginPath();g.arc(G.cx,G.cy,G.rad(refV),0,TAU);g.setLineDash([2*G.sk,5*G.sk]);g.strokeStyle=C('tier:'+tier,.6);g.lineWidth=1.2*G.sk;g.stroke();g.setLineDash([]);
  /* the bend. each seat's gap spread on a gaussian across the turn, the
     Field's spread of 2.2 addresses, here a third of a seat's stretch */
  var bendAt=function(t){var num=0,den=0;E.forEach(function(q){var d=t-q.t;d-=Math.round(d);var sp=q.o.e.span*.42,w=Math.exp(-(d*d)/(2*sp*sp));num+=w*q.x;den+=w;});return den?num/den:refV;};
  var N=540,B=[];for(var j=0;j<=N;j++)B.push(bendAt(j/N));
  var shp=function(j){return B[j];};
  var prev=null;
  for(j=0;j<=N;j++){var t=j/N,a=angOf(t),rs=G.rad(B[j]),rr=G.rad(refV),seat=seatAt(t+.5/N);
   if(prev){g.beginPath();g.moveTo(G.cx+Math.cos(prev.a)*prev.rs,G.cy+Math.sin(prev.a)*prev.rs);g.lineTo(G.cx+Math.cos(a)*rs,G.cy+Math.sin(a)*rs);
    g.lineTo(G.cx+Math.cos(a)*rr,G.cy+Math.sin(a)*rr);g.lineTo(G.cx+Math.cos(prev.a)*prev.rr,G.cy+Math.sin(prev.a)*prev.rr);g.closePath();
    g.fillStyle=prev.over?C(prev.seat,.24):C('sunk',.85);g.fill();}
   prev={a:a,rs:rs,rr:rr,seat:seat,over:B[j]>=refV};}
  /* fringes off the bent shell, one per seat, across the seat's stretch */
  var E2=E.map(function(q){return q;});
  E2.forEach(function(q,i){var o=q.o,dev=o.x-refV,s=clamp(Math.abs(dev)/20,0,1);if(s<.03)return;
   var sg=dev>=0?1:-1,f=REDUCED?.5:(o.ph-Math.floor(o.ph)),gap=(10-6*s)*G.sk,br=REDUCED?1:0.82+0.18*Math.sin(TAU*I.t/4.2-i*0.12);
   var S0=CX.sector[o.e.seat],t0=S0.t0+.01,t1=S0.t1-.01;
   for(var k=0;k<5;k++){var pos=k+f,al=Math.pow(s,1.3)*Math.sin(Math.PI*pos/5)*.9*br;if(al<.02)continue;
    g.beginPath();for(var m=0;m<=40;m++){var tt=t0+(t1-t0)*m/40,jj=Math.round(((tt%1)+1)%1*N),
     r=G.rad(B[jj])+sg*(4+pos*gap),aa=angOf(tt);m?g.lineTo(G.cx+Math.cos(aa)*r,G.cy+Math.sin(aa)*r):g.moveTo(G.cx+Math.cos(aa)*r,G.cy+Math.sin(aa)*r);}
    g.strokeStyle=k%2?C(o.e.seat,al):C('ink',al*.55);g.lineWidth=(k%2?1.1:1.6)*(.8+.4*s)*G.sk;g.stroke();}});
  /* the shell itself, each seat's stretch in its own colour */
  CX.seats.forEach(function(b){var S0=CX.sector[b];g.beginPath();
   for(var m=0;m<=60;m++){var tt=S0.t0+(S0.t1-S0.t0)*m/60,jj=Math.round(tt*N),r=G.rad(B[Math.min(N,jj)]),aa=angOf(tt);
    m?g.lineTo(G.cx+Math.cos(aa)*r,G.cy+Math.sin(aa)*r):g.moveTo(G.cx+Math.cos(aa)*r,G.cy+Math.sin(aa)*r);}
   g.strokeStyle=C(b,.95);g.lineWidth=3.2*G.sk;g.lineCap='round';g.stroke();g.lineCap='butt';});
  hub(g,G);glyph(g,CX.halo,G.cx,G.cy,20*G.sk,C('accent',.9),1.8);
  E.forEach(function(q){var e=q.o.e,jj=Math.round(q.t*N),p=pt(G,q.t,B[jj]);
   I.hits.push({x:p[0],y:p[1],r:Math.max(22,30*G.sk),e:e});
   var a=angOf(q.t),rr=G.R+21*G.sk;glyph(g,e.ic,G.cx+Math.cos(a)*rr,G.cy+Math.sin(a)*rr,Math.max(12,16*G.sk),C(e.seat,I.hover===e?1:.9),1.7);});},

 /* D. THE RINGS. Every earlier reading stays behind as a ring, oldest
    innermost and faintest, the newest carrying the light, the fringes and
    the nodes. The distance between two rings is the growth; where the rings
    bunch, nothing has grown. The record already writes the 21 on every row
    (engine/schema.js snapshot, lawNow), so this needs no new data. */
 d:function(g,G,I){var E=sortedEls(I),refV=I.ref.x,tier=I.st.tier,P=I.P;
  light(g,G,I,tier,G.rad(refV));rim(g,G);
  var hist=P.stages.slice(0,ST.s);
  hist.forEach(function(st,h){var HE=CX.laws.map(function(l,j){return {t:LAW_T[j],x:st.laws[j]*10};}).sort(function(a,b){return a.t-b.t;});
   var age=(ST.s-h),al=clamp(.62-age*.14,.16,.62);
   shapePath(g,G,HE);g.strokeStyle=C('ink',al);g.lineWidth=1*G.sk;g.stroke();});
  /* the growth since the last ring, glowing in the seat colours */
  if(hist.length){var st0=hist[hist.length-1],PE=CX.laws.map(function(l,j){return {t:LAW_T[j],x:st0.laws[j]*10};}).sort(function(a,b){return a.t-b.t;});
   var N=360,prev=null;for(var j=0;j<=N;j++){var t=j/N,a=angOf(t),r1=G.rad(shapeAt(E,t,'x')),r0=G.rad(shapeAt(PE,t,'x')),seat=seatAt(t+.5/N);
    if(prev&&(r1-r0>.3||prev.r1-prev.r0>.3)){g.beginPath();g.moveTo(G.cx+Math.cos(prev.a)*prev.r1,G.cy+Math.sin(prev.a)*prev.r1);g.lineTo(G.cx+Math.cos(a)*r1,G.cy+Math.sin(a)*r1);
     g.lineTo(G.cx+Math.cos(a)*r0,G.cy+Math.sin(a)*r0);g.lineTo(G.cx+Math.cos(prev.a)*prev.r0,G.cy+Math.sin(prev.a)*prev.r0);g.closePath();g.fillStyle=C(prev.seat,.30);g.fill();}
    prev={a:a,r1:r1,r0:r0,seat:seat};}}
  g.beginPath();g.arc(G.cx,G.cy,G.rad(refV),0,TAU);g.strokeStyle=C('tier:'+tier,.7);g.lineWidth=1.2*G.sk;g.stroke();
  fringes(g,G,I,E,refV);
  shapePath(g,G,E);g.strokeStyle=C('ink',.9);g.lineWidth=1.6*G.sk;g.stroke();
  hub(g,G);glyph(g,CX.halo,G.cx,G.cy,20*G.sk,C('accent',.9),1.8);
  E.forEach(function(q){var p=pt(G,q.t,q.x);node(g,G,I,q.o.e,p[0],p[1],3.2*G.sk);});
  CX.seats.forEach(function(b){var S0=CX.sector[b],a=angOf((S0.t0+S0.t1)/2),rr=G.R+21*G.sk;
   glyph(g,CX.seatGlyph[b],G.cx+Math.cos(a)*rr,G.cy+Math.sin(a)*rr,Math.max(12,15*G.sk),C(b,.9),1.7);});}};

/* ============================================================
   THE WORDS BESIDE THE DRAWING. Right column, never on the art.
   ============================================================ */
var ICON={
 halo:CX.halo,
 person:'M12 12.2a3.8 3.8 0 100-7.6 3.8 3.8 0 000 7.6zM4.8 20.4c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6',
 now:'M12 12m-7.5 0a7.5 7.5 0 1015 0 7.5 7.5 0 10-15 0M12 12m-1.6 0a1.6 1.6 0 103.2 0 1.6 1.6 0 10-3.2 0',
 run:'M12 12m-7.5 0a7.5 7.5 0 1015 0 7.5 7.5 0 10-15 0M12 15.6V8.4M9 11.2l3-2.8 3 2.8',
 k1:'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0M12 12m-4.6 0a4.6 4.6 0 109.2 0 4.6 4.6 0 10-9.2 0',
 k15:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0',
 play:'M8 5.6v12.8L18.4 12z',
 over:'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0M12 15.5V8.5M9 11.2l3-2.8 3 2.8',
 under:'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0M12 8.5v7M9 12.8l3 2.8 3-2.8',
 rim:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0',
 centre:'M12 12m-6 0a6 6 0 1012 0 6 6 0 10-12 0M3 12h2.2M18.8 12H21',
 spread:'M4 12h16M4 8v8M20 8v8'};
function ico(d,col,cls){return '<svg class="ic'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true" style="color:'+(col||'currentColor')+'">'
 +(d.indexOf('<')>=0?d.replace(/<(path|circle)/g,'<$1 fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"'):'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>')+'</svg>';}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var STAGE_IC=['now','run','k1','k15'];
function stageNm(i,st){return i===0?'Now':i===1?'One run, '+st.patterns+' patterns':fmt(st.patterns)+' patterns';}
/* over and under, three each, against the option's own centre */
function ranked(o){var P=CX.people[ST.p],st=P.stages[ST.s],E=o.els(P,st),r=o.ref(P,st);
 var d=E.map(function(e){return {e:e,d:e.v-r};});
 return {over:d.filter(function(x){return x.d>0.05;}).sort(function(a,b){return b.d-a.d;}).slice(0,3),
  under:d.filter(function(x){return x.d<-0.05;}).sort(function(a,b){return a.d-b.d;}).slice(0,3),E:E,r:r,st:st,P:P};}
function valTxt(e){return e.of===10?fmt(e.shown,1)+' of 10':fmt(e.shown,0)+' of 100';}
function rowHtml(x){var e=x.e;return '<li>'+ico(e.ic,C(e.seat))+'<span class="nm">'+esc(e.nm)+'</span><b>'+valTxt(e)+'</b></li>';}
function readHtml(optId){var o=OPTS[optId],R=ranked(o),st=R.st,P=R.P,s0=P.stages[0];
 var dcq=st.cq-s0.cq,E=R.E,hi=Math.max.apply(null,E.map(function(e){return e.shown;})),lo=Math.min.apply(null,E.map(function(e){return e.shown;}));
 var unit=E[0].of===10?' of 10':' of 100',d=E[0].of===10?1:0;
 var h='<div class="rd"><div class="cq">'+ico(ICON.halo,C('tier:'+st.tier))
  +'<span class="big">'+fmt(st.cq,0)+'</span><span class="of">of 100</span></div>'
  +'<div class="tier" style="color:'+C('tier:'+st.tier)+'">'+esc(st.tier)+'</div></div>';
 h+='<div class="blk"><div class="hd">'+ico(ICON.over,C('mid'))+'Over your centre</div><ul class="rows">'
  +(R.over.length?R.over.map(rowHtml).join(''):'<li class="none">Nothing over</li>')+'</ul></div>';
 h+='<div class="blk"><div class="hd">'+ico(ICON.under,C('mid'))+'Under your centre</div><ul class="rows">'
  +(R.under.length?R.under.map(rowHtml).join(''):'<li class="none">Nothing under</li>')+'</ul></div>';
 h+='<div class="blk"><div class="hd">'+ico(ICON.spread,C('mid'))+'Highest to lowest</div><p class="p"><b>'+fmt(hi-lo,d)+'</b>'+unit+' apart</p></div>';
 h+='<div class="blk"><div class="hd">'+ico(ICON[STAGE_IC[ST.s]],C('mid'))+stageNm(ST.s,st)+'</div>'
  +(ST.s?'<p class="p">Coherence '+(dcq>=0?'up ':'down ')+'<b>'+fmt(Math.abs(dcq),dcq<1?2:1)+'</b> of 100 since now.</p><p class="p q">Projected: a reference case cannot release, so the engine\'s own release arithmetic was run on a copy.</p>'
   :'<p class="p">'+esc(P.nm)+', as the build reads the example today.</p>')+'</div>';
 return h;}
function hoverHtml(e){if(!e)return '';return ico(e.ic,C(e.seat))+'<span>'+esc(e.nm)+(e.up?', '+esc(e.up)+' and '+esc(e.dn):'')+'</span><b>'+valTxt(e)+'</b>';}
/* the key under the drawing: what each mark is, four marks, two words each */
function keyHtml(optId){var o=OPTS[optId];
 var items=[[ICON.rim,C('accent'),'All at full'],[ICON.centre,optId==='b'?C('ink'):C('tier:'+CX.people[ST.p].stages[ST.s].tier),o.refNm],
  [ICON.over,C('mid'),'Over, glowing'],[ICON.under,C('mid'),'Under, sunk']];
 /* D draws no sunk band: its fill is the growth since the last ring */
 if(optId==='d')items.splice(2,2,[ICON.over,C('mid'),'Growth, glowing'],[ICON.k1,C('mid'),'Earlier readings']);
 if(optId==='b')items.push([ICON.k15,C('ink'),'Where most stand']);
 return items.map(function(x){return '<span>'+ico(x[0],x[1])+esc(x[2])+'</span>';}).join('');}

/* ---- the tools, left. who, and when. ---- */
function toolsHtml(){var h='<div class="tg"><div class="hd">'+ico(ICON.person,C('mid'))+'Profile</div>';
 CX.people.forEach(function(P,i){h+='<button type="button" class="tb'+(i===ST.p?' on':'')+'" data-p="'+i+'" aria-pressed="'+(i===ST.p)+'">'
  +ico(ICON.person,C(i===ST.p?'accent':'mid'))+'<span>'+esc(P.nm)+', example</span><b>'+fmt(P.stages[0].cq,0)+'</b></button>';});
 h+='</div><div class="tg"><div class="hd">'+ico(ICON.run,C('mid'))+'Release</div>';
 CX.people[ST.p].stages.forEach(function(st,i){h+='<button type="button" class="tb'+(i===ST.s?' on':'')+'" data-s="'+i+'" aria-pressed="'+(i===ST.s)+'">'
  +ico(ICON[STAGE_IC[i]],C(i===ST.s?'accent':'mid'))+'<span>'+esc(stageNm(i,st))+'</span></button>';});
 h+='<button type="button" class="tb play" data-play="1">'+ico(ICON.play,C('accent'))+'<span>Play the four in order</span></button></div>';
 return h;}
var PLAY=null;
function bindTools(host,after){host.onclick=function(ev){var b=ev.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-p')){stopPlay();stSet(+b.getAttribute('data-p'),ST.s);}
 else if(b.hasAttribute('data-s')){stopPlay();stSet(ST.p,+b.getAttribute('data-s'));}
 else if(b.hasAttribute('data-play')){stopPlay();stSet(ST.p,0);var k=0;PLAY=setInterval(function(){k++;if(k>3){stopPlay();return;}stSet(ST.p,k);},2600);}
 after();};}
function stopPlay(){if(PLAY){clearInterval(PLAY);PLAY=null;}}
