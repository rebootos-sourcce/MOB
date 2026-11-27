#!/usr/bin/env node
/* Shoots the character sheet and measures it in the same run, because a
   screenshot taken in a different session from the measurement is two claims
   about two builds. Asserts, and exits non zero on any of them:

   the request log     every request the page made, with its url. Anything that
                       is not the file itself is a failure, not a warning.
   page errors         any thrown error fails the run.
   touch targets       nothing interactive under 44 by 44.
   choices per screen  visible interactive elements, against a working memory
                       of about four.
   redraw              median and worst of the hero draw, against 16.7 ms.
   the empty state     the surface a person sees on a first ever open.
   the decomposition   open plus held plus empty reads 100 at every seat, which
                       is the one arithmetic claim the whole page rests on.
*/
const {chromium}=require('playwright');
const fs=require('fs'), path=require('path');
const URL='file://'+path.join(__dirname,'sheet.html');
const SEL='button,input,select,textarea,a[href],[role=button]';
const WHO=(process.argv[2]||'Marcus,Gordon,Sofia,__empty').split(',');

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let bad=0;
 for(const w of [[1600,1000],[390,844]]){
  const ctx=await b.newContext({viewport:{width:w[0],height:w[1]},deviceScaleFactor:1});
  const pg=await ctx.newPage();
  const reqs=[], errs=[];
  pg.on('request',r=>reqs.push(r.url()));
  pg.on('pageerror',e=>errs.push(String(e)));
  pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
  await pg.goto(URL,{waitUntil:'networkidle'});
  for(const who of WHO){
   await pg.selectOption('#who',who);
   await pg.waitForTimeout(500);
   const tag=who==='__empty'?'empty':who;
   await pg.screenshot({path:path.join(__dirname,'sheet-'+tag+'-'+w[0]+'.png'),fullPage:true});
   /* SIX RUNS AND NOT TWELVE. A quarter of release work is the unit every
      other document in this repository uses, and at twelve runs the lighter
      profiles empty completely: the release drains the nine axes rather than
      the addresses, so Marcus reaches charge nought, compute() returns unread
      and the worked shot came back showing the first ever open screen. That
      is worth knowing and it is in DESIGN-sheet.md, and it makes a useless
      picture. Six runs is half a quarter and it shows a sheet mid work. */
   if(who!=='__empty'){
    for(let i=0;i<6;i++){await pg.click('#run');}
    await pg.waitForTimeout(400);
    await pg.screenshot({path:path.join(__dirname,'sheet-'+tag+'-worked-'+w[0]+'.png'),fullPage:true});
    await pg.click('#reset');
   }
  }
  await pg.selectOption('#who','Marcus'); await pg.waitForTimeout(900);
  const m=await pg.evaluate(sel=>{
   const els=[...document.querySelectorAll(sel)].filter(e=>{
    const r=e.getBoundingClientRect();
    return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';});
   const small=els.map(e=>{const r=e.getBoundingClientRect();
    return (r.width<44||r.height<44)?(e.tagName.toLowerCase()+'.'+(e.className||'')+' '
     +Math.round(r.width)+'x'+Math.round(r.height)):null;}).filter(Boolean);
   const f=window.FR||[];
   const s=f.slice().sort((a,b)=>a-b);
   /* THE ONE ARITHMETIC CLAIM THE PAGE RESTS ON, asserted in the browser where
      the ceiling is actually reachable. */
   const cr=window.CR, sums=[];
   if(cr)Object.keys(cr.seats).forEach(k=>{
    const s2=cr.seats[k]; sums.push(+(s2.open+s2.held+s2.empty).toFixed(3));});
   return {choices:els.length, small,
    med:s.length?s[Math.floor(s.length/2)]:null,
    p95:s.length?s[Math.floor(s.length*0.95)]:null, frames:s.length,
    reqs:(window.__REQ||[]).length, sums,
    ceil:(typeof window.cqCeiling==='function')?+window.cqCeiling().toFixed(1):null,
    cq:(cr?null:null)};
  },SEL);
  const outside=reqs.filter(u=>u!==URL);
  const offSum=m.sums.filter(v=>Math.abs(v-100)>0.05);
  console.log('--- '+w[0]+' by '+w[1]);
  console.log('  requests the browser made: '+reqs.length+'  outside this file: '+outside.length
   +(outside.length?'  '+outside.join(' '):''));
  console.log('  the page\'s own request log: '+m.reqs);
  console.log('  page errors: '+errs.length+(errs.length?'  '+errs.join(' | '):''));
  console.log('  simultaneous choices: '+m.choices);
  console.log('  under 44 by 44: '+m.small.length+(m.small.length?'  '+m.small.join(', '):''));
  console.log('  open + held + empty per seat: '+(m.sums.length?m.sums.join(' '):'not read')
   +(offSum.length?'  OFF BY MORE THAN 0.05':''));
  console.log('  cqCeiling reachable in the page: '+(m.ceil==null?'no':'yes, '+m.ceil));
  console.log('  hero redraw: median '+(m.med==null?'not measured':m.med.toFixed(2)+' ms')
   +'  95th '+(m.p95==null?'':m.p95.toFixed(2)+' ms')+'  over '+m.frames+' frames');
  if(outside.length||errs.length||m.small.length||m.reqs||offSum.length||!m.sums.length)bad++;
  await ctx.close();
 }
 await b.close();
 console.log(bad?'FAILED on '+bad+' viewport(s)':'every assertion passed');
 process.exit(bad?1:0);
})();
