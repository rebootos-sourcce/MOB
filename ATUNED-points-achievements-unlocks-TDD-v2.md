# ATÜNED — Points, Achievements & Unlocks System
## Technical Design Document / Implementation Handoff

**Version:** 1.0  
**Date:** 2026-10-01  
**Status:** Design specification

## 1. Purpose

This document defines Atüned's points, achievements, badges, milestones, depth progression, and evidence driven unlock system.

The system exists to celebrate meaningful action, make progress visible, reward consistency, recognize increasing depth, expose deeper views of the user's system, and connect activity to knowledge, protocols, rituals, evidence, and embodiment.

### Core principle

> The system celebrates what the person does and what the system can verify changed. It does not score the person's worth or identity.

## 2. Core Architecture

```text
ACTIVITY
    ↓
EVENT LEDGER
    ↓
ACHIEVEMENT ENGINE
    ↓
POINTS ENGINE
    ↓
UNLOCK ENGINE
```

Readings remain separate:

```text
CQ / INTEGRITY / REGULATION / AVATAR ALIGNMENT
                         ↑
                      READINGS
```

Four distinct outputs:

| System | Meaning |
|---|---|
| Points | Accumulated verified activity |
| Achievements | Meaningful accomplishments |
| Readings | Current state |
| Unlocks | New capabilities, knowledge, or perspectives |

## 3. Existing Atüned Ontology

```text
CHARGE
  ↓
FETTER / ADDRESS
  ↓
SABOTEUR
  ↓
COMPLEX
  ↓
HYPER-COMPLEX
  ↓
CHARACTER / MASK
```

A Complex is where saboteurs join.

A Hyper-Complex is where complexes join.

A derived structure must retain provenance and status:

```text
CANONICAL
INFERRED
EMERGENT
PROVISIONAL
```

## 4. Progression Model

Progression has three independent dimensions:

```text
BREADTH
  How many different things did I engage?

DEPTH
  How deeply did I work with the pattern system?

CONSISTENCY
  Did I keep turning the system through time?
```

Transformation is observed separately:

```text
STATE CHANGE
  What changed in the person's current readings?
```

Therefore:

```text
Activity ≠ Depth
Depth ≠ CQ
CQ ≠ Points
Points ≠ Worth
```

## 5. Event Ledger

Every rewardable action enters an immutable event ledger.

```ts
type ProgressEvent = {
  id: string;
  userId: string;
  type: ProgressEventType;
  occurredAt: string;
  source: EventSource;
  sourceId?: string;

  subject?: {
    type: SubjectType;
    id: string;
  };

  evidence: Evidence[];
  metadata?: Record<string, unknown>;

  schemaVersion: number;
};
```

### Event types

```ts
type ProgressEventType =
  | "journal.entry.completed"
  | "journal.day.completed"
  | "ritual.completed"
  | "protocol.completed"
  | "protocol.pattern.executed"
  | "accountability.day.completed"
  | "fetter.released"
  | "node.completed"
  | "saboteur.identified"
  | "saboteur.released"
  | "saboteur.integrated"
  | "complex.detected"
  | "complex.mapped"
  | "complex.released"
  | "complex.resolved"
  | "complex.integrated"
  | "hypercomplex.detected"
  | "hypercomplex.mapped"
  | "hypercomplex.released"
  | "hypercomplex.resolved"
  | "hypercomplex.integrated"
  | "mask.revealed"
  | "mask.released"
  | "character.embodied"
  | "cq.baseline.recorded"
  | "cq.milestone.reached"
  | "cq.improvement.verified"
  | "turn.closed"
  | "integration.verified";
```

## 6. Event Integrity

Events must be append-only, idempotent, timestamped, attributable to a source action, and validated before reward calculation.

```ts
reward(event) =
  if ledger.contains(event.id)
    return NO_OP
  else
    append(event)
    evaluate(event)
```

The same event must never award points twice.

## 7. Points Economy

Points are an additive celebration currency.

There is no negative point balance. A setback does not remove previously earned points.

### Initial tuning values

| Event | Points |
|---|---:|
| Journal entry | +1 |
| Journal day | +1 |
| Ritual completed | +5 |
| Fetter released | +5 |
| Protocol completed | +10 |
| Pattern executed in protocol | +1 |
| Saboteur released | +15 |
| Complex resolved | +30 |
| Hyper-Complex resolved | +75 |
| Mask released | +50 |
| Integration verified | +20 |
| CQ +1 verified | +1 |
| CQ +5 milestone | +5 |
| CQ +10 milestone | +10 |
| CQ +15 milestone | +15 |
| CQ +20 milestone | +20 |

These are initial tuning parameters, not immutable constants.

## 8. Point Rules

Points reward evidence of action.

Valid examples:

```text
Complete ritual
Run protocol
Release fetter
Resolve complex
Write qualifying journal entry
Maintain accountability
```

Invalid examples:

```text
Open screen
View badge
Read article
Click repeatedly
Toggle state without underlying action
```

For pattern work, track separately:

```text
total executions
unique patterns
unique nodes
unique domains
```

This prevents repeated execution of one easy pattern from being interpreted as broad transformation.

## 9. Achievement Model

```ts
type AchievementDefinition = {
  id: string;
  family: AchievementFamily;
  name: string;
  description: string;

  requirement: RequirementExpression;

  repeatable: boolean;
  pointReward?: number;

  unlockIds?: string[];

  rarityTarget?: RarityTarget;
  schemaVersion: number;
};
```

Families:

```ts
type AchievementFamily =
  | "activity"
  | "fetter"
  | "saboteur"
  | "complex"
  | "hypercomplex"
  | "mask"
  | "transformation"
  | "integration";
```

## 10. Activity Achievements

### Protocols

```text
First Protocol
3 Protocols
5 Protocols
10 Protocols
25 Protocols
50 Protocols
```

### Rituals

```text
First Ritual
5 Rituals
10 Rituals
25 Rituals
50 Rituals
100 Rituals
```

### Journal

```text
First Journal
10 Journal Days
30 Journal Days
50 Journal Days
100 Journal Days
```

### Accountability

```text
3 Days
7 Days
14 Days
30 Days
60 Days
90 Days
```

Streak definitions must use the canonical accountability engine.

## 11. Fetter Achievements

### Volume

```text
First Fetter
5 Fetters
10 Fetters
25 Fetters
50 Fetters
100 Fetters
```

### Depth

```text
Fetter Released From New Node
Fetters Across 3 Nodes
Complete a Node
Complete a Domain
```

## 12. Saboteur Achievements

```text
First Saboteur
3 Saboteurs
7 Saboteurs
Saboteur Identified
Saboteur Released
Saboteur Across Multiple Contexts
Saboteur Across Multiple Nodes
Saboteur Resolved Through Multiple Protocols
Saboteur Integrated
```

## 13. Complex Achievements

A Complex is a relationship among multiple patterns or saboteurs.

### Discovery

```text
Complex Detected
First Complex Mapped
Complex With 3+ Components
Complex Across Multiple Nodes
Complex Across Multiple Domains
```

### Release

```text
First Complex Released
3 Complexes Released
Complex Released Through One Protocol
Multiple Components Released From One Complex
```

### Resolution

```text
Complex Resolved
Recurring Complex Resolved
Complex No Longer Running
Complex Resolved Across Multiple Domains
Complex Integrated
```

## 14. Hyper-Complex Achievements

A Hyper-Complex is a higher order structure connecting multiple complexes.

### Discovery

```text
Hyper-Complex Detected
First Hyper-Complex Mapped
Hyper-Complex With 3+ Complexes
Cross-Domain Hyper-Complex
```

### Release

```text
First Hyper-Complex Released
Hyper-Complex Components Released
Multiple Complexes Released From One Hyper-Complex
```

### Resolution

```text
Hyper-Complex Resolved
Hyper-Complex No Longer Running
Cross-Domain Hyper-Complex Resolved
Hyper-Complex Integrated
Root System Resolved
```

## 15. Mask / Character Achievements

```text
First Mask Revealed
Mask Mapped
Mask Released
3 Masks Released
Character Pattern Resolved
New Character Embodied
Old Mask No Longer Running
```

These achievements describe transformation within Atüned's model and must not be presented as objective identity diagnoses.

## 16. Transformation Achievements

CQ remains a reading. The achievement system may recognize verified movement:

```text
CQ +1
CQ +5
CQ +10
CQ +15
CQ +20
CQ 50
CQ 75
CQ 90
CQ 100
```

### CQ anti-oscillation

Store:

```ts
type CQMilestone = {
  baseline: number;
  baselineAt: string;

  newHigh: number;
  newHighAt: string;

  sustained?: boolean;
  sustainedAt?: string;
};
```

Improvement rewards must be based on verified improvement from a defined baseline, not repeated fluctuation.

## 17. Integration Achievements

```text
RELEASED
  ↓
TRIGGER ENCOUNTERED
  ↓
OLD RESPONSE INTERRUPTED
  ↓
NEW RESPONSE CHOSEN
  ↓
REPEATED
  ↓
STABLE
  ↓
EMBODIED
```

Achievements:

```text
First Integration
Release Maintained
New Response Demonstrated
Old Response Interrupted
New Behavior Repeated
Pattern No Longer Running
Integration Across Contexts
Integration Across Relationships
Integration Across Domains
Embodied
```

## 18. Universal State Machine

```text
ENCOUNTER
  ↓
IDENTIFY
  ↓
MAP
  ↓
TEST
  ↓
RELEASE
  ↓
RESOLVE
  ↓
INTEGRATE
  ↓
EMBODY
```

Examples:

```text
Fetter:
IDENTIFY → RELEASE → INTEGRATE

Saboteur:
IDENTIFY → MAP → RELEASE → INTEGRATE

Complex:
DETECT → MAP → RELEASE → RESOLVE → INTEGRATE

Hyper-Complex:
DETECT → MAP → DECONSTRUCT → RESOLVE → INTEGRATE → EMBODY

Mask:
REVEAL → UNDERSTAND → RELEASE → REPLACE → EMBODY
```

## 19. Unlock Engine

Unlocks are evidence-driven.

Transformational unlocks must never be purchased solely with points.

```ts
type UnlockDefinition = {
  id: string;
  type: "capability" | "knowledge" | "perspective";

  trigger:
    | AchievementTrigger
    | EvidenceTrigger;

  payload: UnlockPayload;
};
```

### Capability unlocks

```text
Pattern Map
Complex Map
Integration Tracker
Protocol Customization
Advanced Ritual Builder
```

### Knowledge unlocks

```text
Saboteur Library
Complex Knowledge
Hyper-Complex Knowledge
Character / Mask Knowledge
```

### Perspective unlocks

```text
Pattern View
System View
Mask View
Avatar Comparison
Embodiment View
```

## 20. Core Unlock Rules

```text
First Fetter
→ Pattern Map

First Saboteur
→ Saboteur Library

First Complex
→ Complex Map

First Hyper-Complex
→ System View

First Mask
→ Character / Mask View

First Integration
→ Embodiment Tracker

CQ +10
→ Advanced CQ History

CQ 100
→ CQ Mastery visualization
```

## 21. Knowledge Integration

Knowledge is not a static article shelf.

Preferred flow:

```text
KNOWLEDGE
   ↓
PATTERN
   ↓
EVIDENCE
   ↓
PROTOCOL
   ↓
RITUAL
   ↓
RESULT
   ↓
UPDATED KNOWLEDGE
```

Knowledge should surface when the user has context for it.

Example:

```text
First Complex
      ↓
Complex Map unlocked
      ↓
Relevant Complex knowledge appears
      ↓
User tests protocol
      ↓
Journal records evidence
      ↓
Complex state updates
```

## 22. Achievement → Unlock → New Action

```text
ACTION
  ↓
VERIFIED EVENT
  ↓
POINTS
  ↓
ACHIEVEMENT
  ↓
UNLOCK
  ↓
NEW LENS / CAPABILITY
  ↓
NEW KNOWLEDGE
  ↓
NEW ACTION
  ↓
DEEPER EVIDENCE
```

## 23. Turn Integration

The existing Turn model remains authoritative:

```text
DISCOVER
  ↓
PLAY
  ↓
FLOW
  ↓
EMBODY
```

A closed circle is one Turn.

Possible achievements:

```text
First Turn
3 Turns
10 Turns
25 Turns
50 Turns
100 Turns
```

The achievement system must not create a competing Turn definition.

## 24. Achievement Evaluation

```ts
function processProgressEvent(event: ProgressEvent) {
  if (ledger.has(event.id)) return;

  validateEvent(event);
  ledger.append(event);

  const pointAwards = pointsEngine.evaluate(event);

  const state = projectionEngine.update(event);

  const achievements = achievementEngine.evaluate({
    event,
    state,
    ledger
  });

  for (const achievement of achievements) {
    achievementStore.grantOnce(
      event.userId,
      achievement.id,
      achievement.evidence
    );
  }

  const unlocks = unlockEngine.evaluate({
    event,
    state,
    achievements
  });

  unlockStore.grantEligible(unlocks);
}
```

## 25. Declarative Requirements

Achievement requirements should be declarative.

Example:

```json
{
  "all": [
    {
      "eventCount": {
        "type": "fetter.released",
        "gte": 10
      }
    }
  ]
}
```

Complex example:

```json
{
  "all": [
    {
      "entityState": {
        "type": "complex",
        "state": "resolved"
      }
    },
    {
      "entityComponentCount": {
        "type": "complex",
        "gte": 3
      }
    }
  ]
}
```

Breadth example:

```json
{
  "uniqueCount": {
    "eventType": "protocol.pattern.executed",
    "dimension": "domainId",
    "gte": 3
  }
}
```

## 26. Evidence Requirements

Every transformational achievement retains evidence.

```ts
type AchievementEvidence = {
  eventIds: string[];
  subjectIds?: string[];
  baseline?: number;
  resultingValue?: number;
  verifiedAt: string;
  ruleVersion: string;
};
```

The UI should support:

> Why did I earn this?

and show the evidence.

## 27. Anti-Farming

1. Same event ID cannot reward twice.
2. Count unique patterns, nodes, domains, and structures where appropriate.
3. Viewing, opening, scrolling, and clicking do not earn transformational points.
4. Setbacks do not subtract accumulated points.
5. Do not reward near misses.
6. Achievements do not expire.
7. No global leaderboard.
8. No forced competition.
9. Points cannot substitute for evidence.
10. Readings do not become XP.

## 28. Rarity Targets

| Class | Approx. users earning within 90 days |
|---|---:|
| Onboarding | 70–95% |
| Early | 30–70% |
| Intermediate | 10–30% |
| Advanced | 3–10% |
| Rare | 1–3% |
| Exceptional | <1% |

These are tuning targets, not promises.

The synthetic 1,000-person simulation used these directional reference points:

```text
First Complex       ≈ 24%
First Hyper-Complex ≈ 8%
First Mask          ≈ 11%
CQ +10              ≈ 11%
```

## 29. API Surface

```http
POST /v1/progress/events
GET  /v1/progress/events

GET /v1/progress/points
GET /v1/progress/points/history

GET /v1/achievements
GET /v1/achievements/earned
GET /v1/achievements/:id
GET /v1/achievements/:id/evidence

GET /v1/unlocks
GET /v1/unlocks/available
GET /v1/unlocks/:id

GET /v1/progress/summary
```

## 30. User Progress Model

```ts
UserProgress {
  userId
  pointsBalance
  lifetimePoints

  achievementIds[]
  unlockIds[]

  streakState
  cqMilestones[]

  counters {
    rituals
    protocols
    patterns
    journalDays
    fetters
    saboteurs
    complexes
    hypercomplexes
    masks
    integrations
    turns
  }

  schemaVersion
}
```

Counters are projections from the event ledger, not the ultimate source of truth.

## 31. Event Sourcing

```text
EVENTS
  ↓
PROJECTIONS
  ↓
COUNTERS
  ↓
ACHIEVEMENTS
  ↓
UNLOCKS
```

If a projection becomes corrupted, rebuild it from the event ledger.

## 32. Simulation

Run a 1,000-person, 90-day synthetic cohort.

Personas:

```text
10% Light
35% Steady
25% Deep
10% Power
20% Sporadic
```

Vary:

```text
session frequency
ritual completion
journal frequency
protocol frequency
pattern depth
release frequency
integration frequency
```

Measure:

```text
achievement coverage
achievement rarity
points distribution
unlock distribution
repeat activity
depth progression
breadth progression
consistency progression
CQ movement
farming behavior
dead-end behavior
```

Report:

```text
P10
P25
P50
P75
P90
P99
```

## 33. Anti-Gaming Simulation

Test:

### Ritual spam
One ritual repeated hundreds of times.

Expected:
- execution points may accumulate within policy;
- breadth achievements do not falsely trigger;
- depth achievements do not falsely trigger.

### Journal spam
Many low-content entries.

Expected:
- qualification rules prevent unlimited farming.

### Pattern spam
One easy pattern repeatedly executed.

Expected:
- execution count rises;
- breadth remains low;
- depth remains unchanged.

### Point injection
Artificially increase points.

Expected:
- transformational unlocks do not occur.

### CQ oscillation
70 → 75 → 70 → 75.

Expected:
- no repeated +5 improvement farming.

### Achievement replay
Same evidence submitted repeatedly.

Expected:
- achievement remains once-earned.

## 34. UI Architecture

### Progress Hub

```text
POINTS
247

ACHIEVEMENTS
19

UNLOCKED
7

CURRENT READINGS
CQ 74
```

Do not combine these into one score.

### Achievement Card

```text
FIRST COMPLEX

You mapped your first Complex.

Evidence:
• 3 connected patterns
• 2 Saboteurs
• 4 Fetters

UNLOCKED:
Complex Map
```

### Unlock Card

```text
NEW LENS

COMPLEX MAP

You can now see how multiple
patterns connect into a system.
```

The user should understand what changed immediately.

## 35. Analytics

Track:

```text
activation rate
first achievement time
first unlock time
median days to first Complex
median days to first Integration
median points at day 7 / 30 / 60 / 90
achievement coverage
unlock coverage
depth/breadth ratio
repeat activity after unlock
```

Primary product question:

> Did the progression system cause deeper engagement with the transformation loop?

Not:

> How many points did people earn?

## 36. Product Guardrails

The system must never:

- rank people against each other;
- imply a higher point total means a better person;
- remove earned progress because of setbacks;
- manufacture urgency around achievements;
- treat an inferred Complex as an objective diagnosis;
- turn CQ into XP;
- reward endless repetition over meaningful depth;
- hide evidence behind a score;
- make transformational capabilities purchasable with points.

## 37. Implementation Order

### Phase 1
Event ledger, validation, idempotency, storage.

### Phase 2
Counters, streak projection, point projection, CQ milestone projection.

### Phase 3
Declarative achievement engine.

### Phase 4
Unlock engine.

### Phase 5
Progress Hub, achievement cards, unlock cards, evidence drawer, Pattern Map, Complex Map, System View, Mask View, Integration Tracker.

### Phase 6
1,000-user / 90-day simulation and anti-farming simulation.

### Phase 7
Tune point values, thresholds, rarity, unlock timing, caps, and qualification rules.

## 38. Definition of Done

The system is ready when:

- every reward originates from a validated event;
- duplicate events cannot duplicate rewards;
- every transformational achievement has evidence;
- every unlock has a deterministic trigger;
- points cannot purchase transformational claims;
- CQ remains an independent reading;
- Complex and Hyper-Complex are first-class entities;
- achievements support breadth and depth;
- integration is represented;
- the Turn model remains authoritative;
- the 1,000-person simulation passes;
- anti-farming simulations pass;
- projections can be rebuilt from the event ledger;
- achievement and unlock definitions are versioned.

## 39. Final System Model

```text
                         ATÜNED
                            │
                 ┌──────────┴──────────┐
                 │                     │
             EXPERIENCE             READINGS
                 │                     │
      ┌──────────┼──────────┐      CQ / Integrity
      │          │          │      Regulation
    Ritual    Protocol    Journal   Avatar
      │          │          │
      └──────────┼──────────┘
                 ↓
             EVENT LEDGER
                 ↓
       ┌─────────┴─────────┐
       │                   │
     POINTS            ACHIEVEMENTS
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          FETTER       SABOTEUR       COMPLEX
                                         │
                                  HYPER-COMPLEX
                                         │
                                       MASK
                                         │
                                    INTEGRATION
                                         ↓
                                      UNLOCKS
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
               CAPABILITY             KNOWLEDGE          PERSPECTIVE
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         ↓
                                  DEEPER EXPERIENCE
                                         ↓
                                    NEW EVIDENCE
                                         ↓
                                       EMBODY
```

## Governing Rule

> **Atüned does not reward the user for becoming a higher-scoring person. It records what they did, recognizes what changed, and progressively gives them better tools for seeing and changing themselves.**
