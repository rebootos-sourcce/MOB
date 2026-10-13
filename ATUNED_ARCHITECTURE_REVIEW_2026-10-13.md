# ATÜNED Site Architecture Review
**Audit date:** 13 October 2026 UTC  
**Status:** Six repository/configuration review passes complete. Source map is documented; production topology is not fully verified until the Cloudflare publishing-owner and atuned-os questions below are resolved.  
**Scope:** MOB and Reboot-OS repositories, main branches, relevant open PRs and candidate branches, build scripts, source modules, server routes, storage boundaries, CI workflows, Cloudflare configuration evidence, and the supplied atuned-os build log/screenshots. No merge, production deployment, migration, secret inspection, or live-data mutation was performed.

## Executive result

The main architecture problem is not only the Wrangler preview error. The repositories define **two independent production publishers for the same Cloudflare Pages project name, atuned, branch main**, and the dashboards also show a separate Worker Builds service named atuned-os. These must be classified so that a push in one repository cannot unexpectedly replace the other repository's website output.

The code-level map is complete enough to name every application layer and its intended data path. Live-release closure is blocked by five explicit decisions/proofs: one Pages publisher, the intended role/branch of atuned-os, the actual ATUNED_API binding, gift-content approval, and current-release persisted end-to-end verification. Those are bounded open items, not reasons to restart discovery.

## Protected vault artifact found and checked (read-only)

The protected artifact is present in the ChatGPT Library at `/canon_vault.sqlite`; it is not present in the checked Reboot-OS GitHub tree. On 13 October 2026, the Library copy was materialized for read-only SQLite inspection and then closed without writes.

- File size: 3,346,432 bytes.
- SHA-256: `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`.
- `PRAGMA integrity_check`: `ok`.
- `PRAGMA foreign_key_check`: 0 violations.
- 12 tables; 4 source metadata records; 5,600 statement rows: 2,900 limiting beliefs and 2,700 embodied truths.
- FTS5 sniff index: 2,900 limiting-belief rows; 72 exact-duplicate groups with 144 duplicate-member rows; 496 topics; 112 structured card blocks.
- Vault metadata marks the source records immutable and the vault version `1.0.0-local`.
- All four raw source files from the Library were materialized read-only and matched the vault's `canon_source` metadata exactly on size, MD5, and SHA-256: the 101-page Complete Let Go List PDF, the 61-page Lance Let Go List PDF, `2026 Let Go List.txt`, and `Tula - SUPPLIMENT LET GO LIST.txt`.


This confirms the protected vault artifact exists and is structurally readable. It remains a local/Library staging artifact, not the runtime `atuned/data/canon.sqlite` and not a production/Supabase import. These counts do not approve those statements as the six user-facing gift banks. Do not re-create or upload a replacement copy; keep the original protected file and source provenance intact.

## Five review passes plus independent cross-check

| Pass | Question | Evidence reviewed | Result |
|---|---|---|---|
| 1. Repository and artifact inventory | What are the real source files, generated outputs, and old prototypes? | Both repository trees, README/architecture files, build scripts, CI workflows, relevant branch trees | Three active concerns separated: MOB modular browser/funnel source; Reboot-OS app build and server; separate atuned-os Worker Builds service. Multiple older monolithic HTML files are not established release inputs. |
| 2. User-path trace | What should happen from landing through onboarding, first release, and account attachment? | MOB funnel/build/deploy workflow; MOB onboarding/journey/schema/release modules and PR #66; Reboot-OS web builder, funnel.js, route table, tests | Desired flow is traceable in code, but the served page is ambiguous because two workflows can publish different roots to the same Pages project. |
| 3. API and data authority | Which component owns each record and external call? | Reboot-OS server route registry, funnel.js, store.js, supabase.js, wrangler.toml, user_schema.json; test output | 35 Worker route definitions found. D1 owns account identity and account records; Supabase holds anonymous funnel sessions/attachment and separately consented research copies; the client remains the local source for its transformation activity. Profile sync is explicitly off in config. |
| 4. Cloudflare and CI/deployment path | Does every deployment point at the right service, path, and environment? | MOB deploy.yml; Reboot-OS web.yml/server.yml; wrangler.toml; three supplied Cloudflare screenshots and build log; read-only health probes from CI | A real publisher collision risk is confirmed in the workflow definitions. The failed atuned-os build used Preview; the latest settings screenshot instead shows Deploy. atuned-api returned HTTP 200 and atuned-os returned HTTP 404 on the latest PR #35 read-only probes. The atuned-os production/root/branch binding remains unresolved. |
| 5. Branch freshness and readiness | What is newest per component, and is it production-ready? | Current main heads, PR #66/#69/#34/#35/#36 heads, branch comparisons, exact-head workflows | Use main for deployed baselines and a tested PR commit for candidate improvements. Do not treat a recent branch name or timestamp as proof it is release authority. PR #35 is stacked on PR #34. |
| 6. Independent adversarial cross-check | What can fail even if each local test is green? | Reconciled all diagrams/tables against filenames, targets, route names, flags, branch ancestry, and check runs | Found publisher overwrite risk, an unclassified static Worker, stale prototype architecture documentation, missing ATUNED_API confirmation, disabled /sync, unapproved gift bank, and unresolved six-channel to four-track mapping. P0 remains open. |

The review was conducted as six distinct passes over the source evidence, followed by a reconciliation pass. This is not a claim of 100% live-production verification: the Cloudflare account settings/secrets and completed deployment inventory are not available through these repository reads, so they need explicit confirmation.

## System context diagram

~~~mermaid
flowchart TD
    U[Visitor] --> D[atuned.world]
    D --> P[Cloudflare Pages project: atuned / main]

    M[MOB repository] --> MB[MOB build and funnel staging]
    MB -->|deploy.yml publishes deploy/| P

    R[Reboot-OS repository] --> RB[atuned/src to build/atuned.html]
    RB --> WB[web.py injects ATUNED_API and writes web/dist]
    WB -->|web.yml publishes web/dist| P

    P --> C[Browser app]
    C -->|window.ATUNED_API /v1| API[Worker: atuned-api]
    API --> D1[(Cloudflare D1: accounts, sessions, records, entitlements)]
    API --> S[(Supabase: anonymous funnel sessions and attachment RPCs)]
    API --> X[External providers: Apple, Google Play, Stripe, ElevenLabs, email, push]

    OS[Separate Worker Builds service: atuned-os] -.->|root /, static-only indication; role unresolved| H[Root-level Reboot-OS index.html]
    OS -.->|health probe: 404| API

    P -.->|two publishers target the same project and branch| RISK[Production publishing collision risk]
~~~

**Interpretation:** the intended API is the Worker configured in Reboot-OS atuned/server/wrangler.toml, named atuned-api. atuned-os is a separate Cloudflare Worker Builds service with a static-assets indication in the dashboard; it is not the API. The direct relationship between atuned-os, the root index.html, and the atuned.world domain is not proven, so that relationship is shown as unresolved rather than assumed.

## Component and source-of-truth map

| Component | Canonical source / build | Output or destination | Rule |
|---|---|---|---|
| Marketing funnel and web routes | MOB: atuned_src/, funnel/, and .github/workflows/deploy.yml | Staged deploy/ output, Pages project atuned, branch main; the workflow copies atuned-funnel.html to index.html and publishes atuned-quiz.html, atuned-about.html, atuned-buy.html, atuned-faq.html, and atuned.html | MOB workflow explicitly says atuned.world opens on the funnel. It is one current production-publisher candidate, not yet the uniquely confirmed publisher. |
| Reboot-OS product client | Reboot-OS: atuned/src/ parts, build tool, and atuned/build/atuned.html | atuned/test/tools/web.py writes atuned/web/dist/index.html, _headers, robots.txt, and service-worker file; injects window.ATUNED_API | Generated output is not the editing source. The build gate is meant to keep build/atuned.html aligned with src. |
| Backend Worker | Reboot-OS: atuned/server/src/, atuned/server/wrangler.toml, package.json, and server.yml | Worker name atuned-api; D1 database binding DB/database atuned; hourly scheduled handler | This is the intended API and scheduled-work boundary. Deployment/migration is governed by the main-branch workflow and secrets. |
| First-visit funnel / starter gift | Reboot-OS: server/src/funnel.js and /v1/funnel/session routes; Supabase RPCs; MOB onboarding/journey/schema changes in PR #66 | The server returns gift and giftVerified in the session read; selectedGroundId is distinct from giftNatureId | Current selection rule is clear; approved fixed banks are not. Do not generate, freeze, or issue a fake bank. |
| Transformation engine and release UI | MOB: atuned_src/engine/sniff.js, sourceai.js, schema.js, journey.js; atuned_src/ui/onboard.js, storyui.js, release.js; current main plus candidate PR #66 | Runs in the browser; local profile/release state is used by the engine, with server paths separate | Source AI is not a currently deployed /v1/source service. Do not route user stories to a nonexistent API. |
| Reboot-OS component modules | Reboot-OS: atuned/src/00_head.html through 53_nav.js, then build tool into atuned/build/atuned.html | Web/Capacitor shell outputs | Keep source modules as inputs and generated HTML as build output; don't treat root index.html as equivalent without a comparison. |
| Runtime canon | Reboot-OS: atuned/data/canon.sqlite, atuned/data/canon_tables/*.json and manifest, migration 0001 | D1 tables and GET /v1/canon endpoints, guarded on the PR #35 candidate | Integrity/hash checks are not source-owner approval. The protected vault is present in the ChatGPT Library at `/canon_vault.sqlite`; its read-only integrity and counts are recorded in the Protected vault section above. It remains separate from runtime canon and must stay separate. |
| Native shell | Reboot-OS: atuned/shell/, Capacitor config, native privacy manifest, shell.yml | iOS / Android shell artifacts | Reuses the built product HTML. Store distribution is a different path from Pages. |
| Root-level HTML files | Reboot-OS: index.html (5.69 MB in the tree), reboot_os_v29.html, Source_OS_v29.html, source_os_v151.html, MOB_Complete_v35_Art.html | No active production build path established for these as a group | Treat as legacy/prototype or unclassified until hashes, build provenance, and intended role are recorded. Do not use them as release input by filename alone. |

### Required behavior pathways

#### A. Visitor to first visit and gift

1. Visitor should land on atuned.world, whose root is intended to be the funnel, not whichever output most recently overwrote the Pages project.
2. The app creates an anonymous visit with POST /v1/funnel/session. The Worker’s funnel module stores the session and returns a one-time credential.
3. The client separately captures one of 12 starting grounds and one of 6 gift natures. Ground and gift nature are different contract fields.
4. PATCH /v1/funnel/session/:id/checkpoint saves the selected ground/nature and first-visit milestones. The server validates both closed lists and rejects attempts to change an already recorded gift nature.
5. GET /v1/funnel/session/:id reads the session and returns gift plus giftVerified. The client must use the server snapshot, not synthesize a local 100-item entitlement.
6. POST /v1/funnel/session/:id/attach links the existing anonymous pass to a signed-in account. The migration and account-identity boundary must be ready before claiming this journey is production verified.
7. Only after the six source-approved banks exist can the server freeze a deterministic 100-item bank, record its version/content hashes, and attach that immutable snapshot to the account.

#### B. Account, activity, and persistence

1. Sign-up/sign-in/reset/sign-out and account state use the Worker routes and D1 account/session tables.
2. Browser transformation state is local-first. The user-schema file describes the phone/device as the source of truth; the backend holds versioned copies under account identity.
3. Reboot-OS /v1/sync GET and PUT deliberately return 503 and write/read nothing unless PROFILE_SYNC_ENABLED is 1. The checked-in wrangler.toml sets it to 0. Therefore, the full device-to-Worker-to-D1 record-sync journey is intentionally unavailable under that config.
4. Funnel session / attachment storage is a different path using server-only Supabase RPCs. Research copies use research IDs and require explicit consent; the service-role credential stays on the Worker.
5. The current-release acceptance proof still required is a controlled browser → correct Worker → correct Supabase/D1 write → read → reload test, asserting the same ordered gift IDs/hashes and the right usage/remaining counts. Repository CI alone does not prove that journey.

#### C. Story, Source AI, release, and canon

- In the MOB engine, journal/story text is parsed by the local sniff engine; Source AI computes explainable questions/measurements; the release screen uses the release engine and schema to plan and commit the release. The code states that this engine has no host and reads the user's own current text/profile facts; no /v1/source/* Worker routes are registered.
- Reboot-OS's product is built from its own atuned/src modules. It is not the same source tree as MOB's atuned_src modules, so the files must be compared and integrated deliberately rather than mixed by filename.
- GET /v1/canon and GET /v1/canon/:table currently expose the frozen allowlisted runtime canon on the PR #35 candidate. Eight unresolved/proposed/vault-labeled tables are omitted; 119 others remain allowlisted and still require source-authority/public-suitability review.
- canon.sqlite is the runtime canon. canon_vault.sqlite is the protected source/retrieval vault verified in the ChatGPT Library; the runtime migration and a manifest label such as “the vault patterns” do not establish that it was imported or approved. The runtime migration and a manifest label such as “the vault patterns” do not establish that the protected vault was imported or approved.

#### D. Voice, billing, stores, push, and scheduled work

- Voice: browser calls POST /v1/voice/synthesize → atuned-api → ElevenLabs using server-held secret/budgets. No API key belongs in browser source.
- Billing: browser calls /v1/billing/checkout or /portal; Stripe calls /v1/billing/webhook; app stores call /v1/purchase, and Apple/Google notifications enter /v1/store/apple and /v1/store/google. Checked-in config keeps billing off and the base plan at free (0).
- Push: client retrieves GET /v1/push/key and subscribes with PUT /v1/push; DELETE removes subscriptions. Worker scheduled work sends the morning note and performs regular cleanup.
- Scheduled execution runs only on the backend Worker. A static-assets-only Worker cannot replace this job or serve as the API simply because it is named atuned-os.

## API surface inventory — PR #35 candidate

The server route registry contains 35 definitions. All are under /v1 except the read-only support page /admin. Person-specific routes use the Worker bearer identity; public exceptions are explicit in the route allowlist.

| Area | Routes | Authority / purpose |
|---|---|---|
| Auth and account | POST /v1/auth/signup, /signin, /signout, /forgot, /reset; GET /v1/me; DELETE /v1/me | D1 accounts and sessions; password reset is single-use; sign-out can end the funnel pass |
| Funnel and gift | POST /v1/funnel/session; GET /v1/funnel/session/:id; PATCH /v1/funnel/session/:id/checkpoint; POST /v1/funnel/session/:id/attach | Supabase-backed anonymous session/attachment and server-returned gift snapshot |
| Consent, records, export | PUT /v1/consent; PUT /v1/sync; GET /v1/sync; GET /v1/export | Consent and account records in D1; sync requires PROFILE_SYNC_ENABLED=1 and RECORDS_KEY |
| Runtime canon | GET /v1/canon; GET /v1/canon/:table | D1 runtime tables; PR #35 candidate applies public allowlisting, manifest/content fingerprinting, and fail-closed 404 |
| Purchases and billing | POST /v1/purchase; POST /v1/billing/checkout; POST /v1/billing/portal; POST /v1/billing/webhook; POST /v1/store/apple; POST /v1/store/google | Store validation and Stripe lifecycle; billing stays off until its separate release gates pass |
| Voice | POST /v1/voice/synthesize | Worker proxy to ElevenLabs with usage controls |
| Push | GET /v1/push/key; PUT /v1/push; DELETE /v1/push | Browser push subscription storage and scheduled sends |
| Health and diagnostics | GET /v1/health; GET /v1/version; POST /v1/crash | Health/version response and bounded crash reporting |
| Operator support | GET /admin; GET /v1/admin/account; GET /v1/admin/crashes; POST /v1/admin/plan; POST /v1/admin/delete | Admin-key-gated support/reporting; actions audited |

## Cloudflare inventory: never treat these names as interchangeable

| Name / object | Source/config | Proven role | Live evidence and current disposition |
|---|---|---|---|
| Pages project atuned | MOB .github/workflows/deploy.yml; Reboot-OS .github/workflows/web.yml | Public site publishing target named by both independent workflows; both target branch main | **P0 collision risk.** MOB stages funnel pages and sets root index to funnel. Reboot-OS stages a product app as root index.html. If the repository secrets resolve to the same account as the source comments indicate, the latest successful deployment can replace the other site's output. Confirm account/project binding and designate one production publisher. |
| Worker atuned-api | Reboot-OS atuned/server/wrangler.toml; source atuned/server/src/index.js | API Worker, D1 binding DB, hourly cron, server-only Supabase and third-party calls | Latest PR #35 read-only probe: HTTP 200 at /v1/health. API target/config are known in repository source. Production version/migration state still must be confirmed before release claims. |
| Worker Builds service atuned-os | Cloudflare dashboard screenshots/build log; connected to Reboot-OS; root directory /; Build command None; current settings screenshot shows Deploy command npx wrangler deploy | Dashboard shows a static-assets-only trigger limitation. It is separate from the API. The exact role/custom-domain/deployment ownership is not documented well enough | **Unresolved, do not retry from an alpha branch as a Production build.** Failed build 0b27be84-ebb9-4d97-b20b-eba999fdcebc used npx wrangler preview and failed because its Wrangler config had no previews block. The supplied latest settings screenshot shows a different command (deploy), so the failed build's settings are not the same as the current screenshot. Latest PR #35 health probe: HTTP 404 at /v1/health. Confirm its purpose and branch/environment binding before any new build. |
| Pages app binding ATUNED_API | Reboot-OS repository variable consumed by atuned/test/tools/web.py | Injects window.ATUNED_API into built HTML and adds that origin to Content-Security-Policy connect-src | The actual current variable value was not available in repository source. Confirm it points to the intended atuned-api HTTPS origin, not atuned-os or a placeholder/empty origin. |
| Production domain atuned.world | MOB deploy workflow documentation names the Pages project/domain | Intended to serve the funnel at / and the product at its named app path | Domain-to-current-deployment relationship was not independently read from Cloudflare's authenticated domain settings. Use deployment inventory and custom-domain binding as the final proof. |

### Current Cloudflare failure, precisely stated

Uploaded build log for 0b27be84-ebb9-4d97-b20b-eba999fdcebc says the configured command was npx wrangler preview. Wrangler 4.149.0 failed before deployment because the configuration has no previews block. This establishes the immediate command/config mismatch; it does **not** prove the application itself has a code-build error.

The newer screenshot shows npx wrangler deploy, root directory /, no build command, service atuned-os, and the message that triggers cannot be added to a Worker that only has static assets. Those settings imply a different current configuration snapshot from the failed log. They do not confirm that this is the right service, root, repository role, or production branch. Do not add a previews block merely to make the old command green. Do not retry an alpha branch while the dashboard labels the deployment Production. Confirm intent and target first.

Reference: [Cloudflare Workers Builds troubleshooting](https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/), [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Branch and freshness ledger

The rule is **latest verified component, not latest branch name**. Main is the intended publishing baseline; the exact live deployment SHA still needs Cloudflare readback. Open branches provide candidates until reviewed and promoted. A branch that is newer but divergent, stacked, or untested cannot replace main by assertion.

| Component | Main baseline / candidate | Evidence | How to treat it |
|---|---|---|---|
| MOB site and modular engine | main at ed5eca344836e852f117a5b573059e5e1cf1e3ab | Main deploy workflow builds engine and funnel, gates before Pages publish | Intended production baseline; exact live Pages SHA still needs deployment readback |
| MOB gift-nature onboarding | PR #66 / p1/gift-nature-client-20261011 at fc7033fb24ec9ed94e2f63563e723b82603b2e68 | 31-check workflow #38322094250 completed successfully; PR remains draft/open/unmerged | Latest verified candidate for the six-nature client choice, not production code yet |
| MOB integrated P0 gate candidate | `dev7/p0-alpha-gates-20261010` at `74279113003ca02c3675be04cf8d7bff651008b9` | 62 commits ahead, 1 behind main; changes deploy workflow, schema/export, auth/panels/release/UI, tests and floors; workflow #38157593102 succeeded | Broad, divergent candidate. Do not merge as a unit; inspect source diffs and workflow/security changes, then port only required fixes. |
| MOB integrated P0 candidate | `dev7/p0-integrated-alpha-check-20261010` at `53fa3549202e731031c0d2be100cf1566d8d082d` | 18 ahead, 1 behind main; auth/panels plus gate/floor changes; workflow #38094610607 succeeded | Candidate evidence, not production authority. Compare to current main and PR #66 before taking changes. |
| MOB P0 release-save candidate | `dev7/p0-atomic-release-save` at `d040f3fdd33675439190bdbe99e9c5ad50765543` | 20 ahead, 1 behind main; schema/export/release/UI and engine/release-screen tests; workflow #38107104818 succeeded | Most complete inspected release-save candidate among the checked branches; still diverged. Port relevant code against main and re-run current main gates; do not switch the whole branch. |
| MOB P0 quiz/first-visit candidate | `dev7/p0-quiz-first-visit-session` at `cb3fa5aef537246964758c6bce32aea6cadb27e5` | 16 ahead, 1 behind main; auth/panels/golden tests; workflow #38106761966 succeeded | Useful differential source for the first-visit path; reconcile with PR #66 and current main before selectively porting. |
| MOB integrated-gates sibling | `dev7/p0-alpha-gates-integrated` at `d13bec0803e15baf4c7b278c72735942f0495a71` | 17 ahead, 1 behind main; workflow/floor/golden gate deltas; no workflow run was returned for this exact head | Backlog candidate until exact-head checks exist. Do not assume the success of sibling branches covers this SHA. |
| MOB copy/delete gate | [PR #65](https://github.com/rebootos-sourcce/MOB/pull/65), head `5c388cd48d2c1254967028271c20515cc149ebcd`, based on `dev7/p0-alpha-gates-20261010` | Workflow #38148880267 succeeded; changes copy/delete confirmation test; PR remains draft and is stacked on an unmerged base | Keep the base dependency explicit. Port the test/fix to current main if the requirement is still open; do not merge the stacked base blindly. |
| MOB deletion-retention receipt | [PR #68](https://github.com/rebootos-sourcce/MOB/pull/68), head `2cebf8039287537165a03d53222bcb72f2734260` | 3 commits ahead of main, no behind commits; auth.js/floors/golden; workflow #38220044415 succeeded | Current, narrowly scoped backlog candidate. Cross-review behavior against Reboot-OS PR #34's retention implementation before promotion. |
| MOB profile-import identity | [PR #60](https://github.com/rebootos-sourcce/MOB/pull/60), head `fd148e4065a85c99e3bbf28170d3810a6c303d4b` | 10 ahead, 1 behind main; schema/engine plus tests; workflow #38093746343 succeeded | P1 identity-safe import candidate; verify schema contract with Reboot-OS PR #36 before integration. |
| MOB P0 quiz/auth changes | alpha/p0-quiz-journey-repair-20261010 at 7caa08ec5f29f1a5f8f7378636eb204010814c93 | 12 commits ahead and 1 behind main; edits auth.js, panels.js, golden/copy tests; branch diverges | Review and port only relevant commits after exact-head tests; not an authority for current main |
| MOB P0 release-save changes | alpha/p0-release-save-accuracy-20261010 at d9119ffacdf622bb52e664d1bfe14eba005a4836 | 4 commits ahead and 1 behind main; edits schema.js, release.js, release-screen test | Review/reconcile against main and latest release source; don't replace wholesale |
| Reboot-OS API, gift contract and canon guard | PR #35 / alpha/p1-fixed-pattern-gift-contract-20261010 at 48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf | Server 147/147; both smoke jobs passed; external Workers Builds atuned-os failed. This branch is based on PR #34's retention branch, not directly on main | Best current server candidate for review, but it is stacked and external deploy is red. Resolve PR #34 dependency and Cloudflare mapping before promotion |
| Reboot-OS account-retention work | PR #34 at 75f5c1409e8fb8ebbc639feea438e36a4e3774f3 | Open draft; PR #35 uses it as its base and includes its changes | Treat as a prerequisite/stack, not an independent finished release |
| Reboot-OS profile schema crosswalk | PR #36 at 919f92083efe027e991af238ae3a2585f72934e4 | Adds crosswalk documentation; open draft | Helpful contract record, but documentation is not runtime persistence proof |
| Reboot-OS profile-sync off candidate | `claude/profile-sync-off-alpha-dev7` | 7 commits ahead, 12 behind main; changes Worker routes/config/tests and smoke checks | Historical divergent candidate. Main config explicitly keeps `PROFILE_SYNC_ENABLED=0`; retain that default until auth/consent/storage acceptance is proven. Compare selected changes only. |
| Reboot-OS billing guard candidates | `claude/billing-live-smoke-switch-aware-dev7` (1 ahead/1 behind, workflow only) and `claude/stripe-checkout-default-off-dev7` (4 ahead/3 behind; workflow, stripe module, billing tests and Wrangler config) | Diverged from main; not established as the live billing implementation | Backlog candidates for differential review. Keep billing switches off until checkout/webhook/provider validation passes; no branch alone authorizes live billing. |
| Reboot-OS first-visit regression candidates | `claude/firstvisit-delete-no-resurrection-dev7` (1 ahead/3 behind) and `claude/firstvisit-timeout-expiry-dev7` (1 ahead/4 behind) | Test-only diffs to `firstvisit.test.mjs` | Port useful missing tests to the current server candidate if not already covered; old branch heads are not release candidates. |
| Reboot-OS screenshot test candidate | `claude/shots-fixed-date-constructor-dev7` (1 ahead/12 behind; `atuned/test/tools/shots.py`) | Stale/diverged single-file test candidate | Compare the one-file change and port if still necessary; otherwise archive after recording the delta. |
| Reboot-OS superseded branches | `claude/starter-gift-readiness-contract-dev7`, `claude/worker-hardening-1`, voice/cors/Supabase-key branches | Compared heads are behind main with no unique commits in the GitHub compare result | Archive candidates once related PRs/references are checked. Do not delete; retain branch/commit URLs in the inventory. |
| Reboot-OS older funnel-runtime branch | claude/atuned-funnel-runtime-1 | 13 commits ahead, 74 behind main; diverged | Historical candidate for differential review, not the current source of truth |
| Reboot-OS old Cloudflare diagnostic branch | claude-cf-secret-diagnostic | 1 commit ahead, 83 behind main; only an old diagnostic-workflow delta | Do not rely on its deployment logic without rebasing and current review |
| Master index and architecture audit | PR #69 / docs/atuned-master-index-20261012 | Current docs branch; exact-head checks must be refreshed after this report/index update | Authority for the newest documented architecture state once current-head checks finish |

The current Reboot-OS README/ARCHITECTURE.md at main describes the standalone reboot_os_v29.html prototype and its older v28 section map. It says the prototype has in-memory state/no persistence. It is **not** the complete deployment architecture for the current atuned/build/atuned.html + Worker product path. Keep it as prototype documentation unless it is specifically rewritten to describe the deployed product build.

## Gap ledger and required acceptance

| Priority | Gap / risk | Next action | Acceptance evidence |
|---|---|---|---|
| P0 | Two independent workflows publish to Pages project atuned / branch main | Owner confirms one production publisher. Recommended working model: MOB owns atuned.world and the root funnel because its workflow explicitly builds all funnel paths; Reboot-OS web build becomes artifact/preview until the app HTML is deliberately integrated as a named path. This is a recommendation, not a change already made. | One production publisher is documented; only one workflow can replace the Pages production branch; output contains root funnel plus the approved atuned.html app; deployment readback verifies the expected commit and paths. |
| P0 | atuned-os's role/branch/root is ambiguous; a build with an alpha commit is labeled Production; old command failed and new UI setting differs | In authenticated Cloudflare, confirm service type, Git repository, production branch, preview branch rules, root directory, deploy command, static asset binding, custom domains, and target account. Do not use this as API until proven. | A documented service card says exactly what atuned-os serves; production builds can only come from approved branch; correct new build completes and a host/route smoke test shows expected output. |
| P0 | ATUNED_API value not independently verified | Confirm repository variable points to the actual atuned-api Worker HTTPS origin and matches the server CORS allowed origin | Published HTML contains the intended origin; browser network request succeeds with correct CORS; /v1/health returns 200 on the expected host |
| P0 | Browser → Worker → Supabase/D1 persisted journey not verified; PROFILE_SYNC_ENABLED=0 | Use approved non-production test account and current exact client/server commits; test create, first-visit checkpoint, attach, gift snapshot, usage, database read, and reload | 1/1 current-release journey passes with the same ordered IDs/hashes; failure/retry is idempotent; no local synthetic gift or duplicate issuance |
| P0 | Six gift banks have 0 approved stable IDs; the 560-row queue is a review queue, not a bank | Source-ground each statement; settle 210 multiline sentence boundaries and 24 ambiguous PDF locators; assign IDs and classifications; obtain owner approval | Six immutable versions, each exactly 100 unique approved IDs with exact wording, source locator, ordering, hashes, exclusions and approval provenance |
| P0 | Six backend verb channels map to four client meter tracks only by an unverified adapter | Specify semantics and deterministic one-to-many/many-to-one rules without equating labels by count; test usage math | Crosswalk document + adapter tests covering all channels and tracks; exact snapshot → meter → persisted counters survive reload |
| P0 | Runtime public canon allowlist contains 119 not-yet-fully-reviewed entries | Finish source-authority/public-suitability review for each remaining table; retain eight negative controls | Reviewed status per table, exact source/owner evidence, approved exposure tier, and negative tests for unknown/mutated tables |
| P0 | PR #35 is stacked on PR #34; external check is red | Resolve PR stack order/rebase decision; preserve migrations and run tests on the intended integrated head | Integrated branch head is exact and tested; server/smoke green and external build is green for the right target; no unauthorized production migration/deploy |
| P1 | Reboot-OS and MOB each have different app source trees | Choose integration boundary; do not copy newest files by filename alone | Path-level source-of-truth list, schema/API compatibility tests, generated output from one intended build |
| P1 | Source service architecture is unfinished | Keep current Source AI local; recover SourceService/dependencies and define server-verified identity/ownership before adding server routes | No X-Atuned-User-Scope-only authorization; authenticated tests demonstrate scope/ownership and explicit consent |
| P1 | Older architecture docs and root HTML files are easy to mistake for active code | Add “prototype/archive” labels and a manifest listing hash, intended purpose, source tree and whether deployed | Every HTML entrypoint is classified as production input, generated output, prototype, or archived material |
| P1 | Supabase migrations and actual production DB schema may lag the candidate code | Check migration IDs/versions on an approved non-production database; keep production migrations gated | Schema readback plus rollback/ordering review; no migration applied merely to make CI green |

### Backlog vs archive rules

- **Active production baseline:** only the current main code and exact commit read back as deployed by the one approved publisher.
- **Active release candidate:** open PR with a named purpose, exact head, required checks, cross-review, source-of-truth parent, and acceptance criteria. Do not call it production.
- **Backlog candidate:** useful branch with a real, distinct delta but stale, divergent, stacked, or not yet tested. Compare and port selected commits; do not merge the whole branch blindly.
- **Archive/reference:** older standalone HTML prototypes, obsolete architecture maps, and branches proven to have no required unique delta. Preserve them; do not delete them as part of this review.
- **Generated artifact:** output recreated from identified source/build tools. Do not edit it as the source of truth unless the build flow explicitly says it is a hand-edited source.
- Do not archive or delete anything until its content hash, source, use, and unique changes have been compared. A label/index entry is safer than destructive cleanup.

## Exact-head verification snapshot — 13 October 2026 UTC

- Reboot-OS PR #35 head: 48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf. Server workflow #38333447700 passed 147/147; smoke workflows #38333450875 and #38333447634 succeeded. The external Cloudflare check still failed on build 0b27be84-ebb9-4d97-b20b-eba999fdcebc.
- The PR #35 server workflow's read-only probes reported atuned-api /v1/health HTTP 200 and atuned-os /v1/health HTTP 404.
- MOB PR #66 head fc7033fb24ec9ed94e2f63563e723b82603b2e68: workflow #38322094250 completed successfully; PR remains draft/open/unmerged.
- MOB docs PR #69 pre-audit head 401b2566488c5d9f2f19cd9915cd76006cb599f0: workflow #38333707012 succeeded before this audit/index update. The new docs head needs its own exact-head check.
- MOB main base used for branch comparison: ed5eca344836e852f117a5b573059e5e1cf1e3ab. Reboot-OS main base: 40ba888508de76c2dcfa0d7851fbdd29b38d0b3e.

## Closure condition

This architecture review can be marked complete as a **repository/configuration map**. The live production topology remains **OPEN** until there is one Page publisher, the atuned-os purpose/branch is confirmed, the ATUNED_API variable is verified, the gift content is approved, and the current release's stored data is read back after reload. Do not set “100% complete” on these live acceptance items without that evidence.

## Source links

- [MOB repository](https://github.com/rebootos-sourcce/MOB)
- [MOB production build/deploy workflow](https://github.com/rebootos-sourcce/MOB/blob/main/.github/workflows/deploy.yml)
- [MOB PR #66 gift-nature client](https://github.com/rebootos-sourcce/MOB/pull/66)
- [Reboot-OS repository](https://github.com/rebootos-sourcce/Reboot-OS)
- [Reboot-OS web publisher](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/.github/workflows/web.yml)
- [Reboot-OS API publisher](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/.github/workflows/server.yml)
- [Reboot-OS Worker config](https://github.com/rebootos-sourcce/Reboot-OS/blob/alpha/p1-fixed-pattern-gift-contract-20261010/atuned/server/wrangler.toml)
- [Reboot-OS PR #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35)
- [MOB master index PR #69](https://github.com/rebootos-sourcce/MOB/pull/69)
