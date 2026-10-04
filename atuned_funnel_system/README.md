# Atuned funnel system scaffold

Built from two handoff documents: `ATUNED_Master_Application_Graph_Funnel_TDD_v1.md` and
`ATUNED_Funnel_System_Implementation_TDD_v1.md` (both reviewed twice against the real,
shipped product before anything here was written; the full review is in the main
repo's `PLAN.md`, section T, and `TASKS.md`, round SE). This is a handoff package for
whoever (human or AI) attaches the funnel to a real backend. It is not live code, it
is not wired into `source.html`, `atuned_src/`, or `funnel/`, and it should not be,
until the decisions in "What this is not" below are made.

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
- `sql/0001_funnel.sql`: a Postgres-flavoured migration for the six tables
  the funnel owns, offered, not mandatory (see "What this is not").
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

18 tests, 0 failures, as of the round this was built.

## What this is not

**Not wired to a real backend, because the product does not have one yet in
the shape these TDDs assume.** Both source documents assume a Node/TypeScript
service layer in front of Postgres/Supabase with row-level security. The real
product today is one static HTML file (`source.html`) with a completely
host-free engine (`atuned_src/engine/*.js`, enforced by `hostfree.py`, no
`document`, `window`, `fetch` anywhere in it) and exactly one existing network
seam: a Cloudflare Worker at `atuned-api.lance-o-powell.workers.dev`
(`atuned_src/ui/auth.js`) that already handles sign up, sign in, sign out and
reading back a person's plan. There is no Postgres or Supabase wired in
anywhere. `DECISIONS.md` in the main repo still has "Cloudflare vs Supabase"
open as the owner's own call.

So: `FunnelRepository` is an interface for exactly this reason. `sql/0001_funnel.sql`
is the Postgres path, offered in case that is the direction chosen; if the
existing Worker and its own store (D1, KV, Durable Objects, whatever it
already uses) is kept instead, write a `FunnelRepository` implementation
against that and nothing in `funnelService.ts` changes.

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

**Not hardened.** The RLS policies in `sql/0001_funnel.sql` are a starting
point, explicitly flagged in the file's own comments as needing a real
hardening pass before production, exactly as the Implementation TDD's own
step 5 says ("harden RLS before production").

## Suggested next steps for whoever attaches this

1. Decide the persistence target (Postgres/Supabase vs. the existing
   Worker's own store): the one open call named above.
2. Implement `FunnelRepository` against that choice.
3. Implement `IdentityAdapter` against the existing reboot-os Worker (one new
   endpoint).
4. Implement `SourceAdapter`, `ReleaseAdapter`, `VerificationAdapter` by
   requiring the real engine files, per the table above, not by
   reimplementing their logic.
5. Implement `EntitlementAdapter` against `engine/plan.js`, keeping
   `funnelConfig.ts`'s numbers in sync with it (ideally generate one from the
   other at build time).
6. Implement `PaymentAdapter` against the real Stripe setup.
7. Expose `FunnelService`'s methods through the application's own existing
   router (do not add a second HTTP framework, per the Master TDD's own
   rule).
8. Run `npm test` after every adapter lands; the fakes in `tests/test-doubles.ts`
   should be swapped for the real implementations in an integration pass once
   each adapter exists, not kept as the permanent test suite.
