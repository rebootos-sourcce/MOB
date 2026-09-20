/* ============================================================
   rise.js   THE KUNDALINI RISE, DERIVED.

   No new arithmetic. Every quantity is read off compute() as the build
   already returns it. Nothing here mutates the engine and nothing is stored.

   WHAT THE GLOSSARY SAYS, which is the whole specification:

     Kundalini. The stored vital energy at the base of the spine. Rises root
     to crown when enough nodes are cleared for the channel to conduct.

   THREE THINGS ARE NEEDED AND THE ENGINE HAS ALL THREE.

   1. A conductivity per address. compute() writes n.open at compute.js:61,
        n.open = clamp(1 - n.sq/10 + n.pole/26, 0, 1.18)
      with the engine's own comment beside it: "an address with the opposite
      in does not merely read zero, it conducts". That is conductivity, the
      engine already calls it open, and open or blocked is his own word.

   2. A seat. Each of the 108 seated addresses carries n.b, one of the seven
      in BANDS. The four field addresses, Sol Star and Stellar Gateway above
      the crown and Earth Star and Gaia Gateway below the root, carry
      Field-Above and Field-Below. They are not on the channel and the rise
      never reads them.

   3. A way to turn seven conductivities into one height.

   THE THIRD ONE WAS MEASURED RATHER THAN CHOSEN, AND THE FIRST TWO TRIES
   WERE WRONG. A threshold per seat was tried first: a seat conducts when its
   mean conductivity clears the value an address sitting exactly on the
   product's own carrying line would have, 1 - 4/10 = 0.60. Measured on the
   roster, seven of ten read 100 percent while carrying between 52 and 99
   addresses. Marcus carries 99 and the bar said his channel was fully open.
   Every stricter threshold collapsed the other way: at 0.95, nine of ten read
   between 5 and 14 percent and every one of them was blocked at the root,
   because a channel in series always blames the first seat. A bar pinned near
   zero for everybody, naming the same seat for everybody, carries no reading.

   SO THE RISE IS A SERIES TRANSMISSION AND THERE IS NO THRESHOLD AT ALL.

     t(seat)  = clamp(mean(n.open at that seat) / 1.18, 0, 1)
     cum(i)   = t(seat 1) x ... x t(seat i)        root first
     reach    = cum(1) + cum(2) + ... + cum(7)     0 to 7 seats
     pct      = round(100 x reach / 7)

   Every part of that is read off the engine. 1.18 is the clamp ceiling on
   n.open at compute.js:61, so a seat cleared to nothing with no opposite
   installed transmits 1/1.18 = 0.847 and only a seat with the opposite
   installed transmits 1.00. That is the engine's own claim, that clearing
   gets an address to zero and the installed pole is what makes it conduct,
   and the normaliser honours it rather than flattening it.

   The product is what makes it a channel. A shut root throttles everything
   above it, which is his model exactly: a clear crown over a blocked solar
   plexus does not conduct, and a bar that averaged the seven would say it
   did.

   WHERE IT IS BLOCKED is the seat with the lowest transmission, not the
   first seat under a line. Measured across the fourteen voice cases that
   names the throat six times, the solar plexus four, the root three and the
   sacral once, so it is a reading that varies rather than a constant. The
   address is the heaviest carrying address at that seat, which compute() has
   already sorted into r.carrying.

   WHAT THIS FILE REFUSES TO DO. It stores nothing. It returns no level, rank
   or stage. It never returns a height without the seat that height stopped
   at, because a rise with no address on it is a score.
   ============================================================ */

var OPEN_CAP = 1.18;   /* the clamp ceiling on n.open, compute.js:61 */

/* Root to crown is the direction the channel runs. BANDS is already in that
   order. Read by name, never by position, which is the standing rule. */
function riseSeats(E) { return E.BANDS.slice(); }

/* Transmission at one seat, off n.open as compute() left it. */
function seatTrans(E, seat) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  if (!g.length) return 0;
  var m = g.reduce(function (a, n) { return a + n.open; }, 0) / g.length;
  return Math.max(0, Math.min(1, m / OPEN_CAP));
}

/* THE READ. r is what compute() returned. Pass it and the blockage gets an
   address; leave it out and the height still reads. */
function riseRead(E, r) {
  var seats = riseSeats(E), t = {};
  seats.forEach(function (b) { t[b] = seatTrans(E, b); });
  return riseFrom(E, t, r);
}

/* Split out so a stored baseline, which is seven transmissions and nothing
   else, reads through the same arithmetic. One truth, read twice. */
function riseFrom(E, t, r) {
  var seats = riseSeats(E), cum = 1, reach = 0, seg = {}, worst = null, wv = 2;
  seats.forEach(function (b) {
    cum *= (t[b] == null ? 0 : t[b]);
    seg[b] = cum; reach += cum;
    if (t[b] != null && t[b] < wv) { wv = t[b]; worst = b; }
  });
  var out = {
    t: t,                 /* transmission per seat, by seat name */
    seg: seg,             /* how much of the channel is left arriving at each seat */
    seats: seats.length,  /* 7 */
    reach: reach,         /* in seats, 0 to 7 */
    pct: Math.round(100 * reach / seats.length),
    blocked: worst,       /* the seat that costs the most */
    at: null, holding: 0, levers: null
  };
  if (!worst || !r) return out;
  var here = (r.carrying || []).filter(function (n) { return n.b === worst; });
  out.at = here[0] || null;          /* already sorted heaviest first by compute() */
  out.holding = here.length;
  out.levers = riseLevers(E, worst);
  return out;
}

/* THE REACH. Every charge gone, the laws and the installed opposites as they
   stand. Built the way cqCeiling is built at compute.js:263: nothing is
   mutated and nothing is simulated, held is zero by construction so the pole
   is the whole of the installed side. It is the dotted end of the bar, and it
   moves only on conduct, never on a release. */
function riseReach(E) {
  var seats = riseSeats(E), t = {};
  seats.forEach(function (b) {
    var g = E.W.filter(function (n) { return n.b === b; });
    var relief = E.bandIg(b) / 10, s = 0;
    g.forEach(function (n) {
      var rep = n.cf ? Math.max(0, Math.min(10,
        (E.S.replace[n.cf] || 0) * (0.72 + 0.28 * relief))) : 0;
      var sq = 0;                               /* held is 0, so sq is 0 */
      var pole = Math.max(0, Math.min(10, rep));
      s += Math.max(0, Math.min(OPEN_CAP, 1 - sq / 10 + pole / 26));
    });
    t[b] = Math.max(0, Math.min(1, (s / g.length) / OPEN_CAP));
  });
  return riseFrom(E, t, null);
}

/* THE DIRECTION OUT, and the arithmetic has exactly two. n.sq is held minus
   the installed opposite, and held is charge x susceptibility x
   (1 - bandIg(seat)/10 x 0.42). So a seat's transmission moves on the charge,
   which a release empties, and on the laws carrying that seat, which nothing
   but conduct moves. Both are computed here by running the engine's own
   bodies on a copy, not by modelling them. */
function riseLevers(E, seat) {
  var g = E.W.filter(function (n) { return n.b === seat; });
  var now = seatTrans(E, seat);
  var norm = function (arr) {
    return Math.max(0, Math.min(1,
      (arr.reduce(function (a, v) { return a + v; }, 0) / arr.length) / OPEN_CAP));
  };
  /* Both levers are run on LOCAL COPIES of charge and replace. Nothing in S is
     touched, because a probe in this repository once read shared state left by
     another run and reported a whole lane as empty. */
  var openOf = function (n, ch, rp, relief) {
    var held = n.cf ? Math.max(0, Math.min(10, (ch[n.cf] || 0) * n.susc * (1 - relief * 0.42))) : 0;
    var rep = n.cf ? Math.max(0, Math.min(10, (rp[n.cf] || 0) * (0.72 + 0.28 * relief))) : 0;
    var sq = Math.max(0, Math.min(10, held - rep * 0.86));
    var pole = Math.max(0, Math.min(10, rep - held));
    return { open: Math.max(0, Math.min(OPEN_CAP, 1 - sq / 10 + pole / 26)), sq: sq };
  };
  var copy = function (o) { var c = {}; for (var k in o) c[k] = o[k]; return c; };

  /* LEVER ONE. A QUARTER OF RELEASE WORK AT THIS SEAT, twelve runs of eight at
     one a week, which is the unit the roster table already uses. One run moves
     a seat by under two points and a person cannot act on that, so the honest
     comparison is the one a quarter of work actually buys.
     ui/release.js:88 verbatim: 21 percent of the weight plus 2 off each address
     in the run, and 62 percent of what it removed installed as the opposite. */
  var ch = copy(E.S.charge), rp = copy(E.S.replace), relief = E.bandIg(seat) / 10;
  var RUNS = 12, touched = {};
  for (var run = 0; run < RUNS; run++) {
    var live = g.map(function (n) { return { n: n, sq: openOf(n, ch, rp, relief).sq }; })
                .filter(function (x) { return x.sq > 0; })
                .sort(function (a, b) { return b.sq - a.sq; }).slice(0, 8);
    if (!live.length) break;
    live.forEach(function (x) {
      touched[x.n.i] = 1;
      var d = Math.abs(-Math.round(x.sq * 10 * 0.21 + 2));
      var same = live.filter(function (y) { return y.n.cf === x.n.cf; }).length;
      var share = d / 10 / Math.max(1, same);
      ch[x.n.cf] = Math.max(0, Math.min(10, (ch[x.n.cf] || 0) - share));
      rp[x.n.cf] = Math.max(0, Math.min(10, (rp[x.n.cf] || 0) + share * 0.62));
    });
  }
  var relT = norm(g.map(function (n) { return openOf(n, ch, rp, relief).open; }));

  /* LEVER TWO. Two points on the weakest law carrying this seat. bandIg is the
     mean of the laws at the seat, engine/core.js, so raising one raises the
     relief at every address here. It is a change a person makes once. */
  var here = E.SI.filter(function (l) { return l.b === seat; });
  var weak = here.slice().sort(function (a, b) { return E.S.law[a.nm] - E.S.law[b.nm]; })[0];
  var lawT = now, lawNm = null, lawAt = null;
  if (weak) {
    lawNm = weak.nm; lawAt = E.S.law[weak.nm];
    var ig2 = here.reduce(function (a, l) {
      return a + (l.nm === weak.nm ? Math.min(10, E.S.law[l.nm] + 2) : E.S.law[l.nm]);
    }, 0) / here.length;
    lawT = norm(g.map(function (n) {
      return openOf(n, E.S.charge, E.S.replace, ig2 / 10).open;
    }));
  }
  var dR = relT - now, dL = lawT - now;
  return {
    seat: seat, now: now, runs: RUNS,
    release: { to: relT, d: dR, n: Object.keys(touched).length },
    law: { nm: lawNm, at: lawAt, to: lawT, d: dL, count: here.length },
    bigger: dL > dR ? 'law' : (dR > dL ? 'release' : 'level')
  };
}

/* THE BASELINE. Seven transmissions and a date, and nothing derived from
   them is stored. With no baseline the height still draws and the from mark
   is absent, which the surface says rather than drawing a rise from nothing. */
function riseBase(E) {
  var t = {}; riseSeats(E).forEach(function (b) { t[b] = seatTrans(E, b); });
  return { t: t, at: new Date().toISOString() };
}
function riseDelta(E, r, base) {
  var now = riseRead(E, r);
  if (!base || !base.t) return { now: now, from: null, d: null, has: false };
  var was = riseFrom(E, base.t, null);
  return { now: now, from: was, d: now.pct - was.pct, has: true, at: base.at || null };
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = { OPEN_CAP: OPEN_CAP, riseSeats: riseSeats, seatTrans: seatTrans,
    riseRead: riseRead, riseFrom: riseFrom, riseReach: riseReach,
    riseLevers: riseLevers, riseBase: riseBase, riseDelta: riseDelta };

/* In a browser there is no module system, so the same object is hung on the
   window under one name. The page reads window.RISE and nothing else. */
if (typeof window !== 'undefined')
  window.RISE = { OPEN_CAP: OPEN_CAP, riseSeats: riseSeats, seatTrans: seatTrans,
    riseRead: riseRead, riseFrom: riseFrom, riseReach: riseReach,
    riseLevers: riseLevers, riseBase: riseBase, riseDelta: riseDelta };
