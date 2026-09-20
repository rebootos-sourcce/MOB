/* ROUND 2 GEOMETRY. Extends proto/logo/geometry.js.
   Nothing outside proto/logo/ is read or written.

   Everything here is in the same unit system geometry.js set:
   ascender top y=0, baseline y=130, x height line y=30, stroke 19.
   One em is the 130 unit ascender box, and every gap quoted in em
   on the sheets is gap_units / 130.                              */
const path = require('path');
const G = require(path.join(__dirname, 'geometry.js'));
const { W, H, XH, XL, BASE, OS, RW, RCX, RCY, RR, SR, UCY, NCY,
        L, DOT_R, DOT_CY, DOT_DX, P, circ, eRing, TBARY } = G;

/* ---------- the live seat tokens, read out of the source tree ----------
   NOT out of CLAUDE.md, which carries an older set. The values below are
   engine/data/canon.js PAL, and the same seven are hard coded a second
   time on .b-s1 to .b-s7 in shell/head.html, which is how the boot ring
   draws them today. */
const SEATS = [
  { n:'Root',    c:'#D6524C' },
  { n:'Sacral',  c:'#D8924E' },
  { n:'Solar',   c:'#DABF6A' },
  { n:'Heart',   c:'#5FD5A6' },
  { n:'Throat',  c:'#5EBBDB' },
  { n:'3rd Eye', c:'#7D93E0' },
  { n:'Crown',   c:'#A77EDB' } ];
/* what CLAUDE.md says, kept only so the sheet can show the drift */
const SEATS_DOC = ['#C4635E','#D19255','#D4BC70','#6FC5A3','#65B8D4','#8296DB','#A98BCE'];

/* ---------- the seven lightings ----------
   Carried over from build.js, where every value was read off a real
   Chromium run of source.html rather than out of the stylesheet, so the
   two color-mix grounds and the two alpha grounds are the composites a
   person actually sees. */
const LIGHT = [
 { k:'dark',       n:'Dark',        sky:'#7EB8D4', bar:'#1A1D26', page:'#0C0D12', paper:false },
 { k:'punch',      n:'Punch',       sky:'#7EB8D4', bar:'#1D1B23', page:'#16141B', paper:false },
 { k:'glass',      n:'Glass',       sky:'#7EB8D4', bar:'#101219', page:'#0B0D14', paper:false },
 { k:'flat',       n:'Flat',        sky:'#5FD4C4', bar:'#121419', page:'#0A0B0E', paper:false },
 { k:'snow',       n:'Snow',        sky:'#2F6E92', bar:'#F8F7F3', page:'#EDEBE6', paper:true },
 { k:'glasswhite', n:'Glass white', sky:'#2F6E92', bar:'#FCFCFB', page:'#E8E7E2', paper:true },
 { k:'lumen',      n:'Lumen',       sky:'#0091EA', bar:'#FFFFFF', page:'#FFFFFF', paper:true } ];

/* ---------- colour maths ---------- */
const hex = h => { h = h.replace('#',''); if (h.length===3) h = h.split('').map(c=>c+c).join('');
  return [0,2,4].map(i=>parseInt(h.substr(i,2),16)); };
const lum = c => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
  const [r,g,b] = c.map(f); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const la=lum(hex(a)), lb=lum(hex(b));
  return +(((Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05)).toFixed(2)); };

/* ---------- THE NEW LETTERS ----------
   Each round 2 is a named change to one round 1 letter, and nothing
   else in the word moves unless the change moves it. */
const LX = {};

/* A1 round 2. Both ends of the stem carried to the bowl's own ink.
   The bowl overshoots to 131.5 at the foot and its ink tops out at
   28.5; the stem is cut at 130 and 30. Two disagreements of 1.5. */
LX.a1f = { w: RW, paths: [ circ(RCX, RCY, RR),
           `M ${P(RCX+RR)} 28.5 L ${P(RCX+RR)} 131.5` ],
           side:{l:'r',r:'s'} };

/* A2 round 2. The spur's flat run goes 4.5 to 16 and the radius 14 to
   11, so it reads as a foot rather than as a bent stem. */
LX.a2b = { w: 120.5, paths: [ circ(RCX, RCY, RR),
           `M ${P(RCX+RR)} ${XL} L ${P(RCX+RR)} ${P(BASE-H-11)} A 11 11 0 0 0 ${P(RCX+RR+11)} ${P(BASE-H)} L 120.5 ${P(BASE-H)}` ],
           side:{l:'r',r:'s',inkR:120.5} };

/* T2 round 2. Radius 14 to 20, run carried to 52, which is still
   inside the crossbar's own 56 so the letter costs no width. */
LX.t2b = { w: 56, paths: [ `M 24 4 L 24 ${P(BASE-H-20)} A 20 20 0 0 0 44 ${P(BASE-H)} L 52 ${P(BASE-H)}`,
                           `M 0 ${P(TBARY)} L 56 ${P(TBARY)}` ],
           side:{l:'s',r:'s',refL:14.5,refR:33.5,inkL:0,inkR:56} };

/* U2 round 2. The tail committed: 16 below the baseline is 0.84 of a
   stroke, 28 is 1.47 of one. */
const uBowl = `M ${H} ${XL} L ${H} ${P(UCY)} A ${P(SR)} ${P(SR)} 0 0 0 ${P(XH-H)} ${P(UCY)}`;
LX.u2b = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} 158` ], side:{l:'s',r:'s'} };
/* AND U2 IS NOT A TAIL. Drawn in the first study as one path, the u's
   right side leaves the bowl and runs straight down, so the letter has
   no right stem above the bowl at all: it is not a u with a tail, it is
   a u missing a stem. Found by drawing the difference rather than by
   reading the path. The tail drawn as a tail is a full right stem from
   the x height line to below the baseline, with the bowl as its own
   stroke. */
const uBowlOnly = `M ${H} ${XL} L ${H} ${P(UCY)} A ${P(SR)} ${P(SR)} 0 0 0 ${P(XH-H)} ${P(UCY)}`;
LX.u2t  = { w: XH, paths: [ uBowlOnly, `M ${P(XH-H)} ${XL} L ${P(XH-H)} 146` ], side:{l:'s',r:'s'} };
LX.u2tb = { w: XH, paths: [ uBowlOnly, `M ${P(XH-H)} ${XL} L ${P(XH-H)} 158` ], side:{l:'s',r:'s'} };

/* U3 round 2, two ways out of the collision. */
LX.u3lo = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} 26` ], side:{l:'s',r:'s'} };
LX.u3hi = { w: XH, paths: [ `${uBowl} L ${P(XH-H)} -23` ], side:{l:'s',r:'s'} };

/* N. ONE VARIABLE, WHICH IS THE STEM'S RISE ABOVE THE SPRING.
   The arch is a semicircle and its spring point is fixed at 78.5 by
   the radius. n1 carries the left stem 48.5 above that spring, n2
   stops it there. Everything between is drawable. */
function nRise(s) {
  const top = NCY - s;
  return { w: XH, paths: [ `M ${H} ${BASE} L ${H} ${P(top)}`,
    `M ${H} ${P(NCY)} A ${P(SR)} ${P(SR)} 0 0 1 ${P(XH-H)} ${P(NCY)} L ${P(XH-H)} ${BASE}` ],
    side:{l:'s',r:'s'} };
}
[0, 12.5, 24.5, 36.5, 48.5].forEach(s => { LX['n_'+String(s).replace('.','p')] = nRise(s); });

/* E3 round 2. The two variables in e3 pulled apart: the bar stays on
   the ring's centre, which is what makes it read as a horizon, and
   the terminal opens from 20 degrees to 42. */
const e3b = eRing(RCY, 42);
LX.e3b = { w: RW, paths: [ e3b.bar, e3b.ring ], m: e3b, side:{l:'r',r:'r'} };

/* ---------- UPPERCASE ----------
   Drawn in the same monoline, same stroke, same overshoot. Cap top at
   y=4, which is the t's stem top, so the cap height is 126 against the
   lowercase x height of 100 and ascender of 130. */
const CAPTOP = 4, CAPH = BASE - CAPTOP;
const U = {};
/* A. Two diagonals mitred to a point, crossbar low at 0.26 of the cap. */
const ABARY = BASE - 0.26 * CAPH;   // 97.2
U.A = { w: 122, paths: [
  `M 12 ${BASE} L 61 ${P(CAPTOP+5)} L 110 ${BASE}`,
  `M 27.8 ${P(ABARY)} L 94.2 ${P(ABARY)}` ], join:'miter', side:{l:'d',r:'d'} };
/* T. Stem centred, bar the full width at the cap line. */
U.T = { w: 108, paths: [ `M 54 ${P(CAPTOP+H)} L 54 ${BASE}`,
  `M 0 ${P(CAPTOP+H)} L 108 ${P(CAPTOP+H)}` ], side:{l:'s',r:'s',refL:44.5,refR:63.5,inkL:0,inkR:108} };
/* U. Two stems and a semicircle that overshoots the baseline by 1.5. */
const CSR = (106 - W) / 2, CUCY = BASE + OS - H - CSR;
U.U = { w: 106, paths: [
  `M ${H} ${P(CAPTOP+H)} L ${H} ${P(CUCY)} A ${P(CSR)} ${P(CSR)} 0 0 0 ${P(106-H)} ${P(CUCY)} L ${P(106-H)} ${P(CAPTOP+H)}` ],
  side:{l:'s',r:'s'} };
/* N. Two stems and a diagonal corner to corner. */
U.N = { w: 112, paths: [ `M ${H} ${BASE} L ${H} ${P(CAPTOP+H)}`,
  `M ${H} ${P(CAPTOP+H)} L ${P(112-H)} ${BASE}`, `M ${P(112-H)} ${BASE} L ${P(112-H)} ${P(CAPTOP+H)}` ],
  join:'miter', side:{l:'s',r:'s'} };
/* E. Stem and three arms. The middle arm is cut 6 short, which is the
   one optical correction in the set and it is named rather than hidden. */
U.E = { w: 96, paths: [ `M ${H} ${P(CAPTOP+H)} L ${H} ${P(BASE-H)}`,
  `M 0 ${P(CAPTOP+H)} L 96 ${P(CAPTOP+H)}`,
  `M 0 ${P((CAPTOP+BASE)/2)} L 90 ${P((CAPTOP+BASE)/2)}`,
  `M 0 ${P(BASE-H)} L 96 ${P(BASE-H)}` ], side:{l:'s',r:'s'} };
/* D. Stem and a half bowl, overshooting top and bottom by 1.5. */
U.D = { w: 109, paths: [ `M ${H} ${P(CAPTOP)} L ${H} ${BASE}`,
  `M ${H} ${P(CAPTOP+H-OS)} L 46 ${P(CAPTOP+H-OS)} A 54.5 54.5 0 0 1 46 ${P(BASE-H+OS)} L ${H} ${P(BASE-H+OS)}` ],
  side:{l:'s',r:'r'} };
/* the umlaut over a cap U. Same law as the lowercase one: centres half
   the letter's width apart, symmetric on its centre, each dot one
   stroke wide, eight units of air above the letter. */
const CAP_DOT_CY = CAPTOP - 8 - DOT_R;          // -13.5
const CAP_DOT_DX = [ 106 * 0.25, 106 * 0.75 ];  // 26.5, 79.5

/* ---------- spacing ----------
   T is the added tracking and is the only knob. byTable spaces the
   letters by the edge each presents for spacing; byInk keeps any
   overhang off its neighbour. The wider wins. */
function place(order, all, T, barClear) {
  const ss = 18 + T, sr = 15 + T, rr = 12 + T, ds = 13 + T, dd = 10 + T;
  const gap = k => ({ ss, sr, rs:sr, rr, ds, sd:ds, dd, dr:ds, rd:ds })[k] !== undefined
    ? ({ ss, sr, rs:sr, rr, ds, sd:ds, dd, dr:ds, rd:ds })[k] : ss;
  const out = []; let x = 0, prev = null;
  for (const k of order) {
    const g = all[k], s = g.side;
    if (prev) {
      const adv   = gap(prev.side.r + s.l);
      const byTab = prev.x + prev.refR + adv - (s.refL || 0);
      const byInk = prev.x + prev.inkR + barClear - (s.inkL || 0);
      x = Math.max(byTab, byInk);
    }
    out.push({ k, x:+x.toFixed(2), g });
    prev = { x, side:s, refR: s.refR !== undefined ? s.refR : g.w,
             inkR: s.inkR  !== undefined ? s.inkR  : g.w };
  }
  const last = out[out.length-1];
  out.total = +(last.x + (last.g.side.inkR !== undefined ? last.g.side.inkR : last.g.w)).toFixed(2);
  return out;
}

/* ---------- a spec, which is what everything downstream draws ----------
   strokes in unit space, dots in unit space, and the box they sit in. */
function spec(order, all, positions, dotsOn, dotDX, dotCY) {
  const strokes = [], names = [];
  order.forEach((k, i) => {
    const g = all[k];
    g.paths.forEach(d => strokes.push({ d, tx:positions[i], join:g.join || 'round' }));
    names.push({ k, x:positions[i], w:g.w });
  });
  const dots = [];
  if (dotsOn != null) {
    const ux = positions[dotsOn];
    (dotDX || DOT_DX).forEach(dx => dots.push({ cx:+(ux+dx).toFixed(2), cy: dotCY==null?DOT_CY:dotCY, r:DOT_R }));
  }
  const xs = [], ys = [];
  strokes.forEach(s => { /* bounds come off the raster, not off here */ });
  return { strokes, dots, names };
}

module.exports = { G, W, H, XH, XL, BASE, OS, RW, RCX, RCY, RR, SR, UCY, NCY, TBARY,
  L, LX, U, DOT_R, DOT_CY, DOT_DX, CAP_DOT_CY, CAP_DOT_DX, CAPTOP, CAPH,
  SEATS, SEATS_DOC, LIGHT, hex, lum, ratio, place, spec, nRise, P, circ, eRing };
