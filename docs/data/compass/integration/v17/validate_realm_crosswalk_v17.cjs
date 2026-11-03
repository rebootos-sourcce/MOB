// ATUNED read-only Compass three-realm trace validator, 2026-11-03.
// Execute from repository root: node docs/data/compass/integration/v17/validate_realm_crosswalk_v17.cjs
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const graph=read('docs/data/compass/integration/v4/ATUNED_UNIFIED_RESEARCH_GRAPH_V4.json');
const a=read('docs/data/compass/integration/v17/REALM_LAYER_ARCHETYPE_LAW_CROSSWALK_V17.json');
const bridge=read('docs/data/compass/integration/v1/INFERNO_CROSS_REGISTRY_SOURCE_BRIDGE_V1.json');
const nodeIds=new Set(graph.nodes.map(n=>n.id));
const banned=new Set(bridge.sourceCorrections.filter(c=>!c.promotionAllowed).map(c=>c.candidate.replace(' -> ','|')));
const matches=part=>graph.edges.some(e=>e.type===part.type&&e.from===part.documentedFrom&&e.to===part.documentedTo&&((e.from===part.from&&e.to===part.to)||(e.from===part.to&&e.to===part.from)));
assert.equal(a.schema,'ATUNED_THREE_REALM_READ_ONLY_CROSSWALK_V17');
assert.equal(a.policy.notApprovedCanon,true);
assert.equal(a.policy.notProduction,true);
assert.equal(a.policy.noNewCQFormula,true);
assert.equal(a.policy.knownLiteraryBoundaryExceptionsBlocked,true);
assert.equal(graph.nodes.length,404);
assert.equal(graph.edges.length,875);
assert.equal(a.rows.length,26);
assert.deepEqual(a.stats.realms,{INFERNO:9,PURGATORIO:7,PARADISO:10});
assert.equal(a.stats.sceneSourceEdgesPresent,26);
assert.equal(a.canonicalLawIds.length,21);
assert.equal(new Set(a.canonicalLawIds).size,21);
assert.equal(a.coreArchetypeIds.length,12);
assert.equal(a.stats.paradisoLawResearchEdges,44);
assert.equal(a.stats.paradisoLawNamesCovered,21);
assert.equal(a.stats.infernoDirectLawEdges,0);
assert.equal(a.stats.purgatorioDirectLawEdges,0);
assert.equal(a.stats.coreArchetypeParadisoResearchLinks,12);
assert.equal(a.stats.paradisoLevelsWithDirectCoreArchetypeResonance,8);
assert.equal(a.stats.shadowLawCandidateEdges,49);
assert.equal(a.stats.quarantinedCandidatePaths,6);
for(const r of a.rows){
 assert(nodeIds.has(r.sceneId)&&nodeIds.has(r.sourceRecordId),r.sceneId+' lacks a source node');
 assert(r.sceneSourceEdge&&matches(r.sceneSourceEdge),r.sceneId+' lacks source edge');
 for(const id of [...r.directArchetypeResonances,...r.sceneArchetypeResonances,...r.indirectArchetypeCandidates,...r.documentedInfernoFigureCandidates,...r.documentedInfernoBehaviorCandidates,...r.documentedPurgatorioTerraces,...r.documentedParadisoResonances])assert(nodeIds.has(id),'dangling '+id);
 for(const p of r.lawCandidateRoutes){
  assert(a.canonicalLawIds.includes(p.lawId),'unknown Law '+p.lawId);
  assert.equal(p.authority,'CANDIDATE_NAVIGATION_ONLY_NOT_SCORING');
  assert(p.path.length>0&&p.path.length<=4);
  let prev=r.sourceRecordId;
  for(const step of p.path){
   assert.equal(step.from,prev,'broken chain '+r.sceneId);
   assert(matches(step),'untracked edge '+step.type);
   assert(!banned.has(step.from+'|'+step.to),'unquarantined literary exception');
   assert.equal(step.approval,'RESEARCH_ONLY_NOT_RUNTIME');
   prev=step.to;
  }
  assert.equal(prev,p.lawId,'wrong destination Law');
 }
}
for(const realm of ['INFERNO','PURGATORIO','PARADISO']){
 const rows=a.rows.filter(r=>r.realm===realm);
 assert.equal(rows.filter(r=>r.lawCandidateRoutes.length>0).length,a.stats.indirectLawTraceByRealm[realm].scenesWithPaths);
}
console.log('V17 PASS: 26/26 source IDs, 21/21 Law names, 12/12 core archetypes, 44 Paradiso links, 6 invalid paths quarantined.');
