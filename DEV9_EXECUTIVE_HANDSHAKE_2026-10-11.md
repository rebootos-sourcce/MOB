# ATÜNED / MOB Alpha
# Dev 9 Executive Handshake and P0 Continuation Plan

**Prepared:** 11 October 2026 UTC / 10 October 2026 Pacific Time  
**Evidence snapshot:** GitHub and source records checked through the latest retrieved updates, including MOB PR #59 and Reboot-OS PR #35.  
**Purpose:** Give the next development thread the current project state, verified acceptance evidence, role assignments, blockers, exact execution order, release boundaries, and required proof without repeating broad discovery.

## 0. Read this first

**The integrated P0-A/B/C candidate is validated, but has not been merged to `main` or deployed. A separate catalog issue, MOB #58, remains labelled P0 and Alpha-blocking. Do not report all P0s complete.**

The active integration candidate is [MOB PR #59](https://github.com/rebootos-sourcce/MOB/pull/59), head SHA `59a91176df50cfe9db81924c4463762a81886fbb`. The latest recorded full required run for that exact SHA is [MOB Actions run 38111452439](https://github.com/rebootos-sourcce/MOB/actions/runs/38111452439). All 31 workflow jobs completed; required `gates-pass` succeeded; Alpha journey passed 61 tests, with 0 failures and 0 expected-red. PR #59 remains open, unmerged, and mergeable.

The other P0 is [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58): build and approve a canonical, versioned sentence inventory, then freeze an exact 100-pattern starter gift. The infrastructure and validation contract is in progress in [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), but the production manifest has no owner-approved IDs, and the PR remains draft and unmerged.

**Immediate operating posture**

1. Do not restart generic discovery or repeat the Dev 1 to Dev 9 research. Use this as the continuation anchor and update facts only when the repository state has changed.
2. Keep the integrated PR #59 as the only merge candidate for MOB P0-A/B/C. Do not merge #56 or #57 separately ahead of it.
3. Do not merge #59 or trigger production deployment without the owner's explicit go/no-go approval because merging to `main` can run the production deployment workflow.
4. Keep issue #58 as an open P0 until the item inventory, product rule, approved exact 100 IDs, migration, and readback acceptance are proven. Do not infer that the three green P0 tracks close this separate blocker.
5. Keep profile sync off, paid billing off, and production starter-gift issuance disabled until their respective decisions and proofs are complete.
6. Preserve current scope: browser app plus Worker integration. Android/iOS builds and aggregate Sniffer-to-Mirror-to-Release-to-Verification-to-Trace integration are not Alpha blockers; those were explicitly deferred.

## 1. Product goal and production boundaries

Alpha must support a truthful, durable first-use path from an imported quiz result through the first release. Required behavior includes safe anonymous funnel continuity, local-first profile/story data, saved release state and history, honest error handling, and gates that block release if core acceptance behavior is broken.

### Product and data rules that are already settled

- One pattern is one sentence. A release execution is that sentence delivered at an address through one channel. An address/card, a source run, a fetter label, a line index, and a final user-facing pattern ID are not interchangeable identities.
- Six channels are canonical: `believing`, `perceiving`, `thinking`, `behaving`, `acting`, and `feeling`. The `Say` source verb maps to the source taxonomy's cluster layer but is not a seventh release channel.
- New unique ground consumes allowance. Rerunning already-opened ground is free.
- User stories and the local profile stay local. The anonymous funnel may transmit only the approved random identifier, selected starting ground/topic, and journey completion checkpoints. Do not transmit story text, name, birth details, or the entire profile to solve analytics.
- Profile sync remains disabled by default and must not be enabled without owner approval, explicit consent UX, a retention policy, and matching privacy copy.
- Stripe checkout remains closed by default until production secret, price IDs, webhook, portal, and live acceptance are verified. The present `STRIPE_BILLING_ENABLED` switch is `0`.
- A gift is not ready because a row says `granted = 100`. Readiness requires a frozen manifest of exactly 100 unique stable pattern IDs, catalog/set versions and hashes, all 100 item rows, ownership/transfer state, and successful readback.
- Do not select the first 100 available IDs. Do not treat 114 fetter records, a card count, a generated line count, or synthetic test fixtures as proof of an approved 100-sentence gift.
- Do not hand-edit generated HTML or bundles. Change canonical source and build from source.
- Unfinished legal/privacy/consumer-health drafts must not be published or linked as final copy. Owner and counsel must settle the unresolved statements first.

## 2. Repository state and source of truth

| Repository | Role | Last verified main SHA in the handoff record | Current rule |
|---|---|---|---|
| [MOB](https://github.com/rebootos-sourcce/MOB) | Canonical browser source, engine, app/funnel build, browser tests and production Pages publisher | `1c9811978834b1017ad9ca24199949aaddb0c5ee` | `atuned_src/` is canonical. Build artifacts from source. MOB is the proven publisher for `atuned.world`. |
| [Reboot-OS](https://github.com/rebootos-sourcce/Reboot-OS) | Worker/API, Supabase migrations, identity, storage, entitlement, voice and server tests | `40ba888508de76c2dcfa0d7851fbdd29b38d0b3e` | Do not duplicate the engine in the Worker. Server is the transport/identity/storage boundary. |

The SHA values in the table are the last recorded verified main baselines, not a substitute for refreshing main before any new patch or merge. Recheck current `main` SHA, open PR head/base SHA, review state, and required CI before writing code.

### Important paths

**MOB**

- `DECISIONS.md`: product rulings. Current source retrieved at `723094e40ef311d319980c0cee73e8f60ca47acc`.
- `CLAUDE.md`: build, test, manifest/load order and generated-artifact rules. Current source retrieved at `dd01cba3dc779a17b5acc9b48f8898fdded07a98`.
- `.github/workflows/deploy.yml`: canonical production Pages workflow.
- `atuned_src/MANIFEST`, `atuned_src/BUILD.sh`, `atuned_src/BUILD-engine.sh`.
- `atuned_src/engine/schema.js`, `atuned_src/engine/plan.js`, `atuned_src/engine/data/cards.js`, `atuned_src/engine/data/catalog.js`.
- `atuned_src/ui/auth.js`, `atuned_src/ui/release.js`, `atuned_src/ui/storyui.js`, `atuned_src/ui/panels.js`, `atuned_src/ui/ui.js`, `atuned_src/engine/export.js`.
- `tests/engine.js`, `tests/golden.js`, `tests/firstrelease.js`, `tests/release-screen.js`, `tests/functional.js`, `tests/floors.json`, `tools/workflow-lint.py`.
- `DEV7-ALPHA-P0-P1-EXECUTION-2026-10-10.md` on the P0 candidate branch.
- Shared backlog: [MOB issue #48](https://github.com/rebootos-sourcce/MOB/issues/48).

**Reboot-OS**

- `atuned/server/src/funnel.js`, `atuned/server/src/index.js`, `atuned/server/src/d1shim.js` and related service routes.
- `atuned/server/test/firstvisit.test.mjs`; `atuned/server/test/pg.mjs` for real-Postgres migration-backed tests.
- `atuned/server/supabase/0015_*.sql`, `0016_post_delete_retention.sql`, `0017_frozen_starter_pattern_sets.sql` on PR #35's branch.
- `atuned/data/pattern_data.json`, `atuned/data/canon_tables/LETGO.json`, `atuned/data/canon_tables/LETGO_LAYER.json`, `LETGO_CHAN.json`, `NODEREG.json`.
- `atuned/data/letgo/letgo_2026.json`, `letgo_pdf_a.json`, `letgo_pdf_b.json`, `letgo_join.json`, `letgo_fetter_join.json`, `FETTER_CORPUS_MAP.json`, `letgo_cards.json`.
- Evidence inventory on PR #35: `atuned/docs/release-pattern-source-inventory-2026-10-10.md`.
- Candidate crosswalk on PR #35: `atuned/docs/release-pattern-candidate-crosswalk-2026-10-10.json`.
- `.github/workflows/server.yml`: Worker test/deploy and production service-key checks.
- `.github/workflows/web.yml`: alternate packaged Pages workflow; currently shares a `Pages` project name with MOB and previously failed authentication.

## 3. P0 acceptance status and exact evidence

### P0-C: Atomic release and history persistence

**State: validated on the integrated candidate, not merged.**

The change introduces the shared `pSaveSnap()` commit path so profile state and the required release-history snapshot are persisted together. Failed writes must roll back the staged snapshot and preserve prior durable/in-memory state. A failed write cannot trigger a server first-release checkpoint, mark ritual completion, or ask the follow-up question as if the release were saved.

Regression coverage described in the handoff includes corrupt writes, partial-write exceptions, rollback, missing prior keys, and reporting rollback failure. Standalone historical run: [38107104818](https://github.com/rebootos-sourcce/MOB/actions/runs/38107104818) on the #57 branch head. Final acceptance must use the integrated #59 head and its current gates, not the older standalone run.

PR: [MOB #57](https://github.com/rebootos-sourcce/MOB/pull/57), head at the last PR check `d040f3fdd33675439190bdbe99e9c5ad50765543`, open and draft. Do not merge separately from #59.

### P0-B: Quiz-import first-visit session and privacy

**State: validated on the integrated candidate, not merged.**

The browser now creates an anonymous first-visit session only after a quiz-imported record has been accepted. The arrival assertion becomes required. Session credentials are stored with failure/retry behavior; a failed network request must not break the local reading. Story/profile content remains on-device.

Known residual follow-up: starts coalesce within one page, but multiple tabs are not serialized; if a create response is lost and a retry creates a new session, duplicate anonymous telemetry can occur. Keep this bounded and do not add a migration or send identity/story data as a shortcut. Decide whether the accepted Alpha journey requires cross-tab idempotency; if included in the current release contract, add a focused regression on the integrated branch.

PR: [MOB #56](https://github.com/rebootos-sourcce/MOB/pull/56), head at the last PR check `cb3fa5aef537246964758c6bce32aea6cadb27e5`, open and unmerged. Do not merge separately from #59.

### P0-A: Alpha-required acceptance gates

**State: required candidate gates validated.**

The required Alpha gate is blocking and cannot accept expected-red results. Run `38107187227` measured 61 passes, 0 failures and 0 expected-red; the floor was raised from 56 to 61 and committed with the gate change. The full integrated run [38111452439](https://github.com/rebootos-sourcce/MOB/actions/runs/38111452439) repeated the Alpha journey at 61/0/0 on the new exact candidate SHA. The `gates-pass` aggregator succeeded and all 31 jobs completed.

| Suite/gate on integrated candidate | Reported result | Interpretation |
|---|---:|---|
| Alpha journey | 61 passed, 0 failed, 0 expected-red; floor 61 | Required acceptance PASS |
| Functional browser suite | 2,622 passed, 0 failed; floor 2,317 | Required suite PASS |
| Engine | 5,038 passed, 0 failed, 10 allowed expected-red; floor 5,002, ceiling 10 | PASS within existing expected-red ceiling |
| Funnel package | 44 passed, 0 failed | PASS |
| Storage, first-release, reload journey, onboarding, release screen | Required browser jobs passed | PASS |
| Boot, collide, funnel, design, monitor, voice | Required browser jobs passed | PASS |
| `gates-pass` | success | Required aggregator PASS |
| `gates-report (copy)` | 147 vs floor 149; 0 explicit assertion failures | Report-only coverage/setup issue, not part of required aggregator |

The copy-test report failed to capture the delete-confirm dialog at 1600px and 390px. Leave the floor at 149. Repair the test setup and prove it against a known-good and known-bad implementation. Do not relabel it as a required P0 failure or a passing report-only test.

PR: [MOB #59](https://github.com/rebootos-sourcce/MOB/pull/59), head `59a91176df50cfe9db81924c4463762a81886fbb`, base `main` at `1c9811978834b1017ad9ca24199949aaddb0c5ee`; open, mergeable, unmerged, last update recorded 11 October 2026 04:44 UTC.

### The other open P0: issue #58, canonical inventory and starter gift

**State: OPEN / alpha-blocker. Do not report all P0s closed.**

[MOB #58](https://github.com/rebootos-sourcce/MOB/issues/58) requires a canonical sentence inventory with stable pattern IDs, catalog version/content hashes, and a frozen exact 100-item starter gift. PR #35 establishes technical support for a catalog and immutable sets; it does not supply approved production content.

Current source crosswalk facts from the latest checked PR #35 branch:

- 239 indexed clean-index nodes; 150 candidate rows in `LETGO.json`.
- 150/150 candidate rows match clean-index node ID and exact title.
- 143 candidates have explicit linked source runs; 7 have no explicit source run in the three reviewed corpora.
- 55 candidate nodes have multiple source runs.
- 43 rows have no source kind or verb.
- 13 rows use `Say`, which maps to the source taxonomy's cluster layer but not to a seventh release channel.
- 0 owner-approved candidate IDs. No production manifest is created or activated.
- Source-run ID, index-node ID, canonical fetter ID, and final user-facing pattern ID are separate namespaces. Numeric equality is not a valid join.
- Source text may contain multiple sentences, repeat material, and transcription artifacts. It is not automatically a completed one-sentence/one-channel release or reframe record.
- Left/right, release/reframe, exact six-channel semantics, source provenance, and final membership must be traceable at sentence level.

Earlier funnel design TDDs (1 October and 4 October) specify a personalized gift that maps the selected starting ground to a curated set of 100 patterns. The latest `DECISIONS.md` confirms the 100-pattern promise and one-sentence pattern semantics but does not itself settle the final inventory, the source-run splitting rule, or the exact approved membership. Keep ground-specific selection as prior product intent, not as permission to generate missing sentences or activate a set without the final decision and evidence.

[Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35) adds a versioned release-pattern catalog, stable-ID fields, content hashes, a set hash, immutable frozen membership, gift item snapshots, readback checks, and tests with synthetic 100-ID fixtures. The current head retrieved at 11 October 2026 06:03 UTC is `6f1f96c9dfd33de1d1914efa4136ce162c4b28f8`. PR #35 is draft, open, and targets `alpha/p1-account-retention-24-months-20261010`, not `main`; its base dependency must be reconciled before any merge. The production manifest remains absent, and migration `0017_frozen_starter_pattern_sets.sql` has not been applied to the live database by this work.

**Acceptance for issue #58:**

1. Source inventory and source-run-to-sentence crosswalk are checked; ambiguous mappings remain unresolved instead of guessed.
2. The user-facing pattern unit is explicitly one sentence, with stable ID independent of array position, address order, and text duplication across other contexts.
3. Each approved sentence has source provenance, catalog version, channel, side, phase, source key and a validated content hash.
4. The owner has approved the exact selection rule and exact 100 stable item IDs. Earlier TDDs indicate ground-specific selection; confirm or explicitly override this rule.
5. Migration and database tests prove catalog immutability, exactly 100 unique IDs in positions 0..99, stable order and hashes, one active frozen set, and fail-closed behavior when no approved set exists.
6. Issuance, retry, concurrent attach, account transfer and readback preserve one gift, its exact set, and idempotent accounting. No user story/name/profile data crosses the boundary.
7. A real migration-backed test passes; production migration/deploy status is independently recorded. Synthetic test IDs are never active production data.

### Owner decision for the catalog P0

The next thread should continue provenance and mapping work immediately, but must not fabricate a production manifest. The product decision to obtain is: **confirm the earlier TDD behavior that the 100-item gift is selected from approved catalog entries for the user's chosen starting ground, or explicitly override it to one identical set for every user.** Then obtain approval of the exact 100 IDs after the source-level rows are reviewable. If either the one-sentence pattern interpretation or selection semantics differ from the current six-channel contract, pause only that dependent implementation and continue independent validation work.

## 4. P0 integration and production release gate

### Review state

The Dev 9 handoff records two distinct source-level gap-review passes on #59. Must-fix findings were patched and regression-tested before the final matrix. No unresolved GitHub review threads were found. **No separate human GitHub review approval was recorded**, so do not describe the two internal review passes as human sign-off.

### Owner release decision

The next thread must refresh #59 status and run evidence, then obtain an explicit owner decision before merge because `main` merge can trigger the gated deployment. The merge/deploy sequence is:

1. Refresh main SHA, PR #59 head/base SHA, required check status and run 38111452439. If the head has changed, invalidate the old exact-SHA evidence and rerun the required matrix on the new head.
2. Confirm all P0-A/B/C changes are contained in the integrated candidate. Do not merge #56 or #57 individually first.
3. Ask the owner for a direct go/no-go decision on merging #59 to `main`, knowing the gated production workflow can run. Keep production held unless explicitly approved.
4. If approved, merge #59 only after all current required checks and merge criteria pass. Record the actual merge SHA, main-branch gate results, source build SHA, migration state and deployment SHA separately.
5. Verify the deployed application at `https://atuned.world` in a real browser. Confirm the production readback corresponds to the new source SHA. A successful workflow named `deploy` on a PR head alone is not production evidence.
6. Confirm #56 and #57 changes are in the merge tree. Only then close duplicate support PRs and update issue #48 / this handshake.
7. If approval is withheld, leave PR #59 open, retain all evidence, and continue independent catalog source work and non-production checks.

### Bounded residual risks from P0-A/B/C

- **Cross-tab anonymous session creation:** same-page starts coalesce, but separate tabs can still create duplicate anonymous telemetry sessions if a response is lost before retry. The payload remains minimized; this is a bounded follow-up unless the product owner includes it in the current Alpha acceptance contract.
- **Delete-confirm copy test:** report-only is 147 against floor 149. Fix the setup and retain the existing floor.
- **Owner merge decision:** unresolved in the executive handoff. No merge or production deploy was performed as part of this continuation.
- **The starter-set P0:** separate from #59 and still open. It must not be mistaken for a P1 merely because its infrastructure PR has a P1 title.

## 5. Functional seats: assignments for the next pass

These are coordinated role seats, not claims that 13 persistent autonomous agents are continuously executing. Work is coordinated through the shared backlog, branch/PR evidence, cross-review and acceptance records. The PM reconciles outputs and keeps one priority order.

| Seat | Primary assignment now | Cross-review / required output |
|---|---|---|
| 0. Project Manager / Release Strategist | Own the single ordered backlog; reconcile issue #48, #58, PR #59 and both repo queues; maintain owner questions and release go/no-go. | No P0 closes without evidence; no production merge by implication. Provide one current tracker with dependencies, acceptance and exact SHAs. |
| 1. Foundation Architect / Source-of-Truth Steward | Continue the pattern identity/data-contract map across browser profile v2, Worker `atuned.user` v1, canonical catalog, gift assignment, release event, verification and derived counters. | Align Engine, Worker and Data Steward. No duplicate source of truth or silent schema reinterpretation. |
| 2. Full Suite A / Engine, Parser and Domain | Validate one-sentence pattern identity versus execution key; inspect channel/pole/phase semantics, meter behavior, release/reframe and import state. | Add deterministic fixtures and regression tests. Work only from canonical source and build outputs. |
| 3. Full Suite B / Browser UI, State and Journey | Keep P0-A/B/C behavior verified: accepted quiz import, session start/reload/failure, release save/history, duplicate action and user-visible error states. Review cross-tab start behavior. | UI and state must match durable readback. Do not show success after a partial write. |
| 4. Full Suite C / Worker, Storage, Auth, Billing and Voice | Validate server gift authority and fail-closed status, session create/read/attach/checkpoint, gift transfer and idempotency. Keep billing closed and voice Worker-backed. | Tests for duplicate/racing requests, invalid IDs/version/hash, expiry, account ownership and deletion. Do not apply live migrations without the required release authorization. |
| 5. Security and Privacy | Inspect network payloads for quiz entry and gift issuance; verify story/name/birth/profile data stay local; review ownership/credential handling, deletion and retention. | Negative controls, data-flow record, no secrets in logs, no profile-sync enablement without explicit policy/consent. |
| 6. QA and Release Evidence | Maintain the exact candidate test ledger; fix report-only copy setup; prove alpha required gate blocks on deliberate bad cases; run migration-backed gift tests when applicable. | Must preserve floors, expected-red ceilings, and skipped/cancelled failures. Exact SHA and command results on every closeout. |
| 7. Infrastructure / Cloudflare | Refresh both repo workflows and publishing ownership. Keep MOB as canonical publisher unless owner explicitly decides otherwise. Diagnose the external Worker build check. | Separate Worker server test, MOB Pages deploy, alternate Pages workflow and external Cloudflare signal. Capture source/deploy SHA. Never bypass a red external check. |
| 8. UI/UX | Audit all accepted journey controls at 390px and 1600px, especially loading, failure/retry and delete-confirm. Do not redesign around missing catalog behavior. | Working effect, accessible focus/target, and screenshot/test evidence for reachable Alpha surfaces. |
| 9. Creative Director | Preserve discover → play → flow → embody and the distinction between the person's own language and system suggestions. | Validate declined/unknown/error states without pressure or unsupported claims. Do not add post-Alpha features. |
| 10. Art Director / Visual Systems | Check hierarchy, legibility, responsive layout, focus and reduced motion on the actual built UI after core function. | Screenshots from current exact build; no cosmetic change before P0 integrity. |
| 11. Content / Editorial | Make copy agree with saved/failed/attached/transferred/cleared/verified states. | No unverified save or delete claims. Legal/privacy/consumer-health drafts stay unpublished until owner and counsel approve. |
| 12. Data / Product Contract Steward | Lead `LETGO` source inventory and candidate crosswalk; resolve IDs/joins, unknown source kind/verb, source-run granularity, and exact gift manifest inputs. | Every pattern row carries provenance. No owner-approved membership is inferred from source count or row order. |

### Required handoff shape from each seat

Every finding must state: ticket/block, status, exact source path and relevant line/SQL/function, current branch/SHA, observable user effect, severity/priority, proposed minimal patch, dependency, regression test and negative control, test command/results, readback evidence, cross-seat reviewer, unresolved owner decision, and whether production changed. The PM merges these into one status ledger.

## 6. P1 queue after P0 is reconciled

Do not start unrelated features before P0 is resolved. Continue independent inventory, source mapping and workflow diagnosis in parallel where safe.

| Item | Current status and link | Dependency / next action |
|---|---|---|
| MOB #60, identity-safe profile import | Draft, open. Head `fd148e4065a85c99e3bbf28170d3810a6c303d4b`. | Same-ID identical import should be idempotent; same-ID conflicting contents rejected before mutation. Reconcile to accepted integration base; run tests. Keep sync off. |
| Reboot-OS #34, 24-month deletion retention | Draft, open. Head `75f5c1409e8fb8ebbc639feea438e36a4e3774f3`. | Migration `0016_post_delete_retention.sql` must precede deployment. Confirm UTC calendar-month semantics, deletion receipt, retry when Supabase is unavailable, scheduled purge, and exact tables covered. External Cloudflare check is separately red; diagnose via [issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37), do not bypass. |
| Reboot-OS #35, exact 100-pattern starter grant | Draft, open. Head `6f1f96c9dfd33de1d1914efa4136ce162c4b28f8`; base is retention branch, not `main`. | Continue provenance-backed source mapping and tests. Reconcile base dependency. No production manifest or live application of migration 0017. Keep grant inactive. |
| Reboot-OS #36, profile contract map | Draft, open. Head `919f92083efe027e991af238ae3a2585f72934e4`. | Document field authority and versioned contract tests before any future sync. Does not authorize profile sync. |
| Publisher ownership / external Worker build | External `Workers Builds: atuned-os` check was red in the last verified handoff. Reboot-OS `web.yml` also targeted Pages project `atuned` and previously failed Cloudflare auth error 10000. | Refresh before changes. MOB is the proven production publisher for `atuned.world`. Select one publisher per artifact. No token values in chat/source. External check needs diagnosis in authenticated Cloudflare logs; repository-owned tests being green do not erase it. |
| Delete/retention complete contract | Partially implemented; still open. | Cover D1 records, Supabase first-visit/session/attachment/gift/challenge rows, audit/activity records, local device state, Stripe/store records and no-resurrection. Distinguish immediate deletion from the approved retention window. |
| Legal/privacy policy pages | Drafts intentionally excluded from production upload. | Resolve marked notes/placeholders/checks with owner and counsel, then make copy and real data flow agree before linking/publishing. |
| Visible controls and accessibility | Open survey work. | Every control has a working effect or is intentionally disabled/removed; keyboard focus/order, 44×44 CSS px target, reduced motion, loading/success/failure/retry; 390px and 1600px. |

## 7. P2, deferred and retired work

- **P2 sound-rate reliability:** latest recorded MOB PR #53 functional failure: sound burst limiter saw 11 sounds played, 7 in one second versus limit 6. Keep it separate from the copy-test gap; do not lower the assertion or its floor. Diagnose rate limiting and test timing from current evidence.
- **P2 aggregate Sniffer integration:** after Alpha only, following the explicit product decision. Eventual scope includes source evidence/spans, user-reviewed Mirror confirmation/correction/rejection, canonical Release, verification, evidence, Trace and CQ/Field refresh. Do not silently promote it into P0.
- **P2 canon conflicts:** unresolved values remain `UNREAD`, `PARTIAL`, or `CONFLICT` until owner-approved rulings exist. Do not invent the ontology to satisfy tests.
- **P2 task register:** complete a local checkout reconciliation of the full `TASKS.md` when repository checkout access permits. Deduplicate merged, retired and superseded items and map each to owner, priority, dependency, test, status and evidence. The connector did not return the full large file.
- **P2 cross-device continuity:** after the first-visit baseline, test device A to B attachment, expired/replayed passes, retries/timeouts, conflicting accounts and deletion followed by a fresh boot. Do not make anonymous session recovery guessable.
- **Beta/public-launch only:** crisis/distress detector remains deferred to beta/public launch by owner ruling. Legal/clinical review and safety-copy validation remain relevant before public launch, not a reason to silently expand Alpha.
- **P3 cosmetics:** spacing, typography, tooltips, icon refinement and motion/sound polish only after P0 and relevant P1 acceptance.
- **Retired / out of scope:** Android/iOS packaging, signing and store builds; old retired single-file build `ATUNED_MVP_Recursive_Final.html`; dropped mockup alternatives; unrelated domain-boundary investigations. Do not resurrect them in the backlog without owner direction.

## 8. Required build, test, review and evidence protocol

### Before any code or workflow edit

1. Refresh each repo's `main` SHA and exact PR head/base, CI status, open comments, review threads, and whether new commits arrived since this document.
2. Read the current `DECISIONS.md` and repo `CLAUDE.md`; they outrank stale handoff statements when they contain a settled ruling.
3. Write or identify a failing regression case first where practical. Do not start from code presence or intuition.
4. Use a named branch for one coherent block. Never edit generated outputs directly; follow `atuned_src/MANIFEST` load order.
5. Keep security/privacy, profile-sync-off, billing-off, unpublished legal copy and disabled unapproved gift invariants intact.

### MOB baseline commands

Run from repository root, matching `CLAUDE.md` and the current workflow. Keep logs and actual outputs rather than typing estimated counts into a document.

```bash
./atuned_src/BUILD.sh
./atuned_src/BUILD-engine.sh
node tests/engine.js
node tests/functional.js
node tests/collide.js
node tests/design.js
node tools/monitor.js
node tests/funnel.js
node tests/boot.js
python3 .claude/skills/atuned-voice/check.py --objections
python3 tools/workflow-lint.py --self-test
```

The exact workflow may run separate targeted subsets such as `tests/golden.js`, `tests/firstrelease.js`, and `tests/release-screen.js`; use the current `.github/workflows/deploy.yml` as final source for required jobs. Browser suites need the project's `NODE_PATH` and Playwright/browser setup. Capture screenshots at 1600px and 390px for changed surfaces. If a source/data split changes generated output, run the configured equivalence check before relying on the bundle.

### Reboot-OS baseline commands

Inspect the current `atuned/server/package.json` and `.github/workflows/server.yml` before choosing commands. The Worker suite is:

```bash
cd atuned/server
node --test test/*.test.mjs
```

Also run the current canon/schema validators and migration checks used by CI. The first-visit acceptance suite runs actual migrations against local PostgreSQL; under CI it must fail if PostgreSQL is unavailable, not skip. If migration 0017 is part of a candidate, prove it against a clean database plus pre-migration/legacy rows, and prove it refuses readiness without an active, fully frozen 100-item set.

### Two independent gap-review passes per block

- **Pass 1, implementation and contract:** correctness, edge/error states, data ownership, acceptance coverage, source/provenance and all requested scope.
- **Pass 2, adversarial cross-system review:** regressions across browser/Worker/database boundaries, race/retry/idempotency, storage readback, privacy/security, migration/backward compatibility, stale generated artifacts and whether a test can detect regression.
- Patch all must-fix findings with new regression tests. Rerun on the updated exact SHA; old green runs are historical evidence only.
- Required checks must block deployment. A report-only suite must be identified as report-only. Never lower a floor, remove an assertion, hide a failed/skipped/cancelled required job or convert it to warning to obtain green CI.
- Record branch, exact source SHA, build SHA, test commands/counts, run URLs, migration status, screenshots/other artifacts, two review results, residual risks and whether a production deploy occurred.
- After integration, reconcile with the PM. Do not merge/deploy just because the local test suite passes.

## 9. Production and infrastructure warnings

- **Canonical publisher:** MOB `.github/workflows/deploy.yml` is the proven publisher for `atuned.world`. Reboot-OS `.github/workflows/web.yml` builds a distinct `atuned/web/dist` package but previously tried to publish it to the same Pages project `atuned` and returned Cloudflare API auth error `10000`. Keep build/smoke capability; don't let the alternate workflow overwrite the canonical project. Make publisher ownership explicit before any publishing-path change.
- **External Worker check:** Cloudflare external check `Workers Builds: atuned-os` is separate from repository-owned Worker server tests. The last handoff has it red on unchanged main and active PR branches, including documentation-only work. [Reboot-OS issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37) asks for the actual error from authenticated Cloudflare dashboard logs. Don't dismiss or bypass it; don't say Worker source tests failed if only the external check failed.
- **Migration state:** migration `0015` was previously applied and its schema/function permission behavior verified. Migration `0016` is a dependency for PR #34, and `0017` is a dependency for PR #35. Neither new migration is authorized or recorded as applied to production by this handoff.
- **Production evidence:** distinguish code merged, CI passed, migration applied, Worker deployed, Pages deployed, live smoke passed and actual browser readback. One does not imply the next.
- **Secrets:** never paste secrets or print values. Diagnose presence/kind/status only. Avoid leaking tokens into logs and artifacts.

## 10. Owner-only decisions and stop conditions

Do not ask questions answered by `DECISIONS.md` or previous owner rulings. Ask one targeted question when the active block is genuinely blocked, and continue independent safe work.

1. **Starter gift selection:** confirm ground-specific personalized membership based on the October 1/4 TDD, or explicitly override to one identical set for every user. After source-level candidate mapping is complete, approve exactly 100 stable sentence IDs. No ID choice is inferred.
2. **P0 integration / production:** approve or defer merging MOB #59 to `main` with the knowledge that the gated production workflow may run. Until approved, no merge or deploy.
3. **Other questions already open in the handoff, after prior source research:** user-created patterns vs user-specific imprints validated by them; whether losing browser storage means restarting first visit or requires secure recovery; whether export promises complete portable user state or profile-only. Queue these in order and do not interrupt unrelated work to ask all at once.

No new approval is required to run local tests, review a diff, repair a test in an isolated branch, map source provenance, document a schema contract, or investigate the external check. Do not apply a live database migration, enable sync/billing, activate a gift set, merge an integration candidate, or publish unfinished legal copy without the appropriate existing release authorization.

## 11. Next-thread exact pickup sequence

### Start here, then execute

1. **Refresh facts once.** Check MOB `main`, Reboot-OS `main`, #59 head/base/checks, #56/#57 incorporation, #35 current branch/base/checks, #34/#36, issue #48/#58, and issue #37. Use the SHA values in this document as comparison anchors only.
2. **Lock P0-A/B/C.** Verify #59 still equals `59a91176df50cfe9db81924c4463762a81886fbb` and run 38111452439 remains the required passing run for that exact SHA. If changed, run the full required matrix on the new head. Fix the report-only copy test separately, preserving floor 149; decide whether cross-tab idempotency belongs in current Alpha acceptance.
3. **Hold for explicit merge decision.** Ask for a direct go/no-go on #59. If approved, execute the controlled merge/deploy verification process in Section 4. If not approved, do not merge; continue with independent catalog work.
4. **Continue #58 source mapping immediately.** Review the inventory/crosswalk on #35. In parallel, map stable candidate sentence rows with explicit source references, label all unknown kind/channel/side/phase/sentence split fields, detect repeated source material, and build a reviewable table. Do not invent missing content or final pattern IDs.
5. **Resolve the gift decision only when the candidate is evidenced.** Use the previous TDD's ground-specific behavior as the prior recommendation, explicitly flag the current `DECISIONS.md` gap, and ask for confirmation or override. Present provenance for candidate members, not merely a count.
6. **Complete two gap passes on #35's technical contract.** Review SQL permissions/RLS/search paths, immutable frozen content, catalog/set hash serialization, exact 100 unique ordered membership, issuance/readiness/attachment behavior, legacy gift pending status, races and idempotent usage. Review again against the real user journey and privacy boundaries. Add regression tests for every must-fix. Keep synthetic fixtures non-production.
7. **Reconcile PR #35 base.** It currently targets the retention branch used by #34. Decide/rebase onto the accepted integration base in the dependency order; don't merge a branch with unclear retention dependency. Run the actual Postgres migration suite on the final PR head. Do not run migration 0017 against live production as part of this work.
8. **Parallel safe infrastructure work.** Read #37 and the latest external Cloudflare status. Retrieve authenticated diagnostic logs if access permits; otherwise leave explicit `BLOCKED` with the reason. Preserve MOB as production publisher; don't change production tokens in code or bypass the external check.
9. **After P0 decision/closure, start P1 in order.** Rebase and test #60 on the accepted base; complete #34 deletion retention after external-check/policy dependencies; finish #35 frozen set only after owner-approved production manifest; keep #36 as prerequisite documentation/tests for any later profile sync. Keep profile sync and Stripe disabled.
10. **Update the tracker and handoff after each block.** Update issue #48 and this document with exact PR, branch SHA, workflow run, tests, review passes, residual gaps and deployment result. Reconcile the full `TASKS.md` using a local checkout when available; do not infer that historical tasks are current.

## 12. Definition of done

A P0 or P1 block may be marked closed only when all applicable points are true:

- Scope matches current `DECISIONS.md`; unresolved product choices are not silently guessed.
- Regression tests reproduce the original failure before patch or clearly document why a pre-fix repro is impossible.
- Minimal implementation is in the canonical source branch and generated artifacts are rebuilt from source where necessary.
- Two independent review passes are complete and all must-fix findings have regression coverage.
- Required test matrix is green on the exact final candidate SHA with current floors unchanged or intentionally raised from observed clean output.
- Data writes, user-facing status and subsequent readback agree after reload; negative cases and retries are tested.
- Cross-system ownership, privacy, retention and migration contracts are tested where relevant.
- The PM has recorded dependencies and residual risks, and cross-role review is complete.
- For production work, actual merge SHA, migration status, deployment SHA and live verification are separately recorded.

## 13. Status ledger for continuity

| Item | Status at handoff | Next owner/action |
|---|---|---|
| MOB #59 integrated P0-A/B/C | Required gates green on candidate; open/unmerged | PM: refresh exact SHA/run; ask owner go/no-go; no implicit deploy |
| MOB #56 | Open/unmerged support PR | Keep under #59 integration; cross-tab retry remains bounded residual |
| MOB #57 | Draft/open support PR | Keep under #59 integration; ensure its commits are in the candidate |
| MOB #58 catalog + fixed 100 starter patterns | **Open P0 / Alpha-blocker** | Foundation + Data Steward + Engine + Worker + QA; get owner selection-rule/manifest approval |
| MOB report-only copy test | Partial; 147/149 | QA repairs delete-confirm setup at 390px and 1600px; do not lower floor |
| MOB #60 identity-safe profile import | Draft/open P1 | Rebase/test after P0 accepted; keep sync off |
| Reboot-OS #34 deletion retention | Draft/open P1 | Verify current checks and retention semantics; migration 0016 dependency; external build check unresolved |
| Reboot-OS #35 frozen set schema/Worker | Draft/open P1 infrastructure for #58; base is #34 branch | Continue review/source inventory, test on exact head, no live migration or gift activation |
| Reboot-OS #36 profile contract mapping | Draft/open P1 | Contract documentation/tests; sync remains off |
| Reboot-OS #37 external Cloudflare check | Open infrastructure issue | Diagnose actual external build log or remain explicitly blocked; do not bypass |
| Cloudflare Pages publisher ownership | Open infrastructure risk | MOB remains canonical `atuned.world` publisher; reconcile alternate path without competing deploys |
| Stripe production setup | Held, off | Do not enable until full live validation and owner approval |
| Profile sync | Held, off | Do not enable until consent, retention and privacy-copy approval |
| Starter gift production manifest/migration 0017 | Not approved/applied/active | Await approved sentence-level catalog and set, then authorized migration and live readback |
| Legal/privacy policy pages | Draft, not publishable | Owner and counsel resolve outstanding legal/content items |
| Android/iOS packaging | Retired/out of scope | No action without new owner scope decision |

## 14. Evidence index

- Earlier Dev 9 executive handshake artifact `EXECUTIVE-HANDSHAKE-2026-10-11.md`, evidence through 11 October 2026 04:44 UTC: primary historical source for the integrated P0 candidate, run 38111452439, two review passes, residual risks and P1 order. This document supersedes it where the newer PR #35 head or issue #58 reconciliation is stated.
- [Dev 8 execution handshake](https://github.com/rebootos-sourcce/MOB/blob/dev8/development-log-20261010/DEV8-DEVELOPMENT-LOG-2026-10-10.md): prior current-state and cross-review protocol. PR #63 is the associated open documentation PR.
- [Dev 7 team charter and MVP gap backlog](https://github.com/rebootos-sourcce/MOB/issues/48): role seats, priority definitions, tracker and historical acceptance gaps.
- [MOB PR #59](https://github.com/rebootos-sourcce/MOB/pull/59): integrated P0-A/B/C code and current candidate.
- [MOB Actions run 38111452439](https://github.com/rebootos-sourcce/MOB/actions/runs/38111452439): exact integrated candidate workflow evidence.
- [MOB issue #58](https://github.com/rebootos-sourcce/MOB/issues/58): separate sentence inventory and fixed-gift P0 blocker.
- [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35): catalog/set schema, migration 0017, tests and inventory/crosswalk.
- [Release-pattern source inventory](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/docs/release-pattern-source-inventory-2026-10-10.md): verified source types, coverage and unresolved IDs.
- [Release-pattern candidate crosswalk](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/docs/release-pattern-candidate-crosswalk-2026-10-10.json): row-level provenance mapping and explicit unresolved fields.
- [MOB `DECISIONS.md`](https://github.com/rebootos-sourcce/MOB/blob/main/DECISIONS.md): authoritative product decisions.
- [Reboot-OS issue #37](https://github.com/rebootos-sourcce/Reboot-OS/issues/37): external Cloudflare Worker build investigation.

## 15. Handoff measures

- Integrated required P0 engineering workstreams with candidate evidence: 3.
- Separate open P0 inventory/gift issue: 1.
- Alpha journey on tested candidate: 61 passed, 0 failed, 0 expected-red.
- Required integrated workflow: 31 jobs completed; `gates-pass` succeeded.
- Report-only copy test: 147/149; floor unchanged.
- Integrated PR #59 merged: no.
- Production deployment authorized/performed by this handoff: no.
- Owner-approved production starter IDs: 0.
- Confidence in #59 candidate validation based on retrieved run evidence: 0.96.
- Confidence that catalog P0 remains open based on issue and PR evidence: 0.98.
- Full historical thread reconstruction confidence: 0.80 because original Dev 1–6 transcripts and complete `TASKS.md` were unavailable.

**Final instruction to the next thread:** Start at Section 11. Refresh only state that could have changed, then execute the ordered actions. Do not restart the audit, do not invent product canon, do not treat test fixtures as production data, do not merge/deploy implicitly, and do not call the project Alpha-ready while issue #58 remains a P0 blocker.
