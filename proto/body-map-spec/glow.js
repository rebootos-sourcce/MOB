/* The glow, which is two glows, on the shipped Body page, Gordon, Fetters.
   Three states, drawn by style overrides in the page for the picture only.
   Nothing in atuned_src moves.
     1. As shipped.
     2. The aura behind him: its 40 px CSS blur removed, and the man opaque.
     3. And the heat field on him: its screen blend and SVG blur removed, so
        it sits on him rather than shining through him.
   It also times render to paint in each state (two frames after renderMap),
   median of 8, which is software raster in headless Chromium: the ratios hold,
   the absolute numbers run slow.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/body-map-spec/glow.js <build.html> */
const {chromium}=require('playwright');
const path=require('path');
const STATES=[
 ['shipped',''],
 ['aura',`.pm-aura{filter:none!important} .pm-vec path{fill:#16181f!important}`],
 ['field',`.pm-aura{filter:none!important} .pm-vec path{fill:#16181f!important}
   .pm-svg g[filter="url(#pmField)"]{mix-blend-mode:normal!important;filter:none!important;opacity:.55}`]];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+path.resolve(process.argv[2]));await p.waitForFunction(()=>typeof loadP==='function',null,{timeout:60000});
 await p.evaluate(()=>{const i=Math.max(0,PEOPLE.findIndex(q=>q.nm==='Gordon'));loadP(i);setTab(TAB.ENERGY);PMLAYER='bands';PMPICK=null;render();});
 await p.waitForTimeout(4500);
 await p.evaluate(()=>document.querySelectorAll('[id*=boot],.boot').forEach(e=>e.style.display='none'));
 const out={};
 for(const [k,css] of STATES){
  await p.evaluate(c=>{let s=document.getElementById('glowprobe');if(!s){s=document.createElement('style');s.id='glowprobe';document.head.appendChild(s);}s.textContent=c;},css);
  await p.waitForTimeout(300);
  await (await p.$('.pm-well')).screenshot({path:path.join(__dirname,'glow-'+k+'.png')});
  out[k]=await p.evaluate(async()=>{const R=compute();const two=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const t=[];for(let i=0;i<8;i++){const a=performance.now();renderMap(R);await two();t.push(performance.now()-a);}
   t.sort((x,y)=>x-y);return +t[4].toFixed(1);});}
 console.log(JSON.stringify({renderToPaintMs:out}));
 await b.close();})();
