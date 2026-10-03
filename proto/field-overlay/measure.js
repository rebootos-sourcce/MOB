/* MEASURE. What each look costs to run, on the worst case profile, so the
   technical director signs off on a number and not on a feeling.

   Gordon at 1600: 193 connections, the profile tests/design.js already holds
   the Field's frame rate on. For each look, at 12 lines (the default), 40,
   and every line he has, it steps the overlay 300 frames on the page's own
   virtual clock and times each one. Every frame ends with a one pixel read
   of the canvas, which forces the drawing to actually be rasterised inside
   the timed span. Without it a 2D canvas defers its work past the
   measurement and the number reads as nearly free when it is not.

   Beside it, the same measurement of the shipped wheel's own draw() on the
   same profile at the Chains depth, because the overlay would draw on top of
   a surface that already repaints every frame, and the honest figure is the
   sum.

   Both are run twice: at this machine's speed, and with the CPU throttled
   four times through the devtools protocol, the usual stand in for a mid
   range phone. Headless Chromium here rasterises in software, so absolute
   numbers are high and the ratios are the thing to read.

   Writes measure.json. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/measure.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname, EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const LOOKS=['still','hum','pulse','relay'], NS=[12,40,999];
const stat=a=>{a=a.slice().sort((x,y)=>x-y);const m=a.reduce((s,x)=>s+x,0)/a.length;
 return {mean:+m.toFixed(3),p95:+a[Math.floor(a.length*.95)].toFixed(3),max:+a[a.length-1].toFixed(3)};};
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const out={profile:'Gordon',at:'1600x1000',frames:300,runs:{}};
 for(const thr of [1,4]){
  const R=out.runs['cpu x'+thr]={overlay:{},field:null};
  /* the shipped wheel, on its own */
  {const p=await b.newPage({viewport:{width:1600,height:1000}});
   const cdp=await p.context().newCDPSession(p);
   await p.goto('file://'+path.resolve('source.html'));
   await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
   await p.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='Gordon'));setTab(TAB.FIELD);
    const ch=[...document.querySelectorAll('#vbar .vt')].find(b=>/Chains/.test(b.textContent));ch.click();render();});
   await p.waitForTimeout(1500);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
   const t=await p.evaluate(()=>{const cv=document.getElementById('cv'),cx=cv.getContext('2d'),r=compute(),a=[];
    for(let i=0;i<300;i++){const t0=performance.now();DRAW_SIG=null;draw(r);cx.getImageData(0,0,1,1);a.push(performance.now()-t0);}
    return a;});
   R.field=stat(t); await cdp.send('Emulation.setCPUThrottlingRate',{rate:1}); await p.close();}
  /* the overlay, on its own */
  const p=await b.newPage({viewport:{width:1700,height:1100}});
  const cdp=await p.context().newCDPSession(p);
  for(const look of LOOKS)for(const n of NS){
   await p.goto('file://'+path.join(DIR,'index.html')+'?rec=1&title=0&who=Gordon&look='+look+'&n='+n);
   await p.waitForFunction(()=>window.__rec);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:thr});
   const r=await p.evaluate(()=>{const o=window.__rec.ov(),cv=document.getElementById('ov'),cx=cv.getContext('2d');
    const a=[];let mv=0;
    /* past the on choreography, into the steady run, and far enough for the
       relay to be mid cycle */
    for(let i=0;i<300;i++){const t=1400+i*1000/60;const t0=performance.now();
     const s=window.__rec.at(t);cx.getImageData(0,0,1,1);a.push(performance.now()-t0);mv=Math.max(mv,s.moving);}
    return {a,mv,lines:o.stat.lines,sel:o.sel.length,paths:o.paths.length,canvas:[cv.width,cv.height]};});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
   R.overlay[look+' n'+n]=Object.assign(stat(r.a),{movingPeak:r.mv,linesLit:r.lines,canvas:r.canvas});
   console.log('x'+thr,look.padEnd(6),('n'+n).padEnd(5),JSON.stringify(R.overlay[look+' n'+n]));}
  console.log('x'+thr,'shipped Field draw()',JSON.stringify(R.field));
  await p.close();}
 fs.writeFileSync(path.join(DIR,'measure.json'),JSON.stringify(out,null,1)+'\n');
 await b.close();
})();
