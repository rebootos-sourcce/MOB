/* ============================================================
   HELP SAYS WHEN THIS BUILD WAS MADE, READ OFF THE BUILD ITSELF.
   node tests/helpstamp.js, and called from tests/functional.js so a full run
   holds it through the same code.

   M89 in the open items list, from C96 in the checklist sources: a visible
   "last updated" stamp. The policies' own dates wait on M64, because the
   drafts still read "Effective from: [PLACEHOLDER]" and a date is not
   invented for them. The one true date this file carries is the day it was
   built: BUILD.sh writes the stamp onto the root element as data-build,
   "v<commits> <commit> <yyyy-mm-dd hh:mm>", in UTC.

   AND HELP WAS NOT READING IT. Its "This build" group asked for BUILD_ID and
   VERSION, two names nothing in the product defines, so every build printed
   "Build: not stamped" and "Version: alpha" over a root element carrying the
   real stamp, and every piece of feedback went to the outbox marked alpha.

   WHAT IT HOLDS
     1  the root carries a stamp of the shape BUILD.sh writes
     2  Help has a row Updated whose value is that stamp's date: the day, the
        month and the year, matched here by pattern and not by calling the
        product's own formatter, so a wrong formatter cannot pass itself
     3  Build reads the stamp's commit and Version its count, and neither row
        reads "not stamped" or "alpha" while the stamp is there
     4  a piece of feedback is queued carrying that same commit
   ============================================================ */
const path=require('path');
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function helpStampGate(browser,FILE,ok,booted){
 const pg=await browser.newPage({viewport:{width:1600,height:1000}});
 const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 const o=await pg.evaluate(()=>{
  const o={stamp:document.documentElement.getAttribute('data-build')||''};
  ACC_OPEN='help'; setTab(TAB.SETTINGS); render();
  o.rows=[...document.querySelectorAll('#settings .ac-row')].map(r=>[
   ((r.querySelector('.ac-rl')||{}).textContent||'').trim(),
   ((r.querySelector('.ac-rv')||{}).textContent||'').trim()]);
  /* the payload, caught at the queue so nothing is written to the outbox */
  const real=obQueue; let got=null;
  window.obQueue=function(e){got=e; return {ok:false,why:'Held by the gate.'};};
  try{obSend();}catch(e){o.sendErr=String(e.message);}finally{window.obQueue=real;}
  o.build=got?got.build:null;
  return o;});
 const m=/^(v\d+) ([0-9a-f]{4,40}) (\d{4})-(\d{2})-(\d{2}) \d{2}:\d{2}$/.exec(o.stamp);
 ok(!!m,'the root carries a build stamp of the shape BUILD.sh writes, got "'+o.stamp+'"');
 const row=nm=>(o.rows.filter(r=>r[0]===nm)[0]||[])[1];
 if(m){
  const want=new RegExp('^'+(+m[5])+' '+MON[+m[4]-1]+'\\w* '+m[3]+'$');
  ok(want.test(row('Updated')||''),'Help has a row Updated reading the stamp\'s date, '+(+m[5])+' '
   +MON[+m[4]-1]+' '+m[3]+', got "'+row('Updated')+'"');
  ok(row('Build')===m[2],'Build reads the stamp\'s commit '+m[2]+', got "'+row('Build')+'"');
  ok(row('Version')===m[1],'Version reads the stamp\'s count '+m[1]+', got "'+row('Version')+'"');
  ok(o.build===m[2],'feedback is queued carrying the same commit, got "'+o.build+'"');}
 ok(!o.rows.some(r=>/^(not stamped|alpha)$/.test(r[1])),
  'no row says not stamped or alpha over a stamped build, got '+JSON.stringify(o.rows.filter(r=>/stamp|alpha/.test(r[1]))));
 ok(!o.sendErr,'the send ran, got '+o.sendErr);
 ok(err.length===0,'no page errors, got '+err.slice(0,2).join(' | '));
 await pg.close();}

module.exports={helpStampGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  console.log('\n=== help says when this build was made, read off the build itself ===');
  try{ await helpStampGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
