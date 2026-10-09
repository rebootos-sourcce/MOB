/* ============================================================
   DEVICE SETTINGS ON A WORKED EXAMPLE, GATED. node tests/device.js

   2 October. The sound switch and the Practitioner switch were written onto
   the profile with uiSet, which saves the profile, so on a worked example
   the save was refused and "Nothing saved on a worked example." flashed.
   For Practitioner the switch slid on, the menu stayed shut and nothing
   opened. Both are the browser's settings now (devGet and devSet in the
   engine, one key in the bound store). Held here in the person's terms, on a
   worked example:

     1  flip Practitioner mode: no message about saving, the switch reads on,
        the Practitioner section is in the bar, it opens, and its Clients tab
        is the surface that opens.
     2  the profile itself was not written.
     3  a reload keeps it.
     4  a browser that will not keep the setting is told so, and the door
        still opens for this visit.

   Checked against the build from before the change, where step 1 fails.
   Called from tests/functional.js, and runnable alone.
   ============================================================ */
const path=require('path');

async function deviceGate(browser,FILE,ok,booted){
 console.log('\n=== a device setting works on a worked example ===');
 const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
 const pg=await ctx.newPage(); const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 const a=await pg.evaluate(async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms)), o={}, $q=s=>document.querySelector(s);
  loadP(1); o.example=S.who!==0; o.name=CURP.name;
  ACC_OPEN='account'; setTab(TAB.SETTINGS); renderAccount(); await wait(250);
  const sw=$q('#acprac'); o.has=!!sw; if(!sw)return o;
  o.before=sw.getAttribute('aria-checked');
  o.profBefore=JSON.stringify(CURP.ui);
  sw.click(); await wait(300);
  o.after=$q('#acprac').getAttribute('aria-checked');
  o.line=(document.getElementById('status')||{}).textContent||'';
  o.kind=(document.getElementById('status')||{}).getAttribute('data-kind');
  o.profAfter=JSON.stringify(CURP.ui);
  o.dev=devGet('practitioner');
  const door=$q('#secbar .secb[data-sec="practitioner"]');
  o.door=!!door&&getComputedStyle(door).display!=='none';
  if(door){ door.click(); await wait(350); }
  o.tab=S.tab===TAB.PRACTITIONER;
  const ct=$q('#tabbar .tabtop[data-tabk="'+TAB.PRACTITIONER+'"]');
  o.clients=!!ct&&!!ct.offsetParent&&/Clients/.test(ct.textContent);
  const host=$q('#prac'); o.host=!!host&&host.getBoundingClientRect().height>200&&/Clients/.test(host.textContent);
  return o;});
 ok(a.example&&a.has&&a.before==='false'&&a.after==='true'&&!/Nothing saved/.test(a.line)&&a.kind!=='fail',
  'on '+a.name+', a worked example, flipping Practitioner mode reads on and says nothing about saving, '+JSON.stringify({before:a.before,after:a.after,line:a.line,kind:a.kind}));
 ok(a.door&&a.tab&&a.clients&&a.host,
  'and the Practitioner section is in the bar, opens, and its Clients tab is the surface that opens, '+JSON.stringify({door:a.door,tab:a.tab,clients:a.clients,host:a.host}));
 ok(a.dev===true&&a.profBefore===a.profAfter,'the setting is in the device store and the profile was not written, '+JSON.stringify({dev:a.dev,same:a.profBefore===a.profAfter}));
 await pg.reload({waitUntil:'load'}); await booted(pg);
 const k=await pg.evaluate(()=>({on:pracOn(), door:getComputedStyle(document.querySelector('#secbar .secb[data-sec="practitioner"]')).display!=='none'}));
 ok(k.on&&k.door,'and a reload keeps it, '+JSON.stringify(k));
 const bad=await pg.evaluate(async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  loadP(1); var keep=Storage.prototype.setItem; Storage.prototype.setItem=function(){ throw new Error('QuotaExceededError'); };
  var r=pracSwitch(false); Storage.prototype.setItem=keep; await wait(150);
  var st=document.getElementById('status');
  return {r:r, on:pracOn(), line:st.textContent, kind:st.getAttribute('data-kind'),
   door:getComputedStyle(document.querySelector('#secbar .secb[data-sec="practitioner"]')).display};});
 ok(bad.r===false&&bad.on===false&&bad.kind==='fail'&&/this visit only/.test(bad.line)&&bad.door==='none',
  'a browser that will not keep it is told so, and the door still does what was asked, '+JSON.stringify(bad));
 ok(err.length===0,'no page errors, '+err.join(' | '));
 await ctx.close();}

module.exports={deviceGate};

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
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  try{ await deviceGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
