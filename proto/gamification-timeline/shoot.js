/* Screenshots of the gamification timeline at 1600 and 390, with page errors,
   outbound requests and sideways scroll counted. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/gamification-timeline/shoot.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs');
const D=__dirname, OUT=path.join(D,'shots'); fs.mkdirSync(OUT,{recursive:true});
const F='file://'+path.join(D,'gamification-timeline-packed.html');
const SHOTS=[['d00-moment-one','who=Marcus&cad=model&d=0'],['d07-marcus','who=Marcus&cad=model&d=7'],
 ['d30-marcus','who=Marcus&cad=model&d=30'],['d90-marcus','who=Marcus&cad=model&d=90'],
 ['d90-twice','who=Marcus&cad=twice&d=90'],['d03-derek-grace','who=Derek&cad=twice&d=3'],
 ['d90-gordon-gap','who=Gordon&cad=model&d=90'],['d90-derek-daily','who=Derek&cad=daily&d=90']];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let errs=0, reqs=0;
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const [nm,hash] of SHOTS){const p=await b.newPage({viewport:{width:W,height:H}});
   p.on('pageerror',e=>{errs++;console.log('error',nm,W,e.message);});
   p.on('console',m=>{if(m.type()==='error'){errs++;console.log('console',nm,W,m.text());}});
   p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))reqs++;});
   await p.goto(F+'#'+hash);await p.waitForTimeout(1500);
   /* the interactive half, from the controls down */
   const y=await p.evaluate(()=>{const c=document.getElementById('ctl');return c?c.getBoundingClientRect().top+scrollY:0;});
   await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(200);
   await p.screenshot({path:path.join(OUT,nm+'-'+W+'.png')});
   if(nm==='d30-marcus')await p.screenshot({path:path.join(OUT,nm+'-'+W+'-full.png'),fullPage:true});
   const sw=await p.evaluate(()=>document.documentElement.scrollWidth);
   if(sw>W)console.log('sideways scroll',nm,W,sw);
   await p.close();}}
 console.log('errors',errs,'outbound requests',reqs);await b.close();})();
