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
        Field (1600 only, where the column sits beside the stage)
     9  Dashboard pressed again is Simple, exactly as before
    10  a profile change in Full leaves none of the last person's words, rail,
        page text or parse on screen, writes nothing onto the new
        record, brings the words back on the way home, drops the last
        commit's credit and its safe line, and the fold reopening runs no
        fade on the rail
   ============================================================ */
const path=require('path');

const STORY='My chest was tight and I felt scared when he shouted at me. I was angry and ashamed after.';
const WIDTHS=[[1600,1000,'desktop'],[390,844,'phone']];

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
   /* Root Energetics and not Energetic summary: SV18 hid the summary on his
      words, "Just hide it", so it reads none on every tab and can no longer
      say whether the Field's rail came back. Root Energetics leads it now. */
   o.fieldSec=getComputedStyle(document.querySelector('#lpanel .lsec[data-sec="energetics"]')).display;
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
   await press(p,'#lfold',ok,at+'the Journal\'s fold, open again');}

  /* 9. Dashboard again is Simple */
  await p.evaluate(()=>window.scrollTo(0,0));
  await press(p,'#stdash',ok,at+'Dashboard, off');
  await p.waitForTimeout(220);
  const s5=await p.evaluate(()=>({dash:STV.dash,full:document.body.classList.contains('st-full'),
   simple:!!document.querySelector('#stflow.st-simple'),lcol:getComputedStyle(document.getElementById('lcol')).display,
   left:document.getElementById('stleft').innerHTML}));
  ok(!s5.dash&&!s5.full&&s5.simple&&s5.lcol==='none'&&s5.left==='',at+'Dashboard pressed again is Simple as it was, '+JSON.stringify(s5));
  await p.evaluate(()=>{ST_TEXT='';ST_PARSED=null;if(typeof stDraft==='function')stDraft();});

  /* 10. THE WORDS ARE THE OPEN RECORD'S, 3 November. The bug this holds was
     on atuned.world from PR #169: in Full, with a story on the Journal, the
     picker moved to another person and render() reached only stFieldPaint,
     which refreshed neither the words nor the Energy rail. S.who said Tomas
     and the rail, the conversation and ST_TEXT were byte for byte You's.
     The picker is moved by a real selectOption, which fires the same change
     event a person's choice does (ui/personas.js, loadP). force only skips
     the visibility wait, because at 390 the select sits behind its menu. */
  await press(p,'#stdash',ok,at+'Dashboard, on again for the switch');
  await p.waitForTimeout(200);
  const MARK='he shouted at me';
  const a=await p.evaluate(async t=>{loadP(0); ST_TEXT=t; ST_PARSED=parseStory(t); stRefresh();
   await new Promise(r=>setTimeout(r,650));
   const other=[...document.querySelectorAll('#psel option')].map(o=>o.value).find(v=>v!=='0');
   return {other, who:S.who, full:document.body.classList.contains('st-full'),
    rail:document.getElementById('stleft').innerHTML,
    rows:[...document.querySelectorAll('#stleft .st-en-r .cr .v')].map(e=>e.textContent).join(',')};},STORY);
  ok(a.who===0&&a.full&&a.rows.split(',').length===7,at+'the switch is measured from You in Full with seven seats drawn, '+JSON.stringify({who:a.who,full:a.full,rows:a.rows}));
  await p.selectOption('#psel',a.other,{force:true});
  await p.waitForTimeout(300);
  const b=await p.evaluate(m=>({who:S.who, text:ST_TEXT, parsed:!!ST_PARSED,
   rail:document.getElementById('stleft').innerHTML,
   rows:document.querySelectorAll('#stleft .st-en-r').length,
   none:!!document.getElementById('st-energy-none'),
   page:document.getElementById('story').textContent.indexOf(m)>=0,
   draft:(CURP&&CURP.story&&CURP.story.draft)||null,
   youDraft:(PROFILES[0]&&PROFILES[0].story&&PROFILES[0].story.draft)||null}),MARK);
  ok(b.who===+a.other&&b.text===''&&!b.parsed,at+'after the picker moves, the Journal holds none of the last person\'s words, '+JSON.stringify({who:b.who,text:b.text.slice(0,30),parsed:b.parsed}));
  ok(b.rail!==a.rail&&b.rows===0&&b.none,at+'and the Energy rail is the new person\'s, silent, not the last person\'s seven seats, '+JSON.stringify({rows:b.rows,none:b.none}));
  /* the pending imprints (impGhosts) read ST_PARSED, held null above. They
     are not counted here: on Tomas the story's addresses are already live,
     so the count reads 0 with or without the leak and would pass for the
     wrong reason. Measured: 5 on You, 0 on Tomas on the leaking build. */
  ok(!b.page,at+'and no text on the Journal carries the last person\'s story, '+JSON.stringify({page:b.page}));
  ok(b.draft===null&&b.youDraft===STORY,at+'the words stay on their own record and are not written onto the new one, '+JSON.stringify({draft:b.draft,you:!!b.youDraft}));
  await p.selectOption('#psel','0',{force:true});
  await p.waitForTimeout(300);
  const c=await p.evaluate(()=>({who:S.who, text:ST_TEXT,
   rows:[...document.querySelectorAll('#stleft .st-en-r .cr .v')].map(e=>e.textContent).join(',')}));
  ok(c.who===0&&c.text===STORY&&c.rows===a.rows,at+'and back on You, the words and the same seven figures return, '+JSON.stringify({who:c.who,rows:c.rows,want:a.rows}));
  /* the last commit is a record's too: STV.lastT is what relPick credits a
     run to, so it may not survive into the next person's release */
  const d=await p.evaluate(async()=>{stCommit(); const k={lastT:STV.lastT, found:STV.lastFound.length};
   const s=document.getElementById('psel'); s.value=[...s.options].map(o=>o.value).find(v=>v!=='0');
   s.dispatchEvent(new Event('change')); await new Promise(r=>setTimeout(r,200));
   return {before:k, lastT:STV.lastT, found:STV.lastFound.length};});
  ok(d.before.lastT!==null&&d.lastT===null&&d.found===0,at+'a commit\'s found imprints and its time do not carry to the next person, '+JSON.stringify(d));
  /* NOR DOES THE SAFE LINE, 4 November. stCommit keeps STV.safeSaid up so
     the line stands once the box empties (stSafe), and stOwn did not clear
     it: a safety commit on one record, a switch, and the next record was
     shown the line and the door, and on Talk heard the line, for words it
     never wrote. A sample person's Journal draws no conversation at all, so
     the picker to Tomas above cannot see it; this switch is New profile, the
     #iqnew handler's own calls (ui/intakeui.js). srcSayNow is what a Talk
     press speaks. The last check is the real trip on the new record, which
     must still draw both. */
  const SAFE='I keep thinking about killing myself.';
  const seen=()=>p.evaluate(()=>({safeSaid:STV.safeSaid, safeUp:SRC_SAFE_UP, rec:CURP&&CURP.name, talk:srcSayNow(),
   line:(document.querySelector('#stsafe p')||{}).textContent||null,
   reach:document.querySelectorAll('[data-crisis="reachnow"]').length}));
  await p.evaluate(async t=>{loadP(0); setTab(TAB.STORY); render(); await new Promise(r=>setTimeout(r,200));
   ST_TEXT=t; ST_PARSED=parseStory(t); stRefresh(); stRender(); await new Promise(r=>setTimeout(r,200));
   stCommit(); await new Promise(r=>setTimeout(r,250));},SAFE);
  const e0=await seen();
  ok(e0.safeSaid&&e0.line&&e0.reach>0&&e0.talk===e0.line,at+'a safety commit keeps the line and its door standing on the record that wrote it, '+JSON.stringify(e0));
  await p.evaluate(async()=>{pNew('Safe switch'); loadProfile(CURP); IQ_OPEN=null; IQ_SEAT=null; IQ_ARCH=null;
   syncCh(); syncLw(); syncSoul(); renderIntake(); render(); await new Promise(r=>setTimeout(r,250));});
  const e1=await seen();
  ok(e1.rec==='Safe switch'&&!e1.safeSaid&&!e1.safeUp&&e1.line===null&&e1.reach===0&&e1.talk!==e0.line,
   at+'after a switch the next record is shown no safe line and no door, and Talk would not say the line, for words it never wrote, '+JSON.stringify(e1));
  await p.evaluate(async t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stRefresh(); stRender(); await new Promise(r=>setTimeout(r,200));},SAFE);
  const e2=await seen();
  ok(e2.line===e0.line&&e2.reach>0,at+'and its own words trip the line and the door on it, '+JSON.stringify(e2));
  await p.evaluate(()=>{ST_TEXT=''; ST_PARSED=null; stDraft(); profDelete(CURP.id);});
  await p.evaluate(()=>{loadP(0); setTab(TAB.STORY); render();});
  /* the fold opening again does not fade the rail in, the rule rmVisible
     already keeps for first sight (ui/railmotion.js, railOpened) */
  if(wn==='desktop'){
   await p.waitForTimeout(300);
   await press(p,'#lfold',ok,at+'the fold, shut, for the reopen fade');
   await p.waitForTimeout(200);
   await press(p,'#lfold',ok,at+'the fold, open again');
   const an=await p.evaluate(async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const e=document.getElementById('stleft'); return {shut:document.body.classList.contains('lshut'),
     n:e.getAnimations().length, rows:e.querySelectorAll('.st-en-r').length+(e.querySelector('#st-energy-none')?1:0)};});
   ok(!an.shut&&an.rows>0&&an.n===0,at+'reopening the fold runs no fade on the Energy rail, '+JSON.stringify(an));}

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
