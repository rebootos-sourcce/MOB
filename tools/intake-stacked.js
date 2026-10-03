/* The stacked Intake, as pictures and as a length. Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tools/intake-stacked.js OUTDIR
   Draws the Intake page with every block present, on a stranger and on a loaded
   worked example (Marcus, loadP(3), with answers put into the three blocks so
   a lead, a tie and a half answered block all show), at 1600 and at 390. Each
   case is one tall picture of the page's own body, and the three stacked
   blocks are cut out of it on their own, because a picture three thousand
   pixels tall is shrunk to nothing on the way to a person's eyes.

   And it prints the length: the host's height in pixels, in screens of the
   viewport, and how much of that the three blocks add, so "the stacked page
   runs long" is a number read off the run and not a feeling. The answers it
   puts in go through ixSet, the function the page's own press calls. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=process.argv[2]||'shots';
const SRC=process.env.SRC?path.resolve(process.env.SRC):path.resolve('source.html');
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const res={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const who of ['stranger','loaded']){
   const p=await b.newPage({viewport:{width:W,height:H}});
   const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
   await p.goto('file://'+SRC+'?dev=1');
   await booted(p); await p.waitForTimeout(500);
   await p.evaluate(who==='loaded'?'loadP(3)':'void 0');
   /* three different reads on the loaded case: archetypes a tie at the top,
      the axes one clear lead, and the actions part answered */
   if(who==='loaded')await p.evaluate(()=>{
    ARCH.forEach((a,i)=>ixSet(CURP,'arch',a.nm,a.nm==='Sage'||a.nm==='Rebel'?9:(i*3)%6));
    CHARGES.forEach((c,i)=>ixSet(CURP,'axes',c,c==='Anger'?8:(i*2)%5));
    ['aware','detach','intent'].forEach((k,i)=>ixSet(CURP,'acts',k,4+i));});
   await p.evaluate('IQ_VIEW="list";IQ_OPEN=null;if(typeof IQ_SEAT!=="undefined")IQ_SEAT=null;setTab(13);render();'
    +(W>=1200?'document.body.classList.toggle("lshut",false);':''));
   await p.waitForTimeout(900);
   const m=await p.evaluate(()=>{
    const host=document.getElementById('iqbody'), x=document.getElementById('iqx-arch');
    const last=document.getElementById('iqx-acts'), hr=host.getBoundingClientRect();
    const top=x.getBoundingClientRect().top-hr.top, end=last.getBoundingClientRect().bottom-hr.top;
    return {host:Math.round(host.scrollHeight), vh:innerHeight, blocksFrom:Math.round(top),
     blocks:Math.round(end-top), questions:document.querySelectorAll('#iqbody .iqx .iq-sl').length,
     scrollW:document.documentElement.scrollWidth, vw:innerWidth};});
   m.screens=Math.round(m.host/m.vh*10)/10; m.blocksScreens=Math.round(m.blocks/m.vh*10)/10;
   /* a tall viewport so the page's own scroll column shows all of its body */
   await p.setViewportSize({width:W,height:Math.min(9000,Math.ceil(m.host+420))});
   await p.waitForTimeout(700);
   const box=await p.evaluate(()=>{const r=document.getElementById('iqbody').getBoundingClientRect();
    const a=document.getElementById('iqx-arch').getBoundingClientRect(), z=document.getElementById('iqx-acts').getBoundingClientRect();
    return {x:r.left,y:r.top,w:r.width,h:r.height,a:a.top,z:z.bottom};});
   m.pageWide=Math.round(box.w);
   await p.screenshot({path:`${OUT}/${who}-${W}-page.png`,clip:{x:box.x,y:box.y,width:box.w,height:Math.min(box.h,8500)}});
   const sliceH=W>=1200?1100:1500, n=Math.ceil((box.z-box.a)/sliceH);
   for(let i=0;i<n;i++){
    const y=box.a+i*sliceH;
    await p.screenshot({path:`${OUT}/${who}-${W}-stack-${i+1}.png`,clip:{x:box.x,y,width:box.w,height:Math.min(sliceH,box.z-y+16)}});}
   m.slices=n; res[who+'-'+W]=m;
   if(errs.length)res[who+'-'+W].errors=errs;
   await p.close();}}
 console.log(JSON.stringify(res,null,1));
 await b.close();
})();
