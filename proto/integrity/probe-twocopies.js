/* ============================================================
   THE TWO COPIES OF THE CQ FORMULA. engine/compute.js:124 to :140 computes
   Ig, It, Rz and CQ. engine/compute.js:264 to :276, inside cqCeiling(),
   retypes all four. The release panel at ui/release.js:177 prints
   cqHeadroom(), which is cqCeiling() minus CQ, as a sentence a person
   acts on: "Release has about 1.2 left to give you."

   They agree today. This measures what happens when one of them is edited
   and the other is not, which is the only thing a duplicated formula is
   ever a risk of. It is a simulation and is labelled as one: the edit is
   applied to the ENGINE SOURCE IN MEMORY, nothing on disk is touched, and
   the same edit is applied to one copy at a time so the effect is
   attributable.

   PROBE CHECK, first: with no edit at all, the two copies must agree to
   within floating point on a spread of law means. If they do not, the
   harness is wrong and the divergence below is the harness's.
   ============================================================ */
const fs=require('fs');
const SRC=fs.readFileSync('/home/user/MOB/engine.js','utf8');

/* the two literals. the first is the live Ig at compute.js:124, the second is
   the copy inside cqCeiling at :273. they are distinguishable by their text. */
const LIVE ="const Ig=clamp(SINAMES.reduce((a,l)=>a+S.law[l],0)/21 + poleMean*0.30 - JQ*0.42,0,10);";
const COPY ="const Ig=clamp(lawMean+poleMean*0.30-JQ*0.42,0,10);";

function load(src){
 const m={exports:{}};
 return new Function('module','exports','require',
  src+'\n;return Object.assign({},module.exports,{cqCeiling:cqCeiling,cqHeadroom:cqHeadroom});'
 )(m,m.exports,require);}

function run(E,charge){
 const {S,SINAMES,CHARGES,buildSoul,compute,cqCeiling,cqHeadroom}=E;
 const out=[];
 [2,4,6,8].forEach(v=>{
  S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=charge;S.replace[c]=0;});
  SINAMES.forEach(l=>{S.law[l]=v;});
  const r=compute();
  out.push({v, CQ:r.CQ, ceil:cqCeiling(), head:cqHeadroom(r.CQ)});});
 return out;}

console.log('PROBE CHECK  unedited, the two copies must agree');
{
 const E=load(SRC);
 const a=run(E,0);            /* charge 0, so cqCeiling's inputs equal compute's */
 let bad=0;
 a.forEach(x=>{if(Math.abs(x.CQ-x.ceil)>1e-9)bad++;});
 console.log('  law mean 2/4/6/8, charge 0:  '+(4-bad)+' of 4 agree exactly'
  +(bad?'   PROBE BROKEN':'   ok'));
 if(bad)process.exit(1);
}
console.log('');

console.log('THE EDIT. The live Ig coefficient on poleMean goes from 0.30 to 0.34,');
console.log('which is the size of tuning change this file records having made before.');
console.log('Only the copy at compute.js:124 is edited. cqCeiling keeps 0.30.');
console.log('');
const EDIT=SRC.replace(LIVE, LIVE.replace('poleMean*0.30','poleMean*0.34'));
if(EDIT===SRC){console.log('the live literal was not found, so the edit did not apply');process.exit(1);}
const E0=load(SRC), E1=load(EDIT);
/* charge 5 and replacement 0 gives a non zero poleMean only if replace is set,
   so run with the coherent opposite installed, which is what makes poleMean bite. */
function runPole(E,rep){
 const {S,SINAMES,CHARGES,buildSoul,compute,cqCeiling,cqHeadroom}=E;
 const out=[];
 [3,5,7,9].forEach(v=>{
  S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
  CHARGES.forEach(c=>{S.charge[c]=2;S.replace[c]=rep;});
  SINAMES.forEach(l=>{S.law[l]=v;});
  const r=compute();
  out.push({v, CQ:+r.CQ.toFixed(3), Ig:+r.Ig.toFixed(3),
   head:+cqHeadroom(r.CQ).toFixed(3)});});
 return out;}
const b0=runPole(E0,6), b1=runPole(E1,6);
console.log('nine axes held 2, coherent opposite installed 6');
console.log('lawmean   before: CQ / Ig / headroom        after: CQ / Ig / headroom     headroom moved');
for(let i=0;i<b0.length;i++){
 const a=b0[i], c=b1[i];
 console.log(String(a.v).padEnd(10)
  +(a.CQ+' / '+a.Ig+' / '+a.head).padEnd(34)
  +(c.CQ+' / '+c.Ig+' / '+c.head).padEnd(30)
  +((c.head-a.head)>0?'+':'')+(c.head-a.head).toFixed(3));}
console.log('');
console.log('The sentence a person reads at ui/release.js:177 is built from headroom.');
console.log('One coefficient changed in one of the two copies moves that sentence by');
console.log('up to '+Math.max.apply(null,b0.map((a,i)=>Math.abs(b1[i].head-a.head))).toFixed(2)
 +' of 100, and the gate cannot see it: cqCeiling and cqHeadroom are not in');
console.log('engine/export.js, so module.exports does not carry them and tests/engine.js');
console.log('cannot call either one.');
