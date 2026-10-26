#!/usr/bin/env node
'use strict';
/**
 * Documentation-only Compass / Inferno graph discovery reader.
 * This module is under docs/, is not in atuned_src/MANIFEST and MUST NOT be
 * used by runtime scoring, diagnostic, ritual, release or CQ systems.
 * It returns typed, source-annotated candidate references without promotion.
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../../../../..');
const INTEGRATION = 'docs/data/compass/integration/v1/';
const parse = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
function invariant(ok, why) { if (!ok) throw new Error('INFERNO_SOURCE_GUARD: '+why); }

function loadDocumentedInfernoGraph() {
  const base = parse(INTEGRATION+'COMPASS_CROSS_LAYER_GRAPH_V1.json');
  const research = parse(INTEGRATION+'INFERNO_RESEARCH_WIRING_OVERLAY_V1.json');
  const bridge = parse(INTEGRATION+'INFERNO_CROSS_REGISTRY_SOURCE_BRIDGE_V1.json');
  const index = parse(INTEGRATION+'INFERNO_RESEARCH_RECORD_INDEX_V1.json');
  const shadow = parse('docs/data/compass/shadow_archetypes/v1/SHADOW_ARCHETYPES_REGISTRY_V1.json');
  invariant(base.status === 'DOCUMENTED_NOT_RUNTIME', 'base is no longer documentation-only');
  invariant(research.authority === 'SOURCE_REFERENCED_CANDIDATE_NON_CANONICAL', 'research authority drift');
  invariant(bridge.status === 'DOCUMENTED_SOURCE_REFERENCE_ONLY__NOT_RUNTIME', 'bridge authority drift');
  invariant(base.nodes.length === 135 && base.edges.length === 300, 'baseline count drift');
  invariant(research.recordBindings.length === 38 && research.edges.length === 80, 'research count drift');
  invariant(bridge.referenceEdges.length === 3 && bridge.sourceNodes.length === 3, 'bridge count drift');
  invariant(index.status === 'SOURCE_METADATA_INDEX_ONLY__CANONICAL_BODY_NOT_IMPORTED' && index.recordCount === 38 && index.records.length === 38, 'index status/count drift');
  invariant(bridge.authority.graphPromotion === false && bridge.authority.scoringPermission === false, 'unsafe bridge promotion');
  const nodes = [...base.nodes, ...bridge.sourceNodes];
  const ids = new Set(nodes.map(n=>n.id));
  invariant(nodes.length === ids.size, 'duplicate graph ID');
  const shadowIds = new Set(shadow.records.map(r=>r.id));
  for (const n of bridge.sourceNodes) {
    invariant(shadowIds.has(n.id), 'missing source shadow record '+n.id);
    invariant(fs.existsSync(path.join(ROOT,n.sourceRecord)), 'missing shadow Markdown '+n.id);
  }
  const researchIds = new Set(research.recordBindings.map(r=>r.graphNodeId));
  invariant(researchIds.size === 38, 'duplicate Inferno record binding');
  const indexedIds = new Set(index.records.map(r=>r.graphNodeId));
  invariant(indexedIds.size === 38 && [...researchIds].every(id=>indexedIds.has(id)), 'record index/graph identity drift');
  for (const b of research.recordBindings)
    invariant(ids.has(b.graphNodeId) && b.graphNodeId === 'inferno:'+b.recordId, 'invalid record binding '+b.recordId);
  for (const r of index.records) {
    invariant(r.canonical === false && r.notRuntime === true && r.fullResearchBodyPresentInGitHub === false,'unsafe research index status');
    invariant(r.researchPassCountInUploadedHandoff === 4 && !!r.label && !!r.sourceStatus, 'incomplete source index row');
  }
  for (const [origin, edges] of [['baseline',base.edges],['research',research.edges],['cross-registry',bridge.referenceEdges]]) {
    for (const e of edges) {
      invariant(ids.has(e.from) && ids.has(e.to), origin+' dangling relation');
      invariant(e.notRuntime === true, origin+' runtime status violation');
      invariant(typeof e.type === 'string' && e.type.length > 0, origin+' missing edge type');
      if (origin === 'research') invariant(e.status === 'UNPROMOTED', 'promoted research relation');
      if (origin === 'cross-registry') invariant(!e.approval.includes('APPROVED') && typeof e.evidence === 'string', 'unapproved cross-registry relation');
    }
  }
  const exceptionIds = new Set(bridge.isolatedDispositions.map(x=>x.id));
  invariant(exceptionIds.size === 3 && [...['inferno:B15','inferno:X01','inferno:X02']].every(id=>exceptionIds.has(id)),
      'disposition policy drift');
  const corrections = new Map(bridge.sourceCorrections.map(x=>[x.candidate,x]));
  invariant(corrections.size === 4, 'missing known narrative boundary');
  for (const c of bridge.sourceCorrections) {
    invariant(c.promotionAllowed === false,'unsafe narrative containment promotion');
    invariant(research.edges.some(e=>e.from+' -> '+e.to === c.candidate && e.type === c.originalType),
      'narrative correction without source edge: '+c.candidate);
  }
  const dictionary = new Map(nodes.map(n=>[n.id,n]));
  const dispositions = new Map(bridge.isolatedDispositions.map(x=>[x.id,x]));
  const bindings = new Map(research.recordBindings.map(x=>[x.graphNodeId,x]));
  const indexedRecords = new Map(index.records.map(x=>[x.graphNodeId,x]));
  function referencesFor(id, includeCandidates = true) {
    const all = [];
    for (const [origin, edges] of [['baseline',base.edges],['research',research.edges],['cross-registry',bridge.referenceEdges]]) {
      if (!includeCandidates && origin !== 'baseline') continue;
      for (const e of edges) {
        if (e.from !== id && e.to !== id) continue;
        const correction = corrections.get(e.from+' -> '+e.to);
        all.push({...e,origin,narrativeBoundary:correction||null,canonicalPromotionAllowed:false});
      }
    }
    return all;
  }
  function lookup(id, options={}) {
    invariant(options.runtime !== true && options.forScoring !== true && options.allowCanonical !== true,
      'reader may not be used to approve diagnoses, scoring, rituals or runtime decisions');
    invariant(dictionary.has(id), 'unknown record '+id);
    return {
      id, record:dictionary.get(id),
      researchBinding:bindings.get(id)||null,
      sourceIndex: indexedRecords.get(id)||null,
      disposition:dispositions.get(id)||null,
      edges:referencesFor(id,options.includeCandidates !== false),
      documentedOnly:true,canonicalApproved:false,runtimeApproved:false,
      sourceRecordContentIncluded:false
    };
  }
  const allEdges = [...base.edges,...research.edges,...bridge.referenceEdges];
  const disconnected = [...researchIds].filter(id=>!allEdges.some(e=>e.from===id||e.to===id));
  return Object.freeze({
    lookup,
    audit:Object.freeze({baseNodes:base.nodes.length,baseEdges:base.edges.length,
      infernoBindings:research.recordBindings.length,indexedRecords:index.records.length,researchEdges:research.edges.length,
      referenceEdges:bridge.referenceEdges.length,referenceNodes:bridge.sourceNodes.length,
      documentedDisconnected:disconnected.sort(),
      quarantined:[...exceptionIds].sort(),narrativeBoundaries:corrections.size,
      canonicalApproved:false,runtimeApproved:false})
  });
}
module.exports={loadDocumentedInfernoGraph};
if(require.main===module) {
  try {
    const view=loadDocumentedInfernoGraph();
    const id=process.argv[2];
    console.log(JSON.stringify(id?view.lookup(id):view.audit,null,2));
  }catch(e){console.error(e.message);process.exitCode=1;}
}
