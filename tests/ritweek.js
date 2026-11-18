/* ============================================================
   THE RITUAL WEEK, AS BLOCKS, GATED. node tests/ritweek.js

   The owner, 18 November, his words: "I want the actions that the user is
   supposed to do as blocks under the days of the week, sorted by the action
   color or type ... everything beneath that, where it says done, planned,
   missed, the rituals, the affirmations, that can go away. You can move the
   challenges to the very top above the week ... Same with the goal. Where it
   says called for, these need to be ritual cards ... if I click on it, then I
   got a pop-up ... add it to my day of the week and select a day and time."

   Every check opens with its rule, RW1 and on, and every expected value is
   worked out here from the seed and the tables, never by asking the page's
   own function for the answer it is being checked on: a gate that asks the
   code for the answer passes on any bug.

   PROVEN AGAINST MUTANTS FIRST. RW_MUTANT=<name> breaks one thing in the
   page after it boots (MUTANTS below), and the rule that guards it must fail
   while the others keep passing. The notes for the round carry which mutant
   each rule caught. Run from the repo root, with NODE_PATH at playwright.
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const MUT=process.env.RW_MUTANT||'';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

/* each mutant is the defect its rule exists to stop, put in the page the way
   the defect would arrive: a function quietly doing the old thing */
const MUTANTS={
 /* the week coloured by seat again, the ruling this round reversed */
 seatcol:`ritKindCol=function(){return 'var(--accent)';};`,
 /* the kind order lost: a day's blocks in the order they were read */
 noorder:`(function(){var f=ritWeekBlocks; ritWeekBlocks=function(d,st,segs){return f(d,st,segs).slice().reverse();};})();`,
 /* every block one day late, a weekday arithmetic slip */
 dayshift:`(function(){var f=ritWeekDay; ritWeekDay=function(d,st){return f(d-1,st);};})();`,
 /* a kind sentence dropped off its chip, the unpack rule broken */
 bare:`(function(){var f=ritKindChip; ritKindChip=function(k){return f(k).replace(/ data-tip="[^"]*"/,'');};})();`,
 /* a practice added to the library with no kind written for it */
 nokind:`delete RIT_KIND_OF.listen;`,
 /* the goal and the challenges left off the top */
 notop:`ritTopHtml=function(){return '';};`,
 /* tiles of uneven width, the asymmetry ruled out on 14 and 16 November */
 uneven:`document.head.insertAdjacentHTML('beforeend','<style>.rv-ttls{grid-template-columns:1fr 2fr 1fr 1fr!important}</style>');`,
 /* the did tick lost on the way from the Today list to the tile */
 /* the long card back: the description printed on the face again */
 fatcard:`(function(){var f=ritCardFace; ritCardFace=function(o){return f(o).replace('</li>','<p class="rv-sgd">A long description of what this practice is and why it is offered here today.</p></li>');};})();`,
 /* where a card came from, said with no meaning */
 novia:`(function(){var f=ritViaMark; ritViaMark=function(v){return f(v).replace(/ data-tip="[^"]*"/,'');};})();`,
 /* a second add of the same practice replacing its days, the B8 defect */
 nojoin:`(function(){var f=ritStartPlan; ritStartPlan=function(q,m){if(q)q.join=false; return f(q,m);};})();`,
 /* a time of day taken without its shape checked */
 noat:`ritAtOk=function(){return true;};`,
 /* the Timer lost on the way from the Today list into the pop-up */
 notimer:`ritTimerHtml=function(){return '';};`,
 /* the Today list back under the week */
 today:`(function(){var f=ritStageHtml; ritStageHtml=function(st,P){return f(st,P).replace('<section class="rv-sec rv-week"','<section class="rv-sec rv-act rv-goals"><ol class="rv-list"><li>Box Breathing</li></ol></section><section class="rv-sec rv-week"');};})();`,
 /* the figures row printed a second time under Success over time */
 figs:`(function(){var f=ritSuccessHtml; ritSuccessHtml=function(st,c){return f(st,c).replace('</section>','<div class="rv-figs rv-sfigs"><div class="rv-fig"><b>3</b><span>Missed</span></div></div></section>');};})();`,
 /* the strip without its Marks chip */
 nomarks:`(function(){var f=acctStreakHtml; acctStreakHtml=function(st){return f(st).replace(/<span class="acs acs-marks"[\s\S]*?<\/span><\/span>/,'');};})();`,
 /* tiles pressed on top of each other */
 overlap:`document.head.insertAdjacentHTML('beforeend','<style>.rv-ttl{margin-right:-60px}</style>');`,
 nodid:`(function(){var f=ritChalTile; ritChalTile=function(c,st){return f(c,st).replace(/data-act="did"/,'data-act="none"');};})();`};

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium'});
 require('./net.js').guardBrowser(browser);
 const {FULL_SIGHT}=require('./seed.js');
 /* Monday 23 February 2026 at local noon, the fixed day flowtools.js runs
    on, so the week is Sunday 22 to Saturday 28 and no check reads the real
    clock */
 const AT=new Date(2026,1,23,12);
 const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
  try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
   await p.waitForTimeout(120);}catch(e){}};
 const open=async(W,H)=>{
  const phone=W<600, pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  await pg.addInitScript(FULL_SIGHT); await pg.clock.install({time:AT});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(400);
  if(MUT)await pg.evaluate(MUTANTS[MUT]);
  return {pg,err};};

 /* ONE SEED, the person's own record, written through the product's own
    writers where one exists. Four plans of three kinds on known weekdays:
    stored weekdays are Monday 0, the store's own numbering. */
 const SEED=()=>{
  loadP(0); CURP.rituals=[]; CURP.history=[]; ritPlanPut([]);
  try{STORE.set('atuned-ritual-sched','{}'); STORE.set('atuned-ritual-more','{}');}catch(e){}
  const DAY=86400000, off=new Date().getTimezoneOffset()*60000;
  const today=Math.floor((Date.now()-off)/DAY);
  const iso=d=>new Date(d*DAY+off+12*3600000).toISOString();
  ['I am terrified of being abandoned and I panic and cannot breathe. My chest is tight.',
   'I feel worthless and ashamed, I am never enough, I am a failure.',
   'I go quiet and pull away from my partner when I feel rejected.'].forEach(t=>{ST_TEXT=t; ST_PARSED=parseStory(t); stCommit();});
  CURP.avatar=avatarBlank(); CURP.avatar.built=true; CURP.avatar.at=iso(today-30);
  CURP.avatar.pairs=[{be:'Someone who speaks up calmly in the room',notbe:'I feel worthless and ashamed, I am never enough'}];
  const held=W.filter(n=>n.cf&&n.sq>=4)[0];
  const P=(id,k,band,on,rel)=>({id,steps:[k],when:'',where:'',days:0,from:iso(today-7),stop:null,band,track:'',
   rel:rel==null?null:rel,tc:null,tags:[band],on,tm:null});
  const plans=[P('wa','box','Heart',[0,2]),P('wb','listen','Throat',[1,3]),P('wc','noting','Crown',null),
   P('wd','box','Root',[5,6],held?held.i:null)];
  const wrote=ritPlanPut(plans)&&pSave();
  RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; setTab(TAB.RITUAL); ritRender();
  return {wrote, today, held:held?held.i:null,
   plans:plans.map(p=>({id:p.id, nm:PRACTICE.filter(x=>x.k===p.steps[0])[0].nm, k:p.steps[0], on:p.on, rel:p.rel}))};};

 for(const [W,H] of [[1600,1000],[390,844]]){
  const tag='@'+W+' ';
  const {pg,err}=await open(W,H);
  try{
  const seed=await pg.evaluate(SEED);
  await pg.waitForTimeout(600);
  ok(seed.wrote,'RW0: '+tag+'the seed was written through the store and the record');

  /* ---- RW1: every practice has a kind, from the closed set of four ---- */
  const kinds=await pg.evaluate(()=>{const set=['aff','act','med','rel'];
   return {n:PRACTICE.length, bad:PRACTICE.filter(p=>set.indexOf(RIT_KIND_OF[p.k])<0).map(p=>p.k)};});
  ok(kinds.n>0&&kinds.bad.length===0,'RW1: '+tag+'every one of the '+kinds.n+' practices has a kind written for it, missing: '+kinds.bad.join(', '));

  /* ---- RW2: the blocks are on the right days, worked out from the plans ---- */
  /* the week's columns, Sunday first, and the stored weekday each carries */
  const WCOL=[6,0,1,2,3,4,5];
  const want=WCOL.map(wd=>seed.plans.filter(p=>!p.on||p.on.indexOf(wd)>=0).map(p=>p.nm).sort());
  const wk=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-week .rv-wd1')].map(li=>{
   const bl=[...li.querySelectorAll('button.rv-blk')].map(b=>({nm:b.getAttribute('data-nm'),kind:b.getAttribute('data-kind'),
    h:Math.round(b.getBoundingClientRect().height),c:getComputedStyle(b.querySelector('.rv-kic')||b).color}));
   const more=li.querySelector('.rv-wmore');
   return {bl, more:more?more.getAttribute('data-more').split(';').map(x=>x.split('|')[0]):[]};}));
  const got=wk.map(d=>d.bl.map(b=>b.nm).concat(d.more).sort());
  ok(wk.length===7&&JSON.stringify(got)===JSON.stringify(want),
   'RW2: '+tag+'each day carries a block for every plan set on it and none other, want '+JSON.stringify(want)+' got '+JSON.stringify(got));
  ok(wk.every(d=>d.bl.length<=3)&&wk.every(d=>d.bl.every(b=>b.h>=44)),
   'RW2: '+tag+'at most three blocks a day, each at least 44 pixels tall, '+JSON.stringify(wk.map(d=>d.bl.map(b=>b.h))));

  /* ---- RW3: the colour is the kind ---- */
  const tok=await pg.evaluate(()=>{const o={}; ['aff','act','med','rel'].forEach(k=>{const e=document.createElement('i');
   e.style.color='var(--kd-'+k+')'; document.querySelector('#rit').appendChild(e); o[k]=getComputedStyle(e).color; e.remove();}); return o;});
  const kindOf={}; seed.plans.forEach(p=>{kindOf[p.nm+(p.rel!=null?'|rel':'')]=p.rel!=null?'rel':({box:'med',listen:'act',noting:'med'})[p.k];});
  const flat=[].concat(...wk.map(d=>d.bl));
  const wrongK=flat.filter(b=>{const want=b.kind==='rel'?'rel':kindOf[b.nm]; return b.kind!==want;});
  const wrongC=flat.filter(b=>b.c!==tok[b.kind]);
  ok(flat.length>0&&wrongK.length===0,'RW3: '+tag+'every block names the kind its practice is, '+JSON.stringify(wrongK));
  ok(new Set(Object.values(tok)).size===4&&wrongC.length===0,
   'RW3: '+tag+'every block wears its kind\'s colour and the four colours differ, '+JSON.stringify({tok,wrongC:wrongC.slice(0,3)}));

  /* ---- RW4: inside a day the order is Affirmation, Action, Meditation, Release ---- */
  const ORD={aff:0,act:1,med:2,rel:3};
  const badOrd=wk.map((d,i)=>({i,k:d.bl.map(b=>b.kind)})).filter(x=>x.k.some((k,j)=>j&&ORD[x.k[j-1]]>ORD[k]));
  ok(flat.length>0&&badOrd.length===0&&wk.some(d=>new Set(d.bl.map(b=>b.kind)).size>1),
   'RW4: '+tag+'a day\'s blocks run in the kinds\' order and the seed has days of more than one kind, '+JSON.stringify(badOrd));

  /* ---- RW5: the Done, Planned, Missed key is gone and the kinds key carries its meanings ---- */
  const key=await pg.evaluate(()=>{const w=document.querySelector('#rit .rv-week');
   return {old:w.querySelectorAll('.rv-key').length, chips:[...w.querySelectorAll('.rv-kkey .rv-kch')].map(c=>({w:c.textContent.trim(),tip:c.getAttribute('data-tip')||''})),
    say:RIT_KINDS.map(k=>({w:k.nm,tip:k.says}))};});
  ok(key.old===0,'RW5: '+tag+'the Done, Planned, Missed key under the week is gone, '+key.old);
  ok(key.chips.length===4&&JSON.stringify(key.chips)===JSON.stringify(key.say)&&key.chips.every(c=>c.tip.length>10),
   'RW5: '+tag+'the four kinds are keyed in the week\'s head, each with its one sentence on the press, '+JSON.stringify(key.chips));
  /* ---- RW6: the goal and the challenges are the top row, above the week ---- */
  const top=await pg.evaluate(()=>{
   const six=document.querySelector('#rit .rv-six'), kids=six?[...six.children]:[];
   const t=document.querySelector('#rit .rv-top'), wk=document.querySelector('#rit .rv-week');
   const tiles=t?[...t.querySelectorAll('.rv-ttl')].map(e=>{const r=e.getBoundingClientRect(); return {l:r.left,r:r.right,w:Math.round(r.width),t:Math.round(r.top),
    goal:e.classList.contains('rv-tgoal'),txt:e.textContent.replace(/\s+/g,' ').trim(),tip:(e.querySelector('.rv-tlab')||{getAttribute:()=>''}).getAttribute('data-tip')||''};}):[];
   return {first:kids.indexOf(t)===0, above:!!(t&&wk&&t.getBoundingClientRect().bottom<=wk.getBoundingClientRect().top), tiles,
    want:ritChallenge(ritRead()).map(c=>c.id), ids:t?[...t.querySelectorAll('.rv-tchal .rv-tnm')].map(b=>b.getAttribute('data-id')):[],
    phone:innerWidth<600};});
  ok(top.first&&top.above,'RW6: '+tag+'the goal and challenges are the first thing on the stage and sit above the week, '+JSON.stringify({first:top.first,above:top.above}));
  ok(top.tiles.length>=2&&top.tiles[0].goal&&/speaks up calmly in the room/.test(top.tiles[0].txt),
   'RW6: '+tag+'the goal is the first tile and says the avatar line the seed wrote, '+JSON.stringify(top.tiles.map(x=>x.txt)));
  ok(top.want.length>0&&JSON.stringify(top.ids)===JSON.stringify(top.want.slice(0,3)),
   'RW6: '+tag+'one tile for each challenge the reading names, up to three, '+JSON.stringify({want:top.want,got:top.ids}));
  ok(top.tiles.every(x=>/^(Ongoing goal|Challenge)/.test(x.txt)&&x.tip.length>20),
   'RW6: '+tag+'every tile opens with its name and that name carries its meaning on the press, '+JSON.stringify(top.tiles.map(x=>x.tip)));
  /* even: every tile one width, the gaps between tiles in a row one size and
     never under 12 pixels, so nothing is pressed against its neighbour */
  const rows={}; top.tiles.forEach(x=>{(rows[x.t]=rows[x.t]||[]).push(x);});
  const gaps=[].concat(...Object.values(rows).map(r=>r.sort((a,b)=>a.l-b.l).slice(1).map((x,i)=>Math.round(x.l-r[i].r))));
  const ws=new Set(top.tiles.map(x=>x.w));
  ok(ws.size===1&&gaps.length>0&&new Set(gaps).size===1&&gaps[0]>=12,
   'RW6: '+tag+'the tiles are one width with one even gap of 12 or more, '+JSON.stringify({w:[...ws],gaps}));
  /* the did tick lives on the tile now: one press marks today and says so */
  const did=await pg.evaluate(async()=>{
   const b=document.querySelector('#rit .rv-tchal [data-act="did"]'); if(!b)return {none:true};
   const id=b.getAttribute('data-id'); b.click(); await new Promise(r=>setTimeout(r,200));
   const b2=document.querySelector('#rit .rv-tchal [data-act="did"][data-id="'+CSS.escape(id)+'"]');
   return {id, pressed:b2&&b2.getAttribute('aria-pressed'), said:(document.getElementById('status')||{}).textContent||'',
    rec:ritMore().did.some(x=>x[0]===ritToday0()&&x[1]===id)};});
  ok(!did.none&&did.pressed==='true'&&did.rec&&/^Done/.test(did.said),
   'RW6: '+tag+'the challenge tile\'s ring marks it done today through the writer and says so, '+JSON.stringify(did));
  /* ---- RW7: Called for is simple cards, one row each, the rest in the pop-up ---- */
  const cf=await pg.evaluate(()=>{
   const col=document.getElementById('flownew')||document;
   const cards=[...col.querySelectorAll('.rv-sug .rv-cf')].map(li=>{const r=li.getBoundingClientRect();
    const own=li.cloneNode(true); own.querySelectorAll('.rv-cfn').forEach(e=>e.remove());
    return {kind:li.getAttribute('data-kind'), via:li.getAttribute('data-via'), h:Math.round(r.height),
     nm:(li.querySelector('.rv-cfn')||{}).textContent||'', rest:own.textContent.replace(/\s+/g,' ').trim(),
     ring:(li.querySelector('.rv-cfr')||{getAttribute:()=>''}).getAttribute('data-tip')||'',
     viaTip:(li.querySelector('.rv-via')||{getAttribute:()=>''}).getAttribute('data-tip')||'',
     add:!!li.querySelector('.rv-cfa'), x:!!li.querySelector('.rv-cfx'),
     c:getComputedStyle(li.querySelector('.rv-cfr')).color};});
   const tok={}; ['aff','act','med','rel'].forEach(k=>{const e=document.createElement('i'); e.style.color='var(--kd-'+k+')'; col.appendChild(e); tok[k]=getComputedStyle(e).color; e.remove();});
   return {cards, tok, old:col.querySelectorAll('.rv-sug .rv-sgd,.rv-sug .rv-sgo,.rv-sug .rv-sgc,.rv-sug .rv-pc').length};});
  const prac=cf.cards.filter(x=>x.kind!=='aff'), per={}; prac.forEach(x=>{per[x.via]=(per[x.via]||0)+1;});
  ok(cf.cards.length>=2&&cf.cards[0].kind==='aff'&&cf.cards[0].nm==='Affirmations',
   'RW7: '+tag+'Called for opens on the affirmation card and carries the practices under it, '+JSON.stringify(cf.cards.map(x=>x.nm)));
  ok(cf.old===0&&cf.cards.every(x=>x.h<=72&&x.rest.split(' ').length<=6),
   'RW7: '+tag+'every card is one short row, name, minutes and two presses, with no description, chips or pill on its face, '
   +JSON.stringify({old:cf.old,rows:cf.cards.map(x=>[x.h,x.rest])}));
  ok(cf.cards.every(x=>x.add&&x.ring.length>10&&x.viaTip.length>10)&&prac.every(x=>x.x),
   'RW7: '+tag+'every card has Add, its kind ring and its source mark each carry a sentence, and a practice can be dismissed, '+JSON.stringify(cf.cards.map(x=>[x.ring,x.viaTip])));
  ok(prac.length<=4&&Object.values(per).every(n=>n<=2)&&cf.cards.every(x=>x.c===cf.tok[x.kind]),
   'RW7: '+tag+'four practices at most, two at most from one source, and each card wears its kind\'s colour, '+JSON.stringify({per,c:cf.cards.map(x=>[x.kind,x.c])}));
  /* ---- RW8: the pop-up, its When, and the writer behind it ---- */
  const pop=await pg.evaluate(async()=>{
   const w=ms=>new Promise(r=>setTimeout(r,ms||150)), say=()=>(document.getElementById('status')||{}).textContent||'';
   const sheet=()=>document.getElementById('sheet'), card=()=>document.getElementById('sheet-card');
   const out={};
   /* a practice card that is not already on the week */
   const on=ritPlans().map(x=>ritName(x.steps));
   const li=[...document.querySelectorAll('#flownew .rv-sug .rv-cf')].filter(l=>l.getAttribute('data-kind')!=='aff'
    &&on.indexOf(l.querySelector('.rv-cfn').textContent)<0)[0];
   if(!li)return {none:true};
   const nm=li.querySelector('.rv-cfn').textContent; out.nm=nm;
   li.querySelector('.rv-cfa').click(); await w();
   const c=card(), q=s=>[...c.querySelectorAll(s)];
   out.open=!sheet().hidden&&!!c.querySelector('.rv-pop');
   out.days=q('[data-sh="pd"]').length; out.quick=q('[data-sh="pall"],[data-sh="pwk"],[data-sh="pany"]').length;
   out.reps=q('[data-sh="prep"]').map(b=>b.textContent); out.time=!!c.querySelector('input[type="time"]');
   out.small=q('button,input,summary').filter(b=>{const r=b.getBoundingClientRect(); return r.width&&r.height&&(r.height<44||r.width<44);}).map(b=>b.textContent.trim()||b.getAttribute('aria-label'));
   out.btns=q('.rv-sha .btn').map(b=>b.textContent.trim());
   out.ai=!!c.querySelector('.rv-pf .src-mk');
   out.focus=document.activeElement&&document.activeElement.getAttribute('data-sh');
   /* Tuesday and Thursday, 07:30, a week: press the days off to those two */
   for(const wd of [6,0,2,4,5]){const b=card().querySelector('[data-sh="pd"][data-d="'+wd+'"]'); b.click(); await w(60);}
   const t=card().querySelector('#rv-pat'); t.value='07:30'; t.dispatchEvent(new Event('change'));
   card().querySelector('[data-sh="prep"][data-d="7"]').click(); await w(60);
   out.pressed=[...card().querySelectorAll('[data-sh="pd"][aria-pressed="true"]')].map(b=>+b.getAttribute('data-d'));
   card().querySelector('[data-sh="padd"]').click(); await w(250);
   const p=ritPlans().filter(x=>ritName(x.steps)===nm)[0];
   out.added={closed:sheet().hidden, said:say(), on:p&&p.on, at:p&&p.at};
   /* the same practice again on Saturday joins the days, never replaces them */
   const x=RIT.sug.filter(s=>s.p.nm===nm)[0]||{k:p.steps[0],p:ritPr(p.steps[0]),seats:[],why:[],rel:null};
   ritCardAdd(x,{on:[5],at:'',rep:7}); await w(150);
   const p2=ritPlans().filter(y=>ritName(y.steps)===nm)[0]; out.joined=p2&&p2.on;
   /* a bad time is refused by name and writes nothing */
   const before=JSON.stringify(ritPlans());
   ritCardAdd(x,{on:[6],at:'24:00',rep:7}); await w(100);
   out.bad={said:say(), same:JSON.stringify(ritPlans())===before};
   /* a stored plan carrying 7:5 is left out on the read */
   const all=JSON.parse(STORE.get('atuned-ritual-active')||'{}'), mine=all[CURP.id].slice();
   all[CURP.id]=mine.concat([Object.assign({},mine[0],{id:'wz',at:'7:5'})]); STORE.set('atuned-ritual-active',JSON.stringify(all));
   out.badRead=ritPlans().some(y=>y.id==='wz');
   all[CURP.id]=mine; STORE.set('atuned-ritual-active',JSON.stringify(all)); ritRender(); await w(150);
   /* the block for it on Tuesday says its time */
   const tue=[...document.querySelectorAll('#rit .rv-week .rv-wd1')][2];
   const bl=tue&&[...tue.querySelectorAll('button.rv-blk')].filter(b=>b.getAttribute('data-nm')===nm)[0];
   out.block=bl?bl.getAttribute('aria-label'):'';
   return out;});
  ok(!pop.none&&pop.open&&pop.days===7&&pop.quick===3&&pop.time&&JSON.stringify(pop.reps)===JSON.stringify(['Once','A week','Two weeks','No end']),
   'RW8: '+tag+'Add on a card opens the pop-up at When: seven days, Every day, Weekdays, Any time, a time, and Once, A week, Two weeks, No end, '+JSON.stringify(pop));
  ok(pop.focus==='pd'&&pop.small.length===0&&pop.ai&&['Add','Save','Dismiss','Close'].every(b=>(pop.btns||[]).indexOf(b)>=0),
   'RW8: '+tag+'the keyboard lands on the days, every control is 44 pixels or more, the reasons carry the Source AI mark, and Add, Save, Dismiss and Close are there, '
   +JSON.stringify({focus:pop.focus,small:pop.small,ai:pop.ai,btns:pop.btns}));
  ok(pop.added&&pop.added.closed&&JSON.stringify(pop.added.on)===JSON.stringify([1,3])&&pop.added.at==='07:30'&&/^Added\./.test(pop.added.said),
   'RW8: '+tag+'Add writes the days and the time picked and says so, '+JSON.stringify([pop.pressed,pop.added]));
  ok(JSON.stringify(pop.joined)===JSON.stringify([1,3,5]),'RW8: '+tag+'adding the same practice on another day joins the days, '+JSON.stringify(pop.joined));
  ok(pop.bad&&pop.bad.same&&/HH:MM/.test(pop.bad.said)&&pop.badRead===false,
   'RW8: '+tag+'a time of 24:00 is refused by name and writes nothing, and a stored 7:5 is left out on the read, '+JSON.stringify([pop.bad,pop.badRead]));
  ok(/07:30$/.test(pop.block||''),'RW8: '+tag+'the block on Tuesday says its kind, its state and its time, '+JSON.stringify(pop.block));
  /* ---- RW9: every control the Today list carried has a route from a pop-up or a tile ---- */
  const rt=await pg.evaluate(async(seed)=>{
   const w=ms=>new Promise(r=>setTimeout(r,ms||150)), card=()=>document.getElementById('sheet-card');
   const has=s=>!!card().querySelector(s), out={};
   const days=()=>[...document.querySelectorAll('#rit .rv-week .rv-wd1')];
   const blockOn=(col,nm)=>[...days()[col].querySelectorAll('button.rv-blk')].filter(b=>b.getAttribute('data-nm')===nm)[0];
   /* today is Monday, column 1; Noting Meditation runs every day */
   let b=blockOn(1,'Noting Meditation'); if(!b)return {none:'noting'};
   b.click(); await w();
   out.today={timer:has('[data-sh="ptimer"]'), done:has('[data-sh="log"]'), edit:has('[data-sh="edit"]'), stop:has('[data-sh="pstop"]'),
    when:has('[data-sh="pd"]'), change:has('[data-sh="pset"]'), kind:has('.rv-kch')};
   card().querySelector('[data-sh="ptimer"]').click(); await w(1200);
   const run=RIT.run&&ritPlans().filter(p=>p.id===RIT.run.id)[0];
   out.timer={run:run?ritName(run.steps):null, clock:((card().querySelector('[data-tmr]')||{}).textContent||'')};
   card().querySelector('[data-sh="ptimer"]').click(); await w(); out.timer.off=!RIT.run;
   sheetShut();
   /* Saturday, column 6, carries the release schedule */
   const rel=[...days()[6].querySelectorAll('button.rv-blk[data-kind="rel"]')][0];
   if(rel){rel.click(); await w(); out.rel={now:has('[data-sh="prel"]'), stop:has('[data-sh="pstop"]')}; sheetShut();}
   /* said: the affirmation card's pop-up, every line with its ring */
   document.querySelector('#flownew [data-act="aff-pop"].rv-cfo').click(); await w();
   const n=ritAffirm(ritRead()).length, rings=[...card().querySelectorAll('[data-sh="said"]')];
   out.said={n, rings:rings.length};
   rings[0].click(); await w(200);
   out.said.rec=ritMore().said.some(x=>x[0]===ritToday0());
   out.said.pressed=(card().querySelector('[data-sh="said"]')||{}).getAttribute?card().querySelector('[data-sh="said"]').getAttribute('aria-pressed'):null;
   /* and the set placed on Wednesday and Friday puts a block on those days only */
   for(const wd of [6,0,1,3,5]){card().querySelector('[data-sh="pd"][data-d="'+wd+'"]').click(); await w(40);}
   card().querySelector('[data-sh="paffset"]').click(); await w(250);
   out.affDays=days().map((d,i)=>d.querySelectorAll('button.rv-blk[data-kind="aff"]').length?i:-1).filter(i=>i>=0);
   out.affFirst=days().filter(d=>d.querySelector('button.rv-blk[data-kind="aff"]')).every(d=>d.querySelector('button.rv-blk').getAttribute('data-kind')==='aff');
   /* did: the challenge's pop-up */
   const ct=document.querySelector('#rit .rv-tchal .rv-tnm'); if(ct){ct.click(); await w(); out.did={ring:has('[data-sh="did"]'), ai:has('.src-mk')}; sheetShut();}
   return out;},seed);
  ok(!rt.none&&rt.today&&Object.values(rt.today).every(Boolean),
   'RW9: '+tag+'today\'s block opens a pop-up with the Timer, Done, Edit, Stop all days, its kind and its When with Change days, '+JSON.stringify(rt.today||rt));
  ok(rt.timer&&rt.timer.run==='Noting Meditation'&&/^\d+:\d\d$/.test(rt.timer.clock)&&rt.timer.off,
   'RW9: '+tag+'the Timer in the pop-up runs for that ritual, counts in the pop-up, and the same press stops it, '+JSON.stringify(rt.timer));
  ok(rt.rel&&rt.rel.now&&rt.rel.stop,'RW9: '+tag+'a release schedule\'s block carries Release now and Stop all days, '+JSON.stringify(rt.rel));
  ok(rt.said&&rt.said.n>0&&rt.said.rings===rt.said.n&&rt.said.rec&&rt.said.pressed==='true',
   'RW9: '+tag+'every affirmation line has its said ring in the pop-up, and one press marks today, '+JSON.stringify(rt.said));
  ok(JSON.stringify(rt.affDays)===JSON.stringify([3,5])&&rt.affFirst,
   'RW9: '+tag+'the affirmation set placed on Wednesday and Friday is one block on those days and first in each, '+JSON.stringify([rt.affDays,rt.affFirst]));
  ok(rt.did&&rt.did.ring&&rt.did.ai,'RW9: '+tag+'a challenge\'s pop-up carries its did ring and its who line is marked as Source AI\'s, '+JSON.stringify(rt.did));
  /* ---- RW10: the lists under the week are gone, and so is the repeated row ---- */
  const gone=await pg.evaluate(()=>{
   const rit=document.getElementById('rit'), six=rit.querySelector('.rv-six');
   const strip=[...document.querySelectorAll('#flowhd .acs')].map(e=>({k:e.className.replace(/.*acs-/,''),tip:e.getAttribute('data-tip')||'',lab:e.getAttribute('aria-label')||''}));
   return {lists:rit.querySelectorAll('.rv-goals,.rv-act,.rv-grits,.rv-aff,.rv-chal,.rv-list,.rv-key').length,
    figs:rit.querySelectorAll('.rv-sfigs,.rv-figs,.rv-sext').length,
    order:six?[...six.children].map(e=>(e.className.match(/rv-(top|week|c-ok|c-keep|c-ana)\b/)||[])[1]||e.className):[],
    strip, chain:rit.querySelectorAll('.rv-chain').length};});
  ok(gone.lists===0,'RW10: '+tag+'no Today list, rituals list, affirmations list, challenges list or Done, Planned, Missed key is left on the stage, '+gone.lists);
  ok(gone.figs===0&&gone.chain===0,'RW10: '+tag+'the Kept, Missed, Practised, Marks earned row and the chain are off the centre, '+JSON.stringify([gone.figs,gone.chain]));
  ok(JSON.stringify(gone.order.slice(0,2))===JSON.stringify(['top','week']),'RW10: '+tag+'the stage reads top row, then the week, '+JSON.stringify(gone.order));
  ok(gone.strip.length===4&&JSON.stringify(gone.strip.map(x=>x.k))===JSON.stringify(['streak','miss','mins','marks'])&&gone.strip.every(x=>x.tip.length>15&&x.lab),
   'RW10: '+tag+'the strip at the top right carries Streak, Missed, Practised and Marks, each with its meaning on the press, '+JSON.stringify(gone.strip));

  /* ---- RW11: nothing overlaps, and nothing runs off the screen ---- */
  const ov=await pg.evaluate(()=>{
   if(typeof sheetShut==='function')sheetShut();
   const sel='#rit .rv-ttl, #rit button.rv-blk, #rit .rv-wch, #rit .rv-wdh, #rit .rv-kch, #flownew .rv-cf, #flownew .rv-cf button, #flownew .rv-cfr, #flownew .rv-via, #flowhd .acs';
   const els=[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';});
   const R=els.map(e=>e.getBoundingClientRect()), hit=[];
   for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
    if(els[i].contains(els[j])||els[j].contains(els[i]))continue;
    const a=R[i], b=R[j], x=Math.min(a.right,b.right)-Math.max(a.left,b.left), y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
    if(x>1&&y>1)hit.push([els[i].className.split(' ')[0]+':'+(els[i].textContent||'').trim().slice(0,14),els[j].className.split(' ')[0]+':'+(els[j].textContent||'').trim().slice(0,14)]);}
   const cols=[...document.querySelectorAll('#rit .rv-week .rv-wd1')].map(e=>Math.round(e.getBoundingClientRect().width));
   const rows=[...document.querySelectorAll('#rit .rv-week .rv-wd1')].map(e=>Math.round(e.getBoundingClientRect().height));
   return {n:els.length, hit:hit.slice(0,6), sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, cols:[...new Set(cols)], rows:[...new Set(rows)]};});
  ok(ov.n>10&&ov.hit.length===0,'RW11: '+tag+'no tile, block, day head, key, card or chip overlaps another, '+ov.n+' measured, '+JSON.stringify(ov.hit));
  ok(ov.sw<=ov.cw,'RW11: '+tag+'the page does not scroll sideways, '+JSON.stringify([ov.sw,ov.cw]));
  ok(ov.cols.length===1&&ov.rows.length===1,'RW11: '+tag+'every day of the week is one width and one height, so the week is one clean rectangle, '+JSON.stringify([ov.cols,ov.rows]));

  /* ---- RW12: every symbol on the new parts carries its meaning ---- */
  const un=await pg.evaluate(()=>{
   const roots=['#rit .rv-top','#rit .rv-week','#flownew .rv-sug','#flowhd .acs-row'].map(s=>document.querySelector(s)).filter(Boolean);
   const bare=[];
   roots.forEach(r=>r.querySelectorAll('svg').forEach(sv=>{
    const vis=sv.getBoundingClientRect(); if(!vis.width)return;
    let e=sv, ok=false;
    while(e&&e!==r.parentNode){if((e.getAttribute&&((e.getAttribute('data-tip')||'').length>8))){ok=true;break;}
     if(e.tagName==='BUTTON'&&(e.getAttribute('aria-label')||e.textContent.trim()).length>3){ok=true;break;} e=e.parentNode;}
    if(!ok)bare.push((sv.parentNode.className||sv.parentNode.tagName)+'');}));
   return {roots:roots.length, bare};});
  ok(un.roots===4&&un.bare.length===0,'RW12: '+tag+'every mark on the top row, the week, Called for and the strip is inside a carrier of its meaning or a named press, bare: '+JSON.stringify(un.bare.slice(0,6)));
  ok(err.length===0,'RW0: '+tag+'no page errors, '+err.slice(0,3).join(' | '));
  }catch(e){ok(false,'RW0: '+tag+'the group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
 }
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed'+(MUT?' (mutant '+MUT+')':'')+' =====');
 process.exit(FAIL?1:0);
})();
