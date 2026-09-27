/* Screenshots of the golden masks at 1600 and 390, with console errors
   counted. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/masks/golden/shoot.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs');
const D=__dirname, OUT=path.join(D,'shots'); fs.mkdirSync(OUT,{recursive:true});
const F='file://'+path.join(D,'masks-golden-packed.html');
const SHOTS=[['rev-today','mode=rev&who=Derek&m=Child&t=0'],['rev-month','mode=rev&who=Derek&m=Child&t=30'],
 ['rev-6mo-monthly','mode=rev&who=James&m=Professional&t=182&cad=month'],['six','mode=six&who=Derek'],['build','mode=build&who=Derek']];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let errs=0, reqs=0;
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const [nm,hash] of SHOTS){const p=await b.newPage({viewport:{width:W,height:H}});
   p.on('pageerror',e=>{errs++;console.log('error',nm,W,e.message);});
   p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:'))reqs++;});
   await p.goto(F+'#'+hash);await p.waitForTimeout(1600);
   await p.screenshot({path:path.join(OUT,nm+'-'+W+'.png'),fullPage:W<500&&nm!=='rev-today'?false:false});
   if(nm==='rev-today'){await p.screenshot({path:path.join(OUT,nm+'-'+W+'-full.png'),fullPage:true});}
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
   if(sw>W)console.log('sideways scroll',nm,W,sw);
   await p.close();}}
 console.log('errors',errs,'outbound requests',reqs);await b.close();})();
