/* ============================================================
   SEAM: FUNNEL HANDOFF  (#f= fragment, separate from #r= record import)
   Section 5 + 15 of the Master Seam Implementation spec.

   The existing #r= fragment carries a profile record for direct import.
   This seam adds #f= for funnel session context. They must never merge:
   a profile record and a funnel context handoff are different things with
   different validation requirements and different trust models.

   WHAT THIS FILE OWNS:
   - encodeFunnelHandoff()  (site → browser URL fragment)
   - decodeFunnelHandoff()  (app boot → parse fragment)
   - validateFunnelHandoff() (parse → FunnelContext, reject secrets)

   WHAT IT DOES NOT OWN:
   - Profile record import (#r=) — that is pImport() in engine/schema.js
   - Entitlement authority — the server owns that
   - Any bearer token, email, or full profile
   ============================================================ */

import { createHash } from 'node:crypto';
import type { FunnelError } from '../domain.js';

/** The versioned envelope carried in the #f= URL fragment.
 *  All fields are strings except `version` (number).
 *  Must never carry secrets: no password, token, email, raw story,
 *  or full profile. Section 15 of the Receiving AI Handshake spec. */
export interface FunnelHandoffV1 {
  version: 1;
  funnelSessionId: string;
  selectedGroundId: string;
  intent: string;
  starterGiftId: string;
  createdAt: string;
  expiresAt: string;
  nonce: string;
}

/** Result of a successful handoff parse. */
export interface FunnelContext {
  funnelSessionId: string;
  selectedGroundId: string;
  intent: string;
  starterGiftId: string;
  createdAt: string;
  expiresAt: string;
  nonce: string;
}

export interface HandoffValidationResult {
  ok: true;
  context: FunnelContext;
}

export interface HandoffValidationFailure {
  ok: false;
  code: 'INVALID_HANDOFF' | 'HANDOFF_EXPIRED' | 'HANDOFF_ALREADY_CONSUMED';
  reason: string;
}

/** Fields that must never appear in the handoff. If present, reject. */
const FORBIDDEN_FIELDS = new Set([
  'password', 'bearer', 'token', 'email', 'rawStory', 'story', 'medical',
  'fullProfile', 'profile', 'entitlement', 'payment', 'secret', 'key',
]);

const MAX_FIELD_LEN = 512;
const NONCE_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

/** Encode a handoff object as a base64url JSON string for the #f= fragment. */
export function encodeFunnelHandoff(payload: FunnelHandoffV1): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf8').toString('base64url');
}

/** Parse the raw base64url value from the #f= fragment. Returns the
 *  validated context or a typed failure. The app must treat every
 *  field as untrusted input regardless of the parse result. */
export function decodeFunnelHandoff(
  raw: string,
  nowIso: string,
): HandoffValidationResult | HandoffValidationFailure {
  let parsed: unknown;
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, code: 'INVALID_HANDOFF', reason: 'base64url/json decode failed' };
  }
  return validateFunnelHandoff(parsed, nowIso);
}

/** Validate an already-decoded object. Exported for testing. */
export function validateFunnelHandoff(
  raw: unknown,
  nowIso: string,
): HandoffValidationResult | HandoffValidationFailure {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, code: 'INVALID_HANDOFF', reason: 'payload is not an object' };
  }
  const p = raw as Record<string, unknown>;

  // Version check
  if (p['version'] !== 1) {
    return { ok: false, code: 'INVALID_HANDOFF', reason: `unsupported handoff version: ${p['version']}` };
  }

  // Forbidden field check: reject any handoff that claims to carry secrets
  for (const key of Object.keys(p)) {
    if (FORBIDDEN_FIELDS.has(key.toLowerCase())) {
      return { ok: false, code: 'INVALID_HANDOFF', reason: `forbidden field in handoff: ${key}` };
    }
  }

  // Required string fields
  const requiredStrings = [
    'funnelSessionId', 'selectedGroundId', 'intent',
    'starterGiftId', 'createdAt', 'expiresAt', 'nonce',
  ] as const;
  for (const field of requiredStrings) {
    const v = p[field];
    if (typeof v !== 'string' || !v.trim()) {
      return { ok: false, code: 'INVALID_HANDOFF', reason: `missing or empty field: ${field}` };
    }
    if (v.length > MAX_FIELD_LEN) {
      return { ok: false, code: 'INVALID_HANDOFF', reason: `field too long: ${field}` };
    }
  }

  // Nonce format
  if (!NONCE_PATTERN.test(p['nonce'] as string)) {
    return { ok: false, code: 'INVALID_HANDOFF', reason: 'nonce format invalid' };
  }

  // Timestamp validation
  const expiresAt = p['expiresAt'] as string;
  const createdAt = p['createdAt'] as string;
  if (isNaN(Date.parse(expiresAt)) || isNaN(Date.parse(createdAt))) {
    return { ok: false, code: 'INVALID_HANDOFF', reason: 'createdAt or expiresAt is not a valid ISO timestamp' };
  }

  // Expiry check
  if (new Date(expiresAt) <= new Date(nowIso)) {
    return { ok: false, code: 'HANDOFF_EXPIRED', reason: `handoff expired at ${expiresAt}` };
  }

  return {
    ok: true,
    context: {
      funnelSessionId: p['funnelSessionId'] as string,
      selectedGroundId: p['selectedGroundId'] as string,
      intent: p['intent'] as string,
      starterGiftId: p['starterGiftId'] as string,
      createdAt,
      expiresAt,
      nonce: p['nonce'] as string,
    },
  };
}

/** Read the #f= fragment from a URL hash string. Returns null when absent. */
export function extractHandoffFragment(hashString: string): string | null {
  const match = hashString.match(/(?:^|[&#])f=([^&#]*)/);
  return match && match[1] != null ? decodeURIComponent(match[1]) : null;
}

/** Generate a nonce for a new handoff. Not cryptographic in strength for
 *  the handoff itself (the handoff carries no secrets); use as a replay
 *  differentiator only. */
export function generateHandoffNonce(): string {
  return createHash('sha256')
    .update(`${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 32);
}
