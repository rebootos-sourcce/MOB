# ATÜNED Avatar × Canonical Trace, Engineering Round 2 Verification
**Date:** 2026-11-01 Pacific. **Stream:** systems-only, isolated draft PR #164. **Status:** expanded adapter preflight GREEN; exact-head CI and generated-product freshness PENDING/BLOCKED. **Visual ownership:** parallel Avatar/UI AI; **no visual signoff here**.

## Execution strategy and scope
1. Check PR #164 status, pending workflows, and actual overlaps with #149 Celestial, #157 Observatory, #158 Trace Summary and #163 Source AI. Do not touch shared/main.
2. Reproduce high-risk graph-logic failures with tests first; make only isolated adapter repairs. Preserve canonical `trace.js`, profile schemas, Trace provenance ontology, CQ/SQ/DQ, ritual, release and Source AI.
3. Run the whole isolated suite against fetched GitHub code, with independent local Node reproduction; update versioned consumer schema and executive documentation.
4. Finish only after the branch tests, source contract and handoff are accurate. Keep production integration HOLD until exact-head GitHub CI, canonical build products, cross-branch composition, consent/entitlement tests and UI-owner approval are green.

## Exact code and test evidence
- GitHub PR: https://github.com/rebootos-sourcce/MOB/pull/164
- Systems branch: `work/avatar-graph-readonly-v08-20261101`.
- Adapter code commit: `f7c4ab99594046cd8e0d2005bf70e87808250272`; fetched adapter blob SHA `7c8485eb170eed4fa70a171dd46c8cc6588ff9b8`.
- Expanded test blob SHA `53189d1d22f4395b522e1200b4bf73336630a198`. JSON Schema blob SHA `f840cb9b774e3c9581fd7d456abc6a6aa7c579ac`.
- Executed all **34/34 named isolated tests** from the actual fetched branch files in the isolated V8 code harness with a strict-assert compatible shim. Node/CI identity is **not claimed**.
- Independently executed **29/29 local Node tests** on the earlier v0.8 ZIP adapter with the new isolated safeguards applied. This is a local equivalence test, **not** an exact byte-for-byte GitHub HEAD checkout.
- Previously validated on an **older exact GitHub commit**: **23/23 Node isolated** plus **11/11 real generated MOB engine**; current expanded 34-test head and the real-engine suite still need GitHub CI.
- Latest checked GitHub Actions run for fix commit: https://github.com/rebootos-sourcce/MOB/actions/runs/41390488867, **queued** when inspected. Earlier 29/30 full job count is historical, not current-head verification.

## Red–green defect ledger
| ID | Before repair | After repair and executable regression |
|---|---|---|
| AG-26 | Invalid `traceNeighbors(g,key)` null caused exception, thrown provider could be mistaken as empty | Return `unavailable` with zero nodes/edges |
| AG-38a | An unrecognized relationship provenance (e.g. `made_up`) could reach a displayed edge | Exclude noncanonical provenance using Trace source vocabulary |
| AG-38b | Duplicate links in a graph inflated displayed edges and provenance evidence count | Deduplicate by `from,to,relationship,source`, deduplicate story-link counts |
| AG-38c | Dense valid graphs could return unbounded edge arrays even when nodes were capped | Cap results to **16 nodes/64 edges**, set `truncated:true`; schema maxItems=64 |
| AG-38d | Invalid node provenance could be silently converted to `inferred` | Fail the projection closed as `unavailable` |
| AG-38e | Unknown edge relationship with user-confirmed source could bootstrap a taxonomy-only pattern into personal output | Require allowed canonical relation/source vocabulary before considering personalization |
All fixes remain in `atuned_src/engine/avatargraph.js`. Tests are `tests/avatargraph.js`. Schema is `docs/ATUNED_AVATAR_GRAPH_PROJECTION_V2.schema.json`.

## Consent, entitlement and integration boundaries
- External `authorized:true` is an adapter input, **not a proof of host consent**; browser host must enforce session consent and clear selection on revocation and profile switch. This remains unverified end to end.
- `readSeenOf(CURP)` is the intended plan-filtered read. Composite integration tests must verify a restricted entitlement cannot see hidden rung data; current isolated graph tests cannot certify host entitlement.
- Taxonomy `known` is not personal evidence; `inferred` does not become user confirmation; observed release does not prove a pattern; conflicts are preserved.
- No changes were made to `trace.js`, stored profile data, CQ/SQ/DQ values, Source AI, release, ritual or production `main`.
- Compatibility responses already verified: **#157 GREEN LIGHT and #158 GREEN LIGHT**. **#149 and #163 pending**. Approval is for interface compatibility only, never merge authority.
- UI AI owns visual composition and final appearance, including the full 21 laws, ≥44 px hit targets and return-state continuity.

## Remaining execution gates, in order
1. Wait for the current branch workflow to **complete**; verify exact-head `node tests/avatargraph.js` reports **34/34** and `node tests/avatargraph-runtime.js` reports **11/11**, plus every other job; repair only reproducible failures.
2. Obtain an actual full GitHub checkout (this runtime cannot resolve `github.com` directly). Run `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`. Stage genuine generated files, inspect diffs and validate `node tools/products.js`. **Never manually patch derived `engine.js`, `source.html` or funnel bundles, and never weaken freshness gates.**
3. Compose #149/#157/#158/#163 on a reviewed integration candidate only. Preserve `MANIFEST` order, `engine/export.js` bindings and single `renderAvatar` ownership. Re-run all interface, identity, consent, entitlement, and browser gates.
4. Obtain explicit contract review from #149/#163 and visual approval from Avatar/UI owner. Then hand final engineering verification and build artifacts to merge authority; do not self-merge.
5. Keep systems index, this ledger, and executive parallel handshake current whenever acceptance state changes.

## Rating and disposition
- Isolated fetched-source behavioral checks: **34/34 = 100% tested cases**, confidence **0.97** for those fixtures.
- Independent local Node equivalents: **29/29** on a reconstructed adapter, confidence **0.94** for local behaviors only.
- Old canonical real-engine tests: **11/11 on previous commit**; current head = **unverified**, confidence **0.50**.
- Explicit cross-branch approvals: **2/4 = 50%**.
- Product freshness: **RED; three previously identified derived files stale**.
- Exact-head full CI: **queued / not verified**.
- Production readiness: **HOLD**, not rated as a percentage because the required production gates have not been satisfied.

**Next AI instruction:** Read the [systems index](ATUNED_AVATAR_GRAPH_SYSTEMS_HANDOFF_INDEX_2026-11-01.md) first, then the [architecture contract](ATUNED_AVATAR_GRAPH_SYSTEM_ARCHITECTURE_CONTRACT_V1_2026-11-01.md), [TDD matrix](ATUNED_AVATAR_GRAPH_TDD_ACCEPTANCE_V1_2026-11-01.md), this verification, and the [chronological executive log](ATUNED_AVATAR_GRAPH_PARALLEL_HANDSHAKE_2026-11-01.md). Never confuse isolated V8 preflight with real Node/compiled production CI.
