/* shots and checks for the information prototype. */
const {chromium}=require('playwright');
const path=require('path');
const F='file://'+path.resolve(__dirname,'info.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const fails=[];
 for(const [w,h,m,nm] of [[1600,1000,false,'1600'],[390,844,true,'390']]){
  const c=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m,deviceScaleFactor:m?2:1});
  const p=await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  await p.goto(F); await p.waitForTimeout(600);
  if(errs.length)fails.push(nm+' page errors: '+errs.join(' | '));
  await p.screenshot({path:path.join(__dirname,'shot-'+nm+'-page.png'),fullPage:true});
  /* ROUTE 1. in place. */
  const r1=await p.evaluate(()=>{const e=document.querySelector('[data-gloss="Root"]');
   e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();
   return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};});
  if(m)await p.touchscreen.tap(r1.x,r1.y); else {await p.mouse.move(r1.x-40,r1.y-30);
   await p.waitForTimeout(120); await p.mouse.move(r1.x,r1.y); await p.waitForTimeout(900);}
  await p.waitForTimeout(500);
  const s1=await p.evaluate(()=>{const t=document.querySelector('.tip');
   if(!t)return null; const bb=t.getBoundingClientRect(), cs=getComputedStyle(t);
   return {on:t.classList.contains('on'), sheet:document.body.classList.contains('tip-sheet'),
    box:[bb.x,bb.y,bb.width,bb.height].map(Math.round), bg:cs.backgroundColor,
    txt:(t.innerText||'').replace(/\s+/g,' ').slice(0,110)};});
  console.log(nm+' route 1 in place  '+JSON.stringify(s1));
  if(!s1||!s1.on)fails.push(nm+' route 1 did not open');
  if(s1&&/rgba\(0, 0, 0, 0\)|transparent/.test(s1.bg))fails.push(nm+' tip ground is transparent');
  /* the panel must not cover its own carrier */
  const ov=await p.evaluate(()=>{const t=document.querySelector('.tip'),c=document.querySelector('[data-gloss="Root"]');
   const a=t.getBoundingClientRect(),b=c.getBoundingClientRect();
   const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
   const y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
   return Math.round(x*y);});
  console.log(nm+' overlap with its carrier, px '+ov+' of 0 allowed');
  if(ov>0)fails.push(nm+' panel overlaps its carrier by '+ov+' px');
  await p.screenshot({path:path.join(__dirname,'shot-'+nm+'-route1.png')});
  /* ROUTE 2. by name. */
  await p.fill('#q','root'); await p.waitForTimeout(250);
  await p.click('[data-hit="root"]'); await p.waitForTimeout(350);
  const s2=await p.evaluate(()=>{const d=document.getElementById('drill');
   return {on:d.classList.contains('on'), txt:(d.innerText||'').replace(/\s+/g,' ').slice(0,90),
    reads:document.getElementById('n-read').textContent,
    entries:document.getElementById('n-str').textContent, forms:document.getElementById('n-form').textContent,
    routes:document.getElementById('n-rt').textContent};});
  console.log(nm+' route 2 by name   '+JSON.stringify(s2));
  if(!s2.on)fails.push(nm+' route 2 did not open the drill');
  await p.screenshot({path:path.join(__dirname,'shot-'+nm+'-route2.png')});
  /* ROUTE 3. from a reading. */
  const r3=await p.evaluate(()=>{const e=document.querySelector('[data-gloss="Fear"]');
   e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();
   return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};});
  if(m){await p.touchscreen.tap(r3.x,r3.y); await p.waitForTimeout(500);
        await p.touchscreen.tap(r3.x,r3.y);}
  else {await p.mouse.move(r3.x,r3.y); await p.waitForTimeout(800); await p.mouse.click(r3.x,r3.y);}
  await p.waitForTimeout(500);
  const s3=await p.evaluate(()=>({
   drill:document.getElementById('drill').classList.contains('on'),
   reads:document.getElementById('n-read').textContent,
   entries:document.getElementById('n-str').textContent, forms:document.getElementById('n-form').textContent,
   routes:document.getElementById('n-rt').textContent,
   gate:(document.getElementById('gate').innerText||'').replace(/\s+/g,' ')}));
  console.log(nm+' route 3 reading   '+JSON.stringify(s3));
  await p.screenshot({path:path.join(__dirname,'shot-'+nm+'-route3.png')});
  /* the floors */
  const fl=await p.evaluate(()=>{
   const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
   let small=0,tap=0;
   document.querySelectorAll('*').forEach(e=>{
    if(!vis(e))return; const s=getComputedStyle(e);
    if((e.childElementCount===0)&&(e.textContent||'').trim()&&parseFloat(s.fontSize)<11)small++;});
   document.querySelectorAll('button,a,input,select,[tabindex]').forEach(e=>{
    if(!vis(e))return; const b=e.getBoundingClientRect();
    if(b.width<44||b.height<44)tap++;});
   const caps=[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0)
    .map(e=>(e.textContent||'').trim()).filter(t=>t.length>6&&t===t.toUpperCase()&&/[A-Z]{3}/.test(t));
   return {small, tap, caps:caps.length, capSample:caps.slice(0,4),
    em:(document.body.innerText.match(/—/g)||[]).length,
    n108:(document.body.innerText.match(/\b108\b/g)||[]).length};});
  console.log(nm+' floors  text under 11px '+fl.small+'   taps under 44 '+fl.tap
   +'   all caps over 6 chars '+fl.caps+' '+JSON.stringify(fl.capSample)
   +'   em dashes '+fl.em+'   says 108 '+fl.n108);
  if(fl.small)fails.push(nm+' '+fl.small+' elements under 11px');
  if(fl.em)fails.push(nm+' em dash present');
  if(fl.n108)fails.push(nm+' says 108');
  await c.close();}
 await b.close();
 console.log('\n'+(fails.length?'FAILS:\n  '+fails.join('\n  '):'all checks passed'));
 process.exit(fails.length?1:0);
})();
