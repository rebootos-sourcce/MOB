# ATUNED — CQ / DQ / SQ and Release Hit Feedback Addendum
Date: 2026-10-21
Status: Owner clarification; implementation contract, not proof of runtime completion.

## 1. Owner's canonical vocabulary
- **CQ = Coherence.** These are two names for the same measure, not separate outputs.
- **DQ = Resistance.** DQ represents the total sum of the shadow. Do not model DQ as `100 - CQ`.
- **SQ = total shadow weight.** SQ is the sum of the individual weights of nodes.
- **Fetter = the name/type of a node.** The fetter's individual weight is that node's contribution to SQ.
- Keep the entity name (fetter), individual node weight, SQ aggregate, and DQ/Resistance aggregate distinct in storage and display.

## 2. Vritti: nerve-level sensory-emotional waveform
**Vritti** (spelled V-R-I-T-T-I) is the waveform of sensory input combined with emotional input, recorded at the nerve level. It is a signal/observation record, not itself a fetter and not automatically a confirmed pattern.

When a Vritti is identified and associated with a fetter, the record must preserve both entities and the association between them. The fetter remains the node identity; Vritti describes the nerve-level sensory-emotional waveform that has been identified as associated with that node.

### Vritti record contract
- `vritti_id`: stable unique record identifier.
- `nerve_address`: canonical nerve-level address, with source/provenance.
- `sensory_input`: structured or raw sensory report, preserving the user's words and source.
- `emotional_input`: structured or raw emotional report, preserving the user's words and source.
- `waveform`: representation of the combined sensory-emotional signal; the exact encoding remains an implementation decision and must not be fabricated as a numeric physiological measurement.
- `context`, `observed_at`, `source`, `confidence`, and `provenance`.
- `associated_fetter_id`: nullable link, populated only when a fetter association is identified; include association status (candidate / confirmed / rejected) and evidence.
- `marker`: derived UI marker/icon state indicating that the fetter has an associated Vritti record. The marker is a pointer/status affordance, not a new score or evidence of causality.

### Association and marker rules
1. A nerve-level Vritti record may exist before any fetter is identified.
2. A fetter may have zero, one, or multiple associated Vritti records; do not assume one-to-one cardinality.
3. An inferred association must remain visibly distinct from a user-confirmed association.
4. The marker appears on fetter/node records when an association exists, with separate visual states for candidate and confirmed links if the UI supports them.
5. Clicking/activating the marker opens the associated Vritti record(s), including sensory input, emotional input, nerve address, context, and provenance.
6. Removing an association must not erase the underlying Vritti record or the history of the association decision.
7. Vritti marker presence does not itself alter node weight, SQ, DQ, CQ, or release-hit counts.
8. Test persistence, reload, export/import, duplicate prevention, and broken-link handling for the association.

## 3. Canonical coherence formula and engine integration
Owner formula: `CQ = (Integrity × Intention) / Resistance`. CQ and Coherence are the same metric; there must be one operational output, not a parallel calculator.

The working branch implements this as **CQ model 3** in `atuned_src/engine/compute.js`:
- **Integrity** = the existing 21-law score on the 0–10 scale (`cqSum()/10)); unanswered laws contribute zero. The existing release lift is already included through `lawNow()` and must not be applied a second time.
- **Intention** = the existing band-derived `It` value on the 0–10 scale.
- **Resistance** = the existing `Rz` factor, derived from total shadow `DQ` and the six-axis gate factor, with the established denominator floor of 1.
- **CQ** = `clamp(Integrity * Intention / Resistance, 0, 100)`, with CQ set to zero when no laws have been answered. Tier words remain gated on all 21 laws being answered.
- History rows are stamped with `CQ_MODEL=3` so records from the former law-only calculation are not compared as if they used the same arithmetic.

This is an explicit model change from the prior 21-law-only CQ output. DQ remains Resistance/total shadow; SQ remains total node shadow weight. Do not substitute SQ for DQ or use `100-CQ` for Resistance. The formula wiring and regression assertions are present on the working branch, but runtime acceptance is **not complete until the engine build, tests, downstream consumer audit, and history/persistence checks execute successfully**. Any mismatch between the owner's intended meanings of Integrity/Intention/Resistance and the existing engine owners must be raised as a specific domain decision rather than hidden in another formula.

## 4. Release pile: optional voice-activated hit feedback
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

## 5. Acceptance tests
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
11. A Vritti record can exist without a fetter association; an identified association links it to the correct fetter.
12. Fetter marker state reflects the association and opens the correct Vritti record(s); marker presence does not change CQ/DQ/SQ or node weight.
13. Candidate, confirmed, and rejected Vritti–fetter associations survive persistence and remain distinguishable.

## 6. Build sequence
1. Locate the existing release pile/queue owner and event persistence owner; extend them instead of creating parallel stores.
2. Add the optional voice-feedback configuration to the existing release session configuration.
3. Add decision events and idempotent state transitions to the existing release queue/state machine.
4. Wire voice and interactive controls to the same command/decision handler.
5. Add unit and release-chain tests for all acceptance cases above.
6. Verify current CQ, DQ, and SQ read/write paths and update existing TDDs to match these semantics.
7. Run the documented engine build, engine tests, and release-chain tests in a real runner; report results, not assumptions.

## 7. Verification boundary
This addendum records the owner's definitions and implementation requirements. It does not claim that voice commands, hit accumulation, DQ/SQ wiring, or acceptance tests are already implemented.