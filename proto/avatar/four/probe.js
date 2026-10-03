/* Reads the prototype's own numbers back and checks them against the product.
     NODE_PATH=/opt/node22/lib/node_modules node proto/avatar/four/probe.js */
const {chromium}=require('playwright');
const path=require('path');
const PAGE='file://'+path.join(__dirname,'four.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);
 await p.waitForFunction(()=>document.documentElement.getAttribute('data-avx-ready')==='1',null,{timeout:30000});
 const out=await p.evaluate(()=>{
  const row=R=>({CQ:+R.CQ.toFixed(2),tier:R.tier,rad:+R.radiance.toFixed(3),EX:+R.EX.toFixed(1),DQ:+R.DQ.toFixed(1),
   speed:+(R.speed*100).toFixed(1),carry:R.carryingN,rel:R.rec.n,seatsRel:R.rec.ns,dk:R.dk,place:R.place,sab:R.sab,
   rit:R.rit&&R.rit.nm,pass:R.seats.map(s=>s.k+':'+s.pass.toFixed(2)).join(' ')});
  const res={};
  ['James','Angela','blank'].forEach(w=>{AVX.set('who',w);
   res[w]=AVX.ST.snaps.map((s,i)=>i===0||i===4||i===AVX.ST.snaps.length-1?Object.assign({runs:i},row(s)):null).filter(Boolean);
   res[w+'_n']=AVX.ST.snaps.length-1;});
  /* determinism: build James twice, the arrival and the last step must agree to the digit */
  AVX.set('who','James');const a=JSON.stringify(AVX.ST.snaps.map(s=>[s.CQ,s.radiance,s.speed]));
  AVX.set('who','James');const b=JSON.stringify(AVX.ST.snaps.map(s=>[s.CQ,s.radiance,s.speed]));
  res.deterministic=a===b;
  /* the rails and the avatar on one state: settle at 12 and read compute() directly */
  AVX.set('runs',12);const r=compute(),R=AVX.read();
  res.agree={CQ:[r.CQ,R.CQ],carry:[r.carrying.length,R.carryingN],who:S.who,runs:AVX.ST.runs};
  return res;});
 console.log(JSON.stringify(out,null,1));
 console.log('page errors:',errs.length?errs:'none');
 await b.close();})();
