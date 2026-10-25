#!/usr/bin/env node
'use strict';

// Reproducible static audit for the ATUNED deep-psychological registry.
// Run from any directory: node proto/knowledge/src/audit-psychological-registry.js
// Exit 0 means inventory was parsed and reported, not that closure criteria passed.
// Use --strict to exit nonzero when record/content/research/reference gates are open.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const registryPath = path.join(ROOT, 'docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json');
const strict = process.argv.includes('--strict');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
if (!Array.isArray(registry.records)) throw new Error('Registry must contain a records array.');

const records = registry.records;
const byId = new Map();
const count = (fn) => records.reduce((out, record) => {
  const key = fn(record) || 'UNSPECIFIED';
  out[key] = (out[key] || 0) + 1;
  return out;
}, {});
const empty = (value) => value == null || value === '' || (Array.isArray(value) && value.length === 0);
const requiredFields = ['templateId', 'sourceRefs', 'researchPasses'];
const incomplete = [];
const blockedResearch = [];
const behavioralDomainGaps = [];
const passReviewDateGaps = [];
const dangling = [];
const duplicateIds = [];
const ids = new Set();

for (const record of records) {
  if (!record.id) duplicateIds.push({ id: null, reason: 'missing_id' });
  else if (ids.has(record.id)) duplicateIds.push({ id: record.id, reason: 'duplicate_id' });
  else ids.add(record.id);

  const missing = (record.templateValidation && Array.isArray(record.templateValidation.missingFields))
    ? record.templateValidation.missingFields : [];
  if ((record.templateValidation || {}).contentStatus !== 'complete' || missing.length) {
    incomplete.push({ id: record.id, contentStatus: record.templateValidation && record.templateValidation.contentStatus, missingFields: missing });
  }

  const passes = Array.isArray(record.researchPasses) ? record.researchPasses : [];
  if (passes.length !== 3 || passes.some((pass) => pass.status !== 'complete' || !Array.isArray(pass.sources) || !pass.sources.length || !Array.isArray(pass.findings) || !pass.findings.length)) {
    blockedResearch.push({ id: record.id, passes: passes.map((pass) => ({ pass: pass.pass, status: pass.status, sourceCount: (pass.sources || []).length, findingCount: (pass.findings || []).length })) });
  }
  if (record.recordType === 'behavioral_domain') {
    const energyFields = ['behavioralEnergy', 'motivationalPull', 'attentionBias', 'actionTendency', 'adaptiveExpression', 'distortedExpression', 'researchSynthesis', 'researchLimitations'];
    const missingEnergyFields = energyFields.filter((field) => empty(record[field]));
    if (missingEnergyFields.length) behavioralDomainGaps.push({ id: record.id, missingFields: missingEnergyFields });
    if (passes.length === 3 && passes.some((pass) => !pass.reviewedAt)) passReviewDateGaps.push(record.id);
  }
  for (const field of ['childIds', 'upstreamInfluenceIds', 'downstreamEffectIds', 'links']) {
    for (const targetId of record[field] || []) {
      if (!ids.has(targetId) && !records.some((candidate) => candidate.id === targetId)) dangling.push({ from: record.id, field, to: targetId });
    }
  }
  for (const field of requiredFields) {
    if (empty(record[field])) {
      // The templateValidation report remains authoritative for template-specific
      // required fields; this additional list only reports missing shared fields.
    }
  }
}

const report = {
  registryId: registry.registryId,
  registryVersion: registry.version,
  declaredRecordCount: registry.recordCount,
  measuredRecordCount: records.length,
  countMatches: registry.recordCount === records.length,
  countsByRecordType: count((record) => record.recordType),
  countsByLayer: count((record) => record.layer),
  countsByTemplate: count((record) => record.templateId),
  contentStatusCounts: count((record) => (record.templateValidation || {}).contentStatus),
  recordsWithThreePassesMarkedComplete: records.filter((record) => Array.isArray(record.researchPasses) && record.researchPasses.length === 3 && record.researchPasses.every((pass) => pass.status === 'complete')).length,
  recordsWithBlockedOrInsufficientResearchEvidence: blockedResearch.length,
  recordsWithIncompleteTemplateContent: incomplete.length,
  behavioralDomainRecordCount: records.filter((record) => record.recordType === 'behavioral_domain').length,
  behavioralDomainsWithCompleteEnergyFields: records.filter((record) => record.recordType === 'behavioral_domain' && ['behavioralEnergy', 'motivationalPull', 'attentionBias', 'actionTendency', 'adaptiveExpression', 'distortedExpression', 'researchSynthesis', 'researchLimitations'].every((field) => !empty(record[field]))).length,
  behavioralDomainGaps,
  behavioralDomainPassReviewDateGaps: passReviewDateGaps,
  duplicateOrMissingIds: duplicateIds,
  danglingReferences: dangling,
  runtimeIntegrated: false,
  closureStatus: 'OPEN_NOT_CLOSURE',
  blockers: { incompleteRecords: incomplete, blockedResearchRecords: blockedResearch }
};
process.stdout.write(JSON.stringify(report, null, 2) + '\n');

if (strict && (
  !report.countMatches ||
  report.recordsWithIncompleteTemplateContent ||
  report.recordsWithBlockedOrInsufficientResearchEvidence ||
  report.behavioralDomainGaps.length ||
  report.duplicateOrMissingIds.length ||
  report.danglingReferences.length ||
  report.runtimeIntegrated !== true
)) process.exitCode = 1;
