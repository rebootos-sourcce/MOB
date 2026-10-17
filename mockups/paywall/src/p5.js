/* ============================================================
   P5, FLAT CARDS, SECOND CUT. The owner's pick of the four, 17 October,
   graded C minus: "It's not maximizing the space. There's too much text at
   the bottom ... More visual, more show, less tell. Icons, I can hover over
   the icons and get information on what features I may be missing."

   WHAT CHANGED FROM P1, AND WHO CALLED IT.
   - Petra: the sheet fills the stage. Three cards take the height, and the
     six rings under each price are the hero, in the same six columns on every
     card, so the eye reads across them like a table with no lines.
   - Sol: a ring a tier opens is a solid disc of the accent with its mark in
     line on top (the mark stays a ring, the house rule; the disc is the flat
     fill he asked for). A ring a tier does not open is a grey outline. Solid
     against outline is a change of form, so colour is never the only sign.
     One colour for every card: tiers are ranked by how much is lit, never by
     hue.
   - Bjorn: the patterns number is the headline of each card, the price the
     second level, the tier name the third, by size and value. The legend, the
     gloss line, the footer essay and tier four's sentence are gone.
   - Mika: every ring is a button. Hover, keyboard focus or a tap opens one
     short card: its name, one plain sentence, and the tier that opens it. The
     ring the person pressed to get here is marked under its column on every
     card.

   The ladder is still read off atuned_src/engine/plan.js at build time. The
   one thing typed here is the fifth rung's NAME: the owner ruled on 17 October
   that tier four is called Practitioner, and plan.js still says "Tier four"
   (PLANS, k:'four'). Its price, its allowance and whether it can be bought
   come from plan.js like everything else.
   ============================================================ */
const PRAC={nm:'Practitioner',price:LADDER.four.price,grant:LADDER.four.grant,buy:LADDER.four.buy};
const NUM=n=>N(n);
const TIERWORD={one:'tier one',two:'tier two',three:'tier three'};
const W5={
 here:'You are here',
 free:'Free, '+LADDER.free.grant+' patterns a '+LADDER.free.per,
 pats:'patterns a month',
 /* the number's own meaning, said once per card on hover, focus or tap. Checked
    against the code: the allowance counts meter.unique, lines never opened
    before, and a rerun of an open line is charged nothing (relRerunPlan). */
 patTip:t=>'A pattern is a reaction you keep having, placed at one spot in your body. '
  +NUM(t.grant)+' new ones open for you every month. Ones you have opened come back free, so you feel their weight.',
 opensAt:k=>'Opens at '+TIERWORD[needOf(k)],
 seeNow:'You see this now',
 start:t=>(ON==='free'?'Start ':'Move to ')+t.nm.toLowerCase(),
 startSh:()=>(ON==='free'?'Start':'Move up'),
 soon:'Opens soon',
 prac:'For people who lead others',
 pracTip:'Everything tier three has, '+NUM(PRAC.grant)+' patterns a month and all six rings, plus tools to guide the people you lead. It opens once those tools are built.',
 foot:'Stop anytime, in two presses.',
 acctHead:'Make an account to pay.',
 giftLine:'Your gift: '+LADDER.gift+' patterns, no card.',
 failed:'The payment did not go through. Nothing was charged.',
 came:'You came from here',
 stop:{stays:'Everything you made.', ends:'14 November.', after:W.stop.afterV.replace(': your own reading, and ',', ').replace(' new patterns',' patterns')}};

/* the one mark that has no home in the product yet: Practitioner. One ring
   leading three, drawn in the same line as the chain's marks. */
const PRAC_D='M12 3.6a3 3 0 110 6 3 3 0 010-6M5.4 14.4a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M12 15.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M18.6 14.4a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M10.4 9.2L6.6 14.6M12 9.6v6M13.6 9.2l3.8 5.4';
const hereSvg='<svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/></svg>';

/* ---- a ring, as a button. on: this tier opens it. ---- */
let RID=0;
function ring(k,tk,on){
 const id='rd'+(++RID), came=TOUCHED&&TOUCHED.k===k;
 const tierLine=seesNow(k)?W5.seeNow:W5.opensAt(k);
 return '<button type="button" class="rg5'+(on?' on':'')+(came?' came':'')+'" data-k="'+k+'" data-tl="'+tierLine+'"'
  +' aria-label="'+WORD[k]+(on?', on this tier':', not on this tier')+(came?'. '+W5.came:'')+'" aria-describedby="'+id+'">'
  +'<span class="dk">'+icon(k)+'</span></button>'
  +'<span class="vh" id="'+id+'">'+MEAN[k]+' '+tierLine+'.</span>';}
function rings(t,lit){return '<div class="rgs">'+ROWS.map(g=>ring(g.k,t.k,lit(g.k))).join('')+'</div>';}

/* ---- one card ---- */
function card5(t){
 const door=DOOR===t.k, now=ON===t.k, below=RANK[t.k]<RANK[ON];
 let act;
 if(now)act='<div class="herechip">'+hereSvg+'<span>'+W5.here+'</span></div>';
 else if(below)act='';
 else if(S==='closed')act='<div class="shut">'+soonSvg+'<span>'+W5.soon+'</span></div>';
 else act='<button class="go'+(door?'':' quiet')+'" type="button" data-act="buy" data-t="'+t.k+'" aria-label="'+W.start(t)+'">'
  +'<span class="lg">'+W5.start(t)+'</span><span class="sh">'+W5.startSh()+'</span></button>';
 const id='pt'+t.k;
 return '<section class="c5'+(door?' door':'')+(now?' now':'')+'" data-pt="'+t.k+'" aria-label="'+t.nm+'">'
  +'<div class="top"><div class="cn">'+t.nm+'</div>'
  +'<button type="button" class="hl" data-tip5="'+id+'" aria-describedby="'+id+'"><span class="big num">'+NUM(t.grant)+'</span>'
  +'<span class="pl"><span class="u">patterns</span> a month</span></button>'
  +'<span class="vh" id="'+id+'">'+W5.patTip(t)+'</span></div>'
  +'<div class="low"><div class="pr"><span class="num">$'+t.price+'</span><span class="per">'+W.per+'</span></div>'
  +rings(t,k=>t.sees.indexOf(k)>=0)
  +'<div class="act">'+act+'</div></div></section>';}

function head5(){
 const free=ON==='free';
 return '<header class="hd5"><h1 class="t1" id="t1">'+W.title+'</h1>'
  +(free?'<div class="herechip quiet">'+hereSvg+'<span><b>'+W5.here+'</b> '+W5.free+'</span></div>':'')
  +'</header>'
  +(S==='failed'?'<p class="fail5">'+failSvg+'<span>'+W5.failed+'</span></p>':'');}

function prac5(){
 return '<div class="pr5"><span class="dk pdk"><svg viewBox="0 0 24 24" class="ri" aria-hidden="true"><path d="'+PRAC_D+'"/></svg></span>'
  +'<button type="button" class="pn" data-tip5="ptp" aria-describedby="ptp"><span class="u">'+PRAC.nm+'</span></button>'
  +'<span class="vh" id="ptp">'+W5.pracTip+'</span>'
  +'<span class="pp"><span class="num">$'+PRAC.price+'</span> '+W.per+'</span>'
  +'<span class="pw">'+W5.prac+'</span>'
  +(PRAC.buy?'':'<span class="shut">'+soonSvg+'<span>'+W5.soon+'</span></span>')+'</div>';}

function foot5(){
 return '<div class="ft5">'+(REFUND?'<p class="rf5">'+W.foot2+'</p>':'')
  +'<p class="f1">'+W5.foot+'</p><div class="links">'
  +(ON==='one'?'<button type="button" class="stop" data-act="stop">'+W.stopLink+'</button>':'')
  +'<button type="button" data-act="restore" data-tip5="rsm" aria-describedby="rsm">'+W.restore+'</button>'
  +'<span class="vh" id="rsm">'+W.restoreMeans+'</span>'
  +'<a href="#" data-act="terms">'+W.terms+'</a><a href="#" data-act="privacy">'+W.privacy+'</a></div></div>';}

/* the account step, inside the panel: the card chosen, and two fields */
function acct5(t){
 const old=STATE.acctOld;
 return '<form class="acct" onsubmit="return false"><p class="why"><b>'+W5.acctHead+'</b></p>'
  +'<label>'+W.email+'<input type="email" autocomplete="email" value="angela@example.com"></label>'
  +'<label>'+W.password+'<input type="password" autocomplete="'+(old?'current':'new')+'-password" value="demodemo"></label>'
  +'<button class="go" type="submit" data-act="pay" data-t="'+t.k+'">'+(old?W.acctOld:W.acctNew)+'</button>'
  +'<button class="alt" type="button" data-act="acctswap">'+(old?W.acctToNew:W.acctToOld)+'</button></form>';}

function render(){
 RID=0;
 const step2=!SIGNED&&STATE.go;
 const chosen=step2?TIER(STATE.pick||DOOR||'one'):null;
 return '<div class="sheet p5'+(S==='failed'?' failed':'')+'" role="dialog" aria-modal="true" aria-labelledby="t1">'+xBtn()+head5()
  +(step2
   ?'<div class="step5">'+card5(chosen).replace('<div class="act"><button class="go','<div class="act" hidden><button class="go')+acct5(chosen)+'</div>'
   :'<div class="cards5">'+TIERS.map(card5).join('')+'</div>'+prac5())
  +foot5()+'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}

/* ---- the gift: every ring lit, nothing to buy ---- */
function giftHtml(){
 RID=0;
 return '<div class="sheet p5 gift5" role="dialog" aria-modal="true" aria-labelledby="g1">'+xBtn()
  +'<h1 class="t1" id="g1">'+W.giftTitle+'</h1>'
  +'<div class="rgs giftrgs">'+ROWS.map(g=>ring(g.k,'gift',true).replace(/data-tl="[^"]*"/,'data-tl="Open on your gift"')).join('')+'</div>'
  +'<p class="gq">'+W5.giftLine+'</p>'
  +'<button class="go" type="button" data-act="close">'+W.close+'</button>'
  +'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}

/* ---- the stop screen, two presses, the facts as marks with short words ---- */
function stopHtml(){
 const done=STATE.stopped;
 return '<div class="sheet stopsheet p5stop" role="dialog" aria-modal="true" aria-labelledby="st1">'+xBtn()
  +'<h1 class="t1" id="st1">'+(done?W.stop.done:W.stop.title)+'</h1>'
  +(done?'':'<ul class="facts">'
   +'<li>'+staysSvg+'<span><span class="k">'+W.stop.stays+'</span><span class="v">'+W5.stop.stays+'</span></span></li>'
   +'<li>'+endsSvg+'<span><span class="k">'+W.stop.ends+'</span><span class="v">'+W5.stop.ends+'</span></span></li>'
   +'<li>'+afterSvg+'<span><span class="k">'+W.stop.after+'</span><span class="v">'+W5.stop.after+'</span></span></li></ul>')
  +'<div class="acts">'+(done
    ?'<button class="go" type="button" data-act="close">'+W.close+'</button><button class="back" type="button" data-act="undo">'+W.stop.undo+'</button>'
    :'<button class="go" type="button" data-act="stopgo">'+W.stop.go+'</button><button class="back" type="button" data-act="change">'+W.stop.change+'</button>')
  +'</div>'+(REFUND?'<div class="foot"><p>'+W.foot2+'</p></div>':'')
  +'<p class="status" role="status" aria-live="polite" id="st"></p></div>';}

/* ---- the tooltip: hover, keyboard focus, or a tap. One box, reused. ---- */
let TIP=null,TIPON=null,TIPPIN=false;
function tipBox(){if(!TIP){TIP=document.createElement('div');TIP.className='tip5';TIP.setAttribute('role','tooltip');TIP.id='tip5';document.body.appendChild(TIP);}return TIP;}
function tipShow(el,pin){
 const b=tipBox();
 if(el.classList.contains('rg5')){const k=el.dataset.k;
  b.innerHTML='<span class="r1"><b>'+WORD[k]+'</b><span class="tl">'
   +(el.dataset.tl===W5.seeNow||el.dataset.tl==='Open on your gift'?staysSvg:lockSvg())+'<span>'+el.dataset.tl+'</span></span></span><span class="m">'+MEAN[k]+'</span>';}
 else b.innerHTML='<span class="m">'+document.getElementById(el.dataset.tip5).textContent+'</span>';
 b.classList.add('on');TIPON=el;TIPPIN=!!pin;
 const r=el.getBoundingClientRect(),w=Math.min(innerWidth<761?340:300,innerWidth-24);b.style.width=w+'px';
 const L=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));b.style.left=L+'px';
 const h=b.offsetHeight;let T=r.top-h-12,up=true;if(T<52){T=r.bottom+12;up=false;}b.style.top=T+'px';
 b.classList.toggle('up',up);b.classList.toggle('dn',!up);b.style.setProperty('--cx',Math.round(Math.max(18,Math.min(w-18,r.left+r.width/2-L)))+'px');
 $$('.rg5.tipped,.hl.tipped,.pn.tipped').forEach(x=>x.classList.remove('tipped'));el.classList.add('tipped');}
function tipHide(){if(TIP)TIP.classList.remove('on');if(TIPON)TIPON.classList.remove('tipped');TIPON=null;TIPPIN=false;}
let WIRED5=false;
function wire(root){
 tipHide();
 $$('.rg5,[data-tip5]',root).forEach(el=>{
  el.addEventListener('mouseenter',()=>{if(!TIPPIN)tipShow(el,false);});
  el.addEventListener('mouseleave',()=>{if(!TIPPIN&&TIPON===el)tipHide();});
  el.addEventListener('focus',()=>tipShow(el,false));
  el.addEventListener('blur',()=>{if(TIPON===el&&!TIPPIN)tipHide();});
  el.addEventListener('click',e=>{if(el.dataset.act)return;e.stopPropagation();
   if(TIPON===el&&TIPPIN)tipHide();else tipShow(el,true);});});
 if(WIRED5)return;WIRED5=true;
 document.addEventListener('click',e=>{if(TIPON&&!e.target.closest('.rg5,[data-tip5],.tip5'))tipHide();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&TIPON)tipHide();});
 window.addEventListener('resize',tipHide);}
