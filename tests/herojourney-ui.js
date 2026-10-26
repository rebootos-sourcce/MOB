'use strict';
/* Real-browser check of the CQ-centered living avatar and Board.
   Run from repo root after BUILD.sh and npm-installed Playwright. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const url='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.message)));
  await page.goto(url);
  await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:25000});
  const result=await page.evaluate(()=>{
   loadP(0);setTab(TAB.INTAKE);AV.sub='becoming';renderAvatar();
   const host=document.getElementById('avbody');
   const data={rendered:!!host.querySelector('.hj-panel'),partial:hjRead(CURP,compute()).complete};
   const p=CURP;
   /* All actual law inputs are set, including deliberate sixes. */
   SI.forEach(l=>{p.laws[l.nm]=6;S.law[l.nm]=6;LAW_UNSET[l.nm]=false;});
   const save=pSave();
   renderAvatar();
   const full=hjRead(CURP,compute());
   data.save=save;
   data.complete=full.complete;
   data.start=full.cq;
   data.stage=full.location&&full.location.id;
   data.origin=full.origin&&full.origin.cq;
   data.figure=!!host.querySelector('.hj-avatar-form');
   host.querySelector('[data-hjexpand]').click();
   data.nodes=host.querySelectorAll('[data-hjscene]').length;
   const sceneButton=host.querySelector('[data-hjscene="game:inferno:L08"]');
   if(sceneButton)sceneButton.click();
   data.scenePersisted=CURP.avatar.activeJourneyScene;
   data.selected=hjRead(CURP,compute()).active.id;
   const copy=validateProfile(JSON.parse(JSON.stringify(CURP)));
   data.exported=copy.ok&&copy.profile.avatar.activeJourneyScene===data.selected
    &&!!copy.profile.avatar.cqOrigin&&copy.profile.avatar.cqOrigin.cq===60;
   /* Reassessment changes CQ, not cumulative release milestones. */
   S.law.Truth=4;p.laws.Truth=4;
   lawAnswered(p,'Truth');pSave();renderAvatar();
   const after=hjRead(CURP,compute());
   data.after=after.cq;
   data.afterScene=after.location&&after.location.id;
   data.baselineKept=after.origin&&after.origin.cq===60;
   data.releaseMilestoneZero=after.uniqueReleaseCount===0;
   /* The real Ritual Builder must now keep plan state on the profile as well
      as the old side store, including the selected Board's practice. */
   const did=ritStartPlan({steps:['box'],band:'Root',track:'Body',days:7},null);
   data.ritualStarted=!!did;
   data.ritualOwned=Array.isArray(CURP.ritualPlans)&&CURP.ritualPlans.some(x=>x.steps.indexOf('box')>=0);
   const ritualExport=validateProfile(JSON.parse(JSON.stringify(CURP)));
   data.ritualExport=ritualExport.ok&&Array.isArray(ritualExport.profile.ritualPlans)
    &&ritualExport.profile.ritualPlans.some(x=>x.steps.indexOf('box')>=0);
   return data;
  });
  assert.equal(result.rendered,true,'Board renders on existing avatar');
  assert.equal(result.partial,false,'unanswered laws cannot locate user');
  assert.equal(result.save,true,'full profile saves');
  assert.equal(result.complete,true,'all 21 laws resolve CQ');
  assert.equal(result.stage,'game:paradiso:PD01','60 maps into Paradiso');
  assert.equal(result.origin,60,'baseline recorded once');
  assert.equal(result.figure,true,'avatar shows living form');
  assert.equal(result.nodes,26,'all 26 encounters are selectable');
  assert.equal(result.scenePersisted,'game:inferno:L08');
  assert.equal(result.selected,result.scenePersisted);
  assert.equal(result.exported,true,'active encounter and CQ origin round trip');
  assert.equal(result.afterScene,'game:purgatorio:P07','drop below 60 changes coordinate');
  assert.equal(result.baselineKept,true,'old CQ baseline retained');
  assert.equal(result.releaseMilestoneZero,true,'reassessment is not a release');
  assert.equal(result.ritualStarted,true,'ritual starts using existing builder');
  assert.equal(result.ritualOwned,true,'plan is stored on the owned record');
  assert.equal(result.ritualExport,true,'plan survives strict export/import boundary');
  assert.equal(errors.length,0,'browser execution has no unhandled errors: '+errors.join('; '));
  console.log('PASS hero journey real-browser: '+JSON.stringify(result));
  await page.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
