/* ============================================================
   NO ALL CAPS ANYWHERE, AND A TOOLTIP OPENS ON A CAPITAL.
   node tests/casing.js, and called from tests/functional.js so a full run
   holds it through the same code.

   The rulings. CLAUDE.md, the owner's voice line: "Sentence case. No all
   caps UI copy." DECISIONS.md, Case, ruled: "Headers and subheaders take a
   capital on every word. Body text is sentence case and stays that way. No
   all caps anywhere, which is unchanged."

   WHAT WAS ALREADY HELD, AND WHERE IT STOPPED. tests/design.js gate 5 reads
   the one surface on screen at boot, and only a leaf element of seven
   characters or more. Gate 17 holds the capitalize classes, drills included.
   Neither reads another surface for all caps, and nothing read the funnel's
   own pages at all, which is where it was: about, buy and the quiz set every
   eyebrow, figure label and table head in text-transform:uppercase, so "What
   each rung sees" reached a person as WHAT EACH RUNG SEES. The landing page,
   index.html, never did, and its eyebrow is the funnel's own model.

   And a tooltip is a line a person reads, so it opens on a capital like any
   other. The coherence ring titled itself "coherence, 44%" on the Field rail,
   on Summary and on Analytics, and the accuracy and flow rings the same.

   WHAT IT HOLDS
     1  no text a person can be shown is set in text-transform:uppercase,
        on any surface of the app at both widths, blank and loaded, on the
        login card, or on any funnel page. The wordmark is not copy: .brand
        and the boot card's .boot-wm are the logotype, ruled all caps.
     2  no string of more than six letters is typed in capitals, which is
        gate 5's own rule carried to every surface and page
     3  every title and data-tip that opens on a letter opens on a capital

   NOTHING IS TYPED. The surfaces come off TABDEF and TABEXTRA, the funnel
   pages off the directory, the loaded profile is the roster's heaviest by the
   charge it carries, read at run time. The rule is checked against a known
   bad and a known good case inside the page before any result is believed.
   ============================================================ */
const path=require('path'), fs=require('fs');

/* run inside the page. Returns what breaks the three rules under root. */
const WALK=function(rootSel){
 const root=(rootSel&&document.querySelector(rootSel))||document.body;
 const out={upper:[],caps:[],tip:[]};
 const host=e=>(e.closest('[id]')||{}).id||e.tagName.toLowerCase();
 const skip=e=>!!e.closest('script,style,svg,noscript,.brand,.boot-wm');
 const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n;
 while((n=tw.nextNode())){
  const t=n.nodeValue.replace(/\s+/g,' ').trim(); if(!/[A-Za-z]/.test(t))continue;
  const e=n.parentElement; if(!e||skip(e))continue;
  if(getComputedStyle(e).textTransform==='uppercase'){out.upper.push(t.slice(0,40)+' @'+host(e));continue;}
  const L=t.replace(/[^A-Za-z]/g,'');
  if(L.length>6&&L===L.toUpperCase())out.caps.push(t.slice(0,40)+' @'+host(e));}
 [root,...root.querySelectorAll('[title],[data-tip]')].forEach(e=>{
  if(!e.getAttribute||skip(e))return;
  ['title','data-tip'].forEach(a=>{const v=(e.getAttribute(a)||'').trim();
   if(/^[a-z]/.test(v))out.tip.push(a+'="'+v.slice(0,40)+'" @'+host(e));});});
 return out;};

/* the same walk on a scrap of markup whose answer is known */
const SELF=function(src){
 const W=(0,eval)('('+src+')');
 const d=document.createElement('div'); d.id='casing-self';
 d.innerHTML='<p style="text-transform:uppercase">what each rung sees</p>'
  +'<p>BEFORE THE QUESTIONS</p><span title="coherence, 44%">x</span>'
  +'<p>What each rung sees</p><p>CQ and DQ</p><span title="Coherence, 44%">x</span>'
  +'<span title="44%">x</span>';
 document.body.appendChild(d);
 const r=W('#casing-self'); d.remove();
 return r.upper.length===1&&r.caps.length===1&&r.tip.length===1;};

async function casingGate(browser,FILE,ok,booted){
 const seen={upper:new Map(),caps:new Map(),tip:new Map()};
 const keep=(r,where)=>['upper','caps','tip'].forEach(k=>r[k].forEach(s=>{
  if(!seen[k].has(s))seen[k].set(s,where);}));
 let surfaces=0;
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600;
  const pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
  if(W===1600)ok(await pg.evaluate(SELF,WALK.toString()),
   'the walk finds one uppercase, one typed capitals and one lower case tooltip in a scrap built to hold exactly those');
  const S=await pg.evaluate(()=>{
   const a=TABDEF.map(t=>t.k); Object.keys(TABEXTRA).forEach(k=>a.push(TABEXTRA[k].k));
   /* the heaviest by the charge it carries, p.c, the field loadP reads */
   let best=-1,bi=0; PEOPLE.forEach((p,i)=>{const n=Object.keys(p.c||{})
    .reduce((s,k)=>s+(+p.c[k]||0),0); if(n>best){best=n;bi=i;}});
   return {tabs:a,heavy:bi};});
  for(const who of ['blank',S.heavy]){
   if(who!=='blank')await pg.evaluate(i=>loadP(i),who);
   for(const k of S.tabs){
    await pg.evaluate(t=>{setTab(t);if(typeof render==='function')render();},k);
    await pg.waitForTimeout(140);
    keep(await pg.evaluate(WALK,null),'tab '+k+' at '+W+(who==='blank'?' blank':' loaded'));
    surfaces++;}}
  /* the login card, its reset card, and back */
  await pg.evaluate(()=>{loginOpen();});
  keep(await pg.evaluate(WALK,'#login'),'the login card at '+W);
  await pg.evaluate(()=>{const f=document.getElementById('loginforgot');if(f)f.click();});
  keep(await pg.evaluate(WALK,'#login'),'the reset card at '+W);
  await pg.evaluate(()=>{loginClose();});
  ok(err.length===0,'no page errors at '+W+', got '+err.slice(0,2).join(' | '));
  await pg.close();}
 /* the funnel, every page in the directory */
 const DIR=path.resolve(__dirname,'..','funnel');
 const PAGES=fs.readdirSync(DIR).filter(f=>/\.html$/.test(f)).sort();
 for(const [W,H] of [[1600,1000],[390,844]])for(const p of PAGES){
  const pg=await browser.newPage({viewport:{width:W,height:H}});
  await pg.goto('file://'+path.join(DIR,p),{waitUntil:'load'}); await pg.waitForTimeout(150);
  keep(await pg.evaluate(WALK,null),'funnel/'+p+' at '+W); surfaces++;
  await pg.close();}
 console.log('  surfaces and pages walked: '+surfaces+' ('+PAGES.length+' funnel pages)');
 const say=(k,what)=>{const m=seen[k];
  ok(m.size===0,what+': '+m.size+(m.size?', first: '+[...m.entries()].slice(0,6)
   .map(e=>e[0]+' ['+e[1]+']').join(' | '):''));};
 say('upper','text set in text-transform:uppercase');
 say('caps','strings of more than six letters typed in capitals');
 say('tip','tooltips opening on a lower case letter');}

module.exports={casingGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
  console.log('\n=== no all caps anywhere, and a tooltip opens on a capital ===');
  try{ await casingGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
