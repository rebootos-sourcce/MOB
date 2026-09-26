/* THE BEFORE. The shipped build, unmodified, James loaded the way every
   Field round tonight loaded him (his five story bank lines committed), shot
   on the Field and the Body page at both widths, idle and with one address
   pressed, so the after has a real before beside it.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/shelf/before.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const {STORYBANK}=require(path.resolve('sim/stories.js'));
fs.mkdirSync(OUT,{recursive:true});
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const facts={};
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await (await b.newContext({viewport:{width:W,height:H}})).newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve('source.html'));
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});
  await p.evaluate(([bank])=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();
   const i=PEOPLE.findIndex(q=>q.nm==='James');loadP(i);
   (bank['James']||[]).map(x=>x[1]).forEach(function(t,k){applyStory(t);verpApply(t);if(typeof leanApply==='function')leanApply(t);
    CURP.story=CURP.story||{entries:[]};const ps=parseStory(t);
    CURP.story.entries.push({t:'2026-09-2'+k+'T08:00:00Z',text:t,imprints:ps.imprints.length,bands:ps.bands});});},[STORYBANK]);
  for(const [tab,nm] of [[2,'field'],[3,'body']]){
   await p.evaluate(t=>{setTab(t);render();scrollTo(0,0);},tab);
   await p.waitForTimeout(900);
   await p.screenshot({path:`${OUT}/before-${nm}-${W}.png`});
   /* press the heaviest address, the way a tap on it does */
   const f=await p.evaluate(()=>{
    const n=W.slice().sort((a,b)=>b.sq-a.sq)[0]; runNodeDrill(n); render();
    const d=document.getElementById('rdrill').getBoundingClientRect();
    const st=document.querySelector('.stage').getBoundingClientRect();
    const rail=document.querySelectorAll('.col')[1].getBoundingClientRect();
    return {addr:n.k,seat:n.b,drillTop:Math.round(d.top+scrollY),drillH:Math.round(d.height),
     stage:[Math.round(st.left),Math.round(st.top),Math.round(st.width),Math.round(st.height)],
     rail:[Math.round(rail.left),Math.round(rail.top+scrollY),Math.round(rail.width),Math.round(rail.height)],
     page:document.documentElement.scrollHeight,scrollY:Math.round(scrollY)};});
   await p.waitForTimeout(700);
   f.scrollYAfter=await p.evaluate(()=>Math.round(scrollY));
   facts[nm+'-'+W]=f;
   await p.screenshot({path:`${OUT}/before-${nm}-${W}-pressed.png`});
   await p.evaluate(()=>{rdClose();});
  }
  if(errs.length)console.log('errors',W,errs);
 }
 console.log(JSON.stringify(facts,null,1));
 await b.close();
})();
