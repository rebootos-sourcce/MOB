/* field-baseline.js. Photographs today's Field tab (source.html, untouched) for the grade side by side.
   node mockups/layer-observatory/field-baseline.js   (NODE_PATH at a playwright install, run from the repo root) */
const {chromium}=require('playwright');
const path=require('path');
const OUT=path.join(__dirname,'baseline');require('fs').mkdirSync(OUT,{recursive:true});
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h,dpr] of [[1600,1000,1],[390,844,2]]){
  for(const who of ['Derek','Tomas']){
   const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr});
   await p.goto('file://'+path.resolve(__dirname,'../../source.html')+'?dev=1');await booted(p);await p.waitForTimeout(400);
   const i=await p.evaluate(n=>PEOPLE.findIndex(q=>q.nm===n),who);
   await p.evaluate(i=>{loadP(i);setTab(TAB.FIELD);render&&render();},i);
   await p.waitForTimeout(2200);
   await p.screenshot({path:path.join(OUT,'field-'+who.toLowerCase()+'-'+w+'.png')});
   await p.close();}}
 await b.close();
})();
