#!/usr/bin/env node
'use strict';
/* Behavioral unit contract for existing Journey functions.
 * This does not certify persistence, browser E2E, deploy, owner approval or profile data. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..');
const src=p=>fs.readFileSync(path.join(root,p),'utf8');
let tests=0;
function test(ok,reason){assert.ok(ok,reason);tests++;}
try{
 const ctx=vm.createContext({console});
 vm.runInContext(src('atuned_src/engine/data/hero_journey.js'),ctx,{filename:'hero_journey_data.js'});
 vm.runInContext(src('atuned_src/engine/hero_journey.js'),ctx,{filename:'hero_journey_engine.js'});
 const scenes=ctx.HJ_SCENES;
 test(scenes.length===26,'26 ordered scenes');
 test(new Set(scenes.map(x=>x.id)).size===26,'all scene IDs unique');
 for(const [realm,n] of [['INFERNO',9],['PURGATORIO',7],['PARADISO',10]])
   test(scenes.filter(x=>x.realm===realm).length===n,'correct '+realm+' count');
 for(const [cq,realm] of [[0,'INFERNO'],[39.999,'INFERNO'],[40,'PURGATORIO'],
   [59.999,'PURGATORIO'],[60,'PARADISO'],[100,'PARADISO']])
   test(ctx.hjLocate(cq)?.realm===realm,'realm at '+cq);
 for(const cq of [-1,100.001,NaN,Infinity,null,'40'])
   test(ctx.hjLocate(cq)===null,'invalid CQ must not project '+String(cq));
 test(ctx.hjScene('unknown')===null,'unknown scene missing');
 test(ctx.hjScene(scenes[0].id)?.id===scenes[0].id,'known scene lookup');
 const sample={meter:{unique:['4:Llimit:1','4:Llimit:1','4:Rlimit:1','4:Lreframe:1',
   '4:Rreframe:1','4:Llimit:2','not-a-valid-key',5]}};
 const release=Array.from(ctx.hjReleaseKeys(sample));
 test(release.length===3,'release marks count only distinct Llimit/Rlimit keys');
 test(!release.some(x=>/reframe/i.test(x)),'reframe and practice cannot count release');
 test(ctx.hjReleaseKeys(null).length===0,'no data means zero completed releases');
 ctx.CQ_MODEL='TEST_CQ_MODEL';
 ctx.SINAMES=Array.from({length:21},(_,i)=>'Law'+(i+1));
 test(ctx.hjOrigin({history:[{m:ctx.CQ_MODEL,cq:70,lawNow:{Law1:5}}]})===null,
   'partial law history cannot establish CQ origin');
 const lawNow=Object.fromEntries(ctx.SINAMES.map(n=>[n,6]));
 const hist={m:ctx.CQ_MODEL,cq:71,lawNow,t:'2026-10-28'};
 test(ctx.hjOrigin({history:[hist]}).cq===71,'full 21-law historical origin can be read');
 ctx.cqSpan=()=>({complete:false,answered:10,of:21});
 ctx.compute=()=>({CQ:95,unread:false,complete:true});
 let p={id:'profile-test',avatar:{},laws:lawNow,history:[]};
 ctx.S={rec:p.id};
 test(ctx.hjRead(p,ctx.compute()).cq===null,'unmeasured CQ cannot appear in Journey');
 test(ctx.hjStampOrigin(p)===false,'incomplete laws do not create CQ origin');
 ctx.cqSpan=()=>({complete:true,answered:21,of:21});
 test(ctx.hjStampOrigin(p)===true,'full complete measurement stamps origin once');
 test(p.avatar.cqOrigin.cq===95&&p.avatar.cqOrigin.source==='first-complete-reading',
   'origin is observed CQ not invented ritual score');
 test(ctx.hjStampOrigin(p)===false,'CQ origin not restamped on later saves');
 ctx.SI=[{nm:'Truth',b:'solar'},{nm:'Compassion',b:'heart'}];
 ctx.W=[{i:3,b:'solar',sq:4,cf:true},{i:5,b:'solar',sq:9,cf:true},
   {i:6,b:'heart',sq:10,cf:true},{i:7,b:'solar',sq:8,cf:false},
   {i:8,b:'solar',sq:8,cf:true},{i:9,b:'solar',sq:6,cf:true}];
 let addresses=Array.from(ctx.hjReleaseAddresses({laws:['Truth']}));
 test(JSON.stringify(addresses)==='[5,9,3]'||JSON.stringify(addresses)==='[5,8,9]',
   'release addresses are eligible, ranked and limited');
 test(addresses.every(i=>[3,5,8,9].includes(i)),'never infer ineligible address');
 test(ctx.hjReleaseAddresses(null).length===0,'no scene has no release targets');
 ctx.ritFor=()=>({called:null});
 test(ctx.hjRitualCandidate({laws:['Truth']},{DQ:4})===null,'no actual practice means no ritual instance');
 ctx.ritFor=()=>({called:'practice-example'});
 let ritual=ctx.hjRitualCandidate({laws:['Truth']},{DQ:4});
 test(ritual.practice==='practice-example'&&ritual.days===7,'ritual only proposed by actual recommender');
 const scenesWithUnapprovedLaws=scenes.filter(x=>x.lawMappingStatus&&x.lawMappingStatus.includes('NOT_ACCEPTED'));
 test(scenesWithUnapprovedLaws.length>0,'research law matches still unapproved');
 console.log(JSON.stringify({pass:true,behavioralUnitChecks:tests,scenes:26,sourceFile:'atuned_src/engine/hero_journey.js',browserE2E:'NOT_CERTIFIED',persistence:'NOT_CERTIFIED',production:'NOT_CERTIFIED'},null,2));
}catch(e){console.error('V16 JOURNEY CONTRACT FAIL: '+e.stack);process.exitCode=1;}
