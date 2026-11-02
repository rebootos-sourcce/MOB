# ATÜNED Avatar × Graph Intelligence — System architecture & interface contract v1
**Date:** 2026-11-01 Pacific. **Status:** engineering contract for draft PR #164; **not** a claim of production deployment.
**Responsibility assignment (owner decision):** This branch owns system architecture, logic, contract design, TDD and evidence/provenance correctness. The other Avatar/UI AI owns visual design iteration, component composition, interface acceptance and visual signoff. No visual approval is sought or asserted by this branch. Both sides must still coordinate before production merge.

## 1. Canonical authority and module boundaries
| Concern | Authority / path | Rule |
|---|---|---|
| Graph ontology, nodes, edges, traversal, provenance | `atuned_src/engine/trace.js`: `traceFromRecord`, `traceNeighbors`, `tracePath`, `TRACE_ALG` | Never reimplement graph adjacency, redefine classifications, infer personal causes, or mutate trace. |
| Loaded record and authoritative computation | `atuned_src/engine/read.js`: `readHeld`; `engine/profiles.js` | Reading must belong to loaded record; do not call `read(CURP)` inside a painter: it can replace state. |
| Plan/entitlement filtered reading | `atuned_src/ui/lock.js`: `readSeenOf(p)=sightR(readHeld(p))` | UI passes only own, plan-filtered active reading; unknown/unread is not measured. |
| Avatar read-only projection | `atuned_src/engine/avatargraph.js`: `AVATAR_GRAPH.project(args)`; `engine/export.js` | Pure adapter; no new scoring, Release, ritual state or source text. |
| Avatar presentation | `atuned_src/ui/avatarui.js` | Treat projection as data; the other UI AI owns visual hierarchy, mobile and interaction acceptance. |
| Parent/child blends and explanations | PR #158 `tracesummary.js`; PR #163 Source AI | Separate readers over canonical graph; no competing summarizer in this branch. |
| Celestial lenses | PR #149 | Independent interpretive peer; never promote a symbolic association to a confirmed personal finding or score. |
| Observatory | PR #157 | Alternative graph surface; no second traversal engine. |
| Build orchestration | `atuned_src/MANIFEST`, `BUILD-engine.sh`, `BUILD.sh`, `funnel/BUILD-single.sh`, `tools/products.js` | Regenerate bundles canonically; no manual bundle edits or test bypass. |

**Dependency:** `avatargraph.js` follows `engine/loop.js` in the branch's MANIFEST. Graph consumers must accept the same `traceFromRecord` API and provenance vocabulary; proposal for a new interface requires a reviewed versioned contract.

## 2. Current implemented contract (verify against branch HEAD)
```js
AVATAR_GRAPH.project({
  authorized: true,                 // explicit external authorization, not inferred
  profile: activeRecord,            // object with nonempty string id
  reading: entitlementFilteredRead, // null or reading with rec === profile.id
  selection: {kind: 'seat', id:'Root'}, // or {kind:'pattern',id:12}
  engine: {traceFromRecord,traceNeighbors,practiceTraceIntents?},
  limit: 6
})
```
Accepted selectors: 7 canonical seats (Root, Sacral, Solar, Heart, Throat, 3rd Eye, Crown); numeric pattern/address IDs; `{kind:'structure',type: 'saboteur'|'complex'|'hyper_complex'|'super_complex',id:string}`. Masks, boundary, character, celestial, and unrecognized selectors are **not** valid graph selectors yet. A future mapping must be a reviewed contract change, not an invented semantic shortcut.

**Output:** `{v,status,readingStatus,selection,nodes,edges,evidence,graph,truncated,notice}`. `status`: `access_denied | no_record | unavailable | unsupported_selection | reading_mismatch | no_evidence | graph_refused | partial | ready`. `readingStatus`: `measured | not_measured`. Nodes expose only canonical key, type, bounded label, optional seat/weight, provenance and confirmation state. Edges expose only from, to, relationship and provenance; neither raw entry text nor user/profile IDs are returned. `limit` clamps to 1..16 (default 10); callers may request 6.

**Output compatibility rule:** Schema v=2 is current; additive fields may be ignored by old consumers, but changing status meanings, selector forms, canonical provenance or identity semantics requires a new contract version and TDD migration.

## 3. Evidence semantics (normative)
- `known` is taxonomy, **not personal evidence**. A canonical address-to-classification edge cannot, by itself, justify showing a personal finding.
- `inferred` is computationally suggested. It is not `user_confirmed`; `proposed` is not confirmation either.
- `observed` names an observed event or relation; observing a release targeting an address does **not** confirm that address as the person's identity.
- `user_confirmed` is explicit on-record assent, not an inference from an AI summary. `ob.yes` confirms and `ob.no` rejects; both on the same address yields `conflicted`. Unrecorded = `not_recorded`.
- For the read-only Avatar chain, only record-supported graph relations may surface. `causes` links and unsupported inferred causality must never be shown as established facts.
- A graph `refused` structural reading produces `graph_refused`; unrelated refusal may yield `partial` and its notice. Missing/invalid engine produces `unavailable`, not invented content.
- A blank or unanswered profile returns `no_evidence`, not a personalized pattern. Lack of evidence is **unknown**, not a zero score or absence of a characteristic.
- Ritual completion, spiritual laws, celestial associations, narrative pain map, ancestry and Source AI dialogue are separate interpretive/records domains; do not derive CQ, SQ, DQ or Release measurements inside this projection. Clinical/somatic/ancestral causality is not proven by graph linkage.

## 4. Safety, privacy, consent, and state machine
**Entry:** (a) correct active record, (b) explicit authorization, (c) entitled reading from `readSeenOf(CURP)`; otherwise return a bounded, nonidentifying status. A nonmatching `reading.rec` is rejected **before** trace traversal.
**Read:** pure `traceFromRecord(profile,intents,reading)` then canonical neighbor traversal. Do not cache or reuse the graph across profile switches without binding to record ID, reading signature, entitlements and consent.
**Exit:** return a small deterministic projection. No journal text, story timestamp, personal ID, direct profile mutation, score recalculation, network request, persistence, Release action or background write.
**Interaction:** a collapsed Connections surface only fetches on deliberate expansion; profile change closes it and clears transient selections. UI contract: `closed -> requested -> ready|no_evidence|partial|unavailable`; access denial never falls through into personal data. A confirmation/correction initiated by a future UI must pass to the canonical correction workflow, never be written by this projector.
**Error:** fail closed, preserve record state, display uncertainty accurately, and allow a new read only after a legitimate state change.

## 5. Source AI / parent-child / celestial integration seam
The projection is a **reference view** and can return canonical node/edge keys and bounded provenance. PR #158's `traceSummary(g,node)` can add narrations **only** after its own evidence contract and consent checks pass; it must not turn inferred into confirmed. PR #163's voice intelligence can consume a permitted read-only projection **only** through its separately consented same-origin host boundary. Celestial PR #149's Avatar mount must render independently and cannot overwrite Connections state or alter quotient values. Do not combine branches until an actual composed integration build, not PR descriptions, verifies export order and UI event ownership.

## 6. Execution flow and seam architecture
```text
record + active-session consent
  -> readHeld(record) + sightR( ... ) [readSeenOf; entitlement owner]
  -> AVATAR_GRAPH.project [selection/identity guards]
  -> traceFromRecord + traceNeighbors [canonical Trace engine]
  -> bounded, provenance-qualified projection
  -> Avatar UI adapter / other AI's interface design
  -> optional Source AI summary (separate reviewed consumer)
```
No reverse write arrow exists. Future corrections must use the canonical record correction interface with explicit assent and independent tests.

## 7. Concurrent-branch handshake and acceptance ownership
- **Systems branch / PR #164:** data contracts, integration diagram, invariants, executable tests, compatibility reviews, provenance/identity/privacy, generated-product gate, engineering handoff.
- **Other Avatar/UI AI:** visual style and layout, Seven Seats presentation, design-system integration, keyboard/mobility polish, user visual acceptance, and composing PR #149's mount.
- **Other domain AIs:** #157 observatory, #158 graph summary, #163 Source voice, #149 celestial each approve their own interface compatibility. Explicit reviews, not silence, are the coordination signal.
- **Merge owner:** only after exact-head CI, generated-product freshness, integration diff review and user/other-AI visual approval through their process. This systems document does not waive production gates.
- **No shared writes:** do not modify another AI's branch, Source mailbox, global graph schemas or generated products by hand. Share changes using documented versioned contracts and PR links.

## 8. Product/UI acceptance requirements handed to other AI (not this branch's visual signoff)
The pre-existing Avatar v0.6 review recorded: 21-law overlay drew 14 indicators, seven narrow mobile tool targets (~39×40 px), and feature-return reset the Summary selection. These are historical prototype findings, **not claims about current production status**. UI AI should validate full 21/21 indicator semantics, ≥44×44 target size, selection continuity, and v0.6 copy-removal instructions; retain Seven Seats, Masks, Boundary, Compass, CQ/SQ instrument and contextual Summary. Systems AI supplies deterministic fixtures and guards but does not approve the appearance.

## 9. Current verified development status (2026-11-01)
Draft [PR #164](https://github.com/rebootos-sourcce/MOB/pull/164) is open/unmerged. Tests: 23 isolated + 11 real-engine passed in previous CI. Latest inspected exact-head [run 41382848109](https://github.com/rebootos-sourcce/MOB/actions/runs/41382848109): 29/30 CI jobs passed, with only `gates-fast` generated-product freshness failure. Prior CSS/design gate regression fixed; design gate passes. Branch compatibility GREEN LIGHT from #157 and #158, pending #149 and #163. No production or full end-to-end certification.
