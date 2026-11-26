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
 session=sessionA;ctx.CURP=recordA;work=ctx.authCheck();ctx.CURP=recordB;
 pending(answer);
 ok(await work==='stale'&&boots===0&&keeps===0&&arms===1,
  'late boot response cannot apply paid billing to a newly opened record');
 ctx.CURP=recordA;
 /* Two valid reads for the same signed-in account and record can race.
    Returning the older paid response last must never replay old billing. */
 session=sessionA;ctx.CURP=recordA;
 let finishFirst=null,finishLast=null;
 ctx.authCall=()=>{requests++;return new Promise(resolve=>{
  if(!finishFirst)finishFirst=resolve;else finishLast=resolve;});};
 work=ctx.authPlanRead();let newer=ctx.authPlanRead();
 finishLast(answer);let latest=await newer;
 finishFirst(answer);let older=await work;
 ok(latest.ok&&latest.took==='live'&&older.took==='stale'&&takes===2&&arms===2,
  'out-of-order successful billing reads apply only the newest response');
 /* Fail closed when the newest response could not be read. The older
    success cannot silently reinstate a plan with unknown freshness. */
 finishFirst=null;finishLast=null;
 work=ctx.authPlanRead();newer=ctx.authPlanRead();
 finishLast({ok:false,status:503});latest=await newer;
 finishFirst(answer);older=await work;
 ok(!latest.ok&&latest.took==='unread'&&older.took==='stale'&&takes===2&&arms===2,
  'unread newest response cannot be overwritten by an older paid reply');
}
/* Test the actual import UI seam without a browser or network. The only
   accepted source of payment is the authenticated reader, never imported JSON. */
async function importedPlanReads(){
 const fs=require('fs'),vm=require('vm'),path=require('path');
 const source=fs.readFileSync(path.resolve(__dirname,'../atuned_src/ui/panels.js'),'utf8');
 const start=source.indexOf('function recordImportPlanReceipt(){');
 const end=source.indexOf('/* WHAT A LOAD THAT LANDED REDRAWS');
 if(start<0||end<0)throw Error('Import restoration seam missing');
 let session=null,accept=true,reads=0,rendered=0;
 const elements={shimp:{value:'fixture'},shimpgo:{},shimpmsg:{}};
 const ctx={$:id=>elements[id],pImport:()=>accept?{name:'fixture'}:null,
  importCopied:()=>false,importError:()=>['refused fixture'],
  recordLanded:()=>{rendered++;},authSession:()=>session,
  authPlanRead:()=>{reads++;return Promise.resolve({ok:true,took:'live'});}};
 vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
 ctx.recordImportWire('sh');
 elements.shimpgo.onclick();
 ok(reads===0&&rendered===1&&/Sign in to check/.test(elements.shimpmsg.textContent),
  'signed-out import stays free without a billing request');
 session={token:'fixture'};
 elements.shimpgo.onclick();
 ok(reads===1&&rendered===2&&/Checking your signed-in plan/.test(elements.shimpmsg.textContent),
  'successful signed-in import requests authoritative billing restoration');
 accept=false;elements.shimpgo.onclick();
 ok(reads===1&&rendered===2&&/^Not loaded/.test(elements.shimpmsg.textContent),
  'rejected import never requests a new entitlement');
 const link=source.slice(source.indexOf('function recordLinkBoot(){'),source.indexOf('function profileSheet(){'));
 let receipt='';
 ctx.recordLinkTake=()=>({text:'fixture',cleared:true});
 ctx.linkUnwrap=()=>[1];ctx.recordLinkInflate=()=>Promise.resolve(accept?{name:'fixture'}:null);
 ctx.recordLinkSay=s=>{receipt=s;};ctx.tabLandFirst=()=>false;
 vm.runInContext(link,ctx);
 accept=true;await ctx.recordLinkBoot();
 ok(reads===2&&/Checking your signed-in plan/.test(receipt),
  'signed-in record link uses the same authoritative restoration');
 accept=false;await ctx.recordLinkBoot();
 ok(reads===2&&/^Not loaded/.test(receipt)&&/Nothing else was touched/.test(receipt),
  'rejected link cannot request restoration or claim a reset');
 session=null;accept=true;await ctx.recordLinkBoot();
 ok(reads===2&&/Sign in to check/.test(receipt),
  'signed-out record link makes no billing request');
}
delayedReads().then(importedPlanReads).catch(e=>{F++;console.error(e);}).then(()=>{
 console.log('\n===== '+P+' passed, '+F+' failed =====');
 process.exit(F?1:0);
});
