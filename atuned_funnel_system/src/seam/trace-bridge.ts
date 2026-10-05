/* ============================================================
   SEAM: TRACE GRAPH BRIDGE (P1)
   Section 6 of the Master Seam Implementation spec.

   WHAT THIS FILE OWNS:
   - TypeScript types that mirror the runtime shapes trace.js uses
   - projectFunnelActivity() — a pure function that maps funnel
     releases and verifications to TraceIntent[] proposals the
     engine can apply via traceApply(graph, intents, now)
   - Typed read helpers (lookupNode, neighborsOf, pathBetween
     type signatures only — the real call is the engine's own
     tracePath/traceNeighbors)

   WHAT IT DOES NOT OWN:
   - traceApply(), traceFromRecord(), or any mutation of a stored
     graph: those stay in engine/trace.js and engine/practice.js
   - The graph itself: it is p.trace on the person's own profile
   - Any storage read or write: pure function in, pure function out

   TRUST HIERARCHY POSITION:
   USER INPUT → PROFILE RECORD → EXISTING ENGINE →
   DOMAIN ORCHESTRATION → GRAPH PROJECTION (this file) →
   REFLECTION VIEW MODEL → UI

   This layer only reads domain objects and produces intents.
   It never mutates, never calls the engine directly, never stores.
   ============================================================ */

import type { ReleaseRef, VerificationRef } from '../domain.js';

// ---------- node and edge type vocabularies (verbatim from trace.js) ----------

export type TraceNodeType =
  | 'story' | 'impression' | 'pattern' | 'goal' | 'behavior' | 'protocol'
  | 'ritual' | 'practice_event' | 'observation' | 'evidence' | 'outcome'
  | 'context' | 'somatic_state' | 'reframe' | 'release';

export type TraceEdgeType =
  | 'causes' | 'associated_with' | 'supports' | 'contradicts' | 'obstructs'
  | 'reinforces' | 'targets' | 'addresses' | 'requires' | 'implements'
  | 'executes' | 'produces' | 'measures' | 'occurs_in' | 'replaces'
  | 'precedes' | 'follows' | 'generalizes_to' | 'transfers_to';

/** Provenance vocabulary: exactly how trace.js orders these (TDD section 26).
 *  A reading the sniffer made is inferred; a person confirming it makes it
 *  user_confirmed. A funnel release is observed. */
export type TraceProvenance = 'known' | 'inferred' | 'proposed' | 'user_confirmed' | 'observed';

// ---------- node and edge runtime shapes (matching trace.js) ----------

export interface TraceNode {
  type: TraceNodeType;
  id: string;
  src: TraceProvenance;
  /** ISO timestamp the node was added, when available. */
  at?: string;
  /** What the node's provenance was before it was promoted. */
  was?: TraceProvenance;
  /** Free attrs bag (domain-specific: law, charge, etc.). */
  attrs?: Record<string, unknown>;
}

export interface TraceEdge {
  from: string;
  edge: TraceEdgeType;
  to: string;
  src: TraceProvenance;
  at?: string;
  was?: TraceProvenance;
  attrs?: Record<string, unknown>;
}

/** A graph as trace.js stores it on p.trace. */
export interface TraceGraph {
  v: number;
  nodes: TraceNode[];
  edges: TraceEdge[];
}

// ---------- intent shapes (what traceApply() in trace.js accepts) ----------

/** A single proposal to add a node — maps directly to trace.js intent format. */
export interface TraceNodeIntent {
  op: 'node';
  type: TraceNodeType;
  id: string;
  src: TraceProvenance;
}

/** A single proposal to add an edge — maps directly to trace.js intent format. */
export interface TraceEdgeIntent {
  op: 'edge';
  from: string;
  edge: TraceEdgeType;
  to: string;
  src: TraceProvenance;
}

export type TraceIntent = TraceNodeIntent | TraceEdgeIntent;

// ---------- projection: funnel activity → trace intents ----------

/** Release key format: `${addressId}:${channel}` — the canonical form
 *  trace.js expects for a release or reframe node id. */
function releaseNodeId(addressId: number, channel: number): string {
  return `${addressId}:${channel}`;
}

/** Project a completed release into the trace intents that record it.
 *
 *  For each address the release worked, emits:
 *  - a `release` node (`observed`)
 *  - a `pattern` node for the address (`known`)
 *  - a `release addresses pattern` edge (`observed`)
 *
 *  The intents are proposals only. The caller passes them to
 *  traceApply(graph, intents, now) in the engine; this file never
 *  calls traceApply itself. */
export function projectRelease(release: ReleaseRef, channels: number[]): TraceIntent[] {
  const intents: TraceIntent[] = [];
  for (const addressId of release.addressIds) {
    const ch = channels[0] ?? 1;
    const rid = releaseNodeId(addressId, ch);
    const pid = String(addressId);
    intents.push({ op: 'node', type: 'release', id: rid, src: 'observed' });
    intents.push({ op: 'node', type: 'pattern', id: pid, src: 'known' });
    intents.push({ op: 'edge', from: `release:${rid}`, edge: 'addresses', to: `pattern:${pid}`, src: 'observed' });
  }
  return intents;
}

/** Project a recorded verification into the trace intents that record it.
 *
 *  Emits:
 *  - an `observation` node for the verification (`observed`)
 *  - an `observation produces outcome` edge (`observed`) if status is
 *    feel_different, see_differently, or something_moved (shift observed)
 *  - an `observation associated_with release` edge (`observed`)
 *
 *  The caller decides whether to apply these to the stored graph. */
export function projectVerification(verification: VerificationRef, releaseAddressIds: number[]): TraceIntent[] {
  const intents: TraceIntent[] = [];
  const obsId = `verify:${verification.releaseId}`;
  intents.push({ op: 'node', type: 'observation', id: obsId, src: 'observed' });

  const shifted: TraceProvenance = 'observed';
  for (const addressId of releaseAddressIds) {
    const pid = String(addressId);
    intents.push({ op: 'node', type: 'pattern', id: pid, src: 'known' });
    if (verification.status === 'feel_different' || verification.status === 'see_differently' || verification.status === 'something_moved') {
      intents.push({ op: 'node', type: 'outcome', id: `outcome:${verification.releaseId}`, src: shifted });
      intents.push({ op: 'edge', from: `observation:${obsId}`, edge: 'produces', to: `outcome:outcome:${verification.releaseId}`, src: shifted });
    }
    intents.push({ op: 'edge', from: `observation:${obsId}`, edge: 'associated_with', to: `pattern:${pid}`, src: 'observed' });
  }
  return intents;
}

/** Project a full funnel session's known releases and verifications into a
 *  flat list of trace intents. The caller is responsible for calling
 *  traceApply(graph, intents, now) in the engine and persisting the result.
 *
 *  Never produces duplicate node intents for the same id: the engine's own
 *  traceNodeAdd deduplicates on (type, id), so duplicates are harmless but
 *  the caller may de-dup here first for efficiency. */
export function projectFunnelActivity(
  releases: ReleaseRef[],
  verifications: VerificationRef[],
  channels: number[] = [1],
): TraceIntent[] {
  const intents: TraceIntent[] = [];
  for (const rel of releases) {
    intents.push(...projectRelease(rel, channels));
  }
  const releaseMap = new Map<string, ReleaseRef>(releases.map((r) => [r.id, r]));
  for (const ver of verifications) {
    const rel = releaseMap.get(ver.releaseId);
    intents.push(...projectVerification(ver, rel?.addressIds ?? []));
  }
  return intents;
}

// ---------- typed read helpers (types only — the engine owns the impl) ----------

/** Shape of the index that traceIx() in trace.js builds.
 *  Returned by `traceIx(graph)` in the engine; typed here for callers
 *  that need to navigate the graph on the TypeScript side. */
export interface TraceIndex {
  node: Record<string, TraceNode>;
  edge: Record<string, TraceEdge>;
  out: Record<string, Array<{ a: string; b: string; t: string; e: TraceEdge }>>;
  inn: Record<string, Array<{ a: string; b: string; t: string; e: TraceEdge }>>;
}

/** Build a typed in-memory index from a stored graph.
 *  Equivalent to traceIx() in trace.js, re-implemented in TypeScript
 *  so callers that already have the graph as a typed object do not need
 *  to call into the untyped JS engine just to look a node up. */
export function buildTraceIndex(graph: TraceGraph): TraceIndex {
  const ix: TraceIndex = { node: {}, edge: {}, out: {}, inn: {} };
  for (const n of graph.nodes) {
    ix.node[`${n.type}:${n.id}`] = n;
  }
  for (const e of graph.edges) {
    const key = `${e.from}|${e.edge}|${e.to}`;
    ix.edge[key] = e;
    (ix.out[e.from] ??= []).push({ a: e.from, b: e.to, t: e.edge, e });
    (ix.inn[e.to] ??= []).push({ a: e.from, b: e.to, t: e.edge, e });
  }
  return ix;
}

/** Return all nodes this node has an outgoing edge to, filtered by edge type. */
export function neighborsOf(
  ix: TraceIndex,
  nodeKey: string,
  edgeType?: TraceEdgeType,
): TraceNode[] {
  const arcs = ix.out[nodeKey] ?? [];
  const filtered = edgeType ? arcs.filter((a) => a.t === edgeType) : arcs;
  return filtered.map((a) => ix.node[a.b]).filter((n): n is TraceNode => n != null);
}

/** Look up a typed node by type and id. Returns null when absent. */
export function lookupNode(ix: TraceIndex, type: TraceNodeType, id: string): TraceNode | null {
  return ix.node[`${type}:${id}`] ?? null;
}
