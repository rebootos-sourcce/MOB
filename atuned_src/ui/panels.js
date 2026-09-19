
/* ============================================================
   CONTROLS
   ============================================================ */
const $=function(id){return document.getElementById(id);};
const svgI=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>';};
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
 S.tab=i; S.pin=null;
 var cvE=$('cv'), vb=$('vbar');
 TABDEF.forEach(function(T){
  var e=$(T.id); if(!e||T.id==='cv')return;
  e.classList.toggle('on',T.k===i);
  e.style.display=(T.k===i)?'flex':'none';});
 if(cvE) cvE.style.display=(i===TAB.FIELD)?'block':'none';
 if(vb) vb.style.display=(i===TAB.FIELD)?'flex':'none';
 TABDEF.forEach(function(T){document.body.classList.remove(T.cls);});
 document.body.classList.add(TABOF(i).cls);   /* by key, not by position */
 document.body.classList.toggle('hassub',i===TAB.FIELD);
 ['probe','howto','key','tier','pol'].forEach(function(id){
  var e=$(id); if(e)e.style.display=(i===TAB.FIELD)?'':'none';});
 document.querySelectorAll('.tabtop').forEach(function(x,j){
  x.setAttribute('aria-pressed',TABDEF[j]&&TABDEF[j].k===i);});
 if(i===TAB.INTAKE)renderIntake();
 if(i===TAB.KNOW)kbRender();
 if(i===TAB.GAMES){if(!GAME)GAME='lg'; gmRender();} else lgStop();
 if(i===TAB.STORY)stRender();
 if(i===TAB.SUMMARY)sumRender();
 if(i===TAB.ANALYTICS)anaRender();
 render(); paintSections();}
TABDEF.forEach(function(T,i){
 var b=document.createElement('button');b.className='vt tabtop';b.type='button';
 b.setAttribute('aria-pressed',T.k===S.tab);
 b.innerHTML='<span class="n">'+T.nm+'</span>';
 b.addEventListener('click',function(){setTab(T.k);});
 $('tabbar').appendChild(b);});
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
 b.title=v.how||v.layers;
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
 punch:'M12 4a8 8 0 0 1 0 16zM12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0'};
[['dark','Dark'],['snow','Snow'],['punch','Punch']].forEach(function(t,i){
 var b=document.createElement('button');b.type='button';
 b.setAttribute('aria-pressed',i===0);
 b.className='seg-i'; b.title=t[1]; b.setAttribute('aria-label',t[1]+' theme');
 b.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">'
  +'<path d="'+THEMEICON[t[0]]+'"/></svg>';
 b.addEventListener('click',function(){S.theme=t[0];
  document.body.classList.toggle('snow',t[0]==='snow');
  document.body.classList.toggle('punch',t[0]==='punch');
  $('themes').querySelectorAll('button').forEach(function(x,j){x.setAttribute('aria-pressed',j===i);});
  rebuildSwatches();render();});
 $('themes').appendChild(b);});
/* the font tuner is gone on the owner's ruling. one face, narrower, no
   per person override to keep working across every surface. */

/* ---- the icon grids. the icon carries the colour, selection is a ring. ---- */
DOMAINS.forEach(function(d,i){
 var b=document.createElement('button');b.className='ib';b.type='button';
 b.style.setProperty('--c',ROOTCOL[d.r]);
 b.title=d.nm+', '+d.r+'. '+d.d+'. Shift-click to add.';
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
ROOTD.forEach(function(rn){
 var b=document.createElement('button');b.type='button';b.dataset.r=rn;
 b.className='rootb';b.textContent=rn;b.setAttribute('aria-pressed',false);
 b.style.cssText='flex:1 1 auto;background:transparent;border:1.5px solid var(--edge);'
  +'border-radius:var(--r-xs);padding:8px 6px;font-family:var(--sans);font-size:13px;'
  +'cursor:pointer;color:'+ROOTCOL[rn]+';transition:.18s';
 b.title=rn+'. Holds '+DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ')
  +'. Affinity 1.3 on '+(AFFIN[rn]||[]).join(', ')+'.';
 b.addEventListener('mouseenter',function(){
  $('capD').innerHTML='<b style="color:'+ROOTCOL[rn]+'">'+rn+'</b> root domain. Holds '
   +DOMAINS.filter(function(D){return D.r===rn;}).map(function(D){return D.nm;}).join(', ')+'.';});
 b.addEventListener('mouseleave',capD);
 b.addEventListener('click',function(){toYou();var k=S.roots.indexOf(rn);
  if(k>=0)S.roots.splice(k,1);else S.roots.push(rn);
  b.setAttribute('aria-pressed',k<0);
  b.style.borderColor=k<0?ROOTCOL[rn]:'var(--edge)';
  b.style.boxShadow=k<0?('0 0 0 2px '+ROOTCOL[rn]+'44'):'none';
  buildSoul();S.pin=null;syncSoul();saveYou();render();});
 $('roots').appendChild(b);});
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
 $('roots').querySelectorAll('button').forEach(function(b){
  var on=S.roots.indexOf(b.dataset.r)>=0;
  b.setAttribute('aria-pressed',on);
  b.style.borderColor=on?ROOTCOL[b.dataset.r]:'var(--edge)';
  b.style.boxShadow=on?('0 0 0 2px '+ROOTCOL[b.dataset.r]+'44'):'none';});
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

function profileSheet(){
 var r=compute(), m=(typeof meterRead==='function')?meterRead(CURP):null;
 var who=(CURP&&CURP.name)||'You';
 var h='<div class="pm-eye">Profile</div><p class="sh-h">'+esc(who)+'</p>'
  +'<div class="sh-sec"><div class="pm-eye">This reading</div>'
  +'<div class="sh-row"><span>Coherence</span><b>'
   +(r.unread?'not read yet':Math.round(r.CQ)+' of 100')+'</b></div>'
  +'<div class="sh-row"><span>Tier</span><b>'+esc(r.unread?'not read yet':r.tier)+'</b></div>'
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
  +'</div>'
  +'<div class="sh-sec"><div class="pm-eye">Who you are becoming</div>'
  +'<p class="sh-p">The avatar, the purpose map and the boundary. What the release work is '
  +'aimed at.</p>'
  +'<div class="sh-act"><button class="btn" id="shav">Open the avatar</button></div></div>'
  +'<div class="sh-sec"><button class="btn" id="shclose">Close</button></div>';
 sheetOpen(h);
 /* the same three steps, inside the sheet, sharing one setter */
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
  +'<div class="sh-sec"><div class="pm-eye">The reading</div>'
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
 var pb=$('profbtn'); if(pb)pb.onclick=profileSheet;
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
function paintUndo(){
 var b=$('undobtn'), l=$('undolab'); if(!b)return;
 var n=undoDepth(), what=undoPeek();
 b.hidden=(n===0);
 if(n){ l.textContent='Undo '+what;
  b.title='Takes back '+what+'. '+n+' step'+(n===1?'':'s')+' available.'; }}
(function(){
 var b=$('undobtn');
 if(b)b.onclick=function(){
  var u=undoPop();
  if(!u){paintUndo();return;}
  /* the field changed underneath everything, so the whole surface repaints
     and the person is told what came back rather than left to spot it. */
  syncCh(); if(typeof syncLw==='function')syncLw();
  if(typeof syncSoul==='function')syncSoul();
  saveYou(); if(typeof pSave==='function')pSave();
  render(); paintUndo();
  status('Took back '+u.nm+'.','ok');};
 /* the usual chord, because a person who wants undo reaches for it */
 addEventListener('keydown',function(e){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){
   var t=e.target&&e.target.tagName;
   if(t==='INPUT'||t==='TEXTAREA')return;   /* let the field have its own */
   e.preventDefault(); var ub=$('undobtn'); if(ub&&!ub.hidden)ub.onclick();}});})();
