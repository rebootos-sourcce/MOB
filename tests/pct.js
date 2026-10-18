/* ============================================================
   THE PERCENT IS THE FILL. Percent phase 2, 17 October.

   His words, 16 October: "Instead of 0.0, site wide, we need to convert those
   numbers into percent. I think it's a more natural language for people to
   understand." And the rule the framework drew from it
   (HANDOFF-2026-10-15/PERCENT-FRAMEWORK-2026-10-16.md): the percent printed
   for a quantity is the fill of the ring or bar drawn for that same quantity,
   so what is read and what is drawn can never disagree.

   tests/engine.js holds the formula, pct and fmtPct in engine/pct.js. This
   holds the screen, in a real Chromium, in three parts.

     F  THE FILL. Every ring, badge, glass bar pill and rail bar on every
        surface TABDEF and TABEXTRA name, at 1600 and at 390, on a blank
        profile and on loaded worked examples: where the pill prints N%, N is
        the arc's own fill, within one for the rounding. It reads the arc off
        the drawing (stroke-dashoffset against stroke-dasharray), never off
        the code, so a renderer that fills one figure and prints another
        fails here by name. The inventory found three that did.
     A  NO ALARM ON A PERCENT. A ring printing a percent is never in the
        alarm state, the default the team took on 17 October and wrote in
        DECISIONS.md as his to overrule: red on a percent reads as a failed
        mark, and nothing here sets out to give one.
     S  THE SLICES. Each surface phase 2 has moved prints the registry's own
        form, read against fmtPct off the same compute(), and prints no bare
        decimal where a score stood. A surface joins this list in the change
        that moves it, so the list is the record of what has moved.

   It walks with reduced motion, so every ring is at its value the frame it
   is written and the count up tween in ui/component.js never stands between
   the pill and the arc. Run against the build before slice 1 it fails on the
   glass bar's two weights (drawn 44, printed 4), the CQ and DQ figures and
   the rail's 0.17; checked that way first, because a gate that has never
   failed has not been shown to look.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const J=JSON.stringify;
const booted=async p=>{
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000});}catch(e){}
 try{await p.waitForTimeout(600);
  await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
  await p.waitForTimeout(120);}catch(e){}};

/* every reading on the page that draws a fill and prints a figure, as
   {where, fill, text, alarm}. The release overlay is left out: its results
   and its rings are being rebuilt by another seat, and its percent items are
   listed for that seat in the strategy for this phase. */
const READ=`(function(){
 var out=[];
 function vis(e){return !!(e.offsetParent||e.getClientRects().length);}
 function where(e){var h=e.closest('[id]');return (h?'#'+h.id:'?')+' '+((e.getAttribute('title')||e.textContent||'').trim().slice(0,40));}
 function arcFill(c){if(!c)return null;
  var C=parseFloat(c.getAttribute('stroke-dasharray')), off=parseFloat(c.getAttribute('stroke-dashoffset'));
  if(!(C>0)||!isFinite(off))return null; return 100*(1-off/C);}
 document.querySelectorAll('.cr,.crb').forEach(function(e){
  if(!vis(e)||e.closest('#rel'))return;
  var c=e.querySelector('svg.arc circle:last-child,svg.crb-a circle:last-child');
  var v=e.querySelector(':scope > .v,:scope > .crb-v');
  if(!v)return;
  var st=c?getComputedStyle(c).stroke:'';
  out.push({kind:'ring',where:where(e),fill:arcFill(c),text:v.textContent.trim(),
   alarm:e.classList.contains('hot')||/rgb\\(\\s*255,\\s*(46|21),\\s*(31|0)\\s*\\)|rgb\\(\\s*212,\\s*18,\\s*0\\s*\\)/.test(st)});});
 document.querySelectorAll('#fbar [data-fb]').forEach(function(b){
  if(!vis(b))return; var val=b.querySelector('.val'), v=b.querySelector('.fb-v'); if(!val||!v)return;
  out.push({kind:'pill',where:'#fbar '+b.getAttribute('data-fb'),fill:parseFloat(val.getAttribute('stroke-dasharray')),
   text:v.textContent.trim(),alarm:false});});
 document.querySelectorAll('.rbar').forEach(function(b){
  if(!vis(b))return; var v=b.querySelector('.rb-v'); if(!v)return;
  out.push({kind:'bar',where:'.rbar '+(b.getAttribute('data-q')||'')+' '+((b.querySelector('.rb-n')||{}).textContent||''),
   fill:b.classList.contains('off')?0:parseFloat(b.getAttribute('data-w')),text:v.textContent.trim(),alarm:false});});
 return out;})()`;

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 require('./net.js').guardBrowser(browser);
 const people=['', 'Marcus', 'James', 'Diane'];
 for(const [W,H] of [[1600,1000],[390,844]]){
  const page=await browser.newPage({viewport:{width:W,height:H},reducedMotion:'reduce'});
  await page.addInitScript(require('./seed.js').FULL_SIGHT);
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  /* the wheel's core is a canvas, so its figure is read off fillText */
  await page.evaluate(()=>{window.__FT=[];var f=CanvasRenderingContext2D.prototype.fillText;
   CanvasRenderingContext2D.prototype.fillText=function(t){try{window.__FT.push(String(t));}catch(e){} return f.apply(this,arguments);};});
  const tabs=await page.evaluate(()=>TABDEF.map(t=>[t.nm,t.k]).concat(Object.keys(TABEXTRA).map(k=>[TABEXTRA[k].nm,TABEXTRA[k].k])));
  let seen=0, pctSeen=0;
  for(const who of people){
   const tag=W+' '+(who||'blank')+': ';
   for(const [nm,k] of tabs){
    await page.evaluate(([who,k])=>{
     const i=who?PEOPLE.findIndex(x=>x.nm===who):0; loadP(i<0?0:i); setTab(k); render();},[who,k]);
    await page.waitForTimeout(260);
    const rows=await page.evaluate(READ);
    seen+=rows.length;
    for(const x of rows){
     const m=/^(\d+)%$/.exec(x.text);
     if(!m)continue; pctSeen++;
     /* F: the printed percent is the arc's own fill */
     ok(x.fill!==null&&Math.abs(+m[1]-x.fill)<=1,
      'F: '+tag+nm+', '+x.kind+' '+J(x.where)+' prints '+x.text+' over a fill of '+(x.fill===null?'nothing':x.fill.toFixed(1)));
     /* A: and it is never in the alarm state */
     ok(!x.alarm,'A: '+tag+nm+', '+x.kind+' '+J(x.where)+' prints '+x.text+' in the alarm colour');}}
  }
  console.log('  '+W+': '+seen+' readings with a fill read across '+tabs.length+' surfaces, '+pctSeen+' of them printing a percent');
  ok(pctSeen>0,'F: '+W+': the walk found percents to check, so it is looking at something');

  /* ---------- S, slice 1: the shared ring and the Field's headline ---------- */
  for(const who of ['Marcus','James','Diane']){
   const tag=W+' '+who+': ';
   const s=await page.evaluate(async who=>{
    loadP(PEOPLE.findIndex(x=>x.nm===who)); setTab(TAB.FIELD); window.__FT=[]; render();
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const R=compute(), t=q=>{const e=document.querySelector(q); return e?e.textContent.trim():null;};
    const aff=(R.aff||[]).map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v), top=aff[0]||{i:0};
    const pair=Array.from(document.querySelectorAll('#key .rb2-v')).map(e=>e.textContent.trim());
    const dock={}; document.querySelectorAll('#keylo .rbar').forEach(b=>{dock[(b.querySelector('.rb-n')||{}).textContent.trim()]=(b.querySelector('.rb-v')||{}).textContent.trim();});
    const node=Array.from(document.querySelectorAll('.cr,.crb')).filter(e=>/ seat\. /.test(e.getAttribute('title')||''))
     .map(e=>(e.querySelector('.v,.crb-v')||{}).textContent||'');
    const pol=t('#pol2 .pol2-c');
    return {unread:!!R.unread,
     got:{laws:t('#fbar [data-fb=laws] .fb-v'),shadow:t('#fbar [data-fb=shadow] .fb-v'),addresses:t('#fbar [data-fb=addresses] .fb-v'),
      seats:t('#fbar [data-fb=seats] .fb-v'),archetypes:t('#fbar [data-fb=archetypes] .fb-v'),ring:t('#railtop .cr .v'),
      cq:pair[0],dq:pair[1],vit:dock.Vitality,flow:dock.Flow,acc:t('#acc .cr .v'),pol:pol},
     want:{laws:fmtPct('cq',R.CQ),shadow:fmtPct('dq',R.DQ),addresses:fmtPct('weight',R.SQm),seats:fmtPct('weight',R.darkV||0),
      archetypes:fmtPct('archetype',archExpr(top.i)),ring:fmtPct('cq',R.CQ),cq:fmtPct('cq',R.CQ),dq:fmtPct('dq',R.DQ),
      vit:fmtPct('vitality',R.X),flow:fmtPct('flow',flSpeed()),acc:fmtPct('accuracy',accuracy(R).pct),pol:pol===null?null:fmtPct('cq',R.CQ)},
     node:node, core:window.__FT.indexOf(fmtPct('cq',R.CQ))>=0||Array.from(document.querySelectorAll('.frcq text')).some(e=>e.textContent.indexOf(fmtPct('cq',R.CQ))>=0)};},who);
   ok(!s.unread,'S1: '+tag+'the example reads');
   for(const k of Object.keys(s.want)){
    if(s.got[k]===null&&(k==='acc'||k==='pol'||k==='vit'||k==='flow'))continue;
    ok(s.got[k]===s.want[k],'S1: '+tag+k+' prints the registry\'s form, '+J(s.got[k])+' against '+J(s.want[k]));}
   ok(s.node.length>0&&s.node.every(v=>/^(\d+%|–)$/.test(v)),'S1: '+tag+'every address ring prints a percent or the dash, '+J(s.node.slice(0,6)));
   ok(Object.values(s.got).concat(s.node).every(v=>v===null||!/^\d+\.\d+$/.test(v)),'S1: '+tag+'no bare decimal is left on the Field\'s readings');
   ok(s.core,'S1: '+tag+'the wheel\'s core draws CQ as the registry prints it');
  }
  /* and an unread profile prints the dash in every one of them, never 0% */
  const u=await page.evaluate(async()=>{loadP(0); setTab(TAB.FIELD); render();
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const t=q=>{const e=document.querySelector(q); return e?e.textContent.trim():null;};
   return {unread:!!compute().unread,v:[t('#fbar [data-fb=laws] .fb-v'),t('#fbar [data-fb=shadow] .fb-v'),t('#railtop .cr .v')]
    .concat(Array.from(document.querySelectorAll('#key .rb2-v,#keylo .rb-v')).map(e=>e.textContent.trim()))};});
  ok(u.unread&&u.v.length>=5&&u.v.every(v=>v===null||v==='–'),'S1: '+W+' blank: an unread field prints the dash everywhere, '+J(u.v));
  ok(errs.length===0,'no page error at '+W+': '+errs.slice(0,3).join(' | '));
  await page.close();
 }

 /* A, the mechanism: a ring past ninety printing a percent draws its own
    colour, and one printing anything else keeps the alarm law. Both halves,
    so this passes because the rule is kept and not because the colour died. */
 {
  const page=await browser.newPage({viewport:{width:1600,height:1000}});
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  const a=await page.evaluate(()=>{
   const d=document.createElement('div'); document.body.appendChild(d);
   d.innerHTML=cr('Root',96,{size:'sm',label:'shadow weight'})+cr('Root',96,{size:'sm',label:'shadow weight',raw:'9.6'});
   const c=d.querySelectorAll('.cr'), f=e=>({hot:e.classList.contains('hot'),v:e.querySelector('.v').textContent,
    stroke:getComputedStyle(e.querySelector('.arc circle:last-child')).stroke});
   const o={pct:f(c[0]),bare:f(c[1])}; d.remove(); return o;});
  ok(a.pct.v==='96%'&&!a.pct.hot,'A: a ring at 96% draws its own colour, not the alarm, '+J(a.pct));
  ok(a.bare.hot,'A: a ring past ninety that prints no percent still takes the alarm, '+J(a.bare));
  await page.close();
 }
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})();
