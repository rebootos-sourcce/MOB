/* Screenshots of the real Practitioner page (round PT), client list and one
   client's panel open, at 1600 and 390. Run from the repo root:
   NODE_PATH=<playwright install> node tools/prac-shots.js OUTDIR */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'mockups/practitioner-real';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const booted=async p=>{try{await p.waitForFunction(
 ()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
/* fullPage:true measures the outer document, but this product's own body is
   the scroll container (overflow:auto, height pinned near 100vh) and not
   documentElement, the shape tools/shots.js already works around by never
   asking for fullPage at all. The first pass here used fullPage:true and
   every shot under about 850px of body scroll came back blank: real, in the
   PNG, and not a product bug, caught by reading computed styles rather than
   trusting the picture. The fix is the same one shots.js already took: a
   tall fixed viewport and a plain screenshot, so body never has to scroll
   to show what is on the page. */
(async()=>{
fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch({executablePath:CHROME});
for(const [w,h] of [[1600,2000],[390,2100]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto('file://'+path.resolve('source.html')+'?dev=1',{waitUntil:'load'});
 await booted(p); await p.waitForTimeout(500);
 await p.evaluate(()=>{pracSwitch(true); setTab(TAB.PRACTITIONER);});
 await p.waitForTimeout(250);
 await p.screenshot({path:`${OUT}/${w}-clients-list.png`});
 const i=await p.evaluate(()=>PEOPLE.findIndex(x=>x.nm==='Wren'));
 await p.evaluate(ix=>document.querySelector('#prac [data-pri="'+ix+'"]').click(),i);
 await p.waitForTimeout(250);
 await p.screenshot({path:`${OUT}/${w}-wren-open.png`});
 await p.close();
}
await b.close();
console.log('wrote shots to',OUT);
})();
