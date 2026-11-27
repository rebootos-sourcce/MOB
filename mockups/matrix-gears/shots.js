/* shots.js. Real Chromium captures of the six mockups. Run from the repo root with NODE_PATH at a playwright install.
     node mockups/matrix-gears/shots.js all            every page: 1600 and 390, strips, people, reduced motion, cost
     node mockups/matrix-gears/shots.js quick m1 1600 2 Tomas     one frame to shots/quick.png, to look at
   Strips are seeks, not recordings: the page is stepped at 60 Hz to 0, 0.5, 1 and 2 s and photographed, so
   a strip is exact and repeatable. Cost is read from a real-time run: script ms per frame, plus the gap between frames. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const D=__dirname,OUT=path.join(D,'shots');fs.mkdirSync(OUT,{recursive:true});
const IDS=['m1','m2','m3','g1','g2','g3'];
const url=(id,q)=>'file://'+path.join(D,id+'.html')+(q?'?'+q:'');
const watch=(p,errs)=>{p.on('pageerror',e=>errs.push(String(e.message)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 p.on('request',r=>{const u=r.url();if(!u.startsWith('file:')&&!u.startsWith('data:'))errs.push('NETWORK '+u);});};
const launch=()=>chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
(async()=>{
 const b=await launch();
 if(process.argv[2]==='quick'){
  const [id,w,t,who]=process.argv.slice(3);const errs=[];
  const p=await b.newPage({viewport:{width:+w,height:+w>800?1000:844},deviceScaleFactor:+w>800?1:2});watch(p,errs);
  await p.goto(url(id,'seek='+t+(who?'&p='+who:'')));await p.waitForTimeout(300);
  await p.screenshot({path:path.join(OUT,'quick.png')});console.log(id,w,t,who||'Marcus','errors',errs);await b.close();return;}
 const report={};
 const only=process.argv[3]?process.argv.slice(3):IDS;
 for(const id of only){
  const R=report[id]={};
  for(const [w,h,dpr] of [[1600,1000,1],[390,844,2]]){
   const errs=[];const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr});watch(p,errs);
   await p.goto(url(id,'seek=3.2'));await p.waitForTimeout(250);
   await p.screenshot({path:path.join(OUT,id+'-'+w+'.png')});
   /* the strip: the stage only, at 0, 0.5, 1, 2 s */
   const box=await (await p.$('#stage')).boundingBox();
   for(const t of [0,.5,1,2]){
    await p.evaluate(t=>MGC.seek(t),t);await p.waitForTimeout(60);
    await p.screenshot({path:path.join(OUT,id+'-'+w+'-t'+String(t).replace('.','_')+'.png'),clip:box});}
   /* each person, settled */
   if(w===1600){
    for(const who of ['Marcus','Tomas','Wren','Rosa']){
     await p.evaluate(([t,who])=>{MGC.seek(t);MGC.who(who);},[3.2,who]);await p.waitForTimeout(60);
     await p.screenshot({path:path.join(OUT,id+'-who-'+who+'.png'),clip:box});}}
   R['errors'+w]=errs;await p.close();
   /* real time cost: a fresh page, let it settle through the entrance, then read the meter */
   const e2=[];const q=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dpr});watch(q,e2);
   await q.goto(url(id));await q.waitForTimeout(2500);await q.evaluate(()=>MGC.resetCost());await q.waitForTimeout(4000);
   R['cost'+w]=await q.evaluate(()=>MGC.cost());
   /* and one more time through a hover, because a pointer redraws */
   await q.close();}
  /* reduced motion: the end state, drawn once, and no loop */
  const e3=[];const ctx=await b.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});const r=await ctx.newPage();watch(r,e3);
  await r.goto(url(id));await r.waitForTimeout(500);
  const bx=await (await r.$('#stage')).boundingBox();
  await r.screenshot({path:path.join(OUT,id+'-reduced.png'),clip:bx});
  const g1=await r.evaluate(()=>MGC.cost().n);await r.waitForTimeout(800);const g2=await r.evaluate(()=>MGC.cost().n);
  R.reduced={errors:e3,framesDrawnInIdle:g2-g1};await ctx.close();
  console.log(id,JSON.stringify(R));}
 fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,1));
 await b.close();
})();
