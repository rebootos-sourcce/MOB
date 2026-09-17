
/* ============================================================
   THE ENERGY SHELF. The original built all of this every frame and
   dropped it, because no element with this id existed in the markup.
   B19 scope: the ring carries the one headline value. Seat rows and
   deltas stay bare numbers.
   ============================================================ */
function renderShelf(r,seats,speed,stop,dom,loadedTot,marks){
 var el=document.getElementById('eshelf'); if(!el)return;
 var sh='<div class="pm-hd">'
  +'<div><div class="pm-eye">Flow through</div>'
  +cr(K2B[dom.p.k], speed*100, {size:'lg',label:'flow through'})
  +'<div class="pm-sub">'+(stop?('stops at the '+stop.p.n.toLowerCase())
    :(loadedTot?'passing every seat':'nothing held'))+'</div></div>'
  /* The label used to swap identity with the state, reading "Heaviest seat"
     when loaded and "Field clear" when not, while the value swapped too. A
     slot keeps its label; the value carries the state. And the empty state is
     said one way across the app: "nothing held". */
  +'<div class="pm-side"><div class="pm-eye">Heaviest seat</div>'
  +'<div class="pm-dom" style="color:'+(loadedTot?PMC[K2B[dom.p.k]]:'var(--dim)')+'">'
  +(loadedTot?dom.p.n:'nothing held')+'</div>'
  +'<div class="pm-sub">'+loadedTot+' of '+NODES.length+' held</div></div></div>';

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

 if(PMLAYER==='pain'&&PAINPICK){
  var rg=PAINREG.filter(function(p){return p.k===PAINPICK;})[0];
  var rn=W.filter(function(n){return rg.bands.indexOf(n.b)>=0&&n.sq>=LOADED+1;})
   .sort(function(a,b){return b.sq-a.sq;});
  sh+='<div class="pm-det"><div class="pm-eye">Pain region</div><div class="pm-dn">'+rg.nm+'</div>'
   +'<div class="pm-dm">'+rg.bands.join(' + ')+' · '+rn.length+' addresses above the line</div>'
   +'<div class="pm-eye" style="margin-top:12px">Commonly presents as</div>'
   +'<div class="pm-dm" style="color:var(--mid)">'+rg.common+'</div>'
   +'<div class="pm-eye" style="margin-top:12px">The pattern under it</div>'
   +'<div class="pm-pat">'+rg.pattern+'</div>';
  if(rn.length){sh+='<div class="pm-eye" style="margin-top:12px">Heaviest here</div><div class="pm-rows">';
   rn.slice(0,6).forEach(function(n){
    var opp=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
    sh+='<div class="pm-r"><span>'+esc(n.k)+'</span><em>toward '+esc(opp||'no pole')
     +'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
   sh+='</div>';}
  sh+='</div>';}

 /* the legend. what a row means on THIS layer. */
 var LEG={
  bands:[['a row','one held address and its own fetter'],['colour','the seat it lives at'],
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

 /* detail for whatever is picked */
 if(PMPICK&&typeof PMPICK==='object'){
  var o=PMPICK;
  if(o.i!==undefined){                                      /* an address */
   var opp2=(CHILD.filter(function(c){return c.nm===o.cf;})[0]||{}).opp||'';
   var owners=[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(function(z){return leaves(z).indexOf(o)>=0;});
   sh+='<div class="pm-det"><div class="pm-eye">'+esc(o.b||'')+'</div>'
    +'<div class="pm-dn">'+esc(o.k)+'</div>'
    +'<div class="pm-dm">'+o.b+' · '+(o.n||'field anchor')+'<br>axis '+esc(o.a||'')+'</div>'
    +'<div class="pm-grid"><span>held</span><b>'+o.held.toFixed(1)+'</b>'
    +'<span>opposite in</span><b>'+o.rep.toFixed(1)+'</b>'
    +'<span>SQ</span><b>'+o.sq.toFixed(1)+'</b>'
    +'<span>moving toward</span><b>'+esc(opp2||'no pole')+'</b></div>'
    +'<div class="pm-eye" style="margin-top:12px">Feeds '+owners.length+'</div><div class="pm-chips">'
    +(owners.length?owners.slice(0,8).map(function(z){
      return '<span class="pm-chip'+(z.over?' over':'')+'">'+esc(z.nm)+' '+z.w.toFixed(1)+'</span>';}).join('')
      :'<span class="pm-chip">nothing compounds from here</span>')+'</div></div>';
  } else {                                                  /* a pattern */
   var lv=leaves(o), bs=[];lv.forEach(function(n){if(bs.indexOf(n.b)<0)bs.push(n.b);});
   sh+='<div class="pm-det"><div class="pm-eye">'
    +({sab:'Saboteur',cx:'Complex',hy:'Hyper-complex',sup:'Character layer'}[o.kind]||'Mask')
    +(o.over?', overshot':'')+'</div><div class="pm-dn">'+esc(o.nm)+'</div>'
    +'<div class="pm-dm">'+(o.auth?esc(o.auth)+'<br>':'')+(o.sub?esc(o.sub)+'<br>':'')
    +(o.score?o.score+'% match'+(o.exact?', every charge inside its range':'')+'<br>':'')
    +'built from '+lv.length+' addresses across '+bs.length+' seats<br>'+bs.join(', ')+'</div>'
    +'<div class="pm-eye" style="margin-top:12px">Made of</div><div class="pm-rows">';
   lv.slice(0,8).forEach(function(n){
    var op=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
    sh+='<div class="pm-r"><span>'+String(n.i).padStart(3,'0')+' '+esc(n.k)+'</span><em>toward '
     +esc(op||'no pole')+'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
   if(lv.length>8)sh+='<div class="pm-more">and '+(lv.length-8)+' more</div>';
   sh+='</div></div>';}}

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
 if(PMPICK&&typeof PMPICK==='string'){
  var sd=FLOWSEAT.filter(function(p){return p.k===PMPICK;})[0];
  var ss=seats.filter(function(x){return x.p.k===PMPICK;})[0],bnd=K2B[PMPICK];
  var seg=W.filter(function(n){return n.b===bnd;}).sort(function(a,b){return b.sq-a.sq;});
  var lws=SI.filter(function(l){return l.b===bnd;});
  sh+='<div class="pm-det"><div class="pm-eye">'+sd.sk+' · '+sd.hz+' Hz · source '+sd.src+'</div>'
   +'<div class="pm-dn">'+sd.n+'</div><div class="pm-dm"><b>'+sd.nv+'</b><br>vritti '+sd.vt
   +'<br>seated at '+sd.seat+'</div>'
   +'<div class="pm-grid"><span>passes</span><b>'+Math.round(ss.pass*100)+'%</b>'
   +'<span>held</span><b>'+ss.hot+' of '+ss.tot+'</b>'
   +'<span>mean SQ</span><b>'+ss.mean.toFixed(1)+'</b>'
   +'<span>integrity</span><b>'+bandIg(bnd).toFixed(1)+'</b></div>'
   +'<div class="pm-eye" style="margin-top:12px">Laws seated here</div><div class="pm-chips">'
   +lws.map(function(l){return '<span class="pm-chip" style="opacity:'
     +(0.4+S.law[l.nm]/10*0.6).toFixed(2)+'">'+l.nm+' '+S.law[l.nm].toFixed(1)+'</span>';}).join('')+'</div>'
   +'<div class="pm-eye" style="margin-top:12px">Addresses</div><div class="pm-rows">';
  seg.slice(0,8).forEach(function(n){
   var opp3=(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'';
   sh+='<div class="pm-r"><span>'+String(n.i).padStart(3,'0')+' '+esc(n.k)+'</span><em>toward '
    +esc(opp3||'no pole')+(n.pole>=4?', installed':'')+'</em><b>'+n.sq.toFixed(1)+'</b></div>';});
  sh+='</div></div>';}
 el.innerHTML=sh;
 el.querySelectorAll('[data-it]').forEach(function(b){b.onclick=function(){
  var hit=marks.filter(function(m){return m.kind==='bead'&&m.rank===+b.dataset.it;})[0];
  var o=hit&&hit.o; PMPICK=(PMPICK===o)?null:o;
  S.pin=(PMPICK&&typeof PMPICK==='object')?PMPICK:null; render();};});
 el.querySelectorAll('[data-seat]').forEach(function(b){b.onclick=function(){
  PMPICK=(PMPICK===b.dataset.seat)?null:b.dataset.seat; render();};});
}
