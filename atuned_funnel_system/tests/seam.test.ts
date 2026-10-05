import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  projectRelease,
  projectVerification,
  projectFunnelActivity,
  buildTraceIndex,
  lookupNode,
  neighborsOf,
} from '../src/seam/trace-bridge.js';
import { buildReflectionView } from '../src/seam/reflection-view.js';
import {
  validateWebhookPayload,
  extractCustomerId,
  extractPriceId,
} from '../src/seam/payment-boundary.js';
import type { ReleaseRef, VerificationRef, FunnelSession } from '../src/domain.js';

// ---------- fixtures ----------

function fakeRelease(overrides: Partial<ReleaseRef> = {}): ReleaseRef {
  return {
    id: 'rel_1',
    patternId: '42',
    addressIds: [42, 43],
    status: 'completed',
    ...overrides,
  };
}

function fakeVerification(overrides: Partial<VerificationRef> = {}): VerificationRef {
  return {
    id: 'ver_1',
    releaseId: 'rel_1',
    status: 'something_moved',
    userReport: null,
    ...overrides,
  };
}

function fakeSession(overrides: Partial<FunnelSession> = {}): FunnelSession {
  const now = new Date().toISOString();
  return {
    id: 'session_test',
    anonymousId: 'anon_1',
    userId: null,
    state: 'RITUAL',
    status: 'active',
    selectedGroundId: 'anxiety',
    starterGiftId: 'gift_1',
    tutorialCompleted: false,
    firstReleaseId: 'rel_1',
    verificationId: 'ver_1',
    version: 1,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

// ==========================================================================
// TRACE BRIDGE
// ==========================================================================

test('projectRelease emits release, pattern, and addresses edge intents', () => {
  const rel = fakeRelease({ addressIds: [10, 11] });
  const intents = projectRelease(rel, [1]);
  const ops = intents.map((i) => i.op);
  assert.ok(ops.includes('node'), 'must emit node intents');
  assert.ok(ops.includes('edge'), 'must emit edge intents');
  const nodeIntents = intents.filter((i) => i.op === 'node');
  const releaseNodes = nodeIntents.filter((i) => i.op === 'node' && i.type === 'release');
  const patternNodes = nodeIntents.filter((i) => i.op === 'node' && i.type === 'pattern');
  assert.equal(releaseNodes.length, 2, 'one release node per address');
  assert.equal(patternNodes.length, 2, 'one pattern node per address');
  const edgeIntents = intents.filter((i) => i.op === 'edge');
  assert.equal(edgeIntents.length, 2, 'one addresses edge per address');
  assert.ok(edgeIntents.every((e) => e.op === 'edge' && e.edge === 'addresses'));
});

test('projectRelease marks release nodes as observed and pattern nodes as known', () => {
  const intents = projectRelease(fakeRelease({ addressIds: [5] }), [1]);
  const releaseNode = intents.find((i) => i.op === 'node' && i.type === 'release');
  const patternNode = intents.find((i) => i.op === 'node' && i.type === 'pattern');
  assert.ok(releaseNode && releaseNode.op === 'node' && releaseNode.src === 'observed');
  assert.ok(patternNode && patternNode.op === 'node' && patternNode.src === 'known');
});

test('projectVerification emits an observation node for any status', () => {
  for (const status of ['feel_different', 'see_differently', 'something_moved', 'nothing_changed', 'not_sure'] as const) {
    const ver = fakeVerification({ status });
    const intents = projectVerification(ver, [42]);
    const obsNode = intents.find((i) => i.op === 'node' && i.type === 'observation');
    assert.ok(obsNode, `must emit observation node for status ${status}`);
  }
});

test('projectVerification emits an outcome node only when a shift was observed', () => {
  const shiftStatuses = ['feel_different', 'see_differently', 'something_moved'] as const;
  const noShiftStatuses = ['nothing_changed', 'not_sure'] as const;
  for (const status of shiftStatuses) {
    const intents = projectVerification(fakeVerification({ status }), [42]);
    const outcomeNode = intents.find((i) => i.op === 'node' && i.type === 'outcome');
    assert.ok(outcomeNode, `must emit outcome node for shift status ${status}`);
  }
  for (const status of noShiftStatuses) {
    const intents = projectVerification(fakeVerification({ status }), [42]);
    const outcomeNode = intents.find((i) => i.op === 'node' && i.type === 'outcome');
    assert.equal(outcomeNode, undefined, `must NOT emit outcome node for non-shift status ${status}`);
  }
});

test('projectFunnelActivity joins releases and verifications by releaseId', () => {
  const rel = fakeRelease({ id: 'rel_x', addressIds: [1] });
  const ver = fakeVerification({ id: 'ver_x', releaseId: 'rel_x', status: 'something_moved' });
  const intents = projectFunnelActivity([rel], [ver]);
  assert.ok(intents.length > 0, 'must produce intents');
  const outcomeNodes = intents.filter((i) => i.op === 'node' && i.type === 'outcome');
  assert.equal(outcomeNodes.length, 1, 'verification outcome must be included when joined');
});

test('projectFunnelActivity omits verification outcome for unknown releaseId', () => {
  const ver = fakeVerification({ releaseId: 'rel_not_in_releases', status: 'something_moved' });
  const intents = projectFunnelActivity([], [ver]);
  // observation is still emitted; outcome is not (addressIds will be empty)
  const obsNodes = intents.filter((i) => i.op === 'node' && i.type === 'observation');
  assert.equal(obsNodes.length, 1, 'observation node still emitted');
  const outcomeNodes = intents.filter((i) => i.op === 'node' && i.type === 'outcome');
  assert.equal(outcomeNodes.length, 0, 'no outcome when addressIds unknown');
});

test('buildTraceIndex builds a queryable in-memory index from a raw graph', () => {
  const rel = fakeRelease({ addressIds: [7] });
  const intents = projectRelease(rel, [1]);
  const graph = { v: 1, nodes: [] as ReturnType<typeof projectRelease>[number][], edges: [] as ReturnType<typeof projectRelease>[number][] };
  for (const intent of intents) {
    if (intent.op === 'node') (graph.nodes as unknown[]).push({ type: intent.type, id: intent.id, src: intent.src });
    if (intent.op === 'edge') (graph.edges as unknown[]).push({ from: intent.from, edge: intent.edge, to: intent.to, src: intent.src });
  }
  const ix = buildTraceIndex(graph as import('../src/seam/trace-bridge.js').TraceGraph);
  const patternNode = lookupNode(ix, 'pattern', '7');
  assert.ok(patternNode, 'must find pattern node by type and id');
  assert.equal(patternNode!.src, 'known');
});

test('lookupNode returns null for an absent node', () => {
  const ix = buildTraceIndex({ v: 1, nodes: [], edges: [] });
  assert.equal(lookupNode(ix, 'pattern', 'absent'), null);
});

test('neighborsOf returns downstream nodes filtered by edge type', () => {
  const graph: import('../src/seam/trace-bridge.js').TraceGraph = {
    v: 1,
    nodes: [
      { type: 'release', id: '42:1', src: 'observed' },
      { type: 'pattern', id: '42', src: 'known' },
    ],
    edges: [
      { from: 'release:42:1', edge: 'addresses', to: 'pattern:42', src: 'observed' },
    ],
  };
  const ix = buildTraceIndex(graph);
  const neighbors = neighborsOf(ix, 'release:42:1', 'addresses');
  assert.equal(neighbors.length, 1);
  assert.equal(neighbors[0]!.id, '42');
  assert.equal(neighbors[0]!.type, 'pattern');
});

// ==========================================================================
// REFLECTION VIEW MODEL
// ==========================================================================

test('buildReflectionView returns an empty view when there are no releases', () => {
  const view = buildReflectionView(fakeSession(), [], []);
  assert.equal(view.releaseCount, 0);
  assert.equal(view.releasedPatternIds.length, 0);
  assert.equal(view.hasCompletedWork, false);
  assert.equal(view.allReleasesVerified, false);
});

test('buildReflectionView counts releases and unique pattern IDs', () => {
  const releases = [
    fakeRelease({ id: 'r1', patternId: 'p1', addressIds: [1] }),
    fakeRelease({ id: 'r2', patternId: 'p1', addressIds: [2] }),
    fakeRelease({ id: 'r3', patternId: 'p2', addressIds: [3] }),
  ];
  const view = buildReflectionView(fakeSession(), releases, []);
  assert.equal(view.releaseCount, 3);
  assert.equal(view.releasedPatternIds.length, 2, 'two unique patterns from three releases');
});

test('buildReflectionView marks hasCompletedWork only when both release and verification exist', () => {
  const rel = fakeRelease({ id: 'r1' });
  const ver = fakeVerification({ releaseId: 'r1' });
  const withBoth = buildReflectionView(fakeSession(), [rel], [ver]);
  assert.equal(withBoth.hasCompletedWork, true);
  const withoutVer = buildReflectionView(fakeSession(), [rel], []);
  assert.equal(withoutVer.hasCompletedWork, false);
});

test('buildReflectionView marks allReleasesVerified only when every release is verified', () => {
  const r1 = fakeRelease({ id: 'r1', addressIds: [1] });
  const r2 = fakeRelease({ id: 'r2', patternId: 'p2', addressIds: [2] });
  const v1 = fakeVerification({ releaseId: 'r1' });
  const v2 = fakeVerification({ id: 'v2', releaseId: 'r2', status: 'nothing_changed' });
  const bothVerified = buildReflectionView(fakeSession(), [r1, r2], [v1, v2]);
  assert.equal(bothVerified.allReleasesVerified, true);
  const oneVerified = buildReflectionView(fakeSession(), [r1, r2], [v1]);
  assert.equal(oneVerified.allReleasesVerified, false);
});

test('buildReflectionView counts shift vs unchanged verifications correctly', () => {
  const rels = [
    fakeRelease({ id: 'r1', addressIds: [1] }),
    fakeRelease({ id: 'r2', patternId: 'p2', addressIds: [2] }),
    fakeRelease({ id: 'r3', patternId: 'p3', addressIds: [3] }),
  ];
  const vers = [
    fakeVerification({ id: 'v1', releaseId: 'r1', status: 'something_moved' }),
    fakeVerification({ id: 'v2', releaseId: 'r2', status: 'feel_different' }),
    fakeVerification({ id: 'v3', releaseId: 'r3', status: 'nothing_changed' }),
  ];
  const view = buildReflectionView(fakeSession(), rels, vers);
  assert.equal(view.verification.shiftObserved, 2);
  assert.equal(view.verification.unchanged, 1);
  assert.equal(view.verification.total, 3);
});

test('buildReflectionView attaches addressIds per pattern view', () => {
  const rel = fakeRelease({ addressIds: [10, 20] });
  const view = buildReflectionView(fakeSession(), [rel], []);
  assert.deepEqual(view.patterns[0]!.addressIds, [10, 20]);
});

test('buildReflectionView attaches verification status to the matching pattern', () => {
  const rel = fakeRelease({ id: 'r1' });
  const ver = fakeVerification({ releaseId: 'r1', status: 'see_differently' });
  const view = buildReflectionView(fakeSession(), [rel], [ver]);
  assert.equal(view.patterns[0]!.verificationStatus, 'see_differently');
});

// ==========================================================================
// PAYMENT BOUNDARY
// ==========================================================================

test('validateWebhookPayload accepts a valid checkout.session.completed payload', () => {
  const raw = {
    id: 'evt_123',
    type: 'checkout.session.completed',
    livemode: false,
    data: { object: { customer: 'cus_abc', metadata: {} } },
  };
  const result = validateWebhookPayload(raw);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.payload.id, 'evt_123');
    assert.equal(result.payload.type, 'checkout.session.completed');
  }
});

test('validateWebhookPayload rejects a non-object payload', () => {
  const result = validateWebhookPayload('not an object');
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, 'PAYMENT_EVENT_INVALID');
});

test('validateWebhookPayload rejects a missing event id', () => {
  const raw = { type: 'checkout.session.completed', data: { object: {} } };
  const result = validateWebhookPayload(raw);
  assert.equal(result.ok, false);
});

test('validateWebhookPayload rejects an unsupported event type', () => {
  const raw = {
    id: 'evt_x', type: 'payment_intent.created', livemode: false,
    data: { object: {} },
  };
  const result = validateWebhookPayload(raw);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reason.includes('unsupported event type'));
});

test('validateWebhookPayload rejects a missing data.object', () => {
  const raw = { id: 'evt_x', type: 'invoice.payment_succeeded', livemode: false, data: {} };
  const result = validateWebhookPayload(raw);
  assert.equal(result.ok, false);
});

test('extractCustomerId reads from the customer field of the object', () => {
  const id = extractCustomerId({ customer: 'cus_xyz', foo: 'bar' });
  assert.equal(id, 'cus_xyz');
  assert.equal(extractCustomerId({}), null);
});

test('extractPriceId reads from items.data[0].price.id on a subscription object', () => {
  const obj = {
    items: { data: [{ price: { id: 'price_abc' } }] },
  };
  assert.equal(extractPriceId(obj), 'price_abc');
});

test('extractPriceId falls back to metadata.price_id', () => {
  const obj = { metadata: { price_id: 'price_from_meta' } };
  assert.equal(extractPriceId(obj), 'price_from_meta');
});

test('extractPriceId returns null when no price info exists', () => {
  assert.equal(extractPriceId({}), null);
});
