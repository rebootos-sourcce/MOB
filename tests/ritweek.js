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
 uneven:`document.head.insertAdjacentHTML('beforeend','<style>.rv-tiles{grid-template-columns:1fr 2fr 1fr 1fr!important}</style>');`,
 /* the did tick lost on the way from the Today list to the tile */
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
   const tiles=t?[...t.querySelectorAll('.rv-tile')].map(e=>{const r=e.getBoundingClientRect(); return {l:r.left,r:r.right,w:Math.round(r.width),t:Math.round(r.top),
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
  ok(err.length===0,'RW0: '+tag+'no page errors, '+err.slice(0,3).join(' | '));
  }catch(e){ok(false,'RW0: '+tag+'the group threw, '+String(e.message).split('\n')[0]);}
  await pg.close();
 }
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed'+(MUT?' (mutant '+MUT+')':'')+' =====');
 process.exit(FAIL?1:0);
})();
