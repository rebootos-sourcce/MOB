/* ============================================================
   THE LAW OF THE WEEK, GATED. node tests/ritlaw.js

   ui/ritlaw.js says what it is: the Ritual tab serves one law a week that the
   intake has not measured, in Called for, and its pop-up asks that law's
   three questions with the Intake page's own scale and writer. Every
   expected value here is worked out from the seed and the tables (SI and the
   seat order written below), never by asking ritLawOf or iqNext for the
   answer they are checked on.

   RL1 the card, its kind, and which law it serves
   RL2 the pop-up draws the Intake page's framings, byte for byte
   RL3 three answers in the pop-up: the record, the did log, the lit card
   RL4 the week holds: the next law waits for Sunday
   RL5 a new week serves the next law, and skips one the Intake page measured
   RL6 the week's law measured on the Intake page marks the week too
   RL7 every law measured: no card and no line claiming one
   RL8 a worked example's scale is drawn disabled

   PROVEN AGAINST MUTANTS. RL_MUTANT=<name> breaks one thing after boot; the
   rule guarding it must fail. SHOTS=<dir> saves the card and the pop-up at
   both widths. Run from the repo root, with NODE_PATH at playwright.
   ============================================================ */
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||path.join(ROOT,'source.html'))+'?dev=1';
const MUT=process.env.RL_MUTANT||'', SHOTS=process.env.SHOTS||'';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

const MUTANTS={
 /* the third answer never marks the week */
 nomark:`ritLawMark=function(){return false;};`,
 /* a second copy of the scale, drawn its own way */
 owncopy:`(function(){var f=ritPopLaw; ritPopLaw=function(st){return f(st).replace(/class="iq-n/g,'class="iq-n x');};})();`,
 /* the law walked in table order and not body order */
 tableorder:`iqNext=function(p){for(var i=0;i<SI.length;i++)if(iqGot(p,i)<3)return i; return null;};`,
 /* a card served when every law is measured */
 always:`(function(){var f=ritLawOf; ritLawOf=function(p){return f(p)||{li:0,done:false};};})();`};

if(require.main===module)(async()=>{
 const {chromium}=require('playwright');
 const browser=await chromium.launch({executablePath:process.env.CHROME||chromium.executablePath()});
 require('./net.js').guardBrowser(browser);
 const {FULL_SIGHT}=require('./seed.js');
 /* Monday 23 February 2026 at local noon, the day ritweek.js runs on, so the
    week is Sunday 22 to Saturday 28 */
 const AT=new Date(2026,1,23,12), NEXT=new Date(2026,2,2,12), THIRD=new Date(2026,2,9,12);
 const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
  try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
   await p.waitForTimeout(120);}catch(e){}};
 const open=async(W,H)=>{
  const phone=W<600, pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  await pg.addInitScript(FULL_SIGHT); await pg.clock.install({time:AT});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  if(MUT&&MUTANTS[MUT])await pg.evaluate(MUTANTS[MUT]);
  return {pg,err};};
 /* the person's own record with nothing answered and nothing in the did log */
 const SEED=()=>{
  loadP(0); CURP.intake.answers={}; CURP.intake.done=[]; CURP.intake.completedAt=null; iqApply(CURP);
  try{STORE.set('atuned-ritual-more','{}');}catch(e){}
  const wrote=!!pSave();
  setTab(TAB.RITUAL); ritRender();
  /* the body order, written here and not read off the page: the seats crown
     to root, and inside a seat the laws in SI's own order */
  const SEATS=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'], order=[];
  SEATS.forEach(b=>SI.forEach((l,i)=>{if(l.b===b)order.push(i);}));
  window.__RL_ORDER=order;
  return {wrote, order, own:ritOwn()};};
 const card=()=>{const c=document.querySelector('#rit .rv-sug .rv-lawc');
  if(!c)return null; const b=c.querySelector('[data-act="law-open"]'), k=c.querySelector('.rv-sgk');
  return {nm:b&&b.textContent, li:b?+b.getAttribute('data-wlaw'):null, on:c.classList.contains('rv-on'), kind:c.getAttribute('data-kind'),
   c:c.style.getPropertyValue('--c').trim(), word:k&&k.textContent, tip:k&&(k.getAttribute('data-tip')||''),
   sub:(c.querySelector('.rv-sgm')||{}).textContent, ring:!!c.querySelector('.rv-lawb .iqa-rg'), ringTip:(c.querySelector('.rv-lawb')||{getAttribute:()=>''}).getAttribute('data-tip')||'',
   inSug:(RIT.sug||[]).length, sg1:c.classList.contains('rv-sg1'),
   mean:(document.querySelector('#rit .rv-sug .rv-mean')||{}).textContent||''};};
 const did=()=>{try{const o=JSON.parse(STORE.get('atuned-ritual-more')||'{}'); return ((o[CURP.id]||{}).did||[]).filter(x=>/^iq:/.test(x[1]));}catch(e){return null;}};

 for(const [W,H] of [[1600,1000],[390,844]]){
  const tag='@'+W+' ';
  const {pg,err}=await open(W,H);
  try{
  const seed=await pg.evaluate(SEED);
  await pg.waitForTimeout(300);
  ok(seed.wrote&&seed.own,'RL0: '+tag+'the seed was written, on the person\'s own record');
  const order=seed.order, first=order[0], second=order[1], third=order[2];

  /* ---- RL1: the card ---- */
  const c1=await pg.evaluate(card);
  const nm=await pg.evaluate(i=>SI[i].nm,first);
  ok(!!c1,'RL1: '+tag+'a blank intake puts the law of the week in Called for');
  ok(c1&&c1.li===first&&c1.nm===nm,'RL1: '+tag+'it serves the first law in body order, crown first: '+(c1&&c1.nm)+', want '+nm);
  ok(c1&&c1.kind==='msr'&&c1.c==='var(--kd-msr)','RL1: '+tag+'it wears the Measure kind and its colour: '+JSON.stringify(c1&&[c1.kind,c1.c]));
  ok(c1&&c1.word==='Measure'&&c1.tip.length>20,'RL1: '+tag+'the kind\'s word carries its meaning on hover and tap');
  ok(c1&&c1.ring&&/^How often you /.test(c1.ringTip),'RL1: '+tag+'the law\'s own ring leads the card and says what the law asks: '+(c1&&c1.ringTip));
  ok(c1&&!c1.on&&c1.sub==='This week\'s law, 3 questions','RL1: '+tag+'unlit, and says what it is: '+(c1&&c1.sub));
  ok(c1&&!c1.sg1,'RL1: '+tag+'it is not a practice card, so no reader of RIT.sug takes it for one');
  ok(c1&&/laws your intake has not measured/.test(c1.mean),'RL1: '+tag+'the line under Called for names where the card comes from');
  const key=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-week .rv-kkey .rv-kch')].map(e=>e.getAttribute('data-tip-t')).join());
  ok(key==='Affirmation,Action,Meditation,Release','RL1: '+tag+'the week\'s key keeps its four, Measure is never a block on a day: '+key);
  if(SHOTS)await (await pg.$('#rit .rv-sug')).screenshot({path:path.join(SHOTS,'ritlaw-card-'+W+'.png')});

  /* ---- RL2: the pop-up is the Intake page's framings ---- */
  const p2=await pg.evaluate(li=>{document.querySelector('#rit .rv-lawc [data-act="law-open"]').click();
   const s=document.getElementById('sheet'), c=document.getElementById('sheet-card'), host=c.querySelector('.iq-law.iqa-inhand');
   /* through the parser once, so both sides are the browser's own serialisation */
   const tmp=document.createElement('div'); tmp.innerHTML=iqFramings(CURP,iqList(),li); const want=tmp.innerHTML;
   const cells=[...c.querySelectorAll('[data-a]')].map(e=>+e.getAttribute('data-a'));
   const r=host?host.getBoundingClientRect():{width:0};
   return {open:!s.hidden, law:!!c.querySelector('.rv-plaw'), head:(c.querySelector('.sh-h')||{}).textContent,
    same:!!host&&host.innerHTML===want, qc:c.querySelectorAll('.iq-qc').length, cells:cells.length,
    idx:[...new Set(cells)].sort((a,b)=>a-b).join(), w:Math.round(r.width), vw:innerWidth,
    over:document.documentElement.scrollWidth>innerWidth};},first);
  ok(p2.open&&p2.law&&p2.head===nm,'RL2: '+tag+'the name opens the law\'s pop-up: '+p2.head);
  ok(p2.same,'RL2: '+tag+'the three questions are iqFramings\'s own markup, not a copy');
  ok(p2.qc===3&&p2.cells===33&&p2.idx===[first*3,first*3+1,first*3+2].join(),'RL2: '+tag+'three framings of eleven cells, answers '+p2.idx);
  ok(!p2.over&&p2.w>0,'RL2: '+tag+'the pop-up fits the width: '+p2.w+' in '+p2.vw);
  if(SHOTS)await (await pg.$('#sheet-card')).screenshot({path:path.join(SHOTS,'ritlaw-popup-'+W+'.png')});

  /* ---- RL3: three answers in the pop-up ---- */
  const vals=[4,7,5];
  for(let t=0;t<3;t++){
   await pg.evaluate(([a,v])=>{document.querySelector('#sheet-card [data-a="'+a+'"][data-v="'+v+'"]').click();},[first*3+t,vals[t]]);
   await pg.waitForTimeout(80);}
  const p3=await pg.evaluate(([li,vals])=>{const c=document.getElementById('sheet-card'), a=CURP.intake.answers;
   return {ans:[0,1,2].map(t=>a[li*3+t]), scored:!!iqScore(CURP)[SI[li].nm], lit:[...c.querySelectorAll('.iq-n.on')].map(e=>+e.getAttribute('data-v')),
    head:(c.querySelector('.sh-h')||{}).textContent, sub:(c.querySelector('.rv-shs')||{}).textContent,
    note:[...c.querySelectorAll('.rv-pp')].map(e=>e.textContent).join(' '), focus:document.activeElement&&document.activeElement.getAttribute('data-v')};},[first,vals]);
  const d3=await pg.evaluate(did), today=await pg.evaluate(()=>ritToday0());
  ok(p3.ans.join()===vals.join()&&p3.scored,'RL3: '+tag+'the three answers are on the record and the law is measured: '+p3.ans.join());
  ok(p3.lit.join()===vals.join(),'RL3: '+tag+'the scale shows what was pressed, redrawn from the record');
  ok(d3&&d3.length===1&&d3[0][0]===today&&d3[0][1]==='iq:'+first,'RL3: '+tag+'one did entry, today, for this law: '+JSON.stringify(d3));
  ok(p3.head===nm&&p3.sub==='Measured this week','RL3: '+tag+'the pop-up stays on the law it measured: '+p3.head+', '+p3.sub);
  ok(/The next law comes on Sunday/.test(p3.note),'RL3: '+tag+'and says when the next one comes: '+p3.note);
  ok(p3.focus==='5','RL3: '+tag+'the keyboard stays on the cell pressed');
  await pg.evaluate(()=>{sheetShut(); RIT.pop=null; ritRender();});
  const c3=await pg.evaluate(card);
  if(SHOTS)await (await pg.$('#rit .rv-sug')).screenshot({path:path.join(SHOTS,'ritlaw-card-done-'+W+'.png')});
  ok(c3&&c3.li===first&&c3.on&&c3.sub==='Measured this week','RL3: '+tag+'the card is lit on the same law: '+JSON.stringify(c3&&[c3.nm,c3.on,c3.sub]));

  /* ---- RL4: the week holds ---- */
  const c4=await pg.evaluate(()=>{ritRender(); const c=document.querySelectorAll('#rit .rv-lawc').length; return c;});
  ok(c4===1,'RL4: '+tag+'one law card this week, not a second for the next law: '+c4);

  /* ---- RL5: a new week ---- */
  await pg.clock.setSystemTime(NEXT);
  const c5=await pg.evaluate(()=>{ritRender(); return null;});
  const c5b=await pg.evaluate(card);
  const nm2=await pg.evaluate(i=>SI[i].nm,second);
  ok(c5b&&c5b.li===second&&c5b.nm===nm2&&!c5b.on,'RL5: '+tag+'the next Monday serves the next law in body order, unlit: '+(c5b&&c5b.nm)+', want '+nm2);
  /* the second law measured another way, with no press and so no mark: the
     card moves past it to the third, which is iqNext skipping it */
  await pg.evaluate(li=>{[0,1,2].forEach(t=>iqAnswer(CURP,li*3+t,6)); iqApply(CURP); pSave(); ritRender();},second);
  const c5c=await pg.evaluate(card), nm3=await pg.evaluate(i=>SI[i].nm,third);
  ok(c5c&&c5c.li===third&&!c5c.on,'RL5: '+tag+'a law measured elsewhere is skipped: '+(c5c&&c5c.nm)+', want '+nm3);

  /* ---- RL6: the week's law measured on the Intake page ---- */
  const p6=await pg.evaluate(async li=>{setTab(TAB.INTAKE); IQ_VIEW='list'; IQ_OPEN=li; renderIntake();
   for(let t=0;t<3;t++){const b=document.querySelector('#iqbody [data-a="'+(li*3+t)+'"][data-v="8"]'); if(b)b.click(); await new Promise(r=>setTimeout(r,60));}
   const ans=[0,1,2].map(t=>CURP.intake.answers[li*3+t]);
   IQ_OPEN=null; IQ_VIEW='list'; setTab(TAB.RITUAL); ritRender(); return ans;},third);
  const d6=await pg.evaluate(did), c6=await pg.evaluate(card), today6=await pg.evaluate(()=>ritToday0());
  ok(p6.join()==='8,8,8','RL6: '+tag+'three presses on the Intake page landed: '+p6.join());
  ok(d6&&d6.some(x=>x[0]===today6&&x[1]==='iq:'+third),'RL6: '+tag+'the Intake page\'s press marks the week\'s law done too: '+JSON.stringify(d6));
  ok(c6&&c6.li===third&&c6.on,'RL6: '+tag+'and the card is lit on it, not moved to a fourth law: '+JSON.stringify(c6&&[c6.nm,c6.on]));

  /* ---- RL7: every law measured ---- */
  await pg.clock.setSystemTime(THIRD);
  const p7=await pg.evaluate(()=>{for(let i=0;i<SI.length*3;i++)if(CURP.intake.answers[i]==null)iqAnswer(CURP,i,5);
   iqApply(CURP); pSave(); ritRender();
   const s=document.querySelector('#rit .rv-sug .rv-mean');
   return {n:document.querySelectorAll('#rit .rv-lawc').length, all:Object.keys(iqScore(CURP)).length, mean:s?s.textContent:''};});
  ok(p7.all===21,'RL7: '+tag+'all 21 laws measured: '+p7.all);
  ok(p7.n===0,'RL7: '+tag+'nothing to serve, so no card: '+p7.n);
  ok(!/laws your intake/.test(p7.mean),'RL7: '+tag+'and the line under Called for no longer names one');

  /* ---- RL8: a worked example ---- */
  const p8=await pg.evaluate(()=>{const i=PEOPLE.findIndex((p,k)=>k>0&&p); if(i<0)return null; loadP(i);
   if(!showOnly())return {skip:true};
   /* every worked example has all 63 answered, so one law's three are taken
      off in memory only, which a worked example's save refuses anyway */
   const li=0; CURP.intake.answers=Object.assign({},CURP.intake.answers); [0,1,2].forEach(t=>{delete CURP.intake.answers[t];});
   ritBankOpen({t:'law', li:li, W:{}});
   const c=document.getElementById('sheet-card'), cells=[...c.querySelectorAll('[data-a]')];
   const r={n:cells.length, off:cells.every(e=>e.disabled)}; sheetShut(); RIT.pop=null; return r;});
  ok(p8&&!p8.skip&&p8.n===33&&p8.off,'RL8: '+tag+'on a worked example every cell is drawn disabled: '+JSON.stringify(p8));
  ok(err.length===0,'RL9: '+tag+'no page error: '+err.join(' | '));
  }catch(e){ok(false,'RL: '+tag+'threw: '+e.message);}
  await pg.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})();
else module.exports={};
