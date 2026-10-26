#!/usr/bin/env node
'use strict';
/** Fail-closed documentation-level acceptance tests; not a deployed intelligence E2E test. */
const assert=require('node:assert/strict');
const {loadDocumentedInfernoGraph}=require('./INFERNO_DOCUMENTED_GRAPH_READER_V1.cjs');
const view=loadDocumentedInfernoGraph(), a=view.audit;
assert.equal(a.baseNodes,135);assert.equal(a.baseEdges,300);
assert.equal(a.infernoBindings,38);assert.equal(a.indexedRecords,38);assert.equal(a.researchEdges,80);
assert.equal(a.referenceNodes,3);assert.equal(a.referenceEdges,3);
assert.equal(a.narrativeBoundaries,4);
assert.deepEqual(a.documentedDisconnected,['inferno:B15']);
assert.deepEqual(a.quarantined,['inferno:B15','inferno:X01','inferno:X02']);
assert.equal(a.runtimeApproved,false);assert.equal(a.canonicalApproved,false);
let lookedUp=0;
for(const prefix of ['B','L','F','X']){
  const last={B:15,L:9,F:11,X:3}[prefix];
  for(let i=1;i<=last;i++){
    const id='inferno:'+prefix+String(i).padStart(2,'0');
    const found=view.lookup(id);
    assert.equal(found.id,id);
    assert.equal(found.researchBinding.graphNodeId,id);
    assert.equal(found.sourceIndex.graphNodeId,id);
    assert.equal(found.sourceIndex.fullResearchBodyPresentInGitHub,true);
    assert.equal(view.lookup(id,{includeSourceBody:true}).sourceRecordContentIncluded,true);
    assert.ok(view.lookup(id,{includeSourceBody:true}).researchBody.includes('- **P4:**'));
    assert.ok(found.sourceIndex.label);
    assert.ok(found.sourceIndex.sourceStatus);
    assert.equal(found.canonicalApproved,false);
    assert.equal(found.runtimeApproved,false);
    assert.equal(found.sourceRecordContentIncluded,false);
    assert.ok(found.edges.every(e=>e.notRuntime===true && e.canonicalPromotionAllowed===false));
    lookedUp++;
  }
}
assert.equal(lookedUp,38);
for(const id of ['inferno:B03','inferno:B04'])
  assert.ok(view.lookup(id).edges.some(e=>e.origin==='baseline' && e.from.startsWith('purgatorio:')));
assert.ok(view.lookup('inferno:X01').edges.some(e=>e.to==='shadow:malak'));
assert.equal(view.lookup('inferno:X02').edges.filter(e=>e.origin==='cross-registry').length,2);
assert.equal(view.lookup('inferno:B15').edges.length,0);
assert.equal(view.lookup('inferno:B15').disposition.classification,'NON_DANTE_CONTEXT_ROOT_UNASSIGNED');
for(const [level,figure] of [['L01','F01'],['L06','F06'],['L08','F09'],['L09','F10']]){
  const c=view.lookup('inferno:'+level).edges.find(e=>e.to==='inferno:'+figure && e.origin==='research');
  assert.ok(c,'missing '+level+' -> '+figure);
  assert.equal(c.narrativeBoundary.promotionAllowed,false);
  assert.ok(c.narrativeBoundary.readAs);
}
assert.throws(()=>view.lookup('inferno:X01',{runtime:true}),/SOURCE_GUARD/);
assert.throws(()=>view.lookup('inferno:X01',{forScoring:true}),/SOURCE_GUARD/);
assert.throws(()=>view.lookup('inferno:X01',{allowCanonical:true}),/SOURCE_GUARD/);
assert.throws(()=>view.lookup('inferno:NOT_REAL'),/SOURCE_GUARD/);
console.log(JSON.stringify({status:'PASS_DOCUMENTED_SOURCE_GRAPH_ONLY',testedRecordLookups:lookedUp,...a,
  remainingGates:['hash-gated canonical Inferno registry missing','canonical semantics not approved',
  'live intelligence ingest not demonstrated','owner authorizations outstanding']},null,2));
