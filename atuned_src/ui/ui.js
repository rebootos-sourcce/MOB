
/* ============================================================
   POINTER. Drag a segment to load or clear it, click to drill.
   ============================================================ */
/* HOWTO WAS HERE AND NOTHING READ IT. Four paragraphs of how to use the
   wheel, one per depth, declared and never rendered. Removed in round HS
   rather than left for the next seat to wire in: the class of text it holds
   is the class he has asked, three times, never to see on a surface. The one
   route that says how the wheel moves is the Help sheet, which a person opens. */
/* still: the picture asking has no drag. The two renditions in ui/rings.js
   draw every address and none of them can be dragged to set a charge, so an
   address there says click and not drag. Omitted, which is how the wheel
   calls this, nothing changes. */
function describe(h,r,still){
 /* THE CORE SAID ITS ARITHMETIC AND NOT ITS MEANING.

    It read "intention 6.5 times integrity over resistance" and that is three
    variable names and a division. Nobody arriving at this screen knows what
    any of the three are, so the sentence carried nothing at all.

    Coherence is the alignment between what arrives, how you read it, what you
    intend by it, and what you then do. That is a circuit with four stations
    and this instrument reads every one. The formula is how the reading is
    computed. It is not what the reading means, and it does not go first. */
 if(h.k==='core')return '<u>CQ '+Math.round(r.CQ)+'</u> <b>the core</b><hr>'
  +'Coherence is the alignment between what arrives, how you read it,<br>'
  +'what you intend, and what you then do.<br>'
  +'This reads every register in that circuit.<hr>'
  /* the inputs line named intention, integrity and resistance, which were
     CQ's three terms until 25 September. CQ is the 21 laws summed now. */
  +'<span class="tt-q">'+(r.complete?'every law answered':tierSay(r))+'</span>'
  +'<hr><b>Click for the breakdown.</b>';
 /* the compass's own two words for its two ends, cone.js, and nothing new */
 if(h.k==='pole')return '<u>compass</u> <b>'+(h.end==='up'?'Coherent':'Decoherent')+'</b>'
  +'<hr><b>Click for detail.</b>';
 if(h.k==='gate'){var v=h.v;
  return '<u>'+(v.side==='higher'?'higher gate':'lower gate')+'</u> <b>'+esc(v.nm)+'</b><hr>'
   +esc(v.d||'')+'<hr>'+(v.n?'<b>'+v.pct+'%</b> of your story, in '+v.n+' sentence'+(v.n===1?'':'s'):'no story yet')
   +'<br>everything held weighs <b>\u00d7'+v.mult.toFixed(2)+'</b><hr><b>Click for detail.</b>';}
 /* V21, speak to a ten year old. This read "001 Fear / Root seat, Lumbar
    Plexus / axis Fear / susceptibility 1.00 / held 0.3, opposite 8.8 / SQ
    0.0": a storage index, which is CO-15 by name, and four variable names.
    Now it says where the address is, what it does in a life, and what is on
    it, in words. Every figure it had is still here except the index, and
    each one says what it counts. SQ is the engine's own sentence for it,
    compute.js: what is left of the held state after the opposite is in. */
 if(h.k==='node'){var n=h.n, c=CHILD.filter(function(x){return x.nm===n.cf;})[0];
  var aff=(AFFIN[r.root]||[]).indexOf(n.cf)>=0;
  return '<u>address</u> <b>'+esc(n.k)+'</b><hr>'
   +(n.n?'At the '+esc(n.n.toLowerCase())+', in the '+n.b.toLowerCase()+' seat.'
        :'Just outside the body, by the '+n.b.toLowerCase()+' seat.')
   +(n.d?' It shows up as '+esc(n.d.toLowerCase())+'.':'')
   +'<hr>charge held <b>'+n.held.toFixed(1)+'</b>'
   +(c?'<br>'+esc(c.opp.toLowerCase())+' installed <b>'+n.rep.toFixed(1)+'</b>':'')
   +'<br>left after that <b>'+n.sq.toFixed(1)+'</b>'
   +'<br>takes <b>'+n.susc.toFixed(2)+'\u00d7</b> the charge'+(aff?', because of your '+esc(r.root)+' root':'')
   +'<hr><b>'+(still?'Click for detail.':'Drag to change, click for detail.')+'</b>';}
 /* AN ATOM. One story, one address, one weight, which is the smallest true
    unit this instrument holds. The snippet is the person's own sentence, so
    it goes in their words and not in a summary of them. */
 if(h.k==='atom'){var x=h.v,d='';
  try{d=new Date(x.t).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});}
  catch(e){d='';}
  var snip=x.text.length>96?x.text.slice(0,96).replace(/\s\S*$/,'')+'\u2026':x.text;
  return '<u>what put it here</u> <b>'+esc(h.n.k)+'</b><hr>'
   +'<em>'+esc(snip)+'</em><hr>'
   +(d?d+', ':'')+'weighed <b>'+x.amt.toFixed(1)+'</b> at this address'
   +'<hr><b>Click to hold it.</b>';}
 /* the law says what it is. IQ_STEM is the exact phrase the person was asked
    about, so the definition is what was measured and nothing is invented. */
 if(h.k==='law'){var l=SI[h.j], stem=(typeof IQ_STEM!=='undefined'&&IQ_STEM[l.nm])||'';
  return '<u>law</u> <b>'+l.nm+'</b><hr>'+(stem?'How often you '+esc(stem)+'. ':'')
   +'Seated at the '+l.b.toLowerCase()+'.'
   +'<br>reads <b>'+S.law[l.nm].toFixed(1)+'</b><hr><b>Click for detail.</b>';}
 if(h.k==='arch')return '<u>archetype</u> <b>'+ARCH[h.j].nm+'</b><hr>'+ARCH[h.j].v
  +'<br><b>'+(r.aff[h.j]*100).toFixed(0)+'%</b> as strong as your strongest'
  +'<hr><b>Click to set as primary.</b>';
 if(h.k==='dom'){var d=DOMAINS[h.j];
  return '<u>'+d.r+'</u> <b>'+d.nm+'</b><hr>'+d.d+'<br>weight <b>'+(DOMAIN[h.j]||0).toFixed(2)
   +'</b><hr><b>Click to select, shift-click to add.</b>';}
 var o=h.o; if(!o)return '';
 var f=leaves(o);
 var nm={sab:'saboteur',cx:'complex',hy:'hyper-complex',sup:'character layer'}[h.k];
 if(!nm)return '';
 return '<u>'+nm+'</u> <b>'+esc(o.nm)+'</b>'+(o.unnamed?' <em>inferred</em>':(SAB_PI.indexOf(o.nm)>=0?' <em>Positive Intelligence</em>':''))+'<hr>'
  /* never o.sub: on a hyper-complex that is the clinical correspondence,
     "depression · BPD · anxiety", and the ruling at the drill below keeps it
     off the screen of the person it is about. d is the plain line. And no
     storage index in front of a name, CO-15: Fear is not 001 to anybody. */
  +(o.auth?esc(o.auth)+'<br>':'')+(o.kind==='hy'&&o.d?esc(o.d)+'<br>':'')
  +'weight <b>'+o.w.toFixed(1)+'</b><hr><b>built on '+f.length+' address'+(f.length===1?'':'es')+'</b><br>'
  +f.slice(0,5).map(function(n){return esc(n.k)
   +' <b>'+n.sq.toFixed(1)+'</b>';}).join('<br>')
  +(f.length>5?'<br>and '+(f.length-5)+' more':'');}
/* AN ATOM IS THE SMALLEST THING DRAWN AND IT MUST WIN ITS OWN PIXEL.

   The scan runs backward so the last thing registered wins, which is the right
   default: later means drawn on top. Atoms break it. They are pushed at
   wheel.js:220, inside the shell loop, long before the addresses at :657, so
   an address whose wedge covers the atom takes every pointer that lands on it.

   That is not a stale ordering, it is a geometry dependent one, which is worse.
   It sat correct for months and only surfaced when a separate fix stopped a
   blank profile carrying twenty one invented law scores. The field moved by a
   few points, an address wedge slid over an atom, and the probe that hovers an
   atom to read the sentence behind it started reporting the address instead.
   Any future change to the arithmetic could do it again to a different atom.

   So atoms are resolved first, and only when the atom layer is actually up. A
   person zoomed in far enough to see atoms is looking at atoms: that is what
   the zoom was for. Two passes rather than a sort, because the common case is
   no atoms on screen at all and that case pays one length check. */
function hitTest(px,py){
 var i,h;
 if(typeof atomA==='function'&&atomA()>0){
  for(i=HIT.length-1;i>=0;i--){h=HIT[i];
   if(h.k!=='atom'||h.x===undefined)continue;
   if(Math.hypot(px-h.x,py-h.y)<=h.rad)return h;}}
 for(i=HIT.length-1;i>=0;i--){h=HIT[i];
  if(h.x!==undefined){if(Math.hypot(px-h.x,py-h.y)<=h.rad)return h;continue;}
  var d=Math.hypot(px-h.cx,py-h.cy);if(d<h.r0||d>h.r1)continue;
  var nz=function(x){while(x<-Math.PI)x+=TAU;while(x>Math.PI)x-=TAU;return x;};
  var a=Math.atan2(py-h.cy,px-h.cx);
  if(nz(a-h.a0)>=0&&nz(h.a1-a)>=0)return h;}
 return null;}
const loc=function(e){var b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];};
let DRAG=null, PAN=null;
/* A finger is not a mouse and this cost a person their reading.
   The canvas carries touch-action:none, so it swallows a scroll gesture
   rather than passing it to the page. Combined with drag to charge, a
   thumb landing on the wheel to scroll dragged the value underneath it
   and saveYou() wrote it. Reproduced at 390 wide: a touch on Denial Of
   Light and a 60px drag upward moved Anger from 8.0 to 10.0 and the page
   did not move at all. There is no undo, so the charge is simply gone.

   On a coarse pointer the drag does not arm. A tap still opens the
   address, which is the thing a finger is actually good at, and the
   gesture reaches the page so the wheel stops being a dead zone.
   This comes out when undo exists and not before. */
const COARSE=(typeof matchMedia==='function')&&matchMedia('(pointer:coarse)').matches;
/* A FINGER'S PRESS WAITS FOR ITS RELEASE. GF in TASKS.md, his words: "I want
   to be able to pinch zoom, and I can't, and the second that I put my fingers
   on it, the overlay dominates." Reproduced at 390 with a real two finger
   touch: the first finger's pointerdown ran hitPress on the spot, so a pinch
   that began on a mark opened that mark's drill before the second finger had
   landed. A tap is a press and a release in one place, so on a finger the
   press is armed here and fired on pointerup, and dropped by a second finger
   (fieldPinch below) or by the browser taking the gesture for a scroll
   (pointercancel). A mouse still acts on the press, as it always has. */
let TAP=null;
cv.addEventListener('pointerdown',function(e){
 /* a second finger is a pinch, never a press on whatever it landed on */
 if(fieldFingers()>1){fieldPressDrop();return;}
 var L=loc(e),x=L[0],y=L[1],h=hitTest(x,y);
 /* empty canvas, or the core, is grab space: the frame moves, nothing is set */
 if(!h||h.k==='core'){
  if(e.button===0||e.pointerType!=='mouse'){
   PAN={x:x,y:y,px:S.panx||0,py:S.pany||0,moved:false,core:!!h};
   /* a pointer that has already been released cannot be captured, and the
      throw would take the handler down with it */
   try{cv.setPointerCapture(e.pointerId);}catch(err){}
   cv.style.cursor='grabbing';}
  if(!h)return;}
 var touch=COARSE||e.pointerType==='touch'||e.pointerType==='pen';
 if(h.k==='node'&&h.n.cf&&!touch){
  /* one push per drag, taken at the start, so a drag is one undo and not
     forty. the move handler writes continuously. */
  undoPush('setting '+h.n.cf.toLowerCase()+' by hand');
  DRAG={mode:'cf',cf:h.n.cf,y:y,s:S.charge[h.n.cf],node:h.n,moved:false};
  try{cv.setPointerCapture(e.pointerId);}catch(err){}
  return;}
 /* THE CORE NEVER GOES THROUGH TAP. GF deferred every touch press to
    pointerup so a drag could still be told from a tap, but pointerup checks
    TAP before it checks PAN and returns the moment TAP is set, so a core
    touch armed both and PAN, the branch that actually opens the core
    reading ("a press on the core that never moved is still a click on the
    core", below), never ran. hitPress itself has no case for the core, by
    the design recorded above it: opening it from a synchronous mouse press
    would fire the reading before a drag could start. Reproduced with
    proto/mobile/coretap.js: 0 of 6 opened the reading on a coarse pointer,
    where a tap on an address still opened its own. Left to PAN alone, on
    every pointer type, as it always was. */
 if(e.pointerType==='touch'){if(h.k==='core')return; TAP={h:h,e:{shiftKey:false},id:e.pointerId};return;}
 hitPress(h,e);});
/* WHAT A PRESS ON A MARK DOES, ONE COPY FOR EVERY PICTURE OF THE FIELD.

   This was the tail of the handler above, inline. The two renditions in
   ui/rings.js draw the same things and a press on one of them has to do what
   the same press does on the wheel, so the tail is lifted out unchanged
   rather than copied, and both call it. A copy would have been the second
   list of what a mark opens, and the first time one of them learned a new
   kind the other would have gone on opening nothing.

   Moved and not changed. The address line read "&&touch", which on the
   wheel was always true by the time it was reached, because a mouse press
   on an address has already armed the drag above and returned. A rendition
   has no drag, so every press it makes on an address is the tap case. */
function hitPress(h,e){
 /* THE FIELD SOUNDS WHEN IT IS PRESSED, round OU: a soft ping at the seat of
    whatever was hit, on the wheel, Frames and Dial alike, because they all
    come through here. ui/sound.js says which seat and how loud. */
 if(typeof atmPing==='function')atmPing(h);
 if(h.k==='node'&&h.n.cf){ /* a tap reads the address, it never writes it */
  S.pin=null; runNodeDrill(h.n); render(); return;}
 /* the same setters as the left rail's icons, so the same guard, notYours in
    personas.js: on a worked example a press refuses rather than loading the
    blank own profile under the person. */
 /* A DOMAIN, AN ARCHETYPE AND A MASK OPEN THEIR DRILL. DY: the owner
    pressed a domain, Ideological and Magician on the shipped Field and the
    Selection panel stayed on "Nothing selected" every time, on all three
    pictures, because this dispatch sent those three kinds to the setters or
    to a bare render and never to a drill. The setters still run as they
    always did, and the drill opens after them so it reads the selection the
    press just made. On a worked example the setter refuses, and the drill
    still opens, because reading a thing is not changing it. The mask left
    the Field for the Body's figure, CH in TASKS.md, and its press went with
    it: bmWire in ui/map.js opens the same drill. */
 var said=function(){S.pin=null;
  if(h.k==='dom')runDomDrill(DOMAINS[h.j]);
  else runArchDrill(ARCH[h.j]);};
 if(h.k==='dom'){if(notYours('change the blueprint domain')){said();return;}
  undoPush('changing the blueprint domain');
  if(e.shiftKey){var k=S.doms.indexOf(h.j);
   if(k>=0){if(S.doms.length>1)S.doms.splice(k,1);}else S.doms.push(h.j);}
  else S.doms=[h.j];
  buildSoul();syncSoul();saveYou();said();render();return;}
 if(h.k==='arch'){if(notYours('change the archetype')){said();return;}
  undoPush('changing the archetype');
  if(e.shiftKey){var k2=S.arcs.indexOf(h.j);
   if(k2>=0){if(S.arcs.length>1)S.arcs.splice(k2,1);}else S.arcs.push(h.j);}
  else S.arcs=[h.j].concat(S.arcs.filter(function(z){return z!==h.j;}).slice(0,3));
  buildSoul();syncSoul();saveYou();said();render();return;}
 if(h.k==='law'){S.pin=null;runLawDrill(SI[h.j]);render();return;}
 /* a seat band opens the seat. runSeatDrill takes the APC entry rather than a
    name, looked up here rather than passed a string it would have to parse,
    which is how the Summary already calls it. */
 if(h.k==='seat'){S.pin=null;
  var sc=APC.filter(function(x){return x.b===h.b;})[0];
  if(sc)runSeatDrill(sc); render(); return;}
 /* an atom holds, and holding it lights that one line and opens what it is.
    Pressing the one you are holding lets it go. */
 if(h.k==='atom'){
  var held=S.atom&&S.atom.i===h.n.i&&S.atom.ei===h.v.ei;
  S.atom=held?null:{i:h.n.i,ei:h.v.ei};
  S.pin=null; if(!held)runAtomDrill(h.n,h.v); render(); return;}
 /* the core is grab space. A press on it arms the pan above, and pointerup
    opens the reading only if the pointer never moved. Opening it here as well
    meant the drill fired on press and the drag never happened. */
 if(h.k==='gate'){S.pin=null;runGatesDrill(h.v.k);render();return;}
 /* a pole drawn in the core on a phone, GF, is the door the strip's end was */
 if(h.k==='pole'){S.pin=null;runPoleDrill(h.end);render();return;}
 var o=h.o||null;
 var same=o&&S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
 S.pin=same?null:o; runDrill(S.pin); render();}
/* THE FRAME. The wheel is the instrument and a person reads it by moving in.
   The pointer keeps the address under it fixed while the scale changes, so
   zooming toward a segment lands on that segment. F reframes. */
/* WHAT ZOOM REACHED IS SAID ON THE GLASS BAR. paintDepth marked the depth
   button zoom had reached, so a person could see the extra detail came from
   the gesture and not from them. The depth row is gone, and the bar marks
   each layer zoom brought in instead, one circle at a time, fbPaint in
   ui/fieldbar.js. The line under the bar that once said it in words stays
   gone, ruled 25 September (BA2). coreResolved and fetResolved stay in
   wheel.js: they are the names of the layers, and the functional gate reads
   them to hold the order the layers arrive in. */
function setZoom(z,ax,ay){
 /* THE CEILING HAS TO CLEAR THE DEEPEST LAYER, or the deepest layer does not
    exist. The ceiling was five and the atoms open at 5.20, so the one thing
    past the fetters could not be reached by any gesture and the layer was
    dead code that measured correctly. A threshold above the ceiling is a
    feature nobody can get to. */
 var lo=1, hi=WHEEL_ZOOM_MAX, nz=Math.max(lo,Math.min(hi,z));
 if(nz===S.zoom)return;
 var wx=(ax-CX)/U, wy=(ay-CY)/U;
 /* a zoom is a person's change, so a layer it brings in arrives rather than
    appearing: layGesture in ui/wheel.js */
 layGesture();
 S.zoom=nz; reframe();
 S.panx += ax-(CX+wx*U); S.pany += ay-(CY+wy*U);
 reframe(); render();
 /* the room under the Field follows the zoom, ui/sound.js */
 if(typeof atmZoom==='function')atmZoom(nz,WHEEL_ZOOM_MAX);}
/* paintLegend is gone with the legend it wrote. Ruled 25 September (BA9), and
   the reason is at wheelLegend's old place in wheel.js. */
cv.addEventListener('wheel',function(e){
 if(S.tab!==TAB.FIELD)return;
 e.preventDefault();
 var L=loc(e);
 setZoom(S.zoom*(e.deltaY<0?1.12:1/1.12),L[0],L[1]);},{passive:false});
addEventListener('keydown',function(e){
 /* THE FIELD IS NOT THE ONLY FRAME NOW. LQ in TASKS.md: "when I hit F on the
    body, I can't reframe." True, and silent: F only ever knew the Field, so
    on the Body it did nothing and said nothing. The Body's own way back is a
    mouse button, "Whole body" (bmFitCam then bmFlyTo, ui/map.js), shown only
    once its camera has moved in. F now calls that same pair on the Body, so
    a keyboard reaches the move a mouse already had. */
 if(S.tab!==TAB.FIELD&&S.tab!==TAB.ENERGY)return;
 var t=e.target&&e.target.tagName;
 if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
 /* a chord is the browser's or the system's, never the Field's: Ctrl F is
    find, and it reframed the wheel on the way past */
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 var k=e.key.toLowerCase();
 if(k==='f'&&S.tab===TAB.ENERGY){
  if(PMLAYER==='map'&&bmZoomed()){var f=bmFitCam();bmFlyTo(f.x,f.y,f.z);bmBars();}
  return;}
 if(S.tab!==TAB.FIELD)return;
 /* F, plus and minus answer for the picture that is up. They only knew the
    wheel, so on Frames and Dial F reframed a wheel nobody could see and said
    so. fieldReframe and fieldZoomBy in ui/rings.js ask which picture is up. */
 if(k==='f'){fieldReframe();return;}
 if(k==='+'||k==='='){fieldZoomBy(1.25);return;}
 if(k==='-'||k==='_'){fieldZoomBy(1/1.25);return;}});
const HOWTO_ZOOM_OUT='Reframed. Scroll on the wheel to move in and the core opens as you go, drag to move the frame, F to come back.';
cv.addEventListener('pointerup',function(e){
 cv.style.cursor='';
 if(TAP){var tp=TAP; TAP=null; if(tp.id===e.pointerId)hitPress(tp.h,tp.e); return;}
 if(PAN){var wasCore=PAN.core, moved=PAN.moved; PAN=null;
  /* a press on the core that never moved is still a click on the core */
  if(!moved&&wasCore){if(typeof atmPing==='function')atmPing(null);S.pin=null;runCoreDrill();render();}
  return;}
 if(DRAG&&!DRAG.moved&&DRAG.node){var n=DRAG.node;DRAG=null;if(typeof atmPing==='function')atmPing({k:'node',n:n});S.pin=null;runNodeDrill(n);render();return;}
 DRAG=null;});
cv.addEventListener('pointercancel',function(){PAN=null;DRAG=null;TAP=null;cv.style.cursor='';});
/* double click puts the frame back, the same thing F does, because a person
   who has panned into a corner should not have to find a keyboard. */
cv.addEventListener('dblclick',function(){S.zoom=1;S.panx=0;S.pany=0;reframe();render();
 if(typeof atmZoom==='function')atmZoom(1,WHEEL_ZOOM_MAX);});
cv.addEventListener('pointermove',function(e){
 /* two fingers down is the pinch's, and fieldPinch moves the frame */
 if(fieldFingers()>1)return;
 var L=loc(e),x=L[0],y=L[1];
 /* PAN. Left press and drag anywhere the wheel is not a target and the frame
    moves under the pointer. The scroll wheel already zoomed and F already
    reframed, so the one thing missing was moving the view without changing it.
    Nothing here writes to the reading. */
 if(PAN){
  S.panx=PAN.px+(x-PAN.x); S.pany=PAN.py+(y-PAN.y);
  PAN.moved=PAN.moved||Math.hypot(x-PAN.x,y-PAN.y)>3;
  /* AND THE FRAME IS REBUILT. This wrote S.panx and then called render, and
     render draws from CX and CY, which only reframe() ever sets. So the
     numbers moved and the picture did not, at every zoom level. Measured: a
     72 pixel drag moved panx from 0 to 72 and left CX at 332. */
  reframe(); render(); return;}
 if(DRAG){var d=(DRAG.y-y)/22;
  if(Math.abs(DRAG.y-y)>3)DRAG.moved=true;
  toYou();S.charge[DRAG.cf]=clamp(DRAG.s+d,0,10);
  syncCh();saveYou();render();return;}
 /* A FINGER HAS NO HOVER. This readout is what a mouse sees resting over a
    mark, and a finger moving on the glass put it up over the middle of the
    picture: the overlay that "dominates" in GF, measured at 390 as a 158 by
    147 panel reading "mask Ideological" on top of the core mid pinch. A tap
    opens the mark's reading instead, on its release. */
 if(e.pointerType==='touch')return;
 var h=hitTest(x,y),pr=$('probe');
 S.hover=h?(h.n||h.o||null):null;
 rlEcho(h);
 if(!h){pr.classList.remove('on');cv.style.cursor='crosshair';return;}
 var t=describe(h,computeSeen());
 if(!t){pr.classList.remove('on');return;}
 cv.style.cursor=(h.k==='node')?'ns-resize':'pointer';
 pr.innerHTML=t;
 probeAt(pr,cv,x,y);});
/* WHERE THE READOUT GOES, for a pointer at x and y inside el. Lifted out of
   the canvas's own handler unchanged, because a rendition of the Field puts
   the same readout up over the same stage and has to place it by the same
   rule, and the rule below was learned the hard way. */
function probeAt(pr,el,x,y){
 /* THE READOUT SAT ON THE POINTER, AND IT WAS THE COORDINATES. BA6.

    x and y are measured from the canvas and the readout is positioned against
    .stage, and the two stopped being the same box when the stage grew its 128
    pixel lanes and the rows above the wheel. Nothing translated them, so every
    readout landed 110 pixels left of and 87 above where it was aimed, which is
    on top of the pointer: measured at 1600 on Abraham, the core's readout at
    673,539 by 300,229 with the pointer at 783,626. It is pointer-events none
    and the press did reach the core, but the readout covered what the pointer
    was on and printed "Click for the breakdown" beside it, so a person aimed at
    the words, left the core for a law, and the click opened the law. His report
    was exact: the tooltip covers the mouse point.

    So the pointer is moved into the stage's box first, and on each axis the
    readout goes to whichever side of it has room. The clamp that was here
    could not do that: Math.min(CW-312) and Math.min(CH-200) pulled the box
    back over the pointer near the right and bottom of the wheel, and 200 is
    shorter than the core's own readout. Either side starts eighteen pixels
    clear of the pointer.

    An axis with room on neither side holds the readout inside the stage
    instead, because clear on one axis is already clear of the pointer. The
    first cut of this let it overflow, and at 390 the stage cut 81 of 136
    readouts off at its edge. The pointer can only be covered on a stage too
    small for the readout on both axes at once. */
 var box=pr.offsetParent||el.parentNode;
 var sx=el.offsetLeft+x, sy=el.offsetTop+y, pw=pr.offsetWidth, ph=pr.offsetHeight;
 var side=function(at,size,room){
  return at+18+size<=room?at+18:at-18-size>=0?at-18-size:Math.max(0,Math.min(room-size,at+18));};
 pr.style.left=side(sx,pw,box.clientWidth)+'px';
 pr.style.top=side(sy,ph,box.clientHeight)+'px';
 pr.classList.add('on');}
cv.addEventListener('pointerleave',function(){S.hover=null;DRAG=null;rlEcho(null);$('probe').classList.remove('on');});
/* ============================================================
   THE RENDITIONS ANSWER THE WAY THE WHEEL DOES. BP8.

   Each mark ui/rings.js draws carries the index of a hit record shaped like
   the wheel's own, so hovering one puts up this readout in describe()'s words
   and pressing one runs hitPress, the wheel's own dispatch. The mockups gave
   every mark a native tooltip instead. Kept, that would have been a second
   wording of every element on the surface beside the first, and no press on
   a rendition would have opened anything at all.

   Three differences, each for a reason. Nothing can be dragged, so an
   address says click and not drag. The core opens on the press, because on
   the wheel a press on the core also takes hold of the frame to move it, and
   a rendition has no frame to move. And the two things the wheel never drew
   get lines of their own: a seat's mark, which carries no word on the
   drawing, and the four addresses outside the body.
   ============================================================ */
function frDescribe(h,r){
 if(h.k==='seat'){var n=W.filter(function(x){return x.b===h.b;}).length;
  return '<u>seat</u> <b>'+esc(h.b)+'</b><hr>'+n+' addresses<hr><b>Click for detail.</b>';}
 if(h.k==='anchor')return '<u>outside the body</u> <b>'+esc(h.n.k)+'</b><hr>'+esc(h.n.a||'');
 return describe(h,r,true);}
(function(){
 var fr=$('frend'); if(!fr)return;
 var hitOf=function(e){var t=e.target&&e.target.closest?e.target.closest('[data-h]'):null;
  return t?(FR_HIT[+t.getAttribute('data-h')]||null):null;};
 fr.addEventListener('pointermove',function(e){
  /* a finger has no hover, the wheel's own reason above */
  if(e.pointerType==='touch')return;
  var h=hitOf(e),pr=$('probe'); if(!pr)return;
  var t=h?frDescribe(h,computeSeen()):'';
  if(!t){pr.classList.remove('on');return;}
  pr.innerHTML=t;
  var b=fr.getBoundingClientRect();
  probeAt(pr,fr,e.clientX-b.left,e.clientY-b.top);});
 fr.addEventListener('pointerleave',function(){$('probe').classList.remove('on');});
 fr.addEventListener('click',function(e){
  var h=hitOf(e); if(!h)return;
  $('probe').classList.remove('on');
  /* an address outside the body holds no charge of its own and has no drill
     yet, so its readout promises nothing and the press does nothing */
  if(h.k==='anchor')return;
  if(h.k==='core'){S.pin=null;runCoreDrill();render();return;}
  hitPress(h,e);});})();

/* ============================================================
   THE PINCH. GF in TASKS.md, 27 September, his words: "I want to be able to
   pinch zoom, and I can't, and the second that I put my fingers on it, the
   overlay dominates."

   Reproduced before this existed, at 390 with isMobile and hasTouch and two
   real touch points driven through the browser's own input pipeline, a
   spread from 60 to 200 pixels on each picture:

     Wheel    S.zoom 1 before and 1 after. Nothing anywhere listened for two
              fingers: the zoom was wired to the mouse wheel and to keys and
              to nothing else. touch-action pan-y on the canvas, which is
              right, kept the browser's own zoom off it, so the gesture went
              nowhere. Each finger was read as a mouse instead: the first
              pressed whatever mark it landed on and opened its drill, and
              moving put the hover readout over the core.
     Frames   FZ.s 1 before and 1 after, and the page's visualViewport scale
     Dial     went from 1 to 4.96. #frend had no touch-action, so the browser
              took the pinch as a zoom of the whole page: the bar, the glass
              bar and every panel grew with it and the picture's own zoom
              never moved. That is the "I can pinch zoom here" in the same
              message, and it is why the overlay dominated there too.

   So both hosts take two fingers here, off the touch events, which are the
   only events that say how many fingers are down and the only ones whose
   default can still be refused once the browser has seen them. The distance
   between the fingers scales the picture about their midpoint, the midpoint
   moving pans it, and the wheel and the renditions each go through the zoom
   they already had, setZoom in this file and fzAt in ui/rings.js, so the
   ceilings, the layers a zoom brings in and the glass bar's circles all
   answer to a pinch exactly as they answer to a scroll. One finger is left
   alone entirely: it still scrolls the page, which is the lesson recorded at
   COARSE above and the functional gate's "a finger reads the wheel".
   ============================================================ */
var FINGERS={}, PINCH=null, PINCH_END=0;
/* fingers are counted in the capture phase at the window, so the count is
   already right when a host's own pointerdown for the second finger runs */
addEventListener('pointerdown',function(e){if(e.pointerType==='touch')FINGERS[e.pointerId]=1;},true);
['pointerup','pointercancel'].forEach(function(t){
 addEventListener(t,function(e){delete FINGERS[e.pointerId];},true);});
function fieldFingers(){return Object.keys(FINGERS).length;}
/* whatever one finger had started is not also a press, a pan or a drag */
function fieldPressDrop(){TAP=null;PAN=null;DRAG=null;FZDRAG=null;
 var pr=$('probe'); if(pr)pr.classList.remove('on');}
function fieldPinch(host,wheel){
 if(!host)return;
 var two=function(e){var a=e.touches[0],b=e.touches[1],r=host.getBoundingClientRect();
  return {d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),
   x:(a.clientX+b.clientX)/2-r.left, y:(a.clientY+b.clientY)/2-r.top};};
 host.addEventListener('touchstart',function(e){
  if(S.tab!==TAB.FIELD||e.touches.length<2)return;
  if(wheel===fviewOn())return;
  PINCH=two(e); fieldPressDrop();
  if(e.cancelable)e.preventDefault();},{passive:false});
 host.addEventListener('touchmove',function(e){
  if(!PINCH||e.touches.length<2)return;
  /* refused while the browser still allows it, so no page zoom and no scroll
     starts under the pinch. A browser that already committed to a scroll
     makes this uncancelable, and the picture still follows the fingers. */
  if(e.cancelable)e.preventDefault();
  var n=two(e), k=PINCH.d>0?n.d/PINCH.d:1, dx=n.x-PINCH.x, dy=n.y-PINCH.y;
  if(wheel){
   setZoom(S.zoom*k,n.x,n.y);
   if(dx||dy){S.panx=(S.panx||0)+dx; S.pany=(S.pany||0)+dy; reframe(); render();}}
  else{
   fzAt(FZ.s*k,n.x,n.y);
   if(dx||dy){FZ.x+=dx; FZ.y+=dy; fzClamp(); fzApply();}}
  PINCH=n;},{passive:false});
 var end=function(e){if(PINCH&&e.touches.length<2){PINCH=null;PINCH_END=performance.now();}};
 host.addEventListener('touchend',end); host.addEventListener('touchcancel',end);
 /* the last finger up after a pinch is not a tap on what it lifted from */
 host.addEventListener('click',function(e){
  if(performance.now()-PINCH_END<400){e.stopPropagation();e.preventDefault();}},true);}
fieldPinch(cv,true);
fieldPinch($('frend'),false);

/* ---- collapsible sections ---- */
/* One open section per rail. It was a single value, so opening anything on
   the right would have folded the left. */
/* EVERY SECTION CAN BE OPEN AT ONCE. Ruled.

   This was one open per rail: clicking Child fetters folded Awareness shut, so
   a person could never see the blueprint and the axes they were setting at the
   same time, which is the one comparison the left rail exists to support.
   Folding is for getting a long rail under control, not for rationing what a
   person is allowed to look at.

   A set per rail rather than a single value, so the state is what is open
   rather than what is the one thing open. The drill still opens Selection when
   a reading arrives, and now it opens it beside what was already there instead
   of closing it. */
/* lean opens with soul because it holds Orientation and Balance, which sat in
   soul and were open on arrival until the rail split into Spirit and Psyche.
   A split that closed them would have taken two readings off the first rail a
   person sees, and nobody ruled that. */
/* SPIRIT OPENS TOO, BECAUSE A CLOSED STATES READ AS AN EMPTY ONE.

   The owner, 26 September: "the left side of that screen doesn't have the
   spiritual layer to it yet, where is it, your Eastern Western sign". It did.
   renderSpirit has filled #spirit on every render since the engine was built,
   sun, moon, rising, the year animal, life path, the design gates and the gene
   key, and the functional gate has asserted the text for a real birth date.
   Measured on the built file: 2263 characters of markup with a birth date on
   file, 132 without. What nobody measured was whether a person could see it.
   spirit was never in this set, so the section arrived closed, a header with
   nothing under it, and a closed header reads as a section with nothing in
   it, which is how it came to be reported to the team as unwired.

   Only the default moves. A person who closes it keeps it closed, because
   the header writes this same set. */
/* AND NOW IT OPENS CLOSED, ON HIS WORD, WHICH REVERSES THE PARAGRAPH ABOVE.
   EZ in TASKS.md: States went to the head of the rail as Root energetics,
   "and I want that one to start closed." The finding above still holds, a
   closed header can read as an empty one, and it is answered differently
   now: the section is the first thing in the rail and says what it holds in
   its own name, where States sat fifth under a word nobody read as birth
   data. Its key is energetics, not spirit, so nothing that remembered the
   old section opens the new one by accident. */
var OPENSEC={left:{}, right:{you:1}};
/* which surfaces have already had their sections seeded, so a tab opens what
   it is about the first time and never argues with a person who closed it. */
var SEC_SEEDED={};
function railOf(sec){return sec.dataset.rail||'left';}
function wireSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var hd=sec.querySelector('.lsec-hd'); if(!hd||hd._w)return; hd._w=1;
  /* OPENING A SECTION USED TO THROW THE RAIL DOWN THE PAGE.

     Opening Matrix put 171 cells into the rail, the column grew by 264px,
     and the browser's scroll anchoring chose an anchor below the fold and
     moved scrollTop from 0 to 355 to keep it still. Measured, not guessed:
     the rail jumps exactly that far every time.

     Scroll anchoring is off on the rail, and the thing that should stay
     still is named rather than left to the browser to pick: the header you
     just pressed. Its position on screen is taken before the layout changes
     and restored after, so the section opens under your finger and nothing
     else moves. */
  hd.onclick=function(){var rl=railOf(sec);
   var sc=hd.closest?hd.closest('.sc'):null;
   var was=sc?hd.getBoundingClientRect().top:0;
   var k=sec.dataset.sec, set=OPENSEC[rl];
   var opening=!set[k];
   if(set[k])delete set[k]; else set[k]=1;
   paintSections();
   railSection(sec,opening);
   if(opening&&typeof fitGrids==='function')requestAnimationFrame(fitGrids);
   if(!sc)return;
   /* PRESSING A HEADER PUTS THAT SECTION AT THE TOP. ALWAYS.

      Matrix puts 171 cells into the column and its header sits below the
      fold, so pressing it both scrolled the header into view and grew the
      rail by 264px underneath. That is the screen jumping around, and it was
      the browser choosing where to land rather than the product.

      Holding the header exactly still is not the fix either: it leaves what
      you just opened below the bottom edge, and on a close it cannot hold at
      all, because the column shrinks and scrollTop clamps.

      So there is one rule in both directions. Press a header and that
      section goes to the top. Opening, you see what you opened. Closing, you
      see the section you just collapsed and what follows it. The movement is
      the same every time, which is what stops it reading as a jump: a person
      learns it once.

      The rail carries a tail below its last section so there is always room
      to finish the move. Without it scrollTop clamped and the header stopped
      530px short, which is a movement that starts and does not arrive. */
   var top=sc.getBoundingClientRect().top;
   sc.scrollTop+=(hd.getBoundingClientRect().top-top);
   void was; void opening;};});
 paintSections();}
function paintSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var on=!!OPENSEC[railOf(sec)][sec.dataset.sec];
  sec.classList.toggle('open',on);
  var hd=sec.querySelector('.lsec-hd');if(hd)hd.setAttribute('aria-expanded',on?'true':'false');});}
/* THE LEFT COLUMN CLOSES, EZ in TASKS.md: "I want to be able to close up that
   column." A section folds its own body; this folds the whole column to the
   width of the one control that opens it again, and the stage takes the rest.
   It is a body class and not a display write, because the grid that places
   the column is in the sheet and the sheet is the one writer of layout.

   Kept in the store as a convenience and nothing more: a store that cannot be
   read opens the column, which is the state nobody has to find their way
   back from. The canvas refits itself off its own ResizeObserver; the icon
   grids do not, because a grid in a shut column measures nought and fitGrid
   rightly skips it, so they are refitted on the way back open. */
function colFoldPaint(shut){
 document.body.classList.toggle('lshut',shut);
 var b=$('lfold'); if(!b)return;
 var say=shut?'Open the left column':'Close the left column';
 b.setAttribute('aria-expanded',shut?'false':'true');
 /* fbTip and not data-tip straight: on a phone a tooltip carrier takes its
    first tap to explain itself, and a fold that has to be pressed twice is
    the toggle rule ui/fieldbar.js already settled for the glass bar */
 b.setAttribute('aria-label',say); fbTip(b,say);}
/* AND IT STARTS SHUT. GO in TASKS.md, his words: "the field left panel starts
   closed," and before that, BD1: "we keep the left panel closed." The Root
   Energetics section was already closed on arrival and still is; what stood
   open on landing was the column itself, with Energy and Lean unfolded under
   it, measured at 730 and 305 pixels on a blank profile. So a person who has
   never chosen arrives on a shut column, the stage takes the width, and the
   bar has the room to put Close the tools at its head (ui/fieldbar.js).

   Only a store with nothing in it defaults. A person who opened the column
   keeps it open, because the press writes 'open'. A store that throws still
   opens it, the state nobody has to find their way back from, which is the
   reason given above and it has not changed.

   AND ONLY WHERE THE COLUMN STANDS BESIDE THE STAGE. Below 1181 the columns
   stack under the picture, so a shut column takes nothing from it: measured
   at 390 it became an empty card holding one small mark between the picture
   and the readings, with CQ and DQ behind it. That is a control hidden for no
   room gained, so a phone arrives on the column open, as it always did. The
   width is the sheet's own breakpoint for the grid rule above. */
var LCOL_BESIDE='(min-width:1181px)';
function colFold(){
 var beside=true; try{beside=matchMedia(LCOL_BESIDE).matches;}catch(e){}
 var shut=beside;
 try{var got=STORE.get('lcol'); shut=got?(got==='shut'):beside;}catch(e){shut=false;}
 colFoldPaint(shut);
 var b=$('lfold'); if(!b)return;
 b.onclick=function(){
  var now=!document.body.classList.contains('lshut');
  colFoldPaint(now);
  try{STORE.set('lcol',now?'shut':'open');}catch(e){}
  if(!now&&typeof fitGrids==='function')requestAnimationFrame(fitGrids);
  /* the column's first opening is the rail's first sight, ui/railmotion.js */
  if(!now)requestAnimationFrame(railOpened);};}
/* OPTION TWO OF THE READINGS, round OM, behind the address and nowhere else:
   ?rail=2 draws the six readings as fields of colour with a ring each. The page
   opens on option one, the bars, and a person who never types the address
   never meets this. The sheet that draws it is the last in head.html. */
try{if(/[?&]rail=2(&|$)/.test(location.search))document.body.classList.add('rail2');}catch(e){}
/* THE RIGHT COLUMN CLOSES, LO in TASKS.md: "Add a widget to the right menu to
   collapse it." colFold's shape, and deliberately not its default. The left
   starts shut on his ruling, GO; nobody has ruled the right shut, and it holds
   the Reading and Selection, where every press on every surface answers. So
   it opens unless this person shut it, on every width, and a store that
   throws opens it too.
   Kept in the store as lcol is and not on the profile the way Quiet is: two
   columns folding in one browser is one person's arrangement of the screen,
   and a fold that moved with the profile picker would open and shut the
   column every time a worked example was loaded. */
function railFoldPaint(shut){
 document.body.classList.toggle('rshut',shut);
 var b=$('rfold'); if(!b)return;
 var say=shut?'Open the right column':'Close the right column';
 b.setAttribute('aria-expanded',shut?'false':'true');
 b.setAttribute('aria-label',say); fbTip(b,say);}
function railFold(){
 var shut=false; try{shut=STORE.get('rcol')==='shut';}catch(e){shut=false;}
 railFoldPaint(shut);
 var b=$('rfold'); if(!b)return;
 /* the control is pinned over the rail's head, and once the rail has
    scrolled it takes the panel's ground, head.html beside .rfold */
 var p=$('rpanel');
 if(p)p.addEventListener('scroll',function(){p.classList.toggle('scrolled',p.scrollTop>2);},{passive:true});
 b.onclick=function(){
  var now=!document.body.classList.contains('rshut');
  railFoldPaint(now);
  try{STORE.set('rcol',now?'shut':'open');}catch(e){}
  if(!now&&typeof fitGrids==='function')requestAnimationFrame(fitGrids);};}

/* ============================================================
   RENDER. One truth, five windows. Nothing here holds its own copy
   of a derived value.
   ============================================================ */
/* The one line that is always on screen: coherence, the tier it names, and
   how much of the field is carrying. Everything else folds behind a label. */
/* The stack. Under the reading, a row of tabs: the nine fetters, then the
   saboteurs, complexes, hyper complexes and character layers running now.
   Every row shows both halves of its pole: the charge held on the left and
   the coherent opposite installed on the right. A row is a door to the
   drill. The stack was five count lines. */
var STACK_TAB='fet';
function poleOf(o){
 var lv=leaves(o), fs=[]; lv.forEach(function(n){if(n.cf&&fs.indexOf(n.cf)<0)fs.push(n.cf);});
 if(!fs.length)return 0; var t=0; fs.forEach(function(f){t+=(S.replace[f]||0);}); return t/fs.length;}
function railStack(r){
 var e=document.getElementById('stack'); if(!e)return;
 /* THE STACK CARRIES ITS SYMBOLS. Every named thing in this product has a
    glyph and these five rungs were the last strip without one. The glyphs are
    the chain itself: one ring is a fetter, two locked rings a saboteur, three
    a complex, a lattice a hyper complex, and a filled silhouette the character
    layer, which is the one a person cannot see as separate from themselves. */
 var TABS=[
  /* the key is 'fet' and stays 'fet': a key is identity and identity is
     never renamed here. The label is what a person reads and it moves. */
  ['fet','Child emotions',CHILD.length,
   'M12 4.5a3.6 3.6 0 013.6 3.6v7.8a3.6 3.6 0 01-7.2 0V8.1A3.6 3.6 0 0112 4.5'],
  /* the four tiers' marks are CHAINGLYPH in ui/component.js, shared with
     the glass bar's switches for the same four */
  ['sab','Saboteurs',r.sabs.length,CHAINGLYPH.sab],
  ['cx','Complexes',r.cxs.length,CHAINGLYPH.cx],
  ['hy','Hyper',r.hys.length,CHAINGLYPH.hy],
  ['sup','Character',r.sups.length,CHAINGLYPH.sup]];
 var h='<div class="stk-tabs" role="tablist">'+TABS.map(function(t){
  return '<button type="button" role="tab" class="stk-t'+(STACK_TAB===t[0]?' on':'')+'" data-st="'+t[0]+'" '
   +'aria-selected="'+(STACK_TAB===t[0])+'" title="'+esc(t[1])+'">'
   +svgI('<path d="'+t[3]+'"/>')
   +'<span>'+t[1]+'</span>'+(t[2]?' <b>'+t[2]+'</b>':'')+'</button>';}).join('')+'</div>';
 if(STACK_TAB==='fet'){
  /* ONE WORD PER CONCEPT. This header said held and installed, the rail four
     inches to the left said held and opposite, and the owner asked what either
     of them meant. They are the two ends of one axis: the state you are
     carrying, and the coherent quality on the other side of it. Held and
     opposite, in both places, with the definition said once here rather than
     left in a tooltip nothing on a phone can reach. */
  /* AND THE DEFINITION IS OFF THE RAIL NOW. Round HS: "get rid of all this
     like second or three third tier text ... we have overlays for all this
     shit." A four line
     legend sat above the nine rows on every tab. Each row is a door to its
     axis's drill, and the drill says both ends and what fills each, so the
     definition is one press away on a phone as well as a desk, and the rule
     against a definition living only in a tooltip still holds. The two column
     words stay, and the same two words are the drill's. */
  h+='<div class="stk-hd"><span>held</span><span>opposite</span></div>';
  h+=CHILD.map(function(c,ci){var v=S.charge[c.nm]||0, p=S.replace[c.nm]||0;
   /* each axis carries its own glyph. canon.js has had one on every entry
      since the port and nothing in the rails was drawing them. */
   /* A ROW IS A DOOR NOW, which is what let the legend above come off. It was
      a static row and the only place held and opposite were defined was the
      legend, so the legend was cut only once each row opened runFetterDrill,
      the axis's own drill, which says both halves and what fills each. */
   return '<button type="button" class="stk-r" data-fet="'+ci+'"><span class="stk-l">'
    +cr(c.seat,v*10,{size:'xs',raw:v.toFixed(1),glyph:'<path d="'+c.ic+'"/>',
      title:c.nm+' held '+v.toFixed(1)})+esc(c.nm)+'</span>'
    +'<span class="stk-p">'+esc(c.opp)
    +cr('Heart',p*10,{size:'xs',raw:p.toFixed(1),hot:false,
      glyph:'<path d="'+c.ic+'"/>',title:c.opp+' installed '+p.toFixed(1)})+'</span></button>';}).join('');}
 else{
  var list={sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups}[STACK_TAB]||[];
  h+=list.length?'<div class="stk-hd"><span>weight</span><span>opposite in</span></div>':'';
  h+=list.length?list.map(function(o,i){var p=poleOf(o);
   return '<button type="button" class="stk-r'+(S.pin===o?' on':'')+'" data-sk="'+STACK_TAB+'" data-si="'+i+'">'
    +'<span class="stk-l">'+crPat(o,'xs')+esc(o.nm)+(o.unnamed?'<em>inferred</em>':'')+'</span>'
    +'<span class="stk-p">'+cr('Heart',p*10,{size:'xs',raw:p.toFixed(1),hot:false,
      title:'Opposite installed '+p.toFixed(1)})+'</span></button>';}).join('')
   :(lockSees(STACK_TAB)?'<div class="rnone">Nothing at this layer.</div>':lockPanelHtml(STACK_TAB));}
 e.innerHTML=h;
 /* THE STACK'S TABS ARE THE RAIL'S ROW OF WHAT IS RUNNING, so a tab above the
    plan is greyed and padlocked with its description, and its count is not
    printed: a "3" on a locked tab says how many saboteurs somebody has. The tab
    that was open when a plan lapsed is left open, on the lock's own panel, so
    the list never reads "nothing at this layer" about a layer it cannot see. */
 TABS.forEach(function(t){if(t[0]==='fet')return;
  lockApply(e.querySelector('.stk-t[data-st="'+t[0]+'"]'),t[0]);});}
/* THE BALANCE STRIP, AND WHICH END IS WHICH.

   The two poles are masculine and feminine. cards.js states the codex
   position: masculine is structure and direction, feminine is energy and
   receptivity, masculine runs the right channel and sympathetic, feminine the
   left and parasympathetic, and the spec is explicit that feminine is not
   women and masculine is not men. Outward is the masculine end and inward the
   feminine one.

   The owner ruled the masculine symbol on the left and the feminine on the
   right, which is the opposite handedness from the body. That is not a
   conflict, it is what a mirror is: face one and your right hand is on the
   left. This product is a mirror a person holds up to themselves and the strip
   is drawn the way they would see it, so the screen is mirrored against the
   body on purpose. Logged in BOOK-ERRATA so the codex and the screen disagree
   in writing rather than by accident.

   So the strip reads masculine on the left and feminine on the right, the lean
   is mirrored with it, and the marker still sits where the field actually is.
   The centre is a hairline, the same one the compass draws down its axis. */
const GLYPH_M='<circle cx="10" cy="14" r="6"/><path d="M14.5 9.5L20 4M15.5 4H20v4.5"/>';
const GLYPH_F='<circle cx="12" cy="9" r="6"/><path d="M12 15v7M8.5 19h7"/>';
/* ============================================================
   ORIENTATION AND BALANCE ARE ONE MECHANIC, AND NOW ONE DRAWING.
   FJ in TASKS.md, his words: "Orientation and balance, those two elements
   need to be designed the same way, it's the same mechanic. If I choose
   one, give me two different designs."

   He is right about the mechanic, measured rather than agreed with. Each is
   two shares of one whole. Orientation is benign against malignant, leanRead,
   and the two add to 100. Balance is the outward mean against the inward
   mean, balance(), and as shares of their sum they add to 100 as well, and
   the lean the strip always printed is exactly their difference: lean times
   100 is the masculine share less the feminine one. So both are the same
   four things: a symbol and a share at each end, a break at the centre where
   even sits, and a fill running out of the break toward the heavier end, as
   long as the difference.

   And they were drawn differently in a way that said the opposite. Balance
   ran its fill toward the end it leaned to, which is his ruling for it. The
   orientation bar ran its fill away from it: a benign lean grew toward the
   malignant figure. One drawing now, and the fill goes toward the heavier
   end on both.

   TWO DESIGNS, BOTH LIVE, one switch at the head of the section, and the
   pick applies to both dials at once, which is the point of the ask.
     Bar   the trough, as the orientation bar shipped: the figures in pills
           at the two ends, the fill under them.
     Arc   a gauge: a half ring over the top with the break at twelve, the
           fill round the ring toward the heavier end and a needle that lands
           on the lean with a small overshoot, the figures outside the ring.
   The choice is kept the way the Field's picture is, one key in the store,
   because it is how this person likes to look and not a reading about them.

   IN PLACE, NOT REWRITTEN. The dial is built once per design and state and
   then only its numbers, widths and angles are written, so a change of
   reading moves: the fill slides out of the break in 380ms on the wheel's
   own entrance curve and the needle lands on an overshoot, instead of a new picture
   being swapped in. Reduced motion gets the end state.

   UNREAD SAYS NOTHING. Both ends keep their symbols and the break stays, at
   the same height, and no figure, fill or needle is drawn, which is the
   rule the orientation dial's gate holds and balance now keeps too.
   ============================================================ */
/* each design carries a drawing of itself, FV: "everything should have an
   icon." The trough with its break at the centre, and the half ring. */
const AXDS=[{k:'bar',nm:'Bar',g:'<rect x="3.4" y="8.6" width="17.2" height="6.8" rx="1.6"/><path d="M12 7v10"/>'},
 {k:'arc',nm:'Arc',g:'<path d="M4 17a8 8 0 0116 0"/><path d="M12 17l3.4-5"/>'}];
/* read on first use and not at load, because the browser's store is bound
   further down this file and at load the engine's no op store answers */
var AXD=null;
function axdNow(){if(AXD===null){try{var v=STORE.get('axdial')||'';AXD=v==='arc'?'arc':'bar';}catch(e){AXD='bar';}}
 return AXD;}
function axdSet(k){AXD=k==='arc'?'arc':'bar';try{STORE.set('axdial',AXD);}catch(e){}
 axdPaint(); render();}
function axdPaint(){var el=document.getElementById('axpick'); if(!el)return;
 if(!el.firstChild)el.innerHTML='<span class="ax-pl">Style</span>'+AXDS.map(function(d){
  return '<button type="button" class="ax-pb" role="radio" data-axd="'+d.k+'">'+axGlyph(d.g)+d.nm+'</button>';}).join('');
 el.querySelectorAll('[data-axd]').forEach(function(b){var on=b.getAttribute('data-axd')===axdNow();
  b.setAttribute('aria-checked',String(on)); b.classList.toggle('on',on);});}
function axGlyph(g){return '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">'+g+'</svg>';}
/* the arc's own geometry, in its viewBox: the ring's centre, its radius, and
   the two quarter paths the fill runs along, from twelve o'clock outward */
const AXA={cx:60,cy:54,r:40};
function axArcD(side){var c=AXA,x=side<0?c.cx-c.r:c.cx+c.r;
 return 'M'+c.cx+' '+(c.cy-c.r)+'A'+c.r+' '+c.r+' 0 0 '+(side<0?0:1)+' '+x+' '+c.cy;}
/* o: {read, L:{g,nm,v,c,t}, R:{same}, tick:'l'|'r'|null, title} */
/* the pill's figure counts to its value on the wheel's beat, from wherever it
   stood, so the number and the fill move together rather than the number
   landing first and the fill catching up */
function axCount(b,to){
 var from=parseFloat(b.textContent); if(!isFinite(from))from=0;
 if(REDUCED||from===to){b.textContent=String(to);return;}
 var t0=performance.now();
 b._axc=t0;
 (function step(now){if(b._axc!==t0)return;
  var k=Math.min(1,(now-t0)/ENTER_SPAN), e=1-Math.pow(1-k,3);
  b.textContent=String(Math.round(from+(to-from)*e));
  if(k<1)requestAnimationFrame(step);})(t0);}
function axDial(host,o){
 var built=false;
 var sig=axdNow()+'|'+(o.read?1:0)+'|'+(o.tick||'');
 var end=function(side,e){return '<div class="lb '+side+'"><span class="ax-g" title="'+esc(e.t)+'">'+axGlyph(e.g)+'</span>'
   +(o.read?'<b></b>':'')+'</div>';};
 if(host.getAttribute('data-axs')!==sig){
  var tickAt=o.tick==='l'?25:o.tick==='r'?75:null, h;
  if(axdNow()==='arc'){var c=AXA,ta=o.tick==='l'?-45:45;
   h='<div class="ax ax-arc">'+end('l',o.L)
    +'<svg class="ax-svg" viewBox="0 0 120 60" aria-hidden="true">'
    +'<path class="ax-trk" d="M'+(c.cx-c.r)+' '+c.cy+'A'+c.r+' '+c.r+' 0 0 1 '+(c.cx+c.r)+' '+c.cy+'"/>'
    +(o.read?'<path class="fill lt" d="'+axArcD(-1)+'" pathLength="100"/><path class="fill rt" d="'+axArcD(1)+'" pathLength="100"/>':'')
    +(tickAt!==null?'<line class="ax-sx" x1="'+(c.cx+Math.sin(ta*Math.PI/180)*(c.r-7)).toFixed(1)+'" y1="'+(c.cy-Math.cos(ta*Math.PI/180)*(c.r-7)).toFixed(1)
      +'" x2="'+(c.cx+Math.sin(ta*Math.PI/180)*(c.r+7)).toFixed(1)+'" y2="'+(c.cy-Math.cos(ta*Math.PI/180)*(c.r+7)).toFixed(1)+'"/>':'')
    +'<line class="mid" x1="'+c.cx+'" y1="'+(c.cy-c.r-8)+'" x2="'+c.cx+'" y2="'+(c.cy-c.r+8)+'"/>'
    +(o.read?'<g class="ax-nd"><line x1="'+c.cx+'" y1="'+c.cy+'" x2="'+c.cx+'" y2="'+(c.cy-c.r+11)+'"/><circle cx="'+c.cx+'" cy="'+c.cy+'" r="3.4"/></g>':'')
    +'</svg>'+end('r',o.R)+'</div>';}
  else{
   h='<div class="ax ax-bar"><div class="ax-tr">'+(o.read?'<div class="fill"></div>':'')+'<div class="mid"></div>'
    +(tickAt!==null?'<span class="ax-sx" style="left:'+tickAt+'%"></span>':'')
    +end('l',o.L)+end('r',o.R)+'</div></div>';}
  host.innerHTML=h+'<div class="ax-nm"><span class="ax-nl"></span><span class="ax-nr"></span></div>';
  host.setAttribute('data-axs',sig);
  /* THE FIRST FILL IS WATCHED TOO. FV in TASKS.md: "Where's the animation of
     the bands animating?" A change of reading already slid, on the width and
     dash transitions below, but a dial built fresh, which is every profile
     load and every switch of design, had its fill written in the same frame
     it was created, and a transition needs a value to leave from. The empty
     state is committed first, one read of the layout, so the fill grows out
     of the break the way a change does. */
  built=true; void host.offsetWidth;}
 host.title=o.title||'';
 var L=o.L, R=o.R, heavy=!o.read?0:(L.v>R.v?-1:R.v>L.v?1:0), diff=o.read?Math.abs(L.v-R.v):0;
 var col=heavy<0?L.c:R.c;
 /* the pole names only once there is a reading to name, so an unread dial
    prints nothing at all, which is what its gate asserts */
 var nl=host.querySelector('.ax-nl'), nr=host.querySelector('.ax-nr');
 nl.textContent=o.read?L.nm:''; nr.textContent=o.read?R.nm:'';
 nl.classList.toggle('on',heavy<0); nr.classList.toggle('on',heavy>0);
 host.querySelectorAll('.lb').forEach(function(lb){var left=lb.classList.contains('l'),e=left?L:R,on=left?heavy<0:heavy>0;
  lb.classList.toggle('on',on); lb.style.setProperty('--c',e.c);
  /* a dial just built states its figure, so what the document says is the
     reading from the frame it exists; one already standing counts to the new
     value beside its sliding fill */
  var b=lb.querySelector('b'); if(b){if(built)b.textContent=String(Math.round(e.v));else axCount(b,Math.round(e.v));}});
 if(!o.read)return;
 if(axdNow()==='arc'){
  host.querySelectorAll('.fill').forEach(function(f){var mine=f.classList.contains('lt')?heavy<0:heavy>0;
   f.style.stroke=col; f.style.strokeDasharray=(mine?diff:0).toFixed(1)+' 100';});
  var nd=host.querySelector('.ax-nd');
  if(nd){nd.style.transform='rotate('+((heavy<0?-1:1)*diff/100*90).toFixed(1)+'deg)'; nd.style.setProperty('--c',col);}}
 else{var f=host.querySelector('.fill');
  f.className='fill'+(heavy<0?' lt':' rt'); f.style.width=(diff/2).toFixed(1)+'%'; f.style.background=col;}}
function renderBal(r){
 axdPaint();
 var e=document.getElementById('bal'); if(!e)return;
 var b=r.balance;
 /* THE STRIP'S FOUR RULINGS HOLD in the one drawing: masculine on the left
    and feminine on the right, the break at the centre, the fill from the
    centre out toward the side the field leans, and the figures in pills.
    Masculine on the left is the opposite handedness from the body, which is
    what a mirror is, logged in BOOK-ERRATA. An engine refusal, read false, is
    not a reading and is never printed as one: the dial draws its ends and
    its break and nothing else, and the refusal keeps its full sentence one
    door in, in runBalDrill.

    The two figures are the two means as shares of their sum, so they add to
    100 like orientation's, and their difference is the lean this strip has
    always printed: 62 against 38 is the old "24% masculine". */
 var t=b.outMean+b.inMean, m=t?b.outMean/t*100:50;
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 /* sex at birth is a reference point and not a reading, drawn only when a
    person has given it, and mirrored with everything else */
 axDial(e,{read:!!b.read,tick:sx==='m'?'l':sx==='f'?'r':null,
  L:{g:GLYPH_M,nm:'masculine',v:m,c:seatCol('Solar'),
   t:'Masculine. Structure and direction, expressed outward. Not men: the codex is explicit about that.'},
  R:{g:GLYPH_F,nm:'feminine',v:100-m,c:seatCol('Throat'),
   t:'Feminine. Energy and receptivity, held inward. Not women: the codex is explicit about that.'},
  title:b.read
   ?'Balance. '+(b.lean===0?'even':Math.round(Math.abs(b.lean)*100)+' percent '+(b.lean>0?'masculine':'feminine'))
    +', masculine '+Math.round(m)+' against feminine '+Math.round(100-m)+'. Open this for the rest.'
   :'Balance. Not read yet. Neither side reaches 1, so no direction is named. Open this for the rest.'});}
/* ---- the rail's doors. one delegated set, on the rail itself ---- */
var _KBJ=false;
function wireKbJump(){
 if(_KBJ)return; _KBJ=true;
 var host=document.body; if(!host)return;
 /* #RAILTIP IS RETIRED. It was one of eight mechanisms doing one job, and
    once TIP landed it was the second tooltip on the same element, because
    both read data-tip off the same carriers. Two panels on one control is
    worse than the inconsistency it was part of.

    It also carried two defects of its own. It looked for a `.tn` child and
    the depth buttons carry a `.n`, so it drew an empty bold and a horizontal
    rule with nothing above it on half its carriers. And it measured 288 where
    the other panel measured 300, and sat absolute where the other sat fixed.
    Both go with it. The name and the action line are attributes now, read by
    the one tooltip, so nothing has to find them in the markup.

    What stays is the half that was never a tooltip: pressing one of these
    opens the knowledge page on its entry. */
 host.addEventListener('click',function(e){
  var el=e.target.closest?e.target.closest('.kbjump'):null; if(!el)return;
  var sec=el.getAttribute('data-kbs'), t=el.getAttribute('data-kbt');
  if(!sec||!t)return;
  if(typeof TIP!=='undefined')TIP.hide();
  KB_SEC=sec; KB_Q='';
  setTab(TAB.KNOW);
  var row=(kbRows(sec)||[]).filter(function(x){return x.t===t;})[0];
  if(row)kbOpen(row);});}

function railTop(r){
 var e=document.getElementById('railtop'); if(!e)return;
 /* "18 of 112 held" read as a score out of a total, which is a test rather
    than a mirror. Coherence and the tier it names are the line. The count
    was cut everywhere a count read against a total. */
 /* the ring draws empty and the tail carries a dash, for the same reason the
    core does: the word beside it already says not read yet, and a percentage
    beside that word is the contradiction the word exists to prevent. */
 /* THE BAND WORD SAYS WHAT IT MEANS, ON THE SCREEN.

    It printed "42%" and "Oscillating" side by side and the definition lived in
    a title attribute, which is not a route on the device most of this audience
    arrives on and is not a route for anybody in a hurry. A word this product
    puts on a person has to carry its own meaning where it is said.

    One line, in plain words, from the same table the drill reads. */
 var td=r.unread?null:TIER_BY[r.tier];
 /* THE BAND'S OWN COLOUR, here as on the plate. Ten tiers, ten colours,
    and the rail was drawing the heaviest seat's instead, so the rail and the
    plate disagreed about what colour a person's band is. High coherence is
    the good end, so it never reddens. */
 var tcol=(!r.unread&&TIERCOL[r.tier])||null;
 /* ONE CELL, THE SAME CELL AS THE DOCK'S. Ruled 26 September, CQ in
    TASKS.md: this corner should sit flush and uniform with the other
    readouts around the frame, not on its own alignment. It was a bare 30
    high chip centred against a 44 high word, so its top sat seven pixels
    below the word's and neither matched the boxed 44 high cells every other
    readout on the Field sits in. The ring and the word share one box now. */
 e.innerHTML='<span class="rt-cell">'+cr(r.darkB, r.unread?0:r.CQ, {size:'sm', label:'coherence',
   raw:r.unread?'\u2013':undefined, hot:false, color:tcol||undefined})
  /* THE TIER IS A CONTROL WHEREVER IT LIVES. Taking the word off the Field
     centre was ruled, and it took the only tappable route to the definition
     with it: there was exactly one tier control in the product and it was the
     one on the stage. A label never appears without what it owes, and the
     definition has to be reachable by tap rather than by hover, because the
     audience arrives on phones. So the word in the rail is the button now. */
  +'<button type="button" class="rt-t tierbtn" id="tier" title="'
  +esc(td?(td.def+'  '+td.energy+'  Toward: '+td.toward)
       :r.unread?'Nothing has been read yet. Write a story or set a charge.'
       :tierBuilding())+'"'
  +(tcol?' style="color:'+tcol+'"':'')
  /* while CQ is still filling there is no word, so the slot says what is
     left to answer rather than naming a band off laws nobody answered */
  +'>'+esc(r.unread?'not read yet':tierSay(r))+'</button></span>';
 /* THE DEFINITION LINE UNDER THE WORD IS GONE, ON HIS RULING. Round IT, his
    words: "get rid of that text that said the field builds more than it
    spends." That line was td.def printed on the rail, put there because hover
    is not a route on a phone. It still is not, and nothing is lost by the
    cut: the word is the button, and a tap opens runCompassDrill, which gives
    the definition, the behaviour and the direction in full. The title below
    carries the same three for a pointer. */
 /* and a tap gets the whole thing, because hover is not a route on the device
    most of this audience arrives on. */
 var tb=e.querySelector('#tier');
 if(tb)tb.onclick=function(){S.pin=null; runCompassDrill(); render();};
 /* the label never stands alone: hovering it gives the definition and the
    direction, and clicking the strip opens the whole thing. */
 e.title=td?(td.nm+'. '+td.def+' '+td.energy+' Toward: '+td.toward)
  :r.unread?'Nothing has been read yet. Write a story or set a charge.':tierBuilding();}
function render(){
 if(typeof paintUndo==='function')paintUndo();
 /* THE READING A PERSON MAY SEE, not compute()'s own. Everything render hands
    down, the rails, the glass bar, the wheel and the Body, draws and lists
    only the rungs of the chain this plan can see: sightR in ui/lock.js. */
 const r=computeSeen(), p=PEOPLE[S.who];
 lockTabs();
 /* the tier is a name for a person. it is not printed off the defaults, and it
    never appears without what it owes: the definition, the behaviour and the
    direction. Hover gives all three, the compass drill gives them in full. */
 /* the wiring lives with the button now, in railTop, because this ran before
    railTop wrote the markup and would have found nothing. */
 /* The heaviest seat and its charge go onto the body so a theme can derive
    its chrome from the reading. Punch reads both; Dark and Snow ignore them. */
 document.body.style.setProperty('--seat',seatCol(r.darkB));
 document.body.style.setProperty('--seat-w',Math.max(0,Math.min(1,(r.darkV||0)/10)).toFixed(2));
 railTop(r);
 if(typeof glowApply==='function')glowApply(r);
 /* benign against malignant, as percentages of one field */
 (function(){
  var mal=Math.max(0,Math.min(100,r.malig||0)), ben=100-mal;
  /* and the split is a reading of CQ, so it is not printed off the defaults
     either. Seventy two percent benign to somebody who has typed nothing is
     the same lie in a different shape. */
  if(r.unread){$('pol').innerHTML='<div class="bmnote">Nothing read yet, so there is '
   +'no split to show.</div>'; return;}
  /* malig is null while CQ is still filling. Read as 0 it drew a field 100
     per cent benign for somebody who had answered no law at all. */
  if(r.malig===null){$('pol').innerHTML='<div class="bmnote">Coherence is still filling, '
   +'so there is no split to show.</div>'; return;}
  $('pol').innerHTML='<div class="bmrow"><span class="bmk">Benign</span>'
   +'<span class="bmbar"><i style="width:'+ben.toFixed(0)+'%;background:'+PAL.Heart+'"></i></span>'
   +'<span class="bmv" style="color:'+PAL.Heart+'">'+ben.toFixed(0)+'%</span></div>'
   +'<div class="bmrow"><span class="bmk">Malignant</span>'
   +'<span class="bmbar"><i style="width:'+mal.toFixed(0)+'%;background:'+PAL.Root+'"></i></span>'
   +'<span class="bmv" style="color:'+PAL.Root+'">'+mal.toFixed(0)+'%</span></div>'
   /* This said "building more than it costs", which is the ledger sentence and
      the ledger belongs to the scale, where it is defined against the median.
      A field at CQ 39 read Incoherent in the rail and "building more than it
      costs" two inches away, because this line was reading the benign split
      and not coherence at all. It says what it actually measures. */
   +'<div class="bmnote">'+(ben>=mal?'most of what is held is benign'
     :'most of what is held is malignant')+'</div>';})();
 /* The how to block sat permanently under the wheel repeating what the depth
    buttons already say. Ruled out. The text survives as the depth button's own
    tooltip, where it is asked for rather than always on. */
 (function(){var e=$('howto'); if(e){e.textContent=''; e.style.display='none';}})();
 /* ORIENTATION. It read left to right, which draws two competing quantities and
    makes the reader do the subtraction. It now grows from the centre out, so
    the thing a person sees is the lean itself: which way, and how far. Fifty
    fifty is a bar with nothing sticking out either side.
    The note under it came out on the owner's ruling. The numbers are on the
    bar and the rest is in the tooltip. */
 (function(){
  var pb=$('polbar'); if(!pb)return;
  /* AND IT SILENCES ITSELF ON AN UNREAD FIELD, like every other surface that
     prints a reading. #pol two inches above this one has done it since the
     ruling and this one had not caught up, so selecting somebody who has
     entered nothing printed "84" benign against "16" malignant with the bar
     reaching 34 per cent of the way out, directly under a rail correctly
     saying nothing had been read. Measured on loadP(0) in the shipped build.

     The bar is left in the document with nothing in it rather than hidden,
     because an empty trough is the honest picture of an empty field and the
     Field's own layout is measured against its height. */
  /* one drawing with balance, axDial above. The dial is left in the document
     with nothing in it rather than hidden, because an empty trough is the
     honest picture of an empty field, and the Field's own layout is measured
     against its height */
  var gB='<circle cx="12" cy="12" r="8"/><path d="M8.6 14.2l2.6-3.1 2.2 2 2-3.4"/>';
  var gM='<path d="M15.6 18.6A8 8 0 1 1 18.6 15.4"/><path d="M8.6 9.9l2.6 3.1 2.2-2 2 3.4"/>';
  var L=r.unread?{read:false}:leanRead(r);
  /* BENIGN AND MALIGNANT GET SYMBOLS, ruled. Benign is a closed ring with a
     rising stroke inside it: contained, and going up. Malignant is the same
     ring broken at its lower right with the stroke falling out of the gap:
     one form, two states, which is the reading. */
  var spec={read:L.read!==false,
   L:{g:gB,nm:'benign',v:L.ben||0,c:PAL.Heart,t:'Benign. Charge that is held and is not costing you.'},
   R:{g:gM,nm:'malignant',v:L.mal||0,c:PAL.Root,t:'Malignant. Charge that is held and is taking something from you.'}};
  /* and it silences itself on an unread field, and on a field whose CQ is
     still filling with no story cue yet, which has no lean to show either:
     leanRead says so rather than printing 100 to 0 */
  spec.title=r.unread?'Orientation. Nothing read yet, so there is no lean to show.'
   :L.read===false?'Orientation. Coherence is still filling, so there is no lean to show.'
   :(L.cues?'Orientation. '+L.cues+' cue'+(L.cues===1?'':'s')+' from the story so far. '
     :'Orientation. No story yet, so this is the field alone. ')
    +'Benign '+L.ben.toFixed(0)+', malignant '+L.mal.toFixed(0)+', read from '+L.src
    +'. The fill grows from the centre toward the heavier end: the further it reaches, the harder the lean.';
  axDial(pb,spec);})();
 /* the key. three quotients, three elements. */
 /* The key sat on top of the wheel as a 288px card. It is now a strip in
    flow above the canvas, one ring and one word per element, and each is a
    door to the reading on the right. Nothing on the stage covers the wheel. */
 /* THE READINGS ARE BARS, round OG. His words, on the circles under Root
    Energetics: "we've got a bunch of icons all varying size. So for the root
    energetics, instead of the circles, have those horizontal bars stacked on
    top of each other with the text, with their name, and the color of the bar
    based off of the percent. This should tighten up that root energetics
    area." Six rows, one reading each, still buttons that open the reading on
    the right and still carrying the sentence that says what each one is.

    What the circles had learned stays true here. CQ leads, DQ is the shadow
    and is read the other way up (a high figure is the wrong end, so its bar is
    coloured from its own inverse), the other four are what moves through a
    person and high is the good end, so none of them reddens past a threshold
    the way a shadow figure does. The colour is the wheel's own ramp, cqRamp,
    alarm at the floor, slate at the median, the accent at the crown, so the
    bar and the core above it agree about what a figure means. SQ stays off
    this strip (EZ: "SQ is a total sum of the DQ anyway") and on the glass
    bar. Accuracy keeps its circle on the stage (round LR). An unread field
    draws an empty bar and a dash, never a number nobody entered.
    The scale is kept as it was printed: CQ and DQ in percent, the other four
    out of one. The bar fills to the same figure either way. */
 $('key').innerHTML=
   rbRow('cq','Coherence',r.unread?0:r.CQ,r.unread?'\u2013':Math.round(r.CQ)+'%',
    {unread:r.unread,fk:'laws',ic:'cq',pull:r.PULL,title:'Coherence. '+(r.unread?'Not read yet.'
      :(r.complete?'The '+SI.length+' laws, summed.':tierSay(r)+'.')
       +(r.PULL>0.003?' Decoherence is holding '+(r.CQ-r.EX).toFixed(0)+' points of it back, the hatched foot of the bar, '
        +'so what gets out is '+Math.round(r.EX)+'.':''))})
  +rbRow('dq','Decoherence',r.DQ,r.unread?'\u2013':Math.round(r.DQ)+'%',
    {unread:r.unread,bad:true,fk:'shadow',ic:'dq',hash:rbSeatShadow(),title:'Decoherence. All the charge on all 112 addresses, '
       +'against the most they could hold. The seven marks are the seats, root to crown, each as high as the charge on its '
       +'own addresses, and a seat holding half of what it could stands full height.'});
 /* TWO KINDS, TWO STRIPS. Ruled, and the grouping is his: CQ, DQ and SQ are
    one kind of reading. Vitality, awareness, will and flow are another, and
    they go lower left.

    Eight chips on one line wrapped to two rows of unequal length, which is
    what he circled and called a jumble. They are not one list: the first three
    are the instrument reading itself, the last four are what is moving through
    the person. Splitting them by kind is what makes the row mean something
    rather than just fit. */
 (function(){
  var f=flSpeed(), lo=$('keylo'); if(!lo)return;
  /* SYMBOLIC ICONS AND NO LABELS, ruled in the same breath as the letters
     above. These four had no icon because the word was always beside them,
     and the word is what is being removed. Every title now carries the scale
     as well as the name, because the tooltip is the only place the name lives
     and a name without its scale is the thing the copy editor rule stops. */
  lo.innerHTML=
   rbRow('xyz','Vitality',r.X*100,r.unread?'\u2013':r.X.toFixed(2),
    {unread:r.unread,fk:'core',ic:'vitality',title:'Vitality. '+(r.unread?'not read yet':r.X.toFixed(2)+' of 1')
       +'. How much energy is left once apathy and the decoherence are taken off. Seventy percent of it is what '
       +'decoherence leaves, and decoherence is at '+Math.round(r.DQ)+'.'})
  +rbRow('xyz','Awareness',r.Y*100,r.unread?'\u2013':r.Y.toFixed(2),
    {unread:r.unread,fk:'core',ic:'awareness',title:'Awareness of the instrument. '+(r.unread?'not read yet':r.Y.toFixed(2)+' of 1')
       +'. How strong what you mean is, and how little of it gets bent on the way out.'})
  +rbRow('xyz','Will',r.Z*100,r.unread?'\u2013':r.Z.toFixed(2),
    {unread:r.unread,fk:'core',ic:'will',title:'Will. '+(r.unread?'not read yet':r.Z.toFixed(2)+' of 1')
       +'. How much of your integrity gets through the charge you are carrying.'})
  +rwRadRow(r)
  +rbRow('flow','Flow',f*100,r.unread?'\u2013':f.toFixed(2),
    {unread:r.unread,fk:'seats',ic:'flow',wave:rbSeatPass(),rate:lerp(PUL_LO,PUL_HI,clamp((+r.DQ||0)/100,0,1)),
     title:'Flow. '+(r.unread?'not read yet':f.toFixed(2)+' of 1')
       +'. How much gets from the base of your spine to the top of your head, each seat passing on part of what it gets. '
       +'The wave runs root to crown. A clean wave that spans the whole range is every seat passing everything; a seat '
       +'that holds charge back roughens the wave where it sits and shrinks it from there on.'});})();
 /* who, and what is running hottest in them. */
 (function(){
  function row(k,n,pc){return '<div class="tierow"><span class="tk">'+k+'</span>'
   +'<span class="tn">'+n+'</span><span class="tp">'+pc+'</span></div>';}
  /* THE ARCHETYPES AND THE DOMAINS CAME OFF THIS CARD. Round IT in TASKS.md,
     his words: "The archetypes, the domains, that's not what's important.
     What is important is that we're tracking all the things that are the most
     intense to a person. So this should be the top things running, almost
     like the top highest three running, and then the highest ones running per
     band. Since we're showing the animation of the tension and everything
     else, it just makes sense that this reflects that."

     Nothing is lost by the cut. Both lists are the left rail's own Awareness
     section, whole, and they were a second copy of it here.

     THE THINGS ARE ADDRESSES, BECAUSE THE TENSION IS DRAWN ON ADDRESSES. The
     fringes in ui/wheel.js bend the ring at each of the 112 by its charge, and
     hotTrack() is what says which way each one last moved. So the three rows
     are the three heaviest addresses carrying any charge at all, and each one
     says expanding, collapsing or steady off hotDir(), the word and the ink
     Analytics already prints beside the same address in its Running hot list.
     They are not cut at RUNHOT_AT, the fringes' own line at five: measured
     across the roster, eight of fifteen profiles have nothing past five,
     Marcus's heaviest is 2.5, and a card that goes blank for most people is
     not tracking what is most intense to them. The badge carries the charge,
     so past five reads on the ring itself.

     And one row per assemblage point, Root to Crown in BANDS order, the
     heaviest address at each, so the card runs up the body the way the ring
     does. A point carrying nothing prints no row: a list of none says nothing
     held seven times. Each row opens runNodeDrill through the delegated .ad-r
     handler further down this file, the one every address row uses. */
  if(typeof hotTrack==='function')hotTrack();
  var lit=W.filter(function(n){return (+n.sq||0)>0;})
   .sort(function(a,b){return b.sq-a.sq;});
  /* EACH ROW SAYS WHICH IT IS. Round IX, his words: "create new labels that
     reflect the content, like primary, secondary." The right of each row
     printed the direction word, and on a record nobody has touched since it
     was opened hotDir() says steady for all 112, so every screenshot of this
     card read steady three times: a column that said nothing moved, which is
     the list of none the comment above already refuses. The slot carries the
     rank now. The direction is kept where it is information: an address that
     moved on its last change still says which way, after the rank, in the
     ink Analytics gives the same word.

     PER ROW AND NOT AS THE TWO HEADINGS, which was the other reading of his
     sentence, and it would print something false. Primary over these three and
     Secondary over the list by point would call the second list lesser, and it
     is not: it is the same addresses cut a second way, and on Marcus
     Co-Dependency and False Love sit in both. */
  var RANK=['Primary','Secondary','Tertiary'];
  var top=lit.slice(0,3).map(function(n,i){
   var d=typeof hotDir==='function'?hotDir(n):'steady';
   return addrRow(n,{em:RANK[i]+(d==='steady'?'':', '+d),
    ink:typeof anaHotInk==='function'?anaHotInk(d):null});}).join('');
  var per=BANDS.map(function(b){
   var n=lit.filter(function(x){return x.b===b;})[0];
   return n?addrRow(n,{em:b,ink:seatCol(b)}):'';}).join('');
  /* the rail's own empty sentence for a field with nothing charged, the one
     the glass bar prints on its Stories circle, and nothing at all on an
     unread field, where the doors above already say where to start */
  /* "Top three" was a count, and the rows under it carry their rank now, so
     the heading names the order instead, and the two headings read as one
     list cut two ways: by weight, and by assemblage point. */
  var run=r.unread?'':lit.length
   ?'<div class="pm-eye" style="margin-top:14px">By weight</div><div class="ad-rows">'+top+'</div>'
    +'<div class="pm-eye" style="margin-top:12px">By assemblage point</div><div class="ad-rows">'+per+'</div>'
   :'<div class="pm-eye" style="margin-top:14px">By weight</div><p class="rnone">Nothing is carrying charge yet.</p>';
  var held=W.filter(function(n){return n.sq>=4;}).length;
  var inst=W.filter(function(n){return n.pole>=4;}).length;
  /* WHERE TO START. Only while there is nothing to read, because a call to
     action that survives the action is furniture. Two doors and a line saying
     what each one is for, so nobody has to remember a term to find one. */
  (function(){var st=$('start'); if(!st)return;
   /* ONE SET OF DOORS PER SCREEN. The summary carries the same four, and the
      summary is the opening surface, so on that tab the rail was printing a
      second copy of them beside the first. The rail keeps them everywhere
      else, because everywhere else there is nothing on screen offering a way
      in. */
   if(!r.unread||S.tab===TAB.SUMMARY){st.innerHTML='';st.hidden=true;return;}
   /* the doors and their wiring moved to component.js, because the summary
      needs the same four and two sets of one id is a broken document. */
   st.hidden=false;
   st.innerHTML=startHTML();})();
  /* THE PERSON'S NAME, NOT THE WORD YOU. Round IT, his words: "where it says
     reading and then it says you: first off, change you to the person's
     name." A worked example already printed its own name here. The person's
     own record printed the literal You whatever they had called themselves in
     Settings, which is where account.js writes CURP.name. The first word of
     it, the way sumPlate on the Summary prints the same name over the same
     reading, so the two surfaces call a person one thing. A record nobody has
     named is still called You, because that is the name pNew gave it. */
  var who=p.you?(String((CURP&&CURP.name)||'').trim().split(/\s+/)[0]||'You'):p.nm;
  /* THE AGE AND ROLE LINE IS GONE, ON HIS RULING. Round IX, his words: "get
     rid of that 44 creative director. That's nonsense junk." It was the worked
     example's own casting note, p.age and p.role, and it read nothing: a
     person's own record never printed it at all. Summary's plate and the
     profile picker are untouched, because he struck this card.

     A SUMMARY WINDOW TAKES ITS PLACE, "underneath Marcus's name", and what it
     says was not specified, so it is the band's own lived line and not new
     copy. TIERDEF carries four lines per band. def is the one he struck off
     this rail in round IT, toward is the instruction the compass drill
     already gives in full, soma is the codex's register, and energy is what
     the band is like to live in, which is the one line a summary of a person
     owes that neither list under it says: they say where the charge is, this
     says what it is costing day to day. The band word leads it in the band's
     colour because a behaviour with no band named is a sentence about nobody,
     and the band word with no behaviour is the judgement the voice rules
     forbid. It is the tier button's door as well: a tap opens
     runCompassDrill, which carries the definition and the direction the
     window leaves out. Nothing while unread, where the doors say where to
     start; and while CQ is still filling there is no band to name, so it
     says what is left, in the same sentence the tier button's title uses. */
  var tdw=r.unread?null:TIER_BY[r.tier];
  var win=r.unread?'':'<button type="button" id="psum" class="psum" '
   +'style="display:block;width:100%;margin:10px 0 0;padding:10px 12px;text-align:left;'
   +'font:inherit;font-size:13.5px;line-height:1.55;color:var(--mid);cursor:pointer;'
   +'background:var(--panel);border:1px solid var(--edge);border-radius:var(--r-s)">'
   +(tdw?'<b style="font-weight:600;color:'+(TIERCOL[r.tier]||'var(--ink)')+'">'
      +esc(tdw.nm)+'.</b> '+esc(tdw.energy)
    :esc(tierBuilding()))
   +'</button>';
  $('person').innerHTML='<h3>'+esc(who)+'</h3>'
   +win
   /* THE EMPTY STATE OUTLIVED THE EMPTINESS. says was printed whenever it
      existed, and the blank persona's says is the words "Nothing has been
      entered yet". A person who then entered charge got a live reading beside
      a sentence swearing they had entered nothing. It is an empty state, so it
      goes when the state is not empty. */
   +(p.says&&!(p.you&&!r.unread)?'<p class="psay">'+esc(p.says)+'</p>':'')
   +run
   +'<div class="pm-eye" style="margin-top:12px">Field</div>'
   /* "nothing" was being printed over charge a person had entered themselves.
      If something sits under the line, the row says so rather than reporting
      a zero that is not true. */
   /* "nothing above the line" plus "74 under it" wrapped into four lines in a
      narrow column and read as broken text. One short value, one short note. */
   /* SAID OUT LOUD. These read "Held nothing" and "Installed nothing", which
      is the schema talking. A person says what is there and what is not. */
   +row('Carrying',held?held+' addresses':'nothing yet',
     held?'':(r.under?r.under+' sitting under the line':''))
   +row('Filled in',inst?inst+' addresses':'nothing yet','')
   +row('Heaviest',r.darkB,r.darkV.toFixed(1))
   +row('Most shut',r.weakL.nm,'at the '+r.weakL.b.toLowerCase());
  var ws=$('psum'); if(ws)ws.onclick=function(){S.pin=null; runCompassDrill(); render();};})();
 railStack(r); renderBal(r);
 /* EVERY ONE OF THESE SAYS WHAT IT IS OUT OF. His instruction, and this
    panel broke it five times in six lines: integrity 1.9, intention 1.9, pole
    in 0.00, overshoot 0.00, distortion 10.0, on four different scales, with
    nothing to measure any of them against. */
 /* V21. Five words, and none of them defined anywhere on the screen. Each
    line now carries a plain sentence on its title, true to compute.js, and
    "pole in" is "pole", the word the Summary tile already uses for it. */
 var ins=function(t,line){return '<span title="'+esc(t)+'">'+line+'</span><br>';};
 $('rows').innerHTML='<span class="k">Instruments</span><br>'
  +ins('How well you keep the 21 laws, lifted by the opposites installed and pulled down by overshoot.',
    'integrity <b>'+r.Ig.toFixed(1)+'</b> of 10')
  +ins('The same laws read seat by seat, up the body.',
    'intention <b>'+r.It.toFixed(1)+'</b> of 10')
  /* JOUISSANCE WAS ON EIGHTY ONE SCREENS. A French psychoanalytic term, printed
     as an instrument label to a person who has never heard it, with no gloss
     anywhere in the product. One word per concept, and the word has to say
     what the thing does: JQ is the opposite driven past the point where it
     serves. That is overshoot. The codex keeps its own word. */
  +ins('How far the installed opposites outweigh the charge, on average, across your body.',
    'pole <b>'+r.poleMean.toFixed(2)+'</b> of 10')
  +ins('How far installed opposites have been pushed past the point where they help.',
    'overshoot <b>'+r.JQ.toFixed(2)+'</b> of 10'
    +(r.excess.length?', '+r.excess.length+' address'+(r.excess.length===1?'':'es')+' overshot':''))
  +'<span title="'+esc('How much the patterns running in you bend what you mean. More patterns, '
    +'and deeper ones, bend it more.')+'">distortion <b>'+r.dist.toFixed(1)+'</b> of 10</span>';
 /* what is running */
 const rows=[].concat(r.sups,r.hys,r.cxs,r.sabs);
 const TIERNM={sup:'Character',hy:'Hyper-complex',cx:'Complex',sab:'Saboteur'};
 const TIERC={sup:PAL.Root,hy:PAL.Sacral,cx:PAL.Solar,sab:PAL.Throat};
 const NOTE={sup:'you cannot see it as separate from you',hy:'others see it, you do not',
  cx:'two saboteurs compounded',sab:'a cluster of addresses co-firing'};
 $('run').innerHTML=rows.length
  ? rows.slice(0,4).map(function(o,i){
     return '<div class="rcard" data-i="'+i+'">'
      +'<div class="bar" style="background:'+TIERC[o.kind]+';width:'+(o.w*10).toFixed(0)+'%"></div>'
      +'<div class="tier" style="color:'+(o.over?'var(--alarm)':TIERC[o.kind])+'">'+TIERNM[o.kind]
      +(o.over?', overshot':', collapsed')+'</div>'
      +'<div class="nm">'+esc(o.nm)+'</div>'
      /* d, not sub. sub is the clinical correspondence and is internal: this
         line printed "bipolar and ADHD" to the person it was about, with no
         clinician and nothing attached. Also: jouissance was a French
         psychoanalytic term dropped on a stranger with no gloss. */
      /* plain. The sub here is a reading about the person, not a subheader:
         "you cannot see it as separate from you" came back as "You Cannot See
         It As Separate From You", which is a sentence wearing a title. */
      +'<p class="sub plain">'+(o.over?'the cure done past the point where it helps, and not able to stop.'
        :esc(o.auth||o.d||NOTE[o.kind]))+'</p>'
      +'<div class="w">'+crPat(o,'md')+'</div></div>';}).join('')
    +(rows.length>4?'<div class="rnone">and '+(rows.length-4)+' more below</div>':'')
  : (r.locked&&r.locked.length?'':'<div class="rnone">Nothing is running.</div>');
 /* WHAT THE PLAN CANNOT SEE IS SAID, NOT LEFT AS AN EMPTY LIST. A person on
    free has saboteurs running like anybody else, and "Nothing is running"
    under their own reading would be a false statement about them, which is the
    worse thing a lock can do. So the section says it is locked and what
    unlocks it, and a person who sees some of the chain gets one line for the
    first rung they do not. */
 if(r.locked&&r.locked.length)$('run').innerHTML+=lockPanelHtml(lockKind(r.locked[0]),{brief:true});
 $('run').querySelectorAll('.rcard').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];
  var same=S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
  S.pin=same?null:o; runDrill(S.pin); render();});});
 /* THE RAIL'S DOORS AND THEIR TOOLTIPS, WIRED ONCE.

    Delegated on the rail rather than bound per row, because the rail is
    rebuilt on every render and a listener per row per frame is a leak with a
    name. Hover shows the meaning in the product's own tooltip. Press takes
    the person to the knowledge page with that entry already open, so a word
    they did not know is two gestures from being a word they do. */
 wireKbJump();
 renderAcc(r); renderSpirit(); renderRootSum(); renderPol2(r); syncMx();
 /* the dock's circles move into their values rather than snapping, and only
    after all three of its hosts are written, so one stagger runs across the
    two rows in reading order. ui/component.js, crMotion. */
 crMotion([$('acc')]); rbMotion([$('key'),$('keylo')]); rbRate(r); rlArcs(r);
 /* the six rows hang on one wire, ui/railwire.js, dressed after the rows have
    been written and have taken their motion */
 rwDress(r); railFirstSight();
 /* and the rails' readings on the same beat, each list sweeping in its own
    order the first time it is seen and moving only when its values do */
 crMotion([$('railtop'),$('person'),$('stack')]);
 $('fire').innerHTML=rows.length
  ? '<div class="pm-eye" style="color:var(--gold);margin-bottom:8px">Running now</div>'
    /* THE WEIGHT IS A BADGE, AND THE BADGE CARRIES THE TIER. FV in TASKS.md,
       his words: "I've got Running, and I've got these numbers, but they
       don't look like pills, and I don't see their icons." Each row printed
       a name and a bare bold figure, the one list on the rail still doing what
       the badge ruling retired: "Lethargy 5.4. Disconnection 3.1." It is the
       badge now, crBadge, the ring filled to the weight over ten and the
       figure in its pill at the lower right. The mark inside is the tier's
       own, CHAINGLYPH, the one the glass bar and the stack tabs give the same
       four, because this list mixes character, hyper complexes, complexes and
       saboteurs and a name alone does not say which. The ring is the seat the
       pattern sits on, and an overshoot or a weight past nine goes to the
       alarm colour, as the ring on its Flow card already does. */
    +rows.slice(0,8).map(function(o,i){
     var b=(leaves(o)[0]||{}).b||'Heart', hot=o.w>=9||!!o.over;
     return '<div class="it run-it'+(S.pin===o?' pin':'')+'" data-i="'+i+'">'
      +crBadge(b,o.w*10,{size:'sm',raw:o.w.toFixed(1),glyph:'<path d="'+CHAINGLYPH[o.kind]+'"/>',
        color:hot?ALARM:undefined,
        title:TIERNM[o.kind]+'. '+o.nm+', weight '+o.w.toFixed(1)+(o.over?', overshot':'')})
      +'<span class="run-n">'+esc(o.nm)+'</span></div>';}).join('')
    +(rows.length>8?'<div class="it"><span>and '+(rows.length-8)+' more</span></div>':'')
  : (r.locked&&r.locked.length===SEE_ORDER.length
    ? '<div class="pm-eye" style="color:var(--gold);margin-bottom:8px">Running now</div>'+lockPanelHtml('sab',{brief:true})
    : '<div class="pm-eye" style="color:var(--gold)">Nothing running</div>');
 crMotion([$('fire')]);
 $('fire').querySelectorAll('.it[data-i]').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];S.pin=(S.pin===o)?null:o;runDrill(S.pin);render();});});
 /* the glass bar's rings read the reading this render just took, not a
    second one, and only where the bar is */
 if(S.tab===TAB.FIELD)fbRead(r);
 else if(S.tab===TAB.ENERGY)renderMap(r);
 /* THE CHARACTER PAGE, round LP, the six masks as pixel grids of their own
    (ui/character.js). It was renderMasks, the Body's figure with the masks
    alone on it, which he ruled replaced in full. */
 else if(S.tab===TAB.MASKS)renderCharacter(r);
 else if(S.tab===TAB.SUMMARY)sumRender();
 else if(S.tab===TAB.ANALYTICS)anaRender();
 /* a release, an undo and a profile change all move what the Story's
    release column offers and what its vault holds, and none of them passes
    through the Story's own code. Without this the vault read nought after a
    run until the tab was left and entered again. */
 else if(S.tab===TAB.STORY&&typeof stFieldPaint==='function')stFieldPaint();}

/* ---- the loop ---- */
let last=0;
function loop(ts){
 if(!REDUCED)S.t+=(last?Math.min(.05,(ts-last)/1e3):0);
 last=ts; 
 /* the bars' own motion runs here and nowhere else: nothing is written when
    none of them is moving. ui/component.js, rbTick */
 if(RB_LIVE)rbTick(ts);
 var r=computeSeen();
 /* the wheel breathes, so it is drawn every frame. A rendition does not move,
    and ringsDraw builds it only when its signature does */
 if(S.tab===TAB.FIELD){if(fviewOn())ringsDraw(r);else draw(r);drawAura(r);renderPol2(r);
  /* the rail's wire runs on the Field's rate, ui/railwire.js, and nothing it
     does is drawn on the stage */
  rwFrame(r);}
 /* only the Body stands on the wash now. The Masks door did because it was
    the Body's figure; the Character page draws its own grids on an opaque
    stage, so it takes the still wash every other page takes. Round MQ gave
    the Masks page its own breath, but on a CSS animation over its own
    inline SVG (see .chv-glow, .chv-rim-on in head.html), never in this loop
    and never touching bgaura, so this line stays true of the canvas wash. */
 else if(S.tab===TAB.ENERGY){drawAura(r);}
 /* the Story's instrument draws on this frame and no other, so leaving the
    tab stops it without a second loop to remember to cancel. It paints only
    while something on it is moving, ui/storyui.js. */
 else if(S.tab===TAB.STORY){if(typeof stFrame==='function')stFrame(ts);auraWhole();}
 else auraWhole();
 requestAnimationFrame(loop);}

/* ---- init ---- */
/* the engine ships with a no-op store. this is the browser's one. It must go
   through bindStore(): assigning STORE directly left STORE_BOUND false, so
   pPersist() refused every write and every save in the shipped app reported
   a failure it had caused. Nothing was ever written. The functional gate now
   saves, reloads and reads back. */
try{ localStorage.getItem(PKEY);
 bindStore(function(k){return localStorage.getItem(k);},
           function(k,v){localStorage.setItem(k,v);}); }catch(e){}
/* THE PAYWALL SEAM, round NW, bound the same way bindStore is just above: the host hands the
   UI one function and the UI stays ignorant of what is on the other side of it. planOpen in
   ui/panels.js already calls PLAN_HOST(what,tier) and already says "Billing is not connected
   yet." when nothing answers; this is the real answer, and it is still the only thing this
   file does on top of what ui/auth.js hands back, because ui/auth.js stays the one file that
   calls fetch.

   'portal' (Manage billing) is built now, the same way. It used to say "Managing billing from
   here is not built yet. Email support to change or cancel a plan." because the server had
   only /v1/billing/checkout; it has /v1/billing/portal beside it now, and authPlanPortal is
   its caller. The two cases share one redirect so the guard on it is written once. Anything
   else handed to the seam is refused by name rather than read as a checkout with no tier. */
bindPlan(function(what,tier){
 var ask=(what==='checkout')?authPlanCheckout(tier):(what==='portal')?authPlanPortal():null;
 if(!ask){ status('Could not open the billing page. Nothing has changed.','fail'); return; }
 var page=(what==='portal')?'billing':'checkout';
 ask.then(function(r){
  if(!r.ok){ status(r.say,'fail'); return; }
  /* the redirect itself is the one step nothing here can rehearse: a browser that refuses to
     navigate (a locked down kiosk mode, an extension) must say so rather than sit on a button
     that looks pressed and did nothing. */
  try{ location.href=r.url; }
  catch(e){ status('Could not open the '+page+' page. Nothing has changed.','fail'); }});});
/* One delegated handler for every address row the drills render, so a row
   opens the address it names instead of being a dead end. */
document.addEventListener('click',function(e){
 var st=e.target.closest?e.target.closest('.stk-t[data-st]'):null;
 if(st){STACK_TAB=st.getAttribute('data-st');railStack(computeSeen());return;}
 var fr=e.target.closest?e.target.closest('.stk-r[data-fet]'):null;
 if(fr){var fc=CHILD[+fr.getAttribute('data-fet')]; if(fc){S.pin=null; runFetterDrill(fc);} return;}
 var sr=e.target.closest?e.target.closest('.stk-r[data-sk]'):null;
 if(sr){var rr=computeSeen(), o=({sab:rr.sabs,cx:rr.cxs,hy:rr.hys,sup:rr.sups}[sr.getAttribute('data-sk')]||[])[+sr.getAttribute('data-si')];
  if(o){var same=S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind; S.pin=same?null:o; runDrill(S.pin); render();} return;}
 var kb=e.target.closest?e.target.closest('.kb[data-q]'):null;
 if(kb){S.pin=null;ANA_PICK=null;runQDrill(kb.getAttribute('data-q'));return;}
 var gate=e.target.closest?e.target.closest('.gate-r[data-gate]'):null;
 if(gate){runGatesDrill(gate.getAttribute('data-gate'));return;}
 if(e.target.closest&&e.target.closest('#pol2')){
  S.pin=null;ANA_PICK=null;
  /* either end of the cone opens its own roster. the shaft opens the reading. */
  var pe=e.target.closest('[data-polend]');
  if(pe)runPoleDrill(pe.getAttribute('data-polend')); else runCompassDrill();
  return;}
 if(e.target.closest&&e.target.closest('#bal')){S.pin=null;ANA_PICK=null;runBalDrill();return;}
 /* the two dial designs, FJ: a press picks one for both dials */
 var axb=e.target.closest?e.target.closest('[data-axd]'):null;
 if(axb){axdSet(axb.getAttribute('data-axd'));return;}
 var row=e.target.closest?e.target.closest('.ad-r[data-addr]'):null;
 if(!row)return;
 var n=BY[+row.getAttribute('data-addr')];
 if(!n)return;
 /* No render() here. runNodeDrill paints the drill itself, and on Analytics a
    render would run anaDrill straight over the top of it: the handler fired,
    the node resolved, and the old drill reappeared unchanged. ANA_PICK is
    cleared so the next render does not resurrect it either. */
 if(typeof ANA_PICK!=='undefined')ANA_PICK=null;
 S.pin=null; runNodeDrill(n);});

/* ============================================================
   START UP IN SEGMENTS, SO ONE FAILURE COSTS ONE FEATURE.

   Ruled after the third failure in a row: "can't you write a wrapper for it,
   so it stops breaking, so you're not bouncing back and forth between a
   broken display area."

   It was a straight run of calls. Anything that threw in any of them took
   every line after it with it, which is how one bad module became a screen
   with no navigation and no centre. The navigation is in the document now and
   cannot vanish, and this is the other half: each step runs inside its own
   guard, so a step that fails costs what that step does and nothing else.

   step() reports rather than swallowing. A silent catch would be worse than
   the crash it replaces, because the product would then be quietly missing a
   piece with nothing anywhere saying so. Every failure is recorded, named,
   and put where the boot guard can print it.

   The order still matters: this is not permission to reorder them. It is
   permission for the screen to survive one of them.
   ============================================================ */
var BOOT_FAILED=[];
function step(nm,fn){
 try{ fn(); return true; }
 catch(e){
  BOOT_FAILED.push(nm+': '+((e&&e.message)||e));
  try{ if(window.console)console.error('[atuned] '+nm+' failed',e); }catch(e2){}
  return false; }}
/* the guard asks for this when it decides whether the app is usable */
window.__bootFailures=function(){return BOOT_FAILED.slice();};

step('layout',layout);
step('matrix key',mxKey);
step('rail sections',wireSections);
step('left column fold',colFold);
step('right column fold',railFold);
step('tools bar fold',fbShutWire);
step('first profile',function(){loadP(0);});
/* A saved record is the person's own state, so it wins over the demo "You"
   that loadP(0) just installed. Nothing read the store at boot before, so a
   reload always came back to the demo. */
step('the stored record',function(){
 try{ PROFILES=pStore(); }catch(e){ PROFILES=[]; }
 if(!PROFILES.length){ pNew('You'); }
 /* AN EMPTY LIST IS TWO DIFFERENT THINGS, AND ONLY ONE OF THEM IS SILENT.
    A first visit gets a blank "You" and nothing to say. A store pStore could
    not read also arrives here as an empty list, and it used to get the same
    blank and the same silence while pNew wrote over the only copy of the
    person's record. pStore sets the bytes aside now (engine/schema.js,
    storeSetAside), so the blank is safe to make and the person is told why
    they are looking at one. A fail stays on the status line until replaced. */
 var unread=storeUnread();
 if(unread)status(unread.key
  ?'Your saved profiles could not be read, so this is a new blank profile. '
   +'The unreadable copy is kept in this browser, untouched.'
  :'Your saved profiles could not be read or copied. Nothing saves in this '
   +'session, so they stay as they are.','fail');
 CURP=PROFILES[0];
 /* loadP(0) cached a blank profile under the persona name a moment ago, and
    replacing PROFILES left that cache pointing at an object no longer in the
    list. Picking a reference case and coming back sent CURP to the orphan,
    and every write after that reported success onto an array nobody reads.
    Reproduced: two edits, a persona round trip between them, the second one
    gone after a reload with no error shown. The cache points at the record. */
 PROF_BY[PEOPLE[0].nm]=CURP;
 loadProfile(CURP);
 /* AND THE MIRROR IS FILLED FROM IT, because loadProfile writes S and nothing
    else. PEOPLE[0] is what loadP(0) reads the person's field back out of, and
    at boot it still held the persona table's zeros, so the first visit to a
    worked example and back put zero charge in S, saveProfile copied it onto
    the record, and the next save wrote it over the disk. Measured: 7.24 on
    disk across a reload, 0.00 in S on return from James, 0.00 on disk after
    one save. The story commit's missing saveYou was the same loss inside a
    session; this is it across one. mirrorYou and not saveYou, because nothing
    has changed yet and a boot has no business writing the store. */
 mirrorYou();
 syncCh(); syncLw(); syncSoul();
});
/* THE APP OPENS ON THE FIELD, on the owner's ruling of 19 September, which
   reverses the earlier one that opened it on Summary.

   This line is what actually decides the opening surface. The default on S is
   only what holds until this runs, and it has said FIELD the whole time, so
   changing the default alone would have looked right in the source and done
   nothing on screen. Both say Field now, as they did before the Summary
   ruling, and the comment says why rather than leaving the next reader to
   wonder which of the two is the live one. */
/* THE FIELD OPENS DRAWN THE WAY THIS PERSON LEFT IT. Read here and not when
   ui/rings.js loads, because the browser's store is bound above and a read
   before that meets the engine's empty one, which would put everybody back
   on the wheel. Its own step, so a store that throws costs the switch and
   not the start up. */
step('field view',function(){FVIEW=fviewGet(); fviewPaint(S.tab);});
/* THE PRACTITIONER DOOR, round LL, read off the stored record once it is
   loaded above. applyUiPrefs is not called at start up, so without this the
   switch read on after a reload while the door stayed shut. Its own step, so
   a throw here costs the door and not the start up. */
step('practitioner door',function(){pracPaint();});
step('opening surface',function(){setTab(TAB.FIELD);});
/* LOGIN, AFTER THE BOOT SHEET HAS GONE so the two do not stack. Round MH
   and MI, ui/login.js: the login screen is the return door, met on every
   boot, and onboarding behind it is still met once, gated on its own flag
   inside loginGo(). OB_AUTO's own September ruling, "let's turn off
   onboarding for now," is read by onboard.js's own automatic-open call and
   is left exactly as written for that; this step never called it, so
   nothing here reads OB_AUTO. What this step reads is DEV_SKIP, and it is
   read once the timer below fires rather than now, because the developer
   button DEV_SKIP answers for lives on the boot sheet itself and has not
   necessarily been pressed yet at the moment this line first runs.

   It is a step like the others, so a login that fails to open costs the
   login and not the instrument behind it.

   loginBoot reads DEV_SKIP now, at the same moment this did, and adds the
   one decision this step could not make on its own since sign in went live
   on 30 September: a person already signed in is not shown the door. */
step('login',function(){
 if(typeof loginBoot!=='function')return;
 setTimeout(function(){
  try{ loginBoot(); }catch(e){}
 },5600);});
/* THE FRAME LOOP IS NOT OPTIONAL AND IS STARTED LAST, outside the steps, so
   that even a start up which lost several pieces still paints. A loop that
   throws would stop itself on the first frame, so the body is guarded rather
   than the call. */
requestAnimationFrame(loop);
/* THE LAST LINE OF THE START UP SAYS SO. The boot guard in its own script
   block watches for this and, if it never comes, puts the reason on the
   screen instead of leaving the frame standing with nothing in it. It is the
   last statement on purpose: anything that stops the script before here is
   exactly what the guard exists to report.

   It is called even when steps failed, because the app is on screen and
   usable and the guard's full screen message would be the wrong answer to
   three missing rail sections. The failures go to the guard, which decides
   how loudly to say it. */
if(typeof window.__bootOk==='function')window.__bootOk(BOOT_FAILED);
