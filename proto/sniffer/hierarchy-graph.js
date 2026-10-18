'use strict';

// Geometric hierarchy graph. Only source-backed edges are installed as
// source-backed; missing hierarchy levels remain explicit gaps, never guesses.
const bands = require('./bands');

const LAYERS = Object.freeze(['fetter', 'saboteur', 'complex', 'hypercomplex', 'supercomplex']);
const CONTEXT_LAYERS = Object.freeze(['archetype_context']);
const FETTERS = Object.freeze([
  ['fear', 'Fear'], ['anger', 'Anger'], ['shame', 'Shame'],
  ['disgust', 'Disgust'], ['apathy', 'Apathy'], ['shock', 'Shock'],
  ['sadness', 'Sad'], ['surprise', 'Surprise'], ['anticipation', 'Anticipation']
]);

// Transcribed from SNIFFER_SPEC.md section 4. This is a framing relationship,
// not a claim that archetypes are releasable targets or causal diagnoses.
const SABOTEUR_TO_ARCHETYPE = Object.freeze({
  Warrior: ['Micromanager', 'Judge'],
  Innocent: ['Pleaser', 'Avoider'],
  Orphan: ['Victim', 'Cynic'],
  Caretaker: ['Pleaser', 'Martyr'],
  Explorer: ['Restless', 'Escapist'],
  Outlaw: ['Judge'],
  Lover: ['Hyper-Vigilant', 'Pleaser'],
  Creator: ['Stickler', 'Perfectionist'],
  Jester: ['Avoider', 'Hyper-Rational'],
  Sage: ['Hyper-Rational', 'Skeptic'],
  Magician: ['Victim', 'Manipulator'],
  Ruler: ['Hyper-Achiever', 'Micromanager']
});
const HYPERCOMPLEXES = Object.freeze([
  { id: 'hc-grandiosity', name: 'Grandiosity', cluster: 'I · Narcissism' },
  { id: 'hc-predatory', name: 'Predatory', cluster: 'II' },
  { id: 'hc-collapse', name: 'Collapse', cluster: 'III' },
  { id: 'hc-rigidity', name: 'Rigidity', cluster: 'IV' },
  { id: 'hc-dysregulation', name: 'Dysregulation', cluster: 'V' },
  { id: 'hc-dissociation', name: 'Dissociation', cluster: 'VI' }
]);

const nodes = [];
const edges = [];
const gaps = [
  { id: 'GAP-SAB-CMP-001', from_layer: 'saboteur', to_layer: 'complex', severity: 'P0', status: 'blocked', reason: 'Canonical Complex roster and Saboteur-to-Complex membership graph not located in the inspected source.', required_action: 'Reconcile authoritative ENGINE/canon source; do not infer canonical membership from synthetic scores.' },
  { id: 'GAP-CMP-HCX-001', from_layer: 'complex', to_layer: 'hypercomplex', severity: 'P0', status: 'unresolved', reason: 'The requested Complex layer is not represented as a canonical composition layer in SNIFFER_SPEC.md; the spec instead lists archetypes as layer three.', required_action: 'Reconcile Complex terminology and ordering against authoritative canon before connecting nodes.' },
  { id: 'GAP-ARC-HCX-001', from_layer: 'archetype_context', to_layer: 'hypercomplex', severity: 'P0', status: 'blocked', reason: 'Six hyper-complex modes are listed, but their contributing child membership is not defined in SNIFFER_SPEC.md.', required_action: 'Find authoritative membership/composition records.' },
  { id: 'GAP-HCX-SCX-001', from_layer: 'hypercomplex', to_layer: 'supercomplex', severity: 'P0', status: 'blocked', reason: 'No canonical Supercomplex roster or composition rules were found in the inspected source.', required_action: 'Find and reconcile canonical Supercomplex source before creating nodes or edges.' }
];

for (const [id, name] of FETTERS) nodes.push({ id: 'fetter:' + id, name, layer: 'fetter', status: 'canonical' });
for (const [name, parts] of bands) {
  nodes.push({ id: 'saboteur:' + name, name, layer: 'saboteur', status: 'canonical' });
  for (const [axis, low, high] of parts) {
    edges.push({ from: 'fetter:' + axis, to: 'saboteur:' + name, relationship: 'contributes_to', status: 'canonical', source: 'SNIFFER_SPEC.md §3', band: { low, high } });
  }
}
nodes.push({ id: 'complex:roster-unresolved', name: 'Complex roster — unresolved', layer: 'complex', status: 'blocked_roster_not_canonical', placeholder: true });
nodes.push({ id: 'supercomplex:roster-unresolved', name: 'Supercomplex roster — unresolved', layer: 'supercomplex', status: 'blocked_roster_not_canonical', placeholder: true });
for (const [name, children] of Object.entries(SABOTEUR_TO_ARCHETYPE)) {
  nodes.push({ id: 'archetype:' + name, name, layer: 'archetype_context', status: 'canonical_source_roster_conflicted', context_only: true });
  for (const child of children) edges.push({ from: 'saboteur:' + child, to: 'archetype:' + name, relationship: 'frames', status: 'source_supported', source: 'SNIFFER_SPEC.md §4' });
}
for (const item of HYPERCOMPLEXES) nodes.push({ ...item, layer: 'hypercomplex', status: 'canonical_mode_roster_partial' });

const byId = new Map(nodes.map(node => [node.id, node]));
const childrenById = new Map();
const parentsById = new Map();
for (const edge of edges) {
  if (!childrenById.has(edge.from)) childrenById.set(edge.from, []);
  if (!parentsById.has(edge.to)) parentsById.set(edge.to, []);
  childrenById.get(edge.from).push(edge);
  parentsById.get(edge.to).push(edge);
}

function descend(id, seen = new Set()) {
  if (seen.has(id)) return { id, cycle: true, children: [] };
  seen.add(id);
  const node = byId.get(id);
  if (!node) return { id, missing_node: true, children: [] };
  const links = parentsById.get(id) || []; // incoming edges are children flowing into a selected parent
  const childIds = links.map(edge => edge.from);
  const children = childIds.map(childId => descend(childId, new Set(seen)));
  const adjacentGaps = gaps.filter(g => g.to_layer === node.layer || g.from_layer === node.layer || (node.layer === 'supercomplex' && g.to_layer === 'supercomplex'));
  return {
    id: node.id, name: node.name, layer: node.layer, status: node.status,
    children,
    unresolved_boundaries: adjacentGaps,
    flow_status: adjacentGaps.length ? 'partial_or_blocked' : (children.length ? 'mapped' : 'leaf_or_unmapped')
  };
}

function summarizeSelection(id) {
  const node = byId.get(id);
  if (!node) throw new RangeError('unknown hierarchy node: ' + id);
  const tree = descend(id);
  const counts = { nodes: 0, mapped_edges: 0, source_supported_edges: 0, unresolved_boundaries: 0 };
  function visit(item) {
    if (item.missing_node || item.cycle) return;
    counts.nodes++;
    counts.unresolved_boundaries += item.unresolved_boundaries.length;
    for (const child of item.children || []) visit(child);
  }
  visit(tree);
  const relatedEdges = edges.filter(edge => edge.to === id || edge.from === id);
  counts.mapped_edges = relatedEdges.filter(edge => edge.status === 'canonical').length;
  counts.source_supported_edges = relatedEdges.filter(edge => edge.status === 'source_supported').length;
  return { selected: { id: node.id, name: node.name, layer: node.layer }, tree, counts, gaps };
}

// Invert the stream: starting at one or more child nodes, return all reachable
// parents with the exact edge provenance/status. This does not turn a
// source-supported or missing relationship into a canonical inference.
function inferUp(startIds) {
  const queue = [...startIds].map(id => ({ id, path: [id], statuses: [] }));
  const found = new Map();
  while (queue.length) {
    const current = queue.shift();
    for (const edge of childrenById.get(current.id) || []) {
      const path = [...current.path, edge.to];
      const statuses = [...current.statuses, edge.status];
      const key = edge.to + '|' + path.join('>');
      if (!found.has(key)) found.set(key, {
        candidate_id: edge.to,
        candidate_name: byId.get(edge.to)?.name || edge.to,
        candidate_layer: byId.get(edge.to)?.layer || 'unknown',
        inference_status: statuses.every(s => s === 'canonical') ? 'canonical_path' : 'source_supported_path',
        path,
        edge_statuses: statuses
      });
      queue.push({ id: edge.to, path, statuses });
    }
  }
  const reachable = [...found.values()];
  return {
    start_ids: startIds,
    candidates: reachable,
    blocked_boundaries: gaps.filter(g => startIds.some(id => {
      const node = byId.get(id);
      return node && (node.layer === g.from_layer || node.layer === g.to_layer);
    })),
    warning: 'Candidate ancestors follow recorded edges only. Missing hierarchy edges are not guessed; this is not a diagnosis or a claim about hidden intent.'
  };
}

function getInferredList() {
  return bands.map(([name, parts]) => {
    const id = 'saboteur:' + name;
    const fetterInputs = parts.map(([axis, low, high]) => ({
      node_id: 'fetter:' + axis,
      axis,
      band: { low, high },
      mapping_status: 'canonical',
      source: 'SNIFFER_SPEC.md §3'
    }));
    const sourceSupportedParents = (childrenById.get(id) || [])
      .filter(edge => edge.status === 'source_supported')
      .map(edge => ({
        node_id: edge.to,
        name: byId.get(edge.to)?.name || edge.to,
        layer: byId.get(edge.to)?.layer || 'unknown',
        relationship: edge.relationship,
        mapping_status: edge.status,
        source: edge.source
      }));
    return {
      saboteur_id: id,
      name,
      layer: 'saboteur',
      inputs: fetterInputs,
      source_supported_context_parents: sourceSupportedParents,
      upward_inference: {
        complex: { status: 'blocked', gap_id: 'GAP-SAB-CMP-001' },
        hypercomplex: { status: 'blocked', gap_id: 'GAP-CMP-HCX-001' },
        supercomplex: { status: 'blocked', gap_id: 'GAP-HCX-SCX-001' }
      },
      caveat: 'Parent candidates are source-supported framing relationships only. No missing edge is inferred from synthetic score similarity.'
    };
  });
}

function getModel() {
  return { schema_version: '1.0.0', layers: LAYERS, nodes, edges, gaps, counts: {
    fetters: nodes.filter(n => n.layer === 'fetter').length,
    saboteurs: nodes.filter(n => n.layer === 'saboteur').length,
    archetype_context_nodes: nodes.filter(n => n.layer === 'archetype_context').length,
    hypercomplexes: nodes.filter(n => n.layer === 'hypercomplex').length,
    complexes: nodes.filter(n => n.layer === 'complex' && !n.placeholder).length,
    supercomplexes: nodes.filter(n => n.layer === 'supercomplex' && !n.placeholder).length,
    unresolved_layer_placeholders: nodes.filter(n => n.placeholder).length,
    canonical_fetter_to_saboteur_edges: edges.filter(e => e.status === 'canonical').length,
    source_supported_saboteur_to_archetype_edges: edges.filter(e => e.status === 'source_supported').length
  } };
}
module.exports = { getModel, getInferredList, summarizeSelection, inferUp, nodes, edges, gaps };
