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
     input column comes first on a phone by design (ritnone, round QN; FT24
     checks that state), so measuring the order there would be measuring the
     exception. */
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
  /* round RB: the two side heads lost their lines to his "Get rid of all the
     sec[ond] third tier text", so they are their names alone; the centre
     still says in a sentence what a ritual is */
  ok(o.lhd.trim()==='New'&&o.rhd.trim()==='Accountability'&&/Ritual/.test(o.chd)&&o.chd.length>25,
   'FT14: '+tag+'each side column is named by its job alone and the centre says in a sentence what it is, '+JSON.stringify([o.lhd,o.rhd,o.chd]));
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
  ok(S6.n===6&&JSON.stringify(names)===JSON.stringify(['Ritual to avatar','Ongoing goal','Goals','Did it work','Keep or delete','Success over time']),
   'FT17: '+tag+'the centre is six cards, named for his slots, '+JSON.stringify([S6.n,names]));
  const across6=S6.av&&S6.av.r<=S6.goal.l+1&&Math.abs(S6.av.t-S6.goal.t)<=2&&S6.act.t>=Math.max(S6.av.b,S6.goal.b)
   &&S6.act.l-S6.w.l<=2&&S6.w.r-S6.act.r<=2&&S6.ok.t>=S6.act.b&&S6.ok.r<=S6.keep.l+1&&Math.abs(S6.ok.t-S6.keep.t)<=2
   &&S6.ana.t>=Math.max(S6.ok.b,S6.keep.b)&&S6.ana.r-S6.ana.l>=S6.w.r-S6.w.l-2;
  const down6=S6.av&&[S6.av,S6.goal,S6.act,S6.ok,S6.keep,S6.ana].every((x,i,a)=>i===0||a[i-1].b<=x.t+1);
  ok(W>1180?across6:down6,
   'FT17: '+tag+(W>1180?'Ritual to avatar top left, Ongoing goal top right, Goals the middle across both, then Did it work beside Keep or delete, Success over time last'
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
  /* nothing active, and the builder is opened the way a person opens it, with
     New ritual. It used to open itself here; round QN stopped that (FT24), and
     this check had leaned on it to have a builder to look for. The group above
     left one running on purpose and took it back here, because the two rules
     want opposite states. */
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null;
   setTab(TAB.RITUAL); ritRender(); const a=document.querySelector('#lcol [data-act="add"]'); if(a)a.click();}); await wait(500);
  const nr=await pg.evaluate(()=>{
   const lc=document.getElementById('lcol'), rc=document.getElementById('rcol'), rit=document.getElementById('rit');
   const ctl='[data-act="tag"],[data-act="newtag"],[data-act="save"],[data-act="span"],[data-act="often"],.rv-build,#ritwhen,#ritwhere';
   const n=(root)=>[...root.querySelectorAll(ctl)].length;
   const w=document.getElementById('ritwhen');
   return {inLeft:n(lc), inRight:n(rc), inStage:n(rit), when:!!(w&&lc.contains(w)),
    /* round QX: Success over time and the Goals views carry figures and a key
       of their own, his "success win ... over a period of a year" in the centre.
       They are reads over a span he picks, not the tracker's parts, so they are
       left out here and FT32 holds them; anything else of the tracker's still
       fails this */
    acc:[...rit.querySelectorAll('.rv-rec,.rv-today,.rv-marks,.rv-cal,.rv-key,.rv-hero,.rv-figs')].filter(e=>!e.closest('.rv-c-ana,.rv-goals')).length,
    stage:[...rit.querySelectorAll('.rv-h')].map(x=>x.textContent)};});
  ok(nr.inLeft>0&&nr.inRight===0&&nr.inStage===0&&nr.when,
   'FT4: '+tag+'the builder, its tags, timer, days and when and where fields are in the left column and nowhere else, '+JSON.stringify(nr));
  ok(nr.acc===0,'FT5: '+tag+'the Ritual stage holds no streak, rings, marks or record, '+nr.acc+' found, '+nr.stage.join(', '));

  /* with one ritual active the menu is closed, and pressing New ritual opens the builder in the same place */
  const closed=await pg.evaluate(async()=>{
   const k=PRACTICE.filter(p=>!p.tc)[0].k;
   ritStartPlan({steps:[k],band:'',track:'',days:7,when:'',where:''},'Started.');
   /* a start through the builder's own button clears its draft, so this does
      what that press does before it looks at the closed menu. (The builder
      no longer opens itself on a first visit, round QN; FT24 holds that.) */
   /* the Active list is Goals' Today; with a ritual running the centre opens
      on the week since round RB, so the list is asked for by its view */
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.gview='today'; ritRender();
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
  const order=['Due today','Thirty day loop','Done','Missed','History','Record'];
  ok(order.every(h=>open.heads.indexOf(h)>=0)&&order.every((h,i)=>i===0||open.heads.indexOf(order[i-1])<open.heads.indexOf(h)),
   'FT6: '+tag+'the right column holds Due today, the Thirty day loop, Done, Missed, History and the Record, in that order, '+JSON.stringify(open.heads));
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
  ok(e0.due===''&&/Nothing to miss yet/.test(e0.miss)&&e0.add&&!e0.away&&e0.streak==='–'&&e0.made===0,
   'FT8: with nothing active the tracker offers the one press and no line above it (round RB), offers and not a second builder, and a zero streak is the house dash (round J13, COPY.md), not a bare 0, '+JSON.stringify(e0));
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
    both:document.getElementById('flowrail').innerText+' '+document.getElementById('rit').innerText,
    /* ROUND QS: a percent lives in one place, the pill of a percent complete
       badge (FT25). Everything else is read with the pills taken out. */
    bare:[document.getElementById('flowrail'),document.getElementById('rit')].map(e=>{const c=e.cloneNode(true);
     c.querySelectorAll('.crb-v,.cr .v').forEach(v=>v.remove()); return c.innerText||c.textContent;}).join(' '),
    pills:[...document.querySelectorAll('#flowrail .crb-v,#rit .crb-v,#rit .cr .v')].map(v=>v.textContent)};});
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
  ok(!/%|\bscore\b|\bpercent\b(?! complete)|\brate\b/i.test(rd.bare)&&!/\bscore\b|\brate\b/i.test(rd.both)&&rd.pills.every(t=>/^(\d+%?|\u2013)$/.test(t)),
   'FT7: no score and no rate anywhere on the Flow page, and a percent only in a badge pill (FT25), '+JSON.stringify(rd.pills)
   +' '+JSON.stringify((rd.bare.match(/.{0,40}(%|\bscore\b|\bpercent\b(?! complete)|\brate\b).{0,40}/gi)||[]).slice(0,4)));

  /* FT14, the unpack rule: each heading carries its meaning in the same place */
  const mean=await pg.evaluate(()=>{
   const out={};
   document.querySelectorAll('#flowside .rv-sec,#rit .rv-sec').forEach(s=>{
    const h=(s.querySelector('.rv-h')||{}).textContent, m=s.querySelector('.rv-mean');
    out[h]=m?m.textContent.length:0;});
   return out;});
  ok(['Done','Record','Due today','Missed','Goals','Success over time'].every(h=>mean[h]>30),
   'FT14: Done, Record, Due today, Missed, Goals and Success over time each carry a sentence saying what they mean, '+JSON.stringify(mean));

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
   RIT.gview='today'; setTab(TAB.RITUAL); await wait(400);
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
   /* ROUND QZ: the third line said "when I feel judged and rejected". Once the
      sniffer read "feel judged" (sacral 22) beside "rejected" (heart 22), the
      two seats tied at 7.2 and the first one written won, so this seed's heart
      seat moved to the sacral on a tie break rather than on anything the line
      means. Dropping "judged and" gives the line exactly the reading it had
      before, heart alone, which is what FT18 below is built on. */
   ['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
    'I feel worthless and ashamed, I am never enough, I am a failure.',
    'I go quiet and pull away from my partner when I feel rejected.'].forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
   /* a reading from before the first plan started, with a held count the field
      never had, so the card can only print it by reading this row */
   const h0=snapshot(CURP); h0.t=iso(today-15); h0.loaded=17; CURP.history.unshift(h0);
   CURP.avatar=avatarBlank(); CURP.avatar.built=true; CURP.avatar.at=iso(today-30);
   CURP.avatar.pairs=[{be:'I speak up calmly in the room',notbe:'I feel worthless and ashamed, I am never enough'},
    {be:'I stay close to the people I love',notbe:'I go quiet and pull away from my partner when I feel rejected'},
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
   /* ROUND QS: a seat is a tile and what it says is on its press, so the
      seat and the ritual feeding it are read off the carrier */
   const A=avState();
   return {fig:(c.querySelector('.rv-avfig b')||{}).textContent||'', rings:c.querySelectorAll('.rv-cy').length,
    tick:c.querySelectorAll('.rv-cy-ok').length,
    hero:(c.querySelector('.rv-avhero .cr.hero .v')||{}).textContent||'', heroTip:!!c.querySelector('.rv-avhero[data-tip]'),
    overall:A.overall,
    seats:[...c.querySelectorAll('.rv-avs')].map(x=>({n:x.getAttribute('data-tip-t')||'',f:x.getAttribute('data-tip')||'',
     glyph:!!x.querySelector('.crb .crb-g svg'), fedDot:x.classList.contains('rv-fed')}))};});
  ok(!av.none&&new RegExp('^'+seed.keptDays+' days?$').test(av.fig.trim())&&av.rings===3&&av.tick===(seed.keptDays>=21?1:0),
   'FT18: Ritual to avatar prints the '+seed.keptDays+' distinct days kept, draws three cycles and ticks only a full one, '+JSON.stringify(av));
  const heart=(av.seats||[]).filter(x=>/at the heart/.test(x.n))[0], solar=(av.seats||[]).filter(x=>/solar plexus/.test(x.n))[0];
  ok(heart&&/ Fed by Controlled Breath\.$/.test(heart.f)&&heart.fedDot&&solar&&/No ritual at this seat yet/.test(solar.f)&&!solar.fedDot,
   'FT18: each avatar seat says on its press the active ritual kept there, or that none is, and its dot is filled only when fed, '+JSON.stringify(av.seats));
  const wantHero=av.overall==null?'\u2013':(Math.round(av.overall*100)?Math.round(av.overall*100)+'%':'\u2013');
  ok(av.hero===wantHero&&av.heroTip&&(av.seats||[]).every(x=>x.glyph),
   'FT18: the hero is the Avatar page\'s own percent complete, '+wantHero+', with its meaning on the press, and every seat is a badge with a mark, '+JSON.stringify([av.hero,av.overall]));

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

  /* ---- FT21, a calendar since round QX ---- */
  const lp=await pg.evaluate(()=>{const s=document.querySelector('#flowside .rv-loopw'); const all=[...s.querySelectorAll('.rv-cb')];
   const cb=all.filter(e=>!e.classList.contains('rv-cb-ahead')), ah=all.filter(e=>e.classList.contains('rv-cb-ahead'));
   const pos=e=>{const st=getComputedStyle(e); return [+st.gridRowStart,+st.gridColumnStart];};
   const now=cb.filter(e=>e.classList.contains('rv-cb-now'))[0];
   /* the weekday and the date, worked out here: Monday is column one */
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7, date=d=>new Date(d*DAY+off+12*3600000).getDate();
   const dates=cb.map(e=>+(e.querySelector('.rv-cbd')||{textContent:''}).textContent.replace(/^\D+/,''));
   const want=[]; for(let d=today-29;d<=today;d++)want.push(date(d));
   return {n:cb.length, done:cb.filter(e=>e.classList.contains('rv-cb-done')).length,
    nowAt:now?pos(now):null, wantCol:wd(today)+1, firstCol:cb.length?pos(cb[0])[1]:null, wantFirst:wd(today-29)+1,
    ahead:ah.length, wantAhead:6-wd(today), heads:[...s.querySelectorAll('.rv-cbw')].map(x=>x.textContent).join(''),
    datesOk:JSON.stringify(dates)===JSON.stringify(want), tips:cb.every(e=>e.hasAttribute('data-tip')),
    mo:(s.querySelector('.rv-cbmo')||{}).textContent||'',
    kept:(s.querySelector('.rv-cbk b')||{}).textContent, figs:(s.querySelector('.rv-cbf')||{}).textContent||'',
    oldRing:s.querySelectorAll('path.rv-ld').length};});
  /* the expected count of done cubes is worked out from the seed's days: a day
     in the thirty with anything marked done */
  const doneDays=seed.keptDays;
  ok(lp.n===30&&lp.done===doneDays&&lp.nowAt&&lp.nowAt[1]===lp.wantCol&&lp.firstCol===lp.wantFirst&&lp.heads==='MTWTFSS'
    &&lp.datesOk&&lp.ahead===lp.wantAhead&&/\d{4}$/.test(lp.mo)&&lp.tips&&lp.oldRing===0,
   'FT21: thirty days as a calendar, Monday first under the weekday letters, each cube its own date, today in its weekday column, the rest of the week ahead, the '+doneDays+' kept days solid, '+JSON.stringify(lp));
  ok(+lp.kept===seed.keptDays&&lp.figs.indexOf(seed.mins+' min')>=0&&!/%|rate/.test(lp.figs),
   'FT21: the figures over the cubes are counts of days and minutes worked out from the seed, '+JSON.stringify([lp.kept,lp.figs,seed.keptDays,seed.mins]));

  /* ---- FT25: a ritual's badge, its percent complete worked out here ---- */
  /* Today is first sight for these rings since round RB, so they tween in
     from empty (crMotion) and are read once they have landed */
  const pc=await pg.evaluate(async()=>{RIT.gview='today'; ritRender(); await new Promise(r=>setTimeout(r,1500)); const rows=[...document.querySelectorAll('#rit .rv-act .rv-item')];
   return rows.map(r=>({id:r.querySelector('.rv-log').getAttribute('data-id'), pill:(r.querySelector('.rv-pc .crb-v')||{}).textContent,
    glyph:!!r.querySelector('.rv-pc .crb-g svg'), tip:(r.querySelector('.rv-pc')||{getAttribute:()=>''}).getAttribute('data-tip')||'',
    word:[...r.querySelectorAll('.rv-sub .rv-tg')].length}));});
  const by=Object.fromEntries(pc.map(x=>[x.id,x]));
  /* the percent each span ritual should read, worked out here from its plan
     and the entries, not by asking the page: days in its span on its days of
     the week, and of those the days with an entry for its steps marked done */
  const want=await pg.evaluate(()=>{const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
   const dk=t=>Math.floor((Date.parse(t)-off)/DAY), wd=d=>(new Date(d*DAY).getUTCDay()+6)%7, out={};
   ritPlans().forEach(p=>{if(!p.days)return; const s=dk(p.from); let due=0,kept=0;
    for(let d=s;d<s+p.days;d++){if(p.on&&p.on.indexOf(wd(d))<0)continue; if(p.stop&&d>=dk(p.stop))continue; due++;
     if(CURP.rituals.some(x=>dk(x.t)===d&&x.steps.join('+')===p.steps.join('+')&&x.done!==false))kept++;}
    out[p.id]=due?(Math.round(100*kept/due)?Math.round(100*kept/due)+'%':'\u2013'):null;});
   return out;});
  const spans=pc.filter(x=>want[x.id]!=null);
  ok(spans.length>0&&spans.every(x=>x.pill===want[x.id]&&/Percent complete/.test(x.tip))&&/Percent complete/.test(by.qb.tip)&&by.qa&&by.qa.pill===String(seed.qaKept)
   &&by.qd&&by.qd.pill==='\u2013'&&pc.every(x=>x.glyph&&x.word===0),
   'FT25: a span ritual reads its percent complete, '+JSON.stringify(want)+', one with no end its days kept, none kept a dash, each with its seat mark and no seat word, '+JSON.stringify(pc));
  const due=await pg.evaluate(()=>[...document.querySelectorAll('#flowside .rv-act .rv-item')].map(r=>!!r.querySelector('.rv-pc .crb')));
  ok(due.length>0&&due.every(Boolean),'FT25: every Due today row carries the same badge, '+JSON.stringify(due));

  /* ---- FT26: the tell is on the press ---- */
  const tell=await pg.evaluate(()=>{const out=[];
   document.querySelectorAll('#rit .rv-sec,#flowside .rv-sec,#flowleft .rv-sec').forEach(sec=>{
    const h=sec.querySelector(':scope>.rv-hd .rv-h'), m=sec.querySelector(':scope>.rv-mean'); if(!h||!m)return;
    out.push({h:h.textContent, tip:h.getAttribute('data-tip')===m.textContent, focus:h.getAttribute('tabindex')==='0',
     shown:getComputedStyle(m).display!=='none'});});
   return out;});
  ok(tell.length>=8&&tell.every(x=>x.tip&&x.focus&&!x.shown),
   'FT26: every part\'s sentence is on its heading\'s press, reachable by keyboard, and folded at rest, '+JSON.stringify(tell));

  /* ---- FT27: a suggestion wears its seat and its mark ---- */
  const sg=await pg.evaluate(async()=>{const L=document.getElementById('flowleft');
   const cards=[...L.querySelectorAll('.rv-sg1')].map((c,i)=>{const x=RIT.sug[i], b=x.seats[0]||'';
    const n=x.rel!=null?BY[x.rel]:null, cf=n&&n.cf?CHILD.find(f=>f.nm===n.cf):null;
    const want=(n&&cf)?cf.ic:null, g=c.querySelector('.rv-sgs .crb-g svg');
    return {nm:c.querySelector('.rv-sgn').textContent, col:getComputedStyle(c).getPropertyValue('--c').trim()===seatCol(b),
     mark:!!g&&(want?g.innerHTML.indexOf(want)>=0:g.innerHTML===(SEATGLYPH[b]||SEATGLYPH._)),
     hidden:c.querySelector('.rv-sgx').hidden, tagMark:[...c.querySelectorAll('.rv-tg svg')].length===x.seats.length};});
   const b=L.querySelector('.rv-sgs'); b.click(); await new Promise(r=>setTimeout(r,200));
   const c0=L.querySelector('.rv-sg1');
   return {cards, opened:!c0.querySelector('.rv-sgx').hidden&&b.isConnected===false&&L.querySelector('.rv-sgs').getAttribute('aria-expanded')==='true'};});
  ok(sg.cards.length>0&&sg.cards.every(c=>c.col&&c.mark&&c.hidden&&c.tagMark)&&sg.opened,
   'FT27: each suggestion is in its seat\'s colour with the seat\'s or the pattern\'s mark, its reasons folded until the mark is pressed, '+JSON.stringify(sg));

  /* ---- FT28: the marks, on the days that earned them ---- */
  const mk2=await pg.evaluate(()=>{const s=document.querySelector('#flowside .rv-loopw'), L=ladderRead(CURP,Date.now()), md=markDays(CURP,Date.now());
   const t0=ritToday0()-29, inWin=L.earned.filter(m=>md[m.k]!=null&&md[m.k]>=t0);
   return {earned:L.earned.map(m=>m.k), shelf:s.querySelectorAll('.rv-marks .rv-m').length, pins:s.querySelectorAll('.rv-cbm').length,
    inWin:inWin.length, shelfTips:[...s.querySelectorAll('.rv-marks .rv-m')].every(e=>/Earned|\./.test(e.getAttribute('data-tip')||'')),
    next:!!s.querySelector('.rv-next'), first:md.first};});
  ok(mk2.earned.length>0&&mk2.shelf===mk2.earned.length&&mk2.pins===mk2.inWin&&mk2.inWin>0&&mk2.shelfTips&&!mk2.next,
   'FT28: every earned mark is on the shelf with its meaning, the ones earned in the thirty are pinned on their day, and no next mark here, '+JSON.stringify(mk2));

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
 /* ---- FT24: Suggested is there with the input, and says each choice once ----
    Found by walking the built page as named people. A blank profile is the
    stranger's first visit; James is a worked example from the roster, read
    only, whose heaviest seat also holds a place, which is the doubled card. */
 {
  const pg=await browser.newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const fresh=()=>pg.evaluate(who=>{loadP(who==null?0:PEOPLE.findIndex(x=>x.nm===who)); CURP.rituals=[]; ritPlanPut([]);
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();},null);
  await fresh(); await pg.waitForTimeout(300);
  const first=await pg.evaluate(()=>{const L=document.getElementById('lcol'), s=L.querySelector('.rv-sug'), n=L.querySelector('.rv-new');
   const called=ritRead().c.called;
   return {building:document.body.classList.contains('ritbuild'), builder:!!L.querySelector('.rv-build'), sug:!!s,
    cards:[...L.querySelectorAll('.rv-sg1 .rv-sgn')].map(x=>x.textContent), called:called&&called.nm,
    below:!!(s&&n)&&s.getBoundingClientRect().top>=n.getBoundingClientRect().bottom-1};});
  ok(!first.building&&!first.builder&&first.sug&&first.cards[0]===first.called&&first.below,
   'FT24: a first visit with nothing running shows the input shut and Suggested under it, the called practice first, '+JSON.stringify(first));
  /* the centre's own New ritual is not a second copy of the left column's on
     one screen; folded shut, the left column is one control and the centre's
     press is back */
  const dup=await pg.evaluate(async()=>{
   const shown=sel=>[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0;}).length;
   const open={left:shown('#lcol [data-act="add"]'), centre:shown('#rit [data-act="add"]')};
   document.getElementById('lfold').click(); await new Promise(r=>setTimeout(r,200));
   const folded={left:shown('#lcol [data-act="add"]'), centre:shown('#rit [data-act="add"]')};
   document.getElementById('lfold').click(); await new Promise(r=>setTimeout(r,200));
   return {open, folded};});
  ok(dup.open.left===1&&dup.open.centre===0&&dup.folded.centre===1,
   'FT24: with the left column open its New ritual is the one in the centre and left, and folded the centre carries it, '+JSON.stringify(dup));
  /* New ritual: the builder opens with the called practice picked, and the
     list under it does not offer that same practice a second time */
  const open=await pg.evaluate(async()=>{document.querySelector('#lcol [data-act="add"]').click(); await new Promise(r=>setTimeout(r,250));
   const L=document.getElementById('lcol'), picked=Object.keys(RIT.sel).filter(k=>RIT.sel[k]).map(k=>ritPr(k).nm);
   const out={builder:!!L.querySelector('.rv-build'), picked, sugText:(L.querySelector('.rv-sug')||{innerText:''}).innerText,
    cards:[...L.querySelectorAll('.rv-sg1 .rv-sgn')].map(x=>x.textContent)};
   /* opened with a press, it closes with one, even with nothing active */
   const c=L.querySelector('[data-act="cancel"]'); out.cancel=!!c;
   if(c){c.click(); await new Promise(r=>setTimeout(r,250));}
   out.shutAgain=!L.querySelector('.rv-build')&&!!L.querySelector('.rv-sug .rv-sg1');
   return out;});
  ok(open.builder&&open.picked.length>0&&open.cards.every(n=>open.picked.indexOf(n)<0)&&!/Nothing to suggest/.test(open.sugText),
   'FT24: with the builder open the practice it holds is not offered again beneath, and the list never says there is nothing while the builder holds it, '+JSON.stringify(open));
  ok(open.cancel&&open.shutAgain,'FT24: a builder opened on a first visit has Cancel, and Cancel shuts it with Suggested back, '+JSON.stringify(open));
  /* on a record whose list is longer, Suggested stays under the open builder */
  await pg.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();});
  await pg.waitForTimeout(250);
  const jm=await pg.evaluate(async()=>{const L=document.getElementById('lcol');
   const cards=[...L.querySelectorAll('.rv-sg1')].map(c=>({nm:c.querySelector('.rv-sgn').textContent,
    tags:[...c.querySelectorAll('.rv-tg')].map(t=>t.textContent).join('/'), why:[...c.querySelectorAll('.rv-sgw li')].map(l=>l.textContent)}));
   const rel=(RIT.sug||[]).map(x=>x.rel!=null);
   L.querySelector('[data-act="add"]').click(); await new Promise(r=>setTimeout(r,250));
   const b=L.querySelector('.rv-build'), s=L.querySelector('.rv-sug');
   return {cards, rel, underBuilder:!!(b&&s)&&s.getBoundingClientRect().top>=b.getBoundingClientRect().bottom-1};});
  const pairs=jm.cards.map(c=>c.nm+'@'+c.tags), both=jm.cards.filter(c=>c.why.length>1);
  ok(jm.cards.length>1&&new Set(pairs).size===pairs.length&&jm.underBuilder,
   'FT24: no practice is offered twice at one seat, and Suggested stays under the open builder, '+JSON.stringify(jm));
  ok(both.length>0&&both.every(c=>/^You hold .+ release schedule/.test(c.why[c.why.length-1]))&&jm.rel[jm.cards.indexOf(both[0])]===true,
   'FT24: a seat that carries the most and holds a place is one card with both reasons, and it starts the schedule for that place, '+JSON.stringify({both,rel:jm.rel}));
  /* editing an existing ritual is a different job, and Suggested steps aside */
  await fresh(); await pg.waitForTimeout(200);
  const ed=await pg.evaluate(async()=>{const k=PRACTICE.filter(p=>!p.tc)[0].k;
   ritStartPlan({steps:[k],band:'',track:'',days:7,when:'',where:''},'Started.'); RIT.sel={}; RIT.order=[]; RIT.add=false; ritRender();
   const id=ritPlans()[0].id; ritEditOpen(id); await new Promise(r=>setTimeout(r,250));
   const L=document.getElementById('lcol');
   const during={edit:RIT.edit===id, sug:!!L.querySelector('.rv-sug')};
   const c=L.querySelector('[data-act="cancel"]'); if(c)c.click(); await new Promise(r=>setTimeout(r,250));
   return {during, after:!!L.querySelector('.rv-sug')};});
  ok(ed.during.edit&&!ed.during.sug&&ed.after,'FT24: while a ritual is being edited Suggested steps aside, and comes back when the edit is left, '+JSON.stringify(ed));
  await pg.evaluate(()=>{ritWrite(function(){CURP.rituals=[];return [];},null);});
  }catch(e){ok(false,'FT24: the group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'FT24: no page errors, '+err.join(' | '));
  await pg.close();
 }
 /* FT24 on a phone: with nothing active the column that starts one is first,
    and with one running the stack is back to the ritual, the tracker, then new */
 {
  const pg=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const top=()=>pg.evaluate(()=>{const t=id=>Math.round(document.getElementById(id).getBoundingClientRect().top);
   return {lcol:t('lcol'), rit:t('rit'), rcol:t('rcol'), sug:!!document.querySelector('#lcol .rv-sg1')};});
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();});
  await pg.waitForTimeout(400);
  const none=await top();
  await pg.evaluate(()=>{ritStartPlan({steps:[PRACTICE.filter(p=>!p.tc)[0].k],band:'',track:'',days:7,when:'',where:''},'Started.');
   RIT.sel={}; RIT.order=[]; RIT.add=false; ritRender();});
  await pg.waitForTimeout(400);
  const one=await top();
  await pg.evaluate(()=>{ritWrite(function(){CURP.rituals=[];return [];},null);});
  ok(none.sug&&none.lcol<none.rit&&none.lcol<none.rcol&&one.rit<one.rcol&&one.rcol<one.lcol,
   'FT24: @390 with nothing active New and Suggested come first, and with one running the order is the ritual, the tracker, then new, '+JSON.stringify({none,one}));
  }catch(e){ok(false,'FT24: the phone group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
 }

 /* ---- FT29 to FT32: round QX, the page as a calendar ----
    One seed of the person's own, with a ritual set for Tuesday, Thursday and
    Saturday (his own example cadence), a record that starts forty days back,
    and three avatar lines. Every expected figure is worked out here from the
    seed's days and the tables, never asked of the page's own reads. */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600, tag='@'+W+' ';
  const pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const seed=await pg.evaluate(()=>{
   loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]);
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
   const today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7;
   ['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
    'I feel worthless and ashamed, I am never enough, I am a failure.'].forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
   const h0=snapshot(CURP); h0.t=iso(today-60); h0.loaded=19; CURP.history.unshift(h0);
   CURP.avatar=avatarBlank(); CURP.avatar.built=true; CURP.avatar.at=iso(today-30);
   CURP.avatar.pairs=[{be:'I speak up calmly in the room',notbe:'I feel worthless and ashamed, I am never enough'},
    {be:'I feel safe in my own body',notbe:'I am terrified of being abandoned and I panic and cannot breathe'}];
   const P=(id,k,band,from,days,on)=>({id,steps:[k],when:'',where:'',days,from:iso(from),stop:null,band,track:'',rel:null,tc:null,tags:[band],on:on||null,tm:null});
   /* Tuesday, Thursday and Saturday are 1, 3 and 5, Monday first */
   const plans=[P('za','noting','Throat',today-40,0),P('zt','box','Root',today-27,0,[1,3,5])];
   const done={za:[],zt:[]};
   for(let d=today-40;d<today;d++)if(d%5!==0)done.za.push(d);
   for(let d=today-27;d<today;d++)if([1,3,5].indexOf(wd(d))>=0&&d%4!==0)done.zt.push(d);
   const key={za:'noting',zt:'box'}, band={za:'Throat',zt:'Root'};
   Object.keys(done).forEach(id=>done[id].forEach(d=>CURP.rituals.push({t:iso(d),steps:[key[id]],min:5,when:'',where:'',band:band[id],done:iso(d)})));
   CURP.rituals.sort((a,b)=>Date.parse(a.t)-Date.parse(b.t));
   const wrote=ritPlanPut(plans)&&pSave();
   try{STORE.set('atuned-ritual-more','{}');}catch(e){}
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; RIT.gview='today'; RIT.span='1m'; setTab(TAB.RITUAL); ritRender();
   return {wrote, today, done, rs:today-40};});
  await pg.waitForTimeout(500);
  ok(seed.wrote,'FT29: '+tag+'the QX seed was written through the store and the record');

  /* ---- FT29: a suggestion says what it is, what it is for, your record with it, and takes three answers ---- */
  const sg=await pg.evaluate(()=>{const L=document.getElementById('flowleft');
   return [...L.querySelectorAll('.rv-sg1')].map((c,i)=>{const x=RIT.sug[i], p=ritPr(x.k);
    /* the record with this practice, counted here off the entries */
    const days=new Set(CURP.rituals.filter(e=>e.steps.indexOf(x.k)>=0&&e.done!==false).map(e=>pracDay(e.t))).size;
    const b=x.seats[0]||'', n=x.rel!=null?BY[x.rel]:(b?W.filter(h=>h.b===b&&h.cf&&h.sq>=4).sort((a,c)=>c.sq-a.sq)[0]:null);
    const cf=n&&n.cf?CHILD.find(f=>f.nm===n.cf):null;
    const chips=[...c.querySelectorAll('.rv-sgc')].map(e=>e.textContent);
    const btn=sel=>{const e=c.querySelector(sel); if(!e)return null; const r=e.getBoundingClientRect(); return [Math.round(r.width),Math.round(r.height)];};
    return {nm:p.nm, desc:(c.querySelector('.rv-sgd')||{}).textContent===p.d,
     toward:cf?chips.indexOf('Toward '+cf.opp.toLowerCase())>=0:!chips.some(t=>/^Toward/.test(t)),
     rec:chips.indexOf(days?'Kept '+days+(days===1?' day':' days'):'Not tried yet')>=0,
     tips:[...c.querySelectorAll('.rv-sgc')].every(e=>(e.getAttribute('data-tip')||'').length>20),
     add:btn('[data-act="sug"]'), save:btn('[data-act="sug-save"]'), drop:btn('[data-act="sug-x"]'),
     noRate:!/%|\brate\b|\bscore\b/i.test(c.innerText)};});});
  ok(sg.length>0&&sg.every(c=>c.desc&&c.toward&&c.rec&&c.tips&&c.noRate),
   'FT29: '+tag+'each suggestion shows what the practice is, what it is for when a held place gives it one, and your own record with it, counted here, with no rate, '+JSON.stringify(sg));
  ok(sg.every(c=>[c.add,c.save,c.drop].every(b=>b&&b[0]>=44&&b[1]>=44)),
   'FT29: '+tag+'every suggestion carries Add to daily practice, Save for later and Dismiss, each at least 44 by 44, '+JSON.stringify(sg.map(c=>[c.add,c.save,c.drop])));
  const ans=await pg.evaluate(async()=>{const L=document.getElementById('flowleft'), w=()=>new Promise(r=>setTimeout(r,250));
   const names=()=>[...L.querySelectorAll('.rv-sug .rv-sg1 .rv-sgn')].map(x=>x.textContent);
   const shelf=()=>[...L.querySelectorAll('.rv-saved .rv-sv1 .rv-sgn')].map(x=>x.textContent);
   const said=()=>(document.getElementById('status')||{}).textContent||'';
   const out={n0:names()};
   /* Dismiss first, while there is a card to dismiss */
   const nm1=names()[0]; L.querySelector('[data-act="sug-x"][data-i="0"]').click(); await w();
   out.drop={gone:names().indexOf(nm1)<0, back:!!L.querySelector('[data-act="sug-back"]')};
   L.querySelector('[data-act="sug-back"]').click(); await w(); out.drop.again=names().indexOf(nm1)>=0;
   /* dismissed again, and the Put back offer spent the way any other press
      spends it, so the foot of the list offers them all back */
   L.querySelector('[data-act="sug-x"][data-i="0"]').click(); await w(); RIT.sgGone=null; ritRender();
   out.drop.all=!!L.querySelector('[data-act="sug-all"]');
   if(out.drop.all){L.querySelector('[data-act="sug-all"]').click(); await w(); out.drop.allBack=names().indexOf(nm1)>=0;}
   const nm0=names()[0]; L.querySelector('[data-act="sug-save"][data-i="0"]').click(); await w();
   out.save={said:said(), gone:names().indexOf(nm0)<0, shelf:shelf(), stored:JSON.parse(STORE.get('atuned-ritual-more'))[CURP.id].save.length};
   ritRender(); out.save.kept=shelf().indexOf(nm0)>=0;
   const r0=CURP.rituals.length; L.querySelector('[data-act="sv-add"][data-i="0"]').click(); await w();
   out.add={said:said(), plan:ritPlans().some(p=>ritName(p.steps)===nm0&&ritActive(p,ritToday0())&&p.days===7), shelf:shelf(), r:CURP.rituals.length-r0};
   return out;});
  ok(/^Saved for later\./.test(ans.save.said)&&ans.save.gone&&ans.save.kept&&ans.save.stored===1,
   'FT29: '+tag+'Save for later takes it off Suggested, puts it under Saved for later, keeps it across a repaint, and says so, '+JSON.stringify(ans.save));
  ok(ans.drop&&ans.drop.gone&&ans.drop.back&&ans.drop.again&&ans.drop.all&&ans.drop.allBack,
   'FT29: '+tag+'Dismiss takes it off with Put back in the same place, and Bring back dismissed returns every one, '+JSON.stringify(ans.drop));
  ok(/^(Started|Set)\./.test(ans.add.said)&&ans.add.plan&&ans.add.shelf.length===0,
   'FT29: '+tag+'Add from Saved for later starts it each day for a week and it leaves the shelf, '+JSON.stringify(ans.add));
  const we=await pg.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.RITUAL); ritRender();
   const b=document.querySelector('#flowleft [data-act="sug-save"]'); if(b)b.click();
   const r={said:(document.getElementById('status')||{}).textContent||'', btn:!!b};
   loadP(0); setTab(TAB.RITUAL); ritRender(); return r;});
  ok(we.btn&&/worked example, so nothing was saved/.test(we.said),'FT29: '+tag+'on a worked example the answer is refused by name, '+JSON.stringify(we));

  /* ---- FT30: Goals, today, the week and the month ---- */
  const gl=await pg.evaluate(()=>{RIT.gview='today'; ritRender(); const g=document.querySelector('#rit .rv-goals');
   const af=[...g.querySelectorAll('.rv-aff .rv-af1')].map(x=>x.querySelector('.rv-afq').textContent);
   const ch=[...g.querySelectorAll('.rv-chal .rv-af1')].map(x=>({nm:x.querySelector('.rv-chn').childNodes[0].textContent, act:x.querySelector('.rv-afq').textContent}));
   /* the rows due today, worked out off the plans: active, and today one of its days */
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY), wd=(new Date(today*DAY).getUTCDay()+6)%7;
   const due=ritPlans().filter(p=>!p.stop&&(!p.on||p.on.indexOf(wd)>=0)).length;
   return {views:[...g.querySelectorAll('[data-act="gview"]')].map(b=>b.textContent), rows:g.querySelectorAll('.rv-item').length, due,
    af, ch, pairs:CURP.avatar.pairs.map(p=>p.be).reverse()};});
  const wantAf=gl.pairs.map(b=>'"'+b+'"');
  ok(JSON.stringify(gl.views)===JSON.stringify(['Today','This week','This month'])&&gl.rows===gl.due&&gl.due>0&&gl.af.length===3
    &&JSON.stringify(gl.af.slice(0,2))===JSON.stringify(wantAf)&&gl.ch.length>=1,
   'FT30: '+tag+'Goals is Today, This week and This month; Today holds the Active rows, three affirmations with your own avatar lines first, newest first, and the challenges, '+JSON.stringify(gl));
  const sd=await pg.evaluate(async()=>{const r0=CURP.rituals.length, k0=ladderRead(CURP,Date.now()).streak.run;
   const b=document.querySelector('#rit .rv-aff [data-act="said"]'); b.click(); await new Promise(r=>setTimeout(r,250));
   const on=document.querySelector('#rit .rv-aff [data-act="said"]').getAttribute('aria-pressed');
   const said=(document.getElementById('status')||{}).textContent||'';
   document.querySelector('#rit .rv-aff [data-act="said"]').click(); await new Promise(r=>setTimeout(r,250));
   return {on, said, off:document.querySelector('#rit .rv-aff [data-act="said"]').getAttribute('aria-pressed'),
    rit:CURP.rituals.length-r0, streak:ladderRead(CURP,Date.now()).streak.run-k0};});
  ok(sd.on==='true'&&/^Said\./.test(sd.said)&&sd.off==='false'&&sd.rit===0&&sd.streak===0,
   'FT30: '+tag+'an affirmation is marked said for today and taken off with the same press, and it is not a kept ritual day: the record and the streak do not move, '+JSON.stringify(sd));
  const wk=await pg.evaluate(()=>{RIT.gview='week'; ritRender(); const g=document.querySelector('#rit .rv-goals .rv-wg');
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7, mon=today-wd(today);
   const heads=[...g.querySelectorAll('.rv-wgh')].map(h=>h.textContent);
   const want=[0,1,2,3,4,5,6].map(i=>['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]+new Date((mon+i)*DAY+off+12*3600000).getDate());
   /* the Tuesday, Thursday and Saturday row: set on exactly those three */
   const cells=[...g.querySelectorAll('.rv-wc')].filter(c=>/^Box Breathing,/.test(c.getAttribute('aria-label')));
   const st=cells.map(c=>c.className.match(/rv-wc-(\w+)/)[1]);
   RIT.gview='today'; ritRender();
   return {heads, want, st, setOn:st.map((s,i)=>s==='off'?-1:i).filter(i=>i>=0)};});
  ok(JSON.stringify(wk.heads)===JSON.stringify(wk.want)&&JSON.stringify(wk.setOn)===JSON.stringify([1,3,5]),
   'FT30: '+tag+'This week is a calendar week, Monday first with each date, and a ritual set for Tuesday, Thursday and Saturday is drawn on those three days and no other, '+JSON.stringify(wk));

  /* ---- FT33, round RB: a worked example runs rituals, and the page reads them ----
     engine/ritex.js builds each example's plans and days with its own copy of
     ritCovers, because the engine cannot call a renderer. This holds the two
     to one answer: the page's own kept and missed count for every plan is the
     engine's, and the centre opens on the week with every running ritual in
     it. Then the person's own record is put back. */
  const ex=await pg.evaluate(()=>{const out={};
   ['Derek','Diane','Ana','James'].forEach(nm=>{
    const p=PEOPLE.find(x=>x.nm===nm); loadP(PEOPLE.indexOf(p)); RIT.gview=null; setTab(TAB.RITUAL); ritRender();
    const st=ritRead(), R=ritexBuild(p,Date.now());
    const page=st.plans.reduce((a,q)=>{const r=ritRunRead(q,st.today); return {k:a.k+r.kept, m:a.m+r.missed};},{k:0,m:0});
    const rows=[...document.querySelectorAll('#rit .rv-goals .rv-wg .rv-wgn b')].map(b=>b.textContent);
    out[nm]={plans:st.plans.length, act:st.act.length, page, eng:R?{k:R.kept,m:R.missed}:null,
     week:!!document.querySelector('#rit .rv-goals [data-v="week"][aria-pressed="true"]')&&st.act.every(q=>rows.indexOf(ritName(q.steps))>=0), today:!!document.querySelector('#rit .rv-wgh.rv-now'),
     due:document.querySelectorAll('#flowside .rv-act .rv-log').length};});
   loadP(0); setTab(TAB.RITUAL); ritRender(); return out;});
  ok(['Derek','Diane','Ana'].every(n=>{const x=ex[n]; return x.plans>0&&x.act>0&&x.eng&&x.page.k===x.eng.k&&x.page.m===x.eng.m&&x.week&&x.today;})
    &&new Set(['Derek','Diane','Ana'].map(n=>JSON.stringify(ex[n].page))).size===3,
   'FT33: '+tag+'Derek, Diane and Ana each open on their own running rituals, the page counts the same kept and missed days the engine wrote, and the week holds every one with today marked, '+JSON.stringify(ex));
  ok(ex.James.plans===0&&ex.James.eng===null&&!ex.James.week,'FT33: '+tag+'James said yes to nothing, opens on nothing, and so opens on Today and not an empty week, '+JSON.stringify(ex.James));

  /* ---- FT31: the content is real, and says where it came from ---- */
  const ct=await pg.evaluate(()=>{const miss=CHILD.filter(c=>!AFFIRM[c.nm]||!CHALLENGE[c.nm]).map(c=>c.nm);
   const lines=[].concat(Object.values(AFFIRM),Object.values(CHALLENGE).map(c=>c.act+' '+c.when));
   loadP(PEOPLE.findIndex(x=>x.nm==='James')); const r=compute();
   const named=r.sabs.slice().sort((a,b)=>b.w-a.w).map(s=>s.nm.replace(/\s+overshot$/i,'').toLowerCase().replace(/-/g,' ')).filter(k=>SABDEF[k]);
   const want=[...new Set(named)].slice(0,3).map(k=>SABDEF[k].i);
   const got=ritChallenge({r}).map(c=>c.act);
   loadP(0); setTab(TAB.RITUAL); ritRender();
   /* an inferred saboteur, handed in by its name the way compute() names one:
      the seat, then the agent noun for the fetter (INFER_NOUN) */
   const noun=INFER_NOUN.Sad, inf=ritChallenge({r:{sabs:[{nm:'Root '+noun,w:5,parts:[W.find(n=>n.b==='Root')]}]}})
    .map(c=>({nm:c.nm, act:c.act===CHALLENGE.Sad.act, who:c.who}));
   return {miss, dash:lines.some(t=>/—|–/.test(t)), want, got, inf};});
  ok(ct.miss.length===0&&!ct.dash,'FT31: every one of the nine axes has an affirmation and a challenge, and no line carries a dash, '+JSON.stringify(ct.miss));
  ok(ct.want.length===3&&JSON.stringify(ct.got)===JSON.stringify(ct.want),
   'FT31: a named saboteur\'s challenge is its own intervention from SABDEF, the heaviest three, '+JSON.stringify(ct));
  ok(ct.inf.length===1&&ct.inf[0].act&&/does not name/.test(ct.inf[0].who)&&/sadness at the root/.test(ct.inf[0].who),'FT31: an inferred saboteur says it is one, and carries its fetter\'s challenge, '+JSON.stringify(ct.inf));

  /* ---- FT32: success over time, his ten spans, and honest before the record starts ---- */
  const sx=await pg.evaluate(async()=>{const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7, dk=t=>Math.floor((Date.parse(t)-off)/DAY);
   const plans=ritPlans(), doneD=new Set(CURP.rituals.filter(x=>x.done!==false).map(x=>dk(x.t)));
   const covers=(p,d)=>{const s=dk(p.from); if(d<s)return false; if(p.on&&p.on.indexOf(wd(d))<0)return false; if(p.days&&d>=s+p.days)return false; if(p.stop&&d>=dk(p.stop))return false; return true;};
   const rs=Math.min(...CURP.rituals.map(x=>dk(x.t)),...plans.map(p=>dk(p.from)));
   const back=(m,d)=>{if(d)return today-d+1; const t=new Date((today)*DAY+off+12*3600000); return dk(new Date(t.getFullYear(),t.getMonth()-m,t.getDate(),12).toISOString())+1;};
   const spans=[['1y',12],['6m',6],['3m',3],['2m',2],['1m',1],['2w',0,14],['1w',0,7],['5d',0,5],['3d',0,3],['1d',0,1]];
   const sec=()=>document.querySelector('#rit .rv-c-ana');
   const out={chips:[...sec().querySelectorAll('[data-act="rng"]')].map(b=>b.textContent), rows:[]};
   for(const [k,m,d] of spans){
    sec().querySelector('[data-act="rng"][data-v="'+k+'"]').click(); await new Promise(r=>setTimeout(r,120));
    const t0=back(m,d); let kept=0, missed=0, pre=0;
    for(let x=t0;x<=today;x++){if(x<rs){pre++;continue;} if(doneD.has(x)){kept++;continue;}
     if(x<today&&plans.some(p=>covers(p,x)))missed++;}
    const figs=[...sec().querySelectorAll('.rv-sfigs .rv-fig')].map(f=>f.querySelector('b').textContent.trim().split(/\s/)[0]);
    const n=v=>v?String(v):'–';
    out.rows.push({k, kept:figs[0]===n(kept), missed:figs[1]===n(missed), pre:sec().querySelectorAll('.rv-sc-pre').length===pre,
     note:pre?new RegExp(pre+' days? of this span before that are drawn blank').test(sec().innerText):!sec().querySelector('.rv-sparse'),
     cells:sec().querySelectorAll('.rv-sc').length===today-t0+1, wide:!!sec().querySelector('.rv-syr')===(today-t0+1>62), want:[kept,missed,pre], figs});}
   sec().querySelector('[data-act="rng"][data-v="1m"]').click();
   /* James, not Marcus: since round RB Marcus runs a ritual (engine/ritex.js)
      and James, who says yes to nothing, is the example with no record */
   loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.RITUAL); ritRender();
   out.empty=/Nothing on your record yet/.test(sec().innerText)&&sec().querySelectorAll('.rv-sc-done,.rv-sc-miss').length===0;
   loadP(0); setTab(TAB.RITUAL); ritRender();
   return out;});
  ok(JSON.stringify(sx.chips)===JSON.stringify(['1 year','6 months','3 months','2 months','1 month','2 weeks','1 week','5 days','3 days','1 day']),
   'FT32: '+tag+'Success over time offers his ten spans in his order, '+JSON.stringify(sx.chips));
  const badRow=sx.rows.filter(r=>!(r.kept&&r.missed&&r.pre&&r.note&&r.cells&&r.wide));
  ok(badRow.length===0,
   'FT32: '+tag+'every span counts the kept and missed days worked out here, a day a square, and a span reaching back before the record draws those days blank, says how many, and never counts them missed, '+JSON.stringify(badRow.length?badRow:sx.rows.map(r=>r.k+':'+r.want.join('/'))));
  ok(sx.empty,'FT32: '+tag+'a person with no record is told so, and nothing is drawn kept or missed, '+JSON.stringify(sx.empty));
  }catch(e){ok(false,'FT29: '+tag+'the round QX group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'FT29: '+tag+'no page errors across the round QX group, '+err.join(' | '));
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
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
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
