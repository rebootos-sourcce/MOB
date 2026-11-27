/* shots.js. Real Chromium captures of the observatory. Run from the repo root with NODE_PATH at a playwright install.
     node mockups/layer-observatory/shots.js quick 1600 3.2 Derek "view=sab&mode=thread"   one frame to shots/quick.png
     node mockups/layer-observatory/shots.js all                                         every capture the contact sheet uses
   Frames are seeks, not recordings: the page is stepped at 60 Hz to the time asked and photographed, so a strip is exact
   and repeatable. Cost is read from a real-time run: script ms per frame, plus the gap between frames. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const D=__dirname,OUT=path.join(D,'shots');fs.mkdirSync(OUT,{recursive:true});
const url=q=>'file://'+path.join(D,'observatory.html')+(q?'?'+q:'');
const watch=(p,errs)=>{p.on('pageerror',e=>errs.push(String(e.message)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 p.on('request',r=>{const u=r.url();if(!u.startsWith('file:')&&!u.startsWith('data:'))errs.push('NETWORK '+u);});};
const launch=()=>chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const VP={1600:[1600,1000,1],390:[390,844,2]};
const ERR={};
async function open(b,w,q,seek,ctxOpts){
 const [vw,vh,dpr]=VP[w];const ctx=await b.newContext(Object.assign({viewport:{width:vw,height:vh},deviceScaleFactor:dpr},ctxOpts||{}));
 const p=await ctx.newPage();const errs=[];watch(p,errs);ERR[q+'@'+w]=errs;
 await p.goto(url(q+(seek!=null?'&seek='+seek:'')));await p.waitForTimeout(220);return {p:p,ctx:ctx};}
async function snap(b,name,w,q,seek,o){o=o||{};
 if(process.env.ONLY&&String(w)!==process.env.ONLY)return;
 const {p,ctx}=await open(b,w,q,seek);
 if(o.act)await o.act(p);
 await p.waitForTimeout(120);
 await p.screenshot({path:path.join(OUT,name+'.png'),fullPage:w<800&&!o.vp});
 if(w<800&&!o.vp){const bx=await (await p.$('#stage')).boundingBox();await p.screenshot({path:path.join(OUT,name+'-stage.png'),clip:{x:bx.x,y:bx.y,width:bx.width,height:Math.min(bx.height,1500)},fullPage:true});}
 await ctx.close();}
(async()=>{
 const b=await launch();
 const a=process.argv.slice(2);
 if(a[0]==='quick'){const [w,t,who,q]=[a[1],a[2],a[3],a[4]];await snap(b,'quick',+w,'p='+(who||'Derek')+(q?'&'+q:''),+t);console.log(ERR);await b.close();return;}
 const T=3.2;
 /* the people, settled, fetters view */
 for(const who of ['Marcus','Tomas','Sofia','Wren','Derek','Rosa'])await snap(b,'1600-'+who.toLowerCase()+'-fet',1600,'p='+who,T);
 /* the levels */
 for(const v of ['sab','cx','hy'])await snap(b,'1600-derek-'+v,1600,'p=Derek&view='+v,T);
 await snap(b,'1600-tomas-sab',1600,'p=Tomas&view=sab',T);
 await snap(b,'1600-sofia-hy',1600,'p=Sofia&view=hy',T);
 /* follow a thread */
 await snap(b,'1600-tomas-thread-sab',1600,'p=Tomas&view=sab&mode=thread&sel=s:Controller',T);
 await snap(b,'1600-tomas-thread-fet',1600,'p=Tomas&view=fet&mode=thread&sel=f:Apathy',T);
 await snap(b,'1600-derek-thread-hy',1600,'p=Derek&view=hy&mode=thread&sel=h:Dysregulation',T);
 /* scrub */
 for(const s of [3,6,9])await snap(b,'1600-tomas-scrub-'+s,1600,'p=Tomas&view=sab&mode=scrub&step='+s,T);
 await snap(b,'1600-derek-scrub-7',1600,'p=Derek&view=cx&mode=scrub&step=7',T);
 /* the lock */
 await snap(b,'1600-derek-lock-one',1600,'p=Derek&view=sab&plan=one',T);
 await snap(b,'1600-derek-lock-free',1600,'p=Derek&plan=free',T);
 await snap(b,'1600-derek-lock-tip',1600,'p=Derek&plan=one',T,{act:async p=>{await p.hover('.chip[data-v="2"]');await p.waitForTimeout(150);}});
 await snap(b,'1600-derek-tiers',1600,'p=Derek&plan=one',T,{act:async p=>{await p.hover('.chip[data-v="3"]');await p.waitForTimeout(100);await p.click('.tip .tip-go');await p.waitForTimeout(100);}});
 /* phone */
 await snap(b,'390-derek-fet',390,'p=Derek',T);
 await snap(b,'390-derek-sab',390,'p=Derek&view=sab',T);
 await snap(b,'390-derek-hy',390,'p=Derek&view=hy',T);
 await snap(b,'390-tomas-thread',390,'p=Tomas&view=sab&mode=thread&sel=s:Controller',T);
 await snap(b,'390-tomas-scrub',390,'p=Tomas&view=sab&mode=scrub&step=6',T);
 await snap(b,'390-derek-lock',390,'p=Derek&view=sab&plan=one',T);
 await snap(b,'390-derek-lock-tip',390,'p=Derek&plan=one',T,{vp:true,act:async p=>{await p.click('.chip[data-v="2"]',{force:true});await p.waitForTimeout(150);}});
 for(const who of ['Marcus','Sofia','Wren'])await snap(b,'390-'+who.toLowerCase()+'-fet',390,'p='+who,T);
 if(process.env.ONLY){await b.close();return;}
 /* strips: the stage only, at 0, 0.5, 1 and 2 s */
 for(const w of [1600,390]){
  const {p,ctx}=await open(b,w,'p=Derek&view=sab',0);
  const bx=await (await p.$('#stage')).boundingBox();
  for(const t of [0,.5,1,2]){await p.evaluate(t=>OBSC.seek(t),t);await p.waitForTimeout(60);
   await p.screenshot({path:path.join(OUT,w+'-strip-t'+String(t).replace('.','_')+'.png'),clip:bx});}
  await ctx.close();}
 /* reduced motion: the end state, drawn once, and no loop */
 const red={};
 for(const w of [1600,390]){
  const [vw,vh,dpr]=VP[w];const ctx=await b.newContext({viewport:{width:vw,height:vh},deviceScaleFactor:dpr,reducedMotion:'reduce'});
  const p=await ctx.newPage();const errs=[];watch(p,errs);
  await p.goto(url('p=Derek&view=sab'));await p.waitForTimeout(500);
  await p.screenshot({path:path.join(OUT,w+'-reduced.png'),fullPage:w<800});
  const n1=await p.evaluate(()=>OBSC.cost().n);await p.waitForTimeout(900);const n2=await p.evaluate(()=>OBSC.cost().n);
  red[w]={errors:errs,framesDrawnWhileIdle:n2-n1,reduced:await p.evaluate(()=>OBSC.reduced)};await ctx.close();}
 /* cost, real time, full and lite */
 const cost={};
 for(const [w,who] of [[1600,'Derek'],[1600,'Tomas'],[390,'Derek'],[390,'Tomas']]){
  for(const lite of [0,1]){
   const [vw,vh,dpr]=VP[w];const ctx=await b.newContext({viewport:{width:vw,height:vh},deviceScaleFactor:dpr});
   const p=await ctx.newPage();await p.goto(url('p='+who+'&view=sab'+(lite?'&lite=1':'')));await p.waitForTimeout(2600);
   await p.evaluate(()=>OBSC.resetCost());await p.waitForTimeout(4000);
   cost[w+'-'+who+(lite?'-lite':'')]=await p.evaluate(()=>OBSC.cost());await ctx.close();}}
 fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify({errors:ERR,reduced:red,cost:cost},null,1));
 console.log(JSON.stringify({reduced:red,cost:cost},null,1));
 const bad=Object.keys(ERR).filter(k=>ERR[k].length);console.log('pages with errors',bad);
 await b.close();
})();
