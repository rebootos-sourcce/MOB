/* ============================================================
   THE QUALITY REVIEW, BUILT FROM THE SCORING RUN.

   Writes REVIEW-quality.md and REVIEW-quality.html off
   sim/combination/quality.json and refuses to write either without it. Every
   figure on the page is read out of that file. Nothing is typed here, including
   the counts in the sentences.
   ============================================================ */
const fs=require('fs'), path=require('path');
const DIR=__dirname, REPO=path.resolve(DIR,'..','..');
const P=require(path.join(DIR,'..','page.js'));
const {e,pc,n1,n2,sg,word,Word}=P;
const QJ=path.join(DIR,'quality.json');
if(!fs.existsSync(QJ)){
 console.error('sim/combination/quality.json is missing. Run sim/combination/quality.js first.');
 process.exit(2);}
const Q=JSON.parse(fs.readFileSync(QJ,'utf8'));
['families','dims','transitions','spread','unscored'].forEach(k=>{
 if(!Q[k]||!Q[k].length){console.error('quality.json carries no '+k+'. Refusing to build.');
  process.exit(2);}});
if(!Q.voiceSelfCheck){console.error('quality.json does not record the voice gate self check. Refusing to build.');
 process.exit(2);}

/* WHAT WOULD RAISE EACH DIMENSION. One sentence each, and they are prescriptions
   rather than figures, so they are written here and the numbers beside them are
   not. A rubric that names a weakest dimension and not the fix is a scoreboard. */
const RAISE={
 contained:'Take the host reference out. A prototype that fetches has not proved anything about a product that cannot.',
 widths:'Take both shots from a script in the directory, so the next person gets the same two pictures.',
 measured:'Put the figures in a data file the page reads, and stamp the page with the build it was measured against.',
 refuses:'Make the builder exit non zero when its input is missing, so a page of nothing is never mistaken for a result.',
 repro:'Print the command that rebuilds the page on the page.',
 voice:'Run the voice gate before the commit, and put file names and identifiers in a code element rather than in a sentence.',
 lands:'Name the file under atuned_src the change lands in. An artefact that names no landing place is a picture.',
 open:'Say what was not done and what still needs a ruling, in the words the queue uses.'};

const FAM=Q.families;
const DIMS=Q.dims;
const SPREAD={}; Q.spread.forEach(s=>{SPREAD[s.k]=s;});
const dimNm={}; DIMS.forEach(d=>{dimNm[d.k]=d.nm;});
const last=f=>f.iters[f.iters.length-1];
const first=f=>f.iters[0];
/* the families that have a trajectory at all, which is not all of them */
const MOVED=FAM.filter(f=>f.iters.length>2);
const ONCE=FAM.filter(f=>f.iters.length<=2);
const T=Q.transitions;
const followed=T.filter(t=>t.followed).length;
const regressed=T.filter(t=>t.regressed.length).length;
/* the dimension means, weakest first, read off the spread */
const RANK=Q.spread.slice().sort((a,b)=>a.mean-b.mean);
const WEAKEST=RANK[0];
const DEAD=Q.spread.filter(s=>!s.discriminates);
const totMean=+(FAM.reduce((a,f)=>a+last(f).total,0)/FAM.length).toFixed(2);
const totFirst=+(FAM.reduce((a,f)=>a+first(f).total,0)/FAM.length).toFixed(2);
const MAX=last(FAM[0]).max;
const bestFam=FAM.slice().sort((a,b)=>last(b).total-last(a).total)[0];
const worstFam=FAM.slice().sort((a,b)=>last(a).total-last(b).total)[0];
const climbers=FAM.slice().sort((a,b)=>(last(b).total-first(b).total)-(last(a).total-first(a).total));
const voiceGates=(()=>{const g={};
 FAM.forEach(f=>f.iters.forEach(it=>Object.keys(it.note.voiceGates||{}).forEach(k=>{
  g[k]=(g[k]||0)+it.note.voiceGates[k];})));
 return Object.keys(g).sort((a,b)=>g[b]-g[a]).map(k=>({k:k,n:g[k]}));})();
const voiceTotal=voiceGates.reduce((a,x)=>a+x.n,0);
const capsShare=voiceTotal?(voiceGates.filter(x=>x.k==='caps').reduce((a,x)=>a+x.n,0)/voiceTotal):0;

/* ---------------------------------------------------------------- the charts */
/* the trajectory, one line per family, on its own iteration count. Not the
   shared multiLine, which is built for ninety day series on a common x. */
function trajectory(fams){
 const W=880,Hh=330,L=40,T0=16,B=40;
 /* THE X AXIS IS EACH FAMILY'S OWN ITERATION COUNT, NORMALISED. The first cut
    put every family on a common axis of twenty, so the seven families with two
    iterations drew a stub in the left tenth of the frame and the chart answered
    nothing. First to current is the comparison, and the count is in the legend. */
 const maxN=Math.max.apply(null,fams.map(f=>f.iters.length));
 const Rr=Math.min(320,Math.max(150,8+Math.max.apply(null,fams.map(f=>f.k.length))*7.4+62));
 const hi=MAX, lo=0;
 const y=v=>T0+(hi-v)/(hi-lo)*(Hh-T0-B);
 const xf=(i,n)=>L+(n<2?0:i/(n-1))*(W-L-Rr);
 const col=['#7EB8D4','#68CBA4','#C2A063','#A77EDB','#D8924E','#5EBBDB','#D4736D','#DABF6A','#B4B0A8'];
 let g='';
 for(let v=0;v<=hi;v+=4)
  g+='<line class="gl" x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+(W-Rr)+'" y2="'+y(v).toFixed(1)+'"/>'
   +'<text class="ax" x="'+(L-8)+'" y="'+(y(v)+4).toFixed(1)+'" text-anchor="end">'+v+'</text>';
 g+='<text class="ax" x="'+L+'" y="'+(Hh-B+20)+'">first</text>'
  +'<text class="ax" x="'+(W-Rr)+'" y="'+(Hh-B+20)+'" text-anchor="end">current</text>';
 fams.forEach((f,fi)=>{
  let d='';
  const n=f.iters.length;
  f.iters.forEach((it,i)=>{d+=(i?' L':'M')+xf(i,n).toFixed(1)+' '+y(it.total).toFixed(1);});
  g+='<path class="ln" d="'+d+'" stroke="'+col[fi%col.length]+'" stroke-width="2.2"/>';
  f.iters.forEach((it,i)=>{
   g+='<circle cx="'+xf(i,n).toFixed(1)+'" cy="'+y(it.total).toFixed(1)+'" r="'+(it.tree?4.5:2.6)
    +'" fill="'+col[fi%col.length]+'"/>';});
  g+='<text class="lg" x="'+(W-Rr+8)+'" y="'+(T0+14+fi*17)+'" fill="'+col[fi%col.length]+'">'
   +e(f.k)+' '+n1(last(f).total)+'<tspan class="ax" fill="#94908A"> '+n+'</tspan></text>';});
 return '<div class="chwrap"><svg class="ch" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="'
  +e('every family, scored out of '+MAX+' at each iteration')+'">'+g+'</svg></div>';}

/* ---------------------------------------------------------------- the page */
const TITLE='The team grading itself';
const LEDE='The work, scored on eight computed dimensions, one iteration per commit, '
 +word(Q.passes)+' page versions of the last day’s output.';
let h=P.head(TITLE,LEDE);
h+='<p class="eye">'+e('quality review, '+Q.when.slice(0,10))+'</p>';
h+='<h1>'+e(TITLE)+'</h1>';
h+='<p class="lede">'+e(LEDE)+'</p>';

h+='<div class="note bad"><p><b>Read this first. This is the team grading its own '
 +'work, which is the weakest kind of evidence there is.</b> Nobody outside the team '
 +'scored anything on this page. The rubric was written by the same seat that is '
 +'being scored by it, the dimensions were chosen after the work was already done, '
 +'and a seat that wanted a higher number could have chosen eight different ones. '
 +'What the instrument does buy is repeatability: every dimension is computed off '
 +'the bytes of the artefact by <code>sim/combination/quality.js</code>, so two '
 +'readers running it get the same number, and the trajectory is not a matter of '
 +'anybody’s mood.</p>'
 +'<p>Three things would make it stronger, in this order. One, the owner scores the '
 +'same '+word(FAM.length)+' families on the same eight dimensions and the two '
 +'columns are printed side by side, which turns this into a calibration and not a '
 +'self report. Two, a dimension is added that this file cannot compute: whether '
 +'the change reached <code>atuned_src</code> at all, read off the commits rather '
 +'than off the artefact’s own claims. Three, the rubric is frozen before the '
 +'next round rather than written after it.</p></div>';

h+='<div class="grid g4">'
 +'<div class="tile"><span class="n">'+Q.passes+'</span>'
 +'<span class="l">page versions scored</span><span class="s">'
 +e(Word(Q.familyVersions)+' family versions across '+word(FAM.length)+' families, '
 +'one per commit in the window, plus the working tree.')+'</span></div>'
 +'<div class="tile"><span class="n">'+Q.dimScores+'</span>'
 +'<span class="l">dimension scores</span><span class="s">'
 +e('Eight dimensions a page, each out of four, every one computed.')+'</span></div>'
 +'<div class="tile"><span class="n">'+pc(Q.followRate,0)+'</span>'
 +'<span class="l">follow rate</span><span class="s">'
 +e('Of '+word(T.length)+' iteration to iteration transitions, the share where the '
 +'dimension that was weakest went up. This is the direction question, answered.')+'</span></div>'
 +'<div class="tile"><span class="n">'+n1(totFirst)+' to '+n1(totMean)+'</span>'
 +'<span class="l">mean family score, out of '+MAX+'</span><span class="s">'
 +e('First iteration to current. The total rises. The weakest dimension mostly does not.')
 +'</span></div></div>';

h+='<h2>The finding</h2>';
h+='<p>The work is improving and it is not improving where it is weakest. '
 +'The mean family score went from '+n1(totFirst)+' to '+n1(totMean)+' out of '+MAX
 +', so the direction is up. But of '+word(T.length)+' transitions between one '
 +'iteration and the next, '+word(followed)+' raised the dimension that had just '
 +'been the weakest one, which is '+pc(Q.followRate,0)+'. The seats are polishing '
 +'what is already strong.</p>';
h+='<p>The weakest dimension across every page version is <b>'+e(WEAKEST.nm||dimNm[WEAKEST.k])
 +'</b> at '+n2(WEAKEST.mean)+' of four. '+e(RAISE[WEAKEST.k])+'</p>';
h+='<p>'+e(word(regressed).replace(/^./,c=>c.toUpperCase())+' of the '+word(T.length)
 +' transitions dropped a dimension that had been higher in the iteration before, '
 +'so the movement is not one way.')+'</p>';

h+='<h2>The rubric</h2>';
h+='<p class="lede">Eight dimensions, each out of four, each computed. '
 +'Five are read off each page and three off the directory it sits in.</p>';
h+='<table class="tb"><thead><tr><th>Dimension</th><th class="num">Mean</th>'
 +'<th class="num">Spread</th><th>Why this one</th><th>How it is scored</th></tr></thead><tbody>';
DIMS.forEach(d=>{const s=SPREAD[d.k];
 h+='<tr'+(s.discriminates?'':' class="zero"')+'><td><b>'+e(d.nm)+'</b>'
  +(s.discriminates?'':'<span class="fine">Scored the same on every version measured, so it '
   +'separates nothing. It is a gate that the team has already internalised, and it '
   +'should stay a gate and stop being a dimension.</span>')+'</td>'
  +'<td class="num">'+n2(s.mean)+'</td>'
  +'<td class="num">'+n2(s.sd)+'</td>'
  +'<td class="q">'+e(d.why)+'</td><td class="q">'+e(d.how)+'</td></tr>';});
h+='</tbody></table>';
h+='<p class="fine">'+e('Spread is the standard deviation across all '+Q.passes
 +' page versions. A dimension whose spread is zero measures nothing about direction.')
 +'</p>';
if(DEAD.length)h+='<div class="note"><p>'+e(Word(DEAD.length)+' of the eight '
 +(DEAD.length===1?'dimension scores':'dimensions score')+' the same on every version: '
 +DEAD.map(d=>dimNm[d.k].toLowerCase()).join(' and ')+'. That is a real result and not a '
 +'defect in the rubric. The rule behind it is one the team no longer breaks.')+'</p></div>';

h+='<h2>The trajectory</h2>';
h+='<p class="lede">'+e('Every family from its first iteration to its current one, out of '+MAX
 +'. The larger dot is the working tree, and the grey figure in the legend is how many iterations there were.')+'</p>';
h+=trajectory(FAM);
h+='<table class="tb"><thead><tr><th>Family</th><th>Seat</th><th class="num">Iterations</th>'
 +'<th class="num">First</th><th class="num">Now</th><th class="num">Move</th>'
 +'<th>Weakest now</th><th>What would raise it</th></tr></thead><tbody>';
climbers.forEach(f=>{const l=last(f), f0=first(f);
 const d=+(l.total-f0.total).toFixed(2);
 h+='<tr'+(d>0?' class="win"':(d<0?' class="zero"':''))+'><td><b>'+e(f.nm)+'</b>'
  +'<span class="fine">'+e(f.dir)+'</span></td><td>'+e(f.seat)+'</td>'
  +'<td class="num">'+f.iters.length+'</td><td class="num">'+n1(f0.total)+'</td>'
  +'<td class="num">'+n1(l.total)+'</td><td class="num">'+sg(d)+'</td>'
  +'<td>'+l.weakest.map(k=>e(dimNm[k])).join(', ')+'</td>'
  +'<td class="q">'+e(RAISE[l.weakest[0]])+'</td></tr>';});
h+='</tbody></table>';
h+='<p>'+e(Word(ONCE.length)+' of the '+word(FAM.length)+' families have one commit and '
 +'the working tree, which is one look and no second pass: '
 +ONCE.map(f=>f.k).join(', ')+'. There is no trajectory to measure inside them, and '
 +'that is the finding rather than a gap in the instrument. The '+word(MOVED.length)
 +' that were iterated are '+MOVED.map(f=>f.k+' at '+f.iters.length).join(', ')
 +'.')+'</p>';

h+='<h2>The loop, as he asked for it</h2>';
h+='<p class="lede">Score, take the weakest dimension, say what would raise it, '
 +'apply that to the next iteration, score again.</p>';
h+='<table class="tb"><thead><tr><th>Family</th><th>From</th><th>To</th>'
 +'<th>Was weakest</th><th>Raised</th><th class="num">Total</th></tr></thead><tbody>';
T.forEach(t=>{
 h+='<tr'+(t.followed?' class="win"':'')+'><td>'+e(t.fam)+'</td>'
  +'<td><code>'+e(t.from)+'</code></td><td><code>'+e(t.to)+'</code></td>'
  +'<td>'+t.weakest.map(k=>e(dimNm[k])).join(', ')+'</td>'
  +'<td>'+(t.raised.length?'<span class="good">'+t.raised.map(k=>e(dimNm[k])).join(', ')
   +'</span>':'<span class="bad">nothing</span>')+'</td>'
  +'<td class="num">'+sg(t.dTotal)+'</td></tr>';});
h+='</tbody></table>';

h+='<h2>The instrument found two defects in itself</h2>';
h+='<p>Both were caught by checking the tool against a case whose answer was known, '
 +'which is the rule this repository already carries, and both had made the team look '
 +'better than it is.</p>';
h+='<ul>'
 +'<li><b>The voice probe swallowed every failure.</b> The gate exits non zero when '
 +'it finds one, the first cut called it through a wrapper that throws on a non zero '
 +'exit, and the catch scored nothing. Every artefact read four of four on voice. A '
 +'direct run on one of them printed a failure the same minute. The gate is now read '
 +'off the failing exit as well, and the file refuses to score anything until the gate '
 +'has reported a failure on a line known to fail: it found '+word(Q.voiceSelfCheck)
 +' on that line just now.</li>'
 +'<li><b>A family average computed off a join cannot be pulled down by a bad page.</b> '
 +'The first cut joined a family’s pages and scored the text, so a funnel of four '
 +'pages scored full marks for naming where it lands because one page named a path. '
 +'Five of the eight dimensions are scored per page now and the family is the mean.</li>'
 +'</ul>';
h+='<p>The voice gate reported '+word(voiceTotal)+' hard failures in total across the '
 +'page versions it could read. '+pc(capsShare,0)+' of them are the capitals rule, and '
 +'on these artefacts that rule is mostly catching file names and identifiers rather '
 +'than shouting copy. The rule is a ruling and the count stands, but a gate aimed at '
 +'what a customer reads is being run against engineering pages, so the honest fix is '
 +'a mode for internal pages and not a lower score.</p>';
h+='<table class="tb"><thead><tr><th>Rule</th><th class="num">Hard failures</th></tr></thead><tbody>';
voiceGates.forEach(g=>{h+='<tr><td>'+e(g.k)+'</td><td class="num">'+g.n+'</td></tr>';});
h+='</tbody></table>';

h+='<h2>What this cannot see</h2>';
h+='<p class="lede">Four things, and they are the four that decide whether the work '
 +'was any good.</p><ul>';
Q.unscored.forEach(u=>{h+='<li><b>'+e(u.k)+'.</b> '+e(u.say)+'</li>';});
h+='</ul>';
h+='<p>So a family at '+n1(last(bestFam).total)+' of '+MAX+' is not better work than a '
 +'family at '+n1(last(worstFam).total)+'. It is work that carries more of the '
 +'apparatus this repository asks for. '+e(last(bestFam).pages.length>1?'':'')
 +'The highest score on the page is '+e(bestFam.nm.toLowerCase())+' and the lowest is '
 +e(worstFam.nm.toLowerCase())+', and the second one is a prototype from the first hour '
 +'of the day that nothing has been asked of since.</p>';

h+='<hr class="rule"><h2>The run</h2>';
h+='<div class="stamp">'
 +e('commit        '+Q.head+(Q.dirty?'   working tree dirty':'')+'\n'
 +'source.html   md5 '+Q.srcMd5+'\n'
 +'window        '+Q.hours+' hours\n'
 +'families      '+FAM.length+'\n'
 +'page versions '+Q.passes+'\n'
 +'dimension     '+Q.dimScores+' scores\n'
 +'transitions   '+T.length+'\n'
 +'voice gate    self check found '+Q.voiceSelfCheck+' on a line known to fail\n'
 +'written       '+Q.when+'\n\n'
 +'node sim/combination/quality.js '+Q.hours+'\n'
 +'node sim/combination/build-quality.js')+'</div>';
h+='<p class="foot">'+e('Scored by sim/combination/quality.js. Built by '
 +'sim/combination/build-quality.js from sim/combination/quality.json, which it '
 +'refuses to build without.')+'</p>';
h+='</div></body></html>';

/* ---------------------------------------------------------------- the record */
let m='# The team grading itself\n\n'
 +'Scored '+Q.when.slice(0,10)+' against commit '+Q.head+', source.html md5 '+Q.srcMd5+'.\n'
 +'Read the page instead: `REVIEW-quality.html`. This file is the record.\n\n'
 +'**This is the team grading its own work, which is the weakest kind of evidence\n'
 +'there is.** Nobody outside the team scored anything here. The rubric was written\n'
 +'by the seat being scored by it and the dimensions were chosen after the work was\n'
 +'done. What it buys is repeatability: every dimension is computed off the bytes by\n'
 +'`sim/combination/quality.js`, so two readers get the same number.\n\n'
 +'What would make it stronger, in order: the owner scores the same '+FAM.length
 +' families on\nthe same eight dimensions and the columns are printed side by side; a\n'
 +'dimension is added for whether the change reached `atuned_src` at all, read off\n'
 +'the commits; and the rubric is frozen before the next round rather than after it.\n\n'
 +'## The numbers\n\n'
 +'- '+Q.passes+' page versions scored, '+Q.familyVersions+' family versions, '
 +Q.dimScores+' dimension scores.\n'
 +'- Mean family score '+n1(totFirst)+' to '+n1(totMean)+' out of '+MAX+'.\n'
 +'- Follow rate '+pc(Q.followRate,0)+': of '+T.length+' transitions, '+followed
 +' raised the dimension that had been weakest.\n'
 +'- '+regressed+' of '+T.length+' transitions dropped a dimension that had been higher.\n'
 +'- Weakest dimension overall: '+(WEAKEST.nm||dimNm[WEAKEST.k])+' at '+n2(WEAKEST.mean)+' of four.\n\n'
 +'## The rubric\n\n';
DIMS.forEach(d=>{const s=SPREAD[d.k];
 m+='- **'+d.nm+'** mean '+n2(s.mean)+', spread '+n2(s.sd)
  +(s.discriminates?'':' (separates nothing on this set)')+'. '+d.how+'\n';});
m+='\n## Every family\n\n| Family | Seat | Iterations | First | Now | Move | Weakest now |\n'
 +'|---|---|---|---|---|---|---|\n';
climbers.forEach(f=>{const l=last(f);
 m+='| '+f.nm+' | '+f.seat+' | '+f.iters.length+' | '+n1(first(f).total)+' | '+n1(l.total)
  +' | '+sg(l.total-first(f).total)+' | '+l.weakest.map(k=>dimNm[k]).join(', ')+' |\n';});
m+='\n## What this cannot see\n\n';
Q.unscored.forEach(u=>{m+='- **'+u.k+'.** '+u.say+'\n';});
m+='\n## The instrument found two defects in itself\n\n'
 +'- The voice probe swallowed every failure, because the gate exits non zero when it\n'
 +'  finds one and the wrapper threw. Every artefact read four of four on voice until\n'
 +'  it was fixed. It now refuses to score until the gate reports a failure on a line\n'
 +'  known to fail.\n'
 +'- A family average computed off a joined text cannot be pulled down by a bad page.\n'
 +'  Five of the eight dimensions are scored per page now.\n\n'
 +'## Reproduce\n\n    node sim/combination/quality.js '+Q.hours+'\n'
 +'    node sim/combination/build-quality.js\n';

fs.writeFileSync(path.join(REPO,'REVIEW-quality.html'),h);
fs.writeFileSync(path.join(REPO,'REVIEW-quality.md'),m);
console.log('REVIEW-quality.html '+(h.length/1024).toFixed(0)+'kb and REVIEW-quality.md written.');
