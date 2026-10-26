#!/usr/bin/env node
'use strict';
// Documentation-only acceptance suite; no runtime integration or canon approvals.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const base='docs/data/compass/integration/v1/';
const originalPath='docs/data/inferno/v1/research/INFERNO_FOUR_PASS_REGISTRY_2026-10-25.md';
const source=read(originalPath);
const digest=crypto.createHash('sha256').update(source,'utf8').digest('hex');
assert.equal(digest,'121f67f0e6625ef44e29bc7730143ddef70ba7e8b27322be832472960da54202',
  'Four-pass research document must be byte-for-byte identical to archived source');
const index=json(base+'INFERNO_RESEARCH_RECORD_INDEX_V1.json');
const graph=json(base+'COMPASS_CROSS_LAYER_GRAPH_V1.json');
const overlay=json(base+'INFERNO_RESEARCH_WIRING_OVERLAY_V1.json');
const bridge=json(base+'INFERNO_CROSS_REGISTRY_SOURCE_BRIDGE_V1.json');
const headings=[...source.matchAll(/^### ([BLFX]\d{2}) ·.*$/gm)];
const finalEnd=source.indexOf('## E. Research source ledger');
assert.equal(headings.length,38);assert.ok(finalEnd>headings.at(-1).index);
const ids=new Set(),researchDir='docs/data/inferno/v1/research/records/';
for(let i=0;i<headings.length;i++){
  const item=headings[i],id=item[1];
  assert.ok(!ids.has(id),'Duplicate source record '+id);ids.add(id);
  const next=i<headings.length-1?headings[i+1].index:finalEnd;
  const sourceSection=source.slice(item.index,next);
  const disk=read(researchDir+id+'.md');
  assert.equal(disk,sourceSection,'Source section altered '+id);
  for(const pass of [1,2,3,4]) assert.ok(disk.includes('- **P'+pass+':**'),'Missing research lens '+id+'/'+pass);
}
assert.equal(index.records.length,38);
assert.equal(overlay.recordBindings.length,38);assert.equal(overlay.edges.length,80);
assert.equal(graph.nodes.length,135);assert.equal(graph.edges.length,300);
assert.equal(bridge.referenceEdges.length,3);
assert.deepEqual(new Set(index.records.map(x=>x.recordId)),ids);
assert.deepEqual(new Set(overlay.recordBindings.map(x=>x.recordId)),ids);
assert.ok(index.records.every(r=>r.fullResearchBodyPresentInGitHub===false),
  'Index must preserve its historical pre-import snapshot (new source publication is independently verified)');
const joined=json(base+'TEACHER_POLE_SOURCE_AND_RECIPE_JOIN_V1.json');
const teacher=json('docs/data/compass/teachers/v1/TEACHER_OPPOSITES_REGISTRY_V1.json');
const shadows=json('docs/data/compass/shadow_archetypes/v1/SHADOW_ARCHETYPES_REGISTRY_V1.json');
const sourceRecipes=read('atuned_src/engine/data/teachers_recipes.js');
const sandbox={PRACTICE:[],BECOMING_SAME:{}};
vm.runInNewContext(sourceRecipes,sandbox,{filename:'teachers_recipes.js',timeout:2000});
const recipes=vm.runInNewContext('TEACHER_RECIPES',sandbox,{timeout:2000});
assert.equal(recipes.length,14);assert.equal(joined.rows.length,14);
assert.equal(new Set(joined.rows.map(x=>x.poleKey)).size,14);
assert.equal(new Set(joined.rows.map(x=>x.teacherName)).size,13);
assert.equal(joined.stats.existingRecipeRitualCount,39);
const teachers=new Set(teacher.records.filter(r=>r.kind==='compass_teacher').map(r=>r.id));
const inverses=new Set(teacher.records.filter(r=>r.kind!=='compass_teacher').map(r=>r.id));
const shadowIds=new Set(shadows.records.map(r=>r.id));
const ritualIds=new Set();
let engineOnlyTeachers=0,shadowOnlyInverses=0,ritualCount=0,homeRoutes=0;
for(const r of recipes){
  const join=joined.rows.find(x=>x.poleKey===r.k);
  assert.ok(join,'Unjoined recipe pole '+r.k);
  assert.equal(join.teacherName,r.who);assert.equal(join.quality,r.q);assert.equal(join.inverseCaption,r.opp);
  assert.equal(join.poleId,'compass-pole:'+r.k);
  if(teachers.has(join.teacherSourceId)){}else{
    assert.ok(['Zoroaster','Confucius'].includes(join.teacherName),'Invented teacher join');
    assert.equal(join.teacherRegistryMembership,'ENGINE_ROSTER_ONLY_NORMALIZATION_MISSING');
    engineOnlyTeachers++;
  }
  if(inverses.has(join.inverseSourceId)){}else{
    assert.ok(shadowIds.has(join.inverseSourceId),'Unknown inverse source '+join.inverseSourceId);
    assert.equal(join.inverseRegistryMembership,'SHADOW_RECORD_ONLY_NORMALIZATION_MISSING');
    shadowOnlyInverses++;
  }
  assert.deepEqual(JSON.stringify(join.recipeRitualIds),JSON.stringify(Array.from(r.rituals).map(x=>x.id)));
  for(const ritual of r.rituals){
    assert.ok(!ritualIds.has(ritual.id),'Duplicate ritual '+ritual.id);
    ritualIds.add(ritual.id);
    const j=join.recipeRitualSteps.find(x=>x.id===ritual.id);
    assert.ok(j,'Missing step plan for '+ritual.id);
    assert.equal(JSON.stringify(j.stepKeys),JSON.stringify(Array.from(ritual.steps)));
    ritualCount++;
  }
  if(join.routeLimitation==='HOME_POLE_NOT_ON_FIGURE_ROUTE'){
    assert.ok(['SA','TU','NA'].includes(r.k));
    homeRoutes++;
  }
  assert.equal(join.canonicalPromotion,false);
}
assert.equal(engineOnlyTeachers,2);assert.equal(shadowOnlyInverses,6);
assert.equal(homeRoutes,3);assert.equal(ritualCount,39);
console.log(JSON.stringify({status:'PASS_DOCUMENTATION_SOURCE_MEMBERSHIPS_ONLY',
  fullSourceSha256:digest,sourceResearchRecords:ids.size,fourPassesVerified:ids.size*4,
  baselineGraphNodes:graph.nodes.length,baselineGraphEdges:graph.edges.length,
  infernoResearchEdges:overlay.edges.length,teacherPoles:recipes.length,
  distinctTeachers:13,engineOnlyTeacherRecords:engineOnlyTeachers,
  shadowOnlyNamedInverses:shadowOnlyInverses,ritualReferences:ritualCount,
  homePoleRouteCautions:homeRoutes,runtimeApproved:false,canonicalApproved:false},null,2));
