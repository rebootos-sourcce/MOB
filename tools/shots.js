/* Screenshot harness. Renders source.html in a real Chromium at a given
   viewport and writes one PNG per tab, plus optional persona and depth.
   Run from the repo root:  node tools/shots.js [outdir] [width] [height] */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots';
const W=+(process.argv[3]||1600), H=+(process.argv[4]||1000);
const TABS=[['story',0],['summary',1],['field',2],['energy',3],['analytics',4]];
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:W,height:H}});
 const errs=[];
 p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+path.resolve('source.html'));
 await p.waitForTimeout(1200);
 for(const [nm,i] of TABS){
  await p.evaluate(t=>{setTab(t);render&&render();},i);
  await p.waitForTimeout(700);
  await p.screenshot({path:`${OUT}/${W}-${nm}.png`,fullPage:false});
 }
 /* a loaded field reads differently from an empty one */
 await p.evaluate(()=>{loadP(3);setTab(2);render&&render();});
 await p.waitForTimeout(800);
 await p.screenshot({path:`${OUT}/${W}-field-loaded.png`});
 await p.evaluate(()=>{S.theme='light';document.documentElement.setAttribute('data-theme','light');render&&render();});
 await p.waitForTimeout(600);
 await p.screenshot({path:`${OUT}/${W}-light.png`});
 console.log('wrote '+(TABS.length+2)+' shots to '+OUT+(errs.length?'  JS ERRORS: '+errs.join(' | '):'  no JS errors'));
 await b.close();
})();
