/* ============================================================
   AFFIRMATIONS, THE SHEET, 18 November. His words: "This is a small
   affirmation engine utility that I want added to the ritual builder." And
   the story the same day: Source AI "will spot my avatar's intentions and
   then generate high quality affirmations. That a person can add to the
   ritual."

   ONE FILE, ONE MOUNT. Every door calls affOpen(o) and nothing else, and
   draws itself with affDoorHtml, so each file that carries a door changed by
   one line: the ritual builder (ui/ritual.js), the Avatar's Become side
   (ui/avatarui.js), a Path pair's recipes (ritComplexHtml, ui/ritual.js) and
   the release panel after a commit (ui/storyui.js). The Ritual page is being
   rebuilt on another branch, and one call site is what that rebuild merges
   against. The press is caught here, on the document, so no door needs a
   handler in the file it sits in.

   WHAT IS ON THE SHEET, top to bottom, symbol first: the head with the
   Source AI mark; where the lines come from, a select of the person's own
   confirmed intentions, "Your record" first when two or more are seated at
   points, and "My own words" last, which opens the box his package was; the
   All that is switch, a ring; the seven lines, each a toggle that is pressed
   by default; Add and Copy. Twelve targets with the sheet's Close, fourteen
   with the box open.

   WHAT IT NEVER DOES. It composes nothing from a source the person did not
   confirm (affSources, engine/affirmgen.js). It composes nothing for a theme
   that trips the stop, and shows CRISIS_SAY.entryNow, the one crisis line
   that still prints, with Add and Copy disabled and inert. It shows no
   default set on an empty box: his package showed seven money lines there.
   It never writes the person's story anywhere: Add keeps the line and a
   short source key, never the words it came from.

   NOT BUILT HERE, said so nobody has to find it: the heard card (a guess
   offered behind one Yes, written through the evidence verdict writer) and
   banked release rows as a source. affSources takes both and the engine gate
   holds them; the UI has no reader for either outside the Story page's own
   session state yet. And face two, the When pop-up, lives on the Ritual
   rebuild's branch; until it lands, Add writes the kept set and the Ritual
   page's Today affirmations read it (ritAffirm, ui/ritcal.js).
   ============================================================ */
var AFF_KEPT_KEY='atuned-affirm-kept';
var AFF={o:null, src:null, typed:'', creator:false, res:null, keep:null, srcs:[]};
var AFF_SW_TIP='Adds "I am the creator of all that is" before each line and "across all space, time, and dimensions" after it.';
var AFF_HEAD_TIP='Lines you say out loud, one for each of your seven points, Root to Crown.';
var AFF_DOOR_TIP='Source AI writes one line for each of your seven points from this. You choose which go in your ritual.';
/* the kind of source, said in the select beside the person's own words */
var AFF_KIND={path:'Path', avatar:'Become', tag:'Tag', bank:'Banked', claim:'Said yes', typed:'Typed'};
/* a ring with three lines in it: a spoken line, drawn as a ring and never
   a fill, the same stroke the Ritual page's practice rings use */
function affIc(){
 return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">'
  +'<circle cx="12" cy="12" r="9"/><path d="M8 9.5h8M8 12.5h8M8 15.5h5"/></svg>';}

/* THE DOOR, one button, the same word in every place it appears */
function affDoorHtml(from,key,pathK){
 return '<button type="button" class="btn aff-door" data-affopen="'+esc(from||'')+'"'
  +(key?' data-affkey="'+esc(key)+'"':'')+(pathK?' data-affpath="'+esc(pathK)+'"':'')
  +' data-tip-k="Affirm" data-tip="'+esc(AFF_DOOR_TIP)+'">'+affIc()+'<span>Affirm</span></button>';}
if(typeof document!=='undefined')document.addEventListener('click',function(ev){
 var b=ev.target&&ev.target.closest&&ev.target.closest('[data-affopen]'); if(!b||b.disabled)return;
 /* the door may sit inside a row that has its own press, an Avatar pair or
    a Path recipe, and that press must not also fire */
 ev.preventDefault(); ev.stopPropagation();
 affOpen({from:b.getAttribute('data-affopen'), key:b.getAttribute('data-affkey')||null,
  pathK:b.getAttribute('data-affpath')||null});},true);

/* the person's own confirmed intentions, read with the readers the product
   already has and handed to the engine, which reads nothing itself */
function affGather(o){
 return affSources(CURP||null,{pathK:(o&&o.pathK)||null,
  seatOf:(typeof readSeat==='function')?readSeat:null});}

/* THE ONE MOUNT. Returns false when there is no sheet to open, so a door in
   a surface that draws without one does nothing rather than throw. */
function affOpen(o){
 if(typeof sheetOpen!=='function'||!document.getElementById('sheet-card'))return false;
 o=o||{};
 affCss();
 AFF.o=o; AFF.typed=''; AFF.res=null; AFF.keep=null; AFF.creator=false;
 AFF.srcs=affGather(o).filter(function(x){return x.state==='confirmed';});
 var pick=null;
 if(o.key&&AFF.srcs.some(function(x){return x.key===o.key;}))pick=o.key;
 else if(o.pathK&&AFF.srcs.some(function(x){return x.key==='pa:'+o.pathK;}))pick='pa:'+o.pathK;
 else if(affWeaves(AFF.srcs))pick='weave';
 else if(AFF.srcs.length)pick=AFF.srcs[0].key;
 else pick='typed';
 AFF.src=pick;
 if(pick!=='typed')affRun();
 sheetOpen(affHtml());
 affWire();
 var f=document.getElementById(pick==='typed'?'afft':'affsrc'); if(f)f.focus();
 return true;}

/* compose from what is chosen. Every path goes through the engine's own
   front door, so the stop runs ahead of everything, every time. */
function affRun(){
 var r;
 if(AFF.src==='weave'){
  var prim=AFF.srcs.filter(function(x){return x.kind==='avatar';})[0]||AFF.srcs[0];
  r=affWeave(AFF.srcs,prim?prim.key:null);}
 else if(AFF.src==='typed')r=affCompose(AFF.typed,'ty');
 else{var s=AFF.srcs.filter(function(x){return x.key===AFF.src;})[0];
  r=s?affCompose(s.text,s.key):affCompose('');}
 AFF.res=r; AFF.keep=r.ok?r.lines.map(function(){return true;}):null;
 return r;}

/* a line drawn in its two inks: under All that is his fixed words go muted
   and the core, which is what changes from line to line, stays bright */
function affLineHtml(l){
 if(!AFF.creator)return esc(l.plain);
 return '<span class="aff-fix">'+esc(AFF_PRE)+'</span>'+esc(l.core)+'<span class="aff-fix">'+esc(AFF_SUF)+'</span>';}
function affPtTip(b){
 var a=(typeof AV_OF!=='undefined'&&AV_OF[b])?AV_OF[b]:null;
 return 'The '+b+' point'+(a?', where '+a.about+' sit':'')+'. This line is said there.';}
function affRowsHtml(){
 var r=AFF.res;
 if(!r||!r.ok)return '';
 return r.lines.map(function(l,i){
  var on=!!(AFF.keep&&AFF.keep[i]), col=seatCol(l.b);
  return '<li class="aff-li" style="--c:'+col+'"><button type="button" class="aff-row'+(on?' aff-on':'')+'" data-affrow="'+i+'" aria-pressed="'+on+'"'
   +' aria-label="'+esc(l.b+' point: '+(AFF.creator?l.wrapped:l.plain)+(on?' Kept.':' Left out.'))+'">'
   +'<span class="aff-pt" data-tip-k="'+esc(l.b)+'" data-tip="'+esc(affPtTip(l.b))+'">'
   +'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">'+(SEATGLYPH[l.b]||SEATGLYPH._)+'</svg></span>'
   +'<span class="aff-tx src-ai">'+affLineHtml(l)+'</span></button></li>';}).join('');}
function affStatusHtml(){
 var r=AFF.res;
 if(!r||r.ok)return '';
 return esc(r.say)+(r.offer?' <button type="button" class="btn aff-use" data-affuse="'+esc(r.offer)+'">Use</button>':'');}
function affSelHtml(){
 var opt=function(v,t){return '<option value="'+esc(v)+'"'+(AFF.src===v?' selected':'')+'>'+esc(t)+'</option>';};
 var cut=function(t){t=String(t); return t.length>56?t.slice(0,55).replace(/\s+\S*$/,'')+'…':t;};
 return '<select id="affsrc" class="aff-sel" aria-label="Where the lines come from">'
  +(affWeaves(AFF.srcs)?opt('weave','Your record'):'')
  +AFF.srcs.map(function(x){return opt(x.key,AFF_KIND[x.kind]+': '+cut(x.text));}).join('')
  +opt('typed','My own words')+'</select>';}
function affHtml(){
 var ok=!!(AFF.res&&AFF.res.ok), stop=!!(AFF.res&&AFF.res.stop);
 return '<div class="aff" aria-labelledby="affh">'
  +'<div class="aff-hd"><span class="aff-ic" data-tip-k="Affirmations" data-tip="'+esc(AFF_HEAD_TIP)+'">'+affIc()+'</span><span class="sh-h plain" id="affh">Affirmations</span>'
  +(typeof srcMark==='function'?srcMark():'')+'</div>'
  +'<div class="aff-src">'+affSelHtml()+'</div>'
  +(AFF.src==='typed'?'<div class="aff-typed"><label class="aff-lab" for="afft">Who you are becoming</label>'
   +'<div class="aff-in"><input type="text" id="afft" maxlength="80" autocomplete="off" spellcheck="true"'
   +' placeholder="Who you are becoming, or one word for it" value="'+esc(AFF.typed)+'">'
   +'<button type="button" class="btn" id="affgo">Affirm</button></div></div>':'')
  +'<div class="aff-swr"><button type="button" class="aff-sw'+(AFF.creator?' aff-on':'')+'" id="affsw" role="switch" aria-checked="'+AFF.creator+'"'
  +' aria-label="All that is" data-tip-k="All that is" data-tip="'+esc(AFF_SW_TIP)+'">'
  +'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">'
  +'<circle cx="12" cy="12" r="9"/>'+(AFF.creator?'<circle cx="12" cy="12" r="4.5"/>':'')+'</svg></button>'
  +'<span class="aff-swl" aria-hidden="true">All that is</span></div>'
  +'<p class="aff-st'+(stop?' aff-stop':'')+'" id="affst" role="status">'+affStatusHtml()+'</p>'
  +'<ul class="aff-rows" id="affrows" aria-live="polite">'+affRowsHtml()+'</ul>'
  +'<div class="sh-act aff-acts">'
  +'<button type="button" class="btn pri" id="affadd"'+(ok?'':' disabled')+'>Add</button>'
  +'<button type="button" class="btn" id="affcopy"'+(ok?'':' disabled')+'>Copy</button>'
  +'<button type="button" class="btn" id="affx">Close</button></div></div>';}
/* the rows, the status and the two actions repaint in place, so the switch
   and a row's press never move focus or rebuild the select under a finger */
function affPaint(){
 var rows=document.getElementById('affrows'), st=document.getElementById('affst');
 if(rows)rows.innerHTML=affRowsHtml();
 if(st){st.innerHTML=affStatusHtml(); st.classList.toggle('aff-stop',!!(AFF.res&&AFF.res.stop));}
 var ok=!!(AFF.res&&AFF.res.ok&&AFF.keep&&AFF.keep.some(Boolean));
 ['affadd','affcopy'].forEach(function(id){var b=document.getElementById(id); if(b)b.disabled=!ok;});}
function affRedraw(focusId){
 var c=document.getElementById('sheet-card'); if(!c)return;
 c.innerHTML=affHtml(); affWire();
 var f=focusId&&document.getElementById(focusId); if(f)f.focus();}
/* a press counts only while the set is composed and something is kept. The
   disabled attribute is the look; this is the rule, so a forced click on a
   stopped or refused set writes nothing and copies nothing. */
function affLive(){return !!(AFF.res&&AFF.res.ok&&AFF.keep&&AFF.keep.some(Boolean));}
function affWire(){
 var c=document.getElementById('sheet-card'); if(!c)return;
 var sel=document.getElementById('affsrc');
 if(sel)sel.onchange=function(){
  AFF.src=sel.value; AFF.res=null; AFF.keep=null;
  if(AFF.src!=='typed')affRun();
  affRedraw(AFF.src==='typed'?'afft':'affsrc');};
 var inp=document.getElementById('afft'), go=document.getElementById('affgo');
 var compose=function(){if(!inp)return; AFF.typed=inp.value; affRun(); affPaint();};
 if(inp){
  inp.oninput=function(){AFF.typed=inp.value;};
  /* a word being composed through an input method is not a press of Enter */
  inp.onkeydown=function(e){if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){e.preventDefault(); compose();}};}
 if(go)go.onclick=compose;
 var sw=document.getElementById('affsw');
 /* a button already answers Enter and Space with a click, which is his
    package's own keyboard rule. The lines re-render from the set already
    composed: nothing is composed again. */
 if(sw)sw.onclick=function(){
  AFF.creator=!AFF.creator;
  sw.setAttribute('aria-checked',String(AFF.creator)); sw.classList.toggle('aff-on',AFF.creator);
  sw.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">'
   +'<circle cx="12" cy="12" r="9"/>'+(AFF.creator?'<circle cx="12" cy="12" r="4.5"/>':'')+'</svg>';
  affPaint();};
 c.onclick=function(ev){
  var r=ev.target.closest&&ev.target.closest('[data-affrow]');
  if(r&&c.contains(r)&&AFF.keep){var i=+r.getAttribute('data-affrow'); AFF.keep[i]=!AFF.keep[i]; affPaint();
   var n=document.querySelector('[data-affrow="'+i+'"]'); if(n)n.focus(); return;}
  var u=ev.target.closest&&ev.target.closest('[data-affuse]');
  if(u&&c.contains(u)){
   /* the offer is pressed, so it is the person's word now, and it is typed
      into the box where they can see it rather than swapped in silently */
   AFF.src='typed'; AFF.typed=u.getAttribute('data-affuse'); affRun(); affRedraw('affsrc'); return;}};
 var add=document.getElementById('affadd'), cp=document.getElementById('affcopy'), x=document.getElementById('affx');
 if(add)add.onclick=function(){if(affLive())affAdd();};
 if(cp)cp.onclick=function(){if(affLive())affCopy();};
 if(x)x.onclick=function(){sheetShut();};}

/* ---------------- copy ----------------
   His format, plain text, through the clipboard where the page may reach it
   and through the older copy command where it may not (a file opened off
   disk). When neither takes it, the rows are selected so the person can copy
   them by hand, and the button's own label never changes: it said "Copy
   Failed" for ever in his package. */
function affCopy(){
 var t=affPlain(AFF.res.lines,AFF.creator,AFF.keep);
 var said=function(ok){
  if(ok){status('Copied.','ok'); return;}
  var rows=document.getElementById('affrows');
  if(rows&&window.getSelection){var rg=document.createRange(); rg.selectNodeContents(rows);
   var s=window.getSelection(); s.removeAllRanges(); s.addRange(rg);}
  status('Not copied. Select the lines and copy them by hand.','fail');};
 var old=function(){
  try{var ta=document.createElement('textarea'); ta.value=t; ta.setAttribute('readonly','');
   ta.style.position='fixed'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select();
   var ok=document.execCommand('copy'); document.body.removeChild(ta); return !!ok;}
  catch(e){return false;}};
 try{
  if(navigator.clipboard&&navigator.clipboard.writeText){
   navigator.clipboard.writeText(t).then(function(){said(true);},function(){said(old());}); return;}}
 catch(e){}
 said(old());}

/* ---------------- the kept set ----------------
   Beside the record, under its own key, the posture RIT_MORE_KEY and the
   Ritual page's plans already take: the boundary rebuilds a record from the
   fields it names, and a new field is schema v2, his call. It survives a
   reload and does not travel with an export. One set per profile, and a new
   Add replaces it. */
function affKeptAll(){
 if(typeof STORE==='undefined')return {};
 try{var o=JSON.parse(STORE.get(AFF_KEPT_KEY)||'{}');
  return (o&&typeof o==='object'&&!Array.isArray(o))?o:{};}catch(e){return {};}}
/* every read goes through affKeptOk, the engine's read boundary for a row */
function affKept(){
 if(!CURP||!CURP.id)return null;
 var e=affKeptAll()[CURP.id];
 if(!e||typeof e!=='object'||!Array.isArray(e.rows))return null;
 var rows=e.rows.filter(affKeptOk).slice(0,7);
 return rows.length?{creator:e.creator===true, rows:rows}:null;}
/* what the Ritual page's Today affirmations say, read by ritAffirm. The id
   keys on the core, so a tick said today survives the switch. */
function affKeptLines(){
 var k=affKept(); if(!k)return null;
 return k.rows.map(function(r){
  return {id:'kp:'+ritHash(r.core), line:k.creator?AFF_PRE+r.core+AFF_SUF:r.core+(r.tail||'')+'.', b:r.b, own:false, ai:true};});}
/* ONE WRITER for the key, the ritMoreWrite posture: a worked example is
   refused by name, and no control says Added before the write came back */
function affAdd(){
 if(typeof ritOwn==='function'&&!ritOwn()){
  status(ritWhose()+' is a worked example, so nothing was saved to it.','fail'); return false;}
 var rows=AFF.res.lines.filter(function(l,i){return AFF.keep[i];})
  .map(function(l){return {b:l.b, core:l.core, tail:l.tail||'', src:l.src||null, composed:true};})
  .filter(affKeptOk);
 if(!rows.length)return false;
 var ok=false;
 if(typeof STORE_BOUND!=='undefined'&&STORE_BOUND&&CURP&&CURP.id){
  try{var all=affKeptAll(); all[CURP.id]={at:new Date().toISOString(), creator:AFF.creator, rows:rows};
   STORE.set(AFF_KEPT_KEY,JSON.stringify(all)); ok=true;}
  catch(err){ok=false;}}
 if(!ok){status('Not saved. Your browser refused the write. Nothing changed.','fail'); return false;}
 sheetShut();
 status(rows.length===1?'Added. One line is in your ritual.':'Added. '+rows.length+' lines are in your ritual.','ok');
 if(typeof setTab==='function'&&typeof TAB!=='undefined'&&S.tab!==TAB.RITUAL)setTab(TAB.RITUAL);
 else if(typeof ritRender==='function')ritRender();
 return true;}

function affCss(){
 if(document.getElementById('affirm-css'))return;
 var st=document.createElement('style'); st.id='affirm-css';
 st.textContent=[
  '.aff{display:flex;flex-direction:column;gap:14px;min-width:0}',
  '.aff-hd{display:flex;align-items:center;gap:10px}',
  '.aff-hd .sh-h{margin:0}',
  '.aff-ic{display:inline-flex;color:var(--accent)}',
  '.aff-door{display:inline-flex;align-items:center;gap:8px;min-height:44px}',
  '.aff-door svg{flex:none}',
  '.aff-sel{width:100%;min-height:44px;font-size:16px;padding:0 12px;border-radius:10px;border:1px solid var(--edge);background:var(--panel-2);color:var(--ink)}',
  '.aff-typed{display:flex;flex-direction:column;gap:6px}',
  '.aff-lab{font-size:13px;color:var(--mid)}',
  '.aff-in{display:flex;gap:10px;min-width:0}',
  '.aff-in input{flex:1 1 auto;min-width:0;min-height:44px;font-size:16px;padding:0 12px;border-radius:10px;border:1px solid var(--edge);background:var(--panel-2);color:var(--ink);overflow-wrap:anywhere}',
  '.aff-in .btn{min-height:44px;flex:none}',
  '.aff-sel:focus-visible,.aff-in input:focus-visible,.aff-sw:focus-visible,.aff-row:focus-visible{outline:2px solid var(--accent);outline-offset:2px}',
  '.aff-swr{display:flex;align-items:center;gap:10px}',
  '.aff-sw{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--edge);background:transparent;color:var(--dim);cursor:pointer;padding:0}',
  '.aff-sw.aff-on{color:var(--accent);border-color:var(--accent)}',
  '.aff-swl{font-size:14.5px;color:var(--ink)}',
  '.aff-st{margin:0;font-size:14.5px;line-height:1.45;color:var(--ink);min-height:0}',
  '.aff-st:empty{display:none}',
  '.aff-use{min-height:44px;margin-left:8px}',
  '.aff-rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
  '.aff-rows:empty{display:none}',
  '.aff-row{width:100%;display:flex;align-items:flex-start;gap:10px;min-height:44px;padding:10px 12px;text-align:left;cursor:pointer;',
  ' border-radius:12px;border:1px solid color-mix(in srgb,var(--c) 26%,var(--edge));background:transparent;color:var(--ink);font:inherit;opacity:.55}',
  '.aff-row.aff-on{opacity:1;background:color-mix(in srgb,var(--c) 6%,var(--panel-2));box-shadow:inset 3px 0 0 var(--c)}',
  '.aff-pt{flex:none;display:inline-flex;color:var(--c);padding-top:1px}',
  '.aff-tx{flex:1 1 auto;min-width:0;font-size:15.5px;line-height:1.45;overflow-wrap:anywhere}',
  '.aff-fix{color:var(--dim)}',
  '.aff-acts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}',
  '.aff-acts .btn{min-height:44px}',
  '@media (prefers-reduced-motion:reduce){.aff-row,.aff-sw{transition:none}}'].join('\n');
 document.head.appendChild(st);}
