# ATUNED
# Impression Excavation Engine
## Technical Design Specification v1.0

Status: Foundation specification
System: SOURCE OS
Product: ATUNED

---

# Purpose

The Impression Excavation Engine is the conversational intelligence layer inside SOURCE OS that moves from a person's lived experience to the structure underneath it.

It begins with the person's story, follows the experience through feeling, body, thought, belief, prediction, behavior, meaning and repetition, then asks the smallest useful question that reduces uncertainty.

Core loop:

EXPERIENCE → SIGNAL → IMPRESSION → EXCAVATION → PATTERN → HYPOTHESIS → VERIFICATION → IMPRINT → RELEASE → REFRAME → OBSERVATION → INTEGRATION

The engine discovers. It does not declare.

---

# Core Rules

1. Never invent history, feelings, beliefs, patterns, charges, addresses, saboteurs, complexes, diagnoses, causes, numbers or outcomes.

2. Preserve the person's original language. Normalization may create searchable equivalents, but never replaces the original statement.

3. Follow signal before label. Follow behavior before classification.

4. Contradiction generates inquiry, not judgment.

5. A body sensation is an observation, not proof of psychological or energetic cause.

6. Registration is not causation. Correlation is not causation. Temporal order is not causation.

7. A hypothesis is never automatically a fact.

8. Unknown is a valid result.

9. The person remains the authority on their experience.

10. One useful question is better than a questionnaire.

---

# Impression Model

An impression is the internal registration produced by an experience. It may contain:

trigger
contact
feeling
body sensation
thought
belief
perception
prediction
behavior
action
meaning
context
intensity
protection
cost
repetition

Impression is distinct from interpretation.

IMPRESSION:
"My chest tightened."
"I wanted to leave."
"I stopped talking."

INTERPRETATION:
"fear of rejection"
"authority pattern"
"abandonment"

Interpretations remain hypotheses until supported.

---

# Impression Object

```yaml
Impression:
  id
  user_id
  source
  original_language
  timestamp
  experience:
    event
    trigger
    context
  contact:
    person
    place
    situation
  affect:
    feeling
    emotion
    intensity
  somatic:
    location
    side
    sensation
    pressure
    temperature
    texture
    movement
    color
    size
    duration
    intensity
  cognition:
    thought
    belief
    perception
    prediction
  behavior:
    behavior
    action
    avoidance
    approach
    suppression
    expression
  meaning:
    assigned_meaning
    anticipated_meaning
  protection:
    protective_behavior
    perceived_threat
    perceived_cost
  repetition:
    prior_occurrences
    recurrence_count
    contexts
  uncertainty:
    unknowns[]
    alternatives[]
  evidence_ids[]
  hypothesis_ids[]
  pattern_ids[]
  state
  confidence
```

---

# Excavation Chain

The primary excavation chain is:

TRIGGER
↓
CONTACT
↓
FEEL
↓
LOCATE
↓
SENSE
↓
BEHAVIOR
↓
PREDICT
↓
BELIEVE
↓
MEANING
↓
PATTERN
↓
ORIGIN
↓
REINFORCEMENT
↓
CURRENT EXPRESSION
↓
TEST
↓
CANDIDATE ROOT

The engine does not have to traverse every node. It selects the next question from the current uncertainty.

---

# Question Engine

The Question Engine does not run a fixed questionnaire.

It selects the smallest useful question based on uncertainty reduction.

Candidate dimensions:

TRIGGER
FEELING
BODY
BEHAVIOR
PREDICTION
BELIEF
MEANING
ORIGIN
REINFORCEMENT
CONTEXT
CONTRADICTION
GOAL
OUTCOME

Question score is based on:

uncertainty_reduction
signal_strength
pattern_relevance
user_effort
emotional_load
novelty
contradiction_resolution
verification_value

Examples:

Somatic:
"Where do you feel that?"

Behavioral:
"What do you actually do when that happens?"

Predictive:
"What are you expecting will happen?"

Meaning:
"What does that mean about you?"

Origin:
"When do you remember this first showing up?"

Verification:
"Does that feel true, partly true, or not true?"

Contradiction:
"You said X, but you're describing Y. Which feels more true?"

The user can always reject, refine, pause or move on.

---

# Somatic Following

SOURCE uses the body as an observation channel, not as automatic proof of cause.

Example:

USER:
"I freeze when I need to speak."

SOURCE:
"When you say 'freeze,' what happens in your body?"

USER:
"My throat closes."

SOURCE:
"What happens in your throat when you imagine speaking?"

The system follows the reported sensation before assigning meaning.

Candidate chain:

WORD → HARMONIC REGISTER → CHAKRA → ASSEMBLAGE POINT → NERVE / NERVE CLUSTER → SOMATIC REPORT

This is a candidate relationship. It is not automatically causal.

---

# Behavior and Protection

The engine distinguishes feeling from behavior.

A person can feel fear and still act courageously.

Behavior Vector:

```yaml
BehaviorVector:
  approach
  avoidance
  expression
  suppression
  control
  surrender
  engagement
  withdrawal
  repetition
  intensity
  frequency
  context
  consequence
```

Patterns may persist because they provide protection.

```yaml
Protection:
  perceived_threat
  protective_behavior
  immediate_benefit
  long_term_cost
  perceived_cost_of_change
```

Example:

TRIGGER → FEAR → AVOIDANCE → TEMPORARY RELIEF → PATTERN REINFORCEMENT

This is a candidate behavioral loop until supported.

---

# Contradiction Engine

```yaml
CONTRADICTION:
  id
  declared_signal
  observed_signal
  contextual_signal
  somatic_signal
  contradiction_type
  magnitude
  persistence
  alternatives[]
  confidence
  status
```

Types:

WORD ↔ BEHAVIOR
WORD ↔ WORD
WORD ↔ SOMATIC
WORD ↔ CONTEXT
BEHAVIOR ↔ BEHAVIOR
BEHAVIOR ↔ OUTCOME
GOAL ↔ BEHAVIOR
VALUE ↔ BEHAVIOR

States:

NONE
DETECTED
INVESTIGATING
EXPLAINED
UNRESOLVED
VERIFIED

Rule:

CONTRADICTION → INQUIRY

Never:

CONTRADICTION → JUDGMENT

---

# Evidence and Discernment

```yaml
EVIDENCE:
  id
  signal_type
  source
  value
  strength
  reliability
  repetition
  recency
  confirmation
  contradiction
  weight
  confidence
```

Evidence classes:

DIRECT
CANONICAL
CONTEXTUAL
SOMATIC

Engineering confidence bands:

0.00–0.24 WEAK
0.25–0.49 POSSIBLE
0.50–0.74 PROBABLE
0.75–0.89 STRONG
0.90–1.00 VERIFIED

These are engineering thresholds, not claims about psychological truth.

Convergence:

```yaml
CONVERGENCE:
  hypothesis_id
  signals[]
  independent_sources[]
  supporting_evidence[]
  contradicting_evidence[]
  convergence_score
  confidence
  status
```

Multiple independent signals can strengthen a candidate. They do not eliminate the need for verification.

---

# Causal Reasoning

```yaml
RELATIONSHIP:
  source
  target
  relationship
  evidence[]
  temporal_order
  repetition
  intervention_test
  alternative_causes[]
  confidence
```

Relationship types:

REGISTERED_WITH
ASSOCIATED_WITH
CORRELATED_WITH
PRECEDES
FOLLOWS
INFLUENCES
POSSIBLY_CAUSES
SUPPORTED_CAUSE
UNKNOWN

Required distinction:

REGISTRATION:
"These things map to the same system."

CORRELATION:
"These things repeatedly occur together."

HYPOTHESIS:
"These things may be related."

CAUSAL SUPPORT:
"Changing X repeatedly produces a corresponding change in Y."

Intervention or other appropriate evidence is required before causal support.

---

# Canon and Novel Signals

Matching order:

EXACT_CANON
↓
SEMANTIC_CANON
↓
FUZZY_CANON
↓
RELATED_CANON
↓
NOVEL

Novel means the signal does not yet map cleanly to existing Canon. It does not mean pathology.

Before declaring a new structure, test whether the signal is a composite of existing structures. A composite may be a Complex or Hyper-complex candidate.

Preserve the original language.

---

# Pattern and Root

A pattern is what repeats.

A single event is not enough.

Pattern evidence may come from:

repeated language
repeated behavior
repeated trigger
repeated body response
repeated prediction
repeated context
repeated outcome

A candidate root is the smallest structure that appears to organize multiple downstream signals.

Example:

AVOIDING THE CONVERSATION
↓
FEAR
↓
CHEST TIGHTNESS
↓
PREDICTION: "THEY WILL REJECT ME"
↓
BELIEF: "IF I DISAPPOINT PEOPLE I LOSE CONNECTION"
↓
BEHAVIOR: AVOIDANCE
↓
REINFORCEMENT: TEMPORARY RELIEF

Candidate root:
"I have to avoid disappointing people to remain connected."

Candidate means candidate. Verification is still required.

---

# State Machine

```text
UNSEEN
↓
CONTACTED
↓
ACTIVATED
↓
LOCATED
↓
DESCRIBED
↓
BEHAVIOR_IDENTIFIED
↓
PREDICTION_IDENTIFIED
↓
BELIEF_IDENTIFIED
↓
MEANING_IDENTIFIED
↓
PATTERN_CANDIDATE
↓
HYPOTHESIS
↓
TESTING
↓
VERIFIED
```

Alternative exits:

REJECTED
REFINED
UNRESOLVED
ABANDONED_BY_USER
PAUSED

---

# Trace Graph

The engine writes into the wider Trace Graph.

Nodes:

experience
trigger
impression
feeling
somatic
thought
belief
prediction
behavior
action
meaning
pattern
origin
reinforcement
context
goal
outcome
release
reframe
archetype

Edges:

triggered_by
expressed_as
located_in
associated_with
preceded_by
followed_by
reinforced_by
released_with
replaced_by
observed_again_in
possibly_causes

Graph update:

```text
parse story
↓
extract signals
↓
create or update nodes
↓
generate candidate edges
↓
update evidence
↓
detect contradiction
↓
detect recurrence
↓
detect context transfer
↓
detect replacement
↓
update temporal state
```

---

# Verification

Verification sequence:

CANDIDATE HYPOTHESIS
↓
IDENTIFY UNCERTAINTY
↓
SMALLEST USEFUL QUESTION
↓
PERSON CONFIRMS / REJECTS / REFINES
↓
APPLY RELEASE OR OTHER INTERVENTION
↓
MEASURE RESULT
↓
COMPARE BEFORE / AFTER
↓
TRACK LONGITUDINALLY

Outcomes:

CONFIRMED
REJECTED
REFINED
UNRESOLVED
RECURRED
INTEGRATED

Silence, ambiguity or lack of contradiction is never confirmation.

---

# Release Integration

The Impression Excavation Engine does not execute the release protocol.

It hands Release Intelligence:

target pattern
evidence
context
somatic observations
candidate belief
expression channels
confidence
verification state

The handoff is:

IMPRESSION
↓
PATTERN
↓
HYPOTHESIS
↓
VERIFICATION
↓
RELEASE CANDIDATE
↓
RELEASE INTELLIGENCE

Release Intelligence then manages preparation, observer activation, pattern presentation, channel activation, release, somatic observation, reframe, integration, cooldown and verification.

---

# Imprint

An imprint is a sufficiently understood pattern that has earned a persistent place in the user's record.

```yaml
Imprint:
  id
  original_language
  verified_pattern
  evidence[]
  contexts[]
  somatic_registration[]
  behaviors[]
  predictions[]
  beliefs[]
  reinforcement[]
  release_history[]
  reframe_history[]
  verification_history[]
  recurrence_history[]
  integration_state
  confidence
```

---

# Longitudinal Intelligence

The engine continues to compare new experiences against prior evidence.

Example:

DAY 1: avoidance appears
DAY 7: repeats with boss
DAY 14: repeats with partner
DAY 21: repeats with friend
DAY 30: release
DAY 37: same trigger, old response absent
DAY 60: new behavior appears under pressure

The system can detect:

recurrence
negative evidence
context transfer
pattern replacement
behavioral change
outcome change

A released pattern returning is not automatically failure. It triggers reassessment.

---

# Pattern Replacement

The engine distinguishes:

OLD PATTERN RETURNED

from:

OLD PATTERN REDUCED
+
NEW PATTERN EMERGED

Example:

FEAR
↓
RELEASE
↓
PERFECTIONISM EMERGES

The new pattern becomes a new excavation target.

Longitudinal chain:

PATTERN A → RELEASE → PATTERN B → RELEASE → PATTERN C

---

# Archetype Integration

Archetypes are always present and may be active or passive.

The engine does not decide that an archetype is absent. It observes how awareness, will, language and behavior affect expression.

Example:

WARRIOR
always present
↓
fear narrows awareness
↓
willingness to act decreases
↓
Warrior expression becomes quieter

Another story may show:

challenge
↓
clear awareness
↓
willingness to act
↓
direct behavior
↓
Warrior expression intensifies

When language is ambiguous, SOURCE asks instead of labeling.

Example:

"You said you were angry.

Did you mean angry as in:
'I needed to protect something important'

or angry as in:
'I wanted to hurt someone because I felt hurt'?"

The user decides the interpretation.

---

# Attachment and Jouissance

Attachment history is a low-weight contextual signal.

Attachment ≠ trauma.

Attachment ≠ pathology.

It becomes relevant when it converges with present behavior, identity, avoidance, regulation or excess.

Jouissance is a behavioral-direction signal.

CONSTRICTION:
avoidance, suppression, withdrawal, inhibition, withholding, over-control, self-denial

EQUILIBRIUM:
proportionate regulation and healthy engagement

JOUISSANCE:
overindulgence, compulsion, excess, stimulation seeking, pleasure used to regulate discomfort, inability to stop

Jouissance is not a diagnosis. Temperance provides the cross-check.

---

# Core Algorithm

```text
function impression_excavation(story):

    experience = parse_experience(story)
    signals = extract_signals(experience)
    impressions = construct_impressions(signals)

    for impression in impressions:

        preserve_original_language(impression)

        evidence = create_direct_evidence(impression)
        update_evidence_ledger(evidence)

        match_canon(impression)
        detect_somatic_registration(impression)
        extract_behavior(impression)
        extract_prediction(impression)
        extract_belief(impression)
        extract_meaning(impression)
        detect_contradiction(impression)
        compare_history(impression)

        unknowns = identify_unknowns(impression)

        question = select_question(
            unknowns,
            evidence,
            user_intent
        )

        ask(question)
        response = receive_user_response()

        update_impression(response)
        generate_candidate_hypotheses()
        test_hypotheses()
        update_confidence()
        update_trace_graph()
        determine_state()

    return excavation_state
```

---

# Output Contract

```yaml
ExcavationState:
  session_id
  impression_ids[]

  current:
    experience
    signal
    unknown
    question
    response

  evidence:
    direct[]
    canonical[]
    contextual[]
    somatic[]

  candidate_patterns[]
  hypotheses[]
  contradictions[]
  relationships[]

  somatic:
    observations[]
    candidate_registrations[]

  behavior:
    vectors[]

  verification:
    status
    next_test

  release:
    eligible
    candidates[]

  confidence:
    overall

  next_action:
    question
    release
    observation
    pause
    complete
```

---

# Failure Tests

The engine must explicitly test against:

premature labeling
confirmation bias
over-questioning
intellectualization
rationalization
false causality
false somatic causality
pattern inflation
Canon inflation
history invention
forced depth
user fatigue
emotional overload
single-signal certainty
population priors overriding personal evidence

Example input:

"I felt tight in my chest when my boss called."

SOURCE must not immediately produce:

authority trauma
abandonment
root chakra blockage
fear of failure

Correct progression:

CHEST TIGHTNESS
↓
OBSERVATION
↓
"What happened when your boss called?"
↓
"How did you feel?"
↓
"What did you expect would happen?"
↓
"What did you do?"
↓
"What does that mean to you?"

The structure emerges through evidence.

---

# Acceptance Criteria

The engine is complete when:

1. It preserves original user language.
2. It distinguishes experience from interpretation.
3. It represents impressions structurally.
4. It follows body and behavior before forcing labels.
5. It identifies unknowns explicitly.
6. It selects questions dynamically.
7. It preserves contradictory evidence.
8. It maintains alternative hypotheses.
9. It distinguishes registration from causation.
10. It tracks evidence provenance.
11. It detects recurrence.
12. It detects context transfer.
13. It detects pattern replacement.
14. It produces candidate roots without declaring unsupported roots.
15. It hands verified candidates to Release Intelligence.
16. It receives post-release evidence.
17. It updates the Trace Graph.
18. It operates longitudinally.
19. It lets the user reject or refine interpretations.
20. It never requires SOURCE to invent missing information.

---

# Final Operating Model

The Impression Excavation Engine answers:

"What is actually running underneath this experience?"

It does not answer by guessing.

It answers by excavation.

```text
THE PERSON LIVES
↓
THE PERSON SPEAKS
↓
SOURCE LISTENS
↓
EXPERIENCE BECOMES IMPRESSION
↓
IMPRESSION IS EXCAVATED
↓
STRUCTURE BECOMES VISIBLE
↓
HYPOTHESIS IS TESTED
↓
PATTERN IS VERIFIED
↓
PATTERN CAN BE RELEASED
↓
CHANGE IS OBSERVED
↓
RESULT BECOMES EVIDENCE
↓
EVIDENCE BECOMES MEMORY
↓
MEMORY IMPROVES THE NEXT QUESTION
```

The system becomes more accurate about:

experience → impression → behavior → pattern → intervention → change → outcome

The person lives the experience.

SOURCE excavates the structure.

ATUNED makes the change visible.

---

