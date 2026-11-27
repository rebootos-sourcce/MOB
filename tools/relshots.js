/* THE RELEASE, PHOTOGRAPHED. Usage: node tools/relshots.js OUT
   Drives the person's own record through two real journal commits, picks
   what they charged, and photographs every screen of the release at 1600
   and 390: the setup by story and by seat, the opening with the prompt
   pinned, the list on its release half and on its reframe half, a line held
   mid swipe, the two minutes, and the results from the top and scrolled.
   Then a strip of frames of the list gliding one line, so the gradient can
   be judged in motion and not only at rest. Round QM added the opening, the
   reframe half, the swipe and the results. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots-rel';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
fs.mkdirSync(OUT,{recursive:true});
const STORIES=[
 'My father never listened. I kept quiet and swallowed the anger for years, and I still feel ashamed when I speak up at work.',
 'I am afraid I will be left. When she goes quiet I panic and try to control everything, and my chest goes tight.'];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--autoplay-policy=no-user-gesture-required']});
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
   /* the message dock is the product's and fades on its own; it is hidden
      here so it does not sit over the controls in every photograph */
   var d=document.getElementById('msgdock'); if(d)d.style.visibility='hidden';
   return {ids:ids, ents:CURP.story.entries.length, grp:RUN.grp};},STORIES);
  console.log(w, JSON.stringify(info), errs.join(' | '));
  await page.waitForTimeout(500);
  await page.screenshot({path:OUT+'/setup-story-'+w+'.png'});
  await page.click('[data-relgrp="seat"]'); await page.waitForTimeout(500);
  await page.screenshot({path:OUT+'/setup-seat-'+w+'.png'});
  await page.click('[data-relgrp="story"]'); await page.waitForTimeout(300);
  /* the opening, the prompt pinned above it */
  await page.evaluate(()=>{if(typeof relTicker==='function')relTicker(false);
   RUN.phase='opening'; RUN.line=0; RUN.paused=true; relRender();});
  await page.waitForTimeout(500);
  await page.screenshot({path:OUT+'/opening-'+w+'.png'});
  /* the running list, mid address, release half, with a few marks made */
  await page.evaluate(()=>{
   RUN.phase='run'; RUN.idx=1; RUN.pass=2; RUN.paused=true;
   RUN.heavy={'0:4':'bank','1:1':'shadow'}; relRender();});
  await page.waitForTimeout(600);
  await page.screenshot({path:OUT+'/run-'+w+'.png'});
  /* the glide, one line on, frame by frame */
  await page.evaluate(()=>{RUN.pass=3; relRender();});
  for(let f=0;f<6;f++){await page.waitForTimeout(60);
   await page.screenshot({path:OUT+'/glide-'+w+'-'+f+'.png'});}
  /* a line held mid swipe, to the right, past the line: Bank */
  const box=await page.evaluate(()=>{var r=document.querySelector('#relcarl .rel-cr-i[data-d="1"]');
   if(!r)return null; var b=r.getBoundingClientRect(); return {x:b.left+b.width/2,y:b.top+b.height/2};});
  if(box){await page.mouse.move(box.x,box.y); await page.mouse.down();
   for(let s=1;s<=8;s++){await page.mouse.move(box.x+s*11,box.y); await page.waitForTimeout(16);}
   await page.waitForTimeout(80);
   await page.screenshot({path:OUT+'/swipe-bank-'+w+'.png'});
   await page.mouse.up(); await page.waitForTimeout(400);}
  /* the reframe half of the first address */
  await page.evaluate(()=>{var i=RUN.plan.findIndex(function(k){return /:Ltruth:/.test(k);});
   RUN.idx=i<0?2:i; RUN.pass=3; RUN.look=false; relRender();});
  await page.waitForTimeout(700);
  await page.screenshot({path:OUT+'/run-reframe-'+w+'.png'});
  /* the binaural tone sounding, so the line saying what each ear hears shows */
  await page.evaluate(()=>{CURP.ui=CURP.ui||{}; CURP.ui.tone=true; RUN.paused=false; relRender();});
  await page.waitForTimeout(700);
  await page.evaluate(()=>{relRender();});
  await page.waitForTimeout(300);
  await page.evaluate(()=>{var s=document.getElementById('relsc'); if(s)s.scrollTop=s.scrollHeight;});
  await page.waitForTimeout(300);
  await page.screenshot({path:OUT+'/run-binaural-'+w+'.png'});
  const bin=await page.evaluate(()=>({bed:bedState(),line:(document.getElementById('relbin')||{}).textContent||''}));
  console.log(w,'binaural',JSON.stringify(bin));
  await page.evaluate(()=>{CURP.ui.tone=false; RUN.paused=true; relRender();
   var s=document.getElementById('relsc'); if(s)s.scrollTop=0;});
  const said=await page.evaluate(()=>({prompt:(document.getElementById('relpr')||{}).textContent,
   line:(document.querySelector('#rel .rel-line')||{}).textContent,
   heavy:RUN.heavy, scrub:+(document.getElementById('relscrub')||{}).value}));
  console.log(w,'reframe',JSON.stringify(said));
  /* the two minutes */
  await page.evaluate(()=>{RUN.halted=false; RUN.idx=RUN.plan.length-1; RUN.pass=RUN.dose; relCoolDown();});
  await page.waitForTimeout(900);
  await page.screenshot({path:OUT+'/rest-'+w+'.png'});
  const rest=await page.evaluate(()=>({cooling:COOLING.slice(), ring:!!document.getElementById('relsetd'),
   clock:(document.getElementById('relset')||{}).textContent||''}));
  console.log(w,'rest',JSON.stringify(rest));
  /* the results, from the top and then each screenful down */
  await page.click('#relrest'); await page.waitForTimeout(900);
  await page.screenshot({path:OUT+'/results-'+w+'.png'});
  const res=await page.evaluate(()=>{var sc=document.getElementById('relsc');
   return {h:sc?sc.scrollHeight:0, ch:sc?sc.clientHeight:0, marks:(RUN.marksNew||[]).map(function(m){return m.nm;}),
    bank:[RUN.bank0,RUN.bank1], vault:[RUN.vault0,RUN.vault1], rit:RUN.ritDone,
    sections:[].slice.call(document.querySelectorAll('.rel-rs-h')).map(function(e){return e.textContent;})};});
  console.log(w,'results',JSON.stringify(res));
  for(let k=1;k*res.ch<res.h&&k<6;k++){
   await page.evaluate(y=>{document.getElementById('relsc').scrollTop=y;},k*res.ch*0.9);
   await page.waitForTimeout(250);
   await page.screenshot({path:OUT+'/results-'+w+'-'+k+'.png'});}
  if(errs.length)console.log(w,'ERRORS',errs.join(' | '));
  await page.close();}
 await browser.close();})();
