#!/usr/bin/env node
/* ============================================================
   THE FIRST WRITES TELL THE TRUTH. P1-H, block G1 of pass 4.

   mkdir -p /tmp/atuned-p1h && flock -o -w 600 -E 75 /tmp/atuned-browser.lock \
     env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
     TMPDIR=/tmp/atuned-p1h node tests/honest.js
   ATUNED_FILE=file    runs against another build, for checking the checker
   W=390 H=844         the phone

   What it holds, each read off the SAVED record after a reload and never
   only off a live variable:

     the Story page keeps a half written story across a reload, and Clear
     and Commit each take it off the record;
     with a store that refuses writes, Commit never says "Committed", says
     plainly that nothing reached the record, leaves the words in the box,
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
   ============================================================ */
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
const box = p => p.evaluate(() => { const t = document.getElementById('sttext'); return t ? t.value : null; });
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
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  /* the Worker host is cut, so nothing here waits on a network */
  await ctx.route(/workers\.dev/, r => r.abort('failed'));
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + FILE + '?dev=1', { waitUntil: 'load' }); await booted(p);
  console.log(`\n=== the first writes tell the truth, at ${W} by ${H} ===`);

  console.log('\n-- the Story draft --');
  await story(p);
  await p.fill('#sttext', HALF); await p.waitForTimeout(900);
  ok(own(await saved(p)) && own(await saved(p)).story.draft === HALF, 'a half written story is on the saved record');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await box(p)) === HALF, 'and is back in the box after a reload');
  await p.click('#stclear'); await p.waitForTimeout(200);
  ok(own(await saved(p)) && own(await saved(p)).story.draft === undefined, 'Clear takes it off the saved record at once');
  await p.reload({ waitUntil: 'load' }); await booted(p); await story(p);
  ok((await box(p)) === '', 'and the box is empty after a reload');

  console.log('\n-- Commit with a store that refuses --');
  const n0 = (own(await saved(p)) || { story: { entries: [] } }).story.entries.length;
  await p.fill('#sttext', STORY); await p.waitForTimeout(700);
  await refuse(p, true); await clearLog(p);
  await press(p, '#stapply'); await p.waitForTimeout(700);
  let L = await log(p);
  ok(!L.some(x => /^Committed/.test(x.m)), 'Commit does not say Committed: ' + JSON.stringify(L.map(x => x.m)));
  ok(L.length && L[L.length - 1].k === 'fail', 'the last line carries the fail mark');
  ok(L.length && /would not save/.test(L[L.length - 1].m) && /still in the box/.test(L[L.length - 1].m),
    'it says the browser would not save and the words are still in the box');
  ok(!L.some(x => /Error\.$/.test(x.m)), 'no line ends on "Error."');
  ok((await box(p)) === STORY, 'the words are still in the box');
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
  await refuse(p, true); await clearLog(p);
  await p.evaluate(() => { const g = document.getElementById('strun'); if (g && !g.disabled) g.click(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); } });
  const done = await p.waitForFunction(() => typeof RUN !== 'undefined' && RUN.phase === 'done' && RUN.cool >= COOLING.length, null, { timeout: 90000 }).then(() => true, () => false);
  ok(done, 'the release runs to its end');
  await p.waitForTimeout(600);
  L = await log(p);
  ok(L.some(x => x.k === 'fail' && /would not save/.test(x.m) && /release/.test(x.m)), 'the release says it was not saved, with the fail mark: ' + JSON.stringify(L.map(x => x.m)));
  ok(!L.some(x => /Error\.$/.test(x.m)), 'no line ends on "Error."');
  await clearLog(p);
  await p.evaluate(() => { const x = document.getElementById('relrest'); if (x) x.click(); }); await p.waitForTimeout(150);
  await p.evaluate(() => { const b = document.querySelector('[data-relsaid="not_sure"]'); if (b) b.click(); }); await p.waitForTimeout(250);
  const said = await p.evaluate(() => { const e = document.getElementById('relsaid'); return e ? e.textContent : ''; });
  ok(said && !/Kept on your record/.test(said), 'an answer the browser would not save is not shown as kept: ' + JSON.stringify(said));
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

  ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 2)));
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HONEST FAILED', e && e.stack || e); process.exit(2); });
