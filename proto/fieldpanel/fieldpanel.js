/* ============================================================
   THE FIELD LEFT PANEL AND THE LAYER READINGS. Prototype overlay, round GO,
   27 September. Laid over the built source.html by build.js. Nothing under
   atuned_src/ is touched and nothing here is product code.

   His ask this round, TASKS.md GO: "I want the design team to take a look at
   this UI UX and simulate this with the focus group to see what they see in
   this too, and then to figure out how it could be expressed differently."

   What is already built into the file under this overlay, because he settled
   it himself: the column lands shut on a desktop, the right rail's summary is
   the Energetic Summary, Seats is Assemblage Points, Gates is Action, Close
   the tools leads the bar, and Depth's ring reads how deep the picture goes.

   What this overlay shows, because it is still his to rule. Each is a row in
   the dock, switched live, and every state has an address in the hash:

     s=prose|list|orbs     the Energetic Summary: shipped prose, a symbol
                           list, or the glass bar's own orbs
     p=draw|both|read      a press on a layer: draws only (shipped), draws and
                           opens its reading, or opens its reading with the
                           switch inside it
     l=laws|integrity|attunement|alignment|harmonic
                           the name on the Laws button
     m=now|twin|sum        the Character and Masks collision
     who=Sofia|Derek|Angela|James|blank
     land=shut|open        the column on landing, built shut, open to compare
     dock=0                the dock folded

   One file, one in-page switch, no links out: EA in TASKS.md, after a board
   that linked to a second page trapped him with no way back.
   ============================================================ */
(function(){
'use strict';
var FP={s:'list',p:'both',l:'laws',m:'now',who:'Sofia',land:'shut',dock:'1'};
var KEYS=Object.keys(FP);
function readHash(){
 String(location.hash||'').replace(/^#/,'').split('&').forEach(function(kv){
  var i=kv.indexOf('='); if(i<0)return; var k=kv.slice(0,i), v=decodeURIComponent(kv.slice(i+1));
  if(KEYS.indexOf(k)>=0)FP[k]=v;});}
function writeHash(){
 var h=KEYS.map(function(k){return k+'='+encodeURIComponent(FP[k]);}).join('&');
 try{history.replaceState(null,'','#'+h);}catch(e){location.hash=h;}}

/* ---- the questions, in his words where he gave any ---- */
var Q=[
 {k:'who',t:'Who is looking',opts:[
   ['Sofia','Sofia','Level 8. Somatic practitioner, birth data on file.'],
   ['Derek','Derek','Level 7. Wants the diagnostic.'],
   ['Angela','Angela','Level 5. Wants magic, not mechanics.'],
   ['James','James','Level 3. Defended, third turnaround.'],
   ['blank','Stranger','Nothing entered. A first visit.']]},
 {k:'s',t:'Energetic Summary',opts:[
   ['prose','As built','The prose he pointed at: four systems down to other ways this shows up.'],
   ['list','Symbols','Each overlap is its mark, a ring for how strongly they agree, and the four systems as marks. Words are one tap in.'],
   ['orbs','Orbs','The glass bar\'s own circles. Ring for strength, pill for how many systems land. Names under each.']]},
 {k:'p',t:'Pressing a layer',opts:[
   ['draw','As built','Draws or hides it. The right rail does not move.'],
   ['both','Draws and reads','Every press draws or hides it, and its reading opens on the right.'],
   ['read','Reads first','A press opens the reading and draws it. The switch to hide it is inside the reading.']]},
 {k:'l',t:'Laws is called',opts:[
   ['laws','Laws','As built. His words: "the word laws doesn\'t provide the picture."'],
   ['integrity','Integrity','His first word. The rail already calls these same 21 laws Moral integrity, so this is one name where there are two.'],
   ['attunement','Attunement','Echoes the product\'s own name. Used nowhere else yet.'],
   ['alignment','Alignment','Coherence is already defined as alignment, so this names CQ\'s own definition.'],
   ['harmonic','Harmonic laws','Keeps the word laws. Harmonic is already how the core describes the field.']]},
 {k:'m',t:'Character and Masks',opts:[
   ['now','As built','Character is the chain\'s innermost layer. Masks is the six, Child to Ideological.'],
   ['twin','Both Masks','Exactly as asked. Two buttons named Masks on one bar.'],
   ['sum','Character, the sum','Character keeps its name and its reading says it is the sum of every mask.']]},
 {k:'land',t:'Left panel on landing',opts:[
   ['shut','Shut','Built. His words: "the field left panel starts closed."'],
   ['open','Open','Before, for comparison.']]}];

/* ============================================================
   THE ENERGETIC SUMMARY, THREE WAYS. The data is the shipped renderer's own,
   rootOverlap in engine/overlap.js, read the same way ui/rootsum.js reads it.
   Only the drawing changes.
   ============================================================ */
var SHIP_RS=window.renderRootSum;
var FP_RS=null, FP_SIG=null;
function rsData(){
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm);
 if(!sp&&CURP&&CURP.who&&CURP.who.born&&CURP.who.born.date){var bn=CURP.who.born;
  sp=spiritualOf({d:bn.date,t:(bn.timeUnknown?'':(bn.time||'')),p:bn.place||'',z:bn.zone||''});}
 var real=numFullName(CURP)||(typeof FULLNAME!=='undefined'&&FULLNAME[p.nm]);
 var N=real?numerologyOf(p.nm,CURP):null;
 return {sp:sp,N:N,R:rootOverlap(sp,N)};}
/* how strongly, as a share of the ring. A word in the tooltip, never a figure */
var STR_P={strong:100,clear:66,light:34};
var SYS4=['W','E','N','D'];
function svg(ic,cls){return '<svg class="'+(cls||'fp-ic')+'" viewBox="0 0 24 24" aria-hidden="true">'+glyphPath(ic)+'</svg>';}
function ring(p){return '<svg class="fp-arc" viewBox="0 0 40 40" aria-hidden="true"><circle class="trk" cx="20" cy="20" r="18"/>'
 +'<circle class="val" cx="20" cy="20" r="18" pathLength="100" stroke-dasharray="'+p+' 100"/></svg>';}
function sysMarks(a){
 return '<span class="fp-sys" aria-hidden="true">'+SYS4.map(function(s){
  return '<span class="fp-s'+(a.sys.indexOf(s)>=0?' on':'')+'">'+svg(SYSGLYPH[s])+'</span>';}).join('')+'</span>';}
function meetTip(a){return RS_STRENGTH[a.strength]+' '+a.sys.map(function(s){return SYSNAME[s];}).join(', ')+' land here.';}
function emptyDoor(N){
 return '<div class="fp-empty">'+svg(SYSGLYPH.W,'fp-ic big')+'<span>'+(N?'Birth date, time and place add three systems.'
  :'Birth date, time and place let four systems read you.')+'</span></div>'
  +'<button class="btn rs-go" type="button">Open Energetics</button>';}
function renderList(el,d){
 var R=d.R, h='';
 if(!d.sp)h+=emptyDoor(d.N);
 if(R.shown.length){
  h+='<div class="fp-eye">'+svg(FP_MK.overlap)+'Overlap</div><div class="fp-meets">'
   +R.shown.map(function(a,i){
    return '<button type="button" class="fp-meet" data-fpm="'+i+'" data-tip-t="'+esc(a.t)+'" data-tip="'+esc(meetTip(a))+'">'
     +'<span class="fp-orb" style="--c:var(--gold)">'+ring(STR_P[a.strength])+svg(rsThemeIc(a),'fp-ic th')+'</span>'
     +'<span class="fp-mn">'+esc(a.t)+'</span>'+sysMarks(a)+'</button>';}).join('')+'</div>';}
 else if(d.sp)h+='<div class="fp-eye">'+svg(FP_MK.overlap)+'Overlap</div><p class="fp-none">None. Each system reads on its own.</p>';
 if(R.range.length){
  h+='<div class="fp-eye">'+svg(FP_MK.range)+'Range</div><div class="fp-range">'
   +R.range.map(function(x,i){
    return '<button type="button" class="fp-tile" data-fpr="'+i+'" data-tip-t="'+esc(SYSNAME[x.sys])+'" data-tip="'+esc(rsSays(x)||rsName(x))+'">'
     +svg(SYSGLYPH[x.sys],'fp-ic')+'<span>'+esc(rsName(x))+'</span></button>';}).join('')+'</div>';}
 el.innerHTML='<div class="fp-rs">'+h+'</div>';}
function renderOrbs(el,d){
 var R=d.R;
 el.innerHTML='<div class="fp-rs">'+(d.sp?'':emptyDoor(d.N))+'</div>';
 var host=el.firstChild;
 function group(nm,mk,items,make){
  var e=document.createElement('div'); e.className='fp-eye'; e.innerHTML=svg(mk)+nm; host.appendChild(e);
  var row=document.createElement('div'); row.className='fp-orbs'; host.appendChild(row);
  items.forEach(function(x,i){row.appendChild(make(x,i));});}
 if(R.shown.length)group('Overlap',FP_MK.overlap,R.shown,function(a,i){
  var b=fbOrb({nm:a.t,ic:rsThemeIc(a),tip:meetTip(a),label:true,val:true});
  b.setAttribute('data-fpm',i); b.classList.add('fp-o');
  b.querySelector('.fb-orb').style.setProperty('--c','var(--gold)');
  b.querySelector('.val').setAttribute('stroke-dasharray',STR_P[a.strength]+' 100');
  b.querySelector('.fb-v').textContent=String(a.sys.length);
  return b;});
 if(R.range.length)group('Range',FP_MK.range,R.range,function(x,i){
  var b=fbOrb({nm:rsName(x),ic:SYSGLYPH[x.sys],tip:rsSays(x)||rsName(x),label:true});
  b.setAttribute('data-fpr',i); b.classList.add('fp-o','fp-rng');
  return b;});}
/* the two section marks: where they meet, three rings overlapping at one
   point, and the range, one ring and its spread */
var FP_MK={overlap:'<circle cx="8.6" cy="12" r="5.4"/><circle cx="15.4" cy="12" r="5.4"/><circle cx="12" cy="12" r="1.2"/>',
 range:'<circle cx="12" cy="12" r="3"/><path d="M4 12h2.4M17.6 12H20M12 4v2.4M12 17.6V20M6.3 6.3l1.7 1.7M16 16l1.7 1.7M17.7 6.3L16 8M8 16l-1.7 1.7"/>'};
window.renderRootSum=function(){
 if(FP.s==='prose'){if(FP_SIG!=='prose'){FP_SIG='prose';RSUM_SIG=null;}return SHIP_RS();}
 var el=document.getElementById('rootsum'); if(!el)return;
 var d=rsData(), sig=FP.s+JSON.stringify([S.who,d.R.placements.length,d.R.shown.map(function(a){return a.t;})]);
 FP_RS=d;
 if(sig===FP_SIG&&el.firstChild)return; FP_SIG=sig; RSUM_SIG=null;
 if(FP.s==='orbs')renderOrbs(el,d); else renderList(el,d);
 var go=el.querySelector('.rs-go');
 if(go)go.onclick=function(){setTab(TAB.INTAKE);};};

/* one door each, into the Selection section, through the product's own shell */
function meetDrill(a){
 rdShell('<div class="pm-eye">Overlap</div><div class="ad-nm">'+esc(a.t)+'</div>'
  +'<div class="ad-sub">'+esc(RS_STRENGTH[a.strength])+'</div>'
  +'<p class="ad-p">'+esc(ROOT_SAYS[a.t]||'')+'</p>'
  +'<div class="pm-eye">Where it lands</div><div class="rs-chips">'+rsChips(a)+'</div>'
  +'<div class="pm-eye">How they meet</div><p class="ad-p">'+esc(RS_BRIDGE[a.voc]||'')+'</p>');}
function rangeDrill(x){
 rdShell('<div class="pm-eye">'+esc(SYSNAME[x.sys])+'</div><div class="ad-nm">'+esc(rsName(x))+'</div>'
  +'<p class="ad-p">'+esc(rsSays(x)||'')+'</p>'
  +'<p class="ad-p">This one is in the range: it reads you on its own, and no other system lands on the same thing.</p>');}

/* ============================================================
   THE LAYER READING. A press on a layer opens what that layer says about
   this person, in the Selection section, through rdShell like every other
   drill, and each row opens the drill the product already has for it.
   ============================================================ */
var NAMES={laws:{laws:'Laws',integrity:'Integrity',attunement:'Attunement',alignment:'Alignment',harmonic:'Harmonic laws'}};
function charName(){return FP.m==='twin'?'Masks':'Character';}
function masksName(){return 'Masks';}
function layName(k){
 if(k==='laws')return NAMES.laws[FP.l]||'Laws';
 if(k==='character')return charName();
 if(k==='masks')return masksName();
 return FB_BYK[k].nm;}
function applyNames(){
 ['laws','character','masks'].forEach(function(k){var nm=layName(k);
  FB_BYK[k].nm=nm;
  document.querySelectorAll('[data-fb='+k+']').forEach(function(b){
   b.setAttribute('aria-label',nm); if(b.hasAttribute('data-tip-t'))b.setAttribute('data-tip-t',nm);
   var t=b.querySelector('.fb-nm'); if(t)t.textContent=nm;});});
 FB_BYK.character.tip=FP.m==='sum'?'The innermost layer, and the sum of every mask. What the whole chain compounds into.'
  :'The innermost layer. What the whole chain compounds into.';
 FB_BYK.masks.tip='The six masks, each at its weight.';}

function row(key,label,val,cls){
 return '<button type="button" class="ad-r fp-lr'+(cls?' '+cls:'')+'" data-fpl="'+key+'"><span class="ad-k">'+esc(label)+'</span>'
  +(val!==undefined&&val!==''?'<span class="ad-m">'+esc(val)+'</span>':'')+'</button>';}
var LROWS={};
function listFor(k,r){
 var out=[], more=0;
 function take(arr,n){more=Math.max(0,arr.length-n);return arr.slice(0,n);}
 if(k==='addresses'||k==='shadow'){
  var top=take(r.loaded.slice().sort(function(a,b){return b.sq-a.sq;}),6);
  return {head:k==='shadow'?'Where it presses hardest':'Heaviest',html:top.map(function(n){return addrRow(n);}).join(''),more:more};}
 if(k==='seats'){
  var seats=APC.map(function(c){return {c:c,n:W.filter(function(n){return n.b===c.b&&n.sq>=4;}).length};})
   .sort(function(a,b){return b.n-a.n;});
  return {head:'Where the charge sits',html:seats.map(function(s,i){LROWS['seats:'+i]=function(){runSeatDrill(s.c);};
   return row('seats:'+i,s.c.b,s.n?s.n+' held':'nothing held');}).join('')};}
 if(k==='laws'){
  var L=take(SI.slice().sort(function(a,b){return (S.law[a.nm]||0)-(S.law[b.nm]||0);}),7);
  return {head:'Most shut first',html:L.map(function(l,i){LROWS['laws:'+i]=function(){runLawDrill(l);};
   return row('laws:'+i,l.nm,(S.law[l.nm]||0).toFixed(1));}).join(''),more:more};}
 if(k==='gates')return {head:'',html:gatesBlock(null)};
 if(k==='stories'){
  var E=((CURP&&CURP.story&&CURP.story.entries)||[]).slice(-5).reverse();
  return {head:'Most recent',html:E.length?E.map(function(x){return '<p class="ad-p fp-q"><em>'+esc(String(x.text||'').slice(0,140))+'</em></p>';}).join('')
   :'<p class="ad-p">No story written yet.</p>'};}
 var chain={saboteurs:r.sabs,complexes:r.cxs,hyper:r.hys,character:r.sups}[k];
 if(chain){var C=take(chain.slice().sort(function(a,b){return b.w-a.w;}),8);
  return {head:'Running',html:C.length?C.map(function(o,i){LROWS[k+':'+i]=function(){S.pin=o;runDrill(o);render();};
   return row(k+':'+i,o.nm,o.w.toFixed(1));}).join(''):'<p class="ad-p">Nothing running.</p>',more:more};}
 if(k==='archetypes'){
  var A=(r.aff||[]).map(function(v,i){return {i:i,v:v};}).sort(function(a,b){return b.v-a.v;}).slice(0,5);
  return {head:'Strongest',html:r.unread?'<p class="ad-p">Nothing read yet.</p>':A.map(function(x,i){LROWS['arch:'+i]=function(){runArchDrill(ARCH[x.i]);};
   return row('arch:'+i,ARCH[x.i].nm,Math.round(x.v*100)+'%');}).join('')};}
 if(k==='domains')return {head:'Yours',html:(S.doms||[]).map(function(di,i){var dm=DOMAINS[di];
   LROWS['dom:'+i]=function(){runDomDrill(dm);};return row('dom:'+i,dm.nm,dm.r);}).join('')};
 if(k==='masks'){
  var M=(r.maskRing||[]).slice().sort(function(a,b){return b.w-a.w;});
  return {head:'By weight',html:M.map(function(m,i){LROWS['mk:'+i]=function(){runMaskDrill(MASKS.filter(function(x){return x.nm===m.nm;})[0]||m);};
   return row('mk:'+i,m.nm,m.w.toFixed(1));}).join('')};}
 return {head:'',html:''};}
function layerDrill(k){
 var l=FB_BYK[k]; if(!l)return;
 LROWS={};
 var r=compute(), V=FB_VALS[k]||{}, on=layerOn(k), g=FB_GROUPS.filter(function(x){return x.k===l.g;})[0]||{};
 var said=String(V.m||'').replace(/^Ring and number: /,'').replace(/^Number: [^.]*\. Ring: /,'');
 said=said.charAt(0).toUpperCase()+said.slice(1);
 var L=listFor(k,r);
 var h='<div class="pm-eye">'+esc(g.nm||'Layer')+'</div>'
  +'<div class="fp-lh"><span class="fp-lg">'+svg(l.ic)+'</span><div class="ad-nm">'+esc(layName(k))+'</div></div>'
  +'<button type="button" class="fp-sw'+(on?' on':'')+'" data-fpsw="'+k+'" aria-pressed="'+on+'">'
  +'<span class="fp-kn"></span><span>'+(on?'Drawn on the Field':'Not drawn')+'</span></button>'
  +'<p class="ad-p">'+esc(l.tip)+'</p>'
  +(V.v&&!r.unread?'<div class="pm-eye">Yours</div><p class="ad-p"><b>'+esc(V.v)+'</b>. '+esc(said)+'</p>':'')
  +(r.unread?'<p class="ad-p">Nothing read yet. Write what happened and this fills in.</p>':'')
  +(L.html&&!r.unread?(L.head?'<div class="pm-eye">'+esc(L.head)+'</div>':'')+'<div class="ad-rows">'+L.html
   +(L.more?'<div class="pm-more">and '+L.more+' more</div>':'')+'</div>':'');
 rdShell(h);
 FP_OPEN=k;}
var FP_OPEN=null;
var SHIP_TOGGLE=window.fbToggle;
window.fbToggle=function(k){
 if(FP.p==='draw'){SHIP_TOGGLE(k);return;}
 if(FP.p==='both'){SHIP_TOGGLE(k);layerDrill(k);return;}
 /* read first: the press never hides; it draws if hidden and reads */
 if(!layerOn(k))SHIP_TOGGLE(k); else {fbSay(k);render();}
 layerDrill(k);};
document.addEventListener('click',function(e){
 var t=e.target&&e.target.closest?e.target:null; if(!t)return;
 var sw=t.closest('[data-fpsw]');
 if(sw){e.stopPropagation();var k=sw.getAttribute('data-fpsw');SHIP_TOGGLE(k);layerDrill(k);return;}
 var lr=t.closest('[data-fpl]');
 if(lr){var f=LROWS[lr.getAttribute('data-fpl')]; if(f){e.stopPropagation();f();} return;}
 var m=t.closest('[data-fpm]');
 if(m&&FP_RS){e.stopPropagation();meetDrill(FP_RS.R.shown[+m.getAttribute('data-fpm')]);return;}
 var rg=t.closest('[data-fpr]');
 if(rg&&FP_RS){e.stopPropagation();rangeDrill(FP_RS.R.range[+rg.getAttribute('data-fpr')]);return;}},true);

/* ============================================================
   THE DOCK. The questions, switched live. Folds to one control.
   ============================================================ */
var DOCK=null;
function dockHtml(){
 return '<div class="fpd-hd"><b>Open questions</b><span>Round GO. Every option runs on the real build.</span>'
  +'<button type="button" class="fpd-fold" aria-label="Fold the questions" data-fpfold="1">'
  +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></div>'
  +'<div class="fpd-bd">'+Q.map(function(q){
   var cur=q.opts.filter(function(o){return o[0]===FP[q.k];})[0]||q.opts[0];
   return '<div class="fpd-q"><div class="fpd-t">'+esc(q.t)+'</div><div class="fpd-os" role="radiogroup" aria-label="'+esc(q.t)+'">'
    +q.opts.map(function(o){return '<button type="button" role="radio" class="fpd-o'+(o[0]===FP[q.k]?' on':'')
     +'" aria-checked="'+(o[0]===FP[q.k])+'" data-fpk="'+q.k+'" data-fpv="'+o[0]+'">'+esc(o[1])+'</button>';}).join('')
    +'</div><p class="fpd-n">'+esc(cur[2])+'</p></div>';}).join('')+'</div>';}
function paintDock(){
 if(!DOCK)return;
 DOCK.innerHTML=dockHtml();
 DOCK.classList.toggle('folded',FP.dock==='0');}
function loadWho(){
 if(FP.who==='blank'){loadP(0);return;}
 var i=PEOPLE.findIndex(function(q){return q.nm===FP.who;}); if(i>=0)loadP(i);}
function apply(what){
 if(!what||what==='who'){loadWho();}
 /* shut means the built default, which is shut only where the column stands
    beside the stage, LCOL_BESIDE in ui/ui.js; a phone lands open */
 if(!what||what==='land'){var bes=true;try{bes=matchMedia(LCOL_BESIDE).matches;}catch(e){}
  colFoldPaint(FP.land==='shut'&&bes);FB_FIT=-1;}
 applyNames();
 FP_SIG=null; RSUM_SIG=null;
 if(FP_OPEN&&(what==='l'||what==='m'||what==='who'))layerDrill(FP_OPEN);
 if(what==='p'||what==='who')rdClose();
 render(); fbFit();
 paintDock(); writeHash();}
function mountDock(){
 DOCK=document.createElement('aside'); DOCK.className='fp-dock'; DOCK.setAttribute('aria-label','Open questions');
 document.body.appendChild(DOCK);
 DOCK.addEventListener('click',function(e){e.stopPropagation();
  var f=e.target.closest('[data-fpfold]');
  if(f){FP.dock=FP.dock==='0'?'1':'0';paintDock();writeHash();return;}
  if(DOCK.classList.contains('folded')){FP.dock='1';paintDock();writeHash();return;}
  var b=e.target.closest('[data-fpk]'); if(!b)return;
  var k=b.getAttribute('data-fpk'); FP[k]=b.getAttribute('data-fpv'); apply(k);});}

function go(){
 if(!document.body.classList.contains('booted'))return setTimeout(go,120);
 try{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}catch(e){}
 readHash();
 if(innerWidth<=720&&!/dock=/.test(location.hash))FP.dock='0';
 setTab(TAB.FIELD);
 OPENSEC.right.overlap=1; paintSections();
 mountDock(); apply();
 document.documentElement.setAttribute('data-fp-ready','1');}
window.FPROTO={state:FP,apply:apply,layerDrill:layerDrill};
go();
})();
