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
 /* the release moment, close up: a clip round the replayed ring at five instants, joined into one strip */
 async function strip(file,v){const T=[0,450,700,950,1400],frames=[];
  for(const t of T){const pg=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:3});
   pg.on('pageerror',e=>{bad++;console.log('PAGE ERROR',file,e.message);});
   await pg.goto('file://'+path.join(DIR,file)+'?p=1');await pg.waitForTimeout(250);
   await pg.evaluate(t=>window.__hold(t),t);await pg.waitForTimeout(60);
   const r=await pg.evaluate(()=>{const g=document.querySelector('.ar[data-id="'+P.last+'"]:not(.tick)');const b=g.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
   const buf=await pg.screenshot({clip:{x:r.x-60,y:r.y-60,width:120,height:120}});frames.push(buf.toString('base64'));await pg.close();}
  const q=await b.newPage({viewport:{width:1100,height:300}});
  await q.setContent('<body style="margin:0;background:#090A0E;display:flex;gap:8px;padding:12px;font:13px system-ui;color:#B4B0A8">'
   +frames.map((f,i)=>'<figure style="margin:0;text-align:center"><img width="200" height="200" src="data:image/png;base64,'+f+'"><figcaption style="margin-top:6px">'+T[i]+' ms</figcaption></figure>').join('')+'</body>');
  await q.screenshot({path:path.join(OUT,v+'-replay-strip.png'),fullPage:true});await q.close();}
 if(process.env.STRIP_ONLY){for(const f of FILES)await strip(f,f.slice(0,2));await b.close();process.exit(bad?1:0);}
 for(const f of FILES){const v=f.slice(0,2);
  await strip(f,v);
  for(const p of [0,1,2]){
   await shot(f,1600,1000,'p='+p,v+'-p'+p+'-1600.png');
   await shot(f,390,844,'p='+p,v+'-p'+p+'-390.png');}
  await shot(f,1600,1000,'p=1',v+'-p1-1600-full.png',true);
  for(const t of [0,450,800,1400])await shot(f,1600,1000,'p=1',v+'-replay-'+t+'ms-1600.png',false,t);
  for(const x of (EXTRA[v]||[]))await shot(f,x.w,x.h,x.q,v+'-'+x.n+'-'+x.w+'.png');
  console.log('done',f);}
 await b.close();if(bad){console.log(bad,'problems');process.exit(1);}})();
