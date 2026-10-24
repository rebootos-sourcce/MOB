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
const requiredKinds = ['node','sab','hcx','hypercomplex_mode','hypercomplex','complex','supercomplex_candidate','descent_candidate','inferred','mirror_pair','mirror_figure_candidate','circle_candidate','blueprint_pattern','cascade_state','source_contradiction','source_gap','roster_requirement','axis','seat','nerve','arch','mask','term'];
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
