/* ============================================================
   SEAM: PAYMENT WEBHOOK BOUNDARY (P1)
   Section 8 of the Master Seam Implementation spec.

   WHAT THIS FILE OWNS:
   - WebhookPayload / WebhookValidationResult / WebhookValidationFailure
   - validateWebhookPayload() — structural validation that runs before
     the payload reaches the service layer; the signature verification
     happens at the HTTP boundary, never inside this layer
   - normalizeWebhookEvent() — maps the raw Stripe event to the typed
     shape the service layer's resolveWebhookEvent() already expects

   WHAT IT DOES NOT OWN:
   - Stripe signature verification: that is an HTTP middleware concern
     and lives outside the service layer (never inside adapters.ts)
   - Entitlement grant: that is funnelService.processPaymentWebhook()
   - Plan pricing or tier rules: those live in funnelConfig.ts

   BOUNDARY RULE: The PaymentAdapter in adapters.ts is the server
   boundary. resolveWebhookEvent() is called AFTER signature verification
   has already happened. This file validates structure, not authenticity.
   ============================================================ */

import type { PlanId } from '../domain.js';

// ---------- wire shapes coming over the network ----------

/** The minimal structural shape we require from a Stripe webhook payload.
 *  Fields beyond these are ignored: this is not a full Stripe type. */
export interface WebhookPayload {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  livemode: boolean;
}

/** Resolved result: the userId and planId the service layer needs. */
export interface WebhookValidationResult {
  ok: true;
  eventId: string;
  userId: string;
  planId: PlanId;
  livemode: boolean;
}

export interface WebhookValidationFailure {
  ok: false;
  code: 'PAYMENT_EVENT_INVALID';
  reason: string;
}

// ---------- known plan → PlanId mapping ----------

/** Stripe price IDs → our own PlanId. A price ID that is not in this map
 *  is either a test artifact or an unknown product; both are refused.
 *  The real price IDs come from STRIPE-API-STEPS.md and are injected at
 *  runtime (see RealPaymentAdapter in realAdapters.ts). This map is the
 *  default shape for documentation; a real deploy overrides it. */
const KNOWN_PRICE_IDS: Record<string, PlanId> = {};

/** Register a price ID → planId mapping at deploy time. Called once
 *  during adapter construction in RealPaymentAdapter. */
export function registerPriceId(stripePriceId: string, planId: PlanId): void {
  KNOWN_PRICE_IDS[stripePriceId] = planId;
}

/** Look up a planId from a Stripe price ID. Returns null if unknown. */
export function planIdForPriceId(stripePriceId: string): PlanId | null {
  return KNOWN_PRICE_IDS[stripePriceId] ?? null;
}

// ---------- supported event types ----------

/** Event types this boundary knows how to parse. Others are refused. */
const SUPPORTED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

// ---------- structural validation ----------

/** Validate that a raw parsed body has the minimal structure the service
 *  layer needs. Called at the HTTP boundary after signature verification.
 *
 *  Returns the strongly-typed payload on success, or a typed failure
 *  with a plain-English reason on any structural problem. */
export function validateWebhookPayload(raw: unknown): { ok: true; payload: WebhookPayload } | WebhookValidationFailure {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: 'payload is not an object' };
  }
  const p = raw as Record<string, unknown>;

  if (typeof p['id'] !== 'string' || !p['id']) {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: 'missing or empty event id' };
  }
  if (typeof p['type'] !== 'string' || !p['type']) {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: 'missing or empty event type' };
  }
  if (!SUPPORTED_EVENTS.has(p['type'] as string)) {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: `unsupported event type: ${p['type']}` };
  }
  if (!p['data'] || typeof p['data'] !== 'object') {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: 'missing data envelope' };
  }
  const data = p['data'] as Record<string, unknown>;
  if (!data['object'] || typeof data['object'] !== 'object' || Array.isArray(data['object'])) {
    return { ok: false, code: 'PAYMENT_EVENT_INVALID', reason: 'missing data.object' };
  }

  return {
    ok: true,
    payload: {
      id: p['id'] as string,
      type: p['type'] as string,
      data: { object: data['object'] as Record<string, unknown> },
      livemode: typeof p['livemode'] === 'boolean' ? p['livemode'] : false,
    },
  };
}

/** Extract the Stripe customer ID from a validated webhook object.
 *  Handles both session and subscription object shapes. */
export function extractCustomerId(object: Record<string, unknown>): string | null {
  if (typeof object['customer'] === 'string') return object['customer'];
  return null;
}

/** Extract the Stripe subscription price ID from an invoice or subscription. */
export function extractPriceId(object: Record<string, unknown>): string | null {
  // subscription object: items.data[0].price.id
  const items = object['items'] as Record<string, unknown> | undefined;
  if (items) {
    const data = items['data'] as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(data) && data.length > 0) {
      const row = data[0];
      if (row != null) {
        const price = row['price'] as Record<string, unknown> | undefined;
        if (price && typeof price['id'] === 'string') return price['id'];
      }
    }
  }
  // checkout.session: after_expiration or line items — fall through to metadata
  const meta = object['metadata'] as Record<string, unknown> | undefined;
  if (meta && typeof meta['price_id'] === 'string') return meta['price_id'];
  return null;
}
