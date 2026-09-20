/* ============================================================
   sheet.js   THE CHARACTER SHEET, DERIVED.

   THE ONE SENTENCE THIS FILE IS BUILT TO, his:

     "The reality is that you're already the most powerful version of
      yourself. You're already there. It's the limiters that are inhibiting
      you. So we want to find the limiters and release the limiters."

   That inverts the genre, and the inversion has to be in the arithmetic
   rather than in the copy, or the page collapses back into points. So every
   gauge here is built the same way round:

     the stat is the ceiling            drawn at full length, identical for
                                        every person, never earned
     the reading is what holds it down  drawn inside the ceiling, and it goes
                                        DOWN as a person works

   NOTHING HERE IS NEW ARITHMETIC. Three quantities per seat, and all three
   come off compute() as the build already returns it.

     full   the seat with every charge gone AND the coherent opposite
            installed, which is the engine's own two mechanics both
            complete. Computed off the address table alone: it is the same
            number for every person, which is the whole point.
     clear  the seat with every charge gone and the opposite as it stands.
            This is riseReach in proto/avatar/rise.js and it is imported
            rather than restated.
     now    the seat as it reads today. seatTrans in the same file.

   And the two gaps between the three are the two mechanics of the release
   protocol, which is why this decomposition is the right one rather than a
   pretty one. GLOSS, under "Two mechanics": "(1) Release, the charge at the
   address reduces; (2) Embodied Truth, the replacement state is installed
   while the address is open."

     now .. clear    HELD. Charge is holding this down. Mechanic one empties it.
     clear .. full   EMPTY. No opposite has filled it. Mechanic two installs it.

   Measured, the three sum to 100.0 per seat for every profile on the roster.

   WHY THE CEILING IS NOT cqCeiling. It was the first thing tried, because
   TASKS.md BL2 names it. Measured on the roster in a browser, where it is
   reachable: Marcus reads CQ 39.2 against a ceiling of 39.4, and Gordon 0.8
   against 3.1. cqCeiling holds the laws where they are, so it is the ceiling
   a person's current conduct allows rather than the most powerful version of
   them, and drawn as a ceiling it tells Gordon his best possible self reads 3
   out of a hundred. That is the opposite of the brief. The finding is in
   DESIGN-sheet.md section 3 with the numbers.

   WHAT THIS FILE REFUSES TO DO. It stores nothing, mutates nothing and
   returns no level, rank or stage. It never returns a completion without the
   seat and the date it is measured against, because a completion with no
   address on it is a score.
   ============================================================ */

var OPEN_CAP = 1.18;   /* the clamp ceiling on n.open, compute.js:61 */

/* ------------------------------------------------------------
   THE CEILING, PER SEAT.

   held is 0 so sq is 0, and rep is at its own clamp of 10, so pole is 10 and
   open is 1 + 10/26 = 1.385, which the engine clamps to 1.18. The laws drop
   out: rep is replace x (0.72 + 0.28 x relief), and even at relief 0 that is
   7.2, whose pole term of 0.277 still clears the clamp. So the ceiling is a
   property of the address table and of nothing else, and every person on
   earth has the same one. That is the inversion, computed.

   An address with no fetter carries no opposite, tops out at 1.00 rather than
   1.18, and pulls its seat's ceiling under 100. One address does this:
   Root_08_Unnamed, which is already on his list.
   ------------------------------------------------------------ */
function seatFull(E, seat) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  if (!g.length) return 0;
  var s = 0;
  g.forEach(function (n) {
    s += n.cf ? OPEN_CAP : Math.min(OPEN_CAP, 1);   /* 1 - 0/10 + 0/26 */
  });
  return Math.max(0, Math.min(1, (s / g.length) / OPEN_CAP));
}
/* the addresses that cap their own seat, named rather than counted, so the
   footnote can say which one it is instead of asserting a number. */
function seatUncapped(E, seat) {
  return E.W.filter(function (n) { return n.b === seat && !n.cf; })
            .map(function (n) { return n.k; });
}

/* ------------------------------------------------------------
   THE THREE SEGMENTS.

   R is proto/avatar/rise.js. now and clear are read through it so the sheet
   and the dashboard cannot disagree about a seat, and the seat that is named
   as the limiter is its `blocked`, which is the lowest transmission, for the
   same reason. Two surfaces naming two different seats for one person is the
   defect this repository already recorded on the label that changed identity
   with its data.
   ------------------------------------------------------------ */
function ceilRead(E, R, r) {
  var k = R.riseRead(E, r), c = R.riseReach(E), seats = {};
  var mo = 0, mh = 0, me = 0;
  E.BANDS.forEach(function (b) {
    var full = seatFull(E, b), now = k.t[b], clr = c.t[b];
    if (clr < now) clr = now;            /* clearing charge cannot lower a seat */
    if (full < clr) full = clr;
    var open = full > 0 ? (now / full) * 100 : 0;
    var held = full > 0 ? ((clr - now) / full) * 100 : 0;
    var empty = 100 - open - held;
    var here = (r && r.carrying || []).filter(function (n) { return n.b === b; });
    seats[b] = {
      full: full, now: now, clear: clr,
      open: open, held: held, empty: empty,
      ig: E.bandIg(b),                   /* conduct at this seat, 0 to 10 */
      holding: here.length,              /* addresses carrying something here */
      at: here[0] || null,               /* compute() already sorted these */
      uncapped: seatUncapped(E, b)
    };
    mo += open; mh += held; me += empty;
  });
  return {
    seats: seats,
    limiter: k.blocked,                  /* the same seat the dashboard names */
    rise: k,                             /* carried, never recomputed */
    reach: c,
    mean: { open: mo / 7, held: mh / 7, empty: me / 7 },
    /* the count of addresses holding something. r.carrying is what compute()
       returns and the sheet does not filter it further. */
    limiters: (r && r.carrying || []).length
  };
}

/* ------------------------------------------------------------
   THE MASKS.

   compute() already returns maskRing: one row per mask, w the mean sq over
   the addresses at that mask's seats, and MASKS carries the seats. Nothing
   here invents a weight. The fill is w out of the axis clamp of 10.

   TWO OF THE SIX ARE THE SAME READING UNDER TWO NAMES. MASKS[1] Preteen and
   MASKS[4] Professional both carry ['Solar','Throat'], so w is identical for
   every profile, measured. That is a table defect and not a drawing decision,
   so it is reported rather than papered over: the row says which mask it
   duplicates.
   ------------------------------------------------------------ */
function maskRead(E, r) {
  var ring = (r && r.maskRing) || [];
  var byKey = {};
  E.MASKS.forEach(function (m) { byKey[m.nm] = m; });
  var sig = {};
  E.MASKS.forEach(function (m) {
    var s = m.b.slice().sort().join('+');
    (sig[s] = sig[s] || []).push(m.nm);
  });
  return ring.map(function (row) {
    var m = byKey[row.nm] || { b: [] };
    /* which of its seats carries more, which decides the colour. His words
       were that the strip is made of the chakra colours of the masks, so the
       colour has to be a reading rather than a fixed swatch. */
    var lead = m.b[0] || null, lv = -1;
    m.b.forEach(function (b) {
      var g = E.W.filter(function (n) { return n.b === b; });
      var v = g.length ? g.reduce(function (a, n) { return a + n.sq; }, 0) / g.length : 0;
      if (v > lv) { lv = v; lead = b; }
    });
    var key = m.b.slice().sort().join('+');
    var twins = (sig[key] || []).filter(function (nm) { return nm !== row.nm; });
    return {
      nm: row.nm, seats: m.b, lead: lead,
      w: row.w,                          /* 0 to 10, the engine's own */
      pct: Math.max(0, Math.min(100, row.w * 10)),
      twins: twins
    };
  });
}

/* ------------------------------------------------------------
   THE TWO SETS OF STORIES.

   These are avatar.pairs, which is already in the schema and already carries
   his ruling, quoted in engine/avatar.js: "one side is who the person is at
   their best, the other is who they are not. The app never rules on whether
   an attribute is a real edge or a saboteur wearing a virtue."

   Under the inversion that field turns out to be exactly right and nothing
   needs renaming: `be` is the ceiling in the person's own words, and `notbe`
   is the limiter in the person's own words.

   THE RESOLVER IS drills.js:767 AND IS PORTED RATHER THAN REWRITTEN. The
   right side goes to parseStory, the imprints carry a cased seat, the seat
   with the most weight wins. A sentence that resolves to nothing returns
   null, and the surface says not resolved rather than picking a seat.
   ------------------------------------------------------------ */
function pairSeat(E, text) {
  var p = E.parseStory(String(text || ''));
  if (!p || !p.imprints || !p.imprints.length) return null;
  var tally = {};
  p.imprints.forEach(function (x) {
    if (x && x.band) tally[x.band] = (tally[x.band] || 0) + (x.amt || 1);
  });
  var best = null, bv = 0;
  Object.keys(tally).forEach(function (b) { if (tally[b] > bv) { bv = tally[b]; best = b; } });
  return best;
}
/* the load at a seat, the same mean drills.js:761 takes */
function seatLoad(E, seat) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  return g.length ? g.reduce(function (a, n) { return a + n.sq; }, 0) / g.length : 0;
}
/* ONE AIM, READ.

   `clear` is the engine's own binary, avatarProgress at avatar.js:44, and it
   is kept because it is the field's contract. It is also coarse: a whole seat
   at zero is months of work, so a person sits at 0 of 3 for a quarter and the
   figure never moves.

   So the sheet carries a second reading beside it, and it needs one stored
   number to be honest: the load at the seat on the day the aim was set. With
   that, completion is how much of the limiter is gone against what it was,
   which moves on every release. Without it there is no completion and the
   surface says so. Nothing is inferred from a blank. */
function aimRead(E, pair) {
  var seat = pairSeat(E, pair.notbe);
  if (!seat) return { pair: pair, seat: null, resolved: false };
  var load = seatLoad(E, seat), ig = E.bandIg(seat);
  var gap = E.avatarGap ? E.avatarGap(pair, seat, load, ig) : null;
  var out = {
    pair: pair, seat: seat, resolved: true, load: load, ig: ig,
    clear: load <= 0, gap: gap, at: pair.at || null, was: null, pct: null
  };
  if (pair.sq0 != null && pair.sq0 > 0) {
    out.was = pair.sq0;
    out.pct = Math.max(0, Math.min(100, Math.round(100 * (1 - load / pair.sq0))));
  }
  return out;
}
function aimsRead(E, pairs) {
  var rows = (pairs || []).map(function (p) { return aimRead(E, p); });
  var res = rows.filter(function (x) { return x.resolved; });
  var meas = res.filter(function (x) { return x.pct != null; });
  return {
    rows: rows,
    resolved: res.length,
    of: rows.length,
    cleared: res.filter(function (x) { return x.clear; }).length,
    /* the mean of the aims that carry a set point, and null when none does */
    pct: meas.length
      ? Math.round(meas.reduce(function (a, x) { return a + x.pct; }, 0) / meas.length)
      : null,
    measured: meas.length
  };
}

/* ------------------------------------------------------------
   THE SUMMARY. His four: how I am doing, what I could be doing better, where
   I am slipping, and what it recommends next.

   Slipping is the one that cannot be faked. It is a comparison against a
   dated mark and nothing else, so with no baseline it returns null and the
   surface says what would put one in. Every other product in this category
   answers it from the present tense, which is how "where you are slipping"
   becomes "where you are worst".
   ------------------------------------------------------------ */
function summaryRead(E, R, r, cr, base, track4) {
  var lv = cr.rise.levers;
  var out = {
    tier: E.tierOf(r.CQ),
    limiter: cr.limiter,
    lever: lv || null,
    slipping: null, gained: null,
    next: null
  };
  if (base && base.t) {
    var was = R.riseFrom(E, base.t, null), fell = [], rose = [];
    E.BANDS.forEach(function (b) {
      var d = (cr.rise.t[b] - was.t[b]) * 100;
      if (d <= -1) fell.push({ b: b, d: d });
      if (d >= 1) rose.push({ b: b, d: d });
    });
    fell.sort(function (a, b) { return a.d - b.d; });
    rose.sort(function (a, b) { return b.d - a.d; });
    out.slipping = fell.length ? fell[0] : null;
    out.gained = rose.length ? rose[0] : null;
    out.since = base.at || null;
  }
  /* what it recommends next: the heaviest address at the seat that is
     costing the most, and the lightest practice on that seat's track. Both
     are already what the dashboard does, read from the same tables. */
  var s = cr.seats[cr.limiter];
  /* the seat to track table is ui/ritual.js:7 and is not in the engine, so it
     is handed in rather than duplicated inside the arithmetic. */
  var track = (track4 && track4[cr.limiter]) || null;
  out.next = { seat: cr.limiter, at: s && s.at ? s.at : null, holding: s ? s.holding : 0,
               track: track };
  return out;
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = { OPEN_CAP: OPEN_CAP, seatFull: seatFull, seatUncapped: seatUncapped,
    ceilRead: ceilRead, maskRead: maskRead, pairSeat: pairSeat, seatLoad: seatLoad,
    aimRead: aimRead, aimsRead: aimsRead, summaryRead: summaryRead };

/* In a browser there is no module system, so the same object is hung on the
   window under one name, exactly as rise.js does it. The page reads
   window.SHEET and nothing else. */
if (typeof window !== 'undefined')
  window.SHEET = { OPEN_CAP: OPEN_CAP, seatFull: seatFull, seatUncapped: seatUncapped,
    ceilRead: ceilRead, maskRead: maskRead, pairSeat: pairSeat, seatLoad: seatLoad,
    aimRead: aimRead, aimsRead: aimsRead, summaryRead: summaryRead };

/* HOST FREE ABOVE THE EXPORT BLOCKS, on the engine's own rule: no document,
   window, navigator, localStorage, fetch or new Image. If this arithmetic
   ever lands in atuned_src/engine/ the window shim does not go with it. */
