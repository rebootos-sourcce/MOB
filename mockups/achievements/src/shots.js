/* Renders the pictures. Run from the repo root, under the shared browser lock:
     flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
       PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/achievements/src/shots.js [v1,v2] [outdir]
   For each version: the three demo people at 1600 by 1000 and 390 by 844, the release moment
   held at four instants, and whatever extra states the version names in EXTRA. It also fails on
   any page error and on any request that leaves the file. */
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const DIR=path.resolve(__dirname,'..');
const pick=(process.argv[2]||'v1,v2,v3,v4').split(',');
const OUT=process.argv[3]||path.join(DIR,'shots');fs.mkdirSync(OUT,{recursive:true});
const FILES=fs.readdirSync(DIR).filter(f=>/^v\d-.*\.html$/.test(f)&&pick.some(p=>f.startsWith(p+'-')));
const EXTRA={v1:[{q:'p=1&open=1',w:390,h:844,n:'sheet-open'}]};
let bad=0;
(async()=>{const b=await chromium.launch();
 async function shot(file,w,h,q,name,full,hold){
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:w<700?2:1});
  pg.on('pageerror',e=>{bad++;console.log('PAGE ERROR',file,q,e.message);});
  pg.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:')){bad++;console.log('NETWORK',file,r.url());}});
  await pg.goto('file://'+path.join(DIR,file)+'?'+q);await pg.waitForTimeout(250);
  if(hold!==undefined){await pg.evaluate(t=>window.__hold(t),hold);await pg.waitForTimeout(60);}
  await pg.screenshot({path:path.join(OUT,name),fullPage:!!full});await pg.close();}
 for(const f of FILES){const v=f.slice(0,2);
  for(const p of [0,1,2]){
   await shot(f,1600,1000,'p='+p,v+'-p'+p+'-1600.png');
   await shot(f,390,844,'p='+p,v+'-p'+p+'-390.png');}
  await shot(f,1600,1000,'p=1',v+'-p1-1600-full.png',true);
  for(const t of [0,450,800,1400])await shot(f,1600,1000,'p=1',v+'-replay-'+t+'ms-1600.png',false,t);
  for(const x of (EXTRA[v]||[]))await shot(f,x.w,x.h,x.q,v+'-'+x.n+'-'+x.w+'.png');
  console.log('done',f);}
 await b.close();if(bad){console.log(bad,'problems');process.exit(1);}})();
