/* ============================================================
   INTEGRITY CHAIN PROBE. Loads the real built engine in plain node,
   seeds the field exactly the way ui/personas.js loadP() does on the
   engine side, and reads every path that claims to report integrity.

   THE PROBE IS CHECKED FIRST. Three known good cases, all of them
   assertions tests/engine.js already makes or that the codebase states
   in a comment. If any of them fails the numbers below are the probe's
   and not the product's, and this repository has twice been handed a
   probe's own bug as a defect.
     check 1  SI.length is 21, NODES.length is 112, W.length is 108
     check 2  compute() is deterministic: same seed, same CQ, twice
     check 3  the stated figure from engine/compute.js:148, which says
              a fresh profile on the default 6 comes out CQ 36
   ============================================================ */
/* cqCeiling() and cqHeadroom() are NOT in engine/export.js, so require() cannot
   see them and tests/engine.js cannot reach them either. That is itself a finding.
   To read them at all the engine source is run in a function scope and the two
   are handed back beside the exports. It is the same file, byte for byte, and the
   three probe checks below are run against THIS instance, not against a second
   one, so the numbers come from the same engine the product ships. */
const _src=require('fs').readFileSync('/home/user/MOB/engine.js','utf8');
const _m={exports:{}};
const E=new Function('module','exports','require',
 _src+'\n;return Object.assign({},module.exports,{cqCeiling:cqCeiling,cqHeadroom:cqHeadroom});'
)(_m,_m.exports,require);
const {S,SI,SINAMES,BANDS,W,NODES,CHARGES,PEOPLE,LAWSET,
       compute,buildSoul,bandIg,accuracy,cqCeiling,cqHeadroom,
       iqScore,blankProfile,iqList}=E;

let broken=0;
function chk(name,cond,got){
 console.log((cond?'  ok   ':'  BAD  ')+name+'   '+got);
 if(!cond)broken++;}

console.log('PROBE CHECKS');
chk('21 laws / 112 nodes / 108 addresses',
 SI.length===21&&NODES.length===112&&W.length===108,
 SI.length+' / '+NODES.length+' / '+W.length);

function seed(nm){
 const p=PEOPLE.filter(x=>x.nm===nm)[0];
 if(!p)throw new Error('no persona '+nm);
 S.dom=p.dom;S.a1=p.a1;S.a2=p.a2;
 S.doms=p.doms?p.doms.slice():[p.dom];
 S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[];
 buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
                     S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=p.law||LAWSET[p.nm]||{_:5.5};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:((LS._!==undefined)?LS._:5.5);});
 return compute();}

const a=seed('Diane').CQ, b=seed('Diane').CQ;
chk('compute() deterministic on Diane', a===b, a+' twice');

/* the stated case: default 6 on all 21, and the engine's own comment at
   compute.js:148 says it comes out 36. */
S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
SINAMES.forEach(l=>{S.law[l]=6;});
const r6=compute();
chk('blank field, all laws 6, CQ reads 36 as compute.js:148 states',
 Math.round(r6.CQ)===36, 'CQ '+r6.CQ.toFixed(2));

if(broken){console.log('\nPROBE BROKEN. '+broken+' check(s) failed. Nothing below counts.');process.exit(1);}
console.log('\n');

/* ============================================================
   PATH A   compute().Ig          the live integrity
   PATH B   mean of S.law / 21    the raw law mean, what the feathers would draw
   PATH C   mean of bandIg / 7    the seven seats, summed
   PATH D   cqCeiling()           the SECOND copy of the Ig/It/CQ formula
   PATH E   accuracy().cov        the count of laws answered, not their value
   ============================================================ */
const names=['Gordon','Tomas','James','Ana','Diane','Marcus','Sofia','Wren','Abraham','Lance','Rosa'];
const pad=(s,n)=>String(s).padEnd(n);
console.log('PER PROFILE, EVERY PATH THAT CLAIMS TO REPORT INTEGRITY');
console.log(pad('profile',9)+pad('A  Ig',8)+pad('B lawmean',10)+pad('C seatmean',11)
 +pad('A-B',8)+pad('B-C',8)+pad('It',7)+pad('Rz',7)+pad('CQ',7)+pad('It*Ig/Rz',10)+'ceiling');
const rows=[];
names.forEach(nm=>{
 const r=seed(nm);
 const lawmean=SINAMES.reduce((x,l)=>x+S.law[l],0)/21;
 const seatmean=BANDS.reduce((x,bd)=>x+bandIg(bd),0)/7;
 const hand=(r.It*r.Ig)/r.Rz;
 const ceil=cqCeiling();
 rows.push({nm,Ig:r.Ig,lawmean,seatmean,It:r.It,Rz:r.Rz,CQ:r.CQ,hand,ceil});
 console.log(pad(nm,9)
  +pad(r.Ig.toFixed(3),8)+pad(lawmean.toFixed(3),10)+pad(seatmean.toFixed(3),11)
  +pad((r.Ig-lawmean).toFixed(3),8)+pad((lawmean-seatmean).toFixed(3),8)
  +pad(r.It.toFixed(2),7)+pad(r.Rz.toFixed(3),7)+pad(r.CQ.toFixed(2),7)
  +pad(hand.toFixed(2),10)+ceil.toFixed(2));});

console.log('\nIDENTITY CHECK  CQ === clamp(It*Ig/Rz)');
let idbad=0;
rows.forEach(x=>{if(Math.abs(x.CQ-Math.min(100,Math.max(0,x.hand)))>1e-9){idbad++;
 console.log('  BREAKS on '+x.nm+': CQ '+x.CQ+' vs It*Ig/Rz '+x.hand);}});
console.log('  '+(rows.length-idbad)+' of '+rows.length+' profiles hold the identity exactly');

/* ============================================================
   THE TWO COPIES OF THE FORMULA. cqCeiling() retypes Ig, It, CQ.
   With charge and replacement both at zero its inputs are identical to
   compute()'s, so the two must return the same number. If they do not,
   the copies have already drifted.
   ============================================================ */
console.log('\nTHE SECOND COPY. charge 0, replace 0, so cqCeiling() inputs equal compute()\'s.');
console.log(pad('lawmean',9)+pad('compute CQ',12)+'cqCeiling()');
let copybad=0;
[1,3,6,6.5,8,10].forEach(v=>{
 S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
 SINAMES.forEach(l=>{S.law[l]=v;});
 const r=compute(), c=cqCeiling();
 if(Math.abs(r.CQ-c)>1e-9)copybad++;
 console.log(pad(v,9)+pad(r.CQ.toFixed(6),12)+c.toFixed(6)
  +(Math.abs(r.CQ-c)>1e-9?'   DISAGREE by '+(c-r.CQ).toFixed(6):''));});
console.log('  the two copies agree on '+(6-copybad)+' of 6 cases');

/* ============================================================
   WHAT THE FEATHERS WOULD DRAW AGAINST WHAT THE CORE IS.
   The feathers draw S.law[nm]/10 and bandIg(b)/10. The core is CQ.
   ============================================================ */
console.log('\nWHAT A FEATHER WOULD DRAW vs WHAT THE CORE IS SIZED BY');
console.log(pad('profile',9)+pad('CQ',8)+pad('mean feather len',18)+'spread of the 21');
names.forEach(nm=>{
 const r=seed(nm);
 const v=SINAMES.map(l=>S.law[l]);
 const mean=v.reduce((a,b)=>a+b,0)/21;
 console.log(pad(nm,9)+pad(r.CQ.toFixed(1),8)+pad((mean/10).toFixed(3),18)
  +(Math.min.apply(null,v)).toFixed(1)+' to '+(Math.max.apply(null,v)).toFixed(1));});

/* ============================================================
   THE BLANK PROFILE. What the drawing says about a person who has
   entered nothing.
   ============================================================ */
console.log('\nTHE BLANK PROFILE');
S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
SINAMES.forEach(l=>{S.law[l]=6;});          /* LAW_DEFAULT from schema.js:76 */
const rb=compute();
console.log('  LAW_DEFAULT (schema.js:76) is 6, not 6.5');
console.log('  blank: CQ '+rb.CQ.toFixed(1)+', Ig '+rb.Ig.toFixed(2)
 +', unread '+rb.unread+', all 21 feathers at '+(6/10).toFixed(2)+' of the rim');
const bp=blankProfile('probe');
console.log('  blankProfile().laws keys: '+Object.keys(bp.laws||{}).length+' of 21');
console.log('  accuracy on a blank profile: '+accuracy(rb,bp).pct.toFixed(1)
 +'%, cov '+accuracy(rb,bp).cov+' of 21');
