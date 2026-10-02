/* ============================================================
   THE JOURNEY RECORD, IN A REAL BROWSER. node tests/journeyui.js, and called
   from tests/functional.js so a full run holds it through the same code.

   tests/journey.js holds the engine's half headlessly. This is the host's
   half, the three hook lines in ui/release.js and the boot report in ui/ui.js,
   which only a page can run:

     1  a finished release writes one runs item, and the meter moves once
     2  a card shut mid run writes a closed item and leaves meter.unique alone
     3  End and Stop write ended, and a card closed after it finished writes
        nothing more, so one release is never counted as two
     4  a run on a worked example writes no item and is refused
     5  a save that cannot land is said on the status line as a failure, for the
        release commit. The story commit is storyui.js's and is not asserted here
     6  the engine's channel list and the card's own are one list
     7  a store holding a field the boundary does not name is reported at boot
     8  the two first run flags survive a save and a reload in a real page

   Run from the repo root with NODE_PATH at a playwright install, like the
   other browser gates. ATUNED_FILE picks the build.
   ============================================================ */
const path=require('path');

async function journeyGate(browser,FILE,ok,booted){
 const pg=await browser.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);

 /* ---- 1, 2, 3: the three ways a run ends ---- */
 const a=await pg.evaluate(async()=>{
  loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;}); syncCh();
  const J=()=>CURP.journey.runs.map(r=>r.end).join();
  const out={chanOk:JSON.stringify(CHAN.map(c=>c[0]+c[2]))===JSON.stringify(ONB_CHANS)};
  const ids=compute().carrying.slice(0,6).map(n=>n.i);
  out.start={runs:J(), unique:CURP.meter.unique.length, gift:CURP.journey.gift};
  /* a finished run */
  relPick(ids.slice(0,2)); out.plan1=RUN.plan.length;
  RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown();
  out.fin={runs:J(), unique:CURP.meter.unique.length, run:CURP.journey.runs[0],
   gift:CURP.journey.gift&&{u:CURP.journey.gift.used,r:CURP.journey.gift.remaining},
   log:CURP.journey.log.map(e=>e.type).join()};
  /* Done on the finished card goes through relClose, and must not write again */
  relClose();
  out.afterDone=J();
  /* a card shut before it finished */
  relPick(ids.slice(2,4)); RUN.phase='run'; RUN.idx=1; RUN.t0=Date.now();
  const u0=CURP.meter.unique.length, l0=CURP.meter.lines;
  relClose();
  out.closed={runs:J(), unique:CURP.meter.unique.length-u0, lines:CURP.meter.lines-l0, run:CURP.journey.runs[1]};
  /* a card shut before Begin was pressed is not a run */
  relPick(ids.slice(2,4)); RUN.phase='pick'; relClose();
  out.beforeBegin=J();
  relPick(ids.slice(2,4)); RUN.phase='welcome'; relClose();
  out.atWelcome=J();
  /* End: the run is stopped and still commits */
  relPick(ids.slice(2,4)); RUN.phase='run'; RUN.idx=1; RUN.halted=true; relCoolDown(); relClose();
  out.ended={runs:J(), run:CURP.journey.runs[CURP.journey.runs.length-1]};
  /* a rerun of ground that is open */
  relPick(ids.slice(0,2)); relMode(true);
  const u1=CURP.meter.unique.length;
  RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown(); relClose();
  out.rerun={runs:J(), run:CURP.journey.runs[CURP.journey.runs.length-1], unique:CURP.meter.unique.length-u1};
  /* whatever the page wrote loads through the boundary */
  out.valid=validateProfile(JSON.parse(JSON.stringify(CURP))).ok;
  out.errs=(validateProfile(JSON.parse(JSON.stringify(CURP))).errs||[]).slice(0,2);
  out.read=journeyRead(CURP);
  return out;});
 ok(a.chanOk,'the engine\'s channel list is the release card\'s own list, CHAN');
 ok(a.start.runs===''&&a.start.gift===null,'a new record has no runs and no gift stamp');
 ok(a.fin.runs==='completed'&&(a.fin.run||{}).rerun===false,'a finished release writes one completed run: '+JSON.stringify(a.fin.runs));
 ok((a.fin.run||{}).lines===a.plan1&&(a.fin.run||{}).fresh===a.plan1&&a.fin.unique===a.plan1,
  'its lines are the plan the meter took and all of them are new ground: '+JSON.stringify(a.fin.run)+' plan '+a.plan1);
 ok(a.fin.gift&&a.fin.gift.u===a.plan1&&a.fin.gift.r===100-a.plan1,'and the gift counter moved with the meter: '+JSON.stringify(a.fin.gift));
 ok(a.fin.log==='starter_gift_issued,pattern_released,first_release_completed','and the log says so: '+a.fin.log);
 ok(a.afterDone==='completed','pressing Done on the finished card writes nothing more');
 ok(a.closed.runs==='completed,closed'&&a.closed.unique===0&&a.closed.lines===0,
  'a card shut mid run writes a closed run and leaves the meter alone: '+JSON.stringify(a.closed));
 ok((a.closed.run||{}).lines===0&&(a.closed.run||{}).fresh===0&&(a.closed.run||{}).end==='closed','and the closed run holds no lines');
 ok(a.beforeBegin==='completed,closed'&&a.atWelcome==='completed,closed,closed','a card shut before it began is not a run, and one shut at the welcome is: '
  +a.beforeBegin+' then '+a.atWelcome);
 ok((a.ended.run||{}).end==='ended'&&(a.ended.run||{}).lines>0,'End writes an ended run that still committed its lines: '+JSON.stringify(a.ended.run));
 ok((a.rerun.run||{}).rerun===true&&(a.rerun.run||{}).fresh===0&&a.rerun.unique===0&&(a.rerun.run||{}).lines>0,'a rerun is a run that opened nothing: '+JSON.stringify(a.rerun.run));
 ok(a.valid,'a record the page wrote through every one of them loads through the boundary: '+JSON.stringify(a.errs));
 ok(a.read.stage==='released'&&a.read.runs.known===true,'and reads as released with a known count: '+JSON.stringify(a.read.runs));

 /* ---- 4: a worked example writes no item ---- */
 const b=await pg.evaluate(async()=>{
  loadP(0); const own=CURP;
  const before=own.journey.runs.length;
  const gi=PEOPLE.findIndex(function(p){return p.nm==='Gordon';}); if(gi<1)throw new Error('Gordon is not in the roster any more');
  loadP(gi); setTab(TAB.FIELD); render();
  relPick(W.filter(n=>n.sq>=4).slice(0,3).map(n=>n.i));
  RUN.phase='run'; RUN.idx=1e9;
  const refused=relCoolDown();
  RUN.phase='run'; relClose();
  const o={refused:refused===false, ownRuns:own.journey.runs.length-before,
   caseRuns:(CURP.journey?CURP.journey.runs.length:0)};
  RUN.done=false; RUN.phase='pick'; RUN.queue=[]; RUN.plan=[]; RUN.log=[];
  loadP(0);
  return o;});
 ok(b.refused===true&&b.ownRuns===0&&b.caseRuns===0,'a run on a worked example is refused and writes no item, on either record: '+JSON.stringify(b));

 /* ---- 5: a save that cannot land is said ---- */
 const c=await pg.evaluate(async()=>{
  loadP(0); CHARGES.forEach(c=>{S.charge[c]=7;}); syncCh();
  const ids=compute().carrying.slice(0,12).map(n=>n.i);
  const real=Storage.prototype.setItem;
  Storage.prototype.setItem=function(){throw new Error('QuotaExceededError');};
  const out={};
  try{
   relPick(ids.slice(6,8)); RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown();
   const st=document.getElementById('status');
   out.kind=st.getAttribute('data-kind'); out.text=st.textContent; out.save=saveState();
  }finally{Storage.prototype.setItem=real;}
  relClose();
  /* and the same release with storage working says nothing alarming */
  relPick(ids.slice(8,10)); RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown(); relClose();
  const st2=document.getElementById('status');
  out.okKind=st2.getAttribute('data-kind'); out.okSave=saveState().ok;
  return out;});
 ok(c.save&&c.save.ok===false,'the storage did refuse the write, so the test is a real one: '+JSON.stringify(c.save));
 ok(c.kind==='fail'&&/Not saved/.test(c.text),'a release that did not save says so as a failure: '+JSON.stringify([c.kind,c.text]));
 ok(c.okSave===true&&c.okKind!=='fail','and the same release with storage working is not reported as one');

 /* ---- 7 and 8: the boundary's report, in a real boot ---- */
 await pg.evaluate(()=>{try{
  const p=JSON.parse(localStorage.getItem('source.profiles')||'[]');
  p[0].ui.onboarded=true; p[0].ui.tutorialSeen=true; p[0].laterField={x:1}; p[0].funnel=[1];
  localStorage.setItem('source.profiles',JSON.stringify(p));}catch(e){}});
 await pg.reload({waitUntil:'load'}); await booted(pg);
 const d=await pg.evaluate(()=>{
  const st=document.getElementById('status');
  return {text:st?st.textContent:'', kind:st?st.getAttribute('data-kind'):null,
   flags:[CURP.ui.onboarded,CURP.ui.tutorialSeen], dropped:storeDropped().map(x=>x.keys.slice().sort().join()),
   has:[CURP.laterField,CURP.funnel]};});
 ok(d.flags[0]===true&&d.flags[1]===true,'the two first run flags survive a save and a reload in a real page');
 ok(d.dropped.length===1&&d.dropped[0]==='funnel,laterField','what the boundary did not carry is named by the page: '+JSON.stringify(d.dropped));
 ok(d.kind==='fail'&&/not read/.test(d.text)&&/laterField/.test(d.text),'and the boot says so on the status line: '+JSON.stringify([d.kind,d.text]));
 ok(d.has[0]===undefined&&d.has[1]===undefined,'and does not carry them across');
 await pg.close();
}
module.exports={journeyGate};

if(require.main===module){
 (async()=>{
  const {chromium}=require('playwright');
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  let P=0,F=0; const ok=(c,m)=>{if(c)P++;else{F++;console.log('  FAIL '+m);}};
  const browser=await chromium.launch();
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
   try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();}); await p.waitForTimeout(120);}catch(e){}};
  await journeyGate(browser,FILE,ok,booted);
  await browser.close();
  console.log('\n===== '+P+' passed, '+F+' failed =====');
  process.exit(F?1:0);})();}
