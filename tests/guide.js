/* THE SCREEN GUIDES' OWN GATE, 21 November (ui/guide.js).

   What it holds, in a real Chromium at 1600 and at 390:
   - every screen with a guide written shows the circle, and a screen with
     none does not, because a press that opens nothing is a dead button;
   - opening it names only elements that are on the page, by checking every
     listed row's element is shown, and draws one ring per row in view;
   - Escape shuts it;
   - the switch in the profile menu hides the circle on every screen, the
     setting outlives a reload, and the switch brings it back;
   - the card's own "Turn screen guides off" line does the same;
   - under reduced motion the overlay has no transition.
   The screen list is read off GUIDE at run time, so a screen added there is
   walked here with no edit to this file. Run from the repo root. */
const {chromium}=require('playwright');
const path=require('path');
let pass=0, fail=0;
const ok=(c,m)=>{ if(c){pass++; console.log('  ok  '+m);} else {fail++; console.log('  FAIL '+m);} };
const booted=async p=>{ try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:20000}); }catch(e){} };
/* how each guide key is reached. A key with no route here is reported, not
   skipped in silence, so a new screen's guide cannot go untested unnoticed. */
const ROUTE={
 dashboard:()=>{setTab(TAB.STORY); STV.dash=true; stRender(); render();},
 discover:()=>{setTab(TAB.STORY); STV.dash=false; stRender(); render();},
 field:()=>{setTab(TAB.FIELD); render();},
 avatar:()=>{setTab(TAB.INTAKE); if(typeof avSub==='function')avSub('becoming'); render();}};
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROME||chromium.executablePath()});
 for(const [W,H] of [[1600,1000],[390,844]]){
  console.log('\n=== '+W+' ===');
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  await p.goto('file://'+path.resolve('source.html')+'?dev=1'); await booted(p);
  await p.evaluate(()=>{ loadP(3); });
  const shown=()=>p.evaluate(()=>{ const x=document.getElementById('guidebtn'); return !!(x&&!x.hidden&&x.getClientRects().length); });
  const keys=await p.evaluate(()=>Object.keys(GUIDE));
  ok(keys.length>0,'GUIDE carries '+keys.length+' screens: '+keys.join(', '));
  for(const k of keys){
   if(!ROUTE[k]){ ok(false,k+': no route in this gate to reach it'); continue; }
   await p.evaluate('('+ROUTE[k].toString()+')()'); await p.waitForTimeout(500);
   ok(await p.evaluate(()=>guideKey())===k, k+': the screen answers to its own key');
   ok(await shown(), k+': the circle is shown');
   const tb=await p.evaluate(()=>{ const r=document.getElementById('guidebtn').getBoundingClientRect(); return [r.width,r.height]; });
   ok(tb[0]>=44&&tb[1]>=44, k+': the circle is '+tb.map(Math.round).join(' by ')+', at the tap floor');
   await p.click('#guidebtn'); await p.waitForTimeout(300);
   const o=await p.evaluate(()=>({open:GD.open, rows:GD.rows.length,
    listed:GUIDE[GD.key].rows.length,
    allShown:GD.rows.every(r=>document.contains(r.e)&&r.e.getClientRects().length>0),
    pins:[...document.querySelectorAll('#guide .gd-pin:not([hidden])')].length,
    away:[...document.querySelectorAll('#guide .gd-row.gd-away')].length,
    words:[...document.querySelectorAll('#guide .gd-row')].every(x=>x.querySelector('svg')&&x.querySelector('b').textContent.trim()&&x.querySelector('.gd-tx span').textContent.trim())}));
   ok(o.open&&o.rows>0, k+': opens with '+o.rows+' of its '+o.listed+' rows, the rest not on this page');
   ok(o.allShown, k+': every row names an element that is on the page');
   ok(o.pins+o.away===o.rows, k+': '+o.pins+' rings in view and '+o.away+' rows marked out of view, one each');
   ok(o.words, k+': every row has a symbol, a header and a sentence, in that order');
   await p.keyboard.press('Escape'); await p.waitForTimeout(200);
   ok(!(await p.evaluate(()=>GD.open)), k+': Escape shuts it');}
  /* a screen with no guide shows no circle */
  await p.evaluate(()=>{ setTab(TAB.ENERGY); render(); }); await p.waitForTimeout(300);
  const ek=await p.evaluate(()=>guideKey());
  if(!(await p.evaluate(k=>!!GUIDE[k],ek)))ok(!(await shown()), ek+', which has no guide yet: no circle');
  /* the switch */
  await p.evaluate(()=>{ setTab(TAB.FIELD); render(); }); await p.waitForTimeout(300);
  await p.click('#profbtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>{ const x=document.querySelector('[data-pmguide]'); return !!x&&x.getAttribute('aria-checked')==='true'; }),
   'the profile menu carries Screen guides, on by default');
  await p.click('[data-pmguide]'); await p.waitForTimeout(300);
  ok(!(await shown()), 'switched off: the circle is gone');
  for(const k of keys){ if(!ROUTE[k])continue; await p.evaluate('('+ROUTE[k].toString()+')()'); await p.waitForTimeout(200);
   ok(!(await shown()), 'switched off: no circle on '+k); }
  await p.reload(); await booted(p);
  await p.evaluate(()=>{ loadP(3); setTab(TAB.FIELD); render(); }); await p.waitForTimeout(300);
  ok(!(await shown()), 'after a reload the circle stays off: it is a device setting');
  await p.click('#profbtn'); await p.waitForTimeout(300);
  await p.click('[data-pmguide]'); await p.waitForTimeout(300);
  ok(await shown(), 'switched on again: the circle is back');
  await p.click('#guidebtn'); await p.waitForTimeout(300);
  await p.click('[data-gdoff]'); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>GD.open))&&!(await shown()), "the card's own off line shuts it and hides the circle");
  await p.evaluate(()=>guideSwitch(true));
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.click('#guidebtn'); await p.waitForTimeout(200);
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('guide')).transitionDuration)==='0s',
   'reduced motion: the overlay opens with no transition');
  ok(errs.length===0,'no page errors'+(errs.length?': '+errs.join(' | '):''));
  await p.close();}
 await b.close();
 console.log('\n===== '+pass+' passed, '+fail+' failed =====');
 process.exit(fail?1:0);})();
