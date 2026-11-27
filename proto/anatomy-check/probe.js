/* Where the shipped build draws every address today, read out of the build
   itself rather than re-implemented.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/anatomy-check/probe.js

   Writes proto/anatomy-check/today.json. Nothing under atuned_src/ is read
   or written: the page is the built source.html, opened in Chromium, and
   every number here comes from the product's own pmNode, PMBANDS, BODYPATH
   and figure transform.

   Three reads, because a probe that lies is worse than none:
   1. geometry: pmNode for all 108, and whether each point lies inside the
      body path the Body page clips its marks to. A point off the body is
      then tested against the widest ring the page can draw (radius 2.6
      units plus half of a 0.6 unit stroke), which is the whole of what
      "never shown at any weight" means below.
   2. the known good case: the marks the Body page actually renders for
      loaded profiles must sit where pmNode says, or the probe is wrong.
   3. pixels: on the two profiles that draw the most rings and the largest
      rings, each "never shown" mark is hidden one at a time and the
      screen is compared. Marks on the body are the control. */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs'), crypto=require('crypto');
const {execSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..','..');
const SRC=path.join(ROOT,'source.html');
const OUT=path.join(__dirname,'today.json');
(async()=>{
 const md5=crypto.createHash('md5').update(fs.readFileSync(SRC)).digest('hex');
 const commit=execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();
 const dirty=execSync('git status --porcelain source.html',{cwd:ROOT}).toString().trim()!=='';
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:2});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto('file://'+SRC);
 await p.waitForTimeout(1500);
 const geo=await p.evaluate(()=>{
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 100 100');
  svg.style.cssText='position:absolute;left:-9999px;top:0;width:100px;height:100px';
  const pa=document.createElementNS(NS,'path'); pa.setAttribute('d',BODYPATH); svg.appendChild(pa);
  document.body.appendChild(svg);
  const inside=(x,y)=>pa.isPointInFill(new DOMPoint((x-PMTX)/PMS,(y-PMTY)/PMS));
  const rows=NODES.filter(n=>n.i<=108).map(n=>{
   const q=pmNode(n.i,B2K[n.b]); const onBody=inside(q.x,q.y); let reach=onBody;
   for(let r=0.2;r<=2.9&&!reach;r+=0.1)for(let a=0;a<180;a++){const t=a/180*2*Math.PI;
    if(inside(q.x+r*Math.cos(t),q.y+r*Math.sin(t))){reach=true;break;}}
   return {i:n.i,k:n.k,b:n.b,n:n.n,x:+q.x.toFixed(3),y:+q.y.toFixed(3),
    state:onBody?'body':(reach?'edge':'never')};});
  return {rows,
   seats:PMBANDS.map(s=>({k:s.k,b:s.b,nm:s.nm,yp:s.yp})),
   flow:FLOWSEAT.map(f=>({k:f.k,nv:f.nv,vt:f.vt,seat:f.seat})),
   fig:{PMS,PMTX,PMTY,BODYPATH}};
 });
 const byI={}; geo.rows.forEach(r=>byI[r.i]=r);
 /* 2. the known good case */
 const known=[];
 for(const w of [5,8,13]){
  const d=await p.evaluate(w=>{loadP(w);setTab(TAB.ENERGY);PMLAYER='bands';render();
   return {nm:PEOPLE[w].nm||PEOPLE[w].name||String(w),marks:[...document.querySelectorAll('#emap .pm-n[data-node]')].map(g=>{
    const c=g.querySelector('circle');return {i:+g.dataset.node,x:+c.getAttribute('cx'),y:+c.getAttribute('cy')};})};},w);
  let worst=0; d.marks.forEach(m=>{const r=byI[m.i];worst=Math.max(worst,Math.abs(r.x-m.x),Math.abs(r.y-m.y));});
  known.push({profile:w,drawn:d.marks.length,worstDiff:+worst.toFixed(3)});
 }
 /* 3. pixels, one mark at a time. The boot sheet is a fixed overlay on a
    five second fade and has to be out of the way, or this photographs it. */
 const pix=[];
 const never=geo.rows.filter(r=>r.state==='never').map(r=>r.i);
 for(const w of [7,13]){
  await p.evaluate(w=>{loadP(w);setTab(TAB.ENERGY);PMLAYER='bands';render();
   const bt=document.getElementById('boot');if(bt)bt.style.display='none';},w);
  await p.waitForTimeout(900);
  const res={profile:w,hidden:0,shown:0,notDrawn:0,controlsShown:0,controls:0};
  for(const id of never.concat([1,49,33])){
   const box=await p.evaluate(i=>{const g=document.querySelector('#emap .pm-n[data-node="'+i+'"]');
    if(!g)return null;const r=g.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};},id);
   if(!box){ if(never.includes(id))res.notDrawn++; continue; }
   const clip={x:box.x-2,y:box.y-2,width:box.w+4,height:box.h+4};
   const a=await p.screenshot({clip});
   await p.evaluate(i=>{document.querySelector('#emap .pm-n[data-node="'+i+'"]').style.display='none';},id);
   await p.waitForTimeout(80);
   const c=await p.screenshot({clip});
   await p.evaluate(i=>{document.querySelector('#emap .pm-n[data-node="'+i+'"]').style.display='';},id);
   const same=Buffer.compare(a,c)===0;
   if(never.includes(id)){ same?res.hidden++:res.shown++; }
   else { res.controls++; if(!same)res.controlsShown++; }
  }
  res.nm=await p.evaluate(w=>PEOPLE[w].nm||PEOPLE[w].name||String(w),w);
  pix.push(res);
 }
 await b.close();
 const out={stamp:{commit,md5,sourceDirty:dirty,read:new Date().toISOString()},
  known,pixels:pix,errors:errs,...geo};
 fs.writeFileSync(OUT,JSON.stringify(out,null,1));
 const count=s=>geo.rows.filter(r=>r.state===s).length;
 console.log('source.html',md5,'at',commit,dirty?'(dirty)':'');
 console.log('on the body',count('body'),' cut at the edge',count('edge'),' never shown',count('never'));
 console.log('known good case',JSON.stringify(known));
 console.log('pixels',JSON.stringify(pix));
 console.log('page errors',errs.length?errs:'none');
})();
