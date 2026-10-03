/* Photographs the frame strips. Run after make.js, which takes the eight real
   moments of today's rows that the top row of each strip is made of.
   NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-lines/make-frames.js */
const {chromium}=require('playwright');
const path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:2400,height:420}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 for(const who of ['marcus','tomas']){
  await p.goto('file://'+path.join(__dirname,'frames.html')+'?who='+who);
  await p.waitForTimeout(700);
  await p.screenshot({path:path.join(__dirname,'shots',`frames-${who}.png`),fullPage:true});
 }
 await b.close();
})();
