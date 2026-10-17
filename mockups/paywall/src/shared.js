/* ============================================================
   PAYWALL MOCKUPS, SHARED. The ladder (LADDER), the six marks (GLYPH),
   the padlock (LOCK) and the figure (BODY) are injected by build.js out
   of the product's own files. Everything a person reads is in WORDS
   below, in one place, so the voice gate reads one list.
   ============================================================ */
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const Q=new URLSearchParams(location.search);
const EMBED=Q.get('embed')==='1';

/* ---- the states a person can meet this screen in ---- */
const STATES=[
 {k:'gift',   nm:'On the gift', note:'A person on the hundred pattern gift sees everything: no padlocks, no price, no counting. Emmy\'s call: ask for money only once the gift has run out.'},
 {k:'closed', nm:'Today: paying closed', note:'Signed in on free. Checkout is switched off on the server today (STRIPE_BILLING_ENABLED is 0), so nothing can be paid and no press pretends it can.'},
 {k:'open',   nm:'Paying open, signed in on free', note:'How it reads the day checkout opens, for a person signed in on free.'},
 {k:'out',    nm:'Signed out', note:'Paying open, nobody signed in. The account is made inside the panel after a plan is chosen, never by a trip to Settings.'},
 {k:'one',    nm:'Already on tier one', note:'Paying open, on tier one. Its card says so in words; the tiers above offer a move.'},
 {k:'failed', nm:'Payment failed', note:'Back from the payment page without paying. The plan is kept, nothing was charged, and the refusal says so.'},
 {k:'stop',   nm:'Stop or change plan', note:'The stop screen, one press from Billing or from the foot of this one.'}];
const S=STATES.some(s=>s.k===Q.get('s'))?Q.get('s'):'closed';
const ON=(S==='one'||S==='stop')?'one':(S==='gift'?'gift':'free');   /* the tier in force */
/* the refund line is a demo switch, off unless asked for: it may only show once the
   terms page is served and the address in it answers (Emmy, 17 October) */
const REFUND=Q.get('r')==='1';
const SIGNED=S!=='out';

/* ---- the ladder, read ---- */
const TIERS=LADDER.tiers, ROWS=LADDER.sight;
const ROW=k=>ROWS.filter(g=>g.k===k)[0];
const TIER=k=>TIERS.filter(t=>t.k===k)[0];
const RANK={free:0,one:1,two:2,three:3,four:4,gift:9};
/* the tier that opens a thing: SIGHT's need, which is planNeed in the product */
const needOf=k=>ROW(k)?ROW(k).need:null;
const seesNow=k=>RANK[ON]>=RANK[needOf(k)];
/* the touched layer. It has to be one the person cannot see yet, so a person on
   tier one who touched saboteurs is treated as having come from Billing. */
let T=ROWS.some(g=>g.k===Q.get('t'))?Q.get('t'):(Q.get('t')==='none'?'none':'sab');
if(T!=='none'&&seesNow(T))T='none';
const TOUCHED=T==='none'?null:ROW(T);
/* the card the door picks, in the versions that pick: the cheapest tier that opens
   what was touched, and none when the person came from Billing */
const DOOR=TOUCHED?TOUCHED.need:null;

/* ---- the words. Every string a person reads on these pages starts here. ---- */
const N=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const MEAN={
 sab:'Habits that run on your charge.',
 cx:'Two saboteurs joined into one.',
 hy:'Complexes running together.',
 sup:'What your whole chain builds into.',
 reg:'Each pattern\'s place on the compass.',
 mask:'The six ways you show up.'};
const WORD={sab:'Saboteurs',cx:'Complexes',hy:'Hyper complexes',sup:'Character',reg:'Registers',mask:'Masks'};
const W={
 title:'Open more of your reading.',
 per:'a month',
 grant:t=>N(t.grant)+' new patterns a month',
 opens:k=>'Opens '+ROW(k).nm,
 /* the one button names the card it will charge for (Emmy's call 1) */
 start:t=>(ON==='free'?'Start ':'Move to ')+t.nm.toLowerCase()+', $'+t.price+' a month',
 open:t=>(ON==='free'?'Start ':'Move to ')+t.nm.toLowerCase(),
 openShort:t=>(ON==='free'?'Start':'Move up'),
 soon:'Opens soon',
 soonGo:'Paying opens soon',
 onThis:'You are on this',
 seen:'You see this',
 pickFirst:'Pick a tier',
 giftTitle:'Your whole reading is open.',
 gift:'Your gift: '+LADDER.gift+' patterns, no card. Everything is open.',
 four:'Tier four, $'+LADDER.four.price+' a month, adds tools for leading a group. Opens with the lead suite.',
 pattern:'A pattern is one line, said once, in a release.',
 /* true on the day checkout opens only once the server can stop a plan at the
    month's end; until then it is the copy that will be true (README) */
 foot1:'Charged monthly until you stop. Stopping runs to the month\'s end and deletes nothing.',
 foot3:'Your reading stays on every tier, free included.',
 foot2:'Charged in the last seven days? Write to hello@atuned.world and we refund it in full.',
 stopLink:'Stop or change plan',
 restore:'Restore', restoreMeans:'Already paying? Sign in to bring your plan here.',
 terms:'Terms', privacy:'Privacy',
 failed:'The payment did not go through, so nothing was charged. Press again to go back to the payment page.',
 acctHead:'Make an account to pay.',
 acctWhy:'An account holds your plan, so you can stop it later.',
 acctNew:'Make account and pay', acctOld:'Sign in and pay',
 acctToOld:'I have an account', acctToNew:'I am new here',
 email:'Email', password:'Password',
 next:t=>'Demo: this press opens the payment page for '+t.nm.toLowerCase()+'. Stripe, the company that takes the card, draws that page.',
 nextAcct:'Demo: this press makes the account, then opens the payment page.',
 close:'Close',
 seeAll:'See all plans', seeOne:'Show one plan',
 stop:{title:'Stop your plan.', stays:'Stays', staysV:'Everything you made: readings, stories and releases.',
  ends:'Ends', endsV:'Tier one runs until 14 November, then stops.',
  after:'After', afterV:'Free: your own reading, and '+LADDER.free.grant+' new patterns a week.',
  go:'Stop tier one', change:'Change plan instead',
  done:'Tier one stops on 14 November. Nothing was deleted.', undo:'Turn tier one back on'}};

/* ---- marks ---- */
const svgP=(d,cls)=>'<svg viewBox="0 0 24 24" class="ri'+(cls?' '+cls:'')+'" aria-hidden="true" focusable="false"><path d="'+d+'"/></svg>';
const lockSvg=()=>'<svg viewBox="0 0 24 24" class="ri" aria-hidden="true" focusable="false">'+LOCK+'</svg>';
const icon=k=>svgP(GLYPH[k]);
/* a ring mark, with the small ring padlock when the person cannot see it yet */
const mark=(k,px,locked)=>'<span class="mk" style="width:'+px+'px;height:'+px+'px">'+icon(k)
 +(locked?'<span class="lk">'+lockSvg()+'</span>':'')+'</span>';
const closeSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>';
/* the ring check beside a picked card, so colour is never the only sign (Emmy's call 3) */
const pickSvg=on=>'<svg class="pm" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.2"/>'+(on?'<path d="M6.2 10.3l2.6 2.6 5-5.4"/>':'')+'</svg>';
const soonSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const failSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.2v.1"/></svg>';
const staysSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/></svg>';
const endsSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7v5l3 2"/></svg>';
const afterSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/></svg>';
const price=t=>'<span class="num">$'+t.price+'</span>';

/* ---- shared pieces ---- */
function xBtn(){return '<button class="x" type="button" id="x" aria-label="'+W.close+'">'+closeSvg+'</button>';}
/* A TERM WITH NO ROOM FOR ITS MEANING CARRIES IT (V23): a dotted underline that opens
   the meaning on hover, on keyboard focus and on a tap. The product's own tooltip
   does the same three. */
function term(word,means){return '<button type="button" class="term" data-tip="'+means+'" aria-describedby="tp-'+word+'">'+word+'</button>'
 +'<span class="vh" id="tp-'+word+'">'+means+'</span>';}
/* THE LEDE IS GONE (Emmy's call 6: no Free row, no "Your tier"). Its slot holds the
   one refusal this screen can need, after a failed payment, which is the newest fact. */
function lede(){return S==='failed'?'<span class="failin">'+failSvg+'<span>'+W.failed+'</span></span>':'';}
function ledeP(){const l=lede();return l?'<p class="lede">'+l+'</p>':'';}
/* the pattern, glossed once, as the line under the plans */
function glossP(){return '<p class="gl">'+W.pattern+'</p>';}
function wireTips(root){
 let tip=$('.tipbox');if(!tip){tip=document.createElement('div');tip.className='tipbox';tip.setAttribute('role','tooltip');document.body.appendChild(tip);}
 const show=el=>{tip.textContent=el.dataset.tip;tip.classList.add('on');const r=el.getBoundingClientRect(),w=Math.min(320,innerWidth-24);
  tip.style.width=w+'px';let L=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));tip.style.left=L+'px';tip.style.top=(r.bottom+8)+'px';};
 const hide=()=>tip.classList.remove('on');
 $$('.term',root).forEach(el=>{el.onmouseenter=()=>show(el);el.onmouseleave=hide;el.onfocus=()=>show(el);el.onblur=hide;el.onclick=e=>{e.stopPropagation();tip.classList.contains('on')?hide():show(el);};});
 document.addEventListener('click',hide);}
function footHtml(){
 return '<div class="foot"><p>'+W.foot1+'</p><p>'+W.foot3+'</p>'+(REFUND?'<p>'+W.foot2+'</p>':'')
  +'<div class="links"><button type="button" class="stop" data-act="stop">'+W.stopLink+'</button>'
  +'<button type="button" data-act="restore" title="'+W.restoreMeans+'" aria-describedby="rsm">'+W.restore+'</button>'
  +'<span class="vh" id="rsm">'+W.restoreMeans+'</span>'
  +'<a href="#" data-act="terms">'+W.terms+'</a><a href="#" data-act="privacy">'+W.privacy+'</a></div></div>';}
function acctHtml(t){
 const old=STATE.acctOld;
 return '<form class="acct" onsubmit="return false"><p class="why"><b style="color:var(--ink);font-weight:600">'+W.acctHead+'</b> '+W.acctWhy+'</p>'
  +'<label>'+W.email+'<input type="email" autocomplete="email" value="angela@example.com"></label>'
  +'<label>'+W.password+'<input type="password" autocomplete="'+(old?'current':'new')+'-password" value="demodemo"></label>'
  +'<button class="go" type="submit" data-act="pay" data-t="'+t.k+'">'+(old?W.acctOld:W.acctNew)+'</button>'
  +'<button class="alt" type="button" data-act="acctswap">'+(old?W.acctToNew:W.acctToOld)+'</button></form>';}
/* the refusal after a failed payment takes the lede's place: it is the newest fact */
function failHtml(){return '';}

/* the stop screen: one press from Billing, or from this paywall's foot */
function stopHtml(){
 const done=STATE.stopped;
 return '<div class="sheet stopsheet" role="dialog" aria-modal="true" aria-labelledby="st1">'+xBtn()
  +'<h1 class="t1" id="st1">'+(done?W.stop.done:W.stop.title)+'</h1>'
  +(done?'':'<ul class="facts">'
   +'<li>'+staysSvg+'<span><span class="k">'+W.stop.stays+'</span><span class="v">'+W.stop.staysV+'</span></span></li>'
   +'<li>'+endsSvg+'<span><span class="k">'+W.stop.ends+'</span><span class="v">'+W.stop.endsV+'</span></span></li>'
   +'<li>'+afterSvg+'<span><span class="k">'+W.stop.after+'</span><span class="v">'+W.stop.afterV+'</span></span></li></ul>')
  +'<div class="acts">'+(done
    ?'<button class="go" type="button" data-act="close">'+W.close+'</button><button class="back" type="button" data-act="undo">'+W.stop.undo+'</button>'
    :'<button class="go" type="button" data-act="stopgo">'+W.stop.go+'</button><button class="back" type="button" data-act="change">'+W.stop.change+'</button>')
  +'</div>'+(REFUND?'<div class="foot"><p>'+W.foot2+'</p></div>':'')
  +'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}

/* THE GIFT (Emmy's call 8). A person on the hundred pattern gift is never sent to the
   paywall: every layer is open, saboteurs are already drawn, the rest are one press
   away. No padlock, no price, no count. This is the sheet a press on Billing shows
   them, in the same family, so the four mockups can be compared on it. */
function giftHtml(){
 return '<div class="sheet giftsheet" role="dialog" aria-modal="true" aria-labelledby="g1">'+xBtn()
  +'<h1 class="t1" id="g1">'+W.giftTitle+'</h1>'
  +'<ul class="glayers" aria-label="Every layer, open">'+ROWS.map(g=>'<li><button type="button" class="gl-b'+(g.k==='sab'?' on':'')+'" aria-pressed="'+(g.k==='sab')+'" data-act="layer" data-k="'+g.k+'">'
   +mark(g.k,28,false)+'<span><b>'+WORD[g.k]+'</b><span class="m">'+MEAN[g.k]+'</span></span>'+(g.k==='sab'?pickSvg(true):'')+'</button></li>').join('')+'</ul>'
  +'<p class="gq">'+W.gift+'</p>'
  +'<button class="go" type="button" data-act="close">'+W.close+'</button>'
  +'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}
/* the app behind the sheet: the Field's rings, flat and quiet, so the sheet reads as
   over the instrument and not as a page of its own */
function behindSvg(){
 let s='<svg viewBox="0 0 400 400" aria-hidden="true">';
 [180,150,120,90,60].forEach((r,i)=>{s+='<circle cx="200" cy="200" r="'+r+'" fill="none" stroke="var(--panel-2)" stroke-width="'+(10-i)+'"/>';});
 return s+'</svg>';}

/* ---- the frame: the demo bar, the drawer, and the phone view ---- */
const STATE={go:Q.get('go')==='1',acctOld:false,stopped:Q.get('done')==='1',all:Q.get('all')==='1',pick:null,phone:Q.get('ph')==='1'};
function qs(o){const p=new URLSearchParams(location.search);Object.keys(o).forEach(k=>{if(o[k]==null)p.delete(k);else p.set(k,o[k]);});return '?'+p.toString();}
function frame(){
 const app=$('#app');
 if(EMBED){document.body.classList.add('embed');app.innerHTML='<main class="stage" id="stage"></main>';return;}
 const st=STATES.filter(s=>s.k===S)[0];
 app.innerHTML='<div class="demo" role="region" aria-label="Mockup controls"><span class="dl"><b>Paywall mockup '+VERSION.n+', '+VERSION.name.toLowerCase()+'.</b><span class="long"> Demo data, not a real person.</span></span>'
  +'<span class="sp"></span><button class="dbtn" type="button" id="dtog" aria-expanded="false" aria-controls="drawer">Demo controls</button></div>'
  +'<div class="drawer" id="drawer">'
  +'<div class="row"><span class="lab">Mockup</span>'+VERSIONS.map(v=>'<a href="'+v.id+'.html'+qs({})+'"'+(v.id===VERSION.id?' aria-current="page"':'')+'>'+v.n+'. '+v.name+'</a>').join('')+'</div>'
  +'<div class="row"><span class="lab">State</span>'+STATES.map(s=>'<a href="'+qs({s:s.k,go:null,done:null})+'"'+(s.k===S?' aria-current="true"':'')+'>'+s.nm+'</a>').join('')+'</div>'
  +'<div class="row"><span class="lab">Came from</span><a href="'+qs({t:'none'})+'"'+(T==='none'?' aria-current="true"':'')+'>Billing, nothing touched</a>'
  +ROWS.map(g=>{const off=RANK[ON]>=RANK[g.need];return off?'<button type="button" disabled title="Already seen on tier one">'+WORD[g.k]+', locked</button>'
    :'<a href="'+qs({t:g.k})+'"'+(g.k===T?' aria-current="true"':'')+'>'+WORD[g.k]+', locked</a>';}).join('')+'</div>'
  +'<div class="row"><span class="lab">Refund line</span><a href="'+qs({r:null})+'"'+(REFUND?'':' aria-current="true"')+'>Off, until the terms page is served</a><a href="'+qs({r:'1'})+'"'+(REFUND?' aria-current="true"':'')+'>On</a></div>'
  +'<div class="row"><span class="lab">View</span><a href="'+qs({ph:null})+'"'+(STATE.phone?'':' aria-current="true"')+'>This window</a><a href="'+qs({ph:'1'})+'"'+(STATE.phone?' aria-current="true"':'')+'>Phone, 390 by 844</a></div>'
  +'<p class="note">'+st.note+' The touched layer is the locked ring the person pressed to get here. Every price, allowance and tier is read from the product\'s own plan table at build time. Demo dates: tier one renewed 14 October 2026.</p></div>'
  +'<main class="stage" id="stage"></main>';
 const dt=$('#dtog');dt.onclick=()=>{const o=$('#drawer').classList.toggle('open');dt.setAttribute('aria-expanded',String(o));};}

/* ---- one press handler for every version ---- */
let STATUS=()=>{};
function wireCommon(root){
 root.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act;
  if(a==='terms'||a==='privacy'){e.preventDefault();STATUS('Demo: opens the '+(a==='terms'?'terms':'privacy')+' page.');return;}
  if(a==='restore'){STATUS('Demo: opens sign in. '+W.restoreMeans);return;}
  if(a==='stop'){if(ON!=='one'){STATUS('Demo: on a paid tier this opens the stop screen. There is no plan to stop on free.');return;}location.search=qs({s:'stop',done:null});return;}
  if(a==='change'){location.search=qs({s:'one',done:null});return;}
  if(a==='stopgo'){STATE.stopped=true;draw();return;}
  if(a==='undo'){STATE.stopped=false;draw();STATUS('Demo: tier one carries on and renews on 14 November.');return;}
  if(a==='close'||b.id==='x'){STATUS('Demo: closes and goes back to where you were.');return;}
  if(a==='acctswap'){STATE.acctOld=!STATE.acctOld;draw();return;}
  if(a==='pay'){STATUS(W.nextAcct);return;}
  if(a==='buy'){const t=TIER(b.dataset.t);
   if(!SIGNED){STATE.go=true;STATE.pick=t.k;draw();return;}
   STATUS(W.next(t));return;}
  if(a==='pick'){STATE.pick=b.dataset.t;STATE.go=false;draw();return;}
  if(a==='layer'){$$('.gl-b',root).forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on));const p=x.querySelector('.pm');if(p)p.remove();if(on)x.insertAdjacentHTML('beforeend',pickSvg(true));});STATUS('Demo: draws '+ROW(b.dataset.k).nm+' on your Field.');return;}
  if(a==='all'){STATE.all=!STATE.all;draw();return;}});
 const x=$('#x',root);if(x)x.onclick=()=>STATUS('Demo: closes and goes back to where you were. Esc does the same.');}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const d=$('#drawer');if(d&&d.classList.contains('open')){d.classList.remove('open');$('#dtog').setAttribute('aria-expanded','false');}else STATUS('Demo: Esc closes and goes back to where you were.');}});

function draw(){
 const stage=$('#stage');
 if(STATE.phone&&!EMBED){stage.innerHTML='<div class="phone"><iframe title="The same mockup at phone width" src="'+location.pathname.split('/').pop()+qs({ph:null,embed:'1'})+'"></iframe></div>';return;}
 stage.innerHTML='<div class="behind">'+behindSvg()+'</div><div class="scrim"></div>'+(S==='stop'?stopHtml():S==='gift'?giftHtml():render());
 const st=$('#st');STATUS=m=>{if(st)st.textContent=m;};
 wireCommon(stage);wireTips(stage);
 if(typeof wire==='function')wire(stage);}
window.addEventListener('DOMContentLoaded',()=>{frame();if(STATE.go&&!SIGNED)STATE.pick=STATE.pick||Q.get('pk')||DOOR||'one';draw();});
