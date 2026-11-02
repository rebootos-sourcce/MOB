# ATÜNED Avatar, Stand-Up First / Risk Register
**Owner's direction (Nov 1, 2026):** Stand the product up. **Non-canonical inputs are flagged, not a whole-product blocker.** This replaces earlier blanket "HOLD until perfect" language. Valid functionality proceeds; imperfect optional integrations may remain in a degraded state. Do not make up measurements, evidence or readiness.

## Operating rule
1. **Ship the coherent, working core.** Core here means the existing MOB product and the seven-seat Avatar projection where the inputs are valid. A new optional graph lens must never prevent the rest of the Avatar from working.
2. **Flag + isolate non-canonical data:** Count and exclude unsupported node provenance, invalid relationships and malformed neighbor responses; show valid verified evidence with a nonblocking `partial` status and generic notice. If none remains, return `no_evidence` with a flag rather than fabricating a result.
3. **Degrade optional functionality:** Missing Source AI, Celestial, Graph Observatory, or a visual polish task must not stall basic Avatar read-only experience. Mark the unavailable feature; don't invent content or force cross-branch merges.
4. **Escalate genuine P0 failures:** unauthorized access, cross-profile exposure, destructive/misapplied writes, silently accepted fake confirmations or dangerous assumptions, app startup crash, or artifact that literally cannot execute. A P0 failure gates *the affected unsafe path*, not necessarily the entire independent app.
5. **Keep real build verification honest:** Stale generated bundles mean newly written source isn't present in the delivered build; regenerate those bundles before saying that particular feature is running. This is a concrete packaging dependency, not a demand for UI perfection. Do not bypass `tools/products.js` or mislabel old bundles as new.
6. **Other AI owns visual acceptance.** If optional aesthetics are incomplete, document them; do not hold systems engineering for someone else's visual decisions.

## Severity rubric
| Priority | Meaning | Action |
|---|---|---|
| P0 | Cross-record leak, loss of record or consent, unsafe state mutation, unbootable core / missing executable bundle | Isolate/remove the unsafe path until fixed; release other verified independent functionality if feasible |
| P1 | Noncanonical data, partial graph, optional integration unavailable, unanswered Source/Celestial response, incomplete visual lens | Keep valid functionality; flag, disable, or label the affected module; log contract and test |
| P2 | Animation/style/wording polish, completeness of noncritical visual decoration | Record for UI AI; do not block engineering stand-up |

## Immediate implementation of owner's rule
On [draft PR #164](https://github.com/rebootos-sourcce/MOB/pull/164), `atuned_src/engine/avatargraph.js`:
- `graph.flagged` counts excluded noncanonical entries/errors. It is not a score, diagnostic or user trait.
- Unknown source or relation cannot seed personal evidence; invalid nodes are skipped rather than co-opting `inferred`.
- Invalid neighbor traversal becomes a flagged **partial** view if verified root evidence exists, not an all-or-nothing error.
- A valid projection with excluded data returns `partial`; no valid personal evidence returns `no_evidence` with a flag. Critical cross-record/authorization failures still return `access_denied` or `reading_mismatch`.
- Data remains read-only; invalid graph data is neither written to a profile nor represented as a confirmed observation.
- UI AI should render `graph.flagged` and `notice` as a mild, nonblocking data-warning when the Connections panel opens. The current minimal UI may still say "refused" for `partial`: update its wording in the UI owner's implementation, not by hijacking their design branch.

## Practical route to stand-up
**Phase A, functional core:** Keep the currently verified base app and record loading operational. Disable/remove any optional new connection surface if its runtime is absent, rather than crash the app. Demonstrate story/seat read with an existing user record and unknown-state when blank.

**Phase B, build-to-release:** Run the canonical build on a full repo checkout; commit the genuine generated bundles. Verify startup, no profile crossover, nonmutation of CQ/SQ/DQ, and a user can open/close the available Connections panel. Treat cosmetic imperfections as issue tickets, not build failures.

**Phase C, progressive optional integration:** Compose #157/#158 as compatible readers once tests pass; Source AI #163 and Celestial #149 may follow independently. Do not wait for every future AI module to stand up a base product. Do not merge conflicting code without actual integration review.

**Phase D, UI ownership:** Separate AI reviews layout, hit targets, wording, 21-law visualization, and visual identity. Systems AI supplies flags/contract/test data; no competing approval loop.

## Acceptance and measurements
- New isolated tests reflect nonblocking semantics and explicitly retain valid personal evidence while reporting flags.
- On latest validated isolated branch code: **35/35 passes** in a V8 harness (not full Node GitHub CI).
- Current-head GitHub full CI, regenerated products and native UI acceptance remain **unverified**.
- Cross-AI code composition remains independent and is not a prerequisite for *basic* functionality where optional modules can be left disabled.
- Product `main` has not been merged/deployed by this branch.

**Decision record:** Do not confuse "not all features perfect" with "cannot stand up the app". The first is ordinary phased delivery. The second requires actual evidence of a P0 issue.
