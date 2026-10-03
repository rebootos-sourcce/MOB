/* ONBOARDING SKIN SHOTS. Every onboarding surface a stranger meets, at 1600
   and at 390, plus the release the bridge hands off to and the What changed
   step that ends it. Run from the repo root:

     NODE_PATH=/opt/node22/lib/node_modules node tools/obskin-shots.js OUT TAG

   TAG is "before" or "after". The names are the storyboard's own panels, so
   the two sets diff panel by panel. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots';
const TAG=process.argv[3]||'after';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
const SIZES=[[1600,1000],[390,844]];
const STORY='I snapped at my co-founder in front of the whole team and I cannot stop replaying it.';
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
fs.mkdirSync(OUT,{recursive:true});

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of SIZES){
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  const p=await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE,{waitUntil:'load'}); await booted(p);
  await p.waitForTimeout(600);
  const shot=async n=>{await p.screenshot({path:`${OUT}/${TAG}-${w}-${n}.png`});};
  const click=async s=>{await p.evaluate(q=>{var e=document.querySelector(q);if(e)e.click();},s);
   await p.waitForTimeout(1300);};

  await p.evaluate(()=>{ if(typeof LOGIN!=='undefined'&&LOGIN.open)loginClose();
   loadP(0); obOpen(true); });
  /* round QH: the stage has an arrival, about 1.6s to the last name */
  await p.waitForTimeout(2200);
  await shot('1-welcome');
  await click('[data-ob=next]');
  await shot('2-orient');                      /* the loop, or the old ask */
  /* the ask: the twelve starting points. On the after build it sits one step
     later, so the shot is taken wherever the chips are. */
  const haveChips=await p.evaluate(()=>!!document.querySelector('[data-obpick]'));
  if(!haveChips){ await click('[data-ob=next]'); }
  await shot('2b-ask');
  await click('[data-obpick="2"]');
  await shot('3a-settle');
  await click('[data-ob=next]');
  await shot('3b-feel');
  await click('[data-obfeel="1"]');
  await shot('3c-body');
  await click('[data-obplace="3"]');
  await shot('3d-story');
  await p.evaluate(s=>{const ta=document.getElementById('obtext');
   ta.value=s; ta.dispatchEvent(new Event('input'));},STORY);
  await p.waitForTimeout(150);
  await click('#obdone');
  await p.waitForTimeout(400);
  await shot('4-mirror');
  await p.evaluate(()=>{document.querySelectorAll('[data-obans="yes"]').forEach(function(e,i){if(i<3)e.click();});});
  await p.waitForTimeout(350);
  await shot('4b-mirror-answered');
  await click('[data-ob=mirrorcommit]');
  await p.waitForTimeout(450);
  await shot('5a-bridge');
  await click('[data-ob=release]');
  await p.waitForTimeout(1400);
  await shot('5b-release');
  /* walk the run to its end so the What changed step is on screen. The run
     is driven forward to its last line rather than halted at the welcome,
     because a halt at the welcome closes the card and asks nothing. */
  await p.evaluate(()=>{
   if(typeof RUN==='undefined'||!RUN.open)return;
   RUN.phase='run'; RUN.idx=(RUN.plan||[]).length-1; RUN.line=0; RUN.pass=0;
   RUN.halted=true; relCoolDown();});
  await p.waitForTimeout(900);
  await shot('6-verify');
  if(errs.length)console.log('  page errors at '+w+': '+errs.slice(0,4).join(' | '));
  await p.close(); await c.close();
 }
 await b.close();
 console.log('wrote '+TAG+' shots to '+OUT);
})();
