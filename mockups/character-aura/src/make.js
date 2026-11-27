/* Renders every picture. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node mockups/character-aura/src/make.js [which] [outdir]
   which: quick (one hero per version, into outdir), one (a single page: sys query t out), all (the whole set into mockups/character-aura/shots) */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const ROOT=path.resolve(__dirname,'..');
const which=process.argv[2]||'quick';
const OUT=process.argv[3]||path.join(ROOT,'shots');
fs.mkdirSync(OUT,{recursive:true});
const SYS=['aura-1','aura-2','aura-3'];
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
async function open(file,w,h,query,dsf){const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:dsf||(w<700?2:1)});
 p.on('pageerror',e=>console.log('PAGEERR',file,e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',file,m.text());});
 await p.goto('file://'+path.join(ROOT,file+'.html')+'?manual=1&'+(query||''));await p.waitForTimeout(150);return p;}
async function hero(sys,w,h,query,t,out){const p=await open(sys,w,h,query);
 await p.evaluate(tt=>window.__step(tt),t);await p.waitForTimeout(120);await p.screenshot({path:path.join(OUT,out)});await p.close();}
async function sheet(sys,view,query,w,out){const p=await browser.newPage({viewport:{width:w,height:1000},deviceScaleFactor:1});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto('file://'+path.join(ROOT,'states-'+sys+'.html')+'?manual=1&view='+view+(query?'&'+query:''));await p.waitForTimeout(300);
 await p.evaluate(()=>window.__sheetStep(3.2));await p.waitForTimeout(150);await p.screenshot({path:path.join(OUT,out),fullPage:true});await p.close();}
/* a frame strip: the opening page at 0, 0.5, 1 and 2 seconds, stage only, joined into one picture */
async function strip(sys,query,out,w,h){const times=[0,.5,1,2];const frames=[];
 const p=await open(sys,w,h,query+'&rail=0');
 let at=0;for(const t of times){await p.evaluate(s=>window.__step(s),t-at);at=t;await p.waitForTimeout(80);
  const el=await p.$('#stk');const bb=await el.boundingBox();
  const clip=w<700?bb:{x:bb.x+bb.width*.17,y:bb.y+72,width:bb.width*.66,height:bb.height-72};
  const b=await p.screenshot({clip});frames.push(b.toString('base64'));}
 await p.close();
 const q=await browser.newPage({viewport:{width:1600,height:600},deviceScaleFactor:1});
 const html='<!doctype html><body style="margin:0;background:#0C0D12;display:flex;gap:4px;font:13px Inter,system-ui,sans-serif;color:#B4B0A8">'
  +frames.map((f,i)=>'<div style="position:relative;width:397px;flex:none;overflow:hidden"><img style="width:397px;display:block" src="data:image/png;base64,'+f+'"><span style="position:absolute;left:50%;transform:translateX(-50%);top:'+(w<700?78:10)+'px;background:rgba(12,13,18,.8);padding:3px 9px;border-radius:10px">'+(times[i]===1?'1 second':times[i]+' seconds')+'</span></div>').join('')+'</body>';
 await q.setContent(html);await q.waitForTimeout(300);
 const bb=await q.evaluate(()=>{const r=document.querySelector('body > div').getBoundingClientRect();return {h:Math.ceil(r.height)};});
 await q.setViewportSize({width:1600,height:bb.h});await q.screenshot({path:path.join(OUT,out),clip:{x:0,y:0,width:1600,height:bb.h}});await q.close();}
async function cost(sys,w,h,query){const p=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1});
 await p.goto('file://'+path.join(ROOT,sys+'.html')+'?'+(query||''));await p.waitForTimeout(5200);
 const r=await p.evaluate(()=>({n:window.__perf.n,avg:window.__perf.ms/window.__perf.n,max:window.__perf.max}));await p.close();return r;}
(async()=>{browser=await chromium.launch({executablePath:EXE});
 if(which==='quick'){for(const s of SYS)await hero(s,1600,1000,'profile=anger&mask=Preteen&coh=100',4,s+'-q.png');}
 if(which==='one'){const s=process.argv[4],q=process.argv[5]||'',t=+(process.argv[6]||4),w=+(process.argv[7]||1600),h=+(process.argv[8]||1000);await hero(s,w,h,q,t,process.argv[9]||(s+'-one.png'));}
 if(which==='sheet'){const s=process.argv[4],view=process.argv[5]||'ladder';await sheet(s,view,process.argv[6]||'',1600,s+'-sheet-'+view+'.png');}
 if(which==='cost'){for(const s of SYS){for(const c of['10','55','100']){const r=await cost(s,1600,1000,'profile=anger&mask=Preteen&coh='+c);console.log(s,'coh',c,'frames',r.n,'avg ms',r.avg.toFixed(2),'max',r.max.toFixed(1));}
   const m=await cost(s,390,844,'profile=anger&mask=Preteen&coh=100');console.log(s,'phone frames',m.n,'avg ms',m.avg.toFixed(2),'max',m.max.toFixed(1));}}
 if(which==='strips'){for(const s of SYS){await strip(s,'profile=anger&mask=Preteen&coh=100',s+'-strip-1600.png',1600,1000);await strip(s,'profile=apathy&mask=Teen&coh=100',s+'-strip-390.png',390,844);}}
 if(which==='all'){
  for(const s of SYS){
   /* beside the left menu: Tomas's own coherence is 31 percent, so the light matches the rail. The full spectrum one is the second picture. */
   await hero(s,1600,1000,'profile=anger&mask=Preteen&coh=31',4.5,s+'-beside-1600.png');
   await hero(s,1600,1000,'profile=anger&mask=Preteen&coh=100',4.5,s+'-beside-full-1600.png');
   await hero(s,1600,1000,'profile=anger&mask=Preteen&coh=10',4.5,s+'-coh10-1600.png');
   await hero(s,1600,1000,'profile=anger&mask=Adult&coh=100&rail=0',4.5,s+'-adult-1600.png');
   await hero(s,390,844,'profile=anger&mask=Preteen&coh=100',4.5,s+'-390.png');
   await hero(s,390,844,'profile=apathy&mask=Teen&coh=55',4.5,s+'-390-teen.png');
   await hero(s,1600,1000,'profile=anger&mask=Preteen&coh=100&trace=Anger',4.5,s+'-trace-1600.png');
   await hero(s,390,844,'profile=apathy&mask=Teen&coh=100&trace=Apathy',4.5,s+'-trace-390.png');
   await hero(s,1600,1000,'profile=apathy&mask=Child&coh=100&tip=Child',4.5,s+'-icons-1600.png');
   await sheet(s,'ladder','mask=Preteen',1600,s+'-ladder.png');
   await sheet(s,'masks','',1600,s+'-states.png');
   await strip(s,'profile=anger&mask=Preteen&coh=100',s+'-strip-1600.png',1600,1000);
   await strip(s,'profile=apathy&mask=Teen&coh=100',s+'-strip-390.png',390,844);
   console.log('done',s);}
 }
 await browser.close();})();
