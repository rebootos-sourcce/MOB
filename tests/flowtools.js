/* ============================================================
   THE FLOW TOOL SETS, GATED. node tests/flowtools.js, and called from
   tests/functional.js so a full run holds it through the same code.

   The owner, 2 October, his words: "On the flow pages, get rid of the left and
   right menu. Actually, sorry. Move the new ritual to the right menu. And
   you're supposed to move accountability to its own tool set. You should have
   rules on a TDD for all this."

   The rules are DESIGN-flow-tools.md, FT1 to FT15, linked from the practice
   TDD. Every check below opens its message with the rule it holds, so the rule
   and its gate can be found from either end, and the last group fails the run
   if the two lists disagree: a rule with no check, or a check for a rule
   nobody wrote down, is the defect this file exists to stop.

   NOTHING IS TYPED THAT THE PAGE CAN SAY. The two tool sets are read off
   TABDEF by their .k, the practices off PRACTICE, the miss threshold off the
   engine's own PR_MISS_AT, and the expected count of missed days is worked
   out in this file from the days and the entries and not by asking the page's
   own function, because a gate that asks the code for the answer it is
   checking passes on any bug.

   Run it against the build from before the split and the first fourteen
   groups fail, which is how it was shown to bite.
   ============================================================ */
const fs=require('fs');
const path=require('path');

async function flowGate(browser,FILE,ok,booted){
 /* ---- FT1, FT2, FT3, FT4, FT5, FT6, FT12, FT13, FT14: the surfaces, both widths ---- */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600, tag='@'+W+' ';
  const pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  /* a group that throws is a failure with a name, not a crash that hides the
     groups after it. This is what lets the gate be run against a build from
     before the split and report which rules it breaks. */
  try{
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||260);

  const nav=await pg.evaluate(()=>{
   const flow=TABDEF.filter(t=>t.sec==='flow').map(t=>t.k);
   const btns=[...document.querySelectorAll('.tabgrp[data-sec="flow"] .tabtop')].map(b=>+b.getAttribute('data-tabk'));
   return {flow, btns, ritual:TAB.RITUAL, acct:TAB.ACCOUNT,
    ints:Object.values(TAB).length===new Set(Object.values(TAB)).size,
    name:TABOF(TAB.ACCOUNT).nm, nameR:TABOF(TAB.RITUAL).nm,
    host:TABOF(TAB.ACCOUNT).id};});
  ok(JSON.stringify(nav.flow)===JSON.stringify([nav.ritual,nav.acct])&&JSON.stringify(nav.btns)===JSON.stringify(nav.flow),
   'FT1: '+tag+'Flow is two tool sets, Ritual then Accountability, looked up by key, in the engine and the markup alike, '
   +JSON.stringify(nav));
  ok(nav.acct===14&&nav.ints,'FT1: '+tag+'Accountability is integer 14, appended, and no integer is shared, '+nav.acct);

  /* a person with something active, so the closed menu and the lists have rows */
  await pg.evaluate(()=>{loadP(0);});
  for(const which of ['RITUAL','ACCOUNT']){
   /* a tool set the build does not have is a failed rule and not a crash, so
      the gate can be run against the build from before the split */
   if(await pg.evaluate(t=>TAB[t]===undefined,which)){
    ok(false,'FT2: '+tag+which+' is not a tab in this build, so none of FT2, FT3, FT12 or FT14 can hold for it');
    continue;}
   await pg.evaluate(t=>setTab(TAB[t]),which); await wait(500);
   const o=await pg.evaluate(()=>{
    const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect();
     return getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0;};
    const lcol=document.getElementById('lcol');
    const panel=document.getElementById('rpanel');
    const kids=[...panel.children].filter(c=>vis(c)&&!c.classList.contains('rfold')).map(c=>c.id||c.className);
    const rail=document.getElementById('flowrail'), rr=rail?rail.getBoundingClientRect():{left:0,right:0};
    const lsec=[...document.querySelectorAll('.lsec')].filter(vis).map(e=>e.getAttribute('data-sec'));
    return {lcol:getComputedStyle(lcol).display, lbox:Math.round(lcol.getBoundingClientRect().width),
     kids, rail:vis(rail), railR:Math.round(rr.right), railL:Math.round(rr.left), vw:innerWidth,
     lsec, rel:vis(document.getElementById('bRel')),
     sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth,
     hd:(document.getElementById('flowhd')||{}).textContent||''};});
   ok(o.lcol==='none'&&o.lbox===0&&!o.lsec.some(k=>true),
    'FT2: '+tag+which+' draws no left column and no rail section at all, '+JSON.stringify({lcol:o.lcol,lsec:o.lsec}));
   ok(o.kids.length===1&&o.kids[0]==='flowrail'&&o.rail&&!o.rel,
    'FT3: '+tag+which+' has one panel in the right column, the Flow menu, and not the reading or Run a release, '+JSON.stringify(o.kids));
   ok(o.railL>=0&&o.railR<=o.vw+1&&o.sw<=o.cw,
    'FT12: '+tag+which+' menu sits inside the screen and the page does not scroll sideways, '+JSON.stringify({l:o.railL,r:o.railR,vw:o.vw,sw:o.sw}));
   ok(/Ritual|Accountability/.test(o.hd)&&o.hd.length>25,
    'FT14: '+tag+which+' menu names its tool set and says in a sentence what it is, '+o.hd);
  }

  /* off Flow the columns are the product's own again */
  await pg.evaluate(()=>setTab(TAB.FIELD)); await wait(400);
  const off=await pg.evaluate(()=>{
   const d=id=>{const e=document.getElementById(id); return e?getComputedStyle(e).display:'missing';};
   const a=document.getElementById('acct');
   return {rail:d('flowrail'), acct:d('acct'), rit:d('rit'),
    reading:getComputedStyle(document.querySelector('.lsec[data-sec="you"]')).display, acctHtml:a?a.innerHTML.length:-1};});
  ok(off.rail==='none'&&off.acct==='none'&&off.rit==='none'&&off.reading!=='none'&&off.acctHtml===0,
   'FT3: '+tag+'off Flow the menu, both hosts are shut and empty and the rail has its sections back, '+JSON.stringify(off));

  /* ---- FT4 and FT5: New ritual is in the right menu, and only there ---- */
  await pg.evaluate(()=>{loadP(0); setTab(TAB.RITUAL);}); await wait(500);
  const nr=await pg.evaluate(()=>{
   const rc=document.getElementById('rcol'), rit=document.getElementById('rit');
   const ctl='[data-act="add"],[data-act="tag"],[data-act="newtag"],[data-act="save"],[data-act="span"],[data-act="often"],.rv-new,.rv-build,#ritwhen,#ritwhere';
   const inRail=[...rc.querySelectorAll(ctl)].length;
   const inStage=[...rit.querySelectorAll(ctl)].length;
   const w=document.getElementById('ritwhen');
   return {inRail,inStage,when:!!(w&&rc.contains(w)),
    head:[...rc.querySelectorAll('.rv-h')].map(x=>x.textContent),
    acc:rit.querySelectorAll('.rv-rec,.rv-today,.rv-marks,.rv-cal,.rv-key,.rv-hero,.rv-figs').length,
    stage:[...rit.querySelectorAll('.rv-h')].map(x=>x.textContent)};});
  ok(nr.inRail>0&&nr.inStage===0&&nr.when&&nr.head.indexOf('New ritual')>=0,
   'FT4: '+tag+'New ritual, its tags, timer, days and when and where fields are in the right menu and none is on the stage, '+JSON.stringify({r:nr.inRail,s:nr.inStage,h:nr.head}));
  ok(nr.acc===0,'FT5: '+tag+'the Ritual stage holds no streak, rings, marks or record, '+nr.acc+' found, '+nr.stage.join(', '));

  /* with one ritual active the menu is closed, and pressing New ritual opens the builder in the same place */
  const closed=await pg.evaluate(async()=>{
   const k=PRACTICE.filter(p=>!p.tc)[0].k;
   ritStartPlan({steps:[k],band:'',track:'',days:7,when:'',where:''},'Started.');
   /* the builder had opened itself on the called practice while nothing was
      active, and a start through the builder's own button clears it, so this
      does what that press does before it looks at the closed menu */
   RIT.sel={}; RIT.order=[]; RIT.add=false; ritRender();
   await new Promise(r=>setTimeout(r,200));
   const rc=document.getElementById('rcol');
   const shut=!!rc.querySelector('.rv-shut .rv-add')&&!rc.querySelector('#ritwhen');
   const stageAdd=document.querySelectorAll('#rit [data-act="add"]').length;
   const add=rc.querySelector('.rv-add'); if(add)add.click(); await new Promise(r=>setTimeout(r,200));
   const wk=rc.querySelector('.rv-wk'), rl=document.getElementById('flowrail'), rr=rl?rl.getBoundingClientRect():{left:0,right:0};
   const wr=wk?wk.getBoundingClientRect():null;
   return {shut, stageAdd, open:!!rc.querySelector('#ritwhen'), tags:rc.querySelectorAll('.rv-tag2').length, bands:BANDS.length,
    weekFits:!!wr&&wr.right<=rr.right+0.5&&wr.left>=rr.left-0.5, listed:document.querySelectorAll('#rit .rv-item').length};});
  ok(closed.shut&&closed.stageAdd===0&&closed.open&&closed.tags===closed.bands,
   'FT4: '+tag+'with a ritual active, New ritual is one press in the right menu and opens the builder in the same place, '+JSON.stringify(closed));
  ok(closed.weekFits,'FT12: '+tag+'the builder\'s seven day row fits inside the menu, '+JSON.stringify(closed));
  ok(closed.listed===1,'FT4: '+tag+'the Active list stays on the stage, '+closed.listed);
  await pg.evaluate(()=>{ritWrite(function(){CURP.rituals=[];return [];},null);});

  /* ---- FT6: Accountability is its own entry, and pressing its button lands ---- */
  await pg.evaluate(()=>setTab(TAB.RITUAL)); await wait(300);
  const open=await pg.evaluate(async()=>{
   const b=document.querySelector('.tabgrp[data-sec="flow"] .tabtop[data-tabk="'+TAB.ACCOUNT+'"]');
   const had=!!b; if(b)b.click(); await new Promise(r=>setTimeout(r,500));
   const a=document.getElementById('acct'), r=a?a.getBoundingClientRect():{width:0,height:0};
   return {had, landed:S.tab===TAB.ACCOUNT, pressed:!!b&&b.getAttribute('aria-pressed')==='true', cls:document.body.classList.contains('tab-acct'),
    shown:!!a&&getComputedStyle(a).display!=='none'&&r.width>0&&r.height>0, text:a?a.innerText.length:0,
    rit:getComputedStyle(document.getElementById('rit')).display,
    heads:a?[...a.querySelectorAll('.rv-h')].map(x=>x.textContent):[],
    side:[...document.querySelectorAll('#flowside .rv-h')].map(x=>x.textContent)};});
  ok(open.had&&open.landed&&open.pressed&&open.cls&&open.shown&&open.text>60&&open.rit==='none',
   'FT6: '+tag+'the Accountability button lands on its own host, the Ritual host is shut, '+JSON.stringify(open));
  ok(open.heads.indexOf('Done')>=0&&open.heads.indexOf('Record')>=0&&open.side.indexOf('Due today')>=0&&open.side.indexOf('Missed')>=0,
   'FT6: '+tag+'it holds Done and Record on the stage and Due today and Missed in the right menu, '+JSON.stringify([open.heads,open.side]));
  }catch(e){ok(false,'FT6: '+tag+'the surfaces group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
  ok(err.length===0,tag+'no page errors across the Flow surfaces, '+err.join(' | '));
 }

 /* ---- FT8, FT7, FT9, FT13, FT14: empty states, the reads, the writes ---- */
 {
  const pg=await browser.newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||260);
  try{

  /* FT8, a person with nothing active and nothing on the record */
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.ACCOUNT);}); await wait(500);
  const e0=await pg.evaluate(()=>({
   due:(document.querySelector('#flowside .rv-act .rv-empty')||{}).textContent||'',
   miss:(document.querySelector('#flowside .rv-miss .rv-empty')||{}).textContent||'',
   go:!!document.querySelector('#flowside [data-act="go-ritual"]'),
   streak:(document.querySelector('#acct .rv-mid b')||{}).textContent,
   made:document.querySelectorAll('#flowside [data-act="add"],#flowside [data-act="save"]').length}));
  ok(/Nothing active yet/.test(e0.due)&&/Nothing to miss yet/.test(e0.miss)&&e0.go&&e0.streak==='0'&&e0.made===0,
   'FT8: with nothing active Accountability says so, offers Open Ritual and not a second builder, and the streak is a real 0, '+JSON.stringify(e0));
  await pg.evaluate(()=>document.querySelector('#flowside [data-act="go-ritual"]').click()); await wait(400);
  ok(await pg.evaluate(()=>S.tab===TAB.RITUAL&&!!document.querySelector('#rcol #ritwhen')),
   'FT8: Open Ritual lands on Ritual with the builder in the right menu');

  /* the seed: three plans and a record of known days. The expected counts are
     worked out below from the days alone. */
  const seed=await pg.evaluate(()=>{
   loadP(0); CURP.rituals=[];
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
   const today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   const ks=PRACTICE.filter(p=>!p.tc).map(p=>p.k);
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7;
   const A={id:'ra',steps:[ks[0]],when:'',where:'',days:0,from:iso(today-9),stop:null,band:'',track:'',rel:null,tc:null,tags:[],on:null,tm:null};
   const B={id:'rb',steps:[ks[1]],when:'',where:'',days:0,from:iso(today-2),stop:null,band:'',track:'',rel:null,tc:null,tags:[],on:null,tm:null};
   const C={id:'rc',steps:[ks[2]],when:'',where:'',days:0,from:iso(today-20),stop:null,band:'',track:'',rel:null,tc:null,tags:[],on:[(wd(today)+1)%7],tm:null};
   const done=[[ks[0],today-8],[ks[0],today-7],[ks[0],today-3],[ks[0],today-1],[ks[1],today-2],[ks[1],today-1]];
   done.forEach(([k,d])=>CURP.rituals.push({t:iso(d),steps:[k],min:1,when:'',where:'',done:iso(d)}));
   const ok1=ritPlanPut([A,B,C])&&pSave();
   setTab(TAB.ACCOUNT);
   /* the expectation, from first principles */
   const missed=p=>{let n=0; for(let d=today-14;d<today;d++){
     const start=Math.floor((new Date(p.from).getTime()-off)/DAY);
     if(d<start)continue; if(p.on&&p.on.indexOf(wd(d))<0)continue;
     const k=p.steps[0];
     const did=done.some(x=>x[0]===k&&x[1]===d); if(!did)n++;} return n;};
   return {ok1, want:{ra:missed(A),rb:missed(B),rc:missed(C)}, names:{ra:ritName(A.steps),rb:ritName(B.steps),rc:ritName(C.steps)},
    keptDays:new Set(done.map(x=>x[1])).size, today, missAt:PR_MISS_AT, span:ACCT_SPAN};});
  await wait(500);
  ok(seed.ok1,'FT7: the seed was written through the store and the record');
  const rd=await pg.evaluate(()=>{
   const rows=[...document.querySelectorAll('#flowside .rv-miss .rv-dr')].map(r=>({
    t:r.querySelector('.rv-dn').textContent.replace(/\s+/g,' ').trim(), edit:!!r.querySelector('[data-act="miss-edit"]')}));
   const due=[...document.querySelectorAll('#flowside .rv-act .rv-item')].map(r=>({
    nm:r.querySelector('.rv-nm').textContent, sub:r.querySelector('.rv-sub').textContent, id:r.querySelector('.rv-log').getAttribute('data-id')}));
   const figs=[...document.querySelectorAll('#acct .rv-fig')].map(f=>f.textContent.replace(/\s+/g,' ').trim());
   return {rows, due, figs, streak:+(document.querySelector('#acct .rv-mid b')||{}).textContent,
    ladder:ladderRead(CURP,Date.now()).streak.run,
    both:document.getElementById('acct').innerText+' '+document.getElementById('flowrail').innerText};});
  const num=t=>{const m=/(\d+) days? missed/.exec(t); return m?+m[1]:0;};
  const rowOf=nm=>rd.rows.filter(r=>r.t.indexOf(nm)===0)[0];
  ok(num((rowOf(seed.names.ra)||{}).t||'')===seed.want.ra&&seed.want.ra>0,
   'FT7: the first ritual reads '+seed.want.ra+' days missed, worked out from the days and not from the page, got '+JSON.stringify(rd.rows));
  ok(num((rowOf(seed.names.rc)||{}).t||'')===seed.want.rc&&seed.want.rc>0,
   'FT7: a ritual kept on one weekday counts only that weekday, '+seed.want.rc+', got '+JSON.stringify(rd.rows));
  ok(!rowOf(seed.names.rb)&&seed.want.rb===0,'FT7: a ritual with nothing missed is not listed as missed');
  ok(rd.rows[0]&&num(rd.rows[0].t)>=num((rd.rows[1]||{t:''}).t),'FT7: the most missed is first, '+JSON.stringify(rd.rows));
  const hasEdit=n=>(rowOf(n)||{}).edit;
  ok(hasEdit(seed.names.ra)===(seed.want.ra>=seed.missAt)&&hasEdit(seed.names.rc)===(seed.want.rc>=seed.missAt),
   'FT7: Edit is offered at '+seed.missAt+' misses or more and not below, the engine\'s own PR_MISS_AT, '+JSON.stringify(rd.rows));
  ok(rd.due.length===2&&rd.due.every(d=>d.nm!==seed.names.rc),
   'FT7: Due today lists the two rituals whose day it is and not the one kept on another weekday, '+JSON.stringify(rd.due.map(d=>d.nm)));
  ok(rd.streak===rd.ladder,'FT7: the streak is the ladder\'s own, '+rd.streak+' against '+rd.ladder);
  ok(rd.figs.some(f=>new RegExp('^'+seed.keptDays+' days?\\s*Kept').test(f)),
   'FT7: Kept is the count of days with something done, '+seed.keptDays+', got '+JSON.stringify(rd.figs));
  ok(!/%|\bscore\b|\bpercent\b/i.test(rd.both),'FT7: no percent and no score anywhere on Accountability');

  /* FT14, the unpack rule: each heading carries its meaning in the same place */
  const mean=await pg.evaluate(()=>{
   const out={};
   document.querySelectorAll('#acct .rv-sec,#flowside .rv-sec').forEach(s=>{
    const h=(s.querySelector('.rv-h')||{}).textContent, m=s.querySelector('.rv-mean');
    out[h]=m?m.textContent.length:0;});
   return out;});
  ok(['Done','Record','Due today','Missed'].every(h=>mean[h]>30),
   'FT14: Done, Record, Due today and Missed each carry a sentence saying what they mean, '+JSON.stringify(mean));

  /* FT9: a mark is one press, through the one writer, and it says so */
  const mk=await pg.evaluate(async()=>{
   const pressB=()=>document.querySelector('#flowside .rv-log[data-id="rb"]');
   const n0=CURP.rituals.length, st=()=>(document.getElementById('status')||{}).textContent||'';
   const before=pressB().getAttribute('aria-pressed');
   pressB().click(); await new Promise(r=>setTimeout(r,200));
   const afterOn={pressed:pressB().getAttribute('aria-pressed'), n:CURP.rituals.length, said:st(), sub:document.querySelector('#flowside [data-id="rb"]').closest('.rv-item').querySelector('.rv-sub').textContent};
   pressB().click(); await new Promise(r=>setTimeout(r,200));
   const afterOff={pressed:pressB().getAttribute('aria-pressed'), n:CURP.rituals.length, said:st()};
   return {before,n0,afterOn,afterOff};});
  ok(mk.before==='false'&&mk.afterOn.pressed==='true'&&mk.afterOn.n===mk.n0+1&&/^Done/.test(mk.afterOn.said)&&/Done today/.test(mk.afterOn.sub),
   'FT9: pressing the ring on Due today marks the day, adds one entry and says Done through status, '+JSON.stringify(mk));
  ok(mk.afterOff.pressed==='false'&&mk.afterOff.n===mk.n0&&/Taken off/.test(mk.afterOff.said),
   'FT9: the same press takes it off again and says so, '+JSON.stringify(mk.afterOff));
  const bad=await pg.evaluate(async()=>{
   const was=window.pSave, n0=JSON.stringify(CURP.rituals);
   window.pSave=function(){throw new Error('disk full');};
   document.querySelector('#flowside .rv-log[data-id="rb"]').click(); await new Promise(r=>setTimeout(r,200));
   window.pSave=was;
   return {said:(document.getElementById('status')||{}).textContent||'', kept:JSON.stringify(CURP.rituals)===n0,
    pressed:document.querySelector('#flowside .rv-log[data-id="rb"]').getAttribute('aria-pressed')};});
  ok(/Could not save/.test(bad.said)&&bad.kept&&bad.pressed==='false',
   'FT9: a save that fails says so through status, keeps nothing and the ring stays open, '+JSON.stringify(bad));
  /* the same press on a worked example is refused by name and never claims success */
  const ex=await pg.evaluate(async()=>{
   loadP(PEOPLE.findIndex(p=>!p.you)); setTab(TAB.ACCOUNT); await new Promise(r=>setTimeout(r,300));
   const had=document.querySelectorAll('#flowside .rv-log').length;
   const note=(document.querySelector('#acct .rv-note')||{}).textContent||'';
   return {note, had};});
  ok(/worked example, so nothing here is saved/.test(ex.note),'FT9: a worked example says on Accountability that nothing is saved, '+ex.note);
  const ex2=await pg.evaluate(async()=>{
   const ok0=ritWrite(function(){return [];},'Done.');
   return {ok0, said:(document.getElementById('status')||{}).textContent||''};});
  ok(ex2.ok0===false&&/worked example/.test(ex2.said),'FT9: a write on a worked example is refused by name, '+JSON.stringify(ex2));

  /* FT7 again, the edit route: Edit on a missed ritual lands on Ritual with that ritual open in the builder */
  await pg.evaluate(()=>{loadP(0); setTab(TAB.ACCOUNT);}); await wait(400);
  const ed=await pg.evaluate(async()=>{
   const b=document.querySelector('#flowside [data-act="miss-edit"]'); if(!b)return {none:true};
   const id=b.getAttribute('data-id'); b.click(); await new Promise(r=>setTimeout(r,300));
   return {tab:S.tab===TAB.RITUAL, edit:RIT.edit===id, builder:!!document.querySelector('#rcol .rv-build'),
    head:(document.querySelector('#rcol .rv-build .rv-h')||{}).textContent};});
  ok(!ed.none&&ed.tab&&ed.edit&&ed.builder&&ed.head==='Edit',
   'FT9: Edit on a missed ritual goes to Ritual with that ritual open in the builder in the right menu, '+JSON.stringify(ed));

  /* FT13: the fold is the person's own, and it still works on Flow */
  const fold=await pg.evaluate(async()=>{
   const rf=document.getElementById('rfold'); const rs0=document.body.classList.contains('rshut');
   rf.click(); await new Promise(r=>setTimeout(r,150));
   const shut=document.body.classList.contains('rshut'), railShut=getComputedStyle(document.getElementById('flowrail')).display==='none';
   const btn=document.getElementById('rfold').getBoundingClientRect();
   rf.click(); await new Promise(r=>setTimeout(r,150));
   return {rs0, shut, railShut, back:!document.body.classList.contains('rshut'),
    railOn:getComputedStyle(document.getElementById('flowrail')).display!=='none', btn:btn.width>0};});
  ok(!fold.rs0&&fold.shut&&fold.railShut&&fold.back&&fold.railOn&&fold.btn,
   'FT13: shutting the right column on Flow shuts the menu to its one control and opening it brings the menu back, '+JSON.stringify(fold));

  }catch(e){ok(false,'FT7: the reads and writes group threw, '+String(e.message).split('\n')[0]);}

  /* ---- FT11: a caller off the tab goes to the tab ---- */
  try{
  const off=await pg.evaluate(async()=>{
   loadP(0); setTab(TAB.FIELD); await new Promise(r=>setTimeout(r,250));
   ritOpen([{name:'Blame'}]); await new Promise(r=>setTimeout(r,300));
   const a={tab:S.tab===TAB.RITUAL, from:!!document.querySelector('#rcol .rit-from'), builder:!!document.querySelector('#rcol #ritwhen')};
   setTab(TAB.COMPASS); await new Promise(r=>setTimeout(r,300));
   const rit=getComputedStyle(document.getElementById('rit')).display;
   ritRender();
   const rit2=getComputedStyle(document.getElementById('rit')).display;
   return {a, rit, rit2};});
  ok(off.a.tab&&off.a.from&&off.a.builder,
   'FT11: ritOpen from another tab lands on Ritual with the release\'s log in the builder in the right menu, '+JSON.stringify(off.a));
  ok(off.rit==='none'&&off.rit2==='none',
   'FT11: a ritual write while on the Compass paints nothing over it, '+JSON.stringify([off.rit,off.rit2]));

  }catch(e){ok(false,'FT11: the off tab group threw, '+String(e.message).split('\n')[0]);}

  /* ---- FT10: the Compass route still lands, and shows in both tool sets ---- */
  try{
  const cmp=await pg.evaluate(async()=>{
   const wait=ms=>new Promise(r=>setTimeout(r,ms||250));
   loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.COMPASS); await wait(500);
   const i=MIRROR.findIndex(m=>m.k==='PE');
   const row=document.querySelector('#cone .cn-nr[data-cnax="'+i+'"]'); if(!row)return {noRow:true};
   row.click(); await wait();
   const go=document.querySelector('#rdrill [data-tcxgo]');
   const label=go?go.textContent:'';
   if(go)go.click(); await wait(400);
   const plan=ritPlans().filter(p=>p.tc==='PE')[0]||null;
   const said=(document.getElementById('status')||{}).textContent||'';
   setTab(TAB.ACCOUNT); await wait(400);
   const due=[...document.querySelectorAll('#flowside .rv-act .rv-nm')].map(x=>x.textContent);
   setTab(TAB.RITUAL); await wait(400);
   const act=[...document.querySelectorAll('#rit .rv-item .rv-sub')].map(x=>x.textContent).filter(t=>/Toward Buddha/.test(t)).length;
   return {label, plan:!!plan, said, name:plan?ritName(plan.steps):'', due, act};});
  ok(!cmp.noRow&&cmp.label==='Add to my ritual'&&cmp.plan&&/^Added/.test(cmp.said),
   'FT10: Add to my ritual on the Compass teacher panel still writes the plan and says Added, '+JSON.stringify(cmp));
  ok(cmp.act===1&&cmp.due.indexOf(cmp.name)>=0,
   'FT10: the added ritual is on the Ritual list and on Accountability\'s Due today, '+JSON.stringify([cmp.act,cmp.due,cmp.name]));
  }catch(e){ok(false,'FT10: the Compass group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'no page errors across the Flow reads and writes, '+err.join(' | '));
  await pg.close();
 }

 /* ---- FT15: the rules and the gates are one list ---- */
 {
  const md=fs.readFileSync(path.join(__dirname,'..','DESIGN-flow-tools.md'),'utf8');
  const tdd=fs.readFileSync(path.join(__dirname,'..','ATUNED-practice-ritual-accountability-trace-graph-TDD.md'),'utf8');
  const src=fs.readFileSync(__filename,'utf8');
  const rules=[...md.matchAll(/^### (FT\d+)\./gm)].map(m=>m[1]);
  /* a rule's gate line is `Gate:` and names this file, so a rule written with no gate fails here */
  const bare=rules.filter(id=>{
   const at=md.indexOf('### '+id+'.'), nx=md.indexOf('\n### ',at+5), body=md.slice(at,nx<0?undefined:nx);
   return !/^Gate: .*tests\/flowtools\.js/m.test(body);});
  const gated=new Set([...src.matchAll(/'(FT\d+): /g)].map(m=>m[1]));
  const lost=rules.filter(id=>!gated.has(id)), orphan=[...gated].filter(id=>rules.indexOf(id)<0);
  ok(rules.length>0&&bare.length===0,'FT15: every rule in DESIGN-flow-tools.md names its gate, '+bare.join(', '));
  ok(lost.length===0&&orphan.length===0,
   'FT15: every rule has a check in this file and every check names a rule, rules with no check: '+lost.join(', ')+', checks with no rule: '+orphan.join(', '));
  ok(/DESIGN-flow-tools\.md/.test(tdd)&&/tests\/flowtools\.js/.test(tdd),
   'FT15: the practice TDD links the Flow rules and names the gate file');
 }
}
module.exports={flowGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const {FULL_SIGHT}=require('./seed.js');
 (async()=>{
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  let PASS=0,FAIL=0;
  const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
  const LCOL=`try{if(localStorage.getItem('lcol')===null)localStorage.setItem('lcol','open');}catch(e){}`;
  browser.newPage=(orig=>async function(...a){
   const pg=await orig.apply(this,a); await pg.addInitScript(LCOL); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
   try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
    await p.waitForTimeout(120);}catch(e){}};
  await flowGate(browser,FILE,ok,booted);
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);
 })();
}
