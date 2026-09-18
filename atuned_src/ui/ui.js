
/* ============================================================
   POINTER. Drag a segment to load or clear it, click to drill.
   ============================================================ */
const HOWTO=[
 'Charge. Three things only.\nThe core is CQ. The ring is your 112 addresses, SQ.\nThe wash behind everything is DQ.\nDrag any segment to load or clear it.',
 'Cluster. Charge, plus the seats and the saboteurs.\nEach bead is a saboteur. The threads show which\naddresses built it. Hover a bead to name it.',
 'Chain. Cluster, plus the rest of the compounding.\nSaboteur to complex to hyper to character, inward.\nThe named ring is your twelve archetypes.\nClick one to change how the soul expresses.',
 'Blueprint. Chain, plus domains, masks and laws.\nThe outer ring is nineteen domains, five per root cluster.\nThe faint ring inside is the six masks.\nThe short spokes at the centre are the twenty-one laws.'];
function describe(h,r){
 if(h.k==='core')return '<u>CQ '+Math.round(r.CQ)+'</u> <b>the core</b><hr>'
  +'intention <b>'+r.It.toFixed(1)+'</b> times integrity <b>'+r.Ig.toFixed(1)+'</b><br>'
  +'over resistance <b>'+r.Rz.toFixed(2)+'</b><hr>'
  +'Size and saturation are coherence.<br><b>Click for the breakdown.</b>';
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
function hitTest(px,py){
 for(var i=HIT.length-1;i>=0;i--){var h=HIT[i];
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
 if(h.k==='core'){S.pin=null;runCoreDrill();render();return;}
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
  var add=zoomAdded();
  note.textContent=add?('zoom resolved '+VIEWS[eff].nm.toLowerCase()):'';
  note.style.display=add?'':'none';}}
function setZoom(z,ax,ay){
 var lo=1, hi=5, nz=Math.max(lo,Math.min(hi,z));
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
const HOWTO_ZOOM_OUT='Reframed. Scroll on the wheel to move in, F to come back.';
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
  render(); return;}
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
var OPENSEC={left:'soul', right:'you'};
function railOf(sec){return sec.dataset.rail||'left';}
function wireSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var hd=sec.querySelector('.lsec-hd'); if(!hd||hd._w)return; hd._w=1;
  hd.onclick=function(){var rl=railOf(sec);
   OPENSEC[rl]=(OPENSEC[rl]===sec.dataset.sec)?'':sec.dataset.sec;paintSections();};});
 paintSections();}
function paintSections(){
 document.querySelectorAll('.lsec').forEach(function(sec){
  var on=OPENSEC[railOf(sec)]===sec.dataset.sec;
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
 var TABS=[['fet','Fetters',CHILD.length],['sab','Saboteurs',r.sabs.length],['cx','Complexes',r.cxs.length],
  ['hy','Hyper',r.hys.length],['sup','Character',r.sups.length]];
 var h='<div class="stk-tabs" role="tablist">'+TABS.map(function(t){
  return '<button type="button" role="tab" class="stk-t'+(STACK_TAB===t[0]?' on':'')+'" data-st="'+t[0]+'" '
   +'aria-selected="'+(STACK_TAB===t[0])+'">'+t[1]+(t[2]?' <b>'+t[2]+'</b>':'')+'</button>';}).join('')+'</div>';
 if(STACK_TAB==='fet'){
  h+='<div class="stk-hd"><span>held</span><span>installed</span></div>';
  h+=CHILD.map(function(c){var v=S.charge[c.nm]||0, p=S.replace[c.nm]||0;
   return '<div class="stk-r static"><span class="stk-l">'+cr(c.seat,v*10,{size:'xs',raw:v.toFixed(1)})+esc(c.nm)+'</span>'
    +'<span class="stk-p">'+esc(c.opp)+cr('Heart',p*10,{size:'xs',raw:p.toFixed(1)})+'</span></div>';}).join('');}
 else{
  var list={sab:r.sabs,cx:r.cxs,hy:r.hys,sup:r.sups}[STACK_TAB]||[];
  h+=list.length?'<div class="stk-hd"><span>weight</span><span>opposite in</span></div>':'';
  h+=list.length?list.map(function(o,i){var p=poleOf(o);
   return '<button type="button" class="stk-r'+(S.pin===o?' on':'')+'" data-sk="'+STACK_TAB+'" data-si="'+i+'">'
    +'<span class="stk-l">'+crPat(o,'xs')+esc(o.nm)+(o.unnamed?'<em>inferred</em>':'')+'</span>'
    +'<span class="stk-p">'+cr('Heart',p*10,{size:'xs',raw:p.toFixed(1)})+'</span></button>';}).join('')
   :'<div class="rnone">Nothing at this layer.</div>';}
 e.innerHTML=h;}
/* the balance strip. outward is the solar colour, inward the throat. the
   small grey tick is sex at birth when it has been given, so a person can
   see the distance between what they were born and what the field reads. */
function renderBal(r){
 var e=document.getElementById('bal'); if(!e)return;
 var b=r.balance, pc=(b.lean+1)/2*100;
 var c=b.lean>=0?seatCol('Solar'):seatCol('Throat');
 var sx=CURP&&CURP.who?CURP.who.sex:'';
 var tick=sx==='m'?'<span class="bal-s" style="left:78%"></span>'
        :sx==='f'?'<span class="bal-s" style="left:22%"></span>':'';
 /* The centre named the direction and so did the end label, so "26% outward"
    sat against the word outward and the two ran together. The ends carry the
    direction, the centre carries the number, and the end the field leans to is
    the one that lights. One word per concept, on one strip. */
 var lean=b.read?Math.abs(b.lean)*100:0;
 var dir=!b.read?'':b.lean===0?'even':b.lean>0?'outward':'inward';
 e.innerHTML='<div class="bal-t"><span'+(dir==='inward'?' class="on" style="color:'+c+'"':'')+'>inward</span>'
  +'<span><b>'+(!b.read?'not enough held to read'
    :b.lean===0?'even':lean.toFixed(0)+'%')+'</b></span>'
  +'<span'+(dir==='outward'?' class="on" style="color:'+c+'"':'')+'>outward</span></div>'
  +'<div class="bal-tr"><i></i>'+tick
  +'<span class="bal-m" style="left:'+pc.toFixed(1)+'%;background:'+c+'"></span></div>';}
function railTop(r){
 var e=document.getElementById('railtop'); if(!e)return;
 /* "18 of 112 held" read as a score out of a total, which is a test rather
    than a mirror. Coherence and the tier it names are the line. The count
    was cut everywhere a count read against a total. */
 e.innerHTML=cr(r.darkB, r.CQ, {size:'sm', label:'coherence'})
  +'<span class="rt-t">'+esc(r.unread?'not read yet':r.tier)+'</span>';
 /* the label never stands alone: hovering it gives the definition and the
    direction, and clicking the strip opens the whole thing. */
 var td=r.unread?null:TIER_BY[r.tier];
 e.title=td?(td.nm+'. '+td.def+' '+td.energy+' Toward: '+td.toward)
  :'Nothing has been read yet. Write a story or set a charge.';}
function render(){
 if(typeof paintUndo==='function')paintUndo();
 const r=compute(), p=PEOPLE[S.who];
 /* the tier is a name for a person. it is not printed off the defaults, and it
    never appears without what it owes: the definition, the behaviour and the
    direction. Hover gives all three, the compass drill gives them in full. */
 (function(){var e=$('tier'); if(!e)return;
  e.textContent=r.unread?'not read yet':r.tier;
  var td=r.unread?null:TIER_BY[r.tier];
  e.title=td?(td.def+'  '+td.energy+'  Toward: '+td.toward)
   :'Nothing has been read yet. Write a story or set a charge.';
  /* and a tap gets the same thing, in full, because hover is not a route on
     the device most of this audience arrives on. */
  e.onclick=function(){S.pin=null; runCompassDrill(); render();};})();
 /* The heaviest seat and its charge go onto the body so a theme can derive
    its chrome from the reading. Punch reads both; Dark and Snow ignore them. */
 document.body.style.setProperty('--seat',seatCol(r.darkB));
 document.body.style.setProperty('--seat-w',Math.max(0,Math.min(1,(r.darkV||0)/10)).toFixed(2));
 railTop(r);
 /* benign against malignant, as percentages of one field */
 (function(){
  var mal=Math.max(0,Math.min(100,r.malig||0)), ben=100-mal;
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
  pb.innerHTML='<div class="fill'+(mal?' mal':'')+'" style="width:'+(off/2).toFixed(1)+'%;'
   +'background:'+(mal?PAL.Root:PAL.Heart)+';opacity:.62"></div><div class="mid"></div>'
   +'<div class="lb l">'+L.ben.toFixed(0)+'</div>'
   +'<div class="lb r">'+L.mal.toFixed(0)+'</div>';
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
   '<button class="kb" data-q="cq" title="Coherence. 0 to 100. What the field builds against what it costs.">'
    +cr('Crown',r.CQ,{size:'xs',label:'CQ'})+'<span><b>CQ</b></span></button>'
  +'<button class="kb" data-q="dq" title="Shadow weight. The summed charge across every address that is carrying.">'
    +cr('Root',clamp(r.DQ/14,0,1)*100,{size:'xs',raw:r.DQ.toFixed(1)})+'<span><b>DQ</b></span></button>'
  +'<button class="kb" data-q="sq" title="Segment depth. 0 to 10. How deep the held charge sits at the addresses carrying it.">'
    +cr(r.darkB,r.SQm*10,{size:'xs',raw:r.SQm.toFixed(1)})+'<span><b>SQ</b></span></button>'
  +'<button class="kb" data-q="pole" title="The coherent opposite, installed. 0 to 1 across the nine axes.">'
    +cr('Heart',r.poleMean*100,{size:'xs',raw:r.poleMean.toFixed(2)})+'<span><b>Pole</b></span></button>'
  /* the three axes. the engine has computed X, Y and Z on every reading
     since the rebuild and nothing has ever drawn them. */
  +'<button class="kb" data-q="xyz" title="Vitality, awareness and will. The mean of the three, 0 to 1.">'
    +cr('Solar',(r.X+r.Y+r.Z)/3*100,{size:'xs',raw:((r.X+r.Y+r.Z)/3).toFixed(2)})+'<span><b>Energy</b></span></button>';
 /* who. proportions, not one label. */
 (function(){
  var aff=(r.aff||[]).map(function(v,i){return {nm:(ARCH[i]||{}).nm||'',v:v};})
   .filter(function(x){return x.nm;}).sort(function(a,b){return b.v-a.v;});
  var tot=aff.reduce(function(a,x){return a+x.v;},0)||1;
  var T=['First','Second','Third'];
  function row(k,n,pc){return '<div class="tierow"><span class="tk">'+k+'</span>'
   +'<span class="tn">'+n+'</span><span class="tp">'+pc+'</span></div>';}
  var ah=aff.slice(0,3).map(function(x,i){return row(T[i],x.nm,Math.round(x.v/tot*100)+'%');}).join('');
  var dsh=S.doms.map(function(di,i){var d=DOMAINS[di];
   return d?row(T[i]||'Also',d.nm,Math.round(100/(S.doms.length||1))+'%'):'';}).join('');
  var held=W.filter(function(n){return n.sq>=4;}).length;
  var inst=W.filter(function(n){return n.pole>=4;}).length;
  $('person').innerHTML='<h3>'+(p.you?'You':p.nm)+'</h3>'
   +(p.you?'':'<div class="prole">'+p.age+', '+esc(String(p.role).replace(' · ICP',''))+'</div>')
   +(p.says?'<p class="psay">'+esc(p.says)+'</p>':'')
   +'<div class="pm-eye" style="margin-top:14px">Archetypes</div>'+ah
   +'<div class="pm-eye" style="margin-top:12px">Domains</div>'+dsh
   +'<div class="pm-eye" style="margin-top:12px">Field</div>'
   /* "nothing" was being printed over charge a person had entered themselves.
      If something sits under the line, the row says so rather than reporting
      a zero that is not true. */
   /* "nothing above the line" plus "74 under it" wrapped into four lines in a
      narrow column and read as broken text. One short value, one short note. */
   +row('Held',held?held+' addresses':'nothing',
     held?'':(r.under?r.under+' under the line':''))
   +row('Installed',inst?inst+' addresses':'nothing','')
   +row('Darkest',r.darkB,r.darkV.toFixed(1))
   +row('Law shut',r.weakL.nm,'at the '+r.weakL.b.toLowerCase());})();
 railStack(r); renderBal(r);
 $('rows').innerHTML='<span class="k">Instruments</span><br>'
  +'integrity <b>'+r.Ig.toFixed(1)+'</b><br>intention <b>'+r.It.toFixed(1)+'</b><br>'
  +'pole in <b>'+r.poleMean.toFixed(2)+'</b><br>jouissance <b>'+r.JQ.toFixed(2)+'</b>'
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
      +'<p class="sub">'+(o.over?'jouissance. done past the point where it serves, and not able to stop.'
        :esc(o.auth||o.sub||NOTE[o.kind]))+'</p>'
      +'<div class="w">'+crPat(o,'md')+'</div></div>';}).join('')
    +(rows.length>4?'<div class="rnone">and '+(rows.length-4)+' more below</div>':'')
  : '<div class="rnone">Nothing is running.</div>';
 $('run').querySelectorAll('.rcard').forEach(function(el){el.addEventListener('click',function(){
  var o=rows[+el.dataset.i];
  var same=S.pin&&S.pin.nm===o.nm&&S.pin.kind===o.kind;
  S.pin=same?null:o; runDrill(S.pin); render();});});
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
 if(e.target.closest&&e.target.closest('#pol2')){S.pin=null;ANA_PICK=null;runCompassDrill();return;}
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
setTab(TAB.FIELD);
requestAnimationFrame(loop);
