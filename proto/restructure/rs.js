/* ============================================================
   FIELD AND SUMMARY, RESTRUCTURED. Prototype over the shipped build, FY.
   Not part of the product. Nothing under atuned_src/ is touched.

   His words: "You're going to have Source AI on the left hand side, so the
   journal will be on the left with the imprints, and the release and the
   bank of the release on the right. When you commit your story, they go to
   your bank. When you release, they go to your vault. And there's a subtle
   animation on the field of what's been added, and you can see the number
   tick up or tick down. Then those tools would go on your summary page."

   HOW IT IS BUILT, AND WHY THAT MATTERS FOR THE MEASUREMENT.

   Nothing on the Summary is redrawn. The shipped rail sections are MOVED,
   whole, into the new places, so every renderer keeps writing into the same
   ids it always has (#spirit, #roots, #doms, #ar1, #polbar, #chg, #mx, #fire,
   #laws, #key, #rdrill). The Summary's own blocks are tagged after it
   renders and shown by section. What is new is only: the Field's two rails
   (Source AI, the journal, the imprints, the bank, the vault, a leaner
   release), the tick on the stage, the two secondary navs, and the avatar,
   which is proto/avatar/seats4's Told layout, mounted unchanged.

   With the strip set to Today, every node goes back where it came from and
   every class comes off, so Today is the shipped build.

   WHAT IS REAL AND WHAT IS NOT.
     real      the sniffer (parseStory, marksOf through stHLHtml), the commit's
               writes (applyStory, verpApply, leanApply), the reading
               (compute), the release card (relPick, relRender), the release's
               arithmetic (relCoolDown's own lines, as seats4 replays them), the
               meter's price (meterPlan), the avatar (readSeat, avRows,
               avatarProgress, ritFor through seats4).
     scripted  Source AI. No model is called, and the panel says so. It is
               assembled from the reading above and says WHERE, never WHY,
               which is the line reviews/SPEC-source-ai.md draws.
     not kept  nothing is saved. Storage is held in memory by this file's own
               first script, so the shipped app's record is never touched.
   ============================================================ */
window.RS=(function(){
'use strict';
var ST={mode:'new', who:'James', avAt:'top', bankBy:'carry', vaultBy:'opened', fast:true,
 sumSec:'narrative', avSub:'avatar', vault:{}, pending:null, voice:null, prev:null, lineIx:{}};
var $=function(id){return document.getElementById(id);};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function cap(s){s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1);}
function lc(s){return String(s||'').toLowerCase();}
function theSeat(b){return b==='Solar'?'the solar plexus':(b==='3rd Eye'?'the third eye':'the '+lc(b));}
function f1(v){return (Math.round(v*10)/10).toFixed(1);}

/* ---------- marks. Ring, never fill, on the product's 24 unit grid. ---------- */
var IC={
 ai:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2l1.3 3.4 3.4 1.4-3.4 1.4-1.3 3.4-1.3-3.4-3.4-1.4 3.4-1.4z"/>',
 journal:'<path d="M5 6.5h14M5 11h14M5 15.5h9M16.5 15l2.5 3.5"/>',
 imprint:'<path d="M5.5 13a6.5 6.5 0 0 1 13 0M8.5 13a3.5 3.5 0 0 1 7 0M12 13v7M8.5 13v4M15.5 13v4"/>',
 /* THE BANK WANTS A PIGGY BANK ICON. DECISIONS.md, ruled: "The bank is the
    imprints. A person fills it. It wants a piggy bank icon." Stroked. */
 bank:'<path d="M5 12.6c0-3.4 3-5.8 6.8-5.8h1.6c1.1-1.1 2.4-1.6 3.8-1.6l-.6 2.5c.9.7 1.6 1.7 1.9 2.9H20v3.5h-1.6c-.5 1.2-1.5 2.2-2.7 2.8v2.3h-2.6v-1.5H9.6v1.5H7v-2.3c-1.2-.9-2-2.5-2-4.3z"/><path d="M10 6.9V5.3M15.6 10.8h.01"/>',
 vault:'<rect x="4" y="4.5" width="16" height="14.5" rx="2"/><circle cx="12" cy="11.75" r="3.6"/><path d="M12 8.15V6.9M12 16.6v-1.25M8.4 11.75H7.2M16.8 11.75h-1.2M6.5 19v1.6M17.5 19v1.6"/>',
 release:'<circle cx="12" cy="12" r="6.5"/><path d="M12 9v6M9 12h6"/>',
 narrative:'<path d="M5 6.5h14M5 11h14M5 15.5h9"/>',
 energetics:'<circle cx="12" cy="12" r="5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
 psyche:'<path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"/>',
 masks:'<path d="M4 9a8 6 0 0116 0c0 6-4 10-8 10S4 15 4 9z"/><path d="M9 10v1M15 10v1"/>',
 saboteurs:'<path d="M8.6 4.8a3.4 3.4 0 013.4 3.4v3.4a3.4 3.4 0 01-6.8 0V8.2a3.4 3.4 0 013.4-3.4M15.4 12.4a3.4 3.4 0 013.4 3.4a3.4 3.4 0 01-6.8 0a3.4 3.4 0 013.4-3.4"/>',
 analytics:'<circle cx="8.5" cy="14.5" r="4.5"/><circle cx="16.5" cy="9" r="3"/><circle cx="17" cy="17.5" r="2"/>',
 avatar:'<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.8-3.8 3.4-6 6.5-6s5.7 2.2 6.5 6"/>',
 intake:'<rect x="5.5" y="5" width="13" height="15" rx="2"/><path d="M9 4h6v3H9zM9 11h6M9 15h4"/>'};
function ic(k,c){return '<span class="rs-ic"'+(c?' style="--c:'+c+'"':'')+'><svg viewBox="0 0 24 24" aria-hidden="true">'+IC[k]+'</svg></span>';}

/* ============================================================
   THE MOVE. Every shipped node the proposal relocates, and the comment
   placeholder that marks where it goes back to.
   ============================================================ */
var MOV={};
function reg(name,el){if(!el||MOV[name])return;var ph=document.createComment('rs:'+name);
 el.parentNode.insertBefore(ph,el); MOV[name]={el:el,ph:ph};}
function put(name,host,before){var m=MOV[name]; if(!m||!host)return;
 if(before)host.insertBefore(m.el,before); else host.appendChild(m.el);}
function home(name){var m=MOV[name]; if(!m)return; var ph=m.ph;
 if(m.el.previousSibling!==ph)ph.parentNode.insertBefore(m.el,ph.nextSibling);}
function homeAll(){Object.keys(MOV).forEach(home);}

/* ============================================================
   THE READING THE NEW RAILS DRAW FROM. One compute per paint.
   ============================================================ */
function bankList(){
 var list=W.filter(function(n){return ST.bankBy==='held'?n.sq>=4:n.sq>0;});
 return list.sort(function(a,b){return b.sq-a.sq;});}
function vaultList(){
 var v=Object.keys(ST.vault).map(function(k){return ST.vault[k];});
 if(ST.vaultBy==='cleared')v=v.filter(function(x){return x.cleared;});
 return v.sort(function(a,b){return b.t-a.t;});}
function vaultShare(v){
 if(!v.length)return 0;
 return v.reduce(function(a,x){var n=BY[x.i];var now=n?n.sq*10:x.w1;return a+Math.max(0,Math.min(1,1-now/Math.max(1,x.w0)));},0)/v.length*100;}
/* THE POOL THE SHIPPED FIELD BUTTON BUILDS (ui/personas.js, #bRel): the
   heaviest at or over the line, and when nothing is, the heaviest still
   carrying anything, because "below the line there is still ground". */
function releasePool(){var r=compute();
 var hot=r.loaded.slice().sort(function(a,b){return b.sq-a.sq;});
 if(hot.length)return hot;
 return W.filter(function(n){return n.sq>0;}).sort(function(a,b){return b.sq-a.sq;});}
function poolUnder(){return !compute().loaded.length;}
function priceOf(ids){
 try{var ch=CHAN.map(function(c){return c[0]+c[2];}),cap=relBudget();
  return (CURP&&ids.length&&cap>0)?meterPlan(CURP,ids,ch,cap).length:0;}catch(e){return 0;}}
function pendingNodes(){
 if(!ST_PARSED)return [];
 var out={}, order=[];
 ST_PARSED.imprints.forEach(function(im){var n=BY[im.node]; if(!n)return;
  if(!out[n.i]){out[n.i]={n:n,amt:0,inferred:!!im.inferred};order.push(n.i);}
  out[n.i].amt+=im.amt||0; if(!im.inferred)out[n.i].inferred=false;});
 return order.map(function(i){return out[i];});}

/* ============================================================
   SOURCE AI, SCRIPTED. Where, never why. Every sentence is read off
   something the engine already computed, and nothing is said ahead of it.
   ============================================================ */
function voice(){
 var r=compute(), b=bankList(), v=vaultList(), L=[], go=null;
 var typed=(ST_TEXT||'').trim();
 if(ST.voice){L=ST.voice.slice();}
 else if(typed){
  var P=pendingNodes();
  if(!P.length){
   L.push('Nothing in this entry names a feeling the instrument reads yet, so there is nothing to commit.');
   L.push('Say what your body did, and where. <b>"My chest was tight"</b> reads; <b>"it was a hard week"</b> does not.');}
  else{
   var seats={}; P.forEach(function(x){seats[x.n.b]=(seats[x.n.b]||0)+x.amt;});
   var ks=Object.keys(seats).sort(function(a,c){return seats[c]-seats[a];});
   var hits=ST_PARSED.hits.length;
   L.push('This entry reads at <b>'+ks.slice(0,3).map(theSeat).join('</b>, <b>')+'</b>. '
    +hits+(hits===1?' word carries':' words carry')+' it, heaviest at '+theSeat(ks[0])+'.');
   if(P.some(function(x){return x.inferred;}))
    L.push('Some of your words name a seat and not an address, so those land where the seat holds charge, not under a name.');
   L.push('Commit it and <b>'+P.length+(P.length===1?' address goes':' addresses go')+'</b> to your bank.');}}
 else if(r.unread&&!b.length){
  L.push('Nothing read yet. Write what happened today, in your own words, and this says where it lands in you.');
  go={k:'avatar',t:'Or start with who you are becoming'};}
 else{
  var top=b[0], pool=releasePool();
  if(top)L.push('The heaviest address in your bank is <b>'+esc(top.k)+'</b> at '+theSeat(top.b)+', '+f1(top.sq)+'.');
  var above=compute().loaded.length;
  if(above)L.push(above+(above===1?' address sits':' addresses sit')+' above the line. Release the three heaviest, or write what happened today.');
  else if(b.length)L.push('Everything in your bank sits under the line. A release there takes less, because there is less on each address to take.');
  if(v.length)L.push('Your vault holds '+v.length+(v.length===1?' address':' addresses')+' released at least once.');
  if(!L.length)L.push('Nothing in your bank. Write what happened today.');}
 return {lines:L, go:go};}

/* ============================================================
   THE FIELD'S LEFT RAIL
   ============================================================ */
function leftHTML(){
 return '<div id="rs-left">'
  +'<section class="rs-ai" aria-live="polite" aria-label="Source AI">'
   +'<div class="rs-h">'+ic('ai')+'<b>Source AI</b><em>scripted</em></div>'
   +'<div id="rs-ai-body"></div>'
   +'<p class="rs-ai-f">Assembled from your reading. No model is called in this prototype.</p></section>'
  +'<section class="rs-sec rs-jn" aria-label="Journal">'
   +'<div class="rs-h">'+ic('journal')+'<b>Journal</b></div>'
   +'<div class="st-ed"><textarea id="rs-ta" class="st-ta" spellcheck="false" aria-label="What happened"'
   +' placeholder="What happened. Write it the way you would say it out loud."></textarea>'
   +'<div class="st-hl" id="rs-hl" aria-hidden="true"></div></div>'
   +'<div class="rs-jbar"><span id="rs-jct">0 words</span>'
   +'<button class="btn pri" id="rs-commit" type="button" disabled>Commit</button></div></section>'
  +'<section class="rs-sec rs-imp" aria-label="Imprints">'
   +'<div class="rs-h">'+ic('imprint')+'<b>Imprints</b><span class="rs-n" id="rs-impn" hidden></span></div>'
   +'<div id="rs-imp-body"></div></section>'
  +'</div>';}
function paintVoice(anim){
 var h=$('rs-ai-body'); if(!h)return;
 var V=voice();
 h.innerHTML=V.lines.map(function(l,i){return '<p class="rs-ai-l'+(anim?' rs-in':'')+'" style="animation-delay:'+(i*62)+'ms">'+l+'</p>';}).join('')
  +(V.go?'<button type="button" class="btn rs-go" data-rs-go="'+V.go.k+'">'+esc(V.go.t)+'</button>':'');}
function paintImprints(){
 var h=$('rs-imp-body'), nEl=$('rs-impn'); if(!h)return;
 var P=pendingNodes();
 if(nEl){nEl.hidden=!P.length; nEl.textContent=P.length;}
 if(!P.length){
  h.innerHTML='<p class="rs-none">'+((ST_TEXT||'').trim()
   ?'Nothing found in this entry yet.'
   :'What your entry touches shows here as you write, before anything is committed.')+'</p>';
  return;}
 var IX=impIndex(), maxW=4, bySeat={};
 P.forEach(function(x){(bySeat[x.n.b]=bySeat[x.n.b]||[]).push(x);});
 var out='';
 BANDS.forEach(function(b){var g=bySeat[b]; if(!g)return;
  var inBank=g.filter(function(x){return x.n.sq>0;}).length;
  out+='<div class="rs-seatrow" style="--c:'+seatCol(b)+'">'+esc(b)+'<em>'+g.length+' found'
   +(inBank?', '+inBank+' already in your bank':'')+'</em></div><div class="ip-cloud">'
   +g.map(function(x){return impPill(x.n,maxW,IX,x.amt,x.inferred);}).join('')+'</div>';});
 h.innerHTML=out;
 h.querySelectorAll('[data-imp]').forEach(function(el){el.onclick=function(){
  var n=BY[+el.dataset.imp]; if(n)runNodeDrill(n);};});}
function paintJournal(){
 var hl=$('rs-hl'), ct=$('rs-jct'), cm=$('rs-commit'); if(!hl)return;
 hl.innerHTML=stHLHtml(ST_TEXT||'')+'\n';
 var words=(ST_TEXT||'').trim()?(ST_TEXT||'').trim().split(/\s+/).length:0;
 var P=pendingNodes();
 if(ct)ct.textContent=words+(words===1?' word':' words')+(ST_PARSED?', '+ST_PARSED.hits.length+' read':'');
 if(cm){cm.disabled=!P.length; cm.textContent=P.length?'Commit to bank':'Commit';}}
function onType(){
 var ta=$('rs-ta'); ST_TEXT=ta.value; ST.voice=null;
 ST_PARSED=ST_TEXT.trim()?parseStory(ST_TEXT):null;
 paintJournal(); paintImprints(); paintVoice(false);}

/* ============================================================
   THE FIELD'S RIGHT RAIL
   ============================================================ */
var BANK_C='var(--gold)', VAULT_C='#9FB8A4';
function rightHTML(){
 return '<div id="rs-right">'
  +'<div class="rs-bv" id="rs-bvhost"></div>'
  +'<section class="rs-sec rs-rel" aria-label="Release"><div class="rs-h">'+ic('release')+'<b>Release</b></div><div id="rs-relbody"></div></section>'
  +'<section class="rs-sec rs-bank" aria-label="Bank"><div class="rs-h">'+ic('bank',BANK_C)+'<b>Bank</b><em id="rs-bankem"></em></div><div id="rs-bankbody"></div></section>'
  +'<section class="rs-sec rs-vault" aria-label="Vault"><div class="rs-h">'+ic('vault',VAULT_C)+'<b>Vault</b><em id="rs-vaultem"></em></div><div id="rs-vaultbody"></div></section>'
  +'<div id="rs-selhost"></div>'
  +'</div>';}
function bvHTML(r,b,v){
 var bankW=Math.round(r.DQ||0), vs=vaultShare(v);
 return '<div class="rs-bvc">'+cr('Root',bankW,{size:'md',raw:String(b.length),color:'var(--gold)',hot:false,
   glyph:IC.bank,title:'Bank. '+b.length+(ST.bankBy==='held'?' held above the line':' addresses holding any charge')+'. The ring is its weight, shadow weight '+bankW+' of 100.'})
  +'<span class="rs-bvt"><b>Bank</b><small>'+(ST.bankBy==='held'?'above the line':'addresses')+'</small></span></div>'
  +'<div class="rs-bvc">'+cr('Heart',vs,{size:'md',raw:String(v.length),color:VAULT_C,hot:false,
   glyph:IC.vault,title:'Vault. '+v.length+(ST.vaultBy==='cleared'?' cleared entirely':' released at least once')+'. The ring is how much of their weight has come off.'})
  +'<span class="rs-bvt"><b>Vault</b><small>'+(ST.vaultBy==='cleared'?'cleared entirely':'released')+'</small></span></div>';}
function tickHTML(r,b,v){
 return '<span class="rs-tk">'+cr('Root',Math.round(r.DQ||0),{size:'sm',raw:String(b.length),color:'var(--gold)',hot:false,glyph:IC.bank,title:'Bank'})+'<b>Bank</b></span>'
  +'<span class="rs-tk">'+cr('Heart',vaultShare(v),{size:'sm',raw:String(v.length),color:VAULT_C,hot:false,glyph:IC.vault,title:'Vault'})+'<b>Vault</b></span>';}
function nodeRow(n,extra,btn){
 return '<'+(btn?'button type="button" data-rs-node="'+n.i+'"':'div')+' class="rs-row'+(btn?'':' rs-static')+'" style="--c:'+seatCol(n.b)+'">'
  +crbNode(n,'xs')+'<span class="rs-rn">'+esc(n.k)+'</span><em>'+esc(extra||n.b)+'</em></'+(btn?'button':'div')+'>';}
function paintRight(){
 var r=compute(), b=bankList(), v=vaultList(), pool=releasePool();
 var bv=$('rs-bvhost'); if(bv)bv.innerHTML=bvHTML(r,b,v);
 var tk=$('rs-tick'); if(tk)tk.innerHTML=tickHTML(r,b,v);
 /* the release, leaner than the shipped panel: the three heaviest, the price
    the meter would charge, and one button. The shipped card runs it. */
 var take=pool.slice(0,3), ids=take.map(function(n){return n.i;}), cost=priceOf(ids);
 var secs=Math.round(cost*(RUN_SPEED_S?RUN_SPEED_S.Steady:2.2));
 var rb=$('rs-relbody');
 if(rb)rb.innerHTML=take.length
  ?'<p class="rs-p">The '+(take.length===3?'three':take.length===2?'two':'one')+' heaviest in your bank'
    +(poolUnder()?', all under the line':'')+', '
    +cost+(cost===1?' pattern':' patterns')+', about '+secs+' seconds.</p>'
   +'<div class="rs-take">'+take.map(function(n){return nodeRow(n,n.b,false);}).join('')+'</div>'
   +'<button class="btn pri" id="rs-run" type="button">Release '+take.length+'</button>'
  :'<p class="rs-none">'+(cost===0&&take.length?'Nothing left in the allowance to open new ground.'
    :'Nothing in your bank yet, so there is nothing to release.')+'</p>';
 var be=$('rs-bankem'); if(be)be.textContent=b.length?(ST.bankBy==='held'?b.length+' above the line':b.length+' addresses, '+compute().loaded.length+' above the line'):'';
 var bb=$('rs-bankbody');
 if(bb)bb.innerHTML=b.length
  ?b.slice(0,6).map(function(n){return nodeRow(n,n.b,true);}).join('')
   +(b.length>6?'<p class="rs-more-n">and '+(b.length-6)+' more, lighter</p>':'')
  :'<p class="rs-none">When you commit an entry, what it read goes here.</p>';
 var ve=$('rs-vaultem'); if(ve)ve.textContent=v.length?String(v.length):'';
 var vb=$('rs-vaultbody');
 if(vb)vb.innerHTML=v.length
  ?v.slice(0,5).map(function(x){var n=BY[x.i]; var now=n?Math.round(n.sq*10):Math.round(x.w1);
    var off=Math.max(0,Math.min(1,1-now/Math.max(1,x.w0)));
    return '<button type="button" class="rs-row rs-vrow'+(x.fresh?' rs-new':'')+'" data-rs-node="'+x.i+'" style="--c:'+seatCol(x.b)+'">'
     +crBadge(x.b,off*100,{size:'xs',bare:true,title:x.k+', '+x.w0+' to '+now+' of 100'})
     +'<span class="rs-rn">'+esc(x.k)+'</span><i aria-hidden="true"><u style="width:'+Math.round(off*100)+'%"></u></i>'
     +'<em>'+x.w0+' to '+now+'</em></button>';}).join('')
   +(v.length>5?'<p class="rs-more-n">and '+(v.length-5)+' more</p>':'')
  :'<p class="rs-none">'+(ST.vaultBy==='cleared'
    ?'An address comes here once a release leaves it at 6 of 100 or under.'
    :'An address comes here the first time you release it, and stays.')+'</p>';
 Object.keys(ST.vault).forEach(function(k){ST.vault[k].fresh=false;});
 crMotion([bv,tk].filter(Boolean));}

/* ============================================================
   THE MOTION. The product's own numbers: ENTER_SPAN 380ms, ENTER_STAGGER
   62ms, a cubic out (ui/wheel.js). The count ticks through crMotion, the
   same tween the reading circles use since FE.
   ============================================================ */
function stagePoint(i){
 var cv=$('cv'); if(!cv||typeof HIT==='undefined')return null;
 var h=null; for(var j=0;j<HIT.length;j++){if(HIT[j].k==='node'&&HIT[j].n&&HIT[j].n.i===i){h=HIT[j];break;}}
 if(!h)return null;
 var a=(h.a0+h.a1)/2, rr=(h.r0+h.r1)/2, R=cv.getBoundingClientRect(), S0=$('stage').getBoundingClientRect();
 return {x:R.left-S0.left+h.cx+Math.cos(a)*rr, y:R.top-S0.top+h.cy+Math.sin(a)*rr};}
function pulse(ids){
 var st=$('stage'); if(!st||(typeof REDUCED!=='undefined'&&REDUCED))return;
 ids.slice(0,14).forEach(function(i,j){var n=BY[i], p=stagePoint(i); if(!n||!p)return;
  var el=document.createElement('span'); el.className='rs-pulse'; el.style.left=p.x+'px'; el.style.top=p.y+'px';
  el.style.setProperty('--c',seatCol(n.b)); el.style.animationDelay=(j*62)+'ms';
  st.appendChild(el); setTimeout(function(){el.remove();},1200+j*62);});}
function delta(txt,c){
 var st=$('stage'), tk=$('rs-tick'); if(!st||!tk)return;
 var R=tk.getBoundingClientRect(), S0=st.getBoundingClientRect();
 var el=document.createElement('span'); el.className='rs-delta'; el.textContent=txt; el.style.setProperty('--c',c);
 el.style.left=(R.left-S0.left)+'px'; el.style.top=(R.top-S0.top-40)+'px';
 st.appendChild(el); setTimeout(function(){el.remove();},1800);}

/* ============================================================
   THE WRITES. Nothing is saved: storage is in memory for this file.
   ============================================================ */
function commit(){
 var P=pendingNodes(); if(!P.length)return;
 var r0=compute(), b0=bankList(), w0=r0.DQ;
 var before={}; b0.forEach(function(n){before[n.i]=1;});
 var t=ST_TEXT;
 undoPush('committing the story');
 applyStory(t); verpApply(t); if(typeof leanApply==='function')leanApply(t);
 if(CURP){CURP.story=CURP.story||{entries:[]};
  CURP.story.entries.push({t:new Date().toISOString(),text:t,imprints:ST_PARSED.imprints.length,bands:ST_PARSED.bands});}
 ST_TEXT=''; ST_PARSED=null; var ta=$('rs-ta'); if(ta)ta.value='';
 var r1=compute(), b1=bankList();
 var added=b1.filter(function(n){return !before[n.i];});
 var landed=P.map(function(x){return x.n.i;});
 var above=r1.loaded.length-r0.loaded.length;
 ST.voice=[];
 ST.voice.push(added.length
  ?'<b>'+added.length+(added.length===1?' address':' addresses')+'</b> went to your bank. It now holds '+b1.length+'.'
  :'Your bank took the charge on addresses it already holds, so the count stayed at '+b1.length+'.');
 ST.voice.push((Math.round(w0)===Math.round(r1.DQ)?'Shadow weight moved less than a point, at '+Math.round(r1.DQ)+'.':'Shadow weight went from '+Math.round(w0)+' to '+Math.round(r1.DQ)+'.')
  +(above>0?' '+above+(above===1?' address crossed':' addresses crossed')+' the line, so a release can reach '+(above===1?'it':'them')+'.'
   :(r1.loaded.length?'':' None of it crossed the line yet. It is kept, and the next entry adds to it.')));
 ST.lastEvt={k:'commit', added:added.length};
 if(typeof render==='function')render();
 paintAll(true);
 pulse(landed);
 delta(added.length?'+'+added.length+' to your bank':'Shadow weight +'+Math.max(0,Math.round(r1.DQ-w0)),'var(--gold)');}

function runRelease(){
 var pool=releasePool().slice(0,3); if(!pool.length)return;
 ST.pending={ids:pool.map(function(n){return n.i;}), w0:compute().DQ, bank0:bankList().length, above0:compute().loaded.length};
 RUN.speed=2.2;
 relPick(ST.pending.ids);}
/* the replay of relCoolDown's writes, the same lines seats4 carries, so a
   worked example can release in the prototype the way it cannot in the
   product, and nothing is saved either way */
function writeRelease(q){
 var log=[],freed=0;
 q.forEach(function(n){
  var w0=n.sq*10, d=-Math.round(w0*0.21+2), w1=Math.max(0,w0+d);
  freed+=Math.abs(d);
  var share=Math.abs(d)/10/Math.max(1,q.filter(function(x){return x.cf===n.cf;}).length);
  S.charge[n.cf]=clamp((S.charge[n.cf]||0)-share,0,10);
  S.replace[n.cf]=clamp((S.replace[n.cf]||0)+share*0.62,0,10);
  log.push({node:n.i,name:n.k,band:n.b,fetter:n.cf,
   opp:(CHILD.filter(function(c){return c.nm===n.cf;})[0]||{}).opp||'',
   w0:Math.round(w0),d:d,w1:w1,cleared:(w1<=6)});});
 return {log:log,freed:freed};}
function toVault(log){
 var t=Date.now();
 log.forEach(function(x,j){var v=ST.vault[x.node];
  if(!v)v=ST.vault[x.node]={i:x.node,k:x.name,b:x.band,w0:x.w0,runs:0,t:t+j};
  v.runs++; v.w1=x.w1; v.cleared=x.cleared; v.t=t+j; v.fresh=true;
  if(CURP&&typeof meterFirst==='function')meterFirst(CURP,'addr:'+x.node,x.name+', '+x.band);});}
function hookRelease(){
 var inner=window.relCoolDown, innerClose=window.relClose;
 window.relCoolDown=function(){
  if(ST.mode!=='new'||!ST.pending){
   /* the avatar's own release, through seats4. Its log still reaches the vault. */
   var had=RUN.done, res=inner.apply(this,arguments);
   if(ST.mode==='new'&&!had&&RUN.done&&RUN.log&&RUN.log.length){toVault(RUN.log);paintAll(false);}
   return res;}
  if(RUN.done)return; RUN.done=true; RUN.phase='done';
  try{relTone();}catch(e){}
  var pre=compute(); RUN.ex0=pre.EX; try{RUN.ceil0=exCeiling();}catch(e){}
  undoPush('the release at '+RUN.queue.length+' addresses');
  var w=writeRelease(RUN.queue); RUN.log=w.log; RUN.freed=w.freed;
  if(CURP){try{RUN.meter=meterRun(CURP,RUN.plan||[]);RUN.lift=releaseWork(CURP,(RUN.meter&&RUN.meter.fresh)||[]);}catch(e){}}
  toVault(w.log);
  var P=ST.pending; ST.pending=null;
  var r1=compute(), b1=bankList(), v=vaultList();
  var fell=P.above0-r1.loaded.length;
  ST.voice=['The release took shadow weight from '+Math.round(P.w0)+' to '+Math.round(r1.DQ)+'. '
    +w.log.length+(w.log.length===1?' address went':' addresses went')+' to your vault.',
   (P.above0===0
    ?'All three sat under the line already, so the line did not move; their weight did.'
    :fell!==w.log.length
    ?'It lightened the whole axis each address sits on, so '+(fell>0?fell+(fell===1?' address':' addresses')+' dropped under the line':'nothing dropped under the line')+', not '+w.log.length+'.'
    :w.log.length+' dropped under the line.')
   +' Your bank holds '+b1.length+'.'];
  ST.lastEvt={k:'release'};
  relRender(); if(typeof render==='function')render();
  paintAll(true);
  pulse(w.log.map(function(x){return x.node;}));
  delta('+'+w.log.length+' to your vault, shadow weight -'+Math.max(0,Math.round(P.w0-r1.DQ)),VAULT_C);};
 window.relClose=function(){ST.pending=null;RUN.speed=2.2;return innerClose.apply(this,arguments);};
 document.addEventListener('click',function(e){
  if(e.target.closest&&e.target.closest('#relgo')&&ST.fast&&(ST.pending||(window.S4&&S4.ST.pending)))RUN.speed=0.3;},true);}

/* ============================================================
   THE SECONDARY NAVS
   ============================================================ */
var SUMSEC=[
 {k:'narrative',nm:'Narrative',c:'var(--accent)',lede:'What the reading says, in sentences, and where it sits in the body.'},
 {k:'energetics',nm:'Energetics',c:'#D6A93B',lede:'What was there before any of it: the blueprint, the archetypes, the four lenses and the birth data. Moved here from the Field\'s left rail.'},
 {k:'psyche',nm:'Psyche',c:'#B48ACB',lede:'What was installed and is carried: orientation, balance, the nine child emotions, the matrix, the laws. Moved here from both Field rails.'},
 {k:'masks',nm:'Masks',c:'#C98D6B',lede:'The era you speak from. The bigger the weight, the more of the time it is the one talking.'},
 {k:'saboteurs',nm:'Saboteurs',c:'#D0655C',lede:'What is compounding: saboteurs, complexes, hyper complexes and the character layer, and what is running now.'},
 {k:'analytics',nm:'Analytics',c:'#7EB8D4',lede:'The same reading as figures and fields: coherence, identification, and the six maps.'}];
function setupDone(){
 var r=compute(), p=CURP||{}, n=0;
 if(p.avatar&&p.avatar.pairs&&p.avatar.pairs.length)n++;
 if(p.who&&p.who.born&&(p.who.born.date||p.who.born.d))n++;
 if(r.complete||(!r.unread&&r.measured>=21))n++;
 return n/3;}
function ringMini(v,c){
 var R=7,C=2*Math.PI*R;
 return '<svg class="rs-setup" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="'+R+'" stroke="rgba(128,128,128,.3)"/>'
  +'<circle cx="9" cy="9" r="'+R+'" stroke="'+c+'" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-v)).toFixed(1)+'" transform="rotate(-90 9 9)"/></svg>';}
function sumNavHTML(){
 var items=SUMSEC.slice();
 if(ST.avAt==='summary')items.unshift({k:'avatar',nm:'Avatar',c:'#9FB8A4'});
 return items.map(function(s){
  return '<button type="button" data-rs-sec="'+s.k+'" aria-pressed="'+(ST.sumSec===s.k)+'" style="--c:'+s.c+'">'
   +ic(s.k,s.c)+'<span>'+s.nm+'</span></button>';}).join('');}
function avNavHTML(){
 var d=setupDone();
 return '<button type="button" data-rs-av="avatar" aria-pressed="'+(ST.avSub==='avatar')+'" style="--c:#9FB8A4">'+ic('avatar','#9FB8A4')+'<span>Avatar</span></button>'
  +'<button type="button" data-rs-av="intake" aria-pressed="'+(ST.avSub==='intake')+'" style="--c:#D6A93B" aria-label="Intake. The ring is how much of the setup is in: who you are becoming, your birth, the 63 questions.">'
  +ic('intake','#D6A93B')+'<span>Intake</span>'+ringMini(d,'#D6A93B')+'</button>';}

/* ============================================================
   SUMMARY: TAG WHAT THE SHIPPED RENDERER WROTE, BY SECTION
   ============================================================ */
function tagSum(){
 var sb=$('sumbody'); if(!sb)return;
 var t=function(el,k){if(el)el.setAttribute('data-rs',k);};
 var unread=compute().unread;
 sb.querySelectorAll('.s-readbox,.s-outrow,.s-axes,.s-told').forEach(function(e){t(e,'narrative');});
 /* the name plate once, on the narrative. The information panel on the right
    carries the name and the band on every section already. */
 t(sb.querySelector('.s-plate'),unread?'all':'narrative');
 t(sb.querySelector('.s-glance'),'analytics');
 t(sb.querySelector('.s-ig'),'analytics');
 var st=sb.querySelector('.s-struct');
 if(st){var cur='energetics';
  Array.prototype.forEach.call(st.children,function(c){
   if(c.classList.contains('pm-eye')){var w=c.textContent.trim().toLowerCase();
    cur=/blueprint|primary/.test(w)?'energetics':/mask/.test(w)?'masks':/where it sits/.test(w)?'narrative':/chain/.test(w)?'saboteurs':'energetics';}
   t(c,cur);});}
 var side=sb.querySelector('.s-side');
 if(side)Array.prototype.forEach.call(side.children,function(c){
  if(c.getAttribute('data-rs'))return;
  if(c.classList.contains('s-glance'))return;
  if(c.classList.contains('s-struct'))return;
  t(c,'energetics');});
 if(st)st.removeAttribute('data-rs');
 /* anything else the renderer wrote (the unread doors on a blank record)
    belongs to every section, so a blank page is never blank */
 Array.prototype.forEach.call(sb.querySelectorAll('.sum-wrap>*'),function(c){if(!c.getAttribute('data-rs')&&!c.classList.contains('s-cols'))t(c,unread?'all':'narrative');});
 Array.prototype.forEach.call(sb.children,function(c){if(!c.classList.contains('sum-wrap')&&!c.getAttribute('data-rs'))t(c,'all');});}

/* ============================================================
   PLACE. Where every moved node lives, for the tab and the mode.
   ============================================================ */
function hosts(){
 var sum=$('sum'); if(!sum)return;
 if(!$('rs-sumnav')){
  var nav=document.createElement('nav'); nav.id='rs-sumnav'; nav.className='rs-nav'; nav.setAttribute('aria-label','Summary sections');
  sum.insertBefore(nav,sum.firstChild);
  ['energetics','psyche','saboteurs'].forEach(function(k){
   var h=document.createElement('div'); h.className='rs-host'; h.id='rs-host-'+k; h.setAttribute('data-for',k);
   h.innerHTML='<p class="rs-lede" id="rs-lede-'+k+'"></p>';
   sum.insertBefore(h,$('sumbody'));});
  var ld=document.createElement('p'); ld.className='rs-lede rs-host'; ld.id='rs-lede-top'; ld.setAttribute('data-for','narrative masks analytics');
  sum.insertBefore(ld,$('sumbody'));}}
function place(){
 var on=ST.mode==='new', tab=S.tab;
 document.body.classList.toggle('rs-on',on);
 var sum=$('sum');
 if(!on||(tab!==TAB.FIELD&&tab!==TAB.SUMMARY&&tab!==TAB.INTAKE)){
  homeAll(); placeAvatar(false);
  if(sum)sum.removeAttribute('data-rs-cur');
  return;}
 var rp=$('rpanel');
 if(tab===TAB.FIELD){
  /* the tools are on the Summary now; on the Field only Selection stays, in
     the new right rail, because a click on the wheel still opens it */
  put('sel',$('rs-selhost'));
  home('fdock'); home('you'); home('railtop');
  orderHosts();
  placeAvatar(false);}
 else{
  /* Summary and Avatar: no left panel, an information panel on the right */
  home('sel'); home('you'); home('railtop');
  put('fdock',rp,MOV.you?MOV.you.ph:null);
  orderHosts();
  placeAvatar(tab===TAB.INTAKE||(tab===TAB.SUMMARY&&ST.avAt==='summary'&&ST.sumSec==='avatar'));}
 if(sum){
  if(tab===TAB.SUMMARY){sum.setAttribute('data-rs-cur',ST.sumSec);sum.classList.toggle('rs-avsub-intake',ST.avSub==='intake');}
  else sum.removeAttribute('data-rs-cur');}
 document.body.classList.toggle('rs-avsub-intake',ST.avSub==='intake');
 document.body.classList.toggle('rs-avsub-avatar',ST.avSub!=='intake');
 paintNavs();}
function orderHosts(){
 var e=$('rs-host-energetics'); if(e){put('soul',e);put('overlap',e);put('energetics',e);}
 var p=$('rs-host-psyche'); if(p){['lean','fetters','laws','flow','matrix'].forEach(function(k){put(k,p);});}
 var s=$('rs-host-saboteurs'); if(s)put('running',s);}
function placeAvatar(show){
 var av=$('rs-av'); if(!av)return;
 var want=null;
 if(show){want=(S.tab===TAB.SUMMARY)?$('sum'):$('stage');}
 if(!want){if(av.parentNode!==$('stage'))$('stage').appendChild(av); if($('iq').parentNode!==$('stage'))$('stage').insertBefore($('iq'),av);return;}
 if(av.parentNode!==want){if(want.id==='sum')want.insertBefore(av,$('sumbody'));else want.appendChild(av);}
 var iq=$('iq');
 if(S.tab===TAB.SUMMARY){if(iq.parentNode!==$('sum'))$('sum').insertBefore(iq,$('sumbody'));
  if(ST.avSub==='intake'&&typeof renderIntake==='function')renderIntake();}
 else if(iq.parentNode!==$('stage'))$('stage').insertBefore(iq,av);
 if(ST.avSub!=='intake'&&window.S4){try{S4.ST.clean=true;S4.ST.dock=false;paintS4();}catch(e){}}}
function paintS4(){
 /* seats4 paints into #s4 and puts its own class on the body. Its Field
    rules were stripped at build time, so the class is harmless, but it is
    taken off again so nothing reads it as the Field being replaced. */
 S4.set('L','told'); document.body.classList.remove('s4-on');}
function paintNavs(){
 var n=$('rs-sumnav'); if(n)n.innerHTML=sumNavHTML();
 var a=$('rs-avnav'); if(a)a.innerHTML=avNavHTML();
 var sec=SUMSEC.filter(function(s){return s.k===ST.sumSec;})[0];
 document.querySelectorAll('#sum .rs-host').forEach(function(h){
  var f=(h.getAttribute('data-for')||'').split(' ');
  h.classList.toggle('on',f.indexOf(ST.sumSec)>=0);});
 ['energetics','psyche','saboteurs'].forEach(function(k){var l=$('rs-lede-'+k);if(l)l.textContent=(SUMSEC.filter(function(s){return s.k===k;})[0]||{}).lede||'';});
 var lt=$('rs-lede-top'); if(lt)lt.textContent=sec&&['narrative','masks','analytics'].indexOf(sec.k)>=0?sec.lede:'';}

/* ============================================================
   THE TAB BAR. Relabelled only while the proposal is on, and only to
   words whose tab works: Avatar opens the avatar and the intake.
   ============================================================ */
function tabs(){
 var on=ST.mode==='new';
 var en=document.querySelector('.tabtop[data-tabk="5"]'), story=document.querySelector('.tabtop[data-tabk="0"]');
 if(en){en.querySelector('.n').textContent=(on&&ST.avAt==='top')?'Avatar':'Energetics';
  en.style.display=(on&&ST.avAt==='summary')?'none':'';}
 if(story)story.style.display=on?'none':'';
 /* the Story tab's journal is on the Field now, so a person sent there by
    the old habit lands on the Field */
 if(on&&S.tab===TAB.STORY)setTab(TAB.FIELD);
 if(on&&ST.avAt==='summary'&&S.tab===TAB.INTAKE){ST.sumSec='avatar';ST.avSub='intake';setTab(TAB.SUMMARY);}}

/* ============================================================
   PAINT
   ============================================================ */
function paintAll(anim){
 if(ST.mode!=='new')return;
 paintVoice(anim); paintJournal(); paintImprints(); paintRight();}
function afterRender(){
 if(ST.mode!=='new')return;
 if(S.tab===TAB.SUMMARY)tagSum();
 if(S.tab===TAB.FIELD){var r=compute();var sig=[bankList().length,Math.round(r.DQ*10),vaultList().length,ST.bankBy,ST.vaultBy].join('|');
  if(sig!==ST.prev){ST.prev=sig;paintRight();paintImprints();if(!ST.voice)paintVoice(false);}}}

/* ============================================================
   THE STRIP. Marked data-proto, so the measurement never counts it.
   ============================================================ */
var WHO=[['blank','Nobody yet'],['Sofia','Sofia, 41'],['Diane','Diane, 46'],['Marcus','Marcus, 44'],['Angela','Angela, 36'],['Derek','Derek, 39'],['James','James, 57']];
function stripHTML(){
 var seg=function(k,v,nm){return '<button type="button" data-rs-set="'+k+'" data-v="'+v+'" aria-pressed="'+(ST[k]===v)+'">'+nm+'</button>';};
 return '<span class="rs-badge">Prototype</span>'
  +'<span class="rs-say">Not the shipped app. A mockup of FY: the Field and the Summary restructured. Nothing here is saved.</span>'
  +'<span class="rs-seg" role="radiogroup" aria-label="Layout">'+seg('mode','old','Today')+seg('mode','new','Proposed')+'</span>'
  +'<select data-rs-who="1" aria-label="Person">'+WHO.map(function(w){return '<option value="'+w[0]+'"'+(ST.who===w[0]?' selected':'')+'>'+w[1]+'</option>';}).join('')+'</select>'
  +'<button type="button" class="rs-more" data-rs-opts="1" aria-expanded="false">Options</button>';}
function optsHTML(){
 var seg=function(k,v,nm){return '<button type="button" data-rs-set="'+k+'" data-v="'+v+'" aria-pressed="'+(ST[k]===v)+'">'+nm+'</button>';};
 return '<h4>Where the avatar lives</h4><p>His words allow both: "change the Energetics tab to Avatar", and a secondary nav on the Summary.</p>'
  +'<div class="rs-seg">'+seg('avAt','top','Top bar, in place of Energetics')+seg('avAt','summary','Inside the Summary')+'</div>'
  +'<h4>What the bank counts</h4><p>Measured in bankvault.js: a count of addresses above the line did not move on 37 of 38 first week entries.</p>'
  +'<div class="rs-seg">'+seg('bankBy','carry','Everything carrying')+seg('bankBy','held','Held above the line, as today')+'</div>'
  +'<h4>What the vault counts</h4><p>Measured: no release in fifteen left an address at 6 of 100 or under.</p>'
  +'<div class="rs-seg">'+seg('vaultBy','opened','Released at least once')+seg('vaultBy','cleared','Cleared entirely')+'</div>'
  +'<h4>Try it</h4><p>Types one of this person\'s own lines (sim/stories.js) into the journal. You still press Commit.</p>'
  +'<div class="rs-seg"><button type="button" data-rs-line="1">Type one of their lines</button>'
  +seg('fast',true,'Fast release')+seg('fast',false,'Release at the shipped pace')+'</div>';}
function strip(){
 var s=$('rs-strip');
 if(!s){s=document.createElement('div');s.id='rs-strip';s.setAttribute('data-proto','1');s.setAttribute('role','region');s.setAttribute('aria-label','Prototype controls');document.body.appendChild(s);
  var o=document.createElement('div');o.id='rs-opts';o.hidden=true;o.setAttribute('data-proto','1');document.body.appendChild(o);}
 s.innerHTML=stripHTML(); $('rs-opts').innerHTML=optsHTML();}

/* ============================================================
   LOAD A PERSON. seats4's build: the reference field, their own story
   bank applied, their becoming pairs, so the Field, the Summary and the
   avatar all read one state.
   ============================================================ */
function load(who){
 ST.who=who; ST.vault={}; ST.voice=null; ST.pending=null; ST.prev=null;
 ST_TEXT=''; ST_PARSED=null; var ta=$('rs-ta'); if(ta)ta.value='';
 if(window.S4){S4.ST.clean=true;S4.ST.dock=false;S4.ST.L='told';S4.build(who);document.body.classList.remove('s4-on');}
 else loadP(who==='blank'?0:PEOPLE.map(function(p){return p.nm;}).indexOf(who));
 if(typeof render==='function')render();
 strip(); paintAll(true); place();}
function typeLine(){
 var bank=(window.S4_BANK&&S4_BANK[ST.who])||[], says=(PEOPLE.filter(function(p){return p.nm===ST.who;})[0]||{}).says;
 var lines=bank.concat(says?[says]:[]);
 if(!lines.length)lines=['My sister called again and I felt the old tightness in my chest. The same guilt, the same shame. I said yes when I meant no and then I was angry at myself all night.'];
 var i=(ST.lineIx[ST.who]||0)%lines.length; ST.lineIx[ST.who]=i+1;
 if(S.tab!==TAB.FIELD)setTab(TAB.FIELD);
 var ta=$('rs-ta'); if(ta){ta.value=lines[i]; onType(); ta.focus();}}

/* ============================================================
   WIRING
   ============================================================ */
function wire(){
 document.addEventListener('click',function(e){
  var t=e.target, b;
  if(!t.closest)return;
  if((b=t.closest('[data-rs-set]'))){var k=b.getAttribute('data-rs-set'), v=b.getAttribute('data-v');
   if(v==='true')v=true; if(v==='false')v=false;
   ST[k]=v;
   if(k==='avAt'&&v==='top'&&ST.sumSec==='avatar')ST.sumSec='narrative';
   if(k==='mode'&&v==='old'){ST.voice=null;}
   apply(); return;}
  if((b=t.closest('[data-rs-opts]'))){var o=$('rs-opts');o.hidden=!o.hidden;b.setAttribute('aria-expanded',String(!o.hidden));return;}
  if((b=t.closest('[data-rs-line]'))){$('rs-opts').hidden=true;typeLine();return;}
  if((b=t.closest('[data-rs-sec]'))){ST.sumSec=b.getAttribute('data-rs-sec');place();
   var sm=$('sum'); if(sm)sm.scrollTop=0; if(innerWidth<=1180&&sm){var r=sm.getBoundingClientRect();if(r.top<0)scrollBy(0,r.top-50);}
   if(ST.sumSec==='avatar'&&ST.avSub==='intake'&&typeof renderIntake==='function')renderIntake();
   return;}
  if((b=t.closest('[data-rs-av]'))){ST.avSub=b.getAttribute('data-rs-av');
   if(ST.avSub==='intake'&&typeof renderIntake==='function')renderIntake();
   place(); return;}
  if((b=t.closest('[data-rs-go]'))){var g=b.getAttribute('data-rs-go');
   if(g==='avatar'){ST.avSub='avatar'; if(ST.avAt==='top')setTab(TAB.INTAKE); else {ST.sumSec='avatar';setTab(TAB.SUMMARY);}}
   return;}
  if((b=t.closest('[data-rs-node]'))){var n=BY[+b.getAttribute('data-rs-node')];if(n)runNodeDrill(n);return;}
  if(t.closest('#rs-commit')){commit();return;}
  if(t.closest('#rs-run')){runRelease();return;}},false);
 document.addEventListener('change',function(e){
  if(e.target.matches&&e.target.matches('[data-rs-who]'))load(e.target.value);
  if(e.target.id==='psel'){/* the shipped picker moved the field under us; follow it */
   var nm=(PEOPLE[S.who]||{}).nm; ST.vault={}; ST.voice=null; ST.prev=null;
   if(nm&&nm!=='You'){ST.who=nm;} else ST.who='blank';
   strip(); paintAll(false);}});
 document.addEventListener('input',function(e){if(e.target.id==='rs-ta')onType();});
 document.addEventListener('scroll',function(e){if(e.target&&e.target.id==='rs-ta'){var hl=$('rs-hl');if(hl){hl.scrollTop=e.target.scrollTop;}}},true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=$('rs-opts');if(o&&!o.hidden)o.hidden=true;}});}

function sections(){
 /* the moved sections open where the proposal puts them, since a section a
    person has to open inside a section they chose is a second choice. With
    the strip on Today they go back to the shipped defaults. */
 try{if(ST.mode==='new'){OPENSEC.left.lean=1;OPENSEC.left.fetters=1;OPENSEC.left.soul=1;OPENSEC.right.laws=1;OPENSEC.right.flow=1;OPENSEC.right.running=1;}
  else if(ST.open0&&ST.lastMode!=='old'){OPENSEC.left=JSON.parse(JSON.stringify(ST.open0.left));OPENSEC.right=JSON.parse(JSON.stringify(ST.open0.right));}
  ST.lastMode=ST.mode; paintSections();}catch(e){}}
function apply(){
 sections(); strip(); tabs(); place(); paintAll(false);
 if(typeof render==='function')render();
 document.documentElement.setAttribute('data-rs',[ST.mode,ST.who,ST.avAt,ST.bankBy,ST.vaultBy,S.tab,ST.sumSec,ST.avSub].join('|'));}

function mount(o){
 o=o||{};
 Object.keys(o).forEach(function(k){if(o[k]!==undefined&&o[k]!==null&&o[k]!=='')ST[k]=o[k];});
 document.body.classList.add('rs-proto');
 /* the right panel has no id in the shipped markup; the proposal needs to name it */
 var cols=document.querySelectorAll('.mid>.col'); var rp=cols[cols.length-1].querySelector('.panel'); rp.id='rpanel';
 var lp=$('lpanel');
 reg('energetics',lp.querySelector('.lsec[data-sec="energetics"]'));
 reg('fdock',$('fdock'));
 reg('soul',lp.querySelector('.lsec[data-sec="soul"]'));
 reg('lean',lp.querySelector('.lsec[data-sec="lean"]'));
 reg('fetters',lp.querySelector('.lsec[data-sec="fetters"]'));
 reg('matrix',lp.querySelector('.lsec[data-sec="matrix"]'));
 reg('railtop',$('railtop'));
 /* Root Energetics read across (FV, fe433d8), at the head of the right rail
    since that build. A reading of the whole picture, so it goes with the tools. */
 reg('overlap',rp.querySelector('.lsec[data-sec="overlap"]'));
 reg('you',rp.querySelector('.lsec[data-sec="you"]'));
 reg('sel',rp.querySelector('.lsec[data-sec="sel"]'));
 reg('flow',rp.querySelector('.lsec[data-sec="flow"]'));
 reg('running',rp.querySelector('.lsec[data-sec="running"]'));
 reg('laws',rp.querySelector('.lsec[data-sec="laws"]'));
 var br=$('bRel'); if(br&&br.parentNode)br.parentNode.classList.add('rs-relbtn');
 /* the new rails and the tick */
 lp.insertAdjacentHTML('beforeend',leftHTML());
 rp.insertAdjacentHTML('beforeend',rightHTML());
 var tk=document.createElement('div'); tk.id='rs-tick'; tk.setAttribute('aria-hidden','true'); $('stage').appendChild(tk);
 /* the avatar host: the sub nav and seats4's #s4, which seats4 finds by id */
 var av=document.createElement('div'); av.id='rs-av';
 av.innerHTML='<nav class="rs-nav" id="rs-avnav" aria-label="Avatar and intake"></nav><div id="s4"></div>';
 $('stage').appendChild(av);
 hosts(); orderHosts(); homeAll();
 /* moved sections read open where the proposal puts them, since a section a
    person has to open inside a section they chose is a second choice */
 try{ST.open0=JSON.parse(JSON.stringify(OPENSEC));}catch(e){}
 hookRelease();
 /* every render repaints what the new rails read; setTab re-places */
 var rr=window.render; window.render=function(){var x=rr.apply(this,arguments);try{afterRender();}catch(e){console.error(e);}return x;};
 var st=window.setTab; window.setTab=function(i){
   if(ST.mode==='new'&&TABREAL(i)===TAB.STORY)i=TAB.FIELD;
   if(ST.mode==='new'&&ST.avAt==='summary'&&TABREAL(i)===TAB.INTAKE){ST.sumSec='avatar';ST.avSub='intake';i=TAB.SUMMARY;}
   var x=st.call(this,i);try{
   place(); if(ST.mode==='new'&&S.tab===TAB.SUMMARY)tagSum();
   if(ST.mode==='new'&&S.tab===TAB.FIELD)paintAll(false);}catch(e){console.error(e);}return x;};
 wire();
 load(ST.who);
 if(o.tab!=null)setTab(+o.tab);
 apply();
 document.documentElement.setAttribute('data-rs-ready','1');}

return {mount:mount, ST:ST, apply:apply, load:load, typeLine:typeLine, commit:commit, runRelease:runRelease,
 bankList:bankList, vaultList:vaultList, set:function(k,v){ST[k]=v;apply();}};
})();
