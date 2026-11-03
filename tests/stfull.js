/* ============================================================
   THE JOURNAL'S FULL VIEW, AND THE CRISIS DOOR INSIDE IT.
   node tests/stfull.js, and called from tests/functional.js so a full run
   holds it through the same code.

   THE RULING. 2 November, his words: "use a left menu and the right menu",
   for the Journal's Full view only (DECISIONS.md). Dashboard (#stdash) sets
   STV.dash, ui/storyui.js writes body.st-full from it, the shell gives #lcol
   back to the Journal carrying #stleft and nothing else, and ui/stdash.js
   paints Energy into it off this story's parseStory bands.

   THE PRECONDITION, AND WHY IT IS FIRST. The Full view puts the microphone
   and the conversation at the centre of the Journal, and chat is always on
   (STV.chat, 28 October). The Journal's own crisis doors, the line and the
   two Reach someone now buttons, render only under STV.crisis&&!STV.chat,
   so with chat on the page itself carries none. Nothing about the Full view
   may ship until a person in it can still reach the numbers. This holds the
   voluntary door only: there is still no automatic reading of what a person
   writes, and tests/onboarding2.js still asserts that.

   EVERY PRESS IS A REAL POINTER PRESS. Playwright's click refuses a target
   that is hidden, off the screen, moving, or covered by something else at
   the point it would press, so a click that lands is itself the proof the
   control is reachable, and a click that times out fails here by name.
   Both widths, because the phone stacks the rails under the stage.

   WHAT IT HOLDS
     1  the Journal lands in Simple, with chat on, and Simple keeps no left
        column (28 October)
     2  Dashboard turns on Full: st-full, the left column back, #stleft the
        only thing in it but its fold
     3  Energy is silent with no story: one line, no ring
     4  with a story, all seven seats Root to Crown, each figure the 'atom'
        percent of min(10, bands/3), the dash where a seat is untouched, and
        the same number the Journal's own chart springs to (STSEAT)
     5  PHASE 0: in Full with chat on, the crisis door is reached by real
        presses, profile button, Is this a crisis?, Reach someone now, and the
        three numbers are on screen and pressable; closing it leaves the
        person in Full with chat on
     6  and Talk it through, pressed from Full, lands in the Journal with its
        own two Reach someone now doors on screen and working
     7  leaving the tab clears the rail and the class; coming back in Full
        draws both again
     8  the Journal's fold is its own key, and folding it moves nothing on the
        Field (1600 only, where the column sits beside the stage), and
        reopening it does not fade the rail from nought (3 November)
     8c a profile change puts the last record's words down: the example's
        rail is its own, You's words are not on its page, a recording is
        aborted, and back on You its own draft brings the rows back
        (3 November, the live leak on main at b6f86211)
     8d nothing paints the rail while another tab is open
     9  Dashboard pressed again is Simple, exactly as before
   ============================================================ */
const path=require('path');

const STORY='My chest was tight and I felt scared when he shouted at me. I was angry and ashamed after.';
const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];

/* the profile, the way a person picks one at this width: the picker where it
   is on screen, and on a phone the loader beside help, which hands its choice
   to the picker's own change event (ui/personas.js). Real presses both. */
async function pickProfile(p,v,ok,what){
 try{
  if(await p.isVisible('#psel'))await p.selectOption('#psel',String(v),{timeout:5000});
  else{ await p.click('#ploadbtn',{timeout:5000}); await p.click('#pload [data-pv="'+v+'"]',{timeout:5000}); }
  await p.waitForTimeout(250); return true;}
 catch(e){ ok(false,what+': the profile '+v+' could not be picked, '+String(e.message).split('\n')[0]); return false; }}

async function press(p,sel,ok,what){
 try{ await p.click(sel,{timeout:5000}); return true; }
 catch(e){ ok(false,what+': '+sel+' could not be pressed, '+String(e.message).split('\n')[0]); return false; }}

async function stFullGate(browser,FILE,ok,booted){
 for(const [w,h,wn] of WIDTHS){
  const p=await browser.newPage({viewport:{width:w,height:h}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
  await p.goto(FILE); await booted(p);
  const at=wn+': ';

  /* 1. landing, Simple */
  const s0=await p.evaluate(async()=>{
   loadP(0); setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,320));
   const lc=document.getElementById('lcol');
   return {chat:STV.chat, dash:STV.dash, full:document.body.classList.contains('st-full'),
    simple:!!document.querySelector('#stflow.st-simple'),
    lcol:getComputedStyle(lc).display, left:(document.getElementById('stleft')||{}).innerHTML,
    hasHost:!!document.getElementById('stleft'), dashBtn:!!document.getElementById('stdash')};});
  ok(s0.hasHost&&s0.dashBtn,at+'the Journal carries #stleft in the shell and its Dashboard door, '+JSON.stringify(s0));
  ok(s0.chat===true&&s0.dash===false&&!s0.full&&s0.simple,at+'the Journal lands in Simple with chat on, '+JSON.stringify(s0));
  ok(s0.lcol==='none'&&s0.left==='',at+'and Simple keeps no left column and an empty rail, the 28 October ruling, '+s0.lcol);

  /* 2. Dashboard, Full. The heading is sampled from the press on, because the
     first cut of this rail was drawn, blinked out about 900 ms later under the
     left rail's first sight entrance (ui/railmotion.js), and came back: text
     present the whole time, so a check on the text alone passed it. */
  await press(p,'#stdash',ok,at+'Dashboard');
  /* the press itself only redraws the Journal; the entrance runs from the next
     render(), which any next event makes (a turn landing, a profile change).
     This gate's first cut sampled without it and passed the blinking build. */
  const blink=await p.evaluate(async()=>{const out=[]; render(); const t0=performance.now();
   for(const ms of [60,300,600,900,1200,1500]){
    await new Promise(r=>setTimeout(r,Math.max(0,ms-(performance.now()-t0))));
    const e=document.getElementById('st-energy-h'); out.push(e?+(+getComputedStyle(e).opacity).toFixed(2):-1);}
   return out;});
  ok(blink.every(v=>v===1),at+'the Energy heading is on screen from the press on and never blinks out, opacity '+blink.join(','));
  const s1=await p.evaluate(()=>{
   const lc=document.getElementById('lcol'), lp=document.getElementById('lpanel'), sl=document.getElementById('stleft');
   const b=lc.getBoundingClientRect(), r=sl.getBoundingClientRect();
   const shown=[...lp.children].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.id||e.className);
   return {dash:STV.dash, chat:STV.chat, full:document.body.classList.contains('st-full'),
    simple:!!document.querySelector('#stflow.st-simple'), cols:!!document.querySelector('#stflow .st-colr'),
    lcol:getComputedStyle(lc).display, lw:Math.round(b.width), rw:Math.round(r.width), rh:Math.round(r.height),
    shut:document.body.classList.contains('lshut'), shown,
    grid:getComputedStyle(document.querySelector('.mid')).gridTemplateColumns};});
  ok(s1.dash&&s1.chat&&s1.full&&!s1.simple&&s1.cols,at+'Dashboard turns on Full with chat still on, '+JSON.stringify({dash:s1.dash,chat:s1.chat,full:s1.full,simple:s1.simple}));
  ok(s1.lcol==='flex'&&s1.rw>0&&s1.rh>0,at+'and the left column is back with the rail in it, '+JSON.stringify({lcol:s1.lcol,lw:s1.lw,rw:s1.rw,rh:s1.rh}));
  ok(!s1.shut,at+'the Journal\'s left column arrives open in Full');
  ok(s1.shown.length===2&&s1.shown.indexOf('stleft')>=0&&s1.shown.indexOf('lfold')>=0,
   at+'the rail is #stleft and its fold and nothing of the Field\'s, got '+s1.shown.join(','));
  if(wn==='desktop')ok(/^302px /.test(s1.grid)&&s1.grid.split(' ').length===2,at+'the row is the rail and the stage, 302px 1fr, got '+s1.grid);

  /* 3. silent with no story */
  const s2=await p.evaluate(()=>{const sl=document.getElementById('stleft');
   return {txt:ST_TEXT, none:!!sl.querySelector('#st-energy-none'), say:(sl.querySelector('#st-energy-none')||{}).textContent,
    rings:sl.querySelectorAll('.cr').length, rows:sl.querySelectorAll('.st-en-r').length,
    head:(sl.querySelector('#st-energy-h')||{}).textContent};});
  ok(s2.txt.trim()===''&&s2.head==='Energy',at+'the rail opens on Energy, with no story written, '+JSON.stringify({txt:s2.txt,head:s2.head}));
  ok(s2.none&&s2.rings===0&&s2.rows===0,at+'and says nothing is read yet, with no ring and no seat drawn, '+JSON.stringify(s2));

  /* 4. a story, all seven */
  const s3=await p.evaluate(t=>{
   ST_TEXT=t; ST_PARSED=parseStory(t); stRefresh();
   const rows=[...document.querySelectorAll('#stleft .st-en-r')];
   const want=BANDS.map(b=>{const v=Math.min(10,(ST_PARSED.bands[B2K[b]]||0)/3);return {b,v,f:fmtPct('atom',v)};});
   return {seats:rows.map(r=>r.getAttribute('data-seat')), order:BANDS,
    got:rows.map(r=>(r.querySelector('.cr .v')||{}).textContent), want:want.map(x=>x.f),
    spring:want.every(x=>Math.abs(STSEAT[x.b].rdT-x.v)<1e-9),
    dash:want.filter(x=>x.f===PCT_DASH).length, lit:want.filter(x=>x.f!==PCT_DASH).length,
    tips:rows.every(r=>!!r.querySelector('.st-en-n .tipu[data-tip]')),
    none:!!document.querySelector('#st-energy-none')};},STORY);
  ok(s3.seats.join()===s3.order.join(),at+'with a story, all seven seats Root to Crown, got '+s3.seats.join(','));
  ok(s3.got.join()===s3.want.join(),at+'each figure is the atom percent of min(10, bands/3), got '+s3.got.join(',')+' want '+s3.want.join(','));
  ok(s3.lit>0&&s3.dash>0,at+'a seat the story reached prints its percent and an untouched seat its dash, and stays, '+s3.lit+' lit, '+s3.dash+' dashed');
  ok(s3.spring,at+'and every ring reads the number the Journal\'s own chart springs to, STSEAT');
  ok(s3.tips&&!s3.none,at+'each seat name carries its own sentence, and the silent line is gone');

  /* 5. PHASE 0. Full, chat on, the crisis door by real presses */
  await p.evaluate(()=>window.scrollTo(0,0));
  const pre=await p.evaluate(()=>({chat:STV.chat,dash:STV.dash,full:document.body.classList.contains('st-full'),
   own:[...document.querySelectorAll('#story [data-crisis]')].length}));
  ok(pre.chat&&pre.dash&&pre.full,at+'Phase 0 is measured in Full with chat on, '+JSON.stringify(pre));
  let reached=false;
  if(await press(p,'#profbtn',ok,at+'Phase 0, the profile button')
   &&await press(p,'#profmenu [data-pmcrisis]',ok,at+'Phase 0, Is this a crisis? in the profile menu')){
   await p.waitForTimeout(120);
   const ask=await p.evaluate(()=>{const c=document.getElementById('crisis');
    return {open:!!c&&!c.hidden&&CRISIS.open, view:CRISIS.view, role:c&&c.querySelector('[role=dialog]')?'dialog':''};});
   ok(ask.open&&ask.view==='ask'&&ask.role==='dialog',at+'Phase 0, the crisis panel opens over the Full Journal, '+JSON.stringify(ask));
   if(await press(p,'#crisis [data-crisis="reach"]',ok,at+'Phase 0, Reach someone now')){
    await p.waitForTimeout(120);
    const nums=await p.evaluate(()=>[...document.querySelectorAll('#crisis [data-crisisline]')].map(li=>({
     k:li.getAttribute('data-crisisline'), go:[...li.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))})));
    ok(nums.map(n=>n.k).join()==='988,741741,911'&&nums.every(n=>n.go.length>0),
     at+'Phase 0, the three numbers are on screen, '+JSON.stringify(nums));
    /* each number pressable: hovered, which runs the same actionability
       checks a click does, without dialling anything */
    let all=true;
    for(const sel of ['#crisis a[href="tel:988"]','#crisis a[href^="sms:741741"]','#crisis a[href="tel:911"]']){
     try{ await p.hover(sel,{timeout:4000}); }catch(e){ all=false; ok(false,at+'Phase 0, '+sel+' is not pressable, '+String(e.message).split('\n')[0]); }}
    ok(all,at+'Phase 0, Call 988, Text 741741 and Call 911 are each reachable by a pointer');
    reached=all;}
   await press(p,'#crisis [data-crisis="close"]',ok,at+'Phase 0, Close');
   await p.waitForTimeout(120);
   const post=await p.evaluate(()=>({open:CRISIS.open,chat:STV.chat,dash:STV.dash,full:document.body.classList.contains('st-full'),tab:S.tab===TAB.STORY}));
   ok(!post.open&&post.chat&&post.dash&&post.full&&post.tab,at+'Phase 0, closing the panel leaves the person in the Full Journal with chat on, '+JSON.stringify(post));}
  ok(reached,at+'PHASE 0: the crisis door is reachable in the Full Journal with chat on');

  /* 6. Talk it through from Full: the Journal's own doors */
  await p.evaluate(()=>window.scrollTo(0,0));
  if(await press(p,'#profbtn',ok,at+'Talk it through, the profile button')
   &&await press(p,'#profmenu [data-pmcrisis]',ok,at+'Talk it through, the menu row')
   &&await press(p,'#crisis [data-crisis="talk"]',ok,at+'Talk it through')){
   await p.waitForTimeout(260);
   const tk=await p.evaluate(()=>({crisis:STV.crisis,chat:STV.chat,dash:STV.dash,full:document.body.classList.contains('st-full'),
    line:!!document.getElementById('stcrisis'), doors:document.querySelectorAll('#story [data-crisis="reachnow"]').length}));
   ok(tk.crisis&&!tk.chat&&tk.dash&&tk.full,at+'Talk it through from Full stays in Full, in the written box, '+JSON.stringify(tk));
   ok(tk.line&&tk.doors===2,at+'and the Journal carries its line and both Reach someone now doors, '+JSON.stringify(tk));
   /* ONE DOOR ON A PHONE, ruled 16 October (shell/head.html, "ONE DOOR ON A
      PHONE"): at 640 and under the foot door is hidden on purpose and the one
      by the line stays. This gate's first cut pressed both at 390 and failed
      on the ruling, not on the product, so the phone holds the ruling
      instead: the foot door is not shown, and the line's door is pressed. */
   if(wn==='phone'){
    const bar=await p.evaluate(()=>{const e=document.querySelector('#story .st-crxbar');return e?getComputedStyle(e).display:'missing';});
    ok(bar==='none',at+'one door on a phone, the 16 October ruling: the foot door is hidden, got '+bar);}
   for(const sel of wn==='phone'?['#story .st-crxline']:['#story .st-crxline','#story .st-crxbar']){
    if(await press(p,sel,ok,at+'the Journal\'s own door')){
     await p.waitForTimeout(120);
     const v=await p.evaluate(()=>({open:CRISIS.open,view:CRISIS.view,n:document.querySelectorAll('#crisis [data-crisisline]').length}));
     ok(v.open&&v.view==='reach'&&v.n===3,at+sel+' opens straight on the three numbers, '+JSON.stringify(v));
     await press(p,'#crisis [data-crisis="close"]',ok,at+'Close');
     await p.waitForTimeout(100);}}
   await p.evaluate(()=>{STV.crisis=false; STV.chat=true; stRender();});}

  /* 7. leaving clears, returning redraws */
  const s4=await p.evaluate(async()=>{const o={};
   setTab(TAB.FIELD); render(); await new Promise(r=>setTimeout(r,260));
   o.offFull=document.body.classList.contains('st-full'); o.offLeft=document.getElementById('stleft').innerHTML;
   o.offRail=getComputedStyle(document.getElementById('stleft')).display;
   /* a shut column hides every section by the fold's own rule, which is the
      Field's default on a desktop with nothing in the store, so the section
      is read with the fold set aside for the one measurement */
   o.fieldShut=document.body.classList.contains('lshut');
   document.body.classList.remove('lshut');
   o.fieldSec=getComputedStyle(document.querySelector('#lpanel .lsec[data-sec="overlap"]')).display;
   if(o.fieldShut)document.body.classList.add('lshut');
   setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,260));
   o.backFull=document.body.classList.contains('st-full'); o.backDash=STV.dash;
   o.backRows=document.querySelectorAll('#stleft .st-en-r').length;
   return o;});
  ok(!s4.offFull&&s4.offLeft===''&&s4.offRail==='none',at+'leaving the Journal clears the rail and the class, '+JSON.stringify(s4));
  ok(s4.fieldSec!=='none',at+'and the Field\'s left rail is the Field\'s again, '+s4.fieldSec);
  ok(s4.backFull&&s4.backDash&&s4.backRows===7,at+'coming back in Full draws the class and all seven seats again, '+JSON.stringify(s4));

  /* 8. the fold key, beside the stage only */
  if(wn==='desktop'){
   const k0=await p.evaluate(()=>({lcol:STORE.get('lcol'),lcols:STORE.get('lcols')}));
   await press(p,'#lfold',ok,at+'the Journal\'s fold');
   await p.waitForTimeout(160);
   const k1=await p.evaluate(async()=>{const o={shut:document.body.classList.contains('lshut'),
     lcols:STORE.get('lcols'),lcol:STORE.get('lcol'),grid:getComputedStyle(document.querySelector('.mid')).gridTemplateColumns};
    setTab(TAB.FIELD); render(); await new Promise(r=>setTimeout(r,200));
    o.fieldShut=document.body.classList.contains('lshut');
    setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,200));
    o.backShut=document.body.classList.contains('lshut');
    return o;});
   ok(k1.shut&&k1.lcols==='shut'&&k1.lcol===k0.lcol&&/^58px /.test(k1.grid),
    at+'folding the Journal writes lcols and leaves the Field\'s lcol alone, '+JSON.stringify({k0,k1}));
   /* the Field's own answer: what its key holds, or with nothing held, shut
      beside the stage (GO in TASKS.md, "the field left panel starts closed") */
   const fieldWant=k0.lcol?k0.lcol==='shut':true;
   ok(k1.fieldShut===fieldWant&&k1.backShut,at+'and the Field keeps its own fold while the Journal keeps its own, '+JSON.stringify(k1));
   await press(p,'#lfold',ok,at+'the Journal\'s fold, open again');
   /* 8b. and opening it does not fade the rail out and back. Read up the
      chain: computed opacity does not include an ancestor's, so the heading's
      own read 1 the whole time railOpened was fading #stleft from 0 (main at
      b6f86211, 3 November). The probe is checked against that build. */
   await p.waitForTimeout(500);
   await press(p,'#lfold',ok,at+'the Journal\'s fold, shut for the reopen');
   await p.waitForTimeout(300);
   await press(p,'#lfold',ok,at+'the Journal\'s fold, reopened');
   const fo=await p.evaluate(async()=>{const o=[]; const t0=performance.now();
    const eff=e=>{let v=1; for(;e&&e.nodeType===1;e=e.parentElement)v*=+getComputedStyle(e).opacity; return +v.toFixed(2);};
    for(const ms of [0,40,100,180,300]){
     await new Promise(r=>setTimeout(r,Math.max(0,ms-(performance.now()-t0))));
     const h=document.getElementById('st-energy-h');
     o.push({ms,eff:h?eff(h):-1,anims:document.getElementById('stleft').getAnimations().length});}
    return o;});
   ok(fo.every(x=>x.eff===1&&x.anims===0),at+'reopening the fold leaves the rail on screen, no fade from nought, '+JSON.stringify(fo));}

  /* 8c. THE WORDS ARE THE OPEN RECORD'S. 3 November, a live leak on main at
     b6f86211: a story landed on You in Full, the picker moved to a worked
     example, and S.who named the example while ST_TEXT, all seven Energy rows
     and the conversation bubble were You's, byte for byte. render() on the
     Story called only stFieldPaint, which drew none of them again.

     The words land the way a voice turn lands them, srcTurnCommit and then
     stRender, because that is the Full view's door and a microphone does not
     run headless; the profile change is the picker's own change event, the
     one route its menu hands a choice to. A fake recogniser stands in as
     listening, so the switch is also seen to abort it, never stop it: stop
     delivers a last sentence, which would land in the next person's page.

     The probe is checked against a known good case first: the example opened
     on a clean Journal, nothing written, reads silent. If that read were
     wrong, a pass below would mean nothing. */
  const PHRASE='shouted at me';
  const ex=await p.evaluate(()=>{const i=PEOPLE.findIndex(x=>!x.you); return {i, nm:PEOPLE[i]&&PEOPLE[i].nm};});
  const railRead=()=>p.evaluate(ph=>({who:S.who, txt:ST_TEXT,
   rows:document.querySelectorAll('#stleft .st-en-r').length,
   figs:[...document.querySelectorAll('#stleft .st-en-r .cr .v')].map(e=>e.textContent).join(' '),
   none:!!document.querySelector('#stleft #st-energy-none'),
   html:document.getElementById('stleft').innerHTML,
   page:(document.getElementById('story').textContent||'').indexOf(ph)>=0,
   full:document.body.classList.contains('st-full')}),PHRASE);
  /* clean first, so the control reads the same on a build with the leak:
     step 4's story is still in the box here, and a control that fails on the
     bug it guards is a second sighting of it, not a check of the probe */
  await p.evaluate(()=>{ST_TEXT='';ST_PARSED=null;srcFresh();stDraft();stRender();});
  await pickProfile(p,String(ex.i),ok,at+'the picker');
  const k0=await railRead();
  ok(k0.who===ex.i&&k0.txt===''&&k0.rows===0&&k0.none&&!k0.page,
   at+'the probe, against a known case: '+ex.nm+' on a clean Journal reads silent, '+JSON.stringify({who:k0.who,rows:k0.rows,none:k0.none,page:k0.page}));
  await pickProfile(p,'0',ok,at+'the picker');
  await p.evaluate(t=>{srcTurnCommit(t); stRender();
   window.__rec={abort:0,stop:0}; ST_REC={abort(){__rec.abort++;},stop(){__rec.stop++;},start(){}};
   ST_LISTEN=true; ST_WANT_LISTEN=true; ST_REC_ON=true; return true;},STORY);
  const a0=await railRead();
  ok(a0.who===0&&a0.rows===7&&a0.page&&a0.full,at+'You, in Full, with a story landed: seven rows and the words on the page, '+a0.figs);
  await pickProfile(p,String(ex.i),ok,at+'the picker');
  const b0=await railRead();
  const rec=await p.evaluate(()=>({rec:window.__rec, listen:ST_LISTEN, want:ST_WANT_LISTEN}));
  ok(b0.who===ex.i&&b0.txt==='',at+'moving to '+ex.nm+' puts You\'s words down, ST_TEXT '+JSON.stringify(b0.txt.slice(0,40)));
  ok(b0.rows===0&&b0.none&&b0.html!==a0.html&&b0.html===k0.html,
   at+'and '+ex.nm+'\'s Energy rail is '+ex.nm+'\'s own, the same rail the clean case drew, not You\'s seven rows, got '+b0.rows+' rows, '+b0.figs);
  ok(!b0.page,at+'and You\'s words are not on '+ex.nm+'\'s Journal page');
  ok(rec.rec.abort===1&&rec.rec.stop===0&&!rec.listen&&!rec.want,at+'and a recording still running is aborted, not stopped, '+JSON.stringify(rec));
  await p.evaluate(()=>{ST_REC=null; ST_REC_ON=false;});
  await pickProfile(p,'0',ok,at+'the picker');
  const a1=await railRead();
  ok(a1.who===0&&a1.rows===7&&a1.figs===a0.figs&&a1.page,at+'back on You, You\'s own draft brings back the same seven rows, '+a1.figs);

  /* 8d. AND NOTHING PAINTS THE RAIL OFF THE JOURNAL. stRender runs from a
     voice turn landing and from stCommit while another tab is open, and it
     reached stDashLeft through stPaintAll, which wrote a reading into the
     host stRailClear had emptied. */
  const off=await p.evaluate(async t=>{setTab(TAB.FIELD); render(); await new Promise(r=>setTimeout(r,200));
   const before=document.getElementById('stleft').innerHTML;
   srcTurnCommit('And my stomach dropped.'); stRender();
   const o={before, after:document.getElementById('stleft').innerHTML, full:document.body.classList.contains('st-full')};
   setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,200));
   o.back=document.querySelectorAll('#stleft .st-en-r').length; return o;},STORY);
  ok(off.before===''&&off.after===''&&!off.full,at+'a turn landing while the Field is open leaves the rail empty, '+JSON.stringify({before:off.before.length,after:off.after.length,full:off.full}));
  ok(off.back===7,at+'and back on the Journal the rail is drawn again, '+off.back+' rows');
  await p.evaluate(()=>{ST_TEXT='';ST_PARSED=null;if(typeof srcFresh==='function')srcFresh();if(typeof stDraft==='function')stDraft();stRender();});

  /* 9. Dashboard again is Simple */
  await p.evaluate(()=>window.scrollTo(0,0));
  await press(p,'#stdash',ok,at+'Dashboard, off');
  await p.waitForTimeout(220);
  const s5=await p.evaluate(()=>({dash:STV.dash,full:document.body.classList.contains('st-full'),
   simple:!!document.querySelector('#stflow.st-simple'),lcol:getComputedStyle(document.getElementById('lcol')).display,
   left:document.getElementById('stleft').innerHTML}));
  ok(!s5.dash&&!s5.full&&s5.simple&&s5.lcol==='none'&&s5.left==='',at+'Dashboard pressed again is Simple as it was, '+JSON.stringify(s5));
  await p.evaluate(()=>{ST_TEXT='';ST_PARSED=null;if(typeof stDraft==='function')stDraft();});

  ok(errs.length===0,at+'no page error on the way, '+errs.join(' | '));
  await p.close();}}

module.exports={stFullGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.documentElement.getAttribute('data-boot')==='ok',null,{timeout:30000}); }catch(e){}
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  require('./net.js').guardBrowser(browser);
  /* the same sight the full run seeds, tests/seed.js */
  const {FULL_SIGHT}=require('./seed.js');
  browser.newPage=(orig=>async function(...a){const pg=await orig.apply(this,a); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  console.log('\n=== the Journal\'s Full view, and the crisis door inside it ===');
  try{ await stFullGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
