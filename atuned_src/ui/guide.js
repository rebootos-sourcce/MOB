/* ============================================================
   SCREEN GUIDES, 21 November. His words: "we need a pop-up tutorial for
   each screen that the user can deactivate, but it explains what everything
   does on the screen. For each of the modules."

   NOT THE ARRIVE SHEET, AND NOT A RETURN OF IT. On 18 November he retired
   the mandatory first run sequence: "once you get past the initial attuned
   intro, it goes straight to your dashboard... we're just getting rid of the
   second tutorial stuff." That sheet is ui/onboard.js, OB_STEPNM's eight
   cards from Arrive to Next, still reachable as a replay from Settings and
   never opened by itself. It was read for parts before this was written and
   none fitted: it is a full screen stage that covers the page, walks a fixed
   order of cards, and writes a real entry through the Story tab's own
   functions. A guide has to do the opposite on all three counts: leave the
   page visible, point at what is on it, and write nothing. The generic
   #sheet (ui/panels.js, sheetOpen) was the other candidate and fails on the
   first count: a centred card over a dim covers exactly what it would be
   describing. So this is new, and small.

   WHAT IT IS. One circle in the top bar, beside search, on every screen that
   has a guide written. Pressed, the page stays where it is under a light dim,
   every element the guide names gets a ring drawn around it with a number,
   and a card lists the same numbers: symbol first, a short header second,
   one plain sentence third (his 16 November order). Pressing a row lights
   its ring and brings the element into view; pressing a ring lights its row.

   IT NEVER NAMES WHAT IS NOT THERE. Each row carries a selector. A row whose
   element is absent or not displayed is dropped at open time, so a screen
   that hides a control (a phone width, an unread record, a folded column)
   is never told about a thing it cannot see. An element that exists but is
   scrolled out of view keeps its row with no ring until the row is pressed.

   ONE SWITCH, A DEVICE SETTING. "Screen guides" in the profile menu, beside
   Sound effects, and a "Turn screen guides off" line in every guide's own
   card. Stored with devSet('guideoff'), the same device key the sound switch
   uses (engine/schema.js, "A DEVICE SETTING IS THE BROWSER'S, NOT THE
   PERSON'S RECORD"), so it is on for anybody who never touched it and a
   person with three profiles turns it off once.

   EXTENDING IT. GUIDE below is the whole content. A new screen is one more
   key, written after reading that screen's real renderer, and guideKey says
   which key a screen answers to. Nothing else in this file changes.
   ============================================================ */

/* the marks, ring and line only, never filled, 24 box like every other */
var GD_IC={
 /* the guide's own mark is what it draws: a marked box with its number on
    the corner. Not a question mark, which is Help's, a different door */
 guide:'<rect x="3.5" y="7" width="13" height="13" rx="2" stroke-dasharray="2.6 2.2"/><circle cx="17.5" cy="6.5" r="3.6"/>',
 seats:'<circle cx="12" cy="4.5" r="1.6"/><circle cx="12" cy="9.5" r="1.6"/><circle cx="12" cy="14.5" r="1.6"/><circle cx="12" cy="19.5" r="1.6"/>',
 feel:'<path d="M12 19.5s-6.8-4.2-6.8-9.1A3.8 3.8 0 0112 8.2a3.8 3.8 0 016.8 2.2c0 4.9-6.8 9.1-6.8 9.1z"/>',
 law:'<path d="M12 4v16M6 8h12M6 8l-2.5 5.5a2.6 2.6 0 005 0zM18 8l-2.5 5.5a2.6 2.6 0 005 0z"/>',
 gate:'<path d="M5 20V9a7 7 0 0114 0v11M9 20v-8a3 3 0 016 0v8"/>',
 stack:'<path d="M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',
 pattern:'<circle cx="12" cy="4.6" r="1.8"/><path d="M12 6.4v3.4M12 9.8l-5 5M12 9.8l5 5"/><circle cx="7" cy="17.4" r="1.8"/><circle cx="17" cy="17.4" r="1.8"/>',
 chart:'<path d="M4 19.5h16M6.5 16V11M10.5 16V6.5M14.5 16v-6M18.5 16V9"/>',
 circle:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/>',
 words:'<rect x="2" y="5.5" width="20" height="13" rx="2.6"/><path d="M6 10h1M9.5 10h1M13 10h1M16.5 10h1M7 14h10"/>',
 talk:'<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v2.5"/>',
 bank:'<path d="M3 9.5L12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18"/>',
 archive:'<path d="M4 4.5h16v14H4zM7 18.5v2M17 18.5v2"/><circle cx="12" cy="11.5" r="3.6"/>',
 sort:'<path d="M7 5v14M4 16l3 3 3-3M17 19V5M14 8l3-3 3 3"/>',
 release:'<path d="M12 20V8M7.5 12.5L12 8l4.5 4.5"/><circle cx="12" cy="5" r="1.4"/>',
 tiles:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
 fold:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/>',
 layers:'<path d="M12 4l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/>',
 wheel:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.2"/><path d="M12 3.4v5.4M12 15.2v5.4M3.4 12h5.4M15.2 12h5.4"/>',
 acc:'<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4a8.6 8.6 0 018.6 8.6"/><path d="M12 8v8M8 12h8"/>',
 zoom:'<circle cx="10.6" cy="10.6" r="6.4"/><path d="M15.4 15.4l5 5M8 10.6h5.2M10.6 8v5.2"/>',
 insight:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
 pick:'<circle cx="12" cy="12" r="8.6"/><path d="M8.4 12.2l2.5 2.5 4.8-5"/>',
 faces:'<rect x="2.5" y="7" width="19" height="10" rx="5"/><path d="M9 7v10M15 7v10"/>',
 tag:'<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
 ring7:'<circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="3.6" r="1.4"/><circle cx="19.3" cy="7.8" r="1.4"/><circle cx="19.3" cy="16.2" r="1.4"/><circle cx="12" cy="20.4" r="1.4"/><circle cx="4.7" cy="16.2" r="1.4"/><circle cx="4.7" cy="7.8" r="1.4"/>',
 ai:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.4"/>',
 down:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5v9M8.5 13l3.5 3.5 3.5-3.5"/>',
 up:'<circle cx="12" cy="12" r="8.6"/><path d="M12 16.5v-9M8.5 11l3.5-3.5 3.5 3.5"/>',
 plus:'<circle cx="12" cy="12" r="8.6"/><path d="M12 8v8M8 12h8"/>',
 book:'<path d="M4 5.5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5.5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/>',
 first:'<path d="M5 19V5M5 5h11l-2.5 3.5L16 12H5"/>',
 slider:'<path d="M3.5 12h17"/><circle cx="9" cy="12" r="2.6"/>'};

/* THE CONTENT. Read off each screen's real renderer on 21 November:
   ui/storyui.js and ui/stdash.js for the Dashboard (Discover with the
   Dashboard control pressed, STV.dash), ui/wheel.js, ui/fieldbar.js,
   ui/personas.js and the right rail for the Field, ui/avatarui.js for the
   Avatar face of the Avatar tab. The Imprints page's key, imps, is the
   Imprints tab (27 November). A row is {q: selector, ic, nm, say}. */
var GUIDE={
 dashboard:{nm:'Dashboard', rows:[
  {q:'#st-energy', ic:'seats', nm:'Energy',
   say:'Your seven seats, root to crown. A tile lights as your words reach that seat, brighter the more often it comes back.'},
  {q:'#st-childem', ic:'feel', nm:'Emotions',
   say:'The child emotions in your words. Each tile opens its feeling.'},
  {q:'#st-integrity', ic:'law', nm:'Integrity',
   say:'The 21 laws, one symbol each. A symbol fills as your words touch that law.'},
  {q:'#st-verp', ic:'gate', nm:'Action',
   say:'Six gates of action. A gate lights when your words run through it.'},
  {q:'#st-psyche', ic:'stack', nm:'Psyche',
   say:'Saboteurs, complexes, hyper complexes and super complexes. Each tile opens what is running in it.'},
  {q:'#st-patterns', ic:'pattern', nm:'Patterns',
   say:'Words handed down to you: parental, and ancestral. Each tile opens every word it found.'},
  {q:'#stch', ic:'chart', nm:'Imprints, as read',
   say:'Your imprints drawn as a chart. Press it to read them in full.'},
  {q:'#stmic', ic:'talk', nm:'Talk',
   say:'Speak your story instead of typing it.'},
  {q:'#sttype', ic:'words', nm:'Your words',
   say:'See what you have said and what is being read from it, or type.'},
  {q:'#stuni', ic:'circle', nm:'Reading circle',
   say:'Seven rings, root at the centre and crown outside. Each dot is a body address, brighter where it holds more charge.'},
  {q:'#stsort', ic:'sort', nm:'Sort',
   say:'Order the list by body point, by when it was heard, or by weight.'},
  {q:'#stapply', ic:'bank', nm:'Bank',
   say:'Put what this story found into your imprints.'}]},
 /* THE IMPRINTS PAGE, 27 November: the bank, the vault and the release that
    left the Dashboard when Discover split in two. Read off stImpsRender,
    impRender and stRelPanel (ui/storyui.js, ui/imprints.js). */
 imps:{nm:'Imprints', rows:[
  {q:'#impsw', ic:'faces', nm:'Bank or vault',
   say:'Bank is every imprint you hold. Vault is what you have released, and its number is how many points.'},
  {q:'#imp .ip-ctl', ic:'layers', nm:'Group by',
   say:'Group the bank by body point, by charge, by saboteur, and more.'},
  {q:'#imp .ip-cloud', ic:'pick', nm:'Imprints',
   say:'Each pill is one imprint. Press it to choose it for the release.'},
  {q:'#impinfo', ic:'insight', nm:'Detail',
   say:'With one imprint chosen, read it in full.'},
  {q:'#strel', ic:'release', nm:'Release',
   say:'What the release will run: what you chose, or what your last story found.'},
  {q:'#strun', ic:'release', nm:'Run release',
   say:'Starts the release with the pace and patterns set above it.'}]},
 field:{nm:'Field', rows:[
  {q:'#fbar', ic:'layers', nm:'Layers',
   say:'Turn each layer of the wheel on and off: saboteurs, complexes, hyper complexes and the rest.'},
  {q:'#cv', ic:'wheel', nm:'The wheel',
   say:'Your field. The number in the core is your CQ, how closely you keep the 21 laws. Scroll to move in, drag to move, double click to put it back.'},
  {q:'#accbtn', ic:'acc', nm:'Accuracy',
   say:'How much of you the instrument has measured so far. Press it for the detail.'},
  {q:'#fzoom', ic:'zoom', nm:'Zoom',
   say:'Move in and out of the wheel, and put the frame back.'},
  {q:'#lfold', ic:'fold', nm:'Left column',
   say:'Opens and closes the left column.'},
  {q:'#insight', ic:'insight', nm:'Insight',
   say:'Reads whatever you pick: an address on the wheel, a pattern, or a row below.'},
  {q:'#stkpick', ic:'pick', nm:'Pick several',
   say:'Choose more than one row to read them together.'},
  {q:'#stack', ic:'stack', nm:'What is running',
   say:'Superego, saboteurs, child emotions and more, tier by tier. Each bar is how much of it you hold.'},
  {q:'#rfold', ic:'fold', nm:'Right column',
   say:'Folds this column away to give the wheel more room.'}]},
 avatar:{nm:'Avatar', rows:[
  {q:'#iq .avs-top .avs-subs', ic:'faces', nm:'Avatar, Boundary, Masks',
   say:'Three faces of your avatar. This is the first.'},
  {q:'#iq .avh-tagsum', ic:'tag', nm:'Tags',
   say:'Feelings you have tagged, grouped by seat. Each group opens its seat.'},
  {q:'#iq .av-ring', ic:'ring7', nm:'Seven seats',
   say:'Root to crown. A tick means a story is written there. Press a seat to work on it.'},
  {q:'#iq .av-core', ic:'circle', nm:'This seat',
   say:'The seat you are on, by name.'},
  {q:'#iq .avai', ic:'ai', nm:'Source AI',
   say:'A question Source AI asks about this seat. Answer it in the box, or pass.'},
  {q:'#iq .avh-l', ic:'down', nm:'To release',
   say:'What you are letting go of at this seat, in your own words.'},
  {q:'#iq .avh-r', ic:'up', nm:'To embody',
   say:'What you are growing into at this seat, in your own words.'},
  {q:'#iq .avh-act', ic:'plus', nm:'Add to your avatar',
   say:'Fill both boxes, then press to add the pair to your avatar.'},
  {q:'#iq .avm', ic:'book', nm:'Your story, Intake questions',
   say:'Read this seat through your own story or through the intake questions.'},
  {q:'#iq .avq', ic:'first', nm:'Release first',
   say:'What to let go of first, and why, read off your tags and stories.'},
  {q:'#iq .avpot', ic:'slider', nm:'Potential',
   say:'Hold the slider to see your avatar with that share of your banked charge released. Let go and it goes back. Nothing is changed.'}]}};

/* which key the screen on show answers to, or '' for one with no guide yet.
   The Journal was two screens, the conversation alone and the Dashboard, and
   since 27 November only the Dashboard is reachable (STV.dash starts true);
   the Imprints page answers to its own id, imps, below. The Avatar tab is
   three faces; each is its own key so a future pass can write one without
   the other. */
function guideKey(){
 if(typeof S==='undefined'||!S)return '';
 var t=(typeof TABREAL==='function')?TABREAL(S.tab):S.tab;
 if(t===TAB.STORY)return (typeof STV!=='undefined'&&STV&&STV.dash)?'dashboard':'discover';
 if(t===TAB.INTAKE){
  var sub=(typeof AV!=='undefined'&&AV&&AV.sub)||'becoming';
  return sub==='becoming'?'avatar':('avatar.'+sub);}
 var d=null; for(var i=0;i<TABDEF.length;i++)if(TABDEF[i].k===t)d=TABDEF[i];
 if(!d&&typeof TABEXTRA!=='undefined')d=TABEXTRA[t]||null;
 if(!d)return '';
 return d.id==='cv'?'field':d.id;}

/* ON UNLESS TURNED OFF, the sound switch's own shape (ui/sound.js, sfxIsOn).
   GD_SESSION is what this visit asked for, first, so a browser that will not
   keep the setting still does what the switch says until the page closes. */
var GD_SESSION=null;
function guideOn(){
 if(GD_SESSION!==null)return GD_SESSION;
 var d=(typeof devGet==='function')?devGet('guideoff'):null;
 return d!==true;}
function guideSwitch(on){
 GD_SESSION=!!on;
 var r=(typeof devSet==='function')?devSet('guideoff',!on):{ok:false,err:'NoStore'};
 if(r.ok)GD_SESSION=null;
 if(!on)guideShut();
 guidePaint();
 if(typeof status==='function'){
  if(r.ok)status(on?'Screen guides on.':'Screen guides off. Turn them back on from your profile menu.');
  else status('Screen guides are '+(on?'on':'off')+' for this visit only. This browser would not keep the setting.','fail');}
 return r.ok;}

function gdSvg(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(GD_IC[k]||GD_IC.guide)+'</svg>';}
/* shown, in the sense a person could see it: in the document, laid out, and
   not hidden by its own or an ancestor's display or visibility */
function gdShown(e){
 if(!e||!e.getClientRects().length)return false;
 var r=e.getBoundingClientRect(); if(r.width<4||r.height<4)return false;
 return getComputedStyle(e).visibility!=='hidden';}
function gdRows(key){
 var g=GUIDE[key]; if(!g)return [];
 var out=[];
 g.rows.forEach(function(x){
  var e=null; try{ e=document.querySelector(x.q); }catch(err){ e=null; }
  if(gdShown(e))out.push({x:x,e:e});});
 return out;}

/* THE CIRCLE IN THE TOP BAR. Drawn once, beside search, and shown only while
   the switch is on and the screen on show has a guide with something in it,
   because a press that opens nothing is a dead button. */
function guideBtn(){
 var b=document.getElementById('guidebtn'); if(b)return b;
 var s=document.getElementById('srch'); if(!s||!s.parentNode)return null;
 b=document.createElement('button');
 b.type='button'; b.className='vt'; b.id='guidebtn';
 b.setAttribute('aria-label','Guide to this screen'); b.title='Guide to this screen';
 b.setAttribute('aria-haspopup','dialog'); b.setAttribute('aria-expanded','false');
 b.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">'+GD_IC.guide+'</svg>';
 b.hidden=true;
 b.onclick=function(){ if(GD.open)guideShut(); else guideOpen(); };
 s.parentNode.insertBefore(b,s);
 return b;}
function guidePaint(){
 guideCss();
 var b=guideBtn(); if(!b)return;
 var k=guideKey();
 b.hidden=!(guideOn()&&GUIDE[k]&&gdRows(k).length);
 if(GD.open&&GD.key!==k)guideShut();}

var GD={open:false, key:'', rows:[], back:null};
function guideOpen(){
 var k=guideKey(), rows=gdRows(k); if(!rows.length)return false;
 guideCss();
 var host=document.getElementById('guide');
 if(!host){host=document.createElement('div'); host.id='guide'; document.body.appendChild(host);}
 GD.open=true; GD.key=k; GD.rows=rows; GD.back=document.activeElement;
 var g=GUIDE[k];
 host.className='gd';
 host.setAttribute('role','dialog'); host.setAttribute('aria-modal','true'); host.setAttribute('aria-labelledby','gd-h');
 host.innerHTML='<div class="gd-dim" data-gdshut="1"></div><div class="gd-marks" aria-hidden="true">'
  +rows.map(function(r,i){
   return '<span class="gd-box" data-gdbox="'+i+'"></span>'
    +'<button type="button" class="gd-pin" tabindex="-1" data-gdpin="'+i+'">'+(i+1)+'</button>';}).join('')
  +'</div>'
  +'<div class="gd-card">'
   +'<div class="gd-hd"><span class="gd-hic">'+gdSvg('guide')+'</span>'
    +'<h2 id="gd-h" tabindex="-1">'+esc(g.nm)+'</h2>'
    +'<button type="button" class="gd-x" data-gdshut="1" aria-label="Close the guide" title="Close the guide">'
    +'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></div>'
   +'<ol class="gd-list">'+rows.map(function(r,i){
     return '<li><button type="button" class="gd-row" data-gdrow="'+i+'">'
      +'<span class="gd-n">'+(i+1)+'</span><span class="gd-ic">'+gdSvg(r.x.ic)+'</span>'
      +'<span class="gd-tx"><b>'+esc(r.x.nm)+'</b><span>'+esc(r.x.say)+'</span></span></button></li>';}).join('')
   +'</ol>'
   +'<div class="gd-ft"><button type="button" class="gd-off" data-gdoff="1">Turn screen guides off</button></div>'
  +'</div>';
 host.hidden=false;
 host.querySelectorAll('[data-gdshut]').forEach(function(x){x.onclick=function(){guideShut();};});
 host.querySelectorAll('[data-gdrow]').forEach(function(x){
  var i=+x.getAttribute('data-gdrow');
  x.onclick=function(){gdLight(i,true);};
  x.onmouseenter=x.onfocus=function(){gdLight(i,false);};});
 host.querySelectorAll('[data-gdpin]').forEach(function(x){
  x.onclick=function(){var i=+x.getAttribute('data-gdpin'); gdLight(i,false);
   var row=host.querySelector('[data-gdrow="'+i+'"]'); if(row){row.focus(); if(row.scrollIntoView)row.scrollIntoView({block:'nearest'});}};});
 var off=host.querySelector('[data-gdoff]'); if(off)off.onclick=function(){guideSwitch(false);};
 var b=document.getElementById('guidebtn'); if(b)b.setAttribute('aria-expanded','true');
 gdPlace();
 /* a frame later, so the fade has a start to run from; reduced motion has
    no transition and lands on the end state either way */
 requestAnimationFrame(function(){ if(GD.open)host.classList.add('gd-on'); });
 /* focus lands on the card's name and not its close button, so a phone's
    held-finger definition (ui/tip.js) does not open over the card */
 var hh=document.getElementById('gd-h'); if(hh)hh.focus();
 return true;}
function guideShut(){
 if(!GD.open)return;
 GD.open=false;
 var host=document.getElementById('guide'); if(host){host.hidden=true; host.classList.remove('gd-on'); host.innerHTML='';}
 var b=document.getElementById('guidebtn'); if(b)b.setAttribute('aria-expanded','false');
 var back=GD.back; GD.back=null; GD.rows=[];
 if(back&&back.focus&&document.contains(back))back.focus();}

/* the rings follow the page: placed at open, and again on a resize or a
   scroll anywhere under them, read off each element's own box every time */
function gdPlace(lit){
 if(!GD.open)return;
 var host=document.getElementById('guide'); if(!host)return;
 var vw=innerWidth, vh=innerHeight, pad=6;
 var pins=[], boxes=[];
 GD.rows.forEach(function(r,i){
  var box=host.querySelector('[data-gdbox="'+i+'"]'), pin=host.querySelector('[data-gdpin="'+i+'"]');
  if(!box||!pin)return;
  var b=r.e.getBoundingClientRect();
  var vis=gdShown(r.e)&&b.bottom>8&&b.top<vh-8&&b.right>8&&b.left<vw-8;
  box.hidden=pin.hidden=!vis;
  var row=host.querySelector('[data-gdrow="'+i+'"]'); if(row)row.classList.toggle('gd-away',!vis);
  if(!vis){boxes.push(null); return;}
  var L=Math.max(2,b.left-3), T=Math.max(2,b.top-3), R=Math.min(vw-2,b.right+3), B=Math.min(vh-2,b.bottom+3);
  box.style.left=L+'px'; box.style.top=T+'px'; box.style.width=(R-L)+'px'; box.style.height=(B-T)+'px';
  /* the number sits on the box's top right corner, where a heading set
     from the left leaves room, nudged along the edge when another number
     already stands there */
  var px=Math.min(vw-30,Math.max(pad,R-18)), py=Math.min(vh-30,Math.max(pad,T-12));
  for(var k=0,n=0;k<pins.length&&n<40;k++){
   if(Math.abs(pins[k][0]-px)<28&&Math.abs(pins[k][1]-py)<28){
    px=pins[k][0]-30; if(px<pad){px=Math.min(vw-30,R+6); py+=30;} k=-1; n++;}}
  pins.push([px,py]);
  boxes.push([L,T,R,B]);
  pin.style.left=px+'px'; pin.style.top=py+'px';});
 GD.boxes=boxes;
 if(lit===undefined)gdSide(boxes,-1);}
/* THE CARD TAKES THE SIDE THAT COVERS LESS of what it describes, measured as
   the area of the marked boxes under each place it could stand. When a row is
   pressed and its own element sits under the card, the card moves across, so
   the thing being read about is never the thing hidden. */
function gdSide(boxes,lit){
 var host=document.getElementById('guide'); if(!host)return;
 var card=host.querySelector('.gd-card'); if(!card)return;
 var vw=innerWidth; if(vw<760)return;
 /* the card starts level with the stage, so the bars above it stay readable */
 var stg=document.getElementById('stage'), st=stg?stg.getBoundingClientRect().top:84;
 card.style.top=Math.max(16,Math.min(160,Math.round(st)))+'px';
 var cw=Math.min(380,vw*0.4)+16;
 var under=function(x0,x1,b){ return Math.max(0,Math.min(x1,b[2])-Math.max(x0,b[0]))*Math.max(0,b[3]-b[1]); };
 if(lit>=0&&boxes[lit]){
  var b=boxes[lit], onLeft=card.classList.contains('gd-left');
  if(onLeft?under(0,cw,b)>0:under(vw-cw,vw,b)>0)card.classList.toggle('gd-left',!onLeft);
  return;}
 var l=0, r=0;
 boxes.forEach(function(b){ if(b){ l+=under(0,cw,b); r+=under(vw-cw,vw,b); } });
 card.classList.toggle('gd-left',l<r);}
function gdLight(i,go){
 var host=document.getElementById('guide'); if(!host)return;
 host.querySelectorAll('.gd-box.on,.gd-pin.on,.gd-row.on').forEach(function(x){x.classList.remove('on');});
 var r=GD.rows[i]; if(!r)return;
 if(go&&r.e.scrollIntoView){
  /* on a phone the card is a sheet over the lower half, so the element is
     brought to the top of what is left above it */
  var b=r.e.getBoundingClientRect(), phone=innerWidth<760;
  if(phone?(b.top<0||b.top>innerHeight*0.4):(b.top<0||b.bottom>innerHeight))
   r.e.scrollIntoView({block:phone?'start':'center'});
  gdPlace(null); gdSide(GD.boxes||[],i);}
 ['[data-gdbox="'+i+'"]','[data-gdpin="'+i+'"]','[data-gdrow="'+i+'"]'].forEach(function(s){
  var x=host.querySelector(s); if(x)x.classList.add('on');});}

var GD_CSS=false;
function guideCss(){
 if(GD_CSS||typeof document==='undefined')return; GD_CSS=true;
 var st=document.createElement('style'); st.id='guide-css';
 st.textContent=[
 '#guidebtn{width:var(--tap);min-width:var(--tap);padding:0;justify-content:center}',
 '#guidebtn[hidden]{display:none}',
 /* the phone bar is two rows, ordered by the shell ("the loader, help and
    the person, together"); the guide stands with them, before search */
 '@media (max-width:720px){.top #guidebtn{order:3;height:var(--tap);border-radius:50%}}',
 '#guidebtn[aria-expanded="true"]{color:var(--accent);border-color:var(--accent)}',
 '.gd{position:fixed;inset:0;z-index:90;opacity:0;transition:opacity var(--t-element,.2s) var(--ease-out,ease)}',
 '.gd.gd-on{opacity:1}',
 '.gd[hidden]{display:none}',
 '.gd-dim{position:absolute;inset:0;background:rgba(6,8,11,.42)}',
 '.gd-marks{position:absolute;inset:0;pointer-events:none}',
 '.gd-box{position:absolute;border:1.5px dashed color-mix(in srgb,var(--accent) 70%,transparent);border-radius:var(--r-s,10px);',
 ' transition:border-color var(--t-micro,.12s) var(--ease-out,ease)}',
 '.gd-box.on{border-style:solid;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}',
 '.gd-pin{position:absolute;width:28px;height:28px;border-radius:50%;border:1.5px solid var(--accent);',
 ' background:var(--bg);color:var(--accent);font:600 13px/1 var(--sans);display:flex;align-items:center;justify-content:center;',
 ' padding:0;pointer-events:auto;cursor:pointer}',
 /* the number is 28 to sit on a corner without covering what it marks; its
    press reaches 44 through an invisible ring around it, so the tap floor
    holds without a bigger mark on the page */
 '.gd-pin::before{content:"";position:absolute;inset:-8px;border-radius:50%}',
 '.gd-pin.on{background:var(--accent);color:var(--on-accent,#0B1418)}',
 '.gd-box[hidden],.gd-pin[hidden]{display:none}',
 '.gd-card{position:absolute;top:84px;right:16px;bottom:16px;width:min(380px,40vw);display:flex;flex-direction:column;',
 ' background:var(--panel);border:1px solid var(--edge-2);border-radius:var(--r,14px);box-shadow:0 18px 48px rgba(0,0,0,.45);overflow:hidden}',
 '.gd-card.gd-left{right:auto;left:16px}',
 '.gd-hd{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--edge)}',
 '.gd-hd h2{flex:1;margin:0;outline:none;font:600 18px/1.3 var(--sans);color:var(--ink)}',
 '.gd-hic svg,.gd-ic svg,.gd-x svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
 '.gd-hic{color:var(--accent);display:flex}',
 '.gd-x{width:var(--tap,44px);height:var(--tap,44px);border:1px solid var(--edge);border-radius:50%;background:transparent;',
 ' color:var(--mid);display:flex;align-items:center;justify-content:center;cursor:pointer}',
 '.gd-x:hover{color:var(--ink);border-color:var(--edge-2)}',
 '.gd-list{list-style:none;margin:0;padding:8px;overflow:auto;flex:1}',
 '.gd-row{width:100%;display:flex;align-items:flex-start;gap:12px;padding:12px;min-height:var(--tap,44px);text-align:left;',
 ' background:transparent;border:1px solid transparent;border-radius:var(--r-s,10px);color:var(--ink);cursor:pointer;font-family:var(--sans)}',
 '.gd-row:hover,.gd-row.on{background:var(--panel-2);border-color:var(--edge-2)}',
 '.gd-n{flex:0 0 24px;height:24px;border-radius:50%;border:1.5px solid var(--accent);color:var(--accent);',
 ' font:600 12px/1 var(--sans);display:flex;align-items:center;justify-content:center;margin-top:1px}',
 '.gd-row.gd-away .gd-n{border-style:dashed;opacity:.7}',
 '.gd-ic{flex:0 0 24px;color:var(--accent);display:flex;margin-top:1px}',
 '.gd-ic svg{width:22px;height:22px}',
 '.gd-tx{display:flex;flex-direction:column;gap:4px;min-width:0}',
 '.gd-tx b{font:600 16px/1.3 var(--sans);color:var(--ink)}',
 '.gd-tx span{font:400 15px/1.45 var(--sans);color:var(--mid)}',
 '.gd-ft{padding:8px 12px 12px;border-top:1px solid var(--edge);display:flex;justify-content:center}',
 '.gd-off{min-height:var(--tap,44px);padding:0 16px;background:transparent;border:1px solid var(--edge);border-radius:999px;',
 ' color:var(--mid);font:500 14px/1 var(--sans);cursor:pointer}',
 '.gd-off:hover{color:var(--ink);border-color:var(--edge-2)}',
 /* a phone: the card is a sheet along the foot, and the numbers stay over
    the part of the page above it */
 '@media (max-width:759px){.gd-card,.gd-card.gd-left{top:auto;left:0;right:0;bottom:0;width:auto;max-height:56vh;',
 ' border-radius:var(--r,14px) var(--r,14px) 0 0}}',
 '@media (prefers-reduced-motion:reduce){.gd,.gd-box{transition:none}}',
 'body.rm .gd,body.rm .gd-box,body.quiet .gd,body.quiet .gd-box{transition:none}'].join('\n');
 document.head.appendChild(st);}

/* wiring, once. A press anywhere can change which screen is on show without
   passing through render() (the Dashboard control, an Avatar face), so the
   circle is checked again a frame after every press, and on every render. */
(function(){
 if(typeof document==='undefined'||typeof addEventListener!=='function')return;
 addEventListener('keydown',function(e){ if(e.key==='Escape'&&GD.open){guideShut(); e.stopPropagation();} },true);
 addEventListener('resize',function(){ if(GD.open)gdPlace(); });
 addEventListener('scroll',function(){ if(GD.open)gdPlace(null); },true);
 document.addEventListener('click',function(e){
  if(e.target&&e.target.closest&&e.target.closest('#guide'))return;
  requestAnimationFrame(guidePaint);},true);})();
