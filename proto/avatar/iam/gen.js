#!/usr/bin/env node
/* ============================================================
   THE I AM SHEET, ITS NUMBERS.

   node proto/avatar/iam/gen.js      -> proto/avatar/iam/data.json

   Field note 11, "I AM, Discovery character sheet", drawn on the product's
   own figure. Every number the comp draws comes out of engine.js here.
   Nothing is typed in, and three things are referenced and never copied:

     engine.js                the build product, read only
     proto/avatar/rise.js     the kundalini rise, Part Two's arithmetic
     atuned_src/engine/data/figure.js   BODYPATH and its transform, read as
                              text so the silhouette is the Body page's own

   RUN 0 IS THE SELF CHECK AND THE FILE EXITS NON ZERO IF IT FAILS. Three
   answers the repository already states elsewhere:

     DESIGN-avatar.md s18   Marcus is blocked at the throat, conducting 74,
                            heaviest Deceit at a weight of 2.1
     DESIGN-avatar.md s17   a blank field reads 54 per cent through the rise
     ui/imprints.js:43      installed is sq under 4 with the pole at 4 or more

   A probe in this repository has twice reported a defect that was its own
   bug, so nothing below run 0 counts unless run 0 passes.
   ============================================================ */
'use strict';
var fs = require('fs'), path = require('path');
var ROOT = path.resolve(__dirname, '../../..');
var E0 = require(path.join(ROOT, 'engine.js'));
var R = require(path.join(ROOT, 'proto/avatar/rise.js'));
var crypto = require('crypto');

var E = {W: E0.W, BANDS: E0.BANDS, S: E0.S, SI: E0.SI, bandIg: E0.bandIg, PEOPLE: E0.PEOPLE,
  CHARGES: E0.CHARGES, SINAMES: E0.SINAMES, LAWSET: E0.LAWSET, buildSoul: E0.buildSoul,
  compute: E0.compute, PRACTICE: E0.PRACTICE, tierOf: E0.tierOf, PMBANDS: E0.PMBANDS,
  ARCH: E0.ARCH, DOMAINS: E0.DOMAINS, CHILD: E0.CHILD};

var fails = 0;
function ok(c, m) { if (!c) { fails++; console.log('  FAILED  ' + m); } else console.log('  ok      ' + m); }
var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

/* proto/sheet/probe.js's loader, unchanged in what it writes. */
function load(nm, mode) {
  var p = null; E.PEOPLE.forEach(function (q) { if (q.nm === nm) p = q; });
  E.S.dom = p.dom; E.S.a1 = p.a1; E.S.a2 = p.a2; E.S.doms = [p.dom];
  E.S.arcs = [p.a1, p.a2]; E.S.roots = [];
  E.buildSoul();
  E.CHARGES.forEach(function (c) {
    if (mode === 'blank') { E.S.charge[c] = 0; E.S.replace[c] = 0; }
    else {
      E.S.charge[c] = (p.c && p.c[c] !== undefined) ? p.c[c] : 0;
      E.S.replace[c] = (p.rep && p.rep[c]) || 0;
    }
  });
  var LS = E.LAWSET[nm] || { _: 5.5 };
  E.SINAMES.forEach(function (l) {
    E.S.law[l] = (LS[l] !== undefined) ? LS[l] : (LS._ !== undefined ? LS._ : 5.5);
  });
  return E.compute();
}

/* ui/release.js:132 to :139, verbatim arithmetic. Eight addresses a run,
   heaviest first, the order compute() already sorts r.carrying into. The law
   lift at release.js:165 is not applied: it needs a profile's meter, and it
   moves coherence, which this sheet does not draw. The rise reads n.open, which
   answers to charge and the installed opposite, and those are the two lines
   below. */
function releaseRun(r, reached) {
  var q = r.carrying.slice(0, 8).filter(function (x) { return x.cf; });
  q.forEach(function (n) {
    var w0 = n.sq * 10, d = -Math.round(w0 * 0.21 + 2);
    var share = Math.abs(d) / 10 / Math.max(1, q.filter(function (y) { return y.cf === n.cf; }).length);
    E.S.charge[n.cf] = clamp((E.S.charge[n.cf] || 0) - share, 0, 10);
    E.S.replace[n.cf] = clamp((E.S.replace[n.cf] || 0) + share * 0.62, 0, 10);
    reached[n.i] = 1;
  });
  return q.length;
}

/* FOUR STATES, AND THE FIRST CUT HAD THREE. By ui/imprints.js:43 alone,
   Marcus holds nothing at any seat, while the dashboard says his throat has
   twelve addresses holding something. Both are true, because the engine
   carries two lines on purpose, compute.js:386 to :403: held is sq 4 and up
   and is the only thing called held; below the line, sq over 0 and under 4,
   "is real, a person entered it", and is reportable but never called held.
   A sheet drawn on held alone would have told Marcus his field was clear.

     held       sq 4 and up                  imprints.js:43, the display line
     below      sq over 0 and under 4        compute.js:394, `under`
     installed  pole 4 and up, so sq is 0    imprints.js:43
     quiet      nothing either way                                        */
function stateOf(n) {
  if (n.sq >= 4) return 'held';
  if (n.sq > 0) return 'below';
  if (n.pole >= 4) return 'installed';
  return 'quiet';
}

/* HIS BADGES, DRAFTED ONTO ADDRESSES THAT ALREADY EXIST. This table is the
   team's reading and it is his to rule. Two of the ten words have no address,
   and that is itself the finding: Parent and Teacher are roles a person adds,
   not patterns a sentence carries. */
var BADGES = [
  { pair: ['Hero', 'Victim'],       a: 95, b: 6 },    /* Savior Complex, Crown / Victimhood, Root */
  { pair: ['Good guy', 'Bad guy'],  a: 66, b: 82 },   /* People Pleasing, Throat / Projection, 3rd Eye */
  { pair: ['Forgive', 'Forget'],    a: 50, b: 104 },  /* Resentment (Heart) / Forgetfulness, Crown */
  { pair: ['Love', 'Hate'],         a: 60, b: 49 },   /* False Love, Heart / Hatred, Heart */
  { pair: ['Parent', 'Teacher'],    a: null, b: null } /* no address. added by the person */
];

function addrRow(n, reached) {
  return { i: n.i, k: n.k, n: n.n || '', b: n.b, sq: +n.sq.toFixed(2), pole: +n.pole.toFixed(2),
    st: stateOf(n), reached: !!(reached && reached[n.i]) };
}

function snapshot(id, label, who, r, reached, start) {
  var k = R.riseRead(E, r);
  var seats = {};
  E.BANDS.forEach(function (b) {
    var g = E.W.filter(function (n) { return n.b === b; })
      .slice().sort(function (x, y) { return y.sq - x.sq || x.i - y.i; });
    var rows = g.map(function (n) { return addrRow(n, reached); });
    seats[b] = {
      n: g.length,
      t: +k.t[b].toFixed(4),
      seg: +k.seg[b].toFixed(4),
      held: rows.filter(function (x) { return x.st === 'held'; }).length,
      below: rows.filter(function (x) { return x.st === 'below'; }).length,
      installed: rows.filter(function (x) { return x.st === 'installed'; }).length,
      addr: rows,
      laws: E.SI.filter(function (l) { return l.b === b; }).map(function (l) {
        return { nm: l.nm, v: +(+E.S.law[l.nm]).toFixed(1) }; })
    };
  });
  var byI = {}; E.W.forEach(function (n) { byI[n.i] = n; });
  var badges = BADGES.map(function (bd) {
    var half = function (i) { if (i == null) return null; return addrRow(byI[i], reached); };
    return { pair: bd.pair, a: half(bd.a), b: half(bd.b) };
  });
  /* the six masks, read the way proto/sheet/sheet.js maskRead reads them: the
     fill is w out of the axis clamp of ten, and the colour is whichever of the
     mask's own seats is carrying more. Only for the shape question's drawing. */
  var seatMean = function (b) { var g = E.W.filter(function (n) { return n.b === b; });
    return g.reduce(function (a, n) { return a + n.sq; }, 0) / g.length; };
  var masks = (r.maskRing || []).map(function (m) {
    var lead = (m.bands || []).slice().sort(function (a, b) { return seatMean(b) - seatMean(a); })[0] || null;
    return { nm: m.nm, pct: Math.round(Math.min(10, m.w || 0) * 10), lead: (m.w > 0) ? lead : null };
  });
  var heaviest = k.at ? { i: k.at.i, k: k.at.k, n: k.at.n || '', b: k.at.b, sq: +k.at.sq.toFixed(2) } : null;
  return {
    id: id, label: label, who: who,
    unread: !!r.unread,
    CQ: +(+r.CQ).toFixed(1), tier: r.tier || null,
    carrying: (r.carrying || []).length,
    rise: {
      pct: k.pct, reach: +k.reach.toFixed(3), blocked: k.blocked, holding: k.holding,
      at: heaviest,
      levers: k.levers ? {
        runs: k.levers.runs,
        release: { to: Math.round(100 * k.levers.release.to), n: k.levers.release.n },
        law: { nm: k.levers.law.nm, at: k.levers.law.at, to: Math.round(100 * k.levers.law.to),
               count: k.levers.law.count },
        now: Math.round(100 * k.levers.now), bigger: k.levers.bigger } : null
    },
    start: start || null,
    next: r.unread ? null : nextFor(k.blocked, r),
    reachedCount: reached ? Object.keys(reached).length : 0,
    seats: seats,
    badges: badges,
    masks: masks
  };
}

/* THE ONE ROUTE OUT. ui/ritual.js ritFor: the track the seat maps to, the tier
   the load allows, and the lightest practice in it. TRACK4BAND lives in a UI
   file the engine build does not carry, so it is read out of ritual.js as text
   rather than typed here a second time. It is set against the seat costing the
   rise the most, which is what the dashboard already does. */
var ritSrc = fs.readFileSync(path.join(ROOT, 'atuned_src/ui/ritual.js'), 'utf8');
var t4b = ritSrc.match(/TRACK4BAND=(\{[^}]+\})/);
var TRACK4BAND = t4b ? Function('return ' + t4b[1])() : null;
function nextFor(seat, r) {
  if (!TRACK4BAND || !seat) return null;
  var track = TRACK4BAND[seat] || 'Body';
  var tier = r.DQ >= 8 ? 1 : (r.DQ >= 4 ? 2 : 3);
  var fit = E.PRACTICE.filter(function (p) { return p.tier <= tier; });
  var first = fit.filter(function (p) { return p.track === track; });
  var pool = first.length ? first : fit;
  var p = pool.slice().sort(function (a, b) { return (a.min - b.min) || (a.tier - b.tier); })[0];
  /* sub is ritFor's own `substituted`: the seat's track holds nothing at the
     tier the load allows, so the lightest practice from any track is called. */
  return p ? { nm: p.nm, min: p.min, track: p.track, seatTrack: track, seat: seat, tier: tier,
    sub: !first.length } : null;
}

function whoOf(nm) {
  var p = null; E.PEOPLE.forEach(function (q) { if (q.nm === nm) p = q; });
  var a = function (x) { var o = E.ARCH[x]; return o ? { nm: o.nm, v: o.v, b: o.b, ic: o.ic } : null; };
  var d = E.DOMAINS[p.dom];
  return { nm: p.nm, age: p.age, role: p.role, says: p.says, a1: a(p.a1), a2: a(p.a2),
    dom: d ? { nm: d.nm, r: d.r, d: d.d, ic: d.ic } : null };
}

/* ---------------------------------------------------------------- run 0 */
console.log('=== 0 . the self check. nothing below this counts if it fails. ===');
var r0 = load('Marcus'), k0 = R.riseRead(E, r0);
ok(k0.blocked === 'Throat', 'Marcus is blocked at the throat (DESIGN-avatar.md s18)');
ok(Math.round(100 * k0.t.Throat) === 74, 'the throat conducts 74 (DESIGN-avatar.md s18), read ' + Math.round(100 * k0.t.Throat));
ok(k0.at && k0.at.k === 'Deceit' && Math.abs(k0.at.sq - 2.1) < 0.05,
  'the heaviest there is Deceit at 2.1, read ' + (k0.at && k0.at.k) + ' ' + (k0.at && k0.at.sq.toFixed(2)));
var rb = load('Marcus', 'blank'), kb = R.riseRead(E, rb);
ok(kb.pct === 54, 'a blank field reads 54 per cent through the rise (s17), read ' + kb.pct);
var bad = E.W.filter(function (n) { var s = stateOf(n); return s === 'installed' && !(n.sq < 4 && n.pole >= 4); });
ok(bad.length === 0, 'installed means sq under 4 and pole at 4 or more (imprints.js:43)');
/* THIS CHECK WAS WRONG ON ITS FIRST RUN, and it was the probe and not the
   product. It asked W for all 112 and W holds only the seated addresses: the
   four field anchors live in NODES and never enter W, which is what rise.js
   already says about them. So the sheet's boxes are W, and the four anchors
   are drawn from NODES above the head and below the feet. */
var FIELD = E0.NODES.filter(function (n) { return E.BANDS.indexOf(n.b) < 0; });
ok(E0.NODES.length === 112 && E.W.length + FIELD.length === 112 &&
   E.W.every(function (n) { return E.BANDS.indexOf(n.b) >= 0; }),
   'NODES carries 112: the seated ones in W, and ' + FIELD.length + ' field anchors outside it');
if (fails) { console.log('\nself check failed, nothing written'); process.exit(1); }

/* ------------------------------------------------------------ the states */
var states = [];

/* A FIRST OPEN. Nothing entered. compute() on a field of zeroes, and the
   surface reads unread off it the way both reading surfaces already do. */
var rf = load('Marcus', 'blank');
var sf = snapshot('first', 'First open', { nm: null, age: null, role: null, a1: null, a2: null, dom: null }, rf, null, null);
/* a first open has written nothing, so it cannot be read. compute() in a
   headless run counts the seeded laws as measured, so it does not say so on
   its own; the product gates this on CURP. Forced here and said here. */
sf.unread = true;
states.push(sf);

var rm = load('Marcus');
states.push(snapshot('marcus', 'Marcus, arrival', whoOf('Marcus'), rm, null, null));
var start = { pct: R.riseRead(E, rm).pct, t: R.riseRead(E, rm).t };

var reached = {};
for (var i = 0; i < 6; i++) releaseRun(E.compute(), reached);
var rm6 = E.compute();
states.push(snapshot('marcus6', 'Marcus, six releases on', whoOf('Marcus'), rm6, reached,
  { pct: start.pct }));

var rg = load('Gordon');
states.push(snapshot('gordon', 'Gordon, arrival', whoOf('Gordon'), rg, null, null));

/* THE TISSUE SAMPLE. Every person in the roster at arrival, read the same
   way, so the report can say what this direction does to each of them. */
var tissue = E.PEOPLE.map(function (p) {
  var r = load(p.nm), k = R.riseRead(E, r);
  var held = 0, inst = 0, below = 0;
  E.W.forEach(function (n) { var s = stateOf(n);
    if (s === 'held') held++; if (s === 'installed') inst++; if (s === 'below') below++; });
  var byI = {}; E.W.forEach(function (n) { byI[n.i] = n; });
  var bh = BADGES.filter(function (b) { return b.a != null; }).map(function (b) {
    return { pair: b.pair.join(', '), a: stateOf(byI[b.a]), b: stateOf(byI[b.b]),
      asq: +byI[b.a].sq.toFixed(1), bsq: +byI[b.b].sq.toFixed(1) }; });
  return { nm: p.nm, age: p.age, role: p.role, rise: k.pct, blocked: k.blocked,
    at: k.at ? k.at.k : null, held: held, below: below, installed: inst, badges: bh };
});

/* HIS THREE PROMPTS, ANSWERED, THROUGH THE REAL SNIFFER. The lower three
   circles on field note 11 carry a question where the upper four carry boxes.
   If those become the questions a person answers, where does an answer land?
   Six answers, written by this seat, one trait and one event per prompt, so
   this is a probe and not a panel. The control is the sentence tests/engine.js
   already asserts, and nothing below it counts unless it reads. */
var PROMPTS = [
  { seat: 'Root',   q: 'How are we operating from fear or lack?',
    trait: 'I operate from fear and lack. There is never enough.',
    event: 'I checked my bank balance three times before the meeting and my stomach dropped.' },
  { seat: 'Sacral', q: 'How are we operating from unfulfilled goals or desires?',
    trait: 'I operate from unfulfilled desires and goals.',
    event: 'I scrolled her photos until two in the morning and hated myself for it.' },
  { seat: 'Solar',  q: 'How do we feel powered or disempowered?',
    trait: 'I feel disempowered.',
    event: 'My boss corrected me in front of the team and I agreed with him and went quiet.' }];
function landOf(t) {
  var s = E0.sniffStory(t), p = E0.parseStory(t);
  var seats = {}; (p.imprints || []).forEach(function (i) { seats[i.band] = (seats[i.band] || 0) + 1; });
  var top = Object.keys(seats).sort(function (a, b) { return seats[b] - seats[a]; })[0] || null;
  return { axes: s.axes.filter(function (a) { return a.shadow > 0; }).map(function (a) { return a.axis; }),
    seat: top, imprints: (p.imprints || []).slice(0, 3).map(function (i) { return i.name; }) };
}
var ctl = landOf('i am so ashamed of myself');
ok(ctl.axes.indexOf('Shame') >= 0, 'the control sentence loads Shame (tests/engine.js:2956)');
var prompts = PROMPTS.map(function (P) {
  var a = landOf(P.trait), b = landOf(P.event);
  return { seat: P.seat, q: P.q, trait: { t: P.trait, land: a }, event: { t: P.event, land: b } };
});

/* ------------------------------------------------------------ the figure */
var figSrc = fs.readFileSync(path.join(ROOT, 'atuned_src/engine/data/figure.js'), 'utf8');
var num = function (name) { var m = figSrc.match(new RegExp(name + '=([0-9.]+)')); return m ? +m[1] : null; };
var bp = figSrc.match(/BODYPATH='([^']+)'/);
var figure = { d: bp ? bp[1] : null, s: num('PMS'), tx: num('PMTX'), ty: num('PMTY') };
ok(!!figure.d && figure.s && figure.tx && figure.ty, 'BODYPATH and its transform read from figure.js');

var out = {
  made: new Date().toISOString(),
  engineMd5: crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'engine.js'))).digest('hex'),
  bands: E.BANDS,
  pmbands: E.PMBANDS.map(function (b) { return { b: b.b, yp: b.yp, r: b.r }; }),
  si: E.SI.map(function (l) { return { nm: l.nm, b: l.b, ic: l.ic }; }),
  figure: figure,
  field: FIELD.map(function (n) { return { i: n.i, k: n.k, b: n.b, a: n.a }; }),
  states: states,
  tissue: tissue,
  prompts: prompts
};
fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(out));

/* ------------------------------------------------------------ the report */
console.log('\n=== 1 . the states ===');
states.forEach(function (s) {
  var line = E.BANDS.map(function (b) { var q = s.seats[b];
    return b + ' ' + Math.round(100 * q.t) + ' h' + q.held + ' b' + q.below + ' i' + q.installed; }).join(' | ');
  console.log('  ' + s.label + ': rise ' + s.rise.pct + (s.start ? ' from ' + s.start.pct : '') +
    ', blocked ' + s.rise.blocked + (s.rise.at ? ' (' + s.rise.at.k + ' ' + s.rise.at.sq + ')' : '') +
    ', unread ' + s.unread + ', reached ' + s.reachedCount);
  console.log('     ' + line);
  console.log('     badges ' + s.badges.map(function (b) {
    if (!b.a) return b.pair.join('/') + ' none';
    return b.pair.join('/') + ' ' + b.a.st + (b.a.reached ? '*' : '') + '/' + b.b.st + (b.b.reached ? '*' : '');
  }).join('  '));
});
console.log('\n=== 2 . the tissue sample, every roster person at arrival ===');
tissue.forEach(function (t) {
  console.log('  ' + (t.nm + ', ' + t.age).padEnd(12) + ' rise ' + String(t.rise).padStart(3) +
    '  blocked ' + String(t.blocked).padEnd(8) + ' held ' + String(t.held).padStart(3) +
    ' below ' + String(t.below).padStart(3) +
    ' installed ' + String(t.installed).padStart(3) + '  ' + t.badges.map(function (b) {
      return b.pair.split(', ')[0] + ':' + b.a[0] + '/' + b.b[0]; }).join(' '));
});
console.log('\n=== 3 . his three prompts, answered, through the real sniffer ===');
prompts.forEach(function (P) {
  ['trait', 'event'].forEach(function (k) {
    var L = P[k].land;
    console.log('  ' + P.seat.padEnd(7) + k.padEnd(6) + ' lands ' + String(L.seat || 'nowhere').padEnd(8) +
      (L.seat === P.seat ? ' at its own seat ' : (L.seat ? ' ELSEWHERE       ' : '                 ')) +
      (L.imprints.join(', ') || ''));
  });
});
console.log('\nwrote data.json, engine md5 ' + out.engineMd5 + (fails ? ', WITH FAILURES' : ''));
process.exit(fails ? 1 : 0);
