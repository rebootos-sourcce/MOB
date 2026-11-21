#!/usr/bin/env node
/* ============================================================
   A PERSON'S OWN BIRTH REACHES THE SUMMARY. 18 November.

   env CHROME=/path/to/chromium NODE_PATH=$(npm root -g) node tests/ownbirth.js
   OWNBIRTH_HTML=file   runs against another build, for checking the checker
   OWNBIRTH_SHOTS=dir   also writes a picture of each Summary into dir

   The owner, 18 November: "Route a person's own birth into converge()".

   converge(name, r) read only BIRTH, the table of reference cases, so every
   Summary caller got null for anybody real, and the birth comparison (the
   four comparisons of the birth reading against the person's own field, and
   the open bucket for what a gap in the record cannot answer) and the
   celestial strip never printed, however much birth a person typed into
   Intake. The side rail read the same birth all along through spiritualOf,
   which is why nothing looked broken from there.

   This file holds it in a real browser, at 1600 and at 390: a person with a
   reading types a fictional birth into the Intake fields themselves, and the
   Summary then carries the comparison and the strip, with no line reading
   null; the same person with no birth typed gets neither, and the page says
   what is missing instead of asserting a blueprint nobody gave it.

   CHECKED AGAINST THE BUILD FROM BEFORE THIS CHANGE FIRST, the standing rule:
   run with OWNBIRTH_HTML at the origin/main build (72a28def), it fails the
   comparison and the strip for the typed birth at both widths, and passes
   the no birth case, which did not change.

   RE-POINTED, 20 November's OWN RULING TAKEN INTO ACCOUNT (cd55089c,
   "Summary: flat left rail from celestial to archetype, centre ends at
   Your patterns", his words quoted there: "everything beneath your
   patterns... get rid of everything beneath Psyche"). sumFull no longer
   calls sumMarks or sumSpirit, so the strip this file watches for is not
   sumMarks's own .s-chip markup inside #sumbody any more; it is #spirit's
   own [data-sp] rows, the same real placements, shown flat on this tab
   now (confirmed directly: a typed birth still reaches #spirit here, a
   blank one still shows none). The birth comparison was not moved, it was
   cut outright, named in that commit as one of the folds off the page and
   never given a new home, so this file no longer looks for it. The thing
   this file actually guards, that a person's own typed birth and not only
   a canned reference case reaches the Summary screen, still holds; only
   where it shows moved.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.OWNBIRTH_HTML ? path.resolve(process.env.OWNBIRTH_HTML) : path.join(ROOT, 'source.html');
const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.OWNBIRTH_SHOTS || '';
let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) PASS++; else { FAIL++; console.log('  FAIL ' + m); } };

/* a person with a reading and no birth. Every law answered and three axes
   held, so the Summary is not the unread page, which prints no reading and
   would pass the no birth case for the wrong reason. Fictional, through the
   boundary every pasted record goes through. */
function PERSON() {
 var p = blankProfile('Test Person');
 Object.keys(p.laws).forEach(function (l, i) { p.laws[l] = 5 + (i % 3); });
 Object.keys(p.axes).slice(0, 3).forEach(function (k) { p.axes[k].held = 4; });
 var got = pImport(JSON.stringify(saveProfile(p)));
 if (!got) return { ok: false, why: importError() };
 return { ok: true, born: !!(CURP.who.born && CURP.who.born.date) };}

/* what the Summary holds, read off the document and not off a function the
   change also touched */
function READ() {
 var h = document.getElementById('sumbody'); if (!h) return null;
 /* the strip is #spirit's own [data-sp] rows now, not sumMarks's .s-chip
    markup inside #sumbody; see the file header, 20 November. */
 var spirit = document.getElementById('spirit');
 var marks = spirit ? spirit.querySelectorAll('[data-sp]') : [];
 var vis = function (e) { if (!e) return false; var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
 return {
  chips: marks.length, marksShown: marks.length > 0 && vis(spirit),
  untipped: Array.prototype.filter.call(marks, function (c) {
   return !(c.getAttribute('data-tip') || c.querySelector('[data-tip]')); }).length,
  nul: /\bnull\b|undefined|NaN/.test(h.textContent),
  unread: !!(computeSeen() || {}).unread };}

(async () => {
 const b = await chromium.launch({ executablePath: CHROME });
 require('./net.js').guardBrowser(b);
 for (const [w, ht] of [[1600, 1000], [390, 844]]) {
  for (const typed of [true, false]) {
   const tag = w + (typed ? ' typed a birth' : ' typed none');
   console.log('\n=== ' + tag + ' ===');
   const c = await b.newContext({ viewport: { width: w, height: ht } });
   const p = await c.newPage(); const errs = [];
   p.on('pageerror', e => errs.push(e.message));
   try {
    await p.goto('file://' + SRC + '?dev=1');
    await p.waitForFunction(() => document.body.classList.contains('booted'), null, { timeout: 30000 });
    const made = await p.evaluate(PERSON);
    ok(made.ok && !made.born, tag + ': the person comes in through the boundary with no birth: ' + JSON.stringify(made));
    if (typed) {
     /* typed into the real fields, the way a person types it, so the save
        and the repaint are the Intake's own and not a write this file did */
     /* the page called Intake is TAB.QUESTIONS, integer 13. TAB.INTAKE is the
        Avatar and kept that name as history (engine/core.js), and its #iqbody
        is only borrowed by the Intake page, so on the Avatar the birth row
        is not on screen to press. Looked up by the integer's name. */
     await p.evaluate(() => setTab(TAB.QUESTIONS)); await p.waitForTimeout(400);
     /* the birth fields are in the document from the start, nested behind
        their one row summary with the hidden attribute, so asking whether
        #wdate exists said yes and the fill then waited on a field nobody can
        see. The first cut of this file did that and timed out on every build,
        good and bad alike, which is the reason it is opened by its state. */
     if (await p.$('#iqwhop[hidden]')) await p.click('#iqwho');
     await p.waitForSelector('#wdate', { state: 'visible', timeout: 10000 });
     for (const [id, v] of [['#wdate', '1988-04-12'], ['#wtime', '07:45'], ['#wplace', 'Lisbon, PT'], ['#wzone', 'Europe/Lisbon']]) {
      await p.fill(id, v); await p.dispatchEvent(id, 'change'); }
     const bn = await p.evaluate(() => CURP.who.born);
     ok(bn.date === '1988-04-12' && bn.time === '07:45', tag + ': the Intake saved the birth to the record: ' + JSON.stringify(bn));
    }
    await p.evaluate(() => setTab(TAB.SUMMARY)); await p.waitForTimeout(500);
    const s = await p.evaluate(READ);
    ok(s && !s.unread, tag + ': the Summary is a reading and not the unread page');
    if (typed) {
     /* the birth comparison (data-fold=conv) is not checked here any more:
        cd55089c cut it outright, 20 November, named in its own commit as
        one of the folds off a read Summary, with no new home. */
     ok(s.chips > 0 && s.marksShown, tag + ': the celestial strip (now the left rail, #spirit) shows, ' + s.chips + ' marks');
     ok(s.untipped === 0, tag + ': every mark on the strip carries its meaning, ' + s.untipped + ' without');
    } else {
     ok(s.chips === 0, tag + ': no strip without a birth');
    }
    ok(!s.nul, tag + ': no line on the Summary reads null');
    if (SHOTS) {
     const el = await p.$('#spirit');
     if (el) await el.scrollIntoViewIfNeeded();
     await p.screenshot({ path: path.join(SHOTS, (typed ? 'typed' : 'none') + '-' + w + '.png') });
    }
    ok(errs.length === 0, tag + ': no page errors: ' + JSON.stringify(errs.slice(0, 3)));
   } catch (e) { ok(false, tag + ' threw: ' + String(e && e.message || e).split('\n')[0]); }
   await c.close();
  }
 }
 await b.close();
 console.log('\n===== ' + PASS + ' passed, ' + FAIL + ' failed =====');
 process.exit(FAIL ? 1 : 0);
})();
