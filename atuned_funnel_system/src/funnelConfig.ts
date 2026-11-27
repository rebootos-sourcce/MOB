/* ============================================================
   FUNNEL CONFIGURATION. Numbers, not hard-coded UI copy, per both TDDs'
   own instruction. These are copied from the one place they are actually
   ruled and shipped:

     - prices and new-ground limits: atuned_src/engine/plan.js PLAN_PRICE,
       ruled by the owner 1 October ("Free: $0. Tier 1: $12/month...");
     - sight depth per tier: atuned_src/engine/plan.js SIGHT, ruled round
       OK (1 October) and reconfirmed round SD (4 October, "don't change
       the staircase");
     - run floor/ceiling (RUN_MIN/RUN_MAX): funnel/buy.html's own ladder
       section, 25 patterns at most, matching engine/plan.js.

   THIS FILE MUST NOT DRIFT FROM engine/plan.js. It is a second copy of
   the same numbers only because this scaffold cannot import a host-free
   browser engine file directly without a build step the real integration
   will set up. Whoever wires this in should either generate this file
   from engine/plan.js at build time, or delete this file and import the
   real one once a Node-side build exists. Until then: a changed number in
   plan.js and not here is exactly the kind of silent mismatch CLAUDE.md
   says this project has been bitten by repeatedly. Grep both on every
   price change.
   ============================================================ */

import type { TierDefinition, PlanId } from './domain.js';

export const RUN_MIN = 4;
export const RUN_MAX = 25;

export const STARTER_GIFT_SIZE = 100;
export const FREE_WEEKLY_GRANT = 10;
export const REFERRAL_GRANT_AMOUNT = 25;
export const REFERRAL_MONTHLY_CAP = 4;

export const TIER_LADDER: Readonly<Record<PlanId, TierDefinition>> = Object.freeze({
  gift: {
    planId: 'gift',
    priceUsd: 0,
    newGroundLimit: STARTER_GIFT_SIZE,
    period: 'once',
    sight: 'base',
    leadCapability: false,
  },
  free: {
    planId: 'free',
    priceUsd: 0,
    newGroundLimit: FREE_WEEKLY_GRANT,
    period: 'week',
    sight: 'base',
    leadCapability: false,
  },
  tier1: {
    planId: 'tier1',
    priceUsd: 12,
    newGroundLimit: 400,
    period: 'month',
    sight: 'saboteurs',
    leadCapability: false,
  },
  tier2: {
    planId: 'tier2',
    priceUsd: 29,
    newGroundLimit: 800,
    period: 'month',
    sight: 'complexes',
    leadCapability: false,
  },
  tier3: {
    planId: 'tier3',
    priceUsd: 59,
    newGroundLimit: 1200,
    period: 'month',
    sight: 'hyperComplexes',
    leadCapability: false,
  },
  tier4: {
    planId: 'tier4',
    priceUsd: 99,
    newGroundLimit: 1200,
    period: 'month',
    sight: 'hyperComplexes',
    leadCapability: true,
  },
});

/* STARTING GROUND. Implementation TDD section 5. A selected ground is an
   entry condition, never a diagnosis, and it is passed to the real
   pattern catalog (PatternCatalogAdapter), not used to manufacture a
   pattern here. */
export const STARTING_GROUNDS = [
  'anxiety',
  'overwhelm',
  'anger',
  'burnout',
  'fatigue',
  'grief',
  'fear',
  'relationships',
  'self_worth',
  'money',
  'purpose',
  'something_else',
] as const;

export type StartingGround = (typeof STARTING_GROUNDS)[number];
