const E=require(require('path').resolve('engine.js'));const {S,CHARGES,SINAMES,PEOPLE,LAWSET,compute,buildSoul,W}=E;
const p=PEOPLE.find(x=>x.nm==='Derek');
S.doms=[p.dom];S.arcs=[p.a1,p.a2];S.roots=[];buildSoul();
CHARGES.forEach(c=>{S.charge[c]=p.c[c]||0;S.replace[c]=(p.rep&&p.rep[c])||0;});
const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};SINAMES.forEach(l=>{S.law[l]=LS[l]!==undefined?LS[l]:LS._;E.LAW_UNSET[l]=false;});
const r=compute();const n=W.find(x=>x.i===2);
const leaves=o=>o.kind==='sab'?o.parts:[].concat(...o.parts.map(leaves));
const own=[].concat(r.sups,r.hys,r.cxs,r.sabs).filter(o=>leaves(o).indexOf(n)>=0);
console.log(own.map(o=>o.kind+':'+o.nm+' '+o.w.toFixed(1)).join(' | '));
