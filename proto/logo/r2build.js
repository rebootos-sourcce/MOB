/* BUILDS proto/logo/round2.html AND round3.html FROM measured.json.
   node /home/user/MOB/proto/logo/r2build.js
   Reads only proto/logo/. Writes only proto/logo/. No number in either
   sheet is typed in: every one is read out of measured.json, which is
   written by r2measure.js off a Chromium raster of the same path data.
   If measured.json is missing this refuses to build rather than
   printing a guess.                                                  */
const fs = require('fs'), path = require('path');
const R  = require(path.join(__dirname, 'r2geom.js'));
const MOUTH = require(path.join(__dirname, 'r2mouth.js'));
const MJ = path.join(__dirname, 'measured.json');
if (!fs.existsSync(MJ)) { console.error('measured.json is not there. run r2measure.js first.'); process.exit(2); }
const M = JSON.parse(fs.readFileSync(MJ, 'utf8'));
const { L, LX, U, W, BASE, DOT_R, DOT_CY, DOT_DX, CAP_DOT_CY, CAP_DOT_DX,
        SEATS, SEATS_DOC, LIGHT, ratio } = R;
const ALL = Object.assign({}, L, LX, U);
const WORDS = require(path.join(__dirname, 'r2measure_words.json'));

/* ---------- the floor this study holds to ----------
   Stated once, applied to every tile, and printed beside every number.
   A change smaller than this does not survive a screenshot at the size
   it is shown at, so it is not offered as a choice. */
const FLOOR = { px: 8, dim: 3 };
const clears = d => d.changed >= FLOOR.px && Math.max(d.bw, d.bh) >= FLOOR.dim;

const SIZES = [ { k:'funnel', n:'Funnel heading', asc:32 },
                { k:'boot',   n:'Boot card',      asc:26 },
                { k:'bar',    n:'Top bar',        asc:13 } ];
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const n2 = v => (Math.round(v*100)/100).toString();
const pxAt = (units, asc) => n2(units * asc / 130);
const emOf = units => (units / 130).toFixed(4).replace(/0+$/,'').replace(/\.$/,'');

/* ---------- drawing ----------
   ONE PIXEL PER UNIT, EVERYWHERE A LETTER IS SHOWN LARGE. The ascender
   box is 130 units, the boot card's ascender is 26 pixels, so a tile at
   one pixel per unit is exactly five times the boot card and the label
   can say so without rounding. */
const UNIT = 1;
function ybox(opt){ return opt && opt.yb ? opt.yb : [-26,136]; }
function svgOf(layers, x0, x1, yb, label, defs) {
  const vw = x1 - x0, vh = yb[1] - yb[0];
  const g = layers.map(ly => {
    const paths = (ly.items||[]).map(it =>
      `<path d="${it.d}" transform="translate(${it.tx} 0)"${it.join === 'miter' ? ' stroke-linejoin="miter" stroke-miterlimit="12"' : ''}/>`).join('');
    const dots = (ly.dots || []).map(d =>
      `<circle cx="${n2(d.cx)}" cy="${n2(d.cy)}" r="${d.r}"/>`).join('');
    const at = (ly.mask ? ` mask="url(#${ly.mask})"` : '') + (ly.op ? ` opacity="${ly.op}"` : '');
    return (paths ? `<g fill="none" stroke="${ly.col}" stroke-width="${W}" stroke-linecap="butt" stroke-linejoin="round"${at}>${paths}</g>` : '')
         + (dots  ? `<g fill="${ly.dotCol || ly.col}"${at}>${dots}</g>` : ''); }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n2(vw*UNIT)}" height="${n2(vh*UNIT)}" `
    + `viewBox="${n2(x0)} ${yb[0]} ${n2(vw)} ${vh}" role="img" aria-label="${esc(label)}">`
    + (defs || '') + g + `</svg>`;
}
function letterLayer(key, col, tx, dots, dotCol, mask) {
  const g = ALL[key];
  return { col, dotCol, mask, items: g.paths.map(d => ({ d, tx: tx||0, join: g.join })), dots: dots||[] };
}
const wOf = k => Math.max(ALL[k].w, ALL[k].side.inkR || 0);
let MASKN = 0;
/* A DIFFERENCE TILE, NOT AN OVERLAY. The first cut of this drew round 2
   on top of round 1, and where round 2 only adds ink nothing of round 1
   is left showing, so a tile meant to show a change showed one drawing.
   This one masks: what both cuts share is grey, what round 2 added is
   the sky, what round 2 took away is the Sacral seat colour, which is
   warm against a cool sky and is a token rather than a new colour. */
function diffTile(k1, k2, label, opt) {
  opt = opt || {};
  const yb = ybox(opt), w = Math.max(wOf(k1), wOf(k2));
  const id1 = 'na'+(++MASKN), id2 = 'nb'+MASKN;
  const rect = `<rect x="-40" y="${yb[0]-10}" width="${w+90}" height="${yb[1]-yb[0]+20}" fill="#fff"/>`;
  const knock = k => `<g fill="#000" stroke="#000" stroke-width="${W}" stroke-linecap="butt" stroke-linejoin="round">`
    + ALL[k].paths.map(d=>`<path d="${d}"/>`).join('')
    + ((opt.dots1&&k===k1?opt.dots1:opt.dots2&&k===k2?opt.dots2:[]).map(d=>`<circle cx="${n2(d.cx)}" cy="${n2(d.cy)}" r="${d.r}"/>`).join(''))
    + `</g>`;
  const defs = `<defs><mask id="${id1}">${rect}${knock(k1)}</mask>`
             + `<mask id="${id2}">${rect}${knock(k2)}</mask></defs>`;
  const layers = [
    letterLayer(k1, '#5B5F6B', 0, opt.dots1||[], '#5B5F6B'),
    Object.assign(letterLayer(k1, '#D8924E', 0, opt.dots1||[], '#D8924E'), { mask:id2 }),
    Object.assign(letterLayer(k2, 'var(--sky)', 0, opt.dots2||[], 'var(--sky)'), { mask:id1 }) ];
  return svgOf(layers, -22, w + 22, yb, label, defs);
}
function oneLetter(k, col, dots, opt) {
  return svgOf([letterLayer(k, col||'var(--sky)', 0, dots||[], 'var(--um)')],
               -22, wOf(k)+22, ybox(opt), k);
}
function wordSVG(id, asc, col, dotCol) {
  const wd = WORDS.find(w => w.id === id), pos = M.words[id].pos;
  const caps = !!wd.caps;
  const dots = (caps ? CAP_DOT_DX : DOT_DX).map(dx =>
    ({ cx: pos[2] + dx, cy: caps ? CAP_DOT_CY : DOT_CY, r: DOT_R }));
  const items = []; wd.order.forEach((k,i) => ALL[k].paths.forEach(d =>
    items.push({ d, tx: pos[i], join: ALL[k].join })));
  const last = ALL[wd.order[wd.order.length-1]];
  const total = pos[pos.length-1] + (last.side.inkR !== undefined ? last.side.inkR : last.w);
  const yb = [-26,136], s = asc/130;
  const svg = svgOf([{ col: col||'var(--sky)', dotCol: dotCol||'var(--um)', items, dots }],
               -3, total + 3, yb, 'Atuned');
  return svg.replace(/width="([\d.]+)" height="([\d.]+)"/,
    (m,a,c)=>`width="${n2(+a*s)}" height="${n2(+c*s)}"`);
}
function png(id, z, alt) {
  const p = M.png[id]; if (!p) return '<span class="miss">no raster</span>';
  return z && z !== 1
    ? `<img src="${p.url}" width="${p.w}" height="${p.h}" alt="${esc(alt||id)}" class="zz" style="width:${p.w*z}px;height:${p.h*z}px">`
    : `<img src="${p.url}" width="${p.w}" height="${p.h}" alt="${esc(alt||id)}" class="a1x">`;
}

/* ---------- number blocks ---------- */
function deltaTable(rows) {
  let h = '<div class="tw"><table><tr><th>Round 1 against round 2</th>'
    + SIZES.map(s => `<th>${s.n}, ascender ${s.asc}</th>`).join('')
    + '<th>Clears the floor</th></tr>';
  rows.forEach(r => {
    const d = M.deltas[r.id];
    h += `<tr><td>${r.label}</td>`
      + SIZES.map(s => { const x = d[s.k];
          return `<td class="n${clears(x)?'':' lo'}">${x.changed} px, ${x.bw} by ${x.bh}</td>`; }).join('')
      + `<td class="n">${SIZES.filter(s => clears(d[s.k])).map(s => s.n.toLowerCase()).join(', ') || 'nowhere'}</td></tr>`; });
  return h + '</table></div>';
}
function actual(id, label) {
  return `<div class="act"><div class="ax"><span class="lbl">Boot card, ascender 26, actual size</span>`
    + png(id+'@boot') + `</div><div class="ax"><span class="lbl">Top bar, ascender 13, actual size</span>`
    + png(id+'@bar') + `</div><div class="ax"><span class="lbl">The same top bar raster, six times, no smoothing</span>`
    + png(id+'@bar', 6, label) + `</div></div>`;
}

/* ---------- the shared head ---------- */
const CSS = fs.readFileSync(path.join(__dirname, 'r2style.css'), 'utf8');
function page(title, lede, body, eyebrow) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>${CSS}</style></head><body><div class="wrap">
<span class="eye">${esc(eyebrow)}</span>
<h1>${esc(title)}</h1>
<p class="lede">${lede}</p>
${body}
</div></body></html>`;
}
module.exports = { M, MOUTH, ALL, WORDS, SIZES, FLOOR, clears, esc, n2, pxAt, emOf,
  svgOf, diffTile, oneLetter, wordSVG, png, deltaTable, actual, page, letterLayer,
  R, SEATS, SEATS_DOC, LIGHT, ratio, DOT_DX, DOT_CY, DOT_R, CAP_DOT_DX, CAP_DOT_CY, W };
