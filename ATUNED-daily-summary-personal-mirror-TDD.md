# ATÜNED — Daily Summary / Personal Mirror System
## Technical Design Document (TDD)

**Status:** Implementation-ready design  
**Purpose:** Define the Summary Engine as Atüned's daily integration layer: a grounded, practical interpretation of the user's current state, story, behavior, patterns, practices, and observed change.

---

## 1. Product Definition

The Summary is not a dashboard and not a report card.

It is a **daily mirror** answering:

> What appears to be operating through me today, what is changing, what is getting in the way, and what deserves attention next?

The underlying model may incorporate energetic/celestial systems, archetypes, psychology, patterns, masks, saboteurs, complexes, rituals, integrity, intention, purpose, boundaries, journal evidence, and achievement history.

The user-facing language must remain **grounded, practical, observable, and non-deterministic**.

### Core rule

**Complex underneath. Simple on the surface. Evidence-based in the language.**

---

# 2. Product Goals

### P0 goals

1. Generate a fresh daily summary.
2. Explain the user's current behavioral state in plain language.
3. Connect desired identity to actual behavior.
4. Show what is changing and what still interferes.
5. Incorporate intention and integrity.
6. Connect patterns to rituals and observed outcomes.
7. Preserve daily summaries as historical snapshots.
8. Detect meaningful changes across time.
9. Identify the highest-leverage area for attention.
10. Maintain strict separation between interpretation and evidence.

### Non-goals

- Diagnosing mental or physical conditions.
- Predicting a user's future as fact.
- Treating astrology, numerology, Human Design, or archetypes as scientific measurements.
- Assigning intrinsic worth to a user.
- Replacing the journal/evidence layer with inference.
- Turning the Summary into another points dashboard.

---

# 3. Conceptual Model

```text
USER STORY
   |
   +-- Energetic / profile inputs
   +-- Archetypal preferences
   +-- Desired identity
   +-- Shadow/interference models
   +-- Patterns
   +-- Masks / Saboteurs
   +-- Complexes / Hyper-complexes
   +-- Purpose
   +-- Boundaries
   +-- Intention
   +-- Ritual activity
   +-- Journal evidence
   +-- Integrity evidence
   +-- Achievement/activity history
             |
             v
       SUMMARY ENGINE
             |
             +--> Current State
             +--> What is expressing
             +--> What is interfering
             +--> What changed
             +--> What needs attention
             +--> Suggested next action
             |
             v
       DAILY SNAPSHOT
             |
             v
       LONGITUDINAL HISTORY
```

---

# 4. Core Domain Objects

## 4.1 Person

```json
{
  "id": "person_id",
  "avatar_id": "avatar_id",
  "purpose_id": "purpose_id",
  "boundary_id": "boundary_id",
  "profile_ids": [],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 4.2 Avatar

Defines who the user intends to become.

```json
{
  "id": "avatar_id",
  "qualities": [],
  "values": [],
  "behaviors": [],
  "communication_traits": [],
  "desired_archetypes": [],
  "anti_traits": [],
  "success_definition": [],
  "updated_at": "timestamp"
}
```

## 4.3 Energetic/Profile Configuration

```json
{
  "id": "profile_id",
  "system": "western_astrology|eastern_astrology|numerology|human_design|other",
  "inputs": {},
  "derived_attributes": [],
  "effective_period": {},
  "source": "user|system",
  "confidence": 0.0
}
```

The system stores these as contextual inputs. It must not present derived interpretations as empirical facts.

## 4.4 Archetype

```json
{
  "id": "archetype_id",
  "name": "Warrior",
  "desired_expressions": [],
  "shadow_relationships": [],
  "behavioral_signals": [],
  "user_defined": true
}
```

## 4.5 Shadow/Interference Relationship

```json
{
  "archetype_id": "warrior",
  "interference_id": "fear",
  "relationship": "inhibits_expression",
  "strength": 0.0,
  "evidence_ids": []
}
```

The relationship is configurable and evidence-backed. It is not assumed universally true.

## 4.6 Pattern

```json
{
  "id": "pattern_id",
  "type": "fetter|saboteur|mask|complex|hyper_complex|custom",
  "name": "",
  "status": "active|weakening|released|reappearing",
  "weight": 0.0,
  "domains": [],
  "archetype_links": [],
  "evidence_ids": []
}
```

## 4.7 Intention

```json
{
  "id": "intention_id",
  "statement": "",
  "domain": "",
  "date": "",
  "success_behavior": [],
  "status": "active|completed|missed|unknown"
}
```

## 4.8 Integrity Event

```json
{
  "id": "integrity_event_id",
  "intention_id": "",
  "observed_behavior": "",
  "alignment": "aligned|partially_aligned|misaligned|unknown",
  "evidence_ids": [],
  "created_at": ""
}
```

Integrity is evidence of consistency between chosen values/intention and behavior. It is not a judgment of personal worth.

## 4.9 Ritual

```json
{
  "id": "ritual_id",
  "purpose": "",
  "components": [],
  "target_patterns": [],
  "target_behaviors": [],
  "target_archetypes": [],
  "completion_events": []
}
```

## 4.10 Journal Event

```json
{
  "id": "journal_event_id",
  "timestamp": "",
  "text": "",
  "tags": [],
  "detected_patterns": [],
  "detected_behaviors": [],
  "intentions": [],
  "boundary_events": [],
  "evidence_strength": 0.0
}
```

## 4.11 Daily Summary Snapshot

```json
{
  "id": "summary_id",
  "person_id": "",
  "date": "",
  "current_state": {},
  "archetypal_expression": [],
  "interference": [],
  "pattern_movement": [],
  "integrity": {},
  "intention": {},
  "rituals": [],
  "changes": [],
  "focus": [],
  "evidence": [],
  "language_confidence": 0.0,
  "model_version": "",
  "created_at": ""
}
```

---

# 5. Information Architecture

## Summary page

### A. Today

- Date
- One-sentence mirror
- Current overall state
- What is most noticeable today

### B. What is expressing

- Dominant desired qualities
- Archetypal expressions translated into behavior
- Evidence supporting the interpretation

### C. What is interfering

- Strongest active patterns
- Relevant shadow/interference relationships
- Masks/saboteurs/complexes
- Observable consequences

### D. What is changing

- Patterns released or weakened
- Behaviors improving
- Ritual effects
- Integrity improvements
- New evidence

### E. What needs attention

- Highest-leverage gap
- Why it matters
- Suggested practice

### F. Today's intention

- Chosen intention
- Expected behavior
- End-of-day evidence prompt

### G. History

- Daily snapshots
- 7-day trend
- 30-day trend
- 90-day trajectory
- Significant transitions

### H. Explore

Click from any statement into:

- Pattern
- Ritual
- Journal evidence
- Avatar
- Purpose
- Boundary
- Archetype
- Knowledge
- Achievement

---

# 6. Summary Generation Pipeline

```text
1. Collect current state
2. Collect recent evidence
3. Load avatar
4. Load purpose/boundary
5. Load active intentions
6. Load rituals and completions
7. Load pattern state
8. Load archetype relationships
9. Load integrity events
10. Compare historical snapshots
11. Detect meaningful changes
12. Identify evidence-supported relationships
13. Rank intervention opportunities
14. Generate grounded interpretation
15. Apply language safety/grounding pass
16. Attach evidence
17. Save immutable daily snapshot
```

---

# 7. Evidence Hierarchy

The engine should prioritize evidence in this order:

1. Direct observed behavior
2. Explicit user statement
3. Repeated journal evidence
4. Ritual completion/outcome evidence
5. Integrity records
6. Pattern detection
7. System-derived interpretation
8. Energetic/archetypal interpretation

A lower-level interpretation must never override stronger direct evidence.

### Example

If a profile says "Warrior," but the user's journal repeatedly records avoidance:

Do not write:

> You are acting courageously.

Write:

> You identify strongly with decisive action, but recent journal evidence shows avoidance in situations involving conflict.

---

# 8. Relationship Model

The engine models:

```text
Desired expression
        |
        v
Potential behavior
        |
        +<---- interference/shadow
        |
        v
Active pattern
        |
        v
Observed behavior
        |
        v
Evidence
```

Release and conditioning alter the relationship over time:

```text
Pattern release
      ↓
Reduced pattern activity
      ↓
Reduced interference
      ↓
More available behavior
      ↓
Observed behavioral change
```

The engine should describe this as a relationship observed over time, not as a proven causal mechanism unless direct evidence supports causality.

---

# 9. Change Detection

A change becomes Summary-worthy when one or more are true:

- Pattern status changes.
- Pattern weight changes materially.
- Repeated behavior changes.
- A ritual produces new evidence.
- Integrity alignment changes.
- An intention repeatedly succeeds/fails.
- A boundary is repeatedly maintained/violated.
- A new relationship appears across multiple evidence points.
- A previously dominant pattern stops appearing.
- A previously weak behavior becomes consistent.

Avoid highlighting every event. The Summary should compress noise into meaningful change.

---

# 10. Leverage Algorithm

The Summary needs a **Focus Score**, not a personal score.

Conceptually:

```text
focus =
  relevance_to_avatar
× evidence_strength
× recurrence
× behavioral_impact
× intervention_readiness
```

Then subtract:

```text
noise
uncertainty
insufficient_evidence
```

The highest result becomes the recommended focus.

This score is internal. Do not expose it as a user rating.

---

# 11. Trend Algorithm

For each pattern, behavior, archetype expression, and integrity dimension:

```text
baseline = prior observation window
current = recent observation window

delta = current - baseline
consistency = repeated evidence / observation opportunities

if delta improves and consistency rises:
    status = "strengthening"
elif delta improves but evidence is sparse:
    status = "early improvement"
elif delta worsens:
    status = "needs attention"
else:
    status = "stable"
```

Never infer improvement from a single event.

---

# 12. Grounded Language Engine

## Forbidden default language

Avoid user-facing language such as:

- divine energy
- cosmic destiny
- soul evolution
- spiritual vibration
- karmic certainty
- your universe is telling you
- your energy guarantees

unless the user explicitly requests that language.

## Preferred language

- behavior
- tendency
- influence
- pattern
- evidence
- choice
- intention
- consistency
- attention
- practice
- change
- relationship
- current state

### Translation examples

Underlying:

> Warrior energy is being blocked by fear.

User-facing:

> You have a strong preference for decisive action, but fear is currently interfering with follow-through.

Underlying:

> The archetype is becoming activated.

User-facing:

> You are showing more of the behaviors associated with this quality.

Underlying:

> Your spiritual configuration is shifting.

User-facing:

> Several parts of your profile currently point toward the same behavioral themes.

---

# 13. Confidence Model

Every generated insight has an internal confidence.

```text
0.90–1.00 = repeated direct evidence
0.75–0.89 = strong evidence, limited uncertainty
0.55–0.74 = plausible interpretation
0.35–0.54 = weak signal
<0.35     = do not surface as an insight
```

Confidence must reflect evidence quality, not model fluency.

---

# 14. Daily Summary Template

```text
TODAY

[One sentence describing the current state.]

WHAT'S SHOWING UP
[2–4 grounded observations.]

WHAT'S GETTING IN THE WAY
[1–3 patterns/interferences.]

WHAT'S CHANGING
[Evidence-backed changes.]

WHAT NEEDS ATTENTION
[Highest-leverage area.]

TODAY'S INTENTION
[User's chosen intention.]

TRY THIS
[One concrete practice.]

WHY
[Short evidence-based rationale.]
```

---

# 15. Longitudinal History

Each summary is immutable.

The system creates:

```text
Day 1
  ↓
Day 2
  ↓
...
Day 90
```

The historical engine compares snapshots rather than rewriting them.

### Views

- Today
- 7 days
- 30 days
- 90 days
- Since beginning

### Historical questions

- What changed?
- What stayed the same?
- Which patterns lost influence?
- Which behaviors became consistent?
- Where did intention become behavior?
- Where did progress reverse?
- Which rituals correlate with improvement?
- Which issues repeatedly return?

---

# 16. Trace Graph Integration

Every Summary statement should be traceable.

```text
Summary Statement
      |
      +--> Evidence
      +--> Journal
      +--> Ritual
      +--> Pattern
      +--> Intention
      +--> Integrity Event
      +--> Avatar attribute
      +--> Knowledge object
```

The user should be able to ask:

> Why did Atüned say this?

and receive the underlying evidence.

This is a critical trust feature.

---

# 17. Event Architecture

Use an append-only event ledger.

Examples:

```text
PATTERN_IDENTIFIED
PATTERN_RELEASED
PATTERN_REAPPEARED
RITUAL_STARTED
RITUAL_COMPLETED
RITUAL_SKIPPED
JOURNAL_ENTRY_CREATED
INTENTION_SET
INTENTION_COMPLETED
INTENTION_MISSED
INTEGRITY_EVENT_RECORDED
BOUNDARY_MAINTAINED
BOUNDARY_VIOLATED
ARCHETYPE_SIGNAL_OBSERVED
MASK_IDENTIFIED
MASK_RELEASED
COMPLEX_IDENTIFIED
COMPLEX_RELEASED
ACHIEVEMENT_EARNED
KNOWLEDGE_TESTED
```

Events become evidence; evidence feeds the Summary.

---

# 18. Feedback Loop

```text
USER TELLS STORY
      ↓
SYSTEM LISTENS
      ↓
PATTERNS / RELATIONSHIPS DETECTED
      ↓
RITUAL / PRACTICE
      ↓
USER ACTS
      ↓
EVIDENCE CREATED
      ↓
SUMMARY UPDATED
      ↓
USER SEES MIRROR
      ↓
NEW INTENTION
      ↓
NEXT CYCLE
```

This is the core product loop.

---

# 19. Focus Group Simulation

## Synthetic cohort

1,000 users
90 days
Mixed engagement:

- 20% high engagement
- 50% moderate engagement
- 20% low engagement
- 10% inconsistent / exploratory

### Simulated usage

High engagement:
- frequent journal entries
- 4–6 rituals/week
- active pattern release
- regular review

Moderate:
- 2–4 rituals/week
- 2–3 journal entries/week
- periodic releases

Low:
- 0–2 rituals/week
- occasional journal
- primarily reads Summary

Inconsistent:
- bursts of activity
- long gaps
- changing intentions

---

# 20. Simulated Findings

### Finding 1 — The Summary is more useful when it explains relationships

Users respond better to:

> Fear appears to be interfering with follow-through in conversations.

than:

> Fear: 72%.

**Gap:** The system must explain why something appears.

### Finding 2 — Too much information destroys the mirror

The first-generation Summary would be tempted to show every archetype, pattern, profile, ritual, badge, and metric.

That becomes a dashboard.

**Fix:** surface only the highest-signal relationships and allow drill-down.

### Finding 3 — Users need evidence behind interpretations

Users ask:

> Why are you saying that?

**Fix:** every important statement gets an evidence drawer.

### Finding 4 — Energetic systems need contextual framing

Some users treat astrology/Human Design/numerology as meaningful; others treat them as reflective frameworks.

**Fix:** present them as profile/context inputs and never as deterministic facts.

### Finding 5 — Change needs comparison

A daily statement is useful; seeing the same issue change over 30 days is substantially more useful.

**Fix:** every Summary has longitudinal comparison.

### Finding 6 — Ritual recommendations must connect to the problem

A generic "do your ritual" recommendation feels automated.

Better:

> You've repeatedly identified avoidance around difficult conversations. Today's practice targets the release and behavior associated with that pattern.

### Finding 7 — Users need agency

The system must not say:

> You need to fix X.

Prefer:

> X appears to be the highest-leverage area based on recent evidence. You could work it through Y.

### Finding 8 — False certainty is the largest trust risk

The model can create persuasive narratives from weak evidence.

**Fix:** confidence thresholds, evidence links, uncertainty language, and suppression of weak signals.

### Finding 9 — Repeated summaries can become stale

If every day says the same thing, users stop reading.

**Fix:** novelty threshold. Surface a recurring issue only when there is a meaningful change, new evidence, or a new interpretation.

### Finding 10 — Celebration belongs here, but not as the primary story

Achievements can appear as evidence of activity:

> You completed 6 rituals this week.

But the Summary should prioritize:

> Your behavior changed in the area those rituals targeted.

---

# 21. Major Gaps Discovered

## Gap A — Causality

The system must distinguish:

**correlation**
from
**causation**.

Ritual completion followed by improvement is evidence of sequence, not proof that the ritual caused the improvement.

## Gap B — Conflicting signals

Example:

- user says they are confident
- journal shows repeated avoidance
- ritual completion is high

The engine must not choose whichever signal sounds best.

It should state the discrepancy.

## Gap C — Stale identity

Avatar definitions can become outdated.

Add:

```text
AVATAR_REVIEW_REQUIRED
```

when repeated evidence suggests the current definition no longer matches the user's stated direction.

## Gap D — Overfitting

The engine can become obsessed with one recurring pattern.

Add diversity constraints so the Summary considers multiple domains.

## Gap E — Privacy

Daily summaries may contain highly personal information.

Require:

- explicit data retention policy
- user deletion controls
- evidence visibility controls
- export
- model-audit trail

## Gap F — Interpretation drift

Model updates can change summaries.

Store:

```text
model_version
prompt_version
rule_version
data_snapshot
```

with every daily summary.

---

# 22. State Machines

## Pattern

```text
UNSEEN
  ↓
IDENTIFIED
  ↓
ACTIVE
  ↓
WORKING
  ↓
WEAKENING
  ↓
RELEASED
  ↓
INTEGRATED
```

Can regress:

```text
RELEASED → REAPPEARED → WORKING
```

## Intention

```text
CREATED
  ↓
ACTIVE
  ↓
OBSERVED
  ├── ALIGNED
  ├── PARTIAL
  └── MISALIGNED
```

## Summary

```text
COLLECTING
  ↓
ANALYZING
  ↓
DRAFTING
  ↓
EVIDENCE_CHECK
  ↓
GROUNDING_CHECK
  ↓
PUBLISHED
```

---

# 23. API Surface

```text
GET  /summary/today
GET  /summary/history
GET  /summary/{id}
POST /summary/generate
GET  /summary/{id}/evidence
GET  /summary/{id}/relationships

GET  /archetypes
GET  /patterns
GET  /intentions
GET  /integrity
GET  /rituals

POST /summary/{id}/feedback
POST /summary/{id}/correct
```

User corrections become first-class evidence.

---

# 24. User Feedback Loop

Every summary should support:

- This feels accurate.
- Partly accurate.
- Not accurate.
- Why did you say this?
- Add context.
- Correct this.

Correction events should not silently rewrite historical evidence.

---

# 25. Test Plan

### Unit tests

- evidence ranking
- confidence calculation
- change detection
- focus ranking
- state transitions
- language translation
- contradiction detection

### Integration tests

- journal → pattern → summary
- ritual → evidence → summary
- intention → integrity → summary
- release → pattern state → summary
- avatar → focus ranking
- boundary → integrity → summary

### Safety tests

- no deterministic spiritual claims
- no diagnosis
- no fabricated evidence
- no unsupported causality
- no personal worth scoring
- no hidden inference presented as fact

### UX tests

- user can understand Summary in <60 seconds
- user can find evidence in ≤2 interactions
- user can reach source object from every major insight
- repeated summaries do not become stale
- user can distinguish fact from interpretation

---

# 26. Acceptance Criteria

The system is ready for production when:

1. A daily Summary can be generated from real event data.
2. Every major interpretation has traceable evidence.
3. Weak signals are suppressed.
4. Conflicting evidence is surfaced.
5. User corrections are preserved.
6. The Summary remains readable in under one minute.
7. Historical comparison works at 7/30/90-day windows.
8. Ritual recommendations are linked to actual active patterns.
9. Energetic/profile systems remain contextual rather than deterministic.
10. No internal score is presented as the user's worth or identity.
11. The system can explain why each major insight appeared.
12. The user can see how behavior changes over time.

---

# 27. Final Product Principle

Atüned should not tell the user:

> **Who you are.**

It should show:

> **What you said you want to become, what appears to influence you, what you actually do, what is changing, and what evidence supports that picture.**

The user remains the final authority on their own experience.

The Summary is the mirror.
The evidence is the record.
The rituals are the practice.
The user's choices are the direction.
The change is demonstrated through behavior.


---

# 28. Focus Group Findings — Product Decisions

The simulated 1,000-person, 90-day cohort produced the following implementation decisions.

## 28.1 Relationship-first summaries

The Summary should prioritize relationships between:

- desired qualities
- active interference
- patterns
- rituals
- observed behavior
- evidence
- integrity

It should not lead with isolated scores.

## 28.2 Evidence must be inspectable

Every consequential statement should support a drill-down path:

```text
Insight
  ↓
Why am I seeing this?
  ↓
Evidence
  ↓
Journal / Ritual / Pattern / Intention / Integrity Event
```

## 28.3 Contradictions are valuable

When evidence conflicts, the system should not resolve the contradiction by choosing the most favorable interpretation.

Example:

```text
User statement:
"I handled the situation directly."

Journal evidence:
"I postponed the conversation again."

Result:
"Your intention was direct communication, but the recorded behavior shows another delay."
```

The contradiction itself becomes useful information.

## 28.4 The Summary needs novelty

A recurring pattern should not be restated every day unless:

- its influence changed;
- new evidence appeared;
- the behavioral context changed;
- the recommended action changed; or
- the user explicitly requests the recurring issue.

This prevents Summary fatigue.

## 28.5 The system must distinguish correlation from causation

If a user completes a ritual and subsequently behaves differently, the Summary may report:

> "The behavior changed after you began this ritual."

It should not automatically report:

> "The ritual caused the change."

The latter requires stronger evidence.

## 28.6 The user remains the final authority

The system can say:

> "The available evidence suggests..."

It should not say:

> "This is who you are."

A correction from the user is itself a meaningful event and should enter the evidence model.

---

# 29. Summary Quality Scoring

The Summary itself should be evaluated separately from the person.

Internal quality dimensions:

```text
Evidence coverage
Interpretation confidence
Contradiction handling
Novelty
Actionability
Readability
Traceability
User correction rate
```

These are system-quality measurements, not user-quality measurements.

---

# 30. Summary Generation Pseudocode

```python
def generate_daily_summary(person, date):

    context = collect_context(
        person=person,
        date=date,
        windows={
            "today": 1,
            "week": 7,
            "month": 30,
            "quarter": 90
        }
    )

    evidence = rank_evidence(context)

    relationships = detect_relationships(
        avatar=context.avatar,
        patterns=context.patterns,
        archetypes=context.archetypes,
        intentions=context.intentions,
        rituals=context.rituals,
        integrity=context.integrity,
        evidence=evidence
    )

    changes = detect_meaningful_changes(
        current=context.current_state,
        historical=context.history
    )

    contradictions = detect_conflicts(evidence)

    focus_candidates = rank_focus_candidates(
        relationships=relationships,
        changes=changes,
        evidence=evidence
    )

    draft = compose_grounded_summary(
        relationships=relationships,
        changes=changes,
        contradictions=contradictions,
        focus=focus_candidates
    )

    checked = run_quality_checks(
        draft=draft,
        evidence=evidence,
        rules=[
            "no_fabricated_evidence",
            "no_deterministic_profile_claims",
            "no_unsupported_causality",
            "no_personal_worth_scoring",
            "grounded_language",
            "show_uncertainty",
            "preserve_user_agency"
        ]
    )

    snapshot = save_immutable_snapshot(
        person=person,
        date=date,
        summary=checked,
        evidence=evidence,
        model_version=MODEL_VERSION
    )

    return snapshot
```

---

# 31. Example End-to-End Scenario

## Starting state

Avatar:

> "I want to become someone who acts directly, communicates honestly, protects my time, and follows through."

Active pattern:

> Avoidance around difficult conversations.

Shadow/interference relationship:

> Fear appears to reduce follow-through.

Intention:

> "Have the conversation today."

Ritual:

> Release avoidance → reframe responsibility → initiate conversation.

## Day 1 Summary

> **You're clear about what you want to do, but fear is still interfering with follow-through. Today's intention is direct communication. The main opportunity is to act before avoidance has time to build.**

## Day 14

Evidence:

- 4 relevant conversations attempted
- 3 completed
- 1 postponed
- avoidance pattern appears less frequently

Summary:

> **Direct communication is becoming more consistent. You still hesitate when the conversation carries interpersonal risk, but recent entries show that you are acting sooner instead of waiting for discomfort to disappear.**

## Day 45

Evidence:

- 12 relevant conversations
- 11 initiated directly
- pattern weight reduced
- ritual completed consistently

Summary:

> **The behavior you're working toward is becoming more consistent. Fear still appears, but it is less often determining what you do. Your recent evidence shows a stronger match between your intention and your behavior.**

This is the type of longitudinal transformation the Summary should make visible.

---

# 32. Product Architecture Summary

Atüned's major systems connect as follows:

```text
                    ┌─────────────┐
                    │   AVATAR    │
                    │ Who I want  │
                    │ to become    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
         PURPOSE       BOUNDARY     ARCHETYPES
              │            │            │
              └────────────┼────────────┘
                           ↓
                     PATTERN MODEL
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          RELEASE       RITUAL        KNOWLEDGE
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                      USER ACTION
                           ↓
                        JOURNAL
                           ↓
                       EVIDENCE
                           ↓
                     INTEGRITY
                           ↓
                    TRACE GRAPH
                           ↓
                  SUMMARY ENGINE
                           ↓
                   DAILY MIRROR
                           ↓
                    NEW INTENTION
                           │
                           └──────→ next cycle
```

The Summary therefore completes the Atüned feedback loop rather than duplicating another subsystem.

---

# 33. Implementation Priorities

## P0

- Summary domain model
- Event ledger integration
- Evidence ranking
- Daily generation pipeline
- Grounded language layer
- Evidence traceability
- Historical snapshots
- User correction

## P1

- Relationship visualization
- 7/30/90-day comparisons
- contradiction surfacing
- novelty engine
- focus ranking
- ritual-to-outcome analysis

## P2

- advanced archetype relationship modeling
- profile-system overlays
- longitudinal behavioral maps
- personalized insight refinement
- cohort-level product analytics

---

# 34. Final Design Rule

The Summary should never become:

> "Atüned's opinion of you."

It should become:

> **"Here is the clearest current picture we can construct from what you've told us, what you've done, what you've practiced, and what the evidence shows."**

That distinction protects the product's central values:

**Truth over narrative.  
Evidence over assumption.  
Choice over prescription.  
Behavior over labels.  
Change over scores.**
