/* The Body page itself, on the reference profiles, at both widths.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/anatomy-ref/shots.js [build.html] [tag]
   Writes out/<tag>-<width>-<profile>.png. Waits for the boot sheet to clear
   the way every gate does (CP: a fixed wait photographed the boot logo). */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');
const SRC=path.resolve(process.argv[2]||path.join(ROOT,'source.html'));
const TAG=process.argv[3]||'now';
const OUT=path.join(__dirname,'out');
const WHO=[[13,'gordon'],[8,'ana']];
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<600?2:1});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+SRC);
  try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
  for(const [i,nm] of WHO){
   await p.evaluate(i=>{loadP(i);setTab(TAB.ENERGY);PMLAYER='bands';PMPICK=null;render();},i);
   await p.waitForTimeout(700);
   const el=await p.$('#emap');
   const file=path.join(OUT,`${TAG}-${w}-${nm}.png`);
   if(w<600&&el)await el.screenshot({path:file}); else await p.screenshot({path:file});
   console.log('wrote',path.relative(ROOT,file));}
  if(errs.length)console.log('page errors at',w,errs);
  await p.close();}
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
