# Atuned Release Intelligence

## Implementation Handoff for Next AI

### 0. Implementation Objective

Build the Release Intelligence subsystem as a closed-loop state-change
system.

The system must:

1.  Prepare the user.
2.  Establish the observer state.
3.  Select and sequence patterns.
4.  Present patterns through a persistent release carousel.
5.  Guide the release protocol through AI voice.
6.  Capture user decisions and somatic observations.
7.  Execute the reframe protocol.
8.  Run cooldown.
9.  Verify immediate change.
10. Preserve evidence.
11. Detect recurrence, replacement, and negative evidence over time.
12. Feed verified evidence back into the user’s personal model.

The system must **not equate completion, emotional relief, or a user’s
declaration of release with verified resolution**.

------------------------------------------------------------------------

# 1. Architectural Boundary

Release Intelligence consists of ten layers.

``` text
1. EXPERIENCE
   Carousel / Voice / Follow-Along / Gamification

2. SESSION
   Release Session / State Machine / Timing

3. ORCHESTRATION
   Release Engine / Queue Controller / Protocol Controller

4. AI INTELLIGENCE
   Handshake / Selection / Sequencing / Adaptation

5. PATTERN MODEL
   Pattern / Channels / Somatic Mapping / Relationships

6. EVIDENCE
   User Input / Somatic Response / Decisions / Behavioral Evidence

7. TRACE GRAPH
   Nodes / Edges / Context / History

8. VERIFICATION
   Immediate / Negative Evidence / Replacement / Recurrence

9. LONGITUDINAL INTELLIGENCE
   Internal / Behavioral / Contextual / Outcome / Integration

10. LEARNING
    Personal Model / Population Priors / Protocol Optimization
```

### Architectural rule

The layers must remain separable.

**UI does not determine intelligence.**

**AI does not directly control presentation.**

**Presentation state does not equal processing state.**

**Processing state does not equal evidence state.**

------------------------------------------------------------------------

# 2. Core Domain Objects

## 2.1 ReleaseSession

``` yaml
ReleaseSession:
  id
  user_id
  protocol_id
  contract_id

  started_at
  completed_at

  objective
  source_context

  configuration:
    release_count
    reframe_count
    left_count
    right_count
    cooldown_duration
    carousel_mode
    follow_along_enabled

  state:
    phase
    status
    current_pattern_id
    current_channel
    current_side
    progress

  readiness:
    environment_ready
    user_ready
    senses_inward
    observer_position

  verification:
    immediate_status
    integration_status

  outcome:
    completed
    interrupted
    partial
```

## 2.2 ReleasePattern

``` yaml
ReleasePattern:
  id
  pattern_id

  text
  category
  source
  confidence
  intensity

  channels:
    believing
    perceiving
    thinking
    behaving
    acting
    feeling
    speaking

  somatic:
    locations[]
    sensations[]
    intensity

  context:
    triggers[]
    people[]
    environments[]
    situations[]

  session_status:
    queued
    active
    released
    reframed
    verified
    recycled
    discarded
```

## 2.3 ReleaseQueue

``` yaml
ReleaseQueue:
  session_id

  previous[]
  current
  upcoming[]

  completed[]
  recycled[]
  discarded[]
```

The queue is an intelligence object, not merely a UI list.

## 2.4 ReleaseEvent

Every meaningful action becomes an event.

``` yaml
ReleaseEvent:
  id
  session_id
  pattern_id

  timestamp
  event_type

  actor:
    user
    ai
    system

  state_before
  state_after

  payload
  confidence
```

Examples:

``` text
PATTERN_PRESENTED
PATTERN_READ
PATTERN_ACTIVATED
RELEASE_STARTED
SOMATIC_RESPONSE
RECYCLE
DISCARD
REFRAME_STARTED
REFRAME_COMPLETED
COOLDOWN_STARTED
VERIFICATION_STARTED
VERIFICATION_RESULT
SESSION_PAUSED
SESSION_RESUMED
SESSION_EXITED
```

This event stream becomes the authoritative session history.

------------------------------------------------------------------------

# 3. Protocol Registry

The release mechanics must not be hard-coded.

Create a versioned Protocol Registry.

``` yaml
Protocol:
  id
  version
  name

  preparation:
    instructions
    readiness_requirements

  observer:
    instruction
    confirmation_method

  release:
    channels[]
    left_count
    right_count
    sequence_strategy

  reframe:
    template
    left_count
    right_count
    sequence_strategy

  cooldown:
    duration
    instructions

  verification:
    immediate_method
    longitudinal_method
```

This allows:

``` text
50 left / 50 right
25 left / 25 right
10 left / 10 right
Adaptive
Custom
```

without modifying the underlying Release Engine.

------------------------------------------------------------------------

# 4. AI Handshake Contract

Before a significant intervention, the AI must construct and validate a
session contract.

``` yaml
AIHandshake:
  contract_version

  session_id
  user_id

  known_state:
    goals
    relevant_patterns
    history
    context
    prior_evidence

  target:
    pattern_id
    reason_selected

  proposed_protocol:
    protocol_id
    release_configuration
    reframe_configuration
    cooldown_configuration
    verification_configuration

  expected_signal:
  expected_change:

  constraints:
  uncertainty:

  confidence:

  validation:
    state_consistent
    protocol_valid
    evidence_sufficient
    execution_allowed
```

### Handshake sequence

``` text
UNDERSTAND
    ↓
SELECT
    ↓
EXPLAIN WHY
    ↓
CONFIGURE
    ↓
VALIDATE
    ↓
EXECUTE
```

The handshake is a **contract**, not a conversational flourish.

------------------------------------------------------------------------

# 5. Release State Machine

``` text
IDLE
 ↓
PREPARE
 ↓
READY_CHECK
 ↓
OBSERVER_ACTIVATION
 ↓
PATTERN_PRESENTATION
 ↓
CHANNEL_ACTIVATION
 ↓
RELEASE
 ↓
SOMATIC_OBSERVATION
 ↓
PATTERN_DECISION
 ├── RECYCLE
 ├── DISCARD
 └── CONTINUE
 ↓
REFRAME
 ↓
INTEGRATION
 ↓
COOLDOWN
 ↓
IMMEDIATE_VERIFICATION
 ↓
SESSION_COMPLETE
 ↓
LONGITUDINAL_TRACKING
```

Any active state must support:

``` text
PAUSE
RESUME
EXIT
```

The system must preserve the exact state when paused.

------------------------------------------------------------------------

# 6. Carousel Controller

The carousel presents:

``` text
        PREVIOUS
           ↓
      [ CURRENT ]
           ↓
        UPCOMING
```

The current pattern is fully readable.

The previous pattern remains partially visible.

The upcoming pattern is partially visible.

The visual treatment communicates continuity rather than flashing
isolated prompts.

### User actions

``` text
SWIPE LEFT
→ recycle / bank

SWIPE RIGHT
→ discard from active rotation

TAP
→ inspect pattern

READ
→ user reads current pattern

FOLLOW
→ AI voice guides while visual remains synchronized

PAUSE
→ freeze session

RESUME
→ restore exact session state
```

The terminology for left/right actions must be configurable because the
visual direction and semantic action should not become permanently
coupled.

------------------------------------------------------------------------

# 7. Separation of Three States

This is mandatory.

## Presentation State

What the user sees.

``` text
previous
current
upcoming
visual opacity
position
reading state
```

## Processing State

What the engine is doing.

``` text
phase
pattern
channel
protocol
timer
AI action
```

## Evidence State

What the system believes has actually happened.

``` text
response
change
non-change
somatic observation
behavioral evidence
negative evidence
confidence
```

Example:

A pattern can disappear from the carousel while remaining unresolved in
the Evidence Model.

Therefore:

``` text
VISUALLY COMPLETE
≠
PROCESSING COMPLETE
≠
VERIFIED CHANGE
```

------------------------------------------------------------------------

# 8. Eight Required Algorithms

## Algorithm A — Pattern Selection

Inputs:

``` text
relevance
intensity
recurrence
goal relevance
context relevance
prior attempts
dependency relationships
replacement risk
user preference
```

Output:

``` text
candidate patterns
priority
confidence
selection rationale
```

The algorithm must be explainable.

## Algorithm B — Queue Construction

Build an ordered sequence rather than simply sorting by intensity.

Consider:

``` text
pattern dependency
shared root
context
previous releases
known replacement patterns
session capacity
protocol requirements
```

Output:

``` text
previous/current/upcoming
```

## Algorithm C — Channel Activation

Map the selected pattern into the configured release channels.

``` text
believing
perceiving
thinking
behaving
acting
feeling
speaking
somatic
```

The protocol determines which channels are active.

## Algorithm D — Adaptive Release

Observe session input and determine whether the protocol should:

``` text
continue
slow
pause
repeat
advance
reassess
```

Important:

The algorithm records observations. It must not automatically interpret
every physical sensation as evidence of therapeutic change.

## Algorithm E — Reframe Generation

``` text
LIMITING PATTERN
      ↓
IDENTIFY STRUCTURE
      ↓
IDENTIFY DESIRED TRUTH
      ↓
GENERATE "I KNOW..."
      ↓
CONSISTENCY CHECK
      ↓
PRESENT REFRAME
```

The generated reframe must remain traceable to the pattern.

## Algorithm F — Immediate Verification

Compare the user’s response before and after the intervention.

Possible outcomes:

``` text
changed
unchanged
stronger
unclear
transformed
replaced
```

Never reduce this to:

``` text
released = true
```

## Algorithm G — Pattern Replacement Detection

Detect:

``` text
OLD PATTERN
    ↓
WEAKENING
    ↓
NEW PATTERN
```

Example:

``` text
fear of failure
       ↓
weakened
       ↓
perfectionism emerges
```

The system must preserve both relationships.

A weakening pattern is not necessarily a completed pattern.

## Algorithm H — Negative Evidence Detection

Record when a historically expected response fails to occur.

``` yaml
NegativeEvidence:
  expected_pattern
  trigger
  observed_response
  context_match
  prior_frequency
  confidence
```

Example:

``` text
Historical:
executive question → freeze

Current:
executive question → no freeze
```

This is a longitudinal integration signal.

------------------------------------------------------------------------

# 9. Somatic Feedback Model

Somatic information should be captured as observations.

``` yaml
SomaticEvent:
  session_id
  pattern_id

  location
  sensation

  intensity_before
  intensity_during
  intensity_after

  direction:
    increased
    decreased
    moved
    disappeared
    unchanged

  user_reported
  timestamp
```

Do not infer causality merely because a somatic sensation changed during
a release.

Causal confidence is a separate calculation.

------------------------------------------------------------------------

# 10. Causal Confidence

The system should distinguish:

``` text
OBSERVED
CORRELATED
SUPPORTED
STRONGLY SUPPORTED
UNVERIFIED
```

Potential inputs:

``` text
baseline
intervention
immediate change
repeated response
context replication
behavioral evidence
negative evidence
longitudinal persistence
alternative explanations
```

The system should become more confident when the same change reproduces
across relevant contexts.

------------------------------------------------------------------------

# 11. Bank / Recycle / Discard / Vault

These are different operations.

### Active Bank

Available for future processing.

### Recycle

Return to active rotation later.

### Discard

Remove from the current active experience.

### Vault

Historical record retained for intelligence.

Therefore:

``` text
DISCARD
  ↓
remove from active queue
  ↓
retain historical trace
```

Nothing important should disappear merely because the user swiped it
away.

------------------------------------------------------------------------

# 12. Gamification System

Gamification should reward process and embodiment rather than volume.

Possible achievement events:

``` text
PREPARED
STAYED_PRESENT
OBSERVED
COMPLETED_RELEASE
COMPLETED_REFRAME
COMPLETED_COOLDOWN
RETURNED_TO_PATTERN
RECOGNIZED_REPLACEMENT
DETECTED_NEGATIVE_EVIDENCE
DEMONSTRATED_BEHAVIORAL_CHANGE
MAINTAINED_CHANGE
CROSS_CONTEXT_INTEGRATION
```

Avoid:

``` text
50 patterns released = automatically "healed"
```

The game layer must consume verified events from the Evidence System.

------------------------------------------------------------------------

# 13. Longitudinal Intelligence

Maintain five trajectories:

``` text
1. INTERNAL
2. BEHAVIORAL
3. CONTEXTUAL
4. OUTCOME
5. INTEGRATION
```

Integration asks:

> Does the observed change persist when the person encounters the
> conditions that previously activated the pattern?

Therefore:

``` text
RELEASE ≠ INTEGRATION
INTEGRATION ≠ OUTCOME
```

All three remain independently measurable.

------------------------------------------------------------------------

# 14. Trace Graph

Patterns become nodes.

Relationships become edges.

``` text
PATTERN
 ├── caused_by / associated_with
 ├── triggered_by
 ├── expressed_as
 ├── located_in
 ├── replaced_by
 ├── reinforced_by
 ├── released_with
 └── observed_again_in
```

Example:

``` text
FEAR OF FAILURE
       │
       ├──→ PERFECTIONISM
       │
       ├──→ EXECUTIVE CONTEXT
       │
       ├──→ CHEST TENSION
       │
       └──→ AVOIDANCE
```

The graph is what allows the AI to understand relationships rather than
treating every pattern as an isolated item.

------------------------------------------------------------------------

# 15. Learning Loop

After every session:

``` text
SESSION EVENTS
      ↓
EVIDENCE NORMALIZATION
      ↓
TRACE GRAPH UPDATE
      ↓
PATTERN STATE UPDATE
      ↓
REPLACEMENT DETECTION
      ↓
NEGATIVE EVIDENCE UPDATE
      ↓
CAUSAL CONFIDENCE UPDATE
      ↓
PERSONAL MODEL UPDATE
```

Population-level learning must remain separate from the person’s
evidence.

``` text
POPULATION PRIORS
        ↓
candidate guidance

PERSONAL EVIDENCE
        ↓
actual decision
```

Population data must never override strong personal evidence.

------------------------------------------------------------------------

# 16. API / Service Boundaries

Recommended services:

``` text
PatternService
ReleaseSessionService
ReleaseQueueService
ProtocolService
HandshakeService
ReleaseEngine
SomaticService
EvidenceService
VerificationService
TraceGraphService
LongitudinalService
GamificationService
LearningService
```

The UI communicates with the Release Engine rather than directly
manipulating the intelligence layer.

------------------------------------------------------------------------

# 17. Event Bus

Use domain events to decouple the system.

``` text
PatternSelected
PatternPresented
PatternActivated
ReleaseStarted
SomaticObserved
PatternRecycled
PatternDiscarded
ReframeStarted
ReframeCompleted
CooldownStarted
VerificationCompleted
PatternReplaced
NegativeEvidenceDetected
SessionCompleted
```

Multiple systems can subscribe without coupling the Release Engine to
them.

For example:

``` text
VerificationCompleted
       ├──→ EvidenceService
       ├──→ TraceGraphService
       ├──→ GamificationService
       └──→ LongitudinalService
```

------------------------------------------------------------------------

# 18. Required Tests

The next AI must not simply implement the happy path.

## State tests

Test:

``` text
normal completion
pause
resume
early exit
interruption
re-entry
empty queue
single pattern
large queue
```

## Decision tests

Test:

``` text
recycle
discard
repeat
skip
```

## Evidence tests

Test:

``` text
strong response
weak response
no response
contradictory response
unclear response
pattern replacement
negative evidence
```

## Context tests

Test:

``` text
same trigger / same context
same trigger / different context
different trigger / same pattern
different trigger / different context
```

## AI tests

Test:

``` text
incorrect protocol
insufficient evidence
contradictory evidence
low confidence
high confidence
missing pattern
invalid contract
```

------------------------------------------------------------------------

# 19. Acceptance Criteria

The implementation is not complete until the following are true.

### Session

A user can enter, pause, resume, complete, or exit a release session
without losing state.

### Carousel

The user can see:

``` text
previous
current
upcoming
```

and navigate without losing processing state.

### Voice

AI guidance remains synchronized with the actual Release Engine state.

### Decisions

Every recycle/discard decision becomes an event and preserves historical
trace.

### Protocol

Different release/reframe configurations can be selected without
changing application logic.

### Evidence

The system records what happened rather than merely what the user was
instructed to do.

### Verification

The system can distinguish:

``` text
changed
unchanged
unclear
stronger
transformed
replaced
```

### Longitudinal

The system can later detect:

``` text
recurrence
negative evidence
pattern replacement
cross-context change
behavioral change
outcome change
```

### Learning

The personal model updates from verified evidence.

### Gamification

Achievements derive from actual session events and evidence rather than
self-reported completion alone.

------------------------------------------------------------------------

# 20. Implementation Order

Build in this order.

``` text
P0
Domain schemas
        ↓
P0
Release state machine
        ↓
P0
Protocol Registry
        ↓
P0
AI Handshake
        ↓
P0
Release Engine
        ↓
P0
Event model
        ↓
P1
Release Queue
        ↓
P1
Carousel Controller
        ↓
P1
Somatic / Evidence capture
        ↓
P1
Immediate Verification
        ↓
P1
Trace Graph integration
        ↓
P2
Replacement detection
        ↓
P2
Negative evidence
        ↓
P2
Longitudinal intelligence
        ↓
P2
Gamification
        ↓
P3
Population learning / optimization
```

------------------------------------------------------------------------

# 21. Non-Negotiable Design Principles

``` text
1. Never confuse presentation with processing.

2. Never confuse processing completion with evidence of change.

3. Never destroy historical intelligence because a user discards a pattern.

4. Never treat a user's subjective report as the only evidence.

5. Never infer causality from temporal sequence alone.

6. Never let population priors override strong personal evidence.

7. Never hard-code one release protocol.

8. Never allow the AI to improvise outside the active protocol contract.

9. Every meaningful action becomes an event.

10. Every significant state transition is recoverable.

11. Every intervention has a reason.

12. Every claimed change has a verification path.

13. Every verified change can be tracked longitudinally.

14. Gamification rewards engagement and embodiment, not unsupported claims of resolution.
```

------------------------------------------------------------------------

# 22. Deliverables for the Next AI

The next AI should produce these implementation artifacts:

``` text
01. Canonical Release Domain Schema
02. Release State Machine Specification
03. Protocol Registry Specification
04. AI Handshake Contract Specification
05. Release Engine Technical Design
06. Queue Construction Algorithm
07. Pattern Selection Algorithm
08. Adaptive Release Algorithm
09. Reframe Generation Algorithm
10. Verification Algorithm
11. Pattern Replacement Algorithm
12. Negative Evidence Algorithm
13. Somatic Event Schema
14. Evidence Model
15. Trace Graph Schema
16. Event Taxonomy
17. API / Service Contracts
18. Carousel Interaction Specification
19. Gamification Event Specification
20. Longitudinal Intelligence Specification
21. Test Matrix
22. Acceptance Criteria
23. Implementation Sequence
24. Failure / Recovery Specification
```

## Final Handoff Instruction

The next AI should **not redesign the conceptual model unless an
implementation conflict is discovered**.

Its job is to take this architecture and produce:

``` text
SCHEMA
   ↓
INTERFACES
   ↓
STATE MACHINES
   ↓
ALGORITHMS
   ↓
EVENTS
   ↓
SERVICES
   ↓
UI CONTRACTS
   ↓
TESTS
   ↓
IMPLEMENTATION
```

The target is not a document that merely describes Release Intelligence.

The target is a **buildable specification in which another AI can
implement the subsystem without having to infer the missing mechanics.**

# 23. Operational Release Protocol Addendum

This section captures the live-session protocol discussed for the
product experience.

## 23.1 Preparation

The intended preparation sequence is:

> Sit down, relax. This moment is for you. Make sure you’re in a quiet
> place so that you can feel the sensations without distraction. When
> you are ready sit back, relax, turn your senses inward and follow the
> words in your mind as you hear them and feel where they land in the
> body as they release. Do not resist it. Remember you are the observer
> of the story, not the person that the thing happened to.

The purpose is to establish:

``` text
QUIET ENVIRONMENT
RELAXED ATTENTION
SENSES INWARD
OBSERVER POSITION
READINESS
```

The system should not require a specific emotional result before
continuing.

## 23.2 Release Activation

The AI guides the selected pattern through the release channels.

Core language:

> I’m letting go of believing, perceiving, thinking, behaving, acting,
> feeling…

The selected pattern is then inserted into the configured channel
statements.

The release engine records:

``` text
pattern
channel
side
iteration
timestamp
completion
```

## 23.3 Release Counts

Default configurations discussed:

``` text
50 LEFT / 50 RIGHT
25 LEFT / 25 RIGHT
10 LEFT / 10 RIGHT
ADAPTIVE
CUSTOM
```

The counts belong to the protocol configuration.

They are not hard-coded into the UI.

## 23.4 Reframe

After release, the system moves to REFRAME.

Do not use the earlier term “INSTALLING.”

The reframe uses:

``` text
I know that I am...
```

or:

``` text
I know...
```

followed by the supported reframed truth.

Example:

``` text
LIMITING PATTERN
I am afraid to speak up.

REFRAME
I know that I can speak clearly even when fear is present.
```

The reframe is independently recorded and verified.

## 23.5 Cooldown

After reframe:

``` text
2–5 MINUTES
```

of inward observation.

The user remains still and observes.

The timer is visible but quiet.

The system records:

``` text
started
paused
resumed
completed
```

Cooldown completion is not evidence of resolution.

## 23.6 Immediate Verification

At the end:

``` text
What changed?
```

Possible responses:

``` text
I feel different
I see it differently
Something moved
Nothing changed
I'm not sure
```

The system records the user’s actual selection.

It does not convert the selection into a stronger claim than the
evidence supports.

------------------------------------------------------------------------

# 24. Release Carousel Product Specification

The carousel is not merely a visual component.

It is the user’s continuous awareness of the release queue.

The user sees:

``` text
PREVIOUS
CURRENT
UPCOMING
```

The current pattern is fully readable.

The previous pattern remains partially visible.

The upcoming pattern remains partially visible.

This produces continuity:

``` text
WHAT JUST PASSED
WHAT IS HERE
WHAT IS NEXT
```

## 24.1 Carousel Actions

``` text
SWIPE LEFT
RECYCLE / BANK

SWIPE RIGHT
DISCARD FROM ACTIVE ROTATION

TAP
INSPECT

READ
READ CURRENT PATTERN

FOLLOW
FOLLOW AI VOICE

PAUSE
FREEZE EXACT STATE

RESUME
RESTORE EXACT STATE
```

The semantic mapping must be configurable.

## 24.2 Carousel Requirements

The carousel must:

1.  Never lose the current pattern during animation.
2.  Never advance the processing engine merely because a visual
    animation completed.
3.  Preserve queue state across pause/resume.
4.  Preserve historical decisions.
5.  Allow inspection without changing processing state.
6.  Allow the user to see what is next.
7.  Keep voice synchronized with the actual engine state.

------------------------------------------------------------------------

# 25. Release Queue State

``` yaml
ReleaseQueue:
  session_id

  previous:
    pattern_ids[]

  current:
    pattern_id
    index
    presentation_state

  upcoming:
    pattern_ids[]

  completed:
    pattern_ids[]

  recycled:
    pattern_ids[]

  discarded:
    pattern_ids[]
```

The queue is mutable during the session.

The historical event stream is immutable.

Therefore:

``` text
QUEUE = CURRENT STATE
EVENT STREAM = HISTORICAL TRUTH
```

------------------------------------------------------------------------

# 26. Release Decision Semantics

## Recycle

The pattern remains active in the broader personal work system and may
return to a future session.

## Discard

The pattern leaves the current active rotation.

It is not deleted.

## Continue

The current protocol continues.

## Skip

If supported by the active protocol, the pattern is bypassed while
remaining historically recorded.

Every decision generates a domain event.

------------------------------------------------------------------------

# 27. Pattern Visibility

The user should be able to see:

``` text
PREVIOUS PATTERN
CURRENT PATTERN
UPCOMING PATTERN
```

The current pattern can optionally be expanded into:

``` text
Pattern
Why it is here
What it connects to
Where it has appeared
What has happened before
```

However, the reading should remain optional.

The session should work as a follow-along experience without requiring
the user to read every explanation.

------------------------------------------------------------------------

# 28. Gamification Event Contract

Gamification consumes domain events.

Example:

``` yaml
AchievementEvent:
  id
  user_id
  source_event_id
  achievement_type
  pattern_id
  timestamp
  evidence_ids[]
```

Candidate achievement types:

``` text
FIRST_IDENTIFICATION
FIRST_REFRAME
FIRST_RELEASE
FIRST_COOLDOWN
FIRST_VERIFICATION

THREE_DAY_RELEASE
SEVEN_DAY_RELEASE

RITUAL_COMPLETED
QUARTERLY_GOAL_COMPLETED

LIMITER_RELEASED
COMPLEX_RELEASED
HYPER_COMPLEX_RELEASED

RETURNED_TO_PATTERN
RECOGNIZED_REPLACEMENT
DETECTED_NEGATIVE_EVIDENCE
DEMONSTRATED_BEHAVIORAL_CHANGE
MAINTAINED_CHANGE
CROSS_CONTEXT_INTEGRATION
```

The reward language should tell a developmental story without pretending
the system has proven a permanent identity change.

------------------------------------------------------------------------

# 29. Longitudinal Release Loop

The release protocol does not end at session completion.

``` text
SESSION
  ↓
IMMEDIATE VERIFICATION
  ↓
REAL WORLD
  ↓
TRIGGER
  ↓
OBSERVATION
  ↓
BEHAVIOR
  ↓
OUTCOME
  ↓
NEW EVIDENCE
  ↓
TRACE UPDATE
  ↓
PATTERN STATE UPDATE
```

This is how a release becomes part of the larger intelligence system.

------------------------------------------------------------------------

# 30. Pattern Recurrence

When a pattern returns:

``` text
RECURRENCE
```

must not automatically mean:

``` text
FAILED RELEASE
```

Possible explanations include:

``` text
incomplete change
new context
stronger trigger
different pattern
pattern replacement
temporary state change
insufficient evidence
```

The system must investigate rather than judge.

------------------------------------------------------------------------

# 31. Pattern Replacement

When an old pattern weakens and a new pattern becomes visible:

``` text
OLD
 ↓
WEAKENING
 ↓
NEW
```

the new pattern enters investigation.

Example:

``` text
FEAR
 ↓
weakens
 ↓
PERFECTIONISM
```

The system may represent a relationship:

``` text
POSSIBLY_REPLACED_BY
```

until sufficient evidence exists.

------------------------------------------------------------------------

# 32. Release Intelligence and Mirror

Mirror should not invent meaning after a release.

Mirror consumes:

``` text
release events
reframe events
verification
behavioral observations
context
outcomes
recurrence
replacement
negative evidence
```

Mirror then describes the current developmental thread.

Example:

``` text
You noticed avoidance.
You stayed with it.
You located the response.
You worked with it.
You noticed a change.
Now the next test is what happens when the situation returns.
```

Mirror is interpretation over evidence.

It is not the evidence layer itself.

------------------------------------------------------------------------

# 33. Release Intelligence and Ladder

Ladder measures the turning of the loop.

Release Intelligence produces the events that allow Ladder to recognize
turns.

The distinction remains:

``` text
RULER
How far?

TURN
Is the loop turning?
```

A completed release session can contribute to a turn when the required
loop is closed.

A volume count alone should not determine progress.

------------------------------------------------------------------------

# 34. Release Intelligence and Daily Work

Daily Work should provide:

``` text
TODAY'S OBJECTIVE
TARGET PATTERN
RITUAL
RELEASE PROTOCOL
REFRAME
VERIFICATION
NEXT ACTION
```

This creates:

``` text
DAILY INTENTION
      ↓
RELEASE
      ↓
REFRAME
      ↓
REAL WORLD ACTION
      ↓
OBSERVATION
```

The system then learns whether the intended change appeared outside the
session.

------------------------------------------------------------------------

# 35. Release Intelligence and Trace

The final relationship is:

``` text
STORY
 ↓
IMPRESSION
 ↓
PATTERN
 ↓
RELEASE
 ↓
REFRAME
 ↓
OBSERVATION
 ↓
BEHAVIOR
 ↓
OUTCOME
```

The Trace Graph connects the chain.

This allows ATUNED to stop treating every session as an isolated event.

The user’s history becomes a living model.

------------------------------------------------------------------------

# 36. Implementation Handshake for the Next AI

The next AI must:

1.  Read this entire TDD.
2.  Read the existing Source Architecture.
3.  Read the Intelligence System TDD V3.
4.  Audit the current `atuned.html`.
5.  Map every requirement to:

``` text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

6.  Do not assume documentation equals implementation.
7.  Identify contradictions between:

``` text
TDD
SCHEMA
CODE
RUNTIME
TESTS
CANON
```

8.  Prioritize:

``` text
P0
P1
P2
P3
```

9.  Implement only after the audit.
10. Run tests.
11. Re-audit.
12. Report:

``` text
IMPLEMENTED
TESTED
UNVERIFIED
BLOCKED
CONFLICTS
NEXT PRIORITIES
```

------------------------------------------------------------------------

# 37. Final Build Target

The final architecture should be implementable as:

``` text
SCHEMA
   ↓
INTERFACES
   ↓
STATE MACHINES
   ↓
ALGORITHMS
   ↓
EVENTS
   ↓
SERVICES
   ↓
UI CONTRACTS
   ↓
TESTS
   ↓
IMPLEMENTATION
```

The target is not a document that explains the Release Protocol.

The target is a specification another AI can implement without inventing
the missing mechanics.
