/* ============================================================
   EVERY WORKED EXAMPLE SHOWS ITS ROOT ENERGETICS, ON THE FIELD AND ON THE
   AVATAR, AT BOTH WIDTHS.
   node tests/exampleprofiles.js, from the repo root, with NODE_PATH pointing
   at a playwright install, against source.html (or ATUNED_FILE).

   His words, 18 November, over the Field with "Lance 15, example" chosen and
   the rail's first block reading "No birth data. Date, time and place unlock
   sun, moon, rising, the year animal, life path and the gene key.": "Got a
   bug, Emmy. Have one of your agents wire in root energetics for these
   profiles, and make sure that these profiles are just up to date with all
   the changes that we made."

   For every example in PEOPLE (read at run time and never counted here), at
   1600 and at 390, chosen through the picker the way he chose it:
     1  on the Field, Root Energetics (#spirit) never says "No birth data",
        and carries the six he named, each a drillable tile and not the
        dash an unread value gets: Sun, Moon, Rising, Year, Life path and
        Gene key
     2  on the Avatar, the same block reads the same six, and the birth
        fields of "Who this is" carry the example's own date, so the rail and
        the form beside it state one birth and not two
     3  the picker's age is the one the birth gives, not a typed number
     4  the year animal on the rail is the one Li Chun gives the birth date
   And the person's own blank profile keeps its empty state, which is right
   for somebody who has entered nothing.

   CHECKED AGAINST A KNOWN BAD BUILD FIRST, the standing rule: the build at
   c2bf52a2 (the live one he was looking at) fails group 1 and 2 on each of
   the four Lances and group 2 on every example, and each mutant named in the
   commit fails its own check.
   ============================================================ */
const path=require('path');
const {chromium}=require('playwright');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html')+'?dev=1';
const CHROME=process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SEED=require('./seed.js');
let PASS=0,FAIL=0;
const ok=(c,m)=>{ if(c){PASS++;} else {FAIL++; console.log('  FAIL '+m);} };
const booted=async p=>{
 try{ await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:15000}); }catch(e){}
 try{ await p.waitForTimeout(600);
  await p.evaluate(()=>{ if(typeof OB!=='undefined'&&OB.open&&typeof obClose==='function')obClose(); });
  await p.waitForTimeout(120); }catch(e){}
 try{ await p.waitForFunction(()=>typeof enterOver!=='function'||enterOver(),null,{timeout:4000}); }catch(e){}};
const SIX=['Sun','Moon','Rising','Year','Life path','Gene key'];
/* what #spirit says, read off the document: innerText cannot see a closed
   section, and the block opens closed by his ruling, so the tiles are read by
   their own labels and a tile is resolved when it is a button (reTile) and not
   the static dash (unres), ui/personas.js */
const readBlock=()=>{
 const el=document.getElementById('spirit'); if(!el)return null;
 const tiles={}; el.querySelectorAll('.sp-tile').forEach(t=>{
  const k=t.querySelector('.sp-k'); if(!k)return;
  const v=t.querySelector('.sp-v');
  tiles[k.textContent.trim()]={btn:t.tagName==='BUTTON', v:v?v.textContent.trim():''};});
 return {none:/No birth data/.test(el.textContent), tiles};};

(async()=>{
 const browser=await chromium.launch({executablePath:CHROME});
 require('./net.js').guardBrowser(browser);
 console.log('\n=== every worked example shows its Root Energetics ===');
 for(const [W,H] of [[1600,1000],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:W,height:H}});
  const pg=await ctx.newPage();
  await pg.addInitScript(SEED.FULL_SIGHT); await pg.addInitScript(SEED.LCOL_SEED);
  const err=[]; pg.on('pageerror',e=>err.push(e.message));
  await pg.goto(FILE,{waitUntil:'load'}); await booted(pg); await pg.waitForTimeout(300);
  console.log('\n--- at '+W+' ---');
  const roster=await pg.evaluate(()=>PEOPLE.map((p,i)=>({i,nm:p.nm,you:!!p.you,
   d:(typeof BIRTH!=='undefined'&&BIRTH[p.nm])?BIRTH[p.nm].d:null})));
  ok(roster.filter(r=>!r.you).length>0,'the roster is read off PEOPLE, '+roster.filter(r=>!r.you).length+' examples at '+W);
  const today=await pg.evaluate(()=>{const t=new Date();
   return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');});
  /* 3, read first, with the person's own profile chosen: the chosen entry
     reads "<name>, example" and every other one carries the age, so the
     labels are read while no example is chosen */
  await pg.evaluate(()=>{const s=document.getElementById('psel'); if(s){s.value='0'; s.dispatchEvent(new Event('change',{bubbles:true}));}});
  for(const r of roster.filter(x=>!x.you)){
   const lab=await pg.evaluate(i=>{const o=document.querySelector('#psel option[value="'+i+'"]'); return o?o.textContent:'';},r.i);
   if(!r.d){ok(false,r.nm+' has a birth to read an age off'); continue;}
   const b=r.d.split('-').map(Number), n=today.split('-').map(Number);
   const want=n[0]-b[0]-((n[1]<b[1]||(n[1]===b[1]&&n[2]<b[2]))?1:0);
   const m=lab.match(/, (\d+), /);
   ok(!!m&&+m[1]===want,r.nm+'\'s picker age is '+want+' off the birth, got '+JSON.stringify(lab));}
  for(const r of roster){
   /* through the picker, the control he used; the phone menu reads it too */
   const picked=await pg.evaluate(i=>{const s=document.getElementById('psel'); if(!s)return 'no picker';
    s.value=String(i); s.dispatchEvent(new Event('change',{bubbles:true}));
    return S.who===i?'':'the picker left S.who at '+S.who;},r.i);
   ok(picked==='',r.nm+' is chosen in the picker at '+W+(picked?': '+picked:''));
   for(const [tab,nm] of [['FIELD','Field'],['INTAKE','Avatar']]){
    await pg.evaluate(t=>{setTab(TAB[t]);},tab); await pg.waitForTimeout(80);
    const b=await pg.evaluate(readBlock);
    if(r.you){
     ok(b&&b.none,'the own blank profile keeps "No birth data" on the '+nm+' at '+W);
     continue;}
    ok(b&&!b.none,r.nm+' on the '+nm+' at '+W+' does not say No birth data');
    if(!r.d){ok(false,r.nm+' has a birth in BIRTH'); continue;}
    const miss=SIX.filter(k=>!(b&&b.tiles[k]&&b.tiles[k].btn&&b.tiles[k].v&&!/null|undefined|NaN/.test(b.tiles[k].v)));
    ok(miss.length===0,r.nm+' on the '+nm+' at '+W+' reads all six'+(miss.length?', missing '+miss.join(', '):'')
     +(b&&b.tiles.Sun?' ('+SIX.map(k=>b.tiles[k]?b.tiles[k].v:'-').join(' / ')+')':''));
    /* the year is the one reading here a reader can check by hand: the
       animal turns at Li Chun, which falls on the 3rd to the 5th of
       February, and none of the examples is born on those three days, so
       the year before is the animal for a birth before the 4th. The cycle
       is the calendar's own, Rat to Pig, and is not a count of anything. */
    const [by,bm,bd]=r.d.split('-').map(Number), yy=(bm<2||(bm===2&&bd<4))?by-1:by;
    const animal=['Monkey','Rooster','Dog','Pig','Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat'][yy%12];
    const yv=b&&b.tiles.Year?b.tiles.Year.v:'';
    ok(new RegExp('\\b'+animal+'$').test(yv),r.nm+' on the '+nm+' at '+W+' is a '+animal+' year, got '+JSON.stringify(yv));
    if(tab==='INTAKE'){
     /* the form beside the rail states the same birth. #wdate is drawn
        inside the Who card whether that card is open or not */
     const wd=await pg.evaluate(()=>{const d=document.getElementById('wdate'); return d?d.value:null;});
     ok(wd===r.d,r.nm+'\'s Avatar birth date reads '+r.d+' at '+W+', got '+JSON.stringify(wd));}}
  }
  ok(err.length===0,'no page error at '+W+(err.length?': '+err.slice(0,3).join(' | '):''));
  await ctx.close();
  /* 5  THE CLIENTS PAGE OPENED FIRST, 18 November, found by QA after this
     gate passed in full. The Clients page (ui/practitioner.js pracRead)
     builds its own scratch record for each of its ten the first time it is
     drawn, and loadP only builds one when none exists, so on a page where
     Clients was opened before the picker every client read an empty
     who.born on the Avatar while the rail, which reads BIRTH by name, still
     printed the chart: the two truths this gate was written to close. The
     passes above always pick first, so they never saw it. A fresh page per
     width, Clients first, then every example through the picker, and the
     Avatar's #wdate is the record's birth. The client list is whatever the
     page itself drew, never typed here. */
  const ctx2=await browser.newContext({viewport:{width:W,height:H}});
  const pg2=await ctx2.newPage();
  await pg2.addInitScript(SEED.FULL_SIGHT); await pg2.addInitScript(SEED.LCOL_SEED);
  const err2=[]; pg2.on('pageerror',e=>err2.push(e.message));
  await pg2.goto(FILE,{waitUntil:'load'}); await booted(pg2); await pg2.waitForTimeout(300);
  const drawn=await pg2.evaluate(()=>{setTab(TAB.PRACTITIONER);
   return (typeof PROF_BY!=='undefined')?Object.keys(PROF_BY).filter(k=>k!==PEOPLE[0].nm):[];});
  await pg2.waitForTimeout(300);
  ok(drawn.length>0,'the Clients page drew its own records before any pick at '+W+', '+drawn.length+' of them');
  for(const r of roster.filter(x=>!x.you&&x.d)){
   await pg2.evaluate(i=>{const s=document.getElementById('psel'); s.value=String(i); s.dispatchEvent(new Event('change',{bubbles:true})); setTab(TAB.INTAKE);},r.i);
   await pg2.waitForTimeout(80);
   const wd=await pg2.evaluate(()=>{const d=document.getElementById('wdate'); return d?d.value:null;});
   ok(wd===r.d,'Clients first: '+r.nm+'\'s Avatar birth date reads '+r.d+' at '+W+(drawn.indexOf(r.nm)>=0?' (a client)':'')+', got '+JSON.stringify(wd));}
  ok(err2.length===0,'no page error with Clients first at '+W+(err2.length?': '+err2.slice(0,3).join(' | '):''));
  await ctx2.close();}
 await browser.close();
 console.log('\n===== '+PASS+' passed, '+FAIL+' failed =====');
 process.exit(FAIL?1:0);
})().catch(e=>{console.log('  FAIL crashed: '+(e&&e.stack||e)); console.log('\n===== '+PASS+' passed, '+(FAIL+1)+' failed ====='); process.exit(1);});
