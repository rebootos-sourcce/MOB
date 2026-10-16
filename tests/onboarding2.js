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

     5  WHAT CHANGED, the step the System Congruency audit found missing from
        every release path. The finished card asks it with the TDD's five
        answers and none chosen; the answer is written as practice evidence
        per address, linked to the entry the run came from; it survives a
        reload; and Your patterns shows it on the pattern's row. Then each of
        the five, Skip, and leaving unanswered, each on a fresh store and each
        reloaded, so nothing changed and not sure are held exactly as hard as
        a positive answer, and the graph is read after each one to show no
        evidence edge was drawn for it, nothing changed above all. Skip and
        leaving record nothing, across the reload too. Checked first against
        known bad builds: the build before this step, which asks nothing, a
        copy where the answer is shown as kept and never put on the record,
        a copy where the answer becomes a trace edge, and the first cut of
        this step, which stored a skip as a sixth value.

     6  THE ACCOUNT HEADER, ported from ab691ec on the old line. Signed in,
        the header carries the account's email under the profile name;
        signed out, it carries the name alone. The same commit's bypass of
        the opening is not here: it is parked, see TASKS.md.

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
const browser=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
require('./net.js').guardBrowser(browser);

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
 /* ROUND QH. THE BODY ON THE STAGE SAYS WHAT THE MIRROR SAYS, and nothing
    else. page.click above moved a real pointer onto the Chest chip before it
    pressed it, which is how the preview light got stuck: the chip was removed
    under the pointer and never said pointerout. So, on the mirror: no seat is
    in preview, the seats lit are exactly the seats the read put weight on,
    and the seat the person tapped is either lit by the words or marked as
    the tap, never silently dropped, which is what the card's own sentence
    "Both are kept as they are" promises. */
 const fig=await page.evaluate(()=>{
  const read=[]; (OB.read||[]).forEach(g=>{if(read.indexOf(g.seat)<0)read.push(g.seat);});
  const lit=[...document.querySelectorAll('.obx-near .obx-s.on')].map(e=>e.getAttribute('data-obseat'));
  const mark=[...document.querySelectorAll('.obx-near .obx-s.mark')].map(e=>e.getAttribute('data-obseat'));
  return {read:read.sort(), lit:lit.sort(), mark:mark, prev:document.querySelectorAll('.obx-near .prev').length,
   tap:OB_PLACES[OB.place]&&OB_PLACES[OB.place].b};});
 ok(fig.prev===0,'no seat is left in hover preview once the Body step is gone, '+fig.prev+' still are');
 ok(JSON.stringify(fig.lit)===JSON.stringify(fig.read),'the body lights exactly the seats the read put weight on, lit '+fig.lit+' read '+fig.read);
 ok(fig.read.indexOf(fig.tap)>=0?fig.mark.length===0:(fig.mark.length===1&&fig.mark[0]===fig.tap),
  'the tapped seat, '+fig.tap+', is lit by the words or marked as the tap, marked '+JSON.stringify(fig.mark));
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

 /* WHAT CHANGED, on the card the run landed on. Read off the build: the five
    keys and their words off the engine's own table, never typed here.
    ROUND QH: the two minutes are their own screen now, between the list and
    this card, and the card arrives when they run out or are skipped. This
    gate is not here to sit through two minutes, so it skips them through the
    button a person uses, which is itself checked to be there. */
 const rested=await page.evaluate(()=>{const r=document.getElementById('relrest'); if(r)r.click(); return !!r;});
 ok(rested,'the run lands on the two minutes first, and they can be skipped');
 const ask=await page.evaluate(()=>{const a=document.getElementById('relask');
  return {there:!!a, text:a?a.textContent:'',
   answers:[...document.querySelectorAll('#relask .seg [data-relsaid]')].map(b=>({k:b.getAttribute('data-relsaid'),
    p:b.getAttribute('aria-pressed'),t:b.textContent})),
   skip:!!document.querySelector('#relask .rel-act [data-relskip]'),
   ev:((CURP.practice&&CURP.practice.evidence)||[]).length,
   five:(typeof RV_ANSWERS!=='undefined')?RV_ANSWERS.slice():null, say:(typeof RV_SAY!=='undefined')?RV_SAY:{}};});
 ok(ask.there&&/What changed\?/.test(ask.text),'the finished card asks what changed, got "'+ask.text.slice(0,60)+'"');
 ok(ask.five&&JSON.stringify(ask.answers.map(a=>a.k))===JSON.stringify(ask.five)&&ask.five.length===5,
  'with exactly the five answers, in the TDD\'s order: '+JSON.stringify(ask.answers.map(a=>a.k)));
 ok(ask.answers.length===5&&ask.answers.every(a=>a.p==='false'),'and none of them chosen before the person chooses');
 ok(ask.answers.length===5&&ask.answers.every(a=>a.t===ask.say[a.k]),'each worded from the one table: '+ask.answers.map(a=>a.t).join(' / '));
 ok(ask.skip,'and a way past it, Skip');
 ok(ask.ev===0,'nothing is recorded before an answer, evidence '+ask.ev);
 if(ask.there)await page.click('#relask [data-relsaid="something_moved"]');
 await page.waitForTimeout(80);
 const said=await page.evaluate(()=>({said:(typeof RUN.said!=='undefined')?RUN.said:null,
  ev:((CURP.practice&&CURP.practice.evidence)||[]).map(e=>({m:e.metric,v:e.value,p:e.pattern_id,s:e.story_t,src:e.source})),
  q:(RUN.queue||[]).map(n=>n.i), t:CURP.story.entries[CURP.story.entries.length-1].t,
  text:(document.getElementById('relask')||{}).innerText||'', disk:localStorage.getItem(PKEY)}));
 ok(said.said==='something_moved'&&said.ev.length===said.q.length&&said.q.length>0,
  'one answer is one record per address the release worked, '+said.ev.length+' for '+said.q.length);
 ok(said.ev.length>0&&said.ev.every((e,i)=>e.m==='release_verification'&&e.v==='something_moved'&&e.p==='addr:'+said.q[i]&&e.src==='user'),
  'each carries the metric, the answer and its own address: '+JSON.stringify(said.ev.map(e=>e.p)));
 ok(said.ev.length>0&&said.ev.every(e=>e.s===said.t),'and each names the story entry the release came from, by its t, '+said.t);
 ok(/You said: Something moved\. Kept on your record\./.test(said.text),'the card says what was kept only once it is: "'+said.text.replace(/\n/g,' ')+'"');
 ok(!!said.disk&&said.disk.indexOf('release_verification')>=0,'and it is on the disk before the reload');

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
 /* F13 MOVED WHERE THE FIRST RUN ENDS. It ended at the hand off to the
    release, so this asserted the record said onboarding was finished. It ends
    on the end card now (ui/onboard.js obEndCard), after the release, so a
    record whose release landed and whose end card was never closed is not
    finished, and says it is at its end. tests/journey2.js walks the rest. */
 const jr=await page.evaluate(()=>(typeof journeyRead==='function'&&CURP)?journeyRead(CURP):null);
 ok(!back.onboarded&&!!jr&&jr.at==='end'&&jr.landed,'the record says the first run reached its end card and has not been closed yet: '
  +JSON.stringify(jr&&{at:jr.at,landed:jr.landed,onboarded:back.onboarded}));
 const vback=await page.evaluate(()=>((CURP&&CURP.practice&&CURP.practice.evidence)||[])
  .map(e=>({m:e.metric,v:e.value,p:e.pattern_id,s:e.story_t})));
 ok(vback.length>0&&JSON.stringify(vback)===JSON.stringify(said.ev.map(e=>({m:e.m,v:e.v,p:e.p,s:e.s}))),
  'every answer comes back after the reload, linked to the same addresses and entry: '+vback.length);
 await page.waitForSelector('#loginb-skip',{timeout:8000}).catch(()=>{});
 if(await page.$('#loginb-skip'))await page.click('#loginb-skip');
 await page.waitForTimeout(300);
 /* and the next visit opens that end card, never the welcome again (F13) */
 const replay=await page.evaluate(()=>({open:!!(typeof OB!=='undefined'&&OB.open),step:OB.step,end:OB_END}));
 ok(replay.open&&replay.step===replay.end,'and the welcome sheet does not replay on the next visit: the end of the first run opens, '
  +JSON.stringify(replay));
 /* YOUR PATTERNS, after the reload, on the Field's own rail: the answer is
    on each released pattern's row as what the person said, and the graph
    counts it as evidence for nothing. Every row is listed so the check does
    not depend on which four come first. */
 const lp=await page.evaluate(q=>{
  if(typeof LP!=='undefined'){LP.all=true; if(typeof loopRepaint==='function')loopRepaint();}
  const L=loopRead(CURP), rows=L.patterns.filter(x=>q.indexOf(x.address)>=0);
  const side=document.getElementById('loopside');
  return {rows:rows.map(x=>({a:x.address,said:x.said||null,evFor:x.evFor,evAgainst:x.evAgainst})),
   rail:side?side.textContent:'',
   evEdges:traceFromRecord(CURP,practiceTraceIntents(CURP.practice)).edges.filter(e=>/^evidence:/.test(e.from)).length};},said.q);
 ok(lp.rows.length===said.q.length&&lp.rows.every(r=>r.said&&r.said.n===1&&r.said.by.something_moved===1),
  'Your patterns reads the answer on every released address\'s row: '+JSON.stringify(lp.rows.map(r=>r.said)));
 ok(lp.rows.every(r=>r.evFor===0&&r.evAgainst===0),'and never counts it as evidence for or against');
 ok(lp.evEdges===0,'and the graph holds no evidence edge for it, got '+lp.evEdges);
 ok(/"Something moved" after 1 release/.test(lp.rail),'the Field rail prints it on the row, in the question\'s own words');
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

console.log('\n=== the Day One tutorial stands on the first run\'s stage, lit only where its entry landed (round QJ) ===');
/* The tutorial opened as the old popup card over a dimmed app after the
   first run had gone full screen. It now stands on the same stage (obStage,
   obSwap). Held here: it fills the viewport with no card chrome, its rail has
   five stations, nothing is lit before the commit, the seats lit after it
   are exactly the seats the commit's own kept nodes name, the step change
   leaves a ghost that carries no live control, and with reduced motion set
   nothing on it runs at all, pseudo elements included. */
for(const calm of [false,true]){
 const ctx=await browser.newContext({viewport:{width:1600,height:1000},reducedMotion:calm?'reduce':'no-preference'});
 const page=await ctx.newPage();
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const tag=calm?'reduced motion: ':'';
 const running=()=>page.evaluate(()=>{const h=document.getElementById('tutorial');
  return document.getAnimations().filter(a=>a.playState==='running'&&a.effect&&a.effect.target&&h.contains(a.effect.target))
   .map(a=>(a.animationName||a.transitionProperty||'script')+(a.effect.pseudoElement||'')).slice(0,6);});
 await page.evaluate(()=>{ loadP(0); CURP.ui=CURP.ui||{}; CURP.ui.tutorialSeen=false; tutorialOpen(true); });
 await page.waitForTimeout(calm?60:2600);
 const s0=await page.evaluate(()=>{const h=document.getElementById('tutorial'), r=h.getBoundingClientRect(),
   c=h.querySelector('.ob-card'), cs=c?getComputedStyle(c):null;
  return {full:r.width===innerWidth&&r.height===innerHeight, stage:h.classList.contains('obx'),
   border:cs?cs.borderTopWidth:'-', bg:cs?cs.backgroundColor:'-', dots:h.querySelectorAll('.obx-rail .ob-dot').length,
   inCard:c?c.querySelectorAll('.ob-dot,.ob-wash').length:-1, lit:h.querySelectorAll('.obx-near .obx-s.on').length,
   appHidden:getComputedStyle(document.querySelector('.app')).visibility==='hidden'};});
 ok(s0.full&&s0.stage,tag+'the tutorial fills the viewport on the stage, '+JSON.stringify(s0));
 ok(s0.border==='0px'&&/rgba\(0, 0, 0, 0\)|transparent/.test(s0.bg)&&s0.inCard===0,
  tag+'no card chrome: no border, no fill, no wash and no dots inside the column, '+s0.border+' '+s0.bg+' '+s0.inCard);
 ok(s0.dots===5&&s0.appHidden,tag+'five stations on the rail and the app out of the picture, '+s0.dots);
 ok(s0.lit===0,tag+'nothing is lit before anything is written, '+s0.lit);
 if(calm)ok((await running()).length===0,tag+'nothing runs on arrival, '+JSON.stringify(await running()));
 await page.fill('#tuttext',REAL_STORY);
 await page.click('[data-tut="commit"]'); await page.waitForTimeout(calm?60:120);
 const s1=await page.evaluate(()=>({lit:[...document.querySelectorAll('#tutorial .obx-near .obx-s.on')].map(e=>e.getAttribute('data-obseat')).sort(),
  want:[...new Set((TUT.commit.kept||[]).slice(0,2).map(n=>n.b))].sort(),
  ghosts:document.querySelectorAll('#tutorial .obx-ghost').length,
  ghostLive:document.querySelectorAll('#tutorial .obx-ghost [data-tut],#tutorial .obx-ghost [id]').length}));
 ok(s1.want.length>0&&JSON.stringify(s1.lit)===JSON.stringify(s1.want),
  tag+'the commit lights exactly the seats What this found names, '+JSON.stringify(s1));
 if(calm){
  ok(s1.ghosts===0,tag+'no ghost is made, '+s1.ghosts);
  ok((await running()).length===0,tag+'nothing runs on the step change, '+JSON.stringify(await running()));}
 else ok(s1.ghosts===1&&s1.ghostLive===0,tag+'the old card leaves as one ghost with no live control or id in it, '+JSON.stringify(s1));
 for(const k of [2,3,4]){
  await page.click('#tutorial .obx-slot [data-tut="next"]'); await page.waitForTimeout(calm?60:120);
  if(calm)ok((await running()).length===0,tag+'nothing runs on step '+(k+1)+', even under a pointer that has not moved: '+JSON.stringify(await running()));}
 const s4=await page.evaluate(()=>({step:TUT.step, ts:document.getElementById('tutorial').getAttribute('data-ts'),
  name:(document.querySelector('#tutorial .obx-step')||{}).textContent||''}));
 ok(s4.step===4&&s4.ts==='4'&&/Step 5 of 5/.test(s4.name),tag+'the rail and the pose follow the step, '+JSON.stringify(s4));
 await page.click('#tutorial .obx-slot [data-tut="done"]'); await page.waitForTimeout(700);
 const out=await page.evaluate(()=>{const h=document.getElementById('tutorial');
  return {shown:getComputedStyle(h).display, cls:h.className, app:getComputedStyle(document.querySelector('.app')).visibility};});
 ok(out.shown==='none'&&!/obx|tutx/.test(out.cls)&&out.app!=='hidden',
  tag+'Done takes the stage down and gives the host back plain, '+JSON.stringify(out));
 ok(errs.length===0,tag+'no script error, '+errs.slice(0,3).join(' | '));
 await ctx.close();}

console.log('\n=== what changed: every answer kept across a reload, Skip and leaving keep nothing ===');
{
 /* SEVEN FRESH STORES. The five answers, Skip, and Done pressed with nothing
    answered, each on its own browser context so nothing carries over, each
    through a real story commit and a real release to its own cooldown, then
    reloaded. Nothing changed and not sure are asserted exactly as a positive
    answer is: the TDD's "the user must not be forced to report a positive
    result" is only true if the negative ones are kept as well. */
 const CASES=[['feel_different','answer'],['see_differently','answer'],['something_moved','answer'],
  ['nothing_changed','answer'],['not_sure','answer'],[null,'skip'],[null,'leave']];
 for(const [want,how] of CASES){
  const ctx=await browser.newContext({viewport:{width:1600,height:1000}});
  const page=await ctx.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
  const tag=how==='answer'?want:'no answer, by '+how;
  await page.evaluate(()=>{ loadP(0); CURP.ui=CURP.ui||{}; CURP.ui.tutorialSeen=false; });
  await page.evaluate(SHRINK);
  await page.evaluate(()=>tutorialOpen(true));
  await page.fill('#tuttext',REAL_STORY);
  await page.click('[data-tut="commit"]'); await page.waitForTimeout(60);
  await page.click('[data-tut="next"]'); await page.waitForTimeout(40);
  await page.click('[data-tut="next"]'); await page.waitForTimeout(40);
  await page.click('[data-tut="release"]'); await page.waitForTimeout(120);
  const d=await page.$('#reldose');
  if(d){await d.evaluate(el=>{el.value='1';el.dispatchEvent(new Event('change'));});}
  await page.click('#relgo');
  await page.waitForFunction(()=>RUN.phase==='done'&&RUN.cool>=COOLING.length,null,{timeout:60000}).catch(()=>{});
  /* past the two minutes, round QH, through the button a person uses */
  await page.evaluate(()=>{const r=document.getElementById('relrest'); if(r)r.click();});
  const pre=await page.evaluate(()=>({asked:!!document.querySelector('#relask .seg'),
   ev:((CURP.practice&&CURP.practice.evidence)||[]).length, q:(RUN.queue||[]).map(n=>n.i),
   t:(CURP.story.entries[CURP.story.entries.length-1]||{}).t}));
  ok(pre.asked&&pre.ev===0&&pre.q.length>0,tag+': asked, with nothing recorded yet');
  if(pre.asked){
   if(how==='answer')await page.click('#relask [data-relsaid="'+want+'"]');
   else if(how==='skip'){const sb=await page.$('#relask [data-relskip]');
    ok(!!sb,tag+': the card offers Skip'); if(sb)await sb.click();}}
  if(how==='leave')await page.click('#relclose');
  await page.waitForTimeout(80);
  if(how==='skip'){
   const sk=await page.evaluate(()=>({said:(document.getElementById('relsaid')||{}).textContent||'',
    ev:((CURP.practice&&CURP.practice.evidence)||[]).length}));
   ok(/Skipped\. Nothing was recorded\./.test(sk.said)&&sk.ev===0,tag+': the card says nothing was kept, and nothing was: "'+sk.said+'", evidence '+sk.ev);}
  await page.reload({waitUntil:'load'}); await booted(page);
  const back=await page.evaluate(q=>{
   const ev=((CURP.practice&&CURP.practice.evidence)||[]).filter(e=>e.metric==='release_verification');
   /* THE GRAPH, read directly: every edge that leaves an evidence node, and
      every edge that lands on a released address's pattern from one */
   const g=traceFromRecord(CURP,practiceTraceIntents(CURP.practice||null));
   return {ev:ev.map(e=>({v:e.value,p:e.pattern_id,s:e.story_t})), refused:storeRefused().length,
    rows:loopRead(CURP).patterns.filter(x=>x.said&&x.said.n).map(x=>({a:x.address,by:x.said.by,evFor:x.evFor})),
    evEdges:g.edges.filter(e=>/^evidence:/.test(e.from)).map(e=>e.from+' '+e.edge+' '+e.to),
    onReleased:g.edges.filter(e=>/^evidence:/.test(e.from)&&q.some(a=>e.to==='pattern:'+a)).length};},pre.q);
  ok(back.refused===0,tag+': the record is taken back at the boundary');
  ok(back.evEdges.length===0&&back.onReleased===0,tag+': the graph holds no evidence edge for it, to a released address or anywhere: '+JSON.stringify(back.evEdges));
  if(how==='answer'){
   ok(back.ev.length===pre.q.length&&back.ev.length>0&&back.ev.every(e=>e.v===want),
    tag+': kept across the reload as '+want+' at every address, '+JSON.stringify(back.ev.map(e=>e.v)));
   ok(back.ev.length>0&&back.ev.every((e,i)=>e.p==='addr:'+pre.q[i]&&e.s===pre.t),tag+': linked to the addresses and the story entry');
   ok(back.rows.length===pre.q.length&&back.rows.every(r=>r.by[want]===1&&r.evFor===0),
    tag+': Your patterns shows it on each row and never as support');}
  else{
   ok(back.ev.length===0,tag+': nothing is on the record after the reload, '+JSON.stringify(back.ev.map(e=>e.v)));
   ok(back.rows.length===0,tag+': and Your patterns grows no row from it, '+back.rows.length);}
  ok(errs.length===0,tag+': no script error: '+errs.slice(0,3).join(' | '));
  await ctx.close();}
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

console.log('\n=== a record the boundary refuses at boot is reported, and kept, never silent (round QB) ===');
{
 /* storeRefused() had no caller, so a store that parsed but held a record the
    boundary would not take opened a blank profile and said nothing. The record
    here is what onboarding writes, with one answer made impossible: the same
    place both yes and no, which OB.ans cannot hold. Checked against the build
    before the fix, where the status assertion fails because nothing is said. */
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE,{waitUntil:'load'}); await booted(page);
 const seeded=await page.evaluate(()=>{
  const p=saveProfile(blankProfile('Kept'));
  const i=NODES.filter(n=>n.cf)[0].i;
  p.story={entries:[{t:new Date().toISOString(),text:'I felt tight in my chest',imprints:1,bands:{heart:5},
   ob:{pick:0,feel:0,place:3,yes:[i],no:[i]}}]};
  const raw=JSON.stringify([p]); localStorage.setItem(PKEY,raw); return raw;});
 await page.reload({waitUntil:'load'}); await booted(page);
 const r=await page.evaluate(()=>({refused:storeRefused(), names:PROFILES.map(p=>p.name),
  log:MSG_LOG.map(m=>m.kind+': '+m.msg), disk:localStorage.getItem(PKEY)}));
 ok(r.refused.length===1&&/ob\.no\[0\] is also a yes/.test(r.refused[0].errs.join(' ')),
  'the impossible answer is refused by name, '+JSON.stringify(r.refused));
 ok(r.log.some(m=>/^fail: One saved profile could not be read by this version of the app, so this is a new blank profile\. It is kept in this browser, untouched\.$/.test(m)),
  'and the person is told, on the status line, that it was not read and is kept: '+JSON.stringify(r.log));
 const disk=JSON.parse(r.disk||'[]');
 ok(disk.some(p=>p.name==='Kept'&&JSON.stringify(p)===JSON.stringify(JSON.parse(seeded)[0])),
  'and the refused record is still on the disk, byte for byte the same, beside the blank');
 ok(r.names.indexOf('Kept')<0,'and it is never loaded or shown');
 ok(errs.length===0,'no script error: '+errs.slice(0,3).join(' | '));
 await page.close();
}

console.log('\n=== the Account header names the account signed in (ab691ec, ported) ===');
/* The Account page's header named the profile and never the account it is
   signed in under, and the email stood only on the Account section's own row,
   so Security and Billing, which describe the account, did not say which one.
   Billing is read here for that reason.

   The session is put in place with authKeep, the one writer a real sign in
   uses, and the server is pointed at a port nothing listens on, so nothing
   leaves this machine: the header reads the held session and asks nobody.
   The name is read off the page's own rule, capName of the open profile's
   name, so this checks where the email sits and not what a profile is called.

   Checked against main before the port, where the signed in check fails on no
   email, and against the port, where both pass. */
{
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 const errs=[]; page.on('pageerror',e=>errs.push(e.message));
 await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
 const hd=await page.evaluate(mail=>{AUTH_API='http://127.0.0.1:1';
  authKeep({token:'t-header',email:mail,accountId:'acc_header'});
  ACC_OPEN='billing'; setTab(TAB.SETTINGS); render(); renderAccount();
  const want=capName((CURP&&CURP.name)||'You');
  const h=document.querySelector('#settings .ac-hd'), e=h&&h.querySelector('h2+.ac-em');
  const out={want:want, name:h&&(h.querySelector('h2')||{}).textContent, em:e?e.textContent:null};
  authForget(); renderAccount();
  const h2=document.querySelector('#settings .ac-hd');
  out.outName=h2&&(h2.querySelector('h2')||{}).textContent; out.outEm=!!(h2&&h2.querySelector('.ac-em'));
  return out;},'header@example.invalid');
 ok(hd.name===hd.want&&hd.em==='header@example.invalid',
  'signed in, the Account header carries the profile name and, under it, the account: '+JSON.stringify(hd));
 ok(hd.outName===hd.want&&!hd.outEm,'signed out, it carries the name alone, with no empty line under it');
 ok(errs.length===0,'no script error: '+errs.slice(0,3).join(' | '));
 await page.close();
}

console.log('\n=== Is this a crisis, on the welcome and after it (16 October) ===');
/* His words: "Maybe [the crisis check] belongs in the pop-up, the welcome.
   Maybe it's an option. Is this a crisis? Hit that button. Tell me about it.
   Do you need immediate emergency contact, or would you like to talk it
   through? It's always a story."

   Walked through the real door at both widths, the way a stranger meets it:
   the button is on the login card and on the first run's stage, it opens one
   panel, the panel's first choice shows the three numbers as links, Escape
   shuts the panel and only the panel, Talk it through lands in the Story box,
   and the profile menu carries the same press after the first run. And the
   cards it sits on are read back word for word, so the button cannot have
   moved anything else on them. SHOTS=dir saves the pictures. Checked against
   the build before the button, where it fails at its first row, on the
   missing button, and cannot go on. */
{
 const SHOTS=process.env.SHOTS||'';
 /* THE WELCOME WAS SHOT EMPTY. Its card's words animate in, and 400ms after
    Guest the picture caught the stage with the ring drawn and no card on it,
    while the assertions beside it, which read the DOM, passed. A reviewer
    judging the screen from that picture judges a frame nobody stops on. So
    the shot waits for every finite animation to finish, and never more than
    three seconds: the ring breathes for ever and is left out, and a paused
    one would otherwise hold the run. Pictures only; no assertion reads it.
    And the pointer leaves the card first: the click on Reach someone now
    left it resting where Text 741741 then drew, so the 390 picture showed
    that link in its hover dark, which no person on a phone ever sees. */
 const shot=async(p,n)=>{if(!SHOTS)return;
  await p.mouse.move(0,0);
  await p.evaluate(()=>Promise.race([new Promise(r=>setTimeout(r,3000)),
   Promise.all(document.getAnimations().filter(a=>{const t=a.effect&&a.effect.getComputedTiming();
    return t&&t.iterations!==Infinity;}).map(a=>a.finished.catch(()=>{})))]));
  await p.screenshot({path:path.join(SHOTS,n+'.png')});};
 for(const [w,h] of [[1600,1000],[390,844]]){
  const at=' at '+w;
  const page=await browser.newPage({viewport:{width:w,height:h}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE,{waitUntil:'load'}); await booted(page);
  await page.waitForSelector('#loginb-skip',{timeout:8000});
  await page.waitForTimeout(400);
  const rect=sel=>page.evaluate(sel=>{const e=document.querySelector(sel); if(!e)return null;
   const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom,r:r.right,
    on:r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};},sel);
  const inPanel=()=>page.evaluate(()=>{const c=document.getElementById('crisis');
   return !!c&&!c.hidden&&c.contains(document.activeElement);});

  /* the login door, the first card */
  const door=await page.evaluate(()=>({acts:[...document.querySelectorAll('#login .ob-acts .btn')].map(b=>b.textContent),
   h:(document.querySelector('#login .ob-h')||{}).textContent,
   btn:(document.querySelector('#login [data-crisis="open"]')||{}).textContent||null}));
  ok(door.btn==='Is this a crisis?','the login door carries the button'+at+', got '+door.btn);
  ok(JSON.stringify(door.acts)==='["Log in","Create account","Guest"]'&&door.h==='Log in',
   'and its own heading and three ways in are unchanged'+at+', '+JSON.stringify(door));
  const lb=await rect('#login [data-crisis="open"]');
  ok(lb&&lb.on&&lb.h>=44&&lb.r<=w&&lb.b<=h,'at the 44 pixel floor and on the first screen'+at+', '+JSON.stringify(lb));
  await shot(page,'crisis-door-'+w);
  await page.click('#login [data-crisis="open"]'); await page.waitForTimeout(150);
  const ask=await page.evaluate(()=>{const c=document.getElementById('crisis'), d=c&&c.querySelector('[role="dialog"]');
   return {open:!!c&&!c.hidden, modal:!!d&&d.getAttribute('aria-modal')==='true'&&d.getAttribute('aria-labelledby')==='crxh',
    h:(c.querySelector('#crxh')||{}).textContent, text:c.innerText,
    btns:[...c.querySelectorAll('.crx-acts button')].map(b=>b.textContent),
    top:c.contains(document.elementFromPoint(innerWidth/2,innerHeight/2))};});
  ok(ask.open&&ask.modal&&ask.top,'pressed, one panel opens on top of the door, a labelled modal dialog'+at);
  ok(ask.h==='Tell me about it.'&&/Do you need to reach someone right now, or would you like to talk it through\?/.test(ask.text),
   'it says "Tell me about it." and asks the one question'+at+', '+JSON.stringify(ask.text));
  /* WHERE TALK IT THROUGH GOES, AND WHO READS IT, 16 October. The line says
     "No person reads it", which is true of this build only while the journal
     stays on the device: profile sync off, and no request carries an entry.
     So the line and the switch are read together, and the day sync is turned
     on with this line still printed, this fails and somebody rewrites it. */
  const jr=await page.evaluate(()=>({line:/Talk it through opens your journal\. No person reads it\./.test(document.getElementById('crisis').innerText),
   sync:typeof PROFILE_SYNC_ENABLED==='undefined'?'missing':PROFILE_SYNC_ENABLED}));
  ok(jr.line&&jr.sync===false,'under the question it says Talk it through opens the journal and no person reads it, '
   +'and that is true: profile sync is off'+at+', '+JSON.stringify(jr));
  ok(JSON.stringify(ask.btns)==='["Reach someone now","Talk it through","Close"]','with the two choices and a way out'+at+', '+JSON.stringify(ask.btns));
  ok(await inPanel(),'focus moves into the panel'+at);
  await shot(page,'crisis-ask-'+w);
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  const esc1=await page.evaluate(()=>({shut:document.getElementById('crisis').hidden, door:LOGIN.open,
   back:!!(document.activeElement&&document.activeElement.matches('#login [data-crisis="open"]'))}));
  ok(esc1.shut&&esc1.door&&esc1.back,'Escape shuts the panel and only the panel, and focus is back on the button'+at+', '+JSON.stringify(esc1));

  /* the first run's stage, every step */
  await page.click('#loginb-skip'); await page.waitForTimeout(500);
  const arrive=await page.evaluate(()=>({open:OB.open, step:OB.step,
   h:(document.querySelector('#ob .ob-card .ob-h')||{}).textContent,
   p:[...document.querySelectorAll('#ob .ob-card .ob-p')].map(e=>e.textContent),
   acts:[...document.querySelectorAll('#ob .ob-card .ob-acts .btn')].map(b=>b.textContent),
   inCard:!!document.querySelector('#ob .ob-card [data-crisis]'),
   btn:(document.querySelector('#ob .obx-top [data-crisis="open"]')||{}).textContent||null}));
  ok(arrive.open&&arrive.step===0&&arrive.btn==='Is this a crisis?','the first run\'s first card stands under the same button'+at);
  ok(!arrive.inCard&&arrive.h==='This is you, and it is okay.'&&JSON.stringify(arrive.acts)==='["Come in","Not now"]'
   &&arrive.p.length===3&&arrive.p[0]==='No judgment. Nothing here grades you. This one is for you.',
   'and nothing on the card itself changed: the button is the stage\'s, not the card\'s'+at+', '+JSON.stringify(arrive));
  const sb=await rect('#ob .obx-crx');
  const clash=await page.evaluate(()=>{const b=document.querySelector('#ob .obx-crx').getBoundingClientRect();
   return [...document.querySelectorAll('#ob .ob-card .ob-h,#ob .ob-card .ob-p,#ob .ob-card .ob-acts .btn,#ob .obx-x,#ob .obx-rail')]
    .filter(e=>{const r=e.getBoundingClientRect(); return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'
     &&!(r.right<=b.left||r.left>=b.right||r.bottom<=b.top||r.top>=b.bottom);}).map(e=>e.className);});
  ok(sb&&sb.on&&sb.h>=44&&sb.r<=w&&!clash.length,'at the floor and over nothing it could hide'+at+', '+JSON.stringify({sb,clash}));
  await shot(page,'crisis-welcome-'+w);
  await page.click('[data-ob="next"]'); await page.waitForTimeout(400);
  ok((await rect('#ob .obx-crx')||{}).on===true,'and it is still there on the next step'+at);
  /* IN THE BAR'S ROW AT EVERY WIDTH TESTED, 16 October, from the review of
     these screens: at 390 it hung under the bar beside the avatar's head.
     Read on this step, where Not now is showing and the row is fullest:
     the pill's box is inside the bar, and the wordmark, the dots, their
     words, the pill and Not now each keep four pixels of air. Checked
     against the build before the move, where the pill sat 60 to 104 pixels
     down at 390. */
  const rowFit=await page.evaluate(()=>{const bar=document.querySelector('#ob .obx-top').getBoundingClientRect();
   const sel={mark:'#ob .obx-mark',track:'#ob .obx-track',step:'#ob .obx-step',crx:'#ob .obx-crx',x:'#ob .obx-x'}, box={};
   for(const k in sel){const e=document.querySelector(sel[k]); if(!e)continue; const q=e.getBoundingClientRect();
    if(q.width&&q.height&&getComputedStyle(e).visibility!=='hidden')box[k]={l:q.left,r:q.right,t:q.top,b:q.bottom};}
   const ks=Object.keys(box), tight=[];
   for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const A=box[ks[i]],B=box[ks[j]];
    if(!(A.r+4<=B.l||A.l>=B.r+4||A.b<=B.t||A.t>=B.b))tight.push(ks[i]+'/'+ks[j]);}
   return {inRow:!!box.crx&&box.crx.t>=bar.top&&box.crx.b<=bar.bottom, x:!!box.x, tight};});
  ok(rowFit.inRow&&rowFit.x&&!rowFit.tight.length,'in the bar\'s own row beside Not now, every item with room around it'+at+', '+JSON.stringify(rowFit));
  await page.click('[data-ob="back"]'); await page.waitForTimeout(400);

  await page.click('#ob .obx-crx'); await page.waitForTimeout(150);
  await page.click('#crisis [data-crisis="reach"]'); await page.waitForTimeout(150);
  const reach=await page.evaluate(()=>{const c=document.getElementById('crisis');
   return {h:(c.querySelector('#crxh')||{}).textContent, text:c.innerText,
    hrefs:[...c.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),
    tall:Math.min(...[...c.querySelectorAll('a[href],button')].map(e=>e.getBoundingClientRect().height)),
    fits:c.querySelector('.crx-card').getBoundingClientRect().bottom<=innerHeight,
    focus:c.contains(document.activeElement), stage:OB.open&&OB.step===0};});
  ok(reach.h==='Reach someone now'&&reach.focus&&reach.stage,'Reach someone now shows the numbers in the same panel, over the stage'+at);
  ok(['tel:988','sms:988','sms:741741?body=HOME','tel:911'].every(x=>reach.hrefs.indexOf(x)>=0),
   'as tel: and sms: links: 988 to call and to text, 741741 with home in the message, and 911'+at+', '+JSON.stringify(reach.hrefs));
  ok(/988, Suicide and Crisis Lifeline\. Call or text, any hour\. A trained person answers\./.test(reach.text)
   &&/741741, Crisis Text Line\. Text the word home\. A trained person writes back\./.test(reach.text)
   &&/911, police, fire or an ambulance\. If you are in danger now\./.test(reach.text)
   &&/988 also works in Canada\. Elsewhere, call your local emergency number\./.test(reach.text)
   &&!/\bUS numbers\b/.test(reach.text),
   'each number opens on its name, and the line under them says where else 988 answers'+at+', '+JSON.stringify(reach.text));
  ok(reach.tall>=44&&reach.fits,'every link and button at the floor, the whole panel on one screen'+at+', '+JSON.stringify({tall:reach.tall,fits:reach.fits}));
  /* ONE FILLED BUTTON, and it is Call 988: read off the painted backgrounds,
     so a class that styles nothing cannot pass it. The pointer leaves first:
     it rests where Reach someone now was, which at 390 is over a link, and a
     hover is a third background. */
  await page.mouse.move(0,0); await page.waitForTimeout(250);
  const fill=await page.evaluate(()=>{const c=document.getElementById('crisis');
   const bg=e=>getComputedStyle(e).backgroundColor;
   const all=[...c.querySelectorAll('a[href],button')], card=bg(c.querySelector('.crx-card'));
   const kinds={}; all.forEach(e=>{const k=bg(e); (kinds[k]=kinds[k]||[]).push(e.getAttribute('href')||e.textContent);});
   return {card, kinds};});
  const solo=Object.values(fill.kinds).filter(v=>v.length===1);
  ok(solo.length===1&&solo[0][0]==='tel:988'&&Object.keys(fill.kinds).length===2,
   'Call 988 is the one filled button, every other link and button shares one outline style'+at+', '+JSON.stringify(fill.kinds));
  await shot(page,'crisis-reach-'+w);
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  const esc2=await page.evaluate(()=>({shut:document.getElementById('crisis').hidden, ob:OB.open, step:OB.step}));
  ok(esc2.shut&&esc2.ob&&esc2.step===0,'Escape over the stage shuts the panel and leaves the first run where it was'+at+', '+JSON.stringify(esc2));
  /* the backdrop is a way out too */
  await page.click('#ob .obx-crx'); await page.waitForTimeout(150);
  await page.mouse.click(4,h-4); await page.waitForTimeout(150);
  ok(await page.evaluate(()=>document.getElementById('crisis').hidden&&OB.open),'and so does the backdrop'+at);

  await page.click('#ob .obx-crx'); await page.waitForTimeout(150);
  await page.click('#crisis [data-crisis="talk"]'); await page.waitForTimeout(800);
  const talk=await page.evaluate(()=>({shut:document.getElementById('crisis').hidden, ob:OB.open, story:S.tab===TAB.STORY,
   box:!!(document.activeElement&&document.activeElement.id==='sttext'),
   line:(document.getElementById('stcrisis')||{}).textContent||null, empty:(document.getElementById('sttext')||{}).value===''}));
  ok(talk.shut&&!talk.ob&&talk.story&&talk.box&&talk.empty,
   'Talk it through lands in the Story box, open, focused and empty'+at+', '+JSON.stringify(talk));
  ok(talk.line==='It is always a story. Write what is happening, or what happened.','with one line above it saying what it is for'+at+', '+talk.line);
  await shot(page,'crisis-story-'+w);
  /* THE WAY BACK TO THE NUMBERS, from the review of these screens: Talk it
     through used to leave the person on the full Story page with no way back
     to the three numbers. Reach someone now stands beside the line and beside
     Commit, and opens the same panel on the numbers. Checked against the
     build before the doors, where it fails here, on no door. */
  const doors=await page.evaluate(()=>[...document.querySelectorAll('[data-crisis="reachnow"]')].map(b=>{
    const r=b.getBoundingClientRect();
    return {t:b.textContent, h:Math.round(r.height), on:r.width>0&&r.height>0&&r.right<=innerWidth,
     row:!!b.closest('.st-crxrow'), bar:!!b.closest('.st-bar')&&!!b.parentNode.querySelector('#stapply')};}));
  ok(doors.length===2&&doors.every(d=>d.t==='Reach someone now'&&d.on&&d.h>=44)
   &&doors.some(d=>d.row)&&doors.some(d=>d.bar),
   'Reach someone now stands beside the line and beside Commit, at the floor'+at+', '+JSON.stringify(doors));
  /* a missing door is a named failure and not a thirty second click timeout
     that ends the run before the checks after it */
  if(await page.$('.st-bar [data-crisis="reachnow"]'))
   await page.click('.st-bar [data-crisis="reachnow"]');
  await page.waitForTimeout(150);
  const back=await page.evaluate(()=>{const c=document.getElementById('crisis');
   return {open:!c.hidden, h:(c.querySelector('#crxh')||{}).textContent,
    hrefs:[...c.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))};});
  ok(back.open&&back.h==='Reach someone now'&&back.hrefs.indexOf('tel:988')>=0,
   'and it opens the panel straight on the numbers'+at+', '+JSON.stringify(back));
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  const stay=await page.evaluate(()=>({shut:document.getElementById('crisis').hidden, story:S.tab===TAB.STORY,
   line:!!document.getElementById('stcrisis'),
   back:!!(document.activeElement&&document.activeElement.matches('.st-bar [data-crisis="reachnow"]'))}));
  ok(stay.shut&&stay.story&&stay.line&&stay.back,
   'Escape puts the person back on the Story page, the line still there, focus on the door'+at+', '+JSON.stringify(stay));

  /* after the first run, the profile menu */
  await page.click('#profbtn'); await page.waitForTimeout(250);
  const row=await rect('#profmenu [data-pmcrisis]');
  ok(row&&row.on&&row.h>=44,'after the first run, the profile menu carries the same press'+at+', '+JSON.stringify(row));
  await page.click('#profmenu [data-pmcrisis]'); await page.waitForTimeout(150);
  const fromMenu=await page.evaluate(()=>({open:!document.getElementById('crisis').hidden,
   menu:document.getElementById('profmenu').hidden, h:(document.getElementById('crxh')||{}).textContent}));
  ok(fromMenu.open&&fromMenu.menu&&fromMenu.h==='Tell me about it.','and it opens the same panel, the menu shut behind it'+at+', '+JSON.stringify(fromMenu));
  await page.click('#crisis [data-crisis="close"]'); await page.waitForTimeout(150);
  const closed=await page.evaluate(()=>({shut:document.getElementById('crisis').hidden,
   back:!!(document.activeElement&&document.activeElement.id==='profbtn'), story:S.tab===TAB.STORY}));
  ok(closed.shut&&closed.back&&closed.story,'Close shuts it, focus is back on the profile button, and nothing moved'+at+', '+JSON.stringify(closed));
  ok(errs.length===0,'no script error'+at+': '+errs.slice(0,3).join(' | '));
  await page.close();
 }
}

console.log('\n=== the floor band says where to go and gives the door to it (16 October) ===');
/* The lowest band's "Where it goes" told a person to take the weight off with
   somebody else and gave them nobody to reach. The review of the crisis
   screens ruled the button directly under that sentence, as visible as the
   page's own Run a release. The profile is chosen by its computed band, the
   one starting at zero, never by its place in the roster; the comparison
   profile is any band above it. Checked against the build before the button,
   where it fails at its first row, on the missing button. */
{
 const SHOTS=process.env.SHOTS||'';
 for(const [w,h] of [[1600,1000],[390,844]]){
  const at=' at '+w;
  const page=await browser.newPage({viewport:{width:w,height:h}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(FILE+'?dev=1',{waitUntil:'load'}); await booted(page);
  await page.waitForTimeout(300);
  const who=await page.evaluate(()=>{const all=PEOPLE.map((x,i)=>{loadP(i); const r=compute();
    return {i,nm:x.nm,at:r.tier&&TIER_BY[r.tier]?TIER_BY[r.tier].at:null};});
   return {floor:all.find(x=>x.at===0), above:all.find(x=>x.at!==null&&x.at>0)};});
  ok(!!who.floor&&!!who.above,'the roster has a profile on the floor band and one above it'+at+', '+JSON.stringify(who));
  if(!who.floor||!who.above){ await page.close(); continue; }
  await page.evaluate(i=>{loadP(i);setTab(TAB.SUMMARY);render();},who.floor.i);
  await page.waitForTimeout(500);
  const plate=await page.evaluate(()=>{const tw=document.querySelector('.s-ptoward'),
    b=tw&&tw.querySelector('[data-crisis="open"]'), rel=document.querySelector('.s-oact');
   const box=e=>{if(!e)return null; const r=e.getBoundingClientRect(), cs=getComputedStyle(e);
    return {h:Math.round(r.height),fs:cs.fontSize,c:cs.color,top:Math.round(r.top),
     on:r.width>0&&r.height>0&&cs.visibility!=='hidden'};};
   return {text:tw?tw.textContent:'', btn:b?b.textContent:null, near:!!b&&b.classList.contains('crx-near'),
    under:!!b&&tw.textContent.indexOf(TIER_BY.Contracted.toward)>=0
     &&tw.innerHTML.indexOf(TIER_BY.Contracted.toward)<tw.innerHTML.indexOf('data-crisis'),
    b:box(b), rel:box(rel)};});
  ok(plate.btn==='Is this a crisis?'&&plate.near&&plate.under,
   'on the floor band the crisis button sits directly under "Where it goes"'+at+', '+JSON.stringify(plate.text));
  ok(plate.b&&plate.b.on&&plate.b.h>=44&&plate.rel&&plate.b.fs===plate.rel.fs&&plate.b.c===plate.rel.c,
   'at the tap floor, in the size and ink of the page\'s own Run a release'+at+', '+JSON.stringify({b:plate.b,rel:plate.rel}));
  /* benign and malignant carry their plain meaning in the sentence that says
     them, round PO's rule, and the meaning is the glossary's own sentence */
  const lean=await page.evaluate(()=>{const p=[...document.querySelectorAll('.s-story .s-p')]
    .map(e=>e.textContent).find(t=>/Your energy leans (benign|malignant)/.test(t))||'';
   const w=(p.match(/Your energy leans (benign|malignant)/)||[])[1]||null;
   return {w, p, says:w?unpackOf(w,'rail'):null};});
  ok(lean.w&&lean.says&&lean.p.indexOf(lean.says)>lean.p.indexOf('Your energy leans'),
   'the reading says what '+lean.w+' means in the same sentence run'+at+', '+JSON.stringify(lean.p.slice(0,200)));
  /* a missing button is a named failure above and below, never a click
     timeout that ends the run before the rest of the block */
  if(plate.b){
   await page.locator('.s-ptoward [data-crisis="open"]').scrollIntoViewIfNeeded();
   if(SHOTS){ await page.mouse.move(0,0); await page.waitForTimeout(200);
    await page.screenshot({path:path.join(SHOTS,'crisis-floor-'+w+'.png')}); }
   await page.click('.s-ptoward [data-crisis="open"]'); await page.waitForTimeout(150);
  }
  const opened=await page.evaluate(()=>({open:!document.getElementById('crisis').hidden,
   h:(document.getElementById('crxh')||{}).textContent}));
  ok(opened.open&&opened.h==='Tell me about it.','and it opens the same panel'+at+', '+JSON.stringify(opened));
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  /* the band drill (runCompassDrill, the side panel the band label opens)
     prints the same sentence, so it carries the same door. Counted in the
     document and not by size: at 390 the side panel is folded away. */
  await page.evaluate(()=>{S.pin=null; runCompassDrill(); render();}); await page.waitForTimeout(400);
  const drill=await page.evaluate(()=>{const b=[...document.querySelectorAll('[data-crisis="open"].crx-near')]
    .filter(e=>!e.closest('.s-ptoward'));
   return {n:b.length, want:TIER_BY.Contracted.toward,
    after:b.length?(b[0].closest('.crx-line').previousElementSibling||{}).textContent:null};});
  ok(drill.n===1&&drill.after===drill.want,
   'the band drill carries it directly under the same sentence'+at+', '+JSON.stringify(drill));
  /* and a band above the floor carries no such button: it is a door for the
     reading that told a person to reach somebody, not decoration. The drill
     is opened again for that profile, so both surfaces are compared. */
  await page.evaluate(i=>{loadP(i);setTab(TAB.SUMMARY);S.pin=null;runCompassDrill();render();},who.above.i);
  await page.waitForTimeout(400);
  const above=await page.evaluate(()=>document.querySelectorAll('.crx-near').length);
  ok(above===0,'and a profile above the floor band gets none, '+who.above.nm+at+', found '+above);
  ok(errs.length===0,'no script error'+at+': '+errs.slice(0,3).join(' | '));
  await page.close();
 }
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
