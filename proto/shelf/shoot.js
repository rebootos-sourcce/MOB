/* THE AFTER. Drives proto/shelf/shelf.html with real presses, not calls:
   the mouse goes to the address's own position on the wheel, read off the
   product's hit list, and to the address's own mark on the Body figure. Every
   state the spec names is shot at 1600 by 1000 and at 390 by 844, and the
   facts a reviewer would otherwise have to trust are printed and written to
   shots/after.json.

     node proto/shelf/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/shelf/shoot.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'shelf.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(OUT,{recursive:true});
const wait=(p,ms)=>p.waitForTimeout(ms);
async function ready(p,hash){
 await p.goto('about:blank'); /* a hash change alone would not reload the page */
 await p.goto(PAGE+(hash||''));
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-shelf-ready')==='1',null,{timeout:25000});
 await p.evaluate(()=>{try{localStorage.removeItem('atuned.shelf.proto.v1');}catch(e){}});
 await wait(p,700);}
/* where a thing is on screen, in page coordinates, found by identity */
/* a point on the address that the product's own hit test agrees is that
   address. On a phone the outer shell is thin and a saboteur bead sits on
   top of it, so the centre of the segment can answer as the bead. */
async function wheelAddr(p,name){
 return p.evaluate(nm=>{const cv=document.getElementById('cv').getBoundingClientRect();
  const h=HIT.filter(h=>h.k==='node'&&h.n&&h.n.k===nm).pop(); if(!h)return null;
  if(h.x!==undefined)return {x:cv.left+h.x,y:cv.top+h.y};
  let a1=h.a1; if(a1<h.a0)a1+=Math.PI*2;
  for(const fr of [.5,.35,.65,.2,.8])for(const fa of [.5,.3,.7,.15,.85]){
   const r=h.r0+(h.r1-h.r0)*fr, a=h.a0+(a1-h.a0)*fa;
   const x=h.cx+r*Math.cos(a), y=h.cy+r*Math.sin(a), t=hitTest(x,y);
   if(t&&t.k==='node'&&t.n&&t.n.k===nm)return {x:cv.left+x,y:cv.top+y};}
  return null;},name);}
const SCROLL=`(function(){var b=document.body;if(b.scrollHeight>b.clientHeight+2&&/(auto|scroll)/.test(getComputedStyle(b).overflowY))return b;return document.scrollingElement;})()`;
async function wheelPat(p){
 return p.evaluate(()=>{const cv=document.getElementById('cv').getBoundingClientRect();
  const r=compute(); const top=r.sabs.slice().sort((a,b)=>b.w-a.w)[0];
  const hs=HIT.filter(h=>h.o&&h.x!==undefined&&h.o.nm===top.nm).concat(HIT.filter(h=>h.o&&h.x!==undefined));
  for(const h of hs){const t=hitTest(h.x,h.y); if(t&&t.o===h.o)return {x:cv.left+h.x,y:cv.top+h.y,nm:h.o.nm};}
  return null;});}
async function facts(p){
 return p.evaluate(()=>{const st=document.querySelector('.stage').getBoundingClientRect();
  const sh=document.getElementById('shelf').getBoundingClientRect();
  const ring=document.querySelector('.sh-src');const rr=ring.getBoundingClientRect();
  const nm=document.querySelector('.sh-nm');
  return {state:document.body.dataset.shelf,sheet:document.body.dataset.sheet||null,
   stage:[st.left,st.top,st.width,st.height].map(Math.round),
   shelf:[sh.left,sh.top,sh.width,sh.height].map(Math.round),
   title:nm&&nm.textContent, titleTop:nm?Math.round(nm.getBoundingClientRect().top):null,
   ringOn:ring.classList.contains('on'), ring:ring.classList.contains('on')?[rr.left+rr.width/2,rr.top+rr.height/2].map(Math.round):null,
   ringVisible:ring.classList.contains('on')&&rr.top>=0&&rr.bottom<=innerHeight&&rr.right<=sh.left+2||(ring.classList.contains('on')&&innerWidth<1181&&rr.bottom<=sh.top),
   scrollY:Math.round(document.body.scrollTop||scrollY)};});}
async function tapSmall(p,box){ /* a real press, mouse at desktop and a tap on the phone */
 await p.mouse.click(box.x,box.y);}
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const all={}; const errs=[];
 for(const [W,H] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:W<600,isMobile:W<600,deviceScaleFactor:1});
  const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(W+' '+e.message));
  const tap=async(box)=>{ if(W<600)await p.touchscreen.tap(box.x,box.y); else await p.mouse.click(box.x,box.y);};
  const shot=async(nm)=>{if(W>600)await p.mouse.move(W-40,H-20);await wait(p,650);await p.screenshot({path:`${OUT}/after-${nm}-${W}.png`});
   all[nm+'-'+W]=await facts(p);};

  /* ---------------- the Field ---------------- */
  await ready(p);
  await shot('field-1-closed');
  /* the address pressed, Escapism, the heaviest address James holds */
  let a=await wheelAddr(p,'Escapism');
  if(W<600){await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(a.y-300)})`); await wait(p,300); a=await wheelAddr(p,'Escapism');}
  await tap(a);
  await shot('field-2-address');
  /* a chain pressed while the address is open: the item swaps, the address goes on the trail */
  let c=await wheelPat(p);
  if(c&&W<600&&(c.y<60||c.y>H*0.44-10)) /* a phone: the chain must be in the half the sheet leaves showing */{await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(c.y-200)})`);await wait(p,300);c=await wheelPat(p);}
  if(c){await tap(c); await shot('field-3-chain');}
  /* bookmark the chain, then open share */
  await p.click('.sh-acts [data-act="mark"]');
  await p.click('.sh-acts [data-act="share"]');
  await shot('field-4-share');
  /* back to the address through the trail, save it */
  await p.click('.sh-back'); await wait(p,300);
  await p.click('.sh-acts [data-act="save"]');
  await shot('field-5-saved');
  /* back again, to the page: the table of what the Field holds */
  await p.click('.sh-back');
  await shot('field-6-page');
  if(W>1180){
   await p.click('.sh-x'); await wait(p,400);
   await p.click('.sh-full');
   await shot('field-7-full');
   await p.click('.sh-full'); await wait(p,400);}

  /* ---------------- the Body page ---------------- */
  await ready(p,'#body');
  await shot('body-1-closed');
  const n=await p.evaluate(()=>{
   const els=[...document.querySelectorAll('#emap [data-node]')].map(e=>({e,n:BY[+e.dataset.node]}))
    .filter(x=>x.n).sort((x,y)=>y.n.sq-x.n.sq);
   const t=els[0]; const r=t.e.getBoundingClientRect();
   return {x:r.left+r.width/2,y:r.top+r.height/2,nm:t.n.k,seat:t.n.b};});
  let nb=n;
  if(W<600){await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(n.y-260)})`);await wait(p,300);
   nb=await p.evaluate(nm=>{const e=[...document.querySelectorAll('#emap [data-node]')].find(e=>BY[+e.dataset.node].k===nm);
    const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};},n.nm);}
  await tap(nb);
  await shot('body-2-address');
  await p.click('.sh-back');
  await p.evaluate(()=>{ /* the page opens on the Body page's own table, the Flow rows */
   if(typeof OPENSEC==='object'){OPENSEC.right.flow=1; if(typeof paintSections==='function')paintSections();}});
  await shot('body-3-page');
  await ctx.close();
 }
 fs.writeFileSync(path.join(OUT,'after.json'),JSON.stringify(all,null,1));
 console.log(JSON.stringify(all,null,1));
 if(errs.length)console.log('PAGE ERRORS',errs); else console.log('no page errors');
 await b.close();
})();
