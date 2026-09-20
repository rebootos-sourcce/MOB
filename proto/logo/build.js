/* Builds proto/logo/index.html from geometry.js. Run from anywhere:
   node /home/user/MOB/proto/logo/build.js
   Nothing outside proto/logo/ is read or written. */
const fs = require('fs'), path = require('path');
const G  = require(path.join(__dirname, 'geometry.js'));
const { L, layout, W, XH, XL, BASE, RW, DOT_R, DOT_CY, DOT_DX } = G;

/* ---------- colour ---------- */
const hex = h => { h = h.replace('#',''); if (h.length===3) h = h.split('').map(c=>c+c).join('');
  return [0,2,4].map(i=>parseInt(h.substr(i,2),16)); };
const lum = c => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
  const [r,g,b] = c.map(f); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const la=lum(hex(a)), lb=lum(hex(b));
  return +(((Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05)).toFixed(2)); };
const hue = h => { const [r,g,b]=hex(h).map(v=>v/255), mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn;
  if(!d) return null; let x; if(mx===r) x=((g-b)/d)%6; else if(mx===g) x=(b-r)/d+2; else x=(r-g)/d+4;
  return Math.round(((x*60)+360)%360); };

/* THE SEVEN LIGHTINGS, resolved. Every value read off a real
   Chromium run of source.html rather than out of the stylesheet, so
   the two color-mix grounds and the two alpha grounds are the
   composites a person actually sees. */
const LIGHT = [
 { k:'dark',       n:'Dark',        sky:'#7EB8D4', bar:'#1A1D26', page:'#0C0D12', dot:'#FFFFFF', paper:false },
 { k:'punch',      n:'Punch',       sky:'#7EB8D4', bar:'#1D1B23', page:'#16141B', dot:'#FFFFFF', paper:false },
 { k:'glass',      n:'Glass',       sky:'#7EB8D4', bar:'#101219', page:'#0B0D14', dot:'#FFFFFF', paper:false },
 { k:'flat',       n:'Flat',        sky:'#5FD4C4', bar:'#121419', page:'#0A0B0E', dot:'#F7F6F3', paper:false },
 { k:'snow',       n:'Snow',        sky:'#2F6E92', bar:'#F8F7F3', page:'#EDEBE6', dot:'#13303F', paper:true },
 { k:'glasswhite', n:'Glass white', sky:'#2F6E92', bar:'#FCFCFB', page:'#E8E7E2', dot:'#14161C', paper:true, prop:'#13303F' },
 { k:'lumen',      n:'Lumen',       sky:'#0091EA', bar:'#FFFFFF', page:'#FFFFFF', dot:'#101010', paper:true, prop:'#06304C' } ];

/* ---------- assembling a mark ---------- */
const CANDS = {
 A: { name:'Circle',  key:'A',
      line:'The plain form of every letter, and the joints solved to a wide target. The face\u2019s thesis with nothing spent.' },
 B: { name:'Gauge',   key:'B',
      line:'Three alternates spent and the joints solved to a close target: the a takes a spur, the t takes a foot, the e opens its aperture.' } };

function mark(key) {
  const S   = G.SOLVED[key];
  const lay = S.order.map((k,i) => ({ k, x:S.pos[i], g:L[k],
    area:S.areas[i], clear:S.gaps[i] }));
  const u   = lay.find(s => s.k[0] === 'u');
  const d   = [];
  lay.forEach(s => s.g.paths.forEach(p =>
    d.push(`<path d="${p}" transform="translate(${s.x} 0)"/>`)));
  const dots = DOT_DX.map(dx =>
    `<circle cx="${(u.x + dx).toFixed(2)}" cy="${DOT_CY}" r="${DOT_R}"/>`);
  const vb = { x:-2, y:-2, w:S.total + 4, h:BASE + 6 };
  return { lay, letters:d, dots, vb, total:S.total, S };
}
const M = { A: mark('A'), B: mark('B') };

/* the svg, as a string that can be lifted out whole. skyVar and
   dotVar let one file answer to seven lightings. */
function svg(m, id, skyC, dotC, opt) {
  opt = opt || {};
  const attr = opt.size ? `width="${opt.size.w}" height="${opt.size.h}"` : 'width="100%"';
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attr} viewBox="${m.vb.x} ${m.vb.y} ${m.vb.w.toFixed(2)} ${m.vb.h}"`
   + ` role="img" aria-label="Atuned"${opt.cls ? ` class="${opt.cls}"` : ''}>`
   + `<g fill="none" stroke="${skyC}" stroke-width="${W}" stroke-linecap="butt" stroke-linejoin="round">`
   + m.letters.join('') + `</g>`
   + `<g fill="${dotC}">` + m.dots.join('') + `</g></svg>`;
}
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- the sixteen pixel cut ----------
   A separate drawing in pixel units, not the wordmark scaled down.
   The whole word at sixteen pixels puts the e's upper counter at
   0.65 of a pixel, so the small end is the u and its dots alone. */
const FAV = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Atuned">`
 + `<g fill="none" stroke="SKY" stroke-width="2" stroke-linecap="butt">`
 + `<path d="M 3 5 L 3 9 A 5 5 0 0 0 13 9 L 13 5"/></g>`
 + `<g fill="DOT"><circle cx="5" cy="2" r="1.5"/><circle cx="11" cy="2" r="1.5"/></g></svg>`;
const fav = (sky,dot) => FAV.replace('SKY',sky).replace('DOT',dot);

/* ---------- a single letter, for the alternates strip ---------- */
function glyph(k, sky, h) {
  const g = L[k], w = (g.side.inkR !== undefined ? g.side.inkR : g.w);
  const vb = `-2 -2 ${(w+4).toFixed(1)} ${BASE+6}`;
  return `<svg viewBox="${vb}" height="${h}" role="img" aria-label="${k}">`
   + `<g fill="none" stroke="${sky}" stroke-width="${W}" stroke-linecap="butt" stroke-linejoin="round">`
   + g.paths.map(p=>`<path d="${p}"/>`).join('') + `</g></svg>`;
}

/* ---------- sizes, actual ----------
   Each is pinned to the ascender height of the type it would
   replace, measured off source.html and funnel/index.html rather
   than chosen: the drawn mark's ascender does the job the current
   cap height does, so the vertical rhythm of every bar it sits in
   does not move. */
const SIZES = [
 { n:'Boot card',      asc:26, why:'The one place the mark is the largest thing on the screen. 26 against the current 23px type.' },
 { n:'Top bar',        asc:13, why:'Pinned to the cap height ATUNED sets today, 13.1px measured at 18px type.' },
 { n:'Funnel heading', asc:32, why:'Pinned to the cap height of the 44px h1 on funnel/index.html, 32.0px measured.' },
 { n:'Favicon',        asc:null, why:'A separate cut at sixteen pixels. The word does not go here and the u does.' } ];
const px = (m, asc) => ({ w:+(m.vb.w * asc / BASE).toFixed(1), h:+(m.vb.h * asc / BASE).toFixed(1) });

/* ============================================================
   the page
   ============================================================ */
const T = [];
const w = s => T.push(s);

w(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atuned logotype, drawn</title>
<style>
:root{
 --bg:#0C0D12; --panel:#1A1D26; --panel2:#252833; --sunk:#090A0E;
 --ink:#EFEDE8; --mid:#B4B0A8; --dim:#94908A;
 --edge:rgba(255,255,255,.10); --edge2:rgba(255,255,255,.18);
 --sky:#7EB8D4; --um:#FFFFFF; --au:#C2A063; --alarm:#FF2E1F; --good:#6FC5A3;
 --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 --num:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);
 font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:40px 24px 120px}
h1{font-size:30px;line-height:1.15;margin:0 0 6px;font-weight:600;letter-spacing:-.01em}
h2{font-size:19px;margin:54px 0 4px;font-weight:600;letter-spacing:-.005em}
h3{font-size:14.5px;margin:26px 0 4px;font-weight:600;color:var(--ink)}
p{margin:8px 0;color:var(--mid);max-width:74ch}
p.k{color:var(--ink)}
.lede{font-size:17px;color:var(--mid);max-width:70ch;margin:10px 0 0}
.eye{display:block;font-size:11px;letter-spacing:.16em;color:var(--dim);
 font-family:var(--num);margin:0 0 14px}
hr{border:0;border-top:1px solid var(--edge);margin:44px 0 0}
.card{background:var(--panel);border:1px solid var(--edge);border-radius:10px;padding:26px;margin:14px 0}
.sunk{background:var(--sunk);border:1px solid var(--edge);border-radius:8px;padding:26px}
table{border-collapse:collapse;width:100%;font-size:13.5px;margin:12px 0}
th,td{text-align:left;padding:7px 12px 7px 0;border-bottom:1px solid var(--edge);vertical-align:top}
th{color:var(--dim);font-weight:400;font-size:11px;letter-spacing:.11em;font-family:var(--num)}
td.n{font-family:var(--num);color:var(--ink);white-space:nowrap}
td.lo{color:var(--alarm)}
code,pre{font-family:var(--num)}
pre{background:var(--sunk);border:1px solid var(--edge);border-radius:8px;padding:16px;
 overflow-x:auto;font-size:11.5px;line-height:1.55;color:var(--mid);margin:8px 0 0}
.tag{display:inline-block;font-family:var(--num);font-size:10.5px;letter-spacing:.08em;
 padding:2px 7px;border:1px solid var(--edge2);border-radius:3px;color:var(--dim);
 vertical-align:2px;margin-left:8px}
.tag.take{border-color:var(--sky);color:var(--sky)}
.tag.no{border-color:rgba(255,46,31,.45);color:#FF7A6E}
.alts{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0 0}
.alt{background:var(--sunk);border:1px solid var(--edge);border-radius:8px;
 padding:16px 18px 12px;min-width:150px;flex:0 0 auto}
.alt.on{border-color:var(--sky);background:rgba(126,184,212,.055)}
.alt svg{display:block;margin:0 auto 10px}
.alt b{display:block;font-family:var(--num);font-size:11px;letter-spacing:.09em;color:var(--dim)}
.alt.on b{color:var(--sky)}
.alt span{display:block;font-size:12px;color:var(--mid);line-height:1.45;margin-top:3px;max-width:19ch}
.sizes{display:flex;flex-wrap:wrap;gap:0;margin:16px 0 0;border:1px solid var(--edge);border-radius:8px;overflow:hidden}
.size{flex:1 1 210px;padding:22px 20px;border-right:1px solid var(--edge);background:var(--sunk);min-width:200px}
.size:last-child{border-right:0}
.size .box{min-height:78px;display:flex;align-items:center}
.size b{display:block;font-size:12.5px;font-weight:600;margin:14px 0 0}
.size span{display:block;font-size:11.5px;color:var(--dim);line-height:1.45;margin-top:3px}
.size em{font-family:var(--num);font-style:normal;color:var(--mid)}
.lights{display:grid;grid-template-columns:repeat(auto-fit,minmax(252px,1fr));gap:12px;margin:16px 0 0}
.lt{border:1px solid var(--edge);border-radius:9px;overflow:hidden}
.lt .bar{padding:11px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(128,128,128,.18)}
.lt .pg{padding:26px 16px 30px;display:flex;flex-direction:column;align-items:center;gap:14px}
.lt .nm{font-family:var(--num);font-size:10px;letter-spacing:.13em;padding:7px 16px;
 color:var(--dim);border-top:1px solid var(--edge);background:var(--sunk);display:flex;
 justify-content:space-between;gap:10px}
.fav{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--edge);border-radius:8px;overflow:hidden;margin:14px 0 0}
.fv{padding:18px 20px;border-right:1px solid var(--edge);text-align:center;background:var(--sunk);flex:0 0 auto}
.fv:last-child{border-right:0}
.fv .sq{width:16px;height:16px;margin:0 auto;display:block}
.fv .z{margin-top:14px;width:128px;height:128px;image-rendering:pixelated;display:block}
.fv b{display:block;font-family:var(--num);font-size:10px;letter-spacing:.1em;color:var(--dim);margin-top:12px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:860px){.two{grid-template-columns:1fr}.wrap{padding:28px 16px 90px}h1{font-size:24px}}
.who{font-size:12px;color:var(--dim);font-family:var(--num);letter-spacing:.06em;margin-top:2px}
ul{color:var(--mid);max-width:74ch;padding-left:20px}
li{margin:5px 0}
b.inl{color:var(--ink);font-weight:600}
.swatch{display:inline-block;width:11px;height:11px;border-radius:2px;vertical-align:-1px;
 margin-right:6px;border:1px solid rgba(128,128,128,.35)}
</style></head><body><div class="wrap">`);

w(`<span class="eye">ATUNED / SOURCE OS &middot; ART DIRECTION &middot; PROTOTYPE</span>
<h1>The Atuned logotype, drawn</h1>
<p class="lede">Six letters cut as paths in the specimen&rsquo;s style, not set in it. Two complete candidates, the alternates
they were chosen from, four sizes at actual size, and the mark on all seven lightings. Nothing on this page
makes a network request and nothing outside <code>proto/logo/</code> was touched.</p>`);

/* ---------- 1. the construction ---------- */
w(`<hr><h2>1. The Construction</h2>
<p>One unit system and every letter derives from it, so the monoline is held by construction rather than by eye.
Change the stroke in one place and all six letters stay the same weight. The numbers below are the drawing.</p>
<table><tr><th>Quantity</th><th>Units</th><th>Why that</th></tr>
<tr><td>x height</td><td class="n">100</td><td>The unit everything else is stated against.</td></tr>
<tr><td>Ascender</td><td class="n">130</td><td>x height over ascender is 0.769. The specimen&rsquo;s x height is very high and this is the ratio that reads as high without the ascenders vanishing.</td></tr>
<tr><td>Stroke</td><td class="n">19</td><td>19 percent of the x height. Under 16 the mark goes spindly at the top bar; over 22 the e closes.</td></tr>
<tr><td>Round overshoot</td><td class="n">1.5</td><td>The a, e and d bowls are 103 across so they read the same size as the 100 wide u and n.</td></tr>
<tr><td>a counter</td><td class="n">65 across</td><td>A true circle. The stem is tangent to the bowl rather than cutting it, which is what keeps the counter circular.</td></tr>
<tr><td>u counter</td><td class="n">62 across</td><td>A channel with a semicircular floor of radius 31.</td></tr>
<tr><td>e upper counter</td><td class="n">26 tall</td><td>0.40 of the a&rsquo;s. This is the number that decides the small end of the whole mark. Section 5.</td></tr>
<tr><td>t crossbar</td><td class="n">top edge at 29</td><td>Half the overshoot above the flat x height line, so it reads level with the rounds and not level with the u alone.</td></tr>
<tr><td>t stem top</td><td class="n">4 below the d</td><td>A naked vertical reads taller than one attached to a bowl.</td></tr>
</table>
<p class="who">Bjorn Haraldsson, grid and type.</p>`);

/* ---------- 2. the dots ---------- */
w(`<hr><h2>2. The Dots, Which Were Already Measured</h2>
<p>The shipping wordmark carries them and their position was corrected once against a measurement. That correction
was re-run in a real Chromium against <code>source.html</code> before anything here was drawn, and it holds:</p>
<table><tr><th>Site</th><th>Left dot</th><th>Right dot</th><th>Midpoint</th><th>Reads</th></tr>
<tr><td>Top bar, <code>.brand</code></td><td class="n">.2498</td><td class="n">.7497</td><td class="n">.4998</td><td>Centred. The corrected one.</td></tr>
<tr><td>Boot card, <code>.boot-wm</code></td><td class="n">.2113</td><td class="n">.7101</td><td class="n" style="color:#FF7A6E">.4607</td><td>0.53px left of centre at 23px. The correction never reached it.</td></tr>
</table>
<p>Both are fractions of the u&rsquo;s own glyph, measured off the rendered box with the trailing letter space taken back out.
The spread is right in both places, .4988 and .4999 of the letter; it is the centring that is wrong on the boot card,
and it is wrong by exactly the amount the top bar was fixed by. That is a live defect and section 8 prices it.</p>
<p class="k">So the law the drawing inherits, stated in the drawing&rsquo;s own units:</p>
<ul>
<li>The two centres sit <b class="inl">50 apart</b>, which is half the u&rsquo;s width, symmetric on the u&rsquo;s centre.
    In a drawn mark there is no letter spacing added after the glyph, so the box and the glyph are the same thing and
    the correction dissolves into the geometry.</li>
<li>Each dot is <b class="inl">19 across</b>, one stroke weight. Measured: the shipping dot is .1878 of the letter&rsquo;s width,
    which on a 100 wide u is 18.8.</li>
<li>Air above the letter is <b class="inl">8</b>, which lands the dots&rsquo; tops 3 under the ascender line. They read as
    aligned with the t and the d without being taller than either, and nothing in the mark rises above the d.</li>
</ul>
<p class="who">Mika Ueda-Salas, against the shipping measurement.</p>`);

/* ---------- 3. alternates ---------- */
w(`<hr><h2>3. The Alternates, And Which One Was Taken</h2>
<p>A face offering three a&rsquo;s and four s&rsquo;s is asking the designer to choose, and for a logotype that choice is the job.
One thing said plainly first: these are forms in the specimen&rsquo;s family, drawn here and measurable here. They are not
tracings of its particular alternates, because this project does not have the face and is not going to identify it.</p>
<p>And a finding that changed how this section was spent. Of the letters the specimen carries several forms of, only
<b class="inl">a</b> and <b class="inl">e</b> are in this name. The t, u, n and d are letters where the drawing has to be
right rather than chosen, so the options below for those four are drawing decisions with a measurement attached, and
they are labelled as such.</p>
<p class="who">Petra Nikau, composition and symbol.</p>`);

const ALT = [
 { ltr:'a', kind:'specimen', take:'a1', opts:[
   ['a1','Circle and a vertical','The face’s thesis in one letter, and the only a here whose counter is a true circle. That circle is what has to survive the small end.'],
   ['a2','The same a with a spur','Puts ink at the baseline under the hole the t’s crossbar opens. Costs 9 units of width and pushes the t 13.5 right, measured.'],
   ['a3','Stem moved 9 inboard','The stem cuts a chord across the bowl and the counter stops being circular. Drawn to be measured against, not to be used.']]},
 { ltr:'t', kind:'drawing', take:'t1', opts:[
   ['t1','Flat foot','The crossbar is the mark’s only horizontal and the flat foot keeps it from answering the d’s bowl.'],
   ['t2','Foot turns right','Fills the hole under its own bar. Worth having only when the tracking is closed, which is candidate B.'],
   ['t3','Short stem, equal arms','The mark loses its tall left event and the whole word flattens into one band. Refused.']]},
 { ltr:'u', kind:'drawing', take:'u1', opts:[
   ['u1','Both stems stop at the x height','The dots are the event above this letter. Nothing else is allowed up there.'],
   ['u2','Right stem carried below the baseline','A second event under the dots. Two events on one letter and the mechanism stops being the point.'],
   ['u3','Right stem to the ascender','Puts one dot over a riser and one over a bowl. The pair stops being a pair.']]},
 { ltr:'n', kind:'drawing', take:'n1', opts:[
   ['n1','Arch springs below the stem top','Leaves a flat cut at the x height, on the same optical line as the t’s bar and the u’s two stem tops. Four flat cuts, one line.'],
   ['n2','Arch springs at the stem top','One fewer corner and one fewer alignment. Cleaner alone, weaker in the word.']]},
 { ltr:'e', kind:'specimen', take:'e1', opts:[
   ['e1','Terminal cut at 42 degrees','The geometric default. Upper counter 26, aperture wide enough to hold to the top bar.'],
   ['e2','Terminal cut at 66 degrees','A wider aperture, which is the one thing that helps at small sizes. It also opens the e to d joint by 5.'],
   ['e3','Bar at centre, terminal at 20','Closes to a slot. Upper counter drops to 23 and the aperture goes with it. Refused on the measurement.']]},
 { ltr:'d', kind:'drawing', take:'d1', opts:[
   ['d1','Full ascender','The d is the tallest thing in the mark, which gives the word one rising note at its end.'],
   ['d2','Ascender cut to the t','Every vertical the same height. The word closes into a rectangle and stops moving.']]} ];

const TAKEN = { a:'a1', t:'t1', u:'u1', n:'n1', e:'e1', d:'d1' };
ALT.forEach(a => {
  w(`<h3>${a.ltr} <span class="tag">${a.kind === 'specimen' ? 'specimen alternate' : 'drawing decision'}</span></h3><div class="alts">`);
  a.opts.forEach(([k,label,why]) => {
    const on = k === a.take;
    w(`<div class="alt${on?' on':''}">${glyph(k, on ? 'var(--sky)' : 'var(--mid)', 58)}<b>${k}${on?' &middot; taken':''}</b><span>${label}. ${why}</span></div>`);
  });
  w(`</div>`);
});
w(`<p style="margin-top:18px">Taken for candidate A: <code>a1 t1 u1 n1 e1 d1</code>. Candidate B spends three of them:
<code>a2 t2 u1 n1 e2 d1</code>. That is the only difference between the two marks worth arguing about, and section 4 says why.</p>`);

/* ---------- 4. candidates ---------- */
w(`<hr><h2>4. Two Candidates</h2>`);
['A','B'].forEach(key => {
  const c = CANDS[key], m = M[key];
  w(`<div class="card"><h3 style="margin-top:0;font-size:17px">Candidate ${key} &middot; ${c.name}</h3>
  <p style="margin-top:2px">${c.line}</p>
  <div class="sunk" style="margin:16px 0 0;display:flex;justify-content:center;padding:34px 26px">
   ${svg(m, 'c'+key, 'var(--sky)', 'var(--um)', { size: px(m, 48) })}</div>
  <table style="margin-top:18px"><tr><th>Joint</th><th>Clearance</th><th>Set by</th></tr>`);
  m.lay.forEach((s,i) => { if (s.setBy) w(`<tr><td>${s.k} to ${m.lay[i+1].k}</td><td class="n">${s.clear}</td><td>${s.setBy === 'overhang' ? 'an overhang, and it cannot tighten' : 'the spacing table'}</td></tr>`); });
  w(`<tr><td>Total width</td><td class="n">${m.total}</td><td>Added tracking ${c.T}, minimum overhang clearance ${c.clear}.</td></tr></table></div>`);
});

w(`<h3>The finding that decides it</h3>
<p>Candidate A is 647 units wide and candidate B is 635. <b class="inl">Twelve units, 1.9 percent.</b> Taking the tracking
from 6 to 0 barely moves the mark, and the reason is in the two tables above: the first two joints are set by an
overhang, the t&rsquo;s crossbar and the a&rsquo;s spur, and an overhang does not answer the tracking at all. Only the last
three joints are elastic.</p>
<p>So closing the tracking does not make the mark tighter, it makes it <b class="inl">lopsided</b>: the left half of the word
stays where it is and the right half closes up. At candidate A&rsquo;s setting the five joints measure 9.5, 9.5, 24, 21, 18.
At a wide setting of 14 they measure 17.5, 9.5, 32, 29, 26, which is worse, because the t to u joint is pinned by the
bar and every other joint walks away from it.</p>
<p class="k">Landed: <b class="inl">candidate A at tracking 6</b>. It is the setting where the two pinned joints and the
three elastic ones are closest to agreeing, and it holds the ruling that the letters are given room without opening
holes the eye then reads as gaps. B stays on the page because its three alternates are the right answer if the mark
is ever needed at the top bar and nowhere else, where the open e earns its aperture back.</p>
<p class="who">Bjorn found the pin. Mika landed A.</p>`);

/* ---------- 5. four sizes ---------- */
w(`<hr><h2>5. Four Sizes, Actual Size</h2>
<p>Each size is pinned to the ascender height of the type it would replace, measured rather than chosen, so the
vertical rhythm of the bar or the card it sits in does not move.</p>
<div class="sizes">`);
SIZES.forEach(s => {
  const body = s.asc
    ? `<div class="box">${svg(M.A, 's', 'var(--sky)', 'var(--um)', { size: px(M.A, s.asc) })}</div>`
    : `<div class="box">${fav('var(--sky)','var(--um)')}</div>`;
  const dim = s.asc ? `<em>${px(M.A, s.asc).w} &times; ${px(M.A, s.asc).h}px</em>, ascender <em>${s.asc}px</em>` : `<em>16 &times; 16px</em>`;
  w(`<div class="size">${body}<b>${s.n}</b><span>${dim}<br>${s.why}</span></div>`);
});
w(`</div>`);

w(`<h3>What the small end drops, and the number behind it</h3>
<p>This style has one known failure and it is not the stroke, it is the counter. A circular counter closes to a dot
before a rectangular one closes to a slot, so the letter with the smallest counter decides the whole mark&rsquo;s floor.
Here that letter is the e, whose upper counter is 26 units against the a&rsquo;s 65, a ratio of 0.40. The e therefore fills
at two and a half times the size the a does.</p>
<table><tr><th>Size</th><th>e upper counter</th><th>Stroke</th><th>Reads</th></tr>
<tr><td>Funnel heading, ascender 32</td><td class="n">6.4px</td><td class="n">4.7px</td><td>Open at every pixel density.</td></tr>
<tr><td>Boot card, ascender 26</td><td class="n">5.2px</td><td class="n">3.8px</td><td>Open.</td></tr>
<tr><td>Top bar, ascender 13</td><td class="n">2.6px</td><td class="n">1.9px</td><td>Open at 2x. At 1x it is two device pixels of grey and it holds, just.</td></tr>
<tr><td>Whole word at 16px wide</td><td class="n lo">0.65px</td><td class="n lo">0.47px</td><td>Gone. The counter fills, the dots merge into a bar, the t&rsquo;s crossbar merges with the a.</td></tr>
</table>
<p class="k">So the favicon is not the wordmark shrunk. It is a separate cut of the u and its dots, drawn in pixel units,
and here is everything it drops:</p>
<ul>
<li><b class="inl">The word.</b> Five letters go. The u with its dots is what is distinctive, and it is the owner&rsquo;s own
    instruction rather than a monogram invented to solve a rendering problem.</li>
<li><b class="inl">The stroke drops from 19 percent of the x height to 22.</b> 2px on a 9px letter. Proportion loses to
    the pixel grid, because a 1.7px stroke renders as two columns of grey and a 2px stroke renders as a stroke.</li>
<li><b class="inl">The dots go from one stroke wide to one and a half.</b> 3px against a 2px stroke. A dot at the stroke
    weight rasterises to a smudge at this size, and two smudges 3px apart read as one bar, which is the one thing
    the mark cannot afford to say.</li>
<li><b class="inl">The bowl keeps its circle.</b> This was the detail expected to go and it did not: a centreline radius
    of 5 inside a 12px letter leaves the counter 8 across and 8 deep. Measured before it was cut.</li>
</ul>
<div class="fav">`);
LIGHT.forEach(l => {
  const dot = l.prop || l.dot;
  w(`<div class="fv" style="background:${l.bar}">
   <span class="sq">${fav(l.sky, dot)}</span>
   <span class="z">${fav(l.sky, dot).replace('width="16" height="16"','width="128" height="128"')}</span>
   <b style="color:${l.paper?'#6E6B65':'#94908A'}">${l.n}</b></div>`);
});
w(`</div>
<p style="margin-top:12px">Top row is sixteen pixels, actual size. Bottom is the same drawing at eight times so the cut can
be read. Nothing changes between them but the scale.</p>
<p class="who">Petra found the dot merge. Mika cut the small size.</p>`);

/* ---------- 6. colour ---------- */
const contrast = LIGHT.map(l => ({ l,
  skyBar: ratio(l.sky, l.bar), skyPage: ratio(l.sky, l.page),
  dotBar: ratio(l.dot, l.bar), dotPage: ratio(l.dot, l.page),
  dotSky: ratio(l.dot, l.sky),
  propBar: l.prop ? ratio(l.prop, l.bar) : null,
  propSky: l.prop ? ratio(l.prop, l.sky) : null,
  hSky: hue(l.sky), hDot: hue(l.dot), hProp: l.prop ? hue(l.prop) : null }));

w(`<hr><h2>6. The Colour, Which Is Not One Hex</h2>
<p>The brief says blue and white dots. Blue is already a token that moves per lighting, a light sky on the four dark
grounds and a much deeper one on the three paper grounds, so the mark is specified against both. White is the
instruction that does not survive the change of ground, and it has to be decided rather than inherited.</p>

<h3>Why the dots cannot literally stay white</h3>
<p>Because they sit above the letter, on the ground, not on the letter. On paper the ground is nearly white, so a white
dot is not a quiet dot, it is no dot. Three ways to keep the word white were drawn and all three were refused with a
number attached:</p>
<ul>
<li><b class="inl">Put the dots on their own dark plate.</b> The mark stops being a wordmark and becomes a badge, and it
    adds a fourth element to a mark with three. Refused on the mark, not on the arithmetic.</li>
<li><b class="inl">Ring each white dot in blue so it reads on anything.</b> At the top bar the ring is 0.19px. It fails at
    exactly the size that matters, which is the definition of a decoration.</li>
<li><b class="inl">Carry the u&rsquo;s stems up so the dots sit on blue.</b> The letter stops being a u, the risers become the
    tallest thing in the mark instead of the d, and at sixteen pixels the extra 2px of stem eats the dots&rsquo; 1.5px of air.</li>
</ul>

<h3>The ruling</h3>
<p class="k">The dots are not white. They are <b class="inl">the light in the mark</b>, and what a light is worth depends on
what it is standing against.</p>
<p>On the four dark grounds a light source is the brightest thing available, so the dots are pure white, which is his
instruction exactly and unchanged. On the three paper grounds there is no light brighter than the paper, so a light
source cannot be drawn at all; what can be drawn is its absence. There the dots invert to the blue&rsquo;s own hue at low
lightness, and they are the mark&rsquo;s shadow rather than a second ink. One system, seven answers, no exceptions.</p>
<p>Named by what it does rather than by what it looks like, that is one semantic token, <code>--mark-dot</code>, and the
product already holds it under the name <code>--um</code>. The tree has in fact already ruled this way once, on Snow,
where the comment says the umlaut cannot stay white because the dots sit on the paper. This finishes the ruling it
started.</p>

<h3>A defect in the token, found on the measurement</h3>
<p>Three paper lightings, two different answers. Snow gives the dot <span class="swatch" style="background:#13303F"></span><code>#13303F</code>,
hue 203, which is the same family as its own sky at <span class="swatch" style="background:#2F6E92"></span><code>#2F6E92</code>, hue 203. Glass white
gives it <code>#14161C</code>, hue 225 at 17 percent saturation, and Lumen gives it <code>#101010</code>, which has no hue at all.
A neutral dot beside a blue letter reads as ink from a second plate. The same value carrying the letter&rsquo;s own hue
reads as the same mark under less light. The proposal is one column in the table below and it moves nothing else.</p>

<table><tr><th>Lighting</th><th>Sky</th><th>Dot today</th><th>Sky on bar</th><th>Dot on bar</th><th>Dot against sky</th><th>Proposed dot</th></tr>`);
contrast.forEach(c => {
  const lo = v => v < 3 ? ' class="n lo"' : ' class="n"';
  w(`<tr><td>${c.l.n}</td>
  <td class="n"><span class="swatch" style="background:${c.l.sky}"></span>${c.l.sky} <span style="color:#6E6B65">h${c.hSky}</span></td>
  <td class="n"><span class="swatch" style="background:${c.l.dot}"></span>${c.l.dot} <span style="color:#6E6B65">${c.hDot===null?'no hue':'h'+c.hDot}</span></td>
  <td${lo(c.skyBar)}>${c.skyBar}</td><td${lo(c.dotBar)}>${c.dotBar}</td><td${lo(c.dotSky)}>${c.dotSky}</td>
  <td class="n">${c.l.prop ? `<span class="swatch" style="background:${c.l.prop}"></span>${c.l.prop} <span style="color:#6E6B65">h${c.hProp}</span>` : 'holds'}</td></tr>`);
});
w(`</table>
<p>Contrast is stated against each element&rsquo;s own ground, which for the dot is the bar or the page and never the mark.
The threshold a logotype answers to is 3 to 1, the graphical object one, and not the 4.5 that belongs to body text.
Every figure above clears it in both columns, including <code>#13303F</code> at ${ratio('#13303F','#F8F7F3')} on Snow&rsquo;s bar.</p>
<p>The dot against sky column is the one worth reading twice. It is not a legibility number, it is whether the dots
read as a separate material from the letter, and it is the number that says the mark is two colours rather than one
colour with a highlight. Flat is the outlier at ${ratio('#F7F6F3','#5FD4C4')}, because Flat&rsquo;s sky is a teal rather than a blue
and a near white dot on a light teal is the weakest pairing in the set. It clears 3 to 1 on its ground and it is the
one lighting where the mark reads as one material. Named, not fixed: Flat&rsquo;s sky is his.</p>
<p class="who">Sol Amadi took the light. Mika ruled the inversion.</p>`);

/* ---------- 7. seven lightings ---------- */
w(`<hr><h2>7. The Mark On All Seven Lightings</h2>
<p>Each tile is the top bar over the page ground, both at the lighting&rsquo;s real composited values read off a Chromium
run rather than out of the stylesheet, so the two <code>color-mix</code> grounds and the two alpha grounds are what a
person sees. The bar mark is at its actual 13px ascender and the page mark at the funnel&rsquo;s 32.</p>
<div class="lights">`);
LIGHT.forEach(l => {
  const dot = l.prop || l.dot;
  w(`<div class="lt" style="background:${l.page}">
   <div class="bar" style="background:${l.bar}">${svg(M.A,'l','+'.replace('+',l.sky),dot,{size:px(M.A,13)})}
    <span style="font-family:var(--num);font-size:9px;letter-spacing:.34em;color:${l.paper?'#6E6B65':'#94908A'}">SOURCE OS</span></div>
   <div class="pg">${svg(M.A,'lp',l.sky,dot,{size:px(M.A,32)})}
    ${fav(l.sky,dot)}</div>
   <div class="nm"><span>${l.n}</span><span>${l.sky} &middot; ${dot}${l.prop?' proposed':''}</span></div></div>`);
});
w(`</div>`);

/* ---------- 8. what it costs ---------- */
w(`<hr><h2>8. What It Costs To Land</h2>
<p>Every site that draws the mark today, what it would become, and what each one costs. <b class="inl">None of them was
touched.</b> Five seats are live in this tree and all of these files belong to other people.</p>
<p>One correction to the brief first, because it matters to the estimate. The boot animation does not build the mark
from its own paths: it builds the <b class="inl">field</b> from paths, a spine, seven seats, a ring and 24 addresses, and the
wordmark on the boot card is live type with the same CSS dot mechanism as everywhere else. So the boot is a cheap
site, not an expensive one. The expensive one is the uppercase ruling, below.</p>
<table><tr><th>Site</th><th>What is there</th><th>Cost</th></tr>
<tr><td class="n">atuned_src/shell/body.html:167</td><td>The top bar button, <code>span.bn</code> holding <code>At</code>, <code>span.um</code>, <code>ned</code>, plus <code>span.bs</code>.</td><td>Swap three spans for one inline <code>svg</code> and keep <code>.bs</code>. The button, the title and the home behaviour do not move. Small.</td></tr>
<tr><td class="n">atuned_src/shell/head.html:676-762</td><td>The <code>.brand</code> block: the mark, <code>.bn</code> with its uppercase transform and .11em, <code>.um::before/after</code>, and <code>.bs</code> tracked to .467em.</td><td>The mark&rsquo;s own rules go. <code>.bs</code> has to be re-tracked, because it is tracked to the mark&rsquo;s measured width and the drawn mark sets 64.7px where ATUNED sets 85.2. That is the third time that number has been measured and it is the one real cost in this row. Medium.</td></tr>
<tr><td class="n">atuned_src/shell/head.html:3526-3554</td><td><code>.boot-wm</code>: the boot card mark, its own dot offsets, the Powered by pair.</td><td>Same swap. And it closes the 0.53px centring defect in section 2 rather than carrying it into a drawn mark. Small.</td></tr>
<tr><td class="n">atuned_src/shell/body.html:122</td><td>The boot card markup, plus <code>sup.btm</code> carrying the trademark.</td><td>The superscript has to be placed against a drawn mark instead of against a text baseline. Small, and it needs looking at rather than calculating.</td></tr>
<tr><td class="n">funnel/index.html:37-40, 258</td><td><code>h1</code> at 44px weight 600, letter spacing <b class="inl">negative</b> .025em, with <code>.um</code> offsets of .05em and .34em.</td><td>The negative tracking means the box is narrower than the glyph, which flips the sign of the centring correction, so these offsets were never right either. Replacing the h1 with the drawn mark removes the problem rather than solving it. Small, three breakpoints to re-check at 44, 64 and 34px.</td></tr>
<tr><td class="n">funnel/about.html:66-69, 220</td><td>The same h1 mechanism.</td><td>Same swap. Small.</td></tr>
<tr><td class="n">funnel/buy.html:41-44, 200</td><td>The same h1 mechanism.</td><td>Same swap. Small.</td></tr>
<tr><td class="n">funnel/quiz.html:18-21, 155</td><td><code>.wm</code> with offsets .05em and .36em and <code>top:-.5em</code>. A fourth set of numbers for one mark.</td><td>Same swap. Small.</td></tr>
<tr><td class="n">funnel/dist/*.html</td><td>Four built pages carrying copies of all of the above.</td><td>Build products. They cost a rebuild and no drawing. None.</td></tr>
<tr><td class="n">tests/design.js gate 4</td><td>Exempts class <code>bs</code> from the 11px type floor, by class.</td><td>Unchanged: <code>.bs</code> survives the swap. Free.</td></tr>
<tr><td class="n">tests/design.js gate 5</td><td>Exempts <code>.brand</code> from the all caps rule because ATUNED is uppercase.</td><td>A drawn mark has no text content, so the exemption stops being needed and the gate gets stricter for free. That is a gain, and it should be taken deliberately rather than noticed later. Free, and worth a line in the file.</td></tr>
<tr><td class="n">tests/design.js gate 7</td><td>Fails the run on any outbound request that is not one of the two local rasters.</td><td>Inline SVG makes no request. Free, and the drawn mark is strictly better here than a mark that ever needed a face.</td></tr>
<tr><td class="n">Favicon</td><td><b class="inl">There is none.</b> No <code>link rel=icon</code> exists in <code>source.html</code>, in any funnel page or in the dist build.</td><td>A new site rather than a changed one. One inline <code>data:</code> SVG in each head, which stays inside the no network rule. Small, and it is the only row here that adds something the product does not have.</td></tr>
<tr><td class="n">The uppercase ruling</td><td><code>.brand .bn</code> sets <code>text-transform:uppercase</code>. The top bar reads ATUNED. The boot card, all four funnel pages and the specimen&rsquo;s own forms are lowercase.</td><td><b class="inl">His, and it is the one real decision in this table.</b> Priced in section 9.</td></tr>
</table>`);

/* ---------- 9. his ---------- */
w(`<hr><h2>9. Decisions That Are His</h2>
<ol style="color:var(--mid);max-width:74ch;padding-left:20px">
<li style="margin:10px 0"><b class="inl">Lowercase against the uppercase ruling.</b> The top bar was ruled uppercase, asked for
twice before it was done, and the comment in the sheet records it. This brief names six lowercase letters and two dots
over a lowercase u, and the specimen is a face whose whole character is single storey lowercase with a very high x
height. Drawn uppercase, the dots go over a capital U, the x height argument disappears, and the a, e and n stop being
the letters the specimen is interesting for. So: the mark is drawn lowercase and the top bar ruling is the thing that
would have to move. Measured cost of moving it: the mark goes from 85.2px wide to 64.7 in that bar, and
<code>.bs</code> is re-tracked once. Measured cost of not moving it: two cases for one mark, which is what ships today.</li>
<li style="margin:10px 0"><b class="inl">Flat&rsquo;s sky is a teal, not a blue.</b> <code>#5FD4C4</code> against the other six at hue 199 to
203. On Flat the mark is not blue and the dot to letter separation drops to ${ratio('#F7F6F3','#5FD4C4')}, the weakest in the set. It clears
its ground. It is named here rather than changed, because the lighting is his.</li>
<li style="margin:10px 0"><b class="inl">Whether the trademark superscript stays.</b> It is on the boot card only and it was
ruled in before registration. Against a drawn mark it is a placement decision rather than a type decision.</li>
<li style="margin:10px 0"><b class="inl">Candidate A or candidate B.</b> A is landed here on the spacing measurement. B is
the better mark in one place only, the top bar, where the open e buys back an aperture that is 2.6px at that size.
Running both would be two marks, so it is one ruling and it is his.</li>
</ol>`);

/* ---------- 10. source ---------- */
w(`<hr><h2>10. The SVG Source</h2>
<p>Both candidates whole, and the sixteen pixel cut. Strokes rather than flattened outlines on purpose: the monoline is
then held by one number, and changing the weight cannot put the six letters out of agreement with each other. Any
vector tool flattens this to outlines in one command when it needs to be a font or a print asset. The one thing
strokes cannot do is cut a single terminal at an angle the path does not already run at, which is why no sheared
terminal appears among the alternates.</p>
<p>Colour is two attributes, <code>stroke</code> on the letters and <code>fill</code> on the dots, so a live copy takes
<code>var(--sky)</code> and <code>var(--um)</code> and answers to all seven lightings with no second file.</p>`);
['A','B'].forEach(k => {
  w(`<h3>Candidate ${k}, ${CANDS[k].name}</h3><pre>${esc(svg(M[k], k, 'var(--sky)', 'var(--um)').replace(/></g,'>\n<'))}</pre>`);
});
w(`<h3>The sixteen pixel cut</h3><pre>${esc(fav('var(--sky)','var(--um)').replace(/></g,'>\n<'))}</pre>`);

w(`<hr><p class="who" style="margin-top:22px">Sol Amadi, light and colour. Bjorn Haraldsson, type and grid.
Petra Nikau, composition and symbol. Mika Ueda-Salas, the whole and the argument between them.</p>
</div></body></html>`);

fs.writeFileSync(path.join(__dirname, 'index.html'), T.join('\n'));
console.log('wrote index.html', (T.join('\n').length/1024).toFixed(1)+'kB');
console.log('A total', M.A.total, 'B total', M.B.total);
LIGHT.forEach(l => console.log(' ', l.n.padEnd(12), 'sky/bar', ratio(l.sky,l.bar).toFixed(2).padStart(6),
 'dot/bar', ratio(l.prop||l.dot,l.bar).toFixed(2).padStart(6), 'dot/sky', ratio(l.prop||l.dot,l.sky).toFixed(2).padStart(6)));
