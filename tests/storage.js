#!/usr/bin/env node
/* ============================================================
   THE ONLY COPY, IN A REAL BROWSER. Open item M9, WP2a-6.

   mkdir -p /tmp/atuned-wp2a6 && flock -o -w 600 -E 75 /tmp/atuned-browser.lock \
     env NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
     TMPDIR=/tmp/atuned-wp2a6 node tests/storage.js
   SHOTS=dir           also writes the screenshots a person looks at
   STORAGE_HTML=file   runs against another build, for checking the checker

   For a person who is not signed in, the browser's own storage is the only
   copy of their record. Safari clears a site's storage after about seven days
   of use without a visit, and any browser may clear it when the disk is full.
   A failed save was reported. A cleared store was not: the person opened the
   app on an empty instrument with no word about why and no way back.

   What this holds, with navigator.storage.persist stubbed to answer yes, no,
   never, or to be missing:

     after the first save by the person (and never at boot), the browser is
     asked once a session to keep the storage, and the app is never held up
     waiting for the answer;
     when the answer is no or there is no way to ask, and a story is saved,
     one line says the record is kept only in this browser and that the
     browser may clear it, once, with a control that saves the record as a
     file, and the account area carries the same line beside its import;
     that control says the file was sent only once it was made, and says it
     was not made when it was not;
     a marker says a record was saved here, a time and counts and never the
     content; when the marker is there and the store is empty the app says
     the browser cleared its copy, offers the import, writes nothing over the
     marker, and a saved file puts the record back;
     with no marker, nothing new appears;
     a signed in person is not asked, not shown and not marked here.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.STORAGE_HTML ? path.resolve(process.env.STORAGE_HTML) : path.join(ROOT, 'source.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.SHOTS || '';

let n = 0; const fails = [];
const ok = (c, m) => { n++; if (!c) fails.push(m); console.log((c ? '  ok    ' : '  FAIL  ') + m); };
const booted = pg => pg.waitForFunction(() => typeof isBooted === 'function' && isBooted(), null, { timeout: 30000 });
const settle = (pg, ms) => pg.waitForTimeout(ms || 300);
const shot = async (pg, nm) => { if (SHOTS) { await pg.screenshot({ path: path.join(SHOTS, nm) }); console.log('  shot  ' + nm); } };

const LINE_SAVE = /only in this browser/;
const LINE_MAY = /may clear it/;
const LINE_LOST = /This browser has cleared the copy of your record it was keeping/;
const SENT = /^Sent to your downloads as atuned-record-\d{4}-\d{2}-\d{2}\.json\.$/;
const NOT_MADE = /^Could not make the file\. Nothing was saved\.$/;
const STORY1 = 'I could not stop going over it and it had me. I said nothing and I let it sit.';
const STORY2 = 'I go quiet and pull away from my partner when I feel rejected.';
const STORY3 = 'My jaw is tight before I am properly awake and I hold my breath in the car.';

/* navigator.storage.persist, answered the way a test needs. Run before the
   page's own script on every load, so the count is per page load, which is
   what "once a session" means here. 'none' takes the method away, the way a
   browser without the API has none. */
const stub = mode => {
  window.__persistCalls = 0;
  try {
    const SM = window.StorageManager && StorageManager.prototype;
    if (!SM) { window.__stubErr = 'no StorageManager'; return; }
    if (mode === 'none') { delete SM.persist; return; }
    let granted = false;
    Object.defineProperty(SM, 'persist', { configurable: true, writable: true, value: function () {
      window.__persistCalls++;
      if (mode === 'hang') return new Promise(() => {});
      granted = (mode === 'yes'); return Promise.resolve(granted); } });
    Object.defineProperty(SM, 'persisted', { configurable: true, writable: true, value: function () {
      return Promise.resolve(granted); } });
  } catch (e) { window.__stubErr = String(e); }
};

async function fresh(browser, mode, w, h) {
  const cx = await browser.newContext({ viewport: { width: w, height: h }, acceptDownloads: true });
  await cx.addInitScript(stub, mode);
  /* nothing leaves the machine: the signed in case would otherwise ask a server */
  await cx.route(/^https?:\/\//, r => r.abort());
  const pg = await cx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e && e.message || e)));
  return { cx, pg, errs };
}
const open = async (pg, dev) => { await pg.goto('file://' + SRC + (dev === false ? '' : '?dev=1'), { waitUntil: 'load' }); await booted(pg); await settle(pg, 400); };
const reload = async pg => { await pg.reload({ waitUntil: 'load' }); await booted(pg); await settle(pg, 400); };

/* everything a check reads, off the page, the way a person and the store see it */
const state = pg => pg.evaluate(() => {
  const K = (typeof KEEP_KEY !== 'undefined') ? KEEP_KEY : 'source.profiles.saved';
  const el = document.getElementById('keepline');
  const ln = { exists: !!el, shown: false, text: '', btns: [], file: false, live: false, box: null };
  if (el) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    ln.shown = !el.hidden && cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    ln.text = el.textContent.replace(/\s+/g, ' ').trim();
    ln.box = { l: r.left, r: r.right, t: r.top, b: r.bottom };
    ln.btns = [...el.querySelectorAll('button')].map(b => { const q = b.getBoundingClientRect();
      return { id: b.id, text: b.textContent.trim(), w: q.width, h: q.height }; }).filter(b => b.w > 0);
    ln.file = !!el.querySelector('input[type=file]');
    ln.live = !!el.querySelector('[aria-live="polite"]') || el.getAttribute('aria-live') === 'polite';
  }
  const st = document.getElementById('status');
  return {
    calls: window.__persistCalls, stubErr: window.__stubErr || null,
    stored: localStorage.getItem(PKEY), mark: localStorage.getItem(K),
    names: PROFILES.map(p => p.name), cur: CURP && CURP.name, curId: CURP && CURP.id,
    curIn: PROFILES.indexOf(CURP) >= 0,
    stories: ((CURP && CURP.story && CURP.story.entries) || []).length,
    line: ln, vw: innerWidth, vh: innerHeight, sw: document.documentElement.scrollWidth,
    status: st ? st.textContent : '', kind: st ? st.getAttribute('data-kind') : null,
    log: (typeof MSG_LOG !== 'undefined' ? MSG_LOG.map(m => m.msg) : []),
    door: (document.getElementById('loginmsg') || {}).textContent || null,
    doorOpen: typeof LOGIN !== 'undefined' && !!LOGIN.open
  };
});
/* a story, through the same commit the Story tab's own Apply calls */
const commit = (pg, t) => pg.evaluate(t => { ST_TEXT = t; ST_PARSED = parseStory(t); stCommit();
  return ((CURP.story && CURP.story.entries) || []).length; }, t);
/* the account area, Privacy, where the import and the export live */
const account = pg => pg.evaluate(() => {
  ACC_OPEN = 'privacy'; setTab(TAB.SETTINGS); if (typeof renderAccount === 'function') renderAccount();
  const h = document.getElementById('settings'), imp = h && h.querySelector('.sh-imp');
  const sv = document.getElementById('ackeepsave'), r = sv && sv.getBoundingClientRect();
  return { text: imp ? imp.textContent.replace(/\s+/g, ' ') : '',
    save: sv ? { text: sv.textContent.trim(), w: r.width, h: r.height } : null,
    file: !!document.getElementById('acimpf') };
});
/* WHAT A BROWSER CLEARING THE STORE LOOKS LIKE. It happens while the app is
   shut, so every write the person already made has landed. A story commit
   queues a debounced write of the field (persistYou, 400ms) that pagehide
   flushes, and clearing the key inside that window had the closing page write
   the record straight back: the first cut of this gate measured exactly that
   and read it as the boot writing over the marker. So the pending write is
   let land first, and only then is the record key taken out from under it. */
const clearRecord = async pg => {
  await pg.waitForFunction(() => typeof YOU_T === 'undefined' || !YOU_T, null, { timeout: 5000 }).catch(() => null);
  return pg.evaluate(() => { localStorage.removeItem(PKEY);
    return localStorage.getItem(typeof KEEP_KEY !== 'undefined' ? KEEP_KEY : 'source.profiles.saved'); });
};
const big = b => b.w >= 44 && b.h >= 44;
const fits = s => !!s.line.box && s.line.box.l >= 0 && s.line.box.r <= s.vw + 0.5 && s.line.box.t >= 0
  && s.line.box.b <= s.vh + 0.5 && s.sw <= s.vw;
const btn = (s, t) => s.line.btns.find(b => b.text === t);

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: run ./atuned_src/BUILD.sh'); process.exit(1); }
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-'));
  const browser = await chromium.launch({ executablePath: CHROME });
  let saved = null, savedName = null;

  console.log('\n=== a first visit, no marker: nothing new, and the browser is asked once on the first save ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'yes', 1600, 1000);
    await open(pg);
    let s = await state(pg);
    ok(!s.stubErr, 'the persist stub is in place' + (s.stubErr ? ': ' + s.stubErr : ''));
    ok(!s.line.shown && !LINE_LOST.test(s.line.text), 'a first visit shows nothing new');
    ok(s.calls === 0, 'nothing is asked at boot, read ' + s.calls + ' asks');
    let list = []; try { list = JSON.parse(s.stored || '[]'); } catch (e) {}
    ok(list.length === 1, 'the boot still writes the blank profile it always wrote, ' + list.length + ' on disk');
    ok(s.mark === null, 'the boot\'s own blank is not the person\'s save, so no marker is written for it');
    await commit(pg, STORY1); await settle(pg);
    s = await state(pg);
    ok(s.calls === 1, 'the first save by the person asks the browser to keep the storage, read ' + s.calls + ' asks');
    await commit(pg, STORY2); await settle(pg);
    s = await state(pg);
    ok(s.calls === 1, 'and a second save in the same session does not ask again, read ' + s.calls + ' asks');
    ok(!s.line.shown, 'the browser said yes, so no line is shown');
    const a = await account(pg);
    ok(!LINE_SAVE.test(a.text) && !a.save, 'and the account area carries no notice');
    let m = null; try { m = JSON.parse(s.mark); } catch (e) {}
    ok(!!m && Object.keys(m).sort().join(',') === 'n,p,t' && typeof m.t === 'number' && m.n === 2 && m.p === 1,
      'the marker says a record was saved here: a time and two counts, ' + s.mark);
    ok(!!s.mark && ['could not stop', 'partner', 'quiet', s.cur || 'You'].every(w => s.mark.indexOf(w) < 0),
      'and it carries no content: no name and none of the words of either story');
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  console.log('\n=== the browser says no: one line after the first story, a file, and the cleared copy put back ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'no', 1600, 1000);
    await open(pg);
    await pg.evaluate(() => uiSet('quiet', true)); await settle(pg);
    let s = await state(pg);
    ok(s.calls === 1, 'the first save, a setting, asks once, read ' + s.calls + ' asks');
    ok(!s.line.shown, 'no story is saved yet, so nothing is shown for a no');
    let a = await account(pg);
    ok(!LINE_SAVE.test(a.text), 'and the account area says nothing yet either');
    await pg.evaluate(() => setTab(TAB.FIELD));
    await commit(pg, STORY1); await settle(pg);
    s = await state(pg);
    ok(s.line.shown, 'after the first saved story, with the answer no, one line is shown');
    ok(LINE_SAVE.test(s.line.text) && LINE_MAY.test(s.line.text),
      'it names the browser: kept only in this browser, and the browser may clear it: "' + s.line.text + '"');
    const sv = btn(s, 'Save as a file'), dx = btn(s, 'Dismiss');
    ok(!!sv && !!dx, 'it offers the file and a way to dismiss it: ' + s.line.btns.map(b => b.text).join(', '));
    ok(s.line.btns.length > 0 && s.line.btns.every(big), 'every control on it is at least 44 by 44: '
      + s.line.btns.map(b => b.text + ' ' + Math.round(b.w) + 'x' + Math.round(b.h)).join(', '));
    ok(fits(s), 'it sits inside the screen at 1600 with no sideways scroll');
    ok(s.line.live, 'it is a polite live region, so a screen reader hears it');
    ok(s.calls === 1, 'still asked once this session, read ' + s.calls + ' asks');
    await shot(pg, 'keep-line-1600.png');
    a = await account(pg);
    ok(LINE_SAVE.test(a.text) && !!a.save && a.save.text === 'Save as a file' && big(a.save),
      'the account area says the same beside its import and carries the same control, 44 by 44');
    if (SHOTS) await shot(pg, 'keep-account-1600.png');
    await pg.evaluate(() => setTab(TAB.FIELD));

    /* the file, made and read back */
    if (sv) {
      const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 8000 }).catch(() => null), pg.click('#keepsave')]);
      ok(!!dl, 'the control produces a file download');
      if (dl) {
        savedName = dl.suggestedFilename();
        saved = path.join(tmp, savedName); await dl.saveAs(saved);
        let o = null; try { o = JSON.parse(fs.readFileSync(saved, 'utf8')); } catch (e) {}
        ok(!!o && o.name === s.cur && o.story && o.story.entries && o.story.entries.length === 1,
          'and the file is this record, the export the importer reads, ' + (o ? o.story.entries.length + ' story' : 'unreadable'));
        ok(/^atuned-record-\d{4}-\d{2}-\d{2}\.json$/.test(savedName), 'named for the day, ' + savedName);
      }
      s = await state(pg);
      ok(SENT.test(s.log[s.log.length - 1] || ''), 'the line it says is about the file it made: "' + (s.log[s.log.length - 1] || '') + '"');
      ok(!s.line.shown, 'and the line goes once the file is made');
    } else { ok(false, 'the control produces a file download'); ok(false, 'and the file is this record'); }

    /* a file that cannot be made is not reported as sent */
    a = await account(pg);
    if (a.save) {
      await pg.evaluate(() => { window.__mk = URL.createObjectURL; URL.createObjectURL = function () { throw new Error('blocked'); }; });
      const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 1500 }).catch(() => null), pg.click('#ackeepsave')]);
      s = await state(pg);
      ok(!dl && NOT_MADE.test(s.status) && s.kind === 'fail',
        'when the file cannot be made it says so and claims nothing: "' + s.status + '"');
      ok(!SENT.test(s.log[s.log.length - 1] || ''), 'and the last thing said is not that it was sent');
      await pg.evaluate(() => { URL.createObjectURL = window.__mk; setTab(TAB.FIELD); });
    } else { ok(false, 'when the file cannot be made it says so and claims nothing'); ok(false, 'and the last thing said is not that it was sent'); }

    /* once means once */
    await reload(pg);
    s = await state(pg);
    ok(!s.line.shown, 'a marker with a record on file is no loss, so a reload shows nothing');
    await commit(pg, STORY2); await settle(pg);
    s = await state(pg);
    ok(!s.line.shown, 'and the line is said once: the next story on the next visit does not bring it back');
    ok(s.calls === 1, 'a new session asks once again, read ' + s.calls + ' asks');

    /* the browser clears the record and leaves the marker */
    const mark0 = await clearRecord(pg);
    ok(!!mark0, 'the marker is there before the store is cleared, ' + mark0);
    await reload(pg);
    s = await state(pg);
    ok(s.line.shown && LINE_LOST.test(s.line.text), 'on the next visit it says the browser cleared its copy: "' + s.line.text + '"');
    const ch = btn(s, 'Choose a file');
    ok(!!ch && s.line.file && big(ch), 'and offers the import, a file picker behind a 44 by 44 control');
    ok(s.stored === null, 'nothing is written over it: the store is still empty after the boot');
    ok(s.mark === mark0, 'and the marker is left exactly as it was');
    ok(s.names.length === 1 && s.stories === 0 && s.curIn, 'the instrument opens on a blank kept in memory, ready for the next save');
    ok(fits(s), 'the loss line sits inside the screen at 1600 with no sideways scroll');
    await shot(pg, 'keep-lost-1600.png');
    a = await account(pg);
    ok(LINE_LOST.test(a.text) && a.file, 'the account area says it too, above its own import control');
    await pg.evaluate(() => setTab(TAB.FIELD));

    /* and the saved file puts it back, through the one importer */
    if (saved && ch) {
      await pg.setInputFiles('#kpimpfile', saved);
      await pg.waitForFunction(() => CURP && CURP.story && CURP.story.entries && CURP.story.entries.length === 1, null, { timeout: 8000 }).catch(() => null);
      await settle(pg);
      s = await state(pg);
      ok(s.stories === 1 && s.log.indexOf('Record loaded.') >= 0, 'choosing the saved file puts the record back, '
        + s.stories + ' story, through the import: ' + JSON.stringify(s.log.slice(-1)));
      ok(!!s.stored && s.stored.indexOf(s.curId) >= 0, 'and it is on the disk again');
      ok(!s.line.shown, 'and the loss line goes once the record is back');
      await reload(pg);
      s = await state(pg);
      ok(!s.line.shown && s.stories === 1, 'the next visit opens on the record and says nothing');
    } else { ['the saved file puts the record back', 'it is on the disk again', 'the loss line goes', 'the next visit says nothing']
      .forEach(t => ok(false, t)); }
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  console.log('\n=== no way to ask, at 390: the line, and Dismiss ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'none', 390, 844);
    await open(pg);
    await commit(pg, STORY3); await settle(pg);
    let s = await state(pg);
    ok(s.line.shown && LINE_SAVE.test(s.line.text), 'a browser with no way to ask shows the line after the first story');
    ok(s.line.btns.length > 0 && s.line.btns.every(big), 'every control on it is at least 44 by 44 at 390: '
      + s.line.btns.map(b => b.text + ' ' + Math.round(b.w) + 'x' + Math.round(b.h)).join(', '));
    ok(fits(s), 'it sits inside the screen at 390 with no sideways scroll, ' + JSON.stringify(s.line.box));
    await shot(pg, 'keep-line-390.png');
    if (btn(s, 'Dismiss')) await pg.click('#keepx');
    s = await state(pg);
    ok(!s.line.shown, 'Dismiss takes it away');
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  console.log('\n=== an answer that never comes holds nothing up ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'hang', 1600, 1000);
    await open(pg);
    const got = await commit(pg, STORY1); await settle(pg);
    const s = await state(pg);
    ok(got === 1 && !!s.stored && s.stored.indexOf('could not stop') >= 0 && s.calls === 1,
      'the story is kept and written while the answer is still out, asked ' + s.calls);
    ok(!s.line.shown, 'and nothing is said before there is an answer');
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  console.log('\n=== the cleared copy, with the door standing ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'no', 390, 844);
    await open(pg);
    await commit(pg, STORY1); await settle(pg);
    await clearRecord(pg);
    await open(pg, false);
    await pg.waitForFunction(() => { const m = document.getElementById('loginmsg'); return m && m.textContent; }, null, { timeout: 6000 }).catch(() => null);
    const s = await state(pg);
    ok(s.doorOpen && LINE_LOST.test(s.door || ''), 'the door carries the line, since it covers everything behind it: "' + s.door + '"');
    await shot(pg, 'keep-door-390.png');
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  console.log('\n=== a signed in person: not asked, not shown, not marked here ===');
  {
    const { cx, pg, errs } = await fresh(browser, 'no', 1600, 1000);
    await open(pg);
    await pg.evaluate(() => localStorage.setItem('source.session', JSON.stringify({ token: 'test-token', email: 'person@example.com', accountId: 'acc1' })));
    await reload(pg);
    await commit(pg, STORY1); await settle(pg);
    let s = await state(pg);
    const signed = await pg.evaluate(() => typeof authSession === 'function' && !!authSession());
    ok(signed, 'the session is held for this case');
    ok(s.calls === 0 && !s.line.shown && s.mark === null, 'nothing is asked, shown or marked: ' + s.calls + ' asks, marker ' + s.mark);
    await pg.evaluate(() => localStorage.setItem(typeof KEEP_KEY !== 'undefined' ? KEEP_KEY : 'source.profiles.saved',
      JSON.stringify({ t: Date.now(), n: 1, p: 1 })));
    await clearRecord(pg);
    await reload(pg);
    s = await state(pg);
    ok(!s.line.shown && !LINE_LOST.test(s.line.text), 'an empty store under a session is not read as a loss here');
    ok(errs.length === 0, 'nothing threw: ' + errs.slice(0, 2).join(' | '));
    await cx.close();
  }

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('\n===== ' + (n - fails.length) + ' passed, ' + fails.length + ' failed =====');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
