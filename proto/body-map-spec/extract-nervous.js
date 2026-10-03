/* Pull the two figures out of the approved FW nervous-system mockup, option A
   (proto/fw/out/nervous.html, commit b5bc701), so the merged plate is drawn
   on the figure he locked in on 27 September rather than a redraw of it.
   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/body-map-spec/extract-nervous.js */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+path.resolve(__dirname,'../fw/out/nervous.html'));await p.waitForTimeout(1500);
 const svgs=await p.evaluate(()=>[...document.querySelectorAll('svg')].filter(s=>s.getBoundingClientRect().width>200)
  .map(s=>({vb:s.getAttribute('viewBox'),inner:s.innerHTML,css:[...document.styleSheets].map(ss=>{try{return [...ss.cssRules].map(r=>r.cssText).join('\n')}catch(e){return ''}}).join('\n')})));
 fs.writeFileSync(path.join(__dirname,'nervous-figures.json'),JSON.stringify({src:'proto/fw/out/nervous.html, option A',views:['front','back'],svgs:svgs.map(s=>({vb:s.vb,inner:s.inner})),css:svgs[0]?svgs[0].css:''}));
 console.log(svgs.length,svgs.map(s=>s.inner.length));await b.close();})();
