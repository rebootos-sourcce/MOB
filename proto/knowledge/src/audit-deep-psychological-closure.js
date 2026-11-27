#!/usr/bin/env node
'use strict';
// Record-level closure audit. Run:
// node proto/knowledge/src/audit-deep-psychological-closure.js
// --strict exits nonzero while any closure gate remains open.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json'), 'utf8'));
const strict = process.argv.includes('--strict');
const templates = new Map(catalog.templates.map(t => [t.id, t]));
const records = registry.records || [];
const ids = new Set();
const duplicateIds = [];
const missingTemplateFields = [];
const blockedPassRecords = [];
const danglingReferences = [];
const emptyLinks = [];
const relationshipObjects = [];
const countBy = fn => records.reduce((out, r) => {
  const key = fn(r) || 'UNSPECIFIED';
  out[key] = (out[key] || 0) + 1;
  return out;
}, {});
for (const r of records) {
  if (!r.id) duplicateIds.push({ id: null, reason: 'missing_id' });
  else if (ids.has(r.id)) duplicateIds.push({ id: r.id, reason: 'duplicate_id' });
  else ids.add(r.id);
  const template = templates.get(r.templateId);
  if (!template) missingTemplateFields.push({ id: r.id, reason: 'template_not_found', templateId: r.templateId });
  else {
    const missing = template.fields.filter(f => r[f] === undefined || r[f] === null || r[f] === '');
    if (missing.length) missingTemplateFields.push({ id: r.id, templateId: r.templateId, missing });
  }
  const passes = Array.isArray(r.researchPasses) ? r.researchPasses : [];
  const passNumbers = passes.map(p => p.pass).sort((a, b) => a - b);
  if (passes.length !== 3 || passNumbers.join(',') !== '1,2,3' ||
      passes.some(p => !Array.isArray(p.sources) || !p.sources.length ||
        !Array.isArray(p.findings) || !p.findings.length || p.status !== 'complete')) {
    blockedPassRecords.push({
      id: r.id,
      passes: passes.map(p => ({
        pass: p.pass, status: p.status,
        sourceCount: (p.sources || []).length, findingCount: (p.findings || []).length
      }))
    });
  }
  if (!Array.isArray(r.links) || r.links.length === 0) {
    emptyLinks.push({ id: r.id, recordType: r.recordType, auditStatus: r.relationshipAudit?.status || 'UNCLASSIFIED' });
  }
  for (const field of ['links', 'childIds', 'upstreamInfluenceIds', 'downstreamEffectIds']) {
    for (const target of r[field] || []) {
      if (!records.some(x => x.id === target)) danglingReferences.push({ from: r.id, field, to: target });
    }
  }
  if (r.parentId && !records.some(x => x.id === r.parentId)) danglingReferences.push({ from: r.id, field: 'parentId', to: r.parentId });
  for (const edge of r.relationships || []) {
    relationshipObjects.push(edge);
    for (const target of [edge.fromId, edge.toId]) {
      if (target && !records.some(x => x.id === target)) danglingReferences.push({ from: r.id, field: 'relationships', to: target });
    }
  }
}
const roleComplete = records.filter(r => r.templateValidation?.contentStatus === 'complete' || r.recordType === 'blueprint_domain_slot').length;
const substantiveOpen = records.length - roleComplete;
const mappingRows = records.filter(r => r.recordType === 'mapping_record');
const report = {
  registryId: registry.registryId,
  registryVersion: registry.version,
  denominator: {
    declared: registry.recordCount,
    measured: records.length,
    uniqueIds: ids.size,
    countsByRecordType: countBy(r => r.recordType)
  },
  kpi1: {
    status: registry.recordCount === records.length && ids.size === records.length && !duplicateIds.length ? 'PASS_REGISTRY_SCOPE_ONLY' : 'FAIL',
    numerator: ids.size,
    denominator: registry.recordCount,
    projectWideDenominator: 'UNVERIFIED'
  },
  kpi2: {
    status: substantiveOpen === 0 ? 'PASS' : 'OPEN',
    roleCompleteRecords: roleComplete,
    totalRecords: records.length,
    substantiveProvisionalRecords: substantiveOpen,
    passSlotsMarkedComplete: records.reduce((n, r) => n + (r.researchPasses || []).filter(p => p.status === 'complete').length, 0),
    passSlotsBlocked: records.reduce((n, r) => n + (r.researchPasses || []).filter(p => p.status !== 'complete').length, 0),
    blockedPassRecords
  },
  kpi3: {
    status: 'OPEN',
    recordsWithEmptyLinks: emptyLinks.length,
    emptyLinkRecords: emptyLinks,
    explicitRelationshipObjects: relationshipObjects.length,
    relationshipStatuses: relationshipObjects.reduce((out, e) => {
      const key = e.status || 'UNSPECIFIED';
      out[key] = (out[key] || 0) + 1;
      return out;
    }, {}),
    mappingRows: mappingRows.length,
    approvedSemanticMappingRows: mappingRows.filter(r => /approved/i.test(r.status || '') && !/unapproved|unresolved|pending/i.test(r.status || '')).length,
    runtimeIntegration: 'NOT_VERIFIED'
  },
  validation: {
    missingTemplateFields,
    duplicateOrMissingIds: duplicateIds,
    danglingReferences
  },
  closureStatus: 'OPEN_NOT_CLOSURE'
};
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
if (strict && (report.kpi1.status !== 'PASS_REGISTRY_SCOPE_ONLY' ||
  report.kpi2.status !== 'PASS' || report.kpi3.status !== 'PASS' ||
  missingTemplateFields.length || duplicateIds.length || danglingReferences.length || blockedPassRecords.length)) {
  process.exitCode = 1;
}
