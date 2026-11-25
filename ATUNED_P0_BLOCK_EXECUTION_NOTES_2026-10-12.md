# ATUNED P0 Block Execution Notes
**Date:** 2026-10-12  
**State:** Open work plan; not evidence that any open block has passed.

## Operating model
All workstreams share one control board. Parallelize independent discovery and implementation. Integration changes must be serialized where they touch the same files or branch. Every block has an owner workstream, a cross-review workstream, acceptance evidence, and explicit exit criteria. A newly discovered gap is added as a subtask with dependency and severity; it does not erase prior progress.

## Block A — Build control and evidence ledger
**Goal:** Eliminate stale or conflicting status claims.
1. Read the master index, control board, audit, and latest handoffs.
2. Fetch exact heads, merge-base/base refs, draft/open/merged state, and checks for MOB #69/#66 and Reboot-OS #35.
3. Reconcile issue #48, issue #58, and Reboot-OS issue #37 with repository evidence.
4. Add each acceptance criterion, dependency, test URL, commit SHA, owner, and cross-reviewer to the same board.
5. Mark historical results as historical until confirmed on current heads.
**Cross-review:** Release/documentation reviewer compares the ledger to GitHub state.
**Exit:** One internally consistent, timestamped ledger; every claim has a source.

## Block B — Source recovery and six gift banks
**Goal:** Produce six distinct, traceable, fixed banks of exactly 100 approved patterns, one for each documented gift nature.
1. Search Library/source compilation for *The Mechanics of Being* appendix recipes, *The Attuned*, and related Libraries.
2. Preserve source title/version, appendix/section/page or stable locator, exact source text, extraction method, and any editorial normalization.
3. Reconcile the source queue (previously reported as 560 rows) against existing catalog entries; deduplicate without deleting provenance.
4. Define deterministic candidate IDs from stable source identity plus source locator/text fingerprint. Keep candidate IDs distinct from approval status.
5. Validate sentence boundaries and recipe completeness; record ambiguities rather than inventing text.
6. Classify each candidate to a gift nature only where the source and existing decisions support it. Keep unresolved rows in a review queue.
7. Check exact uniqueness, count, source traceability, and category membership for each 100-item candidate bank.
8. Obtain the required approval for final immutable bank membership; until then readiness/issuance remains false.
**Cross-review:** Canon/data reviewer checks provenance, duplicates, stable IDs, and reproducibility; product/content reviewer checks category mapping.
**Exit:** Six immutable bank manifests with exactly 100 unique source-backed approved IDs each, validation report, and approval evidence. No synthetic filler.

## Block C — Gift backend and immutable snapshot
**Goal:** Make the server the authority for eligible gift snapshots and issuance.
1. Trace current schema, migrations, issuance route, frozen-set manifest, nature mapping, usage accounting, idempotency, and failure handling.
2. Write contract tests for missing bank, wrong count, duplicate ID, wrong nature, altered content, replayed request, and partial failure.
3. Verify snapshot identity/version, item ordering, content, and consumed status are persisted consistently.
4. Ensure invalid or unapproved sets fail closed and no gift can issue before bank readiness.
5. Review transaction boundaries and concurrency/race behavior; use `Promise.allSettled` only where independent operations should continue and partial outcomes are explicitly handled.
6. Test migration compatibility without applying production migrations.
**Cross-review:** Client reviewer checks payload compatibility; data reviewer checks transactionality and persistence.
**Exit:** Focused and full tests pass on exact head; contract document matches actual API; invalid bank cannot issue.

## Block D — Client snapshot, meter, and reload journey
**Goal:** Align server-issued snapshot with the browser's four-track meter and preserve it across reload.
1. Trace client request/response types, gift nature, six-channel to four-track mapping, ordering, usage meter, and error states.
2. Establish one documented deterministic mapping; reject unknown/missing values rather than silently coercing.
3. Ensure client does not independently invent or mutate server-authoritative gift contents.
4. Test initial render, refresh, empty state, duplicate delivery, retry, offline/error, and reload recovery.
5. Verify idempotent usage and no double consumption on retry or refresh.
6. In a disposable non-production environment, execute browser → Worker → Supabase create/write/read/reload/readback and capture identifiers plus redacted evidence.
**Cross-review:** Backend reviewer validates the client assumptions against server schema and actual responses.
**Exit:** Contract tests and end-to-end evidence pass; same snapshot identity, item order, and usage state survive readback/reload.

## Block E — Canon integrity and public-route safety
**Goal:** Detect unapproved or altered table content, including same-row-count changes.
1. Find the actual canonicalization/fingerprint generator in current code and repository history; document byte/row ordering, field selection, encoding, and hash algorithm.
2. Reproduce the current manifest fingerprint from known fixtures before changing runtime behavior.
3. Add tests for same-row-count content mutation, row insertion/deletion, reorder if ordering is semantically meaningful, missing manifest, stale manifest, and blocked/unreviewed tables.
4. Implement the smallest compatible read-time verification. Keep failure closed and avoid exposing protected source data.
5. Run focused canon tests, all server tests, and exact-head CI.
6. Have a second reviewer independently verify that test fixtures would fail on the pre-fix implementation.
**Cross-review:** Data/catalog workstream reviews canonicalization; security reviewer checks leakage and fail-closed behavior.
**Exit:** Reproduction test establishes compatibility; mutation regression fails before and passes after fix; full suite and exact-head checks pass.

## Block F — Cloudflare build and runtime target
**Goal:** Resolve the external build failure based on actual evidence.
1. Capture current external check name, target Worker, build root, commit, and first failing step from authenticated dashboard/log output.
2. Compare the failing build's commit and target to `atuned/server/wrangler.toml`, `package.json`, Worker entry point, and deployment workflow.
3. Determine whether `atuned-api` versus `atuned-os` is a naming mismatch, stale check, or real target mismatch.
4. Make only an evidence-supported configuration or workflow change.
5. Run local build/tests, then the external check on the resulting exact commit.
6. Verify health and canon routes only in the intended non-production environment unless a separate release approval permits production checks.
**Cross-review:** Release engineer compares dashboard evidence with repository configuration.
**Exit:** Actual failure cause recorded, corrected build target passes, and health check is verified. No guessed setting changes.

## Block G — Cross-repository integration
**Goal:** Prove MOB/client and Reboot-OS/server agree on contracts.
1. Compare API shapes, schema/migrations, source identity, gift snapshot, usage, auth/identity boundary, and errors.
2. Verify the missing `source_service.SourceService` integration and trusted identity boundary noted in the previous audit.
3. Add contract fixtures that can be consumed by both client and server tests.
4. Run tests on each exact head and document compatible commit pairs.
5. Resolve findings or mark them with the precise external dependency and impact.
**Cross-review:** Client and server reviewers swap reviews; neither workstream self-approves its contract.
**Exit:** No unexplained contract mismatch; integration tests pass on recorded compatible heads.

## Block H — Release gate, documentation, and verified ZIP
**Goal:** Create an auditable P0 handoff and prevent premature closure.
1. Recompute acceptance status from blocks A–G; do not infer closure from green CI alone.
2. Refresh master index, control board, implementation audit, execution log, and both handshakes.
3. Include exact commit SHAs, CI URLs, test commands/results, non-production evidence, unresolved blockers, and owner-only approvals.
4. Create one ZIP containing all required handoff and supporting audit/decision documents.
5. List archive contents and test ZIP integrity; confirm no credentials, secrets, protected vault data, or production dumps are included.
6. Verify that links resolve and all documents refer to the same current branch/commit state.
**Cross-review:** A reviewer who did not assemble the archive verifies contents and consistency.
**Exit:** ZIP integrity passes; contents and current statuses are independently checked; P0 acceptance is evidence-backed.

## Dependency graph
- A starts immediately and remains the source of truth.
- B can run independently with source discovery; final bank freeze depends on content approval.
- C can proceed on contract tests and fail-closed behavior while B is in progress; final issuance readiness depends on B.
- D can implement deterministic mapping and client tests while C proceeds; end-to-end proof depends on a compatible backend and disposable environment.
- E can proceed independently; final verification depends on recovering the established fingerprint contract.
- F can gather evidence independently; a fix depends on authenticated first-error evidence.
- G continuously cross-reviews C, D, E, and F.
- H documents continuously but final ZIP/closure follows verified current results.

## Stop conditions versus continue conditions
Continue all independent authorized work when a block is waiting. Stop only the specific action that requires unavailable credentials, owner approval, source ambiguity, or production authorization. Do not stop the overall build loop. Never mark an unresolved external dependency as passed.

## Completion record template
- Block / criterion:
- Branch + exact commit:
- Change:
- Focused tests:
- Full tests / CI:
- Cross-reviewer + findings:
- Evidence links:
- Remaining gap:
- Status: PASS / OPEN / BLOCKED / OWNER APPROVAL
