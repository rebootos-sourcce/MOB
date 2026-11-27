#!/usr/bin/env node
/* ============================================================
   THE YEAR, AGGREGATED. Reads sim/year/out/<arm>-<seed>.jsonl and writes
   sim/year/out/aggregate.json and prints the tables the write up quotes.

   ACTIVE, NOT ALIVE, carried from sim/harness.js: active at day D means opened
   at least once in the seven days ending at D, the rolling definition the
   cited category figures use, and it is only reported where the window is
   full, day seven on. Alive (has not stopped for good) is reported beside it
   and is the softer number. Day 1 is reported as opened on day 1.

   Every rate carries the spread across seeds (min to max of five), and a
   Wilson 95 percent interval on the pooled count, so a small cell says how
   little it knows. A cell under 30 people is flagged.
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path');
const { SHOWUP } = require('./model.js');
const OUT = path.join(__dirname, 'out');
const DAYS = [7, 14, 30, 60, 90, 120, 180, 240, 300, 365];
const files = fs.readdirSync(OUT).filter(f => /\.jsonl$/.test(f));
const byArm = {};
files.forEach(f => { const [arm, seed] = f.replace('.jsonl', '').split(/-(?=\d+$)/); (byArm[arm] = byArm[arm] || {})[seed] = path.join(OUT, f); });

const wilson = (k, n) => { if (!n) return [0, 0]; const z = 1.96, p = k / n, d = 1 + z * z / n;
 const c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return [Math.max(0, c - h), Math.min(1, c + h)]; };
const act = (r, d) => { for (let i = Math.max(1, d - 6); i <= d; i++) if (r.open[i - 1] === '1') return true; return false; };
const alive = (r, d) => r.quitDay === null || r.quitDay > d;
/* ACTIVE AND STILL GOING. The review of 5 November caught this: "active" alone
   counts a seven day window that can hold the week somebody quit in, so some
   of "active at day 30" had already quit by day 30 (built, as first measured:
   1,109 of 4,075, 27 percent). This is the number that means "still here",
   and it is reported beside the plain active count rather than replacing it,
   so a reader can see the gap. */
const actAlive = (r, d) => act(r, d) && alive(r, d);
/* THE LAST DAY THEY OPENED, separate from quitDay. quitDay is the day the
   model's own exit roll fired, which for a drift exit comes after a run of
   days spent not opening the app, so it reads later than when the person
   was last actually seen. lastOpen is the harder fact. */
const lastOpenOf = r => { for (let d = 364; d >= 0; d--) if (r.open[d] === '1') return d + 1; return 0; };
const q = (a, f) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y);
 const i = f * (s.length - 1), lo = Math.floor(i), hi = Math.ceil(i);
 return lo === hi ? s[lo] : r1((s[lo] + s[hi]) / 2); };
const r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;

function summarise(rows) {
 const n = rows.length, arr = rows.filter(r => r.arrived);
 const o = { n, arrived: arr.length, openedDay1: rows.filter(r => r.open[0] === '1').length, active: {}, alive: {}, activeAlive: {} };
 DAYS.forEach(d => { o.active[d] = rows.filter(r => act(r, d)).length; o.alive[d] = rows.filter(r => r.arrived && alive(r, d)).length;
  o.activeAlive[d] = rows.filter(r => actAlive(r, d)).length; });
 const qd = arr.filter(r => r.quitDay !== null).map(r => r.quitDay);
 o.quitDay = { p25: q(qd, .25), median: q(qd, .5), p75: q(qd, .75), p90: q(qd, .9), max: q(qd, 1) };
 const lo = arr.filter(r => r.quitDay !== null).map(lastOpenOf);
 o.lastOpen = { median: q(lo, .5), p75: q(lo, .75) };
 o.exits = {}; rows.forEach(r => { const k = r.quitOn || 'STAYED'; o.exits[k] = (o.exits[k] || 0) + 1; });
 const mean = f => arr.length ? r2(arr.reduce((a, r) => a + f(r), 0) / arr.length) : 0;
 o.perArrival = { sessions: mean(r => r.sessions), minutes: mean(r => r.minutes), stories: mean(r => r.stories),
  storiesRead: mean(r => r.storiesRead), releases: mean(r => r.releases), reruns: mean(r => r.reruns),
  ritualsDone: mean(r => r.ritualsDone), marks: mean(r => r.marks), summariesFrozen: mean(r => r.frozen), summariesSilent: mean(r => r.silent) };
 o.share = { intakeDone: arr.filter(r => r.intakeDone).length, everReleased: arr.filter(r => r.releases > 0).length,
  everWalled: arr.filter(r => r.walls > 0).length, loopClosed: arr.filter(r => r.loopClosed > 0).length,
  everStory: arr.filter(r => r.stories > 0).length, storyReadNothingEver: arr.filter(r => r.stories > 0 && r.storiesRead === 0).length };
 o.days = { firstRelease: q(arr.filter(r => r.firstRelease !== null).map(r => r.firstRelease), .5),
  firstWall: q(arr.filter(r => r.firstWall !== null).map(r => r.firstWall), .5),
  intakeDone: q(arr.filter(r => r.intakeDay !== null).map(r => r.intakeDay), .5) };
 /* what the engine reads for the people still active, at each checkpoint */
 o.engineActive = {};
 [30, 90, 180, 365].forEach(d => {
  const c = rows.filter(r => act(r, d) && r.cp[d]).map(r => r.cp[d]);
  o.engineActive[d] = { n: c.length, cqMedian: q(c.filter(x => x.cq !== null).map(x => x.cq), .5),
   completeShare: c.length ? r2(c.filter(x => x.complete).length / c.length) : null,
   streakMedian: q(c.map(x => x.streak), .5), marksMedian: q(c.map(x => x.marks), .5), leftMedian: q(c.map(x => x.left), .5),
   uniqueMedian: q(c.map(x => x.unique), .5) };
 });
 o.dlyErr = rows.reduce((a, r) => a + (r.dlyErr || 0), 0);
 return o;
}

const agg = { generated: new Date().toISOString(), days: DAYS, arms: {} };
Object.keys(byArm).sort().forEach(arm => {
 const seeds = Object.keys(byArm[arm]).sort();
 const per = {}, pooled = [];
 seeds.forEach(s => { const rows = fs.readFileSync(byArm[arm][s], 'utf8').trim().split('\n').map(JSON.parse); per[s] = rows; pooled.push(...rows); });
 const A = { seeds, all: {}, icp: {} };
 const block = sel => {
  const bySeed = seeds.map(s => summarise(per[s].filter(sel)));
  const P = summarise(pooled.filter(sel));
  const spread = {}; DAYS.forEach(d => { const v = bySeed.map(x => x.active[d] / x.n); spread[d] = [Math.min(...v), Math.max(...v)]; });
  const ci = {}; DAYS.forEach(d => { ci[d] = wilson(P.active[d], P.n); });
  return Object.assign(P, { perSeedN: bySeed[0].n, seedSpread: spread, wilson: ci, small: bySeed[0].n < 30 });
 };
 A.all = block(() => true);
 SHOWUP.forEach(sp => { A.icp[sp.nm] = block(r => r.nm === sp.nm); });
 agg.arms[arm] = A;
});
fs.writeFileSync(path.join(OUT, 'aggregate.json'), JSON.stringify(agg, null, 1));

/* ---- the tables ---- */
const pct = (k, n) => n ? (100 * k / n).toFixed(k && 100 * k / n < 1 ? 2 : 1) : '-';
for (const arm of Object.keys(agg.arms)) {
 const A = agg.arms[arm];
 console.log(`\n## ${arm}  (${A.seeds.length} seeds, ${A.all.n} person-runs)`);
 console.log('| Who | n per seed | Opened at all | Active d7 | d14 | d30 | d60 | d90 | d120 | d180 | d365 | Median exit day |');
 console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
 const row = (nm, P) => console.log(`| ${nm} | ${P.perSeedN} | ${pct(P.arrived, P.n)}% | ` +
  [7, 14, 30, 60, 90, 120, 180, 365].map(d => pct(P.active[d], P.n) + '%').join(' | ') + ` | ${P.quitDay.median} |`);
 row('**All**', A.all); SHOWUP.forEach(sp => row(sp.nm, A.icp[sp.nm]));
 /* active AND still going, at day 30 and day 90, beside the plain active
    figure. The gap between the two is people a 7 day window still counts
    though the model has already closed their record. */
 console.log(`
### ${arm}, active and not yet gone`);
 console.log('| Who | Active d30 | ...and not yet gone | Active d90 | ...and not yet gone | Last day opened, median |');
 console.log('|---|---|---|---|---|---|');
 const row2 = (nm, P) => console.log(`| ${nm} | ${pct(P.active[30], P.n)}% | ${pct(P.activeAlive[30], P.n)}% | ` +
  `${pct(P.active[90], P.n)}% | ${pct(P.activeAlive[90], P.n)}% | ${P.lastOpen.median} |`);
 row2('**All**', A.all); SHOWUP.forEach(sp => row2(sp.nm, A.icp[sp.nm]));
}
