
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
 if(L==='pain')  return W.filter(function(n){return n.sq>=LOADED+1;})
   .map(function(n){return {o:n,kind:'heat',band:n.b,v:(n.sq-LOADED)/(10-LOADED),nm:n.k,links:[]};});
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

function renderMap(r){
 var host=document.getElementById('emap');if(!host)return;
 var seats=flSeats(),speed=flSpeed(),loadedTot=W.filter(function(n){return n.sq>=LOADED;}).length;
 var stop=null;seats.slice().reverse().forEach(function(s){if(!stop&&s.held)stop=s;});
 var dom=seats.slice().sort(function(a,b){return b.hot-a.hot||b.load-a.load;})[0];
 var marks=pmPlace(pmMarks(r));
 var domc=PMC[K2B[dom.p.k]]||'var(--gold)';
 var h='<div class="pm-top">';
 PML.forEach(function(L){h+='<button class="pm-lb'+(PMLAYER===L[0]?' on':'')+'" data-pml="'+L[0]+'">'+L[1]+'</button>';});
 h+='</div>';
 if(PMLAYER==='pain'){
  h+='<div class="pm-reg"><span class="pm-eye">Front view, select a region</span><div class="pm-regb">';
  h+='<button class="pm-rb'+(PAINPICK?'':' on')+'" data-reg="">All</button>';
  PAINREG.forEach(function(p){
   h+='<button class="pm-rb'+(PAINPICK===p.k?' on':'')+'" data-reg="'+p.k+'">'+p.nm+'</button>';});
  h+='</div></div>';}
 h+='<div class="pm-well">'
  +'<div class="pm-aura" style="background:radial-gradient(ellipse 62% 48% at 50% 40%,'+domc
  +' 0%,transparent 70%);opacity:'+(0.08+r.radiance*0.30).toFixed(3)+'"></div>'
  +'<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" class="pm-svg">';
 h+='<clipPath id="pmClip"><g transform="translate('+PMTX+','+PMTY+') scale('+PMS+')"><path d="'+BODYPATH+'"/></g></clipPath>';
 /* the base figure. raster when present, vector when not. */
 var IMG=(PMLAYER==='pain')?FIG_PAIN:FIG_FETTER, IAR=(PMLAYER==='pain')?FIG_PAIN_AR:FIG_FETTER_AR;
 if(ART_OK[IMG]){
  var IH=96, IW=IH*IAR, IX=50-IW/2;
  h+='<image class="pm-art" href="'+IMG+'" x="'+IX.toFixed(2)+'" y="2" width="'+IW.toFixed(2)
   +'" height="'+IH+'" preserveAspectRatio="xMidYMid meet"/>';
 }else{
  h+='<g class="pm-vec" transform="translate('+PMTX+','+PMTY+') scale('+PMS+')">'
   +'<path d="'+BODYPATH+'" fill="rgba(128,128,128,.045)" stroke="currentColor" '
   +'stroke-width="1.6" vector-effect="non-scaling-stroke" opacity=".34"/></g>';
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
 /* the seven seats, always */
 PMBANDS.forEach(function(b){
  var st=seats.filter(function(s){return s.p.k===b.k;})[0],rr=(b.r/10)*(0.5+(st.load||0)*0.95);
  h+='<circle cx="50" cy="'+b.yp+'" r="'+(rr*2.1).toFixed(2)+'" fill="'+b.c+'" opacity="'+(0.04+st.load*0.2).toFixed(3)+'"/>'
   +'<circle class="pm-seat" data-seat="'+b.k+'" cx="50" cy="'+b.yp+'" r="'+Math.max(1.3,rr).toFixed(2)
   +'" fill="'+b.c+'" opacity="'+(0.55+st.load*0.45).toFixed(2)+'"><title>'+b.nm+', '+st.hot
   +' held</title></circle>'
   +'<circle cx="50" cy="'+b.yp+'" r="'+Math.max(1.3,rr).toFixed(2)+'" fill="none" stroke="'+b.c
   +'" stroke-width=".32" opacity=".85"/>';});
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
 /* THE GUTTER. one layout, five uses. */
 var TIERC={sab:PAL.Throat,cx:PAL.Solar,hy:PAL.Sacral,sup:PAL.Root,mask:PAL.Crown};
 var gut=marks.slice();
 if(PMLAYER==='pain'&&PAINPICK){var reg=PAINREG.filter(function(p){return p.k===PAINPICK;})[0];
  gut=gut.filter(function(x){return reg.bands.indexOf(x.band)>=0;});}
 if(PMLAYER==='nerves') gut=[];
 /* an installed pole is not load. a cleared field lists nothing and says so. */
 if(PMLAYER==='bands'||PMLAYER==='pain')
  gut=gut.filter(function(x){return x.o&&x.o.sq>=LOADED;});
 gut.sort(function(a,b){ if(a.kind==='bead') return b.v-a.v;
  return PMYP[B2K[a.band]]-PMYP[B2K[b.band]]||b.v-a.v;});
 var isBead=(gut[0]&&gut[0].kind==='bead');
 if(isBead) gut=gut.slice(0,12);
 var ROWH=isBead?6.4:3.4, capN=Math.floor(96/ROWH);
 var cols=[[],[]];gut.forEach(function(x,i){cols[i%2].push(x);});
 cols.forEach(function(col,ci){
  var side=ci?1:-1, n=Math.min(col.length,capN);
  col.slice(0,n).forEach(function(x,k){
   var y=2+(n<=1?47:k*(96/(n-1)));
   x.gy=y; x.gside=side;
   var lx=side<0?26.5:73.5;
   var c=x.kind==='bead'
    ? (TIERC[(x.o.kind==='sup')?'sup':(PMLAYER==='masks'?'mask':(x.o.kind||'sab'))]||'#DFCC7E')
    : (PMC[x.band]||'#888');
   var on=(PMPICK===x.o), dim=(PMPICK&&!on)?0.25:1;
   var seats2;
   if(x.kind==='bead'){
    var tal={}; x.links.forEach(function(n){var k3=B2K[n.b]; if(k3)tal[k3]=(tal[k3]||0)+n.sq;});
    var ks=Object.keys(tal).sort(function(p,q){return tal[q]-tal[p];});
    seats2 = on ? ks : ks.slice(0,1);
   } else seats2=[B2K[x.band]];
   seats2.forEach(function(k2){ var sy=PMYP[k2]; if(sy==null)return;
    h+='<path d="M'+lx.toFixed(1)+','+y.toFixed(2)+' L'+(lx+side*2).toFixed(1)+','+y.toFixed(2)
     +' Q'+(50+side*17).toFixed(1)+','+((y+sy)/2).toFixed(2)+' '+(50+side*6).toFixed(1)+','+sy.toFixed(2)
     +'" fill="none" stroke="'+(PMC[K2B[k2]]||c)+'" stroke-width="'+(on?0.5:0.16)
     +'" opacity="'+(on?0.9:0.15*dim).toFixed(2)+'"/>';});
   h+='<rect class="pm-gr" data-gi="'+gut.indexOf(x)+'" x="'+(side<0?2:73).toFixed(1)+'" y="'+(y-ROWH/2+0.2).toFixed(2)
    +'" width="25" height="'+(ROWH-0.6).toFixed(2)+'" rx=".8" fill="'+c+'" opacity="'+(on?0.2:0.001)+'"/>'
    +'<rect x="'+(side<0?25.3:73.5).toFixed(1)+'" y="'+(y-1).toFixed(2)+'" width="1.2" height="2" rx=".3" fill="'+c
    +'" opacity="'+(on?1:0.75*dim).toFixed(2)+'"/>'
    +'<text x="'+(side<0?24.4:75.2).toFixed(1)+'" y="'+(y+0.5).toFixed(2)+'" text-anchor="'+(side<0?'end':'start')
    +'" class="pm-gl" style="fill:'+c+'" opacity="'+(on?1:0.92*dim).toFixed(2)+'">'
    +esc(x.nm.length>(isBead?26:22)?x.nm.slice(0,(isBead?25:21))+'…':x.nm)
    +'<tspan class="pm-gv"> '+(x.kind==='bead'?(x.v*10).toFixed(1):x.o.sq.toFixed(1))+'</tspan></text>';
   if(isBead&&x.sub&&on)
    h+='<text x="'+(side<0?24.4:75.2).toFixed(1)+'" y="'+(y+2.7).toFixed(2)+'" text-anchor="'+(side<0?'end':'start')
     +'" class="pm-gs" opacity="0.95">'+esc(x.sub)+' · '+x.links.length+' addr</text>';});
  if(col.length>n)
   h+='<text x="'+(side<0?24.4:75.2)+'" y="99" text-anchor="'+(side<0?'end':'start')
    +'" class="pm-gl" opacity=".45">+'+(col.length-n)+' more in the list</text>';});
 if((PMLAYER==='bands'||PMLAYER==='pain')&&!gut.length){
  var instN=W.filter(function(n){return n.pole>=4;}).length;
  h+='<text x="50" y="96" text-anchor="middle" class="pm-gl" style="fill:'+PAL.Heart+'">'
   +(instN?'nothing held · '+instN+' addresses carry the coherent opposite':'nothing held')+'</text>';}
 /* the marks */
 h+='<g clip-path="url(#pmClip)">';
 marks.filter(function(m){return m.kind==='node'||m.kind==='heat';}).forEach(function(m){
  var c=PMC[m.band]||'#888';
  if(m.kind==='heat'){
   h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(2.2+m.v*4.4).toFixed(2)
    +'" fill="'+c+'" opacity="'+(0.10+m.v*0.34).toFixed(3)+'"/>'
    +'<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(0.7+m.v*1.1).toFixed(2)
    +'" fill="'+c+'" opacity="'+(0.55+m.v*0.45).toFixed(2)+'"/>';
  }else{
   h+='<circle class="pm-n" data-node="'+m.o.i+'" cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)
    +'" r="'+(0.55+m.v*1.5).toFixed(2)+'" fill="'+c+'" opacity="'+(0.3+m.v*0.68).toFixed(2)+'">'
    +'<title>'+esc(m.nm)+' · '+m.o.sq.toFixed(1)+'</title></circle>';
   if(m.o.pole>=4)h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(1.5+m.v).toFixed(2)
    +'" fill="none" stroke="#fff" stroke-width=".2" opacity=".5"/>';}});
 h+='</g>';
 /* the flow columns and the stopping seat */
 marks.filter(function(m){return m.kind==='seat';}).forEach(function(m){
  var c=PMC[m.band],w=2.2+m.v*7.6,s=m.o;
  h+='<rect x="'+(50-w/2).toFixed(2)+'" y="'+(m.y-3.1).toFixed(2)+'" width="'+w.toFixed(2)
   +'" height="6.2" rx="1" fill="'+c+'" opacity="'+(0.22+m.v*0.5).toFixed(2)+'"/>'
   +'<text x="'+(50+w/2+2.4).toFixed(2)+'" y="'+(m.y+0.7).toFixed(2)+'" class="pm-lbl">'
   +Math.round(m.v*100)+'% through</text>'
   +'<text x="'+(50-w/2-2.4).toFixed(2)+'" y="'+(m.y+0.7).toFixed(2)+'" text-anchor="end" class="pm-lbl">'
   +(s.hot?s.hot+' held':'clear')+'</text>';
  if(stop&&stop.p.k===s.p.k)
   h+='<line x1="30" y1="'+m.y+'" x2="70" y2="'+m.y+'" stroke="'+c
    +'" stroke-width=".5" stroke-dasharray="2 1.6" opacity=".95"/>'
    +'<text x="50" y="'+(m.y-4.8).toFixed(2)+'" text-anchor="middle" class="pm-lbl" style="fill:'+c+'">flow stops here</text>';});
 /* the beads */
 marks.filter(function(m){return m.kind==='bead'&&m.gy!=null;}).forEach(function(m){
  var c=PMC[m.band]||'#DFCC7E',on=PMPICK===m.o,rr=1.5+(m.v||0)*2.2;
  var dim=(PMPICK&&PMPICK!==m.o)?0.22:1;
  /* a bead sits at the mean height of the seats it touches. one with no held
     address, an unloaded mask for instance, has no seats to average, so it
     stays on its own gutter row rather than resolving to undefined. */
  var ys=m.links.map(function(n){return PMYP[B2K[n.b]];}).filter(function(v){return v!=null;});
  m.y=ys.length ? ys.reduce(function(a,b){return a+b;},0)/ys.length
     : (m.gy!=null ? m.gy : (PMYP[B2K[m.band]]!=null?PMYP[B2K[m.band]]:30));
  m.x=50+(m.gside||1)*5.2;
  h+='<circle class="pm-it" data-it="'+m.rank+'" cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)
   +'" r="'+(rr*(on?1.45:1)).toFixed(2)+'" fill="'+c+'" opacity="'+(on?1:0.8*dim).toFixed(2)+'">'
   +'<title>'+esc(m.nm)+'</title></circle>';
  if(on)h+='<circle cx="'+m.x.toFixed(2)+'" cy="'+m.y.toFixed(2)+'" r="'+(rr*2.6).toFixed(2)
   +'" fill="none" stroke="'+c+'" stroke-width=".3" opacity=".5"/>';});
 h+='</svg></div>';
 host.innerHTML=h;
 renderShelf(r,seats,speed,stop,dom,loadedTot,marks);
 host.querySelectorAll('[data-gi]').forEach(function(el){el.onclick=function(){
  var g2=gut[+el.dataset.gi]; if(!g2)return;
  PMPICK=(PMPICK===g2.o)?null:g2.o; S.pin=(g2.kind==='bead')?PMPICK:null; render();};});
 host.querySelectorAll('[data-reg]').forEach(function(el){el.onclick=function(){
  PAINPICK=el.dataset.reg||null;render();};});
 host.querySelectorAll('[data-pml]').forEach(function(el){el.onclick=function(){
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
