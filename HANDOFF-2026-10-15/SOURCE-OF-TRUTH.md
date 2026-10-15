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
- **Not verified from here:** the Pages project's own deployment list and
  the custom domain binding, which need a Cloudflare token this session does
  not hold. The owner can confirm at dash.cloudflare.com, Workers and Pages,
  `atuned`, Deployments: the newest production row should name MOB commit
  `ed5eca3`.

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
  for PR 76) started 20:57 UTC with 30 jobs on real runners, steps
  executing. So the block is not account wide in the same moment, or the
  limit moved between 20:56 and 20:57. The owner's step stands either way.
- **Owner action, exact:** github.com, profile picture, Settings, Billing
  and plans, Spending limits, Actions: read the limit and the usage, raise
  the limit. If `rebootos-sourcce` is an organisation, the same page from
  the organisation's Settings. Then rerun the Reboot-OS gate and confirm
  its job shows steps and a runner name.

## The voice

Reported historical result, not a current claim: voice-connect run
37970159266 on 9 October 17:59 UTC ended green at every step, including
"ask the live server for a line", which exits 0 only on real audio. The
probe cannot run today (Reboot-OS Actions blocked). Not re-verified.

## The `atuned-os` Cloudflare build

- What is known: every Reboot-OS commit carries a check "Workers Builds:
  atuned-os" that fails, with a Cloudflare build link under
  `workers/services/view/atuned-os/production/builds/`. No file in either
  repository names a Worker `atuned-os` (`atuned/server/wrangler.toml` is
  `name = "atuned-api"`). The `atuned-api` build on the same commits passes.
  ChatGPT's control board (MOB PR 69) records `atuned-os /v1/health` as 404
  and `atuned-api /v1/health` as 200 on 13 October.
- Not verified from here: its repository and branch linkage, routes,
  secrets, domains, and whether anything depends on it. This session has no
  Cloudflare access.
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

Head after this session's push: `a5d635c` on
`copy-system-mirror-sweep-2026-10-14`, a draft, unmerged, base `main`.
The commit restores parsing and boot (five source lines, both build files
rebuilt, `build.py --check` passes byte for byte). The full smoke then runs
to its end and reports 19 failures; the list, with causes and fixes as they
land, is `PR54-TRIAGE-2026-10-15.md` in this folder.
