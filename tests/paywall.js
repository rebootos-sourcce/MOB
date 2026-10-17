/* ============================================================
   THE PAYWALL, GATED. node tests/paywall.js, from the repo root, with
   NODE_PATH pointing at a playwright install, against source.html (or
   ATUNED_FILE). Real Chromium.

   Ruled 17 October, the owner's words: "Paywall mockup five, flat card second
   cut. That's the one I'd like to build." The sheet is ui/paywall.js, and every
   locked ring in the app opens it (lockGo, ui/lock.js).

   NOTHING ABOUT THE LADDER IS TYPED HERE. Every tier, price, allowance, which
   tier opens which ring and whether a tier can be bought is read off the page's
   own engine (planLadder, planNeed, sightRows, planBuyable) at run time, so a
   price moved in engine/plan.js moves what is asserted, and the gate fails only
   when the sheet disagrees with the table.

   AT 1600 BY 1000 AND AT 390 BY 844, for a blank person on free, on tier one,
   signed out, and with checkout closed (the build's own state) and open (the
   harness seam, PAYWALL_PAY_OPEN):
     1  the sheet fits one screen with no scroll, and nothing hangs out of its
        own card or out of the sheet
     2  every target is at least 44 by 44, the atuned-ux floor, at both widths
     3  text holds 4.5 to 1 and a mark 3 to 1, each against its own ground,
        read in every lighting LIGHTINGS names (panels.js)
     4  a person inside the gift meets the mockup's gift state: every ring lit,
        no price, no press, the gift's line, Close (since PR 109 the gift sees
        everything); every other state is measured past the gift
     4b every ring's card opens by hover on a desktop, by a tap on a phone and
        by keyboard focus on both, says the ring's name and its tier, and stays
        on screen
     5  the cards say what the engine says: the price, the patterns, which
        rings are lit, which tier each ring opens at, and the number's meaning,
        which never says never opened, unique or new ones (17 October: the
        releasable lines hold 65 different sentences, so a paying person can
        hear one again)
     6  a locked control anywhere in the app, walked surface by surface off
        TABDEF on free and on tier one, opens the sheet with the ring it locked
        marked on every card and the cheapest tier that opens it as the door,
        and Escape and Close put focus back on that control
     7  HONEST: with checkout closed nothing in the sheet can start a checkout
        and no press reaches the payment seam; Practitioner is never sold
        while it is not built; the sheet never says stopping takes two
        presses, never offers a refund, never says a gift
     8  open, a card's press goes through planOpen, the one door Billing uses:
        signed out it says the same refusal as before, and a live plan is moved
        on the payment page rather than given a second checkout
     9  opening it writes nothing to storage and sends no request
    10  on a worked example it reads the person's own plan, and the visit moves
        nothing on their record
    11  the paying open sheet carries at most 90 words on a desktop
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let PASS=0,FAIL=0;
const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
  await p.waitForTimeout(120); }catch(e){}
 try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
/* the word ceiling for the paying open sheet on a desktop, the brief's own */
const WORDS_MAX=90;
const TAP=44;

/* ---- in the page: the measures, installed once per page ---- */
function install(){
 window.__pw={
  parse(c){ c=String(c||'').trim(); let m;
   if(!c||c==='transparent')return [0,0,0,0];
   if((m=c.match(/^rgba?\(([^)]+)\)/))){const p=m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p.length>3?p[3]:1];}
   if((m=c.match(/^color\(srgb\s+([^)]+)\)/))){const p=m[1].split(/[\s\/]+/).filter(Boolean).map(Number);return [p[0]*255,p[1]*255,p[2]*255,p.length>3?p[3]:1];}
   return null;},
  /* THE GROUND AN ELEMENT SITS ON: every painted layer from it up to the
     first opaque one, composited, so a see through card in Glass is read
     against what is under it and not against the page */
  ground(el){
   const L=[];
   for(let n=el;n&&n.nodeType===1;n=n.parentElement){
    const cs=getComputedStyle(n);
    const g=(cs.backgroundImage||'').match(/linear-gradient\((rgba?\([^)]*\)|color\([^)]*\))/);
    if(g){const c=this.parse(g[1]); if(c&&c[3]>0){L.push(c); if(c[3]>=1)break;}}
    const c=this.parse(cs.backgroundColor); if(c&&c[3]>0){L.push(c); if(c[3]>=1)break;}}
   let out=[0,0,0];
   for(let i=L.length-1;i>=0;i--){const c=L[i],a=c[3]; out=[0,1,2].map(j=>a*c[j]+(1-a)*out[j]);}
   return out;},
  lum(c){ const f=v=>{v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}; return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]); },
  ratio(a,b){ const x=this.lum(a),y=this.lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); },
  vis(e){ const r=e.getBoundingClientRect(); return r.width>1&&r.height>1&&!e.closest('.pw-vh')&&getComputedStyle(e).visibility!=='hidden'; },
  sheet(){ return document.querySelector('#paywall .pw-sheet'); },
  /* words a person can see: text nodes in visible boxes, never the screen
     reader's own spans */
  words(){ const s=this.sheet(); if(!s)return -1; let n=0;
   const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT);
   for(let t=w.nextNode();t;t=w.nextNode()){const p=t.parentElement; if(!p||!this.vis(p))continue;
    n+=(t.textContent.trim().match(/\S+/g)||[]).length;}
   return n;},
  fit(){ const s=this.sheet(), r=s.getBoundingClientRect(), bad=[];
   if(s.scrollHeight>s.clientHeight+1||s.scrollWidth>s.clientWidth+1)bad.push('sheet scrolls '+s.scrollHeight+'/'+s.clientHeight);
   if(r.top<-0.5||r.left<-0.5||r.bottom>innerHeight+0.5||r.right>innerWidth+0.5)bad.push('sheet off screen');
   s.querySelectorAll('*').forEach(e=>{ if(!this.vis(e))return; const b=e.getBoundingClientRect();
    if(b.bottom>r.bottom+0.5||b.right>r.right+0.5||b.top<r.top-0.5||b.left<r.left-0.5)bad.push('outside the sheet: '+e.className);});
   /* NOTHING OUT OF ITS OWN CARD, the mockup gate's check that caught the
      failed state pushing buttons over the card edges on a phone */
   s.querySelectorAll('.pw-c,.pw-prac').forEach(c=>{const cr=c.getBoundingClientRect();
    c.querySelectorAll('*').forEach(e=>{ if(!this.vis(e))return; const b=e.getBoundingClientRect();
     if(b.bottom>cr.bottom+1||b.right>cr.right+1||b.top<cr.top-1||b.left<cr.left-1)bad.push('outside its card: '+(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className));});});
   return bad;},
  targets(min){ const s=this.sheet(), bad=[];
   s.querySelectorAll('button,a[href]').forEach(e=>{ if(!this.vis(e))return; const b=e.getBoundingClientRect();
    if(b.width<min-0.5||b.height<min-0.5)bad.push((e.textContent.trim()||e.getAttribute('aria-label')||e.className)+' '+Math.round(b.width)+'x'+Math.round(b.height));});
   return bad;},
  contrast(){ const s=this.sheet(), lowT=[], lowM=[]; let minT=99, minM=99;
   const textOf=e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
   s.querySelectorAll('*').forEach(e=>{ if(!this.vis(e)||!textOf(e))return;
    const r=this.ratio(this.parse(getComputedStyle(e).color),this.ground(e)); minT=Math.min(minT,r);
    if(r<4.5)lowT.push(e.textContent.trim().slice(0,30)+' '+r.toFixed(2));});
   s.querySelectorAll('.pw-dk,.pw-pdk').forEach(e=>{ if(!this.vis(e))return;
    const r=this.ratio(this.parse(getComputedStyle(e).color),this.ground(e)); minM=Math.min(minM,r);
    if(r<3)lowM.push(e.parentElement.getAttribute('data-k')+' '+r.toFixed(2));
    /* a lit disc is a mark against its card as well */
    if(e.closest('.pw-rg.on')){const d=this.ratio(this.ground(e),this.ground(e.closest('.pw-c'))); minM=Math.min(minM,d);
     if(d<3)lowM.push('lit disc '+d.toFixed(2));}});
   return {lowT,lowM,minT,minM};},
  tip(){ const t=document.getElementById('pwtip'); if(!t||!t.classList.contains('on'))return null;
   const r=t.getBoundingClientRect();
   return {text:t.textContent.replace(/\s+/g,' ').trim(),on:r.top>=0&&r.left>=0&&r.bottom<=innerHeight&&r.right<=innerWidth,
    c:this.ratio(this.parse(getComputedStyle(t).color),this.ground(t))};}};}

/* the person, on a tier, signed in or not, on a fresh store */
async function page(browser,W,H,o){
 const phone=W<600;
 const ctx=await browser.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
 const pg=await ctx.newPage();
 await pg.addInitScript(pay=>{window.SIGHT_PLAN=null; if(pay)window.PAYWALL_PAY_OPEN=true;},!!o.pay);
 await pg.addInitScript(install);
 const err=[], req=[];
 pg.on('pageerror',e=>err.push(e.message));
 pg.on('request',r=>{const u=r.url(); if(!/^(file|data|blob|about):/.test(u))req.push(u);});
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(300);
 await pg.evaluate(o=>{
  loadP(0);
  CURP.plan={tier:o.tier,status:o.tier==='free'?'':'active',granted:0,carried:0,base:null,since:null,until:null,ends:null};
  /* PAST THE GIFT unless the state is the gift. Since PR 109 a person inside
     the gift sees everything (lockGift, ui/lock.js) and the sheet shows the
     gift's own state, so a tier's cards are measured on a record that has
     spent it: the gift's size of keys, read off GIFT_N and LINES_PER_CH */
  CURP.meter=CURP.meter||{lines:0,unique:[],first:null,last:null,giftAt:null};
  CURP.meter.unique=[];
  if(!o.gift)for(let a=1;CURP.meter.unique.length<GIFT_N;a++)
   for(let i=0;i<LINES_PER_CH&&CURP.meter.unique.length<GIFT_N;i++)CURP.meter.unique.push(meterKey(a,'Rtruth',i));
  pPersist();
  if(o.signed)authKeep({token:'gate',email:'gate@example.com',accountId:'gate'});
  setTab(TAB.FIELD); render();},o);
 await pg.waitForTimeout(200);
 return {ctx,pg,err,req,phone};}

(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 require('./net.js').guardBrowser(browser);
 console.log('\n=== the paywall, mockup five, in the app ===');
 const STATES=[
  {nm:'free, closed',tier:'free',signed:true,pay:false},
  {nm:'free, paying open',tier:'free',signed:true,pay:true},
  {nm:'tier one, paying open',tier:'one',signed:true,pay:true},
  {nm:'signed out, paying open',tier:'free',signed:false,pay:true},
  {nm:'signed out, closed',tier:'free',signed:false,pay:false}];
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const st of STATES){
   const tag='@'+W+' '+st.nm+': ';
   const P=await page(browser,W,H,st), pg=P.pg;
   /* open it the way a person does: a locked ring's See tiers. On tier one
      saboteurs are seen, so the press is on complexes */
   const k=st.tier==='free'?'hy':'cx';
   const before=await pg.evaluate(()=>{const o={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);} return JSON.stringify(o);});
   const reqBefore=P.req.length;
   const E=await pg.evaluate(k=>{
    paywallOpen(k,null);
    const pl=pwPlan(), rows=planLadder(pl);
    return {open:paywallIsOpen(), door:PW.door, need:planNeed(k).k, pay:pwPayOpen(),
     rows:rows.map(r=>({k:r.k,nm:r.nm,price:r.price,grant:r.grant,per:r.per,buy:r.buy,lead:r.lead,now:r.now,up:r.up,sees:r.sees.map(g=>g.k)})),
     sight:sightRows().map(g=>({k:g.k,need:g.need,tl:planSees(pl,g.k)?'You see this now':'Opens at '+planNmIn(planNeed(g.k))})),
     d4:(PLANS.filter(p=>p.lead)[0]||{}).d||'', pat:PW_W.pat, stopTwo:/two presses|month's end/i.test(document.querySelector('#paywall').textContent)};},k);
   await pg.waitForTimeout(250);
   ok(E.open&&E.door===E.need,tag+'opens with the door on the tier that opens what was pressed, '+JSON.stringify([E.door,E.need]));
   ok(E.pay===st.pay,tag+'paying is '+(st.pay?'open':'closed')+' as set, read '+E.pay);

   /* 1 . one screen, nothing out of its card */
   const bad=await pg.evaluate(()=>__pw.fit());
   ok(bad.length===0,tag+'fits one screen, no scroll, nothing out of its card or the sheet, '+bad.slice(0,4).join(' | '));
   /* 2 . targets */
   const small=await pg.evaluate(m=>__pw.targets(m),TAP);
   ok(small.length===0,tag+'every target is at least '+TAP+' by '+TAP+', '+small.slice(0,4).join(' | '));
   /* 3 . contrast in the default lighting (every lighting is read below) */
   const cn=await pg.evaluate(()=>__pw.contrast());
   ok(cn.lowT.length===0,tag+'text holds 4.5 to 1 on its own ground, lowest '+cn.minT.toFixed(2)+' '+cn.lowT.slice(0,3).join(' | '));
   ok(cn.lowM.length===0,tag+'a mark holds 3 to 1, lowest '+cn.minM.toFixed(2)+' '+cn.lowM.slice(0,3).join(' | '));

   /* 5 . the cards say what the engine says */
   const C=await pg.evaluate(()=>[...document.querySelectorAll('#paywall .pw-c')].map(c=>({k:c.getAttribute('data-pt'),
    door:c.classList.contains('door'), price:c.querySelector('.pw-pr .pw-num').textContent, big:c.querySelector('.pw-big').textContent,
    per:c.querySelector('.pw-per').textContent, pl:c.querySelector('.pw-pl').textContent.replace(/\s+/g,' ').trim(), mean:(document.getElementById(c.querySelector('.pw-hl').getAttribute('aria-describedby'))||{}).textContent,
    lit:[...c.querySelectorAll('.pw-rg.on')].map(r=>r.getAttribute('data-k')),
    rings:[...c.querySelectorAll('.pw-rg')].map(r=>[r.getAttribute('data-k'),r.getAttribute('data-tl'),r.classList.contains('came')]),
    buy:!!c.querySelector('[data-pwbuy]'), shut:((c.querySelector('.pw-shut')||{}).textContent||'').trim(),
    here:((c.querySelector('.pw-act .pw-here')||{}).textContent||'').trim()})));
   const paid=E.rows.filter(r=>r.k!=='free'&&!r.lead);
   ok(C.map(c=>c.k).join()===paid.map(r=>r.k).join(),tag+'one card per paid tier the ladder names, '+C.map(c=>c.k).join());
   const N=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
   for(const r of paid){
    const c=C.find(x=>x.k===r.k); if(!c){ok(false,tag+r.k+' has no card');continue;}
    ok(c.price==='$'+r.price&&c.per==='a '+r.per,tag+r.k+' prints the ladder\'s price, '+c.price+' '+c.per);
    ok(c.big===N(r.grant),tag+r.k+' leads on the ladder\'s patterns, '+c.big);
    ok(c.mean===E.pat,tag+r.k+' says what its number means, '+c.mean);
    ok(c.pl==='new patterns a '+r.per,tag+r.k+' reads new patterns a '+r.per+', '+c.pl);
    ok(c.lit.join()===r.sees.join(),tag+r.k+' lights exactly the rings SIGHT gives it, '+c.lit.join());
    ok(c.rings.length===E.sight.length&&c.rings.every((x,i)=>x[0]===E.sight[i].k&&x[1]===E.sight[i].tl),tag+r.k+' says the tier each ring opens at, off SIGHT');
    ok(c.rings.filter(x=>x[2]).map(x=>x[0]).join()===k,tag+r.k+' marks the ring that was pressed and no other');
    ok(c.door===(r.k===E.door),tag+r.k+(r.k===E.door?' is':' is not')+' the door');
    /* 7 and 8 . the act slot says what is true */
    if(r.now)ok(c.here==='You are here'&&!c.buy,tag+r.k+' is the tier in force and says so, with no press');
    else if(!r.up)ok(!c.buy&&!c.shut,tag+r.k+' is below the tier in force and offers nothing');
    else if(!st.pay)ok(!c.buy&&c.shut==='Opens soon',tag+r.k+' with checkout closed says Opens soon and carries no press');
    else ok(c.buy===r.buy,tag+r.k+' with checkout open carries a press exactly when the ladder can sell it');}
   const four=E.rows.find(r=>r.lead);
   const pr=await pg.evaluate(()=>{const p=document.querySelector('#paywall .pw-prac');
    return p?{buy:!!p.querySelector('[data-pwbuy]'),text:p.textContent.replace(/\s+/g,' '),tip:(document.getElementById('pwptp')||{}).textContent}:null;});
   ok(pr&&pr.text.indexOf('$'+four.price)>=0&&pr.text.indexOf(four.nm)>=0,tag+'the Practitioner strip prints the ladder\'s name and price, '+(pr&&pr.text));
   ok(pr&&(four.buy?true:(!pr.buy&&/Opens soon/.test(pr.text))),tag+'Practitioner is not sold while it is not built, '+JSON.stringify(pr&&{buy:pr.buy,built:four.buy}));
   ok(pr&&pr.tip===E.d4&&/opens? soon/i.test(E.d4),tag+'its card is the plan table\'s own sentence, and it says it opens soon');
   ok(!E.stopTwo,tag+'never says stopping takes two presses or runs to the month\'s end');
   const txt=await pg.evaluate(()=>document.getElementById('paywall').textContent);
   ok(!/refund|gift/i.test(txt),tag+'no refund line and no gift state');
   /* 17 October: the lines hold 65 different sentences, so the sheet never
      promises a pattern is unheard. Read with the screen reader's spans too */
   ok(!/never opened|unique|new ones/i.test(txt),tag+'never says never opened, unique or new ones');
   /* and never the line that was false: most new patterns are new lines at
      places already opened, so a pattern is not a new place */
   ok(!/new place in your body/i.test(txt),tag+'never says a pattern opens a new place in the body');

   /* 11 . words */
   const words=await pg.evaluate(()=>__pw.words());
   if(W>=1000&&st.pay&&st.tier==='free'&&st.signed)ok(words>0&&words<=WORDS_MAX,tag+'the paying open sheet carries at most '+WORDS_MAX+' words, read '+words);
   console.log('  '+tag+words+' words, lowest text '+cn.minT.toFixed(2)+', lowest mark '+cn.minM.toFixed(2));

   /* 4 . every ring's card: focus on both, hover on a desktop, a tap on a phone */
   const rings=await pg.evaluate(()=>document.querySelectorAll('#paywall .pw-rg').length);
   let tipBad=[];
   for(let i=0;i<rings;i++){
    const sel='#paywall .pw-rg >> nth='+i;
    const want=await pg.evaluate(i=>{const r=document.querySelectorAll('#paywall .pw-rg')[i];
     const g=sightRows().find(x=>x.k===r.getAttribute('data-k')); return {nm:pwName(g),tl:r.getAttribute('data-tl')};},i);
    await pg.focus(sel); await pg.waitForTimeout(40);
    let t=await pg.evaluate(()=>__pw.tip());
    if(!t||t.text.indexOf(want.nm)<0||t.text.indexOf(want.tl)<0||!t.on||t.c<4.5)tipBad.push('focus '+i+' '+JSON.stringify(t));
    await pg.evaluate(()=>{document.activeElement.blur(); pwTipHide();});
    if(i%5===0){
     if(P.phone){await pg.tap(sel); await pg.waitForTimeout(80);}
     else{await pg.hover(sel); await pg.waitForTimeout(80);}
     t=await pg.evaluate(()=>__pw.tip());
     if(!t||t.text.indexOf(want.nm)<0||t.text.indexOf(want.tl)<0||!t.on)tipBad.push((P.phone?'tap ':'hover ')+i+' '+JSON.stringify(t));
     if(P.phone){await pg.tap(sel); await pg.waitForTimeout(60);
      if(await pg.evaluate(()=>__pw.tip()))tipBad.push('a second tap did not close '+i);}
     else{await pg.mouse.move(2,2); await pg.waitForTimeout(60);
      if(await pg.evaluate(()=>__pw.tip()))tipBad.push('pointer out did not close '+i);}}}
   ok(rings>0&&tipBad.length===0,tag+'every ring\'s card opens by focus and by '+(P.phone?'a tap':'hover')+', names the ring and its tier and stays on screen, '+rings+' rings, '+tipBad.slice(0,2).join(' | '));
   /* the number and the Practitioner name carry their meaning the same way */
   await pg.focus('#paywall .pw-hl >> nth=0'); await pg.waitForTimeout(40);
   const nt=await pg.evaluate(()=>__pw.tip());
   ok(nt&&nt.text===E.pat&&nt.on,tag+'the number opens its meaning on focus, '+(nt&&nt.text));
   await pg.focus('#paywall .pw-pn'); await pg.waitForTimeout(40);
   const pt=await pg.evaluate(()=>__pw.tip());
   ok(pt&&pt.text===E.d4&&pt.on,tag+'Practitioner opens its meaning on focus and it stays on screen');
   /* Escape closes an open card first, then the sheet */
   await pg.keyboard.press('Escape'); await pg.waitForTimeout(60);

   /* 7 . HONEST, checkout closed: no press in the sheet reaches the seam */
   if(!st.pay){
    const seam=await pg.evaluate(async()=>{
     const calls=[]; const keep=PLAN_HOST; bindPlan((w,t)=>calls.push([w,t]));
     if(!paywallIsOpen())paywallOpen('hy',null);
     const bs=[...document.querySelectorAll('#paywall button')].filter(b=>!b.matches('[data-pwact="billing"],[data-pwact="signin"],#pwx'));
     for(const b of bs){ b.click(); await new Promise(r=>setTimeout(r,10)); if(!paywallIsOpen())paywallOpen('hy',null);}
     bindPlan(keep);
     return {calls,buy:document.querySelectorAll('#paywall [data-pwbuy]').length,n:bs.length};});
    ok(seam.buy===0&&seam.calls.length===0,tag+'with checkout closed, '+seam.n+' presses in the sheet and none reaches the payment seam, '+JSON.stringify(seam.calls));}
   else if(st.tier==='free'){
    /* 8 . open: the press is planOpen, the one door */
    const go=await pg.evaluate(async st=>{
     if(!paywallIsOpen())paywallOpen('hy',null);
     const b=document.querySelector('#paywall .pw-c.door [data-pwbuy]'); if(!b)return null;
     if(st.signed){ const calls=[]; const keep=PLAN_HOST; bindPlan((w,t)=>calls.push([w,t])); status('');
      b.click(); await new Promise(r=>setTimeout(r,30)); bindPlan(keep);
      return {calls,label:b.textContent.trim(),said:document.getElementById('status').textContent,k:b.getAttribute('data-pwbuy')};}
     /* signed out, through the real host: the refusal is authPlanCheckout's own
        sentence, read off it, and it is answered locally with no request */
     const want=(await authPlanCheckout('one')).say; status('');
     b.click(); await new Promise(r=>setTimeout(r,60));
     return {want,said:document.getElementById('status').textContent,kind:document.getElementById('status').getAttribute('data-kind')};},st);
    if(st.signed)ok(go&&go.calls.length===1&&go.calls[0][0]==='checkout'&&go.calls[0][1]===go.k&&go.k===E.door&&!/paid|success|done|welcome/i.test(go.said),
     tag+'the door\'s press is one checkout for its own tier through planOpen, and nothing claims success, '+JSON.stringify(go));
    else ok(go&&go.said===go.want&&go.kind==='fail',tag+'signed out, the press says the same refusal Billing\'s does, '+JSON.stringify(go));}
   else if(st.tier==='one'){
    const mv=await pg.evaluate(async()=>{
     if(!paywallIsOpen())paywallOpen('cx',null);
     const calls=[]; const keep=PLAN_HOST; bindPlan((w,t)=>calls.push([w,t]));
     const b=document.querySelector('#paywall [data-pwbuy="two"]'); if(b)b.click();
     const s=document.querySelector('#paywall [data-pwact="portal"]'); if(s)s.click();
     await new Promise(r=>setTimeout(r,30)); bindPlan(keep);
     return {calls,label:b&&b.textContent.trim(),stop:!!s};});
    ok(mv.calls.length===2&&mv.calls.every(c=>c[0]==='portal'&&c[1]===null)&&mv.stop,
     tag+'a live plan moves on the payment page, never a second checkout, and Stop or change plan opens that page, '+JSON.stringify(mv));}

   /* 9 . opening wrote nothing and sent nothing */
   await pg.evaluate(()=>{ if(paywallIsOpen())paywallClose(); });
   const after=await pg.evaluate(()=>{const o={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);} return JSON.stringify(o);});
   ok(after===before,tag+'opening it, its cards and its presses wrote nothing to storage');
   ok(P.req.length===reqBefore&&P.req.length===0,tag+'no request left the page, '+P.req.slice(0,3).join(' '));
   ok(P.err.length===0,tag+'no page errors, '+P.err.slice(0,2).join(' | '));
   await P.ctx.close();}

  /* THE GIFT, the mockup's gift state: every ring lit, no price, no press, the
     gift's one line in Summary's words, Close. Read off the lock's own answer */
  {const P=await page(browser,W,H,{tier:'free',signed:false,pay:true,gift:true}), pg=P.pg, tag='@'+W+' gift: ';
   const before=await pg.evaluate(()=>JSON.stringify(Object.assign({},localStorage)));
   const g=await pg.evaluate(()=>{
    const inGift=lockGift(); paywallOpen('hy',null);
    const s=document.querySelector('#paywall .pw-sheet'), t=s.textContent.replace(/\s+/g,' ');
    return {inGift, gift:s.classList.contains('pw-gift'), k:PW.k, door:PW.door,
     rings:s.querySelectorAll('.pw-rg').length, lit:s.querySelectorAll('.pw-rg.on').length, want:sightRows().length,
     tl:[...s.querySelectorAll('.pw-rg')].every(r=>r.getAttribute('data-tl')==='Open on your gift'),
     buy:s.querySelectorAll('[data-pwbuy]').length, price:/\$\d/.test(t), soon:/Opens soon/.test(t),
     line:(s.querySelector('.pw-gq')||{}).textContent, want2:'Your gift: '+GIFT_N+' patterns, no card. Everything is open.',
     title:(s.querySelector('#pwt1')||{}).textContent, words:__pw.words()};});
   ok(g.inGift&&g.gift&&g.k===null&&g.door===null,tag+'a person inside the gift meets the gift state, with nothing marked, '+JSON.stringify(g));
   ok(g.rings===g.want&&g.lit===g.want&&g.tl,tag+'every ring SIGHT draws is lit and says it is open on the gift, '+g.lit+' of '+g.rings);
   ok(g.buy===0&&!g.price&&!g.soon,tag+'no price, no press and no Opens soon: there is nothing to buy');
   ok(g.line===g.want2&&g.title==='Your whole reading is open.',tag+'the gift\'s one line, in Summary\'s words, under the mockup\'s title, '+JSON.stringify([g.title,g.line]));
   const bad=await pg.evaluate(()=>__pw.fit()), small=await pg.evaluate(m=>__pw.targets(m),TAP), cn=await pg.evaluate(()=>__pw.contrast());
   ok(bad.length===0,tag+'fits one screen, '+bad.slice(0,3).join(' | '));
   ok(small.length===0,tag+'every target is at least '+TAP+', '+small.slice(0,3).join(' | '));
   ok(cn.lowT.length===0&&cn.lowM.length===0,tag+'text and marks hold their floors, lowest text '+cn.minT.toFixed(2)+', mark '+cn.minM.toFixed(2));
   await pg.focus('#paywall .pw-rg >> nth=0'); await pg.waitForTimeout(40);
   const t1=await pg.evaluate(()=>__pw.tip());
   ok(t1&&/Open on your gift/.test(t1.text)&&t1.on,tag+'a ring\'s card says it is open on the gift, '+(t1&&t1.text));
   await pg.focus('#paywall .pw-gp'); await pg.waitForTimeout(40);
   const t2=await pg.evaluate(()=>__pw.tip());
   ok(t2&&t2.text===await pg.evaluate(()=>PW_W.pat),tag+'the word patterns carries what a pattern is');
   await pg.click('#paywall .pw-gclose'); await pg.waitForTimeout(60);
   ok(!(await pg.evaluate(()=>paywallIsOpen())),tag+'Close shuts it');
   const after=await pg.evaluate(()=>JSON.stringify(Object.assign({},localStorage)));
   ok(after===before&&P.req.length===0&&P.err.length===0,tag+'wrote nothing, sent nothing, no page errors, '+P.err.slice(0,2).join(' | '));
   await P.ctx.close();}

  /* 3 . contrast in every lighting, read off LIGHTINGS */
  {const P=await page(browser,W,H,{tier:'free',signed:true,pay:true}), pg=P.pg;
   const L=await pg.evaluate(()=>LIGHTINGS.map(l=>l[0]));
   for(const l of L){
    const cn=await pg.evaluate(async l=>{setLighting(l); await new Promise(r=>setTimeout(r,60)); paywallOpen('hy',null);
     await new Promise(r=>setTimeout(r,60)); const c=__pw.contrast(); const f=__pw.fit(); paywallClose(); return {c,f};},l);
    ok(cn.c.lowT.length===0&&cn.c.lowM.length===0,'@'+W+' '+l+': text and marks hold their floors, lowest text '+cn.c.minT.toFixed(2)+', mark '+cn.c.minM.toFixed(2)+' '+cn.c.lowT.concat(cn.c.lowM).slice(0,3).join(' | '));
    ok(cn.f.length===0,'@'+W+' '+l+': fits and nothing leaves its card, '+cn.f.slice(0,3).join(' | '));}
   ok(P.err.length===0,'@'+W+' lightings: no page errors, '+P.err.slice(0,2).join(' | '));
   await P.ctx.close();}

  /* 6 . every locked control in the app opens the sheet at its own ring */
  for(const tier of ['free','one']){
   const P=await page(browser,W,H,{tier,signed:false,pay:false}), pg=P.pg;
   /* the roster's heaviest is loaded so there is a chain to lock */
   const R=await pg.evaluate(async tier=>{
    const g=PEOPLE.findIndex(x=>x.nm==='Gordon'); loadP(g>=0?g:1);
    CURP.plan={tier,status:tier==='free'?'':'active',granted:0,carried:0,base:null,since:null,until:null,ends:null};
    const wait=ms=>new Promise(r=>setTimeout(r,ms)), out=[], seen={};
    for(const t of TABDEF){
     setTab(t.k); render(); await wait(120);
     const els=[...document.querySelectorAll('[data-lock][aria-disabled="true"],.lk-panel .lk-go')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
     for(const el of els){
      const isPanel=el.classList.contains('lk-go');
      const key=isPanel?el.closest('[data-lock-panel]').getAttribute('data-lock-panel'):el.getAttribute('data-lock');
      const id=t.nm+'|'+key+'|'+(isPanel?'panel':'control'); if(seen[id])continue; seen[id]=1;
      el.setAttribute('data-pwprobe','1');
      if(isPanel)el.click();
      else{ TIP.show(el); await wait(30); const go=document.querySelector('#tip .tip-go'); if(go)go.click(); }
      await wait(60);
      const o={tab:t.nm,key,isPanel,open:paywallIsOpen(),k:PW.k,door:PW.door,want:planNeed(key)?planNeed(key).k:null,
       doorCard:!!document.querySelector('#paywall .pw-c.door[data-pt="'+PW.door+'"]'),
       came:document.querySelectorAll('#paywall .pw-rg.came[data-k="'+key+'"]').length,
       cards:document.querySelectorAll('#paywall .pw-c').length,stay:S.tab===t.k};
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
      await wait(30);
      o.shut=!paywallIsOpen();
      o.back=!!(document.activeElement&&document.activeElement.getAttribute&&document.activeElement.getAttribute('data-pwprobe'));
      el.removeAttribute('data-pwprobe');
      out.push(o);}}
    setTab(TAB.FIELD); return out;},tier);
   ok(R.length>0,'@'+W+' '+tier+': locked controls found to press, '+R.length);
   const wrong=R.filter(o=>!(o.open&&o.k===o.key&&o.door===o.want&&o.doorCard&&o.came===o.cards&&o.cards>0&&o.stay));
   ok(wrong.length===0,'@'+W+' '+tier+': every locked control opens the sheet over its own screen at its ring, the door on the tier that opens it, '
    +R.length+' pressed, '+JSON.stringify(wrong.slice(0,2)));
   const noBack=R.filter(o=>!(o.shut&&o.back));
   ok(noBack.length===0,'@'+W+' '+tier+': Escape closes it and puts focus back on the control that opened it, '+JSON.stringify(noBack.slice(0,2)));
   console.log('  @'+W+' '+tier+': '+R.length+' locked controls pressed, on '+[...new Set(R.map(o=>o.tab))].join(', '));
   /* Close puts focus back as well, through the real button */
   const cl=await pg.evaluate(async()=>{
    setTab(TAB.MASKS); render(); await new Promise(r=>setTimeout(r,120));
    const b=document.querySelector('.tabtop[data-tabk="'+TAB.MASKS+'"]');
    const el=document.querySelector('.lk-panel .lk-go')||b; if(!el)return null;
    el.focus(); el.click(); await new Promise(r=>setTimeout(r,60));
    const open=paywallIsOpen(); document.getElementById('pwx').click(); await new Promise(r=>setTimeout(r,30));
    return {open,shut:!paywallIsOpen(),back:document.activeElement===el};});
   ok(cl&&cl.open&&cl.shut&&cl.back,'@'+W+' '+tier+': Close shuts it and puts focus back, '+JSON.stringify(cl));
   ok(P.req.length===0,'@'+W+' '+tier+': no request left the page while the locks were walked, '+P.req.slice(0,3).join(' '));
   ok(P.err.length===0,'@'+W+' '+tier+': no page errors, '+P.err.slice(0,2).join(' | '));
   await P.ctx.close();}

  /* 10 . a worked example: the sheet reads the own plan, and moves nothing */
  {const P=await page(browser,W,H,{tier:'free',signed:false,pay:false}), pg=P.pg;
   const X=await pg.evaluate(async()=>{
    const raw0=STORE.get(PKEY), own0=JSON.stringify(PROF_BY[PEOPLE[0].nm].plan);
    const ex=PEOPLE.findIndex(p=>!p.you); loadP(ex);
    const exPlan=JSON.stringify(CURP.plan), show=showOnly();
    paywallOpen('hy',null); await new Promise(r=>setTimeout(r,60));
    const o={show,open:paywallIsOpen(),door:PW.door,want:planNeed('hy').k,
     here:((document.querySelector('#paywall .pw-hd .pw-here')||{}).textContent||'').replace(/\s+/g,' ')};
    document.querySelectorAll('#paywall .pw-rg').forEach(r=>r.focus());
    paywallClose();
    o.exSame=JSON.stringify(CURP.plan)===exPlan; o.stillEx=showOnly();
    o.ownSame=JSON.stringify(PROF_BY[PEOPLE[0].nm].plan)===own0; o.rawSame=STORE.get(PKEY)===raw0;
    loadP(0); return o;});
   ok(X.show&&X.open&&X.door===X.want&&/You are here\s*Free/.test(X.here),'@'+W+' on a worked example the sheet reads the person\'s own plan, free, '+JSON.stringify(X));
   ok(X.exSame&&X.stillEx&&X.ownSame&&X.rawSame,'@'+W+' and the visit moved nothing: the example, the own plan and the stored record are as they were, '+JSON.stringify(X));
   ok(P.err.length===0,'@'+W+' example: no page errors, '+P.err.slice(0,2).join(' | '));
   await P.ctx.close();}}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})().catch(e=>{ console.log('  FAIL the gate threw: '+e.stack); process.exit(1); });
