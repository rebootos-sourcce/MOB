/* ============================================================
   FLOW, THE THREE COLUMN PAGE, GATED. node tests/flowtools.js, and called from
   tests/functional.js so a full run holds it through the same code.

   The owner, round QF, 2 October, his words: "And if you'll notice, we're
   re-merging the knowledge base and the accountability tracker. Left menu will
   be for inputting new. Right side of the menu is for the accountability
   tracker. Center piece is for the ritual."

   That reverses round PO, which split Accountability out into a tool set with
   a door of its own and took the left column off Flow. This file moved with
   it: the checks are the same questions asked of the new shape, and the groups
   that asked whether Accountability had its own button and its own host are
   gone, because the answer is now meant to be no.

   The rules are DESIGN-flow-tools.md, FT1 to FT15, linked from the practice
   TDD. Every check below opens its message with the rule it holds, so the rule
   and its gate can be found from either end, and the last group fails the run
   if the two lists disagree: a rule with no check, or a check for a rule
   nobody wrote down, is the defect this file exists to stop.

   NOTHING IS TYPED THAT THE PAGE CAN SAY. The Flow tab is read off TABDEF by
   its .k, the fold of Accountability off TABFOLD, the practices off PRACTICE,
   the miss threshold off the engine's own PR_MISS_AT, and the expected count
   of missed days is worked out in this file from the days and the entries and
   not by asking the page's own function, because a gate that asks the code for
   the answer it is checking passes on any bug.

   Run it against the build from before this round and the column groups fail,
   which is how it was shown to bite.
   ============================================================ */
const fs=require('fs');
const path=require('path');

/* the three columns, by the id of the thing each one is meant to hold, so a
   check names the job and not a position: a column is identified by what is
   in it, the same rule that says a tab is looked up by .k and never by where
   it sits. */
const COLS=[['input','lcol','flownew'],['ritual','stage','rit'],['tracker','rcol','flowrail']];

async function flowGate(browser,FILE,ok,booted){
 /* ---- FT1, FT2, FT3, FT4, FT5, FT6, FT12, FT13, FT14: the page, both widths ---- */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600, tag='@'+W+' ';
  const pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  /* a group that throws is a failure with a name, not a crash that hides the
     groups after it. This is what lets the gate be run against a build from
     before the round and report which rules it breaks. */
  try{
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||260);

  const nav=await pg.evaluate(()=>{
   const flow=TABDEF.filter(t=>t.sec==='flow').map(t=>t.k);
   const btns=[...document.querySelectorAll('.tabgrp[data-sec="flow"] .tabtop')].map(b=>+b.getAttribute('data-tabk'));
   return {flow, btns, ritual:TAB.RITUAL, acct:TAB.ACCOUNT,
    ints:Object.values(TAB).length===new Set(Object.values(TAB)).size,
    folded:TABFOLD[TAB.ACCOUNT], real:TABREAL(TAB.ACCOUNT), sec:SECOF(TAB.ACCOUNT),
    nameR:TABOF(TAB.RITUAL).nm};});
  ok(JSON.stringify(nav.flow)===JSON.stringify([nav.ritual])&&JSON.stringify(nav.btns)===JSON.stringify(nav.flow)
    &&nav.nameR==='Ritual',
   'FT1: '+tag+'Flow is one page, Ritual, with one door, in the engine and the markup alike, '+JSON.stringify(nav));
  ok(nav.acct===14&&nav.ints&&nav.folded===nav.ritual&&nav.real===nav.ritual&&nav.sec==='flow',
   'FT1: '+tag+'Accountability keeps integer 14 and is folded onto Ritual, never renumbered and never lost, '+JSON.stringify(nav));

  /* A PERSON WITH SOMETHING ALREADY RUNNING, and the builder shut, because
     that is the state the stack order is written for. With nothing active the
     page opens its own builder, which is right and which puts the input column
     first on a phone by design (FT4 checks that state by its own flag), so
     measuring the order there would be measuring the exception. */
  await pg.evaluate(()=>{
   loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.RITUAL);
   ritStartPlan({steps:[PRACTICE.filter(p=>!p.tc)[0].k],band:'',track:'',days:7,when:'',where:''},'Started.');
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; ritRender();});
  await wait(600);
  const o=await pg.evaluate(cols=>{
   const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect();
    return getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0;};
   const box=e=>{const r=e.getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),
    t:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height)};};
   const got={};
   cols.forEach(([job,colId,holdId])=>{
    const col=colId==='stage'?document.querySelector('.stage'):document.getElementById(colId);
    const hold=document.getElementById(holdId);
    got[job]={col:vis(col)&&box(col), hold:vis(hold)&&box(hold)};});
   const lp=document.getElementById('lpanel'), rp=document.getElementById('rpanel');
   const kids=p=>[...p.children].filter(c=>vis(c)&&!c.classList.contains('rfold')&&!c.classList.contains('lfold'))
    .map(c=>c.id||c.className);
   return {got, lkids:kids(lp), rkids:kids(rp),
    lsec:[...document.querySelectorAll('.lsec')].filter(vis).map(e=>e.getAttribute('data-sec')),
    rel:vis(document.getElementById('bRel')), vw:innerWidth,
    sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth,
    lhd:(document.getElementById('flownewhd')||{}).textContent||'',
    rhd:(document.getElementById('flowhd')||{}).textContent||'',
    chd:(document.querySelector('#rit .rv-pagehd')||{}).textContent||''};},COLS);
  ok(COLS.every(([job])=>o.got[job].col&&o.got[job].hold),
   'FT2: '+tag+'all three columns are drawn and each holds the thing it is for, '+JSON.stringify(o.got));
  /* side by side above the breakpoint, stacked below it, and never on top of
     each other: measured off the boxes and not read out of the stylesheet */
  const g=o.got;
  const across=g.input.col.r<=g.ritual.col.l+1&&g.ritual.col.r<=g.tracker.col.l+1;
  const down=[g.ritual.col,g.tracker.col,g.input.col].every((b,i,a)=>i===0||a[i-1].t+a[i-1].h<=b.t+1);
  ok(W>1180?across:down,
   'FT2: '+tag+(W>1180?'the three columns sit side by side, input, ritual, tracker'
    :'stacked, the order is the ritual, then the tracker, then inputting new')+', '+JSON.stringify(g));
  ok(o.lkids.length===1&&o.lkids[0]==='flownew'&&o.rkids.length===1&&o.rkids[0]==='flowrail'
    &&o.lsec.length===0&&!o.rel,
   'FT3: '+tag+'each rail holds one panel on Flow and no rail section at all, '+JSON.stringify({l:o.lkids,r:o.rkids,lsec:o.lsec}));
  ok(/New/.test(o.lhd)&&o.lhd.length>25&&/Accountability/.test(o.rhd)&&o.rhd.length>25&&/Ritual/.test(o.chd)&&o.chd.length>25,
   'FT14: '+tag+'each column names its job and says in a sentence what it is, '+JSON.stringify([o.lhd,o.rhd,o.chd]));
  ok(COLS.every(([job])=>g[job].col.l>=0&&g[job].col.r<=o.vw+1)&&o.sw<=o.cw,
   'FT12: '+tag+'every column sits inside the screen and the page does not scroll sideways, '+JSON.stringify({vw:o.vw,sw:o.sw,cw:o.cw}));

  /* FT17, the six in his slots, measured off the boxes */
  const six=await pg.evaluate(()=>{
   const b=sel=>{const e=document.querySelector('#rit .rv-six>'+sel); if(!e)return null; const r=e.getBoundingClientRect();
    return {l:Math.round(r.left),r:Math.round(r.right),t:Math.round(r.top),b:Math.round(r.bottom),
     h:(e.querySelector('.rv-h')||{}).textContent};};
   const w=document.querySelector('#rit .rv-six'), wr=w?w.getBoundingClientRect():null;
   return {av:b('.rv-c-av'),goal:b('.rv-c-goal'),act:b('.rv-act'),ok:b('.rv-c-ok'),keep:b('.rv-c-keep'),ana:b('.rv-c-ana'),
    w:wr&&{l:Math.round(wr.left),r:Math.round(wr.right)}, n:w?w.children.length:0};});
  const S6=six, names=S6.av&&[S6.av.h,S6.goal.h,S6.act.h,S6.ok.h,S6.keep.h,S6.ana.h];
  ok(S6.n===6&&JSON.stringify(names)===JSON.stringify(['Ritual to avatar','Ongoing goal','Active today','Did it work','Keep or delete','Practice analytics']),
   'FT17: '+tag+'the centre is six cards, named for his slots, '+JSON.stringify([S6.n,names]));
  const across6=S6.av&&S6.av.r<=S6.goal.l+1&&Math.abs(S6.av.t-S6.goal.t)<=2&&S6.act.t>=Math.max(S6.av.b,S6.goal.b)
   &&S6.act.l-S6.w.l<=2&&S6.w.r-S6.act.r<=2&&S6.ok.t>=S6.act.b&&S6.ok.r<=S6.keep.l+1&&Math.abs(S6.ok.t-S6.keep.t)<=2
   &&S6.ana.t>=Math.max(S6.ok.b,S6.keep.b)&&S6.ana.r-S6.ana.l>=S6.w.r-S6.w.l-2;
  const down6=S6.av&&[S6.av,S6.goal,S6.act,S6.ok,S6.keep,S6.ana].every((x,i,a)=>i===0||a[i-1].b<=x.t+1);
  ok(W>1180?across6:down6,
   'FT17: '+tag+(W>1180?'Ritual to avatar top left, Ongoing goal top right, Active today the middle across both, then Did it work beside Keep or delete, analytics last'
    :'stacked in his order, top left, top right, middle, then the rest')+', '+JSON.stringify(S6));

  /* off Flow the columns are the product's own again */
  await pg.evaluate(()=>setTab(TAB.FIELD)); await wait(400);
  const off=await pg.evaluate(()=>{
   const d=id=>{const e=document.getElementById(id); return e?getComputedStyle(e).display:'missing';};
   const h=id=>{const e=document.getElementById(id); return e?e.innerHTML.length:-1;};
   return {lrail:d('flownew'), rrail:d('flowrail'), rit:d('rit'),
    reading:getComputedStyle(document.querySelector('.lsec[data-sec="you"]')).display,
    left:h('flowleft'), side:h('flowside')};});
  ok(off.lrail==='none'&&off.rrail==='none'&&off.rit==='none'&&off.reading!=='none'&&off.left===0&&off.side===0,
   'FT3: '+tag+'off Flow both menus are shut and empty and the rails have their sections back, '+JSON.stringify(off));

  /* ---- FT4 and FT5: inputting new is the left column, and only there ---- */
  /* nothing active, so the page opens its own builder and there is a builder
     to look for. The group above left one running on purpose and took it back
     here, because the two rules want opposite states. */
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.RITUAL); ritRender();}); await wait(500);
  const nr=await pg.evaluate(()=>{
   const lc=document.getElementById('lcol'), rc=document.getElementById('rcol'), rit=document.getElementById('rit');
   const ctl='[data-act="tag"],[data-act="newtag"],[data-act="save"],[data-act="span"],[data-act="often"],.rv-build,#ritwhen,#ritwhere';
   const n=(root)=>[...root.querySelectorAll(ctl)].length;
   const w=document.getElementById('ritwhen');
   return {inLeft:n(lc), inRight:n(rc), inStage:n(rit), when:!!(w&&lc.contains(w)),
    acc:rit.querySelectorAll('.rv-rec,.rv-today,.rv-marks,.rv-cal,.rv-key,.rv-hero,.rv-figs').length,
    stage:[...rit.querySelectorAll('.rv-h')].map(x=>x.textContent)};});
  ok(nr.inLeft>0&&nr.inRight===0&&nr.inStage===0&&nr.when,
   'FT4: '+tag+'the builder, its tags, timer, days and when and where fields are in the left column and nowhere else, '+JSON.stringify(nr));
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
   const lc=document.getElementById('lcol');
   const shut=!!lc.querySelector('.rv-shut .rv-add')&&!lc.querySelector('#ritwhen');
   const stageAdd=document.querySelectorAll('#rit [data-act="add"]').length;
   const add=lc.querySelector('.rv-add'); if(add)add.click(); await new Promise(r=>setTimeout(r,200));
   const wk=lc.querySelector('.rv-wk'), rl=document.getElementById('flownew'), rr=rl?rl.getBoundingClientRect():{left:0,right:0};
   const wr=wk?wk.getBoundingClientRect():null;
   return {shut, stageAdd, open:!!lc.querySelector('#ritwhen'), tags:lc.querySelectorAll('.rv-tag2').length, bands:BANDS.length,
    weekFits:!!wr&&wr.right<=rr.right+0.5&&wr.left>=rr.left-0.5,
    build:document.body.classList.contains('ritbuild'),
    listed:document.querySelectorAll('#rit .rv-item').length};});
  ok(closed.shut&&closed.stageAdd===0&&closed.open&&closed.tags===closed.bands&&closed.build,
   'FT4: '+tag+'with a ritual active, New ritual is one press in the left column and opens the builder in the same place, '+JSON.stringify(closed));
  ok(closed.weekFits,'FT12: '+tag+'the builder\'s seven day row fits inside the left column, '+JSON.stringify(closed));
  ok(closed.listed===1,'FT4: '+tag+'the Active list stays on the stage, '+closed.listed);
  await pg.evaluate(()=>{ritWrite(function(){CURP.rituals=[];return [];},null);});

  /* ---- FT6: the tracker is the right column, and it renders ---- */
  await pg.evaluate(()=>{loadP(0); setTab(TAB.ACCOUNT);}); await wait(500);
  const open=await pg.evaluate(()=>{
   const s=document.getElementById('flowside'), r=s?s.getBoundingClientRect():{width:0,height:0};
   return {landed:S.tab===TAB.RITUAL, cls:document.body.classList.contains('tab-ritual'),
    noDoor:!document.querySelector('.tabgrp[data-sec="flow"] .tabtop[data-tabk="14"]'),
    noHost:!document.getElementById('acct'),
    shown:!!s&&getComputedStyle(s).display!=='none'&&r.width>0&&r.height>0,
    text:s?s.innerText.length:0,
    rit:getComputedStyle(document.getElementById('rit')).display,
    heads:[...document.querySelectorAll('#flowside .rv-h')].map(x=>x.textContent)};});
  ok(open.landed&&open.cls&&open.noDoor&&open.noHost&&open.shown&&open.text>60&&open.rit!=='none',
   'FT6: '+tag+'the folded integer lands on the Ritual page, with no door and no host of its own, '+JSON.stringify(open));
  const order=['Due today','Thirty days','Done','Missed','History','Record'];
  ok(order.every(h=>open.heads.indexOf(h)>=0)&&order.every((h,i)=>i===0||open.heads.indexOf(order[i-1])<open.heads.indexOf(h)),
   'FT6: '+tag+'the right column holds Due today, Thirty days, Done, Missed, History and the Record, in that order, '+JSON.stringify(open.heads));
  }catch(e){ok(false,'FT6: '+tag+'the columns group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
  ok(err.length===0,tag+'no page errors across the Flow page, '+err.join(' | '));
 }

 /* ---- FT8, FT7, FT9, FT13, FT14: empty states, the reads, the writes ---- */
 {
  const pg=await browser.newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||260);
  try{

  /* FT8, a person with nothing active and nothing on the record */
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.RITUAL);}); await wait(500);
  const e0=await pg.evaluate(()=>({
   due:(document.querySelector('#flowside .rv-act .rv-empty')||{}).textContent||'',
   miss:(document.querySelector('#flowside .rv-miss .rv-empty')||{}).textContent||'',
   add:!!document.querySelector('#flowside [data-act="add"]'),
   away:!!document.querySelector('#flowside [data-act="go-ritual"]'),
   streak:(document.querySelector('#flowside .rv-mid b')||{}).textContent,
   made:document.querySelectorAll('#flowside [data-act="save"],#flowside #ritwhen').length}));
  ok(/Nothing active yet/.test(e0.due)&&/Nothing to miss yet/.test(e0.miss)&&e0.add&&!e0.away&&e0.streak==='–'&&e0.made===0,
   'FT8: with nothing active the tracker says so, offers the one press and not a second builder, and a zero streak is the house dash (round J13, COPY.md), not a bare 0, '+JSON.stringify(e0));
  await pg.evaluate(()=>document.querySelector('#flowside [data-act="add"]').click()); await wait(400);
  ok(await pg.evaluate(()=>S.tab===TAB.RITUAL&&!!document.querySelector('#lcol #ritwhen')),
   'FT8: the press opens the builder in the left column and goes nowhere, because there is nowhere to go');

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
   setTab(TAB.RITUAL);
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
   const figs=[...document.querySelectorAll('#flowside .rv-fig')].map(f=>f.textContent.replace(/\s+/g,' ').trim());
   return {rows, due, figs, streak:+(document.querySelector('#flowside .rv-mid b')||{}).textContent,
    ladder:ladderRead(CURP,Date.now()).streak.run,
    both:document.getElementById('flowrail').innerText+' '+document.getElementById('rit').innerText};});
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
  ok(!/%|\bscore\b|\bpercent\b/i.test(rd.both),'FT7: no percent and no score anywhere on the Flow page');

  /* FT14, the unpack rule: each heading carries its meaning in the same place */
  const mean=await pg.evaluate(()=>{
   const out={};
   document.querySelectorAll('#flowside .rv-sec,#rit .rv-sec').forEach(s=>{
    const h=(s.querySelector('.rv-h')||{}).textContent, m=s.querySelector('.rv-mean');
    out[h]=m?m.textContent.length:0;});
   return out;});
  ok(['Done','Record','Due today','Missed','Active today'].every(h=>mean[h]>30),
   'FT14: Done, Record, Due today, Missed and Active today each carry a sentence saying what they mean, '+JSON.stringify(mean));

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
   loadP(PEOPLE.findIndex(p=>!p.you)); setTab(TAB.RITUAL); await new Promise(r=>setTimeout(r,300));
   const had=document.querySelectorAll('#flowside .rv-log').length;
   const note=(document.querySelector('#rit .rv-note')||{}).textContent||'';
   /* said once on the page and not once per column: the centre carries it */
   const twice=document.querySelectorAll('.rv-note').length;
   return {note, had, twice};});
  ok(/worked example, so nothing here is saved/.test(ex.note)&&ex.twice===1,
   'FT9: a worked example says once on the page that nothing is saved, '+JSON.stringify(ex));
  const ex2=await pg.evaluate(async()=>{
   const ok0=ritWrite(function(){return [];},'Done.');
   return {ok0, said:(document.getElementById('status')||{}).textContent||''};});
  ok(ex2.ok0===false&&/worked example/.test(ex2.said),'FT9: a write on a worked example is refused by name, '+JSON.stringify(ex2));

  /* FT9 again, the edit route: Edit on a missed ritual opens it in the left
     column without leaving the page, which is the whole point of the merge */
  await pg.evaluate(()=>{loadP(0); setTab(TAB.RITUAL);}); await wait(400);
  const ed=await pg.evaluate(async()=>{
   const b=document.querySelector('#flowside [data-act="miss-edit"]'); if(!b)return {none:true};
   const id=b.getAttribute('data-id'); b.click(); await new Promise(r=>setTimeout(r,300));
   return {tab:S.tab===TAB.RITUAL, edit:RIT.edit===id, builder:!!document.querySelector('#lcol .rv-build'),
    build:document.body.classList.contains('ritbuild'),
    head:(document.querySelector('#lcol .rv-build .rv-h')||{}).textContent};});
  ok(!ed.none&&ed.tab&&ed.edit&&ed.builder&&ed.build&&ed.head==='Edit',
   'FT9: Edit on a missed ritual opens that ritual in the left column and never leaves the page, '+JSON.stringify(ed));

  /* FT13: both folds are the person's own, and they still work on Flow */
  const fold=await pg.evaluate(async()=>{
   const out={};
   for(const [which,btn,cls,rail] of [['right','rfold','rshut','flowrail'],['left','lfold','lshut','flownew']]){
    const b=document.getElementById(btn);
    out[which+'Open0']=!document.body.classList.contains(cls);
    b.click(); await new Promise(r=>setTimeout(r,150));
    out[which+'Shut']=document.body.classList.contains(cls)&&getComputedStyle(document.getElementById(rail)).display==='none';
    out[which+'Btn']=document.getElementById(btn).getBoundingClientRect().width>0;
    b.click(); await new Promise(r=>setTimeout(r,150));
    out[which+'Back']=!document.body.classList.contains(cls)&&getComputedStyle(document.getElementById(rail)).display!=='none';}
   return out;});
  ok(['right','left'].every(w=>fold[w+'Open0']&&fold[w+'Shut']&&fold[w+'Btn']&&fold[w+'Back']),
   'FT13: both columns open on Flow, both shut to their one control, and both come back, '+JSON.stringify(fold));

  }catch(e){ok(false,'FT7: the reads and writes group threw, '+String(e.message).split('\n')[0]);}

  /* ---- FT11: a caller off the page goes to the page ---- */
  try{
  const off=await pg.evaluate(async()=>{
   loadP(0); setTab(TAB.FIELD); await new Promise(r=>setTimeout(r,250));
   ritOpen([{name:'Blame'}]); await new Promise(r=>setTimeout(r,300));
   const a={tab:S.tab===TAB.RITUAL, from:!!document.querySelector('#lcol .rit-from'), builder:!!document.querySelector('#lcol #ritwhen')};
   setTab(TAB.COMPASS); await new Promise(r=>setTimeout(r,300));
   const rit=getComputedStyle(document.getElementById('rit')).display;
   const side=document.getElementById('flowside').innerHTML.length;
   ritRender();
   const rit2=getComputedStyle(document.getElementById('rit')).display;
   return {a, rit, rit2, side};});
  ok(off.a.tab&&off.a.from&&off.a.builder,
   'FT11: ritOpen from another tab lands on Flow with the release\'s log in the builder in the left column, '+JSON.stringify(off.a));
  ok(off.rit==='none'&&off.rit2==='none'&&off.side===0,
   'FT11: a ritual write while on the Compass paints nothing over it, in any of the three columns, '+JSON.stringify([off.rit,off.rit2,off.side]));

  }catch(e){ok(false,'FT11: the off tab group threw, '+String(e.message).split('\n')[0]);}

  /* ---- FT10: the Compass route still lands, and shows in both columns ---- */
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
   setTab(TAB.RITUAL); await wait(400);
   const due=[...document.querySelectorAll('#flowside .rv-act .rv-nm')].map(x=>x.textContent);
   const act=[...document.querySelectorAll('#rit .rv-item .rv-sub')].map(x=>x.textContent).filter(t=>/Toward Buddha/.test(t)).length;
   return {label, plan:!!plan, said, name:plan?ritName(plan.steps):'', due, act};});
  ok(!cmp.noRow&&cmp.label==='Add to my ritual'&&cmp.plan&&/^Added/.test(cmp.said),
   'FT10: Add to my ritual on the Compass teacher panel still writes the plan and says Added, '+JSON.stringify(cmp));
  ok(cmp.act===1&&cmp.due.indexOf(cmp.name)>=0,
   'FT10: the added ritual is on the centre\'s Active list and on the tracker\'s Due today, on one screen, '+JSON.stringify([cmp.act,cmp.due,cmp.name]));
  }catch(e){ok(false,'FT10: the Compass group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'no page errors across the Flow reads and writes, '+err.join(' | '));
  await pg.close();
 }

 /* ---- FT16 to FT23: round QN, the six cards, the loop, history, what is suggested ----
    One seeded record of the person's own, written through the product's own
    writers where one exists (stCommit for the stories), and every expected
    figure below is worked out here from the seed: the days, the entries, the
    field's own places (W) and the practice table. The page is asked only what
    it shows. */
 {
  const pg=await browser.newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||300);
  try{
  const seed=await pg.evaluate(()=>{
   loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]);
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
   const today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   ['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
    'I feel worthless and ashamed, I am never enough, I am a failure.',
    'I go quiet and pull away from my partner when I feel judged and rejected.'].forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
   /* a reading from before the first plan started, with a held count the field
      never had, so the card can only print it by reading this row */
   const h0=snapshot(CURP); h0.t=iso(today-15); h0.loaded=17; CURP.history.unshift(h0);
   CURP.avatar=avatarBlank(); CURP.avatar.built=true; CURP.avatar.at=iso(today-30);
   CURP.avatar.pairs=[{be:'I speak up calmly in the room',notbe:'I feel worthless and ashamed, I am never enough'},
    {be:'I stay close to the people I love',notbe:'I go quiet and pull away from my partner when I feel judged and rejected'},
    {be:'I feel safe in my own body',notbe:'I am terrified of being abandoned and I panic and cannot breathe'}];
   const P=(id,k,band,from,days)=>({id,steps:[k],when:'',where:'',days,from:iso(from),stop:null,band,track:'',rel:null,tc:null,tags:[band],on:null,tm:null});
   const plans=[P('qa','noting','Throat',today-12,0),P('qb','listen','3rd Eye',today-6,7),
    P('qd','slow','Heart',today-1,0),P('qc','candle','Crown',today-20,7)];
   const done={qa:[],qb:[today-6,today-4,today-2],qc:[today-20,today-19,today-17]};
   for(let d=today-12;d<today;d++)if(d!==today-5&&d!==today-8)done.qa.push(d);
   const key={qa:'noting',qb:'listen',qc:'candle'}, band={qa:'Throat',qb:'3rd Eye',qc:'Crown'};
   Object.keys(done).forEach(id=>done[id].forEach(d=>CURP.rituals.push({t:iso(d),steps:[key[id]],min:5,when:'',where:'',band:band[id],done:iso(d)})));
   CURP.rituals.sort((a,b)=>Date.parse(a.t)-Date.parse(b.t));
   const wrote=ritPlanPut(plans)&&pSave();
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();
   /* THE EXPECTATIONS, from the seed and the tables, not from the page */
   const all=[].concat(done.qa,done.qb,done.qc);
   const keptDays=new Set(all).size;
   /* a seat a sentence lands on, tallied off parseStory's imprints here and not
      through readSeat, which is the function under test */
   const seatOfText=t=>{const tl={}; parseStory(t).imprints.forEach(x=>{if(x&&x.band)tl[x.band]=(tl[x.band]||0)+(x.amt||1);});
    let b=null,v=0; Object.keys(tl).forEach(k=>{if(tl[k]>v){v=tl[k];b=k;}}); return b;};
   const r=compute(), tier=r.DQ>=70?1:(r.DQ>=40?2:3);
   const light=seat=>{const tr=TRACK4BAND[seat]; const fit=PRACTICE.filter(p=>p.tier<=tier&&!p.tc);
    const f=fit.filter(p=>p.track===tr); const set=f.length?f:fit;
    return set.slice().sort((a,b)=>(a.min-b.min)||(a.tier-b.tier))[0].nm;};
   const avSeats=CURP.avatar.pairs.map(p=>seatOfText(p.notbe)).filter(b=>b&&W.some(n=>n.b===b&&n.sq>0));
   const held=W.filter(n=>n.cf&&n.sq>=4);
   return {wrote, today, keptDays, mins:all.length*5, avSeats:[...new Set(avSeats)],
    want:Object.fromEntries([...new Set(avSeats)].map(b=>[b,light(b)])),
    heldBy:Object.fromEntries(BANDS.map(b=>[b,held.filter(n=>n.b===b).map(n=>String(n.k).toLowerCase())])),
    top8:W.filter(n=>n.cf&&n.sq>0).sort((a,b)=>b.sq-a.sq).slice(0,8).filter(n=>n.sq>=4).map(n=>n.b),
    qaKept:done.qa.length, qaMissed:2, qaLoop:done.qa.filter(d=>d>today-30).length,
    loopRituals:4, now:r.loaded.length};});
  await wait(700);
  ok(seed.wrote,'FT16: the QN seed was written through the store and the record');

  /* read before anything below starts a ritual: a practice that is active is
     not suggested, which FT16 checks on its own further down */
  const sug=await pg.evaluate(()=>[...document.querySelectorAll('#lcol .rv-sg1')].map(x=>({nm:x.querySelector('.rv-sgn').textContent,
   tags:[...x.querySelectorAll('.rv-tg')].map(t=>t.textContent), why:[...x.querySelectorAll('.rv-sgw li')].map(l=>l.textContent)})));
  /* ---- FT18 ---- */
  const av=await pg.evaluate(()=>{const c=document.querySelector('#rit .rv-c-av'); if(!c)return {none:true};
   return {fig:(c.querySelector('.rv-avfig b')||{}).textContent||'', rings:c.querySelectorAll('.rv-cy').length,
    tick:c.querySelectorAll('.rv-cy-ok').length,
    seats:[...c.querySelectorAll('.rv-avs')].map(x=>({n:x.querySelector('.rv-avn').textContent,f:x.querySelector('.rv-avf').textContent}))};});
  ok(!av.none&&new RegExp('^'+seed.keptDays+' days?$').test(av.fig.trim())&&av.rings===3&&av.tick===(seed.keptDays>=21?1:0),
   'FT18: Ritual to avatar prints the '+seed.keptDays+' distinct days kept, draws three cycles and ticks only a full one, '+JSON.stringify(av));
  const heart=(av.seats||[]).filter(x=>/at the heart/.test(x.n))[0], solar=(av.seats||[]).filter(x=>/solar plexus/.test(x.n))[0];
  ok(heart&&/^Fed by Controlled Breath/.test(heart.f)&&solar&&/No ritual at this seat yet/.test(solar.f),
   'FT18: each avatar seat says the active ritual kept there, or that none is, '+JSON.stringify(av.seats));

  /* ---- FT19 ---- */
  const goal=await pg.evaluate(()=>{const c=document.querySelector('#rit .rv-c-goal');
   return {be:(c.querySelector('.rv-why-be')||{}).textContent||'', held:(c.querySelector('.rv-why-p b')||{}).textContent||'',
    seat:(c.querySelector('.rv-why-p')||{}).textContent||'', btns:c.querySelectorAll('[data-act="why"]').length,
    next:(c.querySelector('.rv-nxt b')||{}).textContent||'', railNext:!!document.querySelector('#flowside .rv-next'),
    ladder:(ladderRead(CURP,Date.now()).next||{}).nm};});
  ok(/^"I feel safe in my own body"$/.test(goal.be)&&(seed.heldBy.Root||[]).indexOf(goal.held)>=0&&/the root/.test(goal.seat)&&goal.btns===2,
   'FT19: the goal quotes the avatar line whose seat holds a place, names a place held there and offers the schedule once, '+JSON.stringify(goal));
  ok(goal.next&&goal.next===goal.ladder&&!goal.railNext,'FT19: the next mark is on the goal card and not in the right column, '+JSON.stringify(goal));
  const sch=await pg.evaluate(async()=>{document.querySelector('#rit .rv-c-goal [data-act="why"][data-d="7"]').click();
   await new Promise(r=>setTimeout(r,300)); const c=document.querySelector('#rit .rv-c-goal');
   return {said:(document.getElementById('status')||{}).textContent||'', active:/is active/.test(c.textContent),
    btns:c.querySelectorAll('[data-act="why"]').length, rel:ritPlans().some(p=>p.rel!=null&&p.band==='Root')};});
  ok(/^Set\./.test(sch.said)&&sch.active&&sch.btns===0&&sch.rel,'FT19: once scheduled it says so and offers nothing, '+JSON.stringify(sch));

  /* ---- FT16 ---- */
  const nameTag=(b)=>{const t=b==='3rd Eye'?'Third eye':b; return sug.some(x=>x.nm===seed.want[b]&&x.tags.indexOf(t)>=0);};
  ok(sug.length>0&&seed.avSeats.length>0&&seed.avSeats.every(nameTag),
   'FT16: every seat an avatar story lands on is suggested, as the lightest practice its track allows at this load, '+JSON.stringify({want:seed.want,sug}));
  const holds=[].concat(...sug.map(x=>x.why)).map(w=>/^You hold (.+) at the (.+?)\. /.exec(w)).filter(Boolean);
  const hs=holds.map(m=>({k:m[1],b:Object.keys(seed.heldBy).filter(b=>ritThe0(b)===m[2])[0]}));
  function ritThe0(b){return b==='3rd Eye'?'third eye':b==='Solar'?'solar plexus':b.toLowerCase();}
  const okHold=hs.every(h=>h.b&&h.b!=='Root'&&seed.heldBy[h.b].indexOf(h.k)>=0)&&new Set(hs.map(h=>h.b)).size===hs.length
   &&(hs.length>0)===seed.top8.some(b=>b!=='Root');
  ok(okHold,'FT16: each bank suggestion is a real place held at four or more, one per seat, never at the goal\'s seat, '+JSON.stringify({hs,top8:seed.top8}));
  ok(sug.every(x=>x.why.length>=1&&x.why.every(w=>w.length>20)),'FT16: every suggestion says why, one line a reason, '+JSON.stringify(sug.map(x=>x.why)));
  const fake=await pg.evaluate(()=>({ach:/achievement/i.test(document.getElementById('lcol').innerText+document.getElementById('rit').innerText+document.getElementById('rcol').innerText),
   chainStart:document.querySelectorAll('[data-act="start-called"],#rit .rv-chain .btn').length}));
  ok(!fake.ach&&fake.chainStart===0,'FT16: no achievement is promised on the page and the chain carries no Start, '+JSON.stringify(fake));
  const st1=await pg.evaluate(async()=>{const b=document.querySelector('#lcol [data-act="sug"]'), card=b.closest('.rv-sg1');
   const nm=card.querySelector('.rv-sgn').textContent, tags=[...card.querySelectorAll('.rv-tg')].map(t=>t.textContent);
   const n0=document.querySelectorAll('#lcol .rv-sg1').length;
   b.click(); await new Promise(r=>setTimeout(r,300));
   const p=ritPlans().filter(x=>ritName(x.steps)===nm&&ritActive(x,ritToday0()))[0];
   return {nm, tags, said:(document.getElementById('status')||{}).textContent||'', plan:!!p, ptags:p?p.tags.map(ritTagNm):[], days:p?p.days:null,
    still:[...document.querySelectorAll('#lcol .rv-sgn')].map(x=>x.textContent).indexOf(nm)>=0, n0,
    n1:document.querySelectorAll('#lcol .rv-sg1').length};});
  ok(st1.plan&&/^(Started|Set)\./.test(st1.said)&&JSON.stringify(st1.ptags)===JSON.stringify(st1.tags)&&st1.days===7&&!st1.still,
   'FT16: Start for a week writes the plan with its seats as tags, says so, and the card leaves the list, '+JSON.stringify(st1));

  /* ---- FT20 ---- */
  const okc=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-c-ok .rv-ok1')].map(x=>({nm:x.querySelector('.rv-okn').textContent,
   k:x.querySelector('.rv-okk').textContent, f:x.querySelector('.rv-okf').textContent})));
  const qa=okc.filter(x=>x.nm==='Noting Meditation')[0], qc=okc.filter(x=>x.nm==='Candle Visualisation')[0];
  ok(qa&&qa.k==='Kept '+seed.qaKept+' days, missed '+seed.qaMissed+'.'&&qa.f==='Held places: 17 when it started, '+seed.now+' now.',
   'FT20: Did it work reads kept and missed off the record and the held places off the last reading before the start, '+JSON.stringify(qa));
  ok(qc&&/No reading from before it started/.test(qc.f)&&!okc.some(x=>x.nm==='Controlled Breath'),
   'FT20: with no reading before the start it says so, and a ritual on its second day is not read yet, '+JSON.stringify(okc));
  const kp=await pg.evaluate(async()=>{const rows=()=>[...document.querySelectorAll('#rit .rv-c-keep .rv-kp1')].map(x=>x.querySelector('.rv-okn').textContent);
   const r0=rows(); const b=document.querySelector('#rit .rv-c-keep [data-act="keep"][data-id="qb"]');
   const left0=ritLeft(ritPlans().filter(p=>p.id==='qb')[0],ritToday0());
   if(b)b.click(); await new Promise(r=>setTimeout(r,300));
   const q=ritPlans().filter(p=>p.id==='qb')[0];
   return {r0, said:(document.getElementById('status')||{}).textContent||'', left0, left1:q?ritLeft(q,ritToday0()):'', r1:rows()};});
  ok(JSON.stringify(kp.r0)===JSON.stringify(['Active Listening'])&&/^Kept\./.test(kp.said)&&kp.left0==='Last day'&&kp.left1==='7 days left'&&kp.r1.length===0,
   'FT20: only a ritual in its last three days is offered, and Keep runs it a week more and says so, '+JSON.stringify(kp));
  const dl=await pg.evaluate(async()=>{
   ritWrite(plans=>{plans.forEach(p=>{if(p.id==='qa'){p.days=14;}}); return plans;},null);
   await new Promise(r=>setTimeout(r,200));
   document.querySelector('#rit .rv-c-keep [data-act="del-keep"][data-id="qa"]').click(); await new Promise(r=>setTimeout(r,300));
   const gone=!ritPlans().some(p=>p.id==='qa'), here=!!document.querySelector('#rit .rv-c-keep [data-act="putback"]'),
    there=!!document.querySelector('#flowside .rv-rec [data-act="putback"]');
   document.querySelector('#rit .rv-c-keep [data-act="putback"]').click(); await new Promise(r=>setTimeout(r,300));
   return {gone, here, there, back:ritPlans().some(p=>p.id==='qa')};});
  ok(dl.gone&&dl.here&&!dl.there&&dl.back,'FT20: Delete takes it off, Put back is offered in the same card and not one column over, and puts it back, '+JSON.stringify(dl));
  await pg.evaluate(()=>{ritWrite(plans=>{plans.forEach(p=>{if(p.id==='qa')p.days=0;}); return plans;},null);});

  /* ---- FT21 ---- */
  const lp=await pg.evaluate(()=>{const s=document.querySelector('#flowside .rv-loopw'); const ds=[...s.querySelectorAll('path.rv-ld')];
   return {n:ds.length, ring0done:ds.slice(0,30).filter(p=>p.classList.contains('rv-ld-done')).length,
    nowTop:ds.slice(0,30).map(p=>p.classList.contains('rv-ld-now')).lastIndexOf(true),
    mid:(s.querySelector('.rv-lmid b')||{}).textContent, key:[...s.querySelectorAll('.rv-lkey li')].map(l=>l.textContent),
    sum:(s.querySelector('.rv-lsum')||{}).textContent||''};});
  ok(lp.n===30*Math.min(4,seed.loopRituals+1)&&lp.ring0done===seed.qaLoop&&lp.nowTop===29&&/^Noting Meditation/.test(lp.key[0]||''),
   'FT21: one track of thirty per ritual, outermost the first active, its done pieces the '+seed.qaLoop+' days kept, today last, '+JSON.stringify(lp));
  ok(+lp.mid===seed.keptDays&&lp.sum.indexOf(seed.keptDays+' days')>=0&&lp.sum.indexOf(seed.mins+' minutes')>=0&&!/%|rate/.test(lp.sum),
   'FT21: the middle and the summary are counts of days and minutes worked out from the seed, '+JSON.stringify([lp.mid,lp.sum,seed.keptDays,seed.mins]));

  /* ---- FT22 ---- */
  const hi=await pg.evaluate(async()=>{const cards=()=>[...document.querySelectorAll('#flowside .rv-hc')].map(c=>({nm:c.querySelector('.rv-hcn').textContent,
    act:!!c.querySelector('.rv-tag'), rot:!!c.querySelector('[data-act="rot"]')}));
   const c0=cards(); const listAgain=(()=>{RIT.view='list'; ritRender(); const t=document.querySelector('#flowside .rv-rec').innerText;
    const a=document.querySelectorAll('#flowside .rv-rec [data-act="again"]').length; RIT.view='month'; ritRender(); return {ended:/\bEnded\b/.test(t), a};})();
   const b=[...document.querySelectorAll('#flowside .rv-hc')].filter(c=>c.querySelector('.rv-hcn').textContent==='Candle Visualisation')[0].querySelector('[data-act="rot"]');
   b.click(); await new Promise(r=>setTimeout(r,300));
   return {c0, listAgain, said:(document.getElementById('status')||{}).textContent||'', c1:cards(),
    active:ritPlans().some(p=>ritName(p.steps)==='Candle Visualisation'&&ritActive(p,ritToday0())&&p.days===7&&p.band==='Crown')};});
  const cv=hi.c0.filter(c=>c.nm==='Candle Visualisation')[0], cv1=hi.c1.filter(c=>c.nm==='Candle Visualisation')[0];
  ok(new Set(hi.c0.map(c=>c.nm)).size===hi.c0.length&&hi.c0.length>=4&&cv&&cv.rot&&!cv.act&&hi.c0.filter(c=>c.act).every(c=>!c.rot),
   'FT22: one card per ritual run, active ones say Active, an ended one offers Back in rotation, '+JSON.stringify(hi.c0));
  ok(/^Back in rotation\./.test(hi.said)&&hi.active&&cv1&&cv1.act&&!hi.listAgain.ended&&hi.listAgain.a===0,
   'FT22: Back in rotation starts it from today for its span and seat, says so, and the Record list no longer offers Again, '+JSON.stringify(hi));

  /* ---- FT23 ---- */
  const live=await pg.evaluate(async()=>{
   const pools=document.querySelectorAll('#rit .rv-live .rv-pool').length;
   const seats=new Set(ritHeld().map(x=>x.b)).size;
   const running=()=>document.getAnimations().filter(a=>{const t=a.effect&&a.effect.target; return t&&t.closest&&t.closest('#rit,#flowside');}).length;
   const arrived0=!!document.querySelector('#rit .rv-arrive');
   setTab(TAB.FIELD); await new Promise(r=>setTimeout(r,200)); setTab(TAB.RITUAL); await new Promise(r=>setTimeout(r,200));
   const arrived1=!!document.querySelector('#rit .rit-card.rv-arrive');
   ritRender(); const arrived2=!!document.querySelector('#rit .rit-card.rv-arrive');
   return {pools, seats, running:running(), arrived1, arrived2};});
  ok(live.pools===Math.max(1,live.seats)&&live.running>0&&live.arrived1&&!live.arrived2,
   'FT23: one pool per seat holding charge, the page moves at rest, and it draws in on arrival and not on a repaint, '+JSON.stringify(live));
  }catch(e){ok(false,'FT16: the round QN group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'no page errors across the round QN group, '+err.join(' | '));
  await pg.close();
 }
 /* FT23, stillness: the same page for a person who asked their system for less motion */
 {
  const pg=await browser.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
  try{
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  const still=await pg.evaluate(async()=>{loadP(0); setTab(TAB.RITUAL); await new Promise(r=>setTimeout(r,400));
   return document.getAnimations().filter(a=>{const t=a.effect&&a.effect.target; return t&&t.closest&&t.closest('#rit,#flowside')&&a.playState==='running';}).length;});
  ok(still===0,'FT23: under prefers-reduced-motion nothing on the page moves, '+still+' running');
  }catch(e){ok(false,'FT23: the stillness group threw, '+String(e.message).split('\n')[0]);}
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
  /* the Field's own left column starts shut on his ruling, and a gate that
     wants to read the rails opens it. Flow's column has its own key and its
     own default, so this says nothing about Flow. */
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
