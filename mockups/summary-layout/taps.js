/* Tap floor audit for the Summary page: every control inside #sumbody, with every
   fold opened, measured against 44 by 44. node mockups/summary-layout/taps.js */
const {chromium}=require('playwright');const path=require('path');
const SRC=process.env.SRC||path.resolve(__dirname,'../../source.html');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 for(const [W,H] of [[1600,1000],[390,844]]){
  const p=await b.newPage({viewport:{width:W,height:H}});
  await p.goto('file://'+SRC+'?dev=1');
  await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}).catch(()=>{});
  for(const who of ['Sofia','Derek','James','Angela']){
   const r=await p.evaluate(who=>{
    loadP(PEOPLE.findIndex(x=>x.nm===who));
    var pe=PEOPLE[S.who]; if(!CURP.story.entries.length&&pe.says)CURP.story.entries.push({t:Date.now()-86400000,text:pe.says});
    setTab(TAB.SUMMARY); render();
    document.querySelectorAll('#sumbody details').forEach(d=>d.open=true);
    const out=[];let n=0;
    document.querySelectorAll('#sumbody button,#sumbody summary,#sumbody a[href],#sumbody input,#sumbody select').forEach(e=>{
     const r=e.getBoundingClientRect(); if(!r.width||!r.height)return; n++;
     if(r.width<43.5||r.height<43.5)out.push((e.className||e.tagName)+' '+Math.round(r.width)+'x'+Math.round(r.height));});
    const ov=[...document.querySelectorAll('#sumbody *')].filter(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX==='visible'&&!e.closest('svg')).length;
    return {n,under:out.length,sample:[...new Set(out)].slice(0,8),overflowingBoxes:ov,
     pageWide:document.documentElement.scrollWidth>innerWidth};},who);
   await p.waitForTimeout(150);
   console.log(W,who,JSON.stringify(r));}
  await p.close();}
 await b.close();})();
