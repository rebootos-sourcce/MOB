const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1680,height:1020}});
await p.goto(FILE,{waitUntil:'load'});await p.waitForTimeout(800);
const people=await p.evaluate(()=>PEOPLE.map(x=>x.nm));
console.log('=== wheel nameplate overlaps, every persona x every depth ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await p.evaluate(n=>{loadP(n);setTab(TAB.FIELD);},i);await p.waitForTimeout(80);
 let line=[];
 for(let v=0;v<4;v++){
  const res=await p.evaluate(vv=>{S.view=vv;S.tab=TAB.FIELD;draw(compute());
   const P=window.__PLATES||[];
   let bad=0;
   for(let a=0;a<P.length;a++)for(let c=a+1;c<P.length;c++)
    if(window.plateHit(P[a],P[c]))bad++;
   return {n:P.length,bad:bad};},v);
  ok(res.bad===0,nm+'/depth'+v+': '+res.bad+' overlapping plates');
  line.push(res.n+(res.bad?'!'+res.bad:''));}
 console.log(' ',nm.padEnd(8),'plates by depth:',line.join(' '));}
/* ============================================================
   A control laid over a label the wheel drew.

   The balance strip sat centred at the bottom of the stage, which
   is exactly where the wheel draws its lowest seat name, so the
   word Heart ran vertically through the middle of the reading.
   Nothing could catch it: the label is canvas pixels, the strip is
   DOM, and a probe that samples pixels to find one under the other
   lies. radialTxt now records the box of every label it draws, the
   way HIT records targets, so this is measured rather than looked
   at.
   ============================================================ */
console.log('\n=== stage controls clear of the labels the wheel draws ===');
for(const w of [[1680,1020],[1440,960],[1280,900],[1180,820],[2560,1400]]){
 for(const V of [0,1,2,3]){
 await p.setViewportSize({width:w[0],height:w[1]});
 await p.waitForTimeout(160);
 const hits=await p.evaluate(v=>{
  loadP(0);setTab(TAB.FIELD);S.view=v;layout();draw(compute());
  const cv=document.getElementById('cv').getBoundingClientRect();
  const sc=cv.width/CW;                       /* canvas units to CSS pixels */
  const boxes=LBL.map(l=>({t:l.t,left:cv.left+l.x*sc,top:cv.top+l.y*sc,
   right:cv.left+(l.x+l.w)*sc,bottom:cv.top+(l.y+l.h)*sc}));
  /* the ink, not the container. #pol2 is a full height flex box holding a
     104px drawing, so its bounding box covers half the stage and says nothing
     about what is painted. a leaf with text, or a drawing, is the ink. */
  const ink=[];
  document.querySelectorAll('#stage > *').forEach(e=>{
   if(e.id==='cv'||e.id==='probe')return;   /* probe is the hover readout at the core */
   const st=getComputedStyle(e);
   if(st.display==='none'||st.visibility==='hidden'||+st.opacity===0)return;
   const nm=e.id||String(e.className).split(' ')[0];
   const leaves=e.querySelectorAll('svg,img,canvas,*:not(:has(*))');
   const set=leaves.length?leaves:[e];
   set.forEach(l=>{
    const ls=getComputedStyle(l);
    if(ls.display==='none'||ls.visibility==='hidden'||+ls.opacity===0)return;
    if(!l.querySelector('*')&&!(l.textContent||'').trim()
       &&!/^(SVG|IMG|CANVAS)$/.test(l.tagName))return;
    const r=l.getBoundingClientRect();
    if(r.width&&r.height)ink.push({nm:nm,r:r});});});
  const bad=[];
  ink.forEach(o=>{const r=o.r;
   boxes.forEach(bx=>{
    if(r.left<bx.right&&r.right>bx.left&&r.top<bx.bottom&&r.bottom>bx.top)
     bad.push(o.nm+' over '+bx.t);});});
  return {n:boxes.length,bad:[...new Set(bad)]};},V);
 const tag=w.join('x')+'/depth'+V;
 ok(hits.bad.length===0,tag+': '+hits.bad.join(', '));
 console.log('  '+tag+': '+hits.n+' labels, '
  +(hits.bad.length?hits.bad.join(', '):'none covered'));
 /* and the wheel draws inside its own canvas. 3rd Eye rendered as d Eye once
    the stage became a grid, because the radius reserved a share of itself for
    the labels rather than the width of a word. */
 const off=await p.evaluate(()=>LBL.filter(l=>l.x<-0.5||l.y<-0.5||l.x+l.w>CW+0.5||l.y+l.h>CH+0.5)
   .map(l=>l.t+' by '+Math.round(Math.max(-l.x,-l.y,l.x+l.w-CW,l.y+l.h-CH))+'px'));
 ok(off.length===0,tag+': labels off the canvas: '+off.join(', '));
 if(off.length)console.log('  '+tag+': clipped '+off.join(', '));}}

await b.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);})();
