# ATÜNED Engineering Audit: Dev 1 to Dev 6

**Audit snapshot:** 8 October 2026 Pacific / 9 October 2026 UTC  
**Scope:** Current `main` source in `rebootos-sourcce/MOB`, current Worker source in `rebootos-sourcce/Reboot-OS`, available engineering handoffs, prior gap audits, merged pull request descriptions, and available GitHub Actions results.  
**Purpose:** Establish a dependable engineering source of truth. Do not mark work complete because a handoff, comment, synthetic test, or prior assistant said it was complete.

## 1. Executive decision

**Current state: DEPLOYED WITH MATERIAL OPEN BLOCKERS. Not sign-off complete.**

The active `MOB/main` head checked for this audit is `b2b7a03e084f0441d5da070c1dd288b05f5fd92f`, which merges PR #38. The Worker source is in `Reboot-OS/main`; its checked route and configuration source is available in that repository. The MOB deploy workflow reports the current commit served by Cloudflare, and its deploy job succeeded. The same workflow's report-only functional job was still in progress when checked. A deployment success is not the same as the entire product passing its end-to-end acceptance contract.

Seven separate review passes were applied to current source and records. They were source and contract reviews, not seven independent production browser sessions. The application source and CI evidence were read directly, but the linked browser, live account, database and payment services were not personally exercised through a fully authenticated user session during this audit. The document therefore separates code presence, automated test evidence, production configuration and end-to-end proof.

### The highest-priority findings

1. **The first-story distress check is missing.** The current onboarding source expressly says there is no distress detector and that a new visitor's story is read by `parseStory` without a check. This is a launch-blocking gap under the project's own earlier rule that the distress reader ships to a private build first, and clinician/counsel review gates a public launch.
2. **The live funnel checkpoint is not browser-safe by contract.** The Worker exposes `PATCH /v1/funnel/session/:id/checkpoint`, and the browser sends `PATCH`, but the Worker CORS allow-methods header omits `PATCH`. Node tests that call the Worker directly do not prove browser preflight works.
3. **Privacy statements contradict the implemented profile sync.** `auth.js` periodically sends `pExport()` as a whole profile to `/v1/sync`. The exported profile schema includes name and birth details. Current UI copy still says stories/readings stay on the device or that a deleted profile was held only locally. The server `PUT /v1/consent` route exists, but no front-end caller to that route was found. Resolve the policy before treating sync or privacy as done.
4. **Account deletion is not end-to-end.** The browser's profile Delete action removes a local profile. The Worker has `DELETE /v1/me`, but the current client does not call it. The Worker deletion helper does not delete attached Supabase funnel rows or cancel a live Stripe subscription.
5. **First-run journey and Story Sniffer are not the same thing as the full transformation loop.** PR #38 improves denial/third-person handling and first-run resume, but the normal Story path still commits using `parseStory`, `applyStory`, `verpApply`, and `leanApply`. The complete `sniffStory` candidate object is not proven to travel through the ordinary Story page, a user's confirm/correct/reject, Release, verification, stored evidence, Trace and CQ.
6. **Billing code is present but paid Stripe checkout is configuration-blocked.** `wrangler.toml` still contains `REPLACE_WITH_STRIPE_PRICE_ID_...` placeholders and keeps Tier Four disabled. Guarding a placeholder correctly is good engineering, but it does not mean paid checkout is live.
7. **The project has previously conflated test coverage with acceptance.** Some past checks were synthetic, compared values to themselves, or were hard-coded counts. The retired 4.96 MB hand-edited HTML build must not be used as proof for the current app. The current production source must pass source-built browser journeys and live-boundary checks.

### Current source-of-truth anchors

| Item | Current authority | What it proves |
|---|---|---|
| App source | [`MOB/main`](https://github.com/rebootos-sourcce/MOB/tree/main/atuned_src) | Code the build should come from. |
| Latest app merge | [Commit `b2b7a03e`](https://github.com/rebootos-sourcce/MOB/commit/b2b7a03e084f0441d5da070c1dd288b05f5fd92f) | Latest checked P1 integration batch. |
| Latest relevant Sniffer acceptance | [PR #38](https://github.com/rebootos-sourcce/MOB/pull/38) | S0 to S5 and F13 work claimed by the merged pull request. |
| CI/deploy run | [MOB run 37893178406](https://github.com/rebootos-sourcce/MOB/actions/runs/37893178406) | Deploy job and required gate results; full report-only functional suite was still running at the point checked. |
| Worker/API source | [`Reboot-OS/main/atuned/server/src/index.js`](https://github.com/rebootos-sourcce/Reboot-OS/blob/12b2e48a5131bd5f2985291e7a5949a1874268ab/atuned/server/src/index.js), Worker head `12b2e48a5131bd5f2985291e7a5949a1874268ab` | Actual route map, auth boundary and CORS response. |
| Worker funnel | [`funnel.js`](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/atuned/server/src/funnel.js) | Actual anonymous-session, checkpoint and attachment transport. |
| Worker Stripe | [`stripe.js`](https://github.com/rebootos-sourcce/Reboot-OS/blob/main/atuned/server/src/stripe.js) | Actual Stripe guards and subscription mechanics. |
| Superseded hand-edited output | `ATUNED_MVP_Recursive_Final.html`, hash `293d2307fcaabe888fe9dd5d42e7950ae4cfc97d90962976110f9f58fe2b844c` | **Not canonical and must not ship.** It is not reproducible from current source and contains hand edits to engine logic. |

## 2. Source limitations and status vocabulary

The literal conversation transcripts for **Attune Dev 1 through Attune Dev 6** were not retrievable as transcript files in the available file interface. The 8 October engineering handoff explicitly records the limitation for Dev 1 to Dev 5; separate searches also failed to surface a complete Dev 6 transcript. Dev 1 to Dev 5 below are reconstructed from the project handoff and available code records. The Dev 6 mapping is inferred from current-main PRs and engineering work, not quoted from a literal Dev 6 transcript. `TASKS.md` is present in the repository, but its full multi-thousand-line contents could not be retrieved through the connector in one read. The audit therefore does not claim a verbatim line-by-line audit of every historical task statement.

The older `ATUNED_MVP_Recursive_Execution_Report.md`, `ATUNED_AI_HANDOFF_2026-10-08.md`, `HANDOFF-GAPS-2026-10-08.md`, `PRACTICE-AUDIT.md`, `BECOMING-AUDIT.md`, `SUMMARY-AUDIT.md`, `POINTS-AUDIT.md`, and Sniffer audit are used as historical evidence and specifications. A previous-branch status is not carried forward as current without a check against `main`.

Use these statuses consistently:

- **PASS**: Current source and a relevant executable test or live check demonstrate the exact behavior.
- **PARTIAL**: Some functionality exists, but one or more required links in the journey are missing.
- **FAIL**: A contradiction or defect is demonstrated in current source or a repeatable result.
- **MISSING**: The required mechanism or consumer is absent in inspected current source.
- **BLOCKED**: The work cannot be closed until a specified owner decision, key, account setup, outside service or review is supplied.
- **CONFLICT**: Two authoritative definitions, code paths or product rulings disagree.
- **UNVERIFIED**: Available evidence does not prove the behavior. Do not change this to PASS because the code looks plausible.
- **RETIRED**: Not allowed to serve as a current source of truth.

## 3. Reconstructed work history: Dev 1 to Dev 6

| Wave | Work represented by available records | What is supported | What must not be inferred |
|---|---|---|---|
| **Attune Dev 1** | Recursive MVP integration spine: Source, verification, golden journey, persistence, entitlement, privacy/data flow, Graph Editor, UI state bridge, copy/trust, regression, synthetic ICP, sign-off. | An 8 October report describes twelve integration blocks and labels its artifact “MVP PASS WITH EXPLICIT LIMITS.” | It does not prove that the hand-edited artifact is the active build or that a real user completed Story → Release → verification → persisted evidence. That artifact is now retired. |
| **Attune Dev 2** | Funnel domain/state machine, adapters, SQLite/Supabase repositories, persistence, RLS, concurrency, idempotency, usage accounting and starter-gift transfer. | The handoff describes a tested domain package and server-only funnel repository. The Worker `funnel.js` has session/create/read/attach/checkpoint code and Worker unit tests. | A tested domain package is not proof the production browser invokes all transitions correctly. CORS, first visit, deployed migrations and client readback need independent proof. |
| **Attune Dev 3** | Integration with the canonical engine: VM isolation, Source/release/verification/entitlement/identity adapters and vocabulary alignment. | The handoff documents real adapters and a rule that the Worker must not reimplement Source or Release. The app still has one canonical `atuned_src/engine` path. | Do not create a second Sniffer, Source engine, Trace graph, plan table or CQ calculation to work around a missing consumer. |
| **Attune Dev 4** | Identity and release trust: release IDs, numeric address identity, address recovery, refusal of unverified fallback, anonymous identity/session, account attachment and checkpoints. | Current source has real route handlers, persisted funnel sessions, checkpoint code and an onboarding journey object with tests. | A checkpoint route existing does not prove the browser can call it. Current CORS preflight omits PATCH. Release evidence and its ID/address association remain an end-to-end acceptance requirement. |
| **Attune Dev 5** | Worker/API, CORS, rate limits, free baseline, Stripe checkout/portal/webhook, store notifications and deployment guard. | Current Worker routes, CORS header, D1, funnel, Stripe guards and deployment workflow are present. The latest app deploy step reports the current commit served. | “API present” is not “paid checkout ready.” Prices remain placeholders; Tier Four is off. CORS, consent, account delete cascade and store-notification fail-closed behavior remain open. |
| **Attune Dev 6** | Best available reconstruction: current P1 batch integration on main, especially PR #37 (first-release copy, mobile Story controls, header identity) and PR #38 (Sniffer denial/third-person interpretation plus first-run resume/gift/end card). | PR #38 is merged into current `main`; it reports 5,002 engine tests passed, 0 failed, 10 expected-red, plus `firstrelease.js` 121/0, `journey2.js` 143/0, `onboarding2.js` 211/0, `journey.js` 347/0 and `sniffpage.js` 71/0. The current workflow is still running its report-only functional job at the audit snapshot. | These are source/PR claims for specific test suites. They are not proof of safety screening, profile sync correctness, paid checkout, a complete normal Story Sniffer → Release → evidence chain, or real-world psychological accuracy. |

## 4. Seven-pass audit log

### Pass 1: Source, branch and build provenance

**Result: PARTIAL / one old artifact RETIRED.**

- Current canonical implementation source is `MOB/main/atuned_src`, with build manifests/scripts deciding generated order. Current `main` is at `b2b7a03e...` as of the checked merge.
- Production Worker code is separate in `Reboot-OS/main`. It holds transport, auth, persistence, entitlement and billing; it must not implement a second story interpretation engine.
- The retired `ATUNED_MVP_Recursive_Final.html` is not canonical. Historical tests on that file do not sign off `main`.
- The deploy step says Cloudflare served current commit. The workflow did not yet have a completed final report-only functional job when checked. Treat deployed commit and complete QA completion separately.

**Handshake for this block**

`source tree → BUILD-engine.sh → BUILD.sh → funnel/BUILD-single.sh → build-output hash → browser gates → production commit hash`.

PASS only when the generated artifact is reproducible from the current manifest, no generated file was manually changed, the tested artifact hash equals the deployed one, all required browser gates complete and their logs are retained. Any generated-file/source mismatch fails the block. The old recursive HTML file must be absent from the ship path.

### Pass 2: First visit and onboarding

**Result: PARTIAL.**

- PR #38 adds a journey record, resume-on-reload, gift count, end card and additional first-run tests.
- It correctly fixed the “Begin release” control being below the fold at 390 CSS px by pinning the card’s actions to its own column.
- Onboarding still commits the first user-entered story by calling `parseStory` with no distress check before it. The current source comments explicitly identify this as still open.
- `journey2` and `onboarding2` prove tested parts of the guided journey. They do not prove crisis handling, first release outcome verification, Trace update or full evidence persistence.

**Handshake for this block**

`new profile → start journey → choose ground → create gift once → enter story → distress gate → review/confirm story signals → commit only allowed content → first release → post-release observation → record journey → reload/resume → completed end card`.

At each step record the input, resulting profile fields, event ID and displayed status. Simulate failed storage, failed network, duplicate taps, reload between each checkpoint, expired anonymous credentials, a returning account, a second device and a refused story. There must be no silent save failures and no duplicate gift or release charge. Safety must run before the first story can be parsed or committed.

### Pass 3: Story parser and Sniffer semantics

**Result: PARTIAL.**

**P1 merged evidence:** PR #38 added a rough-day/profanity word pass; a denied phrase such as “I was not angry” is marked as denied and must not add to its reading; another person’s action such as “he shouted at me” is held out of the writer’s field; `sniffStory` returns positive saboteur candidates; and address-rendering wording is guarded. The pull request reports a 10,178-sentence corpus comparison, but its detailed decrease count does not reconcile: it says 109 readings lowered, split as 36 negations and 78 third-person cases, which sum to 114. Correct that report and its measurement before quoting the total. Do not turn corpus closure into accuracy claims.

**Still open from `REVIEW-sniffer-audit-2026-10-09.md`:**

- `sniffStory` is not proven as the normal Story page's complete committed-story path. Current `storyui.js` reads `parseStory`, commits with `applyStory`, `verpApply`, and `leanApply` and saves. The integrated aggregate result still needs to go through the regular user loop.
- Subject attribution and denial logic have received the P1 fix, but historical tense remains a dimension to resolve or keep explicitly unread.
- Modifiers are **partial**, not absent: a modifier table exists, but words such as “a bit” and “unbearably” are not represented and `sniffAxes` does not use the modifier values.
- The frame/stance layer is specified but deliberately not built.
- Nature and Human Nature vocabulary are unread; the source audit refers to four absent canon files and `gaps.missing`.
- Three axes have no authored vocabulary (the audit names Disgust, Shock and Surprise); there are nine depth circles but only four keyed, per the audit.
- CQ/law divisor E43 and Joy/Surprise address decisions conflict in the canon. Do not decide them in code or recreate source data from memory.
- Audit every renderer to ensure an inferred axis/address is not printed as if the user explicitly said it.
- The audit says only 856 of 9,431 sentences reached in one measurement and accuracy is unverified. Neither this nor 10,178 comparison cases is a real-world accuracy rate.

**Handshake for Sniffer**

`exact user text + context → scan/parse → evidence ledger with raw source spans → candidates + provenance + confidence/unknown → user accepts/corrects/rejects/leaves open → update hypothesis only from that choice`.

The scan must be read-only. The engine remains the sole source of parsing/canonical data. Every candidate must preserve `READ`, `PARTIAL`, `UNREAD` or `CONFLICT`; every inference retains “because” evidence and a source span mapped through the normalization map rather than slicing the raw string with a normalized offset. Negated, third-party, historical, hypothetical, ambiguous “you”, profane and rough-day samples need positive and negative tests. Failing test first, smallest code change next, rerun consumers of `parseStory`, current measured counts and voice/browser gates. No unsupported accuracy claims.

### Pass 4: Mirror, Release, Reframe, verification and evidence

**Result: PARTIAL / end-to-end path UNVERIFIED.**

The Release UI and engine functions exist (`meterPlan`, `meterRerunPlan`, `meterRun`, `meterRerun`, `meterBudget`, `releaseWork`; called from `ui/release.js`). Reframe is currently the truth-channel half of the release and increments `meter.truthLines`, not a wholly separate persisted Reframe entity. Historical Practice audit found that heavy marks were in `RUN.heavy` and disappear when a card closes; the finished card records the address. The exact meaning of “verified” was marked UNVERIFIED in that audit. `engine/practice.js` and `engine/trace.js` now exist on current main, but existence is not proof that the normal UI writes and reads them. Source search did not surface a confirmed normal UI caller for `practiceDo`, `traceFromRecord` or `traceApply`; this should be settled by a focused consumer sweep and real browser test, not by inference.

**Handshake**

`confirmed candidate → one eligible release offer → canonical Release Engine → actual executed lines + numeric address + actual release ID → reframe at same confirmed work item → verification result (changed / no change / unsure / skipped) → append evidence linked to that release and address → Trace update → CQ/Field recompute from the canonical engine → history record → next action uses the latest evidence`.

No release offer may bypass confirmation. An inferred candidate cannot become a user-confirmed fact by being emitted. A release completed is not a verified outcome. A single answer cannot be copied to every address in a multi-address run. Failed/unknown verification is a valid outcome and cannot be discarded. Every `release_id`, address and evidence ID must resolve to the record that was actually acted on. Reruns must not charge new-ground allowance twice. Tests must traverse the UI in Chromium, reload, read back the evidence, then prove one removed wiring edge makes the test fail.

### Pass 5: Profile, storage, identity, privacy and account deletion

**Result: FAIL for privacy statement consistency; PARTIAL for sync; FAIL for account deletion integration.**

- Current `auth.js` includes `profileSyncStart()` and calls it after sign-in/boot. It runs immediately and every 30 seconds. It calls `pExport()` and sends the complete profile as a `state` record through `PUT /v1/sync`. It is inaccurate to use old descriptions that said no story/profile sync happens.
- `pExport()` serializes the current schema profile. The profile includes a display name and the `who` section with first/middle/last names and birth date, time, place and zone. No sync sanitizer was found in the path reviewed.
- Current account UI text says the user's stories and readings stay on device / “signing in does not copy them anywhere”, while a different sign-in footer says the first visit joins the account. Profile deletion copy claims the data was held only in this browser. These claims contradict the current sync path.
- `PUT /v1/consent` exists on the Worker, but no `/v1/consent` caller was found in the client. The earlier owner rule that a name never leaves the device must be reconciled with the active whole-profile sync. The implementation must not silently decide this policy for the owner.
- The sync algorithm exports and compares the **whole profile** and is timestamp/winner based. The first-account/no-remote branch sets local sync metadata without a remote push; the next unchanged poll can mark state clean despite the server having no profile. This is a likely first-sync defect that needs a failing test. Whole-profile replacement may also overwrite edits from another device; merge-by-entry must be implemented if that remains the chosen rule.
- Local profile deletion (`accProfDelete`) is not a server-account deletion. The current frontend `auth.js` has no `DELETE /v1/me` call. The Worker deletion helper deletes D1 rows but does not delete the attached Supabase funnel records/challenges or cancel a live Stripe subscription.
- Avatar ratings and Ritual plans have used side stores separate from the canonical exported profile in prior audits. Current tests must confirm these elements survive export/import, another browser and account lifecycle or explicitly document the limitations.

**Handshake**

`sign-in → verify account identity → conservative account attach → server read → identity-stripped/sanitized payload → consented data class only → server accepted version and checksum → visible sync state → conflict resolution → verified pull after reload/device change → sign-out clears session association → delete request → local + D1 + Supabase + research + subscription effects → confirmation → no data resurrected by next sync`.

Required owner policy: decide whether profile/story data is local-only or account-synced; retain identity/birth data only locally if the existing ruling stands; obtain plain consent for any research/model-sharing use; state storage, retention and delete boundaries accurately. Then implement, test and update all first-run, login, Account, Privacy, export and Delete wording. Don't launch until those words match the actual data flow.

### Pass 6: Funnel/Worker/API, persistence, billing and security

**Result: PARTIAL. The API exists; live contract and configuration are not fully proven.**

- Current Worker route code implements authentication, health/version, the funnel session, checkpoint and attachment, account record export/sync, consent, subscriptions, payment-store notifications, push, crash and admin operations.
- Worker has D1 for account, auth/session, billing and synced records. Supabase is the server-only store for anonymous funnel sessions and attachment state. The system map must show both, not Supabase alone.
- A real API path can still fail from the browser even if a direct Node/mock test passes. In particular CORS is missing `PATCH` despite the browser using it for checkpoints.
- Worker `GET /v1/health` checks DB and whether Supabase is configured. It does not prove Stripe price IDs, every Apple/Google secret, mail delivery, encryption key correctness, or payment readiness.
- Stripe price IDs remain `REPLACE_WITH_...` placeholders and Tier Four is disabled. `priceFor()` correctly treats placeholders as not configured, so checkout returns a guarded 503 instead of sending the placeholder to Stripe. The subscription portal still requires a Stripe customer and portal configuration.
- `POST /v1/store/google` currently checks the configured push key only when `GOOGLE_PUSH_KEY` is truthy. If the secret is absent, the request is not rejected by that check. Change to fail closed when the deployment expects the key, then test absent/wrong/right key and a real verified transaction. Do not use an incoming store notification alone as purchase authority.
- Supabase funnel RPC migration level and live service-role configuration were not proven from current public source. Check the live migrations and run a browser-driven create → checkpoint → reload → account attach → readback smoke test using the currently deployed build.

Detailed route handshakes are in section 9.

### Pass 7: Product surfaces, QA gates, production proof and acceptance hygiene

**Result: PARTIAL; current main is deployed, but not every acceptance gate blocks release.**

- Current test docs specify headless engine checks and browser-based Chromium gates for design, functional, collide and other flows. Current main’s deploy run reports boot/funnel browser gates and several report gates successful, but `gates-report (functional)` was still in progress when checked. The deployment job can complete through `gates-pass` while a report-only functional job is still pending; that is a process risk when the goal is “everything done.”
- PR #38 reports 5,002 engine tests passed, 0 failed, 10 expected-red plus the firstrelease/journey/onboarding/Sniffer page suites. Use these as scoped PR evidence, not proof of every journey. The 10 expected-red cases must remain explicit and stable. The discrepancy in the Sniffer corpus decrease count must be corrected.
- PR #37 fixed mobile Story controls and first-release actions; verify both 390×844 and desktop views against the combined current built artifact, reduced-motion on/off and keyboard/touch interaction.
- CI artifacts/logs must preserve command, commit, build hash, expected-red count and screenshots. No manually typed “30 tests”/“2,500 simulations” as a success badge unless the count is read from the run.

**Handshake**

`clean source checkout → reproducible build → engine + claim/voice gates → browser gates → functional golden journey → API contract tests → live browser CORS/checkpoint smoke → real database sync/delete smoke → payment sandbox/live-configuration smoke → screenshots/logs → deploy same hash → production smoke → retain evidence and explicit remaining gaps`.

The functional gate for the actual golden journey should block release if that is the intended release policy. If some gates are intentionally report-only, name the risk and require an explicit release acceptance rather than saying “all tests passed.”

## 5. Current block-by-block status register

These are the main integration blocks for the audit. Use the status values above. “Element” is an individual functional element inside a block; each must close against its own handshake, not merely inherit the overall block's green status.

| Block | Element | Current status | Current evidence/location | Required next action and acceptance |
|---|---|---|---|---|
| **B0 Source/build integrity** | Canonical source and generated build | PARTIAL | `atuned_src/MANIFEST`, `BUILD-engine.sh`, `BUILD.sh`; current `main` at `b2b7a03e...` | Fresh checkout, run all build scripts; compare the generated hash with the artifact tested and deployed. Never patch generated `source.html`, `engine.js` or packed output by hand. |
| B0 | Old recursive one-file artifact | RETIRED | `ATUNED_MVP_Recursive_Final.html` / `293d2307...` | Keep it out of release and test jobs. Do not port its CQ or graph changes without a reviewed failing test and a canonical source patch. |
| **B1 First-use journey** | Journey state, reload resume, gift count, end card | PASS within listed scope | PR #38; `journey2.js`, `onboarding2.js`, `journey.js` | Keep regression tests and prove reload at every checkpoint. This does not close safety or Release/evidence handoff. |
| B1 | Mobile first-release button/actions | PASS within PR scope | PR #38 integration fix | Screenshot/test at 390px and desktop with action accessible, sticky within its own card, no horizontal overflow. |
| B1 | Distress gate before first story | MISSING / BLOCKER | `atuned_src/ui/onboard.js` explicitly says no distress detector; first story commits without check | Add safety gate ahead of parsing/commit on first visit and regular Story path. Positive, negation and benign-context tests; private build first; clinician/counsel review before public launch. |
| **B2 Story/PARSER** | Raw story retention, normalised offsets, single parser | PARTIAL | `engine/sniff.js`, `engine/lexicon.js`, `ui/storyui.js`; handshake `HANDSHAKE-sniffer.md` | Preserve raw story. Map normalized offsets through `normMap`. List and test every parser consumer when semantics change. |
| B2 | P1 denied-language handling | PASS within PR #38 test scope | PR #38: denied phrase marked struck and excluded from score; `tests/engine.js` and `sniffpage.js` | Test both “not angry” and “not afraid. Afraid now.”; no negation leaks across sentence boundaries; `can't stop crying` is not a denial. |
| B2 | Third-person attribution | PASS within PR #38 test scope | PR #38: other person's action held out of writer's charge and asks how it landed | Test “he shouted at me” / first-person effect, loss/death, quotation, ambiguous “you”, first vs third person. Count reductions correctly. |
| **B3 Sniffer** | P1 rough-day/profanity vocabulary | PASS within PR scope | PR #38 LEXPROF with `LEXSYN_NO` and starred-word traps | Keep lexicon as sole canon. Re-run existing consumer sweep and all corpus/gate measurements whenever parser changes. |
| B3 | `sniffStory` on ordinary committed Story path | MISSING integration / BLOCKER for product promise | `ui/storyui.js` normal path is `parseStory` → `applyStory`/VERP/lean → save; latest Sniffer audit says aggregate path not connected | Wire `sniffStory` into the normal flow once, not only the tutorial. Preserve source evidence and no-mutation rule. Prove by browser test on a real story. |
| B3 | Candidate accept/correct/reject/open lifecycle | PARTIAL | Some onboarding yes/no events exist; normal Story Sniffer aggregate lifecycle not proven | Store first-class user choice with source/candidate refs. Reject must suppress same claim until explicit new evidence. Unknown is valid. No confirmation inferred from merely continuing. |
| B3 | Full positive saboteur candidate output | PARTIAL / verify current renderer | Sniffer audit recorded `sniffStory(...).slice(0,SAB_SHOW)` and display slice | Verify current head: compute complete candidate list, separately cap display without truncating source evidence, and test no valid candidate disappears unexpectedly. |
| B3 | Historical tense, intensity modifier coverage | PARTIAL | `REVIEW-sniffer-audit-2026-10-09.md`; modifier table exists but incomplete and `sniffAxes` does not consume it | Either implement with paired positive/negative regression samples or mark the affected dimension unread. Never fabricate tense or intensity. |
| B3 | Frame/stance, Nature/Human Nature, depth circles | MISSING / UNREAD by design | `DESIGN-sniffer.md`, `gaps.missing`, `gaps.nature/human`, `gaps.circles` | Restore owner-provided canon files or approve replacements. Frame layer waits for a held test set. Unkeyed circles must remain UNREAD. |
| B3 | Canon conflicts: CQ divisor, Joy/Surprise addresses, Avoider/Innocent | CONFLICT / OWNER BLOCKED | `DESIGN-sniffer.md` (E43 and rulings); `HANDSHAKE-sniffer.md` rule 12 | Put decision in `DECISIONS.md`, update source table once, attach fixtures, test old profiles and current output. Code must not decide canon silently. |
| B3 | No inferred address presented as a user statement | PARTIAL / renderer audit open | `sniffOffer` can return `address:null`; renderer wording was noted as unaudited | Search/test every renderer. Explicit axis != explicit address. Make the gate fail if inferred address is worded as “you said.” |
| **B4 Mirror/Source** | Source AI conversation and user agency | PARTIAL | `engine/sourceai.js`, `ui/storyui.js`; `storyui.js` includes “Scripted. No model is called” | Distinguish designed decision tree from external generative AI. One question at a time; yes/no/closer/correct/reject; Move on ends asking. Preserve corrections and source evidence across reload. |
| B4 | User sees evidence and uncertainty | PARTIAL | Sniffer source contract requires `READ/PARTIAL/UNREAD/CONFLICT`; UI is not yet integrated with full aggregate | Render why/cite source spans; no blank output presented as clean. Test contradictions and no-match. |
| **B5 Release** | Existing Release Engine | PARTIAL / core exists | `engine` release functions; `ui/release.js` | Use the one authoritative Release Engine. An eligible candidate must be user-confirmed before release. Prove correct address and executed lines. |
| B5 | Reframe | PARTIAL | Truth channels + `meter.truthLines`; no separate lifecycle record | Test correct reframe language, same target address, counted only when actually executed, no double charge. Avoid claim that “reframe entity” is fully implemented. |
| B5 | Multi-address release identity | UNVERIFIED end-to-end | Old audits found evidence IDs/address matching issues | Test one run with multiple addresses, each release ID/address and each outcome unique; unknown address must fail closed, not default. |
| **B6 Verification/Evidence/Trace/CQ** | User verification response | UNVERIFIED / partial | Old Practice audit marked exact verification contract unclear; current Trace/Practice modules exist | Decide/record accepted verification states (changed/no change/unsure/skipped) and persist response per actual release/address. |
| B6 | Evidence ledger | PARTIAL / normal UI write path not proven | `engine/practice.js` has provenance/data contracts; no verified normal user-path write/read | Make event append-only by contract, source-labelled, bound to story/confirmed pattern/release ID/address; read it back from UI. |
| B6 | Trace graph | PARTIAL | `engine/trace.js` is on current `main`, but UI consumer and end-to-end `traceApply` not proven by current reviewed path | One canonical graph; typed edges with `known/inferred/proposed/user_confirmed/observed`; no confirmation forged by a renderer; reject invalid node/edge; connect story→evidence→pattern→goal and show evidence drawer in UI. |
| B6 | CQ/Field update after verified work | PARTIAL / end-to-end UNVERIFIED | Existing canonical `compute()`/CQ machinery; a current-main integration test proving release→verified outcome→CQ/Field→history was not produced | Preserve official CQ divisor/formula. No second calculation. Only confirmed or observed evidence changes source data. Compare expected output against canonical engine and prior saved records. |
| **B7 Practice/Ritual/Accountability** | Practice domain | PARTIAL | `engine/practice.js` exists with source/provenance; historical practice audit found no screen caller | Wire one canonical write method into user flows; do not implement a second event engine. Test duplicate calls, refusal, update and persistence. |
| B7 | Ritual plan + daily practice | PARTIAL | `ui/ritual.js`; active plan side-store `atuned-ritual-active`, daily log in `p.rituals` per earlier audit | Make export/import, cross-device sync and deletion behavior explicit. No state should silently live only in an unexported side store. Test set/done/undo, failed saves and reload. |
| B7 | Accountability/streaks | PARTIAL / known defects need rerun | `engine/ladder.js`; historical `POINTS-AUDIT.md` found streak can count a set-but-never-done day and future dates | Write tests for never-done, canceled, same-day, future dates, timezone edges and no-expiration achievement rule. Use real practice events, not setup events, to count completion. |
| B7 | Longitudinal evidence | PARTIAL | History snapshots and dates exist, but evidence-backed 7/30/90-day behavior reports not fully proven | Build from immutable dated observations and actual events. Make unknown data visible; do not invent behavior or result attribution. |
| **B8 Becoming/Avatar/Purpose/Boundary** | Avatar pairs and user-entered identity | PARTIAL | `engine/avatar.js`, `ui/avatarui.js`; model not called and user can enter/edit pairs | Keep user as source of truth. Test add/edit/remove, export/import, older schema and monthly review. |
| B8 | Avatar identity/version/history | PARTIAL/CONFLICT | `BECOMING-AUDIT.md` reports id/title/version/status missing or inconsistent, and side ratings/tags not exported in its audited build | Recheck current `main`. Add required fields only once to canonical schema/boundary; round-trip older record without silent data loss. |
| B8 | Purpose vs six-values model | CONFLICT / OWNER BLOCKED | Current decisions say purpose is derived and may not be typed; prior Becoming TDD describes stored purpose sentences | Owner ruling required; one definition and one UI. No parallel meanings for “Purpose.” |
| B8 | Boundary/non-negotiables/Values and ethical AI handshake | PARTIAL/MISSING by previous audits | `BECOMING-AUDIT.md`; `PRACTICE-AUDIT.md`; `engine/practice.js` provenance exists but AI Handshake UI/behavior was missing in older audit | Inventory current UI callers, define owner vs AI authority and statuses. User-confirmed values/limits must never be silently generated. |
| **B9 Summary/Points/Analytics** | Summary page | PARTIAL | `ui/summary.js` exists; previous `SUMMARY-AUDIT.md` finds the page reads current energetic state but not behavior or verified interventions | Decide which “Summary” is canonical; do not conflate energetic summary, daily mirror, and summary page. Only claim what records support. Add tests for dates, snapshots, corrections and no evidence. |
| B9 | Daily snapshot when app is closed | MISSING unless current architecture proves otherwise | Prior summary audit found recompute-on-render, no background job on client | Either call it “summary on open” and preserve limitations, or add a server/job schedule with immutable daily snapshots. Test missed days and timezones. |
| B9 | Points/achievements/unlocks | PARTIAL/CONFLICT | `engine/ladder.js` derives marks; prior `POINTS-AUDIT.md` found no separate points/unlock ledger and non-monotonic marks | Re-audit current main. Do not award points for CQ or unverified outcomes. Make grants idempotent and persistent if achievements must not expire. Keep “Sight is not for sale” ruling visible. |
| **B10 Identity/Auth** | Signup/signin/reset/signout | PASS at code/test scope; live end-to-end still needs smoke | `ui/auth.js`, `ui/login.js`; Worker auth routes; `Reboot-OS` auth tests. PR #11 fixed reset token removal and route. | Test signup, duplicate email, wrong password, rate limit, mail configured/unconfigured, one-time reset, revoked sessions, signout and reload in actual browser. |
| B10 | Guest route and public entry | PASS within current source/test scope | `ui/login.js` has Guest; PR #38 first run opens to journey tests. Old branch Guest-removal defect superseded. | Confirm downloaded HTML and live website both let a new visitor continue without forced sign-in, and login errors state real reason. |
| **B11 Profile sync and privacy** | Sync caller and periodic execution | PARTIAL | `auth.js` has `authProfileSync` and `profileSyncStart`, called on signin/boot; it runs immediately and every 30s | Test initial remote absence, first association, changed profile, reload, two devices and failed request. A first remote-absent path currently updates local metadata but does not push; prove/fix with failing test. |
| B11 | Profile payload identity minimization | FAIL / P0 | `pExport()` whole-profile JSON passed as `body` to `/v1/sync`; schema includes name and birth details. No sanitizer found. | Preserve “name never leaves device” if that remains the ruling. Create an allow-listed sync DTO; test that first/middle/last and full birth data never appear in request/log/remote DB. |
| B11 | Privacy statements and server consent | FAIL / P0 | Account/login copy says stories/readings stay local while whole profile sync exists; `/v1/consent` has no client caller | Rewrite every shipped first-run/login/account/privacy/export/delete string from verified dataflow. Add user choice and server consent before research sharing. Gate fails when false legacy copy returns. |
| B11 | Local profile delete and account/server delete | FAIL / P0 | `accProfDelete()` is local only; `auth.js` contains no call to `DELETE /v1/me` | Separate “delete this local profile” from “delete account and server data.” Implement explicit account delete across D1, Supabase, research copy, local tombstone and Stripe subscription state. Verify no resurrection by sync. |
| **B12 Funnel persistence/continuity** | Supabase anonymous session create/read/attach/checkpoint | PARTIAL | `funnel.js` uses server-only Supabase RPC; tests exist | Browser preflight currently fails for PATCH by CORS contract. Fix CORS and run cross-origin Playwright against deployed worker. Test credential expiry, stale versions, duplicate/atomic gift, session reload and signed account attach. |
| B12 | Supabase migrations/runtime state | UNVERIFIED | Worker calls Supabase RPC functions. Current source alone does not prove live migration chain or service-role key. | Record the current live migration list and RPC names; prove create/checkpoint/read/attach against real staging DB. CI should fail if required RPCs are absent. |
| **B13 Worker/API** | Route method validation, auth, error behavior, idempotency | PARTIAL | Routes in `index.js`; test files `api/auth/funnel/ops/push/billing.test.mjs` | Build one contract test per route (section 9); distinguish mocked route coverage from production integration. Every failure must return a bounded error and not partially mutate unrelated records. |
| B13 | CORS allowed method for checkpoint | FAIL / P0 | `index.js` CORS header only lists GET, POST, PUT, DELETE, OPTIONS; route/client use PATCH | Add PATCH or change API/client to a method already permitted. Test actual browser OPTIONS, allowed origin, header list, actual request and denied-origin behavior. |
| B13 | Google store-notification key | FAIL / P1 | `POST /v1/store/google` condition checks key only if `GOOGLE_PUSH_KEY` is truthy | Fail closed when required secret is absent; test absent/wrong/correct key and do not alter entitlement until the purchase state is verified from Google. |
| B13 | D1 deletion cascade to Supabase/Stripe | FAIL / P0 | Worker `deleteAccount()` only deletes D1-associated rows; no Supabase RPC or Stripe cancel in it | Implement cross-store deletion/cancellation or return an explicit blocking result until all providers confirm. Make delete idempotent/retryable, test Stripe events after deletion. |
| **B14 Billing/entitlement** | Server authority for tier | PASS at code boundary; live cases unverified | `/v1/purchase`, `/v1/billing/*`; Worker `store.js`, `stripe.js`; `BASE_PLAN=0` | Server, not client, grants access. Test stale/duplicate webhook, canceled/expired/past-due, upgrade/downgrade, refunds and mismatch across store vs account. |
| B14 | Paid Stripe tier configuration | BLOCKED | `wrangler.toml` contains `REPLACE_WITH_STRIPE_PRICE_ID...`, Tier Four disabled | Configure verified Stripe prices/secrets/customer portal and success/cancel URLs; run sandbox checkout/webhook/portal/cancel tests. Until then, say “billing infrastructure coded, paid Stripe checkout not enabled.” |
| B14 | Apple/Google live purchases | UNVERIFIED | Server verification and notification code exists; no live store receipt test from this audit | Test signed transactions, invalid token, expired subscription, duplicate notifications, refunds, key missing and subscription state re-read. |
| **B15 Push/crash/export/admin** | Push subscription | PARTIAL / server tests exist | `/v1/push/key`, `PUT/DELETE /v1/push` and `push.test.mjs` | Browser permission, endpoint persistence, unsubscribe and scheduled delivery need live smoke; do not claim push delivered merely because subscription saved. |
| B15 | Crash/report and admin routes | PARTIAL / security-sensitive | `/v1/crash`, `/v1/admin/*`, `ops.test.mjs` | Verify rate limits, key absence/fail-closed, constant-time key check, no sensitive record bodies in logs, authorization and redaction. |
| B15 | Export/import profile completeness | PARTIAL | `pExport/pImport`; historical audits report side-store items may not travel | Roundtrip every field, version migration, unsupported/new keys, avatar ratings, ritual plans, deleted profile, identity-local fields, corrupted payload. Refuse by name, preserve original, never silently drop. |
| **B16 Release QA/operations** | Required gates and retained evidence | PARTIAL | Current deploy `37893178406`; multiple Chromium gates passed, functional report still in progress | Make critical functional journey a required blocking gate or document/approve why it is report-only. Retain gate logs, screenshots, commit/hash and expected-red count. |
| B16 | Current production behavior | UNVERIFIED beyond deploy signal | deploy job says current commit served; no authenticated browser run performed in this review | Run post-deploy smoke from actual browser and account, not only direct Node request. Include crisis gate, checkpoint preflight, sync privacy, deletion, entitlement, mobile viewport and reload. |

## 6. Full golden journey that must become the release handshake

The project should have **one** real end-to-end acceptance spine. It must not be declared PASS from a set of isolated methods.

```text
1.  Visitor opens production-compatible build
2.  Visitor can continue as guest
3.  Journey session is created and read back
4.  Visitor selects a starting concern and is granted the starter gift exactly once
5.  Visitor types a first story
6.  Distress/safety gate evaluates before parsing or committing
7.  Story is preserved verbatim and parser output cites original source spans
8.  Sniffer offers evidence-based candidate readings with READ/PARTIAL/UNREAD/CONFLICT
9.  Visitor confirms, corrects, rejects or leaves open
10. Only the confirmed eligible candidate can create a release offer
11. The existing Release Engine opens the correct address and records actual lines
12. Reframe is tied to the same address/release, not just a generic count
13. Visitor records changed / no change / unsure / skipped; all states persist
14. Evidence links to the actual story, candidate, release ID and address
15. Trace updates only from valid provenance; CQ/Field update via canonical engine
16. The next action uses the new evidence without rewriting original history
17. Journey and profile survive reload; failure is visible, not swallowed
18. Account attachment is single-use, versioned, correct and cross-origin browser-safe
19. Account sync obeys identity and consent rules, then reads back accepted remote state
20. Account deletion removes local and server copies, research copy and billing state
21. Production smoke records build hash, all gate results and screenshots
```

**Golden-journey test matrix:** run the happy path plus: first-run distress wording, denial, third-person event, uncertain attribution, no lexicon hit, conflicting candidate, release refused, invalid address, duplicate tap, rerun, no-change report, failed verification write, failed storage, lost network, expired funnel credential, 15-minute delay, page reload between every step, sign-up/attachment, two profiles in same browser, sign-out/sign-in as different account, two-device edit conflict, deleted account reload, no billing key, Stripe placeholder, invalid purchase notification, reduced motion and 390px viewport. Each variant must show the exact expected persisted state and user-visible failure.

## 7. Open task queue, in priority order

### P0: close before a public first-run release

| ID | Work | Blocked by | Definition of done |
|---|---|---|---|
| P0-01 | Add distress/safety gate on first onboarding story and ordinary Story commit | Engineering implementation plus private-build review | Positive, negated, benign/hypothetical fixtures pass; no story commit or charge while stopped; safety re-entry works; clinician/counsel review gate is recorded. |
| P0-02 | Fix CORS PATCH/checkpoint handshake | Worker/client build and live browser | OPTIONS response allows the requested method/headers from `https://atuned.world`; browser performs checkpoint and reads it back after reload. |
| P0-03 | Resolve profile sync policy and false privacy copy | Owner policy: local-only vs account sync; name/birth local-only ruling | All shipped wording matches observed flow; client only uploads the agreed allow-listed fields; sensitive identity fields are absent from request, DB copy and logs; consent call tested. |
| P0-04 | Fix first remote-absent sync and conflict strategy | P0-03 | A fresh account sends initial permitted state once; subsequent reads are idempotent; concurrent entries merge under an explicit rule; failure never updates sync metadata to pretend it succeeded. |
| P0-05 | Account delete client-to-server and full deletion/cancellation | Decide expected Stripe policy if cancellation API fails | UI calls server; D1, Supabase session/challenge, research records, local side stores and Stripe subscription have explicit success/partial states; deletion cannot be resurrected by sync. |
| P0-06 | Finish and gate actual first story → Sniffer → Mirror choice → Release → verification → Trace/evidence → CQ/Field | Sniffer SB5, SB6, SB7 and owner divisor ruling | One Chromium golden journey covers actual UI; each record is linked by actual IDs; a failure of any edge fails the gate. |
| P0-07 | Ensure whole functional gate blocks public deploy or create explicit release exception process | CI wiring | Functional gate must finish successfully for a normal release; artifacts/logs point to current commit/build. No more “deployed” being treated as “all gates passed.” |
| P0-08 | Prove real Supabase schema/RPC and runtime keys | Staging/prod access and key visibility without leaking secrets | Current migrations/RPCs/roles match `funnel.js`; health/live smoke confirms the needed path; secrets remain outside repo. |

### P1: finish the coherent MVP loop

| ID | Work | Acceptance |
|---|---|---|
| P1-01 | Put `sniffStory` aggregate into ordinary Story flow | User's exact story retained; parser consumers swept; evidence spans, unknowns and candidate choices visible; no second parser/engine. |
| P1-02 | Mirror accept/correct/reject/open first-class events | Events persist with source reference and cannot convert `proposed`/`inferred` to `user_confirmed` without user action. |
| P1-03 | Connect confirmed candidate to one canonical Release Engine | No fallback address, one charge per newly worked pattern, re-runs do not charge, actual release ID recorded. |
| P1-04 | Finish verification/evidence/Trace/CQ path | per-address outcomes; unknown/no change stays valid; trace edges validate; no UI-only or test-only graph. |
| P1-05 | Fix Google notification fail-closed behavior | Missing/wrong key rejected where secret is required; authoritative purchase state re-read; duplicate/out-of-order event safe. |
| P1-06 | Reconcile canonical source gaps and law/address rulings | Owner decisions in `DECISIONS.md`; owner-provided files restored or formally replaced; no files reconstructed from memory. |
| P1-07 | Re-evaluate avatar, purpose, boundary and Non-negotiables against current main | User-owned values; single meanings; schema boundary migration and user-facing UI; export/import; monthly review. |
| P1-08 | Establish a run-derived test report | CI produces dynamically counted pass/fail/expected-red data, build hash, screenshots, source commit, and test-output archive. Correct PR #38 decrease-count arithmetic. |

### P2: platform depth and fidelity, after the core user loop is proven

| ID | Work | Known gap from previous audits | Completion contract |
|---|---|---|---|
| P2-01 | Remaining Sniffer semantics | historical tense, partial modifier use, deliberately unbuilt stance/frame layer, unread Nature/Human Nature, missing files, unkeyed circles | Sampled holdout set; paired positive/negative tests; source-span and uncertainty preserved; no percentage accuracy claim without labelled evaluation. |
| P2-02 | Pattern lifecycle object | Prior Practice audit had address/fetter readings but no canonical persistent Pattern object/status | Owner-approved relationship model and IDs; no second ontology; older records roundtrip. |
| P2-03 | Release lifecycle / persisted run object | `RUN.log` and somatic marks were at least partly in-memory in earlier audit | Persistent `ReleaseSession/Pattern/Event` or an explicitly accepted canonical alternative; no duplicate source of truth. |
| P2-04 | Trace graph and evidence drawer UX | Prior Summary/Practice audits found graph functions but no wired UI surface | Validated nodes/edges, source citations, conflict/unknown states, per-story/goal/evidence paths. |
| P2-05 | Behavior, goal and integrity evidence | Summary/Practice/Points audits found no observed behavior or integrity-event emitter | Don't report “behavior changed” without user/observed evidence. Define what each event means and which screen creates it. |
| P2-06 | Summary and longitudinal report | Existing energetic summary, app Summary page and proposed daily mirror can be three different products; daily generation on closed app absent | Owner-approved definition, truthful 7/30/90-day summaries based on stored dated evidence; user corrections preserved; missed days not fabricated. |
| P2-07 | Achievements/points/unlocks | Points/ladder audit found non-monotonic achievements, inconsistent streak semantics, separate points/unlock model incomplete/conflicting | Honor “readings do not become XP” and “sight is not for sale”; test idempotency, historic grants and anti-gaming. |
| P2-08 | Cross-device/export completeness | Some Avatar/Ritual data lived in side stores in previous audit | Entire owned record and approved side data roundtrip, sync, migrate, delete; loss paths are stated and tested. |
| P2-09 | Production billing launch | Real Stripe prices, portal settings, store keys/receipts and callbacks not proven live | Test mode or live test IDs, purchase/renew/cancel/refund/grace/retry, receipt reconciliation, entitlement source. Keep Tier 4 closed until the owner opens it. |
| P2-10 | Push/crash/admin/operations live behaviors | endpoints exist and tests exist; no comprehensive live user-path test was run here | Live subscription delivery, unsubscribe, privacy/retention, log redaction, rate limits and support access tested. |

## 8. Current test and CI interpretation

### Evidence that exists

- PR #38 states: `node tests/engine.js`: 5,002 passed, 0 failed, 10 expected-red; `tests/firstrelease.js` 121/0; `journey2.js` 143/0; `onboarding2.js` 211/0; `journey.js` 347/0; `sniffpage.js` 71/0; voice and Chrome-path scans clean.
- Current workflow run `37893178406` shows `gates-fast`, browser boot, browser funnel, monitor, collide and design report complete/success; `gates-pass` succeeded and deploy job succeeded, including a step called “Cloudflare serves this commit in production.”
- The report-only functional workflow job was still in progress on the run when checked. Do not report the entire workflow as finished with every job green.
- Reboot-OS has server tests in `atuned/server/test`: `api.test.mjs`, `auth.test.mjs`, `billing.test.mjs`, `funnel.test.mjs`, `ops.test.mjs`, `push.test.mjs`. The current workflow runs `node --test test/*.test.mjs` and includes a live public-boundary smoke path. Latest reset-link change states 75 tests passed, 0 failed in its PR description.

### Evidence that does not exist yet

- One retained, passing current-commit browser recording of the entire first-use story through confirmed Sniffer result, Release, verification, stored evidence, Trace and current state update.
- A passing browser-level CORS preflight for checkpoint `PATCH` from `atuned.world` to the Worker.
- A privacy payload proof showing that local-only name/birth fields never cross the network.
- A successful first account's initial sync with no existing remote record, merge test for concurrent two-device entries, and no-loss failure/retry test.
- Complete server deletion proof across D1, Supabase and Stripe with no data resurrection.
- Actual paid Stripe checkout and lifecycle test with real configured price IDs.
- Live store notification tests and proof that absent Google key fails closed.
- A verified empirical accuracy score for Sniffer. Do not infer one from deterministic closure or corpus counts.

## 9. POST/API handshake inventory

Every operation below needs an API contract plus the app caller, persistent-state, retry/idempotency and UI-failure handshake. A route handler or a mocked unit test alone does not close the chain.

| Method and path | Current code / purpose | Status now | Required handshake and proof |
|---|---|---|---|
| `POST /v1/auth/signup` | Worker `index.js`; creates D1 account/session, rate-limits, validates email and 8 to 200 character password | PASS at code/test scope; live flow needs smoke | Bad email/password, duplicate email, rate limit, entropy/hash, account/session persistence, no secret exposure; client reports server errors correctly. |
| `POST /v1/auth/signin` | Worker `index.js`; checks account password and creates/reuses session | PASS at code/test scope; live flow needs smoke | Correct/wrong/unknown/deleted user, rate limit, timing parity, invalidated token; account ID and token stored only in auth storage, not profile/export. |
| `POST /v1/auth/forgot` | Worker `index.js`; one-hour hashed token and Resend email | PARTIAL/configuration dependent | With mail configured, link opens current app; with mail not configured, explicit 503. Unknown email must not reveal account existence. Rate limited. |
| `POST /v1/auth/reset` | Worker `index.js`; token consumed once, password updated, all old sessions deleted | PASS at API/test scope; live email flow needs smoke | Expired/reused token rejected; URL token removed in UI before further navigation; current password policy enforced; old sessions invalid; confirmation displayed. |
| `POST /v1/auth/signout` | Worker `index.js`; deletes session token hash | PARTIAL | Client stops profile-sync timer, invalidates local session, proves reload does not sign back in; local profile data remains or is handled according to the owner's sync policy. |
| `POST /v1/funnel/session` | Worker route calls Supabase RPC `funnel_create_session` and returns anonymous session plus credential | PARTIAL | Browser create; limit/rate/error handling; credential is high entropy, one-time/hashed server side, not in logs; durable session exists and can be read. Test absent service key/migrations and reload. |
| `POST /v1/funnel/session/:id/attach` | Attaches anonymous journey to signed-in account with credential | PARTIAL | Credential belongs to exact session, expires/consumes once, wrong user denied; gift/selected ground transferred once; reload recovers attached state. Test same session cannot attach twice to another account. |
| `POST /v1/purchase` | Worker verifies Apple/Google purchase and derives entitlement | UNVERIFIED live store; API code exists | Real signed receipt/transaction, invalid receipt, expiration, refund, duplicate purchase, wrong user, store unavailable. Client cannot grant plan by editing profile. |
| `POST /v1/billing/checkout` | Stripe subscription Checkout session | BLOCKED by configuration | Replace placeholder price IDs, configure Stripe secret and success/cancel URL. Current handler should return explicit unconfigured status until setup. Test new subscriber, existing paid customer refusal, redirect and webhook. |
| `POST /v1/billing/portal` | Stripe customer portal | BLOCKED/configuration dependent | Enable Stripe portal, validate customer ID, open hosted portal, cancel/change plan, webhook reconciliation. No claim of a live portal until tested. |
| `POST /v1/billing/webhook` | Signature-verified Stripe lifecycle event | PARTIAL; requires live configured billing | Missing/invalid signature rejected; duplicate and out-of-order events idempotent; re-read Stripe subscription rather than trusting event payload; reconcile cancellation/refund/grace. |
| `POST /v1/crash` | Rate-limited client crash fingerprint | PARTIAL | Auth optional as designed, only bounded fingerprint/data, no story text/PII in body or logs, rate limit and 90-day retention verified; test visible errors. |
| `POST /v1/admin/plan` | ADMIN_KEY protected override/clear and audit log | PARTIAL/security sensitive | No key/wrong key refused, compare in constant time, plan range checked, audit written, null clears override and re-derives real entitlement; admin access logged. |
| `POST /v1/admin/delete` | Admin account deletion calling `deleteAccount()` | FAIL/incomplete cascade | Admin key required. Same deletion contract as `/v1/me`; D1, Supabase and Stripe must all resolve, no orphaned rows or charges. |
| `POST /v1/store/apple` | Apple notification receiver | PARTIAL/live store unverified | Verify signed notification/transaction against Apple's authoritative state, tolerate duplicate/reordered callbacks, do not promote an untrusted payload, log bounded event and test missing/invalid signature. |
| `POST /v1/store/google` | Google RTDN receiver | FAIL-OPEN CONFIG CHECK | Refuse request if `GOOGLE_PUSH_KEY` is unset when this route is enabled; reject wrong key; validate Pub/Sub structure; re-read Google purchase status before entitlement change. |
| `POST /v1/admin/delete` | Admin-only delete listed above | FAIL/incomplete cascade | Do not treat route presence as closure. Test with test account and live attached funnel/payment rows. |
| `PATCH /v1/funnel/session/:id/checkpoint` | Saves first-run journey checkpoint with credential/version | FAIL from browser CORS contract | Add PATCH to allowed CORS methods or change the verb consistently; preflight with Authorization and `x-funnel-credential`; create, checkpoint, reload and confirm readback from real browser. |
| `PUT /v1/push` | Saves authenticated Web Push subscription | PARTIAL/live not proven | HTTPS endpoint and keys validated; per-account upsert; permission denied/no VAPID handled; delivery at chosen time, unsubscribe and deleted-account cleanup. |
| `DELETE /v1/push` | Removes an endpoint or all user's push subscriptions | PARTIAL | Delete only the authenticated account's rows; verify subscription no longer receives notification, retry safely and test no cross-account deletion. |
| `DELETE /v1/me` | Deletes account at Worker | FAIL/not wired in client, incomplete provider cascade | Connect UI confirmation to authenticated request; cancel/revoke subscription; delete D1, research, Supabase funnel, local profile/side stores, clear token/tombstone; check idempotency and no sync resurrection. |
| `PUT /v1/consent` | Server consent record for research sharing | FAIL/not wired in client | Add a plain consent control, state exact data and purpose, default off, call API and read back consent, ensure server only creates research copy after explicit share. Withdraw consent and remove/stop future shared data. |
| `PUT /v1/sync` | Writes sealed record versions; optional research copy if share is on | FAIL on privacy policy, first-sync and conflict handshake | Send only allow-listed sanitized DTO; require key; reject invalid types/version/oversize; make first remote-absent write happen; concurrent entries merge by chosen rule; versions only advance after accepted server write; return surfaced failure, no silent loss. |
| `GET /v1/sync` | Reads paginated sealed account records | PARTIAL | Token, account ownership, `RECORDS_KEY`, pagination cursor and decryption failures tested; page through >1,000 rows; read does not expose other accounts; merge with current profile without replacement loss. |
| `GET /v1/me` | Account, plan, consent, records count and billing | PARTIAL | Client shows the correct account/entitlement state from server; no client-only tier assumption; consent and billing data match the record. |
| `GET /v1/funnel/session/:id` | Reads anonymous credential-owned or account-owned journey | PARTIAL | Wrong/missing credential denied; account attachment changes authority once; stale/missing session surfaced; exact version readback and no leakage across ids. |
| `GET /v1/health` | D1/Supabase config signal | PASS as health endpoint only | Health check must not be called full readiness. Extend or pair with safe secret/config readiness checks for mail, record key, store and Stripe price configuration without exposing secrets. |
| `GET /v1/version` | Min/latest app version | PASS at route scope | Test cache/version values, minimum-version update message, stale client gate and rollout order. |
| `GET /v1/export` | Account export | PARTIAL | Ensure actual record + sync policy explained; PII handling explicit; no session token/secrets; include all user-owned data and any side-store records or explain them. Test export re-import and deletion. |
| `GET /v1/admin/account`, `GET /v1/admin/crashes` | Support console queries | PARTIAL/security-sensitive | Admin key absent/wrong/expired blocked; audit access, redact sensitive stories; query not injectable; export access limited. |
| `GET /v1/push/key` | Public VAPID public key | PASS at code scope | Public key only, correct domain/config; no private key exposure; subscription flow uses this value. |
| `GET /v1/canon`, `GET /v1/canon/:table` | Canon manifest / gated table read | PARTIAL | Manifest hashes match canonical engine tables; tier gate server enforced; no mutable duplication; identity/PII not present in public canon. |
| `OPTIONS *` / CORS | Worker preflight handler | FAIL for checkpoint method | `Access-Control-Allow-Methods` currently omits PATCH. Tests must run preflight from exact production Origin with actual headers and method. |

## 10. Element-level acceptance handshake template

Every code change / feature block should attach a completed handshake using this form. “Works” is not enough. Fill one per element and one per POST/API route touched.

```text
ITEM ID:
BLOCK / ELEMENT:
OWNER:
SOURCE OF TRUTH FILES:
CURRENT COMMIT SHA:
STATUS BEFORE:
CHANGE MADE:
INPUT / PRECONDITIONS:
CANONICAL ENGINE/API CALLED:
OUTPUT / DATA WRITTEN:
PERSISTENCE LOCATION:
USER-VISIBLE SUCCESS:
USER-VISIBLE FAILURE / UNKNOWN:
RETRY / DUPLICATE / IDEMPOTENCY RULE:
AUTHORITY / CONSENT / PRIVACY RULE:
TEST FIRST (must fail before fix):
TESTS AFTER FIX (commands, counts, exit codes):
BROWSER / DEVICE / VIEWPORT:
NETWORK / DATABASE / BILLING ENVIRONMENT:
READBACK / RELOAD PROOF:
KNOWN LIMITS:
REVIEWER SIGN-OFF:

DONE RULE:
The pre-fix test must fail for the targeted defect; the post-fix test must pass;
removing the patch must make the test fail again; relevant neighboring consumers
must be tested; stored result must read back; failed writes remain visible; logs and
counts come from the actual run. If one line cannot be completed, the item remains
PARTIAL or UNVERIFIED.
```

## 11. Required post-change test suite and sign-off sequence

Run from a clean checkout on a named branch and record the exact `HEAD`:

1. `git rev-parse HEAD`, `git status --short`, source/build hash and manifest.
2. `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh`.
3. `node tests/engine.js` and exact expected-red count, read dynamically from stdout.
4. Claims/voice checks and Chrome-path scan.
5. `node tests/boot.js`, `node tests/funnel.js`, `node tests/collide.js`, `node tests/design.js`, `node tests/functional.js`, plus affected specific tests such as `firstrelease.js`, `journey2.js`, `onboarding2.js`, `sniffpage.js`, `srcchat.js`, `becoming.js`, `dailyui.js`, `protocol.js`, `release-screen.js`, `points`/`practice` suites when the current manifest exposes them. Use project-required `NODE_PATH`, Playwright path and browser lock. Do not skip/quarantine failing cases.
6. Worker: `cd atuned/server && node --test test/*.test.mjs` with actual test output retained.
7. Cross-origin browser test of session create/checkpoint/attach/resume from exact `https://atuned.world` origin. Direct Node fetch alone is insufficient for CORS proof.
8. Live or staging store/database smoke using test account: account create, first sync, second-device merge, consent, export, delete cascade, no resurrection.
9. Payment sandbox smoke after keys/price IDs are configured. Until then mark paid checkout BLOCKED.
10. Deploy only the same source hash tested, run production smoke immediately after deploy, save screenshots and logs, and retain each PASS/FAIL/EXPECTED-RED count as an artifact.

A successful deploy does not replace steps 5 through 9. An isolated unit test does not close a journey handshake. The final sign-off must list the exact user paths exercised and the paths still unverified.

## 12. Immediate next actions, in order

1. Fix the first-story distress gate in the private build and test it on onboarding and ordinary Story.
2. Fix the Worker CORS allow-methods contract for checkpoint `PATCH`; prove it in Chromium against the deployed origin.
3. Resolve and enforce the sync/privacy policy. Remove false copy everywhere. Keep name/birth identity local if that remains the ruling, add real consent wiring, sanitize the payload and repair first-sync behavior.
4. Wire account deletion from Account to `DELETE /v1/me`; finish Supabase/research/Stripe cascade and test no resurrection.
5. Put `sniffStory` into the normal Story mirror, then connect candidate choice to Release, verification, evidence, Trace and CQ in that sequence.
6. Make functional journey checks blocking for the release or obtain a documented exception, and retain actual outputs.
7. Close canon owner rulings and missing files as explicit decisions, not inferred code changes.
8. Configure and sandbox-test paid billing only when Stripe IDs, portal and secrets are ready. Keep the product accurately labelled free-only until then.
9. Run the current main source through the complete suite, correct PR #38's measurement arithmetic, and produce a fresh current-commit status artifact.

## 13. Sign-off rule

**No global “MVP PASS” badge.** Sign-off is per block, per element and per route. One green unit suite may sign only the behavior it exercised. All critical handshakes must be complete before the app is represented as production-ready. Every remaining `PARTIAL`, `MISSING`, `BLOCKED`, `CONFLICT` or `UNVERIFIED` item is carried into the next handoff as-is until new evidence closes it.
