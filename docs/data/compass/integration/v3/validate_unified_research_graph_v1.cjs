#!/usr/bin/env node
/* ATUNED research union validator.
   DOES NOT approve semantic interpretations, runtime graph imports or scoring.
   Run: node docs/data/compass/integration/v3/validate_unified_research_graph_v1.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../../..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(file(p));
const assert=(v,s)=>{if(!v)throw new Error(s)};
const sameSet=(a,b)=>a.size===b.size&&[...a].every(x=>b.has(x));
const blob=raw=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex');
const p={
graph:'docs/data/compass/integration/v3/ATUNED_UNIFIED_RESEARCH_GRAPH_V1.json',
editor:'docs/data/compass/integration/v3/ATUNED_GRAPH_EDITOR_V1.html',
base:'docs/data/compass/integration/v1/COMPASS_CROSS_LAYER_GRAPH_V1.json',
inferno:'docs/data/compass/integration/v1/INFERNO_RESEARCH_WIRING_OVERLAY_V1.json',
law:'docs/data/compass/integration/v2/SHADOW_LAW_LAYER_EVIDENCE_OVERLAY_V3.json',
shadow:'docs/data/compass/shadow_archetypes/v1/SHADOW_ARCHETYPES_REGISTRY_V1.json',
game:'docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json'
};
try{
const g=json(p.graph),b=json(p.base),i=json(p.inferno),l=json(p.law),s=json(p.shadow),gm=json(p.game);
const nodeIds=new Set(g.nodes.map(n=>n.id)),key=e=>[e.from,e.to,e.type].join('|'),edgeIds=new Set(g.edges.map(key));
assert(g.authority==='VISUAL_RESEARCH_AND_EDITOR_NOT_RUNTIME_NOT_CANON','graph authority');
assert(g.nodes.length===208&&nodeIds.size===208,'node count/uniqueness');
assert(g.edges.length===562&&edgeIds.size===562,'edge count/uniqueness');
assert(g.edges.every(e=>nodeIds.has(e.from)&&nodeIds.has(e.to)&&e.notRuntime===true),'endpoint or runtime flag');
for(const [k,meta] of Object.entries(g.sources)){assert(blob(file(meta.path))===meta.blobSha,'source blob drift: '+k)}
for(const e of b.edges)assert(edgeIds.has(key(e)),'missing base edge: '+key(e));
for(const e of i.edges)assert(edgeIds.has(key(e)),'missing Inferno research edge: '+key(e));
for(const e of l.candidateLawEdges)assert(edgeIds.has(key(e)),'missing law research edge: '+key(e));
for(const e of gm.edges)assert(edgeIds.has([e.from,e.to,e.kind].join('|')),'missing scene navigation edge');
assert(b.nodes.length===135&&b.edges.length===300,'base scope drift');
assert(i.edges.length===80&&l.candidateLawEdges.length===49,'overlay scope drift');
assert(s.records.length===30&&gm.nodes.length===26,'source records scope drift');
assert(g.nodes.filter(n=>n.kind==='engine_pole_reference').length===14,'engine poles');
assert(g.nodes.filter(n=>n.kind==='hero_journey_scene').length===26,'scene nodes');
assert(g.nodes.filter(n=>n.kind==='shadow_source_identity').length===30,'shadow nodes');
assert(g.nodes.filter(n=>n.kind==='engine_roster_teacher_unstandardized').length===2,'unstandardized teacher roster');
assert(g.nodes.filter(n=>n.kind==='gameboard_catalog').length===1,'game catalog');
assert(g.edges.filter(e=>e.type==='scene_source_record').length===26,'scene source refs');
assert(g.edges.filter(e=>e.type==='scene_behavioral_crosswalk').length===6,'scene crosswalk refs');
assert(g.edges.filter(e=>e.type==='scene_archetype_resonance').length===12,'archetype resonance refs');
assert(g.edges.filter(e=>e.type==='gameboard_shadow_public_catalog_reference').length===14,'public shadow catalog refs');
assert(g.nodes.filter(n=>n.kind==='hero_journey_scene').every(n=>n.releaseProtocolId===null&&n.becomingRitualId===null),'unverified protocol/ritual joined');
assert(g.external.deepPsyche.importStatus==='NOT_INGESTED_IN_THIS_GRAPH','false Deep Psyche integration claim');
assert(g.external.traceEngine.status==='EXISTS_IN_APP_MANIFEST'&&g.policy.runtime===false,'runtime distinction');
const h=file(p.editor),m=h.match(/<script id="graph-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(m,'embedded graph missing');const emb=JSON.parse(m[1]);
assert(emb.nodes.length===208&&emb.edges.length===562,'graph editor data mismatch');
assert(sameSet(new Set(emb.nodes.map(x=>x.id)),nodeIds),'graph editor IDs mismatch');
const ss=h.match(/<script>\s*([\s\S]*?)<\/script>/);
assert(ss,'editor script missing');new vm.Script(ss[1],{filename:'ATUNED_GRAPH_EDITOR_V1.js'});
for(const id of ['search','category','segment','focusbtn','allbtn','add','export'])assert(h.includes('id="'+id+'"'),'editor control missing: '+id);
console.log(JSON.stringify({result:'PASS',nodes:208,edges:562,components:{base:300,inferno:80,shadowLaw:49,gameNavigation:25,sceneSource:26,sceneCrosswalk:6,sceneArchetype:12,shadowSource:14,enginePole:36,encounters:14},checks:['source-blob-identity','no-dangling','no-duplicates','preserve-all-input-edges','scene-and-pole-crosswalk','editor-data-parity','editor-script-parses','no-runtime-promotion'],liveRuntimeVerified:false},null,2));
}catch(e){console.error('FAIL: '+e.stack);process.exitCode=1}
