/* ============================================================
   THE FLOW SECTION, FOUR WAYS. Prototype, 26 September.

   Laid over the committed build by proto/flowredesign/build.js. Nothing
   under atuned_src/ is touched. One seam: the Body page calls renderShelf by
   name with everything it has just read (the seats, flow, where it stops,
   the heaviest seat, and the marks for the layer that is picked), so this
   replaces it and draws the same data four ways. Every press goes to the
   product's own door, pmAnswer: a pattern opens runDrill, a seat opens
   runSeatFlowDrill, the same cards the section opens today.

   His words: "the flow element, that has like mania and discriminant mania
   and so on, give me four different options of this design as well, that's
   more in alignment with what we're doing now. And I'm assuming these are
   patterns that are impairing flow." He is right, and the four put that
   reading first: which pattern sits at the seat where flow closes.

     0  Shipped   the section as it is today, for comparison
     1  Rows      the list kept, each row led by its tier mark in its seat's
                  ring, with the seat it pinches in words, and no bare number
     2  Tiles     patterns as rail tiles, the seats as a row of seven marks
     3  River     the seven seats as one channel, narrowed where flow closes,
                  every pattern hung on the seat it sits at
     4  Pinch     only where flow stops and the patterns holding it there,
                  the rest one press away
   ============================================================ */
(function(){
'use strict';
var ORIG=window.renderShelf;
var FV={v:'2'};
window.FV=FV;
var FVN={'0':'Shipped','1':'Rows','2':'Tiles','3':'River','4':'Pinch'};
function e_(s){return esc(s==null?'':String(s));}
/* the tier marks the Body figure already draws, lifted from ui/map.js so a
   pattern wears the same mark here as it does on the body */
var PMIC={sab:'M12 4 L19 18 H5 Z',
 cx:'M12 4 A8 8 0 1 0 12 20 A8 8 0 1 0 12 4 M12 8 A4 4 0 1 1 12 16 A4 4 0 1 1 12 8',
 hy:'M12 3 L20 8 V16 L12 21 L4 16 V8 Z',
 sup:'M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z',
 mask:'M4 8 H20 V13 A8 8 0 0 1 4 13 Z',
 node:'M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0'};
var TIERNM={sab:'saboteur',cx:'complex',hy:'hyper-complex',sup:'character layer',mask:'mask',node:'held address'};
function tierC(k){return ({sab:PAL.Throat,cx:PAL.Solar,hy:PAL.Sacral,sup:PAL.Root,mask:PAL.Crown})[k]||'var(--mid)';}
function kindOf(m){return m.kind==='node'?'node':(m.o&&m.o.kind==='sup')?'sup':(PMLAYER==='masks'?'mask':((m.o&&m.o.kind)||'sab'));}
function glyph(k,col,w){
 return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(PMIC[k]||PMIC.sab)+'" style="stroke:'+col
  +';stroke-width:'+(w||1.8)+'"/></svg>';}
function seatG(b){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(SEATGLYPH[b]||SEATGLYPH._)+'</svg>';}
var ORDER=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'];
function seatNm(b){var s=FLOWSEAT.filter(function(p){return K2B[p.k]===b;})[0]; return s?s.n:b;}

/* ---- every pattern the reading holds, whichever layer is picked ----
   The shipped section lists one layer at a time. Options 3 and 4 read
   saboteurs, complexes, hyper-complexes and character layers together,
   because the question they answer is which pattern holds the flow, and the
   answer does not care which tier it came from. */
function allPatterns(r){
 var keep=PMLAYER, out=[];
 ['sab','cx','hyper'].forEach(function(L){PMLAYER=L; try{out=out.concat(pmMarks(r));}catch(x){}});
 PMLAYER=keep;
 return out.filter(function(m){return m.kind==='bead';});}
/* where a pattern sits, and whether it sits where flow is held.
   A pattern's addresses each have a seat. The seat it pinches is the held
   seat carrying most of its addresses; if none of its seats is held it is
   seated where most of its addresses are and pinches nothing. */
function place(m,seats){
 var cnt={}; (m.links||[]).forEach(function(n){cnt[n.b]=(cnt[n.b]||0)+1;});
 var held={}; seats.forEach(function(s){if(s.held)held[K2B[s.p.k]]=1;});
 var bs=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a];});
 var pinch=bs.filter(function(b){return held[b];});
 return {seat:bs[0]||m.band, pinch:pinch, seats:bs, n:(m.links||[]).length};}
function wlabel(v){return v>=0.75?'heavy':v>=0.45?'carrying':'light';}

/* ---- the head every option shares: flow, and where it stops ---- */
function head(seats,speed,stop,dom,loadedTot,compact){
 return '<div class="fr-hd">'+cr(K2B[dom.p.k],speed*100,{size:compact?'md':'lg',label:'flow',hot:false})
  +'<div class="fr-hs"><div class="fr-stop">'+(stop?'Stops at the <b>'+e_(stop.p.n.toLowerCase())+'</b>'
   :(loadedTot?'Passes every seat':'nothing held'))+'</div>'
  +'<div class="fr-sub">'+(loadedTot?'heaviest at the '+e_(dom.p.n.toLowerCase()):'')+'</div></div></div>';}
function seatStrip(seats){
 return '<div class="fr-seats">'+seats.map(function(s){var b=K2B[s.p.k];
  return '<button type="button" class="fr-seat'+(s.held?' held':'')+(PMPICK===s.p.k?' on':'')+'" data-seat="'+s.p.k+'"'
   +' style="--c:'+(PMC[b]||'var(--mid)')+'" aria-label="'+e_(s.p.n+(s.held?', held':', passing'))+'">'
   +seatG(b)+'<span class="fr-sp"><i style="height:'+Math.round(s.pass*100)+'%"></i></span></button>';}).join('')+'</div>';}

/* ---- 1. rows ---- */
function v1(r,seats,speed,stop,dom,loadedTot,marks){
 var beads=marks.filter(function(m){return m.kind==='bead';}).sort(function(a,b){return a.rank-b.rank;});
 var L=PML.filter(function(x){return x[0]===PMLAYER;})[0][1];
 var h=head(seats,speed,stop,dom,loadedTot)+seatStrip(seats);
 if(beads.length){
  h+='<div class="fr-eye">'+e_(L)+'</div><div class="fr-rows">';
  beads.forEach(function(m){var k=kindOf(m), P=place(m,seats), sc=PMC[P.seat]||'var(--mid)';
   h+='<button type="button" class="fr-row'+(PMPICK===m.o?' on':'')+'" data-it="'+m.rank+'">'
    +'<span class="fr-g" style="--c:'+sc+'">'+glyph(k,tierC(k))+'</span>'
    +'<span class="fr-rt"><span class="fr-nm">'+e_(m.nm)+'</span>'
    +'<span class="fr-ln">'+(P.pinch.length?'pinches the '+e_(seatNm(P.pinch[0]).toLowerCase()):'sits at the '+e_(seatNm(P.seat).toLowerCase()))
    +', '+wlabel(m.v)+'</span></span>'
    +'<span class="fr-w" aria-hidden="true"><i style="width:'+Math.round(m.v*100)+'%;background:'+sc+'"></i></span></button>';});
  h+='</div>';}
 else h+='<p class="fr-none">'+(loadedTot?'No '+e_(L.toLowerCase())+' in this reading.':'nothing held')+'</p>';
 return h;}

/* ---- 2. tiles ---- */
function v2(r,seats,speed,stop,dom,loadedTot,marks){
 var beads=marks.filter(function(m){return m.kind==='bead';}).sort(function(a,b){return a.rank-b.rank;});
 var L=PML.filter(function(x){return x[0]===PMLAYER;})[0][1];
 var h=head(seats,speed,stop,dom,loadedTot)+seatStrip(seats);
 if(beads.length){
  h+='<div class="fr-eye">'+e_(L)+'</div><div class="fr-tiles">';
  beads.forEach(function(m){var k=kindOf(m), P=place(m,seats), sc=PMC[P.seat]||'var(--mid)';
   /* weight is the width of the stroke, the way the body figure spends it */
   h+='<div class="fr-cell"><button type="button" class="ib fr-ib'+(P.pinch.length?' pinch':'')+'" data-it="'+m.rank+'"'
    +' aria-pressed="'+(PMPICK===m.o)+'" style="--c:'+tierC(k)+';--s:'+sc+'" aria-label="'+e_(m.nm+', '+TIERNM[k])+'">'
    +glyph(k,tierC(k),(1.3+m.v*1.6).toFixed(2))+'<span class="fr-dot" style="background:'+sc+'"></span></button>'
    +'<span class="fr-tn">'+e_(m.nm)+'</span></div>';});
  h+='</div><p class="fr-key">Ringed in the seat colour where it pinches flow. A heavier stroke is a heavier pattern.</p>';}
 else h+='<p class="fr-none">'+(loadedTot?'No '+e_(L.toLowerCase())+' in this reading.':'nothing held')+'</p>';
 return h;}

/* ---- 3. river ---- */
function v3(r,seats,speed,stop,dom,loadedTot){
 var pats=allPatterns(r).sort(function(a,b){return b.v-a.v;}), by={};
 pats.forEach(function(m){var P=place(m,seats); m._p=P; (by[P.seat]=by[P.seat]||[]).push(m);});
 var h=head(seats,speed,stop,dom,loadedTot,true);
 var rowH=46, W=92, cx=46, top=10, H=top*2+rowH*7;
 var pts=seats.map(function(s,i){return {y:top+rowH*i+rowH/2, w:4+s.pass*22, s:s};});
 var lf='', rt='';
 pts.forEach(function(p,i){lf+=(i?'L':'M')+(cx-p.w/2).toFixed(1)+' '+p.y.toFixed(1); rt=' L'+(cx+p.w/2).toFixed(1)+' '+p.y.toFixed(1)+rt;});
 var d=lf+rt.replace(/^ L/,' L')+' Z';
 h+='<div class="fr-river" style="height:'+H+'px"><svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" class="fr-rsv" aria-hidden="true">'
  +'<path d="'+d+'" class="fr-ch"/>';
 pts.forEach(function(p){var b=K2B[p.s.p.k];
  h+='<circle cx="'+cx+'" cy="'+p.y+'" r="3.2" style="fill:'+(p.s.held?(PMC[b]||'#999'):'var(--bg)')+';stroke:'+(PMC[b]||'#999')+'" class="fr-sd"/>';
  if(stop&&stop.p.k===p.s.p.k)h+='<path d="M'+(cx-20)+' '+(p.y-9)+'h40" class="fr-stopl"/>';});
 h+='</svg><div class="fr-rl">';
 pts.forEach(function(p){var b=K2B[p.s.p.k], list=by[b]||[];
  h+='<div class="fr-rrow" style="top:'+(p.y-rowH/2)+'px;height:'+rowH+'px">'
   +'<button type="button" class="fr-rseat'+(p.s.held?' held':'')+'" data-seat="'+p.s.p.k+'" style="--c:'+(PMC[b]||'var(--mid)')+'">'
   +e_(p.s.p.n)+(list.length>3?'<small>'+list.length+' here</small>':'')+'</button><span class="fr-beads">'
   +list.slice(0,3).map(function(m){var k=kindOf(m);
    return '<button type="button" class="fr-bead'+(m._p.pinch.length?' pinch':'')+'" data-pat="'+e_(m.nm)+'" style="--c:'+(PMC[b]||'var(--mid)')+'"'
     +' aria-label="'+e_(m.nm+', '+TIERNM[k])+'">'+glyph(k,tierC(k),(1.3+m.v*1.6).toFixed(2))+'</button>';}).join('')
   +'</span></div>';});
 h+='</div></div>';
 /* the names, once, under the picture, grouped by the seat they hang on */
 var held=pats.filter(function(m){return m._p.pinch.length;});
 if(held.length)h+='<div class="fr-eye">At the seats holding flow</div><div class="fr-names">'
  +held.slice(0,6).map(function(m){var k=kindOf(m);return '<button type="button" class="fr-name" data-pat="'+e_(m.nm)+'">'
   +glyph(k,tierC(k))+'<span>'+e_(m.nm)+'</span><em>'+e_(seatNm(m._p.pinch[0]).toLowerCase())+'</em></button>';}).join('')+'</div>';
 else if(!pats.length)h+='<p class="fr-none">nothing held</p>';
 FV.pats=pats; return h;}

/* ---- 4. pinch ---- */
function v4(r,seats,speed,stop,dom,loadedTot){
 var pats=allPatterns(r);
 pats.forEach(function(m){m._p=place(m,seats);});
 var h=head(seats,speed,stop,dom,loadedTot);
 if(!pats.length){FV.pats=pats;return h+'<p class="fr-none">nothing held</p>';}
 var at=stop?K2B[stop.p.k]:null;
 /* ranked by how much of the pattern sits where flow is held */
 var hold=pats.filter(function(m){return m._p.pinch.length;})
  .sort(function(a,b){var A=(at&&a._p.pinch.indexOf(at)>=0)?1:0, B=(at&&b._p.pinch.indexOf(at)>=0)?1:0;
   return (B-A)||(b.v-a.v);});
 /* where no seat is held, nothing is holding flow, and the section says so
    and shows what runs heaviest anyway, marked as running rather than holding */
 var none=!hold.length; if(none)hold=pats.slice().sort(function(a,b){return b.v-a.v;});
 h+='<div class="fr-eye">'+(none?'Nothing holds it. Heaviest running':'What holds it')+'</div>';
 hold.slice(0,3).forEach(function(m){var k=kindOf(m), b=none?m._p.seat:m._p.pinch[0], sc=PMC[b]||'var(--mid)';
  h+='<button type="button" class="fr-pc" data-pat="'+e_(m.nm)+'" style="--c:'+sc+'">'
   +'<span class="fr-g" style="--c:'+sc+'">'+glyph(k,tierC(k))+'</span>'
   +'<span class="fr-rt"><span class="fr-nm">'+e_(m.nm)+'</span>'
   +'<span class="fr-ln">A '+TIERNM[k]+' at the '+e_((none?[m._p.seat]:m._p.pinch).map(function(x){return seatNm(x).toLowerCase();}).join(' and '))+'.</span></span></button>';});
 var rest=pats.filter(function(m){return hold.slice(0,3).indexOf(m)<0;});
 h+='<button type="button" class="fr-more-b" id="fr-all" aria-expanded="'+(!!FV.all)+'"><span>Every pattern'
  +(rest.length?', '+rest.length+' more':'')+'</span><i></i></button>';
 if(FV.all)h+='<div class="fr-names">'+rest.sort(function(a,b){return b.v-a.v;}).map(function(m){var k=kindOf(m);
  return '<button type="button" class="fr-name" data-pat="'+e_(m.nm)+'">'+glyph(k,tierC(k))+'<span>'+e_(m.nm)+'</span><em>'
   +e_(seatNm(m._p.seat).toLowerCase())+'</em></button>';}).join('')+'</div>'+seatStrip(seats);
 FV.pats=pats; return h;}

function chrome(){
 return '<div class="fr-proto" data-proto="1"><span>Prototype only</span><div class="fr-seg">'
  +['0','1','2','3','4'].map(function(k){return '<button type="button" data-fv="'+k+'" aria-pressed="'+(FV.v===k)+'">'+FVN[k]+'</button>';}).join('')
  +'</div></div>';}
window.renderShelf=function(r,seats,speed,stop,dom,loadedTot,marks){
 var el=document.getElementById('eshelf'); if(!el)return;
 if(FV.v==='0'){ORIG(r,seats,speed,stop,dom,loadedTot,marks); el.insertAdjacentHTML('afterbegin',chrome()); wireChrome(el); return;}
 var fn={'1':v1,'2':v2,'3':v3,'4':v4}[FV.v];
 el.innerHTML=chrome()+'<div class="fr-root fr-v'+FV.v+'">'+fn(r,seats,speed,stop,dom,loadedTot,marks)+'</div>';
 wireChrome(el);
 el.querySelectorAll('[data-it]').forEach(function(b){b.onclick=function(){
  var hit=marks.filter(function(m){return m.kind==='bead'&&m.rank===+b.dataset.it;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o; S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; pmAnswer(PMPICK,false,true);};});
 el.querySelectorAll('[data-pat]').forEach(function(b){b.onclick=function(){
  var nm=b.getAttribute('data-pat'), hit=(FV.pats||[]).filter(function(m){return m.nm===nm;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o; S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; pmAnswer(PMPICK,false,true);};});
 el.querySelectorAll('[data-seat]').forEach(function(b){b.onclick=function(){
  PMPICK=(PMPICK===b.dataset.seat)?null:b.dataset.seat; pmAnswer(PMPICK,false,true);};});
 var al=document.getElementById('fr-all'); if(al)al.onclick=function(){FV.all=!FV.all; render();};};
function wireChrome(el){
 el.querySelectorAll('[data-fv]').forEach(function(b){b.onclick=function(){FV.v=b.getAttribute('data-fv');
  try{history.replaceState(null,'','#'+FV.v+'-'+(FV.who||'james'));}catch(x){} render();};});}
})();
