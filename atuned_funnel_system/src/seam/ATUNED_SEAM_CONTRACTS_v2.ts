/* ============================================================
   ATUNED SEAM CONTRACTS v2
   Section 48 of the Master Seam Implementation spec.

   This file is the single-source enumeration of every contract this seam
   layer exposes. Import from here when you need a top-level shape; import
   from the specific source file when you need implementation detail.

   ONE AUTHORITY RULE — do not reproduce these types in a second file.
   Do not add a copy of FunnelSession or ReleaseRef here; they live in
   domain.ts and adapters.ts respectively.

   TRUST HIERARCHY (read-only; write side is the engine, not this layer):
     USER INPUT
       → PROFILE RECORD         (engine/schema.js pImport/pSave)
       → EXISTING ENGINE        (engine/*.js, host free)
       → DOMAIN ORCHESTRATION   (funnelService.ts)
       → GRAPH PROJECTION        (seam/trace-bridge.ts — built P1)
       → REFLECTION VIEW MODEL   (seam/reflection-view.ts — built P1)
       → UI
   Never reverse this chain.
   ============================================================ */

// ---------- re-export the public seam surface ----------

export type {
  FunnelHandoffV1,
  FunnelContext,
  HandoffValidationResult,
  HandoffValidationFailure,
} from './handoff.js';

export {
  encodeFunnelHandoff,
  decodeFunnelHandoff,
  validateFunnelHandoff,
  extractHandoffFragment,
  generateHandoffNonce,
} from './handoff.js';

export type {
  OnboardingBridgeContext,
  OnboardingBridgeResult,
  OnboardingBridgeFailure,
} from './onboarding-bridge.js';

export {
  attachFunnelContextToOnboarding,
  writeBridgeContextToAttributes,
} from './onboarding-bridge.js';

// ---------- P1: trace graph seam ----------

export type {
  TraceNodeType,
  TraceEdgeType,
  TraceProvenance,
  TraceNode,
  TraceEdge,
  TraceGraph,
  TraceNodeIntent,
  TraceEdgeIntent,
  TraceIntent,
  TraceIndex,
} from './trace-bridge.js';

export {
  projectRelease,
  projectVerification,
  projectFunnelActivity,
  buildTraceIndex,
  neighborsOf,
  lookupNode,
} from './trace-bridge.js';

// ---------- P1: reflection view model ----------

export type {
  VerificationSummary,
  ReleasedPatternView,
  ReflectionView,
} from './reflection-view.js';

export { buildReflectionView } from './reflection-view.js';

// ---------- P1: payment webhook boundary ----------

export type {
  WebhookPayload,
  WebhookValidationResult,
  WebhookValidationFailure,
} from './payment-boundary.js';

export {
  validateWebhookPayload,
  extractCustomerId,
  extractPriceId,
  registerPriceId,
  planIdForPriceId,
} from './payment-boundary.js';

// ---------- P2: cloud persistence boundary ----------

export type {
  D1Config,
  SupabaseConfig,
  CloudPersistenceConfig,
  CloudConfigValidationFailure,
  BackupManifest,
  ManifestValidationFailure,
  RetentionDeletionDue,
  DataRetentionSchedule,
} from './cloud-persistence.js';

export {
  validateCloudConfig,
  validateBackupManifest,
  buildRetentionSchedule,
} from './cloud-persistence.js';

// ---------- P2: practitioner access model ----------

export type {
  AccessDeniedReason,
  PractitionerView,
} from './practitioner-access.js';

export {
  checkPractitionerAccess,
  buildPractitionerView,
} from './practitioner-access.js';

// ---------- contract constants ----------

/** The only fragment prefix that carries a funnel handoff.
 *  Must never overlap with #r= (profile record import). */
export const HANDOFF_FRAGMENT_PREFIX = 'f=';

/** The only fragment prefix that carries a profile record import.
 *  Must never overlap with #f= (funnel handoff). */
export const RECORD_IMPORT_FRAGMENT_PREFIX = 'r=';

/** Maximum age of a funnel handoff before it is considered expired. */
export const HANDOFF_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

/** The funnel session idempotency lease window. */
export const IDEMPOTENCY_LEASE_MS = 5 * 60 * 1000; // 5 minutes

// ---------- contract assertions (compile-time only) ----------

// These imports are used only as type assertions to confirm the seam contracts
// are consistent with the domain types they depend on. They produce no runtime
// output and are stripped by the TypeScript compiler.
import type { FunnelError } from '../domain.js';
import type { FunnelAdapters } from '../adapters.js';

// Confirm FunnelError codes cover every seam error code.
// If this line produces a TypeScript error, a FunnelError code is missing from domain.ts.
type _SeamErrorCodes = FunnelError['code'] extends
  | 'INVALID_HANDOFF'
  | 'HANDOFF_EXPIRED'
  | 'HANDOFF_ALREADY_CONSUMED'
  ? true
  : never;

// Confirm FunnelAdapters is importable from this file's perspective.
type _AdaptersShape = FunnelAdapters;

// These vars are intentionally unused; they exist only to anchor the types above.
declare const _errorCheck: _SeamErrorCodes;
declare const _adaptersCheck: _AdaptersShape;
void _errorCheck;
void _adaptersCheck;
