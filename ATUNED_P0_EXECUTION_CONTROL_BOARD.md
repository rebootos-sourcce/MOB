# ATUNED P0 Execution Control Board

Updated: 2026-10-12
Status: ACTIVE — P0 NOT CLOSED
Purpose: One dependency-ordered board for parallel implementation, cross-repository review, regression, and evidence-based closure. This board does not authorize merges, production deployment, live migrations, vault imports, gift issuance, billing/profile-sync activation, or lowering test floors.

## Operating protocol (mandatory for every block)
1. Reconcile exact branch head and current CI before editing.
2. Build in isolated draft branches/PRs where possible; run unrelated workstreams concurrently.
3. Record changed files, exact commit SHA, tests run, and observed output.
4. Have a second workstream cross-review the contract and failure paths (not only the author reviewing their own work).
5. Add discovered gaps to this board under the owning block; do not silently reset or replace the overall plan.
6. Fix findings, rerun affected tests, and re-review the exact new head.
7. Close a block only with acceptance evidence on the exact head. Green CI alone is not product-readiness evidence.
8. Refresh this board after each cycle. Keep PRs draft until required checks and review are complete. Production actions require explicit owner approval.

## Dependency map
- A controls evidence and sequencing for all blocks.
- B supplies approved source-backed pattern IDs/content to C and D.
- C supplies immutable, verified gift snapshots to D.
- E independently audits C, the public canon routes, and migration safety.
- F is required for release readiness but must not be “fixed” by bypassing external checks.
- G cross-reviews B–F and executes end-to-end regression.
- H closes only after all required P0 acceptance criteria are proven.

## Block A — Build control and exact-head ledger
Acceptance:
- [ ] Refresh the master index, implementation audit, all relevant PR heads, exact-head workflow results, and open P0 issues.
- [ ] Every claimed success links to a workflow for the exact SHA being assessed.
- [ ] Every gap has an owning block, dependency, next executable action, and acceptance test.
- [ ] Historical workflow results are explicitly marked historical.
Cross-review: G checks all branch/CI claims; H checks that no open P0 work is omitted.

## Block B — Source recovery and six approved 100-pattern banks
Known baseline (reconfirm before relying on it): source review queue has 560 rows; 376 transcript records and 184 archived-PDF records; 24 PDF locators ambiguous; 210 multiline transcript records need sentence-boundary review; zero stable user-facing pattern IDs and zero owner-approved rows/bank members. These are source locators, not approved pattern IDs.
Acceptance:
- [x] Searched the current Library and handoff bundle for the original “100 patterns/recipes” appendix and The Attuned source assets. No authoritative 100-item appendix was located in the searched source compilation/Mechanics v65 material; continue source recovery if more original assets surface, and do not recreate the bank.
- [ ] Reconcile every candidate to a physical source location and exact source text.
- [ ] Resolve all ambiguous PDF locators and sentence boundaries without invented splits.
- [ ] Assign stable IDs only to individually reviewed, traceable statements.
- [ ] Complete the required source kind/verb, channel, phase, side, release/reframe and gift-nature classification.
- [ ] Create six deterministic, separately versioned banks (anxiety, overwhelm, burnout, depression, grief, sadness), each exactly 100 unique approved IDs.
- [ ] Record approval provenance, content hashes, ordering, and exclusions.
- [ ] Do not choose the first 100 rows, synthesize source wording, or activate unapproved candidates.
Cross-review: C validates bank schema and immutability; D checks that the resulting classifications can be mapped to the release meter; E checks that protected vault material is not exposed.

## Block C — Frozen gift backend and snapshot lifecycle
Acceptance:
- [ ] Reconfirm exact current PR #35 head and all workflows.
- [ ] Ensure a bank cannot freeze unless it has exactly 100 unique, approved, content-hashed entries with deterministic order.
- [ ] Ensure gift issuance fails closed for missing/inactive/wrong-nature/changed banks.
- [ ] Snapshot bank version, nature, ordered IDs, source keys and content hashes immutably at issuance.
- [ ] Verify checkpoint, reload, account attachment and readback return the same verified snapshot.
- [ ] Keep legacy unfrozen placeholders pending and prevent false “100 granted / 0 items” readiness.
- [ ] Add adversarial tests for duplicate IDs, reordered membership, content mutation, missing mapping, category mismatch and replay.
Cross-review: B validates that the content is source-approved; D validates the client contract; E validates privilege boundaries and migration ordering.

## Block D — Browser meter and persisted end-to-end integration
Acceptance:
- [ ] Reconfirm exact current MOB PR #66 head and workflows.
- [ ] Define a deterministic, source-backed mapping from six server verb channels to the client’s four tracks; do not equate identities by count.
- [ ] Client preserves gift and giftVerified fields rather than dropping them.
- [ ] A valid snapshot is the single source of truth; no local synthetic 100-pattern fallback.
- [ ] Prove browser → Worker → Supabase write → read → reload with an approved non-production target.
- [ ] Prove idempotent retry, duplicate prevention, correct usage/remaining counts, and safe no-bank behavior.
- [ ] Verify persisted data matches ordered snapshot IDs and hashes after reload.
Cross-review: C reviews snapshot correctness; G runs journeys and failure injection; E reviews no unauthorized data exposure.

## Block E — Canon integrity, migrations and protected-data boundaries
Acceptance:
- [x] Recovered the established fingerprint source, `atuned/test/tools/canon.py`; it hashes sorted-key JSON with `ensure_ascii=False` using SHA-256 and truncates to 16 hex characters. Reproduced the BANDS manifest fingerprint `a40ba9c5e1dfb8d3`.
- [x] Same-row-count content mutation regression is present in Reboot-OS PR #35 (`test/canon-public.test.mjs`); current exact-head server suite passed 147/147. The test alters BANDS content without changing row count and expects fail-closed 404.
- [x] Current PR #35 server tests exercise the frozen runtime allowlist and fail-closed fingerprint reads; the exact-head server suite passed 147/147. Semantic/source-authority classification is separate and remains open.
- [ ] Confirm the protected vault remains private across list and table routes, including manifest tampering and new-table attempts. Eight proposed/unresolved/vault-labeled source entries are now excluded from public routes; preserve these negative tests. The protected `/canon_vault.sqlite` Library artifact was found and passed read-only integrity_check (ok) and foreign_key_check (0 violations) on 13 October; it is separate from runtime canon and remains unimported. The other 119 allowlisted entries still need source-authority review.
- [ ] Review migrations 0016–0018 for ordering, grants, RLS, rollback and cross-repo compatibility.
- [ ] Do not apply migrations to production or import the protected vault without explicit approval.
Cross-review: C reviews catalog freeze/issuance SQL; G reviews public endpoint behavior; independent review confirms no fingerprint algorithm was guessed.

## Block F — Cloudflare build and service target

**Current evidence, 13 October 2026 UTC:** the uploaded build `0b27be84-ebb9-4d97-b20b-eba999fdcebc` executed `npx wrangler preview` and failed because the Wrangler config had no `previews` block. The later Cloudflare settings screenshot shows `npx wrangler deploy`, root directory `/`, and no build command, so the screenshot is a different settings snapshot from the failed run. The current source config names the backend Worker `atuned-api` in `atuned/server/wrangler.toml`; the dashboard/build service named `atuned-os` is a separate target. Reboot-OS PR #35 read-only health probes reported `atuned-api /v1/health = HTTP 200`, `atuned-os /v1/health = HTTP 404`.

**Additional P0 collision risk:** MOB `.github/workflows/deploy.yml` and Reboot-OS `.github/workflows/web.yml` both publish distinct root website outputs to Pages project `atuned`, branch `main`. Account bindings must be confirmed, but the repository-level configuration permits one deploy to replace the other. Do not publish again until a single production publisher is designated and the API/domain bindings are verified.

Acceptance:
- [ ] Confirm intended Worker/service in authenticated Cloudflare.
- [ ] Confirm repository binding, production branch, preview rules, root directory, deploy command, asset configuration, permissions, and required secrets.
- [ ] Resolve the duplicate Pages publisher: designate one production owner for project `atuned` and branch `main`; verify the actual Cloudflare account/project binding for both repositories.
- [ ] Confirm the intended root route is the funnel and the app is available at its approved named path; ensure one deployment cannot accidentally replace the other product entrypoint.
- [ ] Confirm Reboot-OS Pages repository variable `ATUNED_API` points to the intended HTTPS origin for `atuned-api` and matches the browser CSP/CORS settings.
- [ ] Classify `atuned-os` as a static app/preview/production service and document its intended domain, root, repository, and branch. Do not assume it is the API.
- [ ] If `atuned-api` is the intended backend, validate root `atuned/server` and `npm run deploy` with a controlled, non-production build first.
- [ ] Do not add a `previews` block merely to silence the failed command.
- [ ] Re-run the external check and verify intended host output and `/v1/health` only after service ownership and branch rules are confirmed.
- [ ] No production deploy, migration, or data mutation until explicitly authorized.

Cross-review: A checks exact-head and deployment evidence; G validates app/API route contracts and health; independent reviewer verifies Pages publisher uniqueness and no accidental root overwrite.

## Block G — Cross-repository contract and regression review
Acceptance:
- [ ] Compare API payloads, gift snapshot fields, channel names, track identities, schema/migration assumptions, persistence and error handling across MOB and Reboot-OS.
- [ ] Execute tests for happy path, missing bank, invalid nature, duplicate/replay, content mutation, reload, transient remote failure and wrong-service deployment.
- [ ] Check exact-head test totals and floors from live output; never lower floors to pass.
- [ ] File concrete defects against the owning block, patch them, and repeat cross-review.
- [ ] Report only verified acceptance evidence.
Cross-review: All block owners supply artifacts; G is not allowed to waive unresolved safety or approval gates.

## Block H — Closure, release review and handoff
Acceptance:
- [ ] Reconcile every P0 criterion against evidence on exact current SHAs.
- [ ] All required tests and independent reviews are complete.
- [ ] Every blocker has an owner/action/evidence; no hidden or “to be discovered later” P0 item.
- [ ] Update master index, implementation audit, execution log, executive handshake and next-thread handshake.
- [ ] Package all handshake documents into one ZIP and verify the archive contents/path before linking it.
- [ ] Keep PRs draft/unmerged and production untouched absent explicit owner approval.
- [ ] Declare P0 closed only when all P0 acceptance criteria pass; otherwise report the exact blocked criterion.

## Latest live exact-head checkpoint

**Historical exact-head checkpoint — 12 October 2026, 18:43 PDT.** Superseded by the 13 October refresh in ATUNED_MASTER_INDEX.md and ATUNED_ARCHITECTURE_REVIEW_2026-10-13.md; use this only as historical context.
- MOB PR #69: head `bfc5108f5b32f071006f7af4facefc61ab6189f0`; workflow [#38322940378](https://github.com/rebootos-sourcce/MOB/actions/runs/38322940378) completed successfully. This documentation update creates a newer head and requires its own exact-head workflow.
- MOB PR #66: head `fc7033fb24ec9ed94e2f63563e723b82603b2e68`; workflow [#38322094250](https://github.com/rebootos-sourcce/MOB/actions/runs/38322094250) completed successfully. This is repository CI, not gift approval or current-release persistence proof.
- Reboot-OS PR #35: head `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`; exact-head server suite passed 147/147 and both smoke workflows passed (runs #38333447700, #38333450875, #38333447634). The external Cloudflare check remains failed.
- External Cloudflare: build `0b27be84-ebb9-4d97-b20b-eba999fdcebc` failed. The first error is now known: Cloudflare ran `npx wrangler preview`, and Wrangler reported a missing `previews` block. Later settings show `npx wrangler deploy`, so confirm current config and intended target rather than retrying the old command.
- Public canon: 119 entries remain in the draft public allowlist; 8 manifest entries are excluded from public routes pending authority/status review: `INFERRED`, `SPLITPROP`, `SPLITASK`, `LADDERASK`, `DICTSTRUCT`, `ARCH12`, `LAWSX`, and `RARE`. Their source records are preserved. Do not infer that all 119 remaining entries have owner approval.
- Gift bank: six gift natures remain separate from starting ground. Stable product IDs = 0; owner-approved rows = 0; selected manifest members = 0/560. The six-channel to four-track mapping and persisted browser → Worker → Supabase journey remain open.
- Site architecture: two repository workflows publish different root bundles to Pages project `atuned`, branch `main`. Treat as a P0 publishing-collision risk until one publisher is designated and account bindings are checked.

P0 remains open. No release or production action is authorized.

## Execution log
Append a dated cycle record here after each build/review pass: exact SHA(s), changes, tests, independent reviewer/findings, gaps opened/closed, and next block executed.


## Execution cycle — 13 October 2026 (recursive gap review)
**Cycle result: P0 remains OPEN.** This entry supersedes older checkpoint statements where exact heads or workflow runs differ; refresh the live branch and check state again before any merge.

### Refreshed source-of-truth work
- Master index: `ATUNED_MASTER_INDEX.md` on `docs/atuned-master-index-20261012`; source file blob before this cycle: `0066817066c67c674a7abf61cfebf31fce7f1c61`.
- P0 board: `ATUNED_P0_EXECUTION_CONTROL_BOARD.md`; source file blob before this cycle: `777fb87c1b978af9c1ab0affc224c9640b7f4fbf`.
- Current P0 evidence still identifies the Pages publishing collision: MOB `.github/workflows/deploy.yml` and Reboot-OS `.github/workflows/web.yml` both can publish different output trees to Pages project `atuned`, branch `main`.
- MOB is the previously documented proven publisher, but authenticated Cloudflare account/domain/service binding still requires an operator with dashboard access. Do not publish as a way to discover ownership.
- Worker configuration calls the API Worker `atuned-api`; the separate Cloudflare service `atuned-os` and its build command remain unresolved. A previous build ran `npx wrangler preview` and failed because `previews` was missing; a later settings snapshot showed `npx wrangler deploy`. These are conflicting configuration observations, not proof of repair.
- Persisted browser → intended Worker → storage write/read/reload remains 0/1 independently verified.
- Gift bank remains blocked on source/owner approval: 560 review rows, 0 stable approved IDs, 0 selected manifest members, no active manifest. Six server gift-nature channels to four client meter tracks remains unverified.
- KPI framework added to the canonical docs branch; see `ATUNED_MVP_ALPHA_KPI_FRAMEWORK_2026-10-13.md`. Targets are proposed unless explicitly marked as a hard safety/data-integrity gate.

### Executed / next safe actions
1. Add KPI framework and explicit OPEN/UNVERIFIED state to the master index.
2. Preserve the exact blockers in the P0 board and tie each to an acceptance test and external dependency.
3. Open a reviewable change to disable the duplicate Reboot-OS Pages publisher while preserving build/artifact validation; do not merge it or deploy without review and owner approval.
4. Run exact-head checks after documentation/workflow changes and record the result.
5. For persistence and gift approval, proceed only with non-production test fixtures and owner-approved catalog data. Do not infer approvals, fabricate IDs, activate gifts, run production migrations, or mutate production data.

### P0 exit decision
P0 may be declared complete only after: one publisher and authenticated route mapping are verified; current-release persistence is independently proven; the six-to-four mapping and approved frozen gift manifests pass; consent/user agency/deletion/accessibility gates have evidence; and no critical Sev-0/Sev-1 issue remains. Any gate not supported by current exact-head evidence stays OPEN/BLOCKED/UNVERIFIED. This cycle does not claim P0 completion.


## Recursive execution cycle — 13 October 2026, 12:13 PDT

- [Cycle report](ATUNED_P0_RECURSIVE_EXECUTION_CYCLE_2026-10-13_1213PDT.md) records fresh PR #70/#38 findings and confirms current blockers.
- Exact-head workflow #38452748917 was queued at query time; this documentation change and the new index/board commits require fresh checks.
- No code was merged, deployed, or changed in production. P0 remains open pending current-release persistence E2E, Cloudflare ownership/configuration, approved gift manifests, six-to-four mapping, migration/privacy review, and exact-head acceptance evidence.
