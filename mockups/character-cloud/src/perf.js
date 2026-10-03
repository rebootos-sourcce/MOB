/* What a frame costs. Loads each page for real, with its own clock, and reads the time the canvas draw
   took. Chromium here draws on the CPU with no graphics card, so these are slower than a laptop's.
   NODE_PATH=/opt/node22/lib/node_modules node mockups/character-cloud/src/perf.js */
const {chromium}=require('playwright');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of [[1600,1000],[390,844]])for(const s of ['a-aura','b-contour','c-mosaic']){
  const rows=[];
  for(const m of ['Child','Preteen','Teen','Ideological']){
   const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1});
   await p.goto('file://'+path.join(ROOT,s+'.html')+'?profile=anger&mask='+m+'&carry=1');
   await p.waitForTimeout(3500);
   await p.evaluate(()=>{window.__perf={n:0,ms:0,max:0};});
   await p.waitForTimeout(4000);
   const r=await p.evaluate(()=>window.__perf);rows.push(m+' '+(r.ms/r.n).toFixed(1)+'ms avg '+r.max.toFixed(1)+'ms max '+(r.n/4).toFixed(0)+'fps');
   await p.close();}
  console.log(w,s,rows.join(' | '));}
 await b.close();})();
