/* THE RECORD TELLS THE TRUTH. Achievements plan, Block 1, 16 October. The
   owner's rule: "it is never lying to you".

   tests/engine.js holds the arithmetic. This holds the words a person reads
   off it, on the real renderers in a real Chromium, because every lie this
   gate closes was a true number under an untrue sentence: a next mark in the
   past tense, a lapsed streak that practising lowered, "Opened 60 addresses"
   for one address, a CQ that fell printed as "Up 0.00".

   Each group writes a record onto the person's own profile, renders the
   surface that prints it, and reads the text back. Known bad first: every
   group was run against the build of f7188cba (ATUNED_FILE pointing at it)
   and fails there on the check named in its heading.

   Run from the repo root with NODE_PATH pointing at a playwright install. */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000});}catch(e){}
 try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
/* a read that throws on a build missing what it reads reports as a failed
   check rather than ending the run, so a known bad build names every miss */
const ev=async(pg,fn,arg)=>{try{return await pg.evaluate(fn,arg);}catch(e){return {err:String(e&&e.message||e)};}};

(async()=>{
 const browser=await chromium.launch();
 const cx=await browser.newContext({viewport:{width:1600,height:1000}});
 const pg=await cx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 /* the helpers live in the page: a record written onto the person's own
    profile, days counted back from now, every entry marked done */
 await ev(pg,()=>{
  window.__rec=function(days,min){
   var d=function(n){return new Date(Date.now()-n*864e5).toISOString();};
   CURP.rituals=days.map(function(n){return {t:d(n),min:min||10,steps:['box'],done:d(n)};});};
  window.__txt=function(html){var e=document.createElement('div'); e.innerHTML=html; return e.textContent.replace(/\s+/g,' ').trim();};
  window.__ld=function(){var e=document.createElement('div'); e.innerHTML=ladderHtml();
   var n=e.querySelector('.ld-n'), st=e.querySelector('.ld-streak');
   return {n:n?n.textContent:'', title:st?st.getAttribute('title')||'':'', text:e.textContent.replace(/\s+/g,' ').trim(),
    next:(e.querySelector('.ld-next')||{}).textContent||''};};});

 console.log('\n=== L5. a blank record is told what puts the first day on ===');
 {const r=await ev(pg,()=>{__rec([]); return __ld();});
  ok(r.text&&!/save it/i.test(r.text),'the Compass does not say saving a ritual puts a day on, got '+JSON.stringify(r.text&&r.text.slice(0,160)));
  ok(/Mark a ritual done/.test(r.text||''),'it says marking a ritual done does');}

 console.log('\n=== L4 and L6. a lapsed streak says what stands, and practising never lowers it ===');
 {const r=await ev(pg,()=>{
   __rec([20,21,22,23,24,25,26,27,28,29]); var a=__ld();
   __rec([0,20,21,22,23,24,25,26,27,28,29]); var b=__ld();
   return {a:a,b:b,means:typeof STREAK_MEANS==='string'?STREAK_MEANS:null};});
  ok(r.a&&r.b&&+r.b.n>=+r.a.n,'practising today does not lower the streak on screen, '+(r.a&&r.a.n)+' then '+(r.b&&r.b.n));
  ok(r.a&&r.a.n==='5','the lapsed run of ten stands at five, the figure practising will keep, got '+(r.a&&r.a.n));
  ok(r.a&&!/days? ago|ended|new one starts|last run/i.test(r.a.text),
   'no sentence counts the absence or promises a new run, got '+JSON.stringify(r.a&&r.a.text.slice(0,200)));
  ok(r.a&&/Last practised \d{1,2} [A-Z][a-z]+\./.test(r.a.text),'it gives the date of the last day practised instead');
  ok(r.a&&/Longest held: 10 days\./.test(r.a.text),'and the longest row, with its unit');
  ok(r.means&&r.a&&r.a.title===r.means,'the figure carries the one meaning of a streak, got '+JSON.stringify(r.a&&r.a.title));}

 console.log('\n=== L13. Best is the longest run with no gap, as the line under it says ===');
 {const r=await ev(pg,()=>{
   __rec([0,2,4,6,8,10,12]);
   var L=ladderRead(CURP,Date.now()), e=document.createElement('div');
   e.innerHTML=ritTodayHtml([],ritToday0(),L);
   var figs=[].slice.call(e.querySelectorAll('.rv-fig')).map(function(f){return f.textContent.replace(/\s+/g,' ').trim();});
   var d=document.createElement('div'); d.innerHTML=acctDoneHtml({act:[],today:ritToday0(),L:L});
   return {figs:figs, run:L.streak.run, mean:(d.querySelector('.rv-mean')||{}).textContent||''};});
  const best=(r.figs||[]).filter(f=>/Best$/.test(f))[0]||'';
  ok(/longest run with no gap/.test(r.mean||''),'the page defines Best as the longest run with no gap');
  ok(best==='1 dayBest','so seven days, every other day, read Best 1 day, got '+JSON.stringify(best)+' beside a streak of '+r.run);}

 ok(errs.length===0,'no page error'+(errs.length?': '+errs.slice(0,2).join(' | '):''));
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
