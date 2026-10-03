/* ============================================================
   MEASURE THE ICONS, THEN PHOTOGRAPH THEM.

   Measured first, pictures second. Every icon in #doms, #ar1 and #roots is
   scored the way a browser paints it: the stroke composited through its own
   opacity onto its tile, the tile composited through every see through
   layer to the first opaque ancestor (the probe design.js uses for the
   figure floor, walked in full, because the one layer skipped is the lesson
   that gate records). Scored for contrast against that tile, where WCAG's
   non text floor is 3 to 1, and for OKLCH chroma, which is what "dull"
   means when it is measured.

   Glass and Glass white paint the rail over a moving ground through a
   backdrop blur, which no computed style can see. Their numbers are the
   pane's own tint over the first opaque ancestor and are marked as
   approximate rather than dropped.

     node proto/rooticons/build.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/rooticons/shoot.js
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'shots');
const PAGE='file://'+path.join(__dirname,'rooticons.html');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(OUT,{recursive:true});

const measure=p=>p.evaluate(()=>{
 const rgb=s=>{const v=(String(s).match(/[\d.]+/g)||[0,0,0]).map(Number);
  const a=/^color\(/.test(String(s).trim())?v.slice(0,3).map(x=>x*255):v.slice(0,3);
  return {c:a,a:(v.length>3?v[3]:1)};};
 const lum=c=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
  return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);};
 const comp=(f,a,g)=>f.map((v,i)=>v*a+g[i]*(1-a));
 const ratio=(a,b)=>{const A=lum(a),B=lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05);};
 const painted=e=>{const st=[];let n=e;
  while(n&&n.nodeType===1){const p=rgb(getComputedStyle(n).backgroundColor);
   if(p.a>=0.999){st.push(p.c);break;} if(p.a>0.001)st.push(p); n=n.parentElement;}
  let o=st.pop(); if(!Array.isArray(o))o=[0,0,0];
  while(st.length){const l=st.pop();o=comp(l.c,l.a,o);} return o;};
 const opac=e=>{let o=1,n=e;while(n&&n.nodeType===1){o*=parseFloat(getComputedStyle(n).opacity||'1');n=n.parentElement;}return o;};
 const ch=c=>RI.rgb2oklch(c.map(v=>v/255))[1];
 const fam=sel=>{const out=[];document.querySelectorAll(sel).forEach(b=>{
  const s=b.querySelector('svg');if(!s)return;
  const cs=getComputedStyle(s), g=painted(b), stroke=rgb(cs.stroke);
  const eff=comp(stroke.c,opac(s),g);
  out.push({nm:b.getAttribute('aria-label')||b.dataset.r,cr:ratio(eff,g),c:ch(eff),
   pressed:b.getAttribute('aria-pressed')==='true'||b.dataset.r==='2'});});
  const rest=out.filter(x=>!x.pressed);
  const min=rest.reduce((m,x)=>x.cr<m.cr?x:m,{cr:99});
  return {n:out.length,minCR:+min.cr.toFixed(2),minAt:min.nm,
   meanC:+(rest.reduce((s,x)=>s+x.c,0)/Math.max(1,rest.length)).toFixed(4)};};
 /* the root chip's name is text and takes the text floor, 4.5 */
 const roots=[...document.querySelectorAll('#roots .rootb')].map(b=>{
  const g=painted(b), t=comp(rgb(getComputedStyle(b).color).c,opac(b),g);
  return {r:b.dataset.r,cr:+ratio(t,g).toFixed(2),state:b.getAttribute('aria-pressed')==='true'?'added':b.dataset.lit?'washed':'off'};});
 return {doms:fam('#doms .ib'),arch:fam('#ar1 .ib'),rootIcons:fam('#roots .rootb.ri'),roots,
  rail:Math.round(document.querySelector('[data-sec=soul] .lsec-bd').getBoundingClientRect().height)};});

(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const facts={};
 const L=['dark','snow','punch','glass','glasswhite','flat','lumen'];
 const C=[['ship','0','none'],['a','0','rec'],['b','0','rec'],['c','0','rec'],['a','1','rec'],['b','1','rec'],['c','1','rec']];
 /* ---- measure, every lighting, every option, at 1600 ---- */
 {const ctx=await b.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:1});
  const p=await ctx.newPage();
  await p.goto(PAGE+'#g=none&c=ship&s=0&l=dark');
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-ri-ready')==='1',null,{timeout:30000});
  await p.waitForTimeout(800);
  /* the tiles transition colour over --t-micro, and a probe that reads
     inside that window reads the state before. The first run did exactly
     that: Glass on Shipped reported Option B's chroma to four places. The
     measurement is of the settled state, so transitions are off for it. */
  await p.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation-duration:0s!important}'});
  for(const l of L)for(const [c,s,g] of C){
   await p.evaluate(([l,c,s,g])=>{Object.assign(RI.ST,{l,c,s,g});RI.apply();},[l,c,s,g]);
   await p.waitForTimeout(160);
   facts[l+'/'+c+'/s'+s+'/'+g]=await measure(p);}
  await ctx.close();}
 fs.writeFileSync(path.join(OUT,'facts.json'),JSON.stringify(facts,null,1));
 console.log('lighting    option   doms minCR  meanC | arch(accent/seat) minCR  meanC | root icon minCR | root name min');
 for(const k of Object.keys(facts)){const f=facts[k];
  console.log(k.padEnd(26),String(f.doms.minCR).padStart(5)+' '+String(f.doms.minAt).split(',')[0].slice(0,9).padEnd(9),String(f.doms.meanC).padStart(7),'|',
   String(f.arch.minCR).padStart(5)+' '+String(f.arch.minAt).slice(0,9).padEnd(9),String(f.arch.meanC).padStart(7),'|',
   f.rootIcons.n?String(f.rootIcons.minCR).padStart(5):'   --','|',
   Math.min(...f.roots.map(r=>r.cr)).toFixed(2),' rail',f.rail);}

 /* ---- photograph the Awareness section, the real rail, both widths ---- */
 const SHOTS=[['0-shipped','none','ship','0'],['1-icons-only','rec','ship','0'],
  ['2-A-dim-off','rec','a','0'],['3-B-plus15','rec','b','0'],['4-C-plus30','rec','c','0'],
  ['5-B-plus15-seat','rec','b','1'],['6-C-plus30-seat','rec','c','1'],['7-alt-B','alt','b','0']];
 const OTHER=['0-shipped','3-B-plus15','5-B-plus15-seat'];
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600;
  const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,hasTouch:phone,isMobile:phone});
  const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  await p.goto(PAGE+'#g=none&c=ship&s=0&l=dark');
  await p.waitForFunction(()=>document.documentElement.getAttribute('data-ri-ready')==='1',null,{timeout:30000});
  await p.waitForTimeout(900);
  await p.addStyleTag({content:'*,*::before,*::after{transition:none!important}'});
  /* at 390 the rail is where the product puts it; find the section and
     bring it into view rather than assuming a layout */
  for(const l of ['dark','snow','punch','glass','glasswhite','flat','lumen']){
   for(const [nm,g,c,s] of SHOTS){
    if(l!=='dark'&&!OTHER.includes(nm))continue;
    await p.evaluate(([l,c,s,g])=>{Object.assign(RI.ST,{l,c,s,g});RI.apply();
     document.getElementById('ri-panel').style.display='none';
     const sec=document.querySelector('[data-sec=soul]');sec.classList.add('open');
     sec.scrollIntoView({block:'start'});},[l,c,s,g]);
    await p.mouse.move(W-4,H-4); await p.waitForTimeout(350);
    const el=await p.$('[data-sec=soul]');
    const bx=await el.boundingBox();
    if(!bx||bx.width<10){console.log('  no rail section on screen at',W,l,nm);continue;}
    await el.screenshot({path:`${OUT}/${l}-${nm}-${W}.png`});}}
  /* and one whole screen per width, with the panel showing, so the rail is
     seen in the product and not only as a crop */
  await p.evaluate(()=>{Object.assign(RI.ST,{l:'dark',c:'b',s:'1',g:'rec'});RI.apply();
   document.getElementById('ri-panel').style.display='';window.scrollTo(0,0);});
  await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/screen-dark-B-seat-${W}.png`});
  if(errs.length)console.log('  page errors at',W,errs.slice(0,3));
  await ctx.close();}
 await b.close();
 console.log('shots in',OUT);
})();
