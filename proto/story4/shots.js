#!/usr/bin/env node
/* Shoots the four story designs and measures them in the same run, because a
   screenshot taken in a different session from the measurement is two claims
   about two builds. Run from the repo root with NODE_PATH pointing at the
   playwright install:

     NODE_PATH=/opt/node22/lib/node_modules node proto/story4/shots.js

   Asserts, and exits non zero on any of them:

     the request log   every request the browser made. Anything that is not a
                       file:// url is a failure, not a warning. The page's own
                       log of fetch and XHR attempts is asserted separately.
     page errors       any thrown error, and any console error, fails the run.
     touch targets     nothing interactive under 44 by 44.
     horizontal scroll at 390, which is a defect this repository has shipped.
     redraw            median and worst of each design's own hero draw,
                       against 16.7 ms.
     Run release       its bottom edge against the fold, on both viewports.
*/
const {chromium}=require('playwright');
const path=require('path');
const SEL='button,input,select,textarea,a[href],[role=button]';
const PAGES=(process.argv[2]||'instrument,mirror,body,bench').split(',');
const VIEWS=[[1600,1000],[390,844]];
const DIR=__dirname;

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let bad=0;
 for(const name of PAGES){
  const URL='file://'+path.join(DIR,name+'.html');
  for(const [w,h] of VIEWS){
   const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
   const pg=await ctx.newPage();
   const reqs=[],errs=[];
   pg.on('request',r=>reqs.push(r.url()));
   pg.on('pageerror',e=>errs.push(String(e)));
   pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
   await pg.goto(URL,{waitUntil:'load'});
   await pg.waitForTimeout(350);
   /* the empty profile. What a person sees on a first ever open. */
   await pg.screenshot({path:path.join(DIR,'shot-'+name+'-empty-'+w+'.png'),fullPage:true});
   /* and loaded: a record, a story in the box, two imprints picked, which is
      the state every ruling on this page is about. */
   await pg.selectOption('#who','Derek');
   await pg.waitForTimeout(220);
   await pg.click('#fill');
   await pg.waitForTimeout(260);
   /* the cloud rebuilds its own markup on every pick, so a held handle is
      detached by the time the second click lands. Each pick is looked up
      again by position in the live document. */
   /* Prefer something this story actually reaches, because a design whose
      lighting depends on the join between the words and the part has nothing
      to show if the harness always picks the heaviest thing on file. */
   for(const pref of ['[data-imp].fed','[data-imp].cut','[data-imp].ghost','[data-imp]']){
    if(!(await pg.$(pref)))continue;
    for(let i=0;i<2;i++){
     const sel2=pref+' >> nth='+i;
     if(await pg.$(sel2)){await pg.click(sel2);await pg.waitForTimeout(140);}}
    break;}
   await pg.waitForTimeout(260);
   await pg.screenshot({path:path.join(DIR,'shot-'+name+'-loaded-'+w+'.png'),fullPage:true});
   /* AND ONE OF THE SCREEN ITSELF AT PHONE WIDTH. A full page capture places
      a sticky element at its stuck position and leaves a hole where it sits
      in flow, so the mirror's rail came back painted over the reflection with
      150px of nothing above it. That is the capture, not the page, and the
      way to know which is to look at the screen a person actually has. */
   if(w<=390){
    await pg.evaluate(()=>window.scrollTo(0,0));
    await pg.waitForTimeout(120);
    await pg.screenshot({path:path.join(DIR,'shot-'+name+'-screen-390.png'),fullPage:false});}

   /* the fold is measured from the top of the page. Picking an imprint can
      scroll the document, and the first cut of this harness measured Run
      release at minus 556 and called it above the fold. */
   await pg.evaluate(()=>window.scrollTo(0,0));
   await pg.waitForTimeout(120);
   const m=await pg.evaluate(sel=>{
    const vis=e=>{const r=e.getBoundingClientRect();
     return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';};
    /* the prototype's own chrome is not the surface. It is three controls that
       exist to load a record and drop a story in, and counting them makes
       every design look three choices worse than it is. */
    const els=[...document.querySelectorAll(sel)].filter(vis)
     .filter(e=>!e.closest('.pchrome'));
    const fold=window.innerHeight;
    const above=els.filter(e=>e.getBoundingClientRect().top<fold).length;
    const small=els.map(e=>{const r=e.getBoundingClientRect();
     return (r.width<44||r.height<44)
      ?(e.tagName.toLowerCase()+'.'+(e.className||'')+' '+Math.round(r.width)+'x'+Math.round(r.height))
      :null;}).filter(Boolean);
    const f=(window.FR||[]).slice().sort((a,b)=>a-b);
    const run=document.getElementById('run');
    const rb=run?Math.round(run.getBoundingClientRect().bottom):null;
    return {choices:els.length, above, small,
     med:f.length?f[Math.floor(f.length/2)]:null,
     p95:f.length?f[Math.floor(f.length*0.95)]:null, frames:f.length,
     runBottom:rb, fold:window.innerHeight,
     hscroll:document.documentElement.scrollWidth>window.innerWidth
      ?document.documentElement.scrollWidth:0,
     pagereq:(window.__REQ||[]).length};},SEL);

   const outside=reqs.filter(u=>!/^file:\/\//.test(u));
   console.log('--- '+name+'  '+w+' by '+h);
   console.log('  requests: '+reqs.length+'  not on file: '+outside.length
    +(outside.length?'  '+outside.join(' '):''));
   console.log('  the page\'s own fetch and xhr log: '+m.pagereq);
   console.log('  page errors: '+errs.length+(errs.length?'  '+errs.join(' | '):''));
   console.log('  choices on the surface: '+m.choices+'  above the fold: '+m.above);
   console.log('  under 44 by 44: '+m.small.length+(m.small.length?'  '+m.small.join(', '):''));
   console.log('  Run release bottom edge: '+m.runBottom+'  fold '+m.fold
    +'  '+(m.runBottom!=null&&m.runBottom<=m.fold?'above':'BELOW'));
   console.log('  horizontal page scroll: '+(m.hscroll?m.hscroll+'px NOT OK':'none'));
   console.log('  hero redraw: median '+(m.med==null?'not measured':m.med.toFixed(2)+' ms')
    +'  95th '+(m.p95==null?'':m.p95.toFixed(2)+' ms')+'  over '+m.frames+' frames');
   if(outside.length||errs.length||m.small.length||m.pagereq||m.hscroll
      ||(m.runBottom!=null&&m.runBottom>m.fold)||(m.p95!=null&&m.p95>16.7))bad++;
   await ctx.close();
  }
 }
 await b.close();
 console.log(bad?'FAILED on '+bad+' case(s)':'every assertion passed');
 process.exit(bad?1:0);
})();
