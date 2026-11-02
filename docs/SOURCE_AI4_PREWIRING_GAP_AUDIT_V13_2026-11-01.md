# SOURCE AI-4 — Pre-Wiring Gap Audit and Integration Hold (V13)
**2026-11-01 · branch `source-voice-sniffer-readonly-20261031` · draft PR #163**
**Decision: NO LIVE WIRING, NO MANIFEST EXPORT, NO MERGE, NO DEPLOY.**
This report supersedes any V12 suggestion that a `hostVerifiedActiveRecord` caller boolean is equivalent to authentication. It is not.

## Verified inspected inputs
- `atuned_src/engine/source_evidence_bus.js` (original v1 and hardened v1.1).
- `proto/source/source-evidence-bus-v1.test.js`, `voice_intelligence.js`, `voice_narrative.js`, `voice_sniffer.js`, `atuned_src/MANIFEST`, `engine/export.js`, `docs/SOURCE_VOICE_PAIN_ANCESTRY_V11_LOCAL_HANDOFF_2026-11-01.md`, and `.github/workflows/deploy.yml` on the draft branch.
- GitHub PR #163 current unmerged draft state and CI run #41365137545, on **older** head 389263c8af30a7aa9e5d4f21335fe0bd003b91b1.
- Local Node v22 standalone script at the same relative source/test paths. **52 assertion checks passed before commit.** This is not an official repo CI run or real-host test.

## Findings and remedial status
| ID | Priority | Gap | Remediation | Remaining gate |
| --- | --- | --- | --- | --- |
| A01 | P0 | Caller could set `hostVerifiedActiveRecord:true`, `allowProfileShare:true`, `userConsent:true` and cause `profileShare=true`; pure function did not authenticate. | **Fixed at staging boundary v1.1:** `profileShare` permanently false; graph status never exported, regardless of flags. | Build trusted same-origin session host with active record identity, expiry, revocation, stale-callback and cross-record tests before any profile route. |
| A02 | P0 | `ledger:i` and `voice:i` were array positions presented as evidence references; unstable across turns and not durable provenance. | **Mitigated:** now explicitly ephemeral `turn:ledger:i` / `turn:voice:i` session-only candidates, unverified and never dispatched. | Canonical provenance IDs, resolved only in trusted session scope, with no stale/cross-session collisions. |
| A03 | P0 | Report shape and graphStatus could be forged; no canonical-source identity binding. | **Partially mitigated:** required canonical reader shape, unmeasured CQ and ancestry, benign status gates; scope is marked unverified caller claim. | Trusted host must call canonical reader itself and issue scoped output; field equality is not authentication. |
| A04 | P0 | Original V11 NP-001..045 source/clauses/bus and owner-approved body mapping are not in branch; cannot assert equivalent behavior. | **Not resolved.** V11 claims remain historical and unverified. | Recover source ZIP, diff clauses, reconcile explicit corrections, false positives and approved NP→PAINREG/112 semantics. |
| A05 | P0 | The staged bus was absent from MANIFEST/export; nine targets were descriptions, not actual routes; no signed-off owner contracts for mutations. | **Intentionally unchanged.** All packets read-only candidate envelopes with `action:'NONE'`, `dispatch:'NONE'`. | Implement each consumer contract, authorization, independent CQDQ laws and explicit release/ritual/persistence confirmation. |
| A06 | P0 | Repo's required fast-gate voice-copy objections fail even while engine/browser gate steps pass; staged standalone test not in official workflow. | **Not resolved.** CI run #41365137545 confirms fast voice-copy failure; latest V13 run must be checked separately. | Fix objections, register dedicated tests safely, run full official gate; do not relax copy rules. |
| A07 | P1 | Narrative extraction uses bounded regex/turn heuristics; false kin attribution, negation, hypothetical and correction cases may remain, particularly against missing V11 suite. | **Not resolved.** Bus does not independently promote narrative to cause or law score. | Differential test matrix against owner V11 clause corpus and user corrections; expand language fixtures. |
| A08 | P1 | Direct voice→host mic/SDK, idle, speaker boundaries, retention, and session consent are not demonstrated. | **Not resolved.** | Integration/E2E tests with real authenticated runtime and user-approved data lifecycle. |

## What v1.1 actually does
- Refuses absent consent, rejects revoked sessions, refuses malformed/unrecognized reports.
- Emits **nine provisional session-only envelopes only** if the intelligence report is `READ`, keeping `writeAuthority:'NONE'`, `action:'NONE'`, `dispatch:'NONE'`.
- Does **not** export the record, graph identifiers, graph status, raw narrative, user profile keys, literal lexical matches, computed CQ, law grades or inferred ancestry.
- Never changes profile state or operates Body Map/Avatar/Compass/Story Bank/Graph/CQDQ/Ritual/Release.
- Reports speaker rejection separately from resemblance candidates. Does not use negated/other-person lexical hits as first-person observations.
- Limits ledger and lexical candidate metadata to 12 each (maximum 24), with source indices expressly nonpersistent.

## Local tests vs official gates
- `node proto/source/source-evidence-bus-v1.test.js` ran in an isolated local directory on Node v22: **52/52 passed** after hardening.
- Node script tests consent, revocation, forged flags, graph nonexport, report validation, speaker corrections, unmeasured fields, no private text forwarding, bounded metadata, offset limits, and nonmutation.
- No full source tree or build was available locally; test executes the staged adapter only.
- The **older** run 41365137545 passed generated-products freshness, engine and observed browser stages, but failed fast-gate `voice check, his own objections as rules`. Nothing here claims green CI for new commits or that all browser suites are comprehensive.
- The newest commit's workflow status is transient. Recheck by commit SHA in GitHub Actions after the docs commits, not by reusing earlier run output.

## Integration acceptance gates (must all be true)
1. Owner V11 ZIP recovered, exact NP records and clause/bus behavior compared; explicit body mappings approved.
2. Trusted host session constructed with identity, consent, scope, expiry, revocation and stale-callback protection; spoofing and cross-profile reads red-team tested.
3. Canonical evidence IDs resolve to specific user-provided statements and are never reused as durable keys across sessions.
4. Each of nine consumer modules owns independent read vs mutation rules; no implicit cross-tool persistence, ritual or release initiation.
5. No CQDQ 21-law / 10-level score, shadow score or ancestry cause is stated as measured without its own validated evaluator.
6. Generated products rebuilt with repository scripts; standalone and official Node/browser/voice-copy tests green on the **same** commit SHA.
7. Owner reviews the proposed production wiring before merge or deployment.

## Read order for successor AI
`docs/ATUNED_SOURCE_INDEX.md` → this V13 audit → `docs/SOURCE_AI4_EXECUTION_HANDSHAKE_V12_2026-11-01.md` → `docs/SOURCE_AI4_COLLABORATION_LOG_2026-11-01.md` → source + standalone tests → V11 and current voice modules. Update audit, handshake, log and index whenever a gate changes. Do not report nine routed consumers when there are only nine packet templates.

## Measurements
96 AP/GP/PP records historically structurally checked, 62 catalog research anchors, zero unresolved references in prior pass (not reaudited today). v1.1: 9/9 stage-only packet shapes, **0/9 actual consumer routes**. Local hardened tests: **52/52**. Official new-head CI: **pending**. V11 owner NP package: **missing**. Profile access, live mic, persistent Story Bank, law grades, physical/spiritual causal mapping: **not verified**.
**Confidence**: stage logic 0.96; host security readiness 0.10; canonical behavioral equivalence 0.35; readiness for production wiring 0.15. These are engineering judgments, not measurements of a person's coherence.


## 2026-11-01 follow-up execution, A07 partial remedy
Per the user's instruction to resolve the gaps, the existing canonical narrative reader was adjusted to keep first-person emotion clauses separate from family-member descriptions, scope tentative phrasing per sentence and respect correction order within one turn. Source commit: `206b7f820ef7ddb751de6b6d0f1bdbe4025e1aa2`; regression test commit: `672956a99c237c473fa2c0b2a1849327025f0b7d`. The revised function passed 15/15 targeted V8 checks; committed Node regression was not run in full repo. This partly remedies A07, **not** A04 original V11 equivalence.
Attempted CI workflow registration was blocked; no CI edit committed. The latest inspected earlier run `41365919478` still failed `gates-fast` with 36 copy findings, 18 blockers; engine 6509 and observed browser jobs passed on that **older** head. Canonical source modifications now require generated outputs to be rebuilt/committed before freshness can be called green. A01–A06 and A08 are not resolved by this pass. See `docs/SOURCE_AI4_COLLABORATION_LOG_2026-11-01.md` for exact implementation and next steps.

