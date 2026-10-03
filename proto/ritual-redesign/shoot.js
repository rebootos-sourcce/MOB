/* shoot.js. The three options, at 1600 and at 390, off the packed page.

   Run from the repo root after build.js:
     NODE_PATH=<playwright> node proto/ritual-redesign/shoot.js
   Writes shots/<option>-<width>.png, and at 390 a -full capture of the whole
   ritual surface, because the phone scrolls the body and a viewport shot shows
   only its first screen. */
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const D=__dirname, OUT=path.join(D,'shots');
const FILE='file://'+path.join(D,'ritual-redesign-packed.html');
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:process.env.PW_CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}}); const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE);
  await p.waitForFunction(()=>document.getElementById('protobar'),null,{timeout:30000});
  const shot=async(nm,full)=>{
   await p.evaluate(()=>document.querySelectorAll('.tabin').forEach(e=>e.classList.remove('tabin')));
   await p.waitForTimeout(350);
   if(full){
    await p.evaluate(()=>{document.body.style.overflow='visible';document.body.style.height='auto';
     document.documentElement.style.overflow='visible';document.getElementById('protobar').style.display='none';});
    await p.locator('#rit .rv').screenshot({path:path.join(OUT,nm+'.png')});
    await p.evaluate(()=>{document.body.style.overflow='';document.body.style.height='';
     document.documentElement.style.overflow='';document.getElementById('protobar').style.display='';});}
   else await p.screenshot({path:path.join(OUT,nm+'.png')});};
  for(const o of ['a','b','c']){
   await p.click('[data-po="'+o+'"]');
   await p.evaluate(()=>window.scrollTo(0,0));
   await shot(o+'-'+W);
   if(W===390)await shot(o+'-'+W+'-full',true);}
  await p.click('[data-po="a"]'); await p.click('[data-pw="blank"]');
  await shot('a-'+W+'-first-visit');
  console.log(W,errs.length?'PAGE ERRORS '+errs.join(' | '):'no page errors');
  await p.close();}
 await b.close();})();
