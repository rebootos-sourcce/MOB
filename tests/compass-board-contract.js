'use strict';
/* Node-only Compass integration contract gate. This test deliberately does
 * not change CQ, infer personality, or replace source records.
 * Run: node tests/compass-board-contract.js */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const vm=require('node:vm');
function read(p){return fs.readFileSync(path.join(__dirname,'..',p),'utf8');}
function json(p){return JSON.parse(read(p));}
const base='docs/data/compass/';
const board=json(base+'gameboard/v1/GAMEBOARD_MAP_V1.json');
const projection=json(base+'avatar/v2/CQ_POSITION_26_SCENE_MAP_V1.json');
const purg=json('docs/data/purgatorio/v1/PURGATORIO_REGISTRY_V1.json');
const arch=json(base+'archetypes/v1/CORE_12_BEHAVIORAL_ARCHETYPES_REGISTRY_V1.json');
const cross=json(base+'integration/v2/PURGATORIO_NARCISSISM_CROSSWALK_PROVISIONAL_V1.json');
const ctx={};
vm.createContext(ctx);
vm.runInContext(read('atuned_src/engine/data/hero_journey.js')+'\n'+
 read('atuned_src/engine/hero_journey.js'),ctx,{timeout:3000});
const live=ctx.HJ_SCENES;
const sourceIds=new Set(board.nodes.map(x=>x.id));
const sceneIds=new Set(live.map(x=>x.id));
const archetypes=new Set(arch.records.map(x=>x.id));
assert.equal(board.nodes.length,26,'26 authored Board stages');
assert.equal(sourceIds.size,26,'no duplicate authored stage IDs');
assert.equal(live.length,26,'26 runtime stages');
assert.equal(sceneIds.size,26,'no duplicate runtime stage IDs');
assert.deepEqual(live.map(x=>x.realm).reduce((a,s)=>(a[s]=(a[s]||0)+1,a),{}),
 {INFERNO:9,PURGATORIO:7,PARADISO:10},'9/7/10 realm contract');
const byId=new Map(board.nodes.map(x=>[x.id,x]));
for(const scene of live){
 const node=byId.get(scene.id);
 assert.ok(node,'authored source for '+scene.id);
 assert.equal(scene.source,node.sourceRecordId,'stable canonical source join for '+scene.id);
 assert.equal(scene.realm,node.realm,'realm identity for '+scene.id);
 assert.ok(scene.sourceLocation&&scene.guide&&scene.successEvidence,
  'source/evidence/guide in '+scene.id);
 for(const id of scene.archetypes||[])assert.ok(archetypes.has(id),'known archetype '+id);
}
assert.equal(arch.records.length,12,'12 archetype research records');
const linked=new Set(live.flatMap(x=>x.archetypes||[]));
assert.equal(linked.size,12,'every one of the 12 overlays represented');
assert.equal(live.filter(x=>(x.archetypes||[]).length>0).length,8,
 'eight candidate scene anchors on authored map; no invented 26-way placements');
assert.equal(projection.positions.length,26,'full 26-stage CQ projection');
assert.deepEqual(projection.positions.map(x=>x.sceneId),live.map(x=>x.id),
 'CQ mapping order agrees with runtime source');
const boundaries=[
 [0,'game:inferno:L09'],[39.999,'game:inferno:L01'],
 [40,'game:purgatorio:P01'],[59.999,'game:purgatorio:P07'],
 [60,'game:paradiso:PD01'],[100,'game:paradiso:PD10']];
for(const [n,id] of boundaries)assert.equal(ctx.hjLocate(n).id,id,'CQ '+n);
for(const n of [-1,101,NaN,Infinity,null,undefined])assert.equal(ctx.hjLocate(n),null,
 'unusable CQ cannot assign a scene: '+n);
const terr=purg.records.filter(x=>x.kind==='purgatorio_terrace');
assert.equal(terr.length,7,'exactly seven documented vice/capacity terraces');
assert.equal(cross.terraces.length,7,'exactly seven reconciliation slots');
for(const p of terr){
 const row=cross.terraces.find(x=>x.terraceId===p.id);
 assert.ok(row,'reconciliation slot for '+p.id);
 assert.equal(row.viceId,p.polarity.viceId,'unchanged vice ID');
 assert.equal(row.capacityId,p.polarity.virtueId,'unchanged constructive pole');
 assert.equal(row.narcissismLayer.namedMechanism,null,'do not invent medical or semantic mapping');
 assert.equal(row.narcissismLayer.isClinicalClassification,false,'no diagnosis');
 assert.ok(sceneIds.has(row.boardSceneId),'real Board scene for '+p.id);
}
assert.equal(cross.mappingPolicy.noAutoInferenceFromCq,true,'no narcissism from CQ');
assert.equal(cross.mappingPolicy.approvalRequiredBeforeSemanticJoin,true,
 'unverified owner crosswalk is not canonical');
const ui=read('atuned_src/ui/hero_journey.js');
const diagnostic=read('atuned_src/ui/diagnostic3.js');
assert.ok(ui.includes('data-hjarchetypes'),'candidate archetypes visible in selected scene');
assert.ok(ui.includes('Archetype resonances (candidate)'),'overlay provenance not implicit');
assert.ok(ui.includes('<small>CQ reading</small>'),'no pass/fail fraction headline');
assert.ok(diagnostic.includes('Core laws completed:'),'no Core-10 fraction framing');
console.log('PASS: Compass Board contract (26 stages, 9/7/10, 12 overlays, 7 crosswalks, CQ boundaries, source/wording integrity).');
