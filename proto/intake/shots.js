/* ============================================================
   SHOOT AND CHECK THE ARCHETYPE MOCKUPS, at 1600 and at 390, in real Chromium,
   as a stranger and with a profile loaded. Each page is shot fresh and again
   after shootPrep presses its way part through. The visible text is held to
   the house rules: no em dash, never 108, no count against 100, no page error,
   no horizontal scroll, and every button at least 44 tall. A failure exits
   non zero.

     NODE_PATH=<playwright> node proto/intake/shots.js [name ...]
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
 for(const name of pages)for(const [w,h] of [[1600,1000],[390,844]])for(const who of ['stranger','Derek']){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(D,'out',name+'.html'));
  await p.waitForTimeout(300);
  if(who!=='stranger'){await p.click(`.pb [data-who="${who}"]`);await p.waitForTimeout(200);}
  for(const st of ['fresh','mid']){
   if(st==='mid'){await p.evaluate(()=>window.shootPrep&&window.shootPrep());await p.waitForTimeout(250);}
   await p.screenshot({path:path.join(OUT,`${name}-${who}-${st}-${w}.jpg`),fullPage:true,type:'jpeg',quality:78});
   const txt=await p.evaluate(()=>document.body.innerText);
   const probs=[];
   if(/—/.test(txt))probs.push('em dash');
   if(/\b108\b/.test(txt))probs.push('says 108');
   if(/\bof 100\b/.test(txt))probs.push('a count against 100');
   const over=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   if(over>2)probs.push('horizontal scroll '+over+'px');
   const small=await p.evaluate(()=>[...document.querySelectorAll('.wrap button, .wrap [role=button]')]
    .filter(e=>e.offsetParent!==null||e.getBBox).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim().slice(0,20)||e.getAttribute('aria-label'),Math.round(r.width),Math.round(r.height)];})
    .filter(x=>x[1]>0&&(x[1]<44||x[2]<43.5)));
   if(small.length)probs.push('under 44: '+small.slice(0,6).map(x=>x.join(' ')).join('; '));
   if(probs.length){bad++;console.log(`FAIL ${name} ${who} ${st} ${w}: ${probs.join(', ')}`);}
  }
  if(errs.length){bad++;console.log(`FAIL ${name} ${who} ${w}: page errors ${errs.join(' | ')}`);}
  else console.log(`ok   ${name} ${who} ${w}`);
  await p.close();}
 await b.close(); process.exit(bad?1:0);
})();
