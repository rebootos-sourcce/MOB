/* Frame strips and the block-only sheets, 2x, from frozen clocks.
   NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-simple/make-frames.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.join(__dirname,'shots'); fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1860,height:900},deviceScaleFactor:1});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 for(const opt of ['a','b','c']){
  await p.goto('file://'+path.join(__dirname,'frames.html')+'?opt='+opt+'&who=marcus,tomas');
  await p.waitForTimeout(250);
  const h=await p.evaluate(()=>document.body.scrollHeight);
  await p.setViewportSize({width:1860,height:h});
  await p.screenshot({path:path.join(OUT,`frames-${opt}.png`),fullPage:true});
 }
 /* the block alone, four people, at 2x, on the app's panel ground */
 const q=await b.newPage({viewport:{width:1220,height:640},deviceScaleFactor:2});
 await q.goto('file://'+path.join(__dirname,'bench.html')+'?t=30');
 await q.waitForTimeout(250);
 await q.screenshot({path:path.join(OUT,'blocks-2x.png'),fullPage:true});
 console.log(errs.length?errs.join('\n'):'no page errors');
 await b.close();
})();
