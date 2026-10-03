/* MEASURE THE PIN AND THE ZOOM. DB in TASKS.md. Writes measure-pin.json.

   1. CAN A FINGER PICK A LINE, and how much zoom it takes. For every chord
      on each profile, the clearest point along its middle 70 percent: the
      furthest it gets from every other chord, in screen pixels at the
      zoom showing, in the shipped app's own CSS pixels. A line can be picked by a finger when that clearance is
      at least 7px, half the 14px radius this page gives a touch, so the
      finger's centre can be nearer to it than to anything else with a
      margin. Measured at zoom 1 and derived for 2, 2.5, 3 and 4: every
      distance on the canvas scales with the zoom, and so does clearance.
      A mouse is given half that, 3.5px.

   2. WHAT PINS COST. On Gordon, the heaviest profile, three chains pinned
      and a fourth held and humming, 240 frames each at zoom 1 and zoom 3,
      the overlay's own draw time, against the shipped wheel's own draw
      time that measure-hover.js recorded in measure-hover.json.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-overlay/measure-pin.js */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname,EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async()=>{
 const b=await chromium.launch({executablePath:EXE});
 const out={sep:{},cost:{}};
 for(const who of ['Sofia','James','Gordon'])for(const w of [390,1600]){
  const p=await b.newPage({viewport:{width:1300,height:1000}});
  await p.goto('file://'+path.join(DIR,'pin.html')+'?rec=1&title=0&who='+who+'&w='+w);
  await p.waitForFunction(()=>window.__rec);
  const r=await p.evaluate(()=>{const G=__pin.G(),s=__pin.fv().s,X=OVL_LIB;
   const cl=G.links.map(l=>{let bd=0;for(let t=.15;t<=.85;t+=.01){const q=X.at(l.S,t);let m=1e9;
     for(const o of G.links){if(o===l)continue;const P=o.S.pts;for(let j=1;j<P.length;j++){const a=P[j-1],c=P[j],dx=c[0]-a[0],dy=c[1]-a[1],L=dx*dx+dy*dy||1,
      u=Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/L));m=Math.min(m,Math.hypot(q[0]-a[0]-dx*u,q[1]-a[1]-dy*u));}}
     bd=Math.max(bd,m);}return bd;});
   return {n:cl.length,cl:cl,s:s};});
  const share=(k,need)=>Math.round(1000*r.cl.filter(c=>c*k>=need).length/r.n)/10;
  const sorted=r.cl.slice().sort((a,b)=>a-b);
  const stuck=r.cl.filter(c=>c<.05).length;
  out.sep[who+' '+w]={lines:r.n,onTopOfAnother:stuck,medianClearPx:+sorted[r.n>>1].toFixed(2),
   finger:{z1:share(1,7),z2:share(2,7),'z2.5':share(2.5,7),z3:share(3,7),z4:share(4,7)},
   mouse:{z1:share(1,3.5),z2:share(2,3.5),z3:share(3,3.5)}};
  console.log(who,w,JSON.stringify(out.sep[who+' '+w]));
  await p.close();}
 /* the cost */
 const p=await b.newPage({viewport:{width:1300,height:1000}});
 await p.goto('file://'+path.join(DIR,'pin.html')+'?rec=1&title=0&who=Gordon&close=1');
 await p.waitForFunction(()=>window.__rec);
 const c=await p.evaluate(()=>{const ov=__pin.ov(),fv=__pin.fv(),G=__pin.G();
  const by=G.links.filter(l=>l.lv===0&&l.load>0).sort((a,b)=>b.load-a.load),picked=[],used={};
  for(const l of by){if(used[l.to])continue;used[l.to]=1;picked.push(l);if(picked.length===4)break;}
  let t=0;const run=(k)=>{fv.V={k:k,ox:k>1?G.cv.w*.3:0,oy:k>1?G.cv.h*.3:0};ov.V=fv.V;
   const ms=[];for(let i=0;i<240;i++){t+=1000/60;const t0=performance.now();ov.frame(t);ms.push(performance.now()-t0);}
   ms.sort((a,b)=>a-b);return {median:+ms[120].toFixed(3),p95:+ms[228].toFixed(3)};};
  for(let i=0;i<3;i++){ov.hover(picked[i],t);t+=3000;ov.toggle(picked[i],t);}
  ov.hover(picked[3],t);
  return {pinned:3,held:1,z1:run(1),z3:run(3)};});
 let ref=null;try{ref=JSON.parse(fs.readFileSync(path.join(DIR,'measure-hover.json'),'utf8'));}catch(e){}
 out.cost={gordon:c,note:'overlay draw in ms per frame on this machine, three chains pinned and a fourth held humming'};
 if(ref)out.cost.reference={shippedFieldDraw:ref.cost['cpu x1']['shipped Field draw()'],from:'measure-hover.json, cpu x1'};
 console.log('cost',JSON.stringify(out.cost));
 fs.writeFileSync(path.join(DIR,'measure-pin.json'),JSON.stringify(out,null,1)+'\n');
 await b.close();
})();
