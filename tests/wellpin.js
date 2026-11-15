/* ============================================================
   THE WELL'S AUTO PIN, GATED. node tests/wellpin.js. SV23, 14 November,
   his words: "whatever I select, it will select that icon in the right
   rail and then show me all the children of that, the parent and its
   children ... tell me how all that runs through me."

   THE LOOPWIRE LESSON, NAMED IN THIS ROUND'S OWN SPEC: railStack is called
   from three other places besides the pill press (render, the chevron,
   Open all), and pinning inside it would override a person's own unpin on
   every one of those renders, not just the press that chose a new tier. So
   this file holds exactly the cases that lesson names:

     1  a press on a tier pill (sab here) pins the heaviest pattern of that
        tier and the well shows its name
     2  a second press on the same pill, nothing else changed, leaves the
        pin exactly where it was, never a reset and never a re-pin
     3  a press on a locked tier pins nothing: lockSees(k) is checked before
        the pattern list, named lesson one in the spec
     4  render(), called the way a drill or a story commit calls it and not
        through the pill, never resurrects a pin a person cleared: it runs
        railStack and nothing else, and auto pin lives only in the one
        click handler

   Checked against a known bad case first, the house rule: with S.pin
   already set to a sab, the second click on the sab pill must not replace
   it with a different sab even when a different one in the list is
   heavier, which is what "isn't already of that kind" in the spec guards
   and the thing this file would catch if that check were dropped.
   ============================================================ */
const path=require('path');

async function wellPinGate(browser,FILE,ok,booted){
 const pg=await browser.newPage({viewport:{width:1600,height:1000}});
 const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(500);

 /* a record with real saboteurs, complexes, hyper and super complexes to
    pin against, read off the engine rather than typed: the heaviest sab's
    own name is asserted against what the page actually pins, never a
    quoted guess at who that is this build */
 const seed=await pg.evaluate(()=>{loadP(9); setTab(TAB.FIELD); render();
  const r=computeSeen();
  return {sabs:r.sabs.length, heaviest:(r.sabs.slice().sort((a,b)=>b.w-a.w)[0]||{}).nm};});
 ok(seed.sabs>0&&!!seed.heaviest,'a seeded record carries real saboteurs to pin against, '+JSON.stringify(seed));

 /* ---- 1 · the press pins the heaviest and shows its name ---- */
 const p1=await pg.evaluate(()=>{
  document.querySelector('#stack .stk-t[data-st="sab"]').click();
  return {k:S.pin&&S.pin.kind, nm:S.pin&&S.pin.nm,
   shown:(document.querySelector('#stack .stk-sl[data-role="reading"] span')||{}).textContent||''};});
 ok(p1.k==='sab'&&p1.nm===seed.heaviest,'1: the sab pill pins the heaviest saboteur, '+JSON.stringify(p1)+' want '+seed.heaviest);
 ok(p1.shown.indexOf(p1.nm)>=0,'1: and the well\'s Reading line names it, '+p1.shown.slice(0,60));

 /* ---- 2 · a second press on the same pill leaves the pin alone ---- */
 const p2=await pg.evaluate(()=>{
  document.querySelector('#stack .stk-t[data-st="sab"]').click();
  return {k:S.pin&&S.pin.kind, nm:S.pin&&S.pin.nm};});
 ok(p2.k==='sab'&&p2.nm===p1.nm,'2: a second press on the same tier leaves the pin unchanged, '+JSON.stringify(p2));

 /* a person's own choice inside the tier still holds against a third press
    of the same pill: pin a different sab by its row, then press the pill
    again and check it was not put back to the heaviest */
 const p2b=await pg.evaluate(()=>{
  const rows=[...document.querySelectorAll('#stack .stk-r[data-sk="sab"]')];
  const other=rows.find(r=>!r.classList.contains('on'));
  if(!other)return {skipped:true};
  other.click();
  const chosen=S.pin&&S.pin.nm;
  document.querySelector('#stack .stk-t[data-st="sab"]').click();
  return {chosen:chosen, after:S.pin&&S.pin.nm};});
 ok(p2b.skipped||p2b.after===p2b.chosen,
  '2b: a row\'s own pin survives a press on the pill that already shows its tier, '+JSON.stringify(p2b));

 /* ---- 3 · a locked tier pins nothing ---- */
 const p3=await pg.evaluate(()=>{
  S.pin=null;
  SIGHT_PLAN=null; CURP.plan={tier:'free',status:'',granted:0,carried:0,base:null,since:null,until:null};
  setTab(TAB.FIELD); render();
  const locked=lockSees('sab')===false;
  document.querySelector('#stack .stk-t[data-st="sab"]').click();
  return {locked:locked, pin:S.pin};});
 ok(p3.locked,'3: this plan really does lock saboteurs, or the case below proves nothing, '+JSON.stringify(p3.locked));
 ok(p3.pin===null,'3: a press on a locked tier pins nothing, got '+JSON.stringify(p3.pin));

 /* back to the top tier for the last case: a fresh load carries no plan at
    all, which reads as full sight the way an own record does */
 await pg.evaluate(()=>{SIGHT_PLAN=null; loadP(9); setTab(TAB.FIELD); render();});

 /* ---- 4 · render() alone never resurrects a cleared pin ---- */
 const p4=await pg.evaluate(()=>{
  document.querySelector('#stack .stk-t[data-st="sab"]').click();
  const row=document.querySelector('#stack .stk-r.stk-am.on');
  if(row)row.click(); /* the same row, toggled off: runDrill then render() inside the handler */
  const afterUnpin=S.pin;
  render(); /* the plain call every drill close and story commit makes */
  return {afterUnpin:afterUnpin, afterRender:S.pin};});
 ok(p4.afterUnpin===null,'4: the row\'s own toggle clears the pin, '+JSON.stringify(p4.afterUnpin));
 ok(p4.afterRender===null,'4: and a bare render() leaves it cleared, never re-pinning through railStack, '+JSON.stringify(p4.afterRender));

 /* ---- the markup the spec names, unchanged ---- */
 const marks=await pg.evaluate(()=>{
  const sabT=document.querySelector('#stack .stk-t[data-st="sab"]');
  return {stackId:!!document.getElementById('stack'),
   tabSel:!!sabT, glyphShared: sabT? sabT.querySelector('svg path').getAttribute('d')===CHAINGLYPH.sab : false};});
 ok(marks.stackId&&marks.tabSel,'the #stack id and the .stk-t[data-st] markup the spec names are unchanged');
 ok(marks.glyphShared,'and the pill\'s own mark is still CHAINGLYPH.sab, the glyph ui/fieldbar.js shares');

 ok(err.length===0,'no page errors, got '+err.slice(0,2).join(' | '));
 await pg.close();
}

module.exports={wellPinGate};

if(require.main===module){
 const {chromium}=require('playwright');
 (async()=>{
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  let PASS=0,FAIL=0;
  const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}};
  console.log('\n=== the well\'s auto pin: one tier, one press, never inside railStack ===');
  try{await wellPinGate(browser,FILE,ok,booted);}
  catch(e){FAIL++;console.log('  FAIL the gate threw: '+e.stack);}
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);
 })();
}
