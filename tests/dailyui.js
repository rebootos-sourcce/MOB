/* ============================================================
   THE DAILY SUMMARY, ON THE PAGE. ui/daily.js, slice D8.

   tests/daily.js holds the engine half: the boundary, the composer, the
   grounding pass and the freeze. Nothing held the screen, because there was
   none, and the owner asked on 2 October why the summary was never finished.
   This gate holds the screen, in a real Chromium, on a real record that came
   in through the boundary (pImport), with every moment taken off the real
   clock so the windows the engine reads are the ones a person would be in.

   What it asks, in the order a person meets it:
     the Summary's side column is Today, and the shared rail steps aside
     a record's first open freezes one day, and a repaint never freezes two
     what is on the screen is the frozen day, sentence for sentence
     every term in a sentence carries its meaning (round PO)
     no percent, no day count, no "of 90" anywhere in the column
     the aim: refused empty, saved through the boundary, marked, kept on reload
     a worked example is composed live, never frozen, never offered an aim
     nothing read yet is silent and freezes nothing
     a save that fails says so and claims no day
     leaving the page empties the column
   And the two Summary defects the funnel review named for the same pass,
   F24: the headline read "62%", and 111 to 130 words were printed twice.

   CHECKED AGAINST A KNOWN BAD CASE FIRST. Run against the build from before
   this slice (ATUNED_FILE=old.html) it must fail, and it does: there is no
   Today section and no day is frozen. The duplicate word probe is held to an
   injected duplicate before it is trusted on the page.

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
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const fresh=async(w,h,ctx)=>{
 const c=ctx||await b.newContext({viewport:{width:w||1600,height:h||1000}});
 const p=await c.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE); await booted(p); await p.waitForTimeout(300);
 return {c,p,errs};};
const col=p=>p.evaluate(()=>{
 var h=document.getElementById('sumday'), sec=h&&h.closest('.lsec');
 var vis=function(e){if(!e)return false;var s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return false;
  var r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
 return {there:!!h, shown:vis(sec), text:h?h.innerText.replace(/\s+/g,' ').trim():'',
  st:h?Array.prototype.map.call(h.querySelectorAll('.dl-blk .dl-st'),function(x){return x.innerText.replace(/\s+/g,' ').trim();}):[],
  tips:h?Array.prototype.map.call(h.querySelectorAll('.dl-blk .tipu'),function(x){return {k:x.textContent,t:x.getAttribute('data-tip')||''};}):[],
  form:!!(h&&h.querySelector('#dlaimin')),
  shared:Array.prototype.filter.call(document.querySelectorAll('.lsec[data-rail="right"]'),function(s){
   return vis(s)&&!s.classList.contains('sum-rail')&&s.dataset.sec!=='sel';}).map(function(s){return s.dataset.sec;})};});
/* a section that throws is a failure with its reason, never a crash that
   hides the sections after it: the known bad build has no column to click */
const section=async(nm,fn)=>{try{await fn();}catch(e){ok(false,nm+' threw: '+String(e&&e.message||e).split('\n')[0]);}};
const days=p=>p.evaluate(()=>((CURP&&CURP.summaries&&CURP.summaries.days)||[]).map(function(d){return {id:d.id,st:d.st.map(function(s){return s.text;}),silent:d.silent};}));

/* ---- 1. a record, the first open ---- */
console.log('\n=== a record, the first open of the day ===');
await section('a record',async()=>{
 const {c,p,errs}=await fresh();
 const w=await p.evaluate(WORLD,{name:'Pat'});
 ok(w.ok,'the world comes in through the boundary: '+JSON.stringify(w.errs||''));
 ok((await days(p)).length===0,'nothing is frozen before the Summary is opened');
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 const d1=await days(p), today=await p.evaluate(()=>'sum:'+dlyDay(Date.now()));
 ok(d1.length===1&&d1[0].id===today,'opening the Summary freezes one day, today\'s: '+JSON.stringify(d1.map(x=>x.id)));
 ok(d1.length&&d1[0].st.length>=3,'and it says something about this record, '+(d1[0]?d1[0].st.length:0)+' sentences');
 const k=await col(p);
 ok(k.there&&k.shown,'the Summary\'s side column is Today, and it is shown');
 ok(k.shared.length===0,'the shared rail steps aside on the Summary, still showing: '+JSON.stringify(k.shared));
 ok(JSON.stringify(k.st)===JSON.stringify(d1[0].st),'the column prints the frozen day, sentence for sentence, in its order');
 ok(/Written at \d\d:\d\d, the first time you opened this page today\./.test(k.text),'it says when it was written and that it stays until tomorrow');
 const eye=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('#sumday .dl-blk>.pm-eye'),function(e){return e.textContent;}));
 ok(eye.length>=3&&eye.every(e=>e&&!/attention/i.test(e)),'every block has its eyebrow, and none says needs attention: '+JSON.stringify(eye));
 /* UNPACK EVERY SYMBOL: a seat, a law, coherence, charge, an address */
 const termRx=/\b(Root|Sacral|Solar|Heart|Throat|3rd Eye|Crown) seat\b|\bcoherence\b|\bcharge\b|\baddress(es)?\b/;
 const bare=k.st.filter(s=>termRx.test(s));
 ok(bare.length>0,'the day names a seat or a term, so the carriers have something to hold');
 ok(k.tips.length>0&&k.tips.every(t=>t.t.length>20),'each term in a sentence carries its meaning: '+JSON.stringify(k.tips.map(t=>t.k)));
 const want=await p.evaluate(()=>({seat:unpackOf('Throat','seat'), coh:unpackOf('coherence')}));
 ok(k.tips.some(t=>t.t===want.seat||t.t===want.coh),'and the meaning is the table\'s own sentence');
 ok(!/%/.test(k.text),'no percent in the column');
 ok(!/\bday \d+\b|\bof 90\b|\b\d+ of \d+\b/i.test(k.text),'no day count and no count against a total in the column');
 /* a repaint never freezes a second day, and the day does not move */
 await p.evaluate(()=>{render();sumRender();sumDayOpen();}); await p.waitForTimeout(300);
 ok(JSON.stringify(await days(p))===JSON.stringify(d1),'a repaint freezes nothing new and changes nothing frozen');
 /* leaving empties it, and coming back shows the same day */
 await p.evaluate(()=>setTab(TAB.FIELD)); await p.waitForTimeout(300);
 ok((await p.evaluate(()=>document.getElementById('sumday').innerHTML))==='','leaving the Summary empties the column');
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(300);
 ok(JSON.stringify((await col(p)).st)===JSON.stringify(d1[0].st),'coming back shows the same frozen day');

 /* ---- the aim ---- */
 console.log('\n=== the aim ===');
 ok(k.form,'today\'s aim is offered once the day is frozen');
 ok(await p.evaluate(()=>document.querySelector('#sumday .dl-go').disabled),'Save is off while the line is empty');
 ok(await p.evaluate(()=>+document.getElementById('dlaimin').maxLength===DLY_CAP.aim),'the line is held to the boundary\'s own length');
 await p.fill('#dlaimin','Say it to her today');
 ok(!(await p.evaluate(()=>document.querySelector('#sumday .dl-go').disabled)),'and on once there is something in it');
 await p.click('#sumday .dl-go'); await p.waitForTimeout(300);
 const ev1=await p.evaluate(()=>CURP.summaries.events.map(function(e){return e.type+':'+(e.text||e.kind||'');}));
 ok(ev1.length===1&&ev1[0]==='aim_set:Say it to her today','the aim is written as one event: '+JSON.stringify(ev1));
 ok(/Saved/.test(await p.evaluate(()=>document.getElementById('status').textContent)),'and the save says so');
 const k2=await col(p);
 ok(!k2.form&&/Your aim today Say it to her today How did it go\?/i.test(k2.text),'the line is shown back in the person\'s own words, with the mark asked');
 const marks=await p.evaluate(()=>Array.prototype.map.call(document.querySelectorAll('#sumday [data-dlmark]'),function(x){return x.textContent;}));
 ok(JSON.stringify(marks)==='["Kept","Partly","Not kept","Not sure"]','four marks and no word for failure: '+JSON.stringify(marks));
 await p.click('#sumday [data-dlmark="partly"]'); await p.waitForTimeout(300);
 const ev2=await p.evaluate(()=>CURP.summaries.events.map(function(e){return e.type+':'+(e.text||e.kind||'');}));
 ok(ev2[1]==='aim_answer:partly','the mark is the second event: '+JSON.stringify(ev2));
 ok(/Marked partly kept\./.test((await col(p)).text),'and the column says what was marked');
 ok(JSON.stringify((await days(p)).map(d=>d.st))===JSON.stringify(d1.map(d=>d.st)),'an aim and a mark never edit the frozen day');
 const tapS=await p.evaluate(()=>Array.prototype.filter.call(document.querySelectorAll('#sumday button,#sumday input,#sumday summary'),function(e){
  var r=e.getBoundingClientRect(); return r.width>0&&(r.height<44||r.width<44);}).length);
 ok(tapS===0,'every control in the column is at least 44 by 44, '+tapS+' under');

 /* ---- kept across a reload ---- */
 console.log('\n=== a reload ===');
 const id=w.id;
 await p.reload(); await booted(p); await p.waitForTimeout(400);
 const back=await p.evaluate(id=>{var q=PROFILES.filter(function(x){return x.id===id;})[0]; if(!q)return null;
  CURP=q; loadProfile(CURP); setTab(TAB.SUMMARY);
  return {days:CURP.summaries.days.length, ev:CURP.summaries.events.length};},id);
 await p.waitForTimeout(400);
 ok(back&&back.days===1&&back.ev===2,'the day, the aim and the mark are on the record after a reload: '+JSON.stringify(back));
 const k3=await col(p);
 ok(JSON.stringify(k3.st)===JSON.stringify(d1[0].st)&&/Marked partly kept\./.test(k3.text),'and the column reads as it did');
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});

/* ---- 2. a worked example, nothing read, a save that fails ---- */
console.log('\n=== a worked example ===');
await section('a worked example',async()=>{
 const {c,p,errs}=await fresh();
 const ix=await p.evaluate(()=>PEOPLE.findIndex(function(x){return x.nm==='Marcus';}));
 await p.evaluate(i=>{loadP(i);setTab(TAB.SUMMARY);},ix); await p.waitForTimeout(500);
 const k=await col(p), st=await p.evaluate(()=>document.getElementById('status').getAttribute('data-kind'));
 ok(k.shown&&k.text.length>0,'a worked example still has a Today column');
 ok(!k.form,'and it offers no aim, because nothing on a worked example is kept');
 ok(await p.evaluate(()=>PROFILES.indexOf(CURP)<0&&!(CURP.summaries&&CURP.summaries.days&&CURP.summaries.days.length)),'and nothing is frozen on it');
 ok(st!=='fail','and nothing says a save failed, because none was tried');
 /* THE TWO DEFECTS F24 NAMED, held on the same page */
 const plate=await p.evaluate(()=>{var e=document.querySelector('#sumbody .s-plate');return e?e.innerText:'';});
 ok(plate.length>0&&!/%/.test(plate),'the headline reading is a number and not a percent (round PQ): '+JSON.stringify(plate.slice(0,60)));
 const dup=(sel)=>p.evaluate(sel=>{var t=document.querySelector(sel).innerText;
  var ss=t.split(/(?<=[.!?])\s+|\n+/).map(function(s){return s.trim();}).filter(function(s){return s.split(/\s+/).length>=5;});
  var cnt={}; ss.forEach(function(s){cnt[s]=(cnt[s]||0)+1;});
  return Object.keys(cnt).filter(function(s){return cnt[s]>1;});},sel);
 await p.evaluate(()=>{var d=document.createElement('div');d.id='dl-bad';d.innerText='One two three four five six. Seven eight nine ten. One two three four five six.';document.body.appendChild(d);});
 ok((await dup('#dl-bad')).length===1,'the duplicate probe finds a sentence put in twice, before it is trusted');
 await p.evaluate(()=>document.getElementById('dl-bad').remove());
 for(const nm of ['Sofia','Diane','Marcus','Angela','Derek','James']){
  await p.evaluate(nm=>{loadP(PEOPLE.findIndex(function(x){return x.nm===nm;}));setTab(TAB.SUMMARY);render();},nm); await p.waitForTimeout(250);
  const d=await dup('#sumbody');
  ok(d.length===0,nm+': no sentence is printed twice on the Summary: '+JSON.stringify(d.map(s=>s.slice(0,60))));}
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});
console.log('\n=== nothing read yet ===');
await section('nothing read yet',async()=>{
 const {c,p,errs}=await fresh();
 const r=await p.evaluate(()=>{var q=pNew('Nobody yet'); loadProfile(q); setTab(TAB.SUMMARY);
  return {rec:PROFILES.indexOf(CURP)>=0, unread:computeSeen().unread};});
 await p.waitForTimeout(400);
 const k=await col(p);
 ok(r.rec&&r.unread,'a new record of my own, with nothing read');
 ok(k.text===''&&!k.shown,'Today is silent on it, and its section steps aside');
 ok((await days(p)).length===0,'and no day is frozen for it, so the first real day is still the one written');
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});
console.log('\n=== a save that fails ===');
await section('a save that fails',async()=>{
 const {c,p,errs}=await fresh();
 const w=await p.evaluate(WORLD,{name:'Full disk'});
 ok(w.ok,'the world is in');
 await p.evaluate(()=>{Storage.prototype.setItem=function(){var e=new Error('The quota has been exceeded.');e.name='QuotaExceededError';throw e;};});
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 const st=await p.evaluate(()=>({k:document.getElementById('status').getAttribute('data-kind'),t:document.getElementById('status').textContent}));
 ok(st.k==='fail'&&/not saved/i.test(st.t),'a day the disk refused is reported as not saved: '+JSON.stringify(st));
 ok((await days(p)).length===0,'and memory holds no day the disk refused');
 const k=await col(p);
 ok(k.st.length>=3&&!k.form,'the sentences are still there to read, and no aim is offered on a day that was not kept');
 await p.evaluate(()=>{render();}); await p.waitForTimeout(200);
 const n=await p.evaluate(()=>MSG_LOG.filter(function(m){return /summary was not saved/.test(m.msg);}).length);
 ok(n===1,'one failure, one message, however often the page repaints: '+n);
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});
console.log('\n=== a phone ===');
await section('a phone',async()=>{
 const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const {p,errs}=await fresh(390,844,c);
 await p.evaluate(WORLD,{name:'Pat'});
 await p.evaluate(()=>setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
 const k=await col(p);
 ok(k.shown&&k.st.length>=3,'Today is on the phone too');
 const wide=await p.evaluate(()=>({doc:document.documentElement.scrollWidth, col:document.getElementById('sumday').getBoundingClientRect().right}));
 ok(wide.doc<=390&&wide.col<=390,'and nothing in it pushes the page sideways: '+JSON.stringify(wide));
 ok(errs.length===0,'no page errors: '+JSON.stringify(errs.slice(0,3)));
 await c.close();});
await b.close();
console.log('\n===== daily summary on the page: '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);})();
