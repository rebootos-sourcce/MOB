#!/usr/bin/env node
/* ATÜNED template/connectivity closure gate.
 * Run after gen-data.js: node proto/knowledge/src/validate-templates.js
 * Deliberately fails closed. It does not fabricate missing canon or infer a
 * template taxonomy for record kinds that have no source-backed assignment.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data.js');
if (!fs.existsSync(file)) throw new Error('Generated data.js is missing; run gen-data.js first.');
const source = fs.readFileSync(file, 'utf8');
const match = source.match(/var KBD=(.*);\s*$/s);
if (!match) throw new Error('Cannot parse generated KBD payload.');
const db = JSON.parse(match[1]);
const entries = db.entries || [];
const warnings = [];
const strictDeepPsychological = process.argv.includes('--strict-deep-psychological');
const dpRegistry = db.deepPsychologicalRegistry;
const dpCatalog = db.deepPsychologicalTemplateCatalog;
const dpSummary = { status: 'MISSING', recordCount: 0, uniqueIdCount: 0, contentProvisionalCount: 0, emptyLinkCount: 0, blockedResearchPassCount: 0, danglingReferences: [], missingTemplateFields: [], notes: [] };
if (!dpRegistry || !Array.isArray(dpRegistry.records) || !dpCatalog || !Array.isArray(dpCatalog.templates)) {
  errors.push('Deep Psychological registry/template catalog missing from generated data; regenerate with updated gen-data.js.');
} else {
  const dpRecords = dpRegistry.records;
  const dpById = new Map();
  const dpTemplates = new Map(dpCatalog.templates.map(t => [t.id, t]));
  dpSummary.status = 'OPEN';
  dpSummary.recordCount = dpRecords.length;
  for (const r of dpRecords) {
    if (!r.id) errors.push('Deep Psychological record has no stable ID');
    else if (dpById.has(r.id)) errors.push('Deep Psychological duplicate ID: ' + r.id);
    else dpById.set(r.id, r);
    const t = dpTemplates.get(r.templateId);
    if (!t) errors.push((r.id || '<unknown>') + ': undefined Deep Psychological template ' + r.templateId);
    else {
      const missing = t.fields.filter(f => r[f] === undefined || r[f] === null || r[f] === '');
      if (missing.length) dpSummary.missingTemplateFields.push({ id: r.id, fields: missing });
    }
    if (!Array.isArray(r.links) || r.links.length === 0) dpSummary.emptyLinkCount++;
    if ((r.templateValidation || {}).contentStatus !== 'complete' && r.recordType !== 'blueprint_domain_slot') dpSummary.contentProvisionalCount++;
    const passes = Array.isArray(r.researchPasses) ? r.researchPasses : [];
    if (passes.length !== 3 || passes.some(p => p.status !== 'complete')) dpSummary.blockedResearchPassCount++;
  }
  dpSummary.uniqueIdCount = dpById.size;
  for (const r of dpRecords) {
    for (const field of ['links','childIds','upstreamInfluenceIds','downstreamEffectIds']) {
      for (const target of r[field] || []) if (!dpById.has(target)) dpSummary.danglingReferences.push({ from:r.id, field, to:target });
    }
    if (r.parentId && !dpById.has(r.parentId)) dpSummary.danglingReferences.push({ from:r.id, field:'parentId', to:r.parentId });
    for (const rel of r.relationships || []) for (const target of [rel.fromId, rel.toId]) if (target && !dpById.has(target)) dpSummary.danglingReferences.push({ from:r.id, field:'relationships', to:target });
  }
  if (dpRegistry.recordCount !== dpRecords.length || dpSummary.uniqueIdCount !== dpRecords.length) errors.push('Deep Psychological registry count/unique-ID mismatch');
  if (dpSummary.missingTemplateFields.length) errors.push('Deep Psychological records have missing actual template fields: ' + dpSummary.missingTemplateFields.length);
  if (dpSummary.danglingReferences.length) errors.push('Deep Psychological registry has dangling references: ' + dpSummary.danglingReferences.length);
  if (dpSummary.emptyLinkCount || dpSummary.contentProvisionalCount || dpSummary.blockedResearchPassCount) {
    dpSummary.notes.push('Structural integration is present, but semantic content/relationship closure remains open. Empty links are not inferred as edges.');
    warnings.push('Deep Psychological closure remains open: empty links=' + dpSummary.emptyLinkCount + ', provisional content=' + dpSummary.contentProvisionalCount + ', records with blocked research passes=' + dpSummary.blockedResearchPassCount);
  } else dpSummary.status = 'STRUCTURALLY_CLOSED_PENDING_RUNTIME_EDGE_REVIEW';
  if (strictDeepPsychological && (dpSummary.emptyLinkCount || dpSummary.contentProvisionalCount || dpSummary.blockedResearchPassCount || dpSummary.danglingReferences.length || dpSummary.missingTemplateFields.length)) {
    errors.push('Strict Deep Psychological closure gate failed; see deepPsychological summary.');
  }
}
const byId = new Map();
const errors = [];
const counts = {};
const missingByKind = {};
const requiredKinds = ['node','sab','hcx','hypercomplex','complex','supercomplex','inferred'];
for (const e of entries) {
  counts[e.kind] = (counts[e.kind] || 0) + 1;
  if (!e.id) errors.push('record has no stable id');
  else if (byId.has(e.id)) errors.push('duplicate id: ' + e.id);
  else byId.set(e.id, e);
  if (!e.templateId || !e.template || typeof e.template !== 'object') {
    errors.push((e.id || '<unknown>') + ': missing template assignment/payload');
  }
  const missing = (e.templateValidation && e.templateValidation.missingFields) || [];
  if (missing.length) {
    missingByKind[e.kind] = (missingByKind[e.kind] || 0) + 1;
    errors.push(e.id + ': missing required template fields: ' + missing.join(', '));
  }
  for (const target of (e.links || [])) {
    if (!byId.has(target) && !entries.some(x => x.id === target)) {
      errors.push(e.id + ': dangling link ' + target);
    }
  }
}
/* Hypercomplex closure gate: every mode must reach at least one populated
   complex through reciprocal links, and every declared route edge must return. */
for (const e of entries.filter(x => x.kind === 'hypercomplex')) {
  const targets = new Set(e.links || []);
  const linkedSaboteurs = [...targets].map(id => byId.get(id) || entries.find(x => x.id === id))
    .filter(x => x && x.kind === 'sab');
  const linkedComplexes = [...targets].map(id => byId.get(id) || entries.find(x => x.id === id))
    .filter(x => x && x.kind === 'complex');
  if (!e.routeAxes || !e.routeAxes.length) errors.push(e.id + ': missing provisional route axes');
  if (!linkedSaboteurs.length) errors.push(e.id + ': no Saboteur route; hypercomplex graph is disconnected');
  if (!linkedComplexes.length) errors.push(e.id + ': no populated complex-layer link; hypercomplex graph is disconnected');
  for (const target of [...linkedSaboteurs, ...linkedComplexes]) {
    if (!(target.links || []).includes(e.id)) errors.push(e.id + ': non-reciprocal hypercomplex route to ' + target.id);
  }
  const opposite = entries.find(x => x.id === e.oppositeId);
  if (!opposite || !(opposite.links || []).includes(e.id)) errors.push(e.id + ': missing reciprocal inferred counterpart');
}
for (const kind of requiredKinds) {
  if (!counts[kind]) errors.push('required domain kind absent from generated catalog: ' + kind);
}
console.log(JSON.stringify({
  entryCount: entries.length,
  counts,
  missingByKind,
  requiredKinds,
  status: errors.length ? 'FAIL' : (warnings.length ? 'PASS_WITH_DEEP_PSYCHOLOGICAL_GAPS' : 'PASS'),
  errorCount: errors.length,
  warningCount: warnings.length,
  deepPsychological: dpSummary,
  warnings,
  errors
}, null, 2));
if (errors.length) process.exitCode = 1;
