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
  const initial=await page.evaluate(()=>{
   /* Synthetic birth date; do not alter any stored record. */
   if(!CURP.who)CURP.who={};
   CURP.who.born={date:'2000-04-06',timeUnknown:true,time:'',place:'',zone:''};
   const before=JSON.stringify(CURP), cq=compute().CQ;
   renderAvatar();
   return {before,cq,host:!!document.querySelector('[data-avcelestial]')};
  });
  assert.equal(initial.host,true,'actual Avatar panel must contain the new host');
  await page.locator('[data-avcel-toggle]').click({timeout:10000,force:true});
  await page.waitForSelector('[data-cal-mask]',{timeout:10000});
  const state=await page.evaluate(()=>{
   const root=document.querySelector('[data-celestial-avatar-cascade]');
   return {root:!!root,text:root&&root.textContent,
    systems:AT_CELESTIAL_SNAPSHOT.records.length};
  });
  assert.equal(state.root,true);
  assert.equal(state.systems,36);
  assert.match(state.text,/Human Design/i);
  await page.locator('[data-cal-mask]').selectOption('mask:Professional',{force:true});
  const mod=await page.evaluate(()=>({
   read:document.querySelector('[data-celestial-avatar-cascade]')?.textContent||'',
   after:JSON.stringify(CURP),cq:compute().CQ
  }));
  assert.match(mod.read,/Professional mask/);
  assert.equal(mod.after,initial.before,'Avatar panel cannot rewrite CURP');
  assert.equal(mod.cq,initial.cq,'Avatar panel cannot change CQ');
  await page.locator('[data-avcel-toggle]').click({force:true});
  assert.equal(await page.locator('[data-cal-mask]').count(),0);
  assert.deepEqual(errors,[],'browser JS errors');
  console.log(JSON.stringify({result:'PASS',real_browser:true,avatar_host:true,
    partial_hd:true,mask_changed:true,profile_unchanged:true,CQ_unchanged:true,
    browser_errors:errors.length}));
 }finally{await browser.close()}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
