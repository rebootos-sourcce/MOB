# Atüned Becoming System

## Technical Design Document (TDD) --- Implementation Handoff

**Product:** Atüned\
**System:** Becoming / Avatar / Purpose / Boundary / Ritual / Sniffer /
Integrity / Regulation\
**Status:** Architecture specification and implementation handoff\
**Audience:** Engineering AI, product AI, technical designer\
**Purpose:** Define the complete architecture sufficiently for the next
AI to inspect the existing application, map requirements to existing
components, identify gaps, and implement without inventing or
duplicating systems.

------------------------------------------------------------------------

# 1. Executive Summary

Atüned is a transformation system centered on a user-defined identity:

> **Who do I want to become?**

The user defines the person they want to become and the person they do
not want to be. Atüned then operationalizes that definition through
Purpose, Values, Boundaries, Non-Negotiables, Rituals, Practice Events,
Journal observations, Evidence, Integrity, Regulation, Pattern
intelligence, and adaptive Protocols.

The core loop is:

``` text
IDENTITY
→ PURPOSE
→ VALUES
→ BOUNDARY
→ NON-NEGOTIABLES
→ PRACTICE
→ EVIDENCE
→ INTEGRITY
→ REGULATION
→ PATTERN INTELLIGENCE
→ ADAPTATION
→ EMBODIMENT
→ IDENTITY
```

The Trace Graph connects the entire loop.

The Avatar is the **north-star identity specification**.

Evidence is the **authority for claims about what actually happened**.

The Sniffer is the **intelligence layer** that detects relationships,
recurrence, contradiction, boundary conflicts, integrity gaps, and
candidate patterns.

The system must preserve the distinction between:

-   user intention
-   AI inference
-   user confirmation
-   observed behavior
-   evidence
-   outcome

The existing Atüned systems remain authoritative where they already
provide the required capability. Do not create parallel implementations.

------------------------------------------------------------------------

# 2. Implementation Directive

This document is a specification. It does **not** establish that any
component already exists.

Before coding, the implementation AI must audit the repository and
classify every requirement as exactly one of:

``` text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

For each requirement, report:

``` text
Requirement
Status
Existing file/component
Existing data model
Existing API/state
Dependencies
Required modification
Migration required
Tests required
```

Do not assume documentation equals implementation.

Do not create duplicate systems when an equivalent Atüned system already
exists.

Existing systems that must be inspected first include:

-   Trace Graph
-   Pattern system
-   Sniffer
-   Release system
-   Reframe system
-   Ritual system
-   Journal
-   Evidence
-   Persistence
-   Synchronization
-   AI Handshake
-   Versioning
-   User record
-   Entitlement boundaries

------------------------------------------------------------------------

# 3. Fundamental Semantic Model

These concepts are distinct and must not be collapsed.

  -----------------------------------------------------------------------
  Concept                             Definition
  ----------------------------------- -----------------------------------
  Avatar                              Who I am becoming

  Purpose                             Why that person exists / what that
                                      person is for

  Values                              What matters to that person

  Boundary                            What protects what matters

  Non-Negotiable                      A user-defined commitment
                                      expressing a boundary

  Protocol                            The intervention design

  Ritual                              The scheduled/repeated execution of
                                      a protocol

  PracticeEvent                       What actually happened during
                                      execution

  Journal                             User observation and reflection

  Evidence                            What the system can reasonably
                                      support as having occurred

  Pattern                             A recurring mechanism that supports
                                      or obstructs change

  Integrity                           Alignment between declared
                                      identity/values and observed
                                      behavior

  Regulation                          Current state/signals of the
                                      person/system

  Sniffer                             Intelligence that detects
                                      relationships, recurrence,
                                      conflicts, and candidates

  Outcome                             Observable change relative to an
                                      intended result

  Trace Graph                         Persistent relationship model
                                      connecting the system
  -----------------------------------------------------------------------

Critical distinctions:

``` text
Avatar ≠ current identity
Avatar = intended identity
```

``` text
Ritual completion ≠ transformation
```

``` text
Feeling better ≠ behavioral change
```

``` text
Pattern inference ≠ confirmed pattern
```

``` text
Regulation state ≠ laboratory measurement of spiritual energy
```

``` text
Declared integrity ≠ demonstrated integrity
```

------------------------------------------------------------------------

# 4. Canonical Transformation Loop

``` text
                         WHO
                      ┌────────┐
                      │ AVATAR │
                      └───┬────┘
                          │
                         WHY
                          │
                     ┌────▼────┐
                     │ PURPOSE │
                     └────┬────┘
                          │
                        WHAT
                          │
                     ┌────▼────┐
                     │ VALUES  │
                     └────┬────┘
                          │
                       PROTECT
                          │
                     ┌────▼─────┐
                     │ BOUNDARY │
                     └────┬─────┘
                          │
                       EXPRESS
                          │
                  ┌───────▼────────┐
                  │ NON-NEGOTIABLE │
                  └───────┬────────┘
                          │
                        TRAIN
                          │
                     ┌────▼────┐
                     │ RITUAL  │
                     └────┬────┘
                          │
                       PRACTICE
                          │
                  ┌───────▼────────┐
                  │ PRACTICE EVENT │
                  └───────┬────────┘
                          │
                       OBSERVE
                          │
                     ┌────▼────┐
                     │ JOURNAL │
                     └────┬────┘
                          │
                       EVIDENCE
                          │
                     ┌────▼────┐
                     │ SNIFFER │
                     └────┬────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          PATTERN      INTEGRITY   REGULATION
             │            │            │
             └────────────┼────────────┘
                          ▼
                     ADAPTATION
                          │
                          ▼
                 RELEASE / REFRAME /
                 CONDITION / EMBODY
                          │
                          ▼
                       PRACTICE
                          │
                          ▼
                       BECOME
                          │
                          └──────────► AVATAR
```

------------------------------------------------------------------------

# 5. Existing Architecture to Preserve

The new Becoming system extends the existing Atüned architecture.

Do not create:

-   a second Trace Graph
-   a second Release Engine
-   a second Pattern ontology
-   a second Evidence model
-   a second persistence architecture
-   a parallel Ritual engine
-   a competing Value ontology

Where existing infrastructure satisfies the requirement, integrate with
it.

------------------------------------------------------------------------

# 6. Avatar System

## 6.1 Purpose

The Avatar page defines:

> **Who I am becoming.**

and:

> **Who I am not becoming.**

The user owns this definition.

AI may:

-   structure language
-   identify possible attributes
-   suggest missing dimensions
-   connect existing concepts

AI must not silently invent the user's identity.

## 6.2 Avatar Schema

``` yaml
Avatar:
  id: string
  user_id: string

  name: string
  title: string|null
  description: string

  becoming:
    qualities: []
    values: []
    beliefs: []
    behaviors: []
    communication: []
    relationships: []
    embodiment: []
    contribution: []

  not_becoming:
    qualities: []
    beliefs: []
    behaviors: []
    patterns: []
    conditions: []

  version: integer

  status:
    draft
    active
    archived

  created_at: datetime
  updated_at: datetime
```

## 6.3 Avatar as Sniffer Input

Avatar-defined requirements receive elevated relevance during pattern
detection.

Example:

``` text
Avatar:
"I speak directly and honestly."

Journal:
"I avoided telling them what I actually wanted."

Sniffer:
Possible identity conflict.

Candidate patterns:
- avoidance
- fear of conflict
- people-pleasing
- suppression
```

User confirmation rules determine whether a candidate becomes a
canonical Pattern.

### Weighting principle

``` text
Avatar-defined requirement
>
user-confirmed pattern
>
strong behavioral evidence
>
repeated contextual evidence
>
AI inference
>
generic pattern association
```

Exact numeric weighting must remain configurable.

The system must preserve the reason for a weighting decision.

------------------------------------------------------------------------

# 7. Purpose System

Purpose has two facets.

## 7.1 Downward Triangle --- Material / Ego / Embodied Self

Three primary values representing what the user needs materially or
physically.

Examples:

-   health
-   wealth
-   stability
-   family

The center of the downward triangle is:

> **Material Purpose**

Question:

> What does this self need in order to function, sustain itself, and
> fulfill its worldly responsibilities?

## 7.2 Upward Triangle --- Spiritual / Universal Self

Three primary values representing what the user embodies, contributes,
or projects spiritually/universally.

Examples:

-   wisdom
-   compassion
-   love
-   teaching
-   contribution

The center of the upward triangle is:

> **Spiritual Purpose**

Question:

> What does this self embody or contribute to the world?

------------------------------------------------------------------------

# 8. Unified Purpose

The two purposes must be combinable.

``` text
Material Purpose
       +
Spiritual Purpose
       ↓
Unified Purpose
```

Example:

``` text
Material:
Create health, stability, and security for my family.

Spiritual:
Develop wisdom and compassion and use them to serve others.

Unified:
Create a stable life that gives me the capacity to help others.
```

The Unified Purpose becomes a bridge between Avatar, Values, and
Boundary.

## 8.1 Purpose Schema

``` yaml
Purpose:
  id: string
  avatar_id: string

  material:
    values:
      - value_id
      - value_id
      - value_id
    purpose: string

  spiritual:
    values:
      - value_id
      - value_id
      - value_id
    purpose: string

  unified:
    purpose: string

  version: integer
  created_at: datetime
  updated_at: datetime
```

Use the existing Atüned Value ontology if available.

------------------------------------------------------------------------

# 9. Boundary System

The two Purpose triangles conceptually overlay into a six-faceted
Boundary.

Six domains:

1.  Self
2.  Relationship
3.  Family
4.  Friends
5.  Work / Co-workers
6.  Community

Each domain contains five user-defined non-negotiables by default.

The default count must remain configurable for future product needs.

## 9.1 Boundary Geometry

``` text
                    SELF
                 /       \
             FAMILY     RELATIONSHIP
             |             |
          COMMUNITY       FRIENDS
                 \       /
                    WORK
```

Each facet exposes its own non-negotiables.

## 9.2 Boundary Schema

``` yaml
Boundary:
  id: string
  user_id: string
  purpose_id: string

  domains:
    self:
      non_negotiables: []

    relationship:
      non_negotiables: []

    family:
      non_negotiables: []

    friends:
      non_negotiables: []

    work:
      non_negotiables: []

    community:
      non_negotiables: []

  version: integer

  status:
    draft
    active
    archived

  created_at: datetime
  updated_at: datetime
```

------------------------------------------------------------------------

# 10. Non-Negotiables

A Non-Negotiable converts a Boundary into an observable commitment.

``` yaml
NonNegotiable:
  id: string
  boundary_id: string

  domain: string

  statement: string
  behavior: string

  priority: integer

  state:
    defined
    active
    tested
    established

  evidence_ids: []
  violation_ids: []

  created_at: datetime
  updated_at: datetime
```

The user defines the actual meaning.

AI can suggest language but cannot silently establish a boundary.

## 10.1 State Model

``` text
DEFINED
   ↓
ACTIVE
   ↓
TESTED
   ↓
ESTABLISHED
```

-   **Defined:** user has stated it.
-   **Active:** user is currently practicing it.
-   **Tested:** real-world evidence exists.
-   **Established:** longitudinal evidence indicates reliable
    maintenance.

"Established" requires evidence.

------------------------------------------------------------------------

# 11. Journal Integration

The Journal is an intelligence input.

Journal entries may produce:

-   observations
-   behaviors
-   emotions
-   beliefs
-   decisions
-   context
-   boundary signals
-   integrity signals
-   pattern candidates
-   evidence

AI-generated interpretations do not automatically become facts.

A candidate relationship may require:

-   user confirmation
-   corroborating evidence
-   repeated observation
-   existing confirmed relationship

depending on the relationship type.

------------------------------------------------------------------------

# 12. Sniffer System

The Sniffer is the intelligence layer.

It inspects:

``` text
Avatar
Purpose
Values
Boundary
Non-Negotiables
Journal
Practice Events
Evidence
Existing Patterns
Ritual history
Integrity assessments
Context
Regulation signals
```

It searches for:

``` text
recurrence
contradiction
boundary conflict
identity conflict
behavioral repetition
context transfer
context failure
integrity gap
successful alignment
pattern activation
pattern reduction
emerging pattern
```

## 12.1 Sniffer Pipeline

``` text
INPUT
 ↓
PARSE
 ↓
EXTRACT SIGNALS
 ↓
CLASSIFY
 ↓
MATCH AGAINST USER MODEL
 ↓
WEIGHT RELATIONSHIPS
 ↓
SEARCH TRACE GRAPH
 ↓
GENERATE CANDIDATES
 ↓
ASSESS CONFIDENCE
 ↓
USER CONFIRMATION WHEN REQUIRED
 ↓
UPDATE GRAPH
 ↓
PROPOSE INTERVENTION
```

## 12.2 Sniffer Algorithm

``` text
function sniff(input):

    signals = extractSignals(input)

    compare signals against:
        avatar.becoming
        avatar.not_becoming
        purpose
        values
        boundaries
        non_negotiables
        existing_patterns
        prior_evidence

    candidates = []

    detect:
        identity_alignment
        identity_conflict
        boundary_candidate
        integrity_candidate
        recurring_behavior
        contextual_pattern
        regulation_signal
        successful_behavior
        failed_behavior

    for candidate in candidates:

        calculate:
            relevance
            recurrence
            evidence_strength
            avatar_weight
            boundary_weight
            contextual_weight
            recent_activation
            historical_persistence

        preserve rationale

    return candidates
```

------------------------------------------------------------------------

# 13. Pattern Candidate

``` yaml
PatternCandidate:
  id: string

  source:
    journal
    practice
    evidence
    avatar
    boundary
    context
    system

  description: string

  supporting_evidence: []
  conflicting_evidence: []

  relevance: number
  confidence: number

  status:
    proposed
    confirmed
    rejected

  rationale: []

  created_at: datetime
```

A candidate becomes a canonical Pattern according to the existing
Pattern confirmation model.

Do not duplicate the existing Pattern system.

------------------------------------------------------------------------

# 14. Protocol System

The Becoming system uses the existing Protocol/Release/Reframe
architecture where available.

Protocol classes:

``` text
RELEASE
REFRAME
BEHAVIORAL_CONDITIONING
INTEGRITY_CONDITIONING
EMBODIMENT
OBSERVATION
CUSTOM
```

Protocol answers:

> What are we going to do about this?

Ritual answers:

> When/how will we practice it?

------------------------------------------------------------------------

# 15. Release Integration

The existing Release system remains authoritative.

``` text
Becoming Pattern
       ↓
Release Protocol
       ↓
Existing Release Engine
```

Do not duplicate:

-   Release Session
-   Release Pattern
-   Release Event
-   Release Queue
-   release verification
-   somatic release infrastructure

------------------------------------------------------------------------

# 16. Ritual Builder

Ritual is the execution layer.

``` text
Protocol = What / Why / How
Ritual = When
PracticeEvent = What actually happened
```

Rituals may be connected to:

-   Avatar
-   Purpose
-   Value
-   Boundary
-   Non-Negotiable
-   Pattern
-   Protocol
-   Chakra/domain
-   Practice Event

## 16.1 Ritual Schema

``` yaml
Ritual:
  id: string

  avatar_id: string
  protocol_id: string|null

  domain: string
  chakra: string|null

  elements:
    - element_id

  cadence: string
  duration: integer|null

  active: boolean

  created_at: datetime
  updated_at: datetime
```

## 16.2 Ritual Element

``` yaml
RitualElement:
  id: string
  ritual_id: string

  type:
    release
    reframe
    behavioral_conditioning
    integrity_conditioning
    embodiment
    observation

  instruction: string

  target_patterns: []
  target_behaviors: []
  target_boundaries: []

  evidence_required: boolean

  order: integer
```

------------------------------------------------------------------------

# 17. Avatar Ritual Visualization

The Avatar page should visually show connected Ritual Elements as small
ticks/dots.

Example:

``` text
HEART

● ● ● ● ● ● ●
```

Each marker corresponds to an actual Ritual Element.

Color indicates intervention type.

Conceptual types:

``` text
RELEASE
REFRAME
BEHAVIOR
INTEGRITY
EMBODIMENT
OBSERVATION
```

The exact colors belong to the product visual design system.

Markers must be clickable.

Navigation:

``` text
Avatar
 → Chakra / Domain
 → Ritual Element
 → Ritual
 → Protocol
 → Practice
```

The visual should communicate:

> What work is currently associated with becoming this person?

------------------------------------------------------------------------

# 18. Regulation System

Regulation is a **state layer**, not an identity layer.

Possible states:

``` text
UPREGULATED
REGULATED
TRANSITIONAL
DOWNREGULATED
UNKNOWN
```

It can be associated with:

-   chakra
-   domain
-   context
-   behavior
-   somatic signal
-   journal observation
-   practice event

## 18.1 Regulation Schema

``` yaml
RegulationState:
  id: string
  user_id: string

  domain: string
  chakra: string|null

  state:
    upregulated
    regulated
    transitional
    downregulated
    unknown

  signals:
    behavioral: []
    somatic: []
    emotional: []
    contextual: []

  evidence_ids: []

  confidence: number

  timestamp: datetime
```

### Critical rule

Do not manufacture false numerical precision.

Do not represent a subjective/spiritual construct as a laboratory-grade
measurement.

The user's vital-energy/Kundalini framework may be represented as part
of the conceptual experience, while the system separately records
observable signals and evidence.

Preferred:

> "Recent evidence suggests increased regulation in this domain."

Avoid unsupported statements such as:

> "Your Kundalini is 73% activated."

------------------------------------------------------------------------

# 19. Integrity System

Integrity is the bridge between:

``` text
WHO I SAY I AM
```

and:

``` text
WHAT I ACTUALLY DO
```

Compare:

``` text
Avatar
+
Values
+
Purpose
+
Boundary
+
Non-Negotiables
```

against:

``` text
Observed behavior
Practice Events
Journal
Evidence
Context
```

## 19.1 Integrity Schema

``` yaml
IntegrityAssessment:
  id: string

  avatar_id: string
  purpose_id: string|null
  boundary_id: string|null
  non_negotiable_id: string|null

  intended_behavior: string
  observed_behavior: string

  alignment:
    aligned
    partially_aligned
    misaligned
    unclear

  evidence_ids: []

  context: string
  timestamp: datetime

  confidence: number
```

## 19.2 Integrity Algorithm

``` text
function assessIntegrity(event):

    intended = retrieveRelevantIntent(
        avatar,
        purpose,
        values,
        boundary,
        non_negotiables
    )

    observed = extractObservedBehavior(event)

    evidence = retrieveEvidence(event)

    compare(intended, observed)

    classify:
        aligned
        partially_aligned
        misaligned
        unclear

    attach:
        evidence
        context
        timestamp

    return assessment
```

The system must not moralize.

Misalignment is information for learning and adaptation.

------------------------------------------------------------------------

# 20. Practice Event

Practice execution must be independently recorded.

``` yaml
PracticeEvent:
  id: string
  user_id: string

  ritual_id: string
  protocol_id: string

  scheduled_at: datetime
  started_at: datetime|null
  completed_at: datetime|null

  status:
    scheduled
    available
    started
    partial
    completed
    skipped
    missed
    interrupted

  steps_completed: integer
  steps_expected: integer

  evidence_ids: []
  outcome_id: string|null

  created_at: datetime
  updated_at: datetime
```

Completion does not prove transformation.

------------------------------------------------------------------------

# 21. Effect vs Affect

Maintain two distinct dimensions.

## Effect

What changed?

Examples:

-   behavior
-   decision
-   relationship
-   performance
-   pattern intensity
-   goal progress

## Affect

How did the experience feel?

Examples:

-   ease
-   resistance
-   energy
-   confidence
-   emotional state
-   connectedness

Possible result:

``` text
Effect: high
Affect: low
```

Meaning: useful result, difficult experience.

Or:

``` text
Effect: low
Affect: high
```

Meaning: positive experience, little observable change.

Both are valuable.

------------------------------------------------------------------------

# 22. Evidence

Evidence is the authority for claims.

``` yaml
Evidence:
  id: string
  user_id: string

  source:
    user
    system
    observation
    behavioral_event
    outcome

  type:
    internal
    behavioral
    contextual
    outcome
    negative

  timestamp: datetime

  context: string|null

  pattern_id: string|null
  protocol_id: string|null
  ritual_id: string|null
  goal_id: string|null

  metric: string|null
  value: string|number|null
  unit: string|null

  before: string|number|null
  after: string|number|null
  later: string|number|null

  confidence: number|null
  notes: string|null
```

Negative evidence must be supported as a first-class concept.

------------------------------------------------------------------------

# 23. Outcome

``` yaml
Outcome:
  id: string
  goal_id: string

  timestamp: datetime

  metric: string

  before: number|string|null
  current: number|string|null
  target: number|string|null

  status:
    improved
    unchanged
    worsened
    unclear

  evidence_ids: []

  notes: string|null
```

Do not infer "resolved" merely because a ritual was completed.

------------------------------------------------------------------------

# 24. Trace Graph

The Trace Graph remains the authoritative relationship layer.

## 24.1 Minimum Node Types

``` text
avatar
purpose
value
boundary
non_negotiable
goal
behavior
pattern
protocol
ritual
ritual_element
practice_event
journal_event
observation
evidence
outcome
integrity_assessment
regulation_state
context
release
reframe
```

## 24.2 Minimum Edge Types

``` text
defines
expresses
supports
protects
requires
obstructs
targets
addresses
implements
executes
produces
measures
violates
informs
contradicts
reinforces
replaces
precedes
follows
occurs_in
transfers_to
```

Avoid generic `related_to` when a semantic relationship is known.

## 24.3 Canonical Relationships

``` text
AVATAR
 ├── defines → VALUES
 ├── defines → BEHAVIORS
 ├── excludes → PATTERNS
 └── requires → OUTCOMES

PURPOSE
 ├── expresses → VALUES
 └── supports → AVATAR

BOUNDARY
 ├── protects → VALUES
 └── contains → NON_NEGOTIABLES

NON_NEGOTIABLE
 ├── requires → BEHAVIOR
 ├── practiced_by → RITUAL
 └── violated_by → JOURNAL_EVENT

JOURNAL_EVENT
 ├── produces → EVIDENCE
 ├── suggests → PATTERN
 └── informs → INTEGRITY

PATTERN
 ├── obstructs → AVATAR
 ├── addressed_by → PROTOCOL
 └── supported_by → EVIDENCE

PROTOCOL
 └── executed_by → RITUAL

RITUAL
 └── produces → PRACTICE_EVENT

PRACTICE_EVENT
 ├── produces → EVIDENCE
 └── informs → REGULATION

EVIDENCE
 ├── informs → INTEGRITY
 ├── supports → PATTERN
 └── supports → OUTCOME

OUTCOME
 └── measures → GOAL
```

------------------------------------------------------------------------

# 25. AI Handshake

Every AI-generated intervention must carry epistemic status.

``` yaml
AIHandshake:
  contract_version: string

  known: []
  inferred: []
  proposed: []
  user_confirmed: []
  observed: []

  rationale: []

  evidence: []

  uncertainty: []

  constraints: []

  proposed_changes: []

  requires_user_confirmation: boolean
```

Never collapse:

``` text
INFERRED
```

into:

``` text
KNOWN
```

------------------------------------------------------------------------

# 26. Adaptive Accountability

A missed Ritual is not automatically a motivational failure.

Possible causes:

``` text
wrong_time
too_long
too_difficult
unclear_purpose
low_relevance
environment
forgot
resistance
goal_changed
protocol_mismatch
unknown
```

Possible adaptations:

``` text
shorten
reschedule
change_condition
reduce_difficulty
increase_difficulty
change_protocol
pause
replace
investigate_pattern
```

The user decides whether to accept an adaptation.

## Accountability State Machine

``` text
SCHEDULED
    ↓
AVAILABLE
    ↓
STARTED
    ├── INTERRUPTED
    ├── PARTIAL
    └── COMPLETED
             ↓
          VERIFIED
             ↓
          EVIDENCE
             ↓
           OUTCOME
             ↓
         ADAPTATION
```

Miss path:

``` text
SCHEDULED
    ↓
MISSED
    ↓
MISS_THRESHOLD
    ↓
INVESTIGATE
    ↓
ADAPT
```

------------------------------------------------------------------------

# 27. Adaptation Algorithm

``` text
PRACTICE
 ↓
EVIDENCE
 ↓
OUTCOME
 ↓
EVALUATE
```

Classify:

``` text
effective
partially_effective
ineffective
unclear
```

Then:

``` text
effective
 → continue / progress

partially_effective
 → modify

ineffective
 → investigate / replace

unclear
 → gather evidence
```

------------------------------------------------------------------------

# 28. Context Transfer

A behavior that works in one context is not necessarily integrated.

Test transfer across contexts:

``` text
HOME
 ↓
WORK
 ↓
RELATIONSHIP
 ↓
SOCIAL
 ↓
HIGH PRESSURE
```

Record:

``` text
context
behavior
evidence
outcome
regulation
```

The Sniffer uses this information to determine whether behavior has
generalized.

------------------------------------------------------------------------

# 29. Avatar Page UX

The Avatar page should not look like a conventional profile.

It is a **living becoming map**.

## Layer A --- Identity

``` text
WHO I AM BECOMING
```

Avatar representation and editable identity definition.

## Layer B --- Purpose

``` text
MATERIAL PURPOSE
SPIRITUAL PURPOSE
UNIFIED PURPOSE
```

## Layer C --- Boundary

Six facets:

``` text
SELF
RELATIONSHIP
FAMILY
FRIENDS
WORK
COMMUNITY
```

## Layer D --- Alignment

``` text
REGULATION
INTEGRITY
ACTIVE PATTERNS
```

## Layer E --- Practice

Colored ritual markers:

``` text
RELEASE
REFRAME
BEHAVIOR
INTEGRITY
EMBODIMENT
OBSERVATION
```

The page should answer:

> Who am I becoming?

> Why?

> What protects that identity?

> What am I practicing?

> What is currently obstructing me?

> What evidence shows change?

------------------------------------------------------------------------

# 30. Information Architecture

Logical navigation:

``` text
DISCOVER
├── Story
├── Patterns
└── Trace

BECOME
├── Avatar
├── Purpose
├── Boundary
└── Integrity

PRACTICE
├── Today
├── Rituals
├── Protocols
└── Release

REFLECT
├── Journal
├── Evidence
└── Change

INTELLIGENCE
├── Sniffer
├── Regulation
└── Insights
```

The user-facing experience should remain simpler than the underlying
architecture.

Primary experience:

``` text
WHO AM I BECOMING?
        ↓
WHY?
        ↓
WHAT MATTERS?
        ↓
WHAT MUST I PROTECT?
        ↓
WHAT MUST I PRACTICE?
        ↓
WHAT HAPPENED?
        ↓
WHAT DID I LEARN?
        ↓
WHAT CHANGES NEXT?
```

------------------------------------------------------------------------

# 31. Domain State Machines

## Avatar

``` text
DRAFT
 ↓
DEFINED
 ↓
ACTIVE
 ↓
EVOLVING
 ↓
INTEGRATED
```

## Boundary

``` text
DEFINED
 ↓
ACTIVE
 ↓
TESTED
 ↓
ESTABLISHED
```

## Pattern

``` text
CANDIDATE
 ↓
CONFIRMED
 ↓
ACTIVE
 ↓
REDUCING
 ↓
INACTIVE
 ↓
RESOLVED / REPLACED
```

## Protocol

``` text
PROPOSED
 ↓
ACCEPTED
 ↓
ACTIVE
 ↓
EVALUATING
 ├── EFFECTIVE → PROGRESS
 ├── INEFFECTIVE → ADAPT
 └── INAPPROPRIATE → REPLACE
```

------------------------------------------------------------------------

# 32. Persistence

Initial implementation should extend existing versioned user persistence
where appropriate.

Conceptual state:

``` text
user_record
 ├── avatars[]
 ├── purposes[]
 ├── boundaries[]
 ├── non_negotiables[]
 ├── rituals[]
 ├── practice_events[]
 ├── evidence[]
 ├── integrity_assessments[]
 ├── regulation_states[]
 └── outcomes[]
```

Do not place personal Practice data into product Canon.

Do not place payment credentials into Practice objects.

Historical Practice Events must remain immutable against later Protocol
changes.

------------------------------------------------------------------------

# 33. Versioning

Version:

-   Avatar
-   Purpose
-   Boundary
-   Protocol
-   Ritual where necessary
-   AI-generated proposals
-   schemas/contracts
-   algorithms where results depend on algorithm version

AI-generated objects should record:

``` yaml
generated_by:
  system: string
  model_version: string
  timestamp: datetime

approved_by:
  user: boolean
```

When a Protocol changes:

``` text
Protocol v1
→ historical PracticeEvents remain v1
```

Future instances use:

``` text
Protocol v2
```

Do not silently mutate historical execution records.

------------------------------------------------------------------------

# 34. Events

Meaningful state transitions should emit events.

Minimum:

``` text
AVATAR_CREATED
AVATAR_UPDATED
AVATAR_ACTIVATED
AVATAR_VERSIONED

PURPOSE_CREATED
PURPOSE_UPDATED

BOUNDARY_CREATED
BOUNDARY_UPDATED
BOUNDARY_ACTIVATED

NON_NEGOTIABLE_DEFINED
NON_NEGOTIABLE_ACTIVATED
NON_NEGOTIABLE_TESTED
NON_NEGOTIABLE_ESTABLISHED

PROTOCOL_GENERATED
PROTOCOL_ACCEPTED
PROTOCOL_REJECTED
PROTOCOL_MODIFIED
PROTOCOL_VERSIONED
PROTOCOL_ADAPTED

RITUAL_CREATED
RITUAL_STARTED
RITUAL_COMPLETED
RITUAL_SKIPPED
RITUAL_MISSED
RITUAL_RESCHEDULED

PRACTICE_STARTED
PRACTICE_PARTIAL
PRACTICE_COMPLETED
PRACTICE_INTERRUPTED

JOURNAL_EVENT_RECORDED
EVIDENCE_RECORDED
OUTCOME_RECORDED

PATTERN_CANDIDATE_CREATED
PATTERN_CONFIRMED
PATTERN_REJECTED

BOUNDARY_VIOLATION_CANDIDATE
INTEGRITY_ASSESSED

REGULATION_SIGNAL_RECORDED
CONTEXT_TRANSFERRED
```

Events provide the audit trail and feed the Trace Graph.

------------------------------------------------------------------------

# 35. Analytics

Do not optimize solely for Ritual completion.

Track:

``` text
Avatar completion
Purpose completion
Boundary completion
Non-negotiable activation
Protocol acceptance
First practice
Practice completion
Partial completion
Miss rate
Evidence capture
Outcome capture
Integrity assessments
Pattern recurrence
Pattern reduction
Context transfer
Protocol adaptation
Behavior improvement
Goal progress
30-day retention
60-day retention
90-day retention
```

Primary product metric:

> **Observed meaningful change per unit of practice.**

Secondary metric:

> **Degree to which observed behavior increasingly resembles the user's
> defined Avatar.**

------------------------------------------------------------------------

# 36. Testing Requirements

## Schema tests

Validate:

-   required fields
-   enums
-   references
-   malformed objects
-   versioning
-   ownership

## State tests

Test:

``` text
create
activate
pause
resume
complete
skip
miss
adapt
archive
version
```

## Sniffer tests

Test:

``` text
direct match
weak inference
strong evidence
contradictory evidence
repeated pattern
boundary candidate
identity conflict
context transfer
false positive
user rejection
user confirmation
```

## Trace Graph tests

Test:

``` text
node creation
edge creation
edge removal
relationship integrity
orphan detection
cycle handling
version consistency
```

## Protocol tests

Test:

``` text
generate
accept
reject
edit
version
execute
adapt
progress
regress
replace
```

## Evidence tests

Test:

``` text
before
during
after
later
negative evidence
context transfer
conflicting evidence
```

## Persistence tests

Test:

``` text
reload
browser close
offline
sync
conflict
migration
rollback
schema upgrade
```

## Longitudinal tests

Test:

``` text
30 days
60 days
90 days
recurrence
replacement
integration
outcome
context transfer
```

------------------------------------------------------------------------

# 37. Critical End-to-End Scenario

Input:

``` text
Avatar:
"I communicate honestly."

Boundary:
"I do not suppress important concerns."

Journal:
"I didn't tell them because I was afraid of conflict."
```

Expected:

``` text
possible boundary conflict
possible identity misalignment
candidate pattern
candidate protocol
```

Possible protocol:

``` text
Release
+
Reframe
+
Behavioral Conditioning
+
Integrity Conditioning
```

The system must **not** automatically conclude:

``` text
confirmed pattern
moral failure
resolved issue
```

without appropriate evidence/confirmation.

------------------------------------------------------------------------

# 38. Example Full Trace

``` text
USER:
"I want to become someone who speaks directly."

AVATAR:
becoming.behavior = direct communication

BOUNDARY:
relationship.non_negotiable =
"Address important concerns directly."

RITUAL:
behavioral conditioning =
"State the concern in one clear sentence."

JOURNAL:
"I avoided the conversation."

SNIFFER:
candidate = avoidance

USER:
confirms

PATTERN:
avoidance

PROTOCOL:
release + reframe + behavioral conditioning

PRACTICE:
conversation attempted

EVIDENCE:
"I stated the concern directly."

INTEGRITY:
partially_aligned

REGULATION:
transitional

OUTCOME:
communication behavior improved

TRACE GRAPH:
all relationships persisted
```

------------------------------------------------------------------------

# 39. UX Principles

1.  User defines identity.
2.  User defines boundaries.
3.  User defines meaning.
4.  AI structures and assists.
5.  Evidence supports claims.
6.  Complexity stays behind the interface.
7.  Every visual relationship should have a semantic meaning.
8.  Every AI inference should be traceable.
9.  Every intervention should have a reason.
10. Every outcome should have evidence where practical.
11. Never shame the user for a missed practice.
12. Never confuse subjective state with objective measurement.
13. Do not force the user to understand the underlying graph.
14. Keep the primary path simple.

------------------------------------------------------------------------

# 40. Non-Negotiable Architectural Rules

1.  **Avatar is the desired identity specification.**
2.  **Purpose explains why the identity matters.**
3.  **Values define what matters.**
4.  **Boundary defines what protects what matters.**
5.  **Non-Negotiables convert boundaries into observable commitments.**
6.  **Protocol defines intervention design.**
7.  **Ritual provides repeated practice.**
8.  **PracticeEvent records actual execution.**
9.  **Journal records human observation.**
10. **Evidence determines what can reasonably be claimed.**
11. **Integrity compares declared identity/value with observed
    behavior.**
12. **Regulation describes state, not identity.**
13. **Sniffer identifies relationships, recurrence, conflicts, and
    candidates.**
14. **AI inference must remain distinguishable from confirmed fact.**
15. **User-defined boundaries remain user-owned.**
16. **Existing Trace Graph remains authoritative.**
17. **Do not build a second intelligence graph.**
18. **Do not duplicate the Release Engine.**
19. **Do not treat Ritual completion as proof of transformation.**
20. **Do not treat a missed Ritual as a motivational failure.**
21. **Do not manufacture numerical precision for spiritual or subjective
    states.**
22. **Historical PracticeEvents remain immutable against later Protocol
    edits.**
23. **The system proposes; the user decides.**
24. **The system optimizes for meaningful change, not streak length.**
25. **Important AI conclusions must be traceable to evidence and/or
    explicit user input.**

------------------------------------------------------------------------

# 41. Build Order

## P0 --- Foundation

Implement or verify:

``` text
Avatar
Purpose
Value references
Boundary
Non-Negotiable
Trace Graph relationships
versioning
persistence
AI Handshake
```

## P1 --- Practice

``` text
Ritual integration
Protocol integration
Ritual Elements
Practice Events
Journal integration
Evidence
```

## P2 --- Intelligence

``` text
Sniffer
Pattern candidates
Pattern weighting
Boundary detection
Integrity engine
Adaptive protocols
```

## P3 --- Regulation

``` text
RegulationState
chakra/domain relationships
state evidence
regulation visualization
```

## P4 --- Longitudinal Intelligence

``` text
context transfer
pattern reduction
behavior generalization
protocol effectiveness
30/60/90-day change
Avatar evolution
```

------------------------------------------------------------------------

# 42. Required Initial Engineering Workflow

The next AI must perform this sequence:

``` text
1. Inspect repository.
2. Identify existing architecture.
3. Locate existing:
   - Trace Graph
   - Sniffer
   - Pattern model
   - Release engine
   - Reframe engine
   - Ritual system
   - Journal
   - Evidence
   - Persistence
   - AI Handshake
4. Map existing models to this specification.
5. Produce EXISTS / PARTIAL / MISSING / CONFLICT / UNVERIFIED matrix.
6. Identify duplication risks.
7. Identify migrations required.
8. Propose smallest coherent implementation path.
9. Implement incrementally.
10. Run tests.
11. Verify Trace Graph integrity.
12. Verify historical version integrity.
13. Verify AI epistemic-status handling.
14. Verify user-owned boundaries and identity.
```

Do not begin by blindly creating new files or data models.

------------------------------------------------------------------------

# 43. Final System Principle

Atüned does not tell the user who to become.

The user defines who they want to become.

Atüned makes that definition operational.

It identifies what matters, determines what must be protected, converts
that into practice, observes what actually happens, identifies patterns
associated with the gap, supports release/reframe/conditioning, records
evidence, evaluates integrity and regulation, and continuously adapts
the practice.

The final product loop is:

``` text
DEFINE
→ ALIGN
→ PROTECT
→ PRACTICE
→ OBSERVE
→ UNDERSTAND
→ RELEASE
→ REFRAME
→ CONDITION
→ EMBODY
→ VERIFY
→ BECOME
```

The deepest architectural relationship is:

``` text
AVATAR
= WHO

PURPOSE
= WHY

VALUES
= WHAT MATTERS

BOUNDARY
= WHAT I PROTECT

NON-NEGOTIABLES
= WHAT I COMMIT TO

RITUAL
= WHAT I PRACTICE

JOURNAL
= WHAT I OBSERVE

SNIFFER
= WHAT THE SYSTEM DISCOVERS

PATTERN
= WHAT REPEATEDLY SUPPORTS OR OBSTRUCTS

INTEGRITY
= WHETHER I LIVE WHAT I SAY MATTERS

REGULATION
= THE STATE I AM OPERATING FROM

EVIDENCE
= WHAT WE ACTUALLY KNOW

TRACE GRAPH
= HOW EVERYTHING RELATES

ADAPTATION
= WHAT CHANGES NEXT
```

------------------------------------------------------------------------

# 44. Implementation Confidence

  Dimension                                                                      Rating
  ----------------------------------- -------------------------------------------------
  Conceptual coherence                                                           9.8/10
  System separation                                                              9.7/10
  Traceability                                                                    10/10
  AI implementation clarity                                                      9.7/10
  User agency                                                                     10/10
  Architecture extensibility                                                     9.5/10
  Duplication risk                      Low if repository audit precedes implementation
  Regulation-model certainty                                                     7.8/10
  Overall implementation confidence                                                0.96

**Primary unresolved technical area:** the exact evidence model used to
infer and display regulation/Kundalini-related state. Keep that layer
explicitly separate from unsupported numerical claims until the existing
Atüned model provides its authoritative definition.
