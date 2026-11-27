/* round3.html. Spacing, the favicon ring, and the dots on paper. */
const fs=require('fs'), path=require('path');
const B=require(path.join(__dirname,'r2build.js'));
const { M, MOUTH, ALL, SIZES, n2, pxAt, emOf, diffTile, oneLetter, wordSVG,
        png, page, R, SEATS, SEATS_DOC, LIGHT, ratio, DOT_DX, DOT_CY, DOT_R, W } = B;

/* the grey, and it is derived rather than picked. see section 5. */
const GREY = '#3A3733', VANISH = '#6B6863';
const PAL_LIGHT = { Root:'#9B4B47', Sacral:'#8E6231', Solar:'#7E6C29', Heart:'#2A7A5C',
  Throat:'#2C6F88', '3rd Eye':'#4C5F9E', Crown:'#6E5490' };
const PAL_VIVID = { Root:'#F02E3C', Sacral:'#FF7A00', Solar:'#C79200', Heart:'#00A85C',
  Throat:'#0091C4', '3rd Eye':'#3D5AFE', Crown:'#9B27E8' };
const TAB_LIGHT = '#F1F3F4', TAB_DARK = '#202124';
const worst = (pal, g) => Math.min.apply(null, Object.keys(pal).map(k => ratio(pal[k], g)));

const PAIRS = [['a1 t1','a t'],['t1 u1','t u'],['u1 n1','u n'],['n1 e1','n e'],['e1 d1','e d']];
const geom = M.words.A.joints;
let b='';

b+=`<div class="nav"><a href="round2.html">Round 2: the nine cuts</a>
<a href="index.html">The first study</a></div>`;

/* ---------------- 1. the rendered joint ---------------- */
b+=`<hr><h2>1. The tightest joint in this mark is one pixel, and in the top bar two of them are zero</h2>
<p class="k">His words: &ldquo;the spacing is very important. So touching, not touching, these things are very
critical.&rdquo; So the first thing measured was whether the mark as it stands is touching. It is.</p>
<p>Two numbers per joint, because they answer two different questions. <b class="inl">Solid</b> counts pixels the
rasteriser filled past half opacity, which is ink a person reads as ink. <b class="inl">Any</b> counts any ink at
all, including the antialiased edge. When the second one reaches zero the two letters are touching in the render
whatever the geometry says, because there is no pixel of ground between them.</p>
<div class="tw"><table><tr><th>Joint</th><th>Geometry, units</th><th>In em</th>
${SIZES.map(s=>`<th>${s.n} ${s.asc}, solid / any</th>`).join('')}</tr>
${PAIRS.map(([k,lab],i)=>{
  const g=geom[i];
  return `<tr><td>${lab}</td><td class="n">${g.gap}</td><td class="n">${emOf(g.gap)}</td>`
   +SIZES.map(s=>{const r=M.rendered['A@'+s.k][i];
     return `<td class="n ${r.any<=0?'lo':r.any<=1?'':'ok'}">${r.solid} / ${r.any}</td>`;}).join('')+'</tr>';}).join('')}
</table></div>
<p class="k">In the top bar both the t to u joint and the e to d joint measure zero pixels of ground. They
are touching.</p>
<p>The geometry is not wrong. The joint was solved by measured background area against a target of 3400 square
units with a floor of 9 units, and the floor is what the e to d joint is sitting on. Nine units is
${emOf(9)} em, which is ${pxAt(9,32)} pixels in the funnel heading, ${pxAt(9,26)} on the boot card and
${pxAt(9,13)} in the top bar. A gap of nine tenths of a pixel has nowhere to land: the rasteriser puts half of it
on one letter and half on the other and the ground never appears.</p>
<div class="row">
<div class="ax"><span class="lbl">the landed mark, top bar, six times. look at e d</span>${png('A@bar',6)}</div>
<div class="ax"><span class="lbl">the same on the boot card, three times</span>${png('A@boot',3)}</div></div>
<p class="who">Bjorn Haraldsson. The area solve is still the right method: what it cannot know is the pixel grid,
and the floor is the only place the grid gets a say.</p>`;

/* ---------------- 2. the tracking ladder ---------------- */
const TR=[-12,-9,-6,-3,0,3,6,9,12,18];
b+=`<hr><h2>2. The tracking ladder, drawn at the sizes the mark is used at</h2>
<p>One knob. Every letter after the first moves right by the tracking value times its position, so the mark opens
or closes evenly and the joints keep their relative order. Tracking is quoted in units and in em, and em here is
the mark&rsquo;s own body of 130 units, which is the ascender box.</p>
<div class="tw"><table><tr><th>Tracking</th><th>In em</th><th>Mark width, units</th>
${PAIRS.map(([k,lab])=>`<th>${lab}</th>`).join('')}<th>Top bar, tightest joint, any ink</th></tr>
${TR.map(t=>{const x=M.tracking[String(t)], r=M.rendered[(t?'A'+t:'A')+'@bar'];
  const tight=r?Math.min.apply(null,r.map(j=>j.any)):null;
  return `<tr><td class="n">${t>0?'+':''}${t}</td><td class="n">${t<0?'−':''}${emOf(Math.abs(t))}</td>`
   +`<td class="n">${x.total}</td>`
   +x.joints.map(j=>`<td class="n ${j.gap<=0?'lo':j.gap<6?'':'ok'}">${j.gap}</td>`).join('')
   +`<td class="n ${tight<=0?'lo':tight>=1?'ok':''}">${tight===null?'':tight+' px'}</td></tr>`;}).join('')}
</table></div>
<p class="k">Closing the mark, the e and the d touch first, at ${M.tracking['-9'].joints[4].gap} units of gap at a
tracking of &minus;9. The t and the u are second.</p>
<p>Opening it, the top bar needs <b class="inl">+6</b> before every joint has a pixel of ground in it, and
<b class="inl">+9</b> before the tightest joint has a solid pixel. At +6 the mark is ${M.tracking['6'].total}
units wide against ${M.tracking['0'].total}, which is ${n2(100*(M.tracking['6'].total-M.tracking['0'].total)/M.tracking['0'].total)} per cent,
and in a thirteen pixel bar that is ${n2((M.tracking['6'].total-M.tracking['0'].total)*13/130)} of a pixel of extra width.</p>
<div class="row">
${[-9,-6,-3,0,3,6,9,12].map(t=>`<div class="ax"><span class="lbl">tracking ${t>0?'+':''}${t}, top bar, six times</span>${png('T'+t+'@bar',6)}</div>`).join('')}
</div>
<div class="row">
${[-6,0,6,12].map(t=>`<div class="ax"><span class="lbl">tracking ${t>0?'+':''}${t}, boot card, three times</span>${png('T'+t+'@boot',3)}</div>`).join('')}
</div>
<p class="who">Bjorn Haraldsson. And the finding that comes with it: the mark needs two trackings, one for the
boot card and one for the bar, or one loose tracking that is visibly loose where there is room for it. That is a
question and it is at the end of this sheet.</p>`;

/* ---------------- 3. touching and not touching ---------------- */
function stateRow(pairIdx, label){
  const states=[[12,'open, the mark at +12'],[6,'open, the mark at +6'],[0,'as it stands'],
    [-6,'closed, the mark at −6'],[-9,'touching, the mark at −9'],[-12,'overlapped, at −12']];
  let h=`<h3>${label}</h3><div class="tw"><table><tr><th>State</th><th>Gap, units</th><th>Gap, em</th>`
   +SIZES.map(s=>`<th>${s.n} ${s.asc}, solid / any</th>`).join('')+`<th>Gap in px, ${SIZES.map(s=>s.asc).join(' / ')}</th></tr>`;
  states.forEach(([t,lab])=>{ const x=M.tracking[String(t)].joints[pairIdx];
    const key=(t?'A'+t:'A')+'@';
    h+=`<tr><td>${lab}</td><td class="n ${x.gap<=0?'lo':''}">${x.gap}</td><td class="n">${x.gap<0?'−':''}${emOf(Math.abs(x.gap))}</td>`
     +SIZES.map(s=>{const r=M.rendered[key+s.k][pairIdx];
       return `<td class="n ${r.any<=0?'lo':r.any>=2?'ok':''}">${r.solid} / ${r.any}</td>`;}).join('')
     +`<td class="n">${SIZES.map(s=>pxAt(x.gap,s.asc)).join(' / ')}</td></tr>`;});
  return h+'</table></div>';
}
b+=`<hr><h2>3. Touching and not touching, as two states of one cut</h2>
<p>Two pairs in this mark decide when it closes, and they are not the two the eye picks. The t and the u look
tight because a crossbar and a stem leave a tall narrow slot. The e and the d look open because the e&rsquo;s aperture
puts white on the wrong side of the joint. Measured, the e to d joint is the tightest in the mark at every
tracking and it is the first to close.</p>
<p>The state column names the whole mark&rsquo;s tracking. What this particular pair is doing at that tracking is the
gap column beside it, which is the point: one knob, and the five joints reach zero at five different settings.</p>
${stateRow(4,'The e and the d')}
${stateRow(1,'The t and the u')}
<p>Read the two zero columns together. At the top bar, as the mark stands today, the e and the d are touching and
the t and the u have no ground between them either. Nothing needs to be closed to get there.</p>
<div class="row">
<div class="ax"><span class="lbl">touching. the mark at &minus;9, boot card, three times</span>${png('T-9@boot',3)}</div>
<div class="ax"><span class="lbl">not touching. the mark at +6, boot card, three times</span>${png('T6@boot',3)}</div></div>
<div class="row">
<div class="ax"><span class="lbl">touching, top bar, six times</span>${png('T-9@bar',6)}</div>
<div class="ax"><span class="lbl">not touching, top bar, six times</span>${png('T6@bar',6)}</div></div>
<p class="who">Bjorn Haraldsson measured. Petra Nikau argues that the e to d joint should be allowed to touch on
purpose at the small end, because a joint that closes by accident reads as a defect and a joint that closes by
design reads as a ligature, and the second one is a decision somebody made. It is drawn both ways above.</p>`;
module.exports=b;
