/* ============================================================
   THE BROWSER PROBE. Drives the real source.html in a real Chromium and
   reads what the product actually puts on screen, because the engine alone
   cannot say what a person can press or read.

   PROBE CHECKS, first, on known good cases the repository already asserts:
     1  the page boots and the Field is the open tab (CLAUDE.md, ruled 19 Sep)
     2  hitTest at the midpoint of a node wedge returns kind 'node', which is
        the same known good case DESIGN-feathers.md used to validate its own
        hit probe. If this fails the HIT numbers below are the probe's.
     3  SI.length is 21 inside the page, so the page holds the same table the
        engine gate asserts.
   ============================================================ */
const {chromium}=require('playwright');
const path='file://'+require('path').resolve('/home/user/MOB/source.html');

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 const logs=[];
 pg.on('console',m=>{if(m.type()==='error')logs.push(m.text());});
 pg.on('pageerror',e=>logs.push('pageerror: '+e.message));
 await pg.goto(path,{waitUntil:'load'});
 await pg.waitForTimeout(1800);

 const chk=await pg.evaluate(()=>{
  const out={};
  out.SI=typeof SI!=='undefined'?SI.length:null;
  out.tab=typeof S!=='undefined'?S.tab:null;
  out.TABFIELD=typeof TAB!=='undefined'?TAB.FIELD:null;
  /* known good: the midpoint of a node wedge */
  const nodeHits=(typeof HIT!=='undefined')?HIT.filter(h=>h.k==='node'):[];
  let nodeProbe=null;
  if(nodeHits.length){
   const h=nodeHits[0];
   if(h.a0!==undefined){
    const am=(h.a0+h.a1)/2, rm=(h.r0+h.r1)/2;
    const x=h.cx+Math.cos(am)*rm, y=h.cy+Math.sin(am)*rm;
    const t=hitTest(x,y); nodeProbe=t?t.k:'(null)';}
   else if(h.x!==undefined){const t=hitTest(h.x,h.y); nodeProbe=t?t.k:'(null)';}}
  out.nodeProbe=nodeProbe;
  return out;});
 console.log('PROBE CHECKS');
 console.log('  SI.length in the page      '+chk.SI+(chk.SI===21?'  ok':'  PROBE BROKEN'));
 console.log('  opens on the Field         S.tab='+chk.tab+' TAB.FIELD='+chk.TABFIELD
  +(chk.tab===chk.TABFIELD?'  ok':'  PROBE BROKEN'));
 console.log('  hitTest on a node midpoint returns  '+chk.nodeProbe
  +(chk.nodeProbe==='node'?'  ok':'  PROBE BROKEN'));
 console.log('  console errors during boot '+logs.length+(logs.length?'  '+logs.join(' | '):''));
 if(chk.SI!==21||chk.tab!==chk.TABFIELD||chk.nodeProbe!=='node'){
  console.log('\nPROBE BROKEN. Nothing below counts.'); await b.close(); process.exit(1);}
 console.log('');

 /* ---- THE HIT CENSUS AT EVERY ZOOM AND DEPTH ---- */
 const hits=await pg.evaluate(()=>{
  const res=[];
  [1.0,1.6,2.5,3.6,4.6].forEach(z=>{
   [0,1,2,3].forEach(L=>{
    S.zoom=z; S.depth=L; render();
    const by={}; HIT.forEach(h=>by[h.k]=(by[h.k]||0)+1);
    res.push({z,L,total:HIT.length,law:by.law||0,core:by.core||0,seat:by.seat||0,by});});});
  return res;});
 console.log('HIT ENTRIES ON THE FIELD, BY ZOOM AND DEPTH');
 console.log('zoom  depth  total  k=law  k=core  k=seat');
 hits.forEach(h=>console.log(String(h.z).padEnd(6)+String(h.L).padEnd(7)
  +String(h.total).padEnd(7)+String(h.law).padEnd(7)+String(h.core).padEnd(8)+h.seat));
 console.log('');

 /* ---- WHAT A PRESS ON A FEATHER TIP RETURNS TODAY ---- */
 const tips=await pg.evaluate(()=>{
  S.zoom=3.6; S.depth=3; render();
  /* the thirty one marks the core draws today. Angles and lengths read straight
     out of ui/wheel.js coreInside(). The core rim is what solCore returned. */
  const r=compute();
  const core=HIT.filter(h=>h.k==='core')[0];
  const cr0=core?core.rad/1.5:0;
  const spin=(typeof REDUCED!=='undefined'&&REDUCED)?0:S.t*0.05;
  const marks=[];
  SI.forEach((l,i)=>marks.push({layer:'law',nm:l.nm,
   a:i/SI.length*Math.PI*2-Math.PI/2+spin, len:cr0*0.93*(S.law[l.nm]||0)/10}));
  BANDS.forEach((bd,i)=>marks.push({layer:'seat',nm:bd,
   a:i/BANDS.length*Math.PI*2-Math.PI/2-spin*0.6, len:cr0*0.86*bandIg(bd)/10}));
  [[r.X,'X vitality'],[r.Y,'Y awareness'],[r.Z,'Z will']].forEach((x,i)=>marks.push({
   layer:'triad',nm:x[1],a:i/3*Math.PI*2-Math.PI/2+spin*0.3, len:cr0*0.80*x[0]}));
  const CXv=core?core.x:0, CYv=core?core.y:0;
  const res=marks.map(m=>{
   const x=CXv+Math.cos(m.a)*m.len*0.97, y=CYv+Math.sin(m.a)*m.len*0.97;
   const t=hitTest(x,y);
   return {layer:m.layer,nm:m.nm,got:t?t.k:'(null)',len:+m.len.toFixed(1)};});
  return {cr0:+cr0.toFixed(1),res};});
 const kinds={};
 tips.res.forEach(t=>kinds[t.got]=(kinds[t.got]||0)+1);
 console.log('A PRESS AT EACH OF THE THIRTY ONE CORE MARK TIPS, zoom 3.6, depth 3');
 console.log('  core radius cr0 = '+tips.cr0+'px');
 console.log('  what hitTest returns: '+JSON.stringify(kinds));
 console.log('  marks whose own identity comes back: '
  +tips.res.filter(t=>(t.layer==='law'&&t.got==='law')).length+' of 31');
 console.log('');

 /* ---- THE PILL AND THE RING IT LABELS, ON EVERY PROFILE ---- */
 const pills=await pg.evaluate(()=>{
  const out=[];
  const names=['Gordon','Tomas','James','Diane','Marcus','Sofia','Wren','Abraham','Lance','Rosa'];
  names.forEach(nm=>{
   let idx=-1; PEOPLE.forEach((p,i)=>{if(p.nm===nm)idx=i;});
   if(idx<0)return;
   loadP(idx); S.zoom=1; S.depth=3; render();
   const r=compute();
   const lawmean=SINAMES.reduce((a,l)=>a+S.law[l],0)/21;
   const seatmean=BANDS.reduce((a,b)=>a+bandIg(b),0)/7;
   out.push({nm, pill:'21 laws · integrity '+r.Ig.toFixed(1),
    Ig:+r.Ig.toFixed(3), lawmean:+lawmean.toFixed(3), seatmean:+seatmean.toFixed(3),
    CQ:+r.CQ.toFixed(1), tier:r.tier, unread:r.unread});});
  return out;});
 console.log('THE PILL AT ui/wheel.js:744 AGAINST THE RING IT SITS ON AT :735');
 console.log('the ring draws S.law[nm]/10, twenty one of them. the pill prints r.Ig.');
 console.log('profile  pill says                     mean of the 21 marks   gap      CQ');
 pills.forEach(p=>console.log(p.nm.padEnd(9)+p.pill.padEnd(30)
  +String(p.lawmean.toFixed(2)).padEnd(23)+String((p.Ig-p.lawmean).toFixed(2)).padEnd(9)+p.CQ));
 console.log('');
 const inv=[];
 for(let i=0;i<pills.length;i++)for(let j=i+1;j<pills.length;j++){
  const a=pills[i],c=pills[j];
  if((a.Ig-c.Ig)*(a.lawmean-c.lawmean)<0)inv.push(a.nm+' / '+c.nm);}
 console.log('PAIRS THE TWO PATHS RANK IN OPPOSITE ORDER: '+inv.length+' of '
  +(pills.length*(pills.length-1)/2)+' pairs');
 inv.forEach(x=>console.log('  '+x));
 console.log('');

 /* ---- THE INTAKE QUESTIONS, AS RENDERED ---- */
 const iq=await pg.evaluate(()=>{
  const L=iqList();
  return {n:L.length, bad:L.filter(q=>/how often do you (justice|humility)/.test(q.q))
   .map(q=>q.q)};});
 console.log('THE INTAKE, AS iqList() BUILDS IT');
 console.log('  questions: '+iq.n);
 console.log('  questions whose verb is the law name with no phrase: '+iq.bad.length+' of '+iq.n);
 iq.bad.forEach(q=>console.log('    '+q));
 console.log('');

 /* ---- THE BLANK PROFILE, WHAT IS DRAWN AND WHAT IS PRINTED ---- */
 const blank=await pg.evaluate(()=>{
  loadP(0); S.zoom=1; S.depth=3; render();
  const r=compute();
  const lawmean=SINAMES.reduce((a,l)=>a+S.law[l],0)/21;
  return {CQ:+r.CQ.toFixed(2), Ig:+r.Ig.toFixed(2), tier:r.tier, unread:r.unread,
   measured:r.measured, lawmean:+lawmean.toFixed(3),
   law0:S.law[SINAMES[0]], spokes:HIT.filter(h=>h.k==='law').length,
   pill:'21 laws · integrity '+r.Ig.toFixed(1)};});
 console.log('THE BLANK PROFILE, loadP(0), AS THE PRODUCT SEEDS IT');
 console.log('  every law reads '+blank.law0+'  (engine/schema.js LAW_DEFAULT is 6, '
  +'ui/personas.js:269 LAWSET.You._ is 6.5)');
 console.log('  CQ '+blank.CQ+', Ig '+blank.Ig+', tier '+blank.tier
  +', unread '+blank.unread+', measured '+blank.measured+' of 21');
 console.log('  the wheel still draws '+blank.spokes+' law spokes and still prints the pill:');
 console.log('    "'+blank.pill+'"  on a profile where measured is '+blank.measured);

 await b.close();
})();
