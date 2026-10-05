import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCloudConfig,
  validateBackupManifest,
  buildRetentionSchedule,
} from '../src/seam/cloud-persistence.js';
import {
  checkPractitionerAccess,
  buildPractitionerView,
} from '../src/seam/practitioner-access.js';
import type { PractitionerGrant, PractitionerGrantRevocation, ReleaseRef, VerificationRef, FunnelSession, DataRetentionPolicy } from '../src/domain.js';

// ---------- fixtures ----------

const NOW = '2026-10-05T12:00:00.000Z';
const FUTURE = '2027-01-01T00:00:00.000Z';
const PAST = '2025-01-01T00:00:00.000Z';

function fakeGrant(overrides: Partial<PractitionerGrant> = {}): PractitionerGrant {
  return {
    id: 'grant_1',
    practitionerId: 'prac_1',
    subjectUserId: 'user_1',
    grantedScopes: ['release_history', 'verification_history'],
    expiresAt: FUTURE,
    consentToken: 'tok_abc',
    grantedAt: PAST,
    ...overrides,
  };
}

function fakeRevocation(overrides: Partial<PractitionerGrantRevocation> = {}): PractitionerGrantRevocation {
  return {
    id: 'rev_1',
    grantId: 'grant_1',
    revokedAt: NOW,
    revokedBy: 'subject',
    ...overrides,
  };
}

function fakeRelease(id: string): ReleaseRef {
  return { id, patternId: 'p1', addressIds: [1], status: 'completed' };
}

function fakeVerification(id: string, releaseId: string): VerificationRef {
  return { id, releaseId, status: 'something_moved', userReport: null };
}

function fakeSession(): FunnelSession {
  const now = new Date().toISOString();
  return {
    id: 'sess_1', anonymousId: 'anon_1', userId: 'user_1',
    state: 'RITUAL', status: 'active', selectedGroundId: 'anxiety',
    starterGiftId: null, tutorialCompleted: true, firstReleaseId: 'r1',
    verificationId: 'v1', version: 2, createdAt: now, updatedAt: now,
  };
}

// ==========================================================================
// CLOUD CONFIG VALIDATION
// ==========================================================================

test('validateCloudConfig accepts a valid cloudflare_d1 config', () => {
  const result = validateCloudConfig({ kind: 'cloudflare_d1', bindingName: 'DB' });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.config.kind, 'cloudflare_d1');
  }
});

test('validateCloudConfig accepts a valid supabase config', () => {
  const result = validateCloudConfig({
    kind: 'supabase',
    projectUrl: 'https://xyz.supabase.co',
    serviceRoleKey: 'service_key_abc',
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.config.kind, 'supabase');
});

test('validateCloudConfig rejects a non-object', () => {
  const result = validateCloudConfig('not an object');
  assert.equal(result.ok, false);
});

test('validateCloudConfig rejects an unknown kind', () => {
  const result = validateCloudConfig({ kind: 'mysql' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reason.includes('unknown persistence kind'));
});

test('validateCloudConfig rejects cloudflare_d1 with missing bindingName', () => {
  const result = validateCloudConfig({ kind: 'cloudflare_d1' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reason.includes('bindingName'));
});

test('validateCloudConfig rejects supabase with missing serviceRoleKey', () => {
  const result = validateCloudConfig({ kind: 'supabase', projectUrl: 'https://xyz.supabase.co' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reason.includes('serviceRoleKey'));
});

// ==========================================================================
// BACKUP MANIFEST VALIDATION
// ==========================================================================

test('validateBackupManifest accepts a valid manifest', () => {
  const raw = {
    id: 'bk_1',
    environment: 'production',
    tables: ['funnel_sessions', 'usage_ledger'],
    rowCounts: { funnel_sessions: 42, usage_ledger: 100 },
    startedAt: NOW,
    completedAt: null,
    sizeBytes: null,
    checksum: null,
  };
  const result = validateBackupManifest(raw);
  assert.equal(result.ok, true);
});

test('validateBackupManifest rejects a missing id', () => {
  const raw = {
    environment: 'production', tables: [], rowCounts: {}, startedAt: NOW,
  };
  const result = validateBackupManifest(raw);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reason.includes('id'));
});

test('validateBackupManifest rejects a missing tables array', () => {
  const raw = { id: 'bk_1', environment: 'production', rowCounts: {}, startedAt: NOW };
  const result = validateBackupManifest(raw);
  assert.equal(result.ok, false);
});

test('validateBackupManifest rejects a non-object payload', () => {
  const result = validateBackupManifest(null);
  assert.equal(result.ok, false);
});

// ==========================================================================
// DATA RETENTION SCHEDULE
// ==========================================================================

test('buildRetentionSchedule computes correct cutoff for P90D policy', () => {
  const policies: DataRetentionPolicy[] = [
    { table: 'funnel_events', retainFor: 'P90D', deletionMode: 'scheduled', deletionStyle: 'hard' },
  ];
  const schedule = buildRetentionSchedule(policies, NOW);
  assert.equal(schedule.deletionsDue.length, 1);
  const due = schedule.deletionsDue[0]!;
  assert.equal(due.table, 'funnel_events');
  // cutoff should be 90 days before NOW
  const expected = new Date(new Date(NOW).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  assert.equal(due.olderThan, expected);
  assert.equal(due.deletionStyle, 'hard');
});

test('buildRetentionSchedule skips policies with unparseable duration', () => {
  const policies: DataRetentionPolicy[] = [
    { table: 'funnel_events', retainFor: 'P6M', deletionMode: 'scheduled', deletionStyle: 'hard' },
  ];
  const schedule = buildRetentionSchedule(policies, NOW);
  assert.equal(schedule.deletionsDue.length, 0, 'P6M (months) is not supported; skip rather than guess');
});

test('buildRetentionSchedule handles multiple policies independently', () => {
  const policies: DataRetentionPolicy[] = [
    { table: 'funnel_events', retainFor: 'P30D', deletionMode: 'scheduled', deletionStyle: 'hard' },
    { table: 'attachment_challenges', retainFor: 'P7D', deletionMode: 'scheduled', deletionStyle: 'soft' },
  ];
  const schedule = buildRetentionSchedule(policies, NOW);
  assert.equal(schedule.deletionsDue.length, 2);
  assert.equal(schedule.evaluatedAt, NOW);
  const tables = schedule.deletionsDue.map((d) => d.table);
  assert.ok(tables.includes('funnel_events'));
  assert.ok(tables.includes('attachment_challenges'));
});

test('buildRetentionSchedule returns empty deletionsDue when no policies are given', () => {
  const schedule = buildRetentionSchedule([], NOW);
  assert.equal(schedule.deletionsDue.length, 0);
});

// ==========================================================================
// PRACTITIONER ACCESS CHECK
// ==========================================================================

test('checkPractitionerAccess allows a live grant with the requested scope', () => {
  const grant = fakeGrant({ grantedScopes: ['release_history'] });
  const result = checkPractitionerAccess(grant, [], 'release_history', NOW);
  assert.equal(result.allowed, true);
});

test('checkPractitionerAccess denies when the grant is revoked', () => {
  const grant = fakeGrant();
  const result = checkPractitionerAccess(grant, [fakeRevocation()], 'release_history', NOW);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.reason, 'GRANT_REVOKED');
});

test('checkPractitionerAccess denies when the grant is expired', () => {
  const grant = fakeGrant({ expiresAt: PAST });
  const result = checkPractitionerAccess(grant, [], 'release_history', NOW);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.reason, 'GRANT_EXPIRED');
});

test('checkPractitionerAccess denies when the scope is not granted', () => {
  const grant = fakeGrant({ grantedScopes: ['funnel_progress'] });
  const result = checkPractitionerAccess(grant, [], 'release_history', NOW);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.reason, 'SCOPE_NOT_GRANTED');
});

test('checkPractitionerAccess allows a grant with null expiresAt (no calendar expiry)', () => {
  const grant = fakeGrant({ expiresAt: null, grantedScopes: ['funnel_progress'] });
  const result = checkPractitionerAccess(grant, [], 'funnel_progress', NOW);
  assert.equal(result.allowed, true);
});

test('checkPractitionerAccess revocation takes precedence over expiry', () => {
  const grant = fakeGrant({ expiresAt: PAST });
  const rev = fakeRevocation();
  const result = checkPractitionerAccess(grant, [rev], 'release_history', NOW);
  assert.equal(result.allowed, false);
  if (!result.allowed) assert.equal(result.reason, 'GRANT_REVOKED');
});

// ==========================================================================
// PRACTITIONER VIEW BUILDER
// ==========================================================================

test('buildPractitionerView returns null for a revoked grant', () => {
  const grant = fakeGrant();
  const view = buildPractitionerView(grant, [fakeRevocation()], [], [], null, NOW);
  assert.equal(view, null);
});

test('buildPractitionerView returns null for an expired grant', () => {
  const grant = fakeGrant({ expiresAt: PAST });
  const view = buildPractitionerView(grant, [], [], [], null, NOW);
  assert.equal(view, null);
});

test('buildPractitionerView includes releases only when release_history is in scope', () => {
  const grant = fakeGrant({ grantedScopes: ['release_history'] });
  const releases = [fakeRelease('r1')];
  const view = buildPractitionerView(grant, [], releases, [], null, NOW);
  assert.ok(view !== null);
  assert.deepEqual(view!.releases, releases);
  assert.equal(view!.verifications, undefined);
});

test('buildPractitionerView includes verifications only when verification_history is in scope', () => {
  const grant = fakeGrant({ grantedScopes: ['verification_history'] });
  const vers = [fakeVerification('v1', 'r1')];
  const view = buildPractitionerView(grant, [], [], vers, null, NOW);
  assert.ok(view !== null);
  assert.deepEqual(view!.verifications, vers);
  assert.equal(view!.releases, undefined);
});

test('buildPractitionerView includes funnelProgress only when funnel_progress is in scope', () => {
  const grant = fakeGrant({ grantedScopes: ['funnel_progress'] });
  const session = fakeSession();
  const view = buildPractitionerView(grant, [], [], [], session, NOW);
  assert.ok(view !== null);
  assert.ok(view!.funnelProgress !== undefined);
  assert.equal(view!.funnelProgress!.state, session.state);
});

test('buildPractitionerView omits funnelProgress when session is null even if scope is granted', () => {
  const grant = fakeGrant({ grantedScopes: ['funnel_progress'] });
  const view = buildPractitionerView(grant, [], [], [], null, NOW);
  assert.ok(view !== null);
  assert.equal(view!.funnelProgress, undefined);
});

test('buildPractitionerView does not expose raw story text, email, or payment fields', () => {
  const grant = fakeGrant({ grantedScopes: ['release_history', 'verification_history', 'funnel_progress'] });
  const view = buildPractitionerView(grant, [], [fakeRelease('r1')], [fakeVerification('v1', 'r1')], fakeSession(), NOW);
  assert.ok(view !== null);
  // These keys must never appear on a PractitionerView
  const asUnknown = view as unknown as Record<string, unknown>;
  assert.equal(asUnknown['rawStoryText'], undefined);
  assert.equal(asUnknown['email'], undefined);
  assert.equal(asUnknown['paymentDetails'], undefined);
});

test('buildPractitionerView reflects the grantId and practitionerId correctly', () => {
  const grant = fakeGrant({ id: 'grant_xyz', practitionerId: 'prac_42', grantedScopes: ['funnel_progress'] });
  const view = buildPractitionerView(grant, [], [], [], null, NOW);
  assert.ok(view !== null);
  assert.equal(view!.grantId, 'grant_xyz');
  assert.equal(view!.practitionerId, 'prac_42');
});
