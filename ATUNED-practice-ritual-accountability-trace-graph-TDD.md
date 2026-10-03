# ATÜNED PRACTICE, RITUAL, ACCOUNTABILITY & TRACE GRAPH
## Technical Design Document — Implementation Handoff

**Product:** Atüned  
**System:** Practice / Ritual / Accountability / Intelligence  
**Status:** Architecture specification  
**Purpose:** Define the complete technical foundation required to evolve Ritual from a conventional habit tracker into an intelligent behavior change and results as a service system.

---

# 1. Executive Architecture

Atüned is not a habit tracker.

The system translates a user's desired change into structured practices, connects those practices to relevant patterns, executes them through Ritual, records what actually happened, and feeds the evidence back into the Trace Graph.

The canonical loop is:

```text
GOAL
  ↓
DESIRED OUTCOME
  ↓
BEHAVIOR OBJECTIVES
  ↓
RELEVANT PATTERNS
  ↓
PROTOCOL
  ↓
RITUAL
  ↓
PRACTICE EVENT
  ↓
EVIDENCE
  ↓
BEHAVIORAL CHANGE
  ↓
OUTCOME
  ↓
TRACE GRAPH UPDATE
  ↓
ADAPTATION
  ↓
NEXT PRACTICE
```

The fundamental architectural rule is:

> A Ritual is not the intervention. A Ritual is the scheduled execution of a Protocol.

And:

> Completion of a Ritual is not evidence of change. Evidence of change must be independently recorded.

And:

> The Trace Graph is the connective intelligence layer between goals, patterns, interventions, behavior, evidence, and outcomes.

---

# 2. Existing Architecture to Preserve

Do not create a parallel intelligence architecture.

The new system must extend the existing Atüned architecture.

Existing foundations include:

* Pattern system
* Story system
* Trace Graph
* Evidence model
* Release Protocol system
* Reframe system
* Ritual system
* Accountability system
* Longitudinal intelligence
* Client side persistence
* Versioned user record
* Server synchronization
* Entitlement/payment boundary
* AI Handshake architecture

The new system should integrate with these systems rather than replace them.

---

# 3. Core Domain Model

The system consists of eight primary domain objects.

```text
Goal
BehaviorObjective
Protocol
Ritual
PracticeEvent
Evidence
Outcome
TraceGraph
```

Their responsibilities are deliberately separate.

| Object | Responsibility |
|---|---|
| Goal | What the user wants to change |
| BehaviorObjective | Observable behavior required to achieve the goal |
| Protocol | How Atüned proposes changing the behavior or pattern |
| Ritual | When and how the protocol is scheduled for practice |
| PracticeEvent | What actually happened during execution |
| Evidence | What was observed or reported |
| Outcome | What changed relative to the goal |
| Trace Graph | How all of the above relate |

---

# 4. Goal

A Goal represents the user's desired outcome.

The user owns the goal.

Atüned may clarify, decompose, or suggest structure, but must not silently invent the user's goal.

## Schema

```yaml
Goal:
  id: string
  user_id: string

  title: string
  description: string

  status:
    type: enum
    values:
      - active
      - paused
      - completed
      - abandoned

  desired_outcome:
    description: string
    measurable: boolean
    target_value: number|null
    target_unit: string|null

  conditions:
    contexts: string[]
    environments: string[]
    people: string[]
    triggers: string[]
    time_windows: string[]

  start_at: datetime
  target_at: datetime|null

  created_at: datetime
  updated_at: datetime
```

## Examples

```text
"I want to communicate more consciously."

"I want to stop over-explaining."

"I want to drink eight glasses of water per day."

"I want to become more consistent."

"I want to have the courage to speak directly."
```

---

# 5. Behavior Objective

Goals must be translated into observable behaviors.

Do not allow the system to confuse an abstract aspiration with an observable behavior.

Bad:

```text
Become more confident.
```

Better:

```text
Speak directly when I disagree.
```

Better:

```text
State my disagreement without adding unnecessary justification.
```

## Schema

```yaml
BehaviorObjective:
  id: string
  goal_id: string

  behavior: string
  description: string

  frequency:
    value: number|null
    unit: string|null

  duration:
    value: number|null
    unit: string|null

  quantity:
    value: number|null
    unit: string|null

  conditions:
    when: string[]
    where: string[]
    with_whom: string[]

  quality_dimensions:
    awareness: boolean
    presence: boolean
    integrity: boolean
    consistency: boolean

  priority: number

  status:
    type: enum
    values:
      - active
      - paused
      - completed
      - abandoned

  created_at: datetime
  updated_at: datetime
```

---

# 6. Protocol

The Protocol is the actual intervention design.

It answers:

> What are we going to do about this?

A Protocol may contain one or more intervention classes.

## Protocol classes

```text
release
behavior
integrity
communication
body
attention
relationship
goal
presence
custom
```

## Schema

```yaml
Protocol:
  id: string
  version: number

  class:
    type: enum
    values:
      - release
      - behavior
      - integrity
      - communication
      - body
      - attention
      - relationship
      - goal
      - presence
      - custom

  objective_id: string|null

  target_patterns:
    pattern_ids: string[]

  steps:
    step_ids: string[]

  conditions:
    when: string[]
    where: string[]
    with_whom: string[]

  schedule:
    cadence: string|null
    duration: string|null

  progression:
    enabled: boolean
    progression_id: string|null

  verification:
    required: boolean
    verification_type: string

  evidence_requirements:
    evidence_types: string[]

  adaptation_rules:
    rule_ids: string[]

  generated_by:
    system: string|null
    model_version: string|null
    timestamp: datetime|null

  created_at: datetime
  updated_at: datetime
```

---

# 7. Protocol Steps

Protocols are composable.

## Step types

```text
release
reframe
affirmation
behavior
timer
observation
real_world_action
verification
```

## Schema

```yaml
ProtocolStep:
  id: string
  protocol_id: string

  sequence: number

  type:
    type: enum
    values:
      - release
      - reframe
      - affirmation
      - behavior
      - timer
      - observation
      - real_world_action
      - verification

  instruction: string

  duration:
    value: number|null
    unit: string|null

  quantity:
    value: number|null
    unit: string|null

  condition: string|null

  completion_rule: string|null

  evidence_rule: string|null
```

## Example

```text
PROTOCOL: Conscious Communication

1. RELEASE
   Pattern: fear of being misunderstood

2. REFRAME
   "I know I can speak clearly without over-explaining."

3. BEHAVIOR
   Speak 50% of normal words.

4. CONDITION
   During conversations.

5. DURATION
   2 hours.

6. OBSERVATION
   Notice what happens when silence is allowed.

7. VERIFICATION
   Record what changed.
```

---

# 8. Release Protocol Integration

Release Protocol is a specialized Protocol class.

Do not duplicate the Release system.

Existing Release functionality should remain authoritative for:

* ReleaseSession
* ReleasePattern
* ReleaseQueue
* ReleaseEvent
* Release Protocol Registry
* Release verification
* Somatic events
* Pattern replacement
* Longitudinal evidence

The generalized Protocol layer calls the existing Release system when:

```text
Protocol.class == release
```

Therefore:

```text
Practice Protocol
      ↓
Release Step
      ↓
Existing Release Engine
```

---

# 9. Ritual

Ritual is the scheduled execution layer.

The Ritual should remain comparatively lightweight.

It should not contain all intelligence.

## Schema

```yaml
Ritual:
  id: string

  protocol_id: string

  title: string

  cadence:
    type: string

  days: string[]

  start_at: datetime|null
  end_at: datetime|null

  timer:
    enabled: boolean
    duration_seconds: number|null

  active: boolean

  order: number

  tags: string[]

  created_at: datetime
  updated_at: datetime
```

## Architectural rule

```text
Protocol = What / Why / How

Ritual = When

PracticeEvent = What actually happened
```

---

# 10. Practice Event

PracticeEvent is the authoritative execution record.

It distinguishes assignment from execution.

## Schema

```yaml
PracticeEvent:
  id: string

  user_id: string
  ritual_id: string
  protocol_id: string

  scheduled_at: datetime

  started_at: datetime|null
  completed_at: datetime|null

  status:
    type: enum
    values:
      - scheduled
      - available
      - started
      - partial
      - completed
      - skipped
      - missed
      - interrupted

  execution:
    duration_seconds: number|null
    steps_completed: number
    steps_expected: number

  quality:
    awareness: number|null
    presence: number|null
    integrity: number|null
    effort: number|null
    self_reported_quality: number|null

  evidence_ids: string[]

  outcome_id: string|null

  created_at: datetime
  updated_at: datetime
```

---

# 11. Accountability

Accountability must measure:

```text
INTENTION
→ PRACTICE
→ OBSERVATION
→ EVIDENCE
→ OUTCOME
```

It must not reduce to:

```text
DONE / NOT DONE
```

The central question is:

> What changed because you practiced?

---

# 12. Evidence

Evidence is separate from completion.

## Schema

```yaml
Evidence:
  id: string

  user_id: string

  source:
    type: enum
    values:
      - user
      - system
      - observation
      - behavioral_event
      - outcome

  type:
    type: enum
    values:
      - internal
      - behavioral
      - contextual
      - outcome
      - negative

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

---

# 13. Effect and Affect

Atüned must distinguish two dimensions.

## Effect

What actually changed?

Examples:

* behavior
* decision
* relationship
* performance
* pattern intensity
* goal progress

## Affect

How did the experience feel?

Examples:

* ease
* resistance
* energy
* presence
* confidence
* emotional state
* connectedness

These are not interchangeable.

Possible result:

```text
Effect: high
Affect: low
```

Meaning:

> The practice produced a useful behavioral result but felt difficult.

Or:

```text
Effect: low
Affect: high
```

Meaning:

> The practice felt good but did not produce observable change.

Both are useful intelligence.

---

# 14. Outcome

Outcome measures progress against the goal.

## Schema

```yaml
Outcome:
  id: string

  goal_id: string

  timestamp: datetime

  metric: string

  before: number|string|null
  current: number|string|null
  target: number|string|null

  status:
    type: enum
    values:
      - improved
      - unchanged
      - worsened
      - unclear

  evidence_ids: string[]

  notes: string|null
```

Atüned must not infer "resolved" merely from a successful ritual.

---

# 15. Trace Graph Integration

## Mandatory

Every object in this system must connect to the Trace Graph.

Do not create a separate Practice graph.

The existing Trace Graph remains the authoritative relationship model.

## Required relationships

```text
GOAL
 ├── desired_outcome → OUTCOME
 ├── requires → BEHAVIOR
 └── obstructed_by → PATTERN

BEHAVIOR
 ├── affected_by → PATTERN
 └── produces → OUTCOME

PATTERN
 ├── supported_by → EVIDENCE
 ├── addressed_by → PROTOCOL
 └── occurs_in → CONTEXT

PROTOCOL
 ├── targets → PATTERN
 ├── implements → BEHAVIOR
 └── executed_by → RITUAL

RITUAL
 └── produces → PRACTICE_EVENT

PRACTICE_EVENT
 ├── produces → EVIDENCE
 └── produces → OUTCOME

EVIDENCE
 ├── supports → PATTERN
 ├── informs → BEHAVIOR
 └── supports → OUTCOME

OUTCOME
 └── measures → GOAL
```

---

# 16. Graph Node Types

The Trace Graph should support at minimum:

```text
story
impression
pattern
goal
behavior
protocol
ritual
practice_event
observation
evidence
outcome
context
somatic_state
reframe
release
```

The system may add additional node types later, but these should remain semantically distinct.

---

# 17. Graph Edge Types

Minimum edge vocabulary:

```text
causes
associated_with
supports
contradicts
obstructs
reinforces
targets
addresses
requires
implements
executes
produces
measures
occurs_in
replaces
precedes
follows
generalizes_to
transfers_to
```

Edges must be typed.

Do not use generic `related_to` when a meaningful relationship is known.

---

# 18. Graph Example

User goal:

> Communicate more consciously.

Graph:

```text
Goal
"Communicate more consciously"
        │
        ├── requires ──→ Behavior
        │                "Speak less / listen more"
        │
        ├── obstructed_by ──→ Pattern
        │                     "Need to fill silence"
        │
        └── measured_by ──→ Outcome
                            "Communication awareness"

Pattern
"Need to fill silence"
        │
        └── addressed_by
                ↓
            Protocol
                │
                ├── Release
                ├── Reframe
                └── Behavior
                     "Speak 50%"
                         │
                         ↓
                       Ritual
                         │
                         ↓
                   PracticeEvent
                         │
                         ↓
                      Evidence
                         │
                         ↓
                       Outcome
```

---

# 19. Goal Decomposition Algorithm

The Goal Engine must translate an abstract goal into observable behavior.

## Algorithm

```text
INPUT: Goal

1. Parse desired outcome.

2. Determine whether the outcome is observable.

3. If not observable:
   ask the user to clarify.

4. Identify behaviors required to produce the outcome.

5. Identify contextual conditions.

6. Query Trace Graph.

7. Find relevant patterns.

8. Rank patterns.

9. Identify candidate interventions.

10. Generate candidate protocols.

11. Consolidate overlapping protocols.

12. Generate proposed rituals.

13. Present proposal to user.

14. User accepts / edits / rejects.

15. Persist accepted plan.

16. Write relationships to Trace Graph.
```

Atüned must not silently turn an AI inference into a confirmed user fact.

---

# 20. Pattern Prioritization

Pattern selection should use existing intelligence rather than a simple keyword match.

Relevant factors include:

```text
recurrence
charge
user importance
goal relevance
persistence
recent activation
failure to change
cross-context recurrence
confirmed relationships
somatic reinforcement
existing evidence
previous intervention response
```

A candidate pattern with strong evidence should generally receive more weight than an inferred pattern with weak evidence.

---

# 21. Protocol Selection

Candidate protocols should be evaluated using:

```text
goal relevance
pattern relevance
evidence strength
user preference
prior intervention results
context relevance
behavioral leverage
protocol suitability
effort
complexity
risk of overload
```

The system should prefer:

> minimum useful practices + maximum relevant coverage

rather than generating a large program simply because many interventions are possible.

---

# 22. Protocol Consolidation

If three patterns can be addressed by one protocol, Atüned should prefer one coherent protocol over three redundant rituals.

Example:

```text
Pattern A → over-explaining
Pattern B → fear of silence
Pattern C → need to control conversation

              ↓

One protocol:

CONSCIOUS COMMUNICATION
```

with:

```text
Release
+
Reframe
+
50% speech constraint
+
Observation
```

---

# 23. Progression Engine

Behavior modification requires progression.

Progression is not simply "make it harder."

Progression evaluates:

```text
execution quality
consistency
awareness
presence
integrity
context transfer
outcome
evidence
```

Example:

```text
LEVEL 1
Speak 50% of normal words.

LEVEL 2
Speak 25%.

LEVEL 3
Listen without preparing a response.

LEVEL 4
Meaning-only communication.

LEVEL 5
Context-only communication.

LEVEL 6
Apply under stress.

LEVEL 7
Transfer to new environments.

LEVEL 8
Behavior becomes natural without formal constraint.
```

The progression engine must allow regression or simplification when evidence indicates that the current level is inappropriate.

---

# 24. Adaptive Accountability

Repeated failure should trigger investigation rather than punishment.

Example:

```text
Practice missed 3 times.
        ↓
Investigate
        ↓
Why?
```

Possible classifications:

```text
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

Then propose:

```text
shorten
reschedule
change_condition
change_protocol
reduce_difficulty
increase_difficulty
pause
replace
investigate_pattern
```

The user decides whether to accept the adaptation.

---

# 25. Accountability State Machine

```text
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
             ↓
         NEXT PRACTICE
```

Miss path:

```text
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

A missed ritual is not automatically interpreted as lack of motivation.

---

# 26. AI Handshake

AI generated interventions require a formal contract.

```yaml
PracticeHandshake:
  contract_version: string

  goal_id: string

  desired_outcome: string

  known_state:
    patterns: []
    prior_protocols: []
    evidence: []
    context: []
    history: []

  proposed:
    behaviors: []
    patterns: []
    protocols: []
    rituals: []

  rationale: []

  expected_signals: []

  evidence_requirements: []

  uncertainty: []

  constraints: []

  validation:
    goal_valid: boolean
    pattern_valid: boolean
    protocol_valid: boolean
    schedule_valid: boolean
    evidence_plan_valid: boolean
```

AI must distinguish:

```text
known
inferred
proposed
user_confirmed
observed
```

These states must never be collapsed.

---

# 27. Versioning

Protocols are versioned.

Example:

```text
Protocol v1
   ↓
Ritual Instance v1
```

If the protocol changes:

```text
Protocol v2
```

existing historical PracticeEvents remain associated with v1.

They must not silently mutate.

Every relevant object should support:

```text
schema_version
contract_version
protocol_version
algorithm_version
```

AI generated objects should also record:

```yaml
generated_by:
  system: string
  model_version: string
  timestamp: datetime

approved_by:
  user: boolean
```

---

# 28. Persistence Architecture

The initial implementation should extend the existing versioned User Record rather than immediately creating a separate database architecture.

Initial user state:

```text
user_record
 ├── goals[]
 ├── behavior_objectives[]
 ├── protocols[]
 ├── rituals[]
 ├── practice_events[]
 ├── evidence[]
 └── outcomes[]
```

Use the existing persistence and synchronization boundary.

Do not put personal Practice data into Canon.

Do not put payment credentials into Practice objects.

---

# 29. Future Server Data Model

Dedicated server tables become appropriate when there is a concrete need for:

* longitudinal analytics
* high volume event querying
* practitioner views
* cohort views
* notification jobs
* server side intelligence
* population level research
* event volume beyond the user record

Potential tables:

```text
goals
behavior_objectives
protocols
rituals
practice_events
evidence_events
outcomes
```

This should be a deliberate migration, not a prerequisite for the first implementation.

---

# 30. Event Architecture

Every meaningful state transition should emit an event.

```text
GOAL_CREATED
GOAL_UPDATED
GOAL_PAUSED
GOAL_COMPLETED
GOAL_ABANDONED

BEHAVIOR_DEFINED
BEHAVIOR_UPDATED

PROTOCOL_GENERATED
PROTOCOL_ACCEPTED
PROTOCOL_REJECTED
PROTOCOL_MODIFIED
PROTOCOL_VERSIONED
PROTOCOL_ADAPTED
PROTOCOL_ADVANCED
PROTOCOL_DEESCALATED

RITUAL_CREATED
RITUAL_STARTED
RITUAL_PAUSED
RITUAL_COMPLETED
RITUAL_SKIPPED
RITUAL_MISSED
RITUAL_RESCHEDULED

PRACTICE_STARTED
PRACTICE_PARTIAL
PRACTICE_COMPLETED
PRACTICE_INTERRUPTED

EVIDENCE_RECORDED
OUTCOME_RECORDED

PATTERN_LINKED
PATTERN_UNLINKED

CONTEXT_TRANSFERRED
```

These events provide the audit trail and feed the Trace Graph.

---

# 31. Information Architecture

Logical architecture:

```text
DISCOVER
 ├── Story
 ├── Field
 ├── Summary
 └── Analytics

PRACTICE
 ├── Today
 ├── Goals
 ├── Rituals
 └── Protocols

RELEASE
 ├── Release
 └── Reframe

ACCOUNTABILITY
 ├── Today
 ├── Evidence
 ├── History
 └── Change

INTELLIGENCE
 ├── Patterns
 ├── Trace
 └── Insights
```

Do not expose all underlying complexity as navigation.

The user's primary experience should remain:

```text
WHAT AM I WORKING ON?
        ↓
WHAT DO I DO TODAY?
        ↓
WHAT HAPPENED?
        ↓
WHAT CHANGED?
        ↓
WHAT NEXT?
```

---

# 32. Practice Builder UX

The user should have three entry modes.

## Mode A — Goal Driven

```text
What are you trying to change?
        ↓
Atüned analyzes the goal.
        ↓
Atüned proposes behaviors.
        ↓
Atüned identifies relevant patterns.
        ↓
Atüned proposes protocol.
        ↓
User accepts/edits.
```

## Mode B — Protocol Driven

```text
Choose a protocol class:
Release
Behavior
Integrity
Communication
Body
Attention
Relationship
Presence
Custom
```

Then customize.

## Mode C — Build From Scratch

Advanced users can construct:

```text
conditions
steps
timers
behaviors
patterns
evidence
progression
schedule
```

---

# 33. Ritual Builder UX

Ritual creation should feel simple.

```text
WHAT ARE YOU PRACTICING?

[ Select protocol ]

WHEN?

[ Morning ]
[ Evening ]
[ Specific time ]
[ Trigger ]

HOW LONG?

[ 5 min ]

WHAT SHOULD YOU NOTICE?

[ Observation ]

WHAT COUNTS AS SUCCESS?

[ Verification ]
```

Advanced configuration remains available but hidden by default.

---

# 34. Today Screen

Today is the primary execution surface.

It should answer:

```text
What am I working on?

What should I do?

Why am I doing it?

What is the expected signal?

What happened?

What changed?
```

It should not resemble a generic productivity dashboard.

---

# 35. 30 / 60 / 90 Day Change Record

Atüned should provide a longitudinal summary.

## Starting state

```text
Goal
Story
Relevant patterns
Initial evidence
Initial measurements
```

## Practice

```text
Protocols
Rituals
Practice events
Release sessions
Behavior experiments
```

## Change

```text
Pattern changes
Behavior changes
Context changes
Outcome changes
```

## Current state

```text
Integrated
Still active
Needs work
New pattern
Next protocol
```

The system should show evidence rather than make unsupported claims.

---

# 36. Context Transfer

A behavior should eventually be tested outside its original context.

Example:

```text
Home
 ↓
Work
 ↓
Relationship
 ↓
High pressure environment
```

If the behavior works only in one context, it is not yet generalized.

Record:

```text
context
behavior
evidence
outcome
```

and write the result back to the Trace Graph.

---

# 37. Offline and Failure Behavior

### Browser closes during practice

Persist the last confirmed event.

On return:

```text
Continue
Restart
Mark interrupted
```

### Network failure

Continue locally.

Queue synchronization.

### Sync conflict

Use existing versioning rules.

Never silently overwrite newer state.

### Protocol modification

Existing instances retain their protocol version.

Future instances use the new version.

---

# 38. Analytics / Instrumentation

Track the complete funnel:

```text
GOAL_CREATED
↓
GOAL_ACCEPTED
↓
BEHAVIOR_CREATED
↓
PROTOCOL_GENERATED
↓
PROTOCOL_ACCEPTED
↓
RITUAL_STARTED
↓
PRACTICE_COMPLETED
↓
EVIDENCE_RECORDED
↓
OUTCOME_RECORDED
↓
PROTOCOL_ADAPTED
↓
GOAL_PROGRESS
```

Important metrics:

```text
goal creation rate
goal acceptance rate
protocol acceptance rate
first practice rate
practice completion
partial completion
miss rate
adaptation rate
evidence capture rate
outcome capture rate
behavior improvement
goal completion
protocol effectiveness
context transfer
30 day retention
60 day retention
90 day retention
```

Do not optimize solely for ritual completion.

The highest value metric is ultimately:

> Observed meaningful change per unit of practice.

---

# 39. Testing Requirements

Every feature requires tests at every layer.

## Schema

Validate:

* required fields
* enums
* references
* version
* malformed objects

## State

Test:

```text
create
start
pause
resume
complete
skip
miss
adapt
complete
abandon
```

## Graph

Test:

```text
node creation
edge creation
edge removal
relationship integrity
orphan detection
cycle handling
version consistency
```

## Protocol

Test:

```text
generate
accept
reject
edit
version
execute
adapt
progress
regress
```

## Evidence

Test:

```text
before
during
after
later
negative evidence
context transfer
```

## Persistence

Test:

```text
reload
browser close
offline
sync
conflict
migration
rollback
schema upgrade
```

## Longitudinal

Test:

```text
30 days
60 days
90 days
recurrence
replacement
integration
outcome
```

---

# 40. Implementation Status Classification

Every requirement must be classified by the implementation AI as exactly one of:

```text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

The AI must never infer that documentation equals implementation.

For every requirement, provide:

```text
Requirement
Current implementation
Status
File/component
Data dependency
Required change
Tests required
```

---

# 41. Build Order

## P0 — Domain foundation

Implement:

```text
Goal
BehaviorObjective
Protocol
ProtocolStep
Ritual
PracticeEvent
Evidence
Outcome
```

plus:

```text
schemas
state machines
events
versioning
persistence
sync
```

## P0 — Existing system integration

Connect:

```text
Pattern → Protocol
Pattern → Ritual
Release → Protocol
Reframe → Protocol
Ritual → Accountability
Accountability → Evidence
Evidence → Trace Graph
Outcome → Trace Graph
```

## P1 — Intelligence

Implement:

```text
goal decomposition
pattern prioritization
protocol selection
protocol consolidation
progression
adaptive intervention
context transfer
```

## P1 — User experience

Implement:

```text
Today
Goal Builder
Practice Builder
Protocol Builder
Evidence Capture
Change Record
```

## P2 — Learning

Implement:

```text
protocol effectiveness
personal response model
pattern replacement
negative evidence
population learning
practitioner/cohort intelligence
```

---

# 42. Non Negotiable Architectural Rules

### Rule 1

Ritual is execution, not intelligence.

### Rule 2

Protocol is the intervention design.

### Rule 3

PracticeEvent records actual execution.

### Rule 4

Completion does not equal change.

### Rule 5

Evidence is the basis for claims of change.

### Rule 6

Every new Practice object must connect to the Trace Graph.

### Rule 7

Do not create a second intelligence graph.

### Rule 8

Do not duplicate the Release Engine.

### Rule 9

AI inference must be distinguishable from user confirmed fact.

### Rule 10

User goals remain user owned.

### Rule 11

Protocol versions must remain historically immutable.

### Rule 12

A missed practice is not automatically a motivational failure.

### Rule 13

The system should adapt the intervention rather than punish the user.

### Rule 14

Complexity belongs in the intelligence layer; the user's interaction should remain simple.

### Rule 15

The system must measure effect and affect separately.

### Rule 16

The ultimate product metric is meaningful change, not streak length.

---

# 43. Canonical System Model

```text
                         USER
                           │
                           ▼
                         GOAL
                           │
                           ▼
                   DESIRED OUTCOME
                           │
                           ▼
                 BEHAVIOR OBJECTIVES
                           │
                           ▼
                    TRACE GRAPH
                     /         \
                    /           \
               PATTERNS       CONTEXT
                   │              │
                   └──────┬───────┘
                          ▼
                       PROTOCOL
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          RELEASE      BEHAVIOR     INTEGRITY
             │            │            │
             └────────────┼────────────┘
                          ▼
                        RITUAL
                          │
                          ▼
                   PRACTICE EVENT
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           EFFECT       AFFECT      CONTEXT
              │           │           │
              └───────────┼───────────┘
                          ▼
                       EVIDENCE
                          │
                          ▼
                        OUTCOME
                          │
                          ▼
                    TRACE GRAPH
                          │
                          ▼
                      ADAPTATION
                          │
                          ▼
                    NEXT PRACTICE
```

---

# 44. Final Architectural Principle

Atüned's Practice system should not ask:

> "Did you complete your habit?"

It should ask:

> You said you wanted to change X. We identified Y as relevant. You practiced Z. What happened?

Then the system learns.

That is the complete technical loop:

```text
INTENTION
→ PATTERN
→ INTERVENTION
→ PRACTICE
→ EVIDENCE
→ CHANGE
→ LEARNING
→ ADAPTATION
```

This is what turns Ritual from a standard habit feature into an integral component of Atüned's intelligence and results as a service architecture.

---

# 45. Flow: one page of three columns

Ruled 2 October, round QF, in his words: "And if you'll notice, we're
re-merging the knowledge base and the accountability tracker. Left menu will be
for inputting new. Right side of the menu is for the accountability tracker.
Center piece is for the ritual."

**This section has been rewritten twice in one day and the churn is the
record.** Round JQ attached the accountability tracker to the ritual page.
Round PO, earlier on 2 October, split it out: "get rid of the left and right
menu. Actually, sorry. Move the new ritual to the right menu. And you're
supposed to move accountability to its own tool set." Round QF puts it back,
as a column rather than a page, and gives the left column the job it did not
have before. Section 31 still holds: ACCOUNTABILITY is its own group of the
information architecture, with Today, Evidence, History and Change. What
changed is where that group is drawn, not what it is.

```text
FLOW  ·  one page, TAB.RITUAL
 ├── left    INPUTTING NEW      what shall I start?
 │             New ritual, closed to one press and seven tags;
 │             open, the builder
 ├── centre  THE RITUAL         what am I doing?
 │             the chain, the becoming prompt, the Active list
 └── right   THE TRACKER        did I do it?
               Due today, Done (rings, streak, figures, marks),
               Missed, the Record
```

TAB.ACCOUNT keeps integer 14 and loses its door, through TABFOLD, which is the
fold Games and Analytics have each been through. The full rules are in
`DESIGN-flow-tools.md`, FT1 to FT15, and each carries the gate that fails it.
The index:

```text
FT1   Flow is one page with one door, and Accountability keeps its integer
FT2   All three columns are drawn, each holds the thing it is for
FT3   Each rail holds exactly one panel on Flow, and both go away off Flow
FT4   Inputting new is the left column, and only there
FT5   The Ritual stage holds no accountability
FT6   The tracker is the right column, with no door and no host of its own
FT7   The tracker reads three things and invents nothing
FT8   Empty states say what is empty and offer the one press
FT9   Every write goes through the one writer and says how it went
FT10  Add to my ritual on the Compass teacher panel still lands
FT11  A caller off Flow goes to Flow
FT12  Both widths hold: inside the screen, the builder's week fits
FT13  Both folds are the person's and still work
FT14  Every heading says what it means, in the same place
FT15  The rules and the gates are one list
```

The gates that hold them, named so none is left to be found:

```text
tests/flowtools.js     FT1 to FT15. Runs alone, and is called from tests/functional.js.
tests/functional.js    the TAB integers, the nav placements (Ritual in Flow, and
                       Accountability folded onto it), and the Compass teacher
                       panel's Add to my ritual
tests/engine.js        the TAB integers, headless
tests/design.js        one surface per tab, the 44 pixel tap floor on every TABDEF tab
tools/monitor.js       every surface renders, at both widths, blank and loaded
tests/practice.js      the practice domain under the surface: schema, state machine, miss reads
tests/trace.js         the trace graph under the surface
```

Accountability in this section is the Flow surface and reads the existing plan
and record stores. The richer accountability of sections 11 to 14, 24 and 35
(evidence, outcome, the reason for a miss, the 30, 60 and 90 day record) is not
built in this change, and `DESIGN-flow-tools.md` section 5 says why for each.
