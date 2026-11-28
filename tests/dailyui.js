/* ============================================================
   THE DAILY SUMMARY IS OFF THE SUMMARY PAGE. ui/daily.js, slice D8.

   This gate held the screen of today's summary (#sumday): the frozen day, the
   aim, the marks, the count of sentences, 111 to 130 words printed twice. On
   27 November the owner struck it from the page, his words: the Summary is
   "who I am today and what Source AI is seeing", with the three Today fields,
   the 15 percent ring, the right rail, What drives it and Your Patterns all
   gone (DECISIONS.md, "The Summary is who I am today and what Source AI is
   seeing"). The checks that read #sumday, the aim and the marks are RETIRED BY
   NAME below, with the reason, and ui/daily.js and engine/daily.js stay for a
   surface that wants the day back; tests/daily.js holds the engine half.

   WHAT IT HOLDS NOW, in the order a person meets it:
     there is no #sumday, no Today zone and no right rail on the Summary, and
     Source AI's button is on the page where the rail's was
     opening the Summary saves nothing: CURP.summaries is the same before and
     after, however often it repaints, and a disk that would refuse a write is
     never asked to take one (nothing says a day was not saved)
     no sentence is printed twice on the page, F24, for six worked examples
     the page does not push the phone sideways

   RETIRED BY NAME, 27 November, each with where it went:
     "the Summary's centre opens on Today" and "the shared rail steps aside"
        replaced by the absence checks above
     "a record's first open freezes one day", "what is on the screen is the
        frozen day", "no percent in the column", "the aim", "kept across a
        reload", "a save that fails says so": nothing opens, paints or saves a
        day on this page, so there is nothing to freeze or to fail. The
        engine's own freeze and boundary are held by tests/daily.js
     "the headline reading is CQ as a percent": the plate and its ring are
        struck
     "ONE RECORD'S OPEN ROWS NEVER OPEN ANOTHER'S": Your Patterns is struck

   CHECKED AGAINST A KNOWN BAD CASE FIRST. Run against the build from before
   this change (ATUNED_FILE=old.html) it must fail, and it does: that build
   has a #sumday, freezes a day on opening and shows the right rail. The
   duplicate word probe is held to an injected duplicate before it is trusted.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/dailyui.js
   ============================================================ */
const path=require('path');

/* A WORLD IN THE PAGE, the same shape tests/daily.js builds in node: four
   saved readings, four entries, three ritual days, an address opened, an
   avatar line whose review is due. Built as a blank profile, then put through
   pImport, which is the boundary every pasted record goes through, so it is a
   record the app could hold and is in PROFILES. Returns its id. */
function WORLD(o){
 o=o||{};
 var DAY=86400000, now=Date.now(), at=function(d){return new Date(now+d*DAY).toISOString();};
 var p=blankProfile(o.name||'Pat');
 var laws=Object.keys(p.laws);
 laws.forEach(function(l,i){p.laws[l]=5+(i%3);});
 Object.keys(p.axes).slice(0,3).forEach(function(k){p.axes[k].held=4;});
 var row=function(d,cq,dark,adj){var r={t:at(d),m:CQ_MODEL,cq:cq,dq:10,sq:1,pole:1,jq:1,rad:0.5,loaded:3,sab:1,cx:0,hy:0,ch:0,
  dark:dark,tier:'Even',arch:'x',lawNow:{}};
  laws.forEach(function(l,i){r.lawNow[l]=p.laws[l]+(i===0?adj:0);}); return r;};
 var ent=function(d,t){var r=parseStory(t); return {t:at(d),text:t,imprints:r.imprints.length,bands:r.bands,lex:LEX_VERSION};};
 var rit=function(d,done){return {t:at(d),track:'Body',band:'Heart',steps:[],min:5,done:done};};
 var A='I put it off again and I was afraid of the conversation and my chest was tight.';
 var B='I felt ashamed and I avoided the talk, I put it off.';
 var C='My chest was tight again and I was angry.';
 p.history=[row(-20,40,'Heart',0),row(-12,44,'Heart',0.2),row(-5,48,'Heart',1),row(-1,50,'Throat',1.5)];
 p.story.entries=[ent(-9,A),ent(-4,A),ent(-2,B),ent(-1,C)];
 p.rituals=[rit(-3,at(-3)),rit(-2,false),rit(-1,false)];
 p.meter.firsts=[{k:'addr:12',t:at(-2),nm:'x'}];
 p.avatar={built:true,at:at(-45),reviewedAt:null,pairs:[{be:'I act directly',notbe:'I put it off and avoid the talk',seat:'Throat'}]};
 var got=pImport(JSON.stringify(saveProfile(p)));
 if(!got)return {ok:false, errs:importError()};
 if(typeof render==='function')render();
 return {ok:true, id:got.id, n:PROFILES.length};}
module.exports={WORLD:WORLD};

if(require.main===module)(async()=>{
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}};
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(b);
const fresh=async(w,h,ctx)=>{
 const c=ctx||await b.newContext({viewport:{width:w||1600,height:h||1000}});
 const p=await c.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE); await booted(p); await p.waitForTimeout(300);
 return {c,p,errs};};
/* a section that throws is a failure with its reason, never a crash that
   hides the sections after it */
const section=async(nm,fn)=>{try{await fn();}catch(e){ok(false,nm+' threw: '+String(e&&e.message||e).split('\n')[0]);}};
const days=p=>p.evaluate(()=>JSON.stringify((CURP&&CURP.summaries)||null));
/* what the page shows of the struck parts and of the new ones */
const page=p=>p.evaluate(()=>{
 var vis=function(e){if(!e)return false;var s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return false;
  var r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
 return {sumday:!!document.getElementById('sumday'), today:!!document.querySelector('#sumbody .sg-today,#sumbody .sg-date'),
  rcol:vis(document.getElementById('rcol')), insight:vis(document.querySelector('.lsec[data-rail="right"][data-sec="you"]')),
  hello:!!document.getElementById('sumhello'), talk:vis(document.getElementById('sumtalkb')),
  stack:vis(document.getElementById('sumstack')), plate:!!document.querySelector('#sumbody .s-plate')};});

/* ---- 1. a record, opened ---- */
console.log('\n=== a record, the Summary opened ===');
await section('a record',async()=>{
 const {c,p,errs}=await fresh();
 const w=await p.evaluate(WORLD,{name:'Pat'});
 ok(w.ok,'the world comes in through the boundary: '+JSON.stringify(w.errs||''));
 const before=await days(p);
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 const k=await page(p);
 ok(!k.sumday&&!k.today,'the Summary has no Today zone and no #sumday: '+JSON.stringify(k));
 ok(!k.plate,'and no plate with its coherence ring');
 ok(!k.rcol&&!k.insight&&!k.hello,'the right rail is not drawn, and the rail\'s old talk button is gone: '+JSON.stringify(k));
 ok(k.talk,'Source AI\'s button is on the page, shown');
 ok(k.stack,'and the left rail is the stack');
 ok(await days(p)===before,'opening the Summary saves no day: CURP.summaries is unchanged');
 /* a repaint, a leave and a return save nothing either */
 await p.evaluate(()=>{render();sumRender();}); await p.waitForTimeout(250);
 await p.evaluate(()=>setTab(TAB.FIELD)); await p.waitForTimeout(250);
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(400);
 ok(await days(p)===before,'and neither does a repaint, a leave or a return');
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});

/* ---- 2. a worked example, and no sentence twice ---- */
console.log('\n=== a worked example ===');
await section('a worked example',async()=>{
 const {c,p,errs}=await fresh();
 const ix=await p.evaluate(()=>PEOPLE.findIndex(function(x){return x.nm==='Marcus';}));
 await p.evaluate(i=>{loadP(i);setTab(TAB.SUMMARY);},ix); await p.waitForTimeout(500);
 const k=await page(p), st=await p.evaluate(()=>document.getElementById('status').getAttribute('data-kind'));
 ok(!k.sumday&&!k.plate&&!k.rcol&&k.talk,'a worked example has no Today, no plate and no right rail, and has the button: '+JSON.stringify(k));
 ok(await p.evaluate(()=>PROFILES.indexOf(CURP)<0&&!(CURP.summaries&&CURP.summaries.days&&CURP.summaries.days.length)),'and nothing is frozen on it');
 ok(st!=='fail','and nothing says a save failed, because none was tried');
 /* F24, held on the same page: no sentence printed twice */
 const dup=(sel)=>p.evaluate(sel=>{var t=document.querySelector(sel).innerText;
  var ss=t.split(/(?<=[.!?])\s+|\n+/).map(function(s){return s.trim();}).filter(function(s){return s.split(/\s+/).length>=5;});
  var cnt={}; ss.forEach(function(s){cnt[s]=(cnt[s]||0)+1;});
  return Object.keys(cnt).filter(function(s){return cnt[s]>1;});},sel);
 await p.evaluate(()=>{var d=document.createElement('div');d.id='dl-bad';d.innerText='One two three four five six. Seven eight nine ten. One two three four five six.';document.body.appendChild(d);});
 ok((await dup('#dl-bad')).length===1,'the duplicate probe finds a sentence put in twice, before it is trusted');
 await p.evaluate(()=>document.getElementById('dl-bad').remove());
 /* the page and its rail are probed together, off screen, because innerText
    is layout aware and a detached clone has none */
 const dupPage=()=>p.evaluate(()=>{
  var split=function(t){return t.split(/(?<=[.!?])\s+|\n+/).map(function(s){return s.trim();}).filter(function(s){return s.split(/\s+/).length>=5;});};
  var c=document.getElementById('sumbody').cloneNode(true);
  c.style.cssText='position:absolute;left:-99999px;top:0;width:1200px'; document.body.appendChild(c);
  var ss=split(c.innerText); c.remove();
  var cnt={}; ss.forEach(function(s){cnt[s]=(cnt[s]||0)+1;});
  return Object.keys(cnt).filter(function(s){return cnt[s]>1;});});
 for(const nm of ['Sofia','Diane','Marcus','Angela','Derek','James']){
  await p.evaluate(nm=>{loadP(PEOPLE.findIndex(function(x){return x.nm===nm;}));setTab(TAB.SUMMARY);render();},nm); await p.waitForTimeout(250);
  const d=await dupPage();
  ok(d.length===0,nm+': no sentence is printed twice on the Summary: '+JSON.stringify(d.map(s=>s.slice(0,60))));}
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});

console.log('\n=== nothing read yet ===');
await section('nothing read yet',async()=>{
 const {c,p,errs}=await fresh();
 const r=await p.evaluate(()=>{var q=pNew('Nobody yet'); loadProfile(q); setTab(TAB.SUMMARY);
  return {rec:PROFILES.indexOf(CURP)>=0, unread:computeSeen().unread};});
 await p.waitForTimeout(400);
 const k=await page(p);
 ok(r.rec&&r.unread,'a new record of my own, with nothing read');
 ok(!k.sumday&&!k.today&&!k.rcol,'it has no Today and no right rail: '+JSON.stringify(k));
 ok(await p.evaluate(()=>!(CURP.summaries&&CURP.summaries.days&&CURP.summaries.days.length)),'and no day is frozen for it');
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});

console.log('\n=== a disk that refuses a write ===');
await section('a save that fails',async()=>{
 const {c,p,errs}=await fresh();
 const w=await p.evaluate(WORLD,{name:'Full disk'});
 ok(w.ok,'the world is in');
 await p.evaluate(()=>{Storage.prototype.setItem=function(){var e=new Error('The quota has been exceeded.');e.name='QuotaExceededError';throw e;};});
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 await p.evaluate(()=>{render();}); await p.waitForTimeout(200);
 const n=await p.evaluate(()=>MSG_LOG.filter(function(m){return /summary was not saved/.test(m.msg);}).length);
 ok(n===0,'opening the Summary asks the disk for nothing, so no message says a day was not saved: '+n);
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});

console.log('\n=== a phone ===');
await section('a phone',async()=>{
 const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const {p,errs}=await fresh(390,844,c);
 await p.evaluate(WORLD,{name:'Pat'});
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 const k=await page(p);
 ok(k.talk&&k.stack&&!k.rcol,'the button and the stack are on the phone, the right rail is not: '+JSON.stringify(k));
 const wide=await p.evaluate(()=>({doc:document.documentElement.scrollWidth}));
 ok(wide.doc<=390,'and nothing pushes the page sideways: '+JSON.stringify(wide));
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});
await b.close();
console.log('\n===== daily summary off the page: '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);})();
