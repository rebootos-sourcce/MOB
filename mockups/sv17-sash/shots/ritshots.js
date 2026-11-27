/* SV16 before and after shots of Flow > Ritual, from the real build.
   node ritshots.js <source.html> <outdir> <tag> */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const SRC=path.resolve(process.argv[2]), OUT=process.argv[3], TAG=process.argv[4]||'shot';
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const errs=[];
 for(const [W,H,HT] of [[1600,1000,2600],[390,844,0]]){
  for(const nm of ['Diane','James']){
   const p=await b.newPage({viewport:{width:W,height:H}});
   p.on('pageerror',e=>errs.push(W+' '+nm+': '+e.message));
   await p.goto('file://'+SRC+'?dev=1');
   await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}).catch(()=>{});
   await p.evaluate(n=>{const i=PEOPLE.findIndex(x=>x.nm===n); loadP(i); setTab(TAB.RITUAL); render&&render();},nm);
   await p.waitForTimeout(1600);
   await p.screenshot({path:`${OUT}/${TAG}-${nm}-${W}.png`});
   if(HT){await p.setViewportSize({width:W,height:HT}); await p.waitForTimeout(900);
    await p.screenshot({path:`${OUT}/${TAG}-${nm}-${W}-tall.png`});}
   else await p.screenshot({path:`${OUT}/${TAG}-${nm}-${W}-full.png`,fullPage:true});
   await p.close();}}
 await b.close();
 console.log(errs.length?'PAGE ERRORS\n'+errs.join('\n'):'no page errors');
})();
