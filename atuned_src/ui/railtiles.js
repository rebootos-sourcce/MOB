/* ============================================================
   THE RAIL IS ALIVE IN PLACE, round OJ, re-cut in round OM and again in OO.

   His words, OJ: "I want the art director team, innovation team, animation
   team to make the left hand menu, the spiritual, the celestial section and
   the archetype section, I want that visual language improved using elements
   from either the Field or the Compass; it's kind of a dynamic area even
   though we don't really use it, and so it's not really showing the
   connections, and so I want those elements to be more visible, showing that
   they're active." And of the three builds: "For number one, combine."

   OM, on the lines the first cut drew from a tile to the wheel: "I don't like
   those lines. Give me something else." And OO, which closes it: the animation
   in the left menu does not reach into the centre pane. Nothing here draws on
   the stage, nothing lights a circle on the glass bar, and nothing runs from a
   tile across the page to the wheel. Whatever the left menu does, it does
   where it stands, and it does it from the moment it is open, because every
   part of it is wired to the data and moves on the Field's own clock.

   WHAT MOVES, ALL OF IT IN THE RAIL AND ALL OF IT FROM A READING.
     the bars        every element of the readings block is one bar, round RB:
                     a light travels each single fill at the Field's rate;
                     Flow carries its wave with a bead on it inside its bar; a
                     reading that moves throws its head, leaves its hairline
                     and says by how much; and the three pairs, CQ against
                     DQ, benign against malignant, masculine against feminine,
                     press in from their own ends and meet on an edge that
                     swings by the figure each swings by (ui/component.js,
                     rbRow and rbPair)
     the wire        GONE, rounds RZ and RB. The six readings hung on a
                     vertical wire down the dock's left edge, and nothing on it
                     said what it was. His words, RZ: "I don't know what that
                     bar is on the left-hand side, but it's taking up real
                     estate. Kill it." ui/railwire.js went with it.
     the circles     every domain, root and archetype is a disc with a ring
                     carrying the number the engine computes for it, and the
                     ones that carry real weight breathe; a chosen one closes
                     its ring in its seat colour and breathes on the Field's
                     4.2 second wave, at the phase of its seat's first address,
                     so a tile and the address it acts on are bright together
                     and dim together. They are on the same clock as the wheel
                     and they touch nothing of it.
     the pairs       orientation and balance are bars, not dials, and swing
                     on the same clock as the wheel (rbPairTick)
     the map         the four systems and what meets what, drawn from the same
                     call the right rail reads, with a pulse on each strong
                     meeting at the Field's rate
   And the wheel still answers the rail's tiles from its own side: a pointer
   over a domain's arc lights that domain's tile, over an archetype's its tile,
   over a seat's band every archetype seated there (rlEcho). That is the rail
   being shown something, not the rail reaching out.

   WHAT IS TRUE, so a ring is never a guess. buildSoul (engine/core.js) lays
   each selection onto the nineteen domain slots and suscAll
   (engine/compute.js) turns the slots into a susceptibility on every address.
   A domain's ring is how far the chosen blueprint reaches it, DOMAIN[d]. An
   archetype's ring is its share of what the blueprint expresses, r.aff[j],
   against the strongest. Both are the numbers the wheel is drawn from.

   STILL. Reduced motion, body.quiet and body.rm draw every ring and the map
   at their figures and none of the breath.
   ============================================================ */
var RL={dq:0};
function rlCalm(){return rbStill();}
var RL_BREATH=4.2;
/* THE PHASE OF A SEAT'S BREATH, as the negative delay a CSS animation needs
   to be at its peak when the wheel's address at that seat is. The wheel's
   brightness peaks where TAU t / 4.2 less i times 0.12 is a quarter turn;
   the animation's peak is half way through its period. Read once when a
   tile's state flips, and never per frame. */
function rlPhase(seat){
 var n=null; for(var q=0;q<W.length;q++)if(W[q].b===seat){n=W[q];break;}
 var ph=(n?n.i:0)*0.12, peak=(Math.PI/2+ph)*RL_BREATH/TAU,
  c=(((S.t-peak+RL_BREATH/2)%RL_BREATH)+RL_BREATH)%RL_BREATH;
 return -c;}
function rlSeatOf(kind,j){
 if(kind==='dom')return DOMAINS[j]&&ROOTSEAT[DOMAINS[j].r];
 if(kind==='arch')return ARCH[j]&&ARCH[j].b;
 return ROOTSEAT[j];}

/* ============================================================
   THE TILES ARE THE FIELD'S OWN CIRCLES, AND EACH CARRIES A READING.

   The glass bar's circle is a disc, a ring round the rim carrying a real
   number, and the mark inside. The rail's grids were square black tiles with a
   mark in them, which is the one family on the page that was not that, and it
   is the difference he saw as "the icons are different". They are the circle
   now, 38 across inside the 44 target, and the ring is a reading too: for a
   blueprint domain it is how far the chosen blueprint reaches that domain,
   DOMAIN[d], the lobe buildSoul lays across the nineteen slots, so the ring
   round the chosen one closes and the ones either side of it part fill and
   the far side is bare, which is the spread the engine computes and the rail
   never showed. For an archetype it is the share of the blueprint that
   expresses as that archetype, r.aff[j], the same number the wheel draws the
   thirtieth of its ring from. Written when a reading is, not per frame, and
   moved by a transition on the stroke, the way the glass bar's ring moves.
   ============================================================ */
function ibArc(){
 return '<svg class="ib-arc" viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="18"/>'
  +'<circle class="val" cx="20" cy="20" r="18" pathLength="100"/></svg>';}
function rlArcs(r){
 RL.dq=+r.DQ||0;
 /* a figure at .18 or over is a circle that carries real weight, and it
    breathes at its seat's phase; a chosen one breathes whatever its figure */
 function put(b,v){var s=(Math.max(0,Math.min(1,+v||0))*100).toFixed(1);
  if(b.getAttribute('data-v')!==s){b.setAttribute('data-v',s); b.style.setProperty('--v',s);}
  b.classList.toggle('rl-hot',+s>=18);}
 function ph(b,kind,i){var on=b.getAttribute('aria-pressed')==='true'||b.dataset.r==='2',
   key=(on?'1':'0')+(b.classList.contains('rl-hot')?'h':'');
  if(b._rp===key)return; b._rp=key;
  var seat=(on||b.classList.contains('rl-hot'))&&!rlCalm()?rlSeatOf(kind,i):null;
  if(seat)b.style.setProperty('--bd',rlPhase(seat).toFixed(3)+'s'); else b.style.removeProperty('--bd');}
 var dm=document.getElementById('doms');
 if(dm)[].forEach.call(dm.children,function(b,i){put(b,r.unread?0:DOMAIN[i]); ph(b,'dom',i);});
 ['ar1','ar2'].forEach(function(id){var e=document.getElementById(id);
  if(e)[].forEach.call(e.children,function(b,i){put(b,r.unread?0:(r.aff||[])[i]); ph(b,'arch',i);});});
 var ro=document.getElementById('roots');
 if(ro)[].forEach.call(ro.children,function(b){if(b.dataset.r)ph(b,'root',b.dataset.r);});
 /* the folded line's circles carry the same two numbers and the same breath */
 document.querySelectorAll('#awsum .aw-c').forEach(function(b){
  var k=b.getAttribute('data-k'), i=+b.getAttribute('data-i');
  put(b,r.unread?0:(k==='dom'?DOMAIN[i]:(r.aff||[])[i]));
  if(!b._rp){b._rp='1'; var seat=rlCalm()?null:rlSeatOf(k,i);
   if(seat)b.style.setProperty('--bd',rlPhase(seat).toFixed(3)+'s');}});}

/* AND IT RUNS THE OTHER WAY. A pointer over a domain's arc on the wheel lights
   that domain's tile and its root's chip; over an archetype's arc, that
   archetype's tile in both grids; over a seat's band, every archetype seated
   at it, which is ARCH's own b and the reason the table carries one. The
   rail answers the Field the way the Field answers the rail. A key is kept so
   a pointer moving inside one arc touches nothing, and the lookup is done
   only when it changes. */
var RL_ECHO='';
function rlEcho(h){
 var key=h&&(h.k==='dom'||h.k==='arch'||h.k==='seat')?h.k+':'+(h.k==='seat'?h.b:h.j):'';
 if(key===RL_ECHO)return; RL_ECHO=key;
 document.querySelectorAll('.rl-echo').forEach(function(e){e.classList.remove('rl-echo');});
 if(!key)return;
 function set(id,i){var g=document.getElementById(id); if(g&&g.children[i])g.children[i].classList.add('rl-echo');}
 if(h.k==='dom'){set('doms',h.j); var rn=DOMAINS[h.j]&&DOMAINS[h.j].r, rt=document.getElementById('roots');
  if(rt)[].forEach.call(rt.children,function(b){if(b.dataset.r===rn)b.classList.add('rl-echo');});}
 else if(h.k==='arch'){set('ar1',h.j); set('ar2',h.j);}
 else ARCH.forEach(function(A,i){if(A.b===h.b){set('ar1',i); set('ar2',i);}});}

/* ============================================================
   THE FOUR SYSTEMS, AND WHAT MEETS WHAT.

   Root Energetics was twenty lines of four tables, each one saying what its
   system says. What the four say TOGETHER is the thing the right rail leads
   with (rootOverlap, engine/overlap.js), and the left rail never drew it, so
   the celestial section was a list and not a connection. It opens on that
   picture now: the four systems as the product's own four marks in their
   rings, and for every theme that two or more of them reach on their own, an
   arc between them with the theme's planet or element riding its top. A
   stronger meeting is a heavier arc and a pulse runs along it, at the rate
   the Field's threads run on; a light one is a hairline and
   still. A system that meets nothing is drawn idle, and one that meets
   something takes the accent. Built from the same call the right rail's
   summary reads, so the two cannot disagree, and rewritten with the section.
   ============================================================ */
function rlMeetHtml(sp,nm){
 if(!sp||typeof rootOverlap!=='function')return '';
 var real=numFullName(CURP)||(typeof FULLNAME!=='undefined'&&FULLNAME[nm]);
 var N=real?numerologyOf(nm,CURP):null, R=rootOverlap(sp,N);
 var S4=['W','E','N','D'], X=function(i){return 33+i*66.67;}, NY=86, RAD=16.5;
 var calm=rlCalm(), dq=RL.dq||0;
 var rate=lerp(PUL_LO,PUL_HI,clamp((+dq||0)/100,0,1));
 var arcs='', chips='', pulses='', touched={}, said=[], count={}, seen={}, y0=NY-RAD-2;
 var shown=R.shown.map(function(a){
  var ix=S4.map(function(s,i){return a.sys.indexOf(s)>=0?i:-1;}).filter(function(i){return i>=0;});
  return {a:a,ix:ix};}).filter(function(m){return m.ix.length>1;});
 /* meetings on one pair of systems share its arc and sit side by side along
    it, so a second never stacks over the first */
 shown.forEach(function(m){var i0=m.ix[0], i1=m.ix[1], key=i0+'-'+i1; count[key]=(count[key]||0)+1;});
 shown.forEach(function(m){
  var a=m.a, ix=m.ix;
  ix.forEach(function(i){touched[i]=1;});
  said.push(a.t+' between '+ix.map(function(i){return SYSNAME[S4[i]];}).join(' and '));
  var w=a.strength==='strong'?2.3:a.strength==='clear'?1.8:1.3, al=a.strength==='strong'?.95:a.strength==='clear'?.8:.6;
  for(var k=0;k<ix.length-1;k++){
   var i0=ix[k], i1=ix[k+1], span=i1-i0, ap=y0-12-13*span;
   var x0=X(i0), x1=X(i1), cy=2*ap-y0,
    d='M'+x0.toFixed(1)+' '+y0+'Q'+((x0+x1)/2).toFixed(1)+' '+cy+' '+x1.toFixed(1)+' '+y0;
   arcs+='<path class="sp-na" data-s="'+a.strength+'" d="'+d+'" style="stroke-width:'+w+';opacity:'+al+'"/>';
   if(!calm&&a.strength!=='light'){
    var per=(Math.hypot(x1-x0,(y0-ap)*2)*1.15/(64*rate)).toFixed(2);
    pulses+='<rect class="sp-pulse" x="-3.5" y="-1" width="7" height="2" rx="1"><animateMotion dur="'+per+'s" '
     +'repeatCount="indefinite" rotate="auto" path="'+d+'"/></rect>';}
   /* the theme rides its first arc, at its own place along it */
   if(k===0){var key=i0+'-'+i1, c=count[key]||1, n=seen[key]=(seen[key]||0)+1, t=n/(c+1),
     cxp=x0+(x1-x0)*t, cyp=y0+(cy-y0)*2*t*(1-t);
    chips+='<g class="sp-nc" transform="translate('+cxp.toFixed(1)+' '+cyp.toFixed(1)+')" data-tip-t="'+esc(a.t)
     +'" data-tip="'+esc(RS_STRENGTH[a.strength])+'"><circle r="9.5"/><g transform="translate(-6 -6) scale(.5)">'
     +rsThemeIc(a)+'</g></g>';}}});
 var nodes=S4.map(function(s,i){
  var here=R.systems.indexOf(s)>=0, on=!!touched[i];
  return '<g class="sp-sn'+(on?' on':here?'':' off')+'" transform="translate('+X(i).toFixed(1)+' '+NY+')">'
   +'<circle class="sp-nr" r="'+RAD+'"/><g transform="translate(-10 -10) scale(.8333)">'+SYSGLYPH[s]+'</g>'
   +'<text y="'+(RAD+15)+'" text-anchor="middle">'+SYSNAME[s]+'</text></g>';}).join('');
 return '<div class="sp-map" role="img" aria-label="'+esc(said.length?'Where the four systems meet. '+said.join('. ')+'.'
  :'The four systems, and no theme that two of them reach on their own.')+'">'
  +'<svg viewBox="0 0 266 126" class="sp-mapsvg" aria-hidden="true">'+arcs+pulses+nodes+chips+'</svg></div>';}

/* the circle on the glass bar lights its row in the rail, and lets it go: the
   one pairing left, and it is the rail being shown something */
(function(){
 var fb=document.getElementById('fbar');
 if(!fb)return;
 function rowOf(ev){var o=ev.target.closest&&ev.target.closest('[data-fb]'); if(!o)return null;
  return document.querySelectorAll('#fdock [data-fk="'+o.getAttribute('data-fb')+'"]');}
 function lightRows(ev){var rows=rowOf(ev); if(rows)rows.forEach(function(b){b.classList.add('rb-hot');});}
 function dimRows(){document.querySelectorAll('#fdock .rb-hot').forEach(function(b){b.classList.remove('rb-hot');});}
 fb.addEventListener('pointerover',lightRows); fb.addEventListener('focusin',lightRows);
 fb.addEventListener('pointerout',dimRows); fb.addEventListener('focusout',dimRows);})();

/* ============================================================
   THE AWARENESS SECTION FOLDS TO TWO LINES, round OM, on the lead's ruling 7.
   The domain grids and the two archetype grids were open on arrival and were
   the whole of the first screen's lower half: at 1000 high the archetypes
   began below the fold, so a person met the rail's readings and its nineteen
   domains and never saw the twelve archetypes without scrolling. Folded, the
   section is what the person actually chose, one line for the domain and one
   for the archetype, each as the same circle the grid draws it as, with its
   ring, its mark and its name, and a press anywhere on a line opens the grids
   to change it. The first screen then carries the six readings, the two dials,
   the domain line and the archetype line.

   The circles are marks and not controls: the line is the one button, 44px,
   so nothing here is a second target on top of the first. A chosen thing
   still breathes in step with the stretch of the wheel it acts on (the ring
   takes the same phase, ui/railtiles.js, rlPhase) whether the grid is open or
   not. The section shows what the grids would; it does not add a choice. */
function awC(kind,i){
 var D=kind==='dom'?DOMAINS[i]:ARCH[i]; if(!D)return '';
 var col=kind==='dom'?rootCol(D.r):icCol(D.b);
 return '<span class="aw-c on" data-k="'+kind+'" data-i="'+i+'" style="--c:'+col+'">'
  +svgI('<path d="'+D.ic+'"/>')+ibArc()+'</span>';}
function awRow(kind,label,idx){
 var nm=idx.map(function(i){var D=kind==='dom'?DOMAINS[i]:ARCH[i]; return D?D.nm:'';}).filter(Boolean);
 var say=kind==='dom'?idx.map(function(i){return DOMAINS[i]&&DOMAINS[i].nm+' under '+DOMAINS[i].r;}).filter(Boolean).join(', ')
  :nm.join(' and ');
 return '<button type="button" class="aw-r" data-aw="'+kind+'" title="'+esc(label+'. '+say+'. Press to open the grids and change it.')
  +'" aria-label="'+esc(label+', '+nm.join(' and ')+'. Open the grids to change it.')+'">'
  +'<span class="aw-k">'+label+'</span><span class="aw-cs">'+idx.map(function(i){return awC(kind,i);}).join('')+'</span>'
  +'<span class="aw-t">'+esc(nm.join(kind==='dom'?', ':' + '))+'</span></button>';}
function awSum(){
 var el=document.getElementById('awsum'); if(!el)return;
 var d=(S.doms||[]).slice(0,3), a=(S.arcs||[]).slice(0,3);
 el.innerHTML=awRow('dom','Domain',d)+awRow('arch','Archetype',a);
 el.querySelectorAll('.aw-r').forEach(function(b){b.onclick=function(){
  var hd=document.querySelector('.lsec[data-sec=soul] .lsec-hd'); if(hd)hd.click();};});
}
