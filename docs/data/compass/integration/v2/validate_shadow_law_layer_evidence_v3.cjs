#!/usr/bin/env node
/* ATUNED V3: fail-closed, read-only, zero runtime/scoring imports.
   Run: node docs/data/compass/integration/v2/validate_shadow_law_layer_evidence_v3.cjs
   This validates documentation provenance; it does not certify semantics or the runtime. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../..');
const paths = {
  shadow: 'docs/data/compass/shadow_archetypes/v1/SHADOW_ARCHETYPES_REGISTRY_V1.json',
  inferno: 'docs/data/inferno/v2/INFERNO_NORMALIZED_RECONSTRUCTION_V2.json',
  graph: 'docs/data/compass/integration/v1/COMPASS_CROSS_LAYER_GRAPH_V1.json',
  engine: 'atuned_src/engine/data/compass.js'
};
const overlayPath = 'docs/data/compass/integration/v2/SHADOW_LAW_LAYER_EVIDENCE_OVERLAY_V3.json';
const fullPath = p => path.join(root, p);
const read = p => fs.readFileSync(fullPath(p), 'utf8');
const parse = p => JSON.parse(read(p));
const blobSha = raw => crypto.createHash('sha1')
  .update('blob ' + Buffer.byteLength(raw) + '\0').update(raw).digest('hex');
const assert = (yes, why) => { if (!yes) throw new Error(why); };
const unique = arr => new Set(arr).size === arr.length;
try {
  const o = parse(overlayPath);
  const sh = parse(paths.shadow);
  const g = parse(paths.graph);
  const inf = parse(paths.inferno);
  assert(o.readOnly === true && o.authority.includes('NOT_RUNTIME'), 'overlay authority');
  for (const [key, meta] of Object.entries(o.sourceDigests)) {
    assert(paths[key] === meta.path, 'source path changed: ' + key);
    assert(blobSha(read(meta.path)) === meta.blobSha, 'source blob mismatch: ' + key);
  }
  const lawIds = new Set(g.nodes.filter(n=>n.kind==='integrity_law').map(n=>n.id));
  const infernoIds = new Set(inf.records.map(r=>r.id));
  const graphIds = new Set(g.nodes.map(n=>n.id));
  const publics = sh.records.filter(r=>r.public && r.public.displayEnabled);
  const excluded = sh.records.filter(r=>!r.public || !r.public.displayEnabled);
  assert(publics.length === 23 && excluded.length === 7 && sh.records.length === 30, 'shadow inventory changed');
  assert(o.records.length === 23 && o.contextOnly.length === 7, 'overlay counts');
  assert(unique(o.records.map(r=>r.id)) && unique(o.contextOnly.map(r=>r.id)), 'duplicate IDs');
  assert(g.nodes.length === 135 && g.edges.length === 300 && lawIds.size === 21, 'base graph count drift');
  assert(g.edges.every(e=>graphIds.has(e.from)&&graphIds.has(e.to)), 'dangling base graph edge');
  assert(unique(g.edges.map(e=>e.from+'|'+e.to+'|'+e.type)), 'duplicate typed graph edge');
  const f21=['nm','fam','def','body','inferred','inferenceBasis','behavior','triggerMechanism','livedExample','impact','practice','oppositeId','oppositeDefinition','oppositeStatus','confidence','reviewStatus','refer','narrativeSource','researchSources','researchPasses','links'];
  for (const row of o.records) {
    const original=publics.find(x=>x.id===row.id);
    assert(original, 'not a public source record '+row.id);
    assert(f21.every(f=>Object.prototype.hasOwnProperty.call(row,f)), 'missing template key '+row.id);
    assert(original.researchPasses.length===3 && row.researchPasses.length===4,'four-pass contract '+row.id);
    assert(JSON.stringify(row.researchPasses.slice(0,3))===JSON.stringify(original.researchPasses),'source research mutated '+row.id);
    assert(row.researchPasses[3].authority.includes('NOT_INDEPENDENT'), 'false research claim '+row.id);
    assert(!row.runtime&&!row.canonical&&!row.ownerApproval,'false promotion '+row.id);
    assert(!row.sourceInfernoId||infernoIds.has(row.sourceInfernoId),'missing Inferno reference '+row.id);
    assert(row.candidateLawEdges.every(e=>lawIds.has(e.id)&&e.notRuntime&&e.status==='PROPOSED_UNAPPROVED'),'unapproved law edge promoted '+row.id);
    assert(row.candidateNarrativeLocators.every(x=>infernoIds.has(x.id)),'bad narrative locator '+row.id);
  }
  assert(o.contextOnly.every(x=>excluded.some(s=>s.id===x.id)),'bad exclusions');
  assert(o.candidateLawEdges.length===49, 'law candidate edge count drift');
  assert(o.candidateLawEdges.every(e=>lawIds.has(e.to)&&o.records.some(r=>r.id===e.from)&&e.notRuntime&&e.status==='PROPOSED_UNAPPROVED'),'bad law edge');
  assert(new Set(o.candidateLawEdges.map(e=>e.to)).size===17, 'law coverage drift');
  const drifts=g.reviewQueue.filter(x=>x.code==='FIGURE_BEHAVIOR_SEMANTIC_DRIFT');
  const oneSided=g.reviewQueue.filter(x=>x.code==='PARADISO_TEACHER_ONE_SIDED');
  assert(drifts.length===4 && oneSided.length===5, 'review queue changed');
  assert(o.validation.pass&&o.validation.failures.length===0, 'recorded audit failed');
  console.log(JSON.stringify({result:'PASS',sourceBlobsVerified:4,shadow:30,publicResearch:23,contextOnly:7,
    researchLenses:92,lawCandidateEdges:49,lawNodesReferenced:17,baseGraphNodes:135,baseGraphEdges:300,
    semanticDrifts:4,oneSidedResonances:5,nativeCI:'NOT_CERTIFIED',production:'NOT_CERTIFIED'},null,2));
} catch(e) {
  console.error('FAIL: '+e.message);
  process.exitCode=1;
}
