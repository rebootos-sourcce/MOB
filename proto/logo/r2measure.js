/* MEASURES EVERY NUMBER THE ROUND 2 AND ROUND 3 SHEETS PRINT.
   Rasterises the same path data in Chromium with Path2D, so a number on
   a sheet is read off a run and never typed in. Writes measured.json.
   node /home/user/MOB/proto/logo/r2measure.js                        */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const R = require(path.join(__dirname, 'r2geom.js'));
const { L, LX, U, W, BASE, DOT_R, DOT_CY, DOT_DX, CAP_DOT_CY, CAP_DOT_DX,
        SEATS, place } = R;

/* every letter this study can draw, under one roof */
const ALL = Object.assign({}, L, LX, U);

/* the sizes the mark is actually used at, pinned to the ascender box */
const SIZES = [ { k:'funnel', n:'Funnel heading', asc:32 },
                { k:'boot',   n:'Boot card',      asc:26 },
                { k:'bar',    n:'Top bar',        asc:13 } ];

/* ---------- jobs, built in node, measured in the page ---------- */
const lo = k => ({ paths: ALL[k].paths, join: ALL[k].join || 'round' });

/* a word: order plus x positions, dots over the letter at index dotAt */
function word(order, pos, dotAt, dotDX, dotCY) {
  const strokes = [];
  order.forEach((k, i) => ALL[k].paths.forEach(d =>
    strokes.push({ d, tx: pos[i], join: ALL[k].join || 'round' })));
  const dots = [];
  if (dotAt != null) (dotDX || DOT_DX).forEach(dx =>
    dots.push({ cx: +(pos[dotAt] + dx).toFixed(3), cy: dotCY == null ? DOT_CY : dotCY, r: DOT_R }));
  return { strokes, dots, order, pos };
}

const jobs = { W, sizes: SIZES, letters: {}, pairs: [], words: [], diffs: [],
               overlaps: [], rings: [], holes: [] };
Object.keys(ALL).forEach(k => { jobs.letters[k] = {
  paths: ALL[k].paths, join: ALL[k].join || 'round',
  w: ALL[k].w, inkR: ALL[k].side.inkR, inkL: ALL[k].side.inkL } });

/* ---- the words this study draws. Each is solved joint by joint against
        candidate A's own area target of 3400 with a floor of 9, which is
        the method section 4 of the first sheet used. ---- */
const WORDS = [
 { id:'A',        order:['a1','t1','u1','n1','e1','d1'] },       /* the landed mark */
 { id:'a1f',      order:['a1f','t1','u1','n1','e1','d1'] },
 { id:'a2',       order:['a2','t1','u1','n1','e1','d1'] },
 { id:'a2b',      order:['a2b','t1','u1','n1','e1','d1'] },
 { id:'t2',       order:['a1','t2','u1','n1','e1','d1'] },
 { id:'t2b',      order:['a1','t2b','u1','n1','e1','d1'] },
 { id:'a2t2',     order:['a2','t2','u1','n1','e1','d1'] },
 { id:'a2t1',     order:['a2','t1','u1','n1','e1','d1'] },
 { id:'u2',       order:['a1','t1','u2','n1','e1','d1'] },
 { id:'u2b',      order:['a1','t1','u2b','n1','e1','d1'] },
 { id:'u2t',      order:['a1','t1','u2t','n1','e1','d1'] },
 { id:'u2tb',     order:['a1','t1','u2tb','n1','e1','d1'] },
 { id:'u3',       order:['a1','t1','u3','n1','e1','d1'] },
 { id:'u3lo',     order:['a1','t1','u3lo','n1','e1','d1'] },
 { id:'u3hi',     order:['a1','t1','u3hi','n1','e1','d1'] },
 { id:'n_0',      order:['a1','t1','u1','n_0','e1','d1'] },
 { id:'n_12p5',   order:['a1','t1','u1','n_12p5','e1','d1'] },
 { id:'n_24p5',   order:['a1','t1','u1','n_24p5','e1','d1'] },
 { id:'n_36p5',   order:['a1','t1','u1','n_36p5','e1','d1'] },
 { id:'n_48p5',   order:['a1','t1','u1','n_48p5','e1','d1'] },
 { id:'e2',       order:['a1','t1','u1','n1','e2','d1'] },
 { id:'e3',       order:['a1','t1','u1','n1','e3','d1'] },
 { id:'e3b',      order:['a1','t1','u1','n1','e3b','d1'] },
 { id:'caps',     order:['A','T','U','N','E','D'], caps:true } ];

module.exports = { ALL, SIZES, WORDS, word };

/* ================= the page side ================= */
/* ONE RASTER PER LETTER, AND EVERY JOINT SOLVED ON ITS ROW PROFILE.
   The first cut of this file rasterised both letters inside the
   bisection loop, which is 5700 rasters of 2.75 million pixels and did
   not finish. A letter's row profile does not depend on where the
   letter beside it sits, so it is measured once and the joint is then
   arithmetic on two arrays. Same numbers, and it runs in seconds.   */
const inPage = (JOB) => {
  const W = JOB.W, S = 8, Y0 = -34, Y1 = 172;
  const NR = Math.round((Y1 - Y0) * S);
  const mk = () => document.createElement('canvas');
  function raster(strokes, dots, box, s) {
    const w = Math.max(1, Math.ceil((box.x1 - box.x0) * s)),
          h = Math.max(1, Math.ceil((box.y1 - box.y0) * s));
    const c = mk(); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently:true });
    x.setTransform(s, 0, 0, s, -box.x0 * s, -box.y0 * s);
    x.strokeStyle = '#fff'; x.fillStyle = '#fff';
    x.lineWidth = W; x.lineCap = 'butt'; x.miterLimit = 12;
    (strokes || []).forEach(st => { x.save(); x.translate(st.tx || 0, 0);
      x.lineJoin = st.join === 'miter' ? 'miter' : 'round';
      x.stroke(new Path2D(st.d)); x.restore(); });
    (dots || []).forEach(d => { x.beginPath();
      x.arc(d.cx, d.cy, d.r, 0, Math.PI * 2); x.fill(); });
    const px = x.getImageData(0, 0, w, h).data;
    const a = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) a[i] = px[i*4+3] > 127 ? 1 : 0;
    return { w, h, s, box, a };
  }
  function ink(m) { let n = 0; for (let i = 0; i < m.a.length; i++) n += m.a[i]; return n; }
  function diff(mA, mB) {
    const n = Math.min(mA.a.length, mB.a.length); let c = 0,
      x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < n; i++) if (mA.a[i] !== mB.a[i]) { c++;
      const x = i % mA.w, y = (i / mA.w) | 0;
      if (x<x0)x0=x; if (x>x1)x1=x; if (y<y0)y0=y; if (y>y1)y1=y; }
    return { count:c, bw: x1<0?0:x1-x0+1, bh: y1<0?0:y1-y0+1 };
  }
  function both(mA, mB) { let c = 0; const n = Math.min(mA.a.length, mB.a.length);
    for (let i = 0; i < n; i++) if (mA.a[i] && mB.a[i]) c++; return c; }
  function bbox(m) { let x0=1e9,y0=1e9,x1=-1,y1=-1;
    for (let i=0;i<m.a.length;i++) if (m.a[i]) { const x=i%m.w, y=(i/m.w)|0;
      if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    return { x0: m.box.x0 + x0/m.s, x1: m.box.x0 + (x1+1)/m.s,
             y0: m.box.y0 + y0/m.s, y1: m.box.y0 + (y1+1)/m.s }; }

  /* the row profile of one letter, in units, its own origin at x=0 */
  const PROF = {};
  function prof(k) {
    if (PROF[k]) return PROF[k];
    const g = JOB.letters[k];
    const l = g.inkL !== undefined ? g.inkL : 0,
          r = g.inkR !== undefined ? g.inkR : g.w;
    const box = { x0: l - 26, x1: r + 26, y0: Y0, y1: Y1 };
    const m = raster(g.paths.map(d => ({ d, tx:0, join:g.join })), null, box, S);
    const lo = new Float32Array(NR), hi = new Float32Array(NR);
    for (let y = 0; y < NR; y++) {
      let a = -1, b = -1;
      for (let x = 0; x < m.w; x++) if (m.a[y*m.w+x]) { if (a < 0) a = x; b = x; }
      if (a < 0) { lo[y] = NaN; hi[y] = NaN; }
      else { lo[y] = box.x0 + a / S; hi[y] = box.x0 + (b + 1) / S; } }
    return (PROF[k] = { lo, hi, g, inkL:l, inkR:r });
  }
  /* the background between two letters, left at 0 and right at dx */
  function between(kL, kR, dx, yLo, yHi) {
    const A = prof(kL), B = prof(kR);
    let minG = Infinity, area = 0, rows = 0;
    const r0 = yLo == null ? 0  : Math.max(0,  Math.round((yLo - Y0) * S));
    const r1 = yHi == null ? NR : Math.min(NR, Math.round((yHi - Y0) * S));
    for (let y = r0; y < r1; y++) {
      if (isNaN(A.hi[y]) || isNaN(B.lo[y])) continue;
      const g = (B.lo[y] + dx) - A.hi[y];
      if (g < minG) minG = g; area += g; rows++; }
    return { minGap: minG === Infinity ? null : minG, area: area / S, rows };
  }
  function solveJoint(kL, kR, target, floor) {
    const A = prof(kL), B = prof(kR);
    const lo0 = A.inkR - B.inkL;
    let a = lo0 - 30, b = lo0 + 150;
    for (let i = 0; i < 40; i++) { const m = (a+b)/2;
      if (between(kL,kR,m).area < target) a = m; else b = m; }
    let dx = (a+b)/2, m = between(kL,kR,dx), byFloor = false;
    if (m.minGap !== null && m.minGap < floor) {
      let c = lo0 - 30, d = lo0 + 150;
      for (let i = 0; i < 40; i++) { const mid = (c+d)/2;
        const mm = between(kL,kR,mid);
        if (mm.minGap < floor) c = mid; else d = mid; }
      dx = (c+d)/2; m = between(kL,kR,dx); byFloor = true; }
    return { dx:+dx.toFixed(2), area:+m.area.toFixed(0),
             minGap:+m.minGap.toFixed(2), byFloor };
  }
  function solveWord(order, target, floor) {
    const pos = [0], joints = [];
    for (let i = 1; i < order.length; i++) {
      const j = solveJoint(order[i-1], order[i], target, floor);
      joints.push({ pair: order[i-1]+' '+order[i], area:j.area, gap:j.minGap, byFloor:j.byFloor });
      pos.push(+(pos[i-1] + j.dx).toFixed(2)); }
    const last = JOB.letters[order[order.length-1]];
    return { pos, joints, total: +(pos[pos.length-1] +
      (last.inkR !== undefined ? last.inkR : last.w)).toFixed(2) };
  }

  const OUT = { words:{}, deltas:{}, overlaps:{}, rings:{}, holes:{}, tracking:{}, caps:{}, ed:{} };

  JOB.words.forEach(w => { OUT.words[w.id] = solveWord(w.order, 3400, 9); });

  JOB.deltas.forEach(d => {
    const a = JOB.letters[d.a], b = JOB.letters[d.b];
    const box = { x0:-22, x1: Math.max(a.w, b.w) + 34, y0:-34, y1:172 };
    const per = {};
    JOB.sizes.concat([{ k:'x8', asc:130*8 }]).forEach(sz => {
      const s = sz.asc / 130;
      const ma = raster(a.paths.map(p => ({ d:p, tx:0, join:a.join })), d.dotsA||d.dots||null, box, s);
      const mb = raster(b.paths.map(p => ({ d:p, tx:0, join:b.join })), d.dotsB||d.dots||null, box, s);
      const df = diff(ma, mb);
      per[sz.k] = { changed:df.count, bw:df.bw, bh:df.bh, inkA:ink(ma), inkB:ink(mb) }; });
    OUT.deltas[d.id] = per; });

  JOB.overlaps.forEach(o => {
    const g = JOB.letters[o.letter];
    const box = { x0:-22, x1:g.w+34, y0:-34, y1:172 };
    const per = {};
    JOB.sizes.concat([{ k:'unit', asc:130*S }]).forEach(sz => {
      const s = sz.asc / 130;
      const mL = raster(g.paths.map(p => ({ d:p, tx:0, join:g.join })), null, box, s);
      const mD = raster(null, o.dots, box, s);
      per[sz.k] = { touchPx: both(mL, mD), letterInk: ink(mL), dotInk: ink(mD) }; });
    /* and the gap or overlap between the dot and the nearest stroke, in units */
    const bx = { x0:-22, x1:g.w+34, y0:-34, y1:172 };
    const mL = raster(g.paths.map(p => ({ d:p, tx:0, join:g.join })), null, bx, S);
    const mD = raster(null, o.dots, bx, S);
    let sep = Infinity;
    for (let y = 0; y < mL.h; y++) {
      let dl=-1,dh=-1,sl=-1,sh=-1;
      for (let x=0;x<mL.w;x++){ if(mD.a[y*mL.w+x]){ if(dl<0)dl=x; dh=x; }
        if(mL.a[y*mL.w+x]){ if(sl<0)sl=x; sh=x; } }
      if (dh<0||sh<0) continue;
      /* nearest horizontal separation on this row, negative when they share ink */
      const gapR = sl - dh, gapL = dl - sh;
      const v = Math.max(gapR, gapL) === Math.max(gapR,gapL) ? Math.min(Math.abs(gapR),Math.abs(gapL)) : 0;
      let ov = 0; for (let x=0;x<mL.w;x++) if (mD.a[y*mL.w+x] && mL.a[y*mL.w+x]) ov++;
      const rowSep = ov > 0 ? -ov : v;
      if (rowSep < sep) sep = rowSep; }
    per.sepUnits = sep === Infinity ? null : +(sep / S).toFixed(2);
    OUT.overlaps[o.id] = per; });

  JOB.holes.forEach(hj => {
    const A = prof(hj.a), B = prof(hj.b);
    /* the a and the t sit at the joint the solver gives them */
    const j = solveJoint(hj.a, hj.b, 3400, 9);
    const b = between(hj.a, hj.b, j.dx, hj.y0, hj.y1);
    const whole = between(hj.a, hj.b, j.dx);
    OUT.holes[hj.id] = { dx:j.dx, area:+b.area.toFixed(0),
      minGap: b.minGap === null ? null : +b.minGap.toFixed(2), rows:b.rows,
      wholeArea:+whole.area.toFixed(0), wholeGap:+whole.minGap.toFixed(2) }; });

  function ringMask(D, band, a0, a1, gapDeg) {
    const c = mk(); c.width = D; c.height = D;
    const x = c.getContext('2d', { willReadFrequently:true });
    const Rm = (D - band) / 2, g = (gapDeg || 0) * Math.PI / 180 / 2;
    x.strokeStyle = '#fff'; x.lineWidth = band; x.lineCap = 'butt';
    /* ROOT AT THE BOTTOM AND THE BAND CLIMBS THE RIGHT SIDE. Canvas
       flips y, so a sweep of increasing angle from six o'clock runs up
       the left. The band is the spine closed into a loop and it should
       ascend the way a progress ring does, so it is drawn the other
       way round. */
    x.beginPath(); x.arc(D/2, D/2, Rm, a0 - g, a1 + g, true); x.stroke();
    const px = x.getImageData(0, 0, D, D).data;
    let n = 0, solid = 0;
    for (let i = 0; i < D*D; i++) { if (px[i*4+3] > 20) n++; if (px[i*4+3] > 200) solid++; }
    return { any:n, solid:solid };
  }
  JOB.rings.forEach(r => {
    const out = {};
    r.sizes.forEach(D => {
      const band = Math.max(1, +(D * r.bandFrac).toFixed(2));
      const tot = r.units.reduce((a,b)=>a+b,0);
      let ang = r.start * Math.PI / 180; const arcs = [];
      r.units.forEach(u => { const sweep = u/tot*Math.PI*2;
        arcs.push(ringMask(D, band, ang, ang-sweep, r.gapDeg)); ang -= sweep; });
      const mid = (D - band) / 2;
      out[D] = { band, arcs:arcs.map(a=>a.any), solid:arcs.map(a=>a.solid),
        minAny:Math.min.apply(null,arcs.map(a=>a.any)),
        minSolid:Math.min.apply(null,arcs.map(a=>a.solid)),
        arcDeg:r.units.map(u=>+(u/tot*360).toFixed(2)),
        arcLen:r.units.map(u=>+(u/tot*2*Math.PI*mid).toFixed(2)) }; });
    OUT.rings[r.id] = out; });

  JOB.tracking.forEach(t => {
    const order = JOB.words.find(w => w.id === 'A').order, base = OUT.words.A.pos;
    const pos = base.map((p,i) => +(p + i*t).toFixed(2));
    const joints = [];
    for (let i = 1; i < order.length; i++) {
      const b = between(order[i-1], order[i], pos[i] - pos[i-1]);
      joints.push({ pair: order[i-1]+' '+order[i],
        gap: b.minGap === null ? null : +b.minGap.toFixed(2), area:+b.area.toFixed(0) }); }
    const last = JOB.letters[order[order.length-1]];
    OUT.tracking[String(t)] = { pos, joints,
      total:+(pos[pos.length-1] + (last.inkR !== undefined ? last.inkR : last.w)).toFixed(2) }; });

  [9,6,3,0,-4,-8].forEach(target => {
    ['e1','e2','e3','e3b'].forEach(ek => {
      const A = prof(ek), B = prof('d1');
      let a = A.inkR - 44, b = A.inkR + 130;
      for (let i = 0; i < 40; i++) { const m = (a+b)/2;
        const bb = between(ek,'d1',m); const g = bb.minGap === null ? 999 : bb.minGap;
        if (g < target) a = m; else b = m; }
      const dx = (a+b)/2, m = between(ek,'d1',dx);
      /* touching is a pixel fact, so it is counted in pixels */
      const box = { x0:-26, x1: dx + JOB.letters.d1.w + 26, y0:-34, y1:172 };
      const mL = raster(JOB.letters[ek].paths.map(d=>({d,tx:0,join:JOB.letters[ek].join})),null,box,S);
      const mR = raster(JOB.letters.d1.paths.map(d=>({d,tx:dx,join:'round'})),null,box,S);
      OUT.ed[ek+'@'+target] = { dx:+dx.toFixed(2),
        gap: m.minGap === null ? null : +m.minGap.toFixed(2),
        area:+m.area.toFixed(0), touchPx: both(mL,mR) }; }); });

  ['caps','A'].forEach(id => {
    const w = OUT.words[id];
    const order = JOB.words.find(x => x.id === id).order;
    const strokes = []; order.forEach((k,i) => JOB.letters[k].paths.forEach(d =>
      strokes.push({ d, tx:w.pos[i], join:JOB.letters[k].join })));
    const caps = id === 'caps';
    const dots = (caps ? JOB.capDotDX : JOB.dotDX).map(dx =>
      ({ cx: w.pos[2] + dx, cy: caps ? JOB.capDotCY : JOB.dotCY, r: JOB.dotR }));
    const box = { x0:-40, x1:w.total+40, y0:-60, y1:180 };
    const m = raster(strokes, dots, box, 4);
    const bb = bbox(m);
    const rec = { inkW:+(bb.x1-bb.x0).toFixed(2), inkH:+(bb.y1-bb.y0).toFixed(2),
      top:+bb.y0.toFixed(2), bot:+bb.y1.toFixed(2), total:w.total,
      joints:w.joints, pos:w.pos };
    if (caps) OUT.caps = rec; else OUT.low = rec; });


  /* ---- THE RENDERED GAP, WHICH IS THE ONE HE ASKED FOR ----
     The gap above is a geometry number. This is what the joint measures
     in the raster at the size the mark is used at, counted twice: at
     alpha over 127, which is ink a person sees as ink, and at alpha
     over 20, which is any ink at all. When the second one reads zero
     the two letters are touching in the render whatever the geometry
     says. */
  function renderedGaps(order, pos, dots, dotCY, asc) {
    const s = asc / 130;
    const box = { x0:-14, x1: pos[pos.length-1] + 150, y0:-34, y1:172 };
    const w = Math.ceil((box.x1-box.x0)*s), h = Math.ceil((box.y1-box.y0)*s);
    const c = mk(); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently:true });
    x.setTransform(s,0,0,s,-box.x0*s,-box.y0*s);
    x.strokeStyle='#fff'; x.fillStyle='#fff'; x.lineWidth=W; x.lineCap='butt'; x.miterLimit=12;
    const layers = [];
    order.forEach((k,i) => {
      const cc = mk(); cc.width=w; cc.height=h;
      const xx = cc.getContext('2d',{willReadFrequently:true});
      xx.setTransform(s,0,0,s,-box.x0*s,-box.y0*s);
      xx.strokeStyle='#fff'; xx.lineWidth=W; xx.lineCap='butt'; xx.miterLimit=12;
      xx.lineJoin = JOB.letters[k].join==='miter'?'miter':'round';
      xx.save(); xx.translate(pos[i],0);
      JOB.letters[k].paths.forEach(d => xx.stroke(new Path2D(d)));
      xx.restore();
      layers.push(xx.getImageData(0,0,w,h).data); });
    function gapBetween(A,B,th) {
      let minG = Infinity;
      for (let y=0;y<h;y++){ let ah=-1, bl=-1;
        for (let xx=0;xx<w;xx++){ const i=(y*w+xx)*4+3;
          if (A[i]>th) ah=xx; }
        for (let xx=0;xx<w;xx++){ const i=(y*w+xx)*4+3;
          if (B[i]>th) { bl=xx; break; } }
        if (ah<0||bl<0) continue;
        const g = bl - ah - 1; if (g<minG) minG=g; }
      return minG===Infinity?null:minG; }
    const out = [];
    for (let i=1;i<order.length;i++)
      out.push({ pair: order[i-1]+' '+order[i],
        solid: gapBetween(layers[i-1], layers[i], 127),
        any:   gapBetween(layers[i-1], layers[i], 20) });
    return out;
  }
  OUT.rendered = {};
  JOB.sizes.forEach(sz => {
    OUT.rendered['A@'+sz.k]    = renderedGaps(JOB.words.find(w=>w.id==='A').order, OUT.words.A.pos, null, null, sz.asc);
    OUT.rendered['caps@'+sz.k] = renderedGaps(JOB.words.find(w=>w.id==='caps').order, OUT.words.caps.pos, null, null, sz.asc);
    [-3,-6,-9,-12,3,6,9,12,18].forEach(t => {
      const pos = OUT.words.A.pos.map((p,i)=>+(p+i*t).toFixed(2));
      OUT.rendered['A'+t+'@'+sz.k] = renderedGaps(JOB.words.find(w=>w.id==='A').order, pos, null, null, sz.asc); }); });

  /* ---- THE ENCLOSED COUNTER, FLOOD FILLED FROM OUTSIDE ----
     A counter that has closed is a counter with no background left in
     it, which is a count and not an opinion. */
  function counters(k, asc) {
    const g = JOB.letters[k], s = asc/130;
    const box = { x0:-16, x1:g.w+16, y0:-34, y1:172 };
    const m = raster(g.paths.map(d=>({d,tx:0,join:g.join})), null, box, s);
    const seen = new Uint8Array(m.w*m.h), st = [];
    for (let xx=0;xx<m.w;xx++){ st.push(xx); st.push((m.h-1)*m.w+xx); }
    for (let y=0;y<m.h;y++){ st.push(y*m.w); st.push(y*m.w+m.w-1); }
    while (st.length) { const i = st.pop();
      if (i<0||i>=seen.length||seen[i]||m.a[i]) continue;
      seen[i]=1; const xx=i%m.w, y=(i/m.w)|0;
      if (xx>0) st.push(i-1); if (xx<m.w-1) st.push(i+1);
      if (y>0) st.push(i-m.w); if (y<m.h-1) st.push(i+m.w); }
    let enc = 0; for (let i=0;i<seen.length;i++) if (!seen[i] && !m.a[i]) enc++;
    return enc;
  }
  OUT.counters = {};
  const FIT = JOB.sizes.map(sz => ({ k:'fit_'+sz.k, asc:+(sz.asc*131.5/159).toFixed(3) }));
  ['a1','a2','a2b','e1','e2','e3','e3b','d1','u1','n_0','n_48p5','A','E','D','U','N']
    .forEach(k => { const per = {};
      JOB.sizes.concat(FIT).concat([{k:'x8',asc:130*8}]).forEach(sz => per[sz.k] = counters(k, sz.asc));
      OUT.counters[k] = per; });
  OUT.fitSizes = FIT;
  /* the uppercase mark fitted into the lowercase mark's own box */
  FIT.forEach((sz,i) => { OUT.rendered['caps@'+JOB.sizes[i].k+'_fit'] =
    renderedGaps(JOB.words.find(w=>w.id==='caps').order, OUT.words.caps.pos, null, null, sz.asc); });

  /* ---- THE E'S MOUTH, WHICH IS THE THING THAT FILLS ----
     Not the enclosed counter. The mouth is the passage between the
     bar's end and the ring's terminal, and it is measured as the
     shortest distance between the two strokes below the bar. */
  function mouth(k) {
    const g = JOB.letters[k], sc = 4;
    const box = { x0:-16, x1:g.w+16, y0:-34, y1:172 };
    const barY = k==='e3'||k==='e3b' ? 80 : 83;
    const mBar  = raster([{ d:g.paths[0], tx:0, join:'round' }], null, box, sc);
    const mRing = raster([{ d:g.paths[1], tx:0, join:'round' }], null, box, sc);
    const yCut = Math.round((barY + 12 - box.y0) * sc);
    const bar = [], ring = [];
    for (let y=0;y<mBar.h;y++) for (let x=0;x<mBar.w;x++) {
      const i=y*mBar.w+x;
      if (mBar.a[i]) bar.push([x,y]);
      if (mRing.a[i] && y > yCut) ring.push([x,y]); }
    let best = Infinity;
    for (let r=0;r<ring.length;r++) for (let b=0;b<bar.length;b++) {
      const dx=ring[r][0]-bar[b][0], dy=ring[r][1]-bar[b][1];
      const d=dx*dx+dy*dy; if (d<best) best=d; }
    return +(Math.sqrt(best)/sc).toFixed(2);
  }
  OUT.mouth = {}; ['e1','e2','e3','e3b'].forEach(k => { OUT.mouth[k] = mouth(k); });


  /* ---- AND IT EMITS THE RASTER ITSELF ----
     A sheet that shows a scaled drawing is showing geometry. He asked
     for a difference that survives a screenshot, so the tiles carry the
     screenshot: the real raster at the real size, as a png in the page,
     magnified by the browser with no smoothing so the pixels are the
     thing being looked at. */
  function pngWord(order, pos, dots, dotCY, asc, ground, sky, dotc, pad) {
    const s = asc / 130, P = pad == null ? 4 : pad;
    const last = JOB.letters[order[order.length-1]];
    const wU = pos[pos.length-1] + (last.inkR !== undefined ? last.inkR : last.w);
    /* THE BOX FOLLOWS THE WORD'S OWN INK. A fixed box cut the tail off
       every descending u, which is a raster that lies about the letter
       it was made to show. */
    const yr = JOB.pngBox[order.join(',')] || [-30, 136];
    const box = { x0:-2, x1: wU + 2, y0: yr[0], y1: yr[1] };
    const w = Math.round((box.x1-box.x0)*s) + P*2, h = Math.round((box.y1-box.y0)*s) + P*2;
    const c = mk(); c.width = w; c.height = h;
    const x = c.getContext('2d');
    if (ground) { x.fillStyle = ground; x.fillRect(0,0,w,h); }
    x.setTransform(s,0,0,s,-box.x0*s + P, -box.y0*s + P);
    x.strokeStyle = sky; x.lineWidth = W; x.lineCap='butt'; x.miterLimit=12;
    order.forEach((k,i) => { x.save(); x.translate(pos[i],0);
      x.lineJoin = JOB.letters[k].join==='miter'?'miter':'round';
      JOB.letters[k].paths.forEach(d => x.stroke(new Path2D(d))); x.restore(); });
    if (dots) { x.fillStyle = dotc;
      dots.forEach(dx => { x.beginPath();
        x.arc(pos[2] + dx, dotCY, JOB.dotR, 0, Math.PI*2); x.fill(); }); }
    return { url: c.toDataURL('image/png'), w, h };
  }
  OUT.png = {};
  const DARK = { g:'#1A1D26', sky:'#7EB8D4', dot:'#FFFFFF' };
  const PAPER = { g:'#F8F7F3', sky:'#2F6E92', dot:'#3A3733' };
  JOB.pngWords.forEach(id => {
    const wd = JOB.words.find(w => w.id === id);
    const caps = !!wd.caps;
    const dots = caps ? JOB.capDotDX : JOB.dotDX, dcy = caps ? JOB.capDotCY : JOB.dotCY;
    [['boot',26],['bar',13]].forEach(([k,asc]) => {
      OUT.png[id+'@'+k]      = pngWord(wd.order, OUT.words[id].pos, dots, dcy, asc, DARK.g,  DARK.sky,  DARK.dot);
      OUT.png[id+'@'+k+'_p'] = pngWord(wd.order, OUT.words[id].pos, dots, dcy, asc, PAPER.g, PAPER.sky, PAPER.dot); }); });
  /* the tracking ladder, as rasters, at the bar and at the boot card */
  JOB.pngTrack.forEach(t => {
    const wd = JOB.words.find(w => w.id === 'A');
    const pos = OUT.words.A.pos.map((p,i) => +(p + i*t).toFixed(2));
    [['boot',26],['bar',13]].forEach(([k,asc]) => {
      OUT.png['T'+t+'@'+k] = pngWord(wd.order, pos, JOB.dotDX, JOB.dotCY, asc, DARK.g, DARK.sky, DARK.dot); }); });
  /* the ring, as rasters, transparent so the sheet decides the ground */
  function pngRing(units, start, bandFrac, gapDeg, D, cols) {
    const c = mk(); c.width = D; c.height = D;
    const x = c.getContext('2d');
    const band = D * bandFrac, Rm = (D - band) / 2;
    const tot = units.reduce((a,b)=>a+b,0);
    let ang = start * Math.PI / 180;
    x.lineWidth = band; x.lineCap = 'butt';
    units.forEach((u,i) => { const sweep = u/tot*Math.PI*2, g = (gapDeg||0)*Math.PI/180/2;
      x.strokeStyle = cols[i]; x.beginPath();
      x.arc(D/2, D/2, Rm, ang - g, ang - sweep + g, true); x.stroke(); ang -= sweep; });
    return { url: c.toDataURL('image/png'), w:D, h:D };
  }
  JOB.rings.forEach(r => { r.sizes.forEach(D => {
    OUT.png['ring_'+r.id+'@'+D] = pngRing(r.units, r.start, r.bandFrac, r.gapDeg, D, JOB.seatCols); }); });
  Object.keys(JOB.palettes).forEach(pk => { [16,32,180].forEach(D => {
    OUT.png['ring_pal_'+pk+'@'+D] =
      pngRing([1,1,1,1,1,1,1], 90, 3/16, 0, D, JOB.palettes[pk]); }); });

  return OUT;
};

/* ---------- what to measure ---------- */
jobs.words = WORDS;
jobs.dotDX = DOT_DX; jobs.dotCY = DOT_CY; jobs.dotR = DOT_R;
jobs.capDotDX = CAP_DOT_DX; jobs.capDotCY = CAP_DOT_CY;

jobs.deltas = [
 { id:'a1_a1f', a:'a1', b:'a1f' },
 { id:'a1_a2',  a:'a1', b:'a2'  },
 { id:'a2_a2b', a:'a2', b:'a2b' },
 { id:'t1_t2',  a:'t1', b:'t2'  },
 { id:'t2_t2b', a:'t2', b:'t2b' },
 { id:'u1_u2',  a:'u1', b:'u2', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u2_u2b', a:'u2', b:'u2b', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u2_u2t', a:'u2', b:'u2t', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_u2t', a:'u1', b:'u2t', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u2t_u2tb', a:'u2t', b:'u2tb', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_u3',  a:'u1', b:'u3', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3_u3lo',a:'u3', b:'u3lo', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3_u3hi',a:'u3', b:'u3hi', dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_dotnarrow', a:'u1', b:'u1',
   dotsA: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })),
   dotsB: [32.5, 67.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_dotwide', a:'u1', b:'u1',
   dotsA: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })),
   dotsB: [9.5, 90.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 { id:'n1_n2',  a:'n_48p5', b:'n_0' },
 { id:'n_0_12', a:'n_0',    b:'n_12p5' },
 { id:'n_12_24',a:'n_12p5', b:'n_24p5' },
 { id:'n_24_36',a:'n_24p5', b:'n_36p5' },
 { id:'n_36_48',a:'n_36p5', b:'n_48p5' },
 { id:'e1_e2',  a:'e1', b:'e2' },
 { id:'e1_e3',  a:'e1', b:'e3' },
 { id:'e3_e3b', a:'e3', b:'e3b' },
 { id:'d1_d2',  a:'d1', b:'d2' } ];

/* the dot pair, narrow law against the stem centres */
jobs.overlaps = [
 { id:'u3_dots',   letter:'u3',
   dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3lo_dots', letter:'u3lo',
   dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3hi_dots', letter:'u3hi',
   dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_dots',   letter:'u1',
   dots: DOT_DX.map(dx => ({ cx:dx, cy:DOT_CY, r:DOT_R })) },
 { id:'u1_wide',   letter:'u1',
   dots: [9.5, 90.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3_wide',   letter:'u3',
   dots: [9.5, 90.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 /* the dots pulled in far enough to clear the riser sideways, which is
    the only direction the collision actually has */
 { id:'u3_narrow',   letter:'u3',
   dots: [32.5, 67.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3hi_narrow', letter:'u3hi',
   dots: [32.5, 67.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) },
 { id:'u3_touch',    letter:'u3',
   dots: [28.5, 71.5].map(cx => ({ cx, cy:DOT_CY, r:DOT_R })) } ];

/* the hole under the t's crossbar: the background between the a and the t,
   restricted to the band below the bar and above the baseline overshoot */
const BARBOT = 38.75 + W/2;   /* 48.25 */
[['a1','t1'],['a2','t1'],['a1','t2'],['a2','t2'],['a2b','t1'],['a1','t2b'],['a2b','t2b']]
  .forEach(([a,b]) => jobs.holes.push({ id:a+'_'+b, a, b, dx:0, y0:BARBOT, y1:131.5 }));

/* the ring, five readings of it */
const EQ = [1,1,1,1,1,1,1];
jobs.rings = [
 { id:'equal',        units:EQ,                  start:90,  bandFrac:3/16, gapDeg:0, sizes:[16,32,180] },
 { id:'equal_gap',    units:EQ,                  start:90,  bandFrac:3/16, gapDeg:3, sizes:[16,32,180] },
 { id:'equal_thin',   units:EQ,                  start:90,  bandFrac:2/16, gapDeg:0, sizes:[16,32,180] },
 { id:'alt_narrowodd',units:[1,2,1,2,1,2,1],     start:90,  bandFrac:3/16, gapDeg:0, sizes:[16,32,180] },
 { id:'alt_wideodd',  units:[2,1,2,1,2,1,2],     start:90,  bandFrac:3/16, gapDeg:0, sizes:[16,32,180] } ];

jobs.tracking = [-12, -9, -6, -3, 0, 3, 6, 9, 12, 18];
jobs.pngWords = ['A','a1f','a2','a2b','t2','t2b','a2t2','u2','u2b','u2t','u2tb','u3','u3lo','u3hi',
                 'n_0','n_48p5','e2','e3','e3b','caps'];
jobs.pngTrack = [-9,-6,-3,0,3,6,9,12];
jobs.seatCols = SEATS.map(s => s.c);
jobs.palettes = {
  pal:      ['#D6524C','#D8924E','#DABF6A','#5FD5A6','#5EBBDB','#7D93E0','#A77EDB'],
  light:    ['#9B4B47','#8E6231','#7E6C29','#2A7A5C','#2C6F88','#4C5F9E','#6E5490'],
  vivid:    ['#F02E3C','#FF7A00','#C79200','#00A85C','#0091C4','#3D5AFE','#9B27E8'] };
/* per word ink boxes, so no raster clips what it is showing */
jobs.pngBox = {};
WORDS.forEach(w => { let lo = -30, hi = 136;
  w.order.forEach(k => { const ps = ALL[k].paths.join(' ');
    const ys = (ps.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    ps.split(/[ML]/).slice(1).forEach(seg => {
      const v = seg.trim().split(/[\s,]+/).map(Number);
      if (v.length >= 2 && isFinite(v[1])) { if (v[1] < lo) lo = v[1] - 12; if (v[1] > hi) hi = v[1] + 4; } }); });
  jobs.pngBox[w.order.join(',')] = [lo, hi]; });

(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport:{ width:900, height:600 }, deviceScaleFactor:1 });
  p.on('pageerror', e => { console.error('PAGE ERROR', e.message); });
  await p.goto('about:blank');
  const out = await p.evaluate(inPage, jobs);
  await b.close();
  fs.writeFileSync(path.join(__dirname, 'measured.json'), JSON.stringify(out, null, 1));
  console.log('words', Object.keys(out.words).length,
              'deltas', Object.keys(out.deltas).length,
              'rings', Object.keys(out.rings).length,
              'ed', Object.keys(out.ed).length);
  console.log('A pos', out.words.A.pos, 'total', out.words.A.total);
  console.log('A joints', out.words.A.joints.map(j => j.pair+' a'+j.area+' g'+j.gap).join(' | '));
  console.log('low box', out.low, 'caps box', out.caps);
})();
