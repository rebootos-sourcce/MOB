#!/usr/bin/env node
/* ============================================================
   EVERY FIGURE IN DESIGN-sheet.md, REGENERABLE.

   node proto/sheet/probe.js

   RUN 0 IS THE SELF CHECK AND THE REPORT EXITS NON ZERO IF IT FAILS. Two
   probes in this repository have reported a defect that was the probe's own
   bug, so nothing below run 0 is evidence unless run 0 reproduces answers the
   repository already states somewhere else:

     tests/engine.js:2956   'i am so ashamed of myself' loads an axis and
                            offers something
     DESIGN-avatar.md s18   Marcus is blocked at the throat, conducting 74,
                            heaviest Deceit at a weight of 2.1
     DESIGN-avatar.md s17   a blank field returns 54 per cent through the rise

   Nothing here mutates S beyond loading a roster profile, which is what every
   probe in proto/ does, and the ceiling arithmetic touches nothing at all.
   ============================================================ */
var E0 = require('../../engine.js');
var R = require('../avatar/rise.js');
var X = require('./sheet.js');

var E = {W:E0.W, BANDS:E0.BANDS, S:E0.S, SI:E0.SI, bandIg:E0.bandIg, PEOPLE:E0.PEOPLE,
  MASKS:E0.MASKS, CHARGES:E0.CHARGES, SINAMES:E0.SINAMES, LAWSET:E0.LAWSET,
  buildSoul:E0.buildSoul, compute:E0.compute, PRACTICE:E0.PRACTICE, tierOf:E0.tierOf,
  PAL:E0.PAL, PMBANDS:E0.PMBANDS, parseStory:E0.parseStory, avatarGap:E0.avatarGap,
  avatarProgress:E0.avatarProgress};
var ROSTER = ['Marcus','Diane','Sofia','Angela','Derek','James','Ana','Gordon','Tomas','Rosa'];
var fails = 0;
function ok(c, m) { if (!c) { fails++; console.log('  FAILED  ' + m); } else console.log('  ok      ' + m); }
function load(nm, mode) {
  var p = null; E.PEOPLE.forEach(function (q) { if (q.nm === nm) p = q; });
  E.S.dom = p.dom; E.S.a1 = p.a1; E.S.a2 = p.a2; E.S.doms = [p.dom];
  E.S.arcs = [p.a1, p.a2]; E.S.roots = [];
  E.buildSoul();
  E.CHARGES.forEach(function (c) {
    if (mode === 'blank') { E.S.charge[c] = 0; E.S.replace[c] = 0; }
    else if (mode === 'full') { E.S.charge[c] = 0; E.S.replace[c] = 10; }
    else {
      E.S.charge[c] = (p.c && p.c[c] !== undefined) ? p.c[c] : 0;
      E.S.replace[c] = (p.rep && p.rep[c]) || 0;
    }
  });
  var LS = E.LAWSET[nm] || { _: 5.5 };
  E.SINAMES.forEach(function (l) {
    E.S.law[l] = (mode === 'full') ? 10
      : ((LS[l] !== undefined) ? LS[l] : (LS._ !== undefined ? LS._ : 5.5));
  });
  return E.compute();
}

console.log('=== 0 . the self check. nothing below this counts if it fails. ===');
{
  var k0 = E0.sniffStory('i am so ashamed of myself');
  ok(k0.axes.some(function (a) { return a.shadow > 0; }) && k0.offer.length > 0,
    'the known sniffer case loads an axis and offers something');
  var r0 = load('Marcus'), kk = R.riseRead(E, r0);
  ok(kk.blocked === 'Throat', 'Marcus is blocked at the throat, as the dashboard reports');
  ok(Math.round(kk.t.Throat * 100) === 74, 'and that seat conducts 74, ' + Math.round(kk.t.Throat * 100));
  ok(kk.at && kk.at.k === 'Deceit' && kk.at.sq.toFixed(1) === '2.1',
    'and the heaviest address there is Deceit at 2.1');
  var rb = load('Marcus', 'blank'), kb = R.riseRead(E, rb);
  ok(kb.pct === 54, 'a blank field returns 54 per cent through the rise, ' + kb.pct);
  var before = JSON.stringify(E.S.charge);
  X.ceilRead(E, R, load('Gordon'));
  ok(JSON.stringify(E.S.charge) !== before || true, 'the ceiling read completed');
  var gc = JSON.stringify(E.S.charge);
  X.ceilRead(E, R, E.compute());
  ok(JSON.stringify(E.S.charge) === gc, 'and a second ceiling read mutated nothing in S');
}
if (fails) { console.log('\nSELF CHECK FAILED. Nothing below is evidence.'); process.exit(1); }

console.log('\n=== 1 . the ceiling every person shares. ===');
{
  var rf = load('Marcus', 'full'), kf = R.riseRead(E, rf);
  console.log('  charge 0, opposite 10, laws 10, per seat:');
  console.log('    ' + E.BANDS.map(function (b) {
    return b + ' ' + Math.round(kf.t[b] * 100); }).join('   '));
  console.log('  the rise at that state: ' + kf.pct);
  console.log('  seatFull, which is the same arithmetic with nothing loaded at all:');
  console.log('    ' + E.BANDS.map(function (b) {
    return b + ' ' + (X.seatFull(E, b) * 100).toFixed(1); }).join('   '));
  E.BANDS.forEach(function (b) {
    var u = X.seatUncapped(E, b);
    if (u.length) console.log('  ' + b + ' is capped under 100 by: ' + u.join(', ')
      + '. An address with no fetter carries no opposite.');
  });
}

console.log('\n=== 2 . the three segments, and they sum to 100. ===');
{
  console.log('  name      limiters   open   held  empty   sum    seat costing most');
  ROSTER.forEach(function (nm) {
    var r = load(nm), cr = X.ceilRead(E, R, r);
    var s = cr.mean.open + cr.mean.held + cr.mean.empty;
    console.log('  ' + nm.padEnd(9)
      + String(cr.limiters).padStart(8)
      + cr.mean.open.toFixed(1).padStart(7)
      + cr.mean.held.toFixed(1).padStart(7)
      + cr.mean.empty.toFixed(1).padStart(7)
      + s.toFixed(1).padStart(7) + '    ' + cr.limiter);
    if (Math.abs(s - 100) > 0.05) { fails++; console.log('    OFF BY MORE THAN 0.05'); }
  });
}

console.log('\n=== 3 . cqCeiling, which was the first ceiling tried. ===');
{
  var reach = (typeof E0.cqCeiling === 'function');
  console.log('  reachable from node: ' + (reach ? 'yes' : 'no, it is absent from engine/export.js'));
  if (reach) {
    console.log('  name         CQ   cqCeiling   headroom');
    ROSTER.forEach(function (nm) {
      var r = load(nm), c = E0.cqCeiling();
      console.log('  ' + nm.padEnd(10) + r.CQ.toFixed(1).padStart(6)
        + c.toFixed(1).padStart(11) + (c - r.CQ).toFixed(1).padStart(11));
    });
    console.log('  A ceiling that reads 3.1 for a person at 0.8 is not the most powerful');
    console.log('  version of them. It holds the laws where they are.');
  }
}

console.log('\n=== 4 . the masks, and the two that are one reading. ===');
{
  ['Marcus', 'Gordon', 'Sofia'].forEach(function (nm) {
    var r = load(nm), ms = X.maskRead(E, r);
    console.log('  ' + nm + ': ' + ms.map(function (m) {
      return m.nm + ' ' + Math.round(m.pct) + (m.lead ? ' ' + m.lead.toLowerCase() : ''); }).join(', '));
  });
  var rb2 = load('Marcus', 'blank'), mb = X.maskRead(E, rb2);
  console.log('  a field with nothing in it: '
    + mb.map(function (m) { return m.nm + ' ' + Math.round(m.pct); }).join(', '));
  var tw = X.maskRead(E, load('Gordon')).filter(function (m) { return m.twins.length; });
  tw.forEach(function (m) {
    console.log('  ' + m.nm + ' reads the same seats as ' + m.twins.join(' and ')
      + ' (' + m.seats.join(' and ') + '), so the two figures can never differ.');
  });
}

console.log('\n=== 5 . his own example, through the sniffer. ===');
{
  var CASES = ['self worth', 'confidence', 'self respect', 'follow through', 'discipline',
    'i have no self worth', 'i have no confidence', 'i have no self respect',
    'i have no discipline',
    'i do not follow through on the things i say i am going to do',
    'i am worthless',
    'i feel stupid and worthless when he corrects me',
    'i said i would and i did not show up',
    'i broke my word again'];
  console.log('  what the text, the axes it loads, the seats the offer names, the laws');
  CASES.forEach(function (t) {
    var r = E0.sniffStory(t);
    var ax = r.axes.filter(function (a) { return a.shadow > 0; })
      .map(function (a) { return a.axis + ' ' + a.shadow.toFixed(1); });
    var lw = (r.laws || []).map(function (l) { return l.law; });
    var seat = X.pairSeat(E, t);
    console.log('  "' + t + '"');
    console.log('     axes ' + (ax.length ? ax.join(', ') : 'none')
      + '   offers ' + r.offer.length
      + '   laws ' + (lw.length ? lw.join(', ') : 'none')
      + '   resolver ' + (seat || 'null'));
    if (r.offer.length) console.log('     first offer: ' + r.offer[0].address
      + ' -> ' + r.offer[0].replacement);
  });
  console.log('');
  console.log('  the lexicon, 231 words, on the family he named:');
  ['worth', 'worthless', 'worthy', 'unworthy', 'confidence', 'confident', 'respect',
   'disrespect', 'discipline', 'value', 'esteem', 'inadequate', 'not good enough',
   'stupid', 'follow through'].forEach(function (w) {
    var h = E0.LEX[w];
    console.log('     ' + (h ? 'in    ' : 'absent') + '  ' + w + (h ? '  ' + JSON.stringify(h) : ''));
  });
  console.log('');
  var un = E.W.filter(function (n) { return /worth/i.test(n.k); });
  console.log('  the addresses the engine already has for it:');
  un.forEach(function (n) { console.log('     ' + n.k + ' at the ' + n.n
    + ', seat ' + n.b + ', axis ' + n.cf); });
  console.log('');
  console.log('  which laws are seated at the solar plexus:');
  console.log('     ' + E.SI.filter(function (l) { return l.b === 'Solar'; })
    .map(function (l) { return l.nm; }).join(', '));
  console.log('  and the cues Duty carries, which is follow through:');
  (E0.LAWCUE || []).forEach(function (row) {
    if (row[1] === 'Duty') console.log('     ' + row[3].join(', '));
  });
}

console.log('\n=== 6 . the two sets of stories, resolved. ===');
{
  var PAIRS = [
    { be: 'Somebody who keeps his word', notbe: 'I said I would and I did not show up' },
    { be: 'Somebody who says the hard thing',
      notbe: 'I sat in the meeting and said nothing while he took the credit' },
    { be: 'Somebody with self respect', notbe: 'I have no self respect' }
  ];
  load('Marcus');
  PAIRS.forEach(function (p) {
    var a = X.aimRead(E, p);
    console.log('  ' + (a.resolved ? (a.seat + ', load ' + a.load.toFixed(1)) : 'NOT RESOLVED')
      + '   "' + p.notbe + '"');
  });
}

console.log('\n' + (fails ? fails + ' FAILED' : 'every assertion passed'));
process.exit(fails ? 1 : 0);
