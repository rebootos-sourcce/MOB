
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
var CRGEO={lg:{box:46,r:18,w:3.5},md:{box:34,r:13,w:3},sm:{box:24,r:9,w:2.4},xs:{box:18,r:6.5,w:2},
 /* THE READINGS AS CIRCLES, ED in TASKS.md: "a circle and the icon inside of
    it, and the percent complete ring around it are the primary features, and
    then there's a pill to the lower right." orb is the tap floor, 44, and
    hero is CQ alone. The prototype drew these by rewriting the small ring's
    viewBox after it landed; a size of their own draws them right first. */
 orb:{box:44,r:16.5,w:2.8},hero:{box:72,r:27,w:4}};
var HOT_AT=90;                         /* the alarm band. severity gets its own channel. */
/* one stroked icon, 24 unit box. declared here because this file loads first
   and every renderer after it wants one. */
const svgI=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>';};
/* THE FOUR TIERS OF A CHAIN, as marks. They were written inline in the
   rail's stack tabs, railStack in ui/ui.js, and the glass bar needs the same
   four for its own switches: one concept, one mark, on every surface, which
   two copies of a path cannot promise. Two locked rings a saboteur, three a
   complex, a lattice a hyper complex, a ring in a ring the character layer. */
const CHAINGLYPH={
 sab:'M8.6 4.8a3.4 3.4 0 013.4 3.4v3.4a3.4 3.4 0 01-6.8 0V8.2a3.4 3.4 0 013.4-3.4'
  +'M15.4 12.4a3.4 3.4 0 013.4 3.4a3.4 3.4 0 01-6.8 0a3.4 3.4 0 013.4-3.4',
 cx:'M9 6.6a3 3 0 110 6 3 3 0 010-6M15 6.6a3 3 0 110 6 3 3 0 010-6'
  +'M12 12.8a3 3 0 110 6 3 3 0 010-6',
 hy:'M12 3.2l7.6 4.4v8.8L12 20.8 4.4 16.4V7.6zM12 3.2v17.6M4.4 7.6l15.2 8.8'
  +'M19.6 7.6L4.4 16.4',
 sup:'M12 3.4a8.6 8.6 0 100 17.2 8.6 8.6 0 000-17.2M12 7.6a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8'};
/* THE FOUR SYSTEMS OF ROOT ENERGETICS, AND WHERE A BIRTH WAS, AS MARKS. FV in
   TASKS.md, his words: "everything should have meaning, everything should
   have an icon." The rail's Western, Eastern, Number and Design headings were
   the one set of headers on it printing a word and nothing else, and the
   summary on the right rail names the same four on every meeting it reads, so
   one mark per system serves both and they cannot drift apart. Western is the
   sky's wheel, two rings and the four angles. Eastern is the two halves of
   one cycle. Number is the grid digits are counted on. Design is the mark the
   Summary's own chip already gives Human Design, kept rather than redrawn,
   because one concept has one mark. Born is the place, a pin. */
const SYSGLYPH={
 W:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.2"/>'
  +'<path d="M12 3.4v4.4M12 16.2v4.4M3.4 12h4.4M16.2 12h4.4"/>',
 E:'<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4a4.3 4.3 0 010 8.6 4.3 4.3 0 000 8.6"/>'
  +'<circle cx="12" cy="7.7" r="1"/><circle cx="12" cy="16.3" r="1"/>',
 N:'<path d="M9.8 4.4L8.2 19.6M15.8 4.4l-1.6 15.2M5 9.2h14.4M4.6 14.8H19"/>',
 D:'<path d="M7 4v16M17 4v16M7 9h10M7 15h10"/>',
 born:'<path d="M12 20.6s-6.2-5.4-6.2-10a6.2 6.2 0 0112.4 0c0 4.6-6.2 10-6.2 10z"/>'
  +'<circle cx="12" cy="10.6" r="2.2"/>'};
const SYSNAME={W:'Western',E:'Eastern',N:'Number',D:'Design'};
/* THE NINE PLANETS A SIGN AND A NUMBER CAN MEET ON, engine/overlap.js. Drawn
   on the 24 grid in the house stroke, ring never fill, each the planet's own
   astronomical mark reduced to the few lines that still read at eleven
   pixels. A Unicode glyph would come from whatever fallback face the device
   has, and the zodiac glyphs on this rail already show how uneven that is. */
const PLANETGLYPH={
 Sun:'<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="1.4"/>',
 Moon:'<path d="M15.6 4.4a8 8 0 100 15.2 6.8 6.8 0 010-15.2z"/>',
 Mercury:'<path d="M8.8 3.6a3.2 3.2 0 006.4 0"/><circle cx="12" cy="10.2" r="3.6"/>'
  +'<path d="M12 13.8v7M9.2 17.6h5.6"/>',
 Venus:'<circle cx="12" cy="8.8" r="4.8"/><path d="M12 13.6v7.2M8.8 17.4h6.4"/>',
 Mars:'<circle cx="10" cy="14" r="5.2"/><path d="M13.7 10.3l5.7-5.7M14.6 4.6h4.8v4.8"/>',
 Jupiter:'<path d="M6.2 6.8c2.4-2.6 6.6-1.8 5.4 2.2-.8 2.6-3.4 5.2-5.6 7.4h12M15.6 4.4v15.6"/>',
 Saturn:'<path d="M8 3.6v12.4M5.4 6.4h5.2M8 12c1.2-2.6 6.8-3 6.8 1.2 0 3-3.4 3.6-3.4 6.2 0 1.2 1 1.8 2.2 1.2"/>',
 Uranus:'<circle cx="12" cy="15.2" r="5"/><circle cx="12" cy="15.2" r="1.1"/><path d="M12 10.2V3.8M9.4 6.4L12 3.8l2.6 2.6"/>',
 Neptune:'<path d="M5.8 5.2c0 4.8 2.6 7.2 6.2 7.2s6.2-2.4 6.2-7.2M12 4v16.6M8.8 17.4h6.4'
  +'M4.6 6.6l1.2-1.4 1.2 1.4M10.8 5.4L12 4l1.2 1.4M17 6.6l1.2-1.4 1.2 1.4"/>'};
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
/* THE TIER WORD, OR WHAT IS STILL TO ANSWER BEFORE THERE IS ONE. compute()
   sets r.tier null until all 21 laws are in, because a word on a CQ that is
   still filling would name everybody on day one by the laws they have not
   answered yet. Every surface that had a slot for the word puts this in it,
   so the building state is said one way across the app. */
function tierSay(r){
 if(r.tier)return r.tier;
 var left=SI.length-(r.answered||0);
 return left+(left===1?' law':' laws')+' to answer';}
/* and the same state as a sentence, for a slot that carries the definition */
function tierBuilding(){
 return 'Coherence fills as each law is answered. The band is named once all '
  +SI.length+' are in.';}
/* A NAME IS ALWAYS PRINTED CAPITALISED, round OT: "the names always have to be
   capitalized", after a greeting began with a lower case first name. Display
   only: the record keeps what the person typed. Each word gets its first
   letter raised and the rest is left as typed, so McKay and O'Neill survive. */
function capName(s){return String(s==null?'':s).replace(/(^|[\s\-'’])(\p{Ll})/gu,function(m,a,b){return a+b.toUpperCase();});}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* ============================================================
   UNPACK, THE ONE WAY A MEANING IS SHOWN. Round PO, "unpack every symbol".

   engine/data/gloss.js is the one table of what a term means. This is the one
   way a renderer puts it on a screen, and it is not a new component: the
   product already has one tooltip, ui/tip.js, which opens on hover, on a tap
   and on keyboard focus, and the sheet sets the one class that says a word
   carries something, .tipu, a dotted underline. So a term that has no room for
   its sentence beside it becomes a carrier of that sentence, and a term that
   has room is followed by the sentence itself.

     unp(term,label,ctx)     the term as a carrier, or plain text when the table
                             has no sentence for it. Never a guess.
     unpAttr(term,ctx,label) the same three attributes, for an element a caller
                             already owns, such as a chip that is a button.
     unpSay(term,ctx)        the sentence, escaped, for a line that prints it.

   The meaning is always in the same element as the term or on the term itself,
   never behind a link to another page. The rule and its reason are in
   CLAUDE.md, UNPACK EVERY SYMBOL.
   ============================================================ */
function unpSay(term,ctx){return esc(unpackOf(term,ctx));}
function unpAttr(term,ctx,label){
 var s=unpackOf(term,ctx); if(!s)return '';
 return ' tabindex="0" data-tip-k="'+esc(label==null?term:label)+'" data-tip="'+esc(s)+'"';}
function unp(term,label,ctx){
 var t=label==null?term:label, a=unpAttr(term,ctx,t);
 return a?'<span class="tipu"'+a+'>'+esc(t)+'</span>':esc(t);}
/* THE COLOUR A SEAT WEARS DEPENDS ON WHAT IT IS SITTING ON, and this knew
   about one light ground out of two. Lumen arrived with paper rails and the
   dark palette went onto them unchanged, so Weaver, Solar and half the
   readings in the rail were drawn in colours meant for a black panel. Every
   value written by JS rather than by a token had the same fault, which is why
   the rail looked washed while the sheet looked right. */
/* AND IT KNEW ABOUT TWO OUT OF THREE. Glass white is paper, #E8E7E2 under
   rails at sixty two percent white, and it fell through to the dark palette,
   so every seat colour on it was drawn for a black panel: Connection's icon
   measured 1.59 to 1 against a 3 to 1 floor, and 5.14 after. It takes the
   Snow palette because it is the same question, a light ground.
   bc() below is the canvas twin of this ladder and moves through LIGHT(),
   which is where the Glass white stage was taken on, with its ink and wash. */
function seatCol(b){
 var P = S.theme==='lumen' ? PAL_VIVID
       : S.theme==='snow'||S.theme==='glasswhite' ? PAL_LIGHT
       : PAL;
 return P[b]||'var(--gold)';}
/* THE ICON GRIDS, PUNCHED UP FIFTEEN PERCENT. The owner: "all our normal
   icons under Blueprint Domains, Primary, I think we want those punched up a
   little more, more saturated, they're just a little dull." Ruled option B
   from the proto/rooticons board, 26 September. Most of the dullness was the
   resting opacity in the sheet, which is gone; this is the other part, chroma
   times 1.15 in OKLCH with hue and lightness held, so a colour gets louder
   without getting lighter or darker.

   The clamp gives up chroma and never hue or lightness, which is what CSS
   Color 4 asks of a relative colour and what Chromium does not do yet. That
   is why this is arithmetic here and not oklch(from ...) in the sheet.

   Two things are held. Root keeps its shipped value, because a chroma
   multiplier walks it toward ALARM: OKLab distance from #FF2E1F is 0.082 as
   shipped and 0.060 lifted, and the alarm is reserved for something being
   wrong. And Lumen is not touched at all, because it is the owner's own
   palette and whether it moves is his open question on that board. */
var _lift={};
function icLift(hex){
 if(_lift[hex])return _lift[hex];
 if(!/^#[0-9a-f]{6}$/i.test(hex))return hex;
 var lin=function(v){return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
 var unlin=function(v){return v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055;};
 var c=hx(hex).map(function(v){return lin(v/255);});
 var l=Math.cbrt(0.4122214708*c[0]+0.5363325363*c[1]+0.0514459929*c[2]);
 var m=Math.cbrt(0.2119034982*c[0]+0.6806995451*c[1]+0.1073969566*c[2]);
 var s=Math.cbrt(0.0883024619*c[0]+0.2817188376*c[1]+0.6299787005*c[2]);
 var L=0.2104542553*l+0.7936177850*m-0.0040720468*s;
 var A=1.9779984951*l-2.4285922050*m+0.4505937099*s;
 var B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
 var toRgb=function(k){
  var a=A*k,b=B*k;
  var l3=Math.pow(L+0.3963377774*a+0.2158037573*b,3);
  var m3=Math.pow(L-0.1055613458*a-0.0638541728*b,3);
  var s3=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
  return [4.0767416621*l3-3.3077115913*m3+0.2309699292*s3,
   -1.2684380046*l3+2.6097574011*m3-0.3413193965*s3,
   -0.0041960863*l3-0.7034186147*m3+1.7076147010*s3];};
 var inG=function(v){return v.every(function(x){return x>=-1e-4&&x<=1+1e-4;});};
 var k=1.15, rgb=toRgb(k);
 if(!inG(rgb)){var lo=1,hi=k;
  for(var i=0;i<24;i++){var mid=(lo+hi)/2; if(inG(toRgb(mid)))lo=mid; else hi=mid;}
  rgb=toRgb(lo);}
 return (_lift[hex]='#'+rgb.map(function(v){
  v=Math.round(Math.max(0,Math.min(1,unlin(Math.max(0,v))))*255);
  return (v<16?'0':'')+v.toString(16);}).join('').toUpperCase());}
/* the colour an icon in the rail's grids wears, for a seat, and for a root,
   which is its seat's. LUMEN DRAWS BOTH AS IT SHIPPED. Routed through seatCol
   it takes the vivid palette, and on its paper that moved the archetype grid
   from 2.86 to 1 down to 2.22, measured: a change to his own palette that makes
   it worse, which nobody has ruled. So Lumen keeps ROOTCOL for the roots and
   the one accent for the archetypes until he does. */
function icCol(b){
 if(S.theme==='lumen')return 'var(--gold)';
 var c=seatCol(b);
 return b==='Root'?c:icLift(c);}
function rootCol(rn){
 return S.theme==='lumen'?ROOTCOL[rn]:icCol(ROOTSEAT[rn]);}
/* A ROOT'S COLOUR EVERYWHERE THAT IS NOT THE RAIL'S GRIDS. rootCol above
   carries the grids' chroma lift, which was ruled for those icons, so the
   reading, the codex, the matrix and the domain chips take the plain seat,
   the value an archetype beside them already takes from seatCol. They drew
   ROOTCOL, the Dark values, on every lighting: on Snow the root names in the
   reading measured 2.41 to 1 at worst against a 4.5 text floor, and 4.97
   after, and the Blueprint chips' icons 1.43 against 3, and 4.09 after. On
   Dark this is ROOTCOL to the digit. Lumen
   keeps ROOTCOL for the reason icCol gives, and a name that is not a root
   comes back empty, as ROOTCOL[name] did, so a caller's fallback still
   fires rather than a stray word being painted the accent. */
function rootPlain(rn){
 return S.theme==='lumen'||!ROOTSEAT[rn]?ROOTCOL[rn]:seatCol(ROOTSEAT[rn]);}
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
 var val=(o.raw!=null)?o.raw:(Math.round(p)>0?Math.round(p)+'%':'\u2013');
 /* A ZERO IS A DASH, ruled in COPY.md under Value and said again on 2 October:
    "the hardest carrying zero percent. I don't want that." Every figure this
    component prints passes through here, so a ring that reads nought prints the
    dash and its title says so, and no caller has to remember. Round J13. */
 if(/^0(?:\.0+)?%?$/.test(String(val)))val='\u2013';
 var cls='cr '+size+(hot?' hot':'')+(o.act?' act':'')+(o.on?' on':'');
 var attrs=o.data||'';
 /* THE RING NAMED ITS COLOUR AND NOT ITS SUBJECT. The fallback led with the
    band, which is the seat the ring is painted in, so the Trust ring on the
    rail titled itself "Heart · 0.0" and the Fear ring "Root · 9.4". A title
    that names the paint is worse than none. With a label it names the thing;
    without one it says nothing, and the name printed beside the ring does
    the job. DESIGN-tooltip-copy.md, example 5. */
 var title=o.title||(o.label?o.label+', '+val:'');
 var tag=o.act?'button':'span';
 /* and no attribute at all when there is nothing to say: an empty title still
    matches the tooltip's [title] carrier and would eat the hover of the row
    the ring sits in. */
 return '<'+tag+' class="'+cls+'" style="--c:'+col+'"'+(title?' title="'+esc(title)+'"':'')+' '+attrs+'>'
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
   THE DOCK'S CIRCLES MOVE INTO THEIR VALUES. EZ in TASKS.md, his words:
   "I want to be able to see the animations on these." They snapped: render
   writes the dock's whole markup, so every ring arrived at its final arc in
   the frame it was written and a changed reading jumped from one figure to
   the next with nothing to watch.

   So each ring sweeps from where it was to where it is and its pill counts
   with it. The first sight of the dock sweeps from empty, one circle after
   the next in reading order, on the wheel's own entrance numbers, ENTER_SPAN
   and ENTER_STAGGER in ui/wheel.js, and the wheel's curve, a cubic out. It
   is the wheel assembling and the readings filling in the same breath, once
   a session and not once a visit, which is the ruling enterStart carries.
   After that a ring moves only when its value does.

   A TWEEN AND NOT A CSS TRANSITION, because the markup is rewritten on every
   render: a transition lives on an element, and the next render replaced the
   element mid sweep with one already at the end. The tween is kept by host
   and position and writes into whichever element is there on each frame, so
   a render landing mid sweep continues it rather than cutting it.

   A HIDDEN DOCK IS NOT A FIRST SIGHT. The first render at boot runs before
   the Field's class is on the body, and a sweep started then runs where
   nobody can see it and is spent by the time anybody can. Hidden, nothing is
   recorded, so a value changed on another tab moves on the way back.
   Reduced motion gets the value in the frame it is written. */
/* UNDER THE BOOT SHEET NOTHING IS SEEN TO MOVE. The Field is the opening
   surface, so its first render lands while the sheet still covers it, and an
   entrance started then has finished before the sheet has gone. The wheel
   learned this first, ET in TASKS.md, and holds its entrance until the sheet
   starts to lift: ui/panels.js calls enterLift, and ui/wheel.js keeps the
   answer in BOOT_LIFTED. This reads the same answer rather than keeping a
   second one, so the wheel and the circles over it start on one frame. No
   sheet in the document is lifted too, which is the case panels.js already
   treats that way. One frame check while waiting, none once it has lifted. */
function isBooted(){
 return (typeof BOOT_LIFTED!=='undefined'&&BOOT_LIFTED)||!document.getElementById('boot');}
function afterBoot(fn){if(isBooted()){fn();return;}
 requestAnimationFrame(function(){afterBoot(fn);});}
var CRMO={}, CRMO_RAF=0;
function crMoNum(t){var m=/^(-?\d+(?:\.(\d+))?)(\D*)$/.exec(t||'');
 return m?{n:+m[1],dp:m[2]?m[2].length:0,suf:m[3]}:null;}
function crMoAt(m,now){var k=(now-m.t0)/m.dur;
 return k<=0?0:k>=1?1:1-Math.pow(1-k,3);}
/* THE RING AND THE BADGE ARE ONE MOTION. FV in TASKS.md, his words: "Where's
   the animation of the bands animating?" The dock's circles swept and counted
   and every other reading on the two rails snapped: the archetype and domain
   shares under Reading, the stack's axes and patterns, the coherence ring at
   the rail's head and the Running badges. They are the same two objects, the
   ring cr() draws and the badge crBadge() draws, with the same arc and the
   same pill, so this reads both and ui.js hands it those hosts too. */
var CRMO_SEL='.cr,.crb';
function crMoParts(el){return {arc:el.querySelector('svg.arc circle:last-child,svg.crb-a circle:last-child'),
 pv:el.querySelector('.v,.crb-v')};}
function crMoPaint(m,now){
 var h=document.getElementById(m.host), el=h?h.querySelectorAll(CRMO_SEL)[m.j]:null; if(!el)return;
 var e=crMoAt(m,now), pt=crMoParts(el), arc=pt.arc, pv=pt.pv;
 if(arc)arc.style.strokeDashoffset=(m.a0+(m.a1-m.a0)*e).toFixed(2);
 if(pv&&m.n0!==null&&m.n1!==null)pv.textContent=(m.n0+(m.n1-m.n0)*e).toFixed(m.dp)+m.suf;}
function crMoTick(now){
 CRMO_RAF=0; var live=false;
 Object.keys(CRMO).forEach(function(k){var m=CRMO[k]; if(m.done)return;
  crMoPaint(m,now); if(now<m.t0+m.dur)live=true; else m.done=true;});
 if(live)CRMO_RAF=requestAnimationFrame(crMoTick);}
function crMotion(hosts){
 var now=performance.now(), fresh=[];
 hosts.forEach(function(h){
  if(!h)return;
  h.querySelectorAll(CRMO_SEL).forEach(function(el,j){
   /* visibility read off the circle and not its host: #key takes no box of
      its own in the dock, display:contents, and such an element has no
      offsetParent whether it is on screen or not */
   if(!el.offsetParent)return;
   var pt=crMoParts(el), arc=pt.arc, pv=pt.pv; if(!arc)return;
   var key=h.id+':'+j, m=CRMO[key], num=crMoNum(pv?pv.textContent:''),
    C=parseFloat(arc.getAttribute('stroke-dasharray'))||0,
    to=parseFloat(arc.getAttribute('stroke-dashoffset'))||0, n1=num?num.n:null;
   if(m&&Math.abs(m.a1-to)<.05&&m.n1===n1){if(!m.done)crMoPaint(m,now);return;}
   var nm={host:h.id,j:j,a1:to,n1:n1,dp:num?num.dp:0,suf:num?num.suf:'',dur:ENTER_SPAN,t0:now,done:false};
   if(REDUCED){nm.a0=to;nm.n0=n1;nm.done=true;}
   /* from wherever the last one had got to, so a second change mid sweep
      turns rather than jumping back to where the first began */
   else if(m){var e=crMoAt(m,now);nm.a0=m.a0+(m.a1-m.a0)*e;
    nm.n0=(m.n0!==null&&m.n1!==null&&n1!==null&&m.suf===nm.suf)?m.n0+(m.n1-m.n0)*e:null;}
   else{nm.a0=C;nm.n0=n1===null?null:0;fresh.push({m:nm,r:el.getBoundingClientRect()});}
   CRMO[key]=nm; crMoPaint(nm,now);});});
 /* the stagger reads the page and not the markup: CQ is written before DQ
    and draws after it, and the eye goes along the row that is drawn */
 fresh.sort(function(a,b){return Math.round(a.r.top/24)-Math.round(b.r.top/24)||a.r.left-b.r.left;});
 /* under the sheet the rings hold empty, and the sweep starts as it clears */
 function go(){var t=performance.now();
  /* the stagger stops growing at the eighth, because the stack can put twenty
     rings on first sight and a sweep still starting a second and a half in is
     a wait and not an entrance. The dock's seven are under the cap. */
  fresh.forEach(function(f,i){f.m.t0=t+Math.min(i,8)*ENTER_STAGGER; crMoPaint(f.m,t);});
  if(!CRMO_RAF&&Object.keys(CRMO).some(function(k){return !CRMO[k].done;}))
   CRMO_RAF=requestAnimationFrame(crMoTick);}
 if(fresh.length&&!isBooted()){
  fresh.forEach(function(f){f.m.t0=Infinity; crMoPaint(f.m,now);});
  afterBoot(go);}
 else go();}
/* ============================================================
   THE DOCK'S READINGS AS BARS, round OG. One row per reading, the name on the
   left, the figure on the right, and a bar under both that fills to the
   figure. The colour is cqRamp's (ui/wheel.js), alarm at the floor, slate at
   the median, the accent at the crown, so a bar and the core agree. A reading
   where high is the wrong end (the shadow) passes bad and is coloured from its
   own inverse. An unread reading draws an empty bar in the dim ink.

   THEY STILL MOVE INTO THEIR VALUES, which is the standing ruling the circles
   carried (EZ: "I want to be able to see the animations on these"). The
   markup is rewritten on every render, so this is a tween kept by host and
   position, the same way crMotion keeps the rings': it writes into whichever
   element is there on each frame, a change mid sweep turns from where the
   bar had got to, the first sight sweeps from empty after the boot sheet
   lifts, one row after the next in reading order, and reduced motion gets the
   value in the frame it is written. It is a second small function and not a
   branch in crMotion because a bar has no arc to read, and crMotion's
   reading of an arc is the thing that would have to be bent.
   ============================================================ */
function rbCol(p,bad){var c=cqRamp(bad?100-p:p);return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}
/* THE INK OVER A FILL IS CHOSEN FOR THE FILL. A fixed dark ink read well on
   the green end of the ramp and badly on the dark red end, where Vitality sat
   at 0.42 in a muted red. Relative luminance of the ramp's own colour decides
   between the two inks, so the words stay legible at every figure. */
function rbOn(p,bad){var c=cqRamp(bad?100-p:p),f=function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};
 var L=.2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);return L>.32?'#0B0D10':'#F6F4EF';}
/* THE BAR IS THE ROW, round OG. His words: "I want for the color bar to be
   taller than the font and I want the font inside the color bar so as the
   color bar grows you see the word underneath... treat the color differently
   when it's over it than when it's not. And then put the percent, it needs a
   better visual treatment." So the fill is the whole 44 pixel row, the name
   and the number sit inside it, and the words are drawn twice: once in the
   panel's ink on the empty track, and once in the dark ink clipped to exactly
   the filled width, so a letter changes colour at the edge of the fill the
   way a gauge does. --w carries the width to the clip, and rbPaint moves
   both together. The second copy is aria-hidden: one reading, said once.

   THE ROW NAMES ITS CIRCLE, round OJ. o.fk is the glass bar's own layer key
   for the same reading, written to data-fk: Coherence is the laws summed, so
   it is the Laws circle; Decoherence is the circle of the same name, and both
   circles print the figure the row does; Flow is the seats' chain. Vitality,
   awareness and will are the core's triad and have no circle, so they carry
   data-fk="core". A pointer on the circle lights its row in the rail
   (ui/railtiles.js); the rail does not reach back, which is the ruling.

   EVERY ROW WEARS ITS MARK. A thing with a name has an icon (o.ic), drawn
   inside .rb-n so the clipped second copy carries it across the edge of the
   fill with the word. Three more things ride inside a row when the reading
   has them, all read off the engine and none of them new arithmetic:
     o.pull   the share of the fill the shadow is holding down. Coherence is
              scaled by what the shadow leaves, so a hatched band along the
              fill's foot says how much of it is not getting through.
     o.wave   Flow as a sine wave, round OM. His words: "Let's use an actual
              sine wave. When a person's sine wave is healthy, it ranges full
              spectrum zero to one. Otherwise, we get to show how choppy it
              is. By the weights of the chakra." o.wave is the seven seat
              passes, root to crown, the numbers flSeats() already keeps and
              Flow is the product of. rbWave draws them (below).
     o.col    the bar's own colour, where the colour is the element it
              reflects and not its figure, round OT, his words: "I want their
              colors to be representative of the elements that they reflect
              ... Vitality to me is energy. Energy is yellow. Awareness is
              Indigo will is blue." The three take the seat colours that carry
              those three, Solar, the 3rd Eye and Throat, from seatCol, so a
              lighting that moves the seats moves the bars with them. A bar
              with no o.col keeps the ramp by its figure, round OG.

   ROUND RB, EVERY ROW IS ONE BAR. His words: "every single element looks
   completely different ... This stack of elements should all be bar style
   with the symbolic icon and the text inside of the bar itself to maximize
   space." So the wave no longer takes a taller row of its own with no fill
   under it: Flow is a 44px bar like the others, filled to its figure, and the
   wave rides inside it between the name and the number. The seven
   decoherence hashes went with the same ruling and with round PC's "a solid
   bar of color": decoherence shares one bar with coherence now, rbPair below,
   and a hash row inside a pole would be a second drawing of the figure the
   pole already fills to. Where the shadow sits seat by seat is still the
   Decoherence reading's own list, and the wheel's.

   EVERY WORD CARRIES ITS MEANING, round PO. The one word on a bar is the
   carrier of its sentence, read off the meaning table (engine/data/gloss.js,
   the rail context) and never written here, so the tooltip, the screen
   reader's name and the gate all read the same sentence. */
var RB_IC={cq:'<path d="M3 9c3-3.5 6 3.5 9 0s6 3.5 9 0M3 15c3-3.5 6 3.5 9 0s6 3.5 9 0"/>',
 dq:'<path d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17M4.2 14.2h15.6"/>',
 rad:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1'
  +'M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'};
/* THE HALO AND THE PITCHFORK, round OT, his words: "benign malignant, I want a
   halo and a pitchfork." They are the compass's own two ends, GL_HALO and
   GL_FORK below, read when a bar is drawn and not when this file loads,
   because those two are declared further down it. One thing, one mark. A key
   that is already markup, a seat's or a pole's own glyph, is drawn as it is. */
function rbIcon(k){
 var d=(k&&k.charAt(0)==='<')?k:k==='halo'?'<path d="'+GL_HALO+'"/>':k==='fork'?'<path d="'+GL_FORK+'"/>'
  :(RB_IC[k]||(k&&QICON[k])||'');
 return d?'<svg class="rb-ic" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>':'';}
/* THE INK OVER AN ELEMENT'S COLOUR, by the colour's own luminance, the rule
   rbOn keeps for the ramp. A hex in, one of the same two inks out. */
function rbLum(hex){var h=String(hex||'').replace('#',''); if(h.length===3)h=h.replace(/(.)/g,'$1$1');
 var f=function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};
 return h.length===6?.2126*f(0)+.7152*f(2)+.0722*f(4):0;}
function rbOnHex(hex){return rbLum(hex)>.32?'#0B0D10':'#F6F4EF';}
/* ONE WORD AND ITS SENTENCE, read off the table. A word the table has no
   sentence for says nothing rather than a guess, and the gate calls it bare. */
function rbSay(word){return (typeof unpackOf==='function')?unpackOf(word,'rail'):'';}
/* the seven seats' passes, root first. Pass is flSeats().pass, and Flow is
   their product. */
function rbSeatPass(){var by={};
 flSeats().forEach(function(x){by[K2B[x.p.k]]=x.pass;});
 return BANDS.map(function(b){return Math.max(0,Math.min(1,by[b]===undefined?1:by[b]));});}
/* THE WAVE. x is root to crown, one picture of the chain. The base is a clean
   sine, two cycles, which spans the whole of zero to one: that is a healthy
   Flow, and with every seat passing everything it is all that is drawn. Two
   things take it off that. Each seat keeps only the share it passes, so the
   swing at a seat is the product of the passes up to and including it,
   which is the figure Flow prints by the time it reaches the crown. And each
   seat adds chop in proportion to what it holds back, 1 less its pass, at
   twice and then three times the wave's own frequency with a phase of its
   own, so a seat carrying a lot is rough where it sits and the ones either
   side of it are not. Nothing is random: the same person draws the same
   wave. Seven paths, one a seat, in the seat's own colour. */
var RB_WV={W:216,H:34,N:84};
function rbWavePts(pass){
 var W0=RB_WV.W,H0=RB_WV.H,N=RB_WV.N,cum=[],c=1,i;
 for(i=0;i<7;i++){c*=pass[i];cum.push(c);}
 var pts=[];
 for(i=0;i<=N;i++){var x=i/N*W0, f=i/N*7, s=Math.min(6,Math.floor(f)), u=f-s;
  var a0=s===0?1:cum[s-1], A=a0+(cum[s]-a0)*u;
  var ld=(1-pass[s]), ldp=s>0?(1-pass[s-1]):ld, ldn=s<6?(1-pass[s+1]):ld,
   L=u<.5?ldp+(ld-ldp)*(u+.5):ld+(ldn-ld)*(u-.5);
  var base=Math.sin(Math.PI*4*i/N),
   chop=L*(.55*Math.sin(Math.PI*2*(7*2.1)*i/N+s*1.9)+.3*Math.sin(Math.PI*2*(7*3.3)*i/N+s*.7));
  var y01=Math.max(0,Math.min(1,.5+.5*(A*base+chop)));
  pts.push([x,3+(H0-6)*(1-y01)]);}
 return {pts:pts,cum:cum};}
function rbWaveD(pass){
 var P=rbWavePts(pass), N=RB_WV.N, d=[];
 for(var s=0;s<7;s++){var a=Math.round(s*N/7), b=Math.round((s+1)*N/7), q='';
  for(var i=a;i<=b;i++)q+=(i===a?'M':'L')+P.pts[i][0].toFixed(1)+' '+P.pts[i][1].toFixed(1);
  d.push(q);}
 return {seg:d,all:P.pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(''),cum:P.cum};}
function rbWaveHtml(pass,rate){
 var D=rbWaveD(pass), W0=RB_WV.W, H0=RB_WV.H, bands='', segs='', i;
 for(i=0;i<7;i++){var col=seatCol(BANDS[i]);
  bands+='<rect x="'+(i*W0/7).toFixed(1)+'" y="0" width="'+(W0/7).toFixed(1)+'" height="'+H0+'" style="fill:'+col+'"/>';
  segs+='<path class="wv" d="'+D.seg[i]+'" style="stroke:'+col+'"/>';}
 var per=(2.8/Math.max(.4,rate||1)).toFixed(2), vals=[1].concat(D.cum).map(function(v){return Math.max(.12,v).toFixed(2);}).join(';');
 var bead=rbStill()?'':'<circle class="rb-bead" r="2.6" opacity="1"><animateMotion dur="'+per+'s" repeatCount="indefinite" path="'+D.all+'"/>'
  +'<animate attributeName="opacity" dur="'+per+'s" repeatCount="indefinite" values="'+vals+'" keyTimes="0;.143;.286;.429;.571;.714;.857;1"/></circle>';
 return '<span class="rb-wave" aria-hidden="true"><svg viewBox="0 0 '+W0+' '+H0+'" preserveAspectRatio="none">'
  +'<g class="wb">'+bands+'</g><path class="wm" d="M0 '+(H0/2)+'H'+W0+'"/>'+segs+bead+'</svg></span>';}
/* THE SPOKEN NAME. A bar is read once to a screen reader, the way it is seen:
   its word, its figure or that nothing is read yet, then the same sentence
   the tooltip carries, then what pressing it does. */
function rbAria(nm,raw,read,say,does){
 return nm+', '+(read&&raw&&raw!=='–'?raw:read?'zero':'not read yet')+'. '+(say?say+' ':'')+(does||'');}
function rbRow(q,nm,pct,raw,o){
 o=o||{};
 var p=Math.max(0,Math.min(100,+pct||0)), read=!o.unread, w=read?p.toFixed(2):'0';
 var cells='<span class="rb-n">'+rbIcon(o.ic)+esc(nm)+'</span><span class="rb-v">'+esc(raw)+'</span>';
 var pull=(read&&o.pull>0.003)?'<s class="rb-pull" style="width:'+(Math.min(1,o.pull)*100).toFixed(1)+'%"></s>':'';
 var cl=function(v){return Math.max(0,Math.min(1,+v||0));};
 var sv=null, inner='', cls='';
 if(o.wave&&o.wave.length===7){cls=' rb-wavein';
  if(read){sv=o.wave.map(cl); inner=rbWaveHtml(sv,o.rate);}
  else inner='<span class="rb-wave" aria-hidden="true"><svg viewBox="0 0 '+RB_WV.W+' '+RB_WV.H+'"><path class="wm" d="M0 '+(RB_WV.H/2)+'H'+RB_WV.W+'"/></svg></span>';}
 var c=read?(o.col||rbCol(p,o.bad)):'var(--dim)', on=read?(o.col?rbOnHex(o.col):rbOn(p,o.bad)):'var(--ink)';
 return '<button type="button" class="kb rbar'+cls+(read?'':' off')+'" data-q="'+q+'" data-w="'+p.toFixed(2)+'"'
  +(o.fk?' data-fk="'+o.fk+'"':'')+(o.bad?' data-bad="1"':'')
  +(sv?' data-s="'+sv.map(function(v){return v.toFixed(3);}).join(',')+'"':'')
  +' style="--c:'+c+';--on:'+on+';--w:'+w+'%"'
  +(o.title?' data-tip-k="'+esc(nm)+'" data-tip="'+esc(o.title)+'"':'')
  +' aria-label="'+esc(rbAria(nm,raw,read,o.title,'Opens the reading.'))+'">'
  +'<span class="rb-t" aria-hidden="true"><i style="width:'+w+'%">'+pull+'</i><em class="rb-h"></em></span>'
  +inner
  +'<span class="rb-d" aria-hidden="true"></span>'
  +'<span class="rb-row">'+cells+'</span>'
  +'<span class="rb-row rb-over" aria-hidden="true">'+cells+'</span></button>';}
/* THE BARS RUN AT THE FIELD'S OWN RATE. pulseRate in ui/wheel.js is the one
   clock every thread on the Field runs on, and it is the Shadow layer's: DQ
   sets how fast. A bar's light sweeps at that rate, so a person carrying more
   shadow sees the rail run faster, and a record with none sees it steady.
   The shadow's own breath used to be a CSS swing on the decoherence row; the
   row is half of the CQ and DQ pair since round RB, and the breath is the
   swing of its edge (rbPair). One custom property on the dock, written when a
   reading is and never per frame. */
function rbRate(r){
 var d=document.getElementById('fdock'); if(!d)return;
 var dq=clamp((+(r&&r.DQ)||0)/100,0,1);
 d.style.setProperty('--rate',lerp(PUL_LO,PUL_HI,dq).toFixed(3));}
/* ============================================================
   WHAT A BAR DOES, ONE LANGUAGE. Three verbs and no others, every one of them
   an opacity or a transform except the fill's own width, which the gate reads
   and which therefore keeps its tween, ENTER_SPAN on the wheel's cubic out.

     arrive   the first time the rail is seen, once per session: each row
              slides 10px in from the left and fades over 260ms, on the
              wheel's own ENTER_STAGGER, as its fill sweeps from empty.
     rest     a light travels the fill at the Field's rate. CSS, nothing in a
              frame. The pairs' edges swing on the Field's clock (rbPair).
     move     a reading that changes. The fill tweens. A head, the fill's
              leading edge, throws past it on a rise and settles, and on a fall
              just follows, so a gain has energy and a loss has weight. A
              hairline stays where the fill stood and fades over 2.4s, and a
              chip says by how much for the same 2.4s. A second change inside
              the window adds to the first, so a drag reads as one total.

   A profile arriving is not an edit: switching person moves every bar to a
   stranger's figure, so the fills sweep and the heads throw but no chip says
   +31 over somebody else's reading, and no hairline marks a place the person
   never stood. Under reduced motion, Quiet and Rm the figure is written in
   the frame the render lands in, and the chip still prints for 2.4s and
   clears, with no slide, the way a status does.

   THE TICK IS THE FIELD'S. rbTick runs inside loop() in ui/ui.js and writes
   nothing at all when no bar is moving, so a still rail costs the page no
   script. The single rows each own a record, RBMO, keyed by host and position
   because the markup is rewritten on every render and the record has to
   outlive the element it is painted on.
   ============================================================ */
var RBMO={}, RB_LIVE=false, RB_WHO=null;
var RB_ENTER=260, RB_HEAD=700, RB_CHIP=2400, RB_GHOST=2400;
function rbStill(){var c=document.body.classList;return !!REDUCED||c.contains('quiet')||c.contains('rm');}
function rbE3(x){return x<=0?0:x>=1?1:1-Math.pow(1-x,3);}
/* WHAT CHANGED, SAID ONCE AND LET GO. The hairline where the fill stood and
   the chip are CSS animations on a negative delay, set by the time already
   spent, so a rewrite of the markup mid fade continues them and does not
   restart them. */
function rbGhost(el,m,now){
 if(REDUCED||!m||!m.gt||now-m.gt>=RB_GHOST)return;
 el.style.setProperty('--gw',m.gw.toFixed(2)+'%');
 el.style.setProperty('--gd',(-(now-m.gt)).toFixed(0)+'ms');
 el.classList.add('rb-gh');}
function rbChip(el,m,now){
 if(!m||!m.chip||now-m.ct>=RB_CHIP)return;
 var d=el.querySelector('.rb-d'); if(!d)return;
 var age=now-m.ct;
 d.textContent=m.chip; d.className='rb-d on'+(m.chipBad?' bad':'');
 if(rbStill()){
  /* prefers-reduced-motion turns every CSS animation off at the root, so a chip
     that is cleared by one would never print: it is held lit by its class and
     put away by a timer, once, at the 2.4s every chip lives for */
  d.classList.add('st');
  if(m.ctm!==m.ct){m.ctm=m.ct; setTimeout(function(){
   [].forEach.call(document.querySelectorAll('#fdock .rb-d.st'),function(e){e.className='rb-d';});},Math.max(0,RB_CHIP-age));}}
 else d.style.setProperty('--cd',(-age).toFixed(0)+'ms');}
function rbSeatsOf(el){var s=el.getAttribute('data-s'); return s?s.split(',').map(parseFloat):null;}
function rbFx(m,el,f,now){
 if(m.still)return;
 var k=now-m.t0;
 if(m.first){var ee=rbE3(k/RB_ENTER);
  el.style.opacity=ee<1?ee.toFixed(3):''; el.style.transform=ee<1?'translateX('+(-10*(1-ee)).toFixed(2)+'px)':'';}
 var hd=el.querySelector('.rb-h'); if(!hd||!m.tw)return;
 var a=0, x=f*m.tw/100;
 if(m.dir&&k>=0&&k<RB_HEAD&&m.w1>.2){
  /* a rise overshoots by an eighth of the move, three pixels at least and
     eight at most, on a spring that is settled inside the head's own 700ms */
  if(m.dir>0){var amp=Math.max(3,Math.min(8,Math.abs(m.w1-m.w0)*m.tw/100*.12)), ts=k/1000;
   x+=amp*Math.sin(24*ts)*Math.exp(-7*ts);}
  a=1-rbE3(k/RB_HEAD);}
 hd.style.transform='translateX('+Math.max(0,Math.min(m.tw,x)).toFixed(2)+'px)';
 hd.style.opacity=a.toFixed(3);}
function rbPaint(m,now){
 var h=document.getElementById(m.host), el=h?h.querySelectorAll('.rbar')[m.j]:null; if(!el)return;
 var e=crMoAt(m,now), f=m.w0+(m.w1-m.w0)*e, i=el.querySelector('.rb-t i'), w=f.toFixed(2)+'%';
 if(i)i.style.width=w;
 el.style.setProperty('--w',w);
 if(m.n0!==null&&m.n1!==null){var txt=(m.n0+(m.n1-m.n0)*e).toFixed(m.dp)+m.suf;
  el.querySelectorAll('.rb-v').forEach(function(pv){pv.textContent=txt;});}
 if(m.s1){
  /* the wave is redrawn between the old passes and the new on the row's own
     ease, and its bead waits until it has settled */
  var wv=el.querySelector('.rb-wave');
  if(wv&&m.s0&&m.s1!==m.s0){
   var ps=m.s1.map(function(v,q){return m.s0[q]+(v-m.s0[q])*e;}), D=rbWaveD(ps), segs=wv.querySelectorAll('path.wv');
   for(var z=0;z<segs.length&&z<7;z++)segs[z].setAttribute('d',D.seg[z]);
   var bd=wv.querySelector('.rb-bead'); if(bd)bd.style.opacity=e<1?'0':'';}}
 rbFx(m,el,f,now);}
function rbTick(now){
 var live=false;
 Object.keys(RBMO).forEach(function(k){var m=RBMO[k]; if(m.done)return;
  rbPaint(m,now); if(now<m.t0+m.span)live=true; else m.done=true;});
 RB_LIVE=live;}
function rbMotion(hosts){
 var now=performance.now(), fresh=[], still=rbStill();
 var who=((typeof CURP!=='undefined'&&CURP&&CURP.id)||'')+':'+S.who, arrival=(who!==RB_WHO); RB_WHO=who;
 hosts.forEach(function(h){
  if(!h)return;
  h.querySelectorAll('.rbar').forEach(function(el,j){
   /* read off the row and not its host, as crMotion does: #key takes no box
      of its own in the dock */
   if(!el.offsetParent)return;
   var key=h.id+':'+j, m=RBMO[key], off=el.classList.contains('off'),
    to=off?0:(parseFloat(el.getAttribute('data-w'))||0),
    pv=el.querySelector('.rb-v'), num=crMoNum(pv?pv.textContent:''), n1=num?num.n:null,
    tt=el.querySelector('.rb-t'), sv=rbSeatsOf(el);
   if(m&&Math.abs(m.w1-to)<.05&&m.n1===n1){
    m.tw=tt?tt.offsetWidth:0; m.s1=sv;
    if(!m.done)rbPaint(m,now);
    rbGhost(el,m,now); rbChip(el,m,now); return;}
   var nm={host:h.id,j:j,w1:to,n1:n1,dp:num?num.dp:0,suf:num?num.suf:'',dur:ENTER_SPAN,span:ENTER_SPAN,
    t0:now,done:false,tw:tt?tt.offsetWidth:0,bad:el.hasAttribute('data-bad'),dir:0,first:false,still:still,
    s0:sv,s1:sv,chip:'',ct:0,chipBad:false,dsum:0};
   if(still){nm.w0=to;nm.n0=n1;nm.done=true;}
   else if(!m){nm.w0=0;nm.n0=n1===null?null:0;nm.first=true;nm.dir=1;nm.s0=sv?(el.querySelector('.rb-wave')?sv:sv.map(function(){return 0;})):null;
    nm.span=Math.max(ENTER_SPAN,RB_HEAD,RB_ENTER);
    fresh.push({m:nm,r:el.getBoundingClientRect()});}
   else{
    /* from wherever the last one had got to, so a second change mid sweep
       turns rather than jumping back to where the first began */
    var e=crMoAt(m,now);nm.w0=m.w0+(m.w1-m.w0)*e;
    nm.n0=(m.n0!==null&&m.n1!==null&&n1!==null&&m.suf===nm.suf)?m.n0+(m.n1-m.n0)*e:null;
    if(m.s1&&sv&&m.s1.length===sv.length)nm.s0=m.s0.map(function(v,q){return v+(m.s1[q]-v)*e;});
    nm.dir=to>m.w1+.05?1:to<m.w1-.05?-1:0;
    nm.span=Math.max(ENTER_SPAN,nm.dir?RB_HEAD:0);}
   /* a figure that moved, and not the first sight of one and not a different
      person's, says so */
   if(m&&!arrival){
    if(Math.abs(m.w1-to)>=.5){nm.gt=now;nm.gw=m.w1;}
    else if(m.gt){nm.gt=m.gt;nm.gw=m.gw;}
    if(n1!==null&&m.n1!==null&&n1!==m.n1){
     var d=n1-m.n1, up=(now-m.ct<RB_CHIP)&&m.chip&&((m.dsum>0)===(d>0));
     nm.dsum=up?m.dsum+d:d;
     var txt=Math.abs(nm.dsum).toFixed(nm.dp);
     if(+txt>0){nm.chip=(nm.dsum>0?'+':'−')+txt;nm.ct=now;nm.chipBad=nm.bad&&nm.dsum>0;}}
    else if(m.chip&&now-m.ct<RB_CHIP){nm.chip=m.chip;nm.ct=m.ct;nm.chipBad=m.chipBad;nm.dsum=m.dsum;}}
   RBMO[key]=nm; rbPaint(nm,now); rbGhost(el,nm,now); rbChip(el,nm,now);});});
 fresh.sort(function(a,b){return a.r.top-b.r.top;});
 function go(){var t=performance.now();
  fresh.forEach(function(f,i){f.m.t0=t+Math.min(i,8)*ENTER_STAGGER; rbPaint(f.m,t);});
  if(Object.keys(RBMO).some(function(k){return !RBMO[k].done;}))RB_LIVE=true;}
 /* under the sheet the bars hold empty, and the sweep starts as it clears */
 if(fresh.length&&!isBooted()){
  fresh.forEach(function(f){f.m.t0=Infinity; rbPaint(f.m,now);});
  afterBoot(go);}
 else go();
}
/* ============================================================
   TWO FIELDS ON ONE BAR, ported from round RB onto this line in the P3 menu
   pass. His words, round RB: "Coherence, decoherence is CQ and DQ is on the
   same bar. As opposing colors with the termination gradient as the
   oscillating the numbers that the user oscillates. That's the same mechanic
   for CQDQ. It's the same mechanic for orientation. That's the same mechanic
   for benign and malignant. It's data driven. And those are opposing fields
   that need to be balanced." Round PC before it: "a solid bar of color with
   two opposing colors and an oscillating termination point." Round OX: "let
   a gradient drive that. And let the boundary be the oscillation range."

   ONE COMPONENT. rbPair draws every pair on the rail, and it is rbRow's
   shell: the same 44px height, the same track, the same radius and inset
   edge, the same 12px inset for the words, the same marks. A pole is a
   colour pressing in from its own end of the bar, with its mark, its one
   word and its figure inside the bar at that end. Where the colour stops it
   does not stop on a line: it fades over the stretch the reading swings
   through, and the edge travels that stretch, so the termination is the
   oscillation the owner asked to see, and the width of the fade is the
   range, which is his "let the boundary be the oscillation range". A notch at
   the top and the foot stays where the figure is now, so the number printed
   and the place it is drawn are one place.

   TWO SHAPES OF PAIR, ONE DRAWING.
     whole   the two poles are shares of one whole and meet at one point:
             benign against malignant, masculine against feminine. The two
             colours cross fade over the swing.
     apart   the two poles are separate figures out of 100 each: CQ and DQ.
             DQ is not 100 less CQ (engine/compute.js, ruled), so each colour
             runs in from its own end to its own figure, the stretch between
             them is the bare track, and where they overlap both colours are
             laid down, which is a field contested. A bar that forced the two
             to meet would draw a figure the engine does not compute.

   WHAT SWINGS, AND WHY IT IS NOT INVENTED. Every swing is a figure the Field
   already moves by, on the Field's own clock, S.t:
     CQ          cqRange (ui/personas.js), the band coherence wanders in, the
                 one the compass marker beside the wheel already rides, on the
                 same drift (rbDrift), so the rail and the marker swing as one.
     DQ          the shadow's own breath, PUL_WAVE times DQ at PUL_WAVE_HZ, the
                 swing the wheel's pulses already breathe by (ui/wheel.js,
                 pulseRate). A light shadow barely moves; a heavy one surges.
     orientation the field's half of the lean is a function of coherence, so
                 it swings as coherence does, through the same drift, scaled by
                 the share the field holds against the story (leanRead's own
                 trust). A coherence that never dips under fifty never leans
                 the field malignant, and that pole holds still.
     balance     nothing in the engine moves it between readings, so it holds
                 still. A swing with no number under it would be decoration.

   THE WORDS. Each pole's word is one word, the rail's own, and its sentence is
   the meaning table's (rbSay). A pole that is its own reading is its own
   door, half the bar each, and carries its word, its sentence and its spoken
   name on that half. A pair that is one reading, orientation or balance, is
   carried by its host, which says the pair's sentence and both poles'. A
   zero is a dash, the house's rule for a figure (V8 in the voice skill), and
   is spoken as zero.

   COST. The fills and the notches are transforms on layers of their own,
   written in pixels at half pixel steps, so a frame of swing is three
   compositor moves and no paint. The widths of the fades are written when a
   reading is, never per frame. rbPairTick runs in the Field's loop and only
   while the rail is open.

   STILL. Reduced motion, Quiet and Rm get the figures where they are: no
   sweep in, no swing, the fades at their widths.
   ============================================================ */
var RB2={}, RB2_ON=false, RB2_MINF=0.5;
/* the compass marker's own wander, lifted so the two are one function */
function rbDrift(t){return Math.sin(t*0.55)*0.62+Math.sin(t*0.23+1.1)*0.38;}
/* a figure as the bar prints it: a whole percent, and a zero is a dash */
function rbPct(v){var n=Math.round(+v||0); return n>0?n+'%':'–';}
function rbPair(k,o){
 var L=o.L, R=o.R, read=!!o.read;
 function pole(P,side){
  var x='<span class="rb2-x"><span class="rb2-n">'+esc(P.nm)+'</span><b class="rb2-v">'+(read?esc(rbPct(P.v)):'–')+'</b></span>';
  return '<span class="rb2-p '+side+'" style="--pc:'+P.c+'" aria-hidden="true">'+(side==='l'?rbIcon(P.ic)+x:x+rbIcon(P.ic))+'</span>';}
 /* a pole with its own reading is its own door, half the bar each, both at
    the 44px floor; a pair that is one reading is pressed as one, by its host */
 function key(P,side){
  if(!P.q)return '';
  var say=(rbSay(P.nm)+(P.note?' '+P.note:'')).trim();
  return '<button type="button" class="kb rb2-k '+side+'" data-q="'+P.q+'"'
   +(P.fk?' data-fk="'+P.fk+'"':'')+' style="--pc:'+P.c+'"'
   +' data-tip-k="'+esc(P.nm)+'" data-tip="'+esc(say)+'"'
   +' aria-label="'+esc(rbAria(P.nm,read?rbPct(P.v):'–',read,say,'Opens the reading.'))+'"></button>';}
 return '<span class="rb2'+(read?'':' off')+(o.whole?' whole':'')+'" data-pair="'+k+'" style="--lc:'+L.c+';--rc:'+R.c+'">'
  +'<span class="rb2-t" aria-hidden="true"><i class="rb2-l"></i><i class="rb2-r"></i>'
  +'<em class="rb2-now l"></em>'+(o.whole?'':'<em class="rb2-now r"></em>')+'</span>'
  +pole(L,'l')+pole(R,'r')+key(L,'l')+key(R,'r')+'</span>';}
/* WHAT A HOST CARRIES for a pair that is one reading: its own sentence, then
   each pole's word and sentence, then the lean in words, never as a score.
   The same string is the tooltip's body and, with the figures said first, the
   spoken name. */
function rbPairSays(pairWord,o,lean){
 var s=[rbSay(pairWord),rbSay(o.L.nm),rbSay(o.R.nm)].filter(Boolean).join(' ');
 return (s+(lean?' '+lean:'')).trim();}
function rbPairAria(pairWord,o,say,does){
 var f=function(P){return P.nm+' '+(o.read?(Math.round(+P.v||0)>0?Math.round(P.v)+' per cent':'zero'):'not read yet');};
 return pairWord+'. '+f(o.L)+', '+f(o.R)+'. '+say+(does?' '+does:'');}
/* a reading arrives. o is rbPair's own spec, with each pole's v, its swing
   sw(t) as an offset from v in the same units, and fw, the width that swing
   covers. Called by render() for each pair it writes. */
function rbPairSet(k,o){
 var m=RB2[k], now=performance.now(), still=rbStill();
 var lv=o.read?clamp(+o.L.v||0,0,100):0, rv=o.read?clamp(o.whole?100-lv:(+o.R.v||0),0,100):0;
 if(!m){RB2[k]=m={k:k,seen:false,l0:0,l1:lv,r0:0,r1:rv,t0:now,dur:ENTER_SPAN,last:{}};}
 else if(Math.abs(m.l1-lv)>.05||Math.abs(m.r1-rv)>.05){
  /* from wherever it had got to, so a second change mid sweep turns */
  var e=rbE3((now-m.t0)/m.dur);
  m.l0=m.l0+(m.l1-m.l0)*e; m.r0=m.r0+(m.r1-m.r0)*e; m.l1=lv; m.r1=rv; m.t0=now;
  if(still||!m.seen){m.l0=lv;m.r0=rv;}}
 m.o=o; m.read=!!o.read; m.whole=!!o.whole;}
/* where each element of the bar goes, and which figures it prints. Writes
   nothing that has not moved half a pixel. */
function rbPairPaint(m,now){
 var el=m.el; if(!el)return;
 var e=rbE3((now-m.t0)/m.dur), lv=m.l0+(m.l1-m.l0)*e, rv=m.r0+(m.r1-m.r0)*e;
 /* the figures count with the sweep and are written once more as it lands,
    so what the bar says is the reading and never a frame on the way to it */
 if(m.read&&(e<1||m.last.txt!==e)){m.last.txt=e; var vs=el.querySelectorAll('.rb2-v');
  if(vs[0])vs[0].textContent=rbPct(e<1?lv:m.o.L.v); if(vs[1])vs[1].textContent=rbPct(e<1?rv:(m.whole?100-m.o.L.v:m.o.R.v));}
 if(!m.read)return;
 var o=m.o, still=rbStill(), t=S.t;
 var sl=(!still&&o.L.sw)?o.L.sw(t):0, sr=(!still&&o.R.sw)?o.R.sw(t):0;
 /* a whole pair has one meeting point, so its right pole follows the left's
    swing; each still sweeps in from its own end on first sight */
 var pl=clamp(lv+sl,0,100), pr=clamp(100-rv+(m.whole?sl:-sr),0,100);
 var W0=m.wpx||0, px=function(v){return Math.round(v*W0/100*2)/2;};
 var put=function(sel,key,x){var v=px(x); if(m.last[key]===v)return; m.last[key]=v;
  var n=el.querySelector(sel); if(n)n.style.transform='translate3d('+v+'px,0,0)';};
 put('.rb2-l','l',pl+m.fl/2-100);
 put('.rb2-r','r',pr-m.fr/2);
 put('.rb2-now.l','tl',lv);
 if(!m.whole)put('.rb2-now.r','tr',100-rv);}
/* the rail's pairs found again after a render or the column opening: each
   one takes its element, its width and its fades, and the first sight of
   each sweeps in from its own ends, one after the other in reading order */
function rbPairs(){
 var now=performance.now(), still=rbStill(), dock=document.getElementById('fdock');
 RB2_ON=!!(dock&&dock.offsetParent&&S.tab===TAB.FIELD);
 var rows=dock?[].slice.call(dock.querySelectorAll('.rbar,.rb2')).filter(function(x){return x.offsetParent;}):[];
 rows.sort(function(a,b){return a.getBoundingClientRect().top-b.getBoundingClientRect().top;});
 Object.keys(RB2).forEach(function(k){var m=RB2[k];
  var el=dock?dock.querySelector('.rb2[data-pair="'+k+'"]'):null;
  if(!el||!el.offsetParent){m.el=null;return;}
  if(m.el!==el){m.el=el; m.last={};}
  m.wpx=el.offsetWidth;
  var o=m.o;
  m.fl=Math.max(RB2_MINF,(o.L.fw||0)); m.fr=m.whole?m.fl:Math.max(RB2_MINF,(o.R.fw||0));
  el.style.setProperty('--fl',(m.fl*m.wpx/100).toFixed(1)+'px');
  el.style.setProperty('--fr',(m.fr*m.wpx/100).toFixed(1)+'px');
  if(!m.seen){m.seen=true;
   if(still||!m.read){m.l0=m.l1;m.r0=m.r1;m.t0=now;}
   else{var i=Math.max(0,rows.indexOf(el));
    m.l0=0; m.r0=0; m.dur=ENTER_SPAN;
    if(isBooted())m.t0=now+Math.min(i,8)*ENTER_STAGGER;
    else{m.t0=Infinity; afterBoot(function(){m.t0=performance.now()+Math.min(i,8)*ENTER_STAGGER;});}}}
  rbPairPaint(m,isFinite(m.t0)?now:-1);});}
function rbPairTick(now){
 if(!RB2_ON)return;
 for(var k in RB2){var m=RB2[k]; if(m.el)rbPairPaint(m,now);}}
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
/* WHETHER NOTHING HAS BEEN READ, asked of the engine and never typed. Surfaces
   that print a figure ask it before they do, and a figure printed off the seed
   is a figure about the seed. Round J13. */
function unreadNow(){try{return !!compute().unread;}catch(e){return false;}}
/* an address, a saboteur or a seat, rendered as one object */
function crNode(n,size,o){o=o||{};
 return cr(n.b, n.sq*10, Object.assign({size:size||'sm', raw:n.sq.toFixed(1),
  label:n.k, title:n.k+', '+n.b.toLowerCase()+' seat. '+(n.sq>0?n.sq.toFixed(1)+' left after the opposite':'Nothing held.')},o));}
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
 /* o.em and o.ink let a caller say something else at the right of the row,
    the Reading's direction word and seat name in round IT, without a third
    copy of this markup. Every caller that passes neither is unchanged. */
 /* o.ana, round RB: the row also carries the Analytics trail's key, and the
    trail's own handler opens it inside the trail (ui/analytics.js). The
    address handler in ui.js leaves a row carrying it alone. */
 return '<button type="button" class="ad-r" data-addr="'+n.i+'" '
  +(o.ana?'data-ana="addr|'+n.i+'" ':'')
  +'title="Open '+esc(n.k)+'">'+crbNode(n,'sm')
  +'<span>'+esc(n.k)+'</span><em'+(o.ink?' style="color:'+o.ink+'"':'')+'>'
  /* ROUND PO. When the right of the row is a seat, the seat says what it is. */
  +(function(t){return (typeof BANDS!=='undefined'&&BANDS.indexOf(t)>=0)?unp(String(t).toLowerCase(),t,'seat'):esc(t);}(
   o.em!=null?o.em:(opp||n.b)))+'</em></button>';}
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
 var val=(o.raw!=null)?o.raw:(Math.round(p)>0?Math.round(p)+'%':'\u2013');
 /* A ZERO IS A DASH, ruled in COPY.md under Value and said again on 2 October:
    "the hardest carrying zero percent. I don't want that." Every figure this
    component prints passes through here, so a ring that reads nought prints the
    dash and its title says so, and no caller has to remember. Round J13. */
 if(/^0(?:\.0+)?%?$/.test(String(val)))val='\u2013';
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
  title:n.k+', '+n.b.toLowerCase()+' seat. '+(n.sq>0?n.sq.toFixed(1)+' left after the opposite':'Nothing held.')},o));}
function crPat(p,size,o){o=o||{};
 var lv=leaves(p), b=(lv[0]||{}).b||'Heart';
 return cr(b, p.w*10, Object.assign({size:size||'md', raw:p.w.toFixed(1), label:p.nm,
  hot:p.w>=9||!!p.over,
  title:p.nm+', weight '+p.w.toFixed(1)+(p.over?', overshot':'')},o));}
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
/* where the outermost thing drawn sits, and the margin kept past it. It was
   1.20 and 30: the outermost LABEL, nineteen domain names radiating past the
   Blueprint ring to 1.2 of the unit. Nothing runs past its ring now, ruled 26
   September, so the outermost thing is that ring itself at 0.93, and the
   room the names were reserved goes back to the picture: the wheel draws
   about a third larger in the same box at 1600, and its silhouette at the
   Patterns depth lands within a few pixels of where the names used to end. */
const LBL_R=0.95, LBL_M=10;
/* what sits over the canvas and therefore bounds the wheel. Accuracy left
   this list when it left the stage's foot for the left rail, ED in TASKS.md,
   because a readout that no longer sits over the canvas has no business
   taking radius from it. It is back, round LR, because it is back on the
   stage in the lower left, and reframe() below measures it by id like the
   rest: the nearest corner of its box to the canvas centre caps the radius,
   and a box the circle cannot reach costs nothing, which is the wide stage. */
const OVERLAY=['tl','bal','howto','acc','railtop'];
const hx=h=>{const n=parseInt(String(h).slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+(+a).toFixed(3)+')';
const mixc=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const lerp=(a,b,t)=>a+(b-a)*t;
/* GLASS WHITE PAINTS ITS RENDER GROUND LIGHT and this said dark, so the
   wheel and the compass drew Dark's ink, halo, palette and wash onto
   #F2F1EC. Measured on the Field with Gordon loaded: ink 1.14 to 1 against
   its own ground, seat names 1.62 at worst, the accent 2.10. The whole
   canvas moves together, which is why it is this line and not a Glass white
   arm in bc() alone: bc() without the halo put dark names in a dark outline.
   SNOW IS NOT WHAT THIS SAYS. Its Field, Body and Compass keep the ruled
   #101010, so this answers light over a black ground there, and the wheel's
   ink reads 1.06 to 1 on Snow, carried by the halo. That is Snow's own
   question and is left as shipped. Anything that must match the ground and
   not the lighting reads stageLight() below, as rings.js does. */
const LIGHT=()=>S.theme==='snow'||S.theme==='glasswhite';
/* what the Field's canvas actually sits on, read off the stage the way
   frMount in rings.js reads it. The stage carries no transition, so the
   answer is settled the moment the lighting's class lands. */
function stageLight(){
 var st=document.getElementById('stage'),m=st&&/rgba?\(([^)]+)\)/.exec(getComputedStyle(st).backgroundColor);
 var c=m?m[1].split(',').map(parseFloat):[16,16,16];
 return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.5;}
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
   announcement behave the same way wherever they come from.

   THE MESSAGE DOCK, 2 October. A message printed in a line under the secondary
   navigation, which the owner had already asked to move: "it popped that up in
   a command line just underneath this secondary navigation, which I asked
   earlier to move command output errors down to a bottom navigation. Have it
   spit out that information to a log, and maybe have that only show for three
   seconds unless the person presses a button to keep it up longer." So every
   message, a confirmation or a failure, shows in the dock at the bottom for
   three seconds and fades, unless Keep is pressed or the words are tapped. A
   failure used to hold on screen until something replaced it, which was the
   rule that a refusal must not vanish. It still must not, and it does not:
   every message is in MSG_LOG, the last fifty of this session, behind the Log
   button and the profile menu, and a failure raises the red count on Log until
   the log has been opened. The failure is reported twice, in the dock and in
   the log, and swallowed by neither.

   #status is still the one region with role=status, so a screen reader hears
   the message when it is written whether or not anyone is looking at the dock,
   and the text sits in it until the fade has finished. */
var _stT=null, _stF=null, MSG_LOG=[], MSG_MAX=50, MSG_SHOW_MS=3000, MSG_FADE_MS=260,
 MSG_KEPT=false, MSG_UNSEEN=0;
function msgPaint(){
 var d=document.getElementById('msgdock'), k=document.getElementById('msgkeep'),
  b=document.getElementById('msgbadge');
 if(d){ d.classList.add('on'); d.classList.remove('out'); }
 if(k){ k.setAttribute('aria-pressed',String(MSG_KEPT)); k.textContent=MSG_KEPT?'Dismiss':'Keep'; }
 if(b){ b.hidden=!MSG_UNSEEN; b.textContent=MSG_UNSEEN>9?'9+':String(MSG_UNSEEN); }}
function msgHide(){
 clearTimeout(_stT); clearTimeout(_stF); MSG_KEPT=false;
 var d=document.getElementById('msgdock'), e=document.getElementById('status');
 if(e){ e.textContent=''; e.removeAttribute('data-kind'); }
 if(d){ d.classList.remove('on'); d.classList.remove('out'); }}
/* three seconds on screen, then the fade, then the words are cleared, unless
   the person has taken hold of it. Keep is per message: a new message replaces
   the kept one and starts its own three seconds, because a kept message that
   silently held back every later one would be the failure this file forbids. */
function msgArm(){
 clearTimeout(_stT); clearTimeout(_stF);
 if(MSG_KEPT)return;
 _stT=setTimeout(function(){
  var d=document.getElementById('msgdock'); if(d)d.classList.add('out');
  _stF=setTimeout(msgHide,MSG_FADE_MS);},MSG_SHOW_MS);}
function msgKeep(){
 var d=document.getElementById('msgdock'); if(!d||!d.classList.contains('on'))return;
 MSG_KEPT=!MSG_KEPT;
 if(!MSG_KEPT){ msgHide(); return; }
 clearTimeout(_stT); clearTimeout(_stF); msgPaint();}
function status(msg,kind){
 var e=document.getElementById('status'); if(!e)return;
 clearTimeout(_stT); clearTimeout(_stF); MSG_KEPT=false;
 e.textContent=msg||'';
 /* every refusal the product writes is heard here, once, and not at each of
    its call sites. ui/sound.js: off until turned on */
 if(kind==='fail'&&typeof sfx==='function')sfx('refuse');
 if(kind)e.setAttribute('data-kind',kind); else e.removeAttribute('data-kind');
 if(!msg){ msgHide(); return; }
 MSG_LOG.push({t:Date.now(), msg:String(msg), kind:kind||''});
 if(MSG_LOG.length>MSG_MAX)MSG_LOG.shift();
 if(kind==='fail')MSG_UNSEEN++;
 msgPaint(); msgArm();
 if(typeof msgLogOpen==='function'&&msgLogIsOpen())msgLogDraw();}
/* THE LOG SHEET. Last fifty, oldest first so the newest is at the bottom the
   way a log reads, drawn fresh each time it opens and again while it is open
   when a message lands. Times are the person's own clock. A failure carries
   the word as well as the colour, because a red line alone says nothing to
   a person who cannot see red. */
function msgLogIsOpen(){ var l=document.getElementById('msglog'); return !!l&&!l.hidden; }
function msgLogDraw(){
 var l=document.getElementById('msglog'); if(!l)return;
 var pad=function(n){return (n<10?'0':'')+n;};
 l.innerHTML='<div class="msglog-h"><span>Messages, this session</span>'
  +'<button type="button" class="msg-b" id="msglogx" aria-label="Close">'
  +'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" '
  +'stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></div>'
  +'<ul class="msglog-b" id="msglogb">'
  +(MSG_LOG.length?MSG_LOG.map(function(m){var t=new Date(m.t);
    return '<li'+(m.kind?' data-kind="'+m.kind+'"':'')+'><time>'+pad(t.getHours())+':'+pad(t.getMinutes())+':'+pad(t.getSeconds())
     +'</time><span>'+(m.kind==='fail'?'Failed. ':'')+esc(m.msg)+'</span></li>';}).join('')
   :'<li class="msglog-e">Nothing has been said yet.</li>')
  +'</ul>';
 var x=document.getElementById('msglogx'); if(x)x.onclick=msgLogShut;
 var bd=document.getElementById('msglogb'); if(bd)bd.scrollTop=bd.scrollHeight;}
function msgLogOpen(){
 var l=document.getElementById('msglog'); if(!l)return;
 MSG_UNSEEN=0; msgPaint();
 /* the dock steps aside while the log is up, and the log's own list holds
    the message that was in it */
 var d=document.getElementById('msgdock'); if(d)d.classList.remove('on');
 clearTimeout(_stT); clearTimeout(_stF);
 var e=document.getElementById('status'); if(e){ e.textContent=''; e.removeAttribute('data-kind'); }
 l.hidden=false; msgLogDraw();
 var x=document.getElementById('msglogx'); if(x)x.focus();}
function msgLogShut(){
 var l=document.getElementById('msglog'); if(!l)return;
 l.hidden=true; l.innerHTML='';
 var b=document.getElementById('msglogbtn'); if(b&&b.offsetParent)b.focus();}
/* wired once. The words are a button for a pointer, because Keep is a small
   target and the owner said a tap on the message is enough. */
(function(){
 var k=document.getElementById('msgkeep'), b=document.getElementById('msglogbtn'),
  e=document.getElementById('status');
 if(k)k.addEventListener('click',msgKeep);
 if(e)e.addEventListener('click',function(){ if(!MSG_KEPT)msgKeep(); });
 if(b)b.addEventListener('click',msgLogOpen);
 document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape'&&msgLogIsOpen()){ msgLogShut(); ev.stopPropagation(); }},true);
}());
/* saving is the case that was lying, so it gets its own wording */
function statusSaved(){
 var st=(typeof saveState==='function')?saveState():{ok:true};
 if(st.ok)status('Saved.');
 /* A REFUSAL NAMES ITS OWN REASON. One message for every failure said storage
    was full or blocked, which is the wrong sentence for a save onto a worked
    example: nothing is wrong with the browser and there is something the person
    can do. The words follow the release's refusal, which is the same crossing
    answered the same way. */
 /* and they still follow it: one line since BA9, 25 September, when he struck
    the long form above the Field. The profile picker carries the state. */
 else if(st.err==='NotARecord')
  status('Nothing saved on a worked example.','fail');
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

    Two things bounded it and neither was being asked. The labels ran outward
    past the rings, furthest at the blueprint depth where nineteen domain names
    radiated to 1.2 of the unit radius, so a rule that stopped at the canvas
    edge put 3rd Eye and Knowledge half off it. They are inside their rings
    now, so the bound is the outermost ring, LBL_R above. And the readouts parked in the
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
/* ============================================================
   THE WORDS COME IN WITH THE ZOOM. FJ in TASKS.md, his words: "I shouldn't
   see text when I'm zoomed all the way out. Text only fades in when I'm
   zooming in."

   One curve for all three pictures, read off the zoom each already keeps,
   S.zoom on the wheel and FZ.s on Frames and Dial, and never off a clock:
   hold the zoom still and the words hold still with it. At the whole
   picture, 1x, the answer is 0 and nothing is set at all, not set faint.
   The first notch of the scroll wheel, 1.12x, still reads 0, so a person
   who nudges the wheel by accident gets no flash of type. From there it
   rises on a smoothstep to full strength at 1.75x, five notches in: slow in
   off the floor so the first letters arrive as a tint rather than a switch,
   and slow out into full so the last notch does not snap either.

   FIGURES ARE NOT WORDS. The number at the core and the percent in each
   gate's pill stay at every zoom. The core figure is his own reversal, "what
   happened to my CQ number at the centre of my circle? It's gone", and the
   pill is his standard language for a value. Neither is a caption.

   A WORD NOT SET IS STILL PLACED. Every run below still measures itself and
   still records its box in LBL, marked with the strength it was set at, so
   the gates that hold every label inside the ring and off every other label
   keep holding the words that are about to arrive, at the zoom they arrive. */
const TXT_Z0=1.12, TXT_Z1=1.75;
function txtZoomA(z){var t=((+z||1)-TXT_Z0)/(TXT_Z1-TXT_Z0);
 t=t<=0?0:t>=1?1:t; return t*t*(3-2*t);}
/* the wheel's multiplier, set by drawWheel for its own frame and put back to
   1 after it, so no other canvas surface inherits a zoom it does not have */
var TXT_A=1;
/* INWARD, ruled 26 September, CQ in TASKS.md: nothing on the Field sticks
   out past the ring. A radial run always read outward from its anchor, so
   every ring that named its members drew those names past itself: the
   archetypes through the shell, the masks through it at Blueprint, the
   pattern plates out to the canvas edge. Inward, the run ends at the anchor
   and reads toward the centre, and a ring's names stay on its own side. */
function radialTxt(s,ang,rad,size,c,a,w,inward){
 g.save();g.translate(CX+Math.cos(ang)*rad,CY+Math.sin(ang)*rad);
 let rot=ang,left=Math.cos(ang)<0;if(left)rot+=Math.PI;
 g.textAlign=(left!==!!inward)?'right':'left';
 g.rotate(rot);g.font=(w||400)+' '+size+"px Inter, system-ui, sans-serif";
 g.textBaseline='middle';
 if(TXT_A>0.004){g.globalAlpha*=TXT_A;g.fillStyle=rgba(c,a);g.fillText(s,0,0);}
 /* the axis aligned box the rotated run actually occupies */
 var tw=g.measureText(s).width, sn=Math.abs(Math.sin(rot)), cs=Math.abs(Math.cos(rot));
 var bw=tw*cs+size*sn, bh=tw*sn+size*cs;
 var px=CX+Math.cos(ang)*rad, py=CY+Math.sin(ang)*rad;
 var off=(g.textAlign==='right'?-tw/2:tw/2);
 px+=Math.cos(rot)*off; py+=Math.sin(rot)*off;
 LBL.push({t:s,x:px-bw/2,y:py-bh/2,w:bw,h:bh,set:TXT_A});
 g.restore();}
/* A WORD WRAPPED ROUND ITS OWN ARC. Ruled 26 September, CQ in TASKS.md, on
   the seat names: "wrapped around their own domain so the Field keeps one
   unbroken circular silhouette". It is option B from CE's label sheet, the
   word set along the seat's own arc inside the ring, which he was shown
   beside the radial names he objected to as sticking out "like a handle for
   a wheel".

   Centred on am at radius rad, one glyph at a time, each turned to the
   tangent. Upright either way: clockwise on the upper half, anticlockwise on
   the lower, so no word is ever set upside down. Each glyph is centred on
   rad rather than sat on it, so both halves hold the same band of radius.

   It refuses to draw rather than overflow: a word wider than span radians is
   not drawn and false comes back, because a word that runs past its own arc
   has left its domain, which is the thing being fixed. The arc under it is
   still coloured and still a target, and the rail still lists it.

   halo is a ground colour stroked under the glyphs, because a word inside
   the ring sits over marks in its own seat's hue and without it the word
   and the mark under it are the same colour. */
function arcTxt(s,am,rad,size,c,a,w,span,halo){
 g.save();g.font=(w||400)+' '+size+"px Inter, system-ui, sans-serif";
 const tw=g.measureText(s).width, need=tw/Math.max(1,rad);
 if(span&&need>span){g.restore();return false;}
 const low=Math.sin(am)>0.25, dir=low?-1:1, rr=rad;
 g.textAlign='center';g.textBaseline='middle';
 /* the halo fades with the word, or a word not yet set would leave its ground
    behind as a dark smudge where it is about to be */
 const set=TXT_A>0.004; g.globalAlpha*=TXT_A;
 let t=am-dir*need/2, x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
 for(const ch of s){
  const cw=g.measureText(ch).width, th=t+dir*(cw/2)/rr;
  const x=CX+Math.cos(th)*rr, y=CY+Math.sin(th)*rr;
  if(set){g.save();g.translate(x,y);g.rotate(th+dir*Math.PI/2);
   if(halo){g.lineJoin='round';g.lineWidth=3;g.strokeStyle=halo;g.strokeText(ch,0,0);}
   g.fillStyle=rgba(c,a);g.fillText(ch,0,0);g.restore();}
  x0=Math.min(x0,x-size/2);y0=Math.min(y0,y-size/2);
  x1=Math.max(x1,x+size/2);y1=Math.max(y1,y+size/2);
  t+=dir*cw/rr;}
 /* ro is the run's true outer radius. The box is axis aligned round a curve,
    so its corners sit off the arc and past the ring even when every glyph is
    inside it; a gate asking how far a word reaches reads ro, not the box. */
 LBL.push({t:s,x:x0,y:y0,w:x1-x0,h:y1-y0,ro:rr+size*0.5,set:TXT_A});
 g.restore();return {a0:Math.min(am-need/2,am+need/2),a1:Math.max(am-need/2,am+need/2),
  r0:rr-size*0.6,r1:rr+size*0.6};}
function txt(s,x,y,size,c,a,w,fam){if(TXT_A<=0.004)return;g.save();
 g.font=(w||400)+' '+size+'px '+(fam||'Inter, system-ui, sans-serif');
 g.textAlign='center';g.textBaseline='middle';g.fillStyle=rgba(c,a*TXT_A);g.fillText(s,x,y);g.restore();}
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
/* THE PHONE, asked where it is asked, so a picture drawn by script agrees with
   the sheet's own phone rules to the pixel. The width is the sheet's, 720, and
   it is read live because a window can be narrowed without a reload. */
function phoneW(){try{return matchMedia('(max-width:720px)').matches;}catch(e){return false;}}
/* THE THREE POLE GLYPHS, on the 24 unit grid every icon in this product uses.
   Ring, not fill, like the rest. A halo is a ring with nothing in it. Ego
   compression is a ring with two arrows pressing on it. The pitchfork is a
   pitchfork.

   Moved here from ui/cone.js on GF in TASKS.md. The compass drew them alone
   until the Field's own pictures took them into their cores on a phone, and
   ui/wheel.js and ui/rings.js load before the compass, so the paths live in
   the module every one of the three loads after. */
const GL_HALO='M4 12 A8 3.4 0 1 0 20 12 A8 3.4 0 1 0 4 12';
/* GL_COMPRESS is gone with the third glyph it drew. A constant nothing draws
   is how the destructive release animation survived in this build for weeks,
   so an unused path does not stay in the file. */
const GL_FORK='M12 21V9M6 9V3.5M12 9V3M18 9V3.5M5 9h14';

/* ============================================================
   WHERE TO START. One set of doors, two places that show them.

   The rail carried them and the summary now needs them, because the
   summary is where the app opens and a person arriving has read
   nothing. Two copies meant two sets of ids, and two elements with
   one id is a broken document, so the doors carry a data attribute
   and one delegated listener answers for every copy of them.
   ============================================================ */
const STARTD=[
 /* HS SWEEP, THE DOORS. A door's second line says which door is yours, and
    that is all it is for. "The engine reads the charge out of it" and "A
    release empties a story out of the body. This is what you are filling it
    toward" explained the product behind the door, on a button, in small
    type, on every tab of a blank profile. The two "for anyone who" lines stay:
    they are the only thing telling a person which of the two middle doors is
    theirs. The definition of release stays where GS put it, in the drill. */
 ['story','Write what happened',
  'The day, in your own words.'],
 /* TWO REASSURANCES AGAINST FEARS NOBODY HAD RAISED, CUT. V12. "None of them
    is a diagnosis" and "which is most people" answered a worry on a door the
    person has not opened yet; the drill behind the door is where that worry
    arrives, and where it is answered. And the avatar door says what a release
    empties in the owner's own terms, ruled in GS: "the release is any story...
    empty the body of stories, period." */
 ['nine','Read nine sentences',
  'For anyone who cannot think of themselves as the problem.'],
 ['ages','Go year by year',
  'Three to eighteen. For anyone who cannot think of anything they identify with.'],
 ['avatar','Say who you are becoming',
  'The avatar.']];
function startHTML(lead){
 return '<div class="pm-eye">Where to start</div>'
  +'<p class="st-lead">'+(lead||'Nothing has been read yet. Four ways in.')+'</p>'
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
  /* talking, the box a person writes in is the reply line */
  var ta=document.getElementById('sttext')||document.getElementById('stcin'); if(ta)ta.focus(); return;}
 if(k==='nine'){runRecogniseDrill();return;}
 if(k==='ages'){runAgeDrill();return;}
 if(k==='avatar'){runAvatarDrill();return;}});
