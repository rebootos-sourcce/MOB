#!/usr/bin/env node
'use strict';
/* Real browser acceptance for the optional Celestial panel inside the MOB
   Avatar tab. Synthetic date and temporary in-memory profile: no user data. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async function(){
 const file=path.resolve(process.env.ATUNED_FILE||'/tmp/atuned-celestial.html');
 assert.ok(fs.existsSync(file),'built app must exist at '+file);
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1400,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(file).href,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>typeof AT_CELESTIAL==='object' &&
   typeof AT_CELESTIAL_SNAPSHOT==='object' && typeof renderAvatar==='function' &&
   typeof CURP==='object' && typeof S==='object',{timeout:30000});
  /* The opening film deliberately consumes the first press as Skip, without
     forwarding it to Guest. Wait until it is actually gone, as the existing
     tests/boot.js acceptance contract requires. */
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-boot')==='ok' &&
   !document.getElementById('boot'),null,{timeout:30000});
  /* Use the application's genuine Guest entry point, not loginClose() or a
     hidden-element force click. No credentials or remote accounts are used. */
  const guest=page.locator('#loginb-skip');
  await guest.waitFor({state:'visible',timeout:15000});
  await guest.click({timeout:15000});
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('login')).display==='none');
  /* Guest can open the genuine first-run onboarding stage. Its body.ob-on
     state deliberately hides the whole .app, including Play navigation.
     Choose the visible "Not now" control before testing the Avatar. */
  await page.waitForFunction(()=>document.body.classList.contains('ob-on') &&
   typeof OB==='object' && OB.open===true,null,{timeout:15000});
  const onboarding=page.locator('#ob .obx-top .obx-x[data-ob="skip"]');
  await onboarding.waitFor({state:'visible',timeout:15000});
  await onboarding.click({timeout:15000});
  await page.waitForFunction(()=>!document.body.classList.contains('ob-on') &&
   OB.open===false,null,{timeout:15000});
  const initial=await page.evaluate(()=>{
   /* Synthetic birth date; do not alter any stored record. */
   if(!CURP.who)CURP.who={};
   CURP.who.born={date:'2000-04-06',timeUnknown:true,time:'',place:'',zone:''};
   const before=JSON.stringify(CURP), cq=compute().CQ;
   renderAvatar();
   return {before,cq,host:!!document.querySelector('[data-avcelestial]')};
  });
  assert.equal(initial.host,true,'actual Avatar panel must contain the new host');
  /* The actual application opens on Discover. Avatar is in the Play section.
     Calling renderAvatar() does not display its hidden #iq container. Enter
     through the real section and tab controls; never force-click a hidden UI. */
  /* The navigation can start folded (tabnames checkbox). Unfold it by
     its genuine accessible control before selecting a different section. */
  const fold=page.locator('#tabnames');
  if(!(await fold.isChecked()))await fold.check({timeout:10000});
  const nav=await page.evaluate(()=>{
   const play=document.querySelector('#secbar .secb[data-sec="play"]');
   const top=document.querySelector('.top');
   const cs=play&&getComputedStyle(play);
   const hierarchy=[];for(let e=play;e&&hierarchy.length<7;e=e.parentElement){
    const c=getComputedStyle(e);hierarchy.push({tag:e.tagName,id:e.id,cls:e.className,
     display:c.display,visibility:c.visibility,opacity:c.opacity,hidden:e.hidden});}
   return {width:innerWidth,folded:!document.getElementById('tabnames').checked,
    section:top&&top.getAttribute('data-sec'),
    foldedRuleMatches:play.matches('.tabnames-i:not(:checked)~.secbar .secb:not([aria-pressed=true])'),
    display:cs&&cs.display,visibility:cs&&cs.visibility,hierarchy:hierarchy,
    rect:play&&play.getBoundingClientRect().toJSON()};
  });
  console.log('Avatar navigation preflight '+JSON.stringify(nav));
  const play=page.locator('#secbar .secb[data-sec="play"]');
  await play.waitFor({state:'visible',timeout:10000});
  await play.click({timeout:10000});
  const avatarTab=page.locator('#tabbar .tabtop[data-tabk="5"]');
  await avatarTab.waitFor({state:'visible',timeout:10000});
  await avatarTab.click({timeout:10000});
  await page.waitForFunction(()=>S.tab===TAB.INTAKE && !!document.querySelector('#avbody [data-avcelestial]'));
  const toggle=page.locator('#avbody [data-avcel-toggle]');
  await toggle.waitFor({state:'visible',timeout:10000});
  await toggle.click({timeout:10000});
  await page.locator('[data-cal-mask]').waitFor({state:'visible',timeout:10000});
  const state=await page.evaluate(()=>{
   const root=document.querySelector('[data-celestial-avatar-cascade]');
   return {root:!!root,text:root&&root.textContent,
    systems:AT_CELESTIAL_SNAPSHOT.records.length};
  });
  assert.equal(state.root,true);
  assert.equal(state.systems,36);
  assert.match(state.text,/Human Design/i);
  await page.locator('[data-cal-mask]').selectOption('mask:Professional');
  const mod=await page.evaluate(()=>({
   read:document.querySelector('[data-celestial-avatar-cascade]')?.textContent||'',
   after:JSON.stringify(CURP),cq:compute().CQ
  }));
  assert.match(mod.read,/Professional mask/);
  assert.equal(mod.after,initial.before,'Avatar panel cannot rewrite CURP');
  assert.equal(mod.cq,initial.cq,'Avatar panel cannot change CQ');
  await toggle.click();
  assert.equal(await page.locator('[data-cal-mask]').count(),0);
  assert.deepEqual(errors,[],'browser JS errors');
  console.log(JSON.stringify({result:'PASS',real_browser:true,avatar_host:true,
    partial_hd:true,mask_changed:true,profile_unchanged:true,CQ_unchanged:true,
    browser_errors:errors.length}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
