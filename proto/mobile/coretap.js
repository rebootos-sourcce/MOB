/* A tap on the core of the Wheel, on a phone. Evidence for gap R in
   RESEARCH-mobile-gaps.md, kept apart from walk.js because the walk only
   taps the core when no address is in reach.

     NODE_PATH=/opt/node22/lib/node_modules node proto/mobile/coretap.js BUILD.html [BUILD2.html ...]

   Three press lengths, blank and loaded, one fresh context each, through
   the DevTools touch path. Prints what the reading panel shows afterwards,
   null when nothing opened. */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const src of process.argv.slice(2)) for(const ms of [60,150,300]) for(const prof of ['blank','Diane']){
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();
 await p.goto('file://'+src);await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}).catch(()=>{});await p.waitForTimeout(1500);
 if(prof==='Diane')await p.evaluate(()=>{const s=document.getElementById('psel');s.value='2';s.dispatchEvent(new Event('change'));});await p.waitForTimeout(1200);
 const c=await ctx.newCDPSession(p);
 const m=await p.evaluate(()=>{const b=document.getElementById('cv').getBoundingClientRect();const h=HIT.find(h=>h.k==='core');return {x:b.left+h.x,y:b.top+h.y};});
 await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:m.x,y:m.y,id:1}]});await p.waitForTimeout(ms);
 await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(900);
 const d=await p.evaluate(()=>{const e=document.getElementById('rdrill');return e.style.display!=='none'?e.innerText.replace(/\s+/g,' ').slice(18,40):null;});
 console.log(src.split('/').pop(),prof,ms+'ms','->',d);await ctx.close();}
 await b.close();})();
