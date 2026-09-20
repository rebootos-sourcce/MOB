/* ============================================================
   THE HIT CENSUS, CORRECTED. The first pass of this probe set S.depth,
   which no code reads: ui/wheel.js:989 calls drawWheel(r,effView()) and
   effView() at :523 reads S.view plus a zoom bonus. So the first pass
   printed sixteen identical rows under four different headings, which is
   the same failure MONITOR's own history records.

   The second pass set S.view and called render(), and printed the same
   number again. render() does not fill HIT: draw() does, at wheel.js:989,
   off the animation loop. So the probe now sets the state and then yields
   two real frames before reading HIT, which is the only way to read what
   was actually drawn rather than what was drawn before the probe touched
   anything.

   PROBE CHECK, and it is the check the first pass did not have: the row
   for view 3 must differ from the row for view 0, because ui/wheel.js
   draws archetypes only at L>=2 and masks and domains only at L===3. If
   the rows are identical the probe is still driving nothing.
   ============================================================ */
const {chromium}=require('playwright');
const path='file://'+require('path').resolve('/home/user/MOB/source.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(path,{waitUntil:'load'}); await pg.waitForTimeout(1800);
 const rows=await pg.evaluate(async()=>{
  const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const out=[];
  for(const nm of ['You','Marcus','Diane']){
   let idx=-1;PEOPLE.forEach((p,i)=>{if(p.nm===nm)idx=i;});
   loadP(idx);
   for(const v of [0,1,2,3]) for(const z of [1,3.6]){
    S.view=v; S.zoom=z; S.pin=null;
    await frame();
    const by={};HIT.forEach(x=>by[x.k]=(by[x.k]||0)+1);
    out.push({nm,v,z,eff:effView(),total:HIT.length,by});}}
  return out;});
 const v0=rows.filter(r=>r.nm==='Marcus'&&r.v===0&&r.z===1)[0];
 const v3=rows.filter(r=>r.nm==='Marcus'&&r.v===3&&r.z===1)[0];
 console.log('PROBE CHECK  view 0 and view 3 must differ');
 console.log('  view 0 total '+v0.total+'   view 3 total '+v3.total
  +(v0.total!==v3.total?'   ok':'   PROBE BROKEN'));
 if(v0.total===v3.total){await b.close();process.exit(1);}
 console.log('');
 console.log('HIT ENTRIES ON THE FIELD, 1600x1000');
 console.log('profile  S.view  zoom  effView  total   breakdown');
 rows.forEach(r=>console.log(r.nm.padEnd(9)+String(r.v).padEnd(8)+String(r.z).padEnd(6)
  +String(r.eff).padEnd(9)+String(r.total).padEnd(8)+JSON.stringify(r.by)));
 console.log('');
 console.log('THE ONE NUMBER THAT MATTERS HERE: k=law and k=core, across every row');
 const laws=new Set(rows.map(r=>r.by.law||0)), cores=new Set(rows.map(r=>r.by.core||0));
 console.log('  k=law  values seen: '+[...laws].join(', '));
 console.log('  k=core values seen: '+[...cores].join(', '));
 await b.close();
})();
