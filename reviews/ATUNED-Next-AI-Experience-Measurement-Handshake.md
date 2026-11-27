# ATUNED NEXT AI HANDOFF
## Experience, Measurement, Signal Test, Baseline, Gap, Release, Re-Test, Ritual, and Software Claim

**Document type:** Implementation handoff for the next AI / engineering / product pass  
**Status:** Required next-pass specification  
**Product:** ATUNED / SOURCE OS  
**Primary source:** ATUNED System Congruency & Onboarding Architecture TDD  
**Purpose:** Define the new user journey and every data contract the frontend, domain engine, algorithms, persistence layer, and backend must support.

---

# 1. NON-NEGOTIABLE ARCHITECTURE

The new experience does **not** replace the canonical information path.

The canonical path remains:

```text
USER
↓
INTERACTION
↓
EVIDENCE LEDGER
↓
SNIFFER / OBSERVATION
↓
HYPOTHESIS
↓
USER CONFIRMATION / CORRECTION
↓
CONFIRMED KNOWLEDGE
↓
RELEASE
↓
VERIFICATION
↓
OUTCOME
↓
MEMORY
↓
NEXT DECISION
```

The frontend is a presentation and interaction layer.

It must not become a second intelligence engine.

The domain engine remains authoritative for:

```text
evidence
observation
hypothesis
confirmation
pattern
coherence
gap
release
verification
outcome
ritual
memory
trace
```

The next AI must audit the existing implementation before changing it.

For every requirement, report:

```text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

Documentation is not proof of implementation.

---

# 2. THE REFINED FIRST-USE JOURNEY

The new journey is:

```text
ARRIVE
↓
SIGNAL TEST
↓
AHA / RECOGNITION
↓
BASELINE
↓
READING
↓
STORY
↓
MIRROR
↓
CONFIRM / CORRECT
↓
ADDRESS
↓
RELEASE
↓
PAUSE
↓
RE-TEST
↓
WHAT CHANGED?
↓
RITUAL DETECTED
↓
ADD TO COLLECTION
↓
CLAIM / ACCOUNT
↓
FIELD
↓
DISCOVER AGAIN
```

This sequence should feel slow enough to feel, fast enough to understand, and responsive enough to trust.

The user must never feel behind.

There is no countdown.

There is no forced pace.

There is no automatic next step after release.

---

# 3. SIGNAL TEST COMES FIRST

The signal test is the first product demonstration.

The user should experience a recognizable signal before being asked to interpret a number.

The intended experience is:

```text
I NOTICE SOMETHING
↓
OH — THAT'S IT
↓
NOW I UNDERSTAND WHAT YOU ARE MEASURING
```

The signal test should ask:

> Notice what happens in you.

Then:

> What do you feel?

Possible ordinary-language choices:

```text
tense
heavy
afraid
frustrated
numb
unclear
something else
```

Then:

> Where do you notice it?

Possible locations:

```text
chest
stomach
throat
head
shoulders
elsewhere
```

The Field responds immediately.

The signal is a user-reported experience.

It is not an objectively measured neurological event.

---

# 4. SIGNAL OBSERVATION CONTRACT

Conceptual schema:

```js
SignalObservation {
  id,
  sessionId,
  promptId,
  source: "user_report",
  rawResponse,
  normalizedQualities[],
  bodyLocation,
  intensity: {
    value,
    scale,
    userReported: true
  },
  context,
  createdAt,
  algorithmVersion,
  schemaVersion
}
```

The implementation may use different field names.

The semantic contract must remain.

Always distinguish:

```text
USER REPORTED
SYSTEM INFERRED
OBJECTIVELY MEASURED
```

Do not fabricate the third category.

---

# 5. COHERENCE CONTRACT

The current product uses a 0–100 coherence model.

The new experience adds a human-facing directional state.

```text
CQ = 0–100
```

Current proposed product bands:

```text
0–39    DESCENDING
40–60   OSCILLATING
61–100  ASCENDING
```

These boundaries are a new product rule from the current design discussion. They must not be represented as existing implementation until audited.

Human-facing language:

### Descending

> You're contracting. You're becoming more affected by what's around you.

### Oscillating

> You're moving between being affected and returning to yourself.

### Ascending

> You're expanding. You're becoming less affected by what's around you.

Do not introduce a second 1–10 coherence score.

CQ remains the measurement.

Direction remains the interpretation.

---

# 6. GAP CONTRACT

The product-level gap is:

```text
GAP = 100 - CURRENT CQ
```

Example:

```text
CQ = 62
GAP = 38
```

The gap is not a deficiency score.

Preferred language:

> There's still a gap.
>
> Here's what is creating it.

Avoid:

> You are 38 points deficient.

The gap is an invitation to investigate the load.

Potential contributors include:

```text
integrity gaps
pattern gaps
body / address load
story / history
action / embodiment gaps
```

These categories are explanatory unless the implementation defines independent calculations.

---

# 7. BASELINE CONTRACT

The baseline must be immutable.

A baseline can include:

```text
baseline CQ
baseline state
baseline gap
pattern-specific signal
pattern-specific user-reported intensity
body location
evidence IDs
observation ID
```

Example:

```text
BASELINE

CQ             62
STATE          OSCILLATING
GAP            38

PATTERN        Worry
SIGNAL         Tight / activated
USER REPORT    7 / 10
ADDRESS        resolved address
```

Never overwrite the baseline with the current result.

Create a new observation.

---

# 8. RESULTS EXPERIENCE

The Results experience should answer:

> How do I know this is working?

It should show:

```text
WHAT WAS TRUE BEFORE
↓
WHAT WE WORKED WITH
↓
WHAT HAPPENED
↓
WHAT CHANGED
```

Example:

```text
Worry

Before: 7 / 10
After:  4 / 10

CQ

Before: 62
After: 66

Gap

Before: 38
After: 34
```

The product must never force a positive result.

Valid outcomes:

```text
changed
different perspective
something moved
nothing changed
uncertain
```

A release may be complete even when the user reports no immediate change.

---

# 9. USER JOURNEY STORYBOARD

## Beat 01 — ARRIVE

Black background.

Quiet geometric Field.

Large ATUNED.

Copy:

> See what's running you.

CTA:

> Start

No explanation wall.

---

## Beat 02 — WELCOME

Copy:

> Something is happening.
>
> Let's look at it.

Secondary:

> ATUNED listens to what you experience, shows you what it notices, and lets you decide if it got it right.

Visual:

```text
FEEL → SAY → SEE → TEST → WORK
```

---

## Beat 03 — SIGNAL TEST

Copy:

> Notice what happens in you.

The user responds to a simple situation.

Then:

> Where do you notice it?

The Field responds.

---

## Beat 04 — AHA

Copy:

> There it is.
>
> That's the signal we're going to work with.

Optional:

> You don't have to explain it yet.

The relevant body area becomes active.

---

## Beat 05 — BASELINE

Now introduce measurement.

Example:

```text
62

OSCILLATING

You're moving between being affected
and returning to yourself.
```

Then:

```text
Ceiling       100
Current        62
Gap            38
```

Then:

> Here's what is creating the gap.

---

## Beat 06 — READING

Reveal progressively:

1. Overall coherence
2. Direction
3. Gap
4. Weakest laws
5. Loaded addresses
6. Patterns / saboteurs
7. Release order

Do not present everything simultaneously.

---

## Beat 07 — STORY

Copy:

> Now tell me what happened.

Secondary:

> Pick a real moment where you recognize this signal.

Text and voice are allowed.

The story is not another test.

The story increases resolution.

---

## Beat 08 — MIRROR

Show:

```text
YOU SAID

[actual user language]

ATUNED NOTICED

[direct observation]

ATUNED THINKS

[possible pattern]

IS THAT RIGHT?
```

Controls:

```text
THAT'S IT
NOT QUITE
LOOK AGAIN
```

Correction is evidence.

Rejected hypotheses cannot proceed to release.

---

## Beat 09 — ADDRESS

Copy:

> This is where we're going to look.

Then:

> Here's what is carrying the pattern.

Visual:

```text
STORY
↓
PATTERN
↓
ADDRESS
↓
BODY
```

---

## Beat 10 — RELEASE

Copy:

> Let's work with this one.

One address.

The release uses the authoritative release engine.

Within the Atüned model, release is tonal.

Conceptual visual:

```text
OLD WORD
↓
OLD STORY
↓
OLD PATTERN
↓
TONAL IMPRINT
↓
RELEASE
↓
SIGNAL DISRUPTS
↓
SPACE OPENS
```

Do not present the tonal model as independently established neuroscience.

---

## Beat 11 — PAUSE

Required state.

Copy:

> Stay here for a moment.

Then:

> You don't have to force a feeling.

Then:

> Notice what you notice.

The system does not automatically advance.

---

## Beat 12 — RE-TEST

Copy:

> Check again.

Ask about the same signal.

Example:

```text
Before     7 / 10
Now        4 / 10
```

Then show CQ and gap changes if applicable.

---

## Beat 13 — WHAT CHANGED?

Use:

```text
I feel different
I see it differently
Something moved
Nothing changed
I'm not sure
```

Optional:

> Anything else you noticed?

Persist as Evidence.

---

## Beat 14 — RITUAL DETECTED

This is the new conversion bridge.

Copy:

> Ritual detected.

Then:

> Add it to your collection?

CTA:

> Add to my collection

Do not explain the complete ritual system before this moment.

The word itself should create curiosity.

---

## Beat 15 — OWNERSHIP

After selection:

> Added.

Then:

> Your first ritual is waiting for you.

The free experience has produced a real artifact.

---

## Beat 16 — SOFTWARE BRIDGE

Copy:

> Keep going in ATUNED.
>
> Your next signal is already there.

Secondary:

> Keep your ritual. Keep your reading. Keep building your Field.

CTA:

> Continue in ATUNED

---

## Beat 17 — FIELD

The user's existing work is present.

Do not send them into an empty dashboard.

The system should communicate:

> This is yours.

---

## Beat 18 — RETURN

The next life event becomes the next Discover input.

Final loop:

```text
DISCOVER
↓
SIGNAL
↓
BASELINE
↓
READ
↓
STORY
↓
MIRROR
↓
RELEASE
↓
VERIFY
↓
RITUAL
↓
PRACTICE
↓
EMBODY
↓
DISCOVER AGAIN
```

---

# 10. RITUAL OBJECT CONTRACT

The ritual must be a real domain object.

Conceptual schema:

```js
Ritual {
  id,
  source: "first_use_detection",
  userId: null | authenticatedUserId,
  sessionId,
  signalObservationId,
  patternId,
  addressIds[],
  releaseIds[],
  title,
  purpose,
  trigger,
  context,
  action,
  duration,
  expectedSignal,
  verificationMethod,
  status,
  createdAt,
  updatedAt,
  schemaVersion,
  algorithmVersion
}
```

Before account creation:

```text
userId = null
sessionId = temporary session identifier
```

After account creation:

```text
temporary object
↓
claim
↓
authenticated user
```

The claim must preserve provenance.

Do not recreate the ritual from memory.

---

# 11. PRE-ACCOUNT CLAIM CONTRACT

The anonymous experience needs a temporary claimable session.

Conceptual flow:

```text
anonymous session
↓
signal evidence
↓
baseline
↓
observation
↓
confirmation
↓
release
↓
verification
↓
ritual
↓
claim session
↓
authenticated account
↓
durable record
```

Conceptual API:

```text
POST /session/claim
```

Conceptual payload:

```json
{
  "temporarySessionId": "...",
  "claimToken": "...",
  "clientBuildId": "...",
  "schemaVersion": "...",
  "createdObjectIds": [
    "signal...",
    "observation...",
    "release...",
    "evidence...",
    "ritual..."
  ]
}
```

Exact API names are implementation decisions.

The requirement is atomic ownership transfer.

The user must not repeat the story.

---

# 12. FRONTEND → BACKEND CONTRACT

The frontend must not send only the final score when the backend needs to reconstruct why the score exists.

Preserve:

```text
session
identity
interaction
raw user input
structured evidence
signal observation
candidate interpretation
user confirmation/correction
pattern
baseline
release plan
release execution
verification
outcome
ritual
provenance
schema version
algorithm version
build ID
timestamps
```

The backend must be able to answer:

```text
What did the user say?
What did the system infer?
What did the user confirm?
What was released?
What did the user report afterward?
What ritual was created?
```

---

# 13. BACKEND → FRONTEND CONTRACT

Conceptual result:

```js
FirstUseResult {
  baseline: {
    cq,
    state,
    gap
  },

  signal: {
    id,
    qualities[],
    bodyLocation,
    userReportedIntensity
  },

  reading: {
    laws[],
    addresses[],
    seats[],
    patterns[],
    saboteurs[],
    releaseOrder[]
  },

  observation: {
    id,
    evidenceIds[],
    candidateInterpretation,
    status
  },

  release: {
    id,
    addressId,
    operation,
    previousState,
    resultingState
  },

  verification: {
    id,
    response,
    note
  },

  change: {
    signalBefore,
    signalAfter,
    cqBefore,
    cqAfter,
    gapBefore,
    gapAfter
  },

  ritual: {
    id,
    status,
    claimable
  },

  provenance: {
    schemaVersion,
    algorithmVersion,
    buildId
  }
}
```

The frontend renders this.

It does not independently reinterpret it.

---

# 14. REQUIRED ALGORITHM VERSIONING

Audit and version:

```text
SNIFFER_ALGORITHM_VERSION
SIGNAL_INTERPRETATION_VERSION
PATTERN_ALGORITHM_VERSION
COHERENCE_ALGORITHM_VERSION
GAP_ALGORITHM_VERSION
RELEASE_ALGORITHM_VERSION
RITUAL_DETECTION_VERSION
MEMORY_ALGORITHM_VERSION
DECISION_ALGORITHM_VERSION
TRACE_ALGORITHM_VERSION
```

If missing:

```text
MISSING
```

Do not claim an algorithm exists because a document describes it.

---

# 15. CANONICAL CALCULATION RULE

CQ must have one authoritative calculation.

Conceptually:

```text
canonical record
↓
coherence engine
↓
CQ
↓
state classification
↓
gap
```

Frontend receives:

```text
cq
state
gap
```

Frontend animates these values.

Frontend does not become a second calculation engine.

---

# 16. SIGNAL CHANGE RULE

A signal can appear to change because:

1. The user reports a different experience.
2. The system's interpretation changes.
3. The underlying state changes.
4. The user reports no change.

These must remain distinct.

Persist:

```text
signalBefore
signalAfter
reasonForChange
```

when applicable.

---

# 17. ABOUT PAGE

The About page should explain the system in this order:

```text
SOMETHING HAPPENS
↓
YOU FEEL A SIGNAL
↓
THE SYSTEM RESPONDS
↓
REPETITION CONDITIONS THE RESPONSE
↓
THE RESPONSE BECOMES A PATTERN
↓
PATTERNS CREATE DRAG / GAPS
↓
ATUNED FINDS WHERE THE LOAD IS SEATED
↓
YOU WORK ONE ADDRESS
↓
YOU CHECK AGAIN
↓
THE FIELD REMEMBERS
```

Then:

> Coherence is measured from 0 to 100.

Then:

> The gap is the distance between your current coherence and the 100-point ceiling.

Then:

> Direction tells you whether you're contracting, oscillating, or expanding.

Then the three states.

---

# 18. ABOUT PAGE ANIMATION

Canonical sequence:

```text
LIVING SYSTEM
↓
EVENT
↓
NERVE
↓
CASCADE
↓
CONDITIONING
↓
KINK
↓
CLUSTER
↓
NETWORK
↓
FIELD DISTORTION
↓
RELEASE
↓
FIELD REORGANIZATION
```

The visual language must remain consistent with the product.

Use:

```text
black background
quiet field
precise geometry
nodes
thin lines
controlled pulses
slow state transitions
```

Avoid:

```text
medical scan clichés
fantasy magic
decorative particles
literal DNA damage
claims of measured aura
```

The torus / biofield visualization is a conceptual ATUNED model, not a claim of direct biomedical measurement.

---

# 19. CASCADE ANIMATION CONTRACT

Show the conceptual progression:

```text
EVENT
↓
NERVE
↓
NERVOUS SYSTEM
↓
TISSUE
↓
ORGAN
↓
CELLULAR SIGNALING
↓
REGULATION / EXPRESSION
↓
IDENTIFICATION
↓
CONDITIONING
↓
RESISTANCE
```

Do not depict:

```text
stress = literal DNA damage
```

Instead:

```text
stress signaling
↓
cellular signaling
↓
regulation / expression
```

The visual is an explanatory model, not a medical claim.

---

# 20. KINK / CLUSTER / NETWORK

Show:

```text
ONE ADDRESS
↓
KINK

MULTIPLE RELATED ADDRESSES
↓
CLUSTER

CONNECTED CLUSTERS
↓
NETWORK
```

The release animation reverses the geometry.

The user should see that the network is built from smaller structures and that the system works back toward the point of origin.

---

# 21. NERVOUS SYSTEM / FIELD / ECOSYSTEM

The outer visual model is:

```text
ECOSYSTEM
↕
BIOFIELD / TORUS
↕
BODY
↕
NERVOUS SYSTEM
↕
NERVE
↕
ADDRESS
↕
MENTAL / BEHAVIORAL PATTERN
```

Healthy state:

```text
open
connected
rhythmic
circulating
```

Stress state:

```text
contracted
less coherent
locally distorted
```

Conditioned state:

```text
persistent deformation
repeated response
greater resistance
```

Restoration:

```text
release
↓
local opening
↓
network reorganization
↓
field reorganization
```

Keep the visual language explicitly conceptual.

---

# 22. PACING CONTRACT

The product should feel:

```text
SLOW ENOUGH TO FEEL
FAST ENOUGH TO UNDERSTAND
QUIET ENOUGH TO THINK
RESPONSIVE ENOUGH TO TRUST
```

Do not optimize for time-to-completion.

Optimize for:

```text
recognition
comprehension
felt relevance
agency
observable change
return intent
```

The user must be allowed to pause.

After release:

> Stay here for a moment.

Then:

> When you're ready, continue.

---

# 23. FAQ UPDATE

## What is ATUNED doing?

ATUNED listens to the way you describe what is happening in your life, looks for patterns in the evidence, shows you what it notices, and lets you confirm or correct it before you work with it.

## How do I know it is working?

ATUNED establishes a baseline, gives you something to work with, and lets you check again afterward. You can compare what you noticed before and after.

## What is the coherence number?

Coherence is represented on a 0–100 scale in the current model.

## What is the gap?

The gap is the difference between current coherence and the 100-point ceiling.

## What does oscillating mean?

You're moving between being affected and returning to yourself.

## What does ascending mean?

You're expanding and becoming less affected by what is happening around you.

## What does descending mean?

You're contracting and becoming more affected by what is happening around you.

## What if nothing changes?

That is a valid result. ATUNED records the observation rather than forcing a positive outcome.

## What is a ritual?

A ritual is a repeatable practice ATUNED detects or builds from the work you have done.

## Why create an account?

An account lets you keep the reading, ritual, history, and future work so the system can continue from where you left off.

---

# 24. NEXT AI AUDIT

Before implementation, inspect the actual production software.

Audit:

```text
onboarding
story
sniffer
observation
mirror
release
meter
trace
practice
coherence
gap
signal test
verification
ritual
account claim
memory
schema
versions
build
```

For each:

```text
Requirement
Current implementation
Existing module
Writer
Reader
Schema
Algorithm
Version
Persistence
Tests
Status
```

Status must be one of:

```text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

---

# 25. NEXT AI REPORT

Return:

```text
IMPLEMENTED
TESTED
UNVERIFIED
BLOCKED
CONFLICTS
REMAINING GAPS
NEXT PRIORITY
```

Then trace:

```text
USER SIGNAL
↓
EVIDENCE
↓
BASELINE
↓
OBSERVATION
↓
HYPOTHESIS
↓
USER CONFIRMATION
↓
PATTERN
↓
RELEASE
↓
VERIFICATION
↓
CHANGE
↓
RITUAL
↓
ACCOUNT CLAIM
↓
MEMORY
↓
NEXT DECISION
```

For every arrow, identify:

```text
source module
data object
writer
reader
schema
algorithm
version
persistence
test
```

If an arrow cannot be traced, report it as a gap.

---

# 26. NON-NEGOTIABLE RULES

1. Do not create a second intelligence path.
2. Do not create a second release engine.
3. Do not calculate CQ independently in the frontend.
4. Do not calculate gap independently in the frontend.
5. Do not overwrite baselines.
6. Do not treat subjective signal reports as objective measurements.
7. Do not create a second numeric coherence scale.
8. Do not allow rejected hypotheses into release.
9. Do not force a positive verification result.
10. Do not require an account before initial value is delivered.
11. Do not discard anonymous first-use work during account creation.
12. Do not make the user repeat the story.
13. Ritual must be a real persisted domain object.
14. Do not claim medical diagnosis from body addresses.
15. Do not claim field animation is biomedical measurement.
16. Do not show stress as literal DNA damage.
17. Do not overwrite historical readings after algorithm changes.
18. Do not let UI state become domain truth.
19. Do not optimize the journey for speed at the expense of recognition.
20. Do not automatically advance after release.
21. Do not hide the baseline.
22. Do not hide what changed.
23. Do not use CQ to shame or rank the person.
24. Preserve canonical terminology unless the domain model changes.
25. Audit actual software before claiming implementation.

---

# 27. FINAL PRODUCT SPINE

```text
I ARRIVE
↓
I NOTICE SOMETHING
↓
I FEEL IT
↓
I FIND THE SIGNAL
↓
I SEE MY BASELINE
↓
I SEE THE GAP
↓
I SEE WHAT IS CREATING THE GAP
↓
I TELL ATUNED WHAT HAPPENED
↓
ATUNED SHOWS ME WHAT IT HEARD
↓
I CONFIRM OR CORRECT IT
↓
ATUNED SHOWS ME THE ADDRESS
↓
I RELEASE ONE THING
↓
I PAUSE
↓
I CHECK AGAIN
↓
I SEE WHAT CHANGED
↓
ATUNED DETECTS A RITUAL
↓
I ADD IT TO MY COLLECTION
↓
I CLAIM MY WORK
↓
THE FIELD REMEMBERS
↓
I KNOW WHAT TO WORK WITH NEXT
↓
I RETURN TO LIFE
↓
DISCOVER AGAIN
```

The intended feeling is:

> I found something in myself.
>
> I could feel it.
>
> I could see it.
>
> I could work with it.
>
> I could tell whether anything changed.
>
> And now I have something I can keep working with.
