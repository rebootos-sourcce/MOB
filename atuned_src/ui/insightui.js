/* ============================================================
   THE INSIGHT RAIL, THE SCREEN HALF. 18 November, the owner's words on this
   rail: "The insight panel at the very top should say insight. Whatever I
   select, it should give me source AI's reading of the cascade of that
   information, how it flows through me, and what the appropriate actions
   are. And then underneath that, it lists the stack from superego down, which
   I can run protocols against... When I click on the icons for saboteur,
   complex, hypercomplex, supercomplex, there's too much text in there. This
   should just be the bars... The insight panel will always show 3 paragraphs
   with dots for more information that you can select and click through that
   panel. I don't think the nested complex or super complex, hyper complex,
   etc. on that right rail is the way to go. Let's unnest them."

   Two things live here. railInsight writes the reading: what is selected,
   three paragraphs, the dots, and one Release. railStack writes the stack:
   six levels from Superego down, flat, each a header and its bars. The words
   come from engine/insight.js (insightRead), which returns segments the
   screen and the voice both render from, so the two cannot drift.

   ONE SELECTION DRIVES IT. A pattern is S.pin, as it always was. Every other
   door that opens a card in the Selection section (an address, a child
   emotion, a domain, a law, a seat, a mask, an archetype, the core and the
   rest) says what it opened with insDoor just before it calls rdShell, and
   rdShell takes it. A card that never said anything leaves the selection
   empty, so the reading can never name a thing the Selection section is not
   showing, and never says nothing is selected while a card stands open.

   WHAT THIS REPLACES, each one named once, on his 18 November words. The
   five tabs and their long text (4 November's nested cascade, 14 November's
   "icons, not full words, on one horizontal row", 16 November's square
   buttons, 14 November's press-an-icon-to-make-a-selection). The tab's
   Built from, Feeds and Reading well (insightSay). The Blueprint domain card
   at the top of the rail. This file keeps one thing from the 14 November
   ruling: a level header says its symbol first, then its word, then its
   count.
   ============================================================ */
var INS_SEL=null, INS_PENDING=null, INS_PAGE=0, INS_KEY='', INS_OUT=null;
/* a level that has been opened past its six heaviest bars, in memory only,
   so a stored profile can never carry a stale key for it */
var STK_MORE={};
var STK_CAP=6;
var STK_AMP=['Justification','Entitlement','Perfectionism','Obsession'];
/* the Superego's own mark: a ring with an arc built round it, the defense
   that stands round a pattern once it is already there. Ring, not fill. */
var STK_EGOGLYPH=chainRing(12,12,4)+'M12 3.4a8.6 8.6 0 018.6 8.6';
var INS_RUNGLYPH='<circle cx="12" cy="12" r="8.2"/><path d="M10.2 8.6l5 3.4-5 3.4z"/>';
var INS_ADDRGLYPH=chainRing(12,12,6.5)+'M12 3v3M12 18v3M3 12h3M18 12h3';
var INS_PLAINGLYPH=chainRing(12,12,6.5);
/* the levels, top down, and where each one's words come from. A tip is read
   once the glossary has loaded, never at declaration time. */
var STK_LEVELS=[['ego','Superego'],['sup','Super complexes'],['hy','Hyper complexes'],
 ['cx','Complexes'],['sab','Saboteurs'],['fet','Child emotions']];
function stkTipOf(k){
 var t={
  ego:unpackOf('Superego')||'The layer that builds a defense around a pattern once it is already there.',
  sup:unpackOf('super complex'), hy:unpackOf('hyper complex'), cx:unpackOf('complex'), sab:unpackOf('saboteur'),
  fet:unpackOf('child emotions')};
 return t[k]||'';}
function stkGlyphOf(k){return k==='ego'?STK_EGOGLYPH:CHAINGLYPH[k];}

/* ---------- the selection ---------- */
/* a door says what it is about to open. rdShell takes it, once. */
function insDoor(kind,nm,i){
 INS_PENDING={kind:kind};
 if(nm!==undefined&&nm!==null)INS_PENDING.nm=nm;
 if(i!==undefined&&i!==null)INS_PENDING.i=i;}
function insTake(){INS_SEL=INS_PENDING; INS_PENDING=null;}
function insClear(){INS_SEL=null; INS_PENDING=null;}
function insSelNow(){
 if(INS_SEL)return INS_SEL;
 if(typeof S!=='undefined'&&S.pin&&S.pin.kind&&INS_LIST[S.pin.kind])return {kind:S.pin.kind,nm:S.pin.nm};
 return null;}
/* what the engine is told that only the host knows */
function insCtx(){
 var rel={};
 try{((CURP&&CURP.meter&&CURP.meter.unique)||[]).forEach(function(k){rel[String(k).split(':')[0]]=true;});}catch(e){}
 var from='default';
 try{from=(CURP&&CURP.soul&&CURP.soul.from)||'default';}catch(e){}
 return {safe:(typeof stSafe==='function')&&!!stSafe(), released:rel,
  rank:(typeof avRank==='function')?avRank:null, soulFrom:from};}
function insGraph(){
 try{return (typeof tsCurrentGraph==='function')?tsCurrentGraph():null;}catch(e){return null;}}
/* ONE ANSWER, FOR THE PILL, THE RUN GLYPH ON A BAR AND THE THIRD PARAGRAPH.
   insightRelease says whether there is anything to open and where it starts.
   The host adds the one thing only it can see: the safety check, which hides
   every offer and never the safety door itself. */
function insightCanRelease(sel,r,ctx){
 ctx=ctx||insCtx();
 var x=insightRelease(sel,r,ctx);
 if(x.ok&&ctx.safe)return {ok:false,ids:[],first:null,why:'safe'};
 return x;}
function insWhySay(why){
 return why==='over'?'This is the opposite pushed past where it helps. A release has nothing to work here.'
  :why==='quiet'?'Nothing here holds charge yet, so there is nothing to release.'
  :why==='safe'?'':'A release cannot run here.';}
/* the one door to a run, shared by the pill and every bar's run glyph. It
   opens the release card already loaded and never starts a run: only the
   card's own Release press does, and only that press spends the allowance. */
function insRunRelease(sel){
 var r=computeSeen(), x=insightCanRelease(sel,r);
 if(!x.ok){var say=insWhySay(x.why); if(say)status(say,'warn'); return false;}
 if(typeof relPick!=='function')return false;
 relPick(x.ids); return true;}

/* ---------- what a selection looks like ---------- */
function insGlyphFor(sel){
 if(INS_LIST[sel.kind])return CHAINGLYPH[sel.kind];
 if(sel.kind==='fet')return CHAINGLYPH.fet;
 if(sel.kind==='addr')return INS_ADDRGLYPH;
 return INS_PLAINGLYPH;}
function insColFor(sel,r){
 try{
  if(INS_LIST[sel.kind]){var o=insFind(r,sel.kind,sel.nm); return seatCol((leaves(o)[0]||{}).b||'Heart');}
  if(sel.kind==='fet'){var c=CHILD.filter(function(x){return x.nm===sel.nm;})[0]; return c?seatCol(c.seat):'var(--accent)';}
  if(sel.kind==='addr'){var n=BY[sel.i]; return n?seatCol(n.b):'var(--accent)';}
 }catch(e){}
 return 'var(--accent)';}
/* WHAT A BOOK LINE SAYS ON HOVER: where it came from, in words */
function insFrom(sg){
 var root=String((sg.src&&sg.src[0])||'').split('.')[0];
 return 'From '+(INS_SRC_WORDS[root]||'the record')+'.';}
function insSegHtml(sg){
 if(sg.q){
  var q='“'+sg.q+'”', at=sg.text.indexOf(q);
  if(at>=0)return esc(sg.text.slice(0,at))
   +'<span class="ins-q" data-tip-k="From the record" data-tip="'+esc(insFrom(sg))+'">'+esc(q)+'</span>'
   +esc(sg.text.slice(at+q.length));}
 return esc(sg.text);}
function insParaHtml(p){
 return '<p class="ins-p src-ai"><b>'+esc(p.h)+'</b> '
  +p.segs.map(insSegHtml).join(' ')+'</p>';}
/* THE FIVE-DOT RULE IN ONE PLACE: the rail never offers a page that has no
   data, so a dot always leads somewhere */
function insPagesHtml(out){
 return '<div class="ins-pgs">'+out.pages.map(function(pg,i){
  return '<div class="ins-pg" data-pg="'+i+'"'+(i===INS_PAGE?' data-on="1"':' aria-hidden="true"')+'>'
   +pg.paras.map(insParaHtml).join('')+'</div>';}).join('')+'</div>';}
function insDotsHtml(out){
 if(out.pages.length<2)return '';
 return '<div class="ins-dots" role="group" aria-label="Pages of this reading">'
  +out.pages.map(function(pg,i){
   return '<button type="button" class="ins-dot" data-pg="'+i+'"'+(i===INS_PAGE?' aria-current="true"':'')
    +' aria-label="'+esc(pg.aria)+'" data-tip-k="'+esc('Page '+(i+1))+'" data-tip="'+esc(pg.tip+'.')+'"><i></i></button>';}).join('')+'</div>';}
function insNoneHtml(){
 return '<div class="ins-none"><b>Nothing selected.</b>'
  +'<span>Pick an address, a pattern or a row below to read it here.</span></div>';}
/* WHERE THE INSIGHT AUDIO BUTTON ATTACHES. The unmerged branch (50c53a04)
   adds a button that speaks one paragraph and opens its release. This is the
   one slot it goes in, called with what is on screen, and it draws nothing
   until that branch lands, so the rail never shows a button that cannot run.
   Whatever it speaks is the segment list in INS_OUT, speak:true segments only,
   one request a paragraph. */
function insightAudioSlot(out,r){
 /* Deliberately empty. The branch's stkSayBtn(o,r) takes a pattern and reads
    the old well, so calling it here with a reading would speak the wrong thing
    the day both land. The integrator replaces this one line with a button built
    from out.pages[INS_PAGE].paras: speak:true segments only, in the order they
    stand, one request a paragraph (the voice server refuses more than 600
    characters at once), the safety line first and never behind the button, and
    the word release only opening the card (insRunRelease), never starting a
    run. stkSayHold keys on INS_KEY, the selection, since STACK_TAB is gone. */
 return '';}

function railInsight(r){
 var host=document.getElementById('insight'); if(!host)return;
 var slot=document.getElementById('insaudio');
 r=r||computeSeen();
 INS_OUT=null;
 /* a record nobody has read says nothing here: the doors are the one thing
    that speaks (#start), and a zero nobody entered is not a reading */
 if(r.unread){INS_KEY=''; host.innerHTML=''; if(slot)slot.innerHTML=''; return;}
 var sel=insSelNow();
 /* a selection that was put down and picked up again is a new selection, so it
    starts on its first page: the key is forgotten whenever nothing is read */
 if(!sel){INS_KEY=''; host.innerHTML=insNoneHtml(); if(slot)slot.innerHTML=''; return;}
 var ctx=insCtx();
 var out=insightRead(sel,r,insGraph(),ctx);
 if(!out.ok){INS_KEY=''; host.innerHTML=insNoneHtml(); if(slot)slot.innerHTML=''; return;}
 if(out.id.key!==INS_KEY){INS_KEY=out.id.key; INS_PAGE=0;}
 if(INS_PAGE>=out.pages.length)INS_PAGE=0;
 INS_OUT=out;
 var rel=insightCanRelease(sel,r,ctx);
 var fig=out.id.fig&&out.id.fig!==PCT_DASH?'<span class="ins-fg">'+esc(out.id.fig)+'</span>':'';
 host.innerHTML=
  '<div class="ins-id" style="--c:'+insColFor(sel,r)+'">'
   +'<span class="ins-ring" aria-hidden="true">'+svgI('<path d="'+insGlyphFor(sel)+'"/>')+'</span>'
   +'<span class="ins-idt"><span class="ins-nm">'+esc(out.id.title)+'</span>'
   +'<span class="ins-kd">'+esc(out.id.kindWord)+'</span></span>'+fig+'</div>'
  +'<div class="ins-rd" id="insrd" tabindex="0" role="group" aria-roledescription="carousel"'
   +' aria-label="Source AI\'s reading of '+esc(out.id.title)+'">'
   +'<div class="ins-mk">'+srcMark()+'<span>Source AI\'s reading</span></div>'
   +insPagesHtml(out)+'</div>'
  +insDotsHtml(out)
  +(rel.ok?'<div class="ins-rel"><button type="button" class="btn" id="bRel"'
    +' data-tip-k="Release" data-tip="Opens the release at the heaviest place this holds. Nothing runs until you press Release on the card.">'
    +svgI(INS_RUNGLYPH)+'Release</button></div>':'');
 if(slot)slot.innerHTML=insightAudioSlot(out,r);}

/* the page, changed in place: nothing is rebuilt, so nothing jumps, and the
   selection and the stack are never touched by paging */
function insPage(n){
 if(!INS_OUT)return;
 var last=INS_OUT.pages.length-1;
 n=Math.max(0,Math.min(last,n)); if(n===INS_PAGE)return;
 INS_PAGE=n;
 document.querySelectorAll('#insight .ins-pg').forEach(function(p){
  var on=+p.getAttribute('data-pg')===n;
  if(on)p.setAttribute('data-on','1'); else p.removeAttribute('data-on');
  p.setAttribute('aria-hidden',on?'false':'true');});
 document.querySelectorAll('#insight .ins-dot').forEach(function(d){
  if(+d.getAttribute('data-pg')===n)d.setAttribute('aria-current','true'); else d.removeAttribute('aria-current');});}

/* ============================================================
   THE STACK, UNNESTED
   ============================================================ */
/* the lineage of the selection: itself, everything above it, everything below
   it and the child emotions under it. null when nothing in the stack is
   selected, so nothing is dimmed and nothing wears the selected look. */
function stkLineage(sel,r){
 if(!sel)return null;
 var L={};
 if(INS_LIST[sel.kind]){
  var o=insFind(r,sel.kind,sel.nm); if(!o)return null;
  L[o.kind+':'+o.nm]=1;
  var up=o; while((up=insUp(up,r)))L[up.kind+':'+up.nm]=1;
  (function down(x){(x.parts||[]).forEach(function(c){L[c.kind+':'+c.nm]=1; down(c);});})(o);
  insFets(o).forEach(function(c){L['fet:'+c.nm]=1;});
  return L;}
 if(sel.kind==='fet'){
  L['fet:'+sel.nm]=1;
  (r.sabs||[]).forEach(function(s){if(leaves(s).some(function(n){return n.cf===sel.nm;}))L['sab:'+s.nm]=1;});
  return L;}
 if(sel.kind==='addr'){
  var n=BY[sel.i]; if(!n)return null;
  if(n.cf)L['fet:'+n.cf]=1;
  L['amp:'+n.i]=1;
  (r.sabs||[]).forEach(function(s){if(leaves(s).some(function(m){return m.i===n.i;}))L['sab:'+s.nm]=1;});
  return L;}
 return null;}
function stkSelKey(sel){
 if(!sel)return '';
 if(INS_LIST[sel.kind]||sel.kind==='fet')return sel.kind+':'+sel.nm;
 if(sel.kind==='addr')return 'amp:'+sel.i;
 return '';}
/* THE BAR, A PATTERN'S AMOUNT. stkAmount is the rail's own bar drawn with the
   left rail's classes at the same 16px track, written inside this row's button
   because rbRow brings a button of its own. The run glyph is a second button
   beside it, never inside it. */
function stkAmount(o,nm,f){
 var lv=leaves(o), b=(lv[0]||{}).b||'Heart', p=Math.max(0,Math.min(100,pct('chain',o.w)||0));
 return '<span class="rb-row"><span class="rb-n"><span class="stk-nm">'+esc(nm)+'</span>'
  +(o.unnamed?'<em>inferred</em>':'')+'</span><span class="rb-v">'+esc(f)+'</span></span>'
  +'<span class="rb-t" aria-hidden="true" style="--c:'+seatCol(b)+'"><s style="left:25%"></s><s style="left:50%"></s><s style="left:75%"></s>'
  +'<i class="rb-f" style="width:'+p.toFixed(2)+'%"></i></span>';}
/* a child emotion's bar is the polar pair the Balance bar is drawn with, fetBar
   in ui/component.js: the held pole at one end, the installed opposite at the
   other, a line at the centre. The button around it is this rail's own. */
function stkFetBar(ci,depth){
 var c=CHILD[ci], v=S.charge[c.nm]||0, p=S.replace[c.nm]||0, read=v>0||p>0;
 var fv=fmtPct('charge',v), fp=fmtPct('installed',p);
 var sayN=function(k,x){var q=pct(k,x); return q>0?q+' per cent':'zero';};
 var say=read?c.nm+' held '+sayN('charge',v)+', '+c.opp+' installed '+sayN('installed',p)+'.'
  :'Not read yet.';
 return '<button type="button" class="stk-r stk-b" data-fet="'+ci+'"'
  +' aria-label="'+esc(c.nm+' and '+c.opp+'. '+say+' Opens the reading.')+'"'
  +' title="'+esc(read?c.nm+' held '+fv+', '+c.opp+' installed '+fp:c.nm+', not read yet')+'">'
  +fetBar(ci,'stkf'+depth+'-'+ci)+'</button>';}
/* the run glyph: a ring at the bar's right end. Not drawn (the slot is kept so
   every bar ends at the same place) when a release has nothing to open here. */
function stkRunHtml(attrs,ok,say){
 if(!ok)return '<span class="stk-run off" aria-hidden="true"></span>';
 return '<button type="button" class="stk-run" '+attrs+' aria-label="'+esc(say)+'"'
  +' data-tip-k="Release" data-tip="Release: opens the release for this one.">'+svgI(INS_RUNGLYPH)+'</button>';}
function stkRowClass(key,L,selKey){
 return 'stk-row'+(key===selKey?' sel':'')+(L&&!L[key]?' dim':'');}
function stkPatternRow(o,r,L,selKey,ctx){
 var si=(r[INS_LIST[o.kind]]||[]).indexOf(o);
 var key=o.kind+':'+o.nm, nm=o.nm+(o.over?', overshot':''), f=fmtPct('chain',o.w);
 var can=insightCanRelease({kind:o.kind,nm:o.nm},r,ctx);
 var tip=o.over?'The opposite pushed past where it helps. A release has nothing to work here.':'';
 return '<div class="'+stkRowClass(key,L,selKey)+'">'
  +'<button type="button" class="stk-r stk-am" data-sk="'+o.kind+'" data-si="'+si+'" title="'+esc(nm)+'"'
  +(tip?' data-tip-k="'+esc(o.nm)+'" data-tip="'+esc(tip)+'"':'')+'>'+stkAmount(o,nm,f)+'</button>'
  +stkRunHtml('data-run="'+o.kind+'" data-si="'+si+'"',can.ok,'Release '+o.nm)+'</div>';}
function stkAmpRow(a,n,r,L,selKey,ctx){
 var key='amp:'+n.i, f=fmtPct('weight',n.sq), p=Math.max(0,Math.min(100,pct('weight',n.sq)||0));
 var can=insightCanRelease({kind:'addr',i:n.i},r,ctx);
 var tip=!n.cf?'No feeling is mapped to this address yet, so a release cannot run here.':'';
 return '<div class="'+stkRowClass(key,L,selKey)+'">'
  +'<button type="button" class="stk-r stk-am" data-amp="'+n.i+'" title="'+esc(a.nm)+'"'
  +(tip?' data-tip-k="'+esc(a.nm)+'" data-tip="'+esc(tip)+'"':'')+'>'
  +'<span class="rb-row"><span class="rb-n"><span class="stk-nm">'+esc(a.nm)+'</span></span><span class="rb-v">'+esc(f)+'</span></span>'
  +'<span class="rb-t" aria-hidden="true" style="--c:'+seatCol(n.b)+'"><s style="left:25%"></s><s style="left:50%"></s><s style="left:75%"></s>'
  +'<i class="rb-f" style="width:'+p.toFixed(2)+'%"></i></span></button>'
  +stkRunHtml('data-run="addr" data-ri="'+n.i+'"',can.ok,'Release '+a.nm)+'</div>';}
function stkLevelHtml(k,label,count,body){
 return '<section class="stk-lv" data-lv="'+k+'">'
  +'<div class="stk-lh" tabindex="0" role="heading" aria-level="3" data-tip-k="'+esc(label)+'"'
  +' data-tip="'+esc(stkTipOf(k))+'" aria-label="'+esc(label+(count!==''?', '+count:'')+'. '+stkTipOf(k))+'">'
  +svgI('<path d="'+stkGlyphOf(k)+'"/>')+'<b>'+esc(label)+'</b>'
  +(count!==''?'<span class="stk-lc">'+count+'</span>':'')+'</div>'+body+'</section>';}
/* THE STACK. Six levels from Superego down, every one visible at once, flat,
   bars only: no sentence, no tab, no chevron, no nested row. A level with
   nothing running is not drawn, so there is no row of zeros. Each level shows
   its six heaviest bars and any bar on the selection's lineage, and ends in
   one 'N more' chip that opens the rest in the same list. */
function railStack(r){
 var e=document.getElementById('stack'); if(!e)return;
 r=r||computeSeen();
 if(r.unread){e.innerHTML=''; return;}
 var sel=insSelNow(), L=stkLineage(sel,r), selKey=stkSelKey(sel), ctx=insCtx(), h='';
 /* SUPEREGO, the four addresses the left rail's own Superego section reads,
    from the same table (AMPLIFIER, engine/data/registers.js) and the same
    weights (BY[i].sq), so the two can never disagree */
 var amps=STK_AMP.map(function(nm){return AMPLIFIER.filter(function(a){return a.nm===nm;})[0];})
  .filter(Boolean).map(function(a){return {a:a,n:BY[a.i]};}).filter(function(x){return x.n;});
 if(amps.some(function(x){return x.n.sq>=0.05;}))
  h+=stkLevelHtml('ego','Superego',amps.length,
   amps.map(function(x){return stkAmpRow(x.a,x.n,r,L,selKey,ctx);}).join(''));
 [['sup','sups'],['hy','hys'],['cx','cxs'],['sab','sabs']].forEach(function(lv){
  var k=lv[0], label=STK_LEVELS.filter(function(x){return x[0]===k;})[0][1];
  if(!lockSees(k)){h+=stkLevelHtml(k,label,'',lockPanelHtml(k,{brief:true})); return;}
  var list=insByW(r[lv[1]]||[]);
  if(!list.length)return;
  var open=!!STK_MORE[k], shown=list.filter(function(o,i){return open||i<STK_CAP||(L&&L[o.kind+':'+o.nm]);});
  var hidden=list.length-shown.length;
  h+=stkLevelHtml(k,label,list.length,
   shown.map(function(o){return stkPatternRow(o,r,L,selKey,ctx);}).join('')
   +(hidden>0?'<button type="button" class="stk-more" data-more="'+k+'" data-tip-k="'+esc(label)
    +'" data-tip="Opens the rest of this level in place.">'+hidden+' more</button>':'')
   +(open&&list.length>STK_CAP?'<button type="button" class="stk-more" data-more="'+k+'" data-less="1">Fewer</button>':''));});
 /* the child emotions are a fixed set of nine and draw as nine, in the
    table's own order, so a bar never moves from where it was */
 h+=stkLevelHtml('fet','Child emotions',CHILD.length,CHILD.map(function(c,ci){
  var key='fet:'+c.nm, can=insightCanRelease({kind:'fet',nm:c.nm},r,ctx);
  return '<div class="'+stkRowClass(key,L,selKey)+'">'+stkFetBar(ci,0)
   +stkRunHtml('data-run="fet" data-ri="'+ci+'"',can.ok,'Release '+c.nm)+'</div>';}).join(''));
 e.innerHTML=h;
 /* A LEVEL THE PLAN CANNOT SEE IS GREYED, PADLOCKED AND DESCRIBED, as the five
    tabs were before them. The header carries the lock (data-lock, the tier that
    opens it, the sentence on hover and tap) and its brief panel sits under it,
    so the rail says locked and never that nothing is running. lockApply is
    idempotent and the rail is rebuilt on every render, so nothing is cleared. */
 ['sup','hy','cx','sab'].forEach(function(k){
  if(!lockSees(k))lockApply(e.querySelector('.stk-lv[data-lv="'+k+'"] .stk-lh'),k);});}

/* ============================================================
   THE PRESSES. One delegated handler, because the rail is rebuilt on every
   render and a listener a row is a leak with a name.
   ============================================================ */
function insRefresh(){
 var r=computeSeen(); railInsight(r); railStack(r);
 if(typeof rbPairs==='function')rbPairs();}
document.addEventListener('click',function(e){
 var t=e.target; if(!t||!t.closest)return;
 var run=t.closest('.stk-run[data-run]');
 if(run){
  var k=run.getAttribute('data-run'), rr=computeSeen(), sel=null;
  if(k==='fet'){var c=CHILD[+run.getAttribute('data-ri')]; if(c)sel={kind:'fet',nm:c.nm};}
  else if(k==='addr'){sel={kind:'addr',i:+run.getAttribute('data-ri')};}
  else{var o=(rr[INS_LIST[k]]||[])[+run.getAttribute('data-si')]; if(o)sel={kind:o.kind,nm:o.nm};}
  if(sel)insRunRelease(sel);
  return;}
 var more=t.closest('.stk-more[data-more]');
 if(more){var lv=more.getAttribute('data-more'); STK_MORE[lv]=!STK_MORE[lv]; railStack(computeSeen());
  var back=document.querySelector('#stack .stk-lv[data-lv="'+lv+'"] .stk-more'); if(back)back.focus(); return;}
 var dot=t.closest('.ins-dot[data-pg]');
 if(dot){insPage(+dot.getAttribute('data-pg')); return;}
 if(t.closest('#bRel')){insRunRelease(insSelNow()); return;}
 var am=t.closest('.stk-r[data-amp]');
 if(am){var n=BY[+am.getAttribute('data-amp')]; if(n){S.pin=null; runNodeDrill(n);} return;}
 var fr=t.closest('.stk-r[data-fet]');
 if(fr){var fc=CHILD[+fr.getAttribute('data-fet')]; if(fc){S.pin=null; runFetterDrill(fc);} return;}
 var sr=t.closest('.stk-r[data-sk]');
 if(sr){
  var rs=computeSeen(), po=(rs[INS_LIST[sr.getAttribute('data-sk')]]||[])[+sr.getAttribute('data-si')];
  if(po){var same=S.pin&&S.pin.nm===po.nm&&S.pin.kind===po.kind; S.pin=same?null:po; runDrill(S.pin); render();
   if(S.pin&&typeof innerWidth==='number'&&innerWidth<=720){
    var ir=document.getElementById('insight'); if(ir&&ir.scrollIntoView)ir.scrollIntoView({block:'start'});}}
  return;}},false);
/* arrow keys page the reading when it has the focus */
document.addEventListener('keydown',function(e){
 var rd=e.target&&e.target.closest?e.target.closest('#insrd'):null;
 if(!rd||!INS_OUT)return;
 if(e.key==='ArrowRight'){e.preventDefault(); insPage(INS_PAGE+1);}
 else if(e.key==='ArrowLeft'){e.preventDefault(); insPage(INS_PAGE-1);}});
/* a swipe across the reading pages it, the main gesture on a phone */
(function(){
 var X=null, Y=null;
 document.addEventListener('pointerdown',function(e){
  var rd=e.target&&e.target.closest?e.target.closest('#insrd'):null;
  if(!rd){X=null; return;} X=e.clientX; Y=e.clientY;},true);
 document.addEventListener('pointerup',function(e){
  if(X===null||!INS_OUT)return;
  var dx=e.clientX-X, dy=e.clientY-Y; X=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>2*Math.abs(dy))insPage(INS_PAGE+(dx<0?1:-1));},true);
 document.addEventListener('pointercancel',function(){X=null;},true);})();
