#!/usr/bin/env node
/* ============================================================
   THE HARNESS CHECKS ITSELF BEFORE IT IS BELIEVED. main.js refuses to run
   the year if any of these fails. Each one is a known good case: a thing the
   product is known to do, asked of the harness, so a defect found by the year
   is the product's and not the probe's.
   ============================================================ */
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');
const D = require('./doors.js');
const { E, clock } = D;
const { runPerson } = require('./person.js');
const { SHOWUP } = require('./model.js');
const { cohort } = require('./cohort.js');
const { STORYBANK } = require(path.join(D.ROOT, 'sim', 'stories.js'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ok    ' + m); } else { fail++; console.log('  FAIL  ' + m); } };

console.log('THE YEAR HARNESS, SELF CHECK');
/* 1. the judgement layer is the harness's, not a second copy drifting */
const h = execFileSync(process.execPath, ['-e', "process.chdir(process.argv[1]);console.log(JSON.stringify(require('./sim/harness.js').SHOWUP))", D.ROOT], { encoding: 'utf8' }).trim().split('\n').pop();
ok(h === JSON.stringify(SHOWUP), 'SHOWUP equals sim/harness.js SHOWUP, field for field');

/* 2. the clock */
clock.set(clock.START + 40 * clock.DAY_MS);
ok(Date.now() === clock.get() && new Date().getTime() === clock.get(), 'Date.now and new Date() read the simulated moment');
ok(new Date(0).getTime() === 0, 'a Date from an explicit value is untouched');

/* 3. the cohort is the nine at the stated weights times ten */
const C = cohort(), cnt = {}; C.forEach(s => cnt[s.nm] = (cnt[s.nm] || 0) + 1);
ok(C.length === 10000 && SHOWUP.every(s => cnt[s.nm] === s.weight * 10), 'cohort is 10,000 at RESEARCH-icp.md weights x 10: ' + JSON.stringify(cnt));

/* 4. F11 is retired by a measurement: a ritual not done is not a day */
clock.set(clock.START);
let p = D.begin('check');
D.ritual(p, false);
ok(E.pracDays(p, Date.now()).length === 0, 'a planned ritual not done counts no day (F11 retired)');
D.ritual(p, true);
ok(E.pracDays(p, Date.now()).length === 1, 'the same ritual marked done counts one day');

/* 5. a blank person reads nothing: the 6.5 seed of the old harness is gone */
p = D.begin('blank');
const rb = E.compute();
ok(rb.unread && !rb.complete, 'a blank profile is unread and incomplete (CQ ' + rb.CQ + ')');

/* 6. a story never moves CQ, and a release lifts it only through releaseWork */
p = D.begin('doors');
for (let b = 0; b < 21; b++) D.intakeBlock(p, b, [5, 5, 5]);
const cq0 = E.compute().CQ;
ok(E.compute().complete && Math.abs(cq0 - 50) < 1e-9, 'intake all five reads CQ 50 complete (' + cq0 + ')');
const text = STORYBANK.Diane[2][1];
const sc = D.storyCommit(p, text);
ok(sc.k > 0 && Math.abs(E.compute().CQ - cq0) < 1e-9, 'a story with ' + sc.k + ' imprints leaves CQ where it was');
const u0 = p.meter.unique.length, ch0 = E.CHILD.reduce((a, c) => a + E.S.charge[c.nm], 0);
const rr = D.release(p, sc.kept, false);
const ch1 = E.CHILD.reduce((a, c) => a + E.S.charge[c.nm], 0);
ok(rr.ran && !rr.rerun && p.meter.unique.length === u0 + rr.keys && rr.keys % 4 === 0, 'the release spent ' + rr.keys + ' new patterns, whole addresses');
ok(ch1 < ch0, 'the release lowered the charge it ran on (' + ch0.toFixed(2) + ' to ' + ch1.toFixed(2) + ')');
ok(rr.cq1 > rr.cq0, 'and lifted CQ through releaseWork (' + rr.cq0.toFixed(4) + ' to ' + rr.cq1.toFixed(4) + ')');

/* 7. the wall: spend the gift and the week, and the run is refused */
let walled = null, runs = 0;
for (let d = 0; d < 40 && !walled; d++) {
 D.storyCommit(p, STORYBANK.Derek[d % STORYBANK.Derek.length][1]);
 const x = D.release(p, D.STV.lastFound, false);
 if (x.ran) runs++; if (x.wall) walled = x;
}
ok(!!walled && E.meterBudget(p, Date.now()).cap < 4, 'after ' + runs + ' runs the allowance refuses a run (left ' + (walled && walled.left) + ')');
const uw = p.meter.unique.length; const rer = D.release(p, D.STV.lastFound, true);
ok(rer.ran && rer.rerun && p.meter.unique.length === uw, 'the free rerun at the wall runs (' + rer.keys + ' lines) and opens no new pattern');
clock.set(clock.START + 9 * clock.DAY_MS);
ok(E.meterBudget(p, Date.now()).left > (walled ? walled.left : 0), 'a week later the free grant has refilled (' + E.meterBudget(p, Date.now()).left + ' left)');

/* 8. a paid month lifts the allowance the way planFromServer writes it */
clock.set(clock.START + 10 * clock.DAY_MS);
const l0 = E.meterBudget(p, Date.now()).left; D.payMonth(p, 'one', Date.now());
ok(E.meterBudget(p, Date.now()).left > l0 + 100, 'tier one, written by planFromServer, lifts the allowance (' + l0 + ' to ' + E.meterBudget(p, Date.now()).left + ')');

/* 9. a person is a pure function of seed and index */
const a = JSON.stringify(runPerson(SHOWUP[4], 7, { seed: 99 })), b = JSON.stringify(runPerson(SHOWUP[4], 7, { seed: 99 }));
ok(a === b, 'the same person run twice is identical');
const c = JSON.stringify(runPerson(SHOWUP[4], 8, { seed: 99 }));
ok(a !== c, 'and the next person is not');

/* 10. a long survivor's year is all engine and no error */
let errs = 0, frozen = 0, tries = 0, best = null;
for (let i = 0; i < 400 && !best; i++) { const r = runPerson(SHOWUP[1], i, { seed: 5, costScale: 0.25 }); tries++; errs += r.dlyErr || 0; frozen += r.frozen; if (r.sessions > 60) best = r; }
ok(errs === 0, 'no daily summary returned error across ' + tries + ' people');
ok(!!best && best.marks > 0, 'a person with ' + (best ? best.sessions : 0) + ' sessions ran without an engine error and earned ' + (best ? best.marks : 0) + ' marks');
/* 11. the control is a control: no friction means no exit is attributed to one */
let named = 0; for (let i = 0; i < 300; i++) { const r = runPerson(SHOWUP[i % 9], i, { seed: 11, costScale: 0 }); if (r.quitOn && ['DRIFT', 'NEVER_OPENED'].indexOf(r.quitOn) < 0) named++; }
ok(named === 0, 'with every cost at zero, no exit is put down to a friction (' + named + ' of 300)');
/* 12. switching one friction off removes it and nothing else */
let f1 = 0; for (let i = 0; i < 300; i++) { const r = runPerson(SHOWUP[3], i, { seed: 12, off: ['F1'] }); if (r.quitOn === 'F1') f1++; }
ok(f1 === 0, 'with F1 off, no exit is put down to F1');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
