#!/usr/bin/env node
/* ============================================================
   HIT, KEEP, NOT A HIT, SAID ALOUD, through the real release card. 21
   November, the Release module's voice-commands item.

   engine/relhit.js already parsed a spoken phrase (relHitHear) and wrote it
   through the one door (relHitVoice to relHitDecide), and tests/relhit.js
   holds that headless. Nothing in the browser ever opened a microphone and
   called it: the engine's own header says "the browser half, which opens the
   microphone and calls relHitVoice, is a separate item and lives in
   ui/release.js". This holds that half, on a real run's finished card, with
   the browser's SpeechRecognition replaced by a stand in the gate drives, so
   what it hears and how sure it was are the gate's to choose:

     1  the microphone press is on the card when hits are, and is not pressed
     2  pressing it opens one recogniser, outlines the first unjudged row, and
        only then reads as pressed
     3  "hit", heard clearly, confirms that row through the same log the Hit
        button writes, as a voice line, and the outline moves to the next row
     4  "keep" holds the next one, hold's own alias
     5  "release" changes nothing and says why, the engine's collision rule
     6  a clear command heard below the confidence floor changes nothing
     7  a final the browser reports twice is answered once
     8  an interim result is never acted on
     9  the Hit buttons read what the voice wrote, and the count is the log's
    10  closing the card stops the recogniser

   Checked against the known bad case first: on the build from before the
   browser half (origin/main 5d8c784b) check 1 fails, there is no press, and
   every check after it fails with it.

     NODE_PATH=/opt/node22/lib/node_modules node tests/relvoice.js
     RELVOICE_HTML=file   against another build
   ============================================================ */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(process.env.RELVOICE_HTML || path.join(ROOT, 'source.html'));
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const J = x => JSON.stringify(x);
const A = x => Array.isArray(x) ? x : [];
const T = x => typeof x === 'string' ? x : '';
const booted = async p => {
  try { await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 20000 }); } catch (e) { }
  try { await p.waitForTimeout(500); await p.evaluate(() => { if (typeof OB !== 'undefined' && OB.open && typeof obClose === 'function') obClose(); }); } catch (e) { }
};
const ev = async (page, fn, arg) => { try { return await page.evaluate(fn, arg); } catch (e) { return { err: String(e.message).split('\n')[0] }; } };

/* THE STAND IN. Every recogniser the page makes is kept on window.__SR, with
   what was started and aborted, and __say(text, conf, final, index) hands
   the newest one a result shaped the way Chromium shapes it. */
const FAKE_SR = () => {
  window.__SR = [];
  function SR() { this.started = 0; this.aborted = 0; this.continuous = false; this.interimResults = false; window.__SR.push(this); }
  SR.prototype.start = function () { this.started++; };
  SR.prototype.stop = function () { this.aborted++; };
  SR.prototype.abort = function () { this.aborted++; };
  window.SpeechRecognition = SR; window.webkitSpeechRecognition = SR;
  window.__say = function (text, conf, fin, idx) {
    var r = window.__SR[window.__SR.length - 1]; if (!r || !r.onresult) return false;
    var res = [{ transcript: text, confidence: conf }]; res.isFinal = fin !== false;
    var list = []; list[idx || 0] = res;
    r.onresult({ resultIndex: idx || 0, results: list }); return true;
  };
};

(async () => {
  if (!fs.existsSync(SRC)) { console.log(path.relative(ROOT, SRC) + ' is missing: build first'); process.exit(1); }
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ executablePath: CHROME });
  require('./net.js').guardBrowser(browser);
  for (const [W, H] of [[1600, 1000], [390, 844]]) {
    console.log('\n=== the release card, marked by voice, at ' + W + ' ===');
    const ctx = await browser.newContext({ viewport: { width: W, height: H } });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.addInitScript(FAKE_SR);
    await page.goto('file://' + SRC + '?dev=1', { waitUntil: 'load' }); await booted(page);
    /* a field with patterns running, picked by hand on a saboteur's own
       addresses, the same set up tests/releasechain.js section 8 uses */
    const pick = await ev(page, () => {
      REL_WORD_S = 0.0004; REL_GAP_S = 0.001; REL_HEAD_S = 0; REL_FRAME_S = 0;
      CURP.ui.voice = false; CURP.ui.tone = false;
      CHARGES.forEach(function (c) { S.charge[c] = 7; }); pSave();
      var sab = (compute().sabs || []).filter(function (o) { return !o.over; })[0];
      var ids = sab ? leaves(sab).map(function (n) { return n.i; }).slice(0, 3) : [];
      relPick(ids, null);
      var d = document.getElementById('reldose'); if (d) { d.value = '1'; d.dispatchEvent(new Event('change')); }
      return { sab: sab ? sab.nm : null, ids: ids };
    });
    ok(pick && pick.ids && pick.ids.length > 0, 'a charged field has a saboteur to run on: ' + J(pick));
    await page.click('#relgo');
    await page.waitForFunction(() => RUN.phase === 'done', null, { timeout: 180000 }).catch(() => { });
    await ev(page, () => { var b = document.getElementById('relrest'); if (b) b.click(); });
    await page.waitForFunction(() => document.querySelector('#rel [data-relhit]'), null, { timeout: 20000 }).catch(() => { });
    const items = await ev(page, () => { var s = relHitSession(CURP, RUN.id); return s ? s.items.map(function (x) { return x.id; }) : []; });
    ok(Array.isArray(items) && items.length >= 2, 'the finished card presents at least two patterns to mark: ' + J(items));

    /* 1 */
    const b0 = await ev(page, () => { var b = document.getElementById('relhitv'); return b ? { p: b.getAttribute('aria-pressed'), l: b.getAttribute('aria-label') } : null; });
    ok(b0 && b0.p === 'false', '1. the microphone press is on the card, not pressed: ' + J(b0));

    /* 2 */
    /* clicked through the page and not page.click, so a build with no press
       reports every check below as failed rather than ending the run */
    await ev(page, () => { var b = document.getElementById('relhitv'); if (b) b.click(); });
    const s1 = await ev(page, () => ({ n: window.__SR.length, st: window.__SR.map(function (r) { return r.started; }),
      p: document.getElementById('relhitv').getAttribute('aria-pressed'),
      on: [].slice.call(document.querySelectorAll('#rel .rel-hv-on')).map(function (e) { return e.getAttribute('data-relrow'); }),
      line: document.getElementById('relhitvs').textContent }));
    ok(s1.n === 1 && s1.st[0] === 1, '2. one recogniser, started once: ' + J(s1.st));
    ok(s1.p === 'true', '2. the press reads as pressed once it has started');
    ok(A(s1.on).length === 1 && A(s1.on)[0] === items[0], '2. the first unjudged row, and only it, is outlined: ' + J(s1.on));
    ok(/^Listening for .+\. Say hit, keep or not a hit\.$/.test(T(s1.line)), '2. the line names the row and the three commands: ' + J(s1.line));

    /* 3 */
    await ev(page, () => window.__say('Hit', 0.95, true, 0));
    const s3 = await ev(page, p => {
      var last = CURP.relhit.log[CURP.relhit.log.length - 1];
      return { st: relHitState(CURP, RUN.id, p), mode: last.mode, raw: last.raw, conf: last.conf,
        on: [].slice.call(document.querySelectorAll('#rel .rel-hv-on')).map(function (e) { return e.getAttribute('data-relrow'); }),
        btn: (document.querySelector('#rel [data-relhit="' + p + '"][data-relcmd="hit"]') || {}).getAttribute('aria-pressed') };
    }, items[0]);
    ok(s3.st === 'confirmed' && s3.mode === 'voice' && s3.raw === 'hit' && s3.conf === 0.95, '3. "Hit" confirms the row as a voice line on the one log: ' + J(s3));
    ok(s3.btn === 'true', '3. that row\'s own Hit button reads pressed, painted off the same log');
    ok(A(s3.on).length === 1 && A(s3.on)[0] === items[1], '3. the outline moves to the next unjudged row: ' + J(s3.on));

    /* 4 */
    await ev(page, () => window.__say('keep', 0.9, true, 1));
    const st4 = await ev(page, p => relHitState(CURP, RUN.id, p), items[1]);
    ok(st4 === 'held', '4. "keep" holds the next row: ' + st4);

    /* 5 and 6, against the next unjudged row when there is one, else nothing */
    const n0 = await ev(page, () => CURP.relhit.log.length);
    await ev(page, () => window.__say('release', 0.99, true, 2));
    const s5 = await ev(page, () => ({ n: CURP.relhit.log.length, line: (document.getElementById('relhitvs') || {}).textContent || '' }));
    ok(s5.n === n0, '5. "release" writes nothing: ' + s5.n + ' against ' + n0);
    if (items.length > 2) {
      ok(/Release is the run itself/.test(T(s5.line)), '5. and says why, in the engine\'s own sentence: ' + J(s5.line));
      await ev(page, () => window.__say('not a hit', 0.5, true, 3));
      const s6 = await ev(page, p => ({ n: CURP.relhit.log.length, st: relHitState(CURP, RUN.id, p), line: document.getElementById('relhitvs').textContent }), items[2]);
      ok(s6.n === n0 && s6.st === 'shown', '6. a command below the floor changes nothing: ' + J(s6));
      ok(/not clearly enough/.test(T(s6.line)), '6. and says so: ' + J(s6.line));
      /* 7: the same final index again is the browser repeating itself */
      await ev(page, () => window.__say('not a hit', 0.95, true, 4));
      const n7a = await ev(page, () => CURP.relhit.log.length);
      await ev(page, () => window.__say('not a hit', 0.95, true, 4));
      const n7b = await ev(page, () => CURP.relhit.log.length);
      ok(n7a === n0 + 1 && n7b === n7a, '7. a final reported twice is one line: ' + n0 + ' then ' + n7a + ' then ' + n7b);
    } else {
      ok(/Every pattern here is marked/.test(T(s5.line)), '5. with every row judged the microphone has closed and says so: ' + J(s5.line));
    }

    /* 8 */
    const pre8 = await ev(page, () => ({ n: CURP.relhit.log.length, on: REL_HV.on }));
    if (pre8.on) {
      await ev(page, () => window.__say('hit', 0.99, false, 9));
      const n8 = await ev(page, () => CURP.relhit.log.length);
      ok(n8 === pre8.n, '8. an interim result is never acted on');
    } else ok(true, '8. nothing left listening to hand an interim to');

    /* 9 */
    const s9 = await ev(page, () => {
      var c = relHitCount(CURP), conf = relHitSession(CURP, RUN.id).items.filter(function (x) { return x.state === 'confirmed'; }).length;
      return { c: c.hits, conf: conf, pressed: document.querySelectorAll('#rel [data-relhit][data-relcmd="hit"][aria-pressed="true"]').length,
        n: document.getElementById('relhitn').textContent };
    });
    ok(s9.c === s9.conf && s9.pressed === s9.conf, '9. the count, the log and the pressed Hit buttons agree: ' + J(s9));

    /* 10 */
    const left = await ev(page, () => { if (!REL_HV.on) document.getElementById('relhitv').click(); return !!relHvNext(); });
    const live = await ev(page, () => REL_HV.on);
    await ev(page, () => relClose());
    const s10 = await ev(page, () => { var r = window.__SR[window.__SR.length - 1]; return { on: REL_HV.on, ab: r.aborted, rec: !!REL_HV.rec }; });
    ok(live === left, '10. the microphone opens again exactly when an unjudged row is left: ' + J({ left: left, live: live }));
    ok(s10.on === false && s10.rec === false && (live ? s10.ab > 0 : true), '10. closing the card stops the recogniser: ' + J(s10));

    ok(errs.length === 0, 'no page errors: ' + J(errs.slice(0, 3)));
    await ctx.close();
  }
  await browser.close();
  console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
  process.exit(FAIL ? 1 : 0);
})();
