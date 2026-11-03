#!/usr/bin/env node
/* ============================================================
   WHERE THE APP OPENS, WHERE A FIRST VISITOR LANDS, AND WHERE THEY LEFT OFF.
   9 October, then 23 October.

   env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=$PW_DIR \
     node tests/landing.js
   LANDING_HTML=file   runs against another build, for checking the checker

   The owner, 9 October: "when a first time user goes from the funnel to
   the questions to the app, I want them to start on the summary screen. For
   the first time after that, it'll just be persistent to wherever they left
   off. But we want to give them right away information on their summary
   reading."

   The owner, 23 October: "the app opens on Discover. So when you click
   Discover, you only get the journal and the imprints and the release." And:
   "Yeah, I've changed that rule. The most important portions of the app are
   core loop... That really is the journal to the release."

   So a device with no memory opens on Discover's one door, the journal page
   (TABHOME, engine/core.js), where it opened on the Field before. The one
   first landing keeps his 9 October target, Summary, because that ruling is
   about exactly the funnel's first arrival and the gift's line stands on it;
   that is a default the UX seat took, his to overrule, written at
   tabLandFirst in ui/panels.js. This file holds it, in a real browser, on a
   clean browser each time:

     a device that has never been anywhere opens on Discover, pressed, and
     the opening is named once, TABHOME;
     the surface a person leaves is the surface they are on after a reload,
     except Settings, which has no door of its own and is never remembered;
     the wordmark goes home, to Discover;
     the record arriving in a link from the funnel lands on Summary, and
     Summary is showing the reading, not an empty page, and Discover is the
     section a press on the bar opens from there;
     it does that once: after the person has gone elsewhere, a second link
     does not pull them back, and a reload keeps where they were;
     a device that already remembers another surface is brought to Summary
     by its first link, which is the case that proves the landing acts and is
     not the cold open passing for it;
     the first run closing lands on Summary too, once, from wherever the
     person was, and not again.

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing
   rule: run with LANDING_HTML at the build from a4c2872b, it fails the cold
   open, the named opening, the wordmark and the press on Discover from the
   first landing, each by name (there, Summary sat inside Discover, so the
   press went back to Summary), and passes the memory and every first
   landing, which did not change.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.LANDING_HTML ? path.resolve(process.env.LANDING_HTML) : path.join(ROOT, 'source.html');
const QUIZ = path.join(ROOT, 'funnel', 'quiz.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
/* A REAL PRESS WAITS FOR THE PAGE TO SETTLE. Measured 23 October, on the
   build from before this change as well as this one: a press on the bar or
   the wordmark inside about a second and a half of isBooted() turning true
   can be dropped, the document seeing mousedown and mouseup and no click.
   Six of six presses on a section button, two of four on the wordmark; none
   in eight presses after 1500 ms. That race is not what this file holds, so
   a real press here comes after the wait, and the race is filed on its own. */
const settle = pg => pg.waitForTimeout(1500);
/* the opening is read as TAB.STORY, Discover's one door, and not through
   TABHOME, so a build that has no TABHOME is measured against the same
   surface rather than against undefined */
const state = pg => pg.evaluate(() => ({
  tab: S.tab, field: TAB.FIELD, summary: TAB.SUMMARY, discover: TAB.STORY, compass: TAB.COMPASS, settings: TAB.SETTINGS,
  home: typeof TABHOME === 'undefined' ? null : TABHOME,
  sec: [...document.querySelectorAll('#secbar .secb[aria-pressed=true]')].map(b => b.getAttribute('data-sec')).join(','),
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

  console.log('\n=== a device that has never been anywhere opens on Discover, then where it was left ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    let s = await state(pg);
    ok(s.tab === s.discover && s.sec === 'discover', 'a clean device opens on Discover, the journal page, with Discover pressed: tab ' + s.tab + ', pressed ' + s.sec);
    ok(s.home === s.discover, 'and the opening is named once, TABHOME, and it is Discover\'s door: ' + s.home);
    await pg.evaluate(() => setTab(TAB.COMPASS));
    await pg.reload({ waitUntil: 'load' }); await booted(pg);
    s = await state(pg);
    ok(s.tab === s.compass, 'leaving on Compass, a reload opens on Compass, ' + s.tab);
    await pg.evaluate(() => setTab(TAB.SETTINGS));
    await pg.reload({ waitUntil: 'load' }); await booted(pg);
    s = await state(pg);
    ok(s.tab === s.compass, 'Settings is not remembered: the reload is back on Compass, ' + s.tab);
    ok(s.landed === null, 'and moving about does not count as a first landing');
    await settle(pg); await pg.click('#brand'); await pg.waitForTimeout(300);
    s = await state(pg);
    ok(s.tab === s.discover && s.sec === 'discover', 'the wordmark goes home, to Discover, ' + s.tab);
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  console.log('\n=== the funnel hands over a record: Summary, with the reading on it, once ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1#r=' + payload, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(800);
    let s = await state(pg);
    ok(s.tab === s.summary, 'the first arrival from the funnel lands on Summary, ' + s.tab);
    ok(s.landed === '1', 'and the device is marked as landed');
    const read = await pg.evaluate(() => { const b = document.getElementById('sumbody'); return { len: b ? b.innerText.length : 0, cq: Math.round(compute().CQ), unread: compute().unread }; });
    ok(!read.unread && read.len > 60, 'Summary is showing the reading, not an empty page: ' + read.len + ' characters, coherence ' + read.cq);
    /* and the journal is a press away, on the bar a person sees */
    await settle(pg); await pg.click('#secbar .secb[data-sec="discover"]'); await pg.waitForTimeout(400);
    s = await state(pg);
    ok(s.tab === s.discover && s.sec === 'discover', 'from there a press on Discover opens the journal page, ' + s.tab);
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

  console.log('\n=== a device that remembers another surface is brought to Summary by its first link, once ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    await pg.evaluate(() => setTab(TAB.COMPASS));
    await pg.goto('about:blank'); await pg.goto('file://' + SRC + '?dev=1#r=' + payload, { waitUntil: 'load' }); await booted(pg);
    await pg.waitForTimeout(800);
    const s = await state(pg);
    ok(s.tab === s.summary && s.landed === '1', 'the first link moves the person from Compass to Summary and marks the device, tab ' + s.tab + ', landed ' + s.landed);
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  console.log('\n=== the first run closing lands on Summary, once ===');
  {
    const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(pg);
    /* from somewhere else, so the landing is the first run's doing */
    await pg.evaluate(() => setTab(TAB.COMPASS));
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
    ok(s.tab === s.discover, 'and the next close leaves the person where they were, on Discover, ' + s.tab);
    ok(errs.length === 0, 'no page error' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
    await cx.close();
  }

  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
