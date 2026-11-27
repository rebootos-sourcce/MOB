/* Draws the explainer pictures. Run from the repo root:  NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-options/shoot3.js */
const {chromium}=require('playwright');
const path=require('path');
const DIR=path.resolve(__dirname), OUT=path.join(DIR,'shots');
(async()=>{
 const b=await chromium.launch();
 for(const n of ['style','hash','line','flow']){
  const p=await b.newPage({viewport:{width:1240,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(`file://${DIR}/explain-${n}.html`); await p.waitForTimeout(1200);
  await p.screenshot({path:`${OUT}/explain-${n}.png`,fullPage:true});
  if(errs.length)console.log(n,errs);
  await p.close();
 }
 await b.close();
})();
