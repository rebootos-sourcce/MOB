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
/* PICK SEVERAL, 20 November, his words on this rail: "I should be able to
   select the patterns from here that I want to release." relPick already
   takes an array and runs it as one release; only this rail asked for one row
   at a time. A pick is stored as what it names, {kind,nm} or {kind:'addr',i},
   never as a row object or a data-si index, because computeSeen rebuilds r on
   every render and an index goes stale between the press and the release. It
   is resolved through insightCanRelease, the single glyph's own route, at the
   moment Release is pressed. Kept apart from S.pin: pressing a bar still pins
   and opens its reading, the ring picks, and neither writes to the other. In
   memory only, and dropped when the person changes (STK_PICK_FOR), so one
   person's picks can never be released against another's record. */
var STK_PICKING=false, STK_PICK=[], STK_PICK_FOR=null;
var STK_PICKOFF=chainRing(12,12,8.2);
var STK_PICKON=chainRing(12,12,8.2)+'M8.2 12.2l2.6 2.6 5-5.4';
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
/* the one door to a run, shared by the pill and every bar's run glyph, and
   since 20 November it goes past the card into the run itself (insRunGo) */
function insRunRelease(sel){
 var r=computeSeen(), x=insightCanRelease(sel,r);
 if(!x.ok){var say=insWhySay(x.why); if(say)status(say,'warn'); return false;}
 return insRunGo(x.ids);}
/* STRAIGHT INTO THE PROTOCOL, 20 November, overriding 18 November's "opens the
   card and never starts a run" above. His words on this rail: "I should be
   able to click run release, and they take me to the release protocol." The
   rail is where the choosing happens now (what, and with Pick several, how
   many and at what dose), so the setup card would be the same choice asked a
   second time. The protocol itself stays full screen: in the 268px rail its
   820px text column and the two channel tallies, the left and right split,
   do not fit, and a narrow run would be those cut without saying so.
   The card still stands, and is the one thing shown, wherever beginning would
   be wrong: a worked example (showOnly, relBegin refuses it anyway), a spent
   allowance (an empty plan, which relBegin would run as a run of no lines that
   still released every picked address at its end), and the onboarding mini
   dose, whose card is the promise of four lines. Nothing is charged here: the
   meter is written in relCoolDown, at the end, as before. The press is still
   the browser's user gesture, so the opening sound plays as it did off the
   card's own Release. */
function insRunGo(ids){
 if(typeof relPick!=='function'||!ids||!ids.length)return false;
 relPick(ids);
 var example=typeof showOnly==='function'&&showOnly();
 if(RUN.open&&!RUN.mini&&!example&&(RUN.plan||[]).length&&typeof relBegin==='function')relBegin();
 return true;}

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
    +' data-tip-k="Release" data-tip="Starts the release at the heaviest place this holds. Pause and End stay on its screen.">'
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
/* BOTH POLES ON A PATTERN'S BAR, 20 November, his words on this rail: "The bars
   on the right should have both poles." The child emotions already drew two
   (stkFetBar). A saboteur and a hyper complex draw two now, with the opposite
   read from the one place the reading already reads it, insPole in
   engine/insight.js: SABCARD's op, the CHILD opposites of the charges the
   saboteur keys on and checked by tests/engine.js against SAB33 (the guard
   that caught Martyr's invented "Rest"), and HCXCARD's inverseName. So the
   bar and the third paragraph can never name two different opposites.
   The mark is placed the way fetBar places a child emotion's, held less
   installed, from the means of n.held and n.rep over the pattern's own
   addresses (compute.js gives a saboteur s.held and s.rep the same way). The
   figure is the chain figure this row always printed while it leans to the
   held pole, and the installed figure once the opposite outweighs it, which
   is fetBar's rule.
   NO OPPOSITE IS INVENTED. Superego, super complexes, complexes and an
   overshot row have no sourced opposite (insPole answers null), and they keep
   the one sided bar. Deriving one from the charge at an address is the exact
   mistake the Martyr guard exists to catch, so those names are the owner's. */
function stkPoleOf(o){
 var p=(typeof insPole==='function')?insPole(o):null;
 if(!p)return null;
 var def='';
 if(o.kind==='hy'){var h=HCXCARD[KB_KEY(insBase(o))]; def=(h&&h.inverseDefinition)||'';}
 else def='What opens as this saboteur lets go: the opposite of each charge it runs on.';
 return {nm:p.t, def:def};}
function stkHeldRep(o){
 if(typeof o.held==='number'&&typeof o.rep==='number')return {h:o.held,p:o.rep};
 var lv=leaves(o); if(!lv.length)return {h:0,p:0};
 return {h:lv.reduce(function(a,n){return a+(n.held||0);},0)/lv.length,
  p:lv.reduce(function(a,n){return a+(n.rep||0);},0)/lv.length};}
function stkPolar(o,nm,f,pole){
 var b=(leaves(o)[0]||{}).b||'Heart', hr=stkHeldRep(o), read=hr.h>0||hr.p>0;
 var lean=clamp(50+(hr.h-hr.p)*5,0,100), side=!read?0:Math.round(lean)>50?-1:Math.round(lean)<50?1:0;
 var ic='<path d="'+CHAINGLYPH[o.kind]+'"/>';
 return rbPair('stkp-'+o.kind+'-'+KB_KEY(o.nm),{read:read, whole:true,
  fig:!read?'–':side>0?fmtPct('installed',hr.p):f,
  L:{nm:nm,ic:ic,c:seatCol(b),v:lean}, R:{nm:pole.nm,ic:ic,c:'var(--accent)',v:100-lean}});}
/* the run glyph: a ring at the bar's right end. Not drawn (the slot is kept so
   every bar ends at the same place) when a release has nothing to open here.
   In Pick several it is the pick ring instead, in the same slot, so the two
   never stand side by side and every bar still ends at the same place. */
function stkRunHtml(attrs,ok,say,pk){
 if(!ok)return '<span class="stk-run off" aria-hidden="true"></span>';
 if(STK_PICKING){
  var on=stkPickAt(pk)>=0;
  return '<button type="button" class="stk-run stk-pk" role="checkbox" aria-checked="'+on+'" '+attrs.replace('data-run=','data-pk=')
   +' aria-label="'+esc('Pick '+pk.label)+'" data-tip-k="Pick" data-tip="Adds this to the release you are building. Press again to take it out.">'
   +svgI('<path d="'+(on?STK_PICKON:STK_PICKOFF)+'"/>')+'</button>';}
 return '<button type="button" class="stk-run" '+attrs+' aria-label="'+esc(say)+'"'
  +' data-tip-k="Release" data-tip="Release: starts the release for this one.">'+svgI(INS_RUNGLYPH)+'</button>';}
function stkRowClass(key,L,selKey,pk){
 return 'stk-row'+(key===selKey?' sel':'')+(L&&!L[key]?' dim':'')+(STK_PICKING&&pk&&stkPickAt(pk)>=0?' picked':'');}
function stkPatternRow(o,r,L,selKey,ctx){
 var si=(r[INS_LIST[o.kind]]||[]).indexOf(o);
 var key=o.kind+':'+o.nm, nm=o.nm+(o.over?', overshot':''), f=fmtPct('chain',o.w);
 var can=insightCanRelease({kind:o.kind,nm:o.nm},r,ctx), pk={kind:o.kind,nm:o.nm,label:o.nm};
 var pole=o.over?null:stkPoleOf(o), hr=pole?stkHeldRep(o):null;
 var tip=o.over?'The opposite pushed past where it helps. A release has nothing to work here.'
  :pole?pole.nm+'. '+pole.def:'';
 var says=pole?nm+' held '+f+', '+pole.nm+' installed '+fmtPct('installed',hr.p):nm;
 return '<div class="'+stkRowClass(key,L,selKey,pk)+'">'
  +'<button type="button" class="stk-r '+(pole?'stk-b stk-pl':'stk-am')+'" data-sk="'+o.kind+'" data-si="'+si+'" title="'+esc(says)+'"'
  +(tip?' data-tip-k="'+esc(pole?o.nm+' and its opposite':o.nm)+'" data-tip="'+esc(tip)+'"':'')+'>'
  +(pole?stkPolar(o,nm,f,pole):stkAmount(o,nm,f))+'</button>'
  +stkRunHtml('data-run="'+o.kind+'" data-si="'+si+'"',can.ok,'Release '+o.nm,pk)+'</div>';}
function stkAmpRow(a,n,r,L,selKey,ctx){
 var key='amp:'+n.i, f=fmtPct('weight',n.sq), p=Math.max(0,Math.min(100,pct('weight',n.sq)||0));
 var can=insightCanRelease({kind:'addr',i:n.i},r,ctx);
 var tip=!n.cf?'No feeling is mapped to this address yet, so a release cannot run here.':'';
 return '<div class="'+stkRowClass(key,L,selKey,{kind:'addr',i:n.i})+'">'
  +'<button type="button" class="stk-r stk-am" data-amp="'+n.i+'" title="'+esc(a.nm)+'"'
  +(tip?' data-tip-k="'+esc(a.nm)+'" data-tip="'+esc(tip)+'"':'')+'>'
  +'<span class="rb-row"><span class="rb-n"><span class="stk-nm">'+esc(a.nm)+'</span></span><span class="rb-v">'+esc(f)+'</span></span>'
  +'<span class="rb-t" aria-hidden="true" style="--c:'+seatCol(n.b)+'"><s style="left:25%"></s><s style="left:50%"></s><s style="left:75%"></s>'
  +'<i class="rb-f" style="width:'+p.toFixed(2)+'%"></i></span></button>'
  +stkRunHtml('data-run="addr" data-ri="'+n.i+'"',can.ok,'Release '+a.nm,{kind:'addr',i:n.i,label:a.nm})+'</div>';}
function stkPickSame(a,b){
 return a.kind===b.kind&&(a.kind==='addr'?a.i===b.i:a.nm===b.nm);}
function stkPickAt(pk){
 if(!pk)return -1;
 for(var j=0;j<STK_PICK.length;j++)if(stkPickSame(STK_PICK[j],pk))return j;
 return -1;}
function stkPickFlip(pk){
 var j=stkPickAt(pk);
 if(j>=0)STK_PICK.splice(j,1);
 else STK_PICK.push(pk.kind==='addr'?{kind:'addr',i:pk.i,label:pk.label||''}:{kind:pk.kind,nm:pk.nm,label:pk.label||pk.nm});
 railStack(computeSeen());}
function stkPickToggle(on){
 STK_PICKING=on===undefined?!STK_PICKING:!!on;
 if(!STK_PICKING)STK_PICK=[];
 railStack(computeSeen());}
/* who the picks belong to: the record and the worked example on screen */
function stkPickWho(){
 return (typeof CURP!=='undefined'?CURP:null)+'|'+(typeof S!=='undefined'?S.who:'');}
/* every pick, resolved now, in the order picked, each address once. A pick
   that no longer resolves (its pattern stopped running) is skipped and said. */
function stkPickIds(){
 var rr=computeSeen(), ctx=insCtx(), ids=[], seen={}, lost=0;
 STK_PICK.forEach(function(pk){
  var x=insightCanRelease(pk.kind==='addr'?{kind:'addr',i:pk.i}:{kind:pk.kind,nm:pk.nm},rr,ctx);
  if(!x.ok){lost++; return;}
  x.ids.forEach(function(i){if(!seen[i]){seen[i]=1; ids.push(i);}});});
 return {ids:ids,lost:lost};}
/* HOW LONG IT WOULD RUN, before anything opens: the plan the card would build
   (relPlan, the allowance's cap included) and the script's own clock
   (relSecFrom), read with the picked addresses in RUN's queue and put back
   untouched. Never while a release is open, whose queue this must not touch. */
function stkPickSec(ids){
 if(typeof relPlan!=='function'||typeof relSecFrom!=='function'||RUN.open)return null;
 var q0=RUN.queue, p0=RUN.plan;
 try{
  RUN.queue=ids.map(function(i){return BY[i];}).filter(function(n){return n&&n.cf;});
  RUN.plan=relPlan();
  return RUN.plan.length?relSecFrom(null):0;}
 catch(e){return null;}
 finally{RUN.queue=q0; RUN.plan=p0;}}
/* THE TRAY. The toggle always; with it on, what is picked, how long it runs,
   the dose the setup card used to ask for (the same REL_DOSES and RUN.dose,
   so the card and the tray cannot disagree), and the one Release. */
function stkTrayHtml(){
 var n=STK_PICK.length, hd='<button type="button" class="btn stk-pick-t" id="stkpick" aria-pressed="'+STK_PICKING+'"'
  +' data-tip-k="Pick several" data-tip="Turns every release ring into a pick ring, so one release can run several patterns at once.">'
  +svgI('<path d="'+STK_PICKON+'"/>')+(STK_PICKING?'Done picking':'Pick several')+'</button>'
  +(STK_PICKING?'<span class="stk-tray-n" aria-live="polite">'+n+' picked</span>':''), body='';
 if(STK_PICKING&&!n)body='<p class="stk-tray-p">Press a ring to add it.</p>';
 else if(STK_PICKING){
  var got=stkPickIds(), sec=got.ids.length?stkPickSec(got.ids):null;
  body='<ul class="stk-tray-l">'+STK_PICK.map(function(pk){return '<li>'+esc(pk.label||pk.nm||'')+'</li>';}).join('')+'</ul>'
   +'<div class="stk-tray-f">'
   +'<div class="seg" role="group" aria-label="Patterns, times each line is said, left and right" data-tip-k="Patterns"'
   +' data-tip="How many times each line is said, left and right. More takes longer.">'
   +REL_DOSES.map(function(d){return '<button type="button" data-stkdose="'+d+'" aria-pressed="'+(RUN.dose===d)+'">'+d+'</button>';}).join('')
   +'</div>'
   +(sec!=null&&sec>0?'<span class="stk-tray-t" data-tip-k="Time" data-tip="How long the release runs, start to finish, at this many patterns.">'
    +svgI('<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3 2"/>')+relMMSS(sec)+'</span>':'')
   +'</div>'
   +'<div class="stk-tray-b"><button type="button" class="btn" id="stkclear">Clear</button>'
   +'<button type="button" class="btn pri" id="stkgo"'+(got.ids.length?'':' disabled')+'>'+svgI(INS_RUNGLYPH)+'Release '+n+'</button></div>';}
 return '<div class="stk-tray'+(STK_PICKING?' on':'')+'" id="relq"><div class="stk-tray-hd">'+hd+'</div>'+body+'</div>';}
function stkPickGo(){
 var got=stkPickIds();
 if(!got.ids.length){status('Nothing picked can run a release right now.','warn'); return false;}
 var ok=insRunGo(got.ids);
 if(ok){STK_PICK=[]; STK_PICKING=false; railStack(computeSeen());
  if(got.lost)status(got.lost+(got.lost===1?' pick has':' picks have')+' nothing to release now and '+(got.lost===1?'was':'were')+' left out.','warn');}
 return ok;}
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
 if(STK_PICK_FOR!==stkPickWho()){STK_PICK_FOR=stkPickWho(); STK_PICK=[]; STK_PICKING=false;}
 var sel=insSelNow(), L=stkLineage(sel,r), selKey=stkSelKey(sel), ctx=insCtx(), h=stkTrayHtml();
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
  var key='fet:'+c.nm, can=insightCanRelease({kind:'fet',nm:c.nm},r,ctx), pk={kind:'fet',nm:c.nm,label:c.nm};
  return '<div class="'+stkRowClass(key,L,selKey,pk)+'">'+stkFetBar(ci,0)
   +stkRunHtml('data-run="fet" data-ri="'+ci+'"',can.ok,'Release '+c.nm,pk)+'</div>';}).join(''));
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
 if(t.closest('#stkpick')){stkPickToggle(); var tg=document.getElementById('stkpick'); if(tg)tg.focus(); return;}
 if(t.closest('#stkclear')){STK_PICK=[]; railStack(computeSeen()); return;}
 if(t.closest('#stkgo')){stkPickGo(); return;}
 var dz=t.closest('[data-stkdose]');
 if(dz){RUN.dose=+dz.getAttribute('data-stkdose'); railStack(computeSeen()); return;}
 var pkb=t.closest('.stk-pk[data-pk]');
 if(pkb){
  var pkk=pkb.getAttribute('data-pk'), pr=computeSeen(), pk=null;
  if(pkk==='fet'){var pc=CHILD[+pkb.getAttribute('data-ri')]; if(pc)pk={kind:'fet',nm:pc.nm,label:pc.nm};}
  else if(pkk==='addr'){var pi=+pkb.getAttribute('data-ri'), pa=AMPLIFIER.filter(function(a){return a.i===pi;})[0];
   pk={kind:'addr',i:pi,label:pa?pa.nm:''};}
  else{var po2=(pr[INS_LIST[pkk]]||[])[+pkb.getAttribute('data-si')]; if(po2)pk={kind:po2.kind,nm:po2.nm,label:po2.nm};}
  if(pk){stkPickFlip(pk);
   var back2=document.querySelector('#stack .stk-pk[data-pk="'+pkk+'"]['+(pkb.hasAttribute('data-si')?'data-si="'+pkb.getAttribute('data-si'):'data-ri="'+pkb.getAttribute('data-ri'))+'"]');
   if(back2)back2.focus();}
  return;}
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
