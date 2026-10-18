'use strict';
const assert = require('node:assert/strict');
const { getModel, summarizeSelection, inferUp } = require('./hierarchy-graph');

const model = getModel();
assert.equal(model.counts.fetters, 9);
assert.equal(model.counts.saboteurs, 33);
assert.equal(model.counts.complexes, 0, 'do not fabricate a canonical Complex roster');
assert.equal(model.counts.supercomplexes, 0, 'do not fabricate a canonical Supercomplex roster');
assert.equal(model.counts.unresolved_layer_placeholders, 2);
assert.equal(model.counts.canonical_fetter_to_saboteur_edges, 70);
assert.equal(model.counts.source_supported_saboteur_to_archetype_edges, 23);
assert.ok(model.gaps.some(g => g.id === 'GAP-SAB-CMP-001' && g.severity === 'P0'));
assert.ok(model.gaps.some(g => g.id === 'GAP-HCX-SCX-001' && g.severity === 'P0'));

const top = summarizeSelection('supercomplex:roster-unresolved');
assert.equal(top.selected.layer, 'supercomplex');
assert.equal(top.tree.status, 'blocked_roster_not_canonical');
assert.ok(top.tree.unresolved_boundaries.some(g => g.id === 'GAP-HCX-SCX-001'));

const inverse = inferUp(['saboteur:Micromanager']);
assert.ok(inverse.candidates.some(c => c.candidate_id === 'archetype:Warrior'));
assert.ok(inverse.candidates.some(c => c.candidate_id === 'archetype:Ruler'));
assert.ok(inverse.candidates.every(c => c.inference_status === 'source_supported_path'));
assert.ok(inverse.warning.includes('not guessed'));

const axisInverse = inferUp(['fetter:fear']);
assert.ok(axisInverse.candidates.some(c => c.candidate_id === 'saboteur:Micromanager'));
assert.ok(axisInverse.candidates.some(c => c.candidate_id === 'archetype:Warrior'));
console.log('hierarchy-graph: structural trace and inverse inference tests passed');
