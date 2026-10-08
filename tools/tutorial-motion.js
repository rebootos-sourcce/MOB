/* THE DAY ONE TUTORIAL, SEEN AND MEASURED, round QJ. The tutorial was the
   last first run surface still opening as the old popup card. This walks it
   the way tests/onboarding2.js does (loadP(0), the same real sentence, the
   real commit) and reports it four ways, because a still cannot show motion:

     still-W-S.png    each of the five steps at rest, at each width
     frames-W/        frame exact, on a frozen clock (playbackRate 0 and
                      seeked, tools/obwelcome-motion.js says why): the arrival,
                      two breaths at rest, the commit, Journal to Discover,
                      which is the step where the entry lands in the field,
                      and one plain Next, Discover to Understand
     timeline-W.tsv   the same frames as numbers, computed style per layer
     calm-W.txt       prefers-reduced-motion: reduce, the count of running
                      animations on every step, which must be zero

     NODE_PATH=/opt/node22/lib/node_modules node tools/tutorial-motion.js OUT [stills]

   ATUNED_FILE picks the build, so the same walk runs on the build before a
   change and after it. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.resolve(process.argv[2]||'tutorial-motion');
const ONLY_STILLS=process.argv[3]==='stills';
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const SIZES=(process.env.SIZES||'1600x1000,390x844').split(',').map(s=>s.split('x').map(Number));
const STORY='I felt tight in my chest when my boss yelled at me and I could not breathe.';
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
fs.mkdirSync(OUT,{recursive:true});
const PROBE=[
 ['stage.op','#tutorial','opacity'],
 ['far.op','#tutorial .obx-far','opacity'],['wash.op','#tutorial .obx-wash','opacity'],
 ['ring.op','#tutorial .obx-ring','opacity'],['ring.rot','#tutorial .obx-ring','rotate'],
 ['ringsv.rot','#tutorial .obx-ringsv','rotate'],['halo.da','#tutorial .obx-halo','stroke-dasharray'],
 ['near.op','#tutorial .obx-near','opacity'],['near.sc','#tutorial .obx-near','scale'],
 ['near.tr','#tutorial .obx-near','translate'],['fig.sc','#tutorial .obx-fig','scale'],
 ['ax.do','#tutorial .obx-ax','stroke-dashoffset'],['sk.fill','#tutorial .obx-skin','fill-opacity'],
 ['pulse.op','#tutorial .obx-pulse','opacity'],['surge.op','#tutorial .obx-surge','opacity'],
 ['surge.tr','#tutorial .obx-surge','translate'],
 ['heart.glow','#tutorial .obx-glow[data-obseat="Heart"]','opacity'],
 ['heart.on','#tutorial .obx-glow.on::before','opacity'],
 ['eye.op','#tutorial .obx-slot .obx-eye','opacity'],['w0.tr','#tutorial .obx-slot .obx-w','translate'],
 ['p0.op','#tutorial .obx-slot .ob-p','opacity'],['acts.op','#tutorial .obx-slot .ob-acts','opacity'],
 ['ghost.op','#tutorial .obx-ghost','opacity'],['ghost.tr','#tutorial .obx-ghost','translate']];
const readAll=PROBE=>{
 const o={};
 PROBE.forEach(([k,q,p])=>{
  const pe=q.indexOf('::')>0?q.slice(q.indexOf('::')):null, qq=pe?q.slice(0,q.indexOf('::')):q;
  const e=document.querySelector(qq);
  if(!e){o[k]='-';return;}
  o[k]=(getComputedStyle(e,pe).getPropertyValue(p)||'').trim()||'-';});
 return o;};
const open=async p=>{
 await p.goto(FILE,{waitUntil:'load'}); await booted(p);
 await p.evaluate(()=>{ loadP(0); CURP.ui=CURP.ui||{}; CURP.ui.tutorialSeen=false;
  if(typeof sheetShut==='function')sheetShut(); });
 await p.waitForTimeout(300);};
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of SIZES){
  const ctx={viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600};
  /* ---- the five steps at rest ---- */
  {const c=await b.newContext(ctx), p=await c.newPage();
   await open(p);
   await p.evaluate(()=>tutorialOpen(true));
   await p.waitForTimeout(2600);
   await p.fill('#tuttext',STORY);
   await p.screenshot({path:path.join(OUT,'still-'+w+'-0.png')});
   await p.click('[data-tut="commit"]'); await p.waitForTimeout(1900);
   await p.screenshot({path:path.join(OUT,'still-'+w+'-1.png')});
   for(const s of [2,3,4]){
    await p.click('#tutorial .ob-card [data-tut="next"]'); await p.waitForTimeout(1900);
    await p.screenshot({path:path.join(OUT,'still-'+w+'-'+s+'.png')});}
   await p.close(); await c.close();}
  /* ---- reduced motion: nothing runs, on any step ---- */
  {const c=await b.newContext(Object.assign({reducedMotion:'reduce'},ctx)), p=await c.newPage();
   await open(p);
   const live=()=>p.evaluate(()=>{const h=document.getElementById('tutorial');
    return document.getAnimations().filter(a=>a.playState==='running'&&a.effect&&a.effect.target
     &&(h.contains(a.effect.target)||(a.effect.target.parentNode&&h.contains(a.effect.target.parentNode)))).length;});
   const lines=[];
   await p.evaluate(()=>tutorialOpen(true)); await p.waitForTimeout(60);
   lines.push('step 1 '+await live());
   await p.fill('#tuttext',STORY);
   await p.click('[data-tut="commit"]'); await p.waitForTimeout(60);
   lines.push('step 2 '+await live()+' ghosts '+await p.$$eval('#tutorial .obx-ghost',x=>x.length));
   for(const s of [3,4,5]){
    await p.click('#tutorial .ob-card [data-tut="next"]'); await p.waitForTimeout(60);
    lines.push('step '+s+' '+await live()+' ghosts '+await p.$$eval('#tutorial .obx-ghost',x=>x.length));}
   await p.screenshot({path:path.join(OUT,'calm-'+w+'-5.png')});
   lines.push('all running in the document '+await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length));
   fs.writeFileSync(path.join(OUT,'calm-'+w+'.txt'),lines.join('\n')+'\n');
   console.log('  '+w+' reduced: '+lines.join(' | '));
   await p.close(); await c.close();}
  if(ONLY_STILLS)continue;
  /* ---- frame exact: arrival, rest, the commit ---- */
  {const fdir=path.join(OUT,'frames-'+w); fs.rmSync(fdir,{recursive:true,force:true}); fs.mkdirSync(fdir,{recursive:true});
   const rows=[];
   const c=await b.newContext(ctx), p=await c.newPage();
   await open(p);
   const freezeAfter=async src=>p.evaluate(src=>{
     (new Function(src))();
     getComputedStyle(document.body).opacity;
     window.__A=document.getAnimations().map(a=>{a.playbackRate=0; return [a,a.currentTime||0];});},src);
   const seek=t=>p.evaluate(t=>{window.__A.forEach(([a,t0])=>{try{a.currentTime=t0+t;}catch(e){}});},t);
   const thaw=()=>p.evaluate(()=>window.__A.forEach(([a])=>{try{a.playbackRate=1;}catch(e){}}));
   const probe=()=>p.evaluate(([src,pr])=>(new Function('PROBE','return ('+src+')(PROBE)'))(pr),[readAll.toString(),PROBE]);
   const run=async(tag,src,span,step,rest,rstep)=>{
    await freezeAfter(src);
    /* rstep||step: with no rest the step past the span was 0, and the last
       frame was taken again for ever, which is what "stalled" was */
    for(let t=0;t<=span+(rest||0);t+=(t<span?step:(rstep||step))){
     await seek(t);
     const ph=t<=span?tag:tag+'-rest';
     rows.push(Object.assign({phase:ph,t},await probe()));
     await p.screenshot({path:path.join(fdir,ph+'-'+String(t).padStart(5,'0')+'.jpg'),type:'jpeg',quality:84});}
    await thaw();};
   await run('1-arrive',"tutorialOpen(true);",2400,40,8400,120);
   await p.fill('#tuttext',STORY); await p.waitForTimeout(200);
   await run('2-commit',"document.querySelector('[data-tut=commit]').click();",1600,40,0,0);
   await p.waitForTimeout(400);
   await run('3-next',"document.querySelector('#tutorial .ob-card [data-tut=next]').click();",1400,40,0,0);
   const keys=['phase','t'].concat(PROBE.map(x=>x[0]));
   fs.writeFileSync(path.join(OUT,'timeline-'+w+'.tsv'),
    keys.join('\t')+'\n'+rows.map(r=>keys.map(k=>r[k]).join('\t')).join('\n')+'\n');
   console.log('  '+w+': '+rows.length+' frames');
   await p.close(); await c.close();}
 }
 await b.close();
 console.log('wrote '+OUT);
})();
