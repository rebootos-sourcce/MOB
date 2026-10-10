# Dev 7 / Alpha P0–P1 Execution Follow-up
**Prepared:** 10 October 2026  
**Status:** In progress. No PR has been merged and no production deployment has been made.

## Release decision

Alpha is **not ready to ship**. The blocking path is P0 acceptance gates, quiz-arrival instrumentation, and truthful durable release saves. P1 work proceeds in parallel where independent. Profile sync remains off, billing remains off, and explicitly deferred features remain out of scope.

## Blocker board

| Block | Owner seats | Current evidence | Exit condition |
|---|---|---|---|
| P0-A — blocking acceptance gates | PM/Release, QA, Infrastructure | [MOB #59](https://github.com/rebootos-sourcce/MOB/pull/59), head `fc1ccb0a46cb58dd06e174c422f206404e0a8618`, is layered on P0-B branch #56. An earlier isolated run passed 50 assertions but left two expected-red checks (quiz session start and a sync expectation); the sync expectation was not an Alpha requirement and has been replaced by positive local-privacy assertions. New combined CI is pending. | The blocking matrix, workflow lint and self-test pass; Alpha journey has zero failures and zero expected-red results; measured assertion floor is raised from the provisional value; deliberate regression makes the gate fail. |
| P0-B — quiz arrival, anonymous funnel only | Browser UI, Security/Privacy, QA | [MOB #56](https://github.com/rebootos-sourcce/MOB/pull/56), head `b2205ebebaff7a454089cbbb19fc6fbba4a5d278`: 27/28 checks were green at the last refresh; the functional browser gate remained in progress. It adds positive assertions for exactly one session, identifier-only start payload, and no story/profile/sync data leaving the device. | All current CI gates pass; reload/re-entry remains idempotent; accepted import and failed network paths preserve local reading; account attachment still requires valid credentials. |
| P0-C — atomic release save and honest durability | Engine, Browser UI, QA, Security/Integration | [MOB #57](https://github.com/rebootos-sourcce/MOB/pull/57), head `a6a2fea416de80054ef9df9aff78a181b5b330d9`. An earlier run found five undo-fixture failures after readback verification was added. The fixture now binds a durable test store explicitly; new CI is in progress. | Throwing and silent writes both fail; a release/history snapshot uses one write, staged history rolls back on failure, retries do not duplicate events, and post-reload state matches the accepted result. |
| P1-A — canonical pattern contract and fixed set | Foundation Architect, Engine, Worker, Data/Product Steward, Security, QA | [Reboot-OS #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35), head `5060146c88f447e5aabe6643259b094b7d019f8b), is stacked on retention #34. Earlier CI exposed malformed SQL; the migration now has one terminator, one catalog table definition, and complete content-hash constraints. New server and smoke runs are queued. No approved exact 100-ID manifest was found in the inspected sources/history. | Migration and worker tests pass; exact 100 IDs and hash are read back; invalid side/phase/channel, duplicate source keys, stale hashes and frozen catalog edits are rejected; a fixed production set is absent until its stable IDs are approved. |
| P1-B — browser/server schema mapping | Foundation Architect, Engine, Worker, QA | Not started; separate browser profile v2 and Worker user v1 remain. | Document field authority and privacy boundaries; add versioned round-trip fixtures; explicitly test duplicate import semantics and export scope. Do not enable profile sync. |
| P1-C — deletion and retention | Security/Privacy, Worker, Infrastructure, QA | [Reboot-OS #34](https://github.com/rebootos-sourcce/Reboot-OS/pull/34), head `11f34225ab031ccaedf539e866e63319c10df117`: repository server and smoke checks were green in the last complete run; the separate Cloudflare Worker Build check failed. These are distinct signals and must not be conflated. | Table-by-table deletion/retention matrix; clock-controlled expiry tests; accurate deletion receipt; confirmed canonical deployment ownership and observable expiry enforcement. |
| P1-D — control behavior and accessibility | UI/UX, Art/Visual, QA, Content | Not started. | Every visible Alpha control works or is clearly disabled with a reason; keyboard/focus, reduced motion, 44px targets, 390px and 1600px layouts, retry and persistence states are evidenced. |
| P1-E — canonical publisher and release manifest | Infrastructure, QA, PM | In progress only as a dependency of P1-C; the alternate Cloudflare build failure remains distinct from the repository-owned test result. | One documented publisher per artifact; source SHA, worker SHA, migration state, required gates, deployment evidence and rollback recorded. No deploy from this follow-up. |

## Cross-seat integration rules

1. **One release-pattern contract:** Foundation Architecture and Data/Product Steward define stable identity, source kind, phase, side, six verb channels, catalog version, lifecycle and supersession. Engine and Worker consume the same contract. No row order or numeric count may stand in for set membership.
2. **One persistence vocabulary:** Browser UI and QA use only `saved`, `failed`, or `unknown` when supported by write/readback evidence. A click is not proof of completion.
3. **One privacy proof:** Security, Browser UI and Worker test request bodies on every path. Raw story, name, birth details and profile stay local; only the approved anonymous journey ID and completion checkpoints cross the boundary.
4. **One acceptance ledger:** PM and QA map every Alpha user-visible result to a required test, latest PR SHA, test outcome, dependency and remaining risk.
5. **Second review is adversarial:** after correctness review, a separate integration pass checks concurrency, idempotency, unknown catalog versions, storage failures, deletion, import/export, and whether a repeated regression would fail CI.
6. **Keep independent work moving:** do not block retention, local durability, or privacy review on the starter-set ID decision. Escalate only genuine product decisions.

## Owner decisions — ask only when the candidate evidence is ready

- **Starter-set membership:** no approved list was identified. Build the candidate ID/title table with source provenance and validity first; then ask the owner to approve the exact 100 stable IDs. Do not activate a set or choose the first 100 rows.
- **User-created patterns:** determine whether Alpha permits user-authored definitions or only person-specific imprints derived from their own story and validated by them. Ask once the schema map establishes the consequences.
- **Journey recovery:** decide whether cleared browser storage should restart the anonymous journey or Alpha needs a secure resume flow. No guessable anonymous-session readback is allowed.
- **Export scope:** after inventoried side-state is mapped, decide whether “export” means the current profile only or all promised portable state.

Already-set decisions are not reopened: profile sync off, billing off, crisis detector and aggregated Mirror/Sniffer deferred, and native Android/iOS packaging outside the browser MVP.

## Review and release ledger

No merge or production deployment is authorized by this document. All PRs above remain drafts while checks or acceptance evidence are incomplete. Each block must have a failing reproduction where feasible, a smallest complete patch, two recorded review passes, targeted and full affected tests, build/CI evidence, remaining-risk notes, and an updated final SHA before it can be closed.

**Readiness summary:** P0-A pending; P0-B pending final functional gate; P0-C pending CI after fixture correction; P1-A pending CI and owner-approved manifest; P1-B/P1-D not started; P1-C implementation review pending Cloudflare diagnosis; P1-E needs one-publisher/release-manifest verification.
