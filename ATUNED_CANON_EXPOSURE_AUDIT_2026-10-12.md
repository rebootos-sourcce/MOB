# ATÜNED Public Runtime Canon Exposure Audit

**Refresh:** 12 October 2026 UTC  
**Code PR:** [Reboot-OS #35](https://github.com/rebootos-sourcce/Reboot-OS/pull/35)  
**Current code head:** `39cde03898543aca4e4d3a33774095117a8526f7`  
**State:** Patch remains draft/open/unmerged. Exact-head server and smoke gates passed. External Cloudflare `Workers Builds: atuned-os` still fails. No production merge/deploy/migration, protected import, or gift activation was performed.

## Finding

Before this patch, `GET /v1/canon` returned the public runtime manifest and `GET /v1/canon/:table` could read any table named in that manifest. `CANON_TIER` was empty, so absent entries defaulted to tier zero. The source migration is generated from `atuned/data/canon.sqlite` and is separate from the protected `canon_vault.sqlite` reviewed here.

No current leak of the recovered protected vault is established. It was not shown to be the database behind the runtime public routes, and it has not been imported. The current finding is a public-runtime boundary and content-classification gap, not proof of an active protected-vault disclosure.

## What the patch protects

PR #35 freezes the current 127 runtime table names, manifest fingerprints, and declared row counts. Catalog reads omit names or metadata that are not in the frozen inventory; direct reads fail closed for unknown/changed entries and for an unexpected live row count. Regression tests cover an unlisted protected-like table, additive row-count drift, and metadata fingerprint drift.

Source manifest versus generated migration: 127/127 names, fingerprints, and declared counts matched in the checked inventory. This is metadata consistency, not a semantic approval of table contents. Because the patch uses a short fingerprint copied from source metadata and a row-count check, it does not independently detect all same-row-count content changes where metadata was not refreshed. Strengthen the generation/import path to recompute content hashes before any new source material is eligible for runtime.

## Current exact-head validation

- [Server workflow #38283599925](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38283599925): **147 tests passed, 0 failed** on `39cde03898543aca4e4d3a33774095117a8526f7`.
- [Smoke workflow #38283606361](https://github.com/rebootos-sourcce/Reboot-OS/actions/runs/38283606361): **840 passed, 0 failed**; voice surface and both evidence-only source locator self-tests passed; source and PDF line locator index artifacts built; 44 screenshot surfaces captured.
- The server workflow successfully dry-ran `wrangler deploy --dry-run` under both candidate names `atuned-api` and `atuned-os`. It did not deploy. A read-only health GET returned HTTP 200 at `https://atuned-api.lance-o-powell.workers.dev/v1/health` and 404 at `https://atuned-os.lance-o-powell.workers.dev/v1/health`. This supports checking the Cloudflare service-name/root/config alignment but is not proof of the build-failure cause.
- The external Cloudflare check failed for build [0caff241-0bd3-453e-a86d-985e0b839726](https://dash.cloudflare.com/b34a8a4f24d5ac71f7b386c240a6da90/workers/services/view/atuned-os/production/builds/0caff241-0bd3-453e-a86d-985e0b839726). GitHub exposes zero annotations and no first failed step; an authenticated operator must obtain the actual build log. Do not bypass the check.

## Protected vault recovery — verified locally, not deployed

The earlier handoff statement that the SQLite vault was missing is superseded. A paginated Library inventory across 808 items located `canon_vault.sqlite` (3,346,432 bytes; SHA-256 `9c2cd7b610c1e7b1d056646047988b67d0f52368139952bcc2782b930056915e`). It was opened in read-only mode and returned `PRAGMA integrity_check = ok`, no foreign-key violations, no orphan statement/source/block references, and no block item-count mismatches.

Counts verified from the database: 2,900 canonical limiting-belief statements (all sniff-eligible), 2,700 canonical embodied truths (excluded from sniff matching), 72 exact-duplicate groups, 496 topics, four source records, 58 limiting blocks, 54 truth blocks and 52 paired 50/50 blocks. Its 2,900 FTS rows map to the 2,900 eligible limiting statements through rowid. Raw source-file size, MD5 and SHA-256 matched the vault metadata for all four recoverable source artifacts.

**Isolation rule:** preserve this vault as protected local/server-side source. Do not bundle its statement corpus or FTS index into the public client, import it into runtime tables, or write it to production/Supabase without source-authority classification, authenticated access controls, owner approval, and negative tests proving public endpoints cannot return it.

## Current remaining risk

1. All 127 current runtime entries still require source-authority and public-suitability classification, explicitly including `RARE` (“the vault patterns”). That label alone does not prove it was imported from this recovered database.
2. Strengthen public-canon verification so source/build code recomputes full content hashes rather than relying only on a short manifest fingerprint and row count.
3. No fixed starter-gift bank is approved: the 560-row work queue still contains zero stable product pattern IDs, zero owner-approved rows, zero reviewed line splits, and zero selected manifest members. The 100-per-nature requirement is not yet content-complete.
4. The current-release browser → Worker → Supabase write/read/reload journey remains 0/1 independently verified.
5. The recovered local gateway imports `source_service.SourceService`, which was not found in the Library or current Reboot-OS server source directory. It also lacks a complete trusted account-identity contract. It is not ready to deploy or port as-is.

## Remaining acceptance conditions

1. Obtain and resolve the current Cloudflare build’s first failing log step.
2. Preserve exact-head server, smoke and negative-access tests; investigate the target mismatch without bypassing Cloudflare checks.
3. Classify the 127 runtime table entries, resolve the `RARE` authority, and implement full content-fingerprint validation in the build/import path.
4. Keep the recovered vault local/server-only until access isolation is proven and import is explicitly approved.
5. Review source lines into stable, source-grounded IDs, sentence boundaries and correct release/reframe metadata; obtain explicit approval before creating or activating each exact 100-item category bank.
6. Prove a persisted current-release journey on a disposable, approved non-production environment.

**Measurements:** 127/127 metadata entries matched; 147/147 server tests passed; 840/840 smoke assertions passed; 44 screenshots captured; protected vault integrity passed; all four source hashes matched; 0 approved gift IDs.  
**Confidence:** 0.98 in the local vault integrity/source-hash checks and the observed repository test outcomes; deployed isolation and overall release readiness remain unverified.