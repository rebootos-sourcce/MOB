# ATUNED NEXT AI DOCUMENTATION INDEX

This package is the handoff for the next AI / engineering / product pass.

## Canonical source

`ATUNED_System_Congruency_TDD.md`

This remains the architectural source of truth for:

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

Do not replace this architecture with the new onboarding sequence.

## New required handoff

`ATUNED_Next_AI_Experience_Measurement_Handshake.md`

This document adds the next product layer:

```text
SIGNAL TEST
↓
AHA
↓
BASELINE
↓
CQ / STATE / GAP
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
ACCOUNT CLAIM
↓
FIELD
↓
DISCOVER AGAIN
```

It also defines the frontend/backend contracts needed to support this experience.

## Required audit before implementation

The next AI must inspect actual software and classify every requirement:

```text
EXISTS
PARTIAL
MISSING
CONFLICT
UNVERIFIED
```

Audit:

```text
onboarding
signal test
story
sniffer
observation
mirror
coherence
gap
baseline
release
verification
re-test
ritual detection
anonymous session
account claim
memory
trace
schema
algorithm versions
build compatibility
```

## Core measurement model

```text
CQ = 0–100
GAP = 100 - CQ
```

Current proposed directional states:

```text
0–39    DESCENDING
40–60   OSCILLATING
61–100  ASCENDING
```

Human-facing language:

```text
DESCENDING
You're contracting. You're becoming more affected by what's around you.

OSCILLATING
You're moving between being affected and returning to yourself.

ASCENDING
You're expanding. You're becoming less affected by what's around you.
```

These directional boundaries are a newly specified product rule and must be audited against implementation before being called implemented.

## Critical rule

The frontend must never independently calculate:

```text
CQ
GAP
PATTERN
RELEASE
OUTCOME
```

The domain engine is authoritative.

The frontend renders canonical results.

## Critical user-experience rule

Never make the user feel behind.

No countdown.

No forced pace.

No automatic advance after release.

The user should have time to:

```text
feel
notice
understand
pause
continue
```

## Critical proof-of-value rule

The user should not have to believe that ATUNED worked.

The system should establish:

```text
BASELINE
↓
INTERVENTION
↓
RE-TEST
↓
CHANGE
```

Valid results include:

```text
changed
different perspective
something moved
nothing changed
uncertain
```

## Critical account rule

The free experience creates real value before account creation.

If a ritual is detected, it becomes a real domain object.

The user can claim it during account creation.

Do not make the user repeat the story.

Do not recreate the ritual from memory.

Preserve provenance.

## Critical creative rule

The animations are explanatory system components.

They should use one visual grammar:

```text
black background
quiet Field
nodes
thin geometry
controlled pulses
slow state transitions
```

The master visual sequence is:

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

Do not represent the conceptual biofield / torus model as direct biomedical measurement.

Do not show psychological stress as literal DNA damage.

## Final AI report format

Every implementation pass must end with:

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

For every arrow identify:

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

If the chain cannot be traced, it is a gap.
