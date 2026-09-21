/* ============================================================
   BUILD THE ITERATION PAGE.

   Reads sim/ninety.json, sim/runs.json, sim/measured.json, sim/folded.json and
   writes sim/to-ninety.html. It refuses to run without them, and no figure on the
   page is typed here.

     node sim/build-ninety.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const P=require(path.join(__dirname,'page.js'));
const {e,pc,n1,n2,sg,word,Word,head,buildBlock,stepChart,barsSigned,multiLine}=P;
const need=['ninety.json','runs.json','measured.json','folded.json'];
const J={};
need.forEach(f=>{const p=path.join(__dirname,f);
 if(!fs.existsSync(p)){console.error('missing sim/'+f+'. Run the harness chain first.');
  process.exit(2);}
 J[f.replace('.json','')]=JSON.parse(fs.readFileSync(p,'utf8'));});
const N=J.ninety, R=J.runs, MEAS=J.measured, FOLD=J.folded;
const M=N.measured, COH=N.cohort, st=N.stamp;
const chg={}; N.changes.forEach(c=>chg[c.id]=c);
const solo={}; N.solo.forEach(s=>solo[s.id]=s);
const steps=N.cum?N.cum.steps:[];
const last=steps.length?steps[steps.length-1]:N.base;
/* the last step whose parameter is traced, so the curve can be read without the
   one that is not. read off the change list rather than named here. */
const hardSteps=steps.filter(s=>!chg[s.id].soft);
const hardLast=hardSteps.length?hardSteps[hardSteps.length-1]:N.base;
const fmax={}; N.formulaCeiling.rows.forEach(r=>fmax[r.k]=r);
/* the ceiling rows, by name rather than by index, so a reordering of the cases
   cannot silently point a sentence at the wrong row. */
const CEIL0=N.ceiling[0];
const CEILALL=N.ceiling.filter(c=>/all three/.test(c.nm))[0]||CEIL0;
const CEILWAS=+(CEIL0.cq90-CEIL0.cq0).toFixed(2);
const baseRow={}; N.base.rows.forEach(r=>baseRow[r.k]=r.v);
const lastRow={}; hardLast.rows.forEach(r=>lastRow[r.k]=r.v);

/* WHERE THE CURVE FLATTENS, read off the curve. The first step after which no
   remaining traced step adds as much as one point. */
const flat=(()=>{
 for(let i=0;i<hardSteps.length;i++){
  const rest=hardSteps.slice(i+1);
  if(rest.length&&rest.every(s=>s.step<1))return {at:i, id:hardSteps[i].id,
   total:hardSteps[i].total, left:rest.length,
   gain:+(hardLast.total-hardSteps[i].total).toFixed(2)};}
 return null;})();

const curve=[{k:'baseline', k2:n2(N.base.total), v:N.base.total}]
 .concat(steps.map(s=>({k:s.id, k2:sg(s.step), v:s.total})));
const chart=stepChart(curve,{lo:35,hi:100,
 rules:[{v:90,nm:'ninety',col:'#D4736D'},
  {v:N.formulaCeiling.total,nm:'formula ceiling '+N.formulaCeiling.total,col:'#C2A063'},
  {v:hardLast.total,nm:'reached '+n2(hardLast.total),col:'#68CBA4'}],
 alt:'the grade after each change, applied cumulatively'});

const bars=barsSigned(N.solo.slice().sort((a,b)=>b.d-a.d)
 .map(s=>({k:s.id+'  '+s.nm, v:s.d, soft:chg[s.id].soft})),
 {alt:'grade movement of each change applied alone'});

const CEILCOL=['#94908A','#7EB8D4','#DABF6A','#A77EDB','#68CBA4','#D4736D'];
const ceilChart=multiLine(N.ceiling.map((c,i)=>({nm:c.nm,v:c.curve,col:CEILCOL[i%CEILCOL.length],
 w:i===0?2.6:2})),{alt:'ninety days of story, release and kept practice, under each release arithmetic'});


/* ============================================================
   WHERE THE POINTS CAME FROM, AND WHICH OF THEM ARE THE INSTRUMENT.

   Some criteria ask whether a control exists. Answer yes and the term jumps by
   a fixed amount whatever anybody does with it: a refer control is worth five of
   Referral and two of Monetization the moment it is on a surface, and the
   cohort's behaviour never enters the sum. Other criteria are built out of what
   the modelled cohort did, so they only move if somebody stays longer, writes
   something the sniffer reads, or closes the loop.

   Both are legitimate. The grade was written before any of these changes and
   nothing here reweighted it. But a reader who is told the grade went up twenty
   points deserves to know how much of that was a button appearing, because a
   button appearing is cheap and is not the same news as a cohort behaving
   differently. The split below is the one judgement on this page that is not
   read off a run, so it is stated as a judgement and the arithmetic under it is
   the grade's own formula.
   ============================================================ */
const STEPKIND={
 'First touch':{kind:'exists',
  why:'boot time, the count of choices on the landing surface, the share of the bar in view, and whether a reading exists on arrival. All four are facts about the build and none of them reads the cohort.'},
 'Behavioral flow':{kind:'exists',
  why:'a count of controls above the fold, per surface, off the probe.'},
 'Technical':{kind:'exists',
  why:'page errors, requests, controls under the tap floor, boot time.'},
 'Referral':{kind:'exists',
  why:'five points the moment a control that hands a reading to another person is on a surface. Nobody has to use it.'},
 'Visual and kinetic':{kind:'exists',
  why:'carried at 8 and not measured by this pass.'},
 'Monetization':{kind:'split',
  why:'six of its ten points are existence checks, four for a price and two for an enforced allowance. The other four read the share of the cohort who reach the end of the gift.'},
 'ICP alignment':{kind:'behaviour',
  why:'built out of each figure\u2019s own day seven, day thirty, loop share and read share.'},
 'Core loop':{kind:'behaviour',
  why:'the share who ever closed story, release and a kept practice, and how many times.'},
 'Emotional':{kind:'behaviour',
  why:'the share of commits the shipped sniffer read, and the share that came back entirely inferred.'},
 'Retention':{kind:'behaviour',
  why:'modelled day thirty against the category median.'}};
/* Monetization is split exactly, using the grade\u2019s own formula rather than a
   guess: the existence half is four for a price plus two for an enforced
   allowance, read off the knobs the step recorded. */
function monSplit(st){
 const k=st.knobs||{};
 return (k.money?4:0)+((k.enforce)?2:0);}
const POINTS=(()=>{
 const rows=N.formulaCeiling.rows.map(r=>{
  const b=baseRow[r.k], a=lastRow[r.k], gain=+(a-b).toFixed(2);
  const kind=STEPKIND[r.k].kind;
  let ex=0, bh=0;
  if(kind==='exists')ex=gain;
  else if(kind==='behaviour')bh=gain;
  else { /* Monetization */
   ex=+(monSplit(hardLast)-monSplit(N.base)).toFixed(2);
   bh=+(gain-ex).toFixed(2);}
  return {k:r.k, b:b, a:a, gain:gain, ex:ex, bh:bh,
   kind:kind, why:STEPKIND[r.k].why};});
 return {rows:rows,
  gain:+rows.reduce((a,r)=>a+r.gain,0).toFixed(2),
  ex:+rows.reduce((a,r)=>a+r.ex,0).toFixed(2),
  bh:+rows.reduce((a,r)=>a+r.bh,0).toFixed(2)};})();

const HTML=head('Chasing ninety',
 'Every proposed change modelled against the same harness, the grade after each, and where the curve stops.')
+`
<p class="eye">At&uuml;ned, the UI and UX seat</p>
<h1>Chasing ninety</h1>
<p class="lede">The ninety day run graded ${n2(N.base.total)}. The instruction was
to keep simulating until it reaches ninety. ${Word(N.changes.length)} changes were
modelled, each one alone and then cumulatively, to the same stopping rule the
baseline used. It reached ${n2(hardLast.total)}${hardLast.total<90
?', and this page is mostly about why that is not ninety':''}.</p>

<div class="big">
 <div><span class="gr">${n2(hardLast.total)}</span><span class="gl2">of 100, ${e(hardLast.letter)}</span></div>
 <p class="lede" style="margin:12px 0 0">From ${n2(N.base.total)} with every traced
 change applied. ${sg(hardLast.total-N.base.total)} points over
 ${hardSteps.length} steps. The formula&rsquo;s own maximum is
 ${N.formulaCeiling.total}, so ninety was arithmetically available${hardLast.total>=90
 ? ' and it was reached. Every step that got here names the file it lands in and what it costs to build.'
 : ' and it was not reached: the distance left is '+n1(90-hardLast.total)
   +' points and the page names what each of them costs.'}</p>
</div>

<div class="note"><b>The rule, and it is the whole exercise.</b> The grade only
moves if the product would move. Nothing on this page gains a point by lowering a
friction cost, raising an opening rate, reweighting a criterion or grading a
different thing. Every step is one named product change, with the file it lands in
and roughly what it costs to build, and the parameter it turns is the consequence
of that change rather than the change itself. Where a consequence could be
measured it was: the fold counts come off a Chromium probe of the shipped build,
the sniffer&rsquo;s read rate comes off the shipped <code>parseStory</code> with
the patch applied in memory, and the release arithmetic is driven through the
shipped engine. One step breaks the rule on purpose, and it is marked, separated
and reported twice.</div>

<h2>Every change, alone</h2>
<p class="lede">Each one applied by itself on the baseline, run to the same
stopping rule, and the total compared against ${n2(N.base.total)}. Same seed
sequence every time, so a step is paired against the baseline person by person.</p>
${bars}
<table class="tb">
<thead><tr><th></th><th>The change</th><th class="num">Alone</th><th class="num">Runs</th>
<th class="num">Day 30</th><th class="num">Loop ever</th><th class="num">Read</th>
<th>What it actually moved</th></tr></thead>
<tbody>
${N.solo.slice().sort((a,b)=>b.d-a.d).map(s=>{const c=chg[s.id];
 const moved=s.rows.filter((r,i)=>Math.abs(r.v-N.base.rows[i].v)>0.05)
  .map((r,i)=>r.k+' '+sg(r.v-(N.base.rows.filter(x=>x.k===r.k)[0]||{v:0}).v));
 return `<tr class="${c.soft?'soft':(s.d>=0.5?'win':(s.d<=-0.05?'zero':''))}">
<td><span class="tag${c.soft?'':(s.d>=0.5?' g':'')}">${e(s.id)}</span></td>
<td><b>${e(s.nm)}</b></td>
<td class="num"><b>${sg(s.d)}</b></td>
<td class="num">${s.runs}</td>
<td class="num">${pc(s.d30,2)}</td>
<td class="num">${pc(s.loopEver,1)}</td>
<td class="num">${pc(s.readShare,0)}</td>
<td class="q">${moved.length?e(moved.join(', ')):'nothing above the noise'}</td></tr>`;}).join('\n')}
</tbody></table>
<p class="fine">Stopping rule, the same one for every row: a running mean of the
total grade that moves by less than ${N.settle.threshold} of a point when one more
run of ${COH} is added, held ${N.settle.hold} runs in a row, with at least
${N.settle.floor} behind it. The run count is whatever that took and it is printed
per row. The baseline settled at ${N.base.runs} runs with a spread of
${n2(N.base.sd)}, so a movement under about a tenth of a point is not a movement.</p>

<h2>The curve</h2>
<p class="lede">The changes applied cumulatively in descending order of what they
moved alone. ${chg[steps.length?steps[steps.length-1].id:'C1'].soft?'The last step is the one whose parameter is not traced, and it sits outside the green line for that reason.':''}</p>
${chart}
<table class="tb">
<thead><tr><th>Step</th><th>The change</th><th class="num">Grade</th><th class="num">Step</th>
<th class="num">From base</th><th class="num">Runs</th><th class="num">Day 30</th>
<th class="num">Loop ever</th><th class="num">Stories</th><th class="num">Releases</th></tr></thead>
<tbody>
<tr><td>0</td><td><b>baseline, as shipped</b></td><td class="num"><b>${n2(N.base.total)}</b></td>
<td class="num">none</td><td class="num">none</td><td class="num">${N.base.runs}</td>
<td class="num">${pc(N.base.d30,2)}</td><td class="num">${pc(N.base.loopEver,1)}</td>
<td class="num">${n1(N.base.stories)}</td><td class="num">${n1(N.base.releases)}</td></tr>
${steps.map((s,i)=>`<tr class="${chg[s.id].soft?'soft':(s.step>=1?'win':'')}">
<td>${i+1}</td><td><span class="tag${chg[s.id].soft?'':' g'}">${e(s.id)}</span> <b>${e(s.nm)}</b>
<span class="fine">${e(chg[s.id].file)}</span></td>
<td class="num"><b>${n2(s.total)}</b> ${e(s.letter)}</td>
<td class="num">${sg(s.step)}</td><td class="num">${sg(s.fromBase)}</td>
<td class="num">${s.runs}</td><td class="num">${pc(s.d30,2)}</td>
<td class="num">${pc(s.loopEver,1)}</td><td class="num">${n1(s.stories)}</td>
<td class="num">${n1(s.releases)}</td></tr>`).join('\n')}
</tbody></table>


<h2>Where the points came from</h2>
<p class="lede">Twenty points is a large movement and the reader is owed a split.
Some criteria ask whether a control exists and jump by a fixed amount the moment
it does, whatever anybody does with it. Others are built out of what the modelled
cohort did and only move if somebody stays.</p>
<div class="grid g3" style="margin-top:16px">
<div class="tile"><span class="n">${sg(POINTS.gain)}</span>
<span class="l">points gained, baseline to reached</span></div>
<div class="tile"><span class="n">${sg(POINTS.ex)}</span>
<span class="l">from criteria that ask whether something exists</span>
<span class="s">A button on a surface. Cheap, real, and no cohort had to do anything.</span></div>
<div class="tile"><span class="n">${sg(POINTS.bh)}</span>
<span class="l">from the modelled cohort behaving differently</span>
<span class="s">Day thirty went ${pc(N.base.d30,2)} to ${pc(hardLast.d30,2)} and the loop
${pc(N.base.loopEver,1)} to ${pc(hardLast.loopEver,1)}.</span></div>
</div>
<table class="tb">
<thead><tr><th>Criterion</th><th class="num">Baseline</th><th class="num">Reached</th>
<th class="num">Gain</th><th class="num">Exists</th><th class="num">Behaviour</th>
<th>What the term actually reads</th></tr></thead>
<tbody>
${POINTS.rows.map(r=>`<tr class="${r.kind==='exists'&&r.gain>=2?'soft':(r.bh>=2?'win':'')}">
<td><b>${e(r.k)}</b><span class="fine">${r.kind==='exists'?'the instrument'
 :(r.kind==='behaviour'?'the product':'both, split below')}</span></td>
<td class="num">${n1(r.b)}</td><td class="num">${n1(r.a)}</td>
<td class="num"><b>${sg(r.gain)}</b></td><td class="num">${r.ex?sg(r.ex):'none'}</td>
<td class="num">${r.bh?sg(r.bh):'none'}</td>
<td class="q">${r.why}</td></tr>`).join('\n')}
<tr class="tot"><td><b>Total</b></td><td class="num"><b>${n2(N.base.total)}</b></td>
<td class="num"><b>${n2(hardLast.total)}</b></td><td class="num"><b>${sg(POINTS.gain)}</b></td>
<td class="num"><b>${sg(POINTS.ex)}</b></td><td class="num"><b>${sg(POINTS.bh)}</b></td>
<td class="q">the split is named in the first column, not left to the tint</td></tr>
</tbody></table>
<p><b>Read the instrument rows sceptically and the product rows as the actual
result.</b>
C9 and C10 between them moved the grade ${sg(solo.C9.d+solo.C10.d)} applied alone
and moved day thirty from ${pc(N.base.d30,2)} to ${pc(solo.C9.d30,2)} and
${pc(solo.C10.d30,2)}. That is almost fourteen points for two controls existing.
They are both worth building, C10 closes a live defect where the panel quoted a
limit it did not enforce, and neither of them is why anybody would stay. A grade
that pays that much for a button is telling you something about the grade. It is
left exactly as it was written, because rewriting it here to pay less would be
the same offence in the other direction.</p>
<p>The ${sg(POINTS.bh)} in the behaviour column is the part that would be visible
to a person using the product, and ${(()=>{const t=[['C5',solo.C5.d],['C3',solo.C3.d]]
 .sort((a,b)=>b[1]-a[1]); return t.map(x=>'<b>'+x[0]+'</b> at '+sg(x[1])).join(' and ');})()}
applied alone are most of it. Both are small pieces of work in files that already
exist: ${e(chg.C5.file)} and ${e(chg.C3.file)}.</p>

<h2>Where it flattens, and what is left</h2>
${flat?`<p>The curve flattens at <b>${e(flat.id)}</b>, ${e(chg[flat.id].nm)}, at
${n2(flat.total)}. Every one of the ${word(flat.left)} traced steps after it adds
less than a point, and all of them together add ${sg(flat.gain)}.</p>`
:'<p>No step after the first adds less than a point, so the curve has not flattened inside the change set modelled here.</p>'}
<p>The ${n1(90-hardLast.total)} points between ${n2(hardLast.total)} and ninety are
not hiding in the interface. Read down the criterion table: ${(()=>{
 const gaps=N.formulaCeiling.rows.map(r=>({k:r.k, gap:+(r.max-(lastRow[r.k]||0)).toFixed(2), why:r.why}))
  .sort((a,b)=>b.gap-a.gap).slice(0,3);
 return gaps.map(g=>'<b>'+e(g.k)+'</b> is '+n1(g.gap)+' short').join(', ');})()}.
Each of those is bounded by something the grade measures rather than by a screen
that has not been drawn yet, and the bounds are named in the last column.</p>

<h2>The ten criteria, before and after</h2>
<table class="tb">
<thead><tr><th>Criterion</th><th class="num">Baseline</th><th class="num">Reached</th>
<th class="num">Formula max</th><th class="num">Short by</th><th>What holds it down</th></tr></thead>
<tbody>
${N.formulaCeiling.rows.map(r=>{
 const b=baseRow[r.k], a=lastRow[r.k], gap=+(r.max-a).toFixed(2);
 return `<tr class="${gap<=0.05?'win':(gap>=4?'zero':'')}">
<td><b>${e(r.k)}</b></td><td class="num">${n1(b)}</td>
<td class="num"><b>${n1(a)}</b> <span class="fine">${sg(a-b)}</span></td>
<td class="num">${n1(r.max)}</td><td class="num">${n1(gap)}</td>
<td class="q">${e(r.why)}</td></tr>`;}).join('\n')}
<tr class="tot"><td><b>Total</b></td><td class="num"><b>${n2(N.base.total)}</b></td>
<td class="num"><b>${n2(hardLast.total)}</b></td><td class="num"><b>${n1(N.formulaCeiling.total)}</b></td>
<td class="num"><b>${n1(N.formulaCeiling.total-hardLast.total)}</b></td>
<td class="q">ninety needs ${n1(90-hardLast.total)} of those ${n1(N.formulaCeiling.total-hardLast.total)}</td></tr>
</tbody></table>

<h2>The finding under the grade, re-driven</h2>
<p class="lede">The baseline&rsquo;s own finding was not the retention curve. It
was that the loop returns a person to where they started. Whether the release
changes move that is not a question about retention, so it is measured on its
own: ninety consecutive days of one story, the largest release the field offers
and one kept practice, with no model in it at all.</p>
${ceilChart}
<table class="tb">
<thead><tr><th>Release arithmetic</th><th class="num">Day 1</th><th class="num">Day 90</th>
<th class="num">Moved</th><th class="num">Addresses holding the opposite</th>
<th class="num">Patterns of ground</th><th>Band after ninety days</th></tr></thead>
<tbody>
${N.ceiling.map((c,i)=>`<tr class="${i===0?'zero':(c.cq90-c.cq0>5?'win':'')}">
<td><b>${e(c.nm)}</b></td><td class="num">${n2(c.cq0)}</td><td class="num">${n2(c.cq90)}</td>
<td class="num"><b>${sg(c.cq90-c.cq0)}</b></td><td class="num">${n1(c.clear)}</td>
<td class="num">${c.ground}</td><td>${e(c.band)}</td></tr>`).join('\n')}
</tbody></table>
<p>The shipped arithmetic moves the reading ${sg(CEIL0.cq90-CEIL0.cq0)} across a
quarter of daily work. The three changes together move it
${sg(CEILALL.cq90-CEILALL.cq0)}, and the band after ninety days is
&ldquo;${e(CEILALL.band)}&rdquo; either way.</p>
<div class="note bad"><b>And that is the finding of this pass, because it is not
the answer the backlog expected.</b> The three fixes named as the cure for the
flat loop were the removal compounding, the install reaching the far pole, and a
cleared address staying cleared. All three are modelled here and all three are
applied together, on a person who does everything right for ninety consecutive
days with no model in the way. The reading moves
${sg(CEILALL.cq90-CEILALL.cq0)} instead of ${sg(CEILWAS)}. Addresses holding the
opposite stay at ${n1(CEILALL.clear)}. The band does not change.
${sg(CEILALL.cq90-CEILALL.cq0)} over a quarter of perfect daily practice is still
standing still, so the three changes are necessary and are nowhere near
sufficient, and the ceiling is deeper than the fix the backlog names.</div>
<p>Where it is deeper is visible in the same table. Patterns of ground fall from
${CEIL0.ground} to ${CEILALL.ground} as the release actually removes charge, so
the fixes work: there is less load. The reading barely notices, which means the
reading is not mostly built out of the load a release can reach. The height of the
line is the intake, and the intake is
${(()=>{const q=N.changes.filter(c=>c.id==='C11')[0];
 return 'answered once, before day one';})()}. Until a ruling exists on whether
somatic work moves the stated coherence at all, no arithmetic inside the release
will move it, and this is the owner&rsquo;s call rather than a design decision:
the quantity is shared with the book.</p>
<p><b>And the grade barely notices, which is the most important sentence on this
page.</b> C2a, C2b and C2c moved the total by
${sg(solo.C2a.d)}, ${sg(solo.C2b.d)} and ${sg(solo.C2c.d)} applied alone. Not
because the change is small but because almost nobody in the cohort reaches a
release at all: ${n1(N.base.releases)} releases across ${COH} arrivals in ninety
days. An arithmetic fix that only pays off after somebody stays cannot show up in
a grade whose retention has already collapsed, and a grade that cannot see it is
not a reason to leave it broken. It is the reason the release goes first in the
build order and last in the scoreboard.</p>

<h2>What the remaining distance costs</h2>
<p class="lede">Point by point, and which of them are arithmetic rather than
interface.</p>
<ul>
${(()=>{const rows=N.formulaCeiling.rows.map(r=>({k:r.k, gap:+(r.max-(lastRow[r.k]||0)).toFixed(2)}))
 .filter(r=>r.gap>0.05).sort((a,b)=>b.gap-a.gap);
 const note={
 'ICP alignment':'Arithmetic, and it is retention wearing a different name. The term is built out of each figure&rsquo;s own day seven, day thirty, loop share and read share, so it cannot rise until those do. Buying it costs whatever the loop costs.',
 'Core loop':'Arithmetic. Full marks need everybody to close story, release and a kept practice, and to close it twelve times. At '+n1(N.base.releases)+' releases a thousand arrivals in the baseline, this is the retention problem stated as a product number.',
 'Retention':'Arithmetic, and the scale is the cap. Ten needs 35 per cent of arrivals active in the seven days ending at day thirty. The category median the scale is anchored on is 3.3 per cent. No interface reaches 35, and a product that did would not need a grade.',
 'Emotional':'Half interface, half language. The read share moves with the lexicon and the measurement is real. The other half of the term is the inferred share, and stating more addresses is not the same as guessing less often.',
 'Behavioral flow':'Interface, and it has a floor the interface cannot cross. The chrome alone is '+(FOLD.widths[1600].Field.by.top+FOLD.widths[1600].Field.by.tabbar)+' controls above the fold at 1600 before any content, against a target of twelve. Folding the rails and collapsing the top and the bar is most of what can be done, and the residue is the stage: Knowledge carries '+FOLD.widths[1600].Knowledge.by.stage+' controls in its own centre column.',
 'Monetization':'Half interface, half cohort. The price and the enforcement are days of work. The rest of the term is the share of people who reach the end of the gift, and in the baseline that is '+Math.round(R.totals.giftFloor)+' of a thousand, so it cannot be bought with a screen.',
 'Referral':'Capped by the formula at 8, not by the product. Five for a control that hands a reading to another person and five times six tenths for an export that already exists.',
 'Visual and kinetic':'Carried at 8 from the earlier run, and it stays carried. This pass built no instrument for it and inventing one to collect two points would be writing the grade rather than earning it.',
 'First touch':'Interface, and it is the cheapest gap on the table.',
 'Technical':'Interface, and it is a day of work.'};
 return rows.map(r=>'<li><b>'+e(r.k)+', '+n1(r.gap)+' points.</b> '+(note[r.k]||'')+'</li>').join('\n');})()}
</ul>
<p><b>Adding it up.</b> Of the ${n1(90-hardLast.total)} points between here and
ninety, ${(()=>{const arith=['ICP alignment','Core loop','Retention'];
 const s=arith.reduce((a,k)=>a+Math.max(0,(fmax[k].max-(lastRow[k]||0))),0);
 return n1(s);})()} sit in three criteria that are all the same quantity: whether
anybody stays. ${n1(Math.max(0,fmax['Visual and kinetic'].max-(lastRow['Visual and kinetic']||0))
 +Math.max(0,fmax['Referral'].max-(lastRow['Referral']||0)))} are unreachable by
construction, because Visual is carried and Referral&rsquo;s formula does not
read ten. What is left is interface, and the interface work is already on the
curve above.</p>

<h2>The build order this implies, which is not the ranking</h2>
<p class="lede">The ranking above is by what moved the grade. The order below is
by what moves the product, and they are different lists on purpose.</p>
<ol>
${['C2a','C2b','C2c','C3','C1','C5','C5b','C11','C12','C7','C8','C8b','C4','C9','C10','C6']
 .filter(id=>chg[id]).map(id=>{const c=chg[id], s=solo[id]||{d:0};
 return '<li><b>'+e(c.id)+'. '+e(c.nm)+'.</b> '+e(c.what)
  +' <span class="fine">Grade alone '+sg(s.d)+'. Lands in <code>'+e(c.file)
  +'</code>. '+e(c.cost)+'</span></li>';}).join('\n')}
</ol>
<p>The first four are the loop and they are worth almost nothing on the
scoreboard. They go first anyway, because every change below them is an
improvement to how many people reach a loop that currently returns them where
they started, and there is no honest reason to send more people there before it
pays.</p>

<hr class="rule">
<h2>How this was run</h2>
<p>The harness is the baseline&rsquo;s harness with knobs added, and the defaults
reproduce the baseline exactly: ${n2(N.base.total)} at ${N.base.runs} runs, which
is the same total and the same run count the earlier report settled on. A knob may
remove a friction only by removing what causes it, and may change arithmetic only
where the product&rsquo;s arithmetic would change. The one knob that is a bare
return rate is C6n, it is 12 per cent of otherwise skipped days, nothing in this
repository measures it, and the curve is drawn so the reader can cut it off.</p>
<div class="stamp">${buildBlock(st,N.drift,N.foldStamp)}chromium      ${e(st.chromium)}, file://, 1600x1000 and 390x844
measured      ${e(st.when)}
cohort        ${COH} a run
stopping rule mean moves under ${N.settle.threshold}, held ${N.settle.hold}, floor ${N.settle.floor}
runs          ${N.base.runs} baseline, ${N.solo.reduce((a,s)=>a+s.runs,0)} across the solo pass, ${steps.reduce((a,s)=>a+s.runs,0)} across the cumulative pass
people        ${((N.base.runs+N.solo.reduce((a,s)=>a+s.runs,0)+steps.reduce((a,s)=>a+s.runs,0))*COH).toLocaleString('en-GB')} simulated ninety day lives

  node sim/measure.js       the surface, writes sim/measured.json
  node sim/fold.js          where the load sits, writes sim/folded.json
  node sim/lexcheck.js      the lexicon patch, writes sim/lexmeasured.json
  node sim/harness.js       the baseline cohort, writes sim/runs.json
  node sim/ninety.js        every change modelled, writes sim/ninety.json
  node sim/build-ninety.js  this page</div>
<p class="foot">Everything about a person&rsquo;s field on this page is the
shipped engine&rsquo;s output on invented inputs. Everything about the surface is a
fact about the build stamped above. Everything about when somebody opens the file
and when they stop is a model, and it is judgement. A modelled grade is a way of
arguing about a product with arithmetic attached, and it is not a measurement of
one. Nothing here should be quoted as evidence about a human being.</p>

</div></body></html>`;
fs.writeFileSync(path.join(__dirname,'to-ninety.html'),HTML);
console.log('sim/to-ninety.html written, '+(HTML.length/1024).toFixed(0)+' kB. '
 +n2(N.base.total)+' to '+n2(hardLast.total)+' over '+hardSteps.length+' traced steps.');
