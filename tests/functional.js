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
ok(virgin.unreadAfter===false&&/Incoherent|Corrupt|Severe|Practicing|Embodied|Mastery/.test(virgin.after),
 'and one held address makes it a real reading again: '+JSON.stringify(virgin.after));
const bands=['Incoherent','Corrupt','Severe','Collapsed'].filter(w=>virgin.sweep.includes(w));
ok(bands.length===0,'no band word appears anywhere on an unread first screen, found: '
 +(bands.join(', ')||'none'));
await blank.close();

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
await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
