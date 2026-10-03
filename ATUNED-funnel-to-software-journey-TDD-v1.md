# ATUNED Funnel → Software User Journey TDD
## v1.0 · October 1, 2026

## 1. Purpose

Define the complete first-contact journey from the public funnel into the Atüned software.

Core journey:

**CONCERN → PERSONALIZED GIFT → TUTORIAL → FIRST RELEASE → RERUN → FREE PRACTICE → REFERRAL → PAID**

The user should experience Atüned before being asked to understand Atüned.

## 2. Product Position

Atüned is a purpose-based impact product and results-as-a-service model, powered by Source OS.

The product is not primarily selling information. The reading is visible across tiers. Paid access provides additional new ground to work with.

**Sight is not for sale. New ground is.** fileciteturn17file3L5-L8

## 3. Experience Principle

The funnel, onboarding, tutorial, release system, Free state, referral system, and paid tiers behave as one product.

Preferred progression:

**Information → Recognition → Curiosity → Experience → Choice → Embodiment**

Avoid:

**Read → Explain → Test → Export → Import → Start**

The first meaningful product action should happen as early as possible.

## 4. Funnel

### 4.1 Encounter

Quiet Field.

> Something is running underneath the way you live.

> Atüned helps you see it.

Action:

**See what's running.**

### 4.2 Concern Selection

Question:

> What brought you here?

Possible grounds:

Anxiety · Overwhelm · Anger · Burnout · Fatigue · Grief · Fear · Relationships · Self-worth · Money · Purpose · Something else

The selection is an entry condition, not a diagnosis.

### 4.3 Personalized Starter Gift

The selected ground maps to a curated starter set of **100 patterns**.

The gift is immediately usable and transfers into the user's account when the account is created.

Suggested object:

```yaml
StarterGift:
  id
  user_id
  source: funnel
  selected_ground
  pattern_ids[]
  granted: 100
  remaining
  issued_at
  transferred_at
  status
```

## 5. Tutorial

The tutorial is first-use activation, not a feature tour.

It uses the user's actual starter patterns.

Teach only:

1. What a pattern is.
2. What new ground means.
3. How to run a release.
4. How to rerun opened ground for free.

Experience:

**SEE IT → TRY IT → FEEL THE DIFFERENCE → UNDERSTAND THE MECHANIC**

The user should not export, save, leave the product, or manually import anything before the first release.

## 6. First Release

The first release is the primary activation event.

The user should experience:

> I can see the pattern.
>
> I can work with the pattern.
>
> I can come back and run it again.

Presentation state, processing state, and evidence state remain separate. A visually completed release is not automatically verified change.

## 7. Rerun

Reruns cost zero patterns.

New ground consumes patterns.

Previously opened ground can be rerun without consuming another pattern.

## 8. Account Transition

Funnel session state becomes durable user state:

**Funnel session → Identity → Entitlement → StarterGift → Tutorial → Pattern → Release → Evidence**

No manual export/import.

## 9. Free Practice

When the personalized 100-pattern gift is depleted:

> Your starter gift is finished.
>
> Your Free practice continues.

Free provides **10 new patterns per week**. Unused Free patterns bank.

Free is a real product state, not a teaser.

## 10. Referral

Invite-a-Friend is part of the product loop.

The invited person receives:

> **25 free patterns**

The grant is immediately usable.

Track separately:

Starter Gift
Free Weekly Bank
Referral Grant
Paid Monthly Allowance

Referral events:

**Invite created → Invite opened → Referral signup → Grant issued → Grant used → First release → Paid conversion**

The older 50-pattern referral copy must be replaced with 25 before launch.

## 11. Paid Journey

Paid conversion should occur when the user wants additional new ground.

The paywall should be contextual, not an interruption to first value.

Suggested sequence:

**Work → approaching new-ground constraint → explain state → show throughput options → choose Free or paid → entitlement updates → continue**

The user never has to pay to see the reading.

Current tier structure is represented in the existing tiers experience as Free plus paid tiers, with the core principle that every tier sees the whole reading and paid access buys new ground. fileciteturn17file3L5-L8

## 12. User Journey State Machine

```text
LAND
 ↓
ENCOUNTER
 ↓
SELECT_GROUND
 ↓
STARTER_GIFT_ISSUED
 ↓
ACCOUNT_CREATED
 ↓
TUTORIAL_STARTED
 ↓
PATTERN_SELECTED
 ↓
FIRST_RELEASE
 ↓
VERIFY
 ↓
RERUN
 ↓
FREE_PRACTICE
 ↓
REFERRAL
 ↓
NEW_GROUND_LIMIT
 ↓
PAYWALL
 ↓
TIER_SELECTED
 ↓
PAYMENT
 ↓
ENTITLEMENT_GRANTED
 ↓
NEW_GROUND
 ↓
CONTINUED_PRACTICE
```

Every state must be recoverable.

## 13. Funnel-to-Software Data Contract

```yaml
FunnelActivation:
  session_id
  selected_ground
  starter_gift_id
  selected_pattern_ids[]
  user_input
  source_event_ids[]
  created_at
```

Account creation converts temporary activation state into durable user state.

No reinterpretation occurs during transfer.

## 14. Analytics

Core events:

CONCERN_SELECTED
STARTER_GIFT_ISSUED
ACCOUNT_CREATED
TUTORIAL_STARTED
TUTORIAL_COMPLETED
FIRST_PATTERN_OPENED
FIRST_RELEASE_STARTED
FIRST_RELEASE_COMPLETED
VERIFICATION_COMPLETED
RERUN_COMPLETED
GIFT_DEPLETED
FREE_PRACTICE_STARTED
REFERRAL_CREATED
REFERRAL_OPENED
REFERRAL_SIGNUP
REFERRAL_GRANT_ISSUED
REFERRAL_GRANT_USED
PAYWALL_SHOWN
TIER_SELECTED
PAYMENT_STARTED
PAYMENT_COMPLETED
ENTITLEMENT_GRANTED
RENEWAL
CANCELLATION

Primary activation chain:

**CONCERN → GIFT → FIRST RUN → FIRST RELEASE → SECOND RUN → RETURN → PAID**

## 15. Technical Boundaries

Payment credentials, processor keys, customer identifiers, and payment URLs do not belong in the client calculation engine.

The product engine receives entitlement state from the commercial boundary.

```text
ATUNED CLIENT
    |
    | entitlement state
    v
COMMERCIAL / PAYMENT SERVICE
    |
    v
PAYMENT PROVIDER
```

The client can calculate what the current entitlement permits without possessing payment credentials.

## 16. Evidence and Intelligence

Keep these distinct:

USER REPORTED
SYSTEM OBSERVED
SYSTEM INTERPRETED
HYPOTHESIS
VERIFIED CHANGE

A selected concern is context, not proof of diagnosis or causation.

## 17. Visual System

The funnel, onboarding, tutorial, and software share the existing Atüned Field and Body language. The current funnel already uses the product's own body/field visual system, and the software is organized around Discover, Play, Flow, and Embody. fileciteturn17file4L5-L8 fileciteturn18file2L1-L8

Style:

Iconographic
Symbolic
Clean
Scientific
Future-facing
Minimal
Purposeful
Dark field
Precise geometry
Colored registers
Thin paths
Nodes
Addresses
Waves
State transitions

Avoid:

Human figures as decorative imagery
Religious imagery
Mystical portals
Generic wellness imagery
Stock photography
Decorative sci-fi effects
Dashboard clutter

Visual grammar:

SIGNAL → node appears
NOTICE → node brightens
CONNECT → line forms
CONTRADICTION → paths diverge
TEST → paths become selectable
CONFIRM → path stabilizes
UNKNOWN → path remains open
PATTERN → repetition gathers
RELEASE → structure loosens
CHANGE → state reorganizes
VERIFY → before/after separates
MIRROR → system gathers

## 18. Visual Storyboard

### 01 — SIGNAL

Quiet Field. A small disturbance appears.

> Something is running underneath the way you live.

**See what's running.**

### 02 — CONCERN

> What brought you here?

Six to twelve symbolic entry points.

### 03 — GIFT

The selected symbol becomes the active field.

> Your first 100 patterns are ready.

### 04 — STORY

> Tell me something that's been happening.

The user's language becomes visible in the Field.

### 05 — NOTICE

A meaningful word or phrase becomes a signal.

The system shows what it noticed without pretending certainty.

### 06 — TEST

> Is this what you meant?

**That's it · Not quite · Look again**

If rejected, the structure changes.

### 07 — ADDRESS

> Where does this land?

The Body/Field system responds to the user's selected location.

### 08 — WORK

The first pattern enters Release.

Visual state:

**HELD → CONTRACTED → RELEASING → OPENING → SETTLING → OBSERVING**

### 09 — VERIFY

> What changed?

**I feel different · I see it differently · Something moved · Nothing changed · I'm not sure**

### 10 — TUTORIAL COMPLETE

```text
YOU SAID
   ↓
ATUNED NOTICED
   ↓
YOU TESTED
   ↓
YOU WORKED WITH IT
   ↓
YOU OBSERVED
```

### 11 — SOFTWARE

The user enters:

**Discover · Play · Flow · Embody**

The tutorial hands directly into Discover.

### 12 — CONTINUATION

Atüned remembers what happened.

The user can rerun the pattern for free.

New ground consumes patterns.

### 13 — FREE

The starter gift ends.

The Free weekly bank begins.

### 14 — REFERRAL

> Give someone 25 patterns to start.

### 15 — PAID

When new ground becomes the meaningful constraint:

> You've worked through this ground.
>
> There is more to explore.

Show throughput choices without artificial urgency.

## 19. Acceptance Criteria

A new user can:

1. Enter the funnel.
2. Select a starting ground.
3. Receive a personalized 100-pattern gift.
4. Create an account without losing the gift.
5. Enter the tutorial with that gift.
6. Run a first pattern.
7. Complete a release.
8. Verify what changed.
9. Rerun the pattern for free.
10. Enter the full software without repeating onboarding.
11. Continue on Free after the gift is exhausted.
12. Invite a friend and receive the correct referral behavior.
13. Encounter the paywall when additional new ground becomes relevant.
14. Purchase a tier.
15. Receive the correct entitlement.
16. Continue the same journey after payment.

## 20. Failure Tests

Test:

Gift issued but account creation interrupted
Account created but gift transfer fails
Tutorial abandoned midway
Release interrupted
Browser closed during release
Pattern rerun after session restart
Gift reaches zero
Free bank reaches zero
Referral before account creation
Referral after account creation
Referral plus starter gift
Referral plus Free bank
Payment succeeds but entitlement callback is delayed
Payment fails
Payment succeeds but client disconnects
Cancellation
Downgrade
Return after cancellation

No state may be silently lost.

## 21. Implementation Priority

### P0

Identity
Entitlement
Starter Gift
Funnel Activation Contract
Tutorial state
First Release handoff
Pattern bank
Rerun accounting
Payment boundary

### P1

Referral
Paywall
Tier comparison
Upgrade/downgrade
Recovery
Analytics

### P2

Adaptive personalization
Cohort learning
Advanced referral behavior
Deeper Mirror integration

## 22. Final Principle

The funnel should not feel like the front of the product.

It should feel like the first room of the product.

The user arrives with a reason.

They choose the ground.

Atüned gives them something real.

They work with it.

Something changes or does not.

Atüned remembers.

The user decides whether to continue.

That is the journey.
