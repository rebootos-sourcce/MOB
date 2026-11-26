/* ============================================================
   THE INTRO GATE, ui/srcintro.js. Source reads an example, eleven seconds,
   once per device, between the door and the first card.

   UPDATED 18 November: his words, "once you get past the initial attuned
   intro, it goes straight to your dashboard... we're not using any of
   this, these two systems anymore." ui/login.js's loginEnter no longer
   calls srcIntro at all, so the real door opens neither this screen nor
   onboarding; it marks the profile onboarded and lands on the dashboard
   at once (tests/onboarding2.js holds that in full). srcintro.js itself is
   not touched, deleted or stripped: its mechanics stay real code, just
   unreachable from the door, the same way onboard.js's sheet stays
   reachable only from Settings' replay. There is no replay button for this
   screen anywhere in the product (unlike onboard.js's #acob), so nothing
   here is "a new entry point": srcIntro is an existing global function,
   already self-governing (srcIntroDue decides for itself when not to run),
   and calling it directly is the same kind of direct call this suite
   already makes on obOpen, relPick and stCommit without a button behind
   them either.

   WHAT IT HOLDS NOW:

     1  the example is still what the intro says it is: parseStory, through
        the face's own plan(), lands "heart sank" on Heart and "afraid" on
        Root, and the copy passes the voice gate line by line. Unchanged,
        no door involved.
     2  THE REAL DOOR, at 1600 and at 390: it opens neither #srcintro nor
        onboarding, marks the profile onboarded at once, never marks the
        device as having seen the example (since it is never shown), and
        lands straight on the dashboard (Summary). A second arrival is no
        different. Checked against the build before this change, where a
        fresh profile behind the same door meets #srcintro first.
     3  THE SCREEN'S OWN MECHANICS, opened directly (srcIntro(done), the
        same callback loginEnter used to pass it, obOpen(false)), because
        hiding the door is not deleting the screen: the beats, at 1600 and
        at 390, in order, read off the page as each caption arrives rather
        than off a clock in this file; the hand over, the once-per-device
        decision, Skip and Escape landing on the end frame, reduced motion,
        and a walk already half done (?dev=1) resuming without the intro.
        The face's own seats are Heart, Sad and Root, Fear at the hold, and
        the face box is the size the seat labels need (a radius of 140,
        TX.res in ui/srcface.js).
     4  an arrival that is already onboarded meets neither screen either
        way in, through the real door or direct.

   Screenshots of the beats go to $SHOTS when it is set.

       NODE_PATH=$(npm root -g) node tests/srcintro.js

   Run from the repository root. Exits non zero on any failure.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), cp=require('child_process');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
const SHOTS=process.env.SHOTS||'';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
/* THE HAND OVER UNDER A LOADED CLOCK. The browser check below samples real
   frames and could only fail when CI happened to stall: at 3541a34 both exit
   timers ran before any frame and it read 0 frames of overlap. This runs
   srcIntroLeave itself with the timers and frames held by hand, in both
   orders, so the ordering guarantee is checked every run and not only when
   the machine is slow. The function is cut out of the source by name, up to
   the next top level function or the end of the file. */
const vm=require('vm');
const introSrc=fs.readFileSync(path.resolve(__dirname,'../atuned_src/ui/srcintro.js'),'utf8');
const leaveAt=introSrc.indexOf('function srcIntroLeave(){');
const leaveEnd=introSrc.indexOf('\nfunction ',leaveAt+1);
const leaveSrc=introSrc.slice(leaveAt,leaveEnd<0?undefined:leaveEnd);
function handoverInOrder(exitFirst){
 const tag=exitFirst?' (exit timer first)':' (hand timer first)';
 const timers=[],frames=[],seen=[];
 const h={classList:{add(){}},parentNode:{removeChild(){seen.push('removed');}}};
 const sx={left:false,t:[],h,still:false,done(){seen.push('card');}};
 const scope={SX:sx,SRC_INTRO_T:{hand:120,out:260},
  SrcFace:{clear(){},give(){}},uniHandBack(){},srcVoiceCut(){},srcIntroKey(){},
  clearTimeout(){},removeEventListener(){},
  requestAnimationFrame:fn=>frames.push(fn),setTimeout:(fn,ms)=>timers.push({fn,ms})};
 vm.runInNewContext(leaveSrc+';srcIntroLeave();',scope,{timeout:5000});
 ok(leaveAt>=0&&timers.length===2,'hand over schedules two timers'+tag);
 if(timers.length!==2)return;
 timers.sort((a,b)=>exitFirst?b.ms-a.ms:a.ms-b.ms);
 timers[0].fn();
 ok(!seen.includes('removed'),'the face is still there after the first timer'+tag);
 timers[1].fn();
 ok(seen.includes('card')&&!seen.includes('removed')&&frames.length===1,'both timers run, the card is open and the face is not yet removed'+tag);
 if(frames.length)frames.shift()();
 ok(!seen.includes('removed')&&frames.length===1,'the face survives the first frame after both'+tag);
 if(frames.length)frames.shift()();
 ok(seen.includes('removed')&&scope.SX===null,'and is removed on the second'+tag);
}
handoverInOrder(false);
handoverInOrder(true);
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
const shot=async(p,n)=>{ if(!SHOTS)return; fs.mkdirSync(SHOTS,{recursive:true}); await p.screenshot({path:path.join(SHOTS,n+'.png')}); };

/* the door, closed the way the app's own dev harness closes it, as
   tests/onboarding2.js does. Since 18 November it no longer opens
   srcIntro or onboarding on its own; kept for the block that checks
   exactly that, and for "never after onboarded", which never opened
   either screen even before this change. */
async function door(page){
 await page.waitForSelector('#loginb-go',{timeout:8000});
 await page.evaluate(()=>{loginClose(); loginEnter();});}
/* THE SCREEN OPENED DIRECTLY, the real door's own dead chain reused rather
   than reinvented: srcIntro is still the global function loginEnter used
   to call, with the same callback it used to pass it. This is not a new
   product entry point, only a direct call, the same kind this suite
   already makes elsewhere (obOpen, relPick, stCommit) with no button
   behind them either. srcIntroDue still decides for itself when not to
   run (DEV_SKIP, a device that has seen it, a walk already started), so
   calling srcIntro here reads exactly the same decision the dead chain
   used to. */
async function openIntro(page){
 await page.waitForSelector('#loginb-go',{timeout:8000});
 await page.evaluate(()=>{loginClose();});
 await page.evaluate(()=>{srcIntro(function(){ if(typeof obOpen==='function')obOpen(false); });});}
/* every caption's arrival, stamped from the intro's own start, by watching
   the class each one gains, so the gate reads the beats the page shows */
async function watch(page){
 await page.evaluate(()=>{ const t0=SX.t0; window.__SX=[];
  const mo=new MutationObserver(ms=>ms.forEach(m=>{ const e=m.target;
   if(m.attributeName!=='class'||!e.classList.contains('on')||e.__sxon)return; e.__sxon=1;
   window.__SX.push({c:e.className.split(' ')[0],k:e.dataset.k,h:e.dataset.h,t:Math.round(performance.now()-t0)}); }));
  mo.observe(SX.h,{subtree:true,attributes:true,attributeFilter:['class']}); });}
const endFrame=page=>page.evaluate(()=>({
 w:document.querySelectorAll('#srcintro .sx-w.on').length, ws:document.querySelectorAll('#srcintro .sx-w').length,
 u:document.querySelectorAll('#srcintro .sx-u.on').length, rows:document.querySelectorAll('#srcintro .sx-row.on').length,
 go:!!document.querySelector('#srcintro .sx-go.on'), ex:!!document.querySelector('#srcintro .sx-ex.on'),
 l1:!!document.querySelector('#srcintro .sx-l1.on'), ob:!!(OB&&OB.open)}));

(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);

console.log('=== 1. the example, read by the real engine, and the copy ===');
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const pl=await page.evaluate(()=>SrcFace.plan(SRC_INTRO_EX));
 ok(pl&&pl.hits.length===2,'two counted seat hits in the example, got '+(pl&&pl.hits.length));
 const h0=pl&&pl.hits[0], h1=pl&&pl.hits[1];
 ok(h0&&h0.seat==='Heart'&&pl.words[h0.k]==='sank'&&h0.n===2,'the first hit is Heart, on "heart sank"');
 ok(h1&&h1.seat==='Root'&&pl.words[h1.k]==='afraid'&&h1.n===1,'the second hit is Root, on "afraid"');
 const p=await page.evaluate(()=>{ const r=parseStory(SRC_INTRO_EX), by={};
  r.imprints.forEach(m=>{ (by[m.band]=by[m.band]||{n:[],f:{}}); if(by[m.band].n.indexOf(m.node)<0)by[m.band].n.push(m.node); by[m.band].f[m.fetter]=1; });
  return {by, denied:r.denied.length, others:r.others.length, safe:srcSafe(SRC_INTRO_EX)}; });
 ok(p.by.Heart&&p.by.Heart.n.length===4&&p.by.Heart.f.Sad,'Heart lands on four addresses with Sad');
 ok(p.by.Root&&p.by.Root.n.length===4&&p.by.Root.f.Fear,'Root lands on four addresses with Fear');
 ok(Object.keys(p.by).length===2,'no third seat, got '+Object.keys(p.by).join(','));
 ok(p.denied===0&&p.others===0,'nothing denied and nothing about someone else');
 ok(!p.safe,'srcSafe does not trip on the example');
 const lines=await page.evaluate(()=>[SRC_INTRO_L1,SRC_INTRO_EB,SRC_INTRO_EX,SRC_INTRO_SAY,'Write your own','Skip']
  .concat([...new DOMParser().parseFromString('<ul>'+srcIntroRows(SrcFace.plan(SRC_INTRO_EX))+'</ul>','text/html').querySelectorAll('li')].map(l=>l.textContent)));
 ok(lines.indexOf('Heart, mid sternum.')>=0&&lines.indexOf('Root, the base of the spine.')>=0,'the rows are FLOWSEAT\'s own seats: '+lines.slice(6).join(' / '));
 lines.forEach(l=>{ let out='';
  try{ out=cp.execFileSync('python3',['.claude/skills/atuned-voice/check.py','--line',l],{encoding:'utf8'}); }catch(e){ out=String(e.stdout||'')+'FAILED'; }
  ok(/no hard failures/.test(out)&&!/FAILED/.test(out),'voice gate passes "'+l+'"'); });
 await page.close();
}

for(const [W,H] of [[1600,1000],[390,844]]){
 const at=' at '+W;
 console.log('=== 2. the real door opens neither screen, straight to the dashboard'+at+' ===');
 {
  const ctx=await browser.newContext({viewport:{width:W,height:H}});
  const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  await door(page);
  await page.waitForTimeout(400);
  const d0=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open),
   onboarded:!!(CURP&&CURP.ui&&CURP.ui.onboarded), key:STORE.get(SRC_INTRO_KEY), tab:S.tab,
   tabIsSummary:S.tab===TAB.SUMMARY}));
  ok(!d0.intro,'the real door no longer plays the example'+at);
  ok(!d0.ob,'and no longer opens the first run either'+at);
  ok(d0.onboarded,'the profile is marked onboarded at once'+at);
  ok(!d0.key,'the device is never marked as having seen the example, since it is never shown'+at);
  ok(d0.tabIsSummary,'and the door lands straight on the dashboard, tab '+d0.tab+at);
  ok(errs.length===0,'no page errors: '+errs.join(' | ')+at);
  /* a later visit is no different: nothing left to flip */
  await page.reload({waitUntil:'load'}); await booted(page);
  await door(page); await page.waitForTimeout(300);
  const d1=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open)}));
  ok(!d1.intro&&!d1.ob,'and a later visit opens neither screen either'+at);
  await ctx.close();
 }

 console.log('=== 3, 4, 5. the screen\'s own mechanics, opened directly, the beats, the hand over and once per device'+at+' ===');
 const ctx=await browser.newContext({viewport:{width:W,height:H}});
 const page=await ctx.newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 await openIntro(page);
 const s0=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open),
  inStage:!!document.querySelector('#srcintro .sx-face #srcface'), st:SrcFace.state(), key:STORE.get(SRC_INTRO_KEY),
  box:(document.querySelector('#srcintro .sx-face')||{}).clientWidth}));
 ok(s0.intro,'the intro plays on a fresh device, opened directly'+at);
 ok(!s0.ob,'and the first card waits for it'+at);
 ok(s0.inStage&&s0.st.lent&&s0.st.running,'the face is lent to the intro\'s stage and drawing'+at);
 ok(s0.key==='1','the device remembers it at once'+at);
 const want=Math.min(Math.round(W*0.86),420,Math.round(H*0.52));
 ok(Math.abs(s0.box-want)<=1,'face box '+s0.box+', want '+want+at);
 ok(s0.box/2-2>=140,'the box holds a face radius of 140 for the seat labels, radius '+(s0.box/2-2)+at);
 await watch(page);
 const tag=W===1600?'desk':'phone';
 await page.waitForTimeout(150); await shot(page,tag+'-0.15-enter');
 await page.waitForTimeout(1400); await shot(page,tag+'-1.55-line1');
 await page.waitForTimeout(2150); await shot(page,tag+'-3.70-sank');
 await page.waitForTimeout(2600); await shot(page,tag+'-6.30-afraid');
 await page.waitForTimeout(2900);
 const hold=await page.evaluate(()=>SrcFace.state());
 await shot(page,tag+'-9.20-hold');
 const seats=hold.seats.map(s=>s.seat+', '+s.fet).sort();
 ok(seats.join('|')==='Heart, Sad|Root, Fear','the face holds Heart, Sad and Root, Fear, got '+seats.join('|')+at);
 ok(hold.word==='Holding'||hold.word==='Answering','the centre word holds or answers, got '+hold.word+at);
 await page.waitForSelector('#srcintro .sx-go.on',{timeout:8000}).catch(()=>{});
 await page.waitForTimeout(300); await shot(page,tag+'-end');
 const ev=await page.evaluate(()=>window.__SX);
 const first=c=>{ const e=ev.find(x=>x.c===c); return e?e.t:null; };
 const word=k=>{ const e=ev.find(x=>x.c==='sx-w'&&x.k===String(k)); return e?e.t:null; };
 /* the hit words by the face's own plan, never by a count typed here: "felt"
    is word 8 and "afraid" word 9, which the first cut of this gate got wrong */
 const pl=await page.evaluate(()=>SrcFace.plan(SRC_INTRO_EX));
 const und=h=>{ const e=ev.find(x=>x.c==='sx-u'&&x.h===String(h)); return e?e.t:null; };
 const T={l1:first('sx-l1'),ex:first('sx-ex'),sank:word(pl.hits[0].k),u0:und(0),afraid:word(pl.hits[1].k),u1:und(1),rows:first('sx-row'),go:first('sx-go')};
 console.log('  beats'+at+', ms from the start: '+JSON.stringify(T));
 /* the two beats this file times itself are held to within 700ms, not to
    the frame: run beside two other gates on a loaded machine, the first cut
    at 300 read the sentence at 3367 for 2850, a slipped timer and not a
    wrong beat. The order and the face's own spacing below are the gate */
 ok(T.l1!==null&&Math.abs(T.l1-1250)<700,'line one at about 1.25s, '+T.l1+at);
 ok(T.ex!==null&&Math.abs(T.ex-2850)<700,'the sentence at about 2.85s, '+T.ex+at);
 ok(T.sank!==null&&T.u0!==null&&Math.abs(T.u0-T.sank)<60,'the Heart underline lands on "sank", '+T.sank+' and '+T.u0+at);
 ok(T.sank>T.ex&&T.sank<T.ex+1100,'"sank" is read on the face\'s clock, about 0.65s into the sentence, '+(T.sank-T.ex)+at);
 ok(T.afraid!==null&&T.u1!==null&&Math.abs(T.u1-T.afraid)<60,'the Root underline lands on "afraid", '+T.afraid+' and '+T.u1+at);
 ok(T.afraid>T.sank+1800,'"afraid" comes after "sank" at the face\'s pace, '+(T.afraid-T.sank)+'ms on'+at);
 ok(T.rows!==null&&T.rows>T.u1+1500&&T.rows<T.u1+4500,'the rows arrive at the hold, '+T.rows+at);
 ok(T.go!==null&&T.go>=T.rows,'the button arrives last, '+T.go+at);
 ok(T.go!==null&&T.go<14000,'and inside fourteen seconds, '+T.go+at);
 const rowsTxt=await page.evaluate(()=>[...document.querySelectorAll('#srcintro .sx-row')].map(r=>r.textContent));
 ok(rowsTxt.join('|')==='Heart, mid sternum.|Root, the base of the spine.','rows in the order they are hit, '+rowsTxt.join('|')+at);
 const fit=await page.evaluate(()=>{ const b=document.querySelector('#srcintro .sx-own').getBoundingClientRect(), f=document.querySelector('#srcintro .sx-face').getBoundingClientRect();
  return {bb:b.bottom, ft:f.top, h:innerHeight, sw:document.documentElement.scrollWidth, w:innerWidth}; });
 ok(fit.bb<=fit.h&&fit.ft>=0,'the face and the button are both on the screen, button bottom '+Math.round(fit.bb)+' of '+fit.h+at);
 ok(fit.sw<=fit.w,'no sideways scroll'+at);
 const ob0=await page.evaluate(()=>!!(OB&&OB.open));
 ok(!ob0,'nothing opens the first card but the button'+at);
/* sampled every frame through the exit, so the overlap is seen whatever
    the timer jitter: some frame must hold the first card and the intro both */
 await page.evaluate(()=>{ window.__OV=[]; const f=()=>{ const i=!!document.getElementById('srcintro');
  window.__OV.push({ob:!!(OB&&OB.open),intro:i}); if(i)requestAnimationFrame(f); }; requestAnimationFrame(f); });
 await page.click('#srcintro .sx-own');
 await page.waitForTimeout(540);
 const ov=await page.evaluate(()=>window.__OV);
 ok(ov.some(x=>x.ob&&x.intro),'the first card arrives under the face as it leaves, '+ov.filter(x=>x.ob&&x.intro).length+' frames of overlap'+at);
 const s1=await page.evaluate(()=>({ob:!!(OB&&OB.open), intro:!!document.getElementById('srcintro'), st:SrcFace.state(),
  home:!!(document.getElementById('srcface')&&document.getElementById('srcface').closest('#stuni')),
  story:S.tab===TAB.STORY}));
 ok(s1.ob,'obOpen ran after the button press'+at);
 ok(!s1.intro,'the intro has left the page'+at);
 ok(s1.st.seats.length===0&&!s1.st.reading&&s1.st.held===0,'clear() left nothing on the face: '+JSON.stringify({seats:s1.st.seats.length,reading:s1.st.reading,held:s1.st.held})+at);
 ok(!s1.st.lent,'the face is no longer lent'+at);
 ok(s1.story&&s1.home,'the face is back in #stuni'+at);
 ok(errs.length===0,'no page errors: '+errs.join(' | ')+at);
 /* once per device: the same browser, a new arrival, opened directly again
    (srcIntroDue reads the device's own key, SRC_INTRO_KEY, set above) */
 await page.reload({waitUntil:'load'}); await booted(page);
 await openIntro(page); await page.waitForTimeout(300);
 const s2=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open)}));
 ok(!s2.intro&&s2.ob,'a second arrival goes straight to the first card'+at);
 await ctx.close();
}

console.log('=== 6. never after onboarded ===');
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 await page.waitForSelector('#loginb-go',{timeout:8000});
 await page.evaluate(()=>{ CURP.ui=CURP.ui||{}; CURP.ui.onboarded=true; loginClose(); loginEnter(); });
 await page.waitForTimeout(300);
 const s=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open), key:STORE.get(SRC_INTRO_KEY)}));
 ok(!s.intro&&!s.ob,'an onboarded person meets neither the intro nor the first card');
 ok(!s.key,'and the device is not marked as having seen it');
 await page.close();
}

console.log('=== 7. Skip and Escape land on the end frame, opened directly ===');
for(const how of ['skip','escape']){
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 await openIntro(page);
 await page.waitForTimeout(how==='skip'?400:3800);
 if(how==='skip')await page.click('#srcintro .sx-skip'); else await page.keyboard.press('Escape');
 await page.waitForTimeout(120);
 const e=await endFrame(page);
 ok(e.w===e.ws&&e.ws===12,how+': every word of the sentence, '+e.w+' of '+e.ws);
 ok(e.u===2&&e.rows===2&&e.go&&e.ex&&!e.l1,how+': both underlines, both rows, the button, line one gone '+JSON.stringify(e));
 ok(!e.ob,how+': and not the first card');
 await page.keyboard.press('Escape'); await page.waitForTimeout(100);
 ok(!(await endFrame(page)).ob,how+': a second Escape still does not open it');
 const st=await page.evaluate(()=>({voiced:SX.voiced, playing:SX.playing}));
 if(how==='skip')ok(st.voiced&&!st.playing,'skip before the line is silence');
 await page.click('#srcintro .sx-own'); await page.waitForTimeout(500);
 const s=await page.evaluate(()=>({ob:!!(OB&&OB.open), st:SrcFace.state()}));
 ok(s.ob&&s.st.seats.length===0&&!s.st.reading,how+': the button still hands over, face cleared');
 await page.close();
}

console.log('=== 8. reduced motion is the end frame, opened directly ===');
{
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await ctx.newPage();
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 await openIntro(page); await page.waitForTimeout(150);
 const e=await endFrame(page);
 ok(e.w===12&&e.u===2&&e.rows===2&&e.go&&!e.ob,'reduced motion shows the end frame at once '+JSON.stringify(e));
 const v=await page.evaluate(()=>SX&&SX.voiced);
 ok(v,'and the voice is still asked for: sound is not motion');
 await shot(page,'phone-reduced');
 await page.click('#srcintro .sx-own'); await page.waitForTimeout(200);
 const s=await page.evaluate(()=>({ob:!!(OB&&OB.open), intro:!!document.getElementById('srcintro')}));
 ok(s.ob&&!s.intro,'reduced motion hands over without the exit');
 await ctx.close();
}

console.log('=== 9. ?dev=1, and a walk half done, UPDATED 18 November ===');
/* srcIntroDue itself is unchanged and still refuses under DEV_SKIP, checked
   directly below with no door involved, the same fact the old gate read
   through loginEnter. What changed is loginEnter itself: it no longer opens
   the first card either, with or without ?dev=1, so the second half of
   the old check here (loginEnter opening the sheet once the intro was out
   of the way) no longer holds, and is replaced with the same straight-to-
   dashboard behavior tests/onboarding2.js holds for the real door generally. */
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 await page.waitForTimeout(300);
 ok(await page.evaluate(()=>!document.getElementById('srcintro')&&DEV_SKIP),'?dev=1 boots with no intro');
 await page.evaluate(()=>loginEnter()); await page.waitForTimeout(200);
 const s=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open), key:STORE.get(SRC_INTRO_KEY),
  onboarded:!!(CURP&&CURP.ui&&CURP.ui.onboarded)}));
 ok(!s.intro&&!s.ob&&!s.key,'DEV_SKIP or not, loginEnter opens neither screen any more, '+JSON.stringify(s));
 ok(s.onboarded,'and marks the profile onboarded straight away, the same as on a plain first visit');
 await page.close();
}
{
 /* A DEVICE WITH A HALF DONE LEGACY WALK, written directly the way the
    record itself holds it (journeyWalk), never through the sheet. Before
    18 November the real door resumed such a walk; the owner's ruling made
    no exception for one, "once you get past the initial attuned intro, it
    goes straight to your dashboard", so this now goes straight there too,
    the same as a profile with no walk at all. The walk itself is left on
    the record exactly as journeyWalk wrote it: this is a product decision
    about what the door does, not a change to the schema or to what a
    profile may carry, so it is not this gate's place to erase it. */
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 await page.waitForSelector('#loginb-go',{timeout:8000});
 const at=await page.evaluate(()=>{ journeyWalk(CURP,'story',{door:'onboarding'}); return journeyRead(CURP).at; });
 ok(!!at,'a walk half done reads as one, at '+at);
 await page.evaluate(()=>{loginClose(); loginEnter();}); await page.waitForTimeout(300);
 const s=await page.evaluate(()=>({intro:!!document.getElementById('srcintro'), ob:!!(OB&&OB.open),
  onboarded:!!(CURP&&CURP.ui&&CURP.ui.onboarded), tab:S.tab, tabIsSummary:S.tab===TAB.SUMMARY,
  walkStill:!!(CURP&&CURP.journey&&CURP.journey.walk&&CURP.journey.walk.step==='story')}));
 ok(!s.intro&&!s.ob,'the real door does not resume it either, no intro and no sheet: '+JSON.stringify(s));
 ok(s.onboarded&&s.tabIsSummary,'it goes straight to the dashboard, the same as any other first visit, tab '+s.tab);
 ok(s.walkStill,'the half done walk itself is untouched on the record, only the door\'s own behavior changed');
 await page.close();
}

await browser.close();
console.log('\n'+PASS+' passed, '+FAIL+' failed');
process.exit(FAIL?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
