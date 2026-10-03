/* THE RELEASE AFTER ROUND QQ, photographed. Usage: node tools/relshots-qq.js OUT
   The running screen and the results at 1600 and 390, on the person's own
   record with the 21 laws answered so CQ reads, showing what round QQ
   changed: the two sides named Left channel and Right channel, the scrub
   headed Release and Reframe, numbers only down the list, the bank pick with
   its count, Submit and Recycle, End session, Pause and Bookmark under the
   list, and CQ and Up beside DQ and Down. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots-rel-qq';
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
   loadP(0); SI.forEach(function(l){CURP.laws[l.nm]=6; S.law[l.nm]=6;});
   stories.forEach(function(t){ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
   compute(); setTab(TAB.FIELD); render();
   var ids=W.filter(function(n){return n.sq>=1;}).sort(function(a,b){return b.sq-a.sq;}).slice(0,4).map(function(n){return n.i;});
   relPick(ids); RUN.dose=25; RUN.plan=relPlan();
   var d=document.getElementById('msgdock'); if(d)d.style.visibility='hidden';
   relTicker(false); RUN.phase='run'; RUN.idx=1; RUN.pass=6; RUN.paused=false; RUN.look=false;
   /* two lines picked for the bank, one already submitted, one in the shadow */
   RUN.heavy={'1:2':'kept','1:4':'bank','1:5':'bank','1:3':'shadow'};
   RUN.books={}; relRender(); relBookToggle();
   return {ids:ids, cq:compute().CQ};},STORIES);
  console.log(w, JSON.stringify(info), errs.join(' | '));
  await page.waitForTimeout(700);
  await page.screenshot({path:OUT+'/run-release-'+w+'.png'});
  await page.evaluate(()=>{var s=document.getElementById('relsc'); if(s)s.scrollTop=s.scrollHeight;});
  await page.waitForTimeout(400);
  await page.screenshot({path:OUT+'/run-figures-'+w+'.png'});
  await page.evaluate(()=>{var i=RUN.plan.findIndex(function(k){return /:Ltruth:/.test(k);});
   RUN.idx=i; RUN.pass=4; RUN.look=false; relRender(); var s=document.getElementById('relsc'); if(s)s.scrollTop=0;});
  await page.waitForTimeout(700);
  await page.screenshot({path:OUT+'/run-reframe-'+w+'.png'});
  /* to the end and past the two minutes, onto the results */
  await page.evaluate(()=>{RUN.halted=false; RUN.idx=RUN.plan.length; relCoolDown();
   var b=document.getElementById('relrest'); if(b)b.click();});
  await page.waitForTimeout(900);
  await page.screenshot({path:OUT+'/results-top-'+w+'.png'});
  await page.evaluate(()=>{var e=document.getElementById('relrscq'), s=document.getElementById('relsc');
   if(e&&s)s.scrollTop+=e.getBoundingClientRect().top-s.getBoundingClientRect().top-140;});
  await page.waitForTimeout(400);
  await page.screenshot({path:OUT+'/results-cq-'+w+'.png'});
  console.log(w,'errors:',errs.length);
  await page.close();}
 await browser.close();})();
