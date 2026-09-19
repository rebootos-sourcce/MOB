
/* ============================================================
   THE COMBINED PILL AND RING.
   The earlier model put the symbol-versus-number crossover at six to
   eight weeks of use, which meant new users wanted the number and long
   users wanted the glyph. Keeping both in one object removes the choice.
   Nothing has to be learned, and the glyph still earns its place.

     cr(band, pct, opts)
       band  seat name, picks colour and glyph
       pct   0-100, drives the arc and the tail number
       opts  size 'lg'|'md'|'sm'|'xs', label, raw (show a 0-10 value
             instead of a percentage), hot (force the alarm state),
             act (clickable), on (selected), data (data-* attributes)
   ============================================================ */
var CRGEO={lg:{box:46,r:18,w:3.5},md:{box:34,r:13,w:3},sm:{box:24,r:9,w:2.4},xs:{box:18,r:6.5,w:2}};
var HOT_AT=90;                         /* the alarm band. severity gets its own channel. */
/* one stroked icon, 24 unit box. declared here because this file loads first
   and every renderer after it wants one. */
const svgI=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>';};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function seatCol(b){return (S.theme==='snow'?PAL_LIGHT[b]:PAL[b])||'var(--gold)';}
function cr(band,pct,o){
 o=o||{};
 var size=o.size||'md', G=CRGEO[size]||CRGEO.md;
 var p=Math.max(0,Math.min(100,pct||0));
 var C=2*Math.PI*G.r, off=C*(1-p/100);
 var col=o.color||seatCol(band);
 var hot=(o.hot!==undefined)?o.hot:(p>=HOT_AT);
 var glyph=o.glyph||SEATGLYPH[band]||SEATGLYPH._;
 var val=(o.raw!=null)?o.raw:(Math.round(p)+'%');
 var cls='cr '+size+(hot?' hot':'')+(o.act?' act':'')+(o.on?' on':'');
 var attrs=o.data||'';
 var title=o.title||((band||'')+(o.label?' · '+o.label:'')+' · '+val);
 var tag=o.act?'button':'span';
 return '<'+tag+' class="'+cls+'" style="--c:'+col+'" title="'+esc(title)+'" '+attrs+'>'
  +'<span class="ring"><svg class="arc" width="'+G.box+'" height="'+G.box+'" aria-hidden="true">'
   +'<circle cx="'+(G.box/2)+'" cy="'+(G.box/2)+'" r="'+G.r+'" fill="none" '
    +'stroke="rgba(128,128,128,.22)" stroke-width="'+G.w+'"/>'
   +'<circle cx="'+(G.box/2)+'" cy="'+(G.box/2)+'" r="'+G.r+'" fill="none" stroke="'
    +(hot?'var(--alarm)':col)+'" stroke-width="'+G.w+'" stroke-linecap="round" '
    +'stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>'
   +'<span class="gl"><svg viewBox="0 0 24 24" aria-hidden="true">'+glyph+'</svg></span></span>'
  +'<span class="v">'+esc(val)+'</span></'+tag+'>';}
/* an address, a saboteur or a seat, rendered as one object */
function crNode(n,size,o){o=o||{};
 return cr(n.b, n.sq*10, Object.assign({size:size||'sm', raw:n.sq.toFixed(1),
  label:n.k, title:n.k+' · '+n.b+' · SQ '+n.sq.toFixed(1)},o));}
/* An address row. analytics.js and drills.js each carried a byte identical
   copy of this markup, a filled dot plus a bare number, while crNode sat
   unused. crNode was built for exactly this: the ring carries the seat colour
   and the value, so the filled dot and the loose <b> both go. */
function addrRow(n,o){o=o||{};
 var opp=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
 /* The row named an address and went nowhere. runNodeDrill already exists and
    is already wired from the wheel, so the row carries its address and a
    delegated handler in ui.js opens the same drill. */
 return '<button type="button" class="ad-r" data-addr="'+n.i+'" '
  +'title="Open '+esc(n.k)+'">'+crNode(n,'xs')
  +'<span>'+esc(n.k)+'</span><em>'+esc(opp||n.b)+'</em></button>';}
function crPat(p,size,o){o=o||{};
 var lv=leaves(p), b=(lv[0]||{}).b||'Heart';
 return cr(b, p.w*10, Object.assign({size:size||'md', raw:p.w.toFixed(1), label:p.nm,
  hot:p.w>=9||!!p.over,
  title:p.nm+' · weight '+p.w.toFixed(1)+(p.over?' · overshot':'')},o));}
function leaves(o){if(!o||!o.parts)return o?[o]:[];
 var a=[],sn={};(function dig(x){if(x.parts)x.parts.forEach(dig);
  else if(!sn[x.i]){sn[x.i]=1;a.push(x);}})(o);return a;}

/* ============================================================
   CANVAS UTILITIES
   ============================================================ */
const cv=document.getElementById('cv'),g=cv.getContext('2d');
const bg=document.getElementById('bgaura'),bgx=bg.getContext('2d');
let CW=1e3,CH=1e3,CX=500,CY=500,DPR=1,HIT=[],U=400;
/* Every label the wheel draws, in canvas coordinates, recorded the way HIT
   records targets. A DOM overlay sat on top of the lowest seat label for a
   long time and nothing could see it, because a canvas label is pixels and
   a probe that reads pixels lies. This gives the collide gate the boxes. */
let LBL=[];
/* where the outermost label sits, and how much room its text needs */
const LBL_R=1.20, LBL_M=30;
/* what sits over the canvas and therefore bounds the wheel */
const OVERLAY=['tl','acc','bal','howto'];
const hx=h=>{const n=parseInt(String(h).slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+(+a).toFixed(3)+')';
const mixc=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const lerp=(a,b,t)=>a+(b-a)*t;
const LIGHT=()=>S.theme==='snow';
const INK=()=>LIGHT()?[22,23,28]:[239,237,232];
/* the accent, for the canvas, which cannot read a custom property. the two
   values are the same two the sheet declares and they move together. */
const GOLDC=()=>hx(LIGHT()?'#2F6E92':'#7EB8D4');
function bc(b){return hx(LIGHT()?PAL_LIGHT[b]:PAL[b]);}
function nodeCol(n){const base=bc(n.b),ld=clamp(n.disp/10,0,1);
 return mixc(mixc(base,LIGHT()?[238,236,230]:[150,160,180],.74),base,Math.pow(ld,.55));}
/* ---- the one status writer ----
   Every surface reports through here so the wording, the timing and the
   announcement behave the same way wherever they come from. A failure stays
   on screen until something replaces it. A confirmation clears after 2.4s,
   which is past the point a person has read it and before it becomes
   furniture. */
var _stT=null;
function status(msg,kind){
 var e=document.getElementById('status'); if(!e)return;
 clearTimeout(_stT);
 e.textContent=msg||'';
 if(kind)e.setAttribute('data-kind',kind); else e.removeAttribute('data-kind');
 if(msg&&kind!=='fail')_stT=setTimeout(function(){
  e.textContent='';e.removeAttribute('data-kind');},2400);}
/* saving is the case that was lying, so it gets its own wording */
function statusSaved(){
 var st=(typeof saveState==='function')?saveState():{ok:true};
 if(st.ok)status('Saved.');
 else status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');
 return st.ok;}

/* the key strip sits in flow above the canvas, so the canvas box is the
   measure, not the stage. */
/* Zoom is applied to the unit radius and the centre rather than to the canvas
   transform, so hit testing needs no inverse: every HIT region is built from
   the same CX, CY and U the draw used. */
var BASE_U=1;
function reframe(){
 /* HOW BIG THE WHEEL IS ALLOWED TO BE.

    Two things bounded it and neither was being asked. The labels run outward
    past the rings, furthest at the blueprint depth where nineteen domain names
    radiate to 1.2 of the unit radius, so a rule that stopped at the canvas
    edge put 3rd Eye and Knowledge half off it. And the readouts parked in the
    corners are only safe while the circle does not reach them, which is true
    on a wide stage and false on a square one.

    So the free radius is measured rather than assumed: the half box, then cut
    back to the nearest corner of anything sitting over the canvas. The wheel
    is whatever fits inside that once the longest label is taken out. On a wide
    stage the corners are far away and this changes nothing. On a square one
    the wheel gives up the difference, which is the honest trade. */
 var half=Math.min(CW,CH)/2, free=half;
 if(cv&&cv.getBoundingClientRect){
  var cb=cv.getBoundingClientRect(), fx=cb.left+CW/2, fy=cb.top+CH/2;
  OVERLAY.forEach(function(id){
   var e=document.getElementById(id); if(!e)return;
   var st=window.getComputedStyle(e);
   if(st.display==='none'||st.visibility==='hidden'||+st.opacity===0)return;
   var b=e.getBoundingClientRect(); if(!b.width||!b.height)return;
   var dx=Math.max(b.left-fx,0,fx-b.right), dy=Math.max(b.top-fy,0,fy-b.bottom);
   free=Math.min(free,Math.hypot(dx,dy));});}
 BASE_U=Math.max(40,Math.min(half,(free-LBL_M)/LBL_R));
 U=BASE_U*S.zoom;
 var lim=CW*0.9;
 S.panx=Math.max(-lim,Math.min(lim,S.panx));
 S.pany=Math.max(-lim,Math.min(lim,S.pany));
 if(S.zoom===1){S.panx=0;S.pany=0;}
 CX=CW/2+S.panx; CY=CH/2+S.pany;
 if(typeof DRAW_SIG!=='undefined')DRAW_SIG=null;}
function layout(){const b=cv.getBoundingClientRect();
 DPR=Math.min(devicePixelRatio||1,2);cv.width=b.width*DPR;cv.height=b.height*DPR;
 CW=b.width;CH=b.height;reframe();
 g.setTransform(DPR,0,0,DPR,0,0);bg.width=innerWidth;bg.height=innerHeight;
 /* assigning width clears the canvas, so the cached wash is gone even when
    the size is unchanged. drop its signature or the next frame skips the
    repaint and the wash stays blank. */
 if(typeof AURA_SIG!=='undefined')AURA_SIG=null;
 if(typeof DRAW_SIG!=='undefined')DRAW_SIG=null;}
addEventListener('resize',function(){layout();render();});
/* The stage changes height without the window resizing: the depth sub bar
   appears, a tab swaps, a webfont arrives. layout() ran once at init against
   a stage that was still 913 tall, and the buffer stayed 913 inside an 847.6
   box for the whole session. Every circle drew as an ellipse squashed 7.2
   percent, and U came out 456.9 where the box wanted 424.8, so the wheel was
   laid out for a canvas it did not have. Guarded against its own writes: a
   re-layout that does not change the size does not schedule another. */
if(typeof ResizeObserver!=='undefined'){
 new ResizeObserver(function(){
  var b=cv.getBoundingClientRect();
  if(Math.abs(b.width-CW)<0.5&&Math.abs(b.height-CH)<0.5)return;
  layout();render();}).observe(cv);}   /* the canvas, not the stage: the stage
    is a grid and the wheel's cell resizes without the stage doing so. */
function arcP(r0,r1,a0,a1){g.beginPath();g.arc(CX,CY,r0,a0,a1);g.arc(CX,CY,r1,a1,a0,true);g.closePath();}
function radialTxt(s,ang,rad,size,c,a,w){
 g.save();g.translate(CX+Math.cos(ang)*rad,CY+Math.sin(ang)*rad);
 let rot=ang;if(Math.cos(ang)<0){rot+=Math.PI;g.textAlign='right';}else g.textAlign='left';
 g.rotate(rot);g.font=(w||400)+' '+size+"px Lexend, system-ui, sans-serif";
 g.textBaseline='middle';g.fillStyle=rgba(c,a);g.fillText(s,0,0);
 /* the axis aligned box the rotated run actually occupies */
 var tw=g.measureText(s).width, sn=Math.abs(Math.sin(rot)), cs=Math.abs(Math.cos(rot));
 var bw=tw*cs+size*sn, bh=tw*sn+size*cs;
 var px=CX+Math.cos(ang)*rad, py=CY+Math.sin(ang)*rad;
 var off=(g.textAlign==='right'?-tw/2:tw/2);
 px+=Math.cos(rot)*off; py+=Math.sin(rot)*off;
 LBL.push({t:s,x:px-bw/2,y:py-bh/2,w:bw,h:bh});
 g.restore();}
function txt(s,x,y,size,c,a,w,fam){g.save();
 g.font=(w||400)+' '+size+'px '+(fam||'Lexend, system-ui, sans-serif');
 g.textAlign='center';g.textBaseline='middle';g.fillStyle=rgba(c,a);g.fillText(s,x,y);g.restore();}
function roundRect(x,y,w,h,r){
 if(g.roundRect){g.beginPath();g.roundRect(x,y,w,h,r);return;}
 g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);
 g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function pill(t,rad){const ink=INK();g.save();
 g.font="600 11px Lexend, system-ui, sans-serif";g.textAlign='center';g.textBaseline='middle';
 const w=g.measureText(t).width+18;
 g.fillStyle=LIGHT()?'rgba(255,255,255,.94)':'rgba(25,27,35,.94)';
 roundRect(CX-w/2,CY-rad-10,w,20,10);g.fill();
 g.strokeStyle=rgba(ink,.13);g.lineWidth=1;g.stroke();
 g.fillStyle=rgba(ink,.62);g.fillText(t,CX,CY-rad);g.restore();}
/* the rAF loop honours reduced motion: the field stops breathing. */
var REDUCED=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);

/* ============================================================
   WHERE TO START. One set of doors, two places that show them.

   The rail carried them and the summary now needs them, because the
   summary is where the app opens and a person arriving has read
   nothing. Two copies meant two sets of ids, and two elements with
   one id is a broken document, so the doors carry a data attribute
   and one delegated listener answers for every copy of them.
   ============================================================ */
const STARTD=[
 ['story','Write what happened',
  'The day, in your own words. The engine reads the charge out of it.'],
 ['nine','Read nine sentences',
  'For anyone who cannot think of themselves as the problem. None of them is a diagnosis.'],
 ['ages','Go year by year',
  'Three to eighteen. For anyone who cannot think of anything they identify with, which is most people.'],
 ['avatar','Say who you are becoming',
  'The avatar. Release empties an address and replace fills it. This is what you are filling it toward.']];
function startHTML(lead){
 return '<div class="pm-eye">Where to start</div>'
  +'<p class="st-lead">'+(lead||'Nothing has been read yet. Four ways in, and none of them '
   +'asks you to know anything first.')+'</p>'
  +STARTD.map(function(d){
   return '<button type="button" class="stbtn" data-start="'+d[0]+'"><b>'+d[1]+'</b>'
    +'<span>'+d[2]+'</span></button>';}).join('');}
/* One listener, bound once, for every door on the page now or later. The
   handlers are declared in later modules, so they are reached at click time
   rather than at bind time. */
addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('[data-start]'):null;
 if(!b)return;
 var k=b.getAttribute('data-start');
 if(k==='story'){setTab(TAB.STORY);render();
  var ta=document.getElementById('sttext'); if(ta)ta.focus(); return;}
 if(k==='nine'){runRecogniseDrill();return;}
 if(k==='ages'){runAgeDrill();return;}
 if(k==='avatar'){runAvatarDrill();return;}});
