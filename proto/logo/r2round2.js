/* round2.html. The nine cuts he named, two rounds each. */
const fs=require('fs'), path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, MOUTH, ALL, SIZES, FLOOR, clears, n2, pxAt, emOf, diffTile, oneLetter,
        wordSVG, png, deltaTable, actual, page, DOT_DX, DOT_CY, DOT_R, W } = B;
const d = id => M.deltas[id];
const dot = (dx,cy) => ({ cx:dx, cy:cy==null?DOT_CY:cy, r:DOT_R });
const NARROW = DOT_DX.map(x=>dot(x));
const WIDE   = [9.5,90.5].map(x=>dot(x));

/* every measured delta, as the sheet's own floor check */
const ALLD = [
 ['d1_d2','the d row he could not tell apart. d1 against d2, the ascender cut from 0 to 4'],
 ['a1_a1f','A1 against A1 round 2. the stem carried to the bowl’s own ink at both ends'],
 ['a1_a2','A1 against A2. the spur'],
 ['a2_a2b','A2 against A2 round 2. the spur’s run 4.5 to 16'],
 ['t1_t2','t1 against T2. the foot turns right'],
 ['t2_t2b','T2 against T2 round 2. radius 14 to 20'],
 ['u1_u2','U1 against U2. the tail'],
 ['u2_u2b','U2 against U2 round 2. the tail committed to 28 below the baseline'],
 ['u1_u3','U1 against U3. the riser'],
 ['u3_u3lo','U3 against U3 round 2 low. the riser stopped under the dots'],
 ['u3_u3hi','U3 against U3 round 2 high. the riser carried over the dots'],
 ['u1_dotwide','U1 round 2. the dots moved from a quarter and three quarters to the stem centres'],
 ['n1_n2','n1 against N2. the stem’s rise above the spring, 48.5 to 0'],
 ['n_36_48','the n ladder, one step. rise 36.5 to 48.5'],
 ['n_24_36','the n ladder, one step. rise 24.5 to 36.5'],
 ['n_12_24','the n ladder, one step. rise 12.5 to 24.5'],
 ['n_0_12','the n ladder, one step. rise 0 to 12.5'],
 ['e1_e2','e1 against E2. the terminal 42 to 66 degrees'],
 ['e1_e3','e1 against E3. bar to the ring’s centre, terminal to 20 degrees'],
 ['e3_e3b','E3 against E3 round 2. the bar stays, the terminal opens to 42'] ];

function floorTable(){
  let h='<div class="tw"><table><tr><th>What changed</th>'
    +SIZES.map(s=>`<th>${s.n} ${s.asc}</th>`).join('')+'<th>Survives at</th></tr>';
  ALLD.forEach(([id,lab])=>{ const x=M.deltas[id];
    h+=`<tr><td>${lab}</td>`+SIZES.map(s=>{const v=x[s.k];
      return `<td class="n ${clears(v)?'ok':'lo'}">${v.changed} px &middot; ${v.bw}&times;${v.bh}</td>`;}).join('')
    +`<td class="n">${SIZES.filter(s=>clears(x[s.k])).map(s=>s.n.toLowerCase().replace(' heading','').replace('top ','')).join(', ')||'nothing'}</td></tr>`;});
  return h+'</table></div>';
}
const inkA = M.deltas.a1_a2.bar.inkA;

/* the four flat cuts on the optical x height line */
const FLATS = [['the t’s crossbar, ink top',29.25],['the u’s two stem tops',30],
 ['the n’s stem top',30],['the a’s bowl, ink top',28.5]];

function holes(){
  const rows=[['a1_t1','a1 and t1, the landed pair'],['a2_t1','a2 and t1, the spur'],
   ['a2b_t1','a2 round 2 and t1, the longer spur'],['a1_t2','a1 and t2'],
   ['a2_t2','a2 and t2, both hooks'],['a1_t2b','a1 and t2 round 2'],
   ['a2b_t2b','both round 2 cuts']];
  const base=M.holes.a1_t1.area;
  let h='<div class="tw"><table><tr><th>Pair</th><th>White under the bar</th><th>Against a1 t1</th>'
   +'<th>Where the t lands</th><th>Whole joint, min gap</th></tr>';
  rows.forEach(([k,lab])=>{const x=M.holes[k];
   h+=`<tr><td>${lab}</td><td class="n">${x.area} sq units</td>`
    +`<td class="n ${x.area<base?'ok':''}">${x.area===base?'the same':(x.area<base?'−':'+')+n2(Math.abs(100*(x.area-base)/base))+' per cent'}</td>`
    +`<td class="n">${x.dx}</td><td class="n">${x.minGap}</td></tr>`;});
  return h+'</table></div>';
}

/* the e's, side by side on every number that matters */
function eTable(){
  const rows=[['e1','e1, the landed e'],['e2','E2, terminal at 66'],
   ['e3','E3, bar on centre, terminal at 20'],['e3b','E3 round 2, bar on centre, terminal at 42']];
  let h='<div class="tw"><table><tr><th>Cut</th><th>Upper counter</th><th>Counter, enclosed px at the bar</th>'
   +'<th>Mouth, units</th><th>Mouth at the bar</th><th>Mouth at the boot card</th>'
   +'<th>e to d white at the 9 unit floor</th></tr>';
  rows.forEach(([k,lab])=>{ const mo=MOUTH[k], ed=M.ed[k+'@9'];
   h+=`<tr><td>${lab}</td><td class="n">${mo.upperCounter}</td>`
    +`<td class="n ${M.counters[k].bar<10?'lo':'ok'}">${M.counters[k].bar} px</td>`
    +`<td class="n">${mo.mouth}</td>`
    +`<td class="n ${(mo.mouth*13/130)<1?'lo':'ok'}">${pxAt(mo.mouth,13)} px</td>`
    +`<td class="n">${pxAt(mo.mouth,26)} px</td>`
    +`<td class="n ${ed.area>3600?'lo':'ok'}">${ed.area} sq units, ${n2(100*(ed.area-3400)/3400)} per cent over</td></tr>`;});
  return h+'</table></div>';
}

/* the n ladder */
function nLadder(){
  const keys=['n_0','n_12p5','n_24p5','n_36p5','n_48p5'];
  const rise=[0,12.5,24.5,36.5,48.5];
  const steps=['n_0_12','n_12_24','n_24_36','n_36_48'];
  let h='<div class="row">';
  keys.forEach((k,i)=>{ h+=`<div class="bx"><span class="lbl">rise ${rise[i]}`
   +(i===0?', which is N2':i===4?', which is n1':'')+`</span>${oneLetter(k)}</div>`;});
  h+='</div><div class="tw"><table><tr><th>One step of the ladder</th>'
   +SIZES.map(s=>`<th>${s.n} ${s.asc}</th>`).join('')+'</tr>';
  steps.forEach((s,i)=>{ const x=M.deltas[s];
   h+=`<tr><td>rise ${rise[i]} to ${rise[i+1]}</td>`
    +SIZES.map(z=>`<td class="n ${clears(x[z.k])?'ok':'lo'}">${x[z.k].changed} px</td>`).join('')+'</tr>';});
  const t=M.deltas.n1_n2;
  h+=`<tr><td><b class="inl">the whole ladder, n1 to N2</b></td>`
   +SIZES.map(z=>`<td class="n ${clears(t[z.k])?'ok':'lo'}">${t[z.k].changed} px</td>`).join('')+'</tr>';
  return h+'</table></div>';
}

/* ---------- the body ---------- */
let b='';

b+=`<div class="nav"><a href="round3.html">Round 3: spacing, the favicon, the dots on paper</a>
<a href="index.html">The first study</a></div>`;

b+=`<hr><h2>1. Why D11 could not be told apart, and what that costs the whole study</h2>
<p class="k">His words: &ldquo;D11 is not varied enough for me to tell.&rdquo; He is right and it is the study&rsquo;s
fault, so it is measured rather than argued.</p>
<p>The d row offered a full ascender against an ascender cut four units shorter. Four units out of a 130 unit
ascender box. Rasterised at the three sizes the mark is actually used at, that change moves
<b class="inl">${M.deltas.d1_d2.bar.changed} pixel</b> in the top bar,
<b class="inl">${M.deltas.d1_d2.boot.changed} pixels</b> on the boot card and
<b class="inl">${M.deltas.d1_d2.funnel.changed}</b> in the funnel heading, out of a mark that carries about
${inkA} pixels of ink in the bar. A sheet that asks a person to rule on one pixel is asking for a
coin toss and calling it a decision.</p>
<p>So this sheet holds to a stated floor, and every tile prints its number against it.
<b class="inl">A change ships as a choice only if it moves at least ${FLOOR.px} pixels and the changed region
measures at least ${FLOOR.dim} pixels in its longest dimension, at one times, at the size it is shown at.</b>
Below that the cut is still drawn, at eight times, with the number attached and marked refused. It is not offered
as a choice.</p>
<p>Running that floor against all nine cuts turned up something larger than the d row, and it is the finding of
this sheet. Read the last column.</p>
${floorTable()}
<p class="k">At the top bar, six of the nine cuts change fewer than ${FLOOR.px} pixels.</p>
<p>The top bar cannot carry a letterform decision. It is 13 pixels of ascender and about ${inkA} pixels of ink,
and at that size the difference between a turned foot and a flat one is
<b class="inl">${M.deltas.t1_t2.bar.changed} pixels</b>: not small, zero. The bar is where the mark has to
survive, not where it gets chosen. Every choice on this sheet is therefore shown at the boot card and the funnel
heading, and the bar is shown beside it as a survival check.</p>
<p class="who">Bjorn Haraldsson found the zero on the t. Mika set the floor.</p>`;

b+=`<hr><h2>2. How to read a tile</h2>
<div class="sunk"><div class="legend">
<span><i style="background:#5B5F6B"></i>ink both rounds share</span>
<span><i style="background:#D8924E"></i>ink round 2 took away</span>
<span><i style="background:#7EB8D4"></i>ink round 2 added</span>
</div>
<p style="margin-top:14px">The warm colour is the Sacral seat, used here because it is warm against a cool sky
and it is a token the product already carries rather than a colour invented for a diagram. Every letter drawn
large on this sheet is at one pixel per unit, which is exactly five times the boot card.</p>
<p>Every actual size tile on this sheet is a <b class="inl">raster</b>, not a scaled
drawing: the same path data drawn into a canvas at the real pixel size, saved into this page as an image, and
magnified by the browser with smoothing turned off. What is on the tile is what a screenshot gets. Nothing on
this page makes a network request.</p></div>`;

/* ---------------- A1 and A2 ---------------- */
b+=`<hr><h2>3. The a. A1 and A2</h2>
<div class="cut"><div class="hd"><b>A1</b><span>round 1</span><span class="tag sky">the landed a</span></div>
<div class="rnd">
<p>The plain a, and the first thing to measure is the joint, because a geometric a with a tangent stem is where
this construction would normally pile ink. It does not. The stem&rsquo;s ink runs 84 to 103 and the bowl&rsquo;s ink band
at its widest runs 84 to 103, so the two are exactly coincident by construction and the right side of the letter
is the stem&rsquo;s own contour with the bowl tucked inside it. There is no black spot and nothing to notch.</p>
<p>What is left are two disagreements of 1.5 units. The bowl overshoots to 131.5 at the foot where the stem is
cut at 130, and the bowl&rsquo;s ink tops out at 28.5 where the stem starts at 30. At eight times they are steps.</p>
<div class="row"><div class="bx"><span class="lbl">a1 at one pixel per unit, which is five times the boot card</span>${oneLetter('a1')}</div>
<div class="bx"><span class="lbl">the landed mark, boot card, actual size</span>${png('A@boot')}</div>
<div class="bx pap"><span class="lbl">the same on paper</span>${png('A@boot_p')}</div></div>
</div>
<div class="rnd"><h4>A1 round 2. Both ends carried to the bowl&rsquo;s own ink</h4>
<p>Change, and the argument for it: if the two bottoms disagree the letter has two baselines, so the stem is cut
at 131.5 and started at 28.5 and the letter has one of each.</p>
<div class="row"><div class="bx"><span class="lbl">what changed. grey is common, warm is removed, sky is added</span>${diffTile('a1','a1f','a1 against a1 round 2')}</div>
<div class="bx"><span class="lbl">round 2 in the word, top bar, actual size</span>${png('a1f@bar')}</div>
<div class="bx"><span class="lbl">the same, six times</span>${png('a1f@bar',6)}</div></div>
${deltaTable([{id:'a1_a1f',label:'the stem carried 1.5 at each end'}])}
<p><span class="tag no">refused</span> <b class="inl">${M.deltas.a1_a1f.boot.changed} changed pixels at the boot
card.</b> Not one. The correction is right in the geometry and invisible in the product, so it is not a choice
and it is not a round 2. A1 closes here: it is not a variable at any size this mark is used at.</p>
<p class="who">Bjorn Haraldsson measured the joint. The refusal is his too.</p></div></div>`;

b+=`<div class="cut"><div class="hd"><b>A2</b><span>round 1</span><span class="tag">the spurred a</span></div>
<div class="rnd">
<p>A2 exists for one stated reason: it puts ink at the baseline under the hole the t&rsquo;s crossbar opens. That is
a claim with an area behind it, so the area was measured. The hole is the background between the a and the t
restricted to the band below the bar&rsquo;s lower edge at ${n2(38.75+W/2)} and above the baseline overshoot at 131.5,
with the joint solved to the mark&rsquo;s own target of 3400 square units in both cases.</p>
${holes()}
<p class="k">The spur closes ${n2(100*(M.holes.a1_t1.area-M.holes.a2_t1.area)/M.holes.a1_t1.area)} per cent of the
hole and moves the t ${n2(M.holes.a2_t1.dx-M.holes.a1_t1.dx)} units right.</p>
<p>That is the round. The spur does not fill the hole, it pays for itself in width and the area solver gives the
width straight back to the joint. The hole under the t&rsquo;s bar is not a letterform problem, it is a tracking
problem, and it goes to round 3 where tracking lives.</p>
<div class="row"><div class="bx"><span class="lbl">what the spur adds</span>${diffTile('a1','a2','a1 against a2')}</div>
<div class="bx"><span class="lbl">a2 in the word, boot card</span>${png('a2@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('a2@bar',6)}</div></div>
${deltaTable([{id:'a1_a2',label:'a1 against a2, the spur'}])}
</div>
<div class="rnd"><h4>A2 round 2. The spur made into a foot</h4>
<p>Change, argued from round 1: at a 4.5 unit flat run the spur is less than a quarter of the stroke weight, so
it reads as a bent stem and not as a foot. If the spur is going to cost width it should do the job it costs the
width for. Run 4.5 to 16, radius 14 to 11.</p>
<div class="row"><div class="bx"><span class="lbl">what the longer run adds</span>${diffTile('a2','a2b','a2 against a2 round 2')}</div>
<div class="bx"><span class="lbl">round 2 in the word, boot card</span>${png('a2b@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('a2b@bar',6)}</div></div>
${deltaTable([{id:'a2_a2b',label:'the run 4.5 to 16, the radius 14 to 11'}])}
<p>It fills ${n2(100*(M.holes.a1_t1.area-M.holes.a2b_t1.area)/M.holes.a1_t1.area)} per cent of the hole against
the spur&rsquo;s ${n2(100*(M.holes.a1_t1.area-M.holes.a2_t1.area)/M.holes.a1_t1.area)}, and costs
${n2(M.holes.a2b_t1.dx-M.holes.a1_t1.dx)} units of the t&rsquo;s position instead of
${n2(M.holes.a2_t1.dx-M.holes.a1_t1.dx)}. Doubling the spur trebles nothing. The reason given for A2 does not
hold at either length, which does not mean A2 is wrong: it means A2 has to be wanted for the silhouette rather
than for the hole, and that is a decision and not a measurement.</p>
<p class="who">Petra Nikau found that the spur was answering a question the spacing had already answered.</p>
</div></div>`;

/* ---------------- T2 ---------------- */
b+=`<hr><h2>4. The t. T2</h2>
<div class="cut"><div class="hd"><b>T2</b><span>round 1</span><span class="tag">the foot turns right</span></div>
<div class="rnd">
<p>The t&rsquo;s foot turns through a quarter circle of radius 14 and runs flat, which fills the hole under its own
crossbar rather than under the a&rsquo;s. Measured against t1: ${M.deltas.t1_t2.boot.changed} changed pixels on the
boot card over a region ${M.deltas.t1_t2.boot.bw} by ${M.deltas.t1_t2.boot.bh}, and
<b class="inl">${M.deltas.t1_t2.bar.changed} in the top bar</b>.</p>
<div class="row"><div class="bx"><span class="lbl">what the turned foot adds</span>${diffTile('t1','t2','t1 against t2')}</div>
<div class="bx"><span class="lbl">T2 in the word, boot card</span>${png('t2@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times. the foot is not in this raster</span>${png('t2@bar',6)}</div></div>
${deltaTable([{id:'t1_t2',label:'the foot turns right at radius 14'}])}
<p>And one thing the study did not say, which only shows when A2 and T2 are drawn in the same word: they are the
same gesture at the same radius, ${n2(M.words.a2t2.pos[1])} units apart. Two identical hooks is a repeat, not a
rhythm. One hook per word, or none.</p>
<div class="row"><div class="bx"><span class="lbl">a2 and t2 together, boot card. count the hooks</span>${png('a2t2@boot')}</div>
<div class="bx"><span class="lbl">the same, three times</span>${png('a2t2@boot',3)}</div></div>
</div>
<div class="rnd"><h4>T2 round 2. Radius 14 to 20, and the run carried to 52</h4>
<p>Change, argued from round 1: a 14 unit radius on a 19 unit stroke is a bend. A 20 unit radius with the run
carried to 52 is a foot, and 52 is still inside the crossbar&rsquo;s own 56, so the letter costs no width at all and
the joint does not move. That is the reason to spend the radius here rather than on the a.</p>
<div class="row"><div class="bx"><span class="lbl">what the bigger radius adds and takes</span>${diffTile('t2','t2b','t2 against t2 round 2')}</div>
<div class="bx"><span class="lbl">round 2 in the word, boot card</span>${png('t2b@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('t2b@bar',6)}</div></div>
${deltaTable([{id:'t2_t2b',label:'radius 14 to 20, run to 52'}])}
<p>It clears the floor at the boot card and the funnel heading and it does not exist in the bar, which is now the
expected answer rather than a surprise. Width cost: zero, measured, because the mark&rsquo;s total is
${M.words.t2b.total} against ${M.words.t2.total} for T2 and ${M.words.A.total} for the landed mark.</p>
<p class="who">Petra Nikau counted the hooks. Bjorn Haraldsson took the radius to where it costs no width.</p>
</div></div>`;
module.exports = b;
