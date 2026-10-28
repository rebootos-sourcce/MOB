#!/usr/bin/env node
/* ATUNED source harmonization gate. No runtime writes, scoring or canon promotion.
   Run after git fetch origin atuned/deep-psyche-end-to-end-2026-10-26 (FETCH_HEAD).
*/
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),vm=require('node:vm');
const base=path.resolve(__dirname,'../../../../..'),read=p=>fs.readFileSync(path.join(base,p),'utf8'),j=p=>JSON.parse(read(p));
const hash=raw=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex');
const must=(x,why)=>{if(!x)throw new Error(why)};
const pp={
teacher1:'docs/data/compass/teachers/v1/TEACHER_OPPOSITES_REGISTRY_V1.json',
teacher2:'docs/data/compass/teachers/v2/TEACHER_OPPOSITES_REGISTRY_V2_RESEARCH.json',
join1:'docs/data/compass/integration/v1/TEACHER_POLE_SOURCE_AND_RECIPE_JOIN_V1.json',
join2:'docs/data/compass/integration/v2/TEACHER_POLE_SOURCE_AND_RECIPE_JOIN_V2.json',
scene:'docs/data/compass/gameboard/v2/GAMEBOARD_26_FOUR_PASS_SOURCE_RESEARCH_V2.json',
game:'docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json',
graph3:'docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V3.json',
graph4:'docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json',
editor4:'docs/data/compass/integration/v4/ATUNED_GRAPH_EDITOR_V4.html',
v341:'docs/data/compass/integration/v4/DEEP_PSYCHE_19_V341_EXACT_SOURCE_GAP_LEDGER_V1.json'
};
try{
const t1=j(pp.teacher1),t2=j(pp.teacher2),join1=j(pp.join1),join2=j(pp.join2),scene=j(pp.scene),game=j(pp.game),g3=j(pp.graph3),g4=j(pp.graph4),gaps=j(pp.v341);
const ids=xs=>new Set(xs.map(x=>x.id)),v2ids=ids(t2.records),v4ids=ids(g4.nodes),key=e=>e.from+'|'+e.to+'|'+e.type;
must(t1.records.length===23&&t2.records.length===31&&v2ids.size===31,'source registry 23->31');
must(t2.records.slice(0,23).every((x,i)=>JSON.stringify(x)===JSON.stringify(t1.records[i])),'source V1 records altered');
must(t2.derivedFrom.sha===hash(read(pp.teacher1)),'V1 source drift');
const newRecords=t2.records.slice(23);
must(newRecords.filter(x=>x.kind==='compass_teacher').length===2&&newRecords.filter(x=>x.kind==='compass_named_inverse_candidate').length===6,'8 source-qualified additions incorrect');
must(newRecords.every(x=>x.researchPasses.length===4&&x.researchPasses.map(p=>p.lens).filter((p,i,a)=>a.indexOf(p)===i).length===4),'research lens count/dedup');
must(newRecords.every(x=>x.body.length>140&&x.researchPasses.every(p=>p.finding.length>90)),'unresearched or short content');
must(newRecords.every(x=>x.canonical===false&&x.runtime===false&&x.confidence.integration==='NOT_RUNTIME'),'false canon');
must(join2.derivedFrom.v1Sha===hash(read(pp.join1))&&join2.derivedFrom.teacherV2Sha===hash(read(pp.teacher2)),'teacher join source drift');
must(join1.rows.length===14&&join2.rows.length===14,'pole row inventory');
must(new Set(join2.rows.map(x=>x.poleKey)).size===14,'unique pole IDs');
must(new Set(join2.rows.map(x=>x.teacherSourceId)).size===13,'13 distinct teachers');
must(join2.rows.every(x=>v2ids.has(x.teacherSourceId)&&v2ids.has(x.inverseSourceId)),'normalized teacher inverse reference missing');
must(join2.rows.reduce((n,r)=>n+r.recipeRitualIds.length,0)===39,'existing starter recipe count');
must(join2.rows.every(x=>!x.semanticApproval),'source contrast was auto-approved');
must(scene.records.length===26&&game.nodes.length===26,'scene count');
must(scene.audit.analyses===104,'gameboard four-pass 104 contract');
const authored=new Map(game.nodes.map(r=>[r.id,r]));
must(scene.records.every(s=>s.researchPasses.length===4&&s.researchPasses.every(p=>p.finding.length>130)),'scene text depth count');
must(scene.records.every(s=>authored.has(s.id)&&authored.get(s.id).sourceRecordId===s.sourceRecordId),'scene source mismatch');
must(scene.records.every(s=>s.fixedReleaseProtocolId===null&&s.fixedBecomingRitualId===null&&!s.canon&&!s.runtime),'scene fabricated protocol or approval');
for(const [name,src] of Object.entries(scene.provenance))must(hash(read(src.path))===src.blobSha,'scene provenance drift '+name);
must(g3.nodes.length===398&&g3.edges.length===861&&g4.nodes.length===404&&g4.edges.length===875,'graph delta 6 nodes /14 links');
must(v4ids.size===404&&new Set(g4.edges.map(key)).size===875,'duplicate node or edge');
must(g4.edges.every(x=>x.notRuntime&&v4ids.has(x.from)&&v4ids.has(x.to)),'runtime promotion or dangling edge');
must(g4.nodes.filter(x=>x.kind==='compass_named_inverse_candidate').length===6,'inverse nodes wrong');
must(g4.nodes.filter(x=>x.kind==='hero_journey_scene'&&x.researchEvidence?.sourceQualifiedPasses===4).length===26,'scene evidence not indexed');
const harmonized=g4.edges.filter(x=>x.graphSegment==='teacher_source_harmonization_v2');
must(harmonized.length===14,'missing source joins');
must(harmonized.every(x=>x.status==='SOURCE_ID_JOIN_NOT_SEMANTIC_CANON'),'source join falsely approved');
for(const [kind,meta] of Object.entries(g4.sources))if(['teacherResearchV2','teacherPoleJoinV2','gameboardFourPassV2'].includes(kind))must(hash(read(meta.path))===meta.blobSha,'graph source pin drift '+kind);
const sourceHtml=read(pp.editor4),embed=sourceHtml.match(/<script id="graph-data" type="application\/json">([\s\S]*?)<\/script>/);
must(embed,'editor lacks data');const ed=JSON.parse(embed[1]);
must(ed.nodes.length===404&&ed.edges.length===875,'editor stale');
const script=sourceHtml.match(/<script>\s*([\s\S]*?)<\/script>/);must(script,'editor script missing');
new vm.Script(script[1],{filename:'ATUNED_GRAPH_EDITOR_V4.js'});
must(gaps.records.length===19&&gaps.totals.v341DefinitionVerifications===0,'unverified v341 wrongly closed');
const raw=cp.execFileSync('git',['show','FETCH_HEAD:docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'],{cwd:base,encoding:'utf8',maxBuffer:10*1024*1024});
must(hash(raw)===gaps.pinnedDeepPsycheBlobSha,'Deep Psyche source version changed');
const deep=JSON.parse(raw),v341=deep.records.filter(x=>x.kind==='v341_domain_candidate');
must(v341.length===19,'v341 roster count');
must(gaps.records.every(x=>v341.some(z=>z.id===x.recordId&&z.nm===x.label)&&!x.approvedExact341Definition),'v341 source gaps wrongly marked complete');
console.log(JSON.stringify({pass:true,teacher:{sourcePreserved:23,added:8,fourPassResearch:8,teacherIdentities:13,poles:14,namedInverses:14,starterRecipes:39},gameboard:{scenes:26,additionalAnalyticalPasses:104,sourceRefsVerified:26},deepPsyche:{sourceRecords:149,v341ExactWordingsUnverified:19},graph:{nodes:404,typedLinks:875,newHarmonizationEdges:14,editorScriptParsed:true},canonicalApprovals:0,productionChanges:0},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1;}
