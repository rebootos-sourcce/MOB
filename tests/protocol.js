/* ============================================================
   THE PROTOCOL'S WAY OUT, GATED. node tests/protocol.js

   2 October, the owner: "when I click on a protocol, if I don't want to run
   it, give me the X so I can have the option of canceling. but also on the
   screen, make sure there's an end or stop." Held in his terms:

     1  the setup carries an X, labelled Cancel, 44 by 44, a ring, and
        pressing it closes with nothing started and nothing charged.
     2  there is a visible End, at least 44 by 44, on the welcome, on the
        opening and on the run, and so is Pause. They rendered blank at 0 by 0
        on the first two because the sheet that sizes the icon was only
        appended by the run phase.
     3  End charges only what was truly released, and says so. Pressed with
        three lines said out of a plan of eight, the meter grows by three, the
        addresses never reached are not written, and the card says "3 of 8".
     4  End at the very first line, before anything is said, charges nothing.

   The gate is checked against the build from before the change (it fails
   there: the cross is absent, the buttons are 0 by 0 and the meter grows by
   the whole plan), which is the instrument checked against a known bad case.

   Called from tests/functional.js, and runnable alone.
   ============================================================ */
const path=require('path');

async function protocolGate(browser,FILE,ok,booted){
 console.log('\n=== a protocol can be cancelled before it runs and ended while it runs ===');
 for(const [w,h] of [[1600,1000],[390,844]]){
  const pg=await browser.newPage({viewport:{width:w,height:h}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
  /* ---- 1. the cross on the setup ---- */
  const a=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;}); setTab(TAB.FIELD); render();
   relPick(compute().carrying.slice(0,2).map(n=>n.i)); await wait(150);
   const x=document.getElementById('relx'); o.has=!!x;
   if(x){ const r=x.getBoundingClientRect();
    o.w=r.width; o.h=r.height; o.label=x.getAttribute('aria-label');
    o.ring=!!x.querySelector('svg circle')&&!x.querySelector('[fill="currentColor"]');
    o.inside=r.top>=document.getElementById('rel').firstElementChild.getBoundingClientRect().top&&r.right<=innerWidth; }
   o.u0=CURP.meter.unique.length; o.l0=CURP.meter.lines; o.c0=JSON.stringify(S.charge);
   o.phase=RUN.phase;
   if(x)x.click(); await wait(150);
   o.open=RUN.open; o.after=RUN.phase; o.hidden=getComputedStyle(document.getElementById('rel')).display;
   o.u1=CURP.meter.unique.length; o.l1=CURP.meter.lines; o.c1=JSON.stringify(S.charge);
   o.said=(document.getElementById('status')||{}).textContent;
   return o;});
  ok(a.has&&a.w>=44&&a.h>=44&&a.label==='Cancel'&&a.ring&&a.phase==='idle',
   'at '+w+', the setup carries a ring X labelled Cancel at 44 by 44, '+JSON.stringify({w:a.w,h:a.h,label:a.label,ring:a.ring}));
  ok(a.open===false&&a.hidden==='none'&&a.u1===a.u0&&a.l1===a.l0&&a.c1===a.c0&&/Nothing was started and nothing was charged/.test(a.said),
   'at '+w+', pressing it closes with nothing started and nothing charged, and says so, '+JSON.stringify({open:a.open,u:[a.u0,a.u1],l:[a.l0,a.l1],said:a.said}));
  /* ---- 2. End and Pause on every phase ---- */
  const b=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;});
   relPick(compute().carrying.slice(0,2).map(n=>n.i)); await wait(100);
   const read=ph=>{ const e=document.getElementById('relstop'), p=document.getElementById('relpause');
    const re=e&&e.getBoundingClientRect(), rp=p&&p.getBoundingClientRect();
    return {ph:RUN.phase, want:ph, end:!!e&&re.width>=44&&re.height>=44, endW:re&&re.width, endH:re&&re.height,
     endText:e&&e.textContent.trim(), pause:!!p&&rp.width>=44&&rp.height>=44,
     css:!!document.getElementById('rel-cr-css'), inView:!!e&&re.right<=innerWidth&&re.left>=0};};
   o.setup=RUN.phase;
   document.getElementById('relgo').click(); clearTimeout(RUN.timer); relRender();
   o.welcome=read('welcome');
   RUN.phase='opening'; RUN.line=0; relRender(); o.opening=read('opening');
   RUN.phase='run'; RUN.idx=0; RUN.pass=0; relRender(); o.run=read('run');
   relClose();
   return o;});
  for(const k of ['welcome','opening','run'])
   ok(b[k].ph===k&&b[k].end&&b[k].endText==='End'&&b[k].pause&&b[k].css&&b[k].inView,
    'at '+w+', the '+k+' carries a visible End and a Pause, each at least 44 by 44, '+JSON.stringify(b[k]));
  /* ---- 3 and 4. End charges what was released ---- */
  const c=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={};
   loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;});
   relPick(compute().carrying.slice(0,2).map(n=>n.i)); await wait(100);
   o.planN=RUN.plan.length; o.addrs=RUN.queue.length;
   o.u0=CURP.meter.unique.length;
   document.getElementById('relgo').click(); await wait(60);
   document.getElementById('relskip').click(); await wait(60);
   clearTimeout(RUN.timer);
   /* the very first line, nothing said: End closes and charges nothing */
   o.first={phase:RUN.phase, reach:relReach()};
   document.getElementById('relstop').click(); await wait(100);
   o.first.after=RUN.phase; o.first.open=RUN.open; o.first.u=CURP.meter.unique.length-o.u0;
   o.first.said=(document.getElementById('status')||{}).textContent;
   /* three lines said out of the plan: the first address, three channels */
   relPick(compute().carrying.slice(0,2).map(n=>n.i)); await wait(100);
   document.getElementById('relgo').click(); await wait(60);
   document.getElementById('relskip').click(); await wait(60);
   clearTimeout(RUN.timer); RUN.idx=2; RUN.pass=1;
   o.mid={reach:relReach(), planN:RUN.plan.length, addrs:RUN.queue.length};
   const u1=CURP.meter.unique.length, l1=CURP.meter.lines, db=document.getElementById('relstop');
   db.click(); await wait(200);
   o.mid.phase=RUN.phase; o.mid.u=CURP.meter.unique.length-u1; o.mid.lines=CURP.meter.lines-l1;
   o.mid.queue=RUN.queue.length; o.mid.log=RUN.log.length; o.mid.plan=RUN.plan.length;
   const nt=document.getElementById('relendnote'); o.mid.note=nt?nt.textContent:'';
   o.mid.said=(document.getElementById('status')||{}).textContent;
   relClose();
   return o;});
  ok(c.first.phase==='run'&&c.first.reach===0&&c.first.after==='idle'&&c.first.open===false&&c.first.u===0
   &&/Nothing was released and nothing was charged/.test(c.first.said),
   'at '+w+', End before a single line is said closes and charges nothing, and says so, '+JSON.stringify(c.first));
  ok(c.planN>3&&c.addrs===2&&c.mid.reach===3&&c.mid.phase==='done'&&c.mid.u===3&&c.mid.lines===3
   &&c.mid.queue===1&&c.mid.log===1&&c.mid.plan===3,
   'at '+w+', End with three of '+c.planN+' lines said charges three and writes the one address reached, '+JSON.stringify(c.mid));
  ok(new RegExp('3 of '+c.planN+' lines were said').test(c.mid.note)&&/charged for 3 new lines, not for the whole plan/.test(c.mid.note)
   &&/never started, so they were not charged/.test(c.mid.note)&&/charged only for the lines you reached/.test(c.mid.said),
   'at '+w+', and the card says so in plain words, '+JSON.stringify(c.mid.note));
  ok(err.length===0,'at '+w+', no page errors, '+err.join(' | '));
  await pg.close();}}

module.exports={protocolGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok   '+m);} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  try{ await protocolGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
