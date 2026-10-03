/* What each direction costs per frame, live, at real speed. Chromium's own
   counters over a ten second window: main thread task time, script time, style
   and layout time, divided by the frames the page produced. Headless, software
   rendered, so the absolute figures are a ceiling a phone's GPU will beat on
   paint and a phone's CPU will lose on script; the comparison between
   directions and between phases is the useful part.

     NODE_PATH=/opt/node22/lib/node_modules node mockups/release-redesign/perf.js */
const {chromium}=require('playwright');
const path=require('path');
const CASES=[['opening','t=0&live=1&dir=ring'],['run, B edges','dir=edges&at=0.0.31&f=.1&live=1'],['run, A ring','dir=ring&at=0.0.31&f=.1&live=1'],['run, C stage','dir=stage&at=0.0.31&f=.1&live=1'],['cooldown','dir=ring&dt=2&ended=100&live=1'],
 ['run, B edges, one update a statement','dir=edges&at=0.0.31&f=.1&live=1&tick=1000'],['run, A ring, one update a statement','dir=ring&at=0.0.31&f=.1&live=1&tick=1000'],
 ['run, C stage, one update a statement','dir=stage&at=0.0.31&f=.1&live=1&tick=1000']];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const rows=[];
 for(const [w,h] of [[1600,1000],[390,844]]) for(const [name,q] of CASES){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const cdp=await p.context().newCDPSession(p); await cdp.send('Performance.enable');
  await p.goto('file://'+path.resolve(__dirname,'room.html')+'?bare=1&'+q);
  await p.evaluate(()=>{window.__f=0;(function f(){window.__f++;requestAnimationFrame(f);})();});
  await p.waitForTimeout(1200);
  const m=async()=>{const r=await cdp.send('Performance.getMetrics');const o={};r.metrics.forEach(x=>o[x.name]=x.value);return o;};
  const a=await m(), f0=await p.evaluate(()=>window.__f); await p.waitForTimeout(10000); const z=await m(), f1=await p.evaluate(()=>window.__f);
  const fr=f1-f0, d=k=>(z[k]-a[k])*1000;
  rows.push({view:w+'x'+h,case:name,frames:fr,fps:+(fr/10).toFixed(1),taskMsPerFrame:+(d('TaskDuration')/fr).toFixed(2),scriptMsPerFrame:+(d('ScriptDuration')/fr).toFixed(3),
   layoutMsPerFrame:+(d('LayoutDuration')/fr).toFixed(3),styleMsPerFrame:+(d('RecalcStyleDuration')/fr).toFixed(3),cpuPct:+(d('TaskDuration')/100).toFixed(1)});
  await p.close();}
 console.table(rows);
 require('fs').writeFileSync(path.resolve(__dirname,'frames/perf.json'),JSON.stringify(rows,null,1));
 require('fs').writeFileSync(path.resolve(__dirname,'frames/perf.js'),'window.PERF='+JSON.stringify(rows)+';');
 await b.close();
})();
