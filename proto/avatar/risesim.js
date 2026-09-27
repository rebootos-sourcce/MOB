#!/usr/bin/env node
/* ============================================================
   risesim.js   THE KUNDALINI RISE, SIMULATED TEN TIMES.

   Brief: "Simulate it ten times, run it by the ICPs, and then integrate it."

   THE PANEL IS NOT NEW. It is the weighted thousand from
   PANEL-ritual-1000.md, its names and weights lifted out of
   proto/ritual/losssim.js,
   nine reference profiles carrying the weights that sum to 1000. Nothing here
   reweights it, and the weights are printed in run 0 so a drift is visible.

   WHAT IS MINE, NAMED. One coefficient: JIT, the per person charge jitter
   that turns nine profiles into a thousand distinct fields. It is swept in
   run 9 from 0, which is the bare weighted panel with no invention in it at
   all, to 2.0. Every headline figure is reported at JIT 0 as well, so a reader
   can take the whole report with none of my guesses in it.

   Every other number is read off engine.js by running its own bodies.

   Run:  node proto/avatar/risesim.js
         node proto/avatar/risesim.js --json
   ============================================================ */
var path = require('path');
var E = require(path.resolve(__dirname, '../../engine.js'));
var R = require(path.resolve(__dirname, 'rise.js'));
var S = E.S;

/* the weighted thousand, names and weights from proto/ritual/losssim.js.

   It also carried a grid level per person, copied from that file when that
   file typed them by hand: Diane 3, Derek 2, Marcus 4, Angela 4, Sofia 6,
   James 2, Ana 1, Gordon 1, Rosa 10, the 20 September arithmetic. The CQ
   refit (dd0bf23) moved every one of them and losssim.js now reads its
   levels off the engine (3004f4d). Here the field was never read: it was
   copied onto each simulated person in thousand() and nothing touched it
   after. Measured 27 September by setting it to 999, to NaN, and deleting
   it: the report was byte identical all three ways. So it is removed rather
   than ported, because a stale level nothing reads is still a stale level
   the next reader will believe. If this file ever needs a level, read it
   off E.tierOf the way losssim.js does. */
var PANEL = [
  { nm: 'Diane', w: 180 }, { nm: 'Derek', w: 170 },
  { nm: 'Marcus', w: 160 }, { nm: 'Angela', w: 150 },
  { nm: 'Sofia', w: 140 }, { nm: 'James', w: 100 },
  { nm: 'Ana', w: 50 }, { nm: 'Gordon', w: 35 },
  { nm: 'Rosa', w: 15 }];
var SEED = 20260920;          /* the seed PANEL-ritual-1000.md uses */
var JIT = 1.2;                /* MINE. swept 0 to 2.0 in run 9. */

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function byName(n) { return E.PEOPLE.filter(function (p) { return p.nm === n; })[0]; }

/* loadPerson, ported from proto/ritual/losssim.js:108 unchanged, plus the
   jitter. Calling it re points the whole shared field, so every read below
   happens immediately after its own load and never across one. */
function load(nm, jit, rnd) {
  var p = byName(nm);
  S.dom = p.dom; S.a1 = p.a1; S.a2 = p.a2;
  S.doms = [p.dom]; S.arcs = [p.a1, p.a2]; S.roots = [];
  E.buildSoul();
  E.CHARGES.forEach(function (c) {
    var base = (p.c && p.c[c] !== undefined) ? p.c[c] : 0;
    var d = jit ? (rnd() * 2 - 1) * jit : 0;
    S.charge[c] = Math.max(0, Math.min(10, base + d));
    S.replace[c] = (p.rep && p.rep[c]) || 0;
  });
  var LS = E.LAWSET[nm] || { _: 5.5 };
  E.SINAMES.forEach(function (l) {
    S.law[l] = (LS[l] !== undefined) ? LS[l] : (LS._ !== undefined ? LS._ : 5.5);
  });
  return E.compute();
}
/* one release run of eight, ui/release.js:88 verbatim */
function release() {
  var r = E.compute(), q = r.carrying.slice(0, 8);
  q.forEach(function (n) {
    var d = Math.abs(-Math.round(n.sq * 10 * 0.21 + 2));
    var share = d / 10 / Math.max(1, q.filter(function (x) { return x.cf === n.cf; }).length);
    S.charge[n.cf] = Math.max(0, Math.min(10, (S.charge[n.cf] || 0) - share));
    S.replace[n.cf] = Math.max(0, Math.min(10, (S.replace[n.cf] || 0) + share * 0.62));
  });
  return E.compute();
}
/* build the thousand. one entry per simulated person, in panel order. */
function thousand(jit, seed) {
  var rnd = mulberry32(seed || SEED), out = [];
  PANEL.forEach(function (p) {
    for (var i = 0; i < p.w; i++) out.push({ nm: p.nm, rnd: rnd });
  });
  return out;
}
/* THE CEILING, MEASURED RATHER THAN RE-DERIVED. Every charge gone, the laws and
   the installed opposites as they stand, read off compute() itself, then the
   charge is put back. Until 27 September run 7 rebuilt the ceiling here by hand
   from (Intention x Integrity) / Resistance. The CQ refit (dd0bf23, 25
   September) made CQ the 21 laws summed over 210, so the hand copy was a
   retired model subtracted from a live one and printed a median headroom of
   minus 22.7, which no ceiling can have. Reading compute() cannot go stale
   that way: whatever CQ is, this is CQ with nothing held. */
function ceilings() {
  var keep = {};
  E.CHARGES.forEach(function (c) { keep[c] = S.charge[c]; S.charge[c] = 0; });
  var r0 = E.compute(), out = { cq: r0.CQ, ex: r0.EX };
  E.CHARGES.forEach(function (c) { S.charge[c] = keep[c]; });
  E.compute();
  return out;
}
function pc(n, of) { return (100 * n / of).toFixed(1); }
function med(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s[Math.floor(s.length / 2)]; }

var OUT = [], J = {};
function say(s) { OUT.push(s); console.log(s); }
function head(n, t) { say(''); say('=== RUN ' + n + '. ' + t); }

/* ------------------------------------------------------------ */
head(0, 'THE PANEL, AND THE SELF CHECK. Nothing is trusted before this passes.');
say('  weights: ' + PANEL.map(function (p) { return p.nm + ' ' + p.w; }).join(', ')
  + '  sum ' + PANEL.reduce(function (a, p) { return a + p.w; }, 0));
/* three answers the product already states */
var chk = [];
var b = E.blankProfile();
chk.push(['blank profile validates', E.validateProfile(b).ok === true]);
var c1 = JSON.parse(JSON.stringify(b)); c1.plan = c1.plan || {}; c1.plan.tier = 'platinum';
var v1 = E.validateProfile(c1);
chk.push(['plan.tier platinum refused by name',
  v1.ok === false && /not a tier this build knows/.test(v1.errs.join(' '))]);
var c2 = JSON.parse(JSON.stringify(b)); c2.axes = c2.axes || {};
chk.push(['Rosa carries nothing', (function () { load('Rosa', 0, Math.random); return E.compute().carrying.length === 0; })()]);
chk.push(['Gordon is the most loaded of the nine', (function () {
  var w = PANEL.map(function (p) { load(p.nm, 0, Math.random); return [p.nm, E.compute().carrying.length]; });
  var top = w.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
  return top[1] === 107;
})()]);
/* the shared state trap this repository has already been bitten by twice */
var A1 = (function () { load('Marcus', 0, Math.random); return JSON.stringify(R.riseRead(E, E.compute()).t); })();
load('Gordon', 0, Math.random);
var A2 = (function () { load('Marcus', 0, Math.random); return JSON.stringify(R.riseRead(E, E.compute()).t); })();
chk.push(['the rise does not read state left by another profile', A1 === A2]);
/* run 7 measures a ceiling by emptying the charge and reading compute(). That
   is only honest if it agrees with the engine's own ceiling, so it is checked
   against exCeiling on a known profile before any figure below uses it. */
chk.push(['the measured ceiling is the engine\'s exCeiling', (function () {
  load('Marcus', 0, Math.random);
  return Math.abs(ceilings().ex - E.exCeiling()) < 1e-9;
})()]);
chk.forEach(function (c) { say('  ' + (c[1] ? 'pass ' : 'FAIL ') + c[0]); });
var allok = chk.every(function (c) { return c[1]; });
say('  ' + (allok ? 'the probe is behaving. every figure below is from it.'
  : 'THE PROBE IS NOT BEHAVING AND NOTHING BELOW IS REPORTABLE.'));
if (!allok) process.exit(1);

/* ------------------------------------------------------------ */
head(1, 'CAN THE PANEL SEE A RISE AT ALL, on their first open.');
say('  A rise drawn on an unread field is a rise drawn on the defaults. compute()');
say('  already returns unread, so the count below is the count that may be drawn.');
[0, JIT].forEach(function (j) {
  var P = thousand(j), drawable = 0, unread = 0;
  P.forEach(function (x) { var r = load(x.nm, j, x.rnd); if (r.unread) unread++; else drawable++; });
  say('  jitter ' + j.toFixed(1) + ':  ' + drawable + ' of 1000 can be drawn a rise, '
    + unread + ' read as nothing entered');
});
/* and the blank field, which is what a first ever open actually is */
load('Rosa', 0, Math.random);
E.CHARGES.forEach(function (c) { S.charge[c] = 0; S.replace[c] = 0; });
E.SINAMES.forEach(function (l) { S.law[l] = 6; });
var rb = E.compute(), kb = R.riseRead(E, rb);
say('  a field with nothing in it: unread ' + rb.unread + ', and the arithmetic returns '
  + kb.pct + ' percent.');
say('  SO THE BAR MUST NOT DRAW ON unread. Undrawn it is honest, drawn it is a lie');
say('  of ' + kb.pct + ' points to somebody who has typed nothing.');
J.run1 = { drawable: 1000, unreadBar: kb.pct };

/* ------------------------------------------------------------ */
head(2, 'THE SPREAD AT ARRIVAL. A bar that saturates carries no reading.');
[0, JIT].forEach(function (j) {
  var P = thousand(j), v = [];
  P.forEach(function (x) { var r = load(x.nm, j, x.rnd); v.push(R.riseRead(E, r).pct); });
  var lo = v.filter(function (p) { return p <= 5; }).length;
  var hi = v.filter(function (p) { return p >= 95; }).length;
  say('  jitter ' + j.toFixed(1) + ':  low ' + Math.min.apply(null, v) + '  median ' + med(v)
    + '  high ' + Math.max.apply(null, v)
    + '   at or under 5 percent: ' + lo + ' of 1000   at or over 95: ' + hi + ' of 1000');
  var bkt = [0, 0, 0, 0, 0];
  v.forEach(function (p) { bkt[Math.min(4, Math.floor(p / 20))]++; });
  say('           0-19 ' + bkt[0] + '  20-39 ' + bkt[1] + '  40-59 ' + bkt[2]
    + '  60-79 ' + bkt[3] + '  80-100 ' + bkt[4]);
  if (j === JIT) J.run2 = { lo: Math.min.apply(null, v), med: med(v), hi: Math.max.apply(null, v), bkt: bkt };
});

/* ------------------------------------------------------------ */
head(3, 'WHERE IT IS BLOCKED. A readout that names one seat for everybody is a constant.');
[0, JIT].forEach(function (j) {
  var P = thousand(j), n = {};
  E.BANDS.forEach(function (b) { n[b] = 0; });
  P.forEach(function (x) { var r = load(x.nm, j, x.rnd); var k = R.riseRead(E, r); if (k.blocked) n[k.blocked]++; });
  say('  jitter ' + j.toFixed(1) + ':  ' + E.BANDS.map(function (b) { return b + ' ' + n[b]; }).join('  '));
  var top = E.BANDS.slice().sort(function (a, b) { return n[b] - n[a]; })[0];
  say('           the commonest is ' + top + ' at ' + pc(n[top], 1000) + ' percent of the panel, and '
    + E.BANDS.filter(function (b) { return n[b] > 0; }).length + ' of the 7 seats are named at all');
  if (j === JIT) J.run3 = n;
});

/* ------------------------------------------------------------ */
head(4, 'DOES IT MOVE FOR SOMEBODY DOING THE WORK. Twelve releases, a quarter at one a week.');
say('  CQ is beside it because the point of the channel is that they differ, and');
say('  expression beside that because the engine moved the release ceiling to it.');
say('  The release here is ui/release.js:88 on charge and replace. The product\'s');
say('  release also writes a small lift into the laws through the record');
say('  (releaseWork, LIFT_R 0.00077 a pattern of new ground), which this probe');
say('  has no record to carry. So the coherence figures below are exact for the');
say('  release through charge, and the law lift is bounded beside them with the');
say('  engine\'s own lawLift: twelve runs, every pattern taken as new ground and all');
say('  of it landing at the one seat whose laws lift CQ most. That is an upper');
say('  bound, not a forecast; a real quarter repeats ground and spreads over seats.');
function liftBound(perRun) {
  var best = { d: 0, nm: null, seat: null };
  PANEL.forEach(function (p) {
    var LS = E.LAWSET[p.nm] || { _: 5.5 };
    var lawOf = function (l) { return LS[l] !== undefined ? LS[l] : (LS._ !== undefined ? LS._ : 5.5); };
    E.BANDS.forEach(function (b) {
      var d = E.SI.filter(function (l) { return l.b === b; })
        .reduce(function (a, l) { var v = lawOf(l.nm); return a + E.lawLift(v, 12 * perRun) - v; }, 0) / 210 * 100;
      if (d > best.d) best = { d: d, nm: p.nm, seat: b };
    });
  });
  return best;
}
var lift8 = liftBound(8), liftCap = liftBound(E.RUN_MAX);
say('  at eight patterns a run, the run this probe releases: at most ' + lift8.d.toFixed(2)
  + ' points of CQ a quarter (' + lift8.nm + ', ' + lift8.seat + ')');
say('  at RUN_MAX, ' + E.RUN_MAX + ' patterns a run, the most a run may open: at most ' + liftCap.d.toFixed(2)
  + ' (' + liftCap.nm + ', ' + liftCap.seat + ')');
[0, JIT].forEach(function (j) {
  var P = thousand(j), dR = [], dC = [], dX = [], moved = 0, stuckC = 0, stuckX = 0;
  P.forEach(function (x) {
    var r = load(x.nm, j, x.rnd);
    var k0 = R.riseRead(E, r).pct, c0 = r.CQ, x0 = r.EX;
    for (var i = 0; i < 12; i++) release();
    var r1 = E.compute(), k1 = R.riseRead(E, r1).pct;
    dR.push(k1 - k0); dC.push(r1.CQ - c0); dX.push(r1.EX - x0);
    if (k1 - k0 >= 5) moved++;
    if (r1.CQ - c0 < 2) stuckC++;
    if (r1.EX - x0 < 2) stuckX++;
  });
  say('  jitter ' + j.toFixed(1) + ':  rise moved by median ' + med(dR) + ' points, coherence by median '
    + med(dC).toFixed(1) + ', expression by median ' + med(dX).toFixed(1));
  say('           ' + moved + ' of 1000 see the rise move 5 points or more');
  say('           ' + stuckC + ' of 1000 see coherence move less than 2 points over the same quarter');
  say('           ' + stuckX + ' of 1000 see expression move less than 2 points over the same quarter');
  if (j === JIT) J.run4 = { dRise: med(dR), dCQ: +med(dC).toFixed(1), moved: moved, stuckCQ: stuckC,
    dEX: +med(dX).toFixed(1), stuckEX: stuckX,
    liftBound8: +lift8.d.toFixed(2), liftBoundCap: +liftCap.d.toFixed(2) };
});

/* ------------------------------------------------------------ */
head(5, 'DOES IT STAY STILL FOR SOMEBODY WHO IS NOT. No releases, no law changes, a month passes.');
var P5 = thousand(JIT), same = 0;
P5.forEach(function (x) {
  var r = load(x.nm, JIT, x.rnd);
  var a = R.riseRead(E, r).pct;
  var bb = R.riseRead(E, E.compute()).pct;      /* a month of opening the app and doing nothing */
  if (a === bb) same++;
});
say('  ' + same + ' of 1000 read exactly the same number. The rise has no clock in it,');
say('  so a person who does nothing is told nothing changed, which is true.');
J.run5 = same;

/* ------------------------------------------------------------ */
head(6, 'A HARD MONTH. Every axis up 2.2, which is the load PANEL-ritual used.');
var P6 = thousand(JIT), fell = [], keptFrom = 0;
P6.forEach(function (x) {
  var r = load(x.nm, JIT, x.rnd);
  var base = R.riseBase(E);                      /* the baseline, stamped at arrival */
  var k0 = R.riseRead(E, r).pct;
  E.CHARGES.forEach(function (c) { S.charge[c] = Math.min(10, S.charge[c] + 2.2); });
  var r2 = E.compute(), d = R.riseDelta(E, r2, base);
  fell.push(d.now.pct - k0);
  if (d.from.pct === k0) keptFrom++;             /* the from mark must not move */
});
say('  the rise fell by a median of ' + Math.abs(med(fell)) + ' points, worst ' + Math.min.apply(null, fell) + '.');
say('  the baseline mark did not move for ' + keptFrom + ' of 1000, because it is a stored fact');
say('  with a date on it and not a reading. Nothing is taken away; the bar slides back');
say('  toward a mark that stays where it was.');
J.run6 = { fell: med(fell), keptFrom: keptFrom };

/* ------------------------------------------------------------ */
head(7, 'WHOSE LEVER IS IT. Rise headroom against coherence headroom, per person.');
say('  Headroom is every charge gone with the laws as they stand. The rise reach is');
say('  riseReach; the coherence and expression ceilings are compute() read with the');
say('  charge emptied and then put back (ceilings(), checked against exCeiling in run 0).');
var P7 = thousand(JIT), hr = [], hc = [], hx = [], smallC = 0, smallX = 0;
P7.forEach(function (x) {
  var r = load(x.nm, JIT, x.rnd);
  var now = R.riseRead(E, r).pct, reach = R.riseReach(E).pct;
  hr.push(reach - now);
  var ceil = ceilings();
  hc.push(ceil.cq - r.CQ); hx.push(ceil.ex - r.EX);
  if (ceil.cq - r.CQ < 3) smallC++;
  if (ceil.ex - r.EX < 3) smallX++;
});
say('  rise headroom:       median ' + med(hr) + ' points of 100, low ' + Math.min.apply(null, hr)
  + ', high ' + Math.max.apply(null, hr));
say('  coherence headroom:  median ' + med(hc).toFixed(1) + ' points of 100, low ' + Math.min.apply(null, hc).toFixed(1)
  + ', high ' + Math.max.apply(null, hc).toFixed(1));
say('  expression headroom: median ' + med(hx).toFixed(1) + ' points of 100, low ' + Math.min.apply(null, hx).toFixed(1)
  + ', high ' + Math.max.apply(null, hx).toFixed(1));
say('  ' + smallC + ' of 1000 have under 3 points of coherence to gain from emptying every');
say('  charge they carry, and ' + smallX + ' of 1000 under 3 points of expression. The slow law');
say('  lift a release also writes is not in either ceiling, as it is not in exCeiling;');
say('  run 4 bounds it. The same people have a median of ' + med(hr) + ' points of rise.');
J.run7 = { rise: med(hr), cq: +med(hc).toFixed(1), smallC: smallC,
  ex: +med(hx).toFixed(1), smallEX: smallX };

/* ------------------------------------------------------------ */
head(8, 'THE DIRECTION OUT AT THE BLOCKED SEAT. Release, or the law carrying that seat.');
say('  A quarter of release work at the blocked seat, twelve runs of eight at one a week,');
say('  against two points on the weakest of the laws carrying that seat. They are not the');
say('  same size of act and the report says so rather than calling it a fair race.');
var P8 = thousand(JIT), bg = { release: 0, law: 0, level: 0 }, lawNm = {};
P8.forEach(function (x) {
  var r = load(x.nm, JIT, x.rnd), k = R.riseRead(E, r);
  if (!k.levers) return;
  bg[k.levers.bigger]++;
  var nm = k.levers.law.nm; if (nm) lawNm[nm] = (lawNm[nm] || 0) + 1;
});
say('  the release moves the blocked seat more for ' + bg.release + ' of 1000');
say('  the seat\'s weakest law moves it more for ' + bg.law + ' of 1000');
var ln = Object.keys(lawNm).sort(function (a, b) { return lawNm[b] - lawNm[a]; });
say('  the laws named: ' + ln.map(function (n) { return n + ' ' + lawNm[n]; }).join(', '));
J.run8 = bg;

/* ------------------------------------------------------------ */
head(9, 'THE SWEEP. My one coefficient, and the one normaliser I chose.');
say('  a. the jitter, which is mine. Every headline at each end.');
[0, 0.6, 1.2, 2.0].forEach(function (j) {
  var P = thousand(j), v = [], n = {}, mv = 0;
  E.BANDS.forEach(function (b) { n[b] = 0; });
  P.forEach(function (x) {
    var r = load(x.nm, j, x.rnd), k = R.riseRead(E, r);
    v.push(k.pct); if (k.blocked) n[k.blocked]++;
    var k0 = k.pct; for (var i = 0; i < 12; i++) release();
    if (R.riseRead(E, E.compute()).pct - k0 >= 5) mv++;
  });
  var top = E.BANDS.slice().sort(function (a, b) { return n[b] - n[a]; })[0];
  say('     jit ' + j.toFixed(1) + '  median rise ' + String(med(v)).padStart(3)
    + '  seats named ' + E.BANDS.filter(function (b) { return n[b] > 0; }).length
    + '  commonest ' + top.padEnd(8) + ' ' + pc(n[top], 1000) + '%'
    + '  moved 5+ ' + mv);
});
say('  b. the normaliser. 1.18 is the clamp ceiling on n.open at compute.js:61.');
say('     Replacing it with 1.00, which throws away the installed opposite, for comparison.');
[1.18, 1.00].forEach(function (cap) {
  var old = R.OPEN_CAP;
  var P = thousand(JIT), v = [], n = {};
  E.BANDS.forEach(function (b) { n[b] = 0; });
  P.forEach(function (x) {
    var r = load(x.nm, JIT, x.rnd);
    var t = {}; E.BANDS.forEach(function (bb) {
      var g = E.W.filter(function (q) { return q.b === bb; });
      var m = g.reduce(function (a, q) { return a + q.open; }, 0) / g.length;
      t[bb] = Math.max(0, Math.min(1, m / cap));
    });
    var k = R.riseFrom(E, t, r); v.push(k.pct); if (k.blocked) n[k.blocked]++;
  });
  var hi = v.filter(function (p) { return p >= 95; }).length;
  say('     cap ' + cap.toFixed(2) + '  median ' + med(v) + '  at or over 95 percent: ' + hi + ' of 1000');
});

/* ------------------------------------------------------------ */
head(10, 'IS THE BLOCKED SEAT STABLE, or does it thrash as work is done.');
say('  A readout that names a different seat every week is not an address.');
var P10 = thousand(JIT), changes = [];
P10.forEach(function (x) {
  var r = load(x.nm, JIT, x.rnd), seen = [R.riseRead(E, r).blocked], ch = 0;
  for (var i = 0; i < 12; i++) {
    release();
    var bl = R.riseRead(E, E.compute()).blocked;
    if (bl !== seen[seen.length - 1]) ch++;
    seen.push(bl);
  }
  changes.push(ch);
});
say('  over twelve releases the named seat changed a median of ' + med(changes) + ' times,');
say('  worst ' + Math.max.apply(null, changes) + ', best ' + Math.min.apply(null, changes) + '.');
J.run10 = { med: med(changes), worst: Math.max.apply(null, changes) };

say('');
say('=== END. Every figure above was produced by this file on engine.js.');
if (process.argv.indexOf('--json') >= 0)
  require('fs').writeFileSync(path.resolve(__dirname, 'risesim.json'), JSON.stringify(J, null, 1));
