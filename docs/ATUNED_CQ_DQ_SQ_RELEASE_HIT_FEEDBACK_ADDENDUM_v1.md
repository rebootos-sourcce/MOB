# ATUNED — CQ / DQ / SQ and Release Hit Feedback Addendum
Date: 2026-10-21
Status: Owner clarification; implementation contract, not proof of runtime completion.

## 1. Owner's canonical vocabulary
- **CQ = Coherence.** These are two names for the same measure, not separate outputs.
- **DQ = Resistance.** DQ represents the total sum of the shadow. Do not model DQ as `100 - CQ`.
- **SQ = total shadow weight.** SQ is the sum of the individual weights of nodes.
- **Fetter = the name/type of a node.** The fetter's individual weight is that node's contribution to SQ.
- Keep the entity name (fetter), individual node weight, SQ aggregate, and DQ/Resistance aggregate distinct in storage and display.

## 2. Preserve current engine behavior while reconciling the model
The current `atuned_src/engine/compute.js` comments define CQ from the 21 universal-law values over fixed denominator 210, with unanswered laws contributing zero. Partial CQ therefore builds from zero as answers are supplied; completeness gates definitive tier eligibility, not existence of a partial score. The release-lift mechanic is already defined in that file and must not be duplicated.

The conceptual relationship `CQ = (Integrity × Intention) / Resistance` must be reconciled with the canonical engine rather than implemented as a second calculator. Treat CQ as Coherence per owner instruction. DQ is the Resistance term. SQ is a different aggregate: total node shadow weight. Do not silently substitute SQ for DQ or change the existing CQ calculation without a versioned decision and tests.

## 3. Release pile: optional voice-activated hit feedback
Before a release run, offer a setting to enable or disable voice-activated decisions. Provide equivalent visible interactive controls for accessibility and noisy environments. When disabled, the existing release flow remains available without mandatory per-item decisions.

For each presented item, offer these conceptual actions (spoken aliases may be configurable):
- **HOLD / KEEP** — retain in the active release pile for later review or another pass. Not a confirmed hit.
- **RELEASE / HIT** — explicitly mark as a user-confirmed hit. Add it to the accumulated confirmed-hit set.
- **DELETE / NOT A HIT** — remove from the active pile and record a negative decision. Do not permanently erase historical evidence merely because the user removes an item from the current queue.

The exact command grammar must avoid ambiguity between “release this pattern” as a session action and “this was a hit” as feedback. Use contextual prompts or distinct aliases if needed. Low-confidence recognition must ask for clarification or leave state unchanged; never execute a destructive action from uncertain speech.

### Required distinct states
Presented; command recognized; held; user-confirmed hit; rejected/deleted from active pile; release executed. These are not synonyms. Executing a release does not prove that the candidate was a hit, and a recognized voice command does not by itself prove a hit.

### Required event and persistence behavior
Each decision records pattern ID, session ID, timestamp, input modality, raw and normalized command, recognition confidence where available, before/after state, and unique event ID. Retries and replay are idempotent. Accumulate only explicit user-confirmed hits into the hit-history/learning signal. Presentation, holding, deletion, and release execution alone must not increase hit counts or silently alter CQ, DQ, SQ, or stored-charge estimates.

Before each run, the user can choose voice feedback on/off. Clarify whether the decision affects this session's queue only or persists to the user's release pile; default to reversible removal from the active queue, preserving historical evidence.

## 4. Acceptance tests
1. CQ is shown as Coherence; no duplicate independent CQ/Coherence output is introduced.
2. DQ is Resistance/total shadow; SQ is total node shadow weight; each node's weight contributes to SQ.
3. Partial CQ builds from zero with unanswered laws at zero; completeness controls tier eligibility.
4. Voice mode off preserves the current release flow.
5. Voice mode on supports HOLD, HIT, and NOT-A-HIT via speech and visible controls.
6. Release execution without explicit hit confirmation does not count as a confirmed hit.
7. Low-confidence speech does not mutate state.
8. Replaying the same decision event does not double-count.
9. Removing an item from the active pile does not erase its historical event/evidence.
10. A hit is accumulated only after explicit user confirmation and remains distinguishable from inferred/presented/released states.

## 5. Build sequence
1. Locate the existing release pile/queue owner and event persistence owner; extend them instead of creating parallel stores.
2. Add the optional voice-feedback configuration to the existing release session configuration.
3. Add decision events and idempotent state transitions to the existing release queue/state machine.
4. Wire voice and interactive controls to the same command/decision handler.
5. Add unit and release-chain tests for all acceptance cases above.
6. Verify current CQ, DQ, and SQ read/write paths and update existing TDDs to match these semantics.
7. Run the documented engine build, engine tests, and release-chain tests in a real runner; report results, not assumptions.

## 6. Verification boundary
This addendum records the owner's definitions and implementation requirements. It does not claim that voice commands, hit accumulation, DQ/SQ wiring, or acceptance tests are already implemented.