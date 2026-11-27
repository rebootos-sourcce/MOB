/* dw-avatar-helper and the Avatar module round, 21 November. One gate for
   the seven pieces that landed together, because each one reads another:

   1. avatarBecoming (engine/avatar.js), the one call the Avatar page and the
      Discover dashboard's Avatar card both read. REPRODUCED FIRST, on a real
      roster profile, before the helper was trusted: the card's old ring was
      done over done plus missed off CURP.rituals (stmkAvatar before this
      round), and that figure is recomputed below from the record and shown
      to differ from the page's own Whole on the same profile. Then the two
      surfaces are read again through the helper and must agree.
   2. the card itself: one percent, the Whole, no done or missed counts, no
      red, both people named on hover.
   3, 4. the Release and Become panels stand where Root Energetics and
      Selection stand, on the Avatar page only.
   5. the potential slider: 100 leaves nothing held, letting go is today.
   6. every one of the 21 questions passes srcVet's ten points.
   7. an answer is heard behind a Yes, and a pass is Self-Silencing, never
      Lying.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node tests/dashavatar.js */
const path=require('path'), fs=require('fs');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};

/* ---- the engine half, no browser ---- */
const E=require(path.resolve(process.env.ENGINE||'engine.js'));
console.log('\n=== avatarBecoming, the exclusions, on rows built to the shape avRows returns ===');
{
 const rows=[
  {pair:{id:'a',seat:'Root'},  gap:{seat:'Root',load:3,clear:false}},   /* 1-3/6 = .5 */
  {pair:{id:'b',seat:'Root'},  gap:{seat:'Root',load:6,clear:false}},   /* no starting weight: out */
  {pair:{id:'c',seat:'Heart'}, gap:{seat:'Heart',load:0,clear:true}},   /* written at a clear point: out */
  {pair:{id:'d',seat:'Solar'}, gap:{seat:'Solar',load:2,clear:false}}]; /* 1-2/8 = .75 */
 const B=E.avatarBecoming({rituals:[],meter:{unique:[]}},rows,{a:6,d:8});
 ok(B.left.nostart===1&&B.left.clear===1,'one pair left out for no starting weight, one for a clear point, '+JSON.stringify(B.left));
 ok(B.used===2,'two pairs read, '+B.used);
 ok(Math.abs(B.areas.Root.pct-0.5)<1e-9&&B.areas.Root.n===1,'Root reads its one weighted pair, not the unweighted one as nought');
 ok(!B.areas.Heart,'a pair at a clear point does not read a hundred, it is not read at all');
 ok(Math.abs(B.areas.Solar.pct-0.75)<1e-9,'Solar 75');
 ok(B.pct===null&&B.whole.reason==='unread','nothing done reads the dash, never a nought');
 const p2={rituals:[{t:Date.now(),done:true}],meter:{unique:[]}};
 const B2=E.avatarBecoming(p2,[],{});
 ok(B2.pct===E.wholeOf(p2).pct&&B2.pct>0,'the percent is wholeOf\'s and nothing else, '+B2.pct);
}
console.log('\n=== avatarPotential, 0 is today and 100 is nothing held ===');
{
 const bank=E.W.filter(n=>n.cf).slice(0,6).map((n,i)=>({i:n.i,b:n.b,cf:n.cf,sq:4+i}));
 const P0=E.avatarPotential(bank,0), P100=E.avatarPotential(bank,100), P50=E.avatarPotential(bank,50);
 ok(P0.heldN===bank.length,'at 0 every banked address is still held, '+P0.heldN);
 ok(P100.heldN===0&&Object.values(P100.sq).every(v=>v===0),'at 100 every banked pattern is released');
 ok(P50.heldN===bank.filter(n=>n.sq*0.5>=4).length,'at 50 an address is held only if half of it still reaches 4');
 ok(E.AV_POT_STOPS.length===11&&E.AV_POT_STOPS[0]===0&&E.AV_POT_STOPS[10]===100,'eleven stops, 0 to 100 in tens');
}
console.log('\n=== the 21 questions, each through the ten points ===');
{
 const src=fs.readFileSync('atuned_src/ui/avatarui.js','utf8');
 const i=src.indexOf('var AV_ASK='), j=src.indexOf('}};',i);
 const ASK=(0,eval)('('+src.slice(i+11,j+2)+')');
 let n=0;
 Object.keys(ASK).forEach(b=>ASK[b].ask.forEach(q=>{n++;
  const r=E.srcVet({q,family:'body',dim:'body',target:null},{text:'',ledger:null,asked:[]});
  ok(r.ok,b+': "'+q+'" fails '+r.fails.map(f=>f.n+' '+f.why).join('; '));}));
 ok(n===21,'there are 21, read off the table, '+n);
 /* the check is checked against a known bad line first, so a gate that
    passes everything cannot pass here */
 ok(!E.srcVet({q:'When did you feel alone? What did your chest do?',family:'body',dim:'body'},{text:'',ledger:null,asked:[]}).ok,
  'a line the old table carried still fails, so the gate can fail');
}

/* ---- the browser half ---- */
(async()=>{
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(b);
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
 await p.goto(FILE);
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}

 console.log('\n=== reproduce first: the card and the page disagreed on a real profile ===');
 const rep=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  /* the person's own record, with a real mix of done and missed days, which
     is what the old ring divided */
  loadP(0); CURP.rituals=[];
  for(let d=0;d<6;d++)CURP.rituals.push({t:Date.now()-d*86400000,min:5,steps:['escan'],done:true});
  for(let d=8;d<10;d++)CURP.rituals.push({t:Date.now()-d*86400000,min:5,steps:['escan'],done:false});
  const rit=CURP.rituals, lost=rit.filter(x=>x.done===false).length;
  const old=Math.round(100*(rit.length-lost)/rit.length);
  setTab(TAB.INTAKE); AV.sub='becoming'; AV.sig=''; renderAvatar(); await w(60);
  const page=avState().overall;
  /* THE CARD LEFT DISCOVER, 27 November: the Journal draws none of the seven
     and the Imprints page none either. Its code stays, because he is placing
     the cards himself, so it is read the way stRender built it, through
     stMiniShell and stMiniAvatar, into a box of this gate's own */
  setTab(TAB.STORY); stRender(); await w(60);
  const gone=['stavatar','stmasks','stcompass','stboundary','stbody','stfield','stsuperego'].filter(id=>document.getElementById(id));
  setTab(TAB.IMPRINTS); await w(60);
  gone.push(...['stavatar','stmasks','stmini6'].filter(id=>document.getElementById(id)));
  setTab(TAB.STORY); await w(30);
  const box=document.getElementById('tcards')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tcards'}));
  box.innerHTML=stMiniShell('stavatar','Avatar',stMiniAvatar(compute()),'stavatar');
  const card=document.querySelector('#tcards #stavatar');
  const g=card&&card.querySelector('.stmk-av-whole');
  return {gone, old, page:page===null?null:Math.round(page*100), help:avBecomingNow().pct,
   cardTip:g&&g.getAttribute('data-tip-t'), text:card?card.innerText:'',
   be:(card.querySelector('.stmk-av-be')||{getAttribute:()=>null}).getAttribute('data-tip-t'),
   shed:(card.querySelector('.stmk-av-shed')||{getAttribute:()=>null}).getAttribute('data-tip-t'),
   strokes:[...card.querySelectorAll('[stroke]')].map(e=>e.getAttribute('stroke'))};});
 ok(rep.gone.length===0,'27 November: no card of the seven is drawn on the Journal or the Imprints page, '+JSON.stringify(rep.gone));
 ok(rep.old!==rep.page,'reproduced: the old card ring read '+rep.old+' while the page read '+rep.page);
 ok(rep.page!==null&&rep.page===rep.help,'the page reads the helper, '+rep.page+' and '+rep.help);
 ok(rep.cardTip==='Whole, '+rep.help+'%','the card reads the same helper, its hover says '+rep.cardTip);
 ok(rep.text.indexOf(rep.help+'%')>=0,'the card prints the one whole percent');
 ok(!/done|missed|streak|since/i.test(rep.text),'no done, missed, streak or change since last time on the card: '+JSON.stringify(rep.text));
 ok(rep.strokes.every(s=>!/red|#c0|#e0|#ff|--hot|--fail/i.test(s)),'no red stroke on the card, '+rep.strokes.join(' '));
 ok(rep.be&&rep.shed,'both people have a hover, '+rep.be+' / '+rep.shed);
 const named=await p.evaluate(async()=>{
  CURP.avatar=CURP.avatar||avatarBlank(); CURP.avatar.name='The Builder'; CURP.avatar.shedName='The Firefighter';
  const box=document.getElementById('tcards'); box.innerHTML=stMiniShell('stavatar','Avatar',stMiniAvatar(compute()),'stavatar');
  await new Promise(r=>setTimeout(r,40));
  const c=document.querySelector('#tcards #stavatar');
  return [c.querySelector('.stmk-av-be').getAttribute('data-tip-t'),c.querySelector('.stmk-av-shed').getAttribute('data-tip-t')];});
 ok(named[0]==='Becoming: The Builder'&&named[1]==='Releasing: The Firefighter','their real names on hover, '+named.join(' / '));

 console.log('\n=== the two panels replace Root Energetics and Selection, on the Avatar page only ===');
 const rails=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  const vis=s=>{const e=document.querySelector(s); return !!e&&getComputedStyle(e).display!=='none';};
  /* the left column starts shut by his ruling and setTab paints it so, so
     it is opened after each tab change: a shut column hides every section */
  setTab(TAB.INTAKE); colFoldPaint(false); AV.sub='becoming'; renderAvatar(); await w(60);
  const av={rel:vis('.lsec[data-sec="avrel"]'), bec:vis('.lsec[data-sec="avbec"]'),
   en:vis('.lsec[data-sec="energetics"]'), sel:vis('.lsec[data-sec="sel"]'),
   relTxt:document.getElementById('avrel').innerText, becTxt:document.getElementById('avbec').innerText};
  setTab(TAB.FIELD); colFoldPaint(false); await w(60);
  const fd={rel:vis('.lsec[data-sec="avrel"]'), bec:vis('.lsec[data-sec="avbec"]'),
   en:vis('.lsec[data-sec="energetics"]'), sel:vis('.lsec[data-sec="sel"]')};
  return {av,fd};});
 ok(rails.av.rel&&!rails.av.en,'Avatar: Release shows and Root Energetics does not');
 ok(rails.av.bec&&!rails.av.sel,'Avatar: Become shows and Selection does not');
 ok(!rails.fd.rel&&!rails.fd.bec&&rails.fd.en&&rails.fd.sel,'Field: Root Energetics and Selection are back, the two panels are gone');
 ok(/Heard/.test(rails.av.relTxt)&&/Banked/.test(rails.av.relTxt),'Release carries Heard and Banked');
 ok(/Rituals/.test(rails.av.becTxt)&&/Lines/.test(rails.av.becTxt),'Become carries Rituals and Lines');

 console.log('\n=== the banked list is the engine\'s held list, in the release order ===');
 const bank=await p.evaluate(()=>{loadP(2); setTab(TAB.INTAKE); AV.sub='becoming'; renderAvatar();
  const r=compute(), eng=r.loaded.filter(n=>n.cf).map(n=>n.i).sort((a,b)=>a-b);
  const mine=avBanked().map(n=>n.i), ranked=avRank(W.filter(n=>n.cf&&n.sq>=4)).map(n=>n.i);
  return {eng, mine:mine.slice().sort((a,b)=>a-b), order:mine.join(','), ranked:ranked.join(','),
   rows:[...document.querySelectorAll('#avrel .avr-bank b')].map(e=>e.textContent),
   names:avBanked().slice(0,8).map(n=>avTagNm(n.k))};});
 ok(JSON.stringify(bank.eng)===JSON.stringify(bank.mine)&&bank.eng.length>0,'the Banked rows are compute().loaded with a channel, '+bank.eng.length+' addresses');
 ok(bank.order===bank.ranked,'in avRank\'s order, the one every release door uses');
 ok(JSON.stringify(bank.rows)===JSON.stringify(bank.names),'the rail draws them in that order');

 console.log('\n=== the potential slider, on the same profile ===');
 const pot=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  const held=()=>[...document.querySelectorAll('.av-ring.avh .avs-n')].reduce((t,e)=>t+(+e.textContent),0);
  const el=document.querySelector('[data-avpot]'), out={today:held(), min:el.min, max:el.max, step:el.step};
  el.value='100'; el.dispatchEvent(new Event('input')); await w(40);
  out.at100=held(); out.lab=document.querySelector('[data-avpotv]').textContent;
  out.loadedStill=compute().loaded.length;
  document.dispatchEvent(new PointerEvent('pointerup')); await w(500);
  out.back=held(); out.val=document.querySelector('[data-avpot]').value;
  return out;});
 ok(pot.min==='0'&&pot.max==='100'&&pot.step==='10','stops 0 to 100 in tens');
 ok(pot.today>0&&pot.at100===0,'held today '+pot.today+', at 100 nothing held');
 ok(/100 percent released, nothing held/.test(pot.lab),'the label says it, '+pot.lab);
 ok(pot.loadedStill>0,'a preview writes nothing: the engine still reads '+pot.loadedStill+' held');
 ok(pot.back===pot.today&&pot.val==='0','let go, it springs back to today');

 console.log('\n=== Source AI\'s corner, and the sniffer behind a Yes ===');
 const ai=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  loadP(0); CURP.avatar=avatarBlank(); setTab(TAB.INTAKE); AV.sub='becoming'; AV.seat='Root'; AV.ask={}; renderAvatar(); await w(40);
  const o={corner:!!document.querySelector('.avh-ai .avai'), marked:!!document.querySelector('.avai .src-mk')&&!!document.querySelector('.avai-q.src-ai'),
   q:(document.querySelector('[data-avaiq]')||{}).textContent};
  document.querySelector('[data-avaiin]').value='I kept it to myself and felt ashamed';
  document.querySelector('[data-avaisay]').click(); await w(40);
  o.heard=[...document.querySelectorAll('#avrel .avr-heard b')].map(e=>e.textContent);
  o.tagsBefore=JSON.stringify(CURP.avatar.tags||{});
  const y=[...document.querySelectorAll('#avrel [data-avhyes]')].filter(b=>BY[+b.dataset.avhyes].k==='People Pleasing')[0];
  y&&y.click(); await w(40);
  o.tagged=!!(CURP.avatar.tags&&CURP.avatar.tags.Throat&&CURP.avatar.tags.Throat.add.indexOf('People Pleasing')>=0);
  o.heardAfter=[...document.querySelectorAll('#avrel .avr-heard b')].map(e=>e.textContent);
  /* a fresh session, a pass with nothing said */
  AV.said={}; AV.quiet={}; AV.no={}; renderAvatar(); await w(20);
  document.querySelector('[data-avaiskip]').click(); await w(40);
  o.quiet=[...document.querySelectorAll('#avrel .avr-heard b')].map(e=>e.textContent);
  o.lying=/Lying/.test(document.getElementById('avrel').innerText);
  return o;});
 ok(ai.corner&&ai.marked,'Source AI sits in the hero\'s right corner, with the mark and the src-ai treatment');
 ok(ai.q==='Think of the last night you lay awake over money. What did your body do?','it asks the first Root question, '+ai.q);
 ok(ai.heard.indexOf('People Pleasing')>=0&&ai.tagsBefore==='{}','an answer is heard as Heard rows and nothing is written yet, '+ai.heard.join(', '));
 ok(ai.tagged&&ai.heardAfter.indexOf('People Pleasing')<0,'Yes puts it on the avatar, the release order, and the row leaves Heard');
 ok(ai.quiet.length===1&&ai.quiet[0]==='Self-Silencing','a pass reads as Self-Silencing, '+ai.quiet.join(', '));
 ok(!ai.lying,'and never as Lying');

 /* AVATAR, BOUNDARY AND MASKS, 21 November, his words: "we're going to
    revive the masks, but we're going to move them to the avatar page. So it'll
    be avatar, boundary, and masks." Character is held off the bar, so this is
    the only place the five are drawn. Held here: the pill names, the roster
    read off MASKS_READ, every arc equal to the Character page's own arc on the
    same profile, every sign's meaning on hover, the press kept where Character
    keeps it, the Dashboard card's door, and the tier's lock. Checked against
    the build before this change first: there is no masks pill there, so every
    check below the first fails by name. */
 console.log('\n=== the masks, on the Avatar page ===');
 const mk=await p.evaluate(async()=>{
  const w=t=>new Promise(r=>setTimeout(r,t));
  const had=window.SIGHT_PLAN, o={};
  const draw=async()=>{setTab(TAB.INTAKE); AV.sub='masks'; AV.sig=''; renderAvatar(); await w(60);};
  /* below the tier first: the lock's panel and nothing of the masks */
  window.SIGHT_PLAN={tier:'free',status:'active'}; loadP(2); await draw();
  o.lowSees=lockSees('mask'); o.lowPanel=!!document.querySelector('#avbody .avmk .lk-panel');
  o.lowMasks=document.querySelectorAll('#avbody [data-avmask]').length;
  window.SIGHT_PLAN={tier:'four',status:'active'}; loadP(2); await draw();
  o.sees=lockSees('mask');
  o.pills=[...document.querySelectorAll('#avbody .avs-subs [data-avsub]')].map(e=>e.dataset.avsub+'='+e.textContent.trim());
  const B=()=>[...document.querySelectorAll('#avbody [data-avmask]')];
  o.names=B().map(e=>e.dataset.avmask).join(); o.roster=MASKS_READ.map(m=>m.nm).join();
  o.arcs=B().map(e=>e.querySelector('.ld').getAttribute('stroke-dasharray')).join('|');
  o.lit=B().filter(e=>!/^0 /.test(e.querySelector('.ld').getAttribute('stroke-dasharray'))).length;
  o.tips=B().map(e=>e.getAttribute('data-tip')||'');
  o.ids=B().map(e=>e.querySelector('linearGradient').id);
  /* the Character page's own arcs, the same person, the same moment */
  setTab(TAB.MASKS); render(); await w(200);
  o.charArcs=[...document.querySelectorAll('#masksview [data-chmask]')].map(e=>e.querySelector('.ld').getAttribute('stroke-dasharray')).join('|');
  await draw();
  /* a build with no masks view fails the checks below by name, never by a throw */
  const two=B()[2]; if(two){two.click(); await w(60);}
  o.picked=two?two.dataset.avmask:'(no mask drawn)'; o.pressed=(document.querySelector('#avbody [data-avmask][aria-pressed="true"]')||{dataset:{}}).dataset.avmask;
  o.kept=CURP.ui&&CURP.ui.chmask; o.head=(document.querySelector('#avbody .avmk-head b')||{}).textContent;
  /* the first cut's Read this mask wrote into Selection, hidden on this page */
  o.selHidden=getComputedStyle(document.querySelector('.lsec[data-sec="sel"]')).display==='none';
  o.readBtn=document.querySelectorAll('#avbody .avmk [data-avmread],#avbody .avmk #chread').length;
  /* the Dashboard's Masks card, while Character is held */
  o.held=!tabOnBar(TAB.MASKS);
  /* the card is off Discover since 27 November and its link still works, so
     it is built the way stRender built it, in a box of this gate's own */
  setTab(TAB.STORY); stRender(); await w(60);
  const tb=document.getElementById('tcards')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'tcards'}));
  tb.innerHTML=stMiniShell('stmasks','Masks',stMiniMasks(compute()),'stmasks');
  const card=document.querySelector('#tcards [data-stgo="stmasks"]'); o.door=!!card;
  if(card){card.click(); await w(80);}
  o.landTab=S.tab===TAB.INTAKE; o.landSub=AV.sub; o.landMasks=B().length;
  window.SIGHT_PLAN=had;
  return o;});
 /* his three words, in his order; a fourth pill only if Archetypes is shown again */
 ok(mk.pills.slice(0,3).join()==='becoming=Avatar,purpose=Boundary,masks=Masks','the pills read Avatar, Boundary, Masks, '+mk.pills.join(', '));
 ok(!mk.lowSees&&mk.lowPanel&&mk.lowMasks===0,'below the mask tier: the lock\'s panel and no mask drawn, '+JSON.stringify([mk.lowSees,mk.lowPanel,mk.lowMasks]));
 ok(mk.sees&&mk.names===mk.roster&&mk.names.length>0,'at the tier: every mask MASKS_READ holds, in its order, '+mk.names);
 ok(mk.arcs===mk.charArcs,'every arc is the Character page\'s own arc on the same person, '+mk.arcs+' against '+mk.charArcs);
 ok(mk.lit>0,'the arcs are a reading and not all empty, '+mk.lit+' lit');
 ok(mk.tips.every(t=>/^Worn over the /.test(t)&&/ The arc is the charge it carries: /.test(t)),'every sign says where it is worn and what its arc is, on hover');
 ok(mk.tips.every(t=>!/\b0%/.test(t)),'no tip carries a zero as a percent');
 ok(mk.ids.every(i=>/^avmlg/.test(i)),'the Avatar\'s gradients have ids of their own, so the held page cannot shadow them, '+mk.ids[0]);
 ok(mk.pressed===mk.picked&&mk.kept===mk.picked&&mk.head===mk.picked,'a press picks the mask and keeps it where Character keeps it, '+JSON.stringify([mk.picked,mk.pressed,mk.kept,mk.head]));
 ok(!mk.selHidden||mk.readBtn===0,'no press on the masks writes into Selection while Selection is hidden here, '+mk.readBtn+' found');
 ok(mk.held&&mk.door&&mk.landTab&&mk.landSub==='masks'&&mk.landMasks>0,'the Dashboard\'s Masks card opens them on the Avatar while Character is held, '+JSON.stringify([mk.held,mk.door,mk.landTab,mk.landSub,mk.landMasks]));

 ok(!errs.length,'no page errors, '+errs.join(' | '));
 await b.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);})();
