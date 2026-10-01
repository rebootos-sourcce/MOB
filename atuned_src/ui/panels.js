
/* ============================================================
   CONTROLS
   ============================================================ */
const $=function(id){return document.getElementById(id);};
/* svgI moved to component.js. It is a const, and a const reached for before
   its declaration throws at call time, which is a trap waiting for the first
   renderer that loads earlier than this file and wants an icon. */
/* a list said out loud: apathy and shock; anger, shame and disgust */
function panAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
/* EACH ROW CARRIES ITS OWN MARK, NOT A DOT. FV in TASKS.md, his words:
   "everything should have meaning, everything should have an icon." These
   rows led with an eight pixel dot in the seat's colour, which says the seat
   and nothing about which axis or which law the row is. Every child emotion
   and every law has carried its own glyph in canon.js since the port, and the
   stack on the right rail already draws the nine axes with them, so the
   sliders draw the same mark for the same thing. The colour is still the
   seat's. ic is optional, so a row with no glyph keeps the dot. */
function numField(host,name,band,store,key,ic){
 const d=document.createElement('div');d.className='nf';
 const col=band?seatCol(band):'var(--gold)';
 d.innerHTML=(ic?'<i class="nf-g" style="color:'+col+'"><svg viewBox="0 0 24 24" aria-hidden="true">'
   +glyphPath(ic)+'</svg></i>':'<i style="background:'+col+'"></i>')+'<label>'+name+'</label>'
  +'<span class="tr" role="slider" tabindex="0" aria-label="'+name+'" aria-valuemin="0" '
  +'aria-valuemax="10" aria-valuenow="'+store[key]+'"><b style="background:'+col+'"></b></span>'
  +'<input type="number" min="0" max="10" step="0.5" value="'+store[key]+'" aria-label="'+name+'">';
 host.appendChild(d);
 const inp=d.querySelector('input'),trk=d.querySelector('.tr'),tr=d.querySelector('.tr b');
 tr.style.width=(store[key]*10)+'%';
 const set=function(v){toYou();store[key]=clamp(v,0,10);
  tr.style.width=(store[key]*10)+'%';inp.value=store[key].toFixed(1);
  trk.setAttribute('aria-valuenow',store[key].toFixed(1));saveYou();render();};
/* +inp.value||0 mapped anything unparseable to zero, so a stray keystroke or
    clearing the field mid edit silently set the law to its worst value. An
    unreadable entry now holds the last good one instead of destroying it.
    Clamping is unchanged: 9999 still reads 10, -50 still reads 0. */
 inp.addEventListener('input',function(){
  var raw=inp.value.trim();
  if(raw===''){return;}                    /* mid edit, not a value of zero */
  var v=parseFloat(raw);
  if(!isFinite(v)){inp.value=store[key].toFixed(1);return;}
  set(v);});
 inp.addEventListener('blur',function(){inp.value=store[key].toFixed(1);});
 let dragging=false;
 const fromX=function(e){const b=trk.getBoundingClientRect();
  return ((e.clientX-b.left)/b.width)*10;};
 trk.addEventListener('pointerdown',function(e){dragging=true;trk.setPointerCapture(e.pointerId);set(fromX(e));});
 trk.addEventListener('pointermove',function(e){if(dragging)set(fromX(e));});
 trk.addEventListener('pointerup',function(){dragging=false;});
 trk.addEventListener('pointercancel',function(){dragging=false;});
 trk.addEventListener('keydown',function(e){
  if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();set(store[key]+.5);}
  if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();set(store[key]-.5);}});
 trk.addEventListener('wheel',function(e){e.preventDefault();set(store[key]+(e.deltaY<0?.5:-.5));},{passive:false});
 inp.addEventListener('wheel',function(e){e.preventDefault();set(store[key]+(e.deltaY<0?.5:-.5));},{passive:false});
 return {inp,tr,trk};}
const CHF={},RPF={},LWF={};
CHILD.forEach(function(cf){
 CHF[cf.nm]=numField($('chg'),cf.nm,cf.seat,S.charge,cf.nm,cf.ic);
 /* the opposite takes the same mark in Heart, as the stack draws it */
 RPF[cf.nm]=numField($('chg'),'toward '+cf.opp,'Heart',S.replace,cf.nm,cf.ic);
 RPF[cf.nm].inp.parentElement.classList.add('oppf');});
SI.forEach(function(l){LWF[l.nm]=numField($('laws'),l.nm,l.b,S.law,l.nm,l.ic);});
function syncCh(){CHILD.forEach(function(cf){
 const f=CHF[cf.nm],v=+S.charge[cf.nm]||0;S.charge[cf.nm]=v;
 f.inp.value=v.toFixed(1);f.tr.style.width=(v*10)+'%';f.trk.setAttribute('aria-valuenow',v.toFixed(1));
 const o=RPF[cf.nm],w=+S.replace[cf.nm]||0;S.replace[cf.nm]=w;
 o.inp.value=w.toFixed(1);o.tr.style.width=(w*10)+'%';o.trk.setAttribute('aria-valuenow',w.toFixed(1));});}
function syncLw(){SI.forEach(function(l){
 const f=LWF[l.nm],v=+S.law[l.nm]||0;S.law[l.nm]=v;
 f.inp.value=v.toFixed(1);f.tr.style.width=(v*10)+'%';f.trk.setAttribute('aria-valuenow',v.toFixed(1));});}
$('allCh').addEventListener('input',function(e){toYou();
 CHARGES.forEach(function(c){S.charge[c]=+e.target.value;});syncCh();saveYou();render();});
$('allRep').addEventListener('input',function(e){toYou();
 CHARGES.forEach(function(c){S.replace[c]=+e.target.value;});syncCh();saveYou();render();});
$('allLaw').addEventListener('input',function(e){toYou();
 SINAMES.forEach(function(l){S.law[l]=+e.target.value;});syncLw();saveYou();render();});

/* ---- tabs and depths ---- */
function setTab(i){
 /* A FOLDED SURFACE RESOLVES TO ITS PARENT. Analytics and Games came off the
    bar and their hosts moved inside Summary and Knowledge, so an integer that
    used to be a tab is now a request for the tab that carries it. Routing
    every caller through TABREAL means the drills, the tools and any stored
    value keep working instead of landing on whatever happens to be first. */
 i=TABREAL(i);
 /* A HIDDEN SURFACE THAT KEEPS ITS LAST RENDER IS STILL ASSERTING IT. Summary
    and Analytics are the two surfaces on this bar that print a reading, and
    both are rebuilt on entry, so what they hold while hidden is whatever was
    true for whoever was loaded last. Leaving it there means the document
    carries a coherence figure for a profile that is no longer selected, which
    anything reading the page finds, and the functional gate did: it swept the
    body on a cleared field and found two percentages nobody could see. They
    are emptied on the way out rather than left to go stale.

    TWO SURFACES, TWO CONDITIONS, since round LV: Analytics unfolded from
    Summary and #ana stopped being a child of #sum, so leaving one no longer
    has anything to say about the other. Each empties only its own host. */
 if(S.tab===TAB.SUMMARY&&i!==TAB.SUMMARY){
  var sb=$('sumbody'); if(sb)sb.innerHTML='';}
 if(S.tab===TAB.ANALYTICS&&i!==TAB.ANALYTICS){
  var ab=$('ana'); if(ab)ab.innerHTML='';}
 S.tab=i; S.pin=null;
 /* THE HOSTS ARE SHOWN FROM BOTH TABLES. This walked TABDEF alone and
    Settings was shown and hidden by hand below, which held while Settings was
    the only surface with no door. At KT Games came off the bar into TABEXTRA
    ("Hide games for now") and the loop stopped reaching its host: setTab
    answered Games and the host kept display none, measured as a 0 pixel box
    on a phone by the functional gate. Every doorless surface is in TABEXTRA,
    so the loop reads it too, and Settings lost its hand written copy of these
    two lines rather than keep a second writer for one display. */
 TABDEF.concat(Object.keys(TABEXTRA).map(function(k){return TABEXTRA[k];})).forEach(function(T){
  var e=$(T.id); if(!e||T.id==='cv')return;
  e.classList.toggle('on',T.k===i);
  e.style.display=(T.k===i)?'flex':'none';});
 (function(){var sE=$('settings'); if(!sE)return;
  /* the account area replaced renderSettings. The old function is gone rather
     than left beside it, because two renderers for one host is how a surface
     ends up half updated. */
  if(i===TAB.SETTINGS&&typeof renderAccount==='function')renderAccount();
  /* THE RITUAL IS A SURFACE NOW, NOT A SHEET. It was a modal reached from
     three places and he had never seen it. As a tab it has to be open the
     moment the tab is, because a surface that needs a second press to show
     anything is a blank screen with a name on it. */
  if(i===TAB.RITUAL&&typeof ritOpen==='function'){
   if(!RIT.open)ritOpen(null); else ritRender(); }})();
 /* THE FIELD IS DRAWN ONE OF THREE WAYS NOW, BP8, and which of the canvas,
    the depth row, a rendition and its layer row are up is decided in one
    place, fviewPaint in ui/rings.js. This showed the canvas and the depth
    row itself, and a second writer for one display is how a surface ends up
    showing two pictures at once. */
 fviewPaint(i);
 /* Body's layer row lives in the sub bar now, not over the figure */
 var lb=$('lbar'), rb=$('rbar');
 if(lb) lb.style.display=(i===TAB.ENERGY)?'flex':'none';
 if(rb) rb.style.display=(i===TAB.ENERGY&&PMLAYER==='pain')?'flex':'none';
 /* CLEAR FROM BOTH TABLES, BECAUSE THE ADD READS BOTH.
    This cleared TABDEF only. Settings is deliberately not in TABDEF, having no
    door in the bar, so its class went on through TABOF and never came off. The
    body then carried tab-settings for the rest of the session on top of
    whatever tab the person moved to, and the rule that collapses the right
    rail on Settings stayed applied everywhere. The centre column kept
    rendering, so from the outside nothing looked broken: the rail was simply
    gone, on every surface, until a reload.

    Found by the render watch on its first run after it was taught to walk the
    rails, which is the whole argument for teaching it. It is also the same
    mistake this repository keeps making in new places: a thing looked up in
    one table and written from two. */
 TABDEF.forEach(function(T){document.body.classList.remove(T.cls);});
 Object.keys(TABEXTRA).forEach(function(k){
  var T=TABEXTRA[k]; if(T&&T.cls)document.body.classList.remove(T.cls);});
 document.body.classList.add(TABOF(i).cls);   /* by key, not by position */
 /* THE TAB ARRIVES RATHER THAN APPEARING. Switching surfaces was a single
    frame cut: one host went to display:none and the next to flex, which gives
    the eye no direction to follow and no sense that anything moved rather than
    was replaced. Six pixels of rise over the context step, on the surface that
    just came on.

    The class has to be taken off and the layout read before it goes back on.
    Adding a class that is already there does not restart a keyframe, so
    without the offsetWidth read the second visit to a tab animates nothing.
    This is the one deliberate forced reflow in the product, on a host that was
    about to be laid out anyway. */
 (function(){var h=$(i===TAB.SETTINGS?'settings':TABOF(i).id);
  /* the Field's entry names the canvas, and that is identity and stays. When
     a rendition is up it is the picture on screen, so it is the one that
     arrives; the canvas under it is hidden and would rise unseen. */
  if(i===TAB.FIELD&&fviewOn())h=$('frend');
  if(!h)return; h.classList.remove('tabin'); void h.offsetWidth;
  h.classList.add('tabin');})();
 /* MEASURE THE CANVAS THE MOMENT IT IS VISIBLE, AND NOT ONE LINE EARLIER.

    It used to be measured once at boot, which worked only while Field was the
    opening surface. It is not any more, so at boot the canvas was display:none
    and the first draw after switching laid the wheel out for a canvas that did
    not exist.

    The first fix put this call above, before the body class was set, and the
    sheet carries `body:not(.tab-field) #cv{display:none!important}`, which
    beats the inline display this function had just written. So it measured a
    canvas that was still hidden and read zero by zero. A ResizeObserver
    corrected it a frame later and nothing looked wrong, which is exactly how
    it survived a pass. It sits after the class now, where the canvas is
    actually on screen. */
 if(i===TAB.FIELD&&typeof layout==='function')layout();
 /* AND THE RAIL'S ICON GRIDS REFIT ON ARRIVAL, for the same reason the canvas
    is measured here. Settings is the one surface that takes the columns to
    display:none, so leaving it gives the grids a width again without a resize
    event to say so. fitGrid skips a hidden grid and skips an unchanged fit,
    so this costs one layout read on a surface change and nothing on a draw. */
 if(typeof fitGrids==='function')fitGrids();
 /* THE FIELD ASSEMBLES ON ARRIVAL, once per arrival. Here rather than in the
    renderer, because the renderer runs sixty times a second and arriving is
    something that happens once. */
 if(i===TAB.FIELD&&typeof enterStart==='function')enterStart();
 /* and the circles lying over it arrive with it, once, ui/fieldbar.js */
 if(i===TAB.FIELD&&typeof fbEnter==='function')fbEnter();
 /* the Field's sub bar carried the depth row, and the glass bar floating over
    the stage replaced it. His words: "I don't want that secondary
    navigation." So the sub bar is Body's alone.
    AND NOW NOBODY'S BY DEFAULT. LM in TASKS.md: the Mark row, the last thing
    it carried on the Body, went onto the picture's upper right with its own
    fold, "close that to reclaim space", so the band would have been an empty
    glass strip over the stage. Every tab change takes it down; the Masks
    door's Whole body, bmBarsOne in ui/map.js, is the one writer that raises
    it, and only while that door is zoomed into a region. */
 document.body.classList.remove('hassub');
 ['probe','howto','key','tier','pol'].forEach(function(id){
  var e=$(id); if(e)e.style.display=(i===TAB.FIELD)?'':'none';});
 /* pressed state read off each button's own integer, never off its position
    in a list that could be a different length than TABDEF. */
 document.querySelectorAll('.tabtop').forEach(function(x){
  x.setAttribute('aria-pressed',+x.getAttribute('data-tabk')===i);});
 /* a door above the plan is greyed again after the loop wrote its pressed state */
 lockTabs();
 /* the folded bar on a phone names the surface, GF. Settings has no tab of
    its own, so the folded bar says the button that opened it. */
 var nn=$('navnow');
 if(nn){var nT=TABDEF.filter(function(T){return T.k===i;})[0];
  nn.textContent=nT?nT.nm:(i===TAB.SETTINGS?'Profile':nn.textContent);}
 secPaint(i);
 /* THE RAIL OPENS WHAT THE SURFACE IS ABOUT.

    The Body page's whole reading is flow through the seven seats, and the
    shelf carrying it sits in a rail section that is closed by default. So the
    owner opened Body and the footer was not there: it was in the document
    with seven children and real text, measuring zero by zero, behind a
    collapsed accordion he had no reason to know to open.

    Each surface names the sections it is about and they are opened once, the
    first time that surface is reached. Once, not every time: a person who
    closes a section has closed it, and a tab that reopens it on every visit
    is arguing with them. */
 (function(){
  var WANT={};
  WANT[TAB.ENERGY]={right:['flow','running']};
  WANT[TAB.FIELD]={left:['soul','lean'],right:['you']};
  WANT[TAB.COMPASS]={right:['you']};
  /* the Story's rail is the imprints since GO, opened by the bank now. The
     release went into the Story's own third column, round IJ, so it has no
     rail section left to open. */
  WANT[TAB.STORY]={right:['simp']};
  var w=WANT[i]; if(!w)return;
  SEC_SEEDED=SEC_SEEDED||{};
  if(SEC_SEEDED[i])return; SEC_SEEDED[i]=1;
  Object.keys(w).forEach(function(rail){
   w[rail].forEach(function(k){ if(OPENSEC[rail])OPENSEC[rail][k]=1; });});
  if(typeof paintSections==='function')paintSections();})();
 if(i===TAB.INTAKE)renderIntake();
 /* THE INTAKE PAGE BORROWS THE QUESTIONS' HOST, round OG. intakeui.js draws
    into #iqbody by id and the Avatar's menu already lends that host out and
    takes it back, so this does the same: the host goes into #iqp, shown, and
    is drawn. avShowIntake puts it home again the next time the Avatar paints. */
 if(i===TAB.QUESTIONS){
  var iqh=$('iqbody'), iqp=$('iqp');
  if(iqh&&iqp){if(iqh.parentNode!==iqp)iqp.appendChild(iqh); iqh.hidden=false;}
  if(typeof renderIntake==='function')renderIntake();}
 /* GAMES IS ITS OWN TAB AGAIN AND THIS DISPATCH DID NOT KNOW.

    Knowledge used to carry Games as a folded surface, and this rendered both
    from the parent because the games host sat inside it. The owner ruled Games
    back onto its own door, core.js unfolded it and body.html moved #games out
    to be a sibling of #know, and this line was left behind. So the only branch
    that ever called gmRender was the Knowledge branch, and every other tab,
    Games included, fell into the else and called lgStop.

    The result was a tab that opened a 903px host with nothing in it. Two
    conditions now, because they are two surfaces. */
 if(i===TAB.KNOW)kbRender();
 /* the practitioner sketch, round LL. Drawn on entry and not held shut here
    when the mode is off: its door is what the switch governs, and a surface
    that answered setTab with nothing would be the empty 903px host Games
    once was. */
 if(i===TAB.PRACTITIONER&&typeof renderPrac==='function')renderPrac();
 if(i===TAB.GAMES){ if(!GAME)GAME='lg'; gmRender(); } else lgStop();
 if(i===TAB.STORY)stRender(); else if(typeof stRailClear==='function')stRailClear();
 /* SUMMARY AND ANALYTICS EACH RENDER TO THEIR OWN DOOR, since round LV. This
    called both on entry to Summary, back when Analytics had no door of its
    own and rode in on Summary's arrival; now each tab renders only itself,
    the same shape as every other entry below. */
 if(i===TAB.SUMMARY)sumRender();
 else if(i===TAB.ANALYTICS)anaRender();
 /* THE COMPASS HAS A FRONT DOOR. It was three clicks deep: click one end of
    the cone marker on the Field stage, then a button inside the drill that
    opened. The owner looked for it and could not find it, which is the whole
    finding. It is a tab. coneOpen builds its own canvas and starts its own
    frame loop, so entering the tab opens it and leaving it stops the loop
    rather than leaving a requestAnimationFrame running behind another
    surface. */
 if(i===TAB.COMPASS)coneOpen(true); else if(CONE.open&&CONE.tab)coneClose();
 render(); paintSections();
 tabTop(i);}
/* A NEW SURFACE STARTS AT ITS OWN TOP.

   On a phone the whole app scrolls inside one container and arriving at a
   surface did not take the view back to the top of it. A person who had read
   down the codex and pressed Compass landed four screens below the compass,
   looking at the bottom of the page they had just left. It reads as the tab
   doing nothing, which is the worst kind of defect, because the answer a
   person tries is to press it again and it still does nothing.

   Twice, and the second time is the point. The first cut ran partway through
   setTab and measured clean on its own, then the gate still failed at 4165:
   everything after it, the renderers and the rail, scrolls the container
   again. So it runs last, and once more on the next frame, because a
   renderer that lays out asynchronously would otherwise win the argument.

   Only a container that has actually moved is written to, so this does
   nothing at all on a surface already at its top. */
function tabTop(i){
 /* AND FOCUS HAS TO MOVE WITH THE TAB, WHICH IS THE ACTUAL CAUSE.

    Resetting the scroll was not enough and the trap said why: a button on the
    surface the person just left still held focus, and when the new surface
    laid out the browser scrolled that button back into view. The log reads
    74, 117, 171 and climbing, which is a smooth scroll and not a jump, so
    nothing in this file was doing it. The browser was, correctly, keeping the
    focused control on screen.

    Blurring alone would leave focus nowhere, which is worse for anybody on a
    keyboard. So focus goes to the button for the tab that was just pressed,
    which is where a person on a keyboard already is and where a person on a
    pointer expects nothing. `preventScroll` because focusing is the thing
    that started this. */
 var btn=document.querySelector('.tabtop[data-tabk="'+i+'"]');
 var a=document.activeElement;
 /* a section button keeps focus, KC: it is in the bar, so it cannot scroll
    anything, and handing focus on to the tab opened that tab's definition
    over the page on every press of a section */
 var inSec=!!(a&&a.closest&&a.closest('#secbar'));
 if(a&&a!==document.body&&a!==btn&&!inSec){
  try{ if(btn&&btn.focus)btn.focus({preventScroll:true}); else if(a.blur)a.blur(); }
  catch(e){ if(a.blur)a.blur(); }}
 var hit=function(){
  var sc=document.scrollingElement||document.documentElement;
  [document.body,document.querySelector('.stage'),sc].forEach(function(el){
   if(el&&el.scrollTop)el.scrollTop=0;});};
 hit();
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(hit);}
/* THE BAR IS IN THE DOCUMENT AND THIS ONLY WIRES IT. Ruled, and the reason is
   in the markup beside the buttons: nine buttons built in a loop meant the top
   menu existed only if the script reached the loop, so every start up failure
   took the navigation with it.

   The buttons carry their tab integer in data-tabk, which is the identity
   integer and never the position, so the markup and TABDEF cannot disagree
   about which button is which. A gate proves the two lists match. */
(function(){
 var bar=$('tabbar'); if(!bar)return;
 bar.querySelectorAll('[data-tabk]').forEach(function(b){
  var k=+b.getAttribute('data-tabk');
  b.setAttribute('aria-pressed',k===S.tab);
  b.addEventListener('click',function(){setTab(k);});});
}());
/* ---- THE FIRST TIER, KC and KM in TASKS.md ----
   The sections over the tabs, the loop's four since KT. The section is read
   off the tab through SECOF in engine/core.js, never stored beside it, so the two cannot disagree.
   Written onto the bar as data-sec, which is what shows the section's group of
   tabs in head.html; a surface with no section, Settings, leaves the last
   section's tabs showing with none pressed, so a person can still see where
   they came from.

   A section remembers the tab last used in it for the session, so Play after
   a visit to Knowledge goes back to the Compass a person left, not to the
   first tool. The first visit goes to the section's first tab. */
var SEC_LAST={};
function secPaint(i){
 var sec=SECOF(i), top=document.querySelector('.top');
 if(sec){SEC_LAST[sec]=TABREAL(i); if(top)top.setAttribute('data-sec',sec);}
 document.querySelectorAll('#secbar .secb').forEach(function(b){
  b.setAttribute('aria-pressed',b.getAttribute('data-sec')===sec);});
 var ns=$('navsec'); if(ns){var e=SECTIONS.filter(function(x){return x.k===sec;})[0];
  ns.textContent=e?e.nm:'';}
 secAlign();}
/* THE SECOND TIER STARTS UNDER THE FIRST, LETTER ON LETTER. KT, his words:
   "they start pixel for pixel, directly underneath like text-wise, font-wise,
   name-wise. Underneath the primary navigations. First letter as well. so
   they're on the same axis. Vertically." The row under the bar began at the
   bar's own left edge, under the wordmark, so what a section opened sat
   nowhere near the section that opened it.

   A section's width is its word, so where its first letter lands is only
   known once it is laid out, and the offset is measured rather than written:
   the pressed section's word against the first shown tab's word, and the
   difference goes into the row's left padding through --secx on the bar,
   which head.html applies above the phone width only. Measured against the
   padding already there, so a second call with nothing moved changes nothing.
   Folded, the tab names are clipped to a pixel and cannot be measured, so the
   icons are lined up instead, and the words line up again when the fold
   opens, since that change calls this.
   ON THEIR CENTRES, SINCE LL. The section mark is 23px and the tab mark is
   16.15, so lining up their left edges put the smaller one 3.4px off the
   larger one's axis. Two marks of different sizes share an axis through
   their middles, the way a column of different sized glyphs does. */
function secAlign(){
 var top=document.querySelector('.top'), bar=$('tabbar');
 if(!top||!bar||!window.matchMedia||matchMedia('(max-width:720px)').matches)return;
 var sb=document.querySelector('#secbar .secb[aria-pressed="true"]');
 var tb=[].filter.call(bar.querySelectorAll('.tabtop'),function(b){return b.offsetParent;})[0];
 if(!sb||!tb)return;
 var a=sb.querySelector('.sn'), b=tb.querySelector('.n'), mid=0;
 if(!a||!b||b.getBoundingClientRect().width<2){a=sb.querySelector('svg'); b=tb.querySelector('svg'); mid=1;}
 if(!a||!b)return;
 var pad=parseFloat(getComputedStyle(bar).paddingLeft)||0;
 var ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
 var x=Math.max(0,Math.round(pad+ra.left-rb.left+(mid?(ra.width-rb.width)/2:0)));
 top.style.setProperty('--secx',x+'px');}
function secGo(sec){
 var k=SEC_LAST[sec];
 if(k===undefined){var f=TABDEF.filter(function(T){return T.sec===sec;})[0]; if(!f)return; k=f.k;}
 setTab(k);}
(function(){
 var sb=$('secbar'); if(!sb)return;
 sb.querySelectorAll('.secb').forEach(function(b){
  b.addEventListener('click',function(){secGo(b.getAttribute('data-sec'));});});
 /* the pressed section moves when the width moves, when the fold rolls the
    others in, which it does over a transition, so that is waited out, and
    when the typeface arrives, since the words are measured in it */
 addEventListener('resize',secAlign);
 sb.addEventListener('transitionend',function(e){if(e.propertyName==='max-width')secAlign();});
 var fold=$('tabnames'); if(fold)fold.addEventListener('change',secAlign);
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(secAlign);
 secPaint(S.tab);}());
/* ---- THE SEARCH, KC ----
   One circle where help was. Pressed, the field rolls out and takes the
   cursor; pressed again, or Escape, or leaving it empty, rolls it back in.
   Enter takes the words to the codex, which is the product's one search, and
   opens the deck that holds the most of them when the deck on screen holds
   none, so a search never lands on an empty page when something matched. */
(function(){
 var wrap=$('srch'), btn=$('srchbtn'), q=$('srchq'); if(!wrap||!btn||!q)return;
 function set(open){
  wrap.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open?'true':'false');
  q.tabIndex=open?0:-1;
  if(open){try{q.focus({preventScroll:true});}catch(e){q.focus();}}}
 function go(){
  var t=q.value.trim(); if(!t)return;
  if(typeof KB_Q==='undefined'||typeof kbRows!=='function'){setTab(TAB.KNOW);return;}
  KB_Q=t;
  var lq=t.toLowerCase(), hits=function(s){return kbRows(s).filter(function(x){return kbMatch(x,lq);}).length;};
  if(!hits(KB_SEC)){var best=null,bn=0;
   KB_SECS.forEach(function(s){var n=hits(s[0]); if(n>bn){bn=n;best=s[0];}});
   if(best)KB_SEC=best;}
  q.value=''; set(false);
  setTab(TAB.KNOW);
  /* and the cursor goes on to the codex's own field, which now holds the
     words, so the next key refines the search rather than landing nowhere */
  var kq=$('kbq'); if(kq){try{kq.focus({preventScroll:true});}catch(e){kq.focus();}
   try{kq.setSelectionRange(kq.value.length,kq.value.length);}catch(e){}}}
 btn.addEventListener('click',function(e){e.stopPropagation();
  if(wrap.classList.contains('open')&&q.value.trim())go();
  else set(!wrap.classList.contains('open'));});
 q.addEventListener('keydown',function(e){
  if(e.key==='Enter'){e.preventDefault();go();}
  else if(e.key==='Escape'){e.stopPropagation();q.value='';set(false);btn.focus();}});
 q.addEventListener('blur',function(){
  setTimeout(function(){if(!q.value.trim()&&document.activeElement!==btn)set(false);},120);});}());
/* measured once the strip exists, and again whenever the window changes */
if(typeof paintTabEdge==='function')paintTabEdge();
/* THE DEPTH ROW WAS BUILT HERE, four .vt buttons in #vbar, and is gone. The
   glass bar replaced it on the owner's ruling, DK through ED in TASKS.md, and
   the four depths are its presets now, behind its Depth circle. Their icons
   and their definitions went with them to ui/fieldbar.js, which loads before
   this file, so nothing here reaches forward for them. */
/* The three themes were three text buttons and took more width than the
   tab bar. A crescent for dark, a six point flake for snow, and for punch
   a circle with one half solid. Punch is the one place a fill is the
   message rather than a decoration: the theme is the absence of outlines,
   so the icon says it by being half solid. */
const THEMEICON={
 dark:'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
 snow:'M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 7l-2.6-2.6M12 7l2.6-2.6M12 17l-2.6 2.6M12 17l2.6 2.6',
 punch:'M12 4a8 8 0 0 1 0 16zM12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0',
 /* a pane at an angle with light coming off its edge. the one glyph that says
    refraction rather than blur. */
 glass:'M5.5 7.2l9-3.2v12.8l-9 3.2zM14.5 4l4 2.4v11.2l-4 2.4M5.5 7.2L9.6 9.4',
 /* the same pane, lit from the front rather than from behind */
 glasswhite:'M5.5 7.2l9-3.2v12.8l-9 3.2zM14.5 4l4 2.4v11.2l-4 2.4M19 3l2.4 2.4M21 7.6l1.6-1.6',
 /* three flat planes, no bevel, no light. The mark is the position. */
 flat:'M3.5 5.5h7v7h-7zM13.5 5.5h7v4h-7zM13.5 12.5h7v6h-7zM3.5 15.5h7v3h-7z',
 /* a white field with a solid block set into it, which is the whole of Lumen:
    the ground is paper and everything that carries reading is a black panel
    standing on it. */
 lumen:'M3 3h18v18H3zM8 8h8v8H8z'};
/* FOUR LIGHTINGS. Glass is the fourth, and it is the one aimed forward: the
   direction the field is moving for 2027 and 2028 is holographic
   skeuomorphism, which is refraction and real elevation rather than the blur
   and white hairline everybody shipped in 2020. */
/* ONE LIST AND ONE SETTER, because the settings surface shows the same four
   and a second copy of a list of lightings is a list that will drift. */
/* SIX, on the owner's ruling. Glass on white is the same material under a
   different sun. Flat is the opposite position to all five others: no bevel,
   no blur, no shadow, and colour doing the work a material was doing. */
/* SEVEN. Lumen is the owner's, and it is the only two tone one: white chrome,
   black panels, the text on top of the black. */
const LIGHTINGS=[['dark','Dark'],['snow','Snow'],['punch','Punch'],['glass','Glass'],
 ['glasswhite','Glass white'],['flat','Flat'],['lumen','Lumen']];
function setLighting(k){
 S.theme=k;
 ['snow','punch','glass','glasswhite','flat','lumen'].forEach(function(c){
  document.body.classList.toggle(c,k===c);});
 /* the bar's menu and the main menu's lighting on a phone, GF: one list, two
    doors, one setter, so both say the same lighting is on */
 ['themes','navthemes'].forEach(function(id){var seg=$(id);
  if(seg)seg.querySelectorAll('button').forEach(function(x,j){
   x.setAttribute('aria-pressed',LIGHTINGS[j]&&LIGHTINGS[j][0]===k);});});
 var nw=$('lightnow');
 if(nw){var e=LIGHTINGS.filter(function(t){return t[0]===k;})[0];
  if(e)nw.textContent=e[1];}
 rebuildSwatches(); render();}
LIGHTINGS.forEach(function(t,i){
 var b=document.createElement('button');b.type='button';
 b.setAttribute('aria-pressed',i===0);
 b.className='seg-i'; b.title=t[1]; b.setAttribute('aria-label',t[1]+' theme');
 b.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">'
  /* A MISSING ICON IS A MISSING ICON, NOT THE WORD UNDEFINED. Adding a seventh
     lighting put the string "undefined" into a path attribute and the browser
     logged a parse error on every boot, which the design gate caught. A
     lighting with no mark now draws nothing and says so in the console once,
     rather than shipping a broken path. */
  +'<path d="'+(THEMEICON[t[0]]||'')+'"/></svg>';
 if(!THEMEICON[t[0]])b.setAttribute('data-noicon','1');
 b.addEventListener('click',function(){setLighting(t[0]);});
 $('themes').appendChild(b);
 /* THE SAME CHOICE IN THE MAIN MENU, GF. The mark and its name side by side,
    because the menu has the width the bar's segmented row did not, and a
    person choosing a lighting should not have to know which glyph is Lumen. */
 var nav=$('navthemes'); if(!nav)return;
 var n=document.createElement('button');n.type='button';
 n.setAttribute('aria-pressed',i===0);
 n.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="'
  +(THEMEICON[t[0]]||'')+'"/></svg><span>'+esc(t[1])+'</span>';
 n.addEventListener('click',function(){setLighting(t[0]);});
 nav.appendChild(n);});
/* ---- THE LIGHTING MENU ----
   The three lighting buttons moved off the bar and into a menu on the owner's
   ruling. The button names the lighting it is on, so the setting is still
   readable at a glance without spending three navigation slots on it.

   It closes on the backdrop, on escape and on a choice, and the choice closes
   it because a person who has picked the lighting can see the result behind
   the menu and does not need the menu any more. */
(function(){
 var btn=$('lightbtn'), menu=$('lightmenu'); if(!btn||!menu)return;
 function shut(){menu.hidden=true; btn.setAttribute('aria-expanded','false');}
 function open(){menu.hidden=false; btn.setAttribute('aria-expanded','true');}
 btn.addEventListener('click',function(e){
  e.stopPropagation(); if(menu.hidden)open(); else shut();});
 menu.addEventListener('click',function(e){
  /* a lighting choice is the last thing this menu is for */
  if(e.target.closest('button'))shut();
  e.stopPropagation();});
 document.addEventListener('click',function(){if(!menu.hidden)shut();});
 document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&!menu.hidden){shut();btn.focus();}});})();
/* ---- THE MAIN MENU ON A PHONE, GF in TASKS.md ----
   The folded bar opens and closes the tabs and the lighting under them, the
   class on .top is the whole state, and the head.html rules under the phone
   width read it. A tab chosen closes it, because the surface it opens is the
   thing a person wanted and the menu is in its way; a lighting chosen closes
   it for the reason the bar's own lighting menu does, the result is behind
   it. Escape closes it too, the same as every other menu here. */
(function(){
 var top=document.querySelector('.top'), tog=$('navtog'), bar=$('tabbar'), lt=$('navthemes');
 if(!top||!tog||!bar)return;
 function set(open){top.classList.toggle('navopen',open);
  tog.setAttribute('aria-expanded',open?'true':'false');}
 tog.addEventListener('click',function(){set(!top.classList.contains('navopen'));});
 bar.addEventListener('click',function(e){if(e.target.closest('[data-tabk]'))set(false);});
 if(lt)lt.addEventListener('click',function(e){if(e.target.closest('button'))set(false);});
 document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&top.classList.contains('navopen')){set(false);tog.focus();}});})();
/* ---- THE WORDMARK GOES HOME ----
   Home is the field. It is the instrument, it is where the app opens on the
   owner's ruling, and it is what clicking the name of the product asks for. */
(function(){
 var b=$('brand'); if(!b)return;
 /* home is where the app opens, and the app opens on Field */
 b.addEventListener('click',function(){setTab(TAB.FIELD);});})();
/* the font tuner is gone on the owner's ruling. one face, narrower, no
   per person override to keep working across every surface. */

/* ---- the icon grids. the icon carries the colour, selection is a ring. ---- */
DOMAINS.forEach(function(d,i){
 var b=document.createElement('button');b.className='ib';b.type='button';
 b.style.setProperty('--c',rootCol(d.r));
/* THE TOOLTIP SAYS WHAT THE THING IS AND WHAT PRESSING IT DOES. It said
    "Justice, Architect. <one line>. Shift-click to add." which names the thing
    and then jumps straight to a keyboard trick, with nothing in between about
    what a blueprint domain is or what selecting one changes. */
 /* V21. "A blueprint domain" and "affinity 1.3 on" said what the thing is
    called and not what it does to a person. The multiplier is suscAll's: a
    root you run makes its paired axes take 1.3 times the charge. */
 b.title=d.nm+': '+d.d+'. One of 19 parts of the blueprint you are born with, '
  +'under the '+d.r+' root.\n\n'
  +((AFFIN[d.r]||[]).length?'Running it makes '+panAnd(AFFIN[d.r]).toLowerCase()
    +' land 1.3 times as heavy.\n\n':'')
  +'Click to make this your blueprint. Shift-click to add it to the ones you '
  +'already picked.';
 b.setAttribute('aria-label',d.nm+', '+d.r+' cluster');
 b.innerHTML=svgI('<path d="'+d.ic+'"/>')
  +'<span class="rt" style="background:var(--c)"></span>';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+rootCol(d.r)+'">'+d.r+'</b>, '+d.nm+'. '+d.d;});
 b.addEventListener('mouseleave',capD);
 /* notYours, not toYou. On a worked example this press loaded the blank own
    profile under the person with nothing said. See personas.js. */
 b.addEventListener('click',function(e){if(notYours('change the blueprint domain'))return;
  if(e.shiftKey||!S.doms.length){var k=S.doms.indexOf(i);
   if(k>=0){if(S.doms.length>1)S.doms.splice(k,1);}else S.doms.push(i);}
  else S.doms=[i];
  buildSoul();S.pin=null;syncSoul();saveYou();render();});
 $('doms').appendChild(b);});
/* WHICH ROOT IS LIT. A blueprint domain belongs to exactly one root, so a
   selection already implies a root whether or not anybody clicked one. The row
   never said so, which is why a loaded profile showed four identical buttons.
   This is the derivation, and it is a pure read of S.doms. */
function rootsLit(){
 var out={};
 (S.doms||[]).forEach(function(i){var D=DOMAINS[i]; if(D)out[D.r]=true;});
 return out;}
ROOTD.forEach(function(rn){
 var b=document.createElement('button');b.type='button';b.dataset.r=rn;
 b.className='rootb';b.setAttribute('aria-pressed',false);
 /* THE MARK GOES ABOVE THE NAME, NOT INSTEAD OF IT. Four across in the rail
    leaves each chip about 62 wide and "Architect" takes 50 of that, so a mark
    beside the name does not fit, and a mark in place of it loses the only
    place on this surface the four roots are named. The svg carries no text,
    so the button's name is still the root's name. */
 b.innerHTML=svgI('<path d="'+ROOTGLYPH[rn]+'"/>')+'<span>'+rn+'</span>';
 /* the colour is a custom property so the three states in the sheet can each
    mix against it. it was an inline style, which meant the sheet could not
    reach it and every state had to be written back in script. */
 b.style.setProperty('--rc',rootCol(rn));
 var holds=DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ');
 b.title=rn+'. Holds '+holds+'. Running it makes '+panAnd(AFFIN[rn]||[]).toLowerCase()
  +' land 1.3 times as heavy. Filled means you added it. Pale means something you picked is already in it.';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+rootCol(rn)+'">'+rn+'</b> root domain. Holds '
   +holds+'.';});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(){if(notYours('change the root domain'))return;
  var k=S.roots.indexOf(rn);
  if(k>=0)S.roots.splice(k,1);else S.roots.push(rn);
  buildSoul();S.pin=null;syncSoul();saveYou();render();});
 $('roots').appendChild(b);});
/* What the two states mean, in the rail, once. A legend is cheaper than a
   person guessing, and there is nowhere else on this row to put it. */
(function(){
 var r=$('roots'); if(!r||!r.parentNode)return;
 var d=document.createElement('div'); d.className='rootlegend'; d.id='rootlegend';
 r.parentNode.insertBefore(d,r.nextSibling);})();
function capD(){
 $('capD').innerHTML=S.doms.map(function(i){
  return '<b style="color:'+rootCol(DOMAINS[i].r)+'">'+DOMAINS[i].nm+'</b>';}).join(' + ')
  +(S.roots.length?'<br>plus all of '+S.roots.join(', '):'');}
[['ar1','a1'],['ar2','a2']].forEach(function(pair){
 ARCH.forEach(function(a,i){
  var b=document.createElement('button');b.className='ib';b.type='button';
  /* EACH ARCHETYPE WEARS ITS SEAT, which was ruled 19 September and reached
     the reading rows and never these tiles: every one of the twelve was
     painted the one accent, so the grid showed twelve different things in
     one colour and Primary read flat on every option the board tried.
     Carried here on the 26 September ruling of the same board. */
  b.style.setProperty('--c',icCol(a.b));
  b.title=a.nm+', '+a.v+'. Shift-click to add.';b.setAttribute('aria-label',a.nm);
  b.innerHTML=svgI('<path d="'+a.ic+'"/>');
  b.addEventListener('mouseenter',function(){$('capA').innerHTML='<b>'+a.nm+'</b>, '+a.v;});
  b.addEventListener('mouseleave',capA);
  b.addEventListener('click',function(e){if(notYours('change the archetype'))return;
   var k=S.arcs.indexOf(i);
   if(e.shiftKey){if(k>=0){if(S.arcs.length>1)S.arcs.splice(k,1);}else S.arcs.push(i);}
   else if(pair[1]==='a1'){S.arcs=[i].concat(S.arcs.filter(function(x){return x!==i;}).slice(0,3));}
   else {S.arcs=[S.arcs[0]].concat([i]).concat(S.arcs.slice(1).filter(function(x){return x!==i;}).slice(0,2));}
   buildSoul();S.pin=null;syncSoul();saveYou();render();});
  $(pair[0]).appendChild(b);});});
function capA(){$('capA').innerHTML=S.arcs.map(function(i){
 return '<b>'+ARCH[i].nm+'</b>';}).join(' + ');}
/* ============================================================
   THE RAGGED TAIL IN THE LEFT RAIL, AND WHAT IT WAS COSTING.

   Ruled: "the left hand menu with the icons, can you optimise that space a
   bit, there is a gap." Measured first, on the Field with a profile loaded.
   The rail's panel is 302 wide at 1600 and 18 of padding either side, so the
   grids get 266. They pack at repeat(auto-fill,minmax(44px,1fr)) and land on
   five columns of 48. The twelve archetypes fill five, five and two, so the
   last row leaves three cells empty, 162 wide by 48 tall, and it happens
   twice: once under Primary and again under Secondary with sixteen pixels of
   label between them. That is the gap, and it is two of them close enough
   together to read as one. The nineteen blueprint domains fill five, five,
   five and four and leave one, 54 by 48. At 390 the rail gets 346, the same
   rule packs seven columns of 44.3, which is the tap floor exactly, and
   every grid leaves two empty.

   auto-fill takes as many columns as fit, which takes as few rows as
   possible, and that is the right rule when the item count is unknown. These
   counts are not unknown: DOMAINS and ARCH are data tables this file reads
   two functions above.

   THE RULE. Take the most columns that fit at the tap floor, take the rows
   that implies, then take the FEWEST columns that still fit in that many
   rows. n = ceil(count / ceil(count / nFit)). And the number of columns is
   arithmetic on the real length of the real table rather than a count typed
   into a stylesheet, which is the defect this repository has been bitten by
   nine times.

   AND THE ROW HEIGHT HAS TO BE PINNED OR THE FIX COSTS MORE THAN THE GAP.
   Measured, and it is the reason this function writes two properties instead
   of one. `.ib` is aspect-ratio 1, so a cell's height is its width. Dropping
   the archetypes from five columns to four widened every cell from 48 to
   61.5 and made every cell 61.5 TALL with it: each grid went 156 to 196.5
   and the rail's scroll height went 2094 to 2175. That is eighty one pixels
   of new scroll bought to close a hole, which is not optimising the space,
   it is moving it.

   So the row is set to the square cell the sheet's own auto-fill would have
   produced at this width, which is the height the grid has today. With both
   axes definite the aspect ratio has nothing left to decide and the cell
   becomes a rectangle. Same height to the pixel, flush right edge, and a
   wider tap target than before. Strict improvement or no-op, at every width.

   The sheet keeps auto-fill as its declared value, because this runs after
   layout and a grid has to be right before it does.

   AND THEN THE ROW CAME DOWN TO THE FLOOR. The owner, 26 September: "make
   them a little bit smaller so that they don't eat up so much real estate.
   Since they're hover over anyway to get information... that way we get more
   of the icons above the fold." Measured at 1600 with a profile loaded, the
   second archetype grid ended at 1024 on a 1000 tall screen, so the last row
   of the rail's icons was below the fold on the owner's own width. The row
   was the square cell, 48.4 at 1600, and the only floor on it is the tap
   target, so the row is the tap target now: 44, read off --tap like the
   column floor above. The columns do not move, because the width is already
   at the floor on one axis or the other: six across in 266 would be 39 wide.
   Every cell stays at least 44 by 44, the hover and the caption are
   untouched, and the rail gets 54 pixels back at 1600 with the tighter row
   gap in the sheet. At 390 the cell was already 44.3 and barely moves.
   ============================================================ */
function fitGrid(el){
 if(!el)return;
 var n=el.children.length; if(!n)return;
 /* hidden on Settings, where the columns are display:none. A width of nought
    would compute one column and write it, and coming back would find the
    rail a single file. Leave the sheet's own fit standing instead. */
 var w=el.clientWidth; if(w<1)return;
 var cs=getComputedStyle(el);
 var gap=parseFloat(cs.columnGap)||0;
 /* the floor is read off the custom property, not restated here. It is one
    value and the sheet owns it. */
 var tap=parseFloat(getComputedStyle(document.documentElement)
   .getPropertyValue('--tap'))||44;
 var nFit=Math.max(1,Math.floor((w+gap)/(tap+gap)));
 var cols=Math.min(n,Math.ceil(n/Math.ceil(n/nFit)));
 var rowH=tap;
 var sig=n+'/'+cols+'/'+rowH.toFixed(2);
 if(el.dataset.fit===sig)return;
 el.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
 el.style.gridAutoRows=rowH.toFixed(2)+'px';
 el.dataset.fit=sig;}
/* by class, never by a list of ids. A fourth icon grid added to the rail is
   covered by the sheet it already wears, which is the rule this project
   keeps everywhere else: look a thing up by what it is. */
function fitGrids(){
 document.querySelectorAll('.g6,.gdom').forEach(fitGrid);}
(function(){
 addEventListener('resize',fitGrids);
 /* measured after layout and not during it, the same way paintTabEdge learned
    to. Called straight after the buttons are appended it reads the grid at a
    width the rail has not settled on yet. */
 addEventListener('load',fitGrids);
 if(typeof requestAnimationFrame==='function')
  requestAnimationFrame(function(){requestAnimationFrame(fitGrids);});})();
function syncSoul(){
 $('doms').querySelectorAll('.ib').forEach(function(x,j){
  x.setAttribute('aria-pressed',j===S.doms[0]);
  if(S.doms.indexOf(j)>0)x.dataset.r='2';else delete x.dataset.r;});
 $('ar1').querySelectorAll('.ib').forEach(function(b,i){
  b.setAttribute('aria-pressed',i===S.arcs[0]);
  if(S.arcs.indexOf(i)>0)b.dataset.r='2';else delete b.dataset.r;});
 $('ar2').querySelectorAll('.ib').forEach(function(b,i){
  b.setAttribute('aria-pressed',false);
  if(S.arcs.indexOf(i)>=1)b.dataset.r='2';else delete b.dataset.r;});
 var lit=rootsLit(), nlit=0;
 $('roots').querySelectorAll('button').forEach(function(b){
  var on=S.roots.indexOf(b.dataset.r)>=0;
  b.setAttribute('aria-pressed',on);
  /* added wins over lit, because a fill and a wash on one control is noise */
  if(!on&&lit[b.dataset.r]){b.dataset.lit='1';nlit++;}else delete b.dataset.lit;});
 var lg=$('rootlegend');
 if(lg)lg.textContent=(S.roots.length?'filled, you added':'')
  +(S.roots.length&&nlit?' \u00b7 ':'')
  +(nlit?'pale, something you picked is in here':'');
 /* HS sweep: with nothing added and nothing pale this printed "click a root
    to add every domain under it", a how to line under a row of buttons. The
    legend now speaks only when there is a state on the row to key. */
 capD();capA();}
function rebuildSwatches(){
 /* every colour the rail's grids wear is per lighting now, so all three move
    here. The domains alone did before, and they moved to the same value. */
 $('doms').querySelectorAll('.ib').forEach(function(b,i){b.style.setProperty('--c',rootCol(DOMAINS[i].r));});
 $('roots').querySelectorAll('.rootb').forEach(function(b){b.style.setProperty('--rc',rootCol(b.dataset.r));});
 ['ar1','ar2'].forEach(function(id){
  $(id).querySelectorAll('.ib').forEach(function(b,i){b.style.setProperty('--c',icCol(ARCH[i].b));});});
 CHILD.forEach(function(cf){
  var i=CHF[cf.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(cf.seat);});
 SI.forEach(function(l){
  var i=LWF[l.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(l.b);});
 /* the matrix's own key is written once at boot and again only when the
    pointer leaves the matrix, so its four root swatches kept the lighting
    the page opened on until somebody happened to hover it. */
 syncMx();mxKey();}

/* ============================================================
   DENSITY, PROFILE AND HELP. Three controls the product has
   never had, and the reason it needed them is the owner's own
   finding: the whole interface reads better scaled down, which
   is a statement about this product rather than about a monitor.

   Density is three steps, not a slider, because three is a
   choice and a slider is a chore. It scales one variable that
   everything else derives from, so nothing has to be restyled.

   The sheet is one surface. Both buttons open it, the backdrop
   and escape close it, and it is the same object on a phone
   where it comes up from the bottom instead of the side.
   ============================================================ */
const DENS=[['tight','Tight','more on screen, smaller type'],
 ['','Comfortable','what the reading was designed at'],
 ['wide','Wide','fewer things, larger type']];
function densGet(){try{return STORE.get('dens')||'';}catch(e){return '';}}
function densSet(k){
 document.body.classList.remove('dens-tight','dens-wide');
 if(k)document.body.classList.add('dens-'+k);
 try{STORE.set('dens',k);}catch(e){}
 densPaint();
 /* the wheel takes its size from the box, so it has to be told */
 if(typeof reframe==='function'){reframe();}
 if(typeof render==='function')render();}
/* The strip in the top bar is gone. This stays because the profile sheet and
   the boot sequence both call it, and it does nothing when there is no host. */
function densPaint(){
 var host=$('density'); if(!host)return;
 var now=densGet();
 host.innerHTML=DENS.map(function(d){
  return '<button type="button" class="vt'+(d[0]===now?' on':'')+'" data-dens="'+d[0]+'" '
   +'aria-pressed="'+(d[0]===now)+'" title="'+esc(d[2])+'">'+esc(d[1].slice(0,1))+'</button>';}).join('');
 host.querySelectorAll('[data-dens]').forEach(function(b){
  b.onclick=function(){densSet(b.getAttribute('data-dens'));};});}

/* ---- the sheet ---- */
function sheetOpen(html){
 var s=$('sheet'), c=$('sheet-card'); if(!s||!c)return;
 c.innerHTML=html; s.hidden=false;
 var f=c.querySelector('button,a,input,select'); if(f)f.focus();}
function sheetShut(){var s=$('sheet'); if(s)s.hidden=true;}

/* ============================================================
   SETTINGS, IN THE CENTRE.

   It was a sheet over the top of whatever a person was reading, which is the
   right shape for a confirmation and the wrong one for a place you go to
   change something and then look at what changed. A modal has to be
   dismissed before the instrument is visible again, so every setting was
   changed with the product hidden behind it.

   Same content, same setters, one surface. The sections are the same four
   the sheet had, laid in columns because the centre has width the sheet
   never did.
   ============================================================ */
/* renderSettings is gone. The account area replaced it, in ui/account.js, on
   the owner's ruling that the profile page is non-standard and should be a
   standard one. planSection and planWire stay here and are called from there,
   ported rather than rebuilt. */

/* ============================================================
   THE RECORD IMPORT, AND THE DOOR IT DID NOT HAVE.

   This markup and this wiring were written inside profileSheet, and nothing in
   the app opens profileSheet. Measured in the built product: the token
   profileSheet appears twice in source.html, the definition and one call inside
   itself to re-render after a density change, and its host is not in the
   document after boot. So the paste box and the file picker existed, were
   correct, went through the atomic boundary, and could not be reached from any
   tab. A person finished the web reading, saved a real record, and had nowhere
   in the product to put it.

   Lifted out unchanged rather than rebuilt, so there is one importer and one
   set of failure messages, and it takes an id prefix because the two hosts that
   draw it can both be in the document. The account area is the second caller,
   because Export and Delete already live there and load is the third control of
   that set: a person looking for what to do with a record file looks where the
   other two record controls are.

   The boundary is untouched. pImport is atomic, nothing is pushed and CURP does
   not move until the profile has validated, loaded and saved, and a refusal
   names the field and leaves what was there alone.
   ============================================================ */
function recordImportHtml(p){
 p=p||'sh';
 return '<div class="sh-imp">'
  +'<p class="sh-p">Took the reading on the web? Load the record you saved and it '
  +'continues from there. Nothing is fetched: the file is the handoff.</p>'
  +'<textarea id="'+p+'imp" class="sh-ta" rows="3" spellcheck="false" '
  +'placeholder="Paste the record, or choose the file"></textarea>'
  +'<div class="sh-act">'
   +'<button class="btn" id="'+p+'impf">Choose a file</button>'
   +'<button class="btn pri" id="'+p+'impgo">Load it</button>'
  +'</div>'
  +'<p class="sh-p sh-impmsg" id="'+p+'impmsg"></p>'
  +'<input type="file" id="'+p+'impfile" accept="application/json,.json" hidden>'
  +'</div>';}
/* THE IMPORT, WIRED. Every write that can fail reports rather than claiming
   success, which is the standing rule in this product. `after` is called only on
   a load that landed, so a host that draws the record's own name can redraw it
   without having to guess whether anything happened. */
function recordImportWire(p,after){
 p=p||'sh';
 var impSay=function(t,bad){var m=$(p+'impmsg'); if(!m)return;
  m.textContent=t; m.className='sh-p sh-impmsg'+(bad?' bad':' ok');};
 var impRun=function(txt){
  if(!txt||!txt.trim()){impSay('Nothing to load yet.',1);return;}
  var np=pImport(txt);
  if(!np){ var e=(typeof importError==='function'&&importError())||['it was refused'];
   impSay('Not loaded. '+e.join('. ')+'.',1); return; }
  if(typeof syncCh==='function')syncCh();
  if(typeof syncLw==='function')syncLw();
  if(typeof syncSoul==='function')syncSoul();
  if(typeof render==='function')render();
  if(typeof status==='function')status('Record loaded.');
  /* THE HOST REDRAWS FIRST AND THE MESSAGE IS WRITTEN AFTER IT.
     The account area prints the record's own name, so it has to redraw on a
     load, and redrawing replaces the paragraph this function had just written.
     Measured: the gate read an empty message on a load that had landed, which
     is the report vanishing at the moment it is true. So the redraw happens
     first and the message goes onto whatever element is on the screen when it
     is read, which is what impSay does by looking the id up at call time. */
  if(typeof after==='function')after(np);
  impSay('Loaded '+(np.name||'the record')+'. Nothing else was touched.');};
 var ig;
 if((ig=$(p+'impgo')))ig.onclick=function(){impRun(($(p+'imp')||{}).value||'');};
 if((ig=$(p+'impf')))ig.onclick=function(){var f=$(p+'impfile'); if(f)f.click();};
 if((ig=$(p+'impfile')))ig.onchange=function(){
  var f=ig.files&&ig.files[0]; if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){var t=$(p+'imp'); if(t)t.value=String(rd.result||'');
   impRun(String(rd.result||''));};
  rd.onerror=function(){impSay('That file could not be read.',1);};
  rd.readAsText(f);};}
function profileSheet(){
 var r=compute(), m=(typeof meterRead==='function')?meterRead(CURP):null;
 var who=(CURP&&CURP.name)||'You';
 var h='<div class="pm-eye">Profile</div><p class="sh-h plain">'+esc(who)+'</p>'
  +'<div class="sh-sec"><div class="pm-eye">This reading</div>'
  /* "of 100" made the headline reading a score, which is the one thing a
     reading may never be. The comment six lines down struck "of 112" for
     exactly this and left the number it was actually about. The scale belongs
     in the label, where Analytics already puts it, and the figure stands as a
     figure. */
  +'<div class="sh-row"><span>Coherence, 0 to 100</span><b>'
   +(r.unread?'not read yet':String(Math.round(r.CQ)))+'</b></div>'
  +'<div class="sh-row"><span>Tier</span><b'
  +(r.unread?'':' style="color:'+(TIERCOL[r.tier]||'var(--ink)')+'"')+'>'
  +esc(r.unread?'not read yet':tierSay(r))+'</b></div>'
  /* "of 112" was a count against a total, which is the one thing a reading
     may never be. The number of addresses carrying is the fact. */
  +'<div class="sh-row"><span>Addresses carrying</span><b>'+r.loaded.length+'</b></div>'
  +(m?'<div class="sh-row"><span>Ground opened</span><b>'+m.unique+'</b></div>':'')
  +(m&&m.next?'<div class="sh-row"><span>Next marker</span><b>'+esc(m.next.nm)+', '+m.next.left+' away</b></div>':'')
  +'</div>'
  +planSection(m)
  +'<div class="sh-sec"><div class="pm-eye">Screen</div>'
  +'<p class="sh-p">How much fits on one screen. This scales the whole interface, not just the type.</p>'
  +'<div class="dens-list" id="densheet" style="margin-top:8px"></div></div>'
  +'<div class="sh-sec"><div class="pm-eye">Your record</div>'
  +'<p class="sh-p">Everything is held in this browser. Nothing has left this device.</p>'
  +'<div class="sh-row"><span>Snapshots on file</span><b>'+((CURP&&CURP.history&&CURP.history.length)||0)+'</b></div>'
  +'<div class="sh-row"><span>Storage</span><b>'+(STORE_BOUND?'writing':'blocked')+'</b></div>'
  /* THE BOUNDARY GETS ITS FIRST CALLER. validateProfile and pImport were built
     and CLAUDE.md said so: there is no import control in the UI, so the
     boundary's first real caller will be the record fetch at sign in. The web
     reading is that caller, and it arrives without a server, because a person
     carries their own record out of the quiz as a file and loads it here.

     pImport is atomic. Nothing is pushed and CURP does not move until the
     profile has validated, loaded and saved, and a failure restores what was
     there and says why. So this can be a paste box without being a way to
     destroy a profile by pasting the wrong thing. */
  +recordImportHtml('sh')
  +'</div>'
  +'<div class="sh-sec"><div class="pm-eye">Who you are becoming</div>'
  +'<p class="sh-p">The avatar, the purpose map and the boundary. What the release work is '
  +'aimed at.</p>'
  +'<div class="sh-act"><button class="btn" id="shav">Open the avatar</button></div></div>'
  +'<div class="sh-sec"><button class="btn" id="shclose">Close</button></div>';
 sheetOpen(h);
 /* the same three steps, inside the sheet, sharing one setter */
 /* the importer under this sheet's own ids. Its wiring and its failure wording
    live with the function, which the account area draws as well. */
 recordImportWire('sh');
 var d=$('densheet'), now=densGet();
 if(d){d.innerHTML=DENS.map(function(x){
   return '<button type="button" class="dens-opt'+(x[0]===now?' on':'')+'" data-dens2="'+x[0]+'" '
    +'aria-pressed="'+(x[0]===now)+'"><b>'+esc(x[1])+'</b><em>'+esc(x[2])+'</em></button>';}).join('');
  d.querySelectorAll('[data-dens2]').forEach(function(b){
   b.onclick=function(){densSet(b.getAttribute('data-dens2')); profileSheet();};});}
 planWire();
 var av=$('shav'); if(av)av.onclick=function(){sheetShut();runAvatarDrill();};
 var c=$('shclose'); if(c)c.onclick=sheetShut;}

/* ============================================================
   THE PLAN, on the person's own screen.

   Three facts and two controls, and the controls are the only
   place in this product that will ever touch a network besides
   the record fetch. Nothing here knows what a processor is: it
   reads the plan off the record and calls one host function.

   Rule three governs the controls. A control must never claim
   success before it has it, so while nothing is bound they say so
   through status() rather than opening a dead page or pretending.
   ============================================================ */
/* o.brief, from Billing, where the tiers group in ui/plans.js sits directly
   below and carries what is on every tier, the next rung and a press on every
   rung. Said twice on one pane is the same fact in two places, one edit away
   from two answers, so brief drops those four and keeps the state and Manage
   billing. The sheet, and the gate that reads it, keep the full form. */
function planSection(m,o){
 o=o||{};
 var pl=(CURP&&CURP.plan)||null;
 var t=planOf(pl), st=planState(pl);
 /* through meterBudget, the one read the release panel uses, because the free
    weeks count from when the gift ran out and only the record knows that. A
    second read here quoted a different number from the panel that charges it. */
 var al=(CURP&&meterBudget(CURP).allow)||planAllowance(pl,(m&&m.unique)||0);
 var up=planUpgrade(pl);
 /* the record goes in with the tier: planYear says nothing unless the record
    is paid by the year, and printed "Paid for the year." to monthly payers
    while it read the tier alone */
 var yr=planYear(t.k,pl);
 var h='<div class="sh-sec"><div class="pm-eye">Your plan</div>'
  +'<div class="sh-row"><span>On</span><b>'+esc(t.nm)+'</b></div>'
  +(st==='pending'
    ? '<div class="sh-row"><span>State</span><b>not confirmed</b></div>'
    : (st==='ended'?'<div class="sh-row"><span>State</span><b>ended</b></div>':''))
  +'<div class="sh-row"><span>New ground</span><b>'+esc(al.say)+'</b></div>'
  /* WHAT THE PLAN SHOWS, off SIGHT (engine/plan.js). It said everything while
     sight was not for sale, ruled back on 1 October. */
  +'<div class="sh-row"><span>You can see</span><b>'+esc(planSightSay(pl))+'</b></div>'
  /* "RERUNNING ANYTHING ALREADY OPEN COSTS NOTHING, ALWAYS" CAME OFF, round
     NW, 22.K17. This is the plan sheet, read while deciding what a tier
     buys, and the claim was false: measured, a release at an address
     already open spends the same allowance as new ground, or plans nothing
     at all once every line is open. The rerun route that makes it true is
     the Lines pair on the release panel (relMode, ui/release.js), and this
     sheet already says it once in PLAN_ALWAYS below, "rerunning anything
     already open", so the second wording is not put back. */
  +'<p class="sh-p">'+esc(t.d)+'</p>'
  /* what is on every tier, and the next rung's sight is in up.say below */
  +(o.brief?'':'<p class="sh-p dim">On every tier including free: '+esc(PLAN_ALWAYS.join(', '))+'.</p>');
 if(o.brief)up=null;
 if(yr)h+='<p class="sh-p">'+esc(yr.say)+'</p>';
 if(up)h+='<p class="sh-p">'+esc(up.to.nm)+' is '+esc(up.say)+'.</p>';
 /* WHAT IT IS WORTH, in the unit people already price against. Throughput and
    never outcome, at the conservative end of the book's own range. */
 var worth=o.brief?'':planWorth(al.inGift?GIFT_N:t.grant);
 if(worth)h+='<p class="sh-p">'+esc(worth)+'</p>';
 h+='<div class="sh-act">'
  +(up?'<button class="btn pri" id="planup" data-tier="'+esc(up.to.k)+'">Move to '
    +esc(up.to.nm.toLowerCase())+'</button>':'')
  +'<button class="btn" id="planman">Manage billing</button></div>'
  /* WHAT THE BUTTON OPENS, said before it is pressed. Manage billing used to
     answer "not built yet" on a press, so the line beside it only said where
     payment was not. It opens Stripe's own page now, through authPlanPortal,
     and a person deciding whether to press it is told what is on the other
     side.

     "CHANGE TIER" WAS LEFT OFF FOR ONE ROUND, while the server's webhook
     heard checkout.session.completed and nothing else, so a tier changed on
     Stripe's page would have billed the new price while the plan here stayed
     put. The webhook hears customer.subscription.updated now and reads the
     tier back off the price (reboot-os stripe.js syncSubscription), and
     ui/auth.js reads the plan back onto this record, so all three are named.
     STRIPE-SETUP.md switches plan changes on in the portal for the same
     reason. */
  +'<p class="sh-p dim">Manage billing opens the payment page, where you can change tier, '
  +'replace a card or stop. Nothing about a card is ever held on this device, and the record '
  +'carries no customer number.</p>'
  +'</div>';
 return h;}
/* THE SEAM. Two host functions and nothing else. A build with no store bound
   has nowhere to send anybody, and says so rather than opening a dead page. */
function planWire(){
 var up=$('planup'), man=$('planman');
 if(up)up.onclick=function(){planOpen('checkout',up.getAttribute('data-tier'));};
 if(man)man.onclick=function(){planOpen('portal',null);};}
function planOpen(what,tier){
 /* The record store is the only thing that can mint a session, because a
    session needs a key and a key never comes near this file. When there is no
    store, this is not an error and not a silent no: it is a statement of where
    the product currently is. */
 if(typeof PLAN_HOST!=='function'){
  status('Billing is not connected yet. The plan is read from your record, and '
   +'the page that changes it lives behind sign in.','fail');
  return;}
 try{ PLAN_HOST(what,tier); }
 catch(e){ status('Could not open the billing page. Nothing has changed.','fail'); }}
/* bound by the host the same way storage is, so the engine and this file both
   stay ignorant of what is on the other side */
var PLAN_HOST=null;
function bindPlan(fn){ PLAN_HOST=(typeof fn==='function')?fn:null; return !!PLAN_HOST; }

function helpSheet(){
 var h='<div class="pm-eye">Help</div><p class="sh-h">How to read this</p>'
  +'<div class="sh-sec"><div class="pm-eye">The three things on screen</div>'
  +'<p class="sh-p">The wheel is your field. The rail on the left is what you are made of, '
  +'the panel on the right is what the instrument reads. Everything on either side is a door '
  +'into the same detail.</p></div>'
  +'<div class="sh-sec"><div class="pm-eye">The wheel</div>'
  +'<div class="sh-row"><span>Move in and out</span><b>scroll</b></div>'
  +'<div class="sh-row"><span>Move the frame</span><b>click and drag</b></div>'
  +'<div class="sh-row"><span>Put it back</span><b>double click, or F</b></div>'
  +'<div class="sh-row"><span>Open an address</span><b>click it</b></div>'
  +'<div class="sh-row"><span>Set a charge</span><b>drag it, on a mouse</b></div>'
  +'</div>'
  +'<div class="sh-sec"><div class="pm-eye">Reading</div>'
  /* PASS 1 FIRST. This said CQ was "what the field builds against what it
     costs", which stopped being true on 25 September when CQ became the 21
     laws summed. And "hover" is not a thing a phone can do: the tooltip
     opens on a pointer resting or a finger held. */
  +'<p class="sh-p">CQ is your coherence number: how closely you keep the 21 laws, added up. '
  +'DQ is the shadow weight: all the charge you are carrying. SQ is how deep that charge sits. '
  +'Pole is how much of each opposite is installed. Rest the pointer on any of them, or hold a '
  +'finger on it, for more.</p></div>'
  +'<div class="sh-sec"><div class="pm-eye">What it does not claim</div>'
  /* THE DANGLING REFERENCE THE SWEEP LEFT. This said "every reading carries
     an interval" and then told a person to compare a move against it. Once
     the figures came off the corner, the Analytics tab and the glance tile,
     the word interval named nothing on any screen, so the sentence sent
     somebody looking for a thing that is no longer drawn. The claim under
     "what it does not claim" is the honest half and it survives in words. */
  +'<p class="sh-p">Every reading has play in it. A small move is noise, and the '
  +'instrument says so instead of flattering you.</p></div>'
  +'<div class="sh-sec"><button class="btn" id="shclose2">Close</button></div>';
 sheetOpen(h);
 var c=$('shclose2'); if(c)c.onclick=sheetShut;}

/* wiring, once the shell exists */
(function(){
 /* the profile button opens a menu of the account sections, round OI, and its
    Settings row opens the Settings surface in the centre. The sheet
    version is kept as a function and no longer wired to anything, because it
    is the thing that was replaced and deleting it in the same pass as
    rewiring hides which of the two changed something. */
 var pb=$('profbtn'); if(pb)pb.onclick=function(){if(typeof profMenu==='function')profMenu(); else setTab(TAB.SETTINGS);};
 /* help's circle left the bar for the search on KC; helpSheet opens from its
    row on the profile page, ui/account.js, which round JZ asked for */
 var sh=$('sheet');
 if(sh)sh.addEventListener('click',function(e){if(e.target===sh)sheetShut();});
 addEventListener('keydown',function(e){if(e.key==='Escape')sheetShut();});
 /* the stored choice has to be on the body before the first paint measures it */
 var k=densGet(); if(k)document.body.classList.add('dens-'+k);
 densPaint();})();

/* ---- UNDO ----
   The control names what it will take back and disappears when there is
   nothing to take back, because a permanently disabled button is furniture
   and a button labelled only "undo" makes a person guess. */
/* ---- THE BOOT CLEARS ITSELF ----

   The fade is CSS and the removal is not: an element at opacity 0 still
   covers the app, still takes pointer events, and is still in the tab order,
   so a boot that only animates out is a transparent sheet over a working
   instrument. It is taken out of the document when it is done.

   Reduced motion has no animation to end on, so that case is handled by the
   timer rather than by the event. The timer is the floor in every case, so a
   dropped animationend never leaves the sheet up. */
/* when the floor below will remove the sheet, on the page's own clock,
   published for design gate 11, which holds it to the sheet's own fade */
var BOOT_FLOOR_AT=0;
(function(){
 var el=document.getElementById('boot');
 if(!el){ if(typeof enterLift==='function')enterLift(); return; }
 var gone=false, lifted=false;
 /* THE SHEET HAS STARTED TO LIFT, so the Field underneath starts arriving,
    ui/wheel.js. Once, whichever way the lift began: the sheet's own fade, a
    press, the floor, or reduced motion clearing it at once. */
 function lift(){ if(lifted)return; lifted=true;
  if(typeof enterLift==='function')enterLift(); }
 function clear(){ if(gone)return; gone=true; lift();
  if(el.parentNode)el.parentNode.removeChild(el);
  document.body.classList.add('booted'); }
 /* animationstart fires when the fade's delay is over, which is the first
    frame the sheet is anything less than solid */
 el.addEventListener('animationstart',function(e){
  if(e.target===el&&e.animationName==='bootOut')lift();});
 el.addEventListener('animationend',function(e){
  if(e.target===el&&e.animationName==='bootOut')clear();});
 /* THE FLOOR IS READ OFF THE SHEET'S OWN FADE, NOT TYPED HERE.
    It was a typed 5450 while shell/head.html set the fade to begin at 7.02s,
    so the floor cut the sheet 1.57 seconds before its fade could start and
    the fade never once played (ET, EZ in TASKS.md). Two copies of one number
    in two files is how that happened, so there is one copy now: the end of
    bootOut as the browser computed it, --hold included, less the time it has
    already run, and the floor sits a fifth of a second past that. A dropped
    animationend still never leaves the sheet standing. 5450 survives only as
    the fallback for a browser with no getAnimations.

    Read again once the animation has actually started. At the moment this
    runs the sheet's animations can still be pending, with no start time, and
    a floor measured from here would sit late by however long the first frame
    took; ready is the promise that it has started, and the floor is set again
    from its real clock then. */
 var ft=0;
 function floor(ms){ clearTimeout(ft); BOOT_FLOOR_AT=performance.now()+ms; ft=setTimeout(clear,ms); }
 floor(5450);
 try{ var fade=el.getAnimations().filter(function(a){return a.animationName==='bootOut';})[0];
  if(fade){ var set=function(){ if(gone)return;
    /* the fade's end on the page's own clock. The document timeline and
       performance.now share an origin, and the timeline's time is the last
       frame's, which during a long script is well behind now, so the end is
       taken from the start time and not from the current time */
    var end=fade.effect.getComputedTiming().endTime;
    floor(Math.max(0,(fade.startTime!=null?fade.startTime+end-performance.now():end-(fade.currentTime||0)))+200); };
   set(); if(fade.pending&&fade.ready)fade.ready.then(set,function(){}); } }catch(e){}
 /* AND THERE IS A WAY OUT. Anything over 600ms needs one, and this is five
    seconds. It is the overture and it is worth watching, so it is not
    skipped automatically on a return visit and no flag is stored: a person
    who wants past it presses anything, and a person who wants to watch it
    watches it. */
 /* AND THE PRESS THAT SKIPS DOES NOT ALSO PRESS THE APP.

    .boot is pointer-events:none, so the sheet never took the press: it went
    through to whatever was under the cursor and this handler caught it on the
    way past. Pressing "go straight in" over the tab strip dismissed the boot
    and navigated to that tab, which is not what the line offers. Verified by
    clicking through the sheet onto Compass and landing on Compass.

    Taken in the capture phase and stopped there, so the first press does one
    thing. Nothing else changes: the sheet still clears itself with no script
    at all, which is the ruling this whole block exists to keep. */
 /* Stopping pointerdown is not enough, and the first version of this fix was
    wrong for that reason: click is a separate event and is dispatched whatever
    happened to the pointerdown that preceded it. Measured after that fix, a
    press over the Energetics tab still moved the surface from 2 to 5. The
    click that follows the skip is swallowed once, in capture, and only that
    one. */
 var eat=function(ev){ ev.stopPropagation(); if(ev.cancelable)ev.preventDefault(); };
 var skip=function(e){ if(gone)return;
  /* THE DEVELOPER BUTTON IS THE ONE PRESS IN THIS SHEET THAT MEANS SOMETHING
     OF ITS OWN, round MH and MI, ui/login.js. Read here rather than left to
     its own listener on the button: the capture below stops every pointerdown
     from reaching anything past this handler, on purpose, so a skip-press can
     never also act on the tab strip underneath the sheet, and a listener on
     the button itself would never see the same press. Set before that stop,
     so it is set whichever of pointerdown or keydown got it here. */
  if(e&&e.target&&e.target.id==='devskip'&&typeof DEV_SKIP!=='undefined')DEV_SKIP=true;
  if(e&&e.type==='pointerdown'){
   e.stopPropagation();
   addEventListener('click',eat,{once:true,capture:true});
   /* and if no click ever arrives, the listener does not sit there waiting to
      eat an unrelated one later. */
   setTimeout(function(){removeEventListener('click',eat,true);},700); }
  el.style.transition='opacity .18s cubic-bezier(.4,0,1,1)';
  el.style.opacity='0'; lift(); setTimeout(clear,190); };
 addEventListener('pointerdown',skip,{once:true,capture:true});
 addEventListener('keydown',skip,{once:true,capture:true});
 var rm=(typeof matchMedia==='function')&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(rm)clear();})();

/* the tab strip's fade is only honest while there is something past the
   edge, so it is measured rather than always on. */
function paintTabEdge(){
 var t=document.getElementById('tabbar'); if(!t)return;
 var more=t.scrollWidth-t.clientWidth-t.scrollLeft>2;
 t.setAttribute('data-end',more?'0':'1');}
(function(){
 var t=document.getElementById('tabbar');
 if(t)t.addEventListener('scroll',paintTabEdge);
 addEventListener('resize',paintTabEdge);
 /* measured after layout, not during it. Called straight after the tabs are
    appended it read the strip at its unconstrained width and reported there
    was nothing past the edge on a window where Summary was off it. */
 addEventListener('load',paintTabEdge);
 if(typeof requestAnimationFrame==='function')
  requestAnimationFrame(function(){requestAnimationFrame(paintTabEdge);});})();
function paintUndo(){
 var b=$('undobtn'), f=$('redobtn'), w=$('histpair');
 if(!b)return;
 var n=undoDepth(), what=undoPeek();
 var m=(typeof redoDepth==='function')?redoDepth():0;
 var fwd=(typeof redoPeek==='function')?redoPeek():null;
 b.hidden=(n===0);
 /* THE ARROW CARRIES IT, and the name goes where a name belongs. Ruled: just
    the arrows. What the step will take back is still written, on every
    repaint, as the accessible name and the tooltip, so a screen reader and a
    hover both get the sentence the label used to print. */
 if(n){ var ub='Back. Takes back '+what+'. '+n+' step'+(n===1?'':'s')+' available.';
  b.title=ub; b.setAttribute('aria-label',ub); }
 if(f){ f.hidden=(m===0);
  if(m){ var rb='Forward. Puts back '+fwd+'. '+m+' step'+(m===1?'':'s')+' forward.';
   f.title=rb; f.setAttribute('aria-label',rb); } }
 /* the pair only exists while there is history in either direction. Two
    permanently disabled arrows in the bar are furniture, which is the same
    reason the single control was hidden when the stack was empty. */
 if(w)w.hidden=(n===0&&m===0);}
(function(){
 /* one settle for both directions. The field changed underneath everything,
    so the whole surface repaints and the person is told what moved rather
    than left to spot it. */
 function settle(msg){
  syncCh(); if(typeof syncLw==='function')syncLw();
  if(typeof syncSoul==='function')syncSoul();
  saveYou(); if(typeof pSave==='function')pSave();
  render(); paintUndo(); status(msg,'ok');}
 var b=$('undobtn');
 if(b)b.onclick=function(){
  var u=undoPop();
  if(!u){paintUndo();return;}
  settle('Took back '+u.nm+'.'); if(typeof sfx==='function')sfx('undo');};
 var f=$('redobtn');
 if(f)f.onclick=function(){
  var u=(typeof redoPop==='function')?redoPop():null;
  if(!u){paintUndo();return;}
  settle('Put back '+u.nm+'.'); if(typeof sfx==='function')sfx('kept');};
 /* the usual chords, because a person who wants either one reaches for them */
 addEventListener('keydown',function(e){
  if(!(e.metaKey||e.ctrlKey))return;
  var k=e.key.toLowerCase();
  if(k!=='z'&&k!=='y')return;
  var t=e.target&&e.target.tagName;
  if(t==='INPUT'||t==='TEXTAREA')return;   /* let the field have its own */
  var fwd=(k==='y')||(k==='z'&&e.shiftKey);
  e.preventDefault();
  var el=$(fwd?'redobtn':'undobtn');
  if(el&&!el.hidden)el.onclick();});})();
