/* ============================================================
   THE PAYWALL. Mockup five, flat cards, second cut, built into the app.

   RULED 17 OCTOBER, the owner's words: "Paywall mockup five, flat card
   second cut. That's the one I'd like to build." The mockup is on the branch
   claude/paywall-mockups at mockups/paywall/ (p5-flat-cards-v2.html, src/p5.js,
   src/p5.css), and this file is that page with its demo frame taken off and
   the app's own engine put under it. What he graded p1 on is the brief:
   "There's too much text at the bottom ... More visual, more show, less tell.
   Icons, I can hover over the icons and get information on what features I
   may be missing."

   WHAT IT IS. A sheet over whatever screen the person is on, three paid cards
   and a Practitioner strip under them. Each card leads on its patterns a
   month, then its price, then the six rings a tier can open, solid in the
   accent where the tier opens that layer and a grey ring where it does not.
   Solid against outline is a change of shape, so colour is never the only
   sign, and one colour serves every card: tiers rank by how much is lit and
   never by hue. Every ring, the number and the Practitioner name are buttons
   that open one short card on hover, on keyboard focus and on a tap.

   THE ROUTE, Emmy's recommendation and the change the rest of the design sits
   on. A locked ring anywhere in the app used to send a person to Billing, a
   page of 488 words with no price in view on a phone. lockGo (ui/lock.js) now
   opens this sheet instead, with the ring that was pressed marked under its
   column on every card and the cheapest tier that opens it carrying the one
   solid button. The release panel's See the tiers comes here too, with
   nothing marked, because two buttons that both say see tiers must not land
   in two places. Billing stays where it was: the profile menu reaches it, and
   this sheet's own foot links to it. Closing puts focus back on the control
   that opened the sheet.

   NOTHING ABOUT THE LADDER IS TYPED HERE. The tiers, their names, prices,
   allowances, which tier opens which ring and whether one can be bought are
   planLadder, planNeed, planBuyable and sightRows in engine/plan.js. The ring
   meanings are the glossary's (unpackOf, engine/data/gloss.js), with SIGHT's
   own sentence where the glossary has none. The marks are the product's:
   CHAINGLYPH (ui/component.js), the registers mark (CN_IC, ui/cone.js), the
   masks mark (BMOVL, ui/map.js), the padlock (LOCK_PATH, ui/lock.js).

   HONEST BY CONSTRUCTION, the hard rules this was built under.
   - Checkout is closed (planCheckoutOpen, engine/plan.js, mirroring the
     server's STRIPE_BILLING_ENABLED=0). While it is, no card carries a press:
     each says "Opens soon", which is words and a clock ring and not a pill,
     because a pill says press.
   - When it opens, a card's press is planOpen('checkout', tier), the one door
     Billing's own Move to goes through, so signed out, a live plan moved on the
     payment page, a closed tier refused and a payment that does not go
     through all say exactly what they said before. This is a new face on the
     same engine, never a second payment path.
   - Stopping is on Stripe's page, reached from Billing. Nothing here says
     stopping takes two presses, because the in app stop is not built.
   - The refund line is a switch and it is off (PW_REFUND), until the terms
     page carries the refund and a lawyer has read it.
   - THE GIFT SEES EVERYTHING, since PR 109 merged on 17 October: the lock
     reads it off the record's own meter (lockGift, ui/lock.js, through
     planInGift). So a person inside the gift meets the mockup's gift state
     here: every ring lit, no price, no press, the gift's one line in the
     words Summary already says it in (sumGift, ui/summary.js), and Close.
   - On a worked example the sheet reads the person's own plan (showOwnPlan,
     ui/personas.js), and opening it writes nothing anywhere.
   ============================================================ */

/* THE REFUND LINE, OFF. Emmy, 17 October: it may only show once the terms page
   carries it and the address in it answers. TERMS.md marks that address
   [CHECK], and no lawyer has ruled on the fourteen day EU and UK right. */
var PW_REFUND=false;
/* THE HARNESS SEAM FOR PAYING OPEN, read once at load from the window, the
   way SIGHT_PLAN is (ui/lock.js). A gate sets it to measure the day checkout
   opens. It is not a way to pay: a press still goes to the server, whose own
   switch refuses it while paying is closed. */
var PW_PAY_SEAM=(typeof window!=='undefined'&&window.PAYWALL_PAY_OPEN===true);
var PW={open:false, k:null, door:null, back:null, el:null, tip:null, tipOn:null, pin:false};

function pwPayOpen(){ return (typeof planCheckoutOpen==='function'&&planCheckoutOpen())||PW_PAY_SEAM===true; }
/* THE PLAN THE SHEET READS. The lock's own (lockPlan), except on a worked
   example, where the record open is the example's and says tier four: the
   sheet is about what the person themselves would buy, so it reads their own. */
function pwPlan(){
 if(typeof showOnly==='function'&&showOnly()&&typeof showOwnPlan==='function')return showOwnPlan();
 return (typeof lockPlan==='function')?lockPlan():((typeof CURP!=='undefined'&&CURP&&CURP.plan)||null);}
function pwSigned(){ return typeof authSession==='function'&&!!authSession(); }
/* WHETHER THE PERSON IS INSIDE THE GIFT. The lock's own answer (lockGift), or
   on a worked example the own record's (showOwnGift, ui/personas.js), for the
   same reason pwPlan reads the own plan there. */
function pwGift(){
 if(typeof showOnly==='function'&&showOnly())return typeof showOwnGift==='function'&&showOwnGift();
 return typeof lockGift==='function'&&lockGift();}

/* ---- the words. Every string the sheet prints starts here, so the voice
   gate reads one list. ---- */
var PW_W={
 title:'Open more of your reading.',
 here:'You are here',
 soon:'Opens soon',
 seeNow:'You see this now',
 came:'You pressed this one to get here.',
 /* THE NUMBER'S MEANING, the sales director's line of 17 October. The
    allowance counts meter.unique, keys of address, channel and line a person
    has not opened before (planAllowance, meterPlan in engine/schema.js), so a
    pattern is one line at one place. Two wordings came off on the way here.
    "Never opened" went because the releasable lines hold only 65 different
    sentences, so a person could hear one again and read the promise as
    broken; the gate bans it, with "unique" and "new ones", because the pool
    is fixed. "Each one opens a new place in your body map" went because it
    was false: an address carries four channels of fifty lines, so most new
    patterns are new lines at places already opened. "Some lines share their
    words" says the 65 sentences out loud. The rerun clause of the full line,
    "Everything you have opened reruns free", is left off here because three
    sentences in one tooltip is more than one idea (the voice gate's
    tooltip-one-idea flag), which is the split the coordinator gave. */
 pat:'Each pattern is one line said at one place in your body. Some lines share their words.',
 prac:'Everything in tier three, plus cohorts of people you lead.',
 foot:'Charged monthly. Stop anytime from Billing, on the payment page.',
 refund:'Charged in the last seven days? Write to hello@atuned.world and we refund it in full.',
 billing:'Billing',
 signin:'Sign in', signinMeans:'Already paying? Sign in to bring your plan here.',
 stop:'Stop or change plan', stopMeans:'Opens the payment page, where you stop or change your plan.',
 close:'Close',
 /* the gift's state, the mockup's title, and the gift's line as Summary says
    it, so the gift has one wording */
 giftTitle:'Your whole reading is open.',
 giftTl:'Open on your gift',
 gift:function(){ return ['Your gift: '+GIFT_N+' ','patterns',', no card. Everything is open.']; }};
/* 1,200 and not 1200, the way the tiers page prints it (ptN, ui/plans.js) */
function pwN(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,','); }
/* a ring's name, off SIGHT: "the masks" is Masks on a ring */
function pwName(g){ var s=g.nm.replace(/^the /,''); return s.charAt(0).toUpperCase()+s.slice(1); }
/* A RING'S MEANING IS THE GLOSSARY'S, the one table of what a term means, read
   singular because that is how it is keyed. The registers have no entry, so
   they say SIGHT's own sentence, which is the lock's. */
function pwMean(g){
 var nm=g.nm.replace(/^the /,''), t=[nm,nm.replace(/es$/,''),nm.replace(/s$/,'')], i, m='';
 if(typeof unpackOf==='function')for(i=0;i<t.length&&!m;i++)m=unpackOf(t[i]);
 return m||g.what;}
function pwTierLine(pl,g){
 return planSees(pl,g.k)?PW_W.seeNow:'Opens at '+planNmIn(planNeed(g.k));}

/* ---- the marks ---- */
function pwGlyph(k){
 if(typeof CHAINGLYPH!=='undefined'&&CHAINGLYPH[k])return CHAINGLYPH[k];
 if(k==='reg'&&typeof CN_IC!=='undefined')return CN_IC.reg;
 if(k==='mask'&&typeof BMOVL!=='undefined'&&BMOVL.masks)return BMOVL.masks.ic;
 return '';}
function pwSvg(inner){ return '<svg viewBox="0 0 24 24" class="pw-ri" aria-hidden="true" focusable="false">'+inner+'</svg>'; }
var PW_SOON=pwSvg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
var PW_HERE=pwSvg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/>');
var PW_SEES=pwSvg('<circle cx="12" cy="12" r="9"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/>');
var PW_X=pwSvg('<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>');
/* Practitioner has no mark in the product yet: one ring leading three, drawn
   in the chain's own line (the mockup's PRAC_D) */
var PW_PRAC=pwSvg('<path d="M12 3.6a3 3 0 110 6 3 3 0 010-6M5.4 14.4a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8'
 +'M12 15.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M18.6 14.4a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8'
 +'M10.4 9.2L6.6 14.6M12 9.6v6M13.6 9.2l3.8 5.4"/>');
function pwLock(){ return pwSvg(typeof LOCK_PATH!=='undefined'?LOCK_PATH:''); }

/* ---- the pieces ---- */
var PW_ID=0;
function pwRing(pl,g,on,tl){
 var id='pwr'+(++PW_ID), came=PW.k===g.k; tl=tl||pwTierLine(pl,g);
 return '<button type="button" class="pw-rg'+(on?' on':'')+(came?' came':'')+'" data-k="'+esc(g.k)+'" data-tl="'+esc(tl)+'"'
  +' aria-label="'+esc(pwName(g)+(on?', on this tier':', not on this tier')+(came?'. '+PW_W.came:''))+'" aria-describedby="'+id+'">'
  +'<span class="pw-dk">'+pwSvg('<path d="'+pwGlyph(g.k)+'"/>')+'</span></button>'
  +'<span class="pw-vh" id="'+id+'">'+esc(pwMean(g)+' '+tl+'.')+'</span>';}

function pwCard(pl,r,pay){
 var door=PW.door===r.k, below=!r.now&&!r.up, act='';
 if(r.now)act='<div class="pw-here">'+PW_HERE+'<span>'+esc(PW_W.here)+'</span></div>';
 else if(below)act='';
 else if(!pay||!r.buy)act='<div class="pw-shut">'+PW_SOON+'<span>'+esc(PW_W.soon)+'</span></div>';
 else {
  /* the free reader starts a plan, a paying one moves to another, the same
     verbs Billing's own buttons say (Move to, ui/panels.js) */
  var free=planOf(pl).k==='free', nm=planNmIn(PLAN_BY[r.k]);
  act='<button type="button" class="pw-go'+(door?'':' quiet')+'" data-pwbuy="'+esc(r.k)+'" aria-label="'
   +esc((free?'Start ':'Move to ')+nm+', $'+r.price+' a '+r.per)+'">'
   +'<span class="pw-lg">'+esc((free?'Start ':'Move to ')+nm)+'</span><span class="pw-sh">'+esc(free?'Start':'Move up')+'</span></button>';}
 var nid='pwn'+r.k;
 return '<section class="pw-c'+(door?' door':'')+(r.now?' now':'')+'" data-pt="'+esc(r.k)+'" aria-label="'+esc(r.nm)+'">'
  +'<div class="pw-top"><div class="pw-cn">'+esc(r.nm)+'</div>'
  +'<button type="button" class="pw-hl" data-pwtip="'+nid+'" aria-describedby="'+nid+'"><span class="pw-big pw-num">'+pwN(r.grant)+'</span>'
  +'<span class="pw-pl">new <span class="pw-u">patterns</span> a '+esc(r.per)+'</span></button>'
  +'<span class="pw-vh" id="'+nid+'">'+esc(PW_W.pat)+'</span></div>'
  +'<div class="pw-low"><div class="pw-pr"><span class="pw-num">$'+esc(r.price)+'</span><span class="pw-per">a '+esc(r.per)+'</span></div>'
  +'<div class="pw-rgs">'+sightRows().map(function(g){
    return pwRing(pl,g,r.sees.some(function(s){return s.k===g.k;}));}).join('')+'</div>'
  +'<div class="pw-act">'+act+'</div></div></section>';}

function pwPrac(r,pay){
 var act=r.now?'<span class="pw-here">'+PW_HERE+'<span>'+esc(PW_W.here)+'</span></span>'
  :((pay&&r.buy)?'<button type="button" class="pw-go quiet" data-pwbuy="'+esc(r.k)+'">'+esc('Move to '+planNmIn(PLAN_BY[r.k]))+'</button>'
  :'<span class="pw-shut">'+PW_SOON+'<span>'+esc(PW_W.soon)+'</span></span>');
 return '<div class="pw-prac" data-pt="'+esc(r.k)+'"><span class="pw-pdk">'+PW_PRAC+'</span>'
  +'<button type="button" class="pw-pn" data-pwtip="pwptp" aria-describedby="pwptp"><span class="pw-u">'+esc(r.nm)+'</span></button>'
  +'<span class="pw-vh" id="pwptp">'+esc(PLAN_BY[r.k].d)+'</span>'
  +'<span class="pw-pp"><span class="pw-num">$'+esc(r.price)+'</span> a '+esc(r.per)+'</span>'
  +'<span class="pw-pw">'+esc(PW_W.prac)+'</span>'+act+'</div>';}

function pwFoot(pl){
 var live=planState(pl)==='live', signed=pwSigned();
 return '<div class="pw-ft">'+(PW_REFUND?'<p class="pw-rf">'+esc(PW_W.refund)+'</p>':'')
  +'<p class="pw-f1">'+esc(PW_W.foot)+'</p><div class="pw-links">'
  +(live?'<button type="button" data-pwact="portal" data-pwtip="pwstp" aria-describedby="pwstp">'+esc(PW_W.stop)+'</button>'
    +'<span class="pw-vh" id="pwstp">'+esc(PW_W.stopMeans)+'</span>':'')
  +'<button type="button" data-pwact="billing">'+esc(PW_W.billing)+'</button>'
  +(signed?'':'<button type="button" data-pwact="signin" data-pwtip="pwsin" aria-describedby="pwsin">'+esc(PW_W.signin)+'</button>'
    +'<span class="pw-vh" id="pwsin">'+esc(PW_W.signinMeans)+'</span>')
  +(typeof legalLink==='function'?legalLink('terms')+legalLink('privacy'):'')
  +'</div></div>';}

/* THE GIFT: every ring lit, nothing to buy, the line that says why */
function pwGiftHtml(pl){
 var w=PW_W.gift();
 return '<div class="pw-sheet pw-gift" role="dialog" aria-modal="true" aria-labelledby="pwt1" tabindex="-1">'
  +'<button type="button" class="pw-x" id="pwx" aria-label="'+esc(PW_W.close)+'">'+PW_X+'</button>'
  +'<h2 class="pw-t1" id="pwt1">'+esc(PW_W.giftTitle)+'</h2>'
  +'<div class="pw-rgs pw-giftrgs">'+sightRows().map(function(g){return pwRing(pl,g,true,PW_W.giftTl);}).join('')+'</div>'
  +'<p class="pw-gq">'+esc(w[0])+'<button type="button" class="pw-gp" data-pwtip="pwngift" aria-describedby="pwngift"><span class="pw-u">'
  +esc(w[1])+'</span></button>'+esc(w[2])+'</p><span class="pw-vh" id="pwngift">'+esc(PW_W.pat)+'</span>'
  +'<button type="button" class="pw-go pw-gclose" data-pwact="close">'+esc(PW_W.close)+'</button></div>';}
function pwHtml(){
 PW_ID=0;
 var pl=pwPlan(), rows=planLadder(pl), pay=pwPayOpen(), now=planOf(pl);
 if(pwGift())return pwGiftHtml(pl);
 var free=rows.filter(function(r){return r.k==='free';})[0];
 var cards=rows.filter(function(r){return r.k!=='free'&&!r.lead;});
 var prac=rows.filter(function(r){return r.lead;})[0];
 return '<div class="pw-sheet" role="dialog" aria-modal="true" aria-labelledby="pwt1" tabindex="-1">'
  +'<header class="pw-hd"><button type="button" class="pw-x" id="pwx" aria-label="'+esc(PW_W.close)+'">'+PW_X+'</button>'
  +'<h2 class="pw-t1" id="pwt1">'+esc(PW_W.title)+'</h2>'
  /* FREE IS A QUIET MARKER, NEVER A CARD. On a paid tier the marker moves onto
     that tier's own card. */
  +(now.k==='free'&&free?'<div class="pw-here pw-quiet">'+PW_HERE+'<span><b>'+esc(PW_W.here)+'</b> '
    +esc(free.nm+', '+free.grant+' patterns a '+free.per)+'</span></div>':'')
  +'</header>'
  +'<div class="pw-cards">'+cards.map(function(r){return pwCard(pl,r,pay);}).join('')+'</div>'
  +(prac?pwPrac(prac,pay):'')
  +pwFoot(pl)+'</div>';}

/* ---- the one tooltip the sheet has: hover, keyboard focus, or a tap ---- */
function pwTipBox(){
 if(!PW.tip){PW.tip=document.createElement('div'); PW.tip.className='pw-tip'; PW.tip.id='pwtip';
  PW.tip.setAttribute('role','tooltip'); document.body.appendChild(PW.tip);}
 return PW.tip;}
function pwTipShow(el,pin){
 var b=pwTipBox();
 if(el.classList.contains('pw-rg')){
  var k=el.getAttribute('data-k'), g=sightRows().filter(function(x){return x.k===k;})[0], tl=el.getAttribute('data-tl');
  b.innerHTML='<span class="pw-r1"><b>'+esc(pwName(g))+'</b><span class="pw-tl">'
   +(tl===PW_W.seeNow||tl===PW_W.giftTl?PW_SEES:pwLock())+'<span>'+esc(tl)+'</span></span></span><span class="pw-m">'+esc(pwMean(g))+'</span>';}
 else{var src=document.getElementById(el.getAttribute('data-pwtip'));
  b.innerHTML='<span class="pw-m">'+esc(src?src.textContent:'')+'</span>';}
 b.classList.add('on'); PW.tipOn=el; PW.pin=!!pin;
 var r=el.getBoundingClientRect(), w=Math.min(innerWidth<761?340:300,innerWidth-24); b.style.width=w+'px';
 var L=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2)); b.style.left=L+'px';
 var h=b.offsetHeight, T=r.top-h-12, up=true;
 if(T<12){T=r.bottom+12; up=false;}
 b.style.top=T+'px';
 b.classList.toggle('up',up); b.classList.toggle('dn',!up);
 b.style.setProperty('--cx',Math.round(Math.max(18,Math.min(w-18,r.left+r.width/2-L)))+'px');
 PW.el.querySelectorAll('.tipped').forEach(function(x){x.classList.remove('tipped');});
 el.classList.add('tipped');}
function pwTipHide(){
 if(PW.tip)PW.tip.classList.remove('on');
 if(PW.tipOn)PW.tipOn.classList.remove('tipped');
 PW.tipOn=null; PW.pin=false;}

/* ---- open, draw, close ---- */
/* k is the SIGHT key of the locked ring that was pressed, or null from a door
   that touched nothing. back is the control to put focus back on. */
function paywallOpen(k,back){
 if(typeof document==='undefined')return false;
 pwCss();
 var pl=pwPlan();
 /* a ring the person already sees is not a reason they came, so it marks
    nothing, and the door is the cheapest tier that opens what was pressed */
 if(k&&(pwGift()||planSees(pl,k)||!planNeed(k)))k=null;
 PW.k=k||null; PW.door=k?planNeed(k).k:null;
 PW.back=back||document.activeElement||null;
 if(typeof TIP!=='undefined')TIP.hide();
 if(!PW.el){PW.el=document.createElement('div'); PW.el.className='pw-scrim'; PW.el.id='paywall';
  document.body.appendChild(PW.el); pwWireOnce();}
 PW.el.hidden=false; PW.open=true;
 document.body.classList.add('pw-on');
 pwDraw();
 /* FOCUS GOES TO THE DIALOG, not to its first button. A screen reader reads
    the title from there, the next Tab reaches Close, and a pointer that opened
    the sheet does not find a focus ring drawn on a control it never touched */
 var s=PW.el.querySelector('.pw-sheet'); if(s)s.focus({preventScroll:true});
 return true;}
function pwDraw(){
 pwTipHide();
 PW.el.innerHTML=pwHtml();
 PW.el.querySelectorAll('.pw-rg,[data-pwtip]').forEach(function(el){
  el.addEventListener('mouseenter',function(){if(!PW.pin)pwTipShow(el,false);});
  el.addEventListener('mouseleave',function(){if(!PW.pin&&PW.tipOn===el)pwTipHide();});
  el.addEventListener('focus',function(){pwTipShow(el,false);});
  el.addEventListener('blur',function(){if(PW.tipOn===el&&!PW.pin)pwTipHide();});});}
function paywallClose(){
 if(!PW.open)return;
 pwTipHide();
 PW.open=false; PW.el.hidden=true; PW.el.innerHTML='';
 document.body.classList.remove('pw-on');
 var b=PW.back; PW.back=null;
 if(b&&b.isConnected&&typeof b.focus==='function'){try{b.focus({preventScroll:true});}catch(e){}}}
function paywallIsOpen(){ return PW.open; }

function pwWireOnce(){
 PW.el.addEventListener('click',function(e){
  var t=e.target;
  if(t===PW.el){paywallClose(); return;}
  if(t.closest('#pwx')){paywallClose(); return;}
  var tip=t.closest('.pw-rg,[data-pwtip]');
  var buy=t.closest('[data-pwbuy]');
  if(buy){
   /* THE ONE DOOR. planOpen is what Billing's Move to presses, so a press here
      meets the same refusals, the same sign in rule and the same move of a
      live plan to the payment page, said through status() as before. */
   pwTipHide(); planOpen('checkout',buy.getAttribute('data-pwbuy')); return;}
  var a=t.closest('[data-pwact]');
  if(a){var w=a.getAttribute('data-pwact');
   if(w==='portal'){pwTipHide(); planOpen('portal',null); return;}
   paywallClose();
   if(w==='close')return;
   if(w==='billing'){if(typeof planTiersOpen==='function')planTiersOpen();}
   else if(w==='signin'){ACC_OPEN='account'; setTab(TAB.SETTINGS); if(typeof renderAccount==='function')renderAccount();}
   return;}
  if(tip){e.stopPropagation();
   if(PW.tipOn===tip&&PW.pin)pwTipHide(); else pwTipShow(tip,true);
   return;}
  if(PW.tipOn)pwTipHide();});
 /* ESCAPE AND TAB, AHEAD OF THE APP. The app closes its own sheet on Escape
    (ui/panels.js) and the Field reads keys of its own, so the sheet answers
    first in the capture phase and stops the key there. Escape closes an open
    card first and the sheet second. Tab stays inside the sheet, because a
    dialog that lets focus walk into the screen behind it is not modal. */
 document.addEventListener('keydown',function(e){
  if(!PW.open)return;
  if(e.key==='Escape'){e.preventDefault(); e.stopImmediatePropagation();
   if(PW.tipOn&&PW.pin)pwTipHide(); else paywallClose(); return;}
  if(e.key==='Tab'){
   var f=[].slice.call(PW.el.querySelectorAll('button,a[href]')).filter(function(x){return x.offsetParent!==null;});
   if(!f.length)return;
   var i=f.indexOf(document.activeElement);
   if(e.shiftKey&&(i<=0)){e.preventDefault(); f[f.length-1].focus();}
   else if(!e.shiftKey&&(i<0||i===f.length-1)){e.preventDefault(); f[0].focus();}}},true);
 addEventListener('resize',function(){if(PW.open)pwTipHide();});}

/* ---- the sheet's own rules, injected once, the way plans.js and lock.js
   carry theirs, because the shell stylesheet is held by another seat ---- */
function pwCss(){
 if(document.getElementById('pw-css'))return;
 var st=document.createElement('style'); st.id='pw-css';
 st.textContent=[
  /* FLAT IN EVERY LIGHTING. Punch's rule, "nothing outlined, everything
     solid": no edges, no shadows, no glow. The sheet takes the panel tone over
     the opaque ground, so a lighting with see through panels (Glass) does not
     show the screen behind through the cards. */
  '.pw-scrim{position:fixed;inset:0;z-index:92;background:rgba(5,6,9,.78)}',
  '.pw-scrim[hidden]{display:none}',
  '.pw-sheet{position:absolute;inset:12px;display:flex;flex-direction:column;padding:16px 28px 4px;',
  ' border-radius:var(--r,16px);color:var(--ink);background:linear-gradient(var(--panel),var(--panel)),var(--bg);overflow:hidden;outline:none}',
  '.pw-ri{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;display:block}',
  '.pw-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
  '.pw-num{font-family:var(--num);font-variant-numeric:tabular-nums}',
  '.pw-sheet button{font:inherit;color:inherit}',
  '.pw-hd{display:flex;align-items:center;gap:16px;min-height:44px;padding-left:52px;position:relative}',
  '.pw-x{position:absolute;left:-12px;top:0;width:44px;height:44px;border-radius:22px;border:0;background:transparent;',
  ' color:var(--mid)!important;display:flex;align-items:center;justify-content:center;cursor:pointer}',
  '.pw-x:hover{color:var(--ink)!important;background:var(--panel-2)}',
  '.pw-x svg{width:26px;height:26px}',
  '.pw-t1{font-size:32px;line-height:1.15;font-weight:600;letter-spacing:-.012em;margin:0;flex:1}',
  '.pw-here{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 16px;border-radius:22px;',
  ' color:var(--ink);font-size:16px;font-weight:500}',
  '.pw-here svg{width:20px;height:20px;flex:none}',
  '.pw-here.pw-quiet{background:var(--panel-2);color:var(--mid);font-weight:400}',
  '.pw-here.pw-quiet b{color:var(--ink);font-weight:600}',
  /* three cards, the height of the sheet */
  '.pw-cards{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}',
  '.pw-c{background:var(--panel-2);border-radius:var(--r,16px);padding:28px 32px;display:flex;flex-direction:column;',
  ' justify-content:space-between;min-height:0;min-width:0}',
  '.pw-cn{font-size:20px;font-weight:600;color:var(--mid)}',
  /* level one, the patterns: a button, because the number carries its meaning */
  '.pw-hl{display:block;text-align:left;background:none;border:0;padding:0;margin:6px 0 0;cursor:help;border-radius:var(--r-xs,8px)}',
  '.pw-hl .pw-big{display:block;font-size:min(136px,13.6vh);line-height:.98;font-weight:600;letter-spacing:-.035em;color:var(--ink)}',
  '.pw-hl .pw-pl{display:block;font-size:24px;color:var(--mid);margin-top:6px}',
  '.pw-u{text-decoration:underline dotted;text-decoration-color:var(--mid);text-underline-offset:5px;text-decoration-thickness:2px}',
  '.pw-hl:hover .pw-pl,.pw-hl.tipped .pw-pl{color:var(--ink)}',
  /* level two, the price */
  '.pw-pr{display:flex;align-items:baseline;gap:10px}',
  '.pw-pr .pw-num{font-size:min(60px,6vh);font-weight:600;letter-spacing:-.025em;line-height:1;color:var(--ink)}',
  '.pw-per{font-size:20px;color:var(--mid)}',
  /* THE RINGS, the hero. Six columns, the same six on every card; on a
     desktop three by two, at twice the size, so the card's spare height goes
     to the hero and not to air */
  '.pw-rgs{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}',
  '@media (min-width:761px){',
  ' .pw-c .pw-rgs{grid-template-columns:repeat(3,1fr);gap:clamp(12px,2.2vh,24px) clamp(16px,2vw,36px);margin-top:clamp(14px,2.6vh,28px);',
  '  width:min(100%,calc((100vh - 560px) * 1.62))}',
  ' .pw-rg.came::after{bottom:-12px;height:5px;left:32%;right:32%}}',
  '.pw-rg{position:relative;display:flex;align-items:center;justify-content:center;aspect-ratio:1;min-width:44px;min-height:44px;',
  ' padding:0;border:0;background:none;cursor:help;border-radius:50%}',
  '.pw-dk{width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;',
  ' box-shadow:inset 0 0 0 2px var(--dim);color:var(--dim);transition:transform var(--t-micro,120ms) var(--ease-out,ease)}',
  '.pw-dk svg{width:54%;height:54%}',
  '.pw-rg.on .pw-dk{background:var(--accent);box-shadow:none;color:var(--on-accent)}',
  '.pw-rg.on .pw-dk .pw-ri{stroke-width:1.8}',
  '.pw-rg:hover .pw-dk,.pw-rg.tipped .pw-dk{transform:scale(1.06)}',
  '.pw-rg.tipped .pw-dk{box-shadow:inset 0 0 0 2px var(--ink)}',
  '.pw-rg.on.tipped .pw-dk{box-shadow:0 0 0 3px var(--panel-2),0 0 0 5px var(--ink)}',
  /* the ring that brought them in: a bar under its column, on every card */
  '.pw-rg.came::after{content:"";position:absolute;left:24%;right:24%;bottom:-11px;height:4px;border-radius:2px;background:var(--ink)}',
  '.pw-act{margin-top:30px;min-height:60px;display:flex}',
  '.pw-act>*{flex:1}',
  '.pw-go{display:flex;align-items:center;justify-content:center;gap:10px;min-height:60px;padding:0 24px;border-radius:30px;border:0;',
  ' background:var(--accent);color:var(--on-accent)!important;font-size:19px!important;font-weight:600;cursor:pointer;width:100%}',
  '.pw-go:hover{background:color-mix(in srgb,var(--accent) 88%,#fff)}',
  /* LUMEN'S ACCENT IS TOO BRIGHT TO CARRY WHITE WORDS. Measured by
     tests/paywall.js: white on #0091EA reads 3.37 to 1, under the 4.5 the
     words need. The same blue, deepened toward black, reads above it; the
     rings keep the bright one, because a mark's floor is 3 and they hold it. */
  'body.lumen .pw-go:not(.quiet),body.lumen .pw-go:not(.quiet):hover{background:color-mix(in srgb,var(--accent) 72%,#000)}',
  '.pw-go.quiet{background:var(--sunk);color:var(--ink)!important;font-weight:500}',
  '.pw-go.quiet:hover{background:color-mix(in srgb,var(--sunk) 70%,var(--panel))}',
  '.pw-go .pw-sh{display:none}',
  /* not a button: a slot that says what is true. No pill, no fill */
  '.pw-shut{display:flex;align-items:center;justify-content:center;gap:8px;min-height:60px;padding:0 12px;color:var(--mid);',
  ' font-size:18px;font-weight:500;text-align:center}',
  '.pw-shut svg{width:20px;height:20px;flex:none}',
  '.pw-act .pw-here{font-size:18px;min-height:60px}',
  /* Practitioner, one slim row under the three */
  '.pw-prac{display:flex;align-items:center;gap:16px;margin-top:12px;min-height:60px;padding:0 20px 0 14px;',
  ' border-radius:var(--r-s,11px);background:var(--sunk);color:var(--mid);font-size:16px}',
  '.pw-pdk{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
  ' box-shadow:inset 0 0 0 2px var(--dim);color:var(--dim);flex:none}',
  '.pw-pdk svg{width:24px;height:24px}',
  '.pw-pn{background:none;border:0;padding:0 2px;min-height:44px;font-size:17px!important;font-weight:600;color:var(--ink)!important;cursor:help}',
  '.pw-pp{color:var(--ink)}',
  '.pw-pp .pw-num{font-weight:600}',
  '.pw-pw{flex:1}',
  '.pw-prac .pw-shut,.pw-prac .pw-here{min-height:44px;font-size:16px;padding:0}',
  '.pw-prac .pw-go{width:auto;min-height:44px;font-size:16px!important}',
  /* the foot, one line */
  '.pw-ft{display:flex;align-items:center;justify-content:center;gap:4px 14px;flex-wrap:wrap;font-size:14px;color:var(--mid);margin-top:2px}',
  '.pw-ft p{margin:0}',
  '.pw-rf{flex-basis:100%;text-align:center;margin-top:6px!important}',
  '.pw-links{display:flex;justify-content:center;flex-wrap:wrap;gap:0 4px}',
  '.pw-links a,.pw-links button{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;',
  ' color:var(--mid)!important;text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--mid) 45%,transparent);',
  ' text-underline-offset:3px;background:none;border:0;cursor:pointer;font-size:14px!important}',
  '.pw-links a:hover,.pw-links button:hover{color:var(--ink)!important}',
  '.pw-links [data-pwact="portal"]{color:var(--ink)!important}',
  /* the card a ring opens: opaque, over every surface, the ink on a tone
     mixed from the ground so it holds in every lighting */
  '.pw-tip{position:fixed;z-index:93;display:none;background:color-mix(in srgb,var(--ink) 18%,var(--bg));color:var(--ink);',
  ' border-radius:var(--r-s,11px);padding:12px 14px;font-size:14.5px;line-height:1.4;pointer-events:none}',
  '.pw-tip.on{display:grid;gap:4px}',
  '.pw-tip::after{content:"";position:absolute;left:calc(var(--cx,50%) - 8px);width:16px;height:8px;background:inherit}',
  '.pw-tip.up::after{bottom:-8px;clip-path:polygon(0 0,100% 0,50% 100%)}',
  '.pw-tip.dn::after{top:-8px;clip-path:polygon(50% 0,100% 100%,0 100%)}',
  '.pw-tip b{font-size:16px;font-weight:600}',
  '.pw-tip .pw-r1{display:contents}',
  '.pw-tip .pw-r1 b{order:0}',
  '.pw-tip .pw-m{order:1;color:var(--ink)}',
  '.pw-tip .pw-tl{order:2;display:flex;align-items:center;gap:8px;color:var(--ink);font-weight:600}',
  '.pw-tip .pw-tl svg{width:18px;height:18px;flex:none}',
  'body.pw-on #tip{display:none!important}',
  /* the gift: six lit rings in the middle, the line, and Close */
  '.pw-sheet.pw-gift{align-items:center;justify-content:center;text-align:center;padding:16px 28px}',
  '.pw-gift .pw-x{left:14px;top:14px}',
  '.pw-gift .pw-t1{flex:none;font-size:48px;padding:0 52px}',
  '.pw-gift .pw-giftrgs{width:min(1240px,100%);gap:28px;margin-top:48px}',
  '.pw-gq{font-size:20px;color:var(--mid);margin:44px 0 28px}',
  /* a word in a sentence that carries its meaning: 44 tall to a finger, and
     the padding is paid back by the margin so the line it sits in keeps its
     own spacing (measured at 390: a 44 pixel box opened the line by a third) */
  '.pw-gp{display:inline;background:none;border:0;padding:13px 0;margin:-13px 0;min-height:0;cursor:help;color:var(--mid)!important;font-size:inherit!important;line-height:inherit}',
  '.pw-gift .pw-gclose{width:min(360px,100%)}',
  /* THE PHONE. The sheet is the screen; each card is one row of name and
     number beside the price, the six rings across, and the one action */
  '@media (max-width:760px){',
  ' .pw-sheet{inset:0;padding:6px 16px 0;border-radius:0}',
  ' .pw-hd{flex-wrap:wrap;gap:4px 8px;padding-left:46px;min-height:44px}',
  ' .pw-x{left:-10px}',
  ' .pw-t1{font-size:21px;flex-basis:100%;padding-top:10px}',
  ' .pw-hd .pw-here.pw-quiet{margin-left:-46px;min-height:32px;padding:0 12px;font-size:14px;margin-top:6px}',
  ' .pw-here svg{width:16px;height:16px}',
  ' .pw-cards{grid-template-columns:1fr;grid-auto-rows:1fr;gap:8px;margin-top:8px}',
  ' .pw-c{display:grid;grid-template-columns:1fr auto;grid-template-areas:"top pr" "rg rg" "act act";align-content:space-between;',
  '  padding:10px 12px 10px 14px;border-radius:var(--r-s,11px);row-gap:4px}',
  ' .pw-top{grid-area:top}',
  ' .pw-low{display:contents}',
  ' .pw-cn{font-size:14px}',
  ' .pw-hl{margin:0;min-height:44px}',
  ' .pw-hl .pw-big{font-size:40px;line-height:1;display:inline}',
  ' .pw-hl .pw-pl{display:inline;font-size:14px;margin-left:6px}',
  ' .pw-u{text-underline-offset:3px;text-decoration-thickness:1.5px}',
  ' .pw-pr{grid-area:pr;flex-direction:column;align-items:flex-end;gap:0;align-self:start}',
  ' .pw-pr .pw-num{font-size:30px}',
  ' .pw-per{font-size:13px}',
  ' .pw-rgs{grid-area:rg;gap:6px;margin-top:2px}',
  ' .pw-rg{aspect-ratio:auto;height:44px}',
  ' .pw-dk{width:40px;height:40px;flex:none}',
  ' .pw-rg.came::after{bottom:-5px;height:3px;left:30%;right:30%}',
  ' .pw-act{grid-area:act;margin-top:6px;min-height:44px}',
  ' .pw-go,.pw-shut,.pw-act .pw-here{min-height:44px;font-size:15px!important;border-radius:22px}',
  ' .pw-go .pw-lg{display:none}',
  ' .pw-go .pw-sh{display:inline}',
  ' .pw-shut svg{width:16px;height:16px}',
  ' .pw-prac{margin-top:8px;min-height:48px;gap:8px;padding:0 10px 0 6px;font-size:13px;flex-wrap:nowrap}',
  ' .pw-pdk{width:34px;height:34px}',
  ' .pw-pdk svg{width:20px;height:20px}',
  ' .pw-pn{font-size:14px!important;padding:0}',
  ' .pw-pw{display:none}',
  ' .pw-pp{flex:1}',
  ' .pw-prac .pw-shut,.pw-prac .pw-here{font-size:13px;gap:5px}',
  ' .pw-prac .pw-shut svg{width:15px;height:15px}',
  ' .pw-ft{font-size:13px;gap:0 6px;margin-top:0}',
  ' .pw-links a,.pw-links button{padding:0 7px;font-size:13px!important}',
  ' .pw-rf{font-size:12.5px}',
  /* a compact card: the name and its tier on one row, the meaning under it */
  ' .pw-tip{padding:9px 12px;font-size:14px}',
  ' .pw-tip .pw-r1{display:flex;align-items:center;justify-content:space-between;gap:10px;order:0}',
  ' .pw-tip .pw-r1 b{font-size:15px;white-space:nowrap}',
  ' .pw-tip .pw-tl{font-size:13.5px;gap:6px;white-space:nowrap}',
  ' .pw-tip .pw-tl svg{width:15px;height:15px}',
 ' .pw-sheet.pw-gift{padding:16px}',
 ' .pw-gift .pw-x{left:6px;top:6px}',
 ' .pw-gift .pw-t1{font-size:26px;padding:0 30px;text-wrap:balance}',
 ' .pw-gift .pw-giftrgs{margin-top:28px;gap:18px;grid-template-columns:repeat(3,1fr);width:min(320px,100%)}',
 ' .pw-gift .pw-giftrgs .pw-rg{aspect-ratio:1;height:auto}',
 ' .pw-gift .pw-giftrgs .pw-dk{width:100%;height:100%}',
 ' .pw-gq{font-size:15px;margin:24px 0 18px}}'].join('\n');
 document.head.appendChild(st);}
