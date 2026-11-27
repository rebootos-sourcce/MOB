/* ============================================================
   SHOOT AND CHECK THE FW MOCKUPS, at 1600 and at 390, in real Chromium.

   Each page is opened from out/<name>.html, every option in its switch is
   pressed in turn, and each state is shot. The page's visible text is held
   to the house rules on the way: no em dash, never 108, no page error. A
   failure exits non zero, so a mockup is not sent that breaks a rule its own
   product is gated on.

     NODE_PATH=<playwright> node proto/fw/shots.js [name ...]
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const D=__dirname, OUT=path.join(D,'shots');
fs.mkdirSync(OUT,{recursive:true});
const want=process.argv.slice(2);
const pages=fs.readdirSync(path.join(D,'out')).filter(f=>f.endsWith('.html')&&!f.endsWith('-packed.html'))
 .map(f=>f.slice(0,-5)).filter(n=>!want.length||want.includes(n));
let bad=0;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const name of pages)for(const [w,h] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(D,'out',name+'.html'));
  await p.waitForTimeout(500);
  const modes=await p.$$eval('#mode button',bs=>bs.map(b=>b.dataset.k)).catch(()=>[]);
  for(const m of (modes.length?modes:['only'])){
   if(m!=='only'){await p.click(`#mode button[data-k="${m}"]`);await p.waitForTimeout(450);}
   /* a state may ask to be shot after a scripted press: data-shoot on the body */
   await p.evaluate(()=>window.shootPrep&&window.shootPrep()).catch(()=>{});
   await p.waitForTimeout(300);
   await p.screenshot({path:path.join(OUT,`${name}-${m}-${w}.jpg`),fullPage:w<=400,type:'jpeg',quality:78});
   const txt=await p.evaluate(()=>document.body.innerText);
   const probs=[];
   if(/\u2014/.test(txt))probs.push('em dash');
   if(/\b108\b/.test(txt))probs.push('says 108');
   if(/\bof 100\b/.test(txt))probs.push('a count against 100');
   const over=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   if(over>2)probs.push('horizontal scroll '+over+'px');
   if(probs.length){bad++;console.log(`FAIL ${name} ${m} ${w}: ${probs.join(', ')}`);}
  }
  if(errs.length){bad++;console.log(`FAIL ${name} ${w}: page errors ${errs.join(' | ')}`);}
  else console.log(`ok   ${name} ${w} ${modes.join(',')}`);
  await p.close();}
 await b.close(); process.exit(bad?1:0);
})();
