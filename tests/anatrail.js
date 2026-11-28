/* ============================================================
   THE ANALYTICS TRAIL, GATED. Round RB. node tests/anatrail.js, and called
   from tests/functional.js so a full run holds it through the same code.

   His words: "all the bubbles. I should be able to click on it and drill down
   deeper and trace all my patterns down to the fetters. And I want the
   analytics page to give me telemetry and have that telemetry broken out in
   as many dimensions as we can to see what's running and where. If I click
   on any analytics, I want it to give me a summary on the right side. And I
   just clicked on the word innocent under analytics. and it says innocent,
   built from one held address across root."

   What is held here, each as a fact read off the engine and never typed:

     AT1  every square on the page, in all seven treemap boxes, is a door,
          and each kind opens a card in Selection. The nine axes, the seven
          points and the laws draw one square for each of CHILD, BANDS and
          SI (27 November: the bubbles, the readings row, Where it runs and
          The chain were removed, his ruling, and the boxes replaced them)
     AT2  the chain is walked the engine's way, super-complex to hyper-complex
          to complex to saboteur, each card listing exactly its own parts, and
          the super-complex's card calls it a super complex (23 October). The
          walk starts from the heaviest super-complex itself, since the rung
          it used to start from went with The chain on 27 November
     AT3  the walk goes on past the saboteur to a fetter, and past the fetter
          to its feeling, with every step kept in the trail
     AT4  a step in the trail goes back to that step and drops the rest
     AT5  every count of held a card prints is the count of fetters at 4 or
          more, the line he read, and the old line is gone
     AT6  every door meets the 44 pixel tap floor, at 1600 and at 390
     AT7  a second press on the same square puts the card down, as before
     AT8  an unread field prints a dash in every square that carries a figure,
          and a plan that cannot see the chain is shown the lock in the What
          is running box and no square
     AT9  an archetype card puts its primary saboteur where its own addresses
          sit, read off SAB_LIB, and never at the third column of ARCH18
          (systems audit SG-05, 24 October)

   Checked against a known bad case first, as the repository asks: the old
   card's sentence, rebuilt from the build before this round, must fail AT5.
   ============================================================ */
async function anaTrailGate(browser,FILE,ok,booted){
 for(const [w,h] of [[1600,1000],[390,844]]){
  const tag=w+': ';
  const pg=await browser.newPage({viewport:{width:w,height:h}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE); await booted(pg);
  try{
  /* ---- the known bad case, before the gate is trusted ---- */
  const bad=await pg.evaluate(()=>{
   const line='Built from <b>1</b> held addresses across Root.';
   const m=/(\d+)<\/b> held addresses/.exec(line);
   /* a leaf list with one address under the line: the old sentence counted it held */
   const lv=[{sq:2.1}], held=lv.filter(n=>n.sq>=4).length;
   return {claimed:m?+m[1]:null,held};});
  ok(bad.claimed!==bad.held,'AT5: '+tag+'the old sentence is caught: it says '+bad.claimed+' held where '+bad.held+' is');

  await pg.evaluate(()=>{loadP(GORDON());setTab(TAB.ANALYTICS);render();});
  await pg.waitForTimeout(300);
  const page=await pg.evaluate(()=>{
   const c=k=>document.querySelectorAll('#ana .ana-tm-cell[data-lens="'+k+'"]').length;
   const all=[...document.querySelectorAll('#ana .ana-tm-cell')];
   return {cells:all.length, doors:all.filter(e=>e.tagName==='BUTTON'&&e.getAttribute('data-ana')).length,
    law:c('law'),nlaws:SI.length, axis:c('axis'),feel:CHILD.length, seat:c('seat'),seats:BANDS.length,
    chain:c('chain'), boxes:document.querySelectorAll('#ana .ana-tm-lens').length};});
  ok(page.cells>0&&page.doors===page.cells&&page.boxes===7,'AT1: '+tag+'seven boxes, and every square in them is a door a keyboard reaches, '+page.doors+' of '+page.cells);
  ok(page.law===page.nlaws&&page.axis===page.feel&&page.seat===page.seats&&page.chain>0,
   'AT1: '+tag+'one square for each law, each axis and each point, and the chain drawn, '+JSON.stringify(page));

  /* ---- AT1: each kind of door opens a card ---- */
  const open=async(sel)=>{
   await pg.evaluate(()=>{try{rdClose();}catch(e){}});
   const el=await pg.$(sel); if(!el)return {missing:sel};
   await el.scrollIntoViewIfNeeded(); await el.click(); await pg.waitForTimeout(120);
   return pg.evaluate(()=>({k:(ANA_PICK||{}).k,n:(document.getElementById('rdrill').innerText||'').trim().length,
    shown:document.getElementById('rdrill').style.display!=='none'}));};
  /* every chart is a squarified treemap now, 27 November, so every door
     is found by its lens */
  for(const [sel,k] of [['#ana .ana-tm-cell[data-lens="law"]','law'],
    ['#ana .ana-tm-cell[data-lens="seat"]','seat'],['#ana .ana-tm-cell[data-lens="axis"]','axis'],
    ['#ana .ana-tm-cell[data-lens="dom"]','dom'],['#ana .ana-tm-cell[data-lens="arch"]','arch'],
    ['#ana .ana-tm-cell[data-lens="mask"]','mask'],['#ana .ana-tm-cell[data-lens="chain"]','chain']]){
   const o=await open(sel);
   ok(o.k===k&&o.shown&&o.n>60,'AT1: '+tag+sel+' opens its '+k+' card in Selection, '+JSON.stringify(o));}

  /* ---- AT9: an archetype card puts its primary saboteur where its addresses
     sit. Systems audit SG-05, 24 October: the card printed the third column
     of ARCH18 as the saboteur's seat, which held none of its addresses in 9 of
     the 18 rows, so the Caregiver's card put Pleaser at the heart. What it
     should say is read here off SAB_LIB and the node table, not through the
     helper the card uses. ---- */
  {/* the archetypes are treemap cells now, round ana-treemap, not bubbles */
   const ds=await pg.$$eval('#ana .ana-tm-cell[data-lens="arch"]',gs=>gs.map(g=>g.getAttribute('data-ana')));
   const off=[];
   for(const d of ds){
    const o=await open('#ana .ana-tm-cell[data-ana="'+d+'"]');
    if(o.missing||o.k!=='arch'){off.push(d+' did not open, '+JSON.stringify(o)); continue;}
    const r=await pg.evaluate(()=>{const nm=(ANA_PICK||{}).nm;
     const a18=ARCH18.filter(x=>x[0]===nm||(nm==='Rebel'&&x[0]==='Outlaw'))[0];
     let s=null; if(a18)SAB_LIB.forEach(x=>{if(KB_KEY(x.nm)===KB_KEY(a18[1]))s=x;});
     const at={}; if(s)s.nids.forEach(i=>{at[BY[i].b]=1;});
     const seats=BANDS.filter(b=>at[b]);
     const t=(document.getElementById('rdrill').innerText||'').replace(/\s+/g,' ');
     const want=seats.length?'its addresses sit at '+unpackList(seats.map(srcSeatSay)):'';
     return {nm, sab:a18?a18[1]:null, want, ok:t.indexOf(want)>=0&&!/seated at the/.test(t)};});
    if(!r.ok)off.push(JSON.stringify(r));}
   ok(ds.length>0&&off.length===0,'AT9: '+tag+'every archetype card puts its primary saboteur where its own addresses sit, of '
    +ds.length+': '+off.slice(0,2).join(' | '));}

  /* ---- AT7: the same square again puts it down ---- */
  {await pg.evaluate(()=>{try{rdClose();}catch(e){} ANA_PICK=null;ANA_TRAIL=[];});
   const g=await pg.$('#ana .ana-tm-cell[data-lens="seat"]'); await g.scrollIntoViewIfNeeded(); await g.click(); await pg.waitForTimeout(80);
   const g2=await pg.$('#ana .ana-tm-cell.on'); if(g2)await g2.click(); await pg.waitForTimeout(80);
   const st=await pg.evaluate(()=>({pick:ANA_PICK,shown:document.getElementById('rdrill').style.display!=='none'}));
   ok(st.pick===null&&!st.shown,'AT7: '+tag+'a second press on the same square puts the card down, '+JSON.stringify(st));}

  /* ---- AT2, AT3: walk the chain from the heaviest super-complex. The
     rung that started this walk went with The chain, 27 November, so the
     walk opens the super-complex the way its own square does. ---- */
  await pg.evaluate(()=>{try{rdClose();}catch(e){} ANA_PICK=null;ANA_TRAIL=[];
   const r=computeSeen(), top=r.sups.slice().sort((a,b)=>b.w-a.w)[0];
   if(top)anaGo('chain',top.nm,true);});
  await pg.waitForTimeout(120);
  const walk=[];
  for(let i=0;i<6;i++){
   const st=await pg.evaluate(()=>{
    const r=computeSeen(), P=ANA_PICK||{};
    const o=P.k==='chain'?[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(x=>x.nm===P.nm)[0]:null;
    const rows=[...document.querySelectorAll('#rdrill .ad-r[data-ana^="chain|"]')].map(e=>e.getAttribute('data-ana').slice(6));
    const card=document.getElementById('rdrill').innerText.replace(/\s+/g,' ');
    let want=null,heldSay=null,held=null;
    if(o){
     if(o.kind!=='sab')want=o.parts.map(p=>p.nm);
     const lv=leaves(o); held=lv.filter(n=>n.sq>=4).length;
     const m=/fetters? at the [^.]*\. (\d+) (?:is|are) held|None is held/.exec(card);
     heldSay=m?(m[1]?+m[1]:0):null;}
    return {k:P.k,kind:o?o.kind:null,nm:P.nm,trail:ANA_TRAIL.length,rows,want,held,heldSay,
     old:/held addresses across/.test(card),
     sup:/\bsuper[- ]complex(es)?\b/i.test(card),character:/\bcharacter\b/i.test(card)};});
   walk.push(st);
   if(st.kind==='sab'||st.k!=='chain'&&st.k!=='rung')break;
   const next=st.rows[0]; if(!next)break;
   await pg.click('#rdrill .ad-r[data-ana="chain|'+next.replace(/"/g,'\\"')+'"]'); await pg.waitForTimeout(120);}
  const kinds=walk.filter(s=>s.kind).map(s=>s.kind);
  ok(JSON.stringify(kinds)==='["sup","hy","cx","sab"]','AT2: '+tag+'the walk runs super-complex, hyper-complex, complex, saboteur, '+JSON.stringify(kinds));
  /* THE TOP RUNG'S WORD, ruled 23 October: the rung is the super complex and
     Character is the whole of it, so no card on the walk says Character */
  const top=walk.filter(s=>s.kind==='sup');
  ok(top.length>=1&&top.every(s=>s.sup),'AT2: '+tag+'the super-complex card calls the rung a super complex, '+JSON.stringify(top.map(s=>({k:s.k,kind:s.kind,sup:s.sup}))));
  ok(walk.every(s=>!s.character),'AT2: '+tag+'and no card on the walk says Character, '+JSON.stringify(walk.filter(s=>s.character).map(s=>s.k+' '+s.nm)));
  walk.filter(s=>s.want).forEach(s=>ok(JSON.stringify(s.rows.slice(0,s.want.length))===JSON.stringify(s.want),
   'AT2: '+tag+s.kind+' '+s.nm+' lists exactly its own parts, '+JSON.stringify({rows:s.rows,want:s.want})));
  walk.filter(s=>s.kind).forEach(s=>ok(s.heldSay===s.held&&!s.old,
   'AT5: '+tag+s.kind+' '+s.nm+' says '+s.heldSay+' held, and '+s.held+' of its fetters are at 4 or more'));
  walk.filter(s=>s.k).forEach((s,i)=>ok(s.trail===i,'AT3: '+tag+'step '+i+' carries '+i+' steps above it, got '+s.trail));
  /* past the saboteur: a fetter, then its feeling */
  await pg.click('#rdrill .ad-r[data-ana^="addr|"]'); await pg.waitForTimeout(120);
  const fet=await pg.evaluate(()=>({k:ANA_PICK.k,trail:ANA_TRAIL.length,n:BY[+ANA_PICK.nm],
   axis:!!document.querySelector('#rdrill .ad-r[data-ana^="axis|"]'),
   feeds:document.querySelectorAll('#rdrill .ad-r[data-ana^="chain|"]').length}));
  ok(fet.k==='addr'&&fet.trail===4&&fet.axis&&fet.feeds>0,
   'AT3: '+tag+'the saboteur opens a fetter, which climbs back up through what it feeds and down to its feeling, '+JSON.stringify({k:fet.k,trail:fet.trail,axis:fet.axis,feeds:fet.feeds}));
  await pg.click('#rdrill .ad-r[data-ana^="axis|"]'); await pg.waitForTimeout(120);
  const ax=await pg.evaluate(()=>({k:ANA_PICK.k,nm:ANA_PICK.nm,trail:ANA_TRAIL.length,
   crumbs:document.querySelectorAll('#rdrill [data-anacrumb]').length}));
  ok(ax.k==='axis'&&ax.trail===5&&ax.crumbs===5,'AT3: '+tag+'and the fetter opens its feeling, five steps down, every one in the trail, '+JSON.stringify(ax));

  /* ---- AT4: a step goes back ---- */
  await pg.click('#rdrill [data-anacrumb="1"]'); await pg.waitForTimeout(120);
  const back=await pg.evaluate(()=>({k:ANA_PICK.k,trail:ANA_TRAIL.length}));
  ok(back.k==='chain'&&back.trail===1,'AT4: '+tag+'the second step goes back to the hyper-complex and drops the rest, '+JSON.stringify(back));

  /* ---- AT6: the tap floor on every door ---- */
  const small=await pg.evaluate(()=>[...document.querySelectorAll('#ana button[data-ana],#rdrill [data-ana],#rdrill [data-anacrumb]')]
   .map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>0&&x.r.height>0&&(x.r.width<43.5||x.r.height<43.5))
   .map(x=>(x.e.className+' '+(x.e.textContent||'').trim()).slice(0,30)+' '+Math.round(x.r.width)+'x'+Math.round(x.r.height)));
  ok(small.length===0,'AT6: '+tag+'every door is at least 44 by 44, '+small.slice(0,5).join(' | '));

  /* ---- AT8: unread, and a plan that cannot see the chain ---- */
  const un=await pg.evaluate(()=>{loadP(0);setTab(TAB.ANALYTICS);render();
   const v=[...document.querySelectorAll('#ana .ana-tm-cell:not([data-lens="dom"]) .ana-tm-v')].map(e=>e.textContent);
   const tips=[...document.querySelectorAll('#ana .ana-tm-cell[data-lens="law"],#ana .ana-tm-cell[data-lens="axis"],#ana .ana-tm-cell[data-lens="seat"]')]
    .filter(e=>!/not read yet/.test(e.getAttribute('title')||'')).length;
   return {unread:compute().unread,figs:v.length,dashes:v.filter(t=>t===PCT_DASH).length,tips};});
  ok(un.unread&&un.figs>0&&un.dashes===un.figs&&un.tips===0,'AT8: '+tag+'an unread field prints a dash in every square, and each says not read yet, '+JSON.stringify(un));
  /* the free tier, through the harness seam lock.js names: SIGHT_PLAN null
     under FULL_SIGHT saw the whole chain, so the lock was never drawn here */
  const lk=await pg.evaluate(()=>{const was=SIGHT_PLAN; SIGHT_PLAN={tier:'free',status:'active'};
   try{loadP(GORDON());setTab(TAB.ANALYTICS);render();
    const locked=SEE_ORDER.filter(k=>!lockSees(k));
    const box=document.querySelector('#ana [data-lens-panel="chain"]');
    return {locked,all:locked.length===SEE_ORDER.length,
     panel:!!(box&&box.querySelector('.ana-tm-box [data-lock-panel]')),
     cells:box?box.querySelectorAll('.ana-tm-cell').length:-1};}finally{SIGHT_PLAN=was;try{rdClose();}catch(e){}}});
  if(lk.all)
   ok(lk.panel&&lk.cells===0,'AT8: '+tag+'a plan that cannot see the chain gets the lock in What is running and no square, '+JSON.stringify(lk));
  else ok(false,'AT8: '+tag+'the free tier was meant to lock the whole chain, '+JSON.stringify(lk));
  }catch(e){ok(false,'AT1: '+tag+'the trail group threw, '+String(e.message).split('\n')[0]);}
  ok(err.length===0,'AT1: '+tag+'no page errors on the trail, '+err.join(' | '));
  await pg.close();}}
module.exports={anaTrailGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const path=require('path');
 const {FULL_SIGHT}=require('./seed.js');
 (async()=>{
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
  let PASS=0,FAIL=0;
  const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
  const GORDON_FN=`window.GORDON=function(){for(var i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm==='Gordon')return i;throw new Error('Gordon is not in the roster any more');};`;
  browser.newPage=(orig=>async function(...a){
   const pg=await orig.apply(this,a); await pg.addInitScript(GORDON_FN); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
   try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
    await p.waitForTimeout(120);}catch(e){}};
  await anaTrailGate(browser,FILE,ok,booted);
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);
 })();
}
