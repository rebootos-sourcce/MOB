# ATÜNED Avatar × Graph Intelligence, SYSTEMS handoff index
**Version:** 2026-11-01, v0.8 engineering stream. **Branch:** `work/avatar-graph-readonly-v08-20261101`. **PR:** https://github.com/rebootos-sourcce/MOB/pull/164 (draft; **do not merge or deploy**).

## Start here, in order
1. [System architecture & versioned read-only interface contract](ATUNED_AVATAR_GRAPH_SYSTEM_ARCHITECTURE_CONTRACT_V1_2026-11-01.md), definitions, data ownership, inputs/outputs, provenance, identity/permission boundaries, cross-system seams, responsibility split.
2. [Engineering TDD, 39 requirement IDs, acceptance matrix and fixtures](ATUNED_AVATAR_GRAPH_TDD_ACCEPTANCE_V1_2026-11-01.md), RED/GREEN workflow, current tests, blocked composed checks, gate ownership.
3. [Executive parallel handshake and chronological execution log](ATUNED_AVATAR_GRAPH_PARALLEL_HANDSHAKE_2026-11-01.md), branch history, CI results, cross-AI approvals and pending build.
4. [Read-only canonical Avatar graph projection](../atuned_src/engine/avatargraph.js), current v2 implementation. No parallel graph engine.
5. [Isolated regression test suite](../tests/avatargraph.js) and [real MOB engine test suite](../tests/avatargraph-runtime.js), run against exact branch head, not against an old generated bundle.
6. [MANIFEST](../atuned_src/MANIFEST), [engine exports](../atuned_src/engine/export.js), [CI workflow](../.github/workflows/deploy.yml), canonical build order and required gates.
7. [UI integration seam](../atuned_src/ui/avatarui.js) (existing collapsed Connections disclosure), other Avatar/UI AI owns presentation and visual acceptance; systems AI reviews data/consent contract only.
8. [Canonical graph](../atuned_src/engine/trace.js), [loaded record read](../atuned_src/engine/read.js), [entitlement read](../atuned_src/ui/lock.js), preserve these as single authorities.

## Interfaces and concurrent work
- **#157** Graph Observatory: https://github.com/rebootos-sourcce/MOB/pull/157, explicit GREEN LIGHT for compatibility; no merge authorization.
- **#158** Parent/child summary: https://github.com/rebootos-sourcce/MOB/pull/158, explicit GREEN LIGHT for compatibility; no merge authorization.
- **#163** Source AI voice and graph: https://github.com/rebootos-sourcce/MOB/pull/163, explicit compatibility response pending; optional narration is a separate consented consumer.
- **#149** Celestial Avatar: https://github.com/rebootos-sourcce/MOB/pull/149, explicit compatibility response pending; shares Avatar render/mount and MANIFEST.
- All four branch owners can continue their own isolated work. Shared changes require reviewed composition and full CI; do not cross-merge silently.

## What has actually been implemented
- Read-only Avatar-to-Trace projection, seven-seat selection, bounded evidence-qualified graph nodes and edges, identity/refusal/privacy handling, no score or Release writes.
- Existing 23 isolated regression checks plus 11 real-engine checks passed on an earlier tested commit.
- **New:** six isolated regression cases in `tests/avatargraph.js` (expect 29 total on next Node run); malformed `traceNeighbors` data now fails closed as `unavailable`; seven focused isolated V8 checks passed after the fix. The expanded exact-head Node tests are **not yet verified**.
- Owner changed scope: systems AI owns architecture, logic, TDD and engineering quality; other AI owns visual design, UI approval and layout decisions. Do not treat CI's design checks as final product-visual approval.

## Required to finish the engineering stream
1. Execute updated isolated `node tests/avatargraph.js` and real-engine `node tests/avatargraph-runtime.js` under GitHub CI (or full trusted checkout).
2. Regenerate and commit derived artifacts using canonical scripts; product freshness test currently fails.
3. Run full exact-head CI and recompute 29/30 status (29/30 was the earlier inspected run, not this new head).
4. Complete privacy/entitlement and composed Source/Celestial acceptance; obtain explicit compatibility replies from #149 and #163.
5. Hand final verified interface to the other Avatar/UI AI for layout/visual acceptance. Systems stream does not own that approval.
6. Update this index and executive log on each material change; record exact commit and CI run. No production merge or deployment without all gates.

## Measurements (last reliably checked)
- Historical GitHub CI: 29/30 successful jobs; sole blocker generated-product freshness.
- Previously verified 23/23 isolated + 11/11 canonical-engine tests. New six tests require new CI proof.
- 7/7 focused V8 isolated checks on the updated adapter (not full Node suite).
- Cross-AI explicit replies: 2/4; PR #164 draft/unmerged.
- **Systems documentation completeness:** architecture contract and TDD matrix written; composed integration gates outstanding. **Production readiness:** not verified.

## Most recent verification note
- After the six new tests, all **29/29 isolated named test bodies passed in a V8 harness** against the fetched committed adapter; this does not certify Node.js or production. GitHub exact-head workflow [41386733147](https://github.com/rebootos-sourcce/MOB/actions/runs/41386733147) was queued when checked.
- Full repository checkout was not available here due GitHub DNS failure; no canonical generated artifacts have been rebuilt or committed. The product-freshness gate remains the known blocker.

## Machine-readable consumer contract
- [Projection output JSON Schema v2](ATUNED_AVATAR_GRAPH_PROJECTION_V2.schema.json) documents the exact allowed status, canonical selector, node, edge, evidence, graph and uncertainty fields returned by `AVATAR_GRAPH.project`. It is a parsing/integration artifact, not an authorization token or claim of production compliance. Cross-AI consumers should consume only v2 fields and request review before changing status meanings.

## Round 2: latest engineering verification (supersedes earlier running counts)
- [Round 2 reproducible defect/repair ledger](ATUNED_AVATAR_GRAPH_ROUND2_VERIFICATION_2026-11-01.md), 34/34 expanded isolated regression cases against fetched actual GitHub adapter in V8; a **test shim, not Node CI**.
- [Projection v2 JSON Schema](ATUNED_AVATAR_GRAPH_PROJECTION_V2.schema.json) now caps edges at 64; adapter caps nodes at 16 and edges at 64, deduplicates evidence, excludes unknown edge sources, rejects malformed node provenance and rejects unknown relationships when establishing personal evidence.
- Current source fix commit `f7c4ab99594046cd8e0d2005bf70e87808250272`; source blob `7c8485eb170eed4fa70a171dd46c8cc6588ff9b8`; tests blob `53189d1d22f4395b522e1200b4bf73336630a198`.
- Latest test-fix GitHub Actions [41390488867](https://github.com/rebootos-sourcce/MOB/actions/runs/41390488867) **queued when checked**. Prior 29/30 CI and 11/11 real-engine tests are from an older commit; no exact-head green or production approval.
- **Engineering remaining:** exact-head Node and compiled engine jobs, authentic full-checkout generated-product rebuild/freshness, entitlement/consent and four-branch composition, #149 and #163 explicit review. **Production HOLD; other Avatar/UI AI retains visual signoff.**

## Owner stand-up directive, current policy
- **Read [stand-up-first risk register](ATUNED_AVATAR_STANDUP_RISK_REGISTER_2026-11-01.md) before interpreting any earlier "HOLD" language.** Optional noncanonical data now produces `graph.flagged` and a partial/readable result, not an all-product stop. Only actual access/data/core-operation failures gate the affected unsafe path.
- Branch `atuned_src/engine/avatargraph.js` + `tests/avatargraph.js` revised to this rule. **35/35 isolated tests passed** on fetched source under a V8 harness; updated exact-head GitHub CI remains unverified.
- **Ship staged functionality:** core first, optional Source/Celestial/Graph features progressively enabled when verified. Generating executable derived bundles is still necessary before claiming new code runs in the product.
- The other Avatar/UI AI retains visual design/approval; noncritical visual polish is not a systems-engineering blocker.
