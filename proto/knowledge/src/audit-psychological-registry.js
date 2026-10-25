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
const runtimePath = path.join(ROOT, 'proto/knowledge/src/data.js');
const fetterResearchPath = path.join(ROOT, 'docs/data/ATUNED_FETTER_DEEP_RESEARCH_REGISTRY_108_v1.json');
const fetterPromptPath = path.join(ROOT, 'docs/data/ATUNED_FETTER_NINE_REGISTER_PROMPTS_972_v1.json');
const mobPatternPath = path.join(ROOT, 'docs/data/ATUNED_MOB_PATTERN_SOURCE_REGISTRY_108_OF_112_v1.json');
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
const researchPassReviewDateGaps = [];
const researchStatusGaps = [];
const openResearchStatuses = [];
const archetypeEnergyGaps = [];
const relationshipEdgeErrors = [];
const dangling = [];
const duplicateIds = [];
const ids = new Set();

for (const record of records) {
  if (!record.id) duplicateIds.push({ id: null, reason: 'missing_id' });
  else if (ids.has(record.id)) duplicateIds.push({ id: record.id, reason: 'duplicate_id' });
  else ids.add(record.id);

  if (empty(record.researchStatus)) researchStatusGaps.push(record.id);
  if (/^(?:three_pass_research_(?:pending|blocked|incomplete)|research_(?:pending|blocked|incomplete))/i.test(String(record.researchStatus || ''))) openResearchStatuses.push({ id: record.id, status: record.researchStatus });
  if (record.recordType === 'archetype_candidate') {
    const energyFields = ['behavioralEnergy','motivationalPull','attentionBias','actionTendency','adaptiveExpression','distortedExpression','researchSources','researchSynthesis','researchLimitations'];
    const missingEnergyFields = energyFields.filter((field) => empty(record[field]));
    if (missingEnergyFields.length) archetypeEnergyGaps.push({ id: record.id, missingFields: missingEnergyFields });
  }
  const missing = (record.templateValidation && Array.isArray(record.templateValidation.missingFields))
    ? record.templateValidation.missingFields : [];
  if ((record.templateValidation || {}).contentStatus !== 'complete' || missing.length) {
    incomplete.push({ id: record.id, contentStatus: record.templateValidation && record.templateValidation.contentStatus, missingFields: missing });
  }

  const passes = Array.isArray(record.researchPasses) ? record.researchPasses : [];
  if (passes.length !== 3 || passes.some((pass) => pass.status !== 'complete' || !Array.isArray(pass.sources) || !pass.sources.length || !Array.isArray(pass.findings) || !pass.findings.length)) {
    blockedResearch.push({ id: record.id, passes: passes.map((pass) => ({ pass: pass.pass, status: pass.status, sourceCount: (pass.sources || []).length, findingCount: (pass.findings || []).length })) });
  }
  if (passes.length === 3) {
    for (const pass of passes) if (!pass.reviewedAt) researchPassReviewDateGaps.push({ id: record.id, pass: pass.pass, name: pass.name || null });
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

const runtimeSource = fs.existsSync(runtimePath) ? fs.readFileSync(runtimePath, 'utf8') : '';
const runtimeMatch = runtimeSource.match(/var KBD=(.*);\s*$/s);
const runtimeDb = runtimeMatch ? JSON.parse(runtimeMatch[1]) : { entries: [] };
const runtimeIds = new Set((runtimeDb.entries || []).map((entry) => entry.id));
const fetterRegistry = JSON.parse(fs.readFileSync(fetterResearchPath, 'utf8'));
const fetterPrompts = JSON.parse(fs.readFileSync(fetterPromptPath, 'utf8'));
const mobPatternRegistry = JSON.parse(fs.readFileSync(mobPatternPath, 'utf8'));
const runtimeById = new Map((runtimeDb.entries || []).map((entry) => [entry.id, entry]));
const fetterOverlayMissingIds = (fetterRegistry.records || []).filter((record) => !record.runtimeNodeId || runtimeById.get(record.runtimeNodeId)?.fetterResearchRecordId !== record.id).map((record) => record.id);
const fetterOverlayCoverage = (fetterRegistry.records || []).length - fetterOverlayMissingIds.length;
const fetterPassFailures = (fetterRegistry.records || []).filter((record) => record.researchPasses?.length !== 3 || record.researchPasses.some((pass) => pass.status !== 'complete' || !pass.sources?.length || !pass.findings?.length)).map((record) => record.id);
const mobPatternOverlayMissingIds = (mobPatternRegistry.records || []).filter((record) => !record.runtimeNodeId || runtimeById.get(record.runtimeNodeId)?.mobPatternSourceRecordId !== record.id).map((record) => record.id);
const mobPatternOverlayCoverage = (mobPatternRegistry.records || []).length - mobPatternOverlayMissingIds.length;
const mobPatternPassFailures = (mobPatternRegistry.records || []).filter((record) => record.researchPasses?.length !== 3 || record.researchPasses.some((pass) => pass.status !== 'complete' || !pass.sources?.length || !pass.findings?.length)).map((record) => record.id);
const runtimeMissingRecordIds = records.filter((record) => !runtimeIds.has('psych:' + record.id)).map((record) => record.id);
const unresolvedRelationshipTargetIds = (registry.relationshipEdges || []).filter((edge) => !edge.toId || edge.targetRegistry === 'external_or_unresolved').map((edge) => ({ edgeId: edge.edgeId, toLabel: edge.toLabel || null, targetRegistry: edge.targetRegistry || null, status: edge.status || null }));
const promptCountsByNode = (fetterPrompts.records || []).reduce((out, prompt) => { out[prompt.node_id] = (out[prompt.node_id] || 0) + 1; return out; }, {});
const promptRegisterErrors = (fetterPrompts.records || []).filter((prompt) => !prompt.linkedFetterRecordId || !prompt.search_anchor || !prompt.exampleValidationStatus).map((prompt) => prompt.promptId);
const runtimeIntegrated = records.every((record) => runtimeIds.has('psych:' + record.id));
const edgeIds = new Set();
for (const edge of (registry.relationshipEdges || [])) {
  if (!edge.edgeId || edgeIds.has(edge.edgeId)) relationshipEdgeErrors.push({ edgeId: edge.edgeId || null, issue: 'missing_or_duplicate_edge_id' });
  edgeIds.add(edge.edgeId);
  if (!ids.has(edge.fromId)) relationshipEdgeErrors.push({ edgeId: edge.edgeId, issue: 'source_endpoint_missing', fromId: edge.fromId });
  if (edge.toId && (edge.targetRegistry === 'deep_psychological_registry' || edge.targetRegistry === 'ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY') && !ids.has(edge.toId)) relationshipEdgeErrors.push({ edgeId: edge.edgeId, issue: 'internal_target_missing', toId: edge.toId });
  if (!edge.toId && (!edge.toLabel || !edge.status)) relationshipEdgeErrors.push({ edgeId: edge.edgeId, issue: 'unresolved_target_needs_label_and_status' });
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
  researchStatusGaps: researchStatusGaps.length,
  researchStatusGapIds: researchStatusGaps,
  openResearchStatusCount: openResearchStatuses.length,
  openResearchStatuses,
  archetypeEnergyGaps,
  relationshipEdgeCount: (registry.relationshipEdges || []).length,
  relationshipEdgeErrors,
  unresolvedRelationshipTargetCount: unresolvedRelationshipTargetIds.length,
  unresolvedRelationshipTargetIds,
  runtimeRecordCount: (runtimeDb.entries || []).filter((entry) => String(entry.id || '').startsWith('psych:')).length,
  runtimeRecordCoverage: records.filter((record) => runtimeIds.has('psych:' + record.id)).length,
  runtimeMissingRecordIds,
  fetterResearchRecordCount: (fetterRegistry.records || []).length,
  fetterResearchOverlayCoverage: fetterOverlayCoverage,
  fetterResearchOverlayMissingIds: fetterOverlayMissingIds,
  fetterResearchPassFailures: fetterPassFailures,
  fetterPromptCount: (fetterPrompts.records || []).length,
  mobPatternSourceRecordCount: (mobPatternRegistry.records || []).length,
  mobPatternClaimedCount: mobPatternRegistry.claimedPatternCount,
  mobPatternMissingSourceRows: mobPatternRegistry.counts?.missingRows,
  mobPatternOverlayCoverage,
  mobPatternOverlayMissingIds,
  mobPatternPassFailures,
  fetterPromptRegisterErrors: promptRegisterErrors.length,
  fetterPromptExampleValidationPendingCount: (fetterPrompts.records || []).filter((prompt) => !prompt.exampleValidationStatus || prompt.exampleValidationStatus === 'PENDING_EXAMPLE_EVIDENCE').length,
  fetterPromptNodeCount: Object.keys(promptCountsByNode).length,
  fetterPromptRowsPerNodeErrors: Object.entries(promptCountsByNode).filter(([id, count]) => count !== 9).map(([id, count]) => ({ id, count })),
  behavioralDomainRecordCount: records.filter((record) => record.recordType === 'behavioral_domain').length,
  behavioralDomainsWithCompleteEnergyFields: records.filter((record) => record.recordType === 'behavioral_domain' && ['behavioralEnergy', 'motivationalPull', 'attentionBias', 'actionTendency', 'adaptiveExpression', 'distortedExpression', 'researchSynthesis', 'researchLimitations'].every((field) => !empty(record[field]))).length,
  behavioralDomainGaps,
  behavioralDomainPassReviewDateGaps: passReviewDateGaps,
  researchPassReviewDateGapCount: researchPassReviewDateGaps.length,
  researchPassReviewDateGaps,
  duplicateOrMissingIds: duplicateIds,
  danglingReferences: dangling,
  runtimeIntegrated,
  closureStatus: (
    runtimeIntegrated &&
    records.length === runtimeRecordCoverage &&
    fetterOverlayCoverage === (fetterRegistry.records || []).length &&
    mobPatternOverlayCoverage === (mobPatternRegistry.records || []).length &&
    !(mobPatternRegistry.counts && mobPatternRegistry.counts.missingRows) &&
    fetterPromptRegisterErrors.length === 0 &&
    report.fetterPromptExampleValidationPendingCount === 0 &&
    passReviewDateGaps.length === 0 &&
    !incomplete.length && !blockedResearch.length && !researchStatusGaps.length &&
    !archetypeEnergyGaps.length && !behavioralDomainGaps.length &&
    !relationshipEdgeErrors.length && !duplicateIds.length && !dangling.length
  ) ? 'STATIC_KPI_GATES_PASS_RUNTIME_REGRESSION_REQUIRED' : 'OPEN_NOT_CLOSURE',
  blockers: { incompleteRecords: incomplete, blockedResearchRecords: blockedResearch }
};
process.stdout.write(JSON.stringify(report, null, 2) + '\n');

if (strict && (
  !report.countMatches ||
  report.recordsWithIncompleteTemplateContent ||
  report.recordsWithBlockedOrInsufficientResearchEvidence ||
  report.researchStatusGaps ||
  report.openResearchStatusCount ||
  report.archetypeEnergyGaps.length ||
  report.relationshipEdgeErrors.length ||
  report.behavioralDomainGaps.length ||
  report.behavioralDomainPassReviewDateGaps.length ||
  report.researchPassReviewDateGapCount ||
  report.runtimeMissingRecordIds.length ||
  report.fetterResearchOverlayMissingIds.length ||
  report.mobPatternOverlayMissingIds.length ||
  report.mobPatternMissingSourceRows ||
  report.fetterPromptExampleValidationPendingCount ||
  report.duplicateOrMissingIds.length ||
  report.danglingReferences.length ||
  report.runtimeIntegrated !== true
)) process.exitCode = 1;
