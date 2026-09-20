const {chromium}=require('playwright');
const path='file://'+require('path').resolve('/home/user/MOB/source.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1600,height:1000}});
 await pg.goto(path,{waitUntil:'load'}); await pg.waitForTimeout(1800);
 const ok=await pg.evaluate(()=>SI.length===21&&S.tab===TAB.FIELD);
 console.log('PROBE CHECK  page holds 21 laws and opens on the Field: '+(ok?'ok':'PROBE BROKEN'));
 if(!ok){await b.close();process.exit(1);}
 console.log('');

 const h=await pg.evaluate(()=>{
  const out=[];
  ['You','Marcus','Diane','Gordon'].forEach(nm=>{
   let idx=-1;PEOPLE.forEach((p,i)=>{if(p.nm===nm)idx=i;});
   loadP(idx);
   [0,3].forEach(L=>{[1,3.6].forEach(z=>{
    S.depth=L;S.zoom=z;render();
    const by={};HIT.forEach(x=>by[x.k]=(by[x.k]||0)+1);
    out.push({nm,L,z,total:HIT.length,by});});});});
  return out;});
 console.log('HIT SIZE ON THE FIELD. DESIGN-feathers.md states 181 at depth 3.');
 console.log('profile  depth  zoom  total   breakdown');
 h.forEach(x=>console.log(x.nm.padEnd(9)+String(x.L).padEnd(7)+String(x.z).padEnd(6)
  +String(x.total).padEnd(8)+JSON.stringify(x.by)));
 console.log('');

 /* THE ROUND TRIP. LAWSET states a value. seedIntake turns it into three
    answers. iqScore averages them back. iqApply writes the average into
    S.law and into p.laws. Does the number that comes out equal the number
    that went in?
    PROBE CHECK: run it on a law whose value is mid range, where no clamp can
    bite, and confirm the round trip is exact there. If it is not, the probe
    has the wrong formula and the errors below are its own. */
 const rt=await pg.evaluate(()=>{
  const out=[];
  ['Gordon','Tomas','Diane','Marcus','Abraham','Lance','Rosa'].forEach(nm=>{
   let idx=-1;PEOPLE.forEach((p,i)=>{if(p.nm===nm)idx=i;});
   const LS=LAWSET[nm];
   loadP(idx);
   const rows=SINAMES.map(l=>{
    const stated=(LS[l]!==undefined)?LS[l]:LS._;
    return {l,stated,got:S.law[l],d:+(S.law[l]-stated).toFixed(3)};});
   const worst=rows.slice().sort((a,c)=>Math.abs(c.d)-Math.abs(a.d))[0];
   const statedMean=rows.reduce((a,r)=>a+r.stated,0)/21;
   const gotMean=rows.reduce((a,r)=>a+r.got,0)/21;
   out.push({nm,n:rows.filter(r=>Math.abs(r.d)>0.001).length,
    worst:worst.l+' stated '+worst.stated+' reads '+worst.got+' ('+(worst.d>0?'+':'')+worst.d+')',
    statedMean:+statedMean.toFixed(3),gotMean:+gotMean.toFixed(3),
    mid:rows.filter(r=>r.stated>=4&&r.stated<=7).filter(r=>Math.abs(r.d)>0.001).length,
    midN:rows.filter(r=>r.stated>=4&&r.stated<=7).length});});
  return out;});
 const midbad=rt.reduce((a,x)=>a+x.mid,0), midn=rt.reduce((a,x)=>a+x.midN,0);
 console.log('PROBE CHECK  mid range laws (4 to 7), where no clamp can bite, must round trip exactly');
 console.log('  '+(midn-midbad)+' of '+midn+' exact'+(midbad?'  PROBE SUSPECT':'  ok'));
 console.log('');
 console.log('THE ROUND TRIP LAWSET -> seedIntake -> iqScore -> iqApply -> S.law');
 console.log('profile  laws moved  stated mean  reads    widest single move');
 rt.forEach(x=>console.log(x.nm.padEnd(9)+String(x.n+' of 21').padEnd(12)
  +String(x.statedMean).padEnd(13)+String(x.gotMean).padEnd(9)+x.worst));
 await b.close();
})();
