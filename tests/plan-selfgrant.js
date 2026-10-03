/* J11, HELD OPEN ON PURPOSE AND WATCHED. PLAN.md: "SELF-GRANT, reproduced by
   QA in the architecture review: pImport accepts a record carrying
   plan:{tier:'four',status:'active'} and all 7 sight layers flip from locked
   to seen exactly as a real tier four." The fix for it is scoped elsewhere
   and deliberately not built here (it needs a server answer, per PLAN.md),
   so this gate is not a pass/fail on the bug. It is a watch: it fails loudly
   the day somebody closes the door without saying so, which would otherwise
   read as a silent behaviour change nobody asked for.

   Written 2 October alongside the worked-example tier-four unlock
   (atuned_src/ui/personas.js, loadP), to keep the two doors separate on the
   record. That change grants sight to a baked-in example by writing
   CURP.plan directly in loadP, after the boundary and never through it. This
   file is the proof the boundary itself was not touched: pImport still
   accepts a self-declared tier exactly as it did before.

   Run from the repo root, like the other gates: NODE_PATH=... node
   tests/plan-selfgrant.js, after ./atuned_src/BUILD-engine.sh. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
let P=0,F=0;
const ok=(c,m)=>{if(c){P++}else{F++;console.log('  FAIL  '+m)}};

let store={};
E.bindStore(function(k){return store[k];},function(k,v){store[k]=v;});

/* a stranger's own record, carrying nothing */
const blank=E.blankProfile('attacker');
ok(blank.plan&&blank.plan.tier==='free','a fresh record starts free, which is the case this bug matters for');

/* the same record, with a tier it was never sold, the way a person editing
   their own saved file or a pasted import could write it */
const poisoned=JSON.parse(JSON.stringify(blank));
poisoned.plan={tier:'four',status:'active',granted:0,carried:0,base:null,since:null,until:null};
const rec=E.pImport(JSON.stringify(poisoned));

ok(rec!==null,'pImport still accepts a record carrying its own plan (J11 open, as PLAN.md records)');
ok(rec&&rec.plan&&rec.plan.tier==='four'&&rec.plan.status==='active',
 'and the self-declared tier four round trips through the boundary unchanged');

const sight=rec?E.planSight(rec.plan):null;
ok(sight&&sight.all===true&&SIGHT_all(sight),
 'so every SIGHT layer reads open off a record nobody sold tier four to');
function SIGHT_all(s){return Object.keys(s.sees).every(function(k){return s.sees[k]===true;});}

/* THE OTHER DOOR STAYS SHUT. A worked example's tier four (loadP,
   ui/personas.js) must never be reachable by handing pImport a tier: that
   would mean the UI branch and the boundary bug are the same hole wearing
   two names instead of two separate, named facts. */
const notExample=JSON.parse(JSON.stringify(blank));
notExample.name='Not an example';
const rec2=E.pImport(JSON.stringify(notExample));
ok(rec2&&rec2.plan.tier==='free','an ordinary import with no plan field stays free: the example unlock never fires here');

console.log('\n===== '+P+' passed, '+F+' failed =====');
process.exit(F?1:0);
