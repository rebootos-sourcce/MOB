/* ============================================================
   THE THIRTY ONE CORE MARKS, AND WHAT A PRESS ON EACH ONE RETURNS.
   Independent of DESIGN-feathers.md, which makes the same claim. The
   angles and lengths are read straight out of ui/wheel.js coreInside()
   at :312 to :322 and the core rim out of the k=core HIT entry, whose
   radius solCore pushes at :399 as cr0*1.5.

   PROBE CHECKS, first:
     1  a node wedge midpoint must return kind 'node'. That is the same
        known good case the feathers pass used, and it proves hitTest and
        HIT are being read correctly rather than returning a default.
     2  a law spoke midpoint must return kind 'law'. Twenty one of those
        targets exist outside the rim, so if the outside copy answers and
        the inside copy does not, the difference is the product's.
     3  the frame must actually have been drawn at the zoom asked for, so
        coreLayerA(2) is printed: at or below 0 no law layer is on screen
        and the test would be measuring an empty circle.
   ============================================================ */
const {chromium}=require('playwright');
const path='file://'+require('path').resolve('/home/user/MOB/source.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(path,{waitUntil:'load'}); await pg.waitForTimeout(1800);

 const out=await pg.evaluate(async()=>{
  const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  let idx=-1;PEOPLE.forEach((p,i)=>{if(p.nm==='Marcus')idx=i;});
  loadP(idx);
  const res={};
  for(const z of [1.6,2.5,3.6,4.6]){
   S.view=3; S.zoom=z; S.pin=null;
   await frame();
   const core=HIT.filter(h=>h.k==='core')[0];
   const cr0=core.rad/1.5, CXv=core.x, CYv=core.y;
   /* check 1: a node wedge */
   const nh=HIT.filter(h=>h.k==='node')[0];
   const nAng=(nh.a0+nh.a1)/2, nR=(nh.r0+nh.r1)/2;
   const c1=hitTest(CXv+Math.cos(nAng)*nR, CYv+Math.sin(nAng)*nR);
   /* check 2: a law spoke */
   const lh=HIT.filter(h=>h.k==='law')[0];
   const lAng=(lh.a0+lh.a1)/2, lR=(lh.r0+lh.r1)/2;
   const c2=hitTest(CXv+Math.cos(lAng)*lR, CYv+Math.sin(lAng)*lR);
   const r=compute();
   const spin=(typeof REDUCED!=='undefined'&&REDUCED)?0:S.t*0.05;
   const marks=[];
   SI.forEach((l,i)=>marks.push({layer:'law',nm:l.nm,
    a:i/SI.length*Math.PI*2-Math.PI/2+spin, len:cr0*0.93*(S.law[l.nm]||0)/10}));
   BANDS.forEach((bd,i)=>marks.push({layer:'seat',nm:bd,
    a:i/BANDS.length*Math.PI*2-Math.PI/2-spin*0.6, len:cr0*0.86*bandIg(bd)/10}));
   [[r.X,'vitality'],[r.Y,'awareness'],[r.Z,'will']].forEach((x,i)=>marks.push({
    layer:'triad',nm:x[1],a:i/3*Math.PI*2-Math.PI/2+spin*0.3, len:cr0*0.80*x[0]}));
   const got={};
   marks.forEach(m=>{
    const x=CXv+Math.cos(m.a)*m.len*0.97, y=CYv+Math.sin(m.a)*m.len*0.97;
    const t=hitTest(x,y); const k=t?t.k:'(null)';
    got[k]=(got[k]||0)+1;});
   res[z]={cr0:+cr0.toFixed(1), layerA2:+coreLayerA(2).toFixed(3),
    check1:c1?c1.k:'(null)', check2:c2?c2.k:'(null)', marks:marks.length, got};}
  return res;});

 console.log('PROBE CHECKS, per zoom');
 let bad=0;
 Object.keys(out).forEach(z=>{const r=out[z];
  const ok=(r.check1==='node'&&r.check2==='law'&&r.layerA2>0);
  if(!ok)bad++;
  console.log('  zoom '+z+'   node wedge -> '+r.check1+'   law spoke -> '+r.check2
   +'   coreLayerA(2) = '+r.layerA2+(ok?'   ok':'   PROBE BROKEN'));});
 if(bad){console.log('\nsome zooms did not resolve the law layer, so those rows are not evidence.');}
 console.log('');
 console.log('WHAT A PRESS AT EACH OF THE THIRTY ONE CORE MARK TIPS RETURNS, Marcus, view 3');
 console.log('zoom  cr0px   marks  what hitTest returns');
 Object.keys(out).forEach(z=>{const r=out[z];
  console.log(String(z).padEnd(6)+String(r.cr0).padEnd(8)+String(r.marks).padEnd(7)
   +JSON.stringify(r.got));});
 await b.close();
})();
