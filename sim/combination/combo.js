/* ============================================================
   THE COMBINATION. WHICH SET, AND WHAT INTERACTS.

   The chase to ninety in sim/ninety.js tested seventeen changes one at a time
   and then stacked them in descending solo order. That answers "which change
   first". It does not answer the owner's question, which is which COMBINATION,
   because a stack in solo order is one path through a space of sixty five
   thousand and the path it takes assumes the changes add up. They do not, and
   last night's own page shows it: C2a scored minus 0.12 alone and minus 1.52
   on top of fourteen other changes.

   This file is that second search. It does not rewrite the harness, it drives
   it: sim/harness.js is required unchanged, the changes and their exact knob
   states are read out of sim/ninety.json rather than retyped, the stopping rule
   is the harness's own, and the seed sequence is the baseline's so every
   measurement is paired against it person by person.

   WHAT A POINT IS STILL WORTH. Nothing here lowers a friction cost, raises an
   opening rate, reweights a criterion or grades a different thing. Every knob
   is one of the seventeen named product changes, with the file it lands in, and
   the knob states are literally the ones last night's run recorded.

   THREE THINGS ARE MEASURED PER COMBINATION AND THEY ARE NOT THE SAME THING.

     grade          the ten criteria, unchanged, out of a hundred. the common
                    currency with last night.
     satisfaction   the four criteria that read a person's experience off the
                    cohort, out of forty: ICP alignment, Core loop, Emotional,
                    Retention. Not a reweighting: the four formulas are the
                    harness's own and untouched. What is left out is left out
                    because it describes the product or the business rather than
                    the person: First touch, Behavioral flow, Visual, Technical
                    are measured off the shell and not off anybody, Monetization
                    is the seller's satisfaction, and Referral is a mechanism
                    count.
     transformation did the reading move. two readouts, both off runs.
                    CEILING is the ninety day ceiling case, one person who does
                    everything right, no showup model in it at all, so it is the
                    cleanest transformation figure this repository has: the
                    reading it starts on, the reading it ends on, and the
                    addresses left holding the opposite.
                    COHORT is the cohort's own, weighted across the roster over
                    everybody who opened the file at all and not only the
                    survivors, which is the figure that carries the model.

   Run:
     node sim/combination/combo.js solo            every change alone
     node sim/combination/combo.js pairs [i n]     every pair, shard i of n
     node sim/combination/combo.js lattice         the ceiling lattice, exhaustive
     node sim/combination/combo.js sets FILE       named sets, measured
     node sim/combination/combo.js merge           one combination.json

   It refuses to run unpinned. Two seats are live in atuned_src and the working
   copy of the build moves while this runs, so SIM_ROOT must name the pin and
   its md5 is stamped into everything written here.
   ============================================================ */
const fs=require('fs'), path=require('path'), cp=require('child_process');
const DIR=__dirname, SIMD=path.resolve(DIR,'..'), REPO=path.resolve(DIR,'..','..');
if(!process.env.SIM_ROOT){
 console.error('SIM_ROOT is not set. This measures a build, so it names one:');
 console.error('  SIM_ROOT='+path.join(SIMD,'pin')+' node sim/combination/combo.js ...');
 process.exit(2);}
const H=require(path.join(SIMD,'harness.js'));
const {K,resetKnobs,remeasure,runCohort,letterOf,ceilingCase,verifyRelease,sd,
 SETTLE,HOLD,FLOOR,CEIL,COHORT,SHOWUP,MEAS,FOLD,E}=H;
const NJ=path.join(SIMD,'ninety.json');
if(!fs.existsSync(NJ)){console.error('sim/ninety.json is missing. Run sim/ninety.js first.');process.exit(2);}
const NINETY=JSON.parse(fs.readFileSync(NJ,'utf8'));
const {PATCH}=require(path.join(SIMD,'lexpatch.js'));
const md5=f=>{try{return cp.execSync('md5sum '+JSON.stringify(f)).toString().split(' ')[0];}
 catch(err){return 'absent';}};
const PIN={root:path.resolve(process.env.SIM_ROOT),
 src:md5(path.join(path.resolve(process.env.SIM_ROOT),'source.html')),
 engine:md5(path.join(path.resolve(process.env.SIM_ROOT),'engine.js')),
 worktreeSrc:md5(path.join(REPO,'source.html')),
 stampSrc:MEAS.stamp.src, stampCommit:MEAS.stamp.commit};
if(PIN.src!==MEAS.stamp.src){
 console.error('the pinned build is not the build measured.json was taken off.');
 console.error('  pin '+PIN.src+'  measured '+MEAS.stamp.src);
 process.exit(2);}
if(process.env.SIM_FAST){console.error('SIM_FAST produces no deliverable here. Refusing.');process.exit(2);}

/* ============================================================
   THE CHANGES, AND THE KNOB STATE EACH ONE PRODUCES, READ OFF LAST NIGHT'S RUN.

   sim/ninety.js is not required here because it runs on load. Retyping its
   seventeen apply functions would be a second implementation pretending to be
   the same one, so instead every change's knob state is read out of the
   `knobs` field sim/ninety.json already records for each solo measurement, and
   a change is applied as the DIFF between that state and the baseline's. That
   makes composition mechanical rather than a judgement, and it makes a
   conflict visible: two changes that write the same knob are reported.
   ============================================================ */
const BASEK=NINETY.base.knobs;
const CH=NINETY.solo.map(s=>{
 const meta=NINETY.changes.filter(c=>c.id===s.id)[0]||{};
 const diff={};
 Object.keys(s.knobs).forEach(k=>{
  if(JSON.stringify(s.knobs[k])!==JSON.stringify(BASEK[k]))diff[k]=s.knobs[k];});
 return {id:s.id, nm:s.nm, diff:diff, soloGrade:s.total, soloD:s.d,
  what:meta.what||'', file:meta.file||'', cost:meta.cost||'', traces:meta.traces||[],
  soft:!!meta.soft, judged:meta.judged||null, lost:meta.lost||0, met:meta.met||0};});
if(!CH.length){console.error('no changes in sim/ninety.json');process.exit(2);}
const BYID={}; CH.forEach(c=>BYID[c.id]=c);
/* THE SOFT STEP STAYS OUT OF THE SEARCH AND IS RUN BESIDE IT. C6n is a return
   rate a notification would buy and nothing measures it. It is the one knob in
   the harness that is not a product change, so it may not be inside a
   combination that is then reported as the answer. Every reported set is run
   twice, with it and without, and both numbers are printed. */
const SOFT='C6n';
const FREE=CH.filter(c=>c.id!==SOFT).map(c=>c.id);

function applySet(ids,withSoft){
 resetKnobs(); lexOff();
 const wrote={}, clash=[];
 ids.concat(withSoft?[SOFT]:[]).forEach(id=>{
  const c=BYID[id];
  if(!c)throw new Error('no such change '+id);
  Object.keys(c.diff).forEach(k=>{
   if(wrote[k]&&wrote[k]!==id&&JSON.stringify(K[k])!==JSON.stringify(c.diff[k]))
    clash.push(k+': '+wrote[k]+' and '+id);
   K[k]=c.diff[k]; wrote[k]=id;});});
 if(K.lex)lexOn();
 remeasure();
 return clash;}
const LEXKEYS=Object.keys(PATCH).filter(k=>!E.LEX[k]);
function lexOn(){LEXKEYS.forEach(k=>{E.LEX[k]=PATCH[k];});}
function lexOff(){LEXKEYS.forEach(k=>{delete E.LEX[k];});}

/* ============================================================
   ONE MEASUREMENT, TO THE HARNESS'S OWN STOPPING RULE.
   ============================================================ */
const SATK=['ICP alignment','Core loop','Emotional','Retention'];
function weightedExitDelta(r){
 const tot=Object.keys(r.icp).reduce((a,k)=>a+r.icp[k].n,0);
 return Object.keys(r.icp).reduce((a,k)=>
  a+((r.icp[k].exit||{}).cqDelta||0)*r.icp[k].n,0)/Math.max(1,tot);}
function weightedSurvDelta(r){
 let n=0,s=0;
 Object.keys(r.icp).forEach(k=>{const row=r.icp[k];
  if(row.cqDelta==null)return; n+=row.survivors; s+=row.cqDelta*row.survivors;});
 return n?s/n:0;}
function settle(){
 const runs=[],totals=[],means=[];
 let held=0, settledAt=null;
 for(let i=1;i<=CEIL;i++){
  const r=runCohort(0x5eed*i+i*7919);
  runs.push(r); totals.push(r.grade.total);
  const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
  const move=means.length?Math.abs(mean-means[means.length-1]):null;
  means.push(mean);
  if(move!==null&&move<SETTLE&&i>=FLOOR){held++; if(held>=HOLD){settledAt=i;break;}}
  else held=0;}
 const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
 const keys=runs[0].grade.rows.map(r=>r.k);
 const rows=keys.map((k,i)=>{const v=runs.map(r=>r.grade.rows[i].v);
  return {k:k, v:+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(3), sd:+sd(v).toFixed(3)};});
 const avg=f=>+(runs.reduce((a,r)=>a+f(r),0)/runs.length);
 const sat=rows.filter(r=>SATK.indexOf(r.k)>=0).reduce((a,r)=>a+r.v,0);
 return {runs:runs.length, settledAt:settledAt,
  grade:+mean.toFixed(2), letter:letterOf(mean), gradeSd:+sd(totals).toFixed(3),
  lo:Math.min.apply(null,totals), hi:Math.max.apply(null,totals),
  rows:rows, sat:+sat.toFixed(2),
  satRows:rows.filter(r=>SATK.indexOf(r.k)>=0).map(r=>({k:r.k,v:r.v})),
  d7:+avg(r=>r.retention[7]).toFixed(5), d30:+avg(r=>r.retention[30]).toFixed(5),
  d90:+avg(r=>r.retention[90]).toFixed(5),
  loopEver:+avg(r=>r.loopEver).toFixed(4),
  readShare:+avg(r=>r.readShare).toFixed(4), inferShare:+avg(r=>r.inferShare).toFixed(4),
  keptShare:+avg(r=>r.keptShare).toFixed(4),
  stories:+avg(r=>r.totals.stories).toFixed(1), releases:+avg(r=>r.totals.releases).toFixed(1),
  minutes:+avg(r=>r.totals.minutes).toFixed(0),
  cohortDelta:+avg(weightedExitDelta).toFixed(3),
  survDelta:+avg(weightedSurvDelta).toFixed(3),
  lostTop:(()=>{const o={};
   runs.forEach(r=>Object.keys(r.lost).forEach(k=>o[k]=(o[k]||0)+r.lost[k]/runs.length));
   return Object.keys(o).sort((a,b)=>o[b]-o[a]).slice(0,4)
    .map(k=>({k:k,n:Math.round(o[k])}));})(),
  icp:(()=>{const o={};
   SHOWUP.forEach(sp=>{const rows2=runs.map(r=>r.icp[sp.nm]);
    const m=f=>+(rows2.reduce((a,r)=>a+(f(r)||0),0)/rows2.length).toFixed(3);
    o[sp.nm]={d30:m(r=>r.ret[30]), sessions:m(r=>r.sessions), stories:m(r=>r.stories),
     releases:m(r=>r.releases), loopEver:m(r=>r.loopEver),
     exitDelta:m(r=>(r.exit||{}).cqDelta), survDelta:m(r=>r.cqDelta)};});
   return o;})()};}

/* THE CEILING CASE UNDER THE SAME KNOBS. Deterministic, one person, ninety days
   of story, release and kept practice, no showup model. Four intake centres,
   because a level two and a level seven start on different readings and the
   movement is not the same. */
function ceilingUnder(){
 const out={};
 [['none',null],['low',3],['mid',5],['high',7]].forEach(([nm,c])=>{
  const r=ceilingCase(c);
  out[nm]={cq0:r.cq0, cq90:r.cq90, move:+(r.cq90-r.cq0).toFixed(2),
   best:r.best, worst:r.worst, clear:r.clear, ground:r.ground, band:r.band,
   marks:r.marks.length, accuracy:r.accuracy, ceiling:r.ceiling};});
 out.move=out.mid.move;
 return out;}

function measure(ids,withSoft,label){
 const t0=Date.now();
 const clash=applySet(ids,withSoft);
 const ceil=ceilingUnder();
 const s=settle();
 s.ids=ids.slice(); s.soft=!!withSoft; s.label=label||ids.join('+')||'baseline';
 s.n=ids.length; s.clash=clash; s.ceiling=ceil;
 s.seconds=Math.round((Date.now()-t0)/1000);
 s.knobs=JSON.parse(JSON.stringify(K));
 resetKnobs(); lexOff(); remeasure();
 return s;}

/* ============================================================
   THE SHARD FILE. Every measurement is appended to its own file as it lands, so
   a container restart costs one measurement and not a night. This session lost
   an hour to one last night.
   ============================================================ */
function shardPath(nm){return path.join(DIR,'out-'+nm+'.json');}
function loadShard(nm){const p=shardPath(nm);
 return fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):{pin:PIN,rows:[]};}
function pushShard(nm,row){const d=loadShard(nm); d.pin=PIN;
 d.rows=d.rows.filter(r=>r.label!==row.label); d.rows.push(row);
 fs.writeFileSync(shardPath(nm),JSON.stringify(d,null,1));}
function done(nm){const d=loadShard(nm); const o={}; d.rows.forEach(r=>o[r.label]=1); return o;}

function line(r){
 return (r.label+'                                   ').slice(0,34)
  +' g '+r.grade.toFixed(2).padStart(6)+' '+r.letter.padEnd(3)
  +' sat '+r.sat.toFixed(2).padStart(6)
  +' ceil '+r.ceiling.mid.move.toFixed(2).padStart(5)
  +' coh '+r.cohortDelta.toFixed(2).padStart(7)
  +' runs '+String(r.runs).padStart(3)+' '+r.seconds+'s';}

function main(){
 const cmd=process.argv[2]||'solo';
 const ver=verifyRelease();
 if(!ver.ok){console.error('the lifted release disagrees with the shipped one');
  ver.bad.forEach(b=>console.error('  '+b)); process.exit(3);}
 if(cmd==='base'){
  const r=measure([],false,'baseline');
  pushShard('base',r);
  const rs=measure([],true,'baseline+soft'); pushShard('base',rs);
  console.log(line(r)); console.log(line(rs));
  /* THE CHECK THAT THIS FILE IS DRIVING THE SAME INSTRUMENT. The baseline here
     must reproduce last night's baseline exactly, because it is the same
     harness, the same rule and the same seeds. If it does not, nothing below is
     comparable with sim/ninety.json and the page must not be built. */
  const want=NINETY.base.total;
  console.log('baseline against sim/ninety.json: '+r.grade.toFixed(2)+' vs '+want.toFixed(2)
   +(Math.abs(r.grade-want)<0.005?'  same instrument':'  DIFFERENT, stop'));
  return;}
 if(cmd==='solo'){
  const have=done('solo');
  CH.forEach(c=>{
   if(have[c.id])return;
   const r=measure([c.id],false,c.id);
   /* the solo grade must reproduce last night's, for the same reason */
   r.checkAgainstNinety={want:c.soloGrade, got:r.grade, same:Math.abs(r.grade-c.soloGrade)<0.005};
   pushShard('solo',r);
   console.log(line(r)+(r.checkAgainstNinety.same?'  =ninety':'  MISMATCH '+c.soloGrade));});
  return;}
 if(cmd==='pairs'){
  const shard=+(process.argv[3]||0), of=+(process.argv[4]||1);
  const pairs=[];
  for(let i=0;i<FREE.length;i++)for(let j=i+1;j<FREE.length;j++)pairs.push([FREE[i],FREE[j]]);
  const nm='pairs'+shard;
  const have=done(nm);
  pairs.forEach((p,idx)=>{
   if(idx%of!==shard)return;
   const label=p.join('+');
   if(have[label])return;
   const r=measure(p,false,label);
   pushShard(nm,r);
   console.log(line(r));});
  return;}
 if(cmd==='sets'){
  const file=process.argv[3];
  if(!file){console.error('sets needs a json file of {label:[ids]}');process.exit(2);}
  const spec=JSON.parse(fs.readFileSync(file,'utf8'));
  const nm='sets'+(process.argv[4]||'');
  const have=done(nm);
  /* a set is either a list of ids, or {ids, soft} where soft asks for the second
     run with the return rate turned on. The soft run is never the reported
     answer and it is labelled so on the page. */
  Object.keys(spec).forEach(label=>{
   const v=spec[label], ids=Array.isArray(v)?v:v.ids, wantSoft=Array.isArray(v)?false:!!v.soft;
   if(!have[label]){const r=measure(ids,false,label); pushShard(nm,r); console.log(line(r));}
   if(wantSoft){const l2=label+' with the return rate';
    if(!have[l2]){const r2=measure(ids,true,l2); pushShard(nm,r2); console.log(line(r2));}}});
  return;}
 if(cmd==='lattice'){
  /* ============================================================
     THE TRANSFORMATION LATTICE, EXHAUSTIVE.

     The ceiling case is deterministic and costs a tenth of a second, so the
     transformation half of this search does not need a model of the space: it
     can enumerate it. First, mechanically, which changes can move it at all:
     every change is run alone against the shipped ceiling and the ones that do
     not move it are proved irrelevant rather than argued irrelevant. Then every
     combination of the ones that can is run, at all four intake centres.
     ============================================================ */
  resetKnobs(); lexOff(); remeasure();
  const ship=ceilingUnder();
  const moves=[], still=[];
  CH.forEach(c=>{
   applySet([c.id],false);
   const r=ceilingUnder();
   const d=['none','low','mid','high'].some(k=>Math.abs(r[k].move-ship[k].move)>0.0001
    ||r[k].clear!==ship[k].clear||Math.abs(r[k].cq90-ship[k].cq90)>0.0001);
   (d?moves:still).push({id:c.id, nm:c.nm, ceiling:r,
    dmove:+(r.mid.move-ship.mid.move).toFixed(3), dclear:r.mid.clear-ship.mid.clear});
   resetKnobs(); lexOff(); remeasure();});
  const ids=moves.map(m=>m.id);
  const rows=[];
  for(let mask=0;mask<(1<<ids.length);mask++){
   const set=ids.filter((x,i)=>mask&(1<<i));
   applySet(set,false);
   const r=ceilingUnder();
   rows.push({ids:set, label:set.join('+')||'shipped', ceiling:r,
    move:r.mid.move, clear:r.mid.clear, cq90:r.mid.cq90});
   resetKnobs(); lexOff(); remeasure();}
  const out={pin:PIN, shipped:ship, moves:moves, still:still, rows:rows,
   when:new Date().toISOString()};
  fs.writeFileSync(path.join(DIR,'out-lattice.json'),JSON.stringify(out,null,1));
  console.log('ceiling movers: '+moves.map(m=>m.id+' '+m.dmove).join(', '));
  console.log('proved irrelevant to the ceiling: '+still.map(s=>s.id).join(', '));
  rows.slice().sort((a,b)=>b.move-a.move).slice(0,8).forEach(r=>
   console.log('  '+(r.label+'                               ').slice(0,32)
    +' move '+r.move.toFixed(2)+'  opposite in at '+r.clear));
  return;}
 if(cmd==='merge'){
  const rows=[];
  fs.readdirSync(DIR).filter(f=>/^out-(base|solo|pairs|sets).*\.json$/.test(f))
   .forEach(f=>{const d=JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8'));
    d.rows.forEach(r=>{r.src=f; rows.push(r);});});
  const lat=path.join(DIR,'out-lattice.json');
  const out={pin:PIN, stamp:MEAS.stamp, foldStamp:FOLD.stamp,
   settle:{threshold:SETTLE,hold:HOLD,floor:FLOOR,ceiling:CEIL}, cohort:COHORT,
   satCriteria:SATK, soft:SOFT, free:FREE,
   changes:CH, ninety:{base:NINETY.base.total, peak:NINETY.cum.steps.reduce((a,s)=>
    s.total>a.total?s:a,{total:0}), formulaCeiling:NINETY.formulaCeiling.total,
    cum:NINETY.cum.steps.map(s=>({id:s.id,total:s.total,step:s.step})),
    solo:NINETY.solo.map(s=>({id:s.id,total:s.total,d:s.d}))},
   rows:rows, lattice:fs.existsSync(lat)?JSON.parse(fs.readFileSync(lat,'utf8')):null,
   when:new Date().toISOString()};
  fs.writeFileSync(path.join(DIR,'combination.json'),JSON.stringify(out,null,1));
  console.log('sim/combination/combination.json written. '+rows.length+' measurements.');
  return;}
 console.error('unknown command '+cmd); process.exit(2);}
main();
