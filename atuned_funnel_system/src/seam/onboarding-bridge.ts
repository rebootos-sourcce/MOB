/* ============================================================
   SEAM: ONBOARDING BRIDGE  (Section 6 of the Master Seam Implementation spec)

   WHAT THIS FILE OWNS:
   - attachFunnelContextToOnboarding(): control metadata only, never a second
     story store. The real story store is the engine's own, and this seam must
     never duplicate it.

   WHAT IT DOES NOT OWN:
   - The story itself — that belongs to the engine (parseStory / stCommit).
   - The profile record — that belongs to the engine (pImport / pSave).
   - The release execution — that belongs to ReleaseAdapter.

   ONE AUTHORITY rule: the onboarding UI already owns a story input surface.
   This seam hands that surface a funnel session id and a starter gift id so
   it knows which session it is operating inside. It hands nothing else.
   Section 6 of the Master Seam spec: "attach funnel context to onboarding:
   control metadata only; the story store is the engine's own".
   ============================================================ */

import type { FunnelContext } from './handoff.js';

/** The minimal metadata the onboarding UI needs to bind a funnel session.
 *  Presentation and control only — no story text, no email, no full profile. */
export interface OnboardingBridgeContext {
  funnelSessionId: string;
  starterGiftId: string;
  selectedGroundId: string;
  intent: string;
}

export interface OnboardingBridgeResult {
  ok: true;
  bridgeContext: OnboardingBridgeContext;
}

export interface OnboardingBridgeFailure {
  ok: false;
  reason: string;
}

/** Extract the onboarding bridge context from a validated funnel handoff.
 *
 *  Accepts a FunnelContext (already validated by validateFunnelHandoff) and
 *  returns the minimal slice the onboarding UI needs. Does not store, modify,
 *  or re-derive any field: the data flows one way, funnel session → onboarding
 *  control layer, and stops there.
 *
 *  The caller is responsible for ensuring `context` came from a validated
 *  handoff (validateFunnelHandoff returned ok:true) before passing it here. */
export function attachFunnelContextToOnboarding(
  context: FunnelContext,
): OnboardingBridgeResult | OnboardingBridgeFailure {
  if (!context.funnelSessionId || !context.starterGiftId) {
    return {
      ok: false,
      reason: 'funnelSessionId and starterGiftId are both required for onboarding bridge',
    };
  }
  return {
    ok: true,
    bridgeContext: {
      funnelSessionId: context.funnelSessionId,
      starterGiftId: context.starterGiftId,
      selectedGroundId: context.selectedGroundId,
      intent: context.intent,
    },
  };
}

/** Attach a bridge context to an existing DOM element or JavaScript object
 *  by setting data attributes. Keeps the seam to pure strings and avoids
 *  any dependency on a specific onboarding framework.
 *
 *  Callers that do not use DOM attributes can extract `bridgeContext`
 *  directly and pass it however their onboarding layer expects. */
export function writeBridgeContextToAttributes(
  bridgeContext: OnboardingBridgeContext,
): Record<string, string> {
  return {
    'data-funnel-session-id': bridgeContext.funnelSessionId,
    'data-starter-gift-id': bridgeContext.starterGiftId,
    'data-selected-ground-id': bridgeContext.selectedGroundId,
    'data-intent': bridgeContext.intent,
  };
}
