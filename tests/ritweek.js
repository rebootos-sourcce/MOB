/* ============================================================
   THE RITUAL PAGE AS A CENTRE AND A RAIL, GATED. node tests/ritweek.js

   The approved rebuild of 21 November (ui/ritweek.js says what it is and the
   words it answers). Every check opens with its rule, RW1 and on, and every
   expected value is worked out here from the seed and the tables, never by
   asking the page's own function for the answer it is checked on.

   RW1 runs first and headless, off the source files, so a practice added to
   the library with no kind fails here before a browser is started.

   PROVEN AGAINST MUTANTS. RW_MUTANT=<name> breaks one thing in the page after
   it boots (MUTANTS below); the rule that guards it must fail. Run from the
   repo root, with NODE_PATH at playwright. SHOTS=<dir> also saves pictures.
   ============================================================ */
const path=require('path'), fs=require('fs'), vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||path.join(ROOT,'source.html'))+'?dev=1';
const MUT=process.env.RW_MUTANT||'', SHOTS=process.env.SHOTS||'';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

/* ---- RW1, headless: every practice has a kind, one of the four ---- */
{const c={console}; vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(ROOT,'engine.js'),'utf8')+';this.__P=PRACTICE;',c);
 const src=fs.readFileSync(path.join(ROOT,'atuned_src/ui/ritweek.js'),'utf8');
 const m=src.match(/var RIT_KIND_OF=(\{[\s\S]*?\});/);
 ok(!!m,'RW1: RIT_KIND_OF is found in ui/ritweek.js');
 const K=m?vm.runInNewContext('('+m[1]+')'):{};
 if(MUT==='nokind')delete K.listen;
 const set=['aff','act','med','rel'];
 const bad=c.__P.filter(p=>set.indexOf(K[p.k])<0).map(p=>p.k);
 ok(c.__P.length>0&&bad.length===0,'RW1: every practice in the library has a kind from the four ('+c.__P.length+' read), none missing: '+bad.join(', '));
 const extra=Object.keys(K).filter(k=>!c.__P.some(p=>p.k===k));
 ok(extra.length===0,'RW1: the kind table names no practice the library lacks: '+extra.join(', '));}

const MUTANTS={
 /* the week coloured by seat again */
 seatcol:`ritKindCol=function(){return 'var(--accent)';};`,
 /* a day's blocks in the order they were read */
 noorder:`(function(){var f=ritWeekBlocks; ritWeekBlocks=function(a,d,st){return f(a,d,st).slice().reverse();};})();`,
 /* the goal and the challenges left off the top */
 notop:`ritTopHtml=function(){return '';};`,
 /* tiles of uneven width, the asymmetry ruled out on 14 and 16 November */
 uneven:`document.head.insertAdjacentHTML('beforeend','<style>.rv-ttls{grid-template-columns:1fr 2fr 1fr 1fr!important}</style>');`,
 /* the Today card back under the week */
 today:`(function(){var f=ritStageHtml; ritStageHtml=function(st,P){return f(st,P).replace('<section class="rv-sec rv-week"','<section class="rv-sec rv-act rv-goals"><ol class="rv-list"><li>x</li></ol></section><section class="rv-sec rv-week"');};})();`,
 /* the long card back: the description on the face */
 fatcard:`(function(){var f=ritBankCard; ritBankCard=function(x,i,st){return f(x,i,st).replace(/<\\/li>$/,'<p class="rv-sgd">A long line.</p></li>');};})();`,
 /* the Timer lost on the way into the pop-up */
 notimer:`ritRunActs=function(){return '';};`,
 /* the said rings lost on the way into the pop-up */
 nosaid:`ritPopTick=function(){return '';};`,
 /* a drop elsewhere writing anyway */
 dropany:`(function(){var f=ritDayAt; ritDayAt=function(x,y){var d=f(x,y); return d==null?ritToday0()+1:d;};})();`};

if(require.main===module)(async()=>{
 const {chromium}=require('playwright');
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(browser);
 const {FULL_SIGHT}=require('./seed.js');
 /* Monday 23 February 2026 at local noon, the fixed day flowtools.js runs
    on, so the week is Sunday 22 to Saturday 28 */
 const AT=new Date(2026,1,23,12);
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
 /* ONE SEED through the product's own writers where one exists. Four plans:
    two meditations (box, noting), one action (onerule), and one release
    schedule tied to a place held at four or more. Stored weekdays are Monday
    0, the store's own numbering. */
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
  const plans=[P('wa','box','Heart',null),P('wb','onerule','Throat',null),P('wc','noting','Crown',null),
   P('wd','slow','Root',null,held?held.i:null)];
  const wrote=ritPlanPut(plans)&&pSave();
  RIT.sel={}; RIT.order=[]; RIT.add=false; RIT.edit=null; RIT.span=null; setTab(TAB.RITUAL); ritRender();
  return {wrote, today, held:held?held.i:null};};
 const KIND={box:'med', onerule:'act', noting:'med', slow:'med'};

 for(const [W,H] of [[1600,1000],[390,844]]){
  const tag='@'+W+' ';
  const {pg,err}=await open(W,H);
  try{
  const seed=await pg.evaluate(SEED);
  await pg.waitForTimeout(600);
  ok(seed.wrote,'RW0: '+tag+'the seed was written');

  /* ---- RW2: the centre is top row, week, Called for; no Today card ---- */
  const lay=await pg.evaluate(()=>{const six=document.querySelector('#rit .rv-six');
   const kids=six?[...six.children].map(e=>e.className):[];
   return {kids, today:!!document.querySelector('#rit .rv-act,#rit .rv-goals,#rit .rv-list'),
    goalCard:!!document.querySelector('#rit .rv-c-goal'), ana:!!document.querySelector('#rit .rv-c-ana'),
    leftSug:!!document.querySelector('#flowleft .rv-sug'), cards:document.querySelectorAll('#rit .rv-sug .rv-sg1').length};});
  const ix=k=>lay.kids.findIndex(c=>c.indexOf(k)>=0);
  ok(ix('rv-top')===0,'RW2: '+tag+'the top row is first on the stage: '+lay.kids.join(' | '));
  ok(ix('rv-week')===1,'RW2: '+tag+'the week is second');
  ok(ix('rv-sug')===2&&lay.cards>0,'RW2: '+tag+'Called for is third, under the week, with cards: '+lay.cards);
  ok(!lay.today,'RW2: '+tag+'the Today card and its list are gone');
  ok(!lay.goalCard,'RW2: '+tag+'the Goal card is not on the stage (it is the tile and its pop-up)');
  ok(!lay.ana,'RW2: '+tag+'Success over time is not in the centre');
  ok(!lay.leftSug,'RW2: '+tag+'Called for is not in the left column any more');

  /* ---- RW3: the top row, Goal first, one tile per challenge, even ---- */
  const top=await pg.evaluate(()=>{const t=[...document.querySelectorAll('#rit .rv-ttl')];
   const r=t.map(e=>e.getBoundingClientRect());
   return {n:t.length, first:t[0]&&t[0].classList.contains('rv-tgoal'), nm:t[0]&&t[0].querySelector('.rv-tnm').textContent,
    chal:ritChallenge(ritRead()).length, w:r.map(x=>Math.round(x.width)),
    gaps:r.slice(1).map((x,i)=>Math.abs(x.top-r[i].top)<2?Math.round(x.left-r[i].right):null).filter(g=>g!==null),
    heads:t.every(e=>{const h=e.querySelector('.rv-tlab'); return h&&h.getAttribute('data-tip');})};});
  ok(top.first,'RW3: '+tag+'the Goal tile is first');
  ok(/^I am /.test(top.nm||''),'RW3: '+tag+'the Goal tile says the avatar line as I am: '+top.nm);
  ok(top.n===1+Math.min(3,top.chal),'RW3: '+tag+'one tile per challenge after the Goal: '+top.n+' for '+top.chal);
  ok(Math.max(...top.w)-Math.min(...top.w)<=1,'RW3: '+tag+'every tile one width: '+top.w.join(','));
  ok(top.gaps.length>0&&top.gaps.every(g=>g>=12&&Math.abs(g-top.gaps[0])<=1),'RW3: '+tag+'one even gap of 12 or more: '+top.gaps.join(','));
  ok(top.heads,'RW3: '+tag+'every tile header carries its meaning');

  /* ---- RW4: blocks are the kind's colour, ordered by kind ---- */
  const blk=await pg.evaluate((KIND)=>{const out=[];
   document.querySelectorAll('#rit .rv-wd1').forEach(li=>{const bs=[...li.querySelectorAll('button.rv-blk')];
    out.push(bs.map(b=>({nm:b.getAttribute('data-nm'), kind:b.getAttribute('data-kind'), c:b.style.getPropertyValue('--c').trim()})));});
   const nk={}; PRACTICE.forEach(p=>{nk[p.nm]=p.k;});
   return {days:out, nk};},KIND);
  const ord={aff:0,act:1,med:2,rel:3};
  const all=blk.days.flat();
  ok(all.length>0,'RW4: '+tag+'the week has blocks');
  ok(all.every(b=>b.c==='var(--kd-'+b.kind+')'),'RW4: '+tag+'every block wears its kind\'s colour');
  ok(all.filter(b=>blk.nk[b.nm]&&KIND[blk.nk[b.nm]]).every(b=>{const k=blk.nk[b.nm];
   return b.kind===(k==='slow'?'rel':KIND[k]);}),'RW4: '+tag+'each block\'s kind is its practice\'s, and a release schedule is Release');
  ok(blk.days.every(d=>d.every((b,i)=>!i||ord[d[i-1].kind]<=ord[b.kind])),'RW4: '+tag+'inside every day the blocks run Affirmation, Action, Meditation, Release');
  const key=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-week .rv-kkey .rv-kch')].map(e=>e.getAttribute('data-tip-t')+'|'+!!e.getAttribute('data-tip')));
  ok(key.join()==='Affirmation|true,Action|true,Meditation|true,Release|true','RW4: '+tag+'the week\'s key names the four kinds, each with its meaning: '+key.join());

  /* ---- RW5: Called for cards are short, the shared card ---- */
  const cf=await pg.evaluate(()=>[...document.querySelectorAll('#rit .rv-sug .rv-sg1')].map(li=>({
   d:!!li.querySelector('.rv-sgd'), seats:!!li.querySelector('.rv-tg'), name:!!li.querySelector('[data-act="bank"]'),
   yes:!!li.querySelector('.rv-yes'), no:!!li.querySelector('.rv-no'), kind:li.getAttribute('data-kind'),
   c:li.style.getPropertyValue('--c').trim(), h:Math.round(li.getBoundingClientRect().height)})));
  ok(cf.every(x=>!x.d&&!x.seats),'RW5: '+tag+'no card prints its description or seats on its face');
  ok(cf.every(x=>x.name&&x.yes&&x.no),'RW5: '+tag+'every card keeps its name press, its green and its red');
  ok(cf.every(x=>x.c==='var(--kd-'+x.kind+')'),'RW5: '+tag+'every card wears its kind\'s colour, the week\'s');
  ok(cf.every(x=>x.h<=130),'RW5: '+tag+'every card is short: '+cf.map(x=>x.h).join(','));

  /* ---- RW6: Success over time is in the rail, merged with the cubes ---- */
  const rail=await pg.evaluate(()=>{const s=document.querySelector('#flowside .rv-c-ana');
   return {in:!!s, cubes:!!(s&&s.querySelector('.rv-cubes')), sel:!!(s&&s.querySelector('select[data-act="rng"]')),
    loops:document.querySelectorAll('#flowside .rv-cubes').length,
    first:s&&document.querySelector('#flowside .rvr-wrap').firstElementChild===s};});
  ok(rail.in&&rail.first,'RW6: '+tag+'Success over time is the first card under Accountability');
  ok(rail.cubes&&rail.loops===1,'RW6: '+tag+'at one month it draws the thirty day cubes, and the rail draws them once');
  ok(rail.sel,'RW6: '+tag+'its span is one dropdown');
  await pg.selectOption('#flowside select[data-act="rng"]','3m'); await pg.waitForTimeout(200);
  const r3=await pg.evaluate(()=>({span:RIT.span, grid:!!document.querySelector('#flowside .rv-c-ana .rv-scal,#flowside .rv-c-ana .rv-syr'),
   cubes:!!document.querySelector('#flowside .rv-c-ana .rv-cubes')}));
  ok(r3.span==='3m'&&r3.grid&&!r3.cubes,'RW6: '+tag+'another span draws its own grid in the same card');
  await pg.selectOption('#flowside select[data-act="rng"]','1m'); await pg.waitForTimeout(200);

  /* ---- RW7: the Today controls are in the pop-up ---- */
  const pop=await pg.evaluate((held)=>{
   const st=ritRead(), out={};
   const find=nm=>{const d=st.today, segs=ritWeekDay(d,st); return segs.findIndex(s=>s.nm===nm);};
   let i=find('Box Breathing'); ritSashOpen(st.today,i);
   const c=document.getElementById('sheet-card');
   out.timer=!!c.querySelector('[data-sh="ptimer"]'); out.stop=!!c.querySelector('[data-sh="pstop"]');
   out.done=!!c.querySelector('[data-sh="log"]'); out.pop=RIT.pop&&RIT.pop.t;
   c.querySelector('[data-sh="ptimer"]').click();
   out.running=!!(RIT.run&&RIT.run.id==='wa'); out.counting=!!c.querySelector('[data-tmr="wa"]')&&/\d:\d\d/.test(c.querySelector('[data-tmr="wa"]').textContent);
   c.querySelector('[data-sh="ptimer"]').click(); out.stopped=!RIT.run;
   sheetShut(); RIT.pop=null;
   i=find(ritName(['slow'])); ritSashOpen(st.today,i);
   out.rel=held!=null?!!document.querySelector('#sheet-card [data-sh="prel"]'):true;
   sheetShut(); RIT.pop=null;
   ritBankOpen({t:'aff'});
   const ticks=[...document.querySelectorAll('#sheet-card [data-sh="said"]')];
   out.said=ticks.length; out.lines=ritAffirm(st).length;
   if(ticks[0]){ticks[0].click();}
   const M=ritMore(); out.saidWrote=M.said.some(x=>x[0]===st.today);
   out.saidOn=!!document.querySelector('#sheet-card [data-sh="said"][aria-pressed="true"]');
   sheetShut(); RIT.pop=null;
   const C=ritChallenge(st);
   if(C[0]){ritBankOpen({t:'chal', id:'ch:'+C[0].id});
    out.did=!!document.querySelector('#sheet-card [data-sh="did"]');
    out.miss=(document.querySelector('#sheet-card [data-sh="pmk"][aria-checked="true"]')||{}).textContent;
    out.missOwn=!!document.querySelector('#sheet-card [data-sh="pmk"][data-d="own"]');
    sheetShut(); RIT.pop=null;}
   ritBankOpen({t:'goal'}); out.goal=!!document.querySelector('#sheet-card .rv-c-goal')&&!!document.querySelector('#sheet-card .rv-chain');
   out.goalActs=[...document.querySelectorAll('#sheet-card [data-act]')].length;
   sheetShut(); RIT.pop=null;
   return out;},seed.held);
  ok(pop.pop==='blk'&&pop.done,'RW7: '+tag+'a block opens the one pop-up, with Done');
  ok(pop.timer&&pop.stop,'RW7: '+tag+'a running block\'s pop-up carries Timer and Stop');
  ok(pop.running&&pop.counting&&pop.stopped,'RW7: '+tag+'the Timer starts, counts in the pop-up and stops');
  ok(pop.rel,'RW7: '+tag+'a release schedule at a place held at four or more carries Release now');
  ok(pop.said>0&&pop.said===pop.lines,'RW7: '+tag+'the affirmations\' pop-up has a said ring per line: '+pop.said+' of '+pop.lines);
  ok(pop.saidWrote&&pop.saidOn,'RW7: '+tag+'a said ring writes today through the writer and shows it');
  ok(pop.did,'RW7: '+tag+'a challenge\'s pop-up carries its did ring');
  ok(pop.miss==='Answer why'&&pop.missOwn,'RW7: '+tag+'If I miss defaults to Answer why, with In my words beside it: '+pop.miss);
  ok(pop.goal&&pop.goalActs===0,'RW7: '+tag+'the Goal tile\'s pop-up is the goal and the chain, every press rewired to the sheet');

  /* ---- RW8: drag a card onto a day, and off any day ---- */
  if(W>=600){
   const before=await pg.evaluate(()=>JSON.stringify(ritPlans()));
   const card=await pg.$('#rit .rv-sug .rv-sg1'), tomorrow=await pg.$('#rit .rv-wd1[data-d="'+(seed.today+1)+'"]');
   const cb=await card.boundingBox(), tb=await tomorrow.boundingBox();
   /* released over the page's head, nowhere near a day */
   await pg.mouse.move(cb.x+cb.width-150,cb.y+cb.height-12); await pg.mouse.down();
   await pg.mouse.move(cb.x+40,cb.y-30,{steps:6}); await pg.mouse.move(200,20,{steps:6}); await pg.mouse.up();
   await pg.waitForTimeout(200);
   const after0=await pg.evaluate(()=>({p:JSON.stringify(ritPlans()), ghost:!!document.querySelector('.rv-ghost'), sheet:!document.getElementById('sheet').hidden}));
   ok(after0.p===before&&!after0.ghost&&!after0.sheet,'RW8: '+tag+'released anywhere but a day, it snaps back and nothing is written');
   const card2=await pg.$('#rit .rv-sug .rv-sg1'), c2=await card2.boundingBox();
   const nm=await card2.evaluate(e=>e.querySelector('[data-act="bank"]').textContent);
   await pg.mouse.move(c2.x+c2.width-150,c2.y+c2.height-12); await pg.mouse.down();
   await pg.mouse.move(tb.x+tb.width/2,tb.y+tb.height/2,{steps:12}); await pg.mouse.up();
   await pg.waitForTimeout(300);
   const after=await pg.evaluate(([nm,d])=>{const k=PRACTICE.filter(p=>p.nm===nm)[0].k;
    const ps=ritPlans().filter(p=>p.steps[0]===k&&ritActive(p,ritToday0()));
    return {n:ps.length, covers:ps.some(p=>ritCovers(p,d)), today:ps.some(p=>ritCovers(p,d-1)),
     sheet:!document.getElementById('sheet').hidden, pop:RIT.pop&&RIT.pop.t};},[nm,seed.today+1]);
   ok(after.covers&&after.n>=1,'RW8: '+tag+'dropped on tomorrow, '+nm+' is set on tomorrow');
   ok(after.sheet&&after.pop==='sug','RW8: '+tag+'and the same pop-up opens on it');
   await pg.evaluate(()=>{sheetShut(); RIT.pop=null;});}

  /* ---- RW9: nothing overlaps, nothing scrolls sideways ---- */
  const geo=await pg.evaluate(()=>{const host=document.getElementById('rit');
   const parts=[...host.querySelectorAll('.rv-ttl,.rv-sg1,.rv-wd1')];
   let hit=0; for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){const a=parts[i].getBoundingClientRect(), b=parts[j].getBoundingClientRect();
    if(parts[i].contains(parts[j])||parts[j].contains(parts[i]))continue;
    if(a.width&&b.width&&a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1)hit++;}
   return {hit, side:document.documentElement.scrollWidth>window.innerWidth+1,
    rows:[...host.querySelectorAll('.rv-wd1')].map(e=>Math.round(e.getBoundingClientRect().height))};});
  ok(geo.hit===0,'RW9: '+tag+'no tile, card or day overlaps another: '+geo.hit);
  ok(!geo.side,'RW9: '+tag+'nothing scrolls sideways');
  ok(new Set(geo.rows).size===1,'RW9: '+tag+'every day is one height: '+[...new Set(geo.rows)].join(','));

  if(SHOTS){fs.mkdirSync(SHOTS,{recursive:true});
   await pg.evaluate(()=>{ritRender();}); await pg.waitForTimeout(300);
   await pg.screenshot({path:path.join(SHOTS,'rw-'+W+'.png')});
   const st=await pg.evaluate(()=>{const s=ritRead(); const i=ritWeekDay(s.today,s).findIndex(x=>x.nm==='Box Breathing'); ritSashOpen(s.today,i); return 1;});
   await pg.waitForTimeout(300); await pg.screenshot({path:path.join(SHOTS,'rw-'+W+'-block-pop.png')});
   await pg.evaluate(()=>{sheetShut(); RIT.pop=null; ritBankOpen({t:'aff'});}); await pg.waitForTimeout(300);
   await pg.screenshot({path:path.join(SHOTS,'rw-'+W+'-aff-pop.png')});
   await pg.evaluate(()=>{sheetShut(); RIT.pop=null; const C=ritChallenge(ritRead()); if(C[0])ritBankOpen({t:'chal',id:'ch:'+C[0].id});}); await pg.waitForTimeout(300);
   await pg.screenshot({path:path.join(SHOTS,'rw-'+W+'-chal-pop.png')});
   await pg.evaluate(()=>{sheetShut(); RIT.pop=null; ritBankOpen({t:'goal'});}); await pg.waitForTimeout(300);
   await pg.screenshot({path:path.join(SHOTS,'rw-'+W+'-goal-pop.png')});
   await pg.evaluate(()=>{sheetShut(); RIT.pop=null;});
   const rail=await pg.$('#flowside .rv-c-ana'); if(rail){await rail.scrollIntoViewIfNeeded(); await rail.screenshot({path:path.join(SHOTS,'rw-'+W+'-rail.png')});}}

  ok(err.length===0,'RW10: '+tag+'no page error: '+err.join(' | '));
  }catch(e){ok(false,'RW: '+tag+'threw: '+e.message);}
  await pg.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})();
else module.exports={};
