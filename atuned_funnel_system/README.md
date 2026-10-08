# Atuned funnel system

**Current state:** the funnel schema is now applied to the live Supabase project, the Supabase repository has been proven with a real write/read/delete check, and client access to the funnel tables has been revoked. The application router is not yet calling `FunnelService` end to end.


Built from three handoff documents: `ATUNED_Master_Application_Graph_Funnel_TDD_v1.md`,
`ATUNED_Funnel_System_Implementation_TDD_v1.md` (both reviewed twice, `PLAN.md` section T,
`TASKS.md` round SE) and `ATUNED_Database_Production_Completion_TDD_v2.md` (reviewed three
times, `PLAN.md` section U, `TASKS.md` round SF, which corrected several real defects this
scaffold had in its first round, named in "What round SF fixed" below). This is a handoff
package for whoever (human or AI) attaches the funnel to a real backend. It is not live
code, it is not wired into `source.html`, `atuned_src/`, or `funnel/`, and it should not
be, until the decisions in "What this is not" below are made.

## What this is

- `src/domain.ts`: every type the funnel's own state needs, plus minimal
  reference shapes (marked `REFERENCE ONLY`) for the entities the real engine
  already owns.
- `src/stateMachine.ts`: the canonical state table and a pure
  `canTransition`/`assertTransition` pair. No I/O, no adapters, fully unit
  tested.
- `src/funnelConfig.ts`: the tier ladder and starting-ground list, copied from
  the numbers actually ruled and shipped (see the comment at the top of that
  file for exactly where each number comes from).
- `src/adapters.ts`: one interface per external authority (identity, pattern
  catalog, Source, reading, release, verification, entitlement, payment,
  persistence). Every interface's own doc comment names the real file in this
  repository it should call.
- `src/funnelService.ts`: the orchestration layer, the state machine plus the
  idempotency and accounting rules both TDDs call non-negotiable (no duplicate
  starter gift, no rerun charge, no client-granted entitlement, no silent
  state jump).
- `sql/0001_funnel.sql`: the initial Postgres migration for the nine tables the funnel owns.
- `sql/0002_funnel_concurrency_functions.sql`: the live concurrency helpers for event sequencing and atomic starter-gift persistence.
- `sql/0003_funnel_rls_hardening.sql`: the live RLS/client-privilege hardening migration.
- `tests/`: in-memory fakes for every adapter, plus a state-machine suite and
  a service suite covering exactly the invariants above. `npm test` compiles
  and runs all of it with Node's own built-in test runner. No test framework
  dependency; `typescript` and `@types/node` are the only two packages this
  needs.

Run it yourself before trusting it:

```sh
cd atuned_funnel_system
npm install
npm test
```

41 tests, 0 failures, as of the round this was built (round SG; see "What
round SG wired" below for what moved the count from 22).



### Idempotency replay block

Release idempotency now replays the exact stored result for a completed, byte-identical request instead of rejecting a completed retry. The stored result includes the returned session, release id, and consumed amount, so a retry does not execute the release engine or debit usage again. A different request hash still fails closed, and an in-progress claim still fails closed rather than running a second release.
\n## What round SF fixed

The Database Production Completion TDD v2's own "Pass 2: adversarial
implementation review" named defects in "the prior implementation package."
Checked against this scaffold's own first round rather than assumed: some
applied here directly, some did not (this scaffold already compiled and ran
its own tests under a stock Node runtime, for instance, which that pass's
finding 7 says a prior package could not). What did apply, and what changed:

- **Idempotency was read-then-execute-then-write, not atomic.** Two
  concurrent callers with the same key could both pass the check before
  either recorded it. `FunnelRepository.hasIdempotencyKey`/`recordIdempotencyKey`
  is gone; `claimIdempotencyKey`/`completeIdempotencyClaim` is an atomic
  claim instead (a real implementation needs a real unique constraint on
  `(scope_key, idempotency_key)` behind it, which `sql/0001_funnel.sql`'s
  `idempotency_claims` table now has). A key reused with a different request
  now throws `IDEMPOTENCY_HASH_MISMATCH` rather than silently replaying.
- **The starter gift was a bare `pattern_ids text[]` column.** Nothing
  enforced per-pattern uniqueness or a real reference to the pattern catalog.
  `starter_gift_items` is now one row per pattern, unique on `(gift_id,
  pattern_id)` and `(gift_id, position)`; `StarterGift.patternIds` is kept as
  a convenience projection, never the other way around. A `pattern_set_hash`
  is taken at issuance, so a later canon change can never silently
  reinterpret an already-issued gift.
- **Referral uniqueness didn't bind the grant.** A unique referral row
  proves the row is unique, not that the grant it describes was only issued
  once; two concurrent callbacks could still race past a plain status check.
  `issueReferralGrant` now claims an idempotency row keyed to the referral's
  own id under the `referral_grant` operation before it ever writes
  `grant_issued_at`.
- **No anonymous-session attachment security.** A funnel session id is not a
  secret, and nothing stopped it from being treated as sufficient proof to
  attach someone else's gift. `issueAttachmentChallenge`/`attachAccount` now
  require a credential issued to the same browser that ran the session,
  hashed at rest, expiring, and single-use (`attachment_challenges`).
- **Events carried no ordering.** `FunnelEvent` now carries a per-session
  `sequence` (monotonic, gap free) and an `eventVersion`, so two events that
  land in the same millisecond are still reconstructable in order.

Two real items this round did **not** build, named rather than silently
left out: the payment-webhook trust boundary (`PaymentAdapter.resolveWebhookEvent`
was already adapter-resolved rather than a bare client-supplied boolean, so
that specific finding did not apply here, but full provider signature
verification, renewal/refund/chargeback handling and out-of-order event
ordering are real, larger work, named as BLOCKED in `PLAN.md` section U); and
the free/paid allowance carry-forward, retention and RPO/RTO decisions the
new TDD's own section 48 says must never be invented by the receiving AI.

## What round SG wired

Round SF left every adapter as an interface with a comment naming the real
file it should call. Round SG, 4 October, actually called those real files,
in answer to "keep on the database wiring, it's got to be done today":

- **`src/engineHost.ts`.** `atuned_src/engine/core.js` keeps its state (the
  law and charge values for one person) in a module-level `const S = {...}`,
  which `CLAUDE.md` itself names as "the impure core" and marks "deliberately
  deferred." A plain `require('engine.js')` from a Node server would share
  that one object across every concurrent user, which is a real
  cross-person data leak, not a hypothetical one. `engineHost.ts` avoids it
  without rewriting the engine: it compiles `engine.js` once with Node's
  built-in `vm` module, then hands out a brand new, fully isolated copy of
  that state for every call with `vm.createContext()`. `tests/engineHost.test.ts`
  proves two of those isolated copies never see each other's data (one sets
  a value, the other reads the default, not the set value).
- **`src/realAdapters.ts`.** Real implementations, calling the real engine
  through `engineHost.ts`, for the adapters round SF left as interfaces
  only: `RealEntitlementAdapter` (reads the real `SIGHT`/`PLAN_PRICE` tables
  rather than a hand-copied second list), `RealReleaseAdapter` (calls the
  real `releaseWork`), `RealVerificationAdapter` (calls the real
  `releaseVerify`), `RealSourceAdapter` (calls the real `srcTurn`), and
  `RealIdentityAdapter` (a real HTTP client for the existing reboot-os
  Worker). Calling the real engine, instead of guessing at its shape from
  the TDDs, found two real bugs in this scaffold's own types before they
  could reach anyone: the TDDs' own English words for a verification answer
  ("improved," "changed," "unchanged," "worsened," "unclear") are not what
  the shipped engine actually accepts; its real list, in `practice.js`
  `RV_ANSWERS`, is five snake_case values (`feel_different`,
  `see_differently`, `something_moved`, `nothing_changed`, `not_sure`), and
  the real engine refused every call until `domain.ts`'s `VerificationStatus`
  type was corrected to match. Separately, the real engine's address ids
  must be actual numbers, not numeric-looking strings; `VerificationAdapter`
  did not have a field for that at all, so one was added
  (`addressIds?: number[]`), named as real, unfinished wiring rather than
  silently defaulted and left unmentioned (see that file's own comment:
  threading the real address id from the release step through to the verify
  step is not done yet, and defaults to address 1 so the call is real rather
  than skipped).
- **`sql/sqlite_schema.sql` and `src/sqliteRepository.ts`.** The open call
  named in "What this is not" below (Postgres/Supabase vs. the existing
  Worker's own store) is still open; this is not a third option. It is a
  real, fully working `FunnelRepository` against Node's own built-in
  `node:sqlite`, built because neither of the two real options can be stood
  up from inside this environment today (no Supabase account exists here;
  the Worker's own source is not part of this checkout), and the Database
  Production Completion TDD v2's own constraints (the atomic idempotency
  claim, the gift/item row count, the referral grant race) needed to be
  proven against an actual running database, not just asserted true in
  TypeScript against an in-memory fake. `tests/sqliteRepository.test.ts`
  runs against real, file-backed SQLite databases in a temp directory,
  including two tests that fire genuinely concurrent writes with
  `Promise.all` and check that the database's own constraints, not
  application logic, let only one win.

`npm test` now runs 41 tests (stateMachine 9, funnelService 13, engineHost
4, realAdapters 8, sqliteRepository 7), 0 failures, read off the run rather
than typed here from memory, per `CLAUDE.md`'s own rule on test counts.

## What is wired now

The persistence target is now Supabase/Postgres. The live project has migrations `0001_funnel`, `0002_funnel_concurrency_functions`, and `0003_funnel_rls_hardening`. The nine funnel tables exist, RLS is enabled, and `anon` and `authenticated` have no table privileges. The concurrency functions are executable only by `service_role`.

A real funnel session row was inserted, read back, and deleted through the Supabase REST boundary as a proof of the server-side repository path.


### Persistence concurrency block

Migration `0004_funnel_repository_concurrency.sql` is applied to Supabase and source-controlled. It replaces the session read-then-write check with an atomic compare-and-swap function, makes attachment credentials single-use at the database boundary, adds a natural primary key to `starter_gift_items`, and removes the unsafe empty-ledger fallback of 1000.

Review pass 3 checked the live migration chain and Supabase advisors after the hardening. Migration `0004_funnel_repository_concurrency` is present. The performance advisor now reports only pre-traffic unused-index INFO findings; the previous no-primary-key finding is gone. The security advisor reports the intentional server-only RLS/no-policy state, while direct grant checks confirm `anon` and `authenticated` cannot read the funnel tables.\n\nReview pass 2 checked the source migration, repository implementation, and live function definitions for parity. The SQL functions are `SECURITY DEFINER` with an empty search path and are executable only by `service_role`; the application repository calls the new RPCs and no longer performs the unsafe direct PATCH/read-before-write operations.\n\nA live SQL contract check passed: create session, advance version, reject stale version, claim an attachment challenge once, reject the second claim, verify the starter-gift primary key, then clean up the test rows.

The persistence block was reviewed three times after the live change: live migration history and schema, source migration parity, and final repository-tree/source-of-truth verification. The Supabase security advisor now reports the expected `RLS enabled, no policy` informational findings for these server-only tables; the important access check is the actual role grants, which are denied to `anon` and `authenticated`.


The application is **not yet end to end wired**: the existing Cloudflare Worker has not yet exposed the funnel service methods, and the Worker does not yet construct the canonical `createSupabaseFunnelService(...)` runtime.

The remaining backend integration is therefore application wiring, not a persistence-provider decision.

## What is not wired yet

**The existing application router is not yet calling the funnel service.** Both source documents assume a Node/TypeScript service layer in front of Postgres/Supabase with row-level security. The current application remains a static HTML product with a host-free engine and an existing Cloudflare Worker network seam. Supabase is now the chosen persistence target for the funnel.

`FunnelRepository` remains the application boundary. `SupabaseFunnelRepository` is the production persistence implementation; the SQLite repository remains a test/proof implementation and is not a competing production target.

**Not a second Source, release or pattern engine.** `SourceAdapter`,
`ReleaseAdapter` and `VerificationAdapter` are written as thin interfaces on
purpose. The real logic already exists and is host-free JavaScript, which
means it is very close to callable from a Node process directly:

| Adapter | Real file to call |
|---|---|
| `SourceAdapter.analyzeStory` | `atuned_src/engine/sourceai.js` (`srcTurn`, `srcHear`, `srcRung`, `srcDims`, `srcNext`) |
| `ReleaseAdapter.executeRelease` / `rerun` | `atuned_src/engine/compute.js` (`releaseWork`, `lawLift`) and `atuned_src/engine/journey.js` |
| `VerificationAdapter.verify` | `atuned_src/engine/journey.js` `releaseVerify()`, against the five answers already in `atuned_src/engine/practice.js` `RV_ANSWERS` |
| `EntitlementAdapter` | `atuned_src/engine/plan.js` (`SIGHT`, `PLAN_PRICE`) plus this scaffold's own usage ledger |
| `IdentityAdapter.requireUserId` | the existing reboot-os Worker (`atuned_src/ui/auth.js`'s `AUTH_API`); needs one new server-callable endpoint, not a new identity system |
| `PaymentAdapter` | Stripe, per `STRIPE-API-STEPS.md` / `STRIPE-SETUP.md` at the repo root, which already describe the account side of this |

The default plan for whoever attaches this should be "import the real engine
file and call its real function," not "port the logic into TypeScript a
second time." Both TDDs name this as a non-negotiable rule themselves (no
parallel intelligence engine); it is not a stylistic preference here.

**One real conflict, deliberately not resolved silently.** Both source
documents say, in places, that reading/sight is not gated by tier ("reading
visibility is not gated by tier," "sight is not for sale, new ground is").
That was the product's own 19 September rule, and the owner reversed it
himself on 1 October: free sees the 112 addresses, domains, archetypes, laws
and shadow; tier one adds saboteurs; tier two adds complexes and the
Kundalini; tier three and four add hyper-complexes, character and the point
cloud (`DECISIONS.md`, "Sight by tier," round OK). He reconfirmed this again
directly, round SD, 4 October: "don't change the structure, don't change the
staircase." `domain.ts`'s `SightLevel` type and `EntitlementAdapter.getSightLevel`
exist because of that live rule, against the two TDDs' own text. If whoever
reads this disagrees that the staircase should stay, that is a question for
the product owner, not something to silently resolve either way in code.

**RLS hardening is now applied.** `0003_funnel_rls_hardening.sql` removes the initial public read policies and revokes table privileges from `anon`, `authenticated`, and `public`. The funnel remains server-only through the service role. This is a stronger boundary than the initial `0001` policies and is now the live state.

## Suggested next steps for whoever attaches this

Round SG moved steps 3 to 5 below from "implement" to "already real, finish
the remaining named gaps." What is left:

1. Decide the persistence target (Postgres/Supabase vs. the existing
   Worker's own store): the one open call named above. `sqliteRepository.ts`
   is real, proven, working code, not a submission for this slot; it exists
   so the decision can be made on its own schedule without blocking proof
   that the repository contract is correct.
2. Once decided, either point a real Postgres/Worker-store implementation at
   `sql/0001_funnel.sql`'s schema, or, if SQLite-on-D1 is the real answer,
   confirm `sqliteRepository.ts` against Cloudflare D1's own SQLite dialect
   (D1 is SQLite-compatible but not identical; this was built and tested
   against Node's own `node:sqlite`, not D1 itself).
3. **`IdentityAdapter`** (`src/realAdapters.ts`'s `RealIdentityAdapter`) is a
   real, ready HTTP client. It needs exactly one thing to work: a
   `POST /v1/auth/whoami` route added to the existing reboot-os Worker
   (`atuned_src/ui/auth.js`'s `AUTH_API`) that takes a bearer token and
   returns `{ userId }`. That route does not exist on the Worker today; this
   repository cannot add it, since the Worker's own source is not part of
   this checkout.
4. **`SourceAdapter`, `ReleaseAdapter`, `VerificationAdapter`**
   (`RealSourceAdapter`, `RealReleaseAdapter`, `RealVerificationAdapter`) call
   the real engine functions, proven against the real `engine.js` via
   `engineHost.ts`. Two real gaps remain, both named in `realAdapters.ts`'s
   own comments rather than hidden: (a) these three adapters need a real
   person's profile (`engine.S.law`/`S.charge`) passed in and the updated
   profile persisted back out, through the `context.profile` /
   `context.updatedProfile` convention documented there, and no server-side
   profile store exists yet (today the profile lives only in each person's
   own browser); (b) `RealVerificationAdapter` needs the real numeric
   address id the release step worked, threaded through from
   `RealReleaseAdapter`, which this round did not wire and defaulted to
   address 1 instead of leaving broken.
5. **`EntitlementAdapter`** (`RealEntitlementAdapter`) already reads the real
   `SIGHT`/`PLAN_PRICE` tables straight off `engine.js` through
   `engineHost.ts`, so there is no second copy of those numbers left to
   drift. What remains is wiring its per-user state (today it always
   returns the free tier) to wherever entitlements end up persisted, once
   step 1 is decided.
6. Implement `PaymentAdapter` against the real Stripe setup.
7. Expose `FunnelService`'s methods through the application's own existing
   router (do not add a second HTTP framework, per the Master TDD's own
   rule).
8. Run `npm test` after every adapter lands; the fakes in `tests/test-doubles.ts`
   should be swapped for the real implementations in an integration pass once
   each adapter exists, not kept as the permanent test suite.
