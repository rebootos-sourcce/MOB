/* ============================================================
   rise.js

   THE KUNDALINI RISE, DERIVED. No new arithmetic.

   Every quantity below is read off compute() as the build already returns it.
   Nothing here mutates the engine, nothing here invents a coefficient, and
   nothing here is stored.

   WHAT THE GLOSSARY SAYS, which is the whole specification:

     Kundalini. The stored vital energy at the base of the spine. Rises root
     to crown when enough nodes are cleared for the channel to conduct.

   So the rise needs three things and the engine already has all three.

   1. A per address conductivity. compute() writes n.open at compute.js:61,
        n.open = clamp(1 - n.sq/10 + n.pole/26, 0, 1.18)
      with the engine's own comment beside it: "an address with the opposite
      in does not merely read zero, it conducts". That is conductivity, it is
      already named open, and his word for the seat is open or blocked.

   2. A seat. Every one of the seated addresses carries n.b, one of the seven
      in BANDS. The four field addresses above the crown and below the root
      carry Field-Above and Field-Below and are not on the channel, so the
      rise never reads them.

   3. A threshold for "enough". This one is READ OFF THE ENGINE and not
      chosen. compute.js:64 sets the product's display line at sq 4: an
      address counts as carrying at 4 and the comment says the threshold "is
      what the arithmetic is built on". An address sitting exactly on that
      line, with no opposite installed, has
        open = 1 - 4/10 + 0/26 = 0.60
      So KU_OPEN is 0.60 because that is the conductivity of an address
      sitting exactly on the line this product already draws. Move the
      display line and this moves with it, which is why it is computed from
      LINE rather than typed.

   THE RISE. Walk the seats root to crown. A seat conducts when its mean
   conductivity is at or above KU_OPEN. The rise passes every seat that
   conducts and stops at the first that does not, because a channel is in
   series: a clear crown above a shut solar plexus does not conduct, and a
   bar that averaged the seven would say it did.

   THE BLOCKAGE is the first seat that does not conduct. It is an address,
   not a mood: the heaviest carrying address at that seat, which compute()
   has already sorted for us in r.carrying.

   WHAT THIS FILE REFUSES TO DO. It does not store anything, it does not
   return a level or a rank, and it does not return a single number without
   also returning the seat the number stopped at. A rise with no address on
   it is a score.
   ============================================================ */

var LINE = 4;                 /* compute.js:64, the carrying line. */
var KU_OPEN = 1 - LINE / 10;  /* 0.60. Not typed. */
var OPEN_CAP = 1.18;          /* the clamp ceiling on n.open, compute.js:61 */

/* Seat order is root to crown, which is the direction the channel runs.
   BANDS is already in that order and is read by name, never by position. */
function riseSeats(E) {
  return E.BANDS.slice();
}

/* Mean conductivity at one seat, read off n.open as compute() left it. */
function seatOpen(E, seat) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  if (!g.length) return 0;
  return g.reduce(function (a, n) { return a + n.open; }, 0) / g.length;
}

/* THE READ. One call, and every field on it says what it is. */
function riseRead(E, r) {
  var seats = riseSeats(E);
  var open = {};
  seats.forEach(function (b) { open[b] = seatOpen(E, b); });
  return riseFromOpen(E, open, r);
}

/* Split out so the same arithmetic reads a stored baseline, which is seven
   conductivities and nothing else. One truth, read two ways. */
function riseFromOpen(E, open, r) {
  var seats = riseSeats(E);
  var passed = 0, partial = 0, blocked = null;
  for (var i = 0; i < seats.length; i++) {
    var v = open[seats[i]];
    if (v == null) { blocked = seats[i]; break; }   /* an unread seat is not a passed seat */
    if (v >= KU_OPEN) { passed++; continue; }
    blocked = seats[i];
    partial = Math.max(0, Math.min(1, v / KU_OPEN));
    break;
  }
  var reach = passed + partial;                      /* in seats, 0 to 7 */
  var pct = Math.round(100 * reach / seats.length);
  var out = {
    open: open,                 /* the seven conductivities, by seat name */
    seats: seats.length,        /* 7 */
    passed: passed,             /* whole seats the channel clears */
    reach: reach,               /* seats, fractional through the blocked one */
    pct: pct,                   /* the bar, 0 to 100 */
    blocked: blocked,           /* the seat name, or null when it runs clear */
    line: KU_OPEN,
    at: null, why: null, levers: null
  };
  if (!blocked || !r) return out;
  /* THE ADDRESS. compute() already sorted carrying heaviest first, so the
     blockage has a name, a plexus and a fetter without another sort. */
  var here = (r.carrying || []).filter(function (n) { return n.b === blocked; });
  out.at = here[0] || null;
  out.why = here.length;        /* how many addresses at this seat hold anything */
  out.levers = riseLevers(E, blocked, open[blocked]);
  return out;
}

/* THE DIRECTION OUT, and there are exactly two because the arithmetic has
   exactly two. n.sq is held minus the installed opposite, and held is
   charge x susceptibility x (1 - bandIg(seat)/10 x 0.42). So the seat's
   conductivity moves on the charge, which a release empties, and on the
   seat's own laws, which nothing but conduct moves. Both are computed here
   by running the engine's own bodies, not by modelling them. */
function riseLevers(E, seat, now) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  var relief = E.bandIg(seat) / 10;

  /* LEVER ONE, the release. ui/release.js:88 takes 21 percent of the weight
     plus 2 off each address in the run and installs 62 percent of what it
     removed as the opposite. One run of eight at this seat, heaviest first. */
  var queue = g.filter(function (n) { return n.sq > 0; })
               .sort(function (a, b) { return b.sq - a.sq; }).slice(0, 8);
  var afterRel = g.map(function (n) {
    var q = queue.indexOf(n) >= 0;
    if (!q) return n.open;
    var w0 = n.sq * 10, d = Math.abs(-Math.round(w0 * 0.21 + 2));
    var share = d / 10 / Math.max(1, queue.filter(function (x) { return x.cf === n.cf; }).length);
    var held2 = Math.max(0, n.held - share * (1 - relief * 0.42));
    var rep2 = Math.min(10, n.rep + share * 0.62);
    var sq2 = Math.max(0, Math.min(10, held2 - rep2 * 0.86));
    var pole2 = Math.max(0, Math.min(10, rep2 - held2));
    return Math.max(0, Math.min(OPEN_CAP, 1 - sq2 / 10 + pole2 / 26));
  });
  var relOpen = afterRel.reduce(function (a, v) { return a + v; }, 0) / g.length;

  /* LEVER TWO, the laws at this seat. bandIg(seat) is the mean of the laws
     carrying that seat, engine/core.js. Two points on its weakest law raises
     relief, which lowers held at every address at the seat. */
  var here = E.SI.filter(function (l) { return l.b === seat; });
  var weak = here.slice().sort(function (a, b) { return E.S.law[a.nm] - E.S.law[b.nm]; })[0];
  var lawOpen = now, lawName = null;
  if (weak) {
    lawName = weak.nm;
    var ig2 = here.reduce(function (a, l) {
      return a + (l.nm === weak.nm ? Math.min(10, E.S.law[l.nm] + 2) : E.S.law[l.nm]);
    }, 0) / here.length;
    var relief2 = ig2 / 10;
    lawOpen = g.map(function (n) {
      var held2 = n.cf ? Math.max(0, Math.min(10,
        E.S.charge[n.cf] * n.susc * (1 - relief2 * 0.42))) : 0;
      var rep2 = n.cf ? Math.max(0, Math.min(10,
        (E.S.replace[n.cf] || 0) * (0.72 + 0.28 * relief2))) : 0;
      var sq2 = Math.max(0, Math.min(10, held2 - rep2 * 0.86));
      var pole2 = Math.max(0, Math.min(10, rep2 - held2));
      return Math.max(0, Math.min(OPEN_CAP, 1 - sq2 / 10 + pole2 / 26));
    }).reduce(function (a, v) { return a + v; }, 0) / g.length;
  }
  var dRel = relOpen - now, dLaw = lawOpen - now;
  return {
    seat: seat, now: now,
    release: { to: relOpen, d: dRel, n: queue.length },
    law: { nm: lawName, to: lawOpen, d: dLaw, count: here.length },
    /* which one moves this seat more. Not a preference, a comparison. */
    bigger: (dLaw > dRel ? 'law' : (dRel > dLaw ? 'release' : 'level'))
  };
}

/* THE DELTA. Needs a baseline, and says so when it has none rather than
   drawing a rise from nothing. */
function riseDelta(E, r, base) {
  var now = riseRead(E, r);
  if (!base || !base.open) return { now: now, from: null, d: null, has: false };
  var was = riseFromOpen(E, base.open, null);
  return { now: now, from: was, d: now.pct - was.pct, has: true, t: base.t || null };
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = { LINE: LINE, KU_OPEN: KU_OPEN, OPEN_CAP: OPEN_CAP,
    riseSeats: riseSeats, seatOpen: seatOpen, riseRead: riseRead,
    riseFromOpen: riseFromOpen, riseLevers: riseLevers, riseDelta: riseDelta };
