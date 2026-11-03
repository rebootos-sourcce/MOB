/* ============================================================
   ONE CHARACTER ON SCREEN. node tests/stackname.js, and called from
   tests/functional.js so a full run holds it through the same code.

   Ruled 23 October, DECISIONS.md "The full stack, nerve to Character", his
   words: "From fetter to super complex. After the super complex are the
   masks... And then at the very top is the character." The rung where two
   hyper complexes join is the super complex, and Character is the whole of
   it. Until that day the rung printed as Character on the Field's bar, the
   right rail's stack, Summary's chain, the run cards, the drills, Analytics
   and the tiers page, while the Character page carried the same word, so
   two different things were called Character on one screen.

   What is held, read off the page and never typed:

     SN1  every place the rung prints says super complex: the Field bar's
          switch, the stack tab, Summary's chain, Analytics' ring and its
          card, and a pattern drill
     SN2  on every tab TABDEF names, with a person whose reading reaches the
          rung, the word character stands only on the Character page, its
          door, its rail section, the Play section's title that names that
          door, and the two meanings that use the word in its everyday sense
          (an archetype is one of the kinds of character, the ego is the mask
          your character wears)

   Checked against a known bad case first, as the repository asks: a line
   reading "Character layer" put on the Field must be caught by SN2's own
   reader before that reader is trusted on anything real.
   ============================================================ */
const path=require('path');

/* the page side of SN2. Every visible element's own text, and the tooltip
   and label attributes of every visible element, with the word character in
   them, less the places it is allowed. Runs inside the page. */
function snScan(){
 const RX=/\bcharacter\b/i, SENSE=/kinds of character|your character/i;
 const vis=e=>{const s=getComputedStyle(e);
  if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;
  const r=e.getBoundingClientRect(); return r.width>0&&r.height>0;};
 /* #navnow is the phone bar's name for the page a person is on, so it says
    Character on that page and nowhere else */
 const allowed=e=>!!(e.closest('#masksview')||e.closest('[data-sec="chr"]')
  ||e.closest('[data-tabk="'+TAB.MASKS+'"]')||e.closest('.secb[data-sec="play"]')
  ||(e.closest('#navnow')&&S.tab===TAB.MASKS));
 const out=[];
 document.body.querySelectorAll('*').forEach(e=>{
  const tg=e.tagName.toLowerCase();
  if(tg==='script'||tg==='style'||tg==='noscript'||!vis(e))return;
  let own=''; for(let n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3)own+=n.nodeValue;
  own=own.replace(/\s+/g,' ').trim();
  const says=[own].concat(['title','data-tip','aria-label','data-tip-t'].map(a=>e.getAttribute(a)||''));
  says.forEach(s=>{
   if(!s||!RX.test(s)||SENSE.test(s)||allowed(e))return;
   out.push((e.id?'#'+e.id:tg+(e.className&&typeof e.className==='string'?'.'+e.className.split(/\s+/)[0]:''))+': '+s.slice(0,120));});});
 return out;}

async function stackNameGate(browser,FILE,ok,booted){
 for(const [w,h] of [[1600,1000],[390,844]]){
  const tag=w+': ';
  const pg=await browser.newPage({viewport:{width:w,height:h}});
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE); await booted(pg);
  try{
  /* THE PERSON. The heaviest one in the roster reaches the rung; the check
     says so first, because a reading with no super complex would let every
     check below pass while proving nothing. */
  const who=await pg.evaluate(()=>{
   let best=-1,n=-1;
   for(let i=0;i<PEOPLE.length;i++){loadP(i);const k=computeSeen().sups.length;if(k>n){n=k;best=i;}}
   loadP(best); setTab(TAB.FIELD); render();
   return {nm:PEOPLE[best].nm,sups:n};});
  ok(who.sups>0,'SN0: '+tag+'the person loaded reaches the rung, '+who.nm+' runs '+who.sups+' super complex'+(who.sups===1?'':'es'));
  if(!(who.sups>0)){await pg.close(); continue;}
  await pg.waitForTimeout(400);

  /* ---- the known bad case, before SN2's reader is trusted ---- */
  await pg.evaluate(()=>{
   const d=document.createElement('div'); d.id='snbad'; d.textContent='Character layer';
   d.style.cssText='position:fixed;left:40px;top:120px;z-index:99;font-size:16px';
   document.body.appendChild(d);});
  const caught=(await pg.evaluate(snScan)).some(s=>s.indexOf('#snbad')===0);
  await pg.evaluate(()=>{const d=document.getElementById('snbad'); if(d)d.remove();});
  const clean=!(await pg.evaluate(snScan)).some(s=>s.indexOf('#snbad')===0);
  ok(caught&&clean,'SN2: '+tag+'the reader catches a stray "Character layer" put on the Field, and lets it go once it is gone');

  /* ---- SN1, the Field: the bar's switch and the stack's tab ---- */
  const field=await pg.evaluate(()=>{
   const b=document.querySelector('[data-fb="character"]');
   const t=document.querySelector('#stack .stk-t[data-st="sup"]');
   return {bar:b?b.getAttribute('aria-label'):null, tab:t?t.textContent.replace(/\s+/g,' ').trim():null,
    tabTip:t?t.getAttribute('title'):null};});
  ok(field.bar==='Super complexes','SN1: '+tag+'the Field bar\'s innermost switch is Super complexes, got '+JSON.stringify(field.bar));
  ok((w<600&&field.tab===null)||(!!field.tab&&/^Super/.test(field.tab)&&!/character/i.test(field.tab+' '+field.tabTip)),
   'SN1: '+tag+'the stack\'s tab for the rung reads Super, got '+JSON.stringify(field));

  /* ---- SN1, a pattern drill on the rung ---- */
  const drill=await pg.evaluate(()=>{
   const r=computeSeen(); runDrill(r.sups[0]);
   const b=document.getElementById('rdrill'), s=b?(b.innerText||'').replace(/\s+/g,' '):'';
   try{rdClose();}catch(e){}
   return {sup:/\bsuper[- ]complex(es)?\b/i.test(s),character:/\bcharacter\b/i.test(s),head:s.slice(0,80)};});
  ok(drill.sup&&!drill.character,'SN1: '+tag+'the rung\'s own drill names it a super complex and never Character, '+JSON.stringify(drill));

  /* ---- SN1, Summary's chain ---- */
  const sum=await pg.evaluate(()=>{setTab(TAB.SUMMARY); render();
   return [...document.querySelectorAll('.s-chain .s-ch')].map(e=>e.textContent.replace(/\s+/g,' ').trim());});
  /* the count and its word sit in one span with no space, "2super" */
  ok(sum.length>0&&sum.some(s=>/^\d+\s*super$/.test(s))&&!sum.some(s=>/character/i.test(s)),
   'SN1: '+tag+'Summary\'s chain counts the rung as super, got '+JSON.stringify(sum));

  /* ---- SN1, Analytics: the ring and its card ---- */
  await pg.evaluate(()=>{setTab(TAB.ANALYTICS); render();});
  await pg.waitForTimeout(250);
  const ring=await pg.$('#ana .ana-rung[data-ana="rung|sup"]');
  let ana={ring:null};
  if(ring){
   const lab=await ring.evaluate(e=>e.textContent.replace(/\s+/g,' ').trim());
   await ring.scrollIntoViewIfNeeded(); await ring.click(); await pg.waitForTimeout(150);
   ana=await pg.evaluate(lab=>{const s=(document.getElementById('rdrill').innerText||'').replace(/\s+/g,' ');
    return {ring:lab, card:/\bsuper-complexes\b/i.test(s), meaning:s.indexOf(unpackOf('super complex'))>=0,
     character:/\bcharacter\b/i.test(s), head:s.slice(0,90)};},lab);
   await pg.evaluate(()=>{try{rdClose();}catch(e){}});}
  ok(!!ana.ring&&/super-complexes/i.test(ana.ring)&&ana.card&&ana.meaning&&!ana.character,
   'SN1: '+tag+'Analytics\' ring for the rung and its card say super complex, with its meaning beside it, '+JSON.stringify(ana));

  /* ---- SN2, every tab TABDEF names ---- */
  const tabs=await pg.evaluate(()=>TABDEF.map(t=>({k:t.k,nm:t.nm})));
  const stray=[];
  for(const t of tabs){
   const got=await pg.evaluate(k=>{try{setTab(k); render();}catch(e){return ['setTab threw: '+e.message];}
    return null;},t.k);
   await pg.waitForTimeout(250);
   const s=got||await pg.evaluate(snScan);
   s.forEach(x=>stray.push(t.nm+' | '+x));}
  ok(stray.length===0,'SN2: '+tag+'the word Character stands only on the Character page, its door and its rail on '
   +tabs.length+' tabs, got '+JSON.stringify(stray.slice(0,6)));
  }catch(e){ok(false,'SN: '+tag+'the gate threw: '+(e&&e.message));}
  ok(err.length===0,'SN: '+tag+'no page errors, got '+err.slice(0,2).join(' | '));
  await pg.close();}}

module.exports={stackNameGate};

if(require.main===module){
 const {chromium}=require('playwright');
 const {FULL_SIGHT}=require('./seed.js');
 (async()=>{
  const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
  const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);
  let PASS=0,FAIL=0;
  const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
  browser.newPage=(orig=>async function(...a){
   const pg=await orig.apply(this,a); await pg.addInitScript(FULL_SIGHT); return pg;})(browser.newPage);
  const booted=async p=>{try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
   try{await p.waitForTimeout(600); await p.evaluate(()=>{if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose();});
    await p.waitForTimeout(120);}catch(e){}};
  console.log('\n=== one Character on screen: the rung is the super complex, ruled 23 October ===');
  try{await stackNameGate(browser,FILE,ok,booted);}
  catch(e){FAIL++;console.log('  FAIL the gate threw: '+e.stack);}
  await browser.close();
  console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
  process.exit(FAIL?1:0);
 })();
}
