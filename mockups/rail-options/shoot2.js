/* One-off pictures: the Awareness section opened, with the right panel (round OT), and any page by url.
   Run from the repo root:  NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-options/shoot2.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const DIR=path.resolve(__dirname), OUT=path.join(DIR,'shots');
(async()=>{
 const b=await chromium.launch();
 const jobs=[
  ['rail-A.html?p=marcus&v=1600&s=open&full=1&aw=open&sel=Weaver&all=1','full-awareness-marcus.png',1600,1000],
  ['rail-A.html?p=tomas&v=1600&s=open&full=1&aw=open&sel=Weaver','full-awareness-tomas.png',1600,1000],
  ['rail-A.html?p=marcus&v=390&s=open&aw=open&sel=Weaver&all=1','awareness-390-marcus.png',390,844],
 ];
 for(const [u,f,w,h] of jobs){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+DIR+'/'+u); await p.waitForTimeout(1500);
  await p.screenshot({path:OUT+'/'+f,fullPage:w<500});
  if(errs.length)console.log(f,errs);
  await p.close();
 }
 await b.close();
})();
