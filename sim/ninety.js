/* ============================================================
   CHASING NINETY. THE ITERATION, AND THE RULE IT IS HELD TO.

   The ninety day run graded 38.91. The owner's instruction was to keep
   simulating until it reaches ninety per cent. This file is that loop, and the
   rule is the whole exercise:

     the grade only moves if the product would move.

   So a step here is not a parameter. A step is one named product change, with
   the file it lands in and roughly what it costs to build, and the parameter it
   turns is the consequence of that change. Nothing in this file lowers a
   friction cost, raises an opening rate, reweights a criterion, or grades a
   different thing. The one exception is the return rate a notification would
   buy, which nothing measures: it is turned on in a step of its own, it is run
   twice, and both numbers are reported so the reader can discount it.

   Two passes.

     SOLO      every change applied alone on the baseline, to the stopping rule,
               so the ranking is measured rather than argued.
     CUMULATIVE the changes applied in descending solo order, to the stopping
               rule at every step, which is the curve.

   The stopping rule is the baseline's own and it is not chosen per step: a
   running mean of the total grade that moves by less than SETTLE of a point when
   another run is added, held HOLD runs in a row, with at least FLOOR behind it.
   Every step runs the same seed sequence, so a step's delta is paired against
   the baseline person by person and not compared across different cohorts.

     node sim/ninety.js            both passes, writes sim/ninety.json
     node sim/ninety.js solo       the solo pass only
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const H=require(path.join(__dirname,'harness.js'));
/* THE DRIFT. Two seats are live in atuned_src and the release path, so the
   working copy of the build moves while this runs. SIM_ROOT pins what is
   measured; this records what the working tree held when the iteration started,
   so the page can say the build moved under it instead of quietly measuring one
   build and being read against another. */
const REPO=path.resolve(__dirname,'..');
const md5=f=>{try{return cp.execSync('md5sum '+JSON.stringify(path.join(REPO,f)))
 .toString().split(' ')[0];}catch(err){return 'absent';}};
const DRIFT={pin:process.env.SIM_ROOT||null,
 worktreeSrc:md5('source.html'), worktreeEngine:md5('engine.js'),
 when:new Date().toISOString()};
const {K,resetKnobs,remeasure,runCohort,gradeOf,letterOf,ceilingCase,verifyRelease,
 sd,DAYS,SHOWUP,FRICTION,M,MEAS,FOLD,SETTLE,HOLD,FLOOR,CEIL,COHORT,E}=H;
const LEXM=path.join(__dirname,'lexmeasured.json');
[['folded.json',FOLD],['lexmeasured.json',fs.existsSync(LEXM)]].forEach(([nm,ok])=>{
 if(!ok){console.error('missing sim/'+nm+'. Run sim/fold.js and sim/lexcheck.js first.');
  process.exit(2);}});
const LEX=JSON.parse(fs.readFileSync(LEXM,'utf8'));
const {PATCH}=require(path.join(__dirname,'lexpatch.js'));

/* the lexicon patch, applied to the shipped LEX in memory and taken back off
   again, so a step that does not include it is not quietly carrying it. */
const LEXKEYS=Object.keys(PATCH).filter(k=>!E.LEX[k]);
function lexOn(on){ LEXKEYS.forEach(k=>{ if(on)E.LEX[k]=PATCH[k]; else delete E.LEX[k]; }); }

/* ============================================================
   THE CHANGES. Each one traces to a measured sticking point or it is not here.
   `lost` is people of a thousand arrivals the baseline attributed to that
   sticking point, `met` is people who met it at all, and both are read out of
   sim/runs.json rather than typed. `keeps` names the figures the loss column
   says it would keep.
   ============================================================ */
const BASE=JSON.parse(fs.readFileSync(path.join(__dirname,'runs.json'),'utf8'));
const lost=k=>(BASE.lost[k]||{people:0}).people;
const met=k=>Math.round((BASE.hitShare[k]||{share:0}).share*1000);
const CHANGES=[
 {id:'C1', nm:'The narrow door',
  what:'A one line box on the surface a person already landed on, committing on enter, opening the same engine call the Story page opens. The wide door stays for the people who want it.',
  traces:['F4','F14'],
  facts:['Diane tells '+BASE.icp.Diane.stories+' stories in ninety days on a session worth '
   +BASE.icp.Diane.minutes+' minutes, against a door measured at '+H.COST.story+' minutes.',
   'James tells '+BASE.icp.James.stories+' on '+BASE.icp.James.minutes+' minutes.'],
  keeps:['Diane','James','Marcus'],
  file:'atuned_src/ui/storyui.js, atuned_src/shell/body.html',
  cost:'Two days. The box, the commit on enter, and the panel it opens into already exist on the Story page.',
  /* WHAT IS JUDGED HERE, SAID OUT LOUD. The door's cost is a minute count in
     the harness's own COST table, and that table is judgement rather than
     measurement. This step replaces one judged number with another: 3.4 minutes
     for the Story page, 0.8 for a one line box. The product change behind it is
     real and named above, the size of it is not measured, and the sensitivity
     sweep already moves every cost in that table by a quarter in both
     directions to bound what the whole table is worth. */
  judged:'The door costs '+H.COST.story+' minutes in the harness\u2019s own cost table and this step sets it to 0.8. Both numbers are judgement. The product change is real, its size is not measured, and the model sweep bounds what the whole cost table is worth.',
  apply(){K.storyCost=0.8;}},
 {id:'C2a', nm:'The removal compounds inside the run',
  what:'The release takes 21 per cent of the weight once, whatever the length of the run, so a twelve line run and a three line run remove the same amount. Each line of the run takes from what is left instead.',
  traces:['F4'],
  facts:['The ceiling case, with no model in it, goes '+BASE.ceiling.mid.cq0+' to '
   +BASE.ceiling.mid.cq90+' over ninety consecutive days of story, release and kept practice.',
   'The verified run freed '+BASE.verify.freed+' over '+BASE.verify.lines+' lines.'],
  keeps:['Diane','Derek','James','Ana'],
  file:'atuned_src/ui/release.js, and the contract with SOURCE',
  cost:'Days in the code and a ruling before it. This is arithmetic the book shares, so it is the owner’s call and not a design decision.',
  apply(){K.relCompound=true;}},
 {id:'C2b', nm:'The install reaches the far pole',
  what:'The release installs 62 per cent of what it took, so the address is left holding less of the fetter and not the opposite state. The install is placed at the pole instead.',
  traces:['F4','F14'],
  facts:['After ninety daily releases the ceiling case holds the opposite at '
   +BASE.ceiling.mid.clear+' addresses of the '+112+' the product states.'],
  keeps:['Ana','Sofia','Angela'],
  file:'atuned_src/ui/release.js',
  cost:'Hours in the code, and the same ruling as C2a.',
  apply(){K.relInstall=1.0;}},
 {id:'C2c', nm:'A cleared address stays cleared',
  what:'A story may push an address that was cleared straight back over the line, so the same charge is released repeatedly and nothing accumulates. The level a release left an address at becomes a floor.',
  traces:['F14','F4'],
  facts:['Every story only ever adds charge, measured: the reading only ever falls from one.',
   'F14 was met by '+met('F14')+' of a thousand and attributed '+lost('F14')+' departures.'],
  keeps:['Ana','Sofia','Derek'],
  file:'atuned_src/engine/compute.js and the charge model',
  cost:'A week. It is a new piece of state on the profile, so it is schema, and schema is the cross compatibility contract.',
  apply(){K.relStick=true;}},
 {id:'C3', nm:'The release reads carrying rather than loaded',
  what:'An address enters the reading at four of ten. Below that a person carrying load at a hundred addresses is told nothing is carrying and the release has nothing to offer. The engine already returns carrying for exactly this reason and the action surfaces still read loaded.',
  traces:['F3'],
  facts:['F3 was met by '+met('F3')+' of a thousand and attributed '+lost('F3')+' departures, '
   +((BASE.lost.F3||{by:[]}).by[0]||{n:0}).n+' of them Derek.',
   'compute.js records the measurement that added carrying: Marcus carries 99 addresses with his heaviest at 2.51 and is told nothing is carrying.'],
  keeps:['Derek','Ana','Angela','Sofia','Marcus'],
  file:'atuned_src/ui/release.js, atuned_src/ui/summary.js',
  cost:'Hours. One word, and then the copy that goes with a reading below the line.',
  apply(){K.carrying=true;}},
 {id:'C4', nm:'What the holding costs, printed',
  what:'A line that says what the charge costs in output, on the surface that already prints the reading. Not the pain, the cost.',
  traces:['F4'],
  facts:['Derek’s own reason for not returning is that nothing tells him what the holding costs him.',
   'F4 was met by '+met('F4')+' of a thousand and attributed '+lost('F4')+' departures.'],
  keeps:['Derek','Diane','James'],
  file:'atuned_src/ui/summary.js, a new read in atuned_src/engine/read.js',
  cost:'Two days, and the harder half is deciding what the unit is. A number nobody can act on is worse than no line.',
  apply(){K.costLine=true;}},
 {id:'C5', nm:'The lexicon reads ordinary sentences',
  what:'Thirty entries, each one a phrase, a seat, an amount and the address it states outright. LEX already carries the third element for this and thirty entries already use it.',
  traces:['F1'],
  facts:['Measured through the shipped parseStory: the bank read '+LEX.bank.before.read
   +' of '+LEX.bank.before.n+' before the patch and '+LEX.bank.after.read+' of '
   +LEX.bank.after.n+' after. The roster’s own says lines went '+LEX.says.before.read
   +' of '+LEX.says.before.n+' to '+LEX.says.after.read+'.',
   'Lines whose every address carried inferred went '+LEX.bank.before.inferredOnly
   +' to '+LEX.bank.after.inferredOnly+'.'],
  keeps:['Sofia','Angela','Marcus','Ana'],
  file:'atuned_src/engine/data/lex.js',
  cost:'Two days for these thirty and the gate that holds them. The general case is not two days: this patch was written against a bank of '
   +LEX.bank.after.n+' sentences and a bank is not a language.',
  apply(){K.lex=true;}},
 {id:'C5b', nm:'An inferred address is a question',
  what:'Every imprint carries inferred. The panel prints it as a finding either way, so a wrong address arrives with confidence. An inferred address is printed as a question with its candidates and a way to say no.',
  traces:['F2'],
  facts:['F2 was met by '+met('F2')+' of a thousand and attributed '+lost('F2')+' departures, all of them Angela and Ana.',
   '"I am ashamed of how long this is taking" is answered with Pride, Arrogance, Competition.'],
  keeps:['Angela','Ana'],
  file:'atuned_src/ui/storyui.js',
  cost:'Two days. The flag is already on the imprint.',
  apply(){K.inferAsk=true;}},
 {id:'C6', nm:'Something asks them to come back',
  what:'A notification against a ritual the person set, which is the accountability seam the fork already put in scope. This step turns off the friction of nothing asking. It does not raise the return rate.',
  traces:['F10'],
  facts:['DRIFT, the absence that became permanent, is the largest single loss at '
   +lost('DRIFT')+' of a thousand.',
   'F10 was met by '+met('F10')+' of a thousand.'],
  keeps:['Angela','Diane','Marcus','Sofia'],
  file:'the accounts seam: a service worker, a server, and a consent screen',
  cost:'Weeks, and it is the last thing to build rather than the first. A notification calling somebody back to a loop that returns them where they started calls them back to nothing.',
  apply(){K.push=true;}},
 {id:'C6n', nm:'And the return rate it buys',
  what:'The return the notification actually earns. Nothing in this repository measures it and nothing in this file pretends otherwise. It is a judgement of 12 per cent of otherwise skipped days, turned in a step of its own so it can be subtracted.',
  traces:['F10'],
  facts:['This is the one number on the page that is not traced to a measurement. It is here to be discounted.'],
  keeps:['Angela','Derek','Ana'],
  file:'the same seam as C6',
  cost:'Nothing beyond C6. The cost is credibility, which is why it is separated.',
  soft:true,
  apply(){K.push=true; K.nudge=0.12;}},
 {id:'C7', nm:'The two level menu',
  what:'Nine top level entries become four parents with children, which is the structure already specified. The whole bar is then reachable on a phone and the bar stops spending half the working memory budget before any content.',
  traces:['F5','F6'],
  facts:['Measured: '+M.stripPhone+' of '+M.tabs+' fully in view at 390, and '
   +MEAS.widths[390].land.stripOff.join(', ')+' past the right edge.',
   'The bar carries '+FOLD.widths[1600].Field.by.tabbar+' of the '
   +FOLD.widths[1600].Field.total+' controls above the fold on the landing surface at 1600.'],
  keeps:['Angela','Ana','Marcus'],
  file:'atuned_src/shell/body.html, atuned_src/ui/nav.js',
  cost:'Three days. The integers are identity and may not be renumbered, so this is display order and a parent layer, not a renaming.',
  apply(){K.menu=true;}},
 {id:'C8', nm:'The rails ship folded',
  what:'Every section in both rails ships shut with its header showing, and the fold state is remembered. The mechanism is already there: every section already has a header that folds it.',
  traces:['F6'],
  facts:['Measured at 1600: the left rail carries '+FOLD.widths[1600].Field.by.leftrail
   +' of the '+FOLD.widths[1600].Field.total+' controls above the fold on the landing surface, and '
   +FOLD.widths[1600].Field.rail.leftrail.body+' of those sit inside a section body.',
   'At 390 both rails are already off screen, so this change is worth nothing on a phone.'],
  keeps:['Derek','Marcus'],
  file:'atuned_src/shell/head.html, and a stored preference',
  cost:'A day. A default and a remembered state.',
  apply(){K.foldRails=true;}},
 {id:'C8b', nm:'The top collapses to two',
  what:'The top carries the same seven controls above the fold on every surface at both widths. Two stay, who is signed in and one menu, and the rest go behind it.',
  traces:['F6'],
  facts:['Measured: '+FOLD.widths[1600].Field.by.top+' controls in the top at 1600 and '
   +FOLD.widths[390].Field.by.top+' at 390, on every one of the '
   +Object.keys(FOLD.widths[390]).length+' surfaces.'],
  keeps:['Angela','Ana','James'],
  file:'atuned_src/shell/body.html',
  cost:'Two days, and the work is deciding what those five are for rather than moving them.',
  apply(){K.foldTop=true;}},
 {id:'C9', nm:'A way to hand it to somebody',
  what:'A control that produces a reading for another person, and the practitioner grant behind it with explicit consent, a visible list of who has sight, and revocation.',
  traces:['F12'],
  facts:['Measured: no refer, invite or send control on any surface.',
   'F12 was met by '+met('F12')+' of a thousand and attributed '+lost('F12')+' departures, '
   +((BASE.lost.F12||{by:[]}).by[0]||{n:0}).n+' of them Sofia, whose whole value is referral.'],
  keeps:['Sofia','Marcus','Angela'],
  file:'a new atuned_src/ui/share.js, the record boundary, and the consent surface',
  cost:'Two weeks. It is a consequential grant over somatic and psychological self report, so consent, the list and revocation are not optional and are most of the work.',
  apply(){K.refer=true;}},
 {id:'C10', nm:'A price, and an allowance with something behind it',
  what:'relCoolDown never reads relLeft, so the panel printed four patterns of the zero you have left and the run went ahead. The allowance is enforced, and a tier exists on a surface a person can reach.',
  traces:['F8'],
  facts:['Measured in the shipped app: "'+MEAS.loop.exhausted.quoted+'" and the run proceeded.',
   'Nothing on any surface a new arrival reaches names a price: '+M.money+' matches.'],
  keeps:[],
  file:'atuned_src/ui/release.js, and a tiers surface',
  cost:'One line for the enforcement. The tier ladder is already ruled in DECISIONS.md, so the surface is a week.',
  apply(){K.money=true; K.enforce=true;}},
 {id:'C11', nm:'The record arrives at sign in',
  what:'The quiz is taken in the funnel and the record is fetched at sign in, so the landing surface has a reading on a first arrival and nobody meets a sixty three question intake inside the app.',
  traces:['F7'],
  facts:['F7 was met by '+met('F7')+' of a thousand and attributed '+lost('F7')+' departures, '
   +((BASE.lost.F7||{by:[]}).by[0]||{n:0}).n+' of them Diane.',
   'James quits by day three '+(BASE.icp.James.quitBy3*100).toFixed(0)+' per cent of the time and his reason is that he will not be seen doing a worksheet.',
   'The landing surface reads unread on a blank profile, which costs a quarter of the first touch criterion.'],
  keeps:['Diane','James','Marcus'],
  file:'the record fetch seam, which is the one place the app gains network',
  cost:'The accounts fork. Weeks, and it is already ruled.',
  apply(){K.record=true;}},
 {id:'C12', nm:'Three defects that are simply true',
  what:'pracDays never reads the done flag, so a saved plan counts as a day practised. The headline rounds and the band does not, so 40.6 prints 41 beside Incoherent. One control is measured under the tap floor.',
  traces:['F11','F13'],
  facts:['F11 was met by '+met('F11')+' of a thousand, F13 by '+met('F13')+'.',
   'Measured at 390: '+M.small+' control under 44 by 44.'],
  keeps:['Sofia','Derek','Marcus','Angela'],
  file:'atuned_src/engine/ladder.js, atuned_src/ui/summary.js, atuned_src/shell/head.html',
  cost:'A day for all three.',
  apply(){K.doneFlag=true; K.bandFix=true; K.tapFloor=true;}}];

/* ============================================================
   ONE MEASUREMENT, TO THE STOPPING RULE. The seed sequence is the baseline's,
   so every step is paired against it.
   ============================================================ */
function settle(label){
 const runs=[], totals=[], means=[];
 let held=0, settledAt=null;
 for(let i=1;i<=CEIL;i++){
  const r=runCohort(0x5eed*i+i*7919);
  runs.push(r); totals.push(r.grade.total);
  const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
  const move=means.length?Math.abs(mean-means[means.length-1]):null;
  means.push(mean);
  if(move!==null&&move<SETTLE&&i>=FLOOR){held++; if(held>=HOLD){settledAt=i; break;}}
  else held=0;}
 const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
 const rowKeys=runs[0].grade.rows.map(r=>r.k);
 const out={label:label, runs:runs.length, settledAt:settledAt,
  total:+mean.toFixed(2), letter:letterOf(mean), sd:+sd(totals).toFixed(3),
  lo:Math.min.apply(null,totals), hi:Math.max.apply(null,totals),
  rows:rowKeys.map((k,i)=>{const v=runs.map(r=>r.grade.rows[i].v);
   return {k:k, v:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2),
    moves:runs[0].grade.rows[i].moves, carried:!!runs[0].grade.rows[i].carried};}),
  d30:+(runs.reduce((a,r)=>a+r.retention[30],0)/runs.length).toFixed(5),
  d7:+(runs.reduce((a,r)=>a+r.retention[7],0)/runs.length).toFixed(5),
  d90:+(runs.reduce((a,r)=>a+r.retention[90],0)/runs.length).toFixed(5),
  loopEver:+(runs.reduce((a,r)=>a+r.loopEver,0)/runs.length).toFixed(4),
  readShare:+(runs.reduce((a,r)=>a+r.readShare,0)/runs.length).toFixed(4),
  inferShare:+(runs.reduce((a,r)=>a+r.inferShare,0)/runs.length).toFixed(4),
  stories:+(runs.reduce((a,r)=>a+r.totals.stories,0)/runs.length).toFixed(1),
  releases:+(runs.reduce((a,r)=>a+r.totals.releases,0)/runs.length).toFixed(1),
  minutes:+(runs.reduce((a,r)=>a+r.totals.minutes,0)/runs.length).toFixed(0),
  lostTop:(()=>{const o={};
   runs.forEach(r=>Object.keys(r.lost).forEach(k=>o[k]=(o[k]||0)+r.lost[k]/runs.length));
   return Object.keys(o).sort((a,b)=>o[b]-o[a]).slice(0,5)
    .map(k=>({k:k, n:Math.round(o[k]), nm:(FRICTION[k]||{}).nm||k}));})(),
  icp:(()=>{const o={};
   SHOWUP.forEach(sp=>{const rows=runs.map(r=>r.icp[sp.nm]);
    const m=f=>+(rows.reduce((a,r)=>a+(f(r)||0),0)/rows.length).toFixed(3);
    o[sp.nm]={d30:m(r=>r.ret[30]), d7:m(r=>r.ret[7]), sessions:m(r=>r.sessions),
     stories:m(r=>r.stories), releases:m(r=>r.releases), loopEver:m(r=>r.loopEver),
     cqDelta:m(r=>r.cqDelta), minutes:m(r=>r.minutes)};});
   return o;})()};
 return out;}

function run(label,applyFns){
 resetKnobs(); lexOn(false);
 applyFns.forEach(f=>f());
 if(K.lex)lexOn(true);
 remeasure();
 const t0=Date.now();
 const r=settle(label);
 r.seconds=Math.round((Date.now()-t0)/1000);
 r.knobs=JSON.parse(JSON.stringify(K));
 resetKnobs(); lexOn(false); remeasure();
 return r;}

/* THE FORMULA CEILING. What the grade can read if every criterion it can
   measure is perfect. Not a forecast: it is read off the ten formulas, and it is
   the answer to whether ninety is reachable at all. */
function formulaCeiling(){
 const rows=[
  {k:'ICP alignment', max:10, why:'every figure gets what they came for inside ninety days'},
  {k:'First touch', max:10, why:'boot under a second, twelve choices on the landing surface, the whole bar at 390, and a reading to show on arrival'},
  {k:'Core loop', max:10, why:'everybody closes the loop, and closes it twelve times'},
  {k:'Emotional', max:10, why:'every commit read, none of it inferred'},
  {k:'Behavioral flow', max:10, why:'twelve choices or fewer above the fold on every surface at both widths'},
  {k:'Visual and kinetic', max:8, why:'carried from the earlier run at 8. This pass built no instrument for it, and inventing one to gain two points would be writing the grade rather than earning it'},
  {k:'Technical', max:10, why:'no page errors, one request, nothing under the tap floor, boot under a second'},
  {k:'Monetization', max:10, why:'a price, a refer control, an enforced allowance, and most of a cohort reaching the end of the gift'},
  {k:'Retention', max:10, why:'35 per cent of arrivals active in the seven days ending at day thirty'},
  {k:'Referral', max:8, why:'the formula is five for a refer control plus five times six tenths for an export that exists. It cannot read ten'}];
 return {rows:rows, total:rows.reduce((a,r)=>a+r.max,0)};}

function main(){
 const ver=verifyRelease();
 if(!ver.ok){console.error('the lifted release disagrees with the shipped one'); process.exit(3);}
 const only=process.argv[2];
 console.log('release arithmetic verified. baseline settling.');
 const base=run('baseline',[]);
 console.log('baseline  '+base.total.toFixed(2)+' '+base.letter+'  '+base.runs+' runs  '
  +base.seconds+'s  d30 '+(base.d30*100).toFixed(2)+'%');

 /* SOLO. every change alone, on the baseline. */
 const solo=[];
 CHANGES.forEach(c=>{
  const r=run(c.id,[c.apply]);
  r.id=c.id; r.nm=c.nm; r.d=+(r.total-base.total).toFixed(2);
  solo.push(r);
  console.log(('solo '+c.id).padEnd(11)+r.total.toFixed(2)+'  d '+(r.d>=0?'+':'')+r.d.toFixed(2)
   +'   '+r.runs+' runs  '+r.seconds+'s  d30 '+(r.d30*100).toFixed(2)+'%  loop '
   +(r.loopEver*100).toFixed(1)+'%  read '+(r.readShare*100).toFixed(0)+'%');});

 let cum=null;
 if(only!=='solo'){
  /* CUMULATIVE, in descending solo order, and the soft step goes last whatever
     it scored so the curve can be read without it. */
  const order=solo.slice().filter(s=>!CHANGES.filter(c=>c.id===s.id)[0].soft)
   .sort((a,b)=>b.d-a.d).map(s=>s.id);
  const softIds=CHANGES.filter(c=>c.soft).map(c=>c.id);
  const seq=order.concat(softIds);
  const applied=[], steps=[];
  let prev=base.total;
  for(const id of seq){
   const c=CHANGES.filter(x=>x.id===id)[0];
   applied.push(c);
   const r=run('cum:'+id,applied.map(x=>x.apply));
   r.id=id; r.nm=c.nm;
   r.step=+(r.total-prev).toFixed(2); r.fromBase=+(r.total-base.total).toFixed(2);
   prev=r.total; steps.push(r);
   console.log(('cum  '+id).padEnd(11)+r.total.toFixed(2)+' '+r.letter+'  step '
    +(r.step>=0?'+':'')+r.step.toFixed(2)+'   '+r.runs+' runs  '+r.seconds+'s  d30 '
    +(r.d30*100).toFixed(2)+'%  loop '+(r.loopEver*100).toFixed(1)+'%');}
  cum={order:seq, steps:steps};}

 /* THE CEILING CASE, RE-DRIVEN. The finding under the baseline grade was that
    the loop returns a person to where they started. Whether the release changes
    move that is not a matter of retention, so it is measured on its own: ninety
    consecutive days of story, release and kept practice, no model in it. */
 const ceilRows=[];
 [['shipped',[]],
  ['C2a compounding',[()=>{K.relCompound=true;}]],
  ['C2b install to the pole',[()=>{K.relInstall=1.0;}]],
  ['C2c stays cleared',[()=>{K.relStick=true;}]],
  ['C2 all three',[()=>{K.relCompound=true;K.relInstall=1.0;K.relStick=true;}]],
  ['C2 and C3',[()=>{K.relCompound=true;K.relInstall=1.0;K.relStick=true;K.carrying=true;}]]]
 .forEach(([nm,fns])=>{
  resetKnobs(); fns.forEach(f=>f()); remeasure();
  const c=ceilingCase(5);
  ceilRows.push({nm:nm, cq0:c.cq0, cq90:c.cq90, best:c.best, worst:c.worst,
   clear:c.clear, ground:c.ground, band:c.band, marks:c.marks.length,
   ceiling:c.ceiling, curve:c.curve.map(x=>x.cq)});
  resetKnobs(); remeasure();});
 ceilRows.forEach(r=>console.log('ceiling  '+r.nm.padEnd(24)+r.cq0+' to '+r.cq90
  +'   opposite in at '+r.clear+' addresses   '+r.band));

 const out={stamp:MEAS.stamp, foldStamp:FOLD.stamp, drift:DRIFT,
  pinned:!!process.env.SIM_ROOT, fast:!!process.env.SIM_FAST,
  settle:{threshold:SETTLE, hold:HOLD, floor:FLOOR, ceiling:CEIL},
  cohort:COHORT, base:base, solo:solo, cum:cum,
  ceiling:ceilRows, formulaCeiling:formulaCeiling(),
  lex:LEX, lexEntries:LEXKEYS.length,
  changes:CHANGES.map(c=>({id:c.id, nm:c.nm, what:c.what, traces:c.traces,
   facts:c.facts, keeps:c.keeps, file:c.file, cost:c.cost, soft:!!c.soft,
   judged:c.judged||null,
   lost:c.traces.reduce((a,k)=>a+lost(k),0),
   met:c.traces.reduce((a,k)=>Math.max(a,met(k)),0)})),
  fold:FOLD.widths, measured:M};
 fs.writeFileSync(path.join(__dirname,'ninety.json'),JSON.stringify(out,null,1));
 const end=cum?cum.steps[cum.steps.length-1]:base;
 console.log('\nsim/ninety.json written. baseline '+base.total.toFixed(2)
  +' to '+end.total.toFixed(2)+' ('+end.letter+'). formula ceiling '
  +out.formulaCeiling.total+'.');}
main();
