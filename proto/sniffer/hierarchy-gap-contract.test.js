'use strict';

const assert = require('node:assert/strict');
const { getModel, nodes, edges, gaps, summarizeSelection, inferUp } = require('./hierarchy-graph');

const model = getModel();
const validLayers = new Set([...model.layers, 'archetype_context']);
const ids = nodes.map(node => node.id);

assert.equal(new Set(ids).size, ids.length, 'node IDs must be unique');
assert.ok(edges.every(edge => nodes.some(node => node.id === edge.from) && nodes.some(node => node.id === edge.to)),
  'every edge endpoint must resolve to an explicit node');
assert.ok(gaps.length > 0, 'unknown structure must be represented as gaps, not silently omitted');
assert.ok(gaps.every(gap => gap.id && gap.severity && gap.status && gap.reason && gap.required_action),
  'each gap needs stable ID, severity, status, reason, and next action');
assert.ok(gaps.every(gap => validLayers.has(gap.from_layer) && validLayers.has(gap.to_layer)),
  'every gap must identify valid hierarchy boundary layers');

for (const boundary of [
  ['saboteur', 'complex'],
  ['complex', 'hypercomplex'],
  ['hypercomplex', 'supercomplex']
]) {
  assert.ok(gaps.some(gap => gap.from_layer === boundary[0] && gap.to_layer === boundary[1]),
    'missing boundary must be represented: ' + boundary.join(' -> '));
}

const blockedTop = summarizeSelection('supercomplex:roster-unresolved');
assert.equal(blockedTop.tree.status, 'blocked_roster_not_canonical');
assert.ok(blockedTop.tree.unresolved_boundaries.length > 0,
  'top-level selection must surface unresolved boundaries');

const inverted = inferUp(['saboteur:Micromanager']);
assert.ok(inverted.warning.includes('not guessed'));
assert.ok(inverted.blocked_boundaries.length > 0,
  'bottom-up inference must surface unresolved higher-level boundaries');
assert.ok(model.nodes.every(node => !node.placeholder || /unresolved/i.test(node.name) || /blocked/i.test(node.status)),
  'placeholders must be visibly unresolved, never masquerade as canonical entities');

console.log('hierarchy-gap-contract: explicit boundaries, valid edges, traceability, and no-fabrication checks passed');
