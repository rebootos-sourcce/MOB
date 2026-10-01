/* Draws the PNGs for the contact sheet from the live pages. Dev tool for this folder only.
   Run from the repo root:  NODE_PATH=/opt/node22/lib/node_modules node mockups/rail-options/shoot.js [opts] [people] [what]
   e.g.  shoot.js A,B marcus,tomas rail     shoot.js all all all */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const DIR=path.resolve(__dirname), OUT=path.join(DIR,'shots');
fs.mkdirSync(OUT,{recursive:true});
const OPTS=(process.argv[2]||'A,B,C,D').replace('all','A,B,C,D').split(',');
const PEOPLE=(process.argv[3]||'marcus,tomas').replace('all','marcus,diane,tomas').split(',');
const WHAT=(process.argv[4]||'rail').split(',');
const WAIT=+(process.env.WAIT||1400);
(async()=>{
 const b=await chromium.launch();
 for(const o of OPTS){
  for(const who of PEOPLE){
   if(WHAT.includes('rail')||WHAT.includes('all')){
    const p=await b.newPage({viewport:{width:1600,height:1000}});
    const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
    await p.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=1600&s=open`); await p.waitForTimeout(WAIT);
    await p.screenshot({path:`${OUT}/${o}-1600-open-${who}.png`});
    const p2=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:2});
    await p2.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=1600&s=open`); await p2.waitForTimeout(WAIT);
    await p2.screenshot({path:`${OUT}/${o}-rail-${who}.png`,clip:{x:10,y:121,width:302,height:869}});
    await p2.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=1600&s=closed`); await p2.waitForTimeout(WAIT);
    await p2.screenshot({path:`${OUT}/${o}-closed-${who}.png`,clip:{x:10,y:121,width:58,height:869}});
    await p2.close();
    await p.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=1600&s=closed`); await p.waitForTimeout(WAIT);
    await p.screenshot({path:`${OUT}/${o}-1600-closed-${who}.png`});
    await p.close();
    if(errs.length)console.log(o,who,'ERRORS',errs.slice(0,4));
   }
   if(WHAT.includes('phone')||WHAT.includes('all')){
    const q=await b.newPage({viewport:{width:390,height:844}});
    const errs=[]; q.on('pageerror',e=>errs.push(e.message));
    await q.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=390&s=open`); await q.waitForTimeout(WAIT);
    await q.screenshot({path:`${OUT}/${o}-390-open-${who}.png`,fullPage:true});
    await q.goto(`file://${DIR}/rail-${o}.html?p=${who}&v=390&s=closed`); await q.waitForTimeout(WAIT);
    await q.screenshot({path:`${OUT}/${o}-390-closed-${who}.png`,fullPage:true});
    await q.close();
    if(errs.length)console.log(o,who,'PHONE ERRORS',errs.slice(0,4));
   }
  }
 }
 await b.close();
})();
