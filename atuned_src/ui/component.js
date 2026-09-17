
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
const hx=h=>{const n=parseInt(String(h).slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+(+a).toFixed(3)+')';
const mixc=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const lerp=(a,b,t)=>a+(b-a)*t;
const LIGHT=()=>S.theme==='snow';
const INK=()=>LIGHT()?[22,23,28]:[239,237,232];
const GOLDC=()=>hx(LIGHT()?'#8A6D18':'#DFCC7E');
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

function layout(){const b=cv.parentElement.getBoundingClientRect();
 DPR=Math.min(devicePixelRatio||1,2);cv.width=b.width*DPR;cv.height=b.height*DPR;
 CW=b.width;CH=b.height;CX=CW/2;CY=CH/2;U=Math.min(CW,CH)/2;
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
  var b=cv.parentElement.getBoundingClientRect();
  if(Math.abs(b.width-CW)<0.5&&Math.abs(b.height-CH)<0.5)return;
  layout();render();}).observe(cv.parentElement);}
function arcP(r0,r1,a0,a1){g.beginPath();g.arc(CX,CY,r0,a0,a1);g.arc(CX,CY,r1,a1,a0,true);g.closePath();}
function radialTxt(s,ang,rad,size,c,a,w){
 g.save();g.translate(CX+Math.cos(ang)*rad,CY+Math.sin(ang)*rad);
 let rot=ang;if(Math.cos(ang)<0){rot+=Math.PI;g.textAlign='right';}else g.textAlign='left';
 g.rotate(rot);g.font=(w||400)+' '+size+"px Lexend, system-ui, sans-serif";
 g.textBaseline='middle';g.fillStyle=rgba(c,a);g.fillText(s,0,0);g.restore();}
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
