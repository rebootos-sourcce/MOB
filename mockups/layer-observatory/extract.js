/* extract.js. Writes chain.js: the real saboteur, complex and hyper complex chain for the example people.
   Run from the repo root with NODE_PATH at a playwright install:   node mockups/layer-observatory/extract.js
   It opens source.html in Chromium, loads each person with the app's own loadP, and calls the engine's own compute().

   REAL: step 12 of every person is the unscaled reading, exactly what compute() returns for that example.
   MOCK: steps 1 to 11 are a made-up history. The charge is scaled up by a fixed schedule (each fetter starts at its own
   moment and rises on a smoothstep, with a small wobble that dies out by the last entry), and the replacement values
   scale with it. Then the engine's own compute() runs at every step, so the chain at each step is real arithmetic over
   mock input. No entry text exists; the dates are not real. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const WHO=['Sofia','Marcus','Derek','Tomas','Wren','Rosa'];
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+path.resolve(__dirname,'../../source.html'));await p.waitForTimeout(2500);
 const stamp=await p.evaluate(()=>{const m=document.documentElement.outerHTML.match(/\b[0-9a-f]{7} 20\d\d-\d\d-\d\d \d\d:\d\d/);return m?m[0]:null;});
 const out=await p.evaluate((WHO)=>{
  const r2=v=>Math.round(v*100)/100;
  const sm=x=>x*x*(3-2*x), cl=(v,a,b)=>v<a?a:v>b?b:v;
  const res={families:{},famPole:FAM_POLE,people:{}};
  HCX_LIB.forEach(h=>{res.families[h.nm]=h.d;res.families[FAM_POLE[h.nm]]='the fix for '+h.nm.toLowerCase()+', done past the point where it helps';});
  WHO.forEach(nm=>{
   const i=PEOPLE.findIndex(q=>q.nm===nm);loadP(i);
   const fin={},finR={};CHILD.forEach(c=>{fin[c.nm]=S.charge[c.nm];finR[c.nm]=S.replace[c.nm];});
   const steps=[],K=12;
   for(let j=0;j<K;j++){
    const u=j/(K-1);
    CHILD.forEach((c,f)=>{
     const o=((f*5)%9)/9*.45, lv=sm(cl((u-o)/.55,0,1));
     const wob=.2*Math.sin(Math.PI*2*(1.7*u+f*.37))*(1-u)*Math.min(1,lv*3);
     const k=cl(lv+wob,0,1);
     S.charge[c.nm]=r2(fin[c.nm]*(j===K-1?1:k));
     S.replace[c.nm]=r2(finR[c.nm]*(j===K-1?1:k));});
    const r=compute();
    steps.push({
     ch:CHILD.map(c=>S.charge[c.nm]),
     q:W.map(n=>r2(n.sq)),
     sab:r.sabs.map(s=>[s.nm,r2(s.w),s.over?1:0,s.hcx,s.parts.map(n=>n.slot)]),
     cx:r.cxs.map(c=>[c.nm,r2(c.w),c.over?1:0,c.hcx,c.parts.map(s=>s.nm)]),
     hy:r.hys.map(h=>[h.nm,r2(h.w),h.over?1:0,h.parts.map(c=>c.nm)]),
     sup:r.sups.length,dq:r2(r.DQ),cq:r2(r.CQ)});}
   res.people[nm]={fin:fin,steps:steps,cf:W.map(n=>n.cf||null),addrName:W.map(n=>n.k),band:W.map(n=>n.b)};
  });
  return res;},WHO);
 out.stamp=stamp;
 fs.writeFileSync(path.join(__dirname,'chain.js'),'/* Real engine chain, dumped by extract.js from source.html (build '+stamp+'). Steps 1 to 11 of each person are a MOCK history; step 12 is the real reading. */\nwindow.OBS='+JSON.stringify(out)+';\n');
 WHO.forEach(n=>{const s=out.people[n].steps;console.log(n,s.map(x=>x.sab.length+'/'+x.cx.length+'/'+x.hy.length).join(' '));});
 console.log(stamp,errs);await b.close();
})();
