/* ============================================================
   SEAM: REFLECTION VIEW MODEL (P1)
   Section 7 of the Master Seam Implementation spec.

   WHAT THIS FILE OWNS:
   - ReflectionView — a derived, read-only snapshot of what a
     funnel session reveals about a person's current work
   - buildReflectionView() — a pure function: no network, no
     storage reads, no side effects. Given the session's domain
     objects it produces the view.

   WHAT IT DOES NOT OWN:
   - Any write to storage (session, graph, gift)
   - The graph itself (that stays in engine/trace.js)
   - Entitlement, tier, or pricing logic

   TRUST HIERARCHY POSITION:
   ... → GRAPH PROJECTION → REFLECTION VIEW MODEL (this file) → UI
   This is the last read-only layer before the UI. Never reverse
   the chain: the UI reads this model, nothing here reads the UI.
   ============================================================ */

import type { FunnelSession, ReleaseRef, VerificationRef, VerificationStatus } from '../domain.js';

// ---------- the view model ----------

/** A count of verifications by outcome bucket. */
export interface VerificationSummary {
  total: number;
  /** Verifications where the person reported a felt shift
   *  (feel_different, see_differently, something_moved). */
  shiftObserved: number;
  /** Verifications where nothing changed or the person was unsure. */
  unchanged: number;
}

/** A lightweight view of one released pattern. */
export interface ReleasedPatternView {
  patternId: string;
  releaseId: string;
  /** Address IDs the engine worked — passed through from ReleaseRef
   *  so the UI can render body locations without re-parsing. */
  addressIds: number[];
  verificationStatus: VerificationStatus | null;
}

/** The derived, read-only reflection view for one funnel session.
 *
 *  Every field is computable from the session's own domain objects.
 *  The view is a snapshot: it becomes stale as soon as the session
 *  advances. Callers should recompute it rather than cache it. */
export interface ReflectionView {
  sessionId: string;
  selectedGroundId: string | null;
  /** Total releases completed in this session. */
  releaseCount: number;
  /** Unique pattern IDs the session has released. */
  releasedPatternIds: string[];
  /** Full detail per released pattern, including verification outcome. */
  patterns: ReleasedPatternView[];
  verification: VerificationSummary;
  /** True once at least one release has been completed AND verified. */
  hasCompletedWork: boolean;
  /** True once every release in this session has been verified. */
  allReleasesVerified: boolean;
}

// ---------- pure builder ----------

const SHIFT_STATUSES = new Set<VerificationStatus>([
  'feel_different',
  'see_differently',
  'something_moved',
]);

/** Build the reflection view from a session's domain objects.
 *
 *  Pure function. Safe to call at any point in the session lifecycle.
 *  Returns an empty view (releaseCount = 0) when `releases` is empty. */
export function buildReflectionView(
  session: FunnelSession,
  releases: ReleaseRef[],
  verifications: VerificationRef[],
): ReflectionView {
  const verByRelease = new Map<string, VerificationRef>(verifications.map((v) => [v.releaseId, v]));

  const patterns: ReleasedPatternView[] = releases.map((rel) => {
    const ver = verByRelease.get(rel.id) ?? null;
    return {
      patternId: rel.patternId,
      releaseId: rel.id,
      addressIds: rel.addressIds,
      verificationStatus: ver?.status ?? null,
    };
  });

  const releasedPatternIds = [...new Set(releases.map((r) => r.patternId))];

  let shiftObserved = 0;
  let unchanged = 0;
  for (const ver of verifications) {
    if (SHIFT_STATUSES.has(ver.status)) shiftObserved++;
    else unchanged++;
  }

  const verSummary: VerificationSummary = {
    total: verifications.length,
    shiftObserved,
    unchanged,
  };

  const hasCompletedWork = releases.length > 0 && verifications.length > 0;
  const allReleasesVerified = releases.length > 0 && releases.every((r) => verByRelease.has(r.id));

  return {
    sessionId: session.id,
    selectedGroundId: session.selectedGroundId,
    releaseCount: releases.length,
    releasedPatternIds,
    patterns,
    verification: verSummary,
    hasCompletedWork,
    allReleasesVerified,
  };
}
