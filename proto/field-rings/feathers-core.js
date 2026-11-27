/* THE FEATHERS. One figure, drawn by the stage and by the ladder alike, so the
   two can never disagree about what a feather is.

   WHAT ONE FEATHER IS. One of the twenty one laws of moral integrity. Its
   length is how far that law sits off centre, which is ten less the law as
   coherence reads it (lawNow in engine/compute.js). Its colour and its
   direction are the seat the law is seated at, SI[i].b in
   engine/data/canon.js. A law held at ten has no length: its feather is folded
   down to a seed on the hub.

   WHY THE SUM MEANS SOMETHING. Coherence is the twenty one laws over 210,
   times a hundred (cqSum, compute.js:151). So the twenty one feathers laid end
   to end are exactly 2.1 times the distance from the number to a hundred. The
   figure is not beside the number, it is the number, taken apart. data-feathers
   checks this on every profile and so does this file (FEATHER.check).

   THE OVERLAP, AND THE ANSWER. The owner: "I don't want it over the 44, over
   the coherence." The zero of the feather scale is not the centre point. It is
   the hub, a circle just outside the coherence ring and outside the range the
   ring draws. Every feather grows outward from there. The shortest a feather
   can be is nothing, which is a seed sitting on the hub, so no reading at all
   can put a feather inside the ring. Nothing is clamped, so a law at nine and a
   law at ten still read differently, and nothing is layered over the number.
   At dead centre the figure is the ring itself with twenty one seeds on it.

   WHY SEVEN DIRECTIONS AND NOT SIX. The only grouping the laws carry is the
   seat, and there are seven: three, three, three, four, four, two and two. The
   six around the number are the gates, and no law is tied to a gate anywhere
   in the engine or the codex. A release closes the laws a seat at a time
   (lawLift, compute.js:134), so a fan is also the unit that shrinks together.
   Each fan points at its own seat's glyph on the ring, which labels the
   direction without a word.

   Reads K from kit.js. Draws SVG only. */
(function(){
'use strict';
const K=window.K, TAU=Math.PI*2;
const FT=window.FEATHER={};

/* THE GEOMETRY, at the stage's own scale. One table so it can be argued with. */
FT.G={
 R:76,       /* the coherence ring, as nested-frames.html draws it */
 W:6,        /* its stroke */
 FS:64,      /* the number */
 HUB:92,     /* the zero of the feather scale. The range arc sits at 84 and is 3
                wide, so the hub is 6.5 clear of the last thing the ring owns */
 PX:7.6,     /* pixels per point off centre. Ten points reaches 168 */
 STEP:7.5,   /* degrees between two feathers of one fan. Two full length vanes
                are widest at 138 from the centre, where 7.5 degrees is 18,
                so they clear each other by 7 */
 HWMAX:5.5,  /* vane half width. It is a constant, never a reading */
 QUILL:.2,   /* the bare quill at the base, as a share of the length */
 SEED:1.9};
FT.limit=g=>g.HUB+10*g.PX;

/* THE BEARINGS. Each seat's direction is the middle of its own run of
   addresses on the stage's ring, measured the way nested-frames.html measures
   it: the same window, the same inset, the same corner ease. So the stage and
   the ladder point every fan the same way, and on the stage each fan points at
   its seat's glyph. Radians, from the positive x axis, y down. */
FT.bearings=function(){
 const win={x0:14,y0:74,x1:906,y1:836};
 const cx=(win.x0+win.x1)/2, cy=(win.y0+win.y1)/2, a=(win.x1-win.x0)/2, b=(win.y1-win.y0)/2;
 const base=K.Ring(cx,cy,a-31,b-31,12), out={};
 K.SEATS.forEach(s=>{out[s]=base.thAt(K.sector[s].tm);});
 return out;};

/* where each law points: its seat's bearing, spread into a fan in SI order */
FT.layout=function(laws,bear,g){
 const bySeat={};laws.forEach(l=>{(bySeat[l.b]=bySeat[l.b]||[]).push(l);});
 const st=g.STEP*Math.PI/180;
 return laws.map(l=>{const f=bySeat[l.b],k=f.indexOf(l),n=f.length;
  return Object.assign({},l,{th:bear[l.b]+(k-(n-1)/2)*st,k:k,n:n});});};

/* how far off centre, in points. An unanswered law is counted by coherence as
   nought, so the arithmetic puts it all the way out, and the drawing says it
   was not read rather than that it is not held. */
FT.gap=l=>l.in?K.clamp(10-l.v,0,10):10;

/* the identity, checked rather than asserted. Returns the difference. */
FT.check=function(laws,cq){
 const sum=laws.reduce((a,l)=>a+FT.gap(l),0);
 return {sum:sum, want:2.1*(100-cq), diff:Math.abs(sum-2.1*(100-cq))};};

const P=(cx,cy,th,r)=>[cx+Math.cos(th)*r,cy+Math.sin(th)*r];
const f1=x=>(+x).toFixed(1);

/* ONE FEATHER. What tells a feather from a leaf, and the first cut of this
   file drew a leaf: a lens widest near its base and ending in a point. A
   feather has a bare quill at the base, a vane that opens after it and is
   widest past the middle, a tip that rounds rather than points, and fine barbs
   raked toward the tip. All four are here. Ring not fill: the vane is an
   outline over a faint wash, and the barbs are the texture. s is the
   drawing scale, and every stroke has a floor so a feather at phone size is
   still a line and not a smudge. */
/* the vane's half width along its own length, 0 at the quill, 1 at its widest
   past the middle, and a rounded close at the tip rather than a point */
FT.vane=u=>{u=K.clamp(u,0,1);return Math.sqrt(Math.max(0,Math.sin(Math.PI*Math.pow(u,.8))));};
FT.feather=function(parent,cx,cy,l,g,s,col){
 const gg=K.el('g',{class:'fth','data-law':l.nm},parent);
 const u=[Math.cos(l.th),Math.sin(l.th)], nr=[-u[1],u[0]];
 const r0=g.HUB*s, gap=FT.gap(l), L=gap*g.PX*s;
 const root=P(cx,cy,l.th,r0);
 if(!l.in){
  /* NOT READ YET. A hollow quill at the length coherence counts it at, with an
     open ring for a tip, which is this product's grammar for empty. */
  /* the open ring ends at the limit rather than straddling it, so nothing
     drawn for a law ever passes ten points out */
  const rr=Math.max(1.6,2.3*s), tip=P(cx,cy,l.th,r0+L-rr);
  K.el('line',{x1:f1(root[0]),y1:f1(root[1]),x2:f1(tip[0]),y2:f1(tip[1]),stroke:K.rgba(col,.46),
   'stroke-width':Math.max(1,1.1*s).toFixed(2),'stroke-dasharray':(2.5*Math.max(s,.6)).toFixed(1)+' '+(3.2*Math.max(s,.6)).toFixed(1),'stroke-linecap':'round'},gg);
  K.el('circle',{cx:f1(tip[0]),cy:f1(tip[1]),r:rr.toFixed(2),fill:K.rgb(K.GROUND),stroke:K.rgba(col,.62),'stroke-width':Math.max(.9,1.1*s).toFixed(2)},gg);
  K.el('circle',{cx:f1(root[0]),cy:f1(root[1]),r:Math.max(1.3,g.SEED*s).toFixed(2),fill:K.rgb(K.GROUND),stroke:K.rgba(col,.62),'stroke-width':Math.max(.9,1*s).toFixed(2)},gg);
  return {g:gg,tip:tip,root:root,L:L};}
 const tip=P(cx,cy,l.th,r0+L);
 if(L>=1.2){
  const hw=Math.min(g.HWMAX*s,L*.2);
  const q0=L*g.QUILL, vl=L-q0, at=(r,h,sg)=>[cx+Math.cos(l.th)*r+nr[0]*h*sg, cy+Math.sin(l.th)*r+nr[1]*h*sg];
  /* the vane, as an outline round both sides of the rachis */
  const N=16, left=[], right=[];
  for(let i=0;i<=N;i++){const u=i/N, r=r0+q0+vl*u, h=hw*FT.vane(u);left.push(at(r,h,1));right.push(at(r,h,-1));}
  K.el('path',{d:K.polyD(left.concat(right.reverse()),true),
   fill:K.rgba(col,.15),stroke:K.rgba(col,.46),'stroke-width':Math.max(.7,.85*s).toFixed(2),'stroke-linejoin':'round'},gg);
  /* the barbs, raked toward the tip: each leaves the rachis and meets the
     vane's edge a little further out, which is the grain that says feather.
     Only where the vane is wide enough to hold them. */
  if(hw>=2.4){
   const n=Math.max(3,Math.min(18,Math.floor(vl/(3.2*s))));let d='';
   for(let i=1;i<=n;i++){const u=i/(n+1), r=r0+q0+vl*u, h=hw*FT.vane(u)*.94, re=r+h*.8, ue=(re-r0-q0)/vl;
    if(ue>=.985)continue;
    const he=hw*FT.vane(ue)*.94, p=P(cx,cy,l.th,r);
    [1,-1].forEach(sg=>{const e=at(re,he,sg);d+='M'+f1(p[0])+' '+f1(p[1])+'L'+f1(e[0])+' '+f1(e[1]);});}
   K.el('path',{d:d,fill:'none',stroke:K.rgba(col,.38),'stroke-width':Math.max(.6,.7*s).toFixed(2),'stroke-linecap':'round'},gg);}
  /* the rachis, the whole length, quill included */
  K.el('line',{x1:f1(root[0]),y1:f1(root[1]),x2:f1(tip[0]),y2:f1(tip[1]),stroke:K.rgba(col,.95),
   'stroke-width':Math.max(1,1.35*s).toFixed(2),'stroke-linecap':'round'},gg);}
 /* the seed. every read law has one, and at ten it is all that is left */
 K.el('circle',{cx:f1(root[0]),cy:f1(root[1]),r:Math.max(1.3,g.SEED*s).toFixed(2),fill:K.rgba(col,.9)},gg);
 return {g:gg,tip:tip,root:root,L:L};};

/* THE CORE. K.core in kit.js, taking its reading as arguments rather than off
   window.FIELD, so the ladder can draw anybody. Same ring, same arc, same
   range, same number, same scale under it. */
FT.core=function(g,cx,cy,o,s){
 s=s||1;const G=FT.G,R=G.R*s,w=Math.max(2,G.W*s),col=o.col,f=K.clamp(o.cq/100,0,1);
 const gg=K.el('g',{class:'core'},g);
 K.el('circle',{cx:cx,cy:cy,r:(R+w/2+10*s).toFixed(1),fill:K.rgb(K.GROUND)},gg);
 K.el('circle',{cx:cx,cy:cy,r:R.toFixed(1),fill:'none',stroke:'rgba(128,128,128,.22)','stroke-width':w},gg);
 if(f>0)K.el('path',{d:K.arcD(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*Math.min(f,.9999)),fill:'none',stroke:K.rgb(col),'stroke-width':w,'stroke-linecap':'round'},gg);
 if(o.range){const lo=o.range.lo/100,hi=o.range.hi/100,rr=R+w/2+5*s;
  K.title(K.el('path',{d:K.arcD(cx,cy,rr,-Math.PI/2+TAU*lo,-Math.PI/2+TAU*Math.min(hi,.9999)),fill:'none',
   stroke:K.rgba(col,.55),'stroke-width':Math.max(1.5,3*s),'stroke-linecap':'round'},gg),'Where coherence swings.');}
 const fs=G.FS*s, cap=fs*.727, sub=Math.max(11,12*s), gap=Math.max(5,fs*.16);
 const top=cy-(cap+gap+sub*.72)/2;
 const n=K.text(gg,o.unread?'–':String(Math.round(o.cq)),cx,top+cap,{'text-anchor':'middle',fill:K.rgb(col),
  'font-size':fs.toFixed(1),'font-weight':300,'letter-spacing':'-0.02em'});
 K.title(n,'Coherence. The 21 laws, summed.');
 if(sub*1.0<=R*.5)K.text(gg,'of 100',cx,top+cap+gap+sub*.72,{'text-anchor':'middle',fill:'var(--dim)','font-size':sub.toFixed(1),'font-weight':500});
 return gg;};

/* THE WHOLE FIGURE. The hush under it, the limit, the twenty one, and the
   core last so nothing can ever be drawn on top of the number. Returns what a
   renderer needs to wire hover: each feather's group, tip and bearing. */
FT.figure=function(parent,cx,cy,prof,o){
 o=o||{};const s=o.s||1,g=FT.G,bear=o.bear||FT.bearings();
 const root=K.el('g',{class:'fg'},parent);
 const lim=FT.limit(g)*s;
 /* THE HUSH. The chain threads bow toward the centre and cross this zone, so
    the laws get a ground to be read on, the way a map sets a halo behind a
    name. It fades out past the limit and never has an edge. */
 if(o.hush!==false){
  const id='hush'+Math.random().toString(36).slice(2,7);
  const gr=K.el('radialGradient',{id:id,cx:cx,cy:cy,r:(lim+18*s).toFixed(1),gradientUnits:'userSpaceOnUse'},o.defs||parent);
  K.el('stop',{offset:(g.HUB*s/(lim+18*s)).toFixed(3),'stop-color':K.rgb(K.GROUND),'stop-opacity':.82},gr);
  K.el('stop',{offset:(lim/(lim+18*s)).toFixed(3),'stop-color':K.rgb(K.GROUND),'stop-opacity':.62},gr);
  K.el('stop',{offset:1,'stop-color':K.rgb(K.GROUND),'stop-opacity':0},gr);
  K.el('circle',{cx:cx,cy:cy,r:(lim+18*s).toFixed(1),fill:'url(#'+id+')'},root);}
 /* THE LIMIT. Ten points off centre, the scale's far end, so a length can be
    read against something. One circle and no more, and it is the core's own
    curve, so the grid is still broken exactly once. */
 K.title(K.el('circle',{cx:cx,cy:cy,r:lim.toFixed(1),fill:'none',stroke:K.rgba(K.INK,.075),'stroke-width':1,
  'stroke-dasharray':'1.5 3.5'},root),'Ten points off centre. A feather out here is a law at nought.');
 const laid=FT.layout(prof.laws,bear,g), marks=[];
 /* THE ZERO IS THE SEEDS. Two ways of drawing it lost, and both are written
    down so neither comes back unargued. A full circle at the hub sat six
    pixels outside the range arc and read as the ring drawn twice. A short
    arc under each fan, in its seat's colour, turned every fan into an object
    hanging off a bar, and the heart fan read as a wind chime. Twenty one seeds
    on one radius are a circle the eye closes for itself. */
 const fl=K.el('g',{class:'feathers'},root);
 laid.forEach(l=>{const col=K.seat(l.b);const m=FT.feather(fl,cx,cy,l,g,s,col);m.l=l;m.col=col;marks.push(m);});
 if(o.core!==false)FT.core(root,cx,cy,{cq:prof.CQ,col:K.hx(prof.tierCol||'#7EB8D4'),range:prof.range,unread:prof.unread},s);
 return {g:root,marks:marks,laid:laid,lim:lim,hub:g.HUB*s};};

/* the seat a profile is furthest off centre at, by the mean of its fan. The
   caption on the ladder says it in words; the figure already shows it. */
FT.furthest=function(laws){
 const by={};laws.forEach(l=>{(by[l.b]=by[l.b]||[]).push(FT.gap(l));});
 let best=null,bv=-1;Object.keys(by).forEach(b=>{const m=by[b].reduce((a,x)=>a+x,0)/by[b].length;if(m>bv){bv=m;best=b;}});
 return {b:best,mean:bv};};

/* A RELEASE, PROJECTED. The ruled lift, lawLift in compute.js: each release at
   a seat closes a share LIFT_R of what is left between every law there and
   ten. Spread over the seats the way the body is built, which is the spread
   the ruling was fitted on. A projection of the arithmetic, not a record. */
FT.project=function(prof,N,seatN,liftR){
 let tot=0;Object.keys(seatN).forEach(b=>{tot+=seatN[b];});
 const laws=prof.laws.map(l=>{if(!l.in)return l;const n=N*seatN[l.b]/tot;
  return Object.assign({},l,{v:10-(10-l.v)*Math.pow(1-liftR,n)});});
 const cq=laws.reduce((a,l)=>a+(l.in?l.v:0),0)/210*100;
 return Object.assign({},prof,{laws:laws,CQ:cq});};
})();
