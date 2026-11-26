/* J11 — an imported profile cannot grant itself a paid tier.
   It may carry a valid saved record of work but no JSON, file or fragment
   proves a Stripe subscription. The authenticated Worker billing read in
   ui/auth.js is the only path that restores a paid tier. This gate asserts
   the negative control; do not change it back into a watch that expects
   the self-grant vulnerability to remain open.
   Run after ./atuned_src/BUILD-engine.sh. */
const E=require(require('path').resolve(process.env.ENGINE||'engine.js'));
let P=0,F=0;
const ok=(c,m)=>{if(c){P++;}else{F++;console.log('  FAIL  '+m);}};
let store={};
E.bindStore(function(k){return store[k];},function(k,v){store[k]=v;});
const blank=E.blankProfile('attacker');
ok(blank.plan&&blank.plan.tier==='free','a new profile starts free');

function allLockedAsFree(pl){
 const s=E.planSight(pl);
 return s&&s.tier==='free'&&s.all===false
  &&Object.keys(s.sees).some(k=>s.sees[k]===false);
}

/* A file edited to claim tier four used to unlock every SIGHT layer. */
const forged=JSON.parse(JSON.stringify(blank));
forged.plan={tier:'four',status:'active',granted:1200,carried:0,
 base:0,since:null,until:null,ends:null};
const r=E.pImport(JSON.stringify(forged));
ok(!!r,'a well-formed backup still imports');
ok(r&&r.plan&&r.plan.tier==='free'&&r.plan.status==='',
 'a self-declared tier four is downgraded to the untrusted free baseline');
ok(r&&allLockedAsFree(r.plan),'paid sight is locked after an untrusted import');
ok(r&&r.name==='attacker'&&r.id,'record work and identity remain loadable');

/* Even the free tier's allowance fields are not a grant from a backup. */
const free=JSON.parse(JSON.stringify(blank));
free.name='forged allowance';
free.plan={tier:'free',status:'',granted:999,carried:999,base:0,
 since:null,until:null,ends:null};
const r2=E.pImport(JSON.stringify(free));
ok(r2&&r2.plan.tier==='free'&&r2.plan.granted===0&&r2.plan.carried===0,
 'the pasted free-tier grant and carry are also discarded');

/* Legitimate paid-backup holders are not promised offline payment proof.
   Signing back in must obtain the entitlement from /v1/me, not this file. */
const archived=JSON.parse(JSON.stringify(blank));
archived.name='subscription in backup';
archived.plan={tier:'two',status:'active',granted:800,carried:0,
 base:10,since:'2026-11-01T00:00:00Z',until:'2026-12-01T00:00:00Z',ends:null};
const r3=E.pImport(JSON.stringify(archived));
ok(r3&&allLockedAsFree(r3.plan),
 'a genuine-looking paid backup cannot stand in for server verification');
ok(r3&&r3.name==='subscription in backup',
 'the restored record remains present and can receive a server-verified tier');

const ordinary=JSON.parse(JSON.stringify(blank));
delete ordinary.plan;
const r4=E.pImport(JSON.stringify(ordinary));
ok(r4&&r4.plan.tier==='free','older imports with no plan stay free');

/* Exercise the real auth reader with a delayed, fake Worker response. No
   credentials, network, checkout or live account are used by this fixture. */
async function delayedReads(){
 const fs=require('fs'),vm=require('vm'),path=require('path');
 const source=fs.readFileSync(path.resolve(__dirname,'../atuned_src/ui/auth.js'),'utf8');
 const read=source.slice(source.indexOf('function authPlanRead(){'),source.indexOf('/* A PAGE LEFT OPEN ACROSS A RENEWAL'));
 const check=source.slice(source.indexOf('function authCheck(){'),source.indexOf('/* THE PAYWALL\'S HALF'));
 const sessionA={token:'fixture-a',email:'a@example.invalid',accountId:'a'};
 const sessionB={token:'fixture-b',email:'b@example.invalid',accountId:'b'};
 const recordA={id:'fixture-record-a'},recordB={id:'fixture-record-b'};
 let session=sessionA,pending,takes=0,arms=0,keeps=0,forgets=0,boots=0,requests=0;
 const billing={tier:'two',status:'active'};
 const ctx={CURP:recordA,AUTH_PLAN_READ_AT:0,authSession:()=>session,
  authCall:(method,url,body,token)=>{requests++;return new Promise(resolve=>{pending=resolve;});},
  authPlanTake:b=>{takes++;return b===billing?'live':'unexpected';},
  authPlanArm:()=>{arms++;},authBillingBack:()=>null,
  authKeep:()=>{keeps++;},authForget:()=>{forgets++;},
  authPlanBack:()=>{boots++;},profileSyncStart:()=>{},profileSyncStop:()=>{},status:()=>{}};
 vm.createContext(ctx);vm.runInContext(read+'\n'+check,ctx);
 const answer={ok:true,body:{account:{id:'a',email:'a@example.invalid'},billing}};
 let work=ctx.authPlanRead();pending(answer);let got=await work;
 ok(got.ok&&got.took==='live'&&takes===1&&arms===1,'same-session same-record server response reaches the plan writer');
 work=ctx.authPlanRead();session=null;pending(answer);got=await work;
 ok(!got.ok&&got.took==='stale'&&takes===1&&arms===1,'late paid response after sign out is discarded');
 session=sessionA;work=ctx.authPlanRead();session=sessionB;pending(answer);got=await work;
 ok(!got.ok&&got.took==='stale'&&takes===1,'late paid response after account switch is discarded');
 session=sessionA;work=ctx.authPlanRead();ctx.CURP=recordB;pending(answer);got=await work;
 ok(!got.ok&&got.took==='stale'&&takes===1,'late paid response cannot write to a different record');
 session=null;const before=requests;got=await ctx.authPlanRead();
 ok(!got.ok&&got.took==='signed out'&&requests===before,'signed-out restoration never requests billing');
 session=sessionA;ctx.CURP=recordA;work=ctx.authCheck();session=sessionB;
 pending({ok:true,body:{account:{id:'a',email:'changed@example.invalid'},billing}});
 ok(await work==='stale'&&keeps===0&&boots===0,'late boot success cannot replace the new session');
 session=sessionA;work=ctx.authCheck();session=sessionB;pending({ok:false,status:401});
 ok(await work==='stale'&&forgets===0,'late boot 401 cannot sign out a newer session');
}
delayedReads().catch(e=>{F++;console.error(e);}).then(()=>{
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);
});
