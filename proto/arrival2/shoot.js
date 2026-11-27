/* ============================================================
   WATCH THE FOUR ARRIVALS FRAME BY FRAME, AND TIME THEM.

   Frames are taken with every animation on the sheet paused and set to a
   stated time, through the prototype's own scrubber, so two runs show the
   same picture. The frame rate is measured separately, in real time, at
   1x, from requestAnimationFrame between 0.8s and 4.5s, the part that moves.

     node proto/arrival2/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/arrival2/shoot.js [page] [--fps-only] [--wide]
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const arg=process.argv.slice(2).filter(a=>!a.startsWith('--'))[0];
const PAGE='file://'+path.resolve(arg||path.join(__dirname,'arrival2.html'));
const FPS_ONLY=process.argv.includes('--fps-only'), WIDE=process.argv.includes('--wide');
fs.mkdirSync(OUT,{recursive:true});
let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('  FAIL',m);}};
const VS=['breath','orrery','bloom','ember','liked'];
const T=[0.5,0.9,1.3,1.6,1.8,2.0,2.2,2.5,2.8,3.2,3.6,4.2,4.6,4.8];
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor(p*s.length))];};

(async()=>{
 const b=await chromium.launch();
 for(const [W,H] of (WIDE?[[1600,1000]]:[[1600,1000],[390,844]])){
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200));});
  await p.goto(PAGE);
  /* THE FIRST LOAD. The sheet is up while the app loads, drawing. */
  await p.waitForFunction(()=>!!document.getElementById('boot'),null,{timeout:15000});
  await p.waitForTimeout(2300);
  const lit=await p.evaluate(()=>{const c=document.querySelector('#boot .vx-cv');if(!c)return -1;
   const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>20)n++;return n;});
  ok(lit>500,'the first load draws: '+lit+' lit pixels at about 2.3s');
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-vx-ready')==='1',null,{timeout:30000});
  await p.waitForFunction(()=>document.body.classList.contains('booted')&&!document.getElementById('boot'),null,{timeout:12000});
  console.log('at',W,'first load: drew',lit,'lit pixels, sheet removed, booted');
  for(const v of VS){
   if(!FPS_ONLY){
    for(const t of T){
     await p.evaluate(({v,t})=>{const C=__VXC();if(C.P.v!==v||!C.SHEET)C.play(v);C.seek(t*1000);},{v,t});
     await p.waitForTimeout(60);
     await p.screenshot({path:path.join(OUT,v+'-'+W+'-'+t.toFixed(2)+'.png')});}}
   /* real time, at 1x */
   await p.evaluate(v=>{window.__gaps=[];const C=__VXC();C.play(v);let last=0,t0=performance.now();
    (function f(ts){const el=document.getElementById('boot');if(!el)return;
     const a=el.getAnimations().find(x=>x.animationName==='bootOut');const t=a&&a.currentTime!=null?a.currentTime/1000:0;
     if(last&&t>.8&&t<4.5)window.__gaps.push(ts-last);last=ts;requestAnimationFrame(f);})(t0);},v);
   await p.waitForFunction(()=>!document.getElementById('boot'),null,{timeout:12000});
   const r=await p.evaluate(v=>{const s=v!=='liked'&&window.VX&&VX.last();return {gaps:window.__gaps,draw:s&&s.stats?s.stats.draw:[]};},v);
   const g=r.gaps,mean=g.reduce((a,x)=>a+x,0)/g.length;
   const dr=r.draw.length?r.draw.reduce((a,x)=>a+x,0)/r.draw.length:0;
   console.log('  '+v.padEnd(7)+' '+(1000/mean).toFixed(1)+' fps mean, median frame '+pct(g,.5).toFixed(1)
    +'ms, 95th '+pct(g,.95).toFixed(1)+'ms, worst '+Math.max(...g).toFixed(1)+'ms'
    +(r.draw.length?', canvas draw '+dr.toFixed(2)+'ms mean, '+pct(r.draw,.95).toFixed(2)+'ms 95th, '+Math.max(...r.draw).toFixed(2)+'ms worst':''));
   ok(g.length>30,v+' measured '+g.length+' frames');}
  ok(errs.length===0,'no page errors at '+W+': '+errs.join(' | '));
  await ctx.close();}
 await b.close();
 console.log(fails?fails+' FAILED':'all checks pass');
 process.exit(fails?1:0);
})();
