/* ============================================================
   THE MESSAGE DOCK, GATED. node tests/msglog.js

   Messages go to the bottom, show for three seconds, and are logged.
   2 October, the owner: "it popped that up in a command line just underneath
   this secondary navigation, which I asked earlier to move command output
   errors down to a bottom navigation. Have it spit out that information to a
   log, and maybe have that only show for three seconds unless the person
   presses a button to keep it up longer." Held in his terms: the message is
   at the bottom and not in the bar, it fades at three seconds, Keep holds it,
   a failure is never swallowed (it is in the log after it fades, with a count
   on the Log button), the log is the last fifty, and the region still says
   role=status so a screen reader hears it. Measured at both widths.

   Called from tests/functional.js on its own page, and runnable alone.
   ============================================================ */
const path=require('path');
async function msgGate(page,ok){
 console.log('\n=== messages go to the bottom, show for three seconds, and are logged ===');
/* 2 October, the owner: "it popped that up in a command line just underneath
   this secondary navigation, which I asked earlier to move command output
   errors down to a bottom navigation. Have it spit out that information to a
   log, and maybe have that only show for three seconds unless the person
   presses a button to keep it up longer." Held in his terms: the message is at
   the bottom and not in the bar, it fades at three seconds, Keep holds it, a
   failure is never swallowed (it is in the log after it fades, with a count on
   the Log button), the log is the last fifty, and the region still says
   role=status so a screen reader hears it. Measured at both widths. */
const msgAt=async w=>{
 await page.setViewportSize({width:w,height:w>800?1000:844}); await page.waitForTimeout(300);
 return page.evaluate(async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={}, $=id=>document.getElementById(id);
  loadP(0); setTab(TAB.FIELD); render(); await wait(100);
  MSG_LOG.length=0; MSG_UNSEEN=0; status('');
  const st=$('status'), dock=$('msgdock');
  o.role=st.getAttribute('role')==='status'&&st.getAttribute('aria-live')==='polite';
  o.notInBar=!document.querySelector('.top').contains(st);
  status('Saved for the gate.');
  await wait(150);
  let r=dock.getBoundingClientRect(), top=document.querySelector('.top').getBoundingClientRect();
  o.shown=getComputedStyle(dock).display!=='none'&&st.textContent==='Saved for the gate.';
  /* THE FLOOR IS THE FOOT OF THE SCREEN, OR THE TOP OF THE STORAGE LINE WHEN
     THAT IS UP. A guest's browser may refuse to keep the record, and the line
     that says so stands at the foot with its own room, so a message rests on
     it and never under it (ui/keep.js). */
  const kl=document.getElementById('keepline'), floor=(kl&&!kl.hidden&&getComputedStyle(kl).display!=='none')?kl.getBoundingClientRect().top:innerHeight;
  o.bottom=r.bottom>floor-innerHeight*0.15&&r.bottom<=floor&&r.top>top.bottom;
  o.inside=r.left>=0&&r.right<=innerWidth;
  o.keepH=$('msgkeep').getBoundingClientRect().height; o.logH=$('msglogbtn').getBoundingClientRect().height;
  /* the status line must not sit in the bar any more: the bar is exactly as tall with a message up */
  await wait(3500);
  o.faded=st.textContent===''&&getComputedStyle(dock).display==='none';
  o.logged=MSG_LOG.length===1&&MSG_LOG[0].msg==='Saved for the gate.';
  /* a failure, kept */
  status('Not saved, for the gate.','fail'); await wait(150);
  o.badge=$('msgbadge').hidden===false&&$('msgbadge').textContent==='1';
  $('msgkeep').click(); await wait(3700);
  o.kept=st.textContent==='Not saved, for the gate.'&&getComputedStyle(dock).display!=='none'&&$('msgkeep').getAttribute('aria-pressed')==='true';
  $('msgkeep').click(); await wait(100);
  o.dismissed=st.textContent===''&&getComputedStyle(dock).display==='none';
  /* a tap on the words keeps too */
  status('Tap to keep.'); await wait(100); st.click(); await wait(3600);
  o.tapKept=st.textContent==='Tap to keep.';
  status('Next message.'); await wait(100);
  o.nextReplaces=st.textContent==='Next message.'&&$('msgkeep').getAttribute('aria-pressed')==='false';
  await wait(3700);
  o.nextFaded=st.textContent==='';
  /* a failure is not swallowed by fading */
  o.failKept=MSG_LOG.some(m=>m.kind==='fail'&&m.msg==='Not saved, for the gate.');
  /* the last fifty */
  for(let i=0;i<60;i++)status('Line '+i);
  o.cap=MSG_LOG.length===50&&MSG_LOG[49].msg==='Line 59'&&MSG_LOG[0].msg==='Line 10';
  /* the log opens from the dock and from the profile menu, and clears the failure count */
  $('msglogbtn').click(); await wait(100);
  const lg=$('msglog');
  o.logOpen=!lg.hidden&&lg.querySelectorAll('li').length===50&&$('msgbadge').hidden;
  const lr=lg.getBoundingClientRect();
  o.logInside=lr.left>=0&&lr.right<=innerWidth&&lr.bottom<=innerHeight&&lr.top>=0;
  o.closeH=$('msglogx').getBoundingClientRect().height;
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await wait(60);
  o.esc=lg.hidden;
  document.getElementById('profbtn').click(); await wait(250);
  const it=document.querySelector('#profmenu [data-pmlog]'); o.menuItem=!!it&&it.getBoundingClientRect().height>=44;
  if(it)it.click(); await wait(100);
  o.menuOpens=!lg.hidden; $('msglogx').click(); await wait(60);
  o.shut=lg.hidden;
  return o;});};
const mdesk=await msgAt(1600), mphone=await msgAt(390);
await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(300);
for(const [w,m] of [['1600',mdesk],['390',mphone]]){
 ok(m.role&&m.notInBar&&m.shown&&m.bottom&&m.inside,'at '+w+', a message is in a role=status region at the bottom of the screen, inside the viewport and under the bar, '+JSON.stringify({role:m.role,notInBar:m.notInBar,shown:m.shown,bottom:m.bottom,inside:m.inside}));
 ok(m.faded&&m.logged,'at '+w+', it fades at three seconds and is in the log, '+JSON.stringify({faded:m.faded,logged:m.logged}));
 ok(m.badge&&m.kept&&m.dismissed&&m.tapKept&&m.nextReplaces&&m.nextFaded,'at '+w+', Keep holds a failure, Dismiss clears it, a tap on the words keeps, and the next message starts its own three seconds, '+JSON.stringify({badge:m.badge,kept:m.kept,dismissed:m.dismissed,tapKept:m.tapKept,next:m.nextReplaces,nextFaded:m.nextFaded}));
 ok(m.failKept&&m.cap&&m.logOpen&&m.logInside&&m.esc&&m.menuItem&&m.menuOpens&&m.shut,'at '+w+', a failure survives the fade in the log, the log holds the last fifty, opens from Log and from the profile menu and shuts on Escape, '+JSON.stringify({failKept:m.failKept,cap:m.cap,logOpen:m.logOpen,logInside:m.logInside,esc:m.esc,menuItem:m.menuItem,menuOpens:m.menuOpens,shut:m.shut}));
 ok(m.keepH>=44&&m.logH>=44&&m.closeH>=44,'at '+w+', Keep, Log and Close are all at the 44px floor, '+JSON.stringify({keep:m.keepH,log:m.logH,close:m.closeH}));}
}
module.exports={msgGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++; console.log('  ok   '+m);} else {FAIL++; console.log('  FAIL '+m);} };
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage(); const err=[]; page.on('pageerror',e=>err.push(e.message));
  await page.goto(FILE,{waitUntil:'load'});
  try{ await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  await page.waitForTimeout(800);
  await page.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
  await page.waitForTimeout(200);
  try{ await msgGate(page,ok); }catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  ok(err.length===0,'no page errors, '+err.join(' | '));
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
