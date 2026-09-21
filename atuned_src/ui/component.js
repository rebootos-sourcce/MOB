
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
/* A MARK IS EITHER PATH DATA OR FINISHED MARKUP, and the tables hold both.
   CHILD, SI, HCX_LIB, GATEGLYPH and the nineteen domains carry a bare d
   string. SEATGLYPH carries a finished <path> or <circle>, because a seat's
   mark is sometimes two shapes and one d attribute cannot hold a circle.

   Every renderer that wrapped a mark in <path d="..."> without asking which
   it had got a nested path for the seven seats, which draws nothing and
   throws 'Expected moveto path command' once per row. It is invisible in a
   screenshot and loud in the console, which is where it was found. One
   emitter reads the first character, so a seat never renders as a broken
   path again. */
function glyphPath(ic){
 if(!ic)return SEATGLYPH._;
 return String(ic).charAt(0)==='<' ? ic : '<path d="'+ic+'"/>';}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* THE COLOUR A SEAT WEARS DEPENDS ON WHAT IT IS SITTING ON, and this knew
   about one light ground out of two. Lumen arrived with paper rails and the
   dark palette went onto them unchanged, so Weaver, Solar and half the
   readings in the rail were drawn in colours meant for a black panel. Every
   value written by JS rather than by a token had the same fault, which is why
   the rail looked washed while the sheet looked right. */
function seatCol(b){
 var P = S.theme==='lumen' ? PAL_VIVID
       : S.theme==='snow'  ? PAL_LIGHT
       : PAL;
 return P[b]||'var(--gold)';}
function cr(band,pct,o){
 o=o||{};
 var size=o.size||'md', G=CRGEO[size]||CRGEO.md;
 var p=Math.max(0,Math.min(100,pct||0));
 var C=2*Math.PI*G.r, off=C*(1-p/100);
 var col=o.color||seatCol(band);
 var hot=(o.hot!==undefined)?o.hot:(p>=HOT_AT);
 /* THE CENTRE TAKES LETTERS AS WELL AS A DRAWING. Ruled: "CQ, DQ, SQ is
    essentially an icon, make this a centre ring element instead of a pill."
    For those three the letters are the icon, because they are the names
    everything in this product calls them by and a drawing would be a second
    name for a thing that already has one. Everything else gets a drawing. */
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
   +(o.text?'<span class="gl gl-t">'+esc(o.text)+'</span>'
          :'<span class="gl"><svg viewBox="0 0 24 24" aria-hidden="true">'+glyph+'</svg></span>')+'</span>'
  +'<span class="v">'+esc(val)+'</span></'+tag+'>';}
/* ============================================================
   THE FOUR THAT MOVE THROUGH A PERSON, DRAWN.

   Ruled: the strip becomes a ring with the icon in the centre and a pill
   with the number, and the words go to their tooltips, which saves the space
   four labels were taking. CQ, DQ and SQ carry their letters. These four had
   no icon at all, because they had never needed one while the word was
   sitting next to them.

   Each is argued from what the reading is rather than from what the word
   sounds like, which is the rule the rest of the icon set keeps. Ring, never
   fill, on the same 24 unit grid.
   ============================================================ */
/* wrapped as markup, not as bare path data, because cr() drops the glyph
   straight into an svg and SEATGLYPH hands it a <path> element. Bare d data
   rendered as an empty ring, which is the one thing a glyph must never be. */
function qp(d){return '<path d="'+d+'"/>';}
const QICON_D={
 /* VITALITY. What is left after apathy and the shadow weight, so it is a
    shoot: the thing that grows back when the weight comes off. */
 vitality:'M12 21v-8M12 13c0-3.4 2.4-6 5.6-6.4C17.2 10 15 12.6 12 13'
   +'M12 13c0-2.8-2-5-4.7-5.4C7.7 10.4 9.6 12.4 12 13M9 21h6',
 /* AWARENESS. Intention read against distortion. An aperture, because
    awareness in this product is the width of what gets through, and the eye
    is already spoken for by perception. */
 awareness:'M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17M12 3.5L17.8 9.3'
   +'M20.5 12h-8.2M17.8 14.7L12 20.5M6.2 14.7L12 8.9M3.5 12h8.2M6.2 9.3L12 15.1',
 /* WILL. Integrity carried through a clear segment, so it is force through a
    gap: the shaft goes all the way and the gap is what it had to pass. */
 will:'M12 21V4M12 4l-4 4M12 4l4 4M5 13.5h3.2M15.8 13.5H19',
 /* FLOW. Every seat multiplied by the next, root to crown, so it is what
    rises through and keeps rising. */
 flow:'M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8'
   +'M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8'};
const QICON={};
Object.keys(QICON_D).forEach(function(k){QICON[k]=qp(QICON_D[k]);});
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
 /* the badge, not the ring and a bare number. This row is the one that
    prints Lethargy and Disconnection down a rail twenty at a time. */
 return '<button type="button" class="ad-r" data-addr="'+n.i+'" '
  +'title="Open '+esc(n.k)+'">'+crbNode(n,'sm')
  +'<span>'+esc(n.k)+'</span><em>'+esc(opp||n.b)+'</em></button>';}
/* ============================================================
   THE BADGE. AN ICON CARRYING ITS OWN PERCENT, AND THE NUMBER IN A PILL.

   Ruled, and repeated more than anything else: the named things print as a
   word and a bare figure. Lethargy 5.4. Disconnection 3.1. A figure with no
   shape next to it is the least readable way to carry a quantity, and after
   twenty of them down a rail a person is reading a spreadsheet of feelings.

   What replaces it is one object with two parts.

   The ICON carries the reading, as a ring drawn around its own glyph, so the
   quantity is a shape before it is a number and a row of these reads at a
   glance as a row of fuller and emptier rings. The glyph is the thing's own
   symbol, which is the icon rule: if it has a name it has an icon, the icon
   has a family, and the family has a colour that means something. The colour
   here is the seat.

   The PILL sits at the lower right of the icon and carries the actual
   figure, for when a person wants the number rather than the impression.
   Overlapping the icon rather than sitting beside it, because two things
   side by side are two things and this is one reading in two resolutions.
   ============================================================ */
const CRB={xs:{box:26,r:10,w:2.4},sm:{box:34,r:13.5,w:3},md:{box:44,r:17.5,w:3.6}};
function crBadge(band,pct,o){
 o=o||{};
 var size=o.size||'sm', G=CRB[size]||CRB.sm;
 var p=Math.max(0,Math.min(100,pct||0));
 var C=2*Math.PI*G.r, off=C*(1-p/100);
 var col=o.color||seatCol(band);
 /* THE CENTRE TAKES LETTERS AS WELL AS A DRAWING. Ruled: "CQ, DQ, SQ is
    essentially an icon, make this a centre ring element instead of a pill."
    For those three the letters are the icon, because they are the names
    everything in this product calls them by and a drawing would be a second
    name for a thing that already has one. Everything else gets a drawing. */
 var glyph=o.glyph||SEATGLYPH[band]||SEATGLYPH._;
 var val=(o.raw!=null)?o.raw:(Math.round(p)+'%');
 var half=G.box/2;
 /* BARE IS THE RING WITHOUT ITS PILL. The codex row carries the figure at the
    far right of the row, where it aligns with every other figure in the
    column, so a pill overlapping the mark would be the same reading printed
    twice two centimetres apart. The geometry stays here rather than being
    redrawn, which is the porting rule: same box, same radius, same stroke. */
 var bare=!!o.bare;
 return '<span class="crb '+size+(bare?' bare':'')+'" style="--c:'+col+'"'
  +(o.title?' title="'+esc(o.title)+'"':'')+'>'
  +'<svg class="crb-a" width="'+G.box+'" height="'+G.box+'" aria-hidden="true">'
  +'<circle cx="'+half+'" cy="'+half+'" r="'+G.r+'" fill="none" '
   +'stroke="rgba(128,128,128,.22)" stroke-width="'+G.w+'"/>'
  +'<circle cx="'+half+'" cy="'+half+'" r="'+G.r+'" fill="none" stroke="'+col+'" '
   +'stroke-width="'+G.w+'" stroke-linecap="round" '
   +'stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>'
  +'<span class="crb-g"><svg viewBox="0 0 24 24" aria-hidden="true">'+glyph+'</svg></span>'
  +(bare?'':'<span class="crb-v">'+esc(val)+'</span>')+'</span>';}
/* an address as a badge. the same reading the ring carried, in the shape the
   ruling asked for. */
function crbNode(n,size,o){o=o||{};
 return crBadge(n.b, n.sq*10, Object.assign({size:size||'sm', raw:n.sq.toFixed(1),
  title:n.k+' · '+n.b+' · SQ '+n.sq.toFixed(1)},o));}
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
/* AND THE CANVAS NEEDS THE SAME ANSWER seatCol GOT. PAL_VIVID went in for
   Lumen and was reached only by seatCol, which serves the HTML rings, so the
   whole centre field carried on painting the muted dark palette and Lumen
   against Dark was the same picture. Vibrancy was the entire point of the
   lighting and it was not delivered. One ternary, and it is the same ladder
   seatCol uses so the two cannot drift apart again. */
function bc(b){
 const P = S.theme==='lumen' ? PAL_VIVID
         : LIGHT()           ? PAL_LIGHT
         : PAL;
 return hx(P[b]);}
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
 /* A REFUSAL NAMES ITS OWN REASON. One message for every failure said storage
    was full or blocked, which is the wrong sentence for a save onto a worked
    example: nothing is wrong with the browser and there is something the person
    can do. The words follow the release's refusal, which is the same crossing
    answered the same way. */
 else if(st.err==='NotARecord')
  status('Not saved. This is a worked example rather than your record. '
   +'Switch to your own profile first.','fail');
 else status('Not saved. Storage is full or blocked, so this session will not survive a reload.','fail');
 return st.ok;}

/* the key strip sits in flow above the canvas, so the canvas box is the
   measure, not the stage. */
/* Zoom is applied to the unit radius and the centre rather than to the canvas
   transform, so hit testing needs no inverse: every HIT region is built from
   the same CX, CY and U the draw used. */
var BASE_U=1;
const AURA_DIV=8;
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
 /* A NON FINITE FRAME IS UNRECOVERABLE. CX and CY are written here and read
    by every draw and every hit test, so one NaN reaching them stops the wheel
    drawing for the rest of the session with no error and no way back but a
    reload. Cheap to guard and it costs a comparison a frame. Found by a probe
    that forgot to pass its own argument and set S.zoom to undefined, which is
    a bug in the probe and a demonstration of the hazard. */
 if(!isFinite(BASE_U)||BASE_U<=0)BASE_U=40;
 if(!isFinite(S.zoom)||S.zoom<=0)S.zoom=1;
 if(!isFinite(S.panx))S.panx=0;
 if(!isFinite(S.pany))S.pany=0;
 U=BASE_U*S.zoom;
 /* HOW FAR THE FRAME MAY TRAVEL.

    This used to be a flat 0.9 of the canvas WIDTH on both axes, and then it
    threw the whole thing away at zoom 1. So dragging did nothing at the
    default zoom, which is the zoom everybody is at, and at a higher zoom the
    vertical limit was measured against the wrong side of the box.

    The budget is two terms and each one is a reason. Half the box, so the
    wheel can always be repositioned within its own frame whatever the zoom.
    Plus however much of the magnified wheel is currently outside the box, so
    a person who has zoomed in can reach the far edge of what they zoomed
    into and no further. At zoom 1 the second term is zero and the first still
    lets a person move the instrument off centre, which is the whole request. */
 var outW=Math.max(0,U*LBL_R-CW/2), outH=Math.max(0,U*LBL_R-CH/2);
 var limX=CW*0.5+outW, limY=CH*0.5+outH;
 S.panx=Math.max(-limX,Math.min(limX,S.panx));
 S.pany=Math.max(-limY,Math.min(limY,S.pany));
 CX=CW/2+S.panx; CY=CH/2+S.pany;
 if(typeof DRAW_SIG!=='undefined')DRAW_SIG=null;}
function layout(){const b=cv.getBoundingClientRect();
 DPR=Math.min(devicePixelRatio||1,2);cv.width=b.width*DPR;cv.height=b.height*DPR;
 CW=b.width;CH=b.height;reframe();
 g.setTransform(DPR,0,0,DPR,0,0);
 /* THE AURA IS PAINTED SMALL AND SCALED UP, AND THE CSS BLUR IS GONE.

    The wash was a full viewport canvas inset by 25 percent on both axes, so
    2400 by 1500 at this size, carrying a 120px CSS blur and recompositing
    whenever its content changed. Measured on the Field with a loaded
    profile: 7.7 frames a second, against 59.5 with that one element hidden.
    Eighty seven percent of the frame budget was going into blurring four
    radial gradients that are already soft. Dropping the radius did not save
    it either: 40px at a smaller inset still only reached 15.2.

    So it is painted at an eighth scale and stretched back up. The browser's
    bilinear upscale is the blur, it is free, and eight times is far past the
    point where a gradient shows a step. The backing store goes from about
    3.6 million pixels to 56 thousand, which is 64 times less to paint and
    nothing at all to filter. */
 bg.width=Math.max(2,Math.ceil(innerWidth/AURA_DIV));
 bg.height=Math.max(2,Math.ceil(innerHeight/AURA_DIV));
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
 g.rotate(rot);g.font=(w||400)+' '+size+"px Inter, system-ui, sans-serif";
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
 g.font=(w||400)+' '+size+'px '+(fam||'Inter, system-ui, sans-serif');
 g.textAlign='center';g.textBaseline='middle';g.fillStyle=rgba(c,a);g.fillText(s,x,y);g.restore();}
function roundRect(x,y,w,h,r){
 if(g.roundRect){g.beginPath();g.roundRect(x,y,w,h,r);return;}
 g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);
 g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
/* THE BAND CAPTIONS ARE OFF THE HERO, AND pill() WENT WITH THEM.

   Ruled, and it settles a collision that had been open all session between
   law 8, no text over the hero graphic ever, and the ruling that said the gate
   ring must always carry its pill so the absence is said rather than hidden.

   His words: "Get rid of all that overlay. You do not need 112 addresses, SQ,
   loaded, because you already have your SQ in the upper left, and the addresses
   are already visible in the field. Twenty one laws, integrity six point five,
   get rid of all that. Your integrity should be at the centre point of your
   feathers, because your integrity is your CQ."

   That is the whole rule in one sentence. A caption naming a ring is text
   floating on the picture and it goes. A figure at the centre of the thing it
   describes is the picture saying its own name and it stays. Nine captions came
   off the Field and one number went back into the core.

   The function is deleted rather than left with no callers, because a drawing
   helper nobody calls is the next person's invitation to caption something.
   It is in the history if a surface with a different ruling ever needs it. */
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
