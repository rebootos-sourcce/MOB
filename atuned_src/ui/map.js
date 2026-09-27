
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
/* THE PAGE OPENS ON THE MAP. Ruled 27 September, round HG, on the prototype
   he had pressed through (HE): "I really dig the body map system, I think
   it's much more fine than what we had, let's wire it in and we'll get
   feedback directly there." Feedback there means it is the first thing the
   page shows, not a button he has to know to press. The seven layers below
   it are kept as they were, one press away, because nothing ruled them out. */
var PMLAYER='map', PMPICK=null, PAINPICK=null, _pmpos={}, LOADED=4;
var PMYP={};PMBANDS.forEach(function(b){PMYP[b.k]=b.yp;});
/* THE REAL PLACES, in figure units, once. ANAT (figure.js) holds each place
   in the units it was sourced in, and this is the only code that turns them
   into the figure: millimetres through the head ruler, vertebral levels
   through the spine ruler.

   A PLACE MAY HOLD ANY NUMBER OF ADDRESSES. Ruled: a plexus branches three
   ways, so three names can sit at one address. Drawn on one point they would
   be one mark with the rest under it, clickable only on top and silent about
   the others, which is hiding by stacking. So the ones sharing a point stand
   round it at an even spacing, which is how a seat's addresses already
   share a seat, only close, so they still read as one place: a pair side by
   side, three as a triangle, four as a square, and on from there. */
var PMSPREAD=1.2, PMGAP=1.45, PMROAM=2.2, _pmanat=null;
function pmAnat(){
 if(_pmanat)return _pmanat;
 var H=ANATHEAD, mm=(H.topZ-H.earZ)/(H.year-H.ytop), out={};
 var spine=function(lv){
  var R=ANATSPINE, i=0;
  while(i<R.length-2&&lv>R[i+1][0])i++;
  var a=R[i],b=R[i+1];
  return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);};
 ANAT.forEach(function(row){
  /* the person's right is on the viewer's left, as it is on every front view */
  var pts=row.h?row.h.map(function(p){return {x:50-p[0]/mm,y:H.ytop+(H.topZ-p[1])/mm};})
   :row.v?row.v.map(function(p){return {x:50+p[1],y:spine(p[0])};})
   /* a chart place is already in figure units; its source is its c */
   :row.f?row.f.map(function(p){return {x:p[0],y:p[1]};})
   :[{x:50,y:PMYP[row.at]}];
  var at=pts.map(function(){return [];});
  row.ids.forEach(function(id,j){at[j%pts.length].push(id);});
  at.forEach(function(ids,pi){
   /* a torso pair shares the seat's own point, inside the seat's ring. Side
      by side in a ring it drew a face on Heart and on Solar, so a torso pair
      stands on the diagonal. The head keeps its level pairs: nothing rings
      them there. */
   var c=pts[pi], n=ids.length, a0=(n%2)?-Math.PI/2:((row.v||row.f)?-Math.PI/4:Math.PI);
   ids.forEach(function(id,j){
    var t=a0+j*2*Math.PI/n, r=(n>1)?PMSPREAD:0;
    out[id]={x:c.x+Math.cos(t)*r, y:c.y+Math.sin(t)*r, hx:c.x, hy:c.y};});});});
 /* THE BRAIN IS A KNOT AT THIS SCALE, AND A KNOT HIDES AS WELL AS A CLIP DOES.

    The first cut placed every head address exactly and it was worse to look
    at than the clip it replaced. The pineal, the hypothalamus, the midbrain,
    the chiasm and the thalamus are real places within about 25 millimetres of
    each other, which on this figure is 1.3 units, and a heavy ring is 2.6
    units across its radius. Measured on Ana: 33 head addresses drawn, and the
    middle twenty of them one lump of rings nobody could count. Shrinking the
    rings is not the answer, because every mark is already under the 44 point
    touch floor.

    So the measured marks push apart until no two centres are closer than
    PMGAP, and none is ever let further than PMROAM from its own place. That
    is the ruling's own bar: roughly the right spot, and every one of them
    findable. Fixed order and fixed count, so the same address lands on the
    same pixel every time and on every profile. */
 var ids=Object.keys(out).sort(function(a,b){return a-b;});
 for(var it=0;it<80;it++){
  for(var i=0;i<ids.length;i++)for(var j=i+1;j<ids.length;j++){
   var p=out[ids[i]],q=out[ids[j]],dx=q.x-p.x,dy=q.y-p.y,d=Math.sqrt(dx*dx+dy*dy);
   if(d>=PMGAP)continue;
   /* two on one point have no direction between them; give them one */
   if(d<1e-6){var t0=(+ids[j])*2.399;dx=Math.cos(t0);dy=Math.sin(t0);d=1;}
   var push=(PMGAP-d)/2/d;
   p.x-=dx*push;p.y-=dy*push;q.x+=dx*push;q.y+=dy*push;}
  ids.forEach(function(id){var m=out[id],ox=m.x-m.hx,oy=m.y-m.hy,o=Math.sqrt(ox*ox+oy*oy);
   if(o>PMROAM){m.x=m.hx+ox*PMROAM/o;m.y=m.hy+oy*PMROAM/o;}});}
 return (_pmanat=out);}
/* IS THIS POINT ON THE BODY. The outline as a polygon in figure units: each C
   segment of BODYPATH carries two handles and an end point, and the end points
   alone trace the outline to well inside a mark's width. Asked by placement,
   so nothing is put where the clip will hide it. */
var _pmpoly=null;
function pmInBody(x,y){
 if(!_pmpoly){
  var v=BODYPATH.match(/-?\d+(\.\d+)?/g).map(Number), pt=[[v[0],v[1]]];
  for(var i=2;i+5<v.length;i+=6)pt.push([v[i+4],v[i+5]]);
  _pmpoly=pt.map(function(p){return [PMTX+p[0]*PMS,PMTY+p[1]*PMS];});}
 var P=_pmpoly, c=false;
 for(var a=0,b=P.length-1;a<P.length;b=a++)
  if(((P[a][1]>y)!==(P[b][1]>y))
   &&(x<(P[b][0]-P[a][0])*(y-P[a][1])/(P[b][1]-P[a][1])+P[a][0]))c=!c;
 return c;}
/* AN UNMEASURED ADDRESS STANDS AT ITS SEAT, NOT AT A RANDOM SPOT NEAR IT.

   It was a hash of the address number thrown onto an oval up to twelve units
   either side of the spine, which on this figure is out past the nipples and
   onto the shoulder, and five units up or down, which is into the next seat.
   Heart rings sat on the collarbone, Root rings on the thigh, Sacral and Solar
   rings in one mixed band across the hips. Each mark was drawn with the
   confidence of a measured place and none of them was one, so the figure said
   precisely where every address sat and was wrong about all 69. The owner's
   grade, 26 September: "the chakras need to be precise to the body and right
   now they're not. I don't even know what's going on."

   The honest claim for an address nobody has measured is the one thing that
   is known: which seat holds it. So they gather round that seat, just outside
   its ring, on a sunflower spiral in address order, which packs any count
   evenly with no gaps and puts the same address on the same spot on every
   profile. A spot is taken only if a mark there is wholly on the body and
   clear of every mark already placed and of every other seat's ring, which is
   what ended the hiding CG Q4 left open (16 on Gordon, 6 on Ana and James):
   the clip is never asked to hide anything, because nothing is placed where
   it would have to. A measured address is placed first and keeps its place,
   so an ANAT row still wins the moment one is sourced. */
var PMSEATR=2.4, PMGATHER={r0:3.15, step:0.92, sx:1.35, sy:0.72, gap:1.6, edge:1.0};
var _pmgat=null;
function pmGather(){
 if(_pmgat)return _pmgat;
 var A=pmAnat(), G=PMGATHER, by={}, out={};
 var taken=Object.keys(A).map(function(id){return A[id];});
 var free=function(x,y,k){
  if(!pmInBody(x,y)||!pmInBody(x-G.edge,y)||!pmInBody(x+G.edge,y)
   ||!pmInBody(x,y-G.edge)||!pmInBody(x,y+G.edge))return false;
  for(var s=0;s<PMBANDS.length;s++){var b=PMBANDS[s];
   if(b.k!==k&&Math.abs(y-b.yp)<PMSEATR+1.1&&Math.abs(x-50)<PMSEATR+1.1)return false;}
  for(var i=0;i<taken.length;i++){var q=taken[i];
   if((q.x-x)*(q.x-x)+(q.y-y)*(q.y-y)<G.gap*G.gap)return false;}
  return true;};
 W.forEach(function(n){if(A[n.i])return; var k=B2K[n.b];
  if(k&&PMYP[k]!=null)(by[k]=by[k]||[]).push(n.i);});
 PMBANDS.forEach(function(b){
  var ids=(by[b.k]||[]).sort(function(p,q){return p-q;}), j=0;
  ids.forEach(function(id){
   for(;j<600;j++){
    var r=Math.sqrt(G.r0*G.r0+G.step*G.step*j), t=j*2.39996;
    var x=50+Math.cos(t)*r*G.sx, y=b.yp+Math.sin(t)*r*G.sy;
    if(free(x,y,b.k)){out[id]={x:x,y:y};taken.push(out[id]);j++;return;}}
   /* never reached on this figure; the seat itself beats an invented spot */
   out[id]={x:50,y:b.yp};});});
 return (_pmgat=out);}
function pmNode(id,k){
 if(_pmpos[id])return _pmpos[id];
 var an=pmAnat()[id]||pmGather()[id];
 if(an)return (_pmpos[id]={x:an.x,y:an.y});
 return (_pmpos[id]={x:50,y:(PMYP[k]!=null?PMYP[k]:30)});}
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
     /* never o.sub. On a hyper-complex that is the clinical correspondence,
        "bipolar · ADHD", and ui.js keeps it off a person's screen by name:
        mapshelf.js recorded this row as the one place still printing it. */
     sub:o.over?'overshot':(o.kind==='sup'?'character layer':'hyper-complex')};});
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
 /* the map always holds its regions, whatever is painted or carried. Not
    printed on its button, the same as Flow: it is a count of places to press,
    and a figure under the word Map would read as something found. */
 if(L==='map')   return BMREG.front.length+BMREG.back.length;
 if(L==='sab')   return r.sabs.length;
 if(L==='cx')    return r.cxs.length;
 if(L==='hyper') return r.hys.length+r.sups.length;
 if(L==='masks') return r.maskRing.length;
 return 0;}
var PMFIRST=1;
/* THE HEAD OPENS WHEN ITS SEAT IS PICKED.

   Thirty three addresses have a measured place inside a head ten units wide.
   At 1600 that is a readable spread of points; at 390 the head is about
   thirty seven pixels across and the points run together, which is the
   "dense mesh" CG shipped and flagged. Shrinking the head's points further
   takes them below anything a person can see, and spreading them out moves
   them off the places they were measured at. So the head is drilled into:
   picking Crown or Third Eye on Fetters, by its ring, its name in the rail or
   any point in the head, fits the viewBox to the head, and every point in it
   comes up to four times the size at the same measured place.

   Only the head. The torso seats hold twelve to sixteen points each round one
   ring and read at both widths, so zooming them would take away the column a
   person reads them against and give nothing back. */
var PMHEADBOX='38 -1 24 24';
function pmHead(){return PMLAYER==='bands'&&(PMPICK==='crown'||PMPICK==='eye');}
/* THE FIGURE WEARS THE PALETTE OF THE GROUND IT IS DRAWN ON, read off that
   ground and never off the lighting's name.

   Every colour on this figure came from PMC, PMBANDS and ROOTCOL, which are
   the Dark values written once in the engine, so on Glass white the seven
   seats and the domain ring were drawn for #101010 onto #F2F1EC paper.
   Measured on Gordon, domains 2, 6, 10 and 17, 26 September: the seat rings
   at full stroke 1.60 to 1 at worst against a 3 to 1 floor, and the domain
   ring at its own .85 opacity 2.22. Snow read 4.68 and 4.95 and was right,
   because Snow keeps this host on the ruled #101010, which is why the name
   is the wrong question: LIGHT() says light under Snow and the marks sit on
   black. frMount in rings.js answers the same question the same way.

   The ground is the first opaque box from the host up, which is the host on
   every lighting today; the walk is there so a see through host cannot hand
   back a transparent black and read as dark. PMC is returned itself on a
   dark ground, so Dark, Snow and every dark lighting draw the table they
   always drew. Lumen keeps it outright: it is the owner's own palette and
   whether it moves is his open question, the hold rootPlain keeps. */
function pmPal(host){
 if(S.theme==='lumen')return PMC;
 for(var n=host;n&&n.nodeType===1;n=n.parentElement){
  var m=/rgba?\(([^)]+)\)/.exec(getComputedStyle(n).backgroundColor||'');
  if(!m)continue;
  var c=m[1].split(',').map(parseFloat);
  if(c.length>3&&!(c[3]>=0.999))continue;
  return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.5?PAL_LIGHT:PMC;}
 return PMC;}
function renderMap(r){
 if(PMFIRST){ PMFIRST=0;
  if(!pmCount(r,PMLAYER)){ for(var pf=0;pf<PML.length;pf++){
   if(pmCount(r,PML[pf][0])){PMLAYER=PML[pf][0];break;} } } }
 if(PMLAYER==='map'){bmRender(r);return;}
 var host=document.getElementById('emap');if(!host)return;
 /* every colour below is looked up in PC, so the figure moves as one; the
    first pass on the canvas recoloured one mark and drew dark names inside a
    dark outline, which is what one mark in a different palette looks like */
 var PC=pmPal(host);
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
 var domc=PC[K2B[dom.p.k]]||'var(--gold)';
 /* THE CONTROLS ARE NOT IN THE PICTURE. They render into the sub bar, which
    is where Field already puts its depth ladder, so this surface stops
    covering its own figure with the buttons that change it. */
 (function(){
  if(!pmLayerBar(r))return;
  var rb=document.getElementById('rbar'); if(!rb)return;
  /* the way back out of the head is a real button where the layer controls
     are, because on a phone Selection and its close sit below the figure,
     out of sight of a head that has just filled the well. */
  if(pmHead()){
   rb.style.display='flex';
   rb.innerHTML='<button class="pm-lb" data-whole="1">Whole body</button>';
  }else if(PMLAYER==='pain'){
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
  +'<svg viewBox="'+(pmHead()?PMHEADBOX:'0 0 100 100')+'" preserveAspectRatio="xMidYMid meet" class="pm-svg">';
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
   var c=PC[K2B[br.s]]||'#888';
   h+='<path d="M'+br.p.map(function(q){return q[0]+','+q[1];}).join(' L')
    +'" fill="none" stroke="'+c+'" stroke-width=".28" opacity=".22" stroke-linecap="round"/>';});}
 /* the branches, when the flow layer is up */
 if(PMLAYER==='nerves'){
  var passOf={};seats.forEach(function(s){passOf[s.p.k]=s.pass;});
  var cum={},run=1;
  ['root','sacral','solar','heart','throat','eye','crown'].forEach(function(k){run*=passOf[k];cum[k]=run;});
  NERVEBR.forEach(function(br){
   var th=cum[br.s]!=null?cum[br.s]:0.5, c=PC[K2B[br.s]]||'#888';
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
      +(PC[m.band]||'#888')+'" stop-opacity="'+(0.05+m.v*0.15).toFixed(3)+'"/>';}).join('')
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
   if(sm){var c2=PC[sm.band], lx=50+half(sm)+3.5;
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
   +'<stop offset="0%" stop-color="'+PC[b.b]+'" stop-opacity="'+(0.07+g*0.62).toFixed(3)+'"/>'
   +'<stop offset="30%" stop-color="'+PC[b.b]+'" stop-opacity="'+(0.05+g*0.40).toFixed(3)+'"/>'
   +'<stop offset="64%" stop-color="'+PC[b.b]+'" stop-opacity="'+(0.02+g*0.15).toFixed(3)+'"/>'
   +'<stop offset="100%" stop-color="'+PC[b.b]+'" stop-opacity="0"/></radialGradient>';});
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
  var q=pmNode(n.i,k), c=PC[n.b]||'#888', g=clamp((n.sq-LOADED)/(10-LOADED),0,1);
  h+='<circle cx="'+q.x.toFixed(2)+'" cy="'+q.y.toFixed(2)+'" r="'+(3.0+g*4.2).toFixed(2)
   +'" fill="'+c+'" opacity="'+(0.03+g*0.085).toFixed(3)+'"/>';});
 h+='</g>';
 /* THE SEVEN SEATS ARE WHAT A PERSON LOOKS FOR, SO THEY ARE WHAT THE EYE FINDS.

    Each seat was a filled core under a centimetre wide, at thirty to seventy
    five percent, and on a loaded body ninety seven address rings up to five
    units across were drawn over it at full strength. On Gordon the seven
    chakras, which are the whole premise of the page, could not be picked out
    at all: the eye found a rainbow of confetti and nothing it could name. That
    is "I don't even know what's going on", and it is a hierarchy failure
    before it is a placement one.

    So a seat is the loudest mark on the figure: a ring on the midline at its
    own height, the same size on every seat so seven of them read as one
    column, its stroke carrying the load, and a small core to aim at. The
    addresses below it drop to points. Ring, not fill, per the icon rule, and
    open so the field shows through it.

    The tap target is its own circle, drawn under the address points so every
    point keeps its own hover, and wider than the ring so a finger lands on
    the seat rather than beside it. */
 /* ZS is the mark scale inside the opened head. The viewBox shrinks about four
    times and every mark drawn in its units grows with it, so the first cut
    opened on a Crown ring a third of the skull across. Marks come up a little
    under twice their size instead, and the places stay exactly where they are. */
 var seatHit='', AN=pmAnat(), ZS=pmHead()?0.45:1, SR=PMSEATR*ZS;
 PMBANDS.forEach(function(b){
  var st=seats.filter(function(s){return s.p.k===b.k;})[0], ld=clamp(st.load,0,1);
  var on=(PMPICK===b.k);
  /* the core is left off where a measured address stands on the seat's own
     point, the cardiac plexus at Heart and the celiac at Solar: the pair
     either side of it and the core between read as an ellipsis, and the
     measured points already mark the centre. */
  var held=Object.keys(AN).some(function(id){
   return Math.abs(AN[id].hx-50)<0.01&&Math.abs(AN[id].hy-b.yp)<0.01;});
  h+='<circle cx="50" cy="'+b.yp+'" r="'+SR.toFixed(2)+'" fill="none" stroke="'+PC[b.b]
   +'" stroke-width="'+((0.24+ld*0.5+(on?0.18:0))*ZS).toFixed(3)+'" opacity="'
   +(on?1:(0.62+ld*0.38)).toFixed(2)+'"/>'
   +(held?'':'<circle cx="50" cy="'+b.yp+'" r="'+(0.42*ZS).toFixed(3)+'" fill="'+PC[b.b]+'" opacity=".92"/>');
  seatHit+='<circle class="pm-seat" data-seat="'+b.k+'" cx="50" cy="'+b.yp+'" r="'
   +(SR+0.5*ZS).toFixed(2)+'" fill="transparent"><title>'+b.nm+', '+st.hot+' carrying, '
   +Math.round(st.pass*100)+' percent through</title></circle>';});
 /* the domains you run, ringing the seats they own. The ring used to grow by
    half a unit per address the domain held there, which on Gordon made one
    dashed circle thirteen units across that ran through Sacral and Root at
    once and read as an eighth thing on the body. It hugs the seat it names. */
 if(PMLAYER==='bands'&&S.doms.length){
  var own={};S.doms.forEach(function(di){W.forEach(function(n){
   if(Math.min(18,Math.floor(n.slot/(108/19)))===di)(own[n.b]=own[n.b]||[]).push(n);});});
  /* a root is its seat, on this ground. ROOTCOL is the four seats' Dark
     values written out, so on a dark ground PMC at the root's seat is
     ROOTCOL to the digit, and on paper it is the seat's PAL_LIGHT value */
  var dc=PC[ROOTSEAT[DOMAINS[S.doms[0]].r]]||'#DFCC7E';
  Object.keys(own).forEach(function(bn){var k=B2K[bn];if(!k)return;
   h+='<circle cx="50" cy="'+PMYP[k]+'" r="'+(SR+0.95*ZS).toFixed(2)
    +'" fill="none" stroke="'+dc+'" stroke-width="'+(0.3*ZS).toFixed(3)+'" stroke-dasharray="'
    +(0.9*ZS).toFixed(2)+' '+(0.7*ZS).toFixed(2)+'" opacity=".85"/>';});}
 /* THE SEATS ARE NAMED, BESIDE THE BODY. The gutter ruling took twenty four
    pattern names off the figure and it was right to, but it left the seven
    seats unnamed as well, and a person reading a chakra map with no chakra
    named has to know the colour code before the page tells them anything.
    Seven words in one column off the left of the figure, level with their
    seats, never on the body. Flow names them only. The pattern layers keep
    both sides clear for their own marks. Sized in CSS pixels after the page
    lays out, because a viewBox unit is 8 pixels at 1600 and under 4 at 390.

    Fetters adds the count HELD at each seat, which is the solid points drawn
    there and the "held" Selection prints when the seat is tapped. The first
    cut printed every address carrying anything, the button's own number, and
    on Ana that put 21 beside a Crown with three points on it: a number beside
    a seat that disagrees with the seat is the confusion this pass is for. */
 if(PMLAYER==='bands'||PMLAYER==='nerves'){
  /* opened on the head, the column moves in beside the skull and names only
     the two seats the head holds; the rest are out of the window */
  var inHead=pmHead(), snx=inHead?43.6:25.5;
  PMBANDS.forEach(function(b){
   if(inHead&&b.k!=='crown'&&b.k!=='eye')return;
   var st=seats.filter(function(s){return s.p.k===b.k;})[0];
   h+='<text class="pm-seatn" x="'+snx+'" y="'+b.yp+'" dy=".35em" text-anchor="end" style="fill:'+PC[b.b]+'">'
    +esc(b.nm)+(PMLAYER==='bands'?'<tspan class="pm-seatc" dx=".45em">'+st.hot+'</tspan>':'')
    +'</text>';});}
 /* links, before the marks so beads sit on top */
 marks.forEach(function(m){
  if(!m.links.length||m.gside===undefined)return;
  var pinned=(PMPICK===m.o), lit=(!PMPICK||pinned)?1:0;
  if(!lit)return;
  var bySeat={};
  m.links.forEach(function(n){var k=B2K[n.b];if(!k)return;(bySeat[k]=bySeat[k]||[]).push(n);});
  Object.keys(bySeat).forEach(function(k){
   var hy=PMYP[k], hxp=50+m.gside*4.2, c=PC[K2B[k]]||'#888';
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
 var TIERC={sab:PC.Throat,cx:PC.Solar,hy:PC.Sacral,sup:PC.Root,mask:PC.Crown};
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
  h+='<text x="50" y="97" text-anchor="middle" class="pm-gl" style="fill:'+PC.Throat+'">'
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
  h+='<text x="50" y="97" text-anchor="middle" class="pm-gl" style="fill:'+PC.Heart+'">'
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
  var c=PC[m.band]||'#888';
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
   var on=PAINPICK===rg.k, c=PC[rg.bands[0]]||'#888';
   (rg.box||[]).forEach(function(q){
    h+='<rect class="pm-pr'+(on?' on':'')+'" data-reg="'+rg.k+'" x="'+q[0]+'" y="'+q[1]
     +'" width="'+(q[2]-q[0]).toFixed(2)+'" height="'+(q[3]-q[1]).toFixed(2)
     +'" rx="2" fill="'+c+'" stroke="'+c+'"><title>'+esc(rg.nm)+'</title></rect>';});});
  h+='</g>';}
 h+=seatHit;
 /* the marks. On Fetters, a picked seat keeps its own points at strength and
    lets the other six fall back, so the answer in Selection and the points on
    the figure are visibly the same set. */
 var pickSeat=(PMLAYER==='bands'&&typeof PMPICK==='string')?PMPICK:null;
 h+='<g clip-path="url(#pmClip)">';
 marks.filter(function(m){return m.kind==='node'||m.kind==='heat';}).forEach(function(m){
  var c=PC[m.band]||'#888';
  var fade=(pickSeat&&B2K[m.band]!==pickSeat)?0.28:1;
  if(m.kind==='heat'){
   /* the same point scale as Fetters. At 0.7 to 1.8 these were sized for the
      old scatter, and gathered round their seat at 1.6 apart they ran into
      one blob on a painted torso. */
   h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(0.34+m.v*0.46).toFixed(2)
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
   /* AN ADDRESS IS A POINT NOW, AND THE SEAT IS THE RING.

      Both kinds below were rings with a core, a carrying one up to 2.6 units
      across, which was right when an address was the largest thing a seat
      had. Thirty three of them measured into a head ten units wide made one
      knot of rings (CG, the picture he graded), and ninety seven across a
      torso made the confetti. A ring is the seat's mark now, so an address
      reads as what it is, one point inside a seat: carrying is a solid point
      that grows and brightens with weight, clear is a hollow one, still
      opposite at a glance. The largest point is under a unit and a half
      across. Gathered points are never nearer than 1.6, so none of them can
      touch. Measured ones are pushed toward 1.45 but the roam limit wins,
      and it holds two nearer: 81 at the brainstem and 84 at the inion sit
      0.86 apart and can touch when both are heavy. Opening the head halves
      the points and separates them. */
   if(clr){
    h+='<g class="pm-n" data-node="'+m.o.i+'" opacity="'+fade+'">'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(0.5*ZS).toFixed(3)
     +'" fill="none" stroke="'+c+'" stroke-width="'+(0.2*ZS).toFixed(3)+'" opacity=".8"/>'
     +'<title>'+esc(m.nm)+' is clear and holds the far pole.</title></g>';
   }else{
    /* A POINT, NOT A COIN. The pass before the rings found solid discs of
       radius 2.7 at ninety eight percent covering the field they sat on, and
       that is why the rule became ring, not fill. The ring is the seat's mark
       now. A point at most three quarters of a unit across covers nothing, so
       the field reads through it, and the one icon on each seat stays a ring. */
    h+='<g class="pm-n" data-node="'+m.o.i+'" opacity="'+fade+'">'
     +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+((0.28+m.v*0.46)*ZS).toFixed(3)
     +'" fill="'+c+'" opacity="'+(0.6+m.v*0.4).toFixed(2)+'"/>'
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
  var sc=PC[m.band]||c;
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
 /* the seat names in CSS pixels. The svg is 100 units fitted into the well, so
    a unit is whatever the well makes it; 13 pixels at every width is read off
    the laid out box, and a hidden well (no box yet) keeps the class's own size. */
 (function(){
  var sv=host.querySelector('svg.pm-svg'); if(!sv)return;
  var bx=sv.getBoundingClientRect(), u=Math.min(bx.width,bx.height)/sv.viewBox.baseVal.width;
  if(u>0)host.querySelectorAll('.pm-seatn').forEach(function(t){
   t.style.fontSize=(13/u).toFixed(3)+'px';});})();
 renderShelf(r,seats,speed,stop,dom,loadedTot,marks);
 /* the gutter rows are gone, and so is the handler that answered for them */
 /* both controls write the same value. The row answers for the keyboard, the
    figure answers for the pointer, and painting the region already selected
    clears it, so a person can put the map back to blank without hunting for an
    All button they were not looking at. */
 /* EVERY PRESS ON THE FIGURE ANSWERS IN SELECTION, through pmAnswer in
    mapshelf.js. These only set the pick and rendered, and the answer was
    printed at the foot of the shelf: a ring pressed on Gordon's figure put
    its reading 4,626 pixels down the rail and a seat core 3,328, with
    Selection, in view, saying nothing was selected. The layer switch is
    left as it was: it clears the pick and leaves an open answer open, which
    is what the Field's depth ladder does. */
 document.querySelectorAll('#rbar [data-reg]').forEach(function(el){el.onclick=function(){
  PAINPICK=el.dataset.reg||null; pmAnswer(PAINPICK,true);};});
 host.querySelectorAll('.pm-pr[data-reg]').forEach(function(el){el.onclick=function(e){
  e.stopPropagation();
  var k=el.getAttribute('data-reg');
  PAINPICK=(PAINPICK===k)?null:k; pmAnswer(PAINPICK,true);};});
 document.querySelectorAll('#rbar [data-whole]').forEach(function(el){el.onclick=function(){
  pmAnswer(null);};});
 host.querySelectorAll('[data-seat]').forEach(function(el){el.onclick=function(){
  PMPICK=(PMPICK===el.dataset.seat)?null:el.dataset.seat; pmAnswer(PMPICK);};});
 host.querySelectorAll('[data-it]').forEach(function(el){el.onclick=function(){
  var hit=marks.filter(function(m){return m.kind==='bead'&&m.rank===+el.dataset.it;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o;
  S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; pmAnswer(PMPICK);};});
 host.querySelectorAll('[data-node]').forEach(function(el){el.onclick=function(){
  var n=BY[+el.dataset.node];if(n)PMPICK=B2K[n.b]; pmAnswer(PMPICK);};});
}
/* ONE LAYER BAR FOR EVERY LAYER. The seven layers wrote it inside
   renderMap and the map writes it from bmRender, and two writers for one row
   is how a row ends up showing two different selections. So both call this.

   The map is first in the row and is not in PML. PML is practice.js's table
   and this change does not reach the engine's data, so the row is built from
   the map and then PML. The map carries no figure on its button, the same as
   Flow: see pmCount. */
function pmLayerBar(r){
 var lb=document.getElementById('lbar'); if(!lb)return false;
 lb.innerHTML=[['map','Map']].concat(PML).map(function(L){
  var cn=pmCount(r,L[0]), bare=(L[0]==='nerves'||L[0]==='map');
  return '<button class="pm-lb'+(PMLAYER===L[0]?' on':'')+(cn?'':' empty')
   +'" data-pml="'+L[0]+'">'+L[1]
   +(bare?'':'<b>'+cn+'</b>')+'</button>';}).join('');
 lb.querySelectorAll('[data-pml]').forEach(function(el){el.onclick=function(){
  PMLAYER=el.dataset.pml;PMPICK=null;render();};});
 return true;}

/* ============================================================
   THE BODY MAP. The approved prototype (proto/body-map-build, round HE),
   ported onto the real reading. Round HG, his words: "I really dig the body
   map system, I think it's much more fine than what we had, let's wire it
   in and we'll get feedback directly there."

   What changed on the way in, and nothing else did:
     charge     each address reads its own sq off the engine, where the
                prototype moved a roster person's fetter charge a little per
                address. So the figure is this profile's reading.
     lines      a saboteur line is a saboteur the engine found at a weight of
                five or more (compute().sabs), through the addresses it was
                built from, where the prototype ran SAB_LIB on mock charge.
     pain       opens blank and is painted, per profile, and is not saved.
                See BM.paint.
     colour     the seats take PMC, the product's own seat palette, which is
                also the palette the approved figure's own seat rings carry.
                The heat ramp is the prototype's, measured, and untouched.
     presses    answer in Selection, the way every surface answers. The
                prototype's side card is the region drill below.
     the back   a line now draws on the back view too. The prototype drew
                every back view line on the front, mirrored; see bmCable.

   Left exactly as the prototype draws them, because both are his call and
   neither is answered:
     the limb centres   no address stands on an arm and two of the 112 on a
                        leg, so the proposed centres are a dashed, faint ring
                        that no press, count or line ever treats as an
                        address. BODY-MAP-SPEC.md question D.
     the fetter mark    "A for the structures... with the icon of the fetter"
                        matched none of the three drawn answers cleanly, so
                        all three stay one press apart in the Mark control,
                        and none is chosen for him. Question A.

   The canvas draws, the svg over it answers. The canvas is the prototype's
   renderer, because its motion (the hum, the pulses, the fringes, the spring
   on a kicked mark, the isotherm stepping in) was measured as built and a
   rewrite into DOM nodes would be a different thing to judge. The svg holds
   the outline in vector and the seven seats as real elements, which is what
   a person with no canvas still gets and what every press lands on.
   ============================================================ */
/* THE APPROVED FIGURE, AS DATA. The front and back nervous system man he
   locked on 27 September ("lock that in as our kind of starting point"), FW
   option A, taken apart into its elements so each class of nerve can dim on
   its own when the heat comes up. Carried from
   proto/body-map-spec/nervous-figures.json by proto/body-map-build's own
   data.js, unchanged: a style table and the elements that point into it.
     BMSTYLE   [class, stroke, width, opacity, fill, dash]. cns is the brain
               and cord, auto the autonomic system, som the somatic nerves,
               seat the seven dashed rings, flow the line up the spine.
     BMNERVE   per view, front then back: [style, name, path] for a path and
               [style, name, cx, cy, r] for a circle. The name is the
               figure's own title, and the pain lines find their nerve by it.
   The rest of the figure is the engine's own: BODYPATH is the man, ANAT is
   where 80 addresses were measured, PMBANDS is where the seats sit. */
var BMSTYLE=[["cns","#EFEDE8",0.22,0.75,"rgba(239,237,232,.04)",""],
 ["cns","#EFEDE8",0.12,0.75,"",""],
 ["cns","#EFEDE8",0.16,0.75,"",""],
 ["cns","#EFEDE8",0.5,0.75,"",""],
 ["auto","#7EB8D4",0.3,0.85,"",""],
 ["auto","#7EB8D4",0.16,0.85,"",""],
 ["auto","#7EB8D4",0.1,1,"#0d0e13",""],
 ["auto","#7EB8D4",0.13,0.85,"",""],
 ["som","#C2A063",0.16,0.85,"",""],
 ["auto","#7EB8D4",0.18,0.85,"",""],
 ["som","#C2A063",0.1,0.45,"",""],
 ["som","#C2A063",0.24,0.85,"",""],
 ["som","#C2A063",0.18,0.85,"",""],
 ["som","#C2A063",0.3,0.85,"",""],
 ["som","#C2A063",0.13,0.85,"",""],
 ["auto","#7EB8D4",0.14,1,"rgba(126,184,212,.18)",""],
 ["seat","#A77EDB",0.22,0.9,"",".5 .35"],
 ["seat","#7D93E0",0.22,0.9,"",".5 .35"],
 ["seat","#5EBBDB",0.22,0.9,"",".5 .35"],
 ["seat","#5FD5A6",0.22,0.9,"",".5 .35"],
 ["seat","#DABF6A",0.22,0.9,"",".5 .35"],
 ["seat","#D8924E",0.22,0.9,"",".5 .35"],
 ["seat","#D6524C",0.22,0.9,"",".5 .35"],
 ["flow","#D8924E",0.55,0.11,"",""],
 ["flow","#DABF6A",0.55,0.04,"",""],
 ["flow","#5FD5A6",0.55,0.04,"",""],
 ["flow","#5EBBDB",0.55,0.04,"",""],
 ["flow","#7D93E0",0.55,0.04,"",""],
 ["flow","#A77EDB",0.55,0.04,"",""],
 ["cns","#EFEDE8",0.62,0.75,"",""],
 ["cns","#EFEDE8",0.14,0.75,"",""],
 ["som","#C2A063",0.12,0.85,"",""],
 ["cns","#EFEDE8",0.2,0.75,"rgba(239,237,232,.04)",""],
 ["som","#C2A063",0.2,0.85,"",""],
 ["som","#C2A063",0.32,0.85,"",""],
 ["som","#C2A063",0.5,0.85,"",""],
 ["som","#C2A063",0.26,0.85,"",""]];
var BMNERVE=[[
 [0,"Brain","M45.80,8.80 C45.90,8.30 46.00,6.58 46.40,5.80 C46.80,5.02 47.60,4.43 48.20,4.10 C48.80,3.77 49.40,3.80 50.00,3.80 C50.60,3.80 51.20,3.77 51.80,4.10 C52.40,4.43 53.20,5.02 53.60,5.80 C54.00,6.58 54.23,7.90 54.20,8.80 C54.17,9.70 54.10,10.68 53.40,11.20 C52.70,11.72 51.13,11.90 50.00,11.90 C48.87,11.90 47.17,11.32 46.60,11.20 Z"],
 [1,"Longitudinal fissure","M50.00,3.90 L50.00,11.20"],
 [2,"Optic nerves and chiasm","M47.90,10.90 C48.25,10.85 49.30,10.60 50.00,10.60 C50.70,10.60 51.75,10.85 52.10,10.90"],
 [3,"Brainstem","M50.00,11.60 L50.00,13.40"],
 [4,"Vagus nerve, cranial nerve X","M49.40,12.80 C49.28,13.25 48.88,14.47 48.70,15.50 C48.52,16.53 48.43,18.00 48.30,19.00 C48.17,20.00 47.98,20.60 47.90,21.50 C47.82,22.40 47.70,23.40 47.80,24.40 C47.90,25.40 48.28,26.40 48.50,27.50 C48.72,28.60 48.95,29.83 49.10,31.00 C49.25,32.17 49.30,33.40 49.40,34.50 C49.50,35.60 49.65,37.08 49.70,37.60"],
 [4,"Vagus nerve, cranial nerve X","M50.60,12.80 C50.72,13.25 51.12,14.47 51.30,15.50 C51.48,16.53 51.57,18.00 51.70,19.00 C51.83,20.00 52.02,20.60 52.10,21.50 C52.18,22.40 52.30,23.40 52.20,24.40 C52.10,25.40 51.72,26.40 51.50,27.50 C51.28,28.60 51.05,29.83 50.90,31.00 C50.75,32.17 50.70,33.40 50.60,34.50 C50.50,35.60 50.35,37.08 50.30,37.60"],
 [5,"Recurrent laryngeal nerve, left, under the aortic arch","M52.00,23.80 C51.87,23.95 51.40,25.00 51.20,24.70 C51.00,24.40 50.85,22.87 50.80,22.00 C50.75,21.13 50.90,20.33 50.90,19.50 C50.90,18.67 50.82,17.42 50.80,17.00"],
 [5,"Recurrent laryngeal nerve, right, under the subclavian","M47.90,21.30 C48.03,21.35 48.48,21.90 48.70,21.60 C48.92,21.30 49.12,20.27 49.20,19.50 C49.28,18.73 49.20,17.42 49.20,17.00"],
 [5,"Sympathetic chain, C1 to the ganglion impar","M48.40,14.00 C48.38,14.83 48.30,16.77 48.30,19.00 C48.30,21.23 48.37,24.40 48.40,27.40 C48.43,30.40 48.45,34.33 48.50,37.00 C48.55,39.67 48.58,41.40 48.70,43.40 C48.82,45.40 48.98,47.57 49.20,49.00 C49.42,50.43 49.87,51.50 50.00,52.00"],
 [6,"",48.4,14,0.22],
 [6,"",48.42,15,0.22],
 [6,"",48.47,17,0.22],
 [6,"",48.51,19,0.22],
 [6,"",48.54,20.2,0.22],
 [6,"",48.57,21.5,0.22],
 [6,"",48.6,22.8,0.22],
 [6,"",48.63,24.2,0.22],
 [6,"",48.67,25.8,0.22],
 [6,"",48.71,27.4,0.22],
 [6,"",48.74,29,0.22],
 [6,"",48.78,30.6,0.22],
 [6,"",48.82,32.2,0.22],
 [6,"",48.85,33.8,0.22],
 [6,"",48.89,35.4,0.22],
 [6,"",48.93,37,0.22],
 [6,"",48.96,38.6,0.22],
 [6,"",49,40.2,0.22],
 [6,"",49.04,41.8,0.22],
 [6,"",49.07,43.4,0.22],
 [6,"",49.15,46.6,0.22],
 [6,"",49.17,47.8,0.22],
 [6,"",49.2,49,0.22],
 [6,"",49.22,50,0.22],
 [5,"Sympathetic chain, C1 to the ganglion impar","M51.60,14.00 C51.62,14.83 51.70,16.77 51.70,19.00 C51.70,21.23 51.63,24.40 51.60,27.40 C51.57,30.40 51.55,34.33 51.50,37.00 C51.45,39.67 51.42,41.40 51.30,43.40 C51.18,45.40 51.02,47.57 50.80,49.00 C50.58,50.43 50.13,51.50 50.00,52.00"],
 [6,"",51.6,14,0.22],
 [6,"",51.58,15,0.22],
 [6,"",51.53,17,0.22],
 [6,"",51.49,19,0.22],
 [6,"",51.46,20.2,0.22],
 [6,"",51.43,21.5,0.22],
 [6,"",51.4,22.8,0.22],
 [6,"",51.37,24.2,0.22],
 [6,"",51.33,25.8,0.22],
 [6,"",51.29,27.4,0.22],
 [6,"",51.26,29,0.22],
 [6,"",51.22,30.6,0.22],
 [6,"",51.18,32.2,0.22],
 [6,"",51.15,33.8,0.22],
 [6,"",51.11,35.4,0.22],
 [6,"",51.07,37,0.22],
 [6,"",51.04,38.6,0.22],
 [6,"",51,40.2,0.22],
 [6,"",50.96,41.8,0.22],
 [6,"",50.93,43.4,0.22],
 [6,"",50.85,46.6,0.22],
 [6,"",50.83,47.8,0.22],
 [6,"",50.8,49,0.22],
 [6,"",50.78,50,0.22],
 [5,"Greater splanchnic nerve, T5 to T9","M48.40,27.40 C48.42,28.20 48.45,30.87 48.50,32.20 C48.55,33.53 48.58,34.50 48.70,35.40 C48.82,36.30 49.12,37.23 49.20,37.60"],
 [5,"Greater splanchnic nerve, T5 to T9","M51.60,27.40 C51.58,28.20 51.55,30.87 51.50,32.20 C51.45,33.53 51.42,34.50 51.30,35.40 C51.18,36.30 50.88,37.23 50.80,37.60"],
 [7,"Lesser splanchnic nerve, T10 to T11","M48.50,33.80 C48.45,34.33 48.35,36.20 48.20,37.00 C48.05,37.80 47.70,38.33 47.60,38.60"],
 [7,"Lesser splanchnic nerve, T10 to T11","M51.50,33.80 C51.55,34.33 51.65,36.20 51.80,37.00 C51.95,37.80 52.30,38.33 52.40,38.60"],
 [8,"Phrenic nerve, C3 to C5, to the diaphragm","M48.00,16.40 C47.80,16.92 47.15,18.40 46.80,19.50 C46.45,20.60 46.12,21.75 45.90,23.00 C45.68,24.25 45.53,25.67 45.50,27.00 C45.47,28.33 45.55,29.73 45.70,31.00 C45.85,32.27 46.28,34.00 46.40,34.60"],
 [8,"Phrenic nerve, C3 to C5, to the diaphragm","M52.00,16.40 C52.20,16.92 52.85,18.40 53.20,19.50 C53.55,20.60 53.88,21.75 54.10,23.00 C54.32,24.25 54.47,25.67 54.50,27.00 C54.53,28.33 54.45,29.73 54.30,31.00 C54.15,32.27 53.72,34.00 53.60,34.60"],
 [9,"Hypogastric nerves, to the pelvic plexuses","M50.10,45.40 C49.92,45.70 49.32,46.57 49.00,47.20 C48.68,47.83 48.33,48.87 48.20,49.20"],
 [9,"Hypogastric nerves, to the pelvic plexuses","M49.90,45.40 C50.08,45.70 50.68,46.57 51.00,47.20 C51.32,47.83 51.67,48.87 51.80,49.20"],
 [7,"Pelvic splanchnic nerves, S2 to S4","M49.20,47.80 C49.10,48.00 48.77,48.77 48.60,49.00 C48.43,49.23 48.27,49.17 48.20,49.20"],
 [7,"Pelvic splanchnic nerves, S2 to S4","M50.80,47.80 C50.90,48.00 51.23,48.77 51.40,49.00 C51.57,49.23 51.73,49.17 51.80,49.20"],
 [10,"Intercostal nerves, T1 to T11","M48.20,20.20 C47.67,20.34 46.12,20.73 45.00,21.05 C43.88,21.37 42.50,21.84 41.50,22.12 C40.50,22.40 39.42,22.64 39.00,22.75"],
 [10,"Intercostal nerves, T1 to T11","M51.80,20.20 C52.33,20.34 53.88,20.73 55.00,21.05 C56.12,21.37 57.50,21.84 58.50,22.12 C59.50,22.40 60.58,22.64 61.00,22.75"],
 [10,"Intercostal nerves, T1 to T11","M48.20,21.50 C47.67,21.65 46.12,22.06 45.00,22.40 C43.88,22.74 42.50,23.24 41.50,23.54 C40.50,23.84 39.42,24.09 39.00,24.20"],
 [10,"Intercostal nerves, T1 to T11","M51.80,21.50 C52.33,21.65 53.88,22.06 55.00,22.40 C56.12,22.74 57.50,23.24 58.50,23.54 C59.50,23.84 60.58,24.09 61.00,24.20"],
 [10,"Intercostal nerves, T1 to T11","M48.20,22.80 C47.67,22.96 46.12,23.39 45.00,23.75 C43.88,24.11 42.50,24.64 41.50,24.96 C40.50,25.28 39.42,25.54 39.00,25.65"],
 [10,"Intercostal nerves, T1 to T11","M51.80,22.80 C52.33,22.96 53.88,23.39 55.00,23.75 C56.12,24.11 57.50,24.64 58.50,24.96 C59.50,25.28 60.58,25.54 61.00,25.65"],
 [10,"Intercostal nerves, T1 to T11","M48.20,24.20 C47.67,24.37 46.12,24.82 45.00,25.20 C43.88,25.58 42.50,26.15 41.50,26.48 C40.50,26.81 39.42,27.08 39.00,27.20"],
 [10,"Intercostal nerves, T1 to T11","M51.80,24.20 C52.33,24.37 53.88,24.82 55.00,25.20 C56.12,25.58 57.50,26.15 58.50,26.48 C59.50,26.81 60.58,27.08 61.00,27.20"],
 [10,"Intercostal nerves, T1 to T11","M48.20,25.80 C47.67,25.98 46.12,26.45 45.00,26.85 C43.88,27.25 42.50,27.85 41.50,28.20 C40.50,28.55 39.42,28.82 39.00,28.95"],
 [10,"Intercostal nerves, T1 to T11","M51.80,25.80 C52.33,25.98 53.88,26.45 55.00,26.85 C56.12,27.25 57.50,27.85 58.50,28.20 C59.50,28.55 60.58,28.82 61.00,28.95"],
 [10,"Intercostal nerves, T1 to T11","M48.20,27.40 C47.67,27.58 46.12,28.08 45.00,28.50 C43.88,28.92 42.50,29.55 41.50,29.92 C40.50,30.29 39.42,30.57 39.00,30.70"],
 [10,"Intercostal nerves, T1 to T11","M51.80,27.40 C52.33,27.58 53.88,28.08 55.00,28.50 C56.12,28.92 57.50,29.55 58.50,29.92 C59.50,30.29 60.58,30.57 61.00,30.70"],
 [10,"Intercostal nerves, T1 to T11","M48.20,29.00 C47.67,29.19 46.12,29.71 45.00,30.15 C43.88,30.59 42.50,31.26 41.50,31.64 C40.50,32.02 39.42,32.31 39.00,32.45"],
 [10,"Intercostal nerves, T1 to T11","M51.80,29.00 C52.33,29.19 53.88,29.71 55.00,30.15 C56.12,30.59 57.50,31.26 58.50,31.64 C59.50,32.02 60.58,32.31 61.00,32.45"],
 [10,"Intercostal nerves, T1 to T11","M48.20,30.60 C47.67,30.80 46.12,31.34 45.00,31.80 C43.88,32.26 42.50,32.96 41.50,33.36 C40.50,33.76 39.42,34.06 39.00,34.20"],
 [10,"Intercostal nerves, T1 to T11","M51.80,30.60 C52.33,30.80 53.88,31.34 55.00,31.80 C56.12,32.26 57.50,32.96 58.50,33.36 C59.50,33.76 60.58,34.06 61.00,34.20"],
 [10,"Intercostal nerves, T1 to T11","M48.20,32.20 C47.67,32.41 46.12,32.97 45.00,33.45 C43.88,33.93 42.50,34.66 41.50,35.08 C40.50,35.50 39.42,35.80 39.00,35.95"],
 [10,"Intercostal nerves, T1 to T11","M51.80,32.20 C52.33,32.41 53.88,32.97 55.00,33.45 C56.12,33.93 57.50,34.66 58.50,35.08 C59.50,35.50 60.58,35.80 61.00,35.95"],
 [10,"Intercostal nerves, T1 to T11","M48.20,33.80 C47.67,34.02 46.12,34.60 45.00,35.10 C43.88,35.60 42.50,36.37 41.50,36.80 C40.50,37.23 39.42,37.55 39.00,37.70"],
 [10,"Intercostal nerves, T1 to T11","M51.80,33.80 C52.33,34.02 53.88,34.60 55.00,35.10 C56.12,35.60 57.50,36.37 58.50,36.80 C59.50,37.23 60.58,37.55 61.00,37.70"],
 [10,"Intercostal nerves, T1 to T11","M48.20,35.40 C47.67,35.63 46.12,36.23 45.00,36.75 C43.88,37.27 42.50,38.07 41.50,38.52 C40.50,38.97 39.42,39.29 39.00,39.45"],
 [10,"Intercostal nerves, T1 to T11","M51.80,35.40 C52.33,35.63 53.88,36.23 55.00,36.75 C56.12,37.27 57.50,38.07 58.50,38.52 C59.50,38.97 60.58,39.29 61.00,39.45"],
 [11,"Median nerve, down the front of the arm","M41.60,25.80 C41.43,26.50 40.97,28.47 40.60,30.00 C40.23,31.53 39.75,33.50 39.40,35.00 C39.05,36.50 38.88,37.67 38.50,39.00 C38.12,40.33 37.53,41.67 37.10,43.00 C36.67,44.33 36.30,45.67 35.90,47.00 C35.50,48.33 35.08,49.80 34.70,51.00 C34.32,52.20 33.88,53.13 33.60,54.20 C33.32,55.27 33.10,56.87 33.00,57.40"],
 [11,"Median nerve, down the front of the arm","M58.40,25.80 C58.57,26.50 59.03,28.47 59.40,30.00 C59.77,31.53 60.25,33.50 60.60,35.00 C60.95,36.50 61.12,37.67 61.50,39.00 C61.88,40.33 62.47,41.67 62.90,43.00 C63.33,44.33 63.70,45.67 64.10,47.00 C64.50,48.33 64.92,49.80 65.30,51.00 C65.68,52.20 66.12,53.13 66.40,54.20 C66.68,55.27 66.90,56.87 67.00,57.40"],
 [12,"Ulnar nerve","M41.90,26.20 C41.77,26.83 41.38,28.53 41.10,30.00 C40.82,31.47 40.47,33.57 40.20,35.00 C39.93,36.43 39.85,37.27 39.50,38.60 C39.15,39.93 38.52,41.60 38.10,43.00 C37.68,44.40 37.37,45.67 37.00,47.00 C36.63,48.33 36.22,49.75 35.90,51.00 C35.58,52.25 35.23,53.92 35.10,54.50"],
 [12,"Ulnar nerve","M58.10,26.20 C58.23,26.83 58.62,28.53 58.90,30.00 C59.18,31.47 59.53,33.57 59.80,35.00 C60.07,36.43 60.15,37.27 60.50,38.60 C60.85,39.93 61.48,41.60 61.90,43.00 C62.32,44.40 62.63,45.67 63.00,47.00 C63.37,48.33 63.78,49.75 64.10,51.00 C64.42,52.25 64.77,53.92 64.90,54.50"],
 [13,"Femoral nerve, L2 to L4, under the inguinal ligament","M47.60,41.80 C47.47,42.77 47.03,45.83 46.80,47.60 C46.57,49.37 46.40,51.00 46.20,52.40 C46.00,53.80 45.80,54.82 45.60,56.00 C45.40,57.18 45.10,58.92 45.00,59.50"],
 [13,"Femoral nerve, L2 to L4, under the inguinal ligament","M52.40,41.80 C52.53,42.77 52.97,45.83 53.20,47.60 C53.43,49.37 53.60,51.00 53.80,52.40 C54.00,53.80 54.20,54.82 54.40,56.00 C54.60,57.18 54.90,58.92 55.00,59.50"],
 [8,"Saphenous nerve, down the inner leg","M46.20,56.00 C46.27,57.00 46.45,60.00 46.60,62.00 C46.75,64.00 47.02,66.00 47.10,68.00 C47.18,70.00 47.18,72.00 47.10,74.00 C47.02,76.00 46.75,77.83 46.60,80.00 C46.45,82.17 46.33,84.67 46.20,87.00 C46.07,89.33 45.87,92.83 45.80,94.00"],
 [8,"Saphenous nerve, down the inner leg","M53.80,56.00 C53.73,57.00 53.55,60.00 53.40,62.00 C53.25,64.00 52.98,66.00 52.90,68.00 C52.82,70.00 52.82,72.00 52.90,74.00 C52.98,76.00 53.25,77.83 53.40,80.00 C53.55,82.17 53.67,84.67 53.80,87.00 C53.93,89.33 54.13,92.83 54.20,94.00"],
 [12,"Obturator nerve, into the inner thigh","M48.20,43.40 C48.15,44.58 48.02,48.50 47.90,50.50 C47.78,52.50 47.53,53.98 47.50,55.40 C47.47,56.82 47.63,57.73 47.70,59.00 C47.77,60.27 47.87,62.33 47.90,63.00"],
 [12,"Obturator nerve, into the inner thigh","M51.80,43.40 C51.85,44.58 51.98,48.50 52.10,50.50 C52.22,52.50 52.47,53.98 52.50,55.40 C52.53,56.82 52.37,57.73 52.30,59.00 C52.23,60.27 52.13,62.33 52.10,63.00"],
 [14,"Lateral femoral cutaneous nerve","M45.40,45.40 C45.20,46.50 44.52,50.23 44.20,52.00 C43.88,53.77 43.75,54.33 43.50,56.00 C43.25,57.67 42.83,61.00 42.70,62.00"],
 [14,"Lateral femoral cutaneous nerve","M54.60,45.40 C54.80,46.50 55.48,50.23 55.80,52.00 C56.12,53.77 56.25,54.33 56.50,56.00 C56.75,57.67 57.17,61.00 57.30,62.00"],
 [8,"Deep fibular nerve, down the front of the leg","M43.40,77.60 C43.43,78.33 43.48,80.27 43.60,82.00 C43.72,83.73 43.93,86.00 44.10,88.00 C44.27,90.00 44.52,93.00 44.60,94.00"],
 [8,"Deep fibular nerve, down the front of the leg","M56.60,77.60 C56.57,78.33 56.52,80.27 56.40,82.00 C56.28,83.73 56.07,86.00 55.90,88.00 C55.73,90.00 55.48,93.00 55.40,94.00"],
 [15,"Cardiac plexus, at the tracheal bifurcation, T4 to T5",50.3,25.099999999999998,1],
 [15,"Pulmonary plexuses, at the roots of the lungs",47.3,26.4,0.6],
 [15,"Pulmonary plexuses, at the roots of the lungs",52.7,26.4,0.6],
 [15,"Celiac plexus and ganglia, T12 to L1",50.3,37.8,1.1],
 [15,"Renal plexuses",46.6,39.2,0.5],
 [15,"Renal plexuses",53.4,39.2,0.5],
 [15,"Superior mesenteric plexus, L1",50.4,39.300000000000004,0.55],
 [15,"Inferior mesenteric plexus, L3",50.6,41.8,0.55],
 [15,"Superior hypogastric plexus, L5 to S1",50.2,45.6,0.8],
 [15,"Inferior hypogastric plexuses, the pelvic plexuses",48.2,49.4,0.7],
 [15,"Inferior hypogastric plexuses, the pelvic plexuses",51.8,49.4,0.7],
 [15,"Superior cervical ganglion, C2 to C3",48.4,14.5,0.45],
 [15,"Superior cervical ganglion, C2 to C3",51.6,14.5,0.45],
 [15,"Pharyngeal plexus, on the pharynx, C2 to C3",50,15,0.6],
 [15,"Stellate ganglion, C7 to T1",48.3,19.7,0.45],
 [15,"Stellate ganglion, C7 to T1",51.7,19.7,0.45],
 [15,"Ganglion impar, the end of both chains",50,52,0.45],
 [16,"Crown seat",50,4.98,1.7],
 [17,"Third eye seat",50,10.57,1.7],
 [18,"Throat seat",50,20.91,1.7],
 [19,"Heart seat",50,30.51,1.7],
 [20,"Solar seat",50,40.21,1.7],
 [21,"Sacral seat",50,47.02,1.7],
 [22,"Root seat",50,53.55,1.7],
 [23,"","M50.9,53.55 L50.9,47.02"],
 [24,"","M50.9,47.02 L50.9,40.21"],
 [25,"","M50.9,40.21 L50.9,30.51"],
 [26,"","M50.9,30.51 L50.9,20.91"],
 [27,"","M50.9,20.91 L50.9,10.57"],
 [28,"","M50.9,10.57 L50.9,4.98"]],
[
 [29,"Spinal cord, C1 to the conus at L1 to L2","M50.00,12.60 C50.00,13.33 50.00,15.73 50.00,17.00 C50.00,18.27 50.00,18.47 50.00,20.20 C50.00,21.93 50.00,24.87 50.00,27.40 C50.00,29.93 50.00,33.40 50.00,35.40 C50.00,37.40 50.00,38.73 50.00,39.40"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M49.80,39.40 C49.75,40.07 49.55,42.00 49.50,43.40 C49.45,44.80 49.50,46.37 49.50,47.80 C49.50,49.23 49.50,51.30 49.50,52.00"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M49.88,39.40 C49.85,40.07 49.73,42.00 49.70,43.40 C49.67,44.80 49.70,46.37 49.70,47.80 C49.70,49.23 49.70,51.30 49.70,52.00"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M49.96,39.40 C49.95,40.07 49.91,42.00 49.90,43.40 C49.89,44.80 49.90,46.37 49.90,47.80 C49.90,49.23 49.90,51.30 49.90,52.00"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M50.04,39.40 C50.05,40.07 50.09,42.00 50.10,43.40 C50.11,44.80 50.10,46.37 50.10,47.80 C50.10,49.23 50.10,51.30 50.10,52.00"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M50.12,39.40 C50.15,40.07 50.27,42.00 50.30,43.40 C50.33,44.80 50.30,46.37 50.30,47.80 C50.30,49.23 50.30,51.30 50.30,52.00"],
 [30,"Cauda equina, the L2 to S5 roots below the cord","M50.20,39.40 C50.25,40.07 50.45,42.00 50.50,43.40 C50.55,44.80 50.50,46.37 50.50,47.80 C50.50,49.23 50.50,51.30 50.50,52.00"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,13.00 C50.51,13.01 50.96,13.05 51.30,13.08 C51.64,13.11 52.22,13.18 52.40,13.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,13.00 C49.49,13.01 49.04,13.05 48.70,13.08 C48.36,13.11 47.78,13.18 47.60,13.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,14.00 C50.51,14.01 50.96,14.05 51.30,14.08 C51.64,14.11 52.22,14.18 52.40,14.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,14.00 C49.49,14.01 49.04,14.05 48.70,14.08 C48.36,14.11 47.78,14.18 47.60,14.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,15.00 C50.51,15.01 50.96,15.05 51.30,15.08 C51.64,15.11 52.22,15.18 52.40,15.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,15.00 C49.49,15.01 49.04,15.05 48.70,15.08 C48.36,15.11 47.78,15.18 47.60,15.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,16.00 C50.51,16.01 50.96,16.05 51.30,16.08 C51.64,16.11 52.22,16.18 52.40,16.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,16.00 C49.49,16.01 49.04,16.05 48.70,16.08 C48.36,16.11 47.78,16.18 47.60,16.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,17.00 C50.51,17.01 50.96,17.05 51.30,17.08 C51.64,17.11 52.22,17.18 52.40,17.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,17.00 C49.49,17.01 49.04,17.05 48.70,17.08 C48.36,17.11 47.78,17.18 47.60,17.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,18.00 C50.51,18.01 50.96,18.05 51.30,18.08 C51.64,18.11 52.22,18.18 52.40,18.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,18.00 C49.49,18.01 49.04,18.05 48.70,18.08 C48.36,18.11 47.78,18.18 47.60,18.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,19.00 C50.51,19.01 50.96,19.05 51.30,19.08 C51.64,19.11 52.22,19.18 52.40,19.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,19.00 C49.49,19.01 49.04,19.05 48.70,19.08 C48.36,19.11 47.78,19.18 47.60,19.20"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,20.20 C50.51,20.23 50.96,20.32 51.30,20.40 C51.64,20.48 52.22,20.65 52.40,20.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,20.20 C49.49,20.23 49.04,20.32 48.70,20.40 C48.36,20.48 47.78,20.65 47.60,20.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,21.50 C50.51,21.54 50.96,21.63 51.30,21.72 C51.64,21.81 52.22,22.00 52.40,22.05"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,21.50 C49.49,21.54 49.04,21.63 48.70,21.72 C48.36,21.81 47.78,22.00 47.60,22.05"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,22.80 C50.51,22.84 50.96,22.94 51.30,23.04 C51.64,23.14 52.22,23.34 52.40,23.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,22.80 C49.49,22.84 49.04,22.94 48.70,23.04 C48.36,23.14 47.78,23.34 47.60,23.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,24.20 C50.51,24.24 50.96,24.35 51.30,24.46 C51.64,24.57 52.22,24.78 52.40,24.85"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,24.20 C49.49,24.24 49.04,24.35 48.70,24.46 C48.36,24.57 47.78,24.78 47.60,24.85"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,25.80 C50.51,25.85 50.96,25.96 51.30,26.08 C51.64,26.20 52.22,26.43 52.40,26.50"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,25.80 C49.49,25.85 49.04,25.96 48.70,26.08 C48.36,26.20 47.78,26.43 47.60,26.50"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,27.40 C50.51,27.45 50.96,27.57 51.30,27.70 C51.64,27.82 52.22,28.07 52.40,28.15"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,27.40 C49.49,27.45 49.04,27.57 48.70,27.70 C48.36,27.82 47.78,28.07 47.60,28.15"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,29.00 C50.51,29.05 50.96,29.19 51.30,29.32 C51.64,29.45 52.22,29.72 52.40,29.80"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,29.00 C49.49,29.05 49.04,29.19 48.70,29.32 C48.36,29.45 47.78,29.72 47.60,29.80"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,30.60 C50.51,30.66 50.96,30.80 51.30,30.94 C51.64,31.08 52.22,31.37 52.40,31.45"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,30.60 C49.49,30.66 49.04,30.80 48.70,30.94 C48.36,31.08 47.78,31.37 47.60,31.45"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,32.20 C50.51,32.26 50.96,32.41 51.30,32.56 C51.64,32.71 52.22,33.01 52.40,33.10"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,32.20 C49.49,32.26 49.04,32.41 48.70,32.56 C48.36,32.71 47.78,33.01 47.60,33.10"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,33.80 C50.51,33.86 50.96,34.02 51.30,34.18 C51.64,34.34 52.22,34.66 52.40,34.75"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,33.80 C49.49,33.86 49.04,34.02 48.70,34.18 C48.36,34.34 47.78,34.66 47.60,34.75"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,35.40 C50.51,35.47 50.96,35.63 51.30,35.80 C51.64,35.97 52.22,36.30 52.40,36.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,35.40 C49.49,35.47 49.04,35.63 48.70,35.80 C48.36,35.97 47.78,36.30 47.60,36.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,37.00 C50.51,37.07 50.96,37.25 51.30,37.42 C51.64,37.59 52.22,37.95 52.40,38.05"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,37.00 C49.49,37.07 49.04,37.25 48.70,37.42 C48.36,37.59 47.78,37.95 47.60,38.05"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,38.60 C50.51,38.69 50.96,38.93 51.30,39.16 C51.64,39.39 52.22,39.86 52.40,40.00"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,38.60 C49.49,38.69 49.04,38.93 48.70,39.16 C48.36,39.39 47.78,39.86 47.60,40.00"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,40.20 C50.51,40.31 50.96,40.59 51.30,40.86 C51.64,41.13 52.22,41.69 52.40,41.85"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,40.20 C49.49,40.31 49.04,40.59 48.70,40.86 C48.36,41.13 47.78,41.69 47.60,41.85"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,41.80 C50.51,41.93 50.96,42.24 51.30,42.56 C51.64,42.88 52.22,43.51 52.40,43.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,41.80 C49.49,41.93 49.04,42.24 48.70,42.56 C48.36,42.88 47.78,43.51 47.60,43.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,43.40 C50.51,43.54 50.96,43.90 51.30,44.26 C51.64,44.62 52.22,45.33 52.40,45.55"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,43.40 C49.49,43.54 49.04,43.90 48.70,44.26 C48.36,44.62 47.78,45.33 47.60,45.55"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,45.00 C50.51,45.16 50.96,45.56 51.30,45.96 C51.64,46.36 52.22,47.16 52.40,47.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,45.00 C49.49,45.16 49.04,45.56 48.70,45.96 C48.36,46.36 47.78,47.16 47.60,47.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,46.60 C50.51,46.78 50.96,47.22 51.30,47.66 C51.64,48.10 52.22,48.98 52.40,49.25"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,46.60 C49.49,46.78 49.04,47.22 48.70,47.66 C48.36,48.10 47.78,48.98 47.60,49.25"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,47.80 C50.51,47.99 50.96,48.48 51.30,48.96 C51.64,49.44 52.22,50.41 52.40,50.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,47.80 C49.49,47.99 49.04,48.48 48.70,48.96 C48.36,49.44 47.78,50.41 47.60,50.70"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,49.00 C50.51,49.21 50.96,49.73 51.30,50.26 C51.64,50.78 52.22,51.84 52.40,52.15"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,49.00 C49.49,49.21 49.04,49.73 48.70,50.26 C48.36,50.78 47.78,51.84 47.60,52.15"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,50.00 C50.51,50.23 50.96,50.79 51.30,51.36 C51.64,51.93 52.22,53.06 52.40,53.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,50.00 C49.49,50.23 49.04,50.79 48.70,51.36 C48.36,51.93 47.78,53.06 47.60,53.40"],
 [31,"Spinal nerves, 31 pairs, one at every level","M50.35,50.90 C50.51,51.14 50.96,51.75 51.30,52.36 C51.64,52.97 52.22,54.18 52.40,54.55"],
 [31,"Spinal nerves, 31 pairs, one at every level","M49.65,50.90 C49.49,51.14 49.04,51.75 48.70,52.36 C48.36,52.97 47.78,54.18 47.60,54.55"],
 [0,"Brain, from behind","M45.80,8.80 C45.90,8.30 46.00,6.58 46.40,5.80 C46.80,5.02 47.60,4.43 48.20,4.10 C48.80,3.77 49.40,3.80 50.00,3.80 C50.60,3.80 51.20,3.77 51.80,4.10 C52.40,4.43 53.20,5.02 53.60,5.80 C54.00,6.58 54.23,7.90 54.20,8.80 C54.17,9.70 54.10,10.77 53.40,11.20 C52.70,11.63 51.13,11.40 50.00,11.40 C48.87,11.40 47.17,11.23 46.60,11.20 Z"],
 [32,"Cerebellum","M46.80,11.80 C47.08,11.65 47.97,10.93 48.50,10.90 C49.03,10.87 49.50,11.60 50.00,11.60 C50.50,11.60 50.97,10.87 51.50,10.90 C52.03,10.93 53.08,11.42 53.20,11.80 C53.32,12.18 52.73,12.95 52.20,13.20 C51.67,13.45 50.73,13.30 50.00,13.30 C49.27,13.30 48.17,13.22 47.80,13.20 Z"],
 [12,"Greater occipital nerve, C2","M49.20,14.00 C49.03,13.67 48.47,12.75 48.20,12.00 C47.93,11.25 47.73,10.33 47.60,9.50 C47.47,8.67 47.43,7.42 47.40,7.00"],
 [12,"Greater occipital nerve, C2","M50.80,14.00 C50.97,13.67 51.53,12.75 51.80,12.00 C52.07,11.25 52.27,10.33 52.40,9.50 C52.53,8.67 52.57,7.42 52.60,7.00"],
 [33,"Cervical plexus, C1 to C4","M49.30,13.00 C49.08,13.22 48.35,13.97 48.00,14.30 C47.65,14.63 47.27,14.72 47.20,15.00 C47.13,15.28 47.70,15.72 47.60,16.00 C47.50,16.28 46.77,16.58 46.60,16.70"],
 [33,"Cervical plexus, C1 to C4","M50.70,13.00 C50.92,13.22 51.65,13.97 52.00,14.30 C52.35,14.63 52.73,14.72 52.80,15.00 C52.87,15.28 52.30,15.72 52.40,16.00 C52.50,16.28 53.23,16.58 53.40,16.70"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M49.26,18.00 C48.88,18.22 47.72,18.67 46.95,19.30 C46.18,19.93 45.40,21.05 44.65,21.80 C43.90,22.55 43.07,23.20 42.45,23.80 C41.83,24.40 41.20,25.13 40.95,25.40"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M50.74,18.00 C51.13,18.22 52.28,18.67 53.05,19.30 C53.82,19.93 54.60,21.05 55.35,21.80 C56.10,22.55 56.93,23.20 57.55,23.80 C58.17,24.40 58.80,25.13 59.05,25.40"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M49.40,18.00 C49.05,18.22 48.03,18.67 47.30,19.30 C46.57,19.93 45.75,21.05 45.00,21.80 C44.25,22.55 43.42,23.20 42.80,23.80 C42.18,24.40 41.55,25.13 41.30,25.40"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M50.60,18.00 C50.95,18.22 51.97,18.67 52.70,19.30 C53.43,19.93 54.25,21.05 55.00,21.80 C55.75,22.55 56.58,23.20 57.20,23.80 C57.82,24.40 58.45,25.13 58.70,25.40"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M49.54,18.00 C49.23,18.22 48.35,18.67 47.65,19.30 C46.95,19.93 46.10,21.05 45.35,21.80 C44.60,22.55 43.77,23.20 43.15,23.80 C42.53,24.40 41.90,25.13 41.65,25.40"],
 [34,"Brachial plexus, C5 to T1, to the armpit","M50.46,18.00 C50.77,18.22 51.65,18.67 52.35,19.30 C53.05,19.93 53.90,21.05 54.65,21.80 C55.40,22.55 56.23,23.20 56.85,23.80 C57.47,24.40 58.10,25.13 58.35,25.40"],
 [11,"Radial nerve, round the back of the arm","M41.30,25.40 C41.13,26.00 40.58,27.73 40.30,29.00 C40.02,30.27 39.85,31.67 39.60,33.00 C39.35,34.33 39.17,35.67 38.80,37.00 C38.43,38.33 37.85,39.67 37.40,41.00 C36.95,42.33 36.50,43.67 36.10,45.00 C35.70,46.33 35.42,47.63 35.00,49.00 C34.58,50.37 33.97,51.87 33.60,53.20 C33.23,54.53 32.93,56.37 32.80,57.00"],
 [11,"Radial nerve, round the back of the arm","M58.70,25.40 C58.87,26.00 59.42,27.73 59.70,29.00 C59.98,30.27 60.15,31.67 60.40,33.00 C60.65,34.33 60.83,35.67 61.20,37.00 C61.57,38.33 62.15,39.67 62.60,41.00 C63.05,42.33 63.50,43.67 63.90,45.00 C64.30,46.33 64.58,47.63 65.00,49.00 C65.42,50.37 66.03,51.87 66.40,53.20 C66.77,54.53 67.07,56.37 67.20,57.00"],
 [12,"Axillary nerve, to the shoulder","M41.80,24.60 C41.53,24.57 40.68,24.27 40.20,24.40 C39.72,24.53 39.12,25.23 38.90,25.40"],
 [12,"Axillary nerve, to the shoulder","M58.20,24.60 C58.47,24.57 59.32,24.27 59.80,24.40 C60.28,24.53 60.88,25.23 61.10,25.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M49.28,38.60 C49.02,38.87 48.13,39.67 47.70,40.20 C47.27,40.73 46.93,41.27 46.70,41.80 C46.47,42.33 46.37,43.13 46.30,43.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M50.72,38.60 C50.98,38.87 51.87,39.67 52.30,40.20 C52.73,40.73 53.07,41.27 53.30,41.80 C53.53,42.33 53.63,43.13 53.70,43.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M49.40,38.60 C49.17,38.87 48.40,39.67 48.00,40.20 C47.60,40.73 47.23,41.27 47.00,41.80 C46.77,42.33 46.67,43.13 46.60,43.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M50.60,38.60 C50.83,38.87 51.60,39.67 52.00,40.20 C52.40,40.73 52.77,41.27 53.00,41.80 C53.23,42.33 53.33,43.13 53.40,43.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M49.52,38.60 C49.32,38.87 48.67,39.67 48.30,40.20 C47.93,40.73 47.53,41.27 47.30,41.80 C47.07,42.33 46.97,43.13 46.90,43.40"],
 [11,"Lumbar plexus, L1 to L4, inside psoas","M50.48,38.60 C50.68,38.87 51.33,39.67 51.70,40.20 C52.07,40.73 52.47,41.27 52.70,41.80 C52.93,42.33 53.03,43.13 53.10,43.40"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M49.18,43.40 C49.03,43.93 48.61,45.87 48.30,46.60 C47.99,47.33 47.60,47.27 47.30,47.80 C47.00,48.33 46.63,49.47 46.50,49.80"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M50.82,43.40 C50.97,43.93 51.39,45.87 51.70,46.60 C52.01,47.33 52.40,47.27 52.70,47.80 C53.00,48.33 53.37,49.47 53.50,49.80"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M49.30,43.40 C49.18,43.93 48.88,45.87 48.60,46.60 C48.32,47.33 47.90,47.27 47.60,47.80 C47.30,48.33 46.93,49.47 46.80,49.80"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M50.70,43.40 C50.82,43.93 51.12,45.87 51.40,46.60 C51.68,47.33 52.10,47.27 52.40,47.80 C52.70,48.33 53.07,49.47 53.20,49.80"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M49.42,43.40 C49.33,43.93 49.15,45.87 48.90,46.60 C48.65,47.33 48.20,47.27 47.90,47.80 C47.60,48.33 47.23,49.47 47.10,49.80"],
 [13,"Sacral plexus, L4 to S4, on piriformis","M50.58,43.40 C50.67,43.93 50.85,45.87 51.10,46.60 C51.35,47.33 51.80,47.27 52.10,47.80 C52.40,48.33 52.77,49.47 52.90,49.80"],
 [35,"Sciatic nerve, L4 to S3, down the back of the thigh","M46.80,49.80 C46.60,50.33 45.90,51.88 45.60,53.00 C45.30,54.12 45.10,55.17 45.00,56.50 C44.90,57.83 44.98,59.42 45.00,61.00 C45.02,62.58 45.07,64.33 45.10,66.00 C45.13,67.67 45.22,69.63 45.20,71.00 C45.18,72.37 45.03,73.67 45.00,74.20"],
 [35,"Sciatic nerve, L4 to S3, down the back of the thigh","M53.20,49.80 C53.40,50.33 54.10,51.88 54.40,53.00 C54.70,54.12 54.90,55.17 55.00,56.50 C55.10,57.83 55.02,59.42 55.00,61.00 C54.98,62.58 54.93,64.33 54.90,66.00 C54.87,67.67 54.78,69.63 54.80,71.00 C54.82,72.37 54.97,73.67 55.00,74.20"],
 [34,"Tibial nerve, down the calf","M45.00,74.20 C45.02,74.83 45.08,76.37 45.10,78.00 C45.12,79.63 45.07,82.00 45.10,84.00 C45.13,86.00 45.25,88.25 45.30,90.00 C45.35,91.75 45.38,93.75 45.40,94.50"],
 [34,"Tibial nerve, down the calf","M55.00,74.20 C54.98,74.83 54.92,76.37 54.90,78.00 C54.88,79.63 54.93,82.00 54.90,84.00 C54.87,86.00 54.75,88.25 54.70,90.00 C54.65,91.75 54.62,93.75 54.60,94.50"],
 [36,"Common fibular nerve, round the head of the fibula","M45.00,74.20 C44.85,74.43 44.40,75.03 44.10,75.60 C43.80,76.17 43.35,77.27 43.20,77.60"],
 [36,"Common fibular nerve, round the head of the fibula","M55.00,74.20 C55.15,74.43 55.60,75.03 55.90,75.60 C56.20,76.17 56.65,77.27 56.80,77.60"],
 [12,"Gluteal nerves","M47.20,49.40 C46.93,49.57 46.08,50.07 45.60,50.40 C45.12,50.73 44.52,51.23 44.30,51.40"],
 [12,"Gluteal nerves","M52.80,49.40 C53.07,49.57 53.92,50.07 54.40,50.40 C54.88,50.73 55.48,51.23 55.70,51.40"],
 [33,"Pudendal nerve, S2 to S4, to the perineum","M48.60,49.00 C48.57,49.43 48.35,50.83 48.40,51.60 C48.45,52.37 48.82,53.27 48.90,53.60"],
 [33,"Pudendal nerve, S2 to S4, to the perineum","M51.40,49.00 C51.43,49.43 51.65,50.83 51.60,51.60 C51.55,52.37 51.18,53.27 51.10,53.60"]]];
/* the spine's levels as the back figure labels them, figure height at each.
   A pain line enters the spine at its nerve's level, read off this. */
var BMSPINE=[{lv:"C1",y:13},{lv:"C7",y:19},{lv:"T4",y:24.2},{lv:"T12",y:37},{lv:"L1",y:38.6},{lv:"L4",y:43.4},{lv:"S1",y:46.6},{lv:"Co",y:52}];
/* THE 48 REGIONS, the spec's first taxonomy (BODY-MAP-SPEC.md section 1A item
   4, question M): his own list, "head, neck, shoulders, torso, palms, hips,
   legs, knees, shins, ankle, feet", and what his list had no name for, the
   upper arm and forearm, the chest and abdomen, and the whole back, because
   his own examples were "my back" and "my trap". [name, [x0,y0,x1,y1], side].
   The side is the person's: on the front their right is on the viewer's
   left, and on the back, seen from behind, it is on the viewer's right. */
var BMREG={front:[["Head",[43,2,57,15.6]],
 ["Neck",[45.5,15.6,54.5,19.4]],
 ["Chest",[41,19.4,59,33]],
 ["Abdomen",[41,33,59,45]],
 ["Shoulder",[35,19.4,42,25],"r"],
 ["Shoulder",[58,19.4,65,25],"l"],
 ["Upper arm",[32,25,41,36],"r"],
 ["Upper arm",[59,25,68,36],"l"],
 ["Forearm",[29,36,40,48],"r"],
 ["Forearm",[60,36,71,48],"l"],
 ["Palm",[27,48,40,62],"r"],
 ["Palm",[60,48,73,62],"l"],
 ["Hip",[40,45,50,57],"r"],
 ["Hip",[50,45,60,57],"l"],
 ["Thigh",[40,57,50,68],"r"],
 ["Thigh",[50,57,60,68],"l"],
 ["Knee",[40,68,50,74],"r"],
 ["Knee",[50,68,60,74],"l"],
 ["Shin",[40,74,50,88],"r"],
 ["Shin",[50,74,60,88],"l"],
 ["Ankle",[40,88,50,92.5],"r"],
 ["Ankle",[50,88,60,92.5],"l"],
 ["Foot",[38,92.5,50,99],"r"],
 ["Foot",[50,92.5,62,99],"l"]],
back:[["Back of head",[43,2,57,15.6]],
 ["Back of neck",[45.5,15.6,54.5,19.4]],
 ["Upper back",[41,24.5,59,33]],
 ["Mid back",[41,33,59,40]],
 ["Low back",[41,40,59,47]],
 ["Sacrum",[46,47,54,53]],
 ["Trap",[50.6,18.6,63,24.5],"r"],
 ["Trap",[37,18.6,49.4,24.5],"l"],
 ["Upper arm",[59,24.5,68,36],"r"],
 ["Upper arm",[32,24.5,41,36],"l"],
 ["Forearm",[60,36,71,48],"r"],
 ["Forearm",[29,36,40,48],"l"],
 ["Back of hand",[60,48,73,62],"r"],
 ["Back of hand",[27,48,40,62],"l"],
 ["Buttock",[50,47,60,57],"r"],
 ["Buttock",[40,47,50,57],"l"],
 ["Back of thigh",[50,57,60,68],"r"],
 ["Back of thigh",[40,57,50,68],"l"],
 ["Back of knee",[50,68,60,74],"r"],
 ["Back of knee",[40,68,50,74],"l"],
 ["Calf",[50,74,60,88],"r"],
 ["Calf",[40,74,50,88],"l"],
 ["Heel",[50,88,60,99],"r"],
 ["Heel",[40,88,50,99],"l"]]};
/* THE 28 ADDRESSES NOBODY HAS MEASURED, WHERE STANDARD ANATOMY PUTS THEM.
   Proposed on 27 September (FW, proto/fw/pages/fetters.html, each row sourced
   there) and drawn by the prototype he approved exactly as a measured place
   is drawn. They are not in ANAT, which is the engine's and is ruled data, so
   they stand here and only this map reads them: the seven layers above still
   gather these addresses round their seat (pmGather), which is the older and
   more cautious claim. Moving them into ANAT is a ruling, not a port. */
var BMPROP=[
 {ids:[7],pts:[[44.2,47.2],[55.8,47.2]],s:"Iliohypogastric and ilioinguinal branches, above the inguinal ligament"},
 {ids:[8],pts:[[50,45.2]],s:"Cauda equina, the L2 to S1 roots in the lumbar cistern"},
 {ids:[10,20],pts:[[47,60],[53,60]],s:"Obturator nerve, through the obturator foramen into the inner thigh"},
 {ids:[15],pts:[[48.5,43.4],[51.5,43.4]],s:"Lumbar sympathetic chain, on the front and side of the lumbar vertebral bodies"},
 {ids:[16],pts:[[50,41.7]],s:"Spinal cord base, the conus medullaris at L1 to L2"},
 {ids:[23],pts:[[48.2,51.8],[51.8,51.8]],s:"Pudendal plexus, S2 to S4, low in the pelvis"},
 {ids:[25],pts:[[48.6,49.6],[51.4,49.6]],s:"Uterovaginal plexus, the lower part of the inferior hypogastric plexus"},
 {ids:[27],pts:[[48.4,50.4],[51.6,50.4]],s:"Pelvic splanchnic roots, leaving S2 to S4 through the sacral foramina"},
 {ids:[31],pts:[[46.93,52.32],[53.07,52.32]],s:"Ilioinguinal nerve, at the superficial inguinal ring"},
 {ids:[34],pts:[[48,37.6],[52,37.6]],s:"Greater splanchnic nerve, T5 to T9, down beside the vertebral bodies to the crus at T12"},
 {ids:[35],pts:[[51,43]],s:"Aortic plexus, on the front of the abdominal aorta left of the midline, L1 to L3"},
 {ids:[37],pts:[[47.4,39],[52.6,39]],s:"Lesser splanchnic nerves, T10 to T11, to the aorticorenal ganglia"},
 {ids:[40],pts:[[50.3,41.3]],s:"Superior mesenteric plexus, round the artery's origin at L1"},
 {ids:[41],pts:[[56.8,38.2]],s:"Splenic plexus, along the splenic artery, upper left of the abdomen"},
 {ids:[42],pts:[[52.4,40.2]],s:"Pancreatic plexus, over the body of the pancreas, left of centre"},
 {ids:[46],pts:[[48,35.8],[52,35.8]],s:"Epigastric branches of T7 to T9, under the xiphoid"},
 {ids:[47],pts:[[45.2,37]],s:"Hepatic branch of the anterior vagal trunk, to the liver"},
 {ids:[48],pts:[[46.6,38.8]],s:"Hepatic plexus, along the hepatic artery"},
 {ids:[51],pts:[[48.8,28.6],[51.2,28.6]],s:"The two vagus nerves in the thorax, beside the oesophagus"},
 {ids:[52],pts:[[51.3,32.4]],s:"Thoracic aortic plexus, on the descending aorta"},
 {ids:[57],pts:[[45.6,30.2],[54.4,30.2]],s:"Phrenic nerves, C3 to C5, down each side of the pericardium"},
 {ids:[60],pts:[[43.5,24.8],[56.5,24.8]],s:"Pectoral nerves, once called the anterior thoracic nerves"},
 {ids:[61],pts:[[47.4,26.6],[52.6,26.6]],s:"Pulmonary branches of the vagus, at the roots of the lungs"},
 {ids:[68],pts:[[48.8,16.4],[51.2,16.4]],s:"Pharyngeal branch of the vagus, level with C2 to C3"},
 {ids:[70],pts:[[47.6,15],[52.4,15]],s:"Glossopharyngeal nerve, below the angle of the jaw"},
 {ids:[72],pts:[[48.1,17.9],[51.9,17.9]],s:"Cervical sympathetic ganglia, beside C2 to C7"},
 {ids:[74],pts:[[44.4,21.4],[55.6,21.4]],s:"Nerve to subclavius, C5 to C6, under the clavicle"}];
/* WHICH SURFACE EACH ADDRESS BELONGS ON, the spec's split (question C, which
   he answered "C, definitely": both, the far one faint). Inside the skull is
   head, drawn on the front. The back is what is reached from behind: the
   back chart's own points, the tailbone, and the roots, cord and lumbar
   plexus that lie against the spine. Both is the top of the shoulder. */
var BMBACK=[50,59,38,39,43,45,17,28,4,13,14,9,6,1,8,16,27], BMBOTH=[69,73];
function bmView(id){var n=BY[id];
 if(n.b==='Crown'||n.b==='3rd Eye')return 'head';
 return BMBACK.indexOf(id)>=0?'back':BMBOTH.indexOf(id)>=0?'both':'front';}
/* EVERY PLACE, derived the way the spec's generator derives it
   (proto/body-map-spec/gen.js), so a measurement moved in ANAT moves here
   too. Checked against the prototype's own 110 places before it went in: the
   same count, the same view and the same addresses on every one, within a
   thousandth of a unit. Each point of a paired structure carries every
   address of its row, which is how a region on either side finds them.

   pmAnat above spreads a row's addresses round its point and pushes the head
   apart; this does not, because this figure opens a region instead of
   stacking marks in it, and a place is found by region and not by fingertip.
   The spine ruler is the same four points as pmAnat's. */
function bmPlaces(){
 var H=ANATHEAD, mm=(H.topZ-H.earZ)/(H.year-H.ytop), out=[];
 var spine=function(lv){var R=ANATSPINE,i=0;while(i<R.length-2&&lv>R[i+1][0])i++;
  var a=R[i],b=R[i+1];return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);};
 var add=function(ids,pts,src){var v=bmView(ids[0]);
  pts.forEach(function(p){out.push({x:p[0],y:p[1],ids:ids,view:v,src:src,kick:0,vel:0,fr:0});});};
 ANAT.forEach(function(row){
  if(row.h)add(row.ids,row.h.map(function(p){return [50-p[0]/mm,H.ytop+(H.topZ-p[1])/mm];}),'atlas');
  else if(row.v)add(row.ids,row.v.map(function(p){return [50+p[1],spine(p[0])];}),'spine');
  else if(row.f)add(row.ids,row.f,'chart');
  else add(row.ids,[[50,PMYP[row.at]]],'seat');});
 BMPROP.forEach(function(r){add(r.ids,r.pts,'proposed');});
 return out;}

/* ---------- the grid and the camera, in figure units ----------
   One unit is 1.87 cm on a 175 cm person, from the figure's own stature of
   93.674 units, so a 5 cm cell is 2.68 units: the resolution the spec
   settled on from three sources that agree (section 5). 20 by 36 cells cover
   each view. The back view is drawn 74 units right of the front. */
var BMCM=175/93.674, BMU=5/BMCM, BMXA=50-10*BMU, BMYA=2, BMCOLS=20, BMROWS=36, BMF=10,
    BMFW=BMCOLS*BMF, BMFH=BMROWS*BMF, BMOX=74, BMTAU=Math.PI*2, BMSABMAX=8;

/* THE FOUR SWITCHES, as built and as measured (HE). Going from Pattern to
   Pain dulls the nerve and seat map and raises the heat; each switch does it
   one way. Isotherm opens, because it won the panel at 0.617 against 0.536,
   0.522 and 0.515, and it stays a choice because he has not confirmed it.
   The fourth was built after the first three were measured and lost, and it
   is kept as a measured loss rather than dropped. The numbers are the
   prototype's to the digit. */
var BMVAR={
 A:{nm:'Fade',on:{g:[0,400,bmEIO],h:[0,400,bmEIO]},
  dull:{nerve:.30,nsat:.15,seat:.30,ssat:.2,grid:.45,addr:.45,sab:.35},heatMax:.86,satLead:1,local:false,iso:false},
 B:{nm:'Reveal',on:{g:[0,260,bmEOut],h:[140,520,bmEOut]},
  dull:{nerve:.20,nsat:.25,seat:.50,ssat:.6,grid:.5,addr:.35,sab:.40},heatMax:.74,satLead:.5,local:true,iso:false},
 C:{nm:'Isotherm',on:{g:[0,300,bmEOut],h:[0,450,null]},
  dull:{nerve:.55,nsat:.40,seat:.60,ssat:.5,grid:.6,addr:.8,sab:.6},heatMax:.70,satLead:1,local:false,iso:true},
 D:{nm:'Bands and reveal',on:{g:[0,260,bmEOut],h:[100,400,null]},
  dull:{nerve:.42,nsat:.35,seat:.55,ssat:.55,grid:.55,addr:.45,sab:.45},heatMax:.70,satLead:1,local:true,iso:true,litA:.62}};
var BMOFF={g:[80,320,bmEOut],h:[0,220,bmEOut]};   /* back to Pattern: the heat leaves first */
/* Pattern is not full strength either: at full the back's gold nerves were
   the brightest thing on the page and the eye landed on anatomy. */
var BMBASE={nerve:.62,nsat:.8,seat:.9,ssat:1,grid:.8,addr:1,sab:1};
/* QUESTION A, the three readings he has to choose between. A4 draws each
   address's own fetter icon once the view is opened past 1.7 times. */
var BMAMODE=[['A4','Fetter mark'],['A3','Point in patch'],['A1','Point']];
/* the stage and the figure. The seats are not here: they are PMC. */
var BMC={stage:[15,16,19],man:[22,24,30],edge:[239,237,232],grid:[40,43,52],ink:[230,231,234],
 dim:[154,156,164],acc:[126,184,212],cns:[239,237,232],auto:[126,184,212],som:[194,160,99],
 prop:[180,176,168],lit:[255,238,222],casing:[12,13,16]};
/* the heat ramp. Sacral to Root and no further, lifting toward white at the
   top the way a filament does. The alarm red is never in it: that colour
   means the instrument is wrong. */
var BMRAMP=[[0,[178,122,84],0],[.14,[186,128,88],.22],[.4,[209,146,85],.52],[.7,[196,99,94],.68],[1,[232,158,138],.86]];
/* each region's line to the spine: the nerve it rides, matched against the
   figure's own titles, and the level it enters at */
var BMROUTE={
 front:{'Head':['Brainstem','C1'],'Neck':['Phrenic','C4'],'Chest':['Intercostal','T4'],'Abdomen':['Intercostal','T10'],
  'Shoulder':['Phrenic','C5'],'Upper arm':['Median','C7'],'Forearm':['Median','C7'],'Palm':['Median','C7'],
  'Hip':['Femoral','L3'],'Thigh':['Femoral','L3'],'Knee':['Saphenous','L3'],'Shin':['Deep fibular','L5'],'Ankle':['Deep fibular','L5'],'Foot':['Deep fibular','L5']},
 back:{'Back of head':['Greater occipital','C2'],'Back of neck':['Cervical plexus','C3'],'Upper back':['Spinal nerves','T4'],
  'Mid back':['Spinal nerves','T8'],'Low back':['Spinal nerves','L3'],'Sacrum':['Sacral plexus','S2'],'Trap':['Cervical plexus','C3'],
  'Upper arm':['Axillary','C5'],'Forearm':['Radial','C7'],'Back of hand':['Radial','C7'],'Buttock':['Gluteal','L5'],
  'Back of thigh':['Sciatic','L5'],'Back of knee':['Common fibular','L5'],'Calf':['Tibial','S1'],'Heel':['Tibial','S1']}};
/* the 48 regions onto the nine PAINREG lines, which are the only symptom and
   pattern text the engine carries today */
var BMPAINMAP={'Head':'head','Back of head':'head','Neck':'throat','Back of neck':'throat','Shoulder':'shoulders','Trap':'shoulders',
 'Upper arm':'arms','Forearm':'arms','Chest':'torso','Abdomen':'torso','Upper back':'torso','Mid back':'torso',
 'Hip':'pelvis','Low back':'pelvis','Sacrum':'pelvis','Buttock':'pelvis','Thigh':'legs','Knee':'legs','Shin':'legs','Ankle':'legs',
 'Back of thigh':'legs','Back of knee':'legs','Calf':'legs','Palm':'hands','Back of hand':'hands','Foot':'feet','Heel':'feet'};
/* his list, "palm, feet, shin, knee": where a limb's centre would be if one
   were ruled in. Proposed. Nothing stands on them. */
var BMLIMB=[['Palm','r'],['Palm','l'],['Knee','r'],['Knee','l'],['Shin','r'],['Shin','l'],['Foot','r'],['Foot','l']];

/* ---------- small arithmetic, prefixed: every module shares one scope ---------- */
function bmHex(h){h=String(h).replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function bmRgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+Math.max(0,Math.min(1,a)).toFixed(3)+')';}
function bmMix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
function bmGrey(c,s){var l=0.299*c[0]+0.587*c[1]+0.114*c[2];return bmMix([l,l,l],c,s);}
function bmSstep(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
function bmEOut(t){return 1-Math.pow(1-t,3);}
function bmEIO(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function bmFrac(x){return x-Math.floor(x);}
function bmHash(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
/* a stable number from a saboteur's name, so its drift and phase are the same
   on every render and every visit, where the prototype had an index */
function bmHashS(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%9973;return h;}
function bmSeatC(b){return bmHex(PMC[b]||'#9A9CA4');}

/* ---------- the one state ----------
   Not S: S is the product's, and the prototype's S would have shadowed it. */
var BM={mode:'pattern',variant:'C',amode:'A4',brush:6,face:'front',
 pg:0,ph:0,tr:null,hoverReg:null,hoverCell:null,hoverSab:null,hoverPlace:null,hoverView:0,traceT0:0,
 cam:{x:0,y:0,z:1},camT:null,W:0,H:0,dpr:1,z0:1,dirty:true,t:0,phone:false,raf:0,last:0,
 cv:null,sv:null,well:null,ok:false,drag:null,tipOn:0,cab:{},sabs:[],who:null,
 /* PAIN IS HELD IN MEMORY, PER PROFILE, AND IS NOT SAVED. Saving it is a new
    field in the profile, which is schema v2 and his, and painted pain is
    somatic self report, which is the kind of record a person must be able to
    see and delete with the rest of their profile. So a paint lasts until the
    profile changes or the page closes, and nothing claims otherwise. */
 paint:null};

/* ---------- the figure, built once, the first time the map is shown ----------
   Not at load: the page opens on the Field, and nothing here is wanted until
   the Body page is. */
var BMG=null;
function bmVX(v){return v?BMOX:0;}
function bmInit(host){
 if(BMG)return BMG;
 var G={};
 var raw=new Path2D(BODYPATH);
 G.body=[0,1].map(function(v){var p=new Path2D();
  p.addPath(raw,new DOMMatrix().translate(PMTX+bmVX(v),PMTY).scale(PMS));return p;});
 G.probe=document.createElement('canvas').getContext('2d');
 /* the approved figure's classes, and the seat each dashed ring and flow
    segment stands for, read off its own stroke, which is PAL to the digit */
 var ofCol={};Object.keys(PAL).forEach(function(b){ofCol[PAL[b].toUpperCase()]=b;});
 G.nerv=BMNERVE.map(function(list,v){return list.map(function(e){
  var st=BMSTYLE[e[0]], p=new Path2D(), m=new DOMMatrix().translate(bmVX(v),0), circ=(e.length===5);
  if(circ)p.arc(e[2]+bmVX(v),e[3],e[4],0,BMTAU); else p.addPath(new Path2D(e[2]),m);
  var seat=(st[0]==='seat'||st[0]==='flow')?ofCol[st[1].toUpperCase()]:null;
  return {p:p,k:st[0],c:seat?bmSeatC(seat):(BMC[st[0]]||bmHex(st[1])),seat:seat,w:st[2],o:st[3],
   f:st[4]||null,da:st[5]?st[5].split(/[ ,]+/).map(Number):null,nm:e[1],d:circ?null:e[2],t:circ?'circle':'path'};});});
 G.places=bmPlaces();
 G.byId={};G.places.forEach(function(p){p.ids.forEach(function(id){(G.byId[id]=G.byId[id]||[]).push(p);});});
 G.child={};CHILD.forEach(function(c){G.child[c.nm]={ic:c.ic,p:new Path2D(c.ic)};});
 G.reg=[];
 ['front','back'].forEach(function(vn,v){BMREG[vn].forEach(function(r){var b=r[1];
  G.reg.push({v:v,nm:r[0],side:r[2]||'',box:b,cx:(b[0]+b[2])/2,cy:(b[1]+b[3])/2,
   area:(b[2]-b[0])*(b[3]-b[1]),key:vn+':'+r[0]+':'+(r[2]||'')});});});
 /* smallest first, so where two overlap the smaller takes the press */
 G.reg.sort(function(a,b){return a.area-b.area;});
 G.cellIn=[[],[]];
 [0,1].forEach(function(v){for(var r=0;r<BMROWS;r++)for(var c=0;c<BMCOLS;c++){
  var x0=BMXA+c*BMU,y0=BMYA+r*BMU,hit=0;
  [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]].forEach(function(o){if(bmIn(G,v,x0+o[0]*BMU,y0+o[1]*BMU))hit++;});
  G.cellIn[v][r*BMCOLS+c]=hit>0;}});
 G.field=[new Float32Array(BMFW*BMFH),new Float32Array(BMFW*BMFH)];
 G.tmp=new Float32Array(BMFW*BMFH);
 G.ker=(function(){var s=0.45*BMF,R=Math.ceil(s*3),k=[],t=0;
  for(var i=-R;i<=R;i++){var w=Math.exp(-i*i/(2*s*s));k.push(w);t+=w;}return k.map(function(w){return w/t;});})();
 G.heat=[0,1].map(function(){var c=document.createElement('canvas');c.width=BMFW;c.height=BMFH;return c;});
 G.mask=[0,1].map(function(){var c=document.createElement('canvas');c.width=BMFW;c.height=BMFH;return c;});
 G.fieldVer=0;
 bmRoutes(G,host);
 return (BMG=G);}
function bmIn(G,v,x,y){return G.probe.isPointInPath(G.body[v],x+bmVX(v),y);}
/* a spine level to figure height, off the back figure's own labels */
function bmLvY(lv){var m={};BMSPINE.forEach(function(s){m[s.lv]=s.y;});
 var ord=['C1','C7','T4','T12','L1','L4','S1','Co'], at={C1:1,C7:7,T4:11,T12:19,L1:20,L4:23,S1:25,Co:30};
 var k=lv.charAt(0),n=parseInt(lv.slice(1),10), x=k==='C'?n:k==='T'?7+n:k==='L'?19+n:k==='S'?24+n:30, i=0;
 while(i<ord.length-2&&x>at[ord[i+1]])i++;var a=ord[i],b=ord[i+1];
 return m[a]+(x-at[a])*(m[b]-m[a])/(at[b]-at[a]);}
/* EACH REGION'S LINE TO THE SPINE, along the nearest nerve of the right name.
   Measuring a path needs one in a document, so the nerves are sampled once
   through a throwaway svg inside the host and it is removed straight after. */
function bmRoutes(G,host){
 var NS='http://www.w3.org/2000/svg', hid=document.createElementNS(NS,'svg'), S2=[[],[]];
 hid.setAttribute('width','0');hid.setAttribute('height','0');hid.style.position='absolute';
 (host||document.body).appendChild(hid);
 var sample=function(d){var el=document.createElementNS(NS,'path');el.setAttribute('d',d);hid.appendChild(el);
  var L=el.getTotalLength(),n=Math.max(4,Math.ceil(L/0.5)),out=[];
  for(var i=0;i<=n;i++){var q=el.getPointAtLength(L*i/n);out.push([q.x,q.y]);}
  hid.removeChild(el);return out;};
 try{
  G.nerv.forEach(function(L,v){L.forEach(function(n){
   if(n.t==='path'&&(n.k==='som'||n.k==='cns'||n.k==='auto'))S2[v].push({nm:n.nm,pts:sample(n.d)});});});
 }finally{hid.parentNode.removeChild(hid);}
 G.reg.forEach(function(r){
  var rt=BMROUTE[r.v?'back':'front'][r.nm]; if(!rt){r.route=null;return;}
  var sy=bmLvY(rt[1]), sp=[50,sy], c=[r.cx,r.cy], best=null;
  S2[r.v].forEach(function(s){if(s.nm.indexOf(rt[0])<0)return;
   s.pts.forEach(function(q,i){var d=Math.hypot(q[0]-c[0],q[1]-c[1]);if(!best||d<best.d)best={d:d,i:i,s:s};});});
  var pts=[c];
  if(best&&best.d<9){
   var P=best.s.pts, a=P[0], z=P[P.length-1];
   var toStart=Math.hypot(a[0]-sp[0],a[1]-sp[1])<Math.hypot(z[0]-sp[0],z[1]-sp[1]);
   pts=pts.concat(toStart?P.slice(0,best.i+1).reverse():P.slice(best.i));}
  var e=pts[pts.length-1], mx=(e[0]+sp[0])/2, my=Math.min(e[1],sp[1])-1.2;
  for(var k=1;k<=12;k++){var t=k/12;
   pts.push([(1-t)*(1-t)*e[0]+2*(1-t)*t*mx+t*t*sp[0],(1-t)*(1-t)*e[1]+2*(1-t)*t*my+t*t*sp[1]]);}
  r.route=pts.map(function(q){return [q[0]+bmVX(r.v),q[1]];});
  r.samp=bmWithLen(r.route); r.routeLen=r.samp[r.samp.length-1][2];
  r.nerve=best&&best.d<9?best.s.nm:null; r.level=rt[1];});}
function bmWithLen(P){var L=0,o=[];
 for(var i=0;i<P.length;i++){if(i)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);o.push([P[i][0],P[i][1],L]);}return o;}
function bmRegName(r){return r.nm+(r.side?(r.side==='l'?', left':', right'):'');}

/* ---------- the paint, and the field it becomes ----------
   A painted cell reads its own value across its whole extent and falls off
   outside it. Neighbours take the max, never the sum: two sixes side by side
   are still a six, and a sum would report pain nobody painted. Then a blur of
   a third of a cell rounds every corner, and each painted cell's own centre is
   pinned back to its value, so one cell alone reads what was painted rather
   than seventy percent of it. */
function bmRebuild(v){
 var G=BMG, Fd=G.field[v], P=BM.paint[v], T=G.tmp, K=G.ker, R=(K.length-1)/2, W0=BMFW, x,y,k,s,i,c,r;
 T.fill(0);Fd.fill(0);
 for(i=0;i<P.length;i++){var val=P[i];if(!val)continue;c=i%BMCOLS;r=(i/BMCOLS)|0;
  for(y=r*BMF;y<r*BMF+BMF;y++)for(x=c*BMF;x<c*BMF+BMF;x++)Fd[y*W0+x]=val;}
 for(y=0;y<BMFH;y++)for(x=0;x<W0;x++){s=0;for(k=-R;k<=R;k++){var xx=x+k;if(xx>=0&&xx<W0)s+=Fd[y*W0+xx]*K[k+R];}T[y*W0+x]=s;}
 for(y=0;y<BMFH;y++)for(x=0;x<W0;x++){s=0;for(k=-R;k<=R;k++){var yy=y+k;if(yy>=0&&yy<BMFH)s+=T[yy*W0+x]*K[k+R];}Fd[y*W0+x]=s;}
 for(i=0;i<P.length;i++){val=P[i];if(!val)continue;c=i%BMCOLS;r=(i/BMCOLS)|0;
  var cx=c*BMF+BMF/2,cy=r*BMF+BMF/2,rr=BMF*0.32;
  for(y=Math.floor(cy-rr);y<=Math.ceil(cy+rr);y++)for(x=Math.floor(cx-rr);x<=Math.ceil(cx+rr);x++){
   if(x<0||y<0||x>=W0||y>=BMFH)continue;
   var d=Math.hypot(x+.5-cx,y+.5-cy)/rr;
   if(d<=1){var j=y*W0+x,pin=val*(1-0.25*d*d);if(pin>Fd[j])Fd[j]=pin;}}}
 G.fieldVer++;}
function bmFieldAt(v,x,y){var fx=((x-BMXA)/BMU)*BMF,fy=((y-BMYA)/BMU)*BMF;
 if(fx<0||fy<0||fx>=BMFW||fy>=BMFH)return 0;return BMG.field[v][(fy|0)*BMFW+(fx|0)];}
function bmRamp(t){t=clamp(t,0,1);
 for(var i=1;i<BMRAMP.length;i++)if(t<=BMRAMP[i][0]){var a=BMRAMP[i-1],b=BMRAMP[i],k=(t-a[0])/(b[0]-a[0]);
  return [bmMix(a[1],b[1],k),a[2]+(b[2]-a[2])*k];}
 return [BMRAMP[4][1],BMRAMP[4][2]];}
function bmPaintHeat(v,gain,sat,maxA,iso){
 var G=BMG, key=v+'|'+G.fieldVer+'|'+gain.toFixed(3)+'|'+sat.toFixed(3)+'|'+maxA+'|'+iso;
 if(G.heat[v]._k===key)return; G.heat[v]._k=key;
 var g=G.heat[v].getContext('2d'),img=g.createImageData(BMFW,BMFH),d=img.data,Fd=G.field[v];
 var band=function(j){return Math.min(5,Math.ceil(Fd[j]/2-1e-4));};
 for(var j=0;j<Fd.length;j++){var val=Fd[j],o=j*4,a;if(val<0.05){d[o+3]=0;continue;}
  if(iso){ /* five bands, stepping in one at a time as the gain rises */
   var shown=Math.ceil(gain*5-1e-6), bnd=band(j);
   if(bnd>shown||bnd<1){d[o+3]=0;continue;}
   var rr=bmRamp(bnd/5), col=bmGrey(rr[0],.35+.65*sat), xq=j%BMFW;
   /* the isotherm: a pixel whose band differs from a neighbour's, so a flat
      patch never lights up as a whole */
   var line=(xq<BMFW-1&&band(j+1)!==bnd)||(j+BMFW<Fd.length&&band(j+BMFW)!==bnd)
    ||(xq>0&&band(j-1)!==bnd)||(j>=BMFW&&band(j-BMFW)!==bnd);
   if(line)col=bmMix(col,[255,236,220],.45);
   a=(rr[1]/.86)*maxA*(line?1:.82);
   d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=a*255;}
  else{var r2=bmRamp(val/10*gain),c2=bmGrey(r2[0],.35+.65*sat);a=(r2[1]/.86)*maxA*Math.min(1,gain*1.2);
   d[o]=c2[0];d[o+1]=c2[1];d[o+2]=c2[2];d[o+3]=a*255;}}
 g.putImageData(img,0,0);}
function bmPaintMask(v){var G=BMG;if(G.mask[v]._k===G.fieldVer)return;G.mask[v]._k=G.fieldVer;
 var g=G.mask[v].getContext('2d'),img=g.createImageData(BMFW,BMFH),d=img.data,Fd=G.field[v];
 for(var j=0;j<Fd.length;j++){var o=j*4;d[o]=d[o+1]=d[o+2]=255;d[o+3]=255*bmSstep(0.6,2.4,Fd[j]);}
 g.putImageData(img,0,0);}
/* the highest paint inside a region's box */
function bmRegVal(r){var b=r.box,m=0,P=BM.paint[r.v];
 for(var i=0;i<P.length;i++){var v=P[i];if(!v)continue;var x=BMXA+(i%BMCOLS+.5)*BMU,y=BMYA+(((i/BMCOLS)|0)+.5)*BMU;
  if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&v>m)m=v;}return m;}
function bmMarkVals(){BMG.reg.forEach(function(r){r.val=bmRegVal(r);});}

/* ---------- the lines, off the real reading ----------
   A line is a saboteur compute() found at a weight of five or more, run
   through the addresses it was built from. The prototype's own threshold:
   below five no line runs. Its tension is the saboteur's weight, which for
   an overshot one is the overshoot, so a line can be taut over addresses that
   carry nothing, and that is the reading and not a fault.

   EIGHT DRAWN AT REST, the heaviest. Measured on the roster, 27 September:
   up to 39 saboteurs past five on one profile (Lance), 23 on Gordon and on
   James, against at most 14 on the prototype's mock. The page already ruled
   the number once, "beyond eight the arcs stop being a structure", and 39
   cables are a thicket. The rest are in the rail's Running list, and one
   held or pointed at from there is drawn whatever its rank.

   Each line keeps its drift, phase and pulses across renders by name, so a
   render does not restart its motion. */
function bmSabRefresh(r){
 var seen={}, all=[];
 r.sabs.forEach(function(o){if(o.w<5||seen[o.nm]||!o.parts)return;seen[o.nm]=1;all.push(o);});
 var hold=bmHoldNm(), want=all.slice(0,BMSABMAX);
 all.forEach(function(o){if((o.nm===hold||o.nm===BM.hoverSab)&&want.indexOf(o)<0)want.push(o);});
 BM.sabAll=all;
 BM.sabs=want.map(function(o,i){
  var c=BM.cab[o.nm], k=bmHashS(o.nm);
  if(!c){c=BM.cab[o.nm]={nm:o.nm,per:15+11*bmHash(k+3),ph:bmHash(k+9)*BMTAU,q0:bmHash(k+17),pulses:[],dir:1};}
  var parts=o.parts.filter(function(n){return n&&BMG.byId[n.i];});
  var fam=HCX_LIB.filter(function(h){return h.nm===o.hcx;})[0];
  c.o=o; c.T=clamp(o.w,0,10); c.lane=i; c.fam=o.hcx;
  c.col=bmSeatC(fam?fam.b:((parts[0]||{}).b||'Root'));
  c.nids=parts.map(function(n){return n.i;}); c.ch=parts.map(function(n){return n.sq;});
  /* heaviest address last, so "toward the heaviest" is always forward */
  var hi=c.ch.indexOf(Math.max.apply(null,c.ch.concat([0])));
  if(hi===0&&c.nids.length>1){c.nids.reverse();c.ch.reverse();}
  var n=1+Math.floor(c.T/3.4);
  while(c.pulses.length<n)c.pulses.push({q:bmFrac(c.q0+c.pulses.length/n),prev:0});
  c.pulses.length=n;
  c.views=[bmChain(c,0),bmChain(c,1)];
  return c;}).filter(function(c){return c.nids.length>1;});
 bmTouchHeat();}
function bmHoldNm(){
 var p=(PMPICK&&typeof PMPICK==='object'&&PMPICK.kind==='sab')?PMPICK
  :(S.pin&&S.pin.kind==='sab')?S.pin:null;
 return p?p.nm:null;}
function bmPlaceX(p,v){return v?100-p.x:p.x;}
function bmSolidOn(p,v){if(p.view==='both')return true;if(p.view==='head'||p.view==='front')return v===0;return v===1;}
function bmChain(s,v){
 var pts=[],prev=null;
 s.nids.forEach(function(id,j){var cand=BMG.byId[id]||[];if(!cand.length)return;
  var opts=cand.map(function(p){return {x:bmPlaceX(p,v),y:p.y,p:p,ghost:!bmSolidOn(p,v),id:id};});
  /* a paired place has two points; take the side that keeps the cable short */
  var pick=opts[0];
  if(opts.length>1){var ref=prev||(function(){var o=BMG.byId[s.nids[j+1]]||BMG.byId[s.nids[j-1]]||[];
    return o[0]?{x:bmPlaceX(o[0],v),y:o[0].y}:{x:50,y:30};})();
   opts.forEach(function(o){if(Math.hypot(o.x-ref.x,o.y-ref.y)<Math.hypot(pick.x-ref.x,pick.y-ref.y))pick=o;});}
  pts.push(pick);prev=pick;});
 return {pts:pts,samp:null,len:0,nodeQ:[]};}
function bmTouchHeat(){BM.sabs.forEach(function(s){s.hot=[0,1].map(function(v){var c=s.views[v];if(!c)return 0;var m=0;
 c.pts.forEach(function(p){m=Math.max(m,bmFieldAt(v,p.x,p.y));});
 for(var i=1;i<c.pts.length;i++)for(var t=0;t<=1;t+=.1){var a=c.pts[i-1],b=c.pts[i];
  m=Math.max(m,bmFieldAt(v,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t));}
 return m;});});}
/* the cable's shape this frame: a sag by slackness, a lane bow so cables that
   share an address fan out like cables off a pylon, and the hum, a standing
   wave pinned at every address, so the addresses never move */
function bmCable(s,v,t){
 var c=s.views[v],P=c.pts,out=[],nodeQ=[0],L=0;if(P.length<2)return null;
 var slack=Math.pow(1-s.T/10,1.3), hover=(BM.hoverSab===s.nm||bmHoldNm()===s.nm);
 var amp=(REDUCED?0:0.10*Math.pow(s.T/10,1.5)*(hover?3.2:1)), w=BMTAU*(0.9+2.2*Math.sqrt(s.T/10));
 for(var i=1;i<P.length;i++){var a=P[i-1],b=P[i],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
  /* an arc says link, a line on the spine says nerve, and a saboteur is not a
     nerve, so each cable takes its own arc, alternating sides by lane */
  var side=(s.lane%2)?-1:1, sag=len*0.20*slack, bow=side*Math.min(8,len*(0.12+0.06*(s.lane>>1))+0.6);
  var cx=(a.x+b.x)/2+nx*bow, cy=(a.y+b.y)/2+sag+ny*bow, steps=Math.max(10,Math.ceil(len*2.2));
  for(var k=(i===1?0:1);k<=steps;k++){var u=k/steps,
   x=(1-u)*(1-u)*a.x+2*(1-u)*u*cx+u*u*b.x, y=(1-u)*(1-u)*a.y+2*(1-u)*u*cy+u*u*b.y;
   var hum=amp*Math.sin(Math.PI*u)*Math.sin(w*t+s.ph+i);
   x+=nx*hum;y+=ny*hum;
   if(out.length){var q=out[out.length-1];L+=Math.hypot(x-q[0],y-q[1]);}
   out.push([x+bmVX(v),y,L,(a.ghost||b.ghost)?1:0]);}
  nodeQ.push(L);}
 c.samp=out;c.len=L;c.nodeQ=nodeQ.map(function(q){return q/(L||1);});return c;}
/* the prototype's own defect, fixed on the way in and named here so it is
   not put back. Its chain held view local x and nothing added the back
   view's offset, so every back view cable was drawn on the front, mirrored,
   over the front one: the back showed no line at all and a held line showed
   twice (its shots/5-held-line-1600.png). The offset is added in bmCable
   above, so each view draws its own. */

/* ---------- the camera ---------- */
function bmWorldW(){return BM.phone?[24,76]:[24-14,BMOX+76+14];}
function bmViews(){return BM.phone?[BM.face==='back'?1:0]:[0,1];}
function bmFitCam(){var w=bmWorldW(),ww=w[1]-w[0],hh=102, z=Math.min(BM.W/ww,(BM.H-24)/hh);BM.z0=z;
 return {x:BM.phone?(BM.face==='back'?BMOX+50:50):(w[0]+w[1])/2,y:50.5,z:z};}
function bmFlyTo(x,y,z){BM.camT={x:x,y:y,z:z};if(REDUCED){BM.cam={x:x,y:y,z:z};BM.camT=null;}BM.dirty=true;}
function bmW2S(x,y){return [(x-BM.cam.x)*BM.cam.z+BM.W/2,(y-BM.cam.y)*BM.cam.z+BM.H/2];}
function bmS2W(x,y){return [(x-BM.W/2)/BM.cam.z+BM.cam.x,(y-BM.H/2)/BM.cam.z+BM.cam.y];}
function bmTf(g){g.setTransform(BM.dpr*BM.cam.z,0,0,BM.dpr*BM.cam.z,BM.dpr*(BM.W/2-BM.cam.x*BM.cam.z),BM.dpr*(BM.H/2-BM.cam.y*BM.cam.z));}
function bmZoomed(){return BM.cam.z>BM.z0*1.05||(BM.camT&&BM.camT.z>BM.z0*1.05);}
/* the well's box, read every frame and acted on only when it moved */
function bmSize(){
 var r=BM.well.getBoundingClientRect(), w=Math.round(r.width), h=Math.round(r.height);
 if(w===BM.W&&h===BM.H&&BM.cv.width)return;
 var was=BM.phone;
 BM.phone=w<700; BM.dpr=Math.min(2,window.devicePixelRatio||1); BM.W=w; BM.H=h;
 [BM.cv,BM.still,BM.lit,BM.lit2].forEach(function(c){c.width=Math.max(1,Math.round(w*BM.dpr));c.height=Math.max(1,Math.round(h*BM.dpr));});
 BM.stillKey='';BM.litKey='';
 var f=bmFitCam(); BM.cam=f; BM.camT=null; BM.dirty=true;
 if(was!==BM.phone)bmBars();}

/* ---------- the dulling, as a timeline ---------- */
function bmSetMode(m){if(m===BM.mode)return;BM.mode=m;
 var on=(m==='pain'),V=BMVAR[BM.variant],T=on?V.on:BMOFF;
 BM.tr={t0:performance.now(),g0:BM.pg,h0:BM.ph,gt:on?1:0,ht:on?1:0,T:T};
 if(REDUCED){BM.pg=BM.tr.gt;BM.ph=BM.tr.ht;BM.tr=null;}
 BM.dirty=true;}
function bmStepTr(now){var r=BM.tr;if(!r)return;var e=now-r.t0,done=true;
 var run=function(from,to,spec){var t=clamp((e-spec[0])/spec[1],0,1);if(t<1)done=false;
  /* the isotherm steps: five bands, one every ninety milliseconds */
  if(!spec[2])return from+(to-from)*Math.min(1,Math.ceil(t*5)/5);
  return from+(to-from)*spec[2](t);};
 BM.pg=run(r.g0,r.gt,r.T.g);BM.ph=run(r.h0,r.ht,r.T.h);if(done)BM.tr=null;}
function bmDull(){var d=BMVAR[BM.variant].dull,g=BM.pg,o={};
 Object.keys(BMBASE).forEach(function(k){o[k]=BMBASE[k]+(d[k]-BMBASE[k])*g;});return o;}

/* ---------- pass 1, the still layer: grid, man, nerves, seats ----------
   Cached, and redrawn only when the camera, the dulling or the ground moves,
   never for a pulse. */
function bmStill(dl){
 var key=[BM.cam.x.toFixed(3),BM.cam.y.toFixed(3),BM.cam.z.toFixed(3),BM.W,BM.H,dl.nerve.toFixed(3),dl.nsat.toFixed(3),
  dl.seat.toFixed(3),dl.grid.toFixed(3),BM.mode,BM.phone,BM.face,BM.stage,typeof PMPICK==='string'?PMPICK:''].join('|');
 if(key===BM.stillKey)return;BM.stillKey=key;
 var g=BM.sctx, G=BMG;g.setTransform(1,0,0,1,0,0);
 /* THE STAGE IS THE LIGHTING'S OWN GROUND WHERE THAT GROUND IS DARK, and the
    prototype's dark stage where it is not. The approved figure is white and
    pale blue lines on a dark body, and on Glass white paper it would vanish,
    so there it carries its own ground, as a lightbox does. */
 g.clearRect(0,0,BM.still.width,BM.still.height);
 if(BM.stage){g.fillStyle=bmRgba(BM.stage,1);g.fillRect(0,0,BM.still.width,BM.still.height);}
 bmTf(g);var px=1/BM.cam.z;
 bmViews().forEach(function(v){var o=bmVX(v);
  /* the grid first and the man solid over it, which is the spec's layer
     order and the prototype's. Solid means the grid is hidden inside him and
     only the paint shows it, and that is how it was approved. */
  g.save();g.clip(G.body[v]);g.beginPath();
  for(var r=0;r<=BMROWS;r++){g.moveTo(BMXA+o,BMYA+r*BMU);g.lineTo(BMXA+BMCOLS*BMU+o,BMYA+r*BMU);}
  for(var c=0;c<=BMCOLS;c++){g.moveTo(BMXA+c*BMU+o,BMYA);g.lineTo(BMXA+c*BMU+o,BMYA+BMROWS*BMU);}
  g.strokeStyle=bmRgba(BMC.grid,(BM.mode==='pain'?1.6:1)*dl.grid);g.lineWidth=px;g.stroke();g.restore();
  /* THE MAN IS SOLID. The approved figure fills him at 7 percent, and that is
     what let the glow behind him read through him (spec 1A, item 6). His
     edge is the svg's, in vector, over all of this. */
  g.fillStyle=bmRgba(BMC.man,1);g.fill(G.body[v]);
  bmNerves(g,v,dl.nerve,dl.nsat,false);
  G.nerv[v].forEach(function(n){if(n.k!=='seat'&&n.k!=='flow')return;
   var on=(n.k==='seat'&&typeof PMPICK==='string'&&PMBANDS.some(function(b){return b.k===PMPICK&&b.b===n.seat;}));
   var col=bmGrey(n.c,dl.ssat);g.setLineDash(n.da||[]);
   g.strokeStyle=bmRgba(col,(n.k==='flow'?Math.max(n.o,.12):n.o)*(on?1:dl.seat));
   g.lineWidth=n.k==='flow'?Math.max(n.w,2.2*px):Math.max(n.w,(on?2.4:1.4)*px);g.stroke(n.p);g.setLineDash([]);});});}
function bmNerves(g,v,alpha,sat,lit){var px=1/BM.cam.z;
 BMG.nerv[v].forEach(function(n){if(n.k==='seat'||n.k==='flow')return;
  var col=lit?bmMix(n.c,[240,196,160],.55):bmGrey(n.c,sat);
  /* nerves keep the width they have on the whole body as the view opens,
     the fix the spec asks for in 1A item 2 */
  var w=clamp(n.w*BM.z0,0.7,2.2)*px;
  if(n.f&&n.t==='circle'){g.fillStyle=bmRgba(col,.10*alpha);g.fill(n.p);}
  g.strokeStyle=bmRgba(col,n.o*alpha);g.lineWidth=lit?w*1.1:w;g.stroke(n.p);});}

/* ---------- the frame ---------- */
function bmFrame(now){
 if(!BM.cv||!BM.cv.isConnected||S.tab!==TAB.ENERGY||PMLAYER!=='map'){BM.raf=0;bmTip(null);return;}
 var dt=Math.min(0.05,(now-(BM.last||now))/1000);BM.last=now;if(!REDUCED)BM.t+=dt;
 bmSize();
 var moving=false;
 if(BM.tr){bmStepTr(now);moving=true;}
 if(BM.camT){var k=1-Math.exp(-dt*9),c=BM.cam,T=BM.camT;
  c.x+=(T.x-c.x)*k;c.y+=(T.y-c.y)*k;c.z+=(T.z-c.z)*k;
  if(Math.abs(T.z-c.z)<T.z*0.002&&Math.abs(T.x-c.x)<0.02&&Math.abs(T.y-c.y)<0.02){BM.cam={x:T.x,y:T.y,z:T.z};BM.camT=null;}
  moving=true;}
 /* under reduced motion nothing hums or pulses, so a frame is drawn only when
    something changed */
 if(REDUCED&&!moving&&!BM.dirty){BM.raf=requestAnimationFrame(bmFrame);return;}
 bmDraw(dt);BM.dirty=false;bmOverlay();
 BM.raf=requestAnimationFrame(bmFrame);}
function bmDraw(dt){
 var dl=bmDull(),V=BMVAR[BM.variant],G=BMG;bmStill(dl);
 var g=BM.ctx;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,BM.cv.width,BM.cv.height);g.drawImage(BM.still,0,0);
 var vs=bmViews(), px=1/BM.cam.z, gain=BM.ph;
 /* 2. the heat, over the nerves, as he asked, and clipped to him */
 if(gain>0.002)vs.forEach(function(v){
  var sat=V.satLead<1?Math.pow(gain,V.satLead):gain;
  bmPaintHeat(v,gain,sat,V.heatMax,V.iso);
  bmTf(g);g.save();g.clip(G.body[v]);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  g.drawImage(G.heat[v],BMXA+bmVX(v),BMYA,BMCOLS*BMU,BMROWS*BMU);g.restore();});
 /* 3. Reveal only: the nerves under the pain stay lit. Cached, because
    recompositing every nerve through the mask each frame measured 21ms. */
 if(V.local&&BM.pg>0.01){
  var lk=[BM.cam.x.toFixed(3),BM.cam.y.toFixed(3),BM.cam.z.toFixed(3),BM.W,BM.H,G.fieldVer,vs.join(','),BM.variant].join('|');
  if(lk!==BM.litKey){BM.litKey=lk;var lc=BM.lctx,l2=BM.l2ctx;
   lc.setTransform(1,0,0,1,0,0);lc.clearRect(0,0,BM.lit.width,BM.lit.height);
   vs.forEach(function(v){l2.setTransform(1,0,0,1,0,0);l2.clearRect(0,0,BM.lit2.width,BM.lit2.height);bmTf(l2);
    bmNerves(l2,v,1,1,true);bmPaintMask(v);
    l2.globalCompositeOperation='destination-in';l2.imageSmoothingEnabled=true;
    l2.drawImage(G.mask[v],BMXA+bmVX(v),BMYA,BMCOLS*BMU,BMROWS*BMU);l2.globalCompositeOperation='source-over';
    lc.drawImage(BM.lit2,0,0);});}
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=BM.pg*(V.litA||1);g.drawImage(BM.lit,0,0);g.globalAlpha=1;}
 bmTf(g);
 /* regions: the pointed one and the open one, clipped to him */
 var sel=bmSel();
 vs.forEach(function(v){g.save();g.clip(G.body[v]);
  if(BM.mode==='pain')G.reg.forEach(function(r){if(r.v!==v)return;var b=r.box;
   g.strokeStyle=bmRgba(BMC.acc,.10);g.lineWidth=px;g.strokeRect(b[0]+bmVX(v),b[1],b[2]-b[0],b[3]-b[1]);});
  [BM.hoverReg,sel].forEach(function(r,i){if(!r||r.v!==v)return;var b=r.box;
   g.fillStyle=bmRgba(BMC.acc,i?.10:.06);g.fillRect(b[0]+bmVX(v),b[1],b[2]-b[0],b[3]-b[1]);
   g.strokeStyle=bmRgba(BMC.acc,i?.9:.5);g.lineWidth=px*(i?1.6:1.1);g.strokeRect(b[0]+bmVX(v),b[1],b[2]-b[0],b[3]-b[1]);});
  if(BM.mode==='pain'&&BM.hoverCell&&BM.hoverCell.v===v){var hc=BM.hoverCell;
   g.strokeStyle=bmRgba([240,210,184],.85);g.lineWidth=px*1.4;g.strokeRect(BMXA+hc.c*BMU+bmVX(v),BMYA+hc.r*BMU,BMU,BMU);}
  g.restore();});
 /* 4. the live layer: pain lines, limb centres, cables, addresses, names */
 if(gain>0.02)bmPainLines(g,vs,gain);
 bmLimb(g,vs,dl);
 bmDrawSabs(g,vs,dl,dt);
 bmDrawAddr(g,vs,dl,dt);
 if(!BM.phone&&BM.cam.z<BM.z0*1.3)bmLabels(g);
 bmHint(g);}
function bmStroke(g,P,from,to,width,style){ /* P: [x,y,L] samples, drawn between lengths from and to */
 g.beginPath();var started=false;
 for(var i=0;i<P.length;i++){var p=P[i];if(p[2]<from)continue;if(p[2]>to)break;
  if(!started){g.moveTo(p[0],p[1]);started=true;}else g.lineTo(p[0],p[1]);}
 if(!started)return;g.lineWidth=width;g.strokeStyle=style;g.stroke();}
/* a painted region's line to the spine along its nerve. The pulses run
   inward, the direction a pain signal travels. */
function bmPainLines(g,vs,gain){var px=1/BM.cam.z;
 g.lineCap='round';g.lineJoin='round';
 BMG.reg.forEach(function(r){if(vs.indexOf(r.v)<0||!r.route||!r.val)return;
  var val=r.val,P=r.samp,L=r.routeLen,t=val/10,col=bmRamp(t)[0],a=gain*(0.45+0.5*t);
  bmStroke(g,P,0,L,(3.2+0.3*val)*px,bmRgba(BMC.casing,.55*a));
  bmStroke(g,P,0,L,(1.1+0.22*val)*px,bmRgba(col,a));
  if(REDUCED)return;
  var sp=(0.10+0.035*val),n=1+Math.floor(val/4);
  for(var j=0;j<n;j++){var q=bmFrac(BM.t*sp+j/n+bmHash(r.cx*7+r.cy)),c=q*L,h=L*0.05,env=Math.sin(Math.PI*q);
   bmStroke(g,P,c-h,c+h,(4+0.4*val)*px,bmRgba(col,.14*gain*env));
   bmStroke(g,P,c-h*.6,c+h*.6,(1.6+0.25*val)*px,bmRgba(bmMix(col,[255,240,228],.5),.9*gain*env));}});}
/* THE LIMB CENTRES ARE NOT ADDRESSES AND ARE DRAWN SO THEY CANNOT PASS FOR
   ONE: dashed, the proposal colour, a fixed size in screen pixels, no charge
   arc, never counted, never pressed, never on a line. Question D. */
function bmLimb(g,vs,dl){
 BMLIMB.forEach(function(l){var r=BMG.reg.filter(function(x){return x.v===0&&x.nm===l[0]&&x.side===l[1];})[0];if(!r)return;
  var x=r.cx,y=r.cy+(l[0]==='Foot'?1.2:0);
  [0,1].forEach(function(v){if(vs.indexOf(v)<0)return;var ghost=(v===1),s=bmW2S((v?100-x:x)+bmVX(v),y);
   g.setTransform(BM.dpr,0,0,BM.dpr,0,0);
   g.setLineDash([2.5,2.5]);g.beginPath();g.arc(s[0],s[1],6.5,0,BMTAU);
   g.strokeStyle=bmRgba(BMC.prop,(ghost?.28:.75)*dl.addr);g.lineWidth=1.3;g.stroke();g.setLineDash([]);
   g.beginPath();g.arc(s[0],s[1],1.4,0,BMTAU);g.fillStyle=bmRgba(BMC.prop,(ghost?.25:.7)*dl.addr);g.fill();});});
 bmTf(g);}
function bmDrawSabs(g,vs,dl,dt){
 var hold=bmHoldNm(), hot=BM.hoverSab||hold, now=performance.now();
 BM.sabs.forEach(function(s){
  /* the load drifts on its own slow sine, the way the Field's does */
  var ld=Math.cos(BMTAU*BM.t/s.per+s.ph);s.dir=ld>=0?1:-1;
  vs.forEach(function(v){var c=bmCable(s,v,BM.t);if(!c)return;var P=c.samp,L=c.len;
   bmTf(g);var px=1/BM.cam.z;g.lineCap='round';g.lineJoin='round';
   var heatLift=BMVAR[BM.variant].local&&s.hot[v]>1.5?1:0;
   var a=(0.40+0.55*s.T/10)*(dl.sab+(1-dl.sab)*heatLift);
   if(hot&&hot!==s.nm)a*=0.20;
   var w=(1.1+0.30*s.T)*px;
   if(hot===s.nm){a=Math.max(a,.95);w*=1.5;}
   /* the trace, his CU ruling: it draws the whole line, then holds and hums */
   var to=L;if(hot===s.nm&&!REDUCED){var tp=bmEOut(clamp((now-BM.traceT0)/700,0,1));to=L*tp;
    bmStroke(g,P,0,L,w,bmRgba(s.col,a*.25));}
   /* a segment that passes to the far surface is dashed and faint */
   var solid=[],ghost=[],run=null,runG=-1,lastP=null;
   for(var pi=0;pi<P.length;pi++){var pp=P[pi];if(pp[2]>to)break;
    if(pp[3]!==runG){run=lastP?[lastP]:[];(pp[3]?ghost:solid).push(run);runG=pp[3];}
    run.push(pp);lastP=pp;}
   solid.forEach(function(seg){if(seg.length<2)return;
    bmStroke(g,seg,-1,1e9,w+2.4*px,bmRgba(BMC.casing,.55*a));bmStroke(g,seg,-1,1e9,w,bmRgba(s.col,a));});
   ghost.forEach(function(seg){if(seg.length<2)return;g.setLineDash([3*px,3.5*px]);
    bmStroke(g,seg,-1,1e9,w*.8,bmRgba(s.col,a*.45));g.setLineDash([]);});
   if(REDUCED||(hot&&hot!==s.nm))return;
   var sp=(0.07+0.15*Math.sqrt(s.T/10))*s.dir;
   s.pulses.forEach(function(pu){
    if(v===vs[0]){pu.prev=pu.q;pu.q=bmFrac(pu.q+sp*dt);
     /* a pulse crossing an address kicks its mark */
     c.nodeQ.forEach(function(nq,ni){var a0=pu.prev,a1=pu.q;
      var crossed=s.dir>0?(a0<nq&&a1>=nq&&a1-a0<.5):(a0>nq&&a1<=nq&&a0-a1<.5);
      if(crossed){var pl=c.pts[ni]&&c.pts[ni].p;if(pl)pl.vel+=1.6*(s.T/10);}});}
    var cc=pu.q*L,h=L*0.045,env=Math.sin(Math.PI*pu.q);if(cc>to)return;
    bmStroke(g,P,cc-h,cc+h,w+4.5*px,bmRgba(s.col,.13*env*(a/.85)));
    bmStroke(g,P,cc-h*.55,cc+h*.55,w+.9*px,bmRgba(bmMix(s.col,[255,255,255],.5),.95*env*Math.min(1,a*1.6)));});});});}
function bmMarkR(p){return 3.2+0.55*Math.min(p.ids.length,6);}
/* THE ADDRESSES, AT THEIR CHARGE. A ring and the charge arc round it, the
   product's own reading circle: a faint track, and an arc filled to sq over
   ten. The three readings of question A differ here and nowhere else. */
function bmDrawAddr(g,vs,dl,dt){
 var zI=BM.z0*1.7, ic=BM.amode==='A4'?bmSstep(zI*0.8,zI*1.25,BM.cam.z):0, onLine={};
 BM.sabs.forEach(function(s){s.nids.forEach(function(id){onLine[id]=Math.max(onLine[id]||0,s.T);});});
 g.setTransform(BM.dpr,0,0,BM.dpr,0,0);
 BMG.places.forEach(function(p){
  /* the mark has mass: kicked by a pulse, it swells past and settles, on the
     Field's own spring */
  if(!REDUCED){var acc=196*(0-p.kick)-2*.42*14*p.vel;p.vel+=acc*dt;p.kick+=p.vel*dt;}else{p.kick=0;p.vel=0;}
  vs.forEach(function(v){
   var ghost=!bmSolidOn(p,v), x=bmPlaceX(p,v)+bmVX(v), s=bmW2S(x,p.y);
   if(s[0]<-40||s[1]<-40||s[0]>BM.W+40||s[1]>BM.H+40)return;
   var ch=0,seat=null;p.ids.forEach(function(id){var q=BY[id].sq||0;if(q>=ch){ch=q;seat=BY[id].b;}});
   var col=bmSeatC(seat), heatLift=BMVAR[BM.variant].local&&bmFieldAt(v,bmPlaceX(p,v),p.y)>1.5?1:0;
   var ln=p.ids.some(function(id){return onLine[id];});
   /* an address off every line steps back so the lines read, as the
      prototype has it, except where no line runs at all: then there is
      nothing to step back from, and dimming the whole figure would only say
      the page is faint */
   var A=(ghost?.30:1)*(dl.addr+(1-dl.addr)*heatLift)*(ln||!BM.sabs.length?1:.55), held=ch>=0.3;
   var r=bmMarkR(p)*(1+0.18*p.kick)*(BM.amode==='A1'?.6:1);
   /* A3, the patch. 4 cm, a placeholder until sizes are sourced */
   if(BM.amode==='A3'){g.beginPath();g.arc(s[0],s[1],Math.max(r+2,2*BM.cam.z/BMCM),0,BMTAU);g.fillStyle=bmRgba(col,.10*A);g.fill();}
   /* past five an address on a line throws the Field's stress fringes, born
      at the mark and travelling out while loading, back in while releasing */
   var str=clamp((ch-5)/5,0,1);
   if(!ghost&&ln&&str>0.02&&dl.sab>0.3){var dir=1;
    BM.sabs.forEach(function(sb){if(sb.nids.indexOf(p.ids[0])>=0)dir=sb.dir;});
    p.fr=(p.fr||0)+(REDUCED?0:dt*0.9*dir);var f=REDUCED?.5:bmFrac(p.fr),gap=9-5*str;
    for(var k=0;k<4;k++){var pos=k+f,rr=r+3+pos*gap,al=Math.pow(str,1.3)*Math.sin(Math.PI*pos/4)*.75*A*dl.sab;if(al<.02)continue;
     g.beginPath();g.arc(s[0],s[1],rr,0,BMTAU);g.strokeStyle=bmRgba(k%2?col:bmMix(col,[255,255,255],.5),al);
     g.lineWidth=k%2?1:1.4;g.stroke();}}
   if(ic>0.01&&!ghost)bmRosette(g,p,s,col,A*ic);
   var ringA=A*(1-ic*.55);
   g.beginPath();g.arc(s[0],s[1],r,0,BMTAU);g.strokeStyle=bmRgba(col,(held?.35:.22)*ringA);g.lineWidth=1.2;g.stroke();
   if(held&&!ghost){g.beginPath();g.arc(s[0],s[1],r,-Math.PI/2,-Math.PI/2+BMTAU*ch/10);
    g.strokeStyle=bmRgba(col,.95*ringA);g.lineWidth=2;g.stroke();}
   if(BM.hoverPlace===p&&v===BM.hoverView){g.beginPath();g.arc(s[0],s[1],r+4,0,BMTAU);
    g.strokeStyle=bmRgba(BMC.ink,.8);g.lineWidth=1.2;g.stroke();}});});}
/* A4: each address's own fetter icon, round the place when it holds several */
function bmRosette(g,p,s,col,A){
 var n=p.ids.length, sz=clamp(0.95*BM.cam.z,14,24), R=n>1?sz*(0.55+0.11*n):0;
 p.ids.forEach(function(id,j){var nd=BY[id],ch=BMG.child[nd.c];if(!ch)return;
  var an=-Math.PI/2+j/n*BMTAU,x=s[0]+Math.cos(an)*R,y=s[1]+Math.sin(an)*R,c2=bmSeatC(nd.b),q=nd.sq||0;
  g.save();g.translate(x-sz/2,y-sz/2);g.scale(sz/24,sz/24);
  g.strokeStyle=bmRgba(c2,A*(q>=.3?1:.5));g.lineWidth=1.5*24/sz;g.lineJoin='round';g.lineCap='round';g.stroke(ch.p);g.restore();
  if(n>1){g.beginPath();g.arc(x,y,sz*0.62,0,BMTAU);g.strokeStyle=bmRgba(c2,A*.25);g.lineWidth=1;g.stroke();}});}
/* the region names, two columns beside the figures, relaxed so none collide.
   Beside the body and never on it. */
function bmLabels(g){
 var sel=bmSel();
 g.setTransform(BM.dpr,0,0,BM.dpr,0,0);g.font='500 12px Inter,system-ui,sans-serif';g.textBaseline='middle';
 [0,1].forEach(function(v){
  var list=[],seen={};
  BMG.reg.forEach(function(r){if(r.v!==v||r.side==='l'||seen[r.nm])return;seen[r.nm]=1;list.push(r);});
  var colX=v?(BMOX+76+1.2):(24-1.2), sx=bmW2S(colX,0)[0];
  var items=list.map(function(r){return {r:r,y:bmW2S(0,r.cy)[1]};}).sort(function(a,b){return a.y-b.y;}), i;
  for(i=1;i<items.length;i++)if(items[i].y-items[i-1].y<15)items[i].y=items[i-1].y+15;
  for(i=items.length-2;i>=0;i--)if(items[i+1].y-items[i].y<15)items[i].y=items[i+1].y-15;
  items.forEach(function(it){var r=it.r,val=r.val||0;
   var lit=(sel&&sel.nm===r.nm&&sel.v===v)||(BM.hoverReg&&BM.hoverReg.nm===r.nm&&BM.hoverReg.v===v);
   var ex=bmW2S((v?r.box[2]:r.box[0])+bmVX(v),r.cy);
   g.beginPath();g.moveTo(sx+(v?-4:4),it.y);g.lineTo(ex[0],ex[1]);g.strokeStyle=bmRgba(BMC.dim,lit?.5:.14);g.lineWidth=1;g.stroke();
   g.textAlign=v?'left':'right';
   g.fillStyle=lit?bmRgba(BMC.ink,1):val&&BM.mode==='pain'?bmRgba([227,176,143],.95):bmRgba(BMC.dim,.95);
   g.fillText(r.nm+(val&&BM.mode==='pain'?'  '+val:''),sx+(v?-2:2),it.y);});
  g.textAlign='center';g.font='600 13px Inter,system-ui,sans-serif';g.fillStyle=bmRgba(BMC.ink,.9);
  g.fillText(v?'Back, seen from behind':'Front',bmW2S(v?BMOX+50:50,0)[0],14);
  g.font='500 12px Inter,system-ui,sans-serif';});}
/* one line of instruction, in the corner, off the figure */
/* HS SWEEP: ONLY IN PAINT. The default hint, "Press a region to open it.
   Double press to zoom in. Point at a line to trace it.", sat in the corner
   of the Body on every load, explaining the figure to a person already
   looking at it. The regions answer a press and the lines answer a pointer
   without being told to. Paint keeps its line, because it is the one mode a
   person chose, and the second press that clears a cell cannot be found by
   looking: the same case as the archetype scale's own one line. */
function bmHint(g){
 if(BM.mode!=='pain')return;
 var t='Paint where it hurts. Press a painted cell again to clear it.';
 g.setTransform(BM.dpr,0,0,BM.dpr,0,0);g.font='500 12px Inter,system-ui,sans-serif';g.textBaseline='alphabetic';g.textAlign='left';
 g.fillStyle=bmRgba(BMC.dim,.95);g.fillText(t,12,BM.H-12);}

/* ---------- the svg over the canvas ----------
   The outline of both views in one path, in figure units, so it is one
   element that stays one pixel wide at any zoom. BODYPATH is absolute M, C
   and Z only, in pairs, so each pair is carried into the figure numerically
   rather than through a transform the svg would scale the stroke with. */
var _bmOutline=null;
function bmOutline(){
 if(_bmOutline)return _bmOutline;
 var tok=BODYPATH.match(/[A-Za-z]|-?\d+(\.\d+)?/g), d='';
 [0,BMOX].forEach(function(ox){var k=0;
  for(var i=0;i<tok.length;i++){var t=tok[i];
   if(/[A-Za-z]/.test(t)){d+=t;k=0;continue;}
   d+=(k%2?(PMTY+(+t)*PMS):(PMTX+ox+(+t)*PMS)).toFixed(2)+(k%2?' ':',');k++;}});
 return (_bmOutline=d);}
/* the overlay follows the camera: its viewBox is the world the canvas shows */
function bmOverlay(){
 if(!BM.sv)return;
 var vb=(BM.cam.x-BM.W/2/BM.cam.z).toFixed(3)+' '+(BM.cam.y-BM.H/2/BM.cam.z).toFixed(3)+' '
  +(BM.W/BM.cam.z).toFixed(3)+' '+(BM.H/BM.cam.z).toFixed(3);
 if(vb!==BM.vb){BM.vb=vb;BM.sv.setAttribute('viewBox',vb);}
 /* a finger on a phone scrolls the page past a whole body. It draws or pans
    only where that is the job: painting, or a view that has been opened. */
 var ta=(BM.mode==='pain'||bmZoomed())?'none':'pan-y';
 if(ta!==BM.ta){BM.ta=ta;BM.sv.style.touchAction=ta;}}
/* the seven seats, pressable, over the approved figure's own dashed rings.
   The same words the seven layers put on a seat. */
function bmSeats(seats){
 var g=BM.sv&&BM.sv.querySelector('[data-bmseats]'); if(!g)return;
 g.innerHTML=PMBANDS.map(function(b){var st=seats.filter(function(s){return s.p.k===b.k;})[0];
  return '<circle class="pm-seat" data-seat="'+b.k+'" cx="50" cy="'+b.yp+'" r="2.4" fill="transparent"><title>'
   +b.nm+', '+st.hot+' carrying, '+Math.round(st.pass*100)+' percent through</title></circle>';}).join('');}

/* ---------- what is under a point ---------- */
function bmSel(){
 if(!(PMPICK&&typeof PMPICK==='object'&&PMPICK.bmReg))return null;
 var k=PMPICK.bmReg;return BMG.reg.filter(function(r){return r.key===k;})[0]||null;}
function bmPick(sx,sy){var G=BMG,w=bmS2W(sx,sy),v=null;
 bmViews().forEach(function(vv){if(w[0]>=24+bmVX(vv)-2&&w[0]<=76+bmVX(vv)+2)v=vv;});if(v===null)return {w:w};
 var x=w[0]-bmVX(v),y=w[1],reg=null,i;
 if(bmIn(G,v,x,y))for(i=0;i<G.reg.length;i++){var r=G.reg[i],b=r.box;
  if(r.v===v&&x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]){reg=r;break;}}
 var c=Math.floor((x-BMXA)/BMU),rw=Math.floor((y-BMYA)/BMU),cell=null;
 if(c>=0&&c<BMCOLS&&rw>=0&&rw<BMROWS&&G.cellIn[v][rw*BMCOLS+c])cell={v:v,c:c,r:rw,i:rw*BMCOLS+c};
 var place=null,bd=1e9;
 G.places.forEach(function(p){var s=bmW2S(bmPlaceX(p,v)+bmVX(v),p.y),d=Math.hypot(s[0]-sx,s[1]-sy);
  if(d<Math.max(10,bmMarkR(p)+4)&&d<bd){bd=d;place=p;}});
 var sab=null,sd=8;
 BM.sabs.forEach(function(s){var c2=s.views[v];if(!c2||!c2.samp)return;
  for(var j=0;j<c2.samp.length;j+=2){var q=bmW2S(c2.samp[j][0],c2.samp[j][1]),d=Math.hypot(q[0]-sx,q[1]-sy);if(d<sd){sd=d;sab=s;}}});
 return {w:w,v:v,x:x,y:y,reg:reg,cell:cell,place:place,sab:sab};}

/* ---------- the tooltip is the product's one, handed the canvas ----------
   Placed off the picture, as the Field's are, at the height of the mark:
   the panel beside the figure rather than over it. Never on a phone, where
   there is no pointing. */
function bmTip(info){
 if(typeof TIP==='undefined')return;
 if(!info||TIP.sheet()){if(BM.tipOn){TIP.hide();BM.tipOn=0;}return;}
 var r=BM.cv.getBoundingClientRect();
 TIP.showAt(r,{t:info.t,b:info.b,at:{x:r.left+info.x,y:r.top+info.y}},null);BM.tipOn=1;}
function bmPlaceTip(p){
 var ids=p.ids.slice().sort(function(a,b){return (BY[b].sq||0)-(BY[a].sq||0);});
 return {t:ids.length>2?BY[ids[0]].k+' and '+(ids.length-1)+' more':ids.map(function(id){return BY[id].k;}).join(' and '),
  /* name, fetter, nerve, weight, the prototype's own order. A first cut wrote
     it as a sentence, "Avoidance Of Grief, Joy at the great cardiac nerve",
     which reads as though joy sits there, when Joy is the fetter it is under */
  b:ids.map(function(id){var n=BY[id];
   return n.k+' · '+(n.c||'no fetter')+' · '+String(n.n).toLowerCase()+' · '+(n.sq||0).toFixed(1);}).join('. ')};}

/* ---------- pressing, pointing, painting ---------- */
function bmWire(){
 var sv=BM.sv;
 var at=function(e){var r=sv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
 sv.addEventListener('pointerdown',function(e){
  var p=at(e),pk=bmPick(p[0],p[1]);
  /* a seat is pressed as a seat, except while painting, when it is body */
  var seat=(BM.mode!=='pain'&&e.target.closest)?e.target.closest('[data-seat]'):null;
  BM.drag={x:p[0],y:p[1],cx:BM.cam.x,cy:BM.cam.y,moved:false,seat:seat,
   paint:BM.mode==='pain'&&!!pk.cell,first:true,painted:{},lastReg:pk.reg||null};
  if(BM.drag.paint||bmZoomed()){try{sv.setPointerCapture(e.pointerId);}catch(x){}}
  if(BM.drag.paint)bmPaintAt(pk);});
 sv.addEventListener('pointermove',function(e){
  var p=at(e),D=BM.drag;
  if(D){var dx=p[0]-D.x,dy=p[1]-D.y;if(Math.hypot(dx,dy)>4)D.moved=true;
   if(D.paint){var pk=bmPick(p[0],p[1]);if(pk.cell)bmPaintAt(pk);if(pk.reg)D.lastReg=pk.reg;return;}
   /* a drag moves an opened view; the whole body has nowhere to go */
   if(D.moved&&bmZoomed()){BM.camT=null;BM.cam.x=D.cx-dx/BM.cam.z;BM.cam.y=D.cy-dy/BM.cam.z;BM.dirty=true;}
   return;}
  var pk=bmPick(p[0],p[1]);
  BM.hoverReg=pk.reg||null;BM.hoverCell=pk.cell||null;
  if(pk.sab&&!pk.place&&pk.sab.nm!==BM.hoverSab){BM.hoverSab=pk.sab.nm;BM.traceT0=performance.now();}
  if(!pk.sab&&BM.hoverSab&&BM.hoverFrom!=='rail')BM.hoverSab=null;
  BM.hoverFrom='map';
  BM.hoverPlace=pk.place||null;BM.hoverView=pk.v;
  var tk=pk.place?'p'+BMG.places.indexOf(pk.place)+':'+pk.v:pk.sab?'s'+pk.sab.nm:'';
  if(tk!==BM.tipKey){BM.tipKey=tk;
   if(pk.place)bmTip(Object.assign(bmPlaceTip(pk.place),{x:p[0],y:p[1]}));
   else if(pk.sab)bmTip({t:pk.sab.nm,b:(pk.sab.dir>0?'Loading':'Releasing')+', at a weight of '+pk.sab.T.toFixed(1)+'.',x:p[0],y:p[1]});
   else bmTip(null);}
  BM.dirty=true;});
 sv.addEventListener('pointerleave',function(){
  BM.hoverReg=null;BM.hoverCell=null;BM.hoverPlace=null;if(BM.hoverFrom!=='rail')BM.hoverSab=null;
  BM.tipKey='';bmTip(null);BM.dirty=true;});
 sv.addEventListener('pointercancel',function(){BM.drag=null;});
 sv.addEventListener('pointerup',function(e){
  var D=BM.drag;BM.drag=null;if(!D)return;
  var p=at(e);
  if(D.paint){if(D.lastReg)bmOpenReg(D.lastReg,false);return;}
  if(D.moved)return;
  if(D.seat){var k=D.seat.getAttribute('data-seat');PMPICK=(PMPICK===k)?null:k;pmAnswer(PMPICK);return;}
  var pk=bmPick(p[0],p[1]);
  if(pk.sab&&!pk.place){var o=pk.sab.o, same=(bmHoldNm()===o.nm);
   PMPICK=same?null:o;S.pin=PMPICK;BM.traceT0=performance.now();pmAnswer(PMPICK);return;}
  if(pk.reg)bmOpenReg(pk.reg,true);});
 sv.addEventListener('dblclick',function(e){var p=at(e),pk=bmPick(p[0],p[1]);if(pk.reg)bmZoomReg(pk.reg);});
 sv.addEventListener('wheel',function(e){e.preventDefault();var p=at(e),w=bmS2W(p[0],p[1]);
  var z=clamp(BM.cam.z*Math.pow(1.0015,-e.deltaY),BM.z0*0.8,BM.z0*8);
  BM.camT=null;BM.cam.z=z;BM.cam.x=w[0]-(p[0]-BM.W/2)/z;BM.cam.y=w[1]-(p[1]-BM.H/2)/z;BM.dirty=true;bmBars();},{passive:false});}
/* one press paints at the brush, and the same press on a cell already at the
   brush clears it. No second step. */
function bmPaintAt(pk){var c=pk.cell,D=BM.drag,key=c.v+':'+c.i;if(D.painted[key])return;D.painted[key]=1;
 var cur=BM.paint[c.v][c.i];
 BM.paint[c.v][c.i]=(D.first&&cur===BM.brush)?0:BM.brush; D.first=false;
 bmRebuild(c.v);bmTouchHeat();bmMarkVals();BM.dirty=true;}
function bmZoomReg(r){var b=r.box,w=(b[2]-b[0])+8,h=(b[3]-b[1])+8,z=Math.min(BM.W/w,BM.H/h,BM.z0*6);
 if(BM.phone)BM.face=r.v?'back':'front';
 bmFlyTo((b[0]+b[2])/2+bmVX(r.v),(b[1]+b[3])/2,z);bmBars();}
/* A REGION ANSWERS IN SELECTION, where every press on this product answers.
   Pressing the open one again puts it down, as a seat and a pattern do. A
   paint stroke opens the region it ended on and never closes it, because
   painting is not a second press on the same thing. */
function bmOpenReg(r,toggle){
 var cur=bmSel();
 if(toggle&&cur&&cur.key===r.key){rdClose();return;}
 PMPICK={bmReg:r.key}; S.pin=null;
 bmRegionDrill(r); render();}

/* ---------- a region, read ----------
   What stands there, with its real weight, is the whole point of placing
   anything: the spec measured seat banding pulling 27 addresses for the trap
   where 2 stand there, and missing the four Solar addresses over the kidneys
   that the low back really holds. So this lists the addresses whose place is
   inside the region on its own surface, and nothing by seat.

   The symptom and pattern lines are PAINREG's nine, the only ones the engine
   has, reached through BMPAINMAP. Each of the 48 regions having its own, and
   practices tied to a region, are content nobody has written, so this says
   nothing about them rather than something invented. */
function bmRegionDrill(r){
 var G=BMG,b=r.box,v=r.v;
 var here=G.places.filter(function(p){var x=bmPlaceX(p,v);
  return bmSolidOn(p,v)&&x>=b[0]&&x<=b[2]&&p.y>=b[1]&&p.y<=b[3]&&bmIn(G,v,x,p.y);});
 var ids=[];here.forEach(function(p){p.ids.forEach(function(i){if(ids.indexOf(i)<0)ids.push(i);});});
 ids.sort(function(a,c){return (BY[c].sq||0)-(BY[a].sq||0);});
 var top=ids.length?(BY[ids[0]].sq||0):null;
 var through=BM.sabs.filter(function(s){var c=bmCable(s,v,BM.t);if(!c)return false;
  return c.samp.some(function(q){var x=q[0]-bmVX(v);return x>=b[0]&&x<=b[2]&&q[1]>=b[1]&&q[1]<=b[3];});});
 var pr=PAINREG.filter(function(p){return p.k===BMPAINMAP[r.nm];})[0]||null;
 var limb=BMLIMB.some(function(l){return v===0&&l[0]===r.nm&&l[1]===r.side;});
 var h='<div class="pm-eye">'+(v?'Back view':'Front view')+'</div>'
  +'<div class="pm-dn">'+esc(bmRegName(r))+'</div>'
  +'<div class="pm-dm">'+(r.nerve
    ?'A pain here runs along the '+esc(r.nerve.split(',')[0].toLowerCase())+' to the spine at '+r.level+'.'
    :'A pain here runs to the spine at '+(r.level||'its own level')+'.')+'</div>';
 /* the one limit this region's line has, said once */
 if(r.nm==='Trap')h+='<div class="pm-dm">The trap\'s own nerve, the accessory nerve, is not in the figure, '
  +'so its line runs along the cervical plexus beside it.</div>';
 /* painted at the brush's own level, one to ten, and printed bare: "7 of 10"
    is a count against a total, which he struck (CO-05) */
 h+='<div class="pm-grid"><span>painted</span><b>'+(r.val?r.val:'\u2013')+'</b>'
  +'<span>heaviest</span><b>'+(top?top.toFixed(1):'\u2013')+'</b></div>'
  +'<div class="pm-eye" style="margin-top:12px">Standing here</div>';
 if(ids.length)h+='<div class="pm-rows">'+ids.map(function(i){return addrRow(BY[i]);}).join('')+'</div>';
 else h+='<div class="pm-dm">No address stands here.'
  +(limb?' The dashed ring marks a proposed centre, and nothing in the reading stands on it.':'')+'</div>';
 if(through.length){
  h+='<div class="pm-eye" style="margin-top:12px">Running through here</div><div class="pm-list">'
   +through.map(function(s,i){return '<button type="button" class="pm-li" data-bmsab="'+i+'">'
    +'<i style="background:'+bmRgba(s.col,1)+'"></i><span class="pm-ln">'+esc(s.nm)+'</span>'
    +'<span class="pm-lw">'+s.T.toFixed(1)+'</span></button>';}).join('')+'</div>';}
 if(pr)h+='<div class="pm-eye" style="margin-top:12px">Commonly presents as</div>'
  +'<div class="pm-dm" style="color:var(--mid)">'+esc(pr.common)+'.</div>'
  +'<div class="pm-eye" style="margin-top:12px">The pattern under it</div>'
  +'<div class="pm-pat">'+esc(pr.pattern)+'</div>';
 h+='<button type="button" class="btn" id="bmzoom" style="margin-top:14px">Zoom into this region</button>';
 rdShell(h);
 var z=document.getElementById('bmzoom'); if(z)z.onclick=function(){bmZoomReg(r);};
 document.querySelectorAll('#rdrill [data-bmsab]').forEach(function(el){el.onclick=function(){
  var o=through[+el.getAttribute('data-bmsab')].o;
  PMPICK=o;S.pin=o;BM.traceT0=performance.now();pmAnswer(o);};});}

/* ---------- the controls, in the sub bar beside the layer row ----------
   The mode, the two open questions and the brush. The two questions are
   choices and not settings: Mark is question A with all three of its
   readings in view, Heat is the four switches with Isotherm on. Heat only
   shows in Pain, because in Pattern it changes nothing a person can see, and
   it is a menu because it has a measured default and he is confirming it
   rather than choosing blind. Written only when something in it changed,
   so a control keeps its focus under a keyboard. */
var BMSELSTY='min-height:44px;min-width:44px;max-width:100%;background:var(--panel-2);color:var(--ink);'
 +'border:1px solid var(--edge);border-radius:var(--r-xs);padding:8px 10px;font-family:var(--sans);font-size:13.5px;cursor:pointer';
function bmBars(){
 var rb=document.getElementById('rbar'); if(!rb||!BMG)return;
 var sel=bmSel(), zoomed=bmZoomed();
 var sig=[BM.mode,BM.variant,BM.amode,sel?sel.key:'',BM.phone,BM.face,zoomed].join('|');
 rb.style.display='flex';
 if(sig===rb.getAttribute('data-bmsig'))return;
 var foc=document.activeElement&&rb.contains(document.activeElement)?document.activeElement.id:null;
 var eye=function(t,f){return '<'+(f?'label for="'+f+'"':'span')+' class="pm-eye" style="align-self:center;margin:0 2px 0 8px">'+t+'</'+(f?'label':'span')+'>';};
 var btn=function(k,v,t,on){return '<button type="button" class="pm-lb'+(on?' on':'')+'" aria-pressed="'+!!on+'" data-'+k+'="'+v+'">'+t+'</button>';};
 var opt=function(v,t,on){return '<option value="'+v+'"'+(on?' selected':'')+'>'+esc(t)+'</option>';};
 /* a label and its control wrap as one. Loose, at 390 in Pain, Heat ended
    one line and its menu began the next, a label pointing at nothing */
 var grp=function(x){return '<span style="display:inline-flex;flex-wrap:wrap;align-items:center;gap:5px;max-width:100%">'+x+'</span>';};
 var h=btn('bmmode','pattern','Pattern',BM.mode==='pattern')+btn('bmmode','pain','Pain',BM.mode==='pain')
  /* question A's three readings as three buttons side by side, so all three
     are in view at once and none is hidden behind a menu: he is choosing
     between them by looking, and Fetter mark is only where the prototype
     opened, not an answer */
  +grp(eye('Mark')+BMAMODE.map(function(a){return btn('bmamode',a[0],a[1],BM.amode===a[0]);}).join(''));
 if(BM.mode==='pain')h+=grp(eye('Heat','bmvar')+'<select id="bmvar" style="'+BMSELSTY+'">'
  +['A','B','C','D'].map(function(k){return opt(k,BMVAR[k].nm,BM.variant===k);}).join('')+'</select>')
  +grp(eye('Brush','bmbrush')+'<input type="range" id="bmbrush" min="1" max="10" step="1" value="'+BM.brush
  +'" style="align-self:center;width:112px;accent-color:'+PMC.Sacral+'">'
  +'<span class="pm-eye" id="bmbrushv" style="align-self:center;min-width:2ch">'+BM.brush+'</span>'
  +btn('bmclear','1','Clear paint',false));
 h+=grp(eye('Region','bmreg')+'<select id="bmreg" style="'+BMSELSTY+'">'+opt('','Choose',!sel)
  +['front','back'].map(function(vn,v){return '<optgroup label="'+(v?'Back':'Front')+'">'
   +BMG.reg.filter(function(r){return r.v===v;}).sort(function(a,c){return a.cy-c.cy||a.cx-c.cx;})
    .map(function(r){return opt(r.key,bmRegName(r),sel&&sel.key===r.key);}).join('')+'</optgroup>';}).join('')+'</select>');
 if(BM.phone)h+=btn('bmface','front','Front',BM.face==='front')+btn('bmface','back','Back',BM.face==='back');
 if(zoomed)h+=btn('bmwhole','1','Whole body',false);
 rb.innerHTML=h; rb.setAttribute('data-bmsig',sig);
 rb.querySelectorAll('[data-bmmode]').forEach(function(el){el.onclick=function(){
  bmSetMode(el.getAttribute('data-bmmode'));BM.stillKey='';bmBars();};});
 rb.querySelectorAll('[data-bmamode]').forEach(function(el){el.onclick=function(){
  BM.amode=el.getAttribute('data-bmamode');BM.dirty=true;bmBars();};});
 var vr=document.getElementById('bmvar');
 if(vr)vr.onchange=function(){BM.variant=vr.value;BM.stillKey='';BM.litKey='';BMG.heat[0]._k=BMG.heat[1]._k='';
  /* replay the switch, so the difference is seen and not only set */
  if(BM.mode==='pain'){BM.pg=0;BM.ph=0;BM.mode='pattern';bmSetMode('pain');}bmBars();};
 var br=document.getElementById('bmbrush');
 if(br)br.oninput=function(){BM.brush=+br.value;var o=document.getElementById('bmbrushv');if(o)o.textContent=br.value;};
 rb.querySelectorAll('[data-bmclear]').forEach(function(el){el.onclick=function(){
  BM.paint[0].fill(0);BM.paint[1].fill(0);bmRebuild(0);bmRebuild(1);bmTouchHeat();bmMarkVals();BM.dirty=true;
  var s=bmSel();if(s)bmRegionDrill(s);};});
 var rg=document.getElementById('bmreg');
 if(rg)rg.onchange=function(){var r=BMG.reg.filter(function(x){return x.key===rg.value;})[0];
  if(!r){rdClose();return;}
  if(BM.phone&&BM.face!==(r.v?'back':'front')){BM.face=r.v?'back':'front';var f=bmFitCam();bmFlyTo(f.x,f.y,f.z);}
  bmOpenReg(r,false);};
 rb.querySelectorAll('[data-bmface]').forEach(function(el){el.onclick=function(){
  BM.face=el.getAttribute('data-bmface');var f=bmFitCam();bmFlyTo(f.x,f.y,f.z);BM.stillKey='';bmBars();};});
 rb.querySelectorAll('[data-bmwhole]').forEach(function(el){el.onclick=function(){
  var f=bmFitCam();bmFlyTo(f.x,f.y,f.z);bmBars();};});
 if(foc){var back=document.getElementById(foc);if(back)back.focus();}}

/* THE GROUND UNDER THE FIGURE, read off the host and never off the lighting's
   name, the way pmPal reads it. Dark: the canvas leaves its stage clear and
   the lighting's own ground shows. Light: the canvas carries the dark stage. */
function bmGround(host){
 for(var n=host;n&&n.nodeType===1;n=n.parentElement){
  var m=/rgba?\(([^)]+)\)/.exec(getComputedStyle(n).backgroundColor||'');
  if(!m)continue;var c=m[1].split(',').map(parseFloat);
  if(c.length>3&&!(c[3]>=0.999))continue;
  return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.5?BMC.stage:null;}
 return null;}
function bmBuild(host){
 host.innerHTML='<div class="pm-well">'
  +'<canvas id="bmcv" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>'
  +'<svg class="pm-svg" id="bmsv" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" '
  +'aria-label="The body, front and back, with its nerves, the seven seats, the addresses and the lines running between them">'
  +'<g class="pm-vec"><path d="'+bmOutline()+'" fill="none" stroke="'+bmRgba(BMC.edge,1)+'" stroke-opacity=".2" '
  +'stroke-width="1.1" vector-effect="non-scaling-stroke" pointer-events="none"/></g>'
  +'<g data-bmseats=""></g></svg></div>';
 BM.well=host.querySelector('.pm-well'); BM.cv=document.getElementById('bmcv'); BM.sv=document.getElementById('bmsv');
 BM.ctx=BM.cv.getContext('2d');
 BM.still=document.createElement('canvas');BM.sctx=BM.still.getContext('2d');
 BM.lit=document.createElement('canvas');BM.lctx=BM.lit.getContext('2d');
 BM.lit2=document.createElement('canvas');BM.l2ctx=BM.lit2.getContext('2d');
 BM.W=0;BM.H=0;BM.vb='';BM.ta='';BM.stillKey='';BM.litKey='';
 bmWire();}

/* ---------- the entry, from renderMap ---------- */
function bmRender(r){
 var host=document.getElementById('emap'); if(!host)return;
 bmInit(host);
 if(!BM.cv||!host.contains(BM.cv))bmBuild(host);
 /* the paint belongs to the profile it was painted on */
 var who=(typeof CURP!=='undefined')?CURP:null;
 if(!BM.paint||BM.who!==who||BM.whoI!==S.who){
  BM.paint=[new Float32Array(BMCOLS*BMROWS),new Float32Array(BMCOLS*BMROWS)];
  BM.who=who;BM.whoI=S.who;bmRebuild(0);bmRebuild(1);}
 BM.r=r; bmSabRefresh(r); bmMarkVals();
 var seats=flSeats(),speed=flSpeed(),loadedTot=W.filter(function(n){return n.sq>=LOADED;}).length;
 var stop=null;seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var dom=seats.slice().sort(function(a,b){return b.hot-a.hot||b.load-a.load;})[0];
 bmSeats(seats);
 pmLayerBar(r); bmBars();
 /* THE SHELF IS FLOW'S, and renderShelf names its layer out of PML, which
    does not carry the map. What it prints for Flow is the head and the seven
    seats and nothing that belongs to a layer, which is this layer's shelf
    exactly, so it is asked as Flow for the length of the call. */
 var was=PMLAYER; PMLAYER='nerves';
 try{renderShelf(r,seats,speed,stop,dom,loadedTot,[]);}finally{PMLAYER=was;}
 /* the rail's Running list is this map's list of lines: pointing at a row
    traces its line here, and pressing one holds it, because ui.js pins it */
 document.querySelectorAll('#fire .run-it').forEach(function(el){
  var nm=((el.querySelector('.run-n')||{}).textContent||'').trim();
  el.onpointerenter=function(){BM.hoverSab=nm;BM.hoverFrom='rail';BM.traceT0=performance.now();
   bmSabRefresh(BM.r);BM.dirty=true;};
  el.onpointerleave=function(){if(BM.hoverSab===nm)BM.hoverSab=null;BM.hoverFrom='';BM.dirty=true;};});
 BM.stage=bmGround(host); BM.stillKey=''; BM.dirty=true;
 if(!BM.ctx)return;          /* no canvas: the outline and the seats stand alone */
 if(!BM.raf){BM.last=0;BM.raf=requestAnimationFrame(bmFrame);}}
