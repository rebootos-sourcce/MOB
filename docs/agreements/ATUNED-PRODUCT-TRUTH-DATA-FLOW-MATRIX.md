# ATÜNED Product Truth and Data-Flow Matrix

**As of:** 11 October 2026  
**Status:** Internal contract baseline. Product/engineering facts require verification against exact candidate build.  
**Rule:** Documentation describes only verified behavior as available. A sentence in a draft policy is not implementation proof.

## 1. Observable user journey contract

The desired observable journey is:

**Story → Evidence → Mirror → User correction/confirmation → Release → Reframe → Verification → Practice/history**

The user must be able to reject or correct the Mirror. Evidence from the user's own words or answers is not an objective clinical finding. Each stage has its own completion state and measurement.

| Stage | Contract behavior | Required failure behavior | Current evidence state |
|---|---|---|---|
| Story | User enters or selects a story/signal; preserve exact user input only where the product explicitly needs it | Do not silently send or persist story text where the shown notice says it remains local; clear transient content when the flow exits as specified | TDD describes flow; exact implementation/data path not yet proven here |
| Evidence | App identifies the specific input/features used to generate an interpretation | If evidence cannot be produced, state that plainly; never invent supporting evidence | Specification required; exact evidence display/copy tests to be attached by build thread |
| Mirror | App presents a tentative interpretation derived from the user's own input | Make clear it is an interpretation; provide accept/correct/reject path; do not label as objective truth or diagnosis | Signal TDD supports user confirmation/correction; shipped state unverified |
| Release | A distinct user action is started, completed, failed or cancelled | Failure does not consume usage or count as a successful release unless the authoritative system confirms it | Source schemas and candidate tests exist; canonical meter and production behavior need proof |
| Reframe | User can formulate/accept an alternative direction without being told it is guaranteed to work | Keep user agency; don't force affirmation or imply positive reframing is clinically effective | TDD describes a user-defined reframe; exact behavior unverified |
| Verification | Capture a user-reported result or observation with explicit provenance and time | Never promote self-report to a clinical measurement or verified durable change | Specification only until current build evidence is attached |
| Practice/history | Store a user-initiated practice/history event only where the chosen product/storage mode provides it | Distinguish attempted, completed, self-reported helpful, and longitudinally verified change | Practice event definition required; implementation/storage scope unresolved |

## 2. Data-flow inventory

Legend: **Documented claim** means a current source says this; **unverified** means engineering has not provided proof in this pack; **decision required** means product policy is not settled.

| Data class | Source/use | Expected location/recipient from current drafts | Contract state and risk | Proof required |
|---|---|---|---|---|
| Story text / free-text answers | User input to Story/Mirror | Latest owner ruling in `DECISIONS.md` says the first-visit funnel sends only random code, selected topic and finish marks, never story/name; no story training and no research sharing at launch; the “Improve the Models” switch is removed. Profile sync is parked and must not be enabled as-is. Earlier exploratory ruling that story text refines models is superseded. The remaining engineering question is whether journal/imprint, account snapshot, voice or any other path transmits story-derived content outside the device. | **POLICY SETTLED; IMPLEMENTATION / OTHER PATHS UNVERIFIED.** Do not claim all stories stay local or sync until every path is traced. Do not enable model training/research at launch. | Trace current requests for first visit, quiz, journal/imprints, signed-in session, account creation, release, history, voice and deletion; identify payload fields, table writes and training/research access paths. Include negative tests proving story text/name absent from first-visit requests and that profile sync remains disabled. |
| Account identity and authentication | Account access, recovery and record association | Terms refers to email/password; privacy draft refers to username/passphrase and optional recovery email | **CONFLICT / BLOCKED**; identity model/field names do not agree | Current client/API schemas, server auth rows, recovery flow and checkout identity |
| Derived reading / imprint / analytics summary | Personal mirror, release history, account snapshot | Privacy draft describes a first snapshot at account creation but contains unresolved statements about what is sent and whether later entries sync | **DECISION REQUIRED + IMPLEMENTATION UNVERIFIED** | Data dictionary, exact serializer/request schema, before/after capture, server row samples using synthetic data |
| Birth data / derived profile | Optional local interpretation features | Privacy draft says name, sex, birth date/time/place stay local and are not sent or included in server copy | **DOCUMENTED CLAIM / IMPLEMENTATION UNVERIFIED** | Network trace and storage inspection for every route and account snapshot; negative tests that fields never appear in request or server tables |
| Usage, release, practice and consent events | Metering, history, safety and audit | Proposed canonical event spec in this pack; current app analytics is described as local, while account snapshots and release records are described separately | **SPECIFICATION REQUIRED** | Event inventory, payload schema, source-of-truth mapping, idempotency test, raw network and stored-row inspection |
| Payment identifiers and subscription status | Billing entitlement | Terms/Privacy describe Stripe checkout and stored customer/subscription identifiers/status; card entry occurs on Stripe's page | **DOCUMENTED CLAIM / IMPLEMENTATION UNVERIFIED** | Test-mode checkout evidence; inspect app payloads and provider account settings; no production charge |
| Voice dictation audio/transcript | Optional dictation | Privacy draft says browser-maker servers may receive audio in Chrome/Edge; application does not directly receive audio in that path | **DOCUMENTED CLAIM / IMPLEMENTATION UNVERIFIED** | Browser-specific current route test, UI disclosure at time of use, browser API confirmation; do not generalize to all browsers |
| Network voice text | Optional speech synthesis | Privacy draft says a network voice can send spoken words to the identified voice provider | **DOCUMENTED CLAIM / IMPLEMENTATION UNVERIFIED** | Provider/voice inventory, network trace, just-in-time notice and opt-out test |
| Error/support diagnostic | Fault reporting | Privacy draft contains a check that the app does not yet send error traces | **NOT PROVEN AVAILABLE** | Confirm whether reporting is implemented; if absent, don't describe it as collected or available |
| Practitioner/cohort permissions and views | Optional future sharing | Terms/Decisions mention grants and partial view; product owner previously questioned scope; availability is unproven | **DECISION REQUIRED / IMPLEMENTATION UNVERIFIED** | Confirm feature status, consent/revocation behavior, field-level view rules and audit log; omit availability if not built |
| Backup and restore copies | Recovery after deletion/incident | Terms/Privacy draft state a locked 90-day backup with possible restore. The latest `DECISIONS.md` ruling says retention after delete is 24 months, without defining the record/store scope. The two statements are not yet reconciled with configured behavior. | **OWNER PERIOD RECORDED; SCOPE / IMPLEMENTATION UNVERIFIED; BLOCKED.** Do not silently pick one time period or publish either as verified infrastructure behavior. | Map live stores, backup sets, replicas and row classes; capture actual policy/config and expiry jobs; test deletion, restore, retained exceptions and no-resurrection; have counsel approve the final wording. |

### Source evidence checked against current main (code contract, not live-traffic proof)

- `DECISIONS.md` at blob `723094e40ef311d319980c0cee73e8f60ca47acc` records the later controlling ruling: first visit sends random code, selected topic and finish marks only, never story/name; story-based model training is off; research sharing is off and not offered at launch; the “Improve the Models” switch was removed. This later ruling supersedes earlier exploratory text about story refinement.
- `tests/copy.js` at blob `8c9b13f3c60f4bf82c46ac183ca82b1004a13260` specifies the expected signed-out walk request bodies: `POST /v1/funnel/session` permits `anonymousId`; checkpoint `PATCH` permits `selectedGroundId`, `tutorialCompleted`, `firstReleaseId`, and `verificationId`; attachment `POST` permits `credential`. The test explicitly stubs the Worker routes and the walk does not sign in. It demonstrates a test contract, not deployed egress or later authenticated behavior.
- `atuned_funnel_system/src/funnelService.ts` at blob `8f8a786adf77d7e49c2f6c40c1d9aa473ce5c60f` shows `recordStory` emitting a story length rather than raw story text and `analyzeAndMirror` passing a story object to the Source adapter. That implementation scaffold is not proof of the active client route.
- `atuned_funnel_system/README.md` at blob `9e7539035bc779ad59464730aa574edaf3e62c65` says the funnel schema is applied to a live Supabase project and a repository write/read/delete check passed, but also says the application router is not calling `FunnelService` end to end and the scaffold is not wired into `source.html` or `atuned_src/`. Therefore, do not infer that this project currently stores consumer story content. Engineering must connect the deployed route, runtime request and database evidence before the privacy notice lists it as a consumer-data recipient/store.
- `DECISIONS.md` also records the intended voice behavior: with voice enabled, each spoken release line from an unsigned-in user goes through the ATÜNED server to ElevenLabs. The deployed request/response path, field content, retention and just-in-time disclosure still require current-build tracing.

**Consequence for contract wording:** Do not say the full story/profile is sent at first visit. Do not say all story-derived data is local forever. Do not describe the Supabase scaffold as an active consumer store. The policy must state the exact shipped path only after an exact-build trace reconciles these code and decision records.

## 3. Event truth levels

Use these levels in product and legal copy:

1. **Attempted:** user started an action. It may have failed.
2. **Completed:** the app/server confirms the defined interaction completed.
3. **Reported:** the user reports a sensation, impression or helpfulness.
4. **Verified change:** a defined measure shows change across a prespecified interval and method, with provenance and validation.
5. **Clinical outcome:** requires a separate evidentiary and regulatory review; not established by the current product evidence.

An interaction count is not verified behavior change. A self-reported release is not a clinical measurement. A reading is not a diagnosis. A practice record does not establish durable psychological change.

## 4. Contractual minimums

- Any Mirror or interpretation is explicitly presented as tentative and user-correctable.
- A completion state is based on the authoritative event for that action, not a button click alone.
- The server may not issue a starter gift unless both the onboarding ground and gift nature are supplied as required and an approved, frozen set of exactly 100 distinct stable catalog IDs is available and verified.
- Do not silently collapse the twelve existing onboarding grounds into the six gift-nature categories.
- Do not describe deletion, export, restoration, profile sync, practitioner access, analytics upload, subscription billing or clinical benefits as available until the exact candidate build proves the path and owner/counsel approvals exist.
- Use synthetic records during tests until notice, consent, vendor/security conditions and approved test protocol permit real sensitive content.
