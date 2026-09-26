/* THE WALK, RECORDED. The same real presses shoot.js makes, at a reading
   pace, captured as video at 1600 by 1000 and 390 by 844, so the shelf is
   seen opening, swapping, sharing, going back and closing rather than
   described. Writes rec/walk-1600.webm and rec/walk-390.webm.

     node proto/shelf/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/shelf/record.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'rec');
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

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 for(const [W,H] of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:W<600,isMobile:W<600,
   recordVideo:{dir:OUT,size:{width:W,height:H}}});
  const p=await ctx.newPage();
  const tap=async(box)=>{ if(W<600)await p.touchscreen.tap(box.x,box.y); else {await p.mouse.move(box.x,box.y,{steps:12});await wait(p,250);await p.mouse.click(box.x,box.y);}};
  const off=async()=>{if(W>600)await p.mouse.move(W-60,H-30,{steps:10});};
  await ready(p); await wait(p,1400);
  let a=await wheelAddr(p,'Escapism');
  if(W<600){await p.evaluate(`${SCROLL}.scrollBy({top:${Math.round(a.y-300)},behavior:'smooth'})`);await wait(p,900);a=await wheelAddr(p,'Escapism');}
  await tap(a); await off(); await wait(p,2600);
  let c=await wheelPat(p);
  if(c&&W<600&&(c.y<60||c.y>H*0.44-10)){await p.evaluate(`${SCROLL}.scrollBy(0,${Math.round(c.y-200)})`);await wait(p,500);c=await wheelPat(p);}
  if(c){await tap(c); await off(); await wait(p,2400);}
  await p.click('.sh-acts [data-act="mark"]'); await wait(p,1200);
  await p.click('.sh-acts [data-act="share"]'); await wait(p,3200);
  await p.click('.sh-back'); await wait(p,1800);
  await p.click('.sh-acts [data-act="save"]'); await wait(p,1600);
  await p.click('.sh-back'); await wait(p,3000);
  await p.click('.sh-x'); await wait(p,1400);
  if(W>1180){await p.click('.sh-full'); await wait(p,1800); await p.click('.sh-full'); await wait(p,1000);}
  await p.close(); const v=await p.video().path(); await ctx.close();
  fs.renameSync(v,path.join(OUT,'walk-field-'+W+'.webm'));
  /* the Body page */
  const ctx2=await b.newContext({viewport:{width:W,height:H},hasTouch:W<600,isMobile:W<600,
   recordVideo:{dir:OUT,size:{width:W,height:H}}});
  const q=await ctx2.newPage();
  const tap2=async(box)=>{ if(W<600)await q.touchscreen.tap(box.x,box.y); else {await q.mouse.move(box.x,box.y,{steps:12});await wait(q,250);await q.mouse.click(box.x,box.y);}};
  await ready(q,'#body'); await wait(q,1200);
  const find=()=>q.evaluate(()=>{const els=[...document.querySelectorAll('#emap [data-node]')].map(e=>({e,n:BY[+e.dataset.node]})).filter(x=>x.n).sort((x,y)=>y.n.sq-x.n.sq);
   const r=els[0].e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
  let n=await find();
  if(W<600){await q.evaluate(`${SCROLL}.scrollBy({top:${Math.round(n.y-260)},behavior:'smooth'})`);await wait(q,900);n=await find();}
  await tap2(n); if(W>600)await q.mouse.move(W-60,H-30,{steps:10}); await wait(q,3000);
  await q.click('.sh-back'); await wait(q,3000);
  await q.click('.sh-x'); await wait(q,1200);
  await q.close(); const v2=await q.video().path(); await ctx2.close();
  fs.renameSync(v2,path.join(OUT,'walk-body-'+W+'.webm'));
 }
 await b.close();
 console.log(fs.readdirSync(OUT).map(f=>f+' '+(fs.statSync(path.join(OUT,f)).size/1024|0)+' KB').join('\n'));
})();
