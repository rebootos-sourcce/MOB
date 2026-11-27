# Atuned Release Intelligence
## Implementation Handoff for Next AI

### 0. Implementation Objective

Build the Release Intelligence subsystem as a closed-loop state-change system.

The system must:

1. Prepare the user.
2. Establish the observer state.
3. Select and sequence patterns.
4. Present patterns through a persistent release carousel.
5. Guide the release protocol through AI voice.
6. Capture user decisions and somatic observations.
7. Execute the reframe protocol.
8. Run cooldown.
9. Verify immediate change.
10. Preserve evidence.
11. Detect recurrence, replacement, and negative evidence over time.
12. Feed verified evidence back into the user's personal model.

The system must **not equate completion, emotional relief, or a user's declaration of release with verified resolution**.

---

# 1. Architectural Boundary

Release Intelligence consists of ten layers.

```text
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

---

# 2. Core Domain Objects

## 2.1 ReleaseSession

```yaml
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

```yaml
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

```yaml
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

```yaml
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

```text
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

---

# 3. Protocol Registry

The release mechanics must not be hard-coded.

Create a versioned Protocol Registry.

```yaml
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

```text
50 left / 50 right
25 left / 25 right
10 left / 10 right
Adaptive
Custom
```

without modifying the underlying Release Engine.

---

# 4. AI Handshake Contract

Before a significant intervention, the AI must construct and validate a session contract.

```yaml
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

```text
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

---

# 5. Release State Machine

```text
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

```text
PAUSE
RESUME
EXIT
```

The system must preserve the exact state when paused.

---

# 6. Carousel Controller

The carousel presents:

```text
        PREVIOUS
           ↓
      [ CURRENT ]
           ↓
        UPCOMING
```

The current pattern is fully readable.

The previous pattern remains partially visible.

The upcoming pattern is partially visible.

The visual treatment communicates continuity rather than flashing isolated prompts.

### User actions

```text
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

The terminology for left/right actions must be configurable because the visual direction and semantic action should not become permanently coupled.

---

# 7. Separation of Three States

This is mandatory.

## Presentation State

What the user sees.

```text
previous
current
upcoming
visual opacity
position
reading state
```

## Processing State

What the engine is doing.

```text
phase
pattern
channel
protocol
timer
AI action
```

## Evidence State

What the system believes has actually happened.

```text
response
change
non-change
somatic observation
behavioral evidence
negative evidence
confidence
```

Example:

A pattern can disappear from the carousel while remaining unresolved in the Evidence Model.

Therefore:

```text
VISUALLY COMPLETE
≠
PROCESSING COMPLETE
≠
VERIFIED CHANGE
```

---

# 8. Eight Required Algorithms

## Algorithm A — Pattern Selection

Inputs:

```text
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

```text
candidate patterns
priority
confidence
selection rationale
```

The algorithm must be explainable.

## Algorithm B — Queue Construction

Build an ordered sequence rather than simply sorting by intensity.

Consider:

```text
pattern dependency
shared root
context
previous releases
known replacement patterns
session capacity
protocol requirements
```

Output:

```text
previous/current/upcoming
```

## Algorithm C — Channel Activation

Map the selected pattern into the configured release channels.

```text
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

```text
continue
slow
pause
repeat
advance
reassess
```

Important:

The algorithm records observations. It must not automatically interpret every physical sensation as evidence of therapeutic change.

## Algorithm E — Reframe Generation

```text
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

Compare the user's response before and after the intervention.

Possible outcomes:

```text
changed
unchanged
stronger
unclear
transformed
replaced
```

Never reduce this to:

```text
released = true
```

## Algorithm G — Pattern Replacement Detection

Detect:

```text
OLD PATTERN
    ↓
WEAKENING
    ↓
NEW PATTERN
```

Example:

```text
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

```yaml
NegativeEvidence:
  expected_pattern
  trigger
  observed_response
  context_match
  prior_frequency
  confidence
```

Example:

```text
Historical:
executive question → freeze

Current:
executive question → no freeze
```

This is a longitudinal integration signal.

---

# 9. Somatic Feedback Model

Somatic information should be captured as observations.

```yaml
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

Do not infer causality merely because a somatic sensation changed during a release.

Causal confidence is a separate calculation.

---

# 10. Causal Confidence

The system should distinguish:

```text
OBSERVED
CORRELATED
SUPPORTED
STRONGLY SUPPORTED
UNVERIFIED
```

Potential inputs:

```text
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

The system should become more confident when the same change reproduces across relevant contexts.

---

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

```text
DISCARD
  ↓
remove from active queue
  ↓
retain historical trace
```

Nothing important should disappear merely because the user swiped it away.

---

# 12. Gamification System

Gamification should reward process and embodiment rather than volume.

Possible achievement events:

```text
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

```text
50 patterns released = automatically "healed"
```

The game layer must consume verified events from the Evidence System.

---

# 13. Longitudinal Intelligence

Maintain five trajectories:

```text
1. INTERNAL
2. BEHAVIORAL
3. CONTEXTUAL
4. OUTCOME
5. INTEGRATION
```

Integration asks:

> Does the observed change persist when the person encounters the conditions that previously activated the pattern?

Therefore:

```text
RELEASE ≠ INTEGRATION
INTEGRATION ≠ OUTCOME
```

All three remain independently measurable.

---

# 14. Trace Graph

Patterns become nodes.

Relationships become edges.

```text
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

```text
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

The graph is what allows the AI to understand relationships rather than treating every pattern as an isolated item.

---

# 15. Learning Loop

After every session:

```text
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

Population-level learning must remain separate from the person's evidence.

```text
POPULATION PRIORS
        ↓
candidate guidance

PERSONAL EVIDENCE
        ↓
actual decision
```

Population data must never override strong personal evidence.

---

# 16. API / Service Boundaries

Recommended services:

```text
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

The UI communicates with the Release Engine rather than directly manipulating the intelligence layer.

---

# 17. Event Bus

Use domain events to decouple the system.

```text
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

Multiple systems can subscribe without coupling the Release Engine to them.

For example:

```text
VerificationCompleted
       ├──→ EvidenceService
       ├──→ TraceGraphService
       ├──→ GamificationService
       └──→ LongitudinalService
```

---

# 18. Required Tests

The next AI must not simply implement the happy path.

## State tests

Test:

```text
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

```text
recycle
discard
repeat
skip
```

## Evidence tests

Test:

```text
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

```text
same trigger / same context
same trigger / different context
different trigger / same pattern
different trigger / different context
```

## AI tests

Test:

```text
incorrect protocol
insufficient evidence
contradictory evidence
low confidence
high confidence
missing pattern
invalid contract
```

---

# 19. Acceptance Criteria

The implementation is not complete until the following are true.

### Session

A user can enter, pause, resume, complete, or exit a release session without losing state.

### Carousel

The user can see:

```text
previous
current
upcoming
```

and navigate without losing processing state.

### Voice

AI guidance remains synchronized with the actual Release Engine state.

### Decisions

Every recycle/discard decision becomes an event and preserves historical trace.

### Protocol

Different release/reframe configurations can be selected without changing application logic.

### Evidence

The system records what happened rather than merely what the user was instructed to do.

### Verification

The system can distinguish:

```text
changed
unchanged
unclear
stronger
transformed
replaced
```

### Longitudinal

The system can later detect:

```text
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

Achievements derive from actual session events and evidence rather than self-reported completion alone.

---

# 20. Implementation Order

Build in this order.

```text
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

---

# 21. Non-Negotiable Design Principles

```text
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

---

# 22. Deliverables for the Next AI

The next AI should produce these implementation artifacts:

```text
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

The next AI should **not redesign the conceptual model unless an implementation conflict is discovered**.

Its job is to take this architecture and produce:

```text
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

The target is a **buildable specification in which another AI can implement the subsystem without having to infer the missing mechanics.**
