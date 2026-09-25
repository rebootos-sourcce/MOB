/* Screenshots of anatomy-check.html.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/anatomy-check/shots.js
   Writes shots/anatomy-check-1600.png (full page, Dark, which is the
   product's default lighting), and checks the page at 390 for sideways
   scroll, since the owner may open it on a phone. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const FILE='file://'+path.join(__dirname,'anatomy-check.html');
const OUT=path.join(__dirname,'shots');
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const report=[];
 for(const [w,h,scheme,name] of [[1600,1000,'dark','anatomy-check-1600'],[1600,1000,'light','anatomy-check-1600-snow'],[390,844,'dark','anatomy-check-390']]){
  const ctx=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme,deviceScaleFactor:1});
  const p=await ctx.newPage(); const errs=[], reqs=[];
  p.on('pageerror',e=>errs.push(String(e.message)));
  p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs.push(r.url());});
  await p.goto(FILE); await p.waitForTimeout(700);
  const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,
   h:document.documentElement.scrollHeight,fonts:[...document.fonts].map(f=>f.family+':'+f.status).join(','),
   minText:(()=>{let mn=99;document.querySelectorAll('svg text,svg tspan,p,td,th,li,span,b').forEach(el=>{
     const fs=parseFloat(getComputedStyle(el).fontSize);if(el.textContent.trim()&&fs<mn)mn=fs;});return mn;})()}));
  await p.screenshot({path:path.join(OUT,name+'.png'),fullPage:true});
  report.push({name,...m,errors:errs,network:reqs});
  await ctx.close();
 }
 await b.close();
 report.forEach(r=>console.log(r.name,'width',r.cw,'scrollWidth',r.sw,r.sw>r.cw?'SIDEWAYS SCROLL':'no sideways scroll',
  'height',r.h,'smallest text',r.minText+'px','fonts',r.fonts,'errors',r.errors.length?r.errors:'none','network',r.network.length?r.network:'none'));
})();
