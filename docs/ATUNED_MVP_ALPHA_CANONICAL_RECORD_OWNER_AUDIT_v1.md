# ATÜNED MVP Alpha — Canonical Record Owner Audit
Version: 1.1
Date: 2026-10-21
Status: **P0 contract complete.** Runtime integration is a downstream P1/P2 task and is not claimed complete.

## Scope
Establish the canonical semantic boundaries and ownership decisions for Vritti → fetter / qualium → nerve-address node / tone, using existing records and trace rather than introducing a parallel Vritti inventory.

## Canonical owner decisions (P0 exit contract)
| Concept | Canonical meaning | Current source/owner | Target representation and rule |
|---|---|---|---|
| Raw source | User's original account and context | `p.story.entries[].text` and `.ob` in `atuned_src/engine/schema.js` | Preserve original source and timestamp. Existing story/onboarding data is not a fully captured sensory-emotional waveform. |
| Vritti | Total sensory + emotional waveform identified/tagged as a limiting belief | No complete structured waveform owner established; story/imprint is the nearest source pipeline | Treat Vritti as a derived/linked signal concept across existing source/imprint owners, not a new top-level `p.vritti[]` collection. Preserve raw source separately from normalized interpretation. Add structured sensory/emotional capture only at the canonical source/imprint owner when its contract is implemented. |
| Fetter | Limiting-belief pattern; individual node/type whose weight contributes to SQ | `CHARGES`, `NODES[].cf`, and trace `pattern:fetter:<name>` | Keep canonical fetter identity; no duplicate fetter records. Current trace type `pattern` is overloaded for address and fetter IDs, so type-safe interpretation must use canonical IDs and validation. |
| Qualium | **Orientation of the distortion** | No existing field is proven equivalent | Treat as an orientation attribute of the Vritti→fetter interpretation/association, with provenance/status. It is not a separate waveform, fetter, node, tone, score, or top-level collection. Do not alias it to `NODES[].d` or `OUTWARD/INWARD` absent an approved domain mapping. If current edge schema cannot safely own attributes, extend the existing canonical association representation; do not invent parallel state. |
| Nerve-address node | Canonical address node where the model locates tone | `NODES` in `atuned_src/engine/data/nodes.js`; trace derives address `pattern` nodes | Address ID and nerve label come from `NODES`. Fetter↔address association is many-to-many unless a domain rule narrows it. |
| Tone/frequency | Tone is attached to the nerve-address node at that address | `FLOWSEAT`/`seatHz` in `atuned_src/engine/data/practice.js`; consumers in `ui/release.js` and `ui/map.js`; trace derives `toneHz` from address seat | `tracePatternAttrs` resolves the configured seat-tone reference onto the derived address view. It is a sound-healing reference, not a measured physiological frequency, and is not copied into a saved Vritti/fetter record. |
| Trace graph | Navigation and typed, provenance-bearing relationships among existing owners | `p.trace`, `traceNew`, strict node/edge allowlists and `TRACE_RULES` in `atuned_src/engine/trace.js` | Derive relationships that can be derived; store only relationships/decisions not derivable from source. Association is not causation. New rules/attrs require validation, import/export, UI, and tests together. |
| CQ / Coherence | CQ is Coherence, operationally `clamp(Integrity × Intention / Resistance, 0, 100)` in model 3 | `atuned_src/engine/compute.js`; history stores formula version | Model 3 maps Integrity to `cqSum()/10` (21 laws, fixed denominator, unanswered laws zero, release lift included once), Intention to existing `It`, and Resistance to existing `Rz = max(1, (1 + DQ × 0.05) × verpFactor())`. The public `compute().CQ` is the single formula output. Source wiring is present; runtime verification remains open. See `ATUNED_CQ_COHERENCE_FORMULA_INTEGRATION_TDD_v1.md`. |
| CQ model versioning | Model 3 is the canonical source-level formula; prior model 2 values are historical | `CQ_MODEL` in `compute.js` and snapshot/history stamping | Model 3 uses existing input scales and explicit Resistance floor 1. Existing records retain their model stamp; do not compare cross-model movement as if it were same-formula movement. Runtime behavior is not verified until CI/tests pass. |
| DQ / SQ / node weight | DQ is resistance/total shadow under the current contract; SQ is the sum of individual node/fetter weights | Existing compute engine | Preserve existing metric ownership. DQ is not `100-CQ`. Link/marker/qualium operations must not mutate CQ, DQ, SQ, node weight, stored charge, or hit count. |

## Explicit relationship model
```text
raw story + source context
        │ (preserved evidence; parsed separately)
        ▼
Vritti signal concept (sensory waveform + emotional waveform)
        │ interpretation / association carries qualium = orientation of distortion
        ▼
fetter (limiting-belief pattern)
        │ associated with / manifests at (not automatically causal)
        ▼
canonical nerve-address node ── owns/references tone/frequency
```

Rules:
- Relationships are not assumed one-to-one. One source/Vritti may be interpreted as more than one fetter; a fetter may be associated with more than one address.
- Keep provenance states distinct: known, inferred, proposed, user-confirmed, observed. Candidate interpretation is not user confirmation.
- Do not label association as causation. Causes are claims only and require permitted provenance.
- Marker is derived from valid associations; it is not persisted as duplicate truth and is not a score.
- Nerve oscillation/frequency language is a conceptual model. Do not claim experimentally validated physiology or invent units.
- No standalone `p.vritti[]` collection is authorized by this contract.

## Source findings and implementation boundary
- Story text/context: `p.story.entries[].text` and `.ob`; parsed imprints come from `parseStory(e.text).imprints` in trace derivation.
- Address/nerve labels: canonical `NODES` table; current graph derives address pattern attributes from it.
- Fetter identity: `CHARGES` and `NODES[].cf`; current trace graph has no dedicated `fetter` node type.
- `NODES[].d` is a node-table distortion descriptor, not qualium by default.
- `OUTWARD/INWARD` are calculation groupings, not qualium by default.
- `FLOWSEAT` is located in `engine/data/practice.js`, with `seatHz` mapping through `PMBANDS`; consumers include release audio and the flow map. The trace-derived address view carries this reference without persisted duplicate truth.
- Trace graph is strict; a new edge or attribute must be validated across graph functions, profile boundary, UI and tests.

## Three-pass review result
### Pass 1 — Ontology
Vritti is the total signal; fetter is the limiting-belief interpretation; qualium describes the orientation of that distortion; tone belongs to the nerve-address node. Connected, not interchangeable.

### Pass 2 — Runtime ownership and metric isolation
Use existing story/imprint, fetter/address, and trace owners. Qualium belongs to the interpretation/association unless implementation inspection proves the current edge contract cannot safely carry it; then extend that canonical contract, not a parallel collection. Tone is referenced from node/seat owner. CQ remains one operational calculator; conceptual formula is not a second executable calculator.

### Pass 3 — Failure and evidence
Preserve raw source, provenance, candidate/confirmed distinctions, old-profile compatibility, deterministic derivation, idempotency, and export/import. No relationship-only operation may alter metrics. No association implies causation. Do not overstate physiological validity.

## P0 exit checklist
- [x] Canonical definitions fixed.
- [x] Current source owners and missing runtime mappings documented.
- [x] Target ownership assigned for Vritti, fetter, qualium, node/tone, trace and metrics.
- [x] No standalone Vritti collection.
- [x] CQ operational-vs-conceptual equation policy fixed.
- [x] Relationship cardinality, provenance, causal restraint, and metric-isolation rules fixed.
- [x] Runtime implementation gaps transferred explicitly to P1/P2 rather than left as unresolved P0 semantics.

## Block status
- **P0 — COMPLETE as architecture/ownership contract.** This is design/contract completion, not runtime completion.
- **P1-C — IMPLEMENTATION CLOSED; EXECUTION DEFERRED:** regression coverage is authored for deterministic derivation, source/trace provenance, explicit address confirmation, metric isolation, profile round-trip, legacy-profile compatibility, and strict refusal of uncontracted qualium fields. No test pass is claimed.
- **P2 — IMPLEMENTATION CLOSED; EXECUTION DEFERRED:** `engine/loop.js` exposes source-backed signal evidence and `ui/loopread.js` renders a marker with source text, candidate provenance, nerve-address identity, configured tone reference, and an explicit not-yet-captured qualium dimension. No separate `p.vritti[]` collection and no metric side effects.
- **Follow-on (not part of P2 marker closure):** structured sensory/emotional waveform capture and a domain-approved qualium orientation vocabulary remain open.
- **Build/tests — not run in this pass; candidate CI deploy run is queued, not a test result.**

## Next recursive actions
1. **P1-A source/tone:** implemented by resolving `FLOWSEAT`/`seatHz` through the existing seat map and deriving the tone reference on address nodes; no persisted duplicate tone field.
2. **P1-B trace:** minimum graph path and UI marker are implemented: story→impression→fetter (`produces`/`supports`, inferred) and canonical address→fetter (`associated_with`, known), derived from existing owners. No new `p.vritti[]` collection.
3. **CQ priority 1:** model 3 formula is now wired at source level; complete CI/build/regression verification before resuming other integration work. Qualium runtime-field materialization remains separately blocked by the absence of an approved orientation vocabulary/value contract. Do not equate qualium with `NODES[].d` or OUTWARD/INWARD.
4. Add/execute tests for provenance, cardinality, idempotency, old-profile compatibility, export/import/reload, and metric isolation.
5. Run build, engine tests, release-chain tests and candidate-revision CI; update the development snapshot with evidence.
