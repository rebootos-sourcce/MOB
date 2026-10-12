# ATÜNED Public Runtime Canon Exposure Audit

**Snapshot:** 12 October 2026 UTC  
**Code PR:** [Reboot-OS #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35)  
**Code head at this snapshot:** `702c0be4a9cc1d7b98ec2865a3335143dd470d0a`  
**State:** Patch and regression test committed to the existing draft branch. Exact-head repository tests are queued at the last refresh; the external Cloudflare check failed again. No merge, production deploy, production migration or gift activation occurred.

## Finding

Before this patch, `atuned/server/src/index.js` exposed both `GET /v1/canon` and `GET /v1/canon/:table` as public routes. The catalog route returned all rows from `canon_manifest`; the table route returned rows for any name present in that manifest. `CANON_TIER` was empty, so absent entries defaulted to tier 0.

The runtime migration is generated from `atuned/data/canon.sqlite`. The protected `canon_vault.sqlite` described by local review docs is separate and was not found in the current workspace, Library search or checked repositories. This audit does **not** claim the protected vault was inspected or that a live vault leak was established.

## Cross-check

| Evidence | Result |
|---|---|
| `atuned/data/canon_tables/manifest.json`, original blob SHA `9cc010fac9b46e27e90594167de3ed5cdf89c680` | 127 entries |
| `atuned/server/migrations/0001_canon.sql`, original blob SHA `c1dd46a58836422295ae976da6314ef5031d1d53` | 127 inserted manifest entries |
| Name/fingerprint comparison | 127/127 matched; 0 mismatches |
| Owner-approved content classification of current runtime entries | Not established |
| Direct inspection of protected `canon_vault.sqlite` | Not possible in this workspace |

This cross-check verifies the current runtime table inventory metadata only. It is not evidence that each row is approved, privacy-classified or equivalent to the protected source vault.

## Patch applied on PR #35

Files changed:

- `atuned/server/src/index.js`
- `atuned/server/test/canon-public.test.mjs`

The Worker now holds a frozen inventory of the 127 currently known runtime table names, their manifest fingerprints and declared row counts. The public catalog omits entries that are absent from this inventory or whose fingerprint/count metadata differs. A direct table read returns a generic 404 for unlisted or metadata-drifted entries. Before returning table rows, the Worker checks the actual row count against the frozen expected count and returns 404 on mismatch.

Regression test cases cover:

1. A new protected-like table added to the manifest is omitted from the public catalog and cannot be read.
2. An extra row added to an existing table without a matching manifest update causes a 404.
3. A changed fingerprint for an existing table hides it from the catalog and blocks the table read.

The first exact-head smoke attempt failed because the new test fixture used nonexistent `i` and `value` columns for `canon_RARE`. Generated migration inspection confirmed the table columns are `b`, `q`, and `w`. The test was corrected and committed. The current exact-head server suite has passed 147/147; the smoke gates remain in progress. The latest Cloudflare check failed again, and its first failing step is not available through the GitHub check payload.

## Current exact-head validation

Current Reboot-OS PR #35 head: `702c0be4a9cc1d7b98ec2865a3335143dd470d0a`.

- [Server run #38279998569](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38279998569): queued at last refresh.
- [Smoke run #38279998550](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38279998550): queued at last refresh.
- [Smoke run #38280005952](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38280005952): queued at last refresh.
- [Cloudflare check #114914821653](https://github.com/rebootos-sourcce/Reboot-OS/runs/114914821653): failed; build [29417e44-e113-4b57-bbd2-0a882e388e65](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/29417e44-e113-4b57-bbd2-0a882e388e65); GitHub exposes 0 annotations and no first failing step. Authenticated dashboard logs are required.

The earlier smoke failure is a confirmed test-fixture defect, corrected in the present head. Do not describe the current patch as passing until the current run completes.

## Important limits

The manifest fingerprint is a 16-character value copied from canonical source metadata; the Worker does not recompute a full content hash. The row-count check catches additive row changes when stored metadata is unchanged, but an in-place value replacement that preserves row count and leaves the manifest SHA stale would not be detected by these checks alone. The import/build process must recalculate and verify data fingerprints, and must not hand-edit generated SQL or runtime rows.

The existing runtime manifest contains `RARE`, described as “the vault patterns”, with four records. That description requires explicit owner/source-authority review. It does not prove the table came from the separate protected SQLite vault, and its current presence is not owner approval of any additional source material.

## Remaining acceptance conditions

Before any protected source import or production activation:

1. Recover the original protected database and provenance artifacts. Do not reconstruct the vault.
2. Classify the semantics and source authority of all 127 current runtime tables, including `RARE`.
3. Complete CI on the exact current PR #35 head and diagnose Cloudflare failures from authenticated first-error logs.
4. Keep regression tests proving unlisted tables, metadata drift and additive row-count drift are not served.
5. Prove current-release browser → Worker → Supabase persistence and readback/reload on an approved non-production target.
6. Obtain explicit owner approval for stable pattern IDs and each fixed 100-pattern starter bank before creating an active manifest.

**Confidence:** 0.96 that the manifest/migration metadata matched before patch and the patch adds a fail-closed boundary for unlisted tables, metadata drift and additive row-count changes. Protected-vault isolation overall remains unverified pending recovery, semantic review and exact-head tests.
