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
