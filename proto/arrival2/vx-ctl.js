/* ============================================================
   THE PROTOTYPE'S CONTROLLER AND PANEL. Round EV. Not product.

   Five sheets, one slot: the four new versions and ET's, the one he called
   "very cool", kept beside them so every comparison is against the thing he
   praised and not against memory. Every one is a real boot sheet laid over
   the real build, and ends by handing off to the real Field underneath.

   THE FIRST LOAD is the product's own mechanism: panels.js removes the
   sheet on bootOut's animationend with its 5450ms floor and its press to
   skip. Replays from the panel carry the same floor and the same way out.
   ============================================================ */
(function(){
'use strict';
var RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
var first=document.getElementById('boot');
var P={v:(first&&first.getAttribute('data-v'))||'breath',rate:1};
var SHEET=null, SCRUB=false, PANEL=null, OPENED=false, LEN=5240;

var ABOUT={
 liked:{name:'The one you liked',style:'The arrival from the last round, kept here to compare against.',
  centre:'The spine unfurls into the ring and a glass lens opens at the centre.',p:[]},
 breath:{name:'1. Breath',style:'Soft light. One breath in, one breath out.',
  centre:'Collapsed: a dim grey ember lying flat below the centre. Expressed: risen, round and lit, opened into the glass lens with its ring filled.',
  p:[['Staging','for the first second and a half the ember is the only thing on screen, so your eye is on the centre before it opens.'],
   ['Anticipation','the breath in, nine tenths of a second, is the wind up for the breath out, a quarter of a second.'],
   ['Squash and stretch','the ember stretches tall while it rises and flattens for a sixth of a second as it stops. It changes shape only while it moves. The finished lens never does.'],
   ['Arcs','the seven colours spiral in, the ember rises on a curve, the seats spiral out.'],
   ['Slow in and slow out','the breath in speeds up as it falls into the centre. The breath out bursts, then slows to rest.'],
   ['Follow through','the wave of light does not stop at the ring. It keeps going and dies at the gold halo.'],
   ['Secondary action','the light behind the figure is pulled in and pushed out by the same breath.'],
   ['Timing','in slow, a short held beat, out fast. The shape of a real breath.']]},
 orrery:{name:'2. Orrery',style:'Engraved hairlines in real perspective. A globe that turns.',
  centre:'Collapsed: one point of light on a flat line, the whole field seen edge on. Expressed: a globe seen from its pole, its seven meridians pointing at the seven seats, its ring filled.',
  p:[['Staging','the opening frame is one point of light on one line.'],
   ['Solid drawing','real perspective. The near side of the ring is larger than the far side, the seats are small spheres lit from one side, and the globe’s circles are the ring’s own circles.'],
   ['Anticipation','the flat horizon tips away from you before it swings toward you.'],
   ['Arcs','the seats travel forward along their own orbit, never in a straight line.'],
   ['Follow through','the field swings past facing you by about fourteen degrees and settles back.'],
   ['Overlapping action','the globe keeps turning after the field has stopped, and slows until its meridians land on the seats.'],
   ['Timing','the address marks click in twelve times a second, like a watch, not smoothly.'],
   ['Slow in and slow out','the swing and the globe’s turn both ease in and ease out.']]},
 bloom:{name:'3. Bloom',style:'Solid shapes, nothing outlined. A bud that opens.',
  centre:'Collapsed: hidden inside a closed bud. Expressed: uncovered gap by gap as the petals lift, and swollen into a solid disc with its ring filled.',
  p:[['Anticipation','the bud tightens and twists back before it opens.'],
   ['Squash and stretch','the bud squeezes smaller before it opens, and each petal stretches a little at its fastest.'],
   ['Overlapping action','each petal starts 70 milliseconds after the one before, so seven moves read as one opening.'],
   ['Follow through','each petal swings past flat and settles back, and the twist overshoots and returns.'],
   ['Exaggeration','the petals open far wider than the ring they become, then draw in to it.'],
   ['Solid drawing','a petal is its full colour facing you and darkens as it turns away. Its back is darker still.'],
   ['Staging','the centre is hidden, then uncovered.'],
   ['Appeal','a flower opening is a shape people watch twice.']]},
 ember:{name:'4. Ember',style:'Particles of light, thrown out and caught.',
  centre:'Collapsed: every address in the field packed into one hot, trembling point. Expressed: all of it thrown out to its own place in the field, and the centre opened into the glass lens.',
  p:[['Straight ahead action','the flight is simulated a step at a time rather than posed, then recorded, so it plays the same every time.'],
   ['Anticipation','the point compresses hard and trembles before it bursts.'],
   ['Arcs','every address is thrown with a turn on it, so it spirals out.'],
   ['Follow through','each address flies past its place and springs back into it.'],
   ['Timing','the seven seats are heavier, so they leave slower and land later than the addresses.'],
   ['Squash and stretch','each seat stretches along its path in flight and is round again the moment it stops, and its area never changes. Each address stretches into a streak and shortens into its mark.'],
   ['Secondary action','sparks shed from the burst and burn out.'],
   ['Exaggeration','the burst flies well past the ring before it comes back.']]}};
var ORDER=['breath','orrery','bloom','ember','liked'];

function NARROW(){return innerWidth<600;}
function anims(el){return el&&el.isConnected?el.getAnimations({subtree:true}):[];}

/* ---------------- the handoff to the real Field ---------------- */
function handoff(el){
 if(!el||el.__vxHanded)return;el.__vxHanded=true;
 /* THE WHEEL'S ENTRANCE, where it can be seen, as ET moved it: shipped, it
    plays at page load under an opaque sheet */
 try{if(typeof S!=='undefined'&&S.tab===TAB.FIELD&&!(typeof fviewOn==='function'&&fviewOn())&&typeof enterStart==='function'){
  ENTER_SEEN=false;enterStart();}}catch(e){}}
function gone(el){
 if(el.parentNode)el.parentNode.removeChild(el);
 handoff(el);
 if(SHEET&&SHEET.el===el){clearTimeout(SHEET.floor);SHEET=null;}
 document.body.classList.add('booted');
 /* opened once for him after the first boot, on a wide screen; on a phone
    it would cover the thing it is there to show */
 if(PANEL&&!OPENED){OPENED=true;if(!NARROW())openPanel(true);}
 panelPaint();}
function watch(el){
 el.addEventListener('animationstart',function(e){if(e.target===el&&e.animationName==='bootOut')handoff(el);});
 el.addEventListener('animationend',function(e){if(e.target===el&&e.animationName==='bootOut')gone(el);});}
/* the first sheet belongs to panels.js, which removes it. This only listens
   for that, whether it ended, hit the floor, or was pressed away */
if(first){watch(first);
 new MutationObserver(function(ms,ob){if(!first.isConnected){ob.disconnect();gone(first);}})
  .observe(document.body,{childList:true});}

/* ---------------- replaying a sheet ---------------- */
function kill(){if(SHEET)clearTimeout(SHEET.floor);
 var e=document.getElementById('boot');if(e&&e.parentNode){e.__vxHanded=true;e.parentNode.removeChild(e);}SHEET=null;}
function make(v){
 var w=document.createElement('div');w.innerHTML=v==='liked'?VX_ET:VX_SHEET;var el=w.firstElementChild;
 if(v!=='liked')el.setAttribute('data-v',v);return el;}
function play(v,at){
 kill();P.v=v;SCRUB=false;
 var el=make(v);document.body.insertBefore(el,document.body.firstChild);
 if(RM){
  /* reduced motion: the expressed pose, standing still, until a press */
  el.classList.add('vx-still');el.style.pointerEvents='auto';
  if(VX.has(v))VX.mount(el,{still:3.9});
  el.addEventListener('pointerdown',function(){if(el.parentNode)el.parentNode.removeChild(el);});
  SHEET={el:el,floor:0};panelPaint();return el;}
 getComputedStyle(el).opacity;
 if(VX.has(v))VX.mount(el);
 anims(el).forEach(function(a){a.playbackRate=P.rate;});
 watch(el);
 SHEET={el:el,floor:setTimeout(function(){gone(el);},5450/P.rate)};
 if(at!=null)seek(at);
 panelPaint();return el;}
function seek(ms){
 if(RM)return;
 if(!SHEET||!SHEET.el.isConnected)play(P.v);
 if(!SHEET)return;
 SCRUB=true;clearTimeout(SHEET.floor);
 anims(SHEET.el).forEach(function(a){a.pause();a.currentTime=ms;});}
function resume(){
 if(!SHEET||!SHEET.el.isConnected)return play(P.v);
 SCRUB=false;var el=SHEET.el,a0=anims(el),t=0;
 a0.forEach(function(a){if(a.animationName==='bootOut')t=a.currentTime||0;a.playbackRate=P.rate;a.play();});
 clearTimeout(SHEET.floor);SHEET.floor=setTimeout(function(){gone(el);},Math.max(0,5450-t)/P.rate);}
/* the way out of a replay, as the product has one: a press anywhere that is
   not the panel, or Escape, and the sheet goes in 180ms */
function skip(e){
 if(!SHEET||!SHEET.el.isConnected||SCRUB)return;
 if(e.type==='pointerdown'){if(PANEL&&PANEL.contains(e.target))return;e.stopPropagation();
  var eat=function(ev){ev.stopPropagation();if(ev.cancelable)ev.preventDefault();};
  addEventListener('click',eat,{once:true,capture:true});setTimeout(function(){removeEventListener('click',eat,true);},700);}
 else if(e.key!=='Escape')return;
 var el=SHEET.el;el.style.transition='opacity .18s cubic-bezier(.4,0,1,1)';el.style.opacity='0';
 clearTimeout(SHEET.floor);setTimeout(function(){gone(el);},190);}
addEventListener('pointerdown',skip,true);
addEventListener('keydown',skip,true);

/* ---------------- James on the Field, done under the first sheet ---------------- */
function setup(){
 if(typeof PEOPLE==='undefined'||typeof loadP!=='function'||!document.getElementById('tabbar')
  ||!document.getElementById('tabbar').children.length)return setTimeout(setup,60);
 var hh=(location.hash||'').toLowerCase();
 try{
  if(hh.indexOf('blank')<0){var i=PEOPLE.findIndex(function(q){return q.nm==='James';});
   if(i>=0){loadP(i);VX_JAMES.forEach(function(t,k){applyStory(t);verpApply(t);
    if(typeof leanApply==='function')leanApply(t);
    CURP.story=CURP.story||{entries:[]};var ps=parseStory(t);
    CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});}}
  if(S.tab!==TAB.FIELD)setTab(TAB.FIELD);
  render();}
 catch(e){try{console.error('[arrival2] setup',e);}catch(e2){}}
 panel();
 document.documentElement.setAttribute('data-vx-ready','1');}
setup();

/* ---------------- the panel ---------------- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function btn(k,v,label,sub){return '<button type="button" data-vx-'+k+'="'+v+'">'+(sub?'<small>'+esc(sub)+'</small>':'')+esc(label)+'</button>';}
function panel(){
 if(PANEL)return;
 var d=document.createElement('div');d.id='vx-opts';
 d.innerHTML='<button type="button" class="vx-ob" aria-expanded="false">Arrival styles</button>'
  +'<div class="vx-oc" hidden>'
  +'<p class="vx-h">Play a version. Each one lands in the real Field.</p>'
  +'<div class="vx-seg" role="radiogroup" aria-label="Version">'
  +ORDER.map(function(k){var a=ABOUT[k];return btn('v',k,a.name,k==='liked'?'For comparison':a.style.split('.')[0]);}).join('')+'</div>'
  +'<p class="vx-h">Watch it closely</p>'
  +'<div class="vx-seg" role="radiogroup" aria-label="Speed">'+btn('rate','1','Real time')+btn('rate','0.5','Half')+btn('rate','0.25','Quarter')+'</div>'
  +'<label class="vx-scrub"><span>Scrub this version</span><input type="range" min="0" max="1000" value="0" aria-label="Scrub"><output>0.00 s</output></label>'
  +'<div class="vx-seg">'+btn('play','1','Play from here')+btn('again','1','Play from the start')+'</div>'
  +'<details class="vx-about"'+(NARROW()?'':' open')+'><summary>About this version</summary><div class="vx-ab"></div></details>'
  +'<p class="vx-note"></p></div>';
 document.body.appendChild(d);PANEL=d;
 var ob=d.querySelector('.vx-ob');
 ob.addEventListener('click',function(){openPanel(d.querySelector('.vx-oc').hidden);});
 d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b===ob)return;
  if(b.hasAttribute('data-vx-v')){play(b.getAttribute('data-vx-v'));if(NARROW())openPanel(false);}
  else if(b.hasAttribute('data-vx-rate')){P.rate=+b.getAttribute('data-vx-rate');if(SHEET)anims(SHEET.el).forEach(function(a){a.playbackRate=P.rate;});
   if(SHEET&&!SCRUB)resume();}
  else if(b.hasAttribute('data-vx-play')){resume();if(NARROW())openPanel(false);}
  else if(b.hasAttribute('data-vx-again')){play(P.v);if(NARROW())openPanel(false);}
  panelPaint();});
 var rg=d.querySelector('.vx-scrub input'),out=d.querySelector('.vx-scrub output');
 rg.addEventListener('input',function(){var t=+rg.value/1000*5200;seek(t);out.textContent=(t/1000).toFixed(2)+' s';panelPaint();});
 panelPaint();}
function openPanel(o){if(!PANEL)return;var oc=PANEL.querySelector('.vx-oc'),ob=PANEL.querySelector('.vx-ob');
 oc.hidden=!o;ob.setAttribute('aria-expanded',String(!!o));}
function panelPaint(){
 if(!PANEL)return;
 PANEL.querySelectorAll('[data-vx-v]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-vx-v')===P.v));});
 PANEL.querySelectorAll('[data-vx-rate]').forEach(function(b){b.setAttribute('aria-pressed',String(+b.getAttribute('data-vx-rate')===P.rate));});
 var a=ABOUT[P.v],ab=PANEL.querySelector('.vx-ab');
 if(ab&&ab.getAttribute('data-for')!==P.v){ab.setAttribute('data-for',P.v);
  ab.innerHTML='<p><b>'+esc(a.name)+'.</b> '+esc(a.style)+'</p><p><b>The centre.</b> '+esc(a.centre)+'</p>'
   +(a.p.length?'<p><b>The principles, and where.</b></p><ul>'+a.p.map(function(x){return '<li><b>'+esc(x[0])+':</b> '+esc(x[1])+'</li>';}).join('')+'</ul>':'');}
 var n=PANEL.querySelector('.vx-note');
 if(n)n.textContent=RM?'Reduced motion is on in this browser, so a version shows its finished pose standing still, which is the ruled behaviour. Press it to close it.'
  :(SHEET?(SCRUB?'Held on a frame. Play from here to carry on.':'Playing. A press outside this panel, or Escape, skips it.')
   :'Build '+VX_BUILD.commit+'. Nothing in this panel is product.');}
window.__VXC=function(){return {P:P,SHEET:SHEET,SCRUB:SCRUB,play:play,seek:seek,resume:resume};};
})();
