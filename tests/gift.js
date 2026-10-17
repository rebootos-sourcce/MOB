#!/usr/bin/env node
/* ============================================================
   THE GIFT SEES EVERYTHING, AND IS STILL NOT A TIER.

   env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     node tests/gift.js
   ATUNED_FILE=file   runs against another build, for checking the checker

   The ruling, DECISIONS.md: "A new person gets 100 patterns, free, with
   everything visible. They explore the whole app until the gift is spent.
   Then it reverts." Kept at round PK, 2 October ("the gift stays as ruled"),
   and REVIEW-arch/TALLY.md ruling 8: "whole reading visible while it lasts;
   the gift end copy says plainly what is kept and what rests, with no
   countdown."

   Every other gate that measures sight seeds a plan (tests/seed.js puts the
   whole product on tier four, tests/locks.js and personas-tier.js load a
   worked example) and none of them was ever a new person, so none of them saw
   that the code ranked the gift below free and padlocked the saboteurs on a
   first screen. This one is a new person, the way one arrives: the quiz's own
   link, Guest at the door, the harness seam off, on a clean browser, at 1600
   and at 390. What it holds:

     1  the first screen is opened, not shopped. On the page a new person lands
        on, the reading names what is running, nothing visible carries a lock,
        and there is no price, no See tiers, no count of what is left and no
        Move to. The one line is there, in the first screen, in full:
        "Your gift: <GIFT_N> patterns, no card. Everything is open.", with
        "patterns" carrying the gift's own meaning
     2  every surface the ruling opens draws: the Field's four rungs are
        unlocked and saboteurs are drawn, the Body's overlays, the Compass's
        Registers and the Character page, and computeSeen is compute() whole
     3  it is not a tier: the plan in force is free, the record says free, the
        tiers page says Your tier Free and names the gift as why it sees more,
        and tier four is still closed. A worked example opened on the same
        device never shows the gift's line
     4  the gift runs out on the run that opens its last pattern, and that run's
        results say so once, naming what closes and that nothing released is
        deleted. Afterwards the padlocks are back, the line is gone, a list
        says locked and never that nothing is running, every pattern opened is
        still on the record and the engine still computes the chain. The next
        run does not say it again

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing rule:
   origin/main at 054ca583 fails groups 1, 2 and 3 at both widths. No count is
   typed into this file. Read the counts off the run.
   ============================================================ */
const fs=require('fs'), path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const SRC=path.resolve(process.env.ATUNED_FILE||path.join(ROOT,'source.html'));
const QUIZ=path.join(ROOT,'funnel','quiz.html');
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let PASS=0,FAIL=0;
const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };

/* the record a new person arrives with: the quiz's own link, as landing.js makes it */
async function payloadFromQuiz(browser){
 const cx=await browser.newContext({viewport:{width:1600,height:1000}});
 const pg=await cx.newPage();
 await pg.goto('file://'+QUIZ,{waitUntil:'load'});
 await pg.evaluate(()=>{A={};QQ.forEach((q,i)=>{A[i]=(i*7+3)%5;});save();STATE='door';render();});
 await pg.waitForSelector('#tolink[data-ready="1"]',{timeout:10000});
 const href=await pg.evaluate(()=>document.getElementById('tolink').href);
 await cx.close();
 return href.split('#r=')[1];}

/* what carries a lock on screen right now. A lock on a surface that is not
   showing is repainted when it shows, so only what is drawn is counted. */
const SHOWN=()=>[...document.querySelectorAll('[data-lock],.lk-panel,.lk-mk')]
 .filter(e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden')
 .map(e=>e.getAttribute('data-lock')||(e.classList.contains('lk-mk')?'mark':'panel:'+e.getAttribute('data-lock-panel')));

async function arrive(browser,payload,W,H){
 const phone=W<600;
 const cx=await browser.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
 const pg=await cx.newPage(); const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto('file://'+SRC+'#r='+payload,{waitUntil:'load'});
 await pg.waitForFunction(()=>typeof isBooted==='function'&&isBooted(),null,{timeout:30000});
 await pg.waitForTimeout(800);
 /* past the door the way a person goes, with no account */
 if(await pg.$('#loginb-skip'))await pg.click('#loginb-skip');
 await pg.waitForTimeout(500);
 await pg.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:6000}).catch(()=>{});
 await pg.waitForTimeout(800);
 return {cx,pg,err,phone};}

(async()=>{
 for(const f of [SRC,QUIZ])if(!fs.existsSync(f)){console.log(path.relative(ROOT,f)+' is missing: build first'); process.exit(1);}
 const browser=await chromium.launch({executablePath:CHROME});
 require('./net.js').guardBrowser(browser);
 const payload=await payloadFromQuiz(browser);
 ok(typeof payload==='string'&&payload.length>40,'the quiz made a link to arrive by');

 for(const [W,H] of [[1600,1000],[390,844]]){
  const tag='@'+W+': ';
  console.log('\n=== a new person on the gift, '+W+' wide ===');
  const {cx,pg,err,phone}=await arrive(browser,payload,W,H);

  /* ---- 0 · who this is: a new person, their own record, inside the gift ---- */
  const who=await pg.evaluate(()=>({sp:(typeof SIGHT_PLAN==='undefined')?'undef':SIGHT_PLAN,
   own:!showOnly(CURP), mine:PROFILES.indexOf(CURP)>=0, tier:CURP.plan&&CURP.plan.tier,
   n:((CURP.meter&&CURP.meter.unique)||[]).length, gift:((CURP.meter&&CURP.meter.unique)||[]).length<GIFT_N,
   /* the link opens a profile of its own, not the roster's You, so the way
      back to it is by its id, the way a person opens it (accProfOpen) */
   id:(window.GIFT_ID=CURP.id),
   unread:!!compute().unread, sabs:compute().sabs.length, tab:S.tab===TAB.SUMMARY, N:GIFT_N}));
  ok(who.sp===null,tag+'the harness seam is off, so nothing but the record decides sight, '+JSON.stringify(who.sp));
  ok(who.own&&who.mine&&who.tier==='free'&&who.n===0&&who.gift,tag+'it is the person\'s own record, free, nothing opened, inside the gift, '+JSON.stringify(who));
  ok(!who.unread&&who.sabs>0,tag+'it has a reading and the engine finds saboteurs in it, '+who.sabs);
  ok(who.tab,tag+'and the link lands on Summary, the first screen');

  /* ---- 1 · the first screen is opened, not shopped ---- */
  const first=await pg.evaluate(SH=>{
   const SHOWN=new Function('return ('+SH+')()');
   const g=document.getElementById('sumgift'), r=g?g.getBoundingClientRect():null;
   const tipu=g?g.querySelector('.tipu'):null;
   /* the words a person can see without scrolling */
   const seen=[...document.querySelectorAll('#sumbody *')].filter(e=>{
    if(e.children.length)return false; const b=e.getBoundingClientRect();
    return b.width>0&&b.height>0&&b.bottom>0&&b.top<innerHeight;}).map(e=>e.textContent).join(' ');
   return {locks:SHOWN(), reading:document.getElementById('sumbody').textContent, text:g?g.textContent.replace(/\s+/g,' ').trim():null,
    inView:!!r&&r.top>=0&&r.bottom<=innerHeight&&r.width>0, scroll:scrollY,
    tip:tipu?tipu.getAttribute('data-tip'):null, tipTerm:tipu?tipu.textContent:null,
    n:document.querySelectorAll('#sumgift').length, seen:seen,
    see:/See tiers/.test(document.body.innerText),
    move:[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length&&/^Move to/.test(b.textContent.trim())).length};},SHOWN.toString());
  ok(first.locks.length===0,tag+'nothing on the first screen carries a lock, '+first.locks.join());
  ok(first.text==='Your gift: '+who.N+' patterns, no card. Everything is open.',tag+'the gift is said in one line, in full, '+JSON.stringify(first.text));
  ok(first.n===1,tag+'once, '+first.n);
  ok(first.inView&&first.scroll===0,tag+'and it is on the first screen without a scroll, '+JSON.stringify({inView:first.inView,scroll:first.scroll}));
  ok(first.tipTerm==='patterns'&&first.tip==='A pattern is one line you have not said before.',
   tag+'"patterns" carries the gift\'s own meaning beside it, not the glossary\'s reaction, '+JSON.stringify(first.tip));
  ok(!/\$\s?\d|\bprice\b|a month|per month/i.test(first.seen),tag+'no price on the first screen');
  ok(!/\bleft of the\b|\bpatterns left\b|\bremaining\b/i.test(first.seen),tag+'no count of what is left: the gift does not tick on the first screen');
  ok(!first.see&&first.move===0,tag+'no See tiers and no Move to anywhere on it, '+JSON.stringify({see:first.see,move:first.move}));
  ok(/compounding on it is /.test(first.reading),tag+'and the reading on the page names what is compounding, which the lock hid');

  /* ---- 2 · every surface the ruling opens draws ---- */
  const BAR=['saboteurs','complexes','hyper','character'];
  await pg.evaluate(()=>{setTab(TAB.FIELD);fviewSet('wheel');render();}); await pg.waitForTimeout(900);
  if(phone)await pg.evaluate(()=>fbOpenPanel(true));
  const fld=await pg.evaluate(BAR=>{
   const host=window.innerWidth<=720?'#fbpanel':'#fbar .fb-full';
   const o={orbs:BAR.map(k=>{const e=document.querySelector(host+' [data-fb="'+k+'"]');
    return e?{k:k,lock:e.getAttribute('data-lock'),dis:e.getAttribute('aria-disabled'),mark:!!e.querySelector('.lk-mk')}:{k:k,missing:true};})};
   o.vis=Object.keys(layVisible()); o.hit=HIT.filter(h=>h.k==='sab').length;
   return o;},BAR);
  if(phone)await pg.evaluate(()=>fbOpenPanel(false));
  ok(fld.orbs.every(o=>!o.missing&&o.lock===null&&o.dis!=='true'&&!o.mark),tag+'the Field\'s four rungs are open, no padlock and none disabled, '+JSON.stringify(fld.orbs));
  ok(fld.vis.indexOf('saboteurs')>=0&&fld.hit>0,tag+'saboteurs are lit on the Field, drawn with '+fld.hit+' targets');
  const fl=await pg.evaluate(SH=>new Function('return ('+SH+')()')(),SHOWN.toString());
  ok(fl.length===0,tag+'nothing on the Field carries a lock, '+fl.join());
  await pg.evaluate(()=>{setTab(TAB.ENERGY);render();}); await pg.waitForTimeout(900);
  const bd=await pg.evaluate(()=>{const o={}; ['sab','cx','hy','masks'].forEach(k=>{
    const e=document.querySelector('#bmov [data-bmov="'+k+'"]'); o[k]=e?e.getAttribute('data-lock'):'missing';});
   o.lines=BM.sabs.length; return o;});
  ok(['sab','cx','hy','masks'].every(k=>bd[k]===null)&&bd.lines>0,tag+'the Body\'s chain overlays are open and it draws saboteur lines, '+JSON.stringify(bd));
  await pg.evaluate(()=>{setTab(TAB.COMPASS);coneOpen(true);}); await pg.waitForTimeout(700);
  const reg=await pg.evaluate(()=>{const e=document.querySelector('#cone [data-cn="shells"]'); return e?e.getAttribute('data-lock'):'missing';});
  ok(reg===null,tag+'the Compass\'s Registers, the point cloud, are open, '+reg);
  await pg.evaluate(()=>{setTab(TAB.MASKS);render();}); await pg.waitForTimeout(800);
  const ch=await pg.evaluate(()=>({door:document.querySelector('.tabtop[data-tabk="'+TAB.MASKS+'"]').getAttribute('data-lock'),
   cv:document.querySelectorAll('#masksview canvas').length,masks:document.querySelectorAll('#masksview [data-chmask]').length,
   panel:!!document.querySelector('#masksview .lk-panel')}));
  ok(ch.door===null&&ch.cv===1&&ch.masks>0&&!ch.panel,tag+'the Character page and its door are open and draw the masks, '+JSON.stringify(ch));
  const whole=await pg.evaluate(()=>{const a=compute(), s=computeSeen();
   return s===a||(s.sabs.length===a.sabs.length&&s.cxs.length===a.cxs.length&&s.hys.length===a.hys.length&&s.sups.length===a.sups.length&&!s.locked);});
  ok(whole,tag+'the reading a gift person is handed is the whole reading');

  /* ---- 3 · it is not a tier ---- */
  const tier=await pg.evaluate(async()=>{
   const o={of:planOf(CURP.plan).k, rec:CURP.plan.tier, lock:(lockPlan()||{}).tier||null,
    now:planLadder(CURP.plan).filter(r=>r.now).map(r=>r.k).join(), buyGift:planBuyable('gift'), buyFour:planBuyable('four'),
    bare:planSight(CURP.plan).all};
   planTiersOpen(); await new Promise(r=>setTimeout(r,400));
   const you=document.getElementById('ptyou');
   o.you=you?you.textContent.replace(/\s+/g,' '):'';
   o.four=((document.querySelector('[data-pt="four"]')||{}).textContent||'').replace(/\s+/g,' ');
   return o;});
  ok(tier.of==='free'&&tier.rec==='free'&&tier.lock==='free'&&tier.now==='free',tag+'the plan in force is free everywhere it is asked, '+JSON.stringify(tier));
  ok(!tier.bare,tag+'and the plan alone still sees what free sees: the gift opens sight, it is not a rung');
  ok(!tier.buyGift&&!tier.buyFour&&/Opens with the lead suite/.test(tier.four),tag+'the gift is never bought, and tier four is still closed, '+tier.four.slice(0,80));
  ok(/Your tier\s*Free/.test(tier.you)&&/while your gift lasts/.test(tier.you)&&!/Locked:/.test(tier.you),
   tag+'the tiers page says Free, names the gift as why it sees more, and locks nothing, '+tier.you);
  /* the lock's own answer, or nothing on a build that has none, so a build
     from before this change is measured on what it draws and does not throw */
  const ex=await pg.evaluate(async()=>{ window.GIFT_ASK=()=>typeof lockGift==='function'?lockGift():null;const i=PEOPLE.findIndex(p=>!p.you); loadP(i); setTab(TAB.SUMMARY); render();
   await new Promise(r=>setTimeout(r,200));
   const o={nm:PEOPLE[i].nm, gift:GIFT_ASK(), line:!!document.getElementById('sumgift')};
   accProfOpen(window.GIFT_ID); setTab(TAB.SUMMARY); render(); await new Promise(r=>setTimeout(r,200));
   o.back=!!document.getElementById('sumgift')&&CURP.id===window.GIFT_ID; return o;});
  ok(!ex.gift&&!ex.line,tag+'a worked example on the same device is not the viewer\'s gift and shows no gift line, '+JSON.stringify(ex));
  ok(ex.back,tag+'and the person\'s own Summary still does');

  /* ---- 4 · the gift runs out, on the run that opens its last pattern ---- */
  if(!phone){
   const end=await pg.evaluate(async()=>{
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    if(CURP.id!==window.GIFT_ID)accProfOpen(window.GIFT_ID);
    setTab(TAB.FIELD); render();
    /* A PERSON ONE WHOLE ADDRESS FROM THE END OF THE GIFT. A run plans whole
       addresses only (meterPlanWhole, main 17 October), so the size of one is
       read off a real pick of the heaviest address before anything is
       opened, and what they opened is written up to exactly that far from
       the end, through the meter's own writer, as a run writes it. A fill of
       the gift less two planned nothing once a run stopped at whole
       addresses, because two is less than one of them. */
    const ids=relQueueOf(8).map(n=>n.i).slice(0,1);
    relPick(ids); await wait(60);
    const whole=RUN.plan.length; relClose(); await wait(60);
    const fill=Array.from({length:Math.max(0,GIFT_N-whole)},(_,i)=>'filled:'+i);
    meterRun(CURP,fill); pSave();
    const o={before:CURP.meter.unique.length, whole:whole, giftBefore:GIFT_ASK()};
    const keep=CURP.meter.unique.slice(), entries=((CURP.story&&CURP.story.entries)||[]).length;
    relPick(ids); await wait(60);
    o.plan=RUN.plan.length;
    RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown(); await wait(60);
    o.resting=!!document.getElementById('relgiftend');
    const sk=document.getElementById('relrest'); if(sk)sk.click(); await wait(300);
    const n=document.getElementById('relgiftend');
    o.note=n?n.textContent.replace(/\s+/g,' ').trim():null;
    o.notes=document.querySelectorAll('#relgiftend').length;
    o.after=CURP.meter.unique.length; o.added=(RUN.meter&&RUN.meter.added)||0;
    o.kept=keep.every(k=>CURP.meter.unique.indexOf(k)>=0);
    o.entries=((CURP.story&&CURP.story.entries)||[]).length===entries;
    o.giftAfter=GIFT_ASK();
    relClose(); await wait(60);
    o.names=planSight(CURP.plan).locked.map(g=>g.nm);
    /* the next run, on the free week's allowance, says nothing about the gift */
    const ids2=relQueueOf(8).map(x=>x.i).filter(i=>ids.indexOf(i)<0).slice(0,1);
    relPick(ids2.length?ids2:ids); await wait(60);
    o.plan2=RUN.plan.length;
    if(RUN.plan.length){RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown(); await wait(60);
     const sk2=document.getElementById('relrest'); if(sk2)sk2.click(); await wait(300);}
    o.again=document.querySelectorAll('#relgiftend').length;
    relClose(); await wait(60);
    return o;});
   ok(end.whole>0&&end.giftBefore&&end.before===who.N-end.whole,tag+'one whole address before the end the gift still sees everything, '+JSON.stringify({before:end.before,whole:end.whole,gift:end.giftBefore}));
   ok(end.plan>0&&end.before+end.added===end.after&&end.after>=who.N&&!end.giftAfter,
    tag+'the run opens the last of it and the gift is spent, '+JSON.stringify({plan:end.plan,added:end.added,after:end.after}));
   ok(!end.resting,tag+'the two minutes after a run say nothing about it, the results do');
   const want='This release spent the last of your gift. From here, '+end.names.slice(0,-1).join(', ')+' and '+end.names[end.names.length-1]
    +' are locked on your plan. Nothing you released is deleted.';
   ok(end.note===want&&end.notes===1,tag+'the results say it once, naming what closes off the sight table, '+JSON.stringify(end.note));
   ok(end.names.indexOf('saboteurs')===0&&end.names.length>1,tag+'and on free that list starts at saboteurs, '+end.names.join());
   ok(end.kept&&end.entries,tag+'every pattern opened before the run is still on the record, and no story went');
   ok(end.again===0,tag+'the next run does not say it again, '+JSON.stringify({plan2:end.plan2,again:end.again}));
   await pg.evaluate(()=>{setTab(TAB.FIELD);fviewSet('wheel');render();}); await pg.waitForTimeout(900);
   const back=await pg.evaluate(()=>{
    const e=document.querySelector('#fbar .fb-full [data-fb="saboteurs"]');
    return {sab:e?e.getAttribute('data-lock'):'missing', engine:compute().sabs.length, seen:computeSeen().sabs.length};});
   ok(back.sab==='sab'&&back.engine>0&&back.seen===0,tag+'afterwards the padlocks are back, and the engine still computes the chain it no longer draws, '+JSON.stringify(back));
   await pg.evaluate(()=>{setTab(TAB.SUMMARY);render();}); await pg.waitForTimeout(700);
   const sm=await pg.evaluate(()=>({line:!!document.getElementById('sumgift'),
    panels:document.querySelectorAll('#sumbody .lk-panel').length, nothing:/Nothing is running|Nothing running/.test(document.getElementById('sumbody').textContent)}));
   ok(!sm.line&&sm.panels>0&&!sm.nothing,tag+'and Summary drops the gift line and says the chain is locked, never that nothing is running, '+JSON.stringify(sm));}

  ok(err.length===0,tag+'no page errors, '+err.slice(0,2).join(' | '));
  await cx.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})().catch(e=>{ console.log('  FAIL the gate threw: '+e.stack); process.exit(1); });
