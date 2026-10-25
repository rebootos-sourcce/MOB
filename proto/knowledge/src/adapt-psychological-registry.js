#!/usr/bin/env node
'use strict';

/*
 * ATUNED deep-psychological registry adapter.
 * Emits a separate typed registry. It intentionally does not inject these
 * records into the experiential Nerve-to-Super-Complex graph.
 * Usage: node proto/knowledge/src/adapt-psychological-registry.js [--check] [--out PATH]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const registryPath = path.join(ROOT, 'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json');
const catalogPath = path.join(ROOT, 'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error('Cannot read/parse ' + file + ': ' + error.message); }
}
const registry = readJson(registryPath);
const catalog = readJson(catalogPath);
const relationshipEdges = Array.isArray(registry.relationshipEdges) ? registry.relationshipEdges : [];
const engineDataPath = path.join(ROOT, 'proto/knowledge/src/data.js');
const engineIds = new Set();
const engineLabels = new Map();
if (fs.existsSync(engineDataPath)) {
  const source = fs.readFileSync(engineDataPath, 'utf8');
  const match = source.match(/var KBD=(.*);\s*$/s);
  if (match) {
    const db = JSON.parse(match[1]);
    for (const entry of (db.entries || [])) {
      if (entry.id) engineIds.add(entry.id);
      const key = String(entry.nm || '').trim().toLowerCase();
      if (key) {
        if (!engineLabels.has(key)) engineLabels.set(key, []);
        engineLabels.get(key).push(entry.id);
      }
    }
  }
}
const templateById = new Map((catalog.templates || []).map(t => [t.id, t]));
const ids = new Set();
const errors = [];
const warnings = [];
const entries = [];
const edgeIds = new Set();
const edgeErrors = [];

for (const source of (registry.records || [])) {
  if (!source || typeof source.id !== 'string' || !source.id) {
    errors.push('Record has no stable string id');
    continue;
  }
  if (ids.has(source.id)) errors.push(source.id + ': duplicate id');
  ids.add(source.id);
  const template = templateById.get(source.templateId);
  if (!template) {
    errors.push(source.id + ': undefined template ' + source.templateId);
    continue;
  }
  if (template.kind !== source.kind) errors.push(source.id + ': template kind mismatch');
  const payload = {};
  for (const field of (template.fields || [])) {
    payload[field] = Object.prototype.hasOwnProperty.call(source, field) ? source[field] : null;
  }
  const missingFields = (template.fields || []).filter(field =>
    !Object.prototype.hasOwnProperty.call(source, field) ||
    source[field] === null || source[field] === undefined || source[field] === ''
  );
  const links = [...new Set([...(source.links || []), ...(source.childIds || [])])]
    .filter(id => id && id !== source.id);
  entries.push({
    id: source.id,
    kind: 'psych_' + source.kind,
    sourceKind: source.kind,
    nm: source.nm || source.displayName || source.canonicalName || source.id,
    seat: source.seat === undefined ? null : source.seat,
    fam: source.fam === undefined ? null : source.fam,
    def: source.def || source.definition || null,
    body: source.body || source.definition || source.def || null,
    templateId: template.id,
    template: payload,
    templateValidation: {
      schemaDefined: true,
      sourceBacked: Boolean(source.sourceRefs && source.sourceRefs.length),
      contentStatus: missingFields.length ? 'incomplete' : 'complete',
      missingFields,
      runtimeIntegration: 'not_integrated'
    },
    links,
    parentId: source.parentId || null,
    childIds: source.childIds || [],
    relationships: source.relationships || [],
    sourceRefs: source.sourceRefs || [],
    sourceClaims: source.sourceClaims || [],
    researchPasses: source.researchPasses || [],
    evidenceStrength: source.evidenceStrength || null,
    confidence: source.confidence === undefined ? null : source.confidence,
    status: source.status || 'unclassified',
    unresolvedQuestions: source.unresolvedQuestions || [],
    provenance: {
      sourceRecordId: source.id,
      sourceRegistryVersion: registry.version || 'unspecified',
      templateCatalogVersion: catalog.version || 'unspecified'
    }
  });
  if (missingFields.length) warnings.push(source.id + ': missing required fields [' + missingFields.join(', ') + ']');
  if (!Array.isArray(source.researchPasses) || source.researchPasses.length !== 3) {
    errors.push(source.id + ': expected exactly three research-pass slots');
  }
}
for (const entry of entries) {
  for (const target of entry.links) if (!ids.has(target)) errors.push(entry.id + ': dangling link ' + target);
  for (const target of entry.childIds) if (!ids.has(target)) errors.push(entry.id + ': dangling childId ' + target);
  if (entry.parentId && !ids.has(entry.parentId)) errors.push(entry.id + ': dangling parentId ' + entry.parentId);
}
const targetResolutionCounts = {};
const unresolvedRelationshipTargets = [];
for (const edge of relationshipEdges) {
  if (!edge.edgeId || edgeIds.has(edge.edgeId)) edgeErrors.push({ edgeId: edge.edgeId || null, issue: 'missing_or_duplicate_edge_id' });
  edgeIds.add(edge.edgeId);
  if (!ids.has(edge.fromId)) edgeErrors.push({ edgeId: edge.edgeId, issue: 'source_record_missing', fromId: edge.fromId });
  if (edge.toId) {
    const targetRegistry = edge.targetRegistry || edge.toRegistry || 'unspecified';
    let targetExists = false;
    let targetUniverse = targetRegistry;
    if (targetRegistry === 'deep_psychological_registry' || targetRegistry === 'ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY') {
      targetExists = ids.has(edge.toId);
    } else if (targetRegistry === 'experiential_runtime' || targetRegistry === 'ATUNED_EXPERIENTIAL_RUNTIME') {
      targetExists = engineIds.has(edge.toId);
      targetUniverse = 'experiential_runtime';
    } else {
      targetExists = ids.has(edge.toId);
      if (!targetExists && engineIds.size) targetExists = engineIds.has(edge.toId);
    }
    const bucket = targetUniverse + ':' + (targetExists ? 'resolved_exact_id' : 'unresolved_exact_id');
    targetResolutionCounts[bucket] = (targetResolutionCounts[bucket] || 0) + 1;
    if (!targetExists) {
      unresolvedRelationshipTargets.push({
        edgeId: edge.edgeId,
        targetRegistry,
        toId: edge.toId,
        toLabel: edge.toLabel || null,
        validationStatus: edge.validationStatus || 'unspecified',
        labelMatchCandidateIds: engineLabels.get(String(edge.toLabel || edge.toId.replace(/^[^:]+:/, '')).trim().toLowerCase()) || []
      });
    }
  } else {
    targetResolutionCounts[(edge.targetRegistry || 'unspecified') + ':unresolved_label_only'] =
      (targetResolutionCounts[(edge.targetRegistry || 'unspecified') + ':unresolved_label_only'] || 0) + 1;
    if (!edge.toLabel || !edge.status) edgeErrors.push({ edgeId: edge.edgeId, issue: 'unresolved_target_needs_label_and_status' });
    else unresolvedRelationshipTargets.push({
      edgeId: edge.edgeId,
      targetRegistry: edge.targetRegistry || edge.toRegistry || 'unspecified',
      toId: null,
      toLabel: edge.toLabel,
      validationStatus: edge.validationStatus || 'unresolved_label_only'
    });
  }
}
if (unresolvedRelationshipTargets.length) warnings.push('Relationship endpoints unresolved: ' + unresolvedRelationshipTargets.length + ' of ' + relationshipEdges.length + '; candidate edges are not treated as runtime wiring.');
const result = {
  schema: 'atuned.deep_psychological.engine_adapter.v1',
  status: errors.length ? 'FAIL' : (warnings.length ? 'PASS_WITH_CONTENT_GAPS' : 'PASS'),
  runtimeIntegrated: false,
  recordCount: entries.length,
  uniqueIdCount: ids.size,
  templateAssignedCount: entries.filter(e => e.templateId && e.template).length,
  structurallyIncompleteCount: entries.filter(e => e.templateValidation.missingFields.length).length,
  errors, warnings, entries,
  relationshipEdges,
  relationshipEdgeCount: relationshipEdges.length,
  relationshipEdgeErrors: edgeErrors,
  targetResolutionCounts,
  unresolvedRelationshipTargets,
  unresolvedRelationshipTargetCount: unresolvedRelationshipTargets.length,
  engineTargetUniverseLoaded: engineIds.size > 0,
  engineTargetIdCount: engineIds.size
};
const outIndex = process.argv.indexOf('--out');
const outPath = outIndex >= 0 ? process.argv[outIndex + 1] : null;
if (outPath && !process.argv.includes('--check')) {
  fs.writeFileSync(path.resolve(outPath), JSON.stringify(result, null, 2) + '\n');
}
console.log(JSON.stringify({
  status: result.status, runtimeIntegrated: false, recordCount: result.recordCount,
  uniqueIdCount: result.uniqueIdCount, templateAssignedCount: result.templateAssignedCount,
  structurallyIncompleteCount: result.structurallyIncompleteCount,
  errorCount: errors.length, warningCount: warnings.length,
  relationshipEdgeCount: relationshipEdges.length, relationshipEdgeErrorCount: edgeErrors.length,
  unresolvedRelationshipTargetCount: unresolvedRelationshipTargets.length, targetResolutionCounts,
  engineTargetUniverseLoaded: engineIds.size > 0, engineTargetIdCount: engineIds.size
}, null, 2));
if (errors.length) process.exitCode = 1;
