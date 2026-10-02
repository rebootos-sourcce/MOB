/* THE RELEASE CAROUSEL, PHOTOGRAPHED. Usage: node tools/relshots.js OUT
   Drives the person's own record through two real journal commits, picks
   what they charged, and photographs the setup carousel by story and by
   seat, the running carousel mid list, and the two minutes, at 1600 and
   390. Then a strip of frames of the list gliding one line, so the
   gradient can be judged in motion and not only at rest. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots-rel';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
fs.mkdirSync(OUT,{recursive:true});
const STORIES=[
 'My father never listened. I kept quiet and swallowed the anger for years, and I still feel ashamed when I speak up at work.',
 'I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.'];
(async()=>{
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const page=await browser.newPage({viewport:{width:w,height:h}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'});
  try{await page.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
  await page.waitForTimeout(700);
  await page.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
  await page.waitForTimeout(200);
  const info=await page.evaluate((stories)=>{
   loadP(0); setTab(TAB.FIELD); render();
   stories.forEach(function(t){ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
   compute(); setTab(TAB.FIELD); render();
   var ids=W.filter(function(n){return n.sq>=1;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,6).map(function(n){return n.i;});
   relPick(ids);
   return {ids:ids, ents:CURP.story.entries.length, grp:RUN.grp};},STORIES);
  console.log(w, JSON.stringify(info), errs.join(' | '));
  await page.waitForTimeout(500);
  await page.screenshot({path:OUT+'/setup-story-'+w+'.png'});
  await page.click('[data-relgrp="seat"]'); await page.waitForTimeout(500);
  await page.screenshot({path:OUT+'/setup-seat-'+w+'.png'});
  await page.click('[data-relgrp="story"]'); await page.waitForTimeout(300);
  /* the running list, mid address, the voice off so nothing waits on audio */
  await page.evaluate(()=>{
   if(typeof relTicker==='function')relTicker(false);
   RUN.phase='run'; RUN.idx=1; RUN.pass=2; RUN.paused=true; relRender();});
  await page.waitForTimeout(600);
  await page.screenshot({path:OUT+'/run-'+w+'.png'});
  /* the glide, one line on, frame by frame */
  await page.evaluate(()=>{RUN.pass=3; relRender();});
  for(let f=0;f<6;f++){await page.waitForTimeout(60);
   await page.screenshot({path:OUT+'/glide-'+w+'-'+f+'.png'});}
  /* the two minutes */
  await page.evaluate(()=>{RUN.halted=false; RUN.idx=RUN.plan.length-1; RUN.pass=RUN.dose; relCoolDown();});
  await page.waitForTimeout(900);
  await page.screenshot({path:OUT+'/rest-'+w+'.png'});
  const rest=await page.evaluate(()=>({cooling:COOLING.slice(), ring:!!document.getElementById('relsetd'),
   clock:(document.getElementById('relset')||{}).textContent||''}));
  console.log(w,'rest',JSON.stringify(rest));
  await page.close();}
 await browser.close();})();
