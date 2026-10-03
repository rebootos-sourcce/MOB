/* THE WELCOME STEP'S MOTION, MEASURED, round QI. tools/obskin-motion.js walks
   the whole run; this looks at the one step the owner graded "a D-" and
   reports it three ways, because a still cannot show motion and a picture of
   motion can still flatter it:

     frames-W/       the arrival through the real door (Guest), frame exact at
                     40ms, then two whole breaths at rest at 80ms on the same
                     frozen clock, then the "Come in" hand off at 40ms.
                     Frozen by playbackRate 0 and seeked, as obskin-motion.js
                     does and for the reason it records. JPEG, so two breaths
                     at 1600 do not cost a few hundred megabytes of disk.
     timeline-W.tsv  the same frames as numbers: the computed opacity and
                     scale of every layer that moves, so "nothing moves at
                     rest" or "everything arrives at once" is a column a
                     person can read, not a judgement about a picture.
     walk-W.webm     real time, door to Ask, as the browser played it.

     NODE_PATH=/opt/node22/lib/node_modules node tools/obwelcome-motion.js OUT
*/
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
const OUT=path.resolve(process.argv[2]||'obwelcome');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
const SIZES=(process.env.SIZES||'1600x1000,390x844').split(',').map(s=>s.split('x').map(Number));
const STEP=40, ARRIVE=+(process.env.ARRIVE_MS||2600), LEAVE=1240, REST=8400, RSTEP=80;
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
fs.mkdirSync(OUT,{recursive:true});
/* what is read per frame. Each is a selector and the property, read off the
   computed style, so it is whatever the browser is actually painting. */
const PROBE=[
 ['far.op','.obx-far','opacity'],['far.sc','.obx-far','scale'],
 ['wash.op','.obx-wash','opacity'],
 ['ring.op','.obx-ring','opacity'],['ring.rot','.obx-ring','rotate'],['ring.sc','.obx-ring','scale'],
 ['tk0.op','.obx-tk','opacity'],['tk111.op','.obx-tk:last-of-type','opacity'],
 ['halo.da','.obx-halo','stroke-dasharray'],
 ['near.op','.obx-near','opacity'],['near.sc','.obx-near','scale'],['near.tr','.obx-near','translate'],
 ['skin.op','.obx-skin','opacity'],['sk.fill','.obx-skin','fill-opacity'],
 ['ax.do','.obx-ax','stroke-dashoffset'],['skin.da','.obx-skin','stroke-dasharray'],
 ['ringsv.rot','.obx-ringsv','rotate'],['fig.sc','.obx-fig','scale'],
 ['pulse.op','.obx-pulse','opacity'],['pulse.tr','.obx-pulse','translate'],['surge.op','.obx-surge','opacity'],
 ['root.sc','.obx-s[data-obseat="Root"] .obx-sr','scale'],['root.so','.obx-s[data-obseat="Root"] .obx-sr','stroke-opacity'],
 ['root.sw','.obx-s[data-obseat="Root"] .obx-sr','stroke-width'],
 ['heart.so','.obx-s[data-obseat="Heart"] .obx-sr','stroke-opacity'],
 ['crown.sc','.obx-s[data-obseat="Crown"] .obx-sr','scale'],['crown.so','.obx-s[data-obseat="Crown"] .obx-sr','stroke-opacity'],
 ['gl0.op','.obx-glow .obx-amb','opacity'],
 ['fn0.op','.obx-fn','opacity'],
 ['eye.op','.obx-slot .obx-eye','opacity'],['w0.tr','.obx-slot .obx-w','translate'],
 ['p0.op','.obx-slot .ob-p','opacity'],['acts.op','.obx-slot .ob-acts','opacity'],
 ['pri.sh','.obx-slot .btn.pri','box-shadow'],
 ['ghost','.obx-ghost','opacity'],['stage.op','#ob','opacity']];
const readAll=PROBE=>{
 const o={};
 PROBE.forEach(([k,q,p])=>{const e=document.querySelector(q);
  if(!e){o[k]='-';return;}
  let v=getComputedStyle(e).getPropertyValue(p)||'';
  if(p==='box-shadow')v=v.replace(/\s+/g,' ').slice(0,40);
  o[k]=v.trim()||'-';});
 return o;};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [w,h] of SIZES){
  const fdir=path.join(OUT,'frames-'+w); fs.rmSync(fdir,{recursive:true,force:true}); fs.mkdirSync(fdir,{recursive:true});
  const rows=[];
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  const p=await c.newPage();
  await p.goto(FILE,{waitUntil:'load'}); await booted(p);
  await p.waitForSelector('#loginb-skip',{timeout:8000});
  await p.waitForTimeout(500);
  await p.screenshot({path:path.join(fdir,'0000-door.jpg'),type:'jpeg',quality:86});
  /* freeze the page the instant the stage is built, then seek */
  const freezeAfter=async fnSrc=>p.evaluate(src=>{
    (new Function(src))();
    getComputedStyle(document.body).opacity;
    window.__A=document.getAnimations().map(a=>{a.playbackRate=0; return [a,a.currentTime||0];});},fnSrc);
  const seek=t=>p.evaluate(t=>{window.__A.forEach(([a,t0])=>{try{a.currentTime=t0+t;}catch(e){}});},t);
  const probe=()=>p.evaluate(([src,pr])=>(new Function('PROBE','return ('+src+')(PROBE)'))(pr),[readAll.toString(),PROBE]);
  /* one frozen clock from the press: 40ms through the arrival, then 80ms
     through two breaths, so the rest is seeked exactly as the arrival is
     and the phase between breath, pulse and flares is the real one */
  const run=async(tag,fnSrc,span,rest)=>{
   await freezeAfter(fnSrc);
   for(let t=0;t<=span+(rest||0);t+=(t<span?STEP:RSTEP)){
    await seek(t);
    const ph=t<=span?tag:'2-rest';
    rows.push(Object.assign({phase:ph,t},await probe()));
    await p.screenshot({path:path.join(fdir,ph+'-'+String(t).padStart(5,'0')+'.jpg'),type:'jpeg',quality:86});}
   await p.evaluate(()=>window.__A.forEach(([a])=>{try{a.playbackRate=1;}catch(e){}}));};
  await run('1-arrive',"document.getElementById('loginb-skip').click();",ARRIVE,REST);
  await p.waitForTimeout(600);
  await run('3-comein',"document.querySelector('.obx-slot [data-ob=next]').click();",LEAVE,0);
  const keys=['phase','t'].concat(PROBE.map(x=>x[0]));
  fs.writeFileSync(path.join(OUT,'timeline-'+w+'.tsv'),
   keys.join('\t')+'\n'+rows.map(r=>keys.map(k=>r[k]).join('\t')).join('\n')+'\n');
  await p.close(); await c.close();
  /* real time */
  if(!process.env.NOVIDEO){
   const vdir=path.join(OUT,'vid-'+w); fs.mkdirSync(vdir,{recursive:true});
   const c2=await b.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600,
    recordVideo:{dir:vdir,size:{width:Math.round(w/2)*2>1280?1280:w,height:Math.round(h*(w>1280?1280/w:1)/2)*2}}});
   const p2=await c2.newPage();
   await p2.goto(FILE,{waitUntil:'load'}); await booted(p2);
   await p2.waitForSelector('#loginb-skip',{timeout:8000}); await p2.waitForTimeout(600);
   await p2.click('#loginb-skip'); await p2.waitForTimeout(6500);
   await p2.click('.obx-slot [data-ob=next]'); await p2.waitForTimeout(1800);
   const v=p2.video(); await p2.close(); await c2.close();
   fs.renameSync(await v.path(),path.join(OUT,'walk-'+w+'.webm'));
   fs.rmSync(vdir,{recursive:true,force:true});}
  console.log('  '+w+': '+rows.length+' rows');}
 await b.close();
 console.log('wrote '+OUT);
})();
