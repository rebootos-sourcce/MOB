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
 /* EVERY PAGE THIS FILE OPENS RUNS ON ONE FIXED DATE, and no check here reads
    the real clock. FT30 passed on Thursday 8 October 2026 and failed on Friday
    9 October with the source unchanged: the round QX seed sets a ritual for
    Tuesday, Thursday and Saturday, and the check asked the real clock what day
    it was, so the gate answered for the weekday it was run on and not for the
    product. Monday 23 February 2026 at local noon: a Monday so the week loop
    in the QX group walks Monday to Sunday in order, and since SV24 put
    Sunday first its last day opens the next week, in a 28 day month so that
    week runs across a month end into 1 March, and noon so a run of a few
    minutes never crosses midnight. install and not setFixedTime, so the clock
    still runs from there: the release's settle count (ui/release.js) is two
    reads of Date.now, and on a clock that never moves it would never settle. */
 const AT=new Date(2026,1,23,12);
 const newPage=async o=>{const pg=await browser.newPage(o); await pg.clock.install({time:AT}); return pg;};
 /* ---- FT1, FT2, FT3, FT4, FT5, FT6, FT12, FT13, FT14: the page, both widths ---- */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600, tag='@'+W+' ';
  const pg=await newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
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
    /* SV19: the right head carries the streak strip ahead of its name, so
       the name is read off the name and the strip is held on its own (FT36) */
    rhd:(document.querySelector('#flowhd .fl-nm')||{}).textContent||'',
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
     sec[ond] third tier text", so they are their names alone. The centre kept
     a sentence until 4 November, when he struck it in red on the live page
     ("A set of practices you repeat on days you choose."), so it is its name
     alone too, and this holds the cut */
  ok(o.lhd.trim()==='New'&&o.rhd.trim()==='Accountability'&&o.chd.trim()==='Ritual',
   'FT14: '+tag+'each column is named by its job alone, the centre included, '+JSON.stringify([o.lhd,o.rhd,o.chd]));
  ok(COLS.every(([job])=>g[job].col.l>=0&&g[job].col.r<=o.vw+1)&&o.sw<=o.cw,
   'FT12: '+tag+'every column sits inside the screen and the page does not scroll sideways, '+JSON.stringify({vw:o.vw,sw:o.sw,cw:o.cw}));

  /* FT17, the centre's cards, measured off the boxes. SV16 put the week first
     and across the stage. SV19, his words: "Ongoing goals should be in the
     center" and, of the side by side pair, "I want these stacked". So the
     stage is one column of full width cards: Week, Today, Ongoing goal, Did
     it work, Keep or delete only while a ritual is in its last three days,
     and Success over time. Avatar stays in the right menu (FT6). */
  const six=await pg.evaluate(()=>{
   const w=document.querySelector('#rit .rv-six'), wr=w?w.getBoundingClientRect():null;
   const cards=w?[...w.children].map(e=>{const r=e.getBoundingClientRect();
    return {l:Math.round(r.left),r:Math.round(r.right),t:Math.round(r.top),b:Math.round(r.bottom),h:(e.querySelector('.rv-h')||{}).textContent};}):[];
   const ends=ritRead().act.some(p=>p.days>0&&ritStart0(p)+p.days-ritToday0()<=RIT_KEEP_AT);
   return {cards, ends, av:!!document.querySelector('#rit .rv-c-av'), w:wr&&{l:Math.round(wr.left),r:Math.round(wr.right)}};});
  const S6=six, names=S6.cards.map(c=>c.h);
  const wantNames=['Week','Today','Ongoing goal','Did it work'].concat(S6.ends?['Keep or delete']:[]).concat(['Success over time']);
  ok(!S6.av&&JSON.stringify(names)===JSON.stringify(wantNames),
   'FT17: '+tag+'the centre is the week, Today, the Ongoing goal, Did it work, Keep or delete only while one ends, then Success over time, and Avatar is not on it, '+JSON.stringify([names,S6.ends]));
  const full=x=>S6.w&&x.l-S6.w.l<=2&&S6.w.r-x.r<=2;
  ok(S6.cards.length>0&&S6.cards.every((x,i,a)=>full(x)&&(i===0||a[i-1].b<=x.t+1)),
   'FT17: '+tag+'every card on the stage is full width and they stack, none side by side, '+JSON.stringify(S6));

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
    /* and the week, SV16: his "the center panel ... like a calendar. A
       weekly calendar." It draws the plans on their days and its key says
       what the fills mean, which is the centre's job by his ruling and not a
       tracker part moved over */
    acc:[...rit.querySelectorAll('.rv-rec,.rv-today,.rv-marks,.rv-cal,.rv-key,.rv-hero,.rv-figs')].filter(e=>!e.closest('.rv-c-ana,.rv-goals,.rv-week')).length,
    stage:[...rit.querySelectorAll('.rv-h')].map(x=>x.textContent)};});
  ok(nr.inLeft>0&&nr.inRight===0&&nr.inStage===0&&nr.when,
   'FT4: '+tag+'the builder, its tags, timer, days and when and where fields are in the left column and nowhere else, '+JSON.stringify(nr));
  ok(nr.acc===0,'FT5: '+tag+'the Ritual stage holds no streak, rings, marks or record, '+nr.acc+' found, '+nr.stage.join(', '));

  /* with one ritual active the builder is open with no press, SV16, his
     "when I hit new ritual, I want its default state to be open and
     accessible", and neither row of seat tags is anywhere in the column, his
     "these tags at the bottom don't do anything because I'm creating the
     ritual". Picking a step is what makes it a builder holding something,
     which is what brings the column forward on a phone (ritbuild). */
  const closed=await pg.evaluate(async()=>{
   const k=PRACTICE.filter(p=>!p.tc)[0].k;
   ritStartPlan({steps:[k],band:'',track:'',days:7,when:'',where:''},'Started.');
   /* a start through the builder's own button clears its draft, so this does
      what that press does before it looks at the builder at rest */
   RIT.sel={}; RIT.order=[]; RIT.add=false; ritRender();
   await new Promise(r=>setTimeout(r,200));
   const lc=document.getElementById('lcol');
   const rest={open:!!lc.querySelector('#ritwhen')&&!!lc.querySelector('.rv-build'), press:lc.querySelectorAll('[data-act="add"]').length,
    tags:lc.querySelectorAll('.rv-tag2,[data-act="tag"],[data-act="newtag"]').length, word:/Start from a tag|\bTags\b/.test(lc.innerText),
    cancel:!!lc.querySelector('#ritx'), build:document.body.classList.contains('ritbuild')};
   const stageAdd=document.querySelectorAll('#rit [data-act="add"]').length;
   const tile=lc.querySelector('.rv-tile[data-act="pick"]'); if(tile)tile.click(); await new Promise(r=>setTimeout(r,200));
   const wk=lc.querySelector('.rv-wk'), rl=document.getElementById('flownew'), rr=rl?rl.getBoundingClientRect():{left:0,right:0};
   const wr=wk?wk.getBoundingClientRect():null;
   return {rest, stageAdd, picked:ritDraft().length, cancel:!!lc.querySelector('#ritx'),
    weekFits:!!wr&&wr.right<=rr.right+0.5&&wr.left>=rr.left-0.5,
    build:document.body.classList.contains('ritbuild'),
    listed:document.querySelectorAll('#rit .rv-item').length};});
  ok(closed.rest.open&&closed.rest.press===0&&closed.rest.tags===0&&!closed.rest.word&&!closed.rest.cancel&&!closed.rest.build
    &&closed.stageAdd===0&&closed.picked===1&&closed.cancel&&closed.build,
   'FT4: '+tag+'with a ritual active the builder is open with no press, carries no seat tags, offers Cancel only once a step is picked, and a pick brings it forward, '+JSON.stringify(closed));
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
  /* SV19, his words: "Get rid of the section that says marks. Get rid of the
     text that says 30-day loop ... Get rid of the missed section. Get rid of
     the history on the right-hand side. There should be a button and if I
     press it, it shows me the history on my right-hand menu." So at rest the
     column is the thirty days, headed by their month, a History press shut,
     and Avatar. No Done, Missed, Marks or Thirty day loop anywhere in it, and
     no Ongoing goal, which went to the centre (FT17). */
  const MONTH=/^[A-Z][a-z]+( to [A-Z][a-z]+)? \d{4}$/;
  ok(open.heads.length===2&&MONTH.test(open.heads[0])&&open.heads[1]==='Avatar'
    &&!['Thirty day loop','Done','Missed','Marks','History','Record','Ongoing goal','Ritual to avatar','Due today'].some(h=>open.heads.indexOf(h)>=0),
   'FT6: '+tag+'at rest the right column is the thirty days under their month, then Avatar, and nothing else, '+JSON.stringify(open.heads));
  const hp=await pg.evaluate(async()=>{
   const t=document.querySelector('#flowside [data-act="hist"]'); if(!t)return {none:true};
   const shut={exp:t.getAttribute('aria-expanded'), label:t.textContent.trim(), rec:!!document.querySelector('#flowside .rv-rec'),
    cards:!!document.querySelector('#flowside .rv-hist')};
   t.click(); await new Promise(r=>setTimeout(r,200));
   const t1=document.querySelector('#flowside [data-act="hist"]');
   const heads=[...document.querySelectorAll('#flowside .rv-h')].map(x=>x.textContent);
   const after=t1.nextElementSibling;
   const opened={exp:t1.getAttribute('aria-expanded'), heads, label:t1.textContent.trim(),
    under:!!after&&after.id==='rvhist'&&!!after.querySelector('.rv-hist')&&!!after.querySelector('.rv-rec')};
   t1.click(); await new Promise(r=>setTimeout(r,200));
   return {shut, opened, back:!document.querySelector('#flowside .rv-rec')};});
  ok(!hp.none&&hp.shut.exp==='false'&&hp.shut.label==='History'&&!hp.shut.rec&&!hp.shut.cards
    &&hp.opened.exp==='true'&&hp.opened.label==='History'&&hp.opened.under
    &&hp.opened.heads.indexOf('Rituals')>=0&&hp.opened.heads.indexOf('Record')>hp.opened.heads.indexOf('Rituals')
    &&hp.opened.heads[hp.opened.heads.length-1]==='Avatar'&&hp.back,
   'FT6: '+tag+'History is one press that keeps its label, opens the rituals and the Record under itself in the same column, and shuts again, '+JSON.stringify(hp));
  /* FT36, SV19, his words: "Move the streak to the upper right hand side and
     then accountability will be underneath that." The strip is the first
     thing in the right menu's head, above its name, and each figure is a mark
     with its word on the press */
  const sk=await pg.evaluate(()=>{const h=document.getElementById('flowhd'), row=h&&h.firstElementChild;
   const nm=h&&h.querySelector('.fl-nm');
   return {first:!!row&&row.classList.contains('acs-row'), above:!!row&&!!nm&&row.getBoundingClientRect().bottom<=nm.getBoundingClientRect().top+1,
    chips:row?[...row.children].map(c=>({k:c.className, t:c.getAttribute('data-tip-t'), tip:(c.getAttribute('data-tip')||'').length,
     svg:!!c.querySelector('svg'), word:/[A-Za-z]{4,}/.test((c.querySelector('b')||{}).textContent.replace(/days?|min/g,'')),
     h:Math.round(c.getBoundingClientRect().height), top:Math.round(c.getBoundingClientRect().top)})):[]};});
  ok(sk.first&&sk.above&&JSON.stringify(sk.chips.map(c=>c.t))===JSON.stringify(['Streak','Missed','Practised'])
    &&sk.chips.every(c=>c.svg&&c.tip>20&&!c.word&&c.h>=44)&&new Set(sk.chips.map(c=>c.top)).size===1,
   'FT36: '+tag+'the streak strip is the first row of the right head, above Accountability, three marks on one row, each word on its press and none on the screen, '+JSON.stringify(sk));
  }catch(e){ok(false,'FT6: '+tag+'the columns group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
  ok(err.length===0,tag+'no page errors across the Flow page, '+err.join(' | '));
 }

 /* ---- FT8, FT7, FT9, FT13, FT14: empty states, the reads, the writes ---- */
 {
  const pg=await newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);
  const wait=ms=>pg.waitForTimeout(ms||260);
  try{

  /* FT8, a person with nothing active and nothing on the record */
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); setTab(TAB.RITUAL);}); await wait(500);
  const e0=await pg.evaluate(()=>({
   due:(document.querySelector('#flowside .rv-act .rv-empty')||{}).textContent||'',
   /* SV19: the Missed card is gone, so nothing anywhere on the page says
      Nothing to miss yet; the strip's Missed is a dash */
   miss:document.querySelectorAll('.rv-miss,.rv-done').length,
   add:!!document.querySelector('#flowside [data-act="add"]'),
   built:!!document.querySelector('#lcol #ritwhen'),
   away:!!document.querySelector('#flowside [data-act="go-ritual"]'),
   streak:(document.querySelector('#flowhd .acs-streak b')||{}).textContent,
   missD:(document.querySelector('#flowhd .acs-miss b')||{}).textContent,
   made:document.querySelectorAll('#flowside [data-act="save"],#flowside #ritwhen').length}));
  /* SV17: the tracker's New ritual press lived in Due today and went with it.
     The builder has been the left column's resting state since SV16, so the
     press opened a thing that was already open; the person with nothing
     active finds the builder where it always is, and the tracker offers no
     second way to it */
  ok(e0.due===''&&e0.miss===0&&!e0.add&&e0.built&&!e0.away&&e0.streak==='–'&&e0.missD==='–'&&e0.made===0,
   'FT8: with nothing active the builder is open in the left column, the tracker offers no second press to it and no second builder, and a zero streak is the house dash (round J13, COPY.md), not a bare 0, '+JSON.stringify(e0));
  ok(await pg.evaluate(()=>S.tab===TAB.RITUAL&&!!document.querySelector('#lcol #ritwhen')),
   'FT8: the builder is on the page with no press, because there is nowhere to go');

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
    keptDays:new Set(done.map(x=>x[1])).size, today,
    /* SV19: the strip's Missed is the dashed cubes, a day in the thirty that
       a plan covered and on which nothing at all was marked done, worked out
       here from the plans and the days and not from the page */
    missDays:(()=>{let n=0; for(let d=today-29;d<today;d++){
      const due=[A,B,C].some(p=>{const st=Math.floor((new Date(p.from).getTime()-off)/DAY); return d>=st&&(!p.on||p.on.indexOf(wd(d))>=0);});
      if(due&&!done.some(x=>x[1]===d))n++;} return n;})()};});
  await wait(500);
  ok(seed.ok1,'FT7: the seed was written through the store and the record');
  const rd=await pg.evaluate(()=>{
   const strip=document.querySelector('#flowhd .acs-row');
   const missN=+((strip&&strip.querySelector('.acs-miss b')||{}).textContent||'').replace(/\D+/g,'')||0;
   const dashed=document.querySelectorAll('#flowside .rv-loopw .rv-cb-miss').length;
   const tipN=(strip&&strip.querySelector('.acs-streak')||{getAttribute:()=>''}).getAttribute('data-tip-n')||'';
   /* SV17: what is due today is today's column of the week, a sash a ritual,
      named by its accessible name and data-nm, and a heavy day's rest on its
      +N, data-more */
   const now=document.querySelector('#rit .rv-week .rv-wd1.rv-now');
   const due=now?[...now.querySelectorAll('button.rv-wch[data-nm]')].map(b=>({nm:b.getAttribute('data-nm'), st:b.className.match(/rv-wch-(\w+)/)[1]}))
    .concat([...now.querySelectorAll('.rv-wmore')].flatMap(m=>m.getAttribute('data-more').split(';').map(x=>({nm:x.split('|')[0], st:x.split('|')[1]})))):[];
   return {missN, dashed, tipN, cards:document.querySelectorAll('.rv-miss,.rv-done,.rv-marks').length, due,
    streak:+((document.querySelector('#flowhd .acs-streak b')||{}).textContent||'').replace(/\D+/g,''),
    ladder:ladderRead(CURP,Date.now()).streak.run,
    both:document.getElementById('flowrail').innerText+' '+document.getElementById('rit').innerText,
    /* ROUND QS: a percent lives in one place, the pill of a percent complete
       badge (FT25). Everything else is read with the pills taken out. */
    bare:[document.getElementById('flowrail'),document.getElementById('rit')].map(e=>{const c=e.cloneNode(true);
     c.querySelectorAll('.crb-v,.cr .v').forEach(v=>v.remove()); return c.innerText||c.textContent;}).join(' '),
    pills:[...document.querySelectorAll('#flowrail .crb-v,#rit .crb-v,#rit .cr .v')].map(v=>v.textContent)};});
  ok(rd.missN===seed.missDays&&rd.dashed===seed.missDays&&seed.missDays>0,
   'FT7: the strip reads '+seed.missDays+' days missed, worked out from the days and not from the page, and that is the number of dashed cubes under it, '+JSON.stringify({strip:rd.missN,dashed:rd.dashed}));
  ok(rd.cards===0,'FT7: there is no Done, Missed or Marks card anywhere on the page, '+rd.cards);
  ok(rd.due.length===2&&rd.due.every(d=>d.nm!==seed.names.rc),
   'FT7: today\'s column of the week carries the two rituals whose day it is and not the one kept on another weekday, '+JSON.stringify(rd.due));
  ok(rd.streak===rd.ladder,'FT7: the streak is the ladder\'s own, '+rd.streak+' against '+rd.ladder);
  ok(new RegExp('Kept\\|'+seed.keptDays+' days?').test(rd.tipN)&&/Best\|/.test(rd.tipN),
   'FT7: Kept is the count of days with something done, '+seed.keptDays+', on the streak\'s press beside Best, got '+JSON.stringify(rd.tipN));
  ok(!/%|\bscore\b|\bpercent\b(?! complete)|\brate\b/i.test(rd.bare)&&!/\bscore\b|\brate\b/i.test(rd.both)&&rd.pills.every(t=>/^(\d+%?|\u2013)$/.test(t)),
   'FT7: no score and no rate anywhere on the Flow page, and a percent only in a badge pill (FT25), '+JSON.stringify(rd.pills)
   +' '+JSON.stringify((rd.bare.match(/.{0,40}(%|\bscore\b|\bpercent\b(?! complete)|\brate\b).{0,40}/gi)||[]).slice(0,4)));

  /* FT14, the unpack rule: each heading carries its meaning in the same place */
  const mean=await pg.evaluate(()=>{
   const out={};
   /* History open, SV19, so the Record and the rituals it holds are read too */
   RIT.histOpen=true; ritRender();
   const first=document.querySelector('#flowside .rv-loopw');
   out._month=first?first.querySelector('.rv-mean').textContent.length:0;
   document.querySelectorAll('#flowside .rv-sec,#rit .rv-sec').forEach(s=>{
    const h=(s.querySelector('.rv-h')||{}).textContent, m=s.querySelector('.rv-mean');
    out[h]=m?m.textContent.length:0;});
   RIT.histOpen=false; ritRender();
   return out;});
  /* Goals and its sentence went with its three views, SV16. Week and Today
     are words a person had before they opened the product and carry no line,
     on his "get rid of all the second third tier text"; what the week's fills
     mean is its key, which is in the same place (FT34). The two cards that
     moved to the right menu took their sentences with them. */
  /* SV19: Done and Missed are gone, Ritual to avatar is Avatar, History's
     cards are headed Rituals, and the thirty days are headed by their month */
  ok(['_month','Rituals','Record','Success over time','Avatar','Ongoing goal'].every(h=>mean[h]>30),
   'FT14: the thirty days, Rituals, Record, Success over time, Avatar and Ongoing goal each carry a sentence saying what they mean, '+JSON.stringify(mean));

  /* FT9: a mark is one press, through the one writer, and it says so. SV17:
     the press that was Due today's ring is the Done ring in today's sash's
     sheet, the same ritLog and the same writer, and the sheet redraws from
     the record so the ring shows what was kept */
  const mk=await pg.evaluate(async()=>{
   const nm=ritName(ritPlans().find(p=>p.id==='rb').steps);
   const sash=()=>document.querySelector('#rit .rv-wd1.rv-now button.rv-wch[data-nm="'+CSS.escape(nm)+'"]');
   sash().click(); await new Promise(r=>setTimeout(r,150));
   const pressB=()=>document.querySelector('#sheet-card [data-sh="log"][data-id="rb"]');
   const n0=CURP.rituals.length, st=()=>(document.getElementById('status')||{}).textContent||'';
   const before=pressB().getAttribute('aria-pressed');
   pressB().click(); await new Promise(r=>setTimeout(r,200));
   const afterOn={pressed:pressB().getAttribute('aria-pressed'), n:CURP.rituals.length, said:st(), sash:sash().className,
    open:!document.getElementById('sheet').hidden};
   pressB().click(); await new Promise(r=>setTimeout(r,200));
   const afterOff={pressed:pressB().getAttribute('aria-pressed'), n:CURP.rituals.length, said:st(), sash:sash().className};
   sheetShut();
   return {before,n0,afterOn,afterOff};});
  ok(mk.before==='false'&&mk.afterOn.pressed==='true'&&mk.afterOn.n===mk.n0+1&&/^Done/.test(mk.afterOn.said)&&/rv-wch-done/.test(mk.afterOn.sash)&&mk.afterOn.open,
   'FT9: the Done ring in today\'s sash\'s sheet marks the day, adds one entry, says Done through status, fills the sash and keeps the sheet open, '+JSON.stringify(mk));
  ok(mk.afterOff.pressed==='false'&&mk.afterOff.n===mk.n0&&/Taken off/.test(mk.afterOff.said)&&/rv-wch-plan/.test(mk.afterOff.sash),
   'FT9: the same press takes it off again and says so, '+JSON.stringify(mk.afterOff));
  const bad=await pg.evaluate(async()=>{
   const was=window.pSave, n0=JSON.stringify(CURP.rituals);
   window.pSave=function(){throw new Error('disk full');};
   const nm=ritName(ritPlans().find(p=>p.id==='rb').steps);
   document.querySelector('#rit .rv-wd1.rv-now button.rv-wch[data-nm="'+CSS.escape(nm)+'"]').click(); await new Promise(r=>setTimeout(r,150));
   document.querySelector('#sheet-card [data-sh="log"][data-id="rb"]').click(); await new Promise(r=>setTimeout(r,200));
   window.pSave=was;
   const out={said:(document.getElementById('status')||{}).textContent||'', kept:JSON.stringify(CURP.rituals)===n0,
    pressed:document.querySelector('#sheet-card [data-sh="log"][data-id="rb"]').getAttribute('aria-pressed')};
   sheetShut(); return out;});
  ok(/Could not save/.test(bad.said)&&bad.kept&&bad.pressed==='false',
   'FT9: a save that fails says so through status, keeps nothing and the ring stays open, '+JSON.stringify(bad));
  /* the same press on a worked example is refused by name and never claims success */
  const ex=await pg.evaluate(async()=>{
   loadP(PEOPLE.findIndex(p=>!p.you)); setTab(TAB.RITUAL); await new Promise(r=>setTimeout(r,300));
   const had=document.querySelectorAll('#rit .rv-week button.rv-wch').length;
   const note=(document.querySelector('#rit .rv-note')||{}).textContent||'';
   /* said once on the page and not once per column: the centre carries it */
   const twice=document.querySelectorAll('.rv-note').length;
   return {note, had, twice};});
  /* SV19, his words: "Get rid of Ana is worked example, so nothing is
     saved." The line is held gone from every column; the refusal below, at
     the moment of a write, is where a worked example still says so */
  const exText=await pg.evaluate(()=>['rit','flowleft','flowside'].map(id=>document.getElementById(id).innerText).join(' '));
  ok(ex.note===''&&ex.twice===0&&!/worked example/.test(exText),
   'FT9: a worked example prints no line saying nothing is saved, in any column, '+JSON.stringify(ex));
  const ex2=await pg.evaluate(async()=>{
   const ok0=ritWrite(function(){return [];},'Done.');
   return {ok0, said:(document.getElementById('status')||{}).textContent||''};});
  ok(ex2.ok0===false&&/worked example/.test(ex2.said),'FT9: a write on a worked example is refused by name, '+JSON.stringify(ex2));

  /* FT9 again, the edit route: Edit on a missed ritual opens it in the left
     column without leaving the page, which is the whole point of the merge */
  await pg.evaluate(()=>{loadP(0); setTab(TAB.RITUAL);}); await wait(400);
  const ed=await pg.evaluate(async()=>{
   /* SV19: the Missed card and its Edit are gone, so Edit is reached where it
      always also was, on the ritual's own row in the centre */
   const o=document.querySelector('#rit .rv-act [data-act="exp"]'); if(!o)return {none:true};
   const id=o.getAttribute('data-id'); o.click(); await new Promise(r=>setTimeout(r,200));
   const b=document.querySelector('#rit .rv-act [data-act="edit"][data-id="'+id+'"]'); if(!b)return {none:true,id};
   b.click(); await new Promise(r=>setTimeout(r,300));
   return {tab:S.tab===TAB.RITUAL, edit:RIT.edit===id, builder:!!document.querySelector('#lcol .rv-build'),
    build:document.body.classList.contains('ritbuild'),
    head:(document.querySelector('#lcol .rv-build .rv-h')||{}).textContent};});
  ok(!ed.none&&ed.tab&&ed.edit&&ed.builder&&ed.build&&ed.head==='Edit',
   'FT9: Edit on a ritual\'s row opens that ritual in the left column and never leaves the page, '+JSON.stringify(ed));

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
   const now=document.querySelector('#rit .rv-week .rv-wd1.rv-now');
   const due=now?[...now.querySelectorAll('button.rv-wch[data-nm]')].map(x=>x.getAttribute('data-nm'))
    .concat([...now.querySelectorAll('.rv-wmore')].flatMap(m=>m.getAttribute('data-more').split(';').map(x=>x.split('|')[0]))):[];
   const act=[...document.querySelectorAll('#rit .rv-item .rv-sub')].map(x=>x.textContent).filter(t=>/Toward Buddha/.test(t)).length;
   return {label, plan:!!plan, said, name:plan?ritName(plan.steps):'', due, act};});
  ok(!cmp.noRow&&cmp.label==='Add to my ritual'&&cmp.plan&&/^Added/.test(cmp.said),
   'FT10: Add to my ritual on the Compass teacher panel still writes the plan and says Added, '+JSON.stringify(cmp));
  ok(cmp.act===1&&cmp.due.indexOf(cmp.name)>=0,
   'FT10: the added ritual is on the centre\'s Active list and in today\'s column of the week, on one screen, '+JSON.stringify([cmp.act,cmp.due,cmp.name]));
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
  const pg=await newPage({viewport:{width:1600,height:1000}});
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
  /* the card is in the right menu since SV16, his "move that to the right
     menu"; what it reads and prints is unchanged, so only where it is looked
     for moved */
  const av=await pg.evaluate(()=>{const c=document.querySelector('#flowside .rv-c-av'); if(!c)return {none:true};
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
   'FT18: Avatar prints the '+seed.keptDays+' distinct days kept, draws three cycles and ticks only a full one, '+JSON.stringify(av));
  const heart=(av.seats||[]).filter(x=>/at the heart/.test(x.n))[0], solar=(av.seats||[]).filter(x=>/solar plexus/.test(x.n))[0];
  ok(heart&&/ Fed by Controlled Breath\.$/.test(heart.f)&&heart.fedDot&&solar&&/No ritual at this seat yet/.test(solar.f)&&!solar.fedDot,
   'FT18: each avatar seat says on its press the active ritual kept there, or that none is, and its dot is filled only when fed, '+JSON.stringify(av.seats));
  const wantHero=av.overall==null?'\u2013':(Math.round(av.overall*100)?Math.round(av.overall*100)+'%':'\u2013');
  ok(av.hero===wantHero&&av.heroTip&&(av.seats||[]).every(x=>x.glyph),
   'FT18: the hero is the Avatar page\'s own percent complete, '+wantHero+', with its meaning on the press, and every seat is a badge with a mark, '+JSON.stringify([av.hero,av.overall]));

  /* ---- FT19 ---- */
  /* SV19: the goal is back in the centre, his "Ongoing goals should be in the
     center", so it is looked for there and held absent from the right menu */
  const goal=await pg.evaluate(()=>{const c=document.querySelector('#rit .rv-c-goal');
   return {be:(c.querySelector('.rv-why-be')||{}).textContent||'', held:(c.querySelector('.rv-why-p b')||{}).textContent||'',
    seat:(c.querySelector('.rv-why-p')||{}).textContent||'', btns:c.querySelectorAll('[data-act="why"]').length,
    next:(c.querySelector('.rv-nxt b')||{}).textContent||'', railNext:!!document.querySelector('#flowside .rv-next,#flowside .rv-c-goal'),
    ladder:(ladderRead(CURP,Date.now()).next||{}).nm};});
  ok(/^"I feel safe in my own body"$/.test(goal.be)&&(seed.heldBy.Root||[]).indexOf(goal.held)>=0&&/the root/.test(goal.seat)&&goal.btns===2,
   'FT19: the goal quotes the avatar line whose seat holds a place, names a place held there and offers the schedule once, '+JSON.stringify(goal));
  ok(goal.next&&goal.next===goal.ladder&&!goal.railNext,'FT19: the next mark is on the goal card in the centre, and neither is in the right column, '+JSON.stringify(goal));
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
   k:x.querySelector('.rv-okk').textContent, f:(x.querySelector('.rv-okf')||{}).textContent||''})));
  const qa=okc.filter(x=>x.nm==='Noting Meditation')[0], qc=okc.filter(x=>x.nm==='Candle Visualisation')[0];
  ok(qa&&qa.k==='Kept '+seed.qaKept+' days, missed '+seed.qaMissed+'.'&&qa.f==='Held places: 17 when it started, '+seed.now+' now.',
   'FT20: Did it work reads kept and missed off the record and the held places off the last reading before the start, '+JSON.stringify(qa));
  /* SV19: with no reading before the start the row prints nothing, his third
     tier ruling, rather than the same sentence under every such row */
  ok(qc&&qc.f===''&&!okc.some(x=>x.nm==='Controlled Breath'),
   'FT20: with no reading before the start the row says nothing more, and a ritual on its second day is not read yet, '+JSON.stringify(okc));
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
   /* the weekday and the date, worked out here: Sunday is column one since
      SV24, his words "start with Sunday" */
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const wd=d=>new Date(d*DAY).getUTCDay(), date=d=>new Date(d*DAY+off+12*3600000).getDate();
   const dates=cb.map(e=>+(e.querySelector('.rv-cbd')||{textContent:''}).textContent.replace(/^\D+/,''));
   const want=[]; for(let d=today-29;d<=today;d++)want.push(date(d));
   return {n:cb.length, done:cb.filter(e=>e.classList.contains('rv-cb-done')).length,
    nowAt:now?pos(now):null, wantCol:wd(today)+1, firstCol:cb.length?pos(cb[0])[1]:null, wantFirst:wd(today-29)+1,
    ahead:ah.length, wantAhead:6-wd(today), heads:[...s.querySelectorAll('.rv-cbw')].map(x=>x.textContent).join(''),
    datesOk:JSON.stringify(dates)===JSON.stringify(want), tips:cb.every(e=>e.hasAttribute('data-tip')),
    /* SV19: the month is the card's heading, where "Thirty day loop" was, and
       the figures over the cubes went to the streak strip (FT36, FT7) */
    mo:(s.querySelector(':scope>.rv-hd .rv-h')||{}).textContent||'', loopWord:/Thirty day loop/i.test(s.textContent),
    figs:s.querySelectorAll('.rv-cbf,.rv-cbk,.rv-cbmo').length,
    oldRing:s.querySelectorAll('path.rv-ld').length};});
  /* the expected count of done cubes is worked out from the seed's days: a day
     in the thirty with anything marked done */
  const doneDays=seed.keptDays;
  ok(lp.n===30&&lp.done===doneDays&&lp.nowAt&&lp.nowAt[1]===lp.wantCol&&lp.firstCol===lp.wantFirst&&lp.heads==='SMTWTFS'
    &&lp.datesOk&&lp.ahead===lp.wantAhead&&/\d{4}$/.test(lp.mo)&&lp.tips&&lp.oldRing===0,
   'FT21: thirty days as a calendar, Sunday first under the weekday letters, each cube its own date, today in its weekday column, the rest of the week ahead, the '+doneDays+' kept days solid, '+JSON.stringify(lp));
  ok(!lp.loopWord&&lp.figs===0,
   'FT21: the card no longer says Thirty day loop and carries no figures over the cubes, '+JSON.stringify([lp.mo,lp.loopWord,lp.figs]));

  /* ---- FT25: a ritual's badge, its percent complete worked out here ---- */
  /* Today is first sight for these rings since round RB, so they tween in
     from empty (crMotion) and are read once they have landed */
  const pc=await pg.evaluate(async()=>{ritRender(); await new Promise(r=>setTimeout(r,1500)); const rows=[...document.querySelectorAll('#rit .rv-act .rv-item')];
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
    /* SV17: the days kept, a count, never the percent it used to print and
       never kept of set, his CO-05. A zero is the house dash. */
    out[p.id]=due?(kept?String(kept):'\u2013'):null;});
   return out;});
  const spans=pc.filter(x=>want[x.id]!=null);
  ok(spans.length>0&&spans.every(x=>x.pill===want[x.id]&&/The days you have kept it/.test(x.tip)&&!/percent/i.test(x.tip))&&/The days you have kept it/.test(by.qb.tip)&&by.qa&&by.qa.pill===String(seed.qaKept)
   &&by.qd&&by.qd.pill==='\u2013'&&pc.every(x=>x.glyph&&x.word===0),
   'FT25: a span ritual reads its days kept, never a share and never kept of set, '+JSON.stringify(want)+', one with no end its days kept, none kept a dash, each with its seat mark and no seat word, '+JSON.stringify(pc));
  /* the ring fills no share now: a badge's arc is the seat's mark and an empty
     track, on every row, which is what the no end branch always drew */
  const ring=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-act .rv-pc .crb-a circle:nth-of-type(2)')]
   .map(c=>{const C=2*Math.PI*+c.getAttribute('r'); return Math.abs((+c.getAttribute('stroke-dashoffset')||0)-C)<0.5||c.getAttribute('stroke-dasharray')===null;}));
  ok(ring.length>0&&ring.every(Boolean),'FT25: no ritual badge fills its ring to a share, '+JSON.stringify(ring));

  /* ---- FT26: the tell is on the press ---- */
  const tell=await pg.evaluate(()=>{const out=[];
   document.querySelectorAll('#rit .rv-sec,#flowside .rv-sec,#flowleft .rv-sec').forEach(sec=>{
    const h=sec.querySelector(':scope>.rv-hd .rv-h'), m=sec.querySelector(':scope>.rv-mean'); if(!h||!m)return;
    out.push({h:h.textContent, tip:h.getAttribute('data-tip')===m.textContent, focus:h.getAttribute('tabindex')==='0',
     shown:getComputedStyle(m).display!=='none'});});
   return out;});
  /* the parts are named and not counted, SV19: this read tell.length>=8, a
     count typed into a gate, and the round's cuts (Done, Missed, the
     History card at rest) took the page under it while every part still
     passed. The parts that carry a sentence at rest are listed instead, and
     the thirty days are read by their month heading */
  const tellNames=tell.map(x=>x.h);
  ok(['Called for','Ongoing goal','Did it work','Success over time','Avatar'].every(h=>tellNames.indexOf(h)>=0)
    &&tellNames.some(h=>/^[A-Z][a-z]+( to [A-Z][a-z]+)? \d{4}$/.test(h))&&tell.every(x=>x.tip&&x.focus&&!x.shown),
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
    next:!!s.querySelector('.rv-next'), first:md.first, word:/\bMarks\b/.test(document.getElementById('flowside').innerText)};});
  /* SV19, his words: "Get rid of the section that says marks." The shelf is
     gone; the marks earned in the thirty are still pinned on their day */
  ok(mk2.earned.length>0&&mk2.shelf===0&&mk2.pins===mk2.inWin&&mk2.inWin>0&&!mk2.next
    &&!mk2.word,
   'FT28: there is no Marks shelf, the marks earned in the thirty are pinned on their day, and no next mark here, '+JSON.stringify(mk2));

  /* ---- FT22 ---- */
  const hi=await pg.evaluate(async()=>{RIT.histOpen=true; ritRender(); const cards=()=>[...document.querySelectorAll('#flowside .rv-hc')].map(c=>({nm:c.querySelector('.rv-hcn').textContent,
    act:!!c.querySelector('.rv-tag'), rot:!!c.querySelector('[data-act="rot"]')}));
   const c0=cards(); const listAgain=(()=>{RIT.view='list'; ritRender(); const t=document.querySelector('#flowside .rv-rec').innerText;
    const a=document.querySelectorAll('#flowside .rv-rec [data-act="again"]').length; RIT.view='month'; ritRender(); return {ended:/\bEnded\b/.test(t), a};})();
   const b=[...document.querySelectorAll('#flowside .rv-hc')].filter(c=>c.querySelector('.rv-hcn').textContent==='Candle Visualisation')[0].querySelector('[data-act="rot"]');
   b.click(); await new Promise(r=>setTimeout(r,300));
   return {c0, listAgain, said:(document.getElementById('status')||{}).textContent||'', c1:cards(),
    active:ritPlans().some(p=>ritName(p.steps)==='Candle Visualisation'&&ritActive(p,ritToday0())&&p.days===7&&p.band==='Crown'),
    stillOpen:RIT.histOpen&&!!document.querySelector('#flowside .rv-rec'), _:(RIT.histOpen=false,ritRender(),0)};});
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
  const pg=await newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
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
  const pg=await newPage({viewport:{width:1600,height:1000}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const fresh=()=>pg.evaluate(who=>{loadP(who==null?0:PEOPLE.findIndex(x=>x.nm===who)); CURP.rituals=[]; ritPlanPut([]);
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();},null);
  await fresh(); await pg.waitForTimeout(300);
  /* SV16: the builder is open with no press, his "default state to be open
     and accessible", and on a blank profile the list says nothing is called
     for. The narrative director's ruling: the old field card, "Nothing is
     read yet, so this is the lightest place to start.", sat under a heading
     it contradicts, so it is gone from the list and that practice is the
     builder's first tile, without the words called for. */
  const first=await pg.evaluate(()=>{const L=document.getElementById('lcol'), s=L.querySelector('.rv-sug'), n=L.querySelector('.rv-build');
   const called=ritRead().c.called, t=L.querySelector('.rv-tile');
   return {building:document.body.classList.contains('ritbuild'), builder:!!n, sug:!!s,
    head:s?(s.querySelector('.rv-h')||{}).textContent:'', empty:s?(s.querySelector('.rv-empty')||{}).textContent:'',
    cards:[...L.querySelectorAll('.rv-sg1 .rv-sgn')].map(x=>x.textContent), called:called&&called.nm,
    tile:t?(t.querySelector('.rv-tn')||{}).textContent:'', tileSays:t?(t.querySelector('.rv-tm')||{}).textContent:'',
    below:!!(s&&n)&&s.getBoundingClientRect().top>=n.getBoundingClientRect().bottom-1};});
  ok(!first.building&&first.builder&&first.sug&&first.head==='Called for'&&first.cards.length===0
    &&first.empty==='Nothing called for yet. Record a story to fill it.'&&first.tile===first.called&&!/called for/.test(first.tileSays)&&first.below,
   'FT24: a first visit with nothing read shows the builder open, the lightest practice as its first tile and not called for, and Called for under it with nothing in it, '+JSON.stringify(first));
  /* the centre's own New ritual is for a folded left column only: open, the
     left column is the builder itself and carries no press at all */
  const dup=await pg.evaluate(async()=>{
   const shown=sel=>[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0;}).length;
   const open={left:shown('#lcol [data-act="add"]'), centre:shown('#rit [data-act="add"]')};
   document.getElementById('lfold').click(); await new Promise(r=>setTimeout(r,200));
   const folded={left:shown('#lcol [data-act="add"]'), centre:shown('#rit [data-act="add"]')};
   document.getElementById('lfold').click(); await new Promise(r=>setTimeout(r,200));
   return {open, folded};});
  ok(dup.open.left===0&&dup.open.centre===0&&dup.folded.centre===1,
   'FT24: with the left column open the builder is there and no New ritual press is drawn, and folded the centre carries it, '+JSON.stringify(dup));
  /* a step picked makes Cancel appear, and Cancel empties the builder and
     leaves it open: it is the column's resting state and has no shut one */
  const open=await pg.evaluate(async()=>{const L=document.getElementById('lcol');
   const before=!!L.querySelector('[data-act="cancel"]');
   const t=L.querySelector('.rv-tile[data-act="pick"]'); if(t)t.click(); await new Promise(r=>setTimeout(r,250));
   const picked=ritDraft().map(k=>ritPr(k).nm);
   /* and the fields under the steps, which Cancel must empty as well: a
      Cancel that left a How long or a When behind would stay on screen */
   const one=L.querySelector('[data-act="span"][data-d="1"]'); if(one)one.click(); await new Promise(r=>setTimeout(r,200));
   RIT.when='after the kettle'; ritRender();
   const c=L.querySelector('[data-act="cancel"]'), out={before, picked, cancel:!!c, span:RIT.days};
   if(c){c.click(); await new Promise(r=>setTimeout(r,250));}
   out.after={open:!!L.querySelector('.rv-build'), draft:ritDraft().length, sug:!!L.querySelector('.rv-sug'),
    days:RIT.days, when:RIT.when, gone:!L.querySelector('[data-act="cancel"]')};
   return out;});
  ok(!open.before&&open.picked.length===1&&open.cancel&&open.span===1&&open.after.open&&open.after.draft===0&&open.after.sug
    &&open.after.days===7&&open.after.when===''&&open.after.gone,
   'FT24: Cancel is drawn only once the builder holds something, and it empties the builder and leaves it open, '+JSON.stringify(open));
  /* on a record whose list is longer, Called for stays under the open
     builder, and a practice picked in the builder is not offered again under
     it unless the card is a release schedule, which is a different choice */
  await pg.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();});
  await pg.waitForTimeout(250);
  const jm=await pg.evaluate(async()=>{const L=document.getElementById('lcol');
   const cards=[...L.querySelectorAll('.rv-sg1')].map(c=>({nm:c.querySelector('.rv-sgn').textContent,
    tags:[...c.querySelectorAll('.rv-tg')].map(t=>t.textContent).join('/'), why:[...c.querySelectorAll('.rv-sgw li')].map(l=>l.textContent)}));
   const rel=(RIT.sug||[]).map(x=>x.rel!=null);
   const b=L.querySelector('.rv-build'), s=L.querySelector('.rv-sug');
   const under=!!(b&&s)&&s.getBoundingClientRect().top>=b.getBoundingClientRect().bottom-1;
   const t=L.querySelector('.rv-tile[data-act="pick"]'); if(t)t.click(); await new Promise(r=>setTimeout(r,250));
   const twice=(RIT.sug||[]).filter(x=>x.rel==null&&RIT.sel[x.k]).map(x=>x.p.nm);
   RIT.sel={}; RIT.order=[]; ritRender();
   return {cards, rel, underBuilder:under, twice};});
  const pairs=jm.cards.map(c=>c.nm+'@'+c.tags), both=jm.cards.filter(c=>c.why.length>1);
  ok(jm.cards.length>1&&new Set(pairs).size===pairs.length&&jm.underBuilder&&jm.twice.length===0,
   'FT24: no practice is offered twice at one seat or a second time under the builder that holds it, and Called for stays under the open builder, '+JSON.stringify(jm));
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
  const pg=await newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const top=()=>pg.evaluate(()=>{const t=id=>Math.round(document.getElementById(id).getBoundingClientRect().top);
   return {lcol:t('lcol'), rit:t('rit'), rcol:t('rcol'), sug:!!document.querySelector('#lcol .rv-sug')};});
  await pg.evaluate(()=>{loadP(0); CURP.rituals=[]; ritPlanPut([]); RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();});
  await pg.waitForTimeout(400);
  const none=await top();
  await pg.evaluate(()=>{ritStartPlan({steps:[PRACTICE.filter(p=>!p.tc)[0].k],band:'',track:'',days:7,when:'',where:''},'Started.');
   RIT.sel={}; RIT.order=[]; RIT.add=false; ritRender();});
  await pg.waitForTimeout(400);
  const one=await top();
  await pg.evaluate(()=>{ritWrite(function(){CURP.rituals=[];return [];},null);});
  ok(none.sug&&none.lcol<none.rit&&none.lcol<none.rcol&&one.rit<one.rcol&&one.rcol<one.lcol,
   'FT24: @390 with nothing active the builder and Called for come first, and with one running the order is the ritual, the tracker, then new, '+JSON.stringify({none,one}));
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
  const pg=await newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const seed=await pg.evaluate(()=>{
   loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]);
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
   const today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7;
   /* THE THIRD STORY IS WHAT GIVES FT30 ITS CHALLENGES, AND IT USED TO BE A
      LEAK. With only the first two, the challenges here were the Procrastinator
      and the Innocent, drawn on the root's Victimhood at 3.41. That charge was
      Sad, and nothing at the root says sad: it came from "abandoned", a heart
      word, through the one wanted map parseStory built for the whole text.
      engine/sniff.js now reads each seat against its own words (the round 1
      exhaustion fix), so the root's terrified, panic and cannot breathe land
      on four Fear addresses at 2.83 each, compute() draws a SAB33 saboteur
      only on an address at 3 or more, and the two stories alone honestly name
      none. The SAB33 levels still fit both, so the gap is the per address
      floor, which this branch did not touch. A third root fear story, in his
      own register, carries the root over that floor on its own words, and the
      assertion below still asks for at least one challenge drawn: it was not
      loosened to accept the empty state. */
   ['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
    'I feel worthless and ashamed, I am never enough, I am a failure.',
    'I am scared all the time and my legs shake.'].forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
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
   RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; RIT.span='1m'; setTab(TAB.RITUAL); ritRender();
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
    /* a practice with no line prints none: the Truth Check's was cut on
       4 November (engine/data/practice.js), and an empty box is not a line */
    return {nm:p.nm, desc:p.d?(c.querySelector('.rv-sgd')||{}).textContent===p.d:!c.querySelector('.rv-sgd'),
     toward:cf?chips.indexOf('Toward '+cf.opp.toLowerCase())>=0:!chips.some(t=>/^Toward/.test(t)),
     rec:chips.indexOf(days?'Kept '+days+(days===1?' day':' days'):'Not tried yet')>=0,
     tips:[...c.querySelectorAll('.rv-sgc')].every(e=>(e.getAttribute('data-tip')||'').length>20),
     add:btn('[data-act="sug"]'), save:btn('[data-act="sug-save"]'), drop:btn('[data-act="sug-x"]'),
     /* SV16, his words, each: "2 minutes", "Add to practice", "Save" */
     words:[(c.querySelector('.rv-sgm')||{}).textContent, (c.querySelector('[data-act="sug"]')||{}).textContent,
      (c.querySelector('[data-act="sug-save"]')||{}).textContent], min:p.min,
     /* and flat: one opaque fill, nothing outlined, his "flat solid color
        background". Read off the computed style, not the stylesheet */
     flat:(()=>{const cs=getComputedStyle(c), bg=cs.backgroundColor, a=/rgba\([^)]*,\s*([\d.]+)\)$/.exec(bg);
      return (!a||+a[1]===1)&&!/gradient/.test(cs.backgroundImage)&&(cs.borderTopColor==='rgba(0, 0, 0, 0)'||cs.borderTopWidth==='0px')&&cs.boxShadow==='none';})(),
     noRate:!/%|\brate\b|\bscore\b/i.test(c.innerText)};});});
  ok(sg.length>0&&sg.every(c=>c.desc&&c.toward&&c.rec&&c.tips&&c.noRate),
   'FT29: '+tag+'each suggestion shows what the practice is, what it is for when a held place gives it one, and your own record with it, counted here, with no rate, '+JSON.stringify(sg));
  ok(sg.length>0&&sg.every(c=>JSON.stringify(c.words)===JSON.stringify([c.min+(c.min===1?' minute':' minutes'),'Add to practice','Save'])&&c.flat),
   'FT29: '+tag+'each card says its minutes as minutes, Add to practice and Save, and is one flat opaque fill with nothing outlined, '+JSON.stringify(sg.map(c=>[c.words,c.flat])));
  ok(sg.every(c=>[c.add,c.save,c.drop].every(b=>b&&b[0]>=44&&b[1]>=44)),
   'FT29: '+tag+'every card carries Add to practice, Save and Dismiss, each at least 44 by 44, '+JSON.stringify(sg.map(c=>[c.add,c.save,c.drop])));
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
   out.save={said:said(), gone:names().indexOf(nm0)<0, shelf:shelf(), stored:JSON.parse(STORE.get('atuned-ritual-more'))[CURP.id].save.length,
    head:(L.querySelector('.rv-saved .rv-h')||{}).textContent};
   ritRender(); out.save.kept=shelf().indexOf(nm0)>=0;
   const r0=CURP.rituals.length; L.querySelector('[data-act="sv-add"][data-i="0"]').click(); await w();
   out.add={said:said(), plan:ritPlans().some(p=>ritName(p.steps)===nm0&&ritActive(p,ritToday0())&&p.days===7), shelf:shelf(), r:CURP.rituals.length-r0};
   return out;});
  ok(/^Saved\. .+ waits under Saved until you add it\.$/.test(ans.save.said)&&ans.save.gone&&ans.save.kept&&ans.save.stored===1
    &&ans.save.head==='Saved',
   'FT29: '+tag+'Save takes it off Called for, puts it under Saved, keeps it across a repaint, and says so, '+JSON.stringify(ans.save));
  ok(ans.drop&&ans.drop.gone&&ans.drop.back&&ans.drop.again&&ans.drop.all&&ans.drop.allBack,
   'FT29: '+tag+'Dismiss takes it off with Put back in the same place, and Bring back dismissed returns every one, '+JSON.stringify(ans.drop));
  ok(/^(Started|Set)\./.test(ans.add.said)&&ans.add.plan&&ans.add.shelf.length===0,
   'FT29: '+tag+'Add from Saved starts it each day for a week and it leaves the shelf, '+JSON.stringify(ans.add));
  const we=await pg.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); setTab(TAB.RITUAL); ritRender();
   const b=document.querySelector('#flowleft [data-act="sug-save"]'); if(b)b.click();
   const r={said:(document.getElementById('status')||{}).textContent||'', btn:!!b};
   loadP(0); setTab(TAB.RITUAL); ritRender(); return r;});
  ok(we.btn&&/worked example, so nothing was saved/.test(we.said),'FT29: '+tag+'on a worked example the answer is refused by name, '+JSON.stringify(we));

  /* ---- FT30: the week, and Today under it ----
     SV16 took the switch off: the week is its own card at the top of the
     centre and Today is the card under it, carrying what the switch's Today
     carried. So there are no views to press, and the old This month went
     with them (its counts are Success over time's one month). */
  const gl=await pg.evaluate(()=>{ritRender(); const g=document.querySelector('#rit .rv-goals');
   const af=[...g.querySelectorAll('.rv-aff .rv-af1')].map(x=>x.querySelector('.rv-afq').textContent);
   const ch=[...g.querySelectorAll('.rv-chal .rv-af1')].map(x=>({nm:x.querySelector('.rv-chn').childNodes[0].textContent, act:x.querySelector('.rv-afq').textContent}));
   return {views:document.querySelectorAll('#rit [data-act="gview"]').length, head:(g.querySelector('.rv-h')||{}).textContent,
    week:!!document.querySelector('#rit .rv-six>.rv-week:first-child'),
    af, ch, pairs:CURP.avatar.pairs.map(p=>p.be).reverse()};});
  const wantAf=gl.pairs.map(b=>'"'+b+'"');
  /* the Active rows are held on all seven days in the loop below, not here,
     because here is one day and the rows turn on which day it is */
  ok(gl.views===0&&gl.head==='Today'&&gl.week&&gl.af.length===3
    &&JSON.stringify(gl.af.slice(0,2))===JSON.stringify(wantAf)&&gl.ch.length>=1,
   'FT30: '+tag+'the week is the centre\'s first card and Today is its own card under it with no view switch; Today holds three affirmations with your own avatar lines first, newest first, and the challenges, '+JSON.stringify(gl));
  const sd=await pg.evaluate(async()=>{const r0=CURP.rituals.length, k0=ladderRead(CURP,Date.now()).streak.run;
   const b=document.querySelector('#rit .rv-aff [data-act="said"]'); b.click(); await new Promise(r=>setTimeout(r,250));
   const on=document.querySelector('#rit .rv-aff [data-act="said"]').getAttribute('aria-pressed');
   const said=(document.getElementById('status')||{}).textContent||'';
   document.querySelector('#rit .rv-aff [data-act="said"]').click(); await new Promise(r=>setTimeout(r,250));
   return {on, said, off:document.querySelector('#rit .rv-aff [data-act="said"]').getAttribute('aria-pressed'),
    rit:CURP.rituals.length-r0, streak:ladderRead(CURP,Date.now()).streak.run-k0};});
  ok(sd.on==='true'&&/^Said\./.test(sd.said)&&sd.off==='false'&&sd.rit===0&&sd.streak===0,
   'FT30: '+tag+'an affirmation is marked said for today and taken off with the same press, and it is not a kept ritual day: the record and the streak do not move, '+JSON.stringify(sd));
  /* ---- FT30 ON EVERY DAY OF ONE WEEK ----
     The seed holds a ritual set for Tuesday, Thursday and Saturday, so Today's
     rows and This week's marks turn on the weekday, and asked on one day they
     hold that day only: this is the check that passed on a Thursday and
     failed on the Friday after. So the page's clock is walked through the
     frozen week, Monday 23 February to Sunday 1 March, across a month end,
     and both views are asked on all seven. The page's own weekday is read back
     beside this test's, so a clock that did not move the page fails here by
     name and does not pass seven times on one day. Then the clock is put back
     for the groups after. */
  const WDF=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], seen=[];
  for(let i=0;i<7;i++){
   await pg.clock.setSystemTime(new Date(AT.getFullYear(),AT.getMonth(),AT.getDate()+i,12));
   const d=await pg.evaluate(()=>{ritRender(); const g=document.querySelector('#rit .rv-goals');
    const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY), wd=(new Date(today*DAY).getUTCDay()+6)%7;
    /* EVERY ACTIVE RITUAL, AND NOT ONLY THE ONES DUE TODAY. This counted the
       rituals due today against every row drawn, so it failed on each day the
       Tuesday, Thursday and Saturday ritual is not set for, and the page was
       right: Today is the Active list (DESIGN-flow-tools.md FT30), and
       ritActiveBody (ui/ritual.js) draws every active ritual, the ones due
       today first and the rest under Other days, named by their days so
       nobody reads them as missed (round LT, "DUE IS NOT ACTIVE"). So active
       and due are both worked out here off the plans, and the rows are read
       in order with the Other days head where it sits. */
    const dk=t=>Math.floor((Date.parse(t)-off)/DAY);
    const run=ritPlans().filter(p=>!p.stop&&(!p.days||today<dk(p.from)+p.days));
    const set=p=>!p.on||p.on.indexOf(wd)>=0, nm=p=>ritName(p.steps);
    const due=run.filter(set).map(nm).sort(), rest=run.filter(p=>!set(p)).map(nm).sort();
    const seq=[...g.querySelectorAll('.rv-item .rv-nm, .rv-other')].map(e=>e.classList.contains('rv-other')?'|':e.textContent);
    const cut=seq.indexOf('|'), rows=g.querySelectorAll('.rv-item').length;
    const above=(cut<0?seq:seq.slice(0,cut)).sort(), below=(cut<0?[]:seq.slice(cut+1)).sort();
    /* SV16: the week is day columns, each carrying its rituals by name, so
       the Tuesday, Thursday and Saturday ritual is read as the days whose
       column holds it */
    /* SV24: the columns run Sunday first, so the week this day sits in starts
       on its Sunday, and the Sunday of the walk opens the next week. The
       stored weekday, wd and the page's ritWd, is still Monday 0 and is held
       to i above, because every saved plan's on list is written in it. */
    const col=(wd+1)%7, k=document.querySelector('#rit .rv-week .rv-wkg'), sun=today-col;
    const cols=[...k.querySelectorAll(':scope>.rv-wd1')];
    const want=[0,1,2,3,4,5,6].map(i=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]+new Date((sun+i)*DAY+off+12*3600000).getDate());
    /* SV17: a sash names its ritual in data-nm, and a heavy day's rest is on its +N */
    const names=c=>[...c.querySelectorAll('button.rv-wch[data-nm]')].map(b=>b.getAttribute('data-nm'))
     .concat([...c.querySelectorAll('.rv-wmore')].flatMap(m=>m.getAttribute('data-more').split(';').map(x=>x.split('|')[0])));
    const setOn=cols.map((c,i)=>names(c).some(n=>n==='Box Breathing')?i:-1).filter(i=>i>=0);
    return {page:new Date().toDateString(), pwd:ritWd(ritToday0()), wd, col, rows, run:run.length, due, rest, above, below,
     heads:cols.map(c=>c.querySelector('.rv-wdh').textContent), want, now:cols.findIndex(c=>c.classList.contains('rv-now')), setOn};});
   seen.push(d.page);
   ok(d.wd===i&&d.pwd===i,
    'FT30: '+tag+'the clock is on '+WDF[i]+' for the page and for this test alike, '+JSON.stringify({page:d.page,pwd:d.pwd,wd:d.wd}));
   ok(d.rows===d.run&&d.due.length>0&&JSON.stringify(d.above)===JSON.stringify(d.due)&&JSON.stringify(d.below)===JSON.stringify(d.rest),
    'FT30: '+tag+'on '+WDF[i]+' Today holds every active ritual, the ones due today first and the rest under Other days, '
    +JSON.stringify({page:d.page,rows:d.rows,run:d.run,due:d.due,rest:d.rest,above:d.above,below:d.below}));
   ok(JSON.stringify(d.heads)===JSON.stringify(d.want)&&d.now===d.col&&JSON.stringify(d.setOn)===JSON.stringify([2,4,6]),
    'FT30: '+tag+'on '+WDF[i]+' the week is a calendar week, Sunday first with each date and today marked, and a ritual set for Tuesday, Thursday and Saturday is under those three days and no other, '+JSON.stringify(d));
  }
  console.log('  FT30 '+tag+'the page read its clock as '+seen.join(', '));
  await pg.clock.setSystemTime(AT);

  /* ---- FT34, SV16: the week cycles, and every day carries its own rituals ----
     His words: "A weekly calendar. All 7 days. I can cycle through.
     Underneath it, every day shows me which rituals I need to do." Each week
     the arrows reach is read off the page and held against a count made here
     off the plans and the record directly, with its own copy of the coverage
     rule, so a page that drew the right shape with the wrong days fails. A
     day's ritual is its name and its state: done when the record holds it
     done, missed before today, planned today and ahead. Then the bounds: back
     stops at the week the record starts, forward at four weeks, This week is
     offered only while away and brings the week back, and leaving Flow and
     coming back opens on this week. */
  const cy=await pg.evaluate(async()=>{const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const wd=d=>(new Date(d*DAY).getUTCDay()+6)%7, dk=t=>Math.floor((Date.parse(t)-off)/DAY), w=()=>new Promise(r=>setTimeout(r,150));
   const plans=ritPlans(), nm=steps=>steps.map(k=>PRACTICE.find(p=>p.k===k).nm).join(', ');
   const covers=(p,d)=>{const s0=dk(p.from); if(d<s0)return false; if(p.on&&p.on.indexOf(wd(d))<0)return false; if(p.days&&d>=s0+p.days)return false; if(p.stop&&d>=dk(p.stop))return false; return true;};
   const want=d=>{const out=new Set(), seen=new Set();
    CURP.rituals.forEach(x=>{if(dk(x.t)!==d)return; const n=nm(x.steps); seen.add(n);
     out.add(n+'|'+(x.done!==false?'done':(d<today?'miss':'plan')));});
    plans.forEach(p=>{const n=nm(p.steps); if(seen.has(n)||!covers(p,d))return; out.add(n+'|'+(d<today?'miss':(d===today?'plan':'ahead')));});
    return [...out].sort();};
   const card=()=>document.querySelector('#rit .rv-week');
   /* SV17: a sash carries its name in data-nm and its state in its class, and
      a day past three carries the rest on its +N as name|state pairs */
   const read=()=>[...card().querySelectorAll('.rv-wkg>.rv-wd1')].map(c=>[...c.querySelectorAll('button.rv-wch[data-nm]')]
    .map(e=>e.getAttribute('data-nm')+'|'+e.className.match(/rv-wch-(\w+)/)[1])
    .concat([...c.querySelectorAll('.rv-wmore')].flatMap(m=>m.getAttribute('data-more').split(';'))).sort());
   const press=async d=>{const b=card().querySelector('[data-act="wk"][data-d="'+d+'"]'); if(!b||b.disabled)return false; b.click(); await w(); return true;};
   /* SV24: the week opens on its Sunday. wd stays Monday 0 above, because
      it is the coverage rule's stored weekday and not a column */
   const mon0=today-(wd(today)+1)%7, rs=Math.min(...CURP.rituals.map(x=>dk(x.t)),...plans.map(p=>dk(p.from)));
   const out={weeks:[], bad:[]};
   const check=()=>{const mon=mon0+7*RIT.wk, got=read();
    const range=card().querySelector('.rv-wkr').textContent;
    const f=d=>new Date(d*DAY+off+12*3600000).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    const ok1=range===f(mon)+' to '+f(mon+6)&&got.length===7&&got.every((g,i)=>JSON.stringify(g)===JSON.stringify(want(mon+i)));
    out.weeks.push(RIT.wk); if(!ok1)out.bad.push({wk:RIT.wk, range, got, want:[0,1,2,3,4,5,6].map(i=>want(mon+i))});
    return got;};
   ritRender(); check(); out.home={zero:RIT.wk===0, back0:!!card().querySelector('[data-act="wk"][data-d="0"]')};
   let n=0; while(await press(1)){check(); n++; if(n>20)break;}
   out.ahead=n; out.fwdOff=card().querySelector('[data-act="wk"][data-d="1"]').disabled;
   out.backHere=!!card().querySelector('[data-act="wk"][data-d="0"]');
   await press(0); out.home2={zero:RIT.wk===0, now:!!card().querySelector('.rv-wd1.rv-now')};
   n=0; while(await press(-1)){check(); n++; if(n>40)break;}
   out.behind=n; out.backOff=card().querySelector('[data-act="wk"][data-d="-1"]').disabled;
   out.firstHasStart=mon0+7*RIT.wk<=rs&&rs<=mon0+7*RIT.wk+6;
   setTab(TAB.FIELD); await w(); setTab(TAB.RITUAL); await w();
   out.reopen={zero:RIT.wk===0, now:!!card().querySelector('.rv-wd1.rv-now')};
   /* a day with nothing set is the house dash, never a sentence */
   out.dash=[...card().querySelectorAll('.rv-wd1')].filter(c=>!c.querySelector('.rv-wch')).every(c=>(c.querySelector('.rv-wd0')||{}).textContent==='–');
   return out;});
  ok(cy.bad.length===0&&cy.weeks.length===cy.ahead+cy.behind+1,
   'FT34: '+tag+'every week the arrows reach, '+cy.weeks.length+' of them, prints its own dates and each day carries exactly the rituals worked out here, by name and state, '+JSON.stringify(cy.bad.slice(0,2)));
  ok(cy.home.zero&&!cy.home.back0&&cy.ahead===4&&cy.fwdOff&&cy.backHere&&cy.home2.zero&&cy.home2.now,
   'FT34: '+tag+'forward stops at four weeks, This week is offered only while away and brings today back, '+JSON.stringify(cy));
  ok(cy.behind>0&&cy.backOff&&cy.firstHasStart&&cy.reopen.zero&&cy.reopen.now&&cy.dash,
   'FT34: '+tag+'back stops at the week the record starts, leaving Flow and coming back opens on this week, and an empty day is a dash, '+JSON.stringify(cy));

  /* ---- FT33, round RB: a worked example runs rituals, and the page reads them ----
     engine/ritex.js builds each example's plans and days with its own copy of
     ritCovers, because the engine cannot call a renderer. This holds the two
     to one answer: the page's own kept and missed count for every plan is the
     engine's, and the centre opens on the week with every running ritual in
     it. Then the person's own record is put back. */
  const ex=await pg.evaluate(()=>{const out={};
   ['Derek','Diane','Ana','James'].forEach(nm=>{
    const p=PEOPLE.find(x=>x.nm===nm); loadP(PEOPLE.indexOf(p)); setTab(TAB.RITUAL); ritRender();
    const st=ritRead(), R=ritexBuild(p,Date.now());
    const page=st.plans.reduce((a,q)=>{const r=ritRunRead(q,st.today); return {k:a.k+r.kept, m:a.m+r.missed};},{k:0,m:0});
    /* SV16: the week is its own card and always drawn, so "opens on the
       week" is every running ritual found under a day of this week that it
       covers */
    const mon=st.today-ritWc(st.today), names=new Set([...document.querySelectorAll('#rit .rv-week button.rv-wch[data-nm]')].map(b=>b.getAttribute('data-nm'))
     .concat([...document.querySelectorAll('#rit .rv-week .rv-wmore')].flatMap(m=>m.getAttribute('data-more').split(';').map(x=>x.split('|')[0]))));
    const thisWk=st.act.filter(q=>[0,1,2,3,4,5,6].some(i=>ritCovers(q,mon+i)));
    out[nm]={plans:st.plans.length, act:st.act.length, page, eng:R?{k:R.kept,m:R.missed}:null,
     week:thisWk.length>0&&thisWk.every(q=>names.has(ritName(q.steps))), today:!!document.querySelector('#rit .rv-week .rv-wd1.rv-now'),
     due:document.querySelectorAll('#rit .rv-week .rv-wd1.rv-now button.rv-wch').length};});
   loadP(0); setTab(TAB.RITUAL); ritRender(); return out;});
  ok(['Derek','Diane','Ana'].every(n=>{const x=ex[n]; return x.plans>0&&x.act>0&&x.eng&&x.page.k===x.eng.k&&x.page.m===x.eng.m&&x.week&&x.today;})
    &&new Set(['Derek','Diane','Ana'].map(n=>JSON.stringify(ex[n].page))).size===3,
   'FT33: '+tag+'Derek, Diane and Ana each open on their own running rituals, the page counts the same kept and missed days the engine wrote, and the week holds every one with today marked, '+JSON.stringify(ex));
  /* James said yes to nothing until 4 November, when the owner asked for
     every example to run a ritual. He starts one today (engine/ritex.js),
     so his page counts what the engine wrote like the three above */
  ok(ex.James.plans===1&&ex.James.act===1&&ex.James.eng&&ex.James.page.k===ex.James.eng.k&&ex.James.page.m===ex.James.eng.m&&ex.James.today,
   'FT33: '+tag+'James starts his one ritual today and the page counts it as the engine wrote it, '+JSON.stringify(ex.James));
  /* and a record with nothing running draws the week empty, seven dashes and
     no ritual, rather than a week of something. No example is that record
     now, so James's is emptied in memory, the state the page meets for
     anyone who has started nothing */
  const none=await pg.evaluate(()=>{loadP(PEOPLE.findIndex(x=>x.nm==='James')); CURP.rituals=[]; RIT_EX[CURP.id]=[];
   setTab(TAB.RITUAL); ritRender(); const st=ritRead();
   const r={plans:st.plans.length, chips:document.querySelectorAll('#rit .rv-week .rv-wch').length,
    dashes:document.querySelectorAll('#rit .rv-week .rv-wd0').length};
   delete PROF_BY.James; loadP(0); setTab(TAB.RITUAL); ritRender(); return r;});
  ok(none.plans===0&&none.chips===0&&none.dashes===7,'FT33: '+tag+'a record with nothing running draws the week as seven empty days, '+JSON.stringify(none));

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
  /* THE ROWS AFTER THE FIRST ARE THE PLACES THE PERSON HOLDS, AND THEY ARE
     NOT THE INFERRED ONE AGAIN. This asked for exactly one row, which was only
     ever true because the QX seed held nothing at 4: ritChallenge appends a
     row for each held place (ritHeld, ui/ritual.js) after the saboteurs it is
     handed, and r here is handed in while ritHeld reads the live profile. The
     seed's third story (see the QX seed above) holds the root on Fear, so a
     second row, "Fear at the root", is the function doing its job. So the
     handed in saboteur must be first and say it is inferred, and every row
     after it must be a held place and must not repeat the Sad challenge the
     first one already carries. */
  ok(ct.inf.length>=1&&ct.inf[0].act&&/does not name/.test(ct.inf[0].who)&&/sadness at the root/.test(ct.inf[0].who)
    &&ct.inf.slice(1).every(c=>!c.act&&/^a place you hold/.test(c.who)),'FT31: an inferred saboteur says it is one, and carries its fetter\'s challenge, '+JSON.stringify(ct.inf));

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
     /* SV19: the paragraph that counted the days before the record aloud is
        cut, his third tier text; the hatch is named by the key under the
        grid, so the key is held here and the paragraph is held gone */
     note:!/drawn blank/.test(sec().innerText)&&(!pre||/Before your record/.test(sec().querySelector('.rv-key').textContent)),
     cells:sec().querySelectorAll('.rv-sc').length===today-t0+1, wide:!!sec().querySelector('.rv-syr')===(today-t0+1>62), want:[kept,missed,pre], figs});}
   sec().querySelector('[data-act="rng"][data-v="1m"]').click();
   /* James, not Marcus: since round RB Marcus runs a ritual (engine/ritex.js).
      Since 4 November James runs one too, as every example does, so his
      record is emptied in memory here to be the record with nothing on it,
      and dropped after so the next load rebuilds it */
   loadP(PEOPLE.findIndex(x=>x.nm==='James')); CURP.rituals=[]; RIT_EX[CURP.id]=[]; setTab(TAB.RITUAL); ritRender();
   out.empty=/Nothing on your record yet/.test(sec().innerText)&&sec().querySelectorAll('.rv-sc-done,.rv-sc-miss').length===0;
   delete PROF_BY.James; loadP(0); setTab(TAB.RITUAL); ritRender();
   return out;});
  ok(JSON.stringify(sx.chips)===JSON.stringify(['1 year','6 months','3 months','2 months','1 month','2 weeks','1 week','5 days','3 days','1 day']),
   'FT32: '+tag+'Success over time offers his ten spans in his order, '+JSON.stringify(sx.chips));
  const badRow=sx.rows.filter(r=>!(r.kept&&r.missed&&r.pre&&r.note&&r.cells&&r.wide));
  ok(badRow.length===0,
   'FT32: '+tag+'every span counts the kept and missed days worked out here, a day a square, and a span reaching back before the record draws those days hatched, names the hatch in its key and no paragraph, and never counts them missed, '+JSON.stringify(badRow.length?badRow:sx.rows.map(r=>r.k+':'+r.want.join('/'))));
  ok(sx.empty,'FT32: '+tag+'a person with no record is told so, and nothing is drawn kept or missed, '+JSON.stringify(sx.empty));
  }catch(e){ok(false,'FT29: '+tag+'the round QX group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'FT29: '+tag+'no page errors across the round QX group, '+err.join(' | '));
  await pg.close();
 }

 /* ---- FT35, SV17: a day's rituals are sashes, and a sash opens its sheet ----
    His reaction to the SV16 week: too much text, not a calendar, nothing
    leads the eye, and the two pole bar he has asked for three times missing.
    Diane's plans are a worked example's, held in memory (RIT_EX), so two are
    added for the run and nothing is written: a release schedule aimed at the
    heaviest place she holds with a pattern, which is the one ritual with a
    real second pole, and a plain breath at the heart, so today carries four
    and the +N is drawn. Every expected value is read off the plans and CHILD
    here; the page is asked only what it shows. */
 for(const [W,H] of [[1600,1000],[390,844]]){
  const tag='@'+W+' ';
  const pg=await newPage({viewport:{width:W,height:H}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  try{
  const seed=await pg.evaluate(()=>{
   loadP(PEOPLE.findIndex(x=>x.nm==='Diane')); setTab(TAB.RITUAL);
   const n=ritHeld().filter(h=>h.cf).sort((a,c)=>c.sq-a.sq)[0];
   const DAY=86400000, off=new Date().getTimezoneOffset()*60000, today=Math.floor((Date.now()-off)/DAY);
   const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
   const mk=(id,k,rel,band)=>({id,steps:[k],when:'',where:'',days:7,from:iso(today-2),stop:null,band,track:'',rel,tc:null,tags:[band],on:null,tm:null});
   RIT_EX[CURP.id]=ritPlans().concat([mk('sv17rel','box',n.i,n.b),mk('sv17slow','slow',null,'Heart')]);
   ritRender();
   const c=CHILD.find(x=>x.nm===n.cf);
   return {poles:[c.nm,c.opp], rel:ritName(['box']), seat:n.b, today};});
  /* the page draws in on arrival (rv-arrive), and a sash measured mid
     entrance read 40 pixels at 390 while it was still scaling in */
  await pg.waitForTimeout(1200);
  const wk=await pg.evaluate(()=>{const w=document.querySelector('#rit .rv-week').getBoundingClientRect();
   const sash=[...document.querySelectorAll('#rit .rv-week button.rv-wch')];
   const now=document.querySelector('#rit .rv-week .rv-wd1.rv-now'), other=document.querySelector('#rit .rv-week .rv-wd1:not(.rv-now) button.rv-wch');
   const st=ritRead(), segs=ritWeekDay(st.today,st);
   return {bottom:Math.round(w.bottom), vh:innerHeight,
    cells:[...document.querySelectorAll('#rit .rv-wd1')].map(c=>Math.round(c.getBoundingClientRect().height)),
    small:sash.map(x=>x.getBoundingClientRect()).filter(r=>r.width<44||r.height<44).length,
    words:sash.filter(x=>!x.classList.contains('rv-wmore')&&x.textContent.trim()!=='').length,
    named:sash.filter(x=>!x.classList.contains('rv-wmore')).every(x=>x.getAttribute('aria-label')===x.getAttribute('data-nm')+', '+RIT_DAY_SAY[x.className.match(/rv-wch-(\w+)/)[1]]&&x.getAttribute('data-tip')),
    glyph:sash.filter(x=>!x.classList.contains('rv-wmore')).every(x=>{const st0=ritRead(), d=+x.getAttribute('data-d'), s=ritWeekDay(d,st0)[+x.getAttribute('data-i')];
     return !!x.querySelector('svg')===!!ritSashSeat(s);}),
    nowKids:now.querySelectorAll('.rv-wdl>li').length, more:(now.querySelector('.rv-wmore')||{}).textContent||'', segs:segs.length,
    dim:other?+getComputedStyle(other).opacity:1, lit:+getComputedStyle(now.querySelector('button.rv-wch')).opacity,
    gone:['Due today','Say each one out loud','One small act against','More come as your stories','Fewer practices']
     .filter(t=>document.body.innerText.indexOf(t)>=0),
    tile:document.querySelectorAll('#lcol .rv-td').length};});
  ok(wk.bottom<=wk.vh,'FT35: '+tag+'the whole week is on the first screen with no scroll, bottom '+wk.bottom+' of '+wk.vh);
  ok(new Set(wk.cells).size===1&&wk.small===0,'FT35: '+tag+'every day cell is one height and every sash is at the 44 pixel floor, '+JSON.stringify(wk.cells)+' '+wk.small);
  ok(wk.words===0&&wk.named&&wk.glyph,'FT35: '+tag+'no sash prints a word, each is named by its ritual and state, and wears its seat mark only when it has a seat, '+JSON.stringify(wk));
  ok(wk.segs===4&&wk.nowKids===3&&wk.more==='+2','FT35: '+tag+'four rituals on today are two sashes and a +2, '+JSON.stringify([wk.segs,wk.nowKids,wk.more]));
  ok(wk.lit===1&&wk.dim<1,'FT35: '+tag+'today is at full strength and the other days sit back, '+JSON.stringify([wk.lit,wk.dim]));
  ok(wk.gone.length===0&&wk.tile===0,'FT35: '+tag+'the cut lines and Due today are nowhere on the page, '+JSON.stringify(wk.gone));
  const sh=await pg.evaluate(async seed=>{const w=()=>new Promise(r=>setTimeout(r,150)), c=document.getElementById('sheet-card'), out={};
   document.querySelector('#rit .rv-wd1.rv-now .rv-wmore').click(); await w();
   out.list=[...c.querySelectorAll('.rv-shr .rv-shrn')].map(x=>x.textContent);
   [...c.querySelectorAll('.rv-shr')].find(r=>r.querySelector('.rv-shrn').textContent===seed.rel).click(); await w();
   out.rel={nm:(c.querySelector('.rv-sht .sh-h')||{}).textContent, bars:c.querySelectorAll('.rb2').length,
    poles:[...c.querySelectorAll('.rb2-n')].map(x=>x.textContent), h:c.querySelector('.rb2')?c.querySelector('.rb2').getBoundingClientRect().height:0,
    kept:(c.querySelector('.rv-shk')||{}).textContent||'', d:(c.querySelector('.rv-shd')||{}).textContent||'',
    acts:[...c.querySelectorAll('[data-sh]')].map(b=>b.getAttribute('data-sh'))};
   out.want={d:PRACTICE.find(p=>p.k==='box').d, kept:(()=>{const q=ritPlans().find(p=>p.id==='sv17rel'), P=ritPct(q,ritToday0());
    return 'Kept '+P.kept+(P.kept===1?' day':' days')+ritLeft(q,ritToday0());})()};
   sheetShut();
   const st=ritRead(), segs=ritWeekDay(st.today,st), i=segs.findIndex(s=>{const q=ritSashPlan(s,st.today,st); return q&&q.rel==null;});
   document.querySelector('#rit .rv-wd1.rv-now button.rv-wch[data-i="'+i+'"]').click(); await w();
   out.plain={i, nm:(c.querySelector('.rv-sht .sh-h')||{}).textContent, want:segs[i].nm, bars:c.querySelectorAll('.rb2').length};
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await w();
   out.shut=document.getElementById('sheet').hidden;
   /* the gate's clock is a Monday, the second day of a Sunday first week, so
      the older days are mostly last week's: the arrow back, and the first day
      there that carries anything */
   RIT.wk=-1; ritRender(); out.past=null;
   const mon=st.today-ritWc(st.today)-7;
   for(let d=mon;d<mon+7;d++){const sg=ritWeekDay(d,st); if(!sg.length)continue;
    document.querySelector('#rit .rv-week button.rv-wch[data-d="'+d+'"][data-i="0"]').click(); await w();
    out.past={d, want:sg[0].nm, got:(c.querySelector('.rv-sht .sh-h')||{}).textContent, done:!!c.querySelector('[data-sh="log"]')}; sheetShut(); break;}
   RIT.wk=0; ritRender();
   return out;},seed);
  ok(sh.list.length===4,'FT35: '+tag+'the +2 opens the whole day in the sheet, '+JSON.stringify(sh.list));
  ok(sh.rel.nm===seed.rel&&sh.rel.bars===1&&JSON.stringify(sh.rel.poles)===JSON.stringify(seed.poles)&&sh.rel.h>=44,
   'FT35: '+tag+'a release schedule\'s sheet carries one two pole bar, '+seed.poles.join(' against ')+', the pattern its address holds, at the tap floor, '+JSON.stringify(sh.rel));
  ok(sh.rel.kept===sh.want.kept&&sh.rel.d===sh.want.d&&['log','edit','del-plan','close'].every(a=>sh.rel.acts.indexOf(a)>=0),
   'FT35: '+tag+'the sheet carries the days kept and the days left, never kept of set, what the practice is, and Done, Edit and Delete, '+JSON.stringify([sh.rel,sh.want]));
  ok(sh.plain.i>=0&&sh.plain.nm===sh.plain.want&&sh.plain.bars===0&&sh.shut,
   'FT35: '+tag+'a ritual with no target pattern opens with no bar at all, and Escape shuts the sheet, '+JSON.stringify(sh.plain));
  ok(sh.past&&sh.past.want===sh.past.got&&!sh.past.done,
   'FT35: '+tag+'an older day\'s sash opens that ritual and offers no Done ring on a day the record will not take, '+JSON.stringify(sh.past));
  /* the toggle keeps one label and says its state in aria-expanded */
  const tg=await pg.evaluate(async()=>{const b=()=>document.getElementById('ritall'), a=[b().textContent,b().getAttribute('aria-expanded')];
   b().click(); await new Promise(r=>setTimeout(r,150)); const z=[b().textContent,b().getAttribute('aria-expanded')];
   b().click(); await new Promise(r=>setTimeout(r,150)); return [a,z];});
  ok(tg[0][0]==='More practices'&&tg[1][0]==='More practices'&&tg[0][1]==='false'&&tg[1][1]==='true',
   'FT35: '+tag+'More practices keeps its label open and shut, and aria-expanded carries the state, '+JSON.stringify(tg));
  /* SV19, his words: "If I select a day of the week, I don't [get what I
     expect]." The weekday and date at the head of each column are a press
     now, and open that day in the sheet: every ritual on it, or Nothing set */
  const dh=await pg.evaluate(async()=>{const w=()=>new Promise(r=>setTimeout(r,180)), st=ritRead(), c=()=>document.getElementById('sheet-card');
   const head=d=>document.querySelector('#rit .rv-week .rv-wdh[data-d="'+d+'"]');
   const now=head(st.today); const tagName=now?now.tagName:'', h=now?Math.round(now.getBoundingClientRect().height):0;
   now.click(); await w();
   const got={rows:[...c().querySelectorAll('.rv-shr .rv-shrn')].map(x=>x.textContent), want:ritWeekDay(st.today,st).map(x=>x.nm),
    open:!document.getElementById('sheet').hidden};
   sheetShut(); await w();
   const mon=st.today-ritWc(st.today); let empty=null;
   for(let d=mon;d<mon+7;d++){if(ritWeekDay(d,st).length)continue; head(d).click(); await w();
    empty={d, said:(c().querySelector('.rv-empty')||{}).textContent||'', rows:c().querySelectorAll('.rv-shr').length}; sheetShut(); await w(); break;}
   return {tagName, h, got, empty};});
  ok(dh.tagName==='BUTTON'&&dh.h>=44&&dh.got.open&&JSON.stringify(dh.got.rows)===JSON.stringify(dh.got.want)&&dh.got.want.length>0
    &&(dh.empty===null||(dh.empty.said==='Nothing set.'&&dh.empty.rows===0)),
   'FT35: '+tag+'a day\'s head is a press at the tap floor that opens that day with every ritual on it, and an empty day says Nothing set, '+JSON.stringify(dh));
  /* SV19, his words of More practices: "I don't want these side by side, I
     want these stacked." Opened, each practice is one row the column's width */
  const ls=await pg.evaluate(async()=>{RIT.all=true; ritRender(); await new Promise(r=>setTimeout(r,150));
   const t=[...document.querySelectorAll('#flowleft .rv-tiles .rv-tile')], L=t.map(e=>e.getBoundingClientRect());
   const col=document.querySelector('#flowleft .rv-tiles').getBoundingClientRect();
   const out={n:t.length, lib:ritRead().c.all.length, oneCol:L.every(r=>Math.abs(r.left-col.left)<1.5&&Math.abs(r.right-col.right)<1.5),
    stacked:L.every((r,i)=>i===0||L[i-1].bottom<=r.top+1||L[i-1].top>r.top), called:/called for/i.test(document.getElementById('flowleft').querySelector('.rv-build').innerText)};
   RIT.all=false; ritRender(); return out;});
  ok(ls.n===ls.lib&&ls.n>0&&ls.oneCol&&ls.stacked&&!ls.called,
   'FT35: '+tag+'More practices lists every practice the library offers one to a row, none side by side, and no tile says called for, '+JSON.stringify(ls));
  }catch(e){ok(false,'FT35: '+tag+'the group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'FT35: '+tag+'no page errors, '+err.join(' | '));
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
require('./net.js').guardBrowser(browser);
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
