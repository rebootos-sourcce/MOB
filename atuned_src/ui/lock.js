/* ============================================================
   THE LOCK. What a control looks like when what it opens is above the tier a
   person is on, and the one place a surface asks whether it may draw.

   THE RULING, 1 October 2026, the owner's own words: "tier one can see
   saboteurs, tier two can see saboteurs and complexes, tier three and four can
   see hyper complexes on. That means that they can't see what's running them
   in the field or the body or how the point cloud is expressed or the child
   masks. Those buttons would be grayed out to them, with a little lock over
   it. If they hover over it, it gives them a little description of what's
   locked, and where to go to unlock it, with a button that takes them to an
   upgrade."

   Which tier a thing needs is engine/plan.js's SIGHT and nothing here. This
   file reads planSees and planNeed and types no tier, so moving the registers
   from tier two to tier three is one word in that table and no word here.

   TWO SHAPES, because there are two kinds of thing to lock.

   A CONTROL is a button whose content is above the plan: a layer on the glass
   bar, an overlay on the Body, a view on the Compass, a tab on the stack.
   lockApply greys it, puts a small ring padlock on it and sets aria-disabled.
   It is NEVER the disabled attribute and never display none, for three
   reasons that were each measured on a screen before they were rules. A
   disabled button receives no pointer events in most browsers, so it can show
   no description on hover, which is the whole point. It also leaves the tab
   order, so a keyboard person cannot reach the description at all. And a
   control that vanishes tells a person nothing exists to buy. aria-disabled
   keeps it focusable and hoverable and says it does not act. It stays its full
   size, 44 pixels, because a locked control that is smaller than the one it
   replaces is a layout that moves when somebody pays.

   The description is the product's one tooltip (ui/tip.js), carried as
   data-tip, and it is reachable three ways: hover, keyboard focus, and a tap.
   A phone has no hover, so on a coarse pointer the press that would have acted
   explains instead, and a press on a locked control does that on every
   pointer. It says what is locked in one plain sentence, which tier unlocks
   it, and carries one button, See tiers, which opens Billing on the tiers page.

   A PANEL is a place that would have held a list or a picture: a rail section,
   the Character page, a Compass view reached with nothing to draw. It cannot
   be a tooltip, because a person on a phone would have to hold a finger on
   nothing to learn why a section is empty. lockPanelHtml is the same three
   facts written into the page, with the same button.

   AND THE DATA IS NOT DRAWN. Greying a button while the picture it switches
   still draws the saboteurs is a lock on a door in an open wall. sightR takes
   a reading and hands back the same reading with the rungs the plan cannot see
   emptied, and every surface that draws or lists what is running is given that
   and not compute()'s own. The engine still computes the whole chain: the
   lock is a boundary on what is drawn and listed, never on what is read, the
   same split the glass bar already keeps between drawn and read.

   THIS IS A PRODUCT BOUNDARY AND NOT SECURITY. The record is on the person's
   own device. Anybody who edits their own record, or opens the console and
   writes SIGHT_PLAN, sees their own data, and nothing here claims otherwise.
   It stops the product drawing a layer for a tier that has not bought it.
   ============================================================ */

/* THE PLAN SIGHT READS, which is the record's own unless a host hands one in.
   The gates run the whole product as a person on the top tier, so the
   hundreds of checks written against the full reading keep measuring the full
   reading, and the lock's own gate sets this to null and sets a plan on the
   record to measure the lock. It is a seam for a harness and not a feature: it
   is read once at load from the window, and a person who sets it in a console
   is in the position of one who edits their own record, said above. */
var SIGHT_PLAN=(typeof window!=='undefined'&&window.SIGHT_PLAN)||null;
/* THE SIGHT SWITCH IS GONE, ROUND RI. devSight() always reads false now
   (ui/login.js), so the free tier four this read for the owner's own account
   or a console flag can never fire again, whatever any browser's storage
   already holds. */
function lockPlan(){
 if(SIGHT_PLAN)return SIGHT_PLAN;
 if(typeof devSight==='function'&&devSight())
  return {tier:'four',status:'active'};
 return (typeof CURP!=='undefined'&&CURP&&CURP.plan)||null;}
/* Whether this person may see a thing right now. Read at every call and never
   cached, because a plan can change under an open surface: a payment lands, a
   subscription lapses, a record is swapped. */
function lockSees(k){ return planSees(lockPlan(),k); }
/* the same question for a layer key on the glass bar, which names its rungs
   saboteurs, complexes, hyper and character */
const LOCK_OF_LAYER={saboteurs:'sab',complexes:'cx',hyper:'hy',character:'sup',
 sab:'sab',cx:'cx',hy:'hy',sup:'sup',masks:'mask',mask:'mask',registers:'reg',reg:'reg'};
function lockFor(layer){ return LOCK_OF_LAYER[layer]||null; }
/* which gate a pattern's kind belongs to, for a list that mixes the four */
function lockKind(kind){ return LOCK_OF_LAYER[kind]||null; }

/* THE ONE SENTENCE PAIR a lock says. What is locked, then which tier unlocks
   it. Both are read off SIGHT, so the words and the tier cannot disagree with
   the table that decides. */
function lockWhat(k){
 var g=SIGHT.filter(function(x){return x.k===k;})[0]; return g?g.what:'';}
function lockTier(k){
 var n=planNeed(k); return n?n.nm.toLowerCase():'';}
function lockSay(k){
 var t=lockTier(k);
 return lockWhat(k)+(t?' Unlocked on '+t+' and above.':'');}
const LOCK_GO='See tiers';
/* A PRESET THAT IS ONLY PARTLY LOCKED. The Field's depth menu offers four
   starting sets, and Patterns and Chains each include rungs of the chain. Below
   the tier that carries them the set is still worth picking, because it still
   draws the seats and the archetypes, so it is NOT locked out: it draws what
   the plan can see and says what it leaves out. keys are gate keys. Grouped by
   the tier that unlocks them, so a set that leaves out two rungs on one tier
   reads as one clause. */
function lockPartSay(keys){
 var say=planLockedSay(keys);
 return say?'Draws what your plan can see. Locked: '+say+'.':'';}

/* A RING PADLOCK, never filled: the product's icons are ring, not fill. The
   shackle is open at neither end, the body is a rounded square with no mark in
   it, and it reads at 12 pixels. */
const LOCK_PATH='<rect x="5" y="10.8" width="14" height="9.7" rx="2.4"/><path d="M8.3 10.8V8.2a3.7 3.7 0 017.4 0v2.6"/>';
function lockMarkHtml(){
 return '<svg class="lk-mk" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+LOCK_PATH+'</svg>';}

/* ---- the control shape ---- */
/* lockApply is idempotent and runs on every repaint, because the renderers that
   own these controls rewrite them. A locked control is marked; an unlocked one
   is put back exactly as it was found, so paying makes the lock vanish on the
   next paint with nothing to clean up. o.at is the child the mark rides on
   when it is not the control itself (the orb carries it on its circle),
   o.corner pins it to the upper right instead of following the label. */
function lockApply(el,k,o){
 if(!el)return false; o=o||{};
 var locked=!lockSees(k);
 if(!locked){lockClear(el); return false;}
 if(el.getAttribute('data-lock')!==k){
  /* what the renderer wrote is kept so an unlock puts it back */
  el.setAttribute('data-lk-tip',el.getAttribute('data-tip')||'');
  el.setAttribute('data-lk-title',el.getAttribute('title')||'');
  el.setAttribute('data-lk-aria',el.getAttribute('aria-label')||'');
  el.setAttribute('data-lk-pressed',el.hasAttribute('aria-pressed')?el.getAttribute('aria-pressed'):'');}
 el.setAttribute('data-lock',k);
 el.classList.add('lk'); el.classList.remove('on');
 el.setAttribute('aria-disabled','true');
 /* a locked control is not pressed, whatever the state behind it says: a
    toggle that reads on over a layer that draws nothing is a lie in the
    control's own voice */
 if(el.hasAttribute('aria-pressed'))el.setAttribute('aria-pressed','false');
 var nm=el.getAttribute('data-lk-aria')||el.getAttribute('data-tip-t')||(el.textContent||'').trim();
 if(nm)el.setAttribute('aria-label',nm+', locked');
 el.removeAttribute('title');
 el.setAttribute('data-tip',lockSay(k));
 el.setAttribute('data-tip-go',LOCK_GO);
 if(!el.getAttribute('data-tip-t')&&nm)el.setAttribute('data-tip-t',nm);
 var host=o.at?el.querySelector(o.at):el; if(!host)host=el;
 if(!host.querySelector(':scope > .lk-mk')){
  var w=document.createElement('span'); w.innerHTML=lockMarkHtml();
  var m=w.firstChild; if(o.corner)m.classList.add('lk-corner');
  host.appendChild(m);}
 return true;}
function lockClear(el){
 if(!el||!el.hasAttribute('data-lock'))return;
 el.removeAttribute('data-lock'); el.classList.remove('lk');
 el.removeAttribute('aria-disabled');
 el.removeAttribute('data-tip-go');
 var t=el.getAttribute('data-lk-tip'), ti=el.getAttribute('data-lk-title'),
  a=el.getAttribute('data-lk-aria'), pr=el.getAttribute('data-lk-pressed');
 if(t)el.setAttribute('data-tip',t); else el.removeAttribute('data-tip');
 if(ti)el.setAttribute('title',ti);
 if(a)el.setAttribute('aria-label',a); else el.removeAttribute('aria-label');
 if(pr!==null&&pr!=='')el.setAttribute('aria-pressed',pr);
 ['data-lk-tip','data-lk-title','data-lk-aria','data-lk-pressed'].forEach(function(n){el.removeAttribute(n);});
 [].slice.call(el.querySelectorAll('.lk-mk')).forEach(function(m){m.parentNode.removeChild(m);});}

/* ---- the panel shape ---- */
/* o.brief is the short form for a rail row: the sentence and the button on one
   line, and no heading. A heading in every rail section would be the word
   Locked repeated down a column. */
function lockPanelHtml(k,o){
 o=o||{};
 return '<div class="lk-panel'+(o.brief?' brief':'')+'" data-lock-panel="'+esc(k)+'" role="note">'
  +'<span class="lk-pm">'+lockMarkHtml()+'</span>'
  +'<div class="lk-pt">'+(o.brief?'':'<div class="lk-ph">Locked on your plan</div>')
  +'<p>'+esc(lockSay(k))+'</p></div>'
  +'<button type="button" class="btn lk-go">'+esc(LOCK_GO)+'</button></div>';}

/* ---- the reading, with what is locked left out ---- */
/* The same reading, shallow copied, with every rung above the plan emptied and
   the heaviest pattern read off what is left. The original is never touched:
   compute() hands back an object other callers hold. Returns the very same
   object when nothing is locked, so a top tier person pays nothing and every
   identity comparison downstream (S.pin===o) keeps working for them. What is
   not emptied is the arithmetic that was built from the whole chain: DQ, CQ,
   the lean, the quadrant. Those are readings of the field and not lists of what
   is running it, and the owner's ruling names what is running them. */
function sightR(r){
 if(!r)return r;
 var pl=lockPlan();
 if(SEE_ORDER.every(function(k){return planSees(pl,k);}))return r;
 var v={}, k; for(k in r)v[k]=r[k];
 v.sabs=planSees(pl,'sab')?r.sabs:[];
 v.cxs=planSees(pl,'cx')?r.cxs:[];
 v.hys=planSees(pl,'hy')?r.hys:[];
 v.sups=planSees(pl,'sup')?r.sups:[];
 v.mask=v.sups[0]||v.hys[0]||v.cxs[0]||v.sabs[0]||null;
 /* the layers the plan cannot see, so a renderer can say why a list is empty
    instead of saying nothing is running */
 v.locked=SEE_ORDER.filter(function(x){return !planSees(pl,x);});
 return v;}
/* compute(), as a person on this plan may see it. Surfaces that draw or list
   the chain call this and not compute(). */
function computeSeen(){ return sightR(compute()); }

/* THE DOORS. A page that is locked has its button in the bar greyed too, so the
   lock is on the way in as well as on the page. Painted on every render and in
   setTab, because a payment or a lapse moves the plan with a surface already
   open. TAB.MASKS is looked up by its integer and the button by its data-tabk,
   never by where either sits. */
function lockTabs(){
 if(typeof document==='undefined')return;
 var b=document.querySelector('.tabtop[data-tabk="'+TAB.MASKS+'"]');
 if(b)lockApply(b,'mask');}

/* ---- the one handler ---- */
/* A press on a locked control explains and does not act, on every pointer. It
   runs in the capture phase on the document so it is ahead of every handler a
   renderer bound on the control itself, which is what stops the layer
   switching on. stopImmediatePropagation and not stopPropagation, because
   tip.js has its own capture listener on the same node. The keyboard reaches it
   the way it reaches every button: Enter and Space fire a click, and a click
   with no pointer behind it (detail 0) puts focus on the panel's button, so a
   person without a mouse can press See tiers without having to find it. */
function lockGo(){
 if(typeof TIP!=='undefined')TIP.hide();
 if(typeof planTiersOpen==='function')planTiersOpen();}
(function(){
 if(typeof document==='undefined')return;
 document.addEventListener('click',function(ev){
  var t=ev.target; if(!t||!t.closest)return;
  if(t.closest('.tip-go,.lk-go')){ev.preventDefault(); ev.stopPropagation(); lockGo(); return;}
  var l=t.closest('[data-lock]');
  if(!l||l.getAttribute('aria-disabled')!=='true')return;
  ev.preventDefault(); ev.stopImmediatePropagation();
  if(typeof TIP==='undefined')return;
  TIP.show(l);
  if(ev.detail===0){var g=document.querySelector('#tip .tip-go'); if(g)g.focus();}},true);})();

/* ---- the sheet's own rules, injected once, the way plans.js carries its own,
   because the shell stylesheet is held by another seat ---- */
function lockCss(){
 if(typeof document==='undefined'||document.getElementById('lk-css'))return;
 var st=document.createElement('style'); st.id='lk-css';
 st.textContent=[
  /* GREYED AND FULL SIZE. Opacity and not a colour swap, so the control keeps
     every other rule it has, and the size is untouched. The cursor says a
     description is there, not that the thing is forbidden. */
  '.lk{opacity:.55;filter:grayscale(1);cursor:help}',
  '.lk:hover,.lk:focus-visible{opacity:.8}',
  '.lk-mk{width:13px;height:13px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;',
  ' stroke-linecap:round;stroke-linejoin:round;vertical-align:-1px;margin-left:5px}',
  /* on a round orb the padlock rides the upper right, over the ring and clear
     of the value pill at the lower right, on its own small disc so it reads
     against the glass */
  '.lk-mk.lk-corner{position:absolute;right:-3px;top:-3px;width:17px;height:17px;padding:2.5px;margin:0;',
  ' box-sizing:border-box;border-radius:50%;background:var(--panel,#1c1e26);color:var(--ink,#eee);',
  ' stroke-width:2;z-index:2}',
  '.lk .fb-v{visibility:hidden}',
  '.lk .fb-arc .val{stroke-dasharray:0 100!important}',
  /* THE DESCRIPTION SITS ABOVE THE SHEETS IT IS OPENED FROM. The tooltip is
     z-index 60 and the Field's layer panel on a phone is a sheet at 70, which
     it inherits from the modal sheet's own class, so a locked layer's
     description opened UNDER the panel holding the layer and its See tiers
     button was covered: measured at 390, the tap on the button was intercepted
     by #fbpanel. A definition has to be readable over what it defines. */
  '.tip{z-index:90}',
  /* the description's one button. 44 pixels, and the tooltip's own accent */
  '.tip .tip-g{margin:10px 0 0}',
  '.tip .tip-go{min-height:44px;min-width:44px;padding:0 18px;border-radius:8px;cursor:pointer;',
  ' font:inherit;font-size:13px;font-weight:600;color:var(--ink);background:transparent;',
  ' border:1.5px solid var(--tc,var(--accent))}',
  '.tip .tip-go:hover,.tip .tip-go:focus-visible{background:var(--tc,var(--accent));color:var(--bg,#101010)}',
  /* the panel, in the page */
  '.lk-panel{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 16px;',
  ' border:1px dashed var(--edge-2,var(--edge));border-radius:10px;color:var(--mid);background:transparent}',
  '.lk-panel.brief{padding:10px 12px;gap:10px}',
  '.lk-pm{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:50%;',
  ' border:1.5px solid var(--edge-2,var(--edge));color:var(--dim)}',
  '.lk-pm .lk-mk{width:17px;height:17px;margin:0}',
  '.lk-pt{flex:1 1 220px;min-width:0}',
  '.lk-ph{font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--dim);margin-bottom:3px}',
  '.lk-page{width:100%;max-width:640px;margin:0 auto;padding:36px 16px;align-self:flex-start}',
  '.lk-pt p{margin:0;font-size:13.5px;line-height:1.55;color:var(--ink)}',
  '.lk-go{min-height:var(--tap,44px);min-width:var(--tap,44px);white-space:nowrap}',
  '@media (max-width:760px){.lk-panel .lk-go{width:100%}}'].join('\n');
 document.head.appendChild(st);}
lockCss();
