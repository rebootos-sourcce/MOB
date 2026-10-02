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
 /* F4, ROUND QA. THE MIRROR COMES BEFORE THE COMMIT. Done reads the story
    and writes nothing: no entry, no charge, until the mirror's own Commit.
    Before this round the charge was in the field before the card was shown,
    so a no on it had nothing to take back. */
 const pre=await page.evaluate(()=>({ch:Object.assign({},S.charge),
  n:(CURP.story&&CURP.story.entries||[]).length, commit:OB.commit}));
 ok(pre.n===before.n,'Done writes no entry before the mirror is answered, entries '+before.n+' to '+pre.n);
 ok(Object.keys(before.ch).every(k=>Math.abs((before.ch[k]||0)-(pre.ch[k]||0))<1e-9),
  'and moves no charge before the mirror is answered');
 ok(pre.commit===null,'and the commit has not run');
 const mirror=await page.evaluate(story=>{
  const card=document.querySelector('.ob-card'), p=parseStory(story);
  const rows=[...card.querySelectorAll('[data-obrow]')].map(r=>({i:+r.getAttribute('data-obrow'),
   text:r.innerText, guess:!!r.querySelector('.ob-tag:not(.ob-tag-said)'), said:!!r.querySelector('.ob-tag-said')}));
  const inf={}; p.imprints.forEach(im=>{inf[im.node]=im.inferred;});
  return {text:card.innerText, rows:rows, inf:inf, k:p.imprints.length,
   yes:card.querySelectorAll('[data-obans="yes"]').length, no:card.querySelectorAll('[data-obans="no"]').length,
   global:card.querySelectorAll('[data-ob="mirroryes"]').length,
   b0:(OB.read&&OB.read[0])?OB.read[0].seat:null};},REAL_STORY);
 ok(mirror.k>0&&mirror.rows.length>0,'the real engine read real imprints out of the typed entry, k='+mirror.k);
 ok(/Heart|Solar/.test(mirror.b0||''),'the first seat the mirror leads with is a real seat, got '+mirror.b0);
 ok(/This separates into its own components/.test(mirror.text),
  'the mirror prints the real-engine line, not a scripted stand in');
 ok(!/anticipation|solar plex/i.test(mirror.text),
  'and never a seat name the owner struck from this sheet');
 /* A GUESS IS NEVER PRINTED AS A QUOTE. Each row is checked against what
    parseStory itself says about that address for this exact string. */
 ok(!/around the word/i.test(mirror.text),'no address is printed "around the word", which reads as a quotation');
 ok(mirror.rows.every(r=>r.guess===!!mirror.inf[r.i]&&r.said===!mirror.inf[r.i]),
  'every address is tagged a guess exactly when parseStory marks it inferred: '
   +mirror.rows.map(r=>r.i+(r.guess?'g':'')+(r.said?'s':'')+'/'+mirror.inf[r.i]).join(' '));
 ok(mirror.rows.filter(r=>r.guess).every(r=>/The engine.s guess, from your (Heart|Solar|Sacral|Root|Throat|3rd Eye|Crown) seat/.test(r.text)),
  'and every guess says it is the engine\'s guess and names the seat it came from');
 ok(/A seat is one of seven places/.test(mirror.text)&&/An address is one exact place/.test(mirror.text),
  'seat and address carry their plain meaning on the card, round PO');
 /* ONE ANSWER PER ADDRESS. */
 ok(mirror.global===0,'there is no single global "That is me" confirming every address at once');
 ok(mirror.yes===mirror.rows.length&&mirror.no===mirror.rows.length,
  'every address shown has its own Yes and its own Not me, rows '+mirror.rows.length+' yes '+mirror.yes+' no '+mirror.no);

 /* THE CORRECTION PATH, sourced only from the person's own words. */
 await page.click('[data-ob="mirrorno"]'); await page.waitForTimeout(60);
 await page.fill('#obcorr','it also sits in my jaw');
 await page.click('[data-ob="mirroradjust"]'); await page.waitForTimeout(80);
 const adj=await page.evaluate(()=>({text:document.querySelector('.ob-card').innerText,
  n:(CURP.story&&CURP.story.entries||[]).length}));
 ok(/You added:.*jaw/.test(adj.text),'the correction is shown back exactly as typed, never rewritten');
 ok(adj.n===before.n,'and a correction writes no entry of its own before Commit');

 /* ACCEPT ONE GUESS, REJECT ANOTHER, IN THE SAME MIRROR. The first seat is
    opened so its second address is reachable, through the button that says
    how many more there are. */
 const g0=await page.evaluate(()=>OB.read[0].id);
 await page.click('[data-obmore="'+g0+'"]'); await page.waitForTimeout(60);
 const ids=await page.evaluate(()=>[...document.querySelectorAll('[data-obrow]')].map(r=>+r.getAttribute('data-obrow')));
 ok(ids.length>=2,'opening a seat shows its other addresses, rows now '+ids.length);
 const yesI=ids[0], noI=ids[1];
 await page.click('[data-obans="yes"][data-obi="'+yesI+'"]'); await page.waitForTimeout(40);
 await page.click('[data-obans="no"][data-obi="'+noI+'"]'); await page.waitForTimeout(40);
 const ans=await page.evaluate(([a,b])=>({ya:document.querySelector('[data-obans="yes"][data-obi="'+a+'"]').getAttribute('aria-pressed'),
  nb:document.querySelector('[data-obans="no"][data-obi="'+b+'"]').getAttribute('aria-pressed'),
  yb:document.querySelector('[data-obans="yes"][data-obi="'+b+'"]').getAttribute('aria-pressed'),
  text:document.querySelector('.ob-card').innerText}),[yesI,noI]);
 ok(ans.ya==='true'&&ans.nb==='true'&&ans.yb==='false','one address says yes and the next says no, each on its own control');
 ok(/In your release\./.test(ans.text)&&/Kept out of your release/.test(ans.text),'and each row says what its answer does');
 /* F5 ON F4. The person now opens every seat and says yes to every other
    address, keeping the one no. That leaves more yes rows than the first
    release takes, so the cap below has something to cut, and the no is
    still there to prove it is never planned. */
 await page.evaluate(()=>{ let b;
  while((b=document.querySelector('[data-obmore]')))b.click();
  while((b=[...document.querySelectorAll('[data-obans="yes"][aria-pressed="false"]')]
   .find(x=>!document.querySelector('[data-obans="no"][data-obi="'+x.getAttribute('data-obi')+'"][aria-pressed="true"]'))))b.click();});
 const yesAll=await page.evaluate(()=>Object.keys(OB.ans).filter(k=>OB.ans[k]==='yes').map(Number));
 ok(yesAll.indexOf(yesI)>=0&&yesAll.indexOf(noI)<0,'every other address is a yes and the one no stays a no');

 await page.click('[data-ob="mirrorcommit"]'); await page.waitForTimeout(80);
 st=await step(); ok(st.step===7,'Commit advances into the bridge, step '+st.step);
 const ent=await page.evaluate(()=>{const e=CURP.story.entries[CURP.story.entries.length-1];
  return {n:CURP.story.entries.length, ob:e.ob, ch:Object.assign({},S.charge), k:OB.commit&&OB.commit.k};});
 ok(ent.n===before.n+1,'Commit writes the one real entry, entries '+before.n+' to '+ent.n);
 ok(ent.k>0&&Object.keys(before.ch).some(k=>Math.abs((before.ch[k]||0)-(ent.ch[k]||0))>1e-9),
  'and the real commit moves the field only now, k='+ent.k);
 ok(ent.ob&&ent.ob.yes&&ent.ob.yes.indexOf(yesI)>=0&&ent.ob.no&&ent.ob.no.indexOf(noI)>=0,
  'the yes and the no are written onto the real entry, got '+JSON.stringify(ent.ob&&{yes:ent.ob.yes,no:ent.ob.no}));
 ok(ent.ob&&ent.ob.fixes&&ent.ob.fixes[0]==='it also sits in my jaw',
  'and the correction is written onto the same entry, word for word, got '+JSON.stringify(ent.ob&&ent.ob.fixes));
 const bridge=await page.evaluate(()=>document.querySelector('.ob-card').innerText);
 ok(/Begin the release/.test(bridge),'the bridge offers a real release, found a node to carry it');

 /* F5, THE FIRST RELEASE'S SIZE. Every number below is read off the build:
    the ruled size off its own tables, what was found off the commit, and
    what the card says off the card. Nothing typed but the sentence. */
 const mini=await page.evaluate(()=>{
  const pl=(typeof OB.plan==='object'&&OB.plan)||null;
  /* F4 gates what counts: the plan is held to the yes rows on the real
     entry, and the raw story read is kept beside it only to show the two
     differ. */
  const e=CURP.story.entries[CURP.story.entries.length-1];
  const yes=(e.ob&&e.ob.yes||[]).slice(), no=(e.ob&&e.ob.no||[]).slice();
  const kept=(OB.commit&&OB.commit.kept||[]).map(n=>n.i);
  return {pl:pl, yes:yes, no:no, kept:kept,
   size:(typeof ONB_MINI_ADDRS==='number'&&typeof RUN_MIN==='number')?ONB_MINI_ADDRS*RUN_MIN:null,
   chans:(typeof ONB_CHANS!=='undefined'&&typeof CHAN!=='undefined')
    ?{onb:ONB_CHANS.slice(),rel:CHAN.map(c=>c[0]+c[2])}:null};});
 ok(mini.size===12,'the ruled first release is twelve lines, three addresses at four, read off the tables: '+mini.size);
 ok(mini.chans&&JSON.stringify(mini.chans.onb)===JSON.stringify(mini.chans.rel),
  'the engine plans down the same four channels the release card walks, in the same order: '+JSON.stringify(mini.chans));
 ok(mini.yes.length>3,'the person said yes to more than three addresses, so the cap has something to cut: '+mini.yes.length);
 ok(mini.pl&&mini.pl.ok&&mini.pl.lines===mini.size&&mini.pl.addrs.length===3,
  'the bridge plans three addresses and twelve lines, not every address read: '+JSON.stringify(mini.pl&&{a:mini.pl.addrs,l:mini.pl.lines}));
 ok(mini.pl&&mini.pl.addrs.every(i=>mini.yes.indexOf(i)>=0),'and every planned address is one the person said yes to, none invented: '+JSON.stringify(mini.pl&&mini.pl.addrs));
 ok(mini.pl&&mini.no.length>0&&mini.pl.addrs.every(i=>mini.no.indexOf(i)<0),'and none is one they said no to');
 ok(mini.pl&&mini.pl.found===mini.yes.length,'the plan counts the yes rows, '+(mini.pl&&mini.pl.found)+' of '+mini.yes.length+', never the raw story read');
 ok(mini.pl&&new RegExp('\\b'+mini.pl.lines+' lines\\b').test(bridge),'the card prints the true count of lines, '+(mini.pl&&mini.pl.lines));
 ok(!new RegExp('\\b'+mini.yes.length+' lines\\b').test(bridge),
  'and never the count of addresses dressed as lines, the old "'+mini.yes.length+' lines" label');
 ok(mini.pl&&new RegExp('You said yes to '+mini.yes.length+' places').test(bridge)&&new RegExp(mini.pl.rest===1?'other one waits':'other '+mini.pl.rest+' wait').test(bridge),
  'it says how many places the person said yes to and how many wait, '+(mini.pl&&(mini.yes.length+' and '+mini.pl.rest)));
 ok(!/Your story touched/.test(bridge),'and not the story\'s own count, which would include the no');
 ok(mini.pl&&(mini.pl.foundInferred===0?/point to all/.test(bridge)
   :new RegExp((mini.pl.foundInferred===mini.pl.found?'All ':'other ')+mini.pl.foundInferred+' come from where the feeling sits').test(bridge)),
  'and how many of them the words did not name, '+(mini.pl&&mini.pl.foundInferred)+' of '+(mini.pl&&mini.pl.found));
 ok(/A line is one short sentence/.test(bridge),'a line is unpacked where the card first uses it (round PO)');
 ok(!/addresses?\b/i.test(bridge),'and the card never says address, which he ruled means nothing to a person (SX1)');

 /* THE HAND OFF. Never a second engine: this closes onboarding and opens
    ui/release.js's own one entry, relPick, on the addresses the person said
    yes to, and never on one they said no to. */
 await page.evaluate(SHRINK);
 await page.click('[data-ob="release"]'); await page.waitForTimeout(150);
 const rel=await page.evaluate(()=>({open:RUN.open,queueI:(RUN.queue||[]).map(n=>n.i),
  obClosed:!OB.open}));
 ok(rel.open,'the release card opens, handed off rather than duplicated');
 ok(rel.obClosed,'and the onboarding sheet is gone, never stacked behind it');
 ok(rel.queueI.length&&rel.queueI.every(i=>mini.yes.indexOf(i)>=0),
  'and it carries only addresses the person said yes to, never a guess built from a pick or a feeling word');
 ok(rel.queueI.indexOf(noI)<0,'and never the address they said no to');
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

 /* THE NEXT VISIT, ROUND QB. Every assertion above ran inside the one page
    that wrote the record, and nothing in this file ever loaded it back, so
    the profile boundary never saw what onboarding writes. It refused it:
    obCommit puts ob on the story entry, ENT_KEYS did not name ob, and the
    boot's validateProfile refused the whole profile, "story.entries[0] may
    not carry ob". A blank "You" opened in its place, the welcome sheet
    replayed, and the status line said nothing, because storeRefused() had
    no caller. Checked against that build first: these assertions fail on
    it and pass on the fix.

    A real reload in the same page, so the same browser store, through the
    real boot. What is compared is read off the disk before the reload and
    off the loaded record after it, never typed here. */
 const kept=await page.evaluate(()=>{const e=CURP.story.entries[CURP.story.entries.length-1];
  return {id:CURP.id, n:CURP.story.entries.length, ob:JSON.stringify(e.ob), text:e.text,
   onboarded:!!(CURP.ui&&CURP.ui.onboarded), disk:localStorage.getItem(PKEY)};});
 ok(kept.disk&&kept.disk.indexOf('"ob":')>=0,'the answers are on the disk before the reload');
 await page.reload({waitUntil:'load'}); await booted(page);
 const back=await page.evaluate(()=>{const es=(CURP&&CURP.story&&CURP.story.entries)||[], e=es[es.length-1]||{};
  return {id:CURP&&CURP.id, n:es.length, ob:JSON.stringify(e.ob), text:e.text,
   onboarded:!!(CURP&&CURP.ui&&CURP.ui.onboarded), refused:storeRefused(), unread:storeUnread(),
   profiles:PROFILES.length, status:(document.getElementById('status')||{}).textContent||''};});
 ok(back.refused.length===0,'the boundary takes the record onboarding wrote, refused '+JSON.stringify(back.refused));
 ok(back.unread===null,'and the store reads at all');
 ok(back.id===kept.id&&back.n===kept.n&&back.text===kept.text,
  'the same profile comes back after a reload, with the same story, '+back.n+' entries of '+kept.n);
 ok(back.ob===kept.ob,'and every yes, no and correction comes back as written: '+back.ob);
 ok(back.onboarded,'the record still says onboarding was finished');
 await page.waitForSelector('#loginb-skip',{timeout:8000}).catch(()=>{});
 if(await page.$('#loginb-skip'))await page.click('#loginb-skip');
 await page.waitForTimeout(300);
 const replay=await page.evaluate(()=>!!(typeof OB!=='undefined'&&OB.open));
 ok(!replay,'and the welcome sheet does not replay on the next visit');
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
  const rows=document.querySelectorAll('[data-obrow]').length;
  document.querySelector('[data-ob="mirrorcommit"]').click();
  return {direct:direct,shown:text,rows:rows,k:OB.commit.k};
 },'the weather was fine today and nothing much happened');
 ok(q.direct===0,'a check sentence the engine itself reads as nothing, confirmed off parseStory directly');
 ok(q.k===0&&q.rows===0,'the onboarding reads the identical nothing, same engine call, and shows no address');
 ok(/Nothing in that one lit anything the engine could name/.test(q.shown),
  'and says so in the honest-empty words, never inventing a finding');
 await page.close();
}

console.log('\n=== F4: the mirror says which addresses are guesses, on the review\'s own sentences ===');
{
 /* THE SENTENCES ARE THE FUNNEL REVIEW'S OWN (REVIEW-funnel/FINAL-SPEC.md,
    section 3), the three walks that measured the defect: Diane's twelve
    addresses, every one inferred; Marcus's angry, which names anger and
    never says Pride; Angela's bereavement, inferred, with Martyrdom in it.
    And one more, "I am exhausted", which states a feeling (apathy) the Solar
    seat has no address for, the one case where a stated feeling sits at an
    address of another family. Each is checked against parseStory for that
    exact string, never against a number typed here. */
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const read=story=>page.evaluate(story=>{
  loadP(0); obOpen(true); OB.step=5; obRender();
  const ta=document.getElementById('obtext'); ta.value=story; ta.dispatchEvent(new Event('input'));
  document.getElementById('obdone').click();
  const p=parseStory(story), card=document.querySelector('.ob-card');
  const grp=[...card.querySelectorAll('.ob-grp')].map(g=>g.innerText);
  const firstGrp=card.querySelector('.ob-grp');
  const lead=firstGrp?firstGrp.querySelector('p').innerText:'';
  return {text:card.innerText, grp:grp, lead:lead,
   inferred:p.imprints.filter(i=>i.inferred).length, stated:p.imprints.filter(i=>!i.inferred).length,
   guessTags:card.querySelectorAll('.ob-tag:not(.ob-tag-said)').length,
   saidTags:card.querySelectorAll('.ob-tag-said').length,
   rows:card.querySelectorAll('[data-obrow]').length, seats:grp.length,
   entries:(CURP.story&&CURP.story.entries||[]).length};},story);
 const diane=await read('I snapped at my co-founder in front of the team and I cannot stop replaying it.');
 ok(diane.stated===0&&diane.inferred>0,'Diane\'s sentence is all inferred by parseStory itself, '+diane.inferred+' inferred, '+diane.stated+' stated');
 ok(diane.saidTags===0&&diane.guessTags===diane.rows,'and every address on her mirror is tagged a guess, none as her words');
 ok(/^At your (Solar|Sacral|3rd Eye|Heart|Root|Throat|Crown) seat\./.test(diane.lead),
  'with nothing stated, each seat leads, not an address name, got "'+diane.lead.slice(0,40)+'"');
 ok(/snapped/.test(diane.text),'and the seat is tied to her own word that put weight there');
 ok(!/around the word/i.test(diane.text),'never "around the word" for a word she did not say');
 ok(diane.rows===diane.seats,'one address per seat shows, the rest behind a button that says how many: rows '+diane.rows+' seats '+diane.seats);
 ok(/more guesses at this seat/.test(diane.text),'and that button says they are guesses');
 ok(diane.entries===0,'nothing is written while she reads it');

 const marcus=await read('My partner says I am impossible to work with. She is probably right and I am still angry about it.');
 ok(marcus.stated>0,'Marcus\'s "angry" is stated by parseStory itself, '+marcus.stated+' stated');
 ok(marcus.saidTags===marcus.rows&&marcus.guessTags===0,'and his mirror tags his address as named by him, not as a guess');
 ok(/Your word .angry. named/.test(marcus.text),'quoting the word he actually used');
 ok(/you named anger/.test(marcus.text)&&!/around the word/i.test(marcus.text),
  'the tag says he named anger, and nowhere that he said Pride');

 const angela=await read('My mother died last spring and I keep feeling her in my chest when I try to sleep.');
 ok(angela.stated===0&&angela.guessTags===angela.rows,'Angela\'s bereavement is all guesses and says so');
 ok(/The engine.s guess, from your Heart seat/.test(angela.text),'in the review\'s own words: the engine\'s guess, from your Heart seat');
 const ang2=await page.evaluate(()=>{
  OB.more[OB.read[0].id]=true; obRender();
  const r=[...document.querySelectorAll('[data-obrow]')].find(x=>/Martyrdom/.test(x.innerText));
  return r?{guess:!!r.querySelector('.ob-tag:not(.ob-tag-said)'),text:r.innerText}:null;});
 ok(!ang2||(ang2.guess&&/guess/.test(ang2.text)),
  'a moral word on a bereavement, if the engine reaches it, is shown as a guess, got '+(ang2&&ang2.text));
 /* SHE SAYS NOT ME TO ALL OF IT, AND THE NO LANDS. Nothing goes to a release. */
 const ang3=await page.evaluate(()=>{
  /* each press redraws the card, so the next unpressed control is found
     again every time rather than clicking a list of detached buttons */
  let b; while((b=document.querySelector('[data-obans="no"][aria-pressed="false"]')))b.click();
  document.querySelector('[data-ob="mirrorcommit"]').click();
  const e=CURP.story.entries[CURP.story.entries.length-1];
  return {bridge:document.querySelector('.ob-card').innerText, release:!!document.querySelector('[data-ob="release"]'),
   no:(e.ob&&e.ob.no||[]).length, yes:(e.ob&&e.ob.yes||[]).length, shown:OB.read.reduce((a,g)=>a+g.rows.length,0)};});
 ok(!ang3.release&&/did not say yes to any place/.test(ang3.bridge),'a no to every address offers no release on them');
 ok(ang3.no===ang3.shown&&ang3.yes===0,'and every no is on her record as a no, '+ang3.no+' of '+ang3.shown);

 const tired=await read('I am exhausted.');
 ok(tired.stated>0&&/you named apathy/.test(tired.text),'"exhausted" names apathy, stated');
 ok(/has no place for apathy, so the engine holds it here/.test(tired.text)&&!/One place apathy sits/.test(tired.text),
  'and where the seat has no apathy address the card says so, never "one place apathy sits"');

 /* LEAVING BEFORE COMMIT KEEPS NOTHING AND LOSES NOTHING. */
 const esc=await page.evaluate(()=>{
  loadP(0); const n0=(CURP.story&&CURP.story.entries||[]).length;
  obOpen(true); OB.step=5; obRender();
  const ta=document.getElementById('obtext'); ta.value='I snapped at my brother and I hate it.'; ta.dispatchEvent(new Event('input'));
  document.getElementById('obdone').click();
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  return {n0:n0, n1:(CURP.story&&CURP.story.entries||[]).length, pending:ST_TEXT,
   status:(document.getElementById('status')||{}).textContent};});
 ok(esc.n1===esc.n0,'Escape on the mirror writes no entry');
 ok(/snapped at my brother/.test(esc.pending),'and the words wait as the Story tab\'s pending text');
 ok(/Nothing committed/.test(esc.status||''),'and the status line says so, got "'+esc.status+'"');
 ok(errs.length===0,'no script error: '+errs.slice(0,3).join(' | '));
 await page.close();
}

console.log('\n=== F5 on F4: one yes is a release of one place, whatever the story read ===');
{
 /* THE PLAN READS THE ANSWERS, NOT THE STORY. The same sentence that read
    more than three addresses above, with a yes to exactly one of them. Fed
    the raw read, the plan would take three; fed the yes rows, it takes the
    one. Checked both ways off onbMiniPlan itself, so the difference is
    measured and not assumed. */
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const one=await page.evaluate(story=>{
  loadP(0); obOpen(true); OB.step=5; obRender();
  const ta=document.getElementById('obtext'); ta.value=story; ta.dispatchEvent(new Event('input'));
  document.getElementById('obdone').click();
  const raw=onbMiniPlan(CURP,{imprints:parseStory(story).imprints});
  const b=document.querySelector('[data-obans="yes"]'), i=+b.getAttribute('data-obi'); b.click();
  document.querySelector('[data-ob="mirrorcommit"]').click();
  return {i:i, raw:raw, pl:OB.plan, bridge:document.querySelector('.ob-card').innerText};},REAL_STORY);
 ok(one.raw&&one.raw.ok&&one.raw.addrs.length===3,'fed the raw story read, the plan would take three: '+JSON.stringify(one.raw&&one.raw.addrs));
 ok(one.pl&&one.pl.ok&&JSON.stringify(one.pl.addrs)===JSON.stringify([one.i])&&one.pl.lines===4,
  'fed the one yes, it takes that one place and its four lines: '+JSON.stringify(one.pl&&{a:one.pl.addrs,l:one.pl.lines}));
 ok(/\b4 lines, all at one place\b/.test(one.bridge)&&!/touched|wait for your next/.test(one.bridge),
  'and the card says four lines at one place, with no count of places waiting');
 ok(errs.length===0,'no script error: '+errs.slice(0,3).join(' | '));
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
 console.log('  atuned_src/ui/onboard.js\'s own header, at the exact line obStoryDone hands the words to parseStory.');
 ok(q.detector==='undefined',
  'confirmed: no distress detector exists in this build (the gap is real, not assumed)');
}

console.log('\n'+PASS+' passed, '+FAIL+' failed');
await browser.close();
process.exit(FAIL?1:0);
})();
