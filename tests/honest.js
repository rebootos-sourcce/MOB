#!/usr/bin/env node
/* ============================================================
   THE FIRST WRITES TELL THE TRUTH. P1-H, block G1 of pass 4.

   mkdir -p /tmp/atuned-p1h && flock -o -w 600 -E 75 /tmp/atuned-browser.lock \
     env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     TMPDIR=/tmp/atuned-p1h node tests/honest.js
   ATUNED_FILE=file    runs against another build, for checking the checker
   W=390 H=844         the phone

   What it holds, each read off the SAVED record after a reload and never
   only off a live variable:

     the Story page keeps a half written entry across a reload, and an
     unsent reply in the reply line keeps its own draft the same way; Clear
     and Commit each take both off the record;
     with a store that refuses writes, Commit never says "Committed", says
     plainly that nothing reached the record, leaves the words in the entry,
     and a second press asks the browser again rather than writing the story
     twice; once the store works, the same press lands one entry;
     with a store that refuses writes, a finished release says it was not
     saved, carries the fail mark, and no line anywhere reads "Error.";
     the answer to What changed is never shown as kept when it was not;
     on Your patterns the answer to What changed and the yes on the pattern
     each say which question they answer.

   Probe 6 of pass 4 found the first two. It also put "Not saved. Error." on
   the release, and that line was the commit's: saveYou's debounced write
   fired 400 ms after Commit, inside the probe's next step. Measured here by
   reading each message the moment it is written.

   THE JOURNAL IS CONVERSATION ONLY NOW, round of 28 October: the plain
   write box (#sttext) does not render in the ordinary flow any more, words
   reach the entry through the reply line (#stcin) and a send, and the reply
   line carries its own draft (CURP.story.reply) the same way the entry
   carries its (CURP.story.draft), both through stDraft in
   atuned_src/ui/storyui.js. What this file checks did not change; how the
   words get into the entry did. */
const { chromium } = require('playwright');
const path = require('path');
const FILE = path.resolve(process.env.ATUNED_FILE || path.join(__dirname, '..', 'source.html'));
const W = +process.env.W || 1600, H = +process.env.H || 1000;
const STORY = 'I was humiliated in the meeting and I said nothing. I felt small and ashamed and my stomach was in a knot.';
const HALF = 'I keep thinking about what he said at dinner and my jaw is';
const SHRINK = 'REL_WORD_S=0.0004;REL_GAP_S=0.001;REL_HEAD_S=0;REL_FRAME_S=0;';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ok   ' + m); } else { fail++; console.log('  FAIL ' + m); } };

const booted = async p => { await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 20000 }).catch(() => {}); };
async function story(p) { await p.evaluate(() => setTab(TAB.STORY)); await p.waitForTimeout(300); }
/* box reads the reply line's own draft, the unsent words; entryText reads
   the whole entry the conversation has built so far, sent but not yet
   committed. They are two different drafts now (CURP.story.reply and
   CURP.story.draft) and this file holds both. */
const box = p => p.evaluate(() => { const t = document.getElementById('stcin'); return t ? t.value : null; });
const entryText = p => p.evaluate(() => typeof ST_TEXT === 'string' ? ST_TEXT : null);
/* a reply sent the way a person sends one, Enter in the reply line */
const send = async (p, t) => { await p.fill('#stcin', t); await p.press('#stcin', 'Enter'); await p.waitForTimeout(200); };
const saved = p => p.evaluate(() => { try { return JSON.parse(localStorage.getItem(PKEY) || '[]'); } catch (e) { return null; } });
const own = recs => (recs || [])[0] || null;
/* the store refuses the record's key, the way a full disk or a blocked store does */
const refuse = (p, on) => p.evaluate(on => {
  if (!window.__set) { window.__set = STORE.set; STORE.set = function (k, v) { if (window.__no && k === PKEY) throw new Error('QuotaExceededError'); return window.__set(k, v); }; }
  window.__no = on; }, on);
const log = p => p.evaluate(() => MSG_LOG.map(m => ({ k: m.kind, m: m.msg })));
const clearLog = p => p.evaluate(() => { MSG_LOG.length = 0; });
/* a press, read as a press: on a build where Commit is disabled the press is a
   no and the assertions after it say so, where page.click waited thirty
   seconds and crashed the run on the base build instead of failing it */
const press = (p, sel) => p.evaluate(s => { const b = document.querySelector(s); if (b && !b.disabled) { b.click(); return true; } return false; }, sel);

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
require('./net.js').guardBrowser(browser);
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  /* the Worker host is cut, so nothing here waits on a network */
  await ctx.route(/workers\.dev/, r => r.abort('failed'));
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + FILE + '?dev=1', { waitUntil: 'load' }); await booted(p);
  console.log(`\n=== the first writes tell the truth, at ${W} by ${H} ===`);

  console.log('\n-- the entry\'s draft, sent but not committed --');
  await story(p);
  await send(p, HALF);
  await p.waitForTimeout(900);
  ok(own(await saved(p)) && own(await saved(p)).story.draft === HALF, 'a sent but uncommitted entry is on the saved record');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await entryText(p)) === HALF, 'and is back in the entry after a reload');
  await p.click('#stclear'); await p.waitForTimeout(200);
  ok(own(await saved(p)) && own(await saved(p)).story.draft === undefined, 'Clear takes it off the saved record at once');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await entryText(p)) === '', 'and the entry is empty after a reload');

  console.log('\n-- the reply line\'s own draft, never sent --');
  await p.fill('#stcin', HALF); await p.waitForTimeout(900);
  ok(own(await saved(p)) && own(await saved(p)).story.reply === HALF, 'an unsent reply is on the saved record');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await box(p)) === HALF, 'and is back in the reply line after a reload');
  await p.click('#stclear'); await p.waitForTimeout(200);
  ok(own(await saved(p)) && own(await saved(p)).story.reply === undefined, 'Clear takes it off the saved record at once');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await box(p)) === '', 'and the reply line is empty after a reload');

  console.log('\n-- Commit with a store that refuses --');
  const n0 = (own(await saved(p)) || { story: { entries: [] } }).story.entries.length;
  await send(p, STORY); await p.waitForTimeout(500);
  await refuse(p, true); await clearLog(p);
  await press(p, '#stapply'); await p.waitForTimeout(700);
  let L = await log(p);
  ok(!L.some(x => /^Committed/.test(x.m)), 'Commit does not say Committed: ' + JSON.stringify(L.map(x => x.m)));
  ok(L.length && L[L.length - 1].k === 'fail', 'the last line carries the fail mark');
  ok(L.length && /would not save/.test(L[L.length - 1].m) && /still in the box/.test(L[L.length - 1].m),
    'it says the browser would not save and the words are still in the box');
  ok(!L.some(x => /Error\.$/.test(x.m)), 'no line ends on "Error."');
  ok((await entryText(p)) === STORY, 'the words are still in the entry');
  const mem1 = await p.evaluate(() => CURP.story.entries.length);
  await press(p, '#stapply'); await p.waitForTimeout(300);
  ok((await p.evaluate(() => CURP.story.entries.length)) === mem1, 'a second press asks again and does not write the story twice');
  await refuse(p, false); await clearLog(p);
  await press(p, '#stapply'); await p.waitForTimeout(300);
  L = await log(p);
  ok(L.some(x => /^Committed/.test(x.m)), 'once the store works, the same press says Committed');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  const r1 = own(await saved(p));
  ok(r1 && r1.story.entries.length === n0 + 1, 'and exactly one entry is on the saved record (' + (r1 && r1.story.entries.length) + ' of ' + (n0 + 1) + ')');
  ok(r1 && r1.story.entries.length && r1.story.entries[r1.story.entries.length - 1].text === STORY, 'it is the words as typed');
  ok(r1 && r1.story.draft === undefined, 'and the draft is off the record');

  console.log('\n-- a release with a store that refuses --');
  await p.evaluate(SHRINK);
  const rec0 = own(await saved(p)) || {};
  const axes0 = JSON.stringify(rec0.axes || null), meter0 = JSON.stringify(rec0.meter || null), hist0 = (rec0.history || []).length;
  await refuse(p, true); await clearLog(p);
  await p.evaluate(() => { const g = document.getElementById('strun'); if (g && !g.disabled) g.click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); } });
  const done = await p.waitForFunction(() => typeof RUN !== 'undefined' && RUN.phase === 'done' && RUN.cool >= COOLING.length, null, { timeout: 90000 }).then(() => true, () => false);
  ok(done, 'the release runs to its end');
  await p.waitForTimeout(600);
  L = await log(p);
  ok(L.some(x => x.k === 'fail' && /would not save/.test(x.m) && /release/.test(x.m)), 'the release says it was not saved, with the fail mark: ' + JSON.stringify(L.map(x => x.m)));
  ok(!L.some(x => /Error\.$/.test(x.m)), 'no line ends on "Error."');
  /* A REFUSED RELEASE IS NOT ASKED WHAT CHANGED, since ed5eca3 (11 October,
     the atomic release save): the run is rolled back in memory, so an answer
     would be evidence about a release the record does not hold. relCoolDown
     sets RUN.ask only when RUN.saved. Until 16 October this probe pressed an
     answer here and read #relsaid, a card that cannot appear on this path, so
     it read "" and was red for the wrong reason with no job running it. */
  await p.evaluate(() => { const x = document.getElementById('relrest'); if (x) x.click(); }); await p.waitForTimeout(150);
  const asked = await p.evaluate(() => ({ ask: RUN.ask, card: !!document.getElementById('relask'), btn: !!document.querySelector('[data-relsaid]') }));
  ok(!asked.ask && !asked.card && !asked.btn, 'a release the browser would not save is not asked What changed: ' + JSON.stringify(asked));
  await p.evaluate(() => { try { relClose && relClose(); } catch (e) {} }); await p.waitForTimeout(200);
  await refuse(p, false);
  /* THE ROLLBACK REACHES THE READING, 16 October. relCoolDown restored CURP
     and left S, which compute() and saveProfile read, at the released charge,
     so the next ordinary save wrote the refused release onto the record with
     no release in its history. Read off the saved record after a save and a
     reload, never off a live variable. */
  ok(await p.evaluate(() => pSave()), 'an ordinary save after the refused release lands');
  await p.reload({ waitUntil: 'load' }); await booted(p);
  const rec2 = own(await saved(p)) || {};
  ok(JSON.stringify(rec2.axes || null) === axes0, 'and the record still holds the charge the refused release did not take off it');
  ok(JSON.stringify(rec2.meter || null) === meter0 && (rec2.history || []).length === hist0,
    'and its meter and its history are as they were before the release: ' + JSON.stringify({ meter: (rec2.meter || {}).lines, history: (rec2.history || []).length, before: hist0 }));
  await p.evaluate(SHRINK);

  /* THE ANSWER ITSELF REFUSED. The rule the old probe meant still has a
     path: the release lands, and the store refuses only the answer. relAnswer
     then keeps it on the card, says so with the fail mark, and the card must
     never read "Kept on your record". */
  console.log('\n-- the answer to What changed, refused --');
  await clearLog(p);
  await story(p);
  await p.evaluate(() => { const g = document.getElementById('strun'); if (g && !g.disabled) g.click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); } });
  const done2 = await p.waitForFunction(() => typeof RUN !== 'undefined' && RUN.phase === 'done' && RUN.cool >= COOLING.length, null, { timeout: 90000 }).then(() => true, () => false);
  const run2 = await p.evaluate(() => { const g = document.getElementById('strun');
    return { phase: RUN.phase, saved: RUN.saved, queue: (RUN.queue || []).length, open: RUN.open, tab: S.tab,
      strun: g ? { disabled: g.disabled, text: g.textContent.trim().slice(0, 60) } : null }; });
  ok(done2 && run2.saved === true, 'a release with a working store runs to its end and is saved: ' + JSON.stringify(run2));
  await p.evaluate(() => { const x = document.getElementById('relrest'); if (x) x.click(); }); await p.waitForTimeout(150);
  ok(await p.evaluate(() => RUN.ask === true && !!document.querySelector('[data-relsaid="not_sure"]')), 'and it is asked What changed');
  await refuse(p, true); await clearLog(p);
  await p.evaluate(() => { const b = document.querySelector('[data-relsaid="not_sure"]'); if (b) b.click(); }); await p.waitForTimeout(250);
  const said = await p.evaluate(() => { const e = document.getElementById('relsaid'); return e ? e.textContent : ''; });
  ok(said && !/Kept on your record/.test(said) && /would not save/.test(said), 'an answer the browser would not save is not shown as kept: ' + JSON.stringify(said));
  L = await log(p);
  ok(L.some(x => x.k === 'fail' && /would not save/.test(x.m) && /answer/i.test(x.m)), 'and the status line says so with the fail mark: ' + JSON.stringify(L.map(x => x.m)));
  ok(!L.some(x => /Error\.$/.test(x.m)), 'no line ends on "Error."');
  await p.evaluate(() => { try { relClose && relClose(); } catch (e) {} });
  await refuse(p, false);

  console.log('\n-- Your patterns, the two answers --');
  const ch = await p.evaluate(() => {
    const x = { stories: 1, named: true, lines: 2, truths: 0, protocols: [], evFor: 0, evAgainst: 0,
      said: { n: 1, by: { something_moved: 1 } }, state: 'unanswered' };
    const d = document.createElement('div'); d.innerHTML = lpChain(x);
    return [...d.querySelectorAll('li')].map(li => li.textContent);
  });
  const after = ch.find(t => /Something moved/.test(t)) || '', yes = ch[ch.length - 1] || '';
  ok(/what changed/i.test(after), 'the What changed line names its question: ' + JSON.stringify(after));
  ok(/yes or no/.test(yes) && /pattern/.test(yes) && !/^Answer/.test(yes), 'the yes line names its question: ' + JSON.stringify(yes));
  ok(!ch.some(t => /Not answered yet/.test(t)), 'no line says only "Not answered yet" beside an answer');

  /* THE HALF SECOND HAS A FLUSH. stDraft writes 500 ms after the last key, and
     a tab that closed inside that half second lost the sentence without a word,
     because the timer died with the page. Measured here the way it happens: type,
     close the page inside 100 ms with no unload prompt, open a new page in the
     same context, and read the record that came back. A fresh context, so the
     blank store has no record to hide a missing write, and no init script, which
     can leave the page on a store Chromium never connected (tests/seed.js).

     THIS IS THE REPLY LINE'S OWN CASE NOW, round of 28 October: a reply
     typed into #stcin and never sent is the one box an ordinary session
     leaves words in, so it is the one that most needs to survive a tab
     closed mid debounce. Same timer, same flush, CURP.story.reply beside
     CURP.story.draft. */
  console.log('\n-- the reply line\'s draft, a page closed inside the half second --');
  const cx2 = await browser.newContext({ viewport: { width: W, height: H } });
  await cx2.route(/workers\.dev/, r => r.abort('failed'));
  const open2 = async () => {
    const q = await cx2.newPage();
    await q.goto('file://' + FILE + '?dev=1', { waitUntil: 'load' });
    await q.waitForFunction(() => document.documentElement.getAttribute('data-boot') === 'ok', null, { timeout: 20000 });
    return q;
  };
  const q1 = await open2(); await story(q1);
  await q1.fill('#stcin', HALF);
  const t0 = Date.now(); await q1.close({ runBeforeUnload: false });
  const gone = Date.now() - t0;
  const q2 = await open2();
  const back = await q2.evaluate(() => CURP && CURP.story ? CURP.story.reply : null);
  ok(back === HALF, 'a page closed ' + gone + ' ms after the last key keeps the unsent reply: ' + JSON.stringify(back));
  await story(q2);
  ok((await box(q2)) === HALF, 'and it is back in the reply line');
  await q2.click('#stclear'); await q2.close();

  /* the same half second on the first run's story step, kept on the walk */
  const o1 = await open2();
  await o1.evaluate(() => { loadP(0); obOpen(false); OB.step = 5; obRender(); });
  await o1.fill('#obtext', HALF);
  await o1.close({ runBeforeUnload: false });
  const o2 = await open2();
  const walk = await o2.evaluate(() => CURP && CURP.journey && CURP.journey.walk ? CURP.journey.walk.text : null);
  ok(walk === HALF, 'a page closed on the first run story step keeps the words on the walk: ' + JSON.stringify(walk));
  await o2.close();
  await cx2.close();

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 2)));
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HONEST FAILED', e && e.stack || e); process.exit(2); });
