const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1680,height:1020}});
await p.goto(FILE,{waitUntil:'load'});await p.waitForTimeout(800);
const people=await p.evaluate(()=>PEOPLE.map(x=>x.nm));
console.log('=== wheel nameplate overlaps, every persona x every depth ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await p.evaluate(n=>{loadP(n);setTab(TAB.FIELD);},i);await p.waitForTimeout(80);
 let line=[];
 for(let v=0;v<4;v++){
  const res=await p.evaluate(vv=>{S.view=vv;S.tab=TAB.FIELD;draw(compute());
   const P=window.__PLATES||[];
   let bad=0;
   for(let a=0;a<P.length;a++)for(let c=a+1;c<P.length;c++)
    if(window.plateHit(P[a],P[c]))bad++;
   return {n:P.length,bad:bad};},v);
  ok(res.bad===0,nm+'/depth'+v+': '+res.bad+' overlapping plates');
  line.push(res.n+(res.bad?'!'+res.bad:''));}
 console.log(' ',nm.padEnd(8),'plates by depth:',line.join(' '));}
await b.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);})();
