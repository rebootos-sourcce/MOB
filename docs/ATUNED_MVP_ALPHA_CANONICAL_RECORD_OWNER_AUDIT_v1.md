# ATÜNED MVP Alpha — Canonical Record Owner Audit
Version: 1.0
Date: 2026-10-21
Status: Source-inspected; owner gaps remain. This is an implementation audit, not a claim of runtime completion.

## Scope
Map the existing canonical owners for the unified signal → fetter → qualium → nerve-address node/tone model before changing persistence or trace rules.

## Findings grounded in source
| Concept/data | Current owner/evidence | What is actually available | Gap / implementation consequence |
|---|---|---|---|
| Raw source language | `p.story.entries[].text` in `atuned_src/engine/schema.js`; story entries are derived by `traceFromRecord` in `atuned_src/engine/trace.js` | User-authored text and timestamp; the sniffer derives imprints/addresses from text | This is a source record, not yet a structured sensory/emotional waveform record. Do not claim the full waveform is persisted. |
| Source context / onboarding self-report | `p.story.entries[].ob` validated by `vEntryOb` in `schema.js`; fields include `pick`, `feel`, `place`, `yes`, `no`, `fixes`; source lists live in `atuned_src/engine/data/onboarding.js` | Coarse onboarding selections and user confirmations/corrections | These fields may inform the signal but are not equivalent to separately captured raw sensory input and raw emotional input. |
| Imprint interpretation | `parseStory(e.text).imprints` read in `traceFromRecord` | Current lexical/model interpretation of story text into address/fetter imprints; trace provenance is inferred unless the user confirmed the address | Preserve the distinction between source text and interpretation; do not call the inference a confirmed belief. |
| Address / nerve label | Canonical `NODES` table in `atuned_src/engine/data/nodes.js`; each row includes address `i`, label `k`, band `b`, nerve label `n`, and other descriptors | Canonical address and nerve labels; trace pattern nodes derive `name`, `seat`, `nerve`, and `fetter` attributes from this table | This is the current node identity source. It does not by itself prove the model's nerve oscillation claim biologically. |
| Fetter identity | `CHARGES` plus node-table `cf`; trace accepts `pattern:fetter:<name>` only for canonical charge names | Fetter is the limiting-belief/pattern identity; address patterns may carry a `fetter` association | Existing trace model overloads `pattern` for address and fetter IDs. There is no dedicated first-class `fetter` node type today. |
| Node-table distortion descriptor | `NODES[].d` in `atuned_src/engine/data/nodes.js` | A per-address descriptor named `d` | Not established as the owner's qualium. Do not alias it to qualium without a domain mapping. |
| Inward/outward orientation in calculations | `OUTWARD` / `INWARD` in `atuned_src/engine/compute.js` | A charge-balance grouping used by calculation | Not established as the qualium taxonomy. Do not assume the orientation of distortion is identical to charge direction. |
| Tone/frequency | `schema.js` comments refer to `FLOWSEAT` as hertz per seat and to tone being used under release; exact canonical owner/source must be confirmed in the full source dependency chain | Evidence that a frequency-by-seat concept exists in the codebase | Exact declaration, unit semantics, and whether tone is attached to address node versus band/seat are not yet proven by this audit. Locate and verify before wiring UI or graph attrs. |
| Trace persistence | `p.trace` initialized by `traceNew()`; `validateTrace` enforces strict node/edge allowlists and profile import/export validation | Stored graph only for relationships that cannot be derived; source stories, address patterns, release/reframe, rituals, practice events are derived | New node/edge kinds require synchronized type/rule/validation/cycle/UI/test updates. No arbitrary graph types may be inserted. |
| CQ / DQ / SQ | `atuned_src/engine/compute.js` and profile/history boundary in `schema.js` | CQ is 21 laws over 210 with release lift; DQ and SQ are separately computed | Conceptual `CQ = (Integrity × Intention) / Resistance` still needs one versioned reconciliation with the current 21-law implementation. No second calculator. |

## Qualium decision
Owner definition: **qualium is the orientation of distortion**.

The current source audit has not identified an existing canonical field that can safely be declared equivalent to qualium. Three adjacent candidates are explicitly not interchangeable without a domain rule:
1. `NODES[].d`, a node-level distortion descriptor;
2. `OUTWARD` / `INWARD`, calculation groupings for charge balance;
3. tone/frequency, a node/seat signal reference.

Therefore, this block does **not** add a new persisted qualium field, enum, or trace node yet. That is not deferral by preference: it prevents a guessed mapping from becoming canonical data. The next implementation block must establish the qualium vocabulary/relationship contract and locate the tone owner in source before adding graph links.

## Recursive review
### Review A — semantic and owner correctness
- Story text is raw source; parsed imprints are interpretation.
- Fetter identity and address identity currently share the graph's `pattern` type; do not flatten them conceptually.
- Node `d`, charge direction, qualium orientation, and tone remain distinct until mapped explicitly.
- No top-level `p.vritti[]` collection is justified by the current evidence.

### Review B — failure and compatibility risks
- `schema.js` is a strict profile boundary; undeclared fields may be rejected or dropped.
- `trace.js` has strict node/edge allowlists and validates imported graphs.
- Derived graph items must be deterministic and idempotent; stored edges must preserve provenance.
- Adding a marker must not mutate CQ, DQ, SQ, node weight, stored-charge estimate, or release-hit count.
- Association must not be rendered as causation.
- Legacy profile import/export/reload must remain valid.

## Block status
- **P0 — partially complete.** Current source owners and material semantic gaps are mapped. The canonical qualium vocabulary/owner and exact tone source remain unresolved.
- **P1 — not started in runtime code.** Do not claim Vritti/qualium/node relationship wiring is complete.
- **Verification — not run.** No build or test result is claimed by this audit.

## Next recursive actions
1. Find the declaration and consumers of `FLOWSEAT`; determine whether tone is keyed by node address or band/seat.
2. Reconcile the owner's qualium vocabulary with `NODES[].d`, charge-direction groupings, and tone without conflation.
3. Define graph relationships using existing record owners; extend trace schema only where the contract requires it.
4. Add tests for derived links, provenance, old-profile compatibility, idempotency, and metric isolation.
5. Run build, engine tests, release-chain tests, and candidate-revision CI; append evidence and the Development Statistics Snapshot.
