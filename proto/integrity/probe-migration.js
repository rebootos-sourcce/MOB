/* ============================================================
   THE RENAME MIGRATION PROBE. engine/schema.js:101 carries
   LAWWAS={Justice:'Expression', Humility:'Discernment'}, which exists so a
   saved profile scored before the owner's rename does not lose those two
   readings. This asks whether that table is still reachable.

   PROBE CHECK, run first and on a known good case: the same migration is
   driven with a CURRENT name in the same slot. If the current name survives
   and the old one does not, the probe is reading the product and not itself.
   ============================================================ */
const _src=require('fs').readFileSync('/home/user/MOB/engine.js','utf8');
const _m={exports:{}};
const E=new Function('module','exports','require',_src+'\n;return module.exports;')(_m,_m.exports,require);
const {SI,SINAMES,S,blankProfile,loadProfile,validateProfile,bindStore}=E;

/* the engine may not touch the host, so the host binds storage. */
const MEM={};
bindStore(k=>MEM[k]===undefined?null:MEM[k],(k,v)=>{MEM[k]=v;return true;});

function mk(laws){
 const p=blankProfile('probe');
 const o=JSON.parse(JSON.stringify(p));
 o.laws=laws;
 return o;}

console.log('PROBE CHECK  a current name in the same slot must survive both routes');
{
 const o=mk({Justice:7.7});
 const v=validateProfile(o);
 console.log('  validateProfile ok        ', v.ok,
   ' laws.Justice kept as', v.ok?v.profile.laws.Justice:'(refused)');
 if(!v.ok||v.profile.laws.Justice!==7.7){console.log('  PROBE BROKEN'); process.exit(1);}
}
console.log('');

console.log('ROUTE ONE  loadProfile() direct, which is where LAWWAS lives');
{
 const o=mk({Expression:7.7, Discernment:3.3});
 loadProfile(o);
 console.log('  input had Expression 7.7 and Discernment 3.3, no Justice, no Humility');
 console.log('  after loadProfile: S.law.Justice ='+S.law.Justice
   +'   S.law.Humility ='+S.law.Humility);
 console.log('  p.laws now: '+JSON.stringify(o.laws));
 console.log('  migration '+((S.law.Justice===7.7&&S.law.Humility===3.3)?'FIRES':'does not fire'));
}
console.log('');

console.log('ROUTE TWO  validateProfile() first, which is what pImport() does at schema.js:667');
{
 const o=mk({Expression:7.7, Discernment:3.3});
 const v=validateProfile(o);
 console.log('  validateProfile ok:', v.ok, ' errors:', JSON.stringify(v.errs||[]));
 console.log('  v.profile.laws.Expression  =', v.profile.laws.Expression);
 console.log('  v.profile.laws.Discernment =', v.profile.laws.Discernment);
 loadProfile(v.profile);
 console.log('  after loadProfile(v.profile): S.law.Justice ='+S.law.Justice
   +'   S.law.Humility ='+S.law.Humility);
 console.log('  LAW_DEFAULT is 6, so a 6 here means the reading was lost silently.');
 console.log('  migration '+((S.law.Justice===7.7)?'FIRES':'DOES NOT FIRE, and nothing was reported'));
}
console.log('');

console.log('THE THREE BLANK VALUES FOR ONE LAW');
console.log('  engine/schema.js:76     LAW_DEFAULT      6');
console.log('  ui/personas.js:273      lawsFor fallback 5.5   (named in the schema.js:145 comment)');
console.log('  ui/personas.js:269      LAWSET.You._     6.5   (not named anywhere)');
const {compute,buildSoul,CHARGES}=E;
[6,5.5,6.5].forEach(v=>{
 S.dom=0;S.a1=0;S.a2=1;S.doms=[0];S.arcs=[0,1];S.roots=[];buildSoul();
 CHARGES.forEach(c=>{S.charge[c]=0;S.replace[c]=0;});
 SINAMES.forEach(l=>{S.law[l]=v;});
 const r=compute();
 console.log('  all 21 laws at '+v+'  ->  CQ '+r.CQ.toFixed(2)+', Ig '+r.Ig.toFixed(2)
   +', tier '+r.tier);});
