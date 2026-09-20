
/* ============================================================
   CONTROLS
   ============================================================ */
const $=function(id){return document.getElementById(id);};
/* svgI moved to component.js. It is a const, and a const reached for before
   its declaration throws at call time, which is a trap waiting for the first
   renderer that loads earlier than this file and wants an icon. */
function numField(host,name,band,store,key){
 const d=document.createElement('div');d.className='nf';
 const col=band?seatCol(band):'var(--gold)';
 d.innerHTML='<i style="background:'+col+'"></i><label>'+name+'</label>'
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
 CHF[cf.nm]=numField($('chg'),cf.nm,cf.seat,S.charge,cf.nm);
 RPF[cf.nm]=numField($('chg'),'toward '+cf.opp,'Heart',S.replace,cf.nm);
 RPF[cf.nm].inp.parentElement.classList.add('oppf');});
SI.forEach(function(l){LWF[l.nm]=numField($('laws'),l.nm,l.b,S.law,l.nm);});
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
    and the analytics folded into it are the two surfaces that print a reading,
    and both are rebuilt on entry, so what they hold while hidden is whatever
    was true for whoever was loaded last. Leaving it there means the document
    carries a coherence figure for a profile that is no longer selected, which
    anything reading the page finds, and the functional gate did: it swept the
    body on a cleared field and found two percentages nobody could see. They
    are emptied on the way out rather than left to go stale. */
 if(S.tab===TAB.SUMMARY&&i!==TAB.SUMMARY){
  var sb=$('sumbody'), ab=$('ana');
  if(sb)sb.innerHTML=''; if(ab)ab.innerHTML='';}
 S.tab=i; S.pin=null;
 var cvE=$('cv'), vb=$('vbar');
 TABDEF.forEach(function(T){
  var e=$(T.id); if(!e||T.id==='cv')return;
  e.classList.toggle('on',T.k===i);
  e.style.display=(T.k===i)?'flex':'none';});
 /* Settings has a host and no TABDEF entry, so it is shown and hidden here by
    hand. Everything in TABDEF is hidden by the loop above, which means going
    to Settings already clears every other surface and coming back from it
    already clears this one. */
 (function(){var sE=$('settings'); if(!sE)return;
  sE.classList.toggle('on',i===TAB.SETTINGS);
  sE.style.display=(i===TAB.SETTINGS)?'flex':'none';
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
 if(cvE) cvE.style.display=(i===TAB.FIELD)?'block':'none';
 if(vb) vb.style.display=(i===TAB.FIELD)?'flex':'none';
 /* Body's layer row lives in the sub bar now, not over the figure */
 var lb=$('lbar'), rb=$('rbar');
 if(lb) lb.style.display=(i===TAB.ENERGY)?'flex':'none';
 if(rb) rb.style.display=(i===TAB.ENERGY&&PMLAYER==='pain')?'flex':'none';
 TABDEF.forEach(function(T){document.body.classList.remove(T.cls);});
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
 /* THE FIELD ASSEMBLES ON ARRIVAL, once per arrival. Here rather than in the
    renderer, because the renderer runs sixty times a second and arriving is
    something that happens once. */
 if(i===TAB.FIELD&&typeof enterStart==='function')enterStart();
 document.body.classList.toggle('hassub',i===TAB.FIELD||i===TAB.ENERGY);
 ['probe','howto','key','tier','pol'].forEach(function(id){
  var e=$(id); if(e)e.style.display=(i===TAB.FIELD)?'':'none';});
 /* pressed state read off each button's own integer, never off its position
    in a list that could be a different length than TABDEF. */
 document.querySelectorAll('.tabtop').forEach(function(x){
  x.setAttribute('aria-pressed',+x.getAttribute('data-tabk')===i);});
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
  WANT[TAB.FIELD]={left:['soul'],right:['you']};
  WANT[TAB.COMPASS]={right:['you']};
  var w=WANT[i]; if(!w)return;
  SEC_SEEDED=SEC_SEEDED||{};
  if(SEC_SEEDED[i])return; SEC_SEEDED[i]=1;
  Object.keys(w).forEach(function(rail){
   w[rail].forEach(function(k){ if(OPENSEC[rail])OPENSEC[rail][k]=1; });});
  if(typeof paintSections==='function')paintSections();})();
 if(i===TAB.INTAKE)renderIntake();
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
 if(i===TAB.GAMES){ if(!GAME)GAME='lg'; gmRender(); } else lgStop();
 if(i===TAB.STORY)stRender();
 /* Summary carries Analytics, and reads last. */
 if(i===TAB.SUMMARY){sumRender(); anaRender();}
 /* THE COMPASS HAS A FRONT DOOR. It was three clicks deep: click one end of
    the cone marker on the Field stage, then a button inside the drill that
    opened. The owner looked for it and could not find it, which is the whole
    finding. It is a tab. coneOpen builds its own canvas and starts its own
    frame loop, so entering the tab opens it and leaving it stops the loop
    rather than leaving a requestAnimationFrame running behind another
    surface. */
 if(i===TAB.COMPASS)coneOpen(true); else if(CONE.open&&CONE.tab)coneClose();
 render(); paintSections();}
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
/* measured once the strip exists, and again whenever the window changes */
if(typeof paintTabEdge==='function')paintTabEdge();
const VICON=[
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/>',
 '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 5.2v2.6M7.2 15.4l2.2-1.3M16.8 15.4l-2.2-1.3"/>',
 '<circle cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.4"/>',
 '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3.6M12 18.4V22M2 12h3.6M18.4 12H22"/>'];
VIEWS.forEach(function(v,i){
 var b=document.createElement('button');b.className='vt';b.type='button';
 /* The how to block under the wheel is gone, so its text lives here, on the
    control it was describing. It reads v.how, declared in wheel.js, because
    wheel.js loads BEFORE this file. Reaching forward to HOWTO in ui.js threw
    at parse, which in a concatenated build takes down every module after it.
    MANIFEST order is the rule and this is what breaking it looks like. */
 b.setAttribute('aria-pressed',i===S.view);
 /* the definition first, then the detail. A person hovering a depth wants to
    know what it is before they want the four line description of it. */
 b.title=(v.tip?v.tip+'\n\n':'')+(v.how||v.layers);
 /* and the product's own tooltip as well as the native one, because a native
    title cannot be reached on a touch screen and these four words are the
    ones the owner could not read. */
 b.setAttribute('data-tip',v.tip||v.layers);
 /* THE NAME, HANDED OVER RATHER THAN GUESSED AT. The old panel looked for a
    `.tn` child and these buttons carry a `.n`, so it drew an empty bold and a
    horizontal rule with nothing above it on every one of them. The name is an
    attribute now, so nothing has to find it in the markup. */
 b.setAttribute('data-tip-t',v.nm);
 b.classList.add('kbjump');
 b.innerHTML=svgI(VICON[i])+'<span class="n">'+v.nm+'</span>';
 b.addEventListener('click',function(){S.view=i;S.pin=null;
  $('vbar').querySelectorAll('.vt').forEach(function(x,j){x.setAttribute('aria-pressed',j===i);});
  render();});
 $('vbar').appendChild(b);});
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
 var seg=$('themes');
 if(seg)seg.querySelectorAll('button').forEach(function(x,j){
  x.setAttribute('aria-pressed',LIGHTINGS[j]&&LIGHTINGS[j][0]===k);});
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
 $('themes').appendChild(b);});
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
 b.style.setProperty('--c',ROOTCOL[d.r]);
/* THE TOOLTIP SAYS WHAT THE THING IS AND WHAT PRESSING IT DOES. It said
    "Justice, Architect. <one line>. Shift-click to add." which names the thing
    and then jumps straight to a keyboard trick, with nothing in between about
    what a blueprint domain is or what selecting one changes. */
 b.title=d.nm+'. A blueprint domain, one of nineteen, under the '+d.r+' root.\n\n'
  +d.d+'\n\n'
  +'Affinity 1.3 on '+((AFFIN[d.r]||[]).join(', ')||'nothing')+', which means charge on '
  +'those axes weighs heavier here than elsewhere.\n\n'
  +'Click to make this the blueprint you run. Shift-click to add it alongside '
  +'the ones already selected.';
 b.setAttribute('aria-label',d.nm+', '+d.r+' cluster');
 b.innerHTML=svgI('<path d="'+d.ic+'"/>')
  +'<span class="rt" style="background:'+ROOTCOL[d.r]+'"></span>';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+ROOTCOL[d.r]+'">'+d.r+'</b>, '+d.nm+'. '+d.d;});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(e){toYou();
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
 b.className='rootb';b.textContent=rn;b.setAttribute('aria-pressed',false);
 /* the colour is a custom property so the three states in the sheet can each
    mix against it. it was an inline style, which meant the sheet could not
    reach it and every state had to be written back in script. */
 b.style.setProperty('--rc',ROOTCOL[rn]);
 var holds=DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ');
 b.title=rn+'. Holds '+holds+'. Affinity 1.3 on '+(AFFIN[rn]||[]).join(', ')
  +'. Filled means you added it. Washed means your selection is already in it.';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+ROOTCOL[rn]+'">'+rn+'</b> root domain. Holds '
   +holds+'.';});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(){toYou();var k=S.roots.indexOf(rn);
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
  return '<b style="color:'+ROOTCOL[DOMAINS[i].r]+'">'+DOMAINS[i].nm+'</b>';}).join(' + ')
  +(S.roots.length?'<br>plus all of '+S.roots.join(', '):'');}
[['ar1','a1'],['ar2','a2']].forEach(function(pair){
 ARCH.forEach(function(a,i){
  var b=document.createElement('button');b.className='ib';b.type='button';
  b.style.setProperty('--c','var(--gold)');
  b.title=a.nm+'. '+a.v+'. Shift-click to add.';b.setAttribute('aria-label',a.nm);
  b.innerHTML=svgI('<path d="'+a.ic+'"/>');
  b.addEventListener('mouseenter',function(){$('capA').innerHTML='<b>'+a.nm+'</b>, '+a.v;});
  b.addEventListener('mouseleave',capA);
  b.addEventListener('click',function(e){toYou();
   var k=S.arcs.indexOf(i);
   if(e.shiftKey){if(k>=0){if(S.arcs.length>1)S.arcs.splice(k,1);}else S.arcs.push(i);}
   else if(pair[1]==='a1'){S.arcs=[i].concat(S.arcs.filter(function(x){return x!==i;}).slice(0,3));}
   else {S.arcs=[S.arcs[0]].concat([i]).concat(S.arcs.slice(1).filter(function(x){return x!==i;}).slice(0,2));}
   buildSoul();S.pin=null;syncSoul();saveYou();render();});
  $(pair[0]).appendChild(b);});});
function capA(){$('capA').innerHTML=S.arcs.map(function(i){
 return '<b>'+ARCH[i].nm+'</b>';}).join(' + ');}
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
  +(nlit?'washed, your selection sits here':'')
  +(!S.roots.length&&!nlit?'click a root to add every domain under it':'');
 capD();capA();}
function rebuildSwatches(){
 $('doms').querySelectorAll('.ib').forEach(function(b,i){b.style.setProperty('--c',ROOTCOL[DOMAINS[i].r]);});
 CHILD.forEach(function(cf){
  var i=CHF[cf.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(cf.seat);});
 SI.forEach(function(l){
  var i=LWF[l.nm].inp.parentElement.querySelector('i');if(i)i.style.background=seatCol(l.b);});
 syncMx();}

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
  +esc(r.unread?'not read yet':r.tier)+'</b></div>'
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
  +'<div class="sh-imp">'
  +'<p class="sh-p">Took the reading on the web? Load the record you saved and it '
  +'continues from there. Nothing is fetched: the file is the handoff.</p>'
  +'<textarea id="shimp" class="sh-ta" rows="3" spellcheck="false" '
  +'placeholder="Paste the record, or choose the file"></textarea>'
  +'<div class="sh-act">'
   +'<button class="btn" id="shimpf">Choose a file</button>'
   +'<button class="btn pri" id="shimpgo">Load it</button>'
  +'</div>'
  +'<p class="sh-p sh-impmsg" id="shimpmsg"></p>'
  +'<input type="file" id="shimpfile" accept="application/json,.json" hidden>'
  +'</div>'
  +'</div>'
  +'<div class="sh-sec"><div class="pm-eye">Who you are becoming</div>'
  +'<p class="sh-p">The avatar, the purpose map and the boundary. What the release work is '
  +'aimed at.</p>'
  +'<div class="sh-act"><button class="btn" id="shav">Open the avatar</button></div></div>'
  +'<div class="sh-sec"><button class="btn" id="shclose">Close</button></div>';
 sheetOpen(h);
 /* the same three steps, inside the sheet, sharing one setter */
 /* THE IMPORT, WIRED. Every write that can fail reports rather than claiming
    success, which is the standing rule in this product. */
 var impSay=function(t,bad){var m=$('shimpmsg'); if(!m)return;
  m.textContent=t; m.className='sh-p sh-impmsg'+(bad?' bad':' ok');};
 var impRun=function(txt){
  if(!txt||!txt.trim()){impSay('Nothing to load yet.',1);return;}
  var np=pImport(txt);
  if(!np){ var e=(typeof importError==='function'&&importError())||['it was refused'];
   impSay('Not loaded. '+e.join('. ')+'.',1); return; }
  impSay('Loaded '+(np.name||'the record')+'. Nothing else was touched.');
  if(typeof syncCh==='function')syncCh();
  if(typeof render==='function')render();
  if(typeof status==='function')status('Record loaded.');};
 var ig;
 if((ig=$('shimpgo')))ig.onclick=function(){impRun(($('shimp')||{}).value||'');};
 if((ig=$('shimpf')))ig.onclick=function(){var f=$('shimpfile'); if(f)f.click();};
 if((ig=$('shimpfile')))ig.onchange=function(){
  var f=ig.files&&ig.files[0]; if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){var t=$('shimp'); if(t)t.value=String(rd.result||'');
   impRun(String(rd.result||''));};
  rd.onerror=function(){impSay('That file could not be read.',1);};
  rd.readAsText(f);};
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
function planSection(m){
 var pl=(CURP&&CURP.plan)||null;
 var t=planOf(pl), st=planState(pl);
 var al=planAllowance(pl,(m&&m.unique)||0);
 var up=planUpgrade(pl);
 var yr=planYear(t.k);
 var h='<div class="sh-sec"><div class="pm-eye">Your plan</div>'
  +'<div class="sh-row"><span>On</span><b>'+esc(t.nm)+'</b></div>'
  +(st==='pending'
    ? '<div class="sh-row"><span>State</span><b>not confirmed</b></div>'
    : (st==='ended'?'<div class="sh-row"><span>State</span><b>ended</b></div>':''))
  +'<div class="sh-row"><span>New ground</span><b>'+esc(al.say)+'</b></div>'
  +'<div class="sh-row"><span>You can see</span><b>everything</b></div>'
  +'<p class="sh-p">'+esc(t.d)+' Rerunning anything already open costs nothing, always.</p>'
  /* SIGHT IS NOT FOR SALE, ruled, so the panel says what is on every tier
     rather than what the next one would unlock. */
  +'<p class="sh-p dim">On every tier including free: '+esc(PLAN_ALWAYS.join(', '))+'.</p>';
 if(yr)h+='<p class="sh-p">'+esc(yr.say)+'</p>';
 if(up)h+='<p class="sh-p">'+esc(up.to.nm)+' is '+esc(up.say)+'.</p>';
 /* WHAT IT IS WORTH, in the unit people already price against. Throughput and
    never outcome, at the conservative end of the book's own range. */
 var worth=planWorth(al.inGift?100:t.grant);
 if(worth)h+='<p class="sh-p">'+esc(worth)+'</p>';
 h+='<div class="sh-act">'
  +(up?'<button class="btn pri" id="planup" data-tier="'+esc(up.to.k)+'">Move to '
    +esc(up.to.nm.toLowerCase())+'</button>':'')
  +'<button class="btn" id="planman">Manage billing</button></div>'
  +'<p class="sh-p dim">Payment is handled off this device. Nothing about a card is '
  +'ever held here, and the record carries no customer number.</p>'
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
  +'<p class="sh-p">CQ is coherence, 0 to 100, what the field builds against what it costs. '
  +'DQ is the shadow weight it is carrying. SQ is how deep that charge sits. Pole is how much '
  +'of the coherent opposite is installed. Hover any of them for the rest.</p></div>'
  +'<div class="sh-sec"><div class="pm-eye">What it does not claim</div>'
  +'<p class="sh-p">Every reading carries an interval. A move smaller than that interval is not '
  +'a reading, it is noise, and the instrument says so rather than flattering you.</p></div>'
  +'<div class="sh-sec"><button class="btn" id="shclose2">Close</button></div>';
 sheetOpen(h);
 var c=$('shclose2'); if(c)c.onclick=sheetShut;}

/* wiring, once the shell exists */
(function(){
 /* the profile button opens the Settings surface in the centre. The sheet
    version is kept as a function and no longer wired to anything, because it
    is the thing that was replaced and deleting it in the same pass as
    rewiring hides which of the two changed something. */
 var pb=$('profbtn'); if(pb)pb.onclick=function(){setTab(TAB.SETTINGS);};
 var hb=$('helpbtn'); if(hb)hb.onclick=helpSheet;
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
(function(){
 var el=document.getElementById('boot'); if(!el)return;
 var gone=false;
 function clear(){ if(gone)return; gone=true;
  if(el.parentNode)el.parentNode.removeChild(el);
  document.body.classList.add('booted'); }
 el.addEventListener('animationend',function(e){
  if(e.animationName==='bootOut')clear();});
 /* the floor. 5.26s is the end of the sequence now, five beats and the
    quicker fade included, and this sits just past it. A dropped animationend
    must never leave the sheet standing over a working instrument. */
 setTimeout(clear,5450);
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
  if(e&&e.type==='pointerdown'){
   e.stopPropagation();
   addEventListener('click',eat,{once:true,capture:true});
   /* and if no click ever arrives, the listener does not sit there waiting to
      eat an unrelated one later. */
   setTimeout(function(){removeEventListener('click',eat,true);},700); }
  el.style.transition='opacity .18s cubic-bezier(.4,0,1,1)';
  el.style.opacity='0'; setTimeout(clear,190); };
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
  settle('Took back '+u.nm+'.');};
 var f=$('redobtn');
 if(f)f.onclick=function(){
  var u=(typeof redoPop==='function')?redoPop():null;
  if(!u){paintUndo();return;}
  settle('Put back '+u.nm+'.');};
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
