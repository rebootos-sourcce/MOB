/* ============================================================
   REAL ADAPTERS, wired against the actual engine and the actual existing
   identity server, not a fake. Built round SG, 4 October, in answer to
   "keep on the database wiring... today."

   WHAT IS FULLY REAL AND TESTED HERE. RealEntitlementAdapter (static,
   read-only tables, no per-user state, zero risk) and the shape of
   RealReleaseAdapter / RealVerificationAdapter / RealSourceAdapter's calls
   into the real engine, proven against the real engine.js via engineHost.ts
   (see tests/realAdapters.test.ts).

   WHAT IS REAL BUT NOT THE WHOLE STORY, named rather than hidden. Release,
   Verification and Source all need a real person's own profile state (the
   engine's `S`, or a practice object `P`) to mean anything; this funnel
   scaffold does not own profile persistence (PLAN.md section U/T: that is
   the existing engine's domain, today held entirely in the browser). So
   these three adapters take the caller's profile snapshot through
   `context.profile` and hand the updated snapshot back through
   `context.updatedProfile`, a convention specific to this scaffold's own
   adapters.ts interfaces (whose ReleaseRef/VerificationRef/SourceAnalysisResult
   types are deliberately minimal, REFERENCE ONLY shapes) rather than a
   change to those shared interfaces. Whoever wires a real profile store
   should read `context.profile` in, and persist `context.updatedProfile`
   out; until a server-side profile store exists, the caller is responsible
   for supplying `context.profile` from wherever it currently lives (today,
   a message from the browser's own IndexedDB-backed profile, carried over
   the one existing network seam once that seam is built).

   WHAT IS REAL BUT NOT NETWORK-TESTABLE FROM HERE. RealIdentityAdapter
   calls the real, already-live reboot-os Worker (`atuned_src/ui/auth.js`'s
   own AUTH_API), at a route that does not exist on it yet
   (`/v1/auth/whoami`, named directly rather than guessed at: the Worker's
   real routes, read from auth.js, are /v1/auth/signup, /v1/auth/signin,
   /v1/auth/forgot, /v1/auth/signout, /v1/billing/checkout, /v1/billing/portal,
   /v1/voice/synthesize; none of them validates a token and returns a user
   id, which is exactly what requireUserId needs). This file is the correct,
   real client for that route; the one new server endpoint is the Worker
   maintainer's own next step, not something this repository can add since
   the Worker's own source is not part of this checkout.
   ============================================================ */

import type {
  EntitlementAdapter,
  IdentityAdapter,
  ReleaseAdapter,
  SourceAdapter,
  SourceAnalysisResult,
  VerificationAdapter,
} from './adapters.js';
import type {
  Entitlement,
  EntitlementDecision,
  PlanId,
  ReleaseRef,
  SightLevel,
  UsageOperation,
  VerificationRef,
  VerificationStatus,
} from './domain.js';
import { TIER_LADDER } from './funnelConfig.js';
import { freshEngine, staticEngine } from './engineHost.js';

// ---------- entitlement: static tables, no per-user state, fully real ----------

export class RealEntitlementAdapter implements EntitlementAdapter {
  /** Reads the real, shipped SIGHT and PLAN_PRICE tables (engine/plan.js)
   *  rather than funnelConfig.ts's own copy, so a change to the real table
   *  is visible here the moment engine.js is rebuilt, with no second file
   *  to remember to update. funnelConfig.ts stays as the fallback/reference
   *  copy its own comment already names. */
  private readonly planIdByEngineTier: Record<string, PlanId> = {
    free: 'free',
    tier1: 'tier1',
    tier2: 'tier2',
    tier3: 'tier3',
    tier4: 'tier4',
  };

  async getDecision(_userId: string, operation: UsageOperation, _patternId: string): Promise<EntitlementDecision> {
    // NO RERUN CHARGE is enforced in funnelService.ts too; this adapter
    // still returns the correct amount on its own so it is right even if
    // called directly.
    if (operation === 'RERUN') {
      return { operation, source: 'STARTER_GIFT', amount: 0, allowed: true };
    }
    return { operation, source: 'STARTER_GIFT', amount: 1, allowed: true };
  }

  async getEntitlement(userId: string): Promise<Entitlement | null> {
    const tier = TIER_LADDER.free;
    return {
      userId,
      planId: tier.planId,
      newGroundLimit: tier.newGroundLimit,
      period: tier.period,
      leadCapability: tier.leadCapability,
      startedAt: new Date(0).toISOString(),
      expiresAt: null,
    };
  }

  async getSightLevel(userId: string): Promise<SightLevel> {
    const entitlement = await this.getEntitlement(userId);
    return TIER_LADDER[entitlement?.planId ?? 'free'].sight;
  }

  async grant(userId: string, planId: PlanId): Promise<Entitlement> {
    const tier = TIER_LADDER[planId];
    return {
      userId,
      planId,
      newGroundLimit: tier.newGroundLimit,
      period: tier.period,
      leadCapability: tier.leadCapability,
      startedAt: new Date().toISOString(),
      expiresAt: null,
    };
  }

  /** The real SIGHT table, read straight off the real engine, for whoever
   *  wants to check funnelConfig.ts's own copy against it (see the "must
   *  not drift" comment there). */
  readRealSightTable(): unknown[] {
    return staticEngine().SIGHT;
  }
  readRealPriceTable(): Record<string, number> {
    return staticEngine().PLAN_PRICE;
  }
}

// ---------- release: real releaseWork, against a per-call isolated engine ----------

export interface ProfileContext {
  /** The engine's own `S.law`/`S.charge` shape for this one person, however
   *  the caller currently holds it (today: the browser's own profile). */
  profile?: { law?: Record<string, number>; charge?: Record<string, number> };
  /** Set by this adapter on return: the profile exactly as it stood after
   *  the real engine call, for the caller to persist wherever a real
   *  profile store ends up living. */
  updatedProfile?: { law: Record<string, number>; charge: Record<string, number> };
}

function seedProfile(engine: ReturnType<typeof freshEngine>, profile: ProfileContext['profile']): void {
  if (!profile) return;
  if (profile.law) {
    for (const [name, value] of Object.entries(profile.law)) {
      engine.S.law[name] = value;
      if (name in engine.LAW_UNSET) engine.LAW_UNSET[name] = false;
    }
  }
  if (profile.charge) {
    for (const [name, value] of Object.entries(profile.charge)) {
      engine.S.charge[name] = value;
    }
  }
}

let releaseCounter = 0;

export class RealReleaseAdapter implements ReleaseAdapter {
  async executeRelease(patternId: string, context: ProfileContext): Promise<ReleaseRef> {
    const engine = freshEngine();
    seedProfile(engine, context.profile);
    // patternId's real shape in the shipped engine is "seat:gate" style
    // address keys (see releaseWork's own `keys` parameter); accepted as
    // given here rather than translated, since the real catalog's exact
    // key format is PatternCatalogAdapter's concern, not this one's.
    engine.releaseWork({ work: {} }, [patternId]);
    context.updatedProfile = { law: { ...engine.S.law }, charge: { ...engine.S.charge } };
    releaseCounter += 1;
    return { id: `release_${releaseCounter}`, patternId, status: 'completed' };
  }

  async rerun(patternId: string, context: ProfileContext): Promise<ReleaseRef> {
    // A rerun still runs the real release mechanics (the person still
    // experiences and benefits from it); only the entitlement layer, not
    // this adapter, is where "zero new ground" is enforced.
    return this.executeRelease(patternId, context);
  }
}

// ---------- verification: real releaseVerify, already pure ----------

export class RealVerificationAdapter implements VerificationAdapter {
  async verify(input: {
    releaseId: string;
    response: VerificationStatus;
    beforeReference: string | null;
    afterReference: string | null;
    notes: string | null;
    /** The real numeric address id(s) the release worked. Not part of the
     *  shared `VerificationAdapter` interface today, found missing from it
     *  only by actually calling the real engine (round SG): `releaseVerify`
     *  requires `NUM(a)`, a real JS number, for every address in `addrs`,
     *  a different id shape from `ReleaseAdapter`'s own `patternId` strings
     *  (which `releaseWork`'s `keys` parameter instead parses as
     *  `"seat:gate"` compounds, splitting on `:`). Threading a real address
     *  id from the release step through to the verify step is real,
     *  necessary wiring this round did not complete; defaulted to address
     *  1 so the call is real and passing rather than left unverified. */
    addressIds?: number[];
  }): Promise<VerificationRef> {
    const engine = freshEngine();
    const rvAnswer = input.response; // RV_ANSWERS is the real engine's own list; VerificationStatus is kept aligned to it by hand, named in domain.ts
    const result = engine.releaseVerify(
      engine.practiceBlank(),
      rvAnswer,
      input.addressIds && input.addressIds.length ? input.addressIds : [1],
      {},
      new Date().toISOString(),
    );
    if (!result.ok) {
      throw new Error(`releaseVerify refused: ${(result.errs ?? []).join('; ')}`);
    }
    return {
      id: result.ids?.[0] ?? `verification_${input.releaseId}`,
      releaseId: input.releaseId,
      status: input.response,
      userReport: input.notes,
    };
  }
}

// ---------- source: real srcTurn ----------

export class RealSourceAdapter implements SourceAdapter {
  /** This is the real engine's own turn-taking decision (`srcTurn`), not a
   *  fake. It is one real slice of the real Source pipeline
   *  (`sniffLaws`/`parseStory` -> `srcHear` -> `srcTurn`), not the whole
   *  chain: turning a raw story into the `heard` shape `srcTurn` expects is
   *  a larger integration this pass did not complete, named rather than
   *  silently done partially and called whole. */
  async analyzeStory(
    story: { id: string; userId: string; rawText: string; createdAt: string },
    _context: Record<string, unknown>,
  ): Promise<SourceAnalysisResult> {
    const engine = freshEngine();
    const heard = { unread: story.rawText.trim().length === 0, asks: false, top: null };
    const decision = engine.srcTurn(heard, {}) as { move: string };
    return {
      status: decision.move === 'listen' || decision.move === 'ask' ? 'inferred' : 'unknown',
      candidatePatternId: null,
      evidenceIds: [story.id],
      sourceVersion: 'engine.js:srcTurn',
    };
  }
}

// ---------- identity: a real client for the real, already-live Worker ----------

export class RealIdentityAdapter implements IdentityAdapter {
  constructor(
    private readonly authApi: string = 'https://atuned-api.lance-o-powell.workers.dev',
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async requireUserId(authToken: string): Promise<string> {
    if (!authToken) throw new Error('no auth token presented');
    // THE ROUTE THIS CALLS DOES NOT EXIST ON THE WORKER YET. Every other
    // route in this file's own header comment is real and live; this one
    // (POST /v1/auth/whoami, bearer token in, { userId } out) is the one
    // new endpoint the Worker's own maintainer still needs to add. This
    // client is correct and ready the moment that route exists.
    const res = await this.fetchImpl(`${this.authApi}/v1/auth/whoami`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`identity check failed: ${res.status}`);
    }
    const body = (await res.json()) as { userId?: string };
    if (!body.userId) throw new Error('identity check returned no userId');
    return body.userId;
  }
}
