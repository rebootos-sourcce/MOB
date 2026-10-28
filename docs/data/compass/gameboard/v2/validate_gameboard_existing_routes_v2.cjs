#!/usr/bin/env node
/* Source-conservative Hero Journey existing engine route acceptance test.
   Route presence != an accepted user-specific Protocol or a guaranteed usable action.
   Run: node docs/data/compass/gameboard/v2/validate_gameboard_existing_routes_v2.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../../..'),f=x=>fs.readFileSync(path.join(root,x),'utf8'),j=x=>JSON.parse(f(x));
const chk=(v,why)=>{if(!v)throw Error(why)};
const blob=raw=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex');
try{
  const bindings=j('docs/data/compass/gameboard/v2/GAMEBOARD_EXISTING_RELEASE_RITUAL_BINDINGS_V2.json');
  const board=j('docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json');
  for(const [p,sha] of Object.entries(bindings.sourceBlobs))chk(blob(f(p))===sha,'MOB source changed without updating bindings: '+p);
  const sceneCode=f('atuned_src/engine/data/hero_journey.js'),match=sceneCode.match(/var HJ_SCENES=(\[[\s\S]*?\]);/);
  chk(match,'missing HJ_SCENES JS source');
  const scenes=JSON.parse(match[1]),byId=new Map(scenes.map(s=>[s.id,s]));
  chk(scenes.length===26&&board.nodes.length===26&&bindings.sceneBindings.length===26,'scene count');
  chk(new Set(scenes.map(s=>s.id)).size===26,'duplicate runtime scene');
  chk(new Set(bindings.sceneBindings.map(s=>s.sceneId)).size===26,'duplicate mapped scene');
  for(const row of bindings.sceneBindings){
    const runtime=byId.get(row.sceneId),authored=board.nodes.find(n=>n.id===row.sceneId);
    chk(runtime&&authored,'missing scene source '+row.sceneId);
    chk(authored.releaseProtocolId===null&&authored.becomingRitualId===null,'static IDs falsely asserted '+row.sceneId);
    chk(row.release.contentProtocolId===null&&row.becoming.contentRitualId===null,'fake content ID '+row.sceneId);
    chk(runtime.source===row.sourceRecordId&&authored.sourceRecordId===runtime.source,'wrong source join '+row.sceneId);
    chk(runtime.protocol===row.release.method&&runtime.ritual===row.becoming.method,'dynamic entrypoint changed '+row.sceneId);
    chk(runtime.protocol==='relPick'&&runtime.ritual==='ritStartPlan','unsupported route '+row.sceneId);
    chk(runtime.protocolLinkStatus==='DYNAMIC_PROFILE_DEPENDENT_NOT_FIXED_CONTENT_ID','unexpected status '+row.sceneId);
    chk(runtime.laws.length>0,'scene has no law for dynamic selection '+row.sceneId);
    chk(row.release.requires.includes('eligible_confirmed_imprints')&&row.becoming.requires.includes('eligible_practice_at_user_pacing'),'missing conditional guards');
    chk(row.noAutomaticUserAssignment===true,'unsafe automatic scene assignment');
  }
  const bindUI=f('atuned_src/ui/hero_journey.js');
  chk(bindUI.includes('relPick(ids)')&&bindUI.includes('hjReleaseAddresses(a)'), 'release UI route missing');
  chk(bindUI.includes('ritStartPlan({steps:[c.practice.k]')&&bindUI.includes('hjRitualCandidate(a,compute())'),'ritual UI route missing');
  chk(bindUI.includes('if(!ids.length)')&&bindUI.includes('if(!c)'),'cannot safely refuse unavailable action');
  chk(/function relPick\s*\(/.test(f('atuned_src/ui/release.js')),'missing actual relPick');
  chk(/function ritStartPlan\s*\(/.test(f('atuned_src/ui/ritual.js')),'missing actual ritStartPlan');
  const engine=f('atuned_src/engine/hero_journey.js');
  chk(/function hjReleaseAddresses\s*\(/.test(engine)&&/function hjRitualCandidate\s*\(/.test(engine),'missing dynamic resolver');
  const ctx={W:[{i:41,b:'Heart',cf:true,sq:8},{i:42,b:'Heart',cf:false,sq:9},{i:43,b:'Root',cf:true,sq:7}],SI:[{nm:'Duty',b:'Heart'}],ritFor:()=>({called:{k:'box',track:'Body',tier:1}}),HJ_SCENES:scenes,CQ_MODEL:3};
  vm.runInNewContext(engine,ctx,{filename:'engine/hero_journey.js',timeout:2000});
  const testScene={laws:['Duty']};
  chk(JSON.stringify(ctx.hjReleaseAddresses(testScene))==='[41]','release selection failed to filter confirmed held addresses');
  chk(ctx.hjRitualCandidate(testScene,{DQ:5}).practice.k==='box','ritual selector failed');
  ctx.W=[];chk(ctx.hjReleaseAddresses(testScene).length===0,'no imprints must not create a release');
  ctx.ritFor=()=>({called:null});chk(ctx.hjRitualCandidate(testScene,{DQ:5})===null,'no available practice must not create ritual');
  const recipes=f('atuned_src/engine/data/teachers_recipes.js');
  const ritualIds=[...recipes.matchAll(/\{id:'([^']+)', nm:'([^']+)', steps:\[([^\]]+)\]/g)].map(m=>({id:m[1],steps:m[3].replaceAll("'","").split(',').map(s=>s.trim())}));
  const practices=f('atuned_src/engine/data/practice.js');
  const baseKeys=[...practices.slice(0,practices.indexOf('var PTRACK=')).matchAll(/\{k:'([^']+)', nm:/g)].map(m=>m[1]);
  const additions=[...recipes.matchAll(/\{k:'([^']+)', tc:'([^']+)', rc:1,/g)].map(m=>m[1]);
  const firstTeacher=[...practices.matchAll(/\{k:'([^']+)', tc:'[^']+', nm:/g)].map(m=>m[1]);
  const keys=new Set(baseKeys.concat(additions,firstTeacher));
  chk(ritualIds.length===39&&new Set(ritualIds.map(r=>r.id)).size===39,'teacher ritual ID inventory');
  chk(baseKeys.length===17&&additions.length===28,'practice source counts');
  chk(ritualIds.every(x=>x.steps.every(s=>keys.has(s))),'teacher recipe step key dangling');
  chk(bindings.stats.routedReleaseEntrypoints===26&&bindings.stats.routedBecomingEntrypoints===26,'source audit counts');
  console.log(JSON.stringify({status:'PASS',scenes:26,dynamicReleaseEntrypoints:26,dynamicRitualEntrypoints:26,sourceTeacherRitualIds:39,sourcePracticeEntries:baseKeys.length+additions.length+firstTeacher.length,fixedProtocolIdsAssigned:0,fixedRitualIdsAssigned:0,statedRuntimeRule:'Profile-confirmed/pacing-gated; action may be unavailable',browserTest:'NOT_RUN',semanticApproval:'NOT_CLAIMED'},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1;}
