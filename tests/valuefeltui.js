#!/usr/bin/env node
/* ============================================================
   VALUE FELT AFTER SESSION ONE, THE HOST HALF, IN A REAL BROWSER.
   NODE_PATH=/opt/node22/lib/node_modules node tests/valuefeltui.js

   tests/valuefelt.js holds the engine half headless. This holds what only
   a browser can: that ui/valuefelt.js asks on the next open and never
   from inside the release code, that it waits for a standing door, that
   Keep writes through the one writer and reaches the stored record, that
   Skip writes nothing, and that an answered record is not asked again.

   It never touches the release screen. A release is put on the record the
   way the release card leaves it, meter.relLines and meter.first, and the
   page is opened again, which is the whole of how this is triggered.

   CHECKED AGAINST A KNOWN BAD COPY FIRST, the standing rule. The same
   door check runs on a copy of source.html whose vfBlocked never sees a
   dialog, and it must fail there. A wait that cannot fail is not a wait.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'source.html');

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };

const seed = (relLines, truthLines, daysAgo) => `(function(){
  CURP.meter.relLines=${relLines}; CURP.meter.truthLines=${truthLines};
  CURP.meter.first=${daysAgo == null ? 'null' : `new Date(Date.now()-${daysAgo}*864e5).toISOString()`};
  return pSave();})()`;
const sheetUp = pg => pg.evaluate(() => {
  const s = document.getElementById('sheet');
  return !!(s && !s.hidden && /Your first release/.test(s.textContent || ''));
});
const stored = pg => pg.evaluate(() => {
  try {
    const me = JSON.parse(localStorage.getItem(PKEY) || '[]').filter(r => r.id === CURP.id)[0];
    const ev = (me && me.practice && me.practice.evidence) || [];
    return ev.filter(e => e.metric === VF_METRIC || e.metric === VF_AGAIN_METRIC)
      .map(e => ({ m: e.metric, v: e.value, notes: e.notes, dim: e.dimension }));
  } catch (e) { return 'unreadable: ' + e.message; }
});
/* the boot sheet holds the instrument for a few seconds and the watch only
   starts once it lifts, so every wait below is measured from the lift and
   not from load */
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
/* waits for the sheet up to a limit and says whether it came, rather than
   sleeping a fixed time and hoping the poll landed inside it */
const waitSheet = async (pg, ms) => {
  try { await pg.waitForFunction(() => {
    const s = document.getElementById('sheet');
    return s && !s.hidden && /Your first release/.test(s.textContent || ''); }, null, { timeout: ms });
    return true; } catch (e) { return false; }
};

/* the door: opened without ?dev=1, the login card stands. Inside the window,
   with a release on the record, the sheet must not open over it. */
async function doorHolds(browser, file) {
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const pg = await cx.newPage();
  await pg.goto('file://' + file + '?dev=1', { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof CURP !== 'undefined' && CURP && typeof pSave === 'function');
  await pg.evaluate(seed(3, 0, 0.1));
  await pg.goto('file://' + file, { waitUntil: 'load' });
  await booted(pg);
  const door = await pg.waitForSelector('#loginb-skip', { state: 'visible', timeout: 15000 }).then(() => true, () => false);
  const came = await waitSheet(pg, 6000);
  await cx.close();
  return { door, came };
}

/* the developer skip: a due record, opened with ?dev=1. Returns whether the
   sheet came, which must be never on the real build. */
async function devSkipAsks(browser, file) {
  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const pg = await cx.newPage();
  await pg.goto('file://' + file + '?dev=1', { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof CURP !== 'undefined' && CURP && typeof pSave === 'function');
  await pg.evaluate(seed(3, 0, 0.1));
  await pg.goto('file://' + file + '?dev=1', { waitUntil: 'load' });
  await booted(pg);
  const came = await waitSheet(pg, 5000);
  await cx.close();
  return came;
}

(async () => {
  if (!fs.existsSync(SRC)) { console.log('source.html is missing: run ./atuned_src/BUILD.sh'); process.exit(1); }
  const browser = await chromium.launch();
  const errs = [];

  console.log('KNOWN BAD COPY FIRST: a door check that cannot see the door');
  const html = fs.readFileSync(SRC, 'utf8');
  const from = 'function vfBlocked(){';
  if (html.indexOf(from) < 0) {
    ok(false, 'the text to break was not found in source.html, so the known bad copy tests nothing');
  } else {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vfui-'));
    const bad = path.join(tmp, 'source.html');
    fs.writeFileSync(bad, html.replace(from, from + 'return false;'));
    const b = await doorHolds(browser, bad);
    ok(b.door && b.came, 'on the broken copy the sheet does open over the door, so the check below can fail: '
      + JSON.stringify(b));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const skip = 'if(typeof DEV_SKIP!==\'undefined\'&&DEV_SKIP)return;';
  if (html.indexOf(skip) < 0) {
    ok(false, 'the developer skip line was not found in source.html, so its known bad copy tests nothing');
  } else {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vfui-'));
    const bad = path.join(tmp, 'source.html');
    fs.writeFileSync(bad, html.replace(skip, ''));
    ok(await devSkipAsks(browser, bad), 'on a copy that ignores the developer skip the sheet does open, so the check below can fail');
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log('\nTHE REAL BUILD');
  ok(!(await devSkipAsks(browser, SRC)), 'under the developer skip a due question is not asked, the skip means straight to the dashboard');
  const d = await doorHolds(browser, SRC);
  ok(d.door && !d.came, 'with the login door standing, the sheet waits and does not open over it: ' + JSON.stringify(d));

  const cx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const pg = await cx.newPage();
  pg.on('pageerror', e => errs.push(e.message));
  /* ?dev=1 skips the door, and the developer skip is honoured by the watch
     itself, so under it the boot hook never starts the watch. Each open
     below therefore first proves that, then starts the watch by hand, which
     is the one call the boot hook makes. That the hook does make it, with no
     skip, is what the door check above proves on the broken copy. */
  const open = async () => {
    await pg.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' });
    await pg.waitForFunction(() => typeof CURP !== 'undefined' && CURP && typeof pSave === 'function');
    await booted(pg);
    await pg.evaluate(() => vfWatch());
  };

  /* no release yet: never asked */
  await open();
  ok(await pg.evaluate(seed(0, 0, null)), 'a record with no release saves');
  await open();
  ok(!(await waitSheet(pg, 4000)), 'with no release on the record, nothing is asked');

  /* a release outside the window: never asked */
  await pg.evaluate(seed(3, 0, 30));
  await open();
  ok(!(await waitSheet(pg, 4000)), 'a first release a month ago is not asked about');

  /* a release inside the window: asked on the next open, Skip writes nothing */
  await pg.evaluate(seed(3, 0, 0.1));
  await open();
  ok(await waitSheet(pg, 8000), 'a release inside the window is asked about on the next open');
  const qs = await pg.evaluate(() => (document.getElementById('sheet').innerText || ''));
  const Q = await pg.evaluate(() => VF_Q);
  ok(qs.indexOf(Q.value) >= 0 && qs.indexOf(Q.reason) >= 0 && qs.indexOf(Q.again) >= 0,
    'all three questions are on the sheet, in the words engine/valuefelt.js keeps');
  ok(/Nothing is sent/.test(qs), 'and it says before they answer that nothing is sent');
  ok(await pg.evaluate(() => document.getElementById('vfkeep').disabled),
    'Keep waits for the value answer, because that answer is the measure');
  await pg.click('#vfskip');
  const skipSaid = await pg.evaluate(() => document.getElementById('status').textContent);
  ok(/Nothing was recorded/.test(skipSaid), 'Skip says it recorded nothing: ' + JSON.stringify(skipSaid));
  ok(JSON.stringify(await stored(pg)) === '[]', 'and it did record nothing');

  /* asked again after a skip, inside the window; Keep writes through the boundary */
  await open();
  ok(await waitSheet(pg, 8000), 'a skip is asked again on a later open, inside the window');
  await pg.click('[data-vfk="value"][data-vfv="somewhat"]');
  await pg.fill('#vfwhy', 'It named the jaw.');
  await pg.click('[data-vfk="again"][data-vfv="yes"]');
  ok(await pg.evaluate(() => document.getElementById('vfwhy').value) === 'It named the jaw.',
    'a reason typed before the again answer survives the redraw');
  await pg.click('#vfkeep');
  const keepSaid = await pg.evaluate(() => document.getElementById('status').textContent);
  ok(/Kept on your record/.test(keepSaid), 'Keep says so once the save has said yes: ' + JSON.stringify(keepSaid));
  const rows = await stored(pg);
  ok(Array.isArray(rows) && rows.length === 2
    && rows.some(r => r.m === 'session_value' && r.v === 'somewhat' && r.notes === 'It named the jaw.')
    && rows.some(r => r.m === 'repeat_intent' && r.v === 'yes')
    && rows.every(r => r.dim === 'affect'),
    'the stored record carries the value with its reason and the again answer, as affect: ' + JSON.stringify(rows));

  /* answered: never asked again */
  await open();
  ok(!(await waitSheet(pg, 4000)), 'once answered, the next open asks nothing');

  /* a run of reframe lines alone is a release too */
  await pg.evaluate(() => { CURP.practice = practiceBlank(); pSave(); });
  await pg.evaluate(seed(0, 4, 0.1));
  await open();
  ok(await waitSheet(pg, 8000), 'a first release of reframe lines alone is asked about too');

  ok(errs.length === 0, 'no page errors: ' + JSON.stringify(errs));
  await browser.close();
  console.log('\n' + (n - fails.length) + ' of ' + n + ' passed');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
