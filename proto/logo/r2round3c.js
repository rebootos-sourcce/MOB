/* round3.html: the dots on paper, and what is his. */
const path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, MOUTH, SIZES, n2, pxAt, emOf, wordSVG, png, SEATS, SEATS_DOC, LIGHT,
        ratio, DOT_DX, DOT_CY, DOT_R } = B;
const GREY='#3A3733', VANISH='#6B6863';
const LADDER=['#2E2C29','#3A3733','#464239','#56524C','#645F58','#6B6863','#7A746C'];
const PAPERS=LIGHT.filter(l=>l.paper), DARKS=LIGHT.filter(l=>!l.paper);
let b='';

b+=`<hr><h2>5. The dots on paper. One rule, seven answers</h2>
<p class="k">His words: &ldquo;when the white dots are on paper, make them dark grey.&rdquo;</p>
<p>So the light inverts rather than disappearing. On the four dark grounds the dots are the brightest thing in
the field. On the three paper grounds they are the darkest. That is one rule and it is the right one, and the
only thing left to decide is which grey, which is a number rather than a taste.</p>

<h3>The grey is derived, not picked</h3>
<p>On the dark grounds the dot is pure white and the letter is the sky, and the separation between them is
<b class="inl">${ratio('#FFFFFF','#7EB8D4')} to 1</b>. That number is what makes the dots read as a mechanism
sitting on the letter rather than as part of it. Inverting the light means keeping that separation and changing
its sign, so the grey is the value that sits the same distance below the paper sky as white sits above the dark
sky.</p>
<div class="tw"><table><tr><th>Grey</th><th>Against the paper sky ${'#2F6E92'}</th>
<th>Against Lumen&rsquo;s sky ${'#0091EA'}</th>${PAPERS.map(l=>`<th>${l.n} bar ${l.bar}</th>`).join('')}
${PAPERS.map(l=>`<th>${l.n} page</th>`).join('')}</tr>
${LADDER.map(g=>{const sep=ratio(g,'#2F6E92');
  const pick=g===GREY;
  return `<tr${pick?' style="background:rgba(126,184,212,.07)"':''}><td class="n">${g}${pick?' &middot; taken':''}${g===VANISH?' &middot; the vanishing point':''}</td>`
   +`<td class="n ${pick?'ok':sep<1.3?'lo':''}">${sep}</td>`
   +`<td class="n">${ratio(g,'#0091EA')}</td>`
   +PAPERS.map(l=>`<td class="n">${ratio(g,l.bar)}</td>`).join('')
   +PAPERS.map(l=>`<td class="n">${ratio(g,l.page)}</td>`).join('')+'</tr>';}).join('')}
</table></div>
<p class="k">Taken: <b class="inl">${GREY}</b>. Its separation from the paper sky is
${ratio(GREY,'#2F6E92')} to 1 against the ${ratio('#FFFFFF','#7EB8D4')} the white has on the dark grounds, which
is a match to within ${n2(Math.abs(ratio('#FFFFFF','#7EB8D4')-ratio(GREY,'#2F6E92')))}.</p>
<p>Against the three paper grounds it measures ${PAPERS.map(l=>ratio(GREY,l.bar)).join(', ')} on the bars and
${PAPERS.map(l=>ratio(GREY,l.page)).join(', ')} on the pages. The lowest of the six is
${Math.min.apply(null,PAPERS.map(l=>Math.min(ratio(GREY,l.bar),ratio(GREY,l.page))))} to 1, which clears seven to
one on a mark that is ${n2(19*13/130)} pixels across in the top bar and needs the headroom.</p>
<p>It is warm by three points of red over green and eight over blue, which is not a decorative choice: the three
paper grounds are warm off whites at ${PAPERS.map(l=>l.bar).join(', ')}, and a neutral grey on a warm paper reads
cold and foreign. A trace of the paper&rsquo;s own temperature makes it read as ink on that paper.</p>
<p><b class="inl">And there is a grey that makes the dots disappear.</b> At ${VANISH} the dot and the paper sky
are the same luminance, ${ratio(VANISH,'#2F6E92')} to 1, so the dots stop being an event on the letter and
become a slightly different hue of it. That is the hard floor under the word dark: anything lighter than about
${VANISH} is not a dark grey for this purpose, whatever it is called.</p>
<div class="row">
${LADDER.map(g=>`<div class="bx pap" style="background:#F8F7F3"><span class="lbl">${g}${g===GREY?' &middot; taken':g===VANISH?' &middot; vanishes':''}</span>`
 +wordSVG('A',40,'#2F6E92',g)+`</div>`).join('')}
</div>

<h3>One rule, and the four dark grounds have a stray in them</h3>
<p>Three of the four dark lightings put pure white on the dots. Flat puts ${'#F7F6F3'}, which is not white, and it
was never ruled, it was inherited. One rule means one value, so the sheet below draws all four at
${'#FFFFFF'}. What that changes on Flat, measured: the dot against the bar goes
${ratio('#F7F6F3','#121419')} to ${ratio('#FFFFFF','#121419')}, and the dot against Flat&rsquo;s teal sky goes
${ratio('#F7F6F3','#5FD4C4')} to ${ratio('#FFFFFF','#5FD4C4')}. Flat&rsquo;s sky is a teal at ${'#5FD4C4'} where the
other six are blues, so its dot to letter separation is the weakest in the set either way, and it is named here
rather than changed because the lighting is his.</p>

<h3>The rule on all seven lightings</h3>
<div class="lights">
${LIGHT.map(l=>{const dotc=l.paper?GREY:'#FFFFFF';
 return `<div class="lt"><div class="barx" style="background:${l.bar}">${wordSVG('A',13,l.sky,dotc)}</div>
<div class="pg" style="background:${l.page}">${wordSVG('A',26,l.sky,dotc)}</div>
<div class="nm"><span>${l.n}</span><span>${l.paper?'paper':'dark'}</span></div>
<div class="nm"><span>dot ${dotc}</span><span>to bar ${ratio(dotc,l.bar)}</span></div>
<div class="nm"><span>sky ${l.sky}</span><span>dot to letter ${ratio(dotc,l.sky)}</span></div></div>`;}).join('')}
</div>
<p>Seven grounds, two dot values, one rule, and no ground gets a dot that vanishes into it. The lowest dot to
ground contrast in the set is ${Math.min.apply(null,LIGHT.map(l=>ratio(l.paper?GREY:'#FFFFFF',l.bar)))} to 1, on
${LIGHT.reduce((a,l)=>ratio(l.paper?GREY:'#FFFFFF',l.bar)<ratio(a.paper?GREY:'#FFFFFF',a.bar)?l:a).n}, which is
the paper rule doing exactly what it should: paper needs less separation than a black panel does. The lowest dot
to letter separation is ${Math.min.apply(null,LIGHT.map(l=>ratio(l.paper?GREY:'#FFFFFF',l.sky)))} to 1, on
${LIGHT.reduce((a,l)=>ratio(l.paper?GREY:'#FFFFFF',l.sky)<ratio(a.paper?GREY:'#FFFFFF',a.sky)?l:a).n}, and that
one is the teal rather than the rule.</p>
<p class="who">Sol Amadi derived the grey off the dark grounds rather than choosing it, and found the vanishing
point on the way. Mika holds the one rule.</p>`;

b+=`<hr><h2>6. What is his. Three questions from this sheet, and each one has a seat on it</h2>

<div class="q"><b>Does the mark get one tracking, or one for the boot card and a looser one for the top bar?</b>
<p>As it stands, in the top bar the e to d joint and the t to u joint both measure zero pixels of ground. Plus
six units of tracking gives every joint a pixel and
costs ${n2(100*(M.tracking['6'].total-M.tracking['0'].total)/M.tracking['0'].total)} per cent of the mark&rsquo;s
width. Two trackings is two drawings to keep in agreement. One loose tracking is a mark that is visibly loose on
the boot card, where there is room for it and nothing forcing it.</p>
<span>Bjorn Haraldsson, type and grid</span></div>

<div class="q"><b>Should the e and the d be allowed to touch on purpose at the small end, as a ligature, rather
than be pushed apart?</b>
<p>They are touching now, by accident, and a joint that closes by accident reads as a defect. The same joint
closed on purpose, with the two letters meeting at a stated point rather than merging in the antialiasing, is a
decision somebody made and it reads as one. It would be the only ligature in the mark.</p>
<span>Petra Nikau, composition and symbol, against Bjorn Haraldsson, who wants the tracking</span></div>

<div class="q"><b>Which seven hex values are canonical, the ones in the code or the ones in CLAUDE.md?</b>
<p>They disagree on all seven. The code has Root at ${SEATS[0].c} and the document has ${SEATS_DOC[0]}, and the
same spread runs through the other six. The favicon, the boot ring, the key strip and every seat ring in the
product are drawn from the code. The document is what a new seat reads first. One of the two has to move and it
is not a design decision, it is a decision about which file is the source.</p>
<span>Mika Ueda-Salas</span></div>

<div class="nav"><a href="round2.html">Round 2: the nine cuts</a>
<a href="index.html">The first study</a></div>`;
module.exports=b;
