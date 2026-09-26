const {chromium}=require('playwright');
const path=require('path');
/* the target is overridable, so the delivery build can be put through the
   same gates as the source build rather than being trusted. */
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
let PASS=0,FAIL=0;
/* THE BOOT IS A THREE SECOND SHEET, so every page these gates open has to be
   allowed to finish booting before anything is measured or clicked. Without
   it the gates race the boot: they wait under a second, the sheet is still
   up, and a run fails intermittently on whichever surface it happened to
   reach first. Measured once as four failures in one run of four that would
   not reproduce, which is exactly the shape of this kind of race. */
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){/* reduced motion clears it synchronously; a miss is not a failure */}
 /* AND THE OPENING IS DISMISSED, because every page here goes on to test the
    instrument and a first visit meets the onboarding sheet over it. That is
    real behaviour and the gate proved it by failing four Field checks the
    moment onboarding landed, so the sheet is closed the way a person closes
    it rather than hidden. The onboarding has a block of its own below, so
    getting past it here is not the same as not testing it. */
 try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}
 /* AND THE FIELD'S ENTRANCE IS LET FINISH. It assembles on arrival, so for
    its first second the parts are on their way to where they belong and a
    measurement taken then measures the animation. Waited out rather than
    turned off, because it is real and a person sees it. */
 try{ await p.waitForFunction(
   ()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
/* BY NAME, NEVER BY POSITION. Seven checks in this file said loadP(8) and
   meant Gordon, the heaviest case in the roster. The roster grew to fifteen
   and 8 became Ana, so every one of them had been measuring the wrong person
   and three rows about the safety referral were failing for that reason. It
   is the rule this repository already carries about the tab integers, and it
   holds for every table a thing is looked up in. Defined on the context so
   every page and every navigation has it. */
/* AND IT IS EVERY PERSON IN THE ROSTER, NOT ONLY THE HEAVY ONE. GORDON() was
   added after seven checks said loadP(8) and meant Gordon, and the same defect
   was still sitting in this file seventeen times as loadP(6): six is James in
   the browser, because ui/personas.js unshifts the custom persona, so every
   index here is one past the engine's own table and one comment in this file
   said Gordon over a call that loads James. Counted off the file: 34 calls
   carried a literal index and 23 of them named somebody other than the person
   themselves, and those 23 are by name now. PERSON throws rather than returning
   a wrong row, so a roster change fails the gate instead of quietly measuring
   the wrong person.
   loadP(0) stays a literal: zero is the custom persona, which is the person's
   own identity and is what saveYou and toYou both mean by it. */
const GORDON_FN=`window.PERSON=function(nm){
 for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)return i;
 throw new Error(nm+' is not in the roster any more');};
window.GORDON=function(){return window.PERSON('Gordon');};`;
browser.newPage=(orig=>async function(...a){
 const pg=await orig.apply(this,a);
 await pg.addInitScript(GORDON_FN);
 return pg;})(browser.newPage);
browser.newContext=(orig=>async function(...a){
 const cx=await orig.apply(this,a);
 await cx.addInitScript(GORDON_FN);
 return cx;})(browser.newContext);
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const real=[];
page.on('pageerror',e=>real.push('PAGEERROR: '+e.message));
page.on('console',m=>{if(m.type()==='error'){const t=m.text();
 if(!/ERR_CERT_AUTHORITY_INVALID|ERR_FILE_NOT_FOUND|fonts\.googleapis/.test(t))real.push(t);}});
await page.goto(FILE,{waitUntil:'load'}); await booted(page); await page.waitForTimeout(800);

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

/* ---------------------------------------------------------------------------
   THE PAIN MAP OPENS BLANK AND IS PAINTED ON.

   Ruled. It used to print every carrying address the moment it was opened,
   which is the instrument answering before it has been asked: a pain map
   exists to be told where it hurts, and one that arrives already covered is
   telling the person instead.

   Three things are held here. Nothing is drawn until a region is painted. The
   regions are on the figure and not only in the row of buttons, and they are
   clipped to the silhouette so a click lands on the arm rather than beside it.
   And painting the region already selected puts the map back to blank, so a
   person is never stuck holding a selection they cannot drop.
--------------------------------------------------------------------------- */
console.log('\n=== the pain map opens blank ===');
{const pm=await page.evaluate(async()=>{
  loadP(PERSON('James')); setTab(TAB.ENERGY); PMLAYER='pain'; PAINPICK=null; render();
  await new Promise(r=>setTimeout(r,60));
  const marks=()=>document.querySelectorAll('#emap .pm-svg .pm-n').length
   +document.querySelectorAll('#emap .pm-svg g[filter] circle').length;
  const o={blank:marks(), regs:document.querySelectorAll('#emap .pm-pr').length,
   bare:PAINREG.filter(x=>!x.box||!x.box.length).length};
  /* every region is reachable and paints something or honestly nothing */
  const el=document.querySelector('#emap .pm-pr[data-reg="torso"]');
  el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,60));
  o.picked=PAINPICK; o.after=marks();
  /* only the picked region's own bands are drawn */
  const want=PAINREG.filter(x=>x.k==='torso')[0].bands;
  o.foreign=pmMarks(compute()).filter(m=>want.indexOf(m.band)<0).length;
  /* painting it again drops it */
  document.querySelector('#emap .pm-pr[data-reg="torso"]')
   .dispatchEvent(new MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,60));
  o.cleared=PAINPICK; o.back=marks();
  PMLAYER='bands'; PAINPICK=null; render();
  return o;});
 ok(pm.blank===0,'nothing is drawn before a region is painted, got '+pm.blank);
 ok(pm.bare===0,'every pain region carries hit boxes, '+pm.bare+' without');
 ok(pm.regs>=9,'the regions are on the figure, got '+pm.regs+' boxes');
 ok(pm.picked==='torso','painting a region selects it, got '+pm.picked);
 ok(pm.after>0,'and it paints what that region holds, got '+pm.after);
 ok(pm.foreign===0,'and nothing outside its bands, got '+pm.foreign);
 ok(pm.cleared===null,'painting it again clears it, got '+pm.cleared);
 ok(pm.back===0,'and the map goes blank again, got '+pm.back);
 console.log('  blank',pm.blank,' painted',pm.after,' boxes',pm.regs);}

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
await page.evaluate(()=>{loadP(PERSON('James'));setTab(TAB.FIELD);});   // James, heavily loaded
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
 /* scoped to #knowbody. Games folded into Knowledge and its two chooser tabs
    are also .kb-t, so an unscoped count reads 13. The eleven being asserted
    are the knowledge sections. */
 const secs=[...document.querySelectorAll('#knowbody .kb-t')].length;
 /* .kb-row, and the card is gone. The card was 236 by 150 carrying a 19 pixel
    glyph, nine tenths of one percent of its own area, plus three clamped lines
    of subtext that were 78 percent of every character on the page. The owner
    ruled the entry down to four things: the icon, the percent, the word and
    what it is associated with. Measured after the change, counted in a
    screenshot: twelve entries above the fold became thirty nine at 1600 and
    one became six on a phone. */
 const rows=()=>document.querySelectorAll('.kb-row').length;
 const all=rows();
 /* search narrows, and a term that is in no table finds nothing anywhere */
 KB_Q='fear'; kbRender(); const hit=rows();
 KB_Q='zzzznotathing'; kbRender();
 const none=rows(), foundAll=[...document.querySelectorAll('.kb-t b')].reduce((a,b)=>a+ +b.textContent,0);
 KB_Q=''; kbRender();
 /* every section renders and every row opens something */
 let opened=0, empty=[], walked=0, marks={};
 ['addr','fetter','sab','law','mask','dom','arch','gate','card','seat','harm','gloss'].forEach(k=>{
  KB_SEC=k; kbRender();
  if(!document.querySelectorAll('.kb-row').length){empty.push(k);return;}
  walked++;
  {const cards=[...document.querySelectorAll('.kb-row')];
   const ps=cards.map(c=>{const a=c.querySelector('svg path');
    return a?a.getAttribute('d'):null;});
   /* THE MARK ON A ROW IS COMPOSED OF TWO CHANNELS and one of them is colour.
      Counting the path alone counts half the mark and would have reported the
      fetters deck as seven marks when the seat is what separates a Root Fear
      from a Solar Anger. The pair is what a person distinguishes, so the pair
      is what is counted. */
   const pairs=cards.map((c,i)=>(c.style.getPropertyValue('--c')||'')+'|'+(ps[i]||''));
   marks[k]={n:ps.length, uniq:new Set(ps.filter(Boolean)).size,
    pair:new Set(pairs).size, blank:ps.filter(x=>!x).length};}
  document.querySelector('.kb-row').click();
  if(document.getElementById('rdrill').textContent.length>40)opened++;});
 KB_SEC='addr'; KB_Q=''; kbRender();
 /* what the deck chip prints, and how many rows carry no figure */
 const chipEl=[...document.querySelectorAll('#knowbody [data-kb]')]
  .find(e=>e.getAttribute('data-kb')==='addr');
 const chip=chipEl?(chipEl.querySelector('b')||{}).textContent:'';
 const dash=[...document.querySelectorAll('.kb-rv.off')].length;
 /* the deck deals only from what is held, and a card names a real address */
 loadP(PERSON('James')); const pool=deckSize(), held=compute().loaded.length;
 deckDeal(); const card=DECK_CARD; deckClose();
 const rail=[...document.querySelectorAll('.lsec-hd span')].map(e=>e.textContent.trim());
 const stack=[...document.querySelectorAll('#stack button')]
  .map(e=>e.textContent.trim().replace(/\s+/g,' '));
 const text=document.body.innerText;
 return {secs,all,hit,none,foundAll,opened,walked,marks,empty,pool,held,chip,dash,rail,stack,text,
  cardIsHeld:!!(card&&card.n&&card.n.sq>=4), rank:card?card.rank:0,
  names:[...document.querySelectorAll('[data-kb]')].map(e=>e.textContent.trim()
   .replace(/\s+\d+$/,''))};});
/* ASSERT THE DECKS, NOT HOW MANY THERE ARE. This pinned the count at eleven,
   so adding Masks failed it while nothing was wrong, and renaming a deck to a
   word a person could find would have passed it while everything was. What
   matters is that every deck the codex claims to hold is reachable by name.
   The owner asked where the stack and the universal laws were: both were here
   under names that did not say what they held, so those two are named here. */
{const want=['Fetters','Child emotions','Saboteurs','Moral integrity','Masks',
  'Domains','Archetypes','Gates','The cards','The stack','Universal laws'];
 const miss=want.filter(w=>kb.names.indexOf(w)<0);
 ok(miss.length===0,'every deck is reachable by name'
  +(miss.length?', missing '+miss.join(', '):'')+', '+kb.names.length+' decks');
 ok(kb.names.indexOf('The catalog')<0&&kb.names.indexOf('The 76 laws')<0,
  'and neither old name survives');
 /* ONE WORD PER CONCEPT, AND THIS ONE WAS CARRYING TWO.

    The owner: "I do not know the difference between a node and a fetter the
    way you are using it. A fetter is a node. The fetters are the 108. Which
    you listed here between fear, anger, shame, these are the nine child
    emotions. Very different."

    He is right and the product's own glossary already agreed with him: a
    fetter is "a named conditional response pattern resident at a specific
    node address, one per physical node". That is the 112. The nine are the
    poled axes those patterns run on.

    So the deck of addresses is Fetters and the deck of nine is Child
    emotions, and neither old label may come back. The keys did not move:
    addr and fetter are identity and identity is never renamed here, which is
    why this asserts on what a person reads rather than on a key. */
 ok(kb.names.indexOf('Nodes')<0,
  'and the deck of addresses is no longer called Nodes');
 ok(kb.names.indexOf('Laws')<0,
  'and the twenty one are Moral integrity, not Laws');
 /* the glossary is not a deck. A name is glossed once, in one table, and the
    search shows it; fifty six rows whose whole content is a definition are an
    answer to a question rather than a deck of readings. */
 ok(kb.names.indexOf('Glossary')<0,
  'and the glossary is not a deck, it is what the search answers with');
 /* THE RENAME REACHES EVERY SURFACE OR IT IS NOT A RENAME. The codex is one
    of three places the nine are named. The left rail's fourth section holds
    their sliders and the right rail's stack counts them, and a word that
    moves in one place and not the others is how this product ends up with two
    vocabularies for one thing, which is what it just finished removing. */
 ok(kb.rail.indexOf('Child emotions')>=0,
  'the left rail calls the nine child emotions, got '+kb.rail.join(', '));
 ok(kb.rail.indexOf('Fetters')<0,
  'and the rail no longer calls the nine fetters');
 ok(/^Child emotions/.test(kb.stack[0]||''),
  'the stack tab calls them child emotions, got '+(kb.stack[0]||'nothing'));
 ok(!/child fetter/i.test(kb.text),
  'and the phrase child fetter reaches no surface');}
/* ALL 112, NEVER 108. W is the 108 somatic addresses and the four field
   anchors carry Field-Above and Field-Below, which are not seats, so they fell
   out of W and appeared in no deck: the surface that exists to list every
   address was showing 108 of the 112 the product states. A deck chip counting
   its own rows would have printed 108 to a person, and the count stated to
   users is 112. The four are in.

   CHANGED 25 SEPTEMBER. This asserted four en dashes, because the engine
   forced the four to 0 and computed nothing for them. The owner ruled they
   are SQ like the rest, each taking the mean of the seat it extends, so they
   carry a figure now and no row on the deck is a dash. */
ok(kb.all===112,'the fetters deck carries all 112 addresses, got '+kb.all);
ok(kb.chip==='112','and the deck chip says 112, got '+kb.chip);
ok(kb.dash===0,'and every one carries a figure, the four outside included, dashes '+kb.dash);
ok(kb.hit>0&&kb.hit<kb.all,'search narrows, '+kb.all+' to '+kb.hit);
ok(kb.none===0&&kb.foundAll===0,'a term in no table finds nothing in any section');
ok(kb.empty.length===0,'every section has rows, empty: '+kb.empty.join(','));
/* every deck that has cards opens a drill from the first of them. Counted
   against the decks walked rather than a literal, for the same reason as
   above: a new deck is a reason to check it opens, not a reason to fail. */
ok(kb.opened===kb.walked,'every section opens a drill, got '+kb.opened
 +' of '+kb.walked);

/* ---------------------------------------------------------------------------
   IF IT HAS A NAME, IT HAS AN ICON.

   Ruled by the owner, and the codex was the place it was least true. Every card
   read its glyph off its seat, so the twenty one Laws printed seven glyphs
   between them, the seventy six universal laws printed one, the thirty nine
   saboteurs printed one, and the six masks had no deck to print in.

   The rule is not one mark per card. A saboteur's identity is its
   hypercomplex and a universal law's is its axis, so those decks carry one
   mark per family, which is a deliberate count and not a fallback. What is
   refused is a deck of many cards showing a single mark, which is the shape
   the bug had, and any card with no mark at all.
--------------------------------------------------------------------------- */
/* THE FETTERS DECK COMPOSES ITS MARK, AND BOTH CHANNELS ARE THE MARK.

   112 named addresses wore seven marks between them, sixteen rows to a mark,
   which is the icon rule inverted: if it has a name it has an icon. Nobody is
   drawing 112 marks and nobody has to. Every address already states its axis
   and every axis already has a mark, and the seat is already the ring's
   colour. So the colour around the mark is the seat and the mark inside it is
   the axis. Two tables that both ship, nothing new drawn.

   Measured on the running deck: the pair takes the distinct marks from 7 to
   40 and the worst collision from 21 rows to 10. Asserted as a floor, because
   a new axis is a reason to have more marks and never a reason to fail. */
{const want={law:21, mask:6, sab:6, harm:27, fetter:9};
 const floor={addr:30};
 Object.keys(floor).forEach(k=>{const m=kb.marks[k];
  ok(m&&m.pair>=floor[k],'the '+k+' deck composes its mark, '
   +(m?m.pair:0)+' distinct seat and glyph pairs against a floor of '+floor[k]
   +(m?', on '+m.uniq+' glyphs':''));});
 const bad=[];
 Object.keys(kb.marks).forEach(k=>{
  const m=kb.marks[k];
  if(m.blank)bad.push(k+': '+m.blank+' cards with no mark');
  if(want[k]!==undefined&&m.uniq!==want[k])
   bad.push(k+': '+m.uniq+' marks, expected '+want[k]);
  else if(want[k]===undefined&&m.n>3&&m.uniq<2)
   bad.push(k+': '+m.n+' cards sharing one mark');});
 ok(bad.length===0,'every card wears a mark and no deck collapses to one'
  +(bad.length?'  '+bad.join(' | '):''));}
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
 loadP(PERSON('Tomas')); setTab(TAB.GAMES); GAME='lg'; gmRender(); lgStart();
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
/* THE SIX CHANNELS, RULED 26 SEPTEMBER, all six in one sentence. This
   accepted either of two nine word rosters, which is how two lists for one
   slot went unnoticed: the gate was written to pass on both. One stem now. */
const SIXSTEM='I am letting go of believing, perceiving, thinking, behaving, acting, and feeling that I am ';
ok(gm.said.indexOf(SIXSTEM)===0,'a turned card speaks the six channels: '+gm.said);
ok(/^I now embody the truth that I am /.test(gm.truth),
  'and the embodied truth paired to it: '+gm.truth);
ok(gm.half&&gm.counted===0&&!gm.face,
  'one pole of a printed card does not clear it, both channels must run');
ok(gm.other&&gm.other!==gm.said,'the other pole is a different sentence at the same address');
ok(gm.both&&gm.after===1,'both poles clear the printed card, got '+gm.after);

/* THE RELEASE A PERSON RUNS PRINTS THE LINE IT IS RUNNING, AND THE LINE CARRIES
   THE SIX. Before this the release card printed the address and a label like
   "Right limit, line 1" and no sentence at all, so none of the channel lists
   in the catalog reached the one surface that spends allowance. Driven through
   the real buttons, Begin then Skip the opening, then walked across every line
   of the plan it was shown. Closed rather than finished, so nothing is spent. */
const relsix=await page.evaluate(()=>{
 loadP(0); setTab(TAB.FIELD); render();
 const ids=W.filter(n=>n.cf).sort((a,b)=>b.sq-a.sq).slice(0,3).map(n=>n.i);
 relPick(ids);
 const o={plan:RUN.plan.length, begin:!!document.getElementById('relgo'), lines:[]};
 if(!o.begin){relClose(); return o;}
 document.getElementById('relgo').click();
 document.getElementById('relskip').click();
 clearInterval(RUN.timer);
 const rd=()=>{const el=document.querySelector('#rel .rel-line');
  return {key:RUN.plan[RUN.idx], text:el?el.textContent:null,
   eye:(document.querySelector('#rel .pm-eye')||{}).textContent||''};};
 o.first=rd();
 for(let i=0;i<RUN.plan.length;i++){RUN.idx=i; relRender(); o.lines.push(rd());}
 o.unique=(CURP.meter.unique||[]).length;
 relClose();
 o.after=(CURP.meter.unique||[]).length;
 return o;});
ok(relsix.begin&&relsix.plan>0,'the release offers a run on the person\'s own record, '+relsix.plan+' lines');
ok(relsix.first.text&&relsix.first.text.indexOf(SIXSTEM)===0,
 'the first line of a live release runs the six channels: '+relsix.first.text);
{const lim=relsix.lines.filter(l=>/limit$/.test(String(l.key).split(':')[1]));
 const tru=relsix.lines.filter(l=>/truth$/.test(String(l.key).split(':')[1]));
 const bad=lim.filter(l=>!l.text||l.text.indexOf(SIXSTEM)!==0);
 ok(lim.length>0&&bad.length===0,'every release line of the run carries the six, '
  +lim.length+' checked'+(bad.length?'  '+bad.map(l=>l.key+' '+l.text).join(' | '):''));
 ok(tru.length>0&&tru.every(l=>l.text&&l.text.indexOf('letting go')<0),
  'and every reframe line installs rather than releasing again, '+tru.length+' checked');
 /* the side and the phase are still named above the line. The six sit inside
    the four passes, they do not replace them. */
 ok(relsix.lines.every(l=>/^(Right|Left) (limit|truth), line \d+$/.test(l.eye)),
  'every line still names its side and phase: '+relsix.lines.map(l=>l.eye).slice(0,4).join(' | '));}
ok(relsix.after===relsix.unique,'reading the lines spends nothing, the meter charges at the end of a run');
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
 loadP(PERSON('Angela')); toYou();
 const ownAfterToYou=(CURP===PROF_BY[PEOPLE[0].nm]);
 S.charge.Fear=7.7; syncCh(); saveYou();
 await new Promise(r=>setTimeout(r,600));
 const first=pStore()[0].axes.Fear.held;
 loadP(PERSON('Marcus')); loadP(0);
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
await blank.goto(FILE,{waitUntil:'load'}); await booted(blank); await blank.waitForTimeout(400);
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
/* CHANGED 25 SEPTEMBER. This asserted a band word here. One held address
   still makes it a reading, but CQ is the laws alone and this person has
   answered none, so the word waits for all 21 and the slot says what is left
   to answer. A band word here would be one read off laws nobody answered. */
ok(virgin.unreadAfter===false&&/^\d+ laws? to answer$/.test(virgin.after),
 'and one held address makes it a reading, with the band waiting on the laws: '+JSON.stringify(virgin.after));
const bands=['Incoherent','Corrupt','Severe','Collapsed'].filter(w=>virgin.sweep.includes(w));
ok(bands.length===0,'no band word appears anywhere on an unread first screen, found: '
 +(bands.join(', ')||'none'));
await blank.close();

console.log('\n=== nothing in the rail is clipped without an affordance ===');
/* Witness rendered as Witn at every desktop width, in a row that did not wrap
   and had no scrollbar. Rule 10: never hide a control with no affordance. */
const clip=await page.evaluate(()=>{
 loadP(PERSON('James')); setTab(TAB.FIELD); render();
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
/* ON THE PERSON'S OWN RECORD, BECAUSE THAT IS THE ONLY PLACE A COMMIT LANDS.
   This ran on James. The commit handler's last line calls toYou(), so the press
   wrote the charge onto James's field, the entry onto James's record, and then
   moved the pointer to the person's own, which left the undo for it belonging to
   a record the person was no longer standing in. The two rows here caught that
   the moment the history was keyed to its record: the arrow was correctly not
   offered and the field correctly did not come back. The commit refuses on a
   worked example now, and undo is checked where a person actually commits. */
const un=await page.evaluate(()=>{
 loadP(0); setTab(TAB.STORY); render();
 const o={hiddenAtRest:document.getElementById('undobtn').hidden};
 const before=JSON.stringify(S.charge);
 ST_TEXT='I could not stop going over it and it had me. I said nothing and I let it sit.';
 ST_PARSED=parseStory(ST_TEXT); stRender();
 const ap=document.getElementById('stapply'); if(ap)ap.click();
 o.changed=(JSON.stringify(S.charge)!==before);
 /* The label is the accessible name now, not printed text. Ruled: just the
    arrows. What it owes is unchanged, so this reads it where it moved to
    rather than dropping the assertion. */
 o.label=document.getElementById('undobtn').getAttribute('aria-label');
 o.shown=!document.getElementById('undobtn').hidden;
 document.getElementById('undobtn').click();
 o.restored=(JSON.stringify(S.charge)===before);
 o.hiddenAgain=document.getElementById('undobtn').hidden;
 return o;});
ok(un.hiddenAtRest,'the control is hidden when there is nothing to take back');
ok(un.changed,'committing a story changes the field');
ok(un.shown&&/committing the story/.test(un.label),
 'and the control still names what it will undo, as its accessible name: '+JSON.stringify(un.label));
ok(un.restored,'undo restores the field exactly');
ok(un.hiddenAgain,'and hides itself again when the stack empties');

console.log('\n=== a label never appears without what it owes ===');
/* The owner's ruling. A word like Severe with nothing attached is a judgement.
   The same word with a definition, the behaviour and the direction is a
   reading. Checked on Gordon, the heaviest case in the roster. */
const lab=await page.evaluate(()=>{
 loadP(GORDON()); setTab(TAB.FIELD); render();
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
await tapPg.goto(FILE,{waitUntil:'load'}); await booted(tapPg); await tapPg.waitForTimeout(700);
const tapped=await tapPg.evaluate(()=>{
 loadP(PERSON('Tomas')); setTab(TAB.FIELD); render();
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
 await page.evaluate(zz=>{loadP(PERSON('James'));setTab(TAB.FIELD);S.view=0;S.zoom=zz;reframe();render();},z);
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
await touchPg.goto(FILE,{waitUntil:'load'}); await booted(touchPg); await touchPg.waitForTimeout(700);
/* The wheel is drawn on a requestAnimationFrame, and the app no longer opens on
   Field, so at this point in a fresh page the wheel has never been drawn and
   HIT is empty. Switch, let one frame pass, then probe. Nothing about the
   product changed here: it is the harness that was relying on the old opening
   surface having already painted. */
await touchPg.evaluate(()=>{loadP(PERSON('James')); setTab(TAB.FIELD); render();});
await touchPg.waitForTimeout(300);
const drag=await touchPg.evaluate(()=>{
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

console.log('\n=== the frame moves, and the core opens ===');
/* LEFT DRAG. It wrote S.panx and called render, and render draws from CX and
   CY, which only reframe() sets. So the numbers moved and the picture did not,
   at every zoom level. Measured before the fix: a 72 pixel drag took panx from
   0 to 72 and left CX at 332. */
await page.evaluate(()=>{loadP(PERSON('James'));setTab(TAB.FIELD);});
await page.waitForTimeout(300);
const pan=await page.evaluate(()=>{
 const cv=document.getElementById('cv'), rc=cv.getBoundingClientRect();
 /* a spot the hit test calls empty, found rather than assumed */
 let sx=null,sy=null;
 for(let yy=10;yy<rc.height-10&&sx===null;yy+=9)
  for(let xx=10;xx<rc.width-10;xx+=9){if(!hitTest(xx,yy)){sx=xx;sy=yy;break;}}
 const ev=(t,X,Y)=>cv.dispatchEvent(new PointerEvent(t,{clientX:rc.left+X,
  clientY:rc.top+Y,pointerId:9,button:0,buttons:1,bubbles:true,
  pointerType:'mouse',isPrimary:true}));
 function drag(z){
  S.zoom=z;S.panx=0;S.pany=0;reframe();render();
  const c0=CX, d0=CY;
  ev('pointerdown',sx,sy);
  for(let d=12;d<=72;d+=12)ev('pointermove',sx+d,sy+d);
  ev('pointerup',sx+72,sy+72);
  return {dx:Math.round(CX-c0),dy:Math.round(CY-d0)};}
 const at1=drag(1), at3=drag(3);
 /* a press that never moves is still a click on the core */
 S.zoom=1;S.panx=0;S.pany=0;reframe();render();rdClose();
 const core=HIT.filter(h=>h.k==='core')[0];
 ev('pointerdown',core.x,core.y); ev('pointerup',core.x,core.y);
 const opened=(document.getElementById('rdrill').textContent||'').trim().length;
 rdClose();
 /* and a NaN cannot brick the frame, which it could: CX is read by every draw
    and every hit test, so one bad value stopped the wheel for the session. */
 S.zoom=NaN; S.panx=NaN; reframe();
 const survives=isFinite(CX)&&isFinite(CY)&&isFinite(U);
 S.zoom=1;S.panx=0;S.pany=0;reframe();render();
 return {spot:[sx,sy],at1,at3,opened,survives};});
ok(pan.at1.dx===72&&pan.at1.dy===72,
 'left drag moves the frame at zoom 1, got '+JSON.stringify(pan.at1));
ok(pan.at3.dx===72&&pan.at3.dy===72,
 'and at zoom 3, got '+JSON.stringify(pan.at3));
ok(pan.opened>120,'a press on the core that never moves still opens the reading, got '+pan.opened);
ok(pan.survives,'a non finite zoom cannot leave the frame unrecoverable');
console.log(' ',JSON.stringify(pan));

/* THE CORE ATOMIZES. Three layers, each a real decomposition of CQ, each
   fading in over its own threshold. Nothing at zoom 1, which is the state
   every person starts in. */
/* a coherent field, so the feathers have length, and one frame per reading:
   the wheel draws on a requestAnimationFrame, so HIT belongs to the frame
   BEFORE the one this asked for. */
await page.evaluate(()=>{loadP(PERSON('Rosa')); setTab(TAB.FIELD);});
await page.waitForTimeout(260);
const core={steps:await page.evaluate(()=>CORE_STEP.slice())};
for(const [k,z] of [['z1',1],['z18',1.8],['z28',2.8],['z42',4.2]]){
 await page.evaluate(zz=>{S.zoom=zz;S.panx=0;S.pany=0;reframe();render();},z);
 await page.waitForTimeout(220);
 core[k]=await page.evaluate(()=>({
  a:[coreLayerA(0),coreLayerA(1),coreLayerA(2)].map(x=>+x.toFixed(2)),
  open:+coreOpen().toFixed(2),res:coreResolved(),
  rad:+(HIT.filter(h=>h.k==='core')[0].rad).toFixed(1)}));}
await page.evaluate(()=>{S.zoom=1;S.panx=0;S.pany=0;reframe();render();});
ok(core.z1.open===0&&core.z1.res==='',
 'the core is closed at zoom 1, which is where everybody starts');
ok(core.z18.a[0]>0&&core.z18.a[1]===0,'the triad comes in first, got '+core.z18.a);
ok(core.z28.a[1]>0&&core.z28.a[2]===0,'then the seven seats, got '+core.z28.a);
ok(core.z42.a[2]>0,'then the twenty one laws, got '+core.z42.a);
ok(core.steps[0]<core.steps[1]&&core.steps[1]<core.steps[2],
 'the thresholds are ordered, got '+core.steps);
/* each layer ramps rather than snapping, so nothing appears between one frame
   and the next */
ok(core.z18.a[0]>0&&core.z18.a[0]<1,'a layer fades in rather than snapping, got '+core.z18.a[0]);
/* an exploded view needs somewhere to explode into */
ok(core.z42.rad>core.z1.rad*1.5,
 'the core grows as it opens, '+core.z1.rad+' to '+core.z42.rad);
/* this said "and it says what it is showing", which was the line under the
   depth bar. BA2 cut that line, so nothing says it now; the name is still how
   this block holds which layer resolved at 2.8. */
ok(core.z28.res==='the seven seats','and the layer resolved there is the seven seats, got '+core.z28.res);
console.log(' ',JSON.stringify(core));

console.log('\n=== the readout stays off the pointer, and a real press reaches the core ===');
/* BA6. "The tooltip covers up the mouse point." The readout was placed in the
   canvas's coordinates and drawn in the stage's, so it landed 110 pixels left
   of and 87 above where it was aimed and sat on the pointer across the wheel.
   Measured on the build before the fix: 527 of 964 readouts over the pointer,
   at three widths and three zooms, the core first at every one.

   The press in the frame block above could not have seen it. It dispatches
   its events straight at the canvas, and an event handed to an element has
   already been delivered: nothing on top can intercept it and no box can cover
   it. These go through the mouse, which is the only route a person has. */
await page.evaluate(()=>{loadP(PERSON('Abraham'));setTab(TAB.FIELD);
 S.zoom=1;S.panx=0;S.pany=0;reframe();render();S.pin=null;rdClose();});
await page.waitForTimeout(300);
const offPtr=await (async()=>{
 /* one point per target, found from HIT rather than assumed, and only the
    ones a pointer can actually reach on this viewport */
 const pts=await page.evaluate(()=>{
  const rc=document.getElementById('cv').getBoundingClientRect(), out=[];
  HIT.forEach(h=>{let x,y;
   if(h.x!==undefined){x=h.x;y=h.y;}
   else{const a=(h.a0+h.a1)/2,r=(h.r0+h.r1)/2;x=h.cx+Math.cos(a)*r;y=h.cy+Math.sin(a)*r;}
   const X=rc.left+x,Y=rc.top+y;
   if(x>2&&y>2&&x<rc.width-2&&y<rc.height-2&&X<innerWidth-2&&Y<innerHeight-2)
    out.push([X,Y]);});
  return out;});
 let on=0,over=0,first=null;
 for(const [X,Y] of pts){
  await page.mouse.move(X,Y);
  const r=await page.evaluate(([X,Y])=>{const pr=document.getElementById('probe');
   if(!pr.classList.contains('on'))return null;
   const b=pr.getBoundingClientRect();
   return X>=b.left&&X<=b.right&&Y>=b.top&&Y<=b.bottom;},[X,Y]);
  if(r===null)continue; on++;
  if(r){over++; if(!first)first=[Math.round(X),Math.round(Y)];}}
 /* and the core, pressed the way a person presses it: arrive, read the
    readout that says to click, click */
 const c=await page.evaluate(()=>{S.pin=null;rdClose();
  const rc=document.getElementById('cv').getBoundingClientRect();
  const h=HIT.filter(h=>h.k==='core')[0]; return {x:rc.left+h.x,y:rc.top+h.y};});
 await page.mouse.move(c.x-60,c.y-60); await page.mouse.move(c.x,c.y,{steps:6});
 const said=await page.evaluate(()=>{const pr=document.getElementById('probe');
  return pr.classList.contains('on')?pr.textContent:'';});
 await page.mouse.down(); await page.mouse.up();
 await page.waitForTimeout(250);
 const opened=await page.evaluate(()=>
  (document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ').trim());
 /* off the wheel and onto bare ground, so no later block inherits a hover */
 await page.mouse.move(4,996);
 await page.evaluate(()=>{S.pin=null;rdClose();render();});
 return {targets:pts.length,on,over,first,said,opened};})();
ok(offPtr.on>100,'the readout comes up on the wheel\'s targets under a real pointer, '
 +offPtr.on+' of '+offPtr.targets);
ok(offPtr.over===0,'and it is never over the pointer, '+offPtr.over+' of '+offPtr.on
 +(offPtr.first?', first at '+offPtr.first:''));
ok(/the core/.test(offPtr.said)&&/Click for the breakdown/.test(offPtr.said),
 'the core\'s readout is up and says to click, said '+JSON.stringify(offPtr.said.slice(0,40)));
/* runCoreDrill's own first two lines, which no other drill prints */
ok(/The core\s*(CQ \d|not read yet)/.test(offPtr.opened),
 'and a real press on the core opens the core, got '+JSON.stringify(offPtr.opened.slice(0,40)));
console.log('  '+offPtr.on+' readouts under a real pointer, '+offPtr.over+' over it, and the press opened '
 +JSON.stringify(offPtr.opened.slice(0,36)));

console.log('\n=== the lines he struck on the Field are gone ===');
/* BA2 and BA9. The line under Charge, "the core is showing the triad, the
   shell is showing the fetters", and the legend over the wheel, "The ring is
   the seven seats". Two elements and two writers, not one line counted twice.
   Read at zoom 2, because that is where the line under Charge used to appear:
   at zoom 1 it was hidden anyway and an absence there proves nothing. The
   third, the worked example notice, is held at the release below and at the
   rail's setters here. */
const struck=await page.evaluate(()=>{
 loadP(PERSON('Abraham')); setTab(TAB.FIELD);
 setZoom(2,CW/2,CH/2);
 /* innerText and not textContent: the stage also hosts the hidden surfaces of
    other tabs, the knowledge base among them, and a phrase in there is not a
    line on the Field */
 const txt=(document.getElementById('subbar').innerText||'')
  +' '+(document.getElementById('stage').innerText||'');
 const o={note:!!document.getElementById('zoomnote'),
  legend:!!document.getElementById('cvlegend'),
  resolved:coreResolved()+' / '+fetResolved(),
  showing:/is showing the/.test(txt), ring:/The ring is the seven seats/.test(txt)};
 S.zoom=1;S.panx=0;S.pany=0;reframe();render();
 return o;});
ok(!struck.note&&!struck.legend,'neither element is in the document, zoomnote '
 +struck.note+', legend '+struck.legend);
ok(/triad/.test(struck.resolved),'zoom 2 still resolves the layers the line used to name, '
 +struck.resolved);
ok(!struck.showing&&!struck.ring,'and neither sentence is anywhere on the Field there');
console.log('  '+JSON.stringify(struck));
/* THE NOTICE HAD SIX MORE DOORS. BC1 routed the rail's blueprint domains, root
   domains and archetypes, and the wheel's two rings, through notYours, which
   printed the struck sentence word for word from every one of them. A press
   on one of them on a worked example, through the control itself. */
const setter=await page.evaluate(()=>{
 loadP(PERSON('Abraham')); setTab(TAB.FIELD);
 const who=S.who, st=document.getElementById('status');
 document.querySelector('#doms button').click();
 return {stayed:S.who===who, said:st.textContent||'', kind:st.getAttribute('data-kind')};});
ok(setter.stayed&&setter.kind==='fail'&&/worked example/.test(setter.said)
 &&!/You are looking at/.test(setter.said)&&(setter.said.match(/[.!?](\s|$)/g)||[]).length===1,
 'a rail setter on a worked example refuses in one line and stays put, said '
 +JSON.stringify(setter.said));

console.log('\n=== the fetters grow, and one of them runs a protocol ===');
/* The shell resolved nothing on zoom: an address was a tick at every
   magnification, so coming in gave a bigger tick and no more information. */
/* n.disp eases toward n.sq at 0.14 a frame, and the address depth is drawn
   from disp, so a reading taken before it settles is a reading of an animation
   in progress. Measured: the same address came back 13.3 on both zooms because
   both were read mid-ease. Let it land. */
await page.evaluate(()=>{loadP(PERSON('James'));setTab(TAB.FIELD);});
await page.waitForTimeout(900);
const fet={steps:await page.evaluate(()=>FET_STEP.slice())};
for(const [k,z] of [['z1',1],['z28',2.8],['z46',4.6]]){
 await page.evaluate(zz=>{S.zoom=zz;S.panx=0;S.pany=0;reframe();render();},z);
 await page.waitForTimeout(420);
 fet[k]=await page.evaluate(()=>{
  const hits=HIT.filter(h=>h.k==='node');
  /* the heaviest address, and how deep its target now reaches */
  const heavy=W.filter(x=>x.sq>=4).sort((a,b)=>b.sq-a.sq)[0];
  const hh=hits.filter(h=>h.n===heavy)[0];
  return {a:[fetA(0),fetA(1)].map(x=>+x.toFixed(2)),res:fetResolved(),
   n:hits.length,
   /* angular width and radial depth of one target, in the wheel's own units */
   wide:+((hh.a1-hh.a0)*1000).toFixed(1),
   deep:+((hh.r1-hh.r0)/U*100).toFixed(1)};});}
ok(fet.z1.a[0]===0&&fet.z1.res==='','the shell is closed at zoom 1');
/* THE THRESHOLDS CAME DOWN on the owner's ruling, because every symbol he
   asked to see was being drawn after the ring had left the frame: the shell
   is fully on screen only to zoom 2.08 and the glyph layer used to start at
   2.60. At 1.55 and 2.05 both layers are already open by 2.8, so the
   assertion is the ORDERING rather than a pair of values at one zoom. The
   glyph never arrives after the name. */
ok(fet.z28.a[0]>=fet.z28.a[1],'the glyph layer is never behind the name layer, got '+fet.z28.a);
ok(fet.z28.a[0]>0,'and the shell is open by 2.8, got '+fet.z28.a[0]);
ok(fet.z46.a[1]>0,'then they are named, got '+fet.z46.a);
ok(fet.z46.wide>fet.z1.wide,'a grown address is a wider target, '+fet.z1.wide+' to '+fet.z46.wide);
ok(fet.z46.deep>fet.z1.deep,'and a deeper one, '+fet.z1.deep+' to '+fet.z46.deep);
ok(fet.z1.n===108&&fet.z46.n===108,'and there are still 108, never more and never fewer');
console.log(' ',JSON.stringify(fet));

/* RUN THE PROTOCOL HERE. The reading used to end at the reading. */
const prot=await page.evaluate(()=>{
 S.zoom=1;S.panx=0;S.pany=0;reframe();render();
 const heavy=W.filter(x=>x.sq>=4).sort((a,b)=>b.sq-a.sq)[0];
 const empty=W.filter(x=>x.sq<1)[0];
 runNodeDrill(heavy);
 const onHeld=!!document.querySelector('[data-prot]');
 const copy=(document.getElementById('rdrill').textContent||'');
 runNodeDrill(empty);
 const onEmpty=!!document.querySelector('[data-prot]');
 const emptyCopy=(document.getElementById('rdrill').textContent||'');
 runNodeDrill(heavy);
 document.querySelector('[data-prot]').click();
 const out={onHeld,onEmpty,
  open:RUN.open,queue:RUN.queue.length,plan:RUN.plan.length,
  addr:RUN.queue[0]&&RUN.queue[0].k, want:heavy.k,
  /* the run names the address rather than leaving a person to press and find out */
  says:/Four channels, twenty five lines/.test(copy),
  emptySays:/nothing to release/.test(emptyCopy)};
 relClose(); rdClose();
 return out;});
ok(prot.onHeld,'an address that is carrying offers the protocol');
ok(!prot.onEmpty,'and an empty one does not, because that would be a ritual');
ok(prot.emptySays,'which it says, rather than showing a control that refuses');
ok(prot.says,'the control states what the run will be before it is pressed');
ok(prot.open&&prot.queue===1,'pressing it opens a run scoped to that one address');
ok(prot.addr===prot.want,'and it is the address that was clicked, '+prot.addr);
ok(prot.plan>0&&prot.plan<=25,'with a real plan under the cap, got '+prot.plan);
console.log(' ',JSON.stringify(prot));

console.log('\n=== the summary, the opening screen ===');
/* The app opens here, so this surface is what a stranger sees and what an
   owner comes back to. It carries four blocks that did not exist before this
   pass and none of them had a gate. */
const sum=await page.evaluate(()=>{
 loadP(PERSON('James')); setTab(TAB.SUMMARY);
 const q=s=>document.querySelectorAll(s).length;
 const body=document.getElementById('sumbody');
 /* every ring on this surface is the same object: icon, arc, pill */
 const rings=[...document.querySelectorAll('#sumbody .cr')];
 const badRing=rings.filter(c=>!c.querySelector('svg.arc')||!c.querySelector('.gl svg'));
 /* a pill that is empty must not paint, or a colour marker grows a chip */
 const emptyPill=rings.filter(c=>{const v=c.querySelector('.v');
  return v&&!v.textContent.trim()&&getComputedStyle(v).display!=='none';});
 return {
  glance:q('#sumbody .s-gl'),
  storyP:q('#sumbody .s-story .s-p'),
  structRows:q('#sumbody .s-row'),
  doms:q('#sumbody .s-dom'),
  chips:q('#sumbody .s-chip'),
  /* no boxes around the spiritual glyphs, on the owner's ruling */
  chipBox:[...document.querySelectorAll('#sumbody .s-chip')]
   .filter(c=>getComputedStyle(c).borderTopWidth!=='0px').length,
  numRows:q('#sumbody .s-nrow'),
  numParts:q('#sumbody .s-npart'),
  rings:rings.length, badRing:badRing.length, emptyPill:emptyPill.length,
  /* the folded analytics is still there, underneath */
  ana:(document.getElementById('ana').textContent||'').trim().length,
  /* nothing may run wider than its own column */
  over:[...body.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+2
   &&getComputedStyle(e).overflowX==='visible').length,
  text:(body.textContent||'').replace(/\s+/g,' ')};});
ok(sum.glance>=5,'the glance strip carries every reading, got '+sum.glance);
ok(sum.storyP===3,'the story is three paragraphs, got '+sum.storyP);
ok(sum.structRows>5,'the structures panel lists what is measured, got '+sum.structRows);
ok(sum.doms>0,'and draws the blueprint selection, got '+sum.doms);
ok(sum.chips>=5,'the spiritual layer is a row of glyphs, got '+sum.chips);
ok(sum.chipBox===0,'with no boxes around them, got '+sum.chipBox);
ok(sum.numRows>=5,'numerology prints its numbers, got '+sum.numRows);
ok(sum.numParts===3,'and every name on its own, got '+sum.numParts);
ok(sum.rings>8&&sum.badRing===0,
 sum.rings+' rings and every one is icon, arc and pill, bad '+sum.badRing);
ok(sum.emptyPill===0,'an empty value paints no pill, got '+sum.emptyPill);

/* ---------------------------------------------------------------------------
   THE LADDER, AND THE RULING IT HAD TO GET PAST

   The owner asked for badges, achievements and a score, and this product has a
   standing ruling that a reading is never a score and a count is never printed
   against a total. Both hold, because a reading and a record are different
   things: what is true of you now has no maximum and is nobody's business to
   score, and what you did is a count of events that happened.

   So the surface is allowed to count days, minutes, addresses and marks, and
   is not allowed to print any of them as a share of anything. This sweeps the
   rendered text for that shape. Sixteen marks exist and the word sixteen must
   not be on the page, nor "of 16", nor a percentage beside a mark.
--------------------------------------------------------------------------- */
console.log('\n=== the ladder, and no score ===');
{const ld=await page.evaluate(async()=>{
  loadP(PERSON('James'));
  const base=Date.now();
  CURP.rituals=[]; for(let i=0;i<9;i++)
   CURP.rituals.push({t:new Date(base-i*86400000).toISOString(),min:14,steps:['a']});
  setTab(TAB.COMPASS);
  await new Promise(r=>setTimeout(r,500));
  const el=document.querySelector('.ld');
  if(!el)return {missing:true};
  const txt=el.textContent;
  return {missing:false,
   marks:document.querySelectorAll('.ld-m').length,
   glyphs:[...document.querySelectorAll('.ld-m svg path')].map(x=>x.getAttribute('d')),
   streak:(document.querySelector('.ld-n')||{}).textContent,
   nexts:document.querySelectorAll('.ld-next').length,
   acc:document.querySelectorAll('.ld-acc button').length,
   /* the shapes a count against a total takes */
   ofN:/\b\d+\s*(of|\/)\s*\d+\b/i.test(txt),
   pct:/\d+\s*%/.test(txt),
   total:new RegExp('\\b'+MARKS.length+'\\b').test(txt),
   txt:txt.slice(0,40)};});
 ok(!ld.missing,'the ladder renders on the compass');
 ok(ld.marks>0,'earned marks are shown, got '+ld.marks);
 ok(ld.glyphs&&ld.glyphs.every(Boolean)&&new Set(ld.glyphs).size===ld.marks,
  'every mark wears its own icon');
 ok(ld.streak==='9','the streak is nine days, got '+ld.streak);
 ok(ld.nexts===1,'exactly one next mark is named, got '+ld.nexts);
 ok(ld.acc===1,'and the accountability half hands over one control, got '+ld.acc);
 ok(!ld.ofN,'no count is printed against a total');
 ok(!ld.pct,'and no mark carries a percentage');
 ok(!ld.total,'and the number of marks that exist is never stated');
 console.log('  marks',ld.marks,' streak',ld.streak);}
ok(sum.ana>200,'the folded analytics renders underneath, got '+sum.ana+' chars');
ok(sum.over===0,'nothing on the surface overflows its own box, got '+sum.over);
/* the prose is a reading, not a template: it names what was measured */
ok(/blueprint you were born on|no birth data/.test(sum.text),
 'the story opens on the spiritual layer');
/* RE-RULED, for the same reason as the onboarding row above. This asserted the
   literal word "Momentum", which was a Label glued to the front of a Reading:
   one string doing two jobs, on a surface where neither of the other two
   paragraphs carries a label, and a sentence that opened on its own
   denominator. The intent is that the reading closes on which way the field
   leans, so the row asserts that instead of the word. */
ok(/the field leans/i.test(sum.text)&&/benign|malignant/i.test(sum.text),
 'and closes on which way the field leans');
ok(!/undefined|NaN|\[object/.test(sum.text),'and nothing leaked a placeholder');
console.log(' ',JSON.stringify({glance:sum.glance,rows:sum.structRows,chips:sum.chips,
 num:sum.numRows,rings:sum.rings}));

/* every control on the surface opens something. a button that does nothing is
   the defect this product keeps finding in itself. */
const sumOpen=await page.evaluate(()=>{
 loadP(PERSON('James')); setTab(TAB.SUMMARY);
 const sel=['[data-sp]','[data-num]','[data-dom]','[data-seat]','[data-arch]','[data-gl]'];
 const out={};
 sel.forEach(s=>{
  /* rdClose re-renders, and a re-render replaces the whole surface, so the
     node has to be found AFTER the close or the click lands on a detached
     element and silently does nothing. */
  rdClose();
  const b=document.querySelector('#sumbody '+s);
  if(!b){out[s]='absent';return;}
  b.click();
  out[s]=(document.getElementById('rdrill').textContent||'').trim().length;});
 rdClose();
 return out;});
Object.keys(sumOpen).forEach(k=>{
 ok(sumOpen[k]==='absent'||sumOpen[k]>60,
  'the summary control '+k+' opens a reading, got '+sumOpen[k]);});
console.log(' ',JSON.stringify(sumOpen));

/* the six numbers are the six numbers, and they are the person's own */
const numUI=await page.evaluate(()=>{
 loadP(PERSON('James'));
 const N=numerologyOf('James',null);
 setTab(TAB.SUMMARY);
 const txt=(document.getElementById('sumbody').textContent||'');
 return {full:N.parts.join(' '), inPage:txt.indexOf('James Edward Cavanaugh')>=0,
  lp:N.lifePath, hasLp:txt.indexOf('Life path')>=0,
  /* THE CONVERGENCE SHOWS ITS BASIS, never a bare percentage.

     This asserted the literal form "N of M comparisons". That form is a count
     against a total, which the Bible forbids outright, and the copy underneath
     it used to carry a sentence explaining that it was not a score, which is an
     admission that it read as one. The ruling is the one that moved, not the
     code, so the gate now asserts what the ruling actually wants: both numbers
     are on the page, the word comparisons is there to say what they count, and
     no percentage is offered in their place. */
  basis:/\bcomparisons?\b/.test(txt)&&/\b\d+\b/.test(txt),
  noFrac:!/\d+\s+of\s+\d+\s+comparisons/.test(txt),
  pct75:/convergence[^.]*\d+%/i.test(txt)};});
ok(numUI.inPage,'the full name is read, not the roster nickname');
ok(numUI.hasLp,'and the six numbers are on the page');
ok(numUI.basis,'convergence names the comparisons it rests on');
ok(numUI.noFrac,'and does not state them as a count against a total');
ok(!numUI.pct75,'and never a bare percentage with no denominator');

console.log('\n=== every tab fits a phone ===');
/* The stage drops its overflow and its min height at 720 so the wheel can flow
   down the screen. The tab panels stayed position:absolute against it, so every
   one of them rendered into a 36px window with the rest clipped: Knowledge had
   5,729 pixels of content inside it and Games 3,564, with no way to reach any
   of it. A panel taller than its own box is the whole bug, so that is the
   assertion. */
const phone=await browser.newPage({viewport:{width:390,height:844}});
await phone.goto(FILE,{waitUntil:'load'}); await booted(phone); await phone.waitForTimeout(700);
for(const [t,sel] of [['STORY','#story'],['SUMMARY','#sum'],['ANALYTICS','#ana'],
                      ['INTAKE','#iq'],['KNOW','#know'],['GAMES','#games']]){
 const r=await phone.evaluate(([tt,ss])=>{
  loadP(PERSON('James')); setTab(TAB[tt]);
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
console.log('\n=== settings does not take the rail with it when it leaves ===');
/* Settings has no entry in TABDEF, by design, and setTab cleared the body's
   tab class from TABDEF alone while adding it from TABDEF plus TABEXTRA. So
   tab-settings went on and never came off, and the rule that collapses the
   right rail on Settings stayed applied on every surface for the rest of the
   session. The centre column kept rendering, so nothing looked broken.

   Asserted on the class and on the measured rail, because the class is the
   cause and the rail is what a person loses. */
const stuck=await page.evaluate(()=>{
 const railW=()=>{const r=document.querySelector('[data-rail]');
  return r?Math.round(r.getBoundingClientRect().width):-1;};
 const o={};
 setTab(TAB.FIELD); render(); o.before=railW();
 setTab(TAB.SETTINGS); render(); o.onSettings=railW();
 setTab(TAB.FIELD); render();
 o.after=railW();
 o.cls=document.body.className;
 /* every extra surface, not only Settings, because the defect is the table
    and not the tab */
 o.leftOver=Object.keys(TABEXTRA).filter(function(k){
  var T=TABEXTRA[k];
  return T&&T.cls&&document.body.classList.contains(T.cls);});
 return o;});
ok(stuck.before>0,'the rail is on the screen to begin with, measured '+stuck.before);
ok(stuck.after===stuck.before,
 'and it is the same width after a visit to settings, was '+stuck.before+' now '+stuck.after);
ok(stuck.leftOver.length===0,
 'no folded surface leaves its body class behind: '+(stuck.leftOver.join(' ')||'none'));

console.log('\n=== the compass has two ends and both are doors ===');
/* The cone was a picture of a direction with nothing at either end of it. The
   top is anchored by the twelve, the bottom by the blueprint and the nine
   circles, and the rule that governs both is that they render as behaviours
   and never as entities. */
const pole=await page.evaluate(()=>{
 const o={};
 loadP(GORDON()); setTab(TAB.FIELD); render();
 o.who=(PEOPLE[S.who]||{}).nm;
 o.ends=document.querySelectorAll('#pol2 [data-polend]').length;
 const txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 runPoleDrill('up'); o.up=txt();
 runPoleDrill('dn'); o.dn=txt();
 /* a row on either roster opens that axis with both poles on it */
 runPoleDrill('up');
 const row=document.querySelector('#rdrill [data-mirror]');
 o.rows=document.querySelectorAll('#rdrill [data-mirror]').length;
 if(row){row.click(); o.axis=txt();}
 /* EX and not CQ since 25 September, as the drill reads it: the descent and
    its referral read expression, because CQ is the laws alone and cannot see
    the load that makes a field decoherent. */
 const r=compute(); o.cq=Math.round(r.EX); o.dark=darkRead(r.malig/100,r.EX).dark;
 /* AND A COHERENT FIELD IS NEVER SHOWN IT. This used to build the clean case
    by hand, zeroing the nine and setting the laws to ten. Measured, that
    construction reads CQ 9 with malignancy 81: it is not a clean field and
    never was, and the check only passed because the branch it was testing was
    dead for everybody. So the clean case is a person who is actually clean,
    by name, and the roster carries several. */
 /* AND IT IS PUT BACK BY LOADING THE CASE AGAIN, NOT BY UNDO. This pushed a
    state here and popped it after switching person, which is the crossing the
    leak block below measures: a history belongs to the record it was taken from
    and the pop now refuses, correctly. loadP is the route a person has. */
 var ri=0; for(var q=0;q<PEOPLE.length;q++)if(PEOPLE[q].nm==='Rosa')ri=q;
 loadP(ri); render();
 const rc=compute();
 o.cleanCQ=Math.round(rc.EX); o.cleanMal=Math.round(rc.malig);
 o.cleanDark=darkRead(rc.malig/100,rc.EX).dark;
 runPoleDrill('dn'); o.clean=txt();
 loadP(GORDON()); render();
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
ok(pole.who==='Gordon','the heaviest case is the one being read, got '+pole.who);
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
 loadP(GORDON()); setTab(TAB.FIELD); render();
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
 /* the doors moved to a data attribute. They render in the rail and on the
    summary now, and two elements cannot share one id. */
 const d2=document.querySelector('#start [data-start="nine"]'),
       d3=document.querySelector('#start [data-start="ages"]');
 if(d2){d2.click(); o.two=(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');}
 if(d3){d3.click(); o.three=(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');}
 /* and the block is gone once there is something to read */
 loadP(GORDON()); render();
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
/* CHANGED 25 SEPTEMBER. These asserted the arithmetic still produced a
   number above 0 here, 36 off the default six, and then that the number
   appeared nowhere on the page. There is no default reading to leak any
   more: an unanswered law counts 0 by the owner's ruling, so CQ is 0 and
   filling. The regression this guards is the default six coming back into
   CQ, which would read 60 here, and that is asserted directly. The search
   for the figure on the page is gone with it, because 0 is on every page. */
ok(virginSweep.cq===0,'and with no law answered CQ is 0, filling, never a figure off the '
 +'default six, got '+virginSweep.cq);
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

console.log('\n=== the opening, which is the one thing it asks a stranger to do ===');
/* HIS RULINGS, GATED. Humble and warm, one interactive thing, the same flow
   for both arrivals, replayable from the profile, and it spends no charge.
   The last of those is the one that matters most: an opening that wrote to
   the nine axes would be a reading taken before anybody had said anything. */
{const ob=await page.evaluate(async()=>{
  const before=CHARGES.map(c=>+(S.charge[c]||0));
  obOpen(true);
  const o={opened:OB.open, steps:[], wrote:false};
  o.steps.push(document.querySelector('.ob-h').textContent);
  document.querySelector('[data-ob=next]').click();
  await new Promise(r=>setTimeout(r,60));
  o.steps.push(document.querySelector('.ob-h').textContent);
  document.querySelector('[data-ob=next]').click();
  await new Promise(r=>setTimeout(r,60));
  o.steps.push(document.querySelector('.ob-h').textContent);
  o.seats=document.querySelectorAll('[data-obseat]').length;
  /* it will not advance until the one question is answered */
  o.blocked=document.querySelector('[data-ob=next]').disabled;
  document.querySelector('[data-obseat=Heart]').click();
  await new Promise(r=>setTimeout(r,60));
  o.freed=!document.querySelector('[data-ob=next]').disabled;
  o.captured=OB.felt;
  document.querySelector('[data-ob=next]').click();
  await new Promise(r=>setTimeout(r,60));
  o.steps.push(document.querySelector('.ob-h').textContent);
  o.said=document.querySelector('.ob-card').innerText;
  document.querySelector('[data-ob=done]').click();
  await new Promise(r=>setTimeout(r,60));
  o.closed=!OB.open;
  const after=CHARGES.map(c=>+(S.charge[c]||0));
  o.wrote=before.some((v,i)=>Math.abs(v-after[i])>1e-9);
  o.flagged=!!(CURP&&CURP.onboarded);
  return o;});
 ok(ob.opened,'the opening opens');
 ok(ob.steps.length===4,'four steps, got '+ob.steps.length);
 ok(ob.seats===8,'the signal test offers seven seats and nothing, got '+ob.seats);
 ok(ob.blocked,'it will not go on until the one question is answered');
 ok(ob.freed&&ob.captured==='Heart','and answering it frees the way on, captured '+ob.captured);
 ok(/moved your body/i.test(ob.said),'the last card names what just happened');
 ok(ob.closed,'and it closes');
 /* THE ONE THAT MATTERS. Ruled: it does not spend real charge. */
 ok(ob.wrote===false,'and it wrote nothing to the nine axes');
 ok(ob.flagged,'the record remembers it was met, so it does not open twice');}
/* AND IT DOES NOT OPEN BY ITSELF. Ruled 20 September: onboarding is off for
   now. Off is a measurement and not a comment, so a fresh page with nothing
   stored is watched past the moment the sheet used to arrive, which is 5600ms
   after boot. The replay rows above still walk every step, which is the whole
   point of a flag rather than a deletion: the flow is intact and unmet. */
{const solo=await browser.newPage({viewport:{width:1600,height:1000}});
 await solo.goto(FILE,{waitUntil:'load'});
 await solo.waitForTimeout(7000);
 const q=await solo.evaluate(()=>({auto:(typeof OB_AUTO==='undefined'?null:OB_AUTO),
   open:!!(typeof OB!=='undefined'&&OB.open),
   sheet:!!document.querySelector('.ob-card'),
   replay:typeof obOpen==='function'}));
 await solo.close();
 ok(q.auto===false,'the automatic open is off by ruling, read OB_AUTO '+q.auto);
 ok(q.open===false&&q.sheet===false,'so a stranger meets the instrument and no sheet');
 ok(q.replay,'and the flow is still there to be replayed');}
/* HUMBLE AND WARM, AND NOT MECHANICAL. His words, and the copy is checked for
   them rather than trusted, because this is the first thing a stranger reads
   and the instrument's own voice is the wrong voice for it. */
{const words=await page.evaluate(async()=>{
  obOpen(true); const t=document.querySelector('.ob-card').innerText; obClose(); return t;});
 ok(/for you/i.test(words),'the first card speaks to the person');
 /* RE-RULED, and the row it replaces is the failure mode this repository has
    already turned a fixed defect into twice. It asserted the literal word
    "alone", which came from a clause that has since been cut: "you are not
    carrying it alone" answers a fear nobody has raised on that screen and
    claims companionship this product does not provide, being neither a coach,
    a friend nor a guide.

    What the owner ruled is the warmth, and he gave the words for it: "hey,
    this is you, and it is okay. No judgment." So the row asserts those two,
    which is the thing worth protecting, rather than a word that was never in
    the ruling. A gate that asserts a sentence fails the day the sentence is
    improved. */
 ok(/it is okay/i.test(words)&&/no judg/i.test(words),
   'and it is warm in the two phrases he ruled, it is okay and no judgment');
 ok(!/[0-9]+%/.test(words),'and prints no percentage at a stranger');}

console.log('\n=== the navigation is in the document and cannot drift ===');
/* THE BAR IS HARD CODED NOW, on his ruling after three builds in a row where
   the top menu was missing: it was nine buttons built in a loop at start up,
   so it existed only if the script reached that loop.

   Markup that duplicates a list in the engine is markup that goes stale, and
   this repository has been bitten by a hand written count five times. So the
   two are compared here, by identity integer and by name and in order, and
   the gate fails on any disagreement rather than waiting for somebody to
   notice a tab that opens the wrong surface. */
{const nav=await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('#tabbar [data-tabk]')];
  return {markup:btns.map(b=>[+b.getAttribute('data-tabk'),b.textContent.trim()]),
          def:TABDEF.map(t=>[t.k,t.nm]),
          wired:btns.filter(b=>b.getAttribute('data-tabk')!==null).length,
          pressed:btns.filter(b=>b.getAttribute('aria-pressed')==='true')
                      .map(b=>b.textContent.trim())};});
 ok(nav.markup.length===nav.def.length,
  'the bar has as many buttons as TABDEF has entries, '
  +nav.markup.length+' against '+nav.def.length);
 ok(JSON.stringify(nav.markup)===JSON.stringify(nav.def),
  'and every one matches TABDEF by integer, by name and in order'
  +(JSON.stringify(nav.markup)===JSON.stringify(nav.def)?''
    :'  markup '+JSON.stringify(nav.markup)+'  def '+JSON.stringify(nav.def)));
 ok(nav.wired===nav.markup.length,'every button carries its own tab integer');
 ok(nav.pressed.length===1,'exactly one tab reads as pressed, got '+nav.pressed.length);
}
/* AND PRESSING ONE STILL MOVES THE SURFACE. A hard coded bar that is not wired
   is a picture of a menu. */
{const moved=await page.evaluate(async()=>{
  const b=[...document.querySelectorAll('#tabbar [data-tabk]')]
    .filter(x=>+x.getAttribute('data-tabk')!==S.tab)[0];
  const want=+b.getAttribute('data-tabk');
  b.click(); await new Promise(r=>setTimeout(r,320));
  return {want:want, got:S.tab,
          pressed:b.getAttribute('aria-pressed')};});
 ok(moved.got===moved.want,'pressing a tab moves the surface, asked '
  +moved.want+' got '+moved.got);
 ok(moved.pressed==='true','and the button it pressed reads as pressed');}
await page.evaluate(()=>setTab(TAB.FIELD));

console.log('\n=== the build says which build it is, and how much of it arrived ===');
/* Two builds went out with a fix in them and the same failure came back both
   times, and there was no way to tell from this side which file was open. */
/* read off the root element, not off the boot card: the card is removed from
   the document once the sequence ends, which is precisely when a person asks
   which build they have. */
{const st=await page.evaluate(()=>{
  const e=document.getElementById('eof');
  return {stamp:(document.documentElement.getAttribute('data-build')||'').trim(),
          len:e?e.getAttribute('data-len'):''};});
 ok(/^[0-9a-f]{7,}\s+\d{4}-\d{2}-\d{2}/.test(st.stamp),
  'the document carries the commit and the build time, got '+JSON.stringify(st.stamp));
 ok(/^\d{9}$/.test(st.len),
  'and the end of file marker carries the byte length, got '+JSON.stringify(st.len));}

console.log('\n=== a release run spends thought lines, and charges the right person ===');
const relrun=await page.evaluate(()=>{
 const o={};
 /* what the person's own record holds BEFORE this run, so a leak from an
    earlier step in this page is not blamed on the release. */
 o.youBefore=Object.keys(PEOPLE[0].c||{}).reduce(function(a,k){
   return a+(+PEOPLE[0].c[k]||0);},0);
 /* A RELEASE ON A REFERENCE CASE REFUSES, and that is what this block now
    checks first. A reference case is a demonstration, not a record: the
    patterns would be the person's and the charge would not. Two earlier
    attempts at this wrote one person's field into the other's record and then
    wiped the field and billed for it; refusing is the only version that does
    neither. */
 loadP(GORDON()); setTab(TAB.FIELD); render();
 {const g=compute();
  relPick(W.filter(function(n){return n.sq>=4;}).slice(0,3).map(function(n){return n.i;}));
  RUN.phase='run'; RUN.idx=1e9;
  var refused=relCoolDown();
  var g2=compute();
  o.refOnRef=(S.who===GORDON());
  o.refCq=Math.abs(g2.CQ-g.CQ)<1e-9;
  o.refCarry=g2.loaded.length===g.loaded.length;
  o.refReturn=(refused===false);
  /* BA9. What the refusal said, and what the picker says while the case is
     up: the sentence he struck carried both, and they went to two places. */
  var st=document.getElementById('status'), ps=document.getElementById('psel');
  o.refSaid=st.textContent||''; o.refKind=st.getAttribute('data-kind');
  o.refPicker=ps.options[ps.selectedIndex].textContent;
  RUN.done=false; RUN.phase='pick'; RUN.queue=[]; RUN.plan=[]; RUN.log=[];}
 /* and now the person's own, which is the path that actually runs */
 loadP(0); setTab(TAB.FIELD); render();
 {const ps=document.getElementById('psel');
  o.ownPicker=ps.options[ps.selectedIndex].textContent;
  o.caseBack=ps.querySelector('option[value="'+GORDON()+'"]').textContent;
  o.caseAge=PEOPLE[GORDON()].age;}
 const held=W.filter(n=>n.sq>=4).slice(0,3).map(n=>n.i);
 relPick(held);
 o.plan=RUN.plan.length;
 o.setup=(document.getElementById('rel').textContent||'').replace(/\s+/g,' ');
 o.distinct=new Set(RUN.plan).size;
 /* THE PERSON WHO RAN IT IS THE PERSON CHARGED, and nothing in the run moves
    who that is. An earlier build repointed CURP at the person's own record
    part way through, which charged one record and wrote the field of another;
    the repoint is gone and the refusal above stands in its place, so the run
    both starts and ends on whoever pressed it. */
 o.beforeWho=S.who;
 const ownBefore=(PROF_BY[PEOPLE[0].nm].meter.unique||[]).length;
 RUN.phase='run'; RUN.idx=RUN.plan.length-1;
 relCoolDown();
 o.afterWho=S.who;
 /* AND THE FIELD MOVED WITH THE IDENTITY. The meter half of this was fixed
    once and the field half was not, so the reference case's whole charge
    vector ended up in the person's own record: measured at 50.6 on a person
    whose nine axes were all zero. S.who===0 is a claim that S holds the
    person's own field, and this is the check that the claim is true. */
 o.youCharge=Object.keys(PEOPLE[0].c||{}).reduce(function(a,k){
   return a+(+PEOPLE[0].c[k]||0);},0);
 o.liveCharge=CHARGES.reduce(function(a,c){return a+(+S.charge[c]||0);},0);
 saveYou();
 o.savedCharge=Object.keys(PEOPLE[0].c||{}).reduce(function(a,k){
   return a+(+PEOPLE[0].c[k]||0);},0);
 o.ownGained=(PROF_BY[PEOPLE[0].nm].meter.unique||[]).length-ownBefore;
 /* THE REFERENCE CASE, BY NAME. This read PEOPLE[8], which is Ana, while the
    run it is reporting on was started on Gordon, so the number it printed was
    about a person the block never touched. */
 o.gordonGained=(PROF_BY[PEOPLE[GORDON()].nm]
   ?((PROF_BY[PEOPLE[GORDON()].nm].meter.unique||[]).length):0);
 /* a second run continues rather than repeating */
 relPick(held);
 o.plan2=RUN.plan.length;
 o.overlap=RUN.plan.filter(k=>(CURP.meter.unique||[]).indexOf(k)>=0).length;
 relClose();
 return o;});
/* A RUN COSTS THE MINIMUM NOW, RULED, so twenty five is a ceiling and not the
   size of every run. These pinned the old fill-to-the-cap behaviour, under
   which one address cost the same as eight and ten free patterns a week bought
   nothing at all. The assertions are the rule: the run is as big as the
   selection needs, it is never bigger than the cap, it never repeats a line
   inside itself, the setup quotes its own real size before anybody begins, and
   every line lands on the person's own record. */
ok(relrun.plan>0&&relrun.plan<=25,
 'a run is at most twenty five thought lines, got '+relrun.plan);
ok(relrun.distinct===relrun.plan,'and never repeats a line inside one run');
ok(new RegExp(relrun.plan+' thought lines of new ground').test(relrun.setup),
 'the setup says what it costs before anybody begins, quoting '+relrun.plan);
/* THE ASSERTION IS THAT THE NUMBER SAYS WHAT IT IS OF, not that it says one
   particular sentence. This demanded "N of your allowance", which is the
   phrasing the voice work struck: it says N of what, and on a grant of ten a
   week against a run that caps at twenty five it reads as a bill nobody can
   pay. A gate that quotes copy word for word turns a fixed defect into a
   failing row, which this repository has now done twice. */
ok(new RegExp(relrun.plan+'\\s+patterns of the \\d+ you have left').test(relrun.setup),
 'and that it says what the number is out of, quoting '+relrun.plan);
ok(relrun.beforeWho===0&&relrun.afterWho===0,
 'the run starts and ends on the person\'s own record, no repoint in the middle');
ok(relrun.ownGained===relrun.plan,
 'and every line lands there rather than on the reference case, got '+relrun.ownGained);
ok(relrun.refReturn,'a release on a reference case refuses');
ok(relrun.refOnRef,'and leaves the person looking at the case they were on');
ok(relrun.refCq,'and does not move its coherence');
ok(relrun.refCarry,'and does not empty its carrying addresses');
/* BA9, the rule and not the words. The refusal still reports, because a write
   that fails in silence is the defect this codebase forbids by name, and it
   names its own reason. It is one sentence, because he struck the two sentence
   version that stood above the Field as unnecessary text. The state it also
   carried is on the picker for as long as the case is up, and goes when the
   case does. */
ok(relrun.refKind==='fail'&&/worked example/.test(relrun.refSaid),
 'the refusal reports as a failure and names its reason, said '+JSON.stringify(relrun.refSaid));
ok(!/You are looking at/.test(relrun.refSaid)&&(relrun.refSaid.match(/[.!?](\s|$)/g)||[]).length===1,
 'in one sentence, not the struck one');
ok(/^Gordon\b/.test(relrun.refPicker)&&/example/.test(relrun.refPicker),
 'the picker names the case and marks it as an example while it is up, reads '
 +JSON.stringify(relrun.refPicker));
ok(relrun.ownPicker==='Custom'&&!/example/.test(relrun.caseBack)
 &&relrun.caseBack.indexOf('Gordon, '+relrun.caseAge+', ')===0,
 'and on the person\'s own record it reads Custom and the case goes back to its age and role, '
 +JSON.stringify([relrun.ownPicker,relrun.caseBack]));
/* THE FIELD MOVES WITH THE IDENTITY, OR A STRANGER'S FIELD BECOMES YOURS.
   Measured before the fix: a person whose nine axes were all zero came out of a
   release run started on James carrying 50.6 of his charge, saved and
   persisted. The meter half of this was fixed once; the field half was not. */
ok(relrun.youCharge===relrun.youBefore,
 'a release run on a reference case leaves the person\'s own field where it was, '
 +'was '+relrun.youBefore.toFixed(2)+', now '+relrun.youCharge.toFixed(2));
/* This compared the live field after the release against the stored field
   before the save, which differ by exactly the release, so it was measuring
   the release and calling it a leak. What it means to check is that the live
   field and the person's record agree once the save has run. */
ok(Math.abs(relrun.liveCharge-relrun.savedCharge)<1e-9,
 'and the live field and the person\'s record agree once saved, got '
 +relrun.liveCharge.toFixed(2)+' live against '+relrun.savedCharge.toFixed(2)+' saved');
ok(relrun.overlap===0,'the next run continues rather than re-offering opened ground');

console.log('\n=== a worked example never reaches the person\'s own record ===');
/* TWO FIELD LEAKS, BOTH UPSTREAM OF THE RELEASE, BOTH MEASURED BEFORE THEY WERE
   FIXED AND BOTH MEASURED AFTER.

   The release path above is guarded and has been since 50.6 of a stranger's
   charge landed in somebody's record. These are the two routes into the same
   failure that the release guard cannot see, because neither of them goes
   through the release.

   One. Visiting a reference case pushed its scratch profile onto PROFILES,
   which is the person's own record list and the thing pPersist writes to the one
   storage key. Measured on a clean page before the fix: visit Gordon, come
   back, move one charge, and the store held a second record named Gordon
   carrying 78.0 units of held charge and 21 of 21 measured laws, surviving a
   reload. In a full run of this file the store reached 21 records, 15 of them
   personas and 6 of those duplicated.

   Two. The undo stack held one history for the whole app. A change made on a
   reference case sat on it, the person returned to their own record, and the
   arrow restored the case's field into S with S.who back at 0, which is the
   claim that S holds the person's own field. settle() then calls saveYou() and
   pSave() and writes it through. Measured in the full run of this file before
   the fix: 53.0 of James's charge in PEOPLE[0].c and in the person's own
   record, at the top of the release block, on a person who had entered nothing.

   Both rows count what they find rather than testing a number, so neither goes
   stale when the roster grows. */
{
 const lk=await browser.newPage({viewport:{width:1600,height:1000}});
 await lk.goto(FILE,{waitUntil:'load'});
 await lk.evaluate(()=>{try{localStorage.clear();}catch(e){}});
 await lk.reload({waitUntil:'load'}); await booted(lk);
 const leak=await lk.evaluate(()=>{
  const o={};
  const sumAx=p=>Object.keys(p.axes||{}).reduce((a,k)=>a+(+p.axes[k].held||0),0);
  const store=()=>{try{return JSON.parse(localStorage.getItem('source.profiles')||'[]');}
   catch(e){return [];}};
  const sumYou=()=>+CHARGES.reduce((a,c)=>a+(+PEOPLE[0].c[c]||0),0).toFixed(2);
  const gi=GORDON(); o.example=PEOPLE[gi].nm;
  /* ONE. a visit, then one edit of their own, which is every drag of a slider */
  loadP(gi);
  o.liveOnCase=+CHARGES.reduce((a,c)=>a+(+S.charge[c]||0),0).toFixed(2);
  toYou(); S.charge.Fear=2.2; syncCh(); saveYou(); persistNow();
  o.records=store().map(p=>({name:p.name, charge:+sumAx(p).toFixed(2),
   laws:Object.keys(p.laws||{}).filter(k=>p.laws[k]!=null).length}));
  const demos=PEOPLE.filter(p=>!p.you).map(p=>p.nm);
  o.borrowed=o.records.filter(r=>demos.indexOf(r.name)>=0);
  o.crossed=+o.borrowed.reduce((a,r)=>a+r.charge,0).toFixed(2);
  /* TWO. a change made on the case, then the arrow pressed on their own record */
  loadP(gi); setTab(TAB.FIELD); render();
  undoPush('a change on the worked example');
  S.charge.Fear=Math.min(10,(+S.charge.Fear||0)+1); syncCh(); render();
  toYou(); render();
  const btn=document.getElementById('undobtn');
  o.offered=!!btn&&!btn.hidden;
  o.youBefore=sumYou();
  o.recBefore=CURP?+sumAx(CURP).toFixed(2):0;
  if(btn)btn.click();
  o.youAfter=sumYou();
  o.recAfter=CURP?+sumAx(CURP).toFixed(2):0;
  o.who=S.who;
  /* AND IT IS KEYED, NOT CLEARED. Refusing by emptying the stack on every
     switch would cost a person their whole history for one look at a worked
     example, so the history has to still be there on the record it belongs to. */
  loadP(gi); render();
  const b2=document.getElementById('undobtn');
  o.backOffered=!!b2&&!b2.hidden;
  o.backDepth=undoDepth();
  /* THREE. and a story cannot be committed onto it either. Same crossing, same
     answer as the release: the words would be the person's and the field is not,
     and the commit handler ends on toYou(), so the press used to write the entry
     into a record the person does not own and then walk them away from it. */
  setTab(TAB.STORY); render();
  ST_TEXT='I could not stop going over it and it had me. I said nothing and I let it sit.';
  ST_PARSED=parseStory(ST_TEXT); stRender();
  /* THE EXAMPLE'S OWN RECORD IS HELD BEFORE THE PRESS, because the commit
     handler's last line calls toYou() and repoints CURP. The first cut of this
     row read CURP after the press, which is the person's own record by then, so
     it reported no entry added while the entry had gone into the example's. */
  const exRec=CURP;
  const ent0=((exRec&&exRec.story&&exRec.story.entries)||[]).length;
  const ap2=document.getElementById('stapply');
  o.stArmed=!!ap2&&!ap2.disabled;
  if(ap2)ap2.click();
  o.stEntries=((exRec&&exRec.story&&exRec.story.entries)||[]).length-ent0;
  o.stWho=S.who; o.stExample=gi;
  o.stSaid=((document.getElementById('status')||{}).textContent||'');
  return o;});
 ok(leak.borrowed.length===0,
  'the person\'s store holds only their own records, found '+leak.borrowed.length
  +' borrowed carrying '+leak.crossed.toFixed(2)+' units: '
  +(leak.borrowed.map(r=>r.name+' '+r.charge.toFixed(2)+' charge, '+r.laws+' laws')
    .join(' | ')||'none')+'   store: '+JSON.stringify(leak.records));
 ok(!leak.offered,
  'the arrows never offer a step that belongs to another record, offered '+leak.offered);
 ok(leak.youAfter===leak.youBefore,
  'an undo taken on a worked example cannot land in the person\'s own field, was '
  +leak.youBefore.toFixed(2)+', now '+leak.youAfter.toFixed(2)
  +', the example holding '+leak.liveOnCase.toFixed(2));
 ok(leak.recAfter===leak.recBefore,
  'nor in the record on disk, was '+leak.recBefore.toFixed(2)+', now '
  +leak.recAfter.toFixed(2));
 ok(leak.who===0,'and the person is still on their own record, S.who '+leak.who);
 ok(leak.backOffered&&leak.backDepth>0,
  'and the example still carries its own history when you go back to it, offered '
  +leak.backOffered+' depth '+leak.backDepth);
 ok(leak.stArmed,'the commit control is armed on the example, so the refusal is the '
  +'thing being measured and not a disabled button');
 ok(leak.stEntries===0,
  'a story cannot be committed onto a worked example, entries added to its record '
  +leak.stEntries);
 ok(leak.stWho===leak.stExample,
  'and the press does not walk the person off the example either, S.who '+leak.stWho
  +' against '+leak.stExample);
 /* the reason and not the words. This quoted "worked example rather than
    your record", which was the long form he struck in BA9; the refusal is one
    line now and still names why. */
 ok(/worked example/.test(leak.stSaid)&&!/You are looking at/.test(leak.stSaid),
  'and it says why rather than clearing the box in silence, said '
  +JSON.stringify(leak.stSaid.slice(0,90)));
 console.log('  example '+leak.example+' holding '+leak.liveOnCase.toFixed(2)
  +'   store '+leak.records.length+' record'+(leak.records.length===1?'':'s')
  +'   borrowed '+leak.crossed.toFixed(2)
  +'   own field '+leak.youBefore.toFixed(2)+' to '+leak.youAfter.toFixed(2));
 await lk.close();
}

console.log('\n=== the record file has a door, and it opens on the record controls ===');
/* THE BOUNDARY HAD NO CALLER. validateProfile and pImport were built, atomic and
   reporting, and the only controls that reached them were written inside
   profileSheet, which nothing in the app opens: measured in the built product,
   the token profileSheet appears twice, the definition and one call inside itself
   to redraw after a density change. So a person finished the web reading, saved a
   real record, and had nowhere in the product to put it. The importer is drawn in
   the account area now, beside Export and Delete, and this row walks it: a real
   record out of pExport, pasted into the control a person can actually see, and
   the reading has to come out the same on the other side. */
{
 const door=await browser.newPage({viewport:{width:1600,height:1000}});
 await door.goto(FILE,{waitUntil:'load'}); await booted(door);
 const dr=await door.evaluate(()=>{
  const o={};
  /* a real record, carried the way a person carries one: as a file */
  loadP(GORDON());
  const rec=pExport();
  const want=compute();
  o.wantCQ=+want.CQ.toFixed(2); o.wantHeld=want.loaded.length;
  o.recBytes=(rec||'').length;
  /* and now the person, on their own empty record, looking for where it goes */
  loadP(0); setTab(TAB.SETTINGS); ACC_OPEN='privacy'; renderAccount();
  const box=document.getElementById('acimp'),
        go=document.getElementById('acimpgo'),
        pick=document.getElementById('acimpf');
  o.box=!!box; o.go=!!go; o.pick=!!pick;
  o.goTap=go?Math.min(go.getBoundingClientRect().width,go.getBoundingClientRect().height):0;
  o.before=+compute().CQ.toFixed(2); o.beforeUnread=compute().unread;
  o.records0=PROFILES.length;
  if(!box||!go)return o;
  box.value=rec; go.click();
  const got=compute();
  o.gotCQ=+got.CQ.toFixed(2); o.gotHeld=got.loaded.length;
  o.records1=PROFILES.length;
  o.curp=CURP&&CURP.name;
  o.said=(document.getElementById('acimpmsg')||{}).textContent||'';
  /* AND A REFUSAL MOVES NOTHING. The boundary is atomic and says why, and a door
     onto it is only safe while that stays true, so the door is measured on the
     refusal too and not only on the good case. */
  const keepName=CURP&&CURP.name, keepCQ=+compute().CQ.toFixed(2);
  /* the controls are looked up again, because a load redraws the surface they
     sit on and the old nodes are detached. A person types into the box that is
     on the screen, so the gate has to as well. */
  const box2=document.getElementById('acimp'), go2=document.getElementById('acimpgo');
  o.rearmed=!!box2&&!!go2;
  if(box2)box2.value='{"v":2,"name":"broken","avatar":"not an object"}';
  if(go2)go2.click();
  o.badSaid=(document.getElementById('acimpmsg')||{}).textContent||'';
  o.badCurp=CURP&&CURP.name; o.badCQ=+compute().CQ.toFixed(2);
  o.badKept=(keepName===o.badCurp&&Math.abs(keepCQ-o.badCQ)<1e-9);
  o.records2=PROFILES.length;
  return o;});
 ok(dr.box&&dr.go&&dr.pick,
  'the record controls are on the screen a person can reach, box '+dr.box
  +' load '+dr.go+' file '+dr.pick);
 ok(dr.goTap>=44,'and the load control clears the tap floor, smallest side '
  +Math.round(dr.goTap));
 ok(dr.beforeUnread===true&&dr.recBytes>500,
  'the person starts unread and the record is a real file, '+dr.recBytes+' bytes');
 ok(Math.abs(dr.gotCQ-dr.wantCQ)<0.01&&dr.gotHeld===dr.wantHeld,
  'loading it puts the same reading back, wanted '+dr.wantCQ+' on '+dr.wantHeld
  +' carrying, got '+dr.gotCQ+' on '+dr.gotHeld);
 ok(dr.records1===dr.records0+1,'and it lands as one new record, '+dr.records0
  +' before, '+dr.records1+' after');
 ok(/^Loaded /.test(dr.said),'and the control says what happened, said '
  +JSON.stringify(dr.said.slice(0,60)));
 ok(dr.rearmed,'the controls are still on the screen after a load, box and button '
  +dr.rearmed);
 ok(/^Not loaded\. /.test(dr.badSaid),
  'a record the boundary refuses says so by name, said '+JSON.stringify(dr.badSaid.slice(0,80)));
 ok(dr.badKept&&dr.records2===dr.records1,
  'and nothing moved on the refusal, record '+JSON.stringify(dr.badCurp)+' at '
  +dr.badCQ+', list '+dr.records2);
 console.log('  record '+dr.recBytes+' bytes   CQ '+dr.before+' to '+dr.gotCQ
  +' against '+dr.wantCQ+'   records '+dr.records0+' to '+dr.records1);
 await door.close();
}

console.log('\n=== the avatar, and what it aims the work at ===');
/* The becoming half. The right hand sentence resolves to a seat and the seat
   has addresses with weight, which is what turns a value into something the
   release queue can aim at. */
const avat=await page.evaluate(()=>{
 const o={}, txt=()=>(document.getElementById('rdrill').textContent||'').replace(/\s+/g,' ');
 loadP(GORDON()); setTab(TAB.FIELD); render();
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
ok(/solar, \d+/.test(avat.av),
 'the row names the seat and what is held there, got '+(avat.av.match(/solar, \d+/)||['none'])[0]);
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
 loadP(GORDON()); setTab(TAB.FIELD); render();
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
ok(/100 patterns left of the 100 you were given/.test(plan.free),
 'and is inside the gift, with both halves of the number said');
ok(/400 of new ground a month/.test(plan.free),
 'the step up states its own figure rather than subtracting a week from a month');
ok(/On\s*Tier two/.test(plan.two)&&/580 of 800 left this month/.test(plan.two),
 'a live tier reads its own grant and what is left of it');
ok(/You can see\s*everything/.test(plan.two),
 'sight is not for sale, so every tier sees everything');
ok(/On every tier including free/.test(plan.two),
 'and the panel names what is on every tier rather than what the next one unlocks');
/* TWO MONTHS FREE IS OUT, on the owner's ruling, and this assertion is the
   reason it survived: it pinned the sentence "twelve months for the price of
   10" to the screen, so a ruling made in the design records could not reach
   the product without the gate refusing it.

   It asserts the rule now rather than the number. The annual line never
   offers months it is not giving away, and it always says the allowance is
   monthly, which is true at any price. */
ok(!/price of/.test(plan.two),
 'the annual line does not offer free months while none are ruled');
ok(/allowance still arrives monthly/.test(plan.two),
 'and the allowance is monthly whatever the year costs');
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
 /* the embedded typeface is forty eight kilobytes of base64 and base64 is
    every three letter sequence there is, so it comes out before the scan.
    Scanning it found cvc inside the font and reported a card field. */
 const src=document.documentElement.innerHTML
  .replace(/data:font\/woff2;base64,[A-Za-z0-9+/=]+/g,'data:font');
 const bad=[];
 [/sk_live/,/sk_test/,/pk_live/,/\bcus_[A-Za-z0-9]/,/\bsub_[A-Za-z0-9]/,
  /card\s*number/i,/cardnumber/i,/cvc/i].forEach(function(re){
   if(re.test(src))bad.push(String(re));});
 return bad;});
ok(leak.length===0,'no key, customer id or card field is anywhere in the build: '+leak.join(', '));

/* ============================================================
   THE ATOM LAYER IS REACHABLE, AND IT DRAWS WHERE THE STORIES ARE

   Three things had to be true at once and two of them were false when this
   was first written, both silently.

   The threshold sat at 5.20 and the zoom ceiling was 5, so the deepest layer
   in the product could not be reached by any gesture. Every function in it
   measured correctly and none of them ever ran.

   And it was gated on the carrying floor. A story spreads its weight across
   up to four addresses per seat and applyStory scales what lands by a third,
   so two committed entries leave every touched address reading between 1.2
   and 2.8 against a floor of 4. The layer was invisible in exactly the case
   it exists for.

   So the gate zooms with the wheel rather than by assignment, which is the
   only path that reframes, and it asserts the atoms are there after a story
   that leaves nothing above the floor.
   ============================================================ */
{
 console.log('\n=== the atom, past the fetters ===');
 const pa=await browser.newPage({viewport:{width:1600,height:1000}});
 await pa.goto(FILE,{waitUntil:'load'}); await booted(pa);
 await pa.waitForTimeout(900);
 const tabs=await pa.$$eval('.tabtop',a=>a.map(x=>x.textContent.trim()));
 const go=async nm=>{await pa.$$eval('.tabtop',(a,i)=>a[i].click(),
   tabs.findIndex(t=>new RegExp(nm,'i').test(t))); await pa.waitForTimeout(600);};
 await go('Story');
 await pa.fill('#sttext','I was humiliated in the meeting and I said nothing. '
  +'My chest went tight and I felt ashamed the rest of the day.');
 await pa.waitForTimeout(450);
 await pa.evaluate(()=>{const e=document.getElementById('stapply');if(e)e.click();});
 await pa.waitForTimeout(700);
 const ents=await pa.evaluate(()=>((window.CURP&&CURP.story&&CURP.story.entries)||[]).length);
 ok(ents===1,'the story committed, entries '+ents);
 const idx=await pa.evaluate(()=>Object.keys(atomIndex()||{}).length);
 ok(idx>0,'re-reading the entry gives back its imprints, '+idx+' addresses');
 /* AND NONE OF THEM IS ABOVE THE CARRYING FLOOR, which is the whole point.
    Read from sq and not from disp: disp is the eased display value and it
    does not exist until the wheel has drawn a frame, so asking for it from
    the Story tab throws on undefined.toFixed. The probe, not the product. */
 const below=await pa.evaluate(()=>Object.keys(atomIndex()||{})
   .every(k=>{const n=BY[+k];return n&&n.sq<4;}));
 ok(below,'and they sit under the carrying floor, where the old gate hid them');

 await go('Field');
 const box=await (await pa.$('#cv')).boundingBox();
 /* THROUGH THE GESTURE, AND ON THE RING.

    Setting S.zoom and calling render leaves U at the old magnification,
    because only setZoom reframes, so a probe that assigns it is testing a
    state the product never enters.

    And the anchor matters. Zoom is pointer anchored: whatever is under the
    pointer stays under it. Zooming from the middle of the canvas magnifies
    about the centre and pushes the whole shell out of the box, which is
    correct and is not what anybody does. A person zooming into an address
    puts the pointer on that address first. */
 /* and on an address the story actually landed on. At this magnification the
    visible slice of the ring is narrow, so zooming onto an arbitrary address
    keeps that address and pushes the seven that have atoms out of the box.
    Which is the instrument working: a person zooms into the thing they came
    to look at. */
 /* ONE ANCHOR IS NOT ENOUGH, BECAUSE NOT EVERY ANCHOR LEAVES AN ATOM REACHABLE.

    Zoom is pointer anchored, so at this magnification the ring is far larger
    than the canvas and most atoms fall outside it. Which ones survive depends
    entirely on which address was under the pointer. On top of that the
    identification readout floats over the lower right of the stage at 44px,
    and a nine pixel atom underneath it is drawn, is resolved correctly by
    hitTest, and cannot be hovered at all: elementFromPoint returns the button
    and the canvas never sees the pointer.

    Both were invisible while several atoms landed inside the canvas, because
    one of them was always in the clear. A separate fix stopped a blank profile
    carrying twenty one invented law scores, the field moved a few points, and
    a single anchor left exactly one atom on screen, underneath the button.

    A person who cannot reach a thing tries another one, so this does too. It
    walks the addresses the story landed on and uses the first anchor that
    leaves an atom the canvas actually owns. It fails only if no address in the
    whole story yields a reachable atom, which is the real assertion rather
    than a geometry coincidence. The overlap is recorded as a finding. */
 const anchors=await pa.evaluate(()=>{
   const want=Object.keys(atomIndex()||{}).map(Number);
   return HIT.filter(x=>x.k==='node'&&want.indexOf(x.n.i)>=0)
    .map(function(h){var a=(h.a0+h.a1)/2,r=(h.r0+h.r1)/2;
      return {x:CX+Math.cos(a)*r,y:CY+Math.sin(a)*r};});});
 ok(anchors.length>0,'there is an address with a story on it to zoom into');
 /* AND THE MAGNIFICATION IS NOT A CONSTANT EITHER.

    Sixteen notches was tuned to a canvas 725 high. The Field top row was split
    into two strips on the owner's ruling, the canvas gained 26 pixels, and at
    sixteen notches the whole atom cluster now lands at x 701 to 784 against a
    canvas 664 wide: past the right edge, at every anchor. The gate read that
    as no atom to hover.

    Measured at twelve notches on the same build: two atoms inside the canvas
    and elementFromPoint returns the canvas, so they are reachable and the
    product is fine. The comment above claimed walking the anchors made this a
    real assertion rather than a geometry coincidence. It was still a
    coincidence, one variable further out.

    So the depth is walked too. The assertion is that somewhere in the range a
    person can actually reach, an atom is hoverable, which is the thing worth
    protecting and does not move when a strip changes height. */
 let one=null;
 for(const anc of anchors){
  for(const notches of [12,14,10,16,8]){
  await pa.evaluate(()=>{S.zoom=1;S.panx=0;S.pany=0;render();});
  await pa.waitForTimeout(260);
  const b0=await (await pa.$('#cv')).boundingBox();
  await pa.mouse.move(b0.x+anc.x,b0.y+anc.y);
  for(let i=0;i<notches;i++){await pa.mouse.wheel(0,-120);await pa.waitForTimeout(25);}
  await pa.waitForTimeout(650);
  one=await pa.evaluate(()=>{
    const cv=document.getElementById('cv'), b=cv.getBoundingClientRect();
    const h=HIT.filter(x=>x.k==='atom'
      &&x.x>12&&x.x<b.width-12&&x.y>12&&x.y<b.height-12
      &&document.elementFromPoint(b.left+x.x,b.top+x.y)===cv)[0];
    return h?{x:h.x,y:h.y}:null;});
  if(one)break;}
  if(one)break;}

 const st=await pa.evaluate(()=>({z:S.zoom,a:atomA(),
   hits:HIT.filter(h=>h.k==='atom').length,res:fetResolved()}));
 ok(st.a>0,'the ceiling clears the threshold, zoom '+st.z.toFixed(2)+' alpha '+st.a.toFixed(2));
 ok(st.hits>0,'and the atoms are targets, '+st.hits+' of them');
 ok(/stories/.test(st.res),'the layer resolved is the stories, got "'+st.res+'"');
 /* HOVERING ONE NAMES THE STORY IN THE PERSON'S OWN WORDS.

    Taking the first atom in HIT is not enough: at this magnification the ring
    is far larger than the canvas and most of it is off screen, so the first
    one landed at x 1494 on a canvas 920 wide. The pointer clamps to the box,
    lands on the core, and the probe reports the core, which is the product
    behaving correctly and the probe asking the wrong question. Pick one that
    is actually on the canvas. */
 /* AND THE ATOM HAS TO BE SOMEWHERE A POINTER CAN ACTUALLY GO.

    Being inside the canvas is not the same as being on the screen. The canvas
    is 664 wide and its top sits about a third of the way down the page, so an
    atom at y 676 is comfortably inside the element and lands at roughly 1006
    on a viewport 1000 tall. hitTest resolves it correctly and the mouse cannot
    be put there, so the hover never fires and the probe reports nothing.

    This only started mattering when a separate fix stopped a blank profile
    carrying twenty one invented law scores: the field moved a few points and
    the number of atoms inside the canvas at this magnification fell to one.
    While there were several, one of them was always on screen by luck.

    So the pick is constrained to the intersection of the canvas and the
    viewport, which is the set a person could actually hover. */
 if(one){
  /* AND THE BOX IS RE-READ AGAIN, IMMEDIATELY BEFORE THE HOVER.
     box2 was taken right after the zoom settled, which was enough while
     several atoms were on the canvas and one of them was always near the
     pointer. It is not enough now. A separate fix stopped a blank profile
     carrying twenty one invented law scores, the field moved by a few points,
     and exactly one atom is inside the canvas at this magnification. Against a
     nine pixel target a box read a few hundred milliseconds early misses, and
     the probe then reports whatever is underneath and blames the product.
     The atom's own coordinates are already live: read the box at the same
     instant and the two agree. */
  const box3=await (await pa.$('#cv')).boundingBox();
  await pa.mouse.move(box3.x+one.x,box3.y+one.y);
  await pa.waitForTimeout(350);
  const txt=await pa.evaluate(()=>{const e=document.getElementById('probe');
    return e&&e.classList.contains('on')?e.textContent:'';});
  ok(/humiliated/.test(txt),'and it quotes the sentence that did it');
  ok(/weighed/.test(txt),'and says what it weighed');
  await pa.mouse.down(); await pa.mouse.up();
  await pa.waitForTimeout(500);
  const held=await pa.evaluate(()=>!!S.atom);
  ok(held,'clicking holds it');
 } else ok(false,'no atom to hover');
 await pa.close();
}


console.log('\n=== a stranger is a stranger, whoever was on screen before ===');
/* THE RULE, not the number: visiting a demo persona must not change what the
   blank profile has measured. The blank's own contents are the person's
   business and this file has been writing to them for a thousand lines, so
   the assertion is the DELTA across a round trip, which is the thing that
   actually broke and is true whatever the blank happens to hold.

   loadP read CURP to recover the custom persona's own laws, and CURP is not
   repointed to the target until eight lines later, so the blank inherited the
   previous persona's twenty one law scores and kept them. saveProfile then
   persisted them. Measured on a fresh page before the fix: loadP(0) alone
   gave unread true and measured 0; a trip through Lance and back gave unread false,
   measured 21, law mean 9.72 and the word Mastery, off Lance's numbers, on a
   profile where nobody had entered anything. */
const base=await page.evaluate(()=>{loadP(0);const r=compute();
 return {unread:r.unread,measured:r.measured,
  laws:SINAMES.map(l=>S.law[l]).join(','),
  unset:SINAMES.filter(l=>LAW_UNSET[l]).length};});
for(const via of ['Lance','James','Sofia']){
 const s=await page.evaluate(v=>{const vi=PERSON(v);loadP(vi);loadP(0);const r=compute();
  return {unread:r.unread,measured:r.measured,nm:PEOPLE[vi].nm,
   laws:SINAMES.map(l=>S.law[l]).join(','),
   unset:SINAMES.filter(l=>LAW_UNSET[l]).length};},via);
 ok(s.measured===base.measured,'the blank measures the same after a trip through '+s.nm
   +', got '+s.measured+' want '+base.measured);
 ok(s.unread===base.unread,'and is as unread as before after '+s.nm);
 ok(s.unset===base.unset,'and the same laws are unset after '+s.nm
   +', got '+s.unset+' want '+base.unset);
 ok(s.laws===base.laws,'and not one law value moved after '+s.nm);
}
/* AND THE PRISTINE CASE, on a page of its own with the store cleared, because
   that is the state a stranger actually arrives in. */
const strg=await browser.newPage({viewport:{width:1600,height:1000}});
await strg.goto(FILE,{waitUntil:'load'}); await booted(strg); await strg.waitForTimeout(400);
await strg.evaluate(()=>{try{localStorage.clear();}catch(e){}});
await strg.reload({waitUntil:'load'}); await booted(strg); await strg.waitForTimeout(700);
const pris=await strg.evaluate(()=>{loadP(PERSON('Lance'));loadP(0);const r=compute();
 return {unread:r.unread,measured:r.measured,tier:r.tier,
  unset:SINAMES.filter(l=>LAW_UNSET[l]).length};});
ok(pris.unread===true,'a stranger who looked at a persona first is still unread');
ok(pris.measured===0,'and has measured nothing, got '+pris.measured);
ok(pris.unset===21,'and carries 21 unset laws, got '+pris.unset);
await strg.close();


console.log('\n=== carrying and held are two facts, and only one of them was said ===');
/* THE RULE: the product may say "Nothing is carrying" only to somebody who is
   carrying nothing. `loaded` is the addresses at or above the line at sq 4 and
   it drives the arithmetic; `carrying` is every address holding anything. An
   absolute cut at 4 on load that is spread thin meant three of the six ICPs
   reached a complete reading, were given a tier word earned by that load, and
   were told on the same screen that nothing was carrying and no action existed.
   Measured: Marcus 99 addresses carrying, heaviest 2.51, and the plate above
   the card called him Incoherent. Sofia 52, Angela 74. */
for(let i=1;i<15;i++){
 const c=await page.evaluate(async w=>{
  loadP(w); setTab(TAB.SUMMARY);
  await new Promise(r=>setTimeout(r,320));
  const r=compute();
  const txt=(document.getElementById('sumbody')||{innerText:''}).innerText||'';
  return {nm:PEOPLE[w].nm,carrying:r.carrying.length,unread:r.unread,
   saysNothing:/Nothing is carrying/.test(txt),
   heaviest:r.heaviest?+r.heaviest.sq.toFixed(2):0};},i);
 if(c.unread)continue;
 ok(!(c.saysNothing&&c.carrying>0),
  c.nm+' is not told nothing is carrying while carrying '+c.carrying
  +' (heaviest '+c.heaviest+')');
}
/* AND THE RELEASE CONTROL DOES NOT REFUSE SOMEBODY WHO IS STILL CARRYING.
   The queue was built at the sq 4 line, so the core loop had two runs in it and
   then the control refused. Measured on James: +4.05, +1.80, refused, while 72
   addresses were still carrying. */
const relOffer=await page.evaluate(async()=>{
 loadP(PERSON('James'));
 const seen=[];
 for(let k=0;k<4;k++){
  const r=compute();
  document.getElementById('bRel').click();
  await new Promise(z=>setTimeout(z,60));
  seen.push({run:k+1,carrying:r.carrying.length,opened:RUN.open,q:RUN.queue.length});
  if(RUN.open){RUN.phase='run';RUN.idx=1e9;relCoolDown();relClose();}
 }
 return seen;});
relOffer.forEach(s=>{
 ok(!(s.carrying>0&&!s.opened),
  'release run '+s.run+' is offered while '+s.carrying+' addresses carry');});

console.log('\n=== the ceiling on release is computed, not guessed ===');
/* The ceiling is analytic. It must agree with actually clearing every charge
   and reading the number back, on every persona, or it is a number the
   product should not print. Checked against the brute force because a tool
   that lies is worse than no tool and this one goes on a screen.

   CHANGED 25 SEPTEMBER from cqCeiling and CQ to exCeiling and expression. CQ
   is the laws alone and a release cannot move it, so the ceiling a release
   works toward is expression's, and the brute force reads expression. */
const ceil=await page.evaluate(()=>{
 const out=[];
 for(let i=1;i<PEOPLE.length;i++){
  loadP(i);
  const analytic=exCeiling();
  const save=JSON.parse(JSON.stringify(S.charge));
  CHARGES.forEach(c=>{S.charge[c]=0;});
  const brute=compute().EX;
  CHARGES.forEach(c=>{S.charge[c]=save[c];});
  out.push({nm:PEOPLE[i].nm,d:Math.abs(analytic-brute)});}
 return out;});
ceil.forEach(c=>ok(c.d<0.05,'exCeiling matches clearing every charge for '+c.nm
 +', off by '+c.d.toFixed(3)));
ok(await page.evaluate(()=>{loadP(PERSON('James'));const r=compute();
  return exHeadroom(r.EX)>0&&exHeadroom(200)===0;}),
 'headroom is never negative and is positive where there is ground');


console.log('\n=== the phone reaches everything it draws ===');
/* MEASURE BOTH body.scrollWidth AND documentElement.scrollWidth. html clips the
   overflow, so documentElement reports the viewport width on every tab and a
   probe that reads only that reports no overflow and is wrong. That mistake has
   already produced one incorrect report on this defect, so the gate takes both
   and asserts on the difference, which is the part no gesture can reach.

   Measured before the fix at 390x844: Field body.scrollWidth 1386 against 390,
   so 996 pixels of that surface were unreachable. Story 432, Settings 402. */
const ph=await browser.newPage({viewport:{width:390,height:844}});
await ph.goto(FILE,{waitUntil:'load'}); await booted(ph); await ph.waitForTimeout(900);
await ph.evaluate(()=>{const i=PEOPLE.findIndex(x=>x.nm==='Lance');loadP(i);});
for(const [nm,t] of [['story',0],['summary',1],['field',2],['body',3],['intake',5],
                     ['know',6],['games',7],['compass',8],['settings',9]]){
 const o=await ph.evaluate(async t=>{setTab(t);await new Promise(r=>setTimeout(r,420));
  return {b:document.body.scrollWidth,h:document.documentElement.scrollWidth,w:innerWidth};},t);
 ok(o.b-o.h<=2,'no unreachable width on '+nm+', body '+o.b+' against html '+o.h);
 ok(o.h<=o.w+2,'and the document itself fits the phone on '+nm+', '+o.h+' against '+o.w);
}
/* THE COMPASS DREW ITSELF OFF SCREEN. #cone.tabmode kept position:absolute
   inside the phone band while .iq and .emap were both released from it.
   Measured: #conecv at y -612, 338 by 591, entirely above the viewport. The
   rule is that the surface a tab names is on the screen that tab opens. */
const phCone=await ph.evaluate(async()=>{setTab(8);await new Promise(r=>setTimeout(r,700));
 const el=document.getElementById('conecv'); if(!el)return {missing:true};
 const r=el.getBoundingClientRect();
 return {h:Math.round(r.height),w:Math.round(r.width),
  onScreen:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth};});
ok(!phCone.missing,'the compass canvas exists on a phone');
ok(phCone.onScreen,'the compass is on the screen the Compass tab opens');
ok(phCone.h>120&&phCone.w>120,'and it has a box to draw in, '+phCone.w+' by '+phCone.h);
/* THE BODY DREW NO BODY. .pm-svg is absolute against .pm-well, which is flex:1
   inside .emap; releasing .emap from absolute left it auto height so the well
   resolved to zero. Measured: .pm-svg 374 wide by 0 tall. */
const phFig=await ph.evaluate(async()=>{setTab(3);await new Promise(r=>setTimeout(r,700));
 const s=document.querySelector('.pm-svg'); if(!s)return {missing:true};
 const r=s.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height)};});
ok(!phFig.missing,'the body figure exists on a phone');
ok(phFig.h>120,'the surface named Body draws a body, height '+phFig.h);
await ph.close();

console.log('\n=== a count under a word counts that word ===');
/* The Fetters layer counted every address carrying at or above the line OR
   holding the installed opposite at 4. The installed opposite is the other
   pole. Measured: Rosa, CQ 100 at Mastery carrying nothing, was told Fetters
   107; Lance, 87.7, Fetters 107; Gordon, the most loaded in the roster at CQ 1,
   97. The rule is that the number cannot run against the load. */
const fc=await page.evaluate(()=>{
 const out=[];
 for(let i=0;i<PEOPLE.length;i++){
  loadP(i); const r=compute();
  out.push({nm:PEOPLE[i].nm,count:pmCount(r,'bands'),carrying:r.carrying.length});}
 return out;});
fc.forEach(f=>ok(f.count===f.carrying,
 'the Fetters count is what '+f.nm+' carries, '+f.count+' against '+f.carrying));
const heavy=fc.find(f=>f.nm==='Gordon'), light=fc.find(f=>f.nm==='Rosa');
ok(heavy.count>light.count,
 'and the most loaded person counts more than the least, '+heavy.count+' against '+light.count);


console.log('\n=== a reading is not a score ===');
/* THE RULE: no surface prints the person's state as a count against a total.
   The headline reading was rendered as "88 of 100" in two places on Settings,
   in a file whose own comment six lines below had already struck "of 112" for
   this exact reason and left the number it was actually about. Held addresses
   were printed against the addresses at their seat in two more.

   A COUNT IS NOT A SCALE, AND THIS GATE COULD NOT TELL THEM APART.

   Two rulings met here and the gate caught the collision, which is what it is
   for. Never print a count against a total is one. Context is key, every
   number says what it is out of, is the other, and it was given later and
   given as an instruction to me rather than as a task: "you read 13, what
   does that mean. A number without its scale is my job to stop."

   They are not in conflict once the two things are named properly.

     A COUNT is a tally of discrete things against how many of them exist.
     Three of nine fetters, eleven of twenty one laws, forty of a hundred and
     twelve nodes. The denominator is the size of a set, the numerator is how
     much of it the person has, and the pair reads as a score out of a
     possible score. That is the thing that shames and it stays banned.

     A SCALE is a measurement against the range the measurement runs on.
     Coherence out of a hundred, integrity of ten. The denominator is not a
     quantity of anything, it is where the ruler ends. Without it the number
     is meaningless, which is the whole of his complaint.

   So the two scale bounds this instrument actually uses, ten and a hundred,
   are allowed, and every other denominator is still refused. That is narrow
   on purpose: a rule that allowed any round number would let "40 of 100
   addresses" back in, and an address count is a count whatever it is out of.

   Still not caught, deliberately: a length, like the intake's progress bar,
   because a bar is not a number; and a ratio that names its denominator as a
   method rather than as a total of the person, which the convergence line
   does in its own next sentence. */
for(const w of [[1600,1000],[390,844]]){
 const pg=await browser.newPage({viewport:{width:w[0],height:w[1]}});
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(700);
 for(const who of ['Lance','Gordon','Sofia']){
  const hits=await pg.evaluate(async n=>{
   const i=PEOPLE.findIndex(x=>x.nm===n); loadP(i);
   const bad=[];
   for(const t of [0,1,2,3,5,6,7,8,9]){
    setTab(t); await new Promise(r=>setTimeout(r,300));
    const txt=document.body.innerText||'';
    const RE=/\b(\d{1,3}(?:\.\d)?)\s*(?:of|out of)\s*(\d{1,3})\b/gi;
    /* the two bounds the instrument's rulers actually end at, and nothing
       else. a denominator that is the size of a set is still a count. */
    const SCALE={10:1,100:1};
    let m; while((m=RE.exec(txt))){
     if(SCALE[m[2]])continue;
     if(+m[2]>+m[1]&&+m[2]>1)bad.push('tab '+t+': '+m[0]);}
    /* AND THE OTHER HALF, RE-RULED. This used to demand the literal string
       "N of 100" on the compass, which was right under the ruling it was
       written for and is wrong under the one that replaced it: "if you cannot
       use regular words to describe it, do not describe it, and 40 to 60 out
       of 100 does not give a lot of specific detail."

       The thing worth protecting was never the denominator. It was that a
       reading is never a bare number with nothing to make sense of it by. So
       the assertion is that intent rather than that string: the compass
       reading carries EITHER a scale OR the band it sits in, said in words.
       Both satisfy a person. Only one satisfies a regular expression, which is
       why the regular expression was the wrong thing to assert. */
    if(t===8&&!/unread/i.test(txt)&&/You read/i.test(txt)
       &&!/\b\d{1,3}\s*(?:of|out of)\s*(?:10|100)\b/.test(txt)
       &&!/oscillating band/i.test(txt))
     bad.push('tab 8: a reading with neither a scale nor a band to read it by');}
   return bad;},who);
  ok(hits.length===0,'no count against a total at '+w[0]+' for '+who
    +(hits.length?', found '+hits.slice(0,4).join(', '):''));
 }
 await pg.close();
}

console.log('\n=== the intake says how long and why it repeats ===');
/* Two panel findings, both measured. Without a stated duration and a visible
   remainder, 63 questions loses about half its finishers. With both, plus one
   line naming the three way design, completion runs 29 points higher. The
   person who works out around question 40 that twenty one things are cycling
   feels handled unless it was said at the top, where the same fact reads as
   rigour. None of it was anywhere on the surface. */
const iq=await page.evaluate(async()=>{
 loadP(0); setTab(TAB.INTAKE);
 await new Promise(r=>setTimeout(r,500));
 const el=document.getElementById('iq')||document.body;
 const t=(el.innerText||'').replace(/\s+/g,' ');
 return {mins:/fifteen minutes|15 minutes/i.test(t),
  three:/three ways|asked three/i.test(t),
  gap:/gap/i.test(t),
  resume:/come back|stop whenever/i.test(t),
  left:/\bleft\b/i.test(t)};});
ok(iq.mins,'the intake states how long it takes');
ok(iq.three,'and that every law is asked three ways');
ok(iq.gap,'and that the gap between the three is the reading');
ok(iq.resume,'and that it can be stopped and come back to');
ok(iq.left,'and the progress line says what is left');

console.log('\n=== the ritual plan cap is one number, not two ===');
/* THE BOUNDARY AND THE SURFACE HAVE TO AGREE ABOUT FORTY. validateProfile
   refuses a when or a where past RIT_PLAN_MAX and never truncates it, and these
   two inputs are where a person meets that cap. The number used to be typed
   into the markup and absent from the boundary, which is how a five thousand
   character when got onto a record the surface then rendered. Read off the live
   inputs rather than off the source, because the source is not what ships. */
const rp=await page.evaluate(async()=>{
 loadP(PERSON('James')); setTab(TAB.RITUAL);
 await new Promise(r=>setTimeout(r,500));
 const w=document.getElementById('ritwhen'), e=document.getElementById('ritwhere');
 return {there:!!(w&&e), cap:(typeof RIT_PLAN_MAX==='number')?RIT_PLAN_MAX:null,
  when:w?w.maxLength:-1, where:e?e.maxLength:-1};});
ok(rp.there,'the ritual surface asks when and where');
ok(rp.cap>0,'the boundary names the cap, '+rp.cap);
ok(rp.when===rp.cap,'the when input carries the boundary\'s cap, '+rp.when+' against '+rp.cap);
ok(rp.where===rp.cap,'and so does the where input, '+rp.where+' against '+rp.cap);

console.log('\n=== the child pattern is found, marked and located ===');
/* THE COUNT IS READ OFF THE RUN AND NEVER TYPED HERE.

   childFound is the engine's answer and the panel is the rendering of it, so
   what this asserts is that the two agree, address by address, and that the
   blank profile lights nothing because nothing has been found. A number typed
   into this file would be the tenth time this repository has been bitten by
   exactly that, and the reading is his to rule on anyway: CHILD_READ is an
   assumption and the count moves by an order of magnitude if he moves it.

   The blank case is first and it is deliberately first. Every surface here
   opens to somebody who has entered nothing, and a panel announcing a special
   finding about a person who has not written a word is the worst version of
   this feature. */
{
 const kp=await browser.newPage({viewport:{width:1600,height:1000}});
 await kp.goto(FILE,{waitUntil:'load'}); await booted(kp);
 const blank=await kp.evaluate(async()=>{
  setTab(TAB.STORY); stRender();
  await new Promise(r=>setTimeout(r,200));
  return {engine:childFound(compute()).n,
   pills:document.querySelectorAll('#imp .ip.kid').length,
   rows:document.querySelectorAll('#imp .ip-kr').length,
   figure:/Child/.test(document.getElementById('imp').innerHTML),
   held:compute().loaded.length};});
 ok(blank.held===0,'the blank profile holds nothing, got '+blank.held);
 ok(blank.engine===0,'and the engine finds no child pattern on it, got '+blank.engine);
 ok(blank.pills===0,'no pill is marked, got '+blank.pills);
 ok(blank.rows===0,'nothing is located, got '+blank.rows);
 ok(blank.figure===false,'and the figure is absent rather than reading nought');
 console.log('  blank      '+blank.pills+' marked, '+blank.rows+' located');
 const on=await kp.evaluate(async()=>{
  loadP(GORDON()); setTab(TAB.STORY); stRender();
  await new Promise(r=>setTimeout(r,250));
  const k=childFound(compute());
  const pills=[...document.querySelectorAll('#imp .ip.kid')].map(e=>+e.dataset.imp);
  return {read:k.read, n:k.n, ids:k.found.map(x=>x.at.i), pills:pills,
   rows:[...document.querySelectorAll('#imp .ip-kr')].map(e=>e.textContent),
   held:compute().loaded.length,
   figure:(document.querySelector('#imp .ip-hd')||{}).textContent||''};});
 ok(on.n>0,'the loaded profile finds at least one, got '+on.n);
 ok(on.pills.length===on.n,
  'the panel marks exactly what the engine found, '+on.pills.length+' against '+on.n);
 ok(on.ids.slice().sort().join()===on.pills.slice().sort().join(),
  'and it marks the same addresses, engine '+on.ids.join(' ')+' against panel '+on.pills.join(' '));
 ok(on.rows.length===on.n,'every one of them is located, '+on.rows.length+' rows against '+on.n);
 /* a located row has to say where, or it is a list of names and not a
    location. The seat is the word the rest of the product uses for where. */
 const noWhere=on.rows.filter(t=>!/at the /.test(t));
 ok(noWhere.length===0,noWhere.length+' located rows say where');
 ok(on.n<=on.held,'and the child figure cannot exceed the held figure, '
  +on.n+' of '+on.held);
 ok(new RegExp('Child'+on.n).test(on.figure.replace(/\s+/g,'')),
  'the header carries the figure beside its one word label, got '
  +JSON.stringify(on.figure.replace(/\s+/g,' ').trim().slice(0,60)));
 console.log('  reading    '+on.read);
 console.log('  loaded     '+on.pills.length+' marked, '+on.rows.length
  +' located, of '+on.held+' held');
 on.rows.forEach(t=>console.log('    '+t.replace(/\s+/g,' ')));
 await kp.close();
}

console.log('\n=== one seed, so both doors read the same empty profile ===');
/* TWO DOORS ONTO ONE RECORD READ TWO DIFFERENT NUMBERS.

   An unmeasured law was seeded three times: a literal in engine/core.js,
   LAW_DEFAULT in engine/schema.js for the same purpose, and 6.5 in
   ui/personas.js with a fallback of 5.5 beneath it. Measured on the shipped
   build, same page, same empty profile: loadP(0) read CQ 42.25 and
   blankProfile plus loadProfile read 36.00. loadP(0) is every route a person
   takes to their own record, so the reading a stranger was shown on arrival
   was the one nobody could reproduce from the engine.

   Both doors are opened here in one page rather than comparing a browser
   number against a node number, because a cross process comparison would fail
   for a dozen reasons that are not this defect. */
{
 const sd=await browser.newPage({viewport:{width:1600,height:1000}});
 await sd.goto(FILE,{waitUntil:'load'}); await booted(sd);
 const seed=await sd.evaluate(()=>{
  loadP(0);
  const app={cq:+compute().CQ.toFixed(2), unread:!!compute().unread,
   seeds:[...new Set(SINAMES.map(l=>S.law[l]))]};
  const p=blankProfile('gate'); loadProfile(p);
  const eng={cq:+compute().CQ.toFixed(2), unread:!!compute().unread,
   seeds:[...new Set(SINAMES.map(l=>S.law[l]))]};
  return {app, eng, dflt:(typeof LAW_DEFAULT==='number'?LAW_DEFAULT:null),
   lawset:LAWSET.You, fallback:lawsFor({nm:'nobody in any table'})};});
 ok(seed.app.cq===seed.eng.cq,
  'the two doors read one empty profile the same, the app '+seed.app.cq
  +' and the boundary '+seed.eng.cq);
 ok(seed.app.seeds.length===1&&seed.eng.seeds.length===1,
  'each door seeds one value, '+seed.app.seeds.length+' and '+seed.eng.seeds.length);
 ok(seed.app.seeds[0]===seed.dflt,'and the app door uses the exported seed, '
  +seed.app.seeds[0]+' against '+seed.dflt);
 ok(seed.eng.seeds[0]===seed.dflt,'and so does the boundary, '
  +seed.eng.seeds[0]+' against '+seed.dflt);
 /* the two renderer literals, by the tables that held them */
 ok(seed.lawset&&seed.lawset._===seed.dflt,
  'the custom persona table carries the seed rather than one of its own, '
  +JSON.stringify(seed.lawset));
 ok(seed.fallback&&seed.fallback._===seed.dflt,
  'and so does the guard for a persona with no table, '+JSON.stringify(seed.fallback));
 ok(seed.app.unread&&seed.eng.unread,'and neither door claims the field was read');
 console.log('  seed '+seed.dflt+'  app '+seed.app.cq+'  boundary '+seed.eng.cq);
 await sd.close();
}

console.log('\n=== the release panel quotes a price it then charges ===');
/* THE PANEL QUOTED A PRICE AND NOTHING ENFORCED IT.

   Measured on the shipped build, the person's own record carrying charge, a
   free plan with the gift spent and base at 100: relLeft() read 0, the panel
   printed "25 patterns of the 0 you have left", Begin was offered, and the run
   went ahead. 110 unique patterns before it and 135 after, with relLeft() still
   reading 0 because the subtraction clamps at nought, so the overspend was
   invisible before, during and after. This is the one panel in the product that
   quotes a price, and it sits directly under the paid tiers.

   Two things are asserted and the second is the one that matters. Nought left
   means there is no run to begin, refused at the door, which is the only place
   a refusal is allowed: stopping a walk already under way is a worse failure
   than a wrong label, because the person has sat down and half a release is
   neither a release nor a refund. And a partial allowance is a SHORTER run and
   never a refused one, quoted at what it spends, because somebody with three
   patterns left should get three rather than nothing.

   The run is walked by setting the index to the end of the plan and committing,
   which is what the ticker does when it runs out of lines. Waiting out twenty
   five real ticks at 2.2 seconds each is fifty five seconds of gate. */
{
 const rl=await browser.newPage({viewport:{width:1600,height:1000}});
 await rl.goto(FILE,{waitUntil:'load'}); await booted(rl);
 const run=await rl.evaluate(async unique=>{
  loadP(0);
  CHARGES.forEach(c=>{S.charge[c]=7;});
  CURP.meter={lines:unique,unique:[],first:null,last:null};
  for(let i=0;i<unique;i++)CURP.meter.unique.push('seed'+i+':Rlimit:0');
  CURP.plan={tier:'free',status:'',granted:0,carried:0,base:100,since:null,until:null};
  const ids=compute().carrying.slice(0,8).map(n=>n.i);
  const left=relLeft();
  relPick(ids);
  await new Promise(r=>setTimeout(r,120));
  const host=document.getElementById('rel');
  const txt=e=>{const n=host.querySelector(e);return n?n.textContent.trim():'';};
  const out={left, addresses:RUN.queue.length, plan:(RUN.plan||[]).length,
   sub:txt('.rel-sub'), note:txt('.rel-note'),
   begin:!!document.getElementById('relgo'),
   route:!!document.getElementById('relplan'),
   before:CURP.meter.unique.length};
  if(out.begin){RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown();}
  out.after=CURP.meter.unique.length;
  out.spent=out.after-out.before;
  return out;},110);
 ok(run.left===0,'the gift spent and the week spent leaves nothing, got '+run.left);
 ok(run.addresses>0,'eight addresses are still picked, got '+run.addresses);
 ok(run.plan===0,'and there is no plan to sell, got '+run.plan);
 ok(run.begin===false,'so Begin is not offered at all, rather than offered and disabled');
 ok(run.route===true,'and the panel routes to the one thing that changes the answer');
 ok(run.spent===0,'and nothing is spent, '+run.spent+' patterns went out the door');
 ok(!/\b0 patterns of the 0\b/.test(run.sub),
  'the panel does not quote a price of nought against an allowance of nought, got '
  +JSON.stringify(run.sub));
 console.log('  spent      '+JSON.stringify(run.sub));
 /* AND THE PARTIAL CASE, which is the half a refusal would have broken. */
 const part=await rl.evaluate(async unique=>{
  loadP(0);
  CHARGES.forEach(c=>{S.charge[c]=7;});
  CURP.meter={lines:unique,unique:[],first:null,last:null};
  for(let i=0;i<unique;i++)CURP.meter.unique.push('seed'+i+':Rlimit:0');
  CURP.plan={tier:'free',status:'',granted:0,carried:0,base:100,since:null,until:null};
  const ids=compute().carrying.slice(0,8).map(n=>n.i);
  const left=relLeft();
  relPick(ids);
  await new Promise(r=>setTimeout(r,120));
  const host=document.getElementById('rel');
  const txt=e=>{const n=host.querySelector(e);return n?n.textContent.trim():'';};
  const out={left, plan:(RUN.plan||[]).length, sub:txt('.rel-sub'), note:txt('.rel-note'),
   begin:!!document.getElementById('relgo'), before:CURP.meter.unique.length};
  if(out.begin){RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown();}
  out.spent=CURP.meter.unique.length-out.before;
  return out;},107);
 ok(part.left>0,'seven of the week spent leaves some, got '+part.left);
 ok(part.begin===true,'a short allowance is a shorter run and not a refused one');
 ok(part.plan===part.left,'the plan is exactly what is left, '+part.plan
  +' against '+part.left);
 ok(part.spent===part.plan,'and the run spends exactly what the panel quoted, '
  +part.spent+' against '+part.plan);
 ok(new RegExp('^'+part.plan+' patterns of the '+part.left+' ').test(part.sub),
  'and the printed sentence is that same number twice, got '+JSON.stringify(part.sub));
 /* WHICH CEILING CUT IT, because the two mean different things to a person.
    Short of the run ceiling used to print "that is everything still unopened in
    this queue", which is false the moment the allowance is what cut it: there is
    more unopened ground and they cannot reach it yet. */
 ok(/allowance has left/.test(part.note)&&!/everything still unopened/.test(part.note),
  'and the note names the allowance rather than claiming the queue is empty, got '
  +JSON.stringify(part.note));
 console.log('  partial    '+JSON.stringify(part.sub));
 console.log('             '+JSON.stringify(part.note));
 await rl.close();
}

console.log('\n=== a release lifts the laws at its seat, and the undo arrow takes it back ===');
/* CORRECTED 25 SEPTEMBER, AFTER SHIP. "Those 15k releases raised my CQ." The
   engine gate drives the lift headlessly (tests/engine.js 36b and 36e). This is
   the same thing through the panel a person presses, on their own record with
   every law answered through the intake, so what is under test is the wiring:
   relCoolDown hands the meter's new ground to releaseWork, only the laws at the
   seats that ground sits at move, CQ rises by exactly those laws over 210 and
   by a fraction of a point, a rerun of the same ground adds nothing, and the
   undo arrow takes the lift back with the release. */
{
 const lf=await browser.newPage({viewport:{width:1600,height:1000}});
 await lf.goto(FILE,{waitUntil:'load'}); await booted(lf);
 const o=await lf.evaluate(async()=>{
  loadP(0);
  for(let i=0;i<63;i++)CURP.intake.answers[i]=5;
  iqApply(CURP); syncLw();
  CHARGES.forEach(c=>{S.charge[c]=7;});
  const r0=compute(), law0={}; SINAMES.forEach(l=>{law0[l]=lawNow(l);});
  relPick(r0.carrying.slice(0,6).map(n=>n.i));
  const plan=(RUN.plan||[]).slice();
  RUN.phase='run'; RUN.idx=RUN.plan.length; relCoolDown();
  const fresh=(RUN.meter&&RUN.meter.fresh)||[], seat={};
  fresh.forEach(k=>{const b=BY[+k.split(':')[0]].b; seat[b]=(seat[b]||0)+1;});
  const r1=compute();
  const moved=SINAMES.filter(l=>lawNow(l)!==law0[l]).sort();
  const want=SI.filter(l=>seat[l.b]).map(l=>l.nm).sort();
  const sum=SINAMES.reduce((a,l)=>a+lawNow(l)-law0[l],0)/210*100;
  const out={plan:plan.length, fresh:fresh.length, seats:Object.keys(seat), moved, want,
   cq0:r0.CQ, cq1:r1.CQ, sum, answered:r0.answered};
  relClose();
  /* the same ground again: a rerun is free and lifts nothing */
  const wk=JSON.stringify(CURP.work), c2=compute().CQ;
  CHARGES.forEach(c=>{S.charge[c]=7;});
  RUN.queue=[]; RUN.plan=plan; RUN.done=false; RUN.open=true; RUN.log=[];
  RUN.phase='run'; RUN.idx=plan.length; relCoolDown(); relClose();
  out.rerunFresh=((RUN.meter&&RUN.meter.fresh)||[]).length;
  out.rerunSame=(JSON.stringify(CURP.work)===wk&&compute().CQ===c2);
  /* and back, through the arrow a person presses, twice: the rerun, then the release */
  const ub=document.getElementById('undobtn');
  ub.onclick(); ub.onclick();
  out.undoCq=compute().CQ; out.undoWork=JSON.stringify(CURP.work||{});
  return out;});
 ok(o.answered===21,'every law answered through the intake, '+o.answered);
 ok(o.fresh>0&&o.fresh===o.plan,'the run opened new ground, '+o.fresh+' of a plan of '+o.plan);
 ok(o.moved.length>0&&o.moved.join()===o.want.join(),
  'the laws that moved are exactly the laws at the seats it opened, '+o.seats.join(', ')+': '+o.moved.join(', '));
 ok(o.cq1>o.cq0,'and CQ rose, '+o.cq0.toFixed(3)+' to '+o.cq1.toFixed(3));
 ok(Math.abs((o.cq1-o.cq0)-o.sum)<1e-9,'by exactly those laws over 210 and nothing else');
 ok(o.cq1-o.cq0<0.5,'by a fraction of a point, '+(o.cq1-o.cq0).toFixed(3)+', which is his "you may not see CQ move"');
 ok(o.rerunFresh===0&&o.rerunSame,'the same ground again opens nothing and lifts nothing');
 ok(Math.abs(o.undoCq-o.cq0)<1e-9&&o.undoWork==='{}',
  'and the undo arrow takes the lift back with the release, CQ '+o.undoCq.toFixed(3)+', work '+o.undoWork);
 console.log('  lift       CQ '+o.cq0.toFixed(3)+' to '+o.cq1.toFixed(3)+' on '+o.fresh
  +' patterns at '+o.seats.join(', '));
 await lf.close();
}

console.log('\n=== switching between two of your own records keeps both fields ===');
/* THE SECOND HALF OF THE FIELD LEAK, and the same class as the undo leak
   closed at 88181e6.

   PEOPLE[0] is the table loadP(0) reads the person's own field back out of, and
   it mirrors exactly one record. saveYou guarded on S.who===0, and S.who names
   a PERSONA, so every one of the person's own records answers 0. The Intake's
   switcher repoints CURP and loads another record's field into S while S.who
   stays 0, and the next slider drag then wrote record B's field into the table
   record A is read from. Measured on the shipped build: 2.20 units of held
   charge in PEOPLE[0] before, 63.00 after one saveYou taken while a second own
   record was loaded, and 63.00 still there after loadP(0), so record A's field
   was gone for good.

   The guard is the record's id, which S.rec carries, and nothing repoints,
   because two attempts at repointing are recorded in ui/release.js as each
   worse than the bug.

   AND THE COST OF THE GUARD IS ASSERTED BESIDE IT. persistYou has exactly one
   caller and it is saveYou, so it is the only route by which a slider drag
   reaches storage. The first cut returned before it, which traded destroying
   record A for silently losing every edit to record B: measured at 63 units in
   the record before the guard and 0 after. The mirror is guarded and the write
   through is not, and both halves are held here, because a gate that only
   checks the leak would pass the fix that causes the loss. */
{
 const sw=await browser.newPage({viewport:{width:1600,height:1000}});
 await sw.goto(FILE,{waitUntil:'load'}); await booted(sw);
 const leak=await sw.evaluate(async()=>{
  const sum=o=>+CHARGES.reduce((t,c)=>t+(o[c]||0),0).toFixed(2);
  const held=p=>+CHILD.reduce((t,c)=>t+((p.axes&&p.axes[c.nm]&&p.axes[c.nm].held)||0),0).toFixed(2);
  loadP(0);
  const A=CURP;
  S.charge.Fear=2.2; saveYou();
  const aBefore=sum(PEOPLE[0].c);
  pNew('a second record of my own');
  const B=PROFILES[PROFILES.length-1];
  /* the Intake switcher, exactly as ui/intakeui.js writes it */
  CURP=B; loadProfile(CURP);
  CHARGES.forEach(c=>{S.charge[c]=7;});
  const who=S.who, mirrored=saveYou();
  const aAfter=sum(PEOPLE[0].c);
  /* the debounce is 400ms, and the point of the second half is that it fires */
  await new Promise(r=>setTimeout(r,700));
  const bHeld=held(B);
  loadP(0);
  return {aBefore, who, mirrored, aAfter, aOnReturn:sum(PEOPLE[0].c),
   sOnReturn:sum(S.charge), bHeld, aId:A.id, bId:B.id, differ:A.id!==B.id};});
 ok(leak.differ,'two records of the same person have two ids');
 ok(leak.who===0,'and both of them answer to persona nought, which is why the '
  +'index could not tell them apart');
 ok(leak.aBefore===2.2,'record A carries what was put in it, '+leak.aBefore);
 ok(leak.mirrored===false,'the mirror declines to write for a record it does not mirror');
 ok(leak.aAfter===leak.aBefore,'so record A is untouched by a drag on record B, '
  +leak.aAfter+' against '+leak.aBefore);
 ok(leak.aOnReturn===leak.aBefore,'and it is still there on the way back through '
  +'loadP(0), '+leak.aOnReturn);
 ok(leak.sOnReturn===leak.aBefore,'and the working field is record A\'s again, '
  +leak.sOnReturn);
 /* THE COST ROW. Record B is the record being edited, so its own write must land. */
 ok(leak.bHeld>0,'and the drag on record B is written to record B, '+leak.bHeld
  +' units of held charge in it after the debounce');
 console.log('  record A   '+leak.aBefore+' before, '+leak.aAfter+' after a drag on B, '
  +leak.aOnReturn+' on return');
 console.log('  record B   '+leak.bHeld+' held, written by its own record\'s save');
 await sw.close();
}

console.log('\n=== the orientation dial says nothing about an unread field ===');
/* #pol HAS SILENCED ITSELF ON r.unread SINCE THE RULING AND #polbar HAD NOT.

   Selecting somebody who has entered nothing printed 84 benign against 16
   malignant with the bar reaching 34 per cent of the way out, measured on
   loadP(0) in the shipped build, directly under a rail correctly saying nothing
   had been read. Two readings of one field, one of them invented.

   The bar is left in the document with nothing in it rather than hidden,
   because an empty trough is the honest picture of an empty field and the
   Field's own layout is measured against its height, so both are asserted. */
{
 const pd=await browser.newPage({viewport:{width:1600,height:1000}});
 await pd.goto(FILE,{waitUntil:'load'}); await booted(pd);
 const dial=await pd.evaluate(async()=>{
  setTab(TAB.FIELD); loadP(0);
  await new Promise(r=>setTimeout(r,260));
  const pb=document.getElementById('polbar'), pol=document.getElementById('pol');
  const blank={unread:!!compute().unread,
   text:pb?pb.textContent.replace(/\s+/g,''):null,
   fill:!!(pb&&pb.querySelector('.fill')),
   mid:!!(pb&&pb.querySelector('.mid')),
   h:pb?Math.round(pb.getBoundingClientRect().height):0,
   title:pb?pb.title:'', pol:pol?pol.textContent.trim().slice(0,60):''};
  loadP(PERSON('Gordon'));
  await new Promise(r=>setTimeout(r,260));
  const read={unread:!!compute().unread,
   text:pb?pb.textContent.replace(/\s+/g,''):null,
   fill:!!(pb&&pb.querySelector('.fill')),
   h:pb?Math.round(pb.getBoundingClientRect().height):0};
  return {blank, read};});
 ok(dial.blank.unread,'an arrival who has entered nothing reads as unread');
 ok(dial.blank.text==='','and the dial prints no figure at all, got '
  +JSON.stringify(dial.blank.text));
 ok(dial.blank.fill===false,'and draws no fill');
 ok(dial.blank.mid===true,'and keeps its centre line, so the trough is still a trough');
 ok(dial.blank.h>0,'and keeps its height, which the Field\'s layout is measured '
  +'against, got '+dial.blank.h);
 ok(/[Nn]othing read yet/.test(dial.blank.title),
  'and says so where a person can ask, got '+JSON.stringify(dial.blank.title));
 ok(/[Nn]othing read yet/.test(dial.blank.pol),
  'which is what the strip above it has always said, got '+JSON.stringify(dial.blank.pol));
 ok(dial.read.unread===false&&/\d/.test(dial.read.text||''),
  'and a field that HAS been read still prints its figures, got '
  +JSON.stringify(dial.read.text));
 ok(dial.read.fill===true,'and still draws its fill');
 ok(dial.read.h===dial.blank.h,'and the two states are the same height, '
  +dial.read.h+' against '+dial.blank.h);
 console.log('  blank      '+JSON.stringify(dial.blank.text)+'  height '+dial.blank.h);
 console.log('  read       '+JSON.stringify(dial.read.text)+'  height '+dial.read.h);
 await pd.close();
}

console.log('\n=== the story lights what the engine read, once ===');
/* THE HIGHLIGHTER READ THE SENTENCE TWICE AND LIT THE WRONG WORDS.

   The scanner records hit.at on every hit, an offset into the normalised copy it
   scanned. The page threw those away and ran its own global regular expression
   over the raw text. Measured on the shipped build with an 87 word story: the
   engine read 8 hits and the page lit 5. It dropped the coherent hit, because it
   filtered coherent hits out of the table it built the expression from, so the
   words that take charge OFF a person were the only ones invisible on the
   surface whose whole job is to show the reading. And neither of the two names
   the engine holds, "silenced" and "self-attack", appeared anywhere on the page.

   engine/sniff.js carries normMap and marksOf now and the page walks them, so
   there is one reading of the sentence. The counts are read off the run: 8 hits
   become 6 marks because an adjective sitting on the same word as a placed term
   merges into it rather than drawing twice, which is the scanner's own
   precedence, so what is asserted is that the page and marksOf agree and that
   nothing the engine read is left dark. A number typed in here would be wrong
   the first time the lexicon grows.

   THE REGISTER IS ASSERTED TOO, because it is what the whole layer depends on.
   The highlight is a second copy of the text behind a transparent textarea, and
   if the two hold different characters every mark after the difference lands on
   the wrong letters. A mark that spans punctuation makes that easy to get wrong,
   so the layer's own text is compared against the textarea's, character for
   character. */
{
 const st=await browser.newPage({viewport:{width:1600,height:1000}});
 await st.goto(FILE,{waitUntil:'load'}); await booted(st);
 /* GUARDED, BECAUSE AN UNREACHABLE FUNCTION MUST FAIL BY NAME. Run against the
    build before this landed, the probe threw "marksOf is not defined" out of
    page.evaluate and took the whole gate with it, so a real regression here
    would report a stack trace from node and nothing from the gate. The two
    reachability rows below are the gate's own answer. */
 const reach=await st.evaluate(()=>({
  marks:typeof marksOf==='function', norm:typeof normMap==='function'}));
 ok(reach.marks,'marksOf reaches the page from the engine half');
 ok(reach.norm,'and so does normMap');
 const lit=reach.marks?await st.evaluate(async()=>{
  setTab(TAB.STORY);
  await new Promise(r=>setTimeout(r,320));
  const read=(tag,text)=>{
   ST_TEXT=text; ST_PARSED=parseStory(text); stRender();
   const hl=document.getElementById('sthl'), ta=document.getElementById('sttext');
   const ms=[...hl.querySelectorAll('mark')];
   return {tag, words:text.trim().split(/\s+/).length,
    hits:ST_PARSED.hits.length,
    engineMarks:marksOf(text,ST_PARSED).length,
    lit:ms.length,
    text:ms.map(e=>e.textContent),
    names:ms.map(e=>e.getAttribute('data-nm')).filter(Boolean),
    coh:ms.filter(e=>e.getAttribute('data-coh')).map(e=>e.textContent),
    seated:ms.filter(e=>/--c:\s*#/.test(e.getAttribute('style')||'')).length,
    /* the layer holds the person's own text and nothing else. The painter adds
       one newline so the last line keeps its height, so that is allowed for. */
    register:hl.textContent.replace(/\n$/,'')===ta.value,
    taText:ta.value===text,
    /* the engine's own answer for the same story, to compare against */
    engineCoh:ST_PARSED.hits.filter(h=>h.band==='coherent').length,
    engineNames:ST_PARSED.hits.filter(h=>h.label).map(h=>h.label)};};
  return {
   story:read('story',
    "When my manager cut me off in the meeting I stayed quiet and just let it go, "
    +"because speaking up has never once worked out for me. Later I told myself it was fine, "
    +"that I was being reasonable, but my chest was tight all afternoon and I could not eat. "
    +"I keep replaying it. I am furious with him and ashamed of myself, and I have no idea "
    +"which of those two is actually mine to carry, or whether I am simply too tired to tell."),
   idiom:read('idiom',
    'I wanted to shut the door, and not come out at all. I felt so tired.'),
   empty:read('empty','')};}):null;
 if(!lit){
  ok(false,'so nothing this surface draws can be measured against it');
 } else {
 [lit.story,lit.idiom].forEach(r=>{
  ok(r.lit===r.engineMarks,r.tag+': the page lights exactly what marksOf placed, '
   +r.lit+' against '+r.engineMarks);
  ok(r.lit>0,r.tag+': and that is more than nothing, '+r.lit);
  ok(r.register,r.tag+': the highlight layer holds the same characters as the box '
   +'it sits behind, which is what keeps every mark in register');
  ok(r.taText,r.tag+': and the box holds what was written into it');
  ok(r.seated>0,r.tag+': a seated mark carries its seat colour, '+r.seated+' do');});
 /* THE COHERENT HIT, which the expression filtered out by construction. */
 ok(lit.story.engineCoh>0,'the story carries a coherent hit for the page to lose, '
  +lit.story.engineCoh);
 ok(lit.story.coh.length===lit.story.engineCoh,
  'and every one of them is lit and says it is coherent, '+lit.story.coh.length
  +' against '+lit.story.engineCoh+': '+JSON.stringify(lit.story.coh));
 /* THE NAME THE ENGINE HOLDS, which never reached this surface at all. It is
    carried on the mark and not drawn: the layer is aria-hidden and behind the
    textarea, so where a person reads these is a decision about this page rather
    than a defect in how it reads the sentence. */
 ok(lit.story.engineNames.length>0,'the story carries named hits, '
  +lit.story.engineNames.join(', '));
 lit.story.engineNames.forEach(n=>ok(lit.story.names.indexOf(n)>=0,
  'and the page carries the name the engine holds, '+JSON.stringify(n)
  +', got '+JSON.stringify(lit.story.names)));
 /* THE IDIOM ACROSS PUNCTUATION, which a search over the raw text cannot find. */
 ok(lit.idiom.lit===1,'the idiom is one mark and not none, got '+lit.idiom.lit);
 ok(/,/.test(lit.idiom.text[0]),
  'lit as one stretch including the punctuation inside it, got '
  +JSON.stringify(lit.idiom.text[0]));
 ok(lit.idiom.names.length===1,'and it prints the engine\'s name for it, '
  +JSON.stringify(lit.idiom.names));
 /* and an empty box is an empty layer, because this runs on every keystroke */
 ok(lit.empty.lit===0,'an empty story lights nothing, got '+lit.empty.lit);
 ok(lit.empty.register,'and the two layers still agree about it');
 console.log('  story      '+lit.story.hits+' hits, '+lit.story.lit+' lit, '
  +lit.story.coh.length+' coherent, '+lit.story.names.length+' named');
 console.log('             '+JSON.stringify(lit.story.text));
 console.log('  idiom      '+JSON.stringify(lit.idiom.text)+' as '
  +JSON.stringify(lit.idiom.names));
 }
 await st.close();
}

/* ---------------------------------------------------------------------------
   THE SEAT TONE. Ruled 25 September, on hearing it: the Solfeggio number of
   the seat being released, chosen by the address and never by a picker, on a
   switch in the release that is off until a person turns it on.

   Two blocks on one page of their own, so the record they write is a new
   person's. The first measures the sound and the second drives the release,
   because a tone can be wired perfectly to the wrong waveform, and a correct
   waveform can be wired to the wrong seat.
--------------------------------------------------------------------------- */
console.log('\n=== the seat tone is binaural, and it is the seat\'s own ===');
{const tp=await browser.newPage({viewport:{width:1600,height:1000}});
 const terr=[]; tp.on('pageerror',e=>terr.push('PAGEERROR: '+e.message));
 await tp.goto(FILE,{waitUntil:'load'}); await booted(tp);
 /* the two beats, read off the page, so no number here can drift from them */
 const [THETA,ALPHA]=await tp.evaluate(()=>[BED_THETA,BED_ALPHA]);
 /* THE SOUND, RENDERED OFFLINE THROUGH THE PRODUCT'S OWN bedOn, and read with
    the sound seat's own instrument. It tested itself on a known pair before it
    read anything else, and that is what caught its first cut: a 2 ms envelope
    is shorter than one cycle at 393 Hz, and it read a 6.0 beat as 16.6. So the
    self test runs here first too, with a monaural control that must NOT read
    as steady, because a mix of the two tones in one ear is exactly what a
    missing panner used to produce and exactly what this block exists to stop. */
 const snd=await tp.evaluate(async()=>{
  var SR=44100;
  function render(dur,setup){
   var ac=new OfflineAudioContext(2,Math.round(dur*SR),SR);
   BED=null; setup(ac);
   return ac.startRendering().then(function(buf){ BED=null;
    return {L:buf.getChannelData(0),R:buf.getChannelData(1)};});}
  /* frequency by positive going zero crossings, linearly interpolated */
  function freqZC(x,i0,i1){
   var first=-1,last=-1,n=0;
   for(var i=i0+1;i<i1;i++){ if(x[i-1]<0&&x[i]>=0){
    var t=(i-1)+(-x[i-1])/(x[i]-x[i-1]);
    if(first<0)first=t; last=t; n++; }}
   return (n-1)/((last-first)/SR);}
  function rmsWin(x,i0,i1,w){
   var k=Math.round(w*SR),out=[];
   for(var i=i0;i+k<=i1;i+=k){var s=0; for(var j=i;j<i+k;j++)s+=x[j]*x[j]; out.push(Math.sqrt(s/k));}
   return out;}
  /* how steady one ear is: max over min of rms in 50 ms windows. a beat
     inside one ear swings this far above 1, a binaural pair leaves it at 1 */
  function flat(x,i0,i1){var r=rmsWin(x,i0,i1,0.05);
   return Math.max.apply(null,r)/Math.min.apply(null,r);}
  /* the beat of the two ears summed, which is what a speaker produces: square,
     average into 1 ms blocks, remove the mean, Hann window, then find the
     strongest component from 0.5 to 30 Hz and refine around it */
  function beatOfSum(L,R,i0,i1){
   i0=Math.round(i0); i1=Math.round(i1);
   var B=Math.round(SR/1000), n=Math.floor((i1-i0)/B), e=new Float64Array(n), m=0;
   for(var k=0;k<n;k++){var a=0; for(var j=0;j<B;j++){var v=L[i0+k*B+j]+R[i0+k*B+j]; a+=v*v;}
    e[k]=a/B; m+=e[k];}
   m/=n; for(var k=0;k<n;k++)e[k]=(e[k]-m)*(0.5-0.5*Math.cos(2*Math.PI*k/(n-1)));
   function mag(f){var re=0,im=0,w=2*Math.PI*f/1000;
    for(var k=0;k<n;k++){re+=e[k]*Math.cos(w*k); im-=e[k]*Math.sin(w*k);} return re*re+im*im;}
   var best=0.5,bm=-1; for(var f=0.5;f<=30;f+=0.05){var q=mag(f); if(q>bm){bm=q;best=f;}}
   var lo=best-0.06,hi=best+0.06;
   for(var f=lo;f<=hi;f+=0.001){var q=mag(f); if(q>bm){bm=q;best=f;}}
   return best;}
  function peak(x,i0,i1){var p=0; for(var i=Math.round(i0);i<Math.round(i1);i++){var a=Math.abs(x[i]); if(a>p)p=a;} return p;}
  function maxStep(x,i0,i1){var p=0; for(var i=Math.max(1,Math.round(i0));i<Math.round(i1);i++){var a=Math.abs(x[i]-x[i-1]); if(a>p)p=a;} return p;}
  var o={};
  {var n=4*SR, L=new Float32Array(n), R=new Float32Array(n), M=new Float32Array(n);
   for(var i=0;i<n;i++){var t=i/SR;
    L[i]=0.025*Math.sin(2*Math.PI*393*t); R[i]=0.025*Math.sin(2*Math.PI*399*t);
    M[i]=0.0125*(Math.sin(2*Math.PI*393*t)+Math.sin(2*Math.PI*399*t));}
   o.self={left:freqZC(L,0,n),right:freqZC(R,0,n),lf:flat(L,0,n),rf:flat(R,0,n),
    sum:beatOfSum(L,R,0,n),control:flat(M,0,n)};}
  /* every seat a release can sound, at both of its beats */
  o.seats=[];
  for(var s=0;s<BANDS.length;s++){ for(var bi=0;bi<2;bi++){
   var hz=seatHz(BANDS[s]), bt=[BED_THETA,BED_ALPHA][bi];
   var r=await render(5,function(ac){bedOn(ac,ac.destination,hz,bt,BED_GAIN,0.5);});
   o.seats.push({seat:BANDS[s],hz:hz,beat:bt,left:freqZC(r.L,SR,5*SR),right:freqZC(r.R,SR,5*SR),
    lf:flat(r.L,SR,5*SR),rf:flat(r.R,SR,5*SR),sum:beatOfSum(r.L,r.R,SR,5*SR),
    peak:20*Math.log10(peak(r.L,SR,5*SR))});}}
  /* the cross, theta to alpha over one line, and the next seat over one line */
  var L1=RUN.speed*REL_GLIDE, root=seatHz('Root'), heart=seatHz('Heart'), a0=(2.5+L1+0.2)*SR, a1=(2.5+L1+4.4)*SR;
  var g=await render(2.5+L1+4.5,function(ac){bedOn(ac,ac.destination,root,BED_THETA,BED_GAIN,0.5);
   bedTo(root,BED_ALPHA,L1,2.5);});
  o.rise={before:beatOfSum(g.L,g.R,0.6*SR,2.4*SR),after:beatOfSum(g.L,g.R,a0,a1),
   left:freqZC(g.L,a0,a1),right:freqZC(g.R,a0,a1),root:root};
  var c=await render(2.5+L1+4.5,function(ac){bedOn(ac,ac.destination,root,BED_ALPHA,BED_GAIN,0.5);
   bedTo(heart,BED_THETA,L1,2.5);});
  o.glide={left:freqZC(c.L,a0,a1),right:freqZC(c.R,a0,a1),beat:beatOfSum(c.L,c.R,a0,a1),
   stepIn:maxStep(c.L,2.5*SR,(2.5+L1)*SR),stepAfter:maxStep(c.L,a0,a1),heart:heart};
  /* the fade in under the opening, and the switch pressed in the middle of it */
  var fin=OPENING.length*RUN.speed;
  var f=await render(fin+2,function(ac){bedOn(ac,ac.destination,seatHz('Crown'),BED_THETA,BED_GAIN,fin);});
  o.fade={secs:fin,first:maxStep(f.L,0,0.1*SR),steady:maxStep(f.L,(fin+0.5)*SR,(fin+1.5)*SR)};
  var off=await render(2+BED_OUT+2,function(ac){bedOn(ac,ac.destination,heart,BED_THETA,BED_GAIN,fin);
   bedOff(BED_OUT,2);});
  o.off={before:maxStep(off.L,1.6*SR,1.98*SR),around:maxStep(off.L,1.98*SR,2.3*SR),
   after:peak(off.L,(2+BED_OUT+0.2)*SR,(2+BED_OUT+2)*SR)};
  return o;});
 const r3=v=>Math.round(v*1000)/1000;
 ok(Math.abs(snd.self.left-393)<0.01&&Math.abs(snd.self.right-399)<0.01&&snd.self.lf<1.01
  &&snd.self.rf<1.01&&Math.abs(snd.self.sum-6)<0.05,
  'the instrument reads a known 393 and 399 pair as itself first, got '
  +[snd.self.left,snd.self.right,snd.self.lf,snd.self.rf,snd.self.sum].map(r3).join(' '));
 ok(snd.self.control>1.5,'and a monaural mix of the same pair reads as unsteady, '+r3(snd.self.control));
 snd.seats.forEach(x=>{
  ok(Math.abs(x.left-(x.hz-x.beat/2))<0.02&&Math.abs(x.right-(x.hz+x.beat/2))<0.02,
   x.seat+' at '+x.beat+': each ear on its own side of '+x.hz+', got '+r3(x.left)+' and '+r3(x.right));
  ok(x.lf<1.02&&x.rf<1.02,x.seat+' at '+x.beat+': and each ear steady, so the beat is between '
   +'the ears and never inside one, '+r3(x.lf)+' and '+r3(x.rf));
  ok(Math.abs(x.sum-x.beat)<0.05,x.seat+' at '+x.beat+': and the beat they make is '+x.beat
   +', got '+r3(x.sum));});
 ok(Math.abs(snd.rise.before-THETA)<0.05&&Math.abs(snd.rise.after-ALPHA)<0.05,
  'the cross rises from theta to alpha inside one line, '+r3(snd.rise.before)+' to '+r3(snd.rise.after));
 ok(Math.abs(snd.rise.left-(snd.rise.root-ALPHA/2))<0.02
  &&Math.abs(snd.rise.right-(snd.rise.root+ALPHA/2))<0.02,
  'and the pitch stays on the seat while the beat moves, '+r3(snd.rise.left)+' and '+r3(snd.rise.right));
 ok(Math.abs(snd.glide.left-(snd.glide.heart-THETA/2))<0.02
  &&Math.abs(snd.glide.right-(snd.glide.heart+THETA/2))<0.02&&Math.abs(snd.glide.beat-THETA)<0.05,
  'the next seat is reached inside one line, '+r3(snd.glide.left)+' and '+r3(snd.glide.right)
  +', beat '+r3(snd.glide.beat));
 ok(snd.glide.stepIn<=snd.glide.stepAfter*1.02,
  'and nothing inside the glide steps harder than the sine it arrives at, which is what a click is, '
  +snd.glide.stepIn.toExponential(2)+' against '+snd.glide.stepAfter.toExponential(2));
 ok(snd.fade.first<snd.fade.steady/10,'the fade in under the opening starts from silence, '
  +snd.fade.first.toExponential(2)+' against '+snd.fade.steady.toExponential(2)+' at level');
 ok(snd.off.around<=snd.off.before*1.5,'off in the middle of the fade in does not click, '
  +snd.off.around.toExponential(2)+' against '+snd.off.before.toExponential(2)+' before it');
 ok(snd.off.after===0,'and it is silence, not quiet, once the tone has stopped, '+snd.off.after);
 console.log('  '+snd.seats.filter(x=>x.beat===THETA).map(x=>x.seat+' '+r3(x.left)+'/'+r3(x.right)
  +' beat '+r3(x.sum)).join(', '));
 console.log('  level '+r3(snd.seats[0].peak)+' dB, rise '+r3(snd.rise.before)+' to '+r3(snd.rise.after)
  +', fade in over '+r3(snd.fade.secs)+' s, least steady ear '
  +r3(Math.max.apply(null,snd.seats.map(x=>Math.max(x.lf,x.rf)))));

 console.log('\n=== the seat tone follows the release, and it is off until turned on ===');
 const pick=()=>tp.evaluate(()=>{
  var q=['Root','3rd Eye','Heart'].map(function(s){
   return NODES.filter(function(n){return n.cf&&n.b===s;})[0].i;});
  relPick(q); return RUN.queue.map(function(n){return n.b;});});
 const sw=()=>tp.evaluate(()=>{var b=document.getElementById('reltone');
  if(!b)return null; var em=b.parentElement.querySelector('.ac-rl em');
  return {checked:b.getAttribute('aria-checked'),role:b.getAttribute('role'),
   hz:em?em.textContent:'',style:em?(em.getAttribute('style')||''):''};});
 const bed=()=>tp.evaluate(()=>bedState());
 const kept=()=>tp.evaluate(()=>{try{var me=JSON.parse(localStorage.getItem(PKEY)||'[]')
  .filter(function(r){return r.id===CURP.id;})[0]; return me&&me.ui?me.ui.tone:null;}
  catch(e){return 'unreadable';}});
 /* waits for the oscillators themselves to land, rather than for a number of
    milliseconds, because the audio clock and the page clock are two clocks */
 const lands=async(l,r)=>{try{await tp.waitForFunction(a=>{var s=bedState();
   return s.on&&Math.abs(s.left-a[0])<0.05&&Math.abs(s.right-a[1])<0.05;},[l,r],{timeout:9000});}
  catch(e){} return bed();};
 await pick();
 const s0=await sw(), b0=await bed();
 ok(s0&&s0.role==='switch'&&s0.checked==='false',
  'the release offers the seat tone as a switch, and it is off until a person turns it on: '
  +JSON.stringify(s0));
 /* SILENCE IS THE DEFAULT, SO SILENCE IS THE CASE THAT MUST NEVER BREAK. Asked
    for by name in DESIGN-release.md: the run renders and completes with the
    tone off, and nothing audio is touched on the way. */
 await tp.click('#relgo'); await tp.waitForTimeout(150);
 await tp.click('#relskip'); await tp.waitForTimeout(150);
 const quietRun=await tp.evaluate(()=>({phase:RUN.phase,
  node:(document.querySelector('#rel .rel-node')||{}).textContent||''}));
 await tp.click('#relstop'); await tp.waitForTimeout(200);
 const quietEnd=await tp.evaluate(()=>({phase:RUN.phase,
  eye:(document.querySelector('#rel .pm-eye')||{}).textContent||'',
  sw:!!document.getElementById('reltone'), bed:bedState()}));
 ok(quietRun.phase==='run'&&quietRun.node.length>0&&quietEnd.phase==='done'&&/Released/.test(quietEnd.eye),
  'with the tone off a release runs and completes, '+JSON.stringify([quietRun,quietEnd.phase,quietEnd.eye]));
 ok(quietEnd.bed.ctx==='none'&&!quietEnd.bed.on,
  'and no audio channel was ever opened for it, '+JSON.stringify(quietEnd.bed));
 ok(!quietEnd.sw,'and the finished card offers no switch, because nothing is left to sound');
 await tp.evaluate(()=>relClose());
 /* ON, BY A PRESS, SAVED THROUGH THE ONE WRITER, AND NOTHING SOUNDS YET */
 await pick();
 await tp.click('#reltone'); await tp.waitForTimeout(150);
 const s1=await sw(), b1=await bed(), k1=await kept();
 const said1=await tp.evaluate(()=>document.getElementById('status').textContent);
 ok(s1&&s1.checked==='true'&&k1===true,'a press turns it on and it is saved to the record, '
  +JSON.stringify([s1&&s1.checked,k1]));
 ok(/Saved/.test(said1),'and the save reports like every other preference, said '+JSON.stringify(said1));
 ok(!b1.on&&b1.ctx==='none','and nothing sounds before Begin, '+JSON.stringify(b1));
 /* REMEMBERED. The page is reloaded and the switch reads the record. */
 await tp.reload({waitUntil:'load'}); await booted(tp);
 await pick();
 const s2=await sw();
 ok(s2&&s2.checked==='true','remembered across a reload, '+JSON.stringify(s2));
 /* BEGIN IS THE PRESS THAT OPENS THE CHANNEL, and the tone is the first seat's */
 await tp.click('#relgo'); await tp.waitForTimeout(150);
 await tp.evaluate(()=>clearInterval(RUN.timer));
 const want=await tp.evaluate(()=>RUN.queue.map(function(n){return {b:n.b,hz:seatHz(n.b),col:seatCol(n.b)};}));
 const b2=await bed(), s3=await sw();
 ok(b2.on&&b2.ctx==='running'&&b2.carrier===want[0].hz&&b2.beat===THETA,
  'Begin opens the channel inside the press and sounds the first seat, '+want[0].b+' at '
  +want[0].hz+', under theta: '+JSON.stringify(b2));
 ok(s3&&s3.hz===want[0].hz+' Hz'&&s3.style.indexOf(want[0].col)>=0,
  'and the switch prints that tone in the seat\'s own colour, '+JSON.stringify(s3));
 const b3=await lands(want[0].hz-THETA/2,want[0].hz+THETA/2);
 ok(Math.abs(b3.left-(want[0].hz-THETA/2))<0.05&&Math.abs(b3.right-(want[0].hz+THETA/2))<0.05,
  'the ears themselves sit either side of it, '+[b3.left,b3.right].map(r3).join(' and '));
 /* THE CROSS, AT THE SAME ADDRESS: the beat moves and the pitch does not */
 await tp.click('#relskip'); await tp.waitForTimeout(100);
 await tp.evaluate(()=>{ RUN.idx=RUN.plan.findIndex(function(k){var p=k.split(':');
  return +p[0]===RUN.queue[0].i&&/truth$/.test(p[1]);}); relRender(); });
 const b4=await lands(want[0].hz-ALPHA/2,want[0].hz+ALPHA/2);
 ok(b4.carrier===want[0].hz&&b4.beat===ALPHA
  &&Math.abs(b4.left-(want[0].hz-ALPHA/2))<0.05&&Math.abs(b4.right-(want[0].hz+ALPHA/2))<0.05,
  'at the switch to reframe the beat is alpha and the seat holds, '+JSON.stringify(b4));
 /* THE NEXT ADDRESS, and it is the 3rd Eye on purpose: the one seat a lookup
    by FLOWSEAT's printed name could not find */
 await tp.evaluate(()=>{ RUN.idx=RUN.plan.findIndex(function(k){
  return +k.split(':')[0]===RUN.queue[1].i;}); relRender(); });
 const b5=await lands(want[1].hz-THETA/2,want[1].hz+THETA/2), s5=await sw();
 ok(want[1].b==='3rd Eye'&&b5.carrier===want[1].hz&&b5.beat===THETA
  &&Math.abs(b5.left-(want[1].hz-THETA/2))<0.05&&Math.abs(b5.right-(want[1].hz+THETA/2))<0.05,
  'the next address moves the tone to its own seat, '+want[1].b+' at '+want[1].hz+': '+JSON.stringify(b5));
 ok(s5&&s5.hz===want[1].hz+' Hz'&&s5.style.indexOf(want[1].col)>=0,
  'and the switch follows it, '+JSON.stringify(s5));
 /* NOTHING ON THE CARD PULSES AT THE BEAT. Six to ten a second is past the
    three flashes a second WCAG 2.3.1 allows, so the beat is never drawn. */
 const flash=await tp.evaluate(()=>document.getAnimations().filter(function(a){
  var t=a.effect&&a.effect.target; if(!t||!t.closest||!t.closest('#rel'))return false;
  var tm=a.effect.getComputedTiming(); return tm.iterations>1&&tm.duration<334;}).length);
 ok(flash===0,'and nothing on the card repeats faster than three times a second, '+flash+' do');
 /* PAUSE SILENCES IT, RESUME BRINGS IT BACK, AND THE SWITCH NEVER MOVES */
 await tp.click('#relpause'); await tp.waitForTimeout(120);
 const b6=await bed(), s6=await sw();
 ok(!b6.on&&s6.checked==='true'&&s6.hz==='','Pause silences the tone and leaves the switch on, '
  +JSON.stringify([b6.on,s6]));
 await tp.click('#relpause'); await tp.waitForTimeout(120);
 const b7=await bed();
 ok(b7.on&&b7.carrier===want[1].hz,'and Resume brings back the seat the card is on, '+JSON.stringify(b7));
 /* OFF MID RUN, WITHOUT LEAVING THE RUN. The case the switch is on the card
    for: somebody finds it on, in a quiet room, halfway through. */
 await tp.click('#reltone'); await tp.waitForTimeout(150);
 const b8=await bed(), k8=await kept(), r8=await tp.evaluate(()=>({open:RUN.open,phase:RUN.phase}));
 ok(!b8.on&&k8===false&&r8.open&&r8.phase==='run',
  'turned off mid run the tone stops, the record says off, and the run goes on, '
  +JSON.stringify([b8.on,k8,r8]));
 await tp.click('#reltone'); await tp.waitForTimeout(150);
 const b9=await bed();
 ok(b9.on&&b9.carrier===want[1].hz,'and turned back on it returns at the seat the card is on, '
  +JSON.stringify(b9));
 /* STOP ENDS IT, AND THE CHANNEL IS PUT TO SLEEP ONCE THE FADE IS OVER */
 await tp.click('#relstop'); await tp.waitForTimeout(150);
 const b10=await bed(), end=await tp.evaluate(()=>({phase:RUN.phase,sw:!!document.getElementById('reltone')}));
 ok(!b10.on&&end.phase==='done'&&!end.sw,'Stop ends the tone with the run, '+JSON.stringify([b10,end]));
 let nap='running';
 try{ await tp.waitForFunction(()=>bedState().ctx==='suspended',null,{timeout:(4+3)*1000});
  nap='suspended'; }catch(e){ nap=(await bed()).ctx; }
 ok(nap==='suspended','and the channel sleeps once the fade out is done, rather than holding the '
  +'device awake, '+nap);
 await tp.evaluate(()=>relClose());
 /* A REFUSED RUN IS STILL AN ENDED RUN. relCoolDown refuses on a worked
    example and returns without a render, and a render is what moves the tone,
    so this is the path that would have left it sounding with the card frozen. */
 const refused=await tp.evaluate(()=>{ loadP(GORDON()); render();
  if(!CURP.ui)CURP.ui={}; CURP.ui.tone=true;
  relPick(W.filter(function(n){return n.cf&&n.sq>=4;}).slice(0,2).map(function(n){return n.i;}));
  return !!document.getElementById('relgo');});
 let rf={began:false};
 if(refused){
  await tp.click('#relgo'); await tp.waitForTimeout(150);
  rf=await tp.evaluate(()=>{ clearInterval(RUN.timer); var on=bedState().on;
   RUN.phase='run'; RUN.idx=RUN.plan.length; var r=relCoolDown();
   return {began:on, returned:r, phase:RUN.phase, bed:bedState().on};});
  await tp.evaluate(()=>relClose());}
 ok(rf.began&&rf.returned===false&&rf.phase==='pick'&&rf.bed===false,
  'a run refused on a worked example ends its tone although nothing re-renders, '+JSON.stringify(rf));
 ok(terr.length===0,'and the seat tone raised no page error, '+terr.join(' | '));
 await tp.close();
}

console.log('\n=== the Field drawn three ways, and the switch between them (BP8) ===');
/* RULED 25 SEPTEMBER. "I really like nested frames. You don't need to zoom,
   you can see everything... Let me see that dial with callouts too... do that
   in the app itself", with the switch "on the far left, because there's
   nothing there" and not upper right, which is the rail's tier line.

   Its own context, so the choice the switch stores cannot leak into another
   section of this file: a stored view outlives a reload on purpose, and a
   later section measuring the wheel would have found a rendition instead.

   Most of this is invisible to the design gate. It skips svg text for the
   type floor, it measures the default state, which is the wheel, and it knows
   the Field by #cv alone. So the floors it holds for the rest of the product
   are held here for the renditions, one by one. */
{
 const fx=await browser.newContext({viewport:{width:1600,height:1000}});
 const fp=await fx.newPage();
 const ferr=[];
 fp.on('pageerror',e=>ferr.push('PAGEERROR: '+e.message));
 fp.on('console',m=>{if(m.type()==='error'){const t=m.text();
  if(!/ERR_CERT_AUTHORITY_INVALID|ERR_FILE_NOT_FOUND|fonts\.googleapis/.test(t))ferr.push(t);}});
 await fp.goto(FILE,{waitUntil:'load'}); await booted(fp);
 const frame=pg=>pg.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const LAYERS=['domains','addresses','stories','masks','archetypes','patterns','chains','laws','gates','shadow'];

 /* WHERE IT SITS, on the default. Measured against the canvas and the rail's
    tier line, which are the two things the ruling placed it by. */
 const place=await fp.evaluate(()=>{loadP(PERSON('James'));setTab(TAB.FIELD);render();
  const sw=document.getElementById('fview'),cv=document.getElementById('cv'),st=document.getElementById('stage');
  const b=sw.getBoundingClientRect(),c=cv.getBoundingClientRect(),s=st.getBoundingClientRect();
  const rt=document.getElementById('railtop').getBoundingClientRect();
  const btns=[...sw.querySelectorAll('[data-fview]')];
  const d=id=>getComputedStyle(document.getElementById(id)).display;
  return {keys:btns.map(x=>x.getAttribute('data-fview')).join(','),
   pressed:btns.filter(x=>x.getAttribute('aria-pressed')==='true').map(x=>x.getAttribute('data-fview')).join(','),
   right:b.right,top:b.top,h:b.height,cvLeft:c.left,cvTop:c.top,cvH:c.height,mid:s.left+s.width/2,rail:rt.left,
   sizes:btns.map(x=>{const r=x.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)];}),
   cv:d('cv'),vbar:d('vbar'),frend:d('frend'),flay:d('flay')};});
 ok(place.keys==='wheel,frames,dial','three positions, wheel, frames and dial, got '+place.keys);
 ok(place.pressed==='wheel','the wheel is the default, so nobody who has not pressed it sees a change, got '+place.pressed);
 ok(place.right<=place.cvLeft+1,'the switch sits in the left lane and clear of the ring, right edge '
  +Math.round(place.right)+' against the canvas at '+Math.round(place.cvLeft));
 ok(place.right<place.mid&&place.right<place.rail,'and nowhere near the upper right, where the tier line is');
 /* CENTRE LEFT, ruled 26 September, CQ in TASKS.md, reversing BP8's head of
    the lane. Its middle sits on the canvas's middle. */
 ok(Math.abs(place.top+place.h/2-(place.cvTop+place.cvH/2))<12,'centre left, level with the middle of the ring, '
  +Math.round(place.top+place.h/2)+' against the canvas middle at '+Math.round(place.cvTop+place.cvH/2));
 ok(place.sizes.every(s=>s[0]>=44&&s[1]>=44),'every position clears the 44 pixel tap floor, '+JSON.stringify(place.sizes));
 ok(place.cv==='block'&&place.vbar==='flex'&&place.frend==='none'&&place.flay==='none',
  'on the wheel the canvas and the depth row are up, and no rendition and no layer row');
 /* THE SWITCH IS THE FIELD'S ALONE. The stage hosts every other surface as
    well, and nothing else in this file or the design gate would notice three
    buttons left in the left lane of the Summary: they clear the tap floor and
    they are not a tab host. With a rendition up, so its host and layer row
    are held to the same rule on the way out. */
 const away=await fp.evaluate(()=>{fviewSet('frames');const out=[];
  TABDEF.forEach(T=>{if(T.k===TAB.FIELD)return;setTab(T.k);
   ['fview','frend','flay'].forEach(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();
    if(getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0)out.push(T.nm+': '+id);});});
  setTab(TAB.FIELD);fviewSet('wheel');return out;});
 ok(away.length===0,'on every other surface the switch, the rendition and its layer row are down, up: '+(away.join(', ')||'none'));

 /* EACH RENDITION, on a loaded profile. Every layer draws, the loop carries
    every body address and none of the four outside it, the core prints the
    reading, and nothing is set under the eleven pixel floor. */
 const drawn=async v=>{
  await fp.evaluate(v=>{loadP(PERSON('James'));setTab(TAB.FIELD);fviewSet(v);},v);
  await frame(fp);
  return fp.evaluate(L=>{const fr=document.getElementById('frend'),d=id=>getComputedStyle(document.getElementById(id)).display;
   const texts=[...fr.querySelectorAll('text')];
   const lays=[...document.querySelectorAll('#flay .lay')];
   return {svg:!!fr.querySelector('svg.frsvg'),cv:d('cv'),vbar:d('vbar'),frend:d('frend'),flay:d('flay'),
    w:fr.clientWidth,h:fr.clientHeight,
    lays:lays.map(b=>b.getAttribute('data-lay')).join(','),layOn:lays.every(b=>b.getAttribute('aria-pressed')==='true'),
    laySizes:lays.map(b=>{const r=b.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)];}),
    counts:L.map(k=>[k,fr.querySelectorAll('.L-'+k+' [data-h], .L-'+k+' rect, .L-'+k+' path, .L-'+k+' circle').length]),
    nodes:FR_HIT.filter(h=>h.k==='node').length,body:W.length,
    outside:FR_HIT.filter(h=>h.k==='anchor'||(h.n&&FIELD.indexOf(h.n)>=0)).map(h=>h.n.k),
    kept:FIELD.length+' '+FIELD.every(n=>isFinite(n.sq)),
    figures:texts.map(t=>t.textContent).filter(s=>/^\d+$/.test(s)),cq:Math.round(compute().CQ),
    small:texts.filter(t=>parseFloat(getComputedStyle(t).fontSize)<11).map(t=>t.textContent),
    calls:[...fr.querySelectorAll('[data-call]')].length};},LAYERS);};
 for(const v of ['frames','dial']){
  const o=await drawn(v);
  ok(o.svg&&o.frend==='block'&&o.cv==='none','"'+v+'" draws into the wheel\'s own cell and the canvas steps aside, '+o.w+' by '+o.h);
  ok(o.vbar==='none'&&o.flay==='flex','"'+v+'" puts its layer row up in the depth row\'s place');
  ok(o.lays==='domains,addresses,stories,masks,archetypes,patterns,chains,laws,gates,shadow'&&o.layOn,
   '"'+v+'" carries ten layers in ring order, all on, got '+o.lays);
  ok(o.laySizes.every(s=>s[0]>=44&&s[1]>=44),'"'+v+'": every layer clears the tap floor, '+JSON.stringify(o.laySizes.slice(0,3)));
  /* a worked example carries no story, so its stories layer is empty by right;
     the stories layer is held on a committed story further down */
  const empty=o.counts.filter(c=>c[0]!=='stories'&&c[1]===0).map(c=>c[0]);
  ok(empty.length===0,'"'+v+'": every layer draws on James, empty: '+(empty.join(',')||'none'));
  /* CHANGED 26 SEPTEMBER, and changed rather than cut. This asserted 112
     places, the 108 body addresses and the four outside the body drawn as
     anchors at the seam. The owner then ruled the four hidden from the
     picture and kept in the maths, CB in TASKS.md, so the check now holds
     both halves of that: every body address is on the loop, not one mark
     or hit record belongs to the four, and the engine still carries all four
     with a figure each. FR_SHOW_OUTSIDE in ui/rings.js turns them back on,
     and this is the check that has to be turned with it. */
  ok(o.nodes===o.body,'"'+v+'": every body address is on the loop, '+o.nodes+' of '+o.body);
  ok(o.outside.length===0,'"'+v+'": the four outside the body are not drawn, got '+(o.outside.join(', ')||'none'));
  ok(o.kept==='4 true','"'+v+'": and the engine still carries the four, each with a figure, got '+o.kept);
  ok(o.figures.length===1&&+o.figures[0]===o.cq,'"'+v+'": the core prints the reading, '+o.figures.join(',')+' against CQ '+o.cq);
  ok(o.small.length===0,'"'+v+'": nothing set under eleven pixels, '+JSON.stringify(o.small));
  console.log('  '+v.padEnd(7)+o.w+'x'+o.h+'  '+o.counts.map(c=>c[0].slice(0,4)+' '+c[1]).join('  ')
   +(v==='dial'?'  callouts '+o.calls:''));}

 /* HIDDEN UNDER EVERY LIGHTING AND AT BOTH WIDTHS, because the ruling said
    gone and not gone on the default. Each lighting reads its own ground off
    the stage and each width builds its own box, so each is a separate build of
    the picture, and a build is what this counts, read off FR_HIT after it. */
 const sweep=await fp.evaluate(async()=>{const was=S.theme,out=[],n=[0];loadP(PERSON('James'));setTab(TAB.FIELD);
  for(const L of LIGHTINGS)for(const v of ['frames','dial']){setLighting(L[0]);fviewSet(v);
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));n[0]++;
   const bad=FR_HIT.filter(h=>h.k==='anchor'||(h.n&&FIELD.indexOf(h.n)>=0)).length,
    nodes=FR_HIT.filter(h=>h.k==='node').length;
   if(bad||nodes!==W.length)out.push(L[0]+'/'+v+': '+bad+' outside, '+nodes+' body');}
  setLighting(was);return {builds:n[0],want:LIGHTINGS.length*2,bad:out};});
 ok(sweep.builds===sweep.want&&sweep.want>2&&sweep.bad.length===0,'the four are drawn under no lighting, '+sweep.builds
  +' builds at 1600, failing: '+(sweep.bad.join('; ')||'none'));
 await fp.setViewportSize({width:390,height:844});
 const narrow=[];
 for(const v of ['frames','dial']){const o=await drawn(v);
  if(o.outside.length||o.nodes!==o.body||o.w<60)narrow.push(v+': '+o.outside.length+' outside, '+o.nodes+' body, '+o.w+' wide');}
 ok(narrow.length===0,'and none at 390 either, failing: '+(narrow.join('; ')||'none'));
 /* back to the box and the rendition the loop above left, the dial at 1600,
    which is what the toggle and the callout checks below are measured on */
 await fp.setViewportSize({width:1600,height:1000});
 await drawn('dial');

 /* A LAYER TOGGLE HIDES THE LAYER AND ITS WORDS, and brings them back. */
 const tog=await fp.evaluate(async()=>{
  const b=document.querySelector('#flay .lay[data-lay="patterns"]');
  const vis=()=>[...document.querySelectorAll('#frend .L-patterns')].filter(e=>getComputedStyle(e).display!=='none').length;
  const before=vis(); b.click(); const off=vis(), pressed=b.getAttribute('aria-pressed');
  b.click(); return {before:before,off:off,pressed:pressed,back:vis(),again:b.getAttribute('aria-pressed')};});
 ok(tog.before>0&&tog.off===0&&tog.pressed==='false','a toggle takes its layer off, marks and words, '+tog.before+' groups to '+tog.off);
 ok(tog.back===tog.before&&tog.again==='true','and a second press puts it back');

 /* THE CALLOUTS ARE INSIDE THE DIAL AND OFF EACH OTHER. The dial's reach is
    the outside of its domain band, measured off the drawing rather than
    derived. REVERSED 26 September, CT in TASKS.md: this held every name box
    clear of that reach, in the corners, and the owner then ruled "for the
    field, I do not like the way that the words stick out", which answered
    CR's Q5 on these six. Every box now has to sit inside it, read at its
    farthest corner, which only overstates. tests/collide.js holds the same
    on every profile at both widths. */
 const clear=await fp.evaluate(()=>{
  const fr=document.getElementById('frend'),hb=fr.getBoundingClientRect();
  const doms=[...fr.querySelectorAll('.L-domains > [data-h]')].map(e=>e.getBoundingClientRect());
  const x0=Math.min(...doms.map(b=>b.left)),x1=Math.max(...doms.map(b=>b.right));
  const y0=Math.min(...doms.map(b=>b.top)),y1=Math.max(...doms.map(b=>b.bottom));
  const cx=(x0+x1)/2,cy=(y0+y1)/2,R=Math.max(x1-x0,y1-y0)/2;
  const boxes=[...fr.querySelectorAll('[data-call] text')].map(t=>t.getBoundingClientRect());
  const inside=boxes.filter(b=>[[b.left,b.top],[b.right,b.top],[b.left,b.bottom],[b.right,b.bottom]]
   .every(q=>Math.hypot(q[0]-cx,q[1]-cy)<=R)).length;
  let over=0;for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];
   if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)over++;}
  const out=boxes.filter(b=>b.left<hb.left||b.right>hb.right||b.top<hb.top||b.bottom>hb.bottom).length;
  return {n:boxes.length,inside:inside,over:over,out:out,R:Math.round(R)};});
 ok(clear.n>=2,'the dial names something on James, '+clear.n+' lines');
 ok(clear.inside===clear.n,'every callout word sits inside the dial, '+clear.inside+' of '+clear.n+' inside a reach of '+clear.R);
 ok(clear.over===0&&clear.out===0,'and none overlaps another or leaves the cell, '+clear.over+' overlapping, '+clear.out+' outside');

 /* THE READOUT AND THE DRILL ARE THE WHEEL'S OWN. A real pointer, so the
    check also proves a thread drawn over an address does not take its press. */
 await fp.evaluate(()=>fviewSet('frames'));
 await frame(fp);
 const target=await fp.evaluate(()=>{
  let best=null;document.querySelectorAll('#frend .L-addresses [data-h]').forEach(e=>{const h=FR_HIT[+e.getAttribute('data-h')];
   if(h&&h.k==='node'&&h.n.cf&&(!best||h.n.sq>best.h.n.sq))best={e:e,h:h};});
  if(!best)return null;
  const b=best.e.getBoundingClientRect();rdClose();
  return {x:b.left+b.width/2,y:b.top+b.height/2,nm:best.h.n.k};});
 ok(!!target,'a held address is on the frames to point at');
 if(target){
  await fp.mouse.move(target.x,target.y); await fp.waitForTimeout(80);
  const pr=await fp.evaluate(()=>{const p=document.getElementById('probe');return {on:p.classList.contains('on'),t:p.textContent};});
  ok(pr.on&&pr.t.indexOf(target.nm)>=0,'hovering it puts the wheel\'s readout up, naming '+target.nm);
  ok(/Click for detail/.test(pr.t)&&!/Drag to change/.test(pr.t),'and it offers the click and not a drag nothing here can do');
  await fp.mouse.click(target.x,target.y); await fp.waitForTimeout(150);
  const dr=await fp.evaluate(()=>(document.getElementById('rdrill').textContent||''));
  ok(dr.indexOf(target.nm)>=0,'pressing it opens the address\'s own drill, '+dr.length+' chars');
  await fp.mouse.move(5,5);}

 /* NOTHING IS READ OFF THE DEFAULTS. The person's own blank profile: no
    figure anywhere in the picture, and the dial names nothing. */
 const blank=await fp.evaluate(async()=>{loadP(0);setTab(TAB.FIELD);fviewSet('dial');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const fr=document.getElementById('frend');
  return {unread:compute().unread,texts:[...fr.querySelectorAll('text')].map(t=>t.textContent),
   calls:fr.querySelectorAll('[data-call]').length};});
 ok(blank.unread,'the own profile is blank at a fresh start');
 ok(blank.texts.every(s=>!/\d/.test(s)),'no figure is printed off the defaults, got '+JSON.stringify(blank.texts));
 ok(blank.calls===0,'and the dial names nothing, '+blank.calls+' callouts');

 /* A STORY MARK SITS AT ITS OWN ADDRESS. The mockup read the atom key as a
    position, and the key is the address id, so every mark was drawn one
    address clockwise of its own. Two lines committed the way a person commits
    them, through the Story tab, on the person's own profile. */
 for(const t of ['My chest is tight in every meeting and I have told no one.',
                 'I felt nothing when we let forty people go and that frightens me.']){
  await fp.evaluate(t=>{loadP(0);setTab(TAB.STORY);stRender();
   const ta=document.getElementById('sttext');ta.value=t;ta.dispatchEvent(new Event('input',{bubbles:true}));},t);
  await fp.waitForTimeout(60);
  await fp.evaluate(()=>{const b=document.getElementById('stapply');if(b&&!b.disabled)b.click();});
  await fp.waitForTimeout(60);}
 const atoms=await fp.evaluate(async()=>{setTab(TAB.FIELD);fviewSet('frames');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const A=atomIndex(),total=Object.keys(A).reduce((a,k)=>a+A[k].length,0);
  const marks=[...document.querySelectorAll('#frend .L-stories [data-h]')].map(e=>FR_HIT[+e.getAttribute('data-h')]);
  return {total:total,marks:marks.length,wrong:marks.filter(h=>!A[h.n.i]||A[h.n.i].indexOf(h.v)<0).length};});
 ok(atoms.total>0,'the committed story put atoms on the field, '+atoms.total);
 ok(atoms.marks===atoms.total&&atoms.wrong===0,'every one is drawn, at its own address, '+atoms.marks+' drawn, '
  +atoms.wrong+' at the wrong address');

 /* THE CHOICE IS KEPT, and a reload opens the Field the way it was left. */
 await fp.evaluate(()=>fviewSet('dial'));
 await fp.reload({waitUntil:'load'}); await booted(fp); await frame(fp);
 const kept=await fp.evaluate(()=>{const on=document.querySelector('#fview [aria-pressed="true"]');
  return {stored:STORE.get('fview'),view:FVIEW,pressed:on?on.getAttribute('data-fview'):null,
   frend:getComputedStyle(document.getElementById('frend')).display,svg:!!document.querySelector('#frend svg.frsvg')};});
 ok(kept.stored==='dial'&&kept.view==='dial'&&kept.pressed==='dial','the switch is kept in the store and read back, '+JSON.stringify(kept));
 ok(kept.frend==='block'&&kept.svg,'and the Field opens drawn as the dial');
 /* and back to the wheel, which has to be measured again: hidden behind a
    rendition it had a box of nothing */
 const back=await fp.evaluate(async()=>{loadP(PERSON('James'));fviewSet('wheel');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  return {cv:getComputedStyle(document.getElementById('cv')).display,vbar:getComputedStyle(document.getElementById('vbar')).display,
   CW:CW,CH:CH,hits:HIT.length,stored:STORE.get('fview')};});
 ok(back.cv==='block'&&back.vbar==='flex'&&back.CW>0&&back.CH>0&&back.hits>0,
  'back on the wheel it is measured and drawn, '+Math.round(back.CW)+' by '+Math.round(back.CH)+', '+back.hits+' targets');
 ok(back.stored==='wheel','and the store says wheel again');
 ok(ferr.length===0,'no errors through any of it: '+ferr.join(' | '));
 await fx.close();

 /* ON A PHONE the stage is one column. The switch reads before the picture
    it changes, a rendition takes exactly the wheel's square, and nothing runs
    past the side of the screen. */
 const px=await browser.newContext({viewport:{width:390,height:844}});
 const pp=await px.newPage();
 const perr=[];pp.on('pageerror',e=>perr.push(e.message));
 await pp.goto(FILE,{waitUntil:'load'}); await booted(pp);
 for(const v of ['frames','dial']){
  await pp.evaluate(v=>{loadP(PERSON('James'));setTab(TAB.FIELD);fviewSet(v);},v);
  await frame(pp);
  const m=await pp.evaluate(()=>{const sw=document.getElementById('fview').getBoundingClientRect(),
   fr=document.getElementById('frend').getBoundingClientRect();
   const lays=[...document.querySelectorAll('#flay .lay')].map(b=>b.getBoundingClientRect());
   return {swBottom:sw.bottom,frTop:fr.top,frH:fr.height,want:Math.min(innerWidth*.86,390),
    body:document.body.scrollWidth,doc:document.documentElement.scrollWidth,
    layOut:lays.filter(b=>b.right>innerWidth+.5||b.left<-.5).length,svg:!!document.querySelector('#frend svg.frsvg'),
    small:[...document.querySelectorAll('#frend text')].filter(t=>parseFloat(getComputedStyle(t).fontSize)<11).length};});
  ok(m.svg&&m.swBottom<=m.frTop+1,'390, "'+v+'": the switch sits above the picture, '+Math.round(m.swBottom)+' against '+Math.round(m.frTop));
  ok(Math.abs(m.frH-m.want)<1,'390, "'+v+'": the picture takes the wheel\'s own square, '+m.frH.toFixed(1)+' against '+m.want.toFixed(1));
  ok(m.body<=390&&m.doc<=390,'390, "'+v+'": nothing runs past the screen, body '+m.body+', document '+m.doc);
  ok(m.layOut===0,'390, "'+v+'": the layer row wraps rather than hiding a layer off the edge, '+m.layOut+' off screen');
  ok(m.small===0,'390, "'+v+'": nothing under eleven pixels, '+m.small);
  /* BO2 IN THE RENDITIONS. The wheel keeps its gate pills at 8.5 because at
     11 they sat under the next gate's disc. These are at 11 and are spaced
     by their pills, and 390 is where the spacing is tightest: measured
     before the fix, a pill sat under a neighbour sixty times over the
     fifteen reference cases on the frames and thirty on the dial. */
  const under=await pp.evaluate(()=>{let n=0;
   const gs=[...document.querySelectorAll('#frend .L-gates > g')].map(g=>{const c=g.querySelector('circle'),q=g.querySelector('rect');
    return {x:+c.getAttribute('cx'),y:+c.getAttribute('cy'),r:+c.getAttribute('r'),px:+q.getAttribute('x'),
     py:+q.getAttribute('y'),pw:+q.getAttribute('width'),ph:+q.getAttribute('height')};});
   gs.forEach((a,i)=>gs.forEach((o,j)=>{if(i===j)return;
    const nx=Math.max(a.px,Math.min(o.x,a.px+a.pw)),ny=Math.max(a.py,Math.min(o.y,a.py+a.ph));
    if(Math.hypot(nx-o.x,ny-o.y)<o.r-0.5)n++;}));
   return {gates:gs.length,n:n};});
  ok(under.gates===6&&under.n===0,'390, "'+v+'": no gate pill sits under another gate, '+under.n+' of '+under.gates);}
 ok(perr.length===0,'390: no errors, '+perr.join(' | '));
 await px.close();
}

await browser.close();

console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
process.exit(FAIL?1:0);
})();
