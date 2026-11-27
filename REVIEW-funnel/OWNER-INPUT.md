# ATUNED

# Funnel, Activation, Intelligence, and 90 Day Product

## Detailed Feedback and Implementation Specification

**Purpose:** Give the implementation AI explicit feedback, expected
behavior, architecture, acceptance criteria, and build order for the
current ATUNED system.

**Source basis:** Latest ATUNED build/archive review, the current ATUNED
MVP architecture TDD, `ATUNED_Intelligence_System_TDD_V3.md`,
`ATUNED_Practice_Ritual_Accountability_Trace_Graph_TDD.md`, and the
current funnel/app implementation reviewed in this working session.

**Important:** This document is an implementation direction document. Do
not interpret a description of desired behavior as proof that the
behavior already exists in code.

------------------------------------------------------------------------

# 1. Executive Direction

The central finding is simple:

> **The ATUNED product machinery is substantially more mature than the
> current user journey.**

The system already contains meaningful pieces of the intended
architecture:

-   Story
-   Sniffer
-   Pattern logic
-   Release
-   Rerun
-   Practice
-   Ritual
-   Accountability
-   Goal
-   Behavior Objective
-   Protocol
-   Practice Event
-   Evidence
-   Outcome
-   Trace Graph
-   Daily Summary
-   90 day historical analysis
-   Identity
-   Entitlements
-   Commerce seams
-   Safety logic
-   Address library
-   Saboteurs
-   Integrity laws

The problem is not primarily a lack of subsystems.

The problem is that the user does not encounter these subsystems as one
continuous causal experience.

The current experience is approximately:

``` text
LANDING
    ↓
100 QUESTION TEST
    ↓
READING
    ↓
OPTIONAL STORY
    ↓
SAVE RECORD
    ↓
MANUAL LOAD
    ↓
APP
    ↓
ONBOARDING
    ↓
SIGNAL TEST
    ↓
NOW FIGURE OUT WHAT TO DO
    ↓
90 DAYS
```

The intended experience is:

``` text
LAND
    ↓
WHAT BROUGHT YOU HERE?
    ↓
FEEL
    ↓
TELL ATUNED
    ↓
ATUNED NOTICES
    ↓
IS THAT RIGHT?
    ↓
USER CONFIRMS OR CORRECTS
    ↓
PATTERN
    ↓
FIRST RELEASE
    ↓
WHAT CHANGED?
    ↓
TODAY'S PRACTICE
    ↓
FIELD REMEMBERS
    ↓
ATUNED KNOWS WHAT TO DO NEXT
```

That difference is the core product problem.

The implementation goal is therefore not:

> Build more ATUNED.

It is:

> **Connect what already exists so the user experiences one intelligent
> instrument from the first interaction onward.**

------------------------------------------------------------------------

# 2. The Product Principle

The product should operate according to this loop:

``` text
I FEEL
    ↓
I SAY
    ↓
ATUNED SEES
    ↓
I CONFIRM
    ↓
ATUNED WORKS
    ↓
I NOTICE
    ↓
I PRACTICE
    ↓
ATUNED REMEMBERS
    ↓
ATUNED KNOWS WHAT TO DO NEXT
```

Every major product decision should be tested against this loop.

If a feature does not help this loop, it should not interrupt the
primary path.

If a feature is useful but complex, move the complexity behind the
interface.

The user should experience a simple instrument.

The intelligence should carry the complexity underneath it.

This is consistent with the existing architectural rule:

> Complexity belongs in the intelligence layer; the user's interaction
> should remain simple.

------------------------------------------------------------------------

# 3. What Is Working and Should Be Preserved

Do not rebuild the visual system from scratch.

The current visual language is a strength.

Preserve:

``` text
Door
Field
Body
112-address visual language
Rings
Nodes
Color
Breathing
Motion
Starting-point icons
Release visual language
Stop frame
Guest path
Account path
Signal experiment
Minimal typography
Dark instrument aesthetic
```

The front-end visual language already communicates an instrument.

The problem is that the intelligence behind the instrument is not yet
driving the experience strongly enough.

The visual engine should therefore become the visible expression of the
intelligence engine.

The Field should not merely be a beautiful background.

It should be a live representation of system state.

------------------------------------------------------------------------

# 4. The Most Important Change

## Move the first real value into the first experience

The current 100-question assessment is too much work before the person
experiences the product.

The first interaction should not require the user to understand ATUNED.

It should demonstrate ATUNED.

The 100-question assessment can remain valuable.

It should move deeper into the product.

Possible uses later include:

-   deeper assessment
-   baseline
-   integrity calibration
-   expanded CQ work
-   longitudinal comparison
-   advanced discovery
-   post-activation expansion
-   user-selected exploration

It should not be the primary front door.

The front door should be:

``` text
CONCERN
→ FEEL
→ STORY
→ MIRROR
→ TEST
→ RELEASE
→ VERIFY
```

------------------------------------------------------------------------

# 5. P0: Fix the Funnel to App Handoff

## Current problem

The supplied funnel has a hard handoff failure.

The quiz final action points to:

``` text
../source.html
```

but the supplied application is:

``` text
atuned.html
```

Therefore the funnel can terminate at the app handoff instead of
entering the product.

This is a hard P0 defect.

## Required solution

The funnel must hand off to the actual ATUNED application.

However, simply changing the link is not enough.

The handoff must also preserve the user's activation state.

Do not create this:

``` text
FUNNEL
    ↓
export file
    ↓
user saves file
    ↓
user opens app
    ↓
user finds privacy
    ↓
user loads file
    ↓
continue
```

That is not a seamless product journey.

Create this:

``` text
FUNNEL
    ↓
ACTIVATION STATE
    ↓
ACCOUNT / GUEST IDENTITY
    ↓
ATUNED
    ↓
ACTIVATION STATE RESTORED
    ↓
CONTINUE
```

The user should not have to understand how data moved between the funnel
and the app.

------------------------------------------------------------------------

# 6. Funnel Activation State

Create a canonical activation object.

Suggested model:

``` yaml
FunnelActivation:
  session_id: string

  selected_ground:
    id: string
    label: string

  starter_gift:
    id: string
    pattern_ids: []

  story:
    raw_text: string
    source: text | voice

  story_signal:
    story_tag: string
    snippet: string
    quality: string
    intensity: number
    cause_or_experience: string

  hypotheses: []

  selected_pattern:
    pattern_id: string
    status: candidate | confirmed | rejected | refined

  release:
    status: not_started | started | completed | halted

  verification:
    status: not_started | confirmed | rejected | unclear
    response: string

  created_at: timestamp

  updated_at: timestamp
```

The exact schema can differ if the current architecture has an
equivalent canonical model.

Do not create a second system if an existing identity/session/trace
model can carry the same state.

The important requirement is persistence and continuity.

------------------------------------------------------------------------

# 7. Personalized Starter Gift

The personalized 100-pattern gift should become part of activation.

The funnel asks:

> What brought you here?

Possible starting grounds:

``` text
Anxiety
Overwhelm
Anger
Burnout
Fatigue
Grief
Fear
Relationships
Self-worth
Money
Purpose
Something else
```

These are entry points.

They are not diagnoses.

The selection should determine the initial ground that ATUNED explores.

After selection:

``` text
SELECTED GROUND
    ↓
CURATED 100 PATTERNS
    ↓
STARTER GIFT
    ↓
FIRST EXPERIENCE
```

The user should immediately understand:

> Your first 100 patterns are ready.

The gift should be real system inventory.

Do not show a marketing promise of 100 patterns and then provide a
separate generic tutorial that does not use them.

The first experience should operate on the selected ground and the
corresponding pattern set.

------------------------------------------------------------------------

# 8. Starter Gift Data Model

Suggested object:

``` yaml
StarterGift:
  id: string
  user_id: string | null
  source: funnel

  selected_ground:
    id: string
    label: string

  pattern_ids: []

  granted: 100
  remaining: 100

  issued_at: timestamp
  transferred_at: timestamp | null

  status:
    issued | transferred | active | depleted
```

If the existing entitlement system already represents this correctly,
extend it rather than creating a duplicate.

The rules are:

``` text
Gift = 100 new patterns once
Reruns = free
Free weekly allowance = 10 new patterns/week
Unused Free allowance = banks
Paid tiers = additional new ground
```

Do not charge for rerunning a pattern that the user has already opened.

------------------------------------------------------------------------

# 9. P0: Replace the Front Door

## Current

``` text
Take the 100 question test.
```

## Required

The first meaningful question should be:

> **What brought you here?**

The visual should be symbolic.

Do not use a long form.

Do not use a clinical intake screen.

Do not ask the user to explain the entire system.

The user chooses a starting point.

Then immediately enter experience.

------------------------------------------------------------------------

# 10. FEEL Must Be a Real Interaction

The current onboarding includes a signal experiment involving thinking
"yes" and "no."

That can remain as an optional demonstration later.

It should not substitute for the user's actual experience.

The user needs to encounter their own concern.

The flow should be:

``` text
WHAT BROUGHT YOU HERE?
        ↓
FEEL
        ↓
STORY
```

Possible language:

> What are you feeling today?

or:

> How does that feeling run through you?

The exact language can be tested.

The key requirement is that the interaction is about the user's selected
ground and actual experience.

The system should not ask the user to understand a concept before giving
them something to experience.

------------------------------------------------------------------------

# 11. Story Intake

The user should be able to:

``` text
TYPE
or
SPEAK
```

The user tells ATUNED what is happening.

The system extracts structure.

The Story Sniffer should produce something like:

``` text
STORY TAG
Over-responsibility

STORY SNIPPET
"I keep taking care of everybody else."

QUALITY
Overwhelmed

INTENSITY
8

CAUSE / EXPERIENCE
Fear that things will fall apart if I do not handle them
```

The exact labels can remain internal if the user-facing presentation
becomes too technical.

The important thing is that the system extracts structured meaning from
the story.

------------------------------------------------------------------------

# 12. The Mirror Must Become a Closed Loop

This is one of the largest current intelligence gaps.

The current story reading can identify themes.

It does not yet complete the intended:

``` text
MIRROR
→ TEST
→ CORRECTION
→ UPDATED MIRROR
```

Required behavior:

``` text
USER STORY
    ↓
SNIFFER
    ↓
EVIDENCE
    ↓
HYPOTHESIS
    ↓
MIRROR
    ↓
"IS THIS WHAT YOU MEANT?"
```

The user gets three basic paths:

``` text
THAT'S IT
NOT QUITE
ADJUST
```

The exact labels can differ.

The behavior cannot.

------------------------------------------------------------------------

# 13. Correction Must Actually Change the Model

This is critical.

Do not create a fake correction button that only records feedback.

If the user says:

> Not quite.

ATUNED must not simply continue.

It should ask:

> Tell us what is off.

The user can type or speak.

Then:

``` text
CORRECTION
    ↓
SNIFFER
    ↓
UPDATED SIGNALS
    ↓
UPDATED HYPOTHESIS
    ↓
UPDATED BODY MAP
    ↓
UPDATED RELATIONSHIPS
    ↓
UPDATED MIRROR
```

The user should see the system change.

This is one of the clearest demonstrations that ATUNED is an instrument
rather than a static questionnaire.

------------------------------------------------------------------------

# 14. Evidence Must Be Separate From Interpretation

The intelligence architecture already defines this distinction.

Maintain:

``` text
USER WORDS
    ↓
OBSERVATION
    ↓
INFERENCE
    ↓
HYPOTHESIS
    ↓
USER CONFIRMATION
```

Do not collapse these into one statement.

For example:

Bad:

> You are afraid of abandonment.

Better:

> You described feeling afraid when someone becomes distant. ATUNED sees
> a possible abandonment pattern.

Then:

> Is that what is happening?

If the user rejects it, the hypothesis is not confirmed.

The system must retain the rejection.

The architecture explicitly requires AI inference to remain
distinguishable from confirmed fact.

------------------------------------------------------------------------

# 15. Preserve Rejected Interpretations

A correction is not just new information.

It is also evidence about what ATUNED got wrong.

The system should preserve:

``` yaml
Hypothesis:
  status: rejected

  user_feedback:
    type: correction
    text: "That isn't what is happening."

  rejected_at: timestamp
```

This matters because future intelligence should not repeatedly
rediscover the same rejected interpretation.

A rejected hypothesis should reduce its future relevance unless new
evidence supports reconsideration.

------------------------------------------------------------------------

# 16. First Release Must Happen During Activation

The first release is the primary value hinge.

Do not make the user:

``` text
learn the system
complete assessment
read explanation
create configuration
choose a pattern
configure a release
understand terminology
```

before getting to the first release.

The first release should be almost automatic.

The system should choose a strong candidate based on:

``` text
selected ground
story
evidence
confirmed signal
pattern relevance
```

Then present the intervention simply.

The first session should require very few decisions.

Target:

``` text
User writes
↓
ATUNED identifies
↓
User confirms
↓
ATUNED selects
↓
User releases
↓
User verifies
```

------------------------------------------------------------------------

# 17. First Release Experience

The current release language is:

> I am releasing believing, thinking, feeling, behaving, acting.

Use the current canonical release system.

Do not build a separate mini release engine for the funnel.

The funnel should invoke the same Release Engine used inside the app.

The funnel is an entry path into ATUNED, not a second ATUNED.

The visual field should change during the release.

For example:

``` text
HELD
↓
CONTRACTED
↓
RELEASING
↓
OPENING
↓
SETTLING
↓
OBSERVING
```

These are experience states, not medical claims.

Do not claim that a release treats or cures a medical condition.

------------------------------------------------------------------------

# 18. Somatic Setup

The somatic setup should be brief.

Suggested structure:

> Welcome to a somatic experience.
>
> Turn your senses inward and notice what you feel.
>
> Notice what happens as you hold the thought.
>
> You may notice pressure, density, movement, relief, activation, or
> nothing at all.
>
> You do not need to force a sensation.

Then begin the release.

Do not require the user to produce a sensation.

No sensation is still information.

------------------------------------------------------------------------

# 19. Verification Must Happen Immediately

After the first release, ask:

> What changed?

Use simple responses:

``` text
I feel different
I see it differently
Something moved
Nothing changed
I'm not sure
```

This is not cosmetic feedback.

It is evidence.

The result should become part of the Evidence Ledger.

Example:

``` yaml
ReleaseVerification:
  release_id: ...
  before:
    user_report: ...
  intervention:
    protocol_id: ...
  after:
    user_report: ...
  status:
    changed | unchanged | unclear
```

A claimed change must not automatically become a verified outcome.

This is consistent with the existing TDD requirement:

> Completion does not equal change.

------------------------------------------------------------------------

# 20. The First Session Should End With Practice

After verification, ATUNED should provide one concrete next action.

Not ten.

Not a dashboard.

Not a giant menu.

One useful practice.

Architecture:

``` text
PATTERN
    ↓
PROTOCOL
    ↓
RITUAL
    ↓
PRACTICE EVENT
    ↓
EVIDENCE
```

The user should understand:

> This is what I am going to try next.

The system should explain why in one or two sentences.

Example:

``` text
TRY THIS

Before your next difficult conversation, say the thing you are avoiding in one clear sentence.

WHY

The pattern ATUNED identified appears to become active when you anticipate conflict.
```

The user can accept, edit, or reject the practice.

The system proposes.

The user decides.

------------------------------------------------------------------------

# 21. Do Not Confuse Completion With Change

This is a critical implementation rule.

These are different:

``` text
Ritual completed
Practice completed
Evidence recorded
Behavior changed
Outcome improved
```

They must remain separate.

For example:

``` text
PracticeEvent = completed
Evidence = user reports attempting behavior
Outcome = not yet established
```

Do not automatically mark:

``` text
completed ritual = changed person
```

The existing Practice/Ritual TDD explicitly prohibits this.

------------------------------------------------------------------------

# 22. P1: Build a Real 90 Day State Engine

The current app has substantial 90 day historical analysis.

That is useful.

But historical reporting is not the same as a 90 day journey engine.

Current capability is closer to:

> What happened over the last 90 days?

The required capability is:

> Given what has happened, what should this person experience or
> practice next?

This distinction is fundamental.

------------------------------------------------------------------------

# 23. 90 Day Engine Model

Create a persistent journey state.

Suggested conceptual model:

``` yaml
JourneyState:
  user_id

  activation:
    completed: boolean
    date

  current_stage:
    day_1
    day_2_7
    day_8_14
    day_15_30
    day_31_60
    day_61_90

  current_focus:
    pattern_id
    goal_id
    behavior_id
    protocol_id
    ritual_id

  next_action:
    type
    id
    rationale

  unresolved:
    patterns
    questions
    contradictions
    goals

  recent_evidence:
    []

  recent_outcomes:
    []

  last_verified_change:
    []

  next_review:
    timestamp
```

This does not have to be the literal schema.

The architecture must support the behavior.

------------------------------------------------------------------------

# 24. The 90 Day Engine Must Answer One Question

At any point:

> **What is the most useful next thing for this person to do?**

That answer should come from the existing intelligence system.

The system should consider:

``` text
current goal
selected ground
confirmed patterns
pattern recurrence
evidence strength
previous interventions
intervention response
practice history
missed practices
context
behavior
desired outcome
user preferences
uncertainty
contradictions
```

It should not simply rotate through generic daily activities.

------------------------------------------------------------------------

# 25. Daily State

Each day should resolve into something simple.

Conceptually:

``` text
TODAY

What is active?
What matters?
What changed?
What needs attention?
What is the next useful action?
```

The user should not need to navigate the entire system to find the
answer.

The daily experience can use the existing Summary architecture.

------------------------------------------------------------------------

# 26. Day 1

Day 1 should contain:

``` text
SELECT GROUND
↓
FEEL
↓
STORY
↓
MIRROR
↓
CONFIRM
↓
FIRST RELEASE
↓
VERIFY
↓
FIRST PRACTICE
```

That is enough.

Do not introduce the full Avatar, CQ100, 100-question assessment,
advanced archetypes, complex dashboards, or cohort systems before the
core loop works.

------------------------------------------------------------------------

# 27. Day 2 to Day 7

The system should observe what happened after the first release.

Questions can include:

``` text
Did the situation come up again?
What happened?
Did you notice the pattern sooner?
Did the practice change anything?
Did the same pattern show up somewhere else?
```

The system should not ask all of these every day.

SOURCE OS should select the smallest useful question based on
uncertainty.

This is exactly what the existing intelligence architecture calls for:

``` text
IDENTIFY UNCERTAINTY
↓
FIND SMALLEST USEFUL QUESTION
↓
USER ANSWERS
↓
UPDATE TRACE GRAPH
```

------------------------------------------------------------------------

# 28. Day 7

Day 7 should produce a small synthesis.

For example:

``` text
WHAT ATUNED HAS SEEN

One pattern has appeared repeatedly.

WHAT CHANGED

You noticed it sooner twice this week.

WHAT IS STILL UNCLEAR

It appears strongly at work but has not yet appeared in your relationship records.

NEXT

Test whether the same behavior appears in one relationship this week.
```

This demonstrates longitudinal intelligence.

------------------------------------------------------------------------

# 29. Day 14

Evaluate:

``` text
recurrence
practice fidelity
behavioral change
context transfer
new evidence
contradiction
intervention response
```

If the pattern is weakening, the system can shift toward integration.

If the pattern is recurring, investigate.

If the intervention has not produced change, do not simply repeat it
indefinitely.

Ask why.

------------------------------------------------------------------------

# 30. Day 30

The 30 day synthesis should answer:

``` text
What changed?
What remained?
What recurred?
What generalized?
What is still situational?
What evidence exists?
What intervention worked?
What intervention did not work?
What should remain active?
```

Use the existing classification vocabulary where applicable:

``` text
RESOLVED
INTEGRATED
IMPROVED
SITUATIONAL
RECURRING
UNCHANGED
TRANSFERRED
REPLACED_BY_ANOTHER_MECHANISM
INSUFFICIENT_EVIDENCE
```

Every classification needs supporting evidence.

------------------------------------------------------------------------

# 31. Day 60

Day 60 should investigate deeper longitudinal behavior.

Questions:

``` text
Which patterns weakened?
Which patterns recurred?
Which new patterns appeared?
Did behavior change?
Did change transfer between contexts?
Did one pattern replace another?
Which interventions appear ineffective?
```

This is already defined in the Intelligence TDD.

The implementation requirement is to make the experience operational
rather than leaving it as reporting logic.

------------------------------------------------------------------------

# 32. Day 90

The 90 day synthesis should answer:

``` text
What materially changed?
What remained?
What integrated?
What recurred?
What generalized?
What remains situational?
What behavioral evidence exists?
What desired outcomes improved?
What evidence remains insufficient?
What should remain in active rotation?
```

The result should not be a score of the user's worth.

It should be an evidence-backed record of what happened.

------------------------------------------------------------------------

# 33. P1: Connect Practice to Evidence and Outcomes

The current Practice architecture is strong.

Use it.

The intended chain is:

``` text
GOAL
↓
BEHAVIOR
↓
PATTERN
↓
PROTOCOL
↓
RITUAL
↓
PRACTICE EVENT
↓
EVIDENCE
↓
OUTCOME
```

The Trace Graph should remain authoritative.

Do not create a separate "90 day graph."

Do not create a separate "funnel intelligence graph."

Do not create a second pattern database for onboarding.

Everything should connect to the same underlying model.

------------------------------------------------------------------------

# 34. The Trace Graph Must Become the Spine

The graph should represent:

``` text
STORY
↓
IMPRESSION
↓
PATTERN
↓
GOAL
↓
BEHAVIOR
↓
PROTOCOL
↓
RITUAL
↓
PRACTICE EVENT
↓
EVIDENCE
↓
OUTCOME
```

With contextual relationships such as:

``` text
occurs_in
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
replaces
precedes
follows
generalizes_to
transfers_to
```

Do not use generic `related_to` when a more meaningful edge exists.

------------------------------------------------------------------------

# 35. Protocol Versus Ritual

Keep this distinction exact.

## Protocol

The intervention design.

It answers:

> What are we doing and why?

## Ritual

The execution structure.

It answers:

> When and how will this be practiced?

## PracticeEvent

The actual execution record.

It answers:

> What actually happened?

This distinction must remain intact.

------------------------------------------------------------------------

# 36. Adaptive Accountability

When a practice is missed, do not interpret that automatically as
motivation failure.

The existing TDD provides the correct model.

After repeated misses:

``` text
MISSED
↓
INVESTIGATE
↓
WHY?
```

Possible reasons:

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

Then propose an adaptation:

``` text
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

The user decides.

------------------------------------------------------------------------

# 37. Protocol Progression

Practice should become more sophisticated only when evidence supports
it.

Example:

``` text
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

This is an example of progression, not a universal sequence.

The engine should be able to:

``` text
progress
hold
simplify
regress
replace
```

based on evidence.

------------------------------------------------------------------------

# 38. Make the Field the Interface

The Field should respond to actual system state.

The visual grammar should be semantic.

``` text
SIGNAL
node appears

NOTICE
node brightens

CONNECT
line forms

CONTRADICTION
paths diverge

TEST
paths become selectable

CONFIRM
path stabilizes

UNKNOWN
path remains open

PATTERN
repetition gathers

RELEASE
structure loosens

CHANGE
state reorganizes

VERIFY
before/after separates

MIRROR
system gathers the current model
```

Do not add motion just because motion is attractive.

Every motion should mean something.

------------------------------------------------------------------------

# 39. The Field Should Remember

When the user returns, the Field should not reset to a generic
animation.

It should reflect accumulated state.

For example:

``` text
Previously confirmed pattern
    ↓
existing node

Repeated pattern
    ↓
node becomes more established

Rejected hypothesis
    ↓
does not remain presented as fact

New relationship
    ↓
new connection

Verified change
    ↓
visible structural shift

Active practice
    ↓
linked ritual/action state
```

The Field becomes the visual memory of the user's relationship with
ATUNED.

------------------------------------------------------------------------

# 40. P0: Remove the Manual Export / Import Requirement

The current funnel tells users to save a record and manually load it in
the app.

That should be removed from the normal path.

Manual export/import can remain as a privacy or portability function.

It should not be required for ordinary activation.

Required path:

``` text
Funnel
↓
same identity/session
↓
activation persisted
↓
App opens
↓
activation restored
↓
continue
```

If the user leaves before completing activation:

``` text
return
↓
recover activation
↓
continue from last safe checkpoint
```

No silent loss.

------------------------------------------------------------------------

# 41. Recovery Must Be First Class

Every major funnel state must be recoverable.

At minimum:

``` text
landing
ground selected
story started
story saved
mirror generated
correction submitted
pattern confirmed
release started
release completed
verification submitted
practice accepted
account created
payment started
payment completed
```

If the browser closes after the user submits their story, the story
should not disappear.

If the release is interrupted, the system should know it was
interrupted.

If the user returns later, the system should present the correct
continuation state.

------------------------------------------------------------------------

# 42. Commerce Must Match the Product

The current app contains commerce seams:

``` text
free: 0
tier 1: $12
tier 2: $29
tier 3: $59
tier 4: $99
```

The current plan structure also contains:

``` text
Gift: 100 once
Free: 10/week
Tier 1: 400/month
Tier 2: 800/month
Tier 3: 1,200/month
Tier 4: 1,200/month + lead capability
```

The funnel buy page currently says checkout is not open.

That conflicts with the app's commerce implementation.

These two states must agree.

There should be one canonical commerce state.

------------------------------------------------------------------------

# 43. Commerce Principle

The commercial model is:

> **Sight is not for sale. New ground is.**

The user should not lose access to something they have already
discovered simply because they are free.

The paid tiers provide more new ground and capacity.

Therefore:

``` text
Existing pattern
→ rerun free

New pattern
→ consumes available new-ground allowance
```

This should be enforced consistently across:

``` text
funnel
app
entitlements
billing
pattern engine
rerun
practice
```

------------------------------------------------------------------------

# 44. Paywall Timing

Do not place a paywall before demonstrated value.

The intended sequence is:

``` text
SEE
↓
EXPERIENCE
↓
RELEASE
↓
VERIFY
↓
PRACTICE
↓
RETURN
↓
NEED MORE GROUND
↓
PAID OPTION
```

The user should understand why additional capacity matters.

Do not create artificial urgency.

Do not hide the reading.

Do not make the user pay to learn what ATUNED already observed.

------------------------------------------------------------------------

# 45. Free Tier

The Free experience should remain useful.

Conceptually:

``` text
Starter Gift
100 patterns once

Then

10 new patterns per week

Unused Free patterns bank
```

The free user should still be able to:

``` text
discover
release
rerun
practice
journal
observe
return
```

The purpose of the free tier is to allow the user to establish a
relationship with the instrument.

------------------------------------------------------------------------

# 46. Paid Tiers

The paid tiers should increase new-ground throughput.

Current working structure:

``` text
Tier 1
$12
400/month

Tier 2
$29
800/month

Tier 3
$59
1,200/month

Tier 4
$99
1,200/month
+ cohort lead capability
```

Do not redesign the pricing while solving the funnel.

First make the value loop work.

Pricing can be validated after actual user behavior exists.

------------------------------------------------------------------------

# 47. Identity

Identity should be established without forcing unnecessary account
creation before the user experiences the product.

The user should be able to enter and begin.

The system needs a reliable way to associate:

``` text
activation
starter gift
story
pattern
release
verification
practice
evidence
entitlement
```

with the same person.

If guest mode exists, it needs a safe merge path when the user creates
an account.

Do not duplicate records during the merge.

------------------------------------------------------------------------

# 48. Account Merge

Required conceptual behavior:

``` text
GUEST SESSION
    ↓
ACCOUNT CREATED
    ↓
IDENTITY LINK
    ↓
MERGE ACTIVATION
    ↓
MERGE STARTER GIFT
    ↓
MERGE STORY
    ↓
MERGE PATTERNS
    ↓
MERGE RELEASE
    ↓
MERGE EVIDENCE
```

The system must preserve provenance.

If two records conflict, do not silently overwrite one.

Resolve according to the identity and persistence architecture.

------------------------------------------------------------------------

# 49. Source OS Must Drive the Questions

The existing intelligence architecture requires adaptive questioning.

Do not hard-code a long questionnaire into the core journey.

The system should ask the smallest useful question.

Conceptually:

``` text
CURRENT EVIDENCE
↓
UNCERTAINTY
↓
SMALLEST USEFUL QUESTION
↓
USER RESPONSE
↓
TRACE UPDATE
↓
NEXT QUESTION
```

This is the difference between a questionnaire and an intelligence
system.

------------------------------------------------------------------------

# 50. Alternative Hypotheses

When evidence supports more than one explanation, the system should not
prematurely collapse them.

Example:

``` text
Observed:
"I avoid the conversation."

Possible hypotheses:

A. fear of conflict
B. fear of rejection
C. uncertainty about what to say
D. belief that speaking will make things worse
```

The system should identify the uncertainty and ask the smallest useful
question.

It should not choose one simply because a keyword matched.

------------------------------------------------------------------------

# 51. Contradictions

Contradictions should remain visible to the intelligence layer.

Example:

``` text
User says:
"I don't care what people think."

Later:
"I stayed awake all night worrying about what my boss thought."
```

The system should not declare the user dishonest.

It should recognize the inconsistency as evidence worth exploring.

Possible response:

> You described not caring what people think, but you also described
> staying awake worrying about your boss's reaction. Which feels more
> accurate in the moment when this happens?

The system investigates.

It does not moralize.

------------------------------------------------------------------------

# 52. Confidence and Uncertainty

Keep uncertainty internal to the intelligence model.

The user does not need confidence scores.

The user needs clear language about what is known and what is still
unclear.

Internally:

``` text
observation
inference
hypothesis
confirmed
rejected
unknown
```

Externally:

``` text
You said...
ATUNED noticed...
This may be...
Is that right?
```

Do not manufacture precision for subjective states.

------------------------------------------------------------------------

# 53. Evidence Ledger

The Evidence Ledger should preserve:

``` text
hypothesis
supporting signals
contradicting signals
alternatives
questions asked
user confirmations
interventions
outcomes
confidence history
final status
```

The ledger is not a user-facing chain-of-thought system.

It is provenance.

It should allow the system to answer:

> Why does ATUNED currently think this?

without exposing private internal reasoning.

------------------------------------------------------------------------

# 54. Safety

The product handles deeply personal narratives.

Safety must therefore be operational.

At minimum verify:

``` text
safety gate
sensitive content handling
privacy
deletion
export
data retention
account recovery
consent
escalation behavior
```

The system should not make clinical diagnoses from ordinary language.

For example, if a user says:

> I am depressed.

ATUNED can work with the user's statement as an experience.

It should not automatically conclude:

> You have depression.

The same principle applies to addiction, trauma, psychiatric conditions,
and medical conditions.

------------------------------------------------------------------------

# 55. Addiction Sniffer

If the addiction language system is used, maintain the distinction:

``` text
addicted
dependent
crave
desire
need
want
```

Language detection is not diagnosis.

The system may identify that a user is using addiction language and
offer a release at that level.

It should not infer a clinical disorder solely from the wording.

------------------------------------------------------------------------

# 56. Daily Summary

The Daily Summary should be an integration layer.

It should answer:

``` text
What is happening?
What is getting in the way?
What is changing?
What needs attention?
What is today's intention?
What is one useful thing to try?
Why?
```

Suggested structure:

``` text
TODAY
[One sentence describing current state.]

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

Do not make this a dashboard of scores.

------------------------------------------------------------------------

# 57. Evidence Hierarchy

The system should prefer evidence in this order:

``` text
1. Direct observed behavior
2. Explicit user statement
3. Repeated journal evidence
4. Ritual completion/outcome evidence
5. Integrity records
6. Pattern detection
7. System-derived interpretation
8. Energetic/archetypal interpretation
```

Lower-level interpretation must not override stronger direct evidence.

This should affect both intelligence and daily summaries.

------------------------------------------------------------------------

# 58. What Not to Build Yet

Do not allow scope expansion to become the next failure mode.

Do not prioritize these ahead of the first experience:

``` text
advanced Avatar
deep achievement system
complex cohort mechanics
advanced analytics
population learning
full CQ100 presentation
expanded archetype system
large dashboard
additional scoring
more questionnaires
new graph system
new release engine
new pattern engine
```

These can be valuable.

They are not the immediate bottleneck.

The immediate bottleneck is:

``` text
FIRST EXPERIENCE
→ FIRST RELEASE
→ SECOND RELEASE
→ PRACTICE
→ RETURN
```

------------------------------------------------------------------------

# 59. Do Not Duplicate Existing Systems

This is a hard architectural rule.

Before creating a new:

``` text
Pattern
Graph
Release
Evidence
Protocol
Ritual
State
Identity
Question
```

the implementation AI must search the current codebase and TDDs.

If an equivalent system exists:

``` text
reuse
extend
adapt
```

Do not create a parallel implementation.

The existing TDD explicitly says:

> Do not create a second intelligence graph.

and:

> Do not duplicate the Release Engine.

------------------------------------------------------------------------

# 60. First Release Success Is the Primary Product Test

Before optimizing conversion, determine whether the first release works
as a product experience.

A successful first session means:

``` text
User identifies one relevant issue
↓
ATUNED produces a mirror
↓
User confirms or corrects it
↓
ATUNED runs one release
↓
User reports what changed
↓
ATUNED gives one useful practice
```

The user does not need to understand:

``` text
Trace Graph
Evidence Ledger
SOURCE OS
Pattern Engine
Protocol Engine
90 Day Engine
```

Those are implementation systems.

The user needs to experience their effect.

------------------------------------------------------------------------

# 61. Second Release

The second release is where the system begins proving continuity.

It should use prior evidence.

Example:

``` text
FIRST RELEASE
Pattern:
fear of disappointing others

Practice:
say no once

NEXT STORY
"I said no to my coworker and immediately felt guilty."

SOURCE OS:
same pattern appears again

SECOND RELEASE:
guilt / obligation relationship
```

The second release should feel like:

> ATUNED remembers me.

Not:

> ATUNED started over.

------------------------------------------------------------------------

# 62. Third Release

The third release should demonstrate relationship discovery.

For example:

``` text
Pattern A
fear of disappointing others

Pattern B
over-responsibility

Pattern C
difficulty saying no
```

The system may discover that these repeatedly occur together.

Then:

``` text
PATTERN CLUSTER
        ↓
SHARED MECHANISM
        ↓
ONE CONSOLIDATED PROTOCOL
```

This uses the existing Protocol Consolidation architecture.

The user should not receive three redundant practices when one coherent
practice can address the shared mechanism.

------------------------------------------------------------------------

# 63. Practice Must Become the Bridge to 90 Days

The transition should be:

``` text
Release
↓
Verification
↓
Practice
↓
Evidence
↓
Next story
↓
Updated model
```

That loop is what creates the 90 day relationship.

Without practice, the product remains a sequence of interesting
sessions.

With practice and evidence, it becomes a longitudinal system.

------------------------------------------------------------------------

# 64. 90 Day Simulation Requirements

The next simulation should not simply count whether users are retained.

It should simulate the actual causal journey.

For each synthetic user, track:

``` text
entry
selected ground
story completion
mirror acceptance
mirror correction
first release
release result
practice acceptance
practice completion
evidence
second interaction
second release
third interaction
recurrence
context transfer
30 day state
60 day state
90 day state
new-ground demand
tier eligibility
payment decision
retention
```

------------------------------------------------------------------------

# 65. Simulation Cohorts

Use the existing 1,000 synthetic ICP cohort.

Preserve the known friction categories:

``` text
inconsistent follow-through
overwhelm from too many choices
difficulty naming feelings
price sensitivity
resistance to paid support
skepticism of spiritual language
fear of being judged
privacy trust
time scarcity
needs proof before commitment
```

Do not treat these as actual customer statistics.

They are simulation assumptions.

The simulation must clearly distinguish:

``` text
OBSERVED
MODEL ASSUMPTION
SIMULATED RESULT
```

------------------------------------------------------------------------

# 66. Simulation Comparison

Run at least two scenarios.

## Scenario A: Current Funnel

``` text
Landing
↓
100 Question Test
↓
Reading
↓
Story
↓
Manual Export
↓
Manual Import
↓
App
```

## Scenario B: Mirror First

``` text
Landing
↓
Starting Ground
↓
Feel
↓
Story
↓
Mirror
↓
Correction
↓
First Release
↓
Verification
↓
Practice
↓
Return
```

Compare:

``` text
entry → story
story → mirror
mirror → release
release → verification
verification → practice
practice → second session
second session → third session
third session → 30 day
30 day → 60 day
60 day → 90 day
90 day → new ground
new ground → paid
```

The purpose is not to invent a target retention number.

The purpose is to identify where users are being lost and why.

------------------------------------------------------------------------

# 67. Failure States

The simulation must model failure.

At minimum:

``` text
does_not_start
starts_but_abandons
story_abandoned
mirror_rejected
mirror_unclear
release_abandoned
release_halted
release_no_effect
release_unclear
practice_rejected
practice_missed
practice_repeatedly_missed
second_session_abandoned
third_session_abandoned
payment_declined
payment_not_attempted
downgrade
cancel
return
```

Do not collapse all failure into churn.

Different failures imply different product solutions.

------------------------------------------------------------------------

# 68. Recovery States

For every important failure, define a recovery.

Examples:

``` text
mirror_rejected
→ ask correction

story abandoned
→ preserve partial story
→ resume

release halted
→ save progress
→ allow safe return

release no effect
→ investigate
→ try different intervention

practice missed
→ investigate why
→ adapt

user disappears
→ preserve state
→ resume on return
```

The system should adapt rather than punish.

------------------------------------------------------------------------

# 69. The Simulation Should Find Gaps

After each run, produce:

``` text
LOSS POINT
CAUSE
EVIDENCE
CURRENT SYSTEM
MISSING CAPABILITY
PROPOSED SOLUTION
PRIORITY
TEST
```

Example:

``` text
LOSS POINT
Landing → Test

CAUSE
100-question burden

CURRENT SYSTEM
100-question test is the primary CTA

MISSING CAPABILITY
Experience before assessment

SOLUTION
Move starting-ground selection and first story ahead of assessment

PRIORITY
P0

TEST
Compare completion and first-release rates
```

------------------------------------------------------------------------

# 70. Acceptance Criteria for P0 Funnel

The implementation is not complete until all are true.

``` text
[ ] Funnel app handoff works.
[ ] No dead source.html link.
[ ] Activation state persists.
[ ] User does not need manual export/import.
[ ] User can select a starting ground.
[ ] Selected ground is preserved.
[ ] Starter gift is issued.
[ ] Starter gift is tied to selected ground.
[ ] User can tell or type a story.
[ ] Story is persisted.
[ ] Sniffer produces structured signals.
[ ] Mirror is shown.
[ ] User can confirm.
[ ] User can reject.
[ ] User can correct.
[ ] Correction changes the model.
[ ] Pattern is selected from actual evidence.
[ ] First release invokes the real Release Engine.
[ ] Release is persisted.
[ ] Release can be interrupted safely.
[ ] Verification is requested.
[ ] Verification is persisted.
[ ] One next practice is proposed.
[ ] User can accept/edit/reject practice.
[ ] Practice connects to Protocol/Ritual/PracticeEvent.
[ ] Funnel activation enters the same app state as native app activation.
```

------------------------------------------------------------------------

# 71. Acceptance Criteria for 90 Day Engine

``` text
[ ] Persistent journey state exists.
[ ] Current stage is recoverable.
[ ] Current focus is recoverable.
[ ] Next action is recoverable.
[ ] Next action has a reason.
[ ] Evidence affects future questions.
[ ] Prior patterns affect future sessions.
[ ] Rejected patterns are not treated as confirmed.
[ ] Previous interventions affect future selection.
[ ] Missed practices trigger investigation rather than punishment.
[ ] Practice events remain immutable.
[ ] Protocol versions remain historically immutable.
[ ] 30 day synthesis exists.
[ ] 60 day synthesis exists.
[ ] 90 day synthesis exists.
[ ] Classifications require evidence.
[ ] Outcome claims require verification.
[ ] Context transfer can be recorded.
[ ] Pattern recurrence can be recorded.
[ ] Pattern replacement can be recorded.
[ ] The system can identify insufficient evidence.
[ ] The next best action is generated from current state.
```

------------------------------------------------------------------------

# 72. Acceptance Criteria for Intelligence

``` text
[ ] Observation is distinguishable from inference.
[ ] Hypothesis is distinguishable from confirmation.
[ ] User rejection is preserved.
[ ] Contradicting evidence is preserved.
[ ] Alternative hypotheses can exist.
[ ] Smallest useful question can be selected.
[ ] Questions are selected from current uncertainty.
[ ] Evidence is linked to hypotheses.
[ ] Interventions are linked to hypotheses.
[ ] Outcomes are linked to interventions.
[ ] Longitudinal evidence changes future reasoning.
[ ] AI does not silently invent missing evidence.
[ ] AI does not turn inference into user fact.
[ ] Existing Trace Graph remains authoritative.
```

------------------------------------------------------------------------

# 73. Acceptance Criteria for Visual Intelligence

``` text
[ ] Field responds to story.
[ ] Field responds to detected signals.
[ ] Field shows confirmed relationships.
[ ] Field distinguishes unresolved relationships.
[ ] Field changes during release.
[ ] Field shows before/after state.
[ ] Field reflects prior history on return.
[ ] Rejected hypotheses do not remain visually presented as truth.
[ ] Motion has semantic meaning.
[ ] No decorative motion is required.
```

------------------------------------------------------------------------

# 74. Testing Strategy

Testing must occur at four levels.

## Unit

Test:

``` text
story extraction
hypothesis state
correction
pattern selection
release accounting
verification
practice state
evidence creation
graph edges
entitlements
```

## Integration

Test:

``` text
funnel → identity
funnel → activation
activation → app
story → sniffer
sniffer → evidence
evidence → hypothesis
hypothesis → mirror
mirror → release
release → verification
verification → protocol
protocol → ritual
ritual → practice
practice → evidence
evidence → outcome
```

## Recovery

Test:

``` text
browser close
refresh
network interruption
release interruption
duplicate submit
back button
returning user
guest → account
payment failure
payment success
payment retry
```

## Longitudinal

Test:

``` text
day 1
day 7
day 14
day 30
day 60
day 90
recurrence
replacement
integration
context transfer
```

------------------------------------------------------------------------

# 75. Browser and Persistence Testing

The system must survive:

``` text
reload
browser close
offline state
sync
conflict
migration
rollback
schema upgrade
```

This is already identified in the Practice TDD.

The implementation AI should test these instead of assuming persistence
works because a local state object exists.

------------------------------------------------------------------------

# 76. Observability

Every critical funnel step needs an event.

At minimum:

``` text
landing_view
ground_selected
starter_gift_issued
story_started
story_submitted
mirror_generated
mirror_confirmed
mirror_rejected
mirror_corrected
pattern_selected
release_started
release_completed
release_halted
release_verified
practice_proposed
practice_accepted
practice_rejected
practice_completed
practice_missed
second_session_started
third_session_started
day_30_reached
day_60_reached
day_90_reached
new_ground_requested
paywall_reached
checkout_started
checkout_completed
```

These are product analytics events.

Do not expose internal confidence values to the user unless explicitly
required.

------------------------------------------------------------------------

# 77. Analytics Must Explain Loss

Do not only report:

``` text
conversion = X
retention = Y
```

Report:

``` text
Where did people leave?
What were they trying to do?
What had they experienced?
What had they not experienced?
What friction preceded the exit?
Was value demonstrated?
Was the system understood?
Was the system trusted?
Was the user overwhelmed?
```

The purpose of analytics is to improve the experience.

------------------------------------------------------------------------

# 78. Product Metric Hierarchy

Do not make payment the first optimization target.

The hierarchy should be:

``` text
1. First meaningful experience
2. First successful release
3. Second successful release
4. Third successful release
5. Self-directed practice
6. Demonstrated change
7. Return behavior
8. New-ground demand
9. Paid conversion
10. Retention
```

The key product question is:

> How many entrants reach repeated self-directed practice and can
> demonstrate that ATUNED is producing meaningful value for them?

That is more informative than raw account creation.

------------------------------------------------------------------------

# 79. Commerce Should Follow Behavior

Do not optimize the paywall before establishing that users want more
ground.

The ideal trigger is:

``` text
User has experienced value
↓
User returns
↓
User consumes available new ground
↓
User wants to continue
↓
ATUNED presents additional capacity
```

That is the natural commercial event.

------------------------------------------------------------------------

# 80. The 100 Question Test Should Become Expansion

The assessment is not wasted.

It becomes more valuable when the user already understands the
instrument.

Possible placement:

``` text
After first release
or
After repeated practice
or
As deeper assessment
or
As a user-selected exploration mode
```

At that point the user can understand why the questions matter.

The test becomes an expansion of the relationship rather than a toll
booth before it begins.

------------------------------------------------------------------------

# 81. Tutorial Strategy

The tutorial should teach by doing.

Do not create a long explanatory tutorial before first value.

The product should teach:

``` text
I write
ATUNED notices

I correct
ATUNED updates

I release
ATUNED changes the Field

I verify
ATUNED records evidence

I practice
ATUNED remembers
```

This is the tutorial.

After that, additional explanations can progressively disclose the
architecture.

------------------------------------------------------------------------

# 82. Progressive Disclosure

Use this sequence:

``` text
FIRST EXPERIENCE
minimal vocabulary

AFTER FIRST RELEASE
show pattern detail

AFTER SECOND RELEASE
show relationships

AFTER REPEATED USE
show deeper system concepts

AFTER PRACTICE HABIT
show advanced tools

AFTER MASTERY
show advanced analytics
```

The system should become more understandable as the user becomes more
experienced.

Do not require the user to understand everything before beginning.

------------------------------------------------------------------------

# 83. The User Should Not See the Graph

The Trace Graph is an intelligence structure.

The user can experience its effects through the Field.

Do not expose the full graph as a technical diagram during the primary
path.

Use:

``` text
Field
nodes
relationships
before/after
summary
```

rather than:

``` text
graph database
node IDs
edge types
confidence values
schema terminology
```

The architecture stays underneath.

------------------------------------------------------------------------

# 84. Avatar Timing

The Avatar is important.

But it should not be introduced prematurely.

The user's first interaction is not:

> Who are you becoming?

It is:

> What brought you here?

The Avatar becomes more meaningful after ATUNED has observed enough
behavior and the user has explicitly defined desired identity.

Then:

``` text
USER DEFINES BECOMING
↓
AVATAR
↓
PURPOSE
↓
VALUES
↓
BOUNDARY
↓
NON-NEGOTIABLES
↓
PRACTICE
↓
EVIDENCE
↓
INTEGRITY
```

The system should not decide who the user should become.

------------------------------------------------------------------------

# 85. User Agency

The system proposes.

The user decides.

This applies to:

``` text
identity
meaning
boundaries
goals
patterns
interventions
protocols
rituals
adaptations
```

AI can structure information.

AI can identify candidates.

AI can propose.

AI must not silently turn its interpretation into user-owned truth.

------------------------------------------------------------------------

# 86. What the Implementation AI Should Do First

The implementation AI should follow this sequence.

``` text
1. Inspect current repository.

2. Locate:
   Story
   Sniffer
   Pattern
   Release
   Reframe
   Ritual
   Protocol
   Practice
   Evidence
   Outcome
   Trace Graph
   Identity
   Entitlements
   Commerce
   Persistence
   AI Handshake

3. Map current implementation to this document.

4. Produce:
   EXISTS
   PARTIAL
   MISSING
   CONFLICT
   UNVERIFIED

5. Identify duplicate systems.

6. Identify migration requirements.

7. Fix P0 funnel handoff.

8. Implement activation persistence.

9. Implement starting-ground selection.

10. Implement real FEEL interaction.

11. Implement Story → Sniffer → Evidence.

12. Implement Mirror → Test → Correction.

13. Connect correction to updated intelligence.

14. Connect pattern selection to real Release Engine.

15. Add immediate verification.

16. Connect verification to Practice.

17. Connect Practice to Trace Graph.

18. Build persistent 90 day state.

19. Build next-action selection.

20. Run tests.

21. Run 90 day simulation.

22. Re-audit.

23. Report:
    IMPLEMENTED
    TESTED
    UNVERIFIED
    BLOCKED
    CONFLICTS
    NEXT PRIORITIES
```

Do not begin by blindly creating new architecture.

------------------------------------------------------------------------

# 87. Required Audit Format

For every requirement, the implementation AI should produce:

``` text
REQUIREMENT:
[exact requirement]

CURRENT IMPLEMENTATION:
[file/component/function]

STATUS:
EXISTS | PARTIAL | MISSING | CONFLICT | UNVERIFIED

DATA DEPENDENCIES:
[what must exist]

REQUIRED CHANGE:
[exact change]

TEST:
[how it will be proven]

REGRESSION RISK:
[what existing behavior could break]
```

This prevents the AI from saying:

> "This is already supported."

without proving where.

------------------------------------------------------------------------

# 88. Definition of Done

Do not declare the new funnel complete because the screens exist.

It is complete when:

``` text
A new person can enter.
↓
Select what brought them here.
↓
Receive the appropriate starting ground.
↓
Tell ATUNED what is happening.
↓
ATUNED extracts the signal.
↓
ATUNED presents a mirror.
↓
The person can correct it.
↓
ATUNED actually changes its model.
↓
The person confirms a relevant pattern.
↓
ATUNED runs the existing Release Engine.
↓
The person verifies what changed.
↓
ATUNED proposes one useful practice.
↓
The person can perform that practice.
↓
ATUNED records the PracticeEvent.
↓
Evidence enters the Trace Graph.
↓
The next interaction uses that evidence.
↓
The person experiences a second release.
↓
The person experiences a third release.
↓
Practice becomes self-directed.
↓
The system tracks meaningful change over 30/60/90 days.
↓
The user can request more new ground.
↓
Commerce responds to actual demand for additional ground.
```

If any of these are only represented visually but not connected in the
underlying system, the work is not complete.

------------------------------------------------------------------------

# 89. The Deepest Architectural Requirement

The final product should establish a causal chain.

Not:

``` text
SCREEN
→ SCREEN
→ SCREEN
→ SCREEN
```

But:

``` text
EXPERIENCE
→ EVIDENCE
→ INTERPRETATION
→ USER CONFIRMATION
→ INTERVENTION
→ VERIFICATION
→ PRACTICE
→ NEW EVIDENCE
→ UPDATED MODEL
→ NEXT INTERVENTION
```

This is the difference between an app with many features and an
intelligence system.

------------------------------------------------------------------------

# 90. Final Product Loop

The final ATUNED experience should feel like:

``` text
I FEEL
    ↓
I SAY
    ↓
ATUNED SEES
    ↓
I TEST WHAT IT SEES
    ↓
ATUNED ADJUSTS
    ↓
I CONFIRM
    ↓
ATUNED WORKS WITH IT
    ↓
I NOTICE WHAT CHANGED
    ↓
I PRACTICE
    ↓
ATUNED RECORDS WHAT HAPPENED
    ↓
ATUNED LEARNS FROM THE EVIDENCE
    ↓
ATUNED KNOWS WHAT TO ASK OR DO NEXT
```

The user should experience this as simple.

The architecture underneath can be complex.

That is the point.

------------------------------------------------------------------------

# 91. Priority Stack

## P0 --- Must happen before broad optimization

``` text
1. Fix broken funnel → app handoff.
2. Remove 100-question test from front door.
3. Add starting-ground selection.
4. Add real FEEL interaction.
5. Add real story intake.
6. Implement Mirror → Test → Correction.
7. Make correction alter the intelligence state.
8. Connect first pattern to actual Release Engine.
9. Make first release happen inside activation.
10. Add immediate verification.
11. Add first practice.
12. Persist activation.
13. Remove manual export/import.
14. Preserve recovery across interruption.
```

## P1 --- Make ATUNED longitudinal

``` text
15. Persistent 90 day journey state.
16. Next-action engine.
17. Practice → Evidence → Outcome.
18. Evidence-driven follow-up questions.
19. Second release.
20. Third release.
21. Adaptive accountability.
22. 30 day synthesis.
23. 60 day synthesis.
24. 90 day synthesis.
25. Context transfer.
26. Pattern recurrence.
27. Pattern replacement.
28. Verified outcome states.
```

## P2 --- Expand the product

``` text
29. Commerce refinement.
30. Advanced entitlements.
31. Deeper Avatar.
32. Cohort leadership.
33. Achievements.
34. Advanced analytics.
35. Population learning.
36. Expanded assessments.
```

------------------------------------------------------------------------

# 92. Final Instruction to the Implementation AI

Do not interpret this document as a request to add more screens.

Interpret it as a request to make the existing system behave as one
continuous instrument.

Do not solve the problem by adding more explanation.

Solve it by connecting the existing intelligence.

Do not solve the problem by adding more questionnaires.

Solve it by asking the smallest useful question.

Do not solve the problem by creating another pattern engine.

Use the existing Pattern Engine.

Do not solve the problem by creating another release engine.

Use the existing Release Engine.

Do not solve the problem by creating another graph.

Use the existing Trace Graph.

Do not solve the problem by exposing more internal architecture.

Keep complexity behind the interface.

Do not treat an AI inference as a fact.

Do not treat completion as change.

Do not treat a missed practice as failure of motivation.

Do not treat a score as the user's worth.

Do not treat the 90 day system as a reporting dashboard.

Make it a living state machine.

Most importantly:

> **Make the first 10 minutes genuinely intelligent before making the
> next 90 days more sophisticated.**

The first ten minutes are the foundation of the next ninety days.

If the first ten minutes do not establish:

``` text
I FEEL
→ I SAY
→ ATUNED SEES
→ I CONFIRM
→ ATUNED WORKS
→ I NOTICE
```

then the rest of the architecture has nothing strong enough to build on.

If that loop works, the existing Practice, Evidence, Trace Graph,
Protocol, Ritual, Accountability, Summary, Commerce, Avatar, and
Longitudinal systems finally have a coherent place in the product.

That is the implementation target.
