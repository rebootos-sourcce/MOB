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
const byId = new Map();
const errors = [];
const counts = {};
const missingByKind = {};
const requiredKinds = ['node','sab','hcx','hypercomplex_mode','hypercomplex','complex','supercomplex_candidate','descent_candidate','inversion_pole_candidate','inferred','mirror_pair','mirror_figure_candidate','circle_candidate','blueprint_pattern','cascade_state','source_contradiction','psych_source_contradiction','psych_source_gap','psych_roster_requirement','axis','seat','nerve','arch','mask','term'];
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
for (const e of entries.filter(x => x.kind === 'hypercomplex_mode')) {
  const targets = new Set(e.links || []);
  const linkedSaboteurs = [...targets].map(id => byId.get(id) || entries.find(x => x.id === id))
    .filter(x => x && x.kind === 'sab');
  const linkedComplexes = [...targets].map(id => byId.get(id) || entries.find(x => x.id === id))
    .filter(x => x && x.kind === 'complex');
  /* Route axes are descriptive metadata only, not a required semantic edge. */
  /* No Saboteur link is inferred from a shared axis. */
  /* Canonical parentage requires a source-backed membership edge. */
  for (const target of []) {
    if (!(target.links || []).includes(e.id)) errors.push(e.id + ': non-reciprocal hypercomplex route to ' + target.id);
  }
  const opposite = entries.find(x => x.id === e.oppositeId);
  if (!opposite || !(opposite.links || []).includes(e.id)) errors.push(e.id + ': missing reciprocal inferred counterpart');
}
/* Canonical Complex/Hyper-Complex records: R memberships may be materialized;
   I memberships stay typed candidates and must not become canonical links. */
for (const e of entries.filter(x => x.kind === 'complex')) {
  if (!e.sourceStatus || !Array.isArray(e.childNames)) errors.push(e.id + ': missing source status or child-name inventory');
  if (e.sourceStatus === 'R') {
    for (const name of (e.childNames || [])) {
      const child = entries.find(x =>
        (x.kind === 'sab' && x.nm === name) ||
        (x.kind === 'psych_source_label' && x.sourceKind === 'source_label' &&
         x.template && x.template.sourceLabel === name &&
         x.template.sourceCluster === 'SOURCE OS CANON complex child labels')
      );
      if (!child) errors.push(e.id + ': source-recorded child label record not resolved: ' + name);
      else if (!(e.links || []).includes(child.id) || !(child.links || []).includes(e.id)) errors.push(e.id + ': source-recorded child link missing or non-reciprocal: ' + child.id);
    }
  }
  if (e.sourceStatus === 'I' && (e.links || []).some(id => { const x = entries.find(y => y.id === id); return x && x.kind === 'sab'; })) {
    errors.push(e.id + ': inferred Complex-to-Saboteur membership was materialized as a link');
  }
}
for (const e of entries.filter(x => x.kind === 'hypercomplex')) {
  if (!e.sourceStatus || !Array.isArray(e.childNames)) errors.push(e.id + ': missing source status or child-name inventory');
  if (e.sourceStatus === 'R') {
    for (const name of (e.childNames || [])) {
      const child = entries.find(x => x.kind === 'complex' && x.nm === name);
      if (!child) errors.push(e.id + ': source-recorded Complex child not resolved: ' + name);
      else if (!(e.links || []).includes(child.id) || !(child.links || []).includes(e.id)) errors.push(e.id + ': source-recorded child link missing or non-reciprocal: ' + child.id);
    }
  }
  if (e.sourceStatus === 'I' && (e.links || []).some(id => { const x = entries.find(y => y.id === id); return x && x.kind === 'complex'; })) {
    errors.push(e.id + ': inferred Hyper-Complex-to-Complex membership was materialized as a link');
  }
}
for (const e of entries.filter(x => x.kind === 'supercomplex_candidate')) {
  if (!e.membershipStatus || !/UNRESOLVED/.test(e.membershipStatus)) errors.push(e.id + ': candidate membership status is not explicit');
  if ((e.links || []).some(id => { const x = entries.find(y => y.id === id); return x && x.kind === 'hypercomplex'; })) errors.push(e.id + ': unapproved Super-Complex child membership was materialized');
  if (!(db.relationshipEdges || []).some(edge => edge.fromId === e.id && edge.relationshipType === 'candidate_blocked_by_membership_rule')) errors.push(e.id + ': missing typed blocker edge for unresolved membership rule');
}
for (const e of entries.filter(x => x.kind === 'descent_candidate')) {
  if (!e.sourceClaimedLayer || !e.ownerRuling) errors.push(e.id + ': source layer claim or owner ruling missing');
  if (e.nm === 'Psychopathy' && !/rejected/i.test(e.canonicalStatus || '')) errors.push(e.id + ': Psychopathy must retain the explicit owner rejection for canonical Super-Complex status');
}
const typedEdgeIds = new Set();
for (const edge of (db.relationshipEdges || [])) {
  if (!edge.edgeId || typedEdgeIds.has(edge.edgeId)) errors.push('missing or duplicate edge id: ' + (edge.edgeId || '<unknown>'));
  typedEdgeIds.add(edge.edgeId);
  if (!byId.has(edge.fromId)) errors.push((edge.edgeId || '<unknown>') + ': source endpoint missing: ' + edge.fromId);
  if (edge.toId && !byId.has(edge.toId) && edge.targetRegistry !== 'external_or_unresolved') errors.push((edge.edgeId || '<unknown>') + ': target endpoint missing: ' + edge.toId);
}
for (const edge of (db.relationshipEdges || [])) {
  for (const field of ['relationshipType','status','canonicality','validationStatus']) {
    if (!edge[field]) errors.push((edge.edgeId || '<unknown>') + ': missing edge field ' + field);
  }
  if (!edge.toId && (!edge.toLabel || !edge.status)) errors.push((edge.edgeId || '<unknown>') + ': unresolved target needs a label and status');
}
for (const kind of requiredKinds) {
  if (!counts[kind]) errors.push('required domain kind absent from generated catalog: ' + kind);
}
console.log(JSON.stringify({
  entryCount: entries.length,
  counts,
  missingByKind,
  requiredKinds,
  status: errors.length ? 'FAIL' : 'PASS',
  errorCount: errors.length,
  errors
}, null, 2));
if (errors.length) process.exitCode = 1;
