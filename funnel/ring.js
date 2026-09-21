/* ============================================================
   THE SEVEN BAND RING. ONE DRAWING, AND THIS IS IT.

   Provenance, stated plainly because the brief asked for it.

   His words: "the band in Source OS that I dropped in a long time ago, the
   first thing I dropped in. It has a ring with seven bands. That is the
   original CQ design." The commit named for it is 46952ef, and what is in
   that file is a band and not a ring: `.top-accent` and `.nav-accent`, a
   three pixel strip of
     linear-gradient(90deg,#B83030,#C07030,#A89020,#3A8870,#3870B8,#7858A8)
   pinned to the top of the reading column and repeated in the left rail. Two
   uses, one gradient, six stops. Six. The third eye is missing from it, and
   it is still missing in the current index.html, four commits later. So what
   the alpha actually carries is the order of the seats and the fact that they
   travel as one band. It does not carry a ring and it does not carry seven.

   The ring is the one this project already argued for and measured, in
   proto/logo/r2measure.js and round3.html, on his own ruling: "for the
   favicon, let's do like the old ring. Seven colours in a band." Every number
   below is lifted from that study rather than chosen here.

     seven equal arcs        360/7, because an alternating rhythm cannot close
                             on an odd count. One, two, one, two round a ring
                             of seven puts two arcs of the same weight at the
                             seam. That is arithmetic, not taste.
     touching                a three degree gap costs a seat a fifth of the
                             solid pixels it has at sixteen.
     band 18.75 per cent     three pixels on sixteen. Set by the small end,
       of the diameter       held at every size. The boot mark's ring is a
                             hairline, 1.29 per cent, which is a fifth of a
                             pixel at sixteen and has nothing to colour.
     root at the bottom      the band is the spine closed into a loop and the
       climbing the right    loop closes at the body's base. The project's own
                             ruling about the four part loop, applied to the
                             seven: it is a circle, never a list.
     colours off the live    the same seven the app draws. Nothing retyped.
       tokens

   WHAT IT DOES HERE, WHICH IS THE PART HE CARED ABOUT. "It is a truncated CQ.
   As you input information into it, it will show you what is going on and
   what is running it." So it is a reading and not a mark. Each band carries
   the load at its own seat, and the load is the band's WEIGHT rather than its
   length: the arc always spans its full seventh, so the object is whole and
   recognisable from the first frame, and it thickens toward the frame as the
   charge lands. Heaviest seat, fattest band. One glance answers what is
   running it.

   The scale is the reading's own scale, nought to ten, mean load per seat,
   read off the same field the reading prints underneath. The ring and the
   reading cannot disagree because they are the same number.

   THE SAME DRAWING IS THE FAVICON, at every band full. The app's mark is the
   ring closed and a person's reading is the ring uneven, which is one object
   in two states rather than two drawings of one object.
   ============================================================ */
var RING = (function () {

  /* the box. The band is 18.75 per cent of the diameter and the outer edge
     of a full band lands exactly on the diameter, so the frame hairline would
     be clipped by a viewBox of 0 0 200 200. Three units of air, and no other
     number moves. */
  var D = 200, BANDFRAC = 3 / 16;
  var BAND = D * BANDFRAC;            /* 37.5 */
  var RMID = (D - BAND) / 2;          /* 81.25 */
  var PAD = 3;
  var SWEEP = 360 / 7;                /* 51.428571… */
  var START = 90;                     /* six o'clock, y down */
  var HAIR = 2.2;                     /* a seat not yet read is still a seat */

  /* the seats, in the order the band runs. The names are the engine's BANDS
     and the token names are the palette's, so a rename in either breaks
     loudly rather than drawing the wrong hue. */
  var SEATS = [
    ['Root', '--root'], ['Sacral', '--sacral'], ['Solar', '--solar'],
    ['Heart', '--heart'], ['Throat', '--throat'], ['3rd Eye', '--eye'],
    ['Crown', '--crown']
  ];

  function pt(a, r) {
    var t = a * Math.PI / 180;
    return [(D / 2 + r * Math.cos(t)).toFixed(3), (D / 2 + r * Math.sin(t)).toFixed(3)];
  }

  /* one seventh, drawn at the mid radius. The angle decreases, which is up
     the right side once y points down, so the sweep flag is 0. */
  function arc(i) {
    var a0 = START - i * SWEEP, a1 = a0 - SWEEP;
    var p = pt(a0, RMID), q = pt(a1, RMID);
    return 'M' + p[0] + ' ' + p[1] + 'A' + RMID + ' ' + RMID + ' 0 0 0 ' + q[0] + ' ' + q[1];
  }

  /* load, nought to ten, to a stroke width. Ten is the full band. */
  function weight(v) {
    if (v == null || !(v > 0)) return HAIR;
    return HAIR + (Math.min(10, v) / 10) * (BAND - HAIR);
  }

  /* -------- the markup. --------
     opts.loads  seven numbers, nought to ten, or null for unread.
     opts.frame  draw the two hairlines that show the full band. Default on.
     opts.flat   hex colours instead of tokens, for the favicon, which is
                 rendered by the browser outside the document and gets no
                 custom properties. */
  /* THE FIRST CUT DREW THE LOAD AND NOTHING ELSE, AND IT WAS ILLEGIBLE.

     Measured, on the header at sixty pixels: a real load runs nought to about
     five on a scale whose top is ten, so a band rendered at load alone is
     between a half and two pixels of colour on a black ground, and the object
     stopped reading as a ring of seven at all. Worse, it stopped answering
     the question it is here to answer, because you cannot see which band is
     the fat one when none of them is fat.

     The scale is not the thing to move. The reading prints the same numbers
     as bars underneath and the two may not disagree, so the drawing gains the
     scale instead of losing it: every seat is drawn twice. The track is the
     full band at low alpha, which is that seat at a load of ten, and it is
     there from the first frame, so the mark is whole before anything is
     answered and it is the same mark the tab carries. The load is drawn on
     top of it, centred on the band's own spine, growing out toward the track
     as the charge lands. Faint band is the scale. Solid band is the reading.
     The gap between them is what is not being carried. */
  function svg(opts) {
    opts = opts || {};
    var loads = opts.loads || [], flat = opts.flat || null, i, b = '';
    var lo = -PAD, sz = D + PAD * 2, d;
    b += '<svg class="ring" viewBox="' + lo + ' ' + lo + ' ' + sz + ' ' + sz + '"'
      + ' xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">';
    for (i = 0; i < 7; i++) {
      var col = flat ? flat[i] : 'var(' + SEATS[i][1] + ')';
      d = arc(i);
      if (opts.track !== false) {
        b += '<path class="ring-t" d="' + d + '"'
          + ' style="stroke:' + col + ';stroke-width:' + BAND + '"/>';
      }
      b += '<path class="ring-b" data-seat="' + i + '" d="' + d + '"'
        + ' style="stroke:' + col + ';stroke-width:' + weight(loads[i]).toFixed(2) + '"/>';
    }
    /* one hairline on the outer edge, so the band has an edge to fill toward.
       It is drawn at device width rather than box width: at sixty pixels a
       one unit stroke in a two hundred unit box is three tenths of a pixel
       and there is nothing to see. */
    if (opts.frame !== false) {
      b += '<circle class="ring-fr" cx="100" cy="100" r="' + (RMID + BAND / 2) + '"'
        + ' vector-effect="non-scaling-stroke"/>';
    }
    return b + '</svg>';
  }

  /* -------- the update. The transition is in the stylesheet, so a band
     thickens rather than jumping, and the whole ring moves on one answer
     because one answer moves more than one seat. -------- */
  function set(root, loads) {
    if (!root) return;
    var n = root.querySelectorAll ? root.querySelectorAll('.ring-b') : [];
    for (var i = 0; i < n.length; i++) {
      n[i].style.strokeWidth = weight(loads && loads[i]).toFixed(2);
    }
  }

  /* -------- the heaviest seat, which is the sentence beside the drawing.
     Null until something is actually carrying, because nought is not a
     winner. -------- */
  function heaviest(loads) {
    if (!loads) return null;
    var bi = -1, bv = 0;
    for (var i = 0; i < 7; i++) { if (loads[i] > bv) { bv = loads[i]; bi = i; } }
    return bi < 0 ? null : { i: bi, nm: SEATS[bi][0], v: bv };
  }

  return {
    D: D, BAND: BAND, RMID: RMID, SWEEP: SWEEP, START: START,
    BANDFRAC: BANDFRAC, HAIR: HAIR, SEATS: SEATS,
    arc: arc, weight: weight, svg: svg, set: set, heaviest: heaviest
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = RING;
