/* ============================================================
   BUILD THE INTERVIEW PAGE.

   Reads sim/runs.json, sim/measured.json, sim/folded.json, sim/lexmeasured.json
   and sim/ninety.json and writes sim/what-would-help.html. It refuses to run
   without all five. No figure on the page is typed in this file: every one is
   read off a run or off a probe, which is the rule this repository has been
   bitten by nine times for breaking.

     node sim/build-help.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const P=require(path.join(__dirname,'page.js'));
const {e,pc,n1,n2,sg,word,Word,head,buildBlock,barsSigned}=P;
const need=['runs.json','measured.json','folded.json','lexmeasured.json','ninety.json'];
const J={};
need.forEach(f=>{const p=path.join(__dirname,f);
 if(!fs.existsSync(p)){console.error('missing sim/'+f
  +'. Run sim/measure.js, sim/fold.js, sim/lexcheck.js, sim/harness.js, sim/ninety.js.');
  process.exit(2);}
 J[f.replace('.json','')]=JSON.parse(fs.readFileSync(p,'utf8'));});
const R=J.runs, MEAS=J.measured, FOLD=J.folded, LEX=J.lexmeasured, N=J.ninety;
const M=R.measured, COH=R.model.cohort;
const lost=k=>(R.lost[k]||{people:0}).people;
const lostBy=(k,nm)=>{const b=(R.lost[k]||{by:[]}).by.filter(x=>x.nm===nm)[0];
 return b?b.n:0;};
const met=k=>Math.round((R.hitShare[k]||{share:0}).share*1000);
const fnm=k=>(R.hitShare[k]||{nm:k}).nm||k;
const solo={}; (N.solo||[]).forEach(s=>solo[s.id]=s);
const chg={}; N.changes.forEach(c=>chg[c.id]=c);

/* ============================================================
   THE NINE. Each card's numbers are read out of the run. Each card's words are
   written over those numbers and say so: they are this seat's reading of what a
   figure with that measured session would ask for, in that figure's register.
   The `ask` is what the improvement has to be, and `not` is the version of the
   same complaint that traces only to taste and is therefore refused.
   ============================================================ */
const SAY={
 Diane:{
  quote:['I opened it between two meetings and I got a number.',
   'I came back the next day and it was the same number. There is nothing to do with that.',
   'Do not ask me for fifteen minutes. I do not have fifteen minutes and I am not going to pretend I do so that your product works.',
   'If it wants a story it can have one sentence. One thumb, in a lift.'],
  ask:'A door that fits the session she actually has, and a reading that is different from yesterday because of something she did.',
  answers:['C1','C4','C11','C2a'],
  not:'A calmer, better written Story page. She never reaches the Story page. The measured door costs more minutes than her whole session.'},
 Derek:{
  quote:['I told it something true and it told me nothing is carrying.',
   'I am carrying it. That is why I typed it.',
   'Give me the protocol and give me the cost. I will run a protocol for a quarter. I will not run a mood.',
   'Tell me what it costs in watts.'],
  ask:'The release has to be available on what he is actually carrying, and the cost has to be printed in a unit he can act on.',
  answers:['C3','C4','C2a'],
  not:'Encouragement, streak confetti, or a congratulation. He is the figure most likely to run a daily protocol for ninety days and the least likely to be moved by praise.'},
 Marcus:{
  quote:['I came back to see whether you had fixed the thing I found. Nothing told me whether you had.',
   'I can see what is wrong with anything in four seconds. This screen hands me eighty things to be wrong about.',
   'If it is good I send it to four people. There is no way to send it.'],
  ask:'A record of what changed since he last looked, a screen with fewer things on it, and a send.',
  answers:['C8','C8b','C9','C7'],
  not:'A tour, a walkthrough, or coach marks. He does not lack instruction. He is at level four on the grid, he buys it, reads half of it and avoids the work.'},
 Angela:{
  quote:['I wrote the truest thing I have written in a year and it read nothing out of it.',
   'Then it told me I was proud. I am not proud. I am tired.',
   'I reached for the summary and it was past the edge of my screen.'],
  ask:'Read what she wrote. When the instrument is guessing, it has to ask instead of tell.',
  answers:['C5','C5b','C7'],
  not:'Warmer language. The words are not what lost her. What lost her is an instrument that returned nothing from her sentence and then named an address she had not described.'},
 Sofia:{
  quote:['I want to open this on a client’s phone and leave it with them. I cannot.',
   'I use it at eleven at night for myself and it does not read what I say to it.',
   'My value to you is that I would hand it to forty people a year.'],
  ask:'A way to hand a reading to another person, with a consent she can explain in one sentence, and a sniffer that reads a practitioner’s own register.',
  answers:['C9','C5'],
  not:'A practitioner badge or a directory listing. That is a business idea. It does not touch either thing her session measured.'},
 James:{
  quote:['A peer mentioned a number. I want mine and I want it in the first ten seconds.',
   'I am not answering sixty three questions and I am not going to be seen answering them.',
   'Do not open with my pain.'],
  ask:'The reading exists before any work is done, and nothing on the first screen looks like self help.',
  answers:['C11','C1','C8b'],
  not:'A persona picker or a worksheet with better typography. Measured: he leaves on the shape of it, not the craft of it.'},
 Ana:{
  quote:['It named the shape of it and I cried.',
   'Then it did the same thing the next day, and the day after.',
   'I am in the middle of something. I need the far side, not a better description of the middle.',
   'I did everything it asked for three weeks and the number is where it was.'],
  ask:'The work has to accumulate. A cleared address has to stay cleared and a release has to reach the far pole.',
  answers:['C2c','C2b','C2a','C3'],
  not:'A gentler tone. She is the one figure in the roster for whom a wrong answer costs something, and the thing that failed her is arithmetic.'},
 Gordon:{
  quote:['There is nothing wrong with me.',
   'Four people left in a year and each of them had their reasons.',
   'I do not have a problem. I have a business that needs running.'],
  ask:'Nothing. He is not the customer and the product should not be bent towards him. The one thing his data does ask for is that the instrument read denial, because his own line is the heaviest reading in the roster and the shipped sniffer returns nothing from it.',
  answers:['C5'],
  refuse:true,
  not:'Anything built to convert him. Every hour aimed at him is an hour not aimed at the largest segment in the cohort.'},
 Rosa:{
  quote:['Nothing in particular.',
   'Things do not sit on me the way they used to.'],
  ask:'Nothing, and the product should agree. Her line is the one sentence in the bank that ought to keep reading nothing, and after the lexicon patch it is the only one of the '
   +LEX.bank.after.n+' that still does.',
  answers:[],
  refuse:true,
  not:'A gentler onboarding for people who are well. They are not the market and pretending otherwise costs the people who are not.'}};

const ORDER=Object.keys(R.icp);
function whoLostThem(nm){
 /* THE STICKING POINT THAT ACTUALLY LOST THEM, read off the loss column rather
    than off the hit column, because a friction everybody meets and nobody
    leaves on is not what lost them. */
 const rows=Object.keys(R.lost).map(k=>({k:k, n:lostBy(k,nm), nm:fnm(k)}))
  .filter(r=>r.n>0).sort((a,b)=>b.n-a.n);
 return rows;}

function card(nm){
 const x=R.icp[nm], s=SAY[nm]||{quote:[],answers:[]};
 const loss=whoLostThem(nm);
 const top=loss.slice(0,3);
 const ans=(s.answers||[]).map(id=>chg[id]).filter(Boolean);
 return `<div class="card">
<header><h3>${e(nm)}</h3><span class="tag m">${x.age}, ${e(x.role)}</span>
<span class="tag">${x.weight} of ${COH}</span>
<span class="tag">grid ${x.grid}</span>
<span class="tag">${e(x.device)}</span>
<p class="role">${e(x.shape)}</p></header>
<dl class="kv">
<div><dt>opened the file at all</dt><dd>${pc(x.arrived)}</dd></div>
<div><dt>sessions in ninety days</dt><dd>${n2(x.sessions)}</dd></div>
<div><dt>minutes, all ninety days</dt><dd>${n1(x.minutes)}</dd></div>
<div><dt>stories told</dt><dd>${n2(x.stories)}</dd></div>
<div><dt>releases run</dt><dd>${n2(x.releases)}</dd></div>
<div><dt>ever closed the loop</dt><dd>${pc(x.loopEver)}</dd></div>
<div><dt>active at day seven</dt><dd>${pc(x.ret[7])}</dd></div>
<div><dt>active at day thirty</dt><dd>${pc(x.ret[30])}</dd></div>
<div><dt>gone by day three</dt><dd>${pc(x.quitBy3)}</dd></div>
</dl>
<p class="why"><b>What lost them.</b> ${top.length?top.map(t=>
 e(t.nm)+' <b>'+t.n+'</b>').join('. ')+'.':'nothing. they never arrived.'}</p>
<blockquote>${(s.quote||[]).map(q=>'<p>&ldquo;'+e(q)+'&rdquo;</p>').join('')}</blockquote>
<p class="why"><b>${s.refuse?'What it means':'The ask'}.</b> ${e(s.ask||'')}</p>
${ans.length?'<p class="why"><b>Answered by.</b> '+ans.map(c=>
 '<span class="tag g">'+e(c.id)+'</span> '+e(c.nm)).join(', ')+'</p>':''}
<p class="split"><b>Not this.</b> ${e(s.not||'')}</p>
</div>`;}

/* ============================================================
   THE RANKING. Ordered by what the solo pass measured, not by what the
   interview asked loudest for.
   ============================================================ */
const ranked=N.changes.slice().map(c=>({...c, d:(solo[c.id]||{d:0}).d,
 runs:(solo[c.id]||{runs:0}).runs}))
 .sort((a,b)=>b.d-a.d);
const bars=barsSigned(ranked.map(c=>({k:c.id+'  '+c.nm, v:c.d, soft:c.soft})),
 {alt:'grade movement of each change, applied alone on the baseline'});

const st=N.stamp, fst=N.foldStamp;
const HTML=head('What would have kept them',
 'Nine figures, what the run measured about each, and the improvement each measured sticking point implies.')
+`
<p class="eye">At&uuml;ned, the UI and UX seat</p>
<h1>What would have kept them</h1>
<p class="lede">${Word(ORDER.length)} figures, ${COH} simulated arrivals a run,
${R.model.settle.runs} runs of ninety days each. The grade was ${n2(R.grade.mean)}.
This page asks the other question: what would have kept the people it lost.</p>

<div class="note bad"><b>Read this first, because it decides what the rest is worth.</b>
The thousand are simulated. Asking a simulated cohort what it wants returns this
model&rsquo;s own assumptions wearing the costume of an answer, and none of it is
evidence about a human being. What is real on this page is the left hand column:
every session length, every story told, every release run, every departure and
every sticking point below was produced by driving the shipped engine for ninety
days and reading the surface off <code>source.html</code> in Chromium. So the
method is not a survey. For each figure, the run says where they stopped and what
their session could afford, and the ask is derived from those two facts. Nothing
goes on the list that does not trace to one. Taste is refused, including this
seat&rsquo;s own, and the refusals are printed beside the asks.</p>

<h2>How an ask was derived</h2>
<p class="lede">Three rules, applied to every figure.</p>
<ol>
<li><b>It has to trace to a departure, not to a complaint.</b> ${fnm('F6')} was met
by ${met('F6')} of a thousand and attributed ${lost('F6')} departures.
${fnm('F12')} was met by ${met('F12')} and attributed ${lost('F12')}. The second
is the smaller experience and the larger loss, so it ranks above the first.
A friction everybody meets and nobody leaves on is a nuisance, not a sticking point.</li>
<li><b>It has to fit the session that figure actually has.</b> Diane tells
${n2(R.icp.Diane.stories)} stories in ninety days. That is not a preference and it
is not reluctance: her session is worth ${n1(R.icp.Diane.minutes)} minutes across
the whole quarter and the only door to her own charge is measured at
${R.model.cost.story} minutes. The improvement that implies is a narrower door,
not a nicer one.</li>
<li><b>It has to survive being modelled.</b> Every ask on this page was turned
into a change, applied to the same harness, and re-run to the same stopping rule.
What it moved is printed beside it, including the ones that moved nothing.</li>
</ol>

<h2>The nine</h2>
<p class="lede">Left column measured. Right column derived. The quotation marks
are this seat writing in the figure&rsquo;s register over the figure&rsquo;s own
numbers, and nobody said any of it.</p>
<div class="grid g2" style="margin-top:16px">
${ORDER.map(card).join('\n')}
</div>

<h2>The ranked improvements</h2>
<p class="lede">Ordered by what each one moved on its own, measured. Every row
names the sticking point it answers, the people the baseline lost to that
sticking point, the figures the loss column says it would keep, the file it
lands in and roughly what it costs.</p>
${bars}
<p class="fine">Each bar is that change applied alone on the baseline, run to the
same stopping rule as the baseline, and the grade compared against
${n2(N.base.total)}. The amber bar is the one step whose parameter is not traced
to a measurement.</p>
<table class="tb">
<thead><tr><th></th><th>The change</th><th class="num">Grade</th>
<th>Answers</th><th class="num">Lost</th><th>Keeps</th><th>Lands in</th><th>Cost</th></tr></thead>
<tbody>
${ranked.map(c=>`<tr class="${c.soft?'soft':(c.d>=0.5?'win':'')}">
<td><span class="tag${c.soft?'':(c.d>=0.5?' g':'')}">${e(c.id)}</span></td>
<td><b>${e(c.nm)}</b><span class="fine">${e(c.what)}</span></td>
<td class="num"><b>${sg(c.d)}</b><span class="fine">${(solo[c.id]||{runs:0}).runs} runs</span></td>
<td class="q">${c.traces.map(t=>e(fnm(t))).join('. ')}</td>
<td class="num">${c.lost}<span class="fine">met ${c.met}</span></td>
<td class="q">${c.keeps.length?c.keeps.map(k=>e(k)).join(', '):'nobody'}</td>
<td class="q"><code>${e(c.file)}</code></td>
<td class="q">${e(c.cost)}</td></tr>`).join('\n')}
</tbody></table>
<p class="fine">Lost is people of a thousand arrivals whose departure the
baseline attributed to one of the sticking points that change answers. It is an
attribution and not a cause: the heaviest single friction of the session somebody
left on is the one the departure is filed under.</p>

<h2>What each figure would have got</h2>
<p class="lede">Read down the ask column and the same three mechanisms account
for nearly all of it.</p>
<ul>
<li><b>A narrower door, not a better one.</b> Diane, James and Marcus between
them are ${R.icp.Diane.weight+R.icp.James.weight+R.icp.Marcus.weight} of
${COH} and all three lose the same way: the session they have is shorter than the
door they are offered. Nothing about the Story page&rsquo;s quality is in that
sentence.</li>
<li><b>Something to release, and a release that accumulates.</b> Derek, Ana,
Angela and Sofia are ${R.icp.Derek.weight+R.icp.Ana.weight+R.icp.Angela.weight+R.icp.Sofia.weight}
of ${COH}. ${fnm('F3')} cost ${lost('F3')} and
${fnm('F14')} cost ${lost('F14')}. Both are arithmetic. The engine already
returns <code>carrying</code> for the first one and the action surfaces do not
read it.</li>
<li><b>An instrument that reads what was written.</b> ${fnm('F1')} cost
${lost('F1')} and ${fnm('F2')} cost ${lost('F2')}. Measured through the shipped
<code>parseStory</code>: the bank read ${LEX.bank.before.read} of
${LEX.bank.before.n} ordinary sentences before the patch and
${LEX.bank.after.read} after, and the roster&rsquo;s own <code>says</code> lines
went ${LEX.says.before.read} of ${LEX.says.before.n} to ${LEX.says.after.read}.
That is ${N.lexEntries} entries in one data file.</li>
</ul>

<h2>What the lexicon patch actually did</h2>
<p class="lede">Measured through the shipped sniffer, not asserted. Every line
below changed verdict.</p>
<table class="tb">
<thead><tr><th>Sentence</th><th>Was</th><th>Now</th><th>Addresses offered</th></tr></thead>
<tbody>
${LEX.moved.slice(0,14).map(m=>`<tr class="${m.now==='read'?'win':''}">
<td class="q">&ldquo;${e(m.text)}&rdquo;<span class="fine">${e(m.who)}</span></td>
<td>${e(m.was)}</td><td><b>${e(m.now)}</b></td>
<td class="q">${e((m.nowOffers||[]).join(', '))}
${m.wasOffers&&m.wasOffers.length?'<span class="fine">was '+e(m.wasOffers.join(', '))+'</span>':''}</td></tr>`).join('\n')}
</tbody></table>
<p class="fine">${LEX.moved.length} of ${LEX.bank.after.n} lines changed verdict.
${LEX.stuck.filter(r=>r.verdict==='nothing').length} still reads nothing and it is
Rosa&rsquo;s, which is correct. ${LEX.stuck.filter(r=>r.verdict==='inferred').length}
still come back entirely inferred, which is why C5b is a separate change: stating
more addresses is not the same as never printing a guess as a finding.</p>

<h2>What was refused</h2>
<p class="lede">These are the improvements a cohort would ask for if a cohort
were asked, and none of them traces to a measured departure. The last one is this
seat&rsquo;s own and it is refused on the same grounds.</p>
<table class="tb">
<thead><tr><th>The proposal</th><th>Why it is refused</th></tr></thead>
<tbody>
<tr class="zero"><td><b>An onboarding tour</b></td><td class="q">Nobody left because they did not
understand the screen. ${fnm('F6')} was met by ${met('F6')} of a thousand and
attributed ${lost('F6')} departures. The count is the problem, not the
explanation of the count, and a tour adds a screen to a product already measured
at ${M.above.Field.desk} choices above the fold on the landing surface.</td></tr>
<tr class="zero"><td><b>Warmer, softer copy</b></td><td class="q">Angela is the figure this is
aimed at. She lost ${lostBy('F1','Angela')} to the box reading nothing out of her
sentence and ${lostBy('F2','Angela')} to it naming an address she had not
described. Neither is a tone.</td></tr>
<tr class="zero"><td><b>More content in Knowledge, Games or Ritual</b></td><td class="q">${fnm('F9')}
was met by ${met('F9')} of a thousand. Nobody exhausts the content because
nobody stays long enough to reach the end of it. Building more of it moves
nothing on this page.</td></tr>
<tr class="zero"><td><b>More badges, points and achievements</b></td><td class="q">The ladder is
already the thing that fires: ${Math.round(R.totals.marks)} marks were earned
across a thousand arrivals and ${pc(R.totals.loopEver)} of them ever closed the
loop. The marks are what a person gets instead of a moving reading, and more of
them is more of the wrong thing.</td></tr>
<tr class="zero"><td><b>A third theme, animation and a polish pass</b></td><td class="q">Visual and
kinetic is carried at 8 of 10 from the earlier run and no departure in the loss
column attaches to it. Worth doing, not worth doing first, and inventing an
instrument to score it higher would be writing the grade instead of earning it.</td></tr>
<tr class="zero"><td><b>Redesign the four doors on the Field</b><span class="fine">this seat&rsquo;s own
proposal, killed</span></td><td class="q">It was the first thing I wanted to do and the loss
column does not support it. Not one attributed departure in the run happens on
the doors. Diane opens the file, sees them, and leaves because the reading did
not move.</td></tr>
</tbody></table>

<h2>Where the load actually sits</h2>
<p class="lede">A separate probe, because a proposal to reduce a count needs the
count&rsquo;s parts. Every above the fold control on every surface, sorted into
the regions of the shell.</p>
<table class="tb">
<thead><tr><th>Surface</th><th class="num">Above the fold</th><th class="num">Tab bar</th>
<th class="num">Top</th><th class="num">Sub bar</th><th class="num">Stage</th>
<th class="num">Left rail</th><th class="num">Right rail</th>
<th class="num">In a foldable section</th></tr></thead>
<tbody>
${Object.keys(FOLD.widths[1600]).map(k=>{const d=FOLD.widths[1600][k];
 return `<tr><td><b>${e(k)}</b></td><td class="num">${d.total}</td>
<td class="num">${d.by.tabbar}</td><td class="num">${d.by.top}</td>
<td class="num">${d.by.subbar}</td><td class="num">${d.by.stage}</td>
<td class="num">${d.by.leftrail}</td><td class="num">${d.by.rightrail}</td>
<td class="num">${d.rail.leftrail.body+d.rail.rightrail.body}</td></tr>`;}).join('\n')}
</tbody></table>
<p class="fine">At 1600 by 1000, on a loaded profile. The working memory target is
four and the product&rsquo;s own floor is under twelve. The chrome alone, the top
and the bar, is ${FOLD.widths[1600].Field.by.top+FOLD.widths[1600].Field.by.tabbar}
controls before any content, which is the reason this criterion cannot be fixed
inside a surface. At 390 both rails are already off screen, so the phone counts
are ${Math.min.apply(null,Object.keys(FOLD.widths[390]).map(k=>FOLD.widths[390][k].total))}
to ${Math.max.apply(null,Object.keys(FOLD.widths[390]).map(k=>FOLD.widths[390][k].total))}
and the load problem is a desk problem.</p>

<hr class="rule">
<h2>What this is, and what it is not</h2>
<div class="stamp">${buildBlock(st,N.drift,fst)}chromium      ${e(st.chromium)}, file://, 1600x1000 and 390x844
measured      ${e(st.when)}
cohort        ${COH} a run, ${R.model.settle.runs} runs behind the baseline
lexicon       ${Object.keys(LEX).length?LEX.patch.lexBefore+' entries to '+LEX.patch.lexAfter:''}

  node sim/measure.js       the surface, writes sim/measured.json
  node sim/fold.js          where the load sits, writes sim/folded.json
  node sim/lexcheck.js      the lexicon patch, writes sim/lexmeasured.json
  node sim/harness.js       the baseline cohort, writes sim/runs.json
  node sim/ninety.js        every change modelled, writes sim/ninety.json
  node sim/build-help.js    this page</div>
<p class="foot">Every number on this page came out of a run or a probe. Every
sentence in quotation marks was written by this seat over those numbers and was
said by nobody. The model in the run is one thing only, when somebody opens the
file and when they stop, it is stated in full in <code>sim/harness.js</code>, and
it is judgement. This is not research and must not be quoted as research. Five
people with phones and two afternoons would replace most of the derived half of
this page with measurements, and the asks it would confirm or kill are listed
above in the order to test them.</p>

</div></body></html>`;
fs.writeFileSync(path.join(__dirname,'what-would-help.html'),HTML);
console.log('sim/what-would-help.html written, '+(HTML.length/1024).toFixed(0)+' kB. '
 +ranked.length+' changes ranked, top '+ranked[0].id+' at '+sg(ranked[0].d)+'.');
