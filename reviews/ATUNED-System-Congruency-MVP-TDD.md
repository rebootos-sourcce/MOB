# ATUNED — System Congruency & MVP Closure TDD

**Status:** Late Alpha / Pre-MVP  
**Priority:** P0 — Close the first complete ATUNED loop  
**Date:** 2026-10-02  
**Primary implementation target:** Release loop + end-to-end congruency  
**Audience:** Next implementation AI / engineering pass

---

## 1. Executive Summary

ATUNED is not a prototype that still needs to become a product. The production system already contains substantial product machinery and a coherent visual language.

The current state is better described as:

> **Late Alpha / Pre-MVP**

The critical gap is not feature breadth. It is **congruency**.

The first-use experience must become one continuous, evidence-backed loop:

```text
STORY
  ↓
OBSERVATION
  ↓
MIRROR
  ↓
CONFIRM / CORRECT
  ↓
PATTERN
  ↓
RELEASE
  ↓
VERIFY
  ↓
EVIDENCE
  ↓
FIELD / HISTORY
```

The central architectural principle is:

> **Do not start by redesigning screens. Prove one truth moving through the entire product.**

The existing onboarding visual system should be preserved where it is strong. The intelligence layer should drive the visual system rather than the visual sequence substituting for intelligence.

---

# 2. Current Product Classification

## Overall

**Late Alpha / Pre-MVP**

The product has moved materially beyond a simple prototype in visual sophistication, application breadth, and underlying infrastructure. The remaining MVP gap is concentrated in the intelligence loop and the congruency of its boundaries.

### Current assessment

| Area | Status |
|---|---|
| Visual design | MVP-capable |
| Field visual system | Strong |
| Cinematic onboarding | Strong prototype |
| Core application breadth | Advanced Alpha |
| Story intelligence | Alpha / incomplete |
| Mirror | Incomplete |
| Confirmation / correction | Incomplete |
| Release presentation | Strong prototype |
| Release intelligence | Needs closure |
| Verification | Incomplete |
| Longitudinal evidence | Incomplete |
| Tutorial handoff | Needs alignment |
| Build congruency | P0 release-engineering concern |
| Overall | Late Alpha / Pre-MVP |

The current production build identifies itself as `v1366 d486d3e 2026-10-02 14:33` and describes the application as a field instrument with 112 addresses, nine poled axes, and twenty-one laws. The build also explicitly carries its build identifier on the root element so it survives removal of the boot card.

---

# 3. MVP Definition

Do not define MVP as "all major features exist."

Define MVP as:

> **A new person can enter ATUNED without understanding the system, provide a real experience, see ATUNED produce an evidence-based observation, confirm or correct that observation, release the confirmed pattern using the real engine, observe what changed, and have that evidence persist into the Field/history.**

## MVP acceptance journey

A new user must be able to:

1. Enter without prior ATUNED knowledge.
2. Choose or identify what is happening.
3. Feel the experience in the body.
4. Describe the experience in their own words.
5. Have ATUNED extract structured evidence.
6. See what ATUNED noticed.
7. Confirm, reject, or correct the interpretation.
8. Have correction alter the downstream interpretation.
9. Release the confirmed pattern through the actual release path.
10. Observe and report what changed.
11. Persist the result as evidence.
12. See that evidence represented in the Field/history.
13. Learn Discover → Play → Flow → Embody from the experience they just completed.
14. Continue into the ongoing product.

If this journey works reliably, ATUNED is MVP.

---

# 4. What the Existing Onboarding Already Proves

The onboarding prototype establishes a coherent cinematic path:

```text
DOOR
 ↓
REEL A
 ↓
STARTING POINT
 ↓
STORY
 ↓
FIRST READING
 ↓
RELEASE
 ↓
REEL B
 ↓
KEEP / ACCOUNT
 ↓
SIGNAL TEST
 ↓
FIELD
```

The storyboard contains 25 frozen beats from door through field end.

The prototype has explicit interaction states for the sequence.

The visual language is also substantially aligned with the intended product:

```text
dark field
minimal typography
thin geometry
body figure
rings
nodes
112 addresses
color
motion
breathing
symbolic geometry
```

The prototype avoids the unwanted visual directions:

```text
stock photography
humans as decoration
mystical portals
religious imagery
dashboard clutter
generic wellness aesthetics
```

The Field is functioning as an interface rather than merely as a decorative background.

**Preserve this.**

The visual engine is not the problem.

---

# 5. The Core Problem

The existing onboarding architecture is organized around **scenes**.

The intended ATUNED architecture is organized around:

```text
evidence
change
confirmation
memory
```

Those are not equivalent.

The current experience can look like ATUNED is discovering something when parts of the prototype are actually using predetermined mappings.

The product must make the distinction explicit:

```text
WHAT YOU SAID
      ↓
WHAT ATUNED NOTICED
      ↓
WHAT ATUNED THINKS MAY BE HAPPENING
      ↓
IS THAT ACCURATE?
      ↓
USER CONFIRMS / CORRECTS
      ↓
ATUNED UPDATES
```

This is the Mirror.

---

# 6. Current Intelligence Gap

The prototype currently contains a small lexical matcher.

Representative terms include:

```text
afraid
panicking
exhausted
snapped
angry
mortified
criticised
grief
lonely
sad
interrupted
betrayed
overthinking
pointless
```

The current conceptual path is approximately:

```text
USER STORY
 ↓
FIND WORD
 ↓
MAP WORD TO BODY SEAT
```

That is a keyword detector, not the intended Story Sniffer.

## Required intelligence object

The Story Sniffer must produce at minimum:

```text
story_tag
story_snippet
quality
intensity
cause_experience
body_location
relationships
possible_pattern
uncertainty
```

The intended path is:

```text
USER STORY
 ↓
STRUCTURAL EXTRACTION
 ↓
EVIDENCE
 ↓
HYPOTHESIS
 ↓
USER VERIFICATION
```

Do not claim the system has discovered something when the system only mapped a keyword.

---

# 7. Required Canonical Observation Contract

Create one canonical observation object.

All relevant layers must consume this object rather than independently interpreting the user's input.

Conceptually:

```js
Observation {
  id,
  sessionId,
  source,
  timestamp,

  userSaid: {
    raw,
    snippet
  },

  extracted: {
    storyTag,
    quality,
    intensity,
    causeExperience,
    bodyLocation,
    relationships,
    possiblePattern
  },

  hypothesis: {
    statement,
    confidence,
    evidenceRefs
  },

  userVerification: {
    status: "pending" | "confirmed" | "rejected" | "corrected",
    correction,
    timestamp
  },

  downstream: {
    patternId,
    releaseId,
    verificationId
  }
}
```

The exact implementation may differ, but the conceptual contract must remain stable.

## Rule

There must be one authoritative interpretation path.

Do not create:

```text
onboarding interpretation
Story interpretation
release interpretation
Field interpretation
history interpretation
```

as separate truths.

They must consume the same canonical evidence.

---

# 8. Evidence Ledger

Every meaningful stage must be traceable.

Minimum event categories:

```text
USER_SAID
SYSTEM_NOTICED
SYSTEM_INFERRED
USER_CONFIRMED
USER_REJECTED
USER_CORRECTED
PATTERN_SELECTED
INTERVENTION_STARTED
INTERVENTION_COMPLETED
USER_EXPERIENCE
VERIFICATION
FIELD_UPDATED
```

This is not merely analytics.

It is the evidence trail that allows the product to distinguish:

> What the user actually said

from:

> What ATUNED inferred

from:

> What the user confirmed.

That distinction is foundational.

---

# 9. Mirror Requirements — P0

The Mirror is the intellectual centerpiece of the first-use experience.

It should visibly establish:

```text
WHAT I SAID
      ↓
WHAT ATUNED NOTICED
      ↓
WHAT ATUNED THINKS
      ↓
DOES THAT FIT?
```

Minimum controls:

```text
THAT'S IT
NOT QUITE
ADJUST
```

If the user selects **Not Quite**:

```text
Tell us what's off.
```

Allow concise text or the existing supported input mechanism.

The system must reprocess the correction.

## Critical requirement

Correction cannot be cosmetic.

If the user says the interpretation is wrong:

- the canonical observation changes;
- the hypothesis changes;
- downstream pattern selection must use the updated observation;
- the Field/history must not retain the rejected interpretation as confirmed truth.

The system may retain the rejected hypothesis as historical evidence, but it must remain explicitly marked as rejected.

---

# 10. Feeling Layer

The intended experience is:

```text
STARTING POINT
 ↓
FEEL
 ↓
STORY
```

The current prototype moves too quickly from starting-point selection to language.

Add one lightweight sensory interaction.

Do not turn this into a questionnaire.

Conceptually:

```text
What are you feeling today?
        ↓
How does that feeling run through you?
        ↓
Does it make you feel anything else?
```

The Field should respond before the user submits the full story.

The purpose is to shift the experience from:

> Tell me your problem.

to:

> Notice what is happening.

This should remain lightweight and embodied.

---

# 11. Starting Point Must Be Context, Not Just a Body Seat

Current starting points include concepts such as:

```text
Anxiety
Anger
Overwhelm
Burnout
Grief
Fear
Relationships
Pain
Self-worth
Purpose
Money
Something else
```

These are directionally useful.

The error is treating a selected ground primarily as a spatial coordinate.

The intended architecture is:

```text
SELECTED GROUND
 ↓
GROUND CONTEXT
 ↓
RELEVANT PATTERN SPACE
 ↓
OBSERVATION
 ↓
PATTERN
```

Not:

```text
SELECTED GROUND
 ↓
BODY SEAT
```

The selected ground should influence interpretation and relevance without overriding evidence from the user's actual story.

---

# 12. Release Loop — TODAY'S PRIMARY FOCUS

## Objective

Close the release loop so the first ATUNED journey reaches a genuine, testable transformation.

The target is:

```text
CONFIRMED OBSERVATION
      ↓
PATTERN
      ↓
RELEASE
      ↓
SETTLE
      ↓
VERIFY
      ↓
RECORD CHANGE
```

The existing visual release language should be preserved where useful.

The implementation must now connect that presentation to the real release engine.

## Release must answer

```text
Which pattern?
Why this pattern?
Why this order?
Which channels?
What happens if the user reacts differently?
What is repeated?
What gets verified?
What changes afterward?
```

The visual sequence alone is insufficient.

---

# 13. Release Language

The established release language is:

> **I am releasing believing, thinking, feeling, behaving, acting...**

Use the canonical release language from the production engine.

Do not create a second release sentence generator in onboarding.

The onboarding must call the same release machinery used elsewhere in the product.

## Single-source rule

```text
ONBOARDING RELEASE
        ↓
SAME RELEASE ENGINE
        ↓
SAME PATTERN OBJECTS
        ↓
SAME PERSISTENCE
        ↓
SAME HISTORY / FIELD
```

No shortened mockup-specific release path should survive into MVP.

---

# 14. 100-Pattern Starter Gift

The onboarding visually presents a 100-pattern opening.

For MVP, distinguish clearly between:

```text
visual representation
```

and:

```text
actual entitlement / pattern bank
```

The starter gift must become a real persisted object.

Conceptually:

```js
StarterGift {
  selectedGround,
  patternIds[],
  granted: 100,
  remaining,
  issuedAt,
  status
}
```

The actual implementation may differ.

The important requirement is that the 100-pattern opening is not merely a countdown animation.

The system must be able to answer:

```text
What 100 patterns?
Why these 100?
Which have been opened?
Which have been released?
Which remain?
What ground/context produced the selection?
```

---

# 15. Verification — P0

The signal test is useful but is not equivalent to verification.

After release, explicitly capture:

```text
What changed?
```

Minimum responses:

```text
I feel different
I see it differently
Something moved
Nothing changed
I'm not sure
```

The exact copy may evolve, but the evidence model must support these distinctions.

## Required record

```js
Verification {
  observationId,
  releaseId,
  result,
  subjectiveChange,
  timestamp
}
```

The user must not be forced to report a positive result.

"No change" and "I'm not sure" are valid evidence.

---

# 16. Field / History

After verification, write the result into the persistent product state.

The Field should become a representation of:

```text
patterns
addresses
relationships
practice
evidence
change
```

The Field is not the source of intelligence.

It visualizes intelligence.

Correct relationship:

```text
USER
 ↓
EXPERIENCE
 ↓
EVIDENCE
 ↓
SOURCE OS
 ↓
CHANGE
 ↓
FIELD
```

The Field should never be used to imply certainty that the evidence does not support.

---

# 17. Avatar

The Avatar should be introduced carefully.

The first onboarding session does not contain enough longitudinal evidence to imply that a meaningful Avatar has already been modeled.

Prefer:

> **Your Field is beginning to take shape.**

rather than:

> **This is your Avatar.**

The Avatar should accumulate from evidence such as:

```text
language
behavior
integrity
patterns
rituals
evidence
goals
archetypes
purpose
boundaries
```

This is a longitudinal system.

Do not make it the P0 blocker.

---

# 18. Tutorial

The tutorial should explain what the user just experienced.

It must not restart the transformation.

The desired structure is:

```text
YOU JUST EXPERIENCED ATUNED.

You discovered something.
You played with the observation.
You released something real.
You observed what changed.

That's Discover.
That's Play.
That's Flow.
That's Embody.
```

Then transition into the ongoing product.

Do not require a second journal entry solely to explain the loop.

---

# 19. Public Funnel → Onboarding

The public funnel should prepare the user to encounter ATUNED rather than requiring them to understand ATUNED before trying it.

The handoff should be:

```text
PUBLIC PROMISE
 ↓
EXPERIENCE
 ↓
ONBOARDING
 ↓
MIRROR
 ↓
FIRST RELEASE
```

Do not create a second conceptual product between funnel and app.

The same terminology and source-of-truth objects should be used.

---

# 20. Safety Architecture

The existing static stop frame is worth preserving.

It is intentionally separate from the moving experience and provides crisis-oriented language and 988 access.

For MVP, safety should evolve toward:

```text
INPUT
 ↓
SAFETY GATE
 ↓
NORMAL
HEIGHTENED CARE
OUT OF SCOPE
 ↓
APPROPRIATE EXPERIENCE
```

The stop frame is one branch, not the entire safety architecture.

Avoid clinical claims.

Avoid implying diagnosis.

Use language such as:

```text
ATUNED noticed...
ATUNED is interpreting...
This may fit...
Does this feel accurate?
```

rather than presenting inference as objective medical or psychological fact.

---

# 21. Product Language Corrections

Review public and onboarding language for unnecessary claims.

Examples requiring review:

### “neurosomatic experience”

Potentially stronger scientific/clinical implication than required.

### “Awareness and intuition is a tool...”

Grammatically awkward and conceptually broad.

### “It reads 112 addresses. Each is a place in your body.”

If 112 addresses are an internal ATUNED model, describe them as ATUNED's modeled addresses rather than implying an externally established scientific body map.

### General rule

Prefer:

> **ATUNED noticed...**

over:

> **This is what is happening.**

The evidence architecture should make the product's confidence visible.

---

# 22. Architecture Transformation

## Current

```text
USER
 ↓
SCRIPT
 ↓
VISUAL
 ↓
RELEASE
 ↓
FIELD
```

## Target

```text
USER
 ↓
EXPERIENCE
 ↓
STORY
 ↓
EVIDENCE
 ↓
SOURCE OS
 ↓
HYPOTHESIS
 ↓
USER TEST
 ↓
PATTERN
 ↓
INTERVENTION
 ↓
VERIFICATION
 ↓
CHANGE
 ↓
FIELD
 ↓
MEMORY
```

The visual system operates across this pipeline:

```text
                 FIELD
                   │
USER → EVIDENCE → SOURCE OS → CHANGE
                   │
                VISUALIZE
```

Core principle:

> **The Field should visualize intelligence, not substitute for it.**

---

# 23. Canonical System Boundary

Every surface must consume the same canonical objects.

Target:

```text
PUBLIC FUNNEL
      ↓
ONBOARDING
      ↓
STORY
      ↓
OBSERVATION
      ↓
MIRROR
      ↓
CONFIRM / CORRECT
      ↓
RELEASE
      ↓
VERIFY
      ↓
FIELD
      ↓
HISTORY / PRACTICE
```

No duplicate interpretation.

No duplicate release generator.

No onboarding-only evidence model.

No prototype-only pattern bank.

No separate Field interpretation.

---

# 24. Build Congruency

Build congruency is a release-engineering P0.

Every distributed surface must identify and agree on the canonical build.

At minimum:

```text
build ID
commit / revision
date
schema version
observation contract version
release engine version
```

The current production build exposes:

```text
v1366 d486d3e 2026-10-02 14:33
```

The implementation pass must establish a repeatable source of truth so the following cannot diverge silently:

```text
prototype
production app
funnel
about
tiers
quiz
onboarding
single-file build
```

---

# 25. Other AI — Required Re-Audit Instructions

The next AI must not assume this TDD is correct merely because it is the current plan.

It must **review, re-audit, and close the loop against the actual files/code**.

## Required sequence

### Step 1 — Identify the canonical build

Record:

```text
build ID
revision
timestamp
source file
```

### Step 2 — Inventory current architecture

Find the actual implementations of:

```text
story input
story parsing
observation
pattern selection
release
verification
persistence
Field
history
tutorial
safety
account
entitlements
```

### Step 3 — Find duplicate truths

Search for:

```text
duplicate story parsing
duplicate keyword maps
duplicate body mappings
duplicate release sentence generation
duplicate pattern selection
duplicate persistence
duplicate build identifiers
duplicate design tokens
```

Mark each:

```text
KEEP
MERGE
DELETE
DEPRECATE
UNKNOWN
```

### Step 4 — Trace one real user journey

Follow one input from:

```text
user story
 ↓
observation
 ↓
mirror
 ↓
confirmation
 ↓
pattern
 ↓
release
 ↓
verification
 ↓
Field/history
```

Document every handoff.

### Step 5 — Re-audit the release path

Confirm that onboarding uses the actual release engine.

Confirm:

- pattern source;
- ordering;
- release language;
- channel logic;
- timing;
- persistence;
- completion state;
- verification handoff.

### Step 6 — Implement the smallest closure

Do not expand scope.

Close the smallest complete loop.

### Step 7 — Run regression

Do not stop when the screen looks correct.

Test:

```text
happy path
correction path
rejection path
no-match path
no-change path
guest path
account path
refresh/reload
persistence
build identity
safety branch
```

### Step 8 — Report status explicitly

Use:

```text
DONE
PARTIAL
BLOCKED
NOT IMPLEMENTED
```

For every P0 item.

---

# 26. P0 Execution Order

Today's implementation order:

```text
1. RELEASE AUDIT
      ↓
2. RELEASE ENGINE CONGRUENCY
      ↓
3. CONFIRMED OBSERVATION → RELEASE
      ↓
4. POST-RELEASE VERIFICATION
      ↓
5. EVIDENCE PERSISTENCE
      ↓
6. FIELD/HISTORY UPDATE
      ↓
7. MIRROR CONFIRM/CORRECT HANDOFF
      ↓
8. ONBOARDING → PRODUCTION PATH
      ↓
9. BUILD CONGRUENCY
      ↓
10. REGRESSION
```

Do not start with:

```text
new features
90-day engine expansion
commerce expansion
Avatar expansion
new scenes
new visual systems
additional agents
```

unless required to unblock the P0 journey.

---

# 27. Acceptance Tests

## AT-01 — Story reaches canonical observation

**Given:** user submits a story.

**When:** processing completes.

**Then:** one canonical Observation exists.

**Must contain:**

```text
story
evidence
hypothesis
uncertainty
```

---

## AT-02 — Mirror is evidence-backed

**Given:** Observation exists.

**When:** Mirror renders.

**Then:** the UI distinguishes:

```text
what user said
what system noticed
what system inferred
```

---

## AT-03 — User can correct

**Given:** Mirror is shown.

**When:** user selects `NOT QUITE`.

**Then:**

- correction is captured;
- Observation status becomes corrected/reprocessed;
- downstream interpretation changes;
- rejected interpretation is not treated as confirmed truth.

---

## AT-04 — Confirmed observation reaches release

**Given:** user confirms.

**When:** user proceeds.

**Then:** the actual release engine receives the confirmed pattern.

No mock release path.

---

## AT-05 — Release is persisted

**Given:** release completes.

**Then:** the system records:

```text
pattern
release
timestamp
completion
```

---

## AT-06 — Verification exists

**Given:** release completes.

**Then:** user is asked what changed.

The system accepts positive, negative, and uncertain outcomes.

---

## AT-07 — Evidence survives

**Given:** verification completes.

**When:** app is reloaded.

**Then:** the relevant evidence remains available in the canonical persistence layer.

---

## AT-08 — Field reflects evidence

**Given:** evidence is persisted.

**Then:** Field/history reflects the event without inventing certainty.

---

## AT-09 — Tutorial does not duplicate transformation

The tutorial explains the completed experience and does not require the user to perform another equivalent story/release cycle.

---

## AT-10 — Build congruency

All distributed surfaces report the same canonical build/version metadata.

---

## AT-11 — Safety branch

Safety-sensitive input follows the defined safety path and does not continue blindly through normal interpretation.

---

## AT-12 — No duplicate interpretation

There is one canonical interpretation path.

Any remaining legacy interpretation path must be:

```text
removed
or explicitly deprecated
```

---

# 28. Regression Checklist

### Intelligence

- [ ] Story extraction works.
- [ ] Observation is canonical.
- [ ] Hypothesis has uncertainty.
- [ ] Mirror exposes evidence.
- [ ] Confirmation works.
- [ ] Correction works.
- [ ] Rejection works.
- [ ] Reprocessing works.

### Release

- [ ] Confirmed pattern reaches real engine.
- [ ] Release language is canonical.
- [ ] Release completes.
- [ ] Release persists.
- [ ] No onboarding-only release implementation remains.
- [ ] 100-pattern entitlement is not merely visual.

### Verification

- [ ] What changed? exists.
- [ ] Positive change can be recorded.
- [ ] No change can be recorded.
- [ ] Uncertainty can be recorded.
- [ ] Verification links to release and observation.

### Persistence

- [ ] Observation persists.
- [ ] Correction persists.
- [ ] Release persists.
- [ ] Verification persists.
- [ ] Field/history reflects them.

### Experience

- [ ] Feeling layer exists or is explicitly deferred with rationale.
- [ ] Cinematic visual language remains intact.
- [ ] Explanation does not dominate first-use.
- [ ] Tutorial explains rather than restarts.

### Engineering

- [ ] Canonical build ID exists.
- [ ] Schema/version compatibility is known.
- [ ] Distributed files are congruent.
- [ ] No duplicate source of truth remains.
- [ ] Regression path passes.

---

# 29. Do Not Do This

Do not:

- redesign the entire visual system;
- add more cinematic scenes instead of intelligence;
- create another Story parser;
- create another release generator;
- make the Field infer truth independently;
- treat keyword matching as the final Story Sniffer;
- treat a predetermined reading as discovered evidence;
- make user correction cosmetic;
- force positive verification;
- expand the Avatar before longitudinal evidence exists;
- expand commerce before the core transformation works;
- add more features to compensate for an incomplete first-use loop.

The instruction is:

> **Make the existing system respond to the user.**

Not:

> **Build more scenes.**

---

# 30. Definition of Done for MVP

ATUNED can be called MVP when a new user can complete this without a hidden manual intervention:

```text
ENTER
 ↓
ENCOUNTER
 ↓
FEEL
 ↓
STORY
 ↓
OBSERVE
 ↓
MIRROR
 ↓
CONFIRM / CORRECT
 ↓
PATTERN
 ↓
RELEASE
 ↓
VERIFY
 ↓
PERSIST
 ↓
FIELD
 ↓
CONTINUE
```

And engineering can demonstrate that the same underlying evidence is being consumed across those steps.

The visual experience can remain cinematic.

The underlying system must be evidence-driven.

---

# 31. Final Handoff Principle

The next implementation pass should begin here:

> **Prove one truth moving through the whole product: Story → Observation → Mirror → Confirm or Correct → Release → Verify → Evidence.**

Then:

> **Make the existing scenes respond to that truth.**

The strongest existing work is the visual Field, body system, motion, symbolic language, and onboarding choreography.

The highest-value remaining work is not more visual invention.

It is making the intelligence architecture real, inspectable, correctable, persistent, and congruent across the product.

**Primary target for today: close the Release → Verification → Evidence loop using the canonical system path.**

# INFORMATION FLOW CONGRUENCY SWEEP

## Purpose

This section records the final architecture sweep across the information chain:

USER INTERACTION
↓
EVIDENCE
↓
CANONICAL RECORD
↓
ALGORITHMS
↓
TRACE GRAPH
↓
MEMORY
↓
DECISION
↓
PRACTICE
↓
OUTCOME
↓
EVIDENCE

The objective is to ensure that the graph, database/record, algorithms, architecture, and user experience do not become separate interpretations of the same person.

## Canonical Information Model

The system must distinguish five different things.

### 1. Evidence

What actually entered the system.

Examples:

User story
User answer
User correction
Observed behavior
Practice event
Self reported outcome
Release verification
Journal entry

Evidence is chronological and must retain provenance.

### 2. Canonical Record

The durable state of the person.

The record is the persistence boundary.

It contains durable objects such as:

PROFILE
HISTORY
EVIDENCE
HYPOTHESES
PRACTICE
OUTCOMES
MEMORY
TRACE STATE
ENTITLEMENTS

The record is the source from which deterministic derived state can be reconstructed.

### 3. Hypothesis

What the intelligence layer currently believes may be true about the user's experience or behavior.

A hypothesis is not a fact.

Lifecycle:

PROPOSED
↓
TESTED
├── CONFIRMED
├── CORRECTED
├── REJECTED
└── UNRESOLVED

A hypothesis must retain:

id
created_at
evidence_ids
candidate_interpretation
alternative_interpretations
algorithm_version
provenance
status
user_response
resolved_at

A hypothesis must never silently become fact.

### 4. Trace Graph

The graph is a relationship projection.

It answers:

WHAT IS CONNECTED TO WHAT?

It does not become a second database.

Derived graph state should be reconstructed from the canonical record whenever possible.

Relationships that cannot be reconstructed from the record may be stored as explicit user-confirmed or otherwise irreducible graph state.

The graph must not independently invent a competing interpretation of the person.

### 5. Memory

Memory is durable learned state.

Memory is not a transcript.

Memory should contain conclusions that have survived sufficient evidence and/or explicit user confirmation.

The preferred flow is:

EVENT
↓
EVIDENCE
↓
INTERPRETATION
↓
USER CONFIRMATION / VERIFICATION
↓
MEMORY

Memory must not be created merely because the system inferred something once.

## Canonical Architecture

```text
                         USER
                          │
                          ▼
                    INTERACTION
                          │
                          ▼
                    EVIDENCE LEDGER
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          SNIFFER      PRACTICE     OBSERVATION
             │            │            │
             ▼            ▼            ▼
        STRUCTURED     EVIDENCE      OUTCOME
         SIGNALS          │            │
             │            └─────┬──────┘
             ▼                  │
        HYPOTHESIS ◄────────────┘
             │
       USER TEST / CORRECTION
             │
             ▼
      CONFIRMED KNOWLEDGE
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     GRAPH MEMORY PATTERN
       │     │     │
       └─────┼─────┘
             ▼
       DECISION ENGINE
             │
             ▼
     NEXT RIGHT PRACTICE
             │
             ▼
       INTERVENTION
             │
             ▼
       NEW OBSERVATION
             │
             └───────────────► EVIDENCE LEDGER
```

## Source of Truth Rules

The following rules are mandatory.

### Rule 1

The Evidence Ledger is the chronological truth about what entered the system.

### Rule 2

The Canonical Record is the durable state.

### Rule 3

The Trace Graph is a relationship projection.

### Rule 4

Hypotheses are reasoning state and are never facts unless independently established or explicitly confirmed by the user.

### Rule 5

Memory is durable learned state and must have an evidence basis.

### Rule 6

Algorithms transform evidence into interpretations, priorities, and decisions.

### Rule 7

The Field visualizes resulting state. It does not become a source of truth.

### Rule 8

Practice records what actually happened. Completion does not equal change.

### Rule 9

Outcome records what changed relative to the user's goal. It must not be inferred solely from completion.

### Rule 10

Every domain has one canonical writer.

No second writer may maintain a competing copy of the same state.

## Practice / Ritual Cutover

The current implementation contains both the newer Practice domain and legacy ritual/day-log state.

The Practice engine explicitly defines:

Protocol = intervention design
Ritual = execution/scheduling
PracticeEvent = actual execution

The legacy ritual record must therefore be treated as transitional.

The cutover requirement is:

```text
LEGACY RITUAL WRITE
        ↓
MIGRATION / COMPATIBILITY
        ↓
CANONICAL PRACTICE WRITE
        ↓
PRACTICE EVENT
        ↓
EVIDENCE
        ↓
TRACE PROJECTION
```

After cutover, the UI must not write two independent ritual histories.

## Evidence Ledger Contract

Every meaningful user interaction that can affect downstream intelligence should produce an evidence record.

Minimum fields:

```yaml
Evidence:
  id
  user_id
  timestamp
  source
  type
  raw_value
  normalized_value
  context
  related_story_id
  related_pattern_id
  related_goal_id
  related_practice_id
  related_outcome_id
  provenance
  algorithm_version
```

The exact schema may evolve, but the following distinction must remain:

USER FACT
SYSTEM OBSERVATION
SYSTEM INFERENCE
USER CONFIRMATION
USER CORRECTION
USER REJECTION
OUTCOME

These must never collapse into one field.

## Story Intelligence Boundary

The Story Sniffer must not write directly to the Trace Graph.

The canonical flow is:

```text
RAW STORY
↓
SNIFFER
↓
STRUCTURED SIGNAL
↓
EVIDENCE
↓
HYPOTHESIS
↓
MIRROR
↓
USER CONFIRM / CORRECT / REJECT
↓
PATTERN
```

The Sniffer may identify candidates.

It does not establish truth.

The existing lexical and authored detection machinery may remain as a component, but it must be treated as sensing rather than final interpretation.

## Hypothesis Contract

Every system interpretation that is not directly stated by the user should be capable of being represented as a hypothesis.

Examples:

Possible pattern
Possible body relationship
Possible behavioral driver
Possible relationship
Possible recurring theme
Possible blocker to a goal

The system should be able to answer:

What evidence produced this?
What alternatives were considered?
What algorithm produced it?
Did the user confirm it?
Did the user correct it?
Did the user reject it?
Did later evidence change it?

## Algorithm Versioning

The graph already carries derivation/version information.

The same principle must extend across the intelligence layer.

Required architecture:

```text
INTELLIGENCE_SCHEMA_VERSION
INTELLIGENCE_ALGORITHM_VERSION

TRACE_ALGORITHM_VERSION
SNIFFER_ALGORITHM_VERSION
HYPOTHESIS_ALGORITHM_VERSION
PATTERN_ALGORITHM_VERSION
MEMORY_ALGORITHM_VERSION
DECISION_ALGORITHM_VERSION
```

A change in algorithm must not be represented as a change in the user.

The system must be able to distinguish:

THE PERSON CHANGED

from:

THE INTERPRETATION RULE CHANGED

## Decision Boundary

The Trace Graph must not decide what the user should do next.

The decision chain is:

```text
EVIDENCE
↓
CURRENT STATE
↓
GRAPH CONTEXT
↓
CONFIRMED PATTERNS
↓
GOALS / BEHAVIOR OBJECTIVES
↓
DECISION ENGINE
↓
NEXT RIGHT PRACTICE
```

The decision engine must expose enough provenance to answer:

Why was this practice selected?

The answer should point back to evidence, pattern, goal, or behavior objective rather than to an opaque score.

## Memory Contract

Memory should answer:

What do we now know about this person that is durable enough to carry forward?

Memory should not simply repeat the user's history.

Candidate memory should move through:

```text
CANDIDATE
↓
EVIDENCE CHECK
↓
CONFIRMATION / REPEATED SUPPORT
↓
MEMORY
```

Memory must retain its evidence basis.

A later contradiction must be capable of reopening or revising memory without rewriting historical evidence.

## Field Contract

The Field is a projection.

```text
CANONICAL RECORD
↓
INTELLIGENCE
↓
CURRENT STATE
↓
FIELD
```

The Field may visualize:

patterns
relationships
practice
change
attention
current state

But the Field must never become the place where those facts are authored independently.

## Information Integrity Acceptance Tests

### Test 1: Story

User submits a story.

Expected:

Story exists as evidence.
Sniffer produces structured candidates.
Hypothesis is created where interpretation is required.
Mirror shows the interpretation.
User can confirm, correct, or reject it.
Correction changes downstream interpretation.
Original evidence remains unchanged.

### Test 2: Release

Confirmed pattern enters release.

Expected:

Pattern is linked to evidence.
Release uses the authoritative release engine.
Verification produces evidence.
No-change verification remains valid.
Field/history reflects the result.

### Test 3: Practice

User completes a ritual.

Expected:

PracticeEvent is created.
Evidence can be attached.
Outcome can be recorded.
Graph can derive the relationship.
No second ritual history is created.

### Test 4: Reload

User reloads the application.

Expected:

Canonical record reloads.
Evidence remains.
Hypothesis state remains.
Practice history remains.
Memory remains.
Graph can be reconstructed.
Field reflects the same underlying state.

### Test 5: Algorithm Change

A derivation algorithm changes.

Expected:

Historical evidence remains unchanged.
Historical user statements remain unchanged.
Algorithm version changes.
Derived interpretations can be identified as having been produced under a different rule set.
The system does not falsely represent the algorithm change as user change.

### Test 6: Contradiction

Later evidence contradicts an earlier interpretation.

Expected:

Earlier evidence remains immutable.
Hypothesis can be reopened or superseded.
Memory can be revised.
Graph relationships update from the canonical state.
Historical interpretation remains attributable to its original evidence and algorithm.

## Remaining Architecture Gaps

The sweep identifies these as unresolved implementation work:

1. Canonical Evidence Ledger implementation.
2. First-class Hypothesis object and lifecycle.
3. Explicit Memory object and evidence basis.
4. Single-writer enforcement across legacy Ritual and Practice.
5. End-to-end intelligence versioning.
6. Decision engine provenance for Next Right Practice.
7. Full Story Sniffer → Evidence → Hypothesis integration.
8. Automated persistence and reload tests across all new domains.
9. Contradiction/revision handling for hypotheses and memory.
10. Final graph projection audit after the above domains are canonical.

These are architecture gaps, not reasons to create another parallel system.

## Updated P0 Sequence

```text
1. CANONICAL EVIDENCE
2. HYPOTHESIS LIFECYCLE
3. MIRROR CONFIRM / CORRECT / REJECT
4. SINGLE WRITER PER DOMAIN
5. RELEASE → VERIFICATION → EVIDENCE
6. PRACTICE → EVIDENCE → OUTCOME
7. GRAPH PROJECTION
8. MEMORY
9. DECISION ENGINE
10. NEXT RIGHT PRACTICE
11. FIELD PROJECTION
12. LONGITUDINAL STATE
```

The objective is not to build these as twelve independent systems.

The objective is to close one continuous information chain.

# AI HANDSHAKE

## Purpose

This document is an implementation handoff.

Do not treat it as a suggestion, summary, or feature wishlist.

The objective is to make the information architecture of ATUNED congruent from user interaction through evidence, canonical persistence, intelligence, graph projection, memory, decision, practice, and outcome.

## Before You Touch Code

Read this entire TDD first.

Then inspect the actual current codebase.

Do not assume that anything described here is already implemented.

For every requirement, determine:

EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED

Documentation is not proof of implementation.

Code is not proof of correctness.

A screen looking correct is not proof that the underlying information chain is correct.

## Canonical Information Principle

The product must maintain one continuous truth:

USER
↓
INTERACTION
↓
EVIDENCE
↓
CANONICAL RECORD
↓
HYPOTHESIS
↓
CONFIRM / CORRECT / REJECT
↓
PATTERN
↓
RELEASE / PRACTICE
↓
VERIFICATION
↓
OUTCOME
↓
MEMORY
↓
DECISION
↓
NEXT PRACTICE

The Trace Graph is a projection across this information.

The Field is a projection of resulting state.

Neither is a replacement for the canonical record.

## Implementation Rule

Before adding anything:

1. Find the existing implementation.
2. Determine whether it already performs the required function.
3. Reuse it when possible.
4. Extend it when necessary.
5. Replace it only when the existing implementation is structurally wrong.
6. Remove or deprecate duplicate paths after migration.
7. Test the resulting canonical path.

Prefer integration over invention.

Do not create:

another Evidence Ledger
another Hypothesis model
another Memory model
another Trace Graph
another Release engine
another Practice history
another Field interpretation engine

unless the audit proves the existing implementation cannot support the requirement.

## Current Priority

The immediate architectural priority is:

```text
EVIDENCE
↓
HYPOTHESIS
↓
CONFIRM / CORRECT
↓
RELEASE / PRACTICE
↓
VERIFICATION
↓
OUTCOME
↓
MEMORY
↓
GRAPH
↓
DECISION
↓
NEXT PRACTICE
```

Do not expand into unrelated features until this information chain is connected and tested.

## Required Audit

Before implementation, produce a requirement map:

| Requirement | Implementation | Status | Evidence |
|---|---|---|---|
| Evidence Ledger | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Hypothesis | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Confirmation | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Correction | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Release | actual production engine | EXISTS/PARTIAL/MISSING | file/function/test |
| Verification | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Practice | canonical writer | EXISTS/PARTIAL/MISSING | file/function/test |
| Outcome | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Memory | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Trace projection | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Decision | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Field projection | actual code path | EXISTS/PARTIAL/MISSING | file/function/test |
| Persistence | actual storage path | EXISTS/PARTIAL/MISSING | file/function/test |
| Reload | end-to-end test | EXISTS/PARTIAL/MISSING | test |
| Versioning | actual implementation | EXISTS/PARTIAL/MISSING | file/function/test |

Do not mark EXISTS because the TDD describes it.

## Required Final Report

When implementation is complete, report:

### IMPLEMENTED

What was actually completed.

### TESTED

What was actually tested and how.

### UNVERIFIED

Anything that could not be proven.

### BLOCKED

Anything preventing completion.

### CONFLICTS

Any conflict between:

TDD
code
schema
runtime
build
tests
graph
database
algorithms
UI

### REMAINING GAPS

Only unresolved gaps.

### NEXT PRIORITY

The single highest-value next implementation step.

## Final Rule

Do not declare success because the graph looks complete.

Do not declare success because the database stores the objects.

Do not declare success because the algorithms exist.

Do not declare success because the UI displays the result.

Declare success only when the same piece of user information can be traced:

```text
USER
→ EVIDENCE
→ RECORD
→ ALGORITHM
→ HYPOTHESIS
→ CONFIRMATION
→ GRAPH
→ DECISION
→ PRACTICE
→ OUTCOME
→ MEMORY
→ FIELD
```

and back to new evidence without creating competing truths.

The goal is not to make the architecture appear coherent.

The goal is to make the information actually flow coherently through the system.
