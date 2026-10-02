/* ============================================================
   THE ONBOARDING AND DAY ONE TUTORIAL GATE, ROUND PS.

   WHY THIS FILE EXISTS. The reviewed, merged mockup (mockups/onboarding-v2/)
   was wired into real code this round: arrive, the twelve starting points,
   settle, feel, body, story, a mirror with a correction path, then a bridge
   into the real release engine. Nothing in tests/functional.js walked that
   far before: its own onboarding block stopped at the old four step signal
   test and asserted, by name, that the sheet "wrote nothing to the nine
   axes" (round MP's ruling for that sheet). This flow now carries a real
   entry, on purpose, the same way the Day One tutorial already does, so a
   gate that still asserted the old shape would be asserting a product this
   repository no longer ships. This file is the new shape's own gate.

   WHAT IT WALKS, both through the real door (ui/login.js), never through
   ?dev=1, because "login through a real release" is the thing asked for and
   a flag that skips the door would be skipping the thing under test:

     1  a fresh Guest profile through every onboarding step to a real
        release, reading the real engine's own output at the mirror and
        handing real node ids to ui/release.js's one entry, relPick, which is
        then run to its own real cooldown, exactly as tests/design.js already
        proves the release card does.
     2  the Day One tutorial, the other path into the same first run, to the
        same real release, through the same relPick.
     3  that the mirror's one real-engine line is actually read off
        parseStory and not a scripted stand-in: a sentence the engine reads
        as nothing prints the same honest-empty line the tutorial already
        uses, and a sentence it reads fully prints the node it actually
        found, checked against what parseStory itself returns for that exact
        string.

     4  THE FIRST RELEASE'S SIZE, F5 in REVIEW-funnel/FINAL-SPEC.md, ruled
        round PA: "The mini release is 12 lines." Both doors hand relPick
        the plan onbMiniPlan made and never every address the story read,
        the run the release card builds is exactly the twelve keys the plan
        counted, the card prints that count and not the count of addresses,
        and when the story read more than three it says how many more, and
        how many of them the words did not name. Checked first against the
        build before the fix, where these assertions fail: that build handed
        over all eight addresses, ran 25 lines and printed "8 lines".

   WHAT IT DOES NOT CLAIM. No distress detector exists anywhere in this
   engine, and this file does not pretend otherwise: see the J0 check near
   the foot, which reports the gap rather than papering over it, the same
   rule atuned_src/ui/onboard.js's own header states.

       NODE_PATH=/opt/node22/lib/node_modules node tests/onboarding2.js

   Run from the repository root. Exits non zero on any failure.
   ============================================================ */
const {chromium}=require('playwright');
const path=require('path');
const FILE='file://'+path.resolve(process.env.ATUNED_FILE||'source.html');
let PASS=0,FAIL=0;
const ok=(c,m)=>{if(c)PASS++;else{FAIL++;console.log('  FAIL '+m);}};
const booted=async p=>{try{await p.waitForFunction(
  ()=>document.body.classList.contains('booted'),null,{timeout:12000});}
 catch(e){}};
/* the clock is shrunk the exact way tests/design.js already shrinks it, so a
   release that takes minutes at speaking pace takes seconds here while still
   going through relStep, relAdvance and relCoolDown in order. */
const SHRINK=`REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;`;
/* a sentence checked against the engine directly (see the report): it reads
   as real imprints at the Heart and the Solar seats, never typed here as a
   number, only as the string the engine is asked to read. */
const REAL_STORY='I felt tight in my chest when my boss yelled at me and I could not breathe.';

(async()=>{
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});

console.log('=== onboarding reaches a real release, through the real door, on a fresh profile ===');
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 /* THE REAL DOOR. No ?dev=1: this is the login card ui/login.js draws on a
    first visit, and Guest is the one way past it that makes no network
    request, the same request-free path a person with no account takes. */
 await page.waitForSelector('#loginb-skip',{timeout:8000});
 await page.click('#loginb-skip');
 await page.waitForTimeout(300);
 const opened=await page.evaluate(()=>!!(typeof OB!=='undefined'&&OB.open));
 ok(opened,'a fresh profile meets the onboarding sheet behind the real door');

 const step=async()=>page.evaluate(()=>({h:(document.querySelector('.ob-h')||{}).textContent,
  step:OB.step,dots:document.querySelectorAll('.ob-dot').length}));
 let st=await step();
 ok(st.step===0,'opens on arrive, step '+st.step);
 ok(st.dots===8,'eight steps on the dots, arrive through the bridge, got '+st.dots);

 await page.click('[data-ob="next"]'); await page.waitForTimeout(80);     /* arrive -> ask */
 st=await step(); ok(st.step===1,'ask, step '+st.step);
 const starts=await page.evaluate(()=>document.querySelectorAll('[data-obpick]').length);
 ok(starts===12,'the twelve starting points, got '+starts);
 await page.click('[data-obpick="2"]'); await page.waitForTimeout(80);    /* overwhelm, picking is the advance */
 st=await step(); ok(st.step===2,'picking a starting point is the advance, into settle, step '+st.step);

 await page.click('[data-ob="next"]'); await page.waitForTimeout(80);     /* settle -> feel */
 st=await step(); ok(st.step===3,'feel, step '+st.step);
 const feels=await page.evaluate(()=>document.querySelectorAll('[data-obfeel]').length);
 ok(feels===7,'six feeling words and Not sure, got '+feels);
 await page.click('[data-obfeel="0"]'); await page.waitForTimeout(80);    /* heavy */
 st=await step(); ok(st.step===4,'feel advances into body, step '+st.step);
 const places=await page.evaluate(()=>document.querySelectorAll('[data-obplace]').length);
 ok(places===8,'seven body places and Not sure, got '+places);
 await page.click('[data-obplace="3"]'); await page.waitForTimeout(80);   /* chest, the Heart seat */
 st=await step(); ok(st.step===5,'body advances into story, step '+st.step);

 /* THE REAL ENTRY. Typed, not pasted by assignment, so the Done button's
    own disabled state (fewer than three words) is exercised honestly. */
 await page.fill('#obtext',''); await page.type('#obtext',REAL_STORY);
 const enabled=await page.evaluate(()=>!document.getElementById('obdone').disabled);
 ok(enabled,'Done frees itself once three words are typed');
 const before=await page.evaluate(()=>({ch:Object.assign({},S.charge),
  n:(CURP.story&&CURP.story.entries||[]).length}));
 await page.click('#obdone'); await page.waitForTimeout(80);
 st=await step(); ok(st.step===6,'story advances into the mirror, step '+st.step);
 const mirror=await page.evaluate(()=>({text:document.querySelector('.ob-card').innerText,
  k:OB.commit&&OB.commit.k, ok:OB.commit&&OB.commit.ok,
  i0:(OB.commit&&OB.commit.kept&&OB.commit.kept[0])?OB.commit.kept[0].i:null,
  b0:(OB.commit&&OB.commit.kept&&OB.commit.kept[0])?OB.commit.kept[0].b:null}));
 ok(mirror.ok&&mirror.k>0,'the real engine read real imprints out of the typed entry, k='+mirror.k);
 ok(/Heart|Solar/.test(mirror.b0||''),'the first kept node sits at a real seat, got '+mirror.b0);
 ok(/This separates into its own components/.test(mirror.text),
  'the mirror prints the real-engine line, not a scripted stand in');
 ok(!/anticipation|solar plex/i.test(mirror.text),
  'and never a seat name the owner struck from this sheet');

 /* THE CORRECTION PATH, sourced only from the person's own words. */
 await page.click('[data-ob="mirrorno"]'); await page.waitForTimeout(60);
 await page.fill('#obcorr','it also sits in my jaw');
 await page.click('[data-ob="mirroradjust"]'); await page.waitForTimeout(80);
 const adj=await page.evaluate(()=>({text:document.querySelector('.ob-card').innerText,
  fixes:(CURP.story.entries[CURP.story.entries.length-1].ob||{}).fixes}));
 ok(/You added:.*jaw/.test(adj.text),'the correction is shown back exactly as typed, never rewritten');
 ok(adj.fixes&&adj.fixes[0]==='it also sits in my jaw',
  'and is written onto the real entry, the same object the Story tab writes, got '+JSON.stringify(adj.fixes));

 await page.click('[data-ob="mirroryes"]'); await page.waitForTimeout(80);
 st=await step(); ok(st.step===7,'mirror advances into the bridge, step '+st.step);
 const bridge=await page.evaluate(()=>document.querySelector('.ob-card').innerText);
 ok(/Begin the release/.test(bridge),'the bridge offers a real release, found a node to carry it');

 /* F5, THE FIRST RELEASE'S SIZE. Every number below is read off the build:
    the ruled size off its own tables, what was found off the commit, and
    what the card says off the card. Nothing typed but the sentence. */
 const mini=await page.evaluate(()=>{
  const pl=(typeof OB.plan==='object'&&OB.plan)||null;
  const kept=(OB.commit&&OB.commit.kept||[]).map(n=>n.i);
  return {pl:pl, kept:kept,
   size:(typeof ONB_MINI_ADDRS==='number'&&typeof RUN_MIN==='number')?ONB_MINI_ADDRS*RUN_MIN:null,
   chans:(typeof ONB_CHANS!=='undefined'&&typeof CHAN!=='undefined')
    ?{onb:ONB_CHANS.slice(),rel:CHAN.map(c=>c[0]+c[2])}:null};});
 ok(mini.size===12,'the ruled first release is twelve lines, three addresses at four, read off the tables: '+mini.size);
 ok(mini.chans&&JSON.stringify(mini.chans.onb)===JSON.stringify(mini.chans.rel),
  'the engine plans down the same four channels the release card walks, in the same order: '+JSON.stringify(mini.chans));
 ok(mini.kept.length>3,'the check sentence reads more than three addresses, so the cap has something to cut: '+mini.kept.length);
 ok(mini.pl&&mini.pl.ok&&mini.pl.lines===mini.size&&mini.pl.addrs.length===3,
  'the bridge plans three addresses and twelve lines, not every address read: '+JSON.stringify(mini.pl&&{a:mini.pl.addrs,l:mini.pl.lines}));
 ok(mini.pl&&mini.pl.addrs.every(i=>mini.kept.indexOf(i)>=0),'and every planned address is one the mirror read, none invented');
 ok(mini.pl&&new RegExp('\\b'+mini.pl.lines+' lines\\b').test(bridge),'the card prints the true count of lines, '+(mini.pl&&mini.pl.lines));
 ok(!new RegExp('\\b'+mini.kept.length+' lines\\b').test(bridge),
  'and never the count of addresses dressed as lines, the old "'+mini.kept.length+' lines" label');
 ok(mini.pl&&new RegExp('touched '+mini.pl.found+' places').test(bridge)&&new RegExp(mini.pl.rest===1?'other one waits':'other '+mini.pl.rest+' wait').test(bridge),
  'it says how many places the story touched and how many wait, '+(mini.pl&&(mini.pl.found+' and '+mini.pl.rest)));
 ok(mini.pl&&(mini.pl.foundInferred===0?/point to all/.test(bridge)
   :new RegExp((mini.pl.foundInferred===mini.pl.found?'All ':'other ')+mini.pl.foundInferred+' come from where the feeling sits').test(bridge)),
  'and how many of them the words did not name, '+(mini.pl&&mini.pl.foundInferred)+' of '+(mini.pl&&mini.pl.found));
 ok(/A line is one short sentence/.test(bridge),'a line is unpacked where the card first uses it (round PO)');
 ok(!/addresses?\b/i.test(bridge),'and the card never says address, which he ruled means nothing to a person (SX1)');

 /* THE HAND OFF. Never a second engine: this closes onboarding and opens
    ui/release.js's own one entry, relPick, on the exact node the mirror
    named. */
 await page.evaluate(SHRINK);
 await page.click('[data-ob="release"]'); await page.waitForTimeout(150);
 const rel=await page.evaluate(()=>({open:RUN.open,queueI:(RUN.queue||[]).map(n=>n.i),
  obClosed:!OB.open}));
 ok(rel.open,'the release card opens, handed off rather than duplicated');
 ok(rel.obClosed,'and the onboarding sheet is gone, never stacked behind it');
 ok(rel.queueI.length&&rel.queueI.every(i=>mini.kept.indexOf(i)>=0),
  'and it carries nodes the mirror read, never a guess built from a pick or a feeling word');
 /* F5 at the door: the queue is the plan's, and the run is the plan's keys.
    This assertion used to be queueI[0]===mirror.i0, the first node the mirror
    read. The plan puts stated before named before inferred, so its first
    address is the reading's first only when the reading weighed them that
    way; the queue is now held to the plan, which is held to the reading. */
 const runPlan=await page.evaluate(()=>({queue:(RUN.queue||[]).map(n=>n.i),plan:(RUN.plan||[]).slice()}));
 ok(mini.pl&&JSON.stringify(runPlan.queue)===JSON.stringify(mini.pl.addrs),
  'the release opens on exactly the plan\'s three addresses: '+JSON.stringify(runPlan.queue));
 ok(mini.pl&&JSON.stringify(runPlan.plan)===JSON.stringify(mini.pl.keys),
  'and builds exactly the twelve lines the card counted, '+runPlan.plan.length+' of them');

 /* RUN IT TO A REAL COOLDOWN, the same way tests/design.js already proves
    the card itself can finish, so "reaches a release" means the walker
    actually ran and the engine actually wrote, not only that a button
    exists. */
 const d=await page.$('#reldose');
 if(d){await d.evaluate(el=>{el.value='1';el.dispatchEvent(new Event('change'));});}
 await page.click('#relgo');
 const t0=Date.now();
 await page.waitForFunction(()=>RUN.phase==='done'&&RUN.cool>=COOLING.length,
  null,{timeout:60000}).catch(()=>{});
 const after=await page.evaluate(()=>({ch:Object.assign({},S.charge),
  phase:RUN.phase,cool:RUN.cool,coolOf:COOLING.length,meter:(CURP.meter&&CURP.meter.relLines)||0}));
 ok(after.phase==='done'&&after.cool>=after.coolOf,
  'the release walks itself to its own cooldown for real, phase '+after.phase+' cool '+after.cool+'/'+after.coolOf);
 const moved=Object.keys(before.ch).some(k=>Math.abs((before.ch[k]||0)-(after.ch[k]||0))>1e-9);
 ok(moved,'and the field actually moved: a release that opens a card but changes nothing is not a release');
 ok(after.meter>0,'the record keeps a real line released, got '+after.meter);
 const spent=await page.evaluate(()=>(CURP.meter&&CURP.meter.unique||[]).length);
 ok(mini.pl&&spent===mini.pl.lines,'the first release opened '+spent+' lines of new ground, the twelve it was shown and no more');
 ok(errs.length===0,'no script error the whole way through: '+errs.slice(0,3).join(' | '));
 console.log('  reached a real release in '+(Date.now()-t0)+'ms of wall clock, shrunk timing');
 await page.close();
}

console.log('\n=== the Day One tutorial reaches the same real release ===');
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 await page.evaluate(()=>{ loadP(0); CURP.ui=CURP.ui||{}; CURP.ui.tutorialSeen=false; });
 await page.evaluate(SHRINK);
 const open=await page.evaluate(()=>{tutorialOpen(true); return TUT.open;});
 ok(open,'the tutorial opens');
 await page.fill('#tuttext',REAL_STORY);
 await page.click('[data-tut="commit"]'); await page.waitForTimeout(80);
 const commit=await page.evaluate(()=>({ok:TUT.commit&&TUT.commit.ok,k:TUT.commit&&TUT.commit.k,
  i0:(TUT.commit&&TUT.commit.kept&&TUT.commit.kept[0])?TUT.commit.kept[0].i:null,
  kept:(TUT.commit&&TUT.commit.kept||[]).map(n=>n.i)}));
 ok(commit.ok&&commit.k>0,'the same real engine reads the same real entry, k='+commit.k);
 await page.click('[data-tut="next"]'); await page.waitForTimeout(60);  /* what this found -> how it runs through you */
 await page.click('[data-tut="next"]'); await page.waitForTimeout(60);  /* -> release */
 const rbtn=await page.evaluate(()=>!!document.querySelector('[data-tut="release"]'));
 ok(rbtn,'the Release step now offers a real Begin, the gap this round closes');
 await page.click('[data-tut="release"]'); await page.waitForTimeout(150);
 const rel=await page.evaluate(()=>({open:RUN.open,queueI:(RUN.queue||[]).map(n=>n.i),tutClosed:!TUT.open}));
 ok(rel.open&&rel.tutClosed,'the Day One tutorial hands off to the real release and closes its own sheet');
 ok(rel.queueI.length&&rel.queueI.indexOf(commit.i0)>=0||rel.queueI.length&&rel.queueI.every(i=>commit.kept.indexOf(i)>=0),
  'on nodes the tutorial just found');
 /* F5 on the second door: the same plan, the same size. */
 const tpl=await page.evaluate(()=>({pl:TUT.plan||null,queue:(RUN.queue||[]).map(n=>n.i),plan:(RUN.plan||[]).slice()}));
 ok(tpl.pl&&tpl.pl.ok&&tpl.queue.length<=3&&JSON.stringify(tpl.queue)===JSON.stringify(tpl.pl.addrs),
  'the tutorial hands over the plan\'s addresses, at most three, out of '+commit.kept.length+' read: '+JSON.stringify(tpl.queue));
 ok(tpl.pl&&tpl.plan.length<=12&&JSON.stringify(tpl.plan)===JSON.stringify(tpl.pl.keys),
  'and the run is the plan\'s lines, '+tpl.plan.length+' of them');
 const d=await page.$('#reldose');
 if(d){await d.evaluate(el=>{el.value='1';el.dispatchEvent(new Event('change'));});}
 await page.click('#relgo');
 await page.waitForFunction(()=>RUN.phase==='done'&&RUN.cool>=COOLING.length,
  null,{timeout:60000}).catch(()=>{});
 const after=await page.evaluate(()=>({phase:RUN.phase,cool:RUN.cool,coolOf:COOLING.length,
  meter:(CURP.meter&&CURP.meter.relLines)||0}));
 ok(after.phase==='done'&&after.cool>=after.coolOf,
  'the Day One tutorial reaches a real first release, phase '+after.phase);
 ok(after.meter>0,'a real line is recorded released off the tutorial path too, got '+after.meter);
 ok(errs.length===0,'no script error the whole way through: '+errs.slice(0,3).join(' | '));
 await page.close();
}

console.log('\n=== the mirror is checked against the engine directly, never trusted by eye ===');
{
 /* THE TOOL AGAINST A KNOWN CASE, so this file does not repeat the lesson
    CLAUDE.md names: reproduce before trusting. A sentence with nothing for
    the sniffer to read prints the honest-empty line, the same words the
    Day One tutorial already uses for the same case, never a fabricated
    finding. */
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const q=await page.evaluate(story=>{
  loadP(0);
  ST_TEXT=story; ST_PARSED=parseStory(story);
  const direct=ST_PARSED.imprints.length;
  obOpen(true);
  OB.step=5; obRender();
  document.getElementById('obtext').value=story;
  document.getElementById('obtext').dispatchEvent(new Event('input'));
  document.getElementById('obdone').click();
  const text=document.querySelector('.ob-card').innerText;
  return {direct:direct,shown:text,k:OB.commit.k};
 },'the weather was fine today and nothing much happened');
 ok(q.direct===0,'a check sentence the engine itself reads as nothing, confirmed off parseStory directly');
 ok(q.k===0,'the onboarding reads the identical nothing, same engine call');
 ok(/Nothing in that one lit anything the engine could name/.test(q.shown),
  'and says so in the honest-empty words, never inventing a finding');
 await page.close();
}

console.log('\n=== J0, the distress gap, reported rather than papered over ===');
/* THIS IS NOT A SAFETY TEST. It cannot be: there is nothing in this engine
   to test. It is a standing check that nobody has quietly added a decorative
   frame that LOOKS like a safety check while answering no real signal,
   which would be worse than the gap it is reporting. */
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const q=await page.evaluate(()=>({
  detector:typeof detectDistress,
  stopFrame:document.querySelectorAll('[class*="stop"],[id*="stop"]').length,
  src:String(window.obStoryDone||'')}));
 await page.close();
 console.log('  J0 STILL OPEN: no distress detector runs on a stranger\'s first story before it is');
 console.log('  committed. typeof a detector function: '+q.detector+' (expect undefined). This is a');
 console.log('  ship blocker for any build a stranger who is not the owner can reach, named as such in');
 console.log('  atuned_src/ui/onboard.js\'s own header, at the exact line obStoryDone calls stCommit.');
 ok(q.detector==='undefined',
  'confirmed: no distress detector exists in this build (the gap is real, not assumed)');
}

console.log('\n'+PASS+' passed, '+FAIL+' failed');
await browser.close();
process.exit(FAIL?1:0);
})();
