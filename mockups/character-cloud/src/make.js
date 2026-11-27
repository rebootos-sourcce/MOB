/* Renders every picture. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/character-cloud/src/make.js [which] [outdir]
   which: quick (one hero per system, into outdir), all (the whole set into mockups/character-cloud/shots) */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..');
const which=process.argv[2]||'quick';
const OUT=process.argv[3]||path.join(ROOT,'shots');
fs.mkdirSync(OUT,{recursive:true});
const SYS=['a-aura','b-contour','c-mosaic'];
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
async function open(file,w,h,query,dsf){const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:dsf||(w<700?2:1)});
 p.on('pageerror',e=>console.log('PAGEERR',file,e.message));
 await p.goto('file://'+path.join(ROOT,file+'.html')+'?manual=1&'+(query||''));await p.waitForTimeout(120);return p;}
async function hero(sys,w,h,query,t,out,pre){const p=await open(sys,w,h,query);if(pre)await p.evaluate(pre);
 await p.evaluate(tt=>window.__step(tt),t);await p.waitForTimeout(100);await p.screenshot({path:path.join(OUT,out)});await p.close();}
async function sheet(sys,prof,w,out){const p=await browser.newPage({viewport:{width:w,height:1000},deviceScaleFactor:w<700?2:1});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('file://'+path.join(ROOT,'states-'+sys+'.html')+'?manual=1&profile='+prof);await p.waitForTimeout(200);
 await p.evaluate(()=>window.__sheetStep(2.8));await p.waitForTimeout(100);await p.screenshot({path:path.join(OUT,out),fullPage:true});await p.close();}
/* a frame strip: the opening page at 0, 0.5, 1 and 2 seconds, stage only, joined into one picture */
async function strip(sys,prof,out,w,h){const times=[0,.5,1,2];const frames=[];
 const p=await open(sys,w,h,'profile='+prof);
 let at=0;for(const t of times){await p.evaluate(s=>window.__step(s),t-at);at=t;await p.waitForTimeout(80);
  const el=await p.$('#stk');const b=await el.screenshot();frames.push(b.toString('base64'));}
 await p.close();
 const q=await browser.newPage({viewport:{width:w<700?1600:1600,height:w<700?560:600},deviceScaleFactor:1});
 const cw=w<700?390:Math.floor(1600/4);
 const html='<!doctype html><body style="margin:0;background:#0C0D12;display:flex;gap:4px;font:13px Inter,system-ui,sans-serif;color:#B4B0A8">'
  +frames.map((f,i)=>'<div style="position:relative;flex:1"><img style="width:100%;display:block" src="data:image/png;base64,'+f+'"><span style="position:absolute;left:50%;transform:translateX(-50%);top:10px;background:rgba(12,13,18,.8);padding:3px 9px;border-radius:10px">'+times[i]+(times[i]===1?' second':' seconds').replace('1 seconds','1 second')+'</span></div>').join('')+'</body>';
 await q.setContent(html);await q.waitForTimeout(250);
 const bb=await q.evaluate(()=>{const r=document.querySelector('body > div').getBoundingClientRect();return {w:Math.ceil(r.width),h:Math.ceil(r.height)};});
 await q.setViewportSize({width:1600,height:bb.h});await q.screenshot({path:path.join(OUT,out),clip:{x:0,y:0,width:1600,height:bb.h}});await q.close();}
(async()=>{browser=await chromium.launch({executablePath:EXE});
 if(which==='quick'){
  for(const s of SYS)await hero(s,1600,1000,'profile=anger',3.5,s+'-1600.png');
 }
 if(which==='one'){const s=process.argv[4],pf=process.argv[5]||'anger';await hero(s,1600,1000,'profile='+pf+(process.argv[6]?'&'+process.argv[6]:''),+(process.argv[7]||3.5),s+'-'+pf+'-1600.png');
  await hero(s,390,844,'profile='+pf+(process.argv[6]?'&'+process.argv[6]:''),+(process.argv[7]||3.5),s+'-'+pf+'-390.png');}
 if(which==='all'){
  for(const s of SYS){
   for(const pf of ['anger','apathy']){await hero(s,1600,1000,'profile='+pf,3.5,s+'-'+pf+'-1600.png');await hero(s,390,844,'profile='+pf,3.5,s+'-'+pf+'-390.png');await sheet(s,pf,1600,s+'-states-'+pf+'.png');}
   await hero(s,1600,1000,'profile=anger&trace=Anger',3.5,s+'-trace-1600.png');
   await hero(s,390,844,'profile=apathy&trace=Apathy',3.5,s+'-trace-390.png');
   await hero(s,1600,1000,'profile=apathy&tip=Teen',3.5,s+'-icons-1600.png');
   await strip(s,'anger',s+'-strip-1600.png',1600,1000);await strip(s,'apathy',s+'-strip-390.png',390,844);
   console.log('done',s);}
 }
 await browser.close();})();
