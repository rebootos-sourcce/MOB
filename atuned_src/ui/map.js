
/* ============================================================
   THE ENERGY MAP. One code path serves all seven layers: resolve
   marks, place them, draw their links, draw the annotation, then
   write the shelf into the right rail.
   ============================================================ */
/* The raster probe. Browser only, so it lives with the renderer and not with
   the figure data. The original compared S.tab against a bare 3; a stale tab
   integer is the most repeated bug in this codebase, so it reads TAB.ENERGY. */
(function(){
 if(typeof Image==='undefined')return;                 /* node, or no DOM */
 [FIG_FETTER,FIG_PAIN].forEach(function(src){
  if(!src)return;                                      /* nothing named, nothing asked for */
  var im=new Image();
  im.onload =function(){ART_OK[src]=1;
   if(typeof render==='function'&&S.tab===TAB.ENERGY)render();};
  im.onerror=function(){ART_OK[src]=0;};
  im.src=src;});
})();
var PMLAYER='bands', PMPICK=null, PAINPICK=null, _pmpos={}, LOADED=4;
var PMYP={};PMBANDS.forEach(function(b){PMYP[b.k]=b.yp;});
var HW=24.2;
function pmNode(id,k){
 if(_pmpos[id])return _pmpos[id];
 var baseY=(PMYP[k]!=null?PMYP[k]:30),n=0,s=String(id);
 for(var i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;
 var q=(n*2654435761)%1000,ang=(q/1000)*Math.PI*2,rx=6.4+(q%7),ry=2.4+((q>>3)%4);
 return (_pmpos[id]={x:Math.max(50-HW*0.9,Math.min(50+HW*0.9,50+Math.cos(ang)*rx)),
                     y:Math.max(2,Math.min(97,baseY+Math.sin(ang)*ry))});}
/* THE HEAT HAS TO BE THE HEAT OF WHAT IS SELECTED.

   flSeats reads the load of every carrying address, which is the right answer
   for Fetters and for Flow and the wrong one for every pattern layer: picking
   Saboteurs and picking Complexes drew exactly the same wash, because neither
   of them was being asked. The owner's finding, and it is correct: the heat
   map does not match what is selected.

   On a pattern layer the heat is built from the addresses those patterns
   actually stand on, weighted by each pattern's own weight. So the wash under
   thirty four saboteurs is the shape of thirty four saboteurs, even though
   only the heaviest few get a ring on top of them. That is also the answer to
   the other half of it: every pattern contributes to the picture, not only
   the ones named. */
function pmHeat(r){
 var L=PMLAYER;
 if(L==='bands'||L==='nerves'||L==='pain')return null;
 var src=(L==='sab')?r.sabs
   :(L==='cx')?r.cxs
   :(L==='hyper')?r.hys.concat(r.sups)
   :(L==='masks')?r.maskRing:null;
 if(!src||!src.length)return null;
 var by={},any=0;
 src.forEach(function(o){
  var lv=(L==='masks')
   ? W.filter(function(n){return o.bands&&o.bands.indexOf(n.b)>=0&&n.sq>=LOADED;})
   : leaves(o);
  var w=(o.w||0)/10;
  lv.forEach(function(n){
   var k=B2K[n.b]; if(!k)return;
   by[k]=(by[k]||0)+w*clamp(n.sq/10,0.15,1); any=1;});});
 if(!any)return null;
 /* normalised against the busiest seat, so the wash always uses its range
    rather than reading as nothing on a light profile. */
 var max=0; Object.keys(by).forEach(function(k){if(by[k]>max)max=by[k];});
 if(max<=0)return null;
 var out={}; Object.keys(by).forEach(function(k){out[k]=clamp(by[k]/max,0,1);});
 return out;}
function flSeats(){
 return FLOWSEAT.map(function(p){
  var b=K2B[p.k],seg=W.filter(function(n){return n.b===b;});
  var hot=seg.filter(function(n){return n.sq>=LOADED;});
  var load=hot.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,seg.length)/10;
  return {p:p,load:load,pass:Math.max(0,1-load*1.35),hot:hot.length,tot:seg.length,
   held:hot.length>=Math.max(2,seg.length*0.28),
   mean:hot.length?hot.reduce(function(a,n){return a+n.sq;},0)/hot.length:0};});}
function flSpeed(){var s=1;flSeats().slice().reverse().forEach(function(x){s*=x.pass;});return s;}

function pmMarks(r){
 var L=PMLAYER;
 if(L==='bands') return W.filter(function(n){return n.sq>=LOADED||n.pole>=4;})
   .map(function(n){return {o:n,kind:'node',band:n.b,v:n.sq/10,nm:n.k,links:[]};});
 /* THE PAIN MAP OPENS BLANK. Ruled. It printed every carrying address on the
    figure the moment it was opened, which is the instrument answering a
    question before it has been asked: a pain map exists to be told where it
    hurts, and one that arrives already covered is telling the person where it
    hurts instead. Nothing is drawn until a region is painted, and then only
    what that region holds. */
 if(L==='pain'){
  if(!PAINPICK)return [];
  var pr=PAINREG.filter(function(x){return x.k===PAINPICK;})[0];
  return W.filter(function(n){return n.sq>=LOADED+1
    &&(!pr||pr.bands.indexOf(n.b)>=0);})
   .map(function(n){return {o:n,kind:'heat',band:n.b,v:(n.sq-LOADED)/(10-LOADED),nm:n.k,links:[]};});}
 if(L==='nerves')return flSeats().map(function(s){
   return {o:s,kind:'seat',band:K2B[s.p.k],v:s.pass,nm:s.p.n,links:[]};});
 if(L==='sab')   return r.sabs.map(function(o){var lv=leaves(o);
   return {o:o,kind:'bead',band:(lv[0]||{}).b,v:o.w/10,nm:o.nm,links:lv,
     sub:(o.named?o.score+'% match'+(o.exact?' exact':''):'inferred')};});
 if(L==='cx')    return r.cxs.map(function(o){var lv=leaves(o);
   return {o:o,kind:'bead',band:(lv[0]||{}).b,v:o.w/10,nm:o.nm,links:lv,sub:'complex'};});
 if(L==='hyper') return r.hys.concat(r.sups).map(function(o){var lv=leaves(o);
   return {o:o,kind:'bead',band:(lv[0]||{}).b,v:o.w/10,nm:o.nm,links:lv,
     sub:o.sub||(o.kind==='sup'?'character':'hyper-complex')};});
 if(L==='masks') return r.maskRing.map(function(m){
   var lv=W.filter(function(n){return m.bands&&m.bands.indexOf(n.b)>=0&&n.sq>=LOADED;});
   return {o:m,kind:'bead',band:(m.bands||['Heart'])[0],v:m.w/10,nm:m.nm,links:lv,
     sub:(m.bands||[]).join(' + ')};});
 return [];}
function pmPlace(marks){
 marks.forEach(function(m){
  var k=B2K[m.band]||'heart';
  if(m.kind==='node'||m.kind==='heat'){var p=pmNode(m.o.i,k);m.x=p.x;m.y=p.y;}
  else if(m.kind==='seat'){m.x=50;m.y=PMYP[k];}
  else{ m.want=(function(){
   var ys=m.links.map(function(n){return PMYP[B2K[n.b]];}).filter(function(v){return v!=null;});
   return ys.length?ys.reduce(function(a,b){return a+b;},0)/ys.length:PMYP[k];})(); }});
 var beads=marks.filter(function(m){return m.kind==='bead';}).sort(function(a,b){return b.v-a.v;});
 beads.forEach(function(m,i){ m.rank=i; });
 return marks;}

/* HOW MUCH EACH LAYER HOLDS.

   Fetters read zero on this profile and the layer still opened by default,
   so the first thing the page said was nothing, on a body with twenty eight
   saboteurs sitting one button away. A control that offers an empty room
   first is a broken control. Every layer now carries its own count, and the
   opening layer is the first one that has something in it. */
function pmCount(r,L){
 /* A COUNT UNDER A WORD IS A COUNT OF THAT WORD. This counted every address
    carrying at or above the line OR holding the installed opposite at 4, under
    a button labelled Fetters. The installed opposite is the other pole: it is
    the nearest thing in the instrument to the reverse of a fetter, and on the
    people with the most of it installed it was the whole of the number.

    Measured across the roster: Rosa reads CQ 100 at Mastery, carries nothing
    at all, and the Body told her Fetters 107. Lance reads 87.7 and carries
    nothing, Fetters 107. Gordon, who is the most loaded person in the roster
    at CQ 1, read 97. The number ran backwards for exactly the people the
    product is kindest to, which is the same inversion the record already
    carries once from the Summary glance row.

    The original reason for the OR was real and is kept: counting only
    sq>=LOADED dimmed the layer to zero for Sofia while forty nine addresses
    sat inside it. `carrying` is the answer to that, and it is the honest one,
    because it is every address holding anything rather than a line drawn at 4.
    Sofia now reads 52 and the layer is not dimmed; Rosa and Lance read 0,
    which is what they carry. The layer still DRAWS both poles, because drawing
    is not counting, and an empty layer stays reachable and reads back. */
 if(L==='bands') return (r&&r.carrying)?r.carrying.length
   :W.filter(function(n){return n.sq>0;}).length;
 /* the button counts what is there to be found, not what is drawn: the layer
    opens blank by ruling, and a button reading zero on a body with nineteen
    carrying addresses would read as an empty instrument rather than as one
    waiting to be asked. */
 if(L==='pain')  return W.filter(function(n){return n.sq>=LOADED+1;}).length;
 if(L==='nerves')return 7;
 if(L==='sab')   return r.sabs.length;
 if(L==='cx')    return r.cxs.length;
 if(L==='hyper') return r.hys.length+r.sups.length;
 if(L==='masks') return r.maskRing.length;
 return 0;}
var PMFIRST=1;
function renderMap(r){
 if(PMFIRST){ PMFIRST=0;
  if(!pmCount(r,PMLAYER)){ for(var pf=0;pf<PML.length;pf++){
   if(pmCount(r,PML[pf][0])){PMLAYER=PML[pf][0];break;} } } }
 var host=document.getElementById('emap');if(!host)return;
 var seats=flSeats(),speed=flSpeed(),loadedTot=W.filter(function(n){return n.sq>=LOADED;}).length;
 var stop=null;seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var dom=seats.slice().sort(function(a,b){return b.hot-a.hot||b.load-a.load;})[0];
 var marks=pmPlace(pmMarks(r));
 /* THE PIN HAD TO BE RE-SEATED EVERY FRAME.

    PMPICK holds the pattern object itself and every call site compares it by
    identity. The read hands back a fresh set of objects on each compute, so
    the instant anything re-rendered, the pinned object matched nothing in the
    new set: show came back empty and the body went blank with the pin still
    lit in the rail. Clicking a pattern emptied the page.

    The pin is re-seated onto this frame's object by name before anything
    reads it, which leaves every identity comparison downstream correct. */
 if(PMPICK&&typeof PMPICK==='object'){
  var pnm=PMPICK.nm, pag=null;
  marks.forEach(function(m){if(m.kind==='bead'&&m.nm===pnm)pag=m.o;});
  PMPICK=pag; S.pin=pag;}
 var domc=PMC[K2B[dom.p.k]]||'var(--gold)';
 /* THE CONTROLS ARE NOT IN THE PICTURE. They render into the sub bar, which
    is where Field already puts its depth ladder, so this surface stops
    covering its own figure with the buttons that change it. */
 (function(){
  var lb=document.getElementById('lbar'); if(!lb)return;
  lb.innerHTML=PML.map(function(L){
   var cn=pmCount(r,L[0]);
   return '<button class="pm-lb'+(PMLAYER===L[0]?' on':'')+(cn?'':' empty')
    +'" data-pml="'+L[0]+'">'+L[1]
    +(L[0]==='nerves'?'':'<b>'+cn+'</b>')+'</button>';}).join('');
  var rb=document.getElementById('rbar'); if(!rb)return;
  if(PMLAYER==='pain'){
   rb.style.display='flex';
   rb.innerHTML='<span class="pm-eye" style="align-self:center;margin-right:4px">Region</span>'
    +'<button class="pm-rb'+(PAINPICK?'':' on')+'" data-reg="">All</button>'
    +PAINREG.map(function(p){
     return '<button class="pm-rb'+(PAINPICK===p.k?' on':'')+'" data-reg="'+p.k+'">'
      +p.nm+'</button>';}).join('');
  }else{rb.style.display='none';rb.innerHTML='';}})();
 var h='<div class="pm-well">'
  +'<div class="pm-aura" style="background:radial-gradient(ellipse 62% 48% at 50% 40%,'+domc
  +' 0%,transparent 70%);opacity:'+(0.08+r.radiance*0.30).toFixed(3)+'"></div>'
  +'<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" class="pm-svg">';
 /* THE CLIP WAS SWALLOWING EVERY ADDRESS ON THE BODY.

    This wrapped the body path in a <g> to carry the transform. A clipPath may
    only hold shapes, <text> and <use>: a <g> child is not valid geometry and
    is ignored, which left the clip with no geometry at all, which clips away
    everything inside it. Every node and heat mark on the figure has been in
    the document and painting nothing, on every layer, for as long as the clip
    has been there. Forty nine addresses, all present, all invisible.

    The transform belongs on the path, where it is valid. */
 h+='<clipPath id="pmClip"><path transform="translate('+PMTX+','+PMTY+') scale('+PMS
  +')" d="'+BODYPATH+'"/></clipPath>';
 /* the base figure. raster when present, vector when not. */
 var IMG=(PMLAYER==='pain')?FIG_PAIN:FIG_FETTER, IAR=(PMLAYER==='pain')?FIG_PAIN_AR:FIG_FETTER_AR;
 if(ART_OK[IMG]){
  var IH=96, IW=IH*IAR, IX=50-IW/2;
  h+='<image class="pm-art" href="'+IMG+'" x="'+IX.toFixed(2)+'" y="2" width="'+IW.toFixed(2)
   +'" height="'+IH+'" preserveAspectRatio="xMidYMid meet"/>';
 }else{
  /* A FILLED SILHOUETTE, not a wire. At rgba(128,128,128,.045) under an
     opacity of .34 the fill was four thousandths of an alpha and the figure
     was a line drawing, which gives the field nothing to sit in and gives the
     eye no body to read the field against. The reference maps are all a solid
     shape on a dark ground. The fill is its own alpha now so the outline can
     stay faint without taking the body with it. */
  h+='<g class="pm-vec" transform="translate('+PMTX+','+PMTY+') scale('+PMS+')">'
   +'<path d="'+BODYPATH+'" fill="rgba(150,152,160,.085)" stroke="currentColor" '
   +'stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-opacity=".34"/></g>';
  /* the pain layer wants anatomy, not an outline. the traced branches are the
     nerve map and they are already vector, so they stand in for the raster. */
  if(PMLAYER==='pain')NERVEBR.forEach(function(br){
   var c=PMC[K2B[br.s]]||'#888';
   h+='<path d="M'+br.p.map(function(q){return q[0]+','+q[1];}).join(' L')
    +'" fill="none" stroke="'+c+'" stroke-width=".28" opacity=".22" stroke-linecap="round"/>';});}
 /* the branches, when the flow layer is up */
 if(PMLAYER==='nerves'){
  var passOf={};seats.forEach(function(s){passOf[s.p.k]=s.pass;});
  var cum={},run=1;
  ['root','sacral','solar','heart','throat','eye','crown'].forEach(function(k){run*=passOf[k];cum[k]=run;});
  NERVEBR.forEach(function(br){
   var th=cum[br.s]!=null?cum[br.s]:0.5, c=PMC[K2B[br.s]]||'#888';
   var d='M'+br.p.map(function(q){return q[0]+','+q[1];}).join(' L');
   h+='<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(0.22+th*0.5).toFixed(2)
    +'" opacity="'+(0.10+th*0.72).toFixed(3)+'" stroke-linecap="round"/>';});}
 /* THE SEVEN SEATS, AS HEAT.

    They were three stacked circles each: a wash, a hard disc and a ring. Seven
    of those down the spine reads as seven buttons on a diagram, which is a
    control panel, not a body. Charge is not a disc. It is heat in tissue, and
    heat has no edge.

    Each seat is one radial gradient whose radius and opacity both run off its
    own load, drawn with additive blending so two loaded seats next to each
    other pool the way real heat does rather than stacking as two flat discs.
    A seat carrying nothing draws almost nothing, which is the honest picture
    of a seat carrying nothing. */
 (function(){
  var col=marks.filter(function(m){return m.kind==='seat';})
   .sort(function(a,b){return a.y-b.y;});
  if(col.length<2)return;
  /* A clear channel is every seat at full pass, which at the first widths
     came out as one flat slab five units across running the length of the
     torso and rubbing out the anatomy under it. A channel running clean
     should read as running clean, not as a bar laid on a body. Narrow, and
     let the pinch do the talking. */
  var half=function(m){return 0.40+m.v*1.25;};
  var L=[],R=[];
  col.forEach(function(m){L.push([50-half(m),m.y]);R.push([50+half(m),m.y]);});
  /* close the ends on the figure rather than in mid air */
  /* and they close ON the figure. At minus six the head end was finishing
     above the crown, off the top of the body, which is a channel leaking
     into the margin. */
  L.unshift([50-half(col[0])*0.5,Math.max(3.0,col[0].y-1.6)]);
  R.unshift([50+half(col[0])*0.5,Math.max(3.0,col[0].y-1.6)]);
  L.push([50-half(col[col.length-1])*0.5,col[col.length-1].y+4.5]);
  R.push([50+half(col[col.length-1])*0.5,col[col.length-1].y+4.5]);
  var d='M'+L[0][0].toFixed(2)+','+L[0][1].toFixed(2);
  for(var i=1;i<L.length;i++){
   var p=L[i-1],q=L[i],my=(p[1]+q[1])/2;
   d+=' C'+p[0].toFixed(2)+','+my.toFixed(2)+' '+q[0].toFixed(2)+','+my.toFixed(2)
    +' '+q[0].toFixed(2)+','+q[1].toFixed(2);}
  d+=' L'+R[R.length-1][0].toFixed(2)+','+R[R.length-1][1].toFixed(2);
  for(var j=R.length-1;j>0;j--){
   var p2=R[j],q2=R[j-1],my2=(p2[1]+q2[1])/2;
   d+=' C'+p2[0].toFixed(2)+','+my2.toFixed(2)+' '+q2[0].toFixed(2)+','+my2.toFixed(2)
    +' '+q2[0].toFixed(2)+','+q2[1].toFixed(2);}
  d+=' Z';
  var g1='pmRiv';
  h+='<defs><linearGradient id="'+g1+'" x1="0" y1="0" x2="0" y2="1">'
   +col.map(function(m,i2){
     return '<stop offset="'+(i2/(col.length-1)*100).toFixed(1)+'%" stop-color="'
      +(PMC[m.band]||'#888')+'" stop-opacity="'+(0.05+m.v*0.15).toFixed(3)+'"/>';}).join('')
   +'</linearGradient></defs>';
  /* A CHANNEL IS ITS BANKS.

     Filled solid, this is a coloured bar laid down the middle of a body, and
     a bar has no pinch to read: at full pass every seat is the same width and
     the shape says nothing at all. What carries the reading is the two walls
     and where they close on each other, so the fill drops to a wash and the
     outline is the thing you actually see. */
  h+='<path d="'+d+'" fill="url(#'+g1+')"/>'
   +'<path d="'+d+'" fill="none" stroke="url(#'+g1+')" stroke-width=".55" '
   +'opacity="1" stroke-linejoin="round"/>';
  /* the one word this layer is allowed. It used to be a rule straight across
     the figure with the caption sitting on the channel, which put text on the
     body to say a thing the body was already saying by pinching. Now it is a
     short leader out to clear air and the words land beside the figure. */
  if(stop){
   var sm=col.filter(function(m){return m.o.p.k===stop.p.k;})[0];
   if(sm){var c2=PMC[sm.band], lx=50+half(sm)+3.5;
    h+='<path d="M'+lx.toFixed(2)+','+sm.y+' H'+(lx+8).toFixed(2)+'" stroke="'+c2
     +'" stroke-width=".3" opacity=".7" fill="none"/>'
     +'<circle cx="'+lx.toFixed(2)+'" cy="'+sm.y+'" r=".55" fill="'+c2+'" opacity=".9"/>'
     +'<text x="'+(lx+8.8).toFixed(2)+'" y="'+(sm.y+0.9).toFixed(2)+'" class="pm-lbl" '
     +'style="fill:'+c2+'">stops at the '+esc(String(sm.o.p.n).toLowerCase())+'</text>';}}})();
 /* A heat map has one kernel size and lets intensity carry the reading. The
    first cut ran the radius off the load as well, so a light seat drew a dot
    and a body with light load read as seven dots on a diagram. Anatomy sets
    the radius, which is what b.r has always been. Load sets the brightness. */
 var LHEAT=pmHeat(r);
 /* the load a seat draws with: the layer's own when the layer has one, the
    field's otherwise. */
 var seatLoad=function(k){
  var st=seats.filter(function(s){return s.p.k===k;})[0];
  if(LHEAT)return LHEAT[k]||0;
  return (st&&st.load)||0;};
 var HGAIN=function(l){return Math.sqrt(clamp(l||0,0,1));};
 h+='<defs>';
 PMBANDS.forEach(function(b){
  var g=HGAIN(seatLoad(b.k));
  h+='<radialGradient id="pmh-'+b.k+'">'
   +'<stop offset="0%" stop-color="'+b.c+'" stop-opacity="'+(0.07+g*0.62).toFixed(3)+'"/>'
   +'<stop offset="30%" stop-color="'+b.c+'" stop-opacity="'+(0.05+g*0.40).toFixed(3)+'"/>'
   +'<stop offset="64%" stop-color="'+b.c+'" stop-opacity="'+(0.02+g*0.15).toFixed(3)+'"/>'
   +'<stop offset="100%" stop-color="'+b.c+'" stop-opacity="0"/></radialGradient>';});
 /* THE NUMMENMAA TREATMENT. Ruled, with the four bodily maps supplied as the
    reference, and the finding that came with them was that the zones were not
    noticeable. They were not, and the screenshot says why: seven radial
    gradients and a scatter of flat circles, drawn over a wire outline with
    nothing containing them. The washes ran a body width out past the arms into
    empty ground, and every per address bloom was a hard edged disc because a
    circle with a flat fill has an edge no matter how low its opacity goes.
    That is a diagram of seven seats with dots on it.

    What those maps actually do is three things, and the colour is the least of
    them. The silhouette is filled, so there is a body for the field to be in.
    The field is continuous, with no kernel edge anywhere, so intensity is the
    only thing the eye reads. And it stops at the skin.

    So: one blur over the whole heat group, which melts the seven gradients and
    every address bloom into a single field and costs one filter rather than a
    gradient per mark, and then a clip to the silhouette. A filter runs before a
    clip on the same element, which is the order this needs: blur first so the
    field is continuous, clip second so it ends at the body.

    Hue stays the seat. A diverging red to blue scale is what the reference uses
    because it has one variable to show, and this has seven, and colour means
    seat everywhere else in the product. Intensity carries the reading, which is
    what the ramp below was already for. */
 h+='<filter id="pmField" x="-25%" y="-25%" width="150%" height="150%">'
  +'<feGaussianBlur stdDeviation="2.4"/></filter>';
 h+='</defs>';
 /* THE FIELD IS PART OF WHAT BLANK MEANS. The pain layer opens with nothing
    drawn on it, and the charge wash is drawn on every layer, so the map still
    arrived carrying the person's field: seven seats lit and eighteen addresses
    blooming under a figure that was supposed to be asking them where it hurts.
    A map that opens already showing you your own body is not blank in any
    sense the ruling meant. The wash comes back the moment a region is painted,
    because then the person has asked. */
 var PMBLANK=(PMLAYER==='pain'&&!PAINPICK);
 h+=PMBLANK?'<g style="display:none">'
  :'<g style="mix-blend-mode:screen" filter="url(#pmField)" clip-path="url(#pmClip)">';
 PMBANDS.forEach(function(b){
  var rr=(b.r/10)*(9.4+HGAIN(seatLoad(b.k))*4.6);
  h+='<ellipse cx="50" cy="'+b.yp+'" rx="'+(rr*0.92).toFixed(2)+'" ry="'+rr.toFixed(2)
   +'" fill="url(#pmh-'+b.k+')"/>';});
 /* and the texture. Seven symmetric ellipses are a diagram of seven seats. The
    charge is not evenly spread inside a seat, so every carrying address adds
    its own small bloom at its own scattered position, which is what stops the
    wash reading as clip art and starts it reading as a body. */
 W.forEach(function(n){
  if(LHEAT)return;                 /* a layer's heat is its own, not the field's */
  if(n.sq<LOADED)return;
  var k=B2K[n.b]; if(!k)return;
  var q=pmNode(n.i,k), c=PMC[n.b]||'#888', g=clamp((n.sq-LOADED)/(10-LOADED),0,1);
  h+='<circle cx="'+q.x.toFixed(2)+'" cy="'+q.y.toFixed(2)+'" r="'+(3.0+g*4.2).toFixed(2)
   +'" fill="'+c+'" opacity="'+(0.03+g*0.085).toFixed(3)+'"/>';});
 h+='</g>';
 /* the target, and the only hard mark a seat gets: a small core so there is
    something to aim at and something to say a seat is there at all. */
 PMBANDS.forEach(function(b){
  var st=seats.filter(function(s){return s.p.k===b.k;})[0];
  h+='<circle class="pm-seat" data-seat="'+b.k+'" cx="50" cy="'+b.yp+'" r="'
   +(0.85+st.load*1.1).toFixed(2)+'" fill="'+b.c+'" opacity="'+(0.30+st.load*0.45).toFixed(2)
   +'"><title>'+b.nm+', '+st.hot+' carrying, '+Math.round(st.pass*100)
   +' percent through</title></circle>';});
 /* the domains you run, ringing the seats they own */
 if(PMLAYER==='bands'&&S.doms.length){
  var own={};S.doms.forEach(function(di){W.forEach(function(n){
   if(Math.min(18,Math.floor(n.slot/(108/19)))===di)(own[n.b]=own[n.b]||[]).push(n);});});
  var dc=ROOTCOL[DOMAINS[S.doms[0]].r]||'#DFCC7E';
  Object.keys(own).forEach(function(bn){var k=B2K[bn];if(!k)return;
   h+='<circle cx="50" cy="'+PMYP[k]+'" r="'+(4.4+own[bn].length*0.55).toFixed(2)
    +'" fill="none" stroke="'+dc+'" stroke-width=".42" stroke-dasharray="1.4 1.2" opacity=".85"/>';});}
 /* links, before the marks so beads sit on top */
 marks.forEach(function(m){
  if(!m.links.length||m.gside===undefined)return;
  var pinned=(PMPICK===m.o), lit=(!PMPICK||pinned)?1:0;
  if(!lit)return;
  var bySeat={};
  m.links.forEach(function(n){var k=B2K[n.b];if(!k)return;(bySeat[k]=bySeat[k]||[]).push(n);});
  Object.keys(bySeat).forEach(function(k){
   var hy=PMYP[k], hxp=50+m.gside*4.2, c=PMC[K2B[k]]||'#888';
   h+='<path d="M'+m.x.toFixed(2)+','+m.y.toFixed(2)+' Q'+((m.x+hxp)/2).toFixed(2)+','
    +((m.y+hy)/2).toFixed(2)+' '+hxp.toFixed(2)+','+hy.toFixed(2)
    +'" fill="none" stroke="'+c+'" stroke-width="'+(pinned?0.5:0.34)
    +'" opacity="'+(pinned?0.8:0.4)+'"/>';
   if(pinned) bySeat[k].slice(0,8).forEach(function(n){var p=pmNode(n.i,k);
    h+='<line x1="'+hxp.toFixed(2)+'" y1="'+hy.toFixed(2)+'" x2="'+p.x.toFixed(2)+'" y2="'+p.y.toFixed(2)
     +'" stroke="'+c+'" stroke-width=".22" opacity=".5"/>';});
   h+='<circle cx="'+hxp.toFixed(2)+'" cy="'+hy.toFixed(2)+'" r="'+(pinned?1.1:0.7)
    +'" fill="'+c+'" opacity="'+(pinned?0.95:0.6)+'"/>';});});
 /* THE GUTTER IS GONE.

    It was two columns of names down the outside of the body, each tied back to
    its seat by a curve, up to twenty four of them at once. That is the "text
    all over the page with all the lines" and it was the loudest thing on the
    surface: a person looked at a body and read a list.

    The names were always in the right rail as well, under Fetters, Saboteurs,
    Complexes, Hyper and Character, with their counts and their weights and a
    drill on every row. So the body was carrying a second copy of a list that
    already had a better home four inches to the right.

    The body shows WHERE and HOW MUCH. The rail shows WHAT. One thing each.

    What replaces it is the thing the gutter was never doing: WHAT IS RUNNING
    WHAT. A pattern is not at a place, it stands on addresses that are, so it
    is drawn as the arcs from its own centre of mass out to the addresses it
    holds. Weight sets the width. Hovering the rail lights its arcs here. That
    is a structure you can read at a glance and a list is not. */
 var TIERC={sab:PAL.Throat,cx:PAL.Solar,hy:PAL.Sacral,sup:PAL.Root,mask:PAL.Crown};
 var chain=marks.filter(function(x){return x.kind==='bead';});
 if(PMLAYER==='pain'&&PAINPICK){
  var reg=PAINREG.filter(function(p){return p.k===PAINPICK;})[0];
  chain=chain.filter(function(x){return reg.bands.indexOf(x.band)>=0;});}
 if(PMLAYER==='nerves') chain=[];
 chain.sort(function(p,q){return q.v-p.v;});
 /* six at once, or one when one is picked. Beyond six the arcs stop being a
    structure and become the gutter again in another form. */
 /* EIGHT AT REST, NOT THREE.

    Three rings on a body under a button reading 34 is the page saying it has
    nothing when it has thirty four, which is what "the saboteurs are broken"
    means. The wash underneath now carries all of them, so the rings are the
    named handles on the heaviest and the count on the button is honest about
    the rest. Beyond eight the arcs stop being a structure and become the
    gutter again in another form, which is the reason there is a limit at all. */
 var show=PMPICK?chain.filter(function(x){return x.o===PMPICK;})
   :chain.slice(0,8);
 show.forEach(function(m){
  var kind=(m.o.kind==='sup')?'sup':(PMLAYER==='masks'?'mask':(m.o.kind||'sab'));
  var c=TIERC[kind]||'#DFCC7E';
  var on=(PMPICK===m.o);
  /* the pattern sits at the mean height of everything it stands on, pushed
     off the spine so its arcs are legible. The side alternates so two heavy
     patterns at the same height do not land on each other. */
  var ys=m.links.map(function(n){return PMYP[B2K[n.b]];}).filter(function(v){return v!=null;});
  if(!ys.length)return;
  var my=ys.reduce(function(p,q){return p+q;},0)/ys.length;
  var side=(show.indexOf(m)%2)?1:-1;
  var mx=50+side*(19+ (show.indexOf(m)>>1)*4.6);
  m.x=mx; m.y=my; m.gside=side;
  /* The first cut pushed the control point at a fixed offset from the chord,
     which on a near horizontal run is no offset at all: every arc came out a
     straight line and the figure read as a pin cushion. The control point now
     sits off the PERPENDICULAR of each chord, so every link bows by the same
     amount whatever direction it runs, and a bundle of them reads as a bundle. */
  m.links.slice(0,on?24:6).forEach(function(n){
   var k2=B2K[n.b]; if(!k2)return;
   var p=pmNode(n.i,k2);
   var dx=p.x-mx, dy=p.y-my, len=Math.sqrt(dx*dx+dy*dy)||1;
   var bow=Math.min(9,len*0.30);
   var cx2=(mx+p.x)/2 + (-dy/len)*bow*side*-1;
   var cy2=(my+p.y)/2 + ( dx/len)*bow*side*-1;
   var w=0.16+clamp(n.sq/10,0,1)*(on?0.58:0.34);
   h+='<path d="M'+mx.toFixed(2)+','+my.toFixed(2)
    +' Q'+cx2.toFixed(2)+','+cy2.toFixed(2)
    +' '+p.x.toFixed(2)+','+p.y.toFixed(2)+'" fill="none" stroke="'+c
    +'" stroke-width="'+w.toFixed(2)+'" opacity="'+(on?0.78:0.42)+'" '
    +'stroke-linecap="round"/>';});});
 /* THE BLANK PAIN MAP IS A QUESTION, SO IT ASKS ONE. This printed the same
    caption as the fetters layer, "nothing carrying, 6 addresses hold the
    opposite instead", on a surface that has deliberately drawn nothing yet.
    That is a reading of the body offered where an instruction belongs, and it
    reads as the instrument having found nothing rather than as waiting to be
    told. One line, imperative, and it goes the moment a region is painted. */
 if(PMLAYER==='pain'&&!PAINPICK){
  h+='<text x="50" y="97" text-anchor="middle" class="pm-gl" style="fill:'+PAL.Throat+'">'
   +'paint where it hurts</text>';
 }else if(!marks.length&&(PMLAYER==='bands'||PMLAYER==='pain')){
  /* THE EMPTY STATE ASKED THE WRONG QUESTION AND ANSWERED IT ON EVERY PROFILE.

     It tested chain.length. chain is marks filtered to kind 'bead', and
     pmMarks returns kind 'node' on this layer, always, so chain.length was
     structurally zero and this fired unconditionally. It never read charge.

     Measured before the fix: Ana carries 41 addresses, 41 marks are drawn on
     the figure, and the caption underneath them said "nothing carrying yet".
     James carries 18 with 24 drawn and read "nothing carrying". Four hundred
     pixels above it the rail said "Carrying, 41 addresses". The instrument
     contradicted itself on one screen, which is the owner's report of this
     surface being broken, and it is this line.

     The question the caption means is whether anything is drawn. marks is the
     drawn set, so it is what the caption asks. */
  var instN=W.filter(function(n){return n.pole>=4;}).length;
  h+='<text x="50" y="97" text-anchor="middle" class="pm-gl" style="fill:'+PAL.Heart+'">'
   +(instN?'nothing carrying. '+instN+' addresses hold the opposite instead.'
     :'nothing carrying yet')+'</text>';}
 /* THE OUTER DISC OF A HEAT MARK IS FIELD, AND THE CORE IS A TARGET.

    Both were drawn here as flat filled circles, one large and faint and one
    small and solid, and the large one is what the owner was looking at when he
    said the map reads as blooms on a diagram. A circle with a flat fill has a
    hard edge at any opacity, so twenty of them at eighteen percent are twenty
    visible discs rather than one field, and blurring the wash underneath them
    changed nothing because these were never in it.

    So the outer discs are collected and emitted into the blurred group with
    the rest of the field, and the cores stay exactly as they were: sharp,
    unblurred, the thing a person aims at. Collected rather than drawn in place
    because a filter is per group, and one blurred group is one filter pass
    where a filter per mark would be one per address. */
 var field='';
 marks.filter(function(m){return m.kind==='heat';}).forEach(function(m){
  var c=PMC[m.band]||'#888';
  field+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(2.2+m.v*4.4).toFixed(2)
   +'" fill="'+c+'" opacity="'+(0.10+m.v*0.34).toFixed(3)+'"/>';});
 if(field)h+='<g style="mix-blend-mode:screen" filter="url(#pmField)" '
  +'clip-path="url(#pmClip)">'+field+'</g>';
 /* PAINT TO SELECT, on the figure and not only in a row of buttons. Ruled.

    Each region is drawn as its own boxes clipped to the silhouette, so a click
    lands on the arm rather than on a rectangle beside it, and the shape a
    person paints is the shape of the body part. Largest first so the small
    ones take the click where two overlap: arms and torso share every row
    between 26 and 45 and hands and legs share 48 to 56, and without the order
    a limb is unreachable.

    The button row stays. A rect is not focusable and does not announce itself,
    so the row is the same nine regions reachable by keyboard and by a screen
    reader, and the two controls write the same one value. */
 if(PMLAYER==='pain'){
  var area=function(x){var a=0;(x.box||[]).forEach(function(q){
   a+=(q[2]-q[0])*(q[3]-q[1]);});return a;};
  var regs=PAINREG.slice().sort(function(a,b){return area(b)-area(a);});
  h+='<g class="pm-paint" clip-path="url(#pmClip)">';
  regs.forEach(function(rg){
   var on=PAINPICK===rg.k, c=PMC[rg.bands[0]]||'#888';
   (rg.box||[]).forEach(function(q){
    h+='<rect class="pm-pr'+(on?' on':'')+'" data-reg="'+rg.k+'" x="'+q[0]+'" y="'+q[1]
     +'" width="'+(q[2]-q[0]).toFixed(2)+'" height="'+(q[3]-q[1]).toFixed(2)
     +'" rx="2" fill="'+c+'" stroke="'+c+'"><title>'+esc(rg.nm)+'</title></rect>';});});
  h+='</g>';}
 /* the marks */
 h+='<g clip-path="url(#pmClip)">';
 marks.filter(function(m){return m.kind==='node'||m.kind==='heat';}).forEach(function(m){
  var c=PMC[m.band]||'#888';
  if(m.kind==='heat'){
   h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(0.7+m.v*1.1).toFixed(2)
    +'" fill="'+c+'" opacity="'+(0.55+m.v*0.45).toFixed(2)+'"/>';
  }else{
   /* AN ADDRESS THAT IS HELD CLEAR IS NOT NOTHING.

      An installed address carries no charge, so sq is zero, so it was drawn at
      radius 0.55 at thirty percent: a four pixel speck. On a profile with
      forty nine of them and none carrying, the button said forty nine and the
      body showed an empty figure. The count was right and the drawing was
      silent, which is the page reading as broken.

      Carrying and clear are opposite readings and they now look opposite. A
      carrying address is a filled warm point, weight setting its size. A clear
      one is a ring, open in the middle, which is what holding the far pole
      looks like and what the icon rule has said since the icon pass. */
   var clr=(m.o.pole>=4&&m.o.sq<LOADED);
   if(clr){
    h+='<g class="pm-n" data-node="'+m.o.i+'">'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="1.15" fill="none" stroke="'+c
     +'" stroke-width=".3" opacity=".72"/>'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r=".3" fill="'+c+'" opacity=".85"/>'
     +'<title>'+esc(m.nm)+', clear. holds the far pole</title></g>';
   }else{
    /* A CARRYING ADDRESS IS A RING TOO, and this was the last flat disc on the
       figure. At radius 2.7 and ninety eight percent it is a solid coin of
       band colour, and with eighteen of them on a loaded body they are what
       the page is: the continuous field underneath them was drawn, clipped and
       blurred correctly and could not be seen through them.

       Icons are ring, not fill, which has been the rule since the icon pass
       and was already how a clear address is drawn. So both poles are rings
       now and they still read as opposites, which was the point of the pass
       that made them differ: a carrying address is a heavy ring with a solid
       core, weight setting the radius, the stroke and the core together. A
       clear one is a thin ring around a pinpoint. Open in the middle means the
       field shows through the mark that sits on it, which is the whole reason
       the field is there. */
    var rr=(0.9+m.v*1.7), sw=(0.26+m.v*0.34);
    h+='<g class="pm-n" data-node="'+m.o.i+'">'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+rr.toFixed(2)
     +'" fill="none" stroke="'+c+'" stroke-width="'+sw.toFixed(2)
     +'" opacity="'+(0.52+m.v*0.46).toFixed(2)+'"/>'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(0.3+m.v*0.5).toFixed(2)
     +'" fill="'+c+'" opacity="'+(0.55+m.v*0.43).toFixed(2)+'"/>'
     +'<title>'+esc(m.nm)+' · '+m.o.sq.toFixed(1)+'</title></g>';}}});
 h+='</g>';
 /* THE COLUMN OF THROUGHPUT, AND ONE LABEL ON THE WHOLE FIGURE.

    Every seat used to print "83% through" on its right and "3 held" on its
    left, fourteen numbers down a body, plus a dashed line and a caption
    wherever flow stopped. Reading a body should not be reading fourteen
    numbers.

    The width of the column IS the throughput, which is what a column is for,
    and the one place it matters is where it closes. Only the stopping seat is
    named, and it is named once. Every other number is a hover away and lives
    in the shelf under the figure, which is where a number belongs. */
 /* ONE RIVER, NOT SEVEN TILES. Seven separate rounded rectangles down the
    spine read as seven buttons stacked on a body. Throughput is continuous:
    it is one channel that narrows where a seat closes and opens where one is
    clear. So it is drawn as one shape, its half width at each seat set by
    that seat's own pass, and it runs behind the heat rather than over it.

    Where it pinches is the answer to the only question this layer is asked,
    and that is the one place a word is spent. */
 /* THE PATTERN ITSELF, at the end of its own arcs. One mark, sized by weight,
    named on hover and on the rail rather than printed on the body. */
 /* THE PATTERN MARK IS A RING, NOT A DISC.

    It was a filled circle up to four units across and there were six of them,
    which on a hundred unit figure is six solid coins laid on a body, all the
    same colour, none of them saying what it was. A person looked at that and
    could not name one thing on the screen.

    The house rule for a mark has been settled since the icon pass: ring, not
    fill. So a pattern is a ring at a fixed, small size with its tier glyph
    inside it, and weight is spent on the ring's WIDTH rather than its
    diameter, which keeps six of them the same size and still ranks them. The
    name prints for the one you are holding, and only for that one, off to the
    outside where it is not on the body. */
 var PMIC={
  sab:'M12 4 L19 18 H5 Z',
  cx: 'M12 4 A8 8 0 1 0 12 20 A8 8 0 1 0 12 4 M12 8 A4 4 0 1 1 12 16 A4 4 0 1 1 12 8',
  hy: 'M12 3 L20 8 V16 L12 21 L4 16 V8 Z',
  sup:'M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z',
  mask:'M4 8 H20 V13 A8 8 0 0 1 4 13 Z'};
 show.forEach(function(m){
  if(m.x==null)return;
  var kind=(m.o.kind==='sup')?'sup':(PMLAYER==='masks'?'mask':(m.o.kind||'sab'));
  var c=TIERC[kind]||'#DFCC7E', on=(PMPICK===m.o);
  /* the glyph says what tier of thing this is. The ring says where it sits.
     Three saboteurs are three of the same glyph, which is correct and says
     nothing, so the ring takes the colour of the seat the pattern centres on
     and the three stop being interchangeable. */
  var sc=PMC[m.band]||c;
  var rr=on?3.1:2.5, sw=0.26+(m.v||0)*0.8;
  h+='<g class="pm-it" data-it="'+m.rank+'" opacity="'+(on?1:0.82)+'">'
   +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+rr.toFixed(2)
   +'" fill="var(--bg)" fill-opacity=".66" stroke="'+sc+'" stroke-width="'+sw.toFixed(2)+'"/>'
   +'<g transform="translate('+(m.x-rr*0.46).toFixed(2)+','+(m.y-rr*0.46).toFixed(2)
   +') scale('+(rr*0.92/24).toFixed(4)+')">'
   +'<path d="'+(PMIC[kind]||PMIC.sab)+'" fill="none" stroke="'+c
   +'" stroke-width="2.2" stroke-linejoin="round" opacity=".92"/></g>'
   +'<title>'+esc(m.nm)+'. '+m.links.length+' addresses, weight '
   +(m.v*10).toFixed(1)+'</title></g>';
  if(on){
   var lsd=(m.gside<0)?-1:1;
   h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(rr+2.4).toFixed(2)
    +'" fill="none" stroke="'+sc+'" stroke-width=".24" opacity=".5"/>'
    +'<text x="'+(m.x+lsd*(rr+3.4)).toFixed(2)+'" y="'+(m.y+0.9).toFixed(2)
    +'" text-anchor="'+(lsd<0?'end':'start')+'" class="pm-lbl" style="fill:'+c+'">'
    +esc(m.nm)+'</text>';}});
 h+='</svg></div>';
 host.innerHTML=h;
 renderShelf(r,seats,speed,stop,dom,loadedTot,marks);
 /* the gutter rows are gone, and so is the handler that answered for them */
 /* both controls write the same value. The row answers for the keyboard, the
    figure answers for the pointer, and painting the region already selected
    clears it, so a person can put the map back to blank without hunting for an
    All button they were not looking at. */
 document.querySelectorAll('#rbar [data-reg]').forEach(function(el){el.onclick=function(){
  PAINPICK=el.dataset.reg||null;render();};});
 host.querySelectorAll('.pm-pr[data-reg]').forEach(function(el){el.onclick=function(e){
  e.stopPropagation();
  var k=el.getAttribute('data-reg');
  PAINPICK=(PAINPICK===k)?null:k; render();};});
 document.querySelectorAll('#lbar [data-pml]').forEach(function(el){el.onclick=function(){
  PMLAYER=el.dataset.pml;PMPICK=null;render();};});
 host.querySelectorAll('[data-seat]').forEach(function(el){el.onclick=function(){
  PMPICK=(PMPICK===el.dataset.seat)?null:el.dataset.seat;render();};});
 host.querySelectorAll('[data-it]').forEach(function(el){el.onclick=function(){
  var hit=marks.filter(function(m){return m.kind==='bead'&&m.rank===+el.dataset.it;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o;
  S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; render();};});
 host.querySelectorAll('[data-node]').forEach(function(el){el.onclick=function(){
  var n=BY[+el.dataset.node];if(n)PMPICK=B2K[n.b];render();};});
}
