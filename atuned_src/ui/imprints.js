
/* ============================================================
   STORY. Type or speak. Every keystroke runs the sniffer. Imprints
   gather as they are found and nothing touches the field until you
   commit.
   ============================================================ */
var ST_TEXT='', ST_PARSED=null, ST_REC=null, ST_LISTEN=false;
var IMP_GROUP='band', IMP_BIG=false, IMP_PICK={};
var IMP_GROUPS=[['band','Seat'],['charge','Charge'],['sab','Saboteur'],
                ['story','Story'],['expr','Expression']];
function impLive(){
 return W.filter(function(n){return n.sq>=4||n.pole>=4;}).sort(function(a,b){return b.sq-a.sq;});}
/* pending imprints the sniffer has found but that are not committed yet.
   they draw as ghosts, so you can see where the text is about to land. */
function impGhosts(){
 if(!ST_PARSED)return [];
 var out={},seen={};
 ST_PARSED.imprints.forEach(function(im){
  if(seen[im.node])return; seen[im.node]=1;
  var n=BY[im.node]; if(!n)return;
  if(n.sq>=4)return;                 /* already live, not a ghost */
  out[im.node]={node:n,amt:im.amt};});
 return Object.keys(out).map(function(k){return out[k];});}
function painOf(n,bandLoad){
 return Math.min(10,Math.round((bandLoad[n.b]||0)*0.9+n.sq*0.3));}
/* one engine pass, then one index. the original called compute() once per pill. */
function impIndex(){
 var r=compute(), feeds={}, bandLoad={};
 BANDS.forEach(function(b){var seg=W.filter(function(n){return n.b===b;});
  bandLoad[b]=seg.reduce(function(a,n){return a+n.sq;},0)/Math.max(1,seg.length);});
 r.sabs.forEach(function(s){leaves(s).forEach(function(n){feeds[n.i]=(feeds[n.i]||0)+1;});});
 return {r:r,feeds:feeds,bandLoad:bandLoad};}
function impPill(n,maxW,IX,ghost){
 /* three states. held carries SQ. installed carries the coherent opposite and
    is not load, so it reads as a pole and not as a zero. pending is what the
    sniffer has found and nothing has committed. */
 var installed=(!ghost && n.sq<4 && n.pole>=4);
 var c=installed?seatCol('Heart'):seatCol(n.b);
 var rel=(ghost?2:(installed?n.pole:n.sq))/Math.max(1,maxW);
 var fs=(13+rel*4).toFixed(1), pad=(6+rel*5).toFixed(0);
 var opp=(CHILD.filter(function(x){return x.nm===n.cf;})[0]||{}).opp||'';
 var on=!!IMP_PICK[n.i], hot=n.sq>=9;
 var val=ghost?('+'+ghost.toFixed(1)):(installed?('\u2713 '+n.pole.toFixed(1)):n.sq.toFixed(1));
 var title=n.k+(opp?', toward '+opp:'')+' · '+n.b
  +(ghost?' · pending '+ghost.toFixed(1)
    :(installed?' · '+opp+' installed at '+n.pole.toFixed(1)
      :' · SQ '+n.sq.toFixed(1)+' · pain '+painOf(n,IX.bandLoad)+' · feeds '+(IX.feeds[n.i]||0)));
 return '<button class="ip'+(on?' on':'')+(hot?' hot':'')+(ghost?' ghost':'')
  +(installed?' inst':'')+'" data-imp="'+n.i+'" '
  +'style="--c:'+c+';font-size:'+fs+'px;padding:'+pad+'px '+(+pad+7)+'px" '
  +'title="'+esc(title)+'">'+esc(n.k)+'<b>'+val+'</b></button>';}
function impRender(){
 var host=document.getElementById('imp'); if(!host)return;
 var live=impLive(), ghosts=impGhosts(), IX=impIndex();
 var maxW=live.length?live[0].sq:1;
 var total=live.reduce(function(a,n){return a+n.sq;},0);
 var h='<div class="ip-hd"><span class="pm-eye">Imprints, '+live.length
  +(ghosts.length?' and '+ghosts.length+' pending':'')+'</span><div class="ip-ctl">';
 IMP_GROUPS.forEach(function(gp){
  h+='<button class="ip-g'+(IMP_GROUP===gp[0]?' on':'')+'" data-ig="'+gp[0]+'">'+gp[1]+'</button>';});
 h+='<button class="ip-max" id="impmax" title="'+(IMP_BIG?'shrink':'full width')+'">'
  +(IMP_BIG?'⤡':'⤢')+'</button></div></div>';
 if(!live.length&&!ghosts.length){
  h+='<div class="ip-none">Nothing held. Write in the box and it gathers here.</div>';
  host.innerHTML=h; impWire(); return;}
 function cloud(list,gl){var s='<div class="ip-cloud">';
  list.forEach(function(n){s+=impPill(n,maxW,IX,gl?gl[n.i]:0);});return s+'</div>';}
 if(IMP_GROUP==='band'){
  BANDS.forEach(function(b){
   var seg=live.filter(function(n){return n.b===b;});
   var gs=ghosts.filter(function(x){return x.node.b===b;});
   if(!seg.length&&!gs.length)return;
   var heldN=seg.filter(function(n){return n.sq>=4;});
   var instN=seg.filter(function(n){return n.sq<4&&n.pole>=4;});
   var sum=heldN.reduce(function(a,n){return a+n.sq;},0);
   h+='<div class="ip-bh" style="--c:'+seatCol(b)+'">'+b+'<em>'
    +(heldN.length?heldN.length+' held, '+sum.toFixed(1):'nothing held')
    +(instN.length?', '+instN.length+' installed':'')
    +(gs.length?', '+gs.length+' pending':'')+'</em></div>';
   var gl={};gs.forEach(function(x){gl[x.node.i]=x.amt;});
   h+=cloud(seg.concat(gs.map(function(x){return x.node;})),gl);});
 } else if(IMP_GROUP==='charge'){
  CHILD.forEach(function(c){
   var seg=live.filter(function(n){return n.cf===c.nm;});
   if(!seg.length)return;
   h+='<div class="ip-bh" style="--c:'+seatCol(c.seat)+'">'+c.nm+' toward '+c.opp
    +'<em>held '+(S.charge[c.nm]||0).toFixed(1)+', opposite '+(S.replace[c.nm]||0).toFixed(1)
    +'</em></div>'+cloud(seg);});
 } else if(IMP_GROUP==='sab'){
  if(!IX.r.sabs.length) h+='<div class="ip-none">Nothing is compounding yet.</div>';
  IX.r.sabs.slice(0,10).forEach(function(s){
   var lv=leaves(s).filter(function(n){return n.sq>=4;});
   if(!lv.length)return;
   h+='<div class="ip-bh" style="--c:'+(s.over?'var(--alarm)':seatCol(lv[0].b))+'">'+esc(s.nm)
    +'<em>'+(s.score?s.score+'% match, ':'')+'weight '+s.w.toFixed(1)+'</em></div>'+cloud(lv);});
 } else if(IMP_GROUP==='story'){
  /* grouped by the entry that put the weight there */
  var ents=((CURP&&CURP.story&&CURP.story.entries)||[]);
  if(!ents.length) h+='<div class="ip-none">No committed entries yet. Commit one and its imprints group here.</div>';
  ents.slice().reverse().slice(0,6).forEach(function(e,i){
   var bandsIn=Object.keys(e.bands||{}).map(function(k){return K2BAND[k];}).filter(Boolean);
   var seg=live.filter(function(n){return bandsIn.indexOf(n.b)>=0;});
   h+='<div class="ip-bh" style="--c:var(--gold)">Entry '+(ents.length-i)
    +'<em>'+new Date(e.t).toLocaleDateString()+', '+e.imprints+' imprints</em></div>'
    +'<div class="ad-q">'+esc(e.text.slice(0,130))+(e.text.length>130?'…':'')+'</div>'
    +cloud(seg.slice(0,12));});
 } else {
  /* expression. what is unfilled leaks the named shadow. */
  exprRead().sort(function(a,b){return a.fill-b.fill;}).forEach(function(e){
   var seg=live.filter(function(n){return n.b===e.b;});
   h+='<div class="ip-bh" style="--c:'+seatCol(e.b)+'">'+e.nm
    +'<em>fill '+e.fill.toFixed(1)+', leaks '+e.sh+'</em></div>'
    +(seg.length?cloud(seg):'<div class="ip-none" style="padding:6px 0">nothing held at the '
      +e.b.toLowerCase()+'</div>');});}
 var picked=Object.keys(IMP_PICK).filter(function(k){return IMP_PICK[k];});
 h+='<div class="ip-bar"><span class="ip-sel">'
  +(picked.length?picked.length+' selected':'click a pill to select')+'</span>'
  +'<button class="btn" id="impinfo"'+(picked.length===1?'':' disabled')+'>Detail</button>'
  +'<button class="btn pri" id="imprun"'+(picked.length?'':' disabled')+'>Release '
  +(picked.length>1?picked.length:'')+'</button></div>';
 host.innerHTML=h; impWire();}
function impWire(){
 document.querySelectorAll('[data-ig]').forEach(function(el){el.onclick=function(){
  IMP_GROUP=el.dataset.ig; impRender();};});
 document.querySelectorAll('[data-imp]').forEach(function(el){el.onclick=function(){
  var id=+el.dataset.imp; IMP_PICK[id]=!IMP_PICK[id]; impRender();};});
 var mx=document.getElementById('impmax');
 if(mx)mx.onclick=function(){IMP_BIG=!IMP_BIG;
  document.body.classList.toggle('impbig',IMP_BIG); impRender();};
 var rb=document.getElementById('imprun');
 if(rb)rb.onclick=function(){
  var ids=Object.keys(IMP_PICK).filter(function(k){return IMP_PICK[k];}).map(Number);
  if(ids.length)relPick(ids);};
 var ib=document.getElementById('impinfo');
 if(ib)ib.onclick=function(){
  var id=+Object.keys(IMP_PICK).filter(function(k){return IMP_PICK[k];})[0];
  var n=BY[id]; if(n)runNodeDrill(n);};}

