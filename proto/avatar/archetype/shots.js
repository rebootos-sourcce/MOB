/* ============================================================
   SHOOT AND CHECK THE ROUND GV ARCHETYPE PROTOTYPES, in real Chromium, at
   1600 and at 390. Each scene is a hash the page opens on.

   Held to the house rules on what renders: no page error, no em dash, never
   108, no horizontal scroll, every visible control at least 44 tall. And the
   owner's own ruling, tested by pressing it: one press saves and presses the
   button, the same press again takes it off, and no control on the page
   says Save. A failure exits non zero.

     NODE_PATH=<playwright> node proto/avatar/archetype/shots.js [name ...]
   ============================================================ */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const D=__dirname, OUT=path.join(D,'shots');
fs.mkdirSync(OUT,{recursive:true});
const SCENES={
 'avatar-merge':['who=James','who=James&arch=1','who=Angela&arch=1&sel=Shapeshifter','who=blank&arch=1'],
 'v1-orbit':['who=James','who=Angela&sel=Everyman','who=blank'],
 'v2-ladder':['who=Derek','who=Angela&sel=Innocent','who=blank'],
 'v3-three':['who=James','who=blank'],
 'v4-spine':['who=James&sel=Warrior','who=Derek&sel=Jester','who=blank']};
const want=process.argv.slice(2);
let bad=0;
const fail=(m)=>{bad++;console.log('  FAIL  '+m);};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const name of Object.keys(SCENES).filter(n=>!want.length||want.includes(n))){
  const file=path.join(D,'out',name+'.html'); if(!fs.existsSync(file)){console.log('  skip '+name);continue;}
  for(const [w,h] of [[1600,1000],[390,844]])for(const [i,sc] of SCENES[name].entries()){
   const ctx=await b.newContext({viewport:{width:w,height:h}});
   const p=await ctx.newPage();
   const errs=[];p.on('pageerror',e=>errs.push(e.message));
   await p.goto('file://'+file+'#'+sc);
   await p.waitForTimeout(450);
   const tag=`${name} ${w} [${sc}]`;
   const shot=path.join(OUT,`${name}-${i}-${w}.png`);
   await p.screenshot({path:shot,fullPage:!/arch=1/.test(sc)});
   const r=await p.evaluate(()=>{
    const txt=document.body.innerText;
    const small=[...document.querySelectorAll('button,select,a[href],summary,input')].filter(e=>{
     if(e.offsetParent===null&&getComputedStyle(e).position!=='fixed')return false;
     /* the design note pins draw 26 and carry a 44 hit area in ::after, which
        a bounding box cannot see. They are the prototype's own, not the page's. */
     if(e.classList.contains('pin'))return false;
     const q=e.getBoundingClientRect(); return q.width>0&&q.height>0&&q.height<43.5;})
     .map(e=>(e.className||e.tagName)+':'+Math.round(e.getBoundingClientRect().height)+' '+(e.textContent||'').trim().slice(0,20));
    const save=[...document.querySelectorAll('button')].filter(e=>/^\s*save\s*$/i.test(e.textContent));
    return {txt,small,save:save.length,sx:document.documentElement.scrollWidth-innerWidth};});
   if(errs.length)fail(tag+' page error: '+errs.join(' | '));
   if(/\u2014/.test(r.txt))fail(tag+' an em dash');
   if(/\b108\b/.test(r.txt))fail(tag+' says 108');
   if(r.sx>1)fail(tag+' scrolls sideways by '+r.sx+'px');
   if(r.small.length)fail(tag+' controls under 44 tall: '+r.small.slice(0,6).join(', '));
   if(r.save)fail(tag+' a Save button is on the page');
   /* the one press, on the first scene only */
   if(i===0||/sel=/.test(sc)){
    const rt=await p.$('[data-rt]');
    if(rt){
     const nm=await rt.getAttribute('data-rt'), before=await rt.getAttribute('aria-pressed');
     await rt.click(); await p.waitForTimeout(120);
     const a1=await p.$eval(`[data-rt="${nm}"]`,e=>e.getAttribute('aria-pressed'));
     const s1=await p.$eval('.ar-st',e=>e.textContent);
     if(a1===before)fail(tag+' one press did not change '+nm);
     if(a1==='true'&&!/^Saved/.test(s1))fail(tag+' pressed, and the status says "'+s1+'"');
     await p.screenshot({path:path.join(OUT,`${name}-${i}-${w}-pressed.png`),fullPage:!/arch=1/.test(sc)});
     await p.click(`[data-rt="${nm}"]`); await p.waitForTimeout(120);
     const a2=await p.$eval(`[data-rt="${nm}"]`,e=>e.getAttribute('aria-pressed'));
     if(a2!==before)fail(tag+' the second press did not put '+nm+' back');
     const m=await p.evaluate(()=>{const e=document.querySelector('#meas,.meas');return e?e.textContent:'';});
     console.log('  ok  '+tag+'  one press on '+nm+': '+before+' -> '+a1+' -> '+a2+(m?'   '+m:''));
    } else if(i===0) console.log('  note '+tag+' no button to press on this scene');
   }
   await ctx.close();
  }
 }
 await b.close();
 console.log(bad?bad+' failed':'all clean');
 process.exit(bad?1:0);
})();
