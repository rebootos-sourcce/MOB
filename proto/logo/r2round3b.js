/* round3.html: the favicon ring and the dots on paper. */
const path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, SIZES, n2, pxAt, emOf, wordSVG, png, SEATS, SEATS_DOC, LIGHT, ratio,
        DOT_DX, DOT_CY, DOT_R } = B;
const GREY='#3A3733', VANISH='#6B6863';
const PAL_LIGHT={Root:'#9B4B47',Sacral:'#8E6231',Solar:'#7E6C29',Heart:'#2A7A5C',
 Throat:'#2C6F88','3rd Eye':'#4C5F9E',Crown:'#6E5490'};
const PAL_VIVID={Root:'#F02E3C',Sacral:'#FF7A00',Solar:'#C79200',Heart:'#00A85C',
 Throat:'#0091C4','3rd Eye':'#3D5AFE',Crown:'#9B27E8'};
const TAB_L='#F1F3F4', TAB_D='#202124';
const worst=(pal,g)=>Math.min.apply(null,Object.keys(pal).map(k=>ratio(pal[k],g)));
const RHY=[['equal','Equal. one, one, one, one, one, one, one','1 1 1 1 1 1 1'],
 ['alt_wideodd','Alternating, the odd seat wide. two, one, two, one, two, one, two','2 1 2 1 2 1 2'],
 ['alt_narrowodd','Alternating, the odd seat narrow. one, two, one, two, one, two, one','1 2 1 2 1 2 1']];
let b='';

/* ---------------- 4. the favicon ---------------- */
b+=`<hr><h2>4. The favicon. It is the ring, and the ring is a band of seven</h2>
<p class="k">His words: &ldquo;for the favicon, let&rsquo;s do like the old ring. Seven colours in a band.&rdquo; And on the
rhythm: &ldquo;either one, one, one, one, one, one, or one, two, one, two, one, two.&rdquo;</p>
<p>That settles the thing the first study spent a section arguing. Every cut of the u with its two dots reads as
a face at sixteen pixels, and the answer was to put the a there instead. With the ring, neither letter goes to
sixteen pixels and the face is not a problem to solve. Also worth saying plainly:
<b class="inl">there is no favicon in the product today at all</b>, so this is a build and not a swap.</p>

<h3>The seven colours, taken off the live tokens</h3>
<p>Not off the palette written in <code>CLAUDE.md</code>, because the two disagree and the code is the one that
ships. The seven below are <code>PAL</code> in <code>engine/data/canon.js</code>, and the same seven are written a
second time on <code>.b-s1</code> to <code>.b-s7</code> in <code>shell/head.html</code>, which is how the boot
ring draws them now.</p>
<div class="chips">${SEATS.map(s=>`<span class="chip"><i class="sw" style="background:${s.c}"></i>${s.n} ${s.c}</span>`).join('')}</div>
<p style="margin-top:14px">And what the document says, which is a different set:</p>
<div class="chips">${SEATS.map((s,i)=>`<span class="chip"><i class="sw" style="background:${SEATS_DOC[i]}"></i>${s.n} ${SEATS_DOC[i]}</span>`).join('')}</div>
<p>Seven values, seven disagreements, and the drift is not small: Root is ${SEATS[0].c} in the code against
${SEATS_DOC[0]} in the document. The ring below is drawn from the code. Which set is canonical is a question and
it is at the end of this sheet.</p>

<h3>Where the seam goes, and which way the band runs</h3>
<p>Root at the bottom, climbing the right side to Crown, so the band is the spine closed into a loop and the
loop closes at the body&rsquo;s base. That is the project&rsquo;s own ruling about the four part loop applied to the
seven: it is a circle, never a list, and a list has an end.</p>

<h3>The two rhythms he named, drawn, and the thing seven does to the second one</h3>
<p><b class="inl">An alternating rhythm cannot close on an odd count.</b> One, two, one, two round a ring of seven
leaves two slots of the same weight meeting at the seam, and that is arithmetic rather than taste. Both readings
are drawn and both are measured, and the seam is named in each.</p>
${RHY.map(([id,lab,units])=>{
  const u=units.split(' ').map(Number), tot=u.reduce((a,c)=>a+c,0);
  const varied=new Set(u).size>1;
  const seam=varied&&u[0]===u[6]?n2((u[0]+u[6])/tot*360):null;
  return `<h4>${lab}</h4>
<div class="fav">${[16,32,180].map(D=>{const r=M.rings[id][D];
  return `<div class="fv">${png('ring_'+id+'@'+D)}<b>${D} pixels, actual size</b>`
   +`<em>band ${n2(r.band)} px</em></div>`;}).join('')}
<div class="fv">${png('ring_'+id+'@16',8)}<b>the sixteen, eight times</b>
<em>narrowest arc ${M.rings[id][16].minSolid} solid px</em></div>
<div class="fv">${png('ring_'+id+'@32',4)}<b>the thirty two, four times</b>
<em>narrowest arc ${M.rings[id][32].minSolid} solid px</em></div></div>
<div class="tw"><table><tr><th>Size</th><th>Band</th><th>Narrowest arc, degrees</th>
<th>Narrowest arc, length in px</th><th>Narrowest arc, solid px</th><th>Widest arc, solid px</th></tr>
${[16,32,180].map(D=>{const r=M.rings[id][D];
  const minDeg=Math.min.apply(null,r.arcDeg), minLen=Math.min.apply(null,r.arcLen);
  return `<tr><td class="n">${D}</td><td class="n">${n2(r.band)}</td><td class="n">${minDeg}</td>`
   +`<td class="n ${minLen<5?'lo':'ok'}">${minLen}</td>`
   +`<td class="n ${r.minSolid<12?'lo':'ok'}">${r.minSolid}</td>`
   +`<td class="n">${Math.max.apply(null,r.solid)}</td></tr>`;}).join('')}
</table></div>
<p>${seam ? `Seam: the two arcs that meet at the bottom are both the ${u[0]===Math.min.apply(null,u)?'narrow':'wide'} weight, so ${seam} degrees of the ring carry one weight without a break and the rhythm restarts inside it. That is the discontinuity, stated.`
 : 'Seam: none. Seven equal arcs close without a discontinuity because every arc is the same weight.'}</p>`;}).join('')}

<h3>Touching or not touching, at the favicon sizes</h3>
<p>The same question as the joints above, asked of the arcs. A three degree gap between arcs costs the band
${M.rings.equal[16].minSolid - M.rings.equal_gap[16].minSolid} of its ${M.rings.equal[16].minSolid} solid pixels
per arc at sixteen, which is
${n2(100*(M.rings.equal[16].minSolid-M.rings.equal_gap[16].minSolid)/M.rings.equal[16].minSolid)} per cent, and
${M.rings.equal[180].minSolid - M.rings.equal_gap[180].minSolid} of ${M.rings.equal[180].minSolid} at a hundred
and eighty, which is ${n2(100*(M.rings.equal[180].minSolid-M.rings.equal_gap[180].minSolid)/M.rings.equal[180].minSolid)} per cent.</p>
<div class="fav">
<div class="fv">${png('ring_equal@16',8)}<b>touching, sixteen, eight times</b><em>${M.rings.equal[16].minSolid} solid px per arc</em></div>
<div class="fv">${png('ring_equal_gap@16',8)}<b>three degree gap, sixteen</b><em>${M.rings.equal_gap[16].minSolid} solid px per arc</em></div>
<div class="fv">${png('ring_equal@180')}<b>touching, one eighty</b><em>${M.rings.equal[180].minSolid} solid px</em></div>
<div class="fv">${png('ring_equal_gap@180')}<b>three degree gap, one eighty</b><em>${M.rings.equal_gap[180].minSolid} solid px</em></div>
</div>
<p>At sixteen the arcs have to touch. A gap there is not a gap, it is a seat losing a fifth of the pixels it had
to say its hue with. At one hundred and eighty a gap costs six per cent and is affordable, but a favicon that
gaps at one size and butts at another is two drawings, and the sixteen is the one that sets the floor.</p>

<h3>The band weight, and the one thing the old ring cannot lend</h3>
<p>The boot mark&rsquo;s ring is a hairline: stroke 1.6 on a circle of radius 62 in a 200 box, which is 1.29 per cent
of its diameter. Scaled to sixteen pixels that is ${n2(0.0129*16)} of a pixel and there is nothing to colour. So
the band takes its weight from the sixteen pixel end rather than from the boot mark: three pixels on sixteen,
which is 18.75 per cent of the diameter, held at every size. At two pixels the arcs drop to
${M.rings.equal_thin[16].minSolid} solid pixels each against ${M.rings.equal[16].minSolid}, measured, which is
the reason three is the floor and not two.</p>
<p>The boot mark&rsquo;s core dot is 18 units across in a 200 unit box, ${n2(18/200*100)} per cent of it. At sixteen
pixels that is ${n2(16*18/200)} pixels across, which is one pixel and a bit of another. It is not in the favicon,
and that is a measurement rather than a preference.</p>

<h3>Which palette the ring takes, since a favicon has no lighting</h3>
<p>The tab strip is the browser&rsquo;s ground and the product does not own it, so the ring cannot follow the seven
lightings the way the wordmark does. It gets one palette, and that palette has two jobs at once: the whole band
has to separate from an unknown ground, and the seven arcs have to separate from <b class="inl">each other</b>,
because in a band they touch. At sixteen pixels each arc is about three pixels of arc length, so if two
neighbours are close the antialiasing between them closes the difference entirely.</p>
<div class="tw"><table><tr><th>Palette</th><th>Worst seat against a light tab ${TAB_L}</th>
<th>Worst seat against a dark tab ${TAB_D}</th><th>Worst of the two</th>
<th>Closest two neighbours, contrast</th><th>Closest two neighbours, rgb distance</th></tr>
${[['PAL, the dark palette, and what the boot ring uses',Object.fromEntries(SEATS.map(s=>[s.n,s.c]))],
   ['PAL_LIGHT, the Snow palette',PAL_LIGHT],['PAL_VIVID, the Lumen palette',PAL_VIVID]].map(([lab,p])=>{
  const B7=SEATS.map(s=>s.n);
  const adj=[],adjE=[];
  for(let i=0;i<7;i++){const a=p[B7[i]],b2=p[B7[(i+1)%7]];
    adj.push(ratio(a,b2));
    const h=x=>{x=x.replace('#','');return [0,2,4].map(i2=>parseInt(x.substr(i2,2),16));};
    const A=h(a),Bq=h(b2);adjE.push(Math.round(Math.sqrt(A.reduce((t,v,i2)=>t+(v-Bq[i2])*(v-Bq[i2]),0))));}
  const a=worst(p,TAB_L), c=worst(p,TAB_D), m=Math.min(a,c);
  const e=Math.min.apply(null,adjE);
  return `<tr><td>${lab}</td><td class="n">${n2(a)}</td><td class="n">${n2(c)}</td>`
   +`<td class="n ${m>=2.2?'ok':'lo'}">${n2(m)}</td>`
   +`<td class="n">${n2(Math.min.apply(null,adj))}</td>`
   +`<td class="n ${e>=45?'ok':'lo'}">${e}</td></tr>`;}).join('')}
</table></div>
<div class="fav">
${['pal','light','vivid'].map(k=>`<div class="fv">${png('ring_pal_'+k+'@16',8)}<b>${k==='pal'?'PAL':k==='light'?'PAL_LIGHT':'PAL_VIVID'}, sixteen, eight times</b></div>`).join('')}
${['pal','light','vivid'].map(k=>`<div class="fv">${png('ring_pal_'+k+'@180')}<b>${k==='pal'?'PAL':k==='light'?'PAL_LIGHT':'PAL_VIVID'}, one eighty</b></div>`).join('')}
</div>
<p class="k">PAL_LIGHT is out on the measurement, and it is the one that looked safest. Its closest two
neighbours are 20 units apart in rgb, against 47 for PAL and 61 for PAL_VIVID. At three pixels of arc that is not
two colours, it is one colour with a slight change of mind, and the tile above shows it: the Snow palette ring at
sixteen reads as a brown circle.</p>
<p>Between the other two, PAL_VIVID wins on both numbers: ${n2(Math.min(worst(PAL_VIVID,TAB_L),worst(PAL_VIVID,TAB_D)))} to 1
worst case against an unknown ground where PAL is ${n2(Math.min(worst(Object.fromEntries(SEATS.map(s=>[s.n,s.c])),TAB_L),worst(Object.fromEntries(SEATS.map(s=>[s.n,s.c])),TAB_D)))},
and 61 units of neighbour separation against 47. PAL&rsquo;s weak point is Solar, a light warm yellow that all but
disappears on a light tab.</p>
<p>And there is an argument in the source that decides it. <code>canon.js</code> says of PAL_VIVID: full chroma,
<b class="inl">chosen to hold on paper and on the black stage both</b>. That is the favicon&rsquo;s exact problem,
written down before the favicon existed. The palette that was made for an unknown ground is the one that should
go on the one surface the product does not own.</p>
<p>The tension, named rather than buried: the house rule is a muted palette argued from autonomic response, and
PAL_VIVID is the opposite of muted. The defence is that the rule governs the surfaces a person sits in front of
for twenty minutes, and a favicon is a sixteen pixel identifier in somebody else&rsquo;s chrome that has to be found at
a glance. Different job, different instrument. It is still his call and it is at the end of this sheet.</p>

<h3>What is recommended, and why</h3>
<p class="k">Equal arcs, touching, one drawing at all three sizes, Root at the bottom climbing the right side,
and PAL_VIVID rather than PAL on the palette measurement above.</p>
<ul>
<li><b class="inl">Because seven cannot alternate around a closed ring.</b> The rhythm he asked for needs an even
count. On seven it leaves ${n2(2*65.45)} degrees of one weight meeting at the seam one way and
${n2(2*36)} the other, and whichever way it is turned the ring has one place where the pattern restarts.</li>
<li><b class="inl">Because the seats are equal in the instrument.</b> Giving three of them twice the arc says
three seats weigh more, which the engine does not say. A colour system that contradicts the model it is drawn
from is a colour system telling a lie quietly.</li>
<li><b class="inl">Because of the sixteen pixel end.</b> Equal gives every seat ${M.rings.equal[16].minSolid}
solid pixels. The alternating readings give the narrow seats ${M.rings.alt_wideodd[16].minSolid} and
${M.rings.alt_narrowodd[16].minSolid}, and at that count a seat is a coloured dot whose hue the antialiasing
drags toward its neighbours.</li>
</ul>
<p>If he wants the rhythm anyway, and it is his to want, the reading to take is
<b class="inl">two, one, two, one, two, one, two</b>: the odd seat takes the wide slot, so Root and Crown are both
wide and the seam falls between two wide arcs, which reads as a deliberate base to the ring rather than as a
stutter. The narrow seats measure ${M.rings.alt_wideodd[16].minSolid} solid pixels at sixteen against
${M.rings.alt_narrowodd[16].minSolid} the other way, so it is also the better of the two on the count.</p>
<p class="who">Petra Nikau on the seam and on the equality of the seats. Sol Amadi on the pixel count and on what
antialiasing does to a hue with three pixels to say it in.</p>`;
module.exports=b;
