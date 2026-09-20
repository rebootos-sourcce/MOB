/* ============================================================
   ATUNED LOGOTYPE. THE GEOMETRY.

   Six letters drawn as paths in the specimen's style: geometric
   monoline, circular counters, single storey, very high x height.
   Not set in a face. This project has no licence to the specimen
   and a logotype should be outlines regardless: it has to hold at
   sixteen pixels, survive seven lightings, and never wait for a
   font to arrive.

   ONE UNIT SYSTEM AND EVERYTHING DERIVES FROM IT. Change W and
   every letter stays monoline, because the monoline is enforced by
   construction rather than by eye. That is the whole reason the
   source keeps strokes instead of flattened outlines.

   Coordinates: ascender top y=0, baseline y=130, x height line
   y=30. So the x height is 100 and the ascender is 130, a ratio of
   0.769, which is the high x height the specimen has.
   ============================================================ */

const W    = 19;        // stroke weight. 19 percent of the x height.
const H    = W / 2;     // 9.5. every centreline is inset by this.
const XH   = 100;       // x height
const ASC  = 0;         // ascender top
const BASE = 130;       // baseline
const XL   = BASE - XH; // 30. the x height line.
const OS   = 1.5;       // round overshoot, top and bottom

/* A ROUND LETTER IS WIDER THAN A STRAIGHT ONE BY TWICE THE
   OVERSHOOT. The a, e and d bowls are circles of outer diameter
   103 so they read the same size as the 100 wide u and n. */
const RW  = XH + 2 * OS;      // 103, round outer diameter
const RCX = RW / 2;           // 51.5, round centre x
const RCY = (XL + BASE) / 2;  // 80, round centre y
const RR  = RCX - H;          // 42, round centreline radius

/* the u bowl and the n arch are true semicircles of centreline
   radius 40.5, displaced 1.5 so they overshoot. */
const SR  = (XH - W) / 2;     // 40.5
const UCY = BASE - H - SR;    // 81.5  u bowl centre
const NCY = XL + H + SR;      // 78.5  n arch centre

const P = n => +n.toFixed(2);
const circ = (cx, cy, r) =>
  `M ${P(cx-r)} ${P(cy)} A ${P(r)} ${P(r)} 0 1 0 ${P(cx+r)} ${P(cy)}` +
  ` A ${P(r)} ${P(r)} 0 1 0 ${P(cx-r)} ${P(cy)}`;

/* a terminal on the ring of an e, given the angle below the
   horizontal at which the stroke is cut. Bigger angle, more open
   aperture, and the aperture is what decides whether the e fills
   at small sizes. */
function eRing(barY, termDeg) {
  const dy   = barY - RCY;
  const barX = RCX + Math.sqrt(RR*RR - dy*dy);         // where the bar crosses the ring's centreline
  /* AND IT RUNS PAST THAT TO THE RING'S OUTER EDGE. Cut at the
     centreline the bar's vertical cap stops 9.5 short of the ring's
     outer contour, and every pixel between them is a step at three
     o'clock. Seen only at eight times scale: at the top bar it
     reads as the e being slightly light on its right. */
  const barEnd = RCX + Math.sqrt((RCX)*(RCX) - dy*dy);
  const a0   = Math.atan2(dy, barX - RCX) * 180/Math.PI;
  const tx   = RCX + RR * Math.cos(termDeg*Math.PI/180);
  const ty   = RCY + RR * Math.sin(termDeg*Math.PI/180);
  const sweepDeg = a0 - (termDeg - 360);
  return { bar: `M ${P(RCX-RR)} ${P(barY)} L ${P(barEnd)} ${P(barY)}`,
           ring:`M ${P(barX)} ${P(barY)} A ${P(RR)} ${P(RR)} 0 ${sweepDeg>180?1:0} 0 ${P(tx)} ${P(ty)}`,
           upperCounter: (barY - H) - (RCY - (RR - H)),
           termDeg, sweepDeg:+sweepDeg.toFixed(1) };
}

/* ---------- the letters, each drawn at its own origin ---------- */

const L = {};

/* a. THE FACE'S THESIS IN ONE LETTER: a circle and a vertical.
   The counter is a true circle of diameter 65 because the stem is
   tangent to the bowl rather than cutting into it. */
L.a1 = { w: RW, paths: [ circ(RCX, RCY, RR), `M ${P(RCX+RR)} ${XL} L ${P(RCX+RR)} ${BASE}` ],
         note: 'circle and a vertical, foot cut flat on the baseline' };

/* a with a spur. The stem turns right through a quarter circle of
   radius 14 and runs 4.5 units flat. It puts ink at the baseline
   under the gap the t's crossbar opens. */
L.a2 = { w: 112, paths: [ circ(RCX, RCY, RR),
         `M ${P(RCX+RR)} ${XL} L ${P(RCX+RR)} ${P(BASE-H-14)} A 14 14 0 0 0 ${P(RCX+RR+14)} ${P(BASE-H)} L 112 ${P(BASE-H)}` ],
         note: 'the same a with a spur, which fills the hole under the t' };

/* a with the stem inboard, so the stem cuts a chord across the
   bowl and the counter stops being a circle. Drawn to be measured
   against, not to be used. */
L.a3 = { w: RW, paths: [ circ(RCX, RCY, RR), `M ${P(RCX+RR-9)} ${XL} L ${P(RCX+RR-9)} ${BASE}` ],
         note: 'stem moved 9 units inboard. the counter is no longer circular' };

/* t. The crossbar's top edge sits at 29, which is half the
   overshoot above the flat x height line, so it reads level with
   the tops of the a, u, n and e rather than level with the u alone.
   The stem stops 4 short of the d's ascender because a naked
   vertical reads taller than one attached to a bowl.
   THE RIGHT ARM IS CUT BACK TO 22.5. At the 32.5 a geometric t
   normally carries, the arm rather than the stem sets the gap to
   the u and leaves a 40 unit hole beneath itself. */
const TBARY = XL - OS/2 + H;   // 38.5
L.t1 = { w: 56, paths: [ `M 24 4 L 24 ${BASE}`, `M 0 ${P(TBARY)} L 56 ${P(TBARY)}` ],
         note: 'flat foot, bar at the optical x height, right arm cut back' };
L.t2 = { w: 56, paths: [ `M 24 4 L 24 ${P(BASE-H-14)} A 14 14 0 0 0 38 ${P(BASE-H)} L 42 ${P(BASE-H)}`,
                         `M 0 ${P(TBARY)} L 56 ${P(TBARY)}` ],
         note: 'the foot turns right, which fills the hole under its own bar' };
L.t3 = { w: 56, paths: [ `M 28 24 L 28 ${BASE}`, `M 0 ${P(TBARY)} L 56 ${P(TBARY)}` ],
         note: 'short stem, arms equal. the mark loses its tall left event' };

/* u. Both stems cut flat at the x height line, bowl a true
   semicircle dropped 1.5 so it overshoots the baseline. */
const uBowl = `M ${H} ${XL} L ${H} ${P(UCY)} A ${P(SR)} ${P(SR)} 0 0 0 ${P(XH-H)} ${P(UCY)}`;
L.u1 = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} ${XL}` ],
         note: 'both stems stop at the x height. nothing competes with the dots' };
L.u2 = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} 146` ],
         note: 'right stem carried below the baseline as a tail' };
L.u3 = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} 4` ],
         note: 'right stem carried to the ascender line' };

/* n. The left stem runs the full x height and the arch springs
   from it 48.5 units down, which leaves a flat cut at the x height
   line to sit on the same optical line as the t's bar and the u's
   two stem tops. */
L.n1 = { w: XH, paths: [ `M ${H} ${BASE} L ${H} ${XL}`,
         `M ${H} ${P(NCY)} A ${P(SR)} ${P(SR)} 0 0 1 ${P(XH-H)} ${P(NCY)} L ${P(XH-H)} ${BASE}` ],
         note: 'arch springs below the stem top, so the stem keeps a flat cut at the x height' };
L.n2 = { w: XH, paths: [ `M ${H} ${BASE} L ${H} ${P(NCY)} A ${P(SR)} ${P(SR)} 0 0 1 ${P(XH-H)} ${P(NCY)} L ${P(XH-H)} ${BASE}` ],
         note: 'arch springs at the stem top. one fewer corner, one fewer alignment' };

/* e. THE BAR SITS 3 UNITS BELOW THE RING'S CENTRE. It buys 13
   percent of the upper counter, which is the first thing in this
   whole mark to fill in, and 3 units at this x height is 3 percent,
   under the point where the eye reads the bar as low. */
const e1 = eRing(RCY + 3, 42), e2 = eRing(RCY + 3, 66), e3 = eRing(RCY, 20);
L.e1 = { w: RW, paths: [ e1.bar, e1.ring ], m: e1, note: 'terminal cut at 42 degrees. the geometric default' };
L.e2 = { w: RW, paths: [ e2.bar, e2.ring ], m: e2, note: 'terminal cut at 66 degrees. a wider aperture, which survives small sizes' };
L.e3 = { w: RW, paths: [ e3.bar, e3.ring ], m: e3, note: 'bar at centre, terminal at 20 degrees. closes to a slot' };

/* d. There is one geometrically true d in this style: a circle and
   a full ascender on the right. The only real decision is whether
   it or the t is the tallest thing in the mark. */
L.d1 = { w: RW, paths: [ circ(RCX, RCY, RR), `M ${P(RCX+RR)} 0 L ${P(RCX+RR)} ${BASE}` ],
         note: 'full ascender. the d is the tallest thing in the mark' };
L.d2 = { w: RW, paths: [ circ(RCX, RCY, RR), `M ${P(RCX+RR)} 4 L ${P(RCX+RR)} ${BASE}` ],
         note: 'ascender cut to the t\'s height. the mark loses its one rising note' };

/* ---------- THE DOTS ----------
   Measured off the shipping mark rather than chosen. The corrected
   pair on .brand sits at .2498 and .7497 of the u's own glyph,
   midpoint .4998, and the dot is .1878 of the letter's width. On a
   100 wide u that is: centres 50 apart, symmetric on the centre,
   diameter 18.8, which is one stroke weight.

   So the law is: the dots' centres are half the letter's width
   apart, symmetric on the letter's centre, and each dot is one
   stroke wide. Air above the letter is 8 units, which lands the
   dots' tops 3 under the ascender line: read as aligned with the t
   and the d without being taller than either. */
const DOT_R   = W / 2;                 // 9.5
const DOT_CY  = XL - 8 - DOT_R;        // 12.5
const DOT_DX  = [ XH * 0.25, XH * 0.75 ];

/* ---------- spacing ----------
   Sidebearings by what the letter presents to its neighbour. Two
   straights facing each other need more air than two rounds,
   because a round curves away and gains its own. T is the
   logotype's added tracking and is the only knob per candidate.
   The t's crossbar is an overhang: it is spaced by a minimum
   clearance rather than by the table, because its arm reaches past
   its own stem. */
function layout(order, T, barClear) {
  const ss = 18 + T, sr = 15 + T, rr = 12 + T;
  const gap = { ss, sr, rs: sr, rr };
  const out = []; let x = 0, prev = null;
  for (const k of order) {
    const g = L[k], s = g.side;
    if (prev) {
      const adv = gap[prev.side.r + s.l];
      /* two rules, and the wider one wins. The table spaces the
         letters by the edge each one presents for spacing, which
         for a t is its stem and not its crossbar. The clearance
         keeps any overhang, the t's bar or the a's spur, off the
         letter beside it. */
      const byTable = prev.x + prev.refR + adv - (s.refL || 0);
      const byInk   = prev.x + prev.inkR + barClear - (s.inkL || 0);
      x = Math.max(byTable, byInk);
      out[out.length-1].gapTable = +(byTable).toFixed(2);
      out[out.length-1].gapInk   = +(byInk).toFixed(2);
      out[out.length-1].setBy    = byInk > byTable ? 'overhang' : 'table';
      out[out.length-1].clear    = +(x + (s.inkL||0) - (prev.x + prev.inkR)).toFixed(2);
    }
    out.push({ k, x: +x.toFixed(2), g });
    prev = { x, side: s, refR: s.refR !== undefined ? s.refR : g.w,
             inkR: s.inkR !== undefined ? s.inkR : g.w };
  }
  const last = out[out.length-1];
  out.total = +(last.x + (last.g.side.inkR !== undefined ? last.g.side.inkR : last.g.w)).toFixed(2);
  return out;
}
/* WHICH SIDE EACH LETTER PRESENTS, AND WHERE ITS OVERHANG ENDS.
   s straight, r round. refL and refR are the edges the spacing
   table measures between, inkL and inkR the real extremes. They
   differ on exactly two letters: the t, whose crossbar reaches past
   its stem, and the spurred a. */
const SIDE = {
  a1:{l:'r',r:'s'},
  a2:{l:'r',r:'s',inkR:112},
  a3:{l:'r',r:'s'},
  t1:{l:'s',r:'s',refL:14.5,refR:33.5,inkL:0,inkR:56},
  t2:{l:'s',r:'s',refL:14.5,refR:33.5,inkL:0,inkR:56},
  t3:{l:'s',r:'s',refL:18.5,refR:37.5,inkL:0,inkR:56},
  u1:{l:'s',r:'s'}, u2:{l:'s',r:'s'}, u3:{l:'s',r:'s'},
  n1:{l:'s',r:'s'}, n2:{l:'s',r:'s'},
  e1:{l:'r',r:'r'}, e2:{l:'r',r:'r'}, e3:{l:'r',r:'r'},
  d1:{l:'r',r:'s'}, d2:{l:'r',r:'s'} };
Object.keys(L).forEach(k => { L[k].side = SIDE[k]; });

module.exports = { W, H, XH, XL, BASE, OS, RW, RCX, RCY, RR, SR, UCY, NCY,
                   L, layout, DOT_R, DOT_CY, DOT_DX, P, circ, eRing, TBARY };

/* ============================================================
   THE SPACING, SOLVED BY AREA RATHER THAN BY TABLE.

   The first cut spaced these letters with a sidebearing table and
   a minimum clearance, and at eight times scale the word read as
   two pieces, atu and ned. The table was not wrong, it was
   measuring the wrong thing: the minimum gap between two letters
   is not what the eye reads, the area of background between them
   is. A t's crossbar is 19 tall out of 103, so a tight bar
   clearance is still a wide joint, and two full height stems at
   the same clearance are a narrow one.

   So each letter was rasterised once at four times scale, the
   background between each pair integrated scanline by scanline,
   and every joint solved by bisection against one target area.
   The measured result, in square units, with the minimum gap that
   produced it beside it:

     candidate A, target 3400, floor 9
       a t   3392   gap 21.0      two verticals. needs the most air
       t u   3397   gap 10.3      a crossbar against a stem
       u n   3408   gap 28.8      two verticals and the widest joint
       n e   3409   gap 18.8      a vertical against a bowl
       e d   4031   gap  9.0      AT THE FLOOR AND STILL 19 PERCENT OVER

   Equal areas need gaps of 9 to 28.8, a spread of better than three
   to one. That is the whole finding: equal gaps are not equal
   spaces, and a table cannot know the difference.

   The e to d joint cannot be solved at all. Its excess white is
   inside the e's own aperture rather than between the letters, so
   closing the joint does not remove it and the two would have to
   overlap. Named rather than fixed. It is 19 percent over on
   candidate A and 83 percent over on candidate B, whose e is cut
   at 66 degrees and gives away that much more.
   ============================================================ */
const SOLVED = {
  A: { order:['a1','t1','u1','n1','e1','d1'], pos:[0,123.75,189.75,318.25,436.75,548.5],
       total:651.5, target:3400, floor:9,
       areas:[3392,3397,3408,3409,4031], gaps:[21,10.3,28.8,18.8,9] },
  B: { order:['a2','t2','u1','n1','e2','d1'], pos:[0,115.5,179.25,298.75,408.25,519],
       total:622, target:2500, floor:8,
       areas:[2496,3006,2508,2510,4574], gaps:[12.8,8,19.8,9.8,8] } };
module.exports.SOLVED = SOLVED;
