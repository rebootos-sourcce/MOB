const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve('source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const real=[];
page.on('pageerror',e=>real.push('PAGEERROR: '+e.message));
page.on('console',m=>{if(m.type()==='error'){const t=m.text();
 if(!/ERR_CERT_AUTHORITY_INVALID|ERR_FILE_NOT_FOUND|fonts\.googleapis/.test(t))real.push(t);}});
await page.goto(FILE,{waitUntil:'load'}); await page.waitForTimeout(800);

console.log('=== figure fallback ===');
await page.evaluate(()=>setTab(TAB.ENERGY)); await page.waitForTimeout(400);
const fig=await page.evaluate(()=>({
 raster:document.querySelectorAll('#emap image.pm-art').length,
 vector:document.querySelectorAll('#emap g.pm-vec path').length,
 vecColor:(()=>{const v=document.querySelector('#emap .pm-vec');
  return v?getComputedStyle(v).color:'none'})(),
 seats:document.querySelectorAll('#emap circle.pm-seat').length}));
ok(fig.vector===1,'vector figure renders when raster is absent, got '+fig.vector);
ok(fig.vecColor!=='none'&&fig.vecColor!=='rgba(0, 0, 0, 0)','vector stroke colour resolves, got '+fig.vecColor);
ok(fig.seats===7,'7 seats drawn, got '+fig.seats);
console.log(' ',JSON.stringify(fig));

console.log('\n=== 7 energy layers, every persona ===');
const layers=['bands','sab','cx','hyper','masks','pain','nerves'];
const people=await page.evaluate(()=>PEOPLE.map(p=>p.nm));
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i); await page.waitForTimeout(90);
 await page.evaluate(()=>setTab(TAB.ENERGY)); await page.waitForTimeout(90);
 let line=[];
 for(const L of layers){
  const res=await page.evaluate(l=>{PMLAYER=l;render();
   const svg=document.querySelector('#emap svg.pm-svg');
   const shelf=document.getElementById('eshelf');
   return {nodes:svg?svg.childElementCount:0,
    shelf:shelf?shelf.childElementCount:0,
    shelfTxt:shelf?shelf.textContent.trim().length:0};},L);
  ok(res.nodes>5,nm+'/'+L+': svg empty');
  ok(res.shelfTxt>40,nm+'/'+L+': shelf empty ('+res.shelfTxt+' chars)');
  line.push(L+':'+res.nodes+'/'+res.shelfTxt);}
 console.log(' ',nm.padEnd(8),line.join('  '));}

console.log('\n=== 4 field depths, every persona ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i);
 await page.evaluate(()=>setTab(TAB.FIELD)); await page.waitForTimeout(80);
 let hits=[];
 for(let v=0;v<4;v++){
  const n=await page.evaluate(vv=>{S.view=vv;render();return HIT.length;},v);
  ok(n>100,nm+'/depth'+v+': only '+n+' hit targets');
  hits.push(n);}
 console.log(' ',nm.padEnd(8),'hit targets by depth:',hits.join(' '));}

console.log('\n=== every tab, every persona ===');
for(const nm of people){
 const i=people.indexOf(nm);
 await page.evaluate(n=>loadP(n),i);
 let line=[];
 for(let t=0;t<5;t++){
  await page.evaluate(tt=>setTab(tt),t); await page.waitForTimeout(60);
  const len=await page.evaluate(tt=>{
   const ids=['story','sum','cv','emap','ana'];
   const e=document.getElementById(ids[tt]);
   return tt===2?(typeof HIT!=='undefined'?HIT.length:0):(e?e.textContent.trim().length:0);},t);
  ok(len>50,nm+'/tab'+t+': content length '+len);
  line.push(len);}
 console.log(' ',nm.padEnd(8),line.join('  '));}

console.log('\n=== drills open and close ===');
await page.evaluate(()=>{loadP(6);setTab(TAB.FIELD);});   // Gordon, heavily loaded
await page.waitForTimeout(120);
const drills=await page.evaluate(()=>{
 const out={};
 runCoreDrill(); out.core=document.getElementById('rdrill').textContent.length;
 runLawDrill(SI[0]); out.law=document.getElementById('rdrill').textContent.length;
 runNodeDrill(W[0]); out.node=document.getElementById('rdrill').textContent.length;
 runCellDrill(0,0); out.cell=document.getElementById('rdrill').textContent.length;
 runSpDrill('sign','Leo'); out.sp=document.getElementById('rdrill').textContent.length;
 const r=compute(); if(r.sabs.length){runDrill(r.sabs[0]);out.pat=document.getElementById('rdrill').textContent.length;}
 rdClose(); out.closed=document.getElementById('rdrill').textContent.length;
 return out;});
Object.keys(drills).forEach(k=>{
 if(k==='closed')ok(drills[k]===0,'drill closes, got '+drills[k]);
 else ok(drills[k]>120,k+' drill too short: '+drills[k]);});
console.log(' ',JSON.stringify(drills));

console.log('\n=== the knowledge base, the deck and the record ===');
const kb=await page.evaluate(()=>{
 setTab(TAB.KNOW); kbRender();
 const secs=[...document.querySelectorAll('.kb-t')].length;
 const rows=()=>document.querySelectorAll('.kb-r').length;
 const all=rows();
 /* search narrows, and a term that is in no table finds nothing anywhere */
 KB_Q='fear'; kbRender(); const hit=rows();
 KB_Q='zzzznotathing'; kbRender();
 const none=rows(), foundAll=[...document.querySelectorAll('.kb-t b')].reduce((a,b)=>a+ +b.textContent,0);
 KB_Q=''; kbRender();
 /* every section renders and every row opens something */
 let opened=0, empty=[];
 ['addr','fetter','sab','law','dom','arch','gate','card','seat','harm','gloss'].forEach(k=>{
  KB_SEC=k; kbRender();
  if(!document.querySelectorAll('.kb-r').length){empty.push(k);return;}
  document.querySelector('.kb-r').click();
  if(document.getElementById('rdrill').textContent.length>40)opened++;});
 KB_SEC='addr'; kbRender();
 /* the deck deals only from what is held, and a card names a real address */
 loadP(6); const pool=deckSize(), held=compute().loaded.length;
 deckDeal(); const card=DECK_CARD; deckClose();
 return {secs,all,hit,none,foundAll,opened,empty,pool,held,
  cardIsHeld:!!(card&&card.n&&card.n.sq>=4), rank:card?card.rank:0};});
ok(kb.secs===11,'the base has eleven sections, got '+kb.secs);
ok(kb.all>100,'addresses list in full, got '+kb.all);
ok(kb.hit>0&&kb.hit<kb.all,'search narrows, '+kb.all+' to '+kb.hit);
ok(kb.none===0&&kb.foundAll===0,'a term in no table finds nothing in any section');
ok(kb.empty.length===0,'every section has rows, empty: '+kb.empty.join(','));
ok(kb.opened===11,'every section opens a drill, got '+kb.opened+' of 11');
ok(kb.pool===kb.held,'the deck is exactly what is held, '+kb.pool+' against '+kb.held);
ok(kb.cardIsHeld,'a dealt card is an address that is actually carrying');
ok(kb.rank>=1&&kb.rank<=13,'the rank is a card rank, got '+kb.rank);

const rec=await page.evaluate(()=>{
 const p=CURP; p.history=[];
 for(let i=0;i<5;i++){CHARGES.forEach(c=>{S.charge[c]=Math.max(0,(S.charge[c]||3)-0.3);});
  p.history.push(snapshot(p));}
 setTab(TAB.ANALYTICS); anaRender();
 const pts=document.querySelectorAll('.rec-p').length;
 const rows=document.querySelectorAll('.rec-row').length;
 /* clicking an end moves it and the two never collapse onto one */
 document.querySelectorAll('.rec-p')[2].click();
 const same=(REC_A===REC_B);
 return {pts,rows,same,a:REC_A,b:REC_B};});
ok(rec.pts===5,'the record shows every snapshot, got '+rec.pts);
ok(rec.rows===10,'and ten measured rows, got '+rec.rows);
ok(!rec.same,'the two ends never collapse onto one snapshot, A '+rec.a+' B '+rec.b);

console.log('\n=== persistence: save, reload, read back ===');
/* The store must be bound through bindStore(), or pPersist() refuses every
   write. This is the gate that would have caught the shipped app writing
   nothing while reporting storage as blocked. */
const pers=await page.evaluate(()=>{
 const bound=STORE_BOUND; const okp=pPersist();
 return {bound, persist:okp, err:SAVE_ERR, keys:Object.keys(localStorage), n:PROFILES.length};});
ok(pers.bound===true,'store is bound through bindStore, got '+pers.bound);
ok(pers.persist===true,'pPersist reports success, got '+pers.persist+' '+pers.err);
ok(pers.keys.indexOf('source.profiles')>=0,'profile key present in localStorage: '+pers.keys.join(','));
await page.reload(); await page.waitForTimeout(900);
/* PROFILES hydrates lazily from the store on the first intake render, so the
   honest check after reload is what the store holds, not the in-memory array. */
const back=await page.evaluate(()=>({n:pStore().length, bound:STORE_BOUND}));
ok(back.n===pers.n&&back.n>0,'profiles survive reload: '+pers.n+' saved, '+back.n+' read back');
ok(back.bound===true,'store bound after reload');

console.log('\n=== games ===');
const gm=await page.evaluate(()=>{
 loadP(9); setTab(TAB.GAMES); GAME='lg'; gmRender(); lgStart();
 const dealt=LG.cards.length;
 /* the deal is shuffled, so the kind of card at a given index is not fixed.
    each assertion picks a card of the kind it is about. A printed card says
    different things on the two sides and needs both run; an axes card is one
    bilateral statement and clears in one pass. */
 let pr=-1, bi=-1;
 LG.cards.forEach((c,i)=>{const L=lgLine(c.n);
  if(L.split&&pr<0)pr=i;
  if(!L.split&&/Letting go card/.test(L.src)&&bi<0)bi=i;});
 /* the printed card: a line, its paired truth, and both poles required */
 lgTurn(pr); const said=(document.querySelector('.gm-line')||{}).textContent||'';
 const truth=(document.querySelector('.gm-line.tru')||{}).textContent||'';
 lgTurn(pr);
 const half=LG.cards[pr].m&&!LG.cards[pr].f, counted=LG.turned, face=LG.cards[pr].face;
 LG.pole='f'; LG.cards.forEach(c=>{c.face=false;}); LG.open=null; LG.turned=lgCount();
 lgTurn(pr); const other=(document.querySelector('.gm-line')||{}).textContent||'';
 lgTurn(pr); const both=LG.cards[pr].m&&LG.cards[pr].f, after=LG.turned;
 /* the bilateral card: its truth is the install the card actually prints, and
    one pass clears it. Synthesising a truth from the coherent pole produced
    "that I am worth", so the card's own sentence is the only right source. */
 LG.pole='m'; LG.cards.forEach(c=>{c.face=false;}); LG.open=null; gmRender();
 lgTurn(bi); const biTru=(document.querySelector('.gm-line.tru')||{}).textContent||'';
 lgTurn(bi); const biClear=lgDone(LG.cards[bi]), biOne=LG.cards[bi].m&&!LG.cards[bi].f;
 /* every dealt line is the catalog's, never a sentence the catalog does not hold */
 const srcs=new Set(); LG.cards.forEach(c=>{srcs.add(lgLine(c.n).src);});
 lgStop();
 /* the deck never deals the same address twice */
 const ids=LG.cards.map(c=>c.n.i), uniq=new Set(ids).size;
 GAME='mt'; mtStart();
 const cards=MT.cards.length, pairs=new Set(MT.cards.map(c=>c.id)).size;
 const idx=[]; MT.cards.forEach((c,i)=>{if(c.id===0)idx.push(i);});
 mtTurn(idx[0]); mtTurn(idx[1]);
 const found=MT.found, opened=(document.querySelector('.gm-on')||{}).textContent||'';
 /* two that do not match do not stay face up */
 const a=MT.cards.findIndex(c=>!c.done), b=MT.cards.findIndex((c,i)=>!c.done&&c.id!==MT.cards[a].id&&i!==a);
 mtTurn(a); mtTurn(b); const locked=MT.lock;
 loadP(0);
 return {dealt,said,truth,half,counted,face,other,both,after,biTru,biClear,biOne,
  srcs:[...srcs],uniq,cards,pairs,found,opened,locked};});
ok(gm.dealt===24,'the run deals twenty four, got '+gm.dealt);
ok(gm.uniq===24,'and never the same address twice, got '+gm.uniq+' distinct');
/* the strict syntax, and the spec calls it non negotiable: nine gates in one
   sentence, not one channel at a time. */
ok(/^I am letting go of believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, and doing that I am /
  .test(gm.said)||/^I am letting go of believing, perceiving, thinking, feeling, speaking, acting from, relating through, creating from, and being /
  .test(gm.said),'a turned card speaks one of the two catalogued nine gate rosters: '+gm.said);
ok(/^I now embody the truth that I am /.test(gm.truth),
  'and the embodied truth paired to it: '+gm.truth);
ok(gm.half&&gm.counted===0&&!gm.face,
  'one pole of a printed card does not clear it, both channels must run');
ok(gm.other&&gm.other!==gm.said,'the other pole is a different sentence at the same address');
ok(gm.both&&gm.after===1,'both poles clear the printed card, got '+gm.after);
/* an axes card is one statement run bilaterally, so demanding two passes would
   be busywork the card does not ask for. */
ok(gm.biOne&&gm.biClear,'a bilateral axes card clears in one pass');
ok(!/^I now embody the truth that I am (worth|safety|calm)\.$/.test(gm.biTru)&&gm.biTru.length>40,
  'and its truth is the install the card prints, not one synthesised from a noun: '+gm.biTru.slice(0,60));
ok(gm.srcs.every(x=>/Release protocol card|Letting go card|Strict syntax/.test(x)),
  'every line names a catalogued source: '+gm.srcs.join(' / '));
ok(gm.cards===16&&gm.pairs===8,'the match deals eight pairs, got '+gm.cards+' cards, '+gm.pairs+' pairs');
ok(gm.found===1&&gm.opened.length>2,'a matched pair opens its fetter: '+gm.opened);
ok(gm.locked,'two that do not match lock until they turn back');

console.log('\n=== the record the person is actually editing ===');
/* loadP caches a profile per persona. replacing PROFILES at boot left that
   cache pointing outside the list, so every write after a persona round trip
   reported success onto an array nobody reads. */
const orph=await page.evaluate(async ()=>{
 /* a reference case is loaded, then the person marks the state as their own.
    toYou has to move the record too or the edit lands in the case's file. */
 loadP(4); toYou();
 const ownAfterToYou=(CURP===PROF_BY[PEOPLE[0].nm]);
 S.charge.Fear=7.7; syncCh(); saveYou();
 await new Promise(r=>setTimeout(r,600));
 const first=pStore()[0].axes.Fear.held;
 loadP(3); loadP(0);
 const inList=PROFILES.indexOf(CURP)>=0;
 toYou(); S.charge.Fear=2.2; syncCh(); saveYou();
 await new Promise(r=>setTimeout(r,600));
 return {first, inList, ownAfterToYou, second:pStore()[0].axes.Fear.held};});
ok(orph.ownAfterToYou,'switching back to your own moves the record, not just the label');
ok(orph.first===7.7,'an edit reaches the store, got '+orph.first);
ok(orph.inList,'the current profile stays inside the profile list after a persona round trip');
ok(orph.second===2.2,'and an edit after that round trip still reaches the store, got '+orph.second);
/* a debounce with no flush loses what is in flight when the tab closes */
const flush=await page.evaluate(async ()=>{
 toYou(); S.charge.Anger=9.1; syncCh(); saveYou();
 dispatchEvent(new Event('pagehide'));
 await new Promise(r=>setTimeout(r,60));
 return pStore()[0].axes.Anger.held;});
ok(flush===9.1,'a pending write flushes when the page hides, got '+flush);

console.log('\n=== a stranger is not told they are incoherent ===');
/* The nine axes were seeded at charge 3, so a first load produced CQ 36 and
   the word Incoherent in the largest type on screen, next to a panel correctly
   saying nothing was held. Zeroing the charge was not enough, because CQ 36
   comes from the 21 laws sitting at the default 6. The tier was a reading of
   the defaults and it was being shown to someone who had not typed a word. */
/* a genuinely first load: the store has to be empty, or the page restores a
   field an earlier test in this run saved and this stops being a first load */
const blank=await browser.newPage({viewport:{width:1600,height:1000}});
await blank.goto(FILE,{waitUntil:'load'}); await blank.waitForTimeout(400);
await blank.evaluate(()=>{try{localStorage.clear();}catch(e){}});
await blank.reload({waitUntil:'load'}); await blank.waitForTimeout(700);
const virgin=await blank.evaluate(()=>{
 const r=compute();
 const o={unread:r.unread, measured:r.measured, carrying:r.loaded.length,
  charge:CHARGES.map(c=>S.charge[c]).reduce((a,b)=>a+b,0),
  tier:(document.getElementById('tier')||{}).textContent};
 profileSheet();
 o.profile=(document.getElementById('sheet-card').textContent||'').replace(/\s+/g,' ');
 sheetShut();
 setTab(TAB.ANALYTICS); anaRender();
 o.ana=(document.querySelector('.ab-hero .pm-eye')||{}).textContent||'';
 setTab(TAB.FIELD); render();
 /* the whole first screen, not only the surfaces I remembered to guard. The
    right rail was missed on the first pass and a screenshot caught it. This
    has to be read BEFORE the charge below is set, or it reads a real one. */
 o.sweep=document.body.innerText;
 S.charge.Fear=7; syncCh(); render();
 o.after=(document.getElementById('tier')||{}).textContent;
 o.unreadAfter=compute().unread;
 return o;});
ok(virgin.charge===0,'a first load seeds no charge, total is '+virgin.charge);
ok(virgin.carrying===0,'and nothing is carrying');
ok(virgin.unread===true&&virgin.measured===0,'the reading knows it has not been read');
ok(!/Incoherent|Corrupt|Severe|Collapsed/.test(virgin.tier),
 'the tier does not name a band, it reads: '+JSON.stringify(virgin.tier));
ok(!/Incoherent/.test(virgin.profile),'nor does the profile sheet');
ok(!/incoherent/.test(virgin.ana),'nor the analytics hero, which reads: '+JSON.stringify(virgin.ana));
ok(virgin.unreadAfter===false&&/Incoherent|Corrupt|Severe|Oscillating|Even|Gaining|Compounding|Embodied|Mastery/.test(virgin.after),
 'and one held address makes it a real reading again: '+JSON.stringify(virgin.after));
const bands=['Incoherent','Corrupt','Severe','Collapsed'].filter(w=>virgin.sweep.includes(w));
ok(bands.length===0,'no band word appears anywhere on an unread first screen, found: '
 +(bands.join(', ')||'none'));
await blank.close();

console.log('\n=== nothing in the rail is clipped without an affordance ===');
/* Witness rendered as Witn at every desktop width, in a row that did not wrap
   and had no scrollbar. Rule 10: never hide a control with no affordance. */
const clip=await page.evaluate(()=>{
 loadP(6); setTab(TAB.FIELD); render();
 const bad=[];
 document.querySelectorAll('#roots > *, .vt, .tab, .kb-t').forEach(e=>{
  const r=e.getBoundingClientRect();
  if(r.width>0&&e.scrollWidth>e.clientWidth+1)bad.push((e.textContent||'').trim().slice(0,20));});
 const row=document.getElementById('roots');
 return {bad, rowOverflows:row.scrollWidth>row.clientWidth+1,
  names:[...row.children].map(c=>c.textContent.trim())};});
ok(clip.bad.length===0,'no control clips its own label: '+(clip.bad.join(', ')||'none'));
ok(!clip.rowOverflows,'and the root domain row does not overflow its box');
ok(clip.names.join()==='Architect,Engine,Weaver,Witness',
 'all four root domains render in full, got '+clip.names.join(', '));

console.log('\n=== undo, on the three irreversible writes ===');
const un=await page.evaluate(()=>{
 loadP(6); setTab(TAB.STORY); render();
 const o={hiddenAtRest:document.getElementById('undobtn').hidden};
 const before=JSON.stringify(S.charge);
 ST_TEXT='I could not stop going over it and it had me. I said nothing and I let it sit.';
 ST_PARSED=parseStory(ST_TEXT); stRender();
 const ap=document.getElementById('stapply'); if(ap)ap.click();
 o.changed=(JSON.stringify(S.charge)!==before);
 o.label=document.getElementById('undolab').textContent;
 o.shown=!document.getElementById('undobtn').hidden;
 document.getElementById('undobtn').click();
 o.restored=(JSON.stringify(S.charge)===before);
 o.hiddenAgain=document.getElementById('undobtn').hidden;
 return o;});
ok(un.hiddenAtRest,'the control is hidden when there is nothing to take back');
ok(un.changed,'committing a story changes the field');
ok(un.shown&&/committing the story/.test(un.label),
 'and the control names what it will undo: '+JSON.stringify(un.label));
ok(un.restored,'undo restores the field exactly');
ok(un.hiddenAgain,'and hides itself again when the stack empties');

console.log('\n=== a label never appears without what it owes ===');
/* The owner's ruling. A word like Severe with nothing attached is a judgement.
   The same word with a definition, the behaviour and the direction is a
   reading. Checked on Gordon, the heaviest case in the roster. */
const lab=await page.evaluate(()=>{
 loadP(8); setTab(TAB.FIELD); render();
 const el=document.getElementById('tier');
 runCompassDrill();
 return {label:el.textContent, tip:el.title,
  drill:(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ')};});
ok(/Severe|Collapsed|Corrupt|Incoherent/.test(lab.label),
 'the heaviest case gets a band, got '+JSON.stringify(lab.label));
ok(lab.tip.length>120,'and the label carries its meaning on hover, '+lab.tip.length+' chars');
ok(/Toward:/.test(lab.tip),'including the direction out of it');
/* the gate named Severe, so it broke when the scale went to ten bands and
   Gordon moved a band. it asks the drill about whatever word the label used. */
ok(new RegExp('What '+lab.label.replace(/[^A-Za-z]/g,' ').trim().split(/\s+/).pop()
  +' means','i').test(lab.drill),
 'the drill defines the word it used, '+JSON.stringify(lab.label));
ok(/How it shows up/i.test(lab.drill),'says how it shows up in a life');
ok(/Where it goes/i.test(lab.drill),'and where it goes next');
/* and the definition has to be reachable by TAP, not only by hover. It lived
   in a title attribute, and the audience arrives on phones. */
const tapPg=await browser.newPage({viewport:{width:390,height:844}});
await tapPg.goto(FILE,{waitUntil:'load'}); await tapPg.waitForTimeout(700);
const tapped=await tapPg.evaluate(()=>{
 loadP(9); setTab(TAB.FIELD); render();
 const el=document.getElementById('tier');
 const h=Math.round(el.getBoundingClientRect().height);
 el.click();
 const d=(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 return {tag:el.tagName, h, opened:d.length,
  full:/means/i.test(d)&&/How it shows up/i.test(d)&&/Where it goes/i.test(d)};});
ok(tapped.tag==='BUTTON','the tier is a control, not a label printed at a person');
ok(tapped.h>=44,'it clears the touch floor, got '+tapped.h+'px');
ok(tapped.full,'and a tap gives the definition, the behaviour and the direction');
await tapPg.close();

console.log('\n=== zoom atomises the construct ===');
/* Zoom used to magnify the same picture while the depth ladder was a separate
   control for the same idea. Past a threshold the next layer resolves, so more
   zoom is literally more information and not just bigger pixels.
   NOTE: render is deferred to an animation frame, so HIT must be read after a
   wait. Reading it synchronously returns the previous frame and reports that
   nothing changed, which cost two probes before it was noticed. */
const zsteps=[];
for(const z of [1,2.3,3.3,4.3]){
 await page.evaluate(zz=>{loadP(6);setTab(TAB.FIELD);S.view=0;S.zoom=zz;reframe();render();},z);
 /* wait for the frame the render was deferred to, rather than for a guess at
    how long it takes. A fixed timeout here failed roughly one run in ten. */
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 zsteps.push(await page.evaluate(()=>{
  const k={};HIT.forEach(h=>k[h.k]=(k[h.k]||0)+1);
  return {n:HIT.length,eff:effView(),kinds:Object.keys(k)};}));}
ok(zsteps.map(x=>x.eff).join()==='0,1,2,3',
 'zoom resolves each layer in turn, got '+zsteps.map(x=>x.eff).join());
ok(zsteps[0].n<zsteps[1].n&&zsteps[1].n<zsteps[2].n&&zsteps[2].n<zsteps[3].n,
 'and each layer adds real targets, got '+zsteps.map(x=>x.n).join(' '));
ok(zsteps[1].kinds.indexOf('sab')>=0,'saboteurs resolve at the second layer');
ok(zsteps[3].kinds.indexOf('dom')>=0&&zsteps[3].kinds.indexOf('mk')>=0,
 'domains and masks resolve at the fourth');
/* the button sets the floor: a gesture never takes away what a person chose */
await page.evaluate(()=>{S.view=3;S.zoom=1;reframe();render();});
await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const floor=await page.evaluate(()=>({eff:effView(),n:HIT.length}));
ok(floor.eff===3&&floor.n>200,
 'the depth button holds at zoom 1, so zooming out never removes a chosen layer');

console.log('\n=== a real person reaches the cosmological layer ===');
/* The whole ephemeris was visible to nine fixtures and to nobody real.
   BIRTH.You is null, Intake wrote to CURP.who.born, and nothing read it. */
const birth=await page.evaluate(()=>{
 loadP(0); toYou();
 CURP.who=CURP.who||{};
 CURP.who.born={date:'1984-11-07',time:'14:25',place:'Chicago, IL'};
 renderSpirit();
 const known=(document.getElementById('spirit').textContent||'').replace(/\s+/g,' ');
 CURP.who.born={date:'1984-11-07',time:'14:25',place:'Nowhere, ZZ'};
 renderSpirit();
 const nocity=(document.getElementById('spirit').textContent||'').replace(/\s+/g,' ');
 CURP.who.born={};
 renderSpirit();
 const none=(document.getElementById('spirit').textContent||'').replace(/\s+/g,' ');
 return {known, nocity, none};});
ok(/Scorpio/.test(birth.known)&&/Taurus/.test(birth.known),
 'a birth date typed into intake produces a real sun and moon: '+birth.known.slice(0,60));
ok(/Pisces/.test(birth.known),'and a birthplace produces an ascendant');
ok(/gate \d/.test(birth.known),'and a real gene key gate off the wheel');
ok(/unresolved/.test(birth.nocity)&&/birthplace/.test(birth.nocity),
 'a place the gazetteer cannot locate says so rather than rendering blank');
ok(/No birth data/.test(birth.none),'and no birth data at all says that');

console.log('\n=== the main button never destroys a field it was not asked to ===');
/* With nothing held, Run a release used to start a 2.8 second animation that
   zeroed every charge and raised every law toward ten. One click, no
   confirmation, no undo, and indistinguishable from the real thing. */
const rel=await page.evaluate(()=>{
 loadP(0); toYou();
 CHARGES.forEach(c=>{S.charge[c]=0;}); SINAMES.forEach(l=>{S.law[l]=5;});
 syncCh(); syncLw(); render();
 const l0=SINAMES.map(l=>S.law[l]).join();
 document.getElementById('bRel').click();
 return {l0, wait:true};});
await page.waitForTimeout(3200);
const relAfter=await page.evaluate(()=>SINAMES.map(l=>S.law[l]).join());
ok(relAfter===rel.l0,'with nothing held, the button changes no law');

console.log('\n=== a finger reads the wheel, it does not write it ===');
/* A thumb landing on the wheel to scroll used to drag the charge underneath
   it and save the result, because the canvas carries touch-action:none and so
   swallowed the gesture. Reproduced before the fix: Anger 8.0 to 10.0 with the
   page not moving. There is no undo, so the value was simply gone. */
const touchCtx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const touchPg=await touchCtx.newPage();
await touchPg.goto(FILE,{waitUntil:'load'}); await touchPg.waitForTimeout(700);
const drag=await touchPg.evaluate(()=>{
 loadP(6); setTab(TAB.FIELD); render();
 const before=JSON.parse(JSON.stringify(S.charge));
 const cv=document.getElementById('cv'), rect=cv.getBoundingClientRect();
 const sx=rect.width/cv.width, sy=rect.height/cv.height;
 let pick=null,pt=null;
 for(let i=HIT.length-1;i>=0;i--){const h=HIT[i];
  if(h.k!=='node'||!h.n||!h.n.cf||h.x!==undefined)continue;
  const rr=(h.r0+h.r1)/2, aa=(h.a0+h.a1)/2;
  const px=h.cx+rr*Math.cos(aa), py=h.cy+rr*Math.sin(aa);
  const t=hitTest(px,py);
  if(t&&t.k==='node'&&t.n&&t.n.cf){pick=t;pt={px,py};break;}}
 if(!pick)return {err:'no node reachable'};
 const x=rect.left+pt.px*sx, y=rect.top+pt.py*sy;
 const ev=(t,cy)=>cv.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:cy,
  pointerId:1,bubbles:true,pointerType:'touch',isPrimary:true}));
 ev('pointerdown',y); for(let d=10;d<=60;d+=10)ev('pointermove',y-d); ev('pointerup',y-60);
 const after=JSON.parse(JSON.stringify(S.charge));
 const moved=Object.keys(before).filter(k=>Math.abs(before[k]-after[k])>0.01);
 return {moved, axis:pick.n.cf,
  drill:((document.getElementById('rdrill')||{}).textContent||'').length};});
ok(!drag.err,'a node on the wheel is reachable, '+(drag.err||'yes'));
ok(drag.moved&&drag.moved.length===0,
 'a touch drag across the wheel writes no charge, moved: '+((drag.moved||[]).join(',')||'none'));
ok(drag.drill>40,'and the tap opens the address instead, got '+drag.drill+' chars');
/* the canvas must also stop eating the scroll it used to swallow */
const ta=await touchPg.evaluate(()=>getComputedStyle(document.getElementById('cv')).touchAction);
ok(ta!=='none','the wheel lets a coarse pointer scroll the page, touch-action is '+ta);
await touchPg.close(); await touchCtx.close();

console.log('\n=== every tab fits a phone ===');
/* The stage drops its overflow and its min height at 720 so the wheel can flow
   down the screen. The tab panels stayed position:absolute against it, so every
   one of them rendered into a 36px window with the rest clipped: Knowledge had
   5,729 pixels of content inside it and Games 3,564, with no way to reach any
   of it. A panel taller than its own box is the whole bug, so that is the
   assertion. */
const phone=await browser.newPage({viewport:{width:390,height:844}});
await phone.goto(FILE,{waitUntil:'load'}); await phone.waitForTimeout(700);
for(const [t,sel] of [['STORY','#story'],['SUMMARY','#sum'],['ANALYTICS','#ana'],
                      ['INTAKE','#iq'],['KNOW','#know'],['GAMES','#games']]){
 const r=await phone.evaluate(([tt,ss])=>{
  loadP(6); setTab(TAB[tt]);
  if(tt==='KNOW')kbRender();
  if(tt==='GAMES'){GAME='lg'; gmRender(); lgStart();}
  const e=document.querySelector(ss);
  const box=Math.round(e.getBoundingClientRect().height);
  return {box, sh:e.scrollHeight, body:document.body.scrollHeight,
   wide:document.documentElement.scrollWidth>window.innerWidth};},[t,sel]);
 await phone.waitForTimeout(120);
 ok(r.sh<=r.box+4,t+' is not clipped on a phone: '+r.sh+' of content in a '+r.box+' box');
 ok(r.box>200,t+' actually rendered on a phone, box '+r.box);
 ok(!r.wide,t+' does not scroll the page sideways on a phone');}
await phone.close();

console.log('\n=== real JS errors across all of the above ===');
ok(real.length===0,'JS errors: '+real.slice(0,4).join(' | '));
console.log('  count:',real.length);
console.log('\n=== the compass has two ends and both are doors ===');
/* The cone was a picture of a direction with nothing at either end of it. The
   top is anchored by the twelve, the bottom by the blueprint and the nine
   circles, and the rule that governs both is that they render as behaviours
   and never as entities. */
const pole=await page.evaluate(()=>{
 const o={};
 loadP(8); setTab(TAB.FIELD); render();
 o.ends=document.querySelectorAll('#pol2 [data-polend]').length;
 const txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 runPoleDrill('up'); o.up=txt();
 runPoleDrill('dn'); o.dn=txt();
 /* a row on either roster opens that axis with both poles on it */
 runPoleDrill('up');
 const row=document.querySelector('#rdrill [data-mirror]');
 o.rows=document.querySelectorAll('#rdrill [data-mirror]').length;
 if(row){row.click(); o.axis=txt();}
 const r=compute(); o.cq=Math.round(r.CQ); o.dark=darkRead(r.outward,r.CQ).dark;
 /* and a coherent field is never shown it. built rather than assumed: four
    hundred checks have run against this page and persona zero is not
    guaranteed to still be empty. */
 undoPush('the compass gate');
 CHILD.forEach(function(c){S.charge[c.nm]=0;S.replace[c.nm]=8;});
 SI.forEach(function(l){S.law[l.nm]=10;});
 toYou(); render();
 const rc=compute();
 o.cleanCQ=Math.round(rc.CQ); o.cleanMal=Math.round(rc.malig);
 o.cleanDark=darkRead(rc.outward,rc.CQ).dark;
 runPoleDrill('dn'); o.clean=txt();
 undoPop();
 return o;});
ok(pole.ends===2,'the cone carries a door at each end, got '+pole.ends);
ok(pole.rows===8,'and eight axes on the roster, got '+pole.rows);
ok(/Musashi/.test(pole.up)&&/Buddha/.test(pole.up)&&/Akhenaten/.test(pole.up),
 'the upward roster names the twelve');
ok(/Lucifer/.test(pole.dn)&&/Moloch/.test(pole.dn)&&/Satan frozen/.test(pole.dn),
 'the downward roster names the inversions and the nine circles');
ok(/behaviours, not entities/.test(pole.dn),
 'and says in the copy that they are behaviours rather than entities');
ok(/Musashi against Moloch|against/.test(pole.axis),'an axis opens with both poles on it');
ok(/\?/.test(pole.axis),'carrying the question that tells them apart');
ok(/not a verdict/.test(pole.axis),'and saying it is not a verdict');
/* THE SAFETY RULE, carried out of the book. Gordon is the heaviest case in
   the roster and sits under the floor with a malignant shape, which is the one
   configuration the codex says to refer out rather than work. */
ok(pole.dark===true,'the heaviest case reads malignant and decoherent at once, CQ '+pole.cq);
ok(/licensed clinician/.test(pole.dn),'and the referral is on the surface, not only in the book');
ok(/reading of what is running, not of who/.test(pole.dn),
 'said as a reading of what runs rather than a label on a person');
/* and none of it is shown to somebody it is not true of */
ok(pole.cleanDark===false,'a cleared field does not read as the descent, CQ '
 +pole.cleanCQ+' malignant '+pole.cleanMal);
ok(!/licensed clinician/.test(pole.clean),'and is never shown the referral');
ok(!/Both at once/.test(pole.clean),'nor the descent read');
/* THE FOUR CORNERS, and the one thing the surface must never do. A corner
   describes the shape of what is firing. The first build let a field at CQ 39
   read Angel because its stack all pointed inward, which is wrong twice. */
ok(/The Devil/.test(pole.dn)&&/The Demon/.test(pole.dn)&&/The Storm/.test(pole.dn)
 &&/Turned inward/.test(pole.dn),'all four stack corners are on the surface');
ok(/oldest mistake in this material/.test(pole.dn),
 'and the surface says that chaos is not malice');
ok(/It is what is left when nothing is running/.test(pole.dn),
 'and that angel is not a corner of the stack');
ok(/What is running here reads|no shape to read/.test(pole.dn),
 'the corner is phrased about what is running, never about the person');
/* the recognition lens, which is the owner's own entry framework */
const seen=await page.evaluate(()=>{
 const txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 loadP(8); setTab(TAB.FIELD); render();
 runRecogniseDrill();
 const o={n:document.querySelectorAll('#rdrill [data-circ]').length, see:txt()};
 const first=document.querySelector('#rdrill [data-circ]');
 if(first){first.click(); o.one=txt();}
 return o;});
ok(seen.n===9,'nine sentences to start from, got '+seen.n);
ok(/^I |\bI /.test(seen.see),'written in the first person');
ok(/none of them is about being a bad person/i.test(seen.see),
 'and saying plainly that none of it is about being a bad person');
ok(!/narcissis|psychopath|saboteur/i.test(seen.see),
 'no diagnosis word appears on the sentence list');
ok(/What you might recognise/.test(seen.one)&&/Where it sits/.test(seen.one),
 'a sentence opens what it is and where it sits');
ok(/not a person and not a thing that exists/.test(seen.one),
 'and says the governor is a name for a pattern');
/* THE SECOND WAY IN. A person who cannot see themselves as bad gets the nine
   sentences. A person who cannot see themselves as identified gets the years,
   and that is most people, because an identification that is working does not
   feel like one. */
const age=await page.evaluate(()=>{
 const txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 runRecogniseDrill();
 const o={door:!!document.getElementById('rdage')};
 if(o.door)document.getElementById('rdage').click();
 o.list=txt();
 o.years=document.querySelectorAll('#rdrill [data-age]').length;
 const y=document.querySelector('#rdrill [data-age="14"]');
 if(y){y.click(); o.year=txt();
  /* defended, and not cared about, is the one finding there is */
  const yes=document.querySelector('#rdrill [data-ag="defend"][data-v="1"]');
  if(yes)yes.click();
  const no=document.querySelector('#rdrill [data-ag="care"][data-v="0"]');
  if(no)no.click();
  o.found=txt();
  /* and the same position, meant, is a preference rather than a groove */
  const care=document.querySelector('#rdrill [data-ag="care"][data-v="1"]');
  if(care)care.click();
  o.pref=txt();}
 return o;});
ok(age.door,'the nine sentences carry a door to the years for anyone none of them fit');
ok(age.years===16,'sixteen years, got '+age.years);
ok(/mind sticks to anything that it defends/.test(age.list),'the mechanic is stated on the list');
ok(/Superman|Hulk/.test(age.list),'with the worked example that found it');
ok(/Nothing is stored here, and nothing is scored/.test(age.year),
 'a year says plainly that it keeps nothing');
ok(/A groove/.test(age.found)&&/groove, not a taste/.test(age.found),
 'defended and not meant reads as a groove');
ok(/preference, not a bias/.test(age.pref),
 'and the same position meant reads as a preference');
/* THE OPENING. A field with nothing in it had a tooltip saying to write a
   story, which is rule ten broken: a control with no affordance is the same as
   a missing feature. Both ways in were three clicks inside the bottom of the
   compass, which is rule six broken too. */
const open_=await page.evaluate(()=>{
 const o={};
 undoPush('the opening gate');
 CHILD.forEach(c=>{S.charge[c.nm]=0;S.replace[c.nm]=0;});
 SI.forEach(l=>{S.law[l.nm]=6;});
 /* unread is nothing held AND no law recorded, and four hundred checks have
    already run the intake on this page, so the recorded laws come out too and
    go back afterwards. */
 /* toYou reloads the profile when it actually switches, which puts the laws
    straight back, so the clear has to come after it and not before. */
 toYou();
 const keptLaws=CURP&&CURP.laws?JSON.parse(JSON.stringify(CURP.laws)):null;
 if(CURP)CURP.laws={};
 CHILD.forEach(c=>{S.charge[c.nm]=0;S.replace[c.nm]=0;});
 setTab(TAB.FIELD);
 /* the reading folds, and a folded section measures zero, so it is opened the
    way a person opens it rather than measured shut */
 const sec=document.querySelector('.lsec[data-sec="you"]');
 if(sec&&!sec.classList.contains('open'))sec.querySelector('.lsec-hd').click();
 render();
 o.unread=compute().unread;
 const st=document.getElementById('start');
 o.shown=!!st&&!st.hidden;
 o.txt=(st?st.textContent:'').replace(/\s+/g,' ');
 o.btns=document.querySelectorAll('#start .stbtn').length;
 o.tap=Math.min.apply(null,[...document.querySelectorAll('#start .stbtn')]
  .map(e=>{const b=e.getBoundingClientRect();return Math.min(b.width,b.height);}));
 /* each door actually opens */
 o.why={loaded:compute().loaded.length,measured:compute().measured,who:S.who,tab:S.tab};
 const d2=document.getElementById('stw2'), d3=document.getElementById('stw3');
 if(d2){d2.click(); o.two=(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');}
 if(d3){d3.click(); o.three=(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');}
 /* and the block is gone once there is something to read */
 loadP(8); render();
 const st2=document.getElementById('start');
 o.after=compute().unread; o.afterShown=!!st2&&!st2.hidden;
 if(CURP&&keptLaws)CURP.laws=keptLaws;
 undoPop(); render();
 return o;});
ok(open_.unread&&open_.shown,'an empty field is offered a way in rather than a tooltip');
ok(open_.btns===4,'four doors, got '+open_.btns);
ok(open_.tap>=44,'each one clears the tap floor, smallest '+Math.round(open_.tap));
ok(/cannot think of themselves as the problem/.test(open_.txt)
 &&/cannot think of anything they identify with/.test(open_.txt),
 'and each says who it is for rather than only what it is');
ok(/what you are filling it toward/.test(open_.txt),
 'including the one that says where the work is aimed');
ok(/mind sticks to anything that it defends/.test(open_.three||'')
 &&/none of them is about being a bad person/i.test(open_.two||''),
 'both doors open the thing they name  '+JSON.stringify(open_.why));
ok(open_.after===false&&open_.afterShown===false,
 'and the block goes once there is something to read, because a call to action '
 +'that survives the action is furniture');
/* NOTHING IS PRINTED OFF THE DEFAULTS. With nothing held and no law measured
   CQ comes out 36 from the default six on twenty one laws. compute already
   refuses to name a band on that and the rail already says not read yet, and
   the core was still printing 36 in the largest type on the screen. The same
   reading of the same defaults, said two ways on one screen. */
const virginSweep=await page.evaluate(()=>{
 toYou();
 const keptLaws=CURP&&CURP.laws?JSON.parse(JSON.stringify(CURP.laws)):null;
 if(CURP)CURP.laws={};
 CHILD.forEach(c=>{S.charge[c.nm]=0;S.replace[c.nm]=0;});
 SI.forEach(l=>{S.law[l.nm]=6;});
 setTab(TAB.FIELD); layout(); draw(compute());
 const r=compute();
 /* the whole rendered page, not one element, because the last time this was
    fixed the right rail was missed and a screenshot caught it. the profile
    picker comes out, because it legitimately carries ages and one of the
    people in the roster happens to be the age the defaults compute to. */
 const clone=document.body.cloneNode(true);
 clone.querySelectorAll('select,option,script,style,svg,canvas').forEach(function(x){x.remove();});
 const o={unread:r.unread, cq:Math.round(r.CQ),
  page:(clone.textContent||'').replace(/\s+/g,' ')};
 /* the canvas core is pixels, so it is read from what draw was asked to write */
 o.pol=(document.getElementById('pol').textContent||'').replace(/\s+/g,' ');
 if(CURP&&keptLaws)CURP.laws=keptLaws;
 return o;});
ok(virginSweep.unread,'the field reads as unread');
ok(virginSweep.cq>0,'and the arithmetic still produces a number underneath, '
 +virginSweep.cq);
{const re=new RegExp('.{0,60}\\b'+virginSweep.cq+'\\b.{0,30}','g');
 const hits=[]; let m; while((m=re.exec(virginSweep.page)))hits.push(m[0].trim());
 ok(hits.length===0,'and '+virginSweep.cq+' appears nowhere on an unread page'
  +(hits.length?'  '+hits.slice(0,3).join(' | '):''));}
ok(/Nothing read yet/.test(virginSweep.pol),
 'the benign split says there is none rather than printing one');
ok(!/72%|28%/.test(virginSweep.pol),'and prints no percentage off the defaults');
/* the whole class, not the one instance. every reading derived from the
   default six on the laws is silent until somebody enters something. DQ, SQ
   and Pole stay at zero because zero is true: nothing is held and nothing is
   installed. */
{const nums=(virginSweep.page.match(/\b\d{1,3}(\.\d+)?%/g)||[])
  .filter(s=>s!=='100%'&&s!=='0%');
 ok(nums.length===0,'no percentage is printed off the defaults anywhere'
  +(nums.length?'  '+nums.slice(0,5).join(', '):''));}
/* the roster itself is always there. only the descent read is conditional. */
ok(/Satan frozen/.test(pole.clean),'while the nine circles stay readable to anybody');

console.log('\n=== a release run spends thought lines, and charges the right person ===');
const relrun=await page.evaluate(()=>{
 const o={};
 loadP(8); setTab(TAB.FIELD); render();
 const held=W.filter(n=>n.sq>=4).slice(0,3).map(n=>n.i);
 relPick(held);
 o.plan=RUN.plan.length;
 o.setup=(document.getElementById('rel').textContent||'').replace(/\s+/g,' ');
 o.distinct=new Set(RUN.plan).size;
 /* THE PERSON WHO RAN IT IS THE PERSON CHARGED. toYou repoints CURP at the
    person's own record and it used to be called AFTER the meter wrote, so a run
    started while a reference case was loaded charged the reference case and
    then moved the pointer away. */
 o.beforeWho=S.who;
 const ownBefore=(PROF_BY[PEOPLE[0].nm].meter.unique||[]).length;
 RUN.phase='run'; RUN.idx=RUN.plan.length-1;
 relCoolDown();
 o.afterWho=S.who;
 o.ownGained=(PROF_BY[PEOPLE[0].nm].meter.unique||[]).length-ownBefore;
 o.gordonGained=(PROF_BY[PEOPLE[8].nm]
   ?((PROF_BY[PEOPLE[8].nm].meter.unique||[]).length):0);
 /* a second run continues rather than repeating */
 relPick(held);
 o.plan2=RUN.plan.length;
 o.overlap=RUN.plan.filter(k=>(CURP.meter.unique||[]).indexOf(k)>=0).length;
 relClose();
 return o;});
ok(relrun.plan===25,'a run is twenty five thought lines, got '+relrun.plan);
ok(relrun.distinct===25,'and never repeats a line inside one run');
ok(/25 thought lines of new ground/.test(relrun.setup),
 'the setup says what it costs before anybody begins');
ok(/25 of your allowance/.test(relrun.setup),'and that it comes out of the allowance');
ok(relrun.beforeWho===8&&relrun.afterWho===0,'the run ends on the person\'s own record');
ok(relrun.ownGained===25,
 'and the twenty five land there rather than on the reference case, got '+relrun.ownGained);
ok(relrun.overlap===0,'the next run continues rather than re-offering opened ground');

console.log('\n=== the avatar, and what it aims the work at ===');
/* The becoming half. The right hand sentence resolves to a seat and the seat
   has addresses with weight, which is what turns a value into something the
   release queue can aim at. */
const avat=await page.evaluate(()=>{
 const o={}, txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 loadP(8); setTab(TAB.FIELD); render();
 const keptA=CURP.avatar, keptP=CURP.purpose;
 /* THE RESOLVER. It read p.hits and looked up BY[h.i], which is undefined on
    every hit, so it answered nothing for text it had in fact parsed. */
 o.seat=readSeat('I take every meeting home and I am angry about it');
 o.none=readSeat('the sky was grey');
 CURP.avatar={built:true,at:new Date().toISOString(),reviewedAt:new Date().toISOString(),
  pairs:[{be:'I leave work at work',notbe:'I take every meeting home and I am angry about it'}]};
 CURP.purpose={soul:['freedom','wisdom','truth'],ego:['health','family','stability'],
  sides:{partner:['a','b'],family:[],friends:[],community:[],coworkers:[],alone:[]}};
 runAvatarDrill(); o.av=txt();
 o.rows=document.querySelectorAll('#rdrill [data-avp]').length;
 document.querySelector('#rdrill [data-avp]').click(); o.pair=txt();
 runPurposeDrill(); o.pur=txt();
 CURP.avatar=keptA; CURP.purpose=keptP;
 return o;});
ok(avat.seat==='Solar','the resolver reads a seat out of a bad day sentence, got '+avat.seat);
ok(avat.none===null,'and nothing out of a sentence with no feeling in it');
ok(avat.rows===1,'one written pair, one row');
ok(/solar, 5/.test(avat.av),'the row names the seat and what is held there');
ok(/does not rule on whether an attribute is a real edge/.test(avat.av),
 'and the standing ruling is on the surface');
ok(/Read from what you have actually cleared, not from what you wrote/.test(avat.av),
 'progress is read from work done');
ok(/What is in the way/.test(avat.pair)&&/Self-Judgment|Pride|Need To Win/.test(avat.pair),
 'an attribute opens the addresses standing in the way of it');
ok(/right hand sentence steers the release/.test(avat.pair)
 &&/left hand one steers the reframe/.test(avat.pair),
 'and the routing is stated, because the other way round releases a value');
/* THE PURPOSE MAP. Six values in, three readings out, none of them typeable. */
ok(/freedom, wisdom, truth/.test(avat.pur),'the higher centre is the sum of its corners');
ok(/how you make money and how you find fulfilment/.test(avat.pur),
 'and the line between the two answers what it was ruled to answer');
ok(/2 of 30 written/.test(avat.pur),'the boundary counts thirty');
ok(/A mirror half described shows half a person/.test(avat.pur),
 'and says why thirty is not a lot to ask');

console.log('\n=== the compass with volume ===');
/* A line cannot show what a cone shows. Two cones meeting at a neck, eight
   meridians, the person plotted on every one, and the whole thing spins. Its
   own canvas and its own context, no library and no new dependency. */
const cone=await page.evaluate(()=>{
 const o={};
 loadP(8); setTab(TAB.FIELD); render();
 /* reachable from BOTH ends of the flat compass. it sat inside the downward
    branch on its first write, so the upward roster had no way through. */
 runPoleDrill('up');   o.fromUp=!!document.getElementById('rdcone');
 runPoleDrill('dn');   o.fromDn=!!document.getElementById('rdcone');
 document.getElementById('rdcone').click();
 o.open=CONE.open;
 const cv=document.getElementById('conecv');
 o.cv=!!cv;
 if(cv){const b=cv.getBoundingClientRect(); o.w=Math.round(b.width); o.h=Math.round(b.height);}
 /* it draws something rather than an empty canvas */
 coneDraw();
 if(cv){const g=cv.getContext('2d');
  const d=g.getImageData(0,0,cv.width,cv.height).data;
  let lit=0; for(let i=3;i<d.length;i+=4*97)if(d[i]>8)lit++;
  o.lit=lit;}
 /* every pole is inside the box at the default view, which is the thing that
    broke first: a tilted ring reaches lower than the axis point it sits on. */
 const W=cv.width/CONE.dpr, H=cv.height/CONE.dpr;
 const off=[];
 for(let m=0;m<8;m++){
  [0,100].forEach(function(q){
   const p=conePt(q,m,W,H);
   if(p.x<0||p.x>W||p.y<24||p.y>H-24)off.push(MIRROR[m].k+'@'+q);});}
 o.off=off;
 /* drag turns it, and the tilt never passes the point where up stops being up */
 const s0=CONE.spin;
 cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:400,clientY:300,pointerId:1,bubbles:true}));
 cv.dispatchEvent(new PointerEvent('pointermove',{clientX:520,clientY:900,pointerId:1,bubbles:true}));
 cv.dispatchEvent(new PointerEvent('pointerup',{clientX:520,clientY:900,pointerId:1,bubbles:true}));
 o.spun=(CONE.spin!==s0); o.tilt=CONE.tilt;
 coneClose(); o.shut=CONE.open;
 o.gone=!document.getElementById('conecv');
 return o;});
ok(cone.fromUp&&cone.fromDn,'both ends of the flat compass open the volume');
ok(cone.open&&cone.cv,'it opens with a canvas of its own');
ok(cone.w>200&&cone.h>200,'sized, got '+cone.w+' by '+cone.h);
ok(cone.lit>40,'and draws something, '+cone.lit+' lit samples');
ok(cone.off.length===0,'every pole is inside the box: '+cone.off.join(', '));
ok(cone.spun,'a drag turns it');
ok(cone.tilt<=0.92&&cone.tilt>=0.08,'and the tilt never passes where up stops being up, '
 +cone.tilt.toFixed(2));
ok(cone.shut===false&&cone.gone,'and it closes clean, taking its canvas with it');

console.log('\n=== the plan, and the seam that has nowhere to go yet ===');
/* Stripe is a network and this file has none. The panel reads the plan off
   the record and calls one host function, and with nothing bound it says so
   rather than opening a dead page, which is rule three. */
const plan=await page.evaluate(()=>{
 const o={}, txt=()=>(document.getElementById('sheet').textContent||'').replace(/\s+/g,' ');
 const kept=CURP.plan?JSON.parse(JSON.stringify(CURP.plan)):null;
 const keptU=CURP.meter.unique.slice();
 profileSheet(); o.free=txt();
 CURP.plan={tier:'two',status:'active',granted:800,carried:0,base:100,
  since:'2026-09-01T00:00:00Z',until:'2026-10-01T00:00:00Z'};
 CURP.meter.unique=new Array(320).fill(0).map((_,i)=>'a'+i);
 profileSheet(); o.two=txt();
 /* a cancelled record must not read as the tier written on it */
 CURP.plan.status='canceled'; profileSheet(); o.dead=txt();
 CURP.plan.status='active';
 /* the control with nothing bound reports rather than pretending */
 document.getElementById('planman').click();
 o.status=(document.getElementById('status').textContent||'').trim();
 o.kind=document.getElementById('status').getAttribute('data-kind');
 /* and once a host is bound it is called, with no key anywhere near this file */
 let called=null;
 bindPlan(function(what,tier){called={what:what,tier:tier};});
 profileSheet();
 document.getElementById('planup').click();
 o.called=called;
 bindPlan(null);
 CURP.plan=kept; CURP.meter.unique=keptU;
 sheetShut();
 return o;});
ok(/On\s*Free/.test(plan.free),'a record with no plan reads free');
ok(/100 of the gift left/.test(plan.free),'and is inside the gift');
ok(/400 of new ground a month/.test(plan.free),
 'the step up states its own figure rather than subtracting a week from a month');
ok(/On\s*Tier two/.test(plan.two)&&/580 of 800 left this month/.test(plan.two),
 'a live tier reads its own grant and what is left of it');
ok(/You can see\s*complexes/.test(plan.two),'and what it lets a person see');
ok(/On\s*Free/.test(plan.dead),
 'a cancelled record reads free however high the tier written on it');
ok(/Rerunning anything already open costs nothing/.test(plan.two),
 'the one thing that is always true is always said');
ok(/no customer number/.test(plan.two),'and the record says what it does not hold');
ok(/not connected yet/.test(plan.status)&&plan.kind==='fail',
 'with nothing bound the control says so rather than opening a dead page');
ok(plan.called&&plan.called.what==='checkout'&&plan.called.tier==='three',
 'and once a host is bound it is handed the action and the tier, got '
 +JSON.stringify(plan.called));
/* THE PROMISE. No key, no customer id, no card field anywhere in the build. */
const leak=await page.evaluate(()=>{
 const src=document.documentElement.innerHTML;
 const bad=[];
 [/sk_live/,/sk_test/,/pk_live/,/\bcus_[A-Za-z0-9]/,/\bsub_[A-Za-z0-9]/,
  /card\s*number/i,/cardnumber/i,/cvc/i].forEach(function(re){
   if(re.test(src))bad.push(String(re));});
 return bad;});
ok(leak.length===0,'no key, customer id or card field is anywhere in the build: '+leak.join(', '));

await browser.close();

console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
