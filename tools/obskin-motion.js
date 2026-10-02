/* ONBOARDING MOTION CAPTURE, round QH. The owner's ask this round was motion,
   and a still cannot show motion, so this writes two things per width:

     walk-W.webm      a real time recording of the whole run, open to close,
                      exactly as the browser played it. Honest about frame
                      rate: if a move stutters here, it stutters.
     frames-W/        every transition frame by frame at 40ms, made by pausing
                      every animation on the page the instant the step
                      changes and seeking them all together. Frame exact
                      whatever the machine is doing, which the recording is not.

   Run from the repo root:

     NODE_PATH=/opt/node22/lib/node_modules node tools/obskin-motion.js OUT

   tools/obskin-gif.py turns frames-W/ into an animated GIF. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.resolve(process.argv[2]||'motion');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
const SIZES=[[1600,1000],[390,844]];
const STORY='I snapped at my co-founder in front of the whole team and I cannot stop replaying it.';
/* the arrival is the one long move, about 1.9s to its last name; every step
   change after it is settled inside 1.24s */
const STEP_MS=40, SPAN_MS=1240, ARRIVE_MS=2000;
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
fs.mkdirSync(OUT,{recursive:true});

/* the walk, as a list of moves. Each is a function run inside the page that
   changes the step synchronously, and a name for the frames it makes. */
const MOVES=[
 ['00-arrive',   ()=>{ if(typeof LOGIN!=='undefined'&&LOGIN.open)loginClose(); loadP(0); obOpen(true); }, 2400],
 ['01-arrive-to-ask',  ()=>document.querySelector('[data-ob=next]').click()],
 ['02-ask-to-settle',      ()=>document.querySelector('[data-obpick="2"]').click()],
 ['03-back-to-ask',     ()=>document.querySelector('.obx-slot [data-ob=back]').click()],
 ['04-ask-to-settle',()=>document.querySelector('[data-obpick="2"]').click()],
 ['05-settle-to-feel',   ()=>document.querySelector('.obx-slot [data-ob=next]').click()],
 ['06-feel-to-body',     ()=>document.querySelector('[data-obfeel="1"]').click()],
 ['07-body-chip-preview',     ()=>{ /* the preview first, then the press, as a pointer would */
   var c=document.querySelector('[data-obplace="3"]');
   c.dispatchEvent(new PointerEvent('pointerover',{bubbles:true})); }],
 ['08-body-to-story',     ()=>document.querySelector('[data-obplace="3"]').click()],
 ['09-story-to-mirror',   s=>{ var ta=document.getElementById('obtext'); ta.value=s;
   ta.dispatchEvent(new Event('input')); document.getElementById('obdone').click(); }],
 ['10-mirror-to-bridge',   ()=>{ document.querySelectorAll('[data-obans="yes"]').forEach((e,i)=>{if(i<3)e.click();});
   document.querySelector('[data-ob=mirrorcommit]').click(); }]];

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of SIZES){
  /* ---- one: real time ---- */
  {const vdir=path.join(OUT,'vid-'+w); fs.mkdirSync(vdir,{recursive:true});
   const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600,
    recordVideo:{dir:vdir,size:{width:w,height:h}}});
   const p=await c.newPage();
   await p.goto(FILE,{waitUntil:'load'}); await booted(p); await p.waitForTimeout(400);
   for(const [nm,fn,hold] of MOVES){
    await p.evaluate(fn,STORY); await p.waitForTimeout(hold||1700);}
   await p.evaluate(()=>document.querySelector('[data-ob=done]').click());
   await p.waitForTimeout(1200);
   const v=p.video(); await p.close(); await c.close();
   const src=await v.path(); fs.renameSync(src,path.join(OUT,'walk-'+w+'.webm'));
   fs.rmSync(vdir,{recursive:true,force:true});}
  /* ---- two: frame exact ---- */
  {const fdir=path.join(OUT,'frames-'+w); fs.rmSync(fdir,{recursive:true,force:true}); fs.mkdirSync(fdir,{recursive:true});
   const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
   const p=await c.newPage();
   await p.goto(FILE,{waitUntil:'load'}); await booted(p); await p.waitForTimeout(400);
   let n=0;
   for(const [nm,fn] of MOVES){
    /* the move, then every animation on the page paused where it stands, with
       its clock read, so frame t is every animation at its own start plus t */
    /* FROZEN BY RATE, NEVER BY pause(). Measured: calling pause() and play()
       on a CSS animation hands it to script, and Chrome then stops cancelling
       it when its selector stops matching. The arrival's name entrance was
       paused on the first move, and from then on every later step replayed it,
       so the frames showed seven names on steps where the page shows none.
       playbackRate 0 holds the clock without taking the animation over, and
       CSS still cancels what it should. Checked both ways before trusting it. */
    await p.evaluate(([src,s])=>{
     (new Function('s','return ('+src+')(s)'))(s);
     getComputedStyle(document.body).opacity;
     window.__obA=document.getAnimations().map(a=>{a.playbackRate=0; return [a,a.currentTime||0];});},[fn.toString(),STORY]);
    const span=nm==='00-arrive'?ARRIVE_MS:SPAN_MS;
    for(let t=0;t<=span;t+=STEP_MS){
     await p.evaluate(t=>{ window.__obA.forEach(([a,t0])=>{ try{a.currentTime=t0+t;}catch(e){} }); },t);
     await p.screenshot({path:path.join(fdir,String(n).padStart(4,'0')+'-'+nm+'-'+String(t).padStart(4,'0')+'.png')});
     n++;}
    /* let the move finish for real before the next one */
    await p.evaluate(()=>window.__obA.forEach(([a])=>{try{a.playbackRate=1;}catch(e){}}));
    await p.waitForTimeout(1500);}
   await p.close(); await c.close();
   console.log('  '+w+': '+n+' frames');}
 }
 await b.close();
 console.log('wrote motion to '+OUT);
})();
