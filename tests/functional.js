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
 ['addr','fetter','sab','law','dom','arch','gate','seat','harm','gloss'].forEach(k=>{
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
ok(kb.secs===10,'the base has ten sections, got '+kb.secs);
ok(kb.all>100,'addresses list in full, got '+kb.all);
ok(kb.hit>0&&kb.hit<kb.all,'search narrows, '+kb.all+' to '+kb.hit);
ok(kb.none===0&&kb.foundAll===0,'a term in no table finds nothing in any section');
ok(kb.empty.length===0,'every section has rows, empty: '+kb.empty.join(','));
ok(kb.opened===10,'every section opens a drill, got '+kb.opened+' of 10');
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
 /* a turn shows the line, a second turn puts the card down and counts it */
 lgTurn(0); const said=(document.querySelector('.gm-line')||{}).textContent||'';
 lgTurn(0); const down=LG.turned, face=LG.cards[0].face, done=LG.cards[0].done;
 /* the channel changes the verb in the line */
 LG.chan=5; lgTurn(1); const feel=(document.querySelector('.gm-line')||{}).textContent||'';
 lgTurn(1); lgStop();
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
 return {dealt,said,down,face,done,feel,uniq,cards,pairs,found,opened,locked};});
ok(gm.dealt===24,'the run deals twenty four, got '+gm.dealt);
ok(gm.uniq===24,'and never the same address twice, got '+gm.uniq+' distinct');
ok(/letting go of believing that I am /.test(gm.said),'a turned card says its line: '+gm.said);
ok(gm.down===1&&!gm.face&&gm.done,'a second turn puts it down and counts it');
ok(/letting go of feeling that I am /.test(gm.feel),'the channel changes the verb: '+gm.feel);
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

console.log('\n=== real JS errors across all of the above ===');
ok(real.length===0,'JS errors: '+real.slice(0,4).join(' | '));
console.log('  count:',real.length);
await browser.close();
console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
