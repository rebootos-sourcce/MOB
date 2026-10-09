#!/usr/bin/env node
/* ============================================================
   WHERE A FIRST VISITOR LANDS, AND WHERE THEY LEFT OFF. 9 October.

   env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     node tests/landing.js
   LANDING_HTML=file   runs against another build, for checking the checker

   The owner, 9 October: "when a first time user goes from the funnel to
   the questions to the app, I want them to start on the summary screen. For
   the first time after that, it'll just be persistent to wherever they left
   off. But we want to give them right away information on their summary
   reading."

   What this holds, in a real browser, on a clean browser each time:

     a device that has never been anywhere opens on the Field, as it always did;
     the surface a person leaves is the surface they are on after a reload,
     except Settings, which has no door of its own and is never remembered;
     the record arriving in a link from the funnel lands on Summary, and
     Summary is showing the reading, not an empty page;
     it does that once: after the person has gone elsewhere, a second link
     does not pull them back, and a reload keeps where they were;
     the first run closing lands on Summary too, once, and not again.

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing
   rule: it fails the memory, the link landing and the first run landing.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.LANDING_HTML ? path.resolve(process.env.LANDING_HTML) : path.join(ROOT, 'source.html');
const QUIZ = path.join(ROOT, 'funnel', 'quiz.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
const state = pg => pg.evaluate(() => ({
  tab: S.tab, field: TAB.FIELD, summary: TAB.SUMMARY, story: TAB.STORY, settings: TAB.SETTINGS,
  kept: STORE_BOUND ? STORE.get('source.tab') : null, landed: STORE_BOUND ? STORE.get('source.landed') : null,
}));

async function payloadFromQuiz(browser) {
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const pg = await cx.newPage();
  await pg.goto('file://' + QUIZ, { waitUntil: 'load' });
  await pg.evaluate(() => { A = {}; QQ.forEach((q, i) => { A[i] = (i * 7 + 3) % 5; }); save(); STATE = 'door'; render(); });
  await pg.waitForSelector('#tolink[data-ready="1"]', { timeout: 10000 });
  const href = await pg.evaluate(() => document.getElementById('tolink').href);
  await cx.close();
  return href.split('#r=')[1];
}

(async () => {
  for (const f of [SRC, QUIZ]) if (!fs.existsSync(f)) { console.log(path.relative(ROOT, f) + ' is missing: build first'); process.exit(1); }
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);
  const payload = await payloadFromQuiz(browser);
  ok(typeof payload === 'string' && payload.length > 40, 'the quiz made a link to land from, ' + (payload || '').slice(0, 24) + '...');

  console.log('\n=== a device that has never been anywhere, then where it was left ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    let s = await state(pg);
    ok(s.tab === s.field, 'a clean device opens on the Field');
    await pg.evaluate(() => setTab(TAB.STORY));
    await pg.reload({ waitUntil: 'load' }); await booted(pg);
    s = await state(pg);
    ok(s.tab === s.story, 'leaving on Story, a reload opens on Story, ' + s.tab);
    await pg.evaluate(() => setTab(TAB.SETTINGS));
    await pg.reload({ waitUntil: 'load' }); await booted(pg);
    s = await state(pg);
    ok(s.tab === s.story, 'Settings is not remembered: the reload is back on Story, ' + s.tab);
    ok(s.landed === null, 'and moving about does not count as a first landing');
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  console.log('\n=== the funnel hands over a record: Summary, with the reading on it, once ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1#r=' + payload, { waitUntil: 'load' }); await booted(pg);
    await pg.evaluate(() => (typeof RECORD_LINK !== 'undefined' && RECORD_LINK) ? RECORD_LINK : null);
    await pg.waitForTimeout(800);
    let s = await state(pg);
    ok(s.tab === s.summary, 'the first arrival from the funnel lands on Summary, ' + s.tab);
    ok(s.landed === '1', 'and the device is marked as landed');
    const read = await pg.evaluate(() => { const b = document.getElementById('sumbody'); return { len: b ? b.innerText.length : 0, cq: Math.round(compute().CQ), unread: compute().unread }; });
    ok(!read.unread && read.len > 60, 'Summary is showing the reading, not an empty page: ' + read.len + ' characters, coherence ' + read.cq);
    await pg.evaluate(() => setTab(TAB.FIELD));
    await pg.reload({ waitUntil: 'load' }); await booted(pg);
    s = await state(pg);
    ok(s.tab === s.field, 'after going to the Field, a reload stays on the Field, ' + s.tab);
    await pg.goto('about:blank'); await pg.goto('file://' + SRC + '?dev=1#r=' + payload, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(800);
    s = await state(pg);
    ok(s.tab === s.field, 'a second link does not pull the person back to Summary, ' + s.tab);
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  console.log('\n=== the first run closing lands on Summary, once ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    /* the first run opened and finished, the way its own Done does */
    await pg.evaluate(() => { obOpen(); });
    await pg.waitForSelector('#ob', { state: 'attached', timeout: 8000 });
    await pg.evaluate(() => { obClose('done'); });
    await pg.waitForTimeout(500);
    let s = await state(pg);
    ok(s.tab === s.summary, 'closing the first run lands on Summary, ' + s.tab);
    await pg.evaluate(() => setTab(TAB.STORY));
    await pg.evaluate(() => { obOpen(); }); await pg.waitForTimeout(200);
    await pg.evaluate(() => { obClose('done'); }); await pg.waitForTimeout(500);
    s = await state(pg);
    ok(s.tab === s.story, 'and the next close leaves the person where they were, ' + s.tab);
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
