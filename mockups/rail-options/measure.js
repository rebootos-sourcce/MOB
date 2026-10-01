/* Counts what each option puts on the first screen, and proves it is moving. Dev tool for this folder.
   Run from the repo root:  NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-options/measure.js
   Writes shots/measure.json and two frames per option in shots/motion/. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const DIR=path.resolve(__dirname), OUT=path.join(DIR,'shots');
fs.mkdirSync(OUT+'/motion',{recursive:true});
(async()=>{
 const b=await chromium.launch(); const res={};
 for(const o of ['A','B','C','D']){
  res[o]={};
  for(const who of ['marcus','tomas']){
   const p=await b.newPage({viewport:{width:1600,height:1000}});
   await p.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=1600&s=open`);
   await p.waitForTimeout(250);
   const clip={x:10,y:121,width:302,height:869};
   await p.screenshot({path:`${OUT}/motion/${o}-${who}-a.png`,clip});
   await p.waitForTimeout(900);
   await p.screenshot({path:`${OUT}/motion/${o}-${who}-b.png`,clip});
   const m=await p.evaluate(()=>{
    const rail=document.querySelector('.rail'), rr=rail.getBoundingClientRect();
    const els=[...rail.querySelectorAll('button,a,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom<=rr.bottom+1&&r.top>=rr.top-1;});
    const small=els.filter(e=>{const r=e.getBoundingClientRect();return r.height<43.5||r.width<43.5;}).map(e=>(e.getAttribute('aria-label')||e.className||e.tagName).toString().slice(0,40)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
    const arch=[...rail.querySelectorAll('.awr')].pop(); const ar=arch?arch.getBoundingClientRect():null;
    return {choices:els.length,small,archBottom:ar?Math.round(ar.bottom):null,railBottom:Math.round(rr.bottom),scrollH:rail.scrollHeight,clientH:rail.clientHeight,anims:document.getAnimations().length};
   });
   res[o][who]=m; await p.close();
  }
 }
 fs.writeFileSync(OUT+'/measure.json',JSON.stringify(res,null,1));
 console.log(JSON.stringify(res,null,1));
 await b.close();
})();
