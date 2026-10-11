# Alpha P0/P1 Execution Follow-up

Status date: 11 October 2026. Alpha is not ready to ship. All P0 work remains open until the combined candidate passes two gap-review passes and a fresh required test matrix on its exact final SHA.

## P0 execution order

| Block | Scope | Exit condition |
|---|---|---|
| P0-C, MOB #57 | Atomic release and history persistence, rollback, truthful failure state | Current-head engine and browser gates pass; failed saves leave no staged history row and do not report funnel checkpoint or ritual completion. |
| P0-B, MOB #56 | Quiz-import session, concurrent start coalescing, reload reuse, failure/retry, privacy | Current-head tests prove one session, durable credential readback, retry after rejection, and identifier-only traffic. |
| P0-A, MOB #59 | Blocking Alpha journey and required test matrix | Combined candidate passes Alpha journey with 0 failures and 0 expected-red, plus all required suites and workflow-lint mutation tests. Raise the Alpha assertion floor to the latest clean observed count. |

The exact integrated candidate SHA and test evidence are maintained in the [Dev 8 execution log](https://github.com/rebootos-sourcce/MOB/blob/dev8/development-log-20261010/DEV8-DEVELOPMENT-LOG-2026-10-10.md). Historical branch successes do not substitute for current combined-candidate evidence.

## P1 dependency board

| Block | Current boundary | Next condition |
|---|---|---|
| Profile import identity safety, MOB #60 | Idempotent same-ID import; conflicting content rejected before mutation | Resume after P0 close and rerun tests on the intended integration base. |
| Retention/deletion, Reboot-OS #34 | Repository-owned checks had passed earlier; external Cloudflare Workers Build was separately red | Diagnose the external build through authenticated access. Do not bypass it. |
| Starter catalog approval, Reboot-OS #35 | No exact owner-approved set of 100 stable IDs | Keep production starter grant disabled until a provenance-backed list is explicitly approved. |
| Browser/server profile mapping, Reboot-OS #36 | Browser and Worker profile contracts remain distinct | Document field authority and add versioned contract tests. Profile sync stays off. |

## Cross-contract rules

- Local record persistence is the authority for release completion. A release with an unconfirmed save must not count as a first-release checkpoint, ritual completion, or saved user answer.
- The anonymous funnel receives only its approved journey identifier and completion checkpoints. Raw story, name, birth details, and profile data remain local.
- Cross-pollination findings must name a concrete behavior, test, and expected value, or record no additional improvement found.
- Every P0 block needs primary tests, independent gap review pass 1, all must-fix patches with regression tests, independent gap review pass 2, and fresh complete tests on the new exact SHA.
- Keep billing off, profile sync off, unapproved starter grants off, and deployment skipped until the final go/no-go.
