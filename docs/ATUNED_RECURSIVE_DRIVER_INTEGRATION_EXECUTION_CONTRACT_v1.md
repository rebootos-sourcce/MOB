# ATÜNED — Recursive Driver Integration Execution Contract
Version: 1.0
Date: 2026-10-21
Status: Architecture/TDD contract; not a claim that every runtime edge has been implemented.
Purpose: Complete the six integration workstreams using two independent missed-connection reviews per pass, then execute the revised plan.

## Operating instruction
Read this document together with the current Mechanics of Being source, the current ATÜNED MVP execution brief, and the existing Journal/Imprint/Pattern/Release/Ritual/Evidence/Trace Graph TDD. Existing system owners remain authoritative. Extend existing contracts; do not create parallel truth systems. Mark unsupported claims as hypotheses. Do not report a code edge as implemented without a repository path and verification evidence.

## Canonical design truths and version reconciliation
1. User's current Coherence relationship: CQ = (Integrity × Intention) / Resistance. Preserve multiplication, order-independent for the numerator, and division by resistance. Do not silently revert to older additive wording.
2. Existing implementation distinguishes **Coherence** from **CQ**. CQ is the canonical 21-law read: average of 21 law scores on 0–10, multiplied by 10, only when all 21 are measured. Missing/unknown law values are not zero.
3. Existing runtime snippet uses Coherence = Intention × Integrity ÷ Resistance, with I and G clamped to 0–10, R clamped to 1–10, and a clamped output. The source calls this Coherence, not CQ. Its denominator floor and normalization are implementation choices requiring explicit acceptance, not silently assumed universal truths.
4. Integrity source granularity: 21 universal laws, each assessed 0–10. If the Integrity input to the Coherence formula is a single aggregate, its aggregation method must be explicit. Do not multiply by a 0–210 sum and assume the result remains a 0–100 score.
5. Coherence means signal flow from universal laws of nature, through universal laws of human nature, through the person/system, out to action without distortion. Resistance may occur at any mapped layer (including kosha, belief, soma, emotional pattern, or action context). The locations are candidate mechanisms/diagnostic addresses, not automatically equivalent variables.
6. As CQ/coherence decreases, user expects will, vitality, awareness, flow, and radiance to decrease. Treat these as modeled downstream outcomes until their scales, formulas, and evidence rules are specified. Do not fabricate coefficients.
7. User-defined relationship: DQ rises as willpower lowers, and vice versa. Preserve as a directional relationship; do not assume DQ = 100 − CQ unless explicitly approved and DQ's scale/meaning is established.
8. Tula is the diagnostic map for somatic/nerve address, emotional charge, limiting-belief patterns, and behavioral outputs. SoulCraft/Release is the intervention system that releases charge and installs the coherent opposite. They are linked but not interchangeable.
9. The nine emotional architectures/pairs and somatic locations are diagnostic mappings in the source. Language is evidence for inquiry, not a direct sensor of stored charge.
10. During release, experienced intensity may temporarily rise. This must not automatically be interpreted as more stored charge, higher resistance, or failed release. Track observed activation, estimated underlying charge, and durable baseline separately.
11. The energy/field layer may provide an interpretive frame; somatic-mechanical observations remain the operational layer. One does not supersede the other.
12. Action outcomes and subsequent evidence must return to the law assessments, pattern state, CQ/coherence readings, and next discovery. Avoid double-counting the same release evidence.

## Typed variable contract
Use distinct fields and provenance for:
- law_scores: map of 21 law IDs to score 0–10 or null, plus evidence, timestamp, assessor, and confidence.
- integrity_aggregate: derived from law_scores; aggregation method and completeness flag are mandatory.
- intention: 0–10 only if that is the accepted current input scale; preserve raw user statement/evidence separately.
- resistance: positive resistance factor with an explicit measurement rule, scale, source, and floor policy.
- coherence_raw: intention × integrity_aggregate / resistance, only when required inputs are valid.
- coherence_display: normalized score only after an approved normalization contract; never disguise raw as normalized.
- cq: mean(law_scores) × 10, valid only when all 21 scores are measured.
- dq: separately specified variable; direction relative to willpower is known, formula/scale remains TBD unless found in authoritative implementation.
- willpower, vitality, awareness, flow, radiance: separate outcomes, each with definition, scale, and provenance; no inferred numeric coefficients.
- context: trigger, domain, time, people/environment, and relevant history.
- emotional_architecture: canonical pattern/polarity and supporting/contradicting evidence.
- stored_charge_estimate: distinct from observed emotion intensity and baseline.
- observed_activation: current felt/observed intensity with time and context.
- baseline_state: longer-timescale reference measured before/after a release or over a defined window.
- somatic_address: user-confirmed or evidence-supported location/node/channel; do not infer certainty from generic language alone.
- limiting_belief: candidate/confirmed/rejected state, exact user wording, provenance, and confidence.
- action_candidate, chosen_action, action_outcome: separate objects; preserve aligned and misaligned alternatives.
- release_session, release_events, reframe, practice_event, evidence_event, trace_edge: use existing system-owned records; no parallel records.

## Integration spine / typed graph
EXPERIENCE
→ EXPRESSION / JOURNAL
→ OBSERVATION + CONTEXT + EVIDENCE
→ LAW SIGNALS + 21 LAW ASSESSMENTS
→ INTEGRITY AGGREGATE + CQ (with completeness/provenance)
→ INTENTION + RESISTANCE + COHERENCE (separate from CQ)
→ PERCEPTION / AWARENESS / WILL / ACTION CANDIDATES
→ CHOICE (aligned / misaligned / avoidant / blocked / not enough evidence)
→ ACTION + OBSERVED OUTCOME
→ EMOTIONAL RESPONSE + CONTEXTUAL INTERPRETATION
→ TULA PATTERN CANDIDATES (emotional architecture, belief, somatic address, behavior)
→ USER CONFIRM / CORRECT / REJECT
→ RELEASE CONTRACT
→ SOULCRAFT RELEASE (all applicable channels; do not assume one address equals one pattern)
→ COHERENT-OPPOSITE REFRAME
→ IMMEDIATE VERIFICATION (felt residual, readiness, user report; no fixed-time assumption)
→ PRACTICE / RITUAL
→ NEW EVIDENCE + NEGATIVE EVIDENCE
→ LAW REASSESSMENT + CQ + COHERENCE
→ LONGITUDINAL TRACE / NEXT DISCOVERY

Every arrow needs: source owner, target owner, input schema, output schema, validation rule, provenance, failure/unknown behavior, idempotency rule where relevant, and acceptance test.

## Workstream 1 — Architecture contract
### Execute
- Preserve CQ and Coherence as distinct named outputs.
- Record formula lineage and deprecation note for old additive expression; never erase historical source language without versioning.
- Specify validation: all 21 laws required for definitive CQ; unknown is null, not zero.
- Specify the Coherence numerator input and resistance denominator contract before claiming normalized 0–100.
- Ensure every derived reading carries algorithm version, inputs, timestamp, completeness, and provenance.
### Review pass A — missed connections
- Is the 21-law aggregate being used as Integrity, CQ, or both? These are related but not automatically identical.
- Does the current clamp/floor make a zero resistance reading equal one? Is this approved semantics or merely defensive coding?
- Can raw formula exceed display range? Is clipping hiding information?
- Can CQ be displayed while laws are missing? If so, label provisional and show measured/total.
### Review pass B — missed connections
- Are stale assessments or release-written lifts being double-counted?
- Is the baseline immutable and distinguished from current reading?
- Do UI, engine, persistence, and export use the same names/scales?
### Acceptance
- CQ known/unknown behavior tested for 0, 1, 20, and 21 law readings.
- Coherence calculation tests cover zero, minimum, maximum, invalid, and missing inputs.
- A formula/version migration test proves older additive formula is not silently used.
### Open decisions
- Approved Integrity aggregation method if not already canonical.
- Resistance measurement and denominator floor policy.
- Raw-to-display normalization and whether displayed Coherence is bounded.
- DQ scale/formula.

## Workstream 2 — Integrity-to-action wiring
### Execute
- Connect each of the 21 law IDs to evidence and an explicit assessment rule.
- Connect assessments to Integrity aggregate and CQ without conflating outputs.
- Connect intention and resistance to Coherence.
- Connect Coherence to perception/awareness, will, and action readiness as directional dependencies only until calibrated.
- Represent each candidate action with intended value/law alignment, expected cost, known constraints, and uncertainty.
### Review pass A — missed connections
- Is every law actually linked to evidence and action, or merely shown in a list?
- Is an action mismatch caused by low integrity, low intention, high resistance, lack of capability, or external constraint? Do not collapse them.
- Is intention measured as stated direction, committed intention, or enacted behavior?
- Can contradictory evidence reduce confidence instead of being discarded?
### Review pass B — missed connections
- Does a law score have an explanation and provenance the user can correct?
- Does the system distinguish inability, unwillingness, competing values, and protective avoidance?
- Does outcome evidence update only relevant laws and avoid writing the same evidence twice?
### Acceptance
- One end-to-end fixture maps a user-reported event to evidence, law assessment, CQ state, intention/resistance, candidate actions, and chosen action.
- A missing law does not become zero.
- External constraint can block action without automatically diagnosing an emotional pattern.

## Workstream 3 — Emotion and amplitude
### Execute
- Link context, user language, observed affect, emotional architecture, somatic address, belief candidates, and behavioral output.
- Maintain separate values for estimated stored charge, current observed activation/amplitude, and baseline.
- Treat emotional wording/intensity curves as semantic evidence to support inquiry, not as a direct charge meter.
- Record time course: trigger, onset, peak, release-period changes, post-release state, and later baseline.
- During release, preserve stage-specific felt reports and readiness; do not require fixed timing.
### Review pass A — missed connections
- Could the same phrase express different patterns under different contexts?
- Could the same pattern present through different words or somatic addresses?
- Does a transient spike during awareness/release get misread as deterioration?
- Is baseline updated only after a defined reassessment rather than at peak activation?
### Review pass B — missed connections
- Is polarity/architecture distinct from intensity?
- Is user confirmation needed before a candidate becomes a confirmed pattern?
- Are sensory observations, interpretation, and theory stored separately?
- Can the system record “uncertain / not enough evidence” without forcing a label?
### Acceptance
- Same words in two contexts do not force identical pattern classification.
- A release-related intensity spike does not automatically raise stored-charge estimate.
- Before/after comparisons specify measure, time, context, and confidence.
### Open decisions
- Operational definition and units for amplitude/activation.
- Method for estimating stored charge, if any; do not fabricate a formula.
- Baseline window and reassessment cadence.

## Workstream 4 — Action branches
### Execute
- Model aligned, misaligned, avoidant, blocked-by-constraint, mixed, and undetermined action branches.
- Keep action candidate, chosen action, behavior observed, and outcome separate.
- Connect branch evidence to relevant law(s), intention, resistance, emotional response, and context.
- Allow one emotion to precede different actions; never hard-code emotion → one behavior.
### Review pass A — missed connections
- Does “wrong action” mean violation of a selected universal law, mismatch with stated intention, avoidant protection, or poor outcome? These require distinct labels.
- Could a seemingly aligned action produce a poor result due to external conditions?
- Could a misaligned action yield a short-term reward that reinforces the pattern?
### Review pass B — missed connections
- Is the expected action compared with actual behavior?
- Are unintended consequences and repair actions captured?
- Is the user allowed to contest the system's interpretation?
### Acceptance
- At least one fixture for each branch.
- Emotion alone never determines branch.
- Outcomes update evidence and pattern confidence rather than retroactively rewriting intention.

## Workstream 5 — Release and feedback
### Execute
- Tula owns diagnosis/mapping; SoulCraft/Release owns intervention execution.
- Require user confirmation/correction/rejection before high-impact pattern promotion where the existing product contract requires it.
- Release Contract names pattern(s), address(es), selected protocol, intended coherent opposite, channels, readiness, and verification criteria.
- Track immediate felt result separately from durable baseline and later behavioral evidence.
- Practice/Ritual is execution; Evidence owns observations and outcomes; Trace Graph owns typed relationships/provenance.
- After release and practice, reassess only relevant law(s) with explicit evidence; CQ is recalculated from current measured law values under its existing contract.
### Review pass A — missed connections
- Is the release idempotent? Can a retry apply the same law lift or charge reduction twice?
- Is release linked to the pattern and profile it was charged to?
- Are unmeasured laws left untouched?
- Does reframe target the same address/pattern as release?
- Are negative outcomes and non-response recorded?
### Review pass B — missed connections
- Is immediate relief confused with durable change?
- Can charge appear to rise during processing while the protocol remains valid?
- Is practice evidence connected to the original release and baseline?
- Does a second release on the same pattern preserve event history rather than overwrite it?
### Acceptance
- Replay of a completed release does not double-count.
- Release to an unanswered law does not invent a score.
- Immediate and longitudinal evidence are separate and traceable.
- Coherent opposite is installed as a user-confirmable felt/somatic reframe, not merely a text assertion.

## Workstream 6 — Cross-driver validation
### Execute
- Build a typed dependency graph and an edge inventory with owner, schema, provenance, and test.
- Run fixtures across the complete loop: aligned action; misaligned action; high resistance; unknown law; conflicting evidence; emotional spike during release; successful release with later relapse; no change after practice; external constraint.
- Validate that will, vitality, awareness, flow, radiance, DQ, and willpower are connected as distinct variables, with unspecified formulas explicitly marked TBD.
- Generate an implementation ledger with status: verified in code, present in docs only, partially wired, absent, or blocked by decision.
### Review pass A — missed connections
- Are there orphan nodes with no incoming/outgoing edges?
- Are there duplicate owners or parallel sources of truth?
- Are derived scores missing lineage?
- Are there circular dependencies (e.g., action defines law score and law score alone is used to justify action)?
### Review pass B
- Does every edge have a test?
- Are error/unknown paths tested, not only success paths?
- Does the UI expose provisional status and uncertainty?
- Can the full trace be reconstructed from a user event to later outcome?
### Acceptance
- Every critical edge has one owner, schema, provenance, failure behavior, and test.
- No unknown value is silently zeroed.
- No provisional hypothesis is presented as established fact.
- All unresolved decisions are in the TBD register with owner and next action.

## Recursive review protocol (mandatory twice per pass)
For each workstream:
1. Execute the stated work.
2. Review A: inspect missing upstream inputs, downstream consumers, ownership, and hidden assumptions.
3. Review B: inspect edge cases, duplicate writes, stale state, provenance, negative evidence, user correction, and test coverage.
4. Consolidate the two review lists; remove duplicates but do not discard distinct failure modes.
5. Revise the plan and execute the highest-priority correction.
6. Re-run relevant acceptance tests and record status/evidence.
7. Move to the next workstream only after recording remaining blockers; do not falsely mark blocked work complete.
8. At the end, run a whole-graph review and one adversarial pass looking for contradictions between source documents, implementation, UI, and tests.

## Cross-driver acceptance test matrix
| ID | Scenario | Required invariant |
|---|---|---|
| CQ-01 | 0/21 laws measured | CQ is unknown, not 0 |
| CQ-02 | 20/21 laws measured | CQ remains incomplete/provisional |
| CQ-03 | 21/21 laws measured | CQ equals mean(scores) × 10 |
| COH-01 | Missing intention/integrity/resistance | Coherence is invalid/unknown with reason |
| COH-02 | Resistance at floor | Denominator policy is explicit and tested |
| INT-01 | Same words, different contexts | Pattern remains evidence-led, not forced identical |
| AMP-01 | Activation rises during release | Does not automatically imply stored charge rose |
| ACT-01 | Strong emotion, different action | Emotion does not uniquely select action branch |
| ACT-02 | External constraint prevents action | Not automatically labeled low integrity |
| REL-01 | Release retried | No duplicate write or double-counting |
| REL-02 | Law not assessed | Release cannot fabricate law score |
| REL-03 | Immediate relief, later recurrence | Immediate and longitudinal outcomes remain distinct |
| EVD-01 | Contradictory evidence | Confidence can decrease; contradiction is retained |
| TRACE-01 | Full lifecycle trace | Event → pattern → release → practice → evidence is reconstructable |
| DQ-01 | DQ/willpower relation | Directional relationship retained; no invented equation |

## TBD register
1. Confirm the canonical Integrity aggregate input used in the Coherence numerator.
2. Confirm resistance scale, measurement method, and minimum denominator semantics.
3. Confirm raw versus normalized Coherence display contract.
4. Define DQ scale and formula, if any; keep inverse relationship to willpower as directional until confirmed.
5. Define measurable contracts for will, vitality, awareness, flow, radiance.
6. Define observed activation/amplitude operationally; do not infer a charge formula.
7. Define baseline measurement window and durability criteria.
8. Confirm exact mapping between all 21 laws, action branches, and any 10-pillar UI summary; do not assume counts are interchangeable.
9. Verify the implementation path for all Release → law-lift/CQ effects and guard against duplicate evidence.
10. Build and run the cross-driver test suite; documentation alone does not prove implementation.

## Implementation status at creation
- Existing source and library docs reviewed: yes.
- Distinct CQ and Coherence concepts found in existing source: yes.
- Existing product loop found in handoff TDD: yes.
- New code changes executed by this document alone: no.
- All runtime edges verified: no.
- Six workstreams fully implemented: no; this document defines execution and acceptance contracts.
