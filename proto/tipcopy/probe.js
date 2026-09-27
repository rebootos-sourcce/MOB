const E=require(require('path').resolve('engine.js'));
const {S,CHARGES,SINAMES,PEOPLE,LAWSET,compute,buildSoul,W,CHILD}=E;
function rd(p){
 S.doms=p.doms?p.doms.slice():[p.dom]; S.arcs=p.arcs?p.arcs.slice():[p.a1,p.a2];
 S.roots=p.roots?p.roots.slice():[]; buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=(p.c&&p.c[c])||0; S.replace[c]=(p.rep&&p.rep[c])||0;});
 const LS=LAWSET[p.nm]||{_:E.LAW_DEFAULT};
 SINAMES.forEach(l=>{S.law[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:E.LAW_DEFAULT);E.LAW_UNSET[l]=false;});
 return compute();}
for(const nm of (process.argv[2]||'Tomas,James,Angela,Derek').split(',')){
 const p=PEOPLE.find(x=>x.nm===nm); if(!p){console.log('no',nm);continue;}
 const r=rd(p);
 const laws=SINAMES.map(l=>[l,+S.law[l]]).sort((a,b)=>a[1]-b[1]);
 const top=W.filter(n=>!n.field&&n.sq>=4).sort((a,b)=>b.sq-a.sq).slice(0,3);
 console.log('\n==',nm,'CQ',r.CQ.toFixed(1),'tier',r.tier,'| weakest law',laws[0][0],laws[0][1].toFixed(1),'| charge',JSON.stringify(Object.fromEntries(CHARGES.map(c=>[c,S.charge[c]]))));
 console.log(' character layers:',r.sups.map(o=>o.nm+' w'+o.w.toFixed(1)).join('; ')||'none');
 console.log(' hyper:',r.hys.map(o=>o.nm+' w'+o.w.toFixed(1)).join('; ')||'none');
 console.log(' heaviest pattern:',(r.sabs.slice().sort((a,b)=>b.w-a.w)[0]||{}).nm);
 top.forEach(n=>console.log(' node',n.i,n.k,'|',n.b,'|',n.n,'| axis',n.cf,'| theme',n.a,'| distorts as',n.d,'| held',n.held.toFixed(1),'rep',n.rep.toFixed(1),'sq',n.sq.toFixed(1),'susc',n.susc.toFixed(2)));
}
if(process.argv[3]==='solar'){const p=PEOPLE.find(x=>x.nm==='Tomas');rd(p);
 console.log('W length',W.length,'Tomas solar held',W.filter(n=>n.b==='Solar'&&n.sq>=4).length,'of',W.filter(n=>n.b==='Solar').length);
 const d=PEOPLE.find(x=>x.nm==='Derek');rd(d);const n=W.find(x=>x.i===2);console.log('Derek #2',n.k,n.held.toFixed(1),n.rep.toFixed(1),n.sq.toFixed(1),'rank',W.filter(x=>!x.field).sort((a,b)=>b.sq-a.sq).indexOf(n)+1);
 const f=W.find(x=>x.i===1);console.log('Derek #1',f.k,f.n,f.d,f.held.toFixed(1),f.rep.toFixed(1),f.sq.toFixed(1));}
