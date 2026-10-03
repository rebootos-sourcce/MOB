/* ============================================================
   THE SHELF. Round CY, 26 September. Prototype only.

   Laid over the shipped build by proto/shelf/build.js. Nothing under
   atuned_src/ is changed: every answer the shelf shows is the product's own
   drill, written by the product's own run*Drill functions into the product's
   own #rdrill. What this file changes is where that answer lives and what
   sits around it.

   The design, in one paragraph. The product already has exactly one place
   every press answers: "THE DRILLS. Every element that carries data opens
   one. Same panel for all of them, so there is one place to look." That
   panel is the Selection section of the right rail, and its whole recorded
   history is of answers landing where nobody was looking: under a Reading
   1,440 to 1,888 pixels tall on a desktop, four thousand pixels under the
   picture on a phone. The shelf is that panel, lifted to the top of the
   rail, with the rail closed until something is pressed. The rest of the
   rail becomes the shelf's page view: the table of what this page holds.

   States: closed, page, item. One item at a time. A second press swaps the
   item and the first goes on a one step trail the back control returns to.
   ============================================================ */
(function(){
'use strict';
var D=document, B=D.body;
var SH={state:'closed',cur:null,trail:[],from:'stage',pending:null,replaying:false,
 sheet:'half',src:null,shareOpen:false,then:null};
window.SHELF=SH;
var STORE='atuned.shelf.proto.v1';
var PHONE=function(){return matchMedia('(max-width:1180px)').matches;};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
 return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
var SEATVAR={Root:'--root',Sacral:'--sacral',Solar:'--solar',Heart:'--heart',Throat:'--throat',
 '3rd Eye':'--eye','Third Eye':'--eye',Crown:'--crown',
 root:'--root',sacral:'--sacral',solar:'--solar',heart:'--heart',throat:'--throat',eye:'--eye',crown:'--crown'};
var seatCol=function(b){return b&&SEATVAR[b]?'var('+SEATVAR[b]+')':'var(--accent)';};
var ICON={
 back:'<path d="M15 5l-7 7 7 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 save:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 mark:'<path d="M7 4.5h10v15l-5-3.6-5 3.6z"/>',
 share:'<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.4 10.8l7.2-3.6M8.4 13.2l7.2 3.6"/>',
 up:'<path d="M6 15l6-6 6 6"/>',
 shelf:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M14 4.5v15M16.8 9h1.2M16.8 12h1.2M16.8 15h1.2"/>',
 full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 unfull:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'};
var ic=function(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+ICON[k]+'</svg>';};

/* ---------------- the store: bookmarks and saved readings ----------------
   Local, as everything but the quiz record is. A write that fails says so
   and keeps the item for this session; it never claims a save it lacks. */
var MEM={marks:[],saved:[]};
(function load(){try{var t=localStorage.getItem(STORE);if(t){var o=JSON.parse(t);
 if(o&&Array.isArray(o.marks))MEM.marks=o.marks; if(o&&Array.isArray(o.saved))MEM.saved=o.saved;}}catch(e){}})();
function persist(okMsg){
 try{localStorage.setItem(STORE,JSON.stringify(MEM));
  if(typeof status==='function')status(okMsg);return true;}
 catch(e){if(typeof status==='function')
  status('Kept for this session only. Storage is full or blocked, so it will not survive a reload.','fail');
  return false;}}

/* ---------------- what an item is ----------------
   Each drill the shelf knows is wrapped so the shelf learns what was opened:
   a key it can come back to, a headline value, and the class that decides
   what sharing it would mean. The class follows DECISIONS.md, "Tiers and the
   meter": a cohort lead sees the outputs, "Fetters, saboteurs, complexes,
   hyper complexes, and their analytics. Not the spiritual material and not
   the story cloud." */
function seatOf(n){return n&&n.b;}
function nodeNow(i){var n=BY[i];return n?n.sq:null;}
function patFind(kind,nm){try{var r=compute();
 return [].concat(r.sups||[],r.hys||[],r.cxs||[],r.sabs||[]).filter(function(o){
  return o.kind===kind&&o.nm===nm;})[0]||null;}catch(e){return null;}}
var TN={sup:'Character layer',hy:'Hyper complex',cx:'Complex',sab:'Saboteur'};
var META={
 runNodeDrill:function(n){if(!n)return null;
  return {kind:'node',key:'node:'+n.i,i:n.i,title:n.k,seat:n.b,cls:'record',
   val:function(){return nodeNow(n.i);},
   send:n.k+' at the '+String(n.b).toLowerCase()+'. Held '+n.held.toFixed(1)+', net SQ '+n.sq.toFixed(1)+'.'};},
 runDrill:function(o){if(!o)return null;
  var lv=(typeof leaves==='function')?leaves(o):[];
  return {kind:'pat',key:'pat:'+o.kind+':'+o.nm,pk:o.kind,nm:o.nm,title:o.nm,
   seat:lv[0]&&lv[0].b,cls:'record',
   val:function(){var x=patFind(o.kind,o.nm);return x?x.w:null;},
   send:o.nm+', '+(TN[o.kind]||'pattern').toLowerCase()+'. Weight '+(o.w!=null?o.w.toFixed(1):'unread')
    +', built from '+lv.length+' held address'+(lv.length===1?'':'es')+'.'};},
 runLawDrill:function(l){if(!l)return null;
  return {kind:'law',key:'law:'+l.nm,nm:l.nm,title:l.nm,seat:l.b,cls:'open',
   val:function(){return S.law[l.nm];}};},
 runSeatDrill:function(c){if(!c)return null;
  return {kind:'seat',key:'seat:'+c.b,b:c.b,title:c.b,seat:c.b,cls:'record'};},
 runSeatFlowDrill:function(k){if(!k)return null;
  var nm=(typeof K2B!=='undefined'&&K2B[k])||k;
  return {kind:'flow',key:'flow:'+k,k:k,title:nm,seat:nm,cls:'record'};},
 runPainDrill:function(k){return {kind:'pain',key:'pain:'+k,k:k,title:String(k),cls:'record'};},
 runCoreDrill:function(){return {kind:'core',key:'core',title:'The core',cls:'record',
  val:function(){try{var r=compute();return r.unread?null:Math.round(r.CQ);}catch(e){return null;}}};},
 runGatesDrill:function(k){return {kind:'gate',key:'gate:'+k,k:k,cls:'record'};},
 runAtomDrill:function(){return {kind:'atom',key:null,cls:'record'};},
 runKbDrill:function(){return {kind:'kb',key:null,cls:'reference'};},
 runCardDrill:function(){return {kind:'kb',key:null,cls:'reference'};},
 runAxCardDrill:function(){return {kind:'kb',key:null,cls:'reference'};}};
Object.keys(META).forEach(function(name){
 var f=window[name]; if(typeof f!=='function')return;
 window[name]=function(){
  var a=arguments, m=null;
  try{m=META[name].apply(null,a);}catch(e){m=null;}
  if(m)m.replay=function(){return window[name].apply(null,a);};
  var prev=SH.pending; SH.pending=m;
  try{return f.apply(this,a);}finally{SH.pending=prev;}};});

/* reopen a bookmark by its key, through the same doors a press uses */
function reopen(key){
 var p=String(key).split(':');
 if(p[0]==='node'){var n=BY[+p[1]]; if(n){SH.src={i:n.i}; S.pin=null; runNodeDrill(n); render();}}
 else if(p[0]==='pat'){var o=patFind(p[1],p.slice(2).join(':'));
  if(o){S.pin=o;runDrill(o);render();}
  else if(typeof status==='function')status('Not held any more. Nothing to open.','fail');}
 else if(p[0]==='law'){var l=(SI||[]).filter(function(x){return x.nm===p[1];})[0];if(l){runLawDrill(l);render();}}
 else if(p[0]==='seat'){var c=(APC||[]).filter(function(x){return x.b===p[1];})[0];if(c){runSeatDrill(c);render();}}
 else if(p[0]==='flow'){runSeatFlowDrill(p[1]);}
 else if(p[0]==='core'){runCoreDrill();render();}}

/* ---------------- the markup ---------------- */
var mid=D.querySelector('.mid'), cols=mid?mid.querySelectorAll(':scope>.col'):[];
var col=cols[1], panel=col&&col.querySelector('.panel');
var stage=D.querySelector('.stage');
if(!col||!panel||!stage){console.warn('shelf: rail or stage not found');return;}
B.classList.add('shelf-proto');
col.id='shelf'; col.setAttribute('role','complementary'); col.setAttribute('aria-label','Shelf');
panel.classList.add('sh-panel');
var kids=[].slice.call(panel.childNodes);
panel.innerHTML=
 '<div class="sh-grip" aria-hidden="true"></div>'
 +'<div class="sh-hd">'
 +'<button type="button" class="sh-back" hidden>'+ic('back')+'<span></span></button>'
 +'<div class="sh-ttl"><i class="sh-dot" aria-hidden="true"></i><div><div class="sh-eye"></div>'
 +'<div class="sh-nm" id="shnm" tabindex="-1"></div></div></div>'
 +'<button type="button" class="sh-x" aria-label="Close the shelf">'+ic('x')+'</button></div>'
 +'<div class="sh-acts" role="toolbar" aria-label="This item">'
 +'<button type="button" data-act="save">'+ic('save')+'<span>Save</span></button>'
 +'<button type="button" data-act="mark" aria-pressed="false">'+ic('mark')+'<span>Bookmark</span></button>'
 +'<button type="button" data-act="share" aria-expanded="false">'+ic('share')+'<span>Share</span></button></div>'
 +'<div class="sh-body">'
 +'<div class="sh-share" hidden></div>'
 +'<div class="sh-then" hidden></div>'
 +'<div class="sh-item"></div>'
 +'<div class="sh-page"><div class="sh-own" id="shmarks" hidden></div><div class="sh-own" id="shsaved" hidden></div></div>'
 +'</div>';
var Q=function(s){return panel.querySelector(s);};
var page=Q('.sh-page'), item=Q('.sh-item'), body=Q('.sh-body');
kids.forEach(function(k){page.appendChild(k);});
/* the rail's own railtop leads the page: the one line that is always true */
var rt=D.getElementById('railtop'); if(rt)page.insertBefore(rt,page.firstChild);
var rd=D.getElementById('rdrill'); if(rd)item.appendChild(rd);

var tab=D.createElement('button'); tab.type='button'; tab.className='sh-tab'; tab.id='shelftab';
tab.setAttribute('aria-controls','shelf'); stage.appendChild(tab);
var full=D.createElement('button'); full.type='button'; full.className='sh-full';
full.setAttribute('aria-pressed','false'); full.setAttribute('aria-label','Give the picture the whole screen');
full.innerHTML=ic('full'); stage.appendChild(full);
var ring=D.createElement('div'); ring.className='sh-src'; ring.setAttribute('aria-hidden','true'); stage.appendChild(ring);

/* ---------------- state ---------------- */
function pageName(){try{return (TABDEF.filter(function(t){return t.k===S.tab;})[0]||{}).nm||'This page';}
 catch(e){return 'This page';}}
/* the shelf stops above the Field's dock, so the readouts along the foot
   stay readable while it is open */
function fitFoot(){
 if(PHONE()){col.style.removeProperty('--sh-foot');return;}
 var dk=D.getElementById('fdock'), mr=mid.getBoundingClientRect(), f=10;
 if(dk&&dk.offsetParent&&S.tab===TAB.FIELD){var r=dk.getBoundingClientRect();
  if(r.height)f=Math.max(10,Math.round(mr.bottom-r.top+8));}
 col.style.setProperty('--sh-foot',f+'px');}
/* THE PRESSED THING STAYS IN VIEW. If the open shelf would cover the mark
   that opened it, the Field pans by the overlap and gives it back on close.
   A pan, never a rescale: the mark moves once, a short way, with the shelf,
   and keeps its size. */
var PANNED=0;
function keepClear(){
 if(PHONE()||S.tab!==TAB.FIELD||typeof reframe!=='function')return;
 var q=srcBox(); if(!q)return;
 var sr=stage.getBoundingClientRect(), shL=col.getBoundingClientRect().left-sr.left;
 var over=(q.x+q.r+20)-shL;
 if(over>0){S.panx=(S.panx||0)-over; PANNED+=over; reframe(); render();}}
function giveBack(){
 if(PANNED&&typeof reframe==='function'){S.panx=(S.panx||0)+PANNED; PANNED=0; reframe(); render();}}
/* the page's own table leads the page view. On the Field that is the
   Reading. On Body it is the list of what the figure holds, which the rail
   kept in its Flow section under the Reading, so it opens and goes first. */
function leadTable(){
 if(S.tab===TAB.ENERGY&&typeof OPENSEC==='object'&&OPENSEC&&OPENSEC.right){
  OPENSEC.right.flow=1; if(typeof paintSections==='function')paintSections();}}
function setState(s){
 if(s==='closed'&&SH.state!=='closed')giveBack();
 if(s==='page'&&SH.state!=='page')leadTable();
 SH.state=s; B.setAttribute('data-shelf',s); fitFoot();
 if(s!=='closed'&&PHONE()){
  var want=(s==='page')?'full':(SH.sheet==='full'?'full':'half');
  B.setAttribute('data-sheet',want); SH.sheet=want;}
 if(s==='closed'){SH.shareOpen=false; B.removeAttribute('data-sheet');}
 paint();}
function paint(){
 var back=Q('.sh-back'), eye=Q('.sh-eye'), nm=Q('.sh-nm'), dot=Q('.sh-dot');
 if(SH.state==='page'){
  back.hidden=true; eye.textContent='On this page'; nm.textContent=pageName();
  panel.style.setProperty('--sh-c','var(--accent)'); paintOwn();}
 if(SH.state==='item'&&SH.cur){
  var up=SH.trail.length?SH.trail[SH.trail.length-1].title:pageName();
  back.hidden=false; back.querySelector('span').textContent=up||'Back';
  back.setAttribute('aria-label','Back to '+(up||'the page'));
  panel.style.setProperty('--sh-c',seatCol(SH.cur.seat));
  var k=SH.cur.key, marked=!!(k&&MEM.marks.some(function(m){return m.key===k;}));
  var mb=Q('[data-act="mark"]'); mb.setAttribute('aria-pressed',marked?'true':'false');
  /* NO TITLE ON A SHELF CONTROL. On a touch screen the product's tip reads
     any element carrying a title as a tip and spends the first tap showing
     it, so a Bookmark with title="" took two taps on a phone and looked
     broken on one. Found by reproducing it, not by reading. The reason a
     control is off goes in its accessible name instead. */
  mb.disabled=!k; mb.removeAttribute('title');
  if(k)mb.removeAttribute('aria-label'); else mb.setAttribute('aria-label','Bookmark. Off: this one has no fixed place to come back to.');
  /* a saved reading is already a save; saving it again would copy a copy */
  Q('[data-act="save"]').disabled=!!SH.cur.snapRef;
  Q('[data-act="share"]').setAttribute('aria-expanded',SH.shareOpen?'true':'false');
  paintShare(); paintThen();}
 paintTab();}
function paintItem(){
 var card=rd&&rd.querySelector('.rd-card'); if(!card||!SH.cur)return;
 /* the drill's own eyebrow and name go up into the head, once */
 var e0=card.querySelector('.pm-eye'), n0=card.querySelector('.ad-nm');
 if(e0){SH.cur.eye=e0.textContent.trim(); e0.classList.add('sh-lifted');}
 if(n0){SH.cur.title=SH.cur.title||n0.textContent.trim(); n0.classList.add('sh-lifted');}
 if(!SH.cur.title)SH.cur.title=SH.cur.eye||'Selection';
 Q('.sh-eye').textContent=SH.cur.eye||'';
 Q('.sh-nm').textContent=n0?n0.textContent.trim():SH.cur.title;
 body.scrollTop=0;
 item.style.animation='none'; void item.offsetWidth; item.style.animation='';
 paint(); keepClear(); placeSrc(true);
 if(PHONE())bringIntoView();}

/* ---------------- the product's one drill door, redirected ---------------- */
var _rdClose=window.rdClose;
window.rdOpen=function(){
 if(!rd)return null;
 rd.style.display='block';
 var none=D.getElementById('rdrill-none'); if(none)none.style.display='none';
 var m=SH.pending||{kind:'other',key:null,cls:'record'};
 /* a second press swaps the item. The first goes on the trail, unless it is
    the same thing pressed again, which the product already reads as putting
    it down and routes to rdClose before this is reached. */
 if(SH.state==='item'&&SH.cur&&!SH.replaying&&!(m.key&&SH.cur.key===m.key))
  SH.trail.push(SH.cur);
 if(SH.state!=='item')SH.from=(SH.state==='page')?'page':'stage';
 if(m.kind!=='node')SH.src=null; else SH.src={i:m.i};
 SH.cur=m; SH.replaying=false; SH.shareOpen=false; SH.then=null;
 setState('item');
 Promise.resolve().then(paintItem);
 return rd;};
window.rdClose=function(){
 _rdClose();
 SH.trail=[]; SH.cur=null; SH.src=null; SH.then=null;
 setState(SH.from==='page'&&SH.state!=='closed'?'page':'closed');};
function goBack(){
 if(SH.trail.length){var m=SH.trail.pop(); SH.replaying=true;
  if(m.snapRef){SH.replaying=true;showSaved(m.snapRef);return;}
  if(m.replay){m.replay(); if(typeof render==='function')render();}
  return;}
 _rdClose(); SH.cur=null; SH.src=null; SH.then=null; setState('page');}
function closeAll(){
 SH.trail=[]; SH.from='stage';
 if(SH.state==='item')_rdClose();
 SH.cur=null; SH.src=null; setState('closed'); tab.focus();}
function openPage(){SH.from='page'; setState('page'); try{Q('#shnm').focus({preventScroll:true});}catch(e){}}

Q('.sh-back').onclick=goBack;
Q('.sh-x').onclick=closeAll;
tab.onclick=openPage;
full.onclick=function(){var on=!B.classList.contains('stage-full');
 B.classList.toggle('stage-full',on); full.setAttribute('aria-pressed',on?'true':'false');
 full.innerHTML=ic(on?'unfull':'full');};
addEventListener('keydown',function(e){
 if(e.key==='Escape'&&SH.state==='page'){closeAll();}});

/* ---------------- save, bookmark, share ---------------- */
function when(iso){var d=new Date(iso);
 var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
 return d.getDate()+' '+M[d.getMonth()]+', '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function valOf(m){try{var v=m&&m.val?m.val():null;return (v==null||!isFinite(v))?null:v;}catch(e){return null;}}
function fmt(v,kind){return v==null?'–':(kind==='core'?String(Math.round(v)):(+v).toFixed(1));}
Q('.sh-acts').onclick=function(e){
 var b=e.target.closest&&e.target.closest('button[data-act]'); if(!b||b.disabled||!SH.cur)return;
 var a=b.getAttribute('data-act'), c=SH.cur;
 if(a==='mark'){
  var i=-1; MEM.marks.forEach(function(m,j){if(m.key===c.key)i=j;});
  if(i>=0){MEM.marks.splice(i,1); persist('Bookmark removed.');}
  else{MEM.marks.unshift({key:c.key,title:c.title,seat:c.seat||null,kind:c.kind});
   persist('Bookmarked. Kept on this page’s shelf.');}
  paint();}
 if(a==='save'){
  var card=rd.querySelector('.rd-card'); if(!card)return;
  var cl=card.cloneNode(true);
  cl.querySelectorAll('.ad-prot,button,.rd-top').forEach(function(x){x.remove();});
  cl.querySelectorAll('.sh-lifted').forEach(function(x){x.classList.remove('sh-lifted');});
  var snap={id:Date.now(),key:c.key,title:c.title,eye:c.eye||'',seat:c.seat||null,kind:c.kind,
   at:new Date().toISOString(),v:valOf(c),html:cl.innerHTML};
  MEM.saved.unshift(snap);
  persist('Saved as it reads now, '+when(snap.at)+'.');}
 if(a==='share'){SH.shareOpen=!SH.shareOpen; paint();
  if(SH.shareOpen)body.scrollTop=0;}};
function whose(){try{return CURP&&CURP.nm||'';}catch(e){return '';}}

var NEVER='Your story, in your own words. Archetypes, domains and the rest of the spiritual material.';
function paintShare(){
 var p=Q('.sh-share'), c=SH.cur;
 p.hidden=!SH.shareOpen||!c; if(p.hidden)return;
 var what;
 if(c.cls==='record')what='<div class="sh-row"><span>This would send</span><b>'
  +esc(c.send||(c.title+', as it reads now.'))+'</b></div>';
 else if(c.cls==='open')what='<div class="sh-row no"><span>This would send</span><b>Not settled. Laws of integrity are not named in the ruling on what a coach sees.</b></div>';
 else if(c.cls==='reference')what='<div class="sh-row no"><span>This would send</span><b>A reference card. Nothing of yours is in it.</b></div>';
 else what='<div class="sh-row no"><span>This would send</span><b>Nothing. This is spiritual material, which a coach does not see.</b></div>';
 p.innerHTML='<div class="pm-eye">Share with your coach</div>'
  +'<div class="sh-row"><span>Who has sight</span><b>Nobody. No coach is connected.</b></div>'
  +what
  +'<div class="sh-row no"><span>Never sent</span><b>'+NEVER+'</b></div>'
  +'<button type="button" class="btn pri sh-send" disabled>Send to your coach</button>'
  +'<p class="sh-fine">Sharing needs an account and a coach you have granted sight. Neither exists yet, so nothing leaves this device.</p>';}

function paintThen(){
 var t=Q('.sh-then'), s=SH.then;
 t.hidden=!s; if(!s)return;
 var now=null;
 if(s.key){var p=String(s.key).split(':');
  if(p[0]==='node')now=nodeNow(+p[1]);
  else if(p[0]==='pat'){var o=patFind(p[1],p.slice(2).join(':'));now=o?o.w:null;}
  else if(p[0]==='core'){try{var r=compute();now=r.unread?null:Math.round(r.CQ);}catch(e){}}}
 t.innerHTML='Saved <b>'+when(s.at)+'</b>. This is what it read then.'
  +(s.v!=null?' Then <b>'+fmt(s.v,s.kind)+'</b>, now <b>'+fmt(now,s.kind)+'</b>.':'')
  +(s.key?'<br><button type="button" class="btn" data-now="'+esc(s.key)+'">Open it as it reads now</button>':'');
 var nb=t.querySelector('[data-now]'); if(nb)nb.onclick=function(){SH.then=null; reopen(s.key);};}
function showSaved(s){
 if(SH.state==='item'&&SH.cur&&!SH.replaying)SH.trail.push(SH.cur);
 if(SH.state!=='item')SH.from=(SH.state==='page')?'page':'stage';
 SH.replaying=false;
 SH.cur={kind:s.kind,key:s.key,title:s.title,eye:s.eye,seat:s.seat,cls:'record',snapRef:s,
  val:function(){return s.v;}};
 SH.then=s; SH.src=null;
 rd.style.display='block';
 rd.innerHTML='<div class="rd-card">'+s.html+'</div>';
 setState('item');
 Q('.sh-eye').textContent=s.eye||''; Q('.sh-nm').textContent=s.title;
 body.scrollTop=0;}

/* ---------------- the page's own two lists ---------------- */
function paintOwn(){
 var m=Q('#shmarks'), s=Q('#shsaved');
 m.hidden=!MEM.marks.length; s.hidden=!MEM.saved.length;
 m.innerHTML=MEM.marks.length?'<div class="pm-eye">Bookmarks</div>'+MEM.marks.map(function(b){
  var v=null,p=String(b.key).split(':');
  if(p[0]==='node')v=nodeNow(+p[1]); else if(p[0]==='pat'){var o=patFind(p[1],p.slice(2).join(':'));v=o?o.w:null;}
  return '<button type="button" class="sh-li" data-open="'+esc(b.key)+'" style="--sh-c:'+seatCol(b.seat)+'">'
   +'<i></i><span><span class="t">'+esc(b.title)+'</span><span class="s">'+esc(b.seat||'')+'</span></span>'
   +'<span class="v">'+(v==null?'':fmt(v,b.kind))+'</span></button>';}).join(''):'';
 s.innerHTML=MEM.saved.length?'<div class="pm-eye">Saved</div>'+MEM.saved.slice(0,8).map(function(x){
  return '<button type="button" class="sh-li" data-snap="'+x.id+'" style="--sh-c:'+seatCol(x.seat)+'">'
   +'<i></i><span><span class="t">'+esc(x.title)+'</span><span class="s">'+esc(when(x.at))+'</span></span>'
   +'<span class="v">'+(x.v==null?'':fmt(x.v,x.kind)+'<small>then</small>')+'</span></button>';}).join(''):'';
 m.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(){reopen(b.getAttribute('data-open'));};});
 s.querySelectorAll('[data-snap]').forEach(function(b){b.onclick=function(){
  var x=MEM.saved.filter(function(y){return String(y.id)===b.getAttribute('data-snap');})[0];
  if(x)showSaved(x);};});}

/* ---------------- the tab: closed, it still says the one true thing ------ */
function paintTab(){
 var r=null; try{r=compute();}catch(e){}
 var ringH='', word='not read yet';
 if(r&&typeof cr==='function'){
  var tcol=(!r.unread&&typeof TIERCOL!=='undefined'&&TIERCOL[r.tier])||undefined;
  ringH=cr(r.darkB,r.unread?0:r.CQ,{size:'sm',label:'coherence',raw:r.unread?'–':undefined,hot:false,color:tcol});
  if(!r.unread&&typeof tierSay==='function')word=tierSay(r);}
 tab.innerHTML='<span class="sh-tv">'+ringH+'</span><span class="sh-tw">'+esc(word)+'</span>'
  +'<span class="sh-tl">'+ic('shelf')+'Shelf'+(PHONE()?ic('up'):'')+'</span>';
 tab.setAttribute('aria-label','Open the shelf for '+pageName()+'. Coherence '+(r&&!r.unread?Math.round(r.CQ)+' percent, '+word:word)+'.');
 tab.querySelectorAll('[title]').forEach(function(x){x.removeAttribute('title');});}

/* ---------------- the mark on the picture ----------------
   A press that opens an answer in a panel loses the thing that was pressed
   unless the picture keeps it marked. The Field draws a pattern it has
   pinned, and draws nothing for an address pressed, so the shelf rings it. */
var landNext=false;
function srcBox(){
 if(!SH.src||SH.state!=='item')return null;
 var sr=stage.getBoundingClientRect();
 if(S.tab===TAB.FIELD&&typeof HIT!=='undefined'){
  var cv=D.getElementById('cv'); if(!cv||cv.style.display==='none')return null;
  var cb=cv.getBoundingClientRect();
  for(var j=HIT.length-1;j>=0;j--){var h=HIT[j];
   if(h.k!=='node'||!h.n||h.n.i!==SH.src.i)continue;
   /* an address on the wheel is a segment of a ring, not a point: the hit
      list holds its centre, two radii and two angles. The mark goes on the
      middle of the segment. */
   if(h.x!==undefined)return {x:cb.left-sr.left+h.x,y:cb.top-sr.top+h.y,r:Math.max(14,(h.rad||8)+6)};
   var rm=(h.r0+h.r1)/2, am=(h.a0+h.a1)/2;
   if(h.a1<h.a0)am+=Math.PI;
   return {x:cb.left-sr.left+h.cx+rm*Math.cos(am),y:cb.top-sr.top+h.cy+rm*Math.sin(am),
    r:Math.max(14,(h.r1-h.r0)/2+8)};}}
 if(S.tab===TAB.ENERGY){
  var el=D.querySelector('#emap [data-node="'+SH.src.i+'"]');
  if(el){var b=el.getBoundingClientRect(); if(b.width||b.height)
   return {x:b.left-sr.left+b.width/2,y:b.top-sr.top+b.height/2,r:Math.max(14,b.width/2+7)};}}
 return null;}
function placeSrc(land){
 var q=srcBox();
 ring.classList.toggle('on',!!q);
 if(!q)return;
 if(SH.cur&&SH.cur.seat)ring.style.setProperty('--sh-c',seatCol(SH.cur.seat));
 ring.style.left=q.x+'px'; ring.style.top=q.y+'px';
 ring.style.width=ring.style.height=(q.r*2)+'px';
 if(land){ring.classList.remove('land'); void ring.offsetWidth; ring.classList.add('land');}}
(function loop(){try{placeSrc(false);}catch(e){} requestAnimationFrame(loop);})();

/* on a phone, the sheet rises over the lower half, so the page moves the
   pressed thing into the half that is still showing */
/* which element scrolls. Below 1180 the product sets overflow on html and
   body both, and it is the body that scrolls: a scroll sent to the window
   does nothing at all, which is how the first cut of this left the sheet
   over the wheel. Read at run time, never assumed. */
function scroller(){var b=D.body;
 if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))return b;
 return D.scrollingElement||D.documentElement;}
function bringIntoView(){
 var sr=stage.getBoundingClientRect(), q=srcBox();
 var y=q?(sr.top+q.y):(sr.top+Math.min(sr.height,innerWidth)/2);
 var free=innerHeight*0.44;
 var dy=y-free/2;
 if(Math.abs(dy)>8)scroller().scrollBy({top:dy,behavior:(typeof REDUCED!=='undefined'&&REDUCED)?'auto':'smooth'});}

/* ---------------- the sheet's drag, on a phone ---------------- */
(function drag(){
 var g=null;
 function down(e){if(!PHONE()||SH.state==='closed')return;
  if(e.target.closest&&e.target.closest('button'))return;
  g={y:e.clientY,t:Date.now()}; try{e.target.setPointerCapture(e.pointerId);}catch(x){}}
 function up(e){if(!g)return; var dy=e.clientY-g.y, tapped=Math.abs(dy)<6; g=null;
  if(tapped){B.setAttribute('data-sheet',SH.sheet=(SH.sheet==='half'?'full':'half'));return;}
  if(dy<-50){B.setAttribute('data-sheet',SH.sheet='full');}
  else if(dy>50){if(SH.sheet==='full'&&SH.state==='item')B.setAttribute('data-sheet',SH.sheet='half');
   else closeAll();}}
 [Q('.sh-grip'),Q('.sh-hd')].forEach(function(el){el.addEventListener('pointerdown',down);
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',function(){g=null;});});})();

/* ---------------- the Body page: an address answers as itself -------------
   Shipped, a press on an address on the figure opens its seat. With the
   shelf it has room to open the address, the same answer the Field gives,
   and the seat stays lit on the figure behind it. */
D.addEventListener('click',function(e){
 if(typeof S==='undefined'||S.tab!==TAB.ENERGY)return;
 var el=e.target&&e.target.closest?e.target.closest('#emap [data-node]'):null; if(!el)return;
 e.stopPropagation(); e.preventDefault();
 var n=BY[+el.getAttribute('data-node')]; if(!n)return;
 PMPICK=B2K[n.b]; S.pin=null;
 runNodeDrill(n); render();},true);

/* ---------------- keep the tab and lists current ---------------- */
var _render=window.render;
window.render=function(){var o=_render.apply(this,arguments);
 try{paintTab(); if(SH.state==='page')paintOwn(); if(SH.state==='item'&&SH.then)paintThen();}catch(e){}
 return o;};
addEventListener('resize',function(){paint();});
setState('closed');
})();
