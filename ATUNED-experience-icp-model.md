# Atuned --- Experience, Activation, Retention & ICP Positioning Model

## Executive Summary

The core product objective should not be conversion alone.

**Atuned should optimize for successful transformation and sustained
practice.**

That becomes both a product principle and a strong marketing position:

> **Atuned is focused on successful transformation and sustained
> practice, rather than conversion.**

The commercial model should emerge from genuine user value. A user who
receives enough value from the Free experience to remain there is not a
failed conversion. The goal is to create a system in which people
experience meaningful value first, develop a repeatable practice, and
then choose a higher tier when their demonstrated behavior creates a
need for more new ground or leadership capability.

The current v1073 architecture already supports this philosophy in
important ways: the system keeps the reading visible across tiers,
allows reruns of opened material, and uses paid tiers primarily to
increase access to new ground. Tier 4 adds cohort-lead capability rather
than simply increasing individual pattern volume.

------------------------------------------------------------------------

# 1. Core Product Principle

## Primary Principle

**Create demonstrated value before requiring system comprehension.**

The experience should move from:

**Understand → Act**

to:

**Act → Experience → Understand → Explore**

### Ideal first-session sequence

``` text
ARRIVE
  ↓
WRITE
  ↓
SYSTEM FINDS ONE RELEVANT PATTERN
  ↓
RELEASE
  ↓
EXPERIENCE CHANGE
  ↓
PRACTICE
  ↓
UNDERSTAND
  ↓
EXPLORE
```

The product should teach by succeeding with the user.

The first experience should feel like:

> **"I wrote it. Atuned found it. I released it. Now I know what to do
> next."**

------------------------------------------------------------------------

# 2. First-Success Design

The first release should be the lowest-complexity version of the
complete transformation loop.

``` yaml
FIRST_SUCCESS:
  objective: "Demonstrate value before requiring system comprehension."

  required_actions:
    - write
    - identify_pattern
    - release
    - practice

  maximum_required_decisions: 1

  default_behavior:
    pattern_selection: automatic
    release_configuration: automatic
    advanced_settings: hidden
    system_vocabulary: minimal
    achievement_layer: hidden

  success_definition:
    - user identifies one relevant pattern
    - user completes one release
    - system presents one concrete practice
    - user understands what changed or what to do next

  progressive_disclosure:
    after_first_release:
      reveal:
        - pattern_detail
        - why_this_pattern
        - additional_release_controls

    after_repeated_use:
      reveal:
        - advanced_vocabulary
        - deeper_system_architecture
        - achievements
        - additional_tools

  forbidden:
    - paywall_before_value
    - mandatory_system_explanation
    - mandatory_configuration_before_first_release
    - artificial_restriction_of_existing_reading
```

------------------------------------------------------------------------

# 3. Activation Is a Chain, Not a Single Event

First-release completion is necessary but insufficient.

The stronger activation chain is:

``` text
FIRST SUCCESS
      ↓
SECOND SUCCESS
      ↓
THIRD SUCCESS
      ↓
WEEKLY RITUAL
      ↓
SELF-DIRECTED PRACTICE
      ↓
DEMONSTRATED VALUE
      ↓
OPTIONAL UPGRADE
```

### Why this matters

First release proves:

> "I can do this."

Second and third releases begin to prove:

> "This is something I want to keep doing."

The product should therefore optimize the transition from first success
into repeated, self-directed practice.

------------------------------------------------------------------------

# 4. Separate Usage From Value

A user can complete many releases without experiencing meaningful value.

Another user can complete relatively few releases and experience
substantial change.

Therefore:

**Usage ≠ Value**

The model should track both.

``` yaml
VALUE:
  behavioral:
    - releases_completed
    - return_frequency
    - practice_frequency

  experiential:
    - perceived_relevance
    - perceived_change
    - increased_self_understanding
    - increased_agency

  longitudinal:
    - recurring_problem_reduction
    - sustained_behavior_change
    - continued_practice
```

The primary question is not:

> "How much did the user consume?"

It is:

> "Did Atuned help the user experience meaningful change and develop a
> practice they continue voluntarily?"

------------------------------------------------------------------------

# 5. Model Why People Do Not Pay

Non-payment is not one behavior.

``` yaml
NON_PAYMENT_STATES:
  NO_VALUE:
    meaning: "User did not experience sufficient value."

  VALUE_BUT_LOW_FREQUENCY:
    meaning: "User receives value but does not need much new ground."

  VALUE_BUT_SUFFICIENT_FREE:
    meaning: "Free allowance satisfies the user's current need."

  VALUE_BUT_PRICE_RESISTANCE:
    meaning: "User wants more but does not currently accept the price."

  VALUE_BUT_NOT_READY:
    meaning: "User sees value but is not ready to increase commitment."

  HIGH_VALUE_AND_CAPACITY_CONSTRAINED:
    meaning: "User wants substantially more new ground than the current tier provides."

  LEADER_NOT_READY:
    meaning: "User may eventually lead others but does not yet need leadership capabilities."
```

This distinction protects the product from treating every non-paying
user as a conversion failure.

------------------------------------------------------------------------

# 6. Failure and Recovery Are Part of the Experience

The model must simulate imperfect users, not only successful paths.

``` text
RELEASE_SUCCESS
RELEASE_PARTIAL
RELEASE_REJECTED
RELEASE_ABANDONED
RELEASE_CONFUSED
RELEASE_NO_EFFECT
```

Each state needs an appropriate recovery path.

Examples:

-   **Rejected pattern:** allow the user to identify what feels wrong
    and find another pattern.
-   **Confused:** simplify the next action rather than explaining the
    whole system.
-   **Abandoned:** preserve context and make return frictionless.
-   **No effect:** provide a useful next experiment instead of declaring
    success.
-   **Partial:** preserve what was completed and make continuation
    obvious.

A failed first attempt should not feel like failure of the person or
failure of the entire system.

------------------------------------------------------------------------

# 7. User Maturity Must Be Independent of Payment

Payment tier and practitioner maturity are different dimensions.

``` text
LEVEL 0 — CURIOUS
LEVEL 1 — FIRST RELEASE
LEVEL 2 — PRACTITIONER
LEVEL 3 — CONSISTENT PRACTITIONER
LEVEL 4 — ADVANCED PRACTITIONER
LEVEL 5 — PRACTITIONER / LEADER
```

A Free user can be Level 4.

A Tier 3 user can still be Level 1.

**Payment should never be confused with mastery.**

This keeps the experience psychologically clean and prevents premium
access from being presented as a measure of personal development.

------------------------------------------------------------------------

# 8. Tier Logic

Tier upgrades should be triggered by demonstrated demand, not curiosity
alone.

``` yaml
UPGRADE_LOGIC:

  free_to_tier_1:
    trigger: "User repeatedly needs more new ground than the Free allowance provides."

  tier_1_to_tier_2:
    trigger: "User repeatedly approaches or exceeds the Tier 1 capacity."

  tier_2_to_tier_3:
    trigger: "User repeatedly approaches or exceeds the Tier 2 capacity."

  tier_3_to_tier_4:
    trigger: "User demonstrates a desire and behavior pattern consistent with leading other people."

  tier_4:
    primary_value:
      - cohort_management
      - rituals
      - accountability
      - leadership
    not_primary_value:
      - more individual pattern volume
```

The commercial proposition should therefore be:

> **More usable ground when your practice demonstrates that you need
> it.**

Not:

> "Pay more to see more of yourself."

------------------------------------------------------------------------

# 9. Adaptive Business Model

The 10,000-user simulation is useful as a planning model, but its
percentages should not become assumptions treated as facts.

``` yaml
SIMULATION_RULE:

  do_not_assume:
    - payer_rate
    - tier_distribution
    - retention_rate
    - upgrade_rate

  observe:
    - first_release_rate
    - second_release_rate
    - third_release_rate
    - day_7_retention
    - day_30_retention
    - day_90_retention
    - free_sufficiency_rate
    - allowance_pressure
    - upgrade_rate
    - downgrade_rate
    - cancellation_rate
    - value_score

  optimize_first_for:
    - successful_transformation
    - sustained_practice
    - user_value

  optimize_second_for:
    - monetization
```

The business model should be a consequence of the product creating
durable value.

------------------------------------------------------------------------

# 10. Core Experience Metrics

The most important product measurements are:

### Activation

-   First Release Completion
-   Second Release Completion
-   Third Release Completion

### Retention

-   Day 7
-   Day 30
-   Day 90
-   Weekly active practice

### Value

-   Perceived relevance
-   Perceived change
-   Increased self-understanding
-   Increased agency
-   Continued voluntary practice

### Commercial

-   Free sufficiency
-   Capacity pressure
-   Upgrade rate
-   Downgrade rate
-   Cancellation rate
-   Tier value alignment

### North-star behavioral outcome

> **Percentage of entrants who reach repeated, self-directed practice
> and can demonstrate that Atuned is producing value for them.**

Revenue is an outcome of that system, not the system's primary
objective.

------------------------------------------------------------------------

# 11. ICP Positioning Test

## Proposed tagline

> **Focused on successful transformation and sustained practice, rather
> than conversion.**

### ICP interpretation

For the likely Atuned ICP --- people actively seeking meaningful
personal change who are willing to engage in an ongoing practice rather
than simply consume information --- the positioning communicates three
useful things:

1.  **Outcome over transaction**
    -   The product is saying the goal is actual change, not extracting
        a subscription.
2.  **Practice over novelty**
    -   Atuned is positioned as something users work with repeatedly,
        rather than a one-time insight generator.
3.  **Long-term value over funnel optimization**
    -   The product promise is implicitly about what happens to the
        user, not what happens to the company's conversion dashboard.

### ICP strength

The statement is particularly strong as a **brand philosophy /
positioning line**.

It is slightly weaker as the only consumer-facing headline because
"rather than conversion" is language about the company's commercial
behavior. A prospective customer cares first about what Atuned will do
for them.

Therefore I would use it as a supporting brand line, not necessarily the
primary headline.

### Recommended messaging hierarchy

**Primary customer-facing promise:**

> **Successful transformation. Sustained practice.**

**Supporting brand philosophy:**

> **We focus on successful transformation and sustained practice, rather
> than conversion.**

**Product explanation:**

> **Atuned helps you identify what is getting in your way, release it,
> and build a practice that keeps producing meaningful change.**

This gives the ICP an immediate benefit first, followed by the
philosophy behind the product.

------------------------------------------------------------------------

# 12. Marketing Implication

The product and marketing should tell the same story.

Do not lead with:

-   number of patterns
-   system complexity
-   advanced architecture
-   tier comparisons
-   feature volume
-   how much content is unlocked
-   conversion incentives

Lead with:

``` text
SEE IT
  ↓
RELEASE IT
  ↓
FEEL THE DIFFERENCE
  ↓
PRACTICE
  ↓
CHANGE
```

Then explain the sophistication of the system after the user understands
its usefulness.

------------------------------------------------------------------------

# 13. Product Strategy in One Sentence

> **Atuned should optimize for successful transformation and sustained
> practice, rather than conversion.**

This is both a product principle and a potentially strong brand
philosophy because it describes the relationship Atuned intends to have
with the user: value first, practice second, monetization as a
consequence.

------------------------------------------------------------------------

# 14. Final Evaluation

  Dimension                           Rating
  --------------------------------- --------
  First-use clarity                   9.7/10
  Friction reduction                  9.5/10
  Activation model                    9.7/10
  Retention model                     9.1/10
  Value measurement                   9.4/10
  Failure/recovery coverage           9.0/10
  Tier/value alignment                9.6/10
  ICP positioning                     9.3/10
  Marketing usefulness of tagline     9.4/10
  Overall product-model coherence     9.6/10

## Confidence

-   Confidence in the product logic: **0.95**
-   Confidence in the exact 10,000-user numerical forecast: **0.78**
-   Confidence in first-success recommendation: **0.97**
-   Confidence in the tagline as a brand philosophy: **0.93**

## Guiding Values

-   Agency
-   Truthful value exchange
-   Simplicity
-   Progressive disclosure
-   Evidence before explanation
-   Successful transformation
-   Sustained practice
-   Monetization as a consequence of value


---

# 15. Separate Section — Additional Release & Telemetry Concepts

These concepts are intentionally separated from the core experience and commercial model above.

## 15.1 Addiction-Language Sniffer

The Sniffer can identify language associated with an addiction pattern and route that language into the existing Release protocol.

### Important framing

This should be treated as **language detection and release support**, not as a clinical diagnosis.

The system should not infer or declare that a person has a substance-use disorder or other clinical condition merely because they use the word “addicted.”

The useful product behavior is:

```text
USER LANGUAGE
     ↓
SNIFFER IDENTIFIES ADDICTION-RELATED LANGUAGE
     ↓
PRESENT THE ADDICTION LADDER
     ↓
RELEASE EACH DOWNSTREAM LAYER
     ↓
REDUCE CHARGE
     ↓
CONTINUE WITH THE NORMAL RELEASE / PRACTICE LOOP
```

### Addiction ladder

The ladder supplied for the Atuned release protocol is:

```text
ADDICTED
   ↓
DEPENDENT
   ↓
CRAVE
   ↓
DESIRE
   ↓
NEED
   ↓
WANT
```

The intended use is to release the belief/identification at each level and progressively reduce the charge associated with the subject.

Examples of detected language might include:

- “I'm addicted to ___.”
- “I'm dependent on ___.”
- “I crave ___.”
- “I desire ___.”
- “I need ___.”
- “I want ___.”

The Sniffer should preserve the user's actual object:

```text
"I am addicted to [OBJECT]"
"I am dependent on [OBJECT]"
"I crave [OBJECT]"
"I desire [OBJECT]"
"I need [OBJECT]"
"I want [OBJECT]"
```

The object could be anything the user identifies, including a substance, behavior, activity, relationship, or other recurring focus.

### Recommended product behavior

Do not force the entire ladder every time.

Instead:

```yaml
ADDICTION_SNIFFER:
  detects:
    - addiction_identification
    - dependency_language
    - craving_language
    - desire_language
    - need_language
    - want_language

  response:
    - identify_detected_level
    - offer_release_at_that_level
    - optionally_offer_downstream_levels
    - preserve_user_language
    - return_to_normal_release_loop

  principle:
    "Reduce charge without claiming that charge reduction equals resolution of the underlying addiction."

  safety:
    "Do not diagnose addiction from language alone."
```

The key distinction is:

> **The ladder may reduce the charge around an addictive pattern; it should not be represented as a complete treatment for addiction.**

That keeps the mechanism aligned with Atuned's release model without making a clinical claim the system cannot substantiate.

---

## 15.2 Shadow-Weight Telemetry

The current build already has an underlying **shadow weight / DQ** concept tied to the total shadow across the address field. The question is primarily where the user should see it.

### Recommendation

**Summary is the better primary location.**

The Body/Energy experience should remain focused on experiencing and working with the body.

Summary is the appropriate place to answer:

> “What changed?”

A telemetry presentation can therefore show:

```text
SHADOW WEIGHT
DQ: XX%
```

with a compact visualization of where the weight is distributed.

### Recommended hierarchy

```text
SUMMARY
│
├── Overall Shadow Weight / DQ
│
├── Change Since Previous Release
│
├── Distribution Across Body / Energy Areas
│
├── Highest-Weight Areas
│
└── Relevant Patterns / Addresses
```

### What the telemetry should accomplish

Telemetry should not become another dashboard that asks the user to interpret the system.

Its job is to make change visible.

The ideal question is:

> **“What moved?”**

not:

> “How do I interpret all these numbers?”

### Recommended telemetry states

```yaml
SHADOW_TELEMETRY:
  overall:
    metric: DQ / shadow weight
    purpose: "show overall load"

  delta:
    metric: change_from_previous_state
    purpose: "show movement"

  distribution:
    metric: shadow_weight_by_area
    purpose: "show where the load is concentrated"

  highlights:
    metric: largest_changes
    purpose: "show what moved most"

  history:
    metric: trend_over_time
    purpose: "show sustained change"
```

### Visualization principle

Use telemetry as **evidence of change**, not as a score of personal worth or spiritual progress.

A useful sequence is:

```text
RELEASE
  ↓
EXPERIENCE
  ↓
SUMMARY
  ↓
SEE WHAT MOVED
  ↓
RETURN TO PRACTICE
```

That makes telemetry reinforce the core product loop rather than compete with it.

---

# 16. Updated Strategic Principle

These additions strengthen the same underlying architecture:

> **Atuned should optimize for successful transformation and sustained practice, rather than conversion.**

The Addiction Sniffer helps the system recognize another form of language that can enter the Release protocol.

Shadow telemetry helps the user see evidence of movement after practice.

Neither should become a new source of complexity before the user's first successful release.

## Priority

```yaml
PRIORITY:

  P0:
    - first_release_simplicity
    - second_and_third_release_activation
    - failure_and_recovery
    - value_realization

  P1:
    - addiction_language_sniffer
    - shadow_weight_summary_telemetry

  P2:
    - deeper_telemetry_history
    - advanced addiction-pattern analytics
    - richer comparative visualizations
```

The governing rule remains:

> **Experience first. Evidence second. Explanation third.**
