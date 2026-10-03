/* Counts what is visible and interactive on the Compass at the first screen, at 1600 and at 390.
   Run from the repo root: NODE_PATH=/opt/node22/lib/node_modules node mockups/compass-overlays/count-controls.js source.html
   Read off the run on 1 October: before 16 and 11 controls on the surface, 1 reading pill each;
   after 17 and 11, with 10 and 4 pills. The shell and the rails count the same on both sides. */
const {chromium}=require('playwright');const path=require('path');
const FILE=path.resolve(process.argv[2]);
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  await p.goto('file://'+FILE+'?dev=1');
  try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
  await p.waitForTimeout(300);
  await p.evaluate(()=>{loadP(3);setTab(8);render();});
  await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{
   const SEL='button,a[href],input:not([type=hidden]),select,textarea,[role=button],[tabindex]:not([tabindex="-1"]),summary';
   const vis=el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    if(cs.visibility==='hidden'||cs.display==='none'||!r.width||!r.height)return false;
    // clipped by a hidden-overflow ancestor?
    return r.bottom>0&&r.top<innerHeight-2&&r.right>0&&r.left<innerWidth;};
   const all=[...document.querySelectorAll(SEL)].filter(vis);
   const stage=[...document.querySelectorAll('#cone '+SEL.split(',').join(',#cone '))].filter(vis);
   const chrome=all.filter(e=>!e.closest('#cone'));
   // visible numbers printed as readings inside the surface
   const nums=[...document.querySelectorAll('#cone .fb-v')].filter(vis).length;
   const words=(document.getElementById('cone').innerText||'').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).length;
   return {firstScreenControlsTotal:all.length,onTheCompassSurface:stage.length,shellAndRails:chrome.length,readingPills:nums,wordsPrintedOnSurface:words};});
  console.log(`${W}x${H}`,JSON.stringify(r));
  await p.close();}
 await b.close();})();
