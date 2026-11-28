
/* ============================================================
   ANALYTICS. Squares. Area is magnitude, colour is seat or tier, and
   the biggest square is the biggest thing. Line charts answered nothing
   about a single session; packed circles came next and read ratio by
   radius, which a glance gets wrong. 27 November, his ruling on the
   strip down: every chart on the page is the same squarified treemap,
   seven equal boxes, and the hero, the seven stat boxes, the readings
   row, the grid, the chain and the shut list are gone.
   ============================================================ */
var ANA_PICK=null;
/* THE TWO WAYS, 21 November, his own words on the decision: "add an option
   for both ways, 100% meaning the whole and a percent based off of the
   individual item, and I'll figure out which one I like better." Neither
   replaces the other; a person switches between them on the archetype
   circle alone, and the choice lives here for the session, the same way
   ANA_PICK above does, never in the record (switching how a number is
   shown is not a thing a person entered). 'expr' is archExpr, the archetype
   against itself, 100% with nothing held, what this chart already printed.
   'share' is affinityShare, the twelve against each other instead of
   against the strongest, so they sum to 100% like a real competition. */
var ANA_ARCHMODE='expr';
/* ONE PLACE BUILDS THE TWELVE ITEMS FOR EITHER MODE, so the toggle changes
   which figure is the headline and never changes which twelve cells are
   drawn or how the heaviest one is picked out in gold. */
function anaArchItems(r){
 var aff=r.aff||[], share=(typeof affinityShare==='function')?affinityShare():null;
 return ARCH.map(function(a,i){
  var lean=aff[i]||0, ex=archExpr(i), isTop=(i===r.pi), c=isTop?GOLD:PAL['3rd Eye'];
  if(ANA_ARCHMODE==='share'){
   var sh=share?share[i]:0;
   /* sized by the share itself here, so the twelve areas actually read as
      twelve pieces of one whole, the way the mode's own name promises */
   return {k:'arch',nm:a.nm,v:Math.max(0.4,sh*10),f:fmtPct('archshare',sh),
    h:(ex!=null?'expressed '+fmtPct('archetype',ex):''),c:c};}
  /* 'expr' is exactly what this chart already drew: sized by the lean,
     which orders them, printing how fully each is expressed */
  return {k:'arch',nm:a.nm,v:Math.max(0.4,lean*10),f:fmtPct('archetype',ex),c:c};});}
/* THE TOGGLE ITSELF. It went in on 21 November as two labelled tabs in a
   row of their own, and lost its only caller when the treemap replaced the
   archetype circle (46cfed63), so the choice he asked to compare could no
   longer be made at all. Revived 27 November inside the Archetypes box's
   own header row, as two 44 pixel icon presses, because a row of its own
   made that one box taller than Masks and Domains beside it and the seven
   boxes are square and equal. Symbol first, 16 November: a plain ring is
   one archetype against itself, a ring cut into slices is the twelve as
   one whole, and the name and its sentence are the tip (ui/tip.js). */
var ANA_ARCHTAB=[
 ['expr','Each archetype','This archetype’s own expression, 100% with nothing held at its point. The twelve do not add up to 100.'],
 ['share','All twelve','Each archetype’s share of all twelve added together, so the twelve sum to 100%, the way a competition’s results do.']];
var ANA_ARCHIC={expr:'<circle cx="12" cy="12" r="8"/>',
 share:'<circle cx="12" cy="12" r="8"/><path d="M12 12V4M12 12l6.93 4M12 12l-6.93 4"/>'};
function anaArchTabsHtml(){
 return '<div class="ana-seg" role="tablist" aria-label="How the archetype percent is read">'
  +ANA_ARCHTAB.map(function(v){var on=ANA_ARCHMODE===v[0];
   return '<button type="button" role="tab" aria-selected="'+on+'" class="ana-sg'+(on?' ana-on':'')+'" '
    +'data-anamode="'+v[0]+'" data-tip-t="'+esc(v[1])+'" data-tip="'+esc(v[2])+'" aria-label="'+esc(v[1]+'. '+v[2])+'">'
    +anaTmIconSvg(ANA_ARCHIC[v[0]],22)+'</button>';}).join('')
  +'</div>';}
function anaHist(){
 var h=(CURP&&CURP.history)||[];
 return h.slice().sort(function(a,b){return new Date(a.t)-new Date(b.t);});}
/* ============================================================
   THE SQUARIFIED TREEMAP. Masks, Domains and Archetypes, round
   <ana-squarified-treemap>, his approval on Mockup C (the version with a
   release afterglow and Source AI's own cross-linked receipts), replacing
   the circle packing for these three charts. On 27 November What is
   running, the nine axes, the seven points and the Laws of Moral Integrity
   joined them, his ruling, so the circle packer and its field went with
   their last callers. The running-hot list is its own thing, see anaHot.

   AREA IS THE FIGURE, NOT A RADIUS. anaPack sizes a circle by sqrt(value)
   against a fixed area budget, which is honest about ordering and dishonest
   about ratio: a circle twice the value is not twice the area a glance
   reads it as. A rectangle whose area is literally proportional to v does
   not have that gap, which is the whole case for a treemap over a bubble
   chart on this exact page.

   THE ALGORITHM IS SQUARIFIED, Bruls, Huizing and van Wijk, 2000: split the
   remaining items into a row (or column, whichever side is shorter) that
   keeps every rectangle in it as close to square as the worst ratio allows,
   lay that strip down, and recurse on what is left. Ported from
   mockup-C-release.html's own squarify()/squarifyRows(), unchanged in its
   arithmetic.

   THE FLOOR IS THE PRODUCT'S OWN --tap TOKEN (shell/head.html, 44px), read
   off the page rather than typed a second time, and the capping pass that
   holds every cell at or above it is ported from mockup-D-phone.html's own
   layoutFloored()/cappedAreas(), the one the mockup's own D-check.js
   measured passing at a real 390px width before this port. A cell lifted
   to the floor wears a hatch (never a plain fill), so its size reads as
   "the smallest you can press" and not as its real share: the same promise
   the running-hot list's badge already keeps elsewhere on this page. This
   is also requirement 7 answered structurally rather than by a special
   case: a nought-charge cell gets exactly the same floor as every other
   cell, because the floor runs on every cell's area, not on whether that
   area happens to be nought.

   THE MOVE. Nothing here is a new animation system. anaRender() already
   tears down and rewrites the whole #ana div on every press and every
   render; a selection click does not change any item's v, so the layout it
   produces is bit-for-bit the one already on screen and the FLIP below is
   a no-op. A real release changes compute()'s own numbers (a mask's load,
   an archetype's expression; a domain's box never moves, because a domain
   here is a selection out of the blueprint and not a measurement, per the
   comment this replaced above), and only then does a cell's rectangle
   actually move, which is exactly when the FLIP and the afterglow have
   something true to show. Timings ported unchanged from mockup-C-release's
   own switchTo()/ghosts(): 420ms cubic-bezier(.22,1,.36,1) for the move,
   4000ms linear for the afterglow's fade. A pure resize (the window, not
   the record) repaints with neither: see the `animate` argument below. */
var ANA_TM_RM=(typeof matchMedia==='function')&&(function(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}());
var ANA_TM_EASE='cubic-bezier(.22,1,.36,1)';
var ANA_TM_PREV={};
var ANA_TM_RO=null;
/* THE SIZE EACH LENS WAS LAST PAINTED AT. ResizeObserver calls back once for
   every element the moment it is observed, whatever its size, and anaTmPaint
   re-observes the boxes after every paint, so the first cut repainted every
   40ms for as long as the page was open: measured, a cell detached from the
   document under a pointer before a click could land on it. The callback now
   repaints only when a box's measured size is not the one it was painted at. */
var ANA_TM_SIZE={};
/* SEVEN LENSES, NO SUBTITLE, 27 November. Each carried a grey line under
   its header saying how to read it, which he struck with the rest of the
   page's prose: what a cell is, is on that cell's own hover. The order is
   the order the boxes are laid in, three, three and the laws across. */
var ANA_TM_LENSES=[
 {k:'mask',nm:'Masks'},
 {k:'dom',nm:'Domains'},
 {k:'arch',nm:'Archetypes'},
 {k:'chain',nm:'What is running'},
 {k:'axis',nm:'The nine axes'},
 {k:'seat',nm:'The seven assemblage points'},
 {k:'law',nm:'Laws of Moral Integrity'}];
/* the product's own tap floor, read off the page and not typed here a
   second time; 44 only if the token itself cannot be read at all */
function anaTmFloor(){
 try{var v=getComputedStyle(document.documentElement).getPropertyValue('--tap'), n=parseFloat(v);
  if(n>0)return n;}catch(e){}
 return 44;}
/* ---- squarified layout, unchanged arithmetic from mockup-C-release.html ---- */
function anaTmWorst(areas,side){
 var sum=0,mx=-Infinity,mn=Infinity;
 areas.forEach(function(a){sum+=a; if(a>mx)mx=a; if(a<mn)mn=a;});
 var s2=side*side;
 return Math.max((s2*mx)/(sum*sum),(sum*sum)/(s2*mn));}
function anaTmRows(toks,areas,x,y,w,h){
 if(!toks.length)return [];
 if(toks.length===1)return [{i:toks[0],x:x,y:y,w:w,h:h}];
 var side=Math.min(w,h), row=[areas[0]], ri=[toks[0]], k=1;
 while(k<areas.length){
  var trial=row.concat([areas[k]]);
  if(anaTmWorst(trial,side)<=anaTmWorst(row,side)){row=trial; ri.push(toks[k]); k++;}
  else break;}
 var rowSum=row.reduce(function(a,b){return a+b;},0), rects=[];
 if(w>=h){
  var stripW=rowSum/h, yy=y;
  ri.forEach(function(tk,j){var ih=row[j]/stripW; rects.push({i:tk,x:x,y:yy,w:stripW,h:ih}); yy+=ih;});
  rects=rects.concat(anaTmRows(toks.slice(ri.length),areas.slice(ri.length),x+stripW,y,w-stripW,h));
 }else{
  var stripH=rowSum/w, xx=x;
  ri.forEach(function(tk,j){var iw=row[j]/stripH; rects.push({i:tk,x:xx,y:y,w:iw,h:stripH}); xx+=iw;});
  rects=rects.concat(anaTmRows(toks.slice(ri.length),areas.slice(ri.length),x,y+stripH,w,h-stripH));
 }
 return rects;}
/* ---- the floor, unchanged arithmetic from mockup-D-phone.html ---- */
function anaTmCapped(nat,need,A){
 var n=nat.length, fixed=nat.map(function(){return false;}), areas=nat.slice();
 for(var guard=0;guard<n+1;guard++){
  var room=A, free=0;
  for(var i=0;i<n;i++){if(fixed[i])room-=need[i]; else free+=nat[i];}
  if(room<=0||free<=0){var s=need.reduce(function(a,b){return a+b;},0); return need.map(function(x){return x/s*A;});}
  var sc=room/free, more=false;
  for(var j=0;j<n;j++){
   if(fixed[j]){areas[j]=need[j]; continue;}
   areas[j]=nat[j]*sc;
   if(areas[j]<need[j]){fixed[j]=true; more=true;}}
  if(!more)return areas;}
 return areas;}
function anaTmLayout(items,W,H){
 var A=Math.max(1,W*H), total=0, floor=anaTmFloor(), aim=floor+0.5;
 items.forEach(function(it){total+=Math.max(0,it.v||0);});
 var nat=items.map(function(it){return total>0?Math.max(0,it.v||0)/total*A:A/items.length;});
 var need=items.map(function(){return aim*aim;});
 var rects=[], areas=[];
 for(var pass=0;pass<120;pass++){
  areas=anaTmCapped(nat,need,A);
  var order=items.map(function(_,i){return i;}).sort(function(a,b){return areas[b]-areas[a]||a-b;});
  rects=anaTmRows(order,order.map(function(i){return areas[i];}),0,0,W,H);
  var bad=false;
  rects.forEach(function(rc){
   var m=Math.min(rc.w,rc.h);
   if(m<aim){bad=true; need[rc.i]=Math.max(need[rc.i],areas[rc.i]*(aim/m)*1.02);}});
  if(!bad)break;}
 var out={};
 rects.forEach(function(rc){out[items[rc.i].nm]={x:rc.x,y:rc.y,w:rc.w,h:rc.h,floored:nat[rc.i]<floor*floor};});
 return out;}
/* ---- the real items, one lens at a time. Masks read r.maskRing's own
   average, domains read the blueprint's selection (9 for in, 2 for out,
   never a charge), archetypes read whichever of the two ways the toggle
   has. The four that were packed circles until 27 November carry exactly
   the figure each circle was sized by, never a new metric: a pattern's
   weight, an axis's held charge, a point's count of held addresses, and a
   law's own reading. ---- */
/* OPEN, NOT DECIDED HERE: masks and archetypes are not a true partition of
   one whole the way a share is, so area-by-value overstates that for those
   two lenses; whether they need an honest-geometry note is the owner's call. */
function anaTmItems(r,k){
 var out=anaTmItemsOf(r,k);
 /* NOTHING READ, SO NO FIGURE, round J13, carried from the circles: the
    cells keep the size the blueprint gives them and lose the figure. A
    domain prints no figure at all, so it has none to lose. */
 if(r.unread&&k!=='dom')out.forEach(function(it){it.f=PCT_DASH; it.un=true;});
 return out;}
function anaTmItemsOf(r,k){
 if(k==='mask')return (r.maskRing||[]).map(function(m){
  return {nm:m.nm,v:m.w,f:fmtPct('weight',m.w),c:seatCol((m.bands||['Heart'])[0]),bands:m.bands};});
 if(k==='dom')return S.doms.map(function(di){var d=DOMAINS[di];
   return {nm:d.nm,v:9,c:rootPlain(d.r),sel:true};})
  .concat(DOMAINS.filter(function(d,i){return S.doms.indexOf(i)<0;}).slice(0,9)
   .map(function(d){return {nm:d.nm,v:2,c:rootPlain(d.r),sel:false};}));
 if(k==='arch')return anaArchItems(r).map(function(it,i){it.lead=(i===r.pi); return it;});
 /* THE SIXTEEN HEAVIEST, NOT THE FIRST SIXTEEN, round RB: the list is in
    ring order, so a cut at sixteen on a deep chain took no saboteur at all.
    The kind's own colour at every weight, 17 October: a cell printing a
    percent never takes the alarm. The table is built here and not once at
    load, because PAL is the lighting in force and a lighting swaps it. */
 if(k==='chain'){var T={sup:PAL.Root,hy:PAL.Sacral,cx:PAL.Solar,sab:PAL.Throat};
  return [].concat(r.sups,r.hys,r.cxs,r.sabs).sort(function(a,b){return b.w-a.w;}).slice(0,16)
   .map(function(o){return {nm:o.nm,v:o.w,f:fmtPct('chain',o.w),c:T[o.kind]||PAL.Throat,kind:o.kind};});}
 if(k==='axis')return CHILD.map(function(c){var v=S.charge[c.nm]||0;
  return {nm:c.nm,v:v,f:fmtPct('charge',v),c:seatCol(c.seat)};});
 /* a count of held addresses, so it prints as a count */
 if(k==='seat')return flSeats().map(function(s){var b=K2B[s.p.k];
  return {nm:s.p.n,v:s.hot,f:s.hot?s.hot+' held':PCT_DASH,c:seatCol(b),band:b};});
 /* SIZED BY ITS OWN READING, so the area is the percent the cell prints.
    An unanswered law is drawn at nought and prints the dash: the seed 6 it
    sits at is not an answer, and the unanswered count under the boxes says
    how many there are. */
 if(k==='law')return SI.map(function(l){var read=lawIn(l.nm), v=read?S.law[l.nm]:0;
  return {nm:l.nm,v:v,f:read?fmtPct('law',v):PCT_DASH,c:seatCol(l.b),unans:!read,
   say:(typeof lawMeaning==='function'&&lawMeaning(l.nm))||'',shut:read&&v<4};});
 return [];}
/* each lens's own mark for an item, read off the table that already owns
   it: the chain's kind (CHAINGLYPH, ui/component.js), the axis's and the
   law's own icon, and the seat's glyph (SEATGLYPH, engine/data/canon.js) */
function anaTmIconPath(k,it){
 var nm=it&&it.nm, of=function(T){var x=T.filter(function(y){return y.nm===nm;})[0]; return x?x.ic:'';};
 if(k==='mask')return of(MASKS);
 if(k==='dom')return of(DOMAINS);
 if(k==='chain')return (it&&CHAINGLYPH[it.kind])||'';
 if(k==='axis')return of(CHILD);
 if(k==='seat')return (it&&SEATGLYPH[it.band])||'';
 if(k==='law')return of(SI);
 return of(ARCH);}
/* SEATGLYPH holds finished markup and every other table holds a path's d,
   so a mark that already starts with a tag goes in as it is. Wrapped in a
   path it drew nothing: a d of "<path d=..." is not a path. */
function anaTmIconSvg(d,size){
 if(!d)return '';
 return '<svg class="ana-tm-ic" style="width:'+size+'px;height:'+size+'px" viewBox="0 0 24 24" aria-hidden="true">'
  +(d.charAt(0)==='<'?d:'<path d="'+d+'"/>')+'</svg>';}
function anaTmFits(nm,fs,w){return nm.length*fs*0.56<=w;}
/* symbol first, header second, body text third (16 November): the icon is
   never dropped before the name, and the figure is the last thing to go
   as the cell gets smaller */
function anaTmLabel(it,k,w,h){
 var pad=6, iw=Math.max(0,w-2*pad), room=Math.min(iw,h-2*pad);
 if(room<15)return '';
 var d=anaTmIconPath(k,it), out='';
 if(room>=56){
  out+=anaTmIconSvg(d,Math.max(16,Math.min(24,room*0.26)));
  if(anaTmFits(it.nm,12.5,iw))out+='<b class="ana-tm-nm">'+esc(it.nm)+'</b>';
  if(it.f!==undefined)out+='<i class="ana-tm-v">'+esc(it.f)+'</i>';
 }else if(room>=32){
  out+=anaTmIconSvg(d,16);
  if(anaTmFits(it.nm,11,iw))out+='<b class="ana-tm-nm" style="font-size:11px">'+esc(it.nm)+'</b>';
  /* 11, not 10.5: tests/design.js gate 4 holds every type at 11 or over */
  else if(it.f!==undefined)out+='<i class="ana-tm-v" style="font-size:11px">'+esc(it.f)+'</i>';
 }else{
  out+=anaTmIconSvg(d,Math.max(12,Math.min(18,room*0.6)));
 }
 return out;}
function anaTmCellHtml(k,it,L){
 var box=L[it.nm]; if(!box)return '';
 var nil=!(it.v>0), on=!!(ANA_PICK&&ANA_PICK.k===k&&ANA_PICK.nm===it.nm);
 var dim=!!(ANA_PICK&&ANA_PICK.k===k&&!on);
 /* THE MEANING IS ON THE HOVER, NEVER ON THE FACE, 27 November: the key
    row under the boxes and the colour key on What is running went with
    the rest of the page's prose, so what a mark means rides here. A cell
    with nothing read says so and not "nothing held", which is a reading. */
 var tip=it.nm+(it.un?', not read yet':it.unans?', not answered yet'
   :it.f!==undefined?', '+(it.f===PCT_DASH?'nothing held':it.f):'')
  +(it.kind&&ANA_KIND[it.kind]?', '+ANA_KIND[it.kind][0]:'')
  +(it.shut?', shut':'')
  +(it.lead?', your primary':'')+(it.sel?', selected in your blueprint':'')
  +(box.floored?', drawn at the smallest pressable size':'')
  +(!it.un&&it.h?'. '+it.h:'')+(it.say?'. '+it.say:'');
 return '<button type="button" class="ana-tm-cell'+(nil?' nil':'')+(on?' on':'')+(dim?' dim':'')
  +(box.floored?' floored':'')+'" aria-pressed="'+on+'" '
  +'style="left:'+box.x.toFixed(2)+'px;top:'+box.y.toFixed(2)+'px;width:'+box.w.toFixed(2)+'px;height:'+box.h.toFixed(2)+'px;--lc:'+it.c+'" '
  +'data-ana="'+esc(k+'|'+it.nm)+'" data-lens="'+k+'" data-nm="'+esc(it.nm)+'" '
  +'title="'+esc(tip)+'" aria-label="'+esc('Open '+tip)+'">'
  +'<span class="ana-tm-in"><span class="ana-tm-fill" style="background:'+it.c+';opacity:'
   +(nil?0.12:(0.20+0.5*Math.min(1,(it.v||0)/9))).toFixed(2)+'"></span>'
  +(box.floored?'<span class="ana-tm-hatch" aria-hidden="true"></span>':'')
  +'<span class="ana-tm-hl" aria-hidden="true"></span><span class="ana-tm-lab">'+anaTmLabel(it,k,box.w,box.h)+'</span></span>'
  +'<span class="ana-tm-ring" aria-hidden="true"></span><span class="ana-tm-lit" aria-hidden="true"></span>'
  +(it.sel?'<span class="ana-tm-mark sel" aria-hidden="true"></span>':'')
  +(it.lead?'<span class="ana-tm-mark lead" aria-hidden="true"></span>':'')
  +'</button>';}
/* the lens header. ITS OWN NAME IS A DOOR TOO: a press opens the heaviest
   real item in that lens straight through the same data-ana pipeline every
   cell uses, "the whole-lens parent read" answered with a real thing
   rather than an invented aggregate kind engine/insight.js has never heard
   of. A domain's own "heaviest" is whichever selected domain sorts first;
   domains carry no measured figure to be heavy by, so this is the clearest
   true reading available for that lens's own door.

   NO FIGURE ON THE HEADER, 27 November. "Masks 50%" read as a total for
   the lens and was the heaviest item's own figure, which the cell itself
   already prints. The header names the lens and says on its title which
   item it opens. */
function anaTmHeadHtml(lens,top,openCls){
 return '<button type="button" class="ana-tm-head" aria-pressed="'+!!openCls+'" data-ana="'+esc(lens.k+'|'+top.nm)+'" '
   +'title="'+esc('Open the largest in '+lens.nm+': '+top.nm)+'">'
  +anaTmIconSvg(anaTmIconPath(lens.k,top),20)
  +'<span class="ana-tm-nm2">'+esc(lens.nm)+'</span>'
  +'<svg class="ana-tm-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';}
function anaTmLensHtml(r,lens,items){
 var top=items.reduce(function(a,x){return (x.v||0)>(a.v||0)?x:a;},items[0]||{v:0,nm:''});
 var openCls=(ANA_PICK&&ANA_PICK.k===lens.k)?' open':'';
 var head=anaTmHeadHtml(lens,top,openCls);
 /* the archetype toggle shares the header's row, so this box is exactly
    as tall as the two beside it */
 if(lens.k==='arch')head='<div class="ana-tm-hrow">'+head+anaArchTabsHtml()+'</div>';
 return '<div class="ana-tm-lens'+openCls+'" data-lens-panel="'+lens.k+'">'+head
  +'<div class="ana-tm-box" data-lens-box="'+lens.k+'"></div></div>';}
/* A LENS WITH NOTHING TO LAY OUT keeps its box at the same size as every
   other, so the rows stay square and even. It carries no data-lens-box,
   which is what keeps anaTmPaint and the ResizeObserver off it: an empty
   box observed and never painted is measured as changed on every call. */
function anaTmStillHtml(lens,body){
 return '<div class="ana-tm-lens" data-lens-panel="'+lens.k+'"><div class="ana-tm-head ana-tm-still">'
  +'<span class="ana-tm-nm2">'+esc(lens.nm)+'</span></div>'
  +'<div class="ana-tm-box ana-tm-empty">'+body+'</div></div>';}
function anaTmHtml(r){
 var html={};
 ANA_TM_LENSES.forEach(function(lens){
  var k=lens.k;
  if(k==='mask'&&!lockSees('mask')){html[k]=anaTmStillHtml(lens,lockPanelHtml('mask',{brief:true}));return;}
  /* nothing of the chain is visible on this plan: the box says so rather
     than drawing an empty chain over a chain somebody has */
  if(k==='chain'&&r.locked&&r.locked.length===SEE_ORDER.length){html[k]=anaTmStillHtml(lens,lockPanelHtml('sab',{brief:true}));return;}
  var items=anaTmItems(r,k);
  if(k==='chain'&&!items.length){html[k]=anaTmStillHtml(lens,r.unread?'Not read yet.':'Nothing is running.');return;}
  html[k]=anaTmLensHtml(r,lens,items);});
 var row=function(ks,cls){return '<div class="ana-tm-row'+(cls||'')+'">'+ks.map(function(k){return html[k];}).join('')+'</div>';};
 /* THREE ROWS, 27 November, his ruling: Masks, Domains and Archetypes
    first, above the fold at 1600 by 1000, then the three that were
    circles, then the laws across the whole width at the same height. One
    column on a phone, every box still square (shell/head.html .ana-tm). */
 return '<div class="ana-tm">'+row(['mask','dom','arch'])+row(['chain','axis','seat'])+row(['law'],' ana-tm-wide')+'</div>';}
/* ---- paint: measures the real box, lays out, and (except on a plain
   resize) FLIPs every surviving cell from its last real rectangle to this
   one and draws the afterglow where one shrank. Ported timings, unchanged,
   from mockup-C-release.html's switchTo()/ghosts(). ---- */
function anaTmPaint(r,animate){
 if(animate==null)animate=true;
 ANA_TM_LENSES.forEach(function(lens){
  var box=document.querySelector('.ana-tm-box[data-lens-box="'+lens.k+'"]'); if(!box)return;
  var w=box.clientWidth,h=box.clientHeight; if(w<2||h<2)return;
  ANA_TM_SIZE[lens.k]=w+'x'+h;
  var items=anaTmItems(r,lens.k), L=anaTmLayout(items,w,h);
  var prev=ANA_TM_PREV[lens.k]||{};
  box.innerHTML=items.map(function(it){return anaTmCellHtml(lens.k,it,L);}).join('');
  if(animate&&!ANA_TM_RM){
   box.querySelectorAll('.ana-tm-cell').forEach(function(c){
    var nm=c.getAttribute('data-nm'), a=prev[nm], b=L[nm]; if(!a||!b)return;
    var dx=a.x-b.x, dy=a.y-b.y, sx=a.w/b.w, sy=a.h/b.h;
    if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5&&Math.abs(sx-1)<0.01&&Math.abs(sy-1)<0.01)return;
    try{c.animate([
     {transform:'translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px) scale('+sx.toFixed(4)+','+sy.toFixed(4)+')'},
     {transform:'none'}],{duration:420,easing:ANA_TM_EASE});}catch(e){}});
   /* the afterglow: a cell whose real figure came DOWN (not merely one whose
      pixels shrank on a resize, which this is never called for) keeps a
      thin outline at its old rectangle, its own colour, fading over 4
      seconds, exactly the promise ui/sound.js's own undo/redo latch keeps
      in sound: nothing is deleted, the record of where it was just fades */
   items.forEach(function(it){
    var a=prev[it.nm]; if(!a||a.v==null||!(it.v<a.v-1e-9))return;
    var g=document.createElement('span');
    g.className='ana-tm-ghost'; g.setAttribute('aria-hidden','true');
    g.style.cssText='left:'+a.x.toFixed(2)+'px;top:'+a.y.toFixed(2)+'px;width:'+a.w.toFixed(2)+'px;height:'+a.h.toFixed(2)+'px;--gc:'+it.c;
    box.appendChild(g);
    try{g.animate([{opacity:.9},{opacity:0}],{duration:4000,easing:'linear'}).finished.then(function(){g.remove();},function(){});}
    catch(e){g.remove();}});
  }
  var out={}; items.forEach(function(it){var b=L[it.nm]; if(b)out[it.nm]={x:b.x,y:b.y,w:b.w,h:b.h,v:it.v};});
  ANA_TM_PREV[lens.k]=out;
 });
 anaTmAttachResize();}
/* the window resizing is not a release: it repaints with no FLIP and no
   afterglow (the `false` below), matching mockup-C-release's own
   attachResize, which calls drawAll() plain on a resize and reserves
   switchTo()'s animated path for an actual snapshot change */
function anaTmAttachResize(){
 if(!ANA_TM_RO){
  if(typeof ResizeObserver==='function')
   ANA_TM_RO=new ResizeObserver(function(ents){
    if(!ents.some(function(en){var b=en.target;
     return ANA_TM_SIZE[b.getAttribute('data-lens-box')]!==b.clientWidth+'x'+b.clientHeight;}))return;
    clearTimeout(window.__anaTmRT);
    window.__anaTmRT=setTimeout(function(){try{anaTmPaint(computeSeen(),false);}catch(e){}},40);});
  else{
   addEventListener('resize',function(){
    clearTimeout(window.__anaTmRT2);
    window.__anaTmRT2=setTimeout(function(){try{anaTmPaint(computeSeen(),false);}catch(e){}},80);});
   ANA_TM_RO={observe:function(){},disconnect:function(){}};}}
 try{ANA_TM_RO.disconnect();}catch(e){}
 /* only a box that is painted: an empty or locked one has no data-lens-box,
    its size is never recorded, and observing it fired the callback forever */
 document.querySelectorAll('.ana-tm-box[data-lens-box]').forEach(function(b){try{ANA_TM_RO.observe(b);}catch(e){}});}
/* ---- the receipts: a mask or an archetype's headline in the Insight rail
   (ui/insightui.js's railInsight) carries data-src="kind:name" the same
   shape a treemap cell's own data-lens+data-nm makes; hovering or
   focusing either lights both in the cell's own colour (--lc), his words
   on Mockup C, "receipts". Delegated at the document so it survives every
   #ana and #insight rebuild without being rewired by hand. ---- */
function anaTmSrcKey(el){
 if(el.classList&&el.classList.contains('ana-tm-cell'))return el.getAttribute('data-lens')+':'+el.getAttribute('data-nm');
 var s=el.closest&&el.closest('[data-src]'); return s?s.getAttribute('data-src'):null;}
function anaTmLight(key,on){
 if(!key)return;
 document.querySelectorAll('.ana-tm-cell').forEach(function(c){
  if(c.getAttribute('data-lens')+':'+c.getAttribute('data-nm')===key)c.classList.toggle('lit',on);});
 document.querySelectorAll('[data-src]').forEach(function(s){
  if(s.getAttribute('data-src')===key)s.classList.toggle('lit',on);});}
function anaTmHover(e,on){
 var t=e.target.closest&&e.target.closest('.ana-tm-cell,[data-src]'); if(!t)return;
 anaTmLight(anaTmSrcKey(t),on);}
addEventListener('mouseover',function(e){anaTmHover(e,true);});
addEventListener('mouseout',function(e){anaTmHover(e,false);});
addEventListener('focusin',function(e){anaTmHover(e,true);});
addEventListener('focusout',function(e){anaTmHover(e,false);});
function anaRender(){
 var el=document.getElementById('ana'); if(!el)return;
 /* the reading this plan may see, ui/lock.js: the What is running box and
    the masks box are the tier's */
 var r=computeSeen(),H=anaHist();
 /* THE PAGE IS THE SEVEN BOXES, 27 November, his ruling on the strip down.
    Gone from above them: the coherence card and its sentence, the seven
    stat boxes, the paragraph under those. Gone from below: the readings
    row, Where it runs and its caption, The chain, and the list of shut
    laws, which the laws' own box now shows by size. The six reading cards
    (ANA_MET, anaMetCard) are still built and still tested, and no press on
    this page opens them any more; whether they get a new door or go is a
    later call, not made here. */
 var out='<div class="ana-wrap">'+anaTmHtml(r);
 /* THE COUNT IS lawIn's, the same test that puts the dash on a law's cell
    above, so the number here and the dashes there cannot disagree */
 var unm=SI.filter(function(l){return !lawIn(l.nm);}).length;
 if(unm)out+='<p class="sum-p" style="margin-top:12px"><b>'+unm+'</b> law'+(unm===1?' is':'s are')
  +' not answered yet. Answer them in Energetics.</p>';
 out+=anaHot(r);
 if(H.length>1){
  out+='<div class="pm-eye" style="margin-top:20px">'+H.length+' sessions</div>'
   /* HS sweep: a legend for the strip, and the needle warning said a second
      time on this surface. Each bar names its CQ and seat on its title. */
   +'<div class="ana-strip">';
  /* ESCAPED, ROUND RA: x.dark is a history row's own string, checked by the schema
     boundary for type only, not content (engine/schema.js); it lands in a title
     attribute here, where an unescaped quote breaks out of it. esc() closes that. */
  /* and a session is a button, round RB: its whole row opens in the trail,
     every figure the snapshot kept and how far each moved from the one before */
  H.forEach(function(x,i){out+='<button type="button" class="ana-px" data-ana="sess|'+i+'" title="'+(x.m===CQ_MODEL?'CQ ':'Historical CQ (model '+String(x.m)+', not comparable) ')+fmtPct('cq',x.cq)+', heaviest at the '+esc(String(x.dark).toLowerCase())
   +'"><u style="height:'+Math.max(6,Math.round(x.cq/100*50))+'px;background:'
   +seatCol(x.dark)+'"></u></button>';});
  out+='</div>';}
 out+='</div>';
 /* the record. every snapshot the profile carries, and the distance between
    any two of them. the data has been accruing since the rebuild. */
 out+='<div class="ab-f" id="rec"></div>';
 el.innerHTML=out;
 /* the treemap's own boxes are absolutely positioned against their real
    measured size, which the string above cannot know before it is in the
    document; this is the one JS pass that fills them in, real pixels, and
    the FLIP/afterglow it carries when something actually moved */
 try{anaTmPaint(r);}catch(e){}
 recRender();
 /* every press on this page and in its trail goes through one handler, at
    the foot of this file, round RB */
 anaDrill();}
/* ============================================================
   RUNNING HOT. GQ in TASKS.md, his words: "And the running hot, add that to
   analytics. Yeah, that's really, really good." The list sat beside the
   Field in the Fringe mockup, proto/field/tension/src/common.js, and it
   comes here on the same terms the shipped Field now bends by (ui/wheel.js,
   THE RING BENDS UNDER LOAD): past five, heaviest first, and which way each
   one last moved.

   A ROW OPENS THE ADDRESS. In the mockup a row flew the camera to it, and
   there is no camera on this surface. The row is the product's own address
   row, so it opens the same drill every other address row opens.

   TWELVE ROWS. A heavy field has fifty addresses past five, and fifty rows
   is a spreadsheet of feelings, which the badge rule in ui/component.js
   was written against. The Field draws every one.

   THE ROWS AND NOTHING ELSE, 27 November, the junk text sweep: the count
   sentence over the rows, the "twelve heaviest" line under them and the
   "No address is past five" paragraph are gone. What past five means is
   on the heading's hover. An unread field, or a field with nothing past
   five, prints no list at all, because a list of none is not a reading.
   ============================================================ */
const ANA_HOT_ROWS=12;
/* THE THREE WORDS ARE NOT ONE COLOUR. Collapsing is the opposite going in,
   and the fetter layer on the Field already draws what is installed in the
   Heart's colour, so it takes that, off the lighting in force when the row
   is drawn. Expanding is load arriving and reads at full ink. Steady is the
   absence of news and sits at the dim step. */
function anaHotInk(d){return d==='collapsing'?seatCol('Heart'):(d==='steady'?'var(--dim)':'var(--ink)');}
function anaHot(r){
 if(r.unread||typeof hotList!=='function')return '';
 var L=hotList(); if(!L.length)return '';
 return '<div class="ana-hot"><div class="pm-eye" style="margin-top:20px" data-tip-k="Running hot" '
  +'data-tip="Past five an address pulls more than half as hard as it can, and the ring on the Field bends under it.">'
  +'Running hot</div>'+anaHotRows(L)+'</div>';}
var ANA_DIRSAY={expanding:'Its charge rose on its last change.',
 collapsing:'Its charge fell on its last change.',
 steady:'It has not moved since this record was opened.'};
function anaHotRows(L){
 return ''
  /* HS sweep: a three sentence legend for the three direction words sat
     between the count and the rows. Each word now carries its own meaning as
     its title, and the colour of the word already separates the three. */
  +'<div class="ad-rows">'+L.slice(0,ANA_HOT_ROWS).map(function(n){var d=hotDir(n);
   return '<button type="button" class="ad-r" data-addr="'+n.i+'" data-ana="addr|'+n.i+'" data-dir="'+d+'" '
    +'title="Open '+esc(n.k)+'">'+crbNode(n,'sm')
    +'<span>'+esc(n.k)+'</span><em style="color:'+anaHotInk(d)+'" title="'+esc(ANA_DIRSAY[d]||'')+'">'+d+'</em></button>';}).join('')+'</div>';}
/* ============================================================
   THE TRAIL. Round RB, his words: "all the bubbles. I should be able to click
   on it and drill down deeper and trace all my patterns down to the fetters.
   ... If I click on any analytics, I want it to give me a summary on the
   right side."

   WHAT WAS HERE. A press on a bubble opened one card one level down and
   stopped: a hyper-complex jumped straight to its addresses, the complexes
   and saboteurs between were never shown, and nothing on the card could be
   pressed. Seven kinds of bubble had a card and nothing else on the page did.
   And it is where the line he read came from, "Built from 1 held addresses
   across Root": it counted every address under the pattern and called all of
   them held, which only the ones at 4 or more are.

   WHAT IT IS NOW. Every figure on this page and every row on a card is a
   door, and each door adds a step to a trail shown at the top of the card,
   so a person can go down and come back up the same way. The chain is the
   engine's own and nothing is invented here (engine/compute.js, compute):

     super-complex    two hyper-complexes running together
     hyper-complex    the complexes of one family
     complex          two saboteurs of one family
     saboteur         a group of addresses charged at once
     fetter           the named pattern at one address (engine/data/gloss.js)
     axis             the feeling that address holds, against its opposite

   and every card also splits what it is made of by seat and by feeling, which
   are the two directions the engine files every address by.

   ONE CARD PER THING. The address card and the law card are the product's
   own, built by nodeDrillHtml and lawDrillHtml in ui/drills.js, so a press
   here and a press on the Field show the same card. The trail only adds the
   steps above it and makes its rows into doors.

   ANA_PICK stays what it was, {k, nm}, the thing on the card now, and
   anaDrill() still answers it: tests/unpack.js sets it and calls anaDrill by
   name. ANA_TRAIL is the steps that led there.
   ============================================================ */
var ANA_TRAIL=[];
var ANA_KIND={sup:['super complex','Super-complex'],hy:['hyper complex','Hyper-complex'],
 cx:['complex','Complex'],sab:['saboteur','Saboteur']};
function anaKey(k,nm){return esc(k+'|'+nm);}
function anaPl(n,one,many){return n+' '+(n===1?one:many);}
function anaAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function anaBySq(a,b){return b.sq-a.sq;}
function anaChainOf(r){return [].concat(r.sups,r.hys,r.cxs,r.sabs);}
function anaFind(r,nm){return anaChainOf(r).filter(function(x){return x.nm===nm;})[0]||null;}
/* the seat cells are named by FLOWSEAT, where the 3rd Eye is Brow, and the
   engine files an address by band. One lookup between the two. */
function anaSeatNm(band){
 var s=flSeats().filter(function(x){return K2B[x.p.k]===band;})[0];
 return s?s.p.n:band;}
function anaSeatWord(band,cap){return unp('seat:'+String(band).toLowerCase(),cap?band:(band==='3rd Eye'?'3rd eye':String(band).toLowerCase()));}
/* a count, with nought as the dash the product prints for nothing */
function anaN(n){return n?String(n):'\u2013';}
/* A DOOR TO ONE THING, a row with its own badge, for the step from an
   address to its feeling or its seat. Bars compare groups on one scale and
   these are not on one scale, so they are rows and not bars. */
function anaAxisRow(nm){
 var c=CHILD.filter(function(x){return x.nm===nm;})[0]; if(!c)return '';
 var v=S.charge[c.nm]||0;
 return '<button type="button" class="ad-r" data-ana="'+anaKey('axis',c.nm)+'" title="'+esc('Open '+c.nm+', the feeling, held against '+c.opp.toLowerCase())+'">'
  +crBadge(c.seat,pct('charge',v)||0,{size:'sm',raw:fmtPct('charge',v),title:c.nm+' held'})
  +'<span>'+esc(c.nm)+'</span><em>'+unp('axis','toward '+c.opp.toLowerCase())+'</em></button>';}
function anaSeatRow(band){
 var s=flSeats().filter(function(x){return K2B[x.p.k]===band;})[0]; if(!s)return '';
 return '<button type="button" class="ad-r" data-ana="'+anaKey('seat',s.p.n)+'" title="'+esc('Open the '+band.toLowerCase()+' point')+'">'
  +crBadge(band,Math.min(100,s.load*100),{size:'sm',raw:anaN(s.hot),title:anaPl(s.hot,'address','addresses')+' held at the '+band.toLowerCase()})
  +'<span>'+esc(s.p.n)+'</span><em>'+anaSeatWord(band)+' point</em></button>';}
function anaBands(list){var bs=[];list.forEach(function(n){if(n.b&&bs.indexOf(n.b)<0)bs.push(n.b);});
 return BANDS.filter(function(b){return bs.indexOf(b)>=0;});}

/* ---- the rows a card is made of ---- */
/* A pattern as a row: the badge carries its weight as a ring and a figure,
   which is the picture V22 asks for, and the kind word carries its meaning. */
function anaPatRow(o){
 /* the seat its charge sits in, patSeat, never its first address; none
    held claims no seat and is drawn in the accent */
 var b=patSeat(o), K=ANA_KIND[o.kind]||['pattern','Pattern'];
 return '<button type="button" class="ad-r" data-ana="'+anaKey('chain',o.nm)+'" title="'+esc('Open '+o.nm)+'">'
  /* a percent in the pattern's own colour; overshot is said in words */
  +crBadge(b,pct('chain',o.w)||0,{size:'sm',raw:fmtPct('chain',o.w),color:b?seatCol(b):'var(--accent)',
    title:o.nm+', '+K[1].toLowerCase()+(o.over?', overshot':'')})
  +'<span>'+esc(o.nm)+'</span><em>'+unp(K[0],K[1].toLowerCase()+(o.over?', overshot':''))+'</em></button>';}
function anaAddrRows(list,max){
 max=max||10;
 return '<div class="ad-rows">'+list.slice(0,max).map(function(n){return addrRow(n,{ana:true});}).join('')
  +(list.length>max?'<div class="pm-more">and '+(list.length-max)+' more</div>':'')+'</div>';}
function anaPatRows(list,max){
 max=max||8;
 return '<div class="ad-rows">'+list.slice(0,max).map(anaPatRow).join('')
  +(list.length>max?'<div class="pm-more">and '+(list.length-max)+' more</div>':'')+'</div>';}
/* A SPLIT, as bars. Each row is a door. The bar is the charge left on the
   addresses in that group, added up, and drawn against the biggest group on
   the same card, so the longest bar is the heaviest group and nothing else.
   The figure beside it is a count of fetters, which a person can check. */
function anaGroup(list,keyf){
 var m={},order=[];
 list.forEach(function(n){var k=keyf(n); if(k==null)return;
  if(!m[k]){m[k]={k:k,n:0,h:0,v:0};order.push(k);}
  m[k].n++; m[k].v+=n.sq; if(n.sq>=4)m[k].h++;});
 return order.map(function(k){return m[k];}).sort(function(a,b){return b.v-a.v||b.n-a.n;});}
function anaBars(rows){
 var max=rows.reduce(function(a,x){return Math.max(a,x.v);},0)||1;
 return '<div class="ana-bars">'+rows.map(function(x){
  var w=x.v>0?Math.max(3,Math.round(x.v/max*100)):0;
  return '<button type="button" class="ana-bar" data-ana="'+x.key+'" title="'+esc(x.title)+'">'
   +'<span class="ana-bar-n">'+x.lbl+'</span>'
   +'<span class="ana-bar-t"><i style="width:'+w+'%;background:'+x.c+'"></i></span>'
   +'<span class="ana-bar-f">'+x.fig+'</span></button>';}).join('')+'</div>';}
function anaFig(g){return anaPl(g.n,'fetter','fetters')+(g.h?', '+g.h+' held':'');}
function anaByFeeling(list){
 return anaBars(anaGroup(list,function(n){return n.cf;}).map(function(g){
  var c=CHILD.filter(function(x){return x.nm===g.k;})[0]||{};
  return {key:anaKey('axis',g.k),lbl:esc(g.k),v:g.v,c:seatCol(c.seat||'Heart'),fig:anaFig(g),
   title:'Open '+g.k+'. The bar is the charge left on these fetters, added up.'};}));}
function anaBySeat(list){
 return anaBars(anaGroup(list,function(n){return n.b;}).map(function(g){
  return {key:anaKey('seat',anaSeatNm(g.k)),lbl:anaSeatWord(g.k,true),v:g.v,c:seatCol(g.k),fig:anaFig(g),
   title:'Open the '+String(g.k).toLowerCase()+' point. The bar is the charge left on these fetters, added up.'};}));}
/* the two splits, under one pair of headings, for any set of addresses */
function anaSplits(list){
 if(!list.length)return '';
 return '<div class="pm-eye" style="margin-top:14px">By feeling</div>'+anaByFeeling(list)
  +'<div class="pm-eye" style="margin-top:12px">By point</div>'+anaBySeat(list);}
/* the patterns running on a set of addresses, or the lock where the plan
   cannot see them. Never "nothing runs here" to a plan that cannot look. */
function anaRunning(r,list,head){
 if(!lockSees('sab'))return '<div class="pm-eye" style="margin-top:14px">'+head+'</div>'+lockPanelHtml('sab',{brief:true});
 var ids={}; list.forEach(function(n){ids[n.i]=1;});
 var on=anaChainOf(r).filter(function(o){return leaves(o).some(function(n){return ids[n.i];});})
  .sort(function(a,b){return b.w-a.w;});
 if(!on.length)return '';
 return '<div class="pm-eye" style="margin-top:14px">'+head+' '+on.length+'</div>'+anaPatRows(on,8);}
/* the stories that landed on these seats, as the drill always showed them */
function anaStories(bands){
 var ents=((CURP&&CURP.story&&CURP.story.entries)||[]);
 var hit=ents.filter(function(e){return bands.some(function(b){return e.bands&&e.bands[B2K[b]];});});
 var s='<div class="pm-eye" style="margin-top:14px">From your stories, '+hit.length+'</div>';
 return s+(hit.length?hit.slice(0,4).map(function(e){
  return '<div class="ad-q">'+esc(e.text.slice(0,130))+(e.text.length>130?'…':'')+'</div>';}).join('')
  :'<p class="ad-p">No entry has landed on these points yet.</p>');}
/* how many of a set are held, how many carry under the line, said once */
function anaHeldSay(list){
 var h=list.filter(function(n){return n.sq>=4;}).length;
 var u=list.filter(function(n){return n.sq>0&&n.sq<4;}).length;
 return (h?'<b>'+h+'</b> '+(h===1?'is':'are')+' held, at 4 or more.':'None is held at 4 or more.')
  +(u?' <b>'+u+'</b> more '+(u===1?'carries':'carry')+' charge under that line.':'');}
/* the feeling and the seat under one address, as two doors, for the card
   ui/drills.js builds (nodeDrillHtml asks for this by name) */
function anaTraceRows(n){
 var h=(n.cf?anaAxisRow(n.cf):'')+(n.b&&BANDS.indexOf(n.b)>=0?anaSeatRow(n.b):'');
 return h?'<div class="pm-eye">Under it</div><div class="ad-rows">'+h+'</div>':'';}

/* ---- the cards ---- */
function anaHead(eye,nm,sub){
 return '<div class="pm-eye">'+eye+'</div><div class="ad-nm">'+esc(nm)+'</div>'
  +(sub?'<div class="ad-sub">'+sub+'</div>':'');}
/* a figure row: one word over each figure, V17 */
function anaKv(pairs){
 return '<div class="ana-kv">'+pairs.map(function(p){
  return '<div><span>'+p[0]+'</span><b>'+p[1]+'</b></div>';}).join('')+'</div>';}
function anaChainCard(r,o){
 var K=ANA_KIND[o.kind]||['pattern','Pattern'];
 var lv=leaves(o).slice().sort(anaBySq), bs=anaBands(lv);
 var fets=[];lv.forEach(function(n){if(n.cf&&fets.indexOf(n.cf)<0)fets.push(n.cf);});
 var oppOf=function(f){var c=CHILD.filter(function(x){return x.nm===f;})[0];return c?c.opp:'';};
 var opps=fets.map(oppOf).filter(Boolean);
 var inst=fets.filter(function(f){return (S.replace[f]||0)>=4;});
 var h=anaHead(unp(K[0],K[1])+(o.over?', overshot':''),o.nm,o.auth?esc(o.auth):'');
 h+=anaKv([['Weight',crBadge(bs[0]||'Heart',pct('chain',o.w)||0,{size:'md',raw:fmtPct('chain',o.w),
   title:'How heavily it runs, on the same scale as an address'})],
  ['Fetters',anaN(lv.length)],['Held',anaN(lv.filter(function(n){return n.sq>=4;}).length)],
  ['Points',anaN(bs.length)]]);
 /* the word's own meaning, from the one table. Not "What it is": a
    saboteur's card carries that heading already, for its library entry
    (kbSabBlock), and two headings of one name read as one section twice. */
 h+='<div class="pm-eye">What the word means</div><p class="ad-p">'+unpSay(K[0])+'</p>';
 /* WHAT IT RUNS ON, AND HOW ITS WEIGHT IS MADE. Each sentence is the line in
    compute() that builds it, said in words. */
 var made=o.over?'Its weight is how far past the helpful point the opposite sits, on average, across those fetters.'
  :o.kind==='sab'?(o.named?'Its weight is the average charge on the feelings it is matched on.'
    :'Its weight is the average charge left on those fetters.')
  :o.kind==='cx'?'Its weight is the average of its two saboteurs.'
  :o.kind==='hy'?'Its weight is the average of the complexes in it.'
  :'Its weight is the average of its two hyper-complexes.';
 h+='<div class="pm-eye">How it runs through you</div><p class="ad-p">'
  +(o.over?'Overshot. The opposite of the feeling underneath is put in past the point where it helps, '
    +'so these fetters will not shut, where a held fetter will not open. ':'')
  +'It runs on <b>'+anaPl(lv.length,'fetter','fetters')+'</b> at the '+anaAnd(bs.map(function(b){return b==='3rd Eye'?'3rd eye':b.toLowerCase();}))
  +(bs.length===1?' point':' points')+'. '+anaHeldSay(lv)+' '+made
  +(o.kind==='sab'&&o.score?' Matched at <b>'+o.score+'%</b>, a measure of how closely your feelings fit the ranges this saboteur is defined by.':'')
  +(o.kind==='sup'?' A super-complex costs more than it looks like it should, because you cannot see it as separate from you.':'')
  +'</p>';
 if(o.kind==='sab'&&typeof kbSabBlock==='function')h+=kbSabBlock(String(o.nm).replace(/ overshot$/,''));
 if(o.kind!=='sab'&&o.parts&&o.parts.length){
  var down=({sup:'Its hyper-complexes',hy:'Its complexes',cx:'Its saboteurs'})[o.kind]||'Made of';
  h+='<div class="pm-eye">'+down+'</div>'+anaPatRows(o.parts,8);}
 h+='<div class="pm-eye" style="margin-top:14px">'+(o.kind==='sab'?'Made of':'The fetters underneath')+'</div>'+anaAddrRows(lv,o.kind==='sab'?12:8);
 h+=anaSplits(lv);
 h+='<div class="pm-eye" style="margin-top:14px">The opposite</div><p class="ad-p">'
  +(opps.length?'It runs on '+fets.join(', ').toLowerCase()+'. The opposite is <b>'+opps.join(', ').toLowerCase()+'</b>. '
    +(inst.length?'You already have '+inst.map(oppOf).join(', ').toLowerCase()+' partly installed.'
      :'None of it is installed yet. Release empties the address, and the opposite is what fills it.')
   :'No feeling and its opposite sits underneath this one.')+'</p>';
 return h+anaStories(bs);}
function anaAddrCard(r,n){return nodeDrillHtml(n,{ana:true});}
function anaAxisCard(r,nm){
 var c=CHILD.filter(function(x){return x.nm===nm;})[0]; if(!c)return null;
 var own=W.filter(function(n){return n.cf===nm;}).sort(anaBySq);
 var where=String(c.addr).indexOf('plexus')>=0?unp('plexus',c.addr):esc(c.addr);
 var h=anaHead(unp('axis','Axis'),c.nm+' toward '+c.opp,where+', '+esc(c.loc));
 var hv=S.charge[c.nm]||0, iv=S.replace[c.nm]||0;
 h+=anaKv([['Held',crBadge(c.seat,pct('charge',hv)||0,{size:'md',raw:fmtPct('charge',hv),title:c.nm+' held'})],
  [unp('installed','Installed'),crBadge(c.seat,pct('installed',iv)||0,{size:'md',raw:fmtPct('installed',iv),title:c.opp+' installed'})],
  ['Fetters',anaN(own.length)]]);
 h+='<p class="ad-p">'+unpSay('axis')+' Held is how much '+c.nm.toLowerCase()+' is stored. Installed is how much '
  +c.opp.toLowerCase()+' is in place. Coherence is the centre of this axis, not either end. It runs through <b>'
  +anaPl(own.length,'fetter','fetters')+'</b>. '+anaHeldSay(own)+'</p>';
 h+='<div class="pm-eye">Its fetters</div>'+anaAddrRows(own,10);
 h+='<div class="pm-eye" style="margin-top:12px">By point</div>'+anaBySeat(own);
 return h+anaRunning(r,own,'Running on it');}
function anaSeatCard(r,nm){
 var s2=flSeats().filter(function(x){return x.p.n===nm;})[0]; if(!s2)return null;
 var bn=K2B[s2.p.k];
 var seg=W.filter(function(n){return n.b===bn;}).sort(anaBySq);
 /* AX8, closed 2 October. The sub line printed "Sahasrara · Cranial plexus
    · 963 Hz" bare, and the paragraph opened "Vritti pineal, cortical". The
    sub line's terms carry their sentences now, and the level is its own
    sentence. Vritti is gone: the codex makes it the wave around a nerve,
    never a spine level. The reason is written at engine/data/gloss.js. The
    Hz wears its own seat's colour, as ruled 25 September (TASKS.md AX8). */
 var h=anaHead('Point',s2.p.n)+'<div class="ad-sub">'+unp(s2.p.n,s2.p.sk,'yoga')+' · '+unp('plexus',s2.p.nv)
  +' · <span style="color:'+seatCol(bn)+'">'+unp('seat tone',s2.p.hz+' Hz')+'</span></div>';
 h+='<p class="ad-p">'+unpSay('level:'+s2.p.k)+' The point sits at '+unp('spot:'+s2.p.k,s2.p.seat)+'. It passes <b>'
  +fmtPct('pass',s2.pass)+'</b> of what reaches it. <b>'+s2.hot+'</b> address'
  +(s2.hot===1?' is':'es are')+' held here.</p>';
 /* the laws seated here, as doors, round RB. They were chips that went nowhere. */
 var laws=SI.filter(function(l){return l.b===bn;});
 /* plain: six words is a sentence, not a label, by the capitalize rule in
    shell/head.html, so it keeps the case it is written in */
 h+='<div class="pm-eye plain">Laws of Moral Integrity seated here</div><div class="ad-rows">'+laws.map(function(l){
  var read=(typeof lawIn!=='function')||lawIn(l.nm), v=S.law[l.nm];
  return '<button type="button" class="ad-r" data-ana="'+anaKey('law',l.nm)+'" title="'+esc('Open '+l.nm)+'">'
   +crBadge(bn,read?pct('law',v)||0:0,{size:'sm',raw:read?fmtPct('law',v):'\u2013',title:l.nm+(read?'':', not read yet')})
   +'<span>'+esc(l.nm)+'</span><em>'+(!read?'not read yet':v<4?'shut':v>=7?'open':'working')+'</em></button>';}).join('')+'</div>';
 h+='<div class="pm-eye" style="margin-top:12px">Addresses here</div>'+anaAddrRows(seg,10);
 h+='<div class="pm-eye" style="margin-top:12px">By feeling</div>'+anaByFeeling(seg);
 return h+anaRunning(r,seg,'Running here')+anaStories([bn]);}
function anaLawCard(r,nm){
 var l=SI.filter(function(x){return x.nm===nm;})[0]; if(!l)return null;
 var s=anaSeatNm(l.b);
 return lawDrillHtml(l,{ana:true})+'<div class="pm-eye" style="margin-top:12px">Its point</div>'
  +'<div class="ad-rows">'+anaSeatRow(l.b)+'</div>';}
function anaDomCard(r,nm){
 var di=-1; DOMAINS.forEach(function(d,i){if(d.nm===nm)di=i;});
 var d=DOMAINS[di]||{}, own=W.filter(function(n){return Math.min(18,Math.floor(n.slot/(108/19)))===di;}).sort(anaBySq);
 var bands=anaBands(own);
 var h=anaHead('Blueprint domain',d.nm||nm,esc((d.r||'')+' cluster, '+(S.doms.indexOf(di)>=0?'you run this':'not selected')));
 h+='<p class="ad-p">'+esc(d.d||'')+'. It owns <b>'+anaPl(own.length,'address','addresses')+'</b> across '
  +bands.map(function(b){return b.toLowerCase();}).join(', ')+'. '+anaHeldSay(own)
  +' What is held is what the domain costs you rather than gives you.</p>'
  +'<div class="pm-eye">Addresses here</div>'+anaAddrRows(own,10);
 return h+anaSplits(own)+anaRunning(r,own,'Running here')+anaStories(bands);}
function anaArchCard(r,nm){
 var ai=-1; ARCH.forEach(function(x,i){if(x.nm===nm)ai=i;});
 /* ARCH names it Rebel and the eighteen name it Outlaw. one row, two names. */
 var a18=ARCH18.filter(function(x){return x[0]===nm||(nm==='Rebel'&&x[0]==='Outlaw');})[0];
 /* WHERE THE PRIMARY SABOTEUR SITS IS WHERE ITS ADDRESSES ARE, 24 October,
    systems audit SG-05. This printed the third column of ARCH18 as its seat,
    which named none of its addresses' seats in 9 of the 18 rows, so the card
    put Pleaser at the heart while the body map drew it at the root and the
    sacral. sabSeats (engine/core.js) reads them off SAB_LIB. */
 var sbs=a18?sabSeats(a18[1]):[];
 var h=anaHead('Archetype',nm,(ai===r.pi?'primary, how the soul expresses':'not your primary'));
 h+='<p class="ad-p">'+esc((ARCH[ai]||{}).v||'')+'. <b>'
  /* how fully it is expressed, ruled 16 October; the lean against the
     strongest still orders the archetypes and is printed nowhere */
  +fmtPct('archetype',archExpr(ai))+'</b> expressed. Charge held at its point pulls it down, and a release lifts it.'
  +(a18?' Its primary saboteur is <b>'+esc(a18[1])+'</b>'
   +(sbs.length?', and its '+unp('address','addresses')+' sit at '+esc(unpackList(sbs.map(srcSeatSay))):'')+'.':'')
  +' The archetype does not change. Release clears what bends it on the way out.</p>';
 /* and when that saboteur is running, it is a door */
 var run=a18&&lockSees('sab')?anaFind(r,a18[1]):null;
 if(run)h+='<div class="pm-eye">Running now</div>'+anaPatRows([run],1);
 return h;}
function anaMaskCard(r,nm){
 var m2=r.maskRing.filter(function(x){return x.nm===nm;})[0]; if(!m2)return null;
 var sb=(m2.bands||[]);
 var all=W.filter(function(n){return sb.indexOf(n.b)>=0;}).sort(anaBySq);
 var lv2=all.filter(function(n){return n.sq>=4;});
 var h=anaHead(unp('mask','Mask'),m2.nm,'speaks from '+esc(sb.join(' and ')));
 h+=anaKv([['Load',crBadge(sb[0]||'Heart',pct('weight',m2.w)||0,{size:'md',raw:fmtPct('weight',m2.w),title:'The average charge left across these points'})],
  ['Held',anaN(lv2.length)]]);
 h+='<p class="ad-p">'+unpSay('mask')+' This is the age the output takes on the way out. Its load is the average charge left across every address at those points.</p>'
  +'<div class="pm-eye">Underneath it</div>'+anaAddrRows(all.filter(function(n){return n.sq>0;}),10);
 return h+anaSplits(all)+anaRunning(r,all,'Running under it')+anaStories(sb);}

/* ---- the six readings ---- */
/* WHAT EACH ONE IS, in words, and what the tile prints. Every figure is one
   compute() already returns; nothing is measured here that the engine did not
   measure. Shadow, pull and expression are worked out from the addresses,
   which is said on each, because a figure that is arithmetic must not read as
   a second instrument. */
/* EACH FIGURE IS THE REGISTRY'S, 17 October, percent phase 2: fig returns the
   ring's fill and the pill's figure off one kind (engine/pct.js), so CQ and
   expression print as percents beside the shadow and the pull, which already
   did, and overshoot and installed stop printing a decimal over a fill ten
   times its size. */
function anaPctFig(kind,v,r){return {p:pct(kind,v)||0,raw:fmtPct(kind,v,{unread:r&&r.unread})};}
/* CQ AND DQ ARE THE GLOSSARY'S, task #80. Both tips were typed here and
   said each figure a second way beside the sentence engine/data/gloss.js
   already gives it, which is the one table every other CQ and DQ tooltip
   reads. A getter, so the table is asked when the tile is drawn and not
   when this file loads. THE CONTENT GAP CLOSED, 18 November: Self-read
   shadow, Pull, Overshoot and Installed kept their own words here because
   the table had no sentence for them, which left every other screen that
   prints those words (the session card, the axis card, the pole drill, the
   release ledger) nothing to ask. Their sentences live in gloss.js now and
   these read them the way CQ and DQ do. Expression keeps its own words: the
   table's bare expression is the numerology number. */
var ANA_MET={
 cq:{nm:'Coherence',seat:'Crown',txt:'CQ',
  get tip(){return unpackOf('cq');},
  fig:function(r){return anaPctFig('cq',r.CQ,r);}},
 dq:{nm:'Shadow',seat:'Root',txt:'DQ',
  get tip(){return unpackOf('dq');},
  fig:function(r){return anaPctFig('dq',r.DQ,r);}},
 lawsq:{nm:'Self-read shadow',seat:'Root',txt:'SQ',
  get tip(){return unpackOf('self-read shadow');},
  fig:function(r){return r.lawSQ===null?{p:0,raw:'–'}:anaPctFig('lawsq',r.lawSQ,r);}},
 pull:{nm:'Pull',seat:'Solar',txt:null,
  get tip(){return unpackOf('pull');},
  fig:function(r){return anaPctFig('pull',r.PULL,r);}},
 ex:{nm:'Expression',seat:'Throat',txt:null,
  tip:'Expression is your coherence with the pull taken off it, so it is how much of it reaches what you do.',
  fig:function(r){return anaPctFig('expression',r.EX,r);}},
 jq:{nm:'Overshoot',seat:'3rd Eye',txt:null,
  get tip(){return unpackOf('overshoot');},
  fig:function(r){return anaPctFig('overshoot',r.JQ,r);}},
 pole:{nm:'Installed',seat:'Heart',txt:null,
  get tip(){return unpackOf('installed');},
  fig:function(r){return anaPctFig('pole',r.poleMean,r);}}};
function anaMetRow(r,k){
 var M=ANA_MET[k], f=M.fig(r);
 return '<button type="button" class="ad-r" data-ana="met|'+k+'" title="'+esc('Open '+M.nm)+'">'
  +crBadge(M.seat,f.p,{size:'sm',raw:f.raw,title:M.nm})
  /* the word carries its sentence the way the tile's does, a data-tip on the
     label and no tabindex, because the row is already the focusable button */
  +'<span data-tip-k="'+esc(M.nm)+'" data-tip="'+esc(M.tip)+'">'+esc(M.nm)+'</span><em>reading</em></button>';}
function anaMetCard(r,k){
 var M=ANA_MET[k]; if(!M)return null;
 var f=M.fig(r), h=anaHead('Reading',M.nm);
 h+=anaKv([['Now',cr(M.seat,f.p,{size:'md',raw:f.raw,text:M.txt,hot:false,label:M.nm})]]);
 h+='<p class="ad-p">'+esc(M.tip)+'</p>';
 var bySeat=function(){return anaBySeat(W.filter(function(n){return n.sq>0;}));};
 if(k==='cq'){
  var laws=SI.slice().sort(function(a,b){
   var ia=lawIn(a.nm),ib=lawIn(b.nm); if(ia!==ib)return ia?-1:1; return S.law[a.nm]-S.law[b.nm];});
  h+='<p class="ad-p">The '+SI.length+' laws, each answered from nothing to ten, added together. '
   +(r.complete?'All '+SI.length+' are in. '+(r.tier?'The band is <b>'+esc(r.tier.toLowerCase())+'</b>.':'')
    :'<b>'+(SI.length-r.answered)+'</b> are still to answer, and each counts nothing until it is.')
   +' The shadow does not touch this number. It pulls on expression.</p>'
   +'<div class="pm-eye">The laws, weakest first</div><div class="ad-rows">'+laws.map(function(l){
    var read=lawIn(l.nm), v=S.law[l.nm];
    return '<button type="button" class="ad-r" data-ana="'+anaKey('law',l.nm)+'" title="'+esc('Open '+l.nm)+'">'
     +crBadge(l.b,read?pct('law',v)||0:0,{size:'sm',raw:read?fmtPct('law',v):'\u2013',title:l.nm+(read?'':', not read yet')})
     +'<span>'+esc(l.nm)+'</span><em>'+(!read?'not read yet':v<4?'shut':v>=7?'open':'working')+'</em></button>';}).join('')+'</div>';}
 else if(k==='dq'){
  h+='<p class="ad-p">It counts every one of your '+NODES.length+' addresses, under the line at 40% as well as over it. '
   +'It is worked out from the addresses and is not measured on its own. It does not touch CQ. It feeds the pull.</p>'
   +'<div class="pm-eye">Where it sits, by point</div>'+bySeat()
   +'<div class="pm-eye" style="margin-top:12px">Heaviest fetters</div>'+anaAddrRows(W.filter(function(n){return n.sq>0;}).sort(anaBySq),8);}
 else if(k==='pull'){
  /* the weights in the unit every address now prints, 17 October */
  h+='<p class="ad-p">Each address drags by how heavy it is, on a curve. At 20% it barely drags, '
   +'at 50% it drags half as hard as it can, and from 70% up it drags almost fully. Pull is the average drag across all '
   +NODES.length+' addresses, so a few heavy places pull harder than many light ones.</p>'
   +'<div class="pm-eye">Pulling hardest</div><div class="ad-rows">'
   +W.filter(function(n){return n.sq>=2;}).sort(anaBySq).slice(0,10).map(function(n){
    return addrRow(n,{ana:true,em:'drags '+fmtPct('pull',leverPull(n.sq))});}).join('')+'</div>'
   +'<div class="pm-eye" style="margin-top:12px">By point</div>'+bySeat();}
 else if(k==='ex'){
  var top=(typeof exCeiling==='function')?exCeiling():null;
  h+='<p class="ad-p">Expression is CQ times what the pull leaves. CQ <b>'+fmtPct('cq',r.CQ)+'</b>, pull <b>'
   +fmtPct('pull',r.PULL)+'</b>, expression <b>'+fmtPct('expression',r.EX)+'</b>.'
   +(top!=null?' With every charge released it would read <b>'+fmtPct('expression',top)+'</b> on the laws as they stand.':'')+'</p>'
   +'<div class="pm-eye">What makes it</div><div class="ad-rows">'+anaMetRow(r,'cq')+anaMetRow(r,'pull')+'</div>';}
 else if(k==='jq'){
  var ex=W.filter(function(n){return n.jq>=4;}).sort(function(a,b){return b.jq-a.jq;});
  h+='<p class="ad-p">The figure is the average across your addresses. '+(ex.length?'<b>'+ex.length+'</b> '
   +(ex.length===1?'address is':'addresses are')+' overshot far enough to count, where the opposite will not let the fetter shut.'
   :'No address is overshot far enough to count.')+'</p>'
   +(ex.length?'<div class="pm-eye">Overshot</div>'+'<div class="ad-rows">'+ex.slice(0,10).map(function(n){
    return addrRow(n,{ana:true,em:'overshot'});}).join('')+'</div>':'');}
 else if(k==='pole'){
  var inn=W.filter(function(n){return n.pole>=4;}).sort(function(a,b){return b.pole-a.pole;});
  h+='<p class="ad-p">The figure is the average across your addresses of how far the opposite has passed what is still held there.</p>'
   +'<div class="pm-eye">Each opposite</div>'+anaBars(CHILD.map(function(c){
    return {key:anaKey('axis',c.nm),lbl:esc(c.opp),v:S.replace[c.nm]||0,c:seatCol(c.seat),
     fig:'for '+esc(c.nm.toLowerCase()),title:'Open '+c.nm+' toward '+c.opp};}).sort(function(a,b){return b.v-a.v;}))
   +(inn.length?'<div class="pm-eye" style="margin-top:12px">Where it is in</div>'+anaAddrRows(inn,10):'');}
 return h;}
/* one row of the record, every figure the snapshot kept */
function anaSessCard(r,nm){
 var H=anaHist(), i=+nm, x=H[i]; if(!x)return null;
 var p=i>0?H[i-1]:null, same=p&&p.m===x.m;
 /* A SCORE ROW NAMES ITS KIND, 17 October, percent phase 2: it prints the
    registry's percent and says its move as where it stood before, "from 58%",
    never "up 0.1" in a unit the person cannot see. A count row passes no kind
    and keeps its whole number and its signed move. */
 var d=function(k,dp,kind){if(!same||x[k]==null||p[k]==null)return '';
  if(kind){var mv=pctMove(kind,p[k],x[k]); return !mv||!mv.moved?' <em>no change</em>':' <em>from '+mv.from+'</em>';}
  var v=+x[k]-+p[k]; if(Math.abs(v)<Math.pow(10,-dp)/2)return ' <em>no change</em>';
  return ' <em>'+(v>0?'up ':'down ')+Math.abs(v).toFixed(dp)+'</em>';};
 var row=function(lbl,k,dp,kind){
  return '<div class="ana-dl"><span>'+lbl+'</span><b>'+(x[k]==null?'\u2013':kind?fmtPct(kind,x[k]):(+x[k]===0?'\u2013':(+x[k]).toFixed(dp)))+'</b>'+d(k,dp,kind)+'</div>';};
 var h=anaHead('Session '+(i+1),(typeof dlyDayWord==='function'?dlyDayWord(String(x.t).slice(0,10))+' '+String(x.t).slice(0,4):String(x.t).slice(0,10)),
  esc(x.dark?'heaviest at the '+String(x.dark).toLowerCase():''));
 h+='<p class="ad-p">Every figure this session kept. '+(p?(same?'Each change is against the session before it.'
   :'The session before was worked out a different way, so no change is shown against it.'):'This is the first session on the record.')+'</p>'
  +'<div class="ana-dls">'+row('Coherence','cq',1,'cq')+row('Shadow','dq',1,'dq')+row('Held','loaded',0)
  /* the four rungs carry their sentences beside Overshoot and Installed, so
     one dotted word in a column of bare ones does not read as the odd row */
  +row(unp('saboteur','Saboteurs'),'sab',0)+row(unp('complex','Complexes'),'cx',0)
  +row(unp('hyper complex','Hyper-complexes'),'hy',0)+row(unp('super complex','Super-complexes'),'ch',0)
  +row(unp('overshoot','Overshoot'),'jq',2,'overshoot')+row(unp('installed','Installed'),'pole',2,'pole')+'</div>'
  +(x.tier?'<p class="ad-p">The band read <b>'+esc(String(x.tier).toLowerCase())+'</b>.</p>':'')
  +(x.arch?'<p class="ad-p">The leading archetype was <b>'+esc(x.arch)+'</b>.</p>':'');
 return h;}

function anaCard(r,P){
 if(P.k==='chain'){var o=anaFind(r,P.nm); return o?anaChainCard(r,o):null;}
 if(P.k==='addr'){var n=BY[+P.nm]; return n?anaAddrCard(r,n):null;}
 if(P.k==='axis')return anaAxisCard(r,P.nm);
 if(P.k==='seat')return anaSeatCard(r,P.nm);
 if(P.k==='law')return anaLawCard(r,P.nm);
 if(P.k==='dom')return anaDomCard(r,P.nm);
 if(P.k==='arch')return anaArchCard(r,P.nm);
 if(P.k==='mask')return anaMaskCard(r,P.nm);
 if(P.k==='met')return anaMetCard(r,P.nm);
 if(P.k==='sess')return anaSessCard(r,P.nm);
 return null;}
function anaStepName(P){
 if(P.k==='addr'){var n=BY[+P.nm]; return n?n.k:P.nm;}
 if(P.k==='met')return (ANA_MET[P.nm]||{}).nm||P.nm;
 if(P.k==='sess')return 'Session '+(+P.nm+1);
 return P.nm;}
function anaCrumbs(){
 if(!ANA_TRAIL.length)return '';
 return '<nav class="ana-crumbs" aria-label="How you got here">'+ANA_TRAIL.map(function(p,i){
  return '<button type="button" class="ana-crumb" data-anacrumb="'+i+'">'+esc(anaStepName(p))+'</button>'
   +'<span class="ana-crumb-s" aria-hidden="true">\u203a</span>';}).join('')
  +'<span class="ana-crumb-at">'+esc(anaStepName(ANA_PICK))+'</span></nav>';}
/* THE DRILL. Still the function every caller knows, and it still clears in
   place: rdClose calls render, render calls anaRender, anaRender calls this,
   which recursed until the stack died when this called rdClose. */
/* THE REAL KIND A CARD OPENED WITH, for insDoor, below. anaGo's own kinds
   are this page's own: 'chain' covers a saboteur, complex, hyper-complex or
   super-complex at once (anaFind tells which), and 'axis' is this file's
   own name for what engine/insight.js calls 'fet', the child emotion;
   'seat' here is keyed by the point's proper name where insight.js's own
   APC table is keyed by the band word, so that one needs the same lookup
   anaSeatCard already does to get from one to the other. met and sess
   have no equivalent a person can release, so they are left as
   they were: no insDoor, Insight keeps whatever it already had or says
   nothing is selected, honestly, rather than guess at one. */
function anaInsSelFor(P,r){
 if(P.k==='addr')return {kind:'addr',i:+P.nm};
 if(P.k==='axis')return {kind:'fet',nm:P.nm};
 if(P.k==='seat'){
  var s=flSeats().filter(function(x){return x.p.n===P.nm;})[0], bn=s&&K2B[s.p.k];
  return bn?{kind:'seat',nm:bn}:null;}
 if(P.k==='chain'){var o=anaFind(r,P.nm); return o?{kind:o.kind,nm:o.nm}:null;}
 if(P.k==='mask'||P.k==='dom'||P.k==='arch'||P.k==='law')return {kind:P.k,nm:P.nm};
 return null;}
function anaDrill(){
 var box=document.getElementById('rdrill'); if(!box)return;
 if(!ANA_PICK){ANA_TRAIL=[];box.innerHTML='';box.style.display='none';
  var none=document.getElementById('rdrill-none'); if(none)none.style.display='';
  return;}
 var r=computeSeen(), h=anaCard(r,ANA_PICK);
 /* THE DOOR SAYS WHAT IT IS ABOUT TO OPEN, before rdShell takes it, the same
    promise every other drill on this product already keeps (ui/drills.js's
    runNodeDrill, runLawDrill and the rest). anaDrill() and anaGo() never
    made that call, so a card could stand open on this page while the
    Insight rail still read "Nothing selected" underneath it. Only called
    when the card is real (h!=null): a selection whose pattern has stopped
    running says so on its own card, and Insight should not claim a
    confident reading of a thing that card just said is gone. */
 if(h!=null&&typeof insDoor==='function'){
  var ik=anaInsSelFor(ANA_PICK,r);
  if(ik)insDoor(ik.kind,ik.nm,ik.i);}
 /* a thing on the trail can stop running while a person is on it, after a
    release. The card says so and the trail still leads back. */
 if(h==null)h=anaHead('Not running now',anaStepName(ANA_PICK))
  +'<p class="ad-p">Nothing by this name is on the reading as it stands now.</p>';
 rdShell(anaCrumbs()+h);}
/* ONE WAY IN, from the page or from a card. A press on the page starts a new
   trail, and a second press on the same bubble with nothing below it closes
   the card, which is what the bubbles always did. A press on a card adds a
   step. A press on a step goes back to it. */
function anaGo(k,nm,fromPage){
 if(fromPage){
  var same=ANA_PICK&&ANA_PICK.k===k&&ANA_PICK.nm===nm&&!ANA_TRAIL.length;
  ANA_TRAIL=[]; ANA_PICK=same?null:{k:k,nm:nm};}
 else{if(ANA_PICK)ANA_TRAIL.push(ANA_PICK); ANA_PICK={k:k,nm:nm};}
 S.pin=null;
 anaRedraw(!fromPage);}
/* A STEP TAKEN INSIDE THE CARD IS ANSWERED WHERE THE PERSON IS READING.
   On a phone the rail sits under the page, and rdOpen does not move the
   page for a press made on the page (ui/drills.js, BRING THE DRILL INTO
   VIEW). A press made in the card is the other case it names: without this
   a row pressed near the foot of a long card left the new card's top a
   screen above. RD_INRAIL is that file's own seam, held for one drill. */
function anaRedraw(inRail){
 var was=RD_INRAIL; RD_INRAIL=!!inRail;
 try{if(S.tab===TAB.ANALYTICS)anaRender(); else anaDrill();}finally{RD_INRAIL=was;}}
addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target.closest('[data-ana],[data-anacrumb]'):null;
 if(!t)return;
 var inPage=!!t.closest('#ana'), inDrill=!!t.closest('#rdrill');
 if(!inPage&&!inDrill)return;
 if(t.hasAttribute('data-anacrumb')){
  var i=+t.getAttribute('data-anacrumb'); if(!ANA_TRAIL[i])return;
  ANA_PICK=ANA_TRAIL[i]; ANA_TRAIL=ANA_TRAIL.slice(0,i);
  anaRedraw(true);
  return;}
 /* REAL SOUND, SILENT BY DEFAULT: sfx() (ui/sound.js) already is; this is
    the one real user gesture that opens a reading from the treemap, the
    same moment ui/ui.js plays 'field' for a press on the Field's own
    wheel nodes. Scoped to the treemap's own controls so this round does
    not change what the rest of the Analytics page already sounds like. */
 if(t.closest('.ana-tm-cell,.ana-tm-head')&&typeof sfx==='function')sfx('field');
 var v=t.getAttribute('data-ana'), at=v.indexOf('|');
 anaGo(v.slice(0,at),v.slice(at+1),inPage&&!inDrill);});
/* THE ARCHETYPE PERCENT TOGGLE, its own small press, never a step in the
   trail (ANA_PICK, ANA_TRAIL above are untouched by it): it changes how a
   number already on the page is read, not what the person is looking at,
   so it redraws the page in place and opens nothing new. */
addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target.closest('[data-anamode]'):null;
 if(!t||!t.closest('#ana'))return;
 var m=t.getAttribute('data-anamode'); if(!m||m===ANA_ARCHMODE)return;
 ANA_ARCHMODE=m; anaRender();});
