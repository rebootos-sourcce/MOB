/* ============================================================
   SEAM: PRACTITIONER ACCESS MODEL (P2)
   Section 11 of the Master Seam Implementation spec.

   WHAT THIS FILE OWNS:
   - checkPractitionerAccess() — pure predicate; explicit consent required
   - buildPractitionerView() — derives a scoped read-only view for one grant
   - PractitionerView — the shape the UI receives (never raw stories/payment)

   WHAT IT DOES NOT OWN:
   - Grant creation: that is a service layer concern (explicit consent flow)
   - Revocation enforcement at the HTTP boundary: the adapter must check
     this layer's result and raise FunnelError('GRANT_REVOKED') on denial
   - The actual story text: raw story content is excluded by design; the
     scope 'story_summaries' allows derived summaries only

   SECURITY RULE from CLAUDE.md:
   "A practitioner seeing somatic and psychological self report is a
    consequential grant. It needs explicit consent, a visible list of who
    has sight, and revocation. Never a silent default."

   Raw stories, email address, and payment details are NEVER in scope.
   ============================================================ */

import type {
  PractitionerGrant,
  PractitionerGrantRevocation,
  PractitionerScope,
  ReleaseRef,
  VerificationRef,
  FunnelSession,
} from '../domain.js';

// ---------- access check ----------

export type AccessDeniedReason =
  | 'GRANT_REVOKED'
  | 'GRANT_EXPIRED'
  | 'SCOPE_NOT_GRANTED';

/** Pure function: returns whether a practitioner may access a given scope
 *  right now. The grant must not be revoked and must not be expired.
 *  The requested scope must be explicitly listed in grantedScopes.
 *  Never a default allow — all three conditions must pass. */
export function checkPractitionerAccess(
  grant: PractitionerGrant,
  revocations: PractitionerGrantRevocation[],
  requestedScope: PractitionerScope,
  nowIso: string,
): { allowed: true } | { allowed: false; reason: AccessDeniedReason } {
  // revocation check: any revocation row for this grant denies access
  const isRevoked = revocations.some((r) => r.grantId === grant.id);
  if (isRevoked) return { allowed: false, reason: 'GRANT_REVOKED' };

  // expiry check: if expiresAt is set and has passed, deny
  if (grant.expiresAt !== null && nowIso >= grant.expiresAt) {
    return { allowed: false, reason: 'GRANT_EXPIRED' };
  }

  // scope check: the requested scope must be explicitly listed
  if (!grant.grantedScopes.includes(requestedScope)) {
    return { allowed: false, reason: 'SCOPE_NOT_GRANTED' };
  }

  return { allowed: true };
}

// ---------- practitioner view ----------

/** The read-only view a practitioner receives. Fields are present only when
 *  the corresponding scope is granted and the grant is live. Raw story text,
 *  email, and payment data are structurally absent from this type. */
export interface PractitionerView {
  subjectUserId: string;
  practitionerId: string;
  grantId: string;
  grantedScopes: PractitionerScope[];
  /** Present only when 'release_history' is in scope. */
  releases?: ReleaseRef[];
  /** Present only when 'verification_history' is in scope. */
  verifications?: VerificationRef[];
  /** Present only when 'funnel_progress' is in scope. */
  funnelProgress?: Pick<FunnelSession, 'state' | 'status' | 'tutorialCompleted' | 'updatedAt'>;
}

/** Build the scoped view for one live grant. Returns null when the grant is
 *  revoked or expired: callers must treat null as a hard access denial. */
export function buildPractitionerView(
  grant: PractitionerGrant,
  revocations: PractitionerGrantRevocation[],
  releases: ReleaseRef[],
  verifications: VerificationRef[],
  session: FunnelSession | null,
  nowIso: string,
): PractitionerView | null {
  // gate the whole view on a live grant — any single denial collapses the view
  const baseCheck = checkPractitionerAccess(grant, revocations, grant.grantedScopes[0] ?? 'funnel_progress', nowIso);
  // re-check using the full revocation + expiry path (scope field is irrelevant here)
  const isRevoked = revocations.some((r) => r.grantId === grant.id);
  const isExpired = grant.expiresAt !== null && nowIso >= grant.expiresAt;
  if (isRevoked || isExpired) return null;
  void baseCheck; // used implicitly above

  const view: PractitionerView = {
    subjectUserId: grant.subjectUserId,
    practitionerId: grant.practitionerId,
    grantId: grant.id,
    grantedScopes: grant.grantedScopes,
  };

  if (grant.grantedScopes.includes('release_history')) {
    view.releases = releases;
  }
  if (grant.grantedScopes.includes('verification_history')) {
    view.verifications = verifications;
  }
  if (grant.grantedScopes.includes('funnel_progress') && session !== null) {
    view.funnelProgress = {
      state: session.state,
      status: session.status,
      tutorialCompleted: session.tutorialCompleted,
      updatedAt: session.updatedAt,
    };
  }

  return view;
}
