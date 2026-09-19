
/* ============================================================
   POINTER. Drag a segment to load or clear it, click to drill.
   ============================================================ */
const HOWTO=[
 'Charge. Three things only.\nThe core is CQ, the alignment of the whole circuit.\nThe ring is your 112 addresses, SQ.\nThe wash behind everything is DQ.\nDrag any segment to load or clear it.',
 'Cluster. Charge, plus the seats and the saboteurs.\nEach bead is a saboteur. The threads show which\naddresses built it. Hover a bead to name it.',
 'Chain. Cluster, plus the rest of the compounding.\nSaboteur to complex to hyper to character, inward.\nThe named ring is your twelve archetypes.\nClick one to change how the soul expresses.',
 'Blueprint. Chain, plus domains, masks and laws.\nThe outer ring is nineteen domains, five per root cluster.\nThe faint ring inside is the six masks.\nThe short spokes at the centre are the twenty-one laws.'];
function describe(h,r){
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
  +'<span class="tt-q">intention '+r.It.toFixed(1)+', integrity '+r.Ig.toFixed(1)
  +', resistance '+r.Rz.toFixed(2)+'</span><hr><b>Click for the breakdown.</b>';
 if(h.k==='gate'){var v=h.v;
  return '<u>'+(v.side==='higher'?'higher gate':'lower gate')+'</u> <b>'+esc(v.nm)+'</b><hr>'
   +esc(v.d||'')+'<hr>'+(v.n?'<b>'+v.pct+'%</b> of the story, '+v.n+' sentence'+(v.n===1?'':'s'):'no story yet')
   +'<br>costs <b>\u00d7'+v.mult.toFixed(2)+'</b> on everything held<hr><b>Click for detail.</b>';}
 if(h.k==='node'){var n=h.n;
  return '<u>'+String(n.i).padStart(3,'0')+'</u> <b>'+esc(n.k)+'</b><hr>'+n.b+' seat, '+(n.n||'field')
   +'<hr>axis <b>'+(n.cf||'unrouted')+'</b><br>susceptibility <b>'+n.susc.toFixed(2)+'</b>'
   +((AFFIN[r.root]||[]).indexOf(n.cf)>=0?'<br><b>1.3×</b> '+r.root+' affinity':'')
   +'<br>held <b>'+n.held.toFixed(1)+'</b>, opposite <b>'+n.rep.toFixed(1)+'</b>'
   +'<br><b>SQ '+n.sq.toFixed(1)+'</b><hr><b>Drag to change, click for detail.</b>';}
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
 if(h.k==='law'){var l=SI[h.j];
  return '<u>law</u> <b>'+l.nm+'</b><hr>seated at the '+l.b.toLowerCase()
   +'<br>reads <b>'+S.law[l.nm].toFixed(1)+'</b><hr><b>Click for detail.</b>';}
 if(h.k==='arch')return '<u>archetype</u> <b>'+ARCH[h.j].nm+'</b><hr>'+ARCH[h.j].v
  +'<br>affinity <b>'+(r.aff[h.j]*100).toFixed(0)+'%</b><hr><b>Click to set as primary.</b>';
 if(h.k==='dom'){var d=DOMAINS[h.j];
  return '<u>'+d.r+'</u> <b>'+d.nm+'</b><hr>'+d.d+'<br>weight <b>'+(DOMAIN[h.j]||0).toFixed(2)
   +'</b><hr><b>Click to select, shift-click to add.</b>';}
 if(h.k==='mk')return '<u>mask</u> <b>'+h.o.nm+'</b><hr>speaks from '+(h.o.bands||[]).join(' + ')
  +'<br>load <b>'+h.o.w.toFixed(1)+'</b>';
 var o=h.o; if(!o)return '';
 var f=leaves(o);
 var nm={sab:'saboteur',cx:'complex',hy:'hyper-complex',sup:'character layer'}[h.k];
 if(!nm)return '';
 return '<u>'+nm+'</u> <b>'+esc(o.nm)+'</b>'+(o.unnamed?' <em>inferred</em>':(SAB_PI.indexOf(o.nm)>=0?' <em>Positive Intelligence</em>':''))+'<hr>'
  +(o.auth?esc(o.auth)+'<br>':'')+(o.sub?esc(o.sub)+'<br>':'')
  +'weight <b>'+o.w.toFixed(1)+'</b><hr><b>from '+f.length+' addresses</b><br>'
  +f.slice(0,5).map(function(n){return String(n.i).padStart(3,'0')+' '+esc(n.k)
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
cv.addEventListener('pointerdown',function(e){
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
 if(h.k==='node'&&h.n.cf&&touch){ /* a tap reads the address, it never writes it */
  S.pin=null; runNodeDrill(h.n); render(); return;}
 if(h.k==='dom'){toYou(); undoPush('changing the blueprint domain');
  if(e.shiftKey){var k=S.doms.indexOf(h.j);
   if(k>=0){if(S.doms.length>1)S.doms.splice(k,1);}else S.doms.push(h.j);}
  else S.doms=[h.j];
  buildSoul();S.pin=null;syncSoul();saveYou();render();return;}
 if(h.k==='arch'){toYou(); undoPush('changing the archetype');
  if(e.shiftKey){var k2=S.arcs.indexOf(h.j);
   if(k2>=0){if(S.arcs.length>1)S.arcs.splice(k2,1);}else S.arcs.push(h.j);}
  else S.arcs=[h.j].concat(S.arcs.filter(function(z){return z!==h.j;}).slice(0,3));
  buildSoul();S.pin=null;syncSoul();saveYou();render();return;}
 if(h.k==='law'){S.pin=null;runLawDrill(SI[h.j]);render();return;}
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
 if(h.k==='mk'){S.pin=null;render();return;}
 var o=h.o||null;
 var same=o&&S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
 S.pin=same?null:o; runDrill(S.pin); render();});
/* THE FRAME. The wheel is the instrument and a person reads it by moving in.
   The pointer keeps the address under it fixed while the scale changes, so
   zooming toward a segment lands on that segment. F reframes. */
/* The depth buttons show what the button set. When zoom has resolved further,
   the reached button is marked so a person can see that the extra detail came
   from the gesture and not from them, and that zooming out will take it away
   again. Without this the wheel silently changes what it is drawing. */
function paintDepth(){
 var bar=$('vbar'); if(!bar)return;
 var eff=effView(), set=S.view|0;
 bar.querySelectorAll('.vt').forEach(function(b,i){
  b.setAttribute('aria-pressed',i===set);
  b.classList.toggle('zoomed',i>set&&i<=eff);});
 var note=$('zoomnote');
 if(note){
  /* what zoom has resolved, on both counts. The ladder outside the core and
     the core itself atomize on the same gesture and at different thresholds,
     so a person moving in sees two different things arrive and the line says
     which. Silent when zoom has added nothing, as before. */
  var add=zoomAdded();
  var inside=(typeof coreResolved==='function')?coreResolved():'';
  var shell=(typeof fetResolved==='function')?fetResolved():'';
  var parts=[];
  if(add)parts.push('zoom resolved '+VIEWS[eff].nm.toLowerCase());
  if(inside)parts.push('the core is showing '+inside);
  if(shell)parts.push('the shell is showing '+shell);
  note.textContent=parts.join(' \u00b7 ');
  note.style.display=parts.length?'':'none';}}
function setZoom(z,ax,ay){
 /* THE CEILING HAS TO CLEAR THE DEEPEST LAYER, or the deepest layer does not
    exist. The ceiling was five and the atoms open at 5.20, so the one thing
    past the fetters could not be reached by any gesture and the layer was
    dead code that measured correctly. A threshold above the ceiling is a
    feature nobody can get to. */
 var lo=1, hi=7, nz=Math.max(lo,Math.min(hi,z));
 if(nz===S.zoom)return;
 var wx=(ax-CX)/U, wy=(ay-CY)/U;
 S.zoom=nz; reframe();
 S.panx += ax-(CX+wx*U); S.pany += ay-(CY+wy*U);
 reframe(); render(); paintDepth();}
cv.addEventListener('wheel',function(e){
 if(S.tab!==TAB.FIELD)return;
 e.preventDefault();
 var L=loc(e);
 setZoom(S.zoom*(e.deltaY<0?1.12:1/1.12),L[0],L[1]);},{passive:false});
addEventListener('keydown',function(e){
 if(S.tab!==TAB.FIELD)return;
 var t=e.target&&e.target.tagName;
 if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT')return;
 var k=e.key.toLowerCase();
 if(k==='f'){S.zoom=1;S.panx=0;S.pany=0;reframe();render();
  status(HOWTO_ZOOM_OUT);return;}
 if(k==='+'||k==='='){setZoom(S.zoom*1.25,CW/2,CH/2);return;}
 if(k==='-'||k==='_'){setZoom(S.zoom/1.25,CW/2,CH/2);return;}});
const HOWTO_ZOOM_OUT='Reframed. Scroll on the wheel to move in and the core opens as you go, drag to move the frame, F to come back.';
cv.addEventListener('pointerup',function(){
 cv.style.cursor='';
 if(PAN){var wasCore=PAN.core, moved=PAN.moved; PAN=null;
  /* a press on the core that never moved is still a click on the core */
  if(!moved&&wasCore){S.pin=null;runCoreDrill();render();}
  return;}
 if(DRAG&&!DRAG.moved&&DRAG.node){var n=DRAG.node;DRAG=null;S.pin=null;runNodeDrill(n);render();return;}
 DRAG=null;});
cv.addEventListener('pointercancel',function(){PAN=null;DRAG=null;cv.style.cursor='';});
/* double click puts the frame back, the same thing F does, because a person
   who has panned into a corner should not have to find a keyboard. */
cv.addEventListener('dblclick',function(){S.zoom=1;S.panx=0;S.pany=0;reframe();render();});
cv.addEventListener('pointermove',function(e){
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
 var h=hitTest(x,y),pr=$('probe');
 S.hover=h?(h.n||h.o||null):null;
 if(!h){pr.classList.remove('on');cv.style.cursor='crosshair';return;}
 var t=describe(h,compute());
 if(!t){pr.classList.remove('on');return;}
 cv.style.cursor=(h.k==='node')?'ns-resize':'pointer';
 pr.innerHTML=t;
 pr.style.left=Math.min(CW-312,x+18)+'px';
 pr.style.top=Math.min(CH-200,y+18)+'px';
 pr.classList.add('on');});
cv.addEventListener('pointerleave',function(){S.hover=null;DRAG=null;$('probe').classList.remove('on');});

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
var OPENSEC={left:{soul:1}, right:{you:1}};
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
  ['fet','Fetters',CHILD.length,
   'M12 4.5a3.6 3.6 0 013.6 3.6v7.8a3.6 3.6 0 01-7.2 0V8.1A3.6 3.6 0 0112 4.5'],
  ['sab','Saboteurs',r.sabs.length,
   'M8.6 4.8a3.4 3.4 0 013.4 3.4v3.4a3.4 3.4 0 01-6.8 0V8.2a3.4 3.4 0 013.4-3.4'
   +'M15.4 12.4a3.4 3.4 0 013.4 3.4a3.4 3.4 0 01-6.8 0a3.4 3.4 0 013.4-3.4'],
  ['cx','Complexes',r.cxs.length,
   'M9 6.6a3 3 0 110 6 3 3 0 010-6M15 6.6a3 3 0 110 6 3 3 0 010-6'
   +'M12 12.8a3 3 0 110 6 3 3 0 010-6'],
  ['hy','Hyper',r.hys.length,
   'M12 3.2l7.6 4.4v8.8L12 20.8 4.4 16.4V7.6zM12 3.2v17.6M4.4 7.6l15.2 8.8'
   +'M19.6 7.6L4.4 16.4'],
  ['sup','Character',r.sups.length,
   'M12 3.4a8.6 8.6 0 100 17.2 8.6 8.6 0 000-17.2M12 7.6a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8']];
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
  h+='<p class="stk-def">Nine axes, two ends each. <b>Held</b> is the state you are '
   +'carrying. <b>Opposite</b> is the coherent quality on the far side of it. Release '
   +'empties the first, replace fills the second.</p>';
  h+='<div class="stk-hd"><span>held</span><span>opposite</span></div>';
  h+=CHILD.map(function(c){var v=S.charge[c.nm]||0, p=S.replace[c.nm]||0;
   /* each axis carries its own glyph. canon.js has had one on every entry
      since the port and nothing in the rails was drawing them. */
   return '<div class="stk-r static"><span class="stk-l">'
    +cr(c.seat,v*10,{size:'xs',raw:v.toFixed(1),glyph:'<path d="'+c.ic+'"/>'})+esc(c.nm)+'</span>'
    +'<span class="stk-p">'+esc(c.opp)
    +cr('Heart',p*10,{size:'xs',raw:p.toFixed(1),glyph:'<path d="'+c.ic+'"/>'})+'</span></div>';}).join('');}
 else{
  var list={sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups}[STACK_TAB]||[];
  h+=list.length?'<div class="stk-hd"><span>weight</span><span>opposite in</span></div>':'';
  h+=list.length?list.map(function(o,i){var p=poleOf(o);
   return '<button type="button" class="stk-r'+(S.pin===o?' on':'')+'" data-sk="'+STACK_TAB+'" data-si="'+i+'">'
    +'<span class="stk-l">'+crPat(o,'xs')+esc(o.nm)+(o.unnamed?'<em>inferred</em>':'')+'</span>'
    +'<span class="stk-p">'+cr('Heart',p*10,{size:'xs',raw:p.toFixed(1)})+'</span></button>';}).join('')
   :'<div class="rnone">Nothing at this layer.</div>';}
 e.innerHTML=h;}
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
function balG(g,on,t){
 return '<span class="bal-g'+(on?' on':'')+'" title="'+esc(t)+'">'
  +'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">'+g+'</svg></span>';}
function renderBal(r){
 var e=document.getElementById('bal'); if(!e)return;
 var b=r.balance;
 /* THE STRIP, BUILT TO THE RULING AND NOT TO MY READING OF IT.

    Asked for five times, and four times it came back as something adjacent.
    The ruling is four things and every one of them is specific:

      the two symbols, masculine on the left and feminine on the right
      one line, with a break at the centre
      the fill runs FROM THE CENTRE OUT toward the side you lean
      and the percent is a pill

    What was there was a dot sliding along a plain track with the figure
    printed beside it as bare text. A dot on a track says "you are at this
    point on a scale". That is not the reading. The reading is "you lean this
    far, this way, off centre", which is a quantity with a direction and an
    origin, and the only shape that says it is a bar growing out of the
    middle. The break at the centre is where even sits, so even is visibly
    nothing rather than a dot that happens to be halfway.

    Masculine on the left and feminine on the right is the opposite
    handedness from the body, and that is what a mirror is: face one and your
    right hand is on the left. Logged in BOOK-ERRATA so the codex and the
    screen disagree in writing rather than by accident. */
 /* mirrored with the strip: lean +1 is fully outward, which is masculine,
    and masculine is the left end. */
 var lean=b.read?Math.abs(b.lean)*100:0;
 var dir=!b.read?'':b.lean===0?'even':b.lean>0?'masculine':'feminine';
 var c=b.lean>=0?seatCol('Solar'):seatCol('Throat');
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 /* sex at birth is a reference point and not a reading, drawn only when a
    person has given it, and mirrored with everything else. */
 var tick=sx==='m'?'<span class="bal-s" style="left:25%"></span>'
        :sx==='f'?'<span class="bal-s" style="left:75%"></span>':'';
 /* the bar. half the width is half the strip, so a full lean fills its own
    side exactly and nothing crosses the break. */
 var half=(b.read?Math.min(1,Math.abs(b.lean)):0)*50;
 var fill=!b.read||half<=0 ? ''
  : '<span class="bal-f" style="'+(b.lean>0
     ? 'right:50%;width:'+half.toFixed(1)+'%'
     : 'left:50%;width:'+half.toFixed(1)+'%')
    +';background:'+c+'"></span>';
 e.innerHTML='<div class="bal-t">'
  +balG(GLYPH_M,dir==='masculine','Masculine. Structure and direction, expressed outward. '
    +'Not men: the codex is explicit about that.')
  +'<span'+(dir==='masculine'?' class="on" style="color:'+c+'"':'')+'>masculine</span>'
  +'<span class="bal-n">'+(!b.read
    ? '<em>not enough held to read</em>'
    : cr('Heart',lean,{size:'xs',hot:false,color:c,label:dir,
        glyph:(b.lean>=0?GLYPH_M:GLYPH_F),
        raw:(b.lean===0?'even':Math.round(lean)+'%'),
        title:'Balance. '+(b.lean===0?'even':Math.round(lean)+' percent '+dir)}))
  +'</span>'
  +'<span'+(dir==='feminine'?' class="on" style="color:'+c+'"':'')+'>feminine</span>'
  +balG(GLYPH_F,dir==='feminine','Feminine. Energy and receptivity, held inward. '
    +'Not women: the codex is explicit about that.')
  +'</div>'
  +'<div class="bal-tr">'+fill+'<i></i>'+tick+'</div>';}
/* ---- the rail's doors. one delegated set, on the rail itself ---- */
var _KBJ=false;
function wireKbJump(){
 if(_KBJ)return; _KBJ=true;
 var host=document.body; if(!host)return;
 var tip=document.getElementById('railtip');
 if(!tip){tip=document.createElement('div');tip.id='railtip';tip.className='probe railtip';
  document.body.appendChild(tip);}
 function show(el){
  var t=el.getAttribute('data-tip')||''; if(!t){hide();return;}
  var nm=el.querySelector('.tn'), b=el.getBoundingClientRect();
  tip.innerHTML='<b>'+esc(nm?nm.textContent:'')+'</b><hr>'+esc(t)
   +(el.getAttribute('data-kbs')?'<hr><b>Click to read it.</b>':'');
  tip.classList.add('on');
  var tb=tip.getBoundingClientRect();
  /* left of the rail, because the rail is against the right edge and a
     tooltip that opens rightward opens off the screen. */
  tip.style.left=Math.max(8,b.left-tb.width-10)+'px';
  tip.style.top=Math.max(8,Math.min(innerHeight-tb.height-8,b.top-4))+'px';}
 function hide(){tip.classList.remove('on');}
 host.addEventListener('pointerover',function(e){
  var el=e.target.closest?e.target.closest('.kbjump'):null;
  if(el)show(el); else if(!e.target.closest||!e.target.closest('#railtip'))hide();});
 host.addEventListener('pointerleave',hide,true);
 host.addEventListener('click',function(e){
  var el=e.target.closest?e.target.closest('.kbjump'):null; if(!el)return;
  var sec=el.getAttribute('data-kbs'), t=el.getAttribute('data-kbt');
  if(!sec||!t)return;
  hide();
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
 e.innerHTML=cr(r.darkB, r.unread?0:r.CQ, {size:'sm', label:'coherence',
   raw:r.unread?'\u2013':undefined})
  /* THE TIER IS A CONTROL WHEREVER IT LIVES. Taking the word off the Field
     centre was ruled, and it took the only tappable route to the definition
     with it: there was exactly one tier control in the product and it was the
     one on the stage. A label never appears without what it owes, and the
     definition has to be reachable by tap rather than by hover, because the
     audience arrives on phones. So the word in the rail is the button now. */
  +'<button type="button" class="rt-t tierbtn" id="tier" title="'
  +esc(td?(td.def+'  '+td.energy+'  Toward: '+td.toward)
       :'Nothing has been read yet. Write a story or set a charge.')+'">'
  +esc(r.unread?'not read yet':r.tier)+'</button>'
  +'<span class="rt-d">'+esc(r.unread
    ? 'Nothing entered yet. Write what happened and this fills in.'
    : (td?td.def:''))+'</span>';
 /* and a tap gets the whole thing, because hover is not a route on the device
    most of this audience arrives on. */
 var tb=e.querySelector('#tier');
 if(tb)tb.onclick=function(){S.pin=null; runCompassDrill(); render();};
 /* the label never stands alone: hovering it gives the definition and the
    direction, and clicking the strip opens the whole thing. */
 e.title=td?(td.nm+'. '+td.def+' '+td.energy+' Toward: '+td.toward)
  :'Nothing has been read yet. Write a story or set a charge.';}
function render(){
 if(typeof paintUndo==='function')paintUndo();
 const r=compute(), p=PEOPLE[S.who];
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
 /* benign against malignant, as percentages of one field */
 (function(){
  var mal=Math.max(0,Math.min(100,r.malig||0)), ben=100-mal;
  /* and the split is a reading of CQ, so it is not printed off the defaults
     either. Seventy two percent benign to somebody who has typed nothing is
     the same lie in a different shape. */
  if(r.unread){$('pol').innerHTML='<div class="bmnote">Nothing read yet, so there is '
   +'no split to show.</div>'; return;}
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
 /* BALANCE. It read left to right, which draws two competing quantities and
    makes the reader do the subtraction. It now grows from the centre out, so
    the thing a person sees is the lean itself: which way, and how far. Fifty
    fifty is a bar with nothing sticking out either side.
    The note under it came out on the owner's ruling. The numbers are on the
    bar and the rest is in the tooltip. */
 (function(){
  var pb=$('polbar'); if(!pb)return;
  var L=leanRead(r);
  var off=Math.abs(L.ben-50)*2;              /* 0 at even, 100 at either end */
  var mal=L.mal>L.ben;
  /* BENIGN AND MALIGNANT GET SYMBOLS, like balance. Ruled.

     The bar carried two bare numbers at its ends and nothing saying which end
     was which, so a person had to already know that the left one was the
     benign figure. The balance strip directly above it has carried its two
     symbols since it was rebuilt and this one had not caught up.

     Benign is a closed ring with a rising stroke inside it: contained, and
     going up. Malignant is a ring broken at its lower right with the stroke
     falling out of the gap: the same shape, open, and going down. One form,
     two states, which is the reading. */
  var gB='<circle cx="12" cy="12" r="8"/><path d="M8.6 14.2l2.6-3.1 2.2 2 2-3.4"/>';
  var gM='<path d="M15.6 18.6A8 8 0 1 1 18.6 15.4"/>'
   +'<path d="M8.6 9.9l2.6 3.1 2.2-2 2 3.4"/>';
  function pIco(g,on,c,t){
   return '<span class="pol-g'+(on?' on':'')+'" style="--c:'+c+'" title="'+esc(t)+'">'
    +'<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">'+g+'</svg></span>';}
  pb.innerHTML='<div class="fill'+(mal?' mal':'')+'" style="width:'+(off/2).toFixed(1)+'%;'
   +'background:'+(mal?PAL.Root:PAL.Heart)+';opacity:.62"></div><div class="mid"></div>'
   +'<div class="lb l">'+pIco(gB,!mal,PAL.Heart,
     'Benign. Charge that is held and is not costing you.')
   +'<b>'+L.ben.toFixed(0)+'</b></div>'
   +'<div class="lb r"><b>'+L.mal.toFixed(0)+'</b>'+pIco(gM,mal,PAL.Root,
     'Malignant. Charge that is held and is taking something from you.')+'</div>';
  pb.title=(L.cues?'Balance. '+L.cues+' cue'+(L.cues===1?'':'s')+' from the story so far. '
    :'Balance. No story yet, so this is the field alone. ')
   +'Benign '+L.ben.toFixed(0)+', malignant '+L.mal.toFixed(0)+', read from '+L.src
   +'. The bar grows from the centre: the further it reaches, the harder the lean.';})();
 /* the key. three quotients, three elements. */
 /* The key sat on top of the wheel as a 288px card. It is now a strip in
    flow above the canvas, one ring and one word per element, and each is a
    door to the reading on the right. Nothing on the stage covers the wheel. */
 $('key').innerHTML=
   /* The trailing word on each of these was a gloss: core, shadow, depth,
      installed, three axes. A gloss that never goes away is furniture. The
      letter is the name, the tooltip says what it is, and the click opens
      the whole reading. */
   /* the same rule as the core: nothing is printed off the defaults. the ring
      still draws, because an empty ring is the honest picture of an empty
      field, and the tail carries a dash rather than a number nobody entered. */
   '<button class="kb" data-q="cq" title="Coherence. 0 to 100. What the field builds against what it costs.">'
    /* HOT IS FOR A READING WHERE HIGH IS WRONG.

       cr() reddens anything past the hot threshold, which is right for shadow
       weight and depth and exactly backwards for every reading on this row
       where high is the good end. Coherence at 100, vitality at 1.0 and flow
       at 1.0 all printed in the colour this product reserves for something
       being wrong. The domain pill had the same defect and was fixed the same
       way: the pills that climb toward health say so. */
    +cr('Crown',r.unread?0:r.CQ,{size:'xs',label:'CQ',hot:false,
      raw:r.unread?'\u2013':undefined})+'<span><b>CQ</b></span></button>'
  +'<button class="kb" data-q="dq" title="Shadow weight. The summed charge across every address that is carrying.">'
    +cr('Root',clamp(r.DQ/14,0,1)*100,{size:'xs',raw:r.DQ.toFixed(1)})
    +'<span><b>DQ</b></span></button>'
  +'<button class="kb" data-q="sq" title="Segment depth. 0 to 10. How deep the held charge sits at the addresses carrying it.">'
    +cr(r.darkB,r.SQm*10,{size:'xs',raw:r.SQm.toFixed(1)})+'<span><b>SQ</b></span></button>'
  /* THE CONSOLE AVERAGED THREE READINGS AND SHOWED THE AVERAGE.

     One pill said Energy and behind it sat vitality, awareness and will,
     three independent lines meaned into a single figure. The drill behind
     that pill already says, in its own words, that they do not average into
     a score: they say which of the three is carrying and which is short. An
     average is exactly the thing that cannot say that. Every one of the three
     has been computed on every reading since the rebuild and the console
     printed their mean.

     They are their own pills now. Nothing new is measured and nothing is
     renamed: will is will, which the codex defines as available directed
     force, and it is not the same quantity as flow.

     Flow is. It is the throughput of the seven seats, one times the next, the
     share of signal that reaches the crown from the root, and it is what the
     Body page draws as a channel. It was computed and drawn there and read
     nowhere else. It reads here. */
  ;   /* vitality, awareness, will and flow are the lower strip now */
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
  lo.innerHTML=
   '<button class="kb" data-q="xyz" title="Vitality. What is left after apathy and the shadow weight.">'
    +cr('Solar',r.unread?0:r.X*100,{size:'xs',hot:false,raw:r.unread?'\u2013':r.X.toFixed(2)})
    +'<span><b>Vitality</b></span></button>'
  +'<button class="kb" data-q="xyz" title="Awareness of the instrument. Intention read against distortion. Not the rail section of the same name.">'
    +cr('3rd Eye',r.unread?0:r.Y*100,{size:'xs',hot:false,raw:r.unread?'\u2013':r.Y.toFixed(2)})
    +'<span><b>Awareness</b></span></button>'
  +'<button class="kb" data-q="xyz" title="Will. Integrity carried through a clear segment.">'
    +cr('Root',r.unread?0:r.Z*100,{size:'xs',hot:false,raw:r.unread?'\u2013':r.Z.toFixed(2)})
    +'<span><b>Will</b></span></button>'
  +'<button class="kb" data-q="flow" title="Flow. What reaches the crown from the root, '
    +'every seat multiplied by the next.">'
    +cr('Heart',r.unread?0:f*100,{size:'xs',hot:false,raw:r.unread?'\u2013':f.toFixed(2)})
    +'<span><b>Flow</b></span></button>';})();
 /* who. proportions, not one label. */
 (function(){
  var aff=(r.aff||[]).map(function(v,i){return {i:i,nm:(ARCH[i]||{}).nm||'',v:v};})
   .filter(function(x){return x.nm;}).sort(function(a,b){return b.v-a.v;});
  var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;
  var T=['First','Second','Third'];
  function row(k,n,pc){return '<div class="tierow"><span class="tk">'+k+'</span>'
   +'<span class="tn">'+n+'</span><span class="tp">'+pc+'</span></div>';}
  /* A PERCENTAGE IS THE PERCENTAGE OBJECT, EVERYWHERE. Ruled, and this rail was
     the last place still printing a bare figure: Innocent 21%, Everyman 19%,
     as text, four inches from a surface where the same quantity is an icon, a
     ring and a pill. The object carries its own glyph, so a person reading this
     rail is also learning the symbol for the archetype. That is the point of
     having one object. */
  /* col, not band. A root domain's colour is a ROOT colour and seatCol only
     knows the seven seats, so passing Architect where it wanted Heart resolved
     to the alarm red and printed Imperium 100% in the colour this product
     reserves for something being wrong. */
  /* EVERY NAMED THING IN THIS RAIL IS A DOOR.

     Warrior, Sage, Creator, Imperium. A person reading their own reading has
     no idea what any of those words mean and the rail offered no way to find
     out: the only explanation anywhere was a native browser title on the
     ring, which is the wrong size, the wrong place, and gone on touch.

     The row carries the meaning now, on hover, in the product's own tooltip,
     and it is a button: press it and the knowledge page opens on that entry.
     Nothing is a dead end that has a name. */
  function prow(k,n,pct,col,glyph,title,kb,gloss){
   return '<button type="button" class="tierow pill kbjump" '
    +(kb?'data-kbs="'+esc(kb[0])+'" data-kbt="'+esc(kb[1])+'" ':'')
    +'data-tip="'+esc(gloss||title||'')+'">'
    +'<span class="tk">'+k+'</span>'
    /* hot:false. cr() turns anything past the hot threshold into the alarm
       colour, which is right for a charge and wrong for a share: one selected
       domain is 100 percent of the selection and printed Imperium in the
       colour this product reserves for something being wrong. A proportion is
       never an alarm. */
    +cr('Heart',pct,{size:'xs',raw:Math.round(pct)+'%',glyph:glyph,label:n,
      title:title,color:col,hot:false})
    +'</button>';}
  var ah=aff.slice(0,3).map(function(x,i){
   var A=ARCH[x.i]||{};
   /* and the same in the rail, which passed the literal 'Heart' for all twelve.
      Ruled: the warrior is root, the sage is crown, the mage is third eye. */
   return prow(T[i],x.nm,x.v/tot*100,seatCol(A.b||'Heart'),A.ic?'<path d="'+A.ic+'"/>':null,
    x.nm+'. '+(A.v||'')+' Share of how the blueprint expresses.',
    ['arch',x.nm],
    'An archetype. '+x.nm+' '+(A.v||'')+'. It is native and was there before '
    +'anything was conditioned, so it is not released. The work changes where '
    +'it is pointed.');}).join('');
  var dsh=S.doms.map(function(di,i){var d=DOMAINS[di];
   return d?prow(T[i]||'Also',d.nm,100/(S.doms.length||1),ROOTCOL[d.r],
    d.ic?'<path d="'+d.ic+'"/>':null,
    d.nm+', '+d.r+' root. '+(d.d||''),
    ['dom',d.nm],
    'A blueprint domain, on the '+d.r+' root. '+(d.d||'')):'';}).join('');
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
  $('person').innerHTML='<h3>'+(p.you?'You':p.nm)+'</h3>'
   +(p.you?'':'<div class="prole">'+p.age+', '+esc(String(p.role).replace(' · ICP',''))+'</div>')
   /* THE EMPTY STATE OUTLIVED THE EMPTINESS. says was printed whenever it
      existed, and the blank persona's says is the words "Nothing has been
      entered yet". A person who then entered charge got a live reading beside
      a sentence swearing they had entered nothing. It is an empty state, so it
      goes when the state is not empty. */
   +(p.says&&!(p.you&&!r.unread)?'<p class="psay">'+esc(p.says)+'</p>':'')
   +'<div class="pm-eye" style="margin-top:14px">Archetypes</div>'+ah
   +'<div class="pm-eye" style="margin-top:12px">Domains</div>'+dsh
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
   +row('Most shut',r.weakL.nm,'at the '+r.weakL.b.toLowerCase());})();
 railStack(r); renderBal(r);
 $('rows').innerHTML='<span class="k">Instruments</span><br>'
  +'integrity <b>'+r.Ig.toFixed(1)+'</b><br>intention <b>'+r.It.toFixed(1)+'</b><br>'
  /* JOUISSANCE WAS ON EIGHTY ONE SCREENS. A French psychoanalytic term, printed
     as an instrument label to a person who has never heard it, with no gloss
     anywhere in the product. One word per concept, and the word has to say
     what the thing does: JQ is the opposite driven past the point where it
     serves. That is overshoot. The codex keeps its own word. */
  +'pole in <b>'+r.poleMean.toFixed(2)+'</b><br>overshoot <b>'+r.JQ.toFixed(2)+'</b>'
  +(r.excess.length?', '+r.excess.length+' overshot':'')+'<br>'
  +'distortion <b>'+r.dist.toFixed(1)+'</b>';
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
      +'<p class="sub">'+(o.over?'the cure done past the point where it helps, and not able to stop.'
        :esc(o.auth||o.d||NOTE[o.kind]))+'</p>'
      +'<div class="w">'+crPat(o,'md')+'</div></div>';}).join('')
    +(rows.length>4?'<div class="rnone">and '+(rows.length-4)+' more below</div>':'')
  : '<div class="rnone">Nothing is running.</div>';
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
 renderAcc(r); renderSpirit(); renderPol2(r); syncMx();
 $('fire').innerHTML=rows.length
  ? '<div class="pm-eye" style="color:var(--gold);margin-bottom:8px">Running now</div>'
    +rows.slice(0,8).map(function(o,i){
     return '<div class="it'+(S.pin===o?' pin':'')+'" data-i="'+i+'">'
      +'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(o.nm)
      +'</span><b>'+o.w.toFixed(1)+'</b></div>';}).join('')
    +(rows.length>8?'<div class="it"><span>and '+(rows.length-8)+' more</span></div>':'')
  : '<div class="pm-eye" style="color:var(--gold)">Nothing running</div>';
 $('fire').querySelectorAll('.it[data-i]').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];S.pin=(S.pin===o)?null:o;runDrill(S.pin);render();});});
 if(S.tab===TAB.ENERGY)renderMap(r);
 else if(S.tab===TAB.SUMMARY)sumRender();
 else if(S.tab===TAB.ANALYTICS)anaRender();}

/* ---- the loop ---- */
let last=0;
function loop(ts){
 if(!REDUCED)S.t+=(last?Math.min(.05,(ts-last)/1e3):0);
 last=ts; stepRel(ts);
 var r=compute();
 if(S.tab===TAB.FIELD){draw(r);drawAura(r);renderPol2(r);}
 else if(S.tab===TAB.ENERGY){drawAura(r);}
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
/* One delegated handler for every address row the drills render, so a row
   opens the address it names instead of being a dead end. */
document.addEventListener('click',function(e){
 var st=e.target.closest?e.target.closest('.stk-t[data-st]'):null;
 if(st){STACK_TAB=st.getAttribute('data-st');railStack(compute());return;}
 var sr=e.target.closest?e.target.closest('.stk-r[data-sk]'):null;
 if(sr){var rr=compute(), o=({sab:rr.sabs,cx:rr.cxs,hy:rr.hys,sup:rr.sups}[sr.getAttribute('data-sk')]||[])[+sr.getAttribute('data-si')];
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

layout(); mxKey(); wireSections(); loadP(0);
/* A saved record is the person's own state, so it wins over the demo "You"
   that loadP(0) just installed. Nothing read the store at boot before, so a
   reload always came back to the demo. */
(function(){
 try{ PROFILES=pStore(); }catch(e){ PROFILES=[]; }
 if(!PROFILES.length){ pNew('You'); }
 CURP=PROFILES[0];
 /* loadP(0) cached a blank profile under the persona name a moment ago, and
    replacing PROFILES left that cache pointing at an object no longer in the
    list. Picking a reference case and coming back sent CURP to the orphan,
    and every write after that reported success onto an array nobody reads.
    Reproduced: two edits, a persona round trip between them, the second one
    gone after a reload with no error shown. The cache points at the record. */
 PROF_BY[PEOPLE[0].nm]=CURP;
 loadProfile(CURP);
 syncCh(); syncLw(); syncSoul();
}());
/* THE APP OPENS ON THE FIELD, on the owner's ruling of 19 September, which
   reverses the earlier one that opened it on Summary.

   This line is what actually decides the opening surface. The default on S is
   only what holds until this runs, and it has said FIELD the whole time, so
   changing the default alone would have looked right in the source and done
   nothing on screen. Both say Field now, as they did before the Summary
   ruling, and the comment says why rather than leaving the next reader to
   wonder which of the two is the live one. */
setTab(TAB.FIELD);
requestAnimationFrame(loop);
