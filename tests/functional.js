const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const real=[];
page.on('pageerror',e=>real.push('PAGEERROR: '+e.message));
page.on('console',m=>{if(m.type()==='error'){const t=m.text();
 if(!/ERR_CERT_AUTHORITY_INVALID|ERR_FILE_NOT_FOUND|fonts\.googleapis/.test(t))real.push(t);}});
await page.goto(FILE,{waitUntil:'load'}); await page.waitForTimeout(800);

console.log('=== figure fallback ===');
await page.evaluate(()=>setTab(TAB.ENERGY)); await page.waitForTimeout(400);
const fig=await page.evaluate(()=>({
 raster:document.querySelectorAll('#emap image.pm-art').length,
 vector:document.querySelectorAll('#emap g.pm-vec path').length,
 vecColor:(()=>{const v=document.querySelector('#emap .pm-vec');
  return v?getComputedStyle(v).color:'none'})(),
 seats:document.querySelectorAll('#emap circle.pm-seat').length}));
ok(fig.vector===1,'vector figure renders when raster is absent, got '+fig.vector);
ok(fig.vecColor!=='none'&&fig.vecColor!=='rgba(0, 0, 0, 0)','vector stroke colour resolves, got '+fig.vecColor);
ok(fig.seats===7,'7 seats drawn, got '+fig.seats);
console.log(' ',JSON.stringify(fig));

console.log('\n=== 7 energy layers, every persona ===');
const layers=['bands','sab','cx','hyper','masks','pain','nerves'];
const people=await page.evaluate(()=>PEOPLE.map(p=>p.nm));
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i); await page.waitForTimeout(90);
 await page.evaluate(()=>setTab(TAB.ENERGY)); await page.waitForTimeout(90);
 let line=[];
 for(const L of layers){
  const res=await page.evaluate(l=>{PMLAYER=l;render();
   const svg=document.querySelector('#emap svg.pm-svg');
   const shelf=document.getElementById('eshelf');
   return {nodes:svg?svg.childElementCount:0,
    shelf:shelf?shelf.childElementCount:0,
    shelfTxt:shelf?shelf.textContent.trim().length:0};},L);
  ok(res.nodes>5,nm+'/'+L+': svg empty');
  ok(res.shelfTxt>40,nm+'/'+L+': shelf empty ('+res.shelfTxt+' chars)');
  line.push(L+':'+res.nodes+'/'+res.shelfTxt);}
 console.log(' ',nm.padEnd(8),line.join('  '));}

console.log('\n=== 4 field depths, every persona ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i);
 await page.evaluate(()=>setTab(TAB.FIELD)); await page.waitForTimeout(80);
 let hits=[];
 for(let v=0;v<4;v++){
  const n=await page.evaluate(vv=>{S.view=vv;render();return HIT.length;},v);
  ok(n>100,nm+'/depth'+v+': only '+n+' hit targets');
  hits.push(n);}
 console.log(' ',nm.padEnd(8),'hit targets by depth:',hits.join(' '));}

console.log('\n=== every tab, every persona ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i);
 let line=[];
 for(let t=0;t<5;t++){
  await page.evaluate(tt=>setTab(tt),t); await page.waitForTimeout(60);
  const len=await page.evaluate(tt=>{
   const ids=['story','sum','cv','emap','ana'];
   const e=document.getElementById(ids[tt]);
   return tt===2?(typeof HIT!=='undefined'?HIT.length:0):(e?e.textContent.trim().length:0);},t);
  ok(len>50,nm+'/tab'+t+': content length '+len);
  line.push(len);}
 console.log(' ',nm.padEnd(8),line.join('  '));}

console.log('\n=== drills open and close ===');
await page.evaluate(()=>{loadP(6);setTab(TAB.FIELD);});   // Gordon, heavily loaded
await page.waitForTimeout(120);
const drills=await page.evaluate(()=>{
 const out={};
 runCoreDrill(); out.core=document.getElementById('rdrill').textContent.length;
 runLawDrill(SI[0]); out.law=document.getElementById('rdrill').textContent.length;
 runNodeDrill(W[0]); out.node=document.getElementById('rdrill').textContent.length;
 runCellDrill(0,0); out.cell=document.getElementById('rdrill').textContent.length;
 runSpDrill('sign','Leo'); out.sp=document.getElementById('rdrill').textContent.length;
 const r=compute(); if(r.sabs.length){runDrill(r.sabs[0]);out.pat=document.getElementById('rdrill').textContent.length;}
 rdClose(); out.closed=document.getElementById('rdrill').textContent.length;
 return out;});
Object.keys(drills).forEach(k=>{
 if(k==='closed')ok(drills[k]===0,'drill closes, got '+drills[k]);
 else ok(drills[k]>120,k+' drill too short: '+drills[k]);});
console.log(' ',JSON.stringify(drills));

console.log('\n=== persistence: save, reload, read back ===');
/* The store must be bound through bindStore(), or pPersist() refuses every
   write. This is the gate that would have caught the shipped app writing
   nothing while reporting storage as blocked. */
const pers=await page.evaluate(()=>{
 const bound=STORE_BOUND; const okp=pPersist();
 return {bound, persist:okp, err:SAVE_ERR, keys:Object.keys(localStorage), n:PROFILES.length};});
ok(pers.bound===true,'store is bound through bindStore, got '+pers.bound);
ok(pers.persist===true,'pPersist reports success, got '+pers.persist+' '+pers.err);
ok(pers.keys.indexOf('source.profiles')>=0,'profile key present in localStorage: '+pers.keys.join(','));
await page.reload(); await page.waitForTimeout(900);
/* PROFILES hydrates lazily from the store on the first intake render, so the
   honest check after reload is what the store holds, not the in-memory array. */
const back=await page.evaluate(()=>({n:pStore().length, bound:STORE_BOUND}));
ok(back.n===pers.n&&back.n>0,'profiles survive reload: '+pers.n+' saved, '+back.n+' read back');
ok(back.bound===true,'store bound after reload');

console.log('\n=== real JS errors across all of the above ===');
ok(real.length===0,'JS errors: '+real.slice(0,4).join(' | '));
console.log('  count:',real.length);
await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
