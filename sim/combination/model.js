/* ============================================================
   THE SEARCH, AND WHAT IS MEASURED VERSUS WHAT IS ONLY PREDICTED.

   Sixteen product changes make sixty five thousand five hundred and thirty six
   combinations and each one costs about a minute and a half to measure, so the
   space cannot be measured. Two things are done instead and they are not the
   same thing, so this file never mixes them in one column.

     MEASURED    the baseline, every change alone, every pair, and a greedy path
                 whose every step is a measurement: the best single change, then
                 every remaining change measured on top of it, then every
                 remaining change measured on top of that, and so on. The pair
                 pass is the second step of that path for free.
     PREDICTED   an additive model with the measured pair interactions added
                 back, used only to choose which sets are worth measuring. No
                 predicted number is reported as a result, and the page prints
                 the model's own error against the sets that were measured.

   Run:
     node sim/combination/model.js                  where the search stands
     node sim/combination/model.js next             write the next greedy step
     node sim/combination/model.js predict          rank the whole space
     node sim/combination/model.js cands            write the candidate sets
   ============================================================ */
const fs=require('fs'), path=require('path');
const DIR=__dirname;
function shards(){
 const rows=[];
 fs.readdirSync(DIR).filter(f=>/^out-(base|solo|pairs|sets|greedy).*\.json$/.test(f))
  .forEach(f=>{JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8')).rows
   .forEach(r=>{r.src=f; rows.push(r);});});
 return rows;}
const ROWS=shards();
const BY={}; ROWS.forEach(r=>{if(!r.soft)BY[r.ids.slice().sort().join('+')||'baseline']=r;});
const SOFT={}; ROWS.forEach(r=>{if(r.soft)SOFT[r.ids.slice().sort().join('+')||'baseline']=r;});
const key=ids=>ids.slice().sort().join('+')||'baseline';
const BASE=BY.baseline;
if(!BASE){console.error('no baseline measured. run combo.js base first.');process.exit(2);}
const NINETY=JSON.parse(fs.readFileSync(path.join(DIR,'..','ninety.json'),'utf8'));
const FREE=NINETY.solo.map(s=>s.id).filter(id=>id!=='C6n');
const solo=id=>BY[id];
const METRICS=[{k:'grade',nm:'grade'},{k:'sat',nm:'satisfaction'}];
const val=(r,m)=>m==='ceil'?r.ceiling.mid.move:r[m];

/* the pair interaction, measured: the pair minus the two alone, against the baseline */
function inter(a,b,m){
 const p=BY[key([a,b])]; if(!p||!solo(a)||!solo(b))return null;
 return +(val(p,m)-val(solo(a),m)-val(solo(b),m)+val(BASE,m)).toFixed(3);}
function predict(ids,m){
 let v=val(BASE,m);
 ids.forEach(a=>{v+=val(solo(a),m)-val(BASE,m);});
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
  const x=inter(ids[i],ids[j],m); if(x!==null)v+=x;}
 return +v.toFixed(2);}

/* ---------------------------------------------------------------- the greedy path */
function greedy(m){
 const path0=[], steps=[];
 let cur=[], best=val(BASE,m);
 for(;;){
  const cands=FREE.filter(id=>cur.indexOf(id)<0);
  const have=cands.map(id=>({id:id, r:BY[key(cur.concat([id]))]})).filter(x=>x.r);
  if(!have.length)break;
  have.sort((x,y)=>val(y.r,m)-val(x.r,m));
  const w=have[0];
  steps.push({add:w.id, set:cur.concat([w.id]), v:val(w.r,m),
   step:+(val(w.r,m)-best).toFixed(2), measured:have.length, of:cands.length,
   complete:have.length===cands.length});
  cur=cur.concat([w.id]); best=val(w.r,m);
  if(have.length<cands.length)break;}
 return steps;}

function nextStep(m){
 const g=greedy(m);
 const cur=g.length?g[g.length-1].set:[];
 const last=g.length?g[g.length-1]:null;
 if(last&&!last.complete)return {set:last.set.slice(0,-1), need:FREE
  .filter(id=>last.set.slice(0,-1).indexOf(id)<0)
  .filter(id=>!BY[key(last.set.slice(0,-1).concat([id]))])};
 return {set:cur, need:FREE.filter(id=>cur.indexOf(id)<0)
  .filter(id=>!BY[key(cur.concat([id]))])};}

function show(){
 console.log('measured sets: '+Object.keys(BY).length+' plus '+Object.keys(SOFT).length+' with the soft step');
 const pairs=Object.keys(BY).filter(k=>k.split('+').length===2).length;
 console.log('pairs '+pairs+' of '+(FREE.length*(FREE.length-1)/2));
 METRICS.concat([{k:'ceil',nm:'ceiling movement'}]).forEach(m=>{
  console.log('\ngreedy by '+m.nm+':');
  greedy(m.k).forEach((s,i)=>console.log('  '+(i+1)+'. +'+s.add.padEnd(4)
   +' '+String(val(BY[key(s.set)],m.k)).padStart(7)+'  step '+(s.step>=0?'+':'')+s.step
   +'  ('+s.measured+' of '+s.of+' measured)'+(s.complete?'':'  INCOMPLETE')));});
 const n=nextStep('sat');
 console.log('\nnext greedy step by satisfaction: on top of ['+n.set.join(' ')+'] still to measure '+n.need.length);}

function cands(){
 /* the sets worth measuring, and why each one is on the list */
 const out={};
 const all=FREE.slice();
 out['all sixteen']=all;
 /* last night's peak, in its own order, read out of the cumulative curve */
 const cum=NINETY.cum.steps.map(s=>s.id);
 let peakAt=0, peak=-1;
 NINETY.cum.steps.forEach((s,i)=>{if(s.total>peak){peak=s.total;peakAt=i;}});
 out['last night’s peak']=cum.slice(0,peakAt+1).filter(id=>id!=='C6n');
 /* the transformation set, off the exhaustive ceiling lattice */
 const lat=JSON.parse(fs.readFileSync(path.join(DIR,'out-lattice.json'),'utf8'));
 const bestT=lat.rows.slice().sort((a,b)=>b.move-a.move)[0];
 out['the transforming set']=bestT.ids;
 /* the predicted best by each metric, searched over the whole space by a hill
    climb from every single change, because the space is too big to enumerate
    with pair terms in the loop */
 METRICS.forEach(m=>{
  let bestSet=null, bestV=-1e9;
  FREE.forEach(seed=>{
   let cur=[seed], v=predict(cur,m.k), moved=true;
   while(moved){moved=false;
    FREE.forEach(id=>{
     const t=cur.indexOf(id)<0?cur.concat([id]):cur.filter(x=>x!==id);
     const tv=predict(t,m.k);
     if(tv>v+0.001){cur=t; v=tv; moved=true;}});}
   if(v>bestV){bestV=v; bestSet=cur;}});
  out['predicted best by '+m.nm]=bestSet.slice().sort();});
 /* and the best small sets by predicted satisfaction, because a plan that needs
    sixteen changes is not a plan */
 for(let k=2;k<=6;k++){
  let bestSet=null, bestV=-1e9;
  const pick=(start,cur)=>{
   if(cur.length===k){const v=predict(cur,'sat');
    if(v>bestV){bestV=v;bestSet=cur.slice();} return;}
   for(let i=start;i<FREE.length;i++)pick(i+1,cur.concat([FREE[i]]));};
  pick(0,[]);
  out['best '+k+' by satisfaction']=bestSet;}
 fs.writeFileSync(path.join(DIR,'cands.json'),JSON.stringify(out,null,1));
 Object.keys(out).forEach(k=>console.log((k+'                          ').slice(0,30)+out[k].join('+')));
 console.log('\nsim/combination/cands.json written.');}

const cmd=process.argv[2]||'show';
if(cmd==='show')show();
else if(cmd==='cands')cands();
else if(cmd==='next'){
 const m=process.argv[3]||'sat';
 const n=nextStep(m);
 const o={};
 n.need.forEach(id=>{o['greedy '+m+' '+n.set.concat([id]).join('+')]=n.set.concat([id]);});
 fs.writeFileSync(path.join(DIR,'nextstep.json'),JSON.stringify(o,null,1));
 console.log(Object.keys(o).length+' sets to measure on top of ['+n.set.join(' ')+']');}
else if(cmd==='predict'){
 METRICS.forEach(m=>{
  const rows=Object.keys(BY).map(k=>({k:k, ids:BY[k].ids, v:val(BY[k],m.k),
   p:predict(BY[k].ids,m.k)}));
  const err=rows.filter(r=>r.ids.length>2);
  const mae=err.length?err.reduce((a,r)=>a+Math.abs(r.v-r.p),0)/err.length:null;
  console.log(m.nm+': measured sets beyond a pair '+err.length
   +(mae===null?'':'  model mean absolute error '+mae.toFixed(2)));
  err.sort((a,b)=>Math.abs(b.v-b.p)-Math.abs(a.v-a.p)).slice(0,6).forEach(r=>
   console.log('   '+r.k.slice(0,60)+'  measured '+r.v+'  predicted '+r.p));});}
else {console.error('unknown command');process.exit(2);}
