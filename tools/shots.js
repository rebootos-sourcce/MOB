/* Screenshot harness. Renders source.html in a real Chromium at a given
   viewport and writes one PNG per tab, plus optional persona and depth.
   Run from the repo root:  node tools/shots.js [outdir] [width] [height] */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots';
const W=+(process.argv[3]||1600), H=+(process.argv[4]||1000);
/* THE LIST WAS FIVE AND THE PRODUCT HAS TEN SURFACES. Settings is integer 9
   and is not in TABDEF, so it was never shot, which made the account area the
   one surface whose first reviewer was the owner. Intake, knowledge, compass
   and settings are added; the integers are identity and are never renumbered,
   so they are written out rather than derived from a position. */
const TABS=[['story',0],['summary',1],['field',2],['energy',3],['analytics',4],
 ['intake',5],['knowledge',6],['compass',8],['settings',9]];
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
 /* The light theme is 'snow', and switching it needs three things done
    together: S.theme, a body.snow class, and rebuildSwatches(). They exist
    only inside the button's click handler, so there is no applyTheme() to
    call. Clicking the real control is therefore the only honest capture.
    Setting S.theme alone leaves the palette dark, and the first version of
    this harness wrote that to disk as the light theme. The assert below
    fails the run rather than shipping the lie again. */
 const bg=()=>p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
 const darkPx=await bg();
 const clicked=await p.evaluate(()=>{
  const b=[...document.querySelectorAll("#themes button")].find(x=>/snow/i.test(x.getAttribute("aria-label")||x.textContent));
  if(!b)return false; b.click(); return true;});
 if(!clicked){console.error('no snow button found in #themes');process.exit(1);}
 await p.waitForTimeout(800);
 const lightPx=await bg();
 if(darkPx===lightPx){console.error('theme did not change: body stayed '+darkPx);process.exit(1);}
 await p.waitForTimeout(600);
 await p.screenshot({path:`${OUT}/${W}-snow.png`});
 console.log('wrote '+(TABS.length+2)+' shots to '+OUT+'  dark '+darkPx+' -> snow '+lightPx+(errs.length?'  JS ERRORS: '+errs.join(' | '):'  no JS errors'));
 await b.close();
})();
