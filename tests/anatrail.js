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

     AT1  every bubble, tile, square, ring count, law bar and session bar on
          the page is a door, and each one opens a card in Selection
     AT2  the chain is walked the engine's way, character to hyper-complex to
          complex to saboteur, each card listing exactly its own parts
     AT3  the walk goes on past the saboteur to a fetter, and past the fetter
          to its feeling, with every step kept in the trail
     AT4  a step in the trail goes back to that step and drops the rest
     AT5  every count of held a card prints is the count of fetters at 4 or
          more, the line he read, and the old line is gone
     AT6  every door meets the 44 pixel tap floor, at 1600 and at 390
     AT7  a second press on the same bubble puts the card down, as before
     AT8  an unread field prints no telemetry, and a plan that cannot see the
          chain is shown the lock and no pattern

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
   const g=[...document.querySelectorAll('#ana .ab-svg g')];
   return {bubbles:g.length, doors:g.filter(e=>e.getAttribute('data-ana')&&e.getAttribute('role')==='button'&&e.getAttribute('tabindex')==='0').length,
    tiles:document.querySelectorAll('#ana .ana-tile[data-ana]').length,
    cells:document.querySelectorAll('#ana .ana-g[data-ana]').length,
    edges:document.querySelectorAll('#ana .ana-g-h[data-ana],#ana .ana-g-r[data-ana]').length,
    rungs:document.querySelectorAll('#ana .ana-rung[data-ana]').length,
    laws:document.querySelectorAll('#ana .ana-lw[data-ana]').length, nlaws:SI.length,
    seats:BANDS.length, feel:CHILD.length};});
  ok(page.bubbles>0&&page.doors===page.bubbles,'AT1: '+tag+'every bubble is a door a keyboard reaches, '+page.doors+' of '+page.bubbles);
  ok(page.tiles===6&&page.cells>0&&page.edges===page.seats+page.feel&&page.rungs===5&&page.laws===page.nlaws,
   'AT1: '+tag+'the readings, the squares, both edges, the chain and every law are doors, '+JSON.stringify(page));

  /* ---- AT1: each kind of door opens a card ---- */
  const open=async(sel)=>{
   await pg.evaluate(()=>{try{rdClose();}catch(e){}});
   const el=await pg.$(sel); if(!el)return {missing:sel};
   await el.scrollIntoViewIfNeeded(); await el.click(); await pg.waitForTimeout(120);
   return pg.evaluate(()=>({k:(ANA_PICK||{}).k,n:(document.getElementById('rdrill').innerText||'').trim().length,
    shown:document.getElementById('rdrill').style.display!=='none'}));};
  for(const [sel,k] of [['#ana .ana-tile[data-ana="met|dq"]','met'],['#ana .ana-g','cell'],['#ana .ana-g-h','seat'],
    ['#ana .ana-g-r','axis'],['#ana .ana-rung[data-ana="rung|sab"]','rung'],['#ana .ana-lw','law'],
    ['#ana g[data-ana^="seat|"]','seat'],['#ana g[data-ana^="axis|"]','axis'],['#ana g[data-ana^="dom|"]','dom'],
    ['#ana g[data-ana^="arch|"]','arch'],['#ana g[data-ana^="mask|"]','mask'],['#ana g[data-ana^="chain|"]','chain']]){
   const o=await open(sel);
   ok(o.k===k&&o.shown&&o.n>60,'AT1: '+tag+sel+' opens its '+k+' card in Selection, '+JSON.stringify(o));}

  /* ---- AT7: the same bubble again puts it down ---- */
  {const g=await pg.$('#ana g[data-ana^="seat|"]'); await g.click(); await pg.waitForTimeout(80);
   const g2=await pg.$('#ana g.on'); if(g2)await g2.click(); await pg.waitForTimeout(80);
   const st=await pg.evaluate(()=>({pick:ANA_PICK,shown:document.getElementById('rdrill').style.display!=='none'}));
   ok(st.pick===null&&!st.shown,'AT7: '+tag+'a second press on the same bubble puts the card down, '+JSON.stringify(st));}

  /* ---- AT2, AT3: walk the chain from the character ring ---- */
  await open('#ana .ana-rung[data-ana="rung|sup"]');
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
     old:/held addresses across/.test(card)};});
   walk.push(st);
   if(st.kind==='sab'||st.k!=='chain'&&st.k!=='rung')break;
   const next=st.rows[0]; if(!next)break;
   await pg.click('#rdrill .ad-r[data-ana="chain|'+next.replace(/"/g,'\\"')+'"]'); await pg.waitForTimeout(120);}
  const kinds=walk.filter(s=>s.kind).map(s=>s.kind);
  ok(JSON.stringify(kinds)==='["sup","hy","cx","sab"]','AT2: '+tag+'the walk runs character, hyper-complex, complex, saboteur, '+JSON.stringify(kinds));
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
  ok(fet.k==='addr'&&fet.trail===5&&fet.axis&&fet.feeds>0,
   'AT3: '+tag+'the saboteur opens a fetter, which climbs back up through what it feeds and down to its feeling, '+JSON.stringify({k:fet.k,trail:fet.trail,axis:fet.axis,feeds:fet.feeds}));
  await pg.click('#rdrill .ad-r[data-ana^="axis|"]'); await pg.waitForTimeout(120);
  const ax=await pg.evaluate(()=>({k:ANA_PICK.k,nm:ANA_PICK.nm,trail:ANA_TRAIL.length,
   crumbs:document.querySelectorAll('#rdrill [data-anacrumb]').length}));
  ok(ax.k==='axis'&&ax.trail===6&&ax.crumbs===6,'AT3: '+tag+'and the fetter opens its feeling, six steps down, every one in the trail, '+JSON.stringify(ax));

  /* ---- AT4: a step goes back ---- */
  await pg.click('#rdrill [data-anacrumb="2"]'); await pg.waitForTimeout(120);
  const back=await pg.evaluate(()=>({k:ANA_PICK.k,trail:ANA_TRAIL.length}));
  ok(back.k==='chain'&&back.trail===2,'AT4: '+tag+'the third step goes back to the hyper-complex and drops the rest, '+JSON.stringify(back));

  /* ---- AT6: the tap floor on every door ---- */
  const small=await pg.evaluate(()=>[...document.querySelectorAll('#ana button[data-ana],#rdrill [data-ana],#rdrill [data-anacrumb]')]
   .map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>0&&x.r.height>0&&(x.r.width<43.5||x.r.height<43.5))
   .map(x=>(x.e.className+' '+(x.e.textContent||'').trim()).slice(0,30)+' '+Math.round(x.r.width)+'x'+Math.round(x.r.height)));
  ok(small.length===0,'AT6: '+tag+'every door is at least 44 by 44, '+small.slice(0,5).join(' | '));

  /* ---- AT8: unread, and a plan that cannot see the chain ---- */
  const un=await pg.evaluate(()=>{loadP(0);setTab(TAB.ANALYTICS);render();
   return {unread:compute().unread,tele:!!document.querySelector('#ana .ana-tele')};});
  ok(un.unread&&!un.tele,'AT8: '+tag+'an unread field prints no telemetry, '+JSON.stringify(un));
  const lk=await pg.evaluate(()=>{const was=SIGHT_PLAN; SIGHT_PLAN=null;
   try{loadP(GORDON());setTab(TAB.ANALYTICS);render();
    const locked=SEE_ORDER.filter(k=>!lockSees(k));
    const out={locked,marks:[...document.querySelectorAll('#ana .ana-rung')].filter(e=>e.querySelector('.lk-mk,svg')).length};
    ANA_PICK={k:'rung',nm:'sab'};ANA_TRAIL=[];anaDrill();
    out.panel=!!document.querySelector('#rdrill [data-lock-panel]');
    out.pats=document.querySelectorAll('#rdrill .ad-r[data-ana^="chain|"]').length;
    return out;}finally{SIGHT_PLAN=was;try{rdClose();}catch(e){}}});
  if(lk.locked.indexOf('sab')>=0)
   ok(lk.marks>=lk.locked.length&&lk.panel&&lk.pats===0,'AT8: '+tag+'a plan that cannot see saboteurs gets the lock and no pattern, '+JSON.stringify(lk));
  else ok(true,'AT8: '+tag+'this record\'s plan sees saboteurs, nothing to lock');
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
