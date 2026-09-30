const {chromium}=require('playwright');const path=require('path');
/* the target is overridable, so the delivery build can be put through the
   same gates as the source build rather than being trusted. */
/* ?dev=1: the same flag the boot sheet's own developer button sets, so this
   gate meets the instrument at once rather than meeting the new login
   screen ui/login.js puts in front of it on every boot. */
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
/* THE BOOT IS A THREE SECOND SHEET, so every page these gates open has to be
   allowed to finish booting before anything is measured or clicked. Without
   it the gates race the boot: they wait under a second, the sheet is still
   up, and a run fails intermittently on whichever surface it happened to
   reach first. Measured once as four failures in one run of four that would
   not reproduce, which is exactly the shape of this kind of race. */
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}};
let PASS=0,FAIL=0;const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1680,height:1020}});
await p.goto(FILE,{waitUntil:'load'}); await booted(p);await p.waitForTimeout(800);
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
   Nothing past the ring.

   Ruled 26 September, CQ in TASKS.md: seat names never stick out past
   the ring, on any view, so the Field keeps one unbroken circular
   silhouette. Every name the Wheel drew ran outward from its anchor,
   so at every depth past Charge the seat names sat outside the shell,
   and at Blueprint nineteen domain names reached 1.2 of the unit. This
   holds every label to R_EDGE, the shell or at Blueprint the domain ring,
   for every persona at every depth, on a desktop and on a phone.

   A curved word carries ro, its true outer radius, because the box
   round a curve has corners off the arc: the first probe of this read
   corners and failed five seat names that the pixels showed inside. A
   straight run is read at its farthest corner, which only overstates.
   ============================================================ */
console.log('\n=== every label inside the ring, every persona x every depth ===');
for(const w of [[1680,1020],[390,844]]){
 await p.setViewportSize({width:w[0],height:w[1]});await p.waitForTimeout(160);
 let worst=0,n=0;
 for(let i=0;i<people.length;i++)for(let v=0;v<4;v++){
  const res=await p.evaluate(a=>{loadP(a[0]);setTab(TAB.FIELD);S.view=a[1];layout();draw(compute());
   /* the reach, then the edge taken off it. Unbracketed, the subtraction bound
      to the straight branch alone and every curved word was measured as its
      raw radius, which failed all seven seat names on its first run. */
   const past=LBL.map(l=>({t:l.t,r:(l.ro!=null?l.ro:Math.max(...[[l.x,l.y],[l.x+l.w,l.y],[l.x,l.y+l.h],
     [l.x+l.w,l.y+l.h]].map(q=>Math.hypot(q[0]-CX,q[1]-CY))))-R_EDGE})).filter(o=>o.r>1);
   return {n:LBL.length,past:past.map(o=>o.t+' by '+o.r.toFixed(1)+'px')};},[i,v]);
  n+=res.n;worst=Math.max(worst,res.past.length);
  ok(res.past.length===0,w.join('x')+'/'+people[i]+'/depth'+v+': past the ring: '+res.past.join(', '));}
 console.log('  '+w.join('x')+': '+n+' labels over '+people.length+' personas and 4 depths, '
  +(worst?'some past the ring':'none past the ring'));}
/* ============================================================
   And nothing past the dial's ring either.

   CR held the wheel to its edge and left the dial's callouts in its
   corners, asking as its Q5 whether they should come in. Ruled 26
   September, CT in TASKS.md, "for the field, I do not like the way
   that the words stick out", so they came in, and this holds them there
   on every profile at both widths. The dial is SVG and records nothing
   in LBL, so the ring is measured off the drawing, the outside of the
   domain band, and each callout line is read at its farthest corner.
   Run first against the build before the move: it failed there on every
   profile the dial names anything for.

   A zero here would pass by naming nothing, so the count of lines
   checked is printed and has to be more than nought at each width.
   ============================================================ */
console.log('\n=== every dial callout inside the ring, every persona ===');
for(const w of [[1680,1020],[390,844]]){
 await p.setViewportSize({width:w[0],height:w[1]});await p.waitForTimeout(160);
 let n=0;
 for(let i=0;i<people.length;i++){
  const res=await p.evaluate(async a=>{loadP(a);setTab(TAB.FIELD);fviewSet('dial');
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const fr=document.getElementById('frend');
   const doms=[...fr.querySelectorAll('.L-domains > [data-h]')].map(e=>e.getBoundingClientRect());
   const x0=Math.min(...doms.map(b=>b.left)),x1=Math.max(...doms.map(b=>b.right));
   const y0=Math.min(...doms.map(b=>b.top)),y1=Math.max(...doms.map(b=>b.bottom));
   const cx=(x0+x1)/2,cy=(y0+y1)/2,R=Math.max(x1-x0,y1-y0)/2;
   const lines=[...fr.querySelectorAll('[data-call] text')].map(t=>({t:t.textContent,b:t.getBoundingClientRect()}));
   const past=lines.map(o=>({t:o.t,r:Math.max(...[[o.b.left,o.b.top],[o.b.right,o.b.top],[o.b.left,o.b.bottom],
     [o.b.right,o.b.bottom]].map(q=>Math.hypot(q[0]-cx,q[1]-cy)))-R})).filter(o=>o.r>1);
   const box=[...fr.querySelectorAll('[data-call]')].map(g=>{const t=[...g.querySelectorAll('text')].map(e=>e.getBoundingClientRect());
    return {l:Math.min(...t.map(b=>b.left)),r:Math.max(...t.map(b=>b.right)),t:Math.min(...t.map(b=>b.top)),b:Math.max(...t.map(b=>b.bottom))};});
   let over=0;for(let j=0;j<box.length;j++)for(let k=j+1;k<box.length;k++){const A=box[j],B=box[k];
    if(A.l<B.r&&B.l<A.r&&A.t<B.b&&B.t<A.b)over++;}
   return {n:lines.length,past:past.map(o=>o.t+' by '+o.r.toFixed(1)+'px'),over:over};},i);
  n+=res.n;
  ok(res.past.length===0,w.join('x')+'/'+people[i]+'/dial: past the ring: '+res.past.join(', '));
  ok(res.over===0,w.join('x')+'/'+people[i]+'/dial: '+res.over+' callouts overlapping');}
 ok(n>0,w.join('x')+'/dial: the dial named nothing on any profile, so nothing was checked');
 console.log('  '+w.join('x')+': '+n+' callout lines over '+people.length+' personas, checked against the ring');}
/* ============================================================
   The Compass header clear of the Compass names, and the hint clear
   of the figure.

   EP in TASKS.md, 26 September. At 390 on Abraham, Flat, Regulation
   and Layers printed over Illumination and Desire and will on every
   lighting, and the line under the figure printed over the word
   Decoherent at both widths. Both were absolute blocks placed for a
   desk layout: the controls at top 10 of .cone-fig, which is the
   canvas top only while the rails are absolute too, and the hint at
   bottom 10, which is where the canvas draws its lowest label. The
   nameplate checks above never looked at this surface.

   Every lighting is read off LIGHTINGS at run time rather than listed
   here, and the counts checked have to be more than nought, so a
   renamed class cannot pass by finding nothing. Run first against the
   build before the fix: it failed there at 390 on every lighting.
   ============================================================ */
console.log('\n=== compass controls clear of the axis names, every lighting ===');
{const ab=people.indexOf('Abraham');
 const was=await p.evaluate(()=>S.theme);
 for(const w of [[1680,1020],[390,844]]){
  await p.setViewportSize({width:w[0],height:w[1]});await p.waitForTimeout(160);
  const lights=await p.evaluate(()=>LIGHTINGS.map(t=>t[0]));
  let nb=0,nr=0;const bad=[];
  for(const L of lights){
   await p.evaluate(a=>{loadP(a[0]);setTab(TAB.COMPASS);setLighting(a[1]);render();},[ab<0?0:ab,L]);
   await p.waitForTimeout(120);
   const res=await p.evaluate(()=>{
    const bx=e=>e.getBoundingClientRect();
    const hit=(a,c)=>a.left<c.right-0.5&&c.left<a.right-0.5&&a.top<c.bottom-0.5&&c.top<a.bottom-0.5;
    const btn=[...document.querySelectorAll('#cone .cone-ctl .cn-b')];
    const row=[...document.querySelectorAll('#cone .cn-nr')];
    const over=[];
    btn.forEach(x=>row.forEach(y=>{if(hit(bx(x),bx(y)))
     over.push(x.textContent.trim()+' over '+(y.querySelector('.cn-nq')||y).textContent.trim());}));
    const h=document.querySelector('#cone .cone-hint'),cv=document.getElementById('conecv');
    if(h&&cv&&hit(bx(h),bx(cv)))over.push('the hint over the figure');
    return {b:btn.length,r:row.length,over:over};});
   nb+=res.b;nr+=res.r;
   ok(res.over.length===0,w.join('x')+'/'+L+': '+res.over.join(', '));
   if(res.over.length)bad.push(L);}
  ok(nb>0&&nr>0,w.join('x')+'/compass: found '+nb+' controls and '+nr+' names, so nothing was checked');
  console.log('  '+w.join('x')+': '+lights.length+' lightings, '+nb+' controls against '+nr+' names, '
   +(bad.length?'overlapping on '+bad.join(' '):'none overlapping'));}
 await p.evaluate(k=>setLighting(k),was);}
/* ============================================================
   No words painted on the Compass figure but its two pole words, and
   the figure whole inside its own canvas.

   FW in TASKS.md, 27 September: "The Compass is completely broken. The
   hero graphic is being truncated by a bunch of small text." Regulation
   and Layers painted thirty words and numbers across the figure at 9.5
   to 10.5 pixels, and at 390 the halo sat on the canvas's top edge.
   Nothing above could see either: a painted word has no box. So the
   canvas's own fillText is wrapped and every string it is handed is
   read, with all three switches on and the figure turned, which is the
   state that painted the most. The pole glyphs are measured against the
   canvas the same way, and the key that now carries the words is held
   to the type floor, under the figure and not on it.

   Run first against the build before the fix: it failed at both widths
   on the painted words, and at 390 on the halo.
   ============================================================ */
console.log('\n=== compass figure carries no painted words, and fits its canvas ===');
for(const w of [[1680,1020],[1280,800],[390,844]]){
 await p.setViewportSize({width:w[0],height:w[1]});await p.waitForTimeout(160);
 for(const turned of [false,true]){
  const res=await p.evaluate(tn=>{
   loadP(0);setTab(TAB.COMPASS);render();
   /* the arrow figure is the side view since round IA; the view from above
      is measured in its own block below */
   CONE.side=true;
   CONE.reg=true;CONE.layers=true;CONE.flat=!tn;CONE.tilt=0.92;coneOpen(true);
   const said=[];const g=CONE.g;const ft=g.fillText;
   g.fillText=function(s){said.push(String(s));return ft.apply(this,arguments);};
   /* the halo and the fork go through coneGlyph, which strokes a Path2D at a
      translate; the pole words sit 22 inside each, so they bound the glyphs */
   const at=[];const tx=g.translate;
   g.translate=function(x,y){at.push(y);return tx.apply(this,arguments);};
   coneDraw();g.fillText=ft;g.translate=tx;
   const cv=CONE.cv,H=cv.height/CONE.dpr,bx=cv.getBoundingClientRect();
   const key=document.querySelector('#cone .cone-key');
   const kb=key&&key.getBoundingClientRect();
   const small=[...document.querySelectorAll('#cone .cone-key *')].filter(e=>
    e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())
    &&parseFloat(getComputedStyle(e).fontSize)<11).map(e=>e.textContent.trim());
   /* on a phone the names follow the figure; at desk they flank it */
   const nm=document.querySelector('#cone .cn-nms');
   const nmb=nm&&nm.getBoundingClientRect();
   const res={said:said.filter(s=>s!=='Coherent'&&s!=='Decoherent'),
    poles:said.length-said.filter(s=>s!=='Coherent'&&s!=='Decoherent').length,
    glyphs:at.length,top:Math.min(...at),bot:Math.max(...at)+17,H:H,
    key:!!key,keyOn:kb?kb.top>=bx.bottom-0.5:false,small:small,
    rows:key?key.querySelectorAll('.ck-r').length:0,
    /* a build without the key has none of these, and is reported, not thrown */
    want:typeof coneKey==='function'?CONE_HI.length+CONE_LO.length
     +coneRegLaws().up.length+coneRegLaws().dn.length:-1,
    phoneNames:nmb&&innerWidth<900?nmb.top>=bx.bottom-0.5:null};
   CONE.reg=false;CONE.layers=false;CONE.flat=true;CONE.tilt=0.60;CONE.side=false;coneOpen(true);
   return res;},turned);
  const tag=w.join('x')+(turned?'/turned':'/flat');
  ok(res.said.length===0,tag+': words painted on the figure: '+res.said.join(', '));
  ok(res.poles===2&&res.glyphs===2,tag+': the pole words and glyphs were not found ('
   +res.poles+' words, '+res.glyphs+' glyphs), so nothing was checked');
  ok(res.top>=0&&res.bot<=res.H,tag+': a pole glyph runs off the canvas, '
   +Math.round(res.top)+' to '+Math.round(res.bot)+' in '+Math.round(res.H));
  ok(res.key&&res.rows===res.want,tag+': the key under the figure carries '+res.rows+' rows, want '+res.want);
  ok(res.keyOn,tag+': the key sits on the figure rather than under it');
  ok(res.small.length===0,tag+': key text under the 11px floor: '+res.small.join(', '));
  if(res.phoneNames!==null)ok(res.phoneNames,tag+': the names print in front of the figure');
  console.log('  '+tag+': '+(res.said.length?res.said.length+' painted words':'no painted words')
   +', glyphs '+Math.round(res.top)+' to '+Math.round(res.bot)+' of '+Math.round(res.H)
   +', key '+res.rows+' rows');}}
/* ============================================================
   The view from above, round IA, held to the same two rules: no word
   painted on the figure at all, and every glyph inside the canvas. It
   paints sixteen glyphs round a rim and a hub rather than two on an axis,
   so each one is read off coneGlyph's own translate and scale, which is
   where it is and how big. Regulation is switched on as well, because
   from above it has no spine to draw on, and its caption printing under
   a figure that shows no arrows would be a dead control's key.
   ============================================================ */
console.log('\n=== compass from above carries no painted words, and fits its canvas ===');
for(const w of [[1680,1020],[1280,800],[390,844]]){
 await p.setViewportSize({width:w[0],height:w[1]});await p.waitForTimeout(160);
 const res=await p.evaluate(()=>{
  loadP(0);setTab(TAB.COMPASS);render();
  CONE.side=false;CONE.reg=true;CONE.layers=true;coneOpen(true);
  const said=[],box=[];const g=CONE.g,ft=g.fillText,tx=g.translate,sc=g.scale;let at=null;
  g.fillText=function(s){said.push(String(s));return ft.apply(this,arguments);};
  g.translate=function(x,y){at=[x,y];return tx.apply(this,arguments);};
  g.scale=function(k){if(at){box.push([at[0],at[1],24*k]);at=null;}return sc.apply(this,arguments);};
  coneDraw();g.fillText=ft;g.translate=tx;g.scale=sc;
  const cv=CONE.cv,W=cv.width/CONE.dpr,H=cv.height/CONE.dpr;
  const off=box.filter(b=>b[0]<0||b[1]<0||b[0]+b[2]>W||b[1]+b[2]>H).length;
  const key=document.querySelector('#cone .cone-key');
  const res={said:said,glyphs:box.length,off:off,W:W,H:H,
   rows:key?key.querySelectorAll('.ck-r').length:0,want:CONE_HI.length+CONE_LO.length,
   axes:MIRROR.length,regBtn:!!document.querySelector('#cone [data-cn="reg"]')};
  CONE.reg=false;CONE.layers=false;coneOpen(true);
  return res;});
 const tag=w.join('x')+'/above';
 ok(res.said.length===0,tag+': words painted on the figure: '+res.said.join(', '));
 ok(res.glyphs>=res.axes,tag+': found '+res.glyphs+' glyphs, want at least '+res.axes+', so nothing was checked');
 ok(res.off===0,tag+': '+res.off+' glyphs run off the '+Math.round(res.W)+' by '+Math.round(res.H)+' canvas');
 ok(res.rows===res.want,tag+': the key carries '+res.rows+' rows, want the '+res.want+' Layers rows only');
 ok(!res.regBtn,tag+': the Regulation switch is offered where it draws nothing');
 console.log('  '+tag+': '+(res.said.length?res.said.length+' painted words':'no painted words')
  +', '+res.glyphs+' glyphs, '+res.off+' off the canvas, key '+res.rows+' rows');}
/* the wheel again, which is what every check below is measured on, and a
   stored view outlives the page */
await p.evaluate(()=>fviewSet('wheel'));
await p.setViewportSize({width:1680,height:1020});await p.waitForTimeout(160);
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
