/* round2.html, the case exploration and what is his. */
const path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, MOUTH, SIZES, clears, n2, pxAt, emOf, oneLetter, wordSVG, png,
        page, CAP_DOT_DX, CAP_DOT_CY, DOT_R, W } = B;
const fitBar  = M.fitSizes.find(f=>f.k==='fit_bar').asc;
const fitBoot = M.fitSizes.find(f=>f.k==='fit_boot').asc;
const capH = 126, lowX = 100;
const capAtFit = capH * fitBar / 130, xAtBar = lowX * 13 / 130;
let b='';

b+=`<hr><h2>8. Both cases, carried, and the thing that carrying them shows</h2>
<p class="k">His words: &ldquo;well, now before we were using a regular font, now we are using typography. So for LG18,
just know that now we are exploring.&rdquo; So no ruling is asked for here. Both cases are drawn and both are
measured, and one finding came out of doing it that neither case wins or loses on.</p>

<h3>Seven of the nine cuts do not exist in uppercase</h3>
<p>Not &ldquo;are harder&rdquo;. Do not exist, because the feature each one varies is not present on the capital.</p>
<div class="tw"><table><tr><th>Cut</th><th>What it varies</th><th>In uppercase</th></tr>
<tr><td>A1, A2</td><td>a bowl, and a stem tangent to it, with or without a spur</td><td class="n lo">no bowl and no stem. a cap A is two diagonals and a bar</td></tr>
<tr><td>T2</td><td>the foot of a stem that passes through its own crossbar</td><td class="n lo">a cap T&rsquo;s stem meets the bar at the top and has no foot to turn</td></tr>
<tr><td>U1, U2, U3</td><td>where the stems stop, relative to the x height line</td><td class="n lo">a cap U has no x height line. both stems go to the cap height</td></tr>
<tr><td>N2</td><td>how far the stem rises above the arch&rsquo;s spring</td><td class="n lo">a cap N has no arch. it has a diagonal</td></tr>
<tr><td>E3, E2</td><td>the bar height and the terminal angle of a single storey e</td><td class="n lo">a cap E has three arms and no ring, so no terminal and no mouth</td></tr>
</table></div>
<p>So carrying both cases through the rounds is possible, and it is two studies rather than one. In uppercase the
nine questions collapse to three: where the cap A&rsquo;s bar sits and how its apex is cut, how the umlaut clears a cap
U, and whether the cap E&rsquo;s middle arm is shortened. Those three are drawn below and they are the uppercase
round 1.</p>
<p class="who">Bjorn Haraldsson. It is the kind of thing that only shows up when somebody actually draws the other
case rather than imagining it.</p>

<h3>The uppercase mark, drawn</h3>
<p>Same monoline, same 19 unit stroke, same 1.5 unit overshoot on the rounds. Cap top at 4, which is the
lowercase t&rsquo;s stem top, so the cap height is ${capH} against the lowercase x height of ${lowX} and ascender of
130. The umlaut takes the same law as the lowercase one: centres at a quarter and three quarters of the letter&rsquo;s
width, each dot one stroke wide, eight units of air above the letter.</p>
<div class="row">
<div class="bx"><span class="lbl">the uppercase mark, boot card, actual size</span>${png('caps@boot')}</div>
<div class="bx"><span class="lbl">the lowercase mark, boot card, actual size</span>${png('A@boot')}</div>
<div class="bx"><span class="lbl">uppercase, top bar, six times</span>${png('caps@bar',6)}</div>
<div class="bx"><span class="lbl">lowercase, top bar, six times</span>${png('A@bar',6)}</div></div>
<div class="row">
<div class="bx"><span class="lbl">A. the apex, mitred, and the bar at 0.26 of the cap</span>${oneLetter('A')}</div>
<div class="bx"><span class="lbl">U with the umlaut, and the air it needs</span>${oneLetter('U','var(--sky)',CAP_DOT_DX.map(dx=>({cx:dx,cy:CAP_DOT_CY,r:DOT_R})))}</div>
<div class="bx"><span class="lbl">E, middle arm cut 6 short</span>${oneLetter('E')}</div>
</div>

<h3>And the numbers, which say something neither side expected</h3>
<div class="tw"><table><tr><th>Measured off the ink</th><th>Lowercase</th><th>Uppercase</th></tr>
<tr><td>ink box, units tall</td><td class="n">${M.low.inkH}</td><td class="n">${M.caps.inkH}</td></tr>
<tr><td>ink box, units wide</td><td class="n">${M.low.inkW}</td><td class="n">${M.caps.inkW}</td></tr>
<tr><td>top of the ink, units</td><td class="n">${M.low.top}</td><td class="n">${M.caps.top}</td></tr>
<tr><td>fitted into one box 13 px tall, the letters measure</td><td class="n">${n2(xAtBar)} px of x height</td><td class="n">${n2(capAtFit)} px of cap height</td></tr>
<tr><td>fitted into one box, mark width</td><td class="n">${n2(M.low.inkW*13/M.low.inkH)} px</td><td class="n">${n2(M.caps.inkW*13/M.caps.inkH)} px</td></tr>
<tr><td>smallest counter at the top bar, enclosed px</td><td class="n ok">${M.counters.e1.bar}, the e</td><td class="n lo">${M.counters.A.fit_bar}, the A</td></tr>
<tr><td>joints already touching at the top bar</td><td class="n">${M.rendered['A@bar'].filter(j=>j.any<=0).length} of 5</td><td class="n lo">${M.rendered['caps@bar_fit'].filter(j=>j.any<=0).length} of 5</td></tr>
</table></div>
<p><b class="inl">The umlaut over a cap U eats exactly the height the ascenders and the overshoot use.</b> Fitted
into one box the uppercase cap height is ${n2(capAtFit)} pixels and the lowercase x height is ${n2(xAtBar)}, which
is ${n2(100*Math.abs(capAtFit-xAtBar)/xAtBar)} per cent apart. The two cases are the same optical size in the same
box. The case question is therefore not about fit, which is what the first study implied, and the one
re-tracking it costed is real but it is not the argument.</p>
<p>Where uppercase is measurably worse is the small end, and it is worse for one reason: the cap A is a triangle,
so its counter is ${M.counters.A.fit_bar} enclosed pixels at the top bar against the lowercase e&rsquo;s
${M.counters.e1.bar}, and three of the five joints close rather than two. That is a number, not a preference, and
it is the number to put beside whatever he decides he likes.</p>
<p class="who">Bjorn Haraldsson fitted the two boxes. Mika owns the sentence in the first sheet that said the
uppercase cost was width.</p>`;

b+=`<hr><h2>9. What is his. Five questions, and each one has a seat on it</h2>

<div class="q"><b>Should the top bar get its own cut of the mark, tracked and weighted for thirteen pixels, rather
than the wordmark scaled down?</b>
<p>Six of the nine cuts change fewer than ${8} pixels there and one of them changes zero. Every letterform
decision on this sheet is invisible in the bar, and two of the five joints are already touching in it, which round
3 measures. A separate bar cut would be a second drawing to keep in agreement with the first, which is a real
cost, and the alternative is a bar that cannot show any of the work.</p>
<span>Bjorn Haraldsson, type and grid</span></div>

<div class="q"><b>Do you want A2 kept for what the spur does to the letter&rsquo;s silhouette, now that the reason given
for it has been measured out?</b>
<p>The spur was drawn to fill the hole under the t&rsquo;s crossbar. It closes
${n2(100*(M.holes.a1_t1.area-M.holes.a2_t1.area)/M.holes.a1_t1.area)} per cent of that hole and the longer
version closes ${n2(100*(M.holes.a1_t1.area-M.holes.a2b_t1.area)/M.holes.a1_t1.area)} per cent, because the area
solver returns the width to the joint. It is a real form and it may be wanted as one. It is no longer a fix.</p>
<span>Petra Nikau, composition and symbol</span></div>

<div class="q"><b>Does the dot law move so U3 can exist, or is U3 closed?</b>
<p>U3&rsquo;s riser and the right dot share ${Math.abs(M.overlaps.u3_dots.sepUnits)} units of ink, and the overlap is
sideways rather than up and down, so carrying the riser over the dots measures identically to leaving it under
them. Stopping it below the dots leaves ${pxAt(4,26)} of a pixel of clearance on the boot card, which is not a
gap. The only answer that measures is pulling the dots in to 32.5 and 67.5, which clears by
${M.overlaps.u3_narrow.sepUnits} units with no shared pixels at any size and moves the dots
${n2(75-67.5)} units off the law measured from the shipping mark.</p>
<span>Petra Nikau found the collision. Bjorn Haraldsson measured that the obvious fix is not one</span></div>

<div class="q"><b>The e cannot have both the rhythm and the mouth. Which do you want to lose?</b>
<p>E3 is the only e that spaces to the mark&rsquo;s own target at the floor, ${M.ed['e3@9'].area} square units against
3400, and its mouth closes at the top bar at ${pxAt(MOUTH.e3.mouth,13)} of a pixel. E2 has the widest mouth in the
set at ${pxAt(MOUTH.e2.mouth,13)} pixels and cannot be spaced to the rhythm at any gap, not even with the letters
touching. e1 sits between them and is what ships.</p>
<span>Sol Amadi on the mouth, Bjorn Haraldsson on the rhythm, and they disagree</span></div>

<div class="q"><b>Is two rounds what you meant by a couple, or do you want a third on the cuts that survived?</b>
<p>Two is drawn here. The cuts that would carry a useful third are U1&rsquo;s dot pair, T2&rsquo;s radius and the e, because
those three are the ones where round 2 changed the question rather than closing it. A1 and N2 are closed and a
third round on either would be a second sheet of the same thing, which is the thing a round is not.</p>
<span>Mika Ueda-Salas</span></div>

<div class="nav"><a href="round3.html">Round 3: spacing, the favicon, the dots on paper</a>
<a href="index.html">The first study</a></div>`;
module.exports=b;
