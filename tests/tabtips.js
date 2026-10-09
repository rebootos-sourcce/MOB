/* ============================================================
   A TAB'S TOOLTIP NAMES THE TAB, THEN SAYS WHAT IS THERE.
   node tests/tabtips.js, and called from tests/functional.js so a full run
   holds it through the same code.

   M92 in the open items list: every tab's title was its own label again,
   "Story" over a button that reads Story, and the retired artifact rewrote
   them as an action, "Open your story." The open item asked one line from the
   UX seat. The line, written beside the bar in shell/body.html:

     the name, a full stop, then one short sentence saying what a person does
     or finds on that page. Never the label alone, and never Open, because
     pressing any tab opens it.

   The name stays first because the folded menu shows icons only, and there
   the title is the only place the name can be seen. And a section's title
   names every tab in its group, because Discover's listed four tabs for as
   long as it had five, which is a count typed into a sentence going stale.

   WHAT IT READS. The live bar, after start up, so the buttons are the ones a
   person meets. A locked tab hands its title to the lock's own sentence while
   it is locked (ui/lock.js lockApply keeps it in data-lk-title and lockClear
   puts it back), so the tab's own line is read from whichever of the two
   holds it. Nothing is typed here: the tabs come off the bar and TABDEF, the
   groups off the bar's own data-sec.
   ============================================================ */
const path=require('path');

async function tabTipGate(browser,FILE,ok,booted){
 const pg=await browser.newPage({viewport:{width:1600,height:1000}});
 const err=[]; pg.on('pageerror',e=>err.push(e.message));
 await pg.goto(FILE,{waitUntil:'load'}); await booted(pg);
 const R=await pg.evaluate(()=>{
  const own=b=>b.getAttribute('title')||b.getAttribute('data-lk-title')||'';
  const tabs=[...document.querySelectorAll('#tabbar [data-tabk]')].map(b=>({
   k:+b.getAttribute('data-tabk'),
   nm:((b.querySelector('.n')||{}).textContent||'').trim(),
   tip:own(b)}));
  const secs=[...document.querySelectorAll('#secbar .secb')].map(b=>{
   const s=b.getAttribute('data-sec');
   return {sec:s, nm:((b.querySelector('.sn')||{}).textContent||'').trim(), tip:own(b),
    tabs:[...document.querySelectorAll('#tabbar .tabgrp[data-sec="'+s+'"] .n')]
     .map(n=>n.textContent.trim())};});
  return {tabs:tabs, secs:secs, def:TABDEF.map(t=>t.k)};});
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
 /* checked against known answers first, so a pass below means the rule and
    not a lenient parser */
 const after=(tip,nm)=>{const t=String(tip||'').trim();
  return t.indexOf(nm+'. ')===0?t.slice(nm.length+2).trim():null;};
 ok(after('Story. Write what happened.','Story')==='Write what happened.'
  &&after('Story','Story')===null&&after('Open your story.','Story')===null
  &&(' '+norm('Embody. Knowledge.')+' ').indexOf(' body ')<0
  &&(' '+norm('Play. Field, Body.')+' ').indexOf(' body ')>=0,
  'the reader parses a title it knows the answer to');
 console.log('  tabs on the bar: '+R.tabs.length+', TABDEF entries: '+R.def.length
  +', sections: '+R.secs.length);
 ok(R.tabs.length>0&&R.secs.length>0,'the bar has tabs and sections to read');
 R.def.forEach(k=>ok(R.tabs.some(t=>t.k===k),'TABDEF entry '+k+' has a button on the bar'));
 R.tabs.forEach(t=>{
  const tag='tab '+t.k+' "'+t.nm+'": ';
  ok(!!t.tip.trim(),tag+'has a tooltip, got none');
  ok(norm(t.tip)!==norm(t.nm),tag+'says more than its own label, got "'+t.tip+'"');
  const rest=after(t.tip,t.nm);
  ok(rest!==null,tag+'opens on its own name and a full stop, so a folded menu still names it, got "'+t.tip+'"');
  if(rest!==null){
   ok(rest.split(/\s+/).length>=3&&/[.]$/.test(rest),
    tag+'then says what is there in a sentence, got "'+rest+'"');
   ok(!/^open\b/i.test(rest),tag+'does not say Open, since every tab opens, got "'+rest+'"');
   ok(norm(rest).split(' ').length>1&&norm(rest)!==norm(t.nm),tag+'and the sentence is not the label again');}});
 R.secs.forEach(s=>{
  const tag='section "'+s.nm+'": ';
  ok(after(s.tip,s.nm)!==null,tag+'opens on its own name and a full stop, got "'+s.tip+'"');
  /* a whole word, so Body is not found inside Embody */
  s.tabs.forEach(n=>ok((' '+norm(s.tip)+' ').indexOf(' '+norm(n)+' ')>=0,
   tag+'names its tab '+n+', got "'+s.tip+'"'));});
 ok(err.length===0,'no page errors, got '+err.slice(0,2).join(' | '));
 await pg.close();}

module.exports={tabTipGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
 let PASS=0,FAIL=0;
 const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
 const booted=async p=>{
  try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000}); }catch(e){}
  try{ await p.waitForTimeout(600);
   await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
   await p.waitForTimeout(120); }catch(e){}};
 (async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
  console.log('\n=== a tab\'s tooltip names the tab, then says what is there ===');
  try{ await tabTipGate(browser,FILE,ok,booted); }
  catch(e){ FAIL++; console.log('  FAIL the gate threw: '+e.stack); }
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);})();}
