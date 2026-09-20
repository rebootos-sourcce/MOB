/* round2.html, the rest: u, n, e, both cases, and what is his. */
const path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, MOUTH, ALL, SIZES, FLOOR, clears, n2, pxAt, emOf, diffTile, oneLetter,
        wordSVG, png, deltaTable, page, DOT_DX, DOT_CY, DOT_R, CAP_DOT_DX, CAP_DOT_CY, W } = B;
const dot=(x,y)=>({cx:x,cy:y==null?DOT_CY:y,r:DOT_R});
const NARROW=DOT_DX.map(x=>dot(x)), WIDE=[9.5,90.5].map(x=>dot(x));
const PULLED=[32.5,67.5].map(x=>dot(x)), KISS=[28.5,71.5].map(x=>dot(x));
let b='';

/* ---------------- U1 U2 U3 ---------------- */
b+=`<hr><h2>5. The u. U1, U2 and U3, and the dots that sit on it</h2>
<div class="cut"><div class="hd"><b>U1</b><span>round 1</span><span class="tag sky">the landed u</span></div>
<div class="rnd">
<p>Both stems cut flat at the x height line, so nothing on this letter competes with the dots. The claim the
first study made for it was four flat cuts on one optical line. Measured, in units, off the ink rather than off
the centrelines:</p>
<div class="tw"><table><tr><th>Flat cut</th><th>Ink top, units</th><th>Against the u’s 30</th></tr>
<tr><td>the t’s crossbar</td><td class="n">29.25</td><td class="n">0.75 high</td></tr>
<tr><td>the u’s two stem tops</td><td class="n">30</td><td class="n">the reference</td></tr>
<tr><td>the n’s stem top</td><td class="n">30</td><td class="n">level</td></tr>
<tr><td>the a’s bowl, ink top</td><td class="n">28.5</td><td class="n">1.5 high, and it is a round</td></tr>
</table></div>
<p>Spread 1.5 units, which is ${pxAt(1.5,26)} of a pixel on the boot card and ${pxAt(1.5,13)} in the bar. The
claim holds to within a third of a pixel everywhere the mark is used, and 1.5 of it is the round overshoot doing
what overshoot is for. Nothing to change.</p>
<div class="row"><div class="bx"><span class="lbl">u1 with the dots, five times the boot card</span>${oneLetter('u1','var(--sky)',NARROW)}</div></div>
</div>
<div class="rnd"><h4>U1 round 2. The dots, because they are the only variable left on this letter</h4>
<p>The dot law was measured off the shipping mark rather than chosen: centres at a quarter and three quarters of
the letter&rsquo;s width, symmetric on its centre, each dot one stroke wide. That puts them at 25 and 75 on a 100 wide
u, which is ${n2(25-9.5)} units inboard of each stem centre. Round 2 moves them out onto the stem centres, which
is the other defensible position and the one most faces use.</p>
<div class="row">
<div class="bx"><span class="lbl">the law, a quarter and three quarters</span>${oneLetter('u1','var(--sky)',NARROW)}</div>
<div class="bx"><span class="lbl">round 2, on the stem centres</span>${oneLetter('u1','var(--sky)',WIDE)}</div></div>
${deltaTable([{id:'u1_dotwide',label:'the dots moved 15.5 units each, outward'}])}
<p><span class="tag ok">clears</span> at every size, and in the bar it clears by exactly nothing to spare, which is worth
saying plainly: 8 changed pixels against a floor of 8. It is the largest delta on this sheet that is not a whole
letter moving: ${M.deltas.u1_dotwide.funnel.changed} pixels over a region
${M.deltas.u1_dotwide.funnel.bw} by ${M.deltas.u1_dotwide.funnel.bh}. The argument against the wide pair is the
one the first study found the hard way: two points over an open curve reads as a face, and the wider the pair the
more it reads. That cost used to fall on the favicon. It does not any more, because the favicon is now the ring,
so the wide pair is back on the table and it is a real choice rather than a forced one.</p>
<p>It has one measured consequence left, and it is in U3 below: on the stem centres the dots and a raised right
stem share ${Math.abs(M.overlaps.u3_wide.sepUnits)} units of ink.</p>
<p class="who">Sol Amadi wanted the wider pair for the air it puts over the bowl. Petra Nikau holds the face
reading. Unresolved on purpose, and it is drawn both ways.</p>
</div></div>`;

b+=`<div class="cut"><div class="hd"><b>U2</b><span>round 1</span><span class="tag no">not a tail. a missing stem</span></div>
<div class="rnd">
<p>Round 1 was drawn to measure whether the tail can be seen. It found something else first, and it was found by
drawing the difference rather than by reading the path.</p>
<p class="k">U2 as the first study drew it has no right stem above the bowl.</p>
<p>The letter is one path: down the left stem, round the bowl, and then straight down to 146. The right side
never rises to the x height line at all, so the drawing is not a u with a tail, it is a u with a stem missing and
a tail where the stem should start. u1 and U3 run the same subpath upward and are correct; only U2 runs it down.
The difference tile below says it in one look: the warm ink is the right stem, and U2 does not have it.</p>
<div class="row"><div class="bx"><span class="lbl">what U2 takes away, and what it adds</span>${diffTile('u1','u2','u1 against u2',{dots1:NARROW,dots2:NARROW,yb:[-26,164]})}</div>
<div class="bx"><span class="lbl">U2 in the word, boot card. read the u</span>${png('u2@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('u2@bar',6)}</div></div>
${deltaTable([{id:'u1_u2',label:'u1 against U2 as drawn'}])}
<p>The delta is the largest on the sheet, ${M.deltas.u1_u2.funnel.changed} pixels in the funnel heading, and now
it is clear why: most of it is a stem going missing rather than a tail arriving. A number that big should have
been read as a question rather than as a result, and it was not. That is the defect in the first study and it is
mine.</p>
<p class="who">Petra Nikau, on the difference tile. Mika owns the path that shipped.</p>
</div>
<div class="rnd"><h4>U2 round 2. The tail drawn as a tail, and then committed</h4>
<p>Change, argued from round 1 twice over. First the right stem is restored, so the letter is a u and the tail
hangs off a stem that exists. Then the length: 16 units below the baseline is ${n2(16/W)} of a stroke weight,
which at ${pxAt(16,13)} pixels in the bar is one grey pixel hanging off the u and reads as a rendering accident.
28 units is ${n2(28/W)} stroke weights, longer than the stroke is wide, and cannot be read as an overshoot.</p>
<div class="row">
<div class="bx"><span class="lbl">the stem restored. warm is what U2 was missing</span>${diffTile('u2','u2t','u2 against the corrected tail',{dots1:NARROW,dots2:NARROW,yb:[-26,164]})}</div>
<div class="bx"><span class="lbl">restored, in the word, boot card</span>${png('u2t@boot')}</div>
<div class="bx"><span class="lbl">restored and committed to 28</span>${png('u2tb@boot')}</div>
<div class="bx"><span class="lbl">committed, top bar, six times</span>${png('u2tb@bar',6)}</div></div>
${deltaTable([{id:'u2_u2t',label:'U2 against the same letter with its right stem'},
              {id:'u1_u2t',label:'u1 against the corrected tail at 16'},
              {id:'u2t_u2tb',label:'the corrected tail, 16 to 28 below the baseline'}])}
<p>And the price, which is the part that decides it. The mark&rsquo;s ink box goes from
${M.low.inkH} units tall to 158, which is ${n2(100*(158-M.low.inkH)/M.low.inkH)} per cent. Pinned into the same
box, every letter in the word gets ${n2(100*(1-M.low.inkH/158))} per cent smaller, so at the top bar the x height
drops from ${pxAt(100,13)} pixels to ${n2(100*13/158)}. One letter&rsquo;s tail is paid for by all six.</p>
<p class="who">Mika. A tail that costs the whole word 17 per cent of its size has to be worth 17 per cent, and
the first thing to establish is that it is a tail.</p>
</div></div>`;

const ov = Math.abs(M.overlaps.u3_dots.sepUnits);
b+=`<div class="cut"><div class="hd"><b>U3</b><span>round 1</span><span class="tag no">a collision, measured</span></div>
<div class="rnd">
<p>This is the hardest thing on the sheet and the first study undersold it. U3 carries the right stem up to the
ascender at 4. The right dot&rsquo;s ink spans 65.5 to 84.5 across and 3 to 22 down. The riser&rsquo;s ink spans 81 to 100.
<b class="inl">They share ${ov} units of width over 18 units of height.</b> The dot and the stem are touching.</p>
<div class="tw"><table><tr><th>U3 and the right dot</th>${SIZES.map(s=>`<th>${s.n} ${s.asc}</th>`).join('')}</tr>
<tr><td>pixels the dot and the riser share</td>${SIZES.map(s=>`<td class="n ${M.overlaps.u3_dots[s.k].touchPx?'lo':''}">${M.overlaps.u3_dots[s.k].touchPx}</td>`).join('')}</tr>
<tr><td>the same with the dots on the stem centres</td>${SIZES.map(s=>`<td class="n ${M.overlaps.u3_wide[s.k].touchPx?'lo':''}">${M.overlaps.u3_wide[s.k].touchPx}</td>`).join('')}</tr>
</table></div>
<p class="k">The shared pixel count is ${M.overlaps.u3_dots.funnel.touchPx} in the funnel heading,
${M.overlaps.u3_dots.boot.touchPx} on the boot card and ${M.overlaps.u3_dots.bar.touchPx} in the bar.</p>
<p>That is worse than a collision that holds. The geometry says they overlap, and whether the raster agrees
depends on which pixel grid the size lands on, so the mark&rsquo;s topology changes with its size: two dots at one
size, a dot and a hook at another. A logotype may not do that.</p>
<div class="row"><div class="bx"><span class="lbl">U3. the right dot and the riser, five times the boot card</span>${oneLetter('u3','var(--sky)',NARROW)}</div>
<div class="bx"><span class="lbl">and with the dots on the stem centres, which is a full merge</span>${oneLetter('u3','var(--sky)',WIDE)}</div>
<div class="bx"><span class="lbl">U3 in the word, boot card</span>${png('u3@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('u3@bar',6)}</div></div>
${deltaTable([{id:'u1_u3',label:'u1 against U3, the riser'}])}
</div>
<div class="rnd"><h4>U3 round 2. Three answers drawn, and the one that was obvious is wrong</h4>
<p>Round 1 said the riser and the dot overlap. Round 2 was drawn to clear them, and the first thing it found is
that the move everybody reaches for does not work.</p>
<div class="row">
<div class="bx"><span class="lbl">low. the riser stops at 26, under the dots</span>${oneLetter('u3lo','var(--sky)',NARROW)}</div>
<div class="bx"><span class="lbl">high. the riser goes to \u221223, over the dots</span>${oneLetter('u3hi','var(--sky)',NARROW,{yb:[-36,136]})}</div>
<div class="bx"><span class="lbl">the dots pulled in to 32.5 and 67.5</span>${oneLetter('u3','var(--sky)',PULLED)}</div>
<div class="bx"><span class="lbl">the dots at 28.5 and 71.5, which is exactly touching</span>${oneLetter('u3','var(--sky)',KISS)}</div>
</div>
<div class="tw"><table><tr><th>Answer</th><th>Clearance between dot and riser, units</th>
${SIZES.map(z=>`<th>${z.n} ${z.asc}, shared px</th>`).join('')}<th>Clearance in px, ${SIZES.map(z=>z.asc).join(' / ')}</th></tr>
${[['u3_dots','U3 as drawn'],['u3lo_dots','low, riser stops at 26'],['u3hi_dots','high, riser to \u221223'],
   ['u3_touch','dots at 28.5 and 71.5'],['u3_narrow','dots at 32.5 and 67.5']].map(([k,lab])=>{
  const o=M.overlaps[k], sep=o.sepUnits;
  return `<tr><td>${lab}</td><td class="n ${sep!==null&&sep<0?'lo':sep===null||sep>3?'ok':''}">`
   +`${sep===null?'clear, and it is vertical':sep<0?'\u2212'+Math.abs(sep)+', they share ink':sep}</td>`
   +SIZES.map(z=>`<td class="n ${o[z.k].touchPx?'lo':'ok'}">${o[z.k].touchPx}</td>`).join('')
   +`<td class="n">${sep===null?'4 vertical, '+SIZES.map(z=>pxAt(4,z.asc)).join(' / '):SIZES.map(z=>pxAt(sep,z.asc)).join(' / ')}</td></tr>`;}).join('')}
</table></div>
<p class="k">Carrying the riser over the dots changes nothing. It measures the same
${Math.abs(M.overlaps.u3hi_dots.sepUnits)} units of shared ink as U3 does, to the hundredth.</p>
<p>The collision is <b class="inl">horizontal</b>. The right dot&rsquo;s ink runs 65.5 to 84.5 across and the riser&rsquo;s
runs 81 to 100, so they overlap by ${Math.abs(M.overlaps.u3_dots.sepUnits)} units at every height the riser
passes through. Raising it past the dots makes the riser pass through the dot on the way, which is the same
defect with a taller letter and ${n2(23)} more units of mark. The tile above shows it, and the measurement above
says it is identical to the hundredth. That was the obvious answer and it is wrong.</p>
<p><b class="inl">The low answer is not a gap either.</b> The dots&rsquo; ink bottom is at 22 and the riser&rsquo;s ink top
is at 26, so the clearance is 4 units, which is ${pxAt(4,32)} of a pixel in the funnel heading,
${pxAt(4,26)} on the boot card and ${pxAt(4,13)} in the bar. Under half a pixel is not light, it is a slightly
paler pixel. At alpha over 127 the two do not share ink; at any ink at all they merge at every size.</p>
<p><b class="inl">Only moving the dots clears it, and it costs the dot law.</b> Pulled in to 32.5 and 67.5 the
clearance is ${M.overlaps.u3_narrow.sepUnits} units and the shared pixel count is zero at every size, measured.
But the law was measured off the shipping mark, centres at a quarter and three quarters, and this is
${n2(75-67.5)} units inboard of it. Against the law the change measures
${M.deltas.u1_dotnarrow.boot.changed} pixels at the boot card and ${M.deltas.u1_dotnarrow.bar.changed} in the
bar, so it is visible where the mark is large and invisible where it is small, which is the wrong way round for a
correction. And it means U3 does not get the u that every other cut gets: the dots would have to move for this
one letter, or move everywhere for the sake of one.</p>
<p>So the honest state of U3 after two rounds: it cannot be cleared vertically at all, the low answer is a
sub-pixel clearance rather than a gap, and the only clearance that measures is a change to the dots. It is closed
unless the dot law moves with it.</p>
<div class="row">
<div class="bx"><span class="lbl">U3 as drawn, in the word, boot card</span>${png('u3@boot')}</div>
<div class="bx"><span class="lbl">low, in the word, boot card</span>${png('u3lo@boot')}</div>
<div class="bx"><span class="lbl">high, in the word, boot card</span>${png('u3hi@boot')}</div></div>
${deltaTable([{id:'u3_u3lo',label:'U3 against the low answer'},{id:'u3_u3hi',label:'U3 against the high answer'},
              {id:'u1_dotnarrow',label:'the dot law against the dots pulled in to clear the riser'}])}
<p class="who">Petra Nikau found the collision in the geometry. Sol Amadi found that it appears and disappears
with the size. Bjorn Haraldsson drew the high answer expecting it to solve it and measured that it does not,
which is the reason it is on the sheet rather than quietly dropped.</p>
</div></div>`;

/* ---------------- N2 ---------------- */
const nlad = (()=>{
  const keys=['n_0','n_12p5','n_24p5','n_36p5','n_48p5'], rise=[0,12.5,24.5,36.5,48.5];
  const steps=['n_0_12','n_12_24','n_24_36','n_36_48'];
  let h='<div class="row">';
  keys.forEach((k,i)=>{h+=`<div class="bx"><span class="lbl">rise ${rise[i]}${i===0?', which is N2':i===4?', which is n1':''}</span>${oneLetter(k)}</div>`;});
  h+='</div><div class="tw"><table><tr><th>One step of the ladder</th>'+SIZES.map(s=>`<th>${s.n} ${s.asc}</th>`).join('')+'</tr>';
  steps.forEach((s,i)=>{const x=M.deltas[s];
   h+=`<tr><td>rise ${rise[i]} to ${rise[i+1]}</td>`+SIZES.map(z=>`<td class="n ${clears(x[z.k])?'ok':'lo'}">${x[z.k].changed} px</td>`).join('')+'</tr>';});
  const t=M.deltas.n1_n2;
  h+=`<tr><td><b class="inl">the whole ladder, N2 to n1</b></td>`+SIZES.map(z=>`<td class="n ${clears(t[z.k])?'ok':'lo'}">${t[z.k].changed} px</td>`).join('')+'</tr>';
  return h+'</table></div>';})();

b+=`<hr><h2>6. The n. N2</h2>
<div class="cut"><div class="hd"><b>N2</b><span>round 1</span><span class="tag">the arch springs at the stem top</span></div>
<div class="rnd">
<p>The arch is a semicircle and its spring point is fixed at 78.5 by the radius, so the only variable on this
letter is how far the left stem rises above that spring. n1 carries it 48.5 above and keeps a flat cut at the x
height line; N2 stops it at the spring and loses the flat.</p>
<p>The first study called this the marginal row. It is not: ${M.deltas.n1_n2.boot.changed} changed pixels at the
boot card over a region ${M.deltas.n1_n2.boot.bw} by ${M.deltas.n1_n2.boot.bh}, and
${M.deltas.n1_n2.funnel.changed} in the funnel heading. The difference is a shoulder on the upper left of the
letter, and it is ink, not a corner.</p>
<div class="row"><div class="bx"><span class="lbl">what N2 takes away. the warm ink is the shoulder</span>${diffTile('n_48p5','n_0','n1 against n2')}</div>
<div class="bx"><span class="lbl">N2 in the word, boot card</span>${png('n_0@boot')}</div>
<div class="bx"><span class="lbl">n1 in the word, boot card</span>${png('n_48p5@boot')}</div>
<div class="bx"><span class="lbl">N2, top bar, six times</span>${png('n_0@bar',6)}</div></div>
${deltaTable([{id:'n1_n2',label:'the stem’s rise, 48.5 to 0'}])}
</div>
<div class="rnd"><h4>N2 round 2. The ladder, not a second pair</h4>
<p>Change, and this is the round that answers his complaint directly. Two guesses that cannot be told apart is
what D11 was. A variable with five positions on it can be told apart or it cannot, and the measurement says
which. So the rise is drawn at 0, 12.5, 24.5, 36.5 and 48.5, and every step is measured against the step before
it rather than against the end.</p>
${nlad}
<p class="k">No single step of the ladder clears the floor at any size. The whole ladder clears it at the boot
card and the funnel heading and not in the bar.</p>
<p>So the n has no intermediate worth drawing. It is n1 or N2 and there is nothing between them, which is a
useful answer: it removes four drawings from the study instead of adding four. The choice itself is real and it
lives at the boot card and the funnel heading.</p>
<p class="who">Bjorn Haraldsson built the ladder. He also argues n1, on the grounds that the flat cut at the x
height puts the n on the same optical line as the t&rsquo;s bar and the u&rsquo;s two stem tops, which is three agreements
bought with one shoulder.</p>
</div></div>`;

/* ---------------- E3 and E2 ---------------- */
const eTab = (()=>{
  const rows=[['e1','e1, the landed e'],['e2','E2, terminal at 66'],
   ['e3','E3, bar on centre, terminal at 20'],['e3b','E3 round 2, bar on centre, terminal at 42']];
  let h='<div class="tw"><table><tr><th>Cut</th><th>Upper counter, units</th><th>Counter, enclosed px in the bar</th>'
   +'<th>Mouth, units</th><th>Mouth in the bar</th><th>Mouth on the boot card</th>'
   +'<th>e to d white at the 9 unit floor</th></tr>';
  rows.forEach(([k,lab])=>{const mo=MOUTH[k], ed=M.ed[k+'@9'];
   h+=`<tr><td>${lab}</td><td class="n">${mo.upperCounter}</td>`
    +`<td class="n ${M.counters[k].bar<10?'lo':'ok'}">${M.counters[k].bar}</td>`
    +`<td class="n">${mo.mouth}</td>`
    +`<td class="n ${(mo.mouth*13/130)<1?'lo':'ok'}">${pxAt(mo.mouth,13)} px</td>`
    +`<td class="n">${pxAt(mo.mouth,26)} px</td>`
    +`<td class="n ${ed.area>3600?'lo':'ok'}">${ed.area}, ${n2(100*(ed.area-3400)/3400)} per cent over</td></tr>`;});
  return h+'</table></div>';})();

b+=`<hr><h2>7. The e. E3 and E2</h2>
<div class="card"><h3 style="margin-top:0">A correction to the first study, before the rounds</h3>
<p>That sheet argued candidate B on the e&rsquo;s aperture and measured the wrong thing. The enclosed upper counter of
e1 and of E2 is identical at every size this mark is used at: ${M.counters.e1.funnel} pixels in the funnel
heading, ${M.counters.e1.boot} on the boot card, ${M.counters.e1.bar} in the bar, for both. A terminal cut at 66
degrees instead of 42 does not open the counter, because the terminal is not on the counter.</p>
<p>What it opens is the <b class="inl">mouth</b>, which is the passage between the bar&rsquo;s right cap and the ring&rsquo;s
terminal cap, and that is the thing that actually closes at small sizes. E2 takes it from ${MOUTH.e1.mouth} units
to ${MOUTH.e2.mouth}, which in the top bar is ${pxAt(MOUTH.e1.mouth,13)} pixels to ${pxAt(MOUTH.e2.mouth,13)}.
So the argument for E2 survives and is stronger than it was. The number behind it was wrong and is replaced.</p>
<p class="who">Sol Amadi caught it, on a flood fill of the counters that came back identical when it should not
have. The tool was checked against the a first, which it read at ${M.counters.a1.bar} pixels in the bar against
the e&rsquo;s ${M.counters.e1.bar}, a ratio the geometry predicts.</p></div>
${eTab}

<div class="cut"><div class="hd"><b>E3</b><span>round 1</span><span class="tag">bar on centre, terminal at 20</span></div>
<div class="rnd">
<p>E3 does two things at once and the study refused it on one of them. Bar moved from three units below the
ring&rsquo;s centre to the centre itself, and terminal closed from 42 degrees to 20.</p>
<p>The refusal was right on the mouth and wrong on everything else.
<b class="inl">E3&rsquo;s mouth is ${MOUTH.e3.mouth} units, which is ${pxAt(MOUTH.e3.mouth,13)} of a pixel in the top
bar.</b> Under one pixel means closed. Its enclosed counter in the bar is ${M.counters.e3.bar} pixels against
e1&rsquo;s ${M.counters.e1.bar}.</p>
<p>And the thing the study missed: <b class="inl">E3 is the only e in the set that spaces to the mark&rsquo;s own
rhythm.</b> At the 9 unit floor the white between the e and the d measures ${M.ed['e3@9'].area} square units
against a target of 3400, which is ${n2(Math.abs(100*(M.ed['e3@9'].area-3400)/3400))} per cent off. e1 is
${n2(100*(M.ed['e1@9'].area-3400)/3400)} per cent over and E2 is ${n2(100*(M.ed['e2@9'].area-3400)/3400)} per
cent over. E3 trades the mouth for the rhythm, which is a real trade and not a mistake.</p>
<div class="row"><div class="bx"><span class="lbl">what E3 changes</span>${diffTile('e1','e3','e1 against e3')}</div>
<div class="bx"><span class="lbl">E3 in the word, boot card</span>${png('e3@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('e3@bar',6)}</div></div>
${deltaTable([{id:'e1_e3',label:'bar to the centre, terminal to 20'}])}
</div>
<div class="rnd"><h4>E3 round 2. The two variables pulled apart</h4>
<p>Change, argued from round 1: E3 moved the bar and closed the terminal in one step, so the refusal fell on both
and only one of them earned it. The bar on the ring&rsquo;s centre is what makes this e read as a horizon line, which
is the instrument&rsquo;s own vocabulary. The closed terminal is what kills it at 13 pixels. So round 2 keeps the bar
on centre and opens the terminal to 42.</p>
<div class="row"><div class="bx"><span class="lbl">what opening the terminal changes</span>${diffTile('e3','e3b','e3 against e3 round 2')}</div>
<div class="bx"><span class="lbl">round 2 in the word, boot card</span>${png('e3b@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('e3b@bar',6)}</div></div>
${deltaTable([{id:'e3_e3b',label:'the terminal 20 to 42, the bar held on centre'}])}
<p>Mouth ${MOUTH.e3b.mouth} units, which is ${pxAt(MOUTH.e3b.mouth,13)} pixels in the bar and
<b class="inl">wider than e1&rsquo;s own ${pxAt(MOUTH.e1.mouth,13)}</b>. Enclosed counter ${M.counters.e3b.bar}
pixels in the bar against e1&rsquo;s ${M.counters.e1.bar}, because the bar on centre costs three units of upper
counter and that is the price of the horizon. The e to d white goes to ${M.ed['e3b@9'].area}, which is
${n2(100*(M.ed['e3b@9'].area-3400)/3400)} per cent over, so round 2 gives back the one thing E3 was good at.</p>
<p>That is the shape of the whole e question and it is now measurable in one line: the bar&rsquo;s height buys the
horizon and costs the counter, the terminal&rsquo;s angle buys the mouth and costs the rhythm, and no cut in the set
wins both.</p>
<p class="who">Sol Amadi on the mouth and the light through it. Bjorn Haraldsson on the rhythm.</p>
</div></div>

<div class="cut"><div class="hd"><b>E2</b><span>round 1</span><span class="tag">terminal at 66</span></div>
<div class="rnd">
<p>The widest mouth in the set, ${MOUTH.e2.mouth} units, ${pxAt(MOUTH.e2.mouth,13)} pixels in the bar against
e1&rsquo;s ${pxAt(MOUTH.e1.mouth,13)}. It is the one cut on this sheet that measurably helps at the size the mark is
smallest, and the reason the first study kept candidate B alive at all.</p>
<div class="row"><div class="bx"><span class="lbl">what the 66 degree terminal changes</span>${diffTile('e1','e2','e1 against e2')}</div>
<div class="bx"><span class="lbl">E2 in the word, boot card</span>${png('e2@boot')}</div>
<div class="bx"><span class="lbl">top bar, six times</span>${png('e2@bar',6)}</div></div>
${deltaTable([{id:'e1_e2',label:'the terminal 42 to 66'}])}
<p>And the delta table is the interesting part. ${M.deltas.e1_e2.bar.changed} changed pixels in the bar, which is
under the floor, <b class="inl">and the mouth still doubles</b>. Both are true and they are not in conflict: a
mouth going from 1.6 pixels to 3.4 changes the colour of two or three pixels rather than their count. This is the
one place on the sheet where the floor is the wrong instrument, and it is named rather than hidden: the floor
measures whether a shape changed, and the e at 13 pixels is a question about whether light gets through a hole.
Different question, different measurement, and the measurement is in the table above.</p>
</div>
<div class="rnd"><h4>E2 round 2. The joint, walked to touching and past it</h4>
<p>Change, argued from round 1: E2&rsquo;s cost is not in the letter, it is in the joint to the d. Its own aperture
holds white that reads as part of the gap, so the area solver keeps pushing the d away. Round 2 stops solving and
walks it: the same pair at a 9 unit gap, at 3, at touching, and 4 units past touching.</p>
<div class="tw"><table><tr><th>e to d</th><th>Gap, units</th><th>Gap, em</th><th>Gap in the bar</th>
<th>Gap on the boot card</th><th>White between</th><th>Shared ink, px at eight per unit</th></tr>
${[9,6,3,0,-4,-8].map(t=>{const x=M.ed['e2@'+t];
 return `<tr><td>${t===0?'touching':t<0?'overlapped':'open'}</td><td class="n">${x.gap}</td>`
 +`<td class="n">${x.gap<0?'\u2212':''}${emOf(Math.abs(x.gap))}</td><td class="n">${pxAt(x.gap,13)} px</td>`
 +`<td class="n">${pxAt(x.gap,26)} px</td><td class="n">${x.area}</td>`
 +`<td class="n ${x.touchPx?'lo':'ok'}">${x.touchPx}</td></tr>`;}).join('')}
</table></div>
<p class="k">E2 cannot be spaced to the mark&rsquo;s rhythm at any gap. At zero, with the two letters touching, its
white is still ${M.ed['e2@0'].area} square units, ${n2(100*(M.ed['e2@0'].area-3400)/3400)} per cent over target.
e1 reaches target at a ${M.ed['e1@3'].gap} unit gap, area ${M.ed['e1@3'].area}.</p>
<p>Which corrects the first study a second time. It said the e to d joint cannot be solved at all. It can: e1
solves at 3 units and E3 solves at the 9 unit floor. What refuses it for e1 is the floor, and the floor exists
because of the small end, so the sentence should have read that the joint is solvable and the solution is under
the floor the bar sets. That is a different and more useful statement.</p>
<p class="who">Bjorn Haraldsson walked the joint. Mika owns the wrong sentence in the first sheet.</p>
</div></div>`;
module.exports=b;
