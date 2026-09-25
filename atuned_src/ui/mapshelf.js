
/* ============================================================
   THE ENERGY SHELF. The original built all of this every frame and
   dropped it, because no element with this id existed in the markup.
   B19 scope: the ring carries the one headline value. Seat rows and
   deltas stay bare numbers.
   ============================================================ */
function renderShelf(r,seats,speed,stop,dom,loadedTot,marks){
 var el=document.getElementById('eshelf'); if(!el)return;
 var sh='<div class="pm-hd">'
  /* FLOW, NOT FLOW THROUGH. Ruled in COPY.md by name, and the quantity is
     called Flow on the key strip and in its own drill. One word per concept. */
  +'<div><div class="pm-eye">Flow</div>'
  /* flow through is a share that passes, so its high end is the good one and
    it never prints in the alarm colour. */
  +cr(K2B[dom.p.k], speed*100, {size:'lg',label:'flow',hot:false})
  +'<div class="pm-sub">'+(stop?('stops at the '+stop.p.n.toLowerCase())
    :(loadedTot?'passing every seat':'nothing held'))+'</div></div>'
  /* The label used to swap identity with the state, reading "Heaviest seat"
     when loaded and "Field clear" when not, while the value swapped too. A
     slot keeps its label; the value carries the state. And the empty state is
     said one way across the app: "nothing held". */
  +'<div class="pm-side"><div class="pm-eye">Heaviest seat</div>'
  +'<div class="pm-dom" style="color:'+(loadedTot?PMC[K2B[dom.p.k]]:'var(--dim)')+'">'
  +(loadedTot?dom.p.n:'nothing held')+'</div>'
  +'<div class="pm-sub">'+(loadedTot?loadedTot+' held':'')+'</div></div></div>';

 var beads=marks.filter(function(m){return m.kind==='bead';}).sort(function(a,b){return a.rank-b.rank;});
 var layerNm=PML.filter(function(L){return L[0]===PMLAYER;})[0][1];
 if(beads.length){
  sh+='<div class="pm-eye" style="margin-top:14px">'+layerNm+', '+beads.length+'</div><div class="pm-list">';
  beads.forEach(function(m){
   sh+='<button class="pm-li'+(PMPICK===m.o?' on':'')+'" data-it="'+m.rank+'">'
    +'<i style="background:'+(PMC[m.band]||'#888')+'"></i>'
    +'<span class="pm-ln">'+esc(m.nm)+'</span>'
    +'<span class="pm-lw">'+(m.v*10).toFixed(1)+'</span>'
    +(m.sub?'<span class="pm-ls">'+esc(m.sub)+'</span>':'')
    +'<span class="pm-lk">'+m.links.length+' addr</span></button>';});
  sh+='</div>';
 } else if(PMLAYER==='bands'||PMLAYER==='pain'){
  var top=marks.slice().sort(function(a,b){return b.v-a.v;}).slice(0,10);
  sh+='<div class="pm-eye" style="margin-top:14px">'
   +(PMLAYER==='pain'?'Above the line':'Held addresses')+', '+marks.length+'</div><div class="pm-list">';
  top.forEach(function(m){
   var opp=(CHILD.filter(function(c){return c.nm===m.o.cf;})[0]||{}).opp||'';
   sh+='<button class="pm-li" data-seat="'+B2K[m.band]+'"><i style="background:'+(PMC[m.band]||'#888')+'"></i>'
    +'<span class="pm-ln">'+esc(m.nm)+'</span>'
    +'<span class="pm-lw">'+m.o.sq.toFixed(1)+'</span>'
    +'<span class="pm-ls">toward '+esc(opp||'no pole')+'</span>'
    +'<span class="pm-lk">'+m.band+'</span></button>';});
  sh+='</div>';}

 /* THE ANSWER TO A PRESS IS NOT PRINTED HERE ANY MORE. It was, three times
    over: a pain region under the rows, a pattern under the legend, a seat
    under the seats. This shelf sits in the Flow section, below Reading and
    Selection, so every one of them landed at the bottom of a long rail.
    Measured on Gordon at 1600: a person scrolls to the first saboteur row,
    presses it at y 545, and its answer printed at y 3,124, 2,579 pixels
    under the row, while the Selection section above still read "Nothing
    selected". A ring on the figure put it at 4,626. And a mask threw: a mask
    has no parts, so leaves() handed back the mask itself as its own address,
    n.sq was undefined, and every render of the Body page failed until the
    pick changed.

    Every press now opens its answer through pmAnswer below, in Selection,
    which is where every other surface answers and which rdOpen brings into
    view. The rows and the seats stay here and still show what is picked. */

 /* the legend. what a row means on THIS layer. */
 var LEG={
  bands:[['a row','one held fetter and the child emotion it runs on'],['colour','the seat it lives at'],
   ['number','SQ held there']],
  sab:[['a row','one saboteur, matched on charge ranges'],['colour','saboteur tier'],
   ['number','its weight'],['sub-line','match percentage and addresses beneath']],
  cx:[['a row','two saboteurs of one family compounded'],['number','mean weight']],
  hyper:[['a row','two complexes compounded, or two hyper co-mingled'],
   ['colour','orange hyper, red character'],['sub-line','clinical bridge']],
  masks:[['a row','one of six developmental eras'],['number','load beneath it'],
   ['sub-line','the seats it speaks from']],
  pain:[['a row','an address above the loaded line'],['number','how far above']],
  nerves:[['a bar','the share that seat passes upward'],['dashed line','the first seat holding'],
   ['left','held count'],['right','pass percentage']]}[PMLAYER]||[];
 if(LEG.length){
  sh+='<div class="pm-eye" style="margin-top:14px">Legend</div><div class="pm-leg">';
  LEG.forEach(function(L){sh+='<span class="pm-lgk">'+L[0]+'</span><span class="pm-lgv">'+L[1]+'</span>';});
  sh+='</div>';}

 /* the seven seats. bare numbers, per B19. */
 sh+='<div class="pm-eye" style="margin-top:14px">Seats</div><div class="pm-seats">';
 seats.forEach(function(s){var b=PMBANDS.filter(function(x){return x.k===s.p.k;})[0];
  sh+='<button class="pm-sr'+(PMPICK===s.p.k?' on':'')+(s.hot?'':' clear')+'" data-seat="'+s.p.k+'">'
   +'<i style="background:'+b.c+'"></i><span class="pm-sn">'+s.p.n+'</span>'
   +'<span class="pm-gauge"><b style="width:'+Math.round(s.pass*100)+'%;background:'+b.c+'"></b></span>'
   +'<span class="pm-sv">'+(s.hot?s.hot+' held':'clear')+'</span>'
   +'<span class="pm-sp">'+Math.round(s.pass*100)+'%</span>'
   +'<span class="pm-sk">'+s.p.nv+'</span></button>';});
 sh+='</div>';
 el.innerHTML=sh;
 el.querySelectorAll('[data-it]').forEach(function(b){b.onclick=function(){
  var hit=marks.filter(function(m){return m.kind==='bead'&&m.rank===+b.dataset.it;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o;
  S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; pmAnswer(PMPICK,false,true);};});
 el.querySelectorAll('[data-seat]').forEach(function(b){b.onclick=function(){
  PMPICK=(PMPICK===b.dataset.seat)?null:b.dataset.seat; pmAnswer(PMPICK,false,true);};});
}

/* ============================================================
   BODY ANSWERS WHERE EVERYTHING ELSE ANSWERS.

   One press, one door, and every kind goes to the drill that already exists
   for it, which is the rule the codex already keeps in kbOpen. A saboteur,
   a complex, a hyper-complex and a character layer are the same objects the
   Field and the codex open with runDrill, so they open with runDrill here:
   the shelf had a second, shorter renderer for them, which is two places for
   one reading to disagree, and it printed the clinical correspondence that
   ui.js keeps off this person's screen by name. The Hyper rows above still
   print it on their sub-line, "bipolar · ADHD" on Gordon, which is a
   separate defect and is not widened into this one. A mask opens the
   codex's own mask entry, the only door a mask has, because it is a shape
   over seats and not a set of addresses.

   A seat read for flow and a pain region have no door anywhere else. Their
   readings are the two the shelf printed, moved rather than rewritten, so
   the numbers are the ones a person was already shown.

   A press that puts the pick down puts the answer down with it. The
   render comes after the drill, the order the Field's presses use.

   inRail is true for the shelf's own rows, which sit in the same rail as
   the answer, so on a phone the answer is still brought into view for
   them. See the phone half of the test in rdOpen. The flag is dropped in a
   finally, because a drill that threw would otherwise leave it set for the
   next press, which might be one made on the stage. */
function pmAnswer(pick,pain,inRail){
 if(!pick){rdClose();return;}
 RD_INRAIL=!!inRail;
 try{
  if(pain)runPainDrill(pick);
  else if(typeof pick==='string')runSeatFlowDrill(pick);
  else if(pick.kind)runDrill(pick);
  else {var mk=MASKS.filter(function(m){return m.nm===pick.nm;})[0];
   if(mk)kbOpen({k:'mask',o:mk});}
 }finally{RD_INRAIL=false;}
 render();}
/* one seat, read for flow: what passes, what is held, which laws sit here */
function runSeatFlowDrill(k){
 var seats=flSeats();
 var sd=FLOWSEAT.filter(function(p){return p.k===k;})[0];
 var ss=seats.filter(function(x){return x.p.k===k;})[0],bnd=K2B[k];
 if(!sd||!ss)return;
 var seg=W.filter(function(n){return n.b===bnd;}).sort(function(a,b){return b.sq-a.sq;});
 var lws=SI.filter(function(l){return l.b===bnd;});
 var h='<div class="pm-eye">'+sd.sk+' · '+sd.hz+' Hz · source '+sd.src+'</div>'
  +'<div class="pm-dn">'+sd.n+'</div><div class="pm-dm"><b>'+sd.nv+'</b><br>vritti '+sd.vt
  +'<br>seated at '+sd.seat+'</div>'
  +'<div class="pm-grid"><span>passes</span><b>'+Math.round(ss.pass*100)+'%</b>'
  +'<span>held</span><b>'+ss.hot+'</b>'
  +'<span>mean SQ</span><b>'+ss.mean.toFixed(1)+'</b>'
  +'<span>integrity</span><b>'+bandIg(bnd).toFixed(1)+'</b></div>'
  +'<div class="pm-eye" style="margin-top:12px">Moral integrity seated here</div><div class="pm-chips">'
  +lws.map(function(l){return '<span class="pm-chip" style="opacity:'
    +(0.4+S.law[l.nm]/10*0.6).toFixed(2)+'">'+l.nm+' '+S.law[l.nm].toFixed(1)+'</span>';}).join('')+'</div>'
  +'<div class="pm-eye" style="margin-top:12px">Addresses</div><div class="pm-rows">';
 seg.slice(0,8).forEach(function(n){
  var opp3=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
  h+='<div class="pm-r"><span>'+String(n.i).padStart(3,'0')+' '+esc(n.k)+'</span><em>toward '
   +esc(opp3||'no pole')+(n.pole>=4?', installed':'')+'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
 h+='</div>';
 rdShell(h);}
/* one painted region: what it presents as, and what is heaviest under it */
function runPainDrill(k){
 var rg=PAINREG.filter(function(p){return p.k===k;})[0]; if(!rg)return;
 var rn=W.filter(function(n){return rg.bands.indexOf(n.b)>=0&&n.sq>=LOADED+1;})
  .sort(function(a,b){return b.sq-a.sq;});
 var h='<div class="pm-eye">Pain region</div><div class="pm-dn">'+rg.nm+'</div>'
  +'<div class="pm-dm">'+rg.bands.join(' + ')+' · '+rn.length+' addresses above the line</div>'
  +'<div class="pm-eye" style="margin-top:12px">Commonly presents as</div>'
  +'<div class="pm-dm" style="color:var(--mid)">'+rg.common+'</div>'
  +'<div class="pm-eye" style="margin-top:12px">The pattern under it</div>'
  +'<div class="pm-pat">'+rg.pattern+'</div>';
 if(rn.length){h+='<div class="pm-eye" style="margin-top:12px">Heaviest here</div><div class="pm-rows">';
  rn.slice(0,6).forEach(function(n){
   var opp=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
   h+='<div class="pm-r"><span>'+esc(n.k)+'</span><em>toward '+esc(opp||'no pole')
    +'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
  h+='</div>';}
 rdShell(h);}
