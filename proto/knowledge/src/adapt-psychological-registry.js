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
const templateById = new Map((catalog.templates || []).map(t => [t.id, t]));
const ids = new Set();
const errors = [];
const warnings = [];
const entries = [];

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
const result = {
  schema: 'atuned.deep_psychological.engine_adapter.v1',
  status: errors.length ? 'FAIL' : (warnings.length ? 'PASS_WITH_CONTENT_GAPS' : 'PASS'),
  runtimeIntegrated: false,
  recordCount: entries.length,
  uniqueIdCount: ids.size,
  templateAssignedCount: entries.filter(e => e.templateId && e.template).length,
  structurallyIncompleteCount: entries.filter(e => e.templateValidation.missingFields.length).length,
  errors, warnings, entries
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
  errorCount: errors.length, warningCount: warnings.length
}, null, 2));
if (errors.length) process.exitCode = 1;
