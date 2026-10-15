# ATUNED Cloudflare Read-only Probe — 13 October 2026

## Scope

Read-only verification from the exact-head Reboot-OS PR #35 CI run. No authenticated Cloudflare dashboard session was available, so this report does not claim to verify the dashboard's current service settings or the failed build's first-error logs.

## Verified evidence

- Reboot-OS PR #35 head: `48313941da1338e2cd0ec1d5d9cd4d9b2d5c6bdf`.
- Server workflow #38333447700 passed the server tests and both Wrangler dry runs (`atuned-api`, `atuned-os`); the workflow skipped credential mutation, migrations, and deployment because the run was on a non-main branch.
- The same workflow made read-only HTTP GET probes:
  - `https://atuned-api.lance-o-powell.workers.dev/v1/health` → HTTP 200.
  - `https://atuned-os.lance-o-powell.workers.dev/v1/health` → HTTP 404.
- The checked-in candidate `atuned/server/wrangler.toml` names the Worker `atuned-api`; `.github/workflows/server.yml` on the candidate branch explicitly dry-runs both candidate names to avoid guessing which service the dashboard's `atuned-os` refers to.
- MOB `.github/workflows/deploy.yml` and Reboot-OS `.github/workflows/web.yml` both publish to Cloudflare Pages project `atuned`, branch `main`, with different site bundles. This is a production publishing collision risk until an owner confirms the intended single publisher and target output.
- The external Cloudflare check for PR #35 remains failed on build `0b27be84-ebb9-4d97-b20b-eba999fdcebc`. The failed check exposes no annotations in GitHub. Prior snapshots of the build log and current settings disagree about `wrangler preview` versus `wrangler deploy`; authenticated inspection is required.

## Acceptance gates still open

1. Authenticated operator confirms the Cloudflare account, service type, Git repository, production/preview branches, root directory, build/deploy command, asset binding, and custom domains for `atuned-os`.
2. Owner designates exactly one production publisher for Pages project `atuned`; verify that its deployed output contains the approved funnel and app paths.
3. Read back `ATUNED_API` from GitHub repository variables and verify that it points to the intended API Worker origin; compare with Worker CORS `ALLOWED_ORIGIN`.
4. After the target and ownership are confirmed, rerun the intended non-production build and verify the resulting host/path output. Do not add a `previews` block solely to silence an old command without confirming the current build target.
5. Keep the external build red and P0 open until evidence passes.

## Safety boundary

No merge, production deployment, migration, secret/variable change, database mutation, billing/profile-sync enablement, gift activation, or gift issuance was performed.
