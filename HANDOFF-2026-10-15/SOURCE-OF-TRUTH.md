# Source of truth and deployment ownership, verified 15 October 2026

The owner's directive of 15 October: MOB is production, Reboot-OS `atuned/`
is a separate development application, protect production first. This file
is the verified map that directive asked for. Every line names its evidence.
Reported facts that this session could not verify itself are marked so.

## The map

| | MOB | Reboot-OS, folder `atuned/` | Reboot-OS, folder `atuned/server` |
|---|---|---|---|
| What | The production application | A separate development application | The Worker `atuned-api`, the server both talk to |
| Repository, production branch | `rebootos-sourcce/MOB`, `main` | `rebootos-sourcce/Reboot-OS`, `main`; PR 54 on `copy-system-mirror-sweep-2026-10-14` | `rebootos-sourcce/Reboot-OS`, `main` |
| Build | `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh && ./funnel/BUILD-single.sh` | `python3 atuned/test/tools/build.py` (and `--check`) | none, Wrangler deploys `src/` |
| Tests | the gate list in `CLAUDE.md`, floors in `tests/floors.json` | `python3 atuned/test/smoke.py`, `atuned/test/quick.py` inside the build | `node --test test/*.test.mjs` |
| Deploy workflow | `.github/workflows/deploy.yml`, job `deploy`: `wrangler pages deploy deploy --project-name=atuned --branch=main`, then reads production back | `.github/workflows/web.yml`: `pages deploy atuned/web/dist --project-name=atuned --branch=main`. **Disabled on 15 October 20:57 UTC** (state `disabled_manually`) | `.github/workflows/server.yml`: `wrangler deploy` of the Worker, D1 migrations, live smoke |
| Cloudflare target | Pages project `atuned`, production branch `main`, serves atuned.world | The same Pages project and branch, which is the collision | Worker `atuned-api` at `atuned-api.lance-o-powell.workers.dev` |

## Production, verified

- atuned.world serves MOB main `ed5eca3` (11 October). Evidence: MOB deploy
  run 38169307942, job `deploy`, every step green, including "Cloudflare
  serves this commit in production", which reads the Pages API back.
- No later MOB deploy: runs on main since then are none (the 15 October
  runs are pull request events, and the deploy job does not run on those).
- No Reboot-OS publish since: `web.yml` run 38020152941 (10 October) failed
  at "publish to Pages"; run 38473125019 (13 October) was a pull request
  event with no publish step; no run since. The workflow is now disabled.
- **Verified from Cloudflare itself, 21:59 UTC**, by
  `.github/workflows/cloudflare-inspect.yml` (run 38813881872), which reads
  the account with the deploy job's own token: Pages project `atuned`,
  production branch `main`, domains `atuned.pages.dev` and `atuned.world`,
  canonical and latest production deployment both commit `ed5eca3`, created
  11 October 21:03 UTC. The last eight production deployments are all MOB
  main commits; nothing from Reboot-OS ever landed there.
- The merge of MOB PR 76 (`018bb70`, documents, agents and a test floor; no
  application source) started deploy run 38813550850 on main at 21:52 UTC.
  It finished green at every step, including "Cloudflare serves this commit
  in production". So atuned.world served `018bb70`: the same application
  source as `ed5eca3`, built fresh, under the new stamp.
- **Then the P0 fixes, 23:38 UTC.** MOB PR 78 merged as `4845f0d`; deploy run
  38823934780 green at every step, "Cloudflare serves this commit in
  production" success. atuned.world serves `4845f0d` now: the downloaded
  copy says why it cannot sign in, "diagnostic" is off the screen, the CQ
  and DQ key prints bare numbers, the Summary plate prints how much is
  measured and opens the figure with its range one tap down, the privacy
  draft names the first visit. Every gate green on that build (functional
  2622, golden 136 with one expected red, alpha journey 61, copy 151, design
  192, and the rest as the pull request records). PR 77 (`3e094f0`, the
  Cloudflare inspection workflow and this file) merged and deployed before
  it.

## The boundary, as of 15 October 20:57 UTC

1. Reboot-OS `web` workflow disabled (GitHub API, confirmed by reading its
   state back). No branch, push or hand start of it can publish.
2. Still open, for the owner: a Cloudflare token for Reboot-OS with Workers
   Scripts and D1 edit rights only, so the repository cannot publish to
   Pages even by hand with the current token. Then land only the `web.yml`
   part of Reboot-OS PR 47 (removes the publish step for good).
3. MOB side unchanged: it remains the one publisher.

## GitHub Actions, verified fresh at 20:57 UTC

- **Reboot-OS is blocked.** Runs 38806006312 (gate), 38805999235 (retention)
  and 38805999215 (shell), all 20:56 UTC, each one job, zero steps, no
  runner; the check annotation reads "The job was not started because an
  Actions budget is preventing further use." A rerun of the gate at 20:58
  died the same way. These are not test failures: nothing executed.
- **MOB is running.** Run 38806051770 (deploy workflow, pull request event
  for PR 76) started 20:57 UTC with 30 jobs on real runners and finished
  green. A fresh Reboot-OS dispatch at 21:25 (voice probe, run 38809741929)
  queued and then died with the same budget annotation.
- **Why they differ, verified:** `rebootos-sourcce/MOB` is public and
  `rebootos-sourcce/Reboot-OS` is private (GitHub API, 21:26 UTC). GitHub
  meters Actions minutes on private repositories only, so an exhausted
  spending limit stops Reboot-OS and leaves MOB running. The owner is a user
  account, not an organisation.
- **Owner action, exact:** sign in to github.com as `rebootos-sourcce`,
  click the profile picture at the top right, Settings, then in the left
  column Billing and plans, then Spending limits. Under Actions, read the
  monthly usage against the limit and raise the limit (or wait for the
  monthly reset). Then start any Reboot-OS workflow and confirm its job
  shows a runner name and steps. Making Reboot-OS public would also lift it,
  but that is a separate decision: the repository holds the server and the
  second application, and nothing in it should be a secret, yet it was made
  private on purpose.

## The voice

Verified again on 15 October 22:19 UTC, the first run after the budget was
raised: voice-probe run 38816357647 on Reboot-OS main, on a real runner,
"ask the live voice route what it needs: success". The earlier result,
voice-connect run 37970159266 on 9 October 17:59 UTC, green at every step
including "ask the live server for a line", still stands as the last time
real audio came back.

## GitHub Actions, after the budget

The owner raised the Actions budget at about 22:15 UTC. Reboot-OS runs
now get runners: the voice probe above, the KPI totals and Cloudflare read
back workflows, and the reruns on PR 54's head (`a39fdfb`): server, shell,
retention and the packaged UI build green; the gate red on its own browser
path (Chromium installed at `/opt/pw-browsers` for the quick smoke, the
voice surface gate then looking in Playwright's default cache), fixed on
the branch as `91a4180` by making the path the job's for every step. Gate
green on `91a4180` at 22:40 UTC (runs 38816882946 and 38816876956): Block 6
of the owner's handshake is closed. PR 54 stays a draft, unmerged.

## Stripe, wired at 23:32 UTC

The owner pasted `STRIPE_SECRET_KEY` (test mode) into Reboot-OS's GitHub
secrets at about 23:10 UTC. Reboot-OS PR 56 (`6f2d1bf`, merged) added
`stripe-setup.yml`, which made the three buyable tiers as prices under
lookup keys `atuned_tier_one`, `_two`, `_three`, the webhook endpoint at the
server's `/v1/billing/webhook` with the five events, a tagged customer portal
configuration, and put the key and the webhook signing secret into the
Worker (run 38823542810). `server.yml` now reads the price ids and the
portal configuration back from Stripe at every deploy when the GitHub
secrets are empty, and `createPortal` names the configuration. The deploy on
main (run 38824097767) was green at every step, and its live Stripe check
printed: "live Stripe setup check passed, test mode: three prices, the
webhook with all five events, and the customer portal". Checkout stays
closed: `STRIPE_BILLING_ENABLED` is `0` in `wrangler.toml`, and opening it
waits for the live key and the owner's word, because a test key open to
strangers would let anyone "pay" with a test card. Tier four has no price,
by the standing rule.

Reboot-OS PR 55 (`adf61cd`, merged) removed the Pages publish step from
`web.yml` for good and added the read only `kpi-totals.yml` and
`cloudflare-readback.yml` workflows.

## The KPI ladder, first read

Run 38816712806, 22:23 UTC, counts only, from the live database: sessions
opened 6,867 (6,866 in the last 7 days), ground chosen 14, tutorial done 6,
first release 6, release checked 4, joined to an account 5, completed 0,
safety stops 0. The first rung counts machines (a session is made on every
first open, and crawlers and automated checks open the page); the human
rungs start at "ground chosen". `KPI-READ-2026-10-15.md` beside this file
reads them out.

## The `atuned-os` Cloudflare build

- What is known: every Reboot-OS commit carries a check "Workers Builds:
  atuned-os" that fails, with a Cloudflare build link under
  `workers/services/view/atuned-os/production/builds/`. No file in either
  repository names a Worker `atuned-os` (`atuned/server/wrangler.toml` is
  `name = "atuned-api"`). The `atuned-api` build on the same commits passes.
  ChatGPT's control board (MOB PR 69) records `atuned-os /v1/health` as 404
  and `atuned-api /v1/health` as 200 on 13 October.
- Tried from here, 21:59 UTC, with MOB's Cloudflare token through
  `cloudflare-inspect.yml`: the token is Pages only. It lists no Workers,
  sees no zones, and every Workers, Workers Builds and custom domain call
  answers "No access" or "Authentication error". So `atuned-os` cannot be
  inspected or deleted from MOB. The workflow keeps a guarded delete step
  for the day that changes: it refuses unless the Worker is named exactly
  `atuned-os`, has no route, no custom domain and no binding that
  `atuned-api` lacks.
- **Read with Reboot-OS's own token at 22:23 UTC** (the budget was raised at
  22:15), by `.github/workflows/cloudflare-readback.yml` on branch
  `claude/kpi-and-cloudflare-readback`, run 38816712758:
  - `atuned-os` is a Worker, created 28 September, last deployed 15 October
    04:57:01 UTC by wrangler under the owner's email, two seconds before
    `atuned-api`'s own deployment at 04:57:21 and on the same minute as the
    14 October ones. That is the Workers Builds connection deploying it on
    every Reboot-OS push, which is why the check carries its name.
  - It has **no bindings at all** (no database, no secrets, no variables),
    where `atuned-api` has 27. It has no custom domain: the account wide
    custom domain list is empty. workers.dev is on for it.
  - **Not verifiable with either token:** zone routes on atuned.world. The
    Reboot-OS token sees the zone but "No access" on its routes; MOB's sees
    no zone. So whether `atuned-os` intercepts any path on atuned.world is
    the one fact the dashboard alone can show, and the directive's rule
    (verify dependencies before deleting) keeps the delete with the owner:
    dash.cloudflare.com, Workers and Pages, `atuned-os`, Settings, Domains
    and Routes. If that list is empty, Settings, bottom, Delete.
  - The same read showed the Reboot-OS token **cannot read Pages at all**
    ("Authentication error" on the project), so with the current tokens
    Reboot-OS could not publish over atuned.world even by hand. The
    boundary holds by token scope as well as by the disabled workflow.
  - Fourteen Workers exist in the account. One is named exactly `atuned`
    (2 September); it is not `atuned-os`, and nothing here touches it.
- **Owner action, in order:** dash.cloudflare.com, Workers and Pages, open
  `atuned-os` (not `atuned`, not `atuned-api`). Read Settings: Builds (which
  repository, which branch, root directory), Domains and Routes (must be
  none that name atuned.world), Variables and Secrets. If it is bound to
  Reboot-OS, has no route on atuned.world and no secret that `atuned-api`
  lacks, delete it from its Settings page, bottom, Delete. Then open
  `atuned` (Pages) and confirm the production deployment still names
  `ed5eca3`, and open atuned.world in a private window. Record what was
  deleted here.

## Reboot-OS PR 54

Head after this session's two pushes: `a39fdfb` on
`copy-system-mirror-sweep-2026-10-14`, a draft, unmerged, base `main`
(read back from the GitHub API at 21:33 UTC). The first commit, `a5d635c`,
restores parsing and boot (five source lines, both build files rebuilt,
`build.py --check` passes byte for byte); the full smoke then ran to its end
with 19 failures. The second, `a39fdfb`, resolves all 19 and the three that
surfaced behind them: locally `SMOKE TEST PASS 840 FAIL 0`, `ALL GREEN`,
exit 0. The list, with causes and where each fix landed, is
`PR54-TRIAGE-2026-10-15.md` in this folder. A third commit, `91a4180`,
fixed the gate workflow's browser path, and the gate ran green on it at
22:40 UTC. Block 6 is closed; the merge waits on the owner's word and on the
D1 canon re-seed noted in the triage.

## The gift bank, verified against the owner's research handshake

`GIFT-BANK-VERIFIED-2026-10-15.md` beside this file. Short form: every path
and pull request the handshake names exists where it says (the inventory and
crosswalk on Reboot-OS branch `alpha/p1-fixed-pattern-gift-contract-20261010`,
not on `main`; the validator on `feat/p0-gift-bank-validator-20261014`; the
12 October ruling in MOB `DECISIONS.md` on `docs/atuned-master-index-20261012`).
The six bank files exist in no branch of either repository and not in Drive.
The content that exists is the LET GO corpus (376 transcript and 184 PDF
source records, 239 index nodes, 150 candidates), the 11,700 belief lines of
the cards, and the Little Books volumes (nine pairs each for anxiety,
burnout and grief). Decision taken: build six candidate banks from the
corpus, anxiety first, each delivered for the owner's approval in the
validator's format; nothing issued until all six are approved and readback
is proven. The gift does not block alpha: a stranger still gets 100 releases
from the general catalogue.

## 16 October: the KPI count was the test gates, and both sides now stop it

- The first ladder read said 6,867 sessions opened against 14 grounds
  chosen. A breakdown by state, status, day and hour (kpi-totals.yml, run
  38828528547, then 38829869001) showed every session at ARRIVE and active,
  none past the door, opening by the hundred in the hours the gates ran and
  zero in the hours they did not. They were the browser gates: every one
  opens the app from a file, and from 9 October, when the first visit
  shipped, each opening posted a session to the live Worker. A file page's
  origin is `null`; the server only sets the CORS header and does not refuse,
  so the request ran, the browser refused to hand the answer back, the app
  never kept the session, and the next run made another.
- **Server, live at 00:29:56 UTC** (Reboot-OS PR 57, merge 025f057, deploy
  run 38829691194, every live smoke green): `POST /v1/funnel/session` answers
  403 to origin `null` before the rate limit and before any write. A request
  with no origin header and a request from the site are untouched. Test in
  `test/funnel.test.mjs`; 129 server tests pass.
- **App, merged at 01:18 UTC** (MOB PR 80, merge 3e3880b): `authFunnelStart`
  returns at once on a file page whose `AUTH_API` is still the production
  address (`AUTH_API_LIVE` beside it in `ui/auth.js`). A gate that points
  `AUTH_API` at its own stub still starts one; the copy gate names its stub
  as the server before the page's script runs (`tests/copy.js`). The
  production readback for that merge: deploy run 38834393508, "Cloudflare
  serves this commit in production" success, 01:39 UTC; `3e3880b` is what
  atuned.world serves.
- **KPI ladder** (Reboot-OS PR 58, merge f242313): the clean date is
  `2026-10-16T00:30:00Z`. The ladder prints "of them since the clean date"
  under "sessions opened" and says in one line that the total before it
  counts the test gates, not people. Last read before the clean date, at
  00:30 UTC: 6,984 opened, 0 since the clean date, ground chosen 14, tutorial
  done 6, first release 6, release checked 4, joined to an account 5.
- Local gates on the change: copy 151 passed, 0 failed (the guard made it
  fail first); golden, onboarding2, quit, reset, feedback, journey2,
  firstrelease, storage green; engine 5038 passed, 10 expected red. The
  functional gate failed one reload check in one run and three other reload
  checks in the next, a different set each time, with other work loading the
  same four cores; the practitioner reload passes three times in a row on the
  build and CI on a clean runner passed every gate (run 38832520942).

## 16 October: Stripe re-checked, the key is still test mode

The owner wrote that the live key was in. Checked, not asked: the server's
own check (server.yml, dispatch run 38831971807, 00:53 UTC) reads the GitHub
secret `STRIPE_SECRET_KEY`, which every deploy writes into the Worker, and
printed "live Stripe setup check passed, test mode". So the Worker is on a
test key (`sk_test_` or `rk_test_`); the earlier screenshot was a Stripe
sandbox, which only hands out test keys. The three prices, the webhook and
the portal all pass on it. Checkout stays closed (`STRIPE_BILLING_ENABLED=0`)
until the owner says "open checkout" (TEAM-REVIEW-2026-10-15.md line 361).
The owner has also ruled that nothing more is asked of him on Cloudflare,
GitHub or Stripe, so the `atuned-os` dashboard look above is withdrawn: the
Worker stays as it is, with no bindings and no custom domain, and the
boundary holds by token scope and the disabled workflow.

## 16 October: the anxiety gift bank candidate

`GIFT-BANK-ANXIETY-CANDIDATE-2026-10-16.md` and `giftbank/` beside this
file (MOB PR 81). 100 sentences in the owner's own dictated words from the
LET GO corpus, verbatim, each with its source record, a stable id and a
hash, in the validator's format; 82 ranked in reserve, 221 held with one
reason each. 2,470 distinct sentences in the corpus, 403 naming anxiety or
fear, 182 after the rules and a read-through. Nothing in the corpus sorts a
sentence by nature, so anxiety was decided by the words in the sentence: 39
use a core word (anxious, worry, nervous, panic, dread), 61 only a fear word.
Not approved. The validator refuses the set, as it must, on the three empty
approval fields, the five banks that do not exist yet and the empty nature
to track map, and on nothing about the content. The owner approves with the
one sentence at the bottom of the document, or names lines to swap.
