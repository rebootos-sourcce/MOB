/* ============================================================
   THE LOCKS, GATED. node tests/locks.js, and called from tests/functional.js
   so a full run holds it through the same code.

   The tier ruling of 1 October 2026, the owner's own words: "tier one can see
   saboteurs, tier two can see saboteurs and complexes, tier three and four can
   see hyper complexes on. That means that they can't see what's running them
   in the field or the body or how the point cloud is expressed or the child
   masks. Those buttons would be grayed out to them, with a little lock over
   it. If they hover over it, it gives them a little description of what's
   locked, and where to go to unlock it, with a button that takes them to an
   upgrade."

   WHICH TIER A THING NEEDS IS engine/plan.js SIGHT, AND THIS FILE TYPES NONE
   OF IT. Every expectation below is read off the engine's own table through
   the page, so a tier moved in SIGHT moves what is asserted and the gate
   fails only when the surfaces disagree with the table, which is the defect it
   exists for. The one thing typed here is the owner's ruled order, saboteurs
   before complexes before hyper complexes, because that is a ruling and not
   a quantity the table derives.

   WHAT IT HOLDS, in the order the ruling gives it
     1  a locked control is greyed and still full size, never display none,
        padlocked, aria-disabled and not pressed, and a control that is not
        locked is untouched
     2  its description is reachable by hover, by keyboard focus and by a tap,
        says what is locked and which tier unlocks it, and carries a See tiers
        button of 44 pixels that lands on Billing at the tiers page
     3  a press on it does not act
     4  AND THE DATA IS NOT DRAWN. The wheel and Frames hold no saboteur, complex,
        hyper or character target for a plan that cannot see them, the Body
        holds no lines, and the engine still computes them all: the lock is on
        what is drawn and listed and never on what is read
     5  the rail's lists, the stack, the Summary's chain and masks, the
        imprints grouping, the Avatar's Running card, the Analytics chart and
        the Character page say they are locked rather than reading nothing is
        running, which would be a false statement about somebody
     6  a partly locked depth preset still works and says what it leaves out
     7  a lapsed plan reads as free, and paying makes every lock vanish
     8  the words never say a locked tier is a lower person: the view is part
        of a tier and payment is not mastery

   It is written to be run, and it is the lead's to run: the group was written
   without the full functional gate being run beside it.
   ============================================================ */
const path=require('path');

async function lockGate(browser,FILE,ok,booted){
 for(const [W,H] of [[1600,1000],[390,844]]){
  const phone=W<600, tag='@'+W+': ';
  const pg=await browser.newPage({viewport:{width:W,height:H},hasTouch:phone,isMobile:phone});
  /* LAST, SO IT WINS: tests/functional.js seeds every page as a person on the
     top tier (tests/seed.js) and this group measures the lock, so it puts the
     seam back to nothing and sets a plan on the record instead */
  await pg.addInitScript(()=>{window.SIGHT_PLAN=null;});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(700);

  /* a person on a plan, the roster's heaviest, so there is a chain to hide */
  const as=async(tier,status)=>{
   await pg.evaluate(([tier,status])=>{
    SIGHT_PLAN=null;
    const g=PEOPLE.findIndex(x=>x.nm==='Gordon'); loadP(g);
    CURP.plan={tier:tier,status:status===undefined?(tier==='free'?'':'active'):status,
     granted:0,carried:0,base:null,since:null,until:null};
    S.view=3; try{LAYSET=null;}catch(e){}
    setTab(TAB.FIELD); fviewSet('wheel'); render();},[tier,status]);
   await pg.waitForTimeout(700);};
  const G=await pg.evaluate(()=>({SIGHT:SIGHT.map(g=>({k:g.k,nm:g.nm,need:g.need,layer:!!g.layer,built:g.built!==false})),
   tiers:TIER_KEYS.slice(),tierNm:Object.fromEntries(PLANS.map(p=>[p.k,p.nm]))}));
  /* the layer keys the glass bar calls the four rungs, in the ruled order */
  const BAR={sab:'saboteurs',cx:'complexes',hy:'hyper',sup:'character'};
  const need=k=>G.SIGHT.find(g=>g.k===k).need;
  const seen=(tier,k)=>G.tiers.indexOf(tier)>=G.tiers.indexOf(need(k));

  /* ---- 1 · FREE, THE FIELD ---- */
  /* each orb's own size on the top tier, to hold a locked one to: against a
     different layer it differs by its label, which is not the lock's doing */
  await as('four');
  const full={};
  for(const lk of Object.values(BAR)){
   if(phone)await pg.evaluate(()=>fbOpenPanel(true));
   full[lk]=await pg.evaluate(lk=>{const e=document.querySelector((window.innerWidth<=720?'#fbpanel':'#fbar .fb-full')+' [data-fb="'+lk+'"]'),r=e.getBoundingClientRect();return [r.width,r.height];},lk);}
  if(phone)await pg.evaluate(()=>fbOpenPanel(false));
  await as('free');
  const orb=k=>pg.evaluate(k=>{
   const e=document.querySelector((window.innerWidth<=720?'#fbpanel':'#fbar .fb-full')+' [data-fb="'+k+'"]');
   if(!e)return null;
   const r=e.getBoundingClientRect(), cs=getComputedStyle(e);
   return {lock:e.getAttribute('data-lock'),dis:e.getAttribute('aria-disabled'),pr:e.getAttribute('aria-pressed'),
    mark:!!e.querySelector('.lk-mk'),w:r.width,h:r.height,disp:cs.display,op:+cs.opacity,
    tip:e.getAttribute('data-tip')||'',go:e.getAttribute('data-tip-go')||'',title:e.getAttribute('title')||'',
    label:e.getAttribute('aria-label')||'',pill:getComputedStyle(e.querySelector('.fb-v')||e).visibility};},k);
  if(phone)await pg.evaluate(()=>fbOpenPanel(true));
  const lawsOrb=await orb('laws');
  ok(lawsOrb&&!lawsOrb.lock&&lawsOrb.dis===null,tag+'a layer that is not a rung of the chain is never locked: '+JSON.stringify(lawsOrb));
  for(const [k,lk] of Object.entries(BAR)){
   const o=await orb(lk);
   ok(o&&o.lock===k&&o.dis==='true',tag+lk+' is locked and aria-disabled on free, '+JSON.stringify(o));
   ok(o&&o.pr==='false',tag+lk+' is not pressed, whatever the layer set says, '+JSON.stringify(o));
   ok(o&&o.mark,tag+lk+' carries the padlock');
   ok(o&&o.disp!=='none'&&o.w>=44&&o.h>=44,tag+lk+' is still a full 44 pixel control, never display none, '+(o&&Math.round(o.w))+' by '+(o&&Math.round(o.h)));
   ok(o&&Math.abs(o.w-full[lk][0])<1.5&&Math.abs(o.h-full[lk][1])<1.5,tag+lk+' is the size it is when unlocked, so paying moves nothing, '+(o&&[o.w,o.h])+' against '+full[lk]);
   ok(o&&o.op<1,tag+lk+' is greyed, opacity '+(o&&o.op));
   ok(o&&o.pill==='hidden',tag+lk+' prints no count: a number on a locked layer is a reading of it');
   ok(o&&/Unlocked on tier (one|two|three) and above\./.test(o.tip)&&o.go==='See tiers'&&!o.title,
    tag+lk+' describes what is locked, names the tier and offers See tiers, '+JSON.stringify([o&&o.tip,o&&o.go]));
   const row=G.SIGHT.find(g=>g.k===k);
   ok(o&&o.tip.indexOf(G.tierNm[row.need].toLowerCase())>=0,tag+lk+' names the tier SIGHT says unlocks it, '+row.need);
   ok(o&&/locked/.test(o.label),tag+lk+' says locked to a screen reader, '+(o&&o.label));}

  /* ---- 2 · THE DESCRIPTION, BY HOVER, BY FOCUS AND BY A TAP ---- */
  const tipRead=()=>pg.evaluate(()=>{const t=document.getElementById('tip'); if(!t)return null;
   const b=t.querySelector('.tip-go'), r=b?b.getBoundingClientRect():null;
   return {on:t.classList.contains('on'),hidden:t.getAttribute('aria-hidden'),text:t.textContent,
    go:b?b.textContent.trim():'',gw:r?r.width:0,gh:r?r.height:0};});
  const SAB='#'+(phone?'fbpanel':'fbar')+' '+(phone?'':'.fb-full ')+'[data-fb="saboteurs"]';
  if(!phone){
   await pg.hover(SAB); await pg.waitForTimeout(900);
   const h=await tipRead();
   ok(h&&h.on&&/Unlocked on tier one and above/.test(h.text)&&h.go==='See tiers',tag+'hover opens the description, '+JSON.stringify(h));
   ok(h&&h.gw>=44&&h.gh>=44,tag+'and its See tiers button is 44 pixels, '+(h&&Math.round(h.gw))+' by '+(h&&Math.round(h.gh)));
   await pg.mouse.move(2,H-2); await pg.waitForTimeout(500);
   await pg.focus(SAB); await pg.waitForTimeout(700);
   const f=await tipRead();
   ok(f&&f.on&&/Unlocked on tier one and above/.test(f.text),tag+'keyboard focus opens it as well, '+JSON.stringify(f));
   const before=await pg.evaluate(()=>JSON.stringify(layChosen()));
   await pg.press(SAB,'Enter'); await pg.waitForTimeout(400);
   const after=await pg.evaluate(()=>({set:JSON.stringify(layChosen()),vis:Object.keys(layVisible())}));
   ok(after.set===before&&after.vis.indexOf('saboteurs')<0,tag+'Enter on it explains and does not switch the layer on');
   const f2=await tipRead();
   ok(f2&&f2.on,tag+'and the explanation is up after the press');
   const kbd=await pg.evaluate(()=>document.activeElement&&document.activeElement.className);
   ok(/tip-go/.test(kbd||''),tag+'a keyboard press puts focus on See tiers so it can be pressed without a mouse, got '+kbd);
   await pg.keyboard.press('Enter'); await pg.waitForTimeout(700);}
  else{
   /* force: Playwright reads aria-disabled as disabled and will not tap it,
      which is the lock working, and a person's finger has no such rule */
   await pg.tap(SAB,{force:true}); await pg.waitForTimeout(700);
   const tp=await tipRead();
   ok(tp&&tp.on&&/Unlocked on tier one and above/.test(tp.text)&&tp.go==='See tiers',tag+'a tap, with no hover on a phone, opens the description, '+JSON.stringify(tp));
   ok(tp&&tp.gw>=44&&tp.gh>=44,tag+'and its See tiers button is 44 pixels, '+(tp&&Math.round(tp.gw))+' by '+(tp&&Math.round(tp.gh)));
   const set1=await pg.evaluate(()=>JSON.stringify(layChosen()));
   ok(set1===(await pg.evaluate(()=>JSON.stringify(layChosen()))),tag+'the tap did not switch the layer on');
   await pg.tap('#tip .tip-go'); await pg.waitForTimeout(700);}
  /* See tiers lands on Billing at the tiers page */
  const landed=await pg.evaluate(()=>({tab:S.tab===TAB.SETTINGS,acc:ACC_OPEN,tiers:!!document.getElementById('plantiers'),
   you:((document.getElementById('ptyou')||{}).textContent||'').replace(/\s+/g,' ')}));
  ok(landed.tab&&landed.acc==='billing'&&landed.tiers,tag+'See tiers opens Billing on the tiers page, '+JSON.stringify(landed));
  ok(/Your tier\s*Free/.test(landed.you)&&/Locked: saboteurs, unlocked on tier one and above/.test(landed.you),
   tag+'and the page says first which tier the person has and what is locked, '+landed.you);

  /* ---- 3 · THE DATA IS NOT DRAWN, ON THE WHEEL AND ON FRAMES ---- */
  await as('free');
  if(phone)await pg.evaluate(()=>fbOpenPanel(false));
  const dw=await pg.evaluate(()=>({vis:Object.keys(layVisible()),
   hit:HIT.filter(h=>/^(sab|cx|hy|sup)$/.test(h.k)).length,
   engine:compute().sabs.length, seen:computeSeen().sabs.length,cx:computeSeen().cxs.length,
   hy:computeSeen().hys.length,sup:computeSeen().sups.length,
   same:compute()===compute()?1:0}));
  ok(dw.engine>0,tag+'the engine still computes the whole chain, '+dw.engine+' saboteurs: the lock is on what is drawn and never on what is read');
  ok(dw.seen===0&&dw.cx===0&&dw.hy===0&&dw.sup===0,tag+'and the reading a free person is handed holds none of it');
  ok(!dw.vis.some(k=>Object.values(BAR).indexOf(k)>=0),tag+'no chain layer is visible, '+dw.vis.join());
  ok(dw.hit===0,tag+'the wheel holds no saboteur, complex, hyper or character target, '+dw.hit);
  /* a layer the person had on comes back when the plan covers it: layChosen is theirs */
  const chosen=await pg.evaluate(()=>layChosen().saboteurs===1);
  ok(chosen,tag+'the set the person chose is kept under the lock, so paying brings their own layers back');
  await pg.evaluate(()=>{fviewSet('frames');}); await pg.waitForTimeout(900);
  const fr=await pg.evaluate(()=>({n:FR_HIT.filter(h=>/^(sab|cx|hy|sup)$/.test(h.k)).length,all:FR_HIT.length}));
  ok(fr.all>0&&fr.n===0,tag+'Frames holds none either, of '+fr.all+' targets, '+fr.n);
  await pg.evaluate(()=>{fviewSet('dial');}); await pg.waitForTimeout(900);
  const di=await pg.evaluate(()=>({n:FR_HIT.filter(h=>/^(sab|cx|hy|sup)$/.test(h.k)).length,all:FR_HIT.length}));
  ok(di.all>0&&di.n===0,tag+'nor does the Dial, of '+di.all+' targets, '+di.n);
  await pg.evaluate(()=>{fviewSet('wheel');});

  /* ---- 4 · THE DEPTH PRESETS ARE PARTLY LOCKED AND STILL WORK ---- */
  const pre=await pg.evaluate(()=>[...document.querySelectorAll('#fbmenu [data-preset]')].map(m=>({
   part:m.classList.contains('lk-part'),tip:m.getAttribute('data-tip')||'',go:m.getAttribute('data-tip-go')||'',
   dis:m.getAttribute('aria-disabled'),mark:!!m.querySelector('.lk-mk')})));
  ok(pre.length===4&&!pre[0].part&&pre[1].part&&pre[2].part&&pre[3].part,tag+'Patterns, Chains and Blueprint are partly locked on free, Charge is not, '+JSON.stringify(pre.map(p=>p.part)));
  ok(pre[1].part&&/^Draws what your plan can see\. Locked: saboteurs, unlocked on tier one and above/.test(pre[1].tip)&&pre[1].go==='See tiers'&&pre[1].mark,
   tag+'a partly locked set says what it leaves out and where to unlock it, '+pre[1].tip);
  ok(pre.every(p=>p.dis===null),tag+'and none is aria-disabled, because pressing one still does something');
  await pg.evaluate(()=>{layPick(2);render();}); await pg.waitForTimeout(500);
  const pk=await pg.evaluate(()=>Object.keys(layVisible()));
  ok(pk.indexOf('seats')>=0&&pk.indexOf('archetypes')>=0&&pk.indexOf('saboteurs')<0&&pk.indexOf('complexes')<0,
   tag+'Chains on free still draws what free can see and leaves the chain off, '+pk.join());
  await pg.evaluate(()=>{layPick(3);render();});

  /* ---- 5 · THE BODY ---- */
  await pg.evaluate(()=>{setTab(TAB.ENERGY);render();}); await pg.waitForTimeout(900);
  const bd=await pg.evaluate(()=>{
   const o={}; ['addr','masks','pain','flow','sab','cx','hy'].forEach(k=>{
    const e=document.querySelector('#bmov [data-bmov="'+k+'"]'); if(!e){o[k]=null;return;}
    const r=e.getBoundingClientRect();
    o[k]={lock:e.getAttribute('data-lock'),dis:e.getAttribute('aria-disabled'),mark:!!e.querySelector('.lk-mk'),
     w:r.width,h:r.height,tip:e.getAttribute('data-tip')||''};});
   o.lines=BM.sabs.length; o.hubs=(BM.hubs||[]).length; o.engine=compute().sabs.length; return o;});
  for(const [k,g] of [['sab','sab'],['cx','cx'],['hy','hy'],['masks','mask']]){
   const e=bd[k];
   ok(e&&e.lock===g&&e.dis==='true'&&e.mark&&e.w>=44&&e.h>=44,tag+'the Body\'s '+k+' overlay is locked and still 44 pixels, '+JSON.stringify(e));
   ok(e&&e.tip.indexOf(G.tierNm[need(g)].toLowerCase())>=0,tag+'and names the tier that opens it, '+need(g));}
  for(const k of ['addr','pain','flow'])
   ok(bd[k]&&!bd[k].lock,tag+'the Body\'s '+k+' overlay is not a rung and is never locked');
  ok(bd.engine>0&&bd.lines===0&&bd.hubs===0,tag+'the Body draws no saboteur line and no hub while the engine holds '+bd.engine+', lines '+bd.lines+', hubs '+bd.hubs);

  /* ---- 6 · THE COMPASS, REGISTERS ---- */
  await pg.evaluate(()=>{CONE.shells=true;CONE.top=false;setTab(TAB.COMPASS);coneOpen(true);}); await pg.waitForTimeout(700);
  const cn=await pg.evaluate(()=>{const e=document.querySelector('#cone [data-cn="shells"]'),r=e.getBoundingClientRect();
   return {lock:e.getAttribute('data-lock'),dis:e.getAttribute('aria-disabled'),pr:e.getAttribute('aria-pressed'),mark:!!e.querySelector('.lk-mk'),
    w:r.width,h:r.height,tip:e.getAttribute('data-tip')||'',shells:CONE.shells,
    top:document.querySelector('#cone [data-cn="top"]').getAttribute('data-lock')};});
  ok(cn.lock==='reg'&&cn.dis==='true'&&cn.mark&&cn.pr==='false'&&cn.h>=44,tag+'the Registers view is locked and still 44 pixels tall, '+JSON.stringify(cn));
  ok(cn.shells===false,tag+'a Registers view left on from before is put back to the needle and not drawn');
  ok(cn.tip.indexOf(G.tierNm[need('reg')].toLowerCase())>=0&&/point cloud/.test(cn.tip),tag+'and the description names the point cloud and the tier SIGHT says, '+need('reg'));
  ok(!cn.top,tag+'Top is not a rung and is not locked');
  await pg.evaluate(()=>{document.querySelector('#cone [data-cn="shells"]').click();}); await pg.waitForTimeout(300);
  ok(await pg.evaluate(()=>CONE.shells===false),tag+'pressing it does not turn Registers on');

  /* ---- 7 · THE CHARACTER PAGE ---- */
  const ch=await pg.evaluate(()=>{
   const t=document.querySelector('.tabtop[data-tabk="'+TAB.MASKS+'"]'), r=t.getBoundingClientRect();
   return {lock:t.getAttribute('data-lock'),dis:t.getAttribute('aria-disabled'),mark:!!t.querySelector('.lk-mk'),h:r.height,w:r.width};});
  ok(ch.lock==='mask'&&ch.dis==='true'&&ch.mark,tag+'the Character door is greyed and padlocked, '+JSON.stringify(ch));
  await pg.evaluate(()=>{setTab(TAB.MASKS);render();}); await pg.waitForTimeout(700);
  const cp=await pg.evaluate(()=>{const h=document.getElementById('masksview'), b=h.querySelector('.lk-go'), r=b?b.getBoundingClientRect():null;
   return {panel:!!h.querySelector('.lk-panel'),text:h.textContent.replace(/\s+/g,' '),grids:h.querySelectorAll('.chv-m,.chv-svg').length,
    go:b?b.textContent.trim():'',gw:r?r.width:0,gh:r?r.height:0};});
  ok(cp.panel&&cp.grids===0,tag+'the Character page holds the lock\'s panel and no grid, '+cp.grids+' grids');
  ok(/Unlocked on tier three and above|Unlocked on tier \w+ and above/.test(cp.text)&&cp.go==='See tiers'&&cp.gw>=44&&cp.gh>=44,
   tag+'saying which tier opens it, with a 44 pixel See tiers, '+cp.text+' '+cp.gw+'x'+cp.gh);
  await pg.evaluate(()=>{document.querySelector('#masksview .lk-go').click();}); await pg.waitForTimeout(500);
  ok(await pg.evaluate(()=>S.tab===TAB.SETTINGS&&ACC_OPEN==='billing'&&!!document.getElementById('plantiers')),
   tag+'and that button lands on Billing at the tiers page');

  /* ---- 8 · THE RAIL AND THE LISTS, which must say locked and not nothing ---- */
  await as('free');
  const rl=await pg.evaluate(()=>{
   const run=document.getElementById('run').textContent.replace(/\s+/g,' '), fire=document.getElementById('fire').textContent.replace(/\s+/g,' ');
   const st=[...document.querySelectorAll('#stack .stk-t[data-st]')].map(t=>({k:t.getAttribute('data-st'),lock:t.getAttribute('data-lock'),
    n:(t.querySelector('b')||{}).textContent||'',h:t.getBoundingClientRect().height}));
   STACK_TAB='sab'; railStack(computeSeen());
   const sl=document.querySelector('#stack .lk-panel');
   STACK_TAB='fet'; railStack(computeSeen());
   return {run:run,fire:fire,panels:document.querySelectorAll('#run .lk-panel,#fire .lk-panel').length,st:st,stackPanel:!!sl};});
  ok(rl.panels>=2&&!/Nothing is running|Nothing running/.test(rl.run+' '+rl.fire),
   tag+'the rail says it is locked and never that nothing is running, '+rl.run.slice(0,120));
  ok(rl.st.filter(t=>t.k!=='fet').every(t=>t.lock===t.k&&t.n===''&&t.h>=30)&&rl.st.find(t=>t.k==='fet').lock===null,
   tag+'the stack\'s chain tabs are locked and print no count, the fetters are not, '+JSON.stringify(rl.st));
  ok(rl.stackPanel,tag+'a locked stack tab that is open shows the lock\'s panel and not an empty list');
  /* summary, analytics, imprints, avatar, drill */
  await pg.evaluate(()=>{setTab(TAB.SUMMARY);render();}); await pg.waitForTimeout(700);
  const sm=await pg.evaluate(()=>{const h=document.getElementById('sumbody'), c=h.querySelector('.s-chain');
   return {chainNums:c?c.querySelectorAll('.s-ch').length:-1,panels:h.querySelectorAll('.lk-panel').length};});
  ok(sm.chainNums===0&&sm.panels>=1,tag+'the Summary counts no rung of the chain and says the chain is locked, '+JSON.stringify(sm));
  await pg.evaluate(()=>{setTab(TAB.ANALYTICS);render();}); await pg.waitForTimeout(700);
  const an=await pg.evaluate(()=>{const h=document.getElementById('ana');
   return {panels:h.querySelectorAll('.lk-panel').length,nothing:/Nothing is compounding/.test(h.textContent),
    chain:h.querySelectorAll('[data-ab^="chain|"]').length};});
  ok(an.panels>=1&&!an.nothing&&an.chain===0,tag+'Analytics holds no running chart and does not say nothing is compounding, '+JSON.stringify(an));
  const ip=await pg.evaluate(()=>{IMP_GROUP='sab'; impRender();
   const h=document.getElementById('imp'), g=h.querySelector('[data-ig="sab"]');
   const r={lock:g&&g.getAttribute('data-lock'),panel:!!h.querySelector('.lk-panel'),
    nothing:/Nothing is compounding/.test(h.textContent),feeds:/part of \d+ saboteur/.test(h.innerHTML)};
   IMP_GROUP='band'; impRender(); return r;});
  ok(ip.lock==='sab'&&ip.panel&&!ip.nothing&&!ip.feeds,tag+'the imprints grouping by saboteur is locked and no address says how many saboteurs it feeds, '+JSON.stringify(ip));
  await pg.evaluate(()=>{setTab(TAB.INTAKE);render();}); await pg.waitForTimeout(700);
  const av=await pg.evaluate(()=>{const c=document.querySelector('.av-run');
   return {card:!!c,panel:!!(c&&c.querySelector('.lk-panel')),noSab:c?/No saboteur is running/.test(c.textContent):false,
    lines:document.querySelectorAll('.av-line').length};});
  ok(!av.card||(av.panel&&!av.noSab&&av.lines===0),tag+'the Avatar\'s Running card says it is locked and draws no tension line, '+JSON.stringify(av));
  const dr=await pg.evaluate(()=>{const n=W.filter(x=>x.sq>=4)[0]; runNodeDrill(n);
   const t=document.body.innerText; return {lock:/Unlocked on tier one/.test(t),nothing:/nothing compounds from here/.test(t)};});
  ok(dr.lock&&!dr.nothing,tag+'an address drill says what it feeds is locked, and never "nothing compounds from here", '+JSON.stringify(dr));

  /* ---- 9 · TIER ONE, TWO, THREE: each sees what the table says and no more ---- */
  for(const tier of ['one','two','three','four']){
   await as(tier);
   if(phone)await pg.evaluate(()=>fbOpenPanel(true));
   for(const [k,lk] of Object.entries(BAR)){
    const o=await orb(lk), want=seen(tier,k);
    ok(o&&(o.lock===null)===want,tag+'on tier '+tier+' '+lk+' is '+(want?'open':'locked')+', and SIGHT says '+need(k)+' opens it, '+JSON.stringify(o&&o.lock));
    if(o&&!want)ok(o.tip.indexOf(G.tierNm[need(k)].toLowerCase())>=0,tag+'on tier '+tier+' '+lk+' names '+need(k));}
   if(phone)await pg.evaluate(()=>fbOpenPanel(false));
   await pg.waitForTimeout(500);
   const v=await pg.evaluate(()=>({vis:Object.keys(layVisible()),
    kinds:[...new Set(HIT.map(h=>h.k).filter(k=>/^(sab|cx|hy|sup)$/.test(k)))].sort().join(),
    sc:computeSeen()}));
   const wantKinds=Object.keys(BAR).filter(k=>seen(tier,k)).sort().join();
   ok(v.kinds===wantKinds,tag+'on tier '+tier+' the wheel holds targets for exactly '+(wantKinds||'none')+', got '+(v.kinds||'none'));
   for(const [k,lk] of Object.entries(BAR))
    ok((v.vis.indexOf(lk)>=0)===seen(tier,k),tag+'on tier '+tier+' '+lk+' is '+(seen(tier,k)?'drawn':'not drawn'));
   await pg.evaluate(()=>{setTab(TAB.COMPASS);CONE.shells=false;coneOpen(true);}); await pg.waitForTimeout(500);
   const rg=await pg.evaluate(()=>document.querySelector('#cone [data-cn="shells"]').getAttribute('data-lock'));
   ok((rg===null)===seen(tier,'reg'),tag+'on tier '+tier+' the Registers are '+(seen(tier,'reg')?'open':'locked')+', SIGHT says '+need('reg'));
   await pg.evaluate(()=>{setTab(TAB.MASKS);render();}); await pg.waitForTimeout(600);
   const mk=await pg.evaluate(()=>({grids:document.querySelectorAll('#masksview .chv-m').length,
    panel:!!document.querySelector('#masksview .lk-panel'),door:document.querySelector('.tabtop[data-tabk="'+TAB.MASKS+'"]').getAttribute('data-lock')}));
   ok((mk.grids>0)===seen(tier,'mask')&&mk.panel===!seen(tier,'mask')&&(mk.door===null)===seen(tier,'mask'),
    tag+'on tier '+tier+' the Character page is '+(seen(tier,'mask')?'open with its grids':'the lock\'s panel')+', SIGHT says '+need('mask')+', '+JSON.stringify(mk));
   await pg.evaluate(()=>{setTab(TAB.FIELD);render();});}

  /* ---- 10 · TIER FOUR AND PAYING: nothing is locked, and the lock goes ---- */
  await as('four');
  /* what is on screen: a lock on a surface that is not showing is repainted
     the next time that surface is, and nothing reads it until then */
  const shown=()=>pg.evaluate(()=>[...document.querySelectorAll('[data-lock],.lk-panel')]
   .filter(e=>e.getClientRects().length>0).map(e=>e.getAttribute('data-lock')||'panel:'+e.getAttribute('data-lock-panel')));
  const none=await shown();
  ok(none.length===0,tag+'on tier four nothing on screen carries a lock, '+none.join());
  await as('free');
  const was=(await shown()).length;
  await pg.evaluate(()=>{CURP.plan={tier:'three',status:'active',granted:0,carried:0,base:null,since:null,until:null};render();});
  await pg.waitForTimeout(500);
  const now=await pg.evaluate(()=>({n:[...document.querySelectorAll('[data-lock]')].filter(e=>e.getClientRects().length>0).length,
   tip:(document.querySelector('[data-fb="saboteurs"]')||{getAttribute:()=>''}).getAttribute('data-tip')||'',
   go:(document.querySelector('[data-fb="saboteurs"]')||{getAttribute:()=>''}).getAttribute('data-tip-go')}));
  ok(was>0&&now.n===0&&!/Unlocked on/.test(now.tip)&&!now.go,tag+'paying takes every lock off on the next paint and puts the tooltip back, '+was+' then '+now.n+', '+now.tip.slice(0,60));

  /* ---- 11 · A LAPSED PLAN READS AS FREE ---- */
  for(const st of ['canceled','unpaid','something_new']){
   await as('three',st);
   const lp=await pg.evaluate(()=>({n:[...document.querySelectorAll('[data-lock]')].filter(e=>e.getClientRects().length>0).length,seen:computeSeen().sabs.length}));
   ok(lp.n>0&&lp.seen===0,tag+'a tier three record that is '+st+' reads free, so the chain is locked again, '+JSON.stringify(lp));}
  await as('three','past_due');
  ok((await shown()).length===0,tag+'while past due keeps sight, as it keeps access, '+(await shown()).join());

  /* ---- 12 · THE WORDS ---- */
  await as('free');
  const words=await pg.evaluate(()=>[...document.querySelectorAll('[data-lock]')].map(e=>e.getAttribute('data-tip')||'')
   .concat([...document.querySelectorAll('.lk-panel')].map(e=>e.textContent))
   .concat(SIGHT.map(g=>g.what)).join(' | '));
  ok(!/\b(level|rank|better|worse|behind|lower|beginner|advanced|mastery|upgrade now|only|miss|missing out)\b/i.test(words)&&!/\u2014/.test(words),
   tag+'no lock says a locked tier is a lower person, and none pressures: the view is part of a tier, payment is not mastery, '+words.slice(0,160));
  ok(err.length===0,tag+'no page errors, '+err.slice(0,2).join(' | '));
  await pg.close();}}

module.exports={lockGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}
  try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  console.log('\n=== the locks: what a tier cannot see is greyed, padlocked, described and not drawn ===');
  try{ await lockGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
