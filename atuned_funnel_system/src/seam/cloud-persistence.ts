/* ============================================================
   SEAM: CLOUD PERSISTENCE BOUNDARY (P2)
   Section 10 of the Master Seam Implementation spec.

   WHAT THIS FILE OWNS:
   - CloudPersistenceConfig — discriminated union for D1 vs Supabase
   - BackupManifest / BackupBoundary — structural contract for backup runs
   - DataRetentionSchedule — derived schedule from retention policies
   - validateCloudConfig() — structural validation of a persistence config
   - buildRetentionSchedule() — pure function, policies → due deletions

   WHAT IT DOES NOT OWN:
   - Database credentials: those never live in this layer
   - The actual backup transport: that is infrastructure, not domain logic
   - Retention enforcement: that is a scheduled job concern, not seam logic
   - FunnelRepository implementation: see adapters.ts and sqliteRepository.ts

   BOUNDARY RULE: All persistence adapters read this file's config type
   to know which backend they are talking to. This file never imports
   from adapters.ts, funnelService.ts, or any adapter implementation.
   ============================================================ */

import type { DataRetentionPolicy } from '../domain.js';

// ---------- cloud config discriminated union ----------

export interface D1Config {
  kind: 'cloudflare_d1';
  /** The binding name as declared in wrangler.toml (e.g. "DB"). */
  bindingName: string;
}

export interface SupabaseConfig {
  kind: 'supabase';
  /** Full Supabase project URL, e.g. "https://xyz.supabase.co". */
  projectUrl: string;
  /** Service-role key; never the anon key. */
  serviceRoleKey: string;
}

export type CloudPersistenceConfig = D1Config | SupabaseConfig;

export interface CloudConfigValidationFailure {
  ok: false;
  reason: string;
}

/** Validate that a raw value is a well-formed CloudPersistenceConfig.
 *  Called at adapter construction time, not at every query. */
export function validateCloudConfig(
  raw: unknown,
): { ok: true; config: CloudPersistenceConfig } | CloudConfigValidationFailure {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, reason: 'config is not an object' };
  }
  const c = raw as Record<string, unknown>;
  if (typeof c['kind'] !== 'string') {
    return { ok: false, reason: 'missing kind field' };
  }
  if (c['kind'] === 'cloudflare_d1') {
    if (typeof c['bindingName'] !== 'string' || !c['bindingName']) {
      return { ok: false, reason: 'cloudflare_d1 config missing bindingName' };
    }
    return { ok: true, config: { kind: 'cloudflare_d1', bindingName: c['bindingName'] as string } };
  }
  if (c['kind'] === 'supabase') {
    if (typeof c['projectUrl'] !== 'string' || !c['projectUrl']) {
      return { ok: false, reason: 'supabase config missing projectUrl' };
    }
    if (typeof c['serviceRoleKey'] !== 'string' || !c['serviceRoleKey']) {
      return { ok: false, reason: 'supabase config missing serviceRoleKey' };
    }
    return {
      ok: true,
      config: {
        kind: 'supabase',
        projectUrl: c['projectUrl'] as string,
        serviceRoleKey: c['serviceRoleKey'] as string,
      },
    };
  }
  return { ok: false, reason: `unknown persistence kind: ${c['kind']}` };
}

// ---------- backup manifest ----------

/** Structural record produced at the start of each backup run.
 *  Validated before any data export begins; a failed validation aborts. */
export interface BackupManifest {
  id: string;
  environment: string;
  tables: string[];
  rowCounts: Record<string, number>;
  startedAt: string;
  completedAt: string | null;
  sizeBytes: number | null;
  /** SHA-256 of the exported payload; null until the run completes. */
  checksum: string | null;
}

export interface ManifestValidationFailure {
  ok: false;
  reason: string;
}

/** Validate that a raw value has the shape of a BackupManifest.
 *  Only structural: does not verify the checksum or row counts against
 *  the actual database. */
export function validateBackupManifest(
  raw: unknown,
): { ok: true; manifest: BackupManifest } | ManifestValidationFailure {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, reason: 'manifest is not an object' };
  }
  const m = raw as Record<string, unknown>;
  if (typeof m['id'] !== 'string' || !m['id']) {
    return { ok: false, reason: 'manifest missing id' };
  }
  if (typeof m['environment'] !== 'string' || !m['environment']) {
    return { ok: false, reason: 'manifest missing environment' };
  }
  if (!Array.isArray(m['tables'])) {
    return { ok: false, reason: 'manifest missing tables array' };
  }
  if (typeof m['startedAt'] !== 'string' || !m['startedAt']) {
    return { ok: false, reason: 'manifest missing startedAt' };
  }
  if (!m['rowCounts'] || typeof m['rowCounts'] !== 'object' || Array.isArray(m['rowCounts'])) {
    return { ok: false, reason: 'manifest missing rowCounts object' };
  }
  return {
    ok: true,
    manifest: {
      id: m['id'] as string,
      environment: m['environment'] as string,
      tables: m['tables'] as string[],
      rowCounts: m['rowCounts'] as Record<string, number>,
      startedAt: m['startedAt'] as string,
      completedAt: typeof m['completedAt'] === 'string' ? m['completedAt'] : null,
      sizeBytes: typeof m['sizeBytes'] === 'number' ? m['sizeBytes'] : null,
      checksum: typeof m['checksum'] === 'string' ? m['checksum'] : null,
    },
  };
}

// ---------- data retention schedule ----------

/** A deletion that is due given a policy and a reference timestamp. */
export interface RetentionDeletionDue {
  table: string;
  /** Delete rows with timestamps older than this ISO string. */
  olderThan: string;
  deletionStyle: 'hard' | 'soft';
}

/** Derived schedule from evaluating a set of policies at a point in time. */
export interface DataRetentionSchedule {
  policies: DataRetentionPolicy[];
  evaluatedAt: string;
  deletionsDue: RetentionDeletionDue[];
}

/** Parse a simple ISO 8601 duration of the form "PnD" (days only).
 *  Returns the number of milliseconds, or null for unrecognised patterns. */
function parseDurationMs(duration: string): number | null {
  const match = /^P(\d+)D$/.exec(duration);
  if (!match || !match[1]) return null;
  return parseInt(match[1], 10) * 24 * 60 * 60 * 1000;
}

/** Pure function: given policies and a reference ISO timestamp, produce the
 *  set of deletions that should run now. A policy whose duration cannot be
 *  parsed is skipped (unknown format = do not accidentally delete). */
export function buildRetentionSchedule(
  policies: DataRetentionPolicy[],
  nowIso: string,
): DataRetentionSchedule {
  const nowMs = new Date(nowIso).getTime();
  const deletionsDue: RetentionDeletionDue[] = [];

  for (const policy of policies) {
    const durationMs = parseDurationMs(policy.retainFor);
    if (durationMs === null) continue;
    const cutoffMs = nowMs - durationMs;
    deletionsDue.push({
      table: policy.table,
      olderThan: new Date(cutoffMs).toISOString(),
      deletionStyle: policy.deletionStyle,
    });
  }

  return { policies, evaluatedAt: nowIso, deletionsDue };
}
