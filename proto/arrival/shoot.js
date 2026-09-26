/* ============================================================
   WATCH THE ARRIVAL FRAME BY FRAME, AT EXACT TIMES, AND CHECK IT.

   A screenshot taken "about a second in" measures the machine. So every
   frame here is taken with every animation paused and set to a stated time,
   which is the only way two runs show the same picture.

     node proto/arrival/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/arrival/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'arrival.html');
fs.mkdirSync(OUT,{recursive:true});
let fails=0,passes=0;
const ok=(c,m)=>{if(c)passes++;else{fails++;console.log('  FAIL',m);}};
const W_ONLY=process.argv.includes('--wide');

(async()=>{
 const b=await chromium.launch();
 for(const [W,H] of (W_ONLY?[[1600,1000]]:[[1600,1000],[390,844]])){
  console.log('at',W);
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone,deviceScaleFactor:1});
  const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200));});
  await p.goto(PAGE);
  /* THE BOOT, frozen at stated times. The first load's own sheet. */
  await p.waitForTimeout(120);
  const boot=await p.evaluate(()=>{const e=document.getElementById('boot');
   if(!e)return null;const a=e.getAnimations({subtree:true});a.forEach(x=>x.pause());
   return {n:a.length,seats:[...e.querySelectorAll('.b-seat')].map(x=>getComputedStyle(x).fill),
    addr:e.querySelectorAll('.b-addr line').length,pal:Object.values(PAL)};});
  ok(!!boot,'the boot is up while the app loads');
  if(boot){
   ok(boot.seats.length===7,'seven .b-seat, got '+boot.seats.length);
   const rgb=h=>{const n=parseInt(h.slice(1),16);return 'rgb('+(n>>16&255)+', '+(n>>8&255)+', '+(n&255)+')';};
   const pal=boot.pal.map(rgb);
   ok(boot.seats.every(c=>pal.includes(c))&&new Set(boot.seats).size===7,'every seat a distinct PAL colour: '+boot.seats.join(' '));
   ok(boot.addr===108,'108 address ticks, got '+boot.addr);
   console.log('  boot animations',boot.n);
   await p.evaluate(()=>{const e=document.getElementById('boot');e.getAnimations({subtree:true}).forEach(x=>x.play());});}
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-ar-ready')==='1',null,{timeout:30000});
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});
  const gone=await p.evaluate(()=>!document.getElementById('boot'));
  ok(gone,'the boot is removed from the document');
  /* the filmstrip, through the prototype's own replay, whose scrubber holds
     the product's floor off while a frame is held */
  const bootFilm=async(which,T,tag)=>{
   await p.evaluate(w=>document.querySelector('#ar-opts [data-ar-boot="'+w+'"]').click(),which);
   await p.waitForTimeout(30);
   for(const t of T){
    await p.evaluate(({t,which})=>{const rg=document.querySelector('#ar-opts .ar-scrub input');
     const L=which==='next'?5240:7260;rg.value=String(Math.round(t*1000/L*1000));
     rg.dispatchEvent(new Event('input'));},{t,which});
    await p.waitForTimeout(40);
    await p.screenshot({path:path.join(OUT,tag+'-'+W+'-'+t.toFixed(2)+'.png')});}
   await p.evaluate(()=>document.querySelector('#ar-opts [data-ar-play]').click());
   await p.waitForFunction(()=>!document.getElementById('boot'),null,{timeout:12000});};
  await bootFilm('next',[0.5,0.9,1.3,1.7,1.9,2.1,2.3,2.5,2.7,3.0,3.4,4.2,4.62,4.8,5.1],'boot');
  await bootFilm('shipped',[1.0,2.0,3.0,4.2],'shipped');

  /* THE DIAL, frozen. The arrival starts as the sheet fades, so it is either
     running or done by now; play it again and freeze it. */
  const frames=async(view,T)=>{
   await p.evaluate(v=>{fviewSet(v);},view);
   await p.waitForTimeout(1600);
   await p.evaluate(()=>{document.querySelector('#ar-opts [data-ar-replay]').click();});
   await p.waitForFunction(()=>{const s=__AR();return s.A&&s.A.ready;},null,{timeout:5000});
   const info=await p.evaluate(()=>{const s=__AR();return {n:s.A.anims.length,total:Math.round(s.A.total),raster:s.A.rasterMs};});
   console.log('  '+view+' arrival',JSON.stringify(info));
   ok(info.n>5,view+' arrival has animations, '+info.n);
   for(const t of T){
    await p.evaluate(({t,L})=>{const rg=document.querySelector('#ar-opts .ar-scrub input');
     rg.value=String(Math.round(Math.min(t,L)/L*1000));rg.dispatchEvent(new Event('input'));},{t,L:info.total});
    await p.waitForTimeout(60);
    const el=await p.$('#frend');
    const bx=await el.boundingBox();
    await p.screenshot({path:path.join(OUT,view+'-'+W+'-'+String(t).padStart(4,'0')+'.png'),
     clip:phone?{x:0,y:Math.max(0,bx.y-10),width:W,height:Math.min(bx.height+20,H)}:{x:bx.x-10,y:bx.y-10,width:bx.width+20,height:bx.height+20}});}
   /* then let it finish and check the picture is exactly the shipped one */
   await p.evaluate(()=>document.querySelector('#ar-opts [data-ar-play]').click());
   await p.waitForTimeout(2200);
   const st=await p.evaluate(()=>{const f=document.getElementById('frend'),s=f.querySelector('svg');
    return {over:document.querySelectorAll('.ar-over').length,op:s.style.opacity,
     anim:f.getAnimations({subtree:true}).length,A:!!__AR().A};});
   ok(st.over===0&&st.op===''&&st.anim===0&&!st.A,view+' leaves nothing behind: '+JSON.stringify(st));
   await p.screenshot({path:path.join(OUT,view+'-'+W+'-end.png')});};
  await frames('dial',[0,60,140,220,300,380,460,540,620,700,820,1000,1200]);
  await frames('frames',[0,60,140,220,300,380,460,540,620,700,820,1000,1200]);

  /* FRAME RATE while the Dial arrives, at real time, on this machine */
  await p.evaluate(()=>fviewSet('wheel'));await p.waitForTimeout(300);
  for(const v of ['dial','frames']){
   await p.evaluate(()=>fviewSet('wheel'));await p.waitForTimeout(400);
   const fps=await p.evaluate(v=>new Promise(res=>{fviewSet(v);let n=0,t0=performance.now(),worst=0,last=t0,fr=[];
    function f(t){n++;fr.push(Math.round(t-last));worst=Math.max(worst,t-last);last=t;if(t-t0<1400)requestAnimationFrame(f);
     else res({fps:n/((t-t0)/1000),worst:worst,fr:fr.join(' ')});}
    requestAnimationFrame(f);}),v);
   console.log('  '+v+' arrival',fps.fps.toFixed(1),'fps, worst frame',fps.worst.toFixed(1),'ms |',fps.fr);
   await p.waitForTimeout(1500);}
  await p.waitForTimeout(1500);
  const idle=await p.evaluate(()=>new Promise(res=>{let n=0,t0=performance.now();
   function f(t){n++;if(t-t0<1000)requestAnimationFrame(f);else res(n/((t-t0)/1000));}requestAnimationFrame(f);}));
  console.log('  dial at rest',idle.toFixed(1),'fps');
  ok(errs.length===0,'no errors: '+errs.join(' | '));
  await ctx.close();}
 await b.close();
 console.log(passes+' passed, '+fails+' failed');
 process.exit(fails?1:0);})();
